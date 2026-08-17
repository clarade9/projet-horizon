# 🚀 Guide de migration — Projet Horizon v4 → Claude Code

## Étape 1 : Installation de Claude Code

```bash
# Mac / Linux
curl -fsSL https://claude.ai/install.sh | bash

# Mac (Homebrew)
brew install --cask claude-code

# Vérifier l'installation
claude --version
```

> ⚠️ Requiert un abonnement **Claude Pro** (20€/mois) ou supérieur.

---

## Étape 2 : Créer la structure de fichiers

```bash
mkdir projet-horizon
cd projet-horizon
mkdir -p css js/data assets
```

Copier votre `projet_horizon_v4.html` dans le dossier, puis déposer le `CLAUDE.md` à la racine.

---

## Étape 3 : Lancer Claude Code

```bash
cd projet-horizon
claude
```

---

## Étape 4 : Première session — Refactorisation

Copiez-collez ce prompt dans Claude Code :

```
Voici le fichier projet_horizon_v4.html — un serious game HTML/CSS/JS monolithique de 993 lignes.
Ton objectif : refactoriser ce fichier en respectant EXACTEMENT l'architecture décrite dans CLAUDE.md.

Plan d'action :
1. Extraire les CSS dans css/variables.css, css/layout.css, css/scenes.css, css/panels.css, css/intro.css
2. Extraire les données dans js/data/prologue.js, js/data/chapters.js, js/data/epilogue-data.js
3. Extraire la logique dans js/main.js, js/scenes.js, js/characters.js, js/dialogue.js, js/investigation.js, js/choices.js, js/hud.js, js/epilogue.js, js/lexique.js
4. Créer index.html qui importe tous ces fichiers
5. Vérifier que le jeu fonctionne identiquement à l'original

Commence par /plan pour me montrer ta stratégie avant de modifier quoi que ce soit.
```

---

## Étape 5 : Prompts pour aller plus loin

Une fois refactorisé, voici des prompts prêts à l'emploi :

### Ajouter un chapitre
```
Ajoute un Chapitre 5 sur le thème "Conflit d'intérêts dans une DSP" (Délégation de Service Public).
Le personnage jouable est "Claire — Responsable Juridique".
La scène se passe dans une salle de réunion le matin.
3 choix avec conséquences sur les jauges.
Respecte exactement la structure CHAPTERS[] documentée dans CLAUDE.md.
```

### Ajouter la sauvegarde
```
Ajoute un système de sauvegarde localStorage.
- Sauvegarder automatiquement l'état S après chaque choix
- Afficher un bouton "Reprendre" sur l'écran intro si une sauvegarde existe
- Afficher la date de la dernière sauvegarde
- Ajouter un bouton "Effacer la sauvegarde" dans l'écran de fin
```

### Ajouter les stats formateur
```
Crée un mode formateur accessible via le raccourci Ctrl+Shift+F.
Affiche un overlay avec :
- Le nombre de parties jouées (depuis localStorage)
- La répartition des choix A/B/C par chapitre en pourcentage
- Le verdict final le plus fréquent
- Un bouton pour exporter les stats en CSV
```

### Ajouter des effets sonores
```
Ajoute des effets sonores avec l'API Web Audio (pas de fichiers externes).
- Son de "clic" sur les choix
- Son grave sur un choix "bad"
- Son positif sur un choix "good"
- Musique d'ambiance générative pour chaque scène (tones + oscillateurs)
- Toggle son ON/OFF dans le HUD
```

---

## Commandes Claude Code utiles

| Commande | Usage |
|----------|-------|
| `/plan` | Demander un plan avant de coder |
| `/clear` | Réinitialiser le contexte (nouvelle tâche) |
| `/compact` | Compresser l'historique (session longue) |
| `!npx serve .` | Lancer le serveur sans quitter Claude Code |

---

## Bonnes pratiques

- Toujours commencer par `/plan` pour les modifications complexes
- Utiliser `/clear` entre deux tâches sans rapport
- Mentionner `@fichier.js` pour donner du contexte sur un fichier précis
- Vérifier dans le navigateur après chaque modification
