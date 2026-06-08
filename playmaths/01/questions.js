/* ============================================================
   ====================  LISTE DES QUESTIONS  ==================
   ============================================================ */

window.questions = [
  {
    question: "Dans un triangle rectangle, si les côtés de l’angle droit mesurent 3 cm et 4 cm, quelle est la longueur de l’hypoténuse ?",
    options: ["5 cm", "6 cm", "7 cm", "8 cm"],
    bonne_reponse: "5 cm",
    explication: "D’après le théorème de Pythagore : c² = 3² + 4² = 25 donc c = 5 cm."
  },

  {
    question: "Les longueurs 5 cm, 12 cm et 13 cm peuvent-elles former un triangle rectangle ?",
    options: ["Oui", "Non"],
    bonne_reponse: "Oui",
    explication: "5² + 12² = 25 + 144 = 169 et 13² = 169, donc d’après la réciproque de Pythagore, le triangle est rectangle."
  },

  {
    question: "Parmi les représentations suivantes, quelle figure correspond à un triangle rectangle ?",
    graphique: "graphique1.png",
    options: ["Figure A", "Figure B", "Figure C", "Figure D"],
    bonne_reponse: "Figure C",
    explication: "Dans la figure C, le triangle est rectangle car 6² + 8² = 10²."
  },

  {
    question: "Sur la figure, les droites (MN) et (BC) sont-elles parallèles ?",
    graphique: "graphique2.png",
    options: ["Oui", "Non"],
    bonne_reponse: "Oui",
    explication: "AM/AB = 4/8 = 1/2 et AN/AC = 3/6 = 1/2 donc, d’après le théorème de Thalès, (MN) est parallèle à (BC)."
  },

  {
    question: "Sur la figure, calculer la longueur BC.",
    graphique: "graphique3.png",
    options: ["12 cm", "15 cm", "18 cm", "20 cm"],
    bonne_reponse: "18 cm",
    explication: "AB/AD = BC/DE donc BC = AB × DE / AD = 9 × 12 / 6 = 18 cm."
  },

  {
    question: "Quel est le périmètre d’un cercle de rayon 7 cm ? (π ≈ 3,14)",
    options: ["21,98 cm", "32,98 cm", "43,96 cm", "65,96 cm"],
    bonne_reponse: "43,96 cm",
    explication: "P = 2 × π × r = 2 × 3,14 × 7 = 43,96 cm."
  },

  {
    question: "Quelle figure a la plus grande aire ?",
    graphique: "graphique4.png",
    options: ["Carré", "Rectangle", "Triangle", "Disque"],
    bonne_reponse: "Disque",
    explication: "Aire carré = 16, rectangle = 15, triangle = 12, disque ≈ 50,24. Donc le disque."
  },

  {
    question: "Quel est le volume d’un cylindre de rayon 3 cm et de hauteur 10 cm ? (π ≈ 3,14)",
     graphique: "graphique5.png",
    options: ["28,26 cm³", "56,52 cm³", "84,78 cm³", "113,04 cm³"],
    bonne_reponse: "84,78 cm³",
    explication: "V = π × r² × h = 3,14 × 3² × 10 = 84,78 cm³."
  },

  {
    question: "Sur la figure, quel est le volume du pavé droit ?",
    graphique: "graphique6.png",
    options: ["24 cm³", "36 cm³", "48 cm³", "60 cm³"],
    bonne_reponse: "48 cm³",
    explication: "V = Longueur × largeur × hauteur = 6 × 4 × 2 = 48 cm³."
  },

  {
    question: "Sur la figure, quelle est la mesure de l’angle manquant ?",
    graphique: "graphique7.png",
    options: ["56°", "64°", "70°", "80°"],
    bonne_reponse: "64°",
    explication: "La somme des angles d’un triangle est 180° donc 180° − (56° + 60°) = 64°."
  }
];
/* ============================================================
   ====================  FIN DES QUESTIONS  ==================
   ============================================================ */
