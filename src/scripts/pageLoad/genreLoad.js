async function selectSongsByArtist() {
    const metaurl = (decodeText(checkURL().contentID));
    console.log(metaurl)
    const meta = await extractSongMetadata(metaurl);
    console.log(meta)
    const selectedAlbum = meta.genre;
    let songsInAlbum = localGenres.find(genre => genre.name === selectedAlbum)?.songs || [];
    return songsInAlbum;
};

function createSongEntry(data,queue,actualSongNum) {
    const songEntry = document.createElement('div');
    songEntry.className = 'album_songEntry';

    songEntry.ondblclick= function() {
        updateQueue(queue,actualSongNum)
    }
  
    const songEntryNumber = document.createElement('div');
    songEntryNumber.className = 'album_songEntryNumber';
  
    const numberP = document.createElement('p');
    numberP.textContent = data.number;
    songEntryNumber.appendChild(numberP);
  
    const playButton = document.createElement('button');
    playButton.className = 'album_songEntryNumber_play';

    playButton.onclick= function() {
        updateQueue(queue,actualSongNum)
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
        date: document.getElementById('album_date'),
        songcount: document.getElementById('album_songCount'),
        shufflebutton: document.getElementById('album_shuffleButton'),
        playbutton: document.getElementById('album_playButton'),
        downloadbutton: document.getElementById('album_downloadButton'),
        songlistcontainer: document.getElementById('album_songsLists'),
    }

    albumObjects.background.style.opacity = '0';

    const albumContent = await selectSongsByArtist();
    const demosong = albumContent[0];
    const phSongMetadata = await extractSongMetadata(demosong);

    const colorThief = new ColorThief();

    albumObjects.title.textContent = phSongMetadata.genre;
    albumObjects.date.textContent = phSongMetadata.date.split('-')[0];
    albumObjects.songcount.textContent = albumContent.length + ' Canciones';

    let albumSongs = [];
    for (const song of albumContent) {
        const songMetadata = await extractSongMetadata(song);
        albumSongs.push(songMetadata);
    }
    albumSongs.sort((a,b) => a.number - b.number);
    let queue = albumSongs;
    let actualSongNum = 0;

    albumObjects.shufflebutton.onclick= function() {
        //fucking shitty code but it works
        updateQueue(queue)
        if (!shuffleState) {
            taskbarObjects.shufflebutton.src = 'icons/musicPlayer/shuffle_on.svg';
            shuffleState = true;
        };
        nextSong();
    }

    albumObjects.playbutton.onclick= function() {
        updateQueue(queue)
    }

    albumObjects.downloadbutton.onclick= function() {
        sendNotification('Ventana de descarga!')
    }


    for (const song of albumSongs) {
        const songEntry = createSongEntry(song,queue,actualSongNum);
        actualSongNum += 1;
        albumObjects.songlistcontainer.appendChild(songEntry);
    }
    
    let coverDominantColor = colorThief.getColor(albumObjects.cover);
    let rgbColor = 'rgb('+coverDominantColor[0]+','+coverDominantColor[1]+','+coverDominantColor[2]+')';

    albumObjects.background.style.background = 'linear-gradient(to bottom, '+rgbColor+', #00000000)';
    albumObjects.background.style.opacity = '1';
}

loadAlbumMetadata()