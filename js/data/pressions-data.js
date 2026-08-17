// ═══════════════════════════════════════════════════════════════
// PRESSIONS_DATA — Événements narratifs pendant la phase de décision
// Clé : chIdx (0-9), valeur : tableau d'événements ordonnés par délai (secondes)
// Types : 'notification' (téléphone) | 'email'
// ═══════════════════════════════════════════════════════════════

const PRESSIONS_DATA = {

  // ── Affaire 1 — Le CV sur le dessus de la pile ───────────────
  0: [
    { delai: 10, type: 'notification', expediteur: 'M. Aubert', message: 'Alors ? On peut compter sur vous ?' },
    { delai: 25, type: 'email', expediteur: 'Secrétariat CA', message: 'Vote des subventions — Ordre du jour modifié' },
  ],

  // ── Affaire 2 — L'appel d'offres truqué ─────────────────────
  1: [
    { delai: 10, type: 'notification', expediteur: 'M. Laroche', message: 'Les invitations sont à votre nom.' },
    { delai: 25, type: 'email', expediteur: 'GlobalTri', message: 'Confirmation réservation Roland Garros' },
  ],

  // ── Affaire 3 — La paie modifiée ────────────────────────────
  2: [
    { delai: 10, type: 'email', expediteur: 'Service Paie', message: 'Clôture de paie — dans 2 heures' },
    { delai: 25, type: 'notification', expediteur: 'Mme Favre', message: 'On peut en parler ?' },
  ],

  // ── Affaire 4 — Le chauffeur et les déchets ─────────────────
  3: [
    { delai: 10, type: 'notification', expediteur: 'Direction ViteDéchets', message: 'Alors, votre décision ?' },
    { delai: 25, type: 'email', expediteur: 'Site Industriel', message: 'Rapport de pesée — anomalie signalée' },
  ],

  // ── Affaire 5 — L'inspecteur de l'environnement ─────────────
  4: [
    { delai: 10, type: 'email', expediteur: 'M. Lefebvre', message: 'Délai de réponse sous 48h' },
    { delai: 25, type: 'notification', expediteur: 'Direction', message: 'Mise en demeure en cours' },
  ],

  // ── Affaire 6 — L'appel d'offres Val-Vert ───────────────────
  5: [
    { delai: 10, type: 'notification', expediteur: 'Mme Perrin', message: 'Vendredi, dernier délai.' },
    { delai: 25, type: 'email', expediteur: 'Commission Val-Vert', message: 'Résultats publiés dans 48h' },
  ],

  // ── Affaire 7 — L'acquisition foncière ──────────────────────
  6: [
    { delai: 10, type: 'notification', expediteur: 'Mme Ruiz', message: 'Le vendeur s\'impatiente.' },
    { delai: 25, type: 'email', expediteur: 'Notaire Dupuis', message: 'Autre acheteur — Offre déposée ce matin' },
  ],

  // ── Affaire 8 — Le virement frauduleux ──────────────────────
  7: [
    { delai: 10, type: 'notification', expediteur: 'M. Renaud', message: 'Livraison bloquée. Urgent.' },
    { delai: 25, type: 'email', expediteur: 'Cabinet Francine', message: 'Audit demain 9h — Documents requis' },
  ],

  // ── Affaire 9 — Le partenariat douteux ──────────────────────
  8: [
    { delai: 10, type: 'notification', expediteur: 'M. Fontaine', message: 'Vendredi, dernier délai.' },
    { delai: 25, type: 'email', expediteur: 'Urbanisme', message: 'Dossier permis — Pièce manquante' },
  ],

  // ── Affaire 10 — La décision finale ─────────────────────────
  9: [
    { delai: 10, type: 'notification', expediteur: 'Mme Deschamps', message: '48h. Répondez.' },
    { delai: 25, type: 'email', expediteur: 'EcoTri Services', message: 'Offre concurrente déposée' },
  ],

  // ── Affaire 11 — Le Contrat de Confiance ────────────────────
  10: [
    { delai: 10, type: 'notification', expediteur: 'M. Vasseur', message: 'On s\'est toujours arrangés avant.' },
    { delai: 25, type: 'email', expediteur: 'Direction Générale', message: 'Décision sur le contrat — ce soir' },
  ],

  // ── Affaire 12 — Le Détour de Nuit (chIdx=11) ───────────────
  11: [
    { delai: 10, type: 'notification', expediteur: 'Kévin', message: 'Chef s\'il vous plaît. Ma femme sait rien.' },
    { delai: 25, type: 'email', expediteur: 'Responsable dépôt', message: 'Rapport de tournée à remettre avant 8h' },
    { delai: 45, type: 'notification', expediteur: 'Numéro inconnu', message: '1 appel manqué' },
  ],

  // ── Affaire 13 — Le Tampon qui Coûte Cher (chIdx=12) ────────
  12: [
    { delai: 10, type: 'notification', expediteur: 'Mme Andrieux', message: 'Je commence la rédaction dans 30 minutes. Votre décision ?' },
    { delai: 25, type: 'email', expediteur: 'Dominique — DG', message: 'Les 3 marchés sont en jeu. Qu\'est-ce qui se passe ?' },
    { delai: 45, type: 'notification', expediteur: 'M. Brahim', message: '1 appel manqué' },
  ],

};
