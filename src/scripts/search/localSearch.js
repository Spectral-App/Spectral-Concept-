ipcRenderer.on('search-content', async (event, content) => {
    var titleResults = searchByTitle(content);
    var albumResults = searchByAlbum(content);
    var artistResults = searchByArtist(content);
    var genreResults = searchByGenre(content);

    if (titleResults.length > 0) {
        generateResultsContainer('LOCAL_TITLERESULTS', 'Canciones');
        var titleContent = document.getElementById('LOCAL_TITLERESULTS');
        const links = titleResults.map(song => song.link);
        for (const link of links) {
            const meta = await extractSongMetadata(link);
            const object = createMusicObject(meta.link,meta.title,meta.artist,meta.cover,'song')
            titleContent.appendChild(object);
        }
    }
    if (albumResults.length > 0) {
        generateResultsContainer('LOCAL_ALBUMRESULTS', 'Álbumes');
        var albumContent = document.getElementById('LOCAL_ALBUMRESULTS');
        const links = albumResults.map(song => song.link[0]);
        for (const link of links) {
            const meta = await extractSongMetadata(link);
            const object = createMusicObject(meta.link,meta.album,meta.artist,meta.cover)
            albumContent.appendChild(object);
        }
    }
    if (artistResults.length > 0) {
        generateResultsContainer('LOCAL_ARTISTRESULTS', 'Artistas');
        var artistContent = document.getElementById('LOCAL_ARTISTRESULTS');
        const links = artistResults.map(song => song.link[0]);
        console.log(links)
        for (const link of links) {
            const meta = await extractSongMetadata(link);
            const object = createMusicObject(meta.link,meta.artist,' ','images/temp_pfp.jpg','artist')
            artistContent.appendChild(object);
        }
    }
    if (genreResults.length > 0) {
        generateResultsContainer('LOCAL_GENRERESULTS', 'Género');
        var artistContent = document.getElementById('LOCAL_GENRERESULTS');
        const links = genreResults.map(song => song.link[0]);
        console.log(links)
        for (const link of links) {
            const meta = await extractSongMetadata(link);
            const object = createMusicObject(meta.link,meta.genre,' ','images/temp_pfp.jpg','genre')
            artistContent.appendChild(object);
        }
    }
});

function generateResultsContainer(id,title) {
    var searchResults = document.getElementById('searchResults');

    var container = document.createElement('div');
    container.className = 'searchResults_content';
    searchResults.appendChild(container);

    var ptitle = document.createElement('p');
    ptitle.className = 'searchResults_contentTitle';
    ptitle.textContent = title;
    container.appendChild(ptitle);

    var objects = document.createElement('div');
    objects.className = 'searchResults_objects';
    objects.id = id;
    container.appendChild(objects);
}