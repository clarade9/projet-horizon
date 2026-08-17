
// ═══════════════════════════════════════════════════════════════
// ÉTAT GLOBAL DU JEU
// Objet central lu et modifié par tous les modules du jeu.
// ═══════════════════════════════════════════════════════════════
let etatJeu = {
  phase:         'intro',         // phase courante : 'intro'|'prologue'|'dialogue'|'investigation'|'choice'|'verdict'|'epilogue'|'tutorial'|'transition'
  ch:            0,               // index du chapitre actuel (dans CHAPTERS[])
  dlgIdx:        0,               // index de la ligne de dialogue en cours
  invFound:      0,               // nombre d'indices trouvés dans l'investigation
  gauges:        { i: 70, p: 70, m: 70 }, // jauges : intégrité, projet, image SEM
  choices:       [],              // historique des types de choix : 'good'|'warn'|'bad'
  choiceDetails: [],              // détails de chaque choix pour l'écran de fin
  choiceOrder:   [0, 1, 2],       // ordre d'affichage des choix (mélangé à chaque chapitre)
  chOrder:       [0,1,2,3,4,5,6,7,8,9], // ordre de jeu des chapitres selon le service
  chPos:         -1,                    // position courante dans chOrder
  priorityCount: 10,                    // nombre de chapitres prioritaires
  sceneOverride:     null,   // scène alternative choisie via micro-décision
  dialogueOverride:  null,   // tableau de dialogue recompilé selon le choix MD1
  hotspotsOverride:  null,   // positions des zones cliquables adaptées à la scène alternative
  service:           null,   // id du service sélectionné ('rh','achats','finance'…) — null en mode démo
  memoire:           {},     // mémoire narrative : { [chIdx]: { type, lettre } }
  miniJeuScores:     {},     // scores des mini-jeux : { [ch]: points }
  streak:            0,      // décisions 'good' consécutives
  reflexeGood:       {},     // { [chIdx]: true } si réflexe pro 'good' pour ce chapitre
  streakApresEchec:  0,      // bonnes décisions consécutives depuis la dernière mauvaise
  decisionRapide:    false,  // true si dernière décision prise en < 15s
  quizScore:         0,      // score final du quiz (0-10)
  secondEssai:       false,  // true quand on rejoue une affaire en mode révision
  secondEssaiCh:     null,   // index du chapitre rejoué
  alerte1Affichee:   false,  // alerte orange (intégrité < 40) déjà affichée
  alerte2Affichee:   false,  // alerte rouge (intégrité < 25) déjà affichée
};

// ── Utilitaires globaux ──────────────────────────────────────────
// Raccourci pour getElementById
const $ = id => document.getElementById(id);

// Retourne le nom du joueur si l'orateur est "Vous", sinon le nom tel quel
function spName(sp) {
  return sp === 'Vous' ? (etatJeu.playerFirst || 'Vous') : sp;
}

// Remplace les placeholders {prenom} et {nom} par les valeurs du joueur
// Applique aussi le marquage des termes du lexique
function subst(txt) {
  if (!txt) return txt;
  const replaced = txt
    .replace(/\{prenom\}/g, etatJeu.playerFirst || '')
    .replace(/\{nom\}/g, etatJeu.playerLast || '');
  return marquerTermesLexique(replaced);
}

// Entoure les termes du LEXIQUE de spans cliquables.
// Travaille segment par segment (texte vs balise) pour ne jamais toucher
// aux attributs HTML ni aux termes déjà marqués.
function marquerTermesLexique(texte) {
  if (typeof LEXIQUE === 'undefined') return texte;

  // Découpe html en alternant segments texte et balises
  const segments = texte.split(/(<[^>]*>)/);
  const termes   = Object.keys(LEXIQUE).sort((a, b) => b.length - a.length);
  // Compteur de balises lexique-terme ouvertes → on ne marque pas dans un terme déjà marqué
  let insideLxTerme = 0;

  return segments.map(seg => {
    // Segments balise : mettre à jour le compteur de profondeur, passer tel quel
    if (seg.startsWith('<')) {
      if (/^<span[^>]+class="lexique-terme"/i.test(seg))  insideLxTerme++;
      if (/^<\/span>/i.test(seg) && insideLxTerme > 0)    insideLxTerme--;
      return seg;
    }
    // Segment texte dans un terme déjà marqué → ne pas re-marquer
    if (insideLxTerme > 0) return seg;

    // Appliquer le marquage sur le texte brut
    // On cherche le terme avec contexte gauche/droite pour éviter les sous-chaînes
    let out = seg;
    for (const terme of termes) {
      const escaped = terme.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Capture avec contexte : (caractère non-lettre ou début)(terme)(caractère non-lettre ou fin)
      // \p{L} avec flag u couvre les lettres accentuées ; compatible iOS 12+
      const regex = new RegExp(`(^|[^\\p{L}\\p{N}])(${escaped})([^\\p{L}\\p{N}]|$)`, 'giu');
      out = out.replace(regex, (match, pre, found, post) => {
        return `${pre}<span class="lexique-terme" data-terme="${terme.toLowerCase()}">${found}</span>${post}`;
      });
    }
    return out;
  }).join('');
}

// Bloque une valeur entre 0 et 100
const clamp = v => Math.max(0, Math.min(100, Math.round(v)));

// Mélange un tableau en place (algorithme Fisher-Yates) et le retourne
// Utilisé pour randomiser l'ordre des choix et micro-décisions
function melangerTableau(tableau) {
  for (let i = tableau.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tableau[i], tableau[j]] = [tableau[j], tableau[i]];
  }
  return tableau;
}

// ── Fondu au noir ────────────────────────────────────────────────
// dir = 'in' : écran noir | dir = 'out' : écran visible
// cb : callback appelé une fois la transition terminée
function fade(dir, cb) {
  const ecranFondu = $('fade');
  if (dir === 'in') {
    ecranFondu.classList.add('in');
    setTimeout(cb || (_ => _), CONFIG.transitions.dureeFonduNoir);
  } else {
    ecranFondu.classList.remove('in');
    if (cb) setTimeout(cb, CONFIG.transitions.dureeFonduNoir);
  }
}

// Masque tous les panneaux UI — appelé lors des transitions entre phases
function hideAll() {
  hideDlg();
  $('inv').classList.add('hidden');
  $('choices').classList.add('hidden');
  $('micro-panel').classList.add('hidden');
  $('verdict').classList.remove('on');
  $('recap').classList.remove('on');
  $('clue-pop').classList.remove('on');
  $('ctx').classList.remove('on');
}


// ═══════════════════════════════════════════════════════════════
// ÉTAPE 1 — INTRO
// Déclenché par le clic sur "Ouvrir le dossier"
// ═══════════════════════════════════════════════════════════════

// Valide le format identifiant SEM : au moins 2 caractères (lettres, chiffres, point, tiret)
function _identifiantSEMValide(val) {
  return val.trim().length >= 2;
}

// Valide les champs de l'intro et active le bouton CTA
function _verifierIntroReady() {
  const prenom = ($('intro-prenom') && $('intro-prenom').value.trim()) || '';
  const id     = ($('intro-nom')    && $('intro-nom').value.trim())    || '';
  const cta = $('intro-cta');
  if (cta) cta.disabled = !(prenom && _identifiantSEMValide(id));
}

// Lit le nom, anime la sortie de l'intro et lance le prologue
function startGame() {
  const prenom = ($('intro-prenom') && $('intro-prenom').value.trim()) || '';
  const id     = ($('intro-nom')    && $('intro-nom').value.trim())    || '';
  if (!prenom || !_identifiantSEMValide(id)) return;
  etatJeu.playerFirst = prenom;
  etatJeu.playerLast  = id.toLowerCase();
  if (typeof Memoire !== 'undefined') Memoire.chargerMemoire(prenom + ' ' + nom);

  AudioEngine.onUserGesture();
  $('intro').classList.add('out');
  setTimeout(() => $('intro').style.display = 'none', 850);

  $('hud').classList.add('on');
  $('cdots').classList.add('on');
  $('lex-btn').classList.add('on');
  $('sound-btn').classList.add('on');
  $('badges-btn').classList.add('on');
  if (document.fullscreenEnabled) $('fullscreen-btn').classList.add('on');
  updateHUD();

  setTimeout(() => _showAccueil(), 400);
}


// ═══════════════════════════════════════════════════════════════
// ÉTAPE 2 — SÉLECTION DU SERVICE
// ═══════════════════════════════════════════════════════════════

let _serviceChoisi = null;

// Affiche l'écran de sélection du service et du nom du joueur
// hidden=true : crée le DOM en arrière-plan sans afficher l'écran
// (utilisé par map-select.js pour que startParcours() trouve les champs)
function showServiceSelect(hidden) {
  const boutonsServices = SERVICES.map(sv =>
    `<button class="svc-btn" id="svc-${sv.id}" onclick="selectService('${sv.id}')">
      <span class="svc-em">${sv.em}</span><span class="svc-lbl">${sv.label}</span>
    </button>`
  ).join('');

  $('service-select').innerHTML = `
    <div class="svc-wrap">
      <div class="svc-eyebrow">Projet Horizon · Formation personnalisée</div>
      <div class="svc-title">Dans quel service travaillez-vous ?</div>
      <div class="svc-sub">Votre parcours sera adapté à vos risques métier</div>
      <div class="svc-name-row">
        <input type="text" id="player-firstname" class="svc-name-input" placeholder="Prénom *" maxlength="40" autocomplete="given-name" oninput="_verifierPretADemarrer()">
        <input type="text" id="player-lastname" class="svc-name-input" placeholder="Nom *" maxlength="40" autocomplete="family-name" oninput="_verifierPretADemarrer()">
      </div>
      <div class="svc-grid">${boutonsServices}</div>
      <button class="svc-cta" id="svc-cta" onclick="showParcours()" disabled>Voir mon parcours →</button>
    </div>`;
  if (!hidden) $('service-select').classList.add('on');
}

// Mémorise le service cliqué et met en surbrillance le bouton sélectionné
function selectService(id) {
  _serviceChoisi = id;
  document.querySelectorAll('.svc-btn').forEach(b => b.classList.remove('sel'));
  const bouton = $('svc-' + id);
  if (bouton) bouton.classList.add('sel');
  _verifierPretADemarrer();
}

// Active le bouton CTA uniquement si un service, un prénom ET un nom sont renseignés
function _verifierPretADemarrer() {
  const champPrenom = $('player-firstname');
  const champNom    = $('player-lastname');
  const prenom = (champPrenom && champPrenom.value.trim()) || '';
  const nom    = (champNom    && champNom.value.trim())    || '';
  const cta = $('svc-cta');
  if (cta) cta.disabled = !(_serviceChoisi && prenom && nom);
}


// ═══════════════════════════════════════════════════════════════
// ÉTAPE 3 — CARTE DU PARCOURS
// ═══════════════════════════════════════════════════════════════

// Affiche la carte des chapitres selon le service sélectionné
function showParcours() {
  const service = SERVICES.find(s => s.id === _serviceChoisi);
  if (!service) return;

  const estDG           = !!service.allPriority;
  const ordre           = buildChapterOrder(service);
  const setPrioritaires = new Set(service.priority);

  // Charger le progrès persistant du joueur
  const nomJoueur = etatJeu.playerFirst + (etatJeu.playerLast ? ' ' + etatJeu.playerLast : '');
  const completedChapters = (typeof Tracker !== 'undefined') ? Tracker.chargerProgres(nomJoueur) : [];
  const _etatCarte = (idx) => {
    if (idx in _LOCKED_AFTER && !completedChapters.includes(_LOCKED_AFTER[idx])) return 'locked';
    if (completedChapters.includes(idx)) return 'done';
    return 'normal';
  };

  let contenuCartes;
  if (estDG) {
    contenuCartes = `
      <div class="prc-section-label prc-label-full">Parcours complet recommandé</div>
      <div class="prc-cards prc-cards-full">${ordre.map(i => _carteChapitre(i, true, _etatCarte(i))).join('')}</div>`;
  } else if (service.soloMode) {
    // Parcours solo : une seule affaire, pas de section bonus
    const cartesPrioritaires = service.priority.map(i => _carteChapitre(i, true, _etatCarte(i))).join('');
    contenuCartes = `
      <div class="prc-section-label prc-label-priority">⭐ Affaire au programme</div>
      <div class="prc-cards prc-cards-priority">${cartesPrioritaires}</div>`;
  } else {
    const cartesPrioritaires = service.priority.map(i => _carteChapitre(i, true, _etatCarte(i))).join('');
    const cartesBonus        = ordre.filter(i => !setPrioritaires.has(i)).map(i => _carteChapitre(i, false, _etatCarte(i))).join('');
    contenuCartes = `
      <div class="prc-section-label prc-label-priority">⭐ Affaires prioritaires pour votre service</div>
      <div class="prc-cards prc-cards-priority">${cartesPrioritaires}</div>
      <div class="prc-section-label prc-label-bonus">À faire ensuite</div>
      <div class="prc-cards prc-cards-bonus">${cartesBonus}</div>`;
  }

  $('parcours').innerHTML = `
    <div class="prc-wrap">
      ${typeof Checkpoint !== 'undefined' ? Checkpoint.bandeauHTML() : ''}
      <button class="prc-back" onclick="retourCarte()">← Changer de service</button>
      <div class="prc-service">${service.em} ${service.parentZone ? (SERVICES.find(s=>s.id===service.parentZone)||{}).label+' / '+service.label : service.label}</div>
      <div class="prc-title">Votre parcours prioritaire</div>
      <div>${contenuCartes}</div>
      <button class="prc-cta" onclick="startParcours()">Commencer mon parcours →</button>
    </div>`;

  $('service-select').classList.remove('on');
  $('parcours').classList.add('on');
}

// Affiche un toast de déverrouillage d'une nouvelle affaire
function _afficherToastDeverrouillage(msg) {
  const existing = document.getElementById('unlock-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'unlock-toast';
  toast.innerHTML = `<span class="unlock-toast-icon">🔓</span><span class="unlock-toast-txt">${msg}</span>`;
  document.getElementById('game').appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// Retour à la carte depuis l'écran parcours
function retourCarte() {
  $('parcours').classList.remove('on');
  _serviceChoisi = null;
  const el = $('map-select');
  el.style.display = '';
  el.classList.remove('out');
  requestAnimationFrame(() => el.classList.add('on'));
}

// Génère le HTML d'une carte de chapitre (prioritaire ou non)
// etat : 'locked' | 'new' | 'done' | 'normal'
// Verrous narratifs : chaque affaire déverrouille la suivante dans la séquence 7→8→9
const _LOCKED_AFTER = { 7: 6, 8: 7, 9: 8 };
function _carteChapitre(idx, estPrioritaire, etat) {
  const chapitre = CHAPTERS[idx];

  const dureeHtml = chapitre.dureeMin
    ? `<span class="affaire-duree"><i class="ti ti-clock"></i> ~${chapitre.dureeMin} min</span>`
    : '';

  if (etat === 'locked') {
    const reqNum = _LOCKED_AFTER[idx] + 1; // numéro humain (1-based)
    return `<div class="ch-card ch-card-locked">
      <div class="ch-card-lock-icon">🔒</div>
      <div class="ch-card-num">${chapitre.num}</div>
      <div class="ch-card-name">${chapitre.name}</div>
      ${dureeHtml}
      <div class="ch-card-sub">Complétez l'Affaire ${reqNum} pour débloquer</div>
    </div>`;
  }


  const classe = estPrioritaire ? 'ch-card ch-card-priority' : 'ch-card';
  const classeEtat = etat === 'done' ? ' ch-card-done' : '';
  const badgeCorner = etat === 'done'
    ? '<div class="ch-card-badge-done">✅</div>'
    : etat === 'new'
      ? '<div class="ch-card-badge-new">Nouveau</div>'
      : '';
  const dureeCompleteeHtml = etat === 'done' && chapitre.dureeMin
    ? `<span class="affaire-duree affaire-duree-done"><i class="ti ti-check"></i> Complétée · ~${chapitre.dureeMin} min</span>`
    : dureeHtml;
  const badgeServiceHtml = estPrioritaire
    ? '<div class="ch-card-badge">Prioritaire</div>'
    : '';
  return `<div class="${classe}${classeEtat}">
    ${badgeCorner}
    <div class="ch-card-num">${chapitre.num}</div>
    <div class="ch-card-name">${chapitre.name}</div>
    ${dureeCompleteeHtml}
    <div class="ch-card-sub">${chapitre.sub}</div>
    ${badgeServiceHtml}
  </div>`;
}

// Valide le parcours, initialise l'état global, lance le tutoriel ou le premier chapitre
function startParcours() {
  const service = SERVICES.find(s => s.id === _serviceChoisi);
  if (!service) return;

  etatJeu.service       = _serviceChoisi;
  etatJeu.chOrder       = buildChapterOrder(service);
  etatJeu.priorityCount = service.allPriority ? etatJeu.chOrder.length : service.priority.length;
  etatJeu.chPos         = -1;

  Tracker.init(
    etatJeu.playerFirst + (etatJeu.playerLast ? ' ' + etatJeu.playerLast : ''),
    _serviceChoisi, etatJeu.chOrder, etatJeu.priorityCount
  );

  // Supabase : enregistrement du joueur en arrière-plan
  if (typeof SB !== 'undefined') {
    const parcoursPri = etatJeu.chOrder
      .slice(0, etatJeu.priorityCount)
      .map(i => CHAPTERS[i] ? CHAPTERS[i].num : 'Affaire ' + (i + 1));
    SB.initJoueur(etatJeu.playerFirst, etatJeu.playerLast, _serviceChoisi, parcoursPri);
  }

  $('parcours').classList.remove('on');

  _showChoixTutoriel();
}


// ═══════════════════════════════════════════════════════════════
// DÉBUT DU JEU
// ═══════════════════════════════════════════════════════════════

// Lance le premier chapitre (après prologue + sélection service + tutoriel)
function _lancerPremierChapitre() {
  etatJeu.chPos = 0;
  loadChapter(etatJeu.chOrder[0]);
}

// Alias public utilisé par tutorial.js — ne rejoue PAS le prologue
function _beginGame() { _lancerPremierChapitre(); }

// ── Boutons de navigation ────────────────────────────────────────

// Mise à jour de la visibilité des boutons home / back selon la phase
function _updateNavButtons() {
  const homeEl = $('btn-home');
  const backEl = $('btn-back');
  if (!homeEl || !backEl) return;
  const showHome = ['dialogue', 'investigation'].includes(etatJeu.phase);
  const showBack = etatJeu.phase === 'dialogue' && etatJeu.dlgIdx > 0;
  homeEl.classList.toggle('hidden', !showHome);
  backEl.classList.toggle('hidden', !showBack);
}

// Ouvre l'overlay home — ne recharge pas la page, préserve l'état
function goHome() {
  const overlay = $('home-overlay');
  if (!overlay) return;
  const nom = etatJeu.playerLast
    ? etatJeu.playerFirst + ' — ' + etatJeu.playerLast
    : (etatJeu.playerFirst || '');
  $('home-player-name').textContent = nom;
  overlay.classList.add('on');
}

function closeHomeOverlay() {
  $('home-overlay').classList.remove('on');
}

function homeGoMap() {
  $('home-overlay').classList.remove('on');
  // Masque tous les panneaux actifs
  ['inv','choices','micro-panel','dlg','verdict','recap','ctx','chtitle'].forEach(id => {
    const el = $(id);
    if (!el) return;
    if (el.classList.contains('on')) el.classList.remove('on');
    if (!el.classList.contains('hidden')) el.classList.add('hidden');
  });
  showChar('cl', null);
  showChar('cr', null);
  etatJeu.phase = '';
  // Réaffiche la carte
  const ms = $('map-select');
  if (ms) { ms.style.display = ''; ms.classList.remove('out'); requestAnimationFrame(() => ms.classList.add('on')); }
}

function homeQuit() {
  if (!confirm('Quitter la partie ?\nVotre progression sera perdue.')) return;
  localStorage.removeItem('quiz_annonce_vue');
  location.reload();
}

function homeEffacerDonnees() {
  if (!confirm('Effacer toutes vos données ?\n\nVotre progression, votre prénom et vos résultats seront supprimés définitivement.')) return;
  // Supprimer toutes les clés horizon_* et les clés connexes
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && (key.startsWith('horizon_') || key === 'quiz_annonce_vue' || key === 'ph_muted')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
  location.reload();
}


// ═══════════════════════════════════════════════════════════════
// ACCUEIL — Écran intermédiaire après l'intro
// ═══════════════════════════════════════════════════════════════

function _showAccueil() {
  const nom = etatJeu.playerLast
    ? etatJeu.playerFirst + ' — ' + etatJeu.playerLast
    : etatJeu.playerFirst;
  $('accueil-player-name').textContent = nom;
  AudioEngine.playAccueil();
  $('accueil-overlay').classList.add('on');
  if (typeof Checkpoint !== 'undefined') Checkpoint.majAffichage();
  // Cherche une sauvegarde spécifique à ce joueur
  if (typeof Checkpoint !== 'undefined') {
    const cp = Checkpoint.charger();
    const btn = $('accueil-btn-reprendre');
    if (btn) btn.style.display = cp ? '' : 'none';
  }
}

function accueilStartMission() {
  $('accueil-overlay').classList.remove('on');
  runPrologue();
}

function accueilOpenDemo() {
  openDemoMode();
}

function accueilEditName() {
  $('accueil-player-badge').style.display = 'none';
  const form = $('accueil-edit-form');
  form.classList.remove('accueil-hidden');
  $('accueil-prenom').value = etatJeu.playerFirst || '';
  $('accueil-nom').value = etatJeu.playerLast || '';
  setTimeout(() => $('accueil-prenom').focus(), 50);
}

function accueilSaveName() {
  const prenom = $('accueil-prenom').value.trim();
  const id     = $('accueil-nom').value.trim();
  if (!prenom || !_identifiantSEMValide(id)) return;
  etatJeu.playerFirst = prenom;
  etatJeu.playerLast  = id.toLowerCase();
  $('accueil-player-name').textContent = prenom + ' — ' + id.toLowerCase();
  $('accueil-edit-form').classList.add('accueil-hidden');
  $('accueil-player-badge').style.display = '';
}


// ═══════════════════════════════════════════════════════════════
// MODE DÉMO — Sélecteur de chapitre libre
// ═══════════════════════════════════════════════════════════════

function openDemoMode() {
  const cards = CHAPTERS.map((ch, i) => `
    <div class="demo-card" onclick="launchChapterDemo(${i})">
      <div class="demo-card-num">${ch.num}</div>
      <div class="demo-card-name">${ch.name}</div>
      <div class="demo-card-sub">${ch.sub}</div>
    </div>`).join('');
  $('demo-grid').innerHTML = cards;
  $('demo-overlay').classList.add('on');
}

function closeDemoMode() {
  $('demo-overlay').classList.remove('on');
}

function launchChapterDemo(idx) {
  $('demo-overlay').classList.remove('on');
  $('accueil-overlay').classList.remove('on');
  $('home-overlay').classList.remove('on');

  // Reset state
  etatJeu.gauges        = { i: 100, p: 100, m: 100 };
  etatJeu.choices       = [];
  etatJeu.choiceDetails = [];
  etatJeu.miniJeuScores    = {};
  etatJeu.streak           = 0;
  etatJeu.reflexeGood      = {};
  etatJeu.streakApresEchec = 0;
  etatJeu.decisionRapide   = false;
  etatJeu.quizScore        = 0;
  etatJeu.secondEssai      = false;
  etatJeu.secondEssaiCh    = null;
  etatJeu.invFound         = 0;
  etatJeu.chOrder       = CHAPTERS.map((_, i) => i);
  etatJeu.chPos         = idx;
  etatJeu.priorityCount = CHAPTERS.length;

  // Ensure HUD is visible
  $('hud').classList.add('on');
  $('cdots').classList.add('on');
  $('lex-btn').classList.add('on');
  $('sound-btn').classList.add('on');
  $('badges-btn').classList.add('on');
  if (document.fullscreenEnabled) $('fullscreen-btn').classList.add('on');
  updateHUD();

  // Hide any active panels
  hideAll();
  showChar('cl', null);
  showChar('cr', null);

  if (typeof Tracker !== 'undefined' && Tracker.init) {
    const nom = [etatJeu.playerFirst, etatJeu.playerLast].filter(Boolean).join(' ');
    Tracker.init(nom, 'demo', etatJeu.chOrder, etatJeu.priorityCount);
  }
  if (typeof Memoire !== 'undefined') {
    const nom = [etatJeu.playerFirst, etatJeu.playerLast].filter(Boolean).join(' ');
    Memoire.chargerMemoire(nom);
  }

  loadChapter(idx);
}

// Retour à la ligne de dialogue précédente
function goBack() {
  if (etatJeu.phase !== 'dialogue' || etatJeu.dlgIdx <= 0) return;
  etatJeu.dlgIdx--;
  twComplete();
  showDialogueLine();
}


// ═══════════════════════════════════════════════════════════════
// PROLOGUE
// ═══════════════════════════════════════════════════════════════

let _idxPrologue = 0;

// Démarre la séquence de prologue depuis la première ligne
function runPrologue() {
  etatJeu.phase    = 'prologue';
  _idxPrologue     = 0;
  $('dlg').onclick = advPrologue;
  showPrologueLine();
}

// Affiche la ligne de prologue courante (décor + personnage + dialogue)
function showPrologueLine() {
  const ligne = PROLOGUE[_idxPrologue];
  buildScene(ligne.sc);
  if (ligne.ch) {
    const estSoi = ligne.sp === 'Vous';
    showChar('cl', estSoi ? ligne.ch : null);
    showChar('cr', estSoi ? null : ligne.ch);
    showDlg(ligne.sp, ligne.txt, estSoi ? 'cl' : 'cr');
  } else {
    showChar('cl', null);
    showChar('cr', null);
    hideDlg();
    $('dlg').classList.remove('hidden');
    $('dlg-spk').textContent = ligne.sp;
    twStart($('dlg-txt'), subst(ligne.txt), CONFIG.dialogue.vitesseDefilement);
    setSpeaking(null);
  }
}

// Avance au prochain dialogue du prologue, ou affiche l'annonce quiz puis la carte
function advPrologue() {
  AudioEngine.sfx.dialogueClick();
  twComplete();
  _idxPrologue++;
  if (_idxPrologue >= PROLOGUE.length) {
    hideDlg();
    showChar('cl', null);
    showChar('cr', null);
    _afterPrologue();
    return;
  }
  showPrologueLine();
}

// Après la fin du prologue : affiche l'annonce quiz (1ère fois) ou la carte directement
function _afterPrologue() {
  if (localStorage.getItem('quiz_annonce_vue') === 'true') {
    showMapSelect();
  } else {
    showQuizAnnonce();
  }
}

// Affiche le panneau d'annonce du quiz final
function showQuizAnnonce() {
  const el = $('quiz-annonce');
  if (!el) { showMapSelect(); return; }

  el.innerHTML = `
    <div class="qa-panel">
      <div class="qa-icon">📋</div>
      <div class="qa-title">Ce qui vous attend</div>
      <div class="qa-body">
        <p>Avant de commencer, sachez que ce parcours se termine par un <strong style="color:var(--gold,#d4af37)">test de connaissances</strong>.</p>
        <p>10 questions sur les situations que vous aurez rencontrées.<br>
        Concepts juridiques, bons réflexes, infractions à identifier.</p>
        <p>Pas de pression — mais restez attentif(ve) tout au long des affaires. Chaque détail compte.</p>
      </div>
      <div class="qa-highlight">
        <strong>💡 Conseil</strong>
        Lisez attentivement les fiches récap à la fin de chaque affaire — elles vous prépareront directement au quiz final.
      </div>
      <div class="qa-actions">
        <button class="qa-btn-primary" onclick="quizAnnonceCommencer()">Je suis prêt(e) → Commencer</button>
        <button class="qa-btn-skip" onclick="quizAnnonceNePlusAfficher()">Ne plus afficher ce message</button>
      </div>
    </div>`;

  el.classList.add('on');
  localStorage.setItem('quiz_annonce_vue', 'true');
}

function quizAnnonceCommencer() {
  const el = $('quiz-annonce');
  if (el) el.classList.remove('on');
  showMapSelect();
}

function quizAnnonceNePlusAfficher() {
  localStorage.setItem('quiz_annonce_vue', 'true');
  const el = $('quiz-annonce');
  if (el) el.classList.remove('on');
  showMapSelect();
}

// Affiche l'écran de choix tutoriel / accès direct à la carte
function _showChoixTutoriel() {
  const panel = $('tuto-choice');
  panel.classList.add('on');
  $('tuto-choice-yes').onclick = () => {
    panel.classList.remove('on');
    Tutorial.start();
  };
  $('tuto-choice-skip').onclick = () => {
    panel.classList.remove('on');
    _lancerPremierChapitre();
  };
}


// ═══════════════════════════════════════════════════════════════
// CHARGEMENT D'UN CHAPITRE
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// SECOND ESSAI — Mode révision (rejouer sans impact sur le score)
// ═══════════════════════════════════════════════════════════════

function startSecondEssai() {
  etatJeu.secondEssai    = true;
  etatJeu.secondEssaiCh  = etatJeu.ch;
  $('verdict').classList.remove('on');
  _showSecondEssaiBandeau();
  loadChapter(etatJeu.ch);
}

function _showSecondEssaiBandeau() {
  const existing = document.getElementById('second-essai-bandeau');
  if (existing) existing.remove();
  const b = document.createElement('div');
  b.id = 'second-essai-bandeau';
  b.innerHTML = '<i class="ti ti-refresh"></i> Mode révision — cet essai n\'est pas comptabilisé dans votre score';
  document.getElementById('game').appendChild(b);
}

// Appelée à la fin du second essai pour nettoyer et continuer
function _finSecondEssai() {
  etatJeu.secondEssai   = false;
  etatJeu.secondEssaiCh = null;
  const b = document.getElementById('second-essai-bandeau');
  if (b) b.remove();
  $('verdict').classList.remove('on');
  $('recap').classList.remove('on');
  $('hud').classList.add('on');
  goNextChapter();
}

// Charge un chapitre : fondu noir, construction de la scène,
// affichage du titre puis de la carte de contexte
function loadChapter(idx) {
  etatJeu.ch               = idx;
  etatJeu.dlgIdx           = 0;
  etatJeu.invFound         = 0;
  etatJeu.sceneOverride    = null;
  etatJeu.dialogueOverride  = null;
  etatJeu.hotspotsOverride  = null;
  if (!etatJeu.secondEssai) Badges.check('chapterStart', { chIdx: idx });
  updateDots();
  _updateNavButtons();
  fade('in', () => {
    hideAll();
    showChar('cl', null);
    showChar('cr', null);
    const chapitre = CHAPTERS[idx];
    _currentSceneKey = null;
    AudioEngine.playChapter(idx);
    buildScene(chapitre.sc);
    // En second essai : pas de titre, direct contexte (moins de friction)
    if (etatJeu.secondEssai) {
      fade('out', () => showContext(chapitre));
    } else {
      fade('out', () => showChapterTitle(chapitre, () => showContext(chapitre)));
    }
  });
}

// Affiche le titre du chapitre en plein écran pendant quelques secondes
function showChapterTitle(chapitre, cb) {
  const el = $('chtitle');
  $('ct-num').textContent  = chapitre.num;
  $('ct-name').textContent = chapitre.name;
  $('ct-sub').textContent  = chapitre.sub;
  el.classList.add('on');
  setTimeout(() => {
    el.classList.remove('on');
    if (cb) setTimeout(cb, 500);
  }, CONFIG.transitions.dureeTitreChapitre);
}

// Affiche la fiche récapitulative après le verdict
function showRecap() {
  $('verdict').classList.remove('on');
  const chapitre = CHAPTERS[etatJeu.ch];
  if (!chapitre.recap) { afterVerdict(); return; }

  const recap      = chapitre.recap;
  const libelleSuivant = etatJeu.chPos < etatJeu.chOrder.length - 1
    ? 'Affaire suivante →' : 'Voir l\'épilogue →';
  const gestesHtml = recap.gestures.map(g => `<li>${g}</li>`).join('');

  const jurisHtml = recap.jurisprudence ? `
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
    <button class="rcp-btn" onclick="afterVerdict()">${libelleSuivant}</button>`;
  $('hud').classList.remove('on');
  $('recap').classList.add('on');
}

// Après le verdict, joue l'éventuelle transition narrative
// puis navigue vers le chapitre suivant, l'intermédiaire ou l'épilogue
function afterVerdict() {
  $('recap').classList.remove('on');
  $('hud').classList.add('on');
  // Sauvegarde automatique après chaque affaire complétée (pas en mode révision)
  if (!etatJeu.secondEssai && typeof Checkpoint !== 'undefined') Checkpoint.sauvegarder();

  // Mini-jeu de définitions après les affaires 3, 6 et 9 (ch = 2, 5, 8)
  if ([2, 5, 8].includes(etatJeu.ch) && typeof startMiniJeu === 'function') {
    startMiniJeu(etatJeu.ch, () => _afterVerdictSuite());
    return;
  }
  _afterVerdictSuite();
}

function _afterVerdictSuite() {
  const chapitre          = CHAPTERS[etatJeu.ch];
  const positionSuivante  = etatJeu.chPos + 1;

  let cleTransition;
  if (positionSuivante >= etatJeu.chOrder.length)
    cleTransition = 'epilogue';
  else if (positionSuivante === etatJeu.priorityCount && etatJeu.priorityCount < etatJeu.chOrder.length)
    cleTransition = 'intermediate';
  else
    cleTransition = etatJeu.chOrder[positionSuivante];

  // Toast si cette affaire déverrouille la suivante dans la séquence narrative
  const _UNLOCK_MSGS = { 6: "L'Affaire 8 est maintenant disponible.", 7: "L'Affaire 9 est maintenant disponible.", 8: "L'Affaire 10 est maintenant disponible." };
  if (_UNLOCK_MSGS[etatJeu.ch]) _afficherToastDeverrouillage(_UNLOCK_MSGS[etatJeu.ch]);

  const transition = chapitre.transitions && chapitre.transitions[cleTransition];
  if (transition) {
    etatJeu.phase = 'transition';
    showChar('cl', null);
    showChar('cr', null);
    $('dlg').onclick = () => {
      hideDlg();
      $('dlg').onclick = advDialogue;
      goNextChapter();
    };
    $('dlg').classList.remove('hidden');
    $('dlg-spk').textContent = transition.sp;
    twStart($('dlg-txt'), subst(transition.txt), CONFIG.dialogue.vitesseDefilement);
    setSpeaking(null);
  } else {
    goNextChapter();
  }
}


// ═══════════════════════════════════════════════════════════════
// NAVIGATION — chapitre suivant / épilogue / écran intermédiaire
// ═══════════════════════════════════════════════════════════════

// Détermine la prochaine étape du parcours et y navigue
function goNextChapter() {
  const positionSuivante = etatJeu.chPos + 1;
  if (positionSuivante >= etatJeu.chOrder.length) { runEpilogue(); return; }
  etatJeu.chPos = positionSuivante;
  loadChapter(etatJeu.chOrder[etatJeu.chPos]);
}


// ═══════════════════════════════════════════════════════════════
// ACCÈS FORMATEUR — Modal code secret
// ═══════════════════════════════════════════════════════════════

// Ouvre la modal de saisie du code formateur
function openTrainerModal() {
  $('trainer-modal').classList.add('on');
  setTimeout(() => { const input = $('trainer-code'); if (input) input.focus(); }, 80);
}

// Ferme la modal et vide le champ de saisie
function closeTrainerModal() {
  $('trainer-modal').classList.remove('on');
  const input = $('trainer-code');
  if (input) input.value = '';
}

// Vérifie le code saisi et ouvre le tableau de bord formateur si correct
function checkTrainerCode() {
  const input = $('trainer-code');
  if (input && input.value === CONFIG.formateur.codeAcces) {
    try { localStorage.setItem('horizon_auth_token', Date.now().toString()); } catch(e) {}
    window.open('dashboard.html', '_blank');
    closeTrainerModal();
  } else {
    if (input) {
      input.classList.add('trainer-input-error');
      setTimeout(() => input.classList.remove('trainer-input-error'), 600);
    }
    closeTrainerModal();
  }
}

// Raccourcis clavier pour la modal formateur
document.addEventListener('keydown', e => {
  if (e.key === 'Enter'  && $('trainer-modal').classList.contains('on')) checkTrainerCode();
  if (e.key === 'Escape' && $('trainer-modal').classList.contains('on')) closeTrainerModal();
});

// ── Portail mot de passe ─────────────────────────────────────────
// Le hash SHA-256 du mot de passe est stocké — jamais le mot de passe en clair.
// Pour changer le mot de passe : echo -n "NOUVEAU" | shasum -a 256
const _PG_HASH = '7579ff2bb0a8c891d43ed85cbbcc246d5e03c0d624dc1df5f1ad526cae76c670';

async function _sha256(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

(function _initPasswordGate() {
  const gate = $('password-gate');
  if (!gate) return;
  // Touche Entrée dans le champ
  const input = $('pg-input');
  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') checkPassword(); });
})();

function checkPassword() {
  const input = $('pg-input');
  const errEl = $('pg-error');
  if (!input) return;
  const saisie = input.value.trim().toUpperCase();
  input.value = '';
  _sha256(saisie).then(hash => {
    if (hash === _PG_HASH) {
      const gate = $('password-gate');
      gate.classList.add('out');
      setTimeout(() => { gate.style.display = 'none'; }, 650);
    } else {
      if (errEl) errEl.textContent = 'Mot de passe incorrect. Veuillez réessayer.';
      input.classList.remove('pg-shake');
      void input.offsetWidth;
      input.classList.add('pg-shake');
      input.focus();
    }
  });
}

// ── Étoiles de l'écran d'intro ───────────────────────────────────
// Générées immédiatement au chargement de la page (avant tout clic)
(() => {
  const conteneur = $('intro-stars');
  for (let i = 0; i < 60; i++) {
    const etoile = document.createElement('div');
    const taille = 1 + Math.random() * 2;
    etoile.style.cssText = `position:absolute;width:${taille}px;height:${taille}px;border-radius:50%;background:white;top:${Math.random()*100}%;left:${Math.random()*100}%;opacity:${0.1+Math.random()*0.4};`;
    conteneur.appendChild(etoile);
  }
})();

// ══ FULLSCREEN ══
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
}
document.addEventListener('fullscreenchange', () => {
  const btn = $('fullscreen-btn');
  if (btn) btn.textContent = document.fullscreenElement ? '⊠' : '⛶';
});

// Crédits : année dynamique
(function() {
  const el = document.getElementById('intro-credit');
  if (el) el.textContent = '© ' + new Date().getFullYear() + ' Cécile Larade';
})();

// ── Hauteur viewport réelle (fix bande noire iOS PWA standalone) ──
// window.innerHeight donne la hauteur réelle sans les barres système,
// contrairement à 100dvh qui peut être inexact au premier rendu iOS standalone.
function _setAppHeight() {
  document.documentElement.style.setProperty('--app-height', window.innerHeight + 'px');
}
_setAppHeight();
// Délai 200ms : le viewport iOS standalone se stabilise après le premier rendu
setTimeout(_setAppHeight, 200);
window.addEventListener('resize', _setAppHeight);
