<?php declare(strict_types=1);

namespace MnkysDevTools\Twig;

use MnkysDevTools\Service\DevToolsConfigService;
use MnkysDevTools\Service\VariableAnalyzer;
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

    /**
     * Maximum number of blocks to track per request to prevent unbounded memory growth
     */
    private const MAX_TRACKED_BLOCKS = 500;

    private array $registeredBlocks = [];
    
    /**
     * Store context data for each block, indexed by a unique block ID
     */
    private array $blockContextData = [];
    
    /**
     * Counter for generating unique block IDs
     */
    private int $blockIdCounter = 0;

    public function __construct(
        private readonly DevToolsConfigService $config,
        private readonly VariableAnalyzer $variableAnalyzer
    ) {
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
        
        // Analyze and store context data (respecting memory limit)
        if (count($this->blockContextData) < self::MAX_TRACKED_BLOCKS) {
            $contextInfo = $this->variableAnalyzer->analyzeContext($context, $this->config->getMaxVariableDepth());
            $blockData['contextKeys'] = array_keys($contextInfo);
            
            $this->blockContextData[$blockId] = [
                'block' => $blockData['block'],
                'template' => $blockData['template'],
                'line' => $blockData['line'],
                'context' => $contextInfo,
            ];
        } else {
            $blockData['contextKeys'] = [];
        }
        
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
