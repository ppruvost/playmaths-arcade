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

const sequence = [
  "🍌","🍆","🍐","🥬","🍎","🍄","🧅","🥕","💩"
];

let didHalfTurn = false;
let isReturning = false;
let halfPoint = 0;

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

  // RESET position au resize
  smileyX = 40;
  smiley.style.transform = `translate3d(${smileyX}px, -50%, 0)`;
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

/* MOVEMENT */
function moveSmiley() {
  if (!running) return;
  if (currentTarget >= items.length) return;

  const target = items[currentTarget];
  if (!target) return;

  const finalTargetX = target.offsetLeft;

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
  const noise = (Math.random() - 0.5) * 0.6;

  smileyX += dx * easing + noise;

  const maxX = track.offsetWidth - 80;
  smileyX = Math.max(20, Math.min(smileyX, maxX));

  /* COLLISION FIX */
  if (!isReturning && Math.abs(finalTargetX - smileyX) < 28) {
    const emoji = target.innerText;

    updateSmiley(emoji);

    target.remove();
    currentTarget++;

    if (emoji === "💩" && currentTarget === sequence.length) {
      setTimeout(() => {
        running = false;
        gameOver.style.display = "flex";
      }, 1200);
    }
  }

  smiley.style.transform = `translate3d(${smileyX}px, -50%, 0)`;
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

/* CITATIONS */
async function chargerCitationAleatoire() {
  try {
    const response = await fetch("./citations.json");
    const citations = await response.json();

    const c = citations[Math.floor(Math.random() * citations.length)];
    document.getElementById("citationFinale").innerHTML =
      `"${c.citation}"<br><small>— ${c.auteur}</small>`;

  } catch (e) {
    document.getElementById("citationFinale").innerHTML =
      `"Le plaisir d'apprendre se partage."<br><small>— Daniel Pennac</small>`;
  }
}

chargerCitationAleatoire();
