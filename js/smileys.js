const smiley = document.getElementById("smiley");
const clickBox = document.getElementById("clickBox");
const bgMusic = document.getElementById("bgMusic");
const itemsContainer = document.getElementById("items");
const track = document.getElementById("track");
const gameOver = document.getElementById("gameOver");
let smileyX = 40;
let running = false;
let currentTarget = 0;
let items = [];
let citations = [];

/* CHARGEMENT DES CITATIONS */
fetch("citations.json")
  .then((res) => {
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  })
  .then((data) => {
    citations = data;
  })
  .catch((err) => {
    console.error("Impossible de charger citations.json :", err);
  });

function afficherCitation() {
  const el = document.getElementById("citationFinale");
  if (!el) return;
  if (!citations.length) {
    el.innerText = "Pense à progresser, un pas après l'autre.";
    return;
  }
  const q = citations[Math.floor(Math.random() * citations.length)];
  el.innerText = `« ${q.citation} » — ${q.auteur}`;
}

const sequence = [
  "🍌","🍆","🍐","🥬","🍎","🍄","🧅","🥕","💩"
];
/* gestion aller-retour */
let didHalfTurn = false;
let isReturning = false;
let halfPoint = 0;
/* offset visuel du smiley (centrage) */
const SMILEY_OFFSET = 30;
/* START */
function startGame() {
  if (running) return;
  running = true;
  bgMusic?.play().catch(() => {});
  clickBox.style.display = "none";
}
/* CREATE ITEMS */
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
  items = [...document.querySelectorAll(".item")];
  /* reset position */
  smileyX = 40;
  currentTarget = 0;
  didHalfTurn = false;
  isReturning = false;
  smiley.style.transform =
    `translate3d(${smileyX - SMILEY_OFFSET}px, -50%, 0)`;
}
/* SMILEY STATE */
function updateSmiley(emoji) {
  smiley.classList.add("eating");
  setTimeout(() => {
    smiley.classList.remove("eating");
  }, 180);
  if (["🍌","🍎","🍐"].includes(emoji)) smiley.innerText = "😍";
  else if (["🥬","🥕"].includes(emoji)) smiley.innerText = "😐";
  else if (["🧅","🍆"].includes(emoji)) smiley.innerText = "😣";
  else smiley.innerText = "😵";
}
/* MOVE */
function moveSmiley() {
  if (!running) return;
  if (currentTarget >= items.length) return;
  const target = items[currentTarget];
  if (!target) return;
  /* centre réel de l'item */
  const finalTargetX =
    target.offsetLeft + target.offsetWidth / 2;
  /* demi-tour UNE SEULE FOIS */
  if (!didHalfTurn && currentTarget === 0) {
    halfPoint = (smileyX + finalTargetX) / 2;
    if (smileyX >= halfPoint) {
      isReturning = true;
      didHalfTurn = true;
    }
  }
  let targetX;
  if (isReturning) {
    targetX = halfPoint - 80;
    if (Math.abs(smileyX - targetX) < 10) {
      isReturning = false;
    }
  } else {
    targetX = finalTargetX;
  }
  const dx = targetX - smileyX;
  const easing = 0.08;
  const noise = (Math.random() - 0.5) * 0.4;
  smileyX += dx * easing + noise;
  /* soft limit (IMPORTANT: évite blocage fin niveau) */
  if (smileyX < 10) smileyX = 10;
  const maxX = track.offsetWidth - 40;
  if (smileyX > maxX) smileyX = maxX;
  /* collision fiable */
  if (!isReturning) {
    const distance = Math.abs(finalTargetX - smileyX);
    if (distance < 35) {
      const emoji = target.innerText;
      updateSmiley(emoji);
      target.remove();
      currentTarget++;
      /* fin jeu */
      if (emoji === "💩" && currentTarget >= sequence.length) {
        setTimeout(() => {
          running = false;
          afficherCitation();
          gameOver.style.display = "flex";
        }, 1200);
      }
    }
  }
  /* rendu */
  smiley.style.transform =
    `translate3d(${smileyX - SMILEY_OFFSET}px, -50%, 0)`;
}
/* LOOP */
function loop() {
  moveSmiley();
  requestAnimationFrame(loop);
}
/* INIT */
clickBox.addEventListener("click", startGame);
window.addEventListener("resize", createItems);
createItems();
loop();
