// ═══════════════════════════════════════
// SOS DÉONTOLOGUE — Aide pendant la phase de choix
// ═══════════════════════════════════════

function openSOS(){
  const ch=CHAPTERS[etatJeu.ch];
  if(!ch.sos)return;
  const d=ch.sos;
  const qs=d.questions.map(q=>`<li>${q}</li>`).join('');
  $('sos-content').innerHTML=`
    <div class="sos-section">
      <div class="sos-label">La situation</div>
      <div class="sos-situation">${d.situation}</div>
    </div>
    <div class="sos-section">
      <div class="sos-label">Questions à se poser</div>
      <ul class="sos-questions">${qs}</ul>
    </div>
    <div class="sos-section">
      <div class="sos-label">Éclairage juridique</div>
      <div class="sos-reasoning">${d.reasoning}</div>
    </div>
    <a class="sos-law" href="${d.lawRef.url}" target="_blank" rel="noopener">
      <span class="sos-law-ic">📜</span>
      <span>${d.lawRef.label}</span>
      <span class="sos-law-ext">↗</span>
    </a>`;
  $('sos-panel').classList.add('on');
  Tracker.recordSOS(etatJeu.ch);
  Badges.check('sosCalled', { chIdx: etatJeu.ch });
}

function closeSOS(){
  $('sos-panel').classList.remove('on');
}
