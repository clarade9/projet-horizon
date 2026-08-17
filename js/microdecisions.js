// ═══════════════════════════════════════════════════════════════
// MICRO-DÉCISIONS — Sous-décisions intermédiaires avant le dialogue
// ═══════════════════════════════════════════════════════════════

let _ordreMicroChoix = []; // ordre mélangé des options de la micro-décision

// Affiche la micro-décision d'index idx (0 = avant le dialogue, 1 = avant l'investigation)
function showMicroDecision(idx) {
  etatJeu.phase = 'micro-' + idx;
  const chapitre      = CHAPTERS[etatJeu.ch];
  const microDecision = chapitre.microDecisions[idx];

  // Mélange les 3 options pour éviter que la bonne réponse soit toujours à la même place
  _ordreMicroChoix = melangerTableau([0, 1, 2]);

  $('micro-sit').innerHTML = microDecision.situation;
  for (let i = 0; i < 3; i++) {
    $('m' + i + 'd').textContent = microDecision.choices[_ordreMicroChoix[i]].desc;
  }

  if (microDecision.phoneRing) {
    // Animation téléphone plein écran avant d'afficher le panel MD
    const sceneKey = etatJeu.sceneOverride || chapitre.sc || '';
    const imgFile  = typeof _phoneImgFromScene === 'function'
      ? _phoneImgFromScene(sceneKey)
      : 'telephonerenaud.webp';
    showPhoneAnimation(imgFile, () => $('micro-panel').classList.remove('hidden'));
    return;
  }
  $('micro-panel').classList.remove('hidden');
}

// Traite le choix du joueur dans la micro-décision
// — applique les jauges si c'est la MD2, affiche la réaction narrative,
//   puis enchaîne vers la phase suivante
function chooseMicro(visibleIdx) {
  const idxMicro      = parseInt(etatJeu.phase.split('-')[1]);
  const chapitre      = CHAPTERS[etatJeu.ch];
  const microDecision = chapitre.microDecisions[idxMicro];
  const choix         = microDecision.choices[_ordreMicroChoix[visibleIdx]];

  $('micro-panel').classList.add('hidden');

  // MD1 : adapte la scène et recompile le dialogue selon le choix
  let _pendingMusicAfter = null;
  if (idxMicro === 0) {
    if (choix.sceneAfter || choix.transitionTxt || choix.dialoguePatch || choix.dialogueInject || choix.dialogueInjectAt) {
      // Scène alternative
      if (choix.sceneAfter) {
        etatJeu.sceneOverride = choix.sceneAfter;
        buildScene(choix.sceneAfter);
      }
      // Hotspots adaptés à la nouvelle scène
      if (choix.hotspotsOverride) {
        etatJeu.hotspotsOverride = choix.hotspotsOverride;
      }
      // Recompile le dialogue si nécessaire
      if (choix.transitionTxt || choix.dialoguePatch || choix.dialogueInject) {
        let dlg = CHAPTERS[etatJeu.ch].dialogue.map(l => Object.assign({}, l));
        // 1. Patches sur les lignes existantes (indices originaux)
        if (choix.dialoguePatch) {
          for (const p of choix.dialoguePatch) {
            if (dlg[p.idx]) dlg[p.idx] = Object.assign({}, dlg[p.idx], p);
          }
        }
        // 2. Remplacement de la transition (ligne 0)
        if (choix.transitionTxt) {
          dlg[0] = Object.assign({}, dlg[0], { txt: choix.transitionTxt });
        }
        // 3. Injection de lignes après l'index 0
        if (choix.dialogueInject) {
          dlg.splice(1, 0, ...choix.dialogueInject);
        }
        // 4. Injection à une position précise (tri décroissant pour préserver les indices)
        if (choix.dialogueInjectAt) {
          const injections = [...choix.dialogueInjectAt].sort((a, b) => b.after - a.after);
          for (const {after, lines} of injections) {
            dlg.splice(after + 1, 0, ...lines);
          }
        }
        etatJeu.dialogueOverride = dlg;
      }
    }
    // Changement de musique selon le lieu choisi
    if (choix.musicAfter) {
      if (choix.sceneAtLine0) {
        _pendingMusicAfter = choix.musicAfter; // appliqué quand la scène change
      } else {
        AudioEngine.switchTrack(choix.musicAfter);
      }
    }
  }

  // La MD2 (index 1) a un impact réel sur les jauges
  if (idxMicro === 1 && choix.gauges) {
    applyGauges(choix.gauges);
    if (choix.tint) flashGaugeTint();
  }

  // Affiche la réaction du personnage dans la boîte de dialogue
  const reaction  = choix.reaction;
  const personnageJoueur = {
    css: 'c-joueur',
    em:  '👤',
    nm:  (etatJeu.playerFirst || 'Vous') + ' — ' + chapitre.playerRole,
  };

  if (reaction.ch) {
    showChar('cl', personnageJoueur);
    showChar('cr', reaction.ch);
    setSpeaking('cr');
  } else {
    showChar('cl', null);
    showChar('cr', null);
    setSpeaking(null);
  }

  $('dlg').classList.remove('hidden');
  $('dlg-spk').textContent = spName(reaction.sp);
  twStart($('dlg-txt'), subst(reaction.txt), CONFIG.dialogue.vitesseDefilement);

  // Après la réaction : MD1 → dialogue | MD2 → investigation
  // postReaction : tableau optionnel de lignes { sp, ch, sc, txt } affichées après la reaction
  const _afterPostReaction = () => {
    if (idxMicro === 0) {
      hideDlg();
      $('dlg').onclick  = advDialogue;
      etatJeu.phase     = 'dialogue';
      etatJeu.dlgIdx    = 0;
      if (choix.sceneAtLine0) {
        etatJeu.sceneOverride = choix.sceneAtLine0;
      }
      if (_pendingMusicAfter) {
        AudioEngine.switchTrack(_pendingMusicAfter);
        _pendingMusicAfter = null;
      }
      showDialogueLine();
    } else {
      hideDlg();
      $('dlg').onclick = advDialogue;
      startInvestigation();
    }
  };

  if (choix.postReaction && choix.postReaction.length > 0) {
    let postIdx = 0;
    const showPostLine = () => {
      if (postIdx >= choix.postReaction.length) { _afterPostReaction(); return; }
      const l = choix.postReaction[postIdx++];
      if (l.sc) buildScene(l.sc);
      if (l.ch) {
        showChar('cl', personnageJoueur);
        showChar('cr', l.ch);
        setSpeaking('cr');
      } else {
        showChar('cl', null);
        showChar('cr', null);
        setSpeaking(null);
      }
      $('dlg-spk').textContent = spName(l.sp);
      twStart($('dlg-txt'), subst(l.txt), CONFIG.dialogue.vitesseDefilement);
      $('dlg').onclick = () => { twComplete(); showPostLine(); };
    };
    $('dlg').onclick = () => { twComplete(); showPostLine(); };
  } else {
    $('dlg').onclick = () => _afterPostReaction();
  }
}

// Fait clignoter le HUD en rouge pour signaler une perte sur les jauges
function flashGaugeTint() {
  const hud = $('hud');
  hud.classList.add('hud-tint');
  setTimeout(() => hud.classList.remove('hud-tint'), 2200);
}
