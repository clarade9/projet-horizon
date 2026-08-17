// ═══════════════════════════════════════════════════════════════
// MÉMOIRE NARRATIVE — Persistance et logique de réminiscence
// Les personnages et le narrateur se souviennent des décisions
// du joueur dans les affaires précédentes.
// ═══════════════════════════════════════════════════════════════

const Memoire = (() => {

  // ── Clé localStorage ─────────────────────────────────────────
  const _keyMem = nom =>
    'horizon_memoire_' + (nom || 'joueur').toLowerCase().replace(/\s+/g, '_');

  // ── Lecture/écriture localStorage ───────────────────────────
  function _get(nom) {
    try { return JSON.parse(localStorage.getItem(_keyMem(nom))) || {}; }
    catch (e) { return {}; }
  }
  function _set(nom, data) {
    try { localStorage.setItem(_keyMem(nom), JSON.stringify(data)); }
    catch (e) {}
  }

  // ── Enregistre le choix d'une affaire ────────────────────────
  // Appelé depuis choose() dans choices.js
  // chIdx     : index du chapitre (0-9)
  // choixType : 'good' | 'warn' | 'bad'
  // lettre    : 'A' | 'B' | 'C' (lettre data, pas position affichage)
  function enregistrerChoix(chIdx, choixType, lettre) {
    const nom = (etatJeu.playerFirst || '') + (etatJeu.playerLast ? ' ' + etatJeu.playerLast : '');
    const mem = _get(nom);
    if (!mem.affaires) mem.affaires = {};
    mem.affaires[chIdx] = { type: choixType, lettre: lettre };
    _set(nom, mem);
    // Mise à jour en mémoire vive (pour le reste de la session)
    if (!etatJeu.memoire) etatJeu.memoire = {};
    etatJeu.memoire[chIdx] = { type: choixType, lettre: lettre };
  }

  // ── Charge la mémoire depuis localStorage ────────────────────
  // Appelé au démarrage du jeu ou au chargement du nom du joueur
  function chargerMemoire(nom) {
    const mem = _get(nom);
    etatJeu.memoire = mem.affaires || {};
  }

  // ── Helpers de consultation ───────────────────────────────────
  // Retourne vrai si le joueur a fait le choix donné sur l'affaire chIdx
  const aChoisi  = (chIdx, lettre)    => !!(etatJeu.memoire && etatJeu.memoire[chIdx] && etatJeu.memoire[chIdx].lettre === lettre);
  const aEteBon  = chIdx              => !!(etatJeu.memoire && etatJeu.memoire[chIdx] && etatJeu.memoire[chIdx].type === 'good');
  const aEteMauvais = chIdx           => !!(etatJeu.memoire && etatJeu.memoire[chIdx] && etatJeu.memoire[chIdx].type === 'bad');
  const aEteRisque  = chIdx           => !!(etatJeu.memoire && etatJeu.memoire[chIdx] && etatJeu.memoire[chIdx].type === 'warn');

  // Profil global : 'irréprochable' | 'prudent' | 'fragile'
  function profilGlobal() {
    if (!etatJeu.memoire) return 'prudent';
    const vals = Object.values(etatJeu.memoire);
    if (!vals.length) return 'prudent';
    const bons    = vals.filter(v => v.type === 'good').length;
    const mauvais = vals.filter(v => v.type === 'bad').length;
    if (mauvais === 0 && bons >= vals.length * 0.7) return 'irréprochable';
    if (mauvais >= 2) return 'fragile';
    return 'prudent';
  }

  // ── Textes profil narrateur adaptatif ────────────────────────
  const _PROFIL_TXT = {
    'irréprochable': '<em>Vous commencez à avoir la réputation de quelqu\'un qu\'on ne peut pas acheter. Certains l\'admirent. D\'autres s\'en méfient.</em>',
    'fragile':       '<em>Chaque arrangement laisse une trace. Vous ne le savez peut-être pas encore — mais d\'autres, oui.</em>',
    'prudent':       '<em>Votre bilan est contrasté. Chaque décision compte — et quelqu\'un, quelque part, en garde la mémoire.</em>',
  };

  // Ajoute la ligne de profil global si au moins 2 affaires jouées
  function _ajouterProfil(lignes, sc) {
    if (Object.keys(etatJeu.memoire || {}).length >= 2) {
      const p = profilGlobal();
      if (_PROFIL_TXT[p]) lignes.push({ sp: 'Narrateur', sc: sc, memoire: true, txt: _PROFIL_TXT[p] });
    }
  }

  // ── Injection de lignes conditionnelles ──────────────────────
  // Retourne un tableau de lignes { sp, sc, txt } à injecter
  // au début du chapitre chIdx (avant preDialogue / MD0 / dialogue)
  function lignesMemoire(chIdx) {
    if (!etatJeu.memoire) return [];

    const sc = CHAPTERS[chIdx] ? CHAPTERS[chIdx].sc : null;
    const lignes = [];

    // ── Affaire 6 (chIdx 5) : mémoire de l'Affaire 2 ─────────
    if (chIdx === 5) {
      if (aChoisi(1, 'A')) {
        // Clé USB acceptée → Perrin pense que vous êtes accommodant
        lignes.push({ sp: 'Narrateur', sc: sc, memoire: true,
          txt: '<em>« J\'ai entendu dire que vous étiez quelqu\'un d\'accommodant avec les fournisseurs. Ça facilite les discussions. »</em> Mme Perrin vous jauge différemment dès le départ.' });
      } else if (aChoisi(1, 'C')) {
        // Procédure irréprochable → Perrin sait qu'il ne vous aura pas facilement
        lignes.push({ sp: 'Narrateur', sc: sc, memoire: true,
          txt: '<em>« On m\'a dit que vous étiez difficile à convaincre. J\'aime ça — ça veut dire que vous savez ce que vous faites. »</em> Mme Perrin adapte son approche en conséquence.' });
      }
      _ajouterProfil(lignes, sc);
      return lignes;
    }

    // ── Affaire 7 (chIdx 6) : mémoire de l'Affaire 1 ─────────
    if (chIdx === 6) {
      if (aChoisi(0, 'C')) {
        // Processus irréprochable + déontologue
        lignes.push({ sp: 'Narrateur', sc: sc, memoire: true,
          txt: '<em>M. Aubert. Vous vous souvenez de lui. Et de la façon dont vous avez géré sa demande. Il n\'a pas oublié non plus. Son regard en dit long.</em>' });
      } else if (aChoisi(0, 'A')) {
        // Faveur accordée → il revient plus confiant
        lignes.push({ sp: 'Narrateur', sc: sc, memoire: true,
          txt: '<em>M. Aubert. La dernière fois, vous aviez trouvé un arrangement. Aujourd\'hui il revient — plus confiant que jamais.</em>' });
      } else if (aChoisi(0, 'B')) {
        // Tenu à distance → il interprète comme une porte entrouverte
        lignes.push({ sp: 'Narrateur', sc: sc, memoire: true,
          txt: '<em>M. Aubert. Vous l\'aviez tenu à distance sans le confronter. Il interprète ça comme une porte entrouverte.</em>' });
      }
      _ajouterProfil(lignes, sc);
      return lignes;
    }

    // ── Affaire 8 (chIdx 7) : mémoire des Affaires 3 et 7 ────
    if (chIdx === 7) {
      // Mémoire Affaire 3 : anomalie financière (SIRH)
      if (aChoisi(2, 'C')) {
        // Signalement complet → réflexes rodés
        lignes.push({ sp: 'Narrateur', sc: sc, memoire: true,
          txt: '<em>Vous avez déjà géré une anomalie financière. Vos réflexes sont rodés. M. Renaud ne sait pas à qui il a affaire.</em>' });
      } else if (aChoisi(2, 'A')) {
        // Complicité → même territoire, mêmes risques
        lignes.push({ sp: 'Narrateur', sc: sc, memoire: true,
          txt: '<em>La dernière anomalie financière... vous préférez ne pas y repenser. Ce soir une nouvelle situation se présente. Même territoire, mêmes risques.</em>' });
      }
      // Mémoire Affaire 7 (M. Aubert / acquisition foncière) — logique existante
      if (aEteBon(6)) {
        lignes.push({ sp: 'Narrateur', sc: sc, memoire: true,
          txt: '<em>Vous vous souvenez\u00a0: il y a quelques semaines, vous avez refusé une acquisition foncière douteuse liée à M. Aubert. Aujourd\'hui, c\'est M. Renaud — un partenaire historique — qui appelle. Le schéma est différent. Restez vigilant(e).</em>' });
      } else if (aEteMauvais(6)) {
        lignes.push({ sp: 'Narrateur', sc: sc, memoire: true,
          txt: '<em>L\'affaire du terrain de M. Aubert vous a fragilisé(e) en interne. Votre crédibilité sur les dossiers financiers en dépend d\'autant plus aujourd\'hui.</em>' });
      }
      _ajouterProfil(lignes, sc);
      return lignes;
    }

    // ── Affaire 9 (chIdx 8) : mémoire des Affaires 6 et 8 ────
    if (chIdx === 8) {
      // Mémoire Affaire 6 : appel d'offres Val-Vert
      if (aChoisi(5, 'C')) {
        // Dossier honnête → Fontaine respecte ça
        lignes.push({ sp: 'Narrateur', sc: sc, memoire: true,
          txt: '<em>« J\'ai suivi votre dossier à Val-Vert. Vous avez préféré la transparence au résultat. C\'est rare. Je respecte ça. »</em> Mme Fontaine sait à qui elle a affaire.' });
      } else if (aChoisi(5, 'A')) {
        // Faux en écriture → Fontaine veut en profiter
        lignes.push({ sp: 'Narrateur', sc: sc, memoire: true,
          txt: '<em>« J\'ai entendu parler de votre façon de gérer les appels d\'offres. Ça laisse plus de latitude pour discuter entre nous. »</em> Mme Fontaine a fait ses devoirs.' });
      }
      // Mémoire Affaire 8 (virement / RIB frauduleux) — logique existante
      if (aEteBon(7)) {
        lignes.push({ sp: 'Narrateur', sc: sc, memoire: true,
          txt: '<em>Vous avez su bloquer une tentative de fraude au virement il y a peu. Votre réputation de rigueur vous précède — Mme Fontaine sait qu\'elle ne vous trouvera pas facile à convaincre.</em>' });
      }
      _ajouterProfil(lignes, sc);
      return lignes;
    }

    // ── Affaire 10 (chIdx 9) : mémoire des Affaires 5, 7 et 8 ─
    if (chIdx === 9) {
      // Mémoire Affaire 5 : Lefebvre / corruption environnementale
      if (aChoisi(4, 'C')) {
        // Signalement Lefebvre → Deschamps sait que vous êtes courageux
        lignes.push({ sp: 'Narrateur', sc: sc, memoire: true,
          txt: '<em>« Vous avez signalé Lefebvre, c\'est ça ? Courageux. Ça ne vous a pas empêché d\'avancer. Mais là c\'est différent. »</em> M. Deschamps a entendu parler de vous.' });
      } else if (aChoisi(4, 'A')) {
        // Don accepté → Deschamps pense pouvoir vous convaincre
        lignes.push({ sp: 'Narrateur', sc: sc, memoire: true,
          txt: '<em>« On m\'a dit que vous saviez être pragmatique quand il le faut. C\'est exactement le profil qu\'il me faut. »</em> M. Deschamps vous croit malléable.' });
      }
      // Mémoire Affaire 7 (M. Aubert au jury) — logique existante
      if (aEteMauvais(6)) {
        lignes.push({ sp: 'Narrateur', sc: sc, memoire: true,
          txt: '<em>M. Aubert — que vous avez rencontré dans un contexte difficile — préside aujourd\'hui le jury d\'évaluation. Ce nom a une résonance particulière pour vous.</em>' });
      }
      // Mémoire Affaires 7 + 8 — logique existante
      if (aEteBon(7) && aEteBon(8)) {
        lignes.push({ sp: 'Narrateur', sc: sc, memoire: true,
          txt: '<em>Vous avez traversé des dossiers délicats avec rigueur. Mme Deschamps est au courant de votre réputation — c\'est peut-être pour ça qu\'elle a choisi une approche aussi directe.</em>' });
      }
      _ajouterProfil(lignes, sc);
      return lignes;
    }

    // ── Affaires 4 et 5 (chIdx 3 et 4) : narrateur adaptatif seul ─
    if (chIdx === 3 || chIdx === 4) {
      _ajouterProfil(lignes, sc);
      return lignes;
    }

    return [];
  }

  // ── API publique ──────────────────────────────────────────────
  return {
    enregistrerChoix,
    chargerMemoire,
    lignesMemoire,
    aChoisi,
    aEteBon,
    aEteMauvais,
    aEteRisque,
    profilGlobal,
  };

})();
