// ═══════════════════════════════════════
// HUD — Gauges & Chapter dots
// ═══════════════════════════════════════
function updateHUD(){
  const g=etatJeu.gauges;
  ['i','p','m'].forEach(k=>{
    $('hf-'+k).style.width=g[k]+'%';
    $('hv-'+k).textContent=g[k];
  });
}

function applyGauges(d){
  etatJeu.gauges.i=clamp(etatJeu.gauges.i+d.i);
  etatJeu.gauges.p=clamp(etatJeu.gauges.p+d.p);
  etatJeu.gauges.m=clamp(etatJeu.gauges.m+d.m);
  updateHUD();
  if (typeof _verifierSeuilIntegrite === 'function') _verifierSeuilIntegrite();
}

function updateDots(){
  for(let i=0;i<CHAPTERS.length;i++){
    const d=$('d'+i);
    if(!d)continue;
    if(i<etatJeu.chPos)d.className='cdot done';
    else if(i===etatJeu.chPos)d.className='cdot cur';
    else d.className='cdot';
  }
}
