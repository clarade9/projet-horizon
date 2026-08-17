// ═══════════════════════════════════════════════════════════════
// TIMER DE PRESSION — Événements narratifs invisibles
// Se déclenche uniquement pendant la phase de décision (A/B/C).
// Purement visuel/vibratoire — aucun impact sur le gameplay.
// ═══════════════════════════════════════════════════════════════

// ── CSS injecté ───────────────────────────────────────────────
(function _injectTPCSS() {
  if (document.getElementById('tp-styles')) return;
  const s = document.createElement('style');
  s.id = 'tp-styles';
  s.textContent = `

@keyframes tpSlideDown {
  from { transform: translateX(-50%) translateY(-120px); }
  to   { transform: translateX(-50%) translateY(0); }
}
@keyframes tpSlideUp {
  from { transform: translateX(-50%) translateY(0); }
  to   { transform: translateX(-50%) translateY(-120px); }
}
@keyframes tpVibrate {
  0%,100% { transform: translateX(-50%) translateY(0); }
  20%     { transform: translateX(calc(-50% - 4px)) translateY(0); }
  40%     { transform: translateX(calc(-50% + 4px)) translateY(0); }
  60%     { transform: translateX(calc(-50% - 3px)) translateY(0); }
  80%     { transform: translateX(calc(-50% + 2px)) translateY(0); }
}

#notif-pression {
  position: fixed;
  top: calc(env(safe-area-inset-top, 0px) + 20px);
  left: 50%;
  transform: translateX(-50%) translateY(-120px);
  width: min(420px, 90vw);
  background: rgba(255, 255, 255, 0.97);
  color: #1a1a2e;
  border-radius: 16px;
  padding: 0;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2);
  z-index: 9999;
  overflow: hidden;
  pointer-events: none;
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
#notif-pression.tp-visible {
  transform: translateX(-50%) translateY(0);
}
#notif-pression.tp-hide {
  transform: translateX(-50%) translateY(-120px);
  transition: transform 0.35s cubic-bezier(0.4, 0, 1, 1);
}
#notif-pression.tp-vibrating {
  animation: tpVibrate 0.4s ease 0.1s;
}

.tp-bar {
  height: 4px;
  width: 100%;
}
#notif-pression.type-phone .tp-bar { background: #1B2A4A; }
#notif-pression.type-email .tp-bar { background: #D4AF37; }

.tp-inner {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
}

.tp-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
}
#notif-pression.type-phone .tp-icon { background: #1B2A4A; }
#notif-pression.type-email .tp-icon { background: #D4AF37; }

.tp-text { flex: 1; min-width: 0; }

.tp-app {
  font-family: 'Nunito', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 2px;
}
.tp-sender {
  font-family: 'Nunito', sans-serif;
  font-size: 15px;
  font-weight: 800;
  color: #1a1a2e;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tp-msg {
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  color: #444;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tp-time {
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  color: #999;
  flex-shrink: 0;
  align-self: flex-start;
  margin-top: 2px;
}
`;
  document.head.appendChild(s);
})();

// ── Sons Web Audio ────────────────────────────────────────────

function _tpPlayPhone() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [{ freq: 1318, start: 0, dur: 0.06 }, { freq: 1760, start: 0.07, dur: 0.06 }]
      .forEach(({ freq, start, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        const t = ctx.currentTime + start;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
        osc.start(t);
        osc.stop(t + dur + 0.05);
      });
  } catch(e) {}
}

function _tpPlayEmail() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.15);
    filter.type = 'lowpass';
    filter.frequency.value = 1200;
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.25);
  } catch(e) {}
}

// ── Module TimerPression ──────────────────────────────────────
const TimerPression = {
  _timers: [],
  _el: null,

  // Démarre les timers pour le chapitre chIdx
  demarrer(chIdx) {
    this.arreter();
    // Crée (ou récupère) l'élément persistant
    if (!this._el) {
      this._el = document.createElement('div');
      this._el.id = 'notif-pression';
      this._el.setAttribute('aria-live', 'polite');
      this._el.setAttribute('aria-atomic', 'true');
      (document.getElementById('game') || document.body).appendChild(this._el);
    }
    const evts = (typeof PRESSIONS_DATA !== 'undefined')
      ? (PRESSIONS_DATA[chIdx] || [])
      : [];
    evts.forEach(evt => {
      this._timers.push(
        setTimeout(() => this._afficher(evt), evt.delai * 1000)
      );
    });
  },

  // Arrête tous les timers et cache la notification
  arreter() {
    this._timers.forEach(clearTimeout);
    this._timers = [];
    if (this._el) {
      this._el.classList.remove('tp-visible', 'tp-vibrating');
      this._el.classList.add('tp-hide');
    }
  },

  // Dispatch selon le type d'événement
  _afficher(evt) {
    const isPhone = evt.type === 'notification';
    const expediteur = evt.expediteur || '';
    const message    = evt.message    || '';

    const now = new Date();
    const heure = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    const el = this._el;
    if (!el) return;

    // Reset classes
    el.className = isPhone ? 'type-phone' : 'type-email';

    el.innerHTML = `
      <div class="tp-bar"></div>
      <div class="tp-inner">
        <div class="tp-icon">${isPhone ? '📱' : '✉️'}</div>
        <div class="tp-text">
          <div class="tp-app">${isPhone ? 'Messages' : 'Mail'}</div>
          <div class="tp-sender">${_tpEsc(expediteur)}</div>
          <div class="tp-msg">${_tpEsc(message)}</div>
        </div>
        <div class="tp-time">${heure}</div>
      </div>`;

    // Affiche
    el.classList.remove('tp-hide');
    // Force reflow avant d'ajouter .tp-visible
    void el.offsetWidth;
    el.classList.add('tp-visible');

    // Son (respecte le bouton mute)
    const muted = (typeof AudioEngine !== 'undefined' && AudioEngine.isMuted());
    if (!muted) {
      if (isPhone) _tpPlayPhone(); else _tpPlayEmail();
    }

    // Vibration mobile
    if (navigator.vibrate) {
      navigator.vibrate(isPhone ? [200, 50, 100] : [100]);
    }

    // Animation CSS vibration
    setTimeout(() => {
      el.classList.add('tp-vibrating');
      setTimeout(() => el.classList.remove('tp-vibrating'), 600);
    }, 100);

    // Masque après 4 secondes
    setTimeout(() => {
      el.classList.remove('tp-visible');
      el.classList.add('tp-hide');
    }, 4000);
  },
};

// Utilitaire d'échappement HTML
function _tpEsc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

window.TimerPression = TimerPression;
