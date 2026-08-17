// ═══════════════════════════════════════
// BADGES — Système de récompenses
// Persistance : localStorage clé "horizon_badges"
// ═══════════════════════════════════════
const Badges = (() => {

  const KEY = 'horizon_badges';

  // ── Définitions de tous les badges ──────────────────────────
  const DEFS = {
    // Performance globale
    ref:        { em:'🏆', label:'Référence Anticorruption', secret:false,
                  desc:'0 mauvais choix sur toutes les affaires jouées' },
    integAbs:   { em:'🥇', label:'Intégrité Absolue',        secret:false,
                  desc:'100% bons choix sur les affaires prioritaires' },
    juriste:    { em:'⚖️',  label:'Juriste en Herbe',         secret:false,
                  desc:'SOS Déontologue consulté 3 fois ou plus' },
    finLimier:  { em:'🔍', label:'Fin Limier',                secret:false,
                  desc:'Tous les indices trouvés dans chaque affaire jouée' },
    parcours:   { em:'🎓', label:'Parcours Complet',          secret:false,
                  desc:'6 affaires du parcours complétées' },
    // Par chapitre (indices 0-5)
    ch0: { em:'📁', label:'RH Irréprochable',    secret:false, desc:'Bon choix à l\'Affaire 1' },
    ch1: { em:'🤝', label:'Acheteur Intègre',    secret:false, desc:'Bon choix à l\'Affaire 2' },
    ch2: { em:'⚡', label:'Gardien du Site',     secret:false, desc:'Bon choix à l\'Affaire 3' },
    ch3: { em:'🌿', label:'Sentinelle HSE',      secret:false, desc:'Bon choix à l\'Affaire 4' },
    ch4: { em:'📈', label:'Commercial Éthique',  secret:false, desc:'Bon choix à l\'Affaire 5' },
    ch5: { em:'🏛️', label:'Juriste Blindé',     secret:false, desc:'Bon choix à l\'Affaire 6' },
    // Secrets (masqués jusqu'au déblocage)
    sansFilet:   { em:'🕵️', label:'Sans Filet',   secret:true,
                   desc:'Terminer une affaire sans utiliser le SOS Déontologue' },
    speedRunner: { em:'⚡', label:'Speed Runner',  secret:true,
                   desc:'Terminer une affaire en moins de 3 minutes' },
    diamant:     { em:'💎', label:'Diamant',       secret:true,
                   desc:'Tous les autres badges débloqués' },
    // ── Badges contextuels ──────────────────────────────────────
    ligneConduite:     { em:'🛡️', label:'Ligne de conduite',   secret:false,
                         desc:'Aucune mauvaise décision sur les 5 premières affaires' },
    detectiveFinancier:{ em:'🔎', label:'Détective financier',  secret:false,
                         desc:'Réflexe pro réussi sur les 2 affaires financières (3 et 8)' },
    sousPression:      { em:'⚡', label:'Sous pression',        secret:true,
                         desc:'Bonne décision finale en moins de 15 secondes' },
    sansFiletTotal:    { em:'🎯', label:'Sans filet',           secret:false,
                         desc:'Parcours complet sans utiliser le SOS Déontologue' },
    integriteTotale:   { em:'💎', label:'Intégrité totale',     secret:false,
                         desc:'Toutes les décisions finales correctes sur le parcours' },
    resilient:         { em:'🌱', label:'Résilient',            secret:false,
                         desc:'3 bonnes décisions consécutives après une mauvaise' },
    juristeHerbe:      { em:'⚖️', label:'Juriste en herbe',    secret:false,
                         desc:'Score parfait au quiz final (10/10)' },
  };

  // ── État en mémoire (réinitialisé à chaque session) ─────────
  let _sosUsedChapters  = new Set();  // chapitres où le SOS a été utilisé
  let _allCluesChapters = new Set();  // chapitres avec tous les indices trouvés
  let _chapterStartMs   = {};         // { chIdx: timestamp }
  let _sessionUnlocked  = [];         // badges débloqués pendant cette session
  let _notifQueue = [];
  let _notifBusy  = false;

  // ── Helpers pour lire etatJeu de façon défensive ─────────────
  function _stats() {
    const ej = (typeof etatJeu !== 'undefined') ? etatJeu : {};
    const choices = ej.choices || [];
    const good    = choices.filter(t => t === 'good').length;
    const bad     = choices.filter(t => t === 'bad').length;
    const played  = choices.length;
    return {
      goodDecisions:    good,
      badDecisions:     bad,
      affairesJouees:   played,
      reflexeGood:      ej.reflexeGood    || {},
      decisionRapide:   ej.decisionRapide || false,
      sosUtilises:      _sosUsedChapters.size,
      streakApresEchec: ej.streakApresEchec || 0,
      quizScore:        ej.quizScore       || 0,
    };
  }

  // ── Vérifie les badges contextuels après chaque événement ────
  // checkSousPression : true uniquement depuis chapterEnd (flag pertinent seulement à ce moment)
  function _checkContextuels(checkSousPression) {
    const d    = _load();
    const u    = new Set(d.unlocked);
    const s    = _stats();

    if (!u.has('ligneConduite') && s.badDecisions === 0 && s.affairesJouees >= 5)
      _unlock('ligneConduite');

    if (!u.has('detectiveFinancier') && s.reflexeGood[2] && s.reflexeGood[7])
      _unlock('detectiveFinancier');

    if (checkSousPression && !u.has('sousPression') && s.decisionRapide)
      _unlock('sousPression');

    const priorityCount = (typeof etatJeu !== 'undefined' && etatJeu.priorityCount) || 10;
    if (!u.has('sansFiletTotal') && s.sosUtilises === 0 && s.affairesJouees >= priorityCount)
      _unlock('sansFiletTotal');

    if (!u.has('integriteTotale') && s.goodDecisions >= priorityCount && s.badDecisions === 0)
      _unlock('integriteTotale');

    if (!u.has('resilient') && s.streakApresEchec >= 3)
      _unlock('resilient');
  }

  // ── localStorage ────────────────────────────────────────────
  function _load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || { unlocked:[], sosCount:0 }; }
    catch(e) { return { unlocked:[], sosCount:0 }; }
  }
  function _save(d) {
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch(e) {}
  }

  // ── Déblocage ────────────────────────────────────────────────
  function _unlock(key) {
    const d = _load();
    if (d.unlocked.includes(key)) return;
    d.unlocked.push(key);
    _save(d);
    _sessionUnlocked.push(key);
    const def = DEFS[key];
    if (def) _queueNotif(def);
    // Vérifier Diamant après chaque déblocage
    if (key !== 'diamant') {
      const allOthers = Object.keys(DEFS).filter(k => k !== 'diamant');
      if (allOthers.every(k => d.unlocked.includes(k))) _unlock('diamant');
    }
  }

  // ── File de notifications (pour éviter les superpositions) ──
  function _queueNotif(def) {
    _notifQueue.push(def);
    if (!_notifBusy) _nextNotif();
  }
  function _nextNotif() {
    if (!_notifQueue.length) { _notifBusy = false; return; }
    _notifBusy = true;
    _showNotif(_notifQueue.shift());
    setTimeout(_nextNotif, CONFIG.badges.intervalleEntreToasts);
  }
  function _showNotif(def) {
    const toast = document.getElementById('badge-toast');
    if (!toast) return;
    document.getElementById('badge-toast-em').textContent    = def.em;
    document.getElementById('badge-toast-label').textContent = def.label;
    toast.classList.add('on');
    if (typeof AudioEngine !== 'undefined' && AudioEngine.sfx) AudioEngine.sfx.badgeUnlock();
    setTimeout(() => toast.classList.remove('on'), CONFIG.badges.dureeAffichageToast);
  }

  // ── Vérification des conditions ──────────────────────────────
  function check(trigger, ctx) {
    ctx = ctx || {};
    const d = _load();
    const unlocked = new Set(d.unlocked);

    // Début de chapitre
    if (trigger === 'chapterStart') {
      _sosUsedChapters.delete(ctx.chIdx);
      _chapterStartMs[ctx.chIdx] = Date.now();
      // Réinitialiser le flag decisionRapide pour ce chapitre
      if (typeof etatJeu !== 'undefined') etatJeu.decisionRapide = false;
    }

    // SOS utilisé
    if (trigger === 'sosCalled') {
      _sosUsedChapters.add(ctx.chIdx);
      d.sosCount = (d.sosCount || 0) + 1;
      _save(d);
      if (!unlocked.has('juriste') && d.sosCount >= CONFIG.badges.sosRequisPourJuriste) _unlock('juriste');
    }

    // Tous les indices d'un chapitre trouvés
    if (trigger === 'allCluesFound') {
      _allCluesChapters.add(ctx.chIdx);
    }

    // Fin de chapitre (après le choix)
    if (trigger === 'chapterEnd') {
      const i = ctx.chIdx;
      // Badge par chapitre ch0–ch5
      const chKey = 'ch' + i;
      if (i <= 5 && ctx.type === 'good' && !unlocked.has(chKey)) _unlock(chKey);
      // Sans Filet (par chapitre)
      if (!unlocked.has('sansFilet') && !_sosUsedChapters.has(i)) _unlock('sansFilet');
      // Speed Runner (< 3 min)
      if (!unlocked.has('speedRunner') && _chapterStartMs[i]) {
        const sec = (Date.now() - _chapterStartMs[i]) / 1000;
        if (sec < CONFIG.badges.dureeMaxSpeedRunner) _unlock('speedRunner');
        delete _chapterStartMs[i];
      }
      // Badges contextuels après chaque affaire (sousPression = oui)
      _checkContextuels(true);
    }

    // Fin de partie
    if (trigger === 'gameEnd') {
      if (!unlocked.has('ref') && ctx.badCount === 0) _unlock('ref');
      if (!unlocked.has('integAbs') && ctx.priChoicesAllGood) _unlock('integAbs');
      if (!unlocked.has('parcours') && ctx.chaptersPlayed >= CONFIG.badges.chapitresRequisPourParcours) _unlock('parcours');
      if (!unlocked.has('finLimier') && ctx.chaptersPlayed > 0) {
        const allFound = (ctx.chOrder || []).slice(0, ctx.chaptersPlayed)
          .every(i => _allCluesChapters.has(i));
        if (allFound) _unlock('finLimier');
      }
      // Badges contextuels à la fin du jeu (sousPression = non, flag périmé)
      _checkContextuels(false);
    }

    // Fin de quiz
    if (trigger === 'quizEnd') {
      if (!unlocked.has('juristeHerbe') && ctx.score === 10) _unlock('juristeHerbe');
    }
  }

  // ── Panel badges ─────────────────────────────────────────────
  function openPanel() {
    const d = _load();
    const unlocked = new Set(d.unlocked);
    const grid = document.getElementById('badges-grid');
    if (grid) {
      grid.innerHTML = Object.entries(DEFS).map(([key, def]) => {
        const on      = unlocked.has(key);
        const isSecret = def.secret && !on;
        return `<div class="badge-card${on ? ' unlocked' : ''}">
          <div class="badge-card-em">${isSecret ? '🔒' : def.em}</div>
          <div class="badge-card-name">${isSecret ? '???' : def.label}</div>
          <div class="badge-card-desc">${isSecret ? 'Badge secret' : def.desc}</div>
        </div>`;
      }).join('');
    }
    document.getElementById('badges-panel').classList.add('on');
  }
  function closePanel() {
    document.getElementById('badges-panel').classList.remove('on');
  }

  // ── Section écran de fin ─────────────────────────────────────
  function endScreenHTML() {
    const d = _load();
    const unlocked = new Set(d.unlocked);
    const earned  = Object.entries(DEFS).filter(([k]) => _sessionUnlocked.includes(k));
    const missing = Object.entries(DEFS).filter(([k]) => !unlocked.has(k));

    const earnedHtml = earned.length
      ? earned.map(([k,def], i) =>
          `<div class="end-badge-card unlocked" style="animation-delay:${i * 120}ms">
            <div class="end-badge-em">${def.em}</div>
            <div class="end-badge-name">${def.label}</div>
          </div>`).join('')
      : '<div class="end-badges-none">Rejoue pour décrocher ton premier badge !</div>';

    const missingHtml = missing.map(([k,def]) => {
      const isSecret = def.secret;
      return `<div class="end-badge-card locked">
        <div class="end-badge-em">${isSecret ? '🔒' : def.em}</div>
        <div class="end-badge-name">${isSecret ? '???' : def.label}</div>
        <div class="end-badge-hint">${isSecret ? 'Badge secret' : def.desc}</div>
      </div>`;
    }).join('');

    return `<div class="end-badges">
      <div class="end-badges-title">🏅 Badges</div>
      <div class="end-badges-sub">Cette session</div>
      <div class="end-badges-grid">${earnedHtml}</div>
      ${missingHtml ? `<div class="end-badges-sub end-badges-locked-lbl">À débloquer</div>
      <div class="end-badges-grid end-badges-locked">${missingHtml}</div>` : ''}
    </div>`;
  }

  // Retourne la liste des badges débloqués cette session (utilisé par SB)
  function getSessionBadges() { return _sessionUnlocked.slice(); }

  return {
    check, openPanel, closePanel, endScreenHTML, getSessionBadges,
    // Checkpoint — accès brut au store badges
    _loadRaw: _load,
    _restoreUnlocked: (list) => { const d = _load(); d.unlocked = list.slice(); _save(d); },
  };
})();
