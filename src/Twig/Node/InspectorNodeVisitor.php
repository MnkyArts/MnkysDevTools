<?php declare(strict_types=1);

namespace MnkysDevTools\Twig\Node;

use MnkysDevTools\Twig\TwigInspectorExtension;
use Twig\Environment;
use Twig\Node\BlockNode;
use Twig\Node\ModuleNode;
use Twig\Node\Node;
use Twig\NodeVisitor\NodeVisitorInterface;

class InspectorNodeVisitor implements NodeVisitorInterface
{
    private array $templateStack = [];
    private ?string $currentTemplate = null;
    private array $wrappedNodes = [];

    public function __construct(private readonly TwigInspectorExtension $extension)
    {
    }

    public function enterNode(Node $node, Environment $env): Node
    {
        if ($node instanceof ModuleNode) {
            $source = $node->getSourceContext();
            if ($source !== null) {
                $this->currentTemplate = $source->getName();
                $this->templateStack[] = $this->currentTemplate;
            }
        }

        if ($node instanceof BlockNode && !$node instanceof InspectorBlockNode) {
            $nodeId = spl_object_id($node);
            
            if (isset($this->wrappedNodes[$nodeId])) {
                return $node;
            }
            
            $this->wrappedNodes[$nodeId] = true;
            
            return new InspectorBlockNode($node, $this->currentTemplate ?? 'unknown');
        }

        return $node;
    }

    public function leaveNode(Node $node, Environment $env): ?Node
    {
        if ($node instanceof ModuleNode) {
            array_pop($this->templateStack);
            $this->currentTemplate = end($this->templateStack) ?: null;
        }

        return $node;
    }

    public function getPriority(): int
    {
        return 0;
    }
}
