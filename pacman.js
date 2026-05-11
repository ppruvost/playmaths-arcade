const pacman = document.getElementById("pacman");
const ghost = document.getElementById("ghost");
const clickBox = document.getElementById("clickBox");
const music = document.getElementById("bgMusic");
const dotsContainer = document.getElementById("dots");
const track = document.getElementById("track");

let pacmanX = 30;
let pausedAtClick = false;
let clickTriggered = false;

const stopPosition = track.offsetWidth * 0.68;
const colors = ["turquoise", "red", "gray", "violet"];
let colorIndex = 0;

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

function animateGhostColor() {
  setInterval(() => {
    colorIndex = (colorIndex + 1) % colors.length;
    ghost.style.background = colors[colorIndex];
  }, 700);
}

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

clickBox.addEventListener("click", () => {
  clickTriggered = true;
  pausedAtClick = false;
  clickBox.classList.add("hidden");

  music.play().catch(() => {
    console.log("Lecture audio bloquée par le navigateur jusqu'à interaction utilisateur.");
  });
});

window.addEventListener("resize", createDots);

createDots();
regenerateDots();
animateGhostColor();
moveCharacters();
