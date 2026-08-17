// ═══════════════════════════════════════
// TRACKER — Enregistrement des stats formateur
// Toutes les données sont stockées en localStorage
// Clés : horizon_sessions (index), horizon_session_{id} (données)
// ═══════════════════════════════════════
const Tracker = (() => {
  const KEY_INDEX   = 'horizon_sessions';
  const KEY_CURRENT = 'horizon_current_session';

  let _current = null;

  function _tryGet(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch(e) { return null; }
  }
  function _trySet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
  }

  // ── Démarre une nouvelle session de jeu ──
  function init(firstName, service, chOrder, priorityCount) {
    const id = 'session_' + Date.now();
    _current = {
      id,
      startedAt: new Date().toISOString(),
      endedAt:   null,
      player:    { name: firstName || 'Anonyme', service },
      parcours:  { chOrder: chOrder.slice(), priorityCount, completedChapters: [] },
      choices:   [],
      sosUsed:   [],
      finalGauges: null,
      finalScore:  null,
      badCount:    null,
      goodCount:   null,
      result:      null,
      status:     'in_progress',
    };
    _trySet(KEY_CURRENT, _current);
  }

  // ── Enregistre un choix de chapitre ──
  function recordChoice(chapterIdx, choiceType, gauges) {
    if (!_current) return;
    _current.choices.push({ chapterIdx, choiceType, gauges, timestamp: new Date().toISOString() });
    if (!_current.parcours.completedChapters.includes(chapterIdx)) {
      _current.parcours.completedChapters.push(chapterIdx);
    }
    _sauvegarderProgres(chapterIdx);
    _trySet(KEY_CURRENT, _current);
  }

  // ── Enregistre l'utilisation du SOS Déontologue ──
  function recordSOS(chapterIdx) {
    if (!_current) return;
    // Évite les doublons si le joueur ouvre/ferme/réouvre
    const already = _current.sosUsed.some(s => s.chapterIdx === chapterIdx);
    if (!already) {
      _current.sosUsed.push({ chapterIdx, timestamp: new Date().toISOString() });
      _trySet(KEY_CURRENT, _current);
    }
  }

  // ── Finalise la session à l'écran de fin ──
  function finalize(finalGauges, badCount, goodCount, result) {
    if (!_current) return;
    _current.endedAt     = new Date().toISOString();
    _current.finalGauges = { i: finalGauges.i, p: finalGauges.p, m: finalGauges.m };
    _current.finalScore  = Math.round((finalGauges.i + finalGauges.p + finalGauges.m) / 3);
    _current.badCount    = badCount;
    _current.goodCount   = goodCount;
    _current.result      = result;  // 'certified' | 'warning' | 'failed'
    _current.status      = 'completed';

    // Sauvegarder la session dans sa propre clé
    _trySet('horizon_' + _current.id, _current);

    // Ajouter à l'index global
    const idx = _tryGet(KEY_INDEX) || [];
    if (!idx.includes(_current.id)) idx.push(_current.id);
    _trySet(KEY_INDEX, idx);

    // Nettoyer la clé temporaire
    try { localStorage.removeItem(KEY_CURRENT); } catch(e) {}
    _current = null;
  }

  // ── Marque la session comme abandonnée si la page est fermée ──
  window.addEventListener('beforeunload', () => {
    const cur = _tryGet(KEY_CURRENT);
    if (!cur || cur.status !== 'in_progress') return;
    cur.status  = 'abandoned';
    cur.endedAt = new Date().toISOString();
    _trySet('horizon_' + cur.id, cur);
    const idx = _tryGet(KEY_INDEX) || [];
    if (!idx.includes(cur.id)) idx.push(cur.id);
    _trySet(KEY_INDEX, idx);
    try { localStorage.removeItem(KEY_CURRENT); } catch(e) {}
  });

  // Indique si le SOS a été utilisé pour un chapitre donné (utilisé par SB)
  function sosUsedForChapter(chIdx) {
    if (!_current) return false;
    return _current.sosUsed.some(s => s.chapterIdx === chIdx);
  }

  // ── Persistance du progrès par joueur (affaires débloquées) ──
  function _keyProgres(nom) {
    return 'horizon_progress_' + nom.toLowerCase().replace(/\s+/g, '_');
  }

  function _sauvegarderProgres(chapterIdx) {
    if (!_current) return;
    const key  = _keyProgres(_current.player.name);
    const data = _tryGet(key) || { completedChapters: [] };
    if (!data.completedChapters.includes(chapterIdx))
      data.completedChapters.push(chapterIdx);
    _trySet(key, data);
  }

  function chargerProgres(nom) {
    const key = _keyProgres(nom);
    return (_tryGet(key) || { completedChapters: [] }).completedChapters;
  }

  return { init, recordChoice, recordSOS, finalize, sosUsedForChapter, chargerProgres };
})();
