// =============================
// LEADERBOARD RENDER
// =============================
function renderLeaderboard(topScores = []) {
  const table = document.getElementById("scoreTable");
  if (!table) return;
  
  table.innerHTML = "";
  
  const safeScores = Array.isArray(topScores) ? topScores : [];

  safeScores.forEach((joueur, index) => {
    const tr = document.createElement("tr");

    const rankTd = document.createElement("td");
    rankTd.textContent = index + 1;

    const prenomTd = document.createElement("td");
    prenomTd.textContent = joueur?.prenom || "";

    const dateTd = document.createElement("td");
    dateTd.textContent = joueur?.date || "";

    const scoreTd = document.createElement("td");
    scoreTd.textContent = joueur?.score ?? 0;

    tr.append(rankTd, prenomTd, dateTd, scoreTd);
    table.appendChild(tr);
  });
}

// =============================
// CHARGEMENT DES SCORES
// =============================
async function loadLeaderboard() {
  try {
    const res = await fetch("scores.js?cache=" + Date.now());

    if (!res.ok) {
      throw new Error("Erreur chargement scores : " + res.status);
    }

    const scriptText = await res.text();

    const module = {};
    const exports = {};

    // Exécution isolée du fichier
    const fn = new Function("module", "exports", scriptText);
    fn(module, exports);

    // récupération safe
    const topScores = module.topScores || exports.topScores || [];

    renderLeaderboard(topScores);

  } catch (err) {
    console.error("Erreur leaderboard :", err);
  }
}


// =============================
// INIT
// =============================
loadLeaderboard();
