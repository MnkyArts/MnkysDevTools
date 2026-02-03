/**
 * DevTools Inspector Toggle Button
 * The activation button that appears in the corner of the page
 */

/**
 * InspectorToggle class - manages the toggle button
 */
export class InspectorToggle {
    constructor(options = {}) {
        this.options = {
            onToggle: null,
            ...options,
        };

        this.element = null;
        this.isActive = false;
    }

    /**
     * Create and append the toggle button
     */
    create() {
        if (this.element || document.getElementById('__mnkys-devtools-toggle__')) {
            return;
        }

        this._injectStyles();

        this.element = document.createElement('button');
        this.element.id = '__mnkys-devtools-toggle__';
        this.element.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
            </svg>
            <span>Inspect</span>
        `;
        this.element.title = 'Toggle Component Inspector (Ctrl+Shift+C)';

        this.element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.options.onToggle?.();
        });

        document.body.appendChild(this.element);
    }

    /**
     * Destroy the toggle button
     */
    destroy() {
        this.element?.remove();
        this.element = null;
    }

    /**
     * Update the toggle button state
     * @param {boolean} active - Whether the inspector is active
     */
    setActive(active) {
        if (!this.element) {
            return;
        }

        this.isActive = active;
        this.element.classList.toggle('active', active);

        const span = this.element.querySelector('span');
        if (span) {
            span.textContent = active ? 'Exit' : 'Inspect';
        }
    }

    /**
     * Check if the toggle exists
     * @returns {boolean}
     */
    exists() {
        return !!this.element;
    }

    /**
     * Inject styles for the toggle button
     * @private
     */
    _injectStyles() {
        if (document.getElementById('__mnkys-devtools-button-styles__')) {
            return;
        }

        const style = document.createElement('style');
        style.id = '__mnkys-devtools-button-styles__';
        style.textContent = `
            #__mnkys-devtools-toggle__ {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 2147483630;
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 8px 12px;
                background-color: #1e1e1e;
                color: #1699f7;
                border: 2px solid #1699f7;
                border-radius: 6px;
                cursor: pointer;
                font-family: system-ui, -apple-system, sans-serif;
                font-size: 12px;
                font-weight: 600;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
                transition: all 0.15s ease;
            }
            #__mnkys-devtools-toggle__:hover,
            #__mnkys-devtools-toggle__.active {
                background-color: #42b883;
                color: #1e1e1e;
            }
        `;

        document.head.appendChild(style);
    }
}
