<?php declare(strict_types=1);

namespace MnkysDevTools\Tests\Service;

use MnkysDevTools\Service\DevToolsConfigService;
use MnkysDevTools\Service\EditorService;
use MnkysDevTools\Service\TemplateInspectorService;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Symfony\Component\HttpKernel\KernelInterface;

class TemplateInspectorServiceTest extends TestCase
{
    private MockObject&KernelInterface $kernel;
    private MockObject&EditorService $editorService;
    private MockObject&DevToolsConfigService $config;
    private string $tempDir;

    protected function setUp(): void
    {
        $this->kernel = $this->createMock(KernelInterface::class);
        $this->editorService = $this->createMock(EditorService::class);
        $this->config = $this->createMock(DevToolsConfigService::class);
        
        // Create a temporary directory structure for testing
        $this->tempDir = sys_get_temp_dir() . '/mnkys_devtools_test_' . uniqid();
        mkdir($this->tempDir, 0777, true);
        
        $this->kernel
            ->method('getProjectDir')
            ->willReturn($this->tempDir);
    }

    protected function tearDown(): void
    {
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

    private function createService(): TemplateInspectorService
    {
        return new TemplateInspectorService($this->kernel, $this->editorService, $this->config);
    }

    private function createTemplateFile(string $relativePath, string $content): string
    {
        $fullPath = $this->tempDir . '/' . $relativePath;
        @mkdir(dirname($fullPath), 0777, true);
        file_put_contents($fullPath, $content);
        return $fullPath;
    }

    // ==================== getBlockInfo() ====================

    public function testGetBlockInfoReturnsErrorForNonExistentTemplate(): void
    {
        $this->editorService
            ->method('resolveTemplatePath')
            ->willReturn(null);

        $service = $this->createService();
        $result = $service->getBlockInfo('@Storefront/non-existent.html.twig', 'content', 1);

        $this->assertArrayHasKey('error', $result);
        $this->assertSame('Template file not found', $result['error']);
    }

    public function testGetBlockInfoReturnsErrorForDisallowedPath(): void
    {
        $templatePath = $this->createTemplateFile('templates/test.html.twig', '{% block test %}{% endblock %}');
        
        $this->editorService
            ->method('resolveTemplatePath')
            ->willReturn($templatePath);
        $this->editorService
            ->method('isPathAllowed')
            ->willReturn(false);

        $service = $this->createService();
        $result = $service->getBlockInfo('@Storefront/test.html.twig', 'test', 1);

        $this->assertArrayHasKey('error', $result);
        $this->assertSame('Access denied to template file', $result['error']);
    }

    public function testGetBlockInfoReturnsCompleteBlockData(): void
    {
        $templateContent = "{% block header %}\n<header>Test</header>\n{% endblock %}";
        $templatePath = $this->createTemplateFile('templates/test.html.twig', $templateContent);
        
        $this->editorService
            ->method('resolveTemplatePath')
            ->willReturn($templatePath);
        $this->editorService
            ->method('isPathAllowed')
            ->willReturn(true);

        $service = $this->createService();
        $result = $service->getBlockInfo('@Storefront/test.html.twig', 'header', 1);

        $this->assertArrayHasKey('block', $result);
        $this->assertArrayHasKey('template', $result);
        $this->assertArrayHasKey('absolutePath', $result);
        $this->assertArrayHasKey('line', $result);
        $this->assertArrayHasKey('hierarchy', $result);
        $this->assertArrayHasKey('source', $result);
        $this->assertArrayHasKey('blocks', $result);
        
        $this->assertSame('header', $result['block']);
        $this->assertSame('@Storefront/test.html.twig', $result['template']);
        $this->assertSame($templatePath, $result['absolutePath']);
    }

    // ==================== getParentTemplate() ====================

    public function testGetParentTemplateExtractsExtendsStatement(): void
    {
        $source = "{% extends '@Storefront/base.html.twig' %}\n{% block content %}{% endblock %}";
        
        $service = $this->createService();
        $result = $service->getParentTemplate($source);

        $this->assertSame('@Storefront/base.html.twig', $result);
    }

    public function testGetParentTemplateExtractsSwExtendsStatement(): void
    {
        $source = "{% sw_extends '@Storefront/base.html.twig' %}\n{% block content %}{% endblock %}";
        
        $service = $this->createService();
        $result = $service->getParentTemplate($source);

        $this->assertSame('@Storefront/base.html.twig', $result);
    }

    public function testGetParentTemplateReturnsNullForRootTemplate(): void
    {
        $source = "{% block content %}Root content{% endblock %}";
        
        $service = $this->createService();
        $result = $service->getParentTemplate($source);

        $this->assertNull($result);
    }

    public function testGetParentTemplateHandlesDoubleQuotes(): void
    {
        $source = '{% extends "@Storefront/base.html.twig" %}';
        
        $service = $this->createService();
        $result = $service->getParentTemplate($source);

        $this->assertSame('@Storefront/base.html.twig', $result);
    }

    public function testGetParentTemplateHandlesSingleQuotes(): void
    {
        $source = "{% extends '@Storefront/base.html.twig' %}";
        
        $service = $this->createService();
        $result = $service->getParentTemplate($source);

        $this->assertSame('@Storefront/base.html.twig', $result);
    }

    // ==================== extractBlockSource() ====================

    public function testExtractBlockSourceFindsBlockBoundaries(): void
    {
        $source = <<<TWIG
{% block header %}
<header>
    <nav>Navigation</nav>
</header>
{% endblock %}
TWIG;

        $service = $this->createService();
        $result = $service->extractBlockSource($source, 'header', 1);

        $this->assertArrayHasKey('lines', $result);
        $this->assertArrayHasKey('blockStart', $result);
        $this->assertArrayHasKey('blockEnd', $result);
        $this->assertSame(1, $result['blockStart']);
        $this->assertSame(5, $result['blockEnd']);
    }

    public function testExtractBlockSourceHandlesNestedBlocks(): void
    {
        $source = <<<TWIG
{% block outer %}
    {% block inner %}
        <div>Inner content</div>
    {% endblock %}
{% endblock %}
TWIG;

        $service = $this->createService();
        $result = $service->extractBlockSource($source, 'outer', 1);

        $this->assertSame(1, $result['blockStart']);
        $this->assertSame(5, $result['blockEnd']);
    }

    public function testExtractBlockSourceIncludesContextLines(): void
    {
        $source = <<<TWIG
{# Comment line 1 #}
{# Comment line 2 #}
{# Comment line 3 #}
{# Comment line 4 #}
{# Comment line 5 #}
{# Comment line 6 #}
{% block content %}
<div>Content</div>
{% endblock %}
TWIG;

        $service = $this->createService();
        $result = $service->extractBlockSource($source, 'content', 7);

        // Block is at lines 7-9, context starts at line 2 (7 - 5), so lines 2-9 = 8 lines
        $this->assertCount(8, $result['lines']); // 5 context + 3 block lines
        $this->assertSame(2, $result['lines'][0]['number']); // Starts at line 2 (7 - 5)
    }

    public function testExtractBlockSourceMarksBlockLines(): void
    {
        $source = <<<TWIG
{% block test %}
<div>Test</div>
{% endblock %}
TWIG;

        $service = $this->createService();
        $result = $service->extractBlockSource($source, 'test', 1);

        foreach ($result['lines'] as $line) {
            if ($line['number'] >= 1 && $line['number'] <= 3) {
                $this->assertTrue($line['isBlockLine']);
            }
        }
        
        $this->assertTrue($result['lines'][0]['isStartLine']);
    }

    // ==================== extractAllBlocks() ====================

    public function testExtractAllBlocksFindsAllBlocks(): void
    {
        $source = <<<TWIG
{% block header %}Header{% endblock %}
{% block content %}Content{% endblock %}
{% block footer %}Footer{% endblock %}
TWIG;

        $service = $this->createService();
        $result = $service->extractAllBlocks($source);

        $this->assertArrayHasKey('flat', $result);
        $this->assertArrayHasKey('tree', $result);
        $this->assertCount(3, $result['flat']);
        $this->assertArrayHasKey('header', $result['flat']);
        $this->assertArrayHasKey('content', $result['flat']);
        $this->assertArrayHasKey('footer', $result['flat']);
    }

    public function testExtractAllBlocksDetectsNesting(): void
    {
        $source = <<<TWIG
{% block parent %}
    {% block child %}
        Child content
    {% endblock %}
{% endblock %}
TWIG;

        $service = $this->createService();
        $result = $service->extractAllBlocks($source);

        $this->assertSame(0, $result['flat']['parent']['depth']);
        $this->assertSame(1, $result['flat']['child']['depth']);
        $this->assertSame('parent', $result['flat']['child']['parent']);
        $this->assertContains('child', $result['flat']['parent']['children']);
    }

    public function testExtractAllBlocksBuildsBlockTree(): void
    {
        $source = <<<TWIG
{% block header %}Header{% endblock %}
{% block content %}
    {% block sidebar %}Sidebar{% endblock %}
    {% block main %}Main{% endblock %}
{% endblock %}
TWIG;

        $service = $this->createService();
        $result = $service->extractAllBlocks($source);

        // Root level blocks
        $this->assertContains('header', $result['tree']);
        $this->assertContains('content', $result['tree']);
        $this->assertNotContains('sidebar', $result['tree']);
        $this->assertNotContains('main', $result['tree']);
    }

    public function testExtractAllBlocksRecordsLineNumbers(): void
    {
        $source = <<<TWIG
{% block first %}First{% endblock %}

{% block second %}Second{% endblock %}
TWIG;

        $service = $this->createService();
        $result = $service->extractAllBlocks($source);

        $this->assertSame(1, $result['flat']['first']['line']);
        $this->assertSame(3, $result['flat']['second']['line']);
    }

    // ==================== getTemplateHierarchy() ====================

    public function testGetTemplateHierarchyBuildsInheritanceChain(): void
    {
        // Create parent template
        $parentContent = "{% block content %}Parent content{% endblock %}";
        $parentPath = $this->createTemplateFile('templates/parent.html.twig', $parentContent);
        
        // Create child template
        $childContent = "{% extends 'templates/parent.html.twig' %}\n{% block content %}Child content{% endblock %}";
        $childPath = $this->createTemplateFile('templates/child.html.twig', $childContent);

        $this->editorService
            ->method('resolveTemplatePath')
            ->willReturnCallback(function ($path) use ($parentPath, $childPath) {
                if (str_contains($path, 'parent')) {
                    return $parentPath;
                }
                if (str_contains($path, 'child')) {
                    return $childPath;
                }
                return null;
            });

        $service = $this->createService();
        $result = $service->getTemplateHierarchy($childPath, '@Test/child.html.twig');

        $this->assertCount(2, $result);
        // Root first (parent)
        $this->assertTrue($result[0]['isRoot']);
        // Child second
        $this->assertFalse($result[1]['isRoot']);
    }

    public function testGetTemplateHierarchyHandlesMaxDepth(): void
    {
        // Create a deeply nested template chain (more than 10 levels)
        $templates = [];
        for ($i = 0; $i < 15; $i++) {
            $parent = $i > 0 ? "{% extends 'templates/level{$i}.html.twig' %}\n" : '';
            $content = "{$parent}{% block content %}Level " . ($i + 1) . "{% endblock %}";
            $templates[$i] = $this->createTemplateFile("templates/level" . ($i + 1) . ".html.twig", $content);
        }

        $this->editorService
            ->method('resolveTemplatePath')
            ->willReturnCallback(function ($path) use ($templates) {
                if (preg_match('/level(\d+)/', $path, $matches)) {
                    $level = (int)$matches[1] - 1;
                    return $templates[$level] ?? null;
                }
                return null;
            });

        $service = $this->createService();
        $result = $service->getTemplateHierarchy($templates[14], 'templates/level15.html.twig');

        // Should stop at max depth (10)
        $this->assertLessThanOrEqual(11, count($result));
    }

    public function testGetTemplateHierarchyHandlesCircularReference(): void
    {
        // Create templates that reference each other
        $contentA = "{% extends 'templates/b.html.twig' %}\n{% block content %}A{% endblock %}";
        $contentB = "{% extends 'templates/a.html.twig' %}\n{% block content %}B{% endblock %}";
        
        $pathA = $this->createTemplateFile('templates/a.html.twig', $contentA);
        $pathB = $this->createTemplateFile('templates/b.html.twig', $contentB);

        $this->editorService
            ->method('resolveTemplatePath')
            ->willReturnCallback(function ($path) use ($pathA, $pathB) {
                if (str_contains($path, '/a.html.twig')) {
                    return $pathA;
                }
                if (str_contains($path, '/b.html.twig')) {
                    return $pathB;
                }
                return null;
            });

        $service = $this->createService();
        $result = $service->getTemplateHierarchy($pathA, 'templates/a.html.twig');

        // Should not infinite loop - circular reference protection
        $this->assertNotEmpty($result);
        $this->assertLessThanOrEqual(3, count($result)); // A, B, then stop at A again
    }

    // ==================== analyzeContextVariables() ====================

    public function testAnalyzeContextVariablesSkipsInternalVariables(): void
    {
        $context = [
            '_parent' => [],
            '_seq' => [],
            '_key' => 'test',
            'loop' => [],
            '_self' => 'self',
            '__internal' => 'internal',
            'myVariable' => 'value',
        ];

        $service = $this->createService();
        $result = $service->analyzeContextVariables($context);

        $this->assertArrayNotHasKey('_parent', $result);
        $this->assertArrayNotHasKey('_seq', $result);
        $this->assertArrayNotHasKey('_key', $result);
        $this->assertArrayNotHasKey('loop', $result);
        $this->assertArrayNotHasKey('_self', $result);
        $this->assertArrayNotHasKey('__internal', $result);
        $this->assertArrayHasKey('myVariable', $result);
    }

    public function testAnalyzeContextVariablesAnalyzesNullValue(): void
    {
        $context = ['nullVar' => null];

        $service = $this->createService();
        $result = $service->analyzeContextVariables($context);

        $this->assertSame('null', $result['nullVar']['type']);
        $this->assertNull($result['nullVar']['value']);
    }

    public function testAnalyzeContextVariablesAnalyzesBooleanValue(): void
    {
        $context = ['boolTrue' => true, 'boolFalse' => false];

        $service = $this->createService();
        $result = $service->analyzeContextVariables($context);

        $this->assertSame('bool', $result['boolTrue']['type']);
        $this->assertTrue($result['boolTrue']['value']);
        $this->assertSame('bool', $result['boolFalse']['type']);
        $this->assertFalse($result['boolFalse']['value']);
    }

    public function testAnalyzeContextVariablesAnalyzesIntegerValue(): void
    {
        $context = ['intVar' => 42];

        $service = $this->createService();
        $result = $service->analyzeContextVariables($context);

        $this->assertSame('int', $result['intVar']['type']);
        $this->assertSame(42, $result['intVar']['value']);
    }

    public function testAnalyzeContextVariablesAnalyzesFloatValue(): void
    {
        $context = ['floatVar' => 3.14];

        $service = $this->createService();
        $result = $service->analyzeContextVariables($context);

        $this->assertSame('float', $result['floatVar']['type']);
        $this->assertSame(3.14, $result['floatVar']['value']);
    }

    public function testAnalyzeContextVariablesAnalyzesStringValue(): void
    {
        $context = ['shortString' => 'hello', 'longString' => str_repeat('a', 150)];

        $service = $this->createService();
        $result = $service->analyzeContextVariables($context);

        $this->assertSame('string', $result['shortString']['type']);
        $this->assertSame('hello', $result['shortString']['value']);
        $this->assertSame(5, $result['shortString']['length']);
        
        $this->assertSame('string', $result['longString']['type']);
        $this->assertSame(150, $result['longString']['length']);
        $this->assertStringEndsWith('...', $result['longString']['value']); // Truncated
    }

    public function testAnalyzeContextVariablesAnalyzesArrayValue(): void
    {
        $context = [
            'indexedArray' => [1, 2, 3],
            'assocArray' => ['key1' => 'value1', 'key2' => 'value2'],
        ];

        $service = $this->createService();
        $result = $service->analyzeContextVariables($context);

        $this->assertSame('list', $result['indexedArray']['type']);
        $this->assertSame(3, $result['indexedArray']['count']);
        
        $this->assertSame('array', $result['assocArray']['type']);
        $this->assertSame(2, $result['assocArray']['count']);
    }

    public function testAnalyzeContextVariablesAnalyzesObjectValue(): void
    {
        $object = new \stdClass();
        $context = ['object' => $object];

        $service = $this->createService();
        $result = $service->analyzeContextVariables($context);

        $this->assertSame('object', $result['object']['type']);
        $this->assertSame('stdClass', $result['object']['class']);
        $this->assertSame('stdClass', $result['object']['fullClass']);
    }

    public function testAnalyzeContextVariablesHandlesObjectWithGetId(): void
    {
        $object = new class {
            public function getId(): string
            {
                return 'test-id-123';
            }
        };
        $context = ['entity' => $object];

        $service = $this->createService();
        $result = $service->analyzeContextVariables($context);

        $this->assertArrayHasKey('properties', $result['entity']);
        $this->assertArrayHasKey('id', $result['entity']['properties']);
    }

    public function testAnalyzeContextVariablesHandlesObjectWithGetName(): void
    {
        $object = new class {
            public function getName(): string
            {
                return 'Test Name';
            }
        };
        $context = ['entity' => $object];

        $service = $this->createService();
        $result = $service->analyzeContextVariables($context);

        $this->assertArrayHasKey('properties', $result['entity']);
        $this->assertArrayHasKey('name', $result['entity']['properties']);
    }

    public function testAnalyzeContextVariablesHandlesCountableObject(): void
    {
        $collection = new \ArrayObject([1, 2, 3, 4, 5]);
        $context = ['collection' => $collection];

        $service = $this->createService();
        $result = $service->analyzeContextVariables($context);

        $this->assertArrayHasKey('properties', $result['collection']);
        $this->assertArrayHasKey('_count', $result['collection']['properties']);
        $this->assertSame(5, $result['collection']['properties']['_count']['value']);
    }

    public function testAnalyzeContextVariablesSortsResults(): void
    {
        $context = [
            'zebra' => 1,
            'apple' => 2,
            'mango' => 3,
        ];

        $service = $this->createService();
        $result = $service->analyzeContextVariables($context);

        $keys = array_keys($result);
        $this->assertSame(['apple', 'mango', 'zebra'], $keys);
    }

    // ==================== getCommonContextVariables() ====================

    public function testGetCommonContextVariablesReturnsExpectedKeys(): void
    {
        $service = $this->createService();
        $result = $service->getCommonContextVariables();

        $this->assertArrayHasKey('page', $result);
        $this->assertArrayHasKey('context', $result);
        $this->assertArrayHasKey('product', $result);
        $this->assertArrayHasKey('customer', $result);
        $this->assertIsString($result['page']);
    }
}
