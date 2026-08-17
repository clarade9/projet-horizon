// ═══════════════════════════════════════════════════════════════
// GAME OVER PROGRESSIF — Paliers d'alerte sur la jauge Intégrité
// Palier 1 : i < 40 → alerte orange (1×)
// Palier 2 : i < 25 → alerte rouge + pulse HUD (1×)
// Game over : i < 10 → écran CONVOCATION
// ═══════════════════════════════════════════════════════════════

// ── CSS injecté ───────────────────────────────────────────────
(function _injectGOCSS() {
  if (document.getElementById('go-styles')) return;
  const s = document.createElement('style');
  s.id = 'go-styles';
  s.textContent = `

/* ══ Animations ══ */
@keyframes goFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes goPanelIn {
  from { opacity: 0; transform: translate(-50%, calc(-50% + 18px)); }
  to   { opacity: 1; transform: translate(-50%, -50%); }
}
@keyframes pulseRouge {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.55; filter: drop-shadow(0 0 5px #ef4444); }
}

/* ══ Jauge intégrité critique ══ */
.jauge-integrite-critique {
  animation: pulseRouge 1.5s ease-in-out infinite !important;
}

/* ══ Overlay fond alertes ══ */
#go-alerte-overlay {
  position: absolute;
  inset: 0;
  background: rgba(4, 6, 14, 0.55);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 239;
  animation: goFadeIn 0.25s ease;
}

/* ══ Panneau alerte centré ══ */
#go-alerte {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(480px, 92vw);
  background: #0e101e;
  border-radius: 16px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6);
  z-index: 240;
  padding: 28px 28px 24px;
  box-sizing: border-box;
  animation: goPanelIn 0.35s cubic-bezier(.34, 1.2, .64, 1);
  -webkit-overflow-scrolling: touch;
}
#go-alerte.go-orange { border-top: 4px solid #f59e0b; }
#go-alerte.go-rouge  { border-top: 4px solid #ef4444; }

.go-alerte-eyebrow {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .18em;
  text-transform: uppercase;
  margin-bottom: 8px;
}
.go-orange .go-alerte-eyebrow { color: #f59e0b; }
.go-rouge  .go-alerte-eyebrow { color: #ef4444; }

.go-alerte-titre {
  font-family: 'Nunito', sans-serif;
  font-size: 20px;
  font-weight: 900;
  color: #fff;
  margin-bottom: 14px;
  line-height: 1.2;
}
.go-alerte-corps {
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 22px;
}
.go-alerte-corps p { margin: 0 0 8px; }
.go-alerte-corps p:last-child { margin-bottom: 0; }

.go-alerte-btn {
  width: 100%;
  padding: 13px 16px;
  border: none;
  border-radius: 10px;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  letter-spacing: .02em;
  transition: background .2s, transform .15s;
}
.go-alerte-btn:active { transform: scale(.98); }
.go-orange .go-alerte-btn { background: #f59e0b; color: #0a0a0f; }
.go-orange .go-alerte-btn:hover { background: #d97706; }
.go-rouge  .go-alerte-btn { background: #ef4444; color: #fff; }
.go-rouge  .go-alerte-btn:hover { background: #dc2626; }

/* ══ Écran game over plein écran ══ */
#go-ecran {
  position: absolute;
  inset: 0;
  background: #0a0a0f;
  z-index: 300;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  animation: goFadeIn 1s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
}
.go-ecran-inner {
  max-width: 560px;
  width: 100%;
  text-align: center;
}
.go-convocation-label {
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: rgba(239, 68, 68, 0.6);
  margin-bottom: 12px;
}
.go-titre-convocation {
  font-family: 'Space Mono', monospace;
  font-size: 48px;
  font-weight: 700;
  color: #ef4444;
  letter-spacing: .06em;
  line-height: 1;
  margin-bottom: 16px;
}
.go-sous-titre {
  font-family: 'Nunito', sans-serif;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.55);
  margin-bottom: 28px;
  line-height: 1.5;
}
.go-corps {
  font-family: 'Nunito', sans-serif;
  font-size: 15px;
  line-height: 1.75;
  color: rgba(255, 255, 255, 0.65);
  text-align: left;
  margin-bottom: 24px;
}
.go-corps p { margin: 0 0 12px; }
.go-corps p:last-child { margin-bottom: 0; }
.go-encadre {
  border: 1px solid rgba(239, 68, 68, 0.35);
  background: rgba(239, 68, 68, 0.08);
  border-radius: 10px;
  padding: 16px 20px;
  margin-bottom: 28px;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.75);
  text-align: left;
}
.go-btns {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.go-btn {
  width: 100%;
  padding: 13px 16px;
  border-radius: 10px;
  border: none;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  letter-spacing: .02em;
  transition: background .2s, transform .15s;
  text-align: center;
}
.go-btn:active { transform: scale(.98); }
.go-btn-restart {
  background: #ef4444;
  color: #fff;
}
.go-btn-restart:hover { background: #dc2626; }
.go-btn-bilan {
  background: rgba(255, 255, 255, 0.07);
  color: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.go-btn-bilan:hover { background: rgba(255, 255, 255, 0.12); }
.go-btn-erreurs {
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
.go-btn-erreurs:hover { background: rgba(255, 255, 255, 0.08); }

/* Bilan partiel */
#go-bilan {
  margin-top: 20px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 16px 20px;
  text-align: left;
}
#go-bilan.hidden { display: none; }
.go-bilan-titre {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.35);
  margin-bottom: 12px;
}
.go-bilan-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
}
.go-bilan-row:last-child { border-bottom: none; }
.go-bilan-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.go-bilan-dot.good { background: #22c55e; }
.go-bilan-dot.warn { background: #f59e0b; }
.go-bilan-dot.bad  { background: #ef4444; }
.go-bilan-stats {
  margin-top: 14px;
  display: flex;
  gap: 16px;
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
}
.go-bilan-stat strong { color: rgba(255, 255, 255, 0.75); }

/* Erreurs pédago */
#go-erreurs {
  margin-top: 20px;
  text-align: left;
}
#go-erreurs.hidden { display: none; }
.go-erreur-card {
  background: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.15);
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 10px;
}
.go-erreur-card-num {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: #ef4444;
  margin-bottom: 5px;
}
.go-erreur-card-geste {
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.65);
}

@media (max-width: 768px) {
  .go-titre-convocation { font-size: 32px; }
  .go-corps { font-size: 14px; }
  #go-alerte { padding: 22px 18px 20px; }
  .go-alerte-titre { font-size: 17px; }
}
`;
  document.head.appendChild(s);
})();

// ── Vérification des seuils ─────────────────────────────────
function _verifierSeuilIntegrite() {
  if (etatJeu.secondEssai) return; // pas de game over en mode révision
  const i = etatJeu.gauges.i;

  if (i < 10) {
    _declencherGameOver();
    return;
  }
  if (i < 25 && !etatJeu.alerte2Affichee) {
    etatJeu.alerte2Affichee = true;
    _afficherAlerteRouge();
    return;
  }
  if (i < 40 && !etatJeu.alerte1Affichee) {
    etatJeu.alerte1Affichee = true;
    _afficherAlerteOrange();
  }
}

// ── Alerte orange (palier 1) ─────────────────────────────────
function _afficherAlerteOrange() {
  _creerAlertePanel(
    'go-orange',
    'SIGNAL D\'ALERTE',
    '⚠️ Votre intégrité est questionnée',
    `<p>Votre intégrité professionnelle commence à être questionnée.</p>
     <p>Les signaux que vous envoyez ne passent pas inaperçus.<br>
     Chaque arrangement laisse une trace.</p>`,
    'Continuer malgré tout'
  );
}

// ── Alerte rouge (palier 2) ─────────────────────────────────
function _afficherAlerteRouge() {
  // Activer le pulse sur la jauge intégrité
  const jauge = document.getElementById('hf-i');
  if (jauge) jauge.classList.add('jauge-integrite-critique');

  _creerAlertePanel(
    'go-rouge',
    'SITUATION CRITIQUE',
    '🚨 Dans le radar du contrôle interne',
    `<p>Votre comportement professionnel est désormais dans le radar du service de contrôle interne.</p>
     <p>Une inspection peut être déclenchée à tout moment.<br>
     La prochaine décision sera déterminante.</p>`,
    'Je comprends — continuer'
  );
}

// ── Constructeur commun des panneaux d'alerte ───────────────
function _creerAlertePanel(cls, eyebrow, titre, corps, btnTxt) {
  // Supprimer un éventuel panneau précédent
  ['go-alerte-overlay', 'go-alerte'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });

  const game = document.getElementById('game');

  const overlay = document.createElement('div');
  overlay.id = 'go-alerte-overlay';

  const panel = document.createElement('div');
  panel.id = 'go-alerte';
  panel.className = cls;
  panel.innerHTML = `
    <div class="go-alerte-eyebrow">${eyebrow}</div>
    <div class="go-alerte-titre">${titre}</div>
    <div class="go-alerte-corps">${corps}</div>
    <button class="go-alerte-btn" onclick="_fermerAlerte()">
      ${btnTxt}
    </button>
  `;

  game.appendChild(overlay);
  game.appendChild(panel);
}

function _fermerAlerte() {
  ['go-alerte-overlay', 'go-alerte'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.style.transition = 'opacity .25s';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 260);
    }
  });
}

// ── Game over ────────────────────────────────────────────────
function _declencherGameOver() {
  if (document.getElementById('go-ecran')) return; // déjà affiché

  if (typeof AudioEngine !== 'undefined') AudioEngine.fadeOut();

  const ecran = document.createElement('div');
  ecran.id = 'go-ecran';
  ecran.innerHTML = `
    <div class="go-ecran-inner">
      <div class="go-convocation-label">Procédure disciplinaire</div>
      <div class="go-titre-convocation">CONVOCATION</div>
      <div class="go-sous-titre">
        Vous avez été convoqué(e) par le service de contrôle interne.
      </div>

      <div class="go-corps">
        <p>Les anomalies relevées au cours des dernières semaines ont conduit
        à l'ouverture d'une procédure disciplinaire.</p>
        <p>Certains choix peuvent sembler anodins au moment où on les fait.
        Mais ils s'accumulent. Et ils finissent par raconter une histoire.</p>
      </div>

      <div class="go-encadre">
        Votre parcours s'arrête ici. Mais ce n'est pas une fin —
        c'est une opportunité d'apprendre.
      </div>

      <div class="go-btns">
        <button class="go-btn go-btn-restart" onclick="window.location.reload()">
          🔄 Recommencer depuis le début
        </button>
        <button class="go-btn go-btn-bilan" onclick="_goToggleBilan()">
          📊 Voir mon bilan partiel
        </button>
        <button class="go-btn go-btn-erreurs" onclick="_goToggleErreurs()">
          💡 Comprendre mes erreurs
        </button>
      </div>

      <div id="go-bilan" class="hidden"></div>
      <div id="go-erreurs" class="hidden"></div>
    </div>
  `;

  document.getElementById('game').appendChild(ecran);
}

// ── Bilan partiel ────────────────────────────────────────────
function _goToggleBilan() {
  const bilan = document.getElementById('go-bilan');
  if (!bilan) return;

  if (!bilan.classList.contains('hidden')) {
    bilan.classList.add('hidden');
    return;
  }

  const choices = etatJeu.choices || [];
  const details = etatJeu.choiceDetails || [];

  if (choices.length === 0) {
    bilan.innerHTML = `<div class="go-bilan-titre">BILAN</div>
      <div style="font-family:'Nunito',sans-serif;font-size:13px;color:rgba(255,255,255,.45)">
        Aucune affaire complétée.
      </div>`;
    bilan.classList.remove('hidden');
    return;
  }

  const nbGood = choices.filter(c => c === 'good').length;
  const nbWarn = choices.filter(c => c === 'warn').length;
  const nbBad  = choices.filter(c => c === 'bad').length;

  const rows = choices.map((type, idx) => {
    const chIdx = (etatJeu.chOrder || [])[idx];
    const ch = (typeof CHAPTERS !== 'undefined' && chIdx !== undefined) ? CHAPTERS[chIdx] : null;
    const label = ch ? ch.num : `Affaire ${idx + 1}`;
    return `
      <div class="go-bilan-row">
        <div class="go-bilan-dot ${type}"></div>
        <span>${label}</span>
        <span style="margin-left:auto;font-size:11px;opacity:.55">${
          type === 'good' ? 'Bon choix' : type === 'warn' ? 'Choix risqué' : 'Mauvais choix'
        }</span>
      </div>`;
  }).join('');

  bilan.innerHTML = `
    <div class="go-bilan-titre">BILAN DES AFFAIRES JOUÉES</div>
    ${rows}
    <div class="go-bilan-stats">
      <span><strong>${nbGood}</strong> bonne${nbGood > 1 ? 's' : ''}</span>
      <span><strong>${nbWarn}</strong> risquée${nbWarn > 1 ? 's' : ''}</span>
      <span><strong>${nbBad}</strong> mauvaise${nbBad > 1 ? 's' : ''}</span>
    </div>
  `;
  bilan.classList.remove('hidden');
}

// ── Erreurs pédagogiques ─────────────────────────────────────
function _goToggleErreurs() {
  const erreurs = document.getElementById('go-erreurs');
  if (!erreurs) return;

  if (!erreurs.classList.contains('hidden')) {
    erreurs.classList.add('hidden');
    return;
  }

  const choices = etatJeu.choices || [];
  if (choices.length === 0) {
    erreurs.innerHTML = `<div style="font-family:'Nunito',sans-serif;font-size:13px;color:rgba(255,255,255,.45);text-align:left">
      Aucune affaire à analyser.
    </div>`;
    erreurs.classList.remove('hidden');
    return;
  }

  const cartes = choices.map((type, idx) => {
    if (type === 'good') return '';
    const chIdx = (etatJeu.chOrder || [])[idx];
    const ch = (typeof CHAPTERS !== 'undefined' && chIdx !== undefined) ? CHAPTERS[chIdx] : null;
    if (!ch) return '';
    const geste = (ch.recap && ch.recap.gestures && ch.recap.gestures[0]) || '';
    if (!geste) return '';
    return `
      <div class="go-erreur-card">
        <div class="go-erreur-card-num">${ch.num} — ${type === 'warn' ? 'Choix risqué' : 'Mauvais choix'}</div>
        <div class="go-erreur-card-geste">Le bon réflexe : ${geste}</div>
      </div>`;
  }).filter(Boolean).join('');

  erreurs.innerHTML = cartes ||
    `<div style="font-family:'Nunito',sans-serif;font-size:13px;color:rgba(255,255,255,.45);text-align:left">
      Pas d'erreur à analyser.
    </div>`;
  erreurs.classList.remove('hidden');
}
