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

    const res = await fetch(

      `${SUPABASE_URL}/rest/v1/scores?select=prenom,score,date_score&order=score.desc,date_score.desc&limit=10`,

      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`
        }
      }

    );

    if (!res.ok) {

      throw new Error(
        "Erreur Supabase : " + res.status
      );

    }

    const data = await res.json();

    const topScores = data.map(joueur => ({

      prenom: joueur.prenom,

      score: joueur.score,

      date: new Date(
        joueur.date_score
      ).toLocaleDateString("fr-FR")

    }));

    renderLeaderboard(topScores);

  }

  catch(err){

    console.error(
      "Erreur leaderboard :",
      err
    );

  }

}


// =============================
// INIT
// =============================
loadLeaderboard();

// =============================
// ENVOI DES SCORES
// =============================
async function envoyerScore(

  prenom,

  score

){

try{

await fetch(

`${SUPABASE_URL}/rest/v1/scores`,

{

method:"POST",

headers:{

"Content-Type":"application/json",

apikey:SUPABASE_KEY,

Authorization:`Bearer ${SUPABASE_KEY}`

},

body: JSON.stringify({

prenom: prenom,

score: score

})

}

);

loadLeaderboard();

}

catch(err){

console.error(
"Erreur envoi score :",
err
);

}

}
