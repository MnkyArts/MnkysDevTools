<?php declare(strict_types=1);

namespace MnkysDevTools\Twig\Node;

use Twig\Attribute\YieldReady;
use Twig\Compiler;
use Twig\Node\BlockNode;

#[YieldReady]
class InspectorBlockNode extends BlockNode
{
    private string $templatePath;

    public function __construct(BlockNode $originalNode, string $templatePath)
    {
        parent::__construct(
            $originalNode->getAttribute('name'),
            $originalNode->getNode('body'),
            $originalNode->getTemplateLine()
        );
        
        $this->templatePath = $templatePath;
    }

    public function compile(Compiler $compiler): void
    {
        $blockName = $this->getAttribute('name');
        $line = $this->getTemplateLine();
        
        $blockData = json_encode([
            'block' => $blockName,
            'template' => $this->templatePath,
            'line' => $line,
        ], JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP);

        $compiler
            ->write("public function block_$blockName(array \$context, array \$blocks = []): iterable\n")
            ->write("{\n")
            ->indent()
            ->write("\$macros = \$this->macros;\n")
            ->write("\$__devtools_blockData = " . var_export($blockData, true) . ";\n")
            ->write("ob_start();\n")
            ->write("foreach ((function() use (\$context, \$blocks, \$macros) {\n")
            ->indent()
            ->write("\$this->macros = \$macros;\n");
        
        $compiler->subcompile($this->getNode('body'));
        
        $compiler
            ->write("return; yield '';\n")
            ->outdent()
            ->write("})() as \$__devtools_chunk) { echo \$__devtools_chunk; }\n")
            ->write("\$__devtools_output = ob_get_clean();\n")
            ->write("yield \$this->extensions['MnkysDevTools\\\\Twig\\\\TwigInspectorExtension']->injectBlockAttribute(\$__devtools_output, \$__devtools_blockData);\n")
            ->outdent()
            ->write("}\n");
    }
}
