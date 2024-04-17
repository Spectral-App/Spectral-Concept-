// Datos de los albumes, estos se generaran poquito a poquito
var albums = [
    {   id: '1',
        image: 'assets/images/temp_cover.png',
        name: 'Nombre del Álbum 1',
        artist: 'Artista del Álbum 1'
    },
    {   id: '2',
        image: 'assets/images/temp_cover.png',
        name: 'Nombre del Álbum 2',
        artist: 'Artista del Álbum 2'
    },
    {   id: '3',
        image: 'assets/images/temp_cover.png',
        name: 'Nombre del Álbum 3',
        artist: 'Artista del Álbum 3'
    },
    {   id: '4',
        image: 'assets/images/temp_cover.png',
        name: 'Nombre del Álbum 4',
        artist: 'Artista del Álbum 4'
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
