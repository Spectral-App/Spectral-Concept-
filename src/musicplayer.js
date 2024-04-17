document.addEventListener('DOMContentLoaded', function() {
    let PROGRESS = document.getElementById('SONGPOS');
    let SONG = document.getElementById('SONG');
    let CONTROLSONG = document.getElementById('CONTROLSONG');
    let controlIcon = CONTROLSONG.querySelector('img')

    SONG.onloadedmetadata = function (){
        PROGRESS.max = SONG.duration;
        PROGRESS.value= SONG.currentTime;
    }

    function tooglePlay(){
        if (SONG.paused) {
            controlIcon.src = 'assets/icons/pause.svg';
            SONG.play();
        } else {
            controlIcon.src = 'assets/icons/play.svg';
            SONG.pause();
        }
    }

    let value
    if(SONG.play()){
        setInterval(()=>{
            PROGRESS.value = SONG.currentTime;
            value = (PROGRESS.value - PROGRESS.min) / (PROGRESS.max - PROGRESS.min) * 100;
            PROGRESS.style.background = 'linear-gradient(to right, #2B78F7 0%, #2B78F7 ' + value + '%, #FFFFFF ' + value + '%, #FFFFFF 100%)';
        },500)
    }

    PROGRESS.onchange = function(){
        SONG.play();
        SONG.currentTime = PROGRESS.value;
        controlIcon.src = 'assets/icons/pause.svg';
    }

    SONG.pause()
    CONTROLSONG.addEventListener('click', tooglePlay);
});
