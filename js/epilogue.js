// ═══════════════════════════════════════════════════════════════
// ÉPILOGUE & ÉCRAN DE FIN
// ═══════════════════════════════════════════════════════════════

let _idxEpilogue = 0;

// Lance la séquence d'épilogue depuis la première ligne
function runEpilogue() {
  etatJeu.phase    = 'epilogue';
  _idxEpilogue     = 0;
  AudioEngine.playAccueil();
  $('dlg').onclick = advEpilogue;
  showEpilogueLine();
}

// Affiche la ligne d'épilogue courante
function showEpilogueLine() {
  const ligne = EPILOGUE[_idxEpilogue];
  buildScene(ligne.sc);
  showChar('cl', null);
  showChar('cr', null);
  hideDlg();
  $('dlg').classList.remove('hidden');
  $('dlg-spk').textContent = ligne.sp;
  twStart($('dlg-txt'), ligne.txt, CONFIG.dialogue.vitesseDefilement);
}

// Avance à la prochaine ligne d'épilogue, ou affiche l'écran de fin
function advEpilogue() {
  twComplete();
  _idxEpilogue++;
  if (_idxEpilogue >= EPILOGUE.length) {
    hideDlg();
    if (typeof showStatsPerso === 'function') showStatsPerso();
    else showEnd();
    return;
  }
  showEpilogueLine();
}


// ═══════════════════════════════════════════════════════════════
// ÉCRAN DE FIN
// Calcule le résultat global et affiche l'un des trois écrans
// selon le nombre de mauvais choix effectués
// ═══════════════════════════════════════════════════════════════

// Point d'entrée principal — calcule les scores et délègue à l'écran approprié
function showEnd() {
  const jauges = etatJeu.gauges;
  const scoreMoyen = Math.round((jauges.i + jauges.p + jauges.m) / 3);
  const nbMauvais  = etatJeu.choices.filter(c => c === 'bad').length;
  const nbBons     = etatJeu.choices.filter(c => c === 'good').length;
  const resultat   = nbMauvais >= 2 ? 'failed' : nbMauvais === 1 ? 'warning' : 'certified';

  Tracker.finalize(etatJeu.gauges, nbMauvais, nbBons, resultat);

  // Supabase : finalisation de la session en arrière-plan
  if (typeof SB !== 'undefined') {
    const affairesCompletees = etatJeu.chOrder
      .slice(0, etatJeu.chPos + 1)
      .map(i => CHAPTERS[i] ? CHAPTERS[i].num : 'Affaire ' + (i + 1));
    const badgesGagnes = typeof Badges !== 'undefined' ? Badges.getSessionBadges() : [];
    SB.finaliserSession(etatJeu.gauges, resultat, badgesGagnes, affairesCompletees);
  }

  const tousLesBonsSurPrioritaires = etatJeu.chOrder
    .slice(0, etatJeu.priorityCount)
    .every((_, i) => etatJeu.choices[i] === 'good');

  Badges.check('gameEnd', {
    badCount:         nbMauvais,
    priChoicesAllGood: tousLesBonsSurPrioritaires,
    chaptersPlayed:   etatJeu.chPos + 1,
    chOrder:          etatJeu.chOrder,
  });

  const jaugesHTML = _construireJaugesHTML(jauges);
  const pointsHTML = _construirePointsAttentionHTML();

  let html = '';
  if      (nbMauvais >= 2) html = _ecranMauvaisResultat(scoreMoyen, jaugesHTML, pointsHTML);
  else if (nbMauvais === 1) html = _ecranResultatMoyen(scoreMoyen, jaugesHTML, pointsHTML);
  else                     html = _ecranBonResultat(scoreMoyen, nbBons, jaugesHTML, pointsHTML);

  html += Badges.endScreenHTML();
  html += `<div class="end-share-wrap">
    <button class="end-share-btn" onclick="genererCarteResultat()">Partager mes résultats</button>
    <a id="end-share-dl" class="end-share-dl" style="display:none" download="horizon-resultats.png">Télécharger la carte</a>
  </div>`;
  html += `<div id="footer-legal-fin">
    <a href="legal.html" target="_blank">Mentions légales</a>
    <span>·</span>
    <a href="legal.html?tab=rgpd" target="_blank">Politique de confidentialité</a>
    <span>·</span>
    <a href="legal.html?tab=cgu" target="_blank">Conditions d'utilisation</a>
    <br><small>© 2026 SEM Horizon — Conception : Cécile Larade</small>
  </div>`;
  $('end-wrap').innerHTML = html;
  AudioEngine.playEnd(nbMauvais);
  $('end').classList.add('on');
}

// ── Carte de résultat partageable (canvas 600×300) ────────────
function genererCarteResultat() {
  const jauges     = etatJeu.gauges;
  const scoreMoyen = Math.round((jauges.i + jauges.p + jauges.m) / 3);
  const nbMauvais  = etatJeu.choices.filter(c => c === 'bad').length;
  const profil     = nbMauvais >= 2 ? 'En formation' : nbMauvais === 1 ? 'Avertissement' : 'Certifié Intégrité';
  const coulProfil = nbMauvais >= 2 ? '#ef4444' : nbMauvais === 1 ? '#d4af37' : '#22c55e';
  const prenom     = etatJeu.playerFirst || 'Joueur';
  const date       = new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' });
  const nbBons     = etatJeu.choices.filter(c => c === 'good').length;
  const total      = etatJeu.choices.length;

  const W = 600, H = 300;
  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Fond dégradé navy
  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, '#0d1423');
  grad.addColorStop(1, '#1b2a4a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  // Bordure or
  ctx.strokeStyle = 'rgba(212,175,55,.45)';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, W - 2, H - 2);

  // Logo / titre gauche
  ctx.fillStyle = '#d4af37';
  ctx.font = 'bold 11px "Space Mono", monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText('PROJET HORIZON', 28, 36);
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  ctx.font = '10px sans-serif';
  ctx.fillText('Formation Anticorruption · Sapin II', 28, 52);

  // Ligne séparatrice
  ctx.strokeStyle = 'rgba(212,175,55,.2)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(28, 62); ctx.lineTo(W - 28, 62); ctx.stroke();

  // Prénom
  ctx.fillStyle = 'rgba(255,255,255,.92)';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText(prenom, 28, 98);

  // Profil (badge coloré)
  const badgeX = 28, badgeY = 112;
  const badgeText = profil;
  ctx.font = 'bold 13px sans-serif';
  const tw = ctx.measureText(badgeText).width;
  ctx.fillStyle = coulProfil + '22';
  ctx.beginPath();
  ctx.roundRect(badgeX - 4, badgeY - 14, tw + 18, 22, 5);
  ctx.fill();
  ctx.fillStyle = coulProfil;
  ctx.fillText(badgeText, badgeX + 5, badgeY);

  // Score
  ctx.fillStyle = 'rgba(255,255,255,.45)';
  ctx.font = '11px sans-serif';
  ctx.fillText('Score de conformité', 28, 152);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 44px sans-serif';
  ctx.fillText(scoreMoyen + '%', 28, 196);

  // Barre de progression
  const barX = 28, barY = 210, barW = 280, barH = 8;
  ctx.fillStyle = 'rgba(255,255,255,.1)';
  ctx.beginPath(); ctx.roundRect(barX, barY, barW, barH, 4); ctx.fill();
  ctx.fillStyle = coulProfil;
  ctx.beginPath(); ctx.roundRect(barX, barY, Math.round(barW * scoreMoyen / 100), barH, 4); ctx.fill();

  // Jauges i/p/m
  const jaugesDefs = [
    { l: 'Intégrité', v: jauges.i, c: '#22c55e' },
    { l: 'Projet',    v: jauges.p, c: '#60a0f8' },
    { l: 'Image SEM', v: jauges.m, c: '#d888f8' },
  ];
  let jx = 28;
  for (const j of jaugesDefs) {
    ctx.fillStyle = 'rgba(255,255,255,.35)';
    ctx.font = '10px sans-serif';
    ctx.fillText(j.l, jx, 244);
    ctx.fillStyle = j.c;
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(j.v + '%', jx, 260);
    jx += 100;
  }

  // Décisions
  ctx.fillStyle = 'rgba(255,255,255,.35)';
  ctx.font = '10px sans-serif';
  ctx.fillText('Décisions', 28, 282);
  ctx.fillStyle = 'rgba(255,255,255,.7)';
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText(nbBons + '/' + total + ' correctes', 28, 295);

  // Date (en bas à droite)
  ctx.fillStyle = 'rgba(255,255,255,.25)';
  ctx.font = '10px sans-serif';
  const dw = ctx.measureText(date).width;
  ctx.fillText(date, W - 28 - dw, H - 14);

  // Watermark
  ctx.fillStyle = 'rgba(212,175,55,.08)';
  ctx.font = 'bold 80px sans-serif';
  ctx.save();
  ctx.translate(W - 90, H - 30);
  ctx.rotate(-0.2);
  ctx.fillText('H', 0, 0);
  ctx.restore();

  const dataUrl = canvas.toDataURL('image/png');
  const dl = $('end-share-dl');
  if (dl) {
    dl.href = dataUrl;
    dl.style.display = 'inline-flex';
  }
  // Ouvrir dans un nouvel onglet pour aperçu immédiat
  const win = window.open();
  if (win) {
    win.document.write(`<html><head><title>Carte résultat</title><style>body{margin:0;background:#07090f;display:flex;align-items:center;justify-content:center;min-height:100vh}img{border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.7)}</style></head><body><img src="${dataUrl}"></body></html>`);
    win.document.close();
  }
}

// Génère le bloc "Valider mes acquis" — mis en valeur ou score si déjà fait (non refaisable)
function _boutonQuiz() {
  try {
    const r = JSON.parse(localStorage.getItem('horizon_quiz_result'));
    if (r) return `<div class="end-quiz-done">
      <div class="end-quiz-done-ic">🎓</div>
      <div class="end-quiz-done-score">${r.score}<span>/${r.total}</span></div>
      <div class="end-quiz-done-lbl">Quiz validé</div>
    </div>`;
  } catch(e) {}
  return `<div class="end-quiz-cta">
    <div class="end-quiz-cta-eyebrow">Étape finale</div>
    <div class="end-quiz-cta-title">Validez vos acquis</div>
    <div class="end-quiz-cta-sub">10 situations ancrées dans votre parcours — les bons réflexes à retenir</div>
    <button class="end-quiz-cta-btn" onclick="Quiz.start()">Commencer le quiz →</button>
  </div>`;
}

// Affiche l'écran diplôme après completion du quiz
function showDiploma() {
  const jauges     = etatJeu.gauges;
  const scoreMoyen = Math.round((jauges.i + jauges.p + jauges.m) / 3);
  const nbMauvais  = etatJeu.choices.filter(c => c === 'bad').length;
  const prenom     = etatJeu.playerFirst || '';
  const nom        = etatJeu.playerLast  || '';
  const date       = new Date().toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' });

  let quizScore = 0, quizTotal = 10;
  try {
    const r = JSON.parse(localStorage.getItem('horizon_quiz_result'));
    if (r) { quizScore = r.score; quizTotal = r.total; }
  } catch(e) {}

  const profil     = nbMauvais >= 2 ? 'En formation' : nbMauvais === 1 ? 'Avertissement formel' : 'Certifié Intégrité';
  const coulProfil = nbMauvais >= 2 ? '#ef4444' : nbMauvais === 1 ? '#d4af37' : '#22c55e';
  const quizLabel  = quizScore >= 8 ? 'Excellente maîtrise' : quizScore >= 6 ? 'Acquis partiels' : 'Points à consolider';
  const quizCoul   = quizScore >= 8 ? '#22c55e' : quizScore >= 6 ? '#d4af37' : '#ef4444';

  const scoreGlobal = Math.round((scoreMoyen + quizScore * 10) / 2);

  const html = `
    <div class="diploma-wrap">
      <div class="diploma-card">
        <div class="diploma-header">
          <div class="diploma-logo">PROJET HORIZON</div>
          <div class="diploma-subtitle">Formation Anticorruption · Sapin II</div>
        </div>
        <div class="diploma-rule"></div>
        <div class="diploma-certifie">Certifie que</div>
        <div class="diploma-name">${prenom} ${nom}</div>
        <div class="diploma-body">a suivi et complété le parcours de formation anticorruption <strong>Projet Horizon</strong>, incluant ${etatJeu.choices.length} affaire${etatJeu.choices.length > 1 ? 's' : ''} de mise en situation et un quiz de validation des acquis.</div>
        <div class="diploma-rule"></div>
        <div class="diploma-scores">
          <div class="diploma-score-cell">
            <div class="diploma-score-lbl">Parcours</div>
            <div class="diploma-score-val" style="color:${coulProfil}">${scoreMoyen}%</div>
            <div class="diploma-score-tag" style="color:${coulProfil}">${profil}</div>
          </div>
          <div class="diploma-score-sep"></div>
          <div class="diploma-score-cell">
            <div class="diploma-score-lbl">Quiz</div>
            <div class="diploma-score-val" style="color:${quizCoul}">${quizScore}/${quizTotal}</div>
            <div class="diploma-score-tag" style="color:${quizCoul}">${quizLabel}</div>
          </div>
          <div class="diploma-score-sep"></div>
          <div class="diploma-score-cell diploma-score-global">
            <div class="diploma-score-lbl">Score global</div>
            <div class="diploma-score-val" style="color:var(--gold)">${scoreGlobal}%</div>
            <div class="diploma-score-tag" style="color:var(--gold)">Formation complète</div>
          </div>
        </div>
        <div class="diploma-rule"></div>
        <div class="diploma-footer">
          <div class="diploma-date">Délivré le ${date}</div>
          <div class="diploma-sig">Cécile Larade<br><span>Conception Projet Horizon</span></div>
        </div>
        <div class="diploma-watermark">H</div>
      </div>
      <div class="diploma-btns">
        <button class="btn-restart end-restart-light" onclick="location.reload()">↺ Rejouer</button>
      </div>
    </div>`;

  $('end-wrap').innerHTML = html;
  if (quizScore >= 8) setTimeout(_lancerConfetti, 100);
}

// Génère le bloc HTML des trois jauges finales
function _construireJaugesHTML(jauges) {
  return `
    <div class="end-gauges">
      <div class="eg-cell"><div class="eg-lbl">Intégrité</div><div class="eg-val" style="color:#22c55e">${jauges.i}%</div></div>
      <div class="eg-cell"><div class="eg-lbl">Performance</div><div class="eg-val" style="color:#60a0f8">${jauges.p}%</div></div>
      <div class="eg-cell"><div class="eg-lbl">Image SEM</div><div class="eg-val" style="color:#d888f8">${jauges.m}%</div></div>
    </div>`;
}

// ── Écran mauvais résultat (≥ 2 mauvais choix) ──────────────────
// Mise en scène : une de journal scandale, style dark
function _ecranMauvaisResultat(scoreMoyen, jaugesHTML, pointsHTML) {
  return `
    <div class="end-news-wrap">
      <div class="end-news-card">
        <div class="end-np-masthead">Journal de la Région</div>
        <div class="end-np-date">Édition spéciale · Affaires publiques</div>
        <div class="end-np-rule"></div>
        <div class="end-np-headline">Scandale à la SEM&nbsp;Horizon&nbsp;:<br>Un cadre mis en examen</div>
        <div class="end-np-rule"></div>
        <div class="end-np-body">Le Parquet National Financier a ouvert une information judiciaire contre un(e) responsable de la SEM Horizon. Plusieurs irrégularités graves ont été mises en évidence lors d'un audit de la chambre régionale des comptes : corruption, favoritisme, trafic d'influence. Le projet Horizon est placé sous tutelle judiciaire. La direction générale a présenté sa démission.</div>
      </div>
      <div class="end-score-block">
        <div class="end-score-lbl">Score de conformité</div>
        <span class="end-score-bad">${scoreMoyen}%</span>
        <div class="end-verdict-mono">Score insuffisant</div>
      </div>
      ${jaugesHTML}
      ${pointsHTML}
      ${_boutonQuiz()}
      <div class="end-btns">
        <button class="btn-train" onclick="alert('→ Redirection vers le module de formation anticorruption')">📚 Formation obligatoire</button>
        <button class="btn-restart end-restart-light" onclick="location.reload()">↺ Rejouer</button>
      </div>
    </div>`;
}

// ── Écran résultat moyen (1 mauvais choix) ───────────────────────
// Mise en scène : lettre d'avertissement formel, style dark
function _ecranResultatMoyen(scoreMoyen, jaugesHTML, pointsHTML) {
  return `
    <div class="end-warning-wrap">
      <div class="end-warning-doc">
        <div class="end-warning-stamp">À traiter en priorité</div>
        <div class="end-warning-header">
          <div class="end-warning-sem">SEM HORIZON</div>
          <div class="end-warning-ref">RH-2024-112 · CONFIDENTIEL</div>
        </div>
        <div class="end-warning-title">Avertissement Formel</div>
        <div class="end-warning-body">Suite aux événements survenus lors du projet Horizon, la direction générale vous adresse le présent avertissement formel. Des manquements aux règles de probité ont été constatés. Une vigilance renforcée est requise pour toute future mission. Une formation anticorruption vous est prescrite dans un délai de 30 jours.</div>
        <div class="end-warning-sig">Dominique<br><span>Directeur Général — SEM Horizon</span></div>
      </div>
      <div class="end-score-block">
        <div class="end-score-lbl">Score de conformité</div>
        <span class="end-score-warn">${scoreMoyen}%</span>
        <div class="end-verdict-mono">Vigilance requise</div>
      </div>
      <div class="end-dom-quote">« Un avertissement formel, c'est une chance. La prochaine fois, ce ne sera peut-être plus de ma main que ça viendra. » — Dominique</div>
      ${jaugesHTML}
      ${pointsHTML}
      ${_boutonQuiz()}
      <div class="end-btns">
        <button class="btn-train" onclick="alert('→ Redirection vers le module de formation anticorruption')">📚 Formation recommandée</button>
        <button class="btn-restart end-restart-light" onclick="location.reload()">↺ Rejouer</button>
      </div>
    </div>`;
}

// ── Écran bon résultat (0 mauvais choix) ────────────────────────
// Mise en scène : badge "Certifié Intégrité" + confetti
function _ecranBonResultat(scoreMoyen, nbBons, jaugesHTML, pointsHTML) {

  const verdict = nbBons >= 6
    ? 'Référence Anticorruption'
    : 'Bonne posture éthique';
  const citation = nbBons >= 6
    ? '"Bravo. Le centre Horizon est une réussite. Vous avez sauvé la réputation de la SEM." — Dominique'
    : '"Le centre est ouvert. Quelques zones grises méritent attention. Gardez ce niveau d\'exigence." — Dominique';

  // Lance les confetti après mise à jour du DOM
  setTimeout(_lancerConfetti, 100);

  return `
    <div class="end-certified">
      <div class="end-cert-badge">
        <div class="end-cert-check">✓</div>
        <div class="end-cert-label">Certifié Intégrité</div>
      </div>
      <div class="end-cert-score">${scoreMoyen}%</div>
      <div class="end-cert-verdict">${verdict}</div>
      <blockquote class="end-quote">${citation}</blockquote>
      ${jaugesHTML}
      ${pointsHTML}
      ${_boutonQuiz()}
      <div class="end-btns">
        <button class="btn-restart end-restart-light" onclick="location.reload()">↺ Rejouer</button>
      </div>
      <div class="end-confetti" id="end-confetti"></div>
    </div>`;
}

// ── Points d'attention ──────────────────────────────────────────
// Génère la section récapitulative des choix warn/bad pour l'écran de fin
// Cap à 5 entrées, bad avant warn
function _construirePointsAttentionHTML() {
  const details = etatJeu.choiceDetails || [];
  const alertes = details.filter(d => d.type === 'bad' || d.type === 'warn');
  if (alertes.length === 0) {
    return `<div class="pa-section"><div class="pa-all-good">✅ Parcours irréprochable — aucun écart déontologique détecté</div></div>`;
  }
  // Trier : bad en premier, warn ensuite ; cap à 5
  const triees = [...alertes]
    .sort((a, b) => (a.type === 'bad' ? 0 : 1) - (b.type === 'bad' ? 0 : 1))
    .slice(0, 5);

  const cardsHTML = triees.map(d => {
    const ch     = CHAPTERS[d.ch] || {};
    const geste  = ch.recap && ch.recap.gestures && ch.recap.gestures[0] ? ch.recap.gestures[0] : '';
    const classe = d.type === 'bad' ? 'pa-card-bad' : 'pa-card-warn';
    const tag    = d.type === 'bad' ? '🔴 Risque pénal' : '⚠️ Point de vigilance';
    return `
      <div class="pa-card ${classe}">
        <div class="pa-card-header">
          <span class="pa-card-num">${ch.num || ''}</span>
          <span class="pa-card-tag">${tag}</span>
        </div>
        <div class="pa-card-name">${ch.name || ''}</div>
        <div class="pa-card-choice">Choix : ${d.desc}</div>
        <div class="pa-card-legal">⚖ ${d.vTitle}</div>
        ${geste ? `<div class="pa-card-reflex">💡 Bon réflexe : ${geste}</div>` : ''}
      </div>`;
  }).join('');

  return `<div class="pa-section"><div class="pa-title">⚠️ Points d'attention sur votre parcours</div>${cardsHTML}</div>`;
}

// Génère les pièces de confetti dans le conteneur #end-confetti
function _lancerConfetti() {
  const conteneur = $('end-confetti');
  if (!conteneur) return;
  for (let i = 0; i < 50; i++) {
    const piece  = document.createElement('div');
    piece.className = 'confetti-piece';
    const teinte = 30 + Math.random() * 50;
    piece.style.cssText = `left:${Math.random()*100}%;animation-delay:${Math.random()*3}s;animation-duration:${3+Math.random()*2.5}s;background:hsl(${teinte},80%,${55+Math.random()*20}%);width:${4+Math.random()*5}px;height:${4+Math.random()*5}px;transform:rotate(${Math.random()*360}deg);`;
    conteneur.appendChild(piece);
  }
}
