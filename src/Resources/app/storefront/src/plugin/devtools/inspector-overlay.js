/**
 * DevTools Inspector Overlay
 * Handles the highlight overlay that appears when hovering over elements
 */

/**
 * InspectorOverlay class - manages the highlight overlay
 */
export class InspectorOverlay {
    constructor(options = {}) {
        this.options = {
            overlayColor: 'rgba(66, 184, 131, 0.15)',
            overlayBorderColor: '#1699F7',
            overlayBorderWidth: '2px',
            transitionDuration: '0.12s',
            ...options,
        };

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
        const borderWidth = parseInt(this.options.overlayBorderWidth, 10);

        Object.assign(this.element.style, {
            display: 'block',
            left: `${rect.left - borderWidth}px`,
            top: `${rect.top - borderWidth}px`,
            width: `${rect.width + borderWidth * 2}px`,
            height: `${rect.height + borderWidth * 2}px`,
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
