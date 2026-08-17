// ═══════════════════════════════════════
// INTERROGATOIRE — système d'investigation v3
// Le joueur pose 3 questions parmi 6 à un personnage.
// Certaines questions déclenchent une animation de nervosité.
// ═══════════════════════════════════════

// ── CSS injecté ──────────────────────────────────────────────
(function _injectIQCSS() {
  if (document.getElementById('iq-styles')) return;
  const s = document.createElement('style');
  s.id = 'iq-styles';
  s.textContent = `
/* ══ Panneau interrogatoire ══ */
#interro-panel {
  position: absolute;
  bottom: 0; left: 0;
  width: 55%; max-width: 380px;
  background: rgba(10,18,35,.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,.1);
  border-top: 1px solid rgba(255,255,255,.15);
  border-radius: 16px 16px 0 0;
  padding: 14px 16px calc(16px + env(safe-area-inset-bottom, 0px));
  z-index: 120;
  box-shadow: 4px 0 32px rgba(0,0,0,.5);
}

.iq-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 10px;
}
.iq-title {
  font: 700 10px/1 'Space Mono', monospace;
  letter-spacing: .15em;
  text-transform: uppercase;
  color: rgba(255,255,255,.45);
}
.iq-counter {
  font: 11px/1 Georgia, serif;
  color: rgba(255,255,255,.4);
  font-style: italic;
}

.iq-list {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.iq-btn {
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.09);
  border-radius: 8px;
  padding: 9px 12px;
  text-align: left;
  font: 12px/1.45 Georgia, serif;
  color: rgba(255,255,255,.82);
  cursor: pointer;
  min-height: 44px;
  transition: background .15s, border-color .15s;
  -webkit-tap-highlight-color: transparent;
}
.iq-btn:hover:not(.used) {
  background: rgba(255,255,255,.11);
  border-color: rgba(255,255,255,.2);
}
.iq-btn:active:not(.used) {
  background: rgba(255,255,255,.16);
}
.iq-btn.used {
  opacity: .32;
  text-decoration: line-through;
  text-decoration-color: rgba(255,255,255,.4);
  pointer-events: none;
  cursor: default;
}

.iq-close-btn {
  margin-top: 10px;
  width: 100%;
  padding: 11px;
  background: #1e3a5f;
  border: none;
  border-radius: 99px;
  font: 700 13px Georgia, serif;
  color: #fff;
  cursor: pointer;
  opacity: 0;
  pointer-events: none;
  transition: opacity .3s ease, transform .3s ease, background .18s;
  transform: translateY(8px);
}
.iq-close-btn.ready {
  opacity: 1;
  pointer-events: all;
  transform: translateY(0);
}
.iq-close-btn.ready:hover { background: #264d7a; }
.iq-close-btn.ready:active { transform: scale(.98); }

/* ── Animation nervosité ── */
@keyframes iqShake {
  0%,100% { transform: translateX(0); }
  20%     { transform: translateX(-4px); }
  40%     { transform: translateX(4px); }
  60%     { transform: translateX(-3px); }
  80%     { transform: translateX(3px); }
}
#cr.iq-nervous {
  animation: iqShake .4s ease;
}
#dlg.iq-tense {
  border-color: #f59e0b !important;
  box-shadow: 0 0 18px rgba(245,158,11,.22) !important;
}

/* ── Mobile ── */
@media (max-width: 768px) {
  #interro-panel {
    width: 100%;
    max-width: 100%;
    border-radius: 14px 14px 0 0;
    max-height: 55dvh;
    overflow-y: auto;
  }
  .iq-btn { font-size: 11.5px; padding: 10px 12px; }
  .iq-close-btn { font-size: 12px; }
}
`;
  document.head.appendChild(s);
})();

// ── Données des 10 affaires ───────────────────────────────────
const INTERRO_DATA = {

  // Affaire 1 — Le Recrutement (ch=0)
  0: {
    char: { css: 'c-aubert', em: '🧑‍💼', nm: 'M. Aubert — Administrateur' },
    questions: [
      { txt: "Depuis combien de temps connaissez-vous Lucas Aubert ?",
        nervous: false,
        rep: "C'est mon neveu, je le connais depuis sa naissance. Un garçon brillant, très motivé." },
      { txt: "Combien de candidats avez-vous rencontrés pour ce poste ?",
        nervous: false,
        rep: "Je ne suis pas impliqué dans le processus de recrutement, c'est votre rôle. Je fais juste une recommandation." },
      { txt: "Le poste exige 5 ans d'expérience en valorisation. Lucas en a combien ?",
        nervous: true,
        rep: "L'expérience ça s'acquiert… Il a d'autres qualités. La motivation compte aussi, non ?" },
      { txt: "Avez-vous déclaré ce lien familial au conseil d'administration ?",
        nervous: true,
        rep: "Je… ce n'est qu'une recommandation informelle. Rien d'officiel." },
      { txt: "Quel est votre rôle exact dans la gouvernance de la SEM ?",
        nervous: false,
        rep: "Je suis administrateur, représentant des collectivités. Je veille aux intérêts publics." },
      { txt: "Si Lucas est recruté, comment éviter tout conflit d'intérêts dans vos fonctions ?",
        nervous: true,
        rep: "Vous compliquez les choses… C'est juste du bon sens de valoriser les talents locaux." },
    ]
  },

  // Affaire 2 — Le Déjeuner (ch=1)
  1: {
    char: { css: 'c-laroche', em: '🤝', nm: 'M. Laroche — Commercial GlobalTri' },
    questions: [
      { txt: "Depuis quand GlobalTri travaille avec des SEM ?",
        nervous: false,
        rep: "15 ans d'expérience. Nous équipons 47 centres de tri en France." },
      { txt: "Les invitations Roland Garros — c'est une pratique courante chez vous ?",
        nervous: true,
        rep: "C'est… du relationnel classique. Tout le secteur fait ça. Rien d'inhabituel." },
      { txt: "Quels sont vos délais de livraison habituels ?",
        nervous: false,
        rep: "Entre 4 et 6 mois selon la complexité. Nous respectons toujours nos engagements." },
      { txt: "La norme GL-2247 que vous citez — d'autres fournisseurs peuvent-ils la respecter ?",
        nervous: true,
        rep: "C'est… un standard du secteur. Enfin, nos concurrents ont du mal à atteindre ce niveau." },
      { txt: "Avez-vous des références de projets similaires au nôtre ?",
        nervous: false,
        rep: "Absolument, je peux vous envoyer une liste complète. Des projets exemplaires." },
      { txt: "Pourquoi transmettre des spécifications techniques avant l'appel d'offres officiel ?",
        nervous: true,
        rep: "C'est pour vous faire gagner du temps… Un service qu'on rend à nos partenaires potentiels." },
    ]
  },

  // Affaire 3 — Fantômes de la Paie (ch=2)
  2: {
    char: { css: 'c-dominique', em: '👩‍💼', nm: 'Responsable RH — Témoin' },
    questions: [
      { txt: "Depuis quand M. Favre travaille avec nous ?",
        nervous: false,
        rep: "Depuis janvier dernier. Contrat de consultant externe, renouvelable chaque trimestre." },
      { txt: "Comment expliquez-vous l'écart entre son salaire contractuel et ce qu'il perçoit ?",
        nervous: true,
        rep: "Je… j'ai signalé l'anomalie. Ce n'est pas moi qui valide les virements finaux." },
      { txt: "Qui a modifié son RIB en janvier ?",
        nervous: false,
        rep: "La modification vient du service comptabilité. Normalement c'est sur demande écrite." },
      { txt: "M. Favre est badgé comme employé permanent mais son contrat dit externe. Qui a créé ce badge ?",
        nervous: true,
        rep: "C'est… inhabituel en effet. Je n'ai pas autorisé ça. Il faudrait vérifier." },
      { txt: "Combien de consultants externes avons-nous en ce moment ?",
        nervous: false,
        rep: "Une dizaine environ. Tous avec des contrats séparés et des accès limités." },
      { txt: "Avez-vous un avenant signé justifiant la prime de 3 200 € supplémentaires ?",
        nervous: true,
        rep: "Non… il n'y en a pas. C'est ce qui m'a alertée en faisant les comptes." },
    ]
  },

  // Affaire 4 — Nuit des Tonnages (ch=3)
  3: {
    char: { css: 'c-patrice', em: '🚛', nm: 'Patrice — Chauffeur ViteDéchets' },
    questions: [
      { txt: "C'est votre premier passage ici ce soir ?",
        nervous: false,
        rep: "Non, je fais cette route deux fois par semaine. Depuis 3 ans maintenant." },
      { txt: "Le camion affiche 18 tonnes sur notre pont-bascule. Votre bon dit 12. Vous l'expliquez comment ?",
        nervous: true,
        rep: "Les instruments peuvent… se tromper parfois. Mon patron dit que c'est normal." },
      { txt: "Votre patron vous a appelé ce soir avant votre arrivée ?",
        nervous: false,
        rep: "Oui il appelle souvent. Pour le planning, les livraisons. C'est normal." },
      { txt: "C'est la troisième fois ce mois qu'il y a un écart. Vous étiez au courant ?",
        nervous: true,
        rep: "Je fais mon travail… Je conduis, c'est tout. Je ne contrôle pas le chargement." },
      { txt: "Depuis combien de temps ViteDéchets travaille avec la SEM ?",
        nervous: false,
        rep: "Longtemps. Avant moi déjà. M. Garnier et la SEM se connaissent bien." },
      { txt: "L'enveloppe que vous avez posée sur le bureau — c'est quoi exactement ?",
        nervous: true,
        rep: "C'est… M. Garnier m'a dit de vous la remettre. Je sais pas ce qu'il y a dedans." },
    ]
  },

  // Affaire 5 — Chantage Autorisation (ch=4)
  4: {
    char: { css: 'c-lefebvre', em: '🧾', nm: 'M. Lefebvre — Cabinet BioConsult' },
    questions: [
      { txt: "Combien de dossiers similaires avez-vous traités avec cette préfecture ?",
        nervous: false,
        rep: "Douze dossiers acceptés. Taux de réussite 100 %. Nous connaissons le terrain." },
      { txt: "Votre associée travaille à la préfecture, service environnement. C'est un avantage ?",
        nervous: true,
        rep: "C'est… une coïncidence. Elle n'intervient pas dans nos dossiers clients." },
      { txt: "Quels livrables incluez-vous dans votre prestation ?",
        nervous: false,
        rep: "Un rapport complet, des recommandations détaillées, un accompagnement au dépôt." },
      { txt: "Pourquoi 45 000 € pour une étude de 72 h ? C'est quel tarif horaire ?",
        nervous: true,
        rep: "C'est… notre expertise qui justifie ce tarif. Vous payez un réseau, pas des heures." },
      { txt: "Quel est le délai habituel d'instruction par la préfecture ?",
        nervous: false,
        rep: "Entre 2 et 6 mois normalement. Nous pouvons accélérer certains processus." },
      { txt: "\"Accélérer certains processus\" — concrètement ça veut dire quoi ?",
        nervous: true,
        rep: "Ça veut dire qu'on connaît les bons interlocuteurs… Vous voyez ce que je veux dire." },
    ]
  },

  // Affaire 6 — Offensive Commerciale (ch=5)
  5: {
    char: { css: 'c-perrin', em: '🏛️', nm: 'Mme Perrin — DST Val-Vert' },
    questions: [
      { txt: "Combien de candidats répondent à cet appel d'offres ?",
        nervous: false,
        rep: "Quatre dossiers reçus. La commission évalue sur critères objectifs." },
      { txt: "Le sponsoring du club de football — c'est une condition pour obtenir le marché ?",
        nervous: true,
        rep: "Condition c'est un grand mot… Disons que l'engagement territorial compte beaucoup ici." },
      { txt: "Quels sont les critères de notation de l'appel d'offres ?",
        nervous: false,
        rep: "Prix 40 %, technique 40 %, références 20 %. Tout est dans le règlement." },
      { txt: "Le club de tennis est présidé par le maire. Vous en êtes conscient ?",
        nervous: true,
        rep: "M. Fontaine s'implique beaucoup dans la vie locale… C'est une qualité, non ?" },
      { txt: "Quel est le calendrier de décision de la commission ?",
        nervous: false,
        rep: "Décision dans 6 semaines. Notification officielle par courrier recommandé." },
      { txt: "Ce contact en dehors de la procédure officielle — vous savez que c'est interdit par le règlement ?",
        nervous: true,
        rep: "On… discute juste. Rien d'écrit, rien d'officiel. C'est du relationnel." },
    ]
  },

  // Affaire 7 — Extension Horizon (ch=6)
  6: {
    char: { css: 'c-ruiz', em: '📋', nm: 'Mme Ruiz — Consultante foncière' },
    questions: [
      { txt: "Depuis combien de temps êtes-vous consultante foncière ?",
        nervous: false,
        rep: "12 ans d'expérience. Spécialisée dans les acquisitions pour le secteur public." },
      { txt: "Le vendeur est le frère d'un de nos administrateurs. Vous le saviez ?",
        nervous: true,
        rep: "C'est… une information que j'ai découverte tard. Le prix reste intéressant, non ?" },
      { txt: "Comment avez-vous négocié ce prix de 180 €/m² ?",
        nervous: false,
        rep: "Grâce à mon réseau et ma connaissance du marché local. C'est mon expertise." },
      { txt: "Votre facture de 15 000 € — quel livrable écrit l'accompagne ?",
        nervous: true,
        rep: "Certaines choses ne s'écrivent pas… Mon travail c'est aussi la discrétion." },
      { txt: "Avez-vous fait évaluer le terrain par les Domaines ?",
        nervous: false,
        rep: "Ce n'est pas obligatoire pour une acquisition privée. C'est vous qui décidez." },
      { txt: "\"La discrétion nécessaire\" — c'est quoi exactement ce que vous dissimulez ?",
        nervous: true,
        rep: "Je… je protège mes sources. C'est tout. Ne compliquez pas les choses." },
    ]
  },

  // Affaire 8 — Urgence Fin de Mois (ch=7)
  7: {
    char: { css: 'c-renaud', em: '💼', nm: 'M. Renaud — Prestataire ProSite' },
    questions: [
      { txt: "Depuis quand travaillez-vous avec la SEM ?",
        nervous: false,
        rep: "Trois ans. Toujours livré dans les délais. Un partenariat solide." },
      { txt: "Pourquoi avoir changé votre RIB maintenant ?",
        nervous: true,
        rep: "Changement de banque… Pour optimiser notre trésorerie. Rien d'anormal." },
      { txt: "La pièce critique — vous pouvez livrer quand sans l'avance ?",
        nervous: false,
        rep: "Dans les délais contractuels. 30 jours fin de mois. Comme d'habitude." },
      { txt: "Votre contrat ne prévoit pas d'avance. Qui vous a dit de demander ça ?",
        nervous: true,
        rep: "Personne… c'est moi qui… La situation est difficile. Je pensais que vous comprendriez." },
      { txt: "Vos difficultés financières — depuis quand elles durent ?",
        nervous: false,
        rep: "Quelques mois seulement. Un client qui ne paie pas. Ça arrive dans notre secteur." },
      { txt: "L'audit trimestriel commence dans 72 h. C'est pour ça que c'est urgent ?",
        nervous: true,
        rep: "Je… c'est une coïncidence. J'avais besoin de liquidités de toute façon." },
    ]
  },

  // Affaire 9 — Opération Prestige (ch=8)
  8: {
    char: { css: 'c-fontaine', em: '🏅', nm: 'M. Fontaine — Maire de Villenord' },
    questions: [
      { txt: "Depuis quand présidez-vous le TC Villenord ?",
        nervous: false,
        rep: "Huit ans. Je suis attaché au sport local. C'est du bénévolat." },
      { txt: "Le permis de construire que nous attendons — vous suivez son instruction ?",
        nervous: true,
        rep: "Je ne m'immisce pas dans les services administratifs… Enfin, je m'informe parfois." },
      { txt: "Le gala annuel de la ville — qui en finance habituellement le budget ?",
        nervous: false,
        rep: "Plusieurs sponsors locaux. C'est une tradition importante pour notre commune." },
      { txt: "Un don au TC Villenord que vous présidez pendant notre demande de permis — vous ne voyez pas de problème ?",
        nervous: true,
        rep: "Le sport et l'urbanisme… c'est deux choses séparées. Je suis bénévole, je vous rappelle." },
      { txt: "Combien de demandes de permis similaires avez-vous eu cette année ?",
        nervous: false,
        rep: "Une dizaine. Notre commune se développe. C'est positif pour tous." },
      { txt: "Un avantage supérieur à 150 € à un élu doit être déclaré à la HATVP. Êtes-vous prêt à le déclarer ?",
        nervous: true,
        rep: "Je… il faudra voir avec nos services juridiques. C'est peut-être prématuré d'en parler." },
    ]
  },

  // Affaire 10 — Contrat à Tout Prix (ch=9)
  9: {
    char: { css: 'c-deschamps', em: '🕵️', nm: 'L\'intermédiaire — Contact douteux' },
    questions: [
      { txt: "Comment avez-vous eu nos coordonnées ?",
        nervous: false,
        rep: "Le réseau. Tout le monde se connaît dans ce secteur. Je peux aider beaucoup de monde." },
      { txt: "Votre contact dans la commission d'évaluation — il s'appelle comment ?",
        nervous: true,
        rep: "Je… les noms c'est confidentiel. Vous achetez un résultat, pas un nom." },
      { txt: "Vous proposez ce service à tous les candidats ?",
        nervous: false,
        rep: "À ceux qui ont les moyens de leurs ambitions. C'est du conseil stratégique." },
      { txt: "8 000 € en espèces — vous avez une facture pour ça ?",
        nervous: true,
        rep: "Les espèces c'est plus simple… Moins de paperasse. Vous comprenez." },
      { txt: "Depuis combien de temps vous faites ce type de conseil ?",
        nervous: false,
        rep: "Des années. Beaucoup de marchés gagnés. Des clients satisfaits." },
      { txt: "Ce que vous proposez est un délit de corruption active. Vous en êtes conscient ?",
        nervous: true,
        rep: "C'est… une vision très théorique des choses. Dans la pratique… Réfléchissez bien à votre réponse." },
    ]
  },
};

// ── État interne ──────────────────────────────────────────────
const _iq = { posed: 0, max: 3, data: null };

// ═══════════════════════════════════════
// POINT D'ENTRÉE — appelé par le moteur
// ═══════════════════════════════════════
function startInvestigation() {
  etatJeu.phase = 'investigation';
  etatJeu.invFound = 0;
  if (typeof _updateNavButtons === 'function') _updateNavButtons();

  showChar('cl', null);

  const data = INTERRO_DATA[etatJeu.ch];
  if (data) {
    _iq.data = data;
    _startInterro(data);
  } else {
    // Fallback sécurité — ne devrait pas arriver
    endInvestigation();
  }
}

// ── Construction du panneau ───────────────────────────────────
function _startInterro(data) {
  _iq.posed = 0;

  // Affiche le personnage côté droit
  showChar('cr', data.char);

  // Retire un éventuel panneau résiduel
  const existing = document.getElementById('interro-panel');
  if (existing) existing.remove();

  const panel = document.createElement('div');
  panel.id = 'interro-panel';

  const remaining = _iq.max;
  panel.innerHTML = `
    <div class="iq-header">
      <div class="iq-title">Vos questions — Choisissez-en ${_iq.max}</div>
      <div class="iq-counter" id="iq-counter">${remaining} question${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}</div>
    </div>
    <div class="iq-list" id="iq-list">
      ${data.questions.map((q, i) => `
        <button class="iq-btn" id="iq-btn-${i}" onclick="iqAsk(${i})">${q.txt}</button>
      `).join('')}
    </div>
    <button class="iq-close-btn" id="iq-close-btn" onclick="iqClose()">Clore l'interrogatoire →</button>
  `;

  document.getElementById('game').appendChild(panel);
}

// ── Poser une question ────────────────────────────────────────
function iqAsk(idx) {
  const data = _iq.data;
  if (!data) return;
  const q = data.questions[idx];
  if (!q) return;

  // Marquer le bouton comme utilisé
  const btn = document.getElementById('iq-btn-' + idx);
  if (btn) btn.classList.add('used');

  _iq.posed++;

  // Mettre à jour le compteur
  const remaining = _iq.max - _iq.posed;
  const counter = document.getElementById('iq-counter');
  if (counter) {
    counter.textContent = remaining > 0
      ? `${remaining} question${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}`
      : 'Interrogatoire terminé';
  }

  // Afficher la réponse dans la boîte de dialogue
  showDlg(data.char.nm, q.rep, 'cr');

  // Animation nervosité si question pertinente
  if (q.nervous) {
    const cr  = document.getElementById('cr');
    const dlg = document.getElementById('dlg');

    if (cr) {
      cr.classList.remove('iq-nervous');
      // Force reflow pour relancer l'animation
      void cr.offsetWidth;
      cr.classList.add('iq-nervous');
      setTimeout(() => cr.classList.remove('iq-nervous'), 450);
    }
    if (dlg) {
      dlg.classList.add('iq-tense');
      setTimeout(() => dlg.classList.remove('iq-tense'), 2200);
    }
    if (navigator.vibrate) navigator.vibrate([30, 40, 20]);
  }

  // Activer le bouton de clôture après 3 questions
  if (_iq.posed >= _iq.max) {
    const closeBtn = document.getElementById('iq-close-btn');
    if (closeBtn) closeBtn.classList.add('ready');

    // Désactiver les questions restantes
    document.querySelectorAll('.iq-btn:not(.used)').forEach(b => {
      b.classList.add('used');
    });
  }
}

// ── Clore l'interrogatoire ────────────────────────────────────
function iqClose() {
  const panel = document.getElementById('interro-panel');
  if (panel) {
    panel.style.transition = 'opacity .25s, transform .25s';
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(12px)';
    setTimeout(() => panel.remove(), 260);
  }

  hideDlg();
  showChar('cr', null);

  // Marquer toutes les preuves comme trouvées pour débloquer les choix
  etatJeu.invFound = CHAPTERS[etatJeu.ch].clues.length;

  setTimeout(() => endInvestigation(), 280);
}

// ── Fin investigation → choix ─────────────────────────────────
function endInvestigation() {
  // S'assurer que le panneau #inv classique est masqué
  const inv = document.getElementById('inv');
  if (inv) inv.classList.add('hidden');

  showChoicePanel();
}

// ── Stubs de compatibilité (appelés nulle part mais sécurité) ─
function openClue() {}
