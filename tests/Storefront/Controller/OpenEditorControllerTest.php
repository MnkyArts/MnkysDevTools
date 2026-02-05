<?php declare(strict_types=1);

namespace MnkysDevTools\Tests\Storefront\Controller;

use MnkysDevTools\Service\DevToolsConfigService;
use MnkysDevTools\Service\EditorService;
use MnkysDevTools\Service\TemplateInspectorService;
use MnkysDevTools\Storefront\Controller\OpenEditorController;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class OpenEditorControllerTest extends TestCase
{
    private MockObject&EditorService $editorService;
    private MockObject&DevToolsConfigService $config;
    private MockObject&TemplateInspectorService $templateInspector;

    protected function setUp(): void
    {
        $this->editorService = $this->createMock(EditorService::class);
        $this->config = $this->createMock(DevToolsConfigService::class);
        $this->templateInspector = $this->createMock(TemplateInspectorService::class);
    }

    private function createController(): OpenEditorController
    {
        return new OpenEditorController(
            $this->editorService,
            $this->config,
            $this->templateInspector
        );
    }

    // ==================== openEditor() ====================

    public function testOpenEditorReturnsForbiddenInProduction(): void
    {
        $this->config
            ->method('isDevEnvironment')
            ->willReturn(false);

        $controller = $this->createController();
        $request = new Request(['file' => '@Storefront/test.html.twig']);
        
        $response = $controller->openEditor($request);

        $this->assertSame(Response::HTTP_FORBIDDEN, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertFalse($data['success']);
        $this->assertStringContainsString('development mode', $data['error']);
    }

    public function testOpenEditorReturnsForbiddenWhenDisabled(): void
    {
        $this->config
            ->method('isDevEnvironment')
            ->willReturn(true);
        $this->config
            ->method('isEnabled')
            ->willReturn(false);

        $controller = $this->createController();
        $request = new Request(['file' => '@Storefront/test.html.twig']);
        
        $response = $controller->openEditor($request);

        $this->assertSame(Response::HTTP_FORBIDDEN, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertFalse($data['success']);
        $this->assertStringContainsString('not enabled', $data['error']);
    }

    public function testOpenEditorReturnsBadRequestWithoutFile(): void
    {
        $this->config
            ->method('isDevEnvironment')
            ->willReturn(true);
        $this->config
            ->method('isEnabled')
            ->willReturn(true);

        $controller = $this->createController();
        $request = new Request();
        
        $response = $controller->openEditor($request);

        $this->assertSame(Response::HTTP_BAD_REQUEST, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertFalse($data['success']);
        $this->assertStringContainsString('No file specified', $data['error']);
    }

    public function testOpenEditorReturnsNotFoundForUnresolvablePath(): void
    {
        $this->config
            ->method('isDevEnvironment')
            ->willReturn(true);
        $this->config
            ->method('isEnabled')
            ->willReturn(true);
        $this->editorService
            ->method('resolveTemplatePath')
            ->willReturn(null);

        $controller = $this->createController();
        $request = new Request(['file' => '@Storefront/non-existent.html.twig']);
        
        $response = $controller->openEditor($request);

        $this->assertSame(Response::HTTP_NOT_FOUND, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertFalse($data['success']);
        $this->assertStringContainsString('Could not resolve', $data['error']);
    }

    public function testOpenEditorReturnsForbiddenForDisallowedPath(): void
    {
        $tempFile = sys_get_temp_dir() . '/test_' . uniqid() . '.twig';
        file_put_contents($tempFile, 'test');

        $this->config
            ->method('isDevEnvironment')
            ->willReturn(true);
        $this->config
            ->method('isEnabled')
            ->willReturn(true);
        $this->editorService
            ->method('resolveTemplatePath')
            ->willReturn($tempFile);
        $this->editorService
            ->method('isPathAllowed')
            ->willReturn(false);

        $controller = $this->createController();
        $request = new Request(['file' => '@Storefront/test.html.twig']);
        
        $response = $controller->openEditor($request);

        unlink($tempFile);

        $this->assertSame(Response::HTTP_FORBIDDEN, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertFalse($data['success']);
        $this->assertStringContainsString('Access denied', $data['error']);
    }

    public function testOpenEditorReturnsSuccessResponse(): void
    {
        $tempFile = sys_get_temp_dir() . '/test_' . uniqid() . '.twig';
        file_put_contents($tempFile, 'test');

        $this->config
            ->method('isDevEnvironment')
            ->willReturn(true);
        $this->config
            ->method('isEnabled')
            ->willReturn(true);
        $this->editorService
            ->method('resolveTemplatePath')
            ->willReturn($tempFile);
        $this->editorService
            ->method('isPathAllowed')
            ->willReturn(true);
        $this->editorService
            ->method('getEditorUrl')
            ->willReturn('vscode://file/' . urlencode($tempFile) . ':10');
        $this->editorService
            ->method('openFile')
            ->willReturn(true);

        $controller = $this->createController();
        $request = new Request(['file' => '@Storefront/test.html.twig', 'line' => '10']);
        
        $response = $controller->openEditor($request);

        unlink($tempFile);

        $this->assertSame(Response::HTTP_OK, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertSame($tempFile, $data['file']);
        $this->assertSame(10, $data['line']);
        $this->assertArrayHasKey('editorUrl', $data);
    }

    public function testOpenEditorNormalizesNegativeLineNumber(): void
    {
        $tempFile = sys_get_temp_dir() . '/test_' . uniqid() . '.twig';
        file_put_contents($tempFile, 'test');

        $this->config
            ->method('isDevEnvironment')
            ->willReturn(true);
        $this->config
            ->method('isEnabled')
            ->willReturn(true);
        $this->editorService
            ->method('resolveTemplatePath')
            ->willReturn($tempFile);
        $this->editorService
            ->method('isPathAllowed')
            ->willReturn(true);
        $this->editorService
            ->expects($this->once())
            ->method('getEditorUrl')
            ->with($tempFile, 1); // Line should be normalized to 1
        $this->editorService
            ->method('openFile')
            ->willReturn(false);

        $controller = $this->createController();
        $request = new Request(['file' => '@Storefront/test.html.twig', 'line' => '-5']);
        
        $response = $controller->openEditor($request);

        unlink($tempFile);

        $data = json_decode($response->getContent(), true);
        $this->assertSame(1, $data['line']);
    }

    public function testOpenEditorReturnsMessageWhenFileNotOpenedDirectly(): void
    {
        $tempFile = sys_get_temp_dir() . '/test_' . uniqid() . '.twig';
        file_put_contents($tempFile, 'test');

        $this->config
            ->method('isDevEnvironment')
            ->willReturn(true);
        $this->config
            ->method('isEnabled')
            ->willReturn(true);
        $this->editorService
            ->method('resolveTemplatePath')
            ->willReturn($tempFile);
        $this->editorService
            ->method('isPathAllowed')
            ->willReturn(true);
        $this->editorService
            ->method('getEditorUrl')
            ->willReturn('vscode://file/test:1');
        $this->editorService
            ->method('openFile')
            ->willReturn(false); // Shell exec disabled or failed

        $controller = $this->createController();
        $request = new Request(['file' => '@Storefront/test.html.twig']);
        
        $response = $controller->openEditor($request);

        unlink($tempFile);

        $data = json_decode($response->getContent(), true);
        $this->assertFalse($data['success']);
        $this->assertStringContainsString('editor URL', $data['message']);
    }

    // ==================== getBlockInfo() ====================

    public function testGetBlockInfoReturnsForbiddenInProduction(): void
    {
        $this->config
            ->method('isDevEnvironment')
            ->willReturn(false);

        $controller = $this->createController();
        $request = new Request(['template' => '@Storefront/test.html.twig', 'block' => 'content']);
        
        $response = $controller->getBlockInfo($request);

        $this->assertSame(Response::HTTP_FORBIDDEN, $response->getStatusCode());
    }

    public function testGetBlockInfoReturnsForbiddenWhenDisabled(): void
    {
        $this->config
            ->method('isDevEnvironment')
            ->willReturn(true);
        $this->config
            ->method('isEnabled')
            ->willReturn(false);

        $controller = $this->createController();
        $request = new Request(['template' => '@Storefront/test.html.twig', 'block' => 'content']);
        
        $response = $controller->getBlockInfo($request);

        $this->assertSame(Response::HTTP_FORBIDDEN, $response->getStatusCode());
    }

    public function testGetBlockInfoReturnsBadRequestWithoutTemplate(): void
    {
        $this->config
            ->method('isDevEnvironment')
            ->willReturn(true);
        $this->config
            ->method('isEnabled')
            ->willReturn(true);

        $controller = $this->createController();
        $request = new Request(['block' => 'content']);
        
        $response = $controller->getBlockInfo($request);

        $this->assertSame(Response::HTTP_BAD_REQUEST, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertStringContainsString('Missing required parameters', $data['error']);
    }

    public function testGetBlockInfoReturnsBadRequestWithoutBlock(): void
    {
        $this->config
            ->method('isDevEnvironment')
            ->willReturn(true);
        $this->config
            ->method('isEnabled')
            ->willReturn(true);

        $controller = $this->createController();
        $request = new Request(['template' => '@Storefront/test.html.twig']);
        
        $response = $controller->getBlockInfo($request);

        $this->assertSame(Response::HTTP_BAD_REQUEST, $response->getStatusCode());
    }

    public function testGetBlockInfoReturnsNotFoundWhenTemplateInspectorReturnsError(): void
    {
        $this->config
            ->method('isDevEnvironment')
            ->willReturn(true);
        $this->config
            ->method('isEnabled')
            ->willReturn(true);
        $this->templateInspector
            ->method('getBlockInfo')
            ->willReturn(['error' => 'Template not found']);

        $controller = $this->createController();
        $request = new Request(['template' => '@Storefront/test.html.twig', 'block' => 'content']);
        
        $response = $controller->getBlockInfo($request);

        $this->assertSame(Response::HTTP_NOT_FOUND, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertSame('Template not found', $data['error']);
    }

    public function testGetBlockInfoReturnsSuccessWithBlockData(): void
    {
        $blockInfo = [
            'block' => 'content',
            'template' => '@Storefront/test.html.twig',
            'absolutePath' => '/var/www/html/templates/test.html.twig',
            'line' => 10,
            'hierarchy' => [],
            'source' => [],
            'blocks' => [],
        ];

        $this->config
            ->method('isDevEnvironment')
            ->willReturn(true);
        $this->config
            ->method('isEnabled')
            ->willReturn(true);
        $this->templateInspector
            ->method('getBlockInfo')
            ->willReturn($blockInfo);
        $this->editorService
            ->method('getEditorUrl')
            ->willReturn('vscode://file/test:10');

        $controller = $this->createController();
        $request = new Request(['template' => '@Storefront/test.html.twig', 'block' => 'content', 'line' => '10']);
        
        $response = $controller->getBlockInfo($request);

        $this->assertSame(Response::HTTP_OK, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['success']);
        $this->assertArrayHasKey('data', $data);
        $this->assertSame('content', $data['data']['block']);
        $this->assertArrayHasKey('editorUrl', $data['data']);
    }

    public function testGetBlockInfoHandlesExceptionGracefully(): void
    {
        $this->config
            ->method('isDevEnvironment')
            ->willReturn(true);
        $this->config
            ->method('isEnabled')
            ->willReturn(true);
        $this->templateInspector
            ->method('getBlockInfo')
            ->willThrowException(new \RuntimeException('Unexpected error'));

        $controller = $this->createController();
        $request = new Request(['template' => '@Storefront/test.html.twig', 'block' => 'content']);
        
        $response = $controller->getBlockInfo($request);

        $this->assertSame(Response::HTTP_INTERNAL_SERVER_ERROR, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertFalse($data['success']);
        $this->assertStringContainsString('Failed to get block info', $data['error']);
    }

    // ==================== status() ====================

    public function testStatusReturnsConfiguration(): void
    {
        $this->config
            ->method('isEnabled')
            ->willReturn(true);
        $this->config
            ->method('isDevEnvironment')
            ->willReturn(true);
        $this->config
            ->method('getEditor')
            ->willReturn('phpstorm');

        $controller = $this->createController();
        
        $response = $controller->status();

        $this->assertSame(Response::HTTP_OK, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertTrue($data['enabled']);
        $this->assertTrue($data['devMode']);
        $this->assertSame('phpstorm', $data['editor']);
    }

    public function testStatusReturnsForbiddenInProduction(): void
    {
        $this->config
            ->method('isDevEnvironment')
            ->willReturn(false);

        $controller = $this->createController();
        
        $response = $controller->status();

        $this->assertSame(Response::HTTP_FORBIDDEN, $response->getStatusCode());
        $data = json_decode($response->getContent(), true);
        $this->assertFalse($data['enabled']);
        $this->assertFalse($data['devMode']);
        $this->assertNull($data['editor']);
    }
}
