const fetch = require("node-fetch");

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const OWNER = "ppruvost";
    const REPO = "playmaths-arcade";
    const PATH = "scores.json";

    // 1. Lire le fichier GitHub actuel
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

    let scores = [];

    try {
      scores = JSON.parse(content);
    } catch (e) {
      scores = [];
    }

    // 2. Ajouter nouveau score
    scores.push({
      date: new Date().toISOString(),      
      prenom: body.prenom,      
      points_play_maths: body.points_play_maths,      
    });

    // 3. Réencoder en base64
    const updated = Buffer.from(
      JSON.stringify(scores, null, 2)
    ).toString("base64");

    // 4. Réécrire sur GitHub
    await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify({
          message: "Ajout score PlayMaths",
          content: updated,
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
