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
 * - Persistent selection highlight that stays visible while inspecting
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
        // Behavior
        keyboardShortcut: true,
    };

    init() {
        this._enabled = false;
        this._currentTarget = null;
        this._selectedTarget = null;
        this._selectedBlockData = null;

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
        this._selectedTarget = null;
        this._selectedBlockData = null;
    }

    /**
     * Create all UI components
     */
    _createUIComponents() {
        // Overlay for highlighting (hover + selection)
        this._overlay = new InspectorOverlay();
        this._overlay.create();

        // Tooltip for hover info
        this._tooltip = new InspectorTooltip();
        this._tooltip.create();

        // Block list panel
        this._blockPanel = new BlockPanel({
            onBlockSelect: (blockData) => this._handleBlockSelect(blockData),
            onBlockHover: (blockData, isHovering) => this._handleBlockHover(blockData, isHovering),
        });
        this._blockPanel.create();

        // Detail panel for inspecting blocks
        this._detailPanel = new DetailPanel({
            onClose: () => {
                this._clearSelection();
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
        const element = this._findElementForBlock(blockData);
        
        // Select the element
        this._selectElement(element, blockData);
        
        // Show detail panel
        this._detailPanel?.show(blockData, element || document.body);
    }

    /**
     * Handle block hover from the panel
     */
    _handleBlockHover(blockData, isHovering) {
        if (!isHovering) {
            // On unhover, restore selection highlight or hide
            if (this._selectedTarget) {
                this._overlay?.highlight(this._selectedTarget);
            } else {
                this._overlay?.hide();
            }
            this._tooltip?.hide();
            return;
        }

        // Find and highlight the hovered block's element
        const element = this._findElementForBlock(blockData);
        if (element) {
            this._overlay?.highlight(element);
            this._tooltip?.update(element, { clientX: 0, clientY: 0 });
        }
    }

    /**
     * Find DOM element for a block
     */
    _findElementForBlock(blockData) {
        // Try to find by blockId first (most accurate)
        if (blockData.blockId) {
            const element = document.querySelector(`[data-twig-block-id="${blockData.blockId}"]`);
            if (element) return element;
        }
        
        // Fallback: find by block name
        return document.querySelector(`[data-twig-block*="${blockData.block}"]`);
    }

    /**
     * Select an element and show persistent highlight
     */
    _selectElement(element, blockData) {
        this._selectedTarget = element;
        this._selectedBlockData = blockData;
        
        if (element) {
            this._overlay?.select(element);
        }
        
        // Update block panel to show selection
        this._blockPanel?.setSelectedBlock(blockData?.blockId || blockData?.block);
    }

    /**
     * Clear current selection
     */
    _clearSelection() {
        this._selectedTarget = null;
        this._selectedBlockData = null;
        this._overlay?.clearSelection();
        this._blockPanel?.setSelectedBlock(null);
    }

    /**
     * Handle mouse movement
     */
    _onMouseMove(e) {
        if (!this._enabled) {
            return;
        }

        // Don't interfere with panels
        if (e.target.closest('#__mnkys-devtools-detail__, #__mnkys-devtools-panel__')) {
            this._hideHoverUI();
            return;
        }

        const target = findTwigElement(e.target);

        if (target && target !== this._currentTarget) {
            this._currentTarget = target;
            
            // Only show hover highlight if not the selected element
            // (selection has its own persistent highlight)
            if (target !== this._selectedTarget) {
                this._overlay?.highlight(target);
            }
            
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
                // Select the element with persistent highlight
                this._selectElement(target, data);
                
                // Show detail panel
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
                this._clearSelection();
            } else {
                this.disable();
            }
        }
    }

    /**
     * Hide hover UI elements (overlay and tooltip)
     */
    _hideHoverUI() {
        // Only hide hover overlay if we have no selection, otherwise keep selection visible
        if (!this._selectedTarget) {
            this._overlay?.hide();
        }
        this._tooltip?.hide();
    }
}
