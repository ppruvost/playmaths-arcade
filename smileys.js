const smiley = document.getElementById("smiley");
const clickBox = document.getElementById("clickBox");
const bgMusic = document.getElementById("bgMusic");
const itemsContainer = document.getElementById("items");
const track = document.getElementById("track");
const gameOver = document.getElementById("gameOver");

let smileyX = 30;
let running = false;
let currentTarget = 0;
let items = []; // cache DOM (IMPORTANT)

/*
SCÉNARIO
*/

const sequence = [
  "🍌",
  "🍆",
  "🍐",
  "🥬",
  "🍎",
  "🍄",
  "🧅",
  "🥕",
  "💩"
];

/*
START
*/

function startGame() {
  if (running) return;

  running = true;

  if (bgMusic) {
    bgMusic.play().catch(() => {});
  }

  if (clickBox) {
    clickBox.style.display = "none";
  }
}

/*
CRÉATION DES ITEMS
*/

function createItems() {
  itemsContainer.innerHTML = "";

  const spacing = 95;

  sequence.forEach((emoji, index) => {
    const item = document.createElement("div");
    item.className = "item";
    item.innerText = emoji;
    item.style.left = `${140 + index * spacing}px`;

    itemsContainer.appendChild(item);
  });

  // cache DOM pour perf
  items = Array.from(document.querySelectorAll(".item"));
}

/*
SMILEY STATE
*/

function updateSmiley(item) {
  smiley.classList.add("eating");

  setTimeout(() => {
    smiley.classList.remove("eating");
  }, 180);

  if (item === "🍌" || item === "🍎" || item === "🍐") {
    smiley.innerText = "😍";
  } else if (item === "🥬" || item === "🥕") {
    smiley.innerText = "😐";
  } else if (item === "🧅" || item === "🍆") {
    smiley.innerText = "😣";
  } else if (item === "🍄" || item === "💩") {
    smiley.innerText = "😵";
  }
}

/*
MOUVEMENT FLUIDE (LERP + NOISE)
*/

function moveSmiley() {
  if (!running) return;

  if (currentTarget >= items.length) return;

  const target = items[currentTarget];
  const targetX = target.offsetLeft;

  const dx = targetX - smileyX;

  // 🔥 interpolation fluide
  const easing = 0.08;

  // micro variation pour éviter rigidité
  const noise = (Math.random() - 0.5) * 0.6;

  // mouvement progressif
  smileyX += dx * easing + noise;

  // collision
  if (Math.abs(dx) < 18) {
    const emoji = target.innerText;

    updateSmiley(emoji);

    target.remove();
    currentTarget++;

    if (emoji === "💩" && currentTarget >= sequence.length) {
      setTimeout(() => {
        running = false;
        gameOver.style.display = "flex";
      }, 1200);
    }
  }

  // limites
  const maxX = track.offsetWidth - 80;
  smileyX = Math.max(20, Math.min(smileyX, maxX));

  // rendu GPU (ULTRA IMPORTANT)
  smiley.style.transform = `translate3d(${smileyX}px, -50%, 0)`;
}

/*
LOOP
*/

function loop() {
  moveSmiley();
  requestAnimationFrame(loop);
}

/*
INIT
*/

clickBox.addEventListener("click", startGame);

window.addEventListener("resize", createItems);

createItems();
loop();
