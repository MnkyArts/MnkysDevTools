/**
 * DevTools Inspector Overlay
 * Handles the highlight overlay that appears when hovering over elements
 * 
 * Note: Styling is controlled via CSS in inspector-styles.js for consistency
 */

// Border width used for positioning calculations
const OVERLAY_BORDER_WIDTH = 2;

/**
 * InspectorOverlay class - manages the highlight overlay
 */
export class InspectorOverlay {
    constructor() {
        this.element = null;
    }

    /**
     * Create and append the overlay element
     */
    create() {
        if (this.element) {
            return;
        }

        this.element = document.createElement('div');
        this.element.id = '__mnkys-devtools-overlay__';
        document.body.appendChild(this.element);
    }

    /**
     * Destroy the overlay element
     */
    destroy() {
        this.element?.remove();
        this.element = null;
    }

    /**
     * Show the overlay
     */
    show() {
        if (this.element) {
            this.element.style.display = 'block';
        }
    }

    /**
     * Hide the overlay
     */
    hide() {
        if (this.element) {
            this.element.style.display = 'none';
        }
    }

    /**
     * Highlight a specific element
     * @param {HTMLElement} el - The element to highlight
     */
    highlight(el) {
        if (!this.element || !el) {
            return;
        }

        const rect = el.getBoundingClientRect();

        Object.assign(this.element.style, {
            display: 'block',
            left: `${rect.left - OVERLAY_BORDER_WIDTH}px`,
            top: `${rect.top - OVERLAY_BORDER_WIDTH}px`,
            width: `${rect.width + OVERLAY_BORDER_WIDTH * 2}px`,
            height: `${rect.height + OVERLAY_BORDER_WIDTH * 2}px`,
        });
    }

    /**
     * Check if overlay is visible
     * @returns {boolean}
     */
    isVisible() {
        return this.element && this.element.style.display !== 'none';
    }
}
