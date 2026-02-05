<?php declare(strict_types=1);

namespace MnkysDevTools\Tests\Service;

use MnkysDevTools\Service\DevToolsConfigService;
use MnkysDevTools\Service\EditorService;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpKernel\KernelInterface;

class EditorServiceTest extends TestCase
{
    private MockObject&KernelInterface $kernel;
    private MockObject&DevToolsConfigService $config;
    private string $tempDir;

    protected function setUp(): void
    {
        $this->kernel = $this->createMock(KernelInterface::class);
        $this->config = $this->createMock(DevToolsConfigService::class);
        
        // Create a temporary directory structure for testing
        $this->tempDir = sys_get_temp_dir() . '/mnkys_devtools_test_' . uniqid();
        mkdir($this->tempDir, 0777, true);
        mkdir($this->tempDir . '/custom/plugins/TestPlugin/src/Resources/views', 0777, true);
        mkdir($this->tempDir . '/vendor/shopware/storefront/Resources/views', 0777, true);
        mkdir($this->tempDir . '/src/Storefront/Resources/views', 0777, true);
        mkdir($this->tempDir . '/templates', 0777, true);
        
        $this->kernel
            ->method('getProjectDir')
            ->willReturn($this->tempDir);
    }

    protected function tearDown(): void
    {
        // Clean up temporary directory
        $this->removeDirectory($this->tempDir);
    }

    private function removeDirectory(string $dir): void
    {
        if (!is_dir($dir)) {
            return;
        }
        
        $files = array_diff(scandir($dir), ['.', '..']);
        foreach ($files as $file) {
            $path = $dir . '/' . $file;
            is_dir($path) ? $this->removeDirectory($path) : unlink($path);
        }
        rmdir($dir);
    }

    private function createService(): EditorService
    {
        return new EditorService($this->kernel, $this->config);
    }

    // ==================== resolveTemplatePath() ====================

    public function testResolveTemplatePathForStorefrontNamespaceVendor(): void
    {
        $templatePath = $this->tempDir . '/vendor/shopware/storefront/Resources/views/storefront/page/product-detail/index.html.twig';
        mkdir(dirname($templatePath), 0777, true);
        file_put_contents($templatePath, '{% block content %}{% endblock %}');

        $service = $this->createService();
        $result = $service->resolveTemplatePath('@Storefront/storefront/page/product-detail/index.html.twig');

        $this->assertSame($templatePath, $result);
    }

    public function testResolveTemplatePathForStorefrontNamespaceSrc(): void
    {
        $templatePath = $this->tempDir . '/src/Storefront/Resources/views/storefront/layout/header.html.twig';
        mkdir(dirname($templatePath), 0777, true);
        file_put_contents($templatePath, '{% block header %}{% endblock %}');

        $service = $this->createService();
        $result = $service->resolveTemplatePath('@Storefront/storefront/layout/header.html.twig');

        $this->assertSame($templatePath, $result);
    }

    public function testResolveTemplatePathForPluginsNamespace(): void
    {
        $templatePath = $this->tempDir . '/custom/plugins/TestPlugin/src/Resources/views/storefront/test.html.twig';
        mkdir(dirname($templatePath), 0777, true);
        file_put_contents($templatePath, '{% block test %}{% endblock %}');

        $service = $this->createService();
        $result = $service->resolveTemplatePath('@Plugins/storefront/test.html.twig');

        $this->assertSame($templatePath, $result);
    }

    public function testResolveTemplatePathForPluginNamespace(): void
    {
        $templatePath = $this->tempDir . '/custom/plugins/TestPlugin/src/Resources/views/storefront/component.html.twig';
        mkdir(dirname($templatePath), 0777, true);
        file_put_contents($templatePath, '{% block component %}{% endblock %}');

        $service = $this->createService();
        $result = $service->resolveTemplatePath('@TestPlugin/storefront/component.html.twig');

        $this->assertSame($templatePath, $result);
    }

    public function testResolveTemplatePathForDirectPath(): void
    {
        $templatePath = $this->tempDir . '/templates/custom.html.twig';
        file_put_contents($templatePath, '{% block custom %}{% endblock %}');

        $service = $this->createService();
        $result = $service->resolveTemplatePath('templates/custom.html.twig');

        $this->assertSame($templatePath, $result);
    }

    public function testResolveTemplatePathReturnsNullForNonExistentPath(): void
    {
        $service = $this->createService();
        $result = $service->resolveTemplatePath('@Storefront/non-existent/template.html.twig');

        $this->assertNull($result);
    }

    public function testResolveTemplatePathReturnsNullForUnknownNamespace(): void
    {
        $service = $this->createService();
        $result = $service->resolveTemplatePath('@Unknown/template.html.twig');

        $this->assertNull($result);
    }

    // ==================== getEditorUrl() ====================

    /**
     * @dataProvider editorUrlProvider
     */
    public function testGetEditorUrlGeneratesCorrectProtocol(string $editor, string $file, int $line, string $expectedPattern): void
    {
        $this->config
            ->method('getEditor')
            ->willReturn($editor);
        $this->config
            ->method('getLocalProjectPath')
            ->willReturn(null);

        $service = $this->createService();
        $result = $service->getEditorUrl($file, $line);

        $this->assertMatchesRegularExpression($expectedPattern, $result);
    }

    public static function editorUrlProvider(): array
    {
        $file = '/var/www/html/templates/test.html.twig';
        $encodedFile = urlencode($file);
        
        return [
            'vscode' => [
                'vscode',
                $file,
                42,
                '#^vscode://file/' . preg_quote($encodedFile, '#') . ':42$#',
            ],
            'phpstorm' => [
                'phpstorm',
                $file,
                42,
                '#^phpstorm://open\?file=' . preg_quote($encodedFile, '#') . '&line=42$#',
            ],
            'sublime' => [
                'sublime',
                $file,
                42,
                '#^subl://open\?url=file://' . preg_quote($encodedFile, '#') . '&line=42$#',
            ],
            'atom' => [
                'atom',
                $file,
                42,
                '#^atom://core/open/file\?filename=' . preg_quote($encodedFile, '#') . '&line=42$#',
            ],
            'idea' => [
                'idea',
                $file,
                42,
                '#^idea://open\?file=' . preg_quote($encodedFile, '#') . '&line=42$#',
            ],
        ];
    }

    public function testGetEditorUrlFallsBackToVscodeForUnknownEditor(): void
    {
        $this->config
            ->method('getEditor')
            ->willReturn('unknown-editor');
        $this->config
            ->method('getLocalProjectPath')
            ->willReturn(null);

        $service = $this->createService();
        $result = $service->getEditorUrl('/test/file.twig', 10);

        $this->assertStringStartsWith('vscode://file/', $result);
    }

    // ==================== openFile() ====================

    public function testOpenFileReturnsFalseWhenExecOpenDisabled(): void
    {
        $this->config
            ->method('shouldExecOpen')
            ->willReturn(false);

        $service = $this->createService();
        $result = $service->openFile('/test/file.twig', 1);

        $this->assertFalse($result);
    }

    public function testOpenFileReturnsFalseForUnknownEditor(): void
    {
        $this->config
            ->method('shouldExecOpen')
            ->willReturn(true);
        $this->config
            ->method('getEditor')
            ->willReturn('unknown-editor');

        $service = $this->createService();
        $result = $service->openFile('/test/file.twig', 1);

        $this->assertFalse($result);
    }

    // Note: We cannot fully test openFile() success case as it executes shell commands
    // Integration tests would be needed for that

    // ==================== isPathAllowed() ====================

    public function testIsPathAllowedReturnsTrueForCustomPluginsPath(): void
    {
        $filePath = $this->tempDir . '/custom/plugins/TestPlugin/src/Resources/views/test.html.twig';
        @mkdir(dirname($filePath), 0777, true);
        file_put_contents($filePath, 'test');

        $service = $this->createService();
        $result = $service->isPathAllowed($filePath);

        $this->assertTrue($result);
    }

    public function testIsPathAllowedReturnsTrueForVendorShopwarePath(): void
    {
        $filePath = $this->tempDir . '/vendor/shopware/storefront/Resources/views/test.html.twig';
        @mkdir(dirname($filePath), 0777, true);
        file_put_contents($filePath, 'test');

        $service = $this->createService();
        $result = $service->isPathAllowed($filePath);

        $this->assertTrue($result);
    }

    public function testIsPathAllowedReturnsTrueForSrcPath(): void
    {
        $filePath = $this->tempDir . '/src/test.php';
        @mkdir(dirname($filePath), 0777, true);
        file_put_contents($filePath, '<?php');

        $service = $this->createService();
        $result = $service->isPathAllowed($filePath);

        $this->assertTrue($result);
    }

    public function testIsPathAllowedReturnsTrueForTemplatesPath(): void
    {
        $filePath = $this->tempDir . '/templates/test.html.twig';
        file_put_contents($filePath, 'test');

        $service = $this->createService();
        $result = $service->isPathAllowed($filePath);

        $this->assertTrue($result);
    }

    public function testIsPathAllowedReturnsFalseForPathOutsideProject(): void
    {
        $service = $this->createService();
        $result = $service->isPathAllowed('/etc/passwd');

        $this->assertFalse($result);
    }

    public function testIsPathAllowedReturnsFalseForNonExistentPath(): void
    {
        $service = $this->createService();
        $result = $service->isPathAllowed($this->tempDir . '/non-existent/file.txt');

        $this->assertFalse($result);
    }

    public function testIsPathAllowedReturnsFalseForPathTraversalAttempt(): void
    {
        // Create a file outside allowed directories but within project
        $filePath = $this->tempDir . '/config/secrets.yaml';
        mkdir(dirname($filePath), 0777, true);
        file_put_contents($filePath, 'secrets');

        $service = $this->createService();
        $result = $service->isPathAllowed($filePath);

        $this->assertFalse($result);
    }

    public function testIsPathAllowedReturnsFalseForSymlinkOutsideProject(): void
    {
        // Skip on Windows where symlinks may require elevated privileges
        if (PHP_OS_FAMILY === 'Windows') {
            $this->markTestSkipped('Symlink test not reliable on Windows');
        }

        $externalFile = '/tmp/external_test_file_' . uniqid();
        file_put_contents($externalFile, 'external content');
        
        $symlinkPath = $this->tempDir . '/custom/plugins/symlink_test.txt';
        symlink($externalFile, $symlinkPath);

        $service = $this->createService();
        $result = $service->isPathAllowed($symlinkPath);

        // Clean up
        unlink($symlinkPath);
        unlink($externalFile);

        $this->assertFalse($result);
    }

    public function testIsPathAllowedReturnsTrueForCustomAppsPath(): void
    {
        $filePath = $this->tempDir . '/custom/apps/TestApp/Resources/views/test.html.twig';
        mkdir(dirname($filePath), 0777, true);
        file_put_contents($filePath, 'test');

        $service = $this->createService();
        $result = $service->isPathAllowed($filePath);

        $this->assertTrue($result);
    }

    public function testIsPathAllowedReturnsTrueForCustomStaticPluginsPath(): void
    {
        $filePath = $this->tempDir . '/custom/static-plugins/TestPlugin/src/test.php';
        mkdir(dirname($filePath), 0777, true);
        file_put_contents($filePath, '<?php');

        $service = $this->createService();
        $result = $service->isPathAllowed($filePath);

        $this->assertTrue($result);
    }

    // ==================== translateToLocalPath() ====================

    public function testTranslateToLocalPathReturnsOriginalPathWhenNoMapping(): void
    {
        $this->config
            ->method('getLocalProjectPath')
            ->willReturn(null);

        $service = $this->createService();
        $result = $service->translateToLocalPath('/var/www/html/vendor/test.php');

        $this->assertSame('/var/www/html/vendor/test.php', $result);
    }

    public function testTranslateToLocalPathTranslatesContainerPathToLocalPath(): void
    {
        $this->config
            ->method('getLocalProjectPath')
            ->willReturn('/home/user/project');

        $this->kernel = $this->createMock(KernelInterface::class);
        $this->kernel
            ->method('getProjectDir')
            ->willReturn('/var/www/html');

        $service = new EditorService($this->kernel, $this->config);
        $result = $service->translateToLocalPath('/var/www/html/vendor/shopware/test.php');

        $this->assertSame('/home/user/project/vendor/shopware/test.php', $result);
    }

    public function testTranslateToLocalPathConvertsSlashesForWindowsPath(): void
    {
        $this->config
            ->method('getLocalProjectPath')
            ->willReturn('\\\\wsl.localhost\\Ubuntu\\home\\user\\project');

        $this->kernel = $this->createMock(KernelInterface::class);
        $this->kernel
            ->method('getProjectDir')
            ->willReturn('/var/www/html');

        $service = new EditorService($this->kernel, $this->config);
        $result = $service->translateToLocalPath('/var/www/html/vendor/shopware/test.php');

        $this->assertSame('\\\\wsl.localhost\\Ubuntu\\home\\user\\project\\vendor\\shopware\\test.php', $result);
    }

    public function testTranslateToLocalPathReturnsOriginalIfNotInProjectDir(): void
    {
        $this->config
            ->method('getLocalProjectPath')
            ->willReturn('/home/user/project');

        $this->kernel = $this->createMock(KernelInterface::class);
        $this->kernel
            ->method('getProjectDir')
            ->willReturn('/var/www/html');

        $service = new EditorService($this->kernel, $this->config);
        $result = $service->translateToLocalPath('/etc/passwd');

        $this->assertSame('/etc/passwd', $result);
    }

    public function testGetEditorUrlUsesTranslatedPath(): void
    {
        $this->config
            ->method('getEditor')
            ->willReturn('vscode');
        $this->config
            ->method('getLocalProjectPath')
            ->willReturn('/home/user/project');

        $this->kernel = $this->createMock(KernelInterface::class);
        $this->kernel
            ->method('getProjectDir')
            ->willReturn('/var/www/html');

        $service = new EditorService($this->kernel, $this->config);
        $result = $service->getEditorUrl('/var/www/html/vendor/test.php', 42);

        $this->assertStringContainsString(urlencode('/home/user/project/vendor/test.php'), $result);
    }
}
