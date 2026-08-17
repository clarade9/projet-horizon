#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
// VALIDATION STATIQUE — Vérifie la cohérence des données du jeu
// sans navigateur. Lance avec : node tests/validate-data.js
// ═══════════════════════════════════════════════════════════════

const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

// ── Couleurs terminal ─────────────────────────────────────────
const G = s => `\x1b[32m${s}\x1b[0m`;  // vert
const R = s => `\x1b[31m${s}\x1b[0m`;  // rouge
const Y = s => `\x1b[33m${s}\x1b[0m`;  // jaune
const B = s => `\x1b[1m${s}\x1b[0m`;   // gras

let errors   = 0;
let warnings = 0;
let passed   = 0;

function ok(msg)   { console.log(G('  ✓') + ' ' + msg); passed++; }
function err(msg)  { console.log(R('  ✗') + ' ' + msg); errors++; }
function warn(msg) { console.log(Y('  ⚠') + ' ' + msg); warnings++; }
function section(t){ console.log('\n' + B('── ' + t + ' ──')); }

// ── Lecture des fichiers JS comme modules virtuels ────────────
function loadJS(rel) {
  const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  // Expose les variables globales dans un contexte isolé
  const ctx = {};
  try {
    // Injection des dépendances minimales pour que les fichiers chargent
    const preamble = `
      const CHAPTERS = [];
      const REFLEXE_DATA = {};
      const PRESSIONS_DATA = {};
      const SERVICES = [];
      const OPERATIONNEL_ONLY_IDXS = new Set([10,12]);
      const QSE_ONLY_IDXS = new Set([11]);
    `;
    new Function('module', 'exports', '__ctx', preamble + '; ' + src + '; Object.assign(__ctx, {CHAPTERS,REFLEXE_DATA,PRESSIONS_DATA,SERVICES});')(
      { exports: {} }, {}, ctx
    );
  } catch(e) { /* variables not defined in preamble */ }
  return ctx;
}

// ── Chargement des données via vm.runInContext ────────────────
const vm = require('vm');

function extractGlobal(file, varName) {
  const src = fs.readFileSync(path.join(ROOT, file), 'utf8');
  // Remplace les déclarations const/let/var VARNAME = ... par VARNAME = ...
  // pour que la valeur soit visible dans le contexte VM
  const patched = src
    .replace(new RegExp(`^(?:const|let|var)\\s+${varName}\\s*=`, 'm'), `${varName} =`)
    .replace(/^(?:const|let|var)\s+CHAPTERS\s*=/m,   'CHAPTERS =')
    .replace(/^(?:const|let|var)\s+SERVICES\s*=/m,   'SERVICES =')
    .replace(/^(?:const|let|var)\s+REFLEXE_DATA\s*=/m, 'REFLEXE_DATA =')
    .replace(/^(?:const|let|var)\s+PRESSIONS_DATA\s*=/m,'PRESSIONS_DATA =')
    .replace(/^(?:const|let|var)\s+BONUS_\w+\s*=/mg, s => s.replace(/^(?:const|let|var)\s+/m,''));

  const ctx = {
    CHAPTERS: [], REFLEXE_DATA: {}, PRESSIONS_DATA: {}, SERVICES: [],
    OPERATIONNEL_ONLY_IDXS: new Set([10,12]),
    QSE_ONLY_IDXS: new Set([11]),
    BONUS_MAINTENANCE_IDX: 10,
    buildChapterOrder: () => [],
  };
  // initialise varName dans le contexte
  ctx[varName] = undefined;
  try {
    vm.createContext(ctx);
    vm.runInContext(patched, ctx, { timeout: 10_000 });
    return ctx[varName];
  } catch(e) {
    console.error(`  [extractGlobal] Erreur sur ${file}: ${e.message}`);
    return null;
  }
}

const CHAPTERS      = extractGlobal('js/data/chapters.js',    'CHAPTERS');
const REFLEXE_DATA  = extractGlobal('js/data/reflexe-data.js','REFLEXE_DATA');
const PRESSIONS     = extractGlobal('js/data/pressions-data.js','PRESSIONS_DATA');
const SERVICES_LIST = extractGlobal('js/data/services.js',    'SERVICES');

// ── Scènes disponibles (extraites de scenes.js) ───────────────
const sceneSrc    = fs.readFileSync(path.join(ROOT, 'js/scenes.js'), 'utf8');
const SCENE_KEYS  = [...sceneSrc.matchAll(/^  '([a-z][a-zA-Z0-9]+)':\s*\(\)/gm)].map(m => m[1]);

// ── Assets sur le disque ──────────────────────────────────────
const SCENE_FILES = new Set(fs.readdirSync(path.join(ROOT, 'assets/scenes')));
const CHAR_FILES  = new Set(fs.readdirSync(path.join(ROOT, 'assets/characters')));
const AUDIO_FILES = new Set([
  ...fs.readdirSync(path.join(ROOT, 'assets/audio')),
  ...fs.readdirSync(path.join(ROOT, 'assets/audio/musiques')).map(f => 'musiques/' + f),
]);

// ═══════════════════════════════════════════════════════════════
// 1. DONNÉES CHAPITRES
// ═══════════════════════════════════════════════════════════════
section('1. Structure des chapitres (CHAPTERS[])');

if (!CHAPTERS || !Array.isArray(CHAPTERS)) {
  err('CHAPTERS[] non chargé'); process.exit(1);
}
ok(`${CHAPTERS.length} chapitres chargés`);

const REQUIRED_FIELDS = ['num','name','sub','sc','playerRole','context','choices','recap'];

CHAPTERS.forEach((ch, i) => {
  const label = `[${i}] ${ch.num || '?'}`;

  // Champs obligatoires
  REQUIRED_FIELDS.forEach(f => {
    if (!ch[f]) err(`${label} — champ "${f}" manquant`);
  });

  // Scène principale
  if (ch.sc && !SCENE_KEYS.includes(ch.sc)) {
    err(`${label} — scène "${ch.sc}" introuvable dans SCENES{}`);
  } else if (ch.sc) {
    ok(`${label} — scène "${ch.sc}" OK`);
  }

  // Scènes dans le dialogue
  (ch.dialogue || []).forEach((line, li) => {
    if (line.sc && !SCENE_KEYS.includes(line.sc)) {
      err(`${label} dialogue[${li}] — scène "${line.sc}" introuvable`);
    }
    if (!line.txt) warn(`${label} dialogue[${li}] — champ txt vide`);
  });

  // Scènes dans preDialogue
  (ch.preDialogue || []).forEach((line, li) => {
    if (line.sc && !SCENE_KEYS.includes(line.sc)) {
      err(`${label} preDialogue[${li}] — scène "${line.sc}" introuvable`);
    }
  });

  // MicroDécisions
  (ch.microDecisions || []).forEach((md, mi) => {
    if (!md.situation) warn(`${label} MD[${mi}] — situation vide`);
    (md.choices || []).forEach((c, ci) => {
      if (!c.desc) warn(`${label} MD[${mi}] choice[${ci}] — desc vide`);
      if (c.sceneAtLine0 && !SCENE_KEYS.includes(c.sceneAtLine0))
        err(`${label} MD[${mi}] choice[${ci}] — sceneAtLine0 "${c.sceneAtLine0}" introuvable`);
      if (c.sceneAfter && !SCENE_KEYS.includes(c.sceneAfter))
        err(`${label} MD[${mi}] choice[${ci}] — sceneAfter "${c.sceneAfter}" introuvable`);
    });
  });

  // Choix finaux
  const choices = ch.choices || [];
  if (choices.length !== 3) {
    warn(`${label} — ${choices.length} choix (attendu 3)`);
  }
  const types = choices.map(c => c.type);
  if (!types.includes('good')) err(`${label} — aucun choix 'good'`);
  if (!types.includes('bad'))  err(`${label} — aucun choix 'bad'`);

  choices.forEach((c, ci) => {
    if (!c.desc)         warn(`${label} choice[${ci}] — desc vide`);
    if (!c.vTitle)       warn(`${label} choice[${ci}] — vTitle vide`);
    if (!c.vConsequence) warn(`${label} choice[${ci}] — vConsequence vide`);
    if (!c.gauges)       err(`${label} choice[${ci}] — gauges manquant`);
    else {
      ['i','p','m'].forEach(g => {
        if (typeof c.gauges[g] !== 'number') err(`${label} choice[${ci}] — jauge "${g}" manquante`);
      });
    }
  });

  // Hotspots (doivent être dans les bornes 0-100)
  (ch.hotspots || []).forEach((h, hi) => {
    if (h.x < 0 || h.x + h.w > 100 || h.y < 0 || h.y + h.h > 100) {
      err(`${label} hotspot[${hi}] hors bornes : x=${h.x} y=${h.y} w=${h.w} h=${h.h}`);
    }
  });

  // Recap
  if (!ch.recap?.gestures?.length) warn(`${label} — recap.gestures vide`);
});

// ═══════════════════════════════════════════════════════════════
// 2. REFLEXE_DATA
// ═══════════════════════════════════════════════════════════════
section('2. Structure Réflexe Pro (REFLEXE_DATA)');

if (!REFLEXE_DATA || typeof REFLEXE_DATA !== 'object') {
  err('REFLEXE_DATA non chargé');
} else {
  const keys = Object.keys(REFLEXE_DATA).map(Number).sort((a,b)=>a-b);
  ok(`${keys.length} entrées : indices [${keys.join(', ')}]`);

  // Vérifie qu'il existe une entrée pour chaque chapitre 0-12
  CHAPTERS.forEach((ch, i) => {
    if (REFLEXE_DATA[i] === undefined) {
      warn(`REFLEXE_DATA[${i}] (${ch.num}) manquant`);
    }
  });

  const REQUIRED_REFLEXE = ['context','documents','questions','actions','combos','analysereflexe'];
  keys.forEach(idx => {
    const rd  = REFLEXE_DATA[idx];
    const lbl = `REFLEXE_DATA[${idx}]`;

    REQUIRED_REFLEXE.forEach(f => {
      if (!rd[f]) err(`${lbl} — champ "${f}" manquant`);
    });

    // Documents : exactement 4
    if (!Array.isArray(rd.documents) || rd.documents.length !== 4)
      warn(`${lbl} — ${(rd.documents||[]).length} documents (attendu 4)`);

    // Questions et actions : exactement 4
    if (!Array.isArray(rd.questions) || rd.questions.length !== 4)
      warn(`${lbl} — ${(rd.questions||[]).length} questions (attendu 4)`);
    if (!Array.isArray(rd.actions) || rd.actions.length !== 4)
      warn(`${lbl} — ${(rd.actions||[]).length} actions (attendu 4)`);

    // Combos : format '0,1'
    const combos = rd.combos || {};
    ['questions','actions'].forEach(dim => {
      ['good','warn','bad'].forEach(type => {
        const val = combos[dim]?.[type];
        if (!val) { err(`${lbl} combos.${dim}.${type} manquant`); return; }
        const idxs = val.split(',').map(Number);
        if (idxs.length !== 2) err(`${lbl} combos.${dim}.${type} doit avoir 2 indices`);
        idxs.forEach(n => {
          if (n < 0 || n > 3) err(`${lbl} combos.${dim}.${type} indice ${n} hors bornes`);
        });
      });
    });

    // analysereflexe
    const ar = rd.analysereflexe || {};
    if (!ar.verdictRapide?.good) err(`${lbl} analysereflexe.verdictRapide.good manquant`);
    if (!ar.regleOr) warn(`${lbl} analysereflexe.regleOr manquant`);
    if (ar.questions) {
      [0,1,2,3].forEach(qi => {
        if (!ar.questions[qi]) warn(`${lbl} analysereflexe.questions[${qi}] manquant`);
      });
    }
    if (ar.actions) {
      [0,1,2,3].forEach(ai => {
        if (!ar.actions[ai]) warn(`${lbl} analysereflexe.actions[${ai}] manquant`);
      });
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// 3. PRESSIONS_DATA
// ═══════════════════════════════════════════════════════════════
section('3. Pressions interchapitre (PRESSIONS_DATA)');

if (!PRESSIONS || typeof PRESSIONS !== 'object') {
  err('PRESSIONS_DATA non chargé');
} else {
  const keys = Object.keys(PRESSIONS).map(Number).sort((a,b)=>a-b);
  ok(`${keys.length} entrées de pressions`);

  // Détecter les clés dupliquées
  const rawSrc = fs.readFileSync(path.join(ROOT, 'js/data/pressions-data.js'), 'utf8');
  const allKeys = [...rawSrc.matchAll(/^\s{2}(\d+):/gm)].map(m => Number(m[1]));
  const seen = {};
  allKeys.forEach(k => {
    seen[k] = (seen[k] || 0) + 1;
    if (seen[k] === 2) err(`PRESSIONS_DATA clé dupliquée : ${k} (la première entrée est écrasée)`);
  });

  keys.forEach(idx => {
    const pressions = PRESSIONS[idx];
    pressions.forEach((p, pi) => {
      if (!p.type || !['notification','email'].includes(p.type))
        err(`PRESSIONS_DATA[${idx}][${pi}] — type "${p.type}" invalide`);
      if (!p.expediteur) warn(`PRESSIONS_DATA[${idx}][${pi}] — expediteur vide`);
      if (!p.message)    warn(`PRESSIONS_DATA[${idx}][${pi}] — message vide`);
      if (typeof p.delai !== 'number') err(`PRESSIONS_DATA[${idx}][${pi}] — delai non numérique`);
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// 4. ASSETS — Images de scènes
// ═══════════════════════════════════════════════════════════════
section('4. Assets — scènes (assets/scenes/)');

// Mapping scène → fichier(s) attendu(s)
const SCENE_ASSET_MAP = {
  prologue:          ['prologue.jpg'],
  rh:                ['bureau1.jpg'],
  bureau1:           ['bureau1.jpg'],
  bureauf:           ['bureauf.jpg', 'bureauf.webp'],
  mairie:            ['mairie.webp'],
  bureau2:           ['bureau2.jpg'],
  resto:             ['resto.jpg'],
  restojour:         ['restojour.jpg'],
  bistro:            ['bistro.webp'],
  sallereunion:      ['sallereunion.webp'],
  pesee:             ['pesee.jpg'],
  indus:             ['indus.jpg'],
  finance:           ['findumois.webp'],
  commercial:        ['contratatoutprix.webp'],
  tennis:            ['tennis.jpg'],
  bureau9:           ['bureau9.webp'],
  bureaujour:        ['bureaujour.webp'],
  bureauPerrin:      ['bureau9.webp','telephoneperrin.webp'],
  bureaularoche:     ['bureau9.webp','telephonelaroche.webp'],
  tutorial:          ['salle-formation.jpg'],
  nuitcollecte:      ['depot.png'],
  zone3:             ['zone3.png'],
  reunionqse:        ['reunionqse.png'],
  epilogue:          ['epilogue.webp'],
  maintenance:       ['maintenance.png'],
  maintenancebureau: ['maintenancebureau.png'],
  maintenancereunion:['maintenancereunion.png'],
};

Object.entries(SCENE_ASSET_MAP).forEach(([scene, files]) => {
  // Au moins un des fichiers doit exister
  const found = files.some(f => SCENE_FILES.has(f));
  if (!found) {
    err(`Scène "${scene}" — aucun fichier trouvé parmi [${files.join(', ')}]`);
  } else {
    ok(`Scène "${scene}" — ${files.find(f => SCENE_FILES.has(f))} présent`);
  }
});

// ═══════════════════════════════════════════════════════════════
// 5. ASSETS — Portraits personnages
// ═══════════════════════════════════════════════════════════════
section('5. Assets — portraits (assets/characters/)');

const EXPECTED_CHARS = [
  'deschamps','dominique','laroche','lefebvre','patrice',
  'aubert','ruiz','perrin','formatrice','favre','fontaine',
  'renaud','marie','vasseur','kevin','andrieux',
];

EXPECTED_CHARS.forEach(name => {
  if (CHAR_FILES.has(name + '.png')) {
    ok(`${name}.png présent`);
  } else {
    err(`${name}.png manquant dans assets/characters/`);
  }
});

// ═══════════════════════════════════════════════════════════════
// 6. ASSETS — Références dans preloader.js
// ═══════════════════════════════════════════════════════════════
section('6. Assets — cohérence preloader.js');

const preloaderSrc = fs.readFileSync(path.join(ROOT, 'js/preloader.js'), 'utf8');

// Extraire tous les chemins d'assets déclarés dans le preloader (avec extension)
const assetPaths = [...preloaderSrc.matchAll(/['"`]assets\/([^'"`]+\.[a-z0-9]+)['"`]/gi)].map(m => m[1]);

assetPaths.forEach(assetPath => {
  const [dir, ...rest] = assetPath.split('/');
  const fileName = rest.join('/');
  if (dir === 'scenes') {
    if (!SCENE_FILES.has(fileName)) {
      err(`preloader.js référence "assets/scenes/${fileName}" qui n'existe pas sur le disque`);
    } else {
      ok(`preloader assets/scenes/${fileName} OK`);
    }
  } else if (dir === 'characters') {
    if (!CHAR_FILES.has(fileName)) {
      err(`preloader.js référence "assets/characters/${fileName}" qui n'existe pas`);
    } else {
      ok(`preloader assets/characters/${fileName} OK`);
    }
  }
});

// ═══════════════════════════════════════════════════════════════
// 7. COHÉRENCE SERVICES / CHAPITRES
// ═══════════════════════════════════════════════════════════════
section('7. Cohérence services (SERVICES[])');

if (!SERVICES_LIST || !Array.isArray(SERVICES_LIST)) {
  err('SERVICES non chargé');
} else {
  ok(`${SERVICES_LIST.length} services définis`);
  SERVICES_LIST.forEach(svc => {
    (svc.priority || []).forEach(idx => {
      if (idx >= CHAPTERS.length) {
        err(`Service "${svc.id}" priority[${idx}] hors bornes (CHAPTERS.length=${CHAPTERS.length})`);
      }
    });
  });
}

// ═══════════════════════════════════════════════════════════════
// 8. COHÉRENCE SCORES / JAUGES
// ═══════════════════════════════════════════════════════════════
section('8. Cohérence des jauges (simulation all-good / all-bad)');

function simulateJauges(choiceType) {
  let gauges = { i: 70, p: 70, m: 70 };
  CHAPTERS.slice(0, 10).forEach((ch, idx) => {
    const choice = ch.choices.find(c => c.type === choiceType) || ch.choices[0];
    if (choice?.gauges) {
      gauges.i = Math.max(0, Math.min(100, gauges.i + (choice.gauges.i || 0)));
      gauges.p = Math.max(0, Math.min(100, gauges.p + (choice.gauges.p || 0)));
      gauges.m = Math.max(0, Math.min(100, gauges.m + (choice.gauges.m || 0)));
    }
  });
  return gauges;
}

const allGood = simulateJauges('good');
const allBad  = simulateJauges('bad');

ok(`Simulation all-good (10 affaires) → i:${allGood.i} p:${allGood.p} m:${allGood.m}`);
ok(`Simulation all-bad  (10 affaires) → i:${allBad.i}  p:${allBad.p}  m:${allBad.m}`);

if (allGood.i < 80) warn(`Intégrité all-good finale (${allGood.i}) inférieure à 80 — scoring peut-être trop pénalisé`);
if (allBad.i > 30)  warn(`Intégrité all-bad finale (${allBad.i}) supérieure à 30 — pénalités insuffisantes`);

// Vérifie qu'aucune jauge ne sort des bornes 0-100 avec toutes les combinaisons
let jaugeOutOfBounds = false;
CHAPTERS.forEach((ch, i) => {
  (ch.choices || []).forEach((c, ci) => {
    if (!c.gauges) return;
    ['i','p','m'].forEach(g => {
      const abs = Math.abs(c.gauges[g] || 0);
      if (abs > 50) warn(`CHAPTERS[${i}] choice[${ci}] jauge.${g} = ${c.gauges[g]} (delta très élevé)`);
    });
  });
});

// ═══════════════════════════════════════════════════════════════
// 9. SCÈNES DANS CHAPTERS vs SCENES{}
// ═══════════════════════════════════════════════════════════════
section('9. Toutes les scènes référencées existent dans SCENES{}');

const usedScenes = new Set();
CHAPTERS.forEach(ch => {
  if (ch.sc) usedScenes.add(ch.sc);
  (ch.dialogue || []).forEach(l => { if (l.sc) usedScenes.add(l.sc); });
  (ch.preDialogue || []).forEach(l => { if (l.sc) usedScenes.add(l.sc); });
  (ch.microDecisions || []).forEach(md => {
    (md.choices || []).forEach(c => {
      if (c.sceneAtLine0) usedScenes.add(c.sceneAtLine0);
      if (c.sceneAfter)   usedScenes.add(c.sceneAfter);
      (c.dialogueInject || []).forEach(l => { if (l.sc) usedScenes.add(l.sc); });
    });
  });
});

usedScenes.forEach(sc => {
  if (!SCENE_KEYS.includes(sc)) {
    err(`Scène "${sc}" utilisée dans CHAPTERS[] mais absente de SCENES{}`);
  } else {
    ok(`Scène "${sc}" référencée et définie`);
  }
});

// ═══════════════════════════════════════════════════════════════
// RÉSUMÉ
// ═══════════════════════════════════════════════════════════════
console.log('\n' + '═'.repeat(50));
console.log(B('RÉSUMÉ'));
console.log(G(`  ✓ ${passed} tests passés`));
if (warnings) console.log(Y(`  ⚠ ${warnings} avertissements`));
if (errors)   console.log(R(`  ✗ ${errors} erreurs`));
console.log('═'.repeat(50));

process.exit(errors > 0 ? 1 : 0);
