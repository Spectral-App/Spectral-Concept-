if (typeof window.searchFunctions === 'undefined') {
    window.searchFunctions = [];
}

if (typeof window.typingTimer === 'undefined') {
    window.typingTimer = null;
}

function toggleClearIcon() {
    var searchBar = document.getElementById('searchBar');
    var clearIcon = document.getElementById('clearIcon');
    if (searchBar.value.length > 0) {
        clearIcon.style.display = 'block';
    } else {
        clearIcon.style.display = 'none';
    }
}

function clearSearch() {
    var searchBar = document.getElementById('searchBar');
    searchBar.value = '';
    searchBar.focus();
}

searchBar.addEventListener('keyup', () => {
    var searchBar = document.getElementById('searchBar');
    clearTimeout(window.typingTimer);
    window.typingTimer = setTimeout(() => {
        if (searchBar.value !== '') {
            var searchResults = document.getElementById('searchResults');
            searchResults.innerHTML = '';
            ipcRenderer.invoke('start-search', searchBar.value)
            console.log('Buscando ', searchBar.value)
        }
    }, 1000);
});

searchBar.addEventListener('keydown', () => {
    clearTimeout(window.typingTimer);
});