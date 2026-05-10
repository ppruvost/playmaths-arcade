function renderLeaderboard() {
  const table = document.getElementById("scoreTable");

  if (!table) return;

  // Vide le tableau avant de le reconstruire
  table.innerHTML = "";

  topScores.forEach((joueur, index) => {
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${joueur.prenom}</td>
        <td>${joueur.date}</td>
        <td>${joueur.score}</td>
      </tr>
    `;
    table.innerHTML += row;
  });
}

fetch("scores.js?cache=" + Date.now())
  .then(res => res.text())
  .then(eval)
  .then(() => renderLeaderboard());
