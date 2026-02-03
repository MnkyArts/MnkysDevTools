/**
 * DevTools Panel Interactions
 * Provides drag-to-move and resize functionality for panels
 */

const STORAGE_KEY = 'mnkys-devtools-panel-state';

/**
 * Load saved panel states from localStorage
 */
export function loadPanelStates() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {};
    } catch (e) {
        return {};
    }
}

/**
 * Save panel states to localStorage
 */
export function savePanelStates(states) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
    } catch (e) {
        // Ignore storage errors
    }
}

/**
 * Make a panel draggable and resizable
 * @param {HTMLElement} panel - The panel element
 * @param {object} options - Configuration options
 */
export function makePanelInteractive(panel, options = {}) {
    const config = {
        panelId: panel.id || 'panel',
        dragHandleSelector: options.dragHandle || '.panel-header, .detail-header',
        minWidth: options.minWidth || 280,
        minHeight: options.minHeight || 200,
        maxWidth: options.maxWidth || window.innerWidth - 40,
        maxHeight: options.maxHeight || window.innerHeight - 40,
        resizable: options.resizable !== false,
        persistState: options.persistState !== false,
        ...options,
    };

    // State
    let isDragging = false;
    let isResizing = false;
    let resizeEdge = null;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;
    let startLeft = 0;
    let startTop = 0;

    // Create resize frame (separate element that won't be affected by innerHTML changes)
    let resizeFrame = null;
    if (config.resizable) {
        resizeFrame = createResizeFrame();
    }

    // Load saved state
    if (config.persistState) {
        const states = loadPanelStates();
        const savedState = states[config.panelId];
        if (savedState) {
            applyState(savedState);
        }
    }

    // Use event delegation on panel for drag
    panel.addEventListener('mousedown', onPanelMouseDown);

    /**
     * Create a resize frame overlay
     */
    function createResizeFrame() {
        const frame = document.createElement('div');
        frame.className = 'panel-resize-frame';
        frame.innerHTML = `
            <div class="panel-resize-handle panel-resize-top" data-edge="top"></div>
            <div class="panel-resize-handle panel-resize-right" data-edge="right"></div>
            <div class="panel-resize-handle panel-resize-bottom" data-edge="bottom"></div>
            <div class="panel-resize-handle panel-resize-left" data-edge="left"></div>
            <div class="panel-resize-handle panel-resize-top-left" data-edge="top-left"></div>
            <div class="panel-resize-handle panel-resize-top-right" data-edge="top-right"></div>
            <div class="panel-resize-handle panel-resize-bottom-left" data-edge="bottom-left"></div>
            <div class="panel-resize-handle panel-resize-bottom-right" data-edge="bottom-right"></div>
        `;
        panel.appendChild(frame);
        
        // Attach resize events to handles
        frame.querySelectorAll('.panel-resize-handle').forEach(handle => {
            handle.addEventListener('mousedown', onResizeStart);
        });
        
        return frame;
    }

    /**
     * Apply saved state to panel
     */
    function applyState(state) {
        if (state.width) panel.style.width = `${state.width}px`;
        if (state.height) panel.style.height = `${state.height}px`;
        if (state.left !== undefined) {
            panel.style.left = `${state.left}px`;
            panel.style.right = 'auto';
        }
        if (state.top !== undefined) {
            panel.style.top = `${state.top}px`;
            panel.style.bottom = 'auto';
        }
    }

    /**
     * Save current state
     */
    function saveState() {
        if (!config.persistState) return;

        const rect = panel.getBoundingClientRect();
        const states = loadPanelStates();
        states[config.panelId] = {
            width: rect.width,
            height: rect.height,
            left: rect.left,
            top: rect.top,
        };
        savePanelStates(states);
    }

    /**
     * Handle mousedown on panel (for drag detection via delegation)
     */
    function onPanelMouseDown(e) {
        // Check if clicking on a drag handle
        const dragHandle = e.target.closest(config.dragHandleSelector);
        if (!dragHandle) return;
        
        // Don't drag if clicking on interactive elements
        if (e.target.closest('button, input, textarea, select, a, .panel-resize-handle')) return;
        
        // Start dragging
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;

        const rect = panel.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;

        // Switch to absolute positioning
        panel.style.left = `${startLeft}px`;
        panel.style.top = `${startTop}px`;
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';

        panel.classList.add('is-dragging');
        
        // Prevent text selection
        e.preventDefault();
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        document.body.style.cursor = 'move';

        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
    }

    /**
     * Handle drag move
     */
    function onDragMove(e) {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let newLeft = startLeft + deltaX;
        let newTop = startTop + deltaY;

        // Constrain to viewport
        const rect = panel.getBoundingClientRect();
        newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - rect.width));
        newTop = Math.max(0, Math.min(newTop, window.innerHeight - rect.height));

        panel.style.left = `${newLeft}px`;
        panel.style.top = `${newTop}px`;
        
        e.preventDefault();
    }

    /**
     * Handle drag end
     */
    function onDragEnd(e) {
        if (!isDragging) return;

        isDragging = false;
        panel.classList.remove('is-dragging');
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        document.body.style.cursor = '';

        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);

        saveState();
    }

    /**
     * Handle resize start
     */
    function onResizeStart(e) {
        isResizing = true;
        resizeEdge = e.target.dataset.edge;
        startX = e.clientX;
        startY = e.clientY;

        const rect = panel.getBoundingClientRect();
        startWidth = rect.width;
        startHeight = rect.height;
        startLeft = rect.left;
        startTop = rect.top;

        // Ensure absolute positioning
        panel.style.left = `${startLeft}px`;
        panel.style.top = `${startTop}px`;
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
        panel.style.width = `${startWidth}px`;
        panel.style.height = `${startHeight}px`;
        panel.style.maxHeight = 'none';

        panel.classList.add('is-resizing');
        
        // Prevent text selection
        e.preventDefault();
        e.stopPropagation();
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        document.body.style.cursor = getResizeCursor(resizeEdge);

        document.addEventListener('mousemove', onResizeMove);
        document.addEventListener('mouseup', onResizeEnd);
    }

    /**
     * Handle resize move
     */
    function onResizeMove(e) {
        if (!isResizing) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        let newWidth = startWidth;
        let newHeight = startHeight;
        let newLeft = startLeft;
        let newTop = startTop;

        // Calculate new dimensions based on edge
        if (resizeEdge.includes('right')) {
            newWidth = Math.max(config.minWidth, Math.min(config.maxWidth, startWidth + deltaX));
        }
        if (resizeEdge.includes('left')) {
            const proposedWidth = startWidth - deltaX;
            if (proposedWidth >= config.minWidth && proposedWidth <= config.maxWidth) {
                newWidth = proposedWidth;
                newLeft = startLeft + deltaX;
            }
        }
        if (resizeEdge.includes('bottom')) {
            newHeight = Math.max(config.minHeight, Math.min(config.maxHeight, startHeight + deltaY));
        }
        if (resizeEdge.includes('top')) {
            const proposedHeight = startHeight - deltaY;
            if (proposedHeight >= config.minHeight && proposedHeight <= config.maxHeight) {
                newHeight = proposedHeight;
                newTop = startTop + deltaY;
            }
        }

        // Constrain to viewport
        newLeft = Math.max(0, newLeft);
        newTop = Math.max(0, newTop);

        panel.style.width = `${newWidth}px`;
        panel.style.height = `${newHeight}px`;
        panel.style.left = `${newLeft}px`;
        panel.style.top = `${newTop}px`;
        
        e.preventDefault();
    }

    /**
     * Handle resize end
     */
    function onResizeEnd(e) {
        if (!isResizing) return;

        isResizing = false;
        resizeEdge = null;
        panel.classList.remove('is-resizing');
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        document.body.style.cursor = '';

        document.removeEventListener('mousemove', onResizeMove);
        document.removeEventListener('mouseup', onResizeEnd);

        saveState();
    }

    /**
     * Get cursor style for resize edge
     */
    function getResizeCursor(edge) {
        const cursors = {
            'top': 'ns-resize',
            'bottom': 'ns-resize',
            'left': 'ew-resize',
            'right': 'ew-resize',
            'top-left': 'nwse-resize',
            'bottom-right': 'nwse-resize',
            'top-right': 'nesw-resize',
            'bottom-left': 'nesw-resize',
        };
        return cursors[edge] || 'default';
    }

    /**
     * Reset panel to default position/size
     */
    function reset() {
        panel.style.width = '';
        panel.style.height = '';
        panel.style.left = '';
        panel.style.top = '';
        panel.style.right = '';
        panel.style.bottom = '';
        panel.style.maxHeight = '';

        if (config.persistState) {
            const states = loadPanelStates();
            delete states[config.panelId];
            savePanelStates(states);
        }
    }

    /**
     * Cleanup event listeners
     */
    function destroy() {
        panel.removeEventListener('mousedown', onPanelMouseDown);
        document.removeEventListener('mousemove', onDragMove);
        document.removeEventListener('mouseup', onDragEnd);
        document.removeEventListener('mousemove', onResizeMove);
        document.removeEventListener('mouseup', onResizeEnd);

        // Remove resize frame
        resizeFrame?.remove();
    }

    return {
        reset,
        destroy,
        saveState,
    };
}
