async function addDirectory() {
    let savedDirectories = JSON.parse(localStorage.getItem('savedMusicDirectories')) || [];
    const selectedDirectory = await ipcRenderer.invoke('selectDirectory');

    if (selectedDirectory) {
        let isAlreadyAdded = false;
        let isParentDirectory = false;

        savedDirectories = savedDirectories.filter(directory => {
            if (selectedDirectory.startsWith(directory) && selectedDirectory !== directory) {
                isAlreadyAdded = true;
                return true;
            }
            if (directory.startsWith(selectedDirectory) && directory !== selectedDirectory) {
                isParentDirectory = true;
                return false;
            }
            return true;
        });

        if (isAlreadyAdded) {
            sendNotification('¡Esta carpeta ya está añadida!', 'warning');
        } else {
            if (isParentDirectory) {
                sendNotification('Carpeta padre añadida, subcarpetas eliminadas', 'info');
            } else {
                sendNotification('Carpeta añadida a tu biblioteca', 'success');
            }
            savedDirectories.push(selectedDirectory);
            localStorage.setItem('savedMusicDirectories', JSON.stringify(savedDirectories));
            ipcRenderer.invoke('set-folders', savedDirectories)
            .then(() => {
                console.log('started watching folders');
            })
            .catch(err => {
                console.error('Error setting folders:', err);
            });
        }
    }
}


function createMusicObject(title, subtitle, imageUrl = 'images/temp_cover.png') {
    const contentID = encodeText(title)
    const musicContent = document.createElement('div');
    musicContent.className = 'musicContent';
    musicContent.setAttribute('lbry-content-id', contentID);

    musicContent.onclick = function() {
        loadPage('album',contentID);
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
        loadSidebarLibrary();
    }
}

async function loadMusicLibrary() {
    const musicLibrary = document.getElementById('musicLibrary');
    for (const album of localSongs) {
        const demosong = album.songs[0]
        const metadata = await extractSongMetadata(demosong)
        const songObject = createMusicObject(metadata.album,metadata.artist,metadata.cover)
        musicLibrary.appendChild(songObject);
    }
}

loadMusicLibrary()