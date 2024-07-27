const mainDiv = document.getElementById("mainContainer");

/**
 * Carga una pagina dentro del contenedor principal de Spectral.
 * 
 * @param {string} contentData - El tipo de HTML que se cargará.
 * Tipos de HTMLs posibles: home,search,plugins,library,album,playlist,song,artist,settings,user,login.
 * En caso de no usar ninguno de estos, puedes ingresar una URL personalizada para poder cargar el contenido que necesites.
 * 
 * @param {string} contentID - Añade una ID al contenido que vas a cargar, en la mayoria de los casos esta es necesaria para cargar algun contenido correctamente.
 * 
 * @param {object} URLParameters - Añade parametros a la URL con una variable de objeto, como algun ID extra o datos necesarios para la pagina.
 * 
 * @param {Array} functionParameters - Se pueden agregar parametros especiales al ejecutar esta función para agregar ciertas funcionalidades.
 * @description history - Evita cargar la pagina en el historial del navegador.
 * @description refresh - Carga la pagina a pesar de que ya este cargada actualmente.
 */
function loadPage(contentData, contentID, URLParameters = {}, functionParameters = []) {
    const contentTypes = ['home', 'search', 'plugins', 'library', 'album', 'playlist', 'song', 'artist', 'settings', 'user', 'signup', 'login', 'developer-menu'];
    const contentType = contentData.toLowerCase();
    const contentParameters = new URLSearchParams(URLParameters);
    
    let contentURL; // The URL that will be actually loaded
    if (contentTypes.includes(contentType)) {
        contentURL = 'content/' + contentType + '.html';
    } else if (contentType === '') {
        contentURL = 'content/home.html';
    } else {
        contentURL = contentData;
    }

    const actualData = checkURL();

    // Checks the actual URL
    if (functionParameters.includes('refresh') || contentData !== actualData.contentData || contentID !== actualData.contentID) {
        mainDiv.innerHTML = ''; // Empty main div

        // Erase past scripts
        const oldScripts = document.querySelectorAll('.contentScript');
        oldScripts.forEach(element => element.remove());

        // Insert HTML
        fetch(contentURL)
            .then(response => response.text())
            .then(html => {
                mainDiv.innerHTML = html; // Insert the HTML

                // Process the HTML scripts
                const scripts = mainDiv.querySelectorAll('script');
                scripts.forEach(script => {
                    const newScript = document.createElement('script');
                    newScript.className = 'contentScript';
                    if (script.src) { // Insert scripts
                        newScript.src = script.src;
                    } else {
                        newScript.textContent = script.textContent;
                    }
                    document.body.appendChild(newScript);
                });

                if (!functionParameters.includes('history')) {
                    let historyURL = '#app/' + contentData;
                    if (contentID) {
                        historyURL += '/' + contentID;
                    }
                    if (contentParameters.toString()) {
                        historyURL += '?' + contentParameters.toString();
                    }
                    history.pushState({urlPath: contentURL}, '', historyURL);
                }
            })
            .catch(err => console.error('An error has occurred when loading page: ' + err.message));
    }
}

function checkURL() {
    const actualURL = window.location.href;

    if (actualURL.includes('#app/')) {
        const croppedURL = actualURL.split('app/')[1];

        const [contentData, remainingURL] = croppedURL.split('/');
        let contentID = '';
        const parameters = {};

        if (remainingURL) {
            const [idPart, paramsPart] = remainingURL.split('?');

            if (idPart) {
                contentID = idPart;
            }

            if (paramsPart) {
                paramsPart.split('&').forEach(param => {
                    const [key, value] = param.split('=');
                    if (key && value) {
                        parameters[key] = decodeURIComponent(value);
                    }
                });
            }
        }
        return {
            contentData: contentData || '',
            contentID: contentID || '',
            parameters: parameters
        };
    } else {
        return {
            contentData: '',
            contentID: '',
            parameters: {}
        };
    }
}

window.addEventListener('popstate', () => {
    const urlData = checkURL();
    loadPage(urlData.contentData, urlData.contentID, urlData.parameters, ['refresh','history']);
});

// Load necessary content when the app finishes loading
document.addEventListener('DOMContentLoaded', (event) => {
    const urlData = checkURL();
    if (urlData.contentData === '') {
        loadPage('home', undefined, undefined, ['refresh']);
    } else {
        loadPage(urlData.contentData, urlData.contentID, urlData.parameters, ['refresh']);
    }

    document.querySelector('.appcontainer').style.opacity = '1';
});


