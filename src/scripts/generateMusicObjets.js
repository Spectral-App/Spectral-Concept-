function createMusicObject(id,title,subtitle,imageUrl='images/temp_cover.png',type='album') {
    const contentID = encodeText(id)
    const musicContent = document.createElement('div');
    musicContent.className = 'musicContent';
    musicContent.setAttribute('lbry-content-id', contentID);

    musicContent.onclick = function() {
        loadPage(type,contentID);
    };

    const musicImage = document.createElement('img');
    musicImage.src = imageUrl;

    const musicInfo = document.createElement('div');
    musicInfo.className = 'musicContent_info';

    const musicTitle = document.createElement('p');
    musicTitle.className = 'musicContent_title';
    musicTitle.textContent = title || 'Unknown Song';

    const musicSubtitle = document.createElement('p');
    musicSubtitle.className = 'musicContent_subtitle';
    musicSubtitle.textContent = subtitle || 'Unknown Artist';

    musicInfo.appendChild(musicTitle);
    musicInfo.appendChild(musicSubtitle);

    musicContent.appendChild(musicImage);
    musicContent.appendChild(musicInfo);

    return musicContent;
}