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
const rowArtisti = document.getElementById('rowArtisti');
const rowArtisti2 = document.getElementById('rowArtisti2');

const btnForward = document.getElementById('btnForward');
const btnBack = document.getElementById('btnBack');
const playerBtnForward = document.getElementById('playerBtnForward');
const playerBtnBack = document.getElementById('playerBtnBack');
const playerImg = document.getElementById('playerImg');
const listaRicerca = document.getElementById('listaRicerca');
lista = [];


const artista = Math.floor(Math.random() * 10) + 1;
const url = `https://striveschool-api.herokuapp.com/api/deezer/artist/${artista}/top?limit=1`;

async function getArtist() {
    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error("Errore nel recupero dei dati");
        data = await response.json();
        artist = data;
        console.log(artist);
        printSong();
    } catch (error) {
        console.log(error);
    }
}


function printSong() {
    coverRandom.setAttribute('src', artist.data[0].album.cover_medium);
    albumRandom.innerHTML = artist.data[0].album.title;
    titoloRandom.innerHTML = artist.data[0].title;
    titoloRandom.classList.add('shadowText');
    artistaRandom.classList.add('shadowText');
    albumRandom.classList.add('shadowText');
    artistaRandom.innerHTML = artist.data[0].artist.name;
}

btnForward.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.reload(true);
    getArtist();
    printSong();
})


btnBack.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.reload(true);
    getArtist();
    printSong();
})
getArtist();

btnPlayRandom.addEventListener('click', (e) => {
    e.preventDefault();
    playerImg.setAttribute('src', artist.data[0].album.cover_big)
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
    document.getElementById("song-title").innerText = artist.data[0].title;
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
    updateFooter();
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


let id = [6047452, 75621062, 352412657, 15103893, 6157080, 286549802, 522318972, 1346746, 119606, 49736572, 547520122, 1262014, 68346981, 6155526];
let idRandom = id[Math.floor(Math.random() * id.length)];

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
        for (let i=0; i<albums.length; i++) {
            const row = document.getElementById('row');

            let colAlbum = `<div class="col-3 col-md-5 col-lg-3 card bg-transparent border-0 px-0 pe-3">
                            <div class="position-relative" id="playlist">
                                <img  width="80%" class="rounded-2 card-img-top cursorPointer" src="${albums[i].cover_big}" id="albumCover"/>
                                <button type="button" class="btn rounded-circle greenSpotify border-0 position-absolute bottom-0 end-0 m-2" id="btnGreenPlay"><i class="bi bi-play-fill fs-3 ps-1 text-black"></i></button>
                            </div>    
                                <div class="card-body col-12 px-0">
                                    <p class="mx-2 mb-0 fs-6 text-white" id="titoloAlbum">${albums[i].title}</p>
                                    <p class="mx-2 my-0 text-white-50 playMusicHover cursorPointer" id="artistaAlbum">${albums[i].artist.name}</p>  
                                </div>
                            </div>`
            row.innerHTML += colAlbum;

    const albumCover = document.querySelectorAll('#albumCover');
    for (let i = 0; i < albumCover.length; i++) {
        albumCover[i].addEventListener('click', (e) => {
            e.preventDefault();
            let firstUrl = 'album.html';
            let newUrl = `${firstUrl}?_id=${albums[i].id}`;
            window.location.href = newUrl;
        })
    }

    const artistaAlbum = document.querySelectorAll('#artistaAlbum');
    for (let i = 0; i < artistaAlbum.length; i++) {
        artistaAlbum[i].addEventListener('click', (e) => {
            e.preventDefault();
            let firstUrl = 'artist.html';
            let artistUrl = `${firstUrl}?_id=${albums[i].artist.id}`;
            window.location.href = artistUrl;
        })
    }

        };
    } catch (error) {
        console.log('Errore durante il recupero degli album:', error);
    }
}

getSongs();

// TODO: STAMPA ARTISTI

let idArtisti = [259, 6168800, 892, 1155242, 3315, 75491, 2851, 542, 1176900, 13612387, 2959, 10190528, 12944623, 5648];
 let idArtistiRandom = idArtisti[Math.floor(Math.random() * idArtisti.length)];
 let artisti;
const baseUrlArtisti = `https://striveschool-api.herokuapp.com/api/deezer/artist/`;


async function getArtisti() {
    try {
        let fetchPromises = idArtisti.map(async (id) => {
            let response = await fetch(`${baseUrlArtisti}${id}`); // URL specifico per ciascun artista
            if (!response.ok) throw new Error(`Errore nel recupero dei dati per ID: ${id}`);
            return response.json();
        });
        let artisti = await Promise.all(fetchPromises);

        console.log('RISPOSTE PER TUTTI GLI ARTISTI:', artisti);

        for (let i=0; i<artisti.length; i++) {

            let colArtisti = `<div class="col-3 col-md-5 col-lg-3 card bg-transparent border-0 px-0 pe-3">
                            <div class="position-relative bg-transparent" id="playlist">
                                <img  width="80%" class="rounded-circle card-img-top cursorPointer" src="${artisti[i].picture_big}" id="artistCover"/>
                            </div>    
                                <div class="card-body col-12 px-0 text-center">
                                    <p class="mx-2 my-0 text-white-50 playMusicHover cursorPointer" id="artistAlbum">${artisti[i].name}</p>  
                                </div>
                            </div>`
            rowArtisti.innerHTML += colArtisti;

    const artistCover = document.querySelectorAll('#artistCover');
    for (let i = 0; i < artistCover.length; i++) {
        artistCover[i].addEventListener('click', (e) => {
            e.preventDefault();
            let firstUrl = 'artist.html';
            let newUrl = `${firstUrl}?_id=${artisti[i].id}`;
            window.location.href = newUrl;
        })
    }

    const artistAlbum = document.querySelectorAll('#artistAlbum');
    for (let i = 0; i < artistAlbum.length; i++) {
        artistAlbum[i].addEventListener('click', (e) => {
            e.preventDefault();
            let firstUrl = 'artist.html';
            let newUrl = `${firstUrl}?_id=${artisti[i].id}`;
            window.location.href = newUrl;
        })
    }
 };
    } catch (error) {
        console.log('Errore durante il recupero degli album:', error);
    }
}

getArtisti();





let idArtisti2 = [4138, 108153772, 3, 66, 12436, 9635624, 1147,  196, 1562681, 98, 52115362, 390032, 74398, 927];
 let idArtistiRandom2 = idArtisti2[Math.floor(Math.random() * idArtisti2.length)];
 let artisti2;
const baseUrlArtisti2 = `https://striveschool-api.herokuapp.com/api/deezer/artist/`;


async function getArtisti2() {
    try {
        let fetchPromises = idArtisti2.map(async (id) => {
            let response = await fetch(`${baseUrlArtisti2}${id}`); // URL specifico per ciascun artista
            if (!response.ok) throw new Error(`Errore nel recupero dei dati per ID: ${id}`);
            return response.json();
        });
        let artisti2 = await Promise.all(fetchPromises);

        console.log('RISPOSTE PER TUTTI GLI ARTISTI:', artisti2);

        for (let i=0; i<artisti2.length; i++) {

            let colArtisti = `<div class="col-3 col-md-5 col-lg-3 card bg-transparent border-0 px-0 pe-3">
                            <div class="position-relative bg-transparent" id="playlist">
                                <img  width="80%" class="rounded-circle card-img-top cursorPointer" src="${artisti2[i].picture_big}" id="artistCover2"/>
                            </div>    
                                <div class="card-body col-12 px-0 text-center">
                                    <p class="mx-2 my-0 text-white-50 playMusicHover cursorPointer" id="artistAlbum2">${artisti2[i].name}</p>  
                                </div>
                            </div>`
            rowArtisti2.innerHTML += colArtisti;

    const artistCover2 = document.querySelectorAll('#artistCover2');
    for (let i = 0; i < artistCover2.length; i++) {
        artistCover2[i].addEventListener('click', (e) => {
            e.preventDefault();
            let firstUrl = 'artist.html';
            let newUrl = `${firstUrl}?_id=${artisti2[i].id}`;
            window.location.href = newUrl;
        })
    }

    const artistAlbum2 = document.querySelectorAll('#artistAlbum2');
    for (let i = 0; i < artistAlbum2.length; i++) {
        artistAlbum2[i].addEventListener('click', (e) => {
            e.preventDefault();
            let firstUrl = 'artist.html';
            let newUrl = `${firstUrl}?_id=${artisti2[i].id}`;
            window.location.href = newUrl;
        })
    }
 };
    } catch (error) {
        console.log('Errore durante il recupero degli album:', error);
    }
}

getArtisti2();


// il search iniza da qui

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
      console.log('CANZONIIIII',data);
      
      displaySearchResults(data.data);
    } catch (error) {
      console.error("Errore nella ricerca:", error);
    }
  }
  
  
  function displaySearchResults(songs) {
    searchResultsContainer.innerHTML = "";
    
    for (let i=0; i<songs.length; i++) {
      const songElement = document.createElement("div");
      songElement.className = "d-flex align-items-center my-2";
  
      songElement.innerHTML = `
        <img src="${songs[i].album.cover_small}" alt="Album Cover" class="me-3" id="searchAlbum" style="width: 50px; height: 50px;" />
        <div class="flex-grow-1">
          <p class="mb-0"><strong id="searchTitle">${songs[i].title}</strong> - <span id="searchArtist">${songs[i].artist.name}</span></p>
          <small id="pointerAlbum">${songs[i].album.title}</small>
        </div>
        <button class="btn btn-outline-primary btn-sm play-song-btn" data-preview="${songs[i].preview}" data-title="${songs[i].title}" data-artist="${songs[i].artist.name}">
          <i class="fas fa-play"></i>
        </button>
      `;
      searchResultsContainer.appendChild(songElement);

      const searchAlbum = document.querySelectorAll('#searchAlbum');
      const searchArtist = document.querySelectorAll('#searchArtist');
      const pointerAlbum = document.querySelectorAll('#pointerAlbum');

    for (let i=0; i<searchAlbum.length; i++) {
        searchAlbum[i].addEventListener('click', (e) => {
            e.preventDefault();
            let firstUrl = 'album.html';
            let newUrl = `${firstUrl}?_id=${songs[i].album.id}`;
            window.location.href = newUrl;
        })
    }
    for (let i=0; i<searchArtist.length; i++) {
        searchArtist[i].addEventListener('click', (e) => {
            e.preventDefault();
            let firstUrl = 'artist.html';
            let newUrl = `${firstUrl}?_id=${songs[i].artist.id}`;
            window.location.href = newUrl;
        })
    }
    for (let i=0; i<pointerAlbum.length; i++) {
        pointerAlbum[i].addEventListener('click', (e) => {
            e.preventDefault();
            let firstUrl = 'album.html';
            let newUrl = `${firstUrl}?_id=${songs[i].album.id}`;
            window.location.href = newUrl;
        })
    }

    };
  
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
  
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim();
      if (query) {
  
        searchSongs(query);
      }
    }
  });
 
