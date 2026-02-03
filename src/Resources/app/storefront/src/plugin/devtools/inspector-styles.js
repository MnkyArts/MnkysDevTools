/**
 * DevTools Inspector Styles
 * Modern, polished UI with glassmorphism effects and smooth animations
 */

// Modern color palette with better contrast (WCAG AA compliant)
export const COLORS = {
    // Primary accent - vibrant cyan/blue
    accent: '#00D9FF',
    accentHover: '#00B8D9',
    accentMuted: 'rgba(0, 217, 255, 0.15)',
    
    // Secondary accent - warm highlight
    secondary: '#FF6B6B',
    success: '#00E676',
    warning: '#FFD93D',
    error: '#FF5252',
    
    // Background layers (dark theme)
    bgDeep: '#0D1117',
    bg: '#161B22',
    bgElevated: '#21262D',
    bgHover: '#30363D',
    bgGlass: 'rgba(22, 27, 34, 0.85)',
    
    // Text with proper contrast
    text: '#F0F6FC',
    textSecondary: '#8B949E',
    textMuted: '#6E7681',
    
    // Borders
    border: '#30363D',
    borderHover: '#8B949E',
    borderAccent: 'rgba(0, 217, 255, 0.4)',
    
    // Overlay
    overlay: 'rgba(0, 217, 255, 0.12)',
    overlayBorder: '#00D9FF',
    
    // Syntax highlighting (VS Code inspired)
    syntax: {
        keyword: '#FF79C6',
        string: '#A5D6FF',
        variable: '#79C0FF',
        number: '#A5D6A7',
        comment: '#6E7681',
        tag: '#7EE787',
        attribute: '#D2A8FF',
    },
};

export const FONTS = {
    mono: '"JetBrains Mono", "Fira Code", "SF Mono", "Consolas", monospace',
    system: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

export const Z_INDEX = {
    overlay: 2147483640,
    tooltip: 2147483641,
    panel: 2147483642,
    detailPanel: 2147483643,
    notification: 2147483650,
    toggle: 2147483630,
};

// Spacing scale (4px base)
const SPACING = {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
};

// Border radius
const RADIUS = {
    sm: '6px',
    md: '10px',
    lg: '14px',
    full: '9999px',
};

// Shadows
const SHADOWS = {
    sm: '0 2px 8px rgba(0, 0, 0, 0.3)',
    md: '0 4px 16px rgba(0, 0, 0, 0.4)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.5)',
    glow: '0 0 20px rgba(0, 217, 255, 0.3)',
    glowStrong: '0 0 30px rgba(0, 217, 255, 0.4)',
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
   DevTools Inspector - Modern UI
   ======================================== */

/* Respect reduced motion preference */
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* Base active state */
.mnkys-devtools-active {
    cursor: crosshair !important;
}

.mnkys-devtools-active * {
    cursor: crosshair !important;
}

/* ========================================
   Highlight Overlay
   ======================================== */

#__mnkys-devtools-overlay__ {
    position: fixed;
    pointer-events: none;
    z-index: ${Z_INDEX.overlay};
    
    background: ${COLORS.overlay};
    border: 2px solid ${COLORS.overlayBorder};
    border-radius: ${RADIUS.sm};
    
    box-shadow: 0 0 0 4px ${COLORS.accentMuted},
                inset 0 0 20px ${COLORS.accentMuted};
    
    transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    display: none;
    box-sizing: border-box;
}

/* ========================================
   Tooltip - Glassmorphism Card
   ======================================== */

#__mnkys-devtools-tooltip__ {
    position: fixed;
    pointer-events: none;
    z-index: ${Z_INDEX.tooltip};
    
    background: ${COLORS.bgGlass};
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    
    color: ${COLORS.text};
    padding: ${SPACING.md} ${SPACING.lg};
    border-radius: ${RADIUS.md};
    
    font-size: 12px;
    font-family: ${FONTS.mono};
    line-height: 1.5;
    
    border: 1px solid ${COLORS.borderAccent};
    box-shadow: ${SHADOWS.lg}, ${SHADOWS.glow};
    
    max-width: 420px;
    display: none;
    
    animation: tooltipIn 0.15s ease-out;
}

@keyframes tooltipIn {
    from {
        opacity: 0;
        transform: translateY(4px) scale(0.98);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

#__mnkys-devtools-tooltip__ .element-tag {
    color: ${COLORS.textMuted};
    font-size: 10px;
    margin-bottom: ${SPACING.sm};
    font-family: ${FONTS.mono};
    opacity: 0.8;
}

#__mnkys-devtools-tooltip__ .block-name {
    color: ${COLORS.accent};
    font-weight: 700;
    font-size: 14px;
    margin-bottom: ${SPACING.xs};
    display: flex;
    align-items: center;
    gap: ${SPACING.xs};
}

#__mnkys-devtools-tooltip__ .block-name::before {
    content: '{% block';
    color: ${COLORS.syntax.keyword};
    font-weight: 400;
    font-size: 12px;
}

#__mnkys-devtools-tooltip__ .block-name::after {
    content: '%}';
    color: ${COLORS.syntax.keyword};
    font-weight: 400;
    font-size: 12px;
}

#__mnkys-devtools-tooltip__ .template-path {
    color: ${COLORS.syntax.variable};
    font-size: 11px;
    word-break: break-all;
    padding: ${SPACING.sm} ${SPACING.md};
    background: ${COLORS.bgDeep};
    border-radius: ${RADIUS.sm};
    margin-top: ${SPACING.sm};
}

/* ========================================
   Block List Panel (Right Side)
   ======================================== */

#__mnkys-devtools-panel__ {
    position: fixed;
    right: ${SPACING.xl};
    top: ${SPACING.xl};
    width: 340px;
    max-height: 50vh;
    
    background: ${COLORS.bgGlass};
    backdrop-filter: blur(20px) saturate(180%);
    -webkit-backdrop-filter: blur(20px) saturate(180%);
    
    color: ${COLORS.text};
    border-radius: ${RADIUS.lg};
    font-size: 12px;
    font-family: ${FONTS.mono};
    
    border: 1px solid ${COLORS.border};
    box-shadow: ${SHADOWS.lg};
    
    z-index: ${Z_INDEX.panel};
    display: flex;
    flex-direction: column;
    overflow: hidden;
    
    animation: panelSlideIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes panelSlideIn {
    from {
        opacity: 0;
        transform: translateX(20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

#__mnkys-devtools-panel__ .panel-header {
    padding: ${SPACING.lg};
    border-bottom: 1px solid ${COLORS.border};
    flex-shrink: 0;
    background: ${COLORS.bgElevated};
}

#__mnkys-devtools-panel__ .panel-title {
    color: ${COLORS.text};
    font-size: 14px;
    font-weight: 700;
    margin: 0 0 ${SPACING.md};
    display: flex;
    align-items: center;
    gap: ${SPACING.sm};
}

#__mnkys-devtools-panel__ .panel-title::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background: ${COLORS.accent};
    border-radius: 50%;
    box-shadow: 0 0 8px ${COLORS.accent};
}

#__mnkys-devtools-panel__ .panel-search {
    width: 100%;
    padding: ${SPACING.md} ${SPACING.md};
    background: ${COLORS.bgDeep};
    border: 1px solid ${COLORS.border};
    border-radius: ${RADIUS.sm};
    color: ${COLORS.text};
    font-size: 12px;
    font-family: inherit;
    outline: none;
    box-sizing: border-box;
    transition: all 0.2s ease;
}

#__mnkys-devtools-panel__ .panel-search::placeholder {
    color: ${COLORS.textMuted};
}

#__mnkys-devtools-panel__ .panel-search:focus {
    border-color: ${COLORS.accent};
    box-shadow: 0 0 0 3px ${COLORS.accentMuted};
}

#__mnkys-devtools-panel__ .panel-stats {
    font-size: 11px;
    color: ${COLORS.textSecondary};
    margin-top: ${SPACING.sm};
}

#__mnkys-devtools-panel__ .panel-list {
    flex: 1;
    overflow-y: auto;
    padding: ${SPACING.sm} 0;
}

#__mnkys-devtools-panel__ .panel-list::-webkit-scrollbar {
    width: 6px;
}

#__mnkys-devtools-panel__ .panel-list::-webkit-scrollbar-track {
    background: transparent;
}

#__mnkys-devtools-panel__ .panel-list::-webkit-scrollbar-thumb {
    background: ${COLORS.border};
    border-radius: ${RADIUS.full};
}

#__mnkys-devtools-panel__ .panel-list::-webkit-scrollbar-thumb:hover {
    background: ${COLORS.borderHover};
}

#__mnkys-devtools-panel__ .block-item {
    padding: ${SPACING.md} ${SPACING.lg};
    cursor: pointer;
    border-left: 3px solid transparent;
    transition: all 0.15s ease;
    margin: 2px 0;
}

#__mnkys-devtools-panel__ .block-item:hover {
    background: ${COLORS.bgHover};
    border-left-color: ${COLORS.accent};
}

#__mnkys-devtools-panel__ .block-item-name {
    color: ${COLORS.accent};
    font-weight: 600;
    font-size: 12px;
}

#__mnkys-devtools-panel__ .block-item-path {
    color: ${COLORS.textMuted};
    font-size: 10px;
    margin-top: ${SPACING.xs};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

#__mnkys-devtools-panel__ .panel-footer {
    padding: ${SPACING.md} ${SPACING.lg};
    border-top: 1px solid ${COLORS.border};
    font-size: 10px;
    color: ${COLORS.textMuted};
    background: ${COLORS.bgElevated};
}

#__mnkys-devtools-panel__ kbd {
    display: inline-block;
    background: ${COLORS.bgDeep};
    color: ${COLORS.textSecondary};
    padding: 2px 6px;
    border-radius: ${RADIUS.sm};
    font-size: 10px;
    font-family: ${FONTS.mono};
    border: 1px solid ${COLORS.border};
}

#__mnkys-devtools-panel__ .panel-empty {
    padding: ${SPACING.xxl};
    text-align: center;
    color: ${COLORS.textMuted};
}

#__mnkys-devtools-panel__ .highlight {
    background: ${COLORS.accentMuted};
    color: ${COLORS.accent};
    border-radius: 2px;
    padding: 0 2px;
}

/* ========================================
   Detail Panel (Inspector Panel)
   ======================================== */

#__mnkys-devtools-detail__ {
    position: fixed;
    right: ${SPACING.xl};
    top: ${SPACING.xl};
    width: 480px;
    max-height: 85vh;
    
    background: ${COLORS.bg};
    color: ${COLORS.text};
    border-radius: ${RADIUS.lg};
    font-size: 12px;
    font-family: ${FONTS.mono};
    
    border: 1px solid ${COLORS.border};
    box-shadow: ${SHADOWS.lg};
    
    z-index: ${Z_INDEX.detailPanel};
    display: flex;
    flex-direction: column;
    overflow: hidden;
    
    animation: detailSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes detailSlideIn {
    from {
        opacity: 0;
        transform: translateX(30px) scale(0.98);
    }
    to {
        opacity: 1;
        transform: translateX(0) scale(1);
    }
}

/* Detail Panel Header */
.detail-header {
    padding: ${SPACING.lg} ${SPACING.xl};
    border-bottom: 1px solid ${COLORS.border};
    flex-shrink: 0;
    background: linear-gradient(180deg, ${COLORS.bgElevated} 0%, ${COLORS.bg} 100%);
}

.detail-header .element-info {
    color: ${COLORS.textMuted};
    font-size: 11px;
    margin-bottom: ${SPACING.sm};
    font-family: ${FONTS.mono};
}

.detail-header .block-title {
    color: ${COLORS.accent};
    font-size: 16px;
    font-weight: 700;
    margin-bottom: ${SPACING.sm};
    display: flex;
    align-items: center;
    gap: ${SPACING.sm};
}

.detail-header .template-info {
    color: ${COLORS.syntax.variable};
    font-size: 11px;
    word-break: break-all;
    padding: ${SPACING.sm} ${SPACING.md};
    background: ${COLORS.bgDeep};
    border-radius: ${RADIUS.sm};
    display: inline-block;
}

.detail-header .template-info .line-num {
    color: ${COLORS.syntax.number};
    font-weight: 600;
}

/* Detail Panel Tabs */
.detail-tabs {
    display: flex;
    border-bottom: 1px solid ${COLORS.border};
    flex-shrink: 0;
    background: ${COLORS.bgElevated};
    padding: 0 ${SPACING.sm};
}

.detail-tab {
    flex: 1;
    padding: ${SPACING.md} ${SPACING.lg};
    text-align: center;
    cursor: pointer;
    background: transparent;
    border: none;
    color: ${COLORS.textSecondary};
    font-size: 12px;
    font-weight: 500;
    font-family: ${FONTS.system};
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
    margin-bottom: -1px;
}

.detail-tab:hover {
    color: ${COLORS.text};
    background: ${COLORS.bgHover};
}

.detail-tab:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px ${COLORS.accentMuted};
}

.detail-tab.active {
    color: ${COLORS.accent};
    border-bottom-color: ${COLORS.accent};
    background: transparent;
}

/* Detail Panel Content */
.detail-content {
    flex: 1;
    overflow-y: auto;
    padding: ${SPACING.lg} 0;
}

.detail-content::-webkit-scrollbar {
    width: 8px;
}

.detail-content::-webkit-scrollbar-track {
    background: ${COLORS.bgDeep};
}

.detail-content::-webkit-scrollbar-thumb {
    background: ${COLORS.border};
    border-radius: ${RADIUS.full};
    border: 2px solid ${COLORS.bgDeep};
}

.detail-content::-webkit-scrollbar-thumb:hover {
    background: ${COLORS.borderHover};
}

.tab-pane {
    display: none;
    padding: 0 ${SPACING.xl};
}

.tab-pane.active {
    display: block;
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
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
    padding: ${SPACING.sm} ${SPACING.md};
    border-radius: ${RADIUS.sm};
    cursor: pointer;
    transition: background 0.15s ease;
}

.var-row:hover {
    background: ${COLORS.bgHover};
}

.var-toggle {
    width: 18px;
    color: ${COLORS.textMuted};
    flex-shrink: 0;
    font-size: 10px;
    transition: transform 0.15s ease;
}

.var-toggle.expandable::before {
    content: '▶';
}

.var-item.expanded > .var-row .var-toggle.expandable {
    transform: rotate(90deg);
}

.var-item.expanded > .var-row .var-toggle.expandable::before {
    content: '▶';
}

.var-name {
    color: ${COLORS.syntax.variable};
    margin-right: ${SPACING.sm};
    font-weight: 500;
}

.var-type {
    color: ${COLORS.textMuted};
    font-size: 10px;
    margin-right: ${SPACING.sm};
    padding: 1px 6px;
    background: ${COLORS.bgDeep};
    border-radius: ${RADIUS.sm};
}

.var-value {
    color: ${COLORS.syntax.string};
    font-size: 11px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 220px;
}

.var-value.string { color: ${COLORS.syntax.string}; }
.var-value.number { color: ${COLORS.syntax.number}; }
.var-value.bool { color: ${COLORS.syntax.keyword}; }
.var-value.null { color: ${COLORS.syntax.keyword}; font-style: italic; }
.var-value.object { color: ${COLORS.syntax.tag}; }

.var-children {
    display: none;
    margin-left: ${SPACING.lg};
    border-left: 2px solid ${COLORS.border};
    padding-left: ${SPACING.md};
    margin-top: ${SPACING.xs};
}

.var-item.expanded > .var-children {
    display: block;
    animation: expandIn 0.2s ease;
}

@keyframes expandIn {
    from {
        opacity: 0;
        transform: translateY(-4px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Hierarchy Tab */
.hierarchy-section {
    margin-bottom: ${SPACING.lg};
}

.hierarchy-section.blocks-section {
    margin-top: ${SPACING.lg};
    padding-top: ${SPACING.lg};
    border-top: 1px solid ${COLORS.border};
}

.hierarchy-label {
    color: ${COLORS.textMuted};
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: ${SPACING.md};
    padding: 0 ${SPACING.sm};
}

.hierarchy-tree {
    padding: ${SPACING.xs} 0;
}

.hierarchy-item {
    padding: ${SPACING.sm} ${SPACING.md};
    margin: 2px 0;
    border-radius: ${RADIUS.sm};
    display: flex;
    align-items: center;
    gap: ${SPACING.sm};
    transition: all 0.15s ease;
    position: relative;
}

.hierarchy-item.current {
    background: ${COLORS.accentMuted};
    border-left: 3px solid ${COLORS.accent};
    margin-left: -3px;
}

.hierarchy-tree-line {
    display: flex;
    align-items: center;
    color: ${COLORS.textMuted};
    font-family: ${FONTS.mono};
    font-size: 12px;
    opacity: 0.4;
    flex-shrink: 0;
}

.tree-line {
    display: inline-block;
    width: 16px;
    text-align: center;
}

.tree-branch {
    display: inline-block;
    width: 8px;
}

.hierarchy-content {
    display: flex;
    align-items: center;
    gap: ${SPACING.sm};
    flex: 1;
    min-width: 0;
}

.hierarchy-icon {
    font-size: 10px;
    flex-shrink: 0;
}

.hierarchy-icon.root {
    color: ${COLORS.accent};
}

.hierarchy-icon.child {
    color: ${COLORS.textMuted};
}

.hierarchy-template {
    color: ${COLORS.syntax.variable};
    font-size: 12px;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
}

.hierarchy-item.current .hierarchy-template {
    color: ${COLORS.accent};
    font-weight: 500;
}

.hierarchy-blocks {
    color: ${COLORS.textMuted};
    font-size: 10px;
    padding: 2px 6px;
    background: ${COLORS.bgDeep};
    border-radius: ${RADIUS.full};
    flex-shrink: 0;
}

.hierarchy-blocks::after {
    content: ' blocks';
}

.hierarchy-current-badge {
    font-size: 9px;
    color: ${COLORS.accent};
    background: ${COLORS.bgDeep};
    padding: 2px 6px;
    border-radius: ${RADIUS.full};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    flex-shrink: 0;
}

.hierarchy-item.clickable {
    cursor: pointer;
}

.hierarchy-item.clickable:hover {
    background: ${COLORS.bgHover};
}

.hierarchy-item.clickable:hover .hierarchy-template {
    color: ${COLORS.text};
}

/* Blocks List */
.blocks-list,
.blocks-tree {
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.block-entry {
    display: flex;
    align-items: center;
    gap: ${SPACING.sm};
    padding: ${SPACING.xs} ${SPACING.md};
    border-radius: ${RADIUS.sm};
    transition: all 0.15s ease;
    cursor: pointer;
    min-height: 28px;
}

.block-entry:hover {
    background: ${COLORS.bgHover};
}

.block-entry.current {
    background: ${COLORS.accentMuted};
}

.block-tree-line {
    display: flex;
    align-items: center;
    color: ${COLORS.textMuted};
    font-family: ${FONTS.mono};
    font-size: 12px;
    opacity: 0.4;
    flex-shrink: 0;
    line-height: 1;
}

.block-tree-line .tree-line {
    display: inline-block;
    width: 16px;
    text-align: center;
}

.block-tree-line .tree-branch {
    display: inline-block;
    width: 8px;
}

.block-icon {
    color: ${COLORS.syntax.keyword};
    font-size: 10px;
    font-family: ${FONTS.mono};
    opacity: 0.7;
    flex-shrink: 0;
}

.block-entry-name {
    color: ${COLORS.syntax.variable};
    font-size: 12px;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.block-entry.current .block-entry-name {
    color: ${COLORS.accent};
    font-weight: 500;
}

.block-line {
    color: ${COLORS.textMuted};
    font-size: 10px;
}

.block-current-badge {
    color: ${COLORS.accent};
    font-size: 8px;
}

/* Source Tab */
.source-container {
    background: ${COLORS.bgDeep};
    border-radius: ${RADIUS.md};
    overflow-x: auto;
    overflow-y: visible;
    border: 1px solid ${COLORS.border};
}

/* Custom scrollbar for source container */
.source-container::-webkit-scrollbar {
    height: 8px;
}

.source-container::-webkit-scrollbar-track {
    background: ${COLORS.bgDeep};
}

.source-container::-webkit-scrollbar-thumb {
    background: ${COLORS.border};
    border-radius: ${RADIUS.full};
}

.source-container::-webkit-scrollbar-thumb:hover {
    background: ${COLORS.borderHover};
}

.source-code {
    display: inline-block;
    min-width: 100%;
}

.source-line {
    display: flex;
    font-size: 12px;
    line-height: 1.6;
    transition: background 0.1s ease;
}

.source-line:hover {
    background: ${COLORS.bgHover};
}

.source-line.highlight {
    background: rgba(0, 217, 255, 0.08);
}

.source-line.block-start {
    background: rgba(0, 217, 255, 0.15);
}

.source-line.block-start .line-number {
    box-shadow: inset 3px 0 0 ${COLORS.accent};
}

.line-number {
    flex-shrink: 0;
    width: 48px;
    min-width: 48px;
    padding: 0 ${SPACING.md};
    text-align: right;
    color: ${COLORS.textMuted};
    background: rgba(0, 0, 0, 0.2);
    user-select: none;
    font-size: 11px;
}

.line-content {
    flex: 1;
    padding: 0 ${SPACING.lg};
    white-space: pre;
}

.source-loading {
    padding: ${SPACING.xxl};
    text-align: center;
    color: ${COLORS.textMuted};
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${SPACING.md};
}

/* Twig Syntax Highlighting */
.twig-tag { color: ${COLORS.syntax.keyword}; }
.twig-name { color: ${COLORS.syntax.variable}; }
.twig-string { color: ${COLORS.syntax.string}; }
.twig-comment { color: ${COLORS.syntax.comment}; font-style: italic; }
.html-tag { color: ${COLORS.syntax.tag}; }
.html-attr { color: ${COLORS.syntax.attribute}; }
.html-value { color: ${COLORS.syntax.string}; }

/* Detail Panel Footer */
.detail-footer {
    padding: ${SPACING.lg} ${SPACING.xl};
    border-top: 1px solid ${COLORS.border};
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    background: ${COLORS.bgElevated};
}

.detail-btn {
    padding: ${SPACING.md} ${SPACING.xl};
    border-radius: ${RADIUS.sm};
    font-size: 13px;
    font-weight: 600;
    font-family: ${FONTS.system};
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    display: flex;
    align-items: center;
    gap: ${SPACING.sm};
}

.detail-btn:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${COLORS.accentMuted};
}

.detail-btn-primary {
    background: ${COLORS.accent};
    color: ${COLORS.bgDeep};
}

.detail-btn-primary:hover {
    background: ${COLORS.accentHover};
    transform: translateY(-1px);
    box-shadow: ${SHADOWS.sm}, 0 0 12px ${COLORS.accentMuted};
}

.detail-btn-primary:active {
    transform: translateY(0);
}

.detail-btn-secondary {
    background: ${COLORS.bgHover};
    color: ${COLORS.text};
    border: 1px solid ${COLORS.border};
}

.detail-btn-secondary:hover {
    background: ${COLORS.border};
    border-color: ${COLORS.borderHover};
}

/* ========================================
   Notifications - Toast Style
   ======================================== */

.devtools-notification {
    position: fixed;
    top: ${SPACING.xl};
    left: 50%;
    transform: translateX(-50%) translateY(-10px);
    
    padding: ${SPACING.md} ${SPACING.xl};
    border-radius: ${RADIUS.full};
    font-size: 13px;
    font-weight: 500;
    font-family: ${FONTS.system};
    
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    
    box-shadow: ${SHADOWS.lg};
    z-index: ${Z_INDEX.notification};
    
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.devtools-notification.success {
    background: ${COLORS.bgGlass};
    color: ${COLORS.accent};
    border: 1px solid ${COLORS.borderAccent};
}

.devtools-notification.error {
    background: rgba(255, 82, 82, 0.9);
    color: #fff;
    border: 1px solid ${COLORS.error};
}

/* ========================================
   Loading Spinner
   ======================================== */

.devtools-loading {
    display: inline-block;
    width: 16px;
    height: 16px;
    border: 2px solid ${COLORS.border};
    border-top-color: ${COLORS.accent};
    border-radius: 50%;
    animation: devtools-spin 0.8s linear infinite;
}

@keyframes devtools-spin {
    to { transform: rotate(360deg); }
}

/* ========================================
   Focus Visible (Accessibility)
   ======================================== */

:focus-visible {
    outline: 2px solid ${COLORS.accent};
    outline-offset: 2px;
}

/* ========================================
   Selection
   ======================================== */

#__mnkys-devtools-panel__ ::selection,
#__mnkys-devtools-detail__ ::selection,
#__mnkys-devtools-tooltip__ ::selection {
    background: ${COLORS.accentMuted};
    color: ${COLORS.text};
}
`;
}
