// =============================
// Initialisation EmailJS
// =============================
(function () {
  if (window.emailjs) {
    try {
      emailjs.init("TJHX0tkW1CCz7lv7a"); // clé publique
    } catch (e) {
      console.warn("EmailJS init failed :", e);
    }
  }
})();


// =============================
// ENVOI DES RÉSULTATS
// =============================
// sendResults(user, score, total, note20, playMathsPoints, questions)
// =============================

function sendResults(user, score, total, note20, playMathsPoints, questions) {

  if (!window.emailjs) {
    console.warn("EmailJS non chargé !");
    return;
  }

  // =============================
  // Construction du récapitulatif
  // =============================
  let recap = "";

  questions.forEach((q, i) => {
    recap += `Q${i + 1}: ${q.question}\n`;
    recap += `Réponse élève : ${q.userAnswer || "Aucune"}\n`;
    recap += `Bonne réponse : ${q.bonne_reponse}\n\n`;
  });

  // =============================
  // Paramètres EmailJS
  // =============================
  const emailParams = {
    nom: user.nom || "",
    prenom: user.prenom || "",
    score: score,
    total: total,
    note20: note20,
    points_play_maths: playMathsPoints,
    details: recap,
    email: "lyceepro.mermoz@gmail.com"
  };

  // =============================
  // 1. Envoi EmailJS
  // =============================
  emailjs
    .send(
      "service_cgh817y",
      "template_ly7s41e",
      emailParams
    )
    .then(() => {
      console.log("Email envoyé avec succès");
    })
    .catch((err) => {
      console.error("Erreur EmailJS :", err);
      alert(
        "❌ Erreur lors de l'envoi de l'email : " +
        (err?.text ? err.text : JSON.stringify(err))
      );
    });

  // =============================
  // 2. Enregistrement GitHub
  // =============================
  fetch("/.netlify/functions/save-score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prenom: user.prenom || "",
      score: playMathsPoints
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("Score sauvegardé GitHub :", data);

      // =============================
      // Forcer le refresh du leaderboard
      // (utile avec iframe)
      // =============================
      window.postMessage("refreshLeaderboard", "*");

      alert("✅ Résultats envoyés et classement mis à jour !");
    })
    .catch((err) => {
      console.error("Erreur sauvegarde GitHub :", err);
      alert(
        "❌ Erreur lors de la sauvegarde du score : " +
        JSON.stringify(err)
      );
    });
}
