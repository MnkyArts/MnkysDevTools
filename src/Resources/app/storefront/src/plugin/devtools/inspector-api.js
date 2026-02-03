/**
 * DevTools Inspector API
 * Handles communication with backend endpoints
 */

import HttpClient from 'src/service/http-client.service';

const client = new HttpClient();

const ENDPOINTS = {
    openEditor: '/devtools/open-editor',
    blockInfo: '/devtools/block-info',
    status: '/devtools/status',
};

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 10000;

/**
 * Make a GET request with error handling
 * @param {string} url - The URL to fetch
 * @returns {Promise<object>}
 * @private
 */
function makeRequest(url) {
    return new Promise((resolve, reject) => {
        let timeoutId = null;
        
        // Set up timeout
        timeoutId = setTimeout(() => {
            reject(new Error('Request timeout'));
        }, REQUEST_TIMEOUT);
        
        client.get(url, (response) => {
            clearTimeout(timeoutId);
            try {
                const data = JSON.parse(response);
                resolve(data);
            } catch (e) {
                reject(new Error('Failed to parse response'));
            }
        }, 'application/json', true);
    });
}

/**
 * Open a file in the configured editor
 * @param {string} file - Template path (e.g., @Storefront/...)
 * @param {number} line - Line number
 * @returns {Promise<{success: boolean, editorUrl?: string, error?: string}>}
 */
export async function openInEditor(file, line) {
    const url = `${ENDPOINTS.openEditor}?file=${encodeURIComponent(file)}&line=${line}`;
    
    try {
        return await makeRequest(url);
    } catch (error) {
        console.warn('DevTools: Failed to open editor', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get detailed block information (hierarchy, source, etc.)
 * @param {string} template - Template path
 * @param {string} block - Block name
 * @param {number} line - Line number
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export async function getBlockInfo(template, block, line) {
    const params = new URLSearchParams({
        template,
        block,
        line: String(line),
    });
    
    const url = `${ENDPOINTS.blockInfo}?${params}`;
    
    try {
        return await makeRequest(url);
    } catch (error) {
        console.warn('DevTools: Failed to fetch block info', error);
        return { success: false, error: error.message };
    }
}

/**
 * Get DevTools status
 * @returns {Promise<{enabled: boolean, devMode: boolean, editor: string} | {error: string}>}
 */
export async function getStatus() {
    try {
        return await makeRequest(ENDPOINTS.status);
    } catch (error) {
        console.warn('DevTools: Failed to fetch status', error);
        return { error: error.message };
    }
}

/**
 * Load block data from the page's embedded JSON
 * @returns {Array<{block: string, template: string, line: number, blockId: string}>}
 */
export function loadBlockData() {
    const scriptTag = document.getElementById('devtools-block-data');
    if (!scriptTag) {
        return [];
    }

    try {
        const blocks = JSON.parse(scriptTag.textContent) || [];
        return blocks.sort((a, b) => {
            const cmp = a.template.localeCompare(b.template);
            return cmp !== 0 ? cmp : a.block.localeCompare(b.block);
        });
    } catch (e) {
        console.warn('DevTools: Failed to parse block data', e);
        return [];
    }
}

/**
 * Load context data from the page's embedded JSON
 * @returns {Object<string, {block: string, template: string, line: number, context: object}>}
 */
export function loadContextData() {
    const scriptTag = document.getElementById('devtools-context-data');
    if (!scriptTag) {
        return {};
    }

    try {
        return JSON.parse(scriptTag.textContent) || {};
    } catch (e) {
        console.warn('DevTools: Failed to parse context data', e);
        return {};
    }
}
