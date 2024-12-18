const urlAlbum = `https://striveschool-api.herokuapp.com/api/deezer/album/`;
const newUrl = new URLSearchParams(window.location.search);
const albumId = newUrl.get('_id');
console.log(albumId);
let albums;
const coverRandom = document.getElementById('coverRandom');
const titoloRandom = document.getElementById('titoloRandom');
const miniImg = document.getElementById('miniImg');
const miniArtist = document.getElementById('miniArtist');
const numeroBrani = document.getElementById('numeroBrani');
const durataAlbum = document.getElementById('durataAlbum');
const totalTimeLabel = document.getElementById("total-time");
const progressBar = document.getElementById("progress-bar");
const currentTimeLabel = document.getElementById("current-time");
const playerImg = document.getElementById('playerImg');
const linkToArtist = document.getElementById('linkToArtist');

let currentTrackIndex = 0;
let audio = new Audio();



async function getAlbum() {
    try {
        let response = await fetch(urlAlbum + albumId);
        if (!response.ok) throw new Error("Errore nel recupero dei prodotti");
        albums = await response.json();
        printSongs();
        console.log("Album recuperato:", albums);
    } catch (error) {
        console.log("Errore durante il recupero dell'album: ", error);
    }
}

function printSongs() {
    coverRandom.setAttribute('src', albums.cover_medium);
    titoloRandom.innerHTML = albums.title;
    miniArtist.innerHTML = albums.artist.name;
    miniImg.setAttribute('src', albums.artist.picture_small);
    numeroBrani.innerHTML = albums.nb_tracks + ' brani';
    const seconds = albums.duration;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    durataAlbum.innerHTML = `circa ${hours} h e ${minutes} min`;
    printTracks();
}

function printTracks() {
    const tracks = albums.tracks.data;
    for (let i = 0; i < tracks.length; i++) {
        const row = document.getElementById('row');
        const seconds = (tracks[i].duration % 60);
        const minutes = Math.floor((seconds % 3600) / 60);
        let colTracks = `
        <li class="lineaColorata">
        <div class="row" id="row">
            <div class="mb-3 col-6 bg-transparent d-flex flex-column align-items-start pt-4">
                <button class="border-0 bg-transparent p-0 ps-2" id="btnSongTitle"><h5 class="text-white playMusicHover">${tracks[i].title}</h5></button>
                <button class="border-0 bg-transparent p-0 ps-2" id="btnArtistiName"><p class="text-secondary playMusicHover">${tracks[i].artist.name}</p></button>
            </div>
            <div class="mb-3 col-5 bg-transparent text-end align-self-center text-secondary fw-light">
            <p>${minutes} min ${seconds} sec</p>
            </div>
        </li>`

        row.innerHTML += colTracks;
        playerImg.setAttribute('src', tracks[i].album.cover_big);

    }

    const btnSongTitle = document.querySelectorAll('#btnSongTitle');

    for (let i = 0; i < btnSongTitle.length; i++) {
        btnSongTitle[i].addEventListener('click', (e) => {
            e.preventDefault();
            currentTrackIndex = i; // Aggiorna l'indice del brano corrente
            updateFooter(tracks[currentTrackIndex]);
        });
    }
    
    function updateFooter(track) {
        document.getElementById("song-title").innerText = track.title;
        document.getElementById("artist-name").innerText = track.artist.name;

        totalTimeLabel.innerText = formatTime(track.duration); // Durata totale
        progressBar.max = track.duration; // Imposta il massimo valore della barra
        playMusic(track.preview);
    }
    
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    }
    
    function playMusic(previewUrl) {
        audio.src = previewUrl;
        const playButton = document.querySelector(".btn-play i");
        playButton.classList.remove("fa-play");
        playButton.classList.add("fa-pause");
        audio.play();
    }
    
    function pauseMusic() {
        audio.pause();
        const playButton = document.querySelector(".btn-play i");
        playButton.classList.remove("fa-pause");
        playButton.classList.add("fa-play");
    }
    
    // Aggiungi listener al pulsante di play/pausa una sola volta
    document.querySelector(".btn-play").addEventListener("click", (e) => {
        e.preventDefault();
        if (audio.paused) {
            playMusic(audio.src);
        } else {
            pauseMusic();
        }
    });
    
    // Passa al brano successivo
    document.querySelector(".btn-next").addEventListener("click", nextTrack);
    document.querySelector(".btn-previous").addEventListener("click", previousTrack);
    
    function nextTrack() {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        updateFooter(tracks[currentTrackIndex]);
    }
    
    function previousTrack() {
        currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        updateFooter(tracks[currentTrackIndex]);
    }
    
    // Passa automaticamente al prossimo brano quando termina
    audio.addEventListener("ended", () => {
        nextTrack();
    });
    
    document.getElementById("volume-control").addEventListener("input", (e) => {
        audio.volume = e.target.value / 100;
    });
    

    const btnArtistiName = document.querySelectorAll('#btnArtistiName');
    for (let i = 0; i < btnArtistiName.length; i++) {
        btnArtistiName[i].addEventListener('click', (e) => {
            e.preventDefault();
            let firstUrl = 'artist.html';
            let artistUrl = `${firstUrl}?_id=${tracks[i].artist.id}`;
            window.location.href = artistUrl;
        })
    }

    linkToArtist.addEventListener('click', (e) => {
        e.preventDefault();
        let firstUrl = 'artist.html';
            let artistUrl = `${firstUrl}?_id=${tracks[0].artist.id}`;
            window.location.href = artistUrl;
    })

}

getAlbum();
