/**
 * MnkysDevTools Storefront Entry Point
 * 
 * Registers the Component Picker plugin with Shopware's PluginManager.
 */
import ComponentPickerPlugin from './plugin/component-picker.plugin';

// Register the plugin - attached to body so it's always available
const PluginManager = window.PluginManager;

PluginManager.register(
    'MnkysDevToolsComponentPicker',
    ComponentPickerPlugin,
    'body'
);

// Export for potential direct usage
export { ComponentPickerPlugin };
