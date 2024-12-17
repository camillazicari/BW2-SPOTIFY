const apiUrl = "https://striveschool-api.herokuapp.com/api/deezer/album/75621062";

let audio = new Audio();
let currentTrackIndex = 0;
let tracks = [];

const progressBar = document.getElementById("progress-bar");
const currentTimeLabel = document.getElementById("current-time");
const totalTimeLabel = document.getElementById("total-time");

async function fetchMusicData() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Errore nel recupero dei dati");

    const data = await response.json();
    tracks = data.tracks.data;

    // Aggiorna il footer con il primo brano
    updateFooter(tracks[currentTrackIndex]);
  } catch (error) {
    console.error("Errore:", error);
  }
}

// Converte secondi in formato min:sec
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Aggiorna il footer con le informazioni del brano
function updateFooter(track) {
  document.getElementById("song-title").innerText = track.title;
  document.getElementById("artist-name").innerText = track.artist.name;

  totalTimeLabel.innerText = formatTime(track.duration); // Durata totale
  progressBar.max = track.duration; // Imposta il massimo valore della barra

  playMusic(track.preview); 
}

// Riproduzione di un brano
function playMusic(url) {
  audio.src = url;
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

fetchMusicData();