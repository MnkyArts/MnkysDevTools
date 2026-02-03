/**
 * DevTools Inspector Block Panel
 * The sidebar panel showing all Twig blocks on the page
 */

import { escapeHtml, shortenPath, escapeRegex } from './inspector-utils.js';
import { loadBlockData } from './inspector-api.js';

/**
 * BlockPanel class - manages the block list sidebar
 */
export class BlockPanel {
    constructor(options = {}) {
        this.options = {
            onBlockSelect: null,
            ...options,
        };

        this.element = null;
        this.blocks = [];
        this.filteredBlocks = [];
        this.searchTerm = '';
    }

    /**
     * Create and append the panel element
     */
    create() {
        if (this.element) {
            return;
        }

        // Load block data
        this.blocks = loadBlockData();
        this.filteredBlocks = [...this.blocks];

        this.element = document.createElement('div');
        this.element.id = '__mnkys-devtools-panel__';
        this.element.innerHTML = this._buildHTML();

        document.body.appendChild(this.element);
        this._attachEvents();
    }

    /**
     * Destroy the panel element
     */
    destroy() {
        this.element?.remove();
        this.element = null;
        this.blocks = [];
        this.filteredBlocks = [];
        this.searchTerm = '';
    }

    /**
     * Reload block data
     */
    reload() {
        this.blocks = loadBlockData();
        this.filteredBlocks = [...this.blocks];
        this._updateList();
    }

    /**
     * Get the current blocks
     * @returns {Array}
     */
    getBlocks() {
        return this.blocks;
    }

    /**
     * Check if blocks are loaded
     * @returns {boolean}
     */
    hasBlocks() {
        return this.blocks.length > 0;
    }

    /**
     * Build the panel HTML
     * @private
     */
    _buildHTML() {
        return `
            <div class="panel-header">
                <div class="panel-title">Twig Blocks</div>
                <input type="text" class="panel-search" placeholder="Search blocks..." />
                <div class="panel-stats">${this.blocks.length} blocks</div>
            </div>
            <div class="panel-list">
                ${this._buildListHTML()}
            </div>
            <div class="panel-footer">
                <kbd>Esc</kbd> close &bull; <kbd>Click</kbd> for details
            </div>
        `;
    }

    /**
     * Build the block list HTML
     * @private
     */
    _buildListHTML() {
        if (this.filteredBlocks.length === 0) {
            return '<div class="panel-empty">No blocks found</div>';
        }

        return this.filteredBlocks.map(block => `
            <div class="block-item" 
                 data-template="${escapeHtml(block.template)}" 
                 data-block="${escapeHtml(block.block)}"
                 data-line="${block.line}"
                 data-block-id="${escapeHtml(block.blockId || '')}">
                <div class="block-item-name">${this._highlightMatch(block.block)}</div>
                <div class="block-item-path">${this._highlightMatch(shortenPath(block.template))}:${block.line}</div>
            </div>
        `).join('');
    }

    /**
     * Highlight search matches in text
     * @private
     */
    _highlightMatch(text) {
        if (!this.searchTerm) {
            return escapeHtml(text);
        }

        const escaped = escapeHtml(text);
        const regex = new RegExp(`(${escapeRegex(this.searchTerm)})`, 'gi');
        return escaped.replace(regex, '<span class="highlight">$1</span>');
    }

    /**
     * Attach event listeners
     * @private
     */
    _attachEvents() {
        // Search input
        const searchInput = this.element.querySelector('.panel-search');
        searchInput?.addEventListener('input', (e) => {
            this.searchTerm = e.target.value.toLowerCase();
            this._filterBlocks();
            this._updateList();
        });

        // Block item clicks
        this.element.addEventListener('click', (e) => {
            const item = e.target.closest('.block-item');
            if (item) {
                const blockData = {
                    block: item.dataset.block,
                    template: item.dataset.template,
                    line: parseInt(item.dataset.line, 10),
                    blockId: item.dataset.blockId,
                };

                this.options.onBlockSelect?.(blockData);
            }
        });
    }

    /**
     * Filter blocks based on search term
     * @private
     */
    _filterBlocks() {
        if (!this.searchTerm) {
            this.filteredBlocks = [...this.blocks];
            return;
        }

        this.filteredBlocks = this.blocks.filter(block =>
            block.block.toLowerCase().includes(this.searchTerm) ||
            block.template.toLowerCase().includes(this.searchTerm)
        );
    }

    /**
     * Update the block list display
     * @private
     */
    _updateList() {
        const list = this.element?.querySelector('.panel-list');
        if (list) {
            list.innerHTML = this._buildListHTML();
        }

        const stats = this.element?.querySelector('.panel-stats');
        if (stats) {
            stats.textContent = this.searchTerm
                ? `${this.filteredBlocks.length} of ${this.blocks.length} blocks`
                : `${this.blocks.length} blocks`;
        }
    }
}
