<?php declare(strict_types=1);

namespace MnkysDevTools\Service;

use Symfony\Component\HttpKernel\KernelInterface;

class EditorService
{
    private const EDITOR_PROTOCOLS = [
        'vscode' => 'vscode://file/%s:%d',
        'phpstorm' => 'phpstorm://open?file=%s&line=%d',
        'sublime' => 'subl://open?url=file://%s&line=%d',
        'atom' => 'atom://core/open/file?filename=%s&line=%d',
        'idea' => 'idea://open?file=%s&line=%d',
    ];

    private const EDITOR_COMMANDS = [
        'vscode' => 'code --goto "%s:%d"',
        'phpstorm' => 'phpstorm --line %d "%s"',
        'sublime' => 'subl "%s:%d"',
        'idea' => 'idea --line %d "%s"',
    ];

    public function __construct(
        private readonly KernelInterface $kernel,
        private readonly DevToolsConfigService $config
    ) {}

    /**
     * Resolve a Twig template path (like @Storefront/...) to an absolute file path
     */
    public function resolveTemplatePath(string $templateName): ?string
    {
        $projectDir = $this->kernel->getProjectDir();

        // Handle @Storefront namespace
        if (str_starts_with($templateName, '@Storefront/')) {
            $relativePath = str_replace('@Storefront/', '', $templateName);
            $paths = [
                $projectDir . '/vendor/shopware/storefront/Resources/views/' . $relativePath,
                $projectDir . '/src/Storefront/Resources/views/' . $relativePath,
            ];
            foreach ($paths as $path) {
                if (file_exists($path)) {
                    return $path;
                }
            }
        }

        // Handle @Plugins namespace
        if (str_starts_with($templateName, '@Plugins/')) {
            $relativePath = str_replace('@Plugins/', '', $templateName);
            // Search in custom/plugins
            $pluginsDir = $projectDir . '/custom/plugins';
            if (is_dir($pluginsDir)) {
                $plugins = scandir($pluginsDir);
                foreach ($plugins as $plugin) {
                    if ($plugin === '.' || $plugin === '..') {
                        continue;
                    }
                    $path = $pluginsDir . '/' . $plugin . '/src/Resources/views/' . $relativePath;
                    if (file_exists($path)) {
                        return $path;
                    }
                }
            }
        }

        // Handle plugin namespaces like @MyPlugin/
        if (preg_match('/@(\w+)\/(.+)/', $templateName, $matches)) {
            $pluginName = $matches[1];
            $relativePath = $matches[2];

            // Search in custom/plugins
            $pluginPaths = [
                $projectDir . '/custom/plugins/' . $pluginName . '/src/Resources/views/' . $relativePath,
                $projectDir . '/vendor/shopware/' . strtolower($pluginName) . '/Resources/views/' . $relativePath,
            ];

            foreach ($pluginPaths as $path) {
                if (file_exists($path)) {
                    return $path;
                }
            }
        }

        // Handle direct relative path
        $directPath = $projectDir . '/' . ltrim($templateName, '/');
        if (file_exists($directPath)) {
            return $directPath;
        }

        return null;
    }

    /**
     * Get the protocol URL for opening a file in the configured editor
     */
    public function getEditorUrl(string $file, int $line): string
    {
        $editor = $this->config->getEditor();
        $protocol = self::EDITOR_PROTOCOLS[$editor] ?? self::EDITOR_PROTOCOLS['vscode'];

        // Some editors have different argument orders
        if ($editor === 'phpstorm' || $editor === 'idea') {
            return sprintf($protocol, urlencode($file), $line);
        }

        return sprintf($protocol, urlencode($file), $line);
    }

    /**
     * Open a file in the configured editor via shell command
     */
    public function openFile(string $file, int $line): bool
    {
        if (!$this->config->shouldExecOpen()) {
            return false;
        }

        $editor = $this->config->getEditor();
        $commandTemplate = self::EDITOR_COMMANDS[$editor] ?? null;

        if (!$commandTemplate) {
            return false;
        }

        // Build command based on editor
        if ($editor === 'phpstorm' || $editor === 'idea') {
            $command = sprintf($commandTemplate, $line, $file);
        } else {
            $command = sprintf($commandTemplate, $file, $line);
        }

        // Execute in background
        if (PHP_OS_FAMILY === 'Windows') {
            pclose(popen('start /B ' . $command, 'r'));
        } else {
            exec($command . ' > /dev/null 2>&1 &');
        }

        return true;
    }

    /**
     * Validate that a file path is within allowed directories
     */
    public function isPathAllowed(string $absolutePath): bool
    {
        $projectDir = $this->kernel->getProjectDir();
        $realPath = realpath($absolutePath);

        if ($realPath === false) {
            return false;
        }

        // Must be within project directory
        if (!str_starts_with($realPath, $projectDir)) {
            return false;
        }

        // Additional security: only allow certain directories
        $allowedPaths = [
            $projectDir . '/custom/plugins',
            $projectDir . '/vendor/shopware',
            $projectDir . '/src',
            $projectDir . '/templates',
        ];

        foreach ($allowedPaths as $allowed) {
            if (str_starts_with($realPath, $allowed)) {
                return true;
            }
        }

        return false;
    }
}
