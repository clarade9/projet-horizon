// ═══════════════════════════════════════════════════════════════
// MODE REPLAY ANNOTÉ — Projet Horizon
// Permet au joueur de revoir ses décisions avec analyse comparative
// Accessible depuis l'écran de statistiques personnelles
// ═══════════════════════════════════════════════════════════════

const Replay = (() => {

  let _state = {
    chapterIdx: 0,       // index CHAPTERS[] de l'affaire affichée
    tab:        'joueur', // 'joueur' | 'meilleur' | 'comparaison'
    source:     'stats', // 'stats' — pour savoir où revenir
  };

  // ── Ouvre le replay pour une affaire précise ─────────────────
  function ouvrir(chapterIdx) {
    const details = etatJeu.choiceDetails || [];
    const choices = etatJeu.choices || [];

    // Trouver la position de ce chapitre dans l'ordre de jeu
    const posInOrder = etatJeu.chOrder ? etatJeu.chOrder.indexOf(chapterIdx) : chapterIdx;
    const choixType  = posInOrder >= 0 ? choices[posInOrder] : null;
    const detail     = details.find(d => d.ch === chapterIdx) || null;

    if (!choixType && !detail) return; // affaire non jouée

    _state.chapterIdx = chapterIdx;
    _state.tab        = 'joueur';

    _render(chapterIdx, posInOrder, choixType, detail);

    const el = document.getElementById('replay-panel');
    if (el) el.classList.add('on');
  }

  // ── Ferme le panneau replay ───────────────────────────────────
  function fermer() {
    const el = document.getElementById('replay-panel');
    if (el) el.classList.remove('on');
  }

  // ── Change l'onglet actif ─────────────────────────────────────
  function changerTab(tab) {
    _state.tab = tab;
    document.querySelectorAll('.rp-tab-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('rp-tab-' + tab);
    if (btn) btn.classList.add('active');

    document.querySelectorAll('.rp-tab-content').forEach(c => c.classList.remove('active'));
    const content = document.getElementById('rp-content-' + tab);
    if (content) content.classList.add('active');
  }

  // ── Affaire précédente / suivante dans l'ordre de jeu ────────
  function naviguer(direction) {
    const order  = etatJeu.chOrder || [];
    const played = etatJeu.chPos >= 0 ? order.slice(0, etatJeu.chPos + 1) : order;
    const curPos = played.indexOf(_state.chapterIdx);
    const newPos = curPos + direction;
    if (newPos < 0 || newPos >= played.length) return;
    ouvrir(played[newPos]);
  }

  // ── Rendu principal ───────────────────────────────────────────
  function _render(chIdx, posInOrder, choixType, detail) {
    const ch      = CHAPTERS[chIdx];
    const texts   = REPLAY_TEXTS ? REPLAY_TEXTS[chIdx] : null;
    const choices = etatJeu.choices || [];

    if (!ch) return;

    // Infos sur le choix du joueur
    const choixIdx = detail ? ch.choices.findIndex(c => c.desc === detail.desc) : -1;
    const choixData = choixIdx >= 0 ? ch.choices[choixIdx] : null;

    // Meilleur choix
    const bestIdx  = ch.choices.findIndex(c => c.type === 'good');
    const bestData = bestIdx >= 0 ? ch.choices[bestIdx] : null;

    // Réflexe pro — résultat global (si disponible)
    const reflexeOverall = etatJeu.reflexeResult ? etatJeu.reflexeResult.overall : null;

    // ── Onglet "Votre approche" ──
    const tabJoueur = _tabJoueur(ch, choixType, choixData, choixIdx, texts, reflexeOverall);

    // ── Onglet "Meilleure approche" ──
    const tabMeilleur = _tabMeilleur(ch, bestData, bestIdx, texts);

    // ── Onglet "Comparaison" ──
    const tabCompar = _tabComparaison(ch, choixData, bestData);

    // Navigation
    const order   = etatJeu.chOrder || [];
    const played  = etatJeu.chPos >= 0 ? order.slice(0, etatJeu.chPos + 1) : order;
    const curPos  = played.indexOf(chIdx);
    const hasPrev = curPos > 0;
    const hasNext = curPos < played.length - 1;

    const el = document.getElementById('replay-panel');
    if (!el) return;

    el.innerHTML = `
      <div class="rp-inner">
        <div class="rp-header">
          <div class="rp-header-left">
            <div class="rp-affaire-num">${ch.num}</div>
            <div class="rp-affaire-name">${ch.name}</div>
          </div>
          <button class="rp-close-btn" onclick="Replay.fermer()">✕</button>
        </div>

        <div class="rp-tabs">
          <button class="rp-tab-btn active" id="rp-tab-joueur"     onclick="Replay.changerTab('joueur')">🤔 Votre approche</button>
          <button class="rp-tab-btn"        id="rp-tab-meilleur"   onclick="Replay.changerTab('meilleur')">✅ Meilleure approche</button>
          <button class="rp-tab-btn"        id="rp-tab-comparaison" onclick="Replay.changerTab('comparaison')">📊 Comparaison</button>
        </div>

        <div class="rp-tab-content active" id="rp-content-joueur">${tabJoueur}</div>
        <div class="rp-tab-content"        id="rp-content-meilleur">${tabMeilleur}</div>
        <div class="rp-tab-content"        id="rp-content-comparaison">${tabCompar}</div>

        <div class="rp-nav">
          <button class="rp-nav-btn" onclick="Replay.naviguer(-1)" ${hasPrev ? '' : 'disabled'}>← Affaire précédente</button>
          <button class="rp-nav-btn" onclick="Replay.naviguer(1)"  ${hasNext ? '' : 'disabled'}>Affaire suivante →</button>
        </div>
      </div>`;
  }

  // ── Contenu onglet "Votre approche" ──────────────────────────
  function _tabJoueur(ch, choixType, choixData, choixIdx, texts, reflexeOverall) {
    const typeLabel = { good: '✅ Bon choix', warn: '⚠️ Choix risqué', bad: '❌ Mauvais choix' };
    const typeClass = { good: 'rp-badge-good', warn: 'rp-badge-warn', bad: 'rp-badge-bad' };

    let reflexeHtml = '';
    if (texts && reflexeOverall) {
      const txt = reflexeOverall === 'good' ? texts.reflexe.bon : texts.reflexe.mauvais;
      reflexeHtml = `
        <div class="rp-section">
          <div class="rp-section-title">Réflexe professionnel</div>
          <div class="rp-analyse-txt">${txt}</div>
        </div>`;
    }

    let choixHtml = '';
    if (choixData) {
      const analyseTexte = texts && texts.choices[choixIdx] ? texts.choices[choixIdx].analyse : '';
      choixHtml = `
        <div class="rp-section">
          <div class="rp-section-title">Votre décision finale</div>
          <div class="rp-choix-card rp-choix-joueur">
            <div class="rp-choix-lettre">${String.fromCharCode(65 + choixIdx)}</div>
            <div class="rp-choix-body">
              <div class="rp-choix-desc">${choixData.desc}</div>
              <span class="rp-badge ${typeClass[choixType] || ''}">${typeLabel[choixType] || choixType}</span>
            </div>
          </div>
          ${analyseTexte ? `<div class="rp-analyse-txt">${analyseTexte}</div>` : ''}
        </div>`;
    }

    let jaugesHtml = '';
    if (choixData && choixData.gauges) {
      jaugesHtml = _jaugesImpact(choixData.gauges, 'Votre décision');
    }

    return reflexeHtml + choixHtml + jaugesHtml || '<div class="rp-empty">Aucune donnée disponible pour cette affaire.</div>';
  }

  // ── Contenu onglet "Meilleure approche" ──────────────────────
  function _tabMeilleur(ch, bestData, bestIdx, texts) {
    if (!bestData) return '<div class="rp-empty">Pas de meilleure option identifiée.</div>';

    const analyseTexte = texts && texts.choices[bestIdx] ? texts.choices[bestIdx].analyse : '';
    const reflexeTxt   = texts ? texts.reflexe.bon : '';

    let reflexeHtml = '';
    if (reflexeTxt) {
      reflexeHtml = `
        <div class="rp-section">
          <div class="rp-section-title">Réflexe professionnel idéal</div>
          <div class="rp-analyse-txt">${reflexeTxt}</div>
        </div>`;
    }

    const choixHtml = `
      <div class="rp-section">
        <div class="rp-section-title">La meilleure décision</div>
        <div class="rp-choix-card rp-choix-best">
          <div class="rp-choix-lettre">${String.fromCharCode(65 + bestIdx)}</div>
          <div class="rp-choix-body">
            <div class="rp-choix-desc">${bestData.desc}</div>
            <span class="rp-badge rp-badge-good">✅ Bon choix</span>
          </div>
        </div>
        ${analyseTexte ? `<div class="rp-analyse-txt">${analyseTexte}</div>` : ''}
      </div>`;

    let jaugesHtml = '';
    if (bestData.gauges) {
      jaugesHtml = _jaugesImpact(bestData.gauges, 'Meilleure décision');
    }

    return reflexeHtml + choixHtml + jaugesHtml;
  }

  // ── Contenu onglet "Comparaison" ──────────────────────────────
  function _tabComparaison(ch, choixData, bestData) {
    if (!choixData || !bestData) {
      return '<div class="rp-empty">Sélectionnez une affaire jouée pour comparer.</div>';
    }

    const isSame = choixData === bestData;
    if (isSame) {
      return '<div class="rp-same">✅ Vous avez fait le meilleur choix — rien à comparer !</div>';
    }

    const gJ = choixData.gauges || {};
    const gB = bestData.gauges  || {};

    const rows = ['i', 'p', 'm'].map(key => {
      const labels = { i: 'Intégrité', p: 'Performance', m: 'Image SEM' };
      const colors = { i: '#22c55e', p: '#60a0f8', m: '#d888f8' };
      const vJ = gJ[key] || 0;
      const vB = gB[key] || 0;
      const fmt = v => (v > 0 ? '+' : '') + v;
      const clJ = vJ >= 0 ? 'rp-delta-pos' : 'rp-delta-neg';
      const clB = vB >= 0 ? 'rp-delta-pos' : 'rp-delta-neg';
      return `
        <tr>
          <td class="rp-cmp-lbl" style="color:${colors[key]}">${labels[key]}</td>
          <td class="rp-cmp-val ${clJ}">${fmt(vJ)}</td>
          <td class="rp-cmp-val ${clB}">${fmt(vB)}</td>
        </tr>`;
    }).join('');

    return `
      <div class="rp-section">
        <div class="rp-section-title">Impact sur les jauges</div>
        <table class="rp-cmp-table">
          <thead>
            <tr>
              <th></th>
              <th class="rp-cmp-head rp-cmp-joueur">Votre choix</th>
              <th class="rp-cmp-head rp-cmp-best">Meilleur choix</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      <div class="rp-section">
        <div class="rp-section-title">Votre choix</div>
        <div class="rp-cmp-desc rp-cmp-joueur-bg">${choixData.desc}</div>
      </div>
      <div class="rp-section">
        <div class="rp-section-title">Meilleur choix</div>
        <div class="rp-cmp-desc rp-cmp-best-bg">${bestData.desc}</div>
      </div>`;
  }

  // ── Bloc impact jauges ────────────────────────────────────────
  function _jaugesImpact(gauges, label) {
    const g = gauges || {};
    const fmt = v => (v > 0 ? '+' : '') + (v || 0);
    const cl  = v => (v || 0) >= 0 ? 'rp-delta-pos' : 'rp-delta-neg';
    return `
      <div class="rp-section">
        <div class="rp-section-title">Impact sur les jauges — ${label}</div>
        <div class="rp-jauges-row">
          <div class="rp-jauge-cell">
            <div class="rp-jauge-lbl" style="color:#22c55e">Intégrité</div>
            <div class="rp-jauge-val ${cl(g.i)}">${fmt(g.i)}</div>
          </div>
          <div class="rp-jauge-cell">
            <div class="rp-jauge-lbl" style="color:#60a0f8">Performance</div>
            <div class="rp-jauge-val ${cl(g.p)}">${fmt(g.p)}</div>
          </div>
          <div class="rp-jauge-cell">
            <div class="rp-jauge-lbl" style="color:#d888f8">Image SEM</div>
            <div class="rp-jauge-val ${cl(g.m)}">${fmt(g.m)}</div>
          </div>
        </div>
      </div>`;
  }

  return { ouvrir, fermer, changerTab, naviguer };

})();
