const pacman = document.getElementById("pacman");
const ghost = document.getElementById("ghost");
const clickBox = document.getElementById("clickBox");
const cube = document.getElementById("musicCube");
const music = document.getElementById("bgMusic");
const dotsContainer = document.getElementById("dots");
const track = document.getElementById("track");

let pacmanX = 30;
let pausedAtClick = false;
let clickTriggered = false;
let musicStarted = false;

const stopPosition = track.offsetWidth * 0.68;
const colors = ["turquoise", "red", "gray", "violet"];
let colorIndex = 0;

/* =========================
   MUSIQUE (centralisé)
========================= */

function startMusic() {
  if (musicStarted) return;

  musicStarted = true;

  music.play().catch(() => {
    console.log("Lecture audio bloquée par le navigateur.");
  });

  // disparition des éléments de lancement
  if (cube) cube.classList.add("hidden");
  if (clickBox) clickBox.classList.add("hidden");
}

/* =========================
   CUBE CLICK
========================= */

if (cube) {
  cube.addEventListener("click", startMusic);
}

/* =========================
   CLICK BOX
========================= */

clickBox.addEventListener("click", () => {
  clickTriggered = true;
  pausedAtClick = false;

  startMusic();
});

/* =========================
   DOTS
========================= */

function createDots() {
  dotsContainer.innerHTML = "";

  const totalDots = Math.floor(track.offsetWidth / 34);

  for (let i = 0; i < totalDots; i++) {
    const dot = document.createElement("div");
    dot.className = "dot";
    dotsContainer.appendChild(dot);
  }
}

function regenerateDots() {
  setInterval(() => {
    createDots();
  }, 4000);
}

/* =========================
   GHOST COLOR
========================= */

function animateGhostColor() {
  setInterval(() => {
    colorIndex = (colorIndex + 1) % colors.length;
    ghost.style.background = colors[colorIndex];
  }, 700);
}

/* =========================
   MOVEMENT
========================= */

function moveCharacters() {
  setInterval(() => {
    if (!pausedAtClick) {
      pacmanX += 2;

      if (!clickTriggered && pacmanX >= stopPosition) {
        pacmanX = stopPosition;
        pausedAtClick = true;
      }
    }

    const ghostX = Math.max(0, pacmanX - 90);

    pacman.style.left = pacmanX + "px";
    ghost.style.left = ghostX + "px";
  }, 30);
}

/* =========================
   INIT
========================= */

window.addEventListener("resize", createDots);

createDots();
regenerateDots();
animateGhostColor();
moveCharacters();
