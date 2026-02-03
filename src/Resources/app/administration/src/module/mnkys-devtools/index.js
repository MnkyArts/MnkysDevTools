/**
 * MnkysDevTools Administration Module
 * 
 * Provides a settings page for enabling/configuring the storefront DevTools
 */
import './page/mnkys-devtools-settings';

const { Module } = Shopware;

Module.register('mnkys-devtools', {
    type: 'plugin',
    name: 'mnkys-devtools',
    title: 'mnkys-devtools.general.title',
    description: 'mnkys-devtools.general.description',
    color: '#42b883',
    icon: 'regular-cog',
    favicon: 'icon-module-settings.png',

    routes: {
        settings: {
            component: 'mnkys-devtools-settings',
            path: 'settings',
            meta: {
                parentPath: 'sw.settings.index.plugins',
            },
        },
    },

    settingsItem: {
        group: 'plugins',
        to: 'mnkys.devtools.settings',
        icon: 'regular-cog',
        name: 'mnkys-devtools.general.title',
    },
});
