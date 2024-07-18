let container = document.getElementById("taskbar_titleWrapper");
let text = document.getElementById("taskbar_songTitle");


if (container.clientWidth < text.clientWidth) {
  text.classList.add("animate");
}