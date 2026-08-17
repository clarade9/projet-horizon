// ═══════════════════════════════════════════════════════════════
// PERSONNAGES — Affichage et état de parole
// ═══════════════════════════════════════════════════════════════

// Position du PNJ (slot droit "cr") selon la scène
// — les valeurs correspondent à la mise en page de chaque image de fond
const POSITIONS_PNJ = {
  prologue:     { right: '8%',  bottom: '16%', height: '60vh', heightMobile: '36vh' },
  rh:           { right: '10%', bottom: '24%', height: '50vh', heightMobile: '34vh' },
  resto:        { right: '5%',  bottom: '10%', height: '65vh', heightMobile: '36vh' },
  bistro:       { right: '5%',  bottom: '10%', height: '65vh', heightMobile: '36vh' },
  restojour:    { right: '5%',  bottom: '10%', height: '65vh', heightMobile: '36vh' },
  bureau9:      { right: '8%',  bottom: '18%', height: '54vh', heightMobile: '34vh' },
  bureaujour:   { right: '8%',  bottom: '18%', height: '54vh', heightMobile: '34vh' },
  sallereunion: { right: '8%',  bottom: '18%', height: '54vh', heightMobile: '34vh' },
  pesee:        { right: '3%',  bottom: '18%', height: '56vh', heightMobile: '34vh' },
  indus:        { right: '4%',  bottom: '16%', height: '60vh', heightMobile: '36vh' },
  epilogue:     { right: '8%',  bottom: '16%', height: '55vh', heightMobile: '34vh' },
  tutorial:     { right: '6%',  bottom: '14%', height: '62vh', heightMobile: '32vh', positionMobile: { right: '4%', top: '5vh' } },
  finance:      { right: '8%',  bottom: '18%', height: '54vh', heightMobile: '34vh' },
  commercial:   { right: '6%',  bottom: '16%', height: '56vh', heightMobile: '34vh' },
  bureau1:      { right: '8%',  bottom: '18%', height: '54vh', heightMobile: '34vh' },
  bureauf:      { right: '8%',  bottom: '18%', height: '54vh', heightMobile: '34vh' },
  bureau2:      { right: '8%',  bottom: '18%', height: '54vh', heightMobile: '34vh' },
  mairie:       { right: '6%',  bottom: '16%', height: '58vh', heightMobile: '36vh' },
  tennis:             { right: '4%',  bottom: '12%', height: '62vh', heightMobile: '36vh' },
  maintenance:        { right: '8%',  bottom: '18%', height: '54vh', heightMobile: '34vh' },
  maintenancebureau:  { right: '8%',  bottom: '18%', height: '54vh', heightMobile: '34vh' },
  maintenancereunion: { right: '8%',  bottom: '18%', height: '54vh', heightMobile: '34vh' },
  nuitcollecte:       { right: '5%',  bottom: '10%', height: '60vh', heightMobile: '36vh' },
  _defaut:            { right: '7%',  bottom: '16%', height: '55vh', heightMobile: '34vh' },
};

// Retourne la clé de scène correspondant à la phase et au chapitre en cours
function _cleSceneCourante() {
  if (etatJeu.phase === 'prologue') return 'prologue';
  if (etatJeu.phase === 'epilogue') return 'epilogue';
  if (etatJeu.phase === 'tutorial') return 'tutorial';
  return etatJeu.sceneOverride || (CHAPTERS[etatJeu.ch] || {}).sc || '_defaut';
}

// Affiche ou masque un personnage dans le slot indiqué ('cl' = gauche, 'cr' = droite)
// personnage = null → masque le slot
// personnage = { css, em, nm } → affiche le portrait
function showChar(slotId, personnage) {
  const element = $(slotId);
  if (!personnage) {
    element.className = 'char hidden';
    element.innerHTML = '';
    element.removeAttribute('style');
    return;
  }

  element.className = 'char';

  // Le personnage joueur (slot cl) n'a pas de portrait visible — ancre invisible
  if (slotId === 'cl') {
    element.innerHTML    = '';
    element.style.cssText = 'left:0;bottom:0;';
    return;
  }

  // Portrait du PNJ positionné selon la scène courante
  const position = POSITIONS_PNJ[_cleSceneCourante()] || POSITIONS_PNJ._defaut;
  const { height, heightMobile, positionMobile, ...coordonnees } = position;
  const isMobile = window.innerWidth <= 768;
  const hauteurEffective = (isMobile && heightMobile) ? heightMobile : height;
  const coords = (isMobile && positionMobile) ? positionMobile : coordonnees;
  element.style.cssText = Object.entries(coords).map(([k, v]) => `${k}:${v}`).join(';');

  const clePortrait = personnage.css.replace('c-', '');
  element.innerHTML = `
    <div class="char-bubble">
      <div class="char-ring"></div>
      <img class="char-portrait" src="assets/characters/${clePortrait}.png" alt="${personnage.nm}" style="height:${hauteurEffective}">
    </div>`;
}

// Applique les classes CSS d'animation "speaking" / "idle" sur les personnages visibles
// activeId = identifiant du slot qui parle ('cl' ou 'cr'), null = personne
function setSpeaking(activeId) {
  ['cl', 'cr'].forEach(slotId => {
    const element = $(slotId);
    if (!element.innerHTML) return;
    element.classList.remove('speaking', 'idle');
    element.classList.add(slotId === activeId ? 'speaking' : 'idle');
  });
}
