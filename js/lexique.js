// ═══════════════════════════════════════
// LEXIQUE — Glossary toggle + tooltips inline
// ═══════════════════════════════════════
function openLex(){$('lexique').classList.add('on');}
function closeLex(){$('lexique').classList.remove('on');}
document.addEventListener('keydown',e=>{if(e.key==='l'||e.key==='L')$('lexique').classList.toggle('on');});

// ── Tooltip au clic sur les termes soulignés ─────────────────

function afficherTooltipLexique(terme, targetEl) {
  if (typeof LEXIQUE === 'undefined') return;
  const def = LEXIQUE[terme.toLowerCase()];
  if (!def) return;

  fermerTooltipLexique();

  const tt = document.createElement('div');
  tt.id = 'lexique-tooltip';
  tt.innerHTML = `
    <div class="lx-header">
      <span class="lx-terme">${terme}</span>
      <span class="lx-ref">${def.ref}</span>
      <button class="lx-close" onclick="fermerTooltipLexique()">✕</button>
    </div>
    <div class="lx-def">${def.def}</div>`;

  const container = document.getElementById('game') || document.body;
  container.appendChild(tt);

  // Positionnement
  const rect     = targetEl.getBoundingClientRect();
  const isMobile = window.innerWidth < 768;
  if (isMobile) {
    tt.style.cssText = 'position:fixed;bottom:80px;left:16px;right:16px;z-index:3000;';
  } else {
    const top  = Math.min(rect.bottom + 8, window.innerHeight - 220);
    const left = Math.max(16, Math.min(rect.left - 60, window.innerWidth - 380));
    tt.style.cssText = `position:fixed;top:${top}px;left:${left}px;max-width:360px;z-index:3000;`;
  }
}

function fermerTooltipLexique() {
  const tt = document.getElementById('lexique-tooltip');
  if (tt) tt.remove();
}

// Délégation d'événement : un seul listener sur #game pour tous les .lexique-terme
document.addEventListener('click', (e) => {
  const terme = e.target.closest('.lexique-terme');
  if (terme) {
    e.stopPropagation();
    afficherTooltipLexique(terme.dataset.terme, terme);
    return;
  }
  if (!e.target.closest('#lexique-tooltip')) {
    fermerTooltipLexique();
  }
});
