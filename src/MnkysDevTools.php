<?php declare(strict_types=1);

namespace MnkysDevTools;

use Shopware\Core\Framework\Plugin;
use Shopware\Core\Framework\Plugin\Context\ActivateContext;
use Shopware\Core\Framework\Plugin\Context\DeactivateContext;
use Shopware\Core\Framework\Plugin\Context\InstallContext;
use Shopware\Core\Framework\Plugin\Context\UninstallContext;

/**
 * MnkysDevTools - Storefront Component Picker
 * 
 * A developer tool that provides Vue DevTools-like component inspection
 * for Shopware 6's Twig-based storefront. Features include:
 * 
 * - Visual component picker with element highlighting
 * - Twig block name and template path display
 * - Context variable inspection
 * - One-click "Open in Editor" functionality
 * 
 * SECURITY NOTE: This plugin only works in development mode (APP_ENV=dev).
 * All features are automatically disabled in production environments.
 */
class MnkysDevTools extends Plugin
{
    public function install(InstallContext $installContext): void
    {
        parent::install($installContext);
    }

    public function uninstall(UninstallContext $uninstallContext): void
    {
        parent::uninstall($uninstallContext);

        if ($uninstallContext->keepUserData()) {
            return;
        }

        // Plugin configuration is automatically removed by Shopware
        // No custom data to clean up
    }

    public function activate(ActivateContext $activateContext): void
    {
        parent::activate($activateContext);
        
        // Note: DevTools is disabled by default. 
        // Users must enable it in the plugin configuration.
    }

    public function deactivate(DeactivateContext $deactivateContext): void
    {
        parent::deactivate($deactivateContext);
    }
}
