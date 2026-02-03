/**
 * DevTools Inspector Utilities
 * Helper functions for the inspector components
 */

/**
 * Escape HTML special characters
 * @param {string} str 
 * @returns {string}
 */
export function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Shorten a template path for display
 * @param {string} path 
 * @returns {string}
 */
export function shortenPath(path) {
    return path
        .replace(/^@Storefront\//, '')
        .replace(/^@(\w+)\//, '$1/')
        .replace(/^storefront\//, '');
}

/**
 * Escape regex special characters
 * @param {string} str 
 * @returns {string}
 */
export function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Basic Twig syntax highlighting
 * @param {string} code - Already HTML-escaped code
 * @returns {string}
 */
export function highlightTwigSyntax(code) {
    // Twig comments {# ... #}
    code = code.replace(
        /(\{#.*?#\})/g,
        '<span class="twig-comment">$1</span>'
    );
    
    // Twig tags {% ... %}
    code = code.replace(
        /(\{%\s*)(\w+)(.*?)(%\})/g,
        '<span class="twig-tag">$1</span><span class="twig-name">$2</span>$3<span class="twig-tag">$4</span>'
    );
    
    // Twig output {{ ... }}
    code = code.replace(
        /(\{\{)(.*?)(\}\})/g,
        '<span class="twig-tag">$1</span>$2<span class="twig-tag">$3</span>'
    );
    
    // Strings in Twig (after tags to avoid double-processing)
    code = code.replace(
        /(&quot;[^&]*&quot;|&#039;[^&]*&#039;)/g,
        '<span class="twig-string">$1</span>'
    );
    
    // HTML tags
    code = code.replace(
        /(&lt;\/?)(\w+)((?:\s+[^&]*?)?)(&gt;)/g,
        '$1<span class="html-tag">$2</span>$3$4'
    );
    
    return code;
}

/**
 * Show a notification toast
 * @param {string} message 
 * @param {string} type - 'success' or 'error'
 */
export function showNotification(message, type = 'success') {
    const el = document.createElement('div');
    el.className = `devtools-notification ${type}`;
    el.textContent = message;
    document.body.appendChild(el);

    // Fade in
    requestAnimationFrame(() => el.style.opacity = '1');

    // Remove after delay
    setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 200);
    }, 2500);
}

/**
 * Find the nearest element with twig block data attribute
 * @param {HTMLElement} el 
 * @returns {HTMLElement|null}
 */
export function findTwigElement(el) {
    // Skip our UI elements
    const skipIds = [
        '__mnkys-devtools-overlay__',
        '__mnkys-devtools-tooltip__',
        '__mnkys-devtools-panel__',
        '__mnkys-devtools-detail__',
        '__mnkys-devtools-toggle__'
    ];
    
    if (el.closest(skipIds.map(id => `#${id}`).join(', '))) {
        return null;
    }

    // Walk up the DOM tree looking for data-twig-block
    while (el && el !== document.body && el !== document.documentElement) {
        if (el.dataset && el.dataset.twigBlock) {
            return el;
        }
        el = el.parentElement;
    }
    return null;
}

/**
 * Parse twig data from element's data attribute
 * @param {HTMLElement} el 
 * @returns {object|null}
 */
export function getTwigData(el) {
    try {
        return JSON.parse(el.dataset.twigBlock);
    } catch (e) {
        console.warn('DevTools: Failed to parse twig data', e);
        return null;
    }
}

/**
 * Debounce function calls
 * @param {Function} fn 
 * @param {number} delay 
 * @returns {Function}
 */
export function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}
