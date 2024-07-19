const buttonsData = [
        {
            title: 'Cpsito',
            subtitle: 'Playlist • Fuster',
            image: 'https://i1.sndcdn.com/artworks-uBPnBHsutxH7Uok6-QtaQsA-t500x500.jpg',
            contentType: 'album',
            contentID: '1e61lxs',
            link: ''
        },
    {
        title: 'Ejemplo Album 2',
        subtitle: 'Album • Artista 2',
        image: './images/temp_cover.png',
        contentType: 'album',
        contentID: '1e6bljn',
        link: ''
    },
    {
        title: 'Ejemplo Album 3',
        subtitle: 'Album • Artista 3',
        image: './images/temp_cover.png',
        contentType: 'album',
        contentID: '1e63evp',
        link: ''
    },
];

const sidebar_static = document.getElementById('sidebar_static');
const sidebar_dynamic = document.getElementById('sidebar_dynamic');

// Añade los botones de albumes, singles y playlists a la sidebar
function addSidebarButton(container, data) {
    const button = document.createElement('button');
    button.className = 'sidebar_buttons';
    let buttonLink
    if (data.link.toString() !== '') {
        buttonLink = data.link;
    } else {
        buttonLink = data.contentType
    }
    button.onclick = function() {
        loadPage(buttonLink,data.contentID);
    };

    const img = document.createElement('img');
    img.src = data.image;
    img.className = 'sidebar_buttons_image';
    button.appendChild(img);

    const textContainer = document.createElement('div');
    textContainer.className = 'sidebar_buttons_text';

    const title = document.createElement('span');
    title.className = 'sidebar_buttons_title';
    title.textContent = data.title;
    textContainer.appendChild(title);

    if (data.subtitle) {
        const subtitle = document.createElement('span');
        subtitle.className = 'sidebar_buttons_subtitle';
        subtitle.textContent = data.subtitle;
        textContainer.appendChild(subtitle);
    }

    button.appendChild(textContainer);

    if (container === 'static') {
        sidebar_static.appendChild(button);
    } else {
        sidebar_dynamic.appendChild(button);
    }
};

document.addEventListener('DOMContentLoaded', (event) => {
    buttonsData.forEach(data => {
        addSidebarButton('dynamic', data)
    });
});