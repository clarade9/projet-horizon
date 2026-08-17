// ═══════════════════════════════════════
// SCENE BUILDER — image backgrounds + animated overlays
// ═══════════════════════════════════════

function bgImg(scene) {
  const img = mk('sc-bg', 'img');
  img.src = `assets/scenes/${scene}.webp`;
  img.onerror = () => { img.src = `assets/scenes/${scene}.jpg`; };
  return img;
}

const SCENES = {
  'prologue': () => {
    const s = mk('sc-prologue');
    s.appendChild(bgImg('prologue'));
    // city lights twinkling
    for (let i = 0; i < 18; i++) {
      const c = mk('city-light', 'div');
      c.style.cssText = `width:${2+Math.random()*5}px;height:${2+Math.random()*4}px;background:hsl(${30+Math.random()*60},80%,${60+Math.random()*20}%);top:${45+Math.random()*40}%;left:${5+Math.random()*80}%;animation-delay:${Math.random()*3}s;animation-duration:${1.5+Math.random()*2.5}s;position:absolute;`;
      s.appendChild(c);
    }
    return s;
  },

  'rh': () => {
    const s = mk('sc-rh');
    s.appendChild(bgImg('bureau1'));
    // floating dust motes in light
    for (let i = 0; i < 20; i++) {
      const d = mk('dust-mote', 'div');
      d.style.cssText = `left:${Math.random()*100}%;bottom:${10+Math.random()*70}%;animation-duration:${5+Math.random()*6}s;animation-delay:${Math.random()*6}s;`;
      s.appendChild(d);
    }
    return s;
  },

  'bureau1': () => {
    const s = mk('sc-bureau1');
    s.appendChild(bgImg('bureau1'));
    // floating dust motes in office light
    for (let i = 0; i < 20; i++) {
      const d = mk('dust-mote', 'div');
      d.style.cssText = `left:${Math.random()*100}%;bottom:${10+Math.random()*70}%;animation-duration:${5+Math.random()*6}s;animation-delay:${Math.random()*6}s;`;
      s.appendChild(d);
    }
    return s;
  },

  'bureauf': () => {
    const s = mk('sc-bureauf');
    s.appendChild(bgImg('bureauf'));
    // pluie fine — ambiance nuit industrielle
    for (let i = 0; i < 22; i++) {
      const d = mk('rain-drop', 'div');
      d.style.cssText = `left:${Math.random()*100}%;height:${5+Math.random()*10}px;opacity:.25;animation-duration:${0.5+Math.random()*0.5}s;animation-delay:${Math.random()*2}s;`;
      s.appendChild(d);
    }
    return s;
  },

  'mairie': () => {
    const s = mk('sc-mairie');
    s.appendChild(bgImg('mairie'));
    // poussières légères — bureau municipal
    for (let i = 0; i < 14; i++) {
      const d = mk('dust-mote', 'div');
      d.style.cssText = `left:${Math.random()*100}%;bottom:${10+Math.random()*70}%;animation-duration:${6+Math.random()*7}s;animation-delay:${Math.random()*6}s;`;
      s.appendChild(d);
    }
    return s;
  },

  'bureau2': () => {
    const s = mk('sc-bureau2');
    s.appendChild(bgImg('bureau2'));
    // poussières légères — bureau juridique
    for (let i = 0; i < 16; i++) {
      const d = mk('dust-mote', 'div');
      d.style.cssText = `left:${Math.random()*100}%;bottom:${10+Math.random()*70}%;animation-duration:${5+Math.random()*6}s;animation-delay:${Math.random()*6}s;`;
      s.appendChild(d);
    }
    return s;
  },

  'resto': () => {
    const s = mk('sc-resto');
    s.appendChild(bgImg('resto'));
    // candlelight shimmer particles
    for (let i = 0; i < 12; i++) {
      const p = mk('candle-particle', 'div');
      p.style.cssText = `left:${35+Math.random()*30}%;bottom:${30+Math.random()*30}%;animation-duration:${1.5+Math.random()*2}s;animation-delay:${Math.random()*3}s;`;
      s.appendChild(p);
    }
    return s;
  },

  'restojour': () => {
    const s = mk('sc-restojour');
    s.appendChild(bgImg('restojour'));
    // légères poussières — ambiance restaurant de jour
    for (let i = 0; i < 12; i++) {
      const d = mk('dust-mote', 'div');
      d.style.cssText = `left:${Math.random()*100}%;bottom:${10+Math.random()*70}%;animation-duration:${5+Math.random()*6}s;animation-delay:${Math.random()*6}s;`;
      s.appendChild(d);
    }
    return s;
  },

  'bistro': () => {
    const s = mk('sc-bistro');
    s.appendChild(bgImg('bistro'));
    // légères poussières — ambiance brasserie de quartier
    for (let i = 0; i < 10; i++) {
      const d = mk('dust-mote', 'div');
      d.style.cssText = `left:${Math.random()*100}%;bottom:${10+Math.random()*70}%;animation-duration:${5+Math.random()*6}s;animation-delay:${Math.random()*6}s;`;
      s.appendChild(d);
    }
    return s;
  },

  'sallereunion': () => {
    const s = mk('sc-sallereunion');
    s.appendChild(bgImg('sallereunion'));
    // poussières de bureau — ambiance salle de réunion
    for (let i = 0; i < 14; i++) {
      const d = mk('dust-mote', 'div');
      d.style.cssText = `left:${Math.random()*100}%;bottom:${10+Math.random()*70}%;animation-duration:${4+Math.random()*5}s;animation-delay:${Math.random()*5}s;`;
      s.appendChild(d);
    }
    return s;
  },

  'pesee': () => {
    const s = mk('sc-pesee');
    s.appendChild(bgImg('pesee'));
    // rain outside
    for (let i = 0; i < 30; i++) {
      const d = mk('rain-drop', 'div');
      d.style.cssText = `left:${Math.random()*100}%;height:${6+Math.random()*14}px;opacity:.4;animation-duration:${0.4+Math.random()*0.5}s;animation-delay:${Math.random()*2}s;`;
      s.appendChild(d);
    }
    return s;
  },

  'indus': () => {
    const s = mk('sc-indus');
    s.appendChild(bgImg('indus'));
    // drifting clouds
    const cloudSizes = [{w:180,h:28},{w:130,h:22},{w:220,h:32}];
    cloudSizes.forEach((c, i) => {
      const cl = mk('sc-cloud', 'div');
      cl.style.cssText = `top:${6+i*8}%;width:${c.w}px;height:${c.h}px;animation-duration:${22+i*8}s;animation-delay:${-i*7}s;opacity:${0.4+i*.08};`;
      s.appendChild(cl);
    });
    // chimney smoke
    for (let i = 0; i < 8; i++) {
      const sm = mk('sc-smoke-puff', 'div');
      sm.style.cssText = `left:${32+Math.random()*18}%;bottom:${55+Math.random()*8}%;animation-duration:${3+Math.random()*2}s;animation-delay:${i*.6}s;`;
      s.appendChild(sm);
    }
    return s;
  },

  'finance': () => {
    const s = mk('sc-finance');
    s.appendChild(bgImg('findumois'));
    // légère pluie — ambiance audit nocturne
    for (let i = 0; i < 18; i++) {
      const d = mk('rain-drop', 'div');
      d.style.cssText = `left:${Math.random()*100}%;height:${4+Math.random()*8}px;opacity:.18;animation-duration:${0.6+Math.random()*0.6}s;animation-delay:${Math.random()*3}s;`;
      s.appendChild(d);
    }
    const phone = document.createElement('img');
    phone.className = 'sc-phone-overlay';
    phone.src = 'assets/scenes/telephonerenaud.webp';
    phone.alt = '';
    s.appendChild(phone);
    return s;
  },

  'commercial': () => {
    const s = mk('sc-commercial');
    s.appendChild(bgImg('contratatoutprix'));
    // poussières légères — bureau commercial actif
    for (let i = 0; i < 18; i++) {
      const d = mk('dust-mote', 'div');
      d.style.cssText = `left:${Math.random()*100}%;bottom:${10+Math.random()*70}%;animation-duration:${5+Math.random()*6}s;animation-delay:${Math.random()*6}s;`;
      s.appendChild(d);
    }
    return s;
  },

  'tennis': () => {
    const s = mk('sc-tennis');
    s.appendChild(bgImg('tennis'));
    // scintillements de lumière solaire extérieure
    for (let i = 0; i < 10; i++) {
      const f = mk('sun-flare', 'div');
      f.style.cssText = `left:${5+Math.random()*90}%;top:${5+Math.random()*50}%;animation-duration:${3+Math.random()*4}s;animation-delay:${Math.random()*5}s;`;
      s.appendChild(f);
    }
    return s;
  },

  'bureau9': () => {
    const s = mk('sc-bureau9');
    s.appendChild(bgImg('bureau9'));
    // phone overlay — convention de Fontaine reçue par mail
    const phone = document.createElement('img');
    phone.className = 'sc-phone-overlay';
    phone.src = 'assets/scenes/telephonefontaine.webp';
    phone.alt = '';
    s.appendChild(phone);
    // légères poussières — bureau fin de journée
    for (let i = 0; i < 14; i++) {
      const d = mk('dust-mote', 'div');
      d.style.cssText = `left:${Math.random()*100}%;bottom:${10+Math.random()*70}%;animation-duration:${5+Math.random()*6}s;animation-delay:${Math.random()*6}s;`;
      s.appendChild(d);
    }
    return s;
  },

  // Scène téléphone Perrin (Affaire 6) — fond bureau9, téléphone Perrin
  'bureauPerrin': () => {
    const s = mk('sc-bureau9');
    s.appendChild(bgImg('bureau9'));
    const phone = document.createElement('img');
    phone.className = 'sc-phone-overlay';
    phone.src = 'assets/scenes/telephoneperrin.webp';
    phone.alt = '';
    s.appendChild(phone);
    for (let i = 0; i < 14; i++) {
      const d = mk('dust-mote', 'div');
      d.style.cssText = `left:${Math.random()*100}%;bottom:${10+Math.random()*70}%;animation-duration:${5+Math.random()*6}s;animation-delay:${Math.random()*6}s;`;
      s.appendChild(d);
    }
    return s;
  },

  // Scène téléphone Laroche (Affaire 2) — même fond bureau9, téléphone différent
  'bureaularoche': () => {
    const s = mk('sc-bureau9');
    s.appendChild(bgImg('bureau9'));
    const phone = document.createElement('img');
    phone.className = 'sc-phone-overlay';
    phone.src = 'assets/scenes/telephonelaroche.webp';
    phone.alt = '';
    s.appendChild(phone);
    for (let i = 0; i < 14; i++) {
      const d = mk('dust-mote', 'div');
      d.style.cssText = `left:${Math.random()*100}%;bottom:${10+Math.random()*70}%;animation-duration:${5+Math.random()*6}s;animation-delay:${Math.random()*6}s;`;
      s.appendChild(d);
    }
    return s;
  },

  'bureaujour': () => {
    const s = mk('sc-bureaujour');
    s.appendChild(bgImg('bureaujour'));
    // légères poussières — bureau de jour
    for (let i = 0; i < 16; i++) {
      const d = mk('dust-mote', 'div');
      d.style.cssText = `left:${Math.random()*100}%;bottom:${10+Math.random()*70}%;animation-duration:${5+Math.random()*6}s;animation-delay:${Math.random()*6}s;`;
      s.appendChild(d);
    }
    return s;
  },

  // Scène maintenance — atelier site industriel (Affaire 11)
  'maintenance': () => {
    const s = mk('sc-maintenance');
    const img = mk('sc-bg', 'img');
    img.src = 'assets/scenes/maintenance.webp';
    s.appendChild(img);
    // légères poussières en suspension — atelier
    for (let i = 0; i < 14; i++) {
      const d = mk('dust-mote', 'div');
      d.style.cssText = `left:${Math.random()*100}%;bottom:${10+Math.random()*60}%;animation-duration:${6+Math.random()*7}s;animation-delay:${Math.random()*7}s;`;
      s.appendChild(d);
    }
    return s;
  },

  // Scène bureau maintenance — bureau du responsable, catalogue ouvert avec Post-it (Affaire 11 intro)
  'maintenancebureau': () => {
    const s = mk('sc-maintenancebureau');
    const img = mk('sc-bg', 'img');
    img.src = 'assets/scenes/maintenancebureau.webp';
    s.appendChild(img);
    // légères poussières — bureau chaud en fin de journée
    for (let i = 0; i < 12; i++) {
      const d = mk('dust-mote', 'div');
      d.style.cssText = `left:${Math.random()*100}%;bottom:${15+Math.random()*65}%;animation-duration:${5+Math.random()*6}s;animation-delay:${Math.random()*6}s;`;
      s.appendChild(d);
    }
    return s;
  },

  // Scène salle de réunion maintenance — réunion avec catalogue (Affaire 11)
  'maintenancereunion': () => {
    const s = mk('sc-maintenancereunion');
    const img = mk('sc-bg', 'img');
    img.src = 'assets/scenes/maintenancereunion.webp';
    s.appendChild(img);
    // légères poussières — salle de réunion lumineuse
    for (let i = 0; i < 12; i++) {
      const d = mk('dust-mote', 'div');
      d.style.cssText = `left:${Math.random()*100}%;bottom:${15+Math.random()*65}%;animation-duration:${5+Math.random()*6}s;animation-delay:${Math.random()*6}s;`;
      s.appendChild(d);
    }
    return s;
  },

  'tutorial': () => {
    const s = mk('sc-tutorial');
    s.appendChild(bgImg('salle-formation'));
    return s;
  },

  // Scène dépôt de nuit — bennes à ordures, éclairage industriel (Affaire 12)
  'nuitcollecte': () => {
    const s = mk('sc-nuitcollecte');
    const img = mk('sc-bg', 'img');
    img.src = 'assets/scenes/depot.webp';
    s.appendChild(img);
    // pluie fine — nuit industrielle
    for (let i = 0; i < 25; i++) {
      const d = mk('rain-drop', 'div');
      d.style.cssText = `left:${Math.random()*100}%;height:${5+Math.random()*10}px;opacity:.3;animation-duration:${0.4+Math.random()*0.5}s;animation-delay:${Math.random()*2}s;`;
      s.appendChild(d);
    }
    return s;
  },

  // Scène zone 3 — secteur industriel, visite terrain audit (Affaire 13)
  'zone3': () => {
    const s = mk('sc-zone3');
    const img = mk('sc-bg', 'img');
    img.src = 'assets/scenes/zone3.webp';
    s.appendChild(img);
    // légères poussières en suspension — zone industrielle
    for (let i = 0; i < 16; i++) {
      const d = mk('dust-mote', 'div');
      d.style.cssText = `left:${Math.random()*100}%;bottom:${10+Math.random()*60}%;animation-duration:${5+Math.random()*6}s;animation-delay:${Math.random()*6}s;`;
      s.appendChild(d);
    }
    return s;
  },

  // Scène salle de réunion QSE — rapport d'audit sur la table, panneaux QSE (Affaire 13)
  'reunionqse': () => {
    const s = mk('sc-reunionqse');
    const img = mk('sc-bg', 'img');
    img.src = 'assets/scenes/reunionqse.webp';
    s.appendChild(img);
    // légères poussières — salle de réunion QSE lumineuse
    for (let i = 0; i < 14; i++) {
      const d = mk('dust-mote', 'div');
      d.style.cssText = `left:${Math.random()*100}%;bottom:${10+Math.random()*70}%;animation-duration:${4+Math.random()*5}s;animation-delay:${Math.random()*5}s;`;
      s.appendChild(d);
    }
    return s;
  },

  'epilogue': () => {
    const s = mk('sc-epilogue');
    s.appendChild(bgImg('epilogue'));
    // shooting stars
    for (let i = 0; i < 3; i++) {
      const sh = document.createElement('div');
      sh.className = 'shooting-star';
      sh.style.cssText = `top:${8+Math.random()*35}%;left:${5+Math.random()*50}%;animation-duration:${10+i*4}s;animation-delay:${i*3.5+Math.random()*2}s;`;
      s.appendChild(sh);
    }
    return s;
  }
};

function mk(cls, tag='div') {
  const el = document.createElement(tag);
  el.className = cls;
  return el;
}

// All non-epilogue scenes get a vignette overlay for dialogue readability
const IMAGE_SCENES = ['prologue','rh','bureau1','bureauf','mairie','bureau2','finance','commercial','tennis','restojour','bureau9','bureaularoche','bureauPerrin','bureaujour','resto','bistro','sallereunion','pesee','indus','maintenance','maintenancebureau','maintenancereunion','nuitcollecte','zone3','reunionqse','tutorial'];

// Tracks the current scene key to avoid needlessly rebuilding the same scene
// (which would reset phone/overlay states mid-chapter)
let _currentSceneKey = null;

function buildScene(key) {
  // Skip DOM rebuild if the scene hasn't changed — preserves phone overlay state
  if (key === _currentSceneKey) {
    AudioEngine.playScene(key);
    return;
  }

  const doSwap = () => {
    _currentSceneKey = key;
    const sc = $('scene');
    sc.innerHTML = '';
    if (!SCENES[key]) return;
    sc.appendChild(SCENES[key]());
    if (IMAGE_SCENES.includes(key)) sc.appendChild(mk('scene-vignette'));
    AudioEngine.playScene(key);
  };

  // Si loadChapter a déjà lancé un fade, on est déjà en noir → swapper directement
  const fadeEl = $('fade');
  if (fadeEl && fadeEl.classList.contains('in')) {
    doSwap();
    return;
  }

  // Transition rapide pour les changements de scène en cours de dialogue
  if (fadeEl) {
    fadeEl.style.transitionDuration = '200ms';
    fadeEl.classList.add('in');
    setTimeout(() => {
      doSwap();
      requestAnimationFrame(() => {
        fadeEl.classList.remove('in');
        setTimeout(() => { fadeEl.style.transitionDuration = ''; }, 250);
      });
    }, 220);
  } else {
    doSwap();
  }
}

// Shows the phone overlay in the current scene with an entrance + vibration animation.
// Called when the narrator announces "Votre téléphone sonne."
function revealScenePhone() {
  const phone = document.querySelector('.sc-phone-overlay');
  if (phone) phone.classList.add('sc-phone-visible');
}

// ═══════════════════════════════════════════════════════════
// ANIMATION TÉLÉPHONE — overlay plein écran réutilisable
// imageFile : nom du fichier dans assets/scenes/ (ex: "telephoneperrin.webp")
// callback  : appelé après la disparition de l'animation
// ═══════════════════════════════════════════════════════════
function showPhoneAnimation(imageFile, callback) {
  // Supprime une éventuelle animation déjà en cours
  const existing = document.getElementById('phone-anim-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'phone-anim-overlay';

  const img = document.createElement('img');
  img.className = 'phone-anim-img';
  img.src = 'assets/scenes/' + imageFile;
  img.alt = '';
  overlay.appendChild(img);
  $('game').appendChild(overlay);

  // Son + vibration haptique
  if (typeof AudioEngine !== 'undefined') {
    AudioEngine.sfx.phoneRing();
    AudioEngine.sfx.vibrate();
  }

  // Disparition après 2 sonneries (~2.2s)
  setTimeout(() => {
    overlay.classList.add('phone-anim-out');
    setTimeout(() => {
      overlay.remove();
      if (callback) callback();
    }, 400);
  }, 2200);
}
