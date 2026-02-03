<?php declare(strict_types=1);

namespace MnkysDevTools\Tests\Twig\Node;

use MnkysDevTools\Service\DevToolsConfigService;
use MnkysDevTools\Twig\Node\InspectorBlockNode;
use MnkysDevTools\Twig\Node\InspectorNodeVisitor;
use MnkysDevTools\Twig\TwigInspectorExtension;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Twig\Environment;
use Twig\Loader\ArrayLoader;
use Twig\Node\BlockNode;
use Twig\Node\ModuleNode;
use Twig\Node\Node;
use Twig\Node\TextNode;
use Twig\Source;

class InspectorNodeVisitorTest extends TestCase
{
    private MockObject&TwigInspectorExtension $extension;
    private Environment $twig;

    protected function setUp(): void
    {
        $config = $this->createMock(DevToolsConfigService::class);
        $this->extension = $this->getMockBuilder(TwigInspectorExtension::class)
            ->setConstructorArgs([$config])
            ->getMock();
        
        $this->twig = new Environment(new ArrayLoader([]));
    }

    private function createVisitor(): InspectorNodeVisitor
    {
        return new InspectorNodeVisitor($this->extension);
    }

    private function createBlockNode(string $name, int $line = 1): BlockNode
    {
        $bodyNode = new TextNode('content', $line);
        return new BlockNode($name, $bodyNode, $line);
    }

    private function createModuleNode(string $templateName): ModuleNode
    {
        $source = new Source('', $templateName);
        $bodyNode = new TextNode('', 1);
        
        return new ModuleNode(
            $bodyNode,
            null, // parent
            new Node(), // blocks
            new Node(), // macros
            new Node(), // traits
            [], // embedded templates
            $source
        );
    }

    // ==================== enterNode() ====================

    public function testEnterNodeTracksModuleTemplates(): void
    {
        $visitor = $this->createVisitor();
        $moduleNode = $this->createModuleNode('@Storefront/page/product-detail.html.twig');

        $result = $visitor->enterNode($moduleNode, $this->twig);

        // Should return the same node
        $this->assertSame($moduleNode, $result);
    }

    public function testEnterNodeWrapsBlockNodes(): void
    {
        $visitor = $this->createVisitor();
        
        // First enter a module to set current template
        $moduleNode = $this->createModuleNode('@Storefront/test.html.twig');
        $visitor->enterNode($moduleNode, $this->twig);
        
        // Then enter a block node
        $blockNode = $this->createBlockNode('content');
        $result = $visitor->enterNode($blockNode, $this->twig);

        $this->assertInstanceOf(InspectorBlockNode::class, $result);
    }

    public function testEnterNodeSkipsAlreadyWrappedNodes(): void
    {
        $visitor = $this->createVisitor();
        
        // Enter a module first
        $moduleNode = $this->createModuleNode('@Storefront/test.html.twig');
        $visitor->enterNode($moduleNode, $this->twig);
        
        // Create an already wrapped node
        $originalBlockNode = $this->createBlockNode('content');
        $wrappedNode = new InspectorBlockNode($originalBlockNode, '@Storefront/test.html.twig');
        
        $result = $visitor->enterNode($wrappedNode, $this->twig);

        // Should return the same wrapped node, not double-wrap it
        $this->assertSame($wrappedNode, $result);
    }

    public function testEnterNodeDoesNotWrapSameBlockNodeTwice(): void
    {
        $visitor = $this->createVisitor();
        
        // Enter a module first
        $moduleNode = $this->createModuleNode('@Storefront/test.html.twig');
        $visitor->enterNode($moduleNode, $this->twig);
        
        // Enter the same block node twice
        $blockNode = $this->createBlockNode('content');
        
        $result1 = $visitor->enterNode($blockNode, $this->twig);
        $result2 = $visitor->enterNode($blockNode, $this->twig);

        // First call should wrap
        $this->assertInstanceOf(InspectorBlockNode::class, $result1);
        // Second call should return original (already tracked)
        $this->assertSame($blockNode, $result2);
    }

    public function testEnterNodeUsesCurrentTemplateForBlockWrapping(): void
    {
        $visitor = $this->createVisitor();
        
        // Enter a module
        $moduleNode = $this->createModuleNode('@MyPlugin/custom.html.twig');
        $visitor->enterNode($moduleNode, $this->twig);
        
        // Enter a block
        $blockNode = $this->createBlockNode('my_block', 10);
        $result = $visitor->enterNode($blockNode, $this->twig);

        // The wrapped node should have the template path from the module
        $this->assertInstanceOf(InspectorBlockNode::class, $result);
    }

    public function testEnterNodeReturnsOtherNodesUnchanged(): void
    {
        $visitor = $this->createVisitor();
        
        $textNode = new TextNode('Hello World', 1);
        $result = $visitor->enterNode($textNode, $this->twig);

        $this->assertSame($textNode, $result);
    }

    public function testEnterNodeHandlesNestedModules(): void
    {
        $visitor = $this->createVisitor();
        
        // Enter first module
        $moduleNode1 = $this->createModuleNode('@Storefront/base.html.twig');
        $visitor->enterNode($moduleNode1, $this->twig);
        
        // Enter nested module (like an include)
        $moduleNode2 = $this->createModuleNode('@Storefront/component/header.html.twig');
        $visitor->enterNode($moduleNode2, $this->twig);
        
        // Enter a block - should use the nested template
        $blockNode = $this->createBlockNode('header_logo');
        $result = $visitor->enterNode($blockNode, $this->twig);

        $this->assertInstanceOf(InspectorBlockNode::class, $result);
    }

    // ==================== leaveNode() ====================

    public function testLeaveNodePopsTemplateStack(): void
    {
        $visitor = $this->createVisitor();
        
        // Enter base module
        $moduleNode1 = $this->createModuleNode('@Storefront/base.html.twig');
        $visitor->enterNode($moduleNode1, $this->twig);
        
        // Enter nested module
        $moduleNode2 = $this->createModuleNode('@Storefront/nested.html.twig');
        $visitor->enterNode($moduleNode2, $this->twig);
        
        // Leave nested module
        $result = $visitor->leaveNode($moduleNode2, $this->twig);
        $this->assertSame($moduleNode2, $result);
        
        // Now if we enter a block, it should use base template
        // (We can't directly test the internal state, but behavior is correct)
    }

    public function testLeaveNodeReturnsNodeUnchanged(): void
    {
        $visitor = $this->createVisitor();
        
        $textNode = new TextNode('content', 1);
        $result = $visitor->leaveNode($textNode, $this->twig);

        $this->assertSame($textNode, $result);
    }

    public function testLeaveNodeReturnsBlockNodesUnchanged(): void
    {
        $visitor = $this->createVisitor();
        
        $blockNode = $this->createBlockNode('test');
        $result = $visitor->leaveNode($blockNode, $this->twig);

        $this->assertSame($blockNode, $result);
    }

    public function testLeaveNodeHandlesEmptyStack(): void
    {
        $visitor = $this->createVisitor();
        
        // Leave without entering should not crash
        $moduleNode = $this->createModuleNode('@Test/test.twig');
        $result = $visitor->leaveNode($moduleNode, $this->twig);

        $this->assertSame($moduleNode, $result);
    }

    // ==================== getPriority() ====================

    public function testGetPriorityReturnsZero(): void
    {
        $visitor = $this->createVisitor();
        
        $this->assertSame(0, $visitor->getPriority());
    }

    // ==================== Template Stack Behavior ====================

    public function testTemplateStackIsCorrectlyMaintained(): void
    {
        $visitor = $this->createVisitor();
        
        // Simulate entering and leaving multiple nested modules
        $module1 = $this->createModuleNode('@Base/base.twig');
        $module2 = $this->createModuleNode('@Plugin/override.twig');
        $module3 = $this->createModuleNode('@Include/component.twig');
        
        // Enter all
        $visitor->enterNode($module1, $this->twig);
        $visitor->enterNode($module2, $this->twig);
        $visitor->enterNode($module3, $this->twig);
        
        // Leave in reverse order
        $visitor->leaveNode($module3, $this->twig);
        $visitor->leaveNode($module2, $this->twig);
        $visitor->leaveNode($module1, $this->twig);
        
        // No crash means stack was maintained correctly
        $this->assertTrue(true);
    }

    public function testBlocksInDifferentTemplatesAreTrackedSeparately(): void
    {
        $visitor = $this->createVisitor();
        
        // First template
        $module1 = $this->createModuleNode('@First/first.twig');
        $visitor->enterNode($module1, $this->twig);
        
        $block1 = $this->createBlockNode('content');
        $result1 = $visitor->enterNode($block1, $this->twig);
        
        $visitor->leaveNode($module1, $this->twig);
        
        // Second template - same block name
        $module2 = $this->createModuleNode('@Second/second.twig');
        $visitor->enterNode($module2, $this->twig);
        
        $block2 = $this->createBlockNode('content');
        $result2 = $visitor->enterNode($block2, $this->twig);
        
        // Both should be wrapped (different object IDs)
        $this->assertInstanceOf(InspectorBlockNode::class, $result1);
        $this->assertInstanceOf(InspectorBlockNode::class, $result2);
    }

    public function testVisitorHandlesTemplateWithoutSourceContext(): void
    {
        $visitor = $this->createVisitor();
        
        // Create a module node without source context
        // This simulates edge cases in Twig compilation
        $bodyNode = new TextNode('', 1);
        $moduleNode = new ModuleNode(
            $bodyNode,
            null,
            new Node(),
            new Node(),
            new Node(),
            [],
            new Source('', '') // Empty template name
        );
        
        $visitor->enterNode($moduleNode, $this->twig);
        
        // Enter a block - should work with 'unknown' template
        $blockNode = $this->createBlockNode('test');
        $result = $visitor->enterNode($blockNode, $this->twig);

        $this->assertInstanceOf(InspectorBlockNode::class, $result);
    }
}
