// ═══════════════════════════════════════════════════════════════
// CHECKPOINT — Sauvegarde et rechargement de partie
// Clé localStorage : 'horizon_checkpoint_<prenom>_<nom>'
// Une sauvegarde par joueur (prénom+nom), migration auto depuis
// l'ancienne clé globale 'horizon_checkpoint'.
// ═══════════════════════════════════════════════════════════════

const Checkpoint = (() => {
  const KEY_PREFIX = 'horizon_checkpoint_';

  // ── Clé spécifique au joueur courant ─────────────────────────
  function _keyForPlayer(prenom, nom) {
    const name = [prenom || '', nom || ''].join('_').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_]/g, '').replace(/__+/g, '_').replace(/^_|_$/g, '');
    return KEY_PREFIX + (name || 'anon');
  }
  function _currentKey() {
    const ej = (typeof etatJeu !== 'undefined') ? etatJeu : {};
    return _keyForPlayer(ej.playerFirst, ej.playerLast);
  }

  // ── Stockage brut ────────────────────────────────────────────
  function _get(key) {
    try { return JSON.parse(localStorage.getItem(key || _currentKey())); }
    catch (e) { return null; }
  }
  function _set(data) {
    try { localStorage.setItem(_currentKey(), JSON.stringify(data)); }
    catch (e) {}
  }

  // ── Migration depuis l'ancienne clé globale (one-time) ───────
  (function _migrerAnciennesCles() {
    try {
      const old = localStorage.getItem('horizon_checkpoint');
      if (!old) return;
      const cp = JSON.parse(old);
      if (!cp || !cp.playerFirst) return;
      const newKey = _keyForPlayer(cp.playerFirst, cp.playerLast);
      if (!localStorage.getItem(newKey)) {
        localStorage.setItem(newKey, old);
      }
      localStorage.removeItem('horizon_checkpoint');
    } catch(e) {}
  })();

  // ── Liste toutes les sauvegardes disponibles ─────────────────
  function listerSauvegardes() {
    const saves = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(KEY_PREFIX)) continue;
      try {
        const data = JSON.parse(localStorage.getItem(key));
        if (data && data.playerFirst) saves.push({ key, data });
      } catch(e) {}
    }
    return saves.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  }

  // ── Formate le label de date d'un checkpoint ─────────────────
  function _labelCp(cp) {
    try {
      const d  = new Date(cp.date);
      const dd = d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const hh = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
      const num = (CHAPTERS[cp.affaireIdx] || {}).num || '';
      return num + (num ? ' — ' : '') + dd + ' ' + hh;
    } catch (e) { return ''; }
  }

  // ── Sauvegarde l'état courant ────────────────────────────────
  // Appelé automatiquement dans afterVerdict() et manuellement depuis le menu.
  function sauvegarder() {
    const badgesData = (typeof Badges !== 'undefined') ? Badges._loadRaw() : { unlocked: [] };
    const cp = {
      playerFirst:    etatJeu.playerFirst   || '',
      playerLast:     etatJeu.playerLast    || '',
      service:        etatJeu.service,
      chOrder:        etatJeu.chOrder.slice(),
      chPos:          etatJeu.chPos + 1,     // pointe vers la PROCHAINE affaire à jouer
      priorityCount:  etatJeu.priorityCount,
      gauges:         { ...etatJeu.gauges },
      choices:        etatJeu.choices.slice(),
      choiceDetails:  etatJeu.choiceDetails.slice(),
      memoire:        { ...etatJeu.memoire },
      badgesUnlocked: badgesData.unlocked.slice(),
      date:           new Date().toISOString(),
      affaireIdx:     etatJeu.ch,
      affaireTitre:   (CHAPTERS[etatJeu.ch] || {}).name || '',
    };
    _set(cp);
    _afficherNotif(cp);
    return cp;
  }

  // ── Charge depuis localStorage ───────────────────────────────
  function charger() { return _get(); }

  // ── Supprime le checkpoint du joueur courant ──────────────────
  function supprimer() {
    try { localStorage.removeItem(_currentKey()); } catch(e) {}
    majAffichage();
  }

  // ── Restaure l'état complet et lance l'affaire suivante ──────
  function restaurer(cp) {
    if (!cp) return;

    etatJeu.playerFirst   = cp.playerFirst;
    etatJeu.playerLast    = cp.playerLast;
    etatJeu.service       = cp.service;
    etatJeu.chOrder       = cp.chOrder.slice();
    // chPos = index de l'affaire relancée dans chOrder.
    // afterVerdict() calcule positionSuivante = chPos + 1, donc
    // chPos doit être la position courante (affaire relancée).
    etatJeu.chPos         = cp.chPos;
    etatJeu.priorityCount = cp.priorityCount;
    etatJeu.gauges        = { ...cp.gauges };
    etatJeu.choices       = cp.choices.slice();
    etatJeu.choiceDetails = cp.choiceDetails.slice();
    etatJeu.memoire       = { ...(cp.memoire || {}) };

    // Restaurer les badges
    if (typeof Badges !== 'undefined') {
      Badges._restoreUnlocked(cp.badgesUnlocked || []);
    }

    // Initialiser le tracker pour cette session
    const nom = [cp.playerFirst, cp.playerLast].filter(Boolean).join(' ');
    if (typeof Tracker !== 'undefined') {
      Tracker.init(nom, cp.service, cp.chOrder, cp.priorityCount);
    }
    if (typeof Memoire !== 'undefined') {
      Memoire.chargerMemoire(nom);
    }

    // Mettre à jour HUD
    ['hud', 'cdots', 'lex-btn', 'sound-btn', 'badges-btn'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.classList.add('on');
    });
    if (typeof updateHUD === 'function') updateHUD();
    if (typeof updateDots === 'function') updateDots();

    // Masquer tous les écrans d'accueil/menu
    ['accueil-overlay', 'home-overlay', 'parcours', 'service-select', 'splash',
     'map-select', 'demo-overlay', 'intro'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.classList.remove('on');
      if (id === 'intro') el.style.display = 'none';
    });
    if (typeof hideAll === 'function') hideAll();
    if (typeof showChar === 'function') { showChar('cl', null); showChar('cr', null); }

    // Lancer l'affaire sauvegardée (la prochaine non encore jouée)
    const prochainIdx = cp.chOrder[cp.chPos];
    if (typeof loadChapter === 'function') loadChapter(prochainIdx);
  }

  // ── Notification slide-in ────────────────────────────────────
  function _afficherNotif(cp) {
    const notif = document.getElementById('notif-save');
    if (!notif) return;
    const num = (CHAPTERS[cp.affaireIdx] || {}).num || '';
    notif.innerHTML = `<span class="notif-save-ic">💾</span><span>Partie sauvegard\u00e9e<br><small>${num} compl\u00e9t\u00e9e</small></span>`;
    notif.classList.add('visible');
    clearTimeout(notif._hideTimer);
    notif._hideTimer = setTimeout(() => notif.classList.remove('visible'), 2500);
  }

  // ── Mise à jour de l'affichage (bouton accueil) ──────────────
  function majAffichage() {
    const cp  = _get();
    const btn = document.getElementById('accueil-btn-reprendre');
    if (!btn) return;
    btn.style.display = cp ? '' : 'none';
    if (cp) {
      const sub = document.getElementById('accueil-reprendre-sub');
      if (sub) {
        const nom = [cp.playerFirst, cp.playerLast].filter(Boolean).join(' ');
        sub.textContent = nom + ' — ' + _labelCp(cp);
      }
    }
  }

  // ── HTML du bandeau checkpoint pour showParcours() ───────────
  function bandeauHTML() {
    const cp = _get();
    if (!cp) return '';
    const joueur = [cp.playerFirst, cp.playerLast].filter(Boolean).join(' ');
    return `<div class="cp-bandeau" id="cp-bandeau">
      <span class="cp-bandeau-ic">💾</span>
      <span class="cp-bandeau-txt">Sauvegarde de <strong>${joueur}</strong> \u2014 ${(CHAPTERS[cp.affaireIdx] || {}).num || ''} \u2014 ${_labelCp(cp)}</span>
      <button class="cp-bandeau-btn" onclick="Checkpoint.restaurer(Checkpoint.charger())">Reprendre \u2192</button>
      <button class="cp-bandeau-del" onclick="Checkpoint.supprimer();var b=document.getElementById('cp-bandeau');if(b)b.remove();">\u2715</button>
    </div>`;
  }

  // ── Sauvegarde manuelle avec confirmation si checkpoint existant ──
  function sauvegarderAvecConfirm() {
    const cp = _get();
    if (!cp) {
      sauvegarder();
      if (typeof closeHomeOverlay === 'function') closeHomeOverlay();
      return;
    }
    const d     = new Date(cp.date);
    const joueur = [cp.playerFirst, cp.playerLast].filter(Boolean).join(' ');
    const label = joueur + ' — ' + (cp.affaireTitre || (CHAPTERS[cp.affaireIdx] || {}).name || '') +
                  '\nSauvegard\u00e9e le ' + d.toLocaleDateString('fr-FR') +
                  ' \u00e0 ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    _afficherModalConfirm(label, () => {
      sauvegarder();
      if (typeof closeHomeOverlay === 'function') closeHomeOverlay();
    });
  }

  // ── Modal de confirmation d'écrasement ───────────────────────
  function _afficherModalConfirm(label, onConfirm) {
    const existing = document.getElementById('cp-modal');
    if (existing) existing.remove();
    const modal = document.createElement('div');
    modal.id = 'cp-modal';
    modal.innerHTML = `
      <div class="cp-modal-box">
        <div class="cp-modal-title">Écraser la sauvegarde ?</div>
        <div class="cp-modal-msg">Une sauvegarde existe déjà :<br><em>${label.replace(/\n/g, '<br>')}</em></div>
        <div class="cp-modal-actions">
          <button class="cp-modal-btn cp-modal-danger"  id="cp-modal-ok">Oui, écraser</button>
          <button class="cp-modal-btn cp-modal-cancel"  id="cp-modal-cancel">Annuler</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    document.getElementById('cp-modal-ok').onclick     = () => { modal.remove(); onConfirm(); };
    document.getElementById('cp-modal-cancel').onclick = () => modal.remove();
  }

  // ── API publique ─────────────────────────────────────────────
  return {
    sauvegarder,
    charger,
    supprimer,
    restaurer,
    sauvegarderAvecConfirm,
    bandeauHTML,
    majAffichage,
    listerSauvegardes,
    _keyForPlayer,
  };
})();
