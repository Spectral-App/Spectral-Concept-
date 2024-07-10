document.addEventListener('DOMContentLoaded', function() {
    // metadata de la cancion
    let SONG = document.getElementById('SONG');
    let SONG_NAME = document.getElementById('SONG_NAME');
    let SONG_ARTIST = document.getElementById('SONG_ARTIST');
    let SONG_COVER = document.getElementById('SONG_COVER');
    let SONG_CURRTIME = document.getElementById('SONG_CURRTIME');
    let SONG_DURATION = document.getElementById('SONG_DURATION');

    //botones necesarios para manejar el reproductor
    let PREVIOUS_BUTTON = document.getElementById('PREV_BUTTON');
    let TOGGLE_PLAY = document.getElementById('TOGGLE_PLAY');
    let NEXT_BUTTON = document.getElementById('NEXT_BUTTON');

    //datos para que funcionen otras cosas necesarias del reproductor
    let PLAYER_PROGRESS = document.getElementById('PLAYER_PROGRESS');
    let controlIcon = TOGGLE_PLAY.querySelector('img');

    //esta variable se llena sola segun a lo que le des play, tu libreria, etc
    //TODO: HACERLA FUNCIONAL, X AHORA SOLO FUNCIONA CON LAS CANCIONES MANUALMENTE PUESTAS, SOLO PARA LA PRUEBA
    const SONGLIST = [
        {   id: '1',
            image: 'https://upload.wikimedia.org/wikipedia/en/0/09/Twice_-_Fancy_You.png',
            name: 'FANCY YOU',
            artist: 'TWICE',
            file: 'https://cdn.discordapp.com/attachments/864053779061932063/1230038202874597418/fancy.mp3?ex=6631dd58&is=661f6858&hm=0998d07202c3918aa5559ac51d3a0111d418a5e61dcb4697cad05b439da9c40c&'
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
    ]
    
    function togglePlay(){
        if (SONG.paused) {
            controlIcon.src = 'assets/icons/pause.svg';
            SONG.play();
        } else {
            controlIcon.src = 'assets/icons/play.svg';
            SONG.pause();
        }
    }

    function updateMetadata(NEWSONG_NAME, NEWSONG_ARTIST, NEWSONG_COVER) {
        //SONG.src = NEWSONG;
        SONG_NAME.innerHTML = NEWSONG_NAME
        SONG_ARTIST.innerHTML = NEWSONG_ARTIST
        SONG_COVER.src = NEWSONG_COVER
    }

    function updateDuration(){
        const duration = SONG.duration;
        const totalMinutes = Math.floor(duration / 60);
        const totalSeconds = Math.floor(duration % 60);
        const totalTime = `${totalMinutes}:${totalSeconds.toString().padStart(2, '0')}`;
        SONG_DURATION.textContent = `${totalTime}`;
        PLAYER_PROGRESS.max = SONG.duration;
        PLAYER_PROGRESS.value= SONG.currentTime;
    }

    function updateCurrTime(){
        const currentTime = SONG.currentTime;
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60);
        SONG_CURRTIME.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    let value
    function updateProgressbar() {
        value = (PLAYER_PROGRESS.value - PLAYER_PROGRESS.min) / (PLAYER_PROGRESS.max - PLAYER_PROGRESS.min) * 100;
        PLAYER_PROGRESS.style.background = 'linear-gradient(to right, #2B78F7 0%, #2B78F7 ' + value + '%, #FFFFFF ' + value + '%, #FFFFFF 100%)';
    }

    if(SONG.play()){
        setInterval(()=>{
            PLAYER_PROGRESS.value = SONG.currentTime;

            updateProgressbar();
            updateCurrTime()
        },500)
    }

    PLAYER_PROGRESS.onchange = function(){
        SONG.play();
        SONG.currentTime = PLAYER_PROGRESS.value;
        controlIcon.src = 'assets/icons/pause.svg';
    }

    SONG.pause()
    updateDuration()
    updateMetadata('FANCY', 'TWICE', 'https://upload.wikimedia.org/wikipedia/en/0/09/Twice_-_Fancy_You.png')
    TOGGLE_PLAY.addEventListener('click', togglePlay);
    PLAYER_PROGRESS.addEventListener('input', updateProgressbar)
});
