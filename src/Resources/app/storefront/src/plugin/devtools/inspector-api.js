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

/**
 * Open a file in the configured editor
 * @param {string} file - Template path (e.g., @Storefront/...)
 * @param {number} line - Line number
 * @returns {Promise<{success: boolean, editorUrl?: string, error?: string}>}
 */
export function openInEditor(file, line) {
    return new Promise((resolve, reject) => {
        const url = `${ENDPOINTS.openEditor}?file=${encodeURIComponent(file)}&line=${line}`;
        
        client.get(url, (response) => {
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
 * Get detailed block information (hierarchy, source, etc.)
 * @param {string} template - Template path
 * @param {string} block - Block name
 * @param {number} line - Line number
 * @returns {Promise<{success: boolean, data?: object, error?: string}>}
 */
export function getBlockInfo(template, block, line) {
    return new Promise((resolve, reject) => {
        const params = new URLSearchParams({
            template,
            block,
            line: String(line),
        });
        
        const url = `${ENDPOINTS.blockInfo}?${params}`;
        
        client.get(url, (response) => {
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
 * Get DevTools status
 * @returns {Promise<{enabled: boolean, devMode: boolean, editor: string}>}
 */
export function getStatus() {
    return new Promise((resolve, reject) => {
        client.get(ENDPOINTS.status, (response) => {
            try {
                resolve(JSON.parse(response));
            } catch (e) {
                reject(new Error('Failed to parse response'));
            }
        }, 'application/json', true);
    });
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
