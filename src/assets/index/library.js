// Datos de los albumes, estos se generaran poquito a poquito
var albums = [
    {   id: '1',
        image: 'https://upload.wikimedia.org/wikipedia/en/0/09/Twice_-_Fancy_You.png',
        name: 'FANCY YOU',
        artist: 'TWICE'
    },
    {   id: '2',
        image: 'https://static.wikia.nocookie.net/kpop/images/d/df/TWICE_Formula_of_Love_O%2BT%3DHeart_digital_signature_version_2_cover_art.png/revision/latest?cb=20220911170039',
        name: 'Formula of Love: O+T=<3',
        artist: 'TWICE'
    },
    {   id: '3',
        image: 'https://dl.vgmdownloads.com/soundtracks/friday-night-funkin-hotline-024-2022-windows/cover.png',
        name: 'Hotline 024: Friday Night Funkin',
        artist: 'Saruky'
    },
    {   id: '4',
        image: 'https://uploads.ungrounded.net/tmp/img/161000/iu_161678_1312619.png',
        name: 'Static Symphony (feat. Sunexo)',
        artist: 'EliteFerrex'
    },
    {   id: '5',
        image: 'https://i.scdn.co/image/ab67616d0000b273e18ff29a2fe8e9c0df309fa6',
        name: 'Steven Universe, Vol. 1 (Original Soundtrack)',
        artist: 'Steven Universe'
    },
    {   id: '6',
        image: 'https://i.scdn.co/image/ab67616d0000b2734b062591b6a5c15652dd2bb5',
        name: 'POP CUBE',
        artist: 'imase'
    },
    {   id: '7',
        image: 'https://i.scdn.co/image/ab67616d0000b273c38c67ad56a314ba5669242d',
        name: 'HOPE ON THE STREET VOL.1',
        artist: 'j-hope'
    },
    {   id: '8',
        image: 'https://i.scdn.co/image/ab67616d00001e02741fd4807f442af3f7359316',
        name: 'GOLDEN',
        artist: 'Jung Kook'
    },
    {   id: '9',
        image: 'https://i.scdn.co/image/ab67616d0000b273326ce5a1ed43951c77f1b9f9',
        name: '1749',
        artist: 'Lemaitre'
    },
    {   id: '10',
        image: 'https://i.scdn.co/image/ab67616d00001e02b505667bcff9407f104d9320',
        name: 'BOUNCE INTO THE MUSIC',
        artist: 'SIAMES'
    },
    {   id: '11',
        image: 'https://i.scdn.co/image/ab67616d00001e025f4d67e6c3d62045e72d3775',
        name: 'VULTURES 1',
        artist: 'Kanye West'
    },
    {   id: '12',
        image: 'https://i.scdn.co/image/ab67616d00001e0226f7f19c7f0381e56156c94a',
        name: 'Graduation',
        artist: 'Kanye West'
    }
];

var itemsContainer = document.getElementById('userLibrary');

albums.forEach(function(album) {
    // Crear el boton en general
    var button = document.createElement('div');
    button.classList.add('itemButton');

    // Añade un id, util para cargar los datos con la API al final
    button.id = album.id;

    // Luego añade la imagen
    var image = document.createElement('img');
    image.classList.add('itemImage');
    image.src = album.image;
    image.alt = album.name;
    button.appendChild(image);

    // El nombre del album
    var name = document.createElement('p');
    name.classList.add('itemName');
    name.textContent = album.name;
    button.appendChild(name);

    // Al final el artista
    var artist = document.createElement('span');
    artist.classList.add('itemAuthor');
    artist.textContent = album.artist;
    button.appendChild(artist);

    // Y pum, se crea el boton :D
    itemsContainer.appendChild(button);
});
