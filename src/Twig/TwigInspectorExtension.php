<?php declare(strict_types=1);

namespace MnkysDevTools\Twig;

use MnkysDevTools\Service\DevToolsConfigService;
use MnkysDevTools\Twig\Node\InspectorNodeVisitor;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

class TwigInspectorExtension extends AbstractExtension
{
    private const SKIP_TAGS = [
        'html', 'head', 'meta', 'link', 'title', 'base',
        'script', 'style', 'noscript',
        'br', 'hr', 'img', 'input', 'area', 'col', 'embed',
        'param', 'source', 'track', 'wbr',
        '!doctype', '!--'
    ];

    private array $registeredBlocks = [];
    
    /**
     * Store context data for each block, indexed by a unique block ID
     */
    private array $blockContextData = [];
    
    /**
     * Counter for generating unique block IDs
     */
    private int $blockIdCounter = 0;

    public function __construct(private readonly DevToolsConfigService $config)
    {
    }

    public function getNodeVisitors(): array
    {
        if (!$this->config->isDevEnvironment() || !$this->config->isEnabled()) {
            return [];
        }

        return [new InspectorNodeVisitor($this)];
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('devtools_render_block_data', [$this, 'renderBlockData'], ['is_safe' => ['html']]),
        ];
    }

    /**
     * Inject block data attribute into the first suitable HTML element
     * 
     * @param string $output The rendered block output
     * @param string $blockDataJson JSON-encoded block metadata
     * @param array $context The Twig context available in this block
     */
    public function injectBlockAttribute(string $output, string $blockDataJson, array $context = []): string
    {
        if (trim($output) === '') {
            return $output;
        }

        $blockData = json_decode($blockDataJson, true);
        if (!$blockData) {
            return $output;
        }
        
        // Generate a unique block ID for this render
        $blockId = $this->generateBlockId($blockData);
        $blockData['blockId'] = $blockId;
        
        // Analyze and store context data for this block
        $contextInfo = $this->analyzeContext($context);
        $blockData['contextKeys'] = array_keys($contextInfo);
        
        // Store full context analysis for later retrieval via API
        $this->blockContextData[$blockId] = [
            'block' => $blockData['block'],
            'template' => $blockData['template'],
            'line' => $blockData['line'],
            'context' => $contextInfo,
        ];
        
        // Register for block list
        $this->registeredBlocks[] = $blockData;

        // Re-encode block data with the new blockId
        $newBlockDataJson = json_encode($blockData, JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);
        
        $injected = false;
        
        $result = preg_replace_callback(
            '/<([a-z][a-z0-9]*)((?:\s+[^>]*)?)(\/?)>/i',
            function ($matches) use ($newBlockDataJson, &$injected) {
                if ($injected) {
                    return $matches[0];
                }

                $tagName = strtolower($matches[1]);
                $attributes = $matches[2] ?? '';
                $selfClosing = $matches[3] ?? '';

                if (in_array($tagName, self::SKIP_TAGS) || strpos($attributes, 'data-twig-block') !== false) {
                    return $matches[0];
                }

                $injected = true;
                $dataAttr = ' data-twig-block="' . htmlspecialchars($newBlockDataJson, ENT_QUOTES, 'UTF-8') . '"';
                
                return $selfClosing 
                    ? '<' . $matches[1] . $attributes . $dataAttr . ' />'
                    : '<' . $matches[1] . $attributes . $dataAttr . '>';
            },
            $output
        );

        return $result ?? $output;
    }

    /**
     * Generate a unique block ID based on block data
     */
    private function generateBlockId(array $blockData): string
    {
        $this->blockIdCounter++;
        return sprintf(
            'b_%s_%d_%d',
            substr(md5($blockData['template'] . $blockData['block']), 0, 8),
            $blockData['line'],
            $this->blockIdCounter
        );
    }

    /**
     * Analyze context variables and return type information
     * Only captures keys and basic type info to keep data size manageable
     */
    private function analyzeContext(array $context): array
    {
        $analyzed = [];
        
        // Skip internal Twig variables
        $skipKeys = ['_parent', '_seq', '_key', '_iterated', 'loop', '_self', '__internal', 'app'];
        
        foreach ($context as $key => $value) {
            // Skip internal variables
            if (in_array($key, $skipKeys) || str_starts_with($key, '__')) {
                continue;
            }
            
            $analyzed[$key] = $this->getVariableInfo($value);
        }
        
        // Sort by key name for consistency
        ksort($analyzed);
        
        return $analyzed;
    }

    /**
     * Get basic type information for a variable
     */
    private function getVariableInfo(mixed $value, int $depth = 0): array
    {
        $maxDepth = 2;
        
        if ($value === null) {
            return ['type' => 'null'];
        }
        
        if (is_bool($value)) {
            return ['type' => 'bool', 'value' => $value];
        }
        
        if (is_int($value)) {
            return ['type' => 'int', 'value' => $value];
        }
        
        if (is_float($value)) {
            return ['type' => 'float', 'value' => round($value, 4)];
        }
        
        if (is_string($value)) {
            $len = strlen($value);
            $info = ['type' => 'string', 'length' => $len];
            if ($len <= 50) {
                $info['value'] = $value;
            } else {
                $info['preview'] = substr($value, 0, 50) . '...';
            }
            return $info;
        }
        
        if (is_array($value)) {
            $count = count($value);
            $info = ['type' => 'array', 'count' => $count];
            
            if ($depth < $maxDepth && $count > 0 && $count <= 10) {
                $isAssoc = array_keys($value) !== range(0, $count - 1);
                $info['isAssoc'] = $isAssoc;
                
                if ($isAssoc) {
                    $info['keys'] = array_slice(array_keys($value), 0, 10);
                }
            }
            
            return $info;
        }
        
        if (is_object($value)) {
            $className = get_class($value);
            $shortName = (new \ReflectionClass($value))->getShortName();
            
            $info = [
                'type' => 'object',
                'class' => $shortName,
                'fullClass' => $className,
            ];
            
            // Add count for countable objects
            if ($value instanceof \Countable) {
                $info['count'] = count($value);
            }
            
            // Try to get ID for entities
            if ($depth < $maxDepth && method_exists($value, 'getId')) {
                try {
                    $id = $value->getId();
                    if ($id !== null) {
                        $info['id'] = (string) $id;
                    }
                } catch (\Throwable) {}
            }
            
            // Try to get name for entities
            if ($depth < $maxDepth && method_exists($value, 'getName')) {
                try {
                    $name = $value->getName();
                    if ($name !== null && is_string($name)) {
                        $info['name'] = strlen($name) > 50 ? substr($name, 0, 50) . '...' : $name;
                    }
                } catch (\Throwable) {}
            }
            
            return $info;
        }
        
        return ['type' => gettype($value)];
    }

    public function getRegisteredBlocks(): array
    {
        return $this->registeredBlocks;
    }
    
    /**
     * Get context data for a specific block ID
     */
    public function getBlockContextData(string $blockId): ?array
    {
        return $this->blockContextData[$blockId] ?? null;
    }
    
    /**
     * Get all stored block context data
     */
    public function getAllBlockContextData(): array
    {
        return $this->blockContextData;
    }

    public function renderBlockData(): string
    {
        if (empty($this->registeredBlocks)) {
            return '';
        }

        $unique = [];
        foreach ($this->registeredBlocks as $block) {
            $key = $block['template'] . ':' . $block['block'] . ':' . $block['line'];
            $unique[$key] = $block;
        }

        $json = json_encode(array_values($unique), JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);
        
        // Also output context data as a separate script tag
        $contextJson = json_encode($this->blockContextData, JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE);
        
        return '<script id="devtools-block-data" type="application/json">' . $json . '</script>' .
               '<script id="devtools-context-data" type="application/json">' . $contextJson . '</script>';
    }

    public function isEnabled(): bool
    {
        return $this->config->isDevEnvironment() && $this->config->isEnabled();
    }
}
