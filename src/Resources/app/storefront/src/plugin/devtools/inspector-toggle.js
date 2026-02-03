/**
 * DevTools Inspector Toggle Button
 * Modern floating action button with smooth animations
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

        // Inject styles first (before inspector is enabled)
        this._injectStyles();

        this.element = document.createElement('button');
        this.element.id = '__mnkys-devtools-toggle__';
        this.element.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="M21 21l-4.35-4.35"/>
            </svg>
            <span>Inspect</span>
        `;
        this.element.title = 'Toggle Component Inspector (Ctrl+Shift+C)';
        this.element.setAttribute('aria-label', 'Toggle DevTools Inspector');
        this.element.setAttribute('aria-pressed', 'false');

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
        this.element.setAttribute('aria-pressed', String(active));

        const span = this.element.querySelector('span');
        if (span) {
            span.textContent = active ? 'Exit' : 'Inspect';
        }

        // Update icon for active state (X icon when active)
        const svg = this.element.querySelector('svg');
        if (svg) {
            if (active) {
                svg.innerHTML = `
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                `;
            } else {
                svg.innerHTML = `
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                `;
            }
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
     * These need to be injected immediately, before inspector is enabled
     * @private
     */
    _injectStyles() {
        if (document.getElementById('__mnkys-devtools-toggle-styles__')) {
            return;
        }

        const style = document.createElement('style');
        style.id = '__mnkys-devtools-toggle-styles__';
        style.textContent = `
            #__mnkys-devtools-toggle__ {
                position: fixed;
                bottom: 20px;
                left: 20px;
                z-index: 2147483630;
                
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px 16px;
                
                background: rgba(22, 27, 34, 0.85);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                
                color: #00D9FF;
                border: 1px solid rgba(0, 217, 255, 0.4);
                border-radius: 9999px;
                
                cursor: pointer;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: 0.02em;
                
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 217, 255, 0.3);
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                transform: translateY(0);
            }

            #__mnkys-devtools-toggle__:hover {
                background: #00D9FF;
                color: #0D1117;
                border-color: #00D9FF;
                transform: translateY(-2px);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 217, 255, 0.4);
            }

            #__mnkys-devtools-toggle__:active {
                transform: translateY(0) scale(0.98);
            }

            #__mnkys-devtools-toggle__.active {
                background: #00D9FF;
                color: #0D1117;
                border-color: #00D9FF;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 217, 255, 0.4);
            }

            #__mnkys-devtools-toggle__ svg {
                transition: transform 0.2s ease;
            }

            #__mnkys-devtools-toggle__:hover svg {
                transform: scale(1.1);
            }

            #__mnkys-devtools-toggle__.active svg {
                transform: rotate(0deg);
            }

            #__mnkys-devtools-toggle__:focus {
                outline: none;
                box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4), 0 0 0 3px rgba(0, 217, 255, 0.3);
            }

            #__mnkys-devtools-toggle__:focus-visible {
                outline: 2px solid #00D9FF;
                outline-offset: 2px;
            }

            /* Respect reduced motion preference */
            @media (prefers-reduced-motion: reduce) {
                #__mnkys-devtools-toggle__ {
                    transition: none;
                }
                #__mnkys-devtools-toggle__ svg {
                    transition: none;
                }
            }
        `;

        document.head.appendChild(style);
    }
}
