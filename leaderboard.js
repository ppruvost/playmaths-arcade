const table = document.getElementById("scoreTable");

if (table) {
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
