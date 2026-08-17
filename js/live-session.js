// ═══════════════════════════════════════════════════════════════
// LIVE SESSION — Moteur Supabase Realtime pour le mode formateur live
// Partagé entre live-formateur.html et live-joueur.html
// ═══════════════════════════════════════════════════════════════

const LiveSession = (() => {

  // Clé anon publique — identique à js/supabase.js (iat: 1775567583)
  const SUPABASE_URL = 'https://xtgmthqbohdxdnypnoju.supabase.co';
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0Z210aHFib2hkeGRueXBub2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNzcyMTgsImV4cCI6MjA5Mjk1MzIxOH0.EDV5dE8ov6lBK6gCxmjo1rxBPDhhdRVSTx47iYHShGc';

  // Consonnes lisibles pour les codes de session (évite les vrais mots)
  const CONSONNES = 'BCDFGHJKLMNPQRSTVWXZ';

  let _sb        = null;
  let _canaux    = [];
  let _presenceCh = null;

  // ── Initialisation du client ──────────────────────────────────
  function init() {
    if (_sb) return _sb;
    try {
      if (typeof supabase === 'undefined') {
        console.error('[LiveSession] supabase global introuvable — CDN non chargé ?');
        return null;
      }
      if (!supabase.createClient) {
        console.error('[LiveSession] supabase.createClient absent — mauvaise version du CDN ?');
        return null;
      }
      _sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      console.log('[LiveSession] client Supabase initialisé', SUPABASE_URL);
      return _sb;
    } catch(e) {
      console.error('[LiveSession] init() exception :', e);
      return null;
    }
  }

  function _getClient() {
    return _sb || init();
  }

  // ── Génération d'un code de session unique ────────────────────
  // Format : 3 consonnes + '-' + 3 chiffres  ex: HRZ-482
  async function genererCode() {
    const sb = _getClient();
    const MAX = 10;
    for (let t = 0; t < MAX; t++) {
      const lettres = Array.from({ length: 3 }, () =>
        CONSONNES[Math.floor(Math.random() * CONSONNES.length)]
      ).join('');
      const chiffres = String(Math.floor(Math.random() * 900) + 100);
      const code = `${lettres}-${chiffres}`;

      if (!sb) return code; // hors ligne → retourne sans vérification
      try {
        const { data } = await sb
          .from('sessions_live')
          .select('id')
          .eq('code', code)
          .eq('statut', 'active')
          .maybeSingle();
        if (!data) return code;
      } catch(e) { return code; }
    }
    // Fallback garanti unique
    return 'HRZ-' + (Date.now() % 10000);
  }

  // ── Créer une session (formateur) ─────────────────────────────
  async function creerSession(code) {
    const sb = _getClient();
    if (!sb) {
      console.error('[LiveSession] creerSession: client Supabase non initialisé');
      return null;
    }
    const token = crypto.randomUUID();
    console.log('[LiveSession] creerSession: insertion code=', code);
    try {
      const { data, error } = await sb
        .from('sessions_live')
        .insert({ code, formateur_token: token })
        .select('id, code')
        .single();
      if (error) {
        console.error('[LiveSession] creerSession erreur Supabase:', error.message, error.details, error.hint);
        return null;
      }
      if (!data) {
        console.error('[LiveSession] creerSession: aucune donnée retournée');
        return null;
      }
      console.log('[LiveSession] creerSession OK — id:', data.id, 'code:', data.code);
      return { id: data.id, code: data.code, formateurToken: token };
    } catch(e) {
      console.error('[LiveSession] creerSession exception:', e);
      return null;
    }
  }

  // ── Rejoindre une session (joueur) ────────────────────────────
  async function rejoindreSession(code, joueurNom) {
    const sb = _getClient();
    if (!sb) return null;
    try {
      const { data, error } = await sb
        .from('sessions_live')
        .select('id, phase, affaire_active, votes_ouverts_depuis, dialogue_idx')
        .eq('code', code.toUpperCase())
        .eq('statut', 'active')
        .maybeSingle();
      if (error || !data) return null;

      // Générer ou récupérer l'id joueur
      let joueurId = sessionStorage.getItem('lv_joueur_id');
      if (!joueurId) {
        joueurId = crypto.randomUUID();
        sessionStorage.setItem('lv_joueur_id', joueurId);
      }
      sessionStorage.setItem('lv_joueur_nom', joueurNom);
      sessionStorage.setItem('lv_session_id', String(data.id));
      sessionStorage.setItem('lv_session_code', code.toUpperCase());

      return {
        sessionId: data.id,
        phase: data.phase,
        affaireActive: data.affaire_active,
        votesOuvertDepuis: data.votes_ouverts_depuis,
        dialogue_idx: data.dialogue_idx,
        joueurId,
      };
    } catch(e) { console.error(e); return null; }
  }

  // ── Lire l'état courant d'une session ─────────────────────────
  async function lireEtat(sessionId) {
    const sb = _getClient();
    if (!sb) return null;
    try {
      const { data } = await sb
        .from('sessions_live')
        .select('*')
        .eq('id', sessionId)
        .single();
      return data || null;
    } catch(e) { return null; }
  }

  // ── Transitions de phase (formateur uniquement) ───────────────
  async function _changerPhase(sessionId, token, updates) {
    const sb = _getClient();
    if (!sb) return false;
    try {
      const { error } = await sb
        .from('sessions_live')
        .update(updates)
        .eq('id', sessionId)
        .eq('formateur_token', token);
      return !error;
    } catch(e) { return false; }
  }

  function lancerAffaire(sessionId, affaireIdx, token) {
    return _changerPhase(sessionId, token, {
      phase: 'affaire_active',
      affaire_active: affaireIdx,
      votes_ouverts_depuis: null,
    });
  }

  // ── Mélange déterministe des options A/B/C ─────────────────────
  // Génère un ordre [0,1,2] mélangé à partir d'un timestamp (seed).
  // Même résultat sur formateur et joueur sans colonne SQL supplémentaire.
  function _melangerOrdre(seed) {
    // Hash simple du timestamp ISO → entier
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
      h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
    }
    const rng = () => { h = (Math.imul(1664525, h) + 1013904223) | 0; return (h >>> 0) / 0xffffffff; };
    const arr = [0, 1, 2];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Calcule l'ordre des options pour une affaire/timestamp donnés.
  // Retourne ex: [2, 0, 1] → l'option affichée en A est choices[2], B=choices[0], C=choices[1]
  function calculerOrdreChoix(affaireIdx, votesOuvertDepuis) {
    if (!votesOuvertDepuis) return [0, 1, 2];
    return _melangerOrdre(String(affaireIdx) + '|' + votesOuvertDepuis);
  }

  function ouvrirVotes(sessionId, token, timestamp) {
    return _changerPhase(sessionId, token, {
      phase: 'votes_ouverts',
      votes_ouverts_depuis: timestamp || new Date().toISOString(),
    });
  }

  function fermerVotes(sessionId, token) {
    return _changerPhase(sessionId, token, { phase: 'votes_fermes' });
  }

  // ── Réflexe Professionnel (nouvelles phases) ──────────────────
  function ouvrirReflexe(sessionId, token, affaireIdx) {
    return _changerPhase(sessionId, token, {
      phase: 'reflexe_ouverts',
      affaire_active: affaireIdx,
      votes_ouverts_depuis: new Date().toISOString(),
    });
  }

  function fermerReflexe(sessionId, token) {
    return _changerPhase(sessionId, token, { phase: 'reflexe_fermes' });
  }

  function afficherResultatsReflexe(sessionId, token) {
    return _changerPhase(sessionId, token, { phase: 'reflexe_resultats' });
  }

  // ── Voter au Réflexe (joueur) ─────────────────────────────────
  async function voterReflexe(sessionId, joueurId, joueurNom, affaireIdx, questions, actions) {
    const sb = _getClient();
    if (!sb) return null;
    const payload = {
      session_id: sessionId,
      joueur_id:  joueurId,
      joueur_nom: joueurNom,
      affaire:    affaireIdx,
      choix_index: -1,
      est_correct: false,
      temps_reponse_ms: 0,
      score: 0,
      phase: 'reflexe',
      meta: JSON.stringify({ questions, actions }),
    };
    try {
      await sb.from('votes_live').insert(payload);
    } catch(e) { console.error('[LiveSession] voterReflexe:', e); return null; }
    await _broadcastVote(payload);
    return true;
  }

  function afficherResultats(sessionId, token) {
    return _changerPhase(sessionId, token, { phase: 'resultats' });
  }

  function afficherPodium(sessionId, token) {
    return _changerPhase(sessionId, token, { phase: 'podium' });
  }

  function terminerSession(sessionId, token) {
    return _changerPhase(sessionId, token, { phase: 'fin', statut: 'terminee' });
  }

  // ── Diffuser une ligne de dialogue (formateur → joueurs) ──────
  function diffuserDialogue(sessionId, token, dlgIdx) {
    return _changerPhase(sessionId, token, {
      phase: 'dialogue',
      dialogue_idx: dlgIdx,
    });
  }

  // ── Calcul du score ───────────────────────────────────────────
  function _calculerScore(tempsMs, estCorrect, streak) {
    if (!estCorrect) return 0;
    let base;
    if      (tempsMs < 5000)  base = 1000;
    else if (tempsMs < 10000) base = 800;
    else if (tempsMs < 20000) base = 600;
    else                      base = 400;
    const bonus = streak >= 5 ? 500 : streak >= 3 ? 200 : 0;
    return base + bonus;
  }

  // ── Voter (joueur) ────────────────────────────────────────────
  // IMPORTANT : choix_index sans mélange — A=choices[0], B=choices[1], C=choices[2]
  async function voter(sessionId, joueurId, joueurNom, affaireIdx, choixIndex, tempsMs, streak) {
    const sb = _getClient();
    if (!sb) return null;
    const ch = (typeof CHAPTERS !== 'undefined') ? CHAPTERS[affaireIdx] : null;
    const estCorrect = ch ? ch.choices[choixIndex].type === 'good' : false;
    const score = _calculerScore(tempsMs, estCorrect, streak || 0);
    const payload = {
      session_id: sessionId,
      joueur_id:  joueurId,
      joueur_nom: joueurNom,
      affaire:    affaireIdx,
      choix_index: choixIndex,
      est_correct: estCorrect,
      temps_reponse_ms: tempsMs,
      score,
      phase: 'vote',
    };

    try {
      const { data, error } = await sb
        .from('votes_live')
        .insert(payload)
        .select('score, est_correct, choix_index')
        .single();

      if (error) { console.error('voter:', error); return null; }

      await _broadcastVote({ ...payload, score: data.score, est_correct: data.est_correct });

      const indexCorrect = ch ? ch.choices.findIndex(c => c.type === 'good') : -1;
      return { score: data.score, estCorrect: data.est_correct, indexCorrect };
    } catch(e) { console.error(e); return null; }
  }

  // ── Calculer le classement ────────────────────────────────────
  async function calculerClassement(sessionId) {
    const sb = _getClient();
    if (!sb) return [];
    try {
      const { data, error } = await sb
        .from('votes_live')
        .select('joueur_id, joueur_nom, score, est_correct, temps_reponse_ms, affaire')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error || !data) return [];

      // Agréger par joueur
      const map = {};
      for (const v of data) {
        if (!map[v.joueur_id]) {
          map[v.joueur_id] = {
            joueurId: v.joueur_id,
            nom: v.joueur_nom,
            scoreTotal: 0,
            nbCorrects: 0,
            nbVotes: 0,
            tempsMoyenMs: 0,
            _tempsTotal: 0,
          };
        }
        const j = map[v.joueur_id];
        j.scoreTotal   += v.score;
        j.nbCorrects   += v.est_correct ? 1 : 0;
        j.nbVotes      += 1;
        j._tempsTotal  += v.temps_reponse_ms;
      }

      return Object.values(map)
        .map(j => ({ ...j, tempsMoyenMs: Math.round(j._tempsTotal / (j.nbVotes || 1)) }))
        .sort((a, b) => b.scoreTotal - a.scoreTotal || a.tempsMoyenMs - b.tempsMoyenMs);
    } catch(e) { return []; }
  }

  // ── Dashboard post-session : agrégats pour le debrief ────────
  async function calculerDebrief(sessionId) {
    const sb = _getClient();
    if (!sb) return null;
    try {
      const { data, error } = await sb
        .from('votes_live')
        .select('joueur_id, joueur_nom, affaire, est_correct, score')
        .eq('session_id', sessionId);

      if (error || !data || data.length === 0) return null;

      // --- Par affaire ---
      const parAffaire = {};
      for (const v of data) {
        if (!parAffaire[v.affaire]) parAffaire[v.affaire] = { total: 0, incorrects: 0 };
        parAffaire[v.affaire].total++;
        if (!v.est_correct) parAffaire[v.affaire].incorrects++;
      }

      // Top 3 affaires les plus échouées (% incorrects desc)
      const affairesRatees = Object.entries(parAffaire)
        .map(([idx, s]) => ({
          affaireIdx: parseInt(idx),
          total: s.total,
          pctEchec: s.total > 0 ? Math.round(s.incorrects / s.total * 100) : 0,
        }))
        .filter(a => a.total > 0)
        .sort((a, b) => b.pctEchec - a.pctEchec)
        .slice(0, 3);

      // --- Profils éthiques : distribution par score ---
      // Agréger les scores par joueur
      const parJoueur = {};
      for (const v of data) {
        if (!parJoueur[v.joueur_id]) parJoueur[v.joueur_id] = { total: 0, corrects: 0 };
        parJoueur[v.joueur_id].total++;
        if (v.est_correct) parJoueur[v.joueur_id].corrects++;
      }

      const profils = { exemplaire: 0, pragmatique: 0, risque: 0 };
      for (const j of Object.values(parJoueur)) {
        const pct = j.total > 0 ? j.corrects / j.total : 0;
        if (pct >= 0.75)      profils.exemplaire++;
        else if (pct >= 0.45) profils.pragmatique++;
        else                  profils.risque++;
      }

      const nbJoueurs = Object.keys(parJoueur).length;

      return { affairesRatees, profils, nbJoueurs };
    } catch(e) { console.error(e); return null; }
  }

  // ── Export CSV ────────────────────────────────────────────────
  async function exporterCSV(sessionId) {
    const sb = _getClient();
    if (!sb) return;
    try {
      const { data } = await sb
        .from('votes_live')
        .select('joueur_nom, affaire, choix_index, est_correct, temps_reponse_ms, score, created_at')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (!data || data.length === 0) { alert('Aucun vote à exporter.'); return; }

      const lignes = [
        ['Joueur', 'Affaire', 'Choix', 'Correct', 'Temps (ms)', 'Score', 'Date'].join(','),
        ...data.map(v => [
          `"${v.joueur_nom}"`,
          v.affaire + 1,
          ['A', 'B', 'C'][v.choix_index] || v.choix_index,
          v.est_correct ? 'Oui' : 'Non',
          v.temps_reponse_ms,
          v.score,
          new Date(v.created_at).toLocaleString('fr-FR'),
        ].join(','))
      ];

      const blob = new Blob([lignes.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = `session-live-${sessionId}-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch(e) { console.error(e); }
  }

  // ── Abonnement Canal A : état session → joueurs ───────────────
  // Filtre côté client pour éviter l'erreur "No Listener" (REPLICA IDENTITY requis)
  function abonnerSession(code, onPhaseChange) {
    const sb = _getClient();
    if (!sb) return;
    const ch = sb.channel(`session:${code}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'sessions_live',
      }, payload => {
        if (payload.new && payload.new.code === code) onPhaseChange(payload.new);
      })
      .subscribe((status, err) => {
        if (err) console.error('[LiveSession] abonnerSession subscribe error:', err);
        else console.log('[LiveSession] abonnerSession status:', status);
      });
    _canaux.push(ch);
    return ch;
  }

  // ── Broadcast votes — canal partagé émetteur/récepteur ────────
  let _votesChannel = null;

  // Émet un vote sur le canal Broadcast (retry + warn si pas prêt)
  async function _broadcastVote(votePayload) {
    const _doSend = async () => {
      if (_votesChannel && _votesChannel.state === 'joined') {
        await _votesChannel.send({
          type: 'broadcast',
          event: 'vote',
          payload: votePayload,
        });
      } else {
        // Canal pas encore prêt — une seule retry après 300ms
        await new Promise(r => setTimeout(r, 300));
        if (_votesChannel && _votesChannel.state === 'joined') {
          await _votesChannel.send({
            type: 'broadcast',
            event: 'vote',
            payload: votePayload,
          });
        } else {
          console.warn('[LiveSession] _broadcastVote: canal votes non prêt après retry (état:', _votesChannel?.state ?? 'null', ')');
        }
      }
    };
    try { await _doSend(); } catch(e) { console.warn('[LiveSession] _broadcastVote:', e.message); }
  }

  // ── Abonnement Canal B : votes → formateur ────────────────────
  // Migration Broadcast : ne nécessite pas REPLICA IDENTITY FULL sur votes_live
  // postgres_changes conservé en commentaire pour référence / fallback éventuel
  function abonnerVotes(sessionId, onNouveauVote) {
    const sb = _getClient();
    if (!sb) return;

    _votesChannel = sb.channel(`votes-broadcast:${sessionId}`)
      .on('broadcast', { event: 'vote' }, ({ payload }) => {
        if (payload && String(payload.session_id) === String(sessionId)) {
          onNouveauVote(payload);
        }
      })
      .subscribe((status, err) => {
        if (err) console.error('[LiveSession] abonnerVotes subscribe error:', err);
        else console.log('[LiveSession] abonnerVotes status:', status);
      });
    _canaux.push(_votesChannel);
    return _votesChannel;

    /* postgres_changes fallback (nécessite REPLICA IDENTITY FULL sur votes_live) :
    const ch = sb.channel(`votes:${sessionId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes_live' },
        payload => {
          if (payload.new && String(payload.new.session_id) === String(sessionId)) {
            onNouveauVote(payload.new);
          }
        })
      .subscribe();
    _canaux.push(ch);
    return ch;
    */
  }

  // ── Abonnement Canal C : Presence ────────────────────────────
  function abonnerPresence(code, joueurId, joueurNom, onPresenceChange) {
    const sb = _getClient();
    if (!sb) return;
    _presenceCh = sb.channel(`presence:${code}`, {
      config: { presence: { key: joueurId || 'formateur' } },
    });
    _presenceCh
      .on('presence', { event: 'sync' }, () => {
        const state = _presenceCh.presenceState();
        const participants = Object.values(state).flat();
        onPresenceChange(participants);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && joueurId && joueurNom) {
          await _presenceCh.track({ nom: joueurNom, joueurId, joinedAt: Date.now() });
        }
      });
    _canaux.push(_presenceCh);
    return _presenceCh;
  }

  // ── Quiz final — méthodes formateur ──────────────────────────
  // Les données quiz transitent via le champ quiz_data (JSON) de sessions_live
  // Si la colonne n'existe pas en base, ces appels échouent silencieusement

  function lancerQuiz(sessionId, token) {
    return _changerPhase(sessionId, token, {
      phase: 'quiz',
      quiz_data: { cursor: 0, question: null, ans: null },
    });
  }

  function diffuserQuizQuestion(sessionId, token, cursor, question) {
    return _changerPhase(sessionId, token, {
      phase: 'quiz',
      quiz_data: { cursor, question, ans: null },
    });
  }

  function diffuserQuizCorrection(sessionId, token, cursor, ans) {
    return _changerPhase(sessionId, token, {
      phase: 'quiz_correction',
      quiz_data: { cursor, ans },
    });
  }

  // Voter pour le quiz (table séparée si disponible, sinon on ignore)
  async function voterQuiz(sessionId, joueurId, joueurNom, cursor, choixIndex) {
    const sb = _getClient();
    if (!sb) return;
    try {
      await sb.from('votes_quiz_live').insert({
        session_id: sessionId,
        joueur_id:  joueurId,
        joueur_nom: joueurNom,
        question_idx: cursor,
        choix_index:  choixIndex,
      });
    } catch(e) {
      // Silencieux si la table n'existe pas
    }
  }

  // Abonner aux votes quiz (écoute la même table)
  function abonnerQuizVotes(sessionId, onVote) {
    const sb = _getClient();
    if (!sb) return;
    const ch = sb.channel(`quiz:${sessionId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'votes_quiz_live',
      }, payload => {
        if (payload.new && String(payload.new.session_id) === String(sessionId)) {
          onVote(payload.new);
        }
      })
      .subscribe();
    _canaux.push(ch);
    return ch;
  }

  // ── Lecture collective ────────────────────────────────────────

  // Marquer une ligne comme lue par un joueur
  async function marquerLu(sessionCode, ligneId, joueurNom) {
    const sb = _getClient();
    if (!sb) return;
    try {
      await sb.from('lecture_live').upsert(
        { session_id: sessionCode, ligne_id: ligneId, joueur_nom: joueurNom },
        { onConflict: 'session_id,ligne_id,joueur_nom', ignoreDuplicates: true }
      );
    } catch(e) {
      console.warn('[LiveSession] marquerLu:', e.message);
    }
    // Broadcast immédiat — utilise le canal déjà souscrit par abonnerLecture
    const _broadcastLu = async () => {
      if (_lectureChannel && _lectureChannel.state === 'joined') {
        await _lectureChannel.send({
          type: 'broadcast',
          event: 'lu',
          payload: { ligne_id: ligneId, joueur_nom: joueurNom },
        });
      } else {
        // Canal pas encore prêt — une seule retry après 300ms
        await new Promise(r => setTimeout(r, 300));
        if (_lectureChannel && _lectureChannel.state === 'joined') {
          await _lectureChannel.send({
            type: 'broadcast',
            event: 'lu',
            payload: { ligne_id: ligneId, joueur_nom: joueurNom },
          });
        } else {
          console.warn('[LiveSession] marquerLu: canal lecture non prêt après retry (état:', _lectureChannel?.state ?? 'null', ')');
        }
      }
    };
    try { await _broadcastLu(); } catch(e) { console.warn('[LiveSession] marquerLu broadcast:', e.message); }
  }

  // Compter les lectures pour une ligne donnée
  async function getNombreLus(sessionCode, ligneId) {
    const sb = _getClient();
    if (!sb) return 0;
    try {
      const { count } = await sb
        .from('lecture_live')
        .select('*', { count: 'exact', head: true })
        .eq('session_id', sessionCode)
        .eq('ligne_id', ligneId);
      return count || 0;
    } catch(e) { return 0; }
  }

  // S'abonner aux lectures d'une ligne — appelle onTousLu quand 100% ont lu
  // Retourne la fonction de mise à jour du compteur pour affichage sur formateur
  let _lectureChannel = null;

  function abonnerLecture(sessionCode, ligneId, nombreJoueurs, onTousLu, onCompteurChange) {
    const sb = _getClient();
    if (!sb) return;

    // Se désabonner du canal précédent
    if (_lectureChannel) {
      try { sb.removeChannel(_lectureChannel); } catch(e) {}
      _lectureChannel = null;
    }

    // Garantir un seuil minimum de 1 pour ne pas bloquer l'abonnement
    const seuilLu = Math.max(1, nombreJoueurs);

    let compteurLocal = 0;
    let dejaDeclanche = false;

    function _verifier(n) {
      compteurLocal = n;
      if (onCompteurChange) onCompteurChange(compteurLocal, seuilLu);
      if (!dejaDeclanche && compteurLocal >= seuilLu) {
        dejaDeclanche = true;
        onTousLu();
      }
    }

    // Canal Broadcast — pas besoin de REPLICA IDENTITY, fonctionne immédiatement
    _lectureChannel = sb
      .channel('lecture-broadcast-' + sessionCode)
      .on('broadcast', { event: 'lu' }, (payload) => {
        if (!payload.payload) return;
        if (payload.payload.ligne_id !== ligneId) return;
        _verifier(compteurLocal + 1);
      })
      .subscribe((status, err) => {
        if (err) console.warn('[LiveSession] abonnerLecture subscribe error:', err);
      });
    _canaux.push(_lectureChannel);

    // Récupérer l'état initial (joueurs déjà connectés qui auraient déjà cliqué)
    getNombreLus(sessionCode, ligneId).then(n => _verifier(n));
  }

  // Nettoyer les lectures d'une affaire (appelé au début de chaque nouvelle affaire)
  async function nettoyerLecturesAffaire(sessionCode, affaireIdx) {
    const sb = _getClient();
    if (!sb) return;
    const prefixe = 'ch' + affaireIdx + '_';
    try {
      await sb.from('lecture_live')
        .delete()
        .eq('session_id', sessionCode)
        .like('ligne_id', prefixe + '%');
    } catch(e) {
      console.warn('[LiveSession] nettoyerLecturesAffaire:', e.message);
    }
  }

  // ── Fermer tous les canaux ────────────────────────────────────
  function seDesabonner() {
    const sb = _getClient();
    if (!sb) return;
    for (const ch of _canaux) {
      try { sb.removeChannel(ch); } catch(e) {}
    }
    _canaux = [];
    _presenceCh = null;
  }

  return {
    init,
    genererCode,
    creerSession,
    rejoindreSession,
    lireEtat,
    lancerAffaire,
    diffuserDialogue,
    ouvrirVotes,
    fermerVotes,
    ouvrirReflexe,
    fermerReflexe,
    afficherResultatsReflexe,
    voterReflexe,
    afficherResultats,
    afficherPodium,
    terminerSession,
    voter,
    calculerClassement,
    calculerDebrief,
    exporterCSV,
    calculerOrdreChoix,
    abonnerSession,
    abonnerVotes,
    abonnerPresence,
    seDesabonner,
    // Quiz
    lancerQuiz,
    diffuserQuizQuestion,
    diffuserQuizCorrection,
    voterQuiz,
    abonnerQuizVotes,
    // Lecture collective
    marquerLu,
    getNombreLus,
    abonnerLecture,
    nettoyerLecturesAffaire,
  };

})();
