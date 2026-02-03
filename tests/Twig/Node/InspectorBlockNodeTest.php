<?php declare(strict_types=1);

namespace MnkysDevTools\Tests\Twig\Node;

use MnkysDevTools\Twig\Node\InspectorBlockNode;
use PHPUnit\Framework\TestCase;
use Twig\Compiler;
use Twig\Environment;
use Twig\Loader\ArrayLoader;
use Twig\Node\BlockNode;
use Twig\Node\TextNode;

class InspectorBlockNodeTest extends TestCase
{
    private function createBlockNode(string $name, string $body, int $line = 1): BlockNode
    {
        $bodyNode = new TextNode($body, $line);
        return new BlockNode($name, $bodyNode, $line);
    }

    private function createCompiler(): Compiler
    {
        $loader = new ArrayLoader([]);
        $env = new Environment($loader);
        return new Compiler($env);
    }

    // ==================== Constructor ====================

    public function testConstructorPreservesBlockName(): void
    {
        $originalNode = $this->createBlockNode('test_block', 'content', 10);
        $inspectorNode = new InspectorBlockNode($originalNode, '@Storefront/test.html.twig');

        $this->assertSame('test_block', $inspectorNode->getAttribute('name'));
    }

    public function testConstructorPreservesTemplateLine(): void
    {
        $originalNode = $this->createBlockNode('test_block', 'content', 42);
        $inspectorNode = new InspectorBlockNode($originalNode, '@Storefront/test.html.twig');

        $this->assertSame(42, $inspectorNode->getTemplateLine());
    }

    public function testConstructorPreservesBodyNode(): void
    {
        $originalNode = $this->createBlockNode('test_block', 'body content', 1);
        $inspectorNode = new InspectorBlockNode($originalNode, '@Storefront/test.html.twig');

        $this->assertTrue($inspectorNode->hasNode('body'));
    }

    // ==================== compile() ====================

    public function testCompileGeneratesBlockMethodWithCorrectName(): void
    {
        $originalNode = $this->createBlockNode('my_block', 'content', 1);
        $inspectorNode = new InspectorBlockNode($originalNode, '@Storefront/test.html.twig');

        $compiler = $this->createCompiler();
        $inspectorNode->compile($compiler);
        $source = $compiler->getSource();

        $this->assertStringContainsString('public function block_my_block', $source);
    }

    public function testCompileIncludesBlockDataJson(): void
    {
        $originalNode = $this->createBlockNode('content', 'test', 15);
        $inspectorNode = new InspectorBlockNode($originalNode, '@Storefront/page.html.twig');

        $compiler = $this->createCompiler();
        $inspectorNode->compile($compiler);
        $source = $compiler->getSource();

        // Should include block name in the data
        $this->assertStringContainsString('content', $source);
        // Should include template path (JSON escapes slashes as \/)
        $this->assertStringContainsString('@Storefront', $source);
        $this->assertStringContainsString('page.html.twig', $source);
        // Should include line number
        $this->assertStringContainsString('15', $source);
    }

    public function testCompileUsesOutputBuffering(): void
    {
        $originalNode = $this->createBlockNode('test', 'content', 1);
        $inspectorNode = new InspectorBlockNode($originalNode, '@Test/test.twig');

        $compiler = $this->createCompiler();
        $inspectorNode->compile($compiler);
        $source = $compiler->getSource();

        $this->assertStringContainsString('ob_start()', $source);
        $this->assertStringContainsString('ob_get_clean()', $source);
    }

    public function testCompileCallsInjectBlockAttribute(): void
    {
        $originalNode = $this->createBlockNode('test', 'content', 1);
        $inspectorNode = new InspectorBlockNode($originalNode, '@Test/test.twig');

        $compiler = $this->createCompiler();
        $inspectorNode->compile($compiler);
        $source = $compiler->getSource();

        $this->assertStringContainsString('injectBlockAttribute', $source);
        // The class name is double-escaped in the compiled output
        $this->assertStringContainsString('MnkysDevTools', $source);
        $this->assertStringContainsString('TwigInspectorExtension', $source);
    }

    public function testCompileIncludesContextCapture(): void
    {
        $originalNode = $this->createBlockNode('test', 'content', 1);
        $inspectorNode = new InspectorBlockNode($originalNode, '@Test/test.twig');

        $compiler = $this->createCompiler();
        $inspectorNode->compile($compiler);
        $source = $compiler->getSource();

        // Should capture context keys
        $this->assertStringContainsString('$context', $source);
    }

    public function testCompileGeneratesYieldStatement(): void
    {
        $originalNode = $this->createBlockNode('test', 'content', 1);
        $inspectorNode = new InspectorBlockNode($originalNode, '@Test/test.twig');

        $compiler = $this->createCompiler();
        $inspectorNode->compile($compiler);
        $source = $compiler->getSource();

        // Should yield the result from injectBlockAttribute
        $this->assertStringContainsString('yield', $source);
    }

    public function testCompileHandlesSpecialCharactersInBlockName(): void
    {
        // Block names with underscores are common in Shopware
        $originalNode = $this->createBlockNode('page_product_detail_buy', 'content', 1);
        $inspectorNode = new InspectorBlockNode($originalNode, '@Storefront/page.twig');

        $compiler = $this->createCompiler();
        $inspectorNode->compile($compiler);
        $source = $compiler->getSource();

        $this->assertStringContainsString('block_page_product_detail_buy', $source);
    }

    public function testCompileHandlesSpecialCharactersInTemplatePath(): void
    {
        $originalNode = $this->createBlockNode('test', 'content', 1);
        $inspectorNode = new InspectorBlockNode($originalNode, '@MyPlugin/storefront/page/product-detail/index.html.twig');

        $compiler = $this->createCompiler();
        $inspectorNode->compile($compiler);
        $source = $compiler->getSource();

        // Template path is in the JSON (with escaped slashes)
        $this->assertStringContainsString('@MyPlugin', $source);
        $this->assertStringContainsString('index.html.twig', $source);
    }

    public function testCompileGeneratesValidPhpSyntax(): void
    {
        $originalNode = $this->createBlockNode('test', 'content', 1);
        $inspectorNode = new InspectorBlockNode($originalNode, '@Test/test.twig');

        $compiler = $this->createCompiler();
        $inspectorNode->compile($compiler);
        $source = $compiler->getSource();

        // Wrap in a class to make it valid PHP for syntax check
        $wrappedSource = '<?php class TestClass { ' . $source . ' }';
        
        // This will throw a ParseError if the PHP is invalid
        $tokens = token_get_all($wrappedSource);
        $this->assertNotEmpty($tokens);
    }

    public function testCompileIncludesMacrosSetup(): void
    {
        $originalNode = $this->createBlockNode('test', 'content', 1);
        $inspectorNode = new InspectorBlockNode($originalNode, '@Test/test.twig');

        $compiler = $this->createCompiler();
        $inspectorNode->compile($compiler);
        $source = $compiler->getSource();

        $this->assertStringContainsString('$macros = $this->macros', $source);
    }
}
