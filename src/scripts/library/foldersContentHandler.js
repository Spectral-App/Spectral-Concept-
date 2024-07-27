let localSongs = []
const sidebar_dynamic = document.getElementById('sidebar_dynamic');

ipcRenderer.on('library-file-added', async (event, file_path) => {
    if (!file_path) {
        console.error('No hay una ruta que observar!');
        return;
    }

    try {
        const songMeta = await extractSongMetadata(file_path);
        if (!songMeta) {
            console.error('No existen metadatos válidos:', file_path);
            return;
        }

        const existingAlbum = localSongs.find(album => album.album === songMeta.album);

        if (existingAlbum) {
            if (!existingAlbum.songs.includes(file_path)) {
                console.log('Registrando canción en el álbum: ', songMeta.album);
                existingAlbum.songs.push(file_path);
            } else {
                console.log('Canción existente');
            }
        } else {
            console.log('Registrando el álbum: ', songMeta.album);
            const newAlbumData = {
                album: songMeta.album,
                songs: [file_path]
            };
            localSongs.push(newAlbumData);

            // Generar los botones para el nuevo álbum
            const songObjectSidebar = addSidebarContentButton(songMeta.album, songMeta.artist, songMeta.cover);
            sidebar_dynamic.appendChild(songObjectSidebar);

            if (checkURL().contentData === 'library') {
                const musicLibrary = document.getElementById('musicLibrary'); 
                const songObjectLibrary = createMusicObject(songMeta.album, songMeta.artist, songMeta.cover);
                musicLibrary.appendChild(songObjectLibrary);
            }
        }
    } catch (err) {
        console.error('Error al procesar archivo:', err);
    }
});



ipcRenderer.on('library-file-deleted', async (event, file_path) => {
    console.log('file deleted!!!')
    const albumIndex = localSongs.findIndex(album =>
        album.songs.includes(file_path)
    );

    if (albumIndex !== -1) {
        const songIndex = localSongs[albumIndex].songs.indexOf(file_path);

        if (songIndex !== -1) {
            localSongs[albumIndex].songs.splice(songIndex, 1);

            if (localSongs[albumIndex].songs.length === 0) {
                let albumID = encodeText(localSongs[albumIndex].album)
                const sdbr_entry = document.querySelector(`button[sdbr-content-id="${albumID}"]`);
                console.log(sdbr_entry)
                if (sdbr_entry) {sdbr_entry.remove();}
                const lbry_entry = document.querySelector(`div[lbry-content-id="${albumID}"]`);
                console.log(lbry_entry)
                if (lbry_entry) {lbry_entry.remove()}
                console.log(`El album ${localSongs[albumIndex].album} ha sido borrado.`);
                localSongs.splice(albumIndex, 1);
            }
        }
    }
});

let savedMusicDirectories = JSON.parse(localStorage.getItem('savedMusicDirectories')) || [];
if (savedMusicDirectories && savedMusicDirectories.length > 0) {
    ipcRenderer.invoke('set-folders', savedMusicDirectories)
        .then(() => {
            console.log('started watching folders');
        })
        .catch(err => {
            console.error('Error setting folders:', err);
        });
}
