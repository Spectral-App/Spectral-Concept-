$(document).ready(function() {
    function loadPage(page) {
        $('.main').load(page);
    }

    loadPage('assets/index/home.html');

    $('#homeButton').click(function() {
        loadPage('assets/index/home.html');
    });

    $('#searchButton').click(function() {
        loadPage('assets/index/search.html');
    });

    $('#pluginsButton').click(function() {
        loadPage('assets/index/plugins.html');
    });

    $('#libraryButton').click(function() {
        loadPage('assets/index/library.html');
    });

    $('#coverButton').click(function() {
        loadPage('assets/index/home.html');
    });

    $('#songName').click(function() {
        loadPage('assets/index/home.html');
    });

    $('#songArtist').click(function() {
        loadPage('assets/index/home.html');
    });
});