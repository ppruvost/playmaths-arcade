  const music = document.getElementById("bgMusic");
  const startBtn = document.getElementById("startMusic");

  window.addEventListener("load", () => {
    music.play()
      .then(() => {
        console.log("Musique lancée automatiquement");
      })
      .catch(() => {
        startBtn.style.display = "block";
      });
  });

  startBtn.addEventListener("click", () => {
    music.play();
    startBtn.style.display = "none";
  });
