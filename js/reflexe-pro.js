// ═══════════════════════════════════════════════════════════════
// BON REFLEXE PROFESSIONNEL — remplace le système d'investigation
// Le joueur choisit 2 questions parmi 4 ET 2 actions parmi 4.
// Pas de feedback immédiat — impact révélé dans le verdict.
// ═══════════════════════════════════════════════════════════════

// ── CSS injecté ───────────────────────────────────────────────
(function _injectRPCSS() {
  if (document.getElementById('rp-styles')) return;
  const s = document.createElement('style');
  s.id = 'rp-styles';
  s.textContent = `
/* ══ Overlay assombrissant ══ */
.rp-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 119;
  animation: rpFadeIn .3s ease;
}

/* ══ Panneau principal ══ */
#reflexe-panel {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(580px, 94vw);
  max-height: 90dvh;
  overflow-y: auto;
  background: #fafaf8;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45);
  z-index: 120;
  padding: 24px 24px 28px;
  box-sizing: border-box;
  animation: rpSlideIn .3s ease;
  -webkit-overflow-scrolling: touch;
}

@keyframes rpFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes rpSlideIn {
  from { opacity: 0; transform: translate(-50%, calc(-50% + 16px)); }
  to   { opacity: 1; transform: translate(-50%, -50%); }
}

/* ── En-tête ── */
.rp-header {
  text-align: center;
  margin-bottom: 20px;
}
.rp-header-icon {
  font-size: 28px;
  line-height: 1;
  margin-bottom: 8px;
}
.rp-header-title {
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: #1a1a2e;
  margin-bottom: 4px;
}
.rp-header-sub {
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  color: #555;
  line-height: 1.4;
}
.rp-header-context {
  margin-top: 12px;
  background: #f0f0ea;
  border-left: 3px solid #1b2a4a;
  border-radius: 0 8px 8px 0;
  padding: 10px 14px;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-style: italic;
  color: #2a2a3e;
  line-height: 1.5;
  text-align: left;
}

/* ── Séparateur ── */
.rp-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.08);
  margin: 18px 0;
}

/* ── Section questions / actions ── */
.rp-section-label {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: #1b2a4a;
  margin-bottom: 3px;
}
.rp-section-sub {
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  color: #888;
  margin-bottom: 10px;
}
.rp-items {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

/* ── Bouton item (checkbox simulée) ── */
.rp-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: #fff;
  border: 1.5px solid rgba(0, 0, 0, 0.13);
  border-radius: 10px;
  padding: 11px 14px;
  text-align: left;
  font-family: 'Nunito', sans-serif;
  font-size: 13.5px;
  line-height: 1.45;
  color: #1a1a2e;
  cursor: pointer;
  min-height: 48px;
  transition: border-color .15s, background .15s, color .15s;
  -webkit-tap-highlight-color: transparent;
  box-sizing: border-box;
  width: 100%;
}
.rp-item:hover:not(.rp-item-disabled) {
  border-color: rgba(27, 42, 74, 0.35);
  background: #f5f5f0;
}
.rp-item:active:not(.rp-item-disabled) {
  background: #eeeee8;
}
.rp-item.rp-item-sel {
  background: #1b2a4a;
  border-color: #1b2a4a;
  color: #fff;
}
.rp-item.rp-item-sel:hover {
  background: #22345c;
}
.rp-item.rp-item-disabled {
  opacity: 0.35;
  pointer-events: none;
  cursor: default;
}

/* Indicateur carré checkbox */
.rp-item-check {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border: 1.5px solid rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  margin-top: 2px;
  transition: background .15s, border-color .15s;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: transparent;
}
.rp-item.rp-item-sel .rp-item-check {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  color: #fff;
}

/* ── Bouton de validation ── */
.rp-validate {
  margin-top: 20px;
  width: 100%;
  padding: 14px;
  background: #1b2a4a;
  border: none;
  border-radius: 10px;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  cursor: pointer;
  letter-spacing: .03em;
  transition: background .2s, opacity .2s, transform .15s;
}
.rp-validate:not(:disabled):hover {
  background: #22345c;
}
.rp-validate:not(:disabled):active {
  transform: scale(.98);
}
.rp-validate:disabled {
  opacity: 0.38;
  cursor: not-allowed;
  background: #a0a8b8;
}

/* ══ Grille documents ══ */
.rp-docs-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 4px;
}

/* Dossier fermé */
.rp-doc {
  background: #fff;
  border: 1.5px solid rgba(0,0,0,.13);
  border-radius: 12px;
  padding: 18px 12px 16px;
  cursor: pointer;
  text-align: center;
  transition: border-color .15s, background .15s, opacity .2s, transform .2s;
  -webkit-tap-highlight-color: transparent;
  box-sizing: border-box;
  min-height: 100px;
  position: relative;
  overflow: hidden;
}
.rp-doc:hover:not(.rp-doc-open):not(.rp-doc-disabled) {
  border-color: rgba(27,42,74,.35);
  background: #f5f5f0;
  transform: translateY(-2px);
}
.rp-doc-disabled {
  opacity: 0.35;
  pointer-events: none;
}

/* Face avant (fermé) */
.rp-doc-front {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.rp-doc-icon {
  font-size: 28px;
  color: #1b2a4a;
  line-height: 1;
}
.rp-doc-label {
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #1a1a2e;
  line-height: 1.3;
}

/* Contenu révélé (ouvert) */
.rp-doc-content {
  display: none;
  text-align: left;
}
.rp-doc-content-label {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: #1b2a4a;
  margin-bottom: 6px;
}
.rp-doc-content-txt {
  font-family: 'Nunito', sans-serif;
  font-size: 12.5px;
  line-height: 1.5;
  color: #2a2a3e;
}
.rp-doc-signal {
  margin-top: 10px;
  padding: 6px 10px;
  background: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 6px;
  font-family: 'Nunito', sans-serif;
  font-size: 11.5px;
  font-weight: 700;
  color: #92400e;
  line-height: 1.35;
}
.rp-doc-signal-ic {
  margin-right: 4px;
}

/* État ouvert */
.rp-doc.rp-doc-open {
  border-color: #1b2a4a;
  background: #f0f4ff;
  cursor: default;
  animation: rpDocOpen .2s ease;
}
.rp-doc.rp-doc-open .rp-doc-front {
  display: none;
}
.rp-doc.rp-doc-open .rp-doc-content {
  display: block;
}
@keyframes rpDocOpen {
  from { opacity: 0; transform: scale(.96); }
  to   { opacity: 1; transform: scale(1); }
}

/* ── Mobile ── */
@keyframes rpBtnValidation {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.05); }
  100% { transform: scale(1); }
}
@keyframes rpLueurVerte {
  0%   { box-shadow: 0 24px 64px rgba(0,0,0,.45); }
  50%  { box-shadow: 0 24px 64px rgba(0,0,0,.45), 0 0 20px rgba(16,185,129,.4); }
  100% { box-shadow: 0 24px 64px rgba(0,0,0,.45); }
}
@keyframes rpFlashDore {
  0%   { background: #1b2a4a; }
  40%  { background: rgba(212,175,55,.35); border-color: rgba(212,175,55,.6); }
  100% { background: #1b2a4a; }
}

@media (max-width: 768px) {
  #reflexe-panel {
    padding: 18px 16px 22px;
    border-radius: 14px;
    max-height: 85dvh;
  }
  .rp-header-title { font-size: 11px; }
  .rp-item { font-size: 13px; padding: 10px 12px; }
  .rp-validate { font-size: 13px; padding: 13px; }
  .rp-docs-grid { grid-template-columns: 1fr; }
  .rp-doc { min-height: auto; }
}

/* ══ Panneau feedback Temps 1 ══ */
#rp-feedback {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: min(520px, 92vw);
  max-height: 88dvh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: #fafaf8;
  border-radius: 16px;
  box-shadow: 0 24px 64px rgba(0,0,0,.45);
  z-index: 121;
  padding: 24px 24px 22px;
  box-sizing: border-box;
  animation: rpSlideIn .3s ease;
}
#rp-feedback.rp-fb-good { border-top: 5px solid #22c55e; }
#rp-feedback.rp-fb-warn { border-top: 5px solid #f59e0b; }
#rp-feedback.rp-fb-bad  { border-top: 5px solid #ef4444; }

.rp-fb-verdict-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}
.rp-fb-icon { font-size: 26px; flex-shrink: 0; }
.rp-fb-verdict {
  font-family: 'Space Mono', monospace;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
}
.rp-fb-verdict.rp-fb-good { color: #16a34a; }
.rp-fb-verdict.rp-fb-warn { color: #d97706; }
.rp-fb-verdict.rp-fb-bad  { color: #dc2626; }

.rp-fb-section-lbl {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 6px;
}
.rp-fb-choices {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 14px;
}
.rp-fb-choice {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  line-height: 1.4;
  color: #2a2a3e;
}
.rp-fb-choice.rp-fb-choice-ok   { background: #f0fdf4; border: 1px solid #bbf7d0; }
.rp-fb-choice.rp-fb-choice-bad  { background: #fff7ed; border: 1px solid #fed7aa; }
.rp-fb-check {
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 1px;
}
.rp-fb-verdict-rapide {
  margin: 14px 0 4px;
  padding: 10px 14px;
  border-radius: 8px;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-style: italic;
  line-height: 1.45;
}
.rp-fb-verdict-rapide.rp-fb-good { background: #f0fdf4; color: #166534; border-left: 3px solid #22c55e; }
.rp-fb-verdict-rapide.rp-fb-warn { background: #fffbeb; color: #92400e; border-left: 3px solid #f59e0b; }
.rp-fb-verdict-rapide.rp-fb-bad  { background: #fff1f2; color: #9f1239; border-left: 3px solid #ef4444; }
.rp-fb-analyse-hint {
  margin-top: 10px;
  font-family: 'Nunito', sans-serif;
  font-size: 11.5px;
  color: #999;
  text-align: center;
  font-style: italic;
}
.rp-fb-continue {
  margin-top: 18px;
  width: 100%;
  min-height: 44px;
  padding: 12px;
  background: #1b2a4a;
  border: none;
  border-radius: 10px;
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  cursor: pointer;
  letter-spacing: .03em;
  transition: background .2s, transform .15s;
}
.rp-fb-continue:hover { background: #22345c; }
.rp-fb-continue:active { transform: scale(.98); }

/* ══ Écran Temps 2 — Analyse complète ══ */
#rp-analyse {
  position: absolute;
  inset: 0;
  background: #07070f;
  z-index: 200;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  animation: rpFadeIn .35s ease;
  padding: 0 0 env(safe-area-inset-bottom, 0);
}
.rp-analyse-inner {
  max-width: 680px;
  margin: 0 auto;
  padding: 32px 24px 48px;
  box-sizing: border-box;
}
.rp-analyse-title {
  font-family: 'Space Mono', monospace;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: #c8b467;
  margin-bottom: 4px;
}
.rp-analyse-sub {
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  color: rgba(255,255,255,.55);
  margin-bottom: 28px;
}
.rp-analyse-section {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: rgba(255,255,255,.35);
  margin: 24px 0 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255,255,255,.08);
}
/* Tableau comparatif */
.rp-analyse-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 8px;
}
.rp-analyse-table th {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: rgba(255,255,255,.45);
  padding: 6px 10px;
  text-align: left;
  border-bottom: 1px solid rgba(255,255,255,.1);
}
.rp-analyse-table td {
  padding: 8px 10px;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  line-height: 1.4;
  vertical-align: top;
  border-bottom: 1px solid rgba(255,255,255,.05);
}
.rp-analyse-table td:first-child { color: rgba(255,255,255,.8); width: 50%; }
.rp-analyse-table td:last-child  { color: rgba(255,255,255,.55); width: 50%; }
.rp-analyse-ok  { color: #4ade80 !important; }
.rp-analyse-bad { color: #f87171 !important; }
/* Cartes explicatives */
.rp-analyse-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.rp-analyse-card {
  border-radius: 10px;
  padding: 14px 16px;
  box-sizing: border-box;
}
.rp-analyse-card.rp-ac-good {
  background: rgba(34,197,94,.08);
  border: 1px solid rgba(34,197,94,.2);
}
.rp-analyse-card.rp-ac-bad {
  background: rgba(239,68,68,.07);
  border: 1px solid rgba(239,68,68,.18);
}
.rp-analyse-card-lbl {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .16em;
  text-transform: uppercase;
  margin-bottom: 6px;
}
.rp-ac-good .rp-analyse-card-lbl { color: #4ade80; }
.rp-ac-bad  .rp-analyse-card-lbl { color: #f87171; }
.rp-analyse-card-txt {
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  line-height: 1.5;
  color: rgba(255,255,255,.75);
}
.rp-analyse-card-alt {
  margin-top: 8px;
  padding: 8px 12px;
  background: rgba(255,255,255,.04);
  border-left: 2px solid rgba(255,255,255,.15);
  border-radius: 0 6px 6px 0;
  font-family: 'Nunito', sans-serif;
  font-size: 12px;
  font-style: italic;
  color: rgba(255,255,255,.5);
  line-height: 1.45;
}
/* Règle d'or */
.rp-analyse-regle {
  margin-top: 8px;
  padding: 18px 20px;
  background: rgba(200,180,103,.07);
  border: 1px solid rgba(200,180,103,.25);
  border-radius: 12px;
}
.rp-analyse-regle-lbl {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: #c8b467;
  margin-bottom: 10px;
}
.rp-analyse-regle-txt {
  font-family: 'Nunito', sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.55;
  color: rgba(255,255,255,.85);
}
/* Boutons navigation */
.rp-analyse-nav {
  display: flex;
  gap: 10px;
  margin-top: 32px;
}
.rp-analyse-nav-btn {
  flex: 1;
  padding: 13px 16px;
  border-radius: 10px;
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  border: none;
  letter-spacing: .02em;
  transition: background .2s, transform .15s;
}
.rp-analyse-nav-btn:active { transform: scale(.97); }
.rp-anb-close {
  background: rgba(255,255,255,.07);
  color: rgba(255,255,255,.65);
}
.rp-anb-close:hover { background: rgba(255,255,255,.12); }
.rp-anb-suite {
  background: linear-gradient(135deg, #1b2a4a, #253d6a);
  color: #fff;
}
.rp-anb-suite:hover { background: linear-gradient(135deg, #22345c, #2d4a7e); }

@media (max-width: 768px) {
  #rp-feedback {
    width: 92vw;
    padding: 18px 16px 20px;
    border-radius: 14px;
  }
  .rp-fb-verdict { font-size: 11px; }
  .rp-fb-choice  { font-size: 12.5px; }
  .rp-fb-continue { font-size: 13px; min-height: 44px; }
  .rp-analyse-inner { padding: 24px 16px 40px; }
  .rp-analyse-title { font-size: 11px; }
  .rp-analyse-nav { flex-direction: column; }
}
`;
  document.head.appendChild(s);
})();

// ── Données par affaire ────────────────────────────────────────
// REFLEXE_DATA est défini dans js/data/reflexe-data.js (chargé avant ce fichier).

// ── État interne ──────────────────────────────────────────────
const _rp = {
  selQ: [],  // indices questions sélectionnées
  selA: [],  // indices actions sélectionnées
};

// ── Évaluation combo (indices triés → clé 'i,j') ─────────────
function _rpEvalCombo(sel, combos) {
  const key = [...sel].sort((a, b) => a - b).join(',');
  if (combos.good && combos.good.split(',').map(Number).sort((a,b)=>a-b).join(',') === key) return 'good';
  if (combos.warn && combos.warn.split(',').map(Number).sort((a,b)=>a-b).join(',') === key) return 'warn';
  return 'bad';
}

function _rpOverall(qType, aType) {
  if (qType === 'good' && aType === 'good') return 'good';
  if (qType === 'bad'  && aType === 'bad')  return 'bad';
  return 'warn';
}

// ── Construction du panneau questions + actions ───────────────
function _rpBuildPanel(data) {
  _rp.selQ = [];
  _rp.selA = [];

  const overlay = document.createElement('div');
  overlay.className = 'rp-overlay';
  overlay.id = 'rp-overlay';

  const panel = document.createElement('div');
  panel.id = 'reflexe-panel';

  const qItems = (data.questions || []).map((q, i) => `
    <button class="rp-item" id="rp-q${i}" onclick="_rpToggleQ(${i})">
      <span class="rp-item-check">✓</span>
      <span>${q.txt}</span>
    </button>`).join('');

  const aItems = (data.actions || []).map((a, i) => `
    <button class="rp-item" id="rp-a${i}" onclick="_rpToggleA(${i})">
      <span class="rp-item-check">✓</span>
      <span>${a.txt}</span>
    </button>`).join('');

  panel.innerHTML = `
    <div class="rp-header">
      <div class="rp-header-icon">🧠</div>
      <div class="rp-header-title">Bon réflexe professionnel</div>
      <div class="rp-header-sub">Sélectionnez 2 questions ET 2 actions — pas de feedback immédiat.</div>
      <div class="rp-header-context">${data.context}</div>
    </div>
    <div class="rp-divider"></div>
    <div class="rp-section-label">Questions à poser</div>
    <div class="rp-section-sub">Choisissez 2 questions parmi ${(data.questions||[]).length}</div>
    <div class="rp-items" id="rp-q-list">${qItems}</div>
    <div class="rp-divider"></div>
    <div class="rp-section-label">Actions à mener</div>
    <div class="rp-section-sub">Choisissez 2 actions parmi ${(data.actions||[]).length}</div>
    <div class="rp-items" id="rp-a-list">${aItems}</div>
    <button class="rp-validate" id="rp-validate-btn" onclick="_rpValider()" disabled style="opacity:0.38;cursor:not-allowed">
      Valider mon réflexe →
    </button>
  `;

  document.getElementById('game').appendChild(overlay);
  document.getElementById('game').appendChild(panel);
}

// ── Toggle question ───────────────────────────────────────────
function _rpToggleQ(idx) {
  const data = REFLEXE_DATA[etatJeu.ch];
  const max  = (data && data.questions) ? data.questions.length : 4;
  _rpToggleItem('Q', idx, _rp.selQ, max, 'rp-q');
}

// ── Toggle action ─────────────────────────────────────────────
function _rpToggleA(idx) {
  const data = REFLEXE_DATA[etatJeu.ch];
  const max  = (data && data.actions) ? data.actions.length : 4;
  _rpToggleItem('A', idx, _rp.selA, max, 'rp-a');
}

// ── Logique commune toggle ────────────────────────────────────
function _rpToggleItem(type, idx, selArr, total, prefix) {
  const el = document.getElementById(prefix + idx);
  if (!el) return;

  if (selArr.includes(idx)) {
    // Déselectionner
    selArr.splice(selArr.indexOf(idx), 1);
    el.classList.remove('rp-item-sel');
    // Réactiver tous les items de cette section
    for (let i = 0; i < total; i++) {
      const btn = document.getElementById(prefix + i);
      if (btn) btn.classList.remove('rp-item-disabled');
    }
  } else {
    if (selArr.length >= 2) return;
    selArr.push(idx);
    el.classList.add('rp-item-sel');
    // Griser les non-sélectionnés si 2 sélectionnés
    if (selArr.length >= 2) {
      for (let i = 0; i < total; i++) {
        if (!selArr.includes(i)) {
          const btn = document.getElementById(prefix + i);
          if (btn) btn.classList.add('rp-item-disabled');
        }
      }
    }
  }

  // Activer le bouton si 2Q + 2A sélectionnés
  const validateBtn = document.getElementById('rp-validate-btn');
  if (validateBtn) {
    const ready = _rp.selQ.length === 2 && _rp.selA.length === 2;
    validateBtn.disabled = !ready;
    validateBtn.style.opacity = ready ? '1' : '0.38';
    validateBtn.style.cursor  = ready ? 'pointer' : 'not-allowed';
  }
}

// ── Validation → calcul résultat ──────────────────────────────
function _rpValider() {
  const data = REFLEXE_DATA[etatJeu.ch];
  if (!data) return;
  if (_rp.selQ.length < 2 || _rp.selA.length < 2) return;

  const qType  = _rpEvalCombo(_rp.selQ, data.combos.questions);
  const aType  = _rpEvalCombo(_rp.selA, data.combos.actions);
  const overall = _rpOverall(qType, aType);

  etatJeu.reflexeResult = { qType, aType, overall };
  etatJeu._rpSelQ = [..._rp.selQ];
  etatJeu._rpSelA = [..._rp.selA];
  if (overall === 'good') etatJeu.reflexeGood[etatJeu.ch] = true;

  if (window.AudioEngine) AudioEngine.sfx.validationReflexe();

  // ── Animations visuelles de validation ───────────────────
  const validateBtn = document.getElementById('rp-validate-btn');
  const panel = document.getElementById('reflexe-panel');

  if (validateBtn) {
    validateBtn.style.animation = 'rpBtnValidation 0.2s ease';
    setTimeout(() => { validateBtn.style.animation = ''; }, 220);
  }
  if (panel) {
    panel.style.animation = 'rpLueurVerte 0.5s ease';
    setTimeout(() => { panel.style.animation = ''; }, 520);
  }
  // Flash doré sur les items sélectionnés
  [..._rp.selQ.map(i => document.getElementById('rp-q' + i)),
   ..._rp.selA.map(i => document.getElementById('rp-a' + i))]
    .forEach(el => {
      if (el) {
        el.style.animation = 'rpFlashDore 0.4s ease';
        setTimeout(() => { el.style.animation = ''; }, 420);
      }
    });

  // Délai 260ms pour laisser les animations se jouer avant la sortie
  setTimeout(() => {
    if (panel) {
      panel.style.transition = 'opacity .25s, transform .25s';
      panel.style.opacity    = '0';
      panel.style.transform  = 'translate(-50%, calc(-50% + 12px))';
      setTimeout(() => {
        panel.remove();
        _rpAfficherFeedback(data, overall);
      }, 260);
    } else {
      _rpAfficherFeedback(data, overall);
    }
  }, 260);
}

// ── Constantes texte des verdicts ─────────────────────────────
const _RP_VERDICTS = {
  good: { ic: '✅', txt: 'EXCELLENT RÉFLEXE',   cl: 'rp-fb-good' },
  warn: { ic: '⚠️', txt: 'RÉFLEXE ACCEPTABLE',  cl: 'rp-fb-warn' },
  bad:  { ic: '❌', txt: 'À RETRAVAILLER',       cl: 'rp-fb-bad'  },
};

// ── Phrases de transition narrateur après feedback ─────────────
const _RP_PHRASES = {
  good: "Vous avez adopté les bons réflexes. Maintenant, la décision.",
  warn: "Certains réflexes étaient bons. Mais quelque chose manquait. La décision.",
  bad:  "Ces réflexes laissent la SEM exposée. La décision s'impose quand même.",
};

// ── Affiche le panneau feedback Temps 1 après validation ──────
function _rpAfficherFeedback(data, overall) {
  const verdictCfg = _RP_VERDICTS[overall];
  const ar  = data.analysereflexe;
  const qs  = data.questions || [];
  const as  = data.actions   || [];

  // Lignes questions sélectionnées
  const qHtml = _rp.selQ.map(i => {
    const pertinent = ar && ar.questions && ar.questions[i] ? ar.questions[i].pertinent : false;
    const txt = qs[i] ? qs[i].txt : '';
    const cls  = pertinent ? 'rp-fb-choice-ok' : 'rp-fb-choice-bad';
    const icon = pertinent ? '✅' : '❌';
    const lbl  = pertinent ? 'Pertinent' : 'À revoir';
    return `
    <div class="rp-fb-choice ${cls}">
      <span class="rp-fb-check">${icon}</span>
      <span style="flex:1">${txt}</span>
      <span style="font-size:11px;font-weight:700;color:${pertinent ? '#16a34a' : '#dc2626'};flex-shrink:0;margin-left:6px">${lbl}</span>
    </div>`;
  }).join('');

  // Lignes actions sélectionnées
  const aHtml = _rp.selA.map(i => {
    const pertinent = ar && ar.actions && ar.actions[i] ? ar.actions[i].pertinent : false;
    const txt = as[i] ? as[i].txt : '';
    const cls  = pertinent ? 'rp-fb-choice-ok' : 'rp-fb-choice-bad';
    const icon = pertinent ? '✅' : '❌';
    const lbl  = pertinent ? 'Pertinente' : 'À revoir';
    return `
    <div class="rp-fb-choice ${cls}">
      <span class="rp-fb-check">${icon}</span>
      <span style="flex:1">${txt}</span>
      <span style="font-size:11px;font-weight:700;color:${pertinent ? '#16a34a' : '#dc2626'};flex-shrink:0;margin-left:6px">${lbl}</span>
    </div>`;
  }).join('');

  const verdictRapide = ar ? ar.verdictRapide[overall] : null;
  const verdictHtml = verdictRapide
    ? `<div class="rp-fb-verdict-rapide ${verdictCfg.cl}">${verdictRapide}</div>`
    : '';

  const hintHtml = ar
    ? `<div class="rp-fb-analyse-hint">L'analyse complète sera disponible après la décision finale.</div>`
    : '';

  const fb = document.createElement('div');
  fb.id = 'rp-feedback';
  fb.className = verdictCfg.cl;
  fb.innerHTML = `
    <div class="rp-fb-verdict-row">
      <span class="rp-fb-icon">${verdictCfg.ic}</span>
      <span class="rp-fb-verdict ${verdictCfg.cl}">${verdictCfg.txt}</span>
    </div>
    <div class="rp-fb-section-lbl">Vos questions</div>
    <div class="rp-fb-choices">${qHtml}</div>
    <div class="rp-fb-section-lbl" style="margin-top:10px">Vos actions</div>
    <div class="rp-fb-choices">${aHtml}</div>
    ${verdictHtml}
    ${hintHtml}
    <button class="rp-fb-continue" onclick="_rpContinuer()">Continuer →</button>
  `;
  document.getElementById('game').appendChild(fb);
}

// ── Continuer : feedback → phrase narrateur → décision ────────
function _rpContinuer() {
  const fb = document.getElementById('rp-feedback');
  if (fb) {
    fb.style.transition = 'opacity .25s, transform .25s';
    fb.style.opacity    = '0';
    fb.style.transform  = 'translate(-50%, calc(-50% + 12px))';
    setTimeout(() => fb.remove(), 260);
  }
  const overlay = document.getElementById('rp-overlay');
  if (overlay) {
    overlay.style.transition = 'opacity .25s';
    overlay.style.opacity    = '0';
    setTimeout(() => overlay.remove(), 260);
  }

  const overall = (etatJeu.reflexeResult || {}).overall || 'warn';
  const txt = _RP_PHRASES[overall];

  setTimeout(() => {
    const dlg = document.getElementById('dlg');
    if (dlg) {
      dlg.classList.remove('hidden');
      document.getElementById('dlg-spk').textContent = 'Narrateur';
      if (typeof twStart === 'function') {
        twStart(document.getElementById('dlg-txt'), txt, 28);
      } else {
        document.getElementById('dlg-txt').textContent = txt;
      }
      if (typeof setSpeaking === 'function') setSpeaking(null);
      dlg.onclick = () => {
        if (typeof twComplete === 'function') twComplete();
        dlg.onclick = null;
        if (typeof hideDlg === 'function') hideDlg();
        endInvestigation();
      };
    } else {
      endInvestigation();
    }
  }, 280);
}

// ── Affiche l'analyse complète Temps 2 (après le verdict) ─────
function rpAfficherAnalyseComplete() {
  const ch   = etatJeu.ch;
  const data = REFLEXE_DATA[ch];
  if (!data || !data.analysereflexe) return;

  const ar   = data.analysereflexe;
  const qs   = data.questions || [];
  const as   = data.actions   || [];
  const selQ = etatJeu._rpSelQ || [];
  const selA = etatJeu._rpSelA || [];

  // ── Tableau comparatif ────────────────────────────────────
  // Bons choix = ceux dont pertinent:true dans analysereflexe
  const goodQIdxs = Object.keys(ar.questions || {}).filter(k => ar.questions[k].pertinent).map(Number);
  const goodAIdxs = Object.keys(ar.actions   || {}).filter(k => ar.actions[k].pertinent).map(Number);

  function buildTableRows(sel, goodIdxs, items, arMap) {
    const maxRows = Math.max(sel.length, goodIdxs.length);
    let rows = '';
    for (let n = 0; n < maxRows; n++) {
      const uIdx  = sel[n];
      const gIdx  = goodIdxs[n];
      const uItem = items[uIdx];
      const gItem = items[gIdx];
      const uTxt  = uItem ? uItem.txt : '—';
      const gTxt  = gItem ? gItem.txt : '—';
      const isOk  = (arMap && uIdx !== undefined && arMap[uIdx]) ? arMap[uIdx].pertinent : false;
      const uCls  = isOk ? 'rp-analyse-ok' : 'rp-analyse-bad';
      const uIc   = isOk ? '✅' : '❌';
      const gIsUser = uIdx === gIdx;
      rows += `
      <tr>
        <td class="${uCls}">${uIc} ${uTxt}</td>
        <td>${gIsUser ? `<span style="opacity:.5">✅ ${gTxt}</span>` : `✅ ${gTxt}`}</td>
      </tr>`;
    }
    return rows;
  }

  const qRows = buildTableRows(selQ, goodQIdxs, qs, ar.questions);
  const aRows = buildTableRows(selA, goodAIdxs, as, ar.actions);

  // ── Cartes explicatives ───────────────────────────────────
  function buildCards(sel, items, arMap, goodIdxs) {
    // Cartes pour les items sélectionnés
    const selCards = sel.map(i => {
      const item = items[i];
      const info = arMap && arMap[i];
      if (!item || !info) return '';
      const cls = info.pertinent ? 'rp-ac-good' : 'rp-ac-bad';
      const lbl = info.pertinent ? '✅ Bon choix' : '❌ À revoir';
      const altHtml = (!info.pertinent && info.alternative)
        ? `<div class="rp-analyse-card-alt">À la place : ${info.alternative}</div>`
        : '';
      return `
      <div class="rp-analyse-card ${cls}">
        <div class="rp-analyse-card-lbl">${lbl}</div>
        <div class="rp-analyse-card-txt"><strong>${item.txt}</strong><br><br>${info.pourquoi}</div>
        ${altHtml}
      </div>`;
    }).join('');

    // Cartes pour les bons choix manqués
    const manquesCards = goodIdxs.filter(i => !sel.includes(i)).map(i => {
      const item = items[i];
      const info = arMap && arMap[i];
      if (!item || !info) return '';
      return `
      <div class="rp-analyse-card rp-ac-good">
        <div class="rp-analyse-card-lbl">🔍 À retenir</div>
        <div class="rp-analyse-card-txt"><strong>${item.txt}</strong><br><br>${info.pourquoi}</div>
      </div>`;
    }).join('');

    return selCards + manquesCards;
  }

  const qCards = buildCards(selQ, qs, ar.questions, goodQIdxs);
  const aCards = buildCards(selA, as, ar.actions,   goodAIdxs);

  const screen = document.createElement('div');
  screen.id = 'rp-analyse';
  screen.innerHTML = `
    <div class="rp-analyse-inner">
      <div class="rp-analyse-title">Analyse de votre réflexe professionnel</div>
      <div class="rp-analyse-sub">${data.context}</div>

      <div class="rp-analyse-section">Vos questions vs les meilleures questions</div>
      <table class="rp-analyse-table">
        <thead><tr><th>Vos choix</th><th>Bons choix</th></tr></thead>
        <tbody>${qRows}</tbody>
      </table>

      <div class="rp-analyse-section">Vos actions vs les meilleures actions</div>
      <table class="rp-analyse-table">
        <thead><tr><th>Vos choix</th><th>Bons choix</th></tr></thead>
        <tbody>${aRows}</tbody>
      </table>

      <div class="rp-analyse-section">Pourquoi — Questions</div>
      <div class="rp-analyse-cards">${qCards}</div>

      <div class="rp-analyse-section">Pourquoi — Actions</div>
      <div class="rp-analyse-cards">${aCards}</div>

      <div class="rp-analyse-section">La règle d'or de cette affaire</div>
      <div class="rp-analyse-regle">
        <div class="rp-analyse-regle-lbl">A retenir</div>
        <div class="rp-analyse-regle-txt">${ar.regleOr}</div>
      </div>

      <div class="rp-analyse-nav">
        <button class="rp-analyse-nav-btn rp-anb-close" onclick="_rpFermerAnalyse()">Fermer</button>
        <button class="rp-analyse-nav-btn rp-anb-suite" onclick="_rpFermerAnalyseEtRecap()">Voir la fiche recap →</button>
      </div>
    </div>
  `;
  document.getElementById('game').appendChild(screen);
  screen.scrollTop = 0;
}

function _rpFermerAnalyse() {
  const el = document.getElementById('rp-analyse');
  if (el) {
    el.style.transition = 'opacity .25s';
    el.style.opacity = '0';
    setTimeout(() => el.remove(), 260);
  }
}

function _rpFermerAnalyseEtRecap() {
  const el = document.getElementById('rp-analyse');
  if (el) {
    el.style.transition = 'opacity .2s';
    el.style.opacity = '0';
    setTimeout(() => { el.remove(); showRecap(); }, 220);
  } else {
    showRecap();
  }
}

// ═══════════════════════════════════════════════════════════════
// POINT D'ENTRÉE — interface publique (identique à l'ancien système)
// ═══════════════════════════════════════════════════════════════
function startInvestigation() {
  etatJeu.phase    = 'investigation';
  etatJeu.invFound = 0;
  etatJeu.reflexeResult = null;
  if (typeof _updateNavButtons === 'function') _updateNavButtons();

  // Masquer le dialogue en cours si visible
  if (typeof hideDlg === 'function') hideDlg();

  const data = REFLEXE_DATA[etatJeu.ch];
  if (data) {
    _rpBuildPanel(data);
  } else {
    // Fallback : affaire sans données → passe directement aux choix
    endInvestigation();
  }
}

// ── Fin investigation → choix ─────────────────────────────────
function endInvestigation() {
  const inv = document.getElementById('inv');
  if (inv) inv.classList.add('hidden');
  if (typeof showChoicePanel === 'function') showChoicePanel();
}

// ── Stubs de compatibilité ────────────────────────────────────
function openClue() {}
