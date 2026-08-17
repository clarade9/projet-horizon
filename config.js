// ═══════════════════════════════════════════════════════════════
// CONFIG.JS — Réglages centralisés de Projet Horizon
//
// Ce fichier regroupe tous les paramètres modifiables du jeu.
// Un formateur ou développeur peut ajuster ces valeurs sans
// chercher dans le reste du code.
//
// ⚠️  Ce fichier doit être chargé EN PREMIER dans index.html,
//     avant tous les autres scripts.
// ═══════════════════════════════════════════════════════════════

const CONFIG = {

  // ── Audio ──────────────────────────────────────────────────
  audio: {
    // Volume des musiques de scène (0 = muet, 1 = maximum)
    volumeMusique:  0.18,

    // Volume des effets sonores (clic dialogue, badge)
    volumeEffets:   0.15,

    // Volume du son de frappe clavier
    volumeClavier:  0.05,

    // Durée du fondu enchaîné entre deux musiques (en secondes)
    dureeCrossfade: 1.5,
  },

  // ── Dialogue ───────────────────────────────────────────────
  dialogue: {
    // Vitesse de l'effet machine à écrire (millisecondes par caractère)
    // Plus le nombre est petit, plus le texte s'affiche vite
    vitesseDefilement: 30,
  },

  // ── Transitions visuelles ──────────────────────────────────
  transitions: {
    // Durée du fondu au noir entre les scènes (ms)
    dureeFonduNoir: 530,

    // Durée d'affichage du titre de chapitre (ms)
    dureeTitreChapitre: 2800,

    // Délai avant le lancement du jeu après le tutoriel (ms)
    delaiApresTutoriel: 450,
  },

  // ── Badges & Notifications ─────────────────────────────────
  badges: {
    // Durée d'affichage du toast de badge débloqué (ms)
    dureeAffichageToast: 3200,

    // Délai minimum entre deux notifications de badge (ms)
    intervalleEntreToasts: 4200,

    // Nombre de SOS requis pour débloquer le badge "Juriste en Herbe"
    sosRequisPourJuriste: 3,

    // Durée maximale d'un chapitre pour débloquer "Speed Runner" (secondes)
    dureeMaxSpeedRunner: 180,

    // Nombre de chapitres joués requis pour "Parcours Complet"
    chapitresRequisPourParcours: 6,
  },

  // ── Accès formateur ────────────────────────────────────────
  formateur: {
    // Code d'accès au tableau de bord formateur
    // ⚠️  Changer ce code avant chaque déploiement
    codeAcces: 'FORMATEUR2025',
  },

  // ── Jauges ────────────────────────────────────────────────
  jauges: {
    // Valeur de départ des trois jauges au début de la partie (0–100)
    valeurDepart: 100,
  },

  // ── Investigation ─────────────────────────────────────────
  investigation: {
    // Nombre d'indices à trouver avant de pouvoir décider.
    // null = tous les indices sont obligatoires (comportement par défaut)
    // Exemple : 2 = le joueur peut décider après 2 indices trouvés
    indicesMinimum: null,
  },

  // ── Clés localStorage ─────────────────────────────────────
  // Ces clés identifient les données sauvegardées dans le navigateur.
  // Les modifier effacera les progressions existantes des joueurs.
  stockage: {
    mute:     'ph_muted',
    badges:   'horizon_badges',
    tutoriel: 'horizon_tutorial_v1',
    sessions: 'horizon_sessions',
  },

};
