const fetch = require("node-fetch");
    }

    // =============================
    // Ajouter la nouvelle ligne
    // =============================
    scores.push({
      date: new Date().toISOString(),
      nom: body.nom,
      prenom: body.prenom,
      score: body.score,
      total: body.total,
      note20: body.note20,
      points_play_maths: body.points_play_maths,
      details: body.details,
    });

    // =============================
    // Réencoder le JSON
    // =============================
    const updatedContent = Buffer.from(
      JSON.stringify(scores, null, 2)
    ).toString("base64");

    // =============================
    // Réécriture GitHub
    // =============================
    const updateFile = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify({
          message: "Ajout automatique score PlayMaths",
          content: updatedContent,
          sha: fileData.sha,
          branch: BRANCH,
        }),
      }
    );

    const result = await updateFile.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        github: result,
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
