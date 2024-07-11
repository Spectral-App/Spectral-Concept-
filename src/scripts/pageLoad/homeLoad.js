// Datos de los albumes, estos se generaran poquito a poquito
var albums = [
    {   id: '1',
        image: './images/temp_cover.png',
        name: 'FANCY YOU',
        artist: 'TWICE'
    },
    {   id: '2',
        image: './images/temp_cover.png',
        name: 'Formula of Love: O+T=<3',
        artist: 'TWICE'
    },
    {   id: '3',
        image: './images/temp_cover.png',
        name: 'Hotline 024: Friday Night Funkin',
        artist: 'Saruky'
    },
    {   id: '4',
        image: './images/temp_cover.png',
        name: 'Static Symphony (feat. Sunexo)',
        artist: 'EliteFerrex'
    },
    {   id: '5',
        image: './images/temp_cover.png',
        name: 'Steven Universe, Vol. 1 (Original Soundtrack)',
        artist: 'Steven Universe'
    },
    {   id: '6',
        image: './images/temp_cover.png',
        name: 'POP CUBE',
        artist: 'imase'
    },
];

var itemsContainer = document.getElementById('yourSongsContainer');

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
