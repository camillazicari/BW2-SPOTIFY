const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

let artist;
const coverRandom = document.getElementById('coverRandom');
const albumRandom = document.getElementById('albumRandom');
const titoloRandom = document.getElementById('titoloRandom');
const artistaRandom = document.getElementById('artistaRandom');
const btnPlayRandom = document.getElementById('btnPlayRandom');
let audio = new Audio();
const progressBar = document.getElementById("progress-bar");
const currentTimeLabel = document.getElementById("current-time");
const totalTimeLabel = document.getElementById("total-time");

const artista = Math.floor(Math.random() * 10) + 1;
const url = `https://striveschool-api.herokuapp.com/api/deezer/artist/${artista}/top?limit=1`;

async function getArtist() {
    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error("Errore nel recupero dei dati");
        data = await response.json();
        artist = data;
        printSong();
    } catch (error) {
        console.log(error);
    }
}
function printSong() {
    coverRandom.setAttribute('src', artist.data[0].album.cover_medium);
    albumRandom.innerHTML = artist.data[0].album.title;
    titoloRandom.innerHTML = artist.data[0].title;
    artistaRandom.innerHTML = artist.data[0].artist.name;
}

getArtist();


btnPlayRandom.addEventListener('click', (e) => {
    e.preventDefault();
    updateFooter();
})

// * PLAYER AUDIO

// Converte secondi in formato min:sec
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Aggiorna il footer con le informazioni del brano
function updateFooter() {
    document.getElementById("song-title").innerText = artist.data[0].album.title;
    document.getElementById("artist-name").innerText = artist.data[0].artist.name;

    totalTimeLabel.innerText = formatTime(artist.data[0].duration); // Durata totale
    progressBar.max = artist.data[0].duration; // Imposta il massimo valore della barra

    playMusic();
}

// Riproduzione di un brano
function playMusic() {
    audio.src = artist.data[0].preview;
    audio.play();

    // pulsante Play in Pause
    const playButton = document.querySelector(".btn-play i");
    playButton.classList.remove("fa-play");
    playButton.classList.add("fa-pause");
}

// Pausa
function pauseMusic() {
    audio.pause();

    //pulsante Pause in Play
    const playButton = document.querySelector(".btn-play i");
    playButton.classList.remove("fa-pause");
    playButton.classList.add("fa-play");
}

audio.addEventListener("ended", () => {
    nextTrack();
});
// Passa al brano successivo
function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    updateFooter(tracks[currentTrackIndex]);
}

// Torna al brano precedente
function previousTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    updateFooter(tracks[currentTrackIndex]);
}

// Gestione del volume
document.getElementById("volume-control").addEventListener("input", (e) => {
    audio.volume = e.target.value / 100;
});

// Event listeners per i pulsanti
document.querySelector(".btn-play").addEventListener("click", () => {
    if (audio.paused) {
        playMusic(audio.src);
    } else {
        pauseMusic();
    }
});

document.querySelector(".btn-next").addEventListener("click", nextTrack);
document.querySelector(".btn-previous").addEventListener("click", previousTrack);

//aggiornamento per la barra e il timer
audio.addEventListener("timeupdate", () => {
    progressBar.value = audio.currentTime;
    currentTimeLabel.innerText = formatTime(audio.currentTime);
});

// Salto traccia tramite la barra di avanzamento
progressBar.addEventListener("input", () => {
    audio.currentTime = progressBar.value;
});

//fetchMusicData();

//   const btnAlbum = document.getElementById('btnAlbum');
//   const titoloAlbum = document.getElementById('titoloAlbum');
//   const artistaAlbum = document.getElementById('artistaAlbum');
let id = [75621062, 1346746, 352412657, 15103893, 6157080, 286549802];
let idRandom = id[Math.floor(Math.random() * id.length)];
let album;
url2 = `https://striveschool-api.herokuapp.com/api/deezer/album/${idRandom}`;


async function getSongs() {
    try {
        let fetchPromises = id.map(async (idRandom) => {
            const url = `https://striveschool-api.herokuapp.com/api/deezer/album/${idRandom}`;
            let response = await fetch(url);
            if (!response.ok) throw new Error(`Errore nel recupero dei dati per ID: ${idRandom}`);
            return response.json();
        });

        let albums = await Promise.all(fetchPromises);

        console.log('RISPOSTE PER TUTTI GLI ALBUM:', albums);
        albums.forEach((album, index) => {
            const row = document.getElementById('row');

            let colAlbum = `<div class="card backgroundMain" style="width: 18rem;">
                            <div class="position-relative" id="playlist">
                                <img  width="80%" class="rounded-2 card-img-top" src="${album.cover_big}"/>
                                <button type="button" class="btn rounded-circle greenSpotify border-0 position-absolute bottom-0 end-0 m-2" id="btnGreenPlay"><i class="bi bi-play-fill fs-3 ps-1 text-black"></i></button>
                            </div>    
                                <div class="card-body">
                                    <p class="mx-2 mb-0 fs-6 text-white" id="titoloAlbum">${album.title}</p>
                                    <p class="mx-2 my-0 text-white-50" id="artistaAlbum">${album.artist.name}</p>  
                                </div>
                            </div>`
            row.innerHTML += colAlbum;
        });
    } catch (error) {
        console.log('Errore durante il recupero degli album:', error);
    }
}

getSongs();



// function printAlbum() {
//     const row = document.getElementById('row');
//     for (let i = 0; i < albums.length; i++) {
//         let album1 = [albums[i].artist.name, albums[i].artist.picture_big, albums[i].title]
//         let colAlbum = `
//     <div class="col-md-4">
//         <button type="button" class="border-0 bg-transparent" id="btnAlbum">
//                     <img
//                       class="rounded-2"
//                       src="${album1[1]}"
//                     /><!--immagine del disco-->
//                   </button>
//                   <p class="mx-2 mb-0" id="titoloAlbum">${album1[2]}</p>
//                   <p class="mx-2 my-0" id="artistaAlbum">${album1[0]}</p>
//     </div>
//     `
//     row.innerHTML += colAlbum;
// }
// }


