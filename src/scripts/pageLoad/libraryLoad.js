if (!musicLibrary) {
    const musicLibrary = document.getElementById('musicLibrary'); 
}
async function addDirectory() {
    const savedDirectories = JSON.parse(localStorage.getItem('savedMusicDirectories')) || [];
    const selectedDirectory = await ipcRenderer.invoke('selectDirectory');

    if (selectedDirectory) {
        console.log(savedDirectories)
        const isAlreadyAdded = savedDirectories.includes(selectedDirectory);

        if (isAlreadyAdded) {
            sendNotification('¡Esta carpeta ya esta añadida!', 'warning');
        } else {
            sendNotification('Carpeta añadida a tu biblioteca', 'success');
            savedDirectories.push(selectedDirectory);
            localStorage.setItem('savedMusicDirectories', JSON.stringify(savedDirectories));
        }
    }
}

function createMusicObject(title, subtitle, imageUrl = 'images/temp_cover.png') {
    const musicContent = document.createElement('div');
    musicContent.className = 'musicContent';

    musicContent.onclick = function() {
        loadPage('album',btoa(unescape(encodeURIComponent(title))));
    };

    const musicImage = document.createElement('img');
    musicImage.src = imageUrl;

    const musicInfo = document.createElement('div');
    musicInfo.className = 'musicContent_info';

    const musicTitle = document.createElement('p');
    musicTitle.className = 'musicContent_title';
    musicTitle.textContent = title || 'Unknown Song';

    const musicSubtitle = document.createElement('p');
    musicSubtitle.className = 'musicContent_subtitle';
    musicSubtitle.textContent = subtitle || 'Unknown Artist';

    musicInfo.appendChild(musicTitle);
    musicInfo.appendChild(musicSubtitle);

    musicContent.appendChild(musicImage);
    musicContent.appendChild(musicInfo);

    return musicContent;
}

async function addNewSongsToLibrary() {
    const directoriesBefore = localStorage.getItem('savedMusicDirectories') || [];
    await addDirectory();
    const directoriesAfter = localStorage.getItem('savedMusicDirectories') || [];

    if (directoriesBefore !== directoriesAfter) {
        loadMusicLibrary();
        // loadSidebarLibrary();
    }
}

async function loadMusicLibrary() {
    let savedMusicDirectories = JSON.parse(localStorage.getItem('savedMusicDirectories')) || [];
    if (savedMusicDirectories && savedMusicDirectories.length > 0) {
        let filesArrays = [];
        let localSongs = [];
        for (const directory of savedMusicDirectories) {
            songsList = await ipcRenderer.invoke('searchForSongFiles', directory);
            for (const song of songsList) {
                const extractedSongData = await extractSongMetadata(song);
                let songData = {
                    album: extractedSongData.album,
                    link: extractedSongData.link
                }
                localSongs.push(songData)

                //TODO: hacer que songdata se añada a un array
                //las canciones deberan cargar a partir del array en lugar de leer una por una y descartandolas
                //el array debe reusarse paar la sidebar y los albumes
                //para la sidebar evita que se analizen todas las carpetas dos veces
                //para los albumes, con el array, se escanean los links de las canciones que coincidan con el nombre del album
                if (!filesArrays.includes(extractedSongData.album)) {
                    filesArrays.push(extractedSongData.album);
                    const songObject = createMusicObject(extractedSongData.album, extractedSongData.artist, extractedSongData.cover);
                    musicLibrary.appendChild(songObject);
                }
            }
        }
        console.log(localSongs)
    }
}

loadMusicLibrary()