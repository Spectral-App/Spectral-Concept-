let container = document.getElementById("taskbar_titleWrapper");
let text = document.getElementById("taskbar_songTitle");

const currentSongData = {
  name: '',
  artist: '',
  album: '',
  cover: '',
  ID: '',
  albumID: '',
  artistID: ''
};

if (container.clientWidth < text.clientWidth) {
  text.classList.add("animate");
}