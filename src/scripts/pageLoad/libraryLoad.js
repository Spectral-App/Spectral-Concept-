if (!musicLibrary) {
    const musicLibrary = document.getElementById('musicLibrary'); 
}
async function openDirectory() {
    const savedDirectories = JSON.parse(localStorage.getItem('savedMusicDirectories')) || [];
    const selectedDirectory = await ipcRenderer.invoke('selectDirectory');

    if (selectedDirectory) {
        const isAlreadyAdded = savedDirectories.includes(selectedDirectory);
        savedDirectories.push(selectedDirectory);
        localStorage.setItem('savedMusicDirectories', JSON.stringify(savedDirectories));

        if (isAlreadyAdded) {
            sendNotification('¡Esta carpeta ya esta añadida!', 'warning');
        } else {
            sendNotification('Carpeta añadida a tu biblioteca', 'success');
        }

        const files = await ipcRenderer.invoke('searchForSongFiles', selectedDirectory);

        if (files) {
            return files;
        } else {
            sendNotification('Hubo un error en la importación', 'error');
            return [];
        }
    }
}

function createMusicObject(title, subtitle, imageUrl = 'images/temp_cover.png') {
    const musicContent = document.createElement('div');
    musicContent.className = 'musicContent';

    musicContent.onclick = function() {
        loadPage('album',btoa(title));
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
    const loadedSongs = await openDirectory();
    if (loadedSongs && loadedSongs.length > 0) {
        let addedAlbums = [];
        for (const song of loadedSongs) {
            const extractedSongData = await extractSongMetadata(song);
            if (!addedAlbums.includes(extractedSongData.album)) {
                addedAlbums.push(extractedSongData.album);
                const songObject = createMusicObject(extractedSongData.album, extractedSongData.artist, extractedSongData.cover);
                musicLibrary.appendChild(songObject);
            }
        }
    }
}

async function loadMusicLibrary() {
    let savedMusicDirectories = JSON.parse(localStorage.getItem('savedMusicDirectories')) || [];
    if (savedMusicDirectories && savedMusicDirectories.length > 0) {
        let addedAlbums = [];
        for (const directory of savedMusicDirectories) {
            songsList = await ipcRenderer.invoke('searchForSongFiles', directory);
            for (const song of songsList) {
                const extractedSongData = await extractSongMetadata(song);
                if (!addedAlbums.includes(extractedSongData.album)) {
                    addedAlbums.push(extractedSongData.album);
                    const songObject = createMusicObject(extractedSongData.album, extractedSongData.artist, extractedSongData.cover);
                    musicLibrary.appendChild(songObject);
                }
            }
        }
    }
}

loadMusicLibrary()