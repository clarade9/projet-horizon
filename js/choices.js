// ═══════════════════════════════════════════════════════════════
// CHOIX — Carte de contexte, panel de choix et verdict
// ═══════════════════════════════════════════════════════════════

// Affiche la carte de contexte du chapitre (rôle du joueur + description de la situation)
function showContext(chapitre) {
  const ctx = chapitre.context;
  $('ctx-inner').innerHTML = `
    <div class="ctx-eye">${ctx.eye}</div>
    <div class="ctx-role"><div class="ctx-role-dot"></div><div class="ctx-role-text">${etatJeu.playerFirst ? etatJeu.playerFirst + ' — ' + chapitre.playerRole : chapitre.playerRole}</div></div>
    <div class="ctx-title">${ctx.title}</div>
    <div class="ctx-body">${subst(ctx.body)}</div>
    <button class="ctx-btn" onclick="closeContext()">Entrer en scène →</button>`;
  $('ctx').classList.add('on');
}

// Ferme la carte de contexte et lance la première phase du chapitre
// (lignes mémoire → preDialogue si défini → micro-décision si elle existe → sinon dialogue directement)
function closeContext() {
  $('ctx').classList.remove('on');
  const chapitre = CHAPTERS[etatJeu.ch];
  const hasMD    = chapitre.microDecisions && chapitre.microDecisions.length > 0;

  // Lignes de mémoire narrative : injectées avant tout, si le module Memoire est actif
  const lignesMem = (typeof Memoire !== 'undefined') ? Memoire.lignesMemoire(etatJeu.ch) : [];

  // preDialogue fusionné avec les lignes mémoire (mémoire en premier)
  const preDlgSource = [
    ...lignesMem,
    ...(chapitre.preDialogue || []),
  ];

  // preDialogue (+ lignes mémoire) : affichés après le contexte et avant la MD0
  if (preDlgSource.length > 0) {
    let preDlgIdx = 0;
    const afterPreDlg = () => {
      hideDlg();
      if (hasMD) {
        showMicroDecision(0);
      } else {
        etatJeu.phase = 'dialogue';
        etatJeu.dlgIdx = 0;
        $('dlg').onclick = advDialogue;
        showDialogueLine();
      }
    };
    const showPreLine = () => {
      if (preDlgIdx >= preDlgSource.length) { afterPreDlg(); return; }
      const l = preDlgSource[preDlgIdx++];
      if (l.sc) buildScene(l.sc);
      $('dlg').classList.remove('hidden');
      $('dlg-spk').textContent = l.sp;
      const cls = l.memoire ? 'dlg-memoire' : '';
      if (cls) $('dlg-txt').className = 'dlg-text ' + cls; else $('dlg-txt').className = 'dlg-text';
      twStart($('dlg-txt'), subst(l.txt), CONFIG.dialogue.vitesseDefilement);
      setSpeaking(null);
      $('dlg').onclick = () => { twComplete(); showPreLine(); };
    };
    showPreLine();
    return;
  }

  if (hasMD) {
    showMicroDecision(0);
  } else {
    etatJeu.phase    = 'dialogue';
    etatJeu.dlgIdx   = 0;
    $('dlg').onclick = advDialogue;
    showDialogueLine();
  }
}

// Affiche le panel de choix avec les 3 options mélangées aléatoirement
// (pour que la "bonne réponse" ne soit pas toujours à la même position)
let _choiceShownAt = 0; // timestamp d'affichage du panel de choix

function showChoicePanel() {
  etatJeu.phase = 'choice';
  _choiceShownAt = Date.now();
  const chapitre = CHAPTERS[etatJeu.ch];
  etatJeu.choiceOrder = melangerTableau([0, 1, 2]);
  for (let i = 0; i < 3; i++) {
    $('c' + i + 'd').textContent = chapitre.choices[etatJeu.choiceOrder[i]].desc;
  }
  const pressureEl = $('choices-pressure');
  if (pressureEl) pressureEl.textContent = chapitre.pressureIntro || '';
  $('choices').classList.remove('hidden');
  if (typeof _updateNavButtons === 'function') _updateNavButtons();
  if (typeof TimerPression !== 'undefined') TimerPression.demarrer(etatJeu.ch);
}

// Enregistre le choix du joueur, applique les effets sur les jauges et affiche le verdict
function choose(visibleIdx) {
  if (etatJeu.phase !== 'choice') return;
  etatJeu.phase = 'verdict';
  $('choices').classList.add('hidden');
  closeSOS();
  if (typeof TimerPression !== 'undefined') TimerPression.arreter();

  const chapitre = CHAPTERS[etatJeu.ch];
  const choix    = chapitre.choices[etatJeu.choiceOrder[visibleIdx]];

  // ── MODE SECOND ESSAI : pas de sauvegarde, verdict simplifié ──
  if (etatJeu.secondEssai) {
    _chooseSecondEssai(choix);
    return;
  }

  etatJeu.choices.push(choix.type);
  etatJeu.choiceDetails.push({
    ch:     etatJeu.ch,
    type:   choix.type,
    desc:   choix.desc,
    vTitle: choix.vTitle,
  });

  // decisionRapide : < 15s entre l'affichage du panel et le choix
  etatJeu.decisionRapide = _choiceShownAt > 0 && choix.type === 'good'
    && (Date.now() - _choiceShownAt) < 15000;

  // streakApresEchec : bonnes décisions consécutives depuis la dernière mauvaise
  if (choix.type === 'good') {
    const hadBad = etatJeu.choices.slice(0, -1).includes('bad');
    if (hadBad) etatJeu.streakApresEchec++;
  } else {
    etatJeu.streakApresEchec = 0;
  }

  // Streak UI : bonnes décisions consécutives (toutes)
  if (choix.type === 'good') {
    etatJeu.streak++;
    if (etatJeu.streak >= 3) showStreakAnimation(etatJeu.streak);
  } else {
    etatJeu.streak = 0;
  }
  updateStreakHUD();
  if (typeof Memoire !== 'undefined') {
    const lettreData = ['A', 'B', 'C'][etatJeu.choiceOrder[visibleIdx]];
    Memoire.enregistrerChoix(etatJeu.ch, choix.type, lettreData);
  }
  Tracker.recordChoice(etatJeu.ch, choix.type, choix.gauges);
  Badges.check('chapterEnd', { chIdx: etatJeu.ch, type: choix.type });

  // Supabase : enregistrement du choix en arrière-plan
  if (typeof SB !== 'undefined') {
    const lettre     = ['A', 'B', 'C'][visibleIdx];
    const sosUtilise = Tracker.sosUsedForChapter(etatJeu.ch);
    SB.sauvegarderChoix(chapitre.num, lettre, choix.type, sosUtilise);
  }
  applyGauges(choix.gauges);

  const pillsHTML = _buildPillsHTML(choix.gauges);

  // Bouton "Rejouer" uniquement pour bad/warn
  const btnRejouer = (choix.type === 'bad' || choix.type === 'warn')
    ? `<button class="btn-second-essai" onclick="startSecondEssai()">↩ Rejouer avec les bons réflexes</button>`
    : '';

  $('vd-inner').innerHTML = `
    <div class="vd-badge ${choix.bc}">${choix.badge}</div>
    <div class="vd-title">${choix.vTitle}</div>
    <div class="vd-consequence">${subst(choix.vConsequence)}</div>
    <div class="vd-legal ${choix.lc}"><div class="vd-legal-lbl">⚖ Analyse juridique</div><div class="vd-legal-text">${subst(choix.vLegal)}</div></div>
    <div class="vd-pills">${pillsHTML}</div>
    <button class="vd-btn" onclick="_afterVerdict()">Ce qu'il faut retenir →</button>
    ${btnRejouer}`;
  AudioEngine.fadeOut();
  $('verdict').classList.add('on');
}

// Verdict en mode second essai : pas de save, message contextuel
function _chooseSecondEssai(choix) {
  AudioEngine.fadeOut();

  let msg, btnHtml;
  if (choix.type === 'good') {
    msg     = `<div class="se-msg se-msg-good">✓ Parfait ! Vous avez appliqué les bons réflexes.</div>`;
    btnHtml = `<button class="vd-btn" onclick="_finSecondEssai()">Continuer vers l'affaire suivante →</button>`;
  } else {
    msg     = `<div class="se-msg se-msg-warn">Encore quelques ajustements — la fiche récap vous aidera.</div>`;
    btnHtml = `
      <button class="vd-btn" onclick="_seVoirRecap()">Voir la fiche récap →</button>
      <button class="btn-second-essai" onclick="_finSecondEssai()">Continuer quand même</button>`;
  }

  $('vd-inner').innerHTML = `
    <div class="vd-badge ${choix.bc}">${choix.badge}</div>
    <div class="vd-title">${choix.vTitle}</div>
    <div class="vd-consequence">${subst(choix.vConsequence)}</div>
    ${msg}
    ${btnHtml}`;
  $('verdict').classList.add('on');
}

// En second essai warn/bad : affiche la recap puis continue sans rescorer
function _seVoirRecap() {
  $('verdict').classList.remove('on');
  const chapitre = CHAPTERS[etatJeu.ch];
  if (!chapitre.recap) { _finSecondEssai(); return; }

  const recap      = chapitre.recap;
  const gestesHtml = recap.gestures.map(g => `<li>${g}</li>`).join('');
  const jurisHtml  = recap.jurisprudence ? `
    <div class="recap-jurisprudence">
      <div class="recap-juris-lbl"><i class="ti ti-gavel"></i> Cas réel similaire</div>
      <div class="recap-juris-titre">${recap.jurisprudence.titre}</div>
      <div class="recap-juris-resume">${recap.jurisprudence.resume}</div>
      <div class="recap-juris-source">${recap.jurisprudence.source}</div>
    </div>` : '';
  $('recap-inner').innerHTML = `
    <div class="rcp-eyebrow">🎓 Ce qu'il faut retenir — ${chapitre.num}</div>
    <div class="rcp-risk">${recap.risk}</div>
    <div class="rcp-def">${recap.definition}</div>
    <div class="rcp-gestures-title">Les 3 gestes barrières</div>
    <ul class="rcp-gestures">${gestesHtml}</ul>
    <div class="rcp-reallife">
      <div class="rcp-rl-title">📋 Et dans la vraie vie ?</div>
      <div class="rcp-rl-body">${recap.realLife}</div>
    </div>
    ${jurisHtml}
    <button class="rcp-btn" onclick="_finSecondEssai()">Affaire suivante →</button>`;
  $('hud').classList.remove('on');
  $('recap').classList.add('on');
}

// Helper : construit les pills de jauges
function _buildPillsHTML(gauges) {
  return [
    { l: 'Intégrité',  v: gauges.i },
    { l: 'Projet',     v: gauges.p },
    { l: 'Image SEM',  v: gauges.m },
  ].map(x => {
    const signe  = x.v > 0 ? '+' : '';
    const classe = x.v > 0 ? 'up' : x.v < 0 ? 'dn' : 'nt';
    return `<div class="pill">${x.l} <span class="${classe}">${signe}${x.v}</span></div>`;
  }).join('');
}

// Après le verdict : affiche l'analyse Réflexe Pro si disponible, puis la fiche récap
function _afterVerdict() {
  const data = (typeof REFLEXE_DATA !== 'undefined') ? REFLEXE_DATA[etatJeu.ch] : null;
  if (data && data.analysereflexe && etatJeu.reflexeResult) {
    $('verdict').classList.remove('on');
    rpAfficherAnalyseComplete();
  } else {
    showRecap();
  }
}
