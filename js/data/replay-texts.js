// ═══════════════════════════════════════════════════════════════
// TEXTES D'ANALYSE — Mode Replay Annoté
// Structure par affaire (index 0-9) :
//   reflexe : { mauvais, bon }
//   choices : [{ type, analyse }]  — dans l'ordre choices[] de CHAPTERS
// ═══════════════════════════════════════════════════════════════

const REPLAY_TEXTS = [

  // ── Affaire 1 — Le CV sur le dessus de la pile ───────────────
  {
    reflexe: {
      mauvais: "Vous avez posé les bonnes questions sur le profil mais n'avez pas informé le déontologue — laisser la pression hiérarchique s'installer sans témoin, c'est s'exposer seul au risque.",
      bon:     "Vous avez posé les bonnes questions ET protégé la SEM en alertant le déontologue. C'est exactement la bonne posture : documenter, formaliser, se couvrir.",
    },
    choices: [
      { type: 'bad',  analyse: "Vous avez cédé à la pression de M. Aubert. C'est très courant — et c'est aussi comme ça que la corruption s'installe progressivement. Un seul 'oui facile', puis un deuxième plus facile encore." },
      { type: 'warn', analyse: "Vous avez respecté le processus mais sans documenter la pression reçue. C'est mieux qu'accepter, mais votre position reste fragile juridiquement." },
      { type: 'good', analyse: "Vous avez maintenu l'intégrité ET documenté la demande de M. Aubert. La traçabilité vous protège même si la décision crée des tensions." },
    ],
  },

  // ── Affaire 2 — Le Déjeuner de l'Acheteur ───────────────────
  {
    reflexe: {
      mauvais: "Vous avez analysé la situation commerciale mais omis d'évaluer la dimension réglementaire. Un repas d'affaires peut être légitime — ou constituer un avantage indu selon sa valeur et son contexte.",
      bon:     "Vous avez posé les bonnes questions sur la valeur du repas ET sur les règles internes. C'est le bon réflexe : évaluer avant d'agir, pas après.",
    },
    choices: [
      { type: 'bad',  analyse: "Accepter un repas fastueux d'un fournisseur en position d'acheteur public, c'est franchir la ligne — même sans intention frauduleuse. La valeur et le contexte font l'infraction." },
      { type: 'warn', analyse: "Vous avez limité la dépense mais sans formaliser. Un repas modéré reste une zone grise si aucune trace n'existe. Documentez systématiquement." },
      { type: 'good', analyse: "Refuser ou encadrer strictement le repas et le déclarer : c'est la seule position qui vous met à l'abri. Votre indépendance de jugement reste intacte." },
    ],
  },

  // ── Affaire 3 — Les Fantômes de la Paie ─────────────────────
  {
    reflexe: {
      mauvais: "Vous avez détecté l'anomalie mais n'avez pas mis en place les bons contrôles croisés. Une modification de RIB sans vérification directe auprès du bénéficiaire est un signal d'alerte majeur.",
      bon:     "Vous avez identifié les signaux faibles et déclenché les bons contrôles. La double vérification RIB + confirmation directe est le standard minimal.",
    },
    choices: [
      { type: 'bad',  analyse: "Laisser passer la modification sans contrôle, c'est ouvrir la porte à la fraude. Même une erreur de bonne foi vous rend responsable si les processus n'ont pas été respectés." },
      { type: 'warn', analyse: "Vous avez signalé mais sans bloquer. Dans un processus de paie, le doute doit entraîner le gel — pas seulement la notification." },
      { type: 'good', analyse: "Bloquer, vérifier, documenter. Cette séquence vous protège et protège les agents. C'est la procédure qui fait foi en cas de litige." },
    ],
  },

  // ── Affaire 4 — La Nuit des Tonnages ────────────────────────
  {
    reflexe: {
      mauvais: "Vous avez vu l'anomalie sur les tonnages mais n'avez pas mobilisé les bons outils de contrôle. Un arrondi systématique sur pesée, c'est une fraude chronique — pas une erreur ponctuelle.",
      bon:     "Vous avez identifié le mécanisme de fraude ET proposé un contrôle croisé indépendant. Sans témoin neutre, la parole du chauffeur ne peut pas être contestée.",
    },
    choices: [
      { type: 'bad',  analyse: "Accepter l'arrondi 'pour cette fois', c'est valider la pratique. Le chauffeur sait maintenant que vous ne bloquez pas. La fraude continuera." },
      { type: 'warn', analyse: "Vous avez refusé mais sans formaliser. Sans trace écrite, il sera difficile de prouver que vous avez bien refusé si la fraude est découverte plus tard." },
      { type: 'good', analyse: "Refuser, documenter et alerter la direction : c'est interrompre le cycle de fraude et vous protéger en même temps. Le silence complice coûte plus cher." },
    ],
  },

  // ── Affaire 5 — Le Chantage à l'Autorisation ────────────────
  {
    reflexe: {
      mauvais: "Vous avez évalué la situation opérationnelle mais pas la dimension pénale. Lier un versement — quelle que soit sa forme — à une décision administrative, c'est du trafic d'influence.",
      bon:     "Vous avez reconnu le lien entre le versement et la décision administrative. C'est l'élément constitutif clé du trafic d'influence — peu importe que M. Lefebvre soit inspecteur.",
    },
    choices: [
      { type: 'bad',  analyse: "Accepter même indirectement la proposition, c'est entrer dans le trafic d'influence — avec ou sans intention. Le parquet n'a pas besoin de prouver l'intention pour poursuivre." },
      { type: 'warn', analyse: "Vous avez refusé verbalement mais sans le formaliser. Une demande de trafic d'influence doit être signalée — ne pas le faire vous laisse exposé(e)." },
      { type: 'good', analyse: "Refus explicite, signalement au déontologue et traçabilité : vous avez appliqué le trifecta de protection. La SEM est protégée et vous aussi." },
    ],
  },

  // ── Affaire 6 — L'Offensive Commerciale ─────────────────────
  {
    reflexe: {
      mauvais: "Vous avez évalué l'opportunité commerciale sans mesurer le conflit d'intérêts. Le fait que l'acheteur public soit président du club transforme automatiquement le sponsoring en risque de corruption.",
      bon:     "Vous avez identifié le lien entre le sponsoring et la position de l'acheteur. C'est précisément ce lien qui disqualifie l'opération — même si la somme semble raisonnable.",
    },
    choices: [
      { type: 'bad',  analyse: "Verser un sponsoring dont bénéficie l'acheteur public constitue un avantage indu — c'est de la corruption active, quelle que soit la qualité du dossier commercial." },
      { type: 'warn', analyse: "Vous avez réduit le montant mais maintenu le versement. La réduction ne fait pas disparaître le conflit d'intérêts : le lien entre don et décision reste." },
      { type: 'good', analyse: "Refuser le sponsoring dans ce contexte et proposer une voie légale protège la SEM. Un mécénat légitime passe par un appel à projets public, pas un accord bilatéral." },
    ],
  },

  // ── Affaire 7 — L'Extension Horizon ─────────────────────────
  {
    reflexe: {
      mauvais: "Vous avez évalué l'opportunité foncière sans vérifier les protections institutionnelles. Pour une SEM, toute acquisition doit passer par une évaluation France Domaines — sans exception.",
      bon:     "Vous avez identifié le double problème : lien entre le vendeur et les décideurs + absence d'évaluation réglementaire. Les deux ensemble constituent une prise illégale d'intérêts certaine.",
    },
    choices: [
      { type: 'bad',  analyse: "Procéder à l'acquisition sans évaluation France Domaines, c'est exposer la SEM à une prise illégale d'intérêts — même si le prix est 'dans le marché'." },
      { type: 'warn', analyse: "Suspendre sans formaliser les raisons, c'est une demi-mesure. Documentez pourquoi vous avez suspendu — c'est votre protection si la décision est contestée." },
      { type: 'good', analyse: "Suspension + demande d'évaluation + signalement : vous avez appliqué exactement ce que la loi exige. Votre rigueur protège la SEM et son projet." },
    ],
  },

  // ── Affaire 8 — L'Urgence de fin de mois ────────────────────
  {
    reflexe: {
      mauvais: "Vous avez détecté l'anomalie dans les coordonnées bancaires mais n'avez pas activé le bon protocole. La fraude au virement peut venir d'un partenaire de confiance — la confiance n'est pas un contrôle.",
      bon:     "Vous avez bloqué le virement ET déclenché la double vérification. C'est le bon réflexe : les processus anti-fraude s'appliquent même aux partenaires de longue date.",
    },
    choices: [
      { type: 'bad',  analyse: "Valider un virement vers un RIB non vérifié sous pression d'urgence, c'est exactement le scénario de la fraude au président ou à la facture. L'urgence est souvent fabriquée." },
      { type: 'warn', analyse: "Vous avez demandé confirmation mais par e-mail au même interlocuteur. Si l'adresse est compromise, la confirmation ne vaut rien. Vérifiez toujours par un canal indépendant." },
      { type: 'good', analyse: "Bloquer, rappeler sur le numéro officiel enregistré, documenter : c'est la procédure qui protège les fonds. L'urgence ne justifie jamais de court-circuiter les contrôles." },
    ],
  },

  // ── Affaire 9 — Opération Prestige ───────────────────────────
  {
    reflexe: {
      mauvais: "Vous avez évalué l'opportunité de mécénat sans lire la clause problématique. La clause 4b liant le mécénat à une décision commerciale transforme le don en corruption — même non exécutée.",
      bon:     "Vous avez identifié la clause 4b et compris que l'écrit aggrave la situation. La trace contractuelle prouve l'intention — c'est ce que cherche le parquet.",
    },
    choices: [
      { type: 'bad',  analyse: "Signer le contrat avec la clause 4b, c'est matérialiser la corruption — même si aucun versement n'a encore eu lieu. La signature suffit à caractériser l'infraction." },
      { type: 'warn', analyse: "Refuser verbalement sans retourner le document : la clause existe toujours dans la version du partenaire. Exigez un avenant écrit supprimant la clause." },
      { type: 'good', analyse: "Refus de la clause, avenant ou rupture de la négociation : vous avez protégé la SEM d'une preuve contractuelle de corruption. Votre vigilance sur l'écrit est exemplaire." },
    ],
  },

  // ── Affaire 10 — Le Contrat à tout prix ─────────────────────
  {
    reflexe: {
      mauvais: "Vous avez évalué l'intérêt commercial de Mme Deschamps sans mesurer le risque juridique de son profil. La connaissance de son passé judiciaire aggrave la responsabilité pénale de la SEM.",
      bon:     "Vous avez identifié à la fois le conflit d'intérêts de l'intermédiaire et le risque pénal lié à son profil. Utiliser un intermédiaire ne protège pas la SEM — ça l'expose davantage.",
    },
    choices: [
      { type: 'bad',  analyse: "Accepter même une seule option via Mme Deschamps vous place dans la chaîne de corruption. Le recours à un intermédiaire connu du parquet aggrave la situation — il ne la neutralise pas." },
      { type: 'warn', analyse: "Vous avez limité les engagements mais maintenu le contact avec Mme Deschamps. Toute interaction documentée avec lui vous lie à l'affaire si elle est instruite." },
      { type: 'good', analyse: "Rompre le contact, informer la direction et documenter la tentative : vous avez protégé la SEM et créé la trace qui prouve votre bonne foi si l'affaire remonte." },
    ],
  },
];
