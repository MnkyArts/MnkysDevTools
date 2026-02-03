/**
 * DevTools Inspector Styles
 * Contains all CSS styles for the inspector UI components
 */

export const COLORS = {
    accent: '#1699F7',
    accentDark: '#0881d8',
    bg: '#1e1e1e',
    bgLight: '#2d2d2d',
    bgLighter: '#333',
    text: '#e0e0e0',
    textMuted: '#888',
    textDark: '#666',
    border: '#444',
    error: '#dc3545',
    warning: '#f0ad4e',
    info: '#5bc0de',
    overlay: 'rgba(66, 184, 131, 0.15)',
};

export const FONTS = {
    mono: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
    system: 'system-ui, -apple-system, sans-serif',
};

export const Z_INDEX = {
    overlay: 2147483640,
    tooltip: 2147483641,
    panel: 2147483642,
    detailPanel: 2147483643,
    notification: 2147483650,
    toggle: 2147483630,
};

/**
 * Inject all inspector styles into the document
 */
export function injectStyles() {
    if (document.getElementById('__mnkys-devtools-styles__')) {
        return;
    }

    const style = document.createElement('style');
    style.id = '__mnkys-devtools-styles__';
    style.textContent = getStyles();
    document.head.appendChild(style);
}

/**
 * Remove all injected styles
 */
export function removeStyles() {
    document.getElementById('__mnkys-devtools-styles__')?.remove();
}

function getStyles() {
    return `
/* ========================================
   DevTools Inspector - Base Styles
   ======================================== */

.mnkys-devtools-active {
    cursor: crosshair !important;
}

.mnkys-devtools-active * {
    cursor: crosshair !important;
}

/* ========================================
   Toggle Button
   ======================================== */

#__mnkys-devtools-toggle__ {
    position: fixed;
    bottom: 20px;
    left: 20px;
    z-index: ${Z_INDEX.toggle};
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background-color: ${COLORS.bg};
    color: ${COLORS.accent};
    border: 2px solid ${COLORS.accent};
    border-radius: 6px;
    cursor: pointer;
    font-family: ${FONTS.system};
    font-size: 12px;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: all 0.15s ease;
}

#__mnkys-devtools-toggle__:hover {
    background-color: ${COLORS.accent};
    color: ${COLORS.bg};
}

#__mnkys-devtools-toggle__.active {
    background-color: ${COLORS.accent};
    color: ${COLORS.bg};
}

/* ========================================
   Highlight Overlay
   ======================================== */

#__mnkys-devtools-overlay__ {
    position: fixed;
    pointer-events: none;
    z-index: ${Z_INDEX.overlay};
    background-color: ${COLORS.overlay};
    border: 2px solid ${COLORS.accent};
    border-radius: 3px;
    transition: all 0.12s ease-out;
    display: none;
    box-sizing: border-box;
}

/* ========================================
   Tooltip
   ======================================== */

#__mnkys-devtools-tooltip__ {
    position: fixed;
    pointer-events: none;
    z-index: ${Z_INDEX.tooltip};
    background-color: ${COLORS.bg};
    color: ${COLORS.text};
    padding: 10px 14px;
    border-radius: 6px;
    font-size: 12px;
    font-family: ${FONTS.mono};
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
    max-width: 400px;
    display: none;
    border: 1px solid ${COLORS.accent};
    line-height: 1.4;
}

#__mnkys-devtools-tooltip__ .element-tag {
    color: ${COLORS.textMuted};
    font-size: 10px;
    margin-bottom: 6px;
    font-style: italic;
}

#__mnkys-devtools-tooltip__ .block-name {
    color: ${COLORS.accent};
    font-weight: 700;
    font-size: 13px;
    margin-bottom: 4px;
}

#__mnkys-devtools-tooltip__ .block-name::before {
    content: '{% block ';
    color: ${COLORS.textDark};
    font-weight: 400;
}

#__mnkys-devtools-tooltip__ .block-name::after {
    content: ' %}';
    color: ${COLORS.textDark};
    font-weight: 400;
}

#__mnkys-devtools-tooltip__ .template-path {
    color: #9cdcfe;
    font-size: 11px;
    word-break: break-all;
}

/* ========================================
   Block List Panel (Right Side)
   ======================================== */

#__mnkys-devtools-panel__ {
    position: fixed;
    right: 20px;
    top: 20px;
    width: 320px;
    max-height: 45vh;
    background-color: ${COLORS.bg};
    color: ${COLORS.text};
    border-radius: 8px;
    font-size: 12px;
    font-family: ${FONTS.mono};
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    z-index: ${Z_INDEX.panel};
    border: 1px solid ${COLORS.accent};
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

#__mnkys-devtools-panel__ .panel-header {
    padding: 12px;
    border-bottom: 1px solid ${COLORS.bgLighter};
    flex-shrink: 0;
}

#__mnkys-devtools-panel__ .panel-title {
    color: ${COLORS.accent};
    font-size: 13px;
    font-weight: 600;
    margin: 0 0 8px;
}

#__mnkys-devtools-panel__ .panel-search {
    width: 100%;
    padding: 6px 10px;
    background: ${COLORS.bgLight};
    border: 1px solid ${COLORS.border};
    border-radius: 4px;
    color: ${COLORS.text};
    font-size: 11px;
    font-family: inherit;
    outline: none;
    box-sizing: border-box;
}

#__mnkys-devtools-panel__ .panel-search:focus {
    border-color: ${COLORS.accent};
}

#__mnkys-devtools-panel__ .panel-stats {
    font-size: 10px;
    color: ${COLORS.textDark};
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
    background: ${COLORS.border};
    border-radius: 3px;
}

#__mnkys-devtools-panel__ .block-item {
    padding: 6px 12px;
    cursor: pointer;
    border-left: 2px solid transparent;
    transition: all 0.1s;
}

#__mnkys-devtools-panel__ .block-item:hover {
    background: ${COLORS.bgLight};
    border-left-color: ${COLORS.accent};
}

#__mnkys-devtools-panel__ .block-item-name {
    color: ${COLORS.accent};
    font-weight: 500;
}

#__mnkys-devtools-panel__ .block-item-path {
    color: ${COLORS.textDark};
    font-size: 10px;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

#__mnkys-devtools-panel__ .panel-footer {
    padding: 8px 12px;
    border-top: 1px solid ${COLORS.bgLighter};
    font-size: 10px;
    color: ${COLORS.textDark};
}

#__mnkys-devtools-panel__ kbd {
    background: ${COLORS.bgLighter};
    padding: 1px 4px;
    border-radius: 2px;
}

#__mnkys-devtools-panel__ .panel-empty {
    padding: 20px;
    text-align: center;
    color: ${COLORS.textDark};
}

#__mnkys-devtools-panel__ .highlight {
    background: rgba(66, 184, 131, 0.3);
    border-radius: 2px;
}

/* ========================================
   Detail Panel (Inspector Panel)
   ======================================== */

#__mnkys-devtools-detail__ {
    position: fixed;
    right: 20px;
    top: 20px;
    width: 450px;
    max-height: 80vh;
    background-color: ${COLORS.bg};
    color: ${COLORS.text};
    border-radius: 8px;
    font-size: 12px;
    font-family: ${FONTS.mono};
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.6);
    z-index: ${Z_INDEX.detailPanel};
    border: 1px solid ${COLORS.accent};
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Detail Panel Header */
.detail-header {
    padding: 14px 16px;
    border-bottom: 1px solid ${COLORS.bgLighter};
    flex-shrink: 0;
}

.detail-header .element-info {
    color: ${COLORS.textMuted};
    font-size: 11px;
    margin-bottom: 6px;
}

.detail-header .block-title {
    color: ${COLORS.accent};
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 4px;
}

.detail-header .template-info {
    color: #9cdcfe;
    font-size: 11px;
    word-break: break-all;
}

.detail-header .template-info .line-num {
    color: ${COLORS.textMuted};
}

/* Detail Panel Tabs */
.detail-tabs {
    display: flex;
    border-bottom: 1px solid ${COLORS.bgLighter};
    flex-shrink: 0;
}

.detail-tab {
    flex: 1;
    padding: 10px;
    text-align: center;
    cursor: pointer;
    background: transparent;
    border: none;
    color: ${COLORS.textMuted};
    font-size: 11px;
    font-family: ${FONTS.mono};
    border-bottom: 2px solid transparent;
    transition: all 0.15s;
}

.detail-tab:hover {
    color: ${COLORS.text};
    background: ${COLORS.bgLight};
}

.detail-tab.active {
    color: ${COLORS.accent};
    border-bottom-color: ${COLORS.accent};
}

/* Detail Panel Content */
.detail-content {
    flex: 1;
    overflow-y: auto;
    padding: 12px 0;
}

.detail-content::-webkit-scrollbar {
    width: 6px;
}

.detail-content::-webkit-scrollbar-thumb {
    background: ${COLORS.border};
    border-radius: 3px;
}

.tab-pane {
    display: none;
    padding: 0 16px;
}

.tab-pane.active {
    display: block;
}

/* Context Tab - Variable Tree */
.var-tree {
    list-style: none;
    margin: 0;
    padding: 0;
}

.var-item {
    margin: 2px 0;
}

.var-row {
    display: flex;
    align-items: flex-start;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: background 0.1s;
}

.var-row:hover {
    background: ${COLORS.bgLight};
}

.var-toggle {
    width: 16px;
    color: ${COLORS.textMuted};
    flex-shrink: 0;
}

.var-toggle.expandable::before {
    content: '▶';
    font-size: 8px;
}

.var-item.expanded > .var-row .var-toggle.expandable::before {
    content: '▼';
}

.var-name {
    color: #9cdcfe;
    margin-right: 6px;
}

.var-type {
    color: ${COLORS.textMuted};
    font-size: 10px;
    margin-right: 6px;
}

.var-value {
    color: #ce9178;
    font-size: 11px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 200px;
}

.var-value.string { color: #ce9178; }
.var-value.number { color: #b5cea8; }
.var-value.bool { color: #569cd6; }
.var-value.null { color: #569cd6; }
.var-value.object { color: #4ec9b0; }

.var-children {
    display: none;
    margin-left: 16px;
    border-left: 1px solid ${COLORS.bgLighter};
    padding-left: 8px;
}

.var-item.expanded > .var-children {
    display: block;
}

/* Hierarchy Tab */
.hierarchy-tree {
    padding: 8px 0;
}

.hierarchy-item {
    padding: 6px 12px;
    margin: 2px 0;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
}

.hierarchy-item.current {
    background: rgba(66, 184, 131, 0.15);
    border-left: 3px solid ${COLORS.accent};
}

.hierarchy-indent {
    color: ${COLORS.textDark};
    font-size: 10px;
}

.hierarchy-template {
    color: #9cdcfe;
    font-size: 11px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.hierarchy-blocks {
    color: ${COLORS.textMuted};
    font-size: 10px;
}

.hierarchy-item.clickable {
    cursor: pointer;
}

.hierarchy-item.clickable:hover {
    background: ${COLORS.bgLight};
}

/* Source Tab */
.source-container {
    background: #1a1a1a;
    border-radius: 4px;
    overflow: hidden;
}

.source-line {
    display: flex;
    font-size: 11px;
    line-height: 1.5;
}

.source-line.highlight {
    background: rgba(66, 184, 131, 0.1);
}

.source-line.block-start {
    background: rgba(66, 184, 131, 0.2);
}

.line-number {
    width: 40px;
    padding: 0 8px;
    text-align: right;
    color: ${COLORS.textDark};
    background: #151515;
    flex-shrink: 0;
    user-select: none;
}

.line-content {
    padding: 0 12px;
    white-space: pre;
    overflow-x: auto;
    flex: 1;
}

.source-loading {
    padding: 20px;
    text-align: center;
    color: ${COLORS.textMuted};
}

/* Twig Syntax Highlighting */
.twig-tag { color: #c586c0; }
.twig-name { color: #9cdcfe; }
.twig-string { color: #ce9178; }
.twig-comment { color: #6a9955; font-style: italic; }
.html-tag { color: #569cd6; }
.html-attr { color: #9cdcfe; }
.html-value { color: #ce9178; }

/* Detail Panel Footer */
.detail-footer {
    padding: 12px 16px;
    border-top: 1px solid ${COLORS.bgLighter};
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
}

.detail-btn {
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 12px;
    font-family: ${FONTS.mono};
    cursor: pointer;
    transition: all 0.15s;
    border: none;
}

.detail-btn-primary {
    background: ${COLORS.accent};
    color: ${COLORS.bg};
}

.detail-btn-primary:hover {
    background: ${COLORS.accentDark};
}

.detail-btn-secondary {
    background: ${COLORS.bgLight};
    color: ${COLORS.text};
    border: 1px solid ${COLORS.border};
}

.detail-btn-secondary:hover {
    background: ${COLORS.bgLighter};
}

/* ========================================
   Notifications
   ======================================== */

.devtools-notification {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    border-radius: 6px;
    font-size: 12px;
    font-family: ${FONTS.system};
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.4);
    z-index: ${Z_INDEX.notification};
    opacity: 0;
    transition: opacity 0.2s;
}

.devtools-notification.success {
    background-color: ${COLORS.bg};
    color: ${COLORS.accent};
    border: 1px solid ${COLORS.accent};
}

.devtools-notification.error {
    background-color: ${COLORS.error};
    color: #fff;
    border: 1px solid ${COLORS.error};
}

/* ========================================
   Loading State
   ======================================== */

.devtools-loading {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid ${COLORS.bgLighter};
    border-top-color: ${COLORS.accent};
    border-radius: 50%;
    animation: devtools-spin 0.8s linear infinite;
}

@keyframes devtools-spin {
    to { transform: rotate(360deg); }
}
`;
}
