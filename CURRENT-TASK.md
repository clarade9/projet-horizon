# Tâche en cours — Projet Horizon

_Mis à jour : 2026-07-02 — Déploiement prod OK_
_Production : https://projet-horizon-sem.vercel.app_

---

## Ce qui vient d'être livré (session 2026-07-02 — suite)

### Correctifs mode formateur (session 2026-07-08)
- **Plein écran au login** : `lfCheckLogin()` appelle `requestFullscreen()` immédiatement après validation du code
- **Affaire 11** dans le mode live : scènes `maintenance/maintenancebureau/maintenancereunion` ajoutées à `_lfSetScene`, piste audio `bureau.mp3` ajoutée à `_LIVE_TRACKS[10]`, `prologue.js` chargé dans `live-formateur.html`
- **Bug "J'ai lu"** : `nettoyerLecturesAffaire` appelé EN PREMIER (avec `.then()`), le `_lfNext()` ne démarre qu'une fois les anciennes lectures supprimées → plus de déclenchement intempestif
- **Prologue Dominique** : `_lfPrologueLancer()` injecte les 10 lignes `PROLOGUE[]` comme étapes `dlg` avant la 1ère affaire ; type `prologue_fin` enchaîne sur `_lfInitAffaire` ; `_lfRendreDlg` protégé pour `affaireIdx=-1` ; diffusion Supabase et système "j'ai lu" désactivés pendant le prologue
- Slide prologue formateur : texte "10 situations" → générique ; bouton "Lancer la 1ère affaire" → "Lancer l'introduction"

### Zone Opérationnel — sous-menu Exploitation / Maintenance
- Zone carte `operationnel` (ex `terrain`) : clic → sous-menu 2 choix
- Service `exploitation` (ch=3,4) et service `maintenance` (ch=10, `soloMode:true`)
- `map-select.js` : `_ouvrirSousMenu()`, `_ouvrirConfirmationEnfant()`, bouton "← Retour"
- CSS : `.map-subsvc-card`, `.map-confirm-back` dans `map-select.css`
- `buildChapterOrder` : respecte `soloMode` (ne retourne que les chapitres prioritaires)
- `showParcours` : section solo sans bonus pour `soloMode`
- Affaire 11 = affaire à part entière (non bonus), accessible uniquement via Maintenance

### Ajustements jeu pour CHAPTERS[10]
- `badges.js` : `sansFiletTotal` et `integriteTotale` utilisent `etatJeu.priorityCount` au lieu de 10 hardcodé
- `epilogue.js` : diplôme dynamique (N affaires selon parcours joué)
- `badges.js` : desc `integriteTotale` désormais générique

### Sauvegarde multi-joueurs par nom
- `checkpoint.js` : clé `horizon_checkpoint_<prenom>_<nom>` (slug ASCII normalisé)
- Migration one-time : ancienne clé `horizon_checkpoint` → nouvelle clé au premier chargement
- `listerSauvegardes()` : liste toutes les sauvegardes disponibles (triées par date)
- `majAffichage()` : bouton "Reprendre" affiche prénom+nom du joueur sauvegardé
- `bandeauHTML()` : bandeau affiche le nom du joueur lié à la sauvegarde
- `_showAccueil()` : rafraîchit le bouton reprendre selon le joueur courant

---

## Ce qui vient d'être livré (session 2026-07-02)

### Affaire 4 révisée — "La Nuit des Tonnages" (exploitation pure)
- Nouvelle version recentrée exploitation nuit : chef d'exploitation de nuit, Patrice, voix chef d'exploitation (Sam)
- 2 nouvelles MD avec impacts jauges revus, dialogue entièrement reécrit
- Nouveaux impacts choix finaux : bad (-40i/+17p/-36m), warn (-16i/+4p/-16m), good (+20i/-4p/+20m)
- Objet `memoire` pour mémoire narrative vers affaire 8 (ch=7)
- REFLEXE_DATA[3] reécrit : Q/A centrés sur pesée certifiée + signalement DG (pas chef direct)

### Affaire 11 BONUS — "Le Contrat de Confiance" (maintenance)
- Nouveau chapitre CHAPTERS[10] : favoritisme + corruption passive, contrat maintenance 380k€
- Scène : `bureaujour` + `sallereunion`
- MD1 : catalogue outillage 4200€ ; MD2 : pression chef de service + mails prédécesseur
- Choix finaux : bad (-40i/+20p/-32m), warn (-12i/+6p/-8m), good (+20i/-6p/+20m)
- Objet `memoire` lié à affaire 2 (ch=1, good/bad)
- REFLEXE_DATA[10] : Q1+Q3 pertinentes, A1+A2 pertinentes, combos documentés
- Nouveau service `maintenance` dans SERVICES[] (mapBox zone industrielle), affaire 11 en priority
- Affaire 11 apparaît comme "Bonus" dans tous les autres services automatiquement

---

## Ce qui vient d'être livré (session 2026-05-13)

### Lot A — Engagement joueur
- **Streak counter** (`js/streak.js`) : séries bonnes décisions, animations paliers 3/5/7/10, pilule HUD
- **7 badges contextuels** (`js/badges.js`) : ligneConduite, detectiveFinancier, sousPression (secret), sansFiletTotal, integriteTotale, resilient, juristeHerbe
- **Lexique tooltips inline** (`js/lexique.js`, `js/data/lexique-data.js`) : 12 termes juridiques cliquables dans les dialogues
- **Second essai** (`js/choices.js`, `js/main.js`) : rejouer l'affaire après bad/warn, sans impact score
- **Jurisprudence** (`js/data/chapters.js`) : citation d'affaire réelle dans chaque fiche récap (10 affaires)

### Lot B — Mode Live & PWA
- **Dashboard post-session formateur** (`#lf-debrief`) : top 3 affaires échouées, réflexes à renforcer, camembert SVG profils éthiques (Exemplaire/Pragmatique/À risque), export PDF
- **Parcours preset formateur** : 4 presets (Complet/Achats/Finance/RH) + Personnalisé dans le landing Live
- **Carte de résultat partageable** (`js/epilogue.js`) : canvas 600×300 téléchargeable depuis l'écran de fin solo
- **PWA offline complète** (`sw.js`) : Cache First pour assets statiques, Network First pour Supabase

---

## Prochaine tâche recommandée

### Phase 2 Réflexe Pro — bonus/malus jauges
Dans `js/choices.js` → `choose()`, après `applyGauges(choix.gauges)` :

```js
if (etatJeu.reflexeResult) {
  if (etatJeu.reflexeResult.overall === 'good') applyGauges({ i: 5, p: 0, m: 0 });
  if (etatJeu.reflexeResult.overall === 'bad')  applyGauges({ i: -5, p: 0, m: 0 });
}
```

Afficher le delta Réflexe Pro dans les pills du verdict si non nul.

### Autres pistes
- Affaire 11 : conflit d'intérêts dans un appel d'offres DSP
- Lot 1 PWA iOS : bande noire en bas sur iPhone (Dynamic Island, safe area bottom)

---

## État des fichiers clés

| Fichier | Rôle actuel |
|---------|-------------|
| `sw.js` | Service Worker offline — CACHE_NAME='horizon-v1' à incrémenter après déploiement majeur |
| `js/streak.js` | Système streak (créé session 2026-05-13) |
| `js/data/lexique-data.js` | 12 termes juridiques LEXIQUE{} (chargé sans defer) |
| `js/reflexe-pro.js` | Phase Réflexe Pro — Phase 2 (bonus/malus) non encore activée |
| `js/live-session.js` | Moteur Supabase Live — inclut calculerDebrief() |
| `js/live-formateur.js` | UI formateur — inclut _lfEcranDebrief, LF_PRESETS |

## Ne pas toucher sans raison
- `config.js` — clés Supabase et configuration centralisée
- `js/supabase.js` — client Supabase joueur
- `manifest.json` — PWA
- `js/data/chapters.js` — données des 10 affaires (vérifier cohérence jauges après modif)
