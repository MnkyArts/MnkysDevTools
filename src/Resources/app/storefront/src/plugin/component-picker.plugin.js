import Plugin from 'src/plugin-system/plugin.class';
import HttpClient from 'src/service/http-client.service';

/**
 * MnkysDevTools Component Picker Plugin
 * 
 * Vue DevTools-style component inspection for Shopware 6 Twig templates.
 * 
 * Features:
 * - Hover over any element to see which Twig block rendered it
 * - Click to open the template file in your editor
 * - Block list panel showing all blocks on the page
 * - Search/filter blocks by name or template
 */
export default class ComponentPickerPlugin extends Plugin {
    static options = {
        // Overlay styling
        overlayColor: 'rgba(66, 184, 131, 0.15)',
        overlayBorderColor: '#42b883',
        overlayBorderWidth: '2px',

        // Tooltip styling  
        tooltipBgColor: '#1e1e1e',
        tooltipTextColor: '#e0e0e0',
        tooltipAccentColor: '#42b883',

        // Panel styling
        panelWidth: '380px',
        panelMaxHeight: '55vh',

        // Behavior
        openEditorEndpoint: '/devtools/open-editor',
        keyboardShortcut: true,

        // Animation
        transitionDuration: '0.12s',
    };

    init() {
        this._client = new HttpClient();
        this._enabled = false;
        this._overlay = null;
        this._tooltip = null;
        this._blockPanel = null;
        this._currentTarget = null;
        this._activationButton = null;
        this._blocks = [];
        this._filteredBlocks = [];
        this._searchTerm = '';

        // Bind methods
        this._onMouseMove = this._onMouseMove.bind(this);
        this._onClick = this._onClick.bind(this);
        this._onKeyDown = this._onKeyDown.bind(this);

        // Load block data for the panel
        this._loadBlockData();

        // Create UI if enabled
        if (this._isEnabledViaAdmin()) {
            this._createActivationButton();
        }

        // Keyboard shortcut
        if (this.options.keyboardShortcut) {
            document.addEventListener('keydown', this._onKeyDown);
        }
    }

    /**
     * Load block data from JSON script tag
     */
    _loadBlockData() {
        const scriptTag = document.getElementById('devtools-block-data');
        if (!scriptTag) {
            this._blocks = [];
            return;
        }

        try {
            this._blocks = JSON.parse(scriptTag.textContent) || [];
            this._blocks.sort((a, b) => {
                const cmp = a.template.localeCompare(b.template);
                return cmp !== 0 ? cmp : a.block.localeCompare(b.block);
            });
            this._filteredBlocks = [...this._blocks];
        } catch (e) {
            console.warn('DevTools: Failed to parse block data', e);
            this._blocks = [];
            this._filteredBlocks = [];
        }
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
        if (this._enabled) return;

        this._enabled = true;
        this._createOverlay();
        this._createTooltip();
        this._createBlockPanel();

        document.addEventListener('mousemove', this._onMouseMove, true);
        document.addEventListener('click', this._onClick, true);

        document.body.classList.add('mnkys-devtools-active');
        this._updateActivationButton(true);
        this._showNotification('Inspector enabled - Hover to inspect, Click to open in editor');
    }

    /**
     * Disable the inspector
     */
    disable() {
        if (!this._enabled) return;

        this._enabled = false;
        this._destroyUI();

        document.removeEventListener('mousemove', this._onMouseMove, true);
        document.removeEventListener('click', this._onClick, true);

        document.body.classList.remove('mnkys-devtools-active');
        this._updateActivationButton(false);
        this._currentTarget = null;
    }

    /**
     * Check if DevTools is enabled
     */
    _isEnabledViaAdmin() {
        return document.body.dataset.devtoolsEnabled === 'true';
    }

    /**
     * Create the activation button
     */
    _createActivationButton() {
        this._activationButton = document.createElement('button');
        this._activationButton.id = '__mnkys-devtools-toggle__';
        this._activationButton.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
            </svg>
            <span>Inspect</span>
        `;
        this._activationButton.title = 'Toggle Component Inspector (Ctrl+Shift+C)';

        Object.assign(this._activationButton.style, {
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            zIndex: '2147483630',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 12px',
            backgroundColor: '#1e1e1e',
            color: '#42b883',
            border: '2px solid #42b883',
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '12px',
            fontWeight: '600',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.15s ease',
        });

        this._activationButton.addEventListener('mouseenter', () => {
            this._activationButton.style.backgroundColor = '#42b883';
            this._activationButton.style.color = '#1e1e1e';
        });

        this._activationButton.addEventListener('mouseleave', () => {
            if (!this._enabled) {
                this._activationButton.style.backgroundColor = '#1e1e1e';
                this._activationButton.style.color = '#42b883';
            }
        });

        this._activationButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        document.body.appendChild(this._activationButton);
    }

    /**
     * Update activation button state
     */
    _updateActivationButton(active) {
        if (!this._activationButton) return;

        if (active) {
            this._activationButton.style.backgroundColor = '#42b883';
            this._activationButton.style.color = '#1e1e1e';
            this._activationButton.querySelector('span').textContent = 'Exit';
        } else {
            this._activationButton.style.backgroundColor = '#1e1e1e';
            this._activationButton.style.color = '#42b883';
            this._activationButton.querySelector('span').textContent = 'Inspect';
        }
    }

    /**
     * Create the highlight overlay
     */
    _createOverlay() {
        this._overlay = document.createElement('div');
        this._overlay.id = '__mnkys-devtools-overlay__';

        Object.assign(this._overlay.style, {
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: '2147483640',
            backgroundColor: this.options.overlayColor,
            border: `${this.options.overlayBorderWidth} solid ${this.options.overlayBorderColor}`,
            borderRadius: '3px',
            transition: `all ${this.options.transitionDuration} ease-out`,
            display: 'none',
            boxSizing: 'border-box',
        });

        document.body.appendChild(this._overlay);
    }

    /**
     * Create the tooltip
     */
    _createTooltip() {
        this._tooltip = document.createElement('div');
        this._tooltip.id = '__mnkys-devtools-tooltip__';

        Object.assign(this._tooltip.style, {
            position: 'fixed',
            pointerEvents: 'none',
            zIndex: '2147483641',
            backgroundColor: this.options.tooltipBgColor,
            color: this.options.tooltipTextColor,
            padding: '10px 14px',
            borderRadius: '6px',
            fontSize: '12px',
            fontFamily: '"JetBrains Mono", "Fira Code", Menlo, Monaco, monospace',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
            maxWidth: '400px',
            display: 'none',
            border: `1px solid ${this.options.overlayBorderColor}`,
            lineHeight: '1.4',
        });

        // Add tooltip styles
        const style = document.createElement('style');
        style.id = '__mnkys-devtools-tooltip-styles__';
        style.textContent = `
            #__mnkys-devtools-tooltip__ .block-name {
                color: ${this.options.tooltipAccentColor};
                font-weight: 700;
                font-size: 13px;
                margin-bottom: 4px;
            }
            #__mnkys-devtools-tooltip__ .block-name::before {
                content: '{% block ';
                color: #666;
                font-weight: 400;
            }
            #__mnkys-devtools-tooltip__ .block-name::after {
                content: ' %}';
                color: #666;
                font-weight: 400;
            }
            #__mnkys-devtools-tooltip__ .template-path {
                color: #9cdcfe;
                font-size: 11px;
                word-break: break-all;
            }
            #__mnkys-devtools-tooltip__ .element-tag {
                color: #888;
                font-size: 10px;
                margin-bottom: 6px;
                font-style: italic;
            }
        `;
        document.head.appendChild(this._tooltipStyle = style);

        document.body.appendChild(this._tooltip);
    }

    /**
     * Create the block list panel
     */
    _createBlockPanel() {
        this._blockPanel = document.createElement('div');
        this._blockPanel.id = '__mnkys-devtools-panel__';

        Object.assign(this._blockPanel.style, {
            position: 'fixed',
            right: '20px',
            top: '20px',
            width: this.options.panelWidth,
            maxHeight: this.options.panelMaxHeight,
            backgroundColor: this.options.tooltipBgColor,
            color: this.options.tooltipTextColor,
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: '"JetBrains Mono", "Fira Code", Menlo, Monaco, monospace',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            zIndex: '2147483642',
            border: `1px solid ${this.options.overlayBorderColor}`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
        });

        // Add panel styles
        this._addPanelStyles();

        this._blockPanel.innerHTML = this._buildPanelHTML();
        document.body.appendChild(this._blockPanel);

        // Event listeners
        this._attachPanelEvents();
    }

    /**
     * Add panel styles
     */
    _addPanelStyles() {
        const style = document.createElement('style');
        style.id = '__mnkys-devtools-panel-styles__';
        style.textContent = `
            #__mnkys-devtools-panel__ .panel-header {
                padding: 12px;
                border-bottom: 1px solid #333;
                flex-shrink: 0;
            }
            #__mnkys-devtools-panel__ .panel-title {
                color: ${this.options.tooltipAccentColor};
                font-size: 13px;
                font-weight: 600;
                margin: 0 0 8px;
            }
            #__mnkys-devtools-panel__ .panel-search {
                width: 100%;
                padding: 6px 10px;
                background: #2d2d2d;
                border: 1px solid #444;
                border-radius: 4px;
                color: #e0e0e0;
                font-size: 11px;
                font-family: inherit;
                outline: none;
            }
            #__mnkys-devtools-panel__ .panel-search:focus {
                border-color: ${this.options.tooltipAccentColor};
            }
            #__mnkys-devtools-panel__ .panel-stats {
                font-size: 10px;
                color: #666;
                margin-top: 6px;
            }
            #__mnkys-devtools-panel__ .panel-list {
                flex: 1;
                overflow-y: auto;
                padding: 4px 0;
            }
            #__mnkys-devtools-panel__ .panel-list::-webkit-scrollbar {
                width: 6px;
            }
            #__mnkys-devtools-panel__ .panel-list::-webkit-scrollbar-thumb {
                background: #444;
                border-radius: 3px;
            }
            #__mnkys-devtools-panel__ .block-item {
                padding: 6px 12px;
                cursor: pointer;
                border-left: 2px solid transparent;
                transition: all 0.1s;
            }
            #__mnkys-devtools-panel__ .block-item:hover {
                background: #2a2a2a;
                border-left-color: ${this.options.tooltipAccentColor};
            }
            #__mnkys-devtools-panel__ .block-item-name {
                color: ${this.options.tooltipAccentColor};
                font-weight: 500;
            }
            #__mnkys-devtools-panel__ .block-item-path {
                color: #666;
                font-size: 10px;
                margin-top: 2px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            #__mnkys-devtools-panel__ .panel-footer {
                padding: 8px 12px;
                border-top: 1px solid #333;
                font-size: 10px;
                color: #666;
            }
            #__mnkys-devtools-panel__ kbd {
                background: #333;
                padding: 1px 4px;
                border-radius: 2px;
            }
            #__mnkys-devtools-panel__ .panel-empty {
                padding: 20px;
                text-align: center;
                color: #666;
            }
            #__mnkys-devtools-panel__ .highlight {
                background: rgba(66, 184, 131, 0.3);
                border-radius: 2px;
            }
        `;
        document.head.appendChild(this._panelStyle = style);
    }

    /**
     * Build the panel HTML
     */
    _buildPanelHTML() {
        return `
            <div class="panel-header">
                <div class="panel-title">Twig Blocks</div>
                <input type="text" class="panel-search" placeholder="Search blocks..." />
                <div class="panel-stats">${this._blocks.length} blocks</div>
            </div>
            <div class="panel-list">
                ${this._buildBlockListHTML()}
            </div>
            <div class="panel-footer">
                <kbd>Esc</kbd> close &bull; <kbd>Click</kbd> element or list item to open
            </div>
        `;
    }

    /**
     * Build block list HTML
     */
    _buildBlockListHTML() {
        if (this._filteredBlocks.length === 0) {
            return '<div class="panel-empty">No blocks found</div>';
        }

        return this._filteredBlocks.map(block => `
            <div class="block-item" data-template="${this._escapeHtml(block.template)}" data-line="${block.line}">
                <div class="block-item-name">${this._highlightMatch(block.block)}</div>
                <div class="block-item-path">${this._highlightMatch(this._shortenPath(block.template))}:${block.line}</div>
            </div>
        `).join('');
    }

    /**
     * Highlight search matches
     */
    _highlightMatch(text) {
        if (!this._searchTerm) return this._escapeHtml(text);
        const escaped = this._escapeHtml(text);
        const regex = new RegExp(`(${this._escapeRegex(this._searchTerm)})`, 'gi');
        return escaped.replace(regex, '<span class="highlight">$1</span>');
    }

    /**
     * Escape regex
     */
    _escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * Attach panel events
     */
    _attachPanelEvents() {
        const searchInput = this._blockPanel.querySelector('.panel-search');
        searchInput?.addEventListener('input', (e) => {
            this._searchTerm = e.target.value.toLowerCase();
            this._filterBlocks();
            this._updatePanelList();
        });

        this._blockPanel.addEventListener('click', (e) => {
            const item = e.target.closest('.block-item');
            if (item) {
                this._openInEditor(item.dataset.template, parseInt(item.dataset.line, 10));
            }
        });
    }

    /**
     * Filter blocks
     */
    _filterBlocks() {
        if (!this._searchTerm) {
            this._filteredBlocks = [...this._blocks];
            return;
        }
        this._filteredBlocks = this._blocks.filter(b =>
            b.block.toLowerCase().includes(this._searchTerm) ||
            b.template.toLowerCase().includes(this._searchTerm)
        );
    }

    /**
     * Update panel list
     */
    _updatePanelList() {
        const list = this._blockPanel.querySelector('.panel-list');
        list.innerHTML = this._buildBlockListHTML();

        const stats = this._blockPanel.querySelector('.panel-stats');
        stats.textContent = this._searchTerm
            ? `${this._filteredBlocks.length} of ${this._blocks.length} blocks`
            : `${this._blocks.length} blocks`;
    }

    /**
     * Handle mouse movement - Vue DevTools style hover
     */
    _onMouseMove(e) {
        if (!this._enabled) return;

        const target = this._findTwigElement(e.target);

        if (target && target !== this._currentTarget) {
            this._currentTarget = target;
            this._highlightElement(target);
            this._updateTooltip(target, e);
        } else if (!target && this._currentTarget) {
            this._hideOverlay();
            this._currentTarget = null;
        } else if (target === this._currentTarget) {
            this._positionTooltip(e);
        }
    }

    /**
     * Handle click - open in editor
     */
    _onClick(e) {
        if (!this._enabled) return;

        // Ignore clicks on our UI
        if (e.target.closest('#__mnkys-devtools-panel__, #__mnkys-devtools-toggle__')) {
            return;
        }

        const target = this._findTwigElement(e.target);
        if (target) {
            e.preventDefault();
            e.stopPropagation();

            const data = this._getTwigData(target);
            if (data) {
                this._openInEditor(data.template, data.line);
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
            if (this._isEnabledViaAdmin()) {
                this.toggle();
            }
        }

        // Escape to close
        if (e.key === 'Escape' && this._enabled) {
            this.disable();
        }
    }

    /**
     * Find the nearest element with twig block data attribute
     */
    _findTwigElement(el) {
        // Skip our UI elements
        if (el.closest('#__mnkys-devtools-overlay__, #__mnkys-devtools-tooltip__, #__mnkys-devtools-panel__, #__mnkys-devtools-toggle__')) {
            return null;
        }

        // Walk up the DOM tree looking for data-twig-block
        while (el && el !== document.body && el !== document.documentElement) {
            if (el.dataset && el.dataset.twigBlock) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }

    /**
     * Get twig data from element's data attribute
     */
    _getTwigData(el) {
        try {
            return JSON.parse(el.dataset.twigBlock);
        } catch (e) {
            console.warn('DevTools: Failed to parse twig data', e);
            return null;
        }
    }

    /**
     * Highlight an element with overlay
     */
    _highlightElement(el) {
        const rect = el.getBoundingClientRect();
        const bw = parseInt(this.options.overlayBorderWidth);

        Object.assign(this._overlay.style, {
            display: 'block',
            left: `${rect.left - bw}px`,
            top: `${rect.top - bw}px`,
            width: `${rect.width + bw * 2}px`,
            height: `${rect.height + bw * 2}px`,
        });
    }

    /**
     * Update tooltip content
     */
    _updateTooltip(el, event) {
        const data = this._getTwigData(el);
        if (!data) return;

        const tagName = el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : '';
        const classes = el.className && typeof el.className === 'string' 
            ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
            : '';

        this._tooltip.innerHTML = `
            <div class="element-tag">&lt;${tagName}${id}${classes}&gt;</div>
            <div class="block-name">${this._escapeHtml(data.block)}</div>
            <div class="template-path">${this._escapeHtml(data.template)}:${data.line}</div>
        `;

        this._tooltip.style.display = 'block';
        this._positionTooltip(event);
    }

    /**
     * Position tooltip near cursor
     */
    _positionTooltip(event) {
        if (!this._tooltip || this._tooltip.style.display === 'none') return;

        const pad = 15;
        const rect = this._tooltip.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        let x = event.clientX + pad;
        let y = event.clientY + pad;

        if (x + rect.width > vw - pad) x = event.clientX - rect.width - pad;
        if (y + rect.height > vh - pad) y = event.clientY - rect.height - pad;

        x = Math.max(pad, x);
        y = Math.max(pad, y);

        this._tooltip.style.left = `${x}px`;
        this._tooltip.style.top = `${y}px`;
    }

    /**
     * Hide overlay and tooltip
     */
    _hideOverlay() {
        if (this._overlay) this._overlay.style.display = 'none';
        if (this._tooltip) this._tooltip.style.display = 'none';
    }

    /**
     * Open file in editor
     */
    _openInEditor(file, line) {
        const url = `${this.options.openEditorEndpoint}?file=${encodeURIComponent(file)}&line=${line}`;

        this._client.get(url, (response) => {
            try {
                const data = JSON.parse(response);
                if (data.success) {
                    this._showNotification(`Opening ${this._shortenPath(file)}:${line}`);
                } else if (data.editorUrl) {
                    window.location.href = data.editorUrl;
                } else if (data.error) {
                    this._showNotification(`Error: ${data.error}`, 'error');
                }
            } catch (e) {
                console.warn('DevTools: Failed to parse response', e);
            }
        }, 'application/json', true);
    }

    /**
     * Destroy all UI elements
     */
    _destroyUI() {
        this._overlay?.remove();
        this._tooltip?.remove();
        this._blockPanel?.remove();
        this._tooltipStyle?.remove();
        this._panelStyle?.remove();

        this._overlay = null;
        this._tooltip = null;
        this._blockPanel = null;
        this._tooltipStyle = null;
        this._panelStyle = null;
    }

    /**
     * Shorten a template path
     */
    _shortenPath(path) {
        return path.replace(/^@[^\/]+\//, '').replace(/^storefront\//, '');
    }

    /**
     * Escape HTML
     */
    _escapeHtml(str) {
        if (typeof str !== 'string') return str;
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    /**
     * Show notification
     */
    _showNotification(message, type = 'success') {
        const el = document.createElement('div');
        
        Object.assign(el.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 20px',
            backgroundColor: type === 'error' ? '#dc3545' : this.options.tooltipBgColor,
            color: type === 'error' ? '#fff' : this.options.tooltipAccentColor,
            borderRadius: '6px',
            fontSize: '12px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.4)',
            zIndex: '2147483650',
            opacity: '0',
            transition: 'opacity 0.2s',
            border: `1px solid ${type === 'error' ? '#dc3545' : this.options.overlayBorderColor}`,
        });

        el.textContent = message;
        document.body.appendChild(el);

        requestAnimationFrame(() => el.style.opacity = '1');

        setTimeout(() => {
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 200);
        }, 2500);
    }
}
