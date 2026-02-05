<?php declare(strict_types=1);

namespace MnkysDevTools\Service;

/**
 * Shared service for analyzing Twig context variables.
 *
 * Provides consistent type information and structure analysis
 * for context variables displayed in the DevTools inspector.
 */
class VariableAnalyzer
{
    /**
     * Internal Twig variables that should be excluded from analysis
     */
    private const SKIP_KEYS = [
        '_parent', '_seq', '_key', '_iterated',
        'loop', '_self', '__internal', 'app',
    ];

    /**
     * Common Shopware entity getter methods to inspect
     */
    private const GETTER_MAP = [
        'getId' => 'id',
        'getName' => 'name',
        'getValue' => 'value',
        'getType' => 'type',
        'isRequired' => 'required',
        'getStringValue' => 'stringValue',
        'getIntValue' => 'intValue',
        'getBoolValue' => 'boolValue',
        'getArrayValue' => 'arrayValue',
        'getTranslated' => 'translated',
    ];

    /**
     * Analyze all context variables and return type information.
     *
     * Skips internal Twig variables and sorts results by key.
     *
     * @param array<string, mixed> $context The Twig context array
     * @param int $maxDepth Maximum recursion depth for nested structures
     * @return array<string, array<string, mixed>> Analyzed variable information keyed by variable name
     */
    public function analyzeContext(array $context, int $maxDepth = 3): array
    {
        $analyzed = [];

        foreach ($context as $key => $value) {
            if (in_array($key, self::SKIP_KEYS, true) || str_starts_with($key, '__')) {
                continue;
            }

            $analyzed[$key] = $this->analyzeVariable($value, 0, $maxDepth);
        }

        ksort($analyzed);

        return $analyzed;
    }

    /**
     * Analyze a single variable and return its type/structure information.
     *
     * @param mixed $value The value to analyze
     * @param int $depth Current recursion depth
     * @param int $maxDepth Maximum recursion depth
     * @return array<string, mixed> Type information array
     */
    public function analyzeVariable(mixed $value, int $depth, int $maxDepth): array
    {
        if ($value === null) {
            return ['type' => 'null', 'value' => null];
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
            return $this->analyzeString($value);
        }

        if (is_array($value)) {
            return $this->analyzeArray($value, $depth, $maxDepth);
        }

        if (is_object($value)) {
            return $this->analyzeObject($value, $depth, $maxDepth);
        }

        return ['type' => gettype($value)];
    }

    /**
     * Analyze a string value
     */
    private function analyzeString(string $value): array
    {
        $len = strlen($value);
        $info = ['type' => 'string', 'length' => $len];

        if ($len <= 100) {
            $info['value'] = $value;
        } else {
            $info['preview'] = substr($value, 0, 100) . '...';
        }

        return $info;
    }

    /**
     * Analyze an array value
     */
    private function analyzeArray(array $value, int $depth, int $maxDepth): array
    {
        $count = count($value);
        $isAssoc = $count > 0 && array_keys($value) !== range(0, $count - 1);
        $info = [
            'type' => 'array',
            'count' => $count,
            'isAssoc' => $isAssoc,
        ];

        if ($depth < $maxDepth && $count > 0 && $count <= 10) {
            $items = [];
            $itemCount = 0;

            foreach ($value as $k => $v) {
                if ($itemCount >= 5) {
                    $items['...'] = ['type' => 'truncated', 'remaining' => $count - $itemCount];
                    break;
                }
                $items[$k] = $this->analyzeVariable($v, $depth + 1, $maxDepth);
                $itemCount++;
            }

            $info['items'] = $items;
        }

        return $info;
    }

    /**
     * Analyze an object value
     */
    private function analyzeObject(object $value, int $depth, int $maxDepth): array
    {
        $className = get_class($value);
        $shortName = (new \ReflectionClass($value))->getShortName();

        $info = [
            'type' => 'object',
            'class' => $shortName,
            'fullClass' => $className,
        ];

        if ($value instanceof \Countable) {
            $info['count'] = count($value);
        }

        if ($depth >= $maxDepth) {
            return $info;
        }

        $properties = [];

        foreach (self::GETTER_MAP as $method => $propName) {
            if (method_exists($value, $method)) {
                try {
                    $propValue = $value->$method();
                    if ($propValue !== null) {
                        $properties[$propName] = $this->analyzeVariable($propValue, $depth + 1, $maxDepth);
                    }
                } catch (\Throwable) {
                }
            }
        }

        // For iterables (like collections), show first few items
        if ($value instanceof \Traversable) {
            $items = [];
            $itemCount = 0;
            foreach ($value as $k => $v) {
                if ($itemCount >= 3) {
                    break;
                }
                $items[$k] = $this->analyzeVariable($v, $depth + 1, $maxDepth);
                $itemCount++;
            }
            if (!empty($items)) {
                $properties['_items'] = ['type' => 'items', 'items' => $items];
            }
        }

        if (!empty($properties)) {
            $info['properties'] = $properties;
        }

        return $info;
    }
}
