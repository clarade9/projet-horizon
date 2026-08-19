// ═══════════════════════════════════════════════════════════════
// LIVE FORMATEUR — Logique UI de l'écran projeté formateur
// ═══════════════════════════════════════════════════════════════

let _lfTimerDecision = 60;  // défaut 60s — configurable via lfSetTimerDecision()
let _lfTimerReflexe  = 90;  // défaut 90s (pour usage futur côté joueur)

// ── Prénoms fixes par affaire (mode Live) ───────────────────────
const _LF_PRENOMS = ['Sophie','Thomas','Claire','Marc','Julie','Nicolas','Isabelle','Laurent','Camille','Éric','Julien'];
function _lfPrenom(affaireIdx) { return _LF_PRENOMS[affaireIdx] || ''; }
function _lfTxt(texte, affaireIdx) {
  if (!texte) return texte;
  // Côté formateur : remplace {prénom} par "[prénom]" (placeholder lisible) si pas de nom défini
  const prenom = _lfPrenom(affaireIdx) || '[prénom]';
  return texte.replace(/\{pr[ée]nom\}/gi, prenom);
}

// ── État local ─────────────────────────────────────────────────
let _lfState = {
  sessionId:       null,
  sessionCode:     null,
  formateurToken:  null,
  affaireIdx:      0,
  parcours:        [],      // liste ordonnée des indices d'affaires à jouer
  parcoursPos:     -1,      // position courante dans parcours
  timerInterval:      null,
  timerSecondes:      60,
  countdownInterval:  null,  // C5 — compte à rebours avant ouverture auto des votes
  autoFermerTimeout:  null,  // C4 — délai auto-fermeture quand tous ont voté
  _pollVotesInterval: null, // polling Supabase en fallback du broadcast
  participants:    [],      // { nom, joueurId }
  votesParChoix:     [0,0,0], // votes reçus pour A/B/C (index original)
  votesTotal:        0,
  votesOuvertDepuis: null,   // ISO timestamp de l'ouverture des votes (seed du shuffle)
  ordreChoix:        [0,1,2],// ordre affiché des options : ordreChoix[posAffiche] = origIdx
  joueurVotes:       {},     // joueurId → true
  scoreParJoueur:  {},      // joueurId → { nom, score }
  affairesJouees:  [],      // [{ affaireIdx, votes:{0,1,2}, total }]

  // Dialogue
  dlgSteps:        [],      // étapes aplaties : [{type:'context'|'dlg', ...data}]
  dlgCursor:       -1,      // index courant dans dlgSteps
  lectureAutoActif: false,  // true = passage auto quand tous ont lu
  _lectureTimeout:  null,   // setTimeout en attente de passage auto

  // Quiz final
  quizQuestions:   [],      // questions du quiz
  quizCursor:      0,       // question en cours
  quizVotes:       {},      // joueurId → choix
  quizVotesTotal:  0,
  quizTimer:       null,
};

// ── Utilitaire DOM ──────────────────────────────────────────────
function _lf$(id) { return document.getElementById(id); }
function _lfShow(id) { const el = _lf$(id); if (el) el.style.display = ''; }
function _lfHide(id) { const el = _lf$(id); if (el) el.style.display = 'none'; }

function _lfScreen(id) {
  ['lf-landing','lf-prologue','lf-game','lf-correction','lf-podium-inter','lf-resultats','lf-quiz','lf-debrief','lf-fin'].forEach(s => {
    const el = _lf$(s);
    if (el) el.classList.toggle('on', s === id);
  });
}

// ── Init & Login ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const sb = LiveSession.init();
  console.log('[Formateur] DOMContentLoaded — client Supabase :', sb ? 'OK' : 'ÉCHEC');
  _lfPopulerSelecteurs();
  _lfInitClickZone();
  const inp = _lf$('lf-login-input');
  if (inp) setTimeout(() => inp.focus(), 100);
});

function lfCheckLogin() {
  // TEMPORAIREMENT DÉSACTIVÉ POUR TESTS — 2026-07-17 — à réactiver avant mise en prod publique
  // Pour réactiver : décommenter le bloc if/else ci-dessous et supprimer les 4 lignes "bypass" qui suivent
  /*
  const val = (_lf$('lf-login-input').value || '').trim().toUpperCase();
  const bon = (CONFIG.formateur.codeAcces || 'FORMATEUR2025').toUpperCase();
  if (val !== bon) {
    _lf$('lf-login-err').textContent = 'Code incorrect.';
    return;
  }
  */
  // — BYPASS TESTS — accès direct sans vérification du code —
  _lf$('lf-login').classList.add('hidden');
  // Plein écran immédiat dès la validation du code (geste utilisateur requis)
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
  const btn = _lf$('lf-btn-fs');
  if (btn) { btn.textContent = '✕ Quitter plein écran'; btn.classList.add('active'); }
  lfNouvelleSession();
}

// ── Peupler la liste de parcours (checkboxes) ───────────────────
function _lfPopulerSelecteurs() {
  const list = _lf$('lf-parcours-list');
  if (!list) return;
  list.innerHTML = '';
  CHAPTERS.forEach((ch, i) => {
    const label = document.createElement('label');
    label.className = 'lf-parcours-item';
    label.innerHTML = `
      <input type="checkbox" class="lf-parcours-cb" value="${i}" checked>
      <span class="lf-parcours-num">${ch.num}</span>
      <span class="lf-parcours-name">${ch.name}</span>`;
    label.querySelector('input').addEventListener('change', _lfUpdateBtnCommencer);
    list.appendChild(label);
  });
  _lfUpdateBtnCommencer();
}

function _lfGetParcoursSelectionne() {
  return Array.from(document.querySelectorAll('.lf-parcours-cb:checked'))
    .map(cb => parseInt(cb.value));
}

function _lfUpdateBtnCommencer() {
  const btn = _lf$('lf-btn-commencer');
  const nb  = _lfGetParcoursSelectionne().length;
  if (btn) btn.disabled = _lfState.participants.length < 1 || nb < 1;
}

function lfSelectAll() {
  document.querySelectorAll('.lf-parcours-cb').forEach(cb => { cb.checked = true; });
  _lfUpdateBtnCommencer();
}

function lfSelectNone() {
  document.querySelectorAll('.lf-parcours-cb').forEach(cb => { cb.checked = false; });
  _lfUpdateBtnCommencer();
}

// Parcours preset : indices des affaires selon le profil de risque
// Basé sur la thématique des CHAPTERS (ordre 0-9)
const LF_PRESETS = {
  complet:     [0,1,2,3,4,5,6,7,8,9,10,11,12], // 13 affaires — parcours complet
  achats:      [1,2,6,9],   // Achats/Marchés : favoritisme, devis truqués, commission, contrat
  finance:     [3,7,8],     // Finance : manipulation pesée, fin de mois, facturation fictive
  rh:          [0,4,5],     // RH : recrutement, cadeau invit, prise illégale intérêts
  maintenance: [10,12],     // Maintenance + Exploitation : contrat de confiance, collecte de nuit
};

function lfAppliquerPreset(preset) {
  // Highlight le bouton sélectionné
  document.querySelectorAll('.lf-preset-btn').forEach(btn => btn.classList.remove('active'));
  const clicked = event && event.currentTarget;
  if (clicked) clicked.classList.add('active');

  if (preset === 'custom') {
    // Mode custom : décocher tout et laisser l'utilisateur choisir
    lfSelectNone();
    return;
  }

  const indices = LF_PRESETS[preset] || [];
  document.querySelectorAll('.lf-parcours-cb').forEach(cb => {
    cb.checked = indices.includes(parseInt(cb.value));
  });
  _lfUpdateBtnCommencer();
}

// ── Nouvelle session ─────────────────────────────────────────────
async function lfNouvelleSession() {
  Object.assign(_lfState, {
    sessionId: null, sessionCode: null, formateurToken: null,
    affaireIdx: 0, parcours: [], parcoursPos: -1,
    participants: [], votesParChoix: [0,0,0],
    votesTotal: 0, votesOuvertDepuis: null, joueurVotes: {}, scoreParJoueur: {}, affairesJouees: [],
    dlgSteps: [], dlgCursor: -1,
    quizQuestions: [], quizCursor: 0, quizVotes: {}, quizVotesTotal: 0, quizTimer: null,
  });
  if (_lfState.timerInterval)     clearInterval(_lfState.timerInterval);
  if (_lfState.countdownInterval) clearInterval(_lfState.countdownInterval);
  if (_lfState.autoFermerTimeout) clearTimeout(_lfState.autoFermerTimeout);
  LiveSession.seDesabonner();

  _lfScreen('lf-landing');
  _lf$('lf-code-display').textContent = 'Génération…';
  _lf$('lf-nb-connectes').textContent = '0';
  _lfUpdateBtnCommencer();

  const code = await LiveSession.genererCode();
  const session = await LiveSession.creerSession(code);
  if (!session) {
    _lf$('lf-code-display').textContent = 'Erreur';
    _lf$('lf-url-display').textContent  = 'Échec Supabase — ouvrez la console (F12) pour le détail.';
    return;
  }

  _lfState.sessionId     = session.id;
  _lfState.sessionCode   = session.code;
  _lfState.formateurToken = session.formateurToken;

  _lf$('lf-code-display').textContent = code;

  const url = window.location.origin + '/live-joueur.html?code=' + code;
  _lf$('lf-url-display').textContent = url;

  const sessionLabel = _lf$('lf-session-code-label');
  if (sessionLabel) sessionLabel.textContent = 'Code : ' + code;

  const qrEl = _lf$('lf-qrcode');
  qrEl.innerHTML = '';
  try {
    new QRCode(qrEl, {
      text: url,
      width: 200, height: 200,
      colorDark: '#1b2a4a',
      colorLight: '#ffffff',
    });
  } catch(e) {
    qrEl.textContent = url;
  }

  LiveSession.abonnerPresence(code, null, null, (participants) => {
    _lfState.participants = participants;
    _lf$('lf-nb-connectes').textContent = participants.length;
    _lfUpdateBtnCommencer();
    _lfMettreAJourParticipants();
  });
}

// ── Prologue de mise en contexte ─────────────────────────────────
let _lfProSlide = 0;
const _LF_PRO_TOTAL = 5;

function _lfPrologueAfficherSlide(n) {
  _lfProSlide = n;
  // Masquer tous les slides, afficher le bon
  for (let i = 0; i < _LF_PRO_TOTAL; i++) {
    const el = _lf$('lf-pro-slide-' + i);
    if (el) el.classList.toggle('active', i === n);
  }
  // Indicateur
  const ind = _lf$('lf-pro-indicator');
  if (ind) ind.textContent = (n + 1) + ' / ' + _LF_PRO_TOTAL;
  // Bouton nav : masqué sur le slide 5 (QR + bouton lancer intégré)
  const btn = _lf$('lf-pro-btn-next');
  if (btn) btn.style.display = n === _LF_PRO_TOTAL - 1 ? 'none' : '';

  // Diffuser la slide aux joueurs et brancher la lecture collective
  if (_lfState.sessionId && _lfState.formateurToken) {
    LiveSession.diffuserPrologueSlide(_lfState.sessionId, _lfState.formateurToken, n);
    _lfBrancherLecturePrologue(n);
  }
}

function _lfBrancherLecturePrologue(slideIdx) {
  const nb = _lfState.participants.length;
  if (nb === 0) return;
  const ligneId = 'prologue_slide_' + slideIdx;
  _lfState.lectureAutoActif = true;

  const el = _lf$('lf-pro-lecture-indicateur');
  if (el) { el.style.display = ''; el.textContent = '0 / ' + nb + ' ont lu'; }

  LiveSession.abonnerLecture(
    _lfState.sessionCode, ligneId, nb,
    () => {
      // Tous ont lu — passage auto après 3s
      if (el) el.className = 'lf-lecture-indicateur lf-lecture-tous';
      _lfState._lectureTimeout = setTimeout(() => {
        if (_lfState.lectureAutoActif) lfPrologueSuivant();
      }, 3000);
    },
    (actuel, total) => {
      if (el) el.textContent = actuel + ' / ' + total + ' ont lu';
    }
  );
}

function lfPrologueSuivant() {
  if (_lfProSlide < _LF_PRO_TOTAL - 1) {
    _lfPrologueAfficherSlide(_lfProSlide + 1);
  }
}

function lfProloguePasser() {
  _lfPrologueLancer();
}

function lfPrologueTerminer() {
  _lfPrologueLancer();
}

function _lfPrologueLancer() {
  _lfScreen('lf-game');

  // Afficher le dialogue Dominique avant la 1ère affaire
  if (typeof PROLOGUE !== 'undefined' && PROLOGUE.length > 0) {
    _lfState.parcoursPos  = -1; // pas encore dans une affaire
    _lfState.affaireIdx   = -1; // marqueur "prologue"
    _lfState.dlgSteps     = PROLOGUE.map(line => ({ type: 'dlg', line }));
    // Dernière étape : bouton pour lancer la 1ère affaire
    _lfState.dlgSteps.push({ type: 'prologue_fin' });
    _lfState.dlgCursor    = -1;
    _lfState.lectureAutoActif = false;

    const gameLabel = _lf$('lf-game-affaire-label');
    if (gameLabel) gameLabel.textContent = 'Mise en contexte';
    _lfSetScene('prologue');
    lfAudioPrologue();
    _lfNext();
  } else {
    // Pas de données PROLOGUE — lancer directement la 1ère affaire
    _lfState.parcoursPos = 0;
    const idx = _lfState.parcours[0];
    _lfState.affaireIdx = idx;
    _lfInitAffaire(idx);
  }
}


// ── Commencer ────────────────────────────────────────────────────
function lfCommencer() {
  const parcours = _lfGetParcoursSelectionne();
  if (parcours.length === 0) return;
  _lfState.parcours    = parcours;
  _lfState.parcoursPos = -1;
  _lfState.affaireIdx  = parcours[0];
  // Lancer le prologue de mise en contexte
  _lfScreen('lf-prologue');
  _lfPrologueAfficherSlide(0);
  lfAudioPrologue();
  // Auto-avance slide 1 après 3s si le formateur ne clique pas
  setTimeout(() => {
    if (_lfProSlide === 0) _lfPrologueAfficherSlide(1);
  }, 3000);
  LiveSession.abonnerVotes(_lfState.sessionId, _lfOnNouveauVote);
}

// ── Construire les étapes de dialogue pour une affaire ───────────
// Ordre : carte contexte → préDialogue → dialogue principal → tension → vote
function _lfBuildSteps(idx) {
  const ch = CHAPTERS[idx];
  const steps = [];

  // Étape 0 : carte de contexte
  steps.push({ type: 'context', ch });

  // preDialogue (lignes narrateur avant MD0)
  if (ch.preDialogue && ch.preDialogue.length > 0) {
    ch.preDialogue.forEach(line => steps.push({ type: 'dlg', line }));
  }

  // Dialogue principal
  if (ch.dialogue && ch.dialogue.length > 0) {
    ch.dialogue.forEach(line => steps.push({ type: 'dlg', line }));
  }

  // Étape Réflexe Professionnel (si données disponibles)
  if (typeof REFLEXE_DATA !== 'undefined' && REFLEXE_DATA[idx]) {
    steps.push({ type: 'reflexe', ch, reflexeData: REFLEXE_DATA[idx] });
  }

  // Étape de tension (encadré avant vote — affiché si pressureIntro existe)
  if (ch.pressureIntro) {
    steps.push({ type: 'tension', ch });
  }

  // Étape vote (décision A/B/C)
  steps.push({ type: 'vote', ch });

  return steps;
}

// ── Initialiser une affaire (construit les étapes, affiche la 1ère) ──
function _lfInitAffaire(idx) {
  const ch = CHAPTERS[idx];
  _lfState.affaireIdx  = idx;
  _lfState.dlgSteps    = _lfBuildSteps(idx);
  _lfState.dlgCursor   = -1;
  _lfState.votesParChoix     = [0,0,0];
  _lfState.votesTotal        = 0;
  _lfState.votesOuvertDepuis = null;
  _lfState.ordreChoix        = [0,1,2];
  _lfState.joueurVotes       = {};
  _lfAnnulerCountdown();
  if (_lfState.autoFermerTimeout) { clearTimeout(_lfState.autoFermerTimeout); _lfState.autoFermerTimeout = null; }

  // Header
  const gameLabel = _lf$('lf-game-affaire-label');
  if (gameLabel) gameLabel.textContent = ch.num + ' — ' + ch.name;

  // Changer la scène
  _lfSetScene(ch.sc);

  // Musique de l'affaire
  lfAudioAffaire(idx);

  // Réinitialiser barres
  _lfMettreAJourBarres();
  _lfMettreAJourParticipants();

  // Notifier joueurs : affaire lancée (en attente des dialogues)
  LiveSession.lancerAffaire(_lfState.sessionId, idx, _lfState.formateurToken);

  // Nettoyer les lectures AVANT d'afficher le premier pas (évite faux déclenchements)
  const _lancerPremierPas = () => _lfNext();
  if (_lfState.sessionCode) {
    LiveSession.nettoyerLecturesAffaire(_lfState.sessionCode, idx).then(_lancerPremierPas);
  } else {
    _lancerPremierPas();
  }
}

// ── Avancer d'un pas dans le dialogue ────────────────────────────
function _lfNext() {
  // Annuler tout passage auto en attente
  if (_lfState._lectureTimeout) {
    clearTimeout(_lfState._lectureTimeout);
    _lfState._lectureTimeout = null;
  }

  _lfState.dlgCursor++;
  const step = _lfState.dlgSteps[_lfState.dlgCursor];
  if (!step) return;

  // Notifier les joueurs de la ligne courante avec le ligneId stable
  const ligneId = _lfLigneId(_lfState.affaireIdx, _lfState.dlgCursor);
  const _estPrologue = _lfState.affaireIdx === -1;
  if (step.type === 'reflexe') {
    LiveSession.ouvrirReflexe(_lfState.sessionId, _lfState.formateurToken, _lfState.affaireIdx);
  } else if (step.type !== 'vote' && step.type !== 'tension' && step.type !== 'prologue_fin') {
    LiveSession.diffuserDialogue(_lfState.sessionId, _lfState.formateurToken, _lfState.dlgCursor);
  }

  if (step.type === 'context') {
    _lfRendreContexte(step.ch);
    _lfSetPhase('dialogue');
    _lfBrancherLecture(ligneId);
  } else if (step.type === 'dlg') {
    _lfRendreDlg(step.line);
    _lfSetPhase('dialogue');
    if (!_estPrologue || _lfState.participants.length > 0) _lfBrancherLecture(ligneId);
    else _lfSetLectureIndicateur(null);
  } else if (step.type === 'reflexe') {
    _lfRendreReflexe(step.ch, step.reflexeData);
    _lfSetPhase('reflexe_attente');
    _lfSetLectureIndicateur(null);
  } else if (step.type === 'tension') {
    _lfRendreTension(step.ch);
    _lfSetPhase('dialogue');
    _lfSetLectureIndicateur(null);
  } else if (step.type === 'vote') {
    _lfRendreVote(step.ch);
    _lfSetPhase('affaire_active');
    _lfSetLectureIndicateur(null); // masquer
    _lfDemarrerCountdown();        // C5 — ouverture auto dans 10s
  } else if (step.type === 'prologue_fin') {
    // Fin du prologue Dominique → lancer la 1ère affaire
    _lfState.parcoursPos = 0;
    const idx = _lfState.parcours[0];
    _lfState.affaireIdx = idx;
    _lfInitAffaire(idx);
  }
}

// Génère un identifiant stable pour une ligne
function _lfLigneId(affaireIdx, cursor) {
  return 'ch' + affaireIdx + '_dl' + cursor;
}

// Branche la mécanique de lecture collective sur une ligne
function _lfBrancherLecture(ligneId) {
  const nb = _lfState.participants.length;
  if (!_lfState.sessionCode || nb <= 0) {
    _lfSetLectureIndicateur(null);
    return;
  }

  _lfState.lectureAutoActif = true;
  _lfSetLectureIndicateur({ actuel: 0, total: nb });

  LiveSession.abonnerLecture(
    _lfState.sessionCode,
    ligneId,
    nb,
    // onTousLu
    () => {
      _lfSetLectureIndicateur({ actuel: nb, total: nb, tousLu: true });
      _lfState._lectureTimeout = setTimeout(() => {
        if (_lfState.lectureAutoActif) _lfNext();
      }, 1500);
    },
    // onCompteurChange
    (actuel, total) => {
      _lfSetLectureIndicateur({ actuel, total, tousLu: actuel >= total });
    }
  );
}

// Met à jour l'indicateur de lecture dans la barre de contrôle
function _lfSetLectureIndicateur(data) {
  const el = _lf$('lf-lecture-indicateur');
  if (!el) return;
  if (!data) {
    el.style.display = 'none';
    return;
  }
  el.style.display = '';
  if (data.tousLu) {
    el.className = 'lf-lecture-indicateur lf-lecture-tous';
    el.textContent = 'Tous les participants ont lu — passage dans 2s';
  } else {
    el.className = 'lf-lecture-indicateur';
    el.textContent = 'Participants ayant lu : ' + data.actuel + ' / ' + data.total;
  }
}

// ── Changer la scène (fond + classe CSS) ─────────────────────────
function _lfSetScene(scKey) {
  const scene = _lf$('lf-scene');
  if (!scene) return;

  // Retirer toutes les classes de scène existantes
  scene.className = scene.className.replace(/\bsc-\S+/g, '').trim();

  if (scKey) {
    scene.classList.add('sc-' + scKey);
    // Image de fond via style (reprend la même logique que scenes.js)
    const img = _lf$('lf-scene-img');
    if (img) {
      // Map scene key → image file (extrait de scenes.js)
      const SC_IMGS = {
        prologue:          'prologue.jpg',
        rh:                'bureau1.jpg',
        bureau1:           'bureau1.jpg',
        bureauf:           'bureauf.jpg',
        bureau2:           'bureau2.jpg',
        bureaujour:        'bureaujour.webp',
        bureau9:           'bureau9.webp',
        mairie:            'mairie.webp',
        resto:             'resto.jpg',
        restojour:         'restojour.jpg',
        bistro:            'bistro.webp',
        sallereunion:      'sallereunion.webp',
        pesee:             'pesee.jpg',
        indus:             'indus.jpg',
        finance:           'findumois.webp',
        commercial:        'contratatoutprix.webp',
        tennis:            'tennis.jpg',
        epilogue:          'epilogue.webp',
        maintenance:       'maintenance.webp',
        maintenancebureau: 'maintenancebureau.webp',
        maintenancereunion:'maintenancereunion.webp',
        nuitcollecte:      'nuitcollecte.webp',
        reunionqse:        'reunionqse.webp',
        zone3:             'zone3.webp',
        depot:             'depot.webp',
        // Scènes avec overlay téléphone → image de fond du bureau
        bureaularoche:     'bureau9.webp',
        bureauPerrin:      'bureau9.webp',
      };
      const file = SC_IMGS[scKey];
      img.src = file ? 'assets/scenes/' + file : '';
      img.style.display = file ? '' : 'none';
    }
  }
}

// ── Rendu carte contexte ─────────────────────────────────────────
function _lfRendreContexte(ch) {
  const zone = _lf$('lf-dlg-zone');
  if (!zone) return;

  zone.classList.remove('lf-dlg-zone--large');
  // Charger la scène de l'affaire
  _lfSetScene(ch.sc);

  // Effacer le personnage
  _lfSetPersonnage(null, null);

  zone.innerHTML = `
    <div class="lf-dlg-context-card">
      <div class="lf-dlg-context-eye">${ch.context?.eye || '📋'}</div>
      <div class="lf-dlg-context-title">${ch.context?.title || ch.name}</div>
      <div class="lf-dlg-context-body">${ch.context?.body || ''}</div>
    </div>`;

  _lf$('lf-dlg-speaker').textContent = ch.num;
  _lfSetBtnNext(true, 'Commencer →');
}

// ── Rendu phase Réflexe Professionnel (formateur) ────────────────
function _lfRendreReflexe(ch, rd) {
  const zone = _lf$('lf-dlg-zone');
  if (!zone) return;

  zone.classList.add('lf-dlg-zone--large');
  _lfSetPersonnage(null, null);

  const qHtml = (rd.questions || []).map((q, i) =>
    `<div class="lf-reflexe-item"><span class="lf-reflexe-num">Q${i+1}</span>${_lfEsc(q.txt)}</div>`
  ).join('');
  const aHtml = (rd.actions || []).map((a, i) =>
    `<div class="lf-reflexe-item"><span class="lf-reflexe-num">A${i+1}</span>${_lfEsc(a.txt)}</div>`
  ).join('');

  zone.innerHTML = `
    <div class="lf-reflexe-panel">
      <div class="lf-reflexe-header">
        <div class="lf-reflexe-eyebrow">Phase 1 — Réflexe Professionnel</div>
        <div class="lf-reflexe-title">${_lfEsc(ch.name)}</div>
        <div class="lf-reflexe-sub">Les participants choisissent 2 questions et 2 actions parmi 4</div>
      </div>
      <div class="lf-reflexe-cols">
        <div class="lf-reflexe-col">
          <div class="lf-reflexe-col-title">Questions (choisir 2)</div>
          ${qHtml}
        </div>
        <div class="lf-reflexe-col">
          <div class="lf-reflexe-col-title">Actions (choisir 2)</div>
          ${aHtml}
        </div>
      </div>
      <div class="lf-reflexe-waiting" id="lf-reflexe-waiting">
        <span class="lv-pulse-dot"></span> En attente des réponses…
        <span id="lf-reflexe-count" class="lf-reflexe-count">0 / ${_lfState.participants.length}</span>
      </div>
    </div>`;

  _lf$('lf-dlg-speaker').textContent = 'Réflexe Professionnel';
  _lfSetBtnNext(false);
}

// ── Rendu encadré de tension (transition avant vote) ─────────────
function _lfRendreTension(ch) {
  const zone = _lf$('lf-dlg-zone');
  if (!zone) return;

  zone.classList.remove('lf-dlg-zone--large');
  _lfSetPersonnage(null, null);

  zone.innerHTML = `
    <div class="lf-dlg-tension-card">
      <div class="lf-dlg-tension-eyebrow">📌 La pression monte</div>
      <div class="lf-dlg-tension-text">${_lfEsc(ch.pressureIntro)}</div>
      <div class="lf-dlg-tension-question">Comment réagissez-vous ?</div>
    </div>`;

  _lf$('lf-dlg-speaker').textContent = 'Situation';
  _lfSetBtnNext(true, 'Lancer le vote →');
}

// ── Rendu ligne de dialogue ──────────────────────────────────────
function _lfRendreDlg(line) {
  const zone = _lf$('lf-dlg-zone');
  if (!zone) return;

  zone.classList.remove('lf-dlg-zone--large');
  // Changer la scène si la ligne l'impose, sinon garder celle de l'affaire
  const _affaire = CHAPTERS[_lfState.affaireIdx];
  _lfSetScene(line.sc || (_affaire ? _affaire.sc : 'prologue'));

  // Afficher le personnage
  if (line.ch) {
    _lfSetPersonnage(line.ch.css, line.ch.nm || line.sp, _lfState.affaireIdx, line.sc);
  } else {
    _lfSetPersonnage(null, null);
  }

  zone.innerHTML = `
    <div class="lf-dlg-bubble">
      <div class="lf-dlg-bubble-text">${_lfTxt(line.txt, _lfState.affaireIdx) || ''}</div>
    </div>`;

  const speaker = line.ch ? (line.ch.nm || line.sp) : (line.sp || '');
  _lf$('lf-dlg-speaker').textContent = speaker;

  // Adapter le libellé du bouton selon ce qui vient ensuite
  const nextStep = _lfState.dlgSteps[_lfState.dlgCursor + 1];
  const btnLabel = !nextStep ? 'Terminer →'
    : (nextStep.type === 'vote' || nextStep.type === 'tension') ? 'Situation →'
    : nextStep.type === 'prologue_fin' ? 'Lancer la 1ère affaire →'
    : 'Suivant →';
  _lfSetBtnNext(true, btnLabel);
}

// ── Rendu panneau de vote (décision A/B/C) ───────────────────────
function _lfRendreVote(ch) {
  const zone = _lf$('lf-dlg-zone');
  if (!zone) return;

  // Retirer le personnage
  _lfSetPersonnage(null, null);

  // Le pressureIntro est maintenant affiché dans l'étape 'tension' avant le vote
  zone.innerHTML = `
    <div class="lf-dlg-vote-panel">
      <div class="lf-dlg-vote-title">Décision — ${_lfEsc(ch.name)}</div>
      <div class="lf-choix-list" id="lf-choix-list-dlg"></div>
    </div>`;

  const liste = _lf$('lf-choix-list-dlg');
  const ordreChoix = LiveSession.calculerOrdreChoix(_lfState.affaireIdx, _lfState.votesOuvertDepuis);
  // Stocker l'ordre pour la correction (index affiché → index original)
  _lfState.ordreChoix = ordreChoix;
  ordreChoix.forEach((origIdx, posAffiche) => {
    const c = ch.choices[origIdx];
    const lettre = ['A','B','C'][posAffiche];
    const div = document.createElement('div');
    div.className = 'lf-choix-item';
    div.id = `lf-choix-item-${posAffiche}`;
    div.innerHTML = `
      <div class="lf-choix-lettre ${lettre.toLowerCase()}">${lettre}</div>
      <div class="lf-choix-desc">${_lfTxt(c.desc, _lfState.affaireIdx)}</div>`;
    liste.appendChild(div);
  });

  _lf$('lf-dlg-speaker').textContent = 'Décision à prendre';
  _lfSetBtnNext(false);

  // Réinitialiser les barres de vote
  _lfMettreAJourBarres();

  // Timer affiché mais non démarré
  _lf$('lf-timer-wrap').style.display = '';
  _lfResetTimer();
}

// ── Afficher / masquer le personnage ─────────────────────────────
function _lfSetPersonnage(cssClass, nomTitre, affaireIdx, scKey) {
  const perso = _lf$('lf-personnage');
  if (!perso) return;

  if (!cssClass) {
    perso.style.opacity = '0';
    setTimeout(() => { perso.innerHTML = ''; }, 300);
    return;
  }

  const nomFichier = cssClass.replace('c-', '');
  const imgSrc = `assets/characters/${nomFichier}.png`;

  // Positions depuis POSITIONS_PNJ si disponible
  let right = '5%', height = '80%';
  if (typeof POSITIONS_PNJ !== 'undefined') {
    const scKeyEff = scKey || (CHAPTERS[affaireIdx] && CHAPTERS[affaireIdx].sc) || 'bureau1';
    const pos = POSITIONS_PNJ[scKeyEff] || {};
    right  = pos.right  || '5%';
    height = pos.height || '80%';
  }

  perso.innerHTML = `<img src="${imgSrc}" alt="${_lfEsc(nomTitre || '')}"
    style="height:${height};max-height:100%;object-fit:contain;display:block;">`;
  perso.style.right  = right;
  perso.style.bottom = '0';
  perso.style.opacity = '1';
}

// ── Configurer le bouton Suivant / Ouvrir votes ──────────────────
function _lfSetBtnNext(show, label) {
  const btn = _lf$('lf-btn-dlg-next');
  if (!btn) return;
  btn.style.display = show ? '' : 'none';
  if (label) btn.textContent = label;
}

// ── Clic "Suivant" / override lecture dans la barre de dialogue ──
function lfDlgNext() {
  const nextStep = _lfState.dlgSteps[_lfState.dlgCursor + 1];
  if (!nextStep) return;
  _lfState.lectureAutoActif = false; // override manuel — couper l'auto
  _lfNext();
}

// Clic sur la zone de dialogue (ou la bulle) → avancer
function _lfInitClickZone() {
  const main = _lf$('lf-main');
  if (!main) return;
  main.addEventListener('click', (e) => {
    // Ignorer si on clique sur un bouton ou lien
    if (e.target.closest('button, a, select, input')) return;
    // Avancer seulement en phase dialogue
    const step = _lfState.dlgSteps[_lfState.dlgCursor];
    if (!step || step.type === 'vote') return;
    const nextStep = _lfState.dlgSteps[_lfState.dlgCursor + 1];
    if (!nextStep || nextStep.type === 'vote') {
      // Dernière ligne → rien (le formateur clique sur "Passer au vote")
      return;
    }
    _lfNext();
  });
}

// ── Avancer manuellement d'une affaire dans le parcours ──────────
function lfLancerAffaire() {
  _lfState.parcoursPos = Math.min(_lfState.parcoursPos + 1, _lfState.parcours.length - 1);
  const next = _lfState.parcours[_lfState.parcoursPos] !== undefined
    ? _lfState.parcours[_lfState.parcoursPos]
    : (_lfState.affaireIdx + 1) % CHAPTERS.length;
  _lfInitAffaire(next);
}

// ── C5 : Countdown 10s avant ouverture automatique ───────────────
const COUNTDOWN_DUREE = 10;

function _lfDemarrerCountdown() {
  if (_lfState.countdownInterval) clearInterval(_lfState.countdownInterval);
  let secs = COUNTDOWN_DUREE;
  const el = _lf$('lf-countdown-secs');
  if (el) el.textContent = secs;
  _lfState.countdownInterval = setInterval(() => {
    secs--;
    if (el) el.textContent = Math.max(0, secs);
    if (secs <= 0) {
      clearInterval(_lfState.countdownInterval);
      _lfState.countdownInterval = null;
      lfOuvrirVotesNow();
    }
  }, 1000);
}

function _lfAnnulerCountdown() {
  if (_lfState.countdownInterval) {
    clearInterval(_lfState.countdownInterval);
    _lfState.countdownInterval = null;
  }
}

// ── Ouverture immédiate (depuis "Lancer maintenant" ou countdown) ─
function lfOuvrirVotesNow() {
  _lfAnnulerCountdown();
  _lfState.votesOuvertDepuis = new Date().toISOString();
  // Re-rendre les choix avec le shuffle maintenant que le seed est connu
  const ch = CHAPTERS[_lfState.affaireIdx];
  if (ch) _lfRendreVote(ch);
  _lfSetPhase('votes_ouverts');
  LiveSession.ouvrirVotes(_lfState.sessionId, _lfState.formateurToken, _lfState.votesOuvertDepuis, _lfTimerDecision);
  _lfStartTimer();
  _lfStartPollVotes();
}

// Polling Supabase en fallback si le broadcast n'arrive pas
function _lfStartPollVotes() {
  _lfStopPollVotes();
  _lfState._pollVotesInterval = setInterval(async () => {
    const votes = await LiveSession.lireVotesAffaire(_lfState.sessionId, _lfState.affaireIdx);
    if (!votes || votes.length === 0) return;

    let changed = false;
    for (const v of votes) {
      if (_lfState.joueurVotes[v.joueur_id]) continue; // déjà compté via broadcast
      _lfState.joueurVotes[v.joueur_id] = true;
      const idx = v.choix_index;
      if (idx >= 0 && idx <= 2) {
        _lfState.votesParChoix[idx]++;
        _lfState.votesTotal++;
      }
      if (!_lfState.scoreParJoueur[v.joueur_id]) {
        _lfState.scoreParJoueur[v.joueur_id] = { nom: v.joueur_nom, score: 0 };
      }
      _lfState.scoreParJoueur[v.joueur_id].score += v.score || 0;
      changed = true;
    }

    if (changed) {
      _lfMettreAJourBarres();
      _lfMettreAJourParticipants();

      // Auto-fermeture si tous les participants ont voté
      const nbParticipants = _lfState.participants.length;
      if (nbParticipants > 0 && _lfState.votesTotal >= nbParticipants && !_lfState.autoFermerTimeout) {
        _lfState.autoFermerTimeout = setTimeout(() => {
          _lfState.autoFermerTimeout = null;
          lfFermerVotes();
        }, 1000);
      }
    }
  }, 2000);
}

function _lfStopPollVotes() {
  if (_lfState._pollVotesInterval) {
    clearInterval(_lfState._pollVotesInterval);
    _lfState._pollVotesInterval = null;
  }
}

// ── Ouvrir les votes (alias public pour compatibilité) ────────────
function lfOuvrirVotes() {
  lfOuvrirVotesNow();
}

// ── Fermer les votes → correction directe (C6) ──────────────────
async function lfFermerVotes() {
  _lfAnnulerCountdown();
  _lfStopPollVotes();
  if (_lfState.autoFermerTimeout) { clearTimeout(_lfState.autoFermerTimeout); _lfState.autoFermerTimeout = null; }
  if (_lfState.timerInterval) clearInterval(_lfState.timerInterval);
  _lfState.timerInterval = null;
  _lfSetPhase('votes_fermes');
  await LiveSession.fermerVotes(_lfState.sessionId, _lfState.formateurToken);
  // C6 — passer directement au dépouillement sans écran intermédiaire
  await lfAfficherCorrection();
}

// ── Afficher les résultats (bouton dans barre de contrôle) ───────
async function lfAfficherResultats() {
  _lfSetPhase('resultats');
  const ch = CHAPTERS[_lfState.affaireIdx];
  const indexCorrect = ch.choices.findIndex(c => c.type === 'good');
  _lfEcranResultats(indexCorrect);
}

function _lfEcranResultats(indexCorrect) {
  const ch = CHAPTERS[_lfState.affaireIdx];
  _lf$('lf-res-affaire-name').textContent = ch.name;

  // ordreChoix[posAffiche] = origIdx → pour chaque position affichée (A/B/C)
  const ordre = _lfState.ordreChoix || [0, 1, 2];
  ['a','b','c'].forEach((l, posAffiche) => {
    const origIdx = ordre[posAffiche];
    const nb  = _lfState.votesParChoix[origIdx] || 0;
    const pct = _lfState.votesTotal > 0 ? Math.round(nb / _lfState.votesTotal * 100) : 0;
    _lf$(`lf-res-bar-${l}`).style.width = pct + '%';
    _lf$(`lf-res-info-${l}`).textContent = `${nb} / ${pct}%`;
    const estCorrect = origIdx === indexCorrect;
    const item = document.querySelector(`#lf-res-bars .lf-vote-bar-row:nth-child(${posAffiche+1})`);
    if (item) {
      item.style.background = estCorrect ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.05)';
    }
    const lettre = _lf$(`lf-res-lettre-${l}`);
    if (lettre) {
      lettre.style.background = estCorrect ? 'var(--lv-correct)' : 'var(--lv-incorrect)';
    }
  });

  _lfRendrePodium();
  _lfScreen('lf-resultats');
}

// ── Retour au game depuis résultats (conservé pour compatibilité) ──
function lfRetourGame() {
  _lfScreen('lf-game');
  _lfSetPhase('affaire_active');
}

// ── Fermeture des votes → correction directe (C6) ───────────────
// Remplace l'ancien flow: votes_fermes → bouton → lf-resultats → bouton → correction
async function lfAffaireSuivante() {
  await lfAfficherCorrection();
}

// ── Correction après affaire — Step 1 : Dépouillement ────────────
async function lfAfficherCorrection() {
  const ch           = CHAPTERS[_lfState.affaireIdx];
  const indexCorrect = ch.choices.findIndex(c => c.type === 'good');

  // Enregistrer l'affaire jouée (une seule fois)
  const ordreChoix = _lfState.ordreChoix || [0, 1, 2];
  // Éviter le double-enregistrement si déjà enregistré pour cette affaire
  const dejEnr = _lfState.affairesJouees.some(a => a.affaireIdx === _lfState.affaireIdx);
  if (!dejEnr) {
    _lfState.affairesJouees.push({
      affaireIdx: _lfState.affaireIdx,
      votes: [..._lfState.votesParChoix],
      total: _lfState.votesTotal,
      indexCorrect,
      ordreChoix: [...ordreChoix],
    });
  }

  // Notifier les joueurs (phase correction → écran résultat perso pour eux)
  await LiveSession.afficherResultats(_lfState.sessionId, _lfState.formateurToken);

  // Nom de l'affaire
  _lf$('lf-corr-affaire-name').textContent = ch.name;

  // Step 1 — Barres résultats avec mise en couleur correct/incorrect
  const ordre = ordreChoix;
  ['a','b','c'].forEach((l, posAffiche) => {
    const origIdx  = ordre[posAffiche];
    const nb  = _lfState.votesParChoix[origIdx] || 0;
    const pct = _lfState.votesTotal > 0 ? Math.round(nb / _lfState.votesTotal * 100) : 0;
    _lf$(`lf-corr-bar-${l}`).style.width = pct + '%';
    _lf$(`lf-corr-info-${l}`).textContent = `${nb} / ${pct}%`;
    const estCorrect = origIdx === indexCorrect;
    const lettre = _lf$(`lf-corr-lettre-${l}`);
    if (lettre) lettre.style.background = estCorrect ? 'var(--lv-correct)' : 'var(--lv-incorrect)';
    const row = document.querySelector(`#lf-corr-bars .lf-vote-bar-row:nth-child(${posAffiche+1})`);
    if (row) row.style.background = estCorrect ? 'rgba(34,197,94,.1)' : 'rgba(239,68,68,.05)';
  });

  // Bandeau bonne réponse (lettre affichée)
  const posCorrectAff = ordreChoix.indexOf(indexCorrect);
  const lettreCorrecte = ['A','B','C'][posCorrectAff >= 0 ? posCorrectAff : indexCorrect];
  const bonneRepEl = _lf$('lf-corr-bonne-reponse');
  if (bonneRepEl) bonneRepEl.textContent = `✅ Bonne réponse : Option ${lettreCorrecte}`;

  // Step 2 — Fiche recap (pré-remplie mais masquée)
  const bonChoice = ch.choices[indexCorrect];
  const gestures  = (ch.recap && ch.recap.gestures) ? ch.recap.gestures : [];
  const recap = _lf$('lf-correction-recap');
  if (recap) {
    recap.innerHTML = `
      <div class="lf-corr-verdict good">
        <div class="lf-corr-verdict-badge">✅ Bonne réponse — Option ${lettreCorrecte}</div>
        <div class="lf-corr-verdict-title">${_lfEsc(bonChoice.vTitle || '')}</div>
        <div class="lf-corr-verdict-text">${bonChoice.vConsequence || ''}</div>
      </div>
      <div class="lf-corr-legal">${bonChoice.vLegal || ''}</div>
      ${gestures.length > 0 ? `
      <div class="lf-corr-gestures">
        <div class="lf-corr-gestures-title">Les bons réflexes</div>
        <ul>${gestures.map(g => `<li>${_lfEsc(g)}</li>`).join('')}</ul>
      </div>` : ''}`;
  }

  // Afficher step 1, masquer step 2, configurer bouton
  _lf$('lf-corr-step1').style.display = '';
  _lf$('lf-corr-step2').style.display = 'none';
  _lf$('lf-corr-eyebrow').textContent  = 'Étape 1 / 3 — Dépouillement';
  const btn = _lf$('lf-corr-btn-next');
  if (btn) { btn.textContent = 'Explication →'; btn.onclick = lfCorrectionNext; }

  _lfScreen('lf-correction');
}

// ── Navigation dans la correction (C6) ───────────────────────────
function lfCorrectionNext() {
  const step1 = _lf$('lf-corr-step1');
  const step2 = _lf$('lf-corr-step2');
  const eyebrow = _lf$('lf-corr-eyebrow');
  const btn = _lf$('lf-corr-btn-next');

  if (step1 && step1.style.display !== 'none') {
    // Step 1 → Step 2 : Explication
    step1.style.display = 'none';
    step2.style.display = '';
    if (eyebrow) eyebrow.textContent = 'Étape 2 / 3 — Explication';
    if (btn) { btn.textContent = 'Classement →'; btn.onclick = lfCorrectionSuivant; }
  }
}

// ── Depuis correction step 2 → podium intermédiaire ─────────────
async function lfCorrectionSuivant() {
  await lfAfficherPodiumInter();
}

// ── Podium intermédiaire ─────────────────────────────────────────
async function lfAfficherPodiumInter() {
  // Notifier les joueurs (phase podium)
  await LiveSession.afficherPodium(_lfState.sessionId, _lfState.formateurToken);

  const ch     = CHAPTERS[_lfState.affaireIdx];
  const affNum = _lfState.affaireIdx + 1;

  // Titre
  const titre = _lf$('lf-pod-title');
  if (titre) titre.textContent = `Étape 3 / 3 — Classement après l'affaire ${affNum}`;

  // Récupérer le classement cumulatif
  const classement = await LiveSession.calculerClassement(_lfState.sessionId);

  // Remplir podium top 3
  const places = [null, 1, 2, 3]; // index 1, 2, 3
  for (let pos = 1; pos <= 3; pos++) {
    const j = classement[pos - 1];
    const nomEl   = _lf$(`lf-pod-nom-${pos}`);
    const scoreEl = _lf$(`lf-pod-score-${pos}`);
    if (nomEl)   nomEl.textContent   = j ? j.nom : '—';
    if (scoreEl) scoreEl.textContent = j ? j.scoreTotal + ' pts' : '';
  }

  // Liste 4e et au-delà
  const liste = _lf$('lf-pod-liste');
  if (liste) {
    liste.innerHTML = classement.slice(3).map((j, i) => `
      <div class="lf-pod-liste-row">
        <span class="lf-pod-liste-rank">#${i + 4}</span>
        <span class="lf-pod-liste-nom">${_lfEsc(j.nom)}</span>
        <span class="lf-pod-liste-score">${j.scoreTotal} pts</span>
      </div>`).join('');
  }

  // Stats affaire
  const derniere = _lfState.affairesJouees[_lfState.affairesJouees.length - 1];
  const stats = _lf$('lf-pod-stats');
  if (stats && derniere) {
    const total   = derniere.total || 0;
    const bons    = total > 0 ? Math.round((derniere.votes[derniere.indexCorrect] || 0) / total * 100) : 0;
    const lettres = ['A', 'B', 'C'];
    const ordre   = derniere.ordreChoix || [0, 1, 2];
    // Pire = index original le plus voté parmi les mauvais
    const pireOrig = derniere.votes.reduce((iMax, v, i, arr) =>
      i !== derniere.indexCorrect && v > arr[iMax] ? i : iMax, (derniere.indexCorrect === 0 ? 1 : 0));
    // Convertir en position affichée
    const pireAff = ordre.indexOf(pireOrig);
    stats.innerHTML = `
      <div class="lf-pod-stat">✅ ${bons}% de bonnes réponses sur cette affaire</div>
      ${total > 0 && bons < 100 ? `<div class="lf-pod-stat">❌ Réponse la plus choisie (erronée) : Option ${lettres[pireAff >= 0 ? pireAff : pireOrig]}</div>` : ''}`;
  }

  // Afficher l'écran
  _lfScreen('lf-podium-inter');

  // Animer podium avec délais
  _lfAnimerPodium();

  // Fanfare Web Audio
  setTimeout(() => _lfFanfare(), 1000);

  // Confetti canvas
  setTimeout(() => _lfConfettiPodium(), 900);
}

function _lfAnimerPodium() {
  // Réinitialise l'animation en retirant/rajoutant la classe
  [1, 2, 3].forEach(pos => {
    const el = _lf$(`lf-pod-p${pos}`);
    if (!el) return;
    el.classList.remove('pod-visible');
  });
  const liste = _lf$('lf-pod-liste');
  const stats = _lf$('lf-pod-stats');
  if (liste) liste.classList.remove('pod-visible');
  if (stats) stats.classList.remove('pod-visible');

  // Séquence : titre (0) → 3 (0.3s) → 2 (0.5s) → 1 (0.9s) → liste (1.2s) → stats (1.5s)
  setTimeout(() => { const el = _lf$('lf-pod-p3'); if (el) el.classList.add('pod-visible'); }, 300);
  setTimeout(() => { const el = _lf$('lf-pod-p2'); if (el) el.classList.add('pod-visible'); }, 600);
  setTimeout(() => { const el = _lf$('lf-pod-p1'); if (el) el.classList.add('pod-visible'); }, 1000);
  setTimeout(() => { if (liste) liste.classList.add('pod-visible'); }, 1300);
  setTimeout(() => { if (stats) stats.classList.add('pod-visible'); }, 1600);
}

function _lfFanfare() {
  if (!_lfSonActif) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [523.25, 659.25, 783.99, 1046.5]; // Do-Mi-Sol-Do (octave sup)
    notes.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.18;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.28, t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      osc.start(t);
      osc.stop(t + 0.4);
    });
    setTimeout(() => ctx.close(), 2000);
  } catch(e) {}
}

function _lfConfettiPodium() {
  const canvas = _lf$('lf-pod-canvas');
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const couleurs = ['#d4af37','#1b2a4a','#22c55e','#f97316','#60a0f8','#ffffff'];
  const pieces = Array.from({ length: 90 }, () => ({
    x:    Math.random() * canvas.width,
    y:    -20 - Math.random() * canvas.height * 0.5,
    vx:   (Math.random() - 0.5) * 3,
    vy:   2 + Math.random() * 3,
    rot:  Math.random() * Math.PI * 2,
    vrot: (Math.random() - 0.5) * 0.15,
    w:    6 + Math.random() * 8,
    h:    10 + Math.random() * 6,
    col:  couleurs[Math.floor(Math.random() * couleurs.length)],
  }));
  let frame = 0;
  const MAX = 180;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x   += p.vx;
      p.y   += p.vy;
      p.rot += p.vrot;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.col;
      ctx.globalAlpha = Math.max(0, 1 - frame / MAX);
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    frame++;
    if (frame < MAX) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

// ── Depuis le podium → affaire suivante ou quiz final ─────────────
function lfPodiumSuivant() {
  _lfState.parcoursPos++;
  if (_lfState.parcoursPos >= _lfState.parcours.length) {
    // Fin du parcours → lancer le quiz
    lfLancerQuiz();
  } else {
    const next = _lfState.parcours[_lfState.parcoursPos];
    _lfScreen('lf-game');
    _lfInitAffaire(next);
  }
}

// ── Terminer la session ──────────────────────────────────────────
function lfTerminerConfirm() {
  if (confirm('Terminer la session et afficher le classement final ?')) {
    lfTerminer();
  }
}

async function lfTerminer() {
  if (_lfState.timerInterval) clearInterval(_lfState.timerInterval);
  await LiveSession.terminerSession(_lfState.sessionId, _lfState.formateurToken);
  LiveSession.seDesabonner();
  // Afficher d'abord le debrief pédagogique, puis l'écran de fin
  await _lfEcranDebrief();
}

// ── Écran de debrief pédagogique ──────────────────────────────
async function _lfEcranDebrief() {
  _lfScreen('lf-debrief');

  const debrief = await LiveSession.calculerDebrief(_lfState.sessionId);

  // --- Top 3 affaires échouées ---
  const elAffaires = _lf$('lf-db-affaires-ratees');
  if (elAffaires) {
    if (!debrief || debrief.affairesRatees.length === 0) {
      elAffaires.innerHTML = '<div class="lf-db-empty">Aucune donnée disponible.</div>';
    } else {
      elAffaires.innerHTML = debrief.affairesRatees.map((a, i) => {
        const ch = CHAPTERS[a.affaireIdx];
        const cl = a.pctEchec >= 60 ? 'bad' : a.pctEchec >= 35 ? 'mid' : 'good';
        return `
          <div class="lf-db-affaire-row">
            <div class="lf-db-rank">${i + 1}</div>
            <div class="lf-db-affaire-info">
              <div class="lf-db-affaire-name">${_lfEsc(ch ? ch.name : 'Affaire ' + (a.affaireIdx+1))}</div>
              <div class="lf-db-affaire-num">${ch ? ch.num : ''}</div>
            </div>
            <div class="lf-db-pct ${cl}">${a.pctEchec}% d'échec</div>
          </div>`;
      }).join('');
    }
  }

  // --- Réflexes à renforcer (gestures des affaires les plus échouées) ---
  const elReflexes = _lf$('lf-db-reflexes');
  if (elReflexes) {
    if (!debrief || debrief.affairesRatees.length === 0) {
      elReflexes.innerHTML = '<div class="lf-db-empty">Aucune donnée disponible.</div>';
    } else {
      const reflexes = [];
      for (const a of debrief.affairesRatees) {
        const ch = CHAPTERS[a.affaireIdx];
        if (ch && ch.recap && ch.recap.gestures && ch.recap.gestures.length > 0) {
          reflexes.push({ affaire: ch.num, gesture: ch.recap.gestures[0], pct: a.pctEchec });
        }
      }
      if (reflexes.length === 0) {
        elReflexes.innerHTML = '<div class="lf-db-empty">Récapitulatifs non disponibles.</div>';
      } else {
        elReflexes.innerHTML = reflexes.map(r => `
          <div class="lf-db-reflexe-row">
            <div class="lf-db-reflexe-affaire">${_lfEsc(r.affaire)}</div>
            <div class="lf-db-reflexe-text">${_lfEsc(r.gesture)}</div>
          </div>`).join('');
      }
    }
  }

  // --- Camembert profils éthiques ---
  _lfRendreCamembert(debrief ? debrief.profils : null, debrief ? debrief.nbJoueurs : 0);
}

function _lfRendreCamembert(profils, nbJoueurs) {
  const svg  = _lf$('lf-db-pie');
  const leg  = _lf$('lf-db-pie-legend');
  if (!svg || !leg) return;

  const defaut = { exemplaire: 0, pragmatique: 0, risque: 0 };
  const p = profils || defaut;
  const total = p.exemplaire + p.pragmatique + p.risque;

  const COULEURS = {
    exemplaire:  '#10b981',  // vert
    pragmatique: '#d4af37',  // or
    risque:      '#ef4444',  // rouge
  };
  const LABELS = {
    exemplaire:  'Exemplaire (≥75%)',
    pragmatique: 'Pragmatique (45-74%)',
    risque:      'A risque (<45%)',
  };

  if (total === 0) {
    svg.innerHTML = `<text x="90" y="95" text-anchor="middle" fill="rgba(255,255,255,.35)" font-size="13">Aucun vote</text>`;
    leg.innerHTML = '';
    return;
  }

  // Dessiner les arcs
  const cx = 90, cy = 90, r = 78;
  let angleDebut = -Math.PI / 2; // partir du haut

  const segments = ['exemplaire', 'pragmatique', 'risque'].map(k => ({
    key: k, val: p[k],
    pct: total > 0 ? Math.round(p[k] / total * 100) : 0,
  })).filter(s => s.val > 0);

  let paths = '';
  for (const seg of segments) {
    const angle = (seg.val / total) * 2 * Math.PI;
    const angleFin = angleDebut + angle;
    const grand = angle > Math.PI ? 1 : 0;
    const x1 = cx + r * Math.cos(angleDebut);
    const y1 = cy + r * Math.sin(angleDebut);
    const x2 = cx + r * Math.cos(angleFin);
    const y2 = cy + r * Math.sin(angleFin);
    paths += `<path d="M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${grand} 1 ${x2.toFixed(1)},${y2.toFixed(1)} Z"
      fill="${COULEURS[seg.key]}" opacity="0.88"/>`;
    angleDebut = angleFin;
  }

  // Cercle intérieur (donut)
  paths += `<circle cx="${cx}" cy="${cy}" r="36" fill="#0d1423"/>`;
  paths += `<text x="${cx}" y="${cy - 6}" text-anchor="middle" fill="rgba(255,255,255,.9)" font-size="22" font-weight="800">${nbJoueurs}</text>`;
  paths += `<text x="${cx}" y="${cy + 14}" text-anchor="middle" fill="rgba(255,255,255,.4)" font-size="11">joueurs</text>`;

  svg.innerHTML = paths;

  leg.innerHTML = segments.map(s => `
    <div class="lf-db-pie-leg-row">
      <div class="lf-db-pie-dot" style="background:${COULEURS[s.key]}"></div>
      <div class="lf-db-pie-leg-label">${LABELS[s.key]}</div>
      <div class="lf-db-pie-leg-val">${s.val} (${s.pct}%)</div>
    </div>`).join('');
}

// ── Écran de fin (C7) ────────────────────────────────────────────
async function _lfEcranFin() {
  _lfScreen('lf-fin');

  const classement = await LiveSession.calculerClassement(_lfState.sessionId);
  const nbParticipants = classement.length;
  const nbAffaires = _lfState.affairesJouees.length;

  let totalCorrects = 0, totalVotes = 0, tempsTotalMs = 0;
  classement.forEach(j => {
    totalCorrects += j.nbCorrects;
    totalVotes    += j.nbVotes;
    tempsTotalMs  += j.tempsMoyenMs;
  });
  const tauxGlobal = totalVotes > 0 ? Math.round(totalCorrects / totalVotes * 100) : 0;
  const tempsMoyen = nbParticipants > 0 ? Math.round(tempsTotalMs / nbParticipants / 1000) : 0;

  // Stats
  const stats = [
    { val: nbParticipants,   lbl: 'Participants' },
    { val: nbAffaires,       lbl: 'Affaires jouées' },
    { val: tauxGlobal + '%', lbl: 'Taux de bonnes réponses' },
    { val: tempsMoyen + 's', lbl: 'Temps moyen' },
  ];
  _lf$('lf-stats-grid').innerHTML = stats.map(s =>
    `<div class="lf-stat-card"><div class="lf-stat-val">${s.val}</div><div class="lf-stat-lbl">${s.lbl}</div></div>`
  ).join('');

  // Top 3 compact
  const medals = ['🥇','🥈','🥉'];
  const top3El = _lf$('lf-fin-top3');
  if (top3El) {
    top3El.innerHTML = classement.slice(0, 3).map((j, i) => `
      <div class="lf-fin-top3-item lf-fin-top3-p${i+1}">
        <div class="lf-fin-medal">${medals[i]}</div>
        <div class="lf-fin-nom">${_lfEsc(j.nom)}</div>
        <div class="lf-fin-score">${j.scoreTotal} pts</div>
      </div>`).join('');
  }

  // Classement complet (scrollable)
  const cls = _lf$('lf-classement');
  cls.innerHTML = classement.map((j, i) => `
    <div class="lf-classement-row ${i < 3 ? 'top3' : ''}">
      <div class="lf-classement-rank">${medals[i] || (i+1)}</div>
      <div class="lf-classement-nom">${_lfEsc(j.nom)}</div>
      <div class="lf-classement-correct">${j.nbCorrects}/${j.nbVotes} correctes</div>
      <div class="lf-classement-score">${j.scoreTotal} pts</div>
    </div>`).join('');

  const affSt = _lf$('lf-affaires-stats');
  affSt.innerHTML = _lfState.affairesJouees.map(a => {
    const pct = a.total > 0 ? Math.round(a.votes[a.indexCorrect] / a.total * 100) : 0;
    const cl = pct >= 70 ? 'good' : pct >= 40 ? 'mid' : 'bad';
    const ch = CHAPTERS[a.affaireIdx];
    return `
      <div class="lf-affaire-stat-row">
        <div class="lf-affaire-stat-num">${ch.num}</div>
        <div class="lf-affaire-stat-name">${_lfEsc(ch.name)}</div>
        <div class="lf-affaire-stat-pct ${cl}">${pct}% corrects</div>
      </div>`;
  }).join('');

  // Confetti sur canvas fixe
  setTimeout(() => _lfConfettiFin(), 400);
}

// ── Confetti écran de fin (canvas fixe overlay) ──────────────────
function _lfConfettiFin() {
  const canvas = _lf$('lf-fin-canvas');
  if (!canvas) return;
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  const couleurs = ['#fbbf24','#d4af37','#22c55e','#60a0f8','#d888f8','#f472b6','#fff'];
  const particules = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: -10 - Math.random() * 200,
    r: 4 + Math.random() * 5,
    c: couleurs[Math.floor(Math.random() * couleurs.length)],
    vx: (Math.random() - .5) * 2,
    vy: 2 + Math.random() * 3,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - .5) * .15,
  }));
  let frame = 0;
  const MAX = 180;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particules.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.angle += p.spin;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = Math.max(0, 1 - frame / MAX);
      ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      ctx.restore();
    });
    frame++;
    if (frame < MAX) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

// ── Gestion du timer ─────────────────────────────────────────────
function _lfResetTimer() {
  _lfState.timerSecondes = _lfTimerDecision;
  _lfUpdateTimer(_lfTimerDecision);
}

function _lfStartTimer() {
  _lfState.timerSecondes = _lfTimerDecision;
  _lfUpdateTimer(_lfTimerDecision);
  if (_lfTimerDecision === 0) return; // mode sans limite — pas de décompte automatique
  _lfState.timerInterval = setInterval(() => {
    _lfState.timerSecondes--;
    _lfUpdateTimer(_lfState.timerSecondes);
    if (_lfState.timerSecondes <= 0) {
      clearInterval(_lfState.timerInterval);
      _lfState.timerInterval = null;
      lfFermerVotes();
    }
  }, 1000);
}

function _lfUpdateTimer(secs) {
  const arc  = _lf$('lf-timer-arc');
  const txt  = _lf$('lf-timer-text');
  if (!arc || !txt) return;
  const total = 2 * Math.PI * 30;
  // En mode sans limite (0) : arc plein, texte ∞
  const duree = _lfTimerDecision > 0 ? _lfTimerDecision : 1;
  const offset = _lfTimerDecision === 0 ? 0 : total * (1 - secs / duree);
  arc.setAttribute('stroke-dashoffset', offset.toFixed(2));
  txt.textContent = _lfTimerDecision === 0 ? '∞' : Math.max(0, secs);
  const urgent = _lfTimerDecision > 0 && secs <= 10;
  arc.classList.toggle('urgent', urgent);
  txt.classList.toggle('urgent', urgent);
}

// ── Nouveau vote reçu (Canal B) ──────────────────────────────────
function _lfOnNouveauVote(vote) {
  console.log('[Formateur] vote reçu:', vote);
  // Réflexe pro : mettre à jour le compteur de réponses
  if (vote.phase === 'reflexe') {
    if (!_lfState.joueurVotes['r_' + vote.joueur_id]) {
      _lfState.joueurVotes['r_' + vote.joueur_id] = true;
      const nb = Object.keys(_lfState.joueurVotes).filter(k => k.startsWith('r_')).length;
      const el = _lf$('lf-reflexe-count');
      if (el) el.textContent = `${nb} / ${_lfState.participants.length}`;

      // Auto-fermeture réflexe quand tous les participants ont répondu
      const nbP = _lfState.participants.length;
      if (nbP > 0 && nb >= nbP && !_lfState.autoFermerTimeout) {
        _lfState.autoFermerTimeout = setTimeout(() => {
          _lfState.autoFermerTimeout = null;
          lfFermerReflexe();
        }, 1000);
      }
    }
    return;
  }

  const idx = vote.choix_index;
  if (idx >= 0 && idx <= 2) {
    if (!_lfState.joueurVotes[vote.joueur_id]) {
      _lfState.joueurVotes[vote.joueur_id] = true;
      _lfState.votesParChoix[idx]++;
      _lfState.votesTotal++;
    }
  }
  if (!_lfState.scoreParJoueur[vote.joueur_id]) {
    _lfState.scoreParJoueur[vote.joueur_id] = { nom: vote.joueur_nom, score: 0 };
  }
  _lfState.scoreParJoueur[vote.joueur_id].score += vote.score;

  _lfMettreAJourBarres();
  _lfMettreAJourParticipants();

  // C4 — Auto-fermeture quand tous les participants ont voté
  const nbParticipants = _lfState.participants.length;
  if (nbParticipants > 0 && _lfState.votesTotal >= nbParticipants && !_lfState.autoFermerTimeout) {
    _lfState.autoFermerTimeout = setTimeout(() => {
      _lfState.autoFermerTimeout = null;
      lfFermerVotes();
    }, 1000);
  }
}

// ── Mettre à jour les barres A/B/C ─────────────────────────────
function _lfMettreAJourBarres() {
  const total    = _lfState.votesTotal;
  const ordre    = _lfState.ordreChoix || [0, 1, 2];
  ['a','b','c'].forEach((l, posAffiche) => {
    const origIdx = ordre[posAffiche];       // index réel du choix affiché à cette position
    const nb  = _lfState.votesParChoix[origIdx] || 0;
    const pct = total > 0 ? Math.round(nb / total * 100) : 0;
    const bar = _lf$(`lf-bar-${l}`);
    const inf = _lf$(`lf-info-${l}`);
    if (bar) bar.style.width = pct + '%';
    if (inf) inf.textContent = `${nb} / ${pct}%`;
  });
  // Compteur en direct (grand chiffre)
  const bigNum = _lf$('lf-vote-big-number');
  if (bigNum) bigNum.textContent = total;
  const label = _lf$('lf-vote-count-label');
  if (label) label.textContent = `(${total} vote${total > 1 ? 's' : ''})`;
  // Barre de progression participants
  const nb   = _lfState.participants.length;
  const bar  = _lf$('lf-vote-participants-bar');
  if (bar && nb > 0) {
    const pct = Math.round(total / nb * 100);
    bar.style.background = `linear-gradient(90deg, var(--lv-gold) ${pct}%, rgba(255,255,255,.08) ${pct}%)`;
    bar.title = `${total} / ${nb} participants ont voté`;
  }
}

// ── Mettre à jour la liste des participants ─────────────────────
function _lfMettreAJourParticipants() {
  const chips = _lf$('lf-participants-chips');
  if (chips) {
    chips.innerHTML = _lfState.participants.length === 0
      ? '<span style="font-size:13px;color:var(--lv-text3)">Aucun participant pour l\'instant…</span>'
      : _lfState.participants.map(p =>
          `<div class="lf-participant-chip">${_lfEsc(p.nom || p.name || '?')}</div>`
        ).join('');
  }
  const list = _lf$('lf-participants-list');
  if (!list) return;
  const totalAffaires = (_lfState.parcours || []).length || 10;
  const affairesJoueesN = (_lfState.affairesJouees || []).length;
  list.innerHTML = _lfState.participants.map(p => {
    const aVote = !!_lfState.joueurVotes[p.joueurId || p.joueur_id];
    const score = _lfState.scoreParJoueur[p.joueurId || p.joueur_id];
    // Barre de progression session : affaires jouées / total parcours
    const progPct = totalAffaires > 0 ? Math.round((affairesJoueesN / totalAffaires) * 100) : 0;
    const barFilled = Math.round(progPct / 10);
    const barStr = '='.repeat(barFilled) + '-'.repeat(10 - barFilled);
    const progHtml = `<span class="lf-participant-prog" title="${affairesJoueesN}/${totalAffaires} affaires">${affairesJoueesN}/${totalAffaires} [${barStr}]</span>`;
    // ✓ = a voté (neutre — pas d'indication bon/mauvais avant révélation)
    return `
      <div class="lf-participant-row ${aVote ? 'voted' : ''}">
        <span class="lf-participant-status">${aVote ? '✓' : '⏳'}</span>
        <span class="lf-participant-nom">${_lfEsc(p.nom || p.name || '?')}</span>
        ${progHtml}
        ${score ? `<span class="lf-participant-score">${score.score} pts</span>` : ''}
      </div>`;
  }).join('') || '<div style="color:rgba(255,255,255,.3);font-size:13px;padding:8px 10px;">Aucun participant connecté</div>';
}

// ── Podium ───────────────────────────────────────────────────────
function _lfRendrePodium() {
  const joueurs = Object.entries(_lfState.scoreParJoueur)
    .map(([id, d]) => ({ id, ...d }))
    .sort((a, b) => b.score - a.score);

  const medailles = ['🥇','🥈','🥉'];
  const podiumEl = _lf$('lf-podium');
  if (podiumEl) {
    const top3 = joueurs.slice(0, 3);
    const ordre = [top3[1], top3[0], top3[2]].filter(Boolean);
    const oClasses = top3[1] ? ['p2','p1','p3'] : ['p1'];
    podiumEl.innerHTML = ordre.map((j, vi) => `
      <div class="lf-podium-item ${oClasses[vi]}">
        <div class="lf-podium-medal">${medailles[vi === 1 ? 0 : vi === 0 ? 1 : 2]}</div>
        <div class="lf-podium-nom">${_lfEsc(j.nom)}</div>
        <div class="lf-podium-score">${j.score} pts</div>
        <div class="lf-podium-base"></div>
      </div>`).join('');
  }

  const top5El = _lf$('lf-top5');
  if (top5El) {
    top5El.innerHTML = joueurs.slice(0, 5).map((j, i) => `
      <div class="lf-top5-row">
        <div class="lf-top5-rank">${medailles[i] || (i+1)}</div>
        <div class="lf-top5-nom">${_lfEsc(j.nom)}</div>
        <div class="lf-top5-score">${j.score} pts</div>
      </div>`).join('');
  }
}

// ── Gestion de l'affichage des boutons selon la phase ───────────
function _lfSetPhase(phase) {
  const labels = {
    dialogue:          'Dialogue',
    reflexe_attente:   'Réflexe Pro — En attente',
    reflexe_resultats: 'Réflexe Pro — Résultats',
    affaire_active:    'Vote — Décision',
    votes_ouverts:     'Votes ouverts',
    votes_fermes:      'Votes clos',
    resultats:         'Résultats',
    fin:               'Terminée',
  };
  const tag = _lf$('lf-phase-tag');
  if (tag) tag.textContent = labels[phase] || phase;

  // Affichage du panneau de votes (côté droit) seulement pendant les votes décision
  const rightPanel = _lf$('lf-right');
  if (rightPanel) {
    const showRight = ['affaire_active','votes_ouverts','votes_fermes','resultats'].includes(phase);
    rightPanel.style.display = showRight ? '' : 'none';
  }

  // Pendant le vote : grand compteur, pas les barres A/B/C
  // Après fermeture : barres A/B/C, pas le compteur
  const liveCount = _lf$('lf-vote-live-count');
  const barsWrap  = _lf$('lf-vote-bars');
  if (liveCount) liveCount.style.display = phase === 'votes_ouverts' ? '' : 'none';
  if (barsWrap)  barsWrap.style.display  = ['votes_fermes','resultats'].includes(phase) ? '' : 'none';

  // Timer seulement pendant vote décision
  const timerWrap = _lf$('lf-timer-wrap');
  if (timerWrap) timerWrap.style.display = ['affaire_active','votes_ouverts'].includes(phase) ? '' : 'none';

  // Sélecteur de durée : visible seulement en phase pré-vote (affaire_active)
  const timerSelectRow = _lf$('lf-timer-select-row');
  if (timerSelectRow) timerSelectRow.style.display = phase === 'affaire_active' ? '' : 'none';

  const btns = {
    'lf-btn-dlg-next':           phase === 'dialogue',
    'lf-btn-fermer-reflexe':     phase === 'reflexe_attente',
    'lf-btn-passer-au-vote':     phase === 'reflexe_resultats',
    'lf-btn-ouvrir':             phase === 'affaire_active',
    'lf-btn-lancer-now':         phase === 'affaire_active',
    'lf-btn-fermer':             phase === 'votes_ouverts',
    'lf-btn-resultats':          false,
    'lf-btn-suivant':            false,
    'lf-btn-terminer':           ['affaire_active','votes_ouverts','votes_fermes','resultats','reflexe_attente','reflexe_resultats'].includes(phase),
  };
  Object.entries(btns).forEach(([id, visible]) => {
    const btn = _lf$(id);
    if (btn) btn.style.display = visible ? '' : 'none';
  });
}

// ── Fermer le réflexe → afficher le débriefing formateur ────────
function lfFermerReflexe() {
  LiveSession.fermerReflexe(_lfState.sessionId, _lfState.formateurToken);
  _lfSetPhase('reflexe_resultats');
  _lfRendreDebriefiingReflexe();
}

// Rendu du récapitulatif Réflexe Pro (phase débriefing formateur)
function _lfRendreDebriefiingReflexe() {
  const idx = _lfState.affaireIdx;
  const rd  = (typeof REFLEXE_DATA !== 'undefined') ? REFLEXE_DATA[idx] : null;
  const zone = _lf$('lf-dlg-zone');
  if (!zone || !rd) { _lfPasserAuVote(); return; }

  const ch = CHAPTERS[idx];

  // Extraire les bonnes questions et actions (combo 'good')
  const goodQ = (rd.combos?.questions?.good || '').split(',').map(Number).filter(n => !isNaN(n));
  const goodA = (rd.combos?.actions?.good   || '').split(',').map(Number).filter(n => !isNaN(n));

  const qHtml = (rd.questions || []).map((q, i) => {
    const isBon = goodQ.includes(i);
    return `<div class="lf-reflexe-item lf-reflexe-item--${isBon ? 'good' : 'neutral'}">
      <span class="lf-reflexe-num">${isBon ? '✓' : '·'} Q${i+1}</span>${_lfEsc(q.txt)}
    </div>`;
  }).join('');

  const aHtml = (rd.actions || []).map((a, i) => {
    const isBon = goodA.includes(i);
    return `<div class="lf-reflexe-item lf-reflexe-item--${isBon ? 'good' : 'neutral'}">
      <span class="lf-reflexe-num">${isBon ? '✓' : '·'} A${i+1}</span>${_lfEsc(a.txt)}
    </div>`;
  }).join('');

  const verdict = rd.analysereflexe?.verdictRapide?.good
    ? `<div class="lf-reflexe-verdict">${_lfEsc(rd.analysereflexe.verdictRapide.good)}</div>`
    : '';

  zone.innerHTML = `
    <div class="lf-reflexe-panel lf-reflexe-panel--debrief">
      <div class="lf-reflexe-header">
        <div class="lf-reflexe-eyebrow">Débriefing — Réflexe Professionnel</div>
        <div class="lf-reflexe-title">${_lfEsc(ch.name)}</div>
        <div class="lf-reflexe-sub">Prenez le temps de discuter des bonnes réponses avec le groupe</div>
      </div>
      ${verdict}
      <div class="lf-reflexe-cols">
        <div class="lf-reflexe-col">
          <div class="lf-reflexe-col-title">Questions — bonnes réponses (✓)</div>
          ${qHtml}
        </div>
        <div class="lf-reflexe-col">
          <div class="lf-reflexe-col-title">Actions — bonnes réponses (✓)</div>
          ${aHtml}
        </div>
      </div>
    </div>`;

  _lf$('lf-dlg-speaker').textContent = 'Débriefing Réflexe';
}

// Passer au vote depuis le débriefing réflexe
function lfPasserAuVote() {
  _lfNext(); // → tension ou vote
}

function _lfEsc(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ── Voir classement final (live-resultats.html) ───────────────
function lfVoirClassementFinal() {
  if (_lfState.sessionId) {
    window.location.href = 'live-resultats.html?session=' + _lfState.sessionId;
  }
}

// ═══════════════════════════════════════════════════════════════
// PLEIN ÉCRAN
// ═══════════════════════════════════════════════════════════════
function lfToggleFullscreen() {
  const btn = _lf$('lf-btn-fs');
  if (document.fullscreenElement) {
    document.exitFullscreen();
    if (btn) { btn.textContent = '⛶ Plein écran'; btn.classList.remove('active'); }
  } else {
    document.documentElement.requestFullscreen().catch(() => {});
    if (btn) { btn.textContent = '✕ Quitter plein écran'; btn.classList.add('active'); }
  }
}
document.addEventListener('fullscreenchange', () => {
  const btn = _lf$('lf-btn-fs');
  if (!btn) return;
  if (!document.fullscreenElement) {
    btn.textContent = '⛶ Plein écran';
    btn.classList.remove('active');
  }
});


// ═══════════════════════════════════════════════════════════════
// AUDIO MODE FORMATEUR
// ═══════════════════════════════════════════════════════════════
const _LIVE_TRACKS = [
  'bureau.mp3',            // Affaire 1 — RH
  'favre.mp3',             // Affaire 2 — Achats
  'favre.mp3',             // Affaire 3 — Finance
  'pesee.mp3',             // Affaire 4 — Exploitation nuit
  'exterieur.mp3',         // Affaire 5 — QSE
  'mairie.mp3',            // Affaire 6 — Développement
  'extension.mp3',         // Affaire 7 — Juridique
  'urgencefindemois.mp3',  // Affaire 8 — Finance
  'operationprestige.mp3', // Affaire 9 — Relations Publiques
  'contratatoutprix.mp3',  // Affaire 10 — Commercial
  'bureau.mp3',            // Affaire 11 — Maintenance (contrat de confiance)
];
const _LIVE_AUDIO_PATH = 'assets/audio/musiques/';

let _lfAudio       = null;   // HTMLAudioElement courant
let _lfSonActif    = localStorage.getItem('formateur_son') !== 'false'; // true par défaut

function _lfSyncBtnSon() {
  const btn = _lf$('lf-btn-son');
  if (!btn) return;
  if (_lfSonActif) {
    btn.textContent = '🔊 Son';
    btn.classList.remove('muted');
  } else {
    btn.textContent = '🔇 Son';
    btn.classList.add('muted');
  }
}

function lfToggleSon() {
  _lfSonActif = !_lfSonActif;
  localStorage.setItem('formateur_son', _lfSonActif);
  if (_lfAudio) {
    _lfAudio.muted = !_lfSonActif;
  }
  _lfSyncBtnSon();
}

function _lfJouerMusique(src, volume) {
  if (_lfAudio) {
    _lfAudio.pause();
    _lfAudio.src = '';
  }
  _lfAudio = new Audio(src);
  _lfAudio.loop   = true;
  _lfAudio.volume = volume || 0.25;
  _lfAudio.muted  = !_lfSonActif;
  _lfAudio.play().catch(() => {});
}

function lfAudioAffaire(affaireIdx) {
  const fichier = _LIVE_TRACKS[affaireIdx];
  if (!fichier) return;
  _lfJouerMusique(_LIVE_AUDIO_PATH + fichier, 0.30);
}

function lfAudioPrologue() {
  _lfJouerMusique(_LIVE_AUDIO_PATH + 'introduction.mp3', 0.20);
}

function lfAudioStop() {
  if (_lfAudio) { _lfAudio.pause(); _lfAudio.src = ''; _lfAudio = null; }
}

// Initialiser l'état du bouton son au chargement
document.addEventListener('DOMContentLoaded', () => { _lfSyncBtnSon(); });


// ═══════════════════════════════════════════════════════════════
// QUIZ FINAL (live)
// ═══════════════════════════════════════════════════════════════

function lfLancerQuiz() {
  // On utilise les 6 questions communes
  _lfState.quizQuestions = (typeof QUIZ_COMMUN !== 'undefined') ? [...QUIZ_COMMUN] : [];
  _lfState.quizCursor    = 0;
  _lfState.quizVotes     = {};
  _lfState.quizVotesTotal = 0;

  if (_lfState.quizQuestions.length === 0) {
    // Pas de quiz dispo → aller directement à l'écran de fin
    lfTerminer();
    return;
  }

  _lfScreen('lf-quiz');
  _lfAfficherQuizQuestion();
  // Notifier les joueurs que le quiz commence
  LiveSession.lancerQuiz && LiveSession.lancerQuiz(_lfState.sessionId, _lfState.formateurToken);
}

function _lfAfficherQuizQuestion() {
  const q   = _lfState.quizQuestions[_lfState.quizCursor];
  const num = _lfState.quizCursor + 1;
  const tot = _lfState.quizQuestions.length;

  _lfState.quizVotes      = {};
  _lfState.quizVotesTotal = 0;

  const wrap = _lf$('lf-quiz-question-wrap');
  if (wrap) {
    wrap.innerHTML = `
      <div class="lf-quiz-q-num">Question ${num} / ${tot}</div>
      <div class="lf-quiz-q-text">${_lfEsc(q.q)}</div>
      <div class="lf-quiz-opts">
        ${q.opts.map((o, i) => `
          <div class="lf-quiz-opt lf-quiz-opt-${['a','b','c'][i]}">
            <span class="lf-quiz-opt-lettre">${['A','B','C'][i]}</span>
            <span class="lf-quiz-opt-text">${_lfEsc(o)}</span>
          </div>`).join('')}
      </div>`;
  }

  const bigNum = _lf$('lf-quiz-big-number');
  if (bigNum) bigNum.textContent = '0';

  // Boutons
  _lfShow('lf-quiz-btn-correction');
  _lfHide('lf-quiz-btn-suivant');
  _lfHide('lf-quiz-btn-fin');

  // Timer
  _lfStartQuizTimer();

  // Notifier les joueurs : question en cours
  LiveSession.diffuserQuizQuestion && LiveSession.diffuserQuizQuestion(
    _lfState.sessionId, _lfState.formateurToken, _lfState.quizCursor, q
  );

  // Écouter les votes quiz
  LiveSession.abonnerQuizVotes && LiveSession.abonnerQuizVotes(
    _lfState.sessionId, _lfOnQuizVote
  );
}

function _lfOnQuizVote(vote) {
  if (!_lfState.quizVotes[vote.joueur_id]) {
    _lfState.quizVotes[vote.joueur_id] = vote.choix_index;
    _lfState.quizVotesTotal++;
    const bigNum = _lf$('lf-quiz-big-number');
    if (bigNum) bigNum.textContent = _lfState.quizVotesTotal;
  }
}

function _lfStartQuizTimer() {
  if (_lfState.quizTimer) clearInterval(_lfState.quizTimer);
  const QUIZ_DUREE = 30; // Timer quiz fixe à 30s (indépendant du timer décision)
  let secs = QUIZ_DUREE;
  _lfUpdateQuizTimer(secs, QUIZ_DUREE);
  _lf$('lf-quiz-timer-wrap').style.display = '';
  _lfState.quizTimer = setInterval(() => {
    secs--;
    _lfUpdateQuizTimer(secs, QUIZ_DUREE);
    if (secs <= 0) {
      clearInterval(_lfState.quizTimer);
      _lfState.quizTimer = null;
    }
  }, 1000);
}

function _lfUpdateQuizTimer(secs, dureeTotal) {
  const arc = _lf$('lf-quiz-timer-arc');
  const txt = _lf$('lf-quiz-timer-text');
  if (!arc || !txt) return;
  const total  = 2 * Math.PI * 30;
  const duree  = dureeTotal || 30;
  const offset = total * (1 - secs / duree);
  arc.setAttribute('stroke-dashoffset', offset.toFixed(2));
  txt.textContent = Math.max(0, secs);
  arc.classList.toggle('urgent', secs <= 10);
  txt.classList.toggle('urgent', secs <= 10);
}

function lfQuizAfficherCorrection() {
  if (_lfState.quizTimer) { clearInterval(_lfState.quizTimer); _lfState.quizTimer = null; }
  _lf$('lf-quiz-timer-wrap').style.display = 'none';

  const q   = _lfState.quizQuestions[_lfState.quizCursor];
  const wrap = _lf$('lf-quiz-question-wrap');
  if (wrap) {
    // Mettre en évidence la bonne réponse
    wrap.querySelectorAll('.lf-quiz-opt').forEach((el, i) => {
      el.classList.toggle('correct', i === q.ans);
      el.classList.toggle('incorrect', i !== q.ans);
    });
    // Ajouter l'explication
    const explEl = document.createElement('div');
    explEl.className = 'lf-quiz-explication';
    explEl.textContent = q.expl;
    wrap.appendChild(explEl);
  }

  const isLast = _lfState.quizCursor >= _lfState.quizQuestions.length - 1;
  _lfHide('lf-quiz-btn-correction');
  if (isLast) {
    _lfShow('lf-quiz-btn-fin');
  } else {
    _lfShow('lf-quiz-btn-suivant');
  }

  // Notifier les joueurs de la correction
  LiveSession.diffuserQuizCorrection && LiveSession.diffuserQuizCorrection(
    _lfState.sessionId, _lfState.formateurToken, _lfState.quizCursor, q.ans
  );
}

function lfQuizQuestionSuivante() {
  _lfState.quizCursor++;
  _lfAfficherQuizQuestion();
}

function lfQuizTerminer() {
  lfTerminer();
}

// ── Sélecteur de durée du timer décision ─────────────────────────
function lfSetTimerDecision(secs) {
  _lfTimerDecision = secs;
  document.querySelectorAll('.lf-timer-opt').forEach(btn => btn.classList.remove('lf-timer-opt-active'));
  const btns = document.querySelectorAll('.lf-timer-opt');
  const vals = [30, 60, 90, 0];
  const idx = vals.indexOf(secs);
  if (btns[idx]) btns[idx].classList.add('lf-timer-opt-active');
  // Mettre à jour l'affichage du timer si on est en phase "pré-vote" (pas encore lancé)
  _lfResetTimer();
}
