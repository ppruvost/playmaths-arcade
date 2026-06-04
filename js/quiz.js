/* quiz.js - gestion du quiz, clic direct, explication 9s, timer, enregistrement userAnswer */

let current = 0;
let score = 0;
let shuffledQuestions = [];
let timerInterval = null;
let timeLeft = 30;

// >>> BONUS PLAY MATHS <<<
let startTime = 0;
let playMathsPoints = 0;

function calculPlayMathsPoints(timeTaken){

    const maxPoints = 90;
    const tempsReference = 1;
    const demiSeconde = 0.25;

    const retard =
        Math.max(
            0,
            timeTaken - tempsReference
        );

    const pointsPerdus =
        Math.floor(
            retard / demiSeconde
        );

    return Math.max(
        0,
        maxPoints - pointsPerdus
    );
}

// <<< FIN BONUS >>>

// vibration mobile/tablette
function vibrateBonus() {

    if ("vibrate" in navigator) {
        navigator.vibrate([80,50,80]);
    }

    document.body.classList.add("bonus-shake");

    setTimeout(() => {
        document.body.classList.remove("bonus-shake");
    }, 250);

}

// ==============================
//      ÉLÉMENTS DOM
// ==============================
const startBtn = document.getElementById("startQuiz");
const nomInput = document.getElementById("nom");
const prenomInput = document.getElementById("prenom");

const questionBox = document.getElementById("questionBox");
const graphiqueDiv = document.getElementById("graphique-container");
const answerGrid = document.getElementById("answerGrid");
const explanationBox = document.getElementById("explanationBox");
const timerNumber = document.getElementById("timerNumber");
const timerCircle = document.getElementById("timer-circle");
const scoreBox = document.getElementById("scoreBox");
const victorySound = document.getElementById("victorySound");
const bgMusic = document.getElementById("bgMusic");

// ==============================
//           MÉLANGE
// ==============================
function shuffleArray(arr) {
  return arr.slice().sort(() => Math.random() - 0.5);
}

// ==============================
//   ANIMATION BONUS PLAY MATHS
// ==============================
function showBonusAnimation(bonus, element) {

  const bonusDiv = document.createElement("div");

  bonusDiv.className = "playmaths-bonus";

  bonusDiv.textContent = `+${bonus}`;

  const rect = element.getBoundingClientRect();

  bonusDiv.style.left =
      rect.left +
      window.scrollX +
      rect.width / 2 +
      "px";

  bonusDiv.style.top =
      rect.top +
      window.scrollY -
      10 +
      "px";

  document.body.appendChild(bonusDiv);

  setTimeout(
      () => bonusDiv.remove(),
      1000
  );
}

// ==============================
//            DÉMARRAGE
// ==============================
startBtn.addEventListener("click", () => {

  const nom = nomInput.value.trim();
  const prenom = prenomInput.value.trim();

  if (!nom) {
    nomInput.focus();
    return;
  }

  if (!prenom) {
    prenomInput.focus();
    return;
  }

  score = 0;
  current = 0;
  playMathsPoints = 0;

  console.log(
      "questions détectées :",
      window.questions
  );

  if (
      !window.questions ||
      !Array.isArray(window.questions) ||
      window.questions.length === 0
  ) {

    console.error(
        "Questions non chargées !"
    );

    alert(
        "Erreur : questions.js non chargé"
    );

    return;
  }

  shuffledQuestions =
      shuffleArray(
          window.questions
      );

  if (bgMusic) {
    bgMusic.volume = 0.35;
    bgMusic.play().catch(() => {});
  }

  document.getElementById(
      "userForm"
  ).style.display = "none";

  showQuestion();

});

// ==============================
//        AFFICHE QUESTION
// ==============================
function showQuestion() {

  clearTimer();

  const q =
      shuffledQuestions[current];

  if (!q) {
    endQuiz();
    return;
  }

  questionBox.textContent =
      q.question;

  explanationBox.style.display =
      "none";

  explanationBox.innerHTML = "";

  answerGrid.innerHTML = "";

  graphiqueDiv.innerHTML = "";
  graphiqueDiv.style.display = "none";

  if (q.graphique) {

    const img =
        document.createElement(
            "img"
        );

    img.src = q.graphique;

    img.alt =
        "Graphique de la question";

    img.onload = () => {
      graphiqueDiv.style.display =
          "block";
    };

    graphiqueDiv.appendChild(img);
  }

  const colors =
      ["red","blue","yellow","green"];

  q.options.forEach((opt, idx) => {

    const d =
        document.createElement(
            "div"
        );

    d.className =
        `answer ${colors[idx % colors.length]}`;

    d.textContent = opt;

    d.addEventListener(
        "click",
        () => handleAnswer(opt, d)
    );

    answerGrid.appendChild(d);

  });

  startTime = Date.now();

  if (!window.NO_TIMER) {
      startTimer();
  }

  scoreBox.textContent =
      `Bonnes réponses : ${score}/${shuffledQuestions.length} • Play Maths : ${playMathsPoints} pts`;
}

// ==============================
//          CLICK RÉPONSE
// ==============================
function handleAnswer(
    option,
    selectedDiv
) {

  clearTimer();

  const q =
      shuffledQuestions[current];

  q.userAnswer =
      option || "Aucune";

  document
      .querySelectorAll(".answer")
      .forEach(
          a => a.style.pointerEvents =
          "none"
      );

  const correct =
      q.bonne_reponse;

  const isCorrect =
      option === correct;

  if (isCorrect) {

    selectedDiv.classList.add(
        "answer-correct"
    );

    score++;

    const timeTaken =
        (Date.now() - startTime)
        / 1000;

    const bonus =
        calculPlayMathsPoints(
            timeTaken
        );

    playMathsPoints += bonus;

    showBonusAnimation(
        bonus,
        selectedDiv
    );

    if (bonus >= 58) {
      vibrateBonus();
    }

  } else {

    selectedDiv.classList.add(
        "answer-wrong"
    );

    document
      .querySelectorAll(".answer")
      .forEach(a => {

        if (
            a.textContent.trim() ===
            String(correct).trim()
        ) {

          a.classList.add(
              "answer-correct"
          );

        }

      });

  }

  explanationBox.innerHTML =
      `<strong>Explication :</strong> ${q.explication || ""}`;

  explanationBox.style.display =
      "block";

  scoreBox.textContent =
      `Bonnes réponses : ${score}/${shuffledQuestions.length} • Play Maths : ${playMathsPoints} pts`;

  setTimeout(
      nextQuestion,
      9000
  );

}

// ==============================
//            TIMEOUT
// ==============================
function forceTimeout() {

  const q =
      shuffledQuestions[current];

  q.userAnswer =
      "Aucune";

  document
    .querySelectorAll(".answer")
    .forEach(a => {

      if (
          a.textContent.trim() ===
          String(q.bonne_reponse).trim()
      ) {

        a.classList.add(
            "answer-correct"
        );

      } else {

        a.classList.add(
            "answer-wrong"
        );

      }

      a.style.pointerEvents =
          "none";

    });

  explanationBox.innerHTML =
      `<strong>Explication :</strong> ${q.explication || ""}`;

  explanationBox.style.display =
      "block";

  setTimeout(
      nextQuestion,
      9000
  );
}

// ==============================
//       QUESTION SUIVANTE
// ==============================
function nextQuestion() {

  current++;

  if (
      current <
      shuffledQuestions.length
  ) {
      showQuestion();
  }
  else {
      endQuiz();
  }

}

// ==============================
//           TIMER SVG
// ==============================
function startTimer() {

  timeLeft = 30;

  const radius = 35;

  const circumference =
      2 * Math.PI * radius;

  timerCircle.style.strokeDasharray =
      `${circumference}`;

  timerCircle.style.strokeDashoffset =
      "0";

  timerNumber.textContent =
      timeLeft;

  timerInterval =
      setInterval(() => {

        timeLeft--;

        timerNumber.textContent =
            timeLeft;

        const offset =
            circumference -
            (timeLeft / 30)
            * circumference;

        timerCircle.style.strokeDashoffset =
            offset;

        timerCircle.style.stroke =
            timeLeft <= 10
            ? "#f39c12"
            : "#3498db";

        if (timeLeft <= 0) {

          clearInterval(
              timerInterval
          );

          forceTimeout();

        }

      }, 1000);

}

function clearTimer() {

  if (timerInterval) {

    clearInterval(
        timerInterval
    );

  }

  timerInterval = null;

}

// ==============================
//         FIN DU QUIZ
// ==============================
function endQuiz() {

  clearTimer();

  if (bgMusic) {

    bgMusic.pause();

    bgMusic.currentTime = 0;

  }

  if (victorySound) {

    victorySound.play()
      .catch(() => {});

  }

  try {

    confetti({

      particleCount: 150,

      spread: 100,

      origin: {
          y: 0.6
      }

    });

  } catch (e) {}

  const total =
      shuffledQuestions.length;

  const noteSur20 =
      Math.round(
          (score / total) * 20
      );

  questionBox.textContent =
`Quiz terminé !
Score final : ${score} / ${total}
Note : ${noteSur20}/20
Play Maths : ${playMathsPoints} points 🎉`;

  answerGrid.innerHTML = "";

  graphiqueDiv.innerHTML = "";

  explanationBox.style.display =
      "none";

  scoreBox.textContent =
      `Résultat final : ${score}/${total} • Play Maths : ${playMathsPoints} pts`;

  const user = {

    nom: nomInput.value.trim(),

    prenom: nomInput.value.trim(),

    activite: document.title

};

  if (
      typeof sendResults ===
      "function"
  ) {

    sendResults(
        user,
        score,
        total,
        noteSur20,
        playMathsPoints,
        shuffledQuestions
    );

  }

}
