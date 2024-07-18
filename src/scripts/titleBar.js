function isElectron() {
    // Renderer process
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
        return true;
    }

    // Main process
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
        return true;
    }

    // Detect the user agent when the `nodeIntegration` option is set to true
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
        return true;
    }

    return false;
}

function titleBarLoad() {
    if (isElectron()) {
        const { ipcRenderer } = require('electron');
        const maximizeButton = document.getElementById('max-resButton');

        async function toggleMaximizeIcon() {
            try {
                const isMaximized = await ipcRenderer.invoke('is-maximized');
                const maximizeIcon = document.getElementById('maximizeIcon');

                if (!maximizeIcon) {
                    console.error('Elemento maximizeIcon no encontrado.');
                    return;
                }
                
                if (isMaximized) {
                    maximizeIcon.src = 'icons/window_restore.svg';
                } else {
                    maximizeIcon.src = 'icons/window_maximize.svg';
                }
            } catch (error) {
                console.error('Error al obtener estado maximizado:', error);
            }
        }

        toggleMaximizeIcon();

        // Asociar la función al evento clic del botón
        maximizeButton.addEventListener('click', async () => {
            try {
                const isMaximized = await ipcRenderer.invoke('is-maximized');
                
                if (isMaximized) {
                    ipcRenderer.send('restore-window');
                } else {
                    ipcRenderer.send('maximize-window');
                }
                
                toggleMaximizeIcon();
            } catch (error) {
                console.error('Error al cambiar estado de ventana:', error);
            }
        });

        document.getElementById('minButton').addEventListener('click', () => {
            ipcRenderer.send('minimize-window');
        });

        document.getElementById('closeButton').addEventListener('click', () => {
            ipcRenderer.send('close-window');
        });
    } else {
        let html = document.documentElement;
        html.style.backgroundColor = 'var(--main)';
        let titlebar = document.querySelector('.titlebar');
        titlebar.remove();
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    titleBarLoad()
});
