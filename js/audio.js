// ═══════════════════════════════════════
// AUDIO ENGINE — Projet Horizon
// Musiques de scène : MP3 avec crossfade
// Effets sonores : Web Audio API
// ═══════════════════════════════════════
const AudioEngine = (() => {

  const AUDIO_PATH = 'assets/audio/musiques/';

  // ── Contexte & nœuds de gain ─────────────────────────────
  let ctx        = null;
  let masterGain = null;  // volume global (0 = muet)
  let sfxGain    = null;  // effets sonores           → 30%
  let twGain     = null;  // frappe clavier           → 10%

  // ── Musique tutoriel ──────────────────────────────────────
  let tutGain  = null;
  let tutAudio = null;

  // ── Musique courante ──────────────────────────────────────
  let _sceneGain  = null;   // GainNode de la piste en cours
  let _sceneAudio = null;   // HTMLAudioElement en cours
  let _sceneTrack = null;   // chemin du fichier en cours

  // ── Mode chapitre (bloque playScene) ─────────────────────
  let _chapterMusicActive = false;

  // ── État ─────────────────────────────────────────────────
  let muted = localStorage.getItem('ph_muted') === '1';

  // ── Configuration ─────────────────────────────────────────
  const SCENE_VOL = CONFIG.audio.volumeMusique;
  const FADE_SEC  = CONFIG.audio.dureeCrossfade;

  // ── Musique par chapitre (index 0-9) ──────────────────────
  const CHAPTER_TRACKS = [
    'bureau.mp3',            // ch 0 — Affaire 1
    'favre.mp3',             // ch 1 — Affaire 2 (dynamique via musicAfter)
    'favre.mp3',             // ch 2 — Affaire 3
    'pesee.mp3',             // ch 3 — Affaire 4
    'exterieur.mp3',         // ch 4 — Affaire 5
    'mairie.mp3',            // ch 5 — Affaire 6
    'extension.mp3',         // ch 6 — Affaire 7
    'urgencefindemois.mp3',  // ch 7 — Affaire 8
    'operationprestige.mp3', // ch 8 — Affaire 9
    'contratatoutprix.mp3',  // ch 9 — Affaire 10
  ];

  // ── Musique des scènes hors chapitre ──────────────────────
  const SCENE_TRACKS = {
    prologue: AUDIO_PATH + 'introduction.mp3',
    epilogue: AUDIO_PATH + 'introduction.mp3',
  };
  const DEFAULT_TRACK = AUDIO_PATH + 'introduction.mp3';

  // ═══════════════════════════════════════════════════════════
  // INIT — appelé au premier geste utilisateur
  // ═══════════════════════════════════════════════════════════
  function init() {
    if (ctx) return;
    ctx        = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    sfxGain    = ctx.createGain();
    twGain     = ctx.createGain();
    tutGain    = ctx.createGain();

    sfxGain.gain.value    = CONFIG.audio.volumeEffets;
    twGain.gain.value     = CONFIG.audio.volumeClavier;
    tutGain.gain.value    = 0;
    masterGain.gain.value = muted ? 0 : 1;

    sfxGain.connect(masterGain);
    twGain.connect(masterGain);
    tutGain.connect(masterGain);
    masterGain.connect(ctx.destination);

    // Reprise automatique quand l'app revient au premier plan (iOS)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible') return;
      if (ctx && ctx.state === 'suspended') ctx.resume();
      if (_sceneAudio && _sceneAudio.paused && !muted) {
        _sceneAudio.play().catch(() => _showResumeBtn());
      }
    });
  }

  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  // ═══════════════════════════════════════════════════════════
  // BOUTON "Reprendre la musique" — autoplay bloqué (iOS/Safari)
  // ═══════════════════════════════════════════════════════════
  function _showResumeBtn() {
    if (document.getElementById('audio-resume-btn')) return;
    const btn = document.createElement('button');
    btn.id        = 'audio-resume-btn';
    btn.textContent = '▶ Reprendre la musique';
    btn.onclick = () => {
      if (ctx && ctx.state === 'suspended') ctx.resume();
      if (_sceneAudio && _sceneAudio.paused) _sceneAudio.play().catch(() => {});
      btn.remove();
    };
    document.body.appendChild(btn);
  }

  // ═══════════════════════════════════════════════════════════
  // LECTURE — crossfade entre deux pistes MP3
  // ═══════════════════════════════════════════════════════════
  function _playFile(file) {
    if (!ctx) return;
    if (file === _sceneTrack) return; // même piste → aucune interruption

    const now = ctx.currentTime;

    // Fade out de la piste sortante
    if (_sceneGain && _sceneAudio) {
      const outGain  = _sceneGain;
      const outAudio = _sceneAudio;
      outGain.gain.setTargetAtTime(0, now, FADE_SEC / 3);
      setTimeout(() => {
        try { outAudio.pause(); outAudio.src = ''; } catch(e) {}
      }, FADE_SEC * 1000 + 400);
    }

    // Création et fade in de la nouvelle piste
    const audio = new Audio(file);
    audio.loop        = true;
    audio.crossOrigin = 'anonymous';
    // iOS Safari : loop peu fiable sur MediaElementSource — fallback manuel
    audio.onended = () => { audio.currentTime = 0; audio.play().catch(() => {}); };

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(SCENE_VOL, now + FADE_SEC);
    gain.connect(masterGain);

    const src = ctx.createMediaElementSource(audio);
    src.connect(gain);

    audio.play().catch(() => _showResumeBtn());

    _sceneTrack = file;
    _sceneAudio = audio;
    _sceneGain  = gain;
  }

  // ═══════════════════════════════════════════════════════════
  // PLAY SCENE — déclenché par buildScene() dans scenes.js
  // Bloqué pendant les chapitres (la musique chapitre prime)
  // ═══════════════════════════════════════════════════════════
  function playScene(key) {
    if (!ctx) return;
    if (key === 'tutorial') return;     // géré par startTutorialMusic()
    if (_chapterMusicActive) return;    // chapitre en cours → ne pas écraser
    const file = SCENE_TRACKS[key] || DEFAULT_TRACK;
    _playFile(file);
  }

  // ═══════════════════════════════════════════════════════════
  // PLAY CHAPTER — déclenché par loadChapter() dans main.js
  // ═══════════════════════════════════════════════════════════
  function playChapter(idx) {
    if (!ctx) return;
    _chapterMusicActive = true;
    const filename = CHAPTER_TRACKS[idx] || CHAPTER_TRACKS[0];
    _playFile(AUDIO_PATH + filename);
  }

  // ═══════════════════════════════════════════════════════════
  // PLAY ACCUEIL — intro, accueil, prologue, carte
  // Réinitialise le mode chapitre
  // ═══════════════════════════════════════════════════════════
  function playAccueil() {
    if (!ctx) return;
    _chapterMusicActive = false;
    _playFile(DEFAULT_TRACK);
  }

  // ═══════════════════════════════════════════════════════════
  // SWITCH TRACK — changement dynamique en cours de chapitre
  // Utilisé pour les micro-décisions qui changent de lieu
  // ═══════════════════════════════════════════════════════════
  function switchTrack(filename) {
    if (!ctx) return;
    _playFile(AUDIO_PATH + filename);
  }

  // ═══════════════════════════════════════════════════════════
  // PLAY END — écran de fin selon le résultat
  // ═══════════════════════════════════════════════════════════
  function playEnd(badCount) {
    if (!ctx) return;
    _chapterMusicActive = false;
    let filename;
    if      (badCount >= 2) filename = 'badmusic.mp3';
    else if (badCount === 1) filename = 'middlehappening.mp3';
    else                    filename = 'happyending.mp3';
    _playFile(AUDIO_PATH + filename);
  }

  // ═══════════════════════════════════════════════════════════
  // FADE OUT — pour les écrans de verdict (transition douce)
  // ═══════════════════════════════════════════════════════════
  function fadeOut() {
    if (!ctx || !_sceneGain) return;
    const outGain  = _sceneGain;
    const outAudio = _sceneAudio;
    outGain.gain.setTargetAtTime(0, ctx.currentTime, 0.8);
    _sceneGain  = null;
    _sceneAudio = null;
    _sceneTrack = null;
    setTimeout(() => {
      try { if (outAudio) { outAudio.pause(); outAudio.src = ''; } } catch(e) {}
    }, 3000);
  }

  // ═══════════════════════════════════════════════════════════
  // MUSIQUE TUTORIEL — fade in au démarrage, crossfade ensuite
  // ═══════════════════════════════════════════════════════════
  function startTutorialMusic() {
    if (!ctx || !tutGain) return;

    // Silence la musique de scène pendant le tutoriel
    if (_sceneGain) {
      _sceneGain.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
    }

    // Initialise la piste tutoriel une seule fois
    if (!tutAudio) {
      tutAudio             = new Audio(AUDIO_PATH + 'musique-tutoriel.mp3');
      tutAudio.loop        = true;
      tutAudio.crossOrigin = 'anonymous';
      tutAudio.onended = () => { tutAudio.currentTime = 0; tutAudio.play().catch(() => {}); };
      const tutSrc = ctx.createMediaElementSource(tutAudio);
      tutSrc.connect(tutGain);
    }

    tutGain.gain.setValueAtTime(0, ctx.currentTime);
    tutGain.gain.linearRampToValueAtTime(SCENE_VOL, ctx.currentTime + 1.5);
    tutAudio.play().catch(e => console.warn('[Audio] Tutoriel différé :', e.message));
  }

  function crossfadeToMain() {
    if (!ctx) return;
    const now = ctx.currentTime;
    // Fade out tutoriel (2s)
    if (tutGain) tutGain.gain.setTargetAtTime(0, now, 0.65);
    setTimeout(() => { try { if (tutAudio) tutAudio.pause(); } catch(e){} }, 2500);
    // La musique de scène démarrera via playScene() au prochain buildScene()
  }

  // ═══════════════════════════════════════════════════════════
  // EFFETS SONORES
  // ═══════════════════════════════════════════════════════════
  function noiseBuffer(sec) {
    const n   = Math.floor(ctx.sampleRate * sec);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d   = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  function sfxDialogueClick() {
    if (!ctx) return;
    const t   = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer(0.12);
    const filt = ctx.createBiquadFilter();
    filt.type  = 'bandpass';
    filt.frequency.value = 3000;
    filt.Q.value = 1.4;
    const g    = ctx.createGain();
    g.gain.setValueAtTime(0.45, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    src.connect(filt); filt.connect(g); g.connect(sfxGain);
    src.start(t); src.stop(t + 0.12);
  }

  function sfxTypeKey() {
    if (!ctx || !twGain) return;
    const t     = ctx.currentTime;
    const pitch = 0.88 + Math.random() * 0.24;

    // "Clac" : bruit filtré passe-haut
    const nSrc = ctx.createBufferSource();
    nSrc.buffer = noiseBuffer(0.05);
    const hp   = ctx.createBiquadFilter();
    hp.type    = 'highpass';
    hp.frequency.value = 3200 * pitch;
    hp.Q.value = 0.7;
    const nG   = ctx.createGain();
    nG.gain.setValueAtTime(1.0, t);
    nG.gain.exponentialRampToValueAtTime(0.001, t + 0.030);
    nSrc.connect(hp); hp.connect(nG); nG.connect(twGain);
    nSrc.start(t); nSrc.stop(t + 0.035);

    // "Toc" grave
    const osc = ctx.createOscillator();
    osc.type  = 'sine';
    osc.frequency.value = 180 * pitch;
    const oG  = ctx.createGain();
    oG.gain.setValueAtTime(0.5, t);
    oG.gain.exponentialRampToValueAtTime(0.001, t + 0.018);
    osc.connect(oG); oG.connect(twGain);
    osc.start(t); osc.stop(t + 0.020);
  }

  function sfxPhoneRing() {
    if (!ctx) return;
    // Sonnerie bureau : deux tons (440 + 480 Hz), pattern DRING-DRING
    const vol = CONFIG.audio.volumeEffets;
    [[0, 0.4], [0.6, 0.4]].forEach(([tStart, dur]) => {
      [440, 480].forEach(freq => {
        const t   = ctx.currentTime + tStart;
        const osc = ctx.createOscillator();
        osc.type  = 'sine';
        osc.frequency.value = freq;
        const env = ctx.createGain();
        env.gain.setValueAtTime(0, t);
        env.gain.linearRampToValueAtTime(vol, t + 0.02);
        env.gain.setValueAtTime(vol, t + dur - 0.05);
        env.gain.linearRampToValueAtTime(0, t + dur);
        osc.connect(env);
        env.connect(sfxGain);
        osc.start(t);
        osc.stop(t + dur);
      });
    });
  }

  function sfxVibrate() {
    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
  }

  function sfxBadgeUnlock() {
    if (!ctx) return;
    // Arpège Do-Mi-Sol (C5-E5-G5)
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const t   = ctx.currentTime + i * 0.13;
      const osc = ctx.createOscillator();
      osc.type  = 'triangle';
      osc.frequency.value = freq;
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.28, t + 0.04);
      env.gain.exponentialRampToValueAtTime(0.001, t + 0.52);
      osc.connect(env); env.connect(sfxGain);
      osc.start(t); osc.stop(t + 0.56);
    });
  }

  function sfxValidationReflexe() {
    if (!ctx) return;
    // Arpège Do-Mi-Sol court (C5-E5-G5) — validation Réflexe Pro
    [523, 659, 784].forEach((freq, i) => {
      const t   = ctx.currentTime + i * 0.12;
      const osc = ctx.createOscillator();
      osc.type  = 'sine';
      osc.frequency.value = freq;
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, t);
      env.gain.linearRampToValueAtTime(0.3, t + 0.02);
      env.gain.linearRampToValueAtTime(0, t + 0.15);
      osc.connect(env); env.connect(sfxGain);
      osc.start(t); osc.stop(t + 0.15);
    });
  }

  // ═══════════════════════════════════════════════════════════
  // MUTE TOGGLE
  // ═══════════════════════════════════════════════════════════
  function toggleMute() {
    if (!ctx) { init(); resume(); }
    muted = !muted;
    masterGain.gain.setTargetAtTime(muted ? 0 : 1, ctx.currentTime, 0.15);
    localStorage.setItem('ph_muted', muted ? '1' : '0');
    _updateMuteBtn();
  }

  function _updateMuteBtn() {
    const btn = document.getElementById('sound-btn');
    if (btn) btn.textContent = muted ? '🔇' : '🔊';
  }

  // ═══════════════════════════════════════════════════════════
  // API PUBLIQUE
  // ═══════════════════════════════════════════════════════════
  return {
    onUserGesture() {
      init();
      resume();
      _updateMuteBtn();
    },
    playScene,
    playChapter,
    playAccueil,
    switchTrack,
    playEnd,
    fadeOut,
    startTutorialMusic,
    crossfadeToMain,
    toggleMute,
    isMuted() { return muted; },
    sfx: {
      dialogueClick: sfxDialogueClick,
      typeKey:       sfxTypeKey,
      badgeUnlock:        sfxBadgeUnlock,
      validationReflexe:  sfxValidationReflexe,
      phoneRing:          sfxPhoneRing,
      vibrate:            sfxVibrate,
    },
  };
})();
