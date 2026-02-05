<?php declare(strict_types=1);

namespace MnkysDevTools\Tests;

use MnkysDevTools\MnkysDevTools;
use PHPUnit\Framework\TestCase;
use Shopware\Core\Framework\Plugin;

class MnkysDevToolsTest extends TestCase
{
    private MnkysDevTools $plugin;

    protected function setUp(): void
    {
        $this->plugin = new MnkysDevTools(true, '', '');
    }

    public function testPluginExtendsShopwarePlugin(): void
    {
        $this->assertInstanceOf(Plugin::class, $this->plugin);
    }

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

    public function testLifecycleMethodsReturnVoid(): void
    {
        $methods = ['install', 'uninstall', 'activate', 'deactivate'];

        foreach ($methods as $methodName) {
            $reflection = new \ReflectionMethod($this->plugin, $methodName);
            $returnType = $reflection->getReturnType();

            $this->assertNotNull($returnType, "Method {$methodName} should have a return type");
            $this->assertSame('void', $returnType->getName(), "Method {$methodName} should return void");
        }
    }
}
