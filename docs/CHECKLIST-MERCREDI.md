# Checklist Présentation — Projet Horizon Live

## AVANT LA PRÉSENTATION (arriver 30 min en avance)

### Salle & matériel
- [ ] Tester la connexion WiFi de la salle (ouvrir supabase.co pour vérifier l'accès)
- [ ] Connecter l'ordinateur au vidéoprojecteur
- [ ] Ouvrir Chrome (pas Edge, pas Safari)
- [ ] Désactiver les notifications sur l'ordinateur
- [ ] Passer en mode "Ne pas déranger" (macOS : Fn + Ne pas déranger)
- [ ] Couper les alertes Slack, Teams, mail

### Démarrage formateur
- [ ] Ouvrir `https://projet-horizon-sem.vercel.app/live-formateur.html`
- [ ] Entrer le code formateur et valider
- [ ] Mettre en plein écran (bouton ⛶ ou F11)
- [ ] Vérifier que le fond epilogue.webp s'affiche (pas d'image cassée)
- [ ] Tester le son 🔊 sur les enceintes de la salle

### Test QR code
- [ ] Scanner le QR code depuis son propre téléphone
- [ ] Vérifier que `live-joueur.html` s'ouvre correctement
- [ ] Entrer un nom de test et rejoindre — vérifier que le nom apparaît côté formateur
- [ ] Supprimer ce participant test avant de commencer (ou créer une nouvelle session)

### Note de secours
- [ ] Avoir l'URL courte notée sur papier : `projet-horizon-sem.vercel.app/live-joueur.html`
- [ ] Avoir le code session visible sur l'écran projeté

---

## PENDANT LA PRÉSENTATION

### Lancement
- [ ] Attendre que TOUS les participants aient rejoint avant de lancer
- [ ] Choisir le parcours (Complet / Achats / Finance / RH / Industriel / Personnalisé)
- [ ] Annoncer à voix haute le code session + l'URL

### Pendant les votes
- [ ] Commenter à voix haute pendant les votes : *"Vous avez 30 secondes…"*
- [ ] Ne pas hésiter à cliquer "Clore les votes" si quelqu'un met trop de temps
- [ ] Attendre que le dépouillement soit affiché avant de commenter

### Pendant le débrief
- [ ] Animer le débat AVANT de passer au classement
- [ ] Utiliser l'explication juridique affichée comme support de discussion
- [ ] Cliquer "Affaire suivante →" depuis l'écran classement (pas depuis le dépouillement)

---

## EN CAS DE PROBLÈME

| Problème | Solution |
|----------|----------|
| QR code illisible à distance | Dicter l'URL à voix haute : `projet-horizon-sem.vercel.app/live-joueur.html` |
| Supabase en pause (écran blanc) | Aller sur supabase.com → login → cliquer "Resume project" |
| Image de fond cassée | Continuer — ça n'empêche pas le vote |
| Son absent | Continuer sans son |
| Joueur déconnecté | Le joueur re-scanne le QR et rejoint à nouveau |
| Page formateur figée | Recharger Chrome (F5) — la session est récupérable si même code |
| Vote qui ne se ferme pas | Cliquer manuellement "Clore les votes" dans la barre de contrôle |

---

## ORDRE DE JEU RECOMMANDÉ (60 min)

| Étape | Durée | Action |
|-------|-------|--------|
| Connexion participants | 5 min | QR code + rejoindre |
| Prologue | 3 min | 5 slides de mise en contexte |
| Affaire 1 (RH) | 8 min | Dialogue + Réflexe + Vote + Débrief |
| Affaire 2 (Achats) | 8 min | " |
| Affaire 3 (Finance) | 8 min | " |
| Pause discussion | 5 min | Classement intermédiaire |
| Affaire 4+ (selon temps) | 8 min | " |
| Classement final | 5 min | Podium + Analyse pédagogique |
| Export CSV | 1 min | Bouton "Exporter CSV" |

---

## CONTACTS UTILES

- **URL formateur** : `https://projet-horizon-sem.vercel.app/live-formateur.html`
- **URL joueur** : `https://projet-horizon-sem.vercel.app/live-joueur.html`
- **Supabase** : `https://supabase.com` (pour relancer le projet si en pause)
- **Vercel dashboard** : `https://vercel.com` (pour voir les logs en cas d'erreur)
