/**
 * DevTools Inspector Overlay
 * Handles the highlight overlays for hovering and selection
 * 
 * Features:
 * - Hover overlay: Shows when moving mouse over elements
 * - Selection overlay: Persists when an element is selected/clicked
 * 
 * Note: Styling is controlled via CSS in inspector-styles.js for consistency
 */

// Border width used for positioning calculations
const OVERLAY_BORDER_WIDTH = 2;

/**
 * InspectorOverlay class - manages hover and selection overlays
 */
export class InspectorOverlay {
    constructor() {
        this.hoverElement = null;
        this.selectionElement = null;
        this.selectedTarget = null;
        
        // Bind scroll/resize handler for selection tracking
        this._onScrollResize = this._onScrollResize.bind(this);
    }

    /**
     * Create and append overlay elements
     */
    create() {
        // Hover overlay (shows on mousemove)
        if (!this.hoverElement) {
            this.hoverElement = document.createElement('div');
            this.hoverElement.id = '__mnkys-devtools-overlay__';
            document.body.appendChild(this.hoverElement);
        }

        // Selection overlay (persists when element is selected)
        if (!this.selectionElement) {
            this.selectionElement = document.createElement('div');
            this.selectionElement.id = '__mnkys-devtools-selection__';
            document.body.appendChild(this.selectionElement);
        }
        
        // Listen for scroll/resize to update selection position
        window.addEventListener('scroll', this._onScrollResize, true);
        window.addEventListener('resize', this._onScrollResize);
    }

    /**
     * Destroy overlay elements
     */
    destroy() {
        this.hoverElement?.remove();
        this.selectionElement?.remove();
        this.hoverElement = null;
        this.selectionElement = null;
        this.selectedTarget = null;
        
        window.removeEventListener('scroll', this._onScrollResize, true);
        window.removeEventListener('resize', this._onScrollResize);
    }

    /**
     * Show hover overlay
     */
    show() {
        if (this.hoverElement) {
            this.hoverElement.style.display = 'block';
        }
    }

    /**
     * Hide hover overlay
     */
    hide() {
        if (this.hoverElement) {
            this.hoverElement.style.display = 'none';
        }
    }

    /**
     * Highlight element on hover
     * @param {HTMLElement} el - The element to highlight
     */
    highlight(el) {
        if (!this.hoverElement || !el) {
            return;
        }

        this._positionOverlay(this.hoverElement, el);
    }

    /**
     * Select an element (persistent highlight)
     * @param {HTMLElement} el - The element to select
     */
    select(el) {
        this.selectedTarget = el;
        
        if (!this.selectionElement || !el) {
            return;
        }

        this._positionOverlay(this.selectionElement, el);
    }

    /**
     * Clear selection
     */
    clearSelection() {
        this.selectedTarget = null;
        if (this.selectionElement) {
            this.selectionElement.style.display = 'none';
        }
    }

    /**
     * Check if an element is currently selected
     * @param {HTMLElement} el - The element to check
     * @returns {boolean}
     */
    isSelected(el) {
        return this.selectedTarget === el;
    }

    /**
     * Get currently selected element
     * @returns {HTMLElement|null}
     */
    getSelectedElement() {
        return this.selectedTarget;
    }

    /**
     * Update selection overlay position (for scroll/resize)
     */
    updateSelectionPosition() {
        if (this.selectedTarget && this.selectionElement) {
            // Check if element is still in DOM
            if (!document.body.contains(this.selectedTarget)) {
                this.clearSelection();
                return;
            }
            this._positionOverlay(this.selectionElement, this.selectedTarget);
        }
    }

    /**
     * Position an overlay element over a target element
     * @param {HTMLElement} overlay - The overlay element
     * @param {HTMLElement} target - The target element to cover
     * @private
     */
    _positionOverlay(overlay, target) {
        const rect = target.getBoundingClientRect();

        Object.assign(overlay.style, {
            display: 'block',
            left: `${rect.left - OVERLAY_BORDER_WIDTH}px`,
            top: `${rect.top - OVERLAY_BORDER_WIDTH}px`,
            width: `${rect.width + OVERLAY_BORDER_WIDTH * 2}px`,
            height: `${rect.height + OVERLAY_BORDER_WIDTH * 2}px`,
        });
    }

    /**
     * Handle scroll/resize events
     * @private
     */
    _onScrollResize() {
        this.updateSelectionPosition();
    }

    /**
     * Check if hover overlay is visible
     * @returns {boolean}
     */
    isVisible() {
        return this.hoverElement && this.hoverElement.style.display !== 'none';
    }

    /**
     * Check if selection overlay is visible
     * @returns {boolean}
     */
    hasSelection() {
        return this.selectionElement && this.selectionElement.style.display !== 'none';
    }
}
