async function getSongData() {
    const metaurl = (decodeText(checkURL().contentID));
    const meta = await extractSongMetadata(metaurl);
    const selectedAlbum = meta.album;
    let songsInAlbum = localAlbums.find(album => album.album === selectedAlbum)?.songs || [];
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

async function loadSongMetadata() {
    const albumObjects = {
        background: document.getElementById('albumContent'),
        cover: document.getElementById('album_cover'),
        title: document.getElementById('album_contentTitle'),
        artist: document.getElementById('album_artist'),
        date: document.getElementById('album_date'),
        shufflebutton: document.getElementById('album_shuffleButton'),
        playbutton: document.getElementById('album_playButton'),
        downloadbutton: document.getElementById('album_downloadButton'),
        songlistcontainer: document.getElementById('album_songsLists'),
    }

    albumObjects.background.style.opacity = '0';

    const metaurl = (decodeText(checkURL().contentID));
    const meta = await extractSongMetadata(metaurl);

    albumObjects.cover.src = meta.cover;
    albumObjects.title.textContent = meta.album;
    albumObjects.artist.textContent = meta.artist;
    albumObjects.date.textContent = meta.date.split('-')[0];

    let queue = [meta];
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

    const songEntry = createSongEntry(meta,queue,0);
    albumObjects.songlistcontainer.appendChild(songEntry);

    albumObjects.cover.onload = function() {
        const colorThief = new ColorThief();
        let coverDominantColor = colorThief.getColor(albumObjects.cover);
        let rgbColor = 'rgb('+coverDominantColor[0]+','+coverDominantColor[1]+','+coverDominantColor[2]+')';

        albumObjects.background.style.background = 'linear-gradient(to bottom, '+rgbColor+', #00000000)';
        albumObjects.background.style.opacity = '1';
    }
}

loadSongMetadata()