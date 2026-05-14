const pacman = document.getElementById("pacman");
const ghost = document.getElementById("ghost");
const clickBox = document.getElementById("clickBox");
const music = document.getElementById("bgMusic");
const dotsContainer = document.getElementById("dots");
const track = document.getElementById("track");

let pacmanX = 30;
let ghostX = 0;
let running = false;

const speed = 2;

/* =========================
   MUSIC
========================= */

function startGame() {
  if (running) return;
  running = true;

  music.play().catch(() => {});

  clickBox.style.display = "none";
}

/* =========================
   DOTS
========================= */

function createDots() {
  dotsContainer.innerHTML = "";

  const spacing = 30;
  const count = Math.floor(track.offsetWidth / spacing);

  for (let i = 0; i < count; i++) {
    const dot = document.createElement("div");
    dot.className = "dot";
    dot.style.left = i * spacing + "px";
    dotsContainer.appendChild(dot);
  }
}

/* =========================
   COLLISION DOTS
========================= */

function eatDots() {
  const dots = document.querySelectorAll(".dot");

  dots.forEach(dot => {
    const dotX = dot.offsetLeft;

    if (Math.abs(dotX - pacmanX) < 20) {
      dot.remove();
    }
  });
}

/* =========================
   LOOP
========================= */

function loop() {
  if (running) {
    pacmanX += speed;
    ghostX = pacmanX - 100;

    const maxX = track.offsetWidth - 70;

    if (pacmanX > maxX) pacmanX = 30;

    pacman.style.left = pacmanX + "px";
    ghost.style.left = ghostX + "px";

    eatDots();
  }

  requestAnimationFrame(loop);
}

/* =========================
   INIT
========================= */

clickBox.addEventListener("click", startGame);

window.addEventListener("resize", createDots);

createDots();
loop();
