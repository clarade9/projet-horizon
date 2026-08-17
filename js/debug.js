// ═══════════════════════════════════════════════════════════════
// PANNEAU DEBUG — Outil développeur uniquement
// Chargé dynamiquement via ?debug dans l'URL ou Ctrl+Shift+D
// N'a aucun effet en production (n'est jamais inclus dans index.html)
// ═══════════════════════════════════════════════════════════════

const DebugPanel = (() => {

  let _open          = false;
  let _selCh         = 0;       // chapitre sélectionné pour la navigation par phase
  let _stateTimer    = null;

  // ── Styles injectés ──────────────────────────────────────────
  function _injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* Bandeau */
      #dbg-banner {
        position:fixed; top:0; left:0; right:0; height:24px;
        background: repeating-linear-gradient(
          -45deg, #7c2d00 0 6px, #9a3800 6px 12px
        );
        z-index:9998; display:flex; align-items:center;
        justify-content:center; gap:8px; pointer-events:none;
        font-family:monospace; font-size:10px; font-weight:700;
        color:#fed7aa; letter-spacing:.18em; text-transform:uppercase;
      }

      /* Onglet latéral */
      #dbg-tab {
        position:fixed; right:0; top:50%; transform:translateY(-50%);
        z-index:9999; background:#ea580c; color:white;
        font-family:monospace; font-size:10px; font-weight:700;
        writing-mode:vertical-rl; text-orientation:mixed;
        padding:12px 4px; cursor:pointer; border-radius:6px 0 0 6px;
        letter-spacing:.12em; user-select:none;
        box-shadow:-4px 0 12px rgba(0,0,0,.4);
        transition:background .15s;
      }
      #dbg-tab:hover { background:#c2410c; }
      #dbg-tab.hidden { display:none; }

      /* Panneau principal */
      #dbg-panel {
        position:fixed; top:24px; right:-340px; bottom:0;
        width:320px; z-index:9999;
        background:rgba(10,8,6,.97);
        border-left:2px solid #ea580c;
        overflow-y:auto; overflow-x:hidden;
        transition:right .3s cubic-bezier(.4,0,.2,1);
        font-family:monospace; font-size:11px; color:#fed7aa;
        padding:0 0 40px;
      }
      #dbg-panel.open { right:0; }

      /* Header du panneau */
      #dbg-panel-hdr {
        position:sticky; top:0; background:rgba(10,8,6,.99);
        border-bottom:1px solid #9a3800;
        padding:8px 12px; display:flex;
        align-items:center; justify-content:space-between;
        z-index:1;
      }
      #dbg-panel-hdr span { color:#fb923c; font-weight:700; font-size:12px; }
      #dbg-close {
        background:none; border:1px solid #7c2d00; border-radius:4px;
        color:#fb923c; cursor:pointer; font-family:monospace;
        font-size:11px; padding:2px 8px;
      }
      #dbg-close:hover { background:#7c2d00; }

      /* Sections repliables */
      .dbg-section {
        border-bottom:1px solid #431407;
      }
      .dbg-section summary {
        padding:7px 12px; cursor:pointer;
        color:#fb923c; font-weight:700; font-size:11px;
        letter-spacing:.08em; text-transform:uppercase;
        list-style:none; user-select:none;
        display:flex; align-items:center; gap:6px;
      }
      .dbg-section summary:hover { background:rgba(234,88,12,.08); }
      .dbg-section summary::before { content:'▶'; font-size:8px; transition:transform .15s; }
      .dbg-section[open] summary::before { transform:rotate(90deg); }
      .dbg-body { padding:8px 12px 12px; }

      /* Boutons debug */
      .dbg-btn {
        background:rgba(234,88,12,.15); border:1px solid #7c2d00;
        color:#fed7aa; font-family:monospace; font-size:10px;
        padding:4px 8px; border-radius:4px; cursor:pointer;
        transition:all .15s; white-space:nowrap;
      }
      .dbg-btn:hover { background:rgba(234,88,12,.35); border-color:#ea580c; color:white; }
      .dbg-btn.dbg-btn-good  { border-color:#15803d; color:#86efac; background:rgba(21,128,61,.15); }
      .dbg-btn.dbg-btn-good:hover  { background:rgba(21,128,61,.3); }
      .dbg-btn.dbg-btn-warn  { border-color:#b45309; color:#fde68a; background:rgba(180,83,9,.15); }
      .dbg-btn.dbg-btn-warn:hover  { background:rgba(180,83,9,.3); }
      .dbg-btn.dbg-btn-bad   { border-color:#b91c1c; color:#fca5a5; background:rgba(185,28,28,.15); }
      .dbg-btn.dbg-btn-bad:hover   { background:rgba(185,28,28,.3); }
      .dbg-btn.dbg-btn-sel   { background:rgba(234,88,12,.45); border-color:#ea580c; color:white; }

      /* Grille de boutons */
      .dbg-grid { display:flex; flex-wrap:wrap; gap:4px; }
      .dbg-row  { display:flex; flex-wrap:wrap; gap:4px; margin-bottom:4px; }
      .dbg-label { color:#a16207; font-size:9px; letter-spacing:.1em; text-transform:uppercase; margin:6px 0 3px; display:block; }

      /* Curseurs */
      .dbg-slider-row { display:flex; align-items:center; gap:6px; margin-bottom:4px; }
      .dbg-slider-row label { width:72px; font-size:10px; color:#a16207; flex-shrink:0; }
      .dbg-slider-row input[type=range] {
        flex:1; accent-color:#ea580c; cursor:pointer;
        height:3px;
      }
      .dbg-slider-val { width:26px; text-align:right; color:#fed7aa; font-size:10px; }

      /* Zone état */
      #dbg-state-box {
        background:#0a0800; border:1px solid #431407;
        border-radius:4px; padding:8px; font-size:9px;
        color:#a16207; line-height:1.5; max-height:180px;
        overflow-y:auto; white-space:pre; word-break:break-all;
      }
      #dbg-state-box span { color:#fed7aa; }

      /* Zone localStorage */
      #dbg-ls-box {
        background:#0a0800; border:1px solid #431407;
        border-radius:4px; padding:8px; font-size:9px;
        color:#a16207; line-height:1.5; max-height:220px;
        overflow-y:auto; white-space:pre-wrap; word-break:break-all;
        margin-top:6px; display:none;
      }
      #dbg-ls-box.on { display:block; }
    `;
    document.head.appendChild(style);
  }

  // ── Création du DOM ──────────────────────────────────────────
  function _createBanner() {
    const b = document.createElement('div');
    b.id = 'dbg-banner';
    b.innerHTML = '🛠 MODE TEST ACTIF — debug.js chargé 🛠';
    document.body.appendChild(b);
    // Décale le contenu existant
    document.body.style.marginTop = '24px';
  }

  function _createPanel() {
    // Onglet latéral
    const tab = document.createElement('button');
    tab.id = 'dbg-tab';
    tab.textContent = '🛠 DEBUG';
    tab.onclick = toggle;
    document.body.appendChild(tab);

    // Panneau
    const panel = document.createElement('div');
    panel.id = 'dbg-panel';
    panel.innerHTML = `
      <div id="dbg-panel-hdr">
        <span>🛠 DEBUG PANEL</span>
        <button id="dbg-close" onclick="DebugPanel.toggle()">✕ Fermer</button>
      </div>

      <!-- ── 1. NAVIGATION ── -->
      <details class="dbg-section" open>
        <summary>🗺 Navigation rapide</summary>
        <div class="dbg-body">
          <span class="dbg-label">Chapitre cible</span>
          <div class="dbg-grid" id="dbg-ch-btns"></div>
          <span class="dbg-label">Phase (chapitre sélectionné ci-dessus)</span>
          <div class="dbg-row">
            <button class="dbg-btn" onclick="DebugPanel.goPhase('context')">Contexte</button>
            <button class="dbg-btn" onclick="DebugPanel.goPhase('dialogue')">Dialogue</button>
            <button class="dbg-btn" onclick="DebugPanel.goPhase('investigation')">Investigation</button>
          </div>
          <div class="dbg-row">
            <button class="dbg-btn" onclick="DebugPanel.goPhase('choice')">Choix</button>
            <button class="dbg-btn" onclick="DebugPanel.goPhase('verdict')">Verdict</button>
          </div>
          <span class="dbg-label">Fin de partie</span>
          <div class="dbg-row">
            <button class="dbg-btn" onclick="DebugPanel.goEpilogue()">Épilogue</button>
            <button class="dbg-btn" onclick="DebugPanel.goEnd()">Écran de fin</button>
          </div>
        </div>
      </details>

      <!-- ── 2. SCORES ── -->
      <details class="dbg-section">
        <summary>🎯 Simulation scores</summary>
        <div class="dbg-body">
          <span class="dbg-label">Forcer un résultat final</span>
          <div class="dbg-row">
            <button class="dbg-btn dbg-btn-good" onclick="DebugPanel.simulateEnd('good')">✅ Bon</button>
            <button class="dbg-btn dbg-btn-warn" onclick="DebugPanel.simulateEnd('warn')">⚠️ Moyen</button>
            <button class="dbg-btn dbg-btn-bad"  onclick="DebugPanel.simulateEnd('bad')">❌ Mauvais</button>
          </div>
          <span class="dbg-label">Jauges manuelles</span>
          <div class="dbg-slider-row">
            <label>⚖️ Intégrité</label>
            <input type="range" id="dbg-gi" min="0" max="100" value="100"
              oninput="document.getElementById('dbg-gi-v').textContent=this.value">
            <span class="dbg-slider-val" id="dbg-gi-v">100</span>
          </div>
          <div class="dbg-slider-row">
            <label>📈 Projet</label>
            <input type="range" id="dbg-gp" min="0" max="100" value="100"
              oninput="document.getElementById('dbg-gp-v').textContent=this.value">
            <span class="dbg-slider-val" id="dbg-gp-v">100</span>
          </div>
          <div class="dbg-slider-row">
            <label>🏛️ Image SEM</label>
            <input type="range" id="dbg-gm" min="0" max="100" value="100"
              oninput="document.getElementById('dbg-gm-v').textContent=this.value">
            <span class="dbg-slider-val" id="dbg-gm-v">100</span>
          </div>
          <button class="dbg-btn" style="margin-top:4px" onclick="DebugPanel.applySliderGauges()">Appliquer les jauges →</button>
        </div>
      </details>

      <!-- ── 3. PROFIL ── -->
      <details class="dbg-section">
        <summary>👤 Profil rapide</summary>
        <div class="dbg-body">
          <span class="dbg-label">Démarrer en tant que service</span>
          <div class="dbg-grid" id="dbg-svc-btns"></div>
          <span class="dbg-label">Remplissage auto</span>
          <button class="dbg-btn" onclick="DebugPanel.autoFill()">✏️ Remplir formulaire (Test Dev)</button>
        </div>
      </details>

      <!-- ── 4. ÉTAT ── -->
      <details class="dbg-section">
        <summary>📊 État en temps réel</summary>
        <div class="dbg-body">
          <div id="dbg-state-box">En attente…</div>
        </div>
      </details>

      <!-- ── 5. AUDIO ── -->
      <details class="dbg-section">
        <summary>🔊 Audio</summary>
        <div class="dbg-body">
          <span class="dbg-label">Musiques de scène</span>
          <div class="dbg-grid">
            <button class="dbg-btn" onclick="DebugPanel.playTrack('prologue')">Prologue</button>
            <button class="dbg-btn" onclick="DebugPanel.playTrack('rh')">RH</button>
            <button class="dbg-btn" onclick="DebugPanel.playTrack('resto')">Resto</button>
            <button class="dbg-btn" onclick="DebugPanel.playTrack('pesee')">Pesée</button>
            <button class="dbg-btn" onclick="DebugPanel.playTrack('indus')">Indus</button>
            <button class="dbg-btn" onclick="DebugPanel.playTrack('epilogue')">Épilogue</button>
            <button class="dbg-btn" onclick="DebugPanel.playTrack('tutorial')">Tutoriel</button>
          </div>
          <span class="dbg-label">Effets sonores</span>
          <div class="dbg-row">
            <button class="dbg-btn" onclick="AudioEngine.sfx.dialogueClick()">Click dialogue</button>
            <button class="dbg-btn" onclick="AudioEngine.sfx.typeKey()">Frappe clavier</button>
            <button class="dbg-btn" onclick="AudioEngine.sfx.badgeUnlock()">Badge unlock</button>
          </div>
          <span class="dbg-label">Volume global</span>
          <div class="dbg-slider-row">
            <label>Volume</label>
            <input type="range" id="dbg-vol" min="0" max="100" value="100"
              oninput="document.getElementById('dbg-vol-v').textContent=this.value+'%'">
            <span class="dbg-slider-val" id="dbg-vol-v">100%</span>
          </div>
        </div>
      </details>

      <!-- ── 6. LOCALSTORAGE ── -->
      <details class="dbg-section">
        <summary>💾 LocalStorage</summary>
        <div class="dbg-body">
          <div class="dbg-row">
            <button class="dbg-btn dbg-btn-bad" onclick="DebugPanel.clearLS()">🗑️ Vider tout</button>
            <button class="dbg-btn" onclick="DebugPanel.showLS()">👁️ Afficher</button>
            <button class="dbg-btn dbg-btn-good" onclick="DebugPanel.fakePlayers()">👥 Faux joueurs</button>
          </div>
          <div id="dbg-ls-box"></div>
        </div>
      </details>
    `;
    document.body.appendChild(panel);

    // Génère les boutons de chapitres
    const chGrid = document.getElementById('dbg-ch-btns');
    CHAPTERS.forEach((ch, i) => {
      const btn = document.createElement('button');
      btn.className = 'dbg-btn' + (i === 0 ? ' dbg-btn-sel' : '');
      btn.dataset.chIdx = i;
      btn.title = ch.name;
      btn.textContent = `Ch${i} — ${ch.sub}`;
      btn.onclick = () => _selectChapter(i);
      chGrid.appendChild(btn);
    });

    // Génère les boutons de services
    const svcGrid = document.getElementById('dbg-svc-btns');
    SERVICES.forEach(svc => {
      const btn = document.createElement('button');
      btn.className = 'dbg-btn';
      btn.title = svc.label;
      btn.textContent = `${svc.em} ${svc.id}`;
      btn.onclick = () => _quickStartAs(svc.id);
      svcGrid.appendChild(btn);
    });
  }

  // ── Sélection de chapitre ────────────────────────────────────
  function _selectChapter(idx) {
    _selCh = idx;
    document.querySelectorAll('#dbg-ch-btns .dbg-btn').forEach((btn, i) => {
      btn.classList.toggle('dbg-btn-sel', i === idx);
    });
  }

  // ── Préparation de l'environnement de jeu ───────────────────
  function _setupGame(chIdx) {
    // Init audio si nécessaire
    AudioEngine.onUserGesture();

    // Cache les écrans d'intro / sélection
    ['intro', 'service-select', 'map-select', 'parcours', 'intermediate'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.style.display = 'none'; el.classList.remove('on', 'out'); }
    });
    document.getElementById('end').classList.remove('on');

    // Initialise etatJeu
    etatJeu.ch           = chIdx;
    etatJeu.dlgIdx       = 0;
    etatJeu.invFound     = 0;
    etatJeu.chOrder      = [0, 1, 2, 3, 4, 5, 6];
    etatJeu.priorityCount = 7;
    etatJeu.chPos        = chIdx;
    if (!etatJeu.playerFirst) etatJeu.playerFirst = 'Dev';

    // Active le HUD
    ['hud', 'cdots', 'lex-btn', 'sound-btn', 'badges-btn'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('on');
    });

    updateHUD();
    updateDots();
    hideAll();

    // Construit la scène
    const chapitre = CHAPTERS[chIdx];
    buildScene(chapitre.sc);
  }

  // ── Navigation par phase ─────────────────────────────────────
  function goPhase(phase) {
    const ch = CHAPTERS[_selCh];
    _setupGame(_selCh);

    switch (phase) {
      case 'context':
        showContext(ch);
        break;

      case 'dialogue':
        etatJeu.phase    = 'dialogue';
        etatJeu.dlgIdx   = 0;
        document.getElementById('dlg').onclick = advDialogue;
        showDialogueLine();
        break;

      case 'investigation':
        startInvestigation();
        break;

      case 'choice':
        showChoicePanel();
        break;

      case 'verdict':
        _showFakeVerdict(_selCh);
        break;
    }
  }

  // Affiche le verdict du choix "good" sans modifier les jauges
  function _showFakeVerdict(chIdx) {
    const ch = CHAPTERS[chIdx];
    const choix = ch.choices.find(c => c.type === 'good') || ch.choices[0];
    if (!choix) return;

    etatJeu.phase = 'verdict';
    document.getElementById('choices').classList.add('hidden');

    const pills = [
      { l: 'Intégrité', v: choix.gauges.i },
      { l: 'Projet',    v: choix.gauges.p },
      { l: 'Image SEM', v: choix.gauges.m },
    ].map(x => {
      const s = x.v > 0 ? '+' : '';
      const c = x.v > 0 ? 'up' : x.v < 0 ? 'dn' : 'nt';
      return `<div class="pill">${x.l} <span class="${c}">${s}${x.v}</span></div>`;
    }).join('');

    document.getElementById('vd-inner').innerHTML = `
      <div class="vd-badge ${choix.bc}">${choix.badge} <small style="opacity:.5;font-size:9px">(debug — sans impact jauges)</small></div>
      <div class="vd-title">${choix.vTitle}</div>
      <div class="vd-consequence">${choix.vConsequence}</div>
      <div class="vd-legal ${choix.lc}">
        <div class="vd-legal-lbl">⚖ Analyse juridique</div>
        <div class="vd-legal-text">${choix.vLegal}</div>
      </div>
      <div class="vd-pills">${pills}</div>
      <button class="vd-btn" onclick="showRecap()">Ce qu'il faut retenir →</button>`;
    document.getElementById('verdict').classList.add('on');
  }

  function goEpilogue() {
    _setupGame(CHAPTERS.length - 1);
    // S'assure qu'il y a des choix enregistrés
    if (!etatJeu.choices.length) etatJeu.choices = ['good', 'warn', 'good', 'good'];
    runEpilogue();
  }

  function goEnd() {
    AudioEngine.onUserGesture();
    ['intro', 'service-select', 'map-select', 'parcours', 'intermediate'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.style.display = 'none'; el.classList.remove('on', 'out'); }
    });
    hideAll();
    if (!etatJeu.choices.length) etatJeu.choices = ['good', 'warn', 'good', 'good'];
    showEnd();
  }

  // ── Simulation de scores ─────────────────────────────────────
  function simulateEnd(type) {
    AudioEngine.onUserGesture();
    ['intro', 'service-select', 'map-select', 'parcours', 'intermediate'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.style.display = 'none'; el.classList.remove('on', 'out'); }
    });
    hideAll();

    const presets = {
      good: { choices: ['good','good','good','good'], gauges: { i:88, p:85, m:82 } },
      warn: { choices: ['good','bad','warn','good'],  gauges: { i:65, p:60, m:55 } },
      bad:  { choices: ['bad','bad','warn','bad'],    gauges: { i:32, p:40, m:28 } },
    };
    const p = presets[type];
    etatJeu.choices = p.choices;
    etatJeu.gauges  = { ...p.gauges };
    updateHUD();
    showEnd();
  }

  function applySliderGauges() {
    etatJeu.gauges.i = parseInt(document.getElementById('dbg-gi').value);
    etatJeu.gauges.p = parseInt(document.getElementById('dbg-gp').value);
    etatJeu.gauges.m = parseInt(document.getElementById('dbg-gm').value);
    updateHUD();
  }

  // ── Démarrage rapide avec un service ─────────────────────────
  function _quickStartAs(serviceId) {
    const svc = SERVICES.find(s => s.id === serviceId);
    if (!svc) return;

    AudioEngine.onUserGesture();
    ['intro', 'service-select', 'parcours'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.style.display = 'none'; el.classList.remove('on', 'out'); }
    });

    etatJeu.chOrder       = buildChapterOrder(svc);
    etatJeu.priorityCount = svc.priority ? svc.priority.length : 7;
    etatJeu.chPos         = 0;
    etatJeu.playerFirst   = 'Dev';
    etatJeu.playerLast    = svc.label;

    _demarrerJeu();
  }

  function autoFill() {
    // Tente de remplir le champ nom et sélectionner un service
    const inputPrenom = document.getElementById('player-firstname');
    const inputNom    = document.getElementById('player-lastname');
    if (inputPrenom) { inputPrenom.value = 'Dev'; inputPrenom.dispatchEvent(new Event('input')); }
    if (inputNom)    { inputNom.value = 'Test';   inputNom.dispatchEvent(new Event('input')); }
    // Sélectionne le premier service
    const firstSvc = SERVICES[0];
    if (firstSvc && typeof selectService === 'function') {
      selectService(firstSvc.id);
    }
    _log('Formulaire rempli : "Dev Test" + service ' + (firstSvc ? firstSvc.id : '?'));
  }

  // ── Audio ────────────────────────────────────────────────────
  function playTrack(sceneKey) {
    AudioEngine.onUserGesture();
    if (sceneKey === 'tutorial') {
      AudioEngine.startTutorialMusic();
    } else {
      AudioEngine.playScene(sceneKey);
    }
  }

  // ── État en temps réel ───────────────────────────────────────
  function _updateStateBox() {
    const box = document.getElementById('dbg-state-box');
    if (!box || !box.closest('[open]')) return;
    const s = etatJeu;
    box.innerHTML = [
      `<span>phase</span>    : ${s.phase}`,
      `<span>ch</span>       : ${s.ch} (${(CHAPTERS[s.ch] || {}).name || '—'})`,
      `<span>chPos</span>    : ${s.chPos} / ${(s.chOrder || []).length - 1}`,
      `<span>dlgIdx</span>   : ${s.dlgIdx}`,
      `<span>invFound</span> : ${s.invFound}`,
      `<span>gauges</span>   : i=${s.gauges.i} p=${s.gauges.p} m=${s.gauges.m}`,
      `<span>choices</span>  : [${(s.choices || []).join(', ')}]`,
      `<span>playerFirst</span>: ${s.playerFirst || '—'}`,
      `<span>chOrder</span>  : [${(s.chOrder || []).join(',')}]`,
    ].join('\n');
  }

  // ── LocalStorage ─────────────────────────────────────────────
  function clearLS() {
    if (!confirm('Vider tout le localStorage ? (badges, sessions, tutoriel, mute)')) return;
    localStorage.clear();
    _log('LocalStorage vidé.');
    const box = document.getElementById('dbg-ls-box');
    box.textContent = '✓ localStorage vidé.';
    box.classList.add('on');
  }

  function showLS() {
    const box = document.getElementById('dbg-ls-box');
    box.classList.toggle('on');
    if (!box.classList.contains('on')) return;
    const keys = Object.keys(localStorage);
    if (!keys.length) { box.textContent = '(vide)'; return; }
    box.textContent = keys.map(k => {
      let v = localStorage.getItem(k);
      try { v = JSON.stringify(JSON.parse(v), null, 2); } catch(e) {}
      return `── ${k} ──\n${v}`;
    }).join('\n\n');
  }

  function fakePlayers() {
    const sessionsKey = CONFIG.stockage.sessions;
    const existing = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
    const noms = ['Marie Dupont','Jean Martin','Sophie Bernard','Luc Robert','Chloé Petit'];
    const services = SERVICES.map(s => s.id);
    const fakes = noms.map((nom, i) => ({
      id: Date.now() + i,
      name: nom,
      service: services[i % services.length],
      date: new Date(Date.now() - i * 86400000).toISOString(),
      chOrder: [0,1,2,3,4,5,6],
      choices: [['good','warn','good','good'],['bad','warn','bad','good'],['good','good','good','good']][i % 3],
      gauges: { i: 60 + i * 5, p: 55 + i * 4, m: 58 + i * 6 },
      duration: 900 + i * 120,
    }));
    localStorage.setItem(sessionsKey, JSON.stringify([...existing, ...fakes]));
    _log(`${fakes.length} faux joueurs ajoutés dans localStorage['${sessionsKey}'].`);
    showLS();
  }

  // ── Utilitaire log ───────────────────────────────────────────
  function _log(msg) {
    console.log('%c[DebugPanel] ' + msg, 'color:#fb923c;font-weight:bold');
  }

  // ── Toggle du panneau ────────────────────────────────────────
  function toggle() {
    _open = !_open;
    document.getElementById('dbg-panel').classList.toggle('open', _open);
    document.getElementById('dbg-tab').classList.toggle('hidden', _open);
    if (_open && !_stateTimer) {
      _stateTimer = setInterval(_updateStateBox, 500);
    }
  }

  // ── Init ─────────────────────────────────────────────────────
  function init() {
    _injectStyles();
    _createBanner();
    _createPanel();
    toggle(); // Ouvre directement le panneau au chargement
    _log('Panneau debug initialisé. Ctrl+Shift+D pour toggle.');
  }

  return { init, toggle, goPhase, goEpilogue, goEnd, simulateEnd, applySliderGauges, playTrack, clearLS, showLS, fakePlayers, autoFill };

})();

// Auto-init dès que le script est chargé
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', DebugPanel.init);
} else {
  DebugPanel.init();
}
