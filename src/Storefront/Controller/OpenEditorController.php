<?php declare(strict_types=1);

namespace MnkysDevTools\Storefront\Controller;

use MnkysDevTools\Service\DevToolsConfigService;
use MnkysDevTools\Service\EditorService;
use Shopware\Storefront\Controller\StorefrontController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route(defaults: ['_routeScope' => ['storefront']])]
class OpenEditorController extends StorefrontController
{
    public function __construct(
        private readonly EditorService $editorService,
        private readonly DevToolsConfigService $config
    ) {}

    /**
     * Open a template file in the configured editor
     */
    #[Route(
        path: '/devtools/open-editor',
        name: 'frontend.devtools.open-editor',
        methods: ['GET'],
        defaults: ['XmlHttpRequest' => true]
    )]
    public function openEditor(Request $request): JsonResponse
    {
        // Security: Only allow in dev mode
        if (!$this->config->isDevEnvironment()) {
            return new JsonResponse([
                'success' => false,
                'error' => 'DevTools is only available in development mode'
            ], Response::HTTP_FORBIDDEN);
        }

        // Check if DevTools is enabled
        if (!$this->config->isEnabled()) {
            return new JsonResponse([
                'success' => false,
                'error' => 'DevTools is not enabled'
            ], Response::HTTP_FORBIDDEN);
        }

        $file = $request->query->get('file');
        $line = (int) $request->query->get('line', 1);

        if (!$file) {
            return new JsonResponse([
                'success' => false,
                'error' => 'No file specified'
            ], Response::HTTP_BAD_REQUEST);
        }

        // Validate line number
        if ($line < 1) {
            $line = 1;
        }

        // Resolve the template path to an absolute file path
        $absolutePath = $this->editorService->resolveTemplatePath($file);

        if (!$absolutePath) {
            return new JsonResponse([
                'success' => false,
                'error' => 'Could not resolve template path: ' . $file
            ], Response::HTTP_NOT_FOUND);
        }

        if (!file_exists($absolutePath)) {
            return new JsonResponse([
                'success' => false,
                'error' => 'File not found: ' . $absolutePath
            ], Response::HTTP_NOT_FOUND);
        }

        // Security: Validate the path is within allowed directories
        if (!$this->editorService->isPathAllowed($absolutePath)) {
            return new JsonResponse([
                'success' => false,
                'error' => 'Access denied to file path'
            ], Response::HTTP_FORBIDDEN);
        }

        // Generate editor URL for fallback
        $editorUrl = $this->editorService->getEditorUrl($absolutePath, $line);

        // Try to open the file directly via shell command
        $opened = $this->editorService->openFile($absolutePath, $line);

        return new JsonResponse([
            'success' => $opened,
            'file' => $absolutePath,
            'line' => $line,
            'editorUrl' => $editorUrl,
            'message' => $opened 
                ? 'File opened in editor' 
                : 'Use the editor URL to open the file manually'
        ]);
    }

    /**
     * Get DevTools status and configuration
     */
    #[Route(
        path: '/devtools/status',
        name: 'frontend.devtools.status',
        methods: ['GET'],
        defaults: ['XmlHttpRequest' => true]
    )]
    public function status(): JsonResponse
    {
        return new JsonResponse([
            'enabled' => $this->config->isEnabled(),
            'devMode' => $this->config->isDevEnvironment(),
            'editor' => $this->config->getEditor(),
        ]);
    }
}
