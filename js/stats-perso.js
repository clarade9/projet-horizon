// ═══════════════════════════════════════════════════════════════
// STATS PERSONNELLES — Écran de statistiques de fin de parcours
// Accessible depuis l'écran de fin et depuis le dashboard
// ═══════════════════════════════════════════════════════════════

// ── Domaines métier (8 domaines, indices 0-9 = CHAPTERS[]) ────
const DOMAINES = [
  {
    id:      'cadeaux',
    icon:    'ti-gift',
    color:   '#f59e0b',
    label:   'Cadeaux & Hospitalités',
    indices: [7, 8],          // Affaires 8, 9
  },
  {
    id:      'marches',
    icon:    'ti-file-invoice',
    color:   '#60a0f8',
    label:   'Marchés publics',
    indices: [1, 9],          // Affaires 2, 10
  },
  {
    id:      'conflits',
    icon:    'ti-scale',
    color:   '#d888f8',
    label:   'Conflits d\'intérêts',
    indices: [5],             // Affaire 6
  },
  {
    id:      'trafic',
    icon:    'ti-shield-exclamation',
    color:   '#ef4444',
    label:   'Trafic d\'influence',
    indices: [4],             // Affaire 5
  },
  {
    id:      'gouvernance',
    icon:    'ti-building-bank',
    color:   '#22c55e',
    label:   'Gouvernance & Élus',
    indices: [0, 6],          // Affaires 1, 7
  },
  {
    id:      'fraude',
    icon:    'ti-receipt-off',
    color:   '#f97316',
    label:   'Fraude & Finances',
    indices: [2, 3],          // Affaires 3, 4
  },
];

// ── Profils éthiques ──────────────────────────────────────────
const SP_PROFILS = [
  {
    id:        'gardien',
    em:        '🦸',
    label:     'Gardien de l\'Intégrité',
    desc:      'Zéro compromis, procédures respectées à la lettre. Votre constance protège la SEM.',
    conseil:   'Partagez vos réflexes autour de vous — vous êtes un modèle.',
    condition: (bad, warn) => bad === 0 && warn === 0,
  },
  {
    id:        'rigoureux',
    em:        '⚖️',
    label:     'Agent Rigoureux',
    desc:      'Vous avez su naviguer entre éthique et réalité opérationnelle avec équilibre.',
    conseil:   'Documentez mieux vos décisions pour vous protéger en cas de contrôle.',
    condition: (bad, warn) => bad === 0 && warn >= 1 && warn <= 2,
  },
  {
    id:        'prudent',
    em:        '🛡️',
    label:     'Agent Prudent',
    desc:      'Vous évitez le pire mais plusieurs zones grises persistent.',
    conseil:   'Renforcez votre refus des arrangements — même les "petits".',
    condition: (bad, warn) => bad === 0 && warn >= 3,
  },
  {
    id:        'complaisant',
    em:        '⚠️',
    label:     'Agent Complaisant',
    desc:      'Vous avez cédé à la pression dans un cas critique.',
    conseil:   'Une seule décision compromise peut coûter très cher juridiquement.',
    condition: (bad, warn) => bad === 1 && warn <= 1,
  },
  {
    id:        'fragile',
    em:        '😟',
    label:     'Agent Fragile',
    desc:      'La pression vous déstabilise. Vous avez accepté trop d\'arrangements.',
    conseil:   'Les petits arrangements créent des habitudes. Entraînez-vous à dire non.',
    condition: (bad, warn) => bad === 1 && warn >= 2,
  },
  {
    id:        'corruptible',
    em:        '🚨',
    label:     'Profil à Risque',
    desc:      'Plusieurs décisions compromettantes. Votre exposition juridique est élevée.',
    conseil:   'Cette formation est critique — revenez sur chaque affaire et consultez le déontologue.',
    condition: (bad, warn) => bad >= 2,
  },
];

// ── Point d'entrée principal ──────────────────────────────────
function showStatsPerso() {
  const details = etatJeu.choiceDetails || [];
  const choices = etatJeu.choices || [];

  const nbBad  = choices.filter(c => c === 'bad').length;
  const nbWarn = choices.filter(c => c === 'warn').length;
  const nbGood = choices.filter(c => c === 'good').length;
  const total  = choices.length;

  // Score global % : good=100, warn=50, bad=0
  const scoreGlobal = total > 0 ? Math.round(((nbGood * 100 + nbWarn * 50) / (total * 100)) * 100) : 0;

  const profil = _spCalcProfil(nbBad, nbWarn);
  const tempsMin = _calcTemps();

  // Construire map chapterIdx → type de décision
  const decisionMap = {};
  details.forEach(d => { decisionMap[d.ch] = d.type; });

  // Scores par domaine
  const domScores = _calcDomainScores(decisionMap);

  // Points forts (domaines ≥ 75%) et faibles (< 50%)
  const forts   = domScores.filter(d => d.pct >= 75);
  const faibles = domScores.filter(d => d.pct < 50);

  const el = document.getElementById('stats-perso');
  if (!el) return;

  el.innerHTML = `
    <div class="sp-wrap">
      <div class="sp-header">
        <div class="sp-header-title">Votre analyse personnelle</div>
        <div class="sp-header-sub">Bilan de votre parcours Projet Horizon</div>
      </div>

      <div class="sp-top-grid">
        ${_sectionScoreSVG(scoreGlobal)}
        ${_sectionProfil(profil, nbGood, nbWarn, nbBad, total)}
      </div>

      <div class="sp-section-title">Performance par domaine</div>
      <div class="sp-domaines-grid">
        ${domScores.map(d => _cardDomaine(d)).join('')}
      </div>

      <div class="sp-swot-grid">
        <div class="sp-swot-col sp-swot-forts">
          <div class="sp-swot-label"><span class="sp-swot-ic">✓</span> Points forts</div>
          ${forts.length
            ? forts.map(d => `<div class="sp-swot-item">${d.label}</div>`).join('')
            : '<div class="sp-swot-empty">Continuez à vous former pour renforcer vos points forts.</div>'}
        </div>
        <div class="sp-swot-col sp-swot-faibles">
          <div class="sp-swot-label"><span class="sp-swot-ic">✗</span> À renforcer</div>
          ${faibles.length
            ? faibles.map(d => `<div class="sp-swot-item">${d.label}</div>`).join('')
            : '<div class="sp-swot-empty">Aucune lacune majeure — bonne maîtrise globale.</div>'}
        </div>
      </div>

      ${_sectionMiniJeux()}

      ${tempsMin ? `<div class="sp-temps">Temps de parcours : <strong>${tempsMin} min</strong></div>` : ''}

      <div class="sp-btns">
        <button class="sp-btn sp-btn-primary" onclick="_spVoirResultat()">Voir mon résultat final →</button>
      </div>
    </div>`;

  el.classList.add('on');

  // Animer les barres et le cercle SVG après rendu
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.querySelectorAll('.sp-bar-fill[data-w]').forEach(bar => {
        bar.style.width = bar.dataset.w + '%';
      });
      const circle = el.querySelector('.sp-circle-prog');
      if (circle) {
        const pct = parseInt(circle.dataset.pct, 10);
        const r = 54;
        const circ = 2 * Math.PI * r;
        circle.style.strokeDashoffset = circ * (1 - pct / 100);
      }
    });
  });
}

// Passe à l'écran de fin (appelé par le bouton "Voir mon résultat")
function _spVoirResultat() {
  const el = document.getElementById('stats-perso');
  if (el) el.classList.remove('on');
  showEnd();
}

// ── Calcul scores par domaine ─────────────────────────────────
function _calcDomainScores(decisionMap) {
  return DOMAINES.map(dom => {
    const played = dom.indices.filter(i => decisionMap[i] !== undefined);
    if (played.length === 0) {
      return { ...dom, pct: null, played: 0, good: 0, warn: 0, bad: 0 };
    }
    let good = 0, warn = 0, bad = 0;
    played.forEach(i => {
      const t = decisionMap[i];
      if (t === 'good') good++;
      else if (t === 'warn') warn++;
      else bad++;
    });
    const pct = Math.round(((good * 100 + warn * 50) / (played.length * 100)) * 100);
    return { ...dom, pct, played: played.length, good, warn, bad };
  });
}

// ── Cercle SVG score global ───────────────────────────────────
function _sectionScoreSVG(score) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444';
  const label = score >= 75 ? 'Excellent' : score >= 50 ? 'Correct' : 'À retravailler';

  return `
    <div class="sp-score-block">
      <svg class="sp-score-svg" viewBox="0 0 128 128" width="128" height="128">
        <circle cx="64" cy="64" r="${r}" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="10"/>
        <circle class="sp-circle-prog" cx="64" cy="64" r="${r}" fill="none"
          stroke="${color}" stroke-width="10" stroke-linecap="round"
          stroke-dasharray="${circ}" stroke-dashoffset="${circ}"
          data-pct="${score}"
          style="transform:rotate(-90deg);transform-origin:center;transition:stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)"/>
      </svg>
      <div class="sp-score-inner">
        <div class="sp-score-pct" style="color:${color}">${score}<span class="sp-score-pct-sign">%</span></div>
        <div class="sp-score-label">${label}</div>
      </div>
    </div>`;
}

// ── Carte profil ──────────────────────────────────────────────
function _sectionProfil(profil, good, warn, bad, total) {
  return `
    <div class="sp-profil-block">
      <div class="sp-profil-em">${profil.em}</div>
      <div class="sp-profil-name">${profil.label}</div>
      <div class="sp-profil-desc">${profil.desc}</div>
      <div class="sp-profil-pills">
        ${good  > 0 ? `<span class="sp-pill sp-pill-good">${good} bonne${good>1?'s':''}</span>` : ''}
        ${warn  > 0 ? `<span class="sp-pill sp-pill-warn">${warn} prudence</span>` : ''}
        ${bad   > 0 ? `<span class="sp-pill sp-pill-bad">${bad} critique${bad>1?'s':''}</span>` : ''}
      </div>
      <div class="sp-profil-conseil">💡 ${profil.conseil}</div>
    </div>`;
}

// ── Carte domaine ─────────────────────────────────────────────
function _cardDomaine(d) {
  if (d.pct === null) {
    return `
      <div class="sp-dom-card sp-dom-na">
        <div class="sp-dom-head">
          <i class="ti ${d.icon} sp-dom-icon" style="color:${d.color}"></i>
          <span class="sp-dom-label">${d.label}</span>
          <span class="sp-dom-score" style="color:rgba(255,255,255,.3)">—</span>
        </div>
        <div class="sp-dom-sub">Non joué dans ce parcours</div>
      </div>`;
  }

  const color = d.pct >= 75 ? '#22c55e' : d.pct >= 50 ? '#f59e0b' : '#ef4444';
  const ticks = [];
  for (let i = 0; i < d.played; i++) {
    // Determine type in order (good first, warn, bad)
    let t;
    if (i < d.good) t = 'good';
    else if (i < d.good + d.warn) t = 'warn';
    else t = 'bad';
    ticks.push(`<span class="sp-dom-tick sp-dom-tick-${t}"></span>`);
  }

  return `
    <div class="sp-dom-card">
      <div class="sp-dom-head">
        <i class="ti ${d.icon} sp-dom-icon" style="color:${d.color}"></i>
        <span class="sp-dom-label">${d.label}</span>
        <span class="sp-dom-score" style="color:${color}">${d.pct}%</span>
      </div>
      <div class="sp-bar-track">
        <div class="sp-bar-fill" data-w="${d.pct}" style="width:0%;background:${color}"></div>
      </div>
      <div class="sp-dom-ticks">${ticks.join('')}</div>
    </div>`;
}

// ── Profil ────────────────────────────────────────────────────
function _spCalcProfil(bad, warn) {
  for (const p of SP_PROFILS) {
    if (p.condition(bad, warn)) return p;
  }
  return SP_PROFILS[SP_PROFILS.length - 1];
}

// ── Mini-jeux ─────────────────────────────────────────────────
function _sectionMiniJeux() {
  const scores = (typeof etatJeu !== 'undefined' && etatJeu.miniJeuScores) ? etatJeu.miniJeuScores : {};
  const keys = [2, 5, 8];
  const labels = { 2: 'Finance & Comptabilité', 5: 'Marchés & Juridique', 8: 'Corruption' };
  const max = 400;

  const joues = keys.filter(k => scores[k] !== undefined);
  if (joues.length === 0) return '';

  const total    = joues.reduce((s, k) => s + scores[k], 0);
  const totalMax = joues.length * max;
  const color    = total >= totalMax * 0.75 ? '#22c55e' : total >= totalMax * 0.5 ? '#f59e0b' : '#ef4444';

  const items = joues.map(k => {
    const s = scores[k];
    const c = s >= 300 ? '#22c55e' : s >= 200 ? '#f59e0b' : '#ef4444';
    return `<div class="sp-mj-item">
      <span class="sp-mj-label">${labels[k]}</span>
      <span class="sp-mj-score" style="color:${c}">${s} / ${max}</span>
    </div>`;
  }).join('');

  return `
    <div class="sp-mj-block">
      <div class="sp-section-title">Mini-jeux de définitions</div>
      <div class="sp-mj-wrap">
        ${items}
        <div class="sp-mj-total">
          <span>Total</span>
          <span style="color:${color};font-weight:900">${total} / ${totalMax} pts</span>
        </div>
      </div>
    </div>`;
}

// ── Temps de jeu ──────────────────────────────────────────────
function _calcTemps() {
  try {
    const cur = JSON.parse(localStorage.getItem('horizon_current_session'));
    if (cur && cur.startedAt) {
      return Math.round((Date.now() - new Date(cur.startedAt).getTime()) / 60000);
    }
  } catch(e) {}
  return null;
}
