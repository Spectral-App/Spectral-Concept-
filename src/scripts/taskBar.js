const { ipcRenderer } = require('electron');

const taskbarObjects = {
  song: document.getElementById('mainSong'),
  title: document.getElementById('taskbar_songTitle'),
  artist: document.getElementById('taskbar_songArtist'),
  coverart: document.getElementById('taskbar_songCover').querySelector('img'),
  progressbar_container: document.getElementById('taskbar_progressBar'),
  progressbar: document.getElementById('taskbar_progresbar_progress'),
  actualtime: document.getElementById('taskbar_actualTime'),
  totaltime: document.getElementById('taskbar_totalTime'),
  playbutton: document.getElementById('taskbar_playButton').querySelector('img'),
  volumebar_container: document.getElementById('taskbar_volumeBar'),
  volumebar: document.getElementById('taskbar_volumebar_progress'),
  mutebutton: document.getElementById('taskbar_muteButton').querySelector('img'),
};

const currentSongData = {
  link: '',
  title: '',
  artist: '',
  album: '',
  genre: '',
  cover: '',
  number: '0',
  date: null,
  duration: null,
  copyright: null,
  lyrics: null,
};

let isDragging = false;
let isVolumeDragging = false;
let newTime = 0;
let newVolume = 1;

async function loadSong(data) {
  taskbarObjects.song.src = data.link;
  taskbarObjects.title.textContent = data.title;
  taskbarObjects.artist.textContent = data.artist;
  taskbarObjects.coverart.src = data.cover;

  taskbarObjects.playbutton.src = 'icons/musicPlayer/pause.svg';
  taskbarObjects.song.play();

  tray_data = {
    title: data.title,
    artist: data.artist,
    cover: data.cover,
    isplaying: true
  }

  ipcRenderer.send('send-player-data', tray_data);
  changeMediaSession(data.title,data.artist,data.album,data.cover)
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

//this pile of code acts like the brain of the progressbar, pretty cool
taskbarObjects.song.addEventListener('timeupdate', () => {
  if (!isDragging) {
    taskbarObjects.actualtime.textContent = formatTime(taskbarObjects.song.currentTime)
    taskbarObjects.totaltime.textContent = formatTime(taskbarObjects.song.duration)
    taskbarObjects.progressbar.style.width = ((taskbarObjects.song.currentTime / taskbarObjects.song.duration) * 100) + '%'
  }
})

function muteSong() {
  if (taskbarObjects.song.volume === 0) {
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

// code to format the text for the taskbar
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
  //TODO: REPLACE WITH USER LAST VOLUME DATA
  taskbarObjects.volumebar.style.width = '100%';
});

// media session controls
navigator.mediaSession.setActionHandler("play", () => {
  controlSong()
});
navigator.mediaSession.setActionHandler("pause", () => {
  controlSong()
});
navigator.mediaSession.setActionHandler("stop", () => {
  console.log('STOP FROM MEDIA SESSION')
});
navigator.mediaSession.setActionHandler("previoustrack", () => {
  console.log('PREVIOUS FROM MEDIA SESSION')
});
navigator.mediaSession.setActionHandler("nexttrack", () => {
  console.log('NEXT FROM MEDIA SESSION')
});