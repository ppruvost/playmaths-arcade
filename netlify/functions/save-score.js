const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {

    // =============================
    // 1. Vérification HTTP (CRITIQUE)
    // =============================
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    // =============================
    // 2. Parsing sécurisé du body
    // =============================
    let body;

    try {
      body = JSON.parse(event.body);
    } catch (e) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid JSON" }),
      };
    }

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const OWNER = "ppruvost";
    const REPO = "playmaths-arcade";
    const PATH = "scores.js";

    // =============================
    // 3. Lecture fichier GitHub
    // =============================
    const fileRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    const fileData = await fileRes.json();

    if (!fileData.content) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Impossible de lire scores.js" }),
      };
    }

    const content = Buffer.from(fileData.content, "base64").toString("utf-8");

    // =============================
    // 4. Extraction tableau JS
    // =============================
    const start = content.indexOf("[");
    const end = content.lastIndexOf("]");

    let topScores = [];

    try {
      topScores = eval(content.slice(start, end + 1));
    } catch (e) {
      topScores = [];
    }

    // =============================
    // 5. Ajout nouveau score
    // =============================
    topScores.push({
      prenom: body.prenom || "Inconnu",
      date: new Date().toLocaleDateString("fr-FR"),
      score: body.score || body.points_play_maths || 0,
    });

    // =============================
    // 6. TRI décroissant
    // =============================
    topScores.sort((a, b) => b.score - a.score);

    // =============================
    // 7. TOP 10 uniquement
    // =============================
    topScores = topScores.slice(0, 10);

    // =============================
    // 8. Reconstruction fichier JS
    // =============================
    const newFile = `const topScores = ${JSON.stringify(topScores, null, 2)};`;

    const updatedContent = Buffer.from(newFile).toString("base64");

    // =============================
    // 9. Écriture GitHub
    // =============================
    const updateRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify({
          message: "Update TOP 10 PlayMaths",
          content: updatedContent,
          sha: fileData.sha,
        }),
      }
    );

    const updateData = await updateRes.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        commit: updateData.commit?.sha || null,
      }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
};
