// ═══════════════════════════════════════════════════════════════
// MINI-JEUX DE DÉFINITIONS
// Interludes ludiques après les affaires 3, 6 et 9 (ch = 2, 5, 8)
// ═══════════════════════════════════════════════════════════════

const MINI_JEUX = {

  // Après affaire 3 (ch=2) — Thème : Affaires 1, 2, 3
  2: {
    titre: "Connaissez-vous ces infractions ?",
    intro: "Associez chaque infraction à sa définition juridique.",
    rappelPedago: "Ces infractions sont toutes passibles de poursuites pénales. La méconnaissance de la loi n'est jamais une excuse.",
    paires: [
      {
        terme: "Prise illégale d'intérêts",
        definition: "Participer à une décision dans laquelle on a un intérêt personnel ou familial."
      },
      {
        terme: "Favoritisme",
        definition: "Avantager un candidat à un marché public en violant les règles d'égalité de traitement."
      },
      {
        terme: "Détournement de fonds",
        definition: "Soustraire des fonds publics qui vous sont confiés dans l'exercice de vos fonctions."
      },
      {
        terme: "Faux en écriture",
        definition: "Altérer sciemment la vérité dans un document officiel de nature à causer un préjudice."
      }
    ]
  },

  // Après affaire 6 (ch=5) — Thème : Affaires 4, 5, 6
  5: {
    titre: "Maîtrisez-vous le vocabulaire ?",
    intro: "Associez chaque notion à sa définition dans le droit de la commande publique.",
    rappelPedago: "Ces infractions sont toutes passibles de poursuites pénales. La méconnaissance de la loi n'est jamais une excuse.",
    paires: [
      {
        terme: "Corruption passive",
        definition: "Accepter un avantage pour accomplir ou omettre un acte lié à sa fonction."
      },
      {
        terme: "Trafic d'influence",
        definition: "User de son influence sur une autorité publique en échange d'un avantage."
      },
      {
        terme: "Concussion",
        definition: "Renoncer délibérément à percevoir ce qui est légalement dû à une collectivité."
      },
      {
        terme: "Déclaration mensongère",
        definition: "Présentation intentionnellement inexacte de faits dans le cadre d'une procédure officielle."
      }
    ]
  },

  // Après affaire 9 (ch=8) — Thème : Affaires 7, 8, 9
  8: {
    titre: "Les formes de la corruption",
    intro: "Distinguez les différentes infractions liées à la corruption.",
    rappelPedago: "Ces infractions sont toutes passibles de poursuites pénales. La méconnaissance de la loi n'est jamais une excuse.",
    paires: [
      {
        terme: "Corruption active",
        definition: "Proposer un avantage à un agent public pour obtenir une décision favorable."
      },
      {
        terme: "Mécénat de complaisance",
        definition: "Don ou sponsoring conditionné à une contrepartie administrative, même implicitement."
      },
      {
        terme: "Recel",
        definition: "Détenir ou utiliser un bien dont on sait qu'il provient d'un crime ou d'un délit."
      },
      {
        terme: "Contrat de complaisance",
        definition: "Paiement sans contrepartie réelle servant à masquer un avantage illicite."
      }
    ]
  }
};
