const smiley = document.getElementById("smiley");
const clickBox = document.getElementById("clickBox");
const bgMusic = document.getElementById("bgMusic");
const itemsContainer = document.getElementById("items");
const track = document.getElementById("track");
const gameOver = document.getElementById("gameOver");

let smileyX = 30;
let direction = 1;
let running = false;
let currentIndex = 0;

const speed = 2;

/*
SCÉNARIO
*/

const sequence = [
  "🍌",
  "🍎",
  "🍐",
  "🥬",
  "🥬",
  "🥬",
  "🥔",
  "🥔",
  "💩",
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
CRÉER LES OBJETS
*/

function createItems() {
  itemsContainer.innerHTML = "";

  const spacing = 90;

  sequence.forEach((emoji, index) => {
    const item = document.createElement("div");
    item.className = "item";
    item.innerText = emoji;
    item.style.left = `${150 + index * spacing}px`;
    item.dataset.index = index;
    itemsContainer.appendChild(item);
  });
}

/*
CHANGER LE SMILEY
*/

function updateSmiley(item) {
  smiley.classList.add("eating");

  setTimeout(() => {
    smiley.classList.remove("eating");
  }, 180);

  if (item === "🍌" || item === "🍎" || item === "🍐") {
    smiley.innerText = "😍";
  }

  if (item === "🥬") {
    smiley.innerText = "😐";
  }

  if (item === "🥔") {
    smiley.innerText = "😣";
  }

  if (item === "💩") {
    smiley.innerText = "😵";
  }
}

/*
MANGER
*/

function eatItems() {
  const items = document.querySelectorAll(".item");

  items.forEach((item) => {
    const itemX = item.offsetLeft;

    if (Math.abs(itemX - smileyX) < 25) {
      const emoji = item.innerText;

      updateSmiley(emoji);

      item.remove();

      if (emoji === "💩" && currentIndex >= 8) {
        setTimeout(() => {
          running = false;
          gameOver.style.display = "flex";
        }, 1500);
      }

      currentIndex++;
    }
  });
}

/*
BOUCLE
*/

function loop() {
  if (running) {
    smileyX += speed * direction;

    const maxX = track.offsetWidth - 80;

    if (smileyX >= maxX) {
      direction = -1;
    }

    if (smileyX <= 30) {
      direction = 1;
    }

    smiley.style.left = `${smileyX}px`;

    eatItems();
  }

  requestAnimationFrame(loop);
}

/*
INIT
*/

clickBox.addEventListener("click", startGame);

window.addEventListener("resize", createItems);

createItems();
loop();
