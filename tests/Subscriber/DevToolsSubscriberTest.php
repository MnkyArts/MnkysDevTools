<?php declare(strict_types=1);

namespace MnkysDevTools\Tests\Subscriber;

use MnkysDevTools\Service\DevToolsConfigService;
use MnkysDevTools\Subscriber\DevToolsSubscriber;
use PHPUnit\Framework\MockObject\MockObject;
use PHPUnit\Framework\TestCase;
use Shopware\Storefront\Event\StorefrontRenderEvent;

class DevToolsSubscriberTest extends TestCase
{
    private MockObject&DevToolsConfigService $config;

    protected function setUp(): void
    {
        $this->config = $this->createMock(DevToolsConfigService::class);
    }

    private function createSubscriber(): DevToolsSubscriber
    {
        return new DevToolsSubscriber($this->config);
    }

    private function createStorefrontRenderEventMock(): MockObject&StorefrontRenderEvent
    {
        return $this->createMock(StorefrontRenderEvent::class);
    }

    // ==================== getSubscribedEvents() ====================

    public function testGetSubscribedEventsReturnsCorrectMapping(): void
    {
        $events = DevToolsSubscriber::getSubscribedEvents();

        $this->assertArrayHasKey(StorefrontRenderEvent::class, $events);
        $this->assertSame('onStorefrontRender', $events[StorefrontRenderEvent::class]);
    }

    // ==================== onStorefrontRender() ====================

    public function testOnStorefrontRenderDoesNothingInProduction(): void
    {
        $this->config
            ->method('isDevEnvironment')
            ->willReturn(false);
        $this->config
            ->expects($this->never())
            ->method('isEnabled');

        $event = $this->createStorefrontRenderEventMock();
        $event
            ->expects($this->never())
            ->method('setParameter');

        $subscriber = $this->createSubscriber();
        $subscriber->onStorefrontRender($event);
    }

    public function testOnStorefrontRenderDoesNothingWhenDisabled(): void
    {
        $this->config
            ->method('isDevEnvironment')
            ->willReturn(true);
        $this->config
            ->method('isEnabled')
            ->willReturn(false);

        $event = $this->createStorefrontRenderEventMock();
        $event
            ->expects($this->never())
            ->method('setParameter');

        $subscriber = $this->createSubscriber();
        $subscriber->onStorefrontRender($event);
    }

    public function testOnStorefrontRenderSetsDevtoolsEnabled(): void
    {
        $this->config
            ->method('isDevEnvironment')
            ->willReturn(true);
        $this->config
            ->method('isEnabled')
            ->willReturn(true);
        $this->config
            ->method('getEditor')
            ->willReturn('vscode');

        $event = $this->createStorefrontRenderEventMock();
        $event
            ->expects($this->exactly(2))
            ->method('setParameter')
            ->willReturnCallback(function ($key, $value) {
                static $calls = [];
                $calls[] = [$key, $value];
                
                if (count($calls) === 2) {
                    $this->assertContains(['devtools_enabled', true], $calls);
                }
                
                return null;
            });

        $subscriber = $this->createSubscriber();
        $subscriber->onStorefrontRender($event);
    }

    public function testOnStorefrontRenderSetsDevtoolsEditor(): void
    {
        $this->config
            ->method('isDevEnvironment')
            ->willReturn(true);
        $this->config
            ->method('isEnabled')
            ->willReturn(true);
        $this->config
            ->method('getEditor')
            ->willReturn('phpstorm');

        $setParameters = [];
        
        $event = $this->createStorefrontRenderEventMock();
        $event
            ->method('setParameter')
            ->willReturnCallback(function ($key, $value) use (&$setParameters) {
                $setParameters[$key] = $value;
            });

        $subscriber = $this->createSubscriber();
        $subscriber->onStorefrontRender($event);

        $this->assertArrayHasKey('devtools_enabled', $setParameters);
        $this->assertTrue($setParameters['devtools_enabled']);
        $this->assertArrayHasKey('devtools_editor', $setParameters);
        $this->assertSame('phpstorm', $setParameters['devtools_editor']);
    }

    public function testOnStorefrontRenderChecksEnvironmentFirst(): void
    {
        // Track the order of method calls
        $callOrder = [];

        $this->config
            ->expects($this->once())
            ->method('isDevEnvironment')
            ->willReturnCallback(function () use (&$callOrder) {
                $callOrder[] = 'isDevEnvironment';
                return false;
            });
        
        // isEnabled should NOT be called when isDevEnvironment returns false
        $this->config
            ->expects($this->never())
            ->method('isEnabled');

        $event = $this->createStorefrontRenderEventMock();

        $subscriber = $this->createSubscriber();
        $subscriber->onStorefrontRender($event);

        $this->assertSame(['isDevEnvironment'], $callOrder);
    }

    /**
     * @dataProvider editorConfigProvider
     */
    public function testOnStorefrontRenderSetsVariousEditors(string $editor): void
    {
        $this->config
            ->method('isDevEnvironment')
            ->willReturn(true);
        $this->config
            ->method('isEnabled')
            ->willReturn(true);
        $this->config
            ->method('getEditor')
            ->willReturn($editor);

        $setParameters = [];
        
        $event = $this->createStorefrontRenderEventMock();
        $event
            ->method('setParameter')
            ->willReturnCallback(function ($key, $value) use (&$setParameters) {
                $setParameters[$key] = $value;
            });

        $subscriber = $this->createSubscriber();
        $subscriber->onStorefrontRender($event);

        $this->assertSame($editor, $setParameters['devtools_editor']);
    }

    public static function editorConfigProvider(): array
    {
        return [
            'vscode' => ['vscode'],
            'phpstorm' => ['phpstorm'],
            'sublime' => ['sublime'],
            'atom' => ['atom'],
            'idea' => ['idea'],
        ];
    }
}
