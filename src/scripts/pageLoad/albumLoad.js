async function selectSongsByAlbum() {
    let selectedSongs = [];
    const selectedAlbum = (atob(checkURL().contentID));
    let savedMusicDirectories = JSON.parse(localStorage.getItem('savedMusicDirectories')) || [];
    if (savedMusicDirectories && savedMusicDirectories.length > 0) {
        for (const directory of savedMusicDirectories) {
            songsList = await ipcRenderer.invoke('searchForSongFiles', directory);
            for (const song of songsList) {
                const extractedSongData = await extractSongMetadata(song);
                if (extractedSongData.album === selectedAlbum) {
                    selectedSongs.push(song)
                }
            }
        }
    }
    return selectedSongs;
};

function createSongEntry(data) {
    const songEntry = document.createElement('div');
    songEntry.className = 'album_songEntry';

    songEntry.ondblclick= function() {
        loadSong(data)
    }
  
    const songEntryNumber = document.createElement('div');
    songEntryNumber.className = 'album_songEntryNumber';
  
    const numberP = document.createElement('p');
    numberP.textContent = data.number;
    songEntryNumber.appendChild(numberP);
  
    const playButton = document.createElement('button');
    playButton.className = 'album_songEntryNumber_play';

    playButton.onclick= function() {
        loadSong(data)
    }
  
    const playImg = document.createElement('img');
    playImg.src = 'icons/musicPlayer/play_alt.svg';
    playButton.appendChild(playImg);
  
    songEntryNumber.appendChild(playButton);
    songEntry.appendChild(songEntryNumber);
  
    const songEntryTitle = document.createElement('div');
    songEntryTitle.className = 'album_songEntryTitle';
  
    const titleP = document.createElement('p');
    titleP.textContent = data.title;
    songEntryTitle.appendChild(titleP);
    songEntry.appendChild(songEntryTitle);
  
    const songEntryArtist = document.createElement('div');
    songEntryArtist.className = 'album_songEntryArtist';
  
    const artistP = document.createElement('p');
    artistP.textContent = data.artist;
    songEntryArtist.appendChild(artistP);
    songEntry.appendChild(songEntryArtist);
  
    const songEntryDuration = document.createElement('div');
    songEntryDuration.className = 'album_songEntryDuration';
  
    const durationP = document.createElement('p');
    durationP.textContent = data.duration;
    songEntryDuration.appendChild(durationP);
    songEntry.appendChild(songEntryDuration);
  
    return songEntry;
}

async function loadAlbumMetadata() {
    const albumObjects = {
        background: document.getElementById('albumContent'),
        cover: document.getElementById('album_cover'),
        title: document.getElementById('album_contentTitle'),
        artist: document.getElementById('album_artist'),
        date: document.getElementById('album_date'),
        songcount: document.getElementById('album_songCount'),
        playbutton: document.getElementById('album_playButton'),
        songlistcontainer: document.getElementById('album_songsLists'),
    }

    albumObjects.background.style.opacity = '0';

    const albumContent = await selectSongsByAlbum();
    const demosong = albumContent[0];
    const phSongMetadata = await extractSongMetadata(demosong);

    //to get the image dominant color for the bg
    const colorThief = new ColorThief();

    albumObjects.cover.src = phSongMetadata.cover;
    albumObjects.title.textContent = phSongMetadata.album;
    albumObjects.artist.textContent = phSongMetadata.artist;
    albumObjects.date.textContent = phSongMetadata.date.split('-')[0];
    albumObjects.songcount.textContent = albumContent.length + ' Canciones';

    let albumSongs = [];
    for (const song of albumContent) {
        const songMetadata = await extractSongMetadata(song);
        albumSongs.push(songMetadata);
    }
    albumSongs.sort((a,b) => a.number - b.number)
    for (const song of albumSongs) {
        const songEntry = createSongEntry(song);
        albumObjects.songlistcontainer.appendChild(songEntry);
    }

    let coverDominantColor = colorThief.getColor(albumObjects.cover);
    let rgbColor = 'rgb('+coverDominantColor[0]+','+coverDominantColor[1]+','+coverDominantColor[2]+')';

    albumObjects.background.style.background = 'linear-gradient(to bottom, '+rgbColor+', #00000000)';
    albumObjects.background.style.opacity = '1';
}

loadAlbumMetadata()