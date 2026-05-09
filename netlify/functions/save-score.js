const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const OWNER = "ppruvost";
    const REPO = "playmaths-arcade";
    const PATH = "scores.js";

    // =========================
    // 1. Lire le fichier GitHub
    // =========================
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

    const content = Buffer.from(fileData.content, "base64").toString("utf-8");

    // =========================
    // 2. Extraire tableau JS
    // =========================
    const start = content.indexOf("[");
    const end = content.lastIndexOf("]");

    let topScores = [];

    try {
      topScores = eval(content.slice(start, end + 1));
    } catch (e) {
      topScores = [];
    }

    // =========================
    // 3. Ajouter nouveau score
    // =========================
    topScores.push({
      prenom: body.prenom,
      date: new Date().toLocaleDateString("fr-FR"),
      score: body.points_play_maths,
    });

    // =========================
    // 4. TRI DÉCROISSANT
    // =========================
    topScores.sort((a, b) => b.score - a.score);

    // =========================
    // 5. GARDER TOP 10
    // =========================
    topScores = topScores.slice(0, 10);

    // =========================
    // 6. Reconstruire fichier JS
    // =========================
    const newFile =
`const topScores = ${JSON.stringify(topScores, null, 2)};`;

    const updatedContent = Buffer.from(newFile).toString("base64");

    // =========================
    // 7. Écriture GitHub
    // =========================
    await fetch(
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

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
