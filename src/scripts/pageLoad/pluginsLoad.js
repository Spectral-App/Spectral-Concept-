function createPluginEntry(title, description, imageUrl, pluginURL, pluginType) {
    const pluginEntry = document.createElement('div');
    pluginEntry.className = 'pluginEntry';

    const infoContainer = document.createElement('div');
    infoContainer.className = 'pluginEntry_info';

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Plugin Image';

    const textContainer = document.createElement('div');
    textContainer.className = 'pluginEntry_textContainer';

    const titleElement = document.createElement('p');
    titleElement.className = 'pluginEntry_title';
    titleElement.textContent = title;

    const descriptionElement = document.createElement('p');
    descriptionElement.className = 'pluginEntry_description';
    descriptionElement.textContent = description;

    textContainer.appendChild(titleElement);
    textContainer.appendChild(descriptionElement);

    infoContainer.appendChild(img);
    infoContainer.appendChild(textContainer);

    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'pluginEntry_buttonsContainer';

    const installButton = document.createElement('button');
    installButton.className = 'pluginEntry_button';
    installButton.textContent = 'Instalar';

    installButton.onclick = function() {
        loadPlugin(pluginURL,pluginType);
    };

    const uninstallButton = document.createElement('button');
    uninstallButton.className = 'pluginEntry_button';
    uninstallButton.textContent = 'Desinstalar';

    uninstallButton.onclick = function() {
        let pluginCode = document.getElementById(encodeText(pluginURL))
        pluginCode.remove();
    };

    buttonsContainer.appendChild(installButton);
    buttonsContainer.appendChild(uninstallButton);

    pluginEntry.appendChild(infoContainer);
    pluginEntry.appendChild(buttonsContainer);

    return pluginEntry;
}

fetch('http://localhost/Spectral/get_plugins.php')
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            const container = document.getElementById('pluginsMarket');
            for (const plugin of data.data) {
                const pluginEntry = createPluginEntry(plugin.NAME,plugin.DESCRIPTION,plugin.ICON,plugin.ZIP_URL,plugin.CATEGORY)
                container.appendChild(pluginEntry);
            }
        } else {
            if (data.message === 'database_error') {
                sendNotification('Hubo un error al conectarse con la base de datos', 'error');
            };
            console.log(data)
        }
    })
    .catch(error => {
        console.error('Error:', error);
        sendNotification('Hubo un error al conectarse con la base de datos', 'error');
    });
