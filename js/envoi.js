// =============================
// Initialisation EmailJS
// =============================
(function () {

  if (!window.emailjs) return;

  try {

    const path =
      window.location.pathname
      .toLowerCase();

    const isAutomatisme =
      path.includes("/automatisme/");

    const PUBLIC_KEY =
      isAutomatisme
      ? "Jo1z5RV5-0IDQO8T7"
      : "TJHX0tkW1CCz7lv7a";

    emailjs.init(PUBLIC_KEY);

    console.log(
      "EmailJS initialisé :",
      isAutomatisme
        ? "clé Automatisme"
        : "clé Standard"
    );

  }

  catch (e) {

    console.warn(
      "EmailJS init failed :",
      e
    );

  }

})();

// =============================
// ENVOI SCORE SUPABASE
// =============================
async function envoyerScore(prenom, score){
if (!SUPABASE_URL || !SUPABASE_KEY) {
throw new Error(
"Variables Supabase absentes"
);
}
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
console.log(
"Score ajouté avec succès"
);
return true;
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
  const titreQuiz = document.title || "";
  
const emailParams = {
  nom: user?.nom || "",
  prenom: user?.prenom || "",
  activite: titreQuiz,
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
    if (typeof loadLeaderboard === "function") {
      loadLeaderboard();
    }
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
