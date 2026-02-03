/**
 * MnkysDevTools Component Picker Plugin
 *
 * Vue DevTools-style component inspection for Shopware 6 Twig templates.
 *
 * Features:
 * - Hover over any element to see which Twig block rendered it
 * - Click to open detailed inspector panel with context, hierarchy, and source
 * - Block list panel showing all blocks on the page
 * - Search/filter blocks by name or template
 */

import Plugin from 'src/plugin-system/plugin.class';
import { injectStyles } from './devtools/inspector-styles.js';
import { showNotification, findTwigElement, getTwigData } from './devtools/inspector-utils.js';
import { InspectorOverlay } from './devtools/inspector-overlay.js';
import { InspectorTooltip } from './devtools/inspector-tooltip.js';
import { InspectorToggle } from './devtools/inspector-toggle.js';
import { BlockPanel } from './devtools/inspector-block-panel.js';
import { DetailPanel } from './devtools/inspector-panel.js';

export default class ComponentPickerPlugin extends Plugin {
    static options = {
        // Overlay styling
        overlayColor: 'rgba(66, 184, 131, 0.15)',
        overlayBorderColor: '#1699F7',
        overlayBorderWidth: '2px',

        // Behavior
        keyboardShortcut: true,

        // Animation
        transitionDuration: '0.12s',
    };

    init() {
        this._enabled = false;
        this._currentTarget = null;

        // UI Components
        this._overlay = null;
        this._tooltip = null;
        this._blockPanel = null;
        this._detailPanel = null;
        this._toggle = null;

        // Bind event handlers
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);

        // Initialize toggle button
        this._initToggle();

        // Setup keyboard shortcut
        if (this.options.keyboardShortcut) {
            document.addEventListener('keydown', this._onKeyDown);
        }
    }

    /**
     * Initialize the toggle button with retry logic
     */
    _initToggle() {
        if (this._isDevToolsEnabled()) {
            this._createToggle();
        } else {
            // Retry after a short delay in case data loads later
            setTimeout(() => {
                if (!this._toggle?.exists() && this._isDevToolsEnabled()) {
                    this._createToggle();
                }
            }, 100);
        }
    }

    /**
     * Create the toggle button
     */
    _createToggle() {
        this._toggle = new InspectorToggle({
            onToggle: () => this.toggle(),
        });
        this._toggle.create();
    }

    /**
     * Check if DevTools is enabled via admin config
     */
    _isDevToolsEnabled() {
        // Primary check: data attribute set by Twig
        if (document.body.dataset.devtoolsEnabled === 'true') {
            return true;
        }

        // Fallback: check for the block data script tag
        if (document.getElementById('devtools-block-data')) {
            return true;
        }

        return false;
    }

    /**
     * Toggle inspector on/off
     */
    toggle() {
        this._enabled ? this.disable() : this.enable();
    }

    /**
     * Enable the inspector
     */
    enable() {
        if (this._enabled) {
            return;
        }

        this._enabled = true;

        // Inject global styles
        injectStyles();

        // Create UI components
        this._createUIComponents();

        // Add event listeners
        document.addEventListener('mousemove', this._onMouseMove, true);
        document.addEventListener('click', this._onClick, true);

        // Update UI state
        document.body.classList.add('mnkys-devtools-active');
        this._toggle?.setActive(true);

        showNotification('Inspector enabled - Hover to inspect, Click for details');
    }

    /**
     * Disable the inspector
     */
    disable() {
        if (!this._enabled) {
            return;
        }

        this._enabled = false;

        // Remove event listeners
        document.removeEventListener('mousemove', this._onMouseMove, true);
        document.removeEventListener('click', this._onClick, true);

        // Destroy UI components
        this._destroyUIComponents();

        // Update UI state
        document.body.classList.remove('mnkys-devtools-active');
        this._toggle?.setActive(false);
        this._currentTarget = null;
    }

    /**
     * Create all UI components
     */
    _createUIComponents() {
        // Overlay for highlighting
        this._overlay = new InspectorOverlay({
            overlayColor: this.options.overlayColor,
            overlayBorderColor: this.options.overlayBorderColor,
            overlayBorderWidth: this.options.overlayBorderWidth,
            transitionDuration: this.options.transitionDuration,
        });
        this._overlay.create();

        // Tooltip for hover info
        this._tooltip = new InspectorTooltip();
        this._tooltip.create();

        // Block list panel
        this._blockPanel = new BlockPanel({
            onBlockSelect: (blockData) => this._handleBlockSelect(blockData),
        });
        this._blockPanel.create();

        // Detail panel for inspecting blocks
        this._detailPanel = new DetailPanel({
            onClose: () => {
                // Keep inspector active when closing detail panel
            },
            onOpenEditor: () => {
                showNotification('Opening in editor...');
            },
        });
        this._detailPanel.create();
    }

    /**
     * Destroy all UI components
     */
    _destroyUIComponents() {
        this._overlay?.destroy();
        this._tooltip?.destroy();
        this._blockPanel?.destroy();
        this._detailPanel?.destroy();

        this._overlay = null;
        this._tooltip = null;
        this._blockPanel = null;
        this._detailPanel = null;
    }

    /**
     * Handle block selection from the panel
     */
    _handleBlockSelect(blockData) {
        // Find the element on page if possible
        const element = document.querySelector(`[data-twig-block*="${blockData.block}"]`);
        this._detailPanel?.show(blockData, element || document.body);
    }

    /**
     * Handle mouse movement
     */
    _onMouseMove(e) {
        if (!this._enabled) {
            return;
        }

        // Don't interfere with detail panel
        if (e.target.closest('#__mnkys-devtools-detail__')) {
            this._hideHoverUI();
            return;
        }

        const target = findTwigElement(e.target);

        if (target && target !== this._currentTarget) {
            this._currentTarget = target;
            this._overlay?.highlight(target);
            this._tooltip?.update(target, e);
        } else if (!target && this._currentTarget) {
            this._hideHoverUI();
            this._currentTarget = null;
        } else if (target === this._currentTarget) {
            this._tooltip?.position(e);
        }
    }

    /**
     * Handle click events
     */
    _onClick(e) {
        if (!this._enabled) {
            return;
        }

        // Ignore clicks on our UI elements
        const uiSelectors = '#__mnkys-devtools-panel__, #__mnkys-devtools-toggle__, #__mnkys-devtools-detail__';
        if (e.target.closest(uiSelectors)) {
            return;
        }

        const target = findTwigElement(e.target);
        if (target) {
            e.preventDefault();
            e.stopPropagation();

            const data = getTwigData(target);
            if (data) {
                this._detailPanel?.show(data, target);
            }
        }
    }

    /**
     * Handle keyboard shortcuts
     */
    _onKeyDown(e) {
        // Ctrl+Shift+C to toggle
        if (e.ctrlKey && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            if (this._isDevToolsEnabled()) {
                this.toggle();
            }
        }

        // Escape to close
        if (e.key === 'Escape' && this._enabled) {
            // First close detail panel if open
            if (this._detailPanel?.element?.style.display !== 'none') {
                this._detailPanel.hide();
            } else {
                this.disable();
            }
        }
    }

    /**
     * Hide hover UI elements (overlay and tooltip)
     */
    _hideHoverUI() {
        this._overlay?.hide();
        this._tooltip?.hide();
    }
}
