// =============================
// MODERATION AUTOMATISME
// prénom + automatisme + cooldown
// =============================
const COOLDOWN_MS = 10 * 60 * 1000; // 10 min

function getKey(prenom, automatisme) {
  return `cooldown_${prenom.trim().toLowerCase()}_${automatisme.trim().toLowerCase()}`;
}

function canSendScore(prenom, automatisme) {

  if (!prenom || !automatisme) return false;

  const key = getKey(prenom, automatisme);

  const lastAttempt =
    localStorage.getItem(key);

  if (!lastAttempt) return true;

  const now = Date.now();

  return (
    now - parseInt(lastAttempt)
  ) > COOLDOWN_MS;
}

function updateLastScore(prenom, automatisme) {

  const key =
    getKey(prenom, automatisme);

  localStorage.setItem(
    key,
    Date.now()
  );
}

function remainingCooldown(prenom, automatisme){

  const key =
    getKey(prenom, automatisme);

  const last =
    localStorage.getItem(key);

  if(!last) return 0;

  const diff =
    COOLDOWN_MS -
    (Date.now() - parseInt(last));

  return Math.max(
    0,
    Math.ceil(diff / 60000)
  );
}


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

  try {

    const res =
      await fetch(

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
            prenom,
            score
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
// ENVOI RESULTATS
// =============================
async function sendResults(
  user = {},
  score = 0,
  total = 0,
  note20 = 0,
  playMathsPoints = 0,
  questions = []
) {

  if (!window.emailjs) {

    console.warn(
      "EmailJS non chargé !"
    );

    return;

  }

  const prenom =
    user?.prenom || "";

  const titreQuiz =
    document.title || "";

  // =============================
  // CONTROLE COOLDOWN
  // =============================
  if (!canSendScore(
    prenom,
    titreQuiz
  )) {

    const minutes =
      remainingCooldown(
        prenom,
        titreQuiz
      );

    alert(
      `⏳ ${prenom}, attends encore ${minutes} min avant de renvoyer un score pour cet automatisme.`
    );

    return;
  }


  // =============================
  // RECAP QUESTIONS
  // =============================
  let recap = "";

  (questions || []).forEach((q, i) => {

    recap +=
      `Q${i + 1}: ${q?.question || ""}\n`;

    recap +=
      `Réponse élève : ${q?.userAnswer || "Aucune"}\n`;

    recap +=
      `Bonne réponse : ${q?.bonne_reponse || ""}\n\n`;

  });


  // =============================
  // PARAMS EMAILJS
  // =============================
  const emailParams = {

    nom:
      user?.nom || "",

    prenom,

    activite:
      titreQuiz,

    score,

    total,

    note20,

    points_play_maths:
      playMathsPoints,

    details:
      recap,

    email:
      "lyceepro.mermoz@gmail.com"

  };


  const path =
    window.location.pathname
    .toLowerCase();

  const isAutomatisme =
    path.includes("/automatisme/");

  const SERVICE_ID =
    isAutomatisme
      ? "service_he9gy99"
      : "service_cgh817y";

  const TEMPLATE_ID =
    isAutomatisme
      ? "template_5vfgpmf"
      : "template_ly7s41e";


  const emailPromise =
    emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      emailParams
    );


  const savePromise =
    envoyerScore(
      prenom,
      playMathsPoints
    );


  try {

    const [
      emailRes,
      saveRes
    ] = await Promise.allSettled([

      emailPromise,
      savePromise

    ]);


    if (
      saveRes.status === "fulfilled"
    ) {

      updateLastScore(
        prenom,
        titreQuiz
      );

      console.log(
        "Cooldown mis à jour"
      );

    }


    if (
      emailRes.status === "fulfilled"
    ) {

      console.log(
        "Email envoyé avec succès"
      );

    }

    else {

      console.error(
        "Erreur EmailJS :",
        emailRes.reason
      );

    }


    if (
      saveRes.status === "fulfilled"
    ) {

      console.log(
        "Score sauvegardé"
      );

      if (
        typeof loadLeaderboard ===
        "function"
      ) {

        loadLeaderboard();

      }

    }

    else {

      console.error(
        "Erreur sauvegarde :",
        saveRes.reason
      );

    }


    if (
      emailRes.status === "fulfilled"
      &&
      saveRes.status === "fulfilled"
    ) {

      alert(
        "✅ Résultats envoyés et classement mis à jour !"
      );

    }

    else {

      alert(
        "⚠️ Résultats partiellement envoyés."
      );

    }

  }

  catch(err){

    console.error(
      "Erreur globale :",
      err
    );

    alert(
      "❌ " +
      (err?.message || err)
    );

  }

}
