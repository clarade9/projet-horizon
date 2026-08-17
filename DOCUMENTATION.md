# Documentation développeur — Projet Horizon

> Guide complet pour maintenir et faire évoluer le serious game.
> Public visé : développeur reprenant le projet, intégrateur RH avec notions JS.

---

## Sommaire

1. [Architecture du projet](#1-architecture-du-projet)
2. [Lancer le projet en local](#2-lancer-le-projet-en-local)
3. [État global du jeu (`etatJeu`)](#3-état-global-du-jeu-etatjeu)
4. [Flux d'une partie](#4-flux-dune-partie)
5. [Ajouter ou modifier un chapitre](#5-ajouter-ou-modifier-un-chapitre)
6. [Ajouter un personnage](#6-ajouter-un-personnage)
7. [Ajouter une scène (décor)](#7-ajouter-une-scène-décor)
8. [Modifier la musique d'ambiance](#8-modifier-la-musique-dambiance)
9. [Modifier les jauges et le scoring](#9-modifier-les-jauges-et-le-scoring)
10. [Système de badges](#10-système-de-badges)
11. [Tutoriel](#11-tutoriel)
12. [Espace formateur](#12-espace-formateur)
13. [Valeurs de configuration centralisées](#13-valeurs-de-configuration-centralisées)
14. [Variables CSS](#14-variables-css)
15. [Erreurs courantes](#15-erreurs-courantes)
16. [Glossaire technique](#16-glossaire-technique)

---

## 1. Architecture du projet

```
projet-horizon/
├── index.html              ← Structure HTML uniquement (aucune logique)
├── config.js               ← Toutes les valeurs configurables (chargé EN PREMIER)
├── CLAUDE.md               ← Instructions pour Claude Code
├── DOCUMENTATION.md        ← Ce fichier
│
├── css/
│   ├── variables.css       ← Tokens CSS (:root) — couleurs, z-index, polices…
│   ├── layout.css          ← Frame, HUD, personnages, boîte de dialogue
│   ├── scenes.css          ← Décors CSS animés par scène
│   ├── panels.css          ← Panneaux de jeu (investigation, choix, verdict…)
│   ├── intro.css           ← Écran d'accueil "Dossier Confidentiel"
│   ├── personalization.css ← Sélection de service, parcours personnalisé
│   ├── badges.css          ← Système de badges (toast, panel, écran de fin)
│   ├── tutorial.css        ← Overlay tutoriel et callout
│   └── mobile.css          ← Ajustements responsive < 640px
│
├── js/
│   ├── main.js             ← Point d'entrée : init, startGame(), utilitaires
│   ├── scenes.js           ← Objet SCENES{}, buildScene(), effets visuels
│   ├── characters.js       ← showChar(), setSpeaking()
│   ├── dialogue.js         ← showDialogueLine(), advDialogue(), typewriter
│   ├── investigation.js    ← startInvestigation(), openClue(), endInvestigation()
│   ├── choices.js          ← showChoicePanel(), choose(), showContext()
│   ├── microdecisions.js   ← showMicroDecision(), chooseMicro()
│   ├── hud.js              ← updateHud(), applyGauges(), dots de chapitres
│   ├── epilogue.js         ← runEpilogue(), showEnd(), calcul du score
│   ├── lexique.js          ← openLex(), closeLex()
│   ├── sos.js              ← openSOS(), closeSOS()
│   ├── tracker.js          ← Enregistrement des sessions (localStorage)
│   ├── badges.js           ← Objet Badges{} : définitions, unlock, affichage
│   ├── audio.js            ← Objet AudioEngine{} : Web Audio API, crossfade
│   ├── tutorial.js         ← Objet Tutorial{} : étapes, overlay, callout
│   │
│   └── data/
│       ├── prologue.js     ← PROLOGUE[] — lignes de dialogue d'introduction
│       ├── chapters.js     ← CHAPTERS[] — les 4 chapitres du jeu
│       └── epilogue-data.js ← EPILOGUE[] — lignes de l'épilogue narratif
│
└── assets/
    ├── characters/         ← Portraits PNG des personnages (ex: dominique.png)
    ├── musique-principale.mp3
    ├── musique-tutoriel.mp3
    ├── musique-rh.mp3
    ├── musique-resto.mp3
    ├── musique-pesée.mp3
    ├── musique-indus.mp3
    ├── musique-epilogue.mp3
    └── (effets sonores .mp3)
```

**Règle d'or :** les fichiers JS se chargent dans l'ordre déclaré dans `index.html`. `config.js` doit toujours être le premier `<script>`.

---

## 2. Lancer le projet en local

Le jeu utilise l'API Web Audio et charge des fichiers MP3, ce qui nécessite un serveur HTTP (pas d'ouverture directe du fichier `index.html`).

```bash
# Option 1 — Node.js
npx serve .

# Option 2 — Python
python3 -m http.server 8080

# Puis ouvrir dans le navigateur
open http://localhost:8080
```

---

## 3. État global du jeu (`etatJeu`)

Objet unique partagé par tous les modules, déclaré dans `main.js` :

```js
const etatJeu = {
  ch: 0,          // Index du chapitre courant (0 = chapitre 1)
  phase: '',      // Phase active (voir tableau ci-dessous)
  dlgIdx: 0,      // Index de la ligne de dialogue en cours
  invFound: 0,    // Nombre d'indices trouvés dans l'investigation
  gauges: {
    i: 100,       // Jauge Intégrité (0–100)
    p: 100,       // Jauge Projet (0–100)
    m: 100        // Jauge Image SEM (0–100)
  },
  choices: [],    // Historique des types de choix : 'good' | 'warn' | 'bad'
  choiceOrder: [] // Ordre mélangé des 3 options du choix principal
};
```

### Phases possibles

| Valeur de `phase` | Description |
|---|---|
| `'prologue'` | Dialogue d'introduction |
| `'tutorial'` | Tutoriel interactif |
| `'context'` | Carte de contexte du chapitre |
| `'micro-0'` | Première micro-décision |
| `'dialogue'` | Dialogue principal du chapitre |
| `'micro-1'` | Deuxième micro-décision |
| `'investigation'` | Phase d'exploration des indices |
| `'choice'` | Panneau de choix principal |
| `'verdict'` | Affichage des conséquences |
| `'recap'` | Fiche récapitulative |
| `'epilogue'` | Dialogue de conclusion |
| `'end'` | Écran de fin |

---

## 4. Flux d'une partie

```
Intro (dossier confidentiel)
  └─► Sélection de service (optionnel)
        └─► Prologue (dialogue narratif)
              └─► Tutoriel (si première partie)
                    └─► [Pour chaque chapitre 0–3]
                          ├─ Titre du chapitre (animation)
                          ├─ Carte de contexte
                          ├─ Micro-décision 1 (optionnelle)
                          ├─ Dialogue principal
                          ├─ Micro-décision 2 (optionnelle)
                          ├─ Investigation (indices cliquables)
                          ├─ Choix principal (A / B / C)
                          ├─ Verdict + analyse juridique
                          └─ Fiche récapitulative
                                └─► Épilogue
                                      └─► Écran de fin (score + badges)
```

---

## 5. Ajouter ou modifier un chapitre

Tous les chapitres sont dans `js/data/chapters.js`, dans le tableau `CHAPTERS[]`.

### Structure complète d'un chapitre

```js
{
  num: "Chapitre 2",
  name: "Le Déjeuner d'Affaires",
  sub: "Corruption passive",
  sc: "resto",                    // Clé de scène (voir section 7)
  playerRole: "Alex — Directeur Administratif",

  // Carte de contexte (affichée avant le dialogue)
  context: {
    eye: "🍽️ Situation",
    title: "Une invitation inattendue",
    body: "M. Laroche vous a invité dans un <em>restaurant étoilé</em>…"
  },

  // Micro-décisions (tableau de 0, 1 ou 2 entrées)
  microDecisions: [
    {
      situation: "Votre assistant vous demande…",
      choices: [
        {
          desc: "Décliner poliment",
          reaction: {
            sp: "Narrateur",
            ch: null,          // null = pas de personnage affiché
            txt: "Vous prenez note de l'invitation."
          }
          // Pas de 'gauges' sur la micro-décision 1 (impact nul)
        },
        { desc: "Accepter sans réfléchir", reaction: { … } },
        { desc: "Demander un avis juridique", reaction: { … } }
      ]
    },
    {
      // Micro-décision 2 : a un impact réel sur les jauges
      situation: "Au cours du repas, M. Laroche glisse une enveloppe…",
      choices: [
        {
          desc: "Refuser catégoriquement",
          reaction: { sp: "Alex", ch: { css: "c-alex", em: "👤", nm: "Alex" }, txt: "…" },
          gauges: { i: 0, p: 0, m: 0 },
          tint: false           // true = flash rouge sur le HUD
        },
        { desc: "Hésiter", gauges: { i: -5, p: 0, m: -5 }, tint: true, reaction: { … } },
        { desc: "Accepter", gauges: { i: -15, p: 5, m: -10 }, tint: true, reaction: { … } }
      ]
    }
  ],

  // Dialogue principal (tableau de lignes)
  dialogue: [
    {
      sp: "M. Laroche",                              // Nom affiché dans la bulle
      ch: { css: "c-laroche", em: "👔", nm: "M. Laroche — Commercial" },
      sc: "resto",                                   // Changement de scène optionnel
      txt: "Ravi de vous recevoir, <em>cher ami</em>…"
    },
    {
      sp: "Narrateur",
      ch: null,
      txt: "L'atmosphère est chaleureuse, presque trop."
    }
  ],

  // Indices d'investigation (au moins 2, idéalement 3–4)
  clues: [
    {
      ic: "📄",
      label: "Note de frais",
      sub: "Document comptable",
      title: "Note de frais anormale",
      body: "Le montant dépasse le plafond réglementaire de <em>150 €</em>…",
      alert: "<strong>⚠ Point de vigilance :</strong> Tout repas d'affaires doit être déclaré."
    }
  ],

  // Choix principal (exactement 3 options)
  choices: [
    {
      desc: "Refuser et signaler à la direction",
      type: "good",
      badge: "✅ Exemplaire",
      bc: "badge-good",
      vTitle: "Intégrité préservée",
      vConsequence: "Vous avez su résister à la pression…",
      vLegal: "La corruption passive (art. 432-11 CP) est punie de 10 ans d'emprisonnement…",
      lc: "good",
      gauges: { i: 15, p: -5, m: 10 }
    },
    {
      desc: "Accepter le déjeuner mais refuser le cadeau",
      type: "warn",
      badge: "⚠️ Prudent",
      bc: "badge-warn",
      vTitle: "Risque mesuré",
      vConsequence: "Votre prudence est relative…",
      vLegal: "Même sans contrepartie formelle, l'acceptation d'avantages peut constituer…",
      lc: "warn",
      gauges: { i: -5, p: 5, m: -5 }
    },
    {
      desc: "Accepter l'enveloppe",
      type: "bad",
      badge: "❌ Compromis",
      bc: "badge-bad",
      vTitle: "Faute grave",
      vConsequence: "Vous venez d'accepter un avantage illicite…",
      vLegal: "Vous êtes exposé à des poursuites pour corruption passive…",
      lc: "",
      gauges: { i: -25, p: 10, m: -20 }
    }
  ],

  // Fiche récapitulative (affichée après le verdict)
  recap: {
    eyebrow: "Ce qu'il faut retenir",
    risk: "Corruption passive",
    def: "Accepter un avantage en échange d'un acte de sa fonction…",
    gestures: [
      "Déclarer tout avantage reçu supérieur à 150 €",
      "Consulter le référent déontologue en cas de doute",
      "Conserver la traçabilité des repas d'affaires"
    ],
    reallife: {
      title: "Cas réel documenté",
      body: "En 2019, un directeur de SEM a été condamné à 3 ans…"
    }
  },

  // SOS Déontologue (aide contextuelle sans impact sur le score)
  sos: {
    situation: "M. Laroche vous invite dans un restaurant étoilé…",
    questions: [
      "Ce déjeuner entre-t-il dans le cadre d'une relation commerciale normale ?",
      "Avez-vous déclaré cette invitation à votre hiérarchie ?"
    ],
    reasoning: "Tout avantage reçu dans le cadre de votre fonction doit être évalué…",
    law: { label: "Art. 432-11 Code pénal", url: "https://www.legifrance.gouv.fr/…" }
  },

  // Texte de transition vers le chapitre suivant
  transition: {
    sp: "Narrateur",
    txt: "Quelques semaines plus tard, une nouvelle situation se présente…"
  }
}
```

### Checklist pour un nouveau chapitre

- [ ] Ajouter l'entrée dans `CHAPTERS[]` (chapitres.js)
- [ ] Vérifier que la clé `sc` correspond à une scène existante dans `SCENES{}`
- [ ] Vérifier que tous les personnages référencés ont un portrait dans `assets/characters/`
- [ ] Ajouter un dot dans le HUD si nécessaire (ajuster `#cdots` dans `index.html`)
- [ ] Vérifier l'équilibre des jauges (voir section 9)
- [ ] Tester les 3 fins possibles (all-good, all-bad, mixte)

---

## 6. Ajouter un personnage

### 1. Préparer le portrait

Placer une image PNG dans `assets/characters/` :
- Nom : `prenom.png` (minuscules, sans accents, sans espaces)
- Format recommandé : fond transparent, personnage debout, hauteur ~800px
- Exemple : `morgan.png`

### 2. Référencer dans les données

Dans les dialogues ou micro-décisions, utiliser :

```js
ch: {
  css: "c-morgan",          // préfixe "c-" + nom du fichier sans .png
  em:  "👤",               // emoji de secours (non affiché actuellement)
  nm:  "Morgan — HSE"       // nom affiché dans le badge sous le portrait
}
```

### 3. Ajuster la position si nécessaire

Si la scène nécessite un recadrage spécifique, ajouter une entrée dans `POSITIONS_PNJ` dans `js/characters.js` :

```js
const POSITIONS_PNJ = {
  // …entrées existantes…
  ma-scene: { right: '6%', bottom: '12%', height: '58vh' },
};
```

### Personnages existants

| Fichier | Nom affiché | Scène principale |
|---|---|---|
| `dominique.png` | Dominique | Prologue, épilogue |
| `alex.png` | Alex | RH |
| `vallet.png` | M. Vallet | RH |
| `jordan.png` | Jordan | Pesée |
| `laroche.png` | M. Laroche | Restaurant |
| `sam.png` | Sam | Industriel |
| `patrice.png` | Patrice | Pesée |
| `morgan.png` | Morgan | Industriel |
| `lefebvre.png` | M. Lefebvre | Industriel |
| `formatrice.png` | La Formatrice | Tutoriel |

---

## 7. Ajouter une scène (décor)

### 1. CSS — `css/scenes.css`

```css
/* ══ NOUVELLE SCÈNE : salle-conseil ══ */
.sc-salle-conseil {
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
}
/* Éléments décoratifs animés */
.sc-salle-conseil .sc-table {
  position: absolute;
  bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 30%;
  background: #2a1a0a;
  border-radius: 8px 8px 0 0;
}
```

Toujours préfixer les éléments internes avec `.sc-[nom]` pour éviter les conflits.

### 2. JS — `js/scenes.js`

Dans l'objet `SCENES`, ajouter :

```js
'salle-conseil': {
  build() {
    const sc = document.createElement('div');
    sc.className = 'sc-salle-conseil';
    sc.innerHTML = '<div class="sc-table"></div>';
    return sc;
  },
  enter() {
    AudioEngine.playSceneMusic('assets/musique-conseil.mp3');
  }
}
```

### 3. Référencer dans un chapitre

```js
sc: "salle-conseil"
```

Et si la position du personnage doit être ajustée, ajouter dans `POSITIONS_PNJ` (voir section 6.3).

---

## 8. Modifier la musique d'ambiance

La correspondance scène → fichier MP3 est dans `js/audio.js`, objet `SCENE_TRACKS` :

```js
const SCENE_TRACKS = {
  prologue:  'assets/musique-principale.mp3',
  rh:        'assets/musique-rh.mp3',
  resto:     'assets/musique-resto.mp3',
  pesee:     'assets/musique-pesée.mp3',
  indus:     'assets/musique-indus.mp3',
  epilogue:  'assets/musique-epilogue.mp3',
  tutorial:  'assets/musique-tutoriel.mp3',
};
```

Pour changer une musique : remplacer le fichier MP3 dans `assets/` (garder le même nom) ou changer le chemin dans `SCENE_TRACKS`.

### Volumes

Dans `config.js` :

```js
audio: {
  volumeMusique:    0.35,  // volume de la musique de scène (0–1)
  volumeEffets:     0.30,  // volume des effets sonores
  volumeClavier:    0.10,  // volume du bruit de frappe (typewriter)
  dureeCrossfade:   1.5,   // durée du fondu enchaîné en secondes
}
```

### Ajouter un effet sonore

Dans `js/audio.js`, utiliser :

```js
AudioEngine.playSfx('assets/mon-effet.mp3');
```

---

## 9. Modifier les jauges et le scoring

### Valeurs de départ

Dans `config.js` :
```js
jauges: { valeurDepart: 100 }
```

### Équilibre recommandé

Sur 4 chapitres en choisissant toujours le meilleur choix (`type: "good"`), les jauges doivent rester entre **75 et 90**. En choisissant toujours le pire (`type: "bad"`), elles doivent descendre sous **40**.

Outil de vérification rapide (console navigateur) :
```js
// Simuler all-good
CHAPTERS.forEach(ch => {
  const good = ch.choices.find(c => c.type === 'good');
  console.log(ch.name, good.gauges);
});
```

### Calcul du score final

Dans `js/epilogue.js`, `showEnd()` :
1. Moyenne des 3 jauges finales → `scoreMoyen`
2. Nombre de choix `'bad'` → `nbBad`
3. Résultat :
   - `nbBad >= 2` → écran Journal (mauvais)
   - `nbBad === 1` → écran Avertissement (moyen)
   - `nbBad === 0` → écran Certifié (bon)

---

## 10. Système de badges

Les badges sont définis dans `js/badges.js`, tableau `BADGE_DEFS[]` :

```js
{
  id: 'juriste',
  em: '⚖️',
  name: 'Juriste en herbe',
  desc: 'A consulté le SOS Déontologue 3 fois',
  check(ctx) {
    return Tracker.sosCalls() >= CONFIG.badges.sosRequisPourJuriste;
  }
}
```

### Événements déclencheurs

`Badges.check(event, contexte)` est appelé à ces moments :

| Événement | Appelé depuis | Contexte passé |
|---|---|---|
| `'chapterEnd'` | `choices.js` | `{ chIdx, type }` |
| `'gameEnd'` | `epilogue.js` | `{ choices, score }` |
| `'sosUsed'` | `sos.js` | — |
| `'speedRun'` | `epilogue.js` | `{ dureeSecondes }` |

### Persistence

Les badges débloqués sont sauvegardés dans `localStorage` sous la clé définie dans `config.js` :
```js
stockage: { badges: 'horizon_badges' }
```

---

## 11. Tutoriel

Le tutoriel se déclenche automatiquement à la première partie (état sauvegardé en `localStorage`).

Les étapes sont définies dans `js/tutorial.js`, tableau `TUTORIAL_STEPS[]` :

```js
{
  title: "Le HUD",
  text: "Ces trois jauges mesurent votre intégrité…",
  target: "hud",     // id de l'élément mis en surbrillance (ou null)
  position: "below"  // 'below' | 'above' | 'center'
}
```

Pour forcer le rejeu du tutoriel (debug) :
```js
localStorage.removeItem('horizon_tutorial_v1');
location.reload();
```

Pour désactiver le tutoriel complètement, passer `Tutorial.skip()` au démarrage dans `main.js`.

---

## 12. Espace formateur

Accessible depuis l'écran d'intro via le bouton "🔒 Espace formateur".

Le code d'accès est dans `config.js` :
```js
formateur: { codeAcces: 'FORMATEUR2025' }
```

**À changer avant tout déploiement en production.**

L'espace formateur affiche les statistiques de sessions enregistrées par `js/tracker.js` (localStorage). Les données sont lisibles dans la console :
```js
JSON.parse(localStorage.getItem('horizon_sessions'));
```

---

## 13. Valeurs de configuration centralisées

Toutes dans `config.js` (chargé en premier) :

```js
const CONFIG = {
  audio: {
    volumeMusique:  0.35,   // volume musique de scène
    volumeEffets:   0.30,   // volume effets sonores
    volumeClavier:  0.10,   // volume typewriter
    dureeCrossfade: 1.5     // fondu enchaîné en secondes
  },
  dialogue: {
    vitesseDefilement: 30   // ms entre chaque caractère (typewriter)
  },
  transitions: {
    dureeFonduNoir:    530, // ms — fondu noir entre scènes
    dureeTitreChapitre: 2800, // ms — affichage du titre de chapitre
    delaiApresTutoriel: 450   // ms — pause après fermeture tutoriel
  },
  badges: {
    dureeAffichageToast:    3200, // ms — durée d'affichage du toast
    intervalleEntreToasts:  4200, // ms — délai entre deux toasts
    sosRequisPourJuriste:   3,    // nb d'appels SOS pour débloquer le badge
    dureeMaxSpeedRunner:    180,  // secondes max pour le badge speed-run
    chapitresRequisPourParcours: 6
  },
  formateur: {
    codeAcces: 'FORMATEUR2025'
  },
  jauges: {
    valeurDepart: 100
  },
  investigation: {
    indicesMinimum: null    // null = tous les indices requis
  },
  stockage: {
    mute:     'ph_muted',
    badges:   'horizon_badges',
    tutoriel: 'horizon_tutorial_v1',
    sessions: 'horizon_sessions'
  }
};
```

---

## 14. Variables CSS

Toutes dans `css/variables.css`. Groupes principaux :

| Groupe | Préfixe | Exemples |
|---|---|---|
| Palette | `--navy`, `--gold`… | Couleurs principales |
| Jauges | `--jauge-*` | `--jauge-integrite: #22c55e` |
| États | `--etat-*` | `--etat-bon`, `--etat-risque`, `--etat-mauvais` |
| Polices | `--font-*` | `--font-titre`, `--font-texte`, `--font-mono` |
| Espacement | `--espace-*` | `--espace-sm: 8px` à `--espace-2xl: 32px` |
| Rayon | `--rayon-*` | `--rayon-md: 12px`, `--rayon-rond: 999px` |
| Bordures | `--bordure*` | `--bordure: 1.5px`, `--bordure-fine: 1px` |
| Dimensions | `--hauteur-barre` | `5.5vh` — hauteur du HUD |
| Animations | `--anim-*` | `--anim-normale: 0.35s` |
| Calques | `--z-*` | `--z-dialogue: 100`, `--z-toast: 300` |

Pour modifier la hauteur du HUD, changer uniquement `--hauteur-barre` dans `variables.css`.

---

## 15. Erreurs courantes

### Le jeu ne démarre pas / écran blanc

1. Vérifier la console navigateur (F12)
2. S'assurer de lancer via un serveur HTTP (pas `file://`)
3. Vérifier que `config.js` est le **premier** `<script>` dans `index.html`

### La musique ne se lance pas

L'API Web Audio nécessite une interaction utilisateur préalable (politique navigateur). C'est normal sur le premier clic — `AudioEngine` est initialisé au premier `startGame()`.

### Un personnage n'apparaît pas

- Vérifier que le fichier PNG existe dans `assets/characters/` avec le bon nom (sans "c-")
- Vérifier la casse : `dominique.png` ≠ `Dominique.png`
- Vérifier que la propriété `css` commence bien par `"c-"` dans les données

### Les choix sont toujours dans le même ordre

Le mélange est fait par `melangerTableau()` au moment de l'affichage. Si les options semblent fixes, vérifier que la fonction est bien appelée (ne pas pré-calculer `choiceOrder` au chargement de la page).

### Le score final est incorrect

- Vérifier que chaque `choices[]` a exactement 3 entrées avec des `type` valides (`'good'`, `'warn'`, `'bad'`)
- Vérifier que `etatJeu.choices` s'incrémente bien à chaque chapitre (1 entrée par chapitre)

### Les badges ne se débloquent pas

- Vérifier que `Badges.check(event, ctx)` est bien appelé au bon endroit
- Vider le localStorage si les badges sont "bloqués" en état incorrect :
  ```js
  localStorage.removeItem('horizon_badges');
  ```

### Modification ignorée après rechargement

Vider le cache navigateur (Cmd+Shift+R sur Mac) — les MP3 et JS peuvent être mis en cache de façon agressive.

---

## 16. Glossaire technique

| Terme | Définition |
|---|---|
| `etatJeu` | Objet global unique contenant l'état complet de la partie en cours |
| `phase` | Chaîne de caractères décrivant l'étape active du jeu |
| `CHAPTERS[]` | Tableau contenant les données des 4 chapitres (js/data/chapters.js) |
| `SCENES{}` | Objet associant une clé de scène à ses fonctions `build()` et `enter()` |
| `melangerTableau()` | Algorithme de Fisher-Yates — mélange un tableau sans biais |
| `applyGauges(deltas)` | Applique `{ i, p, m }` aux jauges et met à jour le HUD |
| `twStart(el, txt, ms)` | Lance l'animation typewriter sur un élément DOM |
| `$(id)` | Raccourci pour `document.getElementById(id)` |
| `AudioEngine` | Module IIFE gérant Web Audio API, crossfade et effets sonores |
| `Badges` | Module IIFE gérant les définitions, déverrouillages et affichages des badges |
| `Tutorial` | Module IIFE gérant les étapes du tutoriel et l'overlay |
| `Tracker` | Module IIFE sauvegardant les sessions de jeu dans localStorage |
| `CONFIG` | Objet global (config.js) centralisant toutes les valeurs configurables |
| `POSITIONS_PNJ` | Table de positionnement CSS des portraits de personnages par scène |
| `choiceOrder` | Tableau `[0,1,2]` mélangé — évite que la "bonne réponse" soit toujours en position A |
| Typewriter | Effet d'apparition caractère par caractère du texte de dialogue |
| Crossfade | Transition audio : fondu sortant sur la piste actuelle + fondu entrant sur la suivante |
| Toast | Notification temporaire (badge débloqué) qui glisse depuis le haut de l'écran |
| HUD | Interface permanente affichant les 3 jauges et les dots de chapitres |
| Micro-décision | Choix intermédiaire sans enjeu fort, servant à impliquer le joueur avant le choix principal |
| SOS Déontologue | Panneau latéral d'aide juridique contextuelle, sans impact sur le score |
