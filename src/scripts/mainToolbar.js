const prevButton = document.getElementById('prevPageButton');
const nextButton = document.getElementById('nextPageButton');
const settingsButton = document.getElementById('settingsButton');
const profileButton = document.getElementById('profileButton');


prevButton.addEventListener('click', historyPrevious);
nextButton.addEventListener('click', historyNext);
settingsButton.addEventListener('click', () => {loadPage('settings', 'SETTINGS')});
profileButton.addEventListener('click', () => {loadPage('user', 'USER')});

function updateButtonStates() {
    if (mainData.historyPos > 0) {
        prevButton.querySelector('img').style.opacity = '1';
    } else {
        prevButton.querySelector('img').style.opacity = '0.5';
    }

    if (mainData.historyPos < mainData.history.length - 1) {
        nextButton.querySelector('img').style.opacity = '1';
    } else {
        nextButton.querySelector('img').style.opacity = '0.5';
    }
}

function historyPrevious() {
    if (mainData.historyPos > 0) {
        mainData.historyPos--;
        const pageData = mainData.history[mainData.historyPos];
        loadPage(pageData.contentType, pageData.contentID, 'history', pageData.page);
        updateButtonStates();
    }
}

function historyNext() {
    if (mainData.historyPos < mainData.history.length - 1) {
        mainData.historyPos++;
        const pageData = mainData.history[mainData.historyPos];
        loadPage(pageData.contentType, pageData.contentID, 'history', pageData.page);
        updateButtonStates();
    }
}

updateButtonStates();
