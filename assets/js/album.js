const urlAlbum = `https://striveschool-api.herokuapp.com/api/deezer/album/`;
const urlArtista = `https://striveschool-api.herokuapp.com/api/deezer/artist/`
const restoUrl = '/top?limit=50';
const newUrl = new URLSearchParams(window.location.search);
const albumId = newUrl.get('_id');
let albums;
let resp;
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
const btnCiccio = document.getElementById('btnCiccio');
const row2 = document.getElementById('row2');
const btnPlus = document.querySelector('.btnPlus');
const stickyAlbum = document.getElementById('stickyAlbum');

let currentTrackIndex = 0;
let audio = new Audio();



async function getAlbum() {
    try {
        let response = await fetch(urlAlbum + albumId);
        if (!response.ok) throw new Error("Errore nel recupero degli album");
        albums = await response.json();
        printSongs();
        async function getForAlbum() {
            let idArtista = albums.artist.id;
            try {
                let response = await fetch(urlArtista + idArtista + restoUrl);
                if (!response.ok) throw new Error("Errore nel recupero degli album");
                resp = await response.json();
                console.log(resp);
                printOtherAlbums();
            } catch (error) {
                console.log("Errore durante il recupero dell'album: ", error);
            }
        }
        getForAlbum();
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 210) {
                btnPlus.classList.add('text-transition');
                btnPlus.innerHTML = `<p class="titoloScroll text-white m-0">${albums.title}</p>`;
                stickyAlbum.classList.add('stickyMagenta')
            } else {
                btnPlus.classList.remove('text-transition');
                btnPlus.innerHTML = `<i class="bi bi-plus-circle fs-2 fw-bold text-white opacity-75"></i>`;
                stickyAlbum.classList.remove('stickyMagenta')
            }
        });        

        console.log("Album recuperato:", albums);
    } catch (error) {
        console.log("Errore durante il recupero dell'album: ", error);
    }
}

function printOtherAlbums() {
    let ids = [];
    for (let i = 0; i < resp.data.length; i++) {
        ids.push(resp.data[i].album.id);
    }

    let uniqueIds = [...new Set(ids)];
    console.log(uniqueIds);
    let idRandom = uniqueIds[Math.floor(Math.random() * uniqueIds.length)];
    async function getPerLennesimaVolta() {
        try {
            let fetchPromises = uniqueIds.map(async (idRandom) => {
                const url = `https://striveschool-api.herokuapp.com/api/deezer/album/${idRandom}`;
                let response = await fetch(url);
                if (!response.ok) throw new Error(`Errore nel recupero dei dati per ID: ${idRandom}`);
                return response.json();
            });

            let albums = await Promise.all(fetchPromises);

            console.log('RISPOSTE PER TUTTI GLI ALBUM:', albums);
            for (let i = 0; i < albums.length; i++) {
                const row2 = document.getElementById('row2');

                let colAlbum = `<div class="card bg-transparent border-0 col-3">
                                <div class="position-relative" id="playlist">
                                    <img  width="80%" class="rounded-2 card-img-top" src="${albums[i].cover_big}" id="albumCover"/>
                                </div>    
                                    <div class="card-body">
                                        <p class="mx-2 mb-0 fs-6 text-white" id="titoloAlbum">${albums[i].title}</p>
                                        <button type="button" class="border-0 bg-transparent mx-2 my-0 text-white-50 p-0 playMusicHover" id="artistaAlbum">${albums[i].artist.name}</button>  
                                    </div>
                                </div>`
                row2.innerHTML += colAlbum;

                const albumCover = document.querySelectorAll('#albumCover');
                for (let i = 0; i < albumCover.length; i++) {
                    albumCover[i].addEventListener('click', (e) => {
                        e.preventDefault();
                        let firstUrl = 'album.html';
                        let newUrl = `${firstUrl}?_id=${albums[i].id}`;
                        window.location.href = newUrl;
                    })
                }
            };

            const artistaAlbum = document.querySelectorAll('#artistaAlbum');
            for (let i = 0; i < artistaAlbum.length; i++) {
                artistaAlbum[i].addEventListener('click', (e) => {
                    e.preventDefault();
                    let firstUrl = 'artist.html';
                    let artistUrl = `${firstUrl}?_id=${albums[i].artist.id}`;
                    window.location.href = artistUrl;
                })
            }

        } catch (error) {
            console.log('Errore durante il recupero degli album:', error);
        }
    }

    getPerLennesimaVolta()
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
        <li>
        <div class="row lineaMagenta w-100" id="row">
            <div class="mb-3 col-6 bg-transparent d-flex flex-column align-items-start pt-4">
                <button class="border-0 bg-transparent p-0 ps-3" id="btnSongTitle"><h6 class="text-white playMusicHover text-start">${tracks[i].title}</h6></button>
                <button class="border-0 bg-transparent p-0 ps-3" id="btnArtistiName"><p class="text-white opacity-75 playMusicHover">${tracks[i].artist.name}</p></button>
            </div>
            <div class="mb-3 col-6 bg-transparent text-end align-self-center text-white opacity-75 fw-light">
            <div class="row justify-content-end">
            <div class="col-3">
            <button type="button" class="border-0 bg-transparent text-white opacity-75 p-0 fs-5" id="btnHeart"><i class="bi bi-heart"></i></button>
            </div>
            <div class="col-3">
            <p>${minutes} min ${seconds} sec</p>
            </div>
            </div>
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

    //aggiornamento per la barra e il timer
    audio.addEventListener("timeupdate", () => {
        progressBar.value = audio.currentTime;
        currentTimeLabel.innerText = formatTime(audio.currentTime);
    });

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

    btnCiccio.addEventListener('click', (e) => {
        e.preventDefault();
        updateFooter(tracks[currentTrackIndex]);
    })

    document.getElementById("volume-control").addEventListener("input", (e) => {
        audio.volume = e.target.value / 100;
    });

    const btnHeart = document.querySelectorAll('#btnHeart i')

    // Funzione per gestire il click
    function toggleHeart(e) {
        e.preventDefault(); // Evita comportamenti predefiniti

        const btn = e.currentTarget; // Ottieni il bottone cliccato
        if (btn.classList.contains('bi-heart')) {
            // Se ha la classe 'bi-heart', cambiala in 'bi-heart-fill'
            btn.classList.remove('bi-heart');
            btn.classList.add('bi-heart-fill');
        } else if (btn.classList.contains('bi-heart-fill')) {
            // Se ha la classe 'bi-heart-fill', cambiala in 'bi-heart'
            btn.classList.remove('bi-heart-fill');
            btn.classList.add('bi-heart');
        }
    }

    // Aggiungi il listener di click a ciascun bottone
    btnHeart.forEach((btn) => {
        btn.addEventListener('click', toggleHeart);
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


// il search inizia da qui

const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searchResultsContainer = document.getElementById("search-results");
const navForm = document.getElementById('navForm');

async function searchSongs(query) {
    const searchUrl = `https://striveschool-api.herokuapp.com/api/deezer/search?q=${encodeURIComponent(query)}`;

    try {
        const response = await fetch(searchUrl);
        if (!response.ok) throw new Error("Errore nella ricerca");

        const data = await response.json();
        console.log('CANZONIIIII', data);

        displaySearchResults(data.data);

        displaySearchResults(data.data);
    } catch (error) {
        console.error("Errore nella ricerca:", error);
    }
}


function displaySearchResults(songs) {

    if (songs.length > 0) {

        searchResultsContainer.innerHTML = "";

        for (let i = 0; i < songs.length; i++) {
            const songElement = document.createElement("div");

            songElement.innerHTML = `
<div class="card mb-3 bg-transparent text-white border-0" id="searchCard">
      <div class="row g-0 align-items-center">
        <div class="col-3">
          <img
            src="${songs[i].album.cover_big}"
            alt="Album Cover"
            class="me-3 rounded-2 w-100"
            id="searchAlbum"
          />
        </div>
        <div class="col-9">
          <div class="card-body py-0">
            <div class="row align-items-center justify-content-between">
              <div class="col-9 align-self-center">
                <p class="mb-1 fontSmallArtist">
                  <strong id="searchTitle">${songs[i].title}</strong> <br/>
                  <span class="fst-italic" id="searchArtist">${songs[i].artist.name}</span>
                </p>
                <p class="m-0 fontArtisti" id="pointerAlbum">${songs[i].album.title}</p>
              </div>
              <div class="col-2 p-0">
                <button
                  class="btn rounded-circle btn-outline-light btn-sm play-song-btn"
                  style="width: 40px; height:40px"
                  data-preview="${songs[i].preview}"
                  data-title="${songs[i].title}"
                  data-artist="${songs[i].artist.name}"
                >
                  <i class="fas fa-play"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

        `;
            searchResultsContainer.appendChild(songElement);

            const searchAlbum = document.querySelectorAll('#searchAlbum');
            const searchArtist = document.querySelectorAll('#searchArtist');
            const pointerAlbum = document.querySelectorAll('#pointerAlbum');

            for (let i = 0; i < searchAlbum.length; i++) {
                searchAlbum[i].addEventListener('click', (e) => {
                    e.preventDefault();
                    let firstUrl = 'album.html';
                    let newUrl = `${firstUrl}?_id=${songs[i].album.id}`;
                    window.location.href = newUrl;
                })
            }
            for (let i = 0; i < searchArtist.length; i++) {
                searchArtist[i].addEventListener('click', (e) => {
                    e.preventDefault();
                    let firstUrl = 'artist.html';
                    let newUrl = `${firstUrl}?_id=${songs[i].artist.id}`;
                    window.location.href = newUrl;
                })
            }
            for (let i = 0; i < pointerAlbum.length; i++) {
                pointerAlbum[i].addEventListener('click', (e) => {
                    e.preventDefault();
                    let firstUrl = 'album.html';
                    let newUrl = `${firstUrl}?_id=${songs[i].album.id}`;
                    window.location.href = newUrl;
                })
            }

        };
    } else {

        searchResultsContainer.innerHTML = `<div class="alert alert-danger d-flex align-items-center"id="alert"  role="alert">
        <i class="bi bi-exclamation-triangle-fill"></i>
        <div>&nbsp; La tua ricerca non ha prodotto risultati</div>
      </div>`

    }

    document.querySelectorAll(".play-song-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const preview = btn.getAttribute("data-preview");
            const title = btn.getAttribute("data-title");
            const artist = btn.getAttribute("data-artist");

            playSongFromSearch(preview, title, artist);
        });
    });
}


function playSongFromSearch(preview, title, artist) {
    document.getElementById("song-title").innerText = title;
    document.getElementById("artist-name").innerText = artist;
    audio.src = preview;
    audio.play();
    const playButton = document.querySelector(".btn-play i");
    playButton.classList.remove("fa-play");
    playButton.classList.add("fa-pause");
}


searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
        searchSongs(query);
    }
    navForm.reset();
});

