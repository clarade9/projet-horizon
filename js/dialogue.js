// ═══════════════════════════════════════
// MACHINE À ÉCRIRE — moteur typewriter
// ═══════════════════════════════════════
let _twTimer  = null;   // setInterval handle
let _twTokens = [];     // [{type:'tag'|'char', val:string}]
let _twIdx    = 0;
let _twEl     = null;
let _twMs     = CONFIG.dialogue.vitesseDefilement;
let _twDone   = false;

// Parse HTML en tokens : balises complètes = 1 token, chaque char visible = 1 token
function _parseTwTokens(html) {
  const tokens = [];
  let i = 0;
  while (i < html.length) {
    if (html[i] === '<') {
      const end = html.indexOf('>', i);
      if (end === -1) { tokens.push({ type: 'char', val: html[i++] }); continue; }
      tokens.push({ type: 'tag', val: html.slice(i, end + 1) });
      i = end + 1;
    } else if (html[i] === '&') {
      // entité HTML (&nbsp; &amp; etc.) = 1 token visible
      const end = html.indexOf(';', i);
      if (end === -1) { tokens.push({ type: 'char', val: html[i++] }); continue; }
      tokens.push({ type: 'char', val: html.slice(i, end + 1) });
      i = end + 1;
    } else {
      tokens.push({ type: 'char', val: html[i++] });
    }
  }
  return tokens;
}

function _twFlush() {
  if (!_twEl) return;
  _twEl.innerHTML = _twTokens.map(t => t.val).join('');
}

function twComplete() {
  if (_twTimer) { clearInterval(_twTimer); _twTimer = null; }
  if (_twEl && !_twDone) { _twFlush(); }
  _twDone = true;
  // Affiche l'indicateur "cliquer"
  const hint = document.querySelector('#dlg .dlg-hint');
  if (hint) hint.style.opacity = '';
}

// Intercepte le clic pendant l'écriture pour compléter instantanément
function _twClickCapture(e) {
  if (_twDone) return; // laisser passer pour avancer le dialogue
  e.stopPropagation();
  twComplete();
}

function twStart(el, html, ms) {
  // Annule un éventuel typewriter en cours
  if (_twTimer) { clearInterval(_twTimer); _twTimer = null; }

  _twEl     = el;
  _twMs     = ms || CONFIG.dialogue.vitesseDefilement;
  _twTokens = _parseTwTokens(html);
  _twIdx    = 0;
  _twDone   = false;
  el.innerHTML = '';

  // Cache l'indicateur "cliquer" pendant l'écriture
  const hint = document.querySelector('#dlg .dlg-hint');
  if (hint) hint.style.opacity = '0';

  // Enregistre le capture-listener une seule fois
  const dlg = document.getElementById('dlg');
  dlg.removeEventListener('click', _twClickCapture, true);
  dlg.addEventListener('click', _twClickCapture, true);

  _twTimer = setInterval(() => {
    if (_twIdx >= _twTokens.length) {
      clearInterval(_twTimer); _twTimer = null;
      _twDone = true;
      if (hint) hint.style.opacity = '';
      return;
    }
    // Avance en sautant les balises (pas de délai ni de son)
    while (_twIdx < _twTokens.length && _twTokens[_twIdx].type === 'tag') {
      _twIdx++;
    }
    if (_twIdx >= _twTokens.length) return;

    const tok = _twTokens[_twIdx++];
    // Reconstruit le innerHTML jusqu'ici
    el.innerHTML = _twTokens.slice(0, _twIdx).map(t => t.val).join('');
    if (typeof AudioEngine !== 'undefined') AudioEngine.sfx.typeKey();
  }, _twMs);
}

// ═══════════════════════════════════════
// DIALOGUE — Display & Advance
// ═══════════════════════════════════════
function showDlg(speaker, text, charId) {
  $('dlg').classList.remove('hidden');
  $('dlg-spk').textContent = spName(speaker);
  $('dlg-txt').className = 'dlg-text';   // efface .dlg-memoire et tout autre style ponctuel
  twStart($('dlg-txt'), subst(text), CONFIG.dialogue.vitesseDefilement);
  setSpeaking(charId);
}

function hideDlg() {
  twComplete();
  $('dlg').classList.add('hidden');
}

function showDialogueLine() {
  const ch      = CHAPTERS[etatJeu.ch];
  const dialogue = etatJeu.dialogueOverride || ch.dialogue;
  const l        = dialogue[etatJeu.dlgIdx];
  if (l.sc) buildScene(etatJeu.sceneOverride || l.sc);
  const isSelf = l.sp === 'Vous';
  const playerChar = { css: 'c-joueur', em: '👤', nm: (etatJeu.playerFirst || 'Vous') + ' — ' + ch.playerRole };
  showChar('cl', playerChar);
  showChar('cr', l.ch || null);
  if (l.phoneRing) {
    hideDlg();
    const img = _phoneImgFromScene(etatJeu.sceneOverride || l.sc || _currentSceneKey || '');
    showPhoneAnimation(img, () => showDlg(l.sp, l.txt, isSelf ? 'cl' : 'cr'));
  } else {
    showDlg(l.sp, l.txt, isSelf ? 'cl' : 'cr');
  }
  if (typeof _updateNavButtons === 'function') _updateNavButtons();
  // Précharge silencieusement la prochaine scène
  const nextLine = dialogue[etatJeu.dlgIdx + 1];
  if (nextLine && nextLine.sc) _preloadScene(etatJeu.sceneOverride || nextLine.sc);
}

function advDialogue() {
  AudioEngine.sfx.dialogueClick();
  etatJeu.dlgIdx++;
  const _dialogue = etatJeu.dialogueOverride || CHAPTERS[etatJeu.ch].dialogue;
  if (etatJeu.dlgIdx >= _dialogue.length) {
    hideDlg();
    const ch = CHAPTERS[etatJeu.ch];
    if (ch.microDecisions && ch.microDecisions.length > 1) {
      showMicroDecision(1);
    } else {
      startInvestigation();
    }
    return;
  }
  showDialogueLine();
}

// Retourne l'image téléphone correspondant à la scène courante
function _phoneImgFromScene(sceneKey) {
  const map = {
    'finance':       'telephonerenaud.webp',
    'bureau9':       'telephonefontaine.webp',
    'bureaularoche': 'telephonelaroche.webp',
    'bureauPerrin':  'telephoneperrin.webp',
    'mairie':        'telephoneperrin.webp',
  };
  return map[sceneKey] || 'telephonerenaud.webp';
}

// Précharge silencieusement l'image d'une scène (lazy loading)
function _preloadScene(sceneKey) {
  const map = {
    prologue:'prologue', rh:'bureau1', bureau1:'bureau1', bureauf:'bureauf',
    mairie:'mairie', bureau2:'bureau2', finance:'findumois',
    commercial:'contratatoutprix', tennis:'tennis', restojour:'restojour',
    bureau9:'bureau9', bureaularoche:'bureau9', bureauPerrin:'bureaujour', bureaujour:'bureaujour',
    resto:'resto', bistro:'bistro', sallereunion:'sallereunion',
    pesee:'pesee', indus:'indus', tutorial:'salle-formation', epilogue:'epilogue'
  };
  const name = map[sceneKey];
  if (name) { const img = new Image(); img.src = 'assets/scenes/' + name + '.webp'; }
}
