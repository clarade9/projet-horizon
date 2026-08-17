// ═══════════════════════════════════════════════════════════════
// QUIZ — Validation des acquis (10 questions ancrées dans le jeu)
// ═══════════════════════════════════════════════════════════════

const QUIZ_DATA = [
  {
    affaire: 0,
    domaine: "RH",
    situation: "M. Aubert, directeur général, vous a transmis directement la candidature de son neveu pour un poste de Responsable d'Exploitation.",
    question: "Quelle est votre première action obligatoire ?",
    options: [
      { txt: "Traiter la candidature comme toute autre via le portail RH officiel et inviter M. Aubert à déclarer son lien au déontologue.", correct: true },
      { txt: "Mettre la candidature de côté sans la traiter pour éviter tout risque.", correct: false, piege: "Ignorer une candidature sans la traiter expose à d'autres risques juridiques." },
      { txt: "Valider la candidature — M. Aubert est DG, sa recommandation a du poids.", correct: false, piege: "La hiérarchie ne justifie pas de contourner la procédure." },
      { txt: "Demander une validation du conseil d'administration avant de traiter le dossier.", correct: false, piege: "C'est le déontologue, pas le CA, qui doit être alerté." }
    ]
  },
  {
    affaire: 1,
    domaine: "Achats",
    situation: "M. Laroche, candidat à un marché public en cours, vous a invité dans un restaurant gastronomique à 127€ par personne.",
    question: "Ce déjeuner dépasse le seuil interne de 80€. Que faites-vous ?",
    options: [
      { txt: "Refuser les invitations par écrit et transmettre la note technique de M. Laroche via la procédure officielle.", correct: true },
      { txt: "Accepter et déclarer le déjeuner dans le registre des cadeaux — la transparence suffit.", correct: false, piege: "La déclaration ne remplace pas le refus quand le seuil est dépassé." },
      { txt: "Accepter le déjeuner mais refuser les places Roland Garros.", correct: false, piege: "Le déjeuner lui-même dépasse déjà le seuil autorisé." },
      { txt: "En référer au déontologue avant d'accepter quoi que ce soit.", correct: false, piege: "Le refus direct est suffisant et plus rapide — pas besoin du déontologue pour appliquer une règle claire." }
    ]
  },
  {
    affaire: 2,
    domaine: "Finance",
    situation: "Vous constatez un écart de 3 200€ sur le salaire de M. Favre et un changement de RIB effectué il y a 3 jours sans validation RH.",
    question: "Quelle est la priorité absolue avant tout virement ?",
    options: [
      { txt: "Suspendre le virement et vérifier le RIB par téléphone au numéro officiel du salarié — jamais au numéro fourni dans le mail.", correct: true },
      { txt: "Alerter immédiatement la direction financière et attendre ses instructions.", correct: false, piege: "Alerter est utile mais secondaire — d'abord suspendre et vérifier le RIB." },
      { txt: "Demander un justificatif écrit du changement de RIB par mail.", correct: false, piege: "Un fraudeur peut fournir un faux document. La vérification doit être vocale." },
      { txt: "Valider le virement pour ne pas perturber la paie — l'enquête peut se faire après.", correct: false, piege: "Une fois le virement parti, les fonds sont irrécupérables dans 80% des cas." }
    ]
  },
  {
    affaire: 3,
    domaine: "Exploitation",
    situation: "Patrice vous demande de valider 12 tonnes sur le bordereau alors que le ticket de pesée certifié affiche 18,4 tonnes.",
    question: "Que faites-vous ?",
    options: [
      { txt: "Enregistrer 18,4 tonnes sur le bordereau et alerter la direction dans l'heure.", correct: true },
      { txt: "Valider 12 tonnes pour ne pas bloquer le prestataire — l'écart sera régularisé.", correct: false, piege: "Valider un faux bordereau est une complicité de fraude, même sans contrepartie." },
      { txt: "Demander une contre-expertise de la pesée avant de valider quoi que ce soit.", correct: false, piege: "La pesée vient d'être certifiée — une contre-expertise fait perdre du temps sans apporter de protection." },
      { txt: "Demander à Patrice une autorisation écrite de son employeur pour cet écart.", correct: false, piege: "Son employeur est à l'origine du problème — cette démarche ne protège pas la SEM." }
    ]
  },
  {
    affaire: 4,
    domaine: "QSE",
    situation: "M. Lefebvre propose d'obtenir votre autorisation préfectorale en 72h pour 45 000€, grâce à son associée en poste à la préfecture.",
    question: "Quelle est la réponse correcte ?",
    options: [
      { txt: "Refuser la prestation par écrit, compléter le dossier en interne et le déposer directement à la préfecture.", correct: true },
      { txt: "Accepter pour éviter une amende environnementale — le résultat justifie le moyen.", correct: false, piege: "Accepter constitue une corruption active. L'amende est moins grave que la mise en cause pénale." },
      { txt: "Demander des livrables précis avant de signer — si la prestation est réelle, elle est légitime.", correct: false, piege: "La demande de livrables laisse croire qu'on envisage la prestation, ce qui est dangereux dans cette situation." },
      { txt: "Alerter le déontologue et attendre sa réponse avant toute décision.", correct: false, piege: "Refuser et déposer directement d'abord — le signalement au déontologue vient ensuite." }
    ]
  },
  {
    affaire: 5,
    domaine: "Commercial",
    situation: "Mme Perrin, présidente de club de football, vous a suggéré en dehors de la procédure qu'un sponsoring faciliterait l'obtention du marché.",
    question: "Que faites-vous en priorité ?",
    options: [
      { txt: "Mettre fin au contact informel, signaler l'échange à la direction juridique et documenter dans un mémo daté.", correct: true },
      { txt: "Améliorer notre offre technique — c'est la seule réponse légale et efficace.", correct: false, piege: "Améliorer l'offre est une bonne idée mais ne règle pas le problème du contact informel qui doit être signalé." },
      { txt: "Accepter le sponsoring — c'est du mécénat légal, pas de la corruption.", correct: false, piege: "Mécénat + marché en cours + destinataire lié au décideur = corruption active caractérisée." },
      { txt: "Demander à Mme Perrin de confirmer par écrit que le marché sera attribué sur des critères objectifs.", correct: false, piege: "Demander une confirmation à quelqu'un qui vient de proposer un arrangement est naïf et contre-productif." }
    ]
  },
  {
    affaire: 6,
    domaine: "Juridique",
    situation: "Mme Ruiz a négocié un terrain 38% sous le prix marché auprès du cousin de M. Aubert, sans expertise indépendante ni livrable écrit.",
    question: "Quelles sont les deux actions prioritaires ?",
    options: [
      { txt: "Demander une évaluation officielle France Domaines et alerter le déontologue sur le lien familial entre le vendeur et M. Aubert.", correct: true },
      { txt: "Valider l'acquisition — un prix bas est une bonne affaire pour la SEM.", correct: false, piege: "Prix bas ne veut pas dire bonne affaire. Sans évaluation Domaines, l'acquisition est juridiquement contestable." },
      { txt: "Refuser la facture de Mme Ruiz en attendant un livrable écrit.", correct: false, piege: "Bonne pratique comptable, mais secondaire — le conflit d'intérêts sur l'acquisition est la priorité." },
      { txt: "Demander au conseil d'administration de délibérer à nouveau en excluant M. Aubert.", correct: false, piege: "C'est une étape juste mais insuffisante sans l'évaluation Domaines qui est une obligation légale." }
    ]
  },
  {
    affaire: 7,
    domaine: "Finance",
    situation: "M. Renaud demande une avance de 40 000€ non prévue au contrat. Son RIB a changé par mail il y a 3 jours vers une banque en ligne inconnue.",
    question: "Quel est le réflexe anti-fraude numéro 1 ?",
    options: [
      { txt: "Suspendre tout virement et appeler M. Renaud au numéro officiel du contrat — jamais au numéro fourni dans le mail récent.", correct: true },
      { txt: "Valider l'avance pour débloquer la livraison avant l'audit de vendredi.", correct: false, piege: "L'urgence avant un audit est souvent fabriquée. C'est un signal d'alerte supplémentaire." },
      { txt: "Demander un avenant signé par le DAF et le DG avant tout virement.", correct: false, piege: "Juste procéduralement, mais la vérification du RIB suspect est la priorité immédiate de sécurité." },
      { txt: "Demander à M. Renaud un justificatif du changement de RIB par mail.", correct: false, piege: "Un fraudeur peut fournir un faux document. Seul un appel vocal au numéro officiel du contrat est fiable." }
    ]
  },
  {
    affaire: 8,
    domaine: "Relations Publiques",
    situation: "M. Fontaine, maire instructeur de votre permis de construire, préside également le club de tennis qui sollicite un don de 50 000€.",
    question: "Pourquoi ce don est-il interdit même avec une clause mécénat ?",
    options: [
      { txt: "Parce que M. Fontaine cumule la qualité d'élu instructeur et de président de l'association bénéficiaire — toute contrepartie pendant une procédure constitue une corruption active.", correct: true },
      { txt: "Parce que 50 000€ dépasse le seuil de décision sans CA — avec validation CA, le don serait possible.", correct: false, piege: "La validation CA ne suffit pas — le conflit d'intérêts lié à la procédure en cours est l'obstacle juridique principal." },
      { txt: "Parce que le don doit d'abord être validé par le déontologue — avec son accord, il peut être versé.", correct: false, piege: "Le déontologue lui-même ne peut pas autoriser un don à une association d'élu pendant une procédure administrative." },
      { txt: "Parce que le montant doit être déclaré à la HATVP — avec cette déclaration, le don est légal.", correct: false, piege: "La déclaration HATVP ne rend pas légal un don qui constitue une contrepartie à une décision administrative." }
    ]
  },
  {
    affaire: 9,
    domaine: "Commercial",
    situation: "Mme Deschamps propose pour 8 000€ les grilles de notation confidentielles des concurrents et les retours informels de la commission.",
    question: "Quelle est la séquence correcte face à cette proposition ?",
    options: [
      { txt: "Refus catégorique immédiat, sortie de l'échange, signalement à la direction juridique et au déontologue.", correct: true },
      { txt: "Refuser poliment et améliorer notre offre sur les points faibles identifiés légalement.", correct: false, piege: "Même légalement, améliorer l'offre après avoir entendu des prix concurrents crée un risque de contamination." },
      { txt: "Demander à Mme Deschamps de préciser la légalité de sa démarche avant de répondre.", correct: false, piege: "Chaque échange supplémentaire avec Mme Deschamps crée un risque supplémentaire. Refus immédiat et silence." },
      { txt: "Signaler au déontologue et attendre ses instructions avant de répondre à Mme Deschamps.", correct: false, piege: "D'abord couper le contact, ensuite signaler. Dans cet ordre — pas l'inverse." }
    ]
  }
];

// ═══════════════════════════════════════════════════════════════
// MODULE QUIZ
// ═══════════════════════════════════════════════════════════════
const Quiz = (() => {

  let _idx      = 0;
  let _score    = 0;
  let _answered = false;

  // ── Démarrage ────────────────────────────────────────────────
  function start() {
    // Bloquer si déjà complété
    try {
      if (localStorage.getItem('horizon_quiz_result')) return;
    } catch(e) {}

    _idx      = 0;
    _score    = 0;
    _answered = false;

    $('quiz-overlay').classList.add('on');
    $('quiz-wrap').innerHTML = `
      <div class="quiz-inner quiz-intro">
        <div class="qi-eyebrow">Projet Horizon · Validation des acquis</div>
        <div class="qi-title">Quiz de conformité</div>
        <div class="qi-sub">10 situations que vous avez vécues — les bonnes décisions à retenir</div>
        <div class="qi-pills">
          <div class="qi-pill">📋 ${QUIZ_DATA.length} questions</div>
          <div class="qi-pill">⏱ ~5 minutes</div>
          <div class="qi-pill">🎯 Ancré dans vos affaires</div>
        </div>
        <div class="qi-desc">
          Chaque question cite une situation que vous avez traversée. Pas de théorie abstraite —
          retrouvez les bons réflexes à partir de ce que vous avez vécu.
          Répondez sans revenir en arrière — chaque question n'est posée qu'une fois.
        </div>
        <button class="qi-start-btn" onclick="Quiz._beginQuestions()">Commencer le quiz →</button>
      </div>`;
  }

  // ── Lance les questions après l'écran d'intro ─────────────────
  function _beginQuestions() {
    _render();
  }

  // Options mélangées pour la question courante (recalculé à chaque _render)
  let _shuffledOptions = [];

  // ── Affiche la question courante ─────────────────────────────
  function _render() {
    if (_idx >= QUIZ_DATA.length) { _renderResults(); return; }
    const q   = QUIZ_DATA[_idx];
    const tot = QUIZ_DATA.length;
    const pct = (_idx / tot * 100).toFixed(0);

    // Mélange Fisher-Yates des options pour cette question
    _shuffledOptions = q.options.map((o, i) => ({ ...o, _origIdx: i }));
    for (let i = _shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [_shuffledOptions[i], _shuffledOptions[j]] = [_shuffledOptions[j], _shuffledOptions[i]];
    }

    $('quiz-wrap').innerHTML = `
      <div class="quiz-inner">
        <div class="quiz-hdr">
          <span class="quiz-num">Question ${_idx + 1} / ${tot}</span>
          <div class="quiz-bar"><div class="quiz-bar-fill" style="width:${pct}%"></div></div>
        </div>
        <div class="quiz-situation">${q.situation}</div>
        <div class="quiz-question">${q.question}</div>
        <div class="quiz-opts" id="quiz-opts">
          ${_shuffledOptions.map((o, i) => `<button class="quiz-opt" onclick="Quiz.answer(${i})">${o.txt}</button>`).join('')}
        </div>
        <div id="quiz-feedback"></div>
      </div>`;
  }

  // ── Traitement d'une réponse ─────────────────────────────────
  function answer(i) {
    if (_answered) return;
    _answered = true;
    const correct    = _shuffledOptions[i].correct;
    const correctIdx = _shuffledOptions.findIndex(o => o.correct);
    const q          = QUIZ_DATA[_idx];
    if (correct) _score++;

    document.querySelectorAll('.quiz-opt').forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correctIdx)          btn.classList.add('quiz-opt-correct');
      else if (idx === i && !correct)  btn.classList.add('quiz-opt-wrong');
    });

    const isLast  = (_idx + 1 >= QUIZ_DATA.length);
    const fbTxt   = correct ? 'Correct !' : (_shuffledOptions[i].piege || '');
    $('quiz-feedback').innerHTML = `
      <div class="quiz-fb ${correct ? 'qfb-ok' : 'qfb-ko'}">
        <span class="qfb-ic">${correct ? '✓' : '✗'}</span>
        <span class="qfb-txt">${fbTxt}</span>
      </div>
      <button class="quiz-next-btn" onclick="Quiz.next()">
        ${isLast ? 'Voir mes résultats →' : 'Question suivante →'}
      </button>`;
  }

  // ── Passe à la question suivante ─────────────────────────────
  function next() {
    _idx++;
    _answered = false;
    _render();
  }

  // ── Écran de résultats ───────────────────────────────────────
  function _renderResults() {
    const tot = QUIZ_DATA.length;

    let icon, label, cls, msg, extra = '';
    if (_score >= 8) {
      icon  = '✅'; label = 'Acquis validés'; cls = 'qr-excellent';
      msg   = 'Excellente maîtrise des règles anticorruption. Votre formation est complète.';
      extra = '<div class="qr-badge">🎓 Badge débloqué : <strong>Expert Intégrité</strong></div>';
      if (typeof Badges !== 'undefined') Badges.check('quizExpert', { score: _score });
    } else if (_score >= 6) {
      icon  = '⚠️'; label = 'Acquis partiels'; cls = 'qr-partial';
      msg   = 'Quelques situations méritent d\'être revues — votre bilan détaillé vous indique les axes de progression.';
    } else {
      icon  = '🔴'; label = 'Points à consolider'; cls = 'qr-fail';
      msg   = 'Certains réflexes anticorruption méritent d\'être retravaillés. Votre bilan détaillé vous indique les priorités.';
    }

    if (typeof Tracker !== 'undefined' && typeof Tracker.recordQuiz === 'function') {
      Tracker.recordQuiz(_score, tot);
    }
    try { localStorage.setItem('horizon_quiz_result', JSON.stringify({ score: _score, total: tot })); } catch(e) {}

    // Tracker contexte badges
    if (typeof etatJeu !== 'undefined') etatJeu.quizScore = _score;
    if (typeof Badges !== 'undefined') Badges.check('quizEnd', { score: _score });

    $('quiz-wrap').innerHTML = `
      <div class="quiz-inner quiz-results">
        <div class="qr-header">✅ Validation des acquis</div>
        <div class="qr-score-block ${cls}">
          <div class="qr-icon">${icon}</div>
          <div class="qr-score">${_score}<span class="qr-total">/${tot}</span></div>
          <div class="qr-label">${label}</div>
        </div>
        <div class="qr-msg">${msg}</div>
        ${extra}
        <button class="qr-btn-final" onclick="Quiz.close()">Voir mon bilan final →</button>
      </div>`;
  }

  function close() {
    $('quiz-overlay').classList.remove('on');
    // Afficher l'écran diplôme si le quiz vient d'être complété
    if (typeof showDiploma === 'function') showDiploma();
  }

  function forceStart() {
    try { localStorage.removeItem('horizon_quiz_result'); } catch(e) {}
    start();
  }

  return { start, forceStart, answer, next, close, _beginQuestions };
})();
