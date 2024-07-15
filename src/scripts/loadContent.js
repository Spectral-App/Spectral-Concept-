const mainData = {
    currPage: {
        contentType: 'home',
        contentID: 'HOME',
        link: 'content/home.html'
    },
    history: [],
    historyPos: 0
};

const currentSongData = {
    songName: '',
    songArtist: '',
    songAlbum: '',
    songCover: '',
    songID: '',
    songAlbumID: '',
};  

function loadPage(contentType, contentID, loadState, link) {
    if (mainData.currPage.contentID !== contentID || loadState !== 'new') {
        if (!loadState) { 
            loadState = 'new'; 
        }

        let destinationPage;

        switch (contentType) {
            case 'home':
                destinationPage = 'content/home.html';
                break;
            case 'search':
                destinationPage = 'content/search.html';
                break;
            case 'plugins':
                destinationPage = 'content/plugins.html';
                break;
            case 'library':
                destinationPage = 'content/library.html';
                break;
            case 'album':
                destinationPage = 'content/album.html';
                break;
            case 'settings':
                destinationPage = 'content/settings.html';
                break;
            case 'user':
                destinationPage = 'content/user.html';
                break;
            case 'custom':
                destinationPage = link;
                break;
            default:
                destinationPage = 'content/404.html';
                break;
        };
        $('.main').empty();
        $('.main').load(destinationPage);

        const pageData = {
            contentType: contentType,
            contentID: contentID,
            link: destinationPage,
        }

        if (loadState === 'new') {
            // Si la posición actual no es la última, elimina las entradas después de la posición actual
            if (mainData.historyPos < mainData.history.length - 1) {
                mainData.history.splice(mainData.historyPos + 1);
            }

            // Verifica si la nueva página es diferente de la última página en el historial
            if (mainData.history.length === 0 || mainData.history[mainData.history.length - 1].contentID !== contentID) {
                // Agrega la nueva página al historial
                mainData.history.push(pageData);
                mainData.historyPos = mainData.history.length - 1;
            }
        }

        mainData.currPage.contentType = contentType;
        mainData.currPage.contentID = contentID;

        console.log('History Position:', mainData.historyPos);
        console.log('History Data:', mainData.history);
        
        updateButtonStates();
    }
}

loadPage('home','HOME')
updateButtonStates();