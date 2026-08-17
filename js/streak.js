// ═══════════════════════════════════════════════════════════════
// STREAK — Récompense les bonnes décisions consécutives
// ═══════════════════════════════════════════════════════════════

const STREAK_MESSAGES = {
  3:  { titre: 'Belle série !',       texte: '3 bonnes décisions de suite. Vous maîtrisez les fondamentaux.' },
  5:  { titre: 'Impressionnant !',    texte: '5 décisions exemplaires consécutives. L\'intégrité, c\'est une habitude.' },
  7:  { titre: 'Exceptionnel !',      texte: '7 bonnes décisions d\'affilée. Votre sens éthique est irréprochable.' },
  10: { titre: 'Légendaire !',        texte: 'Parcours parfait ! 10 décisions exemplaires sans faillir.' },
};

const STREAK_BONUS = {
  3:  50,
  5:  100,
  7:  150,
  10: 250,
};

function showStreakAnimation(streak) {
  // Trouver le palier exact (3, 5, 7, 10) ou rien
  const palier = [10, 7, 5, 3].find(p => streak === p);
  if (!palier) return;

  const msg   = STREAK_MESSAGES[palier];
  const bonus = STREAK_BONUS[palier];

  const panel = $('streak-panel');
  panel.innerHTML = `
    <div class="sk-inner">
      <div class="sk-fire">🔥</div>
      <div class="sk-streak-count">${streak}</div>
      <div class="sk-streak-lbl">en série</div>
      <div class="sk-titre">${msg.titre}</div>
      <div class="sk-texte">${msg.texte}</div>
      <div class="sk-bonus">+${bonus} pts bonus</div>
    </div>`;
  panel.classList.remove('hidden');
  // Double rAF pour déclencher la transition CSS
  requestAnimationFrame(() => requestAnimationFrame(() => panel.classList.add('on')));

  // Fermeture automatique après 3s
  setTimeout(() => _fermerStreak(), 3000);
}

function _fermerStreak() {
  const panel = $('streak-panel');
  panel.classList.remove('on');
  panel.addEventListener('transitionend', () => panel.classList.add('hidden'), { once: true });
}

function updateStreakHUD() {
  const el = $('streak-hud');
  if (!el) return;
  const s = etatJeu.streak;
  if (s >= 3) {
    el.textContent = '🔥 ×' + s;
    el.classList.remove('hidden');
  } else {
    el.classList.add('hidden');
  }
}

window.showStreakAnimation = showStreakAnimation;
window.updateStreakHUD     = updateStreakHUD;
