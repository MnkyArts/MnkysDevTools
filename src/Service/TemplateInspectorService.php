<?php declare(strict_types=1);

namespace MnkysDevTools\Service;

use Symfony\Component\HttpKernel\KernelInterface;

/**
 * Service for inspecting Twig templates - extracting hierarchy, source code, and block information
 */
class TemplateInspectorService
{
    public function __construct(
        private readonly KernelInterface $kernel,
        private readonly EditorService $editorService,
        private readonly DevToolsConfigService $config,
        private readonly VariableAnalyzer $variableAnalyzer
    ) {}

    /**
     * Get comprehensive information about a template block
     */
    public function getBlockInfo(string $templatePath, string $blockName, int $line): array
    {
        $absolutePath = $this->editorService->resolveTemplatePath($templatePath);
        
        if (!$absolutePath || !file_exists($absolutePath)) {
            return ['error' => 'Template file not found'];
        }

        if (!$this->editorService->isPathAllowed($absolutePath)) {
            return ['error' => 'Access denied to template file'];
        }

        $source = file_get_contents($absolutePath);
        
        return [
            'block' => $blockName,
            'template' => $templatePath,
            'absolutePath' => $absolutePath,
            'line' => $line,
            'hierarchy' => $this->getTemplateHierarchy($absolutePath, $templatePath),
            'source' => $this->extractBlockSource($source, $blockName, $line),
            'blocks' => $this->extractAllBlocks($source),
            'parentTemplate' => $this->getParentTemplate($source),
        ];
    }

    /**
     * Get the template inheritance hierarchy
     */
    public function getTemplateHierarchy(string $absolutePath, string $templatePath): array
    {
        $hierarchy = [];
        $currentPath = $absolutePath;
        $currentTemplate = $templatePath;
        $visited = [];
        $maxDepth = 10; // Prevent infinite loops
        
        while ($currentPath && $maxDepth > 0) {
            if (in_array($currentPath, $visited)) {
                break; // Circular reference protection
            }
            $visited[] = $currentPath;
            
            if (!file_exists($currentPath)) {
                break;
            }
            
            $source = file_get_contents($currentPath);
            $parentTemplate = $this->getParentTemplate($source);
            $blocksData = $this->extractAllBlocks($source);
            
            $hierarchy[] = [
                'template' => $currentTemplate,
                'absolutePath' => $currentPath,
                'blocks' => array_keys($blocksData['flat']),
                'isRoot' => $parentTemplate === null,
            ];
            
            if (!$parentTemplate) {
                break;
            }
            
            $currentTemplate = $parentTemplate;
            $currentPath = $this->editorService->resolveTemplatePath($parentTemplate);
            $maxDepth--;
        }
        
        return array_reverse($hierarchy); // Root first
    }

    /**
     * Extract the parent template from {% extends %} statement
     */
    public function getParentTemplate(string $source): ?string
    {
        // Match {% extends "template" %} or {% extends 'template' %}
        if (preg_match('/\{%\s*extends\s+["\']([^"\']+)["\']\s*%\}/', $source, $matches)) {
            return $matches[1];
        }
        
        // Match {% sw_extends "template" %}
        if (preg_match('/\{%\s*sw_extends\s+["\']([^"\']+)["\']\s*%\}/', $source, $matches)) {
            return $matches[1];
        }
        
        return null;
    }

    /**
     * Extract source code for a specific block
     */
    public function extractBlockSource(string $source, string $blockName, int $startLine): array
    {
        $lines = explode("\n", $source);
        $totalLines = count($lines);
        
        // Find the block start and end
        $blockStart = null;
        $blockEnd = null;
        $depth = 0;
        $inTargetBlock = false;
        
        foreach ($lines as $index => $line) {
            $lineNum = $index + 1;
            
            // Look for block start
            if (preg_match('/\{%\s*block\s+' . preg_quote($blockName, '/') . '\s*%\}/', $line)) {
                $blockStart = $lineNum;
                $inTargetBlock = true;
                $depth = 1;
                continue;
            }
            
            if ($inTargetBlock) {
                // Count nested blocks
                if (preg_match('/\{%\s*block\s+\w+\s*%\}/', $line)) {
                    $depth++;
                }
                if (preg_match('/\{%\s*endblock\s*%\}/', $line)) {
                    $depth--;
                    if ($depth === 0) {
                        $blockEnd = $lineNum;
                        break;
                    }
                }
            }
        }
        
        // If we couldn't find the block boundaries, use a range around the given line
        if ($blockStart === null) {
            $blockStart = max(1, $startLine - 5);
            $blockEnd = min($totalLines, $startLine + 20);
        }
        
        // Extract source with context (5 lines before, all block content)
        $contextStart = max(1, $blockStart - 5);
        $contextEnd = min($totalLines, $blockEnd ?? $startLine + 30);
        
        $sourceLines = [];
        for ($i = $contextStart; $i <= $contextEnd; $i++) {
            $sourceLines[] = [
                'number' => $i,
                'content' => $lines[$i - 1] ?? '',
                'isBlockLine' => $blockStart !== null && $i >= $blockStart && $i <= ($blockEnd ?? $i),
                'isStartLine' => $i === $blockStart,
            ];
        }
        
        return [
            'lines' => $sourceLines,
            'blockStart' => $blockStart,
            'blockEnd' => $blockEnd,
            'totalLines' => $totalLines,
        ];
    }

    /**
     * Extract all block definitions from a template with nesting structure
     */
    public function extractAllBlocks(string $source): array
    {
        $blocks = [];
        $lines = explode("\n", $source);
        $stack = []; // Track parent blocks
        $blockTree = []; // Root level blocks
        
        foreach ($lines as $index => $line) {
            $lineNum = $index + 1;
            
            // Check for block start
            if (preg_match('/\{%\s*block\s+(\w+)\s*%\}/', $line, $matches)) {
                $blockName = $matches[1];
                $depth = count($stack);
                $parentName = !empty($stack) ? end($stack) : null;
                
                $blockData = [
                    'name' => $blockName,
                    'line' => $lineNum,
                    'depth' => $depth,
                    'parent' => $parentName,
                    'children' => [],
                ];
                
                $blocks[$blockName] = $blockData;
                
                // Add to parent's children or root
                if ($parentName !== null && isset($blocks[$parentName])) {
                    $blocks[$parentName]['children'][] = $blockName;
                } else {
                    $blockTree[] = $blockName;
                }
                
                // Push to stack
                $stack[] = $blockName;
            }
            
            // Check for block end
            if (preg_match('/\{%\s*endblock\s*%\}/', $line)) {
                array_pop($stack);
            }
        }
        
        return [
            'flat' => $blocks,
            'tree' => $blockTree,
        ];
    }

    /**
     * Analyze context variables and return their types/structure
     * This creates a schema from actual context data captured at runtime
     */
    public function analyzeContextVariables(array $context): array
    {
        return $this->variableAnalyzer->analyzeContext($context, $this->config->getMaxVariableDepth());
    }

    /**
     * Get commonly available Shopware context variables for documentation
     */
    public function getCommonContextVariables(): array
    {
        return [
            'page' => 'Current page struct containing all page data',
            'context' => 'Sales channel context with customer, currency, etc.',
            'salesChannelContext' => 'Alias for context',
            'product' => 'Product entity (on product pages)',
            'customer' => 'Current logged-in customer or null',
            'lineItem' => 'Line item in cart/checkout contexts',
            'element' => 'CMS element being rendered',
            'block' => 'CMS block containing elements',
            'section' => 'CMS section containing blocks',
            'cmsPage' => 'Full CMS page structure',
            'listing' => 'Product listing result (on listing pages)',
            'searchResult' => 'Search result (on search pages)',
            'navigationTree' => 'Navigation/menu structure',
            'salutation' => 'Salutation entity',
            'country' => 'Country entity',
            'currency' => 'Currency entity',
        ];
    }
}
