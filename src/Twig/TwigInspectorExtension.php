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

    public function injectBlockAttribute(string $output, string $blockDataJson): string
    {
        if (trim($output) === '') {
            return $output;
        }

        $blockData = json_decode($blockDataJson, true);
        if ($blockData) {
            $this->registeredBlocks[] = $blockData;
        }

        $injected = false;
        
        $result = preg_replace_callback(
            '/<([a-z][a-z0-9]*)((?:\s+[^>]*)?)(\/?)>/i',
            function ($matches) use ($blockDataJson, &$injected) {
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
                $dataAttr = ' data-twig-block="' . htmlspecialchars($blockDataJson, ENT_QUOTES, 'UTF-8') . '"';
                
                return $selfClosing 
                    ? '<' . $matches[1] . $attributes . $dataAttr . ' />'
                    : '<' . $matches[1] . $attributes . $dataAttr . '>';
            },
            $output
        );

        return $result ?? $output;
    }

    public function getRegisteredBlocks(): array
    {
        return $this->registeredBlocks;
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
        
        return '<script id="devtools-block-data" type="application/json">' . $json . '</script>';
    }

    public function isEnabled(): bool
    {
        return $this->config->isDevEnvironment() && $this->config->isEnabled();
    }
}
