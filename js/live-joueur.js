// ═══════════════════════════════════════════════════════════════
// LIVE JOUEUR — Logique UI de l'écran mobile participant
// ═══════════════════════════════════════════════════════════════

const TIMER_JOUEUR = 30; // secondes (doit correspondre au formateur)

// ── Prénoms fixes par affaire (mode Live) ───────────────────────
const _LJ_PRENOMS = ['Sophie','Thomas','Claire','Marc','Julie','Nicolas','Isabelle','Laurent','Camille','Éric'];
function _ljTxt(texte, affaireIdx) {
  if (!texte) return texte;
  return texte.replace(/\{pr[ée]nom\}/gi, _LJ_PRENOMS[affaireIdx] || '');
}

// ── État local ─────────────────────────────────────────────────
let _ljState = {
  joueurId:          null,
  joueurNom:         null,
  sessionId:         null,
  sessionCode:       null,
  affaireIdx:        null,
  aVote:             false,
  choixFait:         null,
  timerInterval:     null,
  timerSecondes:     TIMER_JOUEUR,
  votesOuvertDepuis: null,
  ordreChoix:        [0, 1, 2],
  scoreTotal:        0,
  nbCorrects:        0,
  nbAffaires:        0,
  streak:            0,
  dernierePosition:  null,
  // Quiz
  quizCursor:        0,
  quizQuestion:      null,
  quizAVote:         false,
  quizTimer:         null,
  quizScore:         0,
  quizCorrects:      0,
  // Lecture collective
  aLu:               false,
  ligneIdCourante:   null,
  nbParticipants:    0,
  // Réflexe pro
  reflexeQSel:       [],   // indices questions sélectionnées
  reflexeASel:       [],   // indices actions sélectionnées
  aValideReflexe:    false,
  reflexeResult:     null, // 'good' | 'warn' | 'bad' — résultat de la phase réflexe
};

// ── Utilitaire DOM ─────────────────────────────────────────────
function _lj$(id) { return document.getElementById(id); }

function _ljScreen(id) {
  ['lj-entree','lj-attente','lj-dialogue','lj-reflexe','lj-reflexe-confirme','lj-vote','lj-confirme','lj-resultats','lj-podium','lj-quiz','lj-quiz-result','lj-fin'].forEach(s => {
    const el = _lj$(s);
    if (el) el.classList.toggle('on', s === id);
  });
}

// ── Init ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  LiveSession.init();

  // Lire ?code= depuis l'URL → pré-remplir l'input code
  const params = new URLSearchParams(window.location.search);
  const codeParam = params.get('code');
  if (codeParam) {
    const display = _lj$('lj-code-session-display');
    if (display) { display.textContent = codeParam.toUpperCase(); display.style.display = ''; }
    const inp = _lj$('lj-input-code');
    if (inp) inp.value = codeParam.toUpperCase();
  }

  // Restaurer prénom si reprise
  const nomSauve = sessionStorage.getItem('lv_joueur_nom');
  if (nomSauve) {
    const inp = _lj$('lj-input-nom');
    if (inp) inp.value = nomSauve;
  }

  // Vérifier si session déjà rejointe (rechargement de page)
  const sessionIdSauve = sessionStorage.getItem('lv_session_id');
  const codeSauve      = sessionStorage.getItem('lv_session_code');
  const joueurIdSauve  = sessionStorage.getItem('lv_joueur_id');
  if (sessionIdSauve && codeSauve && nomSauve && joueurIdSauve) {
    _ljState.sessionId   = parseInt(sessionIdSauve);
    _ljState.sessionCode = codeSauve;
    _ljState.joueurId    = joueurIdSauve;
    _ljState.joueurNom   = nomSauve;
    _ljRejoindreSession();
  }
});

// ── Rejoindre ──────────────────────────────────────────────────
async function ljRejoindre() {
  const nom = (_lj$('lj-input-nom').value || '').trim();
  // Code : depuis l'input utilisateur, ou depuis l'URL, ou depuis sessionStorage
  const codeInput = (
    (_lj$('lj-input-code') && _lj$('lj-input-code').value.trim()) ||
    new URLSearchParams(window.location.search).get('code') ||
    sessionStorage.getItem('lv_session_code') ||
    ''
  ).toUpperCase().replace(/\s/g, '');

  if (!nom) {
    _lj$('lj-error').textContent = 'Saisissez votre prénom.';
    return;
  }
  if (!codeInput) {
    _lj$('lj-error').textContent = 'Saisissez le code de session (ex: HRZ-482).';
    return;
  }

  const btn = _lj$('lj-btn-rejoindre');
  btn.disabled = true;
  btn.textContent = 'Connexion…';
  _lj$('lj-error').textContent = '';

  const result = await LiveSession.rejoindreSession(codeInput, nom);
  if (!result) {
    _lj$('lj-error').textContent = 'Session introuvable. Vérifiez le code.';
    btn.disabled = false;
    btn.textContent = 'Rejoindre →';
    return;
  }

  _ljState.sessionId   = result.sessionId;
  _ljState.sessionCode = codeInput.toUpperCase();
  _ljState.joueurId    = result.joueurId;
  _ljState.joueurNom   = nom;

  _ljRejoindreSession(result);
}

async function _ljRejoindreSession(etatInitial) {
  // Masquer le formulaire de connexion et afficher l'attente
  _ljScreen('lj-attente');
  _lj$('lj-nom-display').textContent = _ljState.joueurNom || '';
  const nbEl = _lj$('lj-nb-connectes');
  if (nbEl) nbEl.textContent = '';

  // Abonnement Canal A : écoute les changements de phase
  LiveSession.abonnerSession(_ljState.sessionCode, _ljOnPhaseChange);

  // Abonnement Canal B votes-broadcast : prépare le canal pour émettre les votes
  // (callback no-op côté joueur — le joueur émet, le formateur reçoit)
  LiveSession.abonnerVotes(_ljState.sessionId, () => {});

  // Abonnement Presence : compteur
  LiveSession.abonnerPresence(
    _ljState.sessionCode,
    _ljState.joueurId,
    _ljState.joueurNom,
    (participants) => {
      _ljState.nbParticipants = participants.length;
      const nbEl = _lj$('lj-nb-connectes');
      if (nbEl) nbEl.textContent = participants.length + ' participant(s) connecté(s)';
    }
  );

  // Lire l'état courant pour reprendre si la page a été rechargée en cours de jeu
  if (!etatInitial) {
    const etat = await LiveSession.lireEtat(_ljState.sessionId);
    if (etat) _ljOnPhaseChange(etat);
  } else {
    _ljOnPhaseChange(etatInitial);
  }
}

// ── Réagir aux changements de phase ────────────────────────────
function _ljOnPhaseChange(etat) {
  const phase = etat.phase;
  const idx   = etat.affaire_active;

  switch (phase) {
    case 'affaire_active':
      _ljState.affaireIdx      = idx !== null && idx !== undefined ? idx : _ljState.affaireIdx;
      _ljState.aVote           = false;
      _ljState.choixFait       = null;
      _ljState.reflexeQSel     = [];
      _ljState.reflexeASel     = [];
      _ljState.aValideReflexe  = false;
      _ljState.reflexeResult   = null;
      if (_ljState.affaireIdx !== null) _ljAfficherContexte(_ljState.affaireIdx);
      _ljMajAttenteAffaire(_ljState.affaireIdx);
      _ljScreen('lj-attente');
      break;

    case 'dialogue': {
      _ljState.affaireIdx      = idx !== null && idx !== undefined ? idx : _ljState.affaireIdx;
      _ljState.aVote           = false;
      _ljState.choixFait       = null;
      _ljState.reflexeQSel     = [];
      _ljState.reflexeASel     = [];
      _ljState.aValideReflexe  = false;
      _ljState.reflexeResult   = null;
      if (_ljState.affaireIdx !== null) _ljAfficherContexte(_ljState.affaireIdx);
      // Afficher la ligne de dialogue et le bouton "Lu !"
      const cursor = etat.dialogue_idx;
      if (cursor !== undefined && cursor !== null && _ljState.affaireIdx !== null) {
        _ljAfficherLigneDlg(_ljState.affaireIdx, cursor);
      } else {
        _ljScreen('lj-attente');
      }
      break;
    }

    case 'reflexe_ouverts':
      _ljState.affaireIdx      = idx !== null && idx !== undefined ? idx : _ljState.affaireIdx;
      _ljState.aValideReflexe  = false;
      _ljState.reflexeQSel     = [];
      _ljState.reflexeASel     = [];
      if (_ljState.affaireIdx !== null) _ljAfficherReflexe(_ljState.affaireIdx);
      break;

    case 'reflexe_fermes': {
      // Le formateur a clos la phase — transition immédiate vers l'attente
      // (évite que le joueur reste bloqué sur lj-reflexe qu'il ait validé ou non)
      const msgEl = _lj$('lj-wait-hint');
      if (msgEl) msgEl.textContent = 'Le formateur clôture les réflexes — résultats dans quelques instants…';
      _ljScreen('lj-attente');
      break;
    }

    case 'reflexe_resultats':
      // Phase de débriefing formateur — joueur attend
      _ljAfficherReflexeConfirme();
      break;

    case 'votes_ouverts':
      _ljState.affaireIdx = idx !== null ? idx : _ljState.affaireIdx;
      _ljState.aVote      = false;
      _ljState.votesOuvertDepuis = etat.votes_ouverts_depuis;
      _ljAfficherVote();
      _ljStartTimer(etat.votes_ouverts_depuis);
      break;

    case 'votes_fermes':
      if (_ljState.timerInterval) clearInterval(_ljState.timerInterval);
      // Désactiver les boutons si pas encore voté
      ['lj-btn-a','lj-btn-b','lj-btn-c'].forEach(id => {
        const btn = _lj$(id);
        if (btn) btn.disabled = true;
      });
      break;

    case 'resultats':
      // Afficher le résultat personnel
      _ljAfficherResultatPerso();
      break;

    case 'podium':
      _ljAfficherPodiumPerso();
      break;

    case 'quiz': {
      // Quiz final — afficher la question reçue
      const qd = etat.quiz_data || {};
      if (qd.question) _ljAfficherQuizQuestion(qd.question, qd.cursor || 0);
      break;
    }

    case 'quiz_correction': {
      // Correction d'une question quiz
      const qd = etat.quiz_data || {};
      if (qd.ans !== undefined && qd.ans !== null) _ljAfficherQuizCorrection(qd.ans, _ljState.quizQuestion);
      break;
    }

    case 'fin':
      _ljAfficherFin();
      break;
  }
}


// ── Afficher l'écran réflexe professionnel ──────────────────────
function _ljAfficherReflexe(affaireIdx) {
  const rd = typeof REFLEXE_DATA !== 'undefined' ? REFLEXE_DATA[affaireIdx] : null;
  if (!rd) { _ljScreen('lj-attente'); return; }

  // Masquer immédiatement l'écran courant avant de peupler le DOM
  _ljScreen('lj-attente');

  // Questions
  const qContainer = _lj$('lj-reflexe-questions');
  if (qContainer) {
    qContainer.innerHTML = (rd.questions || []).map((q, i) => `
      <label class="lj-reflexe-opt" id="lj-rq-${i}">
        <input type="checkbox" class="lj-reflexe-cb lj-reflexe-q-cb" value="${i}"
               onchange="ljReflexeToggle('q',${i})">
        <span class="lj-reflexe-opt-num">Q${i+1}</span>
        <span class="lj-reflexe-opt-txt">${_ljTxt(q.txt, affaireIdx)}</span>
      </label>`).join('');
  }

  // Actions
  const aContainer = _lj$('lj-reflexe-actions');
  if (aContainer) {
    aContainer.innerHTML = (rd.actions || []).map((a, i) => `
      <label class="lj-reflexe-opt" id="lj-ra-${i}">
        <input type="checkbox" class="lj-reflexe-cb lj-reflexe-a-cb" value="${i}"
               onchange="ljReflexeToggle('a',${i})">
        <span class="lj-reflexe-opt-num">A${i+1}</span>
        <span class="lj-reflexe-opt-txt">${_ljTxt(a.txt, affaireIdx)}</span>
      </label>`).join('');
  }

  _ljReflexeMajCompteur();
  _ljScreen('lj-reflexe');
}

function ljReflexeToggle(type, idx) {
  const arr     = type === 'q' ? _ljState.reflexeQSel : _ljState.reflexeASel;
  const prefix  = type === 'q' ? 'lj-rq-' : 'lj-ra-';
  const pos     = arr.indexOf(idx);

  if (pos >= 0) {
    arr.splice(pos, 1);
    const el = _lj$(prefix + idx);
    if (el) el.classList.remove('selected');
  } else {
    if (arr.length >= 2) {
      // Désélectionner le premier si déjà 2 sélectionnés
      const oldIdx = arr.shift();
      const oldEl = _lj$(prefix + oldIdx);
      if (oldEl) oldEl.classList.remove('selected');
    }
    arr.push(idx);
    const el = _lj$(prefix + idx);
    if (el) el.classList.add('selected');
  }

  if (type === 'q') _ljState.reflexeQSel = arr;
  else              _ljState.reflexeASel = arr;

  // Griser les options non sélectionnées quand on atteint 2
  const labelPrefix = type === 'q' ? 'lj-rq-' : 'lj-ra-';
  for (let i = 0; i < 4; i++) {
    const el = _lj$(labelPrefix + i);
    if (el) el.classList.toggle('disabled', arr.length >= 2 && !arr.includes(i));
  }

  _ljReflexeMajCompteur();
}

function _ljReflexeMajCompteur() {
  const q   = _ljState.reflexeQSel.length;
  const a   = _ljState.reflexeASel.length;
  const cpt = _lj$('lj-reflexe-counter');
  const btn = _lj$('lj-reflexe-btn');
  if (cpt) cpt.textContent = `${q}/2 questions · ${a}/2 actions`;
  if (btn) btn.disabled = (q < 2 || a < 2);
}

async function ljValiderReflexe() {
  if (_ljState.aValideReflexe) return;
  if (_ljState.reflexeQSel.length < 2 || _ljState.reflexeASel.length < 2) return;
  _ljState.aValideReflexe = true;

  const btn = _lj$('lj-reflexe-btn');
  if (btn) { btn.disabled = true; btn.textContent = '✓ Enregistré'; }

  // Évaluer le résultat réflexe localement pour l'écran de confirmation
  const rd = typeof REFLEXE_DATA !== 'undefined' ? REFLEXE_DATA[_ljState.affaireIdx] : null;
  if (rd && rd.combos) {
    const _evalCombo = (sel, combos) => {
      const key = sel.slice().sort((a,b)=>a-b).join(',');
      if (combos.good && combos.good.split(',').map(Number).sort((a,b)=>a-b).join(',') === key) return 'good';
      if (combos.bad  && combos.bad .split(',').map(Number).sort((a,b)=>a-b).join(',') === key) return 'bad';
      return 'warn';
    };
    const qType = _evalCombo(_ljState.reflexeQSel, rd.combos.questions);
    const aType = _evalCombo(_ljState.reflexeASel, rd.combos.actions);
    _ljState.reflexeResult = (qType === 'good' && aType === 'good') ? 'good'
                           : (qType === 'bad'  || aType === 'bad')  ? 'bad' : 'warn';
  } else {
    _ljState.reflexeResult = 'warn'; // fallback si pas de données
  }

  await LiveSession.voterReflexe(
    _ljState.sessionId,
    _ljState.joueurId,
    _ljState.joueurNom,
    _ljState.affaireIdx,
    _ljState.reflexeQSel,
    _ljState.reflexeASel,
  );

  _ljAfficherReflexeConfirme();
}

function _ljAfficherReflexeConfirme() {
  const result = _ljState.reflexeResult; // null si le joueur n'a pas validé dans les temps
  const streak = _ljState.streak;

  const badge  = _lj$('lj-rconf-badge');
  const icon   = _lj$('lj-rconf-badge-icon');
  const title  = _lj$('lj-rconf-title');
  const resume = _lj$('lj-rconf-resume');

  if (result === null) {
    // Joueur n'a pas validé à temps — affichage neutre, aucun impact score/jauges
    if (badge)  badge.className = 'lj-rconf-badge lj-rconf-badge--neutral';
    if (icon)   icon.textContent = '⏱';
    if (title)  title.textContent = 'Temps écoulé';
    if (resume) resume.textContent = 'Vous n\'avez pas eu le temps de répondre. Ce réflexe n\'est pas comptabilisé.';

    // Pas de streak affiché
    const streakEl = _lj$('lj-rconf-streak');
    if (streakEl) streakEl.style.display = 'none';
  } else {
    // Joueur a validé — affichage selon résultat
    if (badge) {
      badge.className = 'lj-rconf-badge lj-rconf-badge--' + result;
    }
    if (icon) {
      icon.textContent = result === 'good' ? '✓' : result === 'bad' ? '✗' : '~';
    }
    if (title) {
      title.textContent = result === 'good' ? 'Bon réflexe !'
                        : result === 'bad'  ? 'Réflexe à revoir'
                        : 'Réflexe perfectible';
    }
    if (resume) {
      resume.textContent = result === 'good'
        ? 'Vos choix correspondent aux bonnes pratiques anticorruption.'
        : result === 'bad'
        ? 'Ces réflexes auraient pu exposer votre organisation à des risques.'
        : 'Certains de vos réflexes méritent d\'être affinés.';
    }

    // Streak (paliers 3/5/7/10)
    const streakEl  = _lj$('lj-rconf-streak');
    const streakIco = _lj$('lj-rconf-streak-icon');
    const streakTxt = _lj$('lj-rconf-streak-txt');
    if (streakEl) {
      if (streak >= 3) {
        const ico = streak >= 10 ? '🏆' : streak >= 7 ? '💎' : streak >= 5 ? '⚡' : '🔥';
        if (streakIco) streakIco.textContent = ico;
        if (streakTxt) streakTxt.textContent = 'Série de ' + streak + ' bonne' + (streak > 1 ? 's' : '') + ' décision' + (streak > 1 ? 's' : '');
        streakEl.style.display = 'flex';
      } else {
        streakEl.style.display = 'none';
      }
    }
  }

  // Forcer la réanimation de la carte (pour les transitions répétées)
  const card = _lj$('lj-rconf-card');
  if (card) {
    card.style.animation = 'none';
    card.offsetHeight; // reflow
    card.style.animation = '';
  }

  _ljScreen('lj-reflexe-confirme');
}

// ── Mettre à jour le label d'affaire dans l'écran d'attente ────
function _ljMajAttenteAffaire(idx) {
  const el = _lj$('lj-attente-affaire');
  if (!el) return;
  if (idx === null || idx === undefined) { el.textContent = ''; return; }
  const ch = CHAPTERS[idx];
  el.textContent = ch ? ch.num + ' — ' + ch.name : '';
}

// ── Afficher le contexte de l'affaire (attente avant vote) ──────
function _ljAfficherContexte(idx) {
  const ch = CHAPTERS[idx];
  if (!ch) return;

  _lj$('lj-vote-affaire').textContent = ch.num;
  _lj$('lj-vote-titre').textContent   = ch.name;

  // Contexte court (3 lignes max)
  const ctx = _lj$('lj-vote-contexte');
  if (ctx) {
    const texte = ch.pressureIntro || (ch.context && ch.context.title) || '';
    ctx.textContent = _ljTxt(texte, idx);
  }

  // Ne remplir les descriptions A/B/C qu'une fois l'ordre de shuffle connu
  // (votesOuvertDepuis null → ordre indéfini, les boutons seront mis à jour dans _ljAfficherVote)
  if (!_ljState.votesOuvertDepuis) return;

  const descs = ['lj-desc-a','lj-desc-b','lj-desc-c'];
  const ordreChoix = LiveSession.calculerOrdreChoix(idx, _ljState.votesOuvertDepuis);
  _ljState.ordreChoix = ordreChoix;
  ordreChoix.forEach((origIdx, posAffiche) => {
    const c  = ch.choices[origIdx];
    const el = _lj$(descs[posAffiche]);
    if (el) el.textContent = _ljTxt(c.desc, idx);
  });
}

// ── Afficher une ligne de dialogue + bouton "Lu !" ──────────────
function _ljAfficherLigneDlg(affaireIdx, cursor) {
  const ch = CHAPTERS[affaireIdx];
  if (!ch) { _ljScreen('lj-attente'); return; }

  // Reconstruire les étapes exactement comme le formateur (_lfBuildSteps)
  // pour que le cursor reçu corresponde toujours au bon index
  const steps = [];
  steps.push({ type: 'context', ch });
  if (ch.preDialogue) ch.preDialogue.forEach(l => steps.push({ type: 'dlg', line: l }));
  if (ch.dialogue)    ch.dialogue.forEach(l   => steps.push({ type: 'dlg', line: l }));
  if (typeof REFLEXE_DATA !== 'undefined' && REFLEXE_DATA[affaireIdx]) {
    steps.push({ type: 'reflexe' }); // placeholder — géré séparément via phase reflexe_ouverts
  }
  if (ch.pressureIntro) steps.push({ type: 'tension' }); // placeholder — pas affiché côté joueur
  steps.push({ type: 'vote', ch });

  const step = steps[cursor];
  // Les steps réflexe/tension/vote ne sont pas affichés dans le dialogue joueur
  if (!step || step.type === 'vote' || step.type === 'reflexe' || step.type === 'tension') {
    _ljScreen('lj-attente');
    return;
  }

  // Construire l'affichage
  const affaireEl  = _lj$('lj-dlg-affaire');
  const speakerEl  = _lj$('lj-dlg-speaker');
  const texteEl    = _lj$('lj-dlg-texte');
  const progressEl = _lj$('lj-dlg-progress');
  const nbDlgSteps = steps.filter(s => s.type === 'context' || s.type === 'dlg').length;

  if (affaireEl)  affaireEl.textContent  = ch.num + ' — ' + ch.name;
  if (progressEl) progressEl.textContent = (cursor + 1) + ' / ' + nbDlgSteps;

  const portraitEl = _lj$('lj-dlg-portrait');

  if (step.type === 'context') {
    if (speakerEl)  speakerEl.textContent = ch.num;
    if (texteEl)    texteEl.innerHTML     = (ch.context?.title || '') +
      (ch.context?.body ? '<br><span style="font-size:13px;opacity:.6">' + ch.context.body + '</span>' : '');
    if (portraitEl) { portraitEl.src = ''; portraitEl.style.display = 'none'; }
  } else {
    const line    = step.line;
    const speaker = line.ch ? (line.ch.nm || line.sp) : (line.sp || '');
    if (speakerEl) speakerEl.textContent = speaker;
    if (texteEl)   texteEl.innerHTML     = _ljTxt(line.txt, affaireIdx) || '';
    // Portrait : dériver le nom de fichier depuis line.ch.css (ex: 'c-dominique' → 'dominique.png')
    if (portraitEl && line.ch && line.ch.css) {
      const nom = line.ch.css.replace(/^c-/, '');
      portraitEl.src = 'assets/characters/' + nom + '.png';
      portraitEl.alt = speaker;
      portraitEl.style.display = '';
    } else if (portraitEl) {
      portraitEl.src = '';
      portraitEl.style.display = 'none';
    }
  }

  // Animation fondu : forcer re-trigger de l'animation de la carte à chaque ligne
  const dlgCard = document.querySelector('#lj-dialogue .lj-dlg-card');
  if (dlgCard) { dlgCard.style.animation = 'none'; dlgCard.offsetHeight; dlgCard.style.animation = ''; }

  // Ligneid + état bouton Lu
  const ligneId = 'ch' + affaireIdx + '_dl' + cursor;
  const nouveauLigneId = ligneId !== _ljState.ligneIdCourante;
  _ljState.ligneIdCourante = ligneId;

  if (nouveauLigneId) {
    _ljState.aLu = false;
    _ljResetBoutonLu();

    // S'abonner aux lectures pour mettre à jour le compteur
    // Math.max(1, nb) : on ne bloque jamais l'abonnement même si la presence n'est pas encore comptée
    const nb = Math.max(1, _ljState.nbParticipants);
    LiveSession.abonnerLecture(
      _ljState.sessionCode,
      ligneId,
      nb,
      () => { /* passage géré côté formateur */ },
      (actuel, total) => {
        const el = _lj$('lj-lu-compteur');
        if (el) el.textContent = actuel + ' / ' + total + ' ont lu';
      }
    );
  }

  _ljScreen('lj-dialogue');
}

function _ljResetBoutonLu() {
  const btn = _lj$('lj-btn-lu');
  const cpt = _lj$('lj-lu-compteur');
  if (btn) {
    btn.disabled = false;
    btn.classList.remove('lj-btn-lu-done');
    btn.textContent = '✓ J\'ai lu';
  }
  if (cpt) cpt.textContent = '';
}

// ── Marquer la ligne comme lue ──────────────────────────────────
async function ljMarquerLu() {
  if (_ljState.aLu) return;
  _ljState.aLu = true;

  const btn = _lj$('lj-btn-lu');
  if (btn) {
    btn.disabled = true;
    btn.classList.add('lj-btn-lu-done');
    btn.textContent = '✓ Lu — en attente du formateur';
  }

  await LiveSession.marquerLu(
    _ljState.sessionCode,
    _ljState.ligneIdCourante,
    _ljState.joueurNom
  );
}

// ── Afficher le panneau de vote ─────────────────────────────────
function _ljAfficherVote() {
  const idx = _ljState.affaireIdx;
  if (idx === null) return;
  _ljAfficherContexte(idx);
  // Réactiver les boutons
  ['lj-btn-a','lj-btn-b','lj-btn-c'].forEach(id => {
    const btn = _lj$(id);
    if (btn) {
      btn.disabled = false;
      btn.classList.remove('selected');
    }
  });
  _ljScreen('lj-vote');
}

// ── Timer côté joueur ───────────────────────────────────────────
function _ljStartTimer(votesOuvertDepuis) {
  if (_ljState.timerInterval) clearInterval(_ljState.timerInterval);

  // Calculer le temps déjà écoulé (synchro avec formateur)
  let elapsed = 0;
  if (votesOuvertDepuis) {
    elapsed = Math.floor((Date.now() - new Date(votesOuvertDepuis).getTime()) / 1000);
  }
  _ljState.timerSecondes = Math.max(0, TIMER_JOUEUR - elapsed);

  _ljUpdateTimer(_ljState.timerSecondes);

  if (_ljState.timerSecondes <= 0) return; // déjà expiré

  _ljState.timerInterval = setInterval(() => {
    _ljState.timerSecondes--;
    _ljUpdateTimer(_ljState.timerSecondes);
    if (_ljState.timerSecondes <= 0) {
      clearInterval(_ljState.timerInterval);
      _ljState.timerInterval = null;
      // Désactiver les boutons
      ['lj-btn-a','lj-btn-b','lj-btn-c'].forEach(id => {
        const btn = _lj$(id);
        if (btn) btn.disabled = true;
      });
    }
  }, 1000);
}

function _ljUpdateTimer(secs) {
  const fill = _lj$('lj-timer-fill');
  const txt  = _lj$('lj-timer-secs');
  const pct  = Math.max(0, secs / TIMER_JOUEUR * 100);
  if (fill) {
    fill.style.width = pct + '%';
    fill.classList.toggle('urgent', secs <= 10);
  }
  if (txt) {
    txt.textContent = Math.max(0, secs);
    txt.classList.toggle('urgent', secs <= 10);
  }
}

// ── Voter ───────────────────────────────────────────────────────
async function ljVoter(posAffiche) {
  if (_ljState.aVote) return;
  // Convertir position affichée → index original (pour correspondre au formateur)
  const choixOriginal = (_ljState.ordreChoix || [0, 1, 2])[posAffiche];
  _ljState.aVote     = true;
  _ljState.choixFait = choixOriginal;

  // Arrêter le timer
  if (_ljState.timerInterval) clearInterval(_ljState.timerInterval);

  // Désactiver tous les boutons
  ['lj-btn-a','lj-btn-b','lj-btn-c'].forEach((id, i) => {
    const btn = _lj$(id);
    if (btn) {
      btn.disabled = true;
      btn.classList.toggle('selected', i === posAffiche);
    }
  });

  // Calculer le temps de réponse
  let tempsMs = 15000; // valeur par défaut (milieu)
  if (_ljState.votesOuvertDepuis) {
    tempsMs = Math.min(30000, Date.now() - new Date(_ljState.votesOuvertDepuis).getTime());
  }

  // Afficher confirmation
  const lettres = ['A','B','C'];
  _lj$('lj-confirme-choix').textContent = 'Votre choix : ' + lettres[posAffiche];
  _ljScreen('lj-confirme');

  // Enregistrer le vote avec l'index original
  await LiveSession.voter(
    _ljState.sessionId,
    _ljState.joueurId,
    _ljState.joueurNom,
    _ljState.affaireIdx,
    choixOriginal,
    tempsMs,
    _ljState.streak
  );
}

// ── Afficher résultat personnel ─────────────────────────────────
async function _ljAfficherResultatPerso() {
  const idx = _ljState.affaireIdx;
  if (idx === null) return;

  const ch = CHAPTERS[idx];
  const indexCorrect   = ch.choices.findIndex(c => c.type === 'good');
  const estCorrect     = _ljState.choixFait === indexCorrect;
  const choixFait      = _ljState.choixFait;
  // Position affichée de la bonne réponse (pour le message "La bonne réponse était : X")
  const ordre          = _ljState.ordreChoix || [0, 1, 2];
  const posCorrectAff  = ordre.indexOf(indexCorrect);

  // Calculer le score de cette affaire
  let tempsMs = 15000;
  if (_ljState.votesOuvertDepuis) {
    tempsMs = Math.min(30000, Date.now() - new Date(_ljState.votesOuvertDepuis).getTime());
  }

  // Bonus réflexe : +200 pts si le joueur a eu un bon réflexe pro
  const bonusReflexe = _ljState.reflexeResult === 'good' ? 200 : 0;

  _ljState.nbAffaires++;
  if (choixFait === null) {
    // N'a pas voté (temps écoulé sans clic)
    _ljState.streak = 0;
    if (bonusReflexe) {
      _ljState.scoreTotal += bonusReflexe;
    }
    _ljAfficherResultatAbsent(posCorrectAff, bonusReflexe);
  } else if (estCorrect) {
    _ljState.nbCorrects++;
    _ljState.streak++;
    // Score approx (même formule que live-session.js)
    let pts = tempsMs < 5000 ? 1000 : tempsMs < 10000 ? 800 : tempsMs < 20000 ? 600 : 400;
    const bonus = _ljState.streak >= 5 ? 500 : _ljState.streak >= 3 ? 200 : 0;
    pts += bonus + bonusReflexe;
    _ljState.scoreTotal += pts;
    _ljAfficherResultatCorrect(pts, bonus, bonusReflexe);
  } else {
    _ljState.streak = 0;
    if (bonusReflexe) {
      _ljState.scoreTotal += bonusReflexe;
    }
    _ljAfficherResultatIncorrect(posCorrectAff, bonusReflexe);
  }
}

function _ljAfficherResultatCorrect(pts, bonus, bonusReflexe) {
  _lj$('lj-resultat-icon').textContent = '✅';
  _lj$('lj-resultat-label').textContent = 'Bonne réponse !';
  _lj$('lj-resultat-sub').textContent = '';

  const ptsEl = _lj$('lj-pts');
  ptsEl.textContent = '+' + pts;
  ptsEl.style.display = '';

  const parts = [];
  if (bonus > 0) parts.push(`+${bonus} streak`);
  if (bonusReflexe > 0) parts.push(`+${bonusReflexe} réflexe ✓`);
  _lj$('lj-pts-label').textContent = parts.length > 0 ? `dont ${parts.join(', ')}` : 'points';
  _lj$('lj-pts-label').style.display = '';

  _lj$('lj-bonne-reponse').style.display = 'none';
  _lj$('lj-score-total').textContent = 'Score total : ' + _ljState.scoreTotal + ' pts';

  _ljScreen('lj-resultats');
  _ljLancerConfetti();
}

function _ljAfficherResultatIncorrect(indexCorrect, bonusReflexe) {
  const lettres = ['A','B','C'];
  _lj$('lj-resultat-icon').textContent = '❌';
  _lj$('lj-resultat-label').textContent = 'Mauvaise réponse';
  _lj$('lj-resultat-label').classList.add('lj-shake');
  setTimeout(() => _lj$('lj-resultat-label').classList.remove('lj-shake'), 600);

  const bonneEl = _lj$('lj-bonne-reponse');
  bonneEl.textContent = 'La bonne réponse était : ' + lettres[indexCorrect];
  bonneEl.style.display = '';

  if (bonusReflexe > 0) {
    _lj$('lj-pts').textContent = '+' + bonusReflexe;
    _lj$('lj-pts').style.display = '';
    _lj$('lj-pts-label').textContent = 'bonus réflexe ✓';
    _lj$('lj-pts-label').style.display = '';
    _lj$('lj-resultat-sub').textContent = '';
  } else {
    _lj$('lj-pts').style.display = 'none';
    _lj$('lj-pts-label').style.display = 'none';
    _lj$('lj-resultat-sub').textContent = '+0 point';
  }

  _lj$('lj-score-total').textContent = 'Score total : ' + _ljState.scoreTotal + ' pts';
  _ljScreen('lj-resultats');
}

function _ljAfficherResultatAbsent(indexCorrect, bonusReflexe) {
  const lettres = ['A','B','C'];
  _lj$('lj-resultat-icon').textContent = '⏱️';
  _lj$('lj-resultat-label').textContent = 'Temps écoulé';

  const bonneEl = _lj$('lj-bonne-reponse');
  bonneEl.textContent = 'La bonne réponse était : ' + lettres[indexCorrect];
  bonneEl.style.display = '';

  if (bonusReflexe > 0) {
    _lj$('lj-pts').textContent = '+' + bonusReflexe;
    _lj$('lj-pts').style.display = '';
    _lj$('lj-pts-label').textContent = 'bonus réflexe ✓';
    _lj$('lj-pts-label').style.display = '';
    _lj$('lj-resultat-sub').textContent = '';
  } else {
    _lj$('lj-pts').style.display = 'none';
    _lj$('lj-pts-label').style.display = 'none';
    _lj$('lj-resultat-sub').textContent = '+0 point';
  }

  _lj$('lj-score-total').textContent = 'Score total : ' + _ljState.scoreTotal + ' pts';
  _ljScreen('lj-resultats');
}

// ── Confetti ────────────────────────────────────────────────────
function _ljLancerConfetti() {
  const wrap = _lj$('lj-confetti-wrap');
  if (!wrap) return;
  wrap.innerHTML = '';
  const couleurs = ['#fbbf24','#22c55e','#60a0f8','#d888f8','#f472b6'];
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'lj-confetti-piece';
    p.style.left      = Math.random() * 100 + 'vw';
    p.style.background = couleurs[Math.floor(Math.random() * couleurs.length)];
    p.style.animationDelay    = Math.random() * 1.5 + 's';
    p.style.animationDuration = (2 + Math.random() * 1.5) + 's';
    p.style.width  = (6 + Math.random() * 6) + 'px';
    p.style.height = (6 + Math.random() * 6) + 'px';
    p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    wrap.appendChild(p);
  }
  setTimeout(() => { if (wrap) wrap.innerHTML = ''; }, 4000);
}

// ── Podium intermédiaire (écran mobile) ──────────────────────────
async function _ljAfficherPodiumPerso() {
  _ljScreen('lj-podium');

  // Calculer la position de ce joueur dans le classement
  const classement = await LiveSession.calculerClassement(_ljState.sessionId);
  const total = classement.length;
  const pos   = classement.findIndex(j => j.joueurId === _ljState.joueurId) + 1;
  const score = _ljState.scoreTotal;

  const posEl   = _lj$('lj-pod-position');
  const scoreEl = _lj$('lj-pod-score');
  const gainEl  = _lj$('lj-pod-gain');

  if (posEl) {
    posEl.textContent = pos > 0 ? `#${pos} sur ${total}` : `${total} participant(s)`;
  }
  if (scoreEl) scoreEl.textContent = score + ' pts';
  if (gainEl)  gainEl.textContent  = pos === 1 ? '🥇 En tête !' : pos === 2 ? '🥈 2e place' : pos === 3 ? '🥉 3e place' : '';
}

// ── Quiz final (côté joueur) ──────────────────────────────────────
function _ljAfficherQuizQuestion(q, cursor) {
  _ljState.quizCursor = cursor || 0;
  _ljState.quizQuestion = q;
  _ljState.quizAVote    = false;

  const numEl = _lj$('lj-quiz-num');
  if (numEl) numEl.textContent = `Question ${cursor + 1}`;

  const qEl = _lj$('lj-quiz-q');
  if (qEl) qEl.textContent = q.q || '';

  const descs = ['lj-quiz-desc-a','lj-quiz-desc-b','lj-quiz-desc-c'];
  (q.opts || []).forEach((o, i) => {
    const el = _lj$(descs[i]);
    if (el) el.textContent = o;
  });

  ['lj-quiz-btn-a','lj-quiz-btn-b','lj-quiz-btn-c'].forEach(id => {
    const btn = _lj$(id);
    if (btn) {
      btn.disabled = false;
      btn.classList.remove('selected','correct','incorrect');
    }
  });

  // Timer
  _ljStartQuizTimer();
  _ljScreen('lj-quiz');
}

function _ljStartQuizTimer() {
  if (_ljState.quizTimer) clearInterval(_ljState.quizTimer);
  let secs = TIMER_JOUEUR;
  _ljUpdateQuizTimer(secs);
  _ljState.quizTimer = setInterval(() => {
    secs--;
    _ljUpdateQuizTimer(secs);
    if (secs <= 0) {
      clearInterval(_ljState.quizTimer);
      _ljState.quizTimer = null;
      ['lj-quiz-btn-a','lj-quiz-btn-b','lj-quiz-btn-c'].forEach(id => {
        const btn = _lj$(id);
        if (btn) btn.disabled = true;
      });
    }
  }, 1000);
}

function _ljUpdateQuizTimer(secs) {
  const fill = _lj$('lj-quiz-timer-fill');
  const txt  = _lj$('lj-quiz-timer-secs');
  const pct  = Math.max(0, secs / TIMER_JOUEUR * 100);
  if (fill) { fill.style.width = pct + '%'; fill.classList.toggle('urgent', secs <= 10); }
  if (txt)  { txt.textContent = Math.max(0, secs); txt.classList.toggle('urgent', secs <= 10); }
}

async function ljQuizVoter(choixIndex) {
  if (_ljState.quizAVote) return;
  _ljState.quizAVote = true;
  if (_ljState.quizTimer) { clearInterval(_ljState.quizTimer); _ljState.quizTimer = null; }

  ['lj-quiz-btn-a','lj-quiz-btn-b','lj-quiz-btn-c'].forEach((id, i) => {
    const btn = _lj$(id);
    if (btn) { btn.disabled = true; btn.classList.toggle('selected', i === choixIndex); }
  });

  // Enregistrer le vote quiz
  LiveSession.voterQuiz && await LiveSession.voterQuiz(
    _ljState.sessionId, _ljState.joueurId, _ljState.joueurNom,
    _ljState.quizCursor, choixIndex
  );
}

function _ljAfficherQuizCorrection(ansCorrect, q) {
  if (_ljState.quizTimer) { clearInterval(_ljState.quizTimer); _ljState.quizTimer = null; }

  const choixFait = _ljState.quizAVote
    ? ['lj-quiz-btn-a','lj-quiz-btn-b','lj-quiz-btn-c'].findIndex((id, i) =>
        (_lj$(id) || {}).classList && _lj$(id).classList.contains('selected'))
    : -1;
  const estCorrect = choixFait === ansCorrect;

  if (estCorrect) _ljState.quizCorrects++;

  const icon  = _lj$('lj-quiz-result-icon');
  const label = _lj$('lj-quiz-result-label');
  const expl  = _lj$('lj-quiz-expl');
  if (icon)  icon.textContent  = estCorrect ? '✅' : '❌';
  if (label) label.textContent = estCorrect ? 'Bonne réponse !' : 'Mauvaise réponse';
  if (expl && q) expl.textContent = q.expl || '';

  _ljScreen('lj-quiz-result');
}

// ── Écran de fin ─────────────────────────────────────────────────
async function _ljAfficherFin() {
  _ljScreen('lj-fin');

  const nbA = _ljState.nbAffaires;
  const nbC = _ljState.nbCorrects;
  const sc  = _ljState.scoreTotal;

  // Médaille et message
  let medal, titre, message;
  if (nbA === 0) {
    medal = '🏅'; titre = 'Session terminée'; message = 'Merci pour votre participation !';
  } else {
    const ratio = nbC / nbA;
    if (ratio === 1) {
      medal = '🏆'; titre = 'Parfait !'; message = 'Score parfait — excellente maîtrise anticorruption !';
    } else if (ratio >= 0.7) {
      medal = '🥇'; titre = 'Excellente maîtrise !'; message = 'Très bon niveau. Continuez ainsi !';
    } else if (ratio >= 0.5) {
      medal = '👍'; titre = 'Bonne participation !'; message = 'Des axes d\'amélioration existent — à retravailler !';
    } else {
      medal = '📚'; titre = 'À retravailler !'; message = 'Revoyez les points clés de la formation Sapin II.';
    }
  }

  _lj$('lj-fin-medal').textContent   = medal;
  _lj$('lj-fin-title').textContent   = titre;
  _lj$('lj-fin-message').textContent = message;

  _lj$('lj-fin-stats').innerHTML = `
    <div class="lj-fin-stat-row">
      <span class="lj-fin-stat-lbl">Affaires jouées</span>
      <span class="lj-fin-stat-val">${nbA}</span>
    </div>
    <div class="lj-fin-stat-row">
      <span class="lj-fin-stat-lbl">Bonnes réponses</span>
      <span class="lj-fin-stat-val">${nbC} / ${nbA}</span>
    </div>
    <div class="lj-fin-stat-row">
      <span class="lj-fin-stat-lbl">Score total</span>
      <span class="lj-fin-stat-val">${sc} pts</span>
    </div>`;

  // Afficher le bouton attestation
  const btnAttestation = _lj$('lj-btn-attestation');
  if (btnAttestation) btnAttestation.style.display = '';

  // Nettoyer la session stockée
  sessionStorage.removeItem('lv_session_id');
  sessionStorage.removeItem('lv_session_code');
}

// ── Télécharger l'attestation (canvas → PNG) ──────────────────
function ljTelechargerAttestation() {
  const nom   = _ljState.joueurNom || 'Participant';
  const date  = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const score = _ljState.scoreTotal;

  const canvas = document.createElement('canvas');
  canvas.width  = 1200;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');

  // Fond dégradé
  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, '#07090f');
  grad.addColorStop(1, '#1b2a4a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Bordure dorée
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth   = 6;
  ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
  ctx.strokeStyle = 'rgba(212,175,55,.4)';
  ctx.lineWidth   = 2;
  ctx.strokeRect(44, 44, canvas.width - 88, canvas.height - 88);

  // Titre
  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 36px serif';
  ctx.textAlign = 'center';
  ctx.fillText('ATTESTATION DE PARTICIPATION', canvas.width / 2, 130);

  // Sous-titre
  ctx.fillStyle = 'rgba(255,255,255,.6)';
  ctx.font = '22px sans-serif';
  ctx.fillText('Formation Anticorruption · Loi Sapin II', canvas.width / 2, 175);

  // Séparateur
  ctx.strokeStyle = 'rgba(212,175,55,.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(200, 205); ctx.lineTo(1000, 205);
  ctx.stroke();

  // Nom
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 52px serif';
  ctx.fillText(nom, canvas.width / 2, 310);

  // Corps
  ctx.fillStyle = 'rgba(255,255,255,.75)';
  ctx.font = '24px sans-serif';
  ctx.fillText('a participé à la session de formation Projet Horizon', canvas.width / 2, 380);
  ctx.fillText('et a répondu aux situations de corruption simulées', canvas.width / 2, 415);

  // Score
  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 40px sans-serif';
  ctx.fillText(`Score : ${score} pts`, canvas.width / 2, 510);

  // Date
  ctx.fillStyle = 'rgba(255,255,255,.55)';
  ctx.font = '20px sans-serif';
  ctx.fillText(`Le ${date}`, canvas.width / 2, 640);

  // Logo textuel
  ctx.fillStyle = 'rgba(212,175,55,.8)';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('PROJET HORIZON · SEM Formation', canvas.width / 2, 720);

  // Télécharger
  const a = document.createElement('a');
  a.href     = canvas.toDataURL('image/png');
  a.download = `attestation-${nom.replace(/\s+/g,'-').toLowerCase()}.png`;
  a.click();
}
