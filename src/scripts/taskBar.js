let container = document.getElementById("taskbar_titleWrapper");
let text = document.getElementById("taskbar_songTitle");

text.classList.add("animate");

if (container.clientWidth < text.clientWidth) {
  text.classList.add("animate");
}