const taskbarObjects = {
  song: document.getElementById('mainSong'),
  title: document.getElementById('taskbar_songTitle'),
  artist: document.getElementById('taskbar_songArtist'),
  coverart: document.getElementById('taskbar_songCover').querySelector('img'),
  progressbar_container: document.getElementById('taskbar_progressBar'),
  progressbar: document.getElementById('taskbar_progresbar_progress'),
  actualtime: document.getElementById('taskbar_actualTime'),
  totaltime: document.getElementById('taskbar_totalTime'),
  shufflebutton: document.getElementById('taskbar_shuffleButton').querySelector('img'),
  playbutton: document.getElementById('taskbar_playButton').querySelector('img'),
  repeatbutton: document.getElementById('taskbar_repeatButton').querySelector('img'),
  volumebar_container: document.getElementById('taskbar_volumeBar'),
  volumebar: document.getElementById('taskbar_volumebar_progress'),
  mutebutton: document.getElementById('taskbar_muteButton').querySelector('img'),
};

// const songDataTemplate = {
//   link: '',
//   title: '',
//   artist: '',
//   album: '',
//   genre: '',
//   cover: '',
//   number: '0',
//   date: null,
//   duration: null,
//   copyright: null,
//   lyrics: null,
// };

let songsQueue = [];
let actualSong = 0;

let shuffleState = false;
let repeatState = 'none' //can be none, once or all

let isDragging = false;
let isVolumeDragging = false;
let newTime = 0;
let newVolume = 1;

function updateQueue(data,loadSongNum=0,startSong=true) {
  songsQueue = data;
  actualSong = loadSongNum;
  loadSong(songsQueue[loadSongNum],startSong);
}

async function loadSong(data, startSong = true) {
  try {
    taskbarObjects.song.src = data.link;
    taskbarObjects.title.textContent = data.title;
    taskbarObjects.artist.textContent = data.artist;
    taskbarObjects.coverart.src = data.cover;
    taskbarObjects.totaltime.textContent = data.duration;

    changeMediaSession(data.title, data.artist, data.album, data.cover)
    
    if (startSong === true) {
      taskbarObjects.playbutton.src = 'icons/musicPlayer/pause.svg';
      taskbarObjects.song.play();
    }

  } catch (error) {
    console.error(error)
    sendNotification('No se pudo cargar la cancion', 'error');
  }
}

function changeMediaSession(songTitle,songArtist,songAlbum,songCoverArt) {
  navigator.mediaSession.metadata = new MediaMetadata({
    title: songTitle,
    artist: songArtist,
    album: songAlbum,
    artwork: [{src: songCoverArt,},],
  });
}

function controlSong() {
  if (taskbarObjects.song.paused) {
    taskbarObjects.playbutton.src = 'icons/musicPlayer/pause.svg'
    taskbarObjects.song.play();
  } else {
    taskbarObjects.playbutton.src = 'icons/musicPlayer/play.svg'
    taskbarObjects.song.pause();
  }
}

taskbarObjects.song.addEventListener('timeupdate', () => {
  if (!isDragging) {
    taskbarObjects.actualtime.textContent = formatTime(taskbarObjects.song.currentTime)
    taskbarObjects.progressbar.style.width = ((taskbarObjects.song.currentTime / taskbarObjects.song.duration) * 100) + '%'
  }
})

taskbarObjects.song.addEventListener('ended', () => {
  nextSong(true)
})

function previousSong(clicks) {
  if (clicks === 1) {
    taskbarObjects.progressbar.style.width = '0%';
    taskbarObjects.song.currentTime = 0;
  } else if (clicks === 2) {
    if (shuffleState) {
      //TODO: logica entera de un historial para poder volver y regresar sin afectar el modo aleatorio
    } else {
      if (actualSong-1 < 0) {
        actualSong = songsQueue.length-1
      } else {
        actualSong-=1
      }
      updateQueue(songsQueue,actualSong);
    }
  }
}

function nextSong(isAuto = false) {
  if (shuffleState) {
    let randomChoice;
    let numberIsntActualSong;

    while (!numberIsntActualSong && songsQueue.length > 1) {
      const randomChoice = Math.floor(Math.random() * songsQueue.length);
      if (randomChoice !== actualSong) {
        numberIsntActualSong = true;
        actualSong = randomChoice;
      }
    }
    
    updateQueue(songsQueue,actualSong);
  } else { 
    if (repeatState === 'once' && isAuto) {
      updateQueue(songsQueue,actualSong);
    } else if (actualSong+1 >= songsQueue.length) {
      actualSong = 0;
      if (repeatState ===  'all' || repeatState === 'once') {
        updateQueue(songsQueue,actualSong);
      } else if (repeatState === 'none') {
        updateQueue(songsQueue,actualSong,false);
        taskbarObjects.playbutton.src = 'icons/musicPlayer/play.svg'
        taskbarObjects.progressbar.style.width = '0%';
        taskbarObjects.song.currentTime = 0;
        taskbarObjects.totaltime.textContent = data.duration;
      }
    } else {
      actualSong+=1;
      updateQueue(songsQueue,actualSong);
    }
  }
}

function muteSong() {
  if (taskbarObjects.song.volume === 0) {
    if (taskbarObjects.song.volume === 0 && newVolume === 0) {
      newVolume = 1;
    }
    taskbarObjects.song.volume = newVolume;
    if (taskbarObjects.song.volume < 0.5) {
      taskbarObjects.mutebutton.src = 'icons/musicPlayer/low_sound.svg';
    } else if (taskbarObjects.song.volume >= 0.5) {
      taskbarObjects.mutebutton.src = 'icons/musicPlayer/full_sound.svg';
    } else { // in case of error
      taskbarObjects.mutebutton.src = 'icons/musicPlayer/full_sound.svg';
    };
    taskbarObjects.volumebar.style.width = newVolume*100+'%';
  } else {
    newVolume = taskbarObjects.song.volume;
    taskbarObjects.song.volume = 0;
    taskbarObjects.volumebar.style.width = 0;
    taskbarObjects.mutebutton.src = 'icons/musicPlayer/no_sound.svg';
  }
};

function toggleRepeat() {
  if (repeatState === 'none') {
    taskbarObjects.repeatbutton.src = 'icons/musicPlayer/repeat_on.svg';
    repeatState = 'all';
  } else if (repeatState === 'all') {
    taskbarObjects.repeatbutton.src = 'icons/musicPlayer/repeat_once.svg';
    repeatState = 'once';
  } else if (repeatState === 'once') {
    taskbarObjects.repeatbutton.src = 'icons/musicPlayer/repeat.svg';
    repeatState = 'none';
  }

  if (repeatState) {
    taskbarObjects.shufflebutton.src = 'icons/musicPlayer/shuffle.svg';
    shuffleState = false;
  }
}

function toggleShuffle() { 
  if (!shuffleState) {
    taskbarObjects.shufflebutton.src = 'icons/musicPlayer/shuffle_on.svg';
    shuffleState = true;
  } else if (shuffleState) {
    taskbarObjects.shufflebutton.src = 'icons/musicPlayer/shuffle.svg';
    shuffleState = false;
  }

  if (repeatState === 'all' || repeatState === 'once') {
    repeatState = 'none';
    taskbarObjects.repeatbutton.src = 'icons/musicPlayer/repeat.svg';
  }
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(1, '0')}:${secs.toString().padStart(2, '0')}`;
}

function calculateNewTime(clientX) {
  const rect = taskbarObjects.progressbar_container.getBoundingClientRect();
  const offsetX = clientX - rect.left;
  newTime = (offsetX / rect.width) * taskbarObjects.song.duration;
  taskbarObjects.progressbar.style.width = (offsetX / rect.width) * 100 + '%';
}

function calculateNewVolume(clientX) {
  const rect = taskbarObjects.volumebar_container.getBoundingClientRect();
  const offsetX = clientX - rect.left;
  newVolume = Math.min(Math.max(offsetX / rect.width, 0), 1);
  taskbarObjects.volumebar.style.width = newVolume * 100 + '%';
  taskbarObjects.song.volume = newVolume;

  if (taskbarObjects.song.volume === 0) {
    taskbarObjects.mutebutton.src = 'icons/musicPlayer/no_sound.svg'
  } else if (taskbarObjects.song.volume < 0.5) {
    taskbarObjects.mutebutton.src = 'icons/musicPlayer/low_sound.svg'
  } else if (taskbarObjects.song.volume >= 0.5) {
    taskbarObjects.mutebutton.src = 'icons/musicPlayer/full_sound.svg'
  } else { // in case of error
    taskbarObjects.mutebutton.src = 'icons/musicPlayer/full_sound.svg'
  }
}

function saveData() {
  let playerdata = {
    songsQueue: [],
    actualSong: 0,
    newVolume: 0,
    shuffleState: false,
    repeatState: 'none',
  }
  playerdata.songsQueue = songsQueue;
  playerdata.actualSong = actualSong;
  playerdata.newVolume = newVolume;
  playerdata.shuffleState = shuffleState;
  playerdata.repeatState = repeatState;

  let playingsongpos = taskbarObjects.song.currentTime

  localStorage.setItem('taskbarData', JSON.stringify(playerdata));
  localStorage.setItem('songData', playingsongpos);
}


ipcRenderer.on('app-closing', (event, message) => {
  saveData()
});

window.addEventListener('beforeunload', (event) => {
  saveData()
});

async function restoreData() {
  const playerdata = JSON.parse(localStorage.getItem('taskbarData'));
  const playingsongpos = localStorage.getItem('songData');
  if (playerdata && playerdata.songsQueue.length > 0 && playingsongpos) {
    songsQueue = playerdata.songsQueue;
    actualSong = playerdata.actualSong;
    shuffleState = playerdata.shuffleState;
    repeatState = playerdata.repeatState;
    newVolume = playerdata.newVolume;

    //RELOADS EVERY SONG METADATA - made just for the cover art being missing every restart
    for (const song of songsQueue) {
      let songLink = song.link;
      let songCover = await extractSongMetadata(songLink);
      song.cover = songCover.cover
    }

    //load every song that the user had loaded before exiting
    //also loads the last played song
    updateQueue(songsQueue, actualSong, false);

    //gets the last known position of the song
    taskbarObjects.song.currentTime = playingsongpos;
    taskbarObjects.actualtime.textContent = formatTime(taskbarObjects.song.currentTime)
    taskbarObjects.progressbar.style.width = ((taskbarObjects.song.currentTime / taskbarObjects.song.duration) * 100) + '%'

    //same shit but updates the volume bar
    taskbarObjects.song.volume = newVolume;
    taskbarObjects.volumebar.style.width = newVolume * 100 + '%';

    if (taskbarObjects.song.volume === 0) {
      taskbarObjects.mutebutton.src = 'icons/musicPlayer/no_sound.svg'
    } else if (taskbarObjects.song.volume < 0.5) {
      taskbarObjects.mutebutton.src = 'icons/musicPlayer/low_sound.svg'
    } else if (taskbarObjects.song.volume >= 0.5) {
      taskbarObjects.mutebutton.src = 'icons/musicPlayer/full_sound.svg'
    } else { // in case of error
      taskbarObjects.mutebutton.src = 'icons/musicPlayer/full_sound.svg'
    }

    //adjusts the icons depending of the current state of the shuffle
    if (!shuffleState) {
      taskbarObjects.shufflebutton.src = 'icons/musicPlayer/shuffle.svg';
    } else if (shuffleState) {
      taskbarObjects.shufflebutton.src = 'icons/musicPlayer/shuffle_on.svg';
    }

    //same shit but for the repeat button
    if (repeatState === 'none') {
      taskbarObjects.repeatbutton.src = 'icons/musicPlayer/repeat.svg';
    } else if (repeatState === 'all') {
      taskbarObjects.repeatbutton.src = 'icons/musicPlayer/repeat_on.svg';
    } else if (repeatState === 'once') {
      taskbarObjects.repeatbutton.src = 'icons/musicPlayer/repeat_once.svg';
    }

    console.log('Datos restaurados con éxito.');
  } else {
    taskbarObjects.playbutton.src = 'icons/musicPlayer/play.svg'
    taskbarObjects.progressbar.style.width = '0%';
    taskbarObjects.song.currentTime = 0;
    taskbarObjects.totaltime.textContent = data.duration;
  }
  await ipcRenderer.invoke('spectral-is-loaded');
}

taskbarObjects.volumebar_container.addEventListener('mousedown', (e) => {
  isVolumeDragging = true;
  calculateNewVolume(e.clientX);
});

taskbarObjects.progressbar_container.addEventListener('mousedown', (e) => {
  isDragging = true;
  calculateNewTime(e.clientX);
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    calculateNewTime(e.clientX);
  }
  if (isVolumeDragging) {
    calculateNewVolume(e.clientX);
  }
});

document.addEventListener('mouseup', () => {
  if (isDragging) {
    taskbarObjects.song.currentTime = newTime;
    isDragging = false;
  }
  if (isVolumeDragging) {
    taskbarObjects.song.volume = newVolume;
    isVolumeDragging = false;
  }
});

document.addEventListener('mouseleave', () => {
  isDragging = false;
  isVolumeDragging = false;
});

document.addEventListener('DOMContentLoaded', (event) => {
  restoreData()
});

document.addEventListener('keydown', (event) => {
  const activeElement = document.activeElement;

  if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
    if (event.code === 'Space') {
      controlSong()
      event.preventDefault();
    } else if (event.code === 'KeyM') {
      muteSong()
    }
  }
});

// media session controls
navigator.mediaSession.setActionHandler("play", () => {
  controlSong()
});
navigator.mediaSession.setActionHandler("pause", () => {
  controlSong()
});

navigator.mediaSession.setActionHandler("previoustrack", () => {
  previousSong(2)
});
navigator.mediaSession.setActionHandler("nexttrack", () => {
  nextSong()
});