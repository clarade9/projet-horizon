// ═══════════════════════════════════════
// PRELOADER — Splash screen + préchargement des assets
// ═══════════════════════════════════════
const Preloader = (() => {

  // Assets critiques : chargés avant de lever le splash
  const CRITICAL_IMAGES = [
    'assets/scenes/prologue.jpg',
    'assets/scenes/bureau1.jpg',
  ];

  // Assets secondaires : chargés en arrière-plan après le splash
  const SECONDARY_IMAGES = [
    'bureauf','mairie','bureau2','resto','restojour','bistro',
    'sallereunion','pesee','findumois','contratatoutprix',
    'tennis','bureau9','bureaujour','epilogue','carte-sem',
  ].map(n => 'assets/scenes/' + n + '.webp').concat([
    'assets/scenes/indus.jpg',
    'assets/scenes/salle-formation.jpg',
    'assets/scenes/maintenance.png',
    'assets/scenes/maintenancebureau.png',
    'assets/scenes/maintenancereunion.png',
    'assets/scenes/depot.png',
    'assets/scenes/reunionqse.png',
    'assets/scenes/zone3.png',
  ]).concat([
    'assets/scenes/telephonerenaud.webp',
    'assets/scenes/telephonefontaine.webp',
    'assets/scenes/telephonelaroche.webp',
    'assets/scenes/telephoneperrin.webp',
  ]).concat([
    'deschamps','dominique','laroche','lefebvre','patrice',
    'aubert','ruiz','perrin','formatrice','favre','fontaine','renaud','marie',
    'vasseur','kevin','andrieux',
  ].map(n => 'assets/characters/' + n + '.png'));

  const TIMEOUT_MS = 4000;

  const LABELS = [
    { at:  0, txt: 'Chargement des dossiers\u2026'        },
    { at: 25, txt: 'Préparation des affaires\u2026'       },
    { at: 50, txt: 'Mise en place du dispositif\u2026'   },
    { at: 75, txt: 'Dernières vérifications\u2026'        },
  ];

  function _el(id) { return document.getElementById(id); }

  // Logo affiché via <img> — fond déjà transparent dans logo-transparent.png
  function _loadLogo() {
    // Rien à faire : le <img id="splash-logo"> est déjà chargé via src dans le HTML
  }

  function _setBar(pct) {
    const bar = _el('splash-bar');
    if (bar) bar.style.transform = `scaleX(${pct / 100})`;
  }

  let _currentLabel = '';
  function _setLbl(txt) {
    if (txt === _currentLabel) return;
    _currentLabel = txt;
    const lbl = _el('splash-lbl');
    if (!lbl) return;
    lbl.style.opacity = '0';
    setTimeout(() => {
      lbl.textContent = txt;
      lbl.style.opacity = '1';
    }, 260);
  }

  function _updateProgress(pct) {
    _setBar(pct);
    let label = LABELS[0].txt;
    for (const l of LABELS) { if (pct >= l.at) label = l.txt; }
    _setLbl(label);
  }

  function _animateBar(onPhasesDone) {
    const phases = [
      { target: 70, duration: 2200 },
      { target: 95, duration: 1200 },
    ];

    function runPhase(idx) {
      if (idx >= phases.length) { if (onPhasesDone) onPhasesDone(); return; }
      const { target, duration } = phases[idx];
      const start    = performance.now();
      const startPct = idx === 0 ? 0 : phases[idx - 1].target;
      function step(now) {
        const t   = Math.min((now - start) / duration, 1);
        const pct = Math.round(startPct + (target - startPct) * t);
        _updateProgress(pct);
        if (t < 1) { requestAnimationFrame(step); }
        else       { runPhase(idx + 1); }
      }
      requestAnimationFrame(step);
    }
    runPhase(0);
  }

  function _finishBar() {
    return new Promise(resolve => {
      const start    = performance.now();
      const duration = 300;
      function step(now) {
        const t   = Math.min((now - start) / duration, 1);
        _setBar(Math.round(95 + 5 * t));
        if (t < 1) { requestAnimationFrame(step); }
        else       { resolve(); }
      }
      requestAnimationFrame(step);
    });
  }

  // Charge une liste d'images, résout quand toutes sont chargées (ou timeout)
  function _preloadImages(list) {
    return new Promise(resolve => {
      if (!list || list.length === 0) { resolve(); return; }
      const total  = list.length;
      let   loaded = 0;
      let   done   = false;
      const finish = () => { if (!done) { done = true; resolve(); } };
      setTimeout(finish, TIMEOUT_MS);
      list.forEach(src => {
        const img = new Image();
        img.onload = img.onerror = () => { if (++loaded >= total) finish(); };
        img.src = src;
      });
    });
  }

  // Chargement silencieux des assets secondaires après le splash
  function _preloadSecondary() {
    SECONDARY_IMAGES.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  function _dismissSplash(onDismissed) {
    const splash = _el('splash');
    if (!splash) { if (onDismissed) onDismissed(); return; }

    _setLbl('Dossier prêt.');

    // Pulse logo
    const logo = _el('splash-logo');
    if (logo) {
      logo.classList.add('splash-logo-pulse');
      setTimeout(() => logo.classList.remove('splash-logo-pulse'), 450);
    }

    // Hint "appuyer pour continuer" — incite au clic (= vrai geste pour iOS audio)
    const hint = document.createElement('div');
    hint.id = 'splash-hint';
    hint.textContent = 'Appuyer pour continuer';
    splash.appendChild(hint);

    let dismissed = false;

    function _doFade(withAudio) {
      if (dismissed) return;
      dismissed = true;

      // Si vrai clic : lance la musique (iOS exige un geste utilisateur réel)
      if (withAudio && typeof AudioEngine !== 'undefined') {
        if (AudioEngine.onUserGesture) AudioEngine.onUserGesture();
        if (AudioEngine.playAccueil)   AudioEngine.playAccueil();
      }

      // Déclenche les animations de l'intro (gelées pendant le splash)
      const intro = document.getElementById('intro');
      if (intro) intro.classList.add('anim-ready');

      splash.classList.add('out');
      setTimeout(() => {
        splash.remove();
        if (onDismissed) onDismissed();
      }, 1050);
    }

    // Clic = vrai geste → musique + fondu
    splash.addEventListener('click', () => _doFade(true));
    // Fallback auto-dismiss silencieux après 4s (desktop sans iOS)
    setTimeout(() => _doFade(false), 4000);
  }

  async function run(onDone) {
    _loadLogo();

    // La vidéo démarre immédiatement (z-index 10000, au-dessus du splash)
    // Le chargement des assets se fait en parallèle pendant la vidéo.
    // On attend que LES DEUX soient terminés avant de passer à l'intro.

    let videoDone  = false;
    let assetsDone = false;
    let resolveWait;
    const waitBoth = new Promise(r => { resolveWait = r; });
    const check    = () => { if (videoDone && assetsDone) resolveWait(); };

    // Lance la vidéo en parallèle
    _playIntroVideo(() => { videoDone = true; check(); });

    // Lance le chargement + animation barre (cachée derrière la vidéo)
    let barDone      = false;
    let criticalDone = false;
    let resolveAssets;
    const waitAssets = new Promise(r => { resolveAssets = r; });
    const checkAssets = () => { if (barDone && criticalDone) resolveAssets(); };

    _animateBar(() => { barDone = true; checkAssets(); });
    _preloadImages(CRITICAL_IMAGES).then(() => { criticalDone = true; checkAssets(); });

    waitAssets.then(() => _finishBar()).then(() => { assetsDone = true; check(); });

    await waitBoth;

    _dismissSplash(() => {
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(_preloadSecondary);
      } else {
        setTimeout(_preloadSecondary, 200);
      }
      if (onDone) onDone();
    });
  }

  function _playIntroVideo(onVideoDone) {
    const overlay = document.getElementById('intro-video-overlay');
    const video   = document.getElementById('intro-video');
    const skip    = document.getElementById('intro-video-skip');
    const splash  = document.getElementById('splash');

    if (!overlay || !video) { if (onVideoDone) onVideoDone(); return; }

    function _end() {
      // Fondu croisé : vidéo sort, splash entre simultanément
      overlay.classList.add('out');
      if (splash) splash.classList.add('visible');
      setTimeout(() => { overlay.remove(); }, 650);
      if (onVideoDone) onVideoDone();
    }

    overlay.classList.add('on');
    video.currentTime = 0;
    video.play().catch(() => {
      // Autoplay bloqué : passer directement au splash
      overlay.remove();
      if (splash) splash.classList.add('visible');
      if (onVideoDone) onVideoDone();
    });

    video.addEventListener('ended', _end, { once: true });
    if (skip) skip.addEventListener('click', _end, { once: true });
  }

  return { run };
})();

Preloader.run();
