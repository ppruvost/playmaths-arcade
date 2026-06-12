const smiley = document.getElementById("smiley");
const clickBox = document.getElementById("clickBox");
const bgMusic = document.getElementById("bgMusic");
const itemsContainer = document.getElementById("items");
const track = document.getElementById("track");
const gameOver = document.getElementById("gameOver");

let smileyX = 30;
let running = false;
let currentTarget = 0;
let items = []; // cache DOM

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
NOUVEAU :
gestion aller-retour à mi-chemin
*/

let didHalfTurn = false;   // évite de refaire plusieurs fois l'aller-retour
let isReturning = false;   // phase retour vers la gauche
let halfPoint = 0;         // position du demi-tour

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
MOUVEMENT FLUIDE + ALLER/RETOUR À MI-CHEMIN
*/

function moveSmiley() {
  if (!running) return;
  if (currentTarget >= items.length) return;

  const target = items[currentTarget];
  if (!target) return;

  const finalTargetX = target.offsetLeft;

  /*
  ----------------------------------
  DEMI-TOUR À MI-CHEMIN (une seule fois)
  ----------------------------------
  Exemple :
  avance → demi-chemin → recule un peu → repart à droite
  */

  // déclenchement uniquement sur le 1er item
  if (!didHalfTurn && currentTarget === 0) {
    halfPoint = (smileyX + finalTargetX) / 2;

    // quand on atteint la moitié → commencer retour
    if (smileyX >= halfPoint) {
      isReturning = true;
      didHalfTurn = true;
    }
  }

  let targetX;

  if (isReturning) {
    // recule de 80px avant de repartir
    targetX = halfPoint - 80;

    // quand retour terminé → repartir vers la droite
    if (Math.abs(smileyX - targetX) < 10) {
      isReturning = false;
    }
  } else {
    // trajet normal vers la cible
    targetX = finalTargetX;
  }

  const dx = targetX - smileyX;

  /*
  interpolation fluide
  */

  const easing = 0.08;
  const noise = (Math.random() - 0.5) * 0.6;

  smileyX += dx * easing + noise;

  /*
  collision uniquement si on est sur la vraie cible
  */

  if (!isReturning && Math.abs(finalTargetX - smileyX) < 18) {
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

  /*
  limites
  */

  const maxX = track.offsetWidth - 80;
  smileyX = Math.max(20, Math.min(smileyX, maxX));

  /*
  rendu GPU
  */

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

/*
citations.json
*/

async function chargerCitationAleatoire() {

  try {

    const response = await fetch("./citations.json");

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const citations = await response.json();

    if (!Array.isArray(citations) || citations.length === 0) {
      throw new Error("Aucune citation trouvée");
    }

    const citationRandom =
      citations[Math.floor(Math.random() * citations.length)];

    const zoneCitation =
      document.getElementById("citationFinale");

    if (zoneCitation) {
      zoneCitation.innerHTML =
        `"${citationRandom.citation}"<br>
         <small>— ${citationRandom.auteur}</small>`;
    }

  } catch (error) {

    console.error("Erreur chargement citations :", error);

    const zoneCitation =
      document.getElementById("citationFinale");

    if (zoneCitation) {
      zoneCitation.innerHTML =
        `"Le plaisir d'apprendre se partage."<br>
         <small>— Daniel Pennac</small>`;
    }
  }
}

// lancer au chargement
chargerCitationAleatoire();
