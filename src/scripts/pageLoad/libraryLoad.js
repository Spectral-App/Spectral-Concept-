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
    for (const album of localAlbums) {
        const demosong = album.songs[0]
        const metadata = await extractSongMetadata(demosong)
        const songObject = createMusicObject(metadata.link,metadata.album,metadata.artist,metadata.cover)
        musicLibrary.appendChild(songObject);
    }
}

loadMusicLibrary()