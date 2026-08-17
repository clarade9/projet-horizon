// ═══════════════════════════════════════════════════════════════
// SUPABASE — Synchronisation cloud des données joueurs
// Toutes les opérations sont silencieuses et non-bloquantes.
// Si Supabase est inaccessible, le jeu continue en local.
// ═══════════════════════════════════════════════════════════════

const SB = (() => {

  const SUPABASE_URL = 'https://xtgmthqbohdxdnypnoju.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Z210aHFib2hkeGRueXBub2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNzcyMTgsImV4cCI6MjA5Mjk1MzIxOH0.EDV5dE8ov6lBK6gCxmjo1rxBPDhhdRVSTx47iYHShGc';

  let _client   = null;
  let _joueurId = null;
  let _startTs  = null;

  // ── Initialisation du client ─────────────────────────────────
  function _getClient() {
    if (_client) return _client;
    try {
      if (typeof supabase === 'undefined' || !supabase.createClient) return null;
      _client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      return _client;
    } catch(e) { return null; }
  }

  // ── Test de connexion (résultat dans la console navigateur) ──
  async function _testConnexion() {
    const sb = _getClient();
    if (!sb) return;
    try {
      const { error } = await sb.from('joueurs').select('id').limit(1);
      if (!error) {
        console.log('%c Connexion Supabase OK ✅', 'color:#22c55e;font-weight:bold');
      } else {
        console.warn('Supabase connecté mais tables manquantes — exécutez supabase-schema.sql dans l\'éditeur SQL Supabase.');
      }
    } catch(e) {}
  }

  // ── Crée ou met à jour le joueur au début du parcours ───────
  async function initJoueur(prenom, identifiantSEM, service, parcoursPrioritaire) {
    const sb = _getClient();
    if (!sb) return;
    _startTs = Date.now();
    try {
      const { data, error } = await sb
        .from('joueurs')
        .upsert({
          prenom,
          nom: identifiantSEM,   // stocke l'identifiant SEM (ex: m.dupont) — pas le nom réel
          service,
          date_connexion:       new Date().toISOString(),
          parcours_prioritaire: parcoursPrioritaire || [],
          affaires_completees:  [],
          score_integrite:      null,
          score_projet:         null,
          score_image_sem:      null,
          verdict_final:        null,
          badges:               [],
          temps_total_minutes:  null,
        }, { onConflict: 'prenom,nom' })
        .select('id')
        .single();
      if (!error && data) _joueurId = data.id;
    } catch(e) {}
  }

  // ── Enregistre un choix final après chaque affaire ──────────
  async function sauvegarderChoix(affaire, choixFait, verdict, sosUtilise) {
    const sb = _getClient();
    if (!sb || !_joueurId) return;
    try {
      await sb.from('choix').insert({
        joueur_id:   _joueurId,
        affaire,
        choix_fait:  choixFait,
        verdict,
        sos_utilise: !!sosUtilise,
        date:        new Date().toISOString(),
      });
    } catch(e) {}
  }

  // ── Finalise la session à l'écran de fin ────────────────────
  async function finaliserSession(gauges, verdictFinal, badgesGagnes, affairesCompletees) {
    const sb = _getClient();
    if (!sb || !_joueurId) return;
    const tempsMin = _startTs ? Math.round((Date.now() - _startTs) / 60000) : null;
    try {
      await sb.from('joueurs').update({
        score_integrite:      gauges.i,
        score_projet:         gauges.p,
        score_image_sem:      gauges.m,
        verdict_final:        verdictFinal,
        badges:               badgesGagnes || [],
        affaires_completees:  affairesCompletees || [],
        temps_total_minutes:  tempsMin,
      }).eq('id', _joueurId);
    } catch(e) {}
  }

  // ── Récupère les données d'un joueur (pour reprise future) ──
  async function recupererJoueur(prenom, nom) {
    const sb = _getClient();
    if (!sb) return null;
    try {
      const { data, error } = await sb
        .from('joueurs')
        .select('*')
        .eq('prenom', prenom)
        .eq('nom', nom)
        .single();
      if (!error) return data;
    } catch(e) {}
    return null;
  }

  // ── Charge toutes les données pour le tableau de bord ───────
  async function chargerToutesDonnees() {
    const sb = _getClient();
    if (!sb) return null;
    try {
      const { data: joueurs, error: errJ } = await sb
        .from('joueurs')
        .select('*')
        .order('date_connexion', { ascending: false });
      if (errJ || !joueurs) return null;

      const { data: tousChoix, error: errC } = await sb
        .from('choix')
        .select('*');
      if (errC) return null;

      // Convertit en format session compatible avec le dashboard
      return joueurs.map(j => {
        const choixJoueur = (tousChoix || []).filter(c => c.joueur_id === j.id);
        const badCount    = choixJoueur.filter(c => c.verdict === 'bad').length;
        const goodCount   = choixJoueur.filter(c => c.verdict === 'good').length;
        const estComplete = j.verdict_final !== null;

        return {
          id:        'sb_' + j.id,
          startedAt: j.date_connexion,
          endedAt:   estComplete ? j.date_connexion : null,
          player:    { name: (j.prenom + ' ' + j.nom).trim(), service: j.service || '' },
          parcours: {
            chOrder:           [],
            priorityCount:     (j.parcours_prioritaire || []).length,
            completedChapters: choixJoueur.map(c => c.affaire),
          },
          choices: choixJoueur.map(c => ({
            chapterIdx: c.affaire,
            choiceType: c.verdict,
            gauges:     { i: 0, p: 0, m: 0 },
            timestamp:  c.date,
          })),
          sosUsed: choixJoueur
            .filter(c => c.sos_utilise)
            .map(c => ({ chapterIdx: c.affaire, timestamp: c.date })),
          finalGauges: estComplete
            ? { i: j.score_integrite || 0, p: j.score_projet || 0, m: j.score_image_sem || 0 }
            : null,
          finalScore: estComplete
            ? Math.round(((j.score_integrite || 0) + (j.score_projet || 0) + (j.score_image_sem || 0)) / 3)
            : null,
          badCount,
          goodCount,
          result:  j.verdict_final,
          status:  estComplete ? 'completed' : 'in_progress',
          _tempsMin: j.temps_total_minutes,
        };
      });
    } catch(e) { return null; }
  }

  // Test de connexion 1 seconde après le chargement de la page
  setTimeout(_testConnexion, 1000);

  return {
    initJoueur,
    sauvegarderChoix,
    finaliserSession,
    recupererJoueur,
    chargerToutesDonnees,
  };

})();
