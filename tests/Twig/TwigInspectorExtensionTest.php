<?php declare(strict_types=1);

namespace MnkysDevTools\Tests\Twig;

use MnkysDevTools\Service\DevToolsConfigService;
use MnkysDevTools\Service\VariableAnalyzer;
use MnkysDevTools\Twig\Node\InspectorNodeVisitor;
use MnkysDevTools\Twig\TwigInspectorExtension;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Twig\TwigFunction;

class TwigInspectorExtensionTest extends TestCase
{
    private MockObject&DevToolsConfigService $config;

    protected function setUp(): void
    {
        $this->config = $this->createMock(DevToolsConfigService::class);
        $this->config
            ->method('getMaxVariableDepth')
            ->willReturn(3);
    }

    private function createExtension(): TwigInspectorExtension
    {
        return new TwigInspectorExtension($this->config, new VariableAnalyzer());
    }

    // ==================== getNodeVisitors() ====================

    public function testGetNodeVisitorsReturnsEmptyInProduction(): void
    {
        $this->config
            ->method('isDevEnvironment')
            ->willReturn(false);
        $this->config
            ->method('isEnabled')
            ->willReturn(true);

        $extension = $this->createExtension();
        $visitors = $extension->getNodeVisitors();

        $this->assertEmpty($visitors);
    }

    public function testGetNodeVisitorsReturnsEmptyWhenDisabled(): void
    {
        $this->config
            ->method('isDevEnvironment')
            ->willReturn(true);
        $this->config
            ->method('isEnabled')
            ->willReturn(false);

        $extension = $this->createExtension();
        $visitors = $extension->getNodeVisitors();

        $this->assertEmpty($visitors);
    }

    public function testGetNodeVisitorsReturnsVisitorWhenEnabled(): void
    {
        $this->config
            ->method('isDevEnvironment')
            ->willReturn(true);
        $this->config
            ->method('isEnabled')
            ->willReturn(true);

        $extension = $this->createExtension();
        $visitors = $extension->getNodeVisitors();

        $this->assertCount(1, $visitors);
        $this->assertInstanceOf(InspectorNodeVisitor::class, $visitors[0]);
    }

    // ==================== getFunctions() ====================

    public function testGetFunctionsRegistersDevtoolsFunction(): void
    {
        $extension = $this->createExtension();
        $functions = $extension->getFunctions();

        $this->assertCount(1, $functions);
        $this->assertInstanceOf(TwigFunction::class, $functions[0]);
        $this->assertSame('devtools_render_block_data', $functions[0]->getName());
    }

    // ==================== injectBlockAttribute() ====================

    public function testInjectBlockAttributeReturnsEmptyOutputUnchanged(): void
    {
        $extension = $this->createExtension();
        
        $result = $extension->injectBlockAttribute('', '{"block":"test"}', []);
        $this->assertSame('', $result);
        
        $result = $extension->injectBlockAttribute('   ', '{"block":"test"}', []);
        $this->assertSame('   ', $result);
    }

    public function testInjectBlockAttributeReturnsOutputOnInvalidJson(): void
    {
        $extension = $this->createExtension();
        $output = '<div>Test</div>';
        
        $result = $extension->injectBlockAttribute($output, 'invalid-json', []);
        
        $this->assertSame($output, $result);
    }

    public function testInjectBlockAttributeInjectsDataAttribute(): void
    {
        $extension = $this->createExtension();
        $blockData = json_encode([
            'block' => 'test_block',
            'template' => '@Storefront/test.html.twig',
            'line' => 10,
        ]);
        
        $result = $extension->injectBlockAttribute('<div>Content</div>', $blockData, []);

        $this->assertStringContainsString('data-twig-block="', $result);
        $this->assertStringContainsString('test_block', $result);
    }

    public function testInjectBlockAttributeSkipsScriptTags(): void
    {
        $extension = $this->createExtension();
        $blockData = json_encode(['block' => 'test', 'template' => 'test.twig', 'line' => 1]);
        
        // Output starting with script tag should be skipped, inject on next suitable element
        $result = $extension->injectBlockAttribute('<script>var x = 1;</script><div>Test</div>', $blockData, []);

        // The script tag should NOT have data-twig-block
        $this->assertStringNotContainsString('<script data-twig-block', $result);
        // But the div should have it
        $this->assertStringContainsString('<div data-twig-block="', $result);
    }

    public function testInjectBlockAttributeSkipsStyleTags(): void
    {
        $extension = $this->createExtension();
        $blockData = json_encode(['block' => 'test', 'template' => 'test.twig', 'line' => 1]);
        
        $result = $extension->injectBlockAttribute('<style>.class{}</style><div>Test</div>', $blockData, []);

        $this->assertStringNotContainsString('<style data-twig-block', $result);
        $this->assertStringContainsString('<div data-twig-block="', $result);
    }

    public function testInjectBlockAttributeSkipsVoidElements(): void
    {
        $extension = $this->createExtension();
        $blockData = json_encode(['block' => 'test', 'template' => 'test.twig', 'line' => 1]);
        
        $result = $extension->injectBlockAttribute('<br><hr><img src="test.png"><div>Test</div>', $blockData, []);

        $this->assertStringNotContainsString('<br data-twig-block', $result);
        $this->assertStringNotContainsString('<hr data-twig-block', $result);
        $this->assertStringNotContainsString('<img data-twig-block', $result);
        $this->assertStringContainsString('<div data-twig-block="', $result);
    }

    public function testInjectBlockAttributeSkipsMetaTags(): void
    {
        $extension = $this->createExtension();
        $blockData = json_encode(['block' => 'test', 'template' => 'test.twig', 'line' => 1]);
        
        $result = $extension->injectBlockAttribute('<meta charset="utf-8"><div>Test</div>', $blockData, []);

        $this->assertStringNotContainsString('<meta data-twig-block', $result);
    }

    public function testInjectBlockAttributeSkipsAlreadyTaggedElements(): void
    {
        $extension = $this->createExtension();
        $blockData = json_encode(['block' => 'test', 'template' => 'test.twig', 'line' => 1]);
        
        $result = $extension->injectBlockAttribute(
            '<div data-twig-block="{&quot;block&quot;:&quot;existing&quot;}">Test</div>',
            $blockData,
            []
        );

        // Should not add a second data-twig-block
        preg_match_all('/data-twig-block/', $result, $matches);
        $this->assertCount(1, $matches[0]);
    }

    public function testInjectBlockAttributeOnlyInjectsOnFirstSuitableElement(): void
    {
        $extension = $this->createExtension();
        $blockData = json_encode(['block' => 'test', 'template' => 'test.twig', 'line' => 1]);
        
        $result = $extension->injectBlockAttribute('<div>First</div><div>Second</div><div>Third</div>', $blockData, []);

        // Only the first div should have the attribute
        preg_match_all('/data-twig-block/', $result, $matches);
        $this->assertCount(1, $matches[0]);
        
        // Should be on the first div
        $this->assertStringStartsWith('<div data-twig-block="', $result);
    }

    public function testInjectBlockAttributeHandlesSelfClosingTags(): void
    {
        $extension = $this->createExtension();
        $blockData = json_encode(['block' => 'test', 'template' => 'test.twig', 'line' => 1]);
        
        // input is a void element and should be skipped
        $result = $extension->injectBlockAttribute('<input type="text" /><div>Test</div>', $blockData, []);

        $this->assertStringNotContainsString('<input data-twig-block', $result);
        $this->assertStringContainsString('<div data-twig-block="', $result);
    }

    public function testInjectBlockAttributePreservesExistingAttributes(): void
    {
        $extension = $this->createExtension();
        $blockData = json_encode(['block' => 'test', 'template' => 'test.twig', 'line' => 1]);
        
        $result = $extension->injectBlockAttribute(
            '<div class="my-class" id="my-id" data-custom="value">Content</div>',
            $blockData,
            []
        );

        $this->assertStringContainsString('class="my-class"', $result);
        $this->assertStringContainsString('id="my-id"', $result);
        $this->assertStringContainsString('data-custom="value"', $result);
        $this->assertStringContainsString('data-twig-block="', $result);
    }

    public function testInjectBlockAttributeAddsContextKeysToBlockData(): void
    {
        $extension = $this->createExtension();
        $blockData = json_encode(['block' => 'test', 'template' => 'test.twig', 'line' => 1]);
        $context = [
            'product' => new \stdClass(),
            'page' => ['title' => 'Test'],
            '_parent' => [], // Should be filtered
        ];
        
        $result = $extension->injectBlockAttribute('<div>Content</div>', $blockData, $context);

        // The result should contain the block data with contextKeys
        $this->assertStringContainsString('contextKeys', $result);
    }

    // ==================== getRegisteredBlocks() ====================

    public function testGetRegisteredBlocksReturnsEmptyInitially(): void
    {
        $extension = $this->createExtension();
        
        $this->assertEmpty($extension->getRegisteredBlocks());
    }

    public function testGetRegisteredBlocksReturnsBlocksAfterInjection(): void
    {
        $extension = $this->createExtension();
        $blockData = json_encode(['block' => 'test', 'template' => 'test.twig', 'line' => 1]);
        
        $extension->injectBlockAttribute('<div>Content</div>', $blockData, []);
        
        $blocks = $extension->getRegisteredBlocks();
        $this->assertCount(1, $blocks);
        $this->assertSame('test', $blocks[0]['block']);
    }

    // ==================== getBlockContextData() ====================

    public function testGetBlockContextDataReturnsNullForUnknownBlockId(): void
    {
        $extension = $this->createExtension();
        
        $result = $extension->getBlockContextData('unknown-block-id');
        
        $this->assertNull($result);
    }

    public function testGetBlockContextDataReturnsDataAfterInjection(): void
    {
        $extension = $this->createExtension();
        $blockData = json_encode(['block' => 'test', 'template' => 'test.twig', 'line' => 1]);
        $context = ['myVar' => 'myValue'];
        
        $extension->injectBlockAttribute('<div>Content</div>', $blockData, $context);
        
        $blocks = $extension->getRegisteredBlocks();
        $blockId = $blocks[0]['blockId'];
        
        $contextData = $extension->getBlockContextData($blockId);
        
        $this->assertNotNull($contextData);
        $this->assertSame('test', $contextData['block']);
        $this->assertArrayHasKey('context', $contextData);
    }

    // ==================== getAllBlockContextData() ====================

    public function testGetAllBlockContextDataReturnsEmptyInitially(): void
    {
        $extension = $this->createExtension();
        
        $this->assertEmpty($extension->getAllBlockContextData());
    }

    public function testGetAllBlockContextDataReturnsAllBlocks(): void
    {
        $extension = $this->createExtension();
        
        $extension->injectBlockAttribute('<div>A</div>', json_encode(['block' => 'a', 'template' => 't.twig', 'line' => 1]), []);
        $extension->injectBlockAttribute('<div>B</div>', json_encode(['block' => 'b', 'template' => 't.twig', 'line' => 2]), []);
        
        $allData = $extension->getAllBlockContextData();
        
        $this->assertCount(2, $allData);
    }

    // ==================== renderBlockData() ====================

    public function testRenderBlockDataReturnsEmptyWhenNoBlocks(): void
    {
        $extension = $this->createExtension();
        
        $result = $extension->renderBlockData();
        
        $this->assertSame('', $result);
    }

    public function testRenderBlockDataOutputsJsonScriptTags(): void
    {
        $extension = $this->createExtension();
        $blockData = json_encode(['block' => 'test', 'template' => 'test.twig', 'line' => 1]);
        
        $extension->injectBlockAttribute('<div>Content</div>', $blockData, []);
        
        $result = $extension->renderBlockData();
        
        $this->assertStringContainsString('<script id="devtools-block-data"', $result);
        $this->assertStringContainsString('type="application/json"', $result);
        $this->assertStringContainsString('<script id="devtools-context-data"', $result);
    }

    public function testRenderBlockDataDeduplicatesBlocks(): void
    {
        $extension = $this->createExtension();
        $blockData = json_encode(['block' => 'test', 'template' => 'test.twig', 'line' => 1]);
        
        // Inject the same block twice
        $extension->injectBlockAttribute('<div>Content1</div>', $blockData, []);
        $extension->injectBlockAttribute('<div>Content2</div>', $blockData, []);
        
        $result = $extension->renderBlockData();
        
        // Parse the JSON from the script tag
        preg_match('/<script id="devtools-block-data"[^>]*>(.+?)<\/script>/s', $result, $matches);
        $blocks = json_decode($matches[1], true);
        
        // Should be deduplicated (same template:block:line)
        $this->assertCount(1, $blocks);
    }

    // ==================== isEnabled() ====================

    public function testIsEnabledReturnsTrueWhenDevAndEnabled(): void
    {
        $this->config
            ->method('isDevEnvironment')
            ->willReturn(true);
        $this->config
            ->method('isEnabled')
            ->willReturn(true);

        $extension = $this->createExtension();
        
        $this->assertTrue($extension->isEnabled());
    }

    public function testIsEnabledReturnsFalseInProduction(): void
    {
        $this->config
            ->method('isDevEnvironment')
            ->willReturn(false);
        $this->config
            ->method('isEnabled')
            ->willReturn(true);

        $extension = $this->createExtension();
        
        $this->assertFalse($extension->isEnabled());
    }

    public function testIsEnabledReturnsFalseWhenDisabled(): void
    {
        $this->config
            ->method('isDevEnvironment')
            ->willReturn(true);
        $this->config
            ->method('isEnabled')
            ->willReturn(false);

        $extension = $this->createExtension();
        
        $this->assertFalse($extension->isEnabled());
    }

    // ==================== Context Analysis (private method via injectBlockAttribute) ====================

    public function testInjectBlockAttributeFiltersInternalContextVariables(): void
    {
        $extension = $this->createExtension();
        $blockData = json_encode(['block' => 'test', 'template' => 'test.twig', 'line' => 1]);
        $context = [
            '_parent' => [],
            '_seq' => [],
            '_key' => 'k',
            '_iterated' => true,
            'loop' => [],
            '_self' => 'self',
            '__internal_var' => 'internal',
            'app' => new \stdClass(),
            'validVar' => 'value',
        ];
        
        $extension->injectBlockAttribute('<div>Content</div>', $blockData, $context);
        
        $blocks = $extension->getRegisteredBlocks();
        $contextKeys = $blocks[0]['contextKeys'];
        
        $this->assertNotContains('_parent', $contextKeys);
        $this->assertNotContains('_seq', $contextKeys);
        $this->assertNotContains('loop', $contextKeys);
        $this->assertNotContains('app', $contextKeys);
        $this->assertContains('validVar', $contextKeys);
    }

    public function testInjectBlockAttributeAnalyzesPrimitiveTypes(): void
    {
        $extension = $this->createExtension();
        $blockData = json_encode(['block' => 'test', 'template' => 'test.twig', 'line' => 1]);
        $context = [
            'nullVal' => null,
            'boolVal' => true,
            'intVal' => 42,
            'floatVal' => 3.14,
            'stringVal' => 'hello',
        ];
        
        $extension->injectBlockAttribute('<div>Content</div>', $blockData, $context);
        
        $blocks = $extension->getRegisteredBlocks();
        $blockId = $blocks[0]['blockId'];
        $contextData = $extension->getBlockContextData($blockId);
        
        $this->assertSame('null', $contextData['context']['nullVal']['type']);
        $this->assertSame('bool', $contextData['context']['boolVal']['type']);
        $this->assertSame('int', $contextData['context']['intVal']['type']);
        $this->assertSame('float', $contextData['context']['floatVal']['type']);
        $this->assertSame('string', $contextData['context']['stringVal']['type']);
    }

    public function testInjectBlockAttributeAnalyzesArrays(): void
    {
        $extension = $this->createExtension();
        $blockData = json_encode(['block' => 'test', 'template' => 'test.twig', 'line' => 1]);
        $context = [
            'indexedArray' => [1, 2, 3],
            'assocArray' => ['key' => 'value'],
        ];
        
        $extension->injectBlockAttribute('<div>Content</div>', $blockData, $context);
        
        $blocks = $extension->getRegisteredBlocks();
        $blockId = $blocks[0]['blockId'];
        $contextData = $extension->getBlockContextData($blockId);
        
        $this->assertSame('array', $contextData['context']['indexedArray']['type']);
        $this->assertSame(3, $contextData['context']['indexedArray']['count']);
        $this->assertSame('array', $contextData['context']['assocArray']['type']);
    }

    public function testInjectBlockAttributeAnalyzesObjects(): void
    {
        $extension = $this->createExtension();
        $blockData = json_encode(['block' => 'test', 'template' => 'test.twig', 'line' => 1]);
        $context = [
            'object' => new \stdClass(),
        ];
        
        $extension->injectBlockAttribute('<div>Content</div>', $blockData, $context);
        
        $blocks = $extension->getRegisteredBlocks();
        $blockId = $blocks[0]['blockId'];
        $contextData = $extension->getBlockContextData($blockId);
        
        $this->assertSame('object', $contextData['context']['object']['type']);
        $this->assertSame('stdClass', $contextData['context']['object']['class']);
    }

    public function testInjectBlockAttributeTruncatesLongStrings(): void
    {
        $extension = $this->createExtension();
        $blockData = json_encode(['block' => 'test', 'template' => 'test.twig', 'line' => 1]);
        $context = [
            'longString' => str_repeat('a', 150),
        ];
        
        $extension->injectBlockAttribute('<div>Content</div>', $blockData, $context);
        
        $blocks = $extension->getRegisteredBlocks();
        $blockId = $blocks[0]['blockId'];
        $contextData = $extension->getBlockContextData($blockId);
        
        $this->assertSame(150, $contextData['context']['longString']['length']);
        // String over 100 chars should have preview instead of value
        $this->assertArrayHasKey('preview', $contextData['context']['longString']);
    }
}
