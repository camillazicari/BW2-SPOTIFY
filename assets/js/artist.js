const newUrl = new URLSearchParams(window.location.search);
const albumId = newUrl.get('_id');
const urlArtista = `https://striveschool-api.herokuapp.com/api/deezer/artist/`
const restoUrl = '/top?limit=10';
let artist;
let ascoltatori;
const backgroundArtist = document.getElementById('backgroundArtist');
const nomeArtista = document.getElementById('nomeArtista');
const ascoltatoriMensili = document.getElementById('ascoltatoriMensili');
const totalTimeLabel = document.getElementById("total-time");
const progressBar = document.getElementById("progress-bar");
const currentTimeLabel = document.getElementById("current-time");
const btnCiccio = document.getElementById('btnCiccio');
const btnSegui = document.getElementById('btnSegui');

let currentTrackIndex = 0;
let audio = new Audio();

async function getAlbum() {
    try {
        let response = await fetch(urlArtista + albumId + restoUrl);
        if (!response.ok) throw new Error("Errore nel recupero degli album");
        artist = await response.json();
        printSongs();
    } catch (error) {
        console.log("Errore durante il recupero dell'album: ", error);
    }
}

function printSongs() {
    const tracks = artist.data;
    console.log(tracks);
    for (let i = 0; i < tracks.length; i++) {
        const ol = document.getElementById('ol');
        let col = `                    
                    <li class="mx-1 lineaGialla" id="btnSongTitle">
                        <div class="row justify-content-between">
                            <div class="card col-6 bg-transparent ms-3 my-2 border-0">
                            <div class="row g-0">
                              <div class="col-4 col-xl-2 d-flex align-items-center">
                                <img src="${tracks[i].album.cover_medium}" class="img-fluid rounded-3" alt="...">
                              </div>
                              <div class="col-8 align-self-center">
                                <div class="card-body">
                                  <button type="button" class="border-0 bg-transparent card-title text-white m-0 playMusicHover text-start">${tracks[i].title}</button>
                                </div>
                              </div>
                            </div>
                          </div>
                            <div class="col-3 text-end align-self-center me-3">
                                <button type="button" class="border-0 bg-transparent text-secondary p-0 fs-5" id="btnHeart"><i class="bi bi-heart"></i></button>
                            </div>
                        </div>
                    </li>`

        ol.innerHTML += col;
    }


    const playerImg = document.getElementById('playerImg');
    const btnSongTitle = document.querySelectorAll('#btnSongTitle');

    for (let i = 0; i < btnSongTitle.length; i++) {
        btnSongTitle[i].addEventListener('click', (e) => {
            e.preventDefault();
            playerImg.setAttribute('src', tracks[i].album.cover_big);
            currentTrackIndex = i; // Aggiorna l'indice del brano corrente
            updateFooter(tracks[currentTrackIndex]);
        });
    }

    function updateFooter(track) {
        document.getElementById("song-title").innerText = track.title;
        document.getElementById("artist-name").innerText = track.artist.name;

        playerImg.setAttribute('src', track.album.cover_big);
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


    document.getElementById("volume-control").addEventListener("input", (e) => {
        audio.volume = e.target.value / 100;
    });

    btnCiccio.addEventListener('click', (e) => {
        e.preventDefault();
        updateFooter(tracks[currentTrackIndex]);
    })

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

}

getAlbum();

async function getAscoltatori() {
    try {
        let response = await fetch(urlArtista + albumId);
        if (!response.ok) throw new Error("Errore nel recupero degli album");
        ascoltatori = await response.json();
        printAscoltatori();
        window.addEventListener('scroll', function() {
            if (window.scrollY > 400) {
                btnSegui.classList.add('text-transition');
                btnSegui.classList.remove('border');
                btnSegui.classList.add('border-0');
                btnSegui.innerHTML = `<p class="titoloScroll m-0">${ascoltatori.name}</p>`;
                
            } else {
                btnSegui.classList.add('border');
                btnSegui.classList.remove('border-0');
                btnSegui.classList.remove('text-transition');
                btnSegui.innerText = 'Segui';
            }
        }); 
    } catch (error) {
        console.log("Errore durante il recupero dell'album: ", error);
    }
}

function printAscoltatori() {
    backgroundArtist.setAttribute('src', ascoltatori.picture_xl);
    nomeArtista.innerText = ascoltatori.name;
    ascoltatoriMensili.innerText = `${ascoltatori.nb_fan} ascoltatori mensili`;
}

getAscoltatori();


document.addEventListener("DOMContentLoaded", function() {
    const toggleButton = document.getElementById("toggleButton");

    let isExpanded = false;

    toggleButton.addEventListener("click", function() {
      if (isExpanded) {
        // Contrai la lista
        ol.style.maxHeight = "520px";  // Imposta una altezza massima per nascondere la lista
        toggleButton.textContent = "Mostra di più";  // Cambia il testo del bottone
        isExpanded = false;
      } else {
        // Espandi la lista
        ol.style.maxHeight = "none";  // Rimuovi il limite di altezza
        toggleButton.textContent = "Mostra meno";  // Cambia il testo del bottone
        isExpanded = true;
      }
    });
  });

