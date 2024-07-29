const { ipcRenderer } = require('electron');

window.addEventListener('DOMContentLoaded', () => {
    const openButton = document.getElementById('openbutton');
    const closeButton = document.getElementById('closebutton');

    if (openButton) {
        openButton.addEventListener('click', () => {
            ipcRenderer.send('toogle-main-window');
        });
    }

    if (closeButton) {
        closeButton.addEventListener('click', () => {
            ipcRenderer.send('close-spectral');
        });
    }
});
