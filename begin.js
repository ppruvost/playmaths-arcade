const music = document.getElementById("bgMusic");
const startBtn = document.getElementById("startMusic");

/* =========================
   LANCEMENT AUTO MUSIQUE
========================= */

window.addEventListener("load", () => {
  if (!music) return;

  music.play()
    .then(() => {
      console.log("Musique lancée automatiquement");
    })
    .catch(() => {
      if (startBtn) {
        startBtn.style.display = "block";
      }
    });
});

/* =========================
   BOUTON START MUSIQUE
========================= */

if (startBtn) {
  startBtn.addEventListener("click", () => {
    music.play();
    startBtn.style.display = "none";
  });
}
