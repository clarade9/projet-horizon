// ═══════════════════════════════════════
// TABLEAU DE BORD FORMATEUR — Projet Horizon
// ═══════════════════════════════════════

const TRAINER_CODE_DEFAULT = 'FORMATEUR2025';

// ── Données de référence ────────────────────────────────────────

const CHAPTER_NAMES = [
  'Affaire 1 — Le CV sur le dessus de la pile',
  'Affaire 2 — Le Déjeuner de l\'Acheteur',
  'Affaire 3 — Les Fantômes de la Paie',
  'Affaire 4 — La Nuit des Tonnages',
  'Affaire 5 — Le Chantage à l\'Autorisation',
  'Affaire 6 — L\'Offensive Commerciale',
  'Affaire 7 — L\'Extension Horizon',
  'Affaire 8 — L\'Urgence de fin de mois',
  'Affaire 9 — Opération Prestige',
  'Affaire 10 — Le Contrat à tout prix',
];

const CHAPTER_SHORT = [
  'CV & Recrutement',
  'Déjeuner d\'affaires',
  'Fantômes de la Paie',
  'Nuit des Tonnages',
  'Chantage Autorisation',
  'Offensive Commerciale',
  'Extension Horizon',
  'Urgence de fin de mois',
  'Opération Prestige',
  'Contrat à tout prix',
];

const CHAPTER_DEBRIEF = [
  'Débriefing : En quoi la demande de M. Aubert constitue-t-elle une prise illégale d\'intérêts, même sans bénéfice personnel pour le recruteur ? Quels réflexes institutionnels (jury pluraliste, déclaration de lien) auraient protégé l\'agent ?',
  'Débriefing : Un repas d\'affaires devient-il automatiquement une infraction ? Où se situe la limite entre relation commerciale normale et hospitalité excessive ? Comment documenter sa position sans rompre la relation fournisseur ?',
  'Débriefing : La modification discrète d\'un RIB est-elle toujours une erreur ou parfois une fraude ? Quels signaux d\'alerte — horaires, absence de motif, comportement — permettent de distinguer erreur et malveillance dans les processus de paie ?',
  'Débriefing : Pourquoi le chauffeur propose-t-il un arrondi ? Qui en bénéficie réellement ? Comment le système de pesée peut-il être un point de fraude chronique, et quels contrôles croisés y remédient ?',
  'Débriefing : M. Lefebvre est inspecteur : peut-on vraiment lui "donner" quelque chose ? En quoi le lien entre le versement et la décision administrative suffit-il à qualifier un trafic d\'influence, indépendamment de la forme du paiement ?',
  'Débriefing : Verser un sponsoring à un club dont le président est l\'acheteur public est-il toujours de la corruption ? Quel serait le cadre légal d\'un mécénat sportif légitime ? Quelle est la différence fondamentale avec ce scénario ?',
  'Débriefing : Comment une acquisition immobilière peut-elle devenir un vecteur de prise illégale d\'intérêts ? Pourquoi l\'identité du vendeur et l\'évaluation France Domaines sont-elles des points de contrôle non négociables pour une SEM ?',
  'Débriefing : La fraude au virement bancaire peut-elle venir d\'un partenaire de confiance ? Quels processus de double validation et de vérification de RIB permettent de s\'en protéger sans alourdir la relation fournisseur ?',
  'Débriefing : La clause 4b du contrat de mécénat matérialise-t-elle à elle seule la corruption, ou faut-il un versement effectif ? En quoi l\'écrit aggrave-t-il la situation par rapport à une demande verbale ?',
  'Débriefing : Pourquoi le recours à un intermédiaire (Mme Deschamps) ne protège-t-il pas la SEM juridiquement ? Comment la connaissance de son passé judiciaire affecte-t-elle l\'analyse pénale ? Que risque réellement le directeur commercial en acceptant même une seule option ?',
];

const SERVICE_LABELS = {
  dg:         'Direction Générale',
  rh:         'Ressources Humaines',
  achats:     'Achats',
  juridique:  'Juridique / Conformité',
  finance:    'Finance / Comptabilité',
  commercial: 'Commercial',
  terrain:    'Exploitation / Terrain',
  qse:        'QSE / Environnement',
};

const RESULT_LABELS = {
  certified: 'Référence Anticorruption',
  warning:   'Vigilance renforcée',
  failed:    'Formation obligatoire',
  abandoned: 'Abandon',
};

const KEY_INDEX = 'horizon_sessions';

// ── État global ─────────────────────────────────────────────────

let sessions     = [];
let _demoMode    = false;
let _currentPeriod = 'week';
let _activityChart = null;
let _refreshTimer  = null;
let _tsTimer       = null;
let _lastRefreshTime = Date.now();

// ── Utilitaires ─────────────────────────────────────────────────

const $ = id => document.getElementById(id);

function _pct(n, total) {
  if (!total) return 0;
  return Math.round(n / total * 100);
}

function _fmt(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function _fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  });
}

function _tryGet(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch(e) { return null; }
}
function _tryGetRaw(key) {
  try { return localStorage.getItem(key); } catch(e) { return null; }
}
function _trySet(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
}

function _fmtDuration(ms) {
  if (!ms || ms < 0) return '—';
  const min = Math.round(ms / 60000);
  if (min < 1) return '< 1 min';
  return min + ' min';
}

// ── Données sources (demo ou réelles) ──────────────────────────

function _src() {
  return _demoMode ? _DEMO_DATA : sessions;
}

// ── CONNEXION ───────────────────────────────────────────────────

function checkLogin() {
  const input = $('login-input');
  if (!input) return;
  const customCode = _tryGetRaw('horizon_trainer_code');
  const validCode  = customCode || TRAINER_CODE_DEFAULT;
  if (input.value === validCode) {
    $('login-screen').style.display = 'none';
    $('dashboard-app').classList.add('on');
    loadSessions();
    showView('global');
    startAutoRefresh();
    loadSessionsSupabase();
  } else {
    input.classList.add('error');
    $('login-error').textContent = 'Code incorrect.';
    setTimeout(() => {
      input.classList.remove('error');
      $('login-error').textContent = '';
      input.value = '';
      input.focus();
    }, 1000);
  }
}

// ── CHARGEMENT DES DONNÉES ──────────────────────────────────────

function loadSessions() {
  const ids = _tryGet(KEY_INDEX) || [];
  sessions = [];
  for (const id of ids) {
    const s = _tryGet('horizon_' + id);
    if (s) sessions.push(s);
  }
  sessions.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
}

// Charge les données depuis Supabase et les fusionne avec le localStorage
async function loadSessionsSupabase() {
  if (typeof SB === 'undefined') return;
  try {
    const sbSessions = await SB.chargerToutesDonnees();
    if (!sbSessions || sbSessions.length === 0) return;

    // Les sessions Supabase ont l'id préfixé "sb_" — pas de doublon avec localStorage
    const sbIds    = new Set(sbSessions.map(s => s.id));
    const localOnly = sessions.filter(s => !sbIds.has(s.id));
    sessions = [...sbSessions, ...localOnly];
    sessions.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));

    // Re-rendu de la vue active
    const active = document.querySelector('.dash-nav-btn.active');
    if (active) {
      const name = active.id.replace('nav-', '');
      showView(name);
    }
  } catch(e) {}
}

// ── NAVIGATION ──────────────────────────────────────────────────

function showView(name) {
  document.querySelectorAll('.dash-view').forEach(v  => v.classList.remove('active'));
  document.querySelectorAll('.dash-nav-btn').forEach(b => b.classList.remove('active'));
  const view = $('view-' + name);
  if (view) view.classList.add('active');
  const btn  = $('nav-'  + name);
  if (btn)  btn.classList.add('active');

  if (name === 'global')   renderGlobal();
  if (name === 'chapters') renderChapters();
  if (name === 'players')  renderPlayers();
  if (name === 'settings') renderSettings();
}

// ── AUTO-REFRESH ────────────────────────────────────────────────

function startAutoRefresh() {
  _lastRefreshTime = Date.now();
  updateRefreshTs();
  _tsTimer = setInterval(updateRefreshTs, 5000);

  _refreshTimer = setInterval(async () => {
    const prevCount = sessions.length;
    loadSessions();
    await loadSessionsSupabase();
    _lastRefreshTime = Date.now();

    if (sessions.length > prevCount) {
      showNewSessionToast(sessions[0]);
    }

    const active = document.querySelector('.dash-nav-btn.active');
    if (active) {
      const name = active.id.replace('nav-', '');
      showView(name);
    }
  }, 30000);
}

function updateRefreshTs() {
  const el = $('refresh-ts');
  if (!el) return;
  const secs = Math.round((Date.now() - _lastRefreshTime) / 1000);
  if (secs < 5)       el.textContent = 'À l\'instant';
  else if (secs < 60) el.textContent = `il y a ${secs}s`;
  else                el.textContent = `il y a ${Math.round(secs / 60)} min`;
}

function showNewSessionToast(session) {
  const toast = $('new-session-toast');
  const msg   = $('new-session-msg');
  if (!toast || !msg) return;
  const name = session?.player?.name || 'Un joueur';
  msg.textContent = `${name} vient de terminer une affaire`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 5000);
}

// ── VUE GLOBALE ─────────────────────────────────────────────────

function renderGlobal() {
  const src        = _src();
  const total      = src.length;
  const completed  = src.filter(s => s.status === 'completed');
  const abandoned  = src.filter(s => s.status === 'abandoned').length;
  const nDone      = completed.length;

  // Actifs aujourd'hui
  const todayStr   = new Date().toISOString().slice(0, 10);
  const todayCount = src.filter(s => s.startedAt?.startsWith(todayStr)).length;

  // Temps moyen
  const withTime = completed.filter(s => s.endedAt && s.startedAt);
  const avgMs    = withTime.length
    ? withTime.reduce((sum, s) => sum + (new Date(s.endedAt) - new Date(s.startedAt)), 0) / withTime.length
    : 0;

  // Taux de complétion
  const started       = src.filter(s => s.status !== 'in_progress').length;
  const completionPct = started ? _pct(nDone, started) : null;

  // Cartes stats
  $('stat-total').textContent      = total;
  $('stat-today').textContent      = todayCount;
  $('stat-avgtime').textContent    = avgMs ? _fmtDuration(avgMs) : '—';
  $('stat-completion').textContent = completionPct !== null ? completionPct + '%' : '—';

  // Résultats
  const counts = { certified: 0, warning: 0, failed: 0 };
  for (const s of completed) counts[s.result] = (counts[s.result] || 0) + 1;
  const barTotal = nDone + abandoned || 1;
  for (const key of ['certified', 'warning', 'failed']) {
    const n = counts[key] || 0;
    const fill = $('bar-' + key); const cnt = $('cnt-' + key);
    if (fill) fill.style.width = _pct(n, barTotal) + '%';
    if (cnt)  cnt.textContent  = n;
  }
  const aFill = $('bar-abandoned'); const aCnt = $('cnt-abandoned');
  if (aFill) aFill.style.width = _pct(abandoned, barTotal) + '%';
  if (aCnt)  aCnt.textContent  = abandoned;

  // Sous-composants
  renderActivityChart(src);
  renderServiceBreakdown(src);
  renderHardestChapters(src);
  renderRecentSessions(src);
  updateRefreshTs();
}

// ── GRAPHIQUE ACTIVITÉ ──────────────────────────────────────────

function setPeriod(period, btn) {
  _currentPeriod = period;
  document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderActivityChart(_src());
}

function renderActivityChart(src) {
  const canvas  = $('chart-activity');
  const emptyEl = $('chart-empty');
  if (!canvas) return;

  // Calcul plage de dates
  const now  = new Date();
  let days = 7;
  if (_currentPeriod === 'month') {
    days = 30;
  } else if (_currentPeriod === 'all') {
    if (!src.length) {
      days = 7;
    } else {
      const oldest = src.reduce((min, s) => (!min || s.startedAt < min ? s.startedAt : min), null);
      days = Math.max(7, Math.ceil((now - new Date(oldest)) / 86400000) + 1);
    }
  }

  // Construction des labels et données
  const labels = [], dataCounts = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    labels.push(d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }));
    dataCounts.push(src.filter(s => s.startedAt?.startsWith(dateStr)).length);
  }

  const hasData = dataCounts.some(n => n > 0);
  canvas.style.display  = hasData ? 'block' : 'none';
  emptyEl.style.display = hasData ? 'none'  : 'block';
  if (!hasData) { if (_activityChart) { _activityChart.destroy(); _activityChart = null; } return; }

  if (typeof Chart === 'undefined') {
    canvas.style.display  = 'none';
    emptyEl.textContent   = 'Graphique indisponible (connexion internet requise)';
    emptyEl.style.display = 'block';
    return;
  }

  if (_activityChart) {
    _activityChart.data.labels            = labels;
    _activityChart.data.datasets[0].data  = dataCounts;
    _activityChart.update('active');
  } else {
    _activityChart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Sessions',
          data: dataCounts,
          backgroundColor: 'rgba(59,111,212,.65)',
          borderColor: '#3b6fd4',
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ctx.parsed.y + ' session' + (ctx.parsed.y > 1 ? 's' : '') } }
        },
        scales: {
          y: { beginAtZero: true, ticks: { stepSize: 1, font: { size: 11 } }, grid: { color: '#f1f5f9' } },
          x: { ticks: { font: { size: 10 }, maxRotation: days > 14 ? 45 : 0 }, grid: { display: false } }
        }
      }
    });
  }
}

// ── RÉPARTITION PAR SERVICE ─────────────────────────────────────

function renderServiceBreakdown(src) {
  const el = $('service-bars');
  if (!el) return;
  if (!src.length) { el.innerHTML = '<div class="empty-mini">Aucune donnée</div>'; return; }

  const counts = {};
  for (const s of src) {
    const svc = s.player?.service || 'inconnu';
    counts[svc] = (counts[svc] || 0) + 1;
  }
  const max    = Math.max(...Object.values(counts));
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);

  el.innerHTML = sorted.map(([svc, n]) => {
    const label = SERVICE_LABELS[svc] || svc;
    return `<div class="svc-bar-row">
      <div class="svc-bar-lbl">${label}</div>
      <div class="svc-bar-track">
        <div class="svc-bar-fill" style="width:${_pct(n, max)}%"></div>
      </div>
      <div class="svc-bar-count">${n}</div>
    </div>`;
  }).join('');
}

// ── AFFAIRES LES PLUS DIFFICILES ────────────────────────────────

function renderHardestChapters(src) {
  const el = $('hardest-chapters');
  if (!el) return;

  const data = CHAPTER_NAMES.map((_, idx) => {
    const choices = src.flatMap(s => (s.choices || []).filter(c => c.chapterIdx === idx));
    const nPlayed = choices.length;
    const nBad    = choices.filter(c => c.choiceType === 'bad').length;
    return { idx, name: CHAPTER_SHORT[idx], nPlayed, nBad, pct: nPlayed ? _pct(nBad, nPlayed) : null };
  }).filter(c => c.nPlayed > 0).sort((a, b) => b.pct - a.pct);

  if (!data.length) { el.innerHTML = '<div class="empty-mini">Aucune donnée de chapitre disponible</div>'; return; }

  const medals = ['🥇', '🥈', '🥉'];
  el.innerHTML = data.map((c, i) => {
    const rank     = medals[i] || `<span class="hardest-num">${i + 1}</span>`;
    const barColor = c.pct >= 50 ? '#dc2626' : c.pct >= 25 ? '#d97706' : '#16a34a';
    return `<div class="hardest-row">
      <div class="hardest-rank">${rank}</div>
      <div class="hardest-name">${c.name}</div>
      <div class="hardest-bar-track">
        <div class="hardest-bar-fill" style="width:${c.pct}%;background:${barColor}"></div>
      </div>
      <div class="hardest-pct" style="color:${barColor}">${c.pct}% d'infractions</div>
      <div class="hardest-n">${c.nPlayed} joueur${c.nPlayed > 1 ? 's' : ''}</div>
    </div>`;
  }).join('');
}

// ── DERNIÈRES SESSIONS ──────────────────────────────────────────

function renderRecentSessions(src) {
  const tbody = $('recent-tbody');
  if (!tbody) return;
  if (!src.length) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#94a3b8;padding:24px">Aucune session enregistrée</td></tr>';
    return;
  }
  tbody.innerHTML = src.slice(0, 10).map(s => {
    const name    = s.player?.name    || 'Anonyme';
    const service = SERVICE_LABELS[s.player?.service] || s.player?.service || '—';
    const result  = _badgePill(s.result, s.status);
    const score   = s.finalScore != null ? s.finalScore + '%' : '—';
    const date    = _fmtDate(s.startedAt);
    return `<tr class="clickable" onclick="openPlayerDetail('${s.id}')">
      <td>${name}</td><td>${service}</td><td>${result}</td>
      <td>${score}</td><td>${date}</td>
    </tr>`;
  }).join('');
}

// ── VUE PAR JOUEUR ──────────────────────────────────────────────

function renderPlayers() {
  const tbody = $('players-tbody');
  if (!tbody) return;
  const src = _src();

  if (!src.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:#94a3b8;padding:32px">Aucune session enregistrée</td></tr>';
    return;
  }
  tbody.innerHTML = src.map(s => {
    const name    = s.player?.name    || 'Anonyme';
    const service = SERVICE_LABELS[s.player?.service] || s.player?.service || '—';
    const chDone  = (s.parcours?.completedChapters || []).length;
    const total   = (s.parcours?.chOrder || []).length;
    const sos     = (s.sosUsed  || []).length;
    const score   = s.finalScore != null ? s.finalScore + '%' : '—';
    const result  = _badgePill(s.result, s.status);
    const date    = _fmtDate(s.startedAt);
    const progDone = (s.parcours?.completedChapters || s.affaires_completees || []).length;
    const progPct  = Math.round(progDone / 10 * 100);
    const progHtml = `<div class="prog-wrap"><span class="prog-txt">${progDone}/10</span><div class="prog-track"><div class="prog-fill" style="width:${progPct}%"></div></div></div>`;
    return `<tr class="clickable" onclick="openPlayerDetail('${s.id}')">
      <td>${name}</td><td>${service}</td><td>${result}</td>
      <td>${score}</td><td>${chDone}${total ? ' / ' + total : ''}</td>
      <td>${progHtml}</td>
      <td style="text-align:center">${sos}</td><td>${date}</td>
    </tr>`;
  }).join('');
}

// ── VUE PAR AFFAIRE ─────────────────────────────────────────────

function renderChapters() {
  const container = $('chapter-cards');
  if (!container) return;
  const src = _src();

  if (!src.length) {
    container.innerHTML = '<div class="empty-state"><div class="empty-state-icon">📊</div><div class="empty-state-text">Aucune donnée disponible</div></div>';
    return;
  }

  container.innerHTML = CHAPTER_NAMES.map((name, idx) => {
    const choices = src.flatMap(s => (s.choices || []).filter(c => c.chapterIdx === idx));
    const nPlayed = choices.length;
    const counts  = { good: 0, warn: 0, bad: 0 };
    for (const c of choices) counts[c.choiceType] = (counts[c.choiceType] || 0) + 1;

    const sosCount = src.reduce((acc, s) => acc + (s.sosUsed || []).filter(u => u.chapterIdx === idx).length, 0);
    const pGood = _pct(counts.good, nPlayed);
    const pWarn = _pct(counts.warn, nPlayed);
    const pBad  = _pct(counts.bad,  nPlayed);

    const maxType = counts.good >= counts.warn && counts.good >= counts.bad ? 'good'
                  : counts.warn >= counts.bad ? 'warn' : 'bad';

    const barCol = (type, pct, label, typeLabel) => {
      const isMost = type === maxType && nPlayed > 0;
      return `<div class="choice-bar-col${isMost ? ' most-chosen' : ''}">
        <div class="choice-bar-pct">${pct}%</div>
        <div class="choice-bar-track">
          <div class="choice-bar-fill fill-${type}" style="height:${pct}%"></div>
        </div>
        <div class="choice-bar-label">${label}<br>
          <span style="color:${type==='good'?'#16a34a':type==='warn'?'#d97706':'#dc2626'};font-weight:600;font-size:10px">${typeLabel}</span>
        </div>
      </div>`;
    };

    const debrief = CHAPTER_DEBRIEF[idx] || '';

    return `<div class="chapter-card">
      <div class="chapter-card-header">
        <div class="chapter-card-title">${name}</div>
        <div class="chapter-card-meta">${nPlayed} joueur${nPlayed !== 1 ? 's' : ''}</div>
      </div>
      ${nPlayed === 0
        ? '<div style="color:#94a3b8;font-size:13px">Aucun joueur n\'a joué ce chapitre</div>'
        : `<div class="choice-bars">
            ${barCol('good', pGood, 'Bonne décision',    '✓ Conforme')}
            ${barCol('warn', pWarn, 'Décision risquée',  '⚠ Risqué')}
            ${barCol('bad',  pBad,  'Mauvaise décision', '✗ Infraction')}
          </div>`
      }
      <div class="chapter-card-sos">⚖️ SOS Déontologue utilisé : <strong>${sosCount}</strong> fois</div>
      ${debrief ? `<div class="chapter-debrief"><span class="debrief-label">💬 Point formateur</span>${debrief}</div>` : ''}
    </div>`;
  }).join('');
}

// ── DÉTAIL JOUEUR ────────────────────────────────────────────────

function openPlayerDetail(id) {
  const src = _src();
  const s   = src.find(x => x.id === id);
  if (!s) return;

  const name    = s.player?.name    || 'Anonyme';
  const service = SERVICE_LABELS[s.player?.service] || '—';
  const score   = s.finalScore != null ? s.finalScore + '%' : '—';
  const g       = s.finalGauges || {};

  const duration = (s.startedAt && s.endedAt)
    ? _fmtDuration(new Date(s.endedAt) - new Date(s.startedAt)) : '—';

  // Jauges finales
  const gaugesHtml = s.finalGauges ? `
    <div class="detail-gauges">
      <div class="detail-gauge-cell">
        <div class="detail-gauge-val" style="color:#16a34a">${g.i ?? '—'}%</div>
        <div class="detail-gauge-lbl">⚖️ Intégrité</div>
      </div>
      <div class="detail-gauge-cell">
        <div class="detail-gauge-val" style="color:#3b6fd4">${g.p ?? '—'}%</div>
        <div class="detail-gauge-lbl">📈 Projet</div>
      </div>
      <div class="detail-gauge-cell">
        <div class="detail-gauge-val" style="color:#7c3aed">${g.m ?? '—'}%</div>
        <div class="detail-gauge-lbl">🏛️ Image SEM</div>
      </div>
    </div>` : '<div style="color:#94a3b8;font-size:13px">Partie non terminée</div>';

  // Timeline des choix
  const timelineHtml = (s.choices || []).length
    ? s.choices.map(c => {
        const chName    = CHAPTER_SHORT[c.chapterIdx] || ('Affaire ' + c.chapterIdx);
        const typeLabel = c.choiceType === 'good' ? 'Conforme' : c.choiceType === 'warn' ? 'Risqué' : 'Infraction';
        const usedSOS   = (s.sosUsed || []).some(u => u.chapterIdx === c.chapterIdx);
        const pills     = [
          c.gauges?.i ? `<span class="tg-pill ${c.gauges.i > 0 ? 'tg-up' : 'tg-dn'}">Intégrité ${c.gauges.i > 0 ? '+' : ''}${c.gauges.i}</span>` : '',
          c.gauges?.p ? `<span class="tg-pill ${c.gauges.p > 0 ? 'tg-up' : 'tg-dn'}">Projet ${c.gauges.p > 0 ? '+' : ''}${c.gauges.p}</span>` : '',
          c.gauges?.m ? `<span class="tg-pill ${c.gauges.m > 0 ? 'tg-up' : 'tg-dn'}">Image ${c.gauges.m > 0 ? '+' : ''}${c.gauges.m}</span>` : '',
        ].join('');
        return `<div class="timeline-item">
          <div class="timeline-dot dot-${c.choiceType}">${c.choiceType === 'good' ? '✓' : c.choiceType === 'warn' ? '!' : '✗'}</div>
          <div class="timeline-body">
            <div class="timeline-ch">${chName}${usedSOS ? ' <span class="sos-tag">⚖️ SOS</span>' : ''}</div>
            <div class="timeline-type">${typeLabel}</div>
            ${pills ? `<div class="timeline-gauges">${pills}</div>` : ''}
          </div>
        </div>`;
      }).join('')
    : '<div style="color:#94a3b8;font-size:13px">Aucun choix enregistré</div>';

  $('player-detail-inner').innerHTML = `
    <button class="player-detail-close" onclick="closePlayerDetail()">✕ Fermer</button>
    <div class="player-detail-name">${name}</div>
    <div class="player-detail-meta">
      ${service} · ${_fmt(s.startedAt)} · Durée : ${duration} · ${_badgePill(s.result, s.status)}
      · Score : <strong>${score}</strong>
    </div>

    <div class="detail-section">
      <div class="detail-section-title">Jauges finales</div>
      ${gaugesHtml}
    </div>

    <div class="detail-section">
      <div class="detail-section-title">Parcours de décisions</div>
      <div class="timeline">${timelineHtml}</div>
    </div>`;

  $('player-detail').classList.add('on');
}

function closePlayerDetail() {
  $('player-detail').classList.remove('on');
}

// ── VUE PARAMÈTRES ──────────────────────────────────────────────

function renderSettings() {
  // Mise à jour du bouton mode démo
  const btn = $('btn-demo');
  if (btn) {
    btn.textContent = 'Mode démo : ' + (_demoMode ? 'ON' : 'OFF');
    btn.classList.toggle('active', _demoMode);
  }
  // Nombre de sessions affiché dans le reset
  const fi = $('reset-feedback');
  if (fi && !fi.textContent) {
    fi.textContent = sessions.length + ' session(s) enregistrée(s)';
    fi.className   = 'settings-feedback info';
  }
}

// ── CHANGER LE CODE ─────────────────────────────────────────────

function changeCode() {
  const input    = $('new-code-input');
  const feedback = $('code-feedback');
  if (!input || !input.value.trim()) {
    if (feedback) { feedback.textContent = 'Saisissez un nouveau code.'; feedback.className = 'settings-feedback error'; }
    return;
  }
  const newCode = input.value.trim();
  try {
    localStorage.setItem('horizon_trainer_code', newCode);
    if (feedback) { feedback.textContent = '✓ Code modifié avec succès.'; feedback.className = 'settings-feedback success'; }
    input.value = '';
    setTimeout(() => { if (feedback) feedback.textContent = ''; }, 3000);
  } catch(e) {
    if (feedback) { feedback.textContent = 'Erreur lors de la sauvegarde.'; feedback.className = 'settings-feedback error'; }
  }
}

// ── EXPORT CSV ──────────────────────────────────────────────────

function exportCSV() {
  const src = _src();
  if (!src.length) { alert('Aucune donnée à exporter.'); return; }

  const nCh = CHAPTER_NAMES.length;
  const chHeaders = CHAPTER_SHORT.map((_, i) => `Ch.${i + 1}`);

  const headers = [
    'ID', 'Date', 'Joueur', 'Service',
    ...chHeaders,
    'Score', 'Intégrité', 'Projet', 'Image',
    'Résultat', 'SOS utilisés', 'Durée (min)', 'Statut'
  ];

  const rows = src.map(s => {
    const chMap = {};
    (s.choices || []).forEach(c => { chMap[c.chapterIdx] = c.choiceType; });
    const chCols  = [...Array(nCh).keys()].map(i => chMap[i] || '');
    const durMin  = (s.startedAt && s.endedAt)
      ? Math.round((new Date(s.endedAt) - new Date(s.startedAt)) / 60000) : '';
    return [
      s.id,
      _fmtDate(s.startedAt),
      s.player?.name || 'Anonyme',
      SERVICE_LABELS[s.player?.service] || s.player?.service || '',
      ...chCols,
      s.finalScore != null ? s.finalScore : '',
      s.finalGauges?.i ?? '',
      s.finalGauges?.p ?? '',
      s.finalGauges?.m ?? '',
      RESULT_LABELS[s.result] || s.result || '',
      (s.sosUsed || []).length,
      durMin,
      s.status,
    ].map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',');
  });

  const csv = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const a   = document.createElement('a');
  a.href    = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'horizon-stats-' + new Date().toISOString().slice(0, 10) + '.csv';
  a.click();
}

// ── RÉINITIALISATION ─────────────────────────────────────────────

function resetData() {
  const confirmInput = $('reset-confirm');
  const feedback     = $('reset-feedback');

  if (!confirmInput || confirmInput.value !== 'CONFIRMER') {
    if (feedback) { feedback.textContent = 'Tapez exactement "CONFIRMER" pour valider.'; feedback.className = 'settings-feedback error'; }
    return;
  }

  const ids = _tryGet(KEY_INDEX) || [];
  for (const id of ids) {
    try { localStorage.removeItem('horizon_' + id); } catch(e) {}
  }
  try { localStorage.removeItem(KEY_INDEX); } catch(e) {}
  try { localStorage.removeItem('horizon_current_session'); } catch(e) {}

  sessions = [];
  confirmInput.value = '';
  if (feedback) { feedback.textContent = '✓ Données effacées.'; feedback.className = 'settings-feedback success'; }
  setTimeout(() => {
    if (feedback) { feedback.textContent = '0 session(s) enregistrée(s)'; feedback.className = 'settings-feedback info'; }
  }, 2000);
}

// ── DONNÉES DE TEST ──────────────────────────────────────────────

const _TEST_NAMES = [
  ['Marie','Dubois'],['Pierre','Martin'],['Sophie','Bernard'],['Lucas','Petit'],
  ['Emma','Thomas'],['Hugo','Robert'],['Léa','Richard'],['Nathan','Simon'],
  ['Camille','Laurent'],['Théo','Moreau'],['Inès','Leroy'],['Maxime','Roux'],
  ['Clara','David'],['Antoine','Bertrand'],['Manon','Fontaine'],
];

function generateTestData() {
  if (!confirm('Générer 15 sessions de test ? Les données existantes seront conservées.')) return;

  const now = Date.now();
  const svcKeys = Object.keys(SERVICE_LABELS);
  const ids = [];

  _TEST_NAMES.forEach(([first, last], i) => {
    const id      = 'session_test_' + (now + i);
    const service = svcKeys[i % svcKeys.length];
    const nCh     = 3 + Math.floor(Math.random() * 4);
    const chOrder = [...Array(CHAPTER_NAMES.length).keys()].sort(() => Math.random() - 0.5).slice(0, nCh);

    const deltaMap = {
      good: { i: +15, p: +10, m: +12 },
      warn: { i: -15, p:  -5, m: -12 },
      bad:  { i: -40, p: -15, m: -35 },
    };

    const choices = chOrder.map(chIdx => {
      const roll = Math.random();
      const type = roll < 0.45 ? 'good' : roll < 0.75 ? 'warn' : 'bad';
      return {
        chapterIdx: chIdx,
        choiceType: type,
        gauges: { ...deltaMap[type] },
        timestamp: new Date(now - i * 6 * 3600000 - Math.random() * 3600000).toISOString(),
      };
    });

    const badCount  = choices.filter(c => c.choiceType === 'bad').length;
    const goodCount = choices.filter(c => c.choiceType === 'good').length;
    const result    = badCount >= 2 ? 'failed' : badCount === 1 ? 'warning' : 'certified';

    const iG = Math.min(98, Math.max(8,  60 + choices.reduce((s, c) => s + c.gauges.i, 0)));
    const pG = Math.min(98, Math.max(8,  60 + choices.reduce((s, c) => s + c.gauges.p, 0)));
    const mG = Math.min(98, Math.max(8,  60 + choices.reduce((s, c) => s + c.gauges.m, 0)));

    const startedAt = new Date(now - (i * 1.5 + Math.random()) * 86400000).toISOString();
    const duration  = (15 + Math.floor(Math.random() * 25)) * 60000;
    const endedAt   = new Date(new Date(startedAt).getTime() + duration).toISOString();
    const status    = Math.random() > 0.1 ? 'completed' : 'abandoned';

    const session = {
      id, startedAt, endedAt, status,
      player:   { name: first + ' ' + last, service },
      parcours: { chOrder, priorityCount: 4, completedChapters: chOrder.slice() },
      choices,
      sosUsed:  Math.random() > 0.65
        ? [{ chapterIdx: chOrder[0], timestamp: startedAt }] : [],
      finalGauges: status === 'completed' ? { i: iG, p: pG, m: mG } : null,
      finalScore:  status === 'completed' ? Math.round((iG + pG + mG) / 3) : null,
      badCount:    status === 'completed' ? badCount : null,
      goodCount:   status === 'completed' ? goodCount : null,
      result:      status === 'completed' ? result : null,
    };

    try { localStorage.setItem('horizon_' + id, JSON.stringify(session)); } catch(e) {}
    ids.push(id);
  });

  // Mise à jour de l'index
  const existing = _tryGet(KEY_INDEX) || [];
  const merged   = [...new Set([...existing, ...ids])];
  try { localStorage.setItem(KEY_INDEX, JSON.stringify(merged)); } catch(e) {}

  loadSessions();
  if (_activityChart) { _activityChart.destroy(); _activityChart = null; }
  showView('global');
}

// ── MODE DÉMO ────────────────────────────────────────────────────

function toggleDemoMode() {
  _demoMode = !_demoMode;
  const btn = $('btn-demo');
  if (btn) {
    btn.textContent = 'Mode démo : ' + (_demoMode ? 'ON' : 'OFF');
    btn.classList.toggle('active', _demoMode);
  }
  if (_activityChart) { _activityChart.destroy(); _activityChart = null; }
  // Re-render la vue active
  const active = document.querySelector('.dash-nav-btn.active');
  if (active) showView(active.id.replace('nav-', ''));
}

// Données de démonstration statiques (lisibles hors session)
const _DEMO_DATA = (() => {
  const now = Date.now();
  const svcKeys = Object.keys(SERVICE_LABELS);
  const names = [
    ['Alice','Moreau'],['Benoît','Girard'],['Céline','Lefèvre'],['Damien','Rousseau'],
    ['Elise','Blanc'],['François','Bonnet'],['Geneviève','Henry'],['Hassan','Laurent'],
    ['Isabelle','Simon'],['Julien','Michel'],['Karine','Garcia'],['Loïc','David'],
  ];
  return names.map(([first, last], i) => {
    const service = svcKeys[i % svcKeys.length];
    const nCh     = 3 + (i % 4);
    const chOrder = [...Array(10).keys()].sort(() => (i * 7 + 3) % 5 - 2).slice(0, nCh);
    const typeSeq = ['good','good','warn','bad','good','warn','good','bad','warn','good','good','bad'];
    const choices = chOrder.map((chIdx, j) => {
      const type = typeSeq[(i + j) % typeSeq.length];
      const delta = type === 'good' ? {i:15,p:10,m:12} : type === 'warn' ? {i:-15,p:-5,m:-12} : {i:-40,p:-15,m:-35};
      return { chapterIdx: chIdx, choiceType: type, gauges: delta, timestamp: new Date(now - i * 3600000 * 8).toISOString() };
    });
    const bad  = choices.filter(c => c.choiceType === 'bad').length;
    const good = choices.filter(c => c.choiceType === 'good').length;
    const iG = Math.min(95, Math.max(10, 60 + choices.reduce((s,c) => s+c.gauges.i,0)));
    const pG = Math.min(95, Math.max(10, 60 + choices.reduce((s,c) => s+c.gauges.p,0)));
    const mG = Math.min(95, Math.max(10, 60 + choices.reduce((s,c) => s+c.gauges.m,0)));
    return {
      id: 'demo_' + i,
      startedAt: new Date(now - i * 2 * 86400000 - 3600000 * (i % 5)).toISOString(),
      endedAt:   new Date(now - i * 2 * 86400000 - 3600000 * (i % 5) + 20 * 60000).toISOString(),
      status: 'completed',
      player: { name: first + ' ' + last, service },
      parcours: { chOrder, priorityCount: 4, completedChapters: chOrder.slice() },
      choices,
      sosUsed: i % 3 === 0 ? [{ chapterIdx: chOrder[0], timestamp: new Date(now - i * 3600000 * 8).toISOString() }] : [],
      finalGauges: { i: iG, p: pG, m: mG },
      finalScore: Math.round((iG + pG + mG) / 3),
      badCount: bad, goodCount: good,
      result: bad >= 2 ? 'failed' : bad === 1 ? 'warning' : 'certified',
    };
  });
})();

// ── HELPERS ──────────────────────────────────────────────────────

function _badgePill(result, status) {
  if (status === 'abandoned' || status === 'in_progress') {
    const cls = status === 'abandoned' ? 'abandoned' : 'progress';
    const lbl = status === 'abandoned' ? 'Abandon' : 'En cours';
    return `<span class="badge badge-${cls}">${lbl}</span>`;
  }
  const cls = result || 'abandoned';
  const lbl = RESULT_LABELS[result] || result || '—';
  return `<span class="badge badge-${cls}">${lbl}</span>`;
}

// ── INITIALISATION ───────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  // Auto-login si ouvert depuis le jeu (token récent < 15s)
  const authToken = _tryGetRaw('horizon_auth_token');
  if (authToken && Date.now() - parseInt(authToken) < 15000) {
    try { localStorage.removeItem('horizon_auth_token'); } catch(e) {}
    $('login-screen').style.display = 'none';
    $('dashboard-app').classList.add('on');
    loadSessions();
    showView('global');
    startAutoRefresh();
    loadSessionsSupabase();
    return;
  }

  // Sinon : écran de connexion standard
  const input = $('login-input');
  if (input) {
    input.addEventListener('keydown', e => { if (e.key === 'Enter') checkLogin(); });
    setTimeout(() => input.focus(), 100);
  }
});
