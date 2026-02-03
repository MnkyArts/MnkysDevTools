/**
 * DevTools Inspector Detail Panel
 * The main panel that shows block details when clicking on a component
 */

import { getBlockInfo, openInEditor, loadContextData } from './inspector-api.js';
import { escapeHtml, shortenPath, highlightTwigSyntax } from './inspector-utils.js';

/**
 * DetailPanel class - manages the block detail panel UI
 */
export class DetailPanel {
    constructor(options = {}) {
        this.options = {
            onClose: null,
            onOpenEditor: null,
            ...options,
        };
        
        this.element = null;
        this.currentBlock = null;
        this.contextData = {};
        this.blockInfo = null;
        this.activeTab = 'context';
        this.isLoading = false;
    }

    /**
     * Initialize and create the panel element
     */
    create() {
        if (this.element) {
            return;
        }

        this.contextData = loadContextData();
        
        this.element = document.createElement('div');
        this.element.id = '__mnkys-devtools-detail__';
        this.element.style.display = 'none';
        
        document.body.appendChild(this.element);
    }

    /**
     * Show the panel for a specific block
     * @param {object} blockData - The block data from data-twig-block attribute
     * @param {HTMLElement} targetElement - The DOM element that was clicked
     */
    async show(blockData, targetElement) {
        if (!this.element) {
            this.create();
        }

        this.currentBlock = blockData;
        this.blockInfo = null;
        this.activeTab = 'context';
        
        // Get element info
        const tagName = targetElement.tagName.toLowerCase();
        const id = targetElement.id ? `#${targetElement.id}` : '';
        const classes = targetElement.className && typeof targetElement.className === 'string'
            ? '.' + targetElement.className.trim().split(/\s+/).slice(0, 2).join('.')
            : '';
        
        this.elementInfo = `<${tagName}${id}${classes}>`;
        
        // Render initial state with context data (from page)
        this.render();
        this.element.style.display = 'flex';
        
        // Fetch additional info from server (hierarchy, source)
        this.fetchBlockInfo();
    }

    /**
     * Hide the panel
     */
    hide() {
        if (this.element) {
            this.element.style.display = 'none';
        }
        this.currentBlock = null;
        this.blockInfo = null;
    }

    /**
     * Destroy the panel
     */
    destroy() {
        this.element?.remove();
        this.element = null;
    }

    /**
     * Fetch detailed block info from server
     */
    async fetchBlockInfo() {
        if (!this.currentBlock) return;
        
        this.isLoading = true;
        this.updateTabContent();
        
        try {
            const result = await getBlockInfo(
                this.currentBlock.template,
                this.currentBlock.block,
                this.currentBlock.line
            );
            
            if (result.success && result.data) {
                this.blockInfo = result.data;
            }
        } catch (e) {
            console.warn('DevTools: Failed to fetch block info', e);
        } finally {
            this.isLoading = false;
            this.updateTabContent();
        }
    }

    /**
     * Render the panel content
     */
    render() {
        if (!this.element || !this.currentBlock) return;
        
        const { block, template, line, blockId } = this.currentBlock;
        
        this.element.innerHTML = `
            <div class="detail-header">
                <div class="element-info">${escapeHtml(this.elementInfo)}</div>
                <div class="block-title">{% block ${escapeHtml(block)} %}</div>
                <div class="template-info">
                    ${escapeHtml(shortenPath(template))}
                    <span class="line-num">:${line}</span>
                </div>
            </div>
            
            <div class="detail-tabs">
                <button class="detail-tab ${this.activeTab === 'context' ? 'active' : ''}" data-tab="context">
                    Context
                </button>
                <button class="detail-tab ${this.activeTab === 'hierarchy' ? 'active' : ''}" data-tab="hierarchy">
                    Hierarchy
                </button>
                <button class="detail-tab ${this.activeTab === 'source' ? 'active' : ''}" data-tab="source">
                    Source
                </button>
            </div>
            
            <div class="detail-content">
                <div class="tab-pane ${this.activeTab === 'context' ? 'active' : ''}" data-pane="context">
                    ${this.renderContextTab()}
                </div>
                <div class="tab-pane ${this.activeTab === 'hierarchy' ? 'active' : ''}" data-pane="hierarchy">
                    ${this.renderHierarchyTab()}
                </div>
                <div class="tab-pane ${this.activeTab === 'source' ? 'active' : ''}" data-pane="source">
                    ${this.renderSourceTab()}
                </div>
            </div>
            
            <div class="detail-footer">
                <button class="detail-btn detail-btn-secondary" data-action="close">
                    Close
                </button>
                <button class="detail-btn detail-btn-primary" data-action="open-editor">
                    Open in Editor
                </button>
            </div>
        `;
        
        this.attachEvents();
    }

    /**
     * Update only the tab content (for loading states)
     */
    updateTabContent() {
        if (!this.element) return;
        
        const contextPane = this.element.querySelector('[data-pane="context"]');
        const hierarchyPane = this.element.querySelector('[data-pane="hierarchy"]');
        const sourcePane = this.element.querySelector('[data-pane="source"]');
        
        if (contextPane) contextPane.innerHTML = this.renderContextTab();
        if (hierarchyPane) hierarchyPane.innerHTML = this.renderHierarchyTab();
        if (sourcePane) sourcePane.innerHTML = this.renderSourceTab();
        
        // Re-attach expand/collapse events for variable tree
        this.attachTreeEvents();
    }

    /**
     * Render the Context tab content
     */
    renderContextTab() {
        const { blockId } = this.currentBlock;
        const blockContext = this.contextData[blockId];
        
        if (!blockContext || !blockContext.context) {
            return '<div class="source-loading">No context data available</div>';
        }
        
        const context = blockContext.context;
        const keys = Object.keys(context);
        
        if (keys.length === 0) {
            return '<div class="source-loading">No variables in context</div>';
        }
        
        return `
            <ul class="var-tree">
                ${keys.map(key => this.renderVariable(key, context[key])).join('')}
            </ul>
        `;
    }

    /**
     * Render a single variable in the tree
     */
    renderVariable(name, info, depth = 0) {
        const hasChildren = this.hasExpandableContent(info);
        const typeClass = this.getTypeClass(info.type);
        const displayValue = this.getDisplayValue(info);
        
        return `
            <li class="var-item" data-depth="${depth}">
                <div class="var-row">
                    <span class="var-toggle ${hasChildren ? 'expandable' : ''}"></span>
                    <span class="var-name">${escapeHtml(name)}</span>
                    <span class="var-type">${escapeHtml(this.getTypeLabel(info))}</span>
                    ${displayValue ? `<span class="var-value ${typeClass}">${escapeHtml(displayValue)}</span>` : ''}
                </div>
                ${hasChildren ? `<ul class="var-children">${this.renderVariableChildren(info)}</ul>` : ''}
            </li>
        `;
    }

    /**
     * Check if a variable has expandable content
     */
    hasExpandableContent(info) {
        if (!info) return false;
        if (info.properties && Object.keys(info.properties).length > 0) return true;
        if (info.items && Object.keys(info.items).length > 0) return true;
        if (info.keys && info.keys.length > 0) return true;
        return false;
    }

    /**
     * Render children of an expandable variable
     */
    renderVariableChildren(info) {
        const children = [];
        
        // Object properties
        if (info.properties) {
            for (const [key, value] of Object.entries(info.properties)) {
                children.push(this.renderVariable(key, value, 1));
            }
        }
        
        // Array/object items
        if (info.items) {
            for (const [key, value] of Object.entries(info.items)) {
                children.push(this.renderVariable(key, value, 1));
            }
        }
        
        // Array keys (for associative arrays)
        if (info.keys && !info.items) {
            for (const key of info.keys) {
                children.push(`
                    <li class="var-item">
                        <div class="var-row">
                            <span class="var-toggle"></span>
                            <span class="var-name">${escapeHtml(key)}</span>
                            <span class="var-type">key</span>
                        </div>
                    </li>
                `);
            }
        }
        
        return children.join('');
    }

    /**
     * Get CSS class for variable type
     */
    getTypeClass(type) {
        switch (type) {
            case 'string': return 'string';
            case 'int':
            case 'float': return 'number';
            case 'bool': return 'bool';
            case 'null': return 'null';
            case 'object': return 'object';
            default: return '';
        }
    }

    /**
     * Get display label for variable type
     */
    getTypeLabel(info) {
        if (!info) return 'unknown';
        
        let label = info.type;
        
        if (info.class) {
            label = info.class;
        }
        
        if (info.count !== undefined) {
            label += `(${info.count})`;
        }
        
        if (info.length !== undefined && info.type === 'string') {
            label += `[${info.length}]`;
        }
        
        return label;
    }

    /**
     * Get display value for a variable
     */
    getDisplayValue(info) {
        if (!info) return '';
        
        if (info.value !== undefined) {
            if (info.type === 'bool') {
                return info.value ? 'true' : 'false';
            }
            if (info.type === 'string') {
                return `"${info.value}"`;
            }
            return String(info.value);
        }
        
        if (info.preview) {
            return `"${info.preview}"`;
        }
        
        if (info.name) {
            return info.name;
        }
        
        if (info.id) {
            return `id: ${info.id}`;
        }
        
        return '';
    }

    /**
     * Render the Hierarchy tab content
     */
    renderHierarchyTab() {
        if (this.isLoading) {
            return '<div class="source-loading"><span class="devtools-loading"></span> Loading hierarchy...</div>';
        }
        
        if (!this.blockInfo || !this.blockInfo.hierarchy) {
            return '<div class="source-loading">Hierarchy information not available</div>';
        }
        
        const hierarchy = this.blockInfo.hierarchy;
        const currentTemplate = this.currentBlock.template;
        
        return `
            <div class="hierarchy-tree">
                ${hierarchy.map((item, index) => {
                    const isCurrent = item.template === currentTemplate;
                    const indent = '└─'.repeat(index);
                    const blockCount = item.blocks ? item.blocks.length : 0;
                    
                    return `
                        <div class="hierarchy-item ${isCurrent ? 'current' : ''} ${!isCurrent ? 'clickable' : ''}"
                             data-template="${escapeHtml(item.template)}"
                             data-line="1">
                            <span class="hierarchy-indent">${indent}</span>
                            <span class="hierarchy-template">${escapeHtml(shortenPath(item.template))}</span>
                            <span class="hierarchy-blocks">${blockCount} blocks</span>
                        </div>
                    `;
                }).join('')}
            </div>
            
            ${this.blockInfo.blocks ? this.renderBlockList() : ''}
        `;
    }

    /**
     * Render the list of blocks in current template
     */
    renderBlockList() {
        const blocks = this.blockInfo.blocks;
        const blockNames = Object.keys(blocks);
        
        if (blockNames.length === 0) return '';
        
        return `
            <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid #333;">
                <div style="color: #888; font-size: 10px; margin-bottom: 8px;">
                    Blocks in this template:
                </div>
                ${blockNames.map(name => {
                    const isCurrent = name === this.currentBlock.block;
                    return `
                        <div class="hierarchy-item ${isCurrent ? 'current' : ''}"
                             style="padding: 4px 8px; font-size: 11px;">
                            <span style="color: ${isCurrent ? '#42b883' : '#9cdcfe'}">
                                ${escapeHtml(name)}
                            </span>
                            <span class="hierarchy-blocks">:${blocks[name].line}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    /**
     * Render the Source tab content
     */
    renderSourceTab() {
        if (this.isLoading) {
            return '<div class="source-loading"><span class="devtools-loading"></span> Loading source...</div>';
        }
        
        if (!this.blockInfo || !this.blockInfo.source) {
            return '<div class="source-loading">Source code not available</div>';
        }
        
        const { lines, blockStart, blockEnd } = this.blockInfo.source;
        
        if (!lines || lines.length === 0) {
            return '<div class="source-loading">No source lines available</div>';
        }
        
        return `
            <div class="source-container">
                ${lines.map(line => {
                    const isBlockLine = line.isBlockLine;
                    const isStart = line.isStartLine;
                    
                    return `
                        <div class="source-line ${isBlockLine ? 'highlight' : ''} ${isStart ? 'block-start' : ''}">
                            <span class="line-number">${line.number}</span>
                            <span class="line-content">${highlightTwigSyntax(escapeHtml(line.content))}</span>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    /**
     * Attach event listeners
     */
    attachEvents() {
        if (!this.element) return;
        
        // Tab switching
        this.element.querySelectorAll('.detail-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.activeTab = e.target.dataset.tab;
                this.updateTabs();
            });
        });
        
        // Footer buttons
        this.element.querySelector('[data-action="close"]')?.addEventListener('click', () => {
            this.hide();
            this.options.onClose?.();
        });
        
        this.element.querySelector('[data-action="open-editor"]')?.addEventListener('click', () => {
            this.handleOpenEditor();
        });
        
        // Hierarchy item clicks
        this.element.querySelectorAll('.hierarchy-item.clickable').forEach(item => {
            item.addEventListener('click', () => {
                const template = item.dataset.template;
                const line = parseInt(item.dataset.line, 10) || 1;
                openInEditor(template, line);
            });
        });
        
        // Variable tree expand/collapse
        this.attachTreeEvents();
    }

    /**
     * Attach tree expand/collapse events
     */
    attachTreeEvents() {
        if (!this.element) return;
        
        this.element.querySelectorAll('.var-row').forEach(row => {
            row.addEventListener('click', (e) => {
                const item = row.closest('.var-item');
                if (item && row.querySelector('.var-toggle.expandable')) {
                    item.classList.toggle('expanded');
                }
            });
        });
    }

    /**
     * Update tab active states
     */
    updateTabs() {
        if (!this.element) return;
        
        // Update tab buttons
        this.element.querySelectorAll('.detail-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === this.activeTab);
        });
        
        // Update tab panes
        this.element.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.toggle('active', pane.dataset.pane === this.activeTab);
        });
    }

    /**
     * Handle opening file in editor
     */
    async handleOpenEditor() {
        if (!this.currentBlock) return;
        
        try {
            const result = await openInEditor(
                this.currentBlock.template,
                this.currentBlock.line
            );
            
            if (result.success) {
                this.options.onOpenEditor?.(result);
            } else if (result.editorUrl) {
                // Fallback: use editor URL
                window.location.href = result.editorUrl;
            } else if (result.error) {
                console.warn('DevTools: Failed to open editor:', result.error);
            }
        } catch (e) {
            console.warn('DevTools: Failed to open editor', e);
        }
    }
}
