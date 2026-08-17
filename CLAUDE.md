# Projet Horizon — Serious Game Anticorruption
## Configuration Claude Code

---

## 🎯 Présentation du projet

**Projet Horizon** est un serious game narratif de formation anticorruption.
Le joueur incarne un chargé de mission supervisant l'ouverture d'un centre de valorisation.
À chaque chapitre, il fait face à des situations de corruption et doit prendre des décisions.

- **Type :** Jeu narratif HTML/CSS/JS vanilla (aucun framework)
- **Structure :** Prologue → 10 affaires → Épilogue → Écran de fin
- **Durée :** ~45 minutes de jeu
- **Public :** Agents SEM, formation conformité Sapin II
- **Déploiement :** Vercel — `npx vercel --prod` → https://projet-horizon-sem.vercel.app

---

## 🗂️ Architecture des fichiers

```
projet-horizon/
├── index.html                  ← Entrée principale, structure HTML uniquement
├── live-formateur.html         ← Mode Live — écran projeté formateur
├── live-joueur.html            ← Mode Live — écran mobile participants
├── favicon.ico                 ← Favicon multi-taille (16+32px)
├── manifest.json               ← Manifeste PWA
├── sw.js                       ← Service Worker PWA offline (Cache First / Network First)
├── CLAUDE.md                   ← Ce fichier
├── css/
│   ├── variables.css           ← Tokens CSS (:root), html/body, --safe-bottom
│   ├── layout.css              ← Frame #game, HUD, dialogue #dlg, phone overlay
│   ├── scenes.css              ← Décors CSS animés
│   ├── panels.css              ← Investigation, choices, verdict, end screen, lexique
│   ├── intro.css               ← Écran d'introduction + splash screen
│   ├── personalization.css     ← Personnalisation service/parcours
│   ├── mobile.css              ← Responsive mobile
│   ├── badges.css              ← Système de badges
│   ├── tutorial.css            ← Tutoriel interactif
│   ├── map-select.css          ← Carte de sélection de parcours
│   └── live.css                ← Mode Live — styles autonomes (tokens --lv-*, responsive)
├── js/
│   ├── main.js                 ← Initialisation, etatJeu, startGame(), _setAppHeight()
│   ├── scenes.js               ← SCENES{} object, buildScene(), revealScenePhone(), showPhoneAnimation()
│   ├── characters.js           ← showChar(), setSpeaking(), char templates
│   ├── dialogue.js             ← showDlg(), hideDlg(), advDialogue(), showDialogueLine()
│   ├── reflexe-pro.js          ← startInvestigation(), endInvestigation(), openClue() (stub)
│   │                             Remplace interrogatoire.js — phase "Bon Réflexe Professionnel"
│   ├── live-session.js         ← LiveSession — moteur Supabase Realtime partagé (formateur + joueur)
│   ├── live-formateur.js       ← Logique UI écran formateur (lfInit, lfOuvrirVotes, timer SVG…)
│   ├── live-joueur.js          ← Logique UI écran joueur (ljRejoindre, ljVoter, confetti…)
│   ├── choices.js              ← showChoicePanel(), choose(), showContext(), closeContext()
│   │                             closeContext() gère preDialogue[] avant MD0
│   ├── microdecisions.js       ← showMicroDecision(), chooseMicro()
│   ├── hud.js                  ← updateHud(), applyGauges(), chapter dots
│   ├── epilogue.js             ← runEpilogue(), showEnd(), écrans de fin (dark theme)
│   ├── lexique.js              ← openLex(), closeLex()
│   ├── quiz.js                 ← Quiz de validation des acquis (résultat → localStorage)
│   ├── preloader.js            ← Splash screen + préchargement 36 assets (scenes + characters)
│   ├── audio.js                ← AudioEngine — musique, SFX, sfx.phoneRing(), sfx.vibrate()
│   ├── badges.js               ← Badges.check(), Badges.endScreenHTML(), badges contextuels (7)
│   ├── streak.js               ← showStreakAnimation(), updateStreakHUD() — séries bonnes décisions
│   ├── lexique.js              ← openLex(), closeLex(), afficherTooltipLexique()
│   ├── tracker.js              ← Tracker.finalize(), Tracker.recordQuiz()
│   └── data/
│       ├── prologue.js         ← PROLOGUE[] array
│       ├── chapters.js         ← CHAPTERS[] array (10 affaires, incl. recap.jurisprudence)
│       ├── epilogue-data.js    ← EPILOGUE[] array
│       └── lexique-data.js     ← LEXIQUE{} — 12 termes juridiques avec def + ref (chargé sans defer)
├── assets/
│   ├── scenes/                 ← Décors JPEG + téléphones WebP
│   ├── characters/             ← Portraits PNG des personnages
│   ├── audio/                  ← Musiques et SFX
│   └── icons/
│       ├── logo.png            ← Logo source (peut avoir fond blanc)
│       ├── logo-transparent.png← Logo sans fond blanc (généré par scripts/remove-bg.js)
│       ├── favicon-16x16.png   ← Favicons onglets
│       ├── favicon-32x32.png
│       ├── apple-touch-icon.png← iPhone home screen (180x180)
│       └── icon-*.png          ← Icônes PWA (72 à 512px)
└── scripts/
    ├── generate-icons.js       ← Génère toutes les icônes depuis logo.png
    └── remove-bg.js            ← Supprime le fond blanc → logo-transparent.png
                                   puis régénère toutes les icônes
```

---

## 🧠 State global (objet `etatJeu`)

```js
let etatJeu = {
  phase:           'intro',    // 'intro'|'prologue'|'dialogue'|'investigation'|'choice'|'verdict'|'epilogue'|'tutorial'|'transition'
  ch:              0,          // index du chapitre actuel (dans CHAPTERS[])
  dlgIdx:          0,          // index de la ligne de dialogue en cours
  invFound:        0,          // nombre d'indices trouvés (obsolète — conservé pour compatibilité)
  reflexeResult:   null,       // { qType, aType, overall } — résultat phase Réflexe Pro
  gauges:          { i: 70, p: 70, m: 70 }, // Intégrité, Performance Projet, Image SEM
  choices:         [],         // historique des types : 'good'|'warn'|'bad'
  choiceDetails:   [],         // détails de chaque choix (pour écran de fin)
  chOrder:         [0..9],     // ordre de jeu des chapitres selon le service
  chPos:           -1,         // position courante dans chOrder
  priorityCount:   10,         // nombre de chapitres prioritaires
  sceneOverride:   null,       // scène alternative choisie via micro-décision
  dialogueOverride:null,       // tableau de dialogue recompilé selon MD1
  service:         null,       // id du service ('rh','achats','finance'…)
  // Ajouts récents
  streak:          0,          // bonnes décisions consécutives en cours
  streakApresEchec:0,          // bonnes décisions consécutives depuis la dernière mauvaise
  decisionRapide:  false,      // true si choix 'good' fait en < 15s (badge sousPression)
  reflexeGood:     {},         // { [chIdx]: true } — chapitres avec Réflexe Pro 'good'
  quizScore:       0,          // score quiz final (0–10)
  secondEssai:     false,      // true = mode second essai (pas de save)
  secondEssaiCh:   null,       // index du chapitre rejoué
}
```

---

## ⚖️ Jauges et scoring

| Jauge | Couleur | Description |
|-------|---------|-------------|
| Intégrité (`i`) | `#22c55e` | Respect des règles anticorruption |
| Performance Projet (`p`) | `#60a0f8` | Avancement et qualité du projet |
| Image SEM (`m`) | `#d888f8` | Réputation de la structure |

**Scoring final :**
- 0 bad → "Certifié Intégrité" — écran badge vert + confetti
- 1 bad → "Avertissement Formel" — lettre RH style dark
- ≥ 2 bad → "Scandale" — une de journal style dark + formation obligatoire

---

## 🎭 Personnages

| ID CSS | Nom | Rôle |
|--------|-----|------|
| `c-dominique` | Dominique | DG de la SEM |
| `c-alex` | Alex | Responsable RH |
| `c-vallet` | M. Vallet | Administrateur / élu |
| `c-jordan` | Jordan | Responsable Achats |
| `c-laroche` | M. Laroche | Commercial GlobalTri |
| `c-sam` | Sam | Chef de Site |
| `c-patrice` | Patrice | Chauffeur ViteDéchets |
| `c-morgan` | Morgan | Responsable HSE |
| `c-lefebvre` | M. Lefebvre | Directeur BioTerram |
| `c-perrin` | M. Perrin | DST Val-Vert |
| `c-renaud` | M. Renaud | Directeur financier |
| `c-fontaine` | M. Fontaine | Maire de Villenord (Affaire 9) |

Fichiers portraits : `assets/characters/[nom].png`

---

## 📋 Structure d'un chapitre (CHAPTERS[])

```js
{
  num: "Affaire N",
  name: "Titre",
  sub: "Sous-thème",
  sc: "nom-scene",           // clé dans SCENES{}
  playerRole: "Prénom — Rôle",
  context: {
    eye: "Emoji Titre",
    title: "Titre contexte",
    body: "HTML description"
  },
  // Optionnel — lignes affichées AVANT MD0, après la carte contexte
  preDialogue: [
    { sp: "Narrateur", sc: "scene", txt: "HTML texte" }
  ],
  // Micro-décisions (avant le dialogue principal)
  microDecisions: [
    {
      phoneRing: true,          // optionnel — déclenche showPhoneAnimation() avant d'afficher le panel
      situation: "HTML texte",
      choices: [
        { txt: "Libellé choix", reaction: "HTML réaction", sc: "scene", type: "good|warn|bad" }
      ]
    }
  ],
  dialogue: [
    { sp: "Nom", ch: { css: "c-xxx", em: "emoji", nm: "Nom — Titre" }, sc: "scene", txt: "HTML texte",
      phoneRing: true }  // optionnel — déclenche showPhoneAnimation() avant cette ligne
  ],
  clues: [
    { ic: "emoji", label: "Nom indice", sub: "Sous-titre", title: "Titre popup", body: "HTML contenu", alert: "HTML alerte" }
  ],
  pressureIntro: "Texte montrant la pression exercée sur le joueur avant les 3 choix",
  choices: [
    {
      desc: "Description du choix (acte sous pression — Investigation=COMMENT, Décision=QUOI)",
      type: "bad|warn|good",
      badge: "emoji Libellé",
      bc: "badge-bad|badge-warn|badge-good",
      vTitle: "Titre verdict",
      vConsequence: "HTML conséquence",
      vLegal: "HTML analyse juridique",
      gauges: { i: +/-N, p: +/-N, m: +/-N }
    }
  ],
  recap: {
    gestures: ["Bon réflexe à retenir…"],  // affiché dans les points d'attention (écran de fin)
    jurisprudence: {                        // optionnel — citation d'affaire réelle similaire
      titre:  "CA Nancy 2019",
      resume: "Description courte du cas réel",
      source: "Réf. juridique"
    }
  },
  transition: { sp: "Narrateur", txt: "HTML texte de transition" }
}
```

### Moteur `preDialogue`
Si un chapitre a un tableau `preDialogue`, ces lignes sont affichées **après** la carte contexte mais **avant** MD0. Géré dans `closeContext()` (`js/choices.js`). Permet d'insérer une ligne narrateur de mise en scène sans perturber `etatJeu.dlgIdx`.

### Moteur `phoneRing`
- Sur une **micro-décision** : `phoneRing: true` → déclenche `showPhoneAnimation(imgFile, callback)` avant d'afficher le panel MD. L'image est déduite de la scène courante via `_phoneImgFromScene()` dans `dialogue.js`.
- Sur une **ligne de dialogue** : même mécanisme, déclenché dans `advDialogue()`.

### Moteur `pressureIntro`
Champ optionnel sur chaque chapitre. Affiché dans `#choices-pressure` (au-dessus des 3 choix) via `showChoicePanel()`. Styléen bandeau ambre italique. Masqué automatiquement si vide (`:empty` CSS).

### Phase "Bon Réflexe Professionnel" (`js/reflexe-pro.js`)
Remplace la phase investigation. Affiché entre le dialogue et le panel de choix.
- Joueur sélectionne **2 questions parmi 4** ET **2 actions parmi 4** (pas de feedback immédiat)
- Évaluation par combinaisons : `REFLEXE_DATA[ch].combos.questions/actions.{good,warn,bad}`
- Résultat stocké dans `etatJeu.reflexeResult = { qType, aType, overall }`
- Phrase narrateur de transition selon `overall` avant de passer au panel de choix
- Interface publique identique à l'ancien `interrogatoire.js` : `startInvestigation()` / `endInvestigation()`
- **Phase 2 (non implémentée)** : bonus/malus jauges dans `choose()` selon `etatJeu.reflexeResult.overall` (+5i si good, -5i si bad)

### Système Streak (`js/streak.js`)
Récompense les séries de bonnes décisions consécutives.
- `showStreakAnimation(streak)` — déclenché par `choose()` pour les paliers 3/5/7/10
- `updateStreakHUD()` — met à jour la pilule `#streak-hud` dans le HUD
- Paliers : 3 🔥 / 5 ⚡ / 7 💎 / 10 🏆

### Badges contextuels (`js/badges.js`)
7 nouveaux badges s'ajoutent aux badges de chapitre existants :
- `ligneConduite` : 3 chapitres consécutifs good
- `detectiveFinancier` : Réflexe Pro 'good' sur 5 chapitres
- `sousPression` : décision correcte en < 15s (secret)
- `sansFiletTotal` : terminer sans utiliser le SOS
- `integriteTotale` : 0 bad sur toute la partie
- `resilient` : 3 bonnes décisions consécutives après une mauvaise
- `juristeHerbe` : quiz parfait (10/10)

### Second essai (`js/choices.js`, `js/main.js`)
Après un verdict bad/warn, bouton "↩ Rejouer avec les bons réflexes" :
- `startSecondEssai()` → recharge le chapitre, injecte bandeau ambre `#second-essai-bandeau`
- `_chooseSecondEssai(choix)` → verdict simplifié, sans aucune sauvegarde
- `_finSecondEssai()` → supprime le bandeau, passe à l'affaire suivante

### Lexique inline (`js/lexique.js`, `js/data/lexique-data.js`)
Les termes juridiques sont automatiquement marqués dans les dialogues via `subst()` → `marquerTermesLexique()`.
- 12 termes définis dans `LEXIQUE{}` (lexique-data.js, chargé sans defer)
- Clic sur un terme → tooltip fixe `#lexique-tooltip` avec définition et référence légale
- Regex Unicode `\p{L}\p{N}` avec `giu` pour gestion des accents

### Dashboard formateur post-session (`js/live-formateur.js`, `js/live-session.js`)
Écran `#lf-debrief` affiché automatiquement en fin de session :
- `LiveSession.calculerDebrief(sessionId)` → top 3 affaires échouées + distribution profils
- Camembert SVG (donut) : Exemplaire ≥75% / Pragmatique 45-74% / À risque <45%
- Réflexes à renforcer : `recap.gestures[0]` des affaires les plus difficiles
- Export PDF : `window.print()` + `@media print` dans `live.css`

### Parcours preset formateur (`js/live-formateur.js`)
4 presets + 1 custom dans le landing : `LF_PRESETS = { complet, achats, finance, rh }`.
- Complet (0-9), Achats (1,2,6,9), Finance (3,7,8), RH (0,4,5)

### Carte de résultat partageable (`js/epilogue.js`)
`genererCarteResultat()` — canvas 600×300 avec fond navy, prénom, profil coloré, score, barre de progression, jauges i/p/m, date. `toDataURL()` → ouverture aperçu + lien téléchargement.

### PWA offline (`sw.js`)
Service Worker enregistré dans `index.html` (après `load`).
- Cache First : tous les assets statiques listés dans `CACHE_URLS`
- Network First : requêtes vers `*.supabase.co`
- Fallback navigation → `index.html` hors ligne
- **Mise à jour** : incrémenter `CACHE_NAME = 'horizon-v2'` après chaque déploiement majeur

---

## 🎨 Scènes disponibles

| Clé | Image de fond | Particules |
|-----|--------------|------------|
| `prologue` | prologue.jpg | city-lights |
| `rh` / `bureau1` | bureau1.jpg | dust-motes |
| `bureauf` | bureauf.jpg | rain-drops |
| `mairie` | mairie.jpg | dust-motes |
| `bureau2` | bureau2.jpg | dust-motes |
| `resto` | resto.jpg | candle-particles |
| `restojour` | restojour.jpg | dust-motes |
| `bistro` | bistro.jpg | dust-motes |
| `sallereunion` | sallereunion.jpg | dust-motes |
| `pesee` | pesee.jpg | rain-drops |
| `indus` | indus.jpg | clouds + smoke |
| `finance` | findumois.jpg | rain-drops + phone overlay |
| `commercial` | contratatoutprix.jpg | dust-motes |
| `tennis` | tennis.jpg | sun-flares |
| `bureau9` | bureau9.jpg | dust-motes |
| `bureaujour` | bureaujour.jpg | dust-motes |
| `bureau9` + overlay | `bureauPerrin` | téléphone Perrin |
| `bureau9` + overlay | `bureaularoche` | téléphone Laroche |
| `tutorial` | salle-formation.jpg | — |
| `epilogue` | epilogue.jpg | shooting-stars |

Pour créer une nouvelle scène :
1. Ajouter les styles CSS dans `css/scenes.css` sous `.sc-[nom]{}`
2. Ajouter le builder dans `js/scenes.js` dans l'objet `SCENES`
3. Ajouter la clé dans `IMAGE_SCENES[]` si elle doit avoir une vignette

---

## 📱 PWA & plein écran mobile

Le jeu est installable comme PWA (iOS et Android).

**Fichiers clés :**
- `manifest.json` : `display: standalone`, `display_override: [standalone, fullscreen]`, `orientation: natural`, `theme_color: #080810`
- `index.html` : `viewport-fit=cover`, `apple-mobile-web-app-status-bar-style: black-translucent`

**Safe area (encoche iPhone, barre Android) :**
- Variables CSS dans `:root` : `--safe-bottom`, `--safe-top`, `--safe-left`, `--safe-right`
- Appliqués sur : `#dlg`, `#choices`, `#inv`, `.nav-btn`, `#audio-resume-btn`

**Hauteur Android Chrome :**
- `--app-height` mis à jour par `_setAppHeight()` dans `main.js` (écoute `resize`)
- `#game` utilise `height: var(--app-height)` pour corriger le bug `100vh` Android

**Régénérer les icônes après modification du logo :**
```bash
node scripts/remove-bg.js   # supprime fond blanc + régénère toutes les tailles
```
Penser à incrémenter `?v=N` sur les liens favicon dans `index.html` pour invalider le cache.

---

## 🎬 Splash screen (`js/preloader.js`)

- S'affiche dès le chargement, au-dessus de tout (`z-index: 9999`)
- Précharge 36 assets en parallèle : 23 scènes/téléphones + 13 portraits
- Barre de progression en 3 phases : 0→70% (2,2s) / 70→95% (1,2s) / 95→100% (0,3s)
- Labels qui changent à 0%, 25%, 50%, 75%, puis "Dossier prêt."
- Séquence de fin : label → pulse logo → `AudioEngine.onUserGesture()` + `playAccueil()` → fondu 1s
- Logo affiché via `<canvas>` avec suppression des pixels blancs (r,g,b > 235 → alpha 0)
- Styles dans `css/intro.css` section `/* ══ SPLASH SCREEN ══ */`

---

## 🏁 Écran de fin

Trois variantes selon `nbMauvais` (0 / 1 / ≥2), toutes sur fond sombre `#07070f→#0e0c1a` :

| Résultat | Style | Classe principale |
|----------|-------|-------------------|
| 0 bad | Badge "Certifié Intégrité" + confetti | `.end-certified` |
| 1 bad | Lettre d'avertissement | `.end-warning-wrap` |
| ≥2 bad | Une de journal scandale | `.end-news-wrap` |

**Points d'attention** (`_construirePointsAttentionHTML`) : récapitulatif des choix `bad`/`warn`, cap à 5, trié bad avant warn. Utilise `ch.recap.gestures[0]` pour le bon réflexe.

**Quiz** : bouton "Valider mes acquis" — si déjà complété, affiche le score depuis `localStorage` (`horizon_quiz_result: {score, total}`).

---

## 🔧 Conventions de code

- **Vanilla JS uniquement** — pas de React, Vue, jQuery ou autre framework
- **Pas de bundler** — les fichiers se chargent via `<script src="">` dans index.html
- **CSS custom properties** — utiliser les variables `:root` de `variables.css`
- **Responsive** — fonctionne sur desktop, tablette, mobile (portrait et paysage)
- **Pas d'imports ES modules** — tout est dans le scope global
- **HTML dans les données** — les textes acceptent `<em>`, `<strong>`, `<br>`

---

## 🚀 Commandes utiles

```bash
# Serveur local
npx serve .
# ou
python3 -m http.server 8080

# Déploiement production
npx vercel --prod

# Régénérer les icônes (après modification du logo)
node scripts/remove-bg.js
```

---

## ✅ Règles de développement

1. **Toujours tester** après chaque modification avec un serveur local
2. **Ne jamais modifier** la structure des données CHAPTERS[] sans mettre à jour ce fichier
3. **Vérifier la cohérence** des jauges : la somme des deltas sur 10 affaires (all-good) doit donner ~80-85%
4. **Conserver le lexique** juridique à jour si de nouvelles infractions sont introduites
5. **Valider le HTML** des champs `.txt`, `.body`, `.vConsequence` — certains contiennent des balises
6. **Tester le scoring final** après ajout d'une affaire : vérifier les 3 variantes d'écran de fin
7. **Après modification du logo** : relancer `node scripts/remove-bg.js` et incrémenter `?v=N` dans index.html

---

## 💡 Idées d'évolutions documentées

- [ ] Sauvegarde `localStorage` pour reprendre une partie
- [ ] Éditeur de scénario (JSON éditable par les RH sans coder)
- [ ] Affaire 11 : conflit d'intérêts dans un appel d'offres DSP
- [ ] Internationalisation (i18n) EN/FR
- [x] PWA installable (manifest + service worker)
- [x] PWA offline complète — `sw.js` Cache First / Network First
- [x] Ajout audio : musique d'ambiance + effets sonores
- [x] Quiz de validation des acquis
- [x] Système de badges
- [x] Badges contextuels (7 nouveaux) liés aux comportements joueur
- [x] Streak counter — séries de bonnes décisions consécutives
- [x] Lexique tooltips inline — termes juridiques cliquables dans les dialogues
- [x] Second essai — rejouer une affaire après bad/warn, sans impact score
- [x] Jurisprudence dans fiches récap — citation d'affaire réelle similaire (10 affaires)
- [x] Phase "Bon Réflexe Professionnel" (remplace investigation par sélection 2q+2a)
- [x] Reformulation des 10 décisions finales (Investigation=COMMENT, Décision=QUOI)
- [x] Tutoriel mis à jour (step 2B: Réflexe Pro interactif, step 2C: Décision avec animation jauges)
- [x] Mode Formateur Live (Kahoot-style) — `live-formateur.html` + `live-joueur.html`
- [x] Dashboard post-session formateur (debrief SVG, top 3 affaires échouées, camembert profils)
- [x] Parcours preset formateur (Complet / Achats / Finance / RH / Personnalisé)
- [x] Carte de résultat partageable (canvas 600×300, téléchargeable)
- [x] Export PDF debrief formateur (`window.print()` + `@media print`)
- [ ] Phase 2 Réflexe Pro : activer bonus/malus jauges dans choose() selon etatJeu.reflexeResult.overall
