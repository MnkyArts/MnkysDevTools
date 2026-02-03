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
}
