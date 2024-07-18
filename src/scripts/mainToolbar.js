const prevButton = document.getElementById('prevPageButton');
const nextButton = document.getElementById('nextPageButton');

function updateButtonStates() {
    if (mainData.historyPos > 0) {
        prevButton.querySelector('img').style.opacity = '1';
        prevButton.style.cursor = 'pointer';
    } else {
        prevButton.querySelector('img').style.opacity = '0.5';
        prevButton.style.cursor = 'not-allowed';
    }

    if (mainData.historyPos < mainData.history.length - 1) {
        nextButton.querySelector('img').style.opacity = '1';
        nextButton.style.cursor = 'pointer';
    } else {
        nextButton.querySelector('img').style.opacity = '0.5';
        nextButton.style.cursor = 'not-allowed';
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
