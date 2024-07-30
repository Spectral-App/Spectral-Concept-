let localAlbums = [];
let localSongs = [];
let localArtists = [];
let localGenres = [];

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

        const existingAlbum = localAlbums.find(album => album.album === songMeta.album);

        if (existingAlbum) {
            if (!existingAlbum.songs.includes(file_path)) {
                existingAlbum.songs.push(file_path);
            }
        } else {
            const newAlbumData = {
                album: songMeta.album,
                songs: [file_path]
            };
            localAlbums.push(newAlbumData);

            const songObjectSidebar = addSidebarContentButton(songMeta.link,songMeta.album, songMeta.artist, songMeta.cover);
            sidebar_dynamic.appendChild(songObjectSidebar);

            if (checkURL().contentData === 'library') {
                const musicLibrary = document.getElementById('musicLibrary');
                const songObjectLibrary = createMusicObject(songMeta.link,songMeta.album, songMeta.artist, songMeta.cover);
                musicLibrary.appendChild(songObjectLibrary);
            }
        }

        if (!localSongs.some(song => song.path === file_path)) {
            localSongs.push({ title: songMeta.title, path: file_path });
        }

        const existingArtist = localArtists.find(artist => artist.name === songMeta.artist);
        if (existingArtist) {
            if (!existingArtist.songs.includes(file_path)) {
                existingArtist.songs.push(file_path);
            }
        } else {
            localArtists.push({ name: songMeta.artist, songs: [file_path] });
        }

        const existingGenre = localGenres.find(genre => genre.name === songMeta.genre);
        if (existingGenre) {
            if (!existingGenre.songs.includes(file_path)) {
                existingGenre.songs.push(file_path);
            }
        } else {
            localGenres.push({ name: songMeta.genre, songs: [file_path] });
        }

    } catch (err) {
        console.error('Error al procesar archivo:', err);
    }
});

ipcRenderer.on('library-file-deleted', async (event, file_path) => {
    const albumIndex = localAlbums.findIndex(album =>
        album.songs.includes(file_path)
    );

    if (albumIndex !== -1) {
        const songIndex = localAlbums[albumIndex].songs.indexOf(file_path);

        if (songIndex !== -1) {
            localAlbums[albumIndex].songs.splice(songIndex, 1);

            if (localAlbums[albumIndex].songs.length === 0) {
                let albumID = encodeText(localAlbums[albumIndex].link);
                const sdbr_entry = document.querySelector(`button[sdbr-content-id="${albumID}"]`);
                if (sdbr_entry) { sdbr_entry.remove(); }
                const lbry_entry = document.querySelector(`div[lbry-content-id="${albumID}"]`);
                if (lbry_entry) { lbry_entry.remove(); }
                localAlbums.splice(albumIndex, 1);
            }
        }
    }

    const songIndex = localSongs.findIndex(song => song.path === file_path);
    if (songIndex !== -1) {
        localSongs.splice(songIndex, 1);
    }

    localArtists.forEach((artist, index) => {
        const songIndex = artist.songs.indexOf(file_path);
        if (songIndex !== -1) {
            artist.songs.splice(songIndex, 1);
            if (artist.songs.length === 0) {
                localArtists.splice(index, 1);
            }
        }
    });

    localGenres.forEach((genre, index) => {
        const songIndex = genre.songs.indexOf(file_path);
        if (songIndex !== -1) {
            genre.songs.splice(songIndex, 1);
            if (genre.songs.length === 0) {
                localGenres.splice(index, 1);
            }
        }
    });
});

let savedMusicDirectories = JSON.parse(localStorage.getItem('savedMusicDirectories')) || [];
if (savedMusicDirectories && savedMusicDirectories.length > 0) {
    ipcRenderer.invoke('set-folders', savedMusicDirectories)
        .catch(err => {
            console.error('Error setting folders:', err);
        });
}

function searchByAlbum(search) {
    if (search !== '') {
        const query = search.toLowerCase();
        return localAlbums
            .filter(album => album.album.toLowerCase().includes(query))
            .map(album => ({ name: album.album, link: album.songs }));
    }
}

function searchByTitle(search) {
    if (search !== '') {
        const query = search.toLowerCase();
        return localSongs
            .filter(song => song.title.toLowerCase().includes(query))
            .map(song => ({ name: song.title, link: song.path }));
    }
}

function searchByArtist(search) {
    if (search !== '') {
        const query = search.toLowerCase();
        const results = localArtists
            .filter(artist => artist.name.toLowerCase().includes(query))
            .map(artist => ({
                name: artist.name,
                link: artist.songs
            }));
        
        return results;
    }
    return [];
}

function searchByGenre(search) {
    if (search !== '') {
        const query = search.toLowerCase();
        const results = localGenres
            .filter(genre => genre.name.toLowerCase().includes(query))
            .map(genre => ({
                name: genre.name,
                link: genre.songs
            }));
        
        return results;
    }
    return [];
}

