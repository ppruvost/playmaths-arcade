/* ============================================================
   ====================  LISTE DES QUESTIONS  ==================
   ============================================================ */

const questions = [
  {
    question: "Une fonction f(x) = -4x + 20 modélise une quantité de stock. Cette fonction est :",
    options: ["croissante", "constante", "décroissante", "linéaire"],
    bonne_reponse: "décroissante",
    explication: "Le coefficient directeur est négatif, donc la fonction est décroissante."
  },
  {
    question: "Le coût C (en €) d’une fabrication est donné par C = 100 + 5x. Que représente 100 ?",
    options: ["le coût variable", "le coût par unité", "le coût fixe", "le bénéfice"],
    bonne_reponse: "le coût fixe",
    explication: "Le terme constant représente un coût indépendant du nombre de pièces."
  },
  {
    question: "Quel type de fonction est représenté sur le graphique ci-dessous ?",
    graphique: "graphique1.png",
    options: ["affine", "linéaire", "constante", "décroissante"],
    bonne_reponse: "linéaire",
    explication: "La droite passe par l’origine : c’est une fonction linéaire."
  },
  {
    question: "La fonction f(x) = -2x est :",
    options: ["affine", "linéaire et décroissante", "constante", "croissante"],
    bonne_reponse: "linéaire et décroissante",
    explication: "Elle est de la forme ax avec a négatif."
  },
  {
    question: "Une droite passe par l’origine du repère. La fonction associée est :",
    options: ["affine", "linéaire", "constante", "quadratique"],
    bonne_reponse: "linéaire",
    explication: "Une fonction linéaire passe toujours par l’origine."
  },
  {
    question: "La fonction représentée sur ce graphique est :",
    graphique: "graphique2.png",
    options: ["décroissante", "constante", "croissante", "négative"],
    bonne_reponse: "croissante",
    explication: "La droite monte de gauche à droite."
  },
  {
    question: "Que peut-on dire de la fonction représentée sur ce graphique ?",
    graphique: "graphique3.png",
    options: [
      "Elle est croissante",
      "Elle est constante",
      "Elle est décroissante",
      "Elle est linéaire"
    ],
    bonne_reponse: "Elle est décroissante",
    explication: "La pente est négative : la fonction diminue quand x augmente."
  },
  {
    question: "La distance parcourue par un véhicule est donnée par d(x) = 60x. Si x augmente, la distance :",
    options: ["reste constante", "diminue", "augmente", "devient négative"],
    bonne_reponse: "augmente",
    explication: "Le coefficient est positif, donc la fonction est croissante."
  },
  {
    question: "Sur un graphique, une droite monte de gauche à droite. La fonction associée est :",
    options: ["décroissante", "croissante", "constante", "nulle"],
    bonne_reponse: "croissante",
    explication: "Quand la droite monte de gauche à droite, la fonction est croissante."
  },
  {
    question: "Quelle est la valeur de la fonction lorsque x = 0 sur ce graphique ?",
    graphique: "graphique2.png",
    options: ["0", "2", "5", "10"],
    bonne_reponse: "5",
    explication: "La droite coupe l’axe des ordonnées en 5."
  },
	
  {
    question: "Quel graphique représente une fonction constante ?",
    graphique: "graphique4.png",
    options: [
      "Une droite oblique",
      "Une parabole",
      "Une droite horizontale",
      "Une courbe"
    ],
    bonne_reponse: "Une droite horizontale",
    explication: "La valeur de la fonction ne change pas."
  },
  {
    question: "Résoudre l’équation 2x + 4 = 10 donne :",
    options: ["x = 2", "x = 3", "x = 4", "x = 5"],
    bonne_reponse: "x = 3",
    explication: "On soustrait 4 puis on divise par 2."
  },
  {
    question: "Ce graphique peut modéliser :",
    graphique: "graphique3.png",
    options: [
      "Un stock qui augmente",
      "Un stock qui diminue",
      "Un prix fixe",
      "Une vitesse constante"
    ],
    bonne_reponse: "Un stock qui diminue",
    explication: "La fonction décroît avec le temps."
  },
  {
    question: "Une fonction f(x) = 2x + 5 est représentée par un graphique. Que représente le nombre 5 ?",
    options: ["le coefficient directeur", "l’ordonnée à l’origine", "la pente", "l’abscisse"],
    bonne_reponse: "l’ordonnée à l’origine",
    explication: "L’ordonnée à l’origine est la valeur de la fonction pour x = 0."
  },
  {
    question: "Résoudre l’équation 3x = 15 donne :",
    options: ["x = 3", "x = 5", "x = 15", "x = 45"],
    bonne_reponse: "x = 5",
    explication: "On divise les deux membres par 3 : x = 15 ÷ 3."
  },
  {
    question: "Résoudre l’inéquation x + 5 ≥ 12 donne :",
    options: ["x ≤ 7", "x ≥ 7", "x = 7", "x ≤ 12"],
    bonne_reponse: "x ≥ 7",
    explication: "On soustrait 5 aux deux membres."
  },
  {
    question: "Résoudre l’inéquation 4x < 20 donne :",
    options: ["x < 4", "x > 4", "x < 5", "x > 5"],
    bonne_reponse: "x < 5",
    explication: "On divise les deux membres par 4."
  },
  {
    question: "Une fonction f(x) = 7 est représentée graphiquement par :",
    options: ["une droite oblique", "une parabole", "une droite horizontale", "une courbe"],
    bonne_reponse: "une droite horizontale",
    explication: "La fonction est constante : sa valeur ne dépend pas de x."
  },
  {
    question: "La fonction f(x) = 0,5x + 2 est :",
    options: ["décroissante", "constante", "croissante", "négative"],
    bonne_reponse: "croissante",
    explication: "Le coefficient directeur est positif."
  },
  {
    question: "Si une fonction modélise un stock qui baisse chaque jour, elle est plutôt :",
    options: ["croissante", "constante", "décroissante", "linéaire croissante"],
    bonne_reponse: "décroissante",
    explication: "La quantité diminue au fil du temps."
  }
];

/* ============================================================
   ====================  FIN DES QUESTIONS  ==================
   ============================================================ */
