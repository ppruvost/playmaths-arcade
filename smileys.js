const smiley = document.getElementById("smiley");
const clickBox = document.getElementById("clickBox");
const bgMusic = document.getElementById("bgMusic");
const itemsContainer = document.getElementById("items");
const track = document.getElementById("track");
const gameOver = document.getElementById("gameOver");

let smileyX = 30;
let running = false;
let currentTarget = 0;

/*
SCÉNARIO
ordre des rencontres
*/

const sequence = [
  "🍌",
  "🍎",
  "🍐",
  "🥬",
  "🥕",
  "🍆",
  "🥔",
  "🧅",
  "🍄",
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

  const spacing = 95;

  sequence.forEach((emoji, index) => {
    const item = document.createElement("div");
    item.className = "item";
    item.innerText = emoji;

    /* objets répartis sur toute la ligne */
    item.style.left = `${140 + index * spacing}px`;

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
  }, 220);

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
DÉPLACEMENT ALÉATOIRE
Le smiley hésite avant d'aller
vers l'objet suivant
*/

function moveSmiley() {
  if (!running) return;

  const items = document.querySelectorAll(".item");

  if (currentTarget >= items.length) return;

  const target = items[currentTarget];
  const targetX = target.offsetLeft;

  /*
  comportement semi-aléatoire :
  parfois avance,
  parfois recule légèrement
  */

  let randomMove = Math.random();

  if (Math.abs(smileyX - targetX) > 40) {
    if (randomMove < 0.75) {
      /* avance vers l'objectif */
      smileyX += (targetX > smileyX ? 2 : -2);
    } else {
      /* petit retour aléatoire */
      smileyX += (Math.random() < 0.5 ? -8 : 8);
    }
  }

  /*
  mange l'objet si proche
  */

  if (Math.abs(smileyX - targetX) < 25) {
    const emoji = target.innerText;

    updateSmiley(emoji);

    target.remove();
    currentTarget++;

    /*
    GAME OVER final
    */

    if (emoji === "💩" && currentTarget >= sequence.length) {
      setTimeout(() => {
        running = false;
        gameOver.style.display = "flex";
      }, 1500);
    }
  }

  /*
  limites de la piste
  */

  const maxX = track.offsetWidth - 80;

  if (smileyX < 20) smileyX = 20;
  if (smileyX > maxX) smileyX = maxX;

  smiley.style.left = `${smileyX}px`;
}

/*
BOUCLE PRINCIPALE
*/

function loop() {
  if (running) {
    moveSmiley();
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
