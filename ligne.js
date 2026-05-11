const music = document.getElementById("bgMusic");
const pacman = document.getElementById("pacman");
const ghost = document.getElementById("ghost");
const cube = document.getElementById("clickCube");
const dotsContainer = document.getElementById("dots");

let activated = false;
let position = 0;
let direction = 1;

function createDots() {
  dotsContainer.innerHTML = "";

  for (let i = 40; i < window.innerWidth - 80; i += 35) {
    if (i > window.innerWidth / 2 - 50 && i < window.innerWidth / 2 + 60) continue;

    const dot = document.createElement("div");
    dot.className = "dot";
    dot.style.left = i + "px";
    dotsContainer.appendChild(dot);
  }
}

function resetDots() {
  document.querySelectorAll(".dot").forEach(dot => {
    dot.style.opacity = "1";
  });
}

function animate() {
  const max = window.innerWidth - 180;

  if (!activated) {
    if (position < window.innerWidth / 2 - 90) {
      position += 2;
    }
  } else {
    position += direction * 2.5;

    if (position >= max || position <= 0) {
      direction *= -1;
      pacman.style.transform = direction === 1 ? "scaleX(1)" : "scaleX(-1)";
      ghost.style.transform = direction === 1 ? "scaleX(1)" : "scaleX(-1)";
    }
  }

  pacman.style.left = position + "px";
  ghost.style.left = (position - 65) + "px";

  document.querySelectorAll(".dot").forEach(dot => {
    const dotX = parseInt(dot.style.left);
    if (Math.abs(dotX - position) < 20) {
      dot.style.opacity = "0";
    }
  });

  requestAnimationFrame(animate);
}

cube.addEventListener("click", () => {
  if (activated) return;

  activated = true;
  cube.style.display = "none";

  music.play().catch(() => {
    console.log("Lecture audio bloquée");
  });

  setInterval(resetDots, 4000);
});

createDots();
animate();
window.addEventListener("resize", createDots);
