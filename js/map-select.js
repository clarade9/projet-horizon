// ═══════════════════════════════════════════════════════════════
// MAP SELECT — Sélection du service via la carte interactive SEM
// ═══════════════════════════════════════════════════════════════

(function () {

  // ── État interne ─────────────────────────────────────────────
  let _serviceActif = null;
  const _showZones  = new URLSearchParams(location.search).has('showzones');

  // ── Mobile nav ───────────────────────────────────────────────
  const _isMobile = () => window.innerWidth <= 768;
  let _mapCurrentIdx = 0;

  // Ordre spatial gauche→droite basé sur mapBox.x de chaque service
  // (services enfants exclus — ils apparaissent dans le sous-menu de leur parent)
  function _getServicesDisponibles() {
    return [...SERVICES].filter(sv => !sv.parentZone).sort((a, b) => a.mapBox.x - b.mapBox.x);
  }

  // ── Point d'entrée public ────────────────────────────────────
  function showMapSelect() {
    _construireInterface();
    requestAnimationFrame(() => {
      $('map-select').classList.add('on');
      if (_showZones) $('map-select').classList.add('showzones');
    });
    _attacherEvenements();
  }

  // ── Construction du DOM ──────────────────────────────────────
  function _construireInterface() {
    const el = $('map-select');
    // N'afficher que les zones indépendantes (pas les services enfants)
    const zonesHtml = SERVICES.filter(sv => !sv.parentZone).map(sv => _htmlZone(sv)).join('');
    const isMobile  = 'ontouchstart' in window || window.innerWidth <= 768;
    const instrTxt  = isMobile ? 'Touchez votre service pour commencer' : 'Cliquez sur votre service pour commencer';

    el.innerHTML = `
      <img class="map-img" id="map-img" src="assets/scenes/carte-sem.webp"
           alt="Carte SEM Horizon" draggable="false">
      <div class="map-hud-title">
        <div class="map-hud-sem">SEM <strong>Horizon</strong></div>
        <div class="map-hud-sub">Formation Anticorruption</div>
      </div>
      <div class="map-progress-bar">
        <span class="map-progress-text">${instrTxt}</span>
      </div>
      <div class="map-zones" id="map-zones">${zonesHtml}</div>
      <div class="map-tooltip" id="map-tooltip" role="tooltip" aria-live="polite"></div>
      <div class="map-confirm-overlay" id="map-confirm-overlay">
        <div class="map-confirm-panel" id="map-confirm-panel"></div>
      </div>
      <button class="map-nav-btn map-nav-left"  aria-label="Service précédent" onclick="_mapNavigate(-1)">&#x2039;</button>
      <button class="map-nav-btn map-nav-right" aria-label="Service suivant"   onclick="_mapNavigate(1)">&#x203a;</button>
      <div class="map-dots" id="map-dots"></div>
      <div class="map-swipe-hint" id="map-swipe-hint">
        <span>&#8592;</span>
        <span style="font-size:11px;opacity:.7">Faites défiler</span>
        <span>&#8594;</span>
      </div>
      <div class="map-bottom-panel" id="map-bottom-panel">
        <div class="map-bp-service">
          <div class="map-bp-icon" id="map-bp-icon">🏢</div>
          <div class="map-bp-info">
            <div class="map-bp-name" id="map-bp-name">—</div>
            <div class="map-bp-meta">
              <span id="map-bp-duree"></span>
              <span class="map-bp-sep">·</span>
              <span id="map-bp-status">Disponible</span>
            </div>
          </div>
        </div>
        <button class="map-bp-btn" id="map-bp-btn" onclick="_mapCommencer()">Commencer →</button>
      </div>`;

    // Init mobile : dots, hint, panneau bas
    if (isMobile) {
      _initMobileNav();
    }

    // Aligne les zones dès que l'image est chargée (ou immédiatement si déjà en cache)
    const img = el.querySelector('#map-img');
    if (img.complete && img.naturalWidth) {
      _ajusterZonesAuxImage();
    } else {
      img.addEventListener('load', _ajusterZonesAuxImage);
    }
    window.addEventListener('resize', _ajusterZonesAuxImage);
  }

  // Calcule les dimensions réelles de l'image et repositionne #map-zones
  // — Mobile : fit par hauteur + scroll horizontal
  // — Desktop : object-fit contain centré
  function _ajusterZonesAuxImage() {
    const container = $('map-select');
    const img       = document.getElementById('map-img');
    const zones     = $('map-zones');
    if (!container || !img || !zones || !img.naturalWidth) return;

    const cW = container.clientWidth;
    const cH = container.clientHeight;
    const iW = img.naturalWidth;
    const iH = img.naturalHeight;

    const isMobile = window.innerWidth <= 640;
    let rW, rH, rX, rY;

    if (isMobile) {
      // Fit par hauteur : la carte remplit l'écran en hauteur et déborde horizontalement
      const scale = cH / iH;
      rW = Math.round(iW * scale);
      rH = cH;
      rX = 0;
      rY = 0;
      // L'image remplace son positionnement inset par des dimensions explicites
      img.style.cssText = `position:absolute;left:0;top:0;right:auto;bottom:auto;width:${rW}px;height:${rH}px;object-fit:fill;`;
      // Scroll initial au centre de la carte
      requestAnimationFrame(() => { container.scrollLeft = (rW - cW) / 2; });
    } else {
      // Desktop : object-fit contain centré
      img.style.cssText = '';
      const scale = Math.min(cW / iW, cH / iH);
      rW = iW * scale;
      rH = iH * scale;
      rX = (cW - rW) / 2;
      rY = (cH - rH) / 2;
    }

    zones.style.left   = rX + 'px';
    zones.style.top    = rY + 'px';
    zones.style.width  = rW + 'px';
    zones.style.height = rH + 'px';
    zones.style.right  = 'auto';
    zones.style.bottom = 'auto';
  }

  // Génère le HTML d'une zone cliquable (bounding-box positionnée)
  function _htmlZone(sv) {
    const b = sv.mapBox;
    return `<div class="map-zone" id="mz-${sv.id}" data-id="${sv.id}"
      style="left:${b.x}%;top:${b.y}%;width:${b.w}%;height:${b.h}%;--dot-color:${sv.mapColor}"
      tabindex="0" role="button" aria-label="${sv.label}">
      <div class="map-zone-pin">
        <div class="map-zone-ring"></div>
        <div class="map-zone-dot">${sv.em}</div>
      </div>
      <div class="map-zone-label">${sv.label}</div>
    </div>`;
  }

  // ── Événements ───────────────────────────────────────────────
  function _attacherEvenements() {
    const zonesEl = $('map-zones');
    if (!zonesEl) return;

    // Survol — desktop uniquement
    zonesEl.addEventListener('mouseenter', e => {
      const zone = e.target.closest('.map-zone');
      if (zone) _afficherTooltip(zone.dataset.id, zone);
    }, true);

    zonesEl.addEventListener('mouseleave', e => {
      const zone = e.target.closest('.map-zone');
      if (zone) _masquerTooltip();
    }, true);

    // Clic / tap
    zonesEl.addEventListener('click', e => {
      const zone = e.target.closest('.map-zone');
      if (zone) {
        _masquerTooltip();
        _ouvrirConfirmation(zone.dataset.id);
      }
    });

    // Clavier — Enter / Espace
    zonesEl.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        const zone = e.target.closest('.map-zone');
        if (zone) { e.preventDefault(); _ouvrirConfirmation(zone.dataset.id); }
      }
    });

    document.addEventListener('keydown', _escHandler);
  }

  function _escHandler(e) {
    if (e.key === 'Escape') _fermerConfirmation();
  }

  // ── Tooltip ──────────────────────────────────────────────────
  function _afficherTooltip(id, zoneEl) {
    const sv = SERVICES.find(s => s.id === id);
    if (!sv) return;
    const tt = $('map-tooltip');
    if (!tt) return;

    const risquesHtml = sv.risques.map(r => `<span class="map-tt-risk-tag">${r}</span>`).join('');
    tt.innerHTML = `
      <span class="map-tt-em">${sv.em}</span>
      <div class="map-tt-name">${sv.label}</div>
      <div class="map-tt-affaire">⏱ ${sv.duree} · ${sv.risques.length > 1 ? sv.risques.length + ' risques prioritaires' : '1 risque prioritaire'}</div>
      <div class="map-tt-risques">${risquesHtml}</div>`;

    const rect      = zoneEl.getBoundingClientRect();
    const container = $('map-select').getBoundingClientRect();
    // Centre horizontal de la zone pour choisir le côté du tooltip
    const xPct = sv.mapBox.x + sv.mapBox.w / 2;
    const yPct = sv.mapBox.y + sv.mapBox.h / 2;

    tt.style.cssText = '';

    // Vertical
    if (yPct > 55) {
      tt.style.bottom = (container.bottom - rect.top + 14) + 'px';
    } else {
      tt.style.top    = (rect.bottom - container.top + 14) + 'px';
    }

    // Horizontal
    if (xPct < 30) {
      tt.style.left      = Math.max(8, rect.left - container.left - 10) + 'px';
      tt.style.transform = '';
    } else if (xPct > 70) {
      tt.style.right     = Math.max(8, container.right - rect.right - 10) + 'px';
      tt.style.transform = '';
    } else {
      tt.style.left      = ((rect.left + rect.right) / 2 - container.left) + 'px';
      tt.style.transform = 'translateX(-50%)';
    }

    tt.classList.add('visible');
  }

  function _masquerTooltip() {
    const tt = $('map-tooltip');
    if (tt) tt.classList.remove('visible');
  }

  // ── Panneau de confirmation ───────────────────────────────────
  function _ouvrirConfirmation(id) {
    const sv = SERVICES.find(s => s.id === id);
    if (!sv) return;

    document.querySelectorAll('.map-zone').forEach(z => z.classList.remove('active'));
    const zoneEl = $('mz-' + id);
    if (zoneEl) zoneEl.classList.add('active');

    // Zone parent avec sous-services → afficher un sous-menu de sélection
    if (sv.subServices && sv.subServices.length > 0) {
      _ouvrirSousMenu(sv);
      return;
    }

    _serviceActif = id;

    const estDG     = !!sv.allPriority;
    const chapLabel = estDG
      ? 'Toutes les affaires'
      : `${sv.priority.length} prioritaire${sv.priority.length > 1 ? 's' : ''} + ${CHAPTERS.length - sv.priority.length} bonus`;

    const risquesHtml = sv.risques.map(r => `<span class="map-risk-tag">${r}</span>`).join('');

    $('map-confirm-panel').innerHTML = `
      <button class="map-confirm-close" id="map-cp-close" aria-label="Fermer">✕</button>
      <div class="map-confirm-header" style="--svc-color:${sv.mapColor}">
        <span class="map-confirm-em">${sv.em}</span>
        <div>
          <div class="map-confirm-service">${sv.label}</div>
          <div class="map-confirm-affaire" style="color:${sv.mapColor}">${sv.risques.join(' · ')}</div>
        </div>
      </div>
      <div class="map-confirm-meta">
        <span>⏱ ${sv.duree}</span>
        <span>📚 ${chapLabel}</span>
      </div>
      <div class="map-confirm-desc">${sv.desc}</div>
      <div class="map-confirm-risks">
        <div class="map-confirm-risks-label">Risques couverts</div>
        <div class="map-confirm-risks-tags">${risquesHtml}</div>
      </div>
      <button class="map-confirm-cta" id="map-confirm-cta">Commencer ce parcours →</button>`;

    $('map-confirm-overlay').classList.add('on');

    $('map-confirm-cta').addEventListener('click', _validerEtContinuer);
    $('map-cp-close').addEventListener('click', _fermerConfirmation);
    $('map-confirm-overlay').addEventListener('click', e => {
      if (e.target === $('map-confirm-overlay')) _fermerConfirmation();
    }, { once: true });
  }

  // ── Sous-menu pour les zones parentes (ex: Opérationnel) ─────
  function _ouvrirSousMenu(parentSv) {
    const enfants = parentSv.subServices.map(id => SERVICES.find(s => s.id === id)).filter(Boolean);

    const enfantsHtml = enfants.map(sv => {
      const chapLabel = sv.allPriority
        ? 'Toutes les affaires'
        : `${sv.priority.length} affaire${sv.priority.length > 1 ? 's' : ''} prioritaire${sv.priority.length > 1 ? 's' : ''}`;
      const risquesHtml = sv.risques.map(r => `<span class="map-risk-tag">${r}</span>`).join('');
      return `
        <div class="map-subsvc-card" data-subsvc="${sv.id}" style="--subsvc-color:${sv.mapColor}">
          <div class="map-subsvc-header">
            <span class="map-subsvc-em">${sv.em}</span>
            <div>
              <div class="map-subsvc-name">${sv.label}</div>
              <div class="map-subsvc-meta">⏱ ${sv.duree} · ${chapLabel}</div>
            </div>
          </div>
          <div class="map-subsvc-desc">${sv.desc}</div>
          <div class="map-confirm-risks-tags" style="margin-top:6px">${risquesHtml}</div>
        </div>`;
    }).join('');

    $('map-confirm-panel').innerHTML = `
      <button class="map-confirm-close" id="map-cp-close" aria-label="Fermer">✕</button>
      <div class="map-confirm-header" style="--svc-color:${parentSv.mapColor}">
        <span class="map-confirm-em">${parentSv.em}</span>
        <div>
          <div class="map-confirm-service">${parentSv.label}</div>
          <div class="map-confirm-affaire" style="color:${parentSv.mapColor}">Choisissez votre pôle</div>
        </div>
      </div>
      <div class="map-confirm-desc" style="margin-bottom:12px">${parentSv.desc}</div>
      <div class="map-subsvc-list">${enfantsHtml}</div>`;

    $('map-confirm-overlay').classList.add('on');

    // Clic sur une carte enfant → ouvre la confirmation normale
    $('map-confirm-panel').querySelectorAll('.map-subsvc-card').forEach(card => {
      card.addEventListener('click', () => {
        $('map-confirm-overlay').classList.remove('on');
        _serviceActif = null;
        // Légère pause pour que le fermeture soit visible
        setTimeout(() => _ouvrirConfirmationEnfant(card.dataset.subsvc), 150);
      });
    });

    $('map-cp-close').addEventListener('click', _fermerConfirmation);
    $('map-confirm-overlay').addEventListener('click', e => {
      if (e.target === $('map-confirm-overlay')) _fermerConfirmation();
    }, { once: true });
  }

  // Ouvre le panel de confirmation pour un service enfant directement
  function _ouvrirConfirmationEnfant(id) {
    const sv = SERVICES.find(s => s.id === id);
    if (!sv) return;
    _serviceActif = id;

    const estDG     = !!sv.allPriority;
    const autresCount = sv.soloMode ? 0 : CHAPTERS.filter((_, i) => !sv.priority.includes(i)).length;
    const chapLabel = estDG
      ? 'Toutes les affaires'
      : autresCount === 0
        ? `${sv.priority.length} affaire${sv.priority.length > 1 ? 's' : ''} au programme`
        : `${sv.priority.length} prioritaire${sv.priority.length > 1 ? 's' : ''} + ${autresCount} autres`;

    const risquesHtml = sv.risques.map(r => `<span class="map-risk-tag">${r}</span>`).join('');

    $('map-confirm-panel').innerHTML = `
      <button class="map-confirm-close" id="map-cp-close" aria-label="Fermer">✕</button>
      <button class="map-confirm-back" id="map-cp-back" aria-label="Retour">← Retour</button>
      <div class="map-confirm-header" style="--svc-color:${sv.mapColor}">
        <span class="map-confirm-em">${sv.em}</span>
        <div>
          <div class="map-confirm-service">${sv.label}</div>
          <div class="map-confirm-affaire" style="color:${sv.mapColor}">${sv.risques.join(' · ')}</div>
        </div>
      </div>
      <div class="map-confirm-meta">
        <span>⏱ ${sv.duree}</span>
        <span>📚 ${chapLabel}</span>
      </div>
      <div class="map-confirm-desc">${sv.desc}</div>
      <div class="map-confirm-risks">
        <div class="map-confirm-risks-label">Risques couverts</div>
        <div class="map-confirm-risks-tags">${risquesHtml}</div>
      </div>
      <button class="map-confirm-cta" id="map-confirm-cta">Commencer ce parcours →</button>`;

    $('map-confirm-overlay').classList.add('on');

    $('map-confirm-cta').addEventListener('click', _validerEtContinuer);
    $('map-cp-close').addEventListener('click', _fermerConfirmation);
    const parentId = sv.parentZone;
    $('map-cp-back').addEventListener('click', () => {
      $('map-confirm-overlay').classList.remove('on');
      _serviceActif = null;
      setTimeout(() => _ouvrirConfirmation(parentId), 150);
    });
    $('map-confirm-overlay').addEventListener('click', e => {
      if (e.target === $('map-confirm-overlay')) _fermerConfirmation();
    }, { once: true });
  }

  function _fermerConfirmation() {
    const overlay = $('map-confirm-overlay');
    if (overlay) overlay.classList.remove('on');
    document.querySelectorAll('.map-zone').forEach(z => z.classList.remove('active'));
    _serviceActif = null;
  }

  // ── Valider et passer à l'écran parcours ─────────────────────
  function _validerEtContinuer() {
    if (!_serviceActif) return;
    selectService(_serviceActif);

    document.removeEventListener('keydown', _escHandler);
    window.removeEventListener('resize', _ajusterZonesAuxImage);

    const el = $('map-select');
    el.classList.remove('on');
    el.classList.add('out');
    setTimeout(() => { el.style.display = 'none'; }, 500);

    showParcours();
  }

  // ── Navigation mobile ────────────────────────────────────────

  function _initMobileNav() {
    const services = _getServicesDisponibles();

    // Générer les dots
    const dotsEl = document.getElementById('map-dots');
    if (dotsEl) {
      dotsEl.innerHTML = services.map((_, i) =>
        `<div class="map-dot${i === 0 ? ' active' : ''}"></div>`
      ).join('');
    }

    // Hint "Faites défiler" au premier affichage
    if (!localStorage.getItem('map_hint_seen')) {
      const hint = document.getElementById('map-swipe-hint');
      if (hint) {
        hint.style.display = 'flex';
        setTimeout(() => {
          hint.style.transition = 'opacity .4s';
          hint.style.opacity = '0';
          setTimeout(() => { hint.style.display = 'none'; }, 400);
        }, 2000);
        localStorage.setItem('map_hint_seen', '1');
      }
    }

    // Panneau bas — initialiser avec le service centré (index 0)
    _mapCurrentIdx = 0;
    _mapUpdateBottomPanel(0);

    // Swipe tactile
    const container = $('map-select');
    if (container) {
      let _touchStartX = 0;
      container.addEventListener('touchstart', e => {
        _touchStartX = e.touches[0].clientX;
      }, { passive: true });
      container.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - _touchStartX;
        if (Math.abs(dx) > 40) _mapNavigate(dx < 0 ? 1 : -1);
      }, { passive: true });

      // Mettre à jour le panneau lors d'un scroll manuel
      container.addEventListener('scroll', _mapOnScroll, { passive: true });
    }
  }

  // Appelée par le scroll pour déduire quel service est centré
  function _mapOnScroll() {
    if (!_isMobile()) return;
    const container = $('map-select');
    const img = document.getElementById('map-img');
    if (!container || !img || !img.naturalWidth) return;

    // Position centrale du scroll courant (en px dans l'image redimensionnée)
    // On lit depuis img.style.width (calculé par _ajusterZonesAuxImage) pour éviter un getBoundingClientRect() qui force un reflow synchrone à chaque event scroll
    const imgRenderedW = parseInt(img.style.width, 10) || img.naturalWidth;
    const centerX = container.scrollLeft + container.clientWidth / 2;
    const pct = centerX / imgRenderedW * 100;

    // Trouver le service le plus proche du centre
    const services = _getServicesDisponibles();
    let nearest = 0, minDist = Infinity;
    services.forEach((sv, i) => {
      const svCenterPct = sv.mapBox.x + sv.mapBox.w / 2;
      const dist = Math.abs(svCenterPct - pct);
      if (dist < minDist) { minDist = dist; nearest = i; }
    });

    if (nearest !== _mapCurrentIdx) {
      _mapCurrentIdx = nearest;
      _mapUpdateBottomPanel(nearest);
      _mapUpdateDots(nearest);
    }
  }

  // Navigation par flèches ou swipe
  window._mapNavigate = function(direction) {
    if (!_isMobile()) return;
    const services = _getServicesDisponibles();
    _mapCurrentIdx = (_mapCurrentIdx + direction + services.length) % services.length;
    _mapScrollToService(_mapCurrentIdx);
    _mapUpdateBottomPanel(_mapCurrentIdx);
    _mapUpdateDots(_mapCurrentIdx);
  };

  function _mapScrollToService(idx) {
    const services = _getServicesDisponibles();
    const sv = services[idx];
    const container = $('map-select');
    const img = document.getElementById('map-img');
    if (!container || !sv || !img) return;

    const imgRenderedW = parseInt(img.style.width, 10) || img.naturalWidth;
    const svCenterPct  = sv.mapBox.x + sv.mapBox.w / 2;
    const svCenterPx   = svCenterPct / 100 * imgRenderedW;
    const targetScroll = svCenterPx - container.clientWidth / 2;

    container.scrollTo({ left: targetScroll, behavior: 'smooth' });
  }

  function _mapUpdateBottomPanel(idx) {
    const services = _getServicesDisponibles();
    const sv = services[idx];
    if (!sv) return;

    const iconEl   = document.getElementById('map-bp-icon');
    const nameEl   = document.getElementById('map-bp-name');
    const dureeEl  = document.getElementById('map-bp-duree');
    const statusEl = document.getElementById('map-bp-status');
    const btnEl    = document.getElementById('map-bp-btn');
    if (!iconEl || !nameEl || !dureeEl || !statusEl || !btnEl) return;

    iconEl.textContent  = sv.em;
    nameEl.textContent  = sv.label;
    dureeEl.textContent = sv.duree;
    statusEl.textContent  = 'Disponible';
    statusEl.style.color  = '';
    btnEl.textContent     = 'Commencer →';
    btnEl.disabled        = false;
    btnEl.dataset.serviceId = sv.id;
  }

  function _mapUpdateDots(idx) {
    document.querySelectorAll('.map-dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  }

  // Bouton "Commencer" du panneau bas → ouvre le panneau de confirmation existant
  window._mapCommencer = function() {
    const btnEl = document.getElementById('map-bp-btn');
    if (!btnEl || btnEl.disabled) return;
    const id = btnEl.dataset.serviceId;
    if (id) _ouvrirConfirmation(id);
  };

  // ── Export public ─────────────────────────────────────────────
  window.showMapSelect = showMapSelect;

})();
