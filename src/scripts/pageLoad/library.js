function addLibraryItem() {
    
    const libraryContainer = document.getElementById('userLibrary');
    const newItem = document.createElement('div');
    newItem.className = 'libraryItem';
    newItem.textContent = 'Nuevo ítem';
    libraryContainer.appendChild(newItem);
}

function createPlaylist() {
    
    const playlistContainer = document.getElementById('playlists');
    const newPlaylist = document.createElement('div');
    newPlaylist.className = 'playlistItem';
    newPlaylist.textContent = 'Nueva lista de reproducción';
    playlistContainer.appendChild(newPlaylist);
}

function downloadMusic() {
    
    alert('Descargando música...');
}