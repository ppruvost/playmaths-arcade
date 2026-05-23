// =============================
// HEADERS CORS
// =============================
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async (event) => {

  console.log("Méthode :", event.httpMethod);
  console.log("Body :", event.body);

  try {

    // =============================
    // 1. Gestion preflight CORS
    // =============================
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        headers,
        body: "ok",
      };
    }

    // =============================
    // 2. Autoriser uniquement POST
    // =============================
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({
          error: "Method Not Allowed"
        }),
      };
    }

    // =============================
    // 3. Parsing sécurisé du body
    // =============================
    let body;

    try {
      body = JSON.parse(event.body);
    } catch (e) {

      console.error("JSON invalide :", e);

      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Invalid JSON"
        }),
      };
    }

    // =============================
    // 4. Variables GitHub
    // =============================
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    if (!GITHUB_TOKEN) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "GITHUB_TOKEN manquant dans Netlify"
        }),
      };
    }

    const OWNER = "ppruvost";
    const REPO = "playmaths-arcade";
    const PATH = "scores.js";

    // =============================
    // 5. Lecture fichier GitHub
    // =============================
    const fileRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
      }
    );

    if (!fileRes.ok) {

      const errorText = await fileRes.text();

      console.error("Erreur lecture GitHub :", errorText);

      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Erreur lecture GitHub",
          details: errorText,
        }),
      };
    }

    const fileData = await fileRes.json();

    if (!fileData.content) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Impossible de lire scores.js"
        }),
      };
    }

    // =============================
    // 6. Décodage contenu
    // =============================
    const content = Buffer
      .from(fileData.content, "base64")
      .toString("utf-8");

    // =============================
    // 7. Extraction tableau JS
    // =============================
    const start = content.indexOf("[");
    const end = content.lastIndexOf("]");

    let topScores = [];

    try {
      topScores = eval(content.slice(start, end + 1));
    } catch (e) {

      console.error("Erreur parsing tableau :", e);

      topScores = [];
    }

    // =============================
    // 8. Ajout nouveau score
    // =============================
    topScores.push({
      prenom: body.prenom || "Inconnu",
      date: new Date().toLocaleDateString("fr-FR"),
      score: body.score || body.points_play_maths || 0,
    });

    // =============================
    // 9. Tri décroissant
    // =============================
    topScores.sort((a, b) => b.score - a.score);

    // =============================
    // 10. Limite TOP 10
    // =============================
    topScores = topScores.slice(0, 10);

    // =============================
    // 11. Reconstruction fichier
    // =============================
    const newFile =
`const topScores = ${JSON.stringify(topScores, null, 2)};

if (typeof module !== "undefined") {
  module.exports = topScores;
}
`;

    const updatedContent =
      Buffer.from(newFile).toString("base64");

    // =============================
    // 12. Écriture GitHub
    // =============================
    const updateRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Update TOP 10 PlayMaths",
          content: updatedContent,
          sha: fileData.sha,
        }),
      }
    );

    if (!updateRes.ok) {

      const errorText = await updateRes.text();

      console.error("Erreur écriture GitHub :", errorText);

      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Erreur écriture GitHub",
          details: errorText,
        }),
      };
    }

    const updateData = await updateRes.json();

    // =============================
    // 13. Succès
    // =============================
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        commit: updateData.commit?.sha || null,
        scores: topScores,
      }),
    };

  } catch (err) {

    console.error("ERREUR COMPLETE :", err);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
};
