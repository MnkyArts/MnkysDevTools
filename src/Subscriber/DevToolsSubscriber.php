<?php declare(strict_types=1);

namespace MnkysDevTools\Subscriber;

use MnkysDevTools\Service\DevToolsConfigService;
use Shopware\Storefront\Event\StorefrontRenderEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

/**
 * Subscriber that injects DevTools configuration into the storefront
 */
class DevToolsSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly DevToolsConfigService $config
    ) {}

    public static function getSubscribedEvents(): array
    {
        return [
            StorefrontRenderEvent::class => 'onStorefrontRender',
        ];
    }

    /**
     * Inject DevTools configuration into the storefront template context
     */
    public function onStorefrontRender(StorefrontRenderEvent $event): void
    {
        // CRITICAL: Never enable in production
        if (!$this->config->isDevEnvironment()) {
            return;
        }

        // Check if enabled via admin settings
        if (!$this->config->isEnabled()) {
            return;
        }

        // Add DevTools configuration to template parameters
        $event->setParameter('devtools_enabled', true);
        $event->setParameter('devtools_editor', $this->config->getEditor());
    }
}
