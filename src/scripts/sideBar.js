const sidebar_static = document.getElementById('sidebar_static');
const sidebar_dynamic = document.getElementById('sidebar_dynamic');

const buttonTemplate = {
    buttonlink: 'link/to/html',
    buttonlinkid: 'content/id/OPTIONAL',
    buttonparameters: {exampleParameter: 'yessir'},
    title: 'button title',
    subtitle: 'button subtitle',//an optional parameter
    icon: 'path/to/icon',
}

function addSidebarContentButton(album, artist, cover) {
    const button = document.createElement('button');
    button.className = 'sidebar_buttons';
  
    button.onclick = function() {
        loadPage('album',btoa(unescape(encodeURIComponent(album))));
    };
  
    const img = document.createElement('img');
    img.src = cover;
    img.className = 'sidebar_buttons_image';
    button.appendChild(img);
  
    const textContainer = document.createElement('div');
    textContainer.className = 'sidebar_buttons_text';
  
    const title = document.createElement('span');
    title.className = 'sidebar_buttons_title';
    title.textContent = album;
    textContainer.appendChild(title);
  
    const subtitle = document.createElement('span');
    subtitle.className = 'sidebar_buttons_subtitle';
    subtitle.textContent = 'Album • ' + artist;
    textContainer.appendChild(subtitle);
  
    button.appendChild(textContainer);
  
    return button;
  }

async function loadSidebarLibrary() {
    let savedMusicDirectories = JSON.parse(localStorage.getItem('savedMusicDirectories')) || [];
    if (savedMusicDirectories && savedMusicDirectories.length > 0) {
        let addedAlbums = [];
        for (const directory of savedMusicDirectories) {
            songsList = await ipcRenderer.invoke('searchForSongFiles', directory);
            for (const song of songsList) {
                const extractedSongData = await extractSongMetadata(song);
                if (!addedAlbums.includes(extractedSongData.album)) {
                    addedAlbums.push(extractedSongData.album);
                    const songObject = addSidebarContentButton(extractedSongData.album, extractedSongData.artist, extractedSongData.cover);
                    sidebar_dynamic.appendChild(songObject);
                }
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    loadSidebarLibrary()
});