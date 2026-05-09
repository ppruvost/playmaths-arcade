// envoi.js - envoi EmailJS des résultats + récapitulatif

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
function sendResults(user, score, total, note20, playMathsPoints, questions) {

  if (!window.emailjs) {
    console.warn("EmailJS non chargé !");
    return;
  }

  // =============================
  // Construction du récap
  // =============================
  let recap = "";
  questions.forEach((q, i) => {
    recap += `Q${i + 1}: ${q.question}\n`;
    recap += `Réponse élève : ${q.userAnswer || "Aucune"}\n`;
    recap += `Bonne réponse : ${q.bonne_reponse}\n\n`;
  });

  // =============================
  // Paramètres envoyés à EmailJS
  // =============================
  const emailParams = {
    nom: user.nom || "",
    prenom: user.prenom || "",
    score: score,                     // brut
    total: total,                     // nombre de questions
    note20: note20,                   // *** CHIFFRE, pas "x / y" ***
    points_play_maths: playMathsPoints,
    details: recap,
    email: "lyceepro.mermoz@gmail.com"
  };

  // =============================
  // Envoi EmailJS
  // =============================
  emailjs
    .send("service_cgh817y", "template_ly7s41e", emailParams)
    .then(() => {
      alert("✅ Résultats envoyés automatiquement à votre professeur. Merci !");
    })
    .catch((err) => {
      console.error("Erreur envoi EmailJS :", err);
      alert(
        "❌ Erreur lors de l'envoi : " +
          (err?.text ? err.text : JSON.stringify(err))
      );
    });
}

// =============================
// Enregistrement GitHub
// =============================
fetch("/.netlify/functions/save-score", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    prenom: user.prenom || "",
    points_play_maths: playMathsPoints,    
  }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log("Résultat sauvegardé GitHub :", data);
  })
  .catch((err) => {
    console.error("Erreur sauvegarde GitHub :", err);
  });
