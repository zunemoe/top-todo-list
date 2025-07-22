export function createModal() {
    let overlay = null;
    let content = null;
    let escapeHandler = null;

    function open(contentElement) {
        overlay = document.createElement('div');
        overlay.classList.add('modal-overlay');

        content = contentElement;
        overlay.appendChild(content);
        document.body.appendChild(overlay);

        setupEvents();

        requestAnimationFrame(() => {
            overlay.classList.add('active');
            content.classList.add('active');
        });        
    }

    function close() {
        if (!overlay) return;

        overlay.classList.remove('active');
        content.classList.remove('active');

        setTimeout(() => {
            cleanup();
        }, 300);
    }

    function setupEvents() {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                close();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                close();
            }
        });

        document.addEventListener('keydown', escapeHandler);
    }

    function cleanup() {
        if (overlay) overlay.remove();
        overlay = null;
        content = null;

        if (escapeHandler) document.removeEventListener('keydown', escapeHandler);
        escapeHandler = null;
    }

    return { open, close };
}