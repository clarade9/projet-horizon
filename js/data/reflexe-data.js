// ═══════════════════════════════════════════════════════════════
// REFLEXE_DATA — Questions et actions par affaire (0–9)
// Partagé entre le jeu solo (reflexe-pro.js) et le mode Live.
// ═══════════════════════════════════════════════════════════════

const REFLEXE_DATA = {

  // Affaire 1 — Le Recrutement (ch=0)
  0: {
    context: "M. Aubert vous recommande son neveu pour le poste de Responsable d'Exploitation.",
    documents: [
      { icon:"ti-file-text",     label:"Registre des déclarations",  contenu:"Aucune déclaration de conflit d'intérêts enregistrée pour M. Aubert depuis sa prise de poste.", pertinent:true,  signal:"Absence de déclaration obligatoire" },
      { icon:"ti-id-badge",      label:"Fiche de poste",             contenu:"Responsable d'Exploitation — 5 ans d'expérience minimum requis dans le domaine. Diplôme Bac+4 exigé.", pertinent:true,  signal:"Exigences incompatibles avec le profil recommandé" },
      { icon:"ti-clipboard-list",label:"Charte de recrutement",      contenu:"Tout recrutement doit passer par le portail RH officiel. Toute recommandation d'un élu doit être déclarée au déontologue avant transmission au jury.", pertinent:false, signal:null },
      { icon:"ti-mail",          label:"Mail de M. Aubert",          contenu:"« Je vous transmets la candidature de mon neveu Thomas. C'est un jeune homme très motivé. Je compte sur vous pour lui accorder toute l'attention qu'il mérite. »", pertinent:false, signal:null },
    ],
    questions: [
      { txt: "Je transmets sa candidature au jury comme toute autre. Le processus s'applique à tous les candidats." },
      { txt: "Avez-vous formalisé cette recommandation par écrit auprès du conseil d'administration ?" },
      { txt: "Votre neveu correspond-il aux 5 ans d'expérience requis dans la fiche de poste ?" },
      { txt: "Je vous encourage à déclarer votre lien familial au déontologue avant toute décision." },
    ],
    actions: [
      { txt: "Consulter la charte de recrutement interne" },
      { txt: "Informer le déontologue de la situation" },
      { txt: "Constituer un jury pluraliste indépendant pour ce poste" },
      { txt: "Mettre la candidature de côté sans la traiter" },
    ],
    combos: {
      questions: { good: '0,3', warn: '0,2', bad: '1,2' },
      actions:   { good: '1,2', warn: '0,2', bad: '0,3' },
    },
    analysereflexe: {
      verdictRapide: {
        good: "Posture irréprochable — vous avez protégé la SEM et mis M. Aubert face à ses responsabilités.",
        warn: "Bonne orientation globale, mais un réflexe manquait pour être pleinement protégé.",
        bad:  "Ces réflexes laissent la SEM exposée. L'analyse ci-dessous vous montre les points critiques.",
      },
      questions: {
        0: { pertinent: true,  pourquoi: "Transmettre via le processus officiel est la neutralité procédurale parfaite. Elle ne rejette pas le candidat, elle ne favorise personne.", alternative: null },
        1: { pertinent: false, pourquoi: "Demander une formalisation au CA n'apporte pas de protection — c'est le déontologue qui doit être alerté, pas le CA.", alternative: "Q4 — Inviter M. Aubert à déclarer son lien au déontologue : procédural, irréprochable." },
        2: { pertinent: true,  pourquoi: "Rappeler les exigences du poste est factuel et objectif. Cela recentre la discussion sur la procédure sans attaquer le candidat.", alternative: null },
        3: { pertinent: true,  pourquoi: "Inviter M. Aubert à déclarer son lien familial au déontologue est un acte procédural irréprochable. Il protège la SEM et vous protège personnellement.", alternative: null },
      },
      actions: {
        0: { pertinent: false, pourquoi: "Consulter la charte est une étape normale mais insuffisante ici — l'enjeu est de créer une trace et de protéger la SEM.", alternative: "A2 — Informer le déontologue : c'est lui qui documente et protège." },
        1: { pertinent: true,  pourquoi: "Le déontologue est votre allié — il documente la situation et vous protège si la pression monte.", alternative: null },
        2: { pertinent: true,  pourquoi: "Un jury indépendant et documenté est la seule protection contre une accusation de favoritisme, pour vous et pour la SEM.", alternative: null },
        3: { pertinent: false, pourquoi: "Ignorer une candidature sans la traiter expose à des risques juridiques distincts. La bonne pratique est de la traiter via la procédure officielle.", alternative: "A2 — Informer le déontologue qui encadrera la suite." },
      },
      regleOr: "Toute recommandation d'un élu doit être déclarée au déontologue. La transparence est votre seule protection.",
    },
  },

  // Affaire 2 — Le Déjeuner (ch=1)
  1: {
    context: "M. Laroche vous a invité dans un restaurant gastronomique et vous propose des invitations Roland Garros loge VIP.",
    documents: [
      { icon:"ti-coin",          label:"Note de frais du déjeuner",        contenu:"Restaurant Le Grand Véfour — 3 couverts — 380€. Soit 127€ par personne, bien au-delà du seuil autorisé de 80€.", pertinent:true,  signal:"Dépassement du seuil interne de 80€/personne" },
      { icon:"ti-clipboard-list",label:"Règlement cadeaux & invitations",  contenu:"Tout avantage reçu d'un fournisseur ou candidat à un marché doit être refusé ou déclaré. Seuil : 80€ par personne et par événement.", pertinent:false, signal:null },
      { icon:"ti-calendar",      label:"Calendrier des appels d'offres",   contenu:"Marché de maintenance préventive — clôture des offres : dans 12 jours. M. Laroche figure parmi les 3 candidats présélectionnés.", pertinent:true,  signal:"Invitation pendant une procédure d'appel d'offres en cours" },
      { icon:"ti-ticket",        label:"Invitation Roland Garros",         contenu:"2 places loge VIP — valeur estimée : 1 800€. Expéditeur : BTP Laroche & Associés. Objet : « En témoignage de notre partenariat. »", pertinent:false, signal:null },
    ],
    questions: [
      { txt: "Je dois refuser ces invitations — notre règlement interne fixe un seuil de 80€ par personne." },
      { txt: "Cette invitation sera-t-elle déclarée dans votre registre des cadeaux ?" },
      { txt: "Votre note technique sera traitée dans le cadre officiel de l'appel d'offres." },
      { txt: "Je vais devoir en référer à notre déontologue avant d'accepter quoi que ce soit." },
    ],
    actions: [
      { txt: "Déclarer le déjeuner dans le registre des cadeaux" },
      { txt: "Refuser les invitations Roland Garros par écrit" },
      { txt: "Transmettre la note technique au service achat via la procédure officielle" },
      { txt: "Ne pas mentionner ce déjeuner en interne" },
    ],
    combos: {
      questions: { good: '0,2', warn: '1,2', bad: '1,3' },
      actions:   { good: '1,2', warn: '0,2', bad: '0,3' },
    },
    analysereflexe: {
      verdictRapide: {
        good: "Refus clair, posture procédurale — vous avez coupé court à toute tentative d'influence.",
        warn: "Bonne orientation mais un réflexe laisse une porte entrouverte.",
        bad:  "Ces réflexes peuvent être interprétés comme une ouverture à l'arrangement. Voyez l'analyse.",
      },
      questions: {
        0: { pertinent: true,  pourquoi: "Énoncer clairement la règle des 80€ sans s'excuser est la posture idéale. C'est la procédure — pas vous — qui refuse.", alternative: null },
        1: { pertinent: false, pourquoi: "Demander si le déjeuner sera déclaré dans le registre suggère implicitement que vous envisagez de l'accepter.", alternative: "Q1 — Refuser directement en citant la règle interne : ferme et procédural." },
        2: { pertinent: true,  pourquoi: "Rappeler que la note technique sera traitée officiellement coupe court à toute tentative d'influence informelle.", alternative: null },
        3: { pertinent: false, pourquoi: "Référer au déontologue avant d'accepter est trop lourd pour un premier refus et laisse entendre qu'une acceptation est possible.", alternative: "Q1 — Le refus direct citant la règle interne est suffisant et plus rapide." },
      },
      actions: {
        0: { pertinent: false, pourquoi: "Déclarer un déjeuner qu'on accepte n'est pas une bonne pratique — le déjeuner lui-même dépasse les seuils acceptables.", alternative: "A2 — Refuser par écrit est la seule position défendable." },
        1: { pertinent: true,  pourquoi: "Le refus écrit est crucial — il crée une trace et protège contre toute accusation future.", alternative: null },
        2: { pertinent: true,  pourquoi: "Transmettre via la procédure officielle protège l'intégrité de l'appel d'offres et démontre votre bonne foi.", alternative: null },
        3: { pertinent: false, pourquoi: "Ne pas mentionner le déjeuner en interne est la pire option. Si cela ressort plus tard, votre silence devient suspect.", alternative: "A2 — Refuser par écrit ET en informer en interne." },
      },
      regleOr: "Tout avantage proposé par un candidat à un marché = refus immédiat, par écrit, transmis en interne.",
    },
  },

  // Affaire 3 — Fantômes de la Paie (ch=2)
  2: {
    context: "Vous constatez un écart de 3 200€ sur le salaire de Mme Favre et un changement de RIB non justifié.",
    documents: [
      { icon:"ti-chart-bar",  label:"Bulletin de salaire Mme Favre",     contenu:"Salaire habituel : 2 840€. Ce mois : 6 040€. Différence : +3 200€ sans libellé de prime visible sur le bulletin.", pertinent:true,  signal:"Écart de 3 200€ non justifié sur le bulletin" },
      { icon:"ti-building",   label:"Historique des virements RIB",      contenu:"Changement de RIB enregistré il y a 3 jours. Nouveau RIB : FR76 XXXX — banque différente de l'habituelle. Aucune validation DRH visible.", pertinent:true,  signal:"Changement de RIB récent sans validation" },
      { icon:"ti-file-text",  label:"Procédure changement de RIB",       contenu:"Tout changement de RIB doit être validé par le salarié en présentiel avec pièce d'identité, puis contresigné par le responsable RH.", pertinent:false, signal:null },
      { icon:"ti-mail",       label:"Mail de Mme Collet",                contenu:"« Bonjour, suite à notre échange de vendredi, je vous confirme que la prime exceptionnelle de Mme Favre a bien été validée en CODIR. Cordialement. »", pertinent:false, signal:null },
    ],
    questions: [
      { txt: "Pouvez-vous me fournir l'avenant signé justifiant cette prime exceptionnelle ?" },
      { txt: "Le changement de RIB a-t-il été validé selon notre procédure de vérification habituelle ?" },
      { txt: "Qui a autorisé ce virement supplémentaire ?" },
      { txt: "Je dois suspendre ce virement le temps de clarifier la situation avec la DAF." },
    ],
    actions: [
      { txt: "Suspendre le virement jusqu'à obtention d'un justificatif signé" },
      { txt: "Alerter la direction financière" },
      { txt: "Vérifier le RIB par téléphone au numéro officiel du fournisseur" },
      { txt: "Valider le virement pour ne pas bloquer la livraison" },
    ],
    combos: {
      questions: { good: '0,1', warn: '0,2', bad: '2,3' },
      actions:   { good: '0,2', warn: '0,1', bad: '1,3' },
    },
    analysereflexe: {
      verdictRapide: {
        good: "Excellent réflexe de contrôleur interne — gel immédiat et vérification par les bons canaux.",
        warn: "Bonne réaction mais un angle mort subsiste dans votre protocole.",
        bad:  "Des réflexes critiques manquent — l'analyse vous montre les points de fragilité.",
      },
      questions: {
        0: { pertinent: true,  pourquoi: "Exiger le document justificatif avant tout est le réflexe fondamental du contrôleur interne. Sans avenant, aucun virement ne peut être validé.", alternative: null },
        1: { pertinent: true,  pourquoi: "Vérifier la procédure de changement de RIB révèle immédiatement l'anomalie. C'est la question qui débloque tout.", alternative: null },
        2: { pertinent: false, pourquoi: "Demander qui a autorisé en face à face met votre interlocuteur en position défensive et l'incite à fabriquer une réponse.", alternative: "Q1 — Demander l'avenant signé est plus factuel et moins confrontationnel." },
        3: { pertinent: false, pourquoi: "Suspendre est une action, pas une question à poser à quelqu'un de potentiellement impliqué. La décision se prend, elle ne se demande pas.", alternative: "Q2 — Questionner la procédure RIB obtient des informations vérifiables." },
      },
      actions: {
        0: { pertinent: true,  pourquoi: "C'est le premier réflexe absolu. Tant que les justificatifs ne sont pas fournis, aucun virement ne doit partir.", alternative: null },
        1: { pertinent: false, pourquoi: "Alerter la direction financière est utile mais secondaire — d'abord suspendre, ensuite alerter, dans cet ordre.", alternative: "A3 — Vérifier le RIB par téléphone officiel est la priorité de sécurité immédiate." },
        2: { pertinent: true,  pourquoi: "Appeler le numéro officiel du fournisseur — jamais le numéro fourni dans le mail suspect — est la vérification de base contre la fraude au RIB.", alternative: null },
        3: { pertinent: false, pourquoi: "Valider pour ne pas bloquer la livraison est la justification la plus fréquente des complicités involontaires. Ne jamais céder à cette logique.", alternative: "A1 — Suspendre d'abord. La livraison peut attendre, la fraude ne peut pas." },
      },
      regleOr: "Geler avant d'investiguer. Investiguer avant d'alerter. Alerter par écrit, toujours.",
    },
  },

  // Affaire 4 — Nuit des Tonnages (ch=3)
  3: {
    context: "Patrice vous présente un bordereau de 12 tonnes. La bascule affiche 18,4. Une enveloppe est sur le comptoir. Votre chef vous demande de ne pas faire de vagues.",
    documents: [
      { icon:"ti-chart-bar",     label:"Ticket de pesée certifié",       contenu:"Pesée effectuée 22h47 — camion ViteDéchets — 18,4 tonnes nettes. Cachet de l'organisme certificateur présent. Dernier calibrage : il y a 3 jours.", pertinent:true,  signal:"Écart de 6,4 tonnes entre pesée certifiée et bordereau demandé" },
      { icon:"ti-phone",         label:"Appel chef d'exploitation",       contenu:"« ViteDéchets c'est 800 tonnes par mois. Ne faites pas de vagues ce soir — validez et on voit ça demain matin. »", pertinent:true,  signal:"Pression hiérarchique directe pour valider un bordereau erroné" },
      { icon:"ti-file-text",     label:"Bordereau ViteDéchets",           contenu:"Déclaration : Déchets verts — 12 tonnes. Transporteur : ViteDéchets SARL. Client : SEM Horizon. Date : ce jour. Signature chauffeur : Patrice D.", pertinent:false, signal:null },
      { icon:"ti-id-badge",      label:"Contrat prestataire ViteDéchets", contenu:"Tarif : 42€/tonne. Fréquence : hebdomadaire. Volume moyen déclaré : 800t/mois. Pénalité en cas d'écart non justifié : résiliation possible après 3 constats.", pertinent:false, signal:null },
    ],
    questions: [
      { txt: "Je ne peux pas valider un bordereau qui ne correspond pas à la pesée réelle." },
      { txt: "Je vais devoir signaler cet écart et cette enveloppe à la direction générale — pas à mon chef d'exploitation direct." },
      { txt: "C'est la première fois que vous avez un écart comme ça avec nous ?" },
      { txt: "Si votre patron peut confirmer par écrit que c'est une erreur de calibrage, je peux regarder." },
    ],
    actions: [
      { txt: "Enregistrer le tonnage réel (18,4t) sur le bordereau officiel" },
      { txt: "Photographier l'enveloppe et le chargement suspect avant tout mouvement" },
      { txt: "Alerter la direction générale et l'inspection des installations classées" },
      { txt: "Valider 12 tonnes pour ne pas bloquer le prestataire" },
    ],
    combos: {
      questions: { good: '0,1', warn: '0,2', bad: '2,3' },
      actions:   { good: '0,1', warn: '0,2', bad: '1,3' },
    },
    analysereflexe: {
      verdictRapide: {
        good: "Position de principe ferme et signalement au bon interlocuteur — les réflexes qui protègent.",
        warn: "Bonne orientation mais la chaîne de protection n'est pas complète.",
        bad:  "Des réflexes essentiels manquent — voyez l'analyse pour comprendre l'exposition.",
      },
      questions: {
        0: { pertinent: true,  pourquoi: "Énoncer clairement qu'on ne peut pas valider l'écart est la position de principe. Elle est indiscutable car basée sur les faits bruts de la pesée certifiée.", alternative: null },
        1: { pertinent: true,  pourquoi: "Quand votre supérieur direct est potentiellement impliqué dans la pression, contacter la direction générale directement est le seul réflexe qui vous protège.", alternative: null },
        2: { pertinent: false, pourquoi: "Cette question n'apporte aucune protection et peut laisser entendre que vous envisagez un arrangement si c'est la première fois.", alternative: "Q1 — Le refus de principe basé sur la pesée certifiée est indiscutable." },
        3: { pertinent: false, pourquoi: "Demander une confirmation écrite d'une erreur de calibrage revient à chercher une justification pour valider une fraude. Ne jamais emprunter cette voie.", alternative: "Q2 — Signaler à la direction générale — pas au chef d'exploitation — est le seul réflexe protecteur." },
      },
      actions: {
        0: { pertinent: true,  pourquoi: "C'est l'acte fondamental. La bascule certifiée dit 18,4 tonnes — c'est ce qui doit figurer sur le bordereau. Aucune exception, aucune pression ne change ce fait.", alternative: null },
        1: { pertinent: true,  pourquoi: "Photographier avant d'agir crée des preuves irréfutables. Si la situation dégénère, vous avez un dossier que personne ne peut contester.", alternative: null },
        2: { pertinent: false, pourquoi: "Alerter l'inspection des IC est pertinent pour les déchets dangereux, mais c'est une étape secondaire — d'abord enregistrer le tonnage réel et photographier les preuves.", alternative: "A1 — Enregistrer le tonnage réel est la priorité absolue. La suite vient après." },
        3: { pertinent: false, pourquoi: "Valider 12 tonnes pour ne pas bloquer le prestataire est une complicité de fraude caractérisée, même sans toucher l'enveloppe. L'urgence opérationnelle ne justifie jamais une falsification.", alternative: "A1 — Enregistrer le tonnage réel est la seule position légale." },
      },
      regleOr: "Ce que la bascule affiche est ce qui doit figurer sur le bordereau. Toujours. Sans exception. Et une enveloppe sur un comptoir n'est jamais anodine.",
    },
  },

  // Affaire 5 — Chantage Autorisation (ch=4)
  4: {
    context: "M. Lefebvre propose d'obtenir votre autorisation en 72h pour 45 000€ grâce à son réseau préfectoral.",
    documents: [
      { icon:"ti-building",  label:"Extrait Kbis BioConsult",            contenu:"BioConsult SARL — gérant : Marc Lefebvre. Associée : Sophie Lefebvre-Morin, également chargée de mission à la préfecture, service environnement.", pertinent:true,  signal:"Associée en poste à la préfecture instructrice du dossier" },
      { icon:"ti-file-text", label:"Devis BioConsult",                   contenu:"Prestation « accompagnement réglementaire accéléré » — 45 000€ HT. Délai annoncé : 72h. Aucun livrable précis mentionné.", pertinent:true,  signal:"Prestation sans livrable — délai anormalement court" },
      { icon:"ti-calendar",  label:"Dossier de demande d'autorisation",  contenu:"Dossier déposé il y a 6 semaines. Statut : complet selon accusé de réception. Délai légal d'instruction : 3 mois. Échéance : dans 6 semaines.", pertinent:false, signal:null },
      { icon:"ti-mail",      label:"Mail de M. Lefebvre",                contenu:"« Avec notre réseau, votre dossier peut être traité en priorité. Ce type de blocage administratif, on en voit tous les jours — et on sait comment les débloquer. »", pertinent:false, signal:null },
    ],
    questions: [
      { txt: "Pouvez-vous me détailler les livrables exacts de cette prestation ?" },
      { txt: "Votre associée travaille à la préfecture — comment gérez-vous ce conflit d'intérêts ?" },
      { txt: "Nous allons compléter le dossier nous-mêmes et le soumettre directement à la préfecture." },
      { txt: "Je dois en référer à notre direction juridique avant tout engagement." },
    ],
    actions: [
      { txt: "Refuser la prestation de BioConsult par écrit" },
      { txt: "Compléter le dossier en interne et le déposer officiellement" },
      { txt: "Alerter le déontologue sur le conflit d'intérêts" },
      { txt: "Accepter la prestation pour gagner du temps" },
    ],
    combos: {
      questions: { good: '2,3', warn: '0,3', bad: '0,1' },
      actions:   { good: '0,1', warn: '1,2', bad: '0,3' },
    },
    analysereflexe: {
      verdictRapide: {
        good: "Refus sans ambiguïté et action directe — vous avez contourné l'intermédiaire corrompu.",
        warn: "Bonne orientation mais la chaîne de protection contre Lefebvre n'est pas complète.",
        bad:  "Ces réflexes exposent la SEM à une accusation de corruption active. Voyez l'analyse.",
      },
      questions: {
        0: { pertinent: false, pourquoi: "Demander les livrables peut sembler prudent mais risque de laisser croire qu'on envisage la prestation — ce qui est dangereux dans cette situation.", alternative: "Q3 — Annoncer qu'on dépose le dossier directement coupe court à toute pression." },
        1: { pertinent: false, pourquoi: "Pointer le conflit d'intérêts de l'associée directement peut braquer Lefebvre sans créer de protection juridique réelle pour la SEM.", alternative: "Q4 — Référer à la direction juridique crée une trace et protège institutionnellement." },
        2: { pertinent: true,  pourquoi: "Annoncer qu'on dépose directement à la préfecture coupe court à toute pression externe. C'est la posture la plus forte et la plus protectrice.", alternative: null },
        3: { pertinent: true,  pourquoi: "Avant tout engagement, référer à la direction juridique est le réflexe qui protège la SEM et crée une trace de la tentative de corruption.", alternative: null },
      },
      actions: {
        0: { pertinent: true,  pourquoi: "Le refus écrit est la preuve irréfutable si Lefebvre tente de se retourner contre la SEM. Il doit être tracé et archivé.", alternative: null },
        1: { pertinent: true,  pourquoi: "Déposer directement à la préfecture démontre la bonne foi de la SEM et contourne l'intermédiaire corrompu de façon irréprochable.", alternative: null },
        2: { pertinent: false, pourquoi: "Alerter le déontologue est utile mais secondaire — d'abord refuser et déposer le dossier soi-même, ensuite signaler la tentative.", alternative: "A1 — Le refus par écrit est l'acte prioritaire et le plus protecteur." },
        3: { pertinent: false, pourquoi: "Accepter même pour débloquer constitue une corruption active. Mieux vaut payer l'amende environnementale que d'entrer dans cette logique.", alternative: "A2 — Compléter et déposer officiellement : la seule voie légale." },
      },
      regleOr: "Signaler une tentative de corruption protège juridiquement la SEM. Ne jamais contourner — toujours affronter.",
    },
  },

  // Affaire 6 — Les Références Gonflées (ch=5)
  5: {
    context: "Mme Perrin (DST Val-Vert) vous signale que vos références en co-traitance sont insuffisantes. Un collègue suggère de présenter votre part à 100% pour « passer » la commission.",
    documents: [
      { icon:"ti-chart-bar", label:"Dossier de candidature — références",  contenu:"Références déclarées : 3 marchés en co-traitance. Part réelle de la SEM : 20%, 35%, 40%. Si déclarées à 100% chacune, le tonnage cumulé passerait de 4 200 t à 18 500 t.", pertinent:true,  signal:"Écart de 14 300 tonnes entre réalité et déclaration potentielle gonflée" },
      { icon:"ti-file-text", label:"Règlement de consultation Val-Vert",    contenu:"Critère références : 3 marchés comparables, 5 000 t minimum par marché, sur les 5 dernières années. La part de co-traitance doit correspondre à la part réelle assumée.", pertinent:true,  signal:"La procédure exige la part réelle — gonfler les chiffres est un faux en écriture" },
      { icon:"ti-mail",      label:"Mail interne d'un collègue",            contenu:"« T'inquiète, tout le monde le fait dans le secteur. Mets 100% sur chaque marché — ils ne vérifient jamais les attestations en détail. Si on perd ce marché, c'est 2M€ qui partent. »", pertinent:true,  signal:"Pression interne à falsifier les déclarations pour sécuriser le marché" },
      { icon:"ti-id-badge",  label:"Attestation co-traitant (exemple)",     contenu:"Attestation de référence signée par le co-traitant : « La part assumée par la SEM Horizon sur ce marché était de 20% du tonnage total traité. » Document officiel, engageant.", pertinent:false, signal:null },
    ],
    questions: [
      { txt: "Les attestations doivent refléter notre part réelle — je ne peux pas signer des chiffres inexacts." },
      { txt: "Peut-on valoriser notre rôle de coordination sur ces marchés sans modifier les tonnages ?" },
      { txt: "Quelles sont les conséquences si la commission détecte une incohérence dans nos références ?" },
      { txt: "Les autres candidats font-ils la même chose sur leurs dossiers ?" },
    ],
    actions: [
      { txt: "Déposer le dossier avec les parts réelles et une note de valorisation du rôle de coordination" },
      { txt: "Alerter la direction sur le risque juridique avant tout dépôt" },
      { txt: "Gonfler les références pour passer la commission — tout le monde le fait" },
      { txt: "Retirer notre candidature plutôt que de falsifier les documents" },
    ],
    combos: {
      questions: { good: '0,1', warn: '0,2', bad: '2,3' },
      actions:   { good: '0,1', warn: '0,3', bad: '1,2' },
    },
    analysereflexe: {
      verdictRapide: {
        good: "Refus clair de falsifier, valorisation des vrais atouts — posture intègre qui protège la SEM.",
        warn: "Bonne orientation mais un angle mort subsiste dans votre démarche.",
        bad:  "Ces réflexes vous exposent à une accusation de faux en écriture. Voyez l'analyse.",
      },
      questions: {
        0: { pertinent: true,  pourquoi: "Affirmer que les attestations doivent refléter la réalité ferme la porte sans ambiguïté. C'est la position légale et la seule défendable en cas de contrôle.", alternative: null },
        1: { pertinent: true,  pourquoi: "Chercher à valoriser le rôle de coordination est la voie créative et intègre — mettre en avant la valeur ajoutée réelle sans falsifier les chiffres.", alternative: null },
        2: { pertinent: false, pourquoi: "S'interroger sur les conséquences détectées suggère qu'on envisage de prendre le risque. Ce n'est pas la bonne question — la question est légale, pas probabiliste.", alternative: "Q1 — Affirmer d'emblée le refus de signer des chiffres inexacts est la posture protectrice." },
        3: { pertinent: false, pourquoi: "Ce que font les concurrents est hors-sujet. La loi s'applique à vous indépendamment des pratiques du secteur.", alternative: "Q2 — Chercher à valoriser les vrais atouts est la réponse constructive et conforme." },
      },
      actions: {
        0: { pertinent: true,  pourquoi: "Déposer avec les parts réelles + note de valorisation montre de la rigueur. Certaines commissions récompensent la transparence, et vous êtes irréprochable quoi qu'il arrive.", alternative: null },
        1: { pertinent: true,  pourquoi: "Alerter la direction avant le dépôt partage la responsabilité et permet une décision collégiale sur la stratégie — c'est le bon réflexe managérial.", alternative: null },
        2: { pertinent: false, pourquoi: "Gonfler les références constitue un faux en écriture (art. 441-1 CP) et une déclaration mensongère à un pouvoir adjudicateur. La peine : jusqu'à 3 ans et 45 000€.", alternative: "A1 — Déposer avec les vrais chiffres est la seule option sans risque pénal." },
        3: { pertinent: false, pourquoi: "Se retirer sans alerter laisse le problème entier. La direction doit être informée du contexte avant toute décision — le retrait peut être justifié mais pas sans dialogue.", alternative: "A2 — Alerter la direction d'abord, puis décider ensemble de la stratégie." },
      },
      regleOr: "Une attestation qui gonfle votre part réelle est un faux en écriture. Pas une approximation, pas une convention du secteur — un délit pénal.",
    },
  },

  // Affaire 7 — Extension Horizon (ch=6)
  6: {
    context: "Mme Ruiz a négocié un terrain bien en dessous du marché auprès d'un proche d'un administrateur, sans livrable écrit.",
    documents: [
      { icon:"ti-coin",          label:"Estimation prix du terrain",            contenu:"Estimation France Domaines : 618 000€. Prix négocié par Mme Ruiz : 380 000€ — soit 38% en dessous du prix marché. Aucun rapport d'expertise indépendante.", pertinent:true,  signal:"Prix 38% sous l'estimation officielle — sans expertise" },
      { icon:"ti-building",      label:"Fiche vendeur",                         contenu:"Vendeur : SCI Les Pins — gérant : Jacques Morel. Lien avec M. Aubert (administrateur SEM) : cousin germain selon registre d'état civil consulté.", pertinent:true,  signal:"Lien familial entre vendeur et administrateur SEM" },
      { icon:"ti-file-text",     label:"Facture honoraires Mme Ruiz",           contenu:"Honoraires négociation foncière : 28 000€ HT. Prestation : « conseil et intermédiation ». Aucun rapport écrit joint. Aucun livrable formalisé.", pertinent:false, signal:null },
      { icon:"ti-clipboard-list",label:"PV du dernier conseil d'administration",contenu:"Point 7 — acquisition foncière Zone Nord : présenté par Mme Ruiz. Délibération approuvée à l'unanimité. M. Aubert a participé au vote.", pertinent:false, signal:null },
    ],
    questions: [
      { txt: "Nous avons besoin d'une évaluation officielle des Domaines avant toute décision d'achat." },
      { txt: "Le lien entre le vendeur et notre administrateur doit être déclaré au conseil." },
      { txt: "Votre facture nécessite un livrable écrit détaillé — c'est notre procédure standard." },
      { txt: "Je dois suspendre cette acquisition et en informer notre déontologue." },
    ],
    actions: [
      { txt: "Demander une évaluation officielle des Domaines" },
      { txt: "Alerter le déontologue sur le conflit d'intérêts potentiel" },
      { txt: "Refuser la facture sans livrable écrit" },
      { txt: "Valider l'acquisition pour profiter du prix bas" },
    ],
    combos: {
      questions: { good: '0,3', warn: '0,2', bad: '1,2' },
      actions:   { good: '0,1', warn: '0,2', bad: '2,3' },
    },
    analysereflexe: {
      verdictRapide: {
        good: "Double protection activée — évaluation officielle et déontologue alerté. Irréprochable.",
        warn: "Bonne réaction mais la protection n'est pas complète sur le conflit d'intérêts.",
        bad:  "Des angles morts critiques exposent la SEM à une prise illégale d'intérêts. Voyez l'analyse.",
      },
      questions: {
        0: { pertinent: true,  pourquoi: "Exiger une évaluation officielle des Domaines avant toute signature est la règle légale pour toute acquisition foncière publique. Impossible de s'en passer.", alternative: null },
        1: { pertinent: false, pourquoi: "Demander la déclaration au CA est juste mais insuffisant — la procédure doit être suspendue avant toute décision, pas seulement déclarée.", alternative: "Q4 — Suspendre ET alerter le déontologue crée une double protection complète." },
        2: { pertinent: false, pourquoi: "Demander une facture détaillée est une bonne pratique comptable mais ne règle pas le problème de fond du conflit d'intérêts sur l'acquisition.", alternative: "Q1 — L'évaluation Domaines est la priorité légale sur toute acquisition foncière." },
        3: { pertinent: true,  pourquoi: "Suspendre ET alerter le déontologue crée une double protection. L'une sans l'autre serait incomplète face à un conflit d'intérêts potentiel.", alternative: null },
      },
      actions: {
        0: { pertinent: true,  pourquoi: "L'évaluation France Domaines est la référence légale pour toute acquisition foncière publique. Sans elle, l'acquisition est juridiquement contestable.", alternative: null },
        1: { pertinent: true,  pourquoi: "Le conflit d'intérêts de l'administrateur doit être déclaré formellement. Le déontologue force le déport du vote et protège la SEM.", alternative: null },
        2: { pertinent: false, pourquoi: "Refuser la facture sans livrable est une bonne pratique comptable mais secondaire — le problème prioritaire est le conflit d'intérêts sur l'acquisition.", alternative: "A2 — Alerter le déontologue règle le problème de fond avant la question de facture." },
        3: { pertinent: false, pourquoi: "Le prix bas ne justifie pas de s'exposer à une prise illégale d'intérêts. La chambre régionale des comptes n'est pas sensible à cet argument.", alternative: "A1 — L'évaluation Domaines protège la SEM et peut confirmer que le prix est justifié." },
      },
      regleOr: "Prix bas ne veut pas dire bonne affaire. Évaluation Domaines obligatoire. Conflit d'intérêts = déport obligatoire.",
    },
  },

  // Affaire 8 — Urgence Fin de Mois (ch=7)
  7: {
    context: "M. Bonnet demande une avance de 40 000€ non prévue au contrat et a changé son RIB il y a 3 jours.",
    documents: [
      { icon:"ti-building",  label:"Historique RIB fournisseur",  contenu:"RIB habituel : FR76 1234 — Crédit Mutuel. Nouveau RIB reçu par mail il y a 3 jours : FR76 9876 — banque en ligne. Validation : aucune trace.", pertinent:true,  signal:"Changement de RIB par mail, non vérifié, banque différente" },
      { icon:"ti-file-text", label:"Contrat M. Bonnet",           contenu:"Contrat signé : paiement à 45 jours fin de mois. Aucune clause d'avance prévue. Toute dérogation nécessite avenant signé par le DAF et le DG.", pertinent:true,  signal:"Avance non prévue au contrat — dérogation sans avenant" },
      { icon:"ti-mail",      label:"Mail de M. Bonnet",           contenu:"« Situation critique — mon fournisseur menace de bloquer mes livraisons avant votre audit de vendredi si je ne régularise pas. J'ai besoin des 40 000€ avant demain matin. »", pertinent:false, signal:null },
      { icon:"ti-calendar",  label:"Planning audit interne",       contenu:"Audit comptabilité fournisseurs prévu vendredi 9h. Périmètre : tous les virements du trimestre supérieurs à 10 000€.", pertinent:false, signal:null },
    ],
    questions: [
      { txt: "Notre contrat ne prévoit pas d'avance — nous ne pouvons pas déroger sans avenant signé." },
      { txt: "Je dois vérifier ce changement de RIB par téléphone à votre numéro officiel." },
      { txt: "Un avenant nécessite la signature du DAF et du DG — je vais les contacter." },
      { txt: "Pouvez-vous nous fournir un justificatif de ce changement de RIB ?" },
    ],
    actions: [
      { txt: "Suspendre tout virement jusqu'à vérification du RIB" },
      { txt: "Alerter la direction financière et le service conformité" },
      { txt: "Valider l'avance pour débloquer la livraison avant l'audit" },
      { txt: "Vérifier le RIB par téléphone officiel avant tout virement" },
    ],
    combos: {
      questions: { good: '0,1', warn: '0,2', bad: '2,3' },
      actions:   { good: '0,3', warn: '0,1', bad: '1,2' },
    },
    analysereflexe: {
      verdictRapide: {
        good: "Gel immédiat, vérification au bon numéro — les deux réflexes anti-fraude au RIB activés.",
        warn: "Bonne réaction mais un angle mort subsiste dans la vérification.",
        bad:  "Des réflexes critiques manquent face à une tentative de fraude probable. Voyez l'analyse.",
      },
      questions: {
        0: { pertinent: true,  pourquoi: "Rappeler clairement que le contrat ne prévoit pas d'avance est la position de principe indiscutable. Elle est tracée et protège le responsable finance.", alternative: null },
        1: { pertinent: true,  pourquoi: "Vérifier le RIB par téléphone officiel est LE réflexe anti-fraude numéro 1. Toujours au numéro du contrat, jamais au numéro fourni dans le mail.", alternative: null },
        2: { pertinent: false, pourquoi: "Un avenant est la bonne procédure mais prend du temps — ici l'urgence réelle est la vérification du RIB suspect, pas la procédure d'avenant.", alternative: "Q2 — Vérifier le RIB par téléphone officiel est la priorité de sécurité immédiate." },
        3: { pertinent: false, pourquoi: "Demander un justificatif par mail n'est pas suffisant — un fraudeur peut fournir un faux document. La vérification doit être vocale et au numéro officiel.", alternative: "Q2 — Appeler le numéro officiel du contrat, pas celui fourni dans le mail suspect." },
      },
      actions: {
        0: { pertinent: true,  pourquoi: "Aucun virement sur un RIB non vérifié. C'est la règle absolue. La livraison peut attendre — la fraude ne peut pas.", alternative: null },
        1: { pertinent: false, pourquoi: "Alerter la direction est utile mais secondaire — d'abord suspendre et vérifier le RIB, ensuite alerter dans la chaîne hiérarchique.", alternative: "A4 — Vérifier le RIB au numéro officiel est la priorité immédiate." },
        2: { pertinent: false, pourquoi: "Valider pour débloquer avant l'audit est exactement le type de pression qui précède les fraudes. L'urgence est souvent fabriquée.", alternative: "A1 — Suspendre tout virement. La livraison peut attendre, la fraude ne peut pas." },
        3: { pertinent: true,  pourquoi: "Appeler le numéro officiel du contrat — pas celui du mail — est la seule vérification valide. Un fraudeur ne peut pas intercepter cet appel.", alternative: null },
      },
      regleOr: "Changement de RIB = alerte rouge. Vérification obligatoire au numéro officiel du contrat. Zéro exception, zéro urgence qui tienne.",
    },
  },

  // Affaire 9 — Opération Prestige (ch=8)
  8: {
    context: "M. Fontaine, maire et président du club de tennis, suggère qu'un don au club faciliterait l'obtention du permis.",
    documents: [
      { icon:"ti-building",  label:"Fiche M. Fontaine",              contenu:"M. Fontaine — maire depuis dix-huit ans, président du TC Villenord depuis 2008. La mairie est l'autorité compétente pour instruire notre permis de construire.", pertinent:true,  signal:"Double casquette : maire instructeur + président de l'association bénéficiaire" },
      { icon:"ti-coin",      label:"Budget TC Villenord",             contenu:"Recettes annuelles : 95 000€. Déficit actuel : 28 000€. Recherche active de sponsor depuis janvier. Rénovation des courts estimée à 50 000€.", pertinent:true,  signal:"Association en déficit — contexte de la demande de don" },
      { icon:"ti-calendar",  label:"Dossier permis de construire",    contenu:"Dépôt initial : huit semaines. Statut : instruction en cours. Objection reçue : étude d'impact insuffisante. Délai légal d'instruction : deux mois.", pertinent:false, signal:null },
      { icon:"ti-file-text", label:"Charte mécénat SEM",              contenu:"Tout mécénat ou sponsoring vers une association doit être validé par le CA. Montant max sans CA : 5 000€. Délai d'instruction : 3 semaines.", pertinent:false, signal:null },
    ],
    questions: [
      { txt: "Tout partenariat financier avec une collectivité est strictement séparé de nos demandes administratives." },
      { txt: "Un don supérieur à 150€ à un élu doit être déclaré à la HATVP — êtes-vous prêt à le faire ?" },
      { txt: "Je dois mettre fin à cet échange et passer par les voies officielles." },
      { txt: "Notre demande de permis sera instruite selon les procédures légales — sans contrepartie." },
    ],
    actions: [
      { txt: "Alerter le déontologue de cette conversation" },
      { txt: "Documenter cet échange dans un mémo daté et signé" },
      { txt: "Accepter de sponsoriser le club pour débloquer le permis" },
      { txt: "Compléter notre dossier de permis et le redéposer officiellement" },
    ],
    combos: {
      questions: { good: '2,3', warn: '0,3', bad: '0,1' },
      actions:   { good: '0,1', warn: '1,3', bad: '2,3' },
    },
    analysereflexe: {
      verdictRapide: {
        good: "Contact coupé, échange documenté, déontologue alerté — triple protection activée.",
        warn: "Bonne orientation mais la protection contre M. Fontaine n'est pas totalement sécurisée.",
        bad:  "Ces réflexes exposent la SEM à une accusation de corruption d'élu. Voyez l'analyse.",
      },
      questions: {
        0: { pertinent: false, pourquoi: "Rappeler la séparation est juste mais insuffisant — cela laisse la porte ouverte à une discussion sur un futur mécénat.", alternative: "Q3 — Mettre fin à l'échange informel immédiatement est la posture la plus protectrice." },
        1: { pertinent: false, pourquoi: "Mentionner la HATVP directement peut être perçu comme une menace et braquer M. Fontaine sans créer de protection supplémentaire pour la SEM.", alternative: "Q4 — Rappeler que le permis sera instruit sans contrepartie ferme la porte sans confrontation." },
        2: { pertinent: true,  pourquoi: "Mettre fin à l'échange informel et passer par les voies officielles est la posture la plus protectrice. Elle ne laisse aucune ambiguïté.", alternative: null },
        3: { pertinent: true,  pourquoi: "Rappeler que la demande sera instruite légalement ferme définitivement la porte à toute interprétation de complaisance.", alternative: null },
      },
      actions: {
        0: { pertinent: true,  pourquoi: "Le déontologue doit être informé de toute conversation où un élu conditionne implicitement une décision administrative. C'est non-négociable.", alternative: null },
        1: { pertinent: true,  pourquoi: "Un mémo daté et signé conservé est la preuve irréfutable si la situation est contestée ou fait l'objet d'une enquête.", alternative: null },
        2: { pertinent: false, pourquoi: "50 000€ à une association d'élu pendant une procédure administrative = corruption active. La clause mécénat ne protège pas de cette qualification.", alternative: "A1 — Alerter le déontologue immédiatement est le seul réflexe défendable." },
        3: { pertinent: false, pourquoi: "Redéposer officiellement est une bonne démarche mais insuffisante seule — la conversation avec M. Fontaine doit être documentée et signalée.", alternative: "A2 — Documenter l'échange : la trace qui protège si M. Fontaine conteste plus tard." },
      },
      regleOr: "Mécénat + procédure en cours = conflit d'intérêts immédiat. Toujours valider avec le déontologue avant tout versement à une collectivité ou association d'élu.",
    },
  },

  // Affaire 10 — Contrat à Tout Prix (ch=9)
  9: {
    context: "Un intermédiaire propose d'obtenir les critères de notation confidentiels de vos concurrents pour 8 000€.",
    documents: [
      { icon:"ti-coin",      label:"Proposition de Mme Deschamps",          contenu:"« Pour 8 000€, je peux vous obtenir les grilles de notation confidentielles des deux autres candidats et les retours informels de la commission. »", pertinent:true,  signal:"Offre d'accès à des informations confidentielles — corruption active" },
      { icon:"ti-chart-bar", label:"Notre position dans l'appel d'offres",  contenu:"Marché estimé : 2,4 M€. Nos points faibles identifiés légalement : délai de livraison (-8 pts) et références secteur public (-6 pts). 15 jours pour amender.", pertinent:false, signal:null },
      { icon:"ti-file-text", label:"Casier judiciaire Mme Deschamps",       contenu:"Condamnation en 2019 : 18 mois avec sursis pour recel de secret professionnel dans le cadre d'un appel d'offres public. Peine purgée.", pertinent:true,  signal:"Antécédent judiciaire pour des faits identiques" },
      { icon:"ti-building",  label:"Règlement de l'appel d'offres",         contenu:"Accès aux offres concurrentes interdit jusqu'à attribution. Toute tentative d'accès entraîne disqualification et signalement au parquet.", pertinent:false, signal:null },
    ],
    questions: [
      { txt: "Ce que vous proposez constitue un délit — je dois mettre fin à cet échange immédiatement." },
      { txt: "Tout contact avec la commission d'évaluation est interdit par le règlement de consultation." },
      { txt: "Je vais signaler cette proposition à notre direction juridique." },
      { txt: "Notre offre doit être améliorée sur ses mérites — nous avons 15 jours pour amender notre dossier." },
    ],
    actions: [
      { txt: "Refuser catégoriquement et quitter l'échange" },
      { txt: "Alerter la direction juridique et le déontologue" },
      { txt: "Améliorer notre offre technique sur les points faibles légaux" },
      { txt: "Accepter pour maximiser nos chances de gagner" },
    ],
    combos: {
      questions: { good: '0,2', warn: '1,2', bad: '1,3' },
      actions:   { good: '0,1', warn: '0,2', bad: '2,3' },
    },
    analysereflexe: {
      verdictRapide: {
        good: "Refus immédiat et signalement complet — les deux réflexes face à une corruption caractérisée.",
        warn: "Bonne réaction mais la chaîne de signalement n'est pas complète.",
        bad:  "Ces réflexes vous exposent à une accusation de corruption active. Voyez l'analyse.",
      },
      questions: {
        0: { pertinent: true,  pourquoi: "Le refus immédiat et sans nuance est la seule position défendable. Toute hésitation ou question supplémentaire peut être interprétée comme un intérêt.", alternative: null },
        1: { pertinent: false, pourquoi: "Rappeler le règlement est juste mais insuffisant — la tentative de corruption doit être signalée, pas seulement refusée calmement.", alternative: "Q3 — Signaler à la direction juridique crée la trace et déclenche la protection institutionnelle." },
        2: { pertinent: true,  pourquoi: "Signaler à la direction juridique protège la SEM et peut déclencher une procédure contre Mme Deschamps et ses pratiques systémiques.", alternative: null },
        3: { pertinent: false, pourquoi: "Améliorer l'offre après avoir reçu des prix concurrents constitue une utilisation de données confidentielles — même involontaire.", alternative: "Q1 — Refus catégorique et immédiat : chaque échange supplémentaire crée un risque." },
      },
      actions: {
        0: { pertinent: true,  pourquoi: "Couper tout contact immédiatement est la position la plus protectrice. Chaque échange supplémentaire avec Mme Deschamps crée un risque supplémentaire.", alternative: null },
        1: { pertinent: true,  pourquoi: "Le signalement complet protège la SEM et peut déclencher une enquête sur Mme Deschamps et ses pratiques systémiques envers d'autres entreprises.", alternative: null },
        2: { pertinent: false, pourquoi: "Améliorer l'offre légalement est toujours une bonne idée, mais pas après avoir entendu des prix concurrentiels — même si on a refusé de les utiliser.", alternative: "A1 — Quitter l'échange immédiatement. Améliorer l'offre viendra dans un second temps." },
        3: { pertinent: false, pourquoi: "Accepter constitue une corruption active caractérisée. La chambre régionale des comptes et le parquet ne sont pas sensibles à l'argument de la pression commerciale.", alternative: "A2 — Alerter direction juridique et déontologue : la seule position défendable." },
      },
      regleOr: "Face à une tentative de corruption caractérisée : refus immédiat, sortie de l'échange, signalement complet. Dans cet ordre, sans exception.",
    },
  },

  // Affaire 11 — Le Contrat de Confiance (ch=10) — BONUS Maintenance
  10: {
    context: "ProTech vous a envoyé du matériel d'outillage (4 200€) sans commande de votre part. Le contrat de maintenance arrive à renouvellement dans 3 semaines. Votre chef de service attend votre décision.",
    documents: [
      { icon:"ti-package",   label:"Bon de livraison ProTech",       contenu:"Outillage professionnel — valeur 4 200€ HT. Destinataire : Julien [votre nom] — Service Maintenance SEM Horizon. Expéditeur : ProTech Maintenance SARL. Aucune commande interne correspondante.", pertinent:true,  signal:"Livraison non commandée — valeur 52x le seuil autorisé (80€)" },
      { icon:"ti-mail",      label:"Mails du prédécesseur",          contenu:"Trois échanges sur les trois derniers renouvellements : « comme d'habitude », « même chose que l'an dernier », « merci pour votre compréhension ». Aucun appel d'offres lancé à ces périodes.", pertinent:true,  signal:"Schéma répété sur 3 renouvellements sans procédure" },
      { icon:"ti-file-text", label:"Règlement cadeaux SEM",          contenu:"Seuil d'acceptation des cadeaux et avantages : 80€ par personne et par événement. Tout dépassement doit être déclaré au déontologue. Cadeaux destinés à l'équipe : même règle.", pertinent:false, signal:null },
      { icon:"ti-building",  label:"Contrat ProTech en cours",       contenu:"Contrat maintenance lignes de tri — 380 000€/an — signé en 2018. Renouvellement prévu dans 21 jours. Durée minimale des appels d'offres comparables : 30 jours.", pertinent:false, signal:null },
    ],
    questions: [
      { txt: "M. Vasseur, je dois vous informer que je ne peux pas accepter cet envoi dans le contexte actuel. Je vous demande d'annuler la livraison par écrit." },
      { txt: "Vous avez d'autres clients SEM à qui vous proposez ce type de geste ?" },
      { txt: "Je vais devoir informer notre déontologue de cette situation avant tout renouvellement." },
      { txt: "C'est très généreux mais peut-être que vous pourriez le réorienter vers une association ?" },
    ],
    actions: [
      { txt: "Refuser la livraison par écrit et conserver une copie du refus" },
      { txt: "Transmettre les mails du prédécesseur au déontologue" },
      { txt: "Consulter un collègue de confiance avant de décider" },
      { txt: "Demander au chef de service de gérer la situation avec Vasseur" },
    ],
    combos: {
      questions: { good: '0,2', warn: '0,1', bad: '1,3' },
      actions:   { good: '0,1', warn: '0,2', bad: '2,3' },
    },
    analysereflexe: {
      verdictRapide: {
        good: "Refus documenté et signalement complet — la double protection qui vous met à l'abri.",
        warn: "Bonne orientation mais un angle mort subsiste dans votre protection.",
        bad:  "Ces réflexes vous exposent à une complicité de favoritisme. Voyez l'analyse.",
      },
      questions: {
        0: { pertinent: true,  pourquoi: "Refuser par écrit et explicitement crée une trace irréfutable. C'est la seule position défendable face à une tentative de corruption passive — même si l'intention affichée est un 'simple geste'.", alternative: null },
        1: { pertinent: false, pourquoi: "Cette question n'apporte aucune protection juridique et peut donner l'impression que vous cherchez à évaluer l'étendue du problème plutôt qu'à le résoudre.", alternative: "Q3 — Informer le déontologue avant le renouvellement crée un contexte de transparence totale." },
        2: { pertinent: true,  pourquoi: "Informer le déontologue avant le renouvellement crée un contexte de transparence totale. C'est le réflexe qui vous protège si la situation dégénère — et qui empêche ProTech d'interpréter votre silence comme un accord tacite.", alternative: null },
        3: { pertinent: false, pourquoi: "Proposer de rediriger le cadeau vers une association peut sembler élégant mais ne règle pas le problème de fond. Un cadeau interdit reste interdit quelle que soit sa destination finale.", alternative: "Q1 — Refuser par écrit : c'est la seule position juridiquement défendable." },
      },
      actions: {
        0: { pertinent: true,  pourquoi: "Refuser par ÉCRIT est crucial. Une décision verbale n'existe pas juridiquement. Le document de refus daté vous protège face à toute interprétation ultérieure.", alternative: null },
        1: { pertinent: true,  pourquoi: "Transmettre les mails du prédécesseur n'est pas trahir un collègue — c'est empêcher que les pratiques passées vous engloutissent à votre tour. Le dispositif Sapin II vous protège.", alternative: null },
        2: { pertinent: false, pourquoi: "Consulter un collègue dilue la responsabilité et crée un risque de fuite d'information. Le déontologue est l'interlocuteur prévu pour ces situations — pas un pair.", alternative: "A1 — Refuser par écrit : c'est la priorité absolue avant toute autre démarche." },
        3: { pertinent: false, pourquoi: "Déléguer à votre chef de service dans une situation où il est déjà sous pression de Vasseur, c'est l'exposer à une complicité qu'il ne demandait peut-être pas — et vous priver de toute protection.", alternative: "A2 — Transmettre les mails au déontologue : la trace qui vous protège si l'audit remonte." },
      },
      regleOr: "Un cadeau offert juste avant un renouvellement de contrat n'est jamais gratuit. Et protéger un prédécesseur en taisant des pratiques irrégulières vous rend solidaire de ces pratiques.",
    },
  },

  // Affaire 13 — Le Tampon qui Coûte Cher (ch=12, index dans CHAPTERS[])
  12: {
    context: "Mme Andrieux a identifié deux non-conformités majeures ISO 45001. Elle propose de les qualifier en mineures si vous lui transmettez deux contacts commerciaux. Le certificat expire dans six semaines. Trois marchés à 4,2M€ sont en jeu.",
    documents: [
      { icon:"ti-file-text",     label:"Rapport préliminaire",       contenu:"NC1 : rapport Brahim clôturé en 11 jours (norme : 30 jours min.). NC2 : plan d'actions correctives secteur 3 — 3 points ouverts depuis 91 jours. Qualification : 2 non-conformités majeures.", pertinent:true,  signal:"Deux majeures = audit suspendu automatiquement" },
      { icon:"ti-certificate",   label:"Accréditation COFRAC",       contenu:"L'accréditation COFRAC impose l'impartialité totale de l'auditeur. Toute sollicitation d'avantage en échange d'une qualification favorable est une violation du référentiel. Le COFRAC dispose d'un dispositif de signalement.", pertinent:true,  signal:"Dispositif de signalement COFRAC disponible" },
      { icon:"ti-building",      label:"Clauses marchés publics",    contenu:"Les trois marchés en cours contiennent une clause explicite de maintien de la certification ISO 45001. Caducité automatique en cas de non-renouvellement dans les délais contractuels.", pertinent:false, signal:null },
      { icon:"ti-users",         label:"Registre des contacts QHSE", contenu:"Répertoire des directeurs QHSE du réseau SEM régional. Métropole Sud (M. Faure), Territoire Propre 83 (Mme Leclercq). Contacts professionnels courants.", pertinent:false, signal:null },
    ],
    questions: [
      { txt: "« Mme Andrieux, ce que vous proposez ne m'est pas possible. Je vais devoir signaler cet échange. »" },
      { txt: "« Pouvez-vous me remettre vos observations préliminaires par écrit, avec la référence normative exacte de chaque non-conformité ? »" },
      { txt: "« Ces deux contacts — dans quel secteur travaillent-ils exactement ? »" },
      { txt: "« Combien de temps vous faudrait-il pour rédiger le rapport final si on régularise la documentation ce soir ? »" },
    ],
    actions: [
      { txt: "Documenter la conversation par écrit immédiatement après le départ de Mme Andrieux" },
      { txt: "Informer la direction générale et le déontologue de la tentative" },
      { txt: "Appeler un homologue QHSE pour avoir son avis avant de décider" },
      { txt: "Demander à Mme Andrieux de reformuler sa proposition par mail pour avoir une trace" },
    ],
    combos: {
      questions: { good: '0,1', warn: '0,3', bad: '2,3' },
      actions:   { good: '0,1', warn: '0,2', bad: '2,3' },
    },
    analysereflexe: {
      verdictRapide: {
        good: "Posture irréprochable — vous avez coupé court à la tentative et activé les bonnes protections.",
        warn: "Bonne orientation globale, mais un angle mort subsiste dans votre dispositif de protection.",
        bad:  "Ces réflexes vous ont exposé(e) à une corruption active sans protection juridique. Voyez l'analyse.",
      },
      questions: {
        0: { pertinent: true,  pourquoi: "Annoncer clairement qu'on va signaler coupe court à toute négociation et constitue la position légalement protectrice. C'est aussi le signal que vous n'êtes pas une cible facile.", alternative: null },
        1: { pertinent: true,  pourquoi: "Demander les observations par écrit avec références normatives exactes est un réflexe professionnel légitime — et crée une trace officielle des non-conformités avant toute manipulation de leur qualification.", alternative: null },
        2: { pertinent: false, pourquoi: "Cette question sous-entend que vous envisagez de transmettre les contacts. Elle engage votre position sans même que vous l'ayez décidé — et peut être interprétée comme une acceptation implicite.", alternative: "Q1 — Annoncer le signalement : c'est la position qui vous protège légalement dès le premier échange." },
        3: { pertinent: false, pourquoi: "Cette question cherche une solution de régularisation rapide — utile mais secondaire. Elle ne répond pas à la proposition illicite qui vient d'être faite et laisse la tentative sans réponse claire.", alternative: "Q2 — Demander les observations par écrit crée une trace officielle et recentre sur la procédure normative." },
      },
      actions: {
        0: { pertinent: true,  pourquoi: "Documenter immédiatement crée une preuve datée et non manipulable. Date, heure, verbatim de la conversation — c'est votre première ligne de défense si la situation dégénère.", alternative: null },
        1: { pertinent: true,  pourquoi: "Informer la DG et le déontologue déclenche la procédure officielle et vous retire la décision des mains — ce qui vous protège personnellement en cas de mise en cause ultérieure.", alternative: null },
        2: { pertinent: false, pourquoi: "Consulter un homologue expose à une fuite d'information et sort la décision du cadre confidentiel où elle doit rester. Le déontologue est l'interlocuteur prévu — pas un pair.", alternative: "A1 — Documenter d'abord : la trace écrite est votre priorité absolue." },
        3: { pertinent: false, pourquoi: "Demander une trace écrite à la personne corrompue est une erreur — elle ne produira jamais un mail incriminant. Et cette démarche peut être interprétée comme une négociation déguisée.", alternative: "A2 — Informer le déontologue : c'est lui qui gère, pas vous seul(e)." },
      },
      regleOr: "Un certificat falsifié n'est pas une protection — c'est une bombe à retardement. Le jour où un accident survient dans une zone 'certifiée conforme', l'enquête remonte toujours à l'audit.",
    },
  },

  // Affaire 12 — Le Détour de Nuit (ch=11, index dans CHAPTERS[])
  11: {
    context: "Kévin a accepté 50€ par sortie pour ignorer les bacs Garriga. Vous avez vu les sacs suspects. Kévin vous demande de ne rien dire.",
    documents: [
      { icon:"ti-cash",       label:"Note de frais de tournée",           contenu:"Tournée du soir — secteur Garriga — durée : 3h12. Kilomètres déclarés : 48 km. Bacs collectés déclarés : 22. Aucune anomalie mentionnée dans le rapport de Kévin.", pertinent:true,  signal:"Le rapport de Kévin ne mentionne aucune anomalie malgré les sacs suspects" },
      { icon:"ti-file-text",  label:"Rapport d'incident signalé",          contenu:"Aucun signalement d'incident enregistré dans le système pour ce secteur sur les 30 derniers jours. Dernier signalement : dépôt sauvage signalé par un riverain il y a 6 semaines.", pertinent:true,  signal:"Absence de signalements alors que des anomalies sont visibles" },
      { icon:"ti-id-badge",   label:"Procédure signalement interne",        contenu:"Tout agent constatant une anomalie (dépôt suspect, comportement inhabituel, irrégularité de collecte) doit consigner par écrit et remonter à son responsable d'exploitation dans les 24h.", pertinent:false, signal:null },
      { icon:"ti-alert",      label:"Réglementation déchets dangereux",     contenu:"Le dépôt ou l'acceptation de déchets non conformes engage la responsabilité pénale de l'agent et de son employeur. Peine maximale : 2 ans + 75 000€ d'amende (art. L541-46 CE).", pertinent:false, signal:null },
    ],
    questions: [
      { txt: "« Kévin, je ne peux pas couvrir ça. Ce que tu décris est une infraction grave pour toi et pour la SEM. »" },
      { txt: "« Combien de fois tu l'as fait depuis le début ? »" },
      { txt: "« Je vais devoir signaler ce que j'ai vu à mon responsable d'exploitation dès ce soir. »" },
      { txt: "« Tu sais ce qu'il y a dans ces sacs exactement ? »" },
    ],
    actions: [
      { txt: "Consigner par écrit les dates, heures et anomalies observées" },
      { txt: "Signaler immédiatement à son responsable d'exploitation" },
      { txt: "Retourner sur le site Garriga pour prendre des photos avant de signaler" },
      { txt: "Donner 24h à Kévin pour se signaler lui-même" },
    ],
    combos: {
      questions: { good: '0,2', warn: '0,3', bad: '1,3' },
      actions:   { good: '0,1', warn: '0,3', bad: '2,3' },
    },
    analysereflexe: {
      verdictRapide: {
        good: "Signalement documenté et immédiat — la double protection qui vous met à l'abri et protège la SEM.",
        warn: "Bonne intention mais un angle mort subsiste dans votre démarche.",
        bad:  "Ces réflexes vous exposent à une complicité par omission. Voyez l'analyse.",
      },
      questions: {
        0: { pertinent: true,  pourquoi: "Énoncer clairement qu'on ne peut pas couvrir la situation est la position de principe. Elle protège autant Kévin que vous — en mettant les choses à plat immédiatement.", alternative: null },
        1: { pertinent: false, pourquoi: "Chercher l'étendue de la fraude avant de signaler fait perdre du temps et peut être interprété comme une tentative d'évaluer le risque pour vous couvrir.", alternative: "Q3 — Annoncer l'intention de signaler coupe court à toute tentative de négociation." },
        2: { pertinent: true,  pourquoi: "Annoncer clairement l'intention de signaler coupe court à toute tentative de négociation. C'est aussi la position qui vous protège légalement.", alternative: null },
        3: { pertinent: false, pourquoi: "Chercher à comprendre le contenu des sacs est compréhensible mais secondaire. Le signalement doit précéder l'investigation personnelle.", alternative: "Q1 — Énoncer clairement le refus de couvrir : c'est la position de principe qui vous protège." },
      },
      actions: {
        0: { pertinent: true,  pourquoi: "Consigner par écrit avant de signaler transforme vos observations en preuves. Date, heure, lieu, comportement observé — tout compte dans une procédure.", alternative: null },
        1: { pertinent: true,  pourquoi: "Signaler immédiatement à son responsable hiérarchique est le réflexe fondamental. Pas d'investigation personnelle — c'est le rôle des autorités.", alternative: null },
        2: { pertinent: false, pourquoi: "Retourner seul sur le site pour collecter des preuves vous expose personnellement et peut compromettre l'enquête officielle.", alternative: "A1 — Consigner par écrit : vos notes d'observation suffisent à déclencher l'inspection." },
        3: { pertinent: false, pourquoi: "Donner du temps à Kévin pour se signaler lui-même revient à lui donner le temps de fuir ou de détruire des preuves.", alternative: "A2 — Signaler immédiatement : c'est vous qui devez agir, pas attendre que Kévin le fasse." },
      },
      regleOr: "Un collègue qui prend de l'argent pour détourner sa mission vous met en danger autant que lui. La loyauté envers un collègue ne peut pas l'emporter sur la responsabilité envers la collectivité.",
    },
  },
};
