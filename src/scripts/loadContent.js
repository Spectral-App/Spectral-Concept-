const currentPageData = {
    contentType: 'home',
    contentID: 'HOME'
};

function sidebarLoadPage(contentType,contentID) {
    if (currentPageData.contentID !== contentID) {
        switch(contentType) {
            case 'home':
                $('.main').load('content/home.html');
                break;
            case 'search':
                $('.main').load('content/search.html');
                break;
            case 'plugins':
                $('.main').load('content/plugins.html');
                break;
            case 'library':
                $('.main').load('content/library.html');
                break;
            case 'album':
                $('.main').load('content/album.html');
                break;
            default:
                $('.main').load('content/404.html');
                break;
        }
        currentPageData.contentType = contentType;
        currentPageData.contentID = contentID;
        // DEBUG
        console.log('ContentType:', currentPageData.contentType);
        console.log('ContentID:', currentPageData.contentID);
    }
};

$('.main').load('content/home.html');