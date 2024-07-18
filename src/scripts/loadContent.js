const mainDiv = document.getElementById("main");

function checkCurrentURL(contentToCheck) {
    const actualURL = window.location.href
    let contentURL = actualURL.split('#')[1] || '';
    let URLParams = new URLSearchParams(contentURL.split('?')[1] || '');
    switch (contentToCheck) {
        case 'contentURL':
            return contentURL;
            break;
        case 'URLParams':
            return URLParams;
            break;
        default:
            console.error('Please insert a valid value: contentURL, URLParams');
            break;
    }
}

/**
 * Carga una pagina dentro del contenedor principal de Spectral.
 * 
 * @param {string} contentURL - El tipo de HTML que se cargará.
 * @description Tipos de HTMLs posibles: home,search,plugins,library,album,playlist,song,artist,settings,user,login.
 * @description En caso de no usar ninguno de estos, puedes ingresar una URL personalizada para poder cargar el contenido que necesites.
 * 
 * @param {string} URLParams - Añade parametros a la URL con una variable de objeto, como algun ID necesario o datos necesarios para la pagina.
 * 
 * @param {string} specialParameters - Se pueden agregar parametros especiales al ejecutar esta función para agregar ciertas funcionalidades.
 * @description history - Evita cargar la pagina en el historial del navegador.
 * @description refresh - Carga la pagina a pesar de que ya este cargada actualmente.
 */
function loadPage(contentURL, URLParams, specialParameters = []) {
    const contentTypes = ['home', 'search', 'plugins', 'library', 'album', 'playlist', 'song', 'artist','settings','user','login']
    const params = new URLSearchParams(URLParams);
    let content;
    if (contentTypes.includes(contentURL.toLowerCase())) {
        content = 'content/'+contentURL.toLowerCase()+'.html';
    } else {content = contentURL};

    //this part was giving me a headache so i just put an if statement to verify if the link is the exact same as the actual link
    let urlMatches = false;
    if (content === checkCurrentURL('contentURL').replace(/\?/g, '') && params === checkCurrentURL('URLParams')) {urlMatches = true;};

    if (specialParameters.includes('refresh') || !urlMatches) {
        mainDiv.innerHTML = '';
    
        fetch(content)
            .then(response => response.text())
            .then(html => {
                mainDiv.innerHTML = html;

                const oldScripts = document.querySelectorAll('.contentScript');
                oldScripts.forEach(element => element.remove())

                const scripts = mainDiv.querySelectorAll('script');
                scripts.forEach(script => {
                    const newScript = document.createElement('script');
                    newScript.className = 'contentScript'
                    if (script.src) {
                        newScript.src = script.src;
                    } else {
                        newScript.textContent = script.textContent;
                    }
                    document.body.appendChild(newScript);
                })

                if (!specialParameters.includes('history')) {
                    let historyURL;
                    if (params.toString() === '') { //stops the url to have duplicated question marks if no parameters are specified
                        historyURL = '#'+content;
                    } else {
                        historyURL = '#'+content+'?'+params;
                    }
                    history.pushState({urlPath: content}, '',historyURL)
                }
            })
            .catch(err => console.error('An error has ocurred when loading page: '+err.message));
    }
}

window.addEventListener('popstate', (event) => {
    loadPage(checkCurrentURL('contentURL'),checkCurrentURL('URLParams'), ['history']);
});

//Para cargar lo necesario apenas la app termine de cargar
document.addEventListener('DOMContentLoaded', (event) => {
    if (checkCurrentURL('contentURL') === '') {
        loadPage('home',undefined,['refresh']);
        console.log('aaaa')
    }
    else {
        loadPage(checkCurrentURL('contentURL'),checkCurrentURL('URLParams'));
    }

    //evita que puedas ver algunos objetos que aun no cargan
    const appContainer = document.querySelector('.appcontainer');
    appContainer.style.opacity = '1';
});