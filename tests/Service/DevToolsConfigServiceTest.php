<?php declare(strict_types=1);

namespace MnkysDevTools\Tests\Service;

use MnkysDevTools\Service\DevToolsConfigService;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Shopware\Core\System\SystemConfig\SystemConfigService;

class DevToolsConfigServiceTest extends TestCase
{
    private MockObject&SystemConfigService $systemConfigService;

    protected function setUp(): void
    {
        $this->systemConfigService = $this->createMock(SystemConfigService::class);
    }

    private function createService(string $appEnv = 'dev'): DevToolsConfigService
    {
        return new DevToolsConfigService($this->systemConfigService, $appEnv);
    }

    // ==================== isEnabled() ====================

    public function testIsEnabledReturnsFalseInProductionEnvironment(): void
    {
        $this->systemConfigService
            ->method('get')
            ->willReturn(true);

        $service = $this->createService('prod');

        $this->assertFalse($service->isEnabled());
    }

    public function testIsEnabledReturnsTrueWhenConfigEnabledInDevEnvironment(): void
    {
        $this->systemConfigService
            ->method('get')
            ->with('MnkysDevTools.config.enabled', null)
            ->willReturn(true);

        $service = $this->createService('dev');

        $this->assertTrue($service->isEnabled());
    }

    public function testIsEnabledReturnsFalseWhenConfigDisabled(): void
    {
        $this->systemConfigService
            ->method('get')
            ->with('MnkysDevTools.config.enabled', null)
            ->willReturn(false);

        $service = $this->createService('dev');

        $this->assertFalse($service->isEnabled());
    }

    public function testIsEnabledUsesSalesChannelId(): void
    {
        $salesChannelId = 'test-sales-channel-id';

        $this->systemConfigService
            ->expects($this->once())
            ->method('get')
            ->with('MnkysDevTools.config.enabled', $salesChannelId)
            ->willReturn(true);

        $service = $this->createService('dev');

        $this->assertTrue($service->isEnabled($salesChannelId));
    }

    // ==================== getEditor() ====================

    public function testGetEditorReturnsConfiguredEditor(): void
    {
        $this->systemConfigService
            ->method('get')
            ->with('MnkysDevTools.config.editor', null)
            ->willReturn('phpstorm');

        $service = $this->createService();

        $this->assertSame('phpstorm', $service->getEditor());
    }

    public function testGetEditorReturnsVscodeAsDefaultWhenNull(): void
    {
        $this->systemConfigService
            ->method('get')
            ->willReturn(null);

        $service = $this->createService();

        $this->assertSame('vscode', $service->getEditor());
    }

    public function testGetEditorReturnsVscodeAsDefaultWhenEmptyString(): void
    {
        $this->systemConfigService
            ->method('get')
            ->willReturn('');

        $service = $this->createService();

        $this->assertSame('vscode', $service->getEditor());
    }

    /**
     * @dataProvider editorProvider
     */
    public function testGetEditorReturnsVariousEditors(string $editor): void
    {
        $this->systemConfigService
            ->method('get')
            ->willReturn($editor);

        $service = $this->createService();

        $this->assertSame($editor, $service->getEditor());
    }

    public static function editorProvider(): array
    {
        return [
            'vscode' => ['vscode'],
            'phpstorm' => ['phpstorm'],
            'sublime' => ['sublime'],
            'atom' => ['atom'],
            'idea' => ['idea'],
        ];
    }

    // ==================== shouldExecOpen() ====================

    public function testShouldExecOpenReturnsTrueWhenConfigEnabled(): void
    {
        $this->systemConfigService
            ->method('get')
            ->with('MnkysDevTools.config.execOpen', null)
            ->willReturn(true);

        $service = $this->createService();

        $this->assertTrue($service->shouldExecOpen());
    }

    public function testShouldExecOpenReturnsFalseWhenConfigDisabled(): void
    {
        $this->systemConfigService
            ->method('get')
            ->with('MnkysDevTools.config.execOpen', null)
            ->willReturn(false);

        $service = $this->createService();

        $this->assertFalse($service->shouldExecOpen());
    }

    public function testShouldExecOpenReturnsFalseWhenConfigNull(): void
    {
        $this->systemConfigService
            ->method('get')
            ->willReturn(null);

        $service = $this->createService();

        $this->assertFalse($service->shouldExecOpen());
    }

    // ==================== isDevEnvironment() ====================

    public function testIsDevEnvironmentReturnsTrueForDevEnv(): void
    {
        $service = $this->createService('dev');

        $this->assertTrue($service->isDevEnvironment());
    }

    public function testIsDevEnvironmentReturnsTrueForTestEnv(): void
    {
        $service = $this->createService('test');

        $this->assertTrue($service->isDevEnvironment());
    }

    public function testIsDevEnvironmentReturnsTrueForStagingEnv(): void
    {
        $service = $this->createService('staging');

        $this->assertTrue($service->isDevEnvironment());
    }

    public function testIsDevEnvironmentReturnsFalseForProdEnv(): void
    {
        $service = $this->createService('prod');

        $this->assertFalse($service->isDevEnvironment());
    }

    // ==================== getMaxVariableDepth() ====================

    public function testGetMaxVariableDepthReturnsConfiguredValue(): void
    {
        $this->systemConfigService
            ->method('get')
            ->with('MnkysDevTools.config.maxVariableDepth', null)
            ->willReturn(5);

        $service = $this->createService();

        $this->assertSame(5, $service->getMaxVariableDepth());
    }

    public function testGetMaxVariableDepthReturnsDefaultWhenNull(): void
    {
        $this->systemConfigService
            ->method('get')
            ->willReturn(null);

        $service = $this->createService();

        $this->assertSame(3, $service->getMaxVariableDepth());
    }

    public function testGetMaxVariableDepthReturnsDefaultWhenNotNumeric(): void
    {
        $this->systemConfigService
            ->method('get')
            ->willReturn('invalid');

        $service = $this->createService();

        $this->assertSame(3, $service->getMaxVariableDepth());
    }

    public function testGetMaxVariableDepthHandlesStringNumericValue(): void
    {
        $this->systemConfigService
            ->method('get')
            ->willReturn('7');

        $service = $this->createService();

        $this->assertSame(7, $service->getMaxVariableDepth());
    }
}
