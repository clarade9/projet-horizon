// ═══════════════════════════════════════
// TUTORIEL INTERACTIF — Étapes 1 & 2
// Affiché à la première connexion, skippable
// ═══════════════════════════════════════
const Tutorial = (() => {

  const KEY = 'horizon_tutorial_v1';
  const FORMATRICE = { css: 'c-formatrice', em: '👩‍🏫', nm: 'La Formatrice — Guide' };

  let _step = 0;
  let _fakeCluesFound = 0;
  const _isMobile = 'ontouchstart' in window || window.innerWidth <= 768;

  function isDone() {
    return localStorage.getItem(KEY) === 'done';
  }

  // ── Démarrage ────────────────────────────────────────────────
  function start() {
    etatJeu.phase = 'tutorial';

    // Affiche le HUD pour que le joueur voie les jauges
    etatJeu.gauges = { i: 100, p: 100, m: 100 };
    $('hud').classList.add('on');
    $('cdots').classList.add('on');
    $('lex-btn').classList.add('on');
    $('sound-btn').classList.add('on');
    $('badges-btn').classList.add('on');
    updateHUD();

    // Musique
    AudioEngine.startTutorialMusic();

    // Overlay + skip
    $('tuto-overlay').classList.add('on');
    $('tuto-skip').classList.add('on');

    _runStep(1);
  }

  // ── Navigation entre étapes ──────────────────────────────────
  function _runStep(n) {
    _step = n;
    _clearFakeHotspots();
    _clearFakeReflexe();
    switch (n) {
      case 1:  _step1();  break;
      case 2:  _step2b(); break;
      case 3:  _step2c(); break;
      case 4:  _step3();  break;
      default: _finish(); break;
    }
  }

  // ══════════════════════════════════════════════════════════════
  // ÉTAPE 1 — Les dialogues
  // ══════════════════════════════════════════════════════════════
  function _step1() {
    buildScene('tutorial');
    showChar('cl', null);
    showChar('cr', FORMATRICE);
    showDlg('La Formatrice',
      'Bienvenue dans <strong>Projet Horizon</strong> ! Je suis votre formatrice. Dans ce jeu, vous superviserez l\'ouverture d\'un centre de valorisation et serez confronté(e) à des situations sensibles.<br><br>Suivez ce tutoriel rapide pour maîtriser les mécaniques.',
      'cr');

    _setCallout(
      '💬 Les dialogues',
      _isMobile
        ? 'Touchez votre écran pour continuer'
        : 'Cliquez sur cette boîte ou appuyez sur <strong>Espace</strong> pour avancer dans la conversation',
      'top-left'
    );

    $('dlg').onclick = () => _runStep(2);
  }

  // ══════════════════════════════════════════════════════════════
  // ÉTAPE 2B — Le Réflexe Professionnel
  // ══════════════════════════════════════════════════════════════
  function _step2b() {
    showChar('cr', FORMATRICE);
    showDlg('La Formatrice',
      'Avant de décider, vous devez adopter la <strong>bonne posture professionnelle</strong>. Choisissez 2 questions à poser et 2 actions à déclencher. L\'impact de vos choix n\'est pas visible ici — vous le découvrirez dans le verdict.',
      'cr');
    _setCallout('⚙️ Le Réflexe Professionnel', 'Lisez, puis cliquez pour essayer', 'top-left');
    $('dlg').onclick = () => {
      hideDlg();
      _spawnFakeReflexe();
    };
  }

  let _rpSelQ = [];
  let _rpSelA = [];

  function _spawnFakeReflexe() {
    const TUTO_QUESTIONS = [
      'Ce rapport est-il destiné à être partagé ?',
      'Qui a autorisé cette transmission ?',
      'Je ne peux pas partager ce document sans autorisation.',
      'Je vais vérifier la procédure avec ma direction.',
    ];
    const TUTO_ACTIONS = [
      'Consulter la politique de confidentialité',
      'Alerter mon responsable',
      'Partager le document',
      'Documenter la demande par écrit',
    ];

    _rpSelQ = [];
    _rpSelA = [];

    const panel = document.createElement('div');
    panel.id = 'tuto-reflexe-panel';
    panel.style.cssText = `
      position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
      width:min(560px,92vw); max-height:88dvh; overflow-y:auto;
      background:#fafaf8; border:1px solid rgba(0,0,0,.1); border-radius:16px;
      box-shadow:0 24px 64px rgba(0,0,0,.45); z-index:125;
      padding:20px 20px 24px; box-sizing:border-box;
      font-family:'Nunito',sans-serif; color:#1a1a2e;
      -webkit-overflow-scrolling:touch;
    `;

    const qBtns = TUTO_QUESTIONS.map((txt, i) => `
      <button id="trq${i}" onclick="Tutorial._rpToggleQ(${i})" style="
        display:flex;align-items:flex-start;gap:9px;background:#fff;
        border:1.5px solid rgba(0,0,0,.13);border-radius:10px;
        padding:10px 13px;text-align:left;font-family:'Nunito',sans-serif;
        font-size:13px;line-height:1.45;color:#1a1a2e;cursor:pointer;
        width:100%;margin-bottom:7px;box-sizing:border-box;
        transition:background .15s,border-color .15s,color .15s;
      "><span id="trqc${i}" style="flex-shrink:0;width:14px;height:14px;border:1.5px solid rgba(0,0,0,.25);border-radius:3px;margin-top:2px;display:flex;align-items:center;justify-content:center;font-size:9px;"></span><span>${txt}</span></button>
    `).join('');

    const aBtns = TUTO_ACTIONS.map((txt, i) => `
      <button id="tra${i}" onclick="Tutorial._rpToggleA(${i})" style="
        display:flex;align-items:flex-start;gap:9px;background:#fff;
        border:1.5px solid rgba(0,0,0,.13);border-radius:10px;
        padding:10px 13px;text-align:left;font-family:'Nunito',sans-serif;
        font-size:13px;line-height:1.45;color:#1a1a2e;cursor:pointer;
        width:100%;margin-bottom:7px;box-sizing:border-box;
        transition:background .15s,border-color .15s,color .15s;
      "><span id="trac${i}" style="flex-shrink:0;width:14px;height:14px;border:1.5px solid rgba(0,0,0,.25);border-radius:3px;margin-top:2px;display:flex;align-items:center;justify-content:center;font-size:9px;"></span><span>${txt}</span></button>
    `).join('');

    panel.innerHTML = `
      <div style="text-align:center;margin-bottom:16px;">
        <div style="font-size:24px;margin-bottom:6px;">📋</div>
        <div style="font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#1a1a2e;margin-bottom:4px;">Votre réflexe professionnel</div>
        <div style="font-size:12px;color:#666;font-style:italic;line-height:1.45;">Un collègue vous propose de partager un rapport confidentiel.</div>
      </div>
      <div style="height:1px;background:rgba(0,0,0,.08);margin:12px 0;"></div>
      <div style="font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#1b2a4a;margin-bottom:3px;">💬 Ce que vous dites</div>
      <div style="font-size:12px;color:#888;margin-bottom:9px;">Choisissez 2 formulations</div>
      <div id="tuto-q-list">${qBtns}</div>
      <div style="height:1px;background:rgba(0,0,0,.08);margin:14px 0 12px;"></div>
      <div style="font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#1b2a4a;margin-bottom:3px;">⚙️ Ce que vous faites</div>
      <div style="font-size:12px;color:#888;margin-bottom:9px;">Choisissez 2 actions</div>
      <div id="tuto-a-list">${aBtns}</div>
      <button id="tuto-rp-validate" onclick="Tutorial._rpValidate()" disabled style="
        margin-top:18px;width:100%;padding:13px;
        background:#a0a8b8;border:none;border-radius:10px;
        font-family:'Nunito',sans-serif;font-size:13px;font-weight:800;
        color:#fff;cursor:not-allowed;letter-spacing:.03em;
        transition:background .2s,opacity .2s;box-sizing:border-box;
      ">Sélectionnez 2 questions et 2 actions pour continuer</button>
    `;

    // Overlay
    const overlay = document.createElement('div');
    overlay.id = 'tuto-reflexe-overlay';
    overlay.style.cssText = 'position:absolute;inset:0;background:rgba(0,0,0,.45);z-index:124;';

    $('game').appendChild(overlay);
    $('game').appendChild(panel);

    _setCallout('⚙️ Réflexe Pro', 'Sélectionnez <strong>2 questions</strong> et <strong>2 actions</strong> pour continuer', 'top-left');
  }

  function _rpToggleQ(idx) {
    const pos = _rpSelQ.indexOf(idx);
    if (pos >= 0) { _rpSelQ.splice(pos, 1); }
    else if (_rpSelQ.length < 2) { _rpSelQ.push(idx); }
    _rpUpdateItems('trq', 'trqc', _rpSelQ, 4);
    _rpCheckBtn();
  }

  function _rpToggleA(idx) {
    const pos = _rpSelA.indexOf(idx);
    if (pos >= 0) { _rpSelA.splice(pos, 1); }
    else if (_rpSelA.length < 2) { _rpSelA.push(idx); }
    _rpUpdateItems('tra', 'trac', _rpSelA, 4);
    _rpCheckBtn();
  }

  function _rpUpdateItems(btnPrefix, checkPrefix, sel, count) {
    for (let i = 0; i < count; i++) {
      const btn   = document.getElementById(btnPrefix + i);
      const check = document.getElementById(checkPrefix + i);
      if (!btn) continue;
      const isSel  = sel.includes(i);
      const isFull = sel.length >= 2 && !isSel;
      btn.style.background   = isSel ? '#1b2a4a' : '#fff';
      btn.style.borderColor  = isSel ? '#1b2a4a' : 'rgba(0,0,0,.13)';
      btn.style.color        = isSel ? '#fff'    : '#1a1a2e';
      btn.style.opacity      = isFull ? '0.35'   : '1';
      btn.style.pointerEvents = isFull ? 'none'  : '';
      if (check) {
        check.style.background   = isSel ? 'rgba(255,255,255,.25)' : '';
        check.style.borderColor  = isSel ? 'rgba(255,255,255,.5)'  : 'rgba(0,0,0,.25)';
        check.style.color        = isSel ? '#fff' : 'transparent';
        check.textContent        = isSel ? '✓'   : '';
      }
    }
  }

  function _rpCheckBtn() {
    const btn = document.getElementById('tuto-rp-validate');
    if (!btn) return;
    const ready = _rpSelQ.length >= 2 && _rpSelA.length >= 2;
    btn.disabled = !ready;
    btn.style.background    = ready ? '#1b2a4a' : '#a0a8b8';
    btn.style.cursor        = ready ? 'pointer' : 'not-allowed';
    btn.textContent         = ready ? 'Appliquer mon réflexe →' : 'Sélectionnez 2 questions et 2 actions pour continuer';
  }

  function _rpValidate() {
    if (_rpSelQ.length < 2 || _rpSelA.length < 2) return;
    _clearFakeReflexe();
    showChar('cr', FORMATRICE);
    showDlg('La Formatrice',
      '✅ Votre réflexe est enregistré. Dans le jeu, cela influencera discrètement le verdict. Passons maintenant à la <strong>décision finale</strong>.',
      'cr');
    _setCallout('⚙️ Réflexe enregistré', 'Cliquez pour continuer', 'top-left');
    $('dlg').onclick = () => _runStep(3);
  }

  function _clearFakeReflexe() {
    const p = document.getElementById('tuto-reflexe-panel');
    const o = document.getElementById('tuto-reflexe-overlay');
    if (p) p.remove();
    if (o) o.remove();
  }

  // ══════════════════════════════════════════════════════════════
  // ÉTAPE 2C — La Décision Finale
  // ══════════════════════════════════════════════════════════════
  function _step2c() {
    showChar('cr', FORMATRICE);
    showDlg('La Formatrice',
      'La pression monte. Votre interlocuteur insiste. Maintenant vous devez <strong>décider</strong>. Contrairement au réflexe pro, cette décision a des conséquences directes sur vos <strong>3 jauges</strong>.',
      'cr');
    _setCallout('⚖️ La Décision Finale', 'Cliquez pour voir les choix', 'top-left');
    $('dlg').onclick = () => {
      hideDlg();
      _spawnFakeChoices();
    };
  }

  function _spawnFakeChoices() {
    const FAKE_CHOICES = [
      { lbl: 'A', txt: 'Partager le document puisque le manager a validé oralement.' },
      { lbl: 'B', txt: 'Demander une confirmation écrite du manager avant tout partage.' },
      { lbl: 'C', txt: 'Refuser et alerter votre propre responsable de la demande.' },
    ];

    const panel = document.createElement('div');
    panel.id = 'tuto-choices-panel';
    panel.style.cssText = `
      position:absolute; bottom:calc(var(--hauteur-barre,60px) + 16px + var(--safe-bottom,0px));
      left:50%; transform:translateX(-50%);
      width:min(700px,92vw); z-index:125;
    `;

    panel.innerHTML = `
      <div style="font-family:'Space Mono',monospace;font-size:11px;font-weight:700;text-align:center;color:rgba(255,255,255,.9);margin-bottom:4px;text-transform:uppercase;letter-spacing:.18em;">⚖️ DÉCISION FINALE</div>
      <div style="font-family:'Nunito',sans-serif;font-size:12px;text-align:center;color:rgba(255,220,120,.85);background:rgba(245,158,11,.07);border:1px solid rgba(245,158,11,.2);border-left:3px solid rgba(245,158,11,.6);border-radius:0 8px 8px 0;padding:8px 12px;margin-bottom:10px;font-style:italic;">Votre collègue insiste et dit que son manager a validé.</div>
      ${FAKE_CHOICES.map((c, i) => `
        <button onclick="Tutorial._fakeChoose(${i})" style="
          display:flex;align-items:flex-start;gap:12px;
          background:rgba(10,12,22,.88);border:1.5px solid rgba(255,255,255,.1);
          border-radius:14px;padding:14px 16px;margin-bottom:8px;
          cursor:pointer;width:100%;text-align:left;color:white;
          font-family:'Nunito',sans-serif;font-size:14px;line-height:1.5;
          backdrop-filter:blur(8px);box-sizing:border-box;
          transition:border-color .2s,transform .2s;
        " onmouseover="this.style.borderColor='rgba(255,255,255,.4)';this.style.transform='translateX(6px)'"
           onmouseout="this.style.borderColor='rgba(255,255,255,.1)';this.style.transform=''">
          <div style="width:30px;height:30px;min-width:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Space Mono',monospace;font-size:12px;font-weight:700;background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.2);color:rgba(255,255,255,.7);margin-top:1px;">${c.lbl}</div>
          <div>${c.txt}</div>
        </button>
      `).join('')}
    `;

    $('game').appendChild(panel);

    _setCallout('⚖️ La Décision', 'Cliquez sur un choix — peu importe lequel pour cette démonstration', 'top-left');
  }

  function _fakeChoose(idx) {
    const panel = document.getElementById('tuto-choices-panel');
    if (panel) panel.remove();

    // Anime brièvement les jauges
    const delta = idx === 0 ? -8 : idx === 1 ? 0 : +6;
    const prev = { ...etatJeu.gauges };
    if (typeof applyGauges === 'function') applyGauges({ i: delta, p: delta * 0.5 | 0, m: delta * 0.7 | 0 });
    setTimeout(() => {
      etatJeu.gauges = prev;
      if (typeof updateHUD === 'function') updateHUD();
    }, 1200);

    showChar('cr', FORMATRICE);
    showDlg('La Formatrice',
      'Chaque décision fait évoluer vos jauges. Dans le jeu, choisissez avec <strong>discernement</strong> — certains choix ont des conséquences lourdes.',
      'cr');
    _setCallout('⚖️ Décision enregistrée', 'Cliquez pour continuer', 'top-left');
    $('dlg').onclick = () => _runStep(4);
  }

  // ══════════════════════════════════════════════════════════════
  // ÉTAPE 3 — Les jauges, le SOS et les choix
  // ══════════════════════════════════════════════════════════════
  function _step3() {
    showChar('cr', FORMATRICE);
    showDlg('La Formatrice',
      'En haut à droite, trois <strong>jauges</strong> mesurent vos résultats en temps réel : <em>Intégrité</em>, <em>Performance Projet</em> et <em>Image SEM</em>. Chaque décision les fait évoluer — parfois dans la mauvaise direction.',
      'cr');
    _setCallout('📊 Les jauges', 'Surveillez ces indicateurs tout au long de votre mission', 'top-left');
    $('dlg').onclick = () => _step3sos();
  }

  // Étape SOS — démonstration interactive du bouton SOS Déontologue
  function _step3sos() {
    showDlg('La Formatrice',
      'Avant de choisir, vous pouvez consulter le <strong>SOS Déontologue</strong> — un avis juridique gratuit, disponible à tout moment. Il ne pénalise jamais vos jauges.',
      'cr');

    const sosBtn = $('sos-btn');
    if (sosBtn) {
      sosBtn.style.display = 'flex';
      sosBtn.classList.add('tuto-highlight');
    }

    const instrSOS = _isMobile
      ? 'Touchez le bouton <strong>SOS</strong> ci-dessous pour l\'essayer'
      : 'Cliquez sur le bouton <strong>SOS Déontologue</strong> en bas, ou avancez dans le dialogue';
    _setCallout('🆘 SOS Déontologue', instrSOS, 'bottom-left');

    const _avancerDepuisSOS = () => {
      if (sosBtn) { sosBtn.classList.remove('tuto-highlight'); sosBtn.style.display = ''; }
      _step3b();
    };

    if (sosBtn) {
      sosBtn.addEventListener('click',    _avancerDepuisSOS, { once: true });
      sosBtn.addEventListener('touchend', (e) => { e.preventDefault(); _avancerDepuisSOS(); }, { once: true, passive: false });
    }

    $('dlg').onclick = _avancerDepuisSOS;
  }

  function _step3b() {
    showDlg('La Formatrice',
      'Pour chaque situation, <strong>trois options</strong> vous seront proposées dans un ordre aléatoire. Il n\'y a pas toujours de réponse évidente — c\'est là que se jouent les vraies décisions éthiques.',
      'cr');
    _setCallout('⚖ Les choix', _isMobile ? 'Touchez pour commencer votre mission' : 'Cliquez pour commencer votre mission', 'top-left');
    $('dlg').onclick = () => _finish();
  }

  // ── Helpers ──────────────────────────────────────────────────
  function _setCallout(title, text, pos) {
    $('tuto-callout-title').textContent = title;
    $('tuto-callout-text').innerHTML    = text;
    const el = $('tuto-callout');
    el.className = 'tuto-callout on tuto-pos-' + pos;
  }

  function _clearFakeHotspots() {
    document.querySelectorAll('.tuto-hs').forEach(el => el.remove());
    const clue = $('clue-pop');
    if (clue) clue.classList.remove('on');
  }

  // ── Fin du tutoriel ──────────────────────────────────────────
  function skip() { _finish(); }

  function _finish() {
    localStorage.setItem(KEY, 'done');

    // Nettoyage UI
    $('tuto-overlay').classList.remove('on');
    $('tuto-skip').classList.remove('on');
    $('tuto-callout').classList.remove('on');
    _clearFakeHotspots();

    // Reset dialogue
    $('dlg').onclick = null;
    hideDlg();
    showChar('cl', null);
    showChar('cr', null);

    // Crossfade musical + lancement du jeu
    AudioEngine.crossfadeToMain();
    setTimeout(() => {
      etatJeu.phase  = 'intro'; // reset propre avant _beginGame
      etatJeu.gauges = { i: 70, p: 70, m: 70 }; // remet les jauges aux valeurs de départ
      updateHUD();
      _beginGame();
    }, CONFIG.transitions.delaiApresTutoriel);
  }

  return { start, skip, isDone, _rpToggleQ, _rpToggleA, _rpValidate, _fakeChoose };
})();
