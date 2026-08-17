# Projet Horizon — État actuel du jeu (juillet 2026)
## Document de contexte pour review externe

---

## Vue d'ensemble

Serious game narratif HTML/CSS/JS vanilla (aucun framework, aucun bundler).
Déployé sur : https://projet-horizon-sem.vercel.app
Durée de jeu : ~45 minutes.
Public : agents SEM, formation conformité Sapin II.

Le joueur incarne un chargé de mission supervisant l'ouverture d'un centre de valorisation.
Il traverse 10 affaires de corruption, prend des décisions, et reçoit un verdict final.

---

## Architecture des fichiers clés

```
index.html                  ← Entrée principale
js/
  main.js                   ← etatJeu, startGame(), orchestration générale
  scenes.js                 ← SCENES{}, buildScene()
  dialogue.js               ← showDlg(), advDialogue()
  choices.js                ← showChoicePanel(), choose(), closeContext()
  microdecisions.js         ← showMicroDecision(), chooseMicro()
  reflexe-pro.js            ← startInvestigation(), endInvestigation()
  epilogue.js               ← runEpilogue(), showEnd()
  memoire.js                ← Memoire.lignesMemoire(), enregistrerChoix()
  badges.js                 ← Badges.check()
  streak.js                 ← showStreakAnimation()
  audio.js                  ← AudioEngine
  preloader.js              ← splash screen + préchargement assets
  data/
    chapters.js             ← CHAPTERS[] — 13 entrées (indices 0 à 12)
    reflexe-data.js         ← REFLEXE_DATA{} — données phase Réflexe Pro
    pressions-data.js       ← PRESSIONS_DATA{} — notifications/emails interchapitre
    prologue.js, epilogue-data.js, lexique-data.js
css/
  variables.css, layout.css, scenes.css, panels.css, intro.css,
  personalization.css, mobile.css, badges.css, tutorial.css,
  map-select.css, live.css
assets/
  scenes/     ← décors JPEG/PNG/WebP
  characters/ ← portraits PNG
  audio/      ← musiques et SFX
```

---

## Flux de jeu complet

```
Splash screen (preloader.js)
  ↓
Écran d'intro + personnalisation (prénom, service)
  ↓
Tutoriel interactif (3 steps)
  ↓
[Pour chaque affaire dans l'ordre du parcours :]
  Carte contexte (showContext)
    ↓ closeContext()
  preDialogue[] optionnel (lignes narrateur avant MD0)
  Mémoire narrative (Memoire.lignesMemoire) — injectée si ≥2 affaires jouées
    ↓
  MicroDécisions (MD0, MD1... — avant le dialogue)
    ↓
  Dialogue principal
    ↓
  Phase Réflexe Pro (2 questions + 2 actions parmi 4 chacune)
    ↓
  Panel de choix (3 options A/B/C)
    ↓
  Verdict + récap juridique
    ↓
  Second essai optionnel (rejouer sans impact score)
    ↓
  Transition narrative (vers affaire suivante ou épilogue)
  ↓
Épilogue
  ↓
Écran de fin (3 variantes selon score)
  ↓
Quiz de validation (10 questions)
```

---

## Structure d'un chapitre (CHAPTERS[])

```js
{
  num: "Affaire N",
  name: "Titre",
  sub: "Sous-thème juridique",
  dureeMin: 4,
  sc: "nom-scene",           // clé dans SCENES{}
  playerRole: "Prénom — Rôle",
  context: { eye, title, body },
  preDialogue: [ { sp, sc, txt } ],   // optionnel — avant MD0
  microDecisions: [
    {
      phoneRing: true,        // optionnel — animation téléphone avant le panel
      situation: "HTML",
      choices: [
        {
          letter, desc, reaction,
          gauges,             // optionnel — impact immédiat
          tint,               // true = choix risqué (teinte orange)
          sceneAtLine0,       // scène alternative si MD au restaurant
          sceneAfter,         // scène après ce choix
          transitionTxt,      // texte de transition narratif
          dialoguePatch,      // tableau { idx, txt } — modifie des lignes du dialogue
          dialogueInject,     // lignes injectées en tête de dialogue
          hotspotsOverride,   // nouvelles coordonnées des hotspots pour la scène alternative
          musicAfter,         // fichier audio à jouer après ce choix
        }
      ]
    }
  ],
  dialogue: [ { sp, ch, sc, txt, phoneRing } ],
  clues: [ { ic, label, sub, title, body, alert } ],
  invIntro: "Texte intro phase Réflexe Pro",
  hotspots: [ { x, y, w, h, label } ],  // % de l'image, cliquables en Réflexe Pro
  pressureIntro: "Texte bandeau ambre au-dessus des choix",
  choices: [
    {
      desc, type,             // 'good'|'warn'|'bad'
      badge, bc,
      vTitle, vConsequence, vLegal,
      gauges: { i, p, m }
    }
  ],
  sos: { situation, questions, reasoning, lawRef },
  recap: {
    gestures: [],
    jurisprudence: { titre, resume, source }   // optionnel
  },
  memoire: {                  // optionnel — callback mémoire vers un chapitre futur
    good: { chCible, txt },
    bad:  { chCible, txt }
  },
  transition: { sp, txt },   // ou transitions: { [chIdx]: { sp, txt }, intermediate, epilogue }
}
```

---

## Les 13 affaires (CHAPTERS[0..12])

| Index | Num | Titre | Thème juridique | Scène |
|-------|-----|-------|-----------------|-------|
| 0 | Affaire 1 | Le CV sur le dessus de la pile | Prise illégale d'intérêts / Recrutement | bureau1 |
| 1 | Affaire 2 | Le Déjeuner de l'Acheteur | Favoritisme / Corruption passive | bureaularoche / resto / bistro / sallereunion |
| 2 | Affaire 3 | Fantômes de la Paie | Détournement de fonds / Fraude RIB | finance |
| 3 | Affaire 4 | La Nuit des Tonnages | Faux en écriture / Corruption passive | pesee |
| 4 | Affaire 5 | Le Chantage à l'Autorisation | Corruption active / Extorsion | indus |
| 5 | Affaire 6 | Les Références Gonflées | Faux en écriture / Déclaration mensongère | mairie |
| 6 | Affaire 7 | L'Extension Horizon | Prise illégale d'intérêts / Contrats de complaisance | bureau2 |
| 7 | Affaire 8 | L'Urgence de fin de mois | Fraude au virement bancaire / Surfacturation | finance |
| 8 | Affaire 9 | Le Partenariat Douteux | Corruption / Conflit d'intérêts | bistro |
| 9 | Affaire 10 | La Décision Finale | Corruption active / Appel d'offres truqué | bureau9 |
| 10 | Affaire 11 | Le Contrat de Confiance | Abus de confiance / Contrat de complaisance | maintenancebureau |
| 11 | Affaire 12 | Le Détour de Nuit | Corruption de chauffeur / Déchets dangereux | nuitcollecte (→depot.png) |
| 12 | Affaire 13 | Le Tampon qui Coûte Cher | Faux en écriture sur audit de certification QSE | reunionqse |

### Affaires bonus (selon service choisi)
- Affaire 11 (index 10) : accessible uniquement aux services "operationnel" et assimilés
- Affaire 12 (index 11) : accessible uniquement au service QSE
- Affaire 13 (index 12) : accessible uniquement au service QSE

---

## Personnages

| ID CSS | Nom | Rôle dans le jeu |
|--------|-----|-----------------|
| c-dominique | Dominique | DG de la SEM |
| c-deschamps | Mme Deschamps | Directrice concurrente (Affaire 10) |
| c-laroche | M. Laroche | Commercial GlobalTri (Affaire 2) |
| c-favre | Mme Favre | Responsable Paie coupable (Affaire 3) |
| c-patrice | Patrice | Chauffeur ViteDéchets (Affaire 4) |
| c-lefebvre | M. Lefebvre | Inspecteur environnement (Affaire 5) |
| c-perrin | Mme Perrin | DST Val-Vert (Affaire 6) |
| c-ruiz | Mme Ruiz | Consultante foncière (Affaire 7) |
| c-renaud | M. Renaud | Directeur ProSite (Affaire 8) |
| c-fontaine | Mme Fontaine | Partenaire douteuse (Affaire 9) |
| c-vasseur | M. Vasseur | Fournisseur (Affaire 11) |
| c-kevin | Kévin | Chauffeur (Affaire 12) |
| c-andrieux | Mme Andrieux | Auditrice CertExcel (Affaire 13) |
| c-aubert | M. Aubert | Administrateur / élu (Affaire 1 + callback Affaire 7) |
| c-marie | Marie | Assistante (Affaire 2 option C) |
| c-sam | Chef d'exploitation | (Affaire 4) |

---

## Système de mémoire narrative (memoire.js)

Le jeu se souvient des décisions passées et les injecte au début des chapitres suivants.

### Callbacks actifs
| Chapitre où la mémoire s'affiche | Se souvient de |
|-----------------------------------|----------------|
| Affaire 6 (chIdx 5) | Affaire 2 — clé USB acceptée ou procédure irréprochable |
| Affaire 7 (chIdx 6) | Affaire 1 — faveur accordée à Aubert ou refus |
| Affaire 8 (chIdx 7) | Affaire 3 (anomalie financière) + Affaire 7 (acquisition foncière) |
| Affaire 9 (chIdx 8) | Affaire 6 (Val-Vert) + Affaire 8 (fraude virement) |
| Affaire 10 (chIdx 9) | Affaire 5 (Lefebvre) + Affaire 7 (Aubert) + Affaires 7+8 combinées |
| Affaires 4 et 5 (chIdx 3 et 4) | Profil global uniquement |

### Profil global (affiché si ≥2 affaires jouées)
- `irréprochable` : 0 bad, ≥70% good → "Vous commencez à avoir la réputation de quelqu'un qu'on ne peut pas acheter."
- `fragile` : ≥2 bad → "Chaque arrangement laisse une trace. Vous ne le savez peut-être pas encore — mais d'autres, oui."
- `prudent` : intermédiaire → "Votre bilan est contrasté. Chaque décision compte — et quelqu'un, quelque part, en garde la mémoire."

---

## Phase Réflexe Pro (reflexe-data.js + reflexe-pro.js)

Remplace l'ancienne phase d'investigation. Le joueur sélectionne :
- **2 questions parmi 4** (sans feedback immédiat)
- **2 actions parmi 4** (sans feedback immédiat)

Évaluation par combinaisons : `REFLEXE_DATA[chIdx].combos.questions/actions.{good, warn, bad}`
Résultat stocké dans `etatJeu.reflexeResult = { qType, aType, overall }`.
Affichage détaillé après : pourquoi chaque question/action était pertinente ou non.

### Format REFLEXE_DATA[chIdx]
```js
{
  context: "Texte de mise en situation pour le joueur",
  documents: [
    { icon, label, contenu, pertinent, signal }  // 4 entrées
  ],
  questions: [ { txt } ],   // 4 questions
  actions:   [ { txt } ],   // 4 actions
  combos: {
    questions: { good: '0,1', warn: '0,2', bad: '2,3' },
    actions:   { good: '0,2', warn: '0,1', bad: '1,3' },
  },
  analysereflexe: {
    verdictRapide: { good, warn, bad },
    questions: { 0: { pertinent, pourquoi, alternative }, ... },
    actions:   { 0: { pertinent, pourquoi, alternative }, ... },
    regleOr: "Phrase mémorisable",
  }
}
```

Entrées présentes : chIdx 0 à 9, 10, 12 (total 12 affaires sur 13).

---

## Systèmes mécaniques

### Jauges (etatJeu.gauges)
- `i` — Intégrité (vert #22c55e)
- `p` — Performance Projet (bleu #60a0f8)
- `m` — Image SEM (violet #d888f8)
- Valeur initiale : 70 chacune. Plage : 0–100.

### Scoring final
- 0 bad → "Certifié Intégrité" — badge vert + confetti
- 1 bad → "Avertissement Formel" — lettre RH dark
- ≥2 bad → "Scandale" — une de journal dark + formation obligatoire

### Streak
- Séries de bonnes décisions consécutives. Paliers : 3 / 5 / 7 / 10.
- Animation et icône HUD mise à jour.

### Badges (7 contextuels + badges par chapitre)
- `ligneConduite`, `detectiveFinancier`, `sousPression`, `sansFiletTotal`,
  `integriteTotale`, `resilient`, `juristeHerbe`

### Second essai
- Après verdict bad/warn, bouton "Rejouer avec les bons réflexes".
- Relance l'affaire en mode lecture seule — aucun impact sur les jauges ou le score.

### Lexique inline
- 12 termes juridiques dans `lexique-data.js`.
- Marqués automatiquement dans les dialogues par `marquerTermesLexique()`.
- Clic → tooltip fixe avec définition et référence légale.

### Pressions interchapitre (pressions-data.js)
- Notifications et emails simulés pendant la phase de décision.
- Déclenchés par délai (10s, 25s…) via `PRESSIONS_DATA[chIdx]`.

---

## Mode Formateur Live (live-formateur.html + live-joueur.html)

Basé sur Supabase Realtime. Fonctionnement Kahoot-style :
- Formateur projette `live-formateur.html` — contrôle le déroulé, ouvre les votes, voit les résultats en temps réel
- Participants sur `live-joueur.html` sur mobile — votent A/B/C
- Dashboard post-session : top 3 affaires échouées, camembert profils (Exemplaire/Pragmatique/À risque), export PDF

4 parcours preset : Complet (0-9), Achats (1,2,6,9), Finance (3,7,8), RH (0,4,5) + Personnalisé.

---

## PWA offline (sw.js)

Cache First pour les assets statiques. Network First pour Supabase.
Cache name : `horizon-v2` — à incrémenter après déploiement majeur.

---

## Scènes disponibles

| Clé | Fichier | Particules |
|-----|---------|-----------|
| prologue | prologue.jpg | city-lights |
| bureau1 / rh | bureau1.jpg | dust-motes |
| bureauf | bureauf.webp | rain-drops |
| mairie | mairie.webp | dust-motes |
| bureau2 | bureau2.jpg | dust-motes |
| resto | resto.jpg | candle-particles |
| restojour | restojour.jpg | dust-motes |
| bistro | bistro.webp | dust-motes |
| sallereunion | sallereunion.webp | dust-motes |
| pesee | pesee.jpg | rain-drops |
| indus | indus.jpg | clouds + smoke |
| finance | findumois.webp | rain-drops + phone overlay |
| commercial | contratatoutprix.webp | dust-motes |
| tennis | tennis.jpg | sun-flares |
| bureau9 | bureau9.webp | dust-motes |
| bureaujour | bureaujour.webp | dust-motes |
| bureaularoche | bureau9.webp + overlay téléphone Laroche | — |
| bureauPerrin | bureau9.webp + overlay téléphone Perrin | — |
| tutorial | salle-formation.jpg | — |
| epilogue | epilogue.webp | shooting-stars |
| maintenance | maintenance.png | dust-motes |
| maintenancebureau | maintenancebureau.png | dust-motes |
| maintenancereunion | maintenancereunion.png | dust-motes |
| nuitcollecte | depot.png | rain-drops (nuit industrielle) |
| zone3 | zone3.png | dust-motes |
| reunionqse | reunionqse.png | dust-motes |

---

## Corrections récentes appliquées (juillet 2026)

### Bugs corrigés
1. **reflexe-data ch=2** : `"M. Favre"` corrigé en `"Mme Favre"` partout (context, label, contenu mail)
2. **reflexe-data ch=12** : `intro:` → `context:`, ajout de `documents:[]` (4 entrées cohérentes)
3. **reflexe-data ch=5** : contenu entièrement réécrit — l'entrée parlait de sponsoring football (Affaire 9) au lieu des références gonflées (Affaire 6/Mme Perrin/Val-Vert)
4. **chapters.js Affaire 7** : ajout ligne narrateur qui fait le lien avec M. Aubert pour les joueurs ayant vécu l'Affaire 1
5. **chapters.js Affaire 8** : suppression de la phrase "La direction connaît la situation" (impliquait une complicité interne non développée)
6. **chapters.js Affaire 13 hotspots** : coordonnées ajustées pour correspondre à reunionqse.png (rapport AUDIT REPORT bas-centre, panneaux QSE muraux gauche)
7. **Affaire 2 scène brasserie** : `sceneAtLine0` corrigé de `"restojour"` → `"bistro"`
8. **Affaire 2 invitations** : MD2 reformulé — séminaire Saint-Tropez au lieu de "pass tennis" (évite doublon avec pressureIntro Roland Garros)
9. **Affaire 4 doublons** : suppression des lignes de dialogue qui répétaient exactement MD1 (Patrice arrive / écart de poids). Dialogue démarre après la confrontation. MD1 inclut maintenant l'écart 12t/18,4t dans sa situation.
10. **Affaire 4 enveloppe** : suppression de la ligne doublon dans le dialogue (enveloppe déjà gérée par MD2)
11. **Affaire 6 MD2** : réactions `sp:"Mme Perrin"` remplacées par `sp:"Narrateur"` (joueur seul à son bureau après le coup de téléphone)
12. **memoire.js** : "M. Perrin" → "Mme Perrin" dans les callbacks Affaire 6
13. **memoire.js** : phrase "Vous naviguez. Parfois bien, parfois moins." remplacée par une formulation moins décrochée
14. **Affaire 7 intro dialogue** : première ligne remplacée (Mme Ruiz s'installe et présente l'offre chiffrée, entrée en scène naturelle)
15. **Affaire 4 transition** : suppression de "Vous n'avez pas fini d'entendre parler de cette nuit-là" (promesse narrative non tenue)
16. **Nouvelles scènes intégrées** : depot.png (nuitcollecte), reunionqse.png, zone3.png, indus.jpg, salle-formation.jpg — dans scenes.js, preloader.js, IMAGE_SCENES[]
17. **preloader.js** : CRITICAL_IMAGES corrigé (prologue.webp → .jpg, bureau1.webp → .jpg qui n'existaient pas en .webp)

---

## Points de vigilance pour la review

### Ce qui n'a pas encore été testé en jeu réel
- Les nouvelles scènes (depot.png, reunionqse.png, zone3.png) — visuellement intégrées mais non testées en session complète
- La cohérence du flux Affaire 4 après la refonte MD/dialogue (le dialogue démarre maintenant plus loin dans la scène)
- Les callbacks mémoire de l'Affaire 6 après correction du genre de Perrin

### Ce qui reste à faire (non implémenté)
- Phase 2 Réflexe Pro : bonus/malus jauges dans `choose()` selon `etatJeu.reflexeResult.overall` (+5i si good, -5i si bad) — prévu dans CLAUDE.md mais non activé
- Affaire 11 (index 10) n'a pas encore de REFLEXE_DATA entry (à vérifier)
- Sauvegarde localStorage pour reprendre une partie
- `PRESSIONS_DATA` : deux entrées utilisent la clé `12` (Affaire 12 et Affaire 13) — doublon de clé qui écrase le premier, Affaire 12 n'a donc pas de pressions

### Zones narratives à évaluer
- **Affaire 9 (Mme Fontaine / partenariat douteux)** : vérifier cohérence globale, notamment si le personnage Fontaine est bien distinct du contexte "sponsoring football" qui était dans reflexe-data ch=5 (maintenant corrigé)
- **Épilogue** : vérifier que les 3 variantes d'écran de fin tiennent compte correctement des affaires bonus (10/11/12)
- **Transitions entre affaires** : certaines transitions dépendent du chapitre suivant dans l'ordre de jeu — vérifier que l'ordre dynamique (selon service) ne crée pas de transitions incohérentes
- **Second essai** : le bandeau `#second-essai-bandeau` doit être bien supprimé avant de passer à l'affaire suivante

---

## Conventions techniques importantes

- **Vanilla JS uniquement** — pas de React, Vue, jQuery
- **Pas d'imports ES modules** — tout est dans le scope global via `<script src="">`
- **HTML dans les données** — les champs `.txt`, `.body`, `.vConsequence` acceptent `<em>`, `<strong>`, `<br>`
- **Images** : bgImg() dans scenes.js essaie `.webp` d'abord, fallback `.jpg` sur onerror. Le preloader lui n'a pas ce fallback — les extensions doivent être explicites.
- **CSS custom properties** — utiliser les variables `:root` de `variables.css`
- **Safe area** : `--safe-bottom`, `--safe-top` etc. pour PWA mobile
- **--app-height** : corrige le bug `100vh` Android Chrome via `_setAppHeight()` dans main.js
