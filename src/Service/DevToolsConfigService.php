<?php declare(strict_types=1);

namespace MnkysDevTools\Service;

use Shopware\Core\System\SystemConfig\SystemConfigService;

class DevToolsConfigService
{
    private const CONFIG_PREFIX = 'MnkysDevTools.config.';

    public function __construct(
        private readonly SystemConfigService $systemConfigService,
        private readonly string $appEnv
    ) {}

    public function isEnabled(?string $salesChannelId = null): bool
    {
        // Never enable in production
        if ($this->appEnv === 'prod') {
            return false;
        }

        return (bool) $this->systemConfigService->get(
            self::CONFIG_PREFIX . 'enabled',
            $salesChannelId
        );
    }

    public function getEditor(?string $salesChannelId = null): string
    {
        $editor = $this->systemConfigService->get(
            self::CONFIG_PREFIX . 'editor',
            $salesChannelId
        );

        return is_string($editor) && $editor !== '' ? $editor : 'vscode';
    }

    public function shouldExecOpen(?string $salesChannelId = null): bool
    {
        return (bool) $this->systemConfigService->get(
            self::CONFIG_PREFIX . 'execOpen',
            $salesChannelId
        );
    }

    public function isDevEnvironment(): bool
    {
        return $this->appEnv !== 'prod';
    }

    public function getMaxVariableDepth(?string $salesChannelId = null): int
    {
        $depth = $this->systemConfigService->get(
            self::CONFIG_PREFIX . 'maxVariableDepth',
            $salesChannelId
        );

        return is_numeric($depth) ? (int) $depth : 3;
    }
}
