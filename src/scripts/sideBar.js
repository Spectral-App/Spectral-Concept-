const { ipcRenderer } = require('electron');
const sidebar_static = document.getElementById('sidebar_static');

// const buttonTemplate = {
//     buttonlink: 'link/to/html',
//     buttonlinkid: 'content/id/OPTIONAL',
//     buttonparameters: {exampleParameter: 'yessir'},
//     title: 'button title',
//     subtitle: 'button subtitle',   an optional parameter
//     icon: 'path/to/icon',
// }

function addSidebarContentButton(id,album, artist, cover) {
    const albumID = encodeText(id);
    const button = document.createElement('button');
    button.className = 'sidebar_buttons';
    button.setAttribute('sdbr-content-id', albumID);
  
    button.onclick = function() {
        loadPage('album',albumID);
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
    for (const album of localAlbums) {
        const demosong = album.songs[0]
        const metadata = await extractSongMetadata(demosong)
        const songObject = addSidebarContentButton(metadata.link,metadata.album,metadata.artist,metadata.cover)
        sidebar_dynamic.appendChild(songObject);
    }
}