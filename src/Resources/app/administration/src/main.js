/**
 * MnkysDevTools Administration Entry Point
 */

// Import DevTools admin module
import './module/mnkys-devtools';

// Import snippets
import enGB from './module/mnkys-devtools/snippet/en-GB.json';
import deDE from './module/mnkys-devtools/snippet/de-DE.json';

// Register snippets
Shopware.Locale.extend('en-GB', enGB);
Shopware.Locale.extend('de-DE', deDE);
