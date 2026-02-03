/**
 * DevTools Inspector Tooltip
 * Displays block information when hovering over elements
 */

import { escapeHtml, getTwigData } from './inspector-utils.js';

/**
 * InspectorTooltip class - manages the tooltip that follows the cursor
 */
export class InspectorTooltip {
    constructor() {
        this.element = null;
    }

    /**
     * Create and append the tooltip element
     */
    create() {
        if (this.element) {
            return;
        }

        this.element = document.createElement('div');
        this.element.id = '__mnkys-devtools-tooltip__';
        document.body.appendChild(this.element);
    }

    /**
     * Destroy the tooltip element
     */
    destroy() {
        this.element?.remove();
        this.element = null;
    }

    /**
     * Show the tooltip
     */
    show() {
        if (this.element) {
            this.element.style.display = 'block';
        }
    }

    /**
     * Hide the tooltip
     */
    hide() {
        if (this.element) {
            this.element.style.display = 'none';
        }
    }

    /**
     * Update tooltip content for an element
     * @param {HTMLElement} el - The element with twig data
     * @param {MouseEvent} event - The mouse event for positioning
     */
    update(el, event) {
        const data = getTwigData(el);
        if (!data) {
            return;
        }

        const tagName = el.tagName.toLowerCase();
        const id = el.id ? `#${el.id}` : '';
        const classes = el.className && typeof el.className === 'string'
            ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.')
            : '';

        this.element.innerHTML = `
            <div class="element-tag">&lt;${tagName}${id}${classes}&gt;</div>
            <div class="block-name">${escapeHtml(data.block)}</div>
            <div class="template-path">${escapeHtml(data.template)}:${data.line}</div>
        `;

        this.show();
        this.position(event);
    }

    /**
     * Position tooltip near cursor
     * @param {MouseEvent} event - The mouse event
     */
    position(event) {
        if (!this.element || this.element.style.display === 'none') {
            return;
        }

        const padding = 15;
        const rect = this.element.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let x = event.clientX + padding;
        let y = event.clientY + padding;

        // Prevent overflow on right
        if (x + rect.width > viewportWidth - padding) {
            x = event.clientX - rect.width - padding;
        }

        // Prevent overflow on bottom
        if (y + rect.height > viewportHeight - padding) {
            y = event.clientY - rect.height - padding;
        }

        // Ensure minimum padding from edges
        x = Math.max(padding, x);
        y = Math.max(padding, y);

        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
    }

    /**
     * Check if tooltip is visible
     * @returns {boolean}
     */
    isVisible() {
        return this.element && this.element.style.display !== 'none';
    }
}
