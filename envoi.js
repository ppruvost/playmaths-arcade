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
  const savePromise = fetch("https://maths-sciences.netlify.app/.netlify/functions/save-score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prenom: user?.prenom || "",
      score: playMathsPoints
    }),
  }).then(async (res) => {
    const text = await res.text();

    if (!res.ok) {
      throw new Error(text);
    }

    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  });

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
