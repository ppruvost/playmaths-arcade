// =============================
// Initialisation EmailJS
// =============================
(function () {
  if (window.emailjs) {
    try {
      emailjs.init("TJHX0tkW1CCz7lv7a");
    } catch (e) {
      console.warn("EmailJS init failed :", e);
    }
  }
})();

// =============================
// ENVOI SCORE SUPABASE
// =============================
async function envoyerScore(

prenom,

score

){

try{

const res = await fetch(

`${SUPABASE_URL}/rest/v1/scores`,

{

method:"POST",

headers:{

"Content-Type":"application/json",

apikey: SUPABASE_KEY,

Authorization:
`Bearer ${SUPABASE_KEY}`

},

body: JSON.stringify({

prenom: prenom,

score: score

})

}

);

if(!res.ok){

throw new Error(

await res.text()

);

}

const data = await res.json();

console.log(
"Score ajouté :",
data
);

return data;

}

catch(err){

console.error(

"Erreur Supabase :",

err

);

throw err;

}

}

// =============================
// ENVOI DES RÉSULTATS
// =============================
async function sendResults(user = {}, score = 0, total = 0, note20 = 0, playMathsPoints = 0, questions = []) {

  if (!window.emailjs) {
    console.warn("EmailJS non chargé !");
    return;
  }

  // =============================
  // Construction du récapitulatif sécurisé
  // =============================
  let recap = "";

  (questions || []).forEach((q, i) => {
    recap += `Q${i + 1}: ${q?.question || ""}\n`;
    recap += `Réponse élève : ${q?.userAnswer || "Aucune"}\n`;
    recap += `Bonne réponse : ${q?.bonne_reponse || ""}\n\n`;
  });

  // =============================
  // Paramètres EmailJS
  // =============================
  const emailParams = {
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    score,
    total,
    note20,
    points_play_maths: playMathsPoints,
    details: recap,
    email: "lyceepro.mermoz@gmail.com"
  };

  // =============================
  // Promesse EmailJS
  // =============================
  const emailPromise = emailjs.send(
    "service_cgh817y",
    "template_ly7s41e",
    emailParams
  );

  // =============================
  // Promesse sauvegarde score
  // =============================
const savePromise = envoyerScore(

  user?.prenom || "",

  playMathsPoints

);

  // =============================
  // Exécution parallèle
  // =============================
  try {
    const [emailRes, saveRes] = await Promise.allSettled([
      emailPromise,
      savePromise
    ]);

    // =============================
    // Logs détaillés
    // =============================
    if (emailRes.status === "fulfilled") {
      console.log("Email envoyé avec succès");
    } else {
      console.error("Erreur EmailJS :", emailRes.reason);
    }

    if (saveRes.status === "fulfilled") {
      console.log("Score sauvegardé :", saveRes.value);
      window.postMessage("refreshLeaderboard", "*");
    } else {
      console.error("Erreur sauvegarde :", saveRes.reason);
    }

    // =============================
    // Résultat utilisateur
    // =============================
    if (emailRes.status === "fulfilled" && saveRes.status === "fulfilled") {
      alert("✅ Résultats envoyés et classement mis à jour !");
    } else {
      alert("⚠️ Résultats partiellement envoyés (voir console).");
    }

  } catch (err) {
    console.error("Erreur globale :", err);
    alert("❌ Erreur inattendue : " + (err?.message || String(err)));
  }
}
