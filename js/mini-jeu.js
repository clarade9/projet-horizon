// ═══════════════════════════════════════════════════════════════
// MINI-JEU DE DÉFINITIONS
// Interlude après les affaires 3, 6 et 9
// ═══════════════════════════════════════════════════════════════

(function() {

  // ── État du mini-jeu ────────────────────────────────────────
  let _mj = {
    data:        null,   // données MINI_JEUX[ch]
    score:       400,
    matched:     0,      // paires trouvées
    total:       0,      // total paires
    selTerme:    null,   // index du terme sélectionné (ou null)
    selDef:      null,   // index de la def sélectionnée (ou null)
    locked:      false,  // pendant animation d'erreur
    onComplete:  null,
    defOrder:    [],     // indices mélangés des définitions
  };

  // ── Point d'entrée ──────────────────────────────────────────
  function startMiniJeu(ch, onComplete) {
    const data = (typeof MINI_JEUX !== 'undefined') ? MINI_JEUX[ch] : null;
    if (!data) { onComplete(); return; }

    _mj.data       = data;
    _mj.score      = data.paires.length * 100;
    _mj.matched    = 0;
    _mj.total      = data.paires.length;
    _mj.selTerme   = null;
    _mj.selDef     = null;
    _mj.locked     = false;
    _mj.onComplete = onComplete;
    _mj.defOrder   = _shuffle(data.paires.map((_, i) => i));

    // Initialiser le score dans etatJeu
    if (typeof etatJeu !== 'undefined') {
      if (!etatJeu.miniJeuScores) etatJeu.miniJeuScores = {};
      etatJeu.miniJeuScores[ch] = 0; // sera mis à jour à la fin
    }

    _buildPanel();
  }

  // ── Construction du panneau ─────────────────────────────────
  function _buildPanel() {
    // Supprimer un éventuel panneau existant
    const existing = document.getElementById('mj-overlay');
    if (existing) existing.remove();

    const d = _mj.data;
    const termesHtml = d.paires.map((p, i) => `
      <button class="mj-item mj-terme" id="mj-t-${i}" onclick="MiniJeu._clickTerme(${i})">
        ${_esc(p.terme)}
      </button>`).join('');

    const defsHtml = _mj.defOrder.map((origIdx, displayIdx) => `
      <button class="mj-item mj-def" id="mj-d-${displayIdx}" onclick="MiniJeu._clickDef(${displayIdx})">
        ${_esc(d.paires[origIdx].definition)}
      </button>`).join('');

    const overlay = document.createElement('div');
    overlay.id = 'mj-overlay';
    overlay.innerHTML = `
      <div class="mj-panel">
        <div class="mj-header">
          <div class="mj-header-text">
            <div class="mj-eyebrow">Interlude — Quiz des définitions</div>
            <div class="mj-titre">${_esc(d.titre)}</div>
            <div class="mj-intro">${_esc(d.intro)}</div>
          </div>
          <div class="mj-score-wrap">
            <div class="mj-score-label">Score</div>
            <div class="mj-score-val" id="mj-score">${_mj.score}</div>
          </div>
        </div>
        <div class="mj-columns">
          <div class="mj-col mj-col-termes">
            <div class="mj-col-title">Infractions</div>
            <div class="mj-items" id="mj-termes">${termesHtml}</div>
          </div>
          <div class="mj-col mj-col-defs">
            <div class="mj-col-title">Définitions juridiques</div>
            <div class="mj-items" id="mj-defs">${defsHtml}</div>
          </div>
        </div>
        <div class="mj-footer" id="mj-footer" style="display:none">
          <div class="mj-result-score" id="mj-result-score"></div>
          <div class="mj-result-phrase" id="mj-result-phrase"></div>
          <button class="mj-btn" onclick="MiniJeu._continuer()">Continuer →</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);
    // Forcer un reflow pour déclencher la transition d'entrée
    requestAnimationFrame(() => overlay.classList.add('on'));
  }

  // ── Clic sur un terme ───────────────────────────────────────
  function _clickTerme(idx) {
    if (_mj.locked) return;
    const el = document.getElementById('mj-t-' + idx);
    if (!el || el.classList.contains('mj-matched')) return;

    // Désélectionner l'ancien terme si différent
    if (_mj.selTerme !== null && _mj.selTerme !== idx) {
      const prev = document.getElementById('mj-t-' + _mj.selTerme);
      if (prev) prev.classList.remove('mj-selected');
    }

    if (_mj.selTerme === idx) {
      // Toggle off
      el.classList.remove('mj-selected');
      _mj.selTerme = null;
    } else {
      el.classList.add('mj-selected');
      _mj.selTerme = idx;
    }

    if (_mj.selTerme !== null && _mj.selDef !== null) _evaluer();
  }

  // ── Clic sur une définition ─────────────────────────────────
  function _clickDef(displayIdx) {
    if (_mj.locked) return;
    const el = document.getElementById('mj-d-' + displayIdx);
    if (!el || el.classList.contains('mj-matched')) return;

    // Désélectionner l'ancienne def si différente
    if (_mj.selDef !== null && _mj.selDef !== displayIdx) {
      const prev = document.getElementById('mj-d-' + _mj.selDef);
      if (prev) prev.classList.remove('mj-selected');
    }

    if (_mj.selDef === displayIdx) {
      // Toggle off
      el.classList.remove('mj-selected');
      _mj.selDef = null;
    } else {
      el.classList.add('mj-selected');
      _mj.selDef = displayIdx;
    }

    if (_mj.selTerme !== null && _mj.selDef !== null) _evaluer();
  }

  // ── Évaluation de la paire ──────────────────────────────────
  function _evaluer() {
    _mj.locked = true;
    const tIdx = _mj.selTerme;                   // index dans paires[]
    const dDisp = _mj.selDef;                    // index d'affichage
    const dOrig = _mj.defOrder[dDisp];           // index original dans paires[]

    const elT = document.getElementById('mj-t-' + tIdx);
    const elD = document.getElementById('mj-d-' + dDisp);

    if (tIdx === dOrig) {
      // Correct
      elT.classList.remove('mj-selected');
      elD.classList.remove('mj-selected');
      elT.classList.add('mj-matched');
      elD.classList.add('mj-matched');
      elT.disabled = true;
      elD.disabled = true;

      _mj.matched++;
      _mj.selTerme = null;
      _mj.selDef   = null;
      _mj.locked   = false;

      if (_mj.matched === _mj.total) {
        setTimeout(_showResult, 400);
      }
    } else {
      // Incorrect
      _mj.score = Math.max(0, _mj.score - 20);
      _updateScore();

      elT.classList.add('mj-shake');
      elD.classList.add('mj-shake');

      setTimeout(() => {
        elT.classList.remove('mj-shake', 'mj-selected');
        elD.classList.remove('mj-shake', 'mj-selected');
        _mj.selTerme = null;
        _mj.selDef   = null;
        _mj.locked   = false;
      }, 350);
    }
  }

  // ── Mise à jour du score affiché ────────────────────────────
  function _updateScore() {
    const el = document.getElementById('mj-score');
    if (el) el.textContent = _mj.score;
  }

  // ── Affichage du résultat final ─────────────────────────────
  function _showResult() {
    const max      = _mj.total * 100;
    // Bonus si score intact (aucune erreur)
    const isParfait = _mj.score === max;
    const score    = isParfait ? max + 200 : _mj.score;
    const pct      = Math.round((_mj.score / max) * 100);

    let phrase;
    if (isParfait)      phrase = "Parfait ! Aucune erreur — toutes les définitions maîtrisées.";
    else if (pct >= 75) phrase = "Très bon résultat ! Quelques hésitations mais l'essentiel est acquis.";
    else if (pct >= 50) phrase = "Correct. Relisez le lexique pour consolider ces notions.";
    else                phrase = "Ces définitions méritent d'être retravaillées. Le lexique est disponible en bas à gauche.";

    const color    = pct >= 75 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#ef4444';
    const rappel   = (_mj.data && _mj.data.rappelPedago) || '';
    const bonusHtml = isParfait ? `<div class="mj-result-bonus">+200 pts bonus — sans erreur !</div>` : '';
    const assocTxt  = `${_mj.total}/${_mj.total} associations correctes`;

    const scoreEl  = document.getElementById('mj-result-score');
    const phraseEl = document.getElementById('mj-result-phrase');
    const footer   = document.getElementById('mj-footer');

    if (scoreEl)  scoreEl.innerHTML  = `
      <div class="mj-result-title">Bien jou\u00e9 !</div>
      <div class="mj-result-assoc">${assocTxt}</div>
      <div style="color:${color};font-size:26px;font-weight:900">+${score} pts</div>
      ${bonusHtml}`;
    if (phraseEl && rappel) phraseEl.textContent = rappel;
    else if (phraseEl) phraseEl.textContent = phrase;
    if (footer)   footer.style.display = '';

    // Sauvegarder dans etatJeu (score final avec bonus)
    if (typeof etatJeu !== 'undefined') {
      if (!etatJeu.miniJeuScores) etatJeu.miniJeuScores = {};
      const ch = _findCh();
      if (ch !== null) etatJeu.miniJeuScores[ch] = score;
    }
  }

  // Retrouve la clé ch dans MINI_JEUX pour les données courantes
  function _findCh() {
    if (typeof MINI_JEUX === 'undefined') return null;
    for (const key of Object.keys(MINI_JEUX)) {
      if (MINI_JEUX[key] === _mj.data) return parseInt(key, 10);
    }
    return null;
  }

  // ── Continuer après le mini-jeu ─────────────────────────────
  function _continuer() {
    const overlay = document.getElementById('mj-overlay');
    if (overlay) {
      overlay.classList.remove('on');
      setTimeout(() => { overlay.remove(); }, 400);
    }
    if (_mj.onComplete) _mj.onComplete();
  }

  // ── Utilitaires ─────────────────────────────────────────────
  function _shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── API publique ─────────────────────────────────────────────
  window.startMiniJeu = startMiniJeu;
  window.MiniJeu = {
    _clickTerme,
    _clickDef,
    _continuer,
  };

})();
