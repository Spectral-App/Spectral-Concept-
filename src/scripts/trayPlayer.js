const { ipcRenderer } = require('electron');

const playerObjects = {
    openbutton: document.getElementById('openbutton'),
    closebutton: document.getElementById('closebutton'),
    cover: document.getElementById('songCover'),
    title: document.getElementById('songTitle'),
    artist: document.getElementById('songArtist'),
    shufflebutton: document.getElementById('shufflebutton').querySelector('img'),
    previousbutton: document.getElementById('previousbutton'),
    playbutton: document.getElementById('playButton').querySelector('img'),
    nextbutton: document.getElementById('nextbutton'),
    repeatbutton: document.getElementById('repeatbutton').querySelector('img'),
};

function toggleMainWindow() {
    ipcRenderer.send('toogle-main-window');
}

ipcRenderer.on('receive-player-data', (event, data) => {
    if (data.title) {playerObjects.title.textContent = data.title};
    if (data.artist) {playerObjects.artist.textContent = data.artist};
    if (data.cover) {playerObjects.cover.src = data.cover};
    if (data.isplaying) {
        if (data.isplaying === true) {
            playerObjects.playbutton.src = 'icons/musicPlayer/pause_alt.svg';
        } else {
            playerObjects.playbutton.src = 'icons/musicPlayer/play_alt.svg';
        }
    }
    if (data.isshuffle) {
        if (data.isshuffle === true) {
            console.log('hola') //TODO: AÑADIR LA LOGICA QUE CORRESPONDA AL SHUFFLE, SERA CUANDO SE TERMINE LA PRINCIPAL
        }
    }
});