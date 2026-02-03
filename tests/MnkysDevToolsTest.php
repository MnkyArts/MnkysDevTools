<?php declare(strict_types=1);

namespace MnkysDevTools\Tests;

use MnkysDevTools\MnkysDevTools;
use PHPUnit\Framework\TestCase;
use Shopware\Core\Framework\Plugin;
use Shopware\Core\Framework\Plugin\Context\ActivateContext;
use Shopware\Core\Framework\Plugin\Context\DeactivateContext;
use Shopware\Core\Framework\Plugin\Context\InstallContext;
use Shopware\Core\Framework\Plugin\Context\UninstallContext;
use Shopware\Core\Framework\Plugin\Context\UpdateContext;

class MnkysDevToolsTest extends TestCase
{
    private MnkysDevTools $plugin;

    protected function setUp(): void
    {
        $this->plugin = new MnkysDevTools(true, '', '');
    }

    // ==================== Class Structure ====================

    public function testPluginClassExists(): void
    {
        $this->assertInstanceOf(MnkysDevTools::class, $this->plugin);
    }

    public function testPluginExtendsShopwarePlugin(): void
    {
        $this->assertInstanceOf(Plugin::class, $this->plugin);
    }

    // ==================== Lifecycle Methods ====================

    public function testInstallMethodExists(): void
    {
        $this->assertTrue(method_exists($this->plugin, 'install'));
    }

    public function testUninstallMethodExists(): void
    {
        $this->assertTrue(method_exists($this->plugin, 'uninstall'));
    }

    public function testActivateMethodExists(): void
    {
        $this->assertTrue(method_exists($this->plugin, 'activate'));
    }

    public function testDeactivateMethodExists(): void
    {
        $this->assertTrue(method_exists($this->plugin, 'deactivate'));
    }

    public function testUpdateMethodExists(): void
    {
        $this->assertTrue(method_exists($this->plugin, 'update'));
    }

    public function testPostInstallMethodExists(): void
    {
        $this->assertTrue(method_exists($this->plugin, 'postInstall'));
    }

    public function testPostUpdateMethodExists(): void
    {
        $this->assertTrue(method_exists($this->plugin, 'postUpdate'));
    }

    // ==================== Method Signatures ====================

    public function testInstallAcceptsInstallContext(): void
    {
        $reflection = new \ReflectionMethod($this->plugin, 'install');
        $parameters = $reflection->getParameters();
        
        $this->assertCount(1, $parameters);
        $this->assertSame('installContext', $parameters[0]->getName());
        $this->assertSame(InstallContext::class, $parameters[0]->getType()->getName());
    }

    public function testUninstallAcceptsUninstallContext(): void
    {
        $reflection = new \ReflectionMethod($this->plugin, 'uninstall');
        $parameters = $reflection->getParameters();
        
        $this->assertCount(1, $parameters);
        $this->assertSame('uninstallContext', $parameters[0]->getName());
        $this->assertSame(UninstallContext::class, $parameters[0]->getType()->getName());
    }

    public function testActivateAcceptsActivateContext(): void
    {
        $reflection = new \ReflectionMethod($this->plugin, 'activate');
        $parameters = $reflection->getParameters();
        
        $this->assertCount(1, $parameters);
        $this->assertSame('activateContext', $parameters[0]->getName());
        $this->assertSame(ActivateContext::class, $parameters[0]->getType()->getName());
    }

    public function testDeactivateAcceptsDeactivateContext(): void
    {
        $reflection = new \ReflectionMethod($this->plugin, 'deactivate');
        $parameters = $reflection->getParameters();
        
        $this->assertCount(1, $parameters);
        $this->assertSame('deactivateContext', $parameters[0]->getName());
        $this->assertSame(DeactivateContext::class, $parameters[0]->getType()->getName());
    }

    public function testUpdateAcceptsUpdateContext(): void
    {
        $reflection = new \ReflectionMethod($this->plugin, 'update');
        $parameters = $reflection->getParameters();
        
        $this->assertCount(1, $parameters);
        $this->assertSame('updateContext', $parameters[0]->getName());
        $this->assertSame(UpdateContext::class, $parameters[0]->getType()->getName());
    }

    // ==================== Return Types ====================

    public function testLifecycleMethodsReturnVoid(): void
    {
        $methods = ['install', 'uninstall', 'activate', 'deactivate', 'update', 'postInstall', 'postUpdate'];
        
        foreach ($methods as $methodName) {
            $reflection = new \ReflectionMethod($this->plugin, $methodName);
            $returnType = $reflection->getReturnType();
            
            $this->assertNotNull($returnType, "Method {$methodName} should have a return type");
            $this->assertSame('void', $returnType->getName(), "Method {$methodName} should return void");
        }
    }

    // ==================== Namespace and Autoloading ====================

    public function testPluginNamespaceIsCorrect(): void
    {
        $reflection = new \ReflectionClass($this->plugin);
        
        $this->assertSame('MnkysDevTools', $reflection->getNamespaceName());
    }

    public function testPluginClassNameIsCorrect(): void
    {
        $reflection = new \ReflectionClass($this->plugin);
        
        $this->assertSame('MnkysDevTools', $reflection->getShortName());
    }
}
