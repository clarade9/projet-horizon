const CHAPTERS=[
  // ═══════════════════════════════════════
  // CHAPITRE 1 — Le CV sur le dessus de la pile
  // ═══════════════════════════════════════
  { num:"Affaire 1",name:"Le CV sur le dessus de la pile",sub:"RH & Recrutement",dureeMin:4,
    sc:"bureau1",playerRole:"Responsable Recrutement",
    context:{eye:"📁 Affaire 1",title:"Le recrutement du chef de site",body:`<strong>Responsable Recrutement.</strong> Votre bureau est inondé de CV — le projet "Horizon" nécessite un Responsable d'Exploitation expert. Trois profils solides sont en cours d'examen.<br><br><em>M. Aubert, administrateur de la SEM et élu influent, entre sans frapper. Il a un café à la main et un sourire trop large.</em>`},
    dialogue:[
      {sp:"Narrateur",ch:null,sc:"bureau1",txt:"<em>M. Aubert s'est installé dans votre bureau et il n'a pas l'intention de le quitter sans votre réponse.</em>"},
      {sp:"M. Aubert",ch:{css:"c-aubert",em:"🧑‍💼",nm:"M. Aubert — Administrateur"},sc:"bureau1",txt:"<em>« Alors {prenom}, comment ça se passe pour vous en ce moment ? On se voit si peu ces temps-ci. »</em>"},
      {sp:"Vous",ch:null,sc:"bureau1",txt:"<em>« Bien, merci. Et vous, Monsieur Aubert ? Vous semblez de bonne humeur ce matin. »</em>"},
      {sp:"M. Aubert",ch:{css:"c-aubert",em:"🧑‍💼",nm:"M. Aubert"},sc:"bureau1",txt:"(Reposant son café sur le coin du bureau) <em>« Je suis aux anges, oui. Ce soir, c'est la remise de diplôme de mon neveu. Cinq ans qu'on attend ça dans la famille. »</em>"},
      {sp:"Vous",ch:null,sc:"bureau1",txt:"<em>« C'est une belle soirée en perspective. Toutes mes félicitations à lui. »</em>"},
      {sp:"M. Aubert",ch:{css:"c-aubert",em:"🧑‍💼",nm:"M. Aubert"},sc:"bureau1",txt:"(S'avançant, posant son café) <em>« C'est d'ailleurs pour ça que je passais. Lucas — c'est son prénom — cherche sa première vraie opportunité. Ce poste de Responsable d'Exploitation pour Horizon, c'est exactement ce qu'il lui faut. »</em>"},
      {sp:"Vous",ch:null,sc:"bureau1",txt:"<em>« Ce poste demande une expertise terrain solide. J'ai trois candidats avec dix ans d'expérience en valorisation et la procédure de recrutement est lancée. »</em>"},
      {sp:"M. Aubert",ch:{css:"c-aubert",em:"🧑‍💼",nm:"M. Aubert"},sc:"bureau1",txt:"<em>« Lucas a fait une école de commerce, il sait manager, il a les dents longues. L'opérationnel, c'est six mois sur le terrain. Vous avez formé pire que lui. »</em>"},
      {sp:"Vous",ch:null,sc:"bureau1",txt:"<em>« Ses qualités ne changent pas la règle, Monsieur Aubert. Tout candidat passe par la même procédure. »</em>"},
      {sp:"M. Aubert",ch:{css:"c-aubert",em:"🧑‍💼",nm:"M. Aubert"},sc:"bureau1",txt:"(Marquant une pause, changeant de ton) <em>« Je vois. »</em> (Un temps.) <em>« Dites-moi, le vote des subventions pour votre parc de bennes, c'est le 18. Ce genre de décision a besoin du bon contexte politique, si vous voyez ce que je veux dire. »</em>"},
      {sp:"Vous",ch:null,sc:"bureau1",txt:"<em>« Monsieur Aubert, je dois constituer un jury pluraliste. Je ne peux pas valider un profil en dehors de la procédure. »</em>"},
      {sp:"M. Aubert",ch:{css:"c-aubert",em:"🧑‍💼",nm:"M. Aubert"},sc:"bureau1",txt:"(Sans hausser le ton) <em>« Je ne vous demande pas de frauder. Je vous demande juste de mettre le bon CV sur le dessus de la pile. C'est le jury qui décide, pas vous. »</em>"},
      {sp:"M. Aubert",ch:{css:"c-aubert",em:"🧑‍💼",nm:"M. Aubert"},sc:"bureau1",txt:"(Reprenant son café pour partir) <em>« Lucas peut passer demain à 14h. Et le vote des bennes, c'est le 18. À vous de voir ce qui compte. »</em>"},
    ],
    clues:[
      {ic:"💻",label:"Votre ordinateur",sub:"Tableau de bord RH",title:"Tableau de bord des salaires",body:`Votre logiciel RH affiche le tableau des rémunérations du poste. La ligne est surlignée en jaune par la comptabilité — un marqueur de contrôle budgétaire. La prétention salariale de Lucas figure dans la colonne de droite.<br><br><em>Quelque chose ne semble pas correspondre à la grille habituelle pour ce type de poste.</em>`,alert:`Un mail de la DRH, resté sans réponse, rappelle les obligations légales concernant la composition des jurys pour les postes d'encadrement de ce niveau.`},
      {ic:"📋",label:"Dossier de Lucas",sub:"CV & diplômes",title:"Dossier de candidature — Lucas V.",body:`CV, lettres de recommandation, relevés de notes. Vous feuilletez les pages. Lucas a un parcours en école de commerce. Aucune mention d'une formation technique ou d'une expérience en milieu industriel.<br><br><em>L'un des diplômes porte un logo que vous ne reconnaissez pas — vous notez mentalement de vérifier son accréditation.</em>`,alert:`Les CV des trois autres candidats sont dans le tiroir. Le poste requiert une expertise opérationnelle en valorisation des déchets et en management d'équipe sur site.`},
      {ic:"📋",label:"Registre des déclarations d'intérêts",sub:"M. Aubert — Liens familiaux non déclarés",title:"Registre des déclarations d'intérêts — M. Aubert",body:`Le registre public des déclarations d'intérêts de M. Aubert ne mentionne aucun lien familial avec un candidat en cours d'évaluation à la SEM. Or, Lucas V. figure dans son arbre généalogique accessible en ligne comme son neveu direct.`,alert:`L'absence de déclaration de ce lien constitue en soi une irrégularité. Un administrateur de SEM est tenu de déclarer tout lien personnel avec un candidat à un poste de la structure, sous peine de <strong>prise illégale d'intérêts</strong>.`},
    ],
    invIntro:"Quelque chose dans ce bureau mérite votre attention avant de décider…",
    hotspots:[
      {x:27, y:48, w:15, h:17, label:"Votre ordinateur"},
      {x:20, y:57, w:13, h:13, label:"Dossier de Lucas"},
      {x:50, y:48, w:15, h:17, label:"Registre des déclarations d'intérêts"},
    ],
    pressureIntro:"M. Aubert revient vous voir. Il insiste. Il évoque le prochain conseil d'administration et votre budget de fonctionnement.",
    choices:[
      {desc:"Convier Lucas à un entretien exploratoire informel sans engagement, juste pour évaluer son potentiel. Si le jury confirme ensuite, le processus reste intact.",type:"bad",badge:"🔴 Échec",bc:"badge-bad",vTitle:"Prise illégale d'intérêts",vConsequence:`Le recrutement est acté. M. Aubert est ravi. Six mois plus tard, Lucas enchaîne les erreurs opérationnelles. Une inspection révèle l'absence de jury et le lien familial avec l'administrateur. La procédure est annulée et vous êtes convoqué(e) par le service juridique.`,vLegal:`<strong>Qualification :</strong> Favoriser un proche d'un administrateur sans processus objectif expose à la <strong>prise illégale d'intérêts</strong>. L'absence de jury pluraliste, le lien familial et l'avantage accordé constituent les trois éléments constitutifs de l'infraction.`,lc:"",gauges:{i:-40,p:-12,m:-32}},
      {desc:"Inviter M. Aubert à soumettre la candidature de Lucas via le portail officiel. S'il passe les étapes, le jury décidera en toute impartialité.",type:"warn",badge:"🟠 Risqué",bc:"badge-warn",vTitle:"Avantages injustifiés",vConsequence:`Lucas accepte. Les autres salariés commentent. Le CSE demande des explications sur la grille de rémunération. La DRH est embarrassée lors de l'audit RH annuel.`,vLegal:`<strong>Qualification :</strong> Un contrat avec une rémunération anormalement élevée ou des avantages dérogatoires injustifiés peut constituer un <strong>détournement de fonds</strong> au détriment de la SEM.`,lc:"warn",gauges:{i:-16,p:-4,m:-16}},
      {desc:"Informer M. Aubert par écrit que tout candidat recommandé par un administrateur fait l'objet d'une déclaration de conflit d'intérêts déposée au déontologue et que vous le faites maintenant.",type:"good",badge:"🟢 Succès",bc:"badge-good",vTitle:"Processus irréprochable",vConsequence:`Lucas échoue aux tests techniques. Un expert est recruté. M. Aubert boude, mais le processus est inattaquable. La chambre régionale des comptes ne trouvera rien à redire.`,vLegal:`<strong>Bonne pratique :</strong> Le jury pluraliste et la déclaration de lien d'intérêt protègent le responsable, la SEM et le projet. La traçabilité de la décision est la meilleure défense.`,lc:"good",gauges:{i:+20,p:+11,m:+20}},
    ],
    sos:{
      situation:"M. Aubert, administrateur de la SEM, vous demande de recruter son neveu sans passer par la procédure habituelle. Il évoque des contreparties politiques sur le vote du budget.",
      questions:["Cette décision pourrait-elle être justifiée publiquement si elle était révélée ?","Est-ce que je favorise quelqu'un en raison de son lien avec un élu plutôt que de ses compétences ?","Y a-t-il une procédure institutionnelle qui s'impose à moi ici, indépendamment des pressions ?"],
      reasoning:"Le droit de la fonction publique et les règles internes des SEM imposent un processus de recrutement objectif et traçable pour les postes d'encadrement. Avantager un candidat en raison de son lien avec un décideur, en contournant ce processus, peut constituer une prise illégale d'intérêts pour l'administrateur — et exposer le recruteur à une complicité. La question n'est pas de savoir si le candidat est compétent : c'est de savoir si le processus est irréprochable et documenté.",
      lawRef:{label:"Art. 432-12 CP — Prise illégale d'intérêts",url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006418679"},
    },
    recap:{
      risk:"Prise illégale d'intérêts",
      definition:"Un agent public prend un intérêt dans une affaire qu'il est chargé de gérer ou de contrôler. Même sans bénéfice personnel, la simple situation de conflit d'intérêts suffit à constituer l'infraction.",
      gestures:["Constituer un jury pluraliste et documenté pour tout recrutement d'encadrement","Déclarer par écrit tout lien personnel avec un candidat avant toute décision","Ne jamais subordonner une décision institutionnelle à une contrepartie politique"],
      realLife:"En 2019, le directeur d'une SEM recrute le fils d'un administrateur-élu à un poste de direction, sans jury et avec un salaire 30% au-dessus de la grille. L'audit interne remonte l'anomalie. L'administrateur est condamné à 18 mois avec sursis et une inéligibilité de 3 ans. La SEM doit annuler le contrat de travail.",
      jurisprudence:{
        titre:"Affaire du recrutement de Metz Métropole (2019)",
        resume:"Un directeur RH condamné à 18 mois avec sursis pour favoritisme après avoir orienté un recrutement vers le fils d'un administrateur-élu, sans respecter la procédure de jury indépendant.",
        source:"CA Nancy, ch. correctionnelle, 2019"
      },
    },
    microDecisions:[
      {
        situation:"M. Aubert vient d'entrer sans frapper. Il a un café à la main et son sourire habituel.",
        choices:[
          {letter:"A",desc:"« Monsieur Aubert ! Je vous prépare un café ? Asseyez-vous, on a le temps. »",reaction:{sp:"M. Aubert",ch:{css:"c-aubert",em:"🧑‍💼",nm:"M. Aubert — Administrateur"},txt:"(S'installant sur le coin du bureau) <em>« Ah, {prenom} ! C'est pour ça qu'on peut se parler franchement, entre nous… Justement, j'ai quelque chose à vous soumettre. »</em>"}},
          {letter:"B",desc:"« Bonjour Monsieur Aubert. Vous m'excusez, je suis en plein tri de dossiers. »",reaction:{sp:"M. Aubert",ch:{css:"c-aubert",em:"🧑‍💼",nm:"M. Aubert — Administrateur"},txt:"<em>« Je ne prends pas longtemps. »</em> (Il s'assoit quand même, légèrement moins à l'aise.)"}},
          {letter:"C",desc:"« Je vous consacre cinq minutes, Monsieur Aubert. Passons en salle de réunion — c'est plus approprié. »",reaction:{sp:"M. Aubert",ch:{css:"c-aubert",em:"🧑‍💼",nm:"M. Aubert — Administrateur"},txt:"(S'installant, souriant) <em>« Parfait. Alors voilà pourquoi je suis là… »</em> Il sort un CV et le pose devant vous comme s'il avait rendez-vous."}},
        ]
      },
      {
        situation:"En parlant, M. Aubert sort un CV de sa veste et le pose sur votre bureau. Il s'agit de Lucas, son neveu.",
        choices:[
          {letter:"A",desc:"« Je peux jeter un œil à son dossier… ça ne m'engage à rien. »",gauges:{i:-4,p:0,m:0},tint:true,reaction:{sp:"M. Aubert",ch:{css:"c-aubert",em:"🧑‍💼",nm:"M. Aubert — Administrateur"},txt:"(Souriant franchement) <em>« Je savais que vous étiez quelqu'un de raisonnable. Entre nous, on peut se parler. »</em>"}},
          {letter:"B",desc:"« Pour préserver l'équité du processus, je ne regarde aucun candidat en dehors de la procédure officielle. »",gauges:{i:0,p:0,m:0},tint:false,reaction:{sp:"M. Aubert",ch:{css:"c-aubert",em:"🧑‍💼",nm:"M. Aubert — Administrateur"},txt:"(Marquant une pause) <em>« Je vois. »</em>"},postReaction:[{sp:"M. Aubert",ch:{css:"c-aubert",em:"🧑‍💼",nm:"M. Aubert — Administrateur"},sc:"bureau1",txt:"(Changeant de registre, sortant des documents) <em>« Vous avez raison sur la procédure. Mais l'institutionnel ne se gère pas qu'en formulaires. »</em>"},{sp:"Narrateur",ch:null,sc:"bureau1",txt:"<em>Aubert a sorti des chiffres, des projections. La pression change de forme. Vous devez maintenant adopter le bon réflexe professionnel.</em>"}]},
          {letter:"C",desc:"« Monsieur Aubert, je vous invite à déclarer formellement votre lien familial avec ce candidat au déontologue. C'est la procédure. Sa candidature suivra le chemin de toutes les autres. »",gauges:{i:0,p:0,m:0},tint:false,reaction:{sp:"M. Aubert",ch:{css:"c-aubert",em:"🧑‍💼",nm:"M. Aubert — Administrateur"},txt:"(Marquant une pause, ton nettement refroidi) <em>« Le déontologue… je vois. »</em> Il ramasse le CV, silencieux. La conversation a basculé."}},
        ]
      },
    ],
    transitions:{
      1:{sp:"Narrateur",txt:`L'équipe est constituée. Le projet passe à l'étape suivante. Un fournisseur vous invite à déjeuner — il se montre beaucoup trop généreux.`},
      2:{sp:"Narrateur",txt:`L'équipe est constituée. Mais à peine le dossier RH refermé, un signal d'alerte clignote dans le SIRH. Des anomalies inexpliquées apparaissent dans les bulletins de paie. Quelque chose ne tourne pas rond.`},
      3:{sp:"Narrateur",txt:`L'équipe est constituée. Le centre démarre. La nuit tombe sur le site industriel. À la bascule de pesée, un camion s'arrête. Le chauffeur descend — enveloppe à la main.`},
    },
  },

  // ═══════════════════════════════════════
  // CHAPITRE 2 — Le Déjeuner de l'Acheteur
  // ═══════════════════════════════════════
  { num:"Affaire 2",name:"Le Déjeuner de l'Acheteur",sub:"Marchés publics & Appels d'offres",dureeMin:5,
    sc:"bureaularoche",playerRole:"Responsable des Achats",
    context:{eye:"⚙️ Affaire 2",title:"L'appel d'offres à 2,5 millions d'euros",body:`<strong>Responsable des Achats.</strong> Vous devez lancer l'appel d'offres pour les tapis de tri et presses à balles — un marché de <strong>2,5 millions d'euros</strong>. M. Laroche, de GlobalTri, vous invite à déjeuner dans un restaurant gastronomique bien trop luxueux pour un simple repas de travail.<br><br><em>M. Laroche et vous vous connaissez depuis dix ans — la relation est cordiale, presque amicale. C'est précisément ce qui rend la situation délicate.</em>`},
    dialogue:[
      {sp:"Narrateur",ch:null,sc:"resto",txt:"<em>Vous arrivez au restaurant. Table privative, lumières tamisées. Laroche commande sans regarder les prix.</em>"},
      {sp:"M. Laroche",ch:{css:"c-laroche",em:"👔",nm:"M. Laroche — GlobalTri"},sc:"resto",txt:"<em>« {prenom} ! Assieds-toi, assieds-toi. La foire industrielle de Lyon, non ? Ça fait au moins deux ans et demi ! »</em>"},
      {sp:"Vous",ch:null,sc:"resto",txt:"<em>« Exactement. J'ai regardé votre dossier de présentation en amont, et je dois dire que les délais proposés me semblent— »</em>"},
      {sp:"M. Laroche",ch:{css:"c-laroche",em:"👔",nm:"M. Laroche — GlobalTri"},sc:"resto",txt:"(Coupant la parole, souriant) <em>« Parfaits, n'est-ce pas ? On a travaillé dur sur ce calendrier. »</em>"},
      {sp:"M. Laroche",ch:{css:"c-laroche",em:"👔",nm:"M. Laroche"},sc:"resto",txt:"(Reposant son verre) <em>« Dix ans qu'on tourne dans les mêmes salons. T'as toujours fait du bon boulot. C'est rare. »</em>"},
      {sp:"Vous",ch:null,sc:"resto",txt:"<em>« Tu m'as dit que tu voulais parler du dossier Horizon. Je t'écoute. »</em>"},
      {sp:"M. Laroche",ch:{css:"c-laroche",em:"👔",nm:"M. Laroche"},sc:"resto",txt:"(Posant une clé USB sur la table) <em>« Justement. Mes ingénieurs ont préparé une note technique très complète. Ce genre de document, on le partage avec nos partenaires en amont — ça t'évitera de partir de zéro pour rédiger le cahier des charges. »</em>"},
      {sp:"M. Laroche",ch:{css:"c-laroche",em:"👔",nm:"M. Laroche"},sc:"resto",txt:"<em>« Tu sais aussi bien que moi qu'à la fin, GlobalTri est le seul à tenir les délais dans cette région. C'est quoi le risque de partir de nos specs ? Tu gagnes six semaines sur le planning. »</em>"},
      {sp:"Vous",ch:null,sc:"resto",txt:"<em>« Si ces spécifications ne correspondent qu'à GlobalTri, comment les autres candidats sont censés y répondre équitablement ? »</em>"},
      {sp:"M. Laroche",ch:{css:"c-laroche",em:"👔",nm:"M. Laroche"},sc:"resto",txt:"(Reposant son verre) <em>« Je t'entends. C'est du droit des marchés publics, pas de la morale. Tu dois prendre les meilleures décisions pour ton projet. Réfléchis. »</em>"},
      {sp:"Vous",ch:null,sc:"resto",txt:"<em>« Je t'entendrai dans le cadre de la consultation officielle, Laroche. »</em>"},
      {sp:"M. Laroche",ch:{css:"c-laroche",em:"👔",nm:"M. Laroche"},sc:"resto",txt:"(Reprenant son verre) <em>« On a bien travaillé ensemble sur Horizon depuis le début. J'aimerais qu'on continue dans le même esprit. D'ailleurs — j'ai quelque chose pour toi. »</em>"},
      {sp:"M. Laroche",ch:{css:"c-laroche",em:"👔",nm:"M. Laroche"},sc:"resto",txt:"(Posément, en se levant) <em>« La clé est sur la table. C'est toi qui vois. »</em>"},
    ],
    clues:[
      {ic:"📂",label:"Dossiers des concurrents",sub:"Matrice de comparaison",title:"Matrice de comparaison technique",body:`Quatre constructeurs sont qualifiés pour ce marché. La clause proposée par GlobalTri : <em>« vitesse de rotation des tambours de tri à 14,2 m/s »</em>.<br><br>Vérification faite : cette spécification correspond <strong>exactement et exclusivement</strong> au brevet de GlobalTri. Les trois autres fabricants sont éliminés de facto.`,alert:`Intégrer cette clause dans le cahier des charges constituerait un <strong>délit de favoritisme</strong> caractérisé, passible de 2 ans d'emprisonnement.`},
      {ic:"✉️",label:"Invitation reçue",sub:"Séminaire GlobalTri",title:"Invitation — Séminaire GlobalTri, Saint-Tropez",body:`Vous avez reçu une invitation à un « Séminaire de Sourcing » organisé par GlobalTri, tous frais payés. Programme : soirée de gala avec deux élus du département.<br><br>La réglementation interne de la SEM fixe le seuil d'acceptation des cadeaux à <strong>80 €</strong>.`,alert:`Accepter une invitation d'un candidat potentiel à un marché public constitue un risque de <strong>corruption passive</strong>.`},
    ],
    invIntro:"Rien ne traîne par hasard sur cette table. Regardez de plus près avant de répondre.",
    hotspots:[
      {x:25, y:55, w:14, h:14, label:"Dossiers des concurrents"},
      {x:46, y:57, w:14, h:13, label:"Invitation reçue"},
    ],
    pressureIntro:"Laroche vous envoie un message : « Les invitations Roland Garros sont à votre nom. J'espère qu'on pourra compter sur votre soutien pour le cahier des charges. Amicalement. »",
    choices:[
      {desc:"Prendre la clé USB à titre documentaire, les spécifications ne seront utilisées que comme point de comparaison, pas comme base du cahier des charges.",type:"bad",badge:"🔴 Échec",bc:"badge-bad",vTitle:"Corruption passive et favoritisme",vConsequence:`Un concurrent évincé dépose un recours. L'enquête révèle la clé USB et le séjour VIP. Le marché est annulé. Vous et la SEM êtes mis en cause. 5 mois de retard sur le projet.`,vLegal:`<strong>Qualification :</strong> Accepter un avantage d'un candidat et utiliser ses spécifications constitue une <strong>corruption passive</strong> doublée d'un <strong>favoritisme</strong>. Les deux infractions sont cumulatives.`,lc:"",gauges:{i:-44,p:-20,m:-36}},
      {desc:"Décliner le voyage, mais demander à un juriste interne de relire les spécifications GlobalTri pour identifier ce qui peut être retenu sans créer d'avantage exclusif.",type:"warn",badge:"🟠 Risqué",bc:"badge-warn",vTitle:"Favoritisme partiel",vConsequence:`Le refus du voyage est noté, mais les spécifications orientées introduites dans le cahier des charges constituent toujours un favoritisme. Un concurrent porte l'affaire en justice.`,vLegal:`<strong>Qualification :</strong> Le <strong>favoritisme</strong> se caractérise par l'effet à savoir avantager un candidat et non pas par l'intention déclarée de l'auteur de l'acte concerné.`,lc:"warn",gauges:{i:-20,p:-16,m:-20}},
      {desc:"Rendre la clé USB à M. Laroche devant témoin, consigner l'incident dans le registre des consultations préalables, et organiser une séance de sourcing ouverte à tous les fournisseurs qualifiés.",type:"good",badge:"🟢 Succès",bc:"badge-good",vTitle:"Procédure irréprochable",vConsequence:`Quatre candidats soumissionnent. La concurrence fait baisser les prix de 8%. GlobalTri remporte le marché sur ses mérites. Le processus est inattaquable.`,vLegal:`<strong>Bonne pratique :</strong> La séance de sourcing ouverte et tracée permet de bénéficier de l'expertise du marché sans créer de faveur illicite.`,lc:"good",gauges:{i:+20,p:+6,m:+20}},
    ],
    sos:{
      situation:"M. Laroche propose des spécifications techniques exclusives à son entreprise et des avantages personnels en échange d'un traitement favorable dans un appel d'offres à 2,5 M€.",
      questions:["Si ce cahier des charges était publié demain, d'autres fournisseurs pourraient-ils y répondre équitablement ?","L'avantage proposé — même décliné — crée-t-il une obligation implicite de ma part ?","Comment puis-je utiliser l'expertise du marché sans créer de traitement préférentiel ?"],
      reasoning:"Le code de la commande publique impose une concurrence loyale et une égalité de traitement entre candidats. Introduire des critères techniques correspondant exclusivement à un seul fournisseur revient à orienter l'appel d'offres, même si l'intention déclarée est de 'gagner du temps'. Concernant les avantages personnels d'un candidat potentiel : la loi ne distingue pas selon leur valeur perçue — le simple fait de les accepter dans ce contexte suffit à constituer l'infraction.",
      lawRef:{label:"Art. 432-14 CP — Favoritisme",url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006418683"},
    },
    recap:{
      risk:"Favoritisme",
      definition:"Le favoritisme consiste à avantager un candidat à un marché public en violant les règles d'égalité de traitement. L'infraction est constituée dès lors que les conditions d'accès sont orientées, même sans contrepartie directe.",
      gestures:["Ne jamais intégrer dans un cahier des charges des critères techniques propres à un seul fournisseur","Tracer toutes les consultations préalables dans un registre ouvert à tous les candidats","Décliner tout avantage d'un candidat potentiel, quelle qu'en soit la valeur affichée"],
      realLife:"Un responsable achats d'une collectivité intègre dans un appel d'offres une clause technique qui exclut de facto tous les concurrents d'un fournisseur. La chambre régionale des comptes identifie l'anomalie. Le marché est annulé, le responsable fait l'objet d'une procédure disciplinaire et le fournisseur est exclu des marchés de la collectivité pour 3 ans.",
      jurisprudence:{
        titre:"Affaire des marchés de Saint-Étienne Métropole (2021)",
        resume:"Un acheteur condamné à 2 ans avec sursis pour favoritisme après avoir accepté des invitations sportives répétées d'un fournisseur candidat à un marché en cours.",
        source:"TJ Saint-Étienne, 2021"
      },
    },
    microDecisions:[
      {
        phoneRing: true,
        situation:"Votre téléphone sonne. C'est M. Laroche, de GlobalTri — il vous propose un déjeuner. Le restaurant qu'il cite est bien trop luxueux pour un simple repas de travail.",
        choices:[
          {letter:"A",desc:"« D'accord pour le déjeuner. On se connaît depuis dix ans, de toute façon. »",
           musicAfter:"restaurant.mp3",
           transitionTxt:"<em>Quelques heures plus tard. Restaurant L'Inconnu — table privative, éclairage tamisé. Laroche a déjà commandé le vin quand vous arrivez.</em>",
           reaction:{sp:"M. Laroche",ch:{css:"c-laroche",em:"👔",nm:"M. Laroche — GlobalTri"},txt:"(Souriant) <em>« Excellent. Je réserve une table au L'Inconnu — tu verras, tu ne seras pas déçu. »</em>"}},
          {letter:"B",desc:"« Pour une réunion de travail, je préfère la brasserie en face. C'est plus adapté. »",
           sceneAtLine0:"bistro",
           musicAfter:"bistro.mp3",
           transitionTxt:"<em>Laroche vous rejoint à contrecœur à la brasserie d'en face. Nappes en papier, menu du jour au tableau. Il cache discrètement la bouteille qu'il avait prévu d'apporter.</em>",
           dialoguePatch:[
             {idx:1, txt:"(S'installant en face de vous, résigné) <em>« Bon. La foire industrielle de Lyon, c'était il y a deux ans et demi. »</em>"},
           ],
           reaction:{sp:"M. Laroche",ch:{css:"c-laroche",em:"👔",nm:"M. Laroche — GlobalTri"},txt:"(Légère pause) <em>« Comme tu veux. À tout à l'heure. »</em>"}},
          {letter:"C",desc:"« Je te propose qu'on se retrouve dans nos locaux, avec mon assistante présente. C'est plus approprié. »",
           sceneAfter:"sallereunion",
           transitionTxt:"<em>Laroche arrive à l'heure, costume impeccable, mallette en main. Marie — votre assistante — est déjà installée en bout de table, carnet ouvert.</em>",
           dialogueInject:[
             {sp:"Marie",ch:{css:"c-marie",em:"👩‍💼",nm:"Marie — Assistante"},sc:"sallereunion",txt:"(Stylo prêt) <em>« Bonjour Monsieur Laroche. Je prends les notes pour {prenom} aujourd'hui. »</em>"},
             {sp:"M. Laroche",ch:{css:"c-laroche",em:"👔",nm:"M. Laroche — GlobalTri"},sc:"sallereunion",txt:"(Posant sa mallette, légèrement décontenancé) <em>« Ah… bien sûr. »</em> (Il range un document qu'il avait commencé à sortir.)"},
           ],
           dialoguePatch:[
             {idx:1, txt:"<em>« {prenom}. Merci de me recevoir dans vos locaux. »</em> (Il s'installe en face de vous, de l'autre côté de la table.)"},
             {idx:3, txt:"(Reprenant son sérieux) <em>« Bien. Allons droit au fait — vous savez pourquoi je suis là. »</em>"},
           ],
           hotspotsOverride:[
             {x:18, y:50, w:15, h:18, label:"Dossiers des concurrents"},
             {x:58, y:44, w:15, h:18, label:"Invitation reçue"},
           ],
           reaction:{sp:"M. Laroche",ch:{css:"c-laroche",em:"👔",nm:"M. Laroche — GlobalTri"},txt:"(Un temps) <em>« Très bien. »</em> Il marque une légère hésitation. <em>« Je prépare quelques éléments et je vous rejoins. »</em> Il arrive dans vos bureaux avec une clé USB déjà en main."}},
        ]
      },
      {
        situation:"M. Laroche mentionne avoir une documentation technique que ses ingénieurs ont préparée pour « vous faire gagner du temps » sur le cahier des charges.",
        choices:[
          {letter:"A",desc:"« Je peux regarder à titre informatif. Ça ne m'oblige à rien. »",gauges:{i:-4,p:0,m:0},tint:true,reaction:{sp:"M. Laroche",ch:{css:"c-laroche",em:"👔",nm:"M. Laroche — GlobalTri"},txt:"(Avec satisfaction) <em>« Je savais que tu étais pragmatique. Mes ingénieurs ont préparé quelque chose de très complet — tu verras. »</em> (Sortant une enveloppe) <em>« Et j'ai une invitation pour le séminaire de sourcing à Saint-Tropez — tout compris. Trois jours, très instructif. »</em>"}},
          {letter:"B",desc:"« Je ne peux pas consulter de document fourni par un candidat potentiel en dehors d'une consultation ouverte à tous. »",gauges:{i:0,p:0,m:0},tint:false,reaction:{sp:"M. Laroche",ch:{css:"c-laroche",em:"👔",nm:"M. Laroche — GlobalTri"},txt:"(Marquant une pause, hésitant) <em>« Je comprends ta position. »</em> Il pose ses mains sur la table, réfléchissant. <em>« Mais laisse-moi te montrer autre chose. »</em>"}},
          {letter:"C",desc:"« Je prends le document sous pli fermé et le transmets à la direction pour décider d'une consultation ouverte. »",gauges:{i:0,p:0,m:0},tint:false,reaction:{sp:"M. Laroche",ch:{css:"c-laroche",em:"👔",nm:"M. Laroche — GlobalTri"},txt:"(Souriant discrètement) <em>« C'est très sage. »</em> La clé USB entre dans les locaux de la SEM. <em>« Et dans l'esprit de nos bons rapports — une invitation pour notre séminaire à Saint-Tropez. Trois jours, tous frais payés. »</em>"}},
        ]
      },
    ],
    transitions:{
      2:{sp:"Narrateur",txt:`Les machines sont commandées. Le centre tourne. Un signal d'alerte clignote dans le SIRH. Des anomalies inexpliquées apparaissent dans les fiches de paie. Quelque chose ne tourne pas rond.`},
      3:{sp:"Narrateur",txt:`Le matériel est en place. Le centre tourne. 22h47. Un camion ViteDéchets se présente à la bascule. Quelque chose ne va pas — le chauffeur descend avant même que vous ayez validé le bon.`},
      4:{sp:"Narrateur",txt:`Les machines sont commandées. Le centre est en marche. Une inspection inopinée frappe à la porte. Vous allez faire face à un inspecteur dont les intentions sont pour le moins… troubles.`},
      intermediate:{sp:"Narrateur",txt:`Le dossier est bouclé. Vous avez affronté les situations les plus critiques pour votre service. Il est temps de faire le point avant de continuer.`},
    },
  },

  // ═══════════════════════════════════════
  // CHAPITRE 3 — Les Fantômes de la Paie
  // ═══════════════════════════════════════
  { num:"Affaire 3",name:"Les Fantômes de la Paie",sub:"Finance & Détournement de fonds",dureeMin:4,
    sc:"bureauf",playerRole:"Contrôleur Interne",
    context:{eye:"💶 Affaire 3",title:"Une anomalie dans le bulletin de paie",body:`Lors d'un contrôle interne de routine, vous identifiez une anomalie : le RIB bancaire de <strong>Mme Collet</strong>, agente administrative, a été modifié deux fois en un mois dans le SIRH — sans aucune demande signée par les RH. Sa rémunération a également été revalorisée de <strong>800€/mois</strong> sans avenant à son contrat.<br><br><em>Mme Favre, Responsable Paie, a effectué ces modifications sous ses propres identifiants. Vous la convoquez.</em>`},
    dialogue:[
      {sp:"Narrateur",ch:null,sc:"bureauf",txt:"<em>La rencontre a lieu. Mme Favre entre dans la pièce — visage fermé, regard fixe.</em>"},
      {sp:"Mme Favre",ch:{css:"c-favre",em:"💼",nm:"Mme Favre — Responsable Paie"},sc:"bureauf",txt:"<em>« Je ne vois pas de quoi vous voulez parler. Des corrections techniques, rien de plus. J'ai fait mon travail. »</em>"},
      {sp:"Vous",ch:null,sc:"bureauf",txt:"<em>« Les logs SIRH montrent que vous avez modifié le RIB de Mme Collet un vendredi à 19h32, hors procédure. Et sa rémunération a augmenté de 800€ sans avenant ni validation RH. »</em>"},
      {sp:"Mme Favre",ch:{css:"c-favre",em:"💼",nm:"Mme Favre"},sc:"bureauf",txt:"(S'agitant) <em>« Elle m'a demandé de changer son RIB discrètement — elle avait ses raisons. Et pour le salaire, c'était une erreur de grille que j'ai corrigée. Vous n'y connaissez rien. »</em>"},
      {sp:"Vous",ch:null,sc:"bureauf",txt:"<em>« Tout changement de RIB doit être accompagné d'une signature de la salariée et d'un visa RH. Il n'y a rien de tel dans le dossier. »</em>"},
      {sp:"Mme Favre",ch:{css:"c-favre",em:"💼",nm:"Mme Favre"},sc:"bureauf",txt:"<em>« Vous cherchez des ennuis là où il n'y en a pas. Si vous continuez, je dirai que c'est vous qui m'avez demandé de le faire. C'est ma parole contre la vôtre. Classez ce dossier. »</em>"},
      {sp:"Vous",ch:null,sc:"bureauf",txt:"<em>« Les logs horodatés ne mentent pas, Madame Favre. »</em>"},
    ],
    clues:[
      {ic:"🖥️",label:"Logs SIRH",sub:"Journal des modifications de paie",title:"Extrait SIRH — Modifications utilisateur mfa_favre",body:`<strong>Entrée du 23/09 à 19h32 :</strong> Modification du RIB de l'agente Mme Collet (compte n°xxx42) vers un compte tiers (n°xxx91).<br><br><strong>Entrée du 08/10 à 18h55 :</strong> Revalorisation salariale de +800€ brut/mois. Aucun champ « motif » renseigné. Aucun avenant joint.<br><br>Les deux opérations sont signées sous les identifiants de <strong>mfa_favre</strong>.`,alert:`Ces modifications effectuées hors procédure et en dehors des horaires habituels constituent des indices sérieux de <strong>détournement de fonds</strong>.`},
      {ic:"🏦",label:"Relevé bancaire de contrôle",sub:"Compte destinataire du virement",title:"Titulaire du compte destinataire — n°xxx91",body:`La vérification auprès du service financier révèle que le compte n°xxx91 n'est <strong>pas au nom de Mme Collet</strong>.<br><br>Il appartient à une tierce personne sans lien identifié avec la SEM. Mme Collet affirme n'avoir jamais demandé de modification de RIB et n'a perçu aucune revalorisation salariale.`,alert:`Le compte destinataire est frauduleux. Mme Collet est victime. Il s'agit d'un <strong>détournement de fonds</strong> caractérisé au préjudice de la SEM et de la salariée.`},
    ],
    invIntro:"Votre bureau de contrôle. Les éléments sont là, sous vos yeux.",
    hotspots:[
      {x:2,  y:12, w:26, h:46, label:"Logs SIRH"},
      {x:52, y:52, w:20, h:18, label:"Relevé bancaire de contrôle"},
    ],
    pressureIntro:"Votre N+1 vous dit : « Mme Favre rend service à la direction. Ne faites pas de vagues. Validez et passez à autre chose. »",
    choices:[
      {desc:"Demander à Mme Favre de régulariser elle-même les modifications et lui laisser deux semaines pour fournir les justificatifs manquants, sans remontée hiérarchique pour l'instant.",type:"bad",badge:"🔴 Échec",bc:"badge-bad",vTitle:"Complicité de détournement",vConsequence:`Le virement frauduleux continue. Trois mois plus tard, l'audit annuel remonte l'anomalie. Les logs montrent que vous aviez accès au dossier et ne l'avez pas signalé. Vous êtes considéré(e) comme complice par omission. Vous et Mme Favre êtes mis(e)s en cause.`,vLegal:`<strong>Qualification :</strong> Ne pas signaler un détournement dont on a connaissance expose à une qualification de <strong>complicité de détournement de fonds</strong>. L'omission volontaire est une faute grave, pénalement et disciplinairement.`,lc:"",gauges:{i:-40,p:-8,m:-32}},
      {desc:"Signaler verbalement à votre N+1 que vous avez de sérieux doutes sur la gestion de paie, en lui laissant décider de la suite à donner.",type:"warn",badge:"🟠 Risqué",bc:"badge-warn",vTitle:"Alerte insuffisante",vConsequence:`Votre responsable dit avoir transmis l'information, mais rien n'est documenté. Lors de l'audit, vous ne pouvez pas prouver votre signalement. Votre responsabilité professionnelle est engagée.`,vLegal:`<strong>Qualification :</strong> Une alerte orale sans trace écrite n'est pas une alerte au sens du dispositif anticorruption Sapin II. Le signalement doit être formalisé pour protéger le lanceur d'alerte et déclencher une procédure.`,lc:"warn",gauges:{i:-16,p:-4,m:-16}},
      {desc:"Geler immédiatement les modifications dans le SIRH, notifier par écrit le déontologue et la DRH, et lancer un audit des 12 derniers mois.",type:"good",badge:"🟢 Succès",bc:"badge-good",vTitle:"Contrôle interne exemplaire",vConsequence:`Le gel immédiat des virements empêche de nouveaux préjudices. L'audit révèle trois autres modifications suspectes. Mme Favre est mise à pied conservatoire. Mme Collet est informée et protégée. Vous recevez les félicitations du conseil d'administration.`,vLegal:`<strong>Bonne pratique :</strong> Signaler par écrit, geler les flux et documenter les preuves : les trois réflexes du contrôleur interne. Le dispositif d'alerte interne Sapin II protège le lanceur d'alerte de toute représaille.`,lc:"good",gauges:{i:+20,p:+6,m:+20}},
    ],
    sos:{
      situation:"Des modifications non autorisées ont été effectuées sur des données de paie dans le SIRH sous les identifiants d'une salariée. La responsable concernée conteste et cherche à clore le dossier.",
      questions:["Si je laisse cette personne régulariser seule, quelles preuves risque-t-elle de faire disparaître ?","Mon obligation de signalement s'arrête-t-elle à mon supérieur hiérarchique, ou existe-t-il une voie dédiée ?","La salariée lésée est-elle protégée si je ne fais rien ?"],
      reasoning:"Le détournement de fonds peut être constitué dès lors que des sommes sont détournées au préjudice d'une structure, même sans enrichissement personnel du signataire. En tant que contrôleur interne, vous avez une obligation de signalement formalisée par la loi Sapin II. L'absence d'action — même sans intention malveillante — peut être qualifiée de complicité par omission. La loi prévoit une protection du lanceur d'alerte contre toute représaille, à condition que le signalement soit formalisé par écrit.",
      lawRef:{label:"Art. 432-15 CP — Détournement de fonds",url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006418686"},
    },
    recap:{
      risk:"Détournement de fonds",
      definition:"Un agent détourne à son profit — ou celui d'un tiers — des fonds ou biens qui lui sont confiés dans l'exercice de sa fonction. L'infraction est constituée même si les sommes détournées sont modestes.",
      gestures:["Appliquer le principe des quatre yeux pour toute modification de données sensibles dans un SIRH","Signaler immédiatement par écrit toute anomalie, sans attendre la confirmation hiérarchique","Geler les flux concernés avant tout entretien avec la personne suspectée"],
      realLife:"Une responsable paie d'une intercommunalité normande modifie le RIB d'une salariée en congé maladie longue durée vers un compte à son nom. L'anomalie est détectée lors de l'audit annuel. Montant détourné : 9 800€. Condamnation à 2 ans avec sursis et remboursement intégral.",
      jurisprudence:{
        titre:"Fraude à la paie dans une intercommunalité bretonne (2020)",
        resume:"Une gestionnaire RH condamnée à 3 ans dont 18 mois ferme pour détournement de fonds après avoir créé 2 agents fictifs et modifié des RIB sur 14 mois pour 67 000€ détournés — une affaire distincte, mais de même nature.",
        source:"TJ Rennes, 2020"
      },
    },
    microDecisions:[
      {
        situation:"Vous avez repéré l'anomalie dans le SIRH. Un collègue vous suggère d'en parler « en informel » à Mme Favre avant d'agir.",
        choices:[
          {letter:"A",desc:"« Mme Favre, j'ai vu une anomalie sur la fiche Collet. Je voulais vous prévenir avant de remonter ça. »",reaction:{sp:"Mme Favre",ch:{css:"c-favre",em:"💼",nm:"Mme Favre — Responsable Paie"},txt:"(Soulagée) <em>« Merci de me prévenir. Je vais arranger ça discrètement. »</em> Elle dispose maintenant de plusieurs heures pour régulariser des traces."}},
          {letter:"B",desc:"« Je rassemble tous les éléments et je convoque un entretien formel avec les documents. »",reaction:{sp:"Narrateur",ch:null,txt:"Vous sécurisez les logs horodatés, prenez des captures d'écran et préparez un dossier complet. Mme Favre sera convoquée sans préavis."}},
          {letter:"C",desc:"« J'en parle d'abord à mon responsable hiérarchique pour valider ma démarche avant de convoquer qui que ce soit. »",reaction:{sp:"Narrateur",ch:null,txt:"Votre responsable dit <em>« assure-toi bien avant de t'avancer »</em>. Deux heures plus tard, Mme Favre vous croise dans le couloir avec un sourire trop calme. Quelqu'un l'a prévenue."}},
        ]
      },
      {
        situation:"Pendant l'entretien, Mme Favre affirme que c'était « une correction technique » et que vous allez lui créer des ennuis inutiles.",
        choices:[
          {letter:"A",desc:"« Écrivez-moi une note explicative et je verrai avant de remonter quoi que ce soit. »",gauges:{i:-4,p:0,m:0},tint:true,reaction:{sp:"Mme Favre",ch:{css:"c-favre",em:"💼",nm:"Mme Favre — Responsable Paie"},txt:"(Soulagée, se levant) <em>« Je vous fais ça cet après-midi. »</em> Elle reviendra plus tard avec une note insuffisante — et un ton beaucoup plus menaçant."}},
          {letter:"B",desc:"« Je transmets le dossier complet au service juridique aujourd'hui. C'est la procédure. »",gauges:{i:0,p:0,m:0},tint:false,reaction:{sp:"Mme Favre",ch:{css:"c-favre",em:"💼",nm:"Mme Favre — Responsable Paie"},txt:"(Changeant de ton, se levant) <em>« Le service juridique… très bien. Mais avant qu'ils vous croient, il faudra du temps. Et pendant ce temps, j'aurai dit ma version. »</em>"}},
          {letter:"C",desc:"« Je transmets le dossier aux Ressources Humaines pour une procédure disciplinaire. »",gauges:{i:0,p:0,m:0},tint:false,reaction:{sp:"Mme Favre",ch:{css:"c-favre",em:"💼",nm:"Mme Favre — Responsable Paie"},txt:"(Reprenant contenance, calculatrice) <em>« Une procédure disciplinaire. Très bien. Je connais mes droits. »</em> Elle sait que les RH ne peuvent ni geler les flux ni sécuriser les preuves numériques — et elle a le temps d'agir."}},
        ]
      },
    ],
    transitions:{
      3:{sp:"Narrateur",txt:`L'intégrité financière est préservée. Le centre continue à tourner. Mais la nuit réserve d'autres surprises. Sur le site, un camion stationne à la bascule bien après l'heure habituelle. Le chauffeur attend.`},
      4:{sp:"Narrateur",txt:`L'intégrité financière est préservée. Le centre continue à tourner. Une inspection inopinée frappe à la porte. Vous allez faire face à un inspecteur dont les intentions sont pour le moins… troubles.`},
      5:{sp:"Narrateur",txt:`L'intégrité financière est préservée. Mais de nouvelles pressions se profilent. Vous devez décrocher un contrat crucial pour rentabiliser le centre. Un directeur municipal a une proposition pour le moins surprenante.`},
    },
  },

  // ═══════════════════════════════════════
  // CHAPITRE 4 — La Nuit des Tonnages
  // ═══════════════════════════════════════
  { num:"Affaire 4",name:"La Nuit des Tonnages",sub:"Exploitation & Pesée",dureeMin:4,
    sc:"pesee",playerRole:"Chef d'exploitation de nuit",
    context:{eye:"⚙️ Affaire 4",title:"22h47 — La cabine de pesée",body:`<strong>Chef d'exploitation de nuit.</strong> Le site de valorisation est presque vide. Vous êtes seul décisionnaire sur le site.<br><br>Un camion de ViteDéchets arrive pour son dépôt hebdomadaire. Rien d'inhabituel… jusqu'à ce que la bascule affiche <strong>18,4 tonnes</strong>. Le bordereau dit <strong>12</strong>.`},
    dialogue:[
      {sp:"Patrice",ch:{css:"c-patrice",em:"🚛",nm:"Patrice"},sc:"pesee",txt:"(Baissant la voix) <em>« Écoutez… j'ai deux gosses. Je fais ce qu'on me dit. Si vous bloquez ce soir, c'est moi qui prends. »</em>"},
      {sp:"Narrateur",ch:null,sc:"pesee",txt:"(Téléphone qui sonne — numéro interne SEM)"},
      {sp:"Sam — Chef de Site",ch:null,sc:"pesee",txt:"<em>« C'est moi. Patrice est là ? ViteDéchets c'est notre principal prestataire sur ce site. 800 tonnes par mois. Ne faites pas de vagues ce soir — validez et on voit ça demain matin. »</em>"},
      {sp:"Narrateur",ch:null,sc:"pesee",txt:"<em>Après avoir raccroché, vous contournez discrètement le camion. La bâche est mal fixée côté conducteur. Vous prenez une photo avec votre téléphone. Ce que vous voyez ne ressemble pas à des déchets verts.</em>"},
    ],
    clues:[
      {ic:"📱",label:"Photo smartphone",sub:"Contenu du chargement",title:"Photo du chargement — Camion ViteDéchets",body:`Vous avez photographié le chargement à travers la bâche. On distingue des <strong>bidons avec pictogrammes « Toxique »</strong> et « Danger chimique ».<br><br>Le bordereau indique pourtant : <em>« Déchets verts »</em>.`,alert:`Il ne s'agit pas de déchets verts mais de <strong>déchets dangereux non conformes</strong>. Valider ce bon exposerait la SEM à une responsabilité environnementale grave et à une infraction à la réglementation ICPE.`},
      {ic:"🔧",label:"Registre de maintenance",sub:"Bascule de pesée n°2",title:"Registre de maintenance — Bascule n°2",body:`Dernier contrôle métrologique : <strong>il y a 3 jours</strong>. Certification valide. Calibrage parfait.<br><br><strong>Conclusion : si l'écran affiche 18,4 tonnes, c'est qu'il y a bien 18,4 tonnes.</strong> L'argument d'une erreur de pesée ne tient pas.`,alert:`Valider sciemment un poids erroné sur une bascule certifiée constitue un <strong>faux en écriture</strong> opérationnel, quand bien même aucun argent n'est touché.`},
    ],
    invIntro:"La cabine de pesée. Deux éléments méritent votre attention avant d'agir.",
    hotspots:[
      {x:5,  y:48, w:20, h:24, label:"Photo smartphone"},
      {x:76, y:42, w:12, h:18, label:"Registre de maintenance"},
    ],
    pressureIntro:"Le chef d'exploitation rappelle. Il est plus direct cette fois. « Si ViteDéchets perd confiance dans notre site, c'est 800 tonnes par mois qui partent chez la concurrence. Et c'est votre bilan d'exploitation qui en prend un coup. Décidez. »",
    choices:[
      {desc:"Valider 12 tonnes sur le bordereau et ne pas signaler l'enveloppe.",type:"bad",badge:"🔴 Échec",bc:"badge-bad",vTitle:"Faux en écriture & Complicité de pollution",vConsequence:`Vous avez cédé à la double pression — hiérarchique et financière. Le bordereau falsifié existe. L'enveloppe aussi. L'audit trimestriel détecte les anomalies. Une inspection ICPE révèle les déchets dangereux. Vous êtes mis(e) en examen.`,vLegal:`<strong>Qualification :</strong> Signer un bordereau avec un poids erroné constitue un <strong>faux en écriture</strong> (Art. 441-1 CP). La présence de l'enveloppe et des déchets dangereux engage en plus votre responsabilité environnementale.`,lc:"",gauges:{i:-40,p:+17,m:-36}},
      {desc:"Enregistrer 18,4 tonnes mais ne pas signaler l'enveloppe ni la photo des déchets suspects.",type:"warn",badge:"🟠 Risqué",bc:"badge-warn",vTitle:"Acte juste mais incomplet",vConsequence:`Vous avez refusé de falsifier le bordereau. Mais l'enveloppe et les déchets suspects ne sont pas signalés. La vérité est à moitié dite. L'inspection ICPE, déclenchée plus tard, révèle que vous saviez.`,vLegal:`<strong>Qualification :</strong> Ne pas signaler des déchets dangereux non déclarés dont vous avez connaissance engage la responsabilité environnementale de la SEM et peut constituer une <strong>complicité par omission</strong>.`,lc:"warn",gauges:{i:-16,p:+4,m:-16}},
      {desc:"Enregistrer 18,4 tonnes, refuser l'enveloppe, signaler les déchets suspects à la direction générale ET à l'inspection des installations classées.",type:"good",badge:"🟢 Succès",bc:"badge-good",vTitle:"Intégrité totale et signalement courageux",vConsequence:`ViteDéchets perd son accréditation sur le site. Une enquête s'ouvre sur les dépôts des six derniers mois. Votre signalement écrit vous protège. Vous êtes félicité(e) en comité de direction.`,vLegal:`<strong>Bonne pratique :</strong> Signaler à la direction générale — et non au supérieur direct impliqué dans la pression — est le seul réflexe qui protège le salarié, la SEM et l'environnement. La traçabilité du refus est une protection irréfutable.`,lc:"good",gauges:{i:+20,p:-4,m:+20}},
    ],
    sos:{
      situation:"Un chauffeur vous demande de valider un poids erroné sur une bascule certifiée. Votre chef d'exploitation vous presse de ne pas faire de vagues. Une enveloppe est posée sur le comptoir. Le chargement semble contenir des déchets dangereux.",
      questions:["Une bascule certifiée il y a 3 jours peut-elle afficher une erreur de 6,4 tonnes ?","Mon chef d'exploitation peut-il m'ordonner de valider un bordereau erroné ?","Que se passe-t-il si le chargement contient réellement des déchets dangereux non déclarés ?"],
      reasoning:"La bascule de pesée est un instrument légalement certifié : inscrire sciemment un poids différent de celui affiché constitue un faux en écriture, quelle que soit la pression reçue. Si le chargement contient des déchets dangereux non déclarés, valider le bon engage la responsabilité environnementale de la SEM et du signataire. Quand le supérieur direct est à l'origine de la pression, la direction générale — et non ce supérieur — est le bon interlocuteur.",
      lawRef:{label:"Art. 441-1 CP — Faux en écriture",url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006418767"},
    },
    recap:{
      risk:"Faux en écriture & Corruption passive",
      definition:"Signer un bordereau avec un poids erroné constitue un faux en écriture. Accepter l'enveloppe serait une corruption passive. La présence de déchets dangereux mal déclarés engage en plus la responsabilité environnementale de la SEM.",
      gestures:["Ne jamais valider un écart entre pesée réelle et bordereau — la bascule certifiée dit la vérité","Documenter par photo avant d'agir — photographier crée des preuves irréfutables","Signaler à la direction générale, pas au supérieur direct s'il est impliqué dans la pression"],
      realLife:"Un agent de pesée valide pendant 8 mois des bordereaux minorés pour un transporteur, contre 200€ par camion. L'audit trimestriel détecte les écarts de tonnage. L'agent est licencié pour faute grave et condamné à 18 mois avec sursis. Le transporteur reçoit une amende environnementale pour déchets non conformes.",
      jurisprudence:{
        titre:"Affaire des tonnages truqués dans une SEM d'Île-de-France (2022)",
        resume:"Un chef de quai condamné à 1 an ferme pour faux en écriture après avoir validé des bordereaux minorés sur 3 ans. Son responsable, qui 'ne voyait pas', a écopé d'un rappel à la loi.",
        source:"TJ Créteil, 2022"
      },
    },
    microDecisions:[
      {
        situation:"Patrice arrive au guichet. Il pose le bordereau sur le comptoir : <strong>12 tonnes de déchets verts</strong>. Mais la bascule affiche <strong>18,4 tonnes</strong>.",
        choices:[
          {letter:"A",desc:"« Je signe le bordereau sans vérifier le poids — on a toujours fait confiance à ViteDéchets. »",gauges:{i:-8,p:0,m:0},tint:true,reaction:{sp:"Patrice",ch:{css:"c-patrice",em:"🚛",nm:"Patrice — Chauffeur ViteDéchets"},txt:"(Soulagé) <em>« Merci. Mon patron va être content. »</em> Vous n'avez pas regardé l'écran. Mais la bascule, elle, a tout enregistré : 18,4 tonnes. Votre signature est sur un bordereau à 12."}},
          {letter:"B",desc:"« Je regarde le bordereau et la bascule mais je ne dis rien pour l'instant. »",gauges:{i:0,p:0,m:0},tint:false,reaction:{sp:"Patrice",ch:{css:"c-patrice",em:"🚛",nm:"Patrice — Chauffeur ViteDéchets"},txt:"(Nerveux) <em>« Alors ? On peut y aller ? »</em> L'écart est visible. Il attend. La pression monte."}},
          {letter:"C",desc:"« Je bloque le camion et demande une vérification contradictoire du poids. »",gauges:{i:+2,p:0,m:0},tint:false,reaction:{sp:"Patrice",ch:{css:"c-patrice",em:"🚛",nm:"Patrice — Chauffeur ViteDéchets"},txt:"(Mal à l'aise) <em>« Une vérification ? Mais… la bascule est bonne, non ? »</em> Il s'écarte du guichet, hésitant."}},
        ]
      },
      {
        situation:"Sans un mot, Patrice pose une enveloppe kraft sur le comptoir et vous regarde.",
        choices:[
          {letter:"A",desc:"« Bon… les bascules peuvent avoir des variations la nuit. Je vais marquer 12 tonnes — on régularise demain matin. »",gauges:{i:-16,p:0,m:0},tint:true,reaction:{sp:"Patrice",ch:{css:"c-patrice",em:"🚛",nm:"Patrice — Chauffeur ViteDéchets"},txt:"(Récupérant l'enveloppe, soulagé) <em>« Je savais qu'on pouvait s'arranger. »</em> Le bordereau falsifié est signé. L'enveloppe disparaît. Il n'y aura pas de demain matin."}},
          {letter:"B",desc:"« Je refuse l'enveloppe mais je valide quand même le bordereau à 12 tonnes pour ne pas bloquer le prestataire. »",gauges:{i:-8,p:+4,m:-12},tint:true,reaction:{sp:"Patrice",ch:{css:"c-patrice",em:"🚛",nm:"Patrice — Chauffeur ViteDéchets"},txt:"(Reprenant l'enveloppe) <em>« Bon. Merci quand même. »</em> Le bordereau falsifié est signé sans que vous ayez touché un centime. Le risque juridique est identique."}},
          {letter:"C",desc:"« Je ne touche pas à l'enveloppe. Je ne valide pas le bordereau. Je prends une photo de la scène et j'appelle la direction générale — pas le chef d'exploitation. »",gauges:{i:+4,p:0,m:0},tint:false,reaction:{sp:"Patrice",ch:{css:"c-patrice",em:"🚛",nm:"Patrice — Chauffeur ViteDéchets"},txt:"(Se raidissant) <em>« Vous faites une erreur. Mon patron va pas apprécier. »</em> Il reprend l'enveloppe et repart vers le camion. Mais quelque chose derrière la bâche attire votre attention."}},
        ]
      },
    ],
    memoire:{
      good:{
        chCible:7,
        txt:"<em>Vous avez déjà tenu bon face à une pression opérationnelle. Vos réflexes sont rodés. Ce qui arrive ce soir ressemble à quelque chose que vous connaissez.</em>",
      },
      bad:{
        chCible:7,
        txt:"<em>La dernière fois que la pression opérationnelle s'est manifestée, vous avez choisi la facilité. Ce soir, même territoire. Même type de risque. Qu'est-ce qui va changer ?</em>",
      },
    },
    transitions:{
      4:{sp:"Narrateur",txt:`Le rapport de nuit est transmis. ViteDéchets est convoqué. Vous avez le dossier. Une inspection inopinée frappe maintenant à la porte.`},
      5:{sp:"Narrateur",txt:`Le rapport de nuit est transmis. ViteDéchets est convoqué. Horizon se développe. Vous devez décrocher un contrat crucial pour rentabiliser le centre. Un directeur municipal a une proposition pour le moins surprenante.`},
      intermediate:{sp:"Narrateur",txt:`Le rapport de nuit est transmis. Le site est sécurisé. Vous avez affronté les situations les plus critiques pour votre service. Il est temps de faire le point avant de continuer.`},
    },
  },

  // ═══════════════════════════════════════
  // CHAPITRE 5 — Le Chantage à l'Autorisation
  // ═══════════════════════════════════════
  { num:"Affaire 5",name:"Le Chantage à l'Autorisation",sub:"QSE & Inspection environnementale",dureeMin:5,
    sc:"indus",playerRole:"Responsable QSE",
    context:{eye:"🛡️ Affaire 5",title:"Inspection inopinée au Centre Horizon",body:`<strong>Responsable QSE.</strong> Vous accueillez M. Lefebvre, inspecteur de l'environnement. Il examine le bassin de rétention des lixiviats au centre Horizon.<br><br><em>Les relevés de pollution sont hors limites. La situation est grave. Mais la proposition qui va suivre l'est encore plus.</em>`},
    dialogue:[
      {sp:"Narrateur",ch:null,sc:"indus",txt:"<em>L'inspection est lancée. Lefebvre prend ses marques — et vous observe autant que le site.</em>"},
      {sp:"Vous",ch:null,sc:"indus",txt:"<em>« Opérationnel depuis 14 mois. Je vous guide vers l'unité 3 directement ? »</em>"},
      {sp:"M. Lefebvre",ch:{css:"c-lefebvre",em:"📋",nm:"M. Lefebvre — Inspecteur"},sc:"indus",txt:"(Consultant ses notes) <em>« J'aime comprendre un site dans son ensemble avant d'aller dans le détail. »</em>"},
      {sp:"M. Lefebvre",ch:{css:"c-lefebvre",em:"📋",nm:"M. Lefebvre"},sc:"indus",txt:"(En visite, posant des questions précises) <em>« Ce bassin de rétention — vous l'avez dimensionné comment ? La capacité tampon me semble bien calculée. »</em>"},
      {sp:"Vous",ch:null,sc:"indus",txt:"<em>« On a travaillé avec le bureau Lemaire. Les normes 2022 sont respectées sur les unités 1 et 2. »</em>"},
      {sp:"M. Lefebvre",ch:{css:"c-lefebvre",em:"📋",nm:"M. Lefebvre"},sc:"indus",txt:"(Sortant son rapport, ton qui change) <em>« C'est justement le bassin 3 qui pose problème. Vos relevés dépassent les seuils de 23 %. Je vais devoir acter la fermeture administrative de l'unité. »</em>"},
      {sp:"Vous",ch:null,sc:"indus",txt:"<em>« Les relevés sont les vôtres — on ne les conteste pas. Ce que je peux vous montrer : les devis signés, le calendrier d'intervention et les seuils projetés à J+30. On rentre dans les clous. »</em>"},
      {sp:"M. Lefebvre",ch:{css:"c-lefebvre",em:"📋",nm:"M. Lefebvre"},sc:"indus",txt:"(Réfléchissant) <em>« Une mise en demeure avec délai de 30 jours, c'est envisageable… mais ça demande aussi un geste de bonne volonté de votre côté. »</em>"},
      {sp:"Vous",ch:null,sc:"indus",txt:"<em>« Un geste de bonne volonté — c'est-à-dire ? »</em>"},
      {sp:"M. Lefebvre",ch:{css:"c-lefebvre",em:"📋",nm:"M. Lefebvre"},sc:"indus",txt:"(Baissant la voix) <em>« Cela dit… il existe toujours des façons de montrer sa bonne volonté environnementale. Des façons reconnues, officielles. »</em>"},
      {sp:"M. Lefebvre",ch:{css:"c-lefebvre",em:"📋",nm:"M. Lefebvre"},sc:"indus",txt:"<em>« Mon association, Nature & Avenir, travaille sur la préservation des nappes phréatiques. Un partenariat de soutien de votre SEM d'une valeur de 10 000€, me semble être une bonne preuve d'engagement environnemental. »</em>"},
      {sp:"Vous",ch:null,sc:"indus",txt:"<em>« Vous me proposez de signer un accord avec votre association pour influencer votre rapport officiel ? »</em>"},
      {sp:"M. Lefebvre",ch:{css:"c-lefebvre",em:"📋",nm:"M. Lefebvre"},sc:"indus",txt:"(Ramassant ses papiers, calme) <em>« Appelez ça du mécénat environnemental. Vous montrez votre bonne volonté, mon rapport s'en ressent. C'est propre. »</em>"},
      {sp:"M. Lefebvre",ch:{css:"c-lefebvre",em:"📋",nm:"M. Lefebvre"},sc:"indus",txt:"(Se levant) <em>« Sans ça, l'unité 3 ferme dans 48 heures. À vous de voir si 'Horizon' mérite de rester ouvert. »</em>"},
    ],
    clues:[
      {ic:"🌐",label:"Site web de l'association",sub:"'Nature & Avenir'",title:"Bureau de l'association 'Nature & Avenir'",body:`Dans l'onglet « Notre bureau » : le <strong>trésorier de l'association est M. Pierre Lefebvre</strong> — le frère de l'inspecteur.<br><br>Deux « dons de soutien » d'entreprises du secteur environnemental ont été reçus dans les 18 derniers mois.`,alert:`Le lien direct entre l'inspecteur et l'association est établi. Un don de 10 000€ dans ce contexte serait un <strong>trafic d'influence actif</strong> — et non du mécénat.`},
      {ic:"📄",label:"Rapport QSE N-1",sub:"Historique des contrôles",title:"Rapport QSE — Inspection précédente",body:`Le rapport de l'an dernier, signé par M. Lefebvre, mentionne les mêmes bassins. Un manquement similaire avait été signalé.<br><br>Il avait été <em>« classé sans suite »</em> après une <strong>« contribution de la SEM à une initiative locale »</strong> de 8 000€.`,alert:`Ce document prouve un <strong>précédent</strong>. Si le schéma se répète, la SEM devient complice d'un système organisé de corruption.`},
    ],
    invIntro:"Le site est à l'arrêt pour l'inspection. Quelques éléments autour de vous méritent un regard.",
    hotspots:[
      {x:75, y:34, w:11, h:18, label:"Site web de l'association"},
      {x:14, y:50, w:16, h:20, label:"Rapport QSE N-1"},
    ],
    pressureIntro:"Lefebvre vous rappelle : « Sans nous, votre dossier dormira 18 mois à la préfecture. Le choix vous appartient. Vous avez 48h. »",
    choices:[
      {desc:"Proposer à la direction un don au programme environnemental de M. Lefebvre, une initiative RSE cohérente avec les valeurs de la SEM, qui faciliterait la suite des échanges.",type:"bad",badge:"🔴 Échec",bc:"badge-bad",vTitle:"Corruption active et trafic d'influence",vConsequence:`Le virement est tracé. Une enquête TRACFIN croise les données. Le frère de l'inspecteur est identifié comme trésorier. Vous et M. Lefebvre êtes mis en examen. Le site ferme quand même.`,vLegal:`<strong>Qualification :</strong> Verser un avantage à un agent public pour influencer une décision constitue une <strong>corruption active</strong> et un <strong>trafic d'influence</strong>. Peine maximale : 10 ans d'emprisonnement.`,lc:"",gauges:{i:-48,p:-16,m:-44}},
      {desc:"Contacter le supérieur hiérarchique de M. Lefebvre pour clarifier la situation et demander qu'un autre inspecteur soit missionné — la procédure sera propre.",type:"warn",badge:"🟠 Risqué",bc:"badge-warn",vTitle:"Signalement insuffisant",vConsequence:`Le supérieur de Lefebvre prend acte mais demande des preuves écrites que vous n'avez pas encore formalisées. La tentative de corruption n'est pas officiellement signalée. Lefebvre maintient son rapport défavorable. La situation s'enlise.`,vLegal:`<strong>Qualification :</strong> Contacter le N+1 sans formaliser par écrit la tentative de corruption ne constitue pas un signalement au sens de la loi Sapin II. Sans trace documentée, vous perdez la protection du lanceur d'alerte et la SEM reste exposée.`,lc:"warn",gauges:{i:-20,p:-8,m:-24}},
      {desc:"Consigner par écrit la proposition de M. Lefebvre, la transmettre au service juridique et à la DREAL, engager les travaux de mise en conformité et payer l'amende même si ça retarde le projet de trois semaines.",type:"good",badge:"🟢 Succès",bc:"badge-good",vTitle:"Courage éthique",vConsequence:`Le signalement déclenche une procédure disciplinaire contre M. Lefebvre. La SEM reçoit une amende pour le manquement environnemental, mais les travaux sont engagés. La direction vous félicite.`,vLegal:`<strong>Bonne pratique :</strong> Signaler une tentative de corruption protège juridiquement le salarié et la structure. Mieux vaut payer une amende légale que risquer une mise en examen.`,lc:"good",gauges:{i:+20,p:-4,m:+20}},
    ],
    sos:{
      situation:"M. Lefebvre, inspecteur de l'environnement, conditionne la non-fermeture du site à un versement de 10 000€ à une association dont il est personnellement proche. Des précédents similaires existent.",
      questions:["Le fait d'appeler ce versement 'mécénat' ou 'don associatif' change-t-il sa nature juridique dans ce contexte précis ?","Que se passe-t-il si je signale la tentative — et que se passe-t-il juridiquement si je ne la signale pas ?","Accepter la fermeture temporaire est-il vraiment plus coûteux que le risque pénal ?"],
      reasoning:"Le trafic d'influence se caractérise par le fait de solliciter ou d'accepter un avantage pour user de son influence sur une autorité publique. Peu importe la forme que prend l'avantage — don, mécénat, contribution — c'est le lien entre le versement et la décision administrative qui constitue l'infraction. L'existence d'un précédent renforce la qualification de système organisé. Signaler la tentative protège juridiquement la SEM et ses dirigeants ; ne pas la signaler les y expose.",
      lawRef:{label:"Art. 433-2 CP — Trafic d'influence",url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006418697"},
    },
    recap:{
      risk:"Trafic d'influence",
      definition:"Le trafic d'influence consiste à promettre ou recevoir un avantage pour user de son influence sur une autorité publique. La forme de l'avantage importe peu : argent, don, mécénat — c'est le lien avec la décision qui compte.",
      gestures:["Consigner par écrit toute proposition anormale reçue d'un agent public dans les 24h","Ne jamais verser de somme — sous quelque forme que ce soit — pour influencer une décision administrative","Accepter les conséquences réglementaires légitimes plutôt que de tenter de les contourner"],
      realLife:"Un inspecteur d'une autorité environnementale conditionne ses avis favorables à des 'contributions' à une association de randonnée qu'il dirige. Cinq entreprises versent au total 43 000€ sur 3 ans. L'inspection générale identifie le schéma. L'inspecteur est condamné à 3 ans dont 18 mois fermes. Deux entreprises sont exclues des marchés publics pour 5 ans.",
      jurisprudence:{
        titre:"Affaire BioPermis (2018)",
        resume:"Un consultant condamné à 4 ans dont 2 ferme pour trafic d'influence après avoir monnayé ses relations préfectorales pour accélérer des autorisations environnementales, pour 380 000€.",
        source:"CA Lyon, 2018"
      },
    },
    microDecisions:[
      {
        situation:"M. Lefebvre arrive sur site et se présente : « Direction régionale de l'environnement. Beau site — les installations sont récentes, ça se voit. » Comment souhaitez-vous orienter la suite ?",
        choices:[
          {letter:"A",desc:"« Avant de commencer, vous voulez déjeuner ? On peut vous présenter nos résultats en amont. »",
            sceneAfter:"restojour",
            musicAfter:"bistro.mp3",
            transitionTxt:"<em>Quelques heures plus tard. Restaurant Le Belvedère, à deux pas du centre. Lefebvre a accepté l'invitation — il choisit le menu dégustation sans une seconde d'hésitation.</em>",
            dialoguePatch:[
              {idx:1,txt:"<em>« On s'en occupe. Vous travaillez souvent dans ce secteur ? »</em>"},
              {idx:2,txt:"(Feuilletant la carte) <em>« Régulièrement. Quatorze mois d'exploitation — qu'est-ce qui vous a le plus occupé depuis l'ouverture ? »</em>"},
              {idx:3,txt:"(Posant la carte, sortant un dossier de son sac) <em>« Ce bassin de rétention — vous l'avez dimensionné comment ? La capacité tampon me semble bien calculée. »</em>"},
            ],
            dialogueInjectAt:[{
              after:2,
              lines:[
                {sp:"Vous",ch:null,sc:"restojour",txt:"<em>« L'unité 3, principalement. Des ajustements sur le bassin de rétention. Les travaux sont prêts — il a fallu du temps pour dimensionner correctement. »</em>"},
                {sp:"Narrateur",ch:null,sc:"restojour",txt:"<em>Au moment du dessert, M. Lefebvre sort un dossier de son sac.</em>"},
              ]
            }],
            reaction:{sp:"M. Lefebvre",ch:{css:"c-lefebvre",em:"📋",nm:"M. Lefebvre — Inspecteur"},txt:"(Acceptant) <em>« Vous êtes bien aimable. »</em> Il prend note de votre « bonne volonté » — et s'en souviendra quand il formulera sa demande."}},
          {letter:"B",desc:"« Bonjour Monsieur Lefebvre. Je vous guide directement vers l'unité 3 conformément au protocole. »",reaction:{sp:"M. Lefebvre",ch:{css:"c-lefebvre",em:"📋",nm:"M. Lefebvre — Inspecteur"},txt:"(Professionnel) <em>« Très bien. »</em> Il procède à l'inspection de façon strictement formelle. Sa demande viendra — mais sans contexte de connivence."}},
          {letter:"C",desc:"« Avant l'inspection, laissez-moi vous présenter nos derniers investissements environnementaux. Ça vous donnera le contexte. »",reaction:{sp:"M. Lefebvre",ch:{css:"c-lefebvre",em:"📋",nm:"M. Lefebvre — Inspecteur"},txt:"(L'air intéressé) <em>« Je vois que vous tenez à votre image… »</em> Il a enregistré votre besoin de bien paraître — exactement ce dont il a besoin pour la suite."}},
        ]
      },
      {
        situation:"Les relevés sont hors limites. M. Lefebvre annonce un rapport très sévère, puis laisse traîner un silence avant d'évoquer « une autre voie ».",
        choices:[
          {letter:"A",desc:"« Je suis prêt(e) à écouter toute solution qui évite la fermeture du site. »",gauges:{i:-4,p:0,m:0},tint:true,reaction:{sp:"M. Lefebvre",ch:{css:"c-lefebvre",em:"📋",nm:"M. Lefebvre — Inspecteur"},txt:"(Avec une assurance décuplée) <em>« Je savais que vous étiez pragmatique. Il y a toujours des façons de montrer sa bonne volonté environnementale. On peut en parler dans un moment plus calme. »</em>"}},
          {letter:"B",desc:"« Je ne suis pas sûr(e) de saisir où vous voulez en venir — et je préfère ne pas aller plus loin sans ma hiérarchie. »",gauges:{i:0,p:0,m:0},tint:false,reaction:{sp:"M. Lefebvre",ch:{css:"c-lefebvre",em:"📋",nm:"M. Lefebvre — Inspecteur"},txt:"(Pris de court, se ressaisissant) <em>« Je parlais simplement de… comment votre structure montre sa bonne foi environnementale. C'est une question de méthode. »</em>"}},
          {letter:"C",desc:"« Je prends note. Laissez-moi 24h pour revenir vers vous avec notre position officielle. »",gauges:{i:0,p:0,m:0},tint:false,reaction:{sp:"M. Lefebvre",ch:{css:"c-lefebvre",em:"📋",nm:"M. Lefebvre — Inspecteur"},txt:"(Souriant légèrement) <em>« Bien sûr. Je vous prépare quelque chose de… mesuré dans la forme. »</em> Vous venez de lui donner du temps pour formuler une demande difficile à prouver."}},
        ]
      },
    ],
    transitions:{
      1:{sp:"Narrateur",txt:`Horizon tient bon. Les équipements du centre sont au cœur des prochaines tensions. Un fournisseur vous invite à déjeuner — il se montre beaucoup trop généreux.`},
      5:{sp:"Narrateur",txt:`Horizon tient bon. Mais de nouvelles pressions se profilent. Vous devez décrocher un contrat crucial pour rentabiliser le centre. Un directeur municipal a une proposition pour le moins surprenante.`},
      6:{sp:"Narrateur",txt:`Horizon tient bon. Une opportunité foncière se présente pour agrandir le site. Vous devez valider un achat de terrain qui cache de mauvaises surprises.`},
      intermediate:{sp:"Narrateur",txt:`L'inspection est résolue. Vous avez affronté les situations les plus critiques pour votre service. Il est temps de faire le point avant de continuer.`},
    },
  },

  // ═══════════════════════════════════════
  // CHAPITRE 6 — Les Références Gonflées
  // ═══════════════════════════════════════
  { num:"Affaire 6",name:"Les Références Gonflées",sub:"Faux en écriture & Déclaration mensongère",dureeMin:4,
    sc:"mairie",playerRole:"Responsable Développement",
    context:{eye:"🤝 Affaire 6",title:"Décrocher le contrat de Val-Vert",body:`<strong>Responsable Développement.</strong> La ville de Val-Vert représente une opportunité majeure pour rentabiliser Horizon. Mme Perrin, Directrice des Services Techniques de la mairie, vous reçoit pour examiner votre dossier de candidature. Son diagnostic est clair : techniquement, vous êtes compétitifs. Mais la commission exige <strong>trois références sur des marchés similaires</strong> — et la SEM n'en a pas suffisamment.`},
    preDialogue:[
      {sp:"Narrateur",sc:"mairie",txt:"<em>Salle de réunion de la mairie de Val-Vert. Mme Perrin pose le dossier de consultation sur la table.</em>"},
    ],
    dialogue:[
      {sp:"Mme Perrin",ch:{css:"c-perrin",em:"🏛️",nm:"Mme Perrin — DST Val-Vert"},sc:"mairie",txt:"<em>« {prenom}. Votre dossier est arrivé hier. Permettez-moi d'être direct : sur les critères techniques, vous êtes dans la moyenne. Mais la commission pèse lourd sur les références. On attend trois marchés comparables sur les cinq dernières années. »</em>"},
      {sp:"Vous",ch:null,sc:"mairie",txt:"<em>« On a travaillé sur des marchés similaires. Certains en co-traitance. »</em>"},
      {sp:"Mme Perrin",ch:{css:"c-perrin",em:"🏛️",nm:"Mme Perrin"},sc:"mairie",txt:"(sans sourciller) <em>« Co-traitance, j'entends mais la commission elle, elle lit les chiffres. Part de marché, tonnages traités, résultats. Si votre taux d'implication était de 20% sur un marché à 5 000 tonnes, ça fait 1 000 tonnes à votre actif. Pas 5 000. »</em>"},
      {sp:"Vous",ch:null,sc:"mairie",txt:"<em>« Je comprends. »</em>"},
      {sp:"Mme Perrin",ch:{css:"c-perrin",em:"🏛️",nm:"Mme Perrin"},sc:"mairie",txt:"(posant un stylo) <em>« Vous avez jusqu'à vendredi pour déposer la version définitive. Si les références ne sont pas solides, la commission ne pourra pas vous retenir — même si votre offre technique est bonne par ailleurs. »</em>"},
      {sp:"Narrateur",ch:null,sc:"bureauPerrin",txt:"<em>Le rendez-vous se termine. De retour au bureau.</em>"},
    ],
    clues:[
      {ic:"📋",label:"Grille de notation",sub:"Critères de la commission — Val-Vert",title:"Grille d'évaluation — Appel d'offres Val-Vert",body:`La commission attribue <strong>30 points sur 100</strong> aux références clients. Le règlement précise : <em>« Sont recevables les marchés de collecte ou traitement dépassant 2 000 tonnes/an, sur les cinq dernières années. »</em><br><br>Le seuil minimal pour rester en lice est fixé à <strong>15/30</strong>. En dessous, le dossier est éliminé d'office.`,alert:`La SEM n'a pas de marché en propre dépassant ce seuil. Les co-traitances ne peuvent être déclarées qu'à hauteur de la part réelle de la SEM dans chaque opération.`},
      {ic:"📧",label:"Mail de Terraval",sub:"Partenaire sous-traitant — Saint-Amand",title:"Échange avec Terraval — Marché de Saint-Amand",body:`Terraval a travaillé avec la SEM sur un marché de collecte à Saint-Amand (4 800 tonnes/an). La SEM intervenait en co-traitance minoritaire à <strong>15%</strong>, soit 720 tonnes à son actif.<br><br>Terraval a proposé de « formuler les choses de façon valorisante » dans une éventuelle attestation pour Val-Vert.`,alert:`Une attestation qui présenterait la SEM comme opérateur principal sur Saint-Amand serait un faux document. Terraval s'exposerait à des poursuites pour <strong>faux témoignage</strong>, et la SEM pour <strong>faux en écriture</strong> et usage de faux.`},
      {ic:"📁",label:"Brouillon du dossier",sub:"Page références — Version actuelle",title:"Dossier de candidature — Page références",body:`La page références est presque vide. Trois lignes : deux co-traitances mineures et un marché en propre à 900 tonnes, hors seuil.<br><br>Une note en marge, de votre main : <em>« Reformuler Saint-Amand ? Terraval OK pour attester. »</em>`,alert:`Cette note, si elle est découverte lors d'un contrôle, établit la preuve d'une intention de falsification. Même non envoyée, elle peut servir de pièce à charge.`},
    ],
    invIntro:"Vendredi, c'est dans deux jours. Trois documents sont sur la table.",
    hotspots:[
      {x:62, y:50, w:16, h:18, label:"Grille de notation"},
      {x:72, y:55, w:14, h:15, label:"Mail de Terraval"},
      {x:80, y:45, w:12, h:18, label:"Brouillon du dossier"},
    ],
    pressureIntro:"Perrin vous envoie un message : « La décision se prend la semaine prochaine. Vendredi dernier délai — la commission n'attend pas. »",
    choices:[
      {desc:"Contacter Terraval pour obtenir une attestation présentant la SEM comme opérateur principal sur Saint-Amand et ajuster les chiffres du dossier en conséquence.",type:"bad",badge:"🔴 Échec",bc:"badge-bad",vTitle:"Faux en écriture et corruption de témoins",vConsequence:`Le dossier est retenu. Le marché est attribué à la SEM. Un an plus tard, la ville de Saint-Amand est consultée dans le cadre d'un audit croisé entre collectivités. Les tonnages ne correspondent pas. Le marché de Val-Vert est résilié pour fausse déclaration. Terraval est convoqué. Vous êtes mis(e) en cause pour faux en écriture et usage de faux.`,vLegal:`<strong>Qualification :</strong> <strong>Faux en écriture</strong> (art. 441-1 CP) + <strong>corruption de témoins</strong> (art. 434-15 CP). Cumul passible de 3 à 5 ans d'emprisonnement. La SEM peut être exclue des marchés publics pour 5 ans.`,lc:"",gauges:{i:-40,p:-12,m:-36}},
      {desc:"Reformuler les références de co-traitance de façon avantageuse en valorisant la part maximale de la SEM dans chaque marché — sans changer les chiffres bruts.",type:"warn",badge:"🟠 Risqué",bc:"badge-warn",vTitle:"Déclaration mensongère",vConsequence:`Le dossier franchit le seuil. La SEM remporte le marché. Lors de l'exécution, un audit de la commission révèle l'écart entre la présentation et les pièces justificatives. Mme Perrin envoie un courrier de mise en demeure. Le service juridique de la SEM ouvre une enquête interne.`,vLegal:`<strong>Qualification :</strong> Une présentation délibérément trompeuse des références dans un marché public constitue une <strong>déclaration mensongère</strong> (art. 441-6 CP). Même sans falsification de documents, l'inexactitude intentionnelle expose à une exclusion et à des poursuites.`,lc:"warn",gauges:{i:-18,p:+10,m:-16}},
      {desc:"Déposer le dossier tel quel avec les vraies références, accompagné d'une note explicative sur le contexte de montée en charge de la SEM — en acceptant de ne pas être retenu.",type:"good",badge:"🟢 Succès",bc:"badge-good",vTitle:"Dossier honnête",vConsequence:`La SEM ne franchit pas le seuil de 15/30 et est éliminée. Mme Perrin vous appelle pour vous expliquer les retours de la commission. Six mois plus tard, un appel d'offres similaire est publié dans la région. La SEM y soumissionne avec un vrai partenariat de référence monté avec Terraval et remporte le marché.`,vLegal:`<strong>Bonne pratique :</strong> Un dossier honnête, même insuffisant, protège la SEM en cas de contrôle ultérieur. La transparence sur les limites actuelles crédibilise la montée en puissance future.`,lc:"good",gauges:{i:+20,p:-6,m:+20}},
    ],
    sos:{
      situation:"La SEM n'a pas suffisamment de références pour franchir le seuil minimal de la commission. Un partenaire sous-traitant propose de fournir une attestation gonflée. La tentation est de reformuler ou de falsifier le dossier pour rester en lice.",
      questions:["Reformuler une co-traitance de façon avantageuse est-il différent de la falsifier ?","Qu'est-ce qui distingue une déclaration mensongère d'une fausse information ?","Que risque la SEM si elle perd ce marché honnêtement, versus si elle est prise à falsifier ?"],
      reasoning:"La déclaration mensongère dans un marché public ne requiert pas de faux document officiel : une présentation intentionnellement inexacte des références suffit à constituer l'infraction. La distinction entre 'valorisation' et 'falsification' est appréciée par le juge selon l'intention et l'écart entre ce qui est déclaré et la réalité vérifiable. Demander à un tiers de fournir une attestation inexacte constitue une corruption de témoins, infraction distincte et cumulable. À l'inverse, un dossier honnête crée une traçabilité qui protège la SEM pour les appels d'offres futurs.",
      lawRef:{label:"Art. 441-1 CP — Faux en écriture",url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006418731"},
    },
    recap:{
      risk:"Faux en écriture & Déclaration mensongère",
      definition:"Le faux en écriture consiste à altérer la vérité dans un document, de nature à causer un préjudice. La déclaration mensongère est une présentation intentionnellement inexacte de faits dans le cadre d'une procédure officielle. Les deux infractions peuvent se cumuler.",
      gestures:["Ne jamais présenter une co-traitance comme une référence en propre sans mentionner explicitement la part réelle","Ne jamais solliciter d'attestation auprès d'un partenaire dont vous savez qu'elle sera inexacte","En cas de dossier insuffisant, privilégier la transparence et la note explicative — cela protège pour les appels d'offres futurs"],
      realLife:"Un prestataire de services de propreté remporte un marché municipal en présentant des références gonflées sur ses tonnages traités. Un audit croisé entre collectivités révèle l'écart deux ans plus tard. Le dirigeant est condamné pour faux en écriture. La société est exclue des marchés publics pour 3 ans et doit rembourser les honoraires perçus.",
      jurisprudence:{
        titre:"Affaire des références gonflées en Loire-Atlantique (2021)",
        resume:"Un prestataire de services environnementaux condamné à 2 ans avec sursis pour faux en écriture et usage de faux après avoir présenté des références de co-traitance comme des marchés en propre dans trois appels d'offres successifs. Le marché attribué a été résilié et la société exclue des marchés publics pour 3 ans.",
        source:"TJ Nantes, 2021"
      },
    },
    microDecisions:[
      {
        situation:"Mme Perrin vient de vous accueillir dans la salle de réunion. Elle a votre dossier sous les yeux — elle n'a pas encore regardé la page des références.",
        choices:[
          {letter:"A",desc:"« Bonjour Mme Perrin. On est très motivés par ce contrat — on a une vraie expertise à apporter. »",reaction:{sp:"Mme Perrin",ch:{css:"c-perrin",em:"🏛️",nm:"Mme Perrin — DST Val-Vert"},txt:"(posant le dossier) <em>« Je n'en doute pas. Mais la motivation, ça ne suffit pas à cocher les cases de la commission. »</em> Elle ouvre directement la page des références."}},
          {letter:"B",desc:"« Bonjour. Je suis prêt(e) à répondre à vos questions sur l'offre technique. »",reaction:{sp:"Mme Perrin",ch:{css:"c-perrin",em:"🏛️",nm:"Mme Perrin — DST Val-Vert"},txt:"(feuilletant le dossier) <em>« Le technique, c'est solide. C'est la partie références qui va nous poser problème. »</em>"}},
          {letter:"C",desc:"« Bonjour Mme Perrin. Je souhaitais d'abord comprendre vos critères de sélection. »",reaction:{sp:"Mme Perrin",ch:{css:"c-perrin",em:"🏛️",nm:"Mme Perrin — DST Val-Vert"},txt:"(s'installant) <em>« Bonne question. Justement — c'est sur les références que ça va se jouer pour vous. »</em>"}},
        ]
      },
      {
        phoneRing:true,
        situation:"Votre téléphone sonne. C'est Mme Perrin — elle confirme le délai. Vendredi, c'est dans deux jours. Vous raccrochez. Le dossier de références est ouvert devant vous. La ligne est presque vide.",
        choices:[
          {letter:"A",desc:"« Je rappelle Terraval pour leur demander une attestation qui valorise mieux notre rôle sur Saint-Amand. »",gauges:{i:-4,p:0,m:0},tint:true,reaction:{sp:"Narrateur",ch:null,txt:"Terraval accepte sans poser de questions. L'attestation arrive le lendemain. Le dossier part avec des chiffres qui ne reflètent pas la réalité. Mme Perrin accuse réception : <em>« Dossier reçu. La commission se réunit jeudi. »</em>"}},
          {letter:"B",desc:"« Je dépose le dossier tel quel avec une note explicative sur notre contexte de montée en charge. »",gauges:{i:0,p:0,m:0},tint:false,reaction:{sp:"Narrateur",ch:null,txt:"Le dossier part dans l'heure. Mme Perrin vous rappelle le surlendemain : <em>« J'ai bien reçu votre dossier et votre note. C'est honnête. Je ne peux pas vous promettre que la commission sera convaincue. »</em>"}},
          {letter:"C",desc:"« Je reformule les co-traitances de façon plus avantageuse — sans changer les chiffres bruts. »",gauges:{i:-2,p:0,m:0},tint:true,reaction:{sp:"Narrateur",ch:null,txt:"Vous retravaillez la page références pendant deux heures. Le dossier part vendredi matin. Mme Perrin en accuse réception : <em>« Hmm. La formulation est… créative. Je transmets à la commission. »</em>"}},
        ]
      },
    ],
    transitions:{
      1:{sp:"Narrateur",txt:`La candidature est déposée. Mais les risques sont partout dans Horizon. Un fournisseur vous invite à déjeuner — il se montre beaucoup trop généreux.`},
      6:{sp:"Narrateur",txt:`Horizon se développe. Une opportunité foncière se présente pour agrandir le site. Vous devez valider un achat de terrain qui cache de mauvaises surprises.`},
      intermediate:{sp:"Narrateur",txt:`Le cap est tenu. Vous avez affronté les situations les plus critiques pour votre service. Il est temps de faire le point avant de continuer.`},
    },
  },

  // ═══════════════════════════════════════
  // CHAPITRE 7 — L'Extension Horizon
  // ═══════════════════════════════════════
  { num:"Affaire 7",name:"L'Extension Horizon",sub:"Prise illégale d'intérêts & Contrats de complaisance",dureeMin:5,
    sc:"bureau2",playerRole:"Responsable Juridique",
    context:{eye:"⚖️ Affaire 7",title:"L'acquisition du terrain adjacent",body:`<strong>Responsable Juridique.</strong> La SEM doit acquérir un terrain de 3 hectares pour agrandir Horizon. Mme Ruiz, consultante foncière externe mandatée par le vendeur, arrive avec une offre « exceptionnelle » — bien en dessous du prix du marché. Trop belle pour être honnête.`},
    dialogue:[
      {sp:"Narrateur",ch:null,sc:"bureau2",txt:"<em>Mme Ruiz s'installe en face de vous, dossier sur la table. Elle a l'assurance de quelqu'un qui a déjà fait ça cent fois.</em>"},
      {sp:"Mme Ruiz",ch:{css:"c-ruiz",em:"📐",nm:"Mme Ruiz"},sc:"bureau2",txt:"(Ouvrant le dossier) <em>« {prenom}. J'ai une opportunité rare pour la SEM — un terrain de 3 hectares, directement adjacent à Horizon, au prix de 380 000€. L'estimation France Domaines est à 618 000€. »</em>"},
      {sp:"Vous",ch:null,sc:"bureau2",txt:"<em>« Un écart de 238 000€. Qui est le vendeur ? »</em>"},
      {sp:"Mme Ruiz",ch:{css:"c-ruiz",em:"📐",nm:"Mme Ruiz"},sc:"bureau2",txt:"(Rassurante, vague) <em>« Succession, montage fiscal, urgence de liquidités — le tout en toute discrétion. Gérer ces paramètres pour vous, c'est mon rôle. »</em>"},
      {sp:"Mme Ruiz",ch:{css:"c-ruiz",em:"📐",nm:"Mme Ruiz"},sc:"bureau2",txt:"(Changeant de registre) <em>« J'ai d'ailleurs facilité deux autres dossiers pour la SEM. La centrale solaire sur le toit du dépôt. L'achat du transformateur sur la ZAC. Ces opérations se sont bien passées, non ? »</em>"},
      {sp:"Vous",ch:null,sc:"bureau2",txt:"<em>« Oui… effectivement. »</em>"},
      {sp:"Mme Ruiz",ch:{css:"c-ruiz",em:"📐",nm:"Mme Ruiz"},sc:"bureau2",txt:"<em>« C'est exactement le même type de montage. Il faut juste un peu de souplesse sur les identités, et de la discrétion côté propriétaire. »</em>"},
      {sp:"Vous",ch:null,sc:"bureau2",txt:"<em>« Qui est le propriétaire, exactement ? »</em>"},
      {sp:"Mme Ruiz",ch:{css:"c-ruiz",em:"📐",nm:"Mme Ruiz"},sc:"bureau2",txt:"(Soudain moins bavarde) <em>« Une SCI. Les actionnaires préfèrent rester discrets — c'est une condition de la vente. »</em>"},
      {sp:"Narrateur",ch:null,sc:"bureau2",txt:"<em>Une SCI. Discrets. Ce mot résonne. M. Aubert — administrateur du CA, celui qui s'était montré si « attentionné » lors du recrutement — ne vous a-t-il pas mentionné un projet foncier « en famille » ?</em>"},
      {sp:"Mme Ruiz",ch:{css:"c-ruiz",em:"📐",nm:"Mme Ruiz"},sc:"bureau2",txt:"(Posant une facture sur le bureau) <em>« Voilà pour mes honoraires de mise en relation. 15 000€ — sans détail de prestations. C'est la pratique dans ce type de montage, vous le savez. »</em>"},
      {sp:"Mme Ruiz",ch:{css:"c-ruiz",em:"📐",nm:"Mme Ruiz"},sc:"bureau2",txt:"(Se levant, déjà prête à partir) <em>« Vous avez jusqu'à vendredi. Le propriétaire a d'autres acquéreurs. Je vous laisse le dossier. »</em>"},
    ],
    clues:[
      {ic:"📊",label:"Évaluation des Domaines",sub:"Terrain parcelle AH-204",title:"Évaluation France Domaines — Parcelle AH-204",body:`L'évaluation officielle de France Domaines, datée de 3 mois, estime la valeur vénale du terrain à <strong>618 000€</strong>.<br><br>Le prix proposé de 380 000€ représente un écart de <strong>238 000€</strong> par rapport à la valeur de marché.`,alert:`Acquérir un bien à un prix significativement inférieur à sa valeur réelle auprès d'un proche d'élu constitue un risque majeur de <strong>prise illégale d'intérêts</strong>. C'est le niveau 12/12 dans la cartographie des risques Sapin II.`},
      {ic:"🏛️",label:"Extrait cadastral",sub:"Propriétaire : SCI Horizons Verts",title:"Composition de la SCI Horizons Verts",body:`La SCI Horizons Verts est détenue à 60% par <strong>M. Bernard Aumont</strong> — le beau-frère de M. Aubert, administrateur de la SEM et élu du département (que vous connaissez peut-être déjà).<br><br>M. Aubert siège au conseil d'administration qui devra valider cet achat.`,alert:`Le vendeur est un proche direct d'un administrateur de la SEM qui participera au vote. Cela crée un conflit d'intérêts direct et caractérisé — <strong>prise illégale d'intérêts</strong> pour M. Aubert s'il ne se déporte pas.`},
    ],
    invIntro:"Les documents sont sur la table. Les chiffres ne mentent pas.",
    hotspots:[
      {x:50, y:57, w:20, h:17, label:"Évaluation des Domaines"},
      {x:64, y:4,  w:21, h:30, label:"Extrait cadastral"},
    ],
    pressureIntro:"Mme Ruiz vous prévient : « Le vendeur a d'autres acheteurs. Si vous ne signez pas cette semaine, le terrain part à quelqu'un d'autre. Et ma facture reste due. »",
    choices:[
      {desc:"Signer l'acquisition et valider la facture de Mme Ruiz — le prix est avantageux pour la SEM, et l'extension ne peut pas attendre.",type:"bad",badge:"🔴 Échec",bc:"badge-bad",vTitle:"Prise illégale d'intérêts",vConsequence:`La vente est actée. La chambre régionale des comptes examine les comptes de la SEM. L'écart de prix, le lien familial avec M. Aubert et la facture sans livrable sont mis en évidence. Vous, Dominique et M. Aubert êtes mis en cause. Le conseil d'administration est dissous.`,vLegal:`<strong>Qualifications :</strong> Acquérir un bien à prix sous-évalué auprès d'un proche d'élu = <strong>prise illégale d'intérêts</strong>. Payer une facture sans livrable identifié = <strong>contrat de complaisance</strong>, assimilé à un détournement de fonds.`,lc:"",gauges:{i:-48,p:-16,m:-44}},
      {desc:"Demander une contre-expertise à un notaire extérieur indépendant, sans en informer Mme Ruiz au préalable.",type:"warn",badge:"🟠 Risqué",bc:"badge-warn",vTitle:"Bonne intention, mauvaise méthode",vConsequence:`L'audit interne prend du temps. Des fuites internes alertent Mme Ruiz qui presse pour une signature rapide. La presse locale évoque « une opération foncière trouble » à la SEM. L'extension est suspendue 4 mois.`,vLegal:`<strong>Qualification :</strong> L'audit interne n'est pas suffisant ici — la présence d'un administrateur en conflit d'intérêts impose une saisine externe. La prudence bien intentionnée sans bonne procédure crée quand même un risque réputationnel.`,lc:"warn",gauges:{i:-12,p:-12,m:-16}},
      {desc:"Suspendre la procédure, saisir France Domaines pour évaluation indépendante, refuser toute facture de Mme Ruiz sans livrable documenté, et déclarer au déontologue le lien entre M. Aubert et le dossier, même si ça bloque l'extension pendant deux mois.",type:"good",badge:"🟢 Succès",bc:"badge-good",vTitle:"Protection juridique maximale",vConsequence:`Vous saisissez le service juridique. M. Aubert est invité à se déporter du vote. Une nouvelle évaluation confirme 618 000€. La SEM négocie au juste prix. Mme Ruiz disparaît du dossier. Le terrain est acquis proprement.`,vLegal:`<strong>Bonne pratique :</strong> Exiger une évaluation France Domaines, refuser toute facture sans livrable et déclarer le conflit d'intérêts sont les trois réflexes qui protègent la structure et ses dirigeants.`,lc:"good",gauges:{i:+20,p:+6,m:+20}},
    ],
    sos:{
      situation:"Mme Ruiz propose l'acquisition d'un terrain sous-évalué de 238 000€ avec une facture de 15 000€ sans livrable. Le vendeur est le beau-frère d'un administrateur de la SEM qui doit voter l'acquisition.",
      questions:["M. Aubert peut-il légalement participer au vote du conseil d'administration sur cette acquisition ?","Une facture sans description de prestation peut-elle être légalement réglée par une structure publique ?","Ces deux risques — prix et conflit d'intérêts — sont-ils indépendants ou liés ?"],
      reasoning:"La prise illégale d'intérêts exige que l'agent ait eu un intérêt dans l'opération qu'il surveille ou valide. M. Aubert doit se déporter formellement du vote — son abstention informelle ne suffit pas. Sur la facture : le règlement d'une facture sans contrepartie identifiable constitue un contrat de complaisance, assimilable à un détournement de fonds. Les deux infractions sont cumulatives et indépendantes — l'une peut exister sans l'autre. La sous-évaluation du terrain à 238 000€ en dessous de l'estimation officielle constitue en elle-même un signal d'alarme de niveau maximal dans toute cartographie Sapin II.",
      lawRef:{label:"Art. 432-12 CP — Prise illégale d'intérêts",url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006418679"},
    },
    recap:{
      risk:"Prise illégale d'intérêts & Contrat de complaisance",
      definition:"La prise illégale d'intérêts vise l'agent qui participe à une décision dans laquelle il a un intérêt indirect. Le contrat de complaisance désigne un paiement sans contrepartie réelle, servant à masquer un avantage illicite.",
      gestures:["Exiger le déport formel de tout administrateur en situation de conflit d'intérêts, avant tout vote","Refuser toute facture ne comportant pas de description précise et vérifiable de la prestation","Commander une évaluation France Domaines pour toute acquisition foncière, sans exception"],
      realLife:"Un conseil d'administration d'une SEM vote l'acquisition d'un terrain appartenant à la belle-famille d'un de ses membres, sans déport. L'écart entre le prix payé et l'estimation officielle est de 180 000€. La chambre régionale saisit le procureur. L'administrateur est condamné à 2 ans avec sursis et inéligibilité. La SEM doit rembourser l'écart à l'État.",
      jurisprudence:{
        titre:"Affaire foncière de Languedoc (2021)",
        resume:"Un directeur de SEM et un administrateur condamnés respectivement à 3 ans et 2 ans avec sursis pour prise illégale d'intérêts après l'acquisition d'un terrain à prix minoré auprès d'un proche de l'administrateur.",
        source:"CA Montpellier, 2021"
      },
    },
    microDecisions:[
      {
        situation:"Mme Ruiz vient de vous exposer l'offre : 3 hectares, 380 000€ pour une valeur de marché à 618 000€. Elle invoque 'une succession, un montage fiscal, une urgence de liquidités'. Comment réagissez-vous ?",
        choices:[
          {letter:"A",desc:"« C'est effectivement une belle opportunité pour la SEM. On peut envisager une signature rapide ? »",reaction:{sp:"Mme Ruiz",ch:{css:"c-ruiz",em:"📐",nm:"Mme Ruiz — Consultante foncière"},txt:"(S'animant) <em>« Je savais que vous étiez quelqu'un de pragmatique. »</em> Elle se redresse légèrement, l'air d'avoir déjà mentalement conclu l'affaire."}},
          {letter:"B",desc:"« Quelle est votre lettre de mandat ? Et l'évaluation France Domaines du vendeur, vous l'avez ? »",reaction:{sp:"Mme Ruiz",ch:{css:"c-ruiz",em:"📐",nm:"Mme Ruiz — Consultante foncière"},txt:"(Légèrement déstabilisée) <em>« Le mandat est en cours de finalisation… et le vendeur préfère éviter les démarches administratives longues. »</em> Elle balaie la question."}},
          {letter:"C",desc:"« Ce dossier m'intéresse. Donnez-moi l'ensemble — je le transmets à notre comité d'évaluation. »",reaction:{sp:"Mme Ruiz",ch:{css:"c-ruiz",em:"📐",nm:"Mme Ruiz — Consultante foncière"},txt:"(Posant les documents) <em>« Bien sûr. »</em> Elle reste souriante. Elle pense que le comité ne sera qu'une formalité — et vous venez de l'y inviter."}},
        ]
      },
      {
        situation:"Mme Ruiz vient de partir. Elle a laissé le dossier, une facture de 15 000€ sans détail de prestations, et sa carte. Vendredi, c'est dans deux jours.",
        choices:[
          {letter:"A",desc:"« Je transmets au service comptable pour les honoraires et je prépare la délibération pour vendredi. »",gauges:{i:-4,p:0,m:0},tint:true,reaction:{sp:"Mme Ruiz",ch:{css:"c-ruiz",em:"📐",nm:"Mme Ruiz — Consultante foncière"},txt:"(Par téléphone, satisfaite) <em>« Parfait. Je passe vous voir demain pour finaliser les détails. »</em> La voie est ouverte — et vous venez de le lui confirmer."}},
          {letter:"B",desc:"« Je suspends tout. Avant toute délibération, je commande une évaluation France Domaines et j'identifie le vendeur. »",gauges:{i:0,p:0,m:0},tint:false,reaction:{sp:"Mme Ruiz",ch:{css:"c-ruiz",em:"📐",nm:"Mme Ruiz — Consultante foncière"},txt:"<em>« L'évaluation prend des semaines — le propriétaire ne peut pas attendre. »</em> Elle insiste. Vous tenez bon."}},
          {letter:"C",desc:"« Je rappelle Mme Ruiz pour lui demander de détailler sa facture. Ça permettra au moins de la passer en comptabilité. »",gauges:{i:0,p:0,m:0},tint:false,reaction:{sp:"Mme Ruiz",ch:{css:"c-ruiz",em:"📐",nm:"Mme Ruiz — Consultante foncière"},txt:"(Décontractée) <em>« 'Conseil en acquisition foncière' — c'est suffisant pour votre comptabilité ? »</em> Elle a répondu en trente secondes. Le fond du problème reste entier."}},
        ]
      },
    ],
    transitions:{2:{sp:"Narrateur",txt:`L'acquisition est suspendue. Mais les pressions foncières ne sont pas les seules à peser sur la SEM. Un prestataire historique a besoin d'une faveur urgente.`}},
  },

  // ═══════════════════════════════════════
  // CHAPITRE 8 — L'Urgence de fin de mois
  // ═══════════════════════════════════════
  { num:"Affaire 8",name:"L'Urgence de fin de mois",sub:"Finance & Fraude au virement bancaire",dureeMin:4,
    sc:"finance",playerRole:"Responsable Finance",
    context:{eye:"💰 Affaire 8",title:"L'appel téléphonique de ProSite",body:`<strong>Responsable Finance de la SEM.</strong> L'audit trimestriel de Francine, la contrôleuse de gestion du groupe, est prévu vendredi — dans 72 heures. M. Renaud, dirigeant de ProSite SARL — prestataire historique sur le chantier Horizon depuis cinq ans — vous appelle en fin de journée. Il a besoin d'un règlement urgent. Et il a un argument : une pièce critique dont le site a besoin avant l'audit.`},
    dialogue:[
      {sp:"Narrateur",ch:null,sc:"finance",txt:"<em>Il commence par les souvenirs communs — cinq ans de projet ensemble. Le terrain est préparé.</em>"},
      {sp:"M. Renaud",ch:{css:"c-renaud",em:"🏭",nm:"M. Renaud"},sc:"finance",txt:"<em>« Cinq ans qu'on travaille ensemble sur Horizon. Le terrassement du hall B, les fondations, le réseau technique — ProSite a tenu les délais quand personne d'autre n'aurait pu. Vous le savez mieux que quiconque. »</em>"},
      {sp:"Vous",ch:null,sc:"finance",txt:"<em>« C'est vrai. Que se passe-t-il ? »</em>"},
      {sp:"M. Renaud",ch:{css:"c-renaud",em:"🏭",nm:"M. Renaud"},sc:"finance",txt:"<em>« Un retard de règlement d'un client — rien de dramatique en temps normal. Mais là j'ai un problème de trésorerie court terme. J'aurais besoin qu'on règle la prochaine facture dès cette semaine, avant réception. Juste pour passer le mois. »</em>"},
      {sp:"Vous",ch:null,sc:"finance",txt:"<em>« Une avance n'est pas prévue dans notre contrat, M. Renaud. Ce type de décision nécessite une autorisation préalable. »</em>"},
      {sp:"M. Renaud",ch:{css:"c-renaud",em:"🏭",nm:"M. Renaud"},sc:"finance",txt:"(changeant de registre) <em>« Je comprends les procédures. Mais il y a la pièce de remplacement pour la ligne B — le motoréducteur principal. Si la facture n'est pas réglée avant jeudi, le fournisseur ne me la libère pas. Et sans cette pièce… l'audit de vendredi se passe en présence d'une ligne à l'arrêt. »</em>"},
      {sp:"Vous",ch:null,sc:"finance",txt:"<em>« Et vous proposez comment de régulariser cette avance ? »</em>"},
      {sp:"M. Renaud",ch:{css:"c-renaud",em:"🏭",nm:"M. Renaud"},sc:"finance",txt:"(plus confidentiel) <em>« Et pour aller vite, la facture que je vous envoie est à 32 500€ au lieu de 29 800€ — la différence me donne de la marge pour avancer les frais du motoréducteur. C'est ponctuel. »</em>"},
      {sp:"Vous",ch:null,sc:"finance",txt:"<em>« Ce que vous décrivez, c'est une surfacturation. C'est une irrégularité comptable pour vous comme pour nous. »</em>"},
      {sp:"M. Renaud",ch:{css:"c-renaud",em:"🏭",nm:"M. Renaud"},sc:"finance",txt:"<em>« Pour aller plus vite, j'ai transmis un nouveau RIB par mail il y a une heure. Ça évite de passer par la trésorerie centrale. Vous avez dû recevoir le mail. »</em>"},
      {sp:"Vous",ch:null,sc:"finance",txt:"<em>« Je l'ai bien reçu. Et je vois aussi l'alerte automatique de notre logiciel de conformité — tout changement de RIB déclenche une vérification obligatoire. Je prends note de votre demande et vous rappelle dans la journée après vérification. »</em>"},
    ],
    clues:[
      {ic:"🔴",label:"Alerte conformité",sub:"Changement de RIB — Signalement automatique",title:"Alerte logiciel — Changement de coordonnées bancaires",body:`Le logiciel de conformité a généré une alerte rouge à 18h12 : le RIB de ProSite SARL a été modifié unilatéralement, sans document signé du bénéficiaire ni validation du service juridique.<br><br>Le nouveau RIB est domicilié dans une banque différente des paiements habituels.`,alert:`La fraude au faux RIB représente 32% des détournements de fonds en comptabilité. Aucun changement de coordonnées bancaires ne peut être validé sans procédure formelle et double vérification indépendante.`},
      {ic:"📋",label:"Contrat ProSite",sub:"Absence de clause d'avance",title:"Contrat ProSite SARL — Article 12",body:`Le contrat signé en 2021 avec ProSite SARL ne contient aucune clause autorisant des avances de trésorerie. L'article 12 prévoit des paiements à 45 jours après livraison et validation du bon de réception.<br><br>La dernière facture ProSite a été réglée dans les délais contractuels.`,alert:`Accorder une avance hors clause contractuelle constitue une irrégularité budgétaire. Associée à une surfacturation, elle qualifie un <strong>détournement de fonds</strong> au détriment de la SEM.`},
      {ic:"📊",label:"Historique paiements",sub:"5 ans de virements au RIB d'origine",title:"Export comptable — Historique ProSite SARL",body:`23 virements sur 5 ans, tous au même RIB, pour un total de 487 000€. Aucune anomalie de montant. La dernière facture (29 800€) réglée il y a 18 jours.<br><br>La demande actuelle porte sur 32 500€ — un montant 9% supérieur, pour une prestation non encore livrée.`,alert:`Le nouveau RIB n'a jamais été utilisé dans l'historique. Un changement soudain de coordonnées combiné à une demande d'avance urgente correspond aux critères de la fraude documentaire.`},
    ],
    invIntro:"L'alerte est active. Trois éléments méritent votre attention avant de rappeler M. Renaud.",
    hotspots:[
      {x:52, y:52, w:18, h:18, label:"Alerte conformité"},
      {x:38, y:60, w:15, h:15, label:"Contrat ProSite"},
      {x:6,  y:60, w:18, h:16, label:"Historique paiements"},
    ],
    pressureIntro:"M. Renaud vous rappelle : « Si le virement n'est pas fait avant demain matin, la pièce n'arrive pas avant votre audit. Francine va tout trouver. »",
    choices:[
      {desc:"Valider l'avance sur le nouveau RIB avec une note interne « sous réserve de vérification », si le RIB est régulier, l'exception est couverte ; si ce n'est pas le cas, la note prouve la bonne foi.",type:"bad",badge:"🔴 Échec",bc:"badge-bad",vTitle:"Détournement de fonds",vConsequence:`La pièce est livrée. L'audit se passe sans incident visible. Trois semaines plus tard, le vrai compte ProSite signale ne jamais avoir reçu le virement : le nouveau RIB appartient à une société écran. L'enquête remonte à votre validation du changement de RIB malgré l'alerte automatique. Vous êtes mis(e) en cause pour complicité de détournement.`,vLegal:`<strong>Qualification :</strong> Valider un changement de RIB non authentifié malgré une alerte de conformité, combiné à une surfacturation, constitue une <strong>complicité de détournement de fonds</strong> (art. 432-15 CP). L'exception invoquée ne suspend pas l'obligation de contrôle.`,lc:"",gauges:{i:-40,p:-8,m:-32}},
      {desc:"Valider l'avance sur l'ancien RIB uniquement — cela évite le risque du nouveau RIB non vérifié et débloque la livraison avant l'audit.",type:"warn",badge:"🟠 Risqué",bc:"badge-warn",vTitle:"Avance irrégulière",vConsequence:`Le virement part sur l'ancien RIB, ProSite le reçoit. La pièce est livrée. Mais l'avance sans clause contractuelle est relevée par l'auditrice Francine. Elle demande la décision écrite du conseil d'administration. Il n'y en a pas. Votre responsabilité personnelle est engagée pour avoir outrepassé vos délégations de pouvoir.`,vLegal:`<strong>Qualification :</strong> Une avance accordée hors clause contractuelle, même bien intentionnée, constitue une <strong>irrégularité budgétaire</strong>. Sans validation hiérarchique formelle, elle expose le signataire à une mise en cause disciplinaire et financière.`,lc:"warn",gauges:{i:-16,p:+6,m:-12}},
      {desc:"Bloquer tout paiement, signaler le changement de RIB au service conformité comme alerte de fraude potentielle, et informer la DG que la livraison sera retardée même si ça crée une tension avec le prestataire à 72h de l'audit.",type:"good",badge:"🟢 Succès",bc:"badge-good",vTitle:"Procédure exemplaire",vConsequence:`Le service conformité bloque le nouveau RIB et remonte l'alerte. L'enquête révèle une tentative de fraude au virement — les mails de ProSite avaient été compromis par un tiers. M. Renaud est lui-même victime. La pièce est commandée directement par la SEM en urgence. L'audit se passe normalement.`,vLegal:`<strong>Bonne pratique :</strong> La vérification systématique des changements de RIB et le refus d'avances non contractuelles sont les deux réflexes fondamentaux de la conformité financière. Le signalement active les protections du dispositif d'alerte interne Sapin II.`,lc:"good",gauges:{i:+20,p:-4,m:+20}},
    ],
    sos:{
      situation:"M. Renaud, prestataire historique depuis cinq ans, demande un règlement anticipé hors contrat accompagné d'une surfacturation, et transmet un nouveau RIB qui a déclenché une alerte automatique de conformité.",
      questions:["L'alerte de conformité sur le RIB peut-elle être ignorée même en situation d'urgence ?","Une avance accordée sur l'ancien RIB engage-t-elle quand même ma responsabilité ?","Quel est le niveau de ma délégation de pouvoir pour ce type de décision ?"],
      reasoning:"La fraude au virement bancaire par faux RIB est l'un des vecteurs les plus courants de détournement de fonds. Une alerte automatique de conformité ne peut jamais être ignorée — elle déclenche une procédure de vérification obligatoire. Sur l'avance : même bien intentionnée, une avance accordée hors clause contractuelle engage la responsabilité personnelle du signataire. La délégation du Responsable Finance ne couvre généralement pas les paiements anticipés non prévus au contrat.",
      lawRef:{label:"Art. 432-15 CP — Détournement de fonds",url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006418693"},
    },
    recap:{
      risk:"Détournement de fonds & Fraude au virement bancaire",
      definition:"Le détournement de fonds désigne le fait, pour un agent, de permettre la soustraction de fonds publics. La fraude au virement par faux RIB est la technique la plus fréquente : un tiers substitue les coordonnées bancaires d'un fournisseur légitime pour intercepter un paiement.",
      gestures:["Ne jamais valider un changement de RIB sans procédure formelle : signature du bénéficiaire + visa service juridique","Refuser toute avance de trésorerie non prévue au contrat, quelle que soit la pression temporelle","Signaler immédiatement au service conformité toute demande de paiement dérogatoire accompagnée d'un changement de coordonnées"],
      realLife:"Un responsable financier d'une SEM valide une demande urgente d'avance accompagnée d'un changement de RIB, malgré une alerte automatique. Le nouveau RIB appartient à une société écran. 48 000€ sont détournés. Le prestataire légitime n'a jamais reçu le virement. La négligence grave du responsable financier — avoir ignoré l'alerte — engage sa responsabilité disciplinaire et civile.",
      jurisprudence:{
        titre:"Fraude au RIB dans un EPCI normand (2023)",
        resume:"Un prestataire condamné à 5 ans dont 3 ferme pour escroquerie après avoir substitué un RIB frauduleux lors d'une demande d'avance urgente, détournant 85 000€. Le comptable ayant validé sans vérification a été sanctionné disciplinairement.",
        source:"TJ Rouen, 2023"
      },
    },
    microDecisions:[
      {
        phoneRing: true,
        situation:"Votre téléphone sonne. M. Renaud, dirigeant de ProSite SARL — partenaire depuis cinq ans — demande à vous parler d'une 'chose délicate'.",
        choices:[
          {letter:"A",desc:"« M. Renaud, je vous écoute. »",reaction:{sp:"M. Renaud",ch:{css:"c-renaud",em:"🏭",nm:"M. Renaud — ProSite SARL"},txt:"(Soulagé) <em>« Merci de décrocher. Voilà la situation… »</em>"}},
          {letter:"B",desc:"« Bonsoir M. Renaud. Je vous écoute, mais pour tout engagement je vous préviens : ça devra passer par la procédure habituelle. »",reaction:{sp:"M. Renaud",ch:{css:"c-renaud",em:"🏭",nm:"M. Renaud — ProSite SARL"},txt:"<em>« Je comprends. Mais c'est urgent — laissez-moi vous expliquer. »</em>"}},
          {letter:"C",desc:"« Bonsoir M. Renaud. Allez-y. »",reaction:{sp:"M. Renaud",ch:{css:"c-renaud",em:"🏭",nm:"M. Renaud — ProSite SARL"},txt:"<em>« Bonsoir. Voilà — je vais être direct avec vous… »</em>"}},
        ]
      },
      {
        situation:"M. Renaud vient de raccrocher. L'alerte de changement de RIB est active sur votre écran. L'audit de Francine commence vendredi — dans 72 heures.",
        choices:[
          {letter:"A",desc:"« Je valide le virement sur le nouveau RIB — si c'est régulier, la pièce est débloquée avant l'audit. »",gauges:{i:-4,p:0,m:0},tint:true,reaction:{sp:"M. Renaud",ch:{css:"c-renaud",em:"🏭",nm:"M. Renaud — ProSite SARL"},txt:"(Par mail, immédiatement) <em>« Parfait. Je vous envoie la confirmation dans l'heure. »</em> Vous venez de valider un changement de RIB non authentifié malgré l'alerte automatique."}},
          {letter:"B",desc:"« Je bloque tout paiement et je signale le changement de RIB au service conformité immédiatement. »",gauges:{i:0,p:0,m:0},tint:false,reaction:{sp:"Narrateur",ch:null,txt:"L'alerte est transmise. Le changement de RIB est bloqué en attente de vérification indépendante. Aucun paiement ne peut être effectué dans l'intervalle."}},
          {letter:"C",desc:"« Je rappelle M. Renaud pour lui faire confirmer le nouveau RIB par téléphone avant d'aller plus loin. »",gauges:{i:-2,p:0,m:0},tint:false,reaction:{sp:"M. Renaud",ch:{css:"c-renaud",em:"🏭",nm:"M. Renaud — ProSite SARL"},txt:"<em>« Le RIB est correct, je vous assure. Notre banque a changé récemment. »</em> Sa réponse est immédiate — mais une confirmation verbale ne vaut pas une procédure de vérification formelle."}},
        ]
      },
    ],
    transitions:{2:{sp:"Narrateur",txt:`L'alerte a été traitée. Mais d'autres anomalies couvent dans les systèmes financiers de la SEM. Vous recevez un rapport qui révèle des modifications inexpliquées dans les bulletins de paie.`}},
  },

  // ═══════════════════════════════════════
  // CHAPITRE 9 — Opération Prestige
  // ═══════════════════════════════════════
  { num:"Affaire 9",name:"Opération Prestige",sub:"Relations Publiques & Mécénat de complaisance",dureeMin:5,
    sc:"tennis",playerRole:"Responsable Relations Publiques",
    context:{eye:"📣 Affaire 9",title:"Le Maire et le permis bloqué",body:`<strong>Responsable Relations Publiques de la SEM.</strong> Le projet Horizon doit s'étendre sur une parcelle adjacente. La demande de permis de construire, déposée il y a huit semaines, est bloquée dans les services d'urbanisme de Villenord. M. Fontaine, le maire — personnage cordial et populaire — vous a invité à un entretien « institutionnel ». Il préside également le TC Villenord, club de tennis amateur en difficulté financière.`},
    dialogue:[
      {sp:"Narrateur",ch:null,sc:"tennis",txt:"<em>M. Fontaine vous accueille au TC Villenord et vous propose de visiter les courts avant de passer en salle de réunion.</em>"},
      {sp:"M. Fontaine",ch:{css:"c-fontaine",em:"🏛️",nm:"M. Fontaine — Maire de Villenord"},sc:"tennis",txt:"<em>« Entrez donc ! Vous voulez un café ? J'en prenais justement un. Vous connaissez notre ville depuis longtemps maintenant, non ? »</em>"},
      {sp:"Vous",ch:null,sc:"tennis",txt:"<em>« Quelques années. Horizon a vraiment transformé le secteur Est. »</em>"},
      {sp:"M. Fontaine",ch:{css:"c-fontaine",em:"🏛️",nm:"M. Fontaine"},sc:"tennis",txt:"(souriant) <em>« Et comment ! C'est pour ça que je tenais à vous rencontrer en personne. La SEM fait partie du tissu local maintenant. »</em> (un silence) <em>« Vous avez vu nos courts au TC Villenord ? Fondé en 1968, cent vingt licenciés. L'an dernier on a failli perdre la section compétition jeunes faute de moyens. »</em>"},
      {sp:"Vous",ch:null,sc:"tennis",txt:"<em>« Je n'étais pas au courant de ces difficultés. »</em>"},
      {sp:"M. Fontaine",ch:{css:"c-fontaine",em:"🏛️",nm:"M. Fontaine"},sc:"tennis",txt:"<em>« Pour certains de ces jeunes, c'est le seul cadre structurant qu'ils aient. Je préside le club depuis dix-huit ans. »</em> (il repose son café, ton légèrement différent) <em>« Mais parlons de votre projet d'extension. J'ai pris connaissance du dossier de permis. Il y a quelques points techniques que mes services souhaitent approfondir. »</em>"},
      {sp:"Vous",ch:null,sc:"tennis",txt:"<em>« Nous avons déposé un dossier complet il y a huit semaines. Le délai légal d'instruction est de deux mois. »</em>"},
      {sp:"M. Fontaine",ch:{css:"c-fontaine",em:"🏛️",nm:"M. Fontaine"},sc:"tennis",txt:"(toujours souriant, ton plus direct) <em>« Le délai légal, oui. Mais les délais réels dépendent des priorités des services — et ils sont débordés en ce moment. Certains dossiers avancent vite, d'autres… attendent le bon contexte. Vous comprenez le fonctionnement. »</em>"},
      {sp:"Vous",ch:null,sc:"tennis",txt:"<em>« Je comprends. Quel serait ce 'bon contexte', selon vous ? »</em>"},
      {sp:"M. Fontaine",ch:{css:"c-fontaine",em:"🏛️",nm:"M. Fontaine"},sc:"tennis",txt:"<em>« Notre Gala de la Solidarité Territoriale est dans six semaines. Deux cents convives — les élus du département, le sous-préfet, les partenaires institutionnels. On cherche un partenaire prestige à hauteur de 50 000€. Logo sur tous les supports, dix tables VIP, mention dans le discours d'ouverture. Pour la SEM, c'est une belle visibilité. »</em>"},
      {sp:"Vous",ch:null,sc:"tennis",txt:"<em>« C'est une proposition de mécénat. »</em>"},
      {sp:"M. Fontaine",ch:{css:"c-fontaine",em:"🏛️",nm:"M. Fontaine"},sc:"tennis",txt:"(se levant pour prendre congé) <em>« Exactement. Et entre des partenaires qui se respectent, on s'arrange pour que les choses avancent dans un esprit de confiance mutuelle. Mon assistante vous enverra la convention de partenariat aujourd'hui. Je suis certain qu'on trouvera un terrain d'entente. »</em>"},
      {sp:"Narrateur",ch:null,sc:"bureau9",txt:"<em>Retour au bureau. La convention de M. Fontaine est dans votre boîte mail.</em>"},
      {sp:"M. Fontaine",ch:{css:"c-fontaine",em:"🏛️",nm:"M. Fontaine — Maire de Villenord"},sc:"bureau9",txt:"(Voix assurée) <em>« {prenom} ? Fontaine. J'espère que vous avez bien reçu la convention. Mon assistante m'a dit qu'elle était partie ce soir. »</em>",phoneRing:true},
      {sp:"Vous",ch:null,sc:"bureau9",txt:"<em>« Je viens de l'ouvrir. La clause 4b… »</em>"},
      {sp:"Vous",ch:null,sc:"bureau9",txt:"(Lisant à voix haute) <em>« 'La Ville s'engage à traiter le dossier de permis en priorité absolue, avec instruction accélérée sous quatre semaines…' C'est écrit noir sur blanc. »</em>"},
      {sp:"M. Fontaine",ch:{css:"c-fontaine",em:"🏛️",nm:"M. Fontaine"},sc:"bureau9",txt:"(Coupant doucement) <em>« C'est une formulation habituelle pour ce type de partenariat. Prenez le temps d'y réfléchir — mais vendredi, je dois confirmer votre place parmi nos convives. »</em>"},
    ],
    clues:[
      {ic:"📄",label:"Convention de partenariat",sub:"Clause 4b — Examen prioritaire conditionnel",title:"Convention Mécénat Prestige — Clause 4b",body:`La convention de 4 pages comporte une clause inhabituelle : la Ville s'engage à traiter le dossier de permis « en priorité absolue, avec instruction accélérée sous quatre semaines ». Cette clause lie un acte administratif discrétionnaire à une contrepartie financière privée.<br><br>La convention est signée par M. Fontaine lui-même.`,alert:`Conditionner une décision administrative à un versement financier constitue la définition légale du <strong>trafic d'influence actif</strong> et de la <strong>corruption active</strong>. La mise par écrit aggrave considérablement la qualification.`},
      {ic:"⚖️",label:"Note juridique SEM",sub:"Mécénat conditionnel — Risques juridiques",title:"Note direction juridique — Mécénat & Conflits d'intérêts",body:`Une note interne de 2024 rappelle : tout partenariat avec une collectivité impliquée dans une procédure administrative concernant la SEM est soumis à validation préalable du déontologue. Tout lien direct ou indirect entre le mécénat et une décision administrative expose à une qualification de corruption active ou de trafic d'influence.`,alert:`L'article 433-1 du Code pénal punit de 10 ans d'emprisonnement et 1 000 000€ d'amende le fait de proposer un avantage à une personne dépositaire de l'autorité publique pour qu'elle accomplisse un acte de sa fonction.`},
      {ic:"🎾",label:"Registre des intérêts",sub:"M. Fontaine — Président du TC Villenord",title:"Registre des déclarations d'intérêts — Mairie de Villenord",body:`Le registre public des déclarations d'intérêts mentionne la présidence de M. Fontaine au TC Villenord depuis 2008. Le bénéficiaire final du mécénat de 50 000€ est donc une association présidée par le signataire de la décision administrative sollicitée.<br><br>Le conflit d'intérêts est objectif et documenté.`,alert:`Le mécénat d'une association présidée par un élu dont on attend une décision favorable constitue une <strong>hospitalité excessive</strong> et un <strong>mécénat de complaisance</strong>, indépendamment des intentions déclarées.`},
    ],
    invIntro:"La convention est sur votre bureau. Trois documents éclairent la situation avant de répondre.",
    hotspots:[
      {x:30, y:16, w:35, h:36, label:"Convention de partenariat"},
      {x:78, y:38, w:16, h:22, label:"Note juridique SEM"},
      {x:28, y:60, w:20, h:14, label:"Registre des intérêts"},
    ],
    pressureIntro:"Fontaine vous appelle : « J'ai regardé votre dossier de permis. Il manque des éléments. Si on se revoyait pour en parler autour d'un verre ? Je dois confirmer les places vendredi. »",
    choices:[
      {desc:"Signer la convention de partenariat culturel — 50 000€, visibilité territoriale, cohérence RSE. La clause 4b est standard dans ce type de partenariat public-privé.",type:"bad",badge:"🔴 Échec",bc:"badge-bad",vTitle:"Corruption active et hospitalités excessives",vConsequence:`Le permis est délivré en quinze jours. Mais la convention — avec la clause 4b — figure dans les archives de la mairie. Un concurrent obtient le document dans le cadre d'une procédure. La clause 4b est transmise au parquet. Vous, la SEM et M. Fontaine êtes mis en examen. Le permis est suspendu.`,vLegal:`<strong>Qualification :</strong> Conditionner par écrit une décision administrative à un versement constitue une <strong>corruption active</strong> (art. 433-1 CP) et un <strong>trafic d'influence</strong> (art. 433-2 CP). Les hospitalités aux élus aggravent la qualification.`,lc:"",gauges:{i:-40,p:+17,m:-36}},
      {desc:"Proposer un partenariat de 50 000€ avec le TC Villenord, sans référence au permis dans le contrat, en convenant oralement que les délais d'instruction seront fluidifiés.",type:"warn",badge:"🟠 Risqué",bc:"badge-warn",vTitle:"Risque de mécénat de complaisance",vConsequence:`La clause 4b est retirée à votre demande. Vous versez 50 000€. Le permis est délivré trois semaines plus tard dans ce qui ressemble à une accélération. Un journaliste local pointe le lien temporel. La SEM est contrainte de s'expliquer publiquement. La requalification en mécénat de complaisance reste possible.`,vLegal:`<strong>Qualification :</strong> Même sans clause explicite, verser un avantage à un élu qui doit rendre une décision favorable crée un lien de complaisance. L'absence de preuve écrite ne supprime pas le risque pénal — elle le déplace.`,lc:"warn",gauges:{i:-16,p:+6,m:-16}},
      {desc:"Répondre à M. Fontaine par courrier que la SEM est disposée à soutenir le tissu associatif local via un appel à partenariats ouvert géré par le service juridique — sans aucun calendrier lié au permis, en prenant le risque que l'instruction soit encore ralentie.",type:"good",badge:"🟢 Succès",bc:"badge-good",vTitle:"Mécénat transparent et traçable",vConsequence:`Vous signalez la clause 4b à votre déontologue. La SEM propose une contre-convention sans référence au permis, soumise au comité d'éthique. M. Fontaine accuse réception avec une froideur visible. Le permis est instruit dans les délais légaux normaux. Le processus est inattaquable.`,vLegal:`<strong>Bonne pratique :</strong> Un mécénat transparent, dissocié de toute procédure administrative et validé par le déontologue, est la seule voie légale. La traçabilité protège la SEM et l'élu lui-même d'une qualification pénale future.`,lc:"good",gauges:{i:+20,p:+11,m:+20}},
    ],
    sos:{
      situation:"Le maire de Villenord conditionne implicitement l'instruction du permis de construire à un mécénat de 50 000€ pour son club de tennis, et l'a formalisé par écrit dans une clause contractuelle.",
      questions:["Le fait que la demande soit formulée sous forme de 'mécénat' change-t-il sa qualification juridique ?","Payer sans la clause 4b mais en espérant un traitement favorable crée-t-il quand même un risque ?","Comment dissocier complètement le mécénat de la procédure administrative ?"],
      reasoning:"Le trafic d'influence se caractérise par le lien entre un avantage accordé et une décision attendue d'une autorité publique — peu importe la forme (don, mécénat, sponsoring). Ici, la clause 4b matérialise ce lien par écrit, ce qui aggrave la qualification. Même sans clause explicite, l'enchaînement temporel mécénat → décision favorable peut être requalifié en mécénat de complaisance. La seule voie sûre est la dissociation totale et documentée des deux démarches.",
      lawRef:{label:"Art. 433-1 CP — Corruption active",url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006418695"},
    },
    recap:{
      risk:"Corruption active & Mécénat de complaisance",
      definition:"La corruption active consiste à proposer un avantage à un agent public pour obtenir une décision en sa faveur. Le mécénat de complaisance est un don ou sponsoring conditionné, implicitement ou explicitement, à une contrepartie administrative.",
      gestures:["Soumettre tout mécénat impliquant une collectivité en position d'autorité à validation préalable du déontologue","Ne jamais lier un partenariat financier à une procédure administrative en cours, même implicitement","Exiger la suppression de toute clause contractuelle liant un avantage financier à une décision publique"],
      realLife:"Une société privée verse 40 000€ à une association culturelle présidée par un élu municipal en charge d'un permis d'aménagement. La convention de mécénat est retrouvée lors d'une enquête préliminaire. Le dirigeant de la société est condamné à 2 ans avec sursis pour corruption active. L'élu est condamné pour corruption passive. Le permis est annulé par le tribunal administratif.",
      jurisprudence:{
        titre:"Affaire du permis contre le don (Hérault, 2019)",
        resume:"Un maire condamné à 3 ans dont 1 ferme pour corruption passive après avoir conditionné la délivrance d'un permis de construire à un don de 30 000€ à son association sportive.",
        source:"CA Montpellier, 2019"
      },
    },
    microDecisions:[
      {
        situation:"Vous arrivez au TC Villenord. M. Fontaine vous accueille chaleureusement, café à la main. L'atmosphère est cordiale — peut-être trop.",
        choices:[
          {letter:"A",desc:"« Bonjour Monsieur le Maire. Merci de votre invitation. »",reaction:{sp:"M. Fontaine",ch:{css:"c-fontaine",em:"🏛️",nm:"M. Fontaine — Maire de Villenord"},txt:"(Souriant) <em>« Asseyez-vous, asseyez-vous ! Un café ? J'aime ce genre d'entretien — ça permet de se parler vraiment. »</em> Il prend le temps d'installer un rapport de confiance avant d'aborder le vrai sujet."}},
          {letter:"B",desc:"« Bonjour. Je viens surtout faire le point sur notre dossier de permis, si vous le permettez. »",reaction:{sp:"M. Fontaine",ch:{css:"c-fontaine",em:"🏛️",nm:"M. Fontaine — Maire de Villenord"},txt:"(Souriant, redirigeant) <em>« Le permis, bien sûr, bien sûr. Mais d'abord, laissez-moi vous parler de ce qui fait vraiment Villenord… »</em> Il prend la main sur l'agenda."}},
          {letter:"C",desc:"« Belle ville. On sent que vous y êtes attaché depuis longtemps. »",reaction:{sp:"M. Fontaine",ch:{css:"c-fontaine",em:"🏛️",nm:"M. Fontaine — Maire de Villenord"},txt:"(Ravi) <em>« Dix-huit ans que je suis élu ici. D'ailleurs — vous connaissez notre club de tennis, le TC Villenord ? »</em> Votre chaleur lui ouvre la porte du discours qu'il préparait."}},
        ]
      },
      {
        situation:"Votre téléphone vibre. C'est M. Fontaine — il va vous appeler pour confirmer la convention. La deadline qu'il vous a fixée : vendredi, dans trois jours.",
        choices:[
          {letter:"A",desc:"« Ce partenariat a du sens pour la SEM. Je prépare un retour à M. Fontaine avant vendredi. »",gauges:{i:-4,p:0,m:0},tint:true,reaction:{sp:"M. Fontaine",ch:{css:"c-fontaine",em:"🏛️",nm:"M. Fontaine — Maire de Villenord"},txt:"(Par téléphone, chaleureux) <em>« Je suis ravi de votre intérêt. Mon assistante vous enverra la convention dans la journée — lisez-la bien. »</em>"}},
          {letter:"B",desc:"« La clause 4b conditionne un acte administratif à un versement. Je transmets au service juridique et au déontologue. »",gauges:{i:0,p:0,m:0},tint:false,reaction:{sp:"Narrateur",ch:null,txt:"Le dossier est transmis. Le déontologue ouvre une procédure. M. Fontaine est contacté par les services du préfet."}},
          {letter:"C",desc:"« Je rappelle l'assistante pour qu'elle retire la clause 4b — on verra pour le reste ensuite. »",gauges:{i:+2,p:0,m:0},tint:false,reaction:{sp:"M. Fontaine",ch:{css:"c-fontaine",em:"🏛️",nm:"M. Fontaine — Maire de Villenord"},txt:"(Rappelant dans l'heure) <em>« La clause est retirée, pas de problème. Mais vous comprenez bien que l'esprit de notre partenariat reste le même. »</em> Le problème de fond n'a pas bougé d'un centimètre."}},
        ]
      },
    ],
    transitions:{5:{sp:"Narrateur",txt:`Le permis est en cours. Mais la pression commerciale n'attend pas. Vous devez convaincre une ville de confier son contrat de déchets à la SEM. Un directeur municipal a une proposition pour le moins surprenante.`}},
  },

  // ═══════════════════════════════════════
  // CHAPITRE 10 — Le Contrat à tout prix
  // ═══════════════════════════════════════
  { num:"Affaire 10",name:"Le Contrat à tout prix",sub:"Commercial & Corruption active",dureeMin:6,
    sc:"commercial",playerRole:"Directeur Commercial",
    context:{eye:"📈 Affaire 10",title:"L'appel d'offres à 8 millions",body:`<strong>Directeur Commercial de la SEM.</strong> Les scores techniques de l'appel d'offres viennent de tomber : EcoTri Solutions est à 74 points, la SEM à 72. Dominique, la DG, vous convoque en urgence. L'enjeu : un contrat à <strong>8 millions d'euros sur cinq ans</strong>, et la viabilité de toute la branche Est.`},
    dialogue:[
      {sp:"Narrateur",ch:null,sc:"bureaujour",txt:"<em>Quelques instants plus tôt. Dominique vous a exposé la situation.</em>"},
      {sp:"Dominique",ch:{css:"c-dominique",em:"🧑‍💼",nm:"Dominique — DG"},sc:"bureaujour",txt:"<em>« {prenom}, asseyez-vous. Les scores techniques sont tombés. Nous : 72 sur 100. EcoTri : 74. Deux points d'écart sur un marché à 8 millions, cinq ans. »</em> (silence) <em>« Ce contrat, c'est deux recrutements et la viabilité de toute la branche Est. Je ne vous cache rien. »</em>"},
      {sp:"Vous",ch:null,sc:"bureaujour",txt:"<em>« Notre offre technique est solide. On peut travailler la partie prix. »</em>"},
      {sp:"Dominique",ch:{css:"c-dominique",em:"🧑‍💼",nm:"Dominique"},sc:"bureaujour",txt:"<em>« Le prix ne suffit pas à combler deux points sur le technique. Mme Deschamps m'a contacté — elle dit avoir des pistes. Je vous laisse le voir. C'est votre décision. »</em>"},
      {sp:"Narrateur",ch:null,sc:"commercial",txt:"<em>Retour dans le présent. Mme Deschamps ouvre son dossier.</em>"},
      {sp:"Mme Deschamps",ch:{css:"c-deschamps",em:"🕴️",nm:"Mme Deschamps — Consultante"},sc:"commercial",txt:"(ton professionnel) <em>« Votre offre technique est solide — deux points d'écart sur cent, c'est peu. Ce qui fait parfois la différence à ce stade, c'est la relation. M. Aubert — conseiller communautaire de l'agglomération attributaire, que vous connaissez peut-être — siège dans la commission de suivi du marché. C'est un passionné de golf. Il y a un tournoi invitationnel à Biarritz dans quinze jours. Ce type de mise en relation se gère via le budget de représentation. Dans les clous comptables. »</em>"},
      {sp:"Vous",ch:null,sc:"commercial",txt:"<em>« M. Aubert siège dans la commission de suivi ? Un voyage à ce moment précis du calendrier… »</em>"},
      {sp:"Mme Deschamps",ch:{css:"c-deschamps",em:"🕴️",nm:"Mme Deschamps"},sc:"commercial",txt:"(calme) <em>« Ce mot est fort. Ça se pratique dans tous les secteurs. »</em> (sortant son téléphone) <em>« J'ai aussi accès à une veille concurrentielle très précise sur ce secteur — incluant les fourchettes tarifaires des principaux acteurs en lice. Une analyse de positionnement fine vous permettrait de caler votre prix de façon chirurgicale. Mission de conseil : 8 000€ d'honoraires. »</em>"},
      {sp:"Vous",ch:null,sc:"commercial",txt:"<em>« Cette 'veille' — d'où viennent ces données exactement ? »</em>"},
      {sp:"Mme Deschamps",ch:{css:"c-deschamps",em:"🕴️",nm:"Mme Deschamps"},sc:"commercial",txt:"(rangeant son téléphone) <em>« Des sources dans le secteur. Rien que vous ne pourriez trouver vous-même. »</em>"},
      {sp:"Vous",ch:null,sc:"commercial",txt:"<em>« Si je comprends bien, une partie de votre réseau a un rôle direct dans l'attribution de ce contrat ? »</em>"},
      {sp:"Mme Deschamps",ch:{css:"c-deschamps",em:"🕴️",nm:"Mme Deschamps"},sc:"commercial",txt:"(posément) <em>« Je vous décris deux façons de gagner un contrat à 8 millions. Votre concurrent, lui, ne fait pas les mêmes scrupules. »</em> (consultant l'interface de suivi) <em>« Le dépôt des offres ferme dans 48 heures. EcoTri est toujours devant. Le délai de dépôt court toujours. 48 heures, c'est court. »</em>"},
      {sp:"Vous",ch:null,sc:"commercial",txt:"<em>« Et si nous déposons une offre irréprochable et que nous perdons ? »</em>"},
      {sp:"Mme Deschamps",ch:{css:"c-deschamps",em:"🕴️",nm:"Mme Deschamps"},sc:"commercial",txt:"(se levant, posant sa carte) <em>« Vous demandez un débriefing officiel. Vous revenez sur le prochain appel d'offres, dans dix-huit mois, avec une offre encore meilleure. C'est l'une des options. L'autre, elle, ne se représentera pas deux fois. 48 heures. »</em>"},
    ],
    clues:[
      {ic:"📜",label:"Règlement AO",sub:"Article 18 — Interdiction de contact",title:"Règlement de consultation — Article 18",body:`L'article 18 interdit formellement tout contact avec les membres du jury d'attribution, directement ou par l'intermédiaire d'un tiers, pendant la période d'évaluation. Toute violation entraîne l'élimination de la candidature et peut donner lieu à des poursuites pénales.`,alert:`La réception d'informations sur l'offre d'un concurrent constitue un <strong>recel</strong> (art. 321-1 CP). L'offre d'un voyage à un décideur public qualifie une <strong>corruption active</strong> (art. 433-1 CP).`},
      {ic:"🔍",label:"Casier judiciaire",sub:"Mme Deschamps — Condamnée pour recel en 2019",title:"Recherche presse — Mme Deschamps",body:`Une recherche révèle que Mme Deschamps a été condamnée en 2019 à 18 mois avec sursis pour recel de documents confidentiels dans le secteur de la gestion des déchets. Elle exerce sous un statut de micro-entreprise depuis 2020.`,alert:`Recourir à un intermédiaire condamné pour des faits similaires aggrave la qualification pénale. La connaissance de son passé judiciaire élimine toute possibilité de bonne foi.`},
      {ic:"📧",label:"Mail de 'La Source'",sub:"Données confidentielles exfiltrées",title:"Mail transmis par Mme Deschamps — Métadonnées",body:`Le mail contient une feuille de calcul portant l'en-tête de l'agglomération avec les estimations tarifaires de trois candidats. Les métadonnées indiquent : créé par un agent de la direction des marchés publics de l'agglomération trois jours avant la date limite de dépôt.`,alert:`Ce document est une information privilégiée exfiltrée illégalement. Sa simple <strong>réception et conservation</strong> oblige à une déclaration immédiate au pouvoir adjudicateur, sous peine d'élimination et de poursuites pour recel.`},
    ],
    invIntro:"Trois documents sont sur la table. Chacun éclaire une facette de ce que Mme Deschamps vous propose.",
    hotspots:[
      {x:20, y:52, w:18, h:18, label:"Règlement AO"},
      {x:52, y:48, w:16, h:16, label:"Casier judiciaire"},
      {x:10, y:56, w:16, h:16, label:"Mail de 'La Source'"},
    ],
    pressureIntro:"Mme Deschamps vous relance : « Mon contact n'attend pas. Vos concurrents ont déjà dit oui. Vous perdez ce marché si vous ne décidez pas maintenant. »",
    choices:[
      {desc:"Mandater Mme Deschamps pour organiser un voyage d'étude technique à Biarritz pour M. Aubert — budget de représentation, facturé en frais de déplacement institutionnel.",type:"bad",badge:"🔴 Échec",bc:"badge-bad",vTitle:"Corruption active et recel",vConsequence:`Le marché est attribué à la SEM. Six semaines plus tard, la source interne à l'agglomération est identifiée lors d'un audit informatique. Elle parle. Mme Deschamps est interpellée. Son téléphone contient vos échanges. La SEM est convoquée par la DGCCRF. Le marché est annulé. Francine ouvre une enquête sur les frais de développement commercial.`,vLegal:`<strong>Qualification :</strong> <strong>Corruption active</strong> (art. 433-1 CP) + <strong>recel</strong> (art. 321-1 CP). Cumul passible de 10 ans d'emprisonnement. Les fausses factures pour dissimuler les paiements ajoutent un <strong>faux en écriture</strong>.`,lc:"",gauges:{i:-48,p:+22,m:-40}},
      {desc:"Faire un don de 15 000€ à la Fondation Territoire & Avenir, organisation reconnue, don tracé, déductible fiscalement — sans passer par Mme Deschamps.",type:"warn",badge:"🟠 Risqué",bc:"badge-warn",vTitle:"Trafic d'influence actif",vConsequence:`Le don de 15 000€ est versé. Le marché est attribué à la SEM. Six mois plus tard, un audit de la Fondation révèle des flux suspects. M. Loubier est mis en examen. Il désigne ses donateurs. La SEM figure parmi eux, avec une facture de « formation » qui ne correspond à aucune prestation réelle.`,vLegal:`<strong>Qualification :</strong> Le financement d'une association d'élu pour influer sur une décision de commande publique constitue un <strong>trafic d'influence actif</strong> (art. 433-2 CP). Les fausses factures ajoutent un <strong>faux en écriture</strong> (art. 441-2 CP).`,lc:"warn",gauges:{i:-20,p:+11,m:-16}},
      {desc:"Notifier par écrit à la direction que Mme Deschamps a proposé des méthodes contraires au code pénal, couper tout contact avec elle, renforcer l'offre sur les critères objectifs — et accepter que deux points d'écart signifient peut-être une perte.",type:"good",badge:"🟢 Succès",bc:"badge-good",vTitle:"Offre irréprochable",vConsequence:`Vous signalez le contact au déontologue — la tentative est documentée. La SEM perd le marché de deux points. Vous demandez un débriefing officiel. Les retours permettent d'identifier deux axes d'amélioration. Dix-huit mois plus tard, la SEM remporte un marché similaire avec une offre renforcée. Mme Deschamps est poursuivie pour tentative de corruption active.`,vLegal:`<strong>Bonne pratique :</strong> Signaler une tentative de corruption protège la SEM pénalement et administrativement. La perte du marché, dans ce contexte, est un risque assumé et géré — pas un échec.`,lc:"good",gauges:{i:+20,p:-4,m:+20}},
    ],
    sos:{
      situation:"Une consultante propose trois méthodes illégales pour remporter un appel d'offres à 8 millions : un voyage à un décideur public, des informations confidentielles sur un concurrent, et le financement d'une association d'élu. Le dépôt des offres ferme dans 48 heures.",
      questions:["Un voyage offert à un décideur public est-il illégal même s'il n'est pas explicitement lié au marché ?","La simple réception du mail contenant les prix d'EcoTri m'engage-t-elle déjà juridiquement ?","Perdre un marché en restant irréprochable est-il juridiquement et stratégiquement préférable ?"],
      reasoning:"La corruption active ne nécessite pas de lien explicite entre l'avantage et la décision — le simple fait d'offrir un avantage à un décideur public suffit à constituer l'infraction. Sur le mail des prix : la réception d'informations confidentielles issues d'un accès non autorisé aux données d'un concurrent constitue un recel, même passif. L'obligation de déclaration au pouvoir adjudicateur est immédiate. Perdre un marché en ayant signalé une tentative de corruption crée une protection juridique forte et une traçabilité qui peut servir lors de futurs appels d'offres.",
      lawRef:{label:"Art. 433-1 CP — Corruption active",url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006418695"},
    },
    recap:{
      risk:"Corruption active & Recel",
      definition:"La corruption active consiste à proposer un avantage à un agent public pour obtenir une décision favorable. Le recel est le fait de détenir ou d'utiliser un bien ou une information dont on sait qu'il provient d'un crime ou d'un délit.",
      gestures:["Refuser tout avantage proposé à un décideur public, même sans lien apparent avec le marché","Signaler immédiatement au pouvoir adjudicateur toute tentative de contact irrégulier ou réception de document confidentiel","Documenter par écrit le refus et le signalement pour constituer une protection juridique en cas de litige ultérieur"],
      realLife:"Un directeur commercial d'une société de gestion déléguée accepte d'offrir un week-end de golf à un directeur municipal chargé de l'attribution d'un contrat. Le directeur municipal est filmé. L'enquête remonte à la société. Le directeur commercial est condamné à 3 ans avec sursis pour corruption active. La société est exclue des marchés publics pour 5 ans. Le contrat — pourtant remporté — est annulé.",
      jurisprudence:{
        titre:"Affaire des marchés tuyautés de la région PACA (2022)",
        resume:"Un intermédiaire condamné à 6 ans dont 4 ferme pour corruption active et recel de secret professionnel après avoir vendu les grilles de notation confidentielles de marchés publics à plusieurs candidats.",
        source:"CA Aix-en-Provence, 2022"
      },
    },
    microDecisions:[
      {
        situation:"Vous entrez dans le bureau de Mme Deschamps. Elle se lève, tailleur impeccable, poignée de main ferme. Dominique vous a tout dit — et vous a laissé décider.",
        choices:[
          {letter:"A",desc:"« Bonjour, Mme Deschamps. Dominique m'a dit que vous aviez des pistes concrètes — je vous écoute. »",reaction:{sp:"Mme Deschamps",ch:{css:"c-deschamps",em:"🕴️",nm:"Mme Deschamps — Consultante"},txt:"(souriant) <em>« J'en ai justement trois. Et je suis sûre que l'une d'elles retiendra votre attention. »</em>"}},
          {letter:"B",desc:"« Bonjour. Je suppose que vous connaissez bien le dossier ? »",reaction:{sp:"Mme Deschamps",ch:{css:"c-deschamps",em:"🕴️",nm:"Mme Deschamps — Consultante"},txt:"(s'installant) <em>« Je connais ce marché depuis quinze ans. Et je sais exactement où sont les leviers. »</em>"}},
          {letter:"C",desc:"« Bonjour. Avant d'aller plus loin — quel est votre mandat exact dans ce dossier ? »",reaction:{sp:"Mme Deschamps",ch:{css:"c-deschamps",em:"🕴️",nm:"Mme Deschamps — Consultante"},txt:"(sans hésiter) <em>« Conseil en positionnement compétitif. C'est ce que je fais depuis vingt ans. »</em> (posant un dossier sur la table) <em>« Voici ce que j'ai préparé. »</em>"}},
        ]
      },
      {
        situation:"Mme Deschamps vient de transmettre le mail contenant les prix d'EcoTri. Le document est dans votre messagerie.",
        choices:[
          {letter:"A",desc:"« Envoyez-moi le fichier Excel détaillé. Je n'utilise ça qu'à titre indicatif. »",gauges:{i:-4,p:0,m:0},tint:true,reaction:{sp:"Mme Deschamps",ch:{css:"c-deschamps",em:"🕴️",nm:"Mme Deschamps — Consultante"},txt:"<em>« Il vous a déjà été transmis. 47,20€ la tonne. Vous calquez à 46,80€ et le marché est à vous. »</em>"},postReaction:[{sp:"Mme Deschamps",ch:{css:"c-deschamps",em:"🕴️",nm:"Mme Deschamps"},sc:"commercial",txt:"(ouvrant un autre dossier) <em>« Et j'ai une deuxième approche — plus institutionnelle. Si vous avez un moment, je vous explique. »</em>"}]},
          {letter:"B",desc:"« Je ne veux pas voir ce document. Mais si notre offre peut être plus compétitive sur le prix… »",gauges:{i:-4,p:0,m:0},tint:false,reaction:{sp:"Mme Deschamps",ch:{css:"c-deschamps",em:"🕴️",nm:"Mme Deschamps — Consultante"},txt:"<em>« Vous n'avez pas besoin de le regarder. 46,80€ la tonne. Vous avez les 48 heures pour déposer. »</em>"},postReaction:[{sp:"Mme Deschamps",ch:{css:"c-deschamps",em:"🕴️",nm:"Mme Deschamps"},sc:"commercial",txt:"(ouvrant un autre dossier) <em>« Et j'ai une autre approche, plus institutionnelle. Vous êtes sensible aux réseaux locaux ? »</em>"}]},
          {letter:"C",desc:"« Je supprime ce mail immédiatement et je le signale au pouvoir adjudicateur comme l'impose le règlement. »",gauges:{i:0,p:0,m:0},tint:false,reaction:{sp:"Mme Deschamps",ch:{css:"c-deschamps",em:"🕴️",nm:"Mme Deschamps — Consultante"},txt:"(un silence) <em>« C'est votre droit. »</em> (rangeant ses affaires) <em>« La troisième option ne vous sera pas proposée. »</em>"}},
        ]
      },
    ],
    transitions:{1:{sp:"Narrateur",txt:`L'appel d'offres est clôturé. Dans les couloirs de la SEM, un autre dossier attend. Un fournisseur vous invite à déjeuner — il se montre beaucoup trop généreux.`}},
  },

  // ═══════════════════════════════════════
  // CHAPITRE 11 — Le Contrat de Confiance (BONUS — Maintenance)
  // ═══════════════════════════════════════
  { num:"Affaire 11",name:"Le Contrat de Confiance",sub:"Maintenance & Favoritisme",dureeMin:4,
    sc:"maintenance",playerRole:"Responsable Maintenance",
    context:{eye:"🔧 Affaire 11",title:"Le renouvellement à 380 000 euros",body:`<strong>Responsable Maintenance.</strong> 380 000€ par an. C'est ce que représente le contrat de maintenance des lignes de tri. Il arrive à renouvellement dans trois semaines. ProTech Maintenance l'assure depuis six ans.<br><br>M. Vasseur, le dirigeant, vous a demandé un déjeuner <em>« pour faire le point »</em>. Vous revenez au bureau. Sur votre bureau : un catalogue équipement professionnel, avec un Post-it.<br><br><em>« Pour l'équipe — en remerciement de ces 6 années. V. »</em>`},
    dialogue:[
      {sp:"M. Vasseur",ch:{css:"c-vasseur",em:"🔩",nm:"M. Vasseur — ProTech Maintenance"},sc:"maintenancebureau",txt:"(Au téléphone, cordial) <em>« Ah, vous avez reçu le catalogue ! C'est un geste pour votre équipe, rien de plus. Six ans de partenariat, ça se fête. L'outillage reste sur le site — c'est professionnel. »</em>"},
      {sp:"Vous",ch:null,sc:"maintenancebureau",txt:"<em>« M. Vasseur, je ne peux pas accepter ça dans le contexte du renouvellement de contrat. »</em>"},
      {sp:"M. Vasseur",ch:{css:"c-vasseur",em:"🔩",nm:"M. Vasseur — ProTech Maintenance"},sc:"maintenancebureau",txt:"(Légèrement froissé) <em>« Je comprends votre prudence. Mais entre nous — ProTech connaît vos lignes mieux que n'importe qui. Un nouvel appel d'offres, ça prend du temps, ça perturbe les équipes… Vous le savez mieux que moi. »</em>"},
      {sp:"Vous",ch:null,sc:"maintenancebureau",txt:"<em>« Le renouvellement suivra la procédure habituelle. »</em>"},
      {sp:"M. Vasseur",ch:{css:"c-vasseur",em:"🔩",nm:"M. Vasseur"},sc:"maintenancebureau",txt:"(Changeant de ton) <em>« Bien sûr. Bien sûr. Dites-moi juste… est-ce que d'autres prestataires ont déjà été consultés ? Parce que si c'est une question de prix, on peut s'arranger. »</em>"},
      {sp:"Narrateur",ch:null,sc:"maintenancereunion",txt:"<em>Une semaine plus tard. Votre chef de service vous convoque.</em>"},
      {sp:"Chef de service",ch:{css:"c-dominique",em:"🧑‍💼",nm:"Chef de service"},sc:"maintenancereunion",txt:"<em>« J'ai eu Vasseur au téléphone. Il dit que vous avez créé des tensions. ProTech menace de ne pas assurer la maintenance préventive du mois prochain si on ne confirme pas le renouvellement rapidement. Qu'est-ce qui s'est passé ? »</em>"},
      {sp:"Narrateur",ch:null,sc:"maintenancereunion",txt:"<em>En fouillant vos mails, vous retrouvez un échange de votre prédécesseur avec M. Vasseur. Ton familier. Mentions d'arrangements habituels. Pas de détails. Mais suffisamment pour comprendre que quelque chose existait avant vous.</em>"},
    ],
    clues:[
      {ic:"📦",label:"Catalogue ProTech",sub:"Commande d'outillage — 4 200€",title:"Commande ProTech — Outillage professionnel",body:`La commande est passée à votre nom, sans votre accord. Matériel d'outillage professionnel, valeur estimée : <strong>4 200€</strong>. Livraison prévue vendredi.<br><br>Le seuil interne d'acceptation des cadeaux est fixé à <strong>80€</strong> par personne et par événement.`,alert:`Accepter cet outillage dans le contexte du renouvellement de contrat constitue une <strong>corruption passive</strong> (Art. 432-11 CP), même si le bénéficiaire affiché est « l'équipe ». La destination du cadeau ne change pas sa qualification juridique.`},
      {ic:"📧",label:"Mails du prédécesseur",sub:"Arrangements habituels — ProTech",title:"Échange archivé — Prédécesseur & M. Vasseur",body:`Ton familier. Formules floues : « comme d'habitude », « même chose que l'an dernier », « merci pour votre compréhension ».<br><br>Dates : les trois derniers renouvellements de contrat. Aucun appel d'offres lancé à ces périodes.`,alert:`Ces mails documentent un <strong>schéma répété de favoritisme</strong>. Ne pas les signaler vous rend solidaire des pratiques passées si elles remontent lors d'un audit.`},
    ],
    invIntro:"L'atelier de maintenance. Deux éléments éclairent la situation avant de décider.",
    hotspots:[
      {x:15, y:42, w:22, h:26, label:"Catalogue ProTech"},
      {x:55, y:44, w:20, h:22, label:"Mails du prédécesseur"},
    ],
    pressureIntro:"ProTech vient de confirmer : pas de maintenance préventive le mois prochain tant que le contrat n'est pas signé. Trois lignes de tri risquent de s'arrêter. La direction vous appelle. « On a besoin d'une décision ce soir. »",
    choices:[
      {desc:"Renouveler le contrat ProTech sans appel d'offres pour débloquer la situation immédiatement.",type:"bad",badge:"🔴 Échec",bc:"badge-bad",vTitle:"Favoritisme caractérisé",vConsequence:`Le contrat est reconduit. Les arrangements habituels continuent. Vous en faites maintenant partie. Six mois plus tard, un audit interne remonte les mails du prédécesseur ET votre renouvellement sans procédure. Les deux sont liés. Vous êtes mis(e) en cause.`,vLegal:`<strong>Qualification :</strong> Renouveler un contrat de 380 000€ sans appel d'offres en méconnaissance des règles de la commande publique constitue un <strong>délit de favoritisme</strong> (Art. 432-14 CP). La continuité du schéma aggrave la qualification.`,lc:"",gauges:{i:-40,p:+20,m:-32}},
      {desc:"Lancer un appel d'offres mais ne pas signaler les mails du prédécesseur pour protéger l'institution.",type:"warn",badge:"🟠 Risqué",bc:"badge-warn",vTitle:"Procédure respectée mais risque non traité",vConsequence:`Vous avez fait ce qu'il fallait sur la forme. Mais les pratiques passées restent enfouies. Un audit les fera peut-être remonter un jour — et votre silence sera difficile à expliquer. Le déontologue vous demande si vous étiez au courant.`,vLegal:`<strong>Qualification :</strong> Connaître des pratiques irrégulières sans les signaler peut constituer une <strong>complicité par omission</strong>. Le dispositif d'alerte Sapin II protège le lanceur d'alerte — l'utiliser est aussi une protection pour la SEM.`,lc:"warn",gauges:{i:-12,p:+6,m:-8}},
      {desc:"Lancer un appel d'offres complet, signaler les mails au déontologue ET informer la direction générale que la menace de ProTech sur la maintenance constitue une pression inacceptable.",type:"good",badge:"🟢 Succès",bc:"badge-good",vTitle:"Courage professionnel et transparence totale",vConsequence:`ProTech perd le contrat six mois plus tard. Un nouveau prestataire prend en charge les lignes. La direction découvre l'étendue des arrangements passés. Votre signalement vous protège — et protège la SEM d'une mise en cause ultérieure.`,vLegal:`<strong>Bonne pratique :</strong> Signaler les pratiques passées et lancer un appel d'offres documenté sont les deux réflexes qui protègent le salarié, la SEM et l'institution. La pression opérationnelle d'un prestataire est elle-même un signal d'alerte.`,lc:"good",gauges:{i:+20,p:-6,m:+20}},
    ],
    sos:{
      situation:"ProTech Maintenance vous a envoyé du matériel d'outillage (4 200€) sans commande, trois semaines avant le renouvellement de leur contrat. Des mails de votre prédécesseur laissent entendre que des arrangements existaient.",
      questions:["Le fait que l'outillage soit destiné à l'équipe — et non à moi personnellement — change-t-il sa qualification juridique ?","Suis-je obligé(e) de signaler des pratiques passées que je n'ai pas commises ?","La menace de ProTech de suspendre la maintenance est-elle elle-même un signal d'alerte ?"],
      reasoning:"La corruption passive ne distingue pas selon le bénéficiaire final du cadeau — que l'avantage soit pour la personne ou pour son équipe, la qualification est identique dès lors qu'il est lié à une décision professionnelle. Sur les mails du prédécesseur : les connaître sans les signaler peut constituer une complicité par omission — le dispositif d'alerte Sapin II protège précisément le salarié dans cette situation. La menace de suspendre une prestation en cas de non-renouvellement constitue une pression inacceptable qui doit être documentée et signalée.",
      lawRef:{label:"Art. 432-11 CP — Corruption passive",url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006418677"},
    },
    recap:{
      risk:"Favoritisme & Corruption passive",
      definition:"Accepter un avantage en nature dans le contexte d'un renouvellement de contrat constitue une corruption passive, même si l'avantage bénéficie à l'équipe. Renouveler un contrat sans appel d'offres en méconnaissance des règles de la commande publique constitue un délit de favoritisme.",
      gestures:["Refuser tout avantage matériel d'un prestataire en période de renouvellement — même destiné à l'équipe","Signaler les pratiques passées découvertes : le silence est une forme de complicité","La pression opérationnelle d'un prestataire est elle-même un signal d'alerte à documenter"],
      realLife:"Les affaires de favoritisme dans les marchés de maintenance sont parmi les plus fréquentes dans les structures publiques et parapubliques. Les avantages sont souvent présentés comme des gestes commerciaux normaux. La règle : tout avantage d'un prestataire en période de renouvellement est suspect.",
      jurisprudence:{
        titre:"Affaire de maintenance d'une régie municipale (Bordeaux, 2021)",
        resume:"Un responsable technique condamné à 18 mois avec sursis pour favoritisme après avoir reconduit six ans de suite un contrat de maintenance sans appel d'offres. Des avantages en nature (outillage, bons cadeaux) avaient été documentés à chaque renouvellement.",
        source:"TJ Bordeaux, 2021"
      },
    },
    microDecisions:[
      {
        sc:"maintenancebureau",
        situation:"Vous regardez le catalogue posé sur votre bureau. La commande est déjà passée à votre nom. Matériel d'outillage professionnel, valeur estimée : 4 200€. Livraison prévue vendredi.",
        choices:[
          {letter:"A",desc:"« C'est pour l'équipe, pas pour moi personnellement. Je laisse venir. »",gauges:{i:-10,p:0,m:0},tint:true,reaction:{sp:"M. Vasseur",ch:{css:"c-vasseur",em:"🔩",nm:"M. Vasseur — ProTech Maintenance"},txt:"(Par téléphone le lendemain) <em>« Votre équipe a bien reçu la livraison ? Excellent. On se voit bientôt pour les modalités du renouvellement. »</em> La livraison a eu lieu. Le lien est maintenant établi."}},
          {letter:"B",desc:"« Je rappelle M. Vasseur pour lui demander de retirer la commande, mais sans en informer personne en interne. »",gauges:{i:0,p:0,m:0},tint:false,reaction:{sp:"M. Vasseur",ch:{css:"c-vasseur",em:"🔩",nm:"M. Vasseur — ProTech Maintenance"},txt:"<em>« Je comprends tout à fait. »</em> La commande est annulée. Mais sans trace écrite ni information en interne, si la situation remonte plus tard, vous n'avez aucune protection."}},
          {letter:"C",desc:"« Je refuse la livraison par écrit et j'informe immédiatement le déontologue de la tentative. »",gauges:{i:+2,p:0,m:0},tint:false,reaction:{sp:"M. Vasseur",ch:{css:"c-vasseur",em:"🔩",nm:"M. Vasseur — ProTech Maintenance"},txt:"(Ton refroidi) <em>« Je comprends votre position. »</em> Le refus est tracé. Le déontologue a le dossier. Vous êtes protégé(e)."}},
        ]
      },
      {
        sc:"maintenancereunion",
        situation:"Votre chef de service attend une réponse sur la situation avec Vasseur.",
        choices:[
          {letter:"A",desc:"« Je minimise l'incident avec Vasseur et laisse entendre que le renouvellement peut se faire sans appel d'offres cette année. »",gauges:{i:-14,p:+4,m:0},tint:true,reaction:{sp:"Chef de service",ch:{css:"c-dominique",em:"🧑‍💼",nm:"Chef de service"},txt:"(Soulagé) <em>« Parfait. On évite les complications. »</em> La pression est retombée. Mais le schéma continue — et vous venez d'y entrer."}},
          {letter:"B",desc:"« Je signale le catalogue à mon chef de service mais je ne mentionne pas les mails du prédécesseur. »",gauges:{i:-10,p:+4,m:-8},tint:true,reaction:{sp:"Chef de service",ch:{css:"c-dominique",em:"🧑‍💼",nm:"Chef de service"},txt:"(Pensif) <em>« Bien de me prévenir. On va lancer un appel d'offres pour la forme. »</em> Le fond n'est pas traité. Les mails du prédécesseur restent enfouis."}},
          {letter:"C",desc:"« Je transmets tout — le catalogue, les mails du prédécesseur, l'appel téléphonique — au déontologue, en demandant un appel d'offres complet. »",gauges:{i:+3,p:0,m:0},tint:false,reaction:{sp:"Chef de service",ch:{css:"c-dominique",em:"🧑‍💼",nm:"Chef de service"},txt:"(Visage fermé) <em>« Vous comprenez ce que vous faites ? »</em> Vous comprenez. Et vous avez le dossier."}},
        ]
      },
    ],
    memoire:{
      good:{
        chCible:1,
        txt:"<em>Vous avez déjà refusé les avantages d'un fournisseur. Vous savez reconnaître la manœuvre. Ce qui arrive aujourd'hui ressemble à quelque chose que vous connaissez déjà. En plus subtil.</em>",
      },
      bad:{
        chCible:1,
        txt:"<em>La dernière fois qu'un prestataire vous a proposé quelque chose, vous avez accepté. Vasseur a peut-être entendu parler de ça.</em>",
      },
    },
    transitions:{
      intermediate:{sp:"Narrateur",txt:`Le dossier ProTech est transmis. L'appel d'offres est lancé. Vous avez affronté les situations les plus critiques pour votre service. Il est temps de faire le point.`},
    },
  },

  // ═══════════════════════════════════════
  // CHAPITRE 12 — Le Détour de Nuit
  // ═══════════════════════════════════════
  { num:"Affaire 12",name:"Le Détour de Nuit",sub:"Exploitation & Pollution illicite",dureeMin:5,
    sc:"nuitcollecte",playerRole:"Chef d'équipe collecte",
    context:{eye:"🚛 Affaire 12",title:"3h12 du matin — Secteur Est",body:`<strong>Chef d'équipe collecte.</strong> 3h12 du matin. Tournée de collecte secteur Est. Vous êtes chef d'équipe depuis trois ans — vous connaissez chaque rue, chaque container, chaque ripeur de votre benne.<br><br>Ce soir, quelque chose cloche. Kévin, d'habitude le premier à charger, ralentit volontairement au niveau de la zone industrielle Garriga. <em>Ce n'est pas la première fois ce mois-ci.</em>`},
    microDecisions:[
      {
        sc:"nuitcollecte",
        situation:"Kévin saute du marchepied et disparaît derrière un hangar pendant deux minutes. Il revient. Rien dans les mains. Mais vous avez vu la lumière d'un téléphone.",
        choices:[
          {letter:"A",desc:"« Je ne dis rien — Kévin est un bon ripeur, je ne veux pas créer d'ambiance. »",gauges:{i:-8,p:0,m:0},tint:true,reaction:{sp:"Narrateur",ch:null,txt:"Vous repartez. La tournée continue. Mais l'image reste — la lumière du téléphone, le hangar, les sacs derrière la grille."}},
          {letter:"B",desc:"« Je lui demande ce qu'il faisait, il dit qu'il avait besoin d'uriner. Je le crois à moitié mais je laisse passer. »",gauges:{i:0,p:0,m:0},tint:false,reaction:{sp:"Kévin",ch:{css:"c-kevin",em:"🧤",nm:"Kévin — Ripeur"},txt:"(Sans vous regarder) <em>« Avais besoin de pisser, chef. C'est tout. »</em>"}},
          {letter:"C",desc:"« Je note l'heure et l'adresse dans mon carnet. Troisième fois ce mois. Je vais chercher à comprendre. »",gauges:{i:+2,p:0,m:0},tint:false,reaction:{sp:"Narrateur",ch:null,txt:"22h47. Zone industrielle Garriga. Troisième fois en un mois. Vous notez tout. Ce n'est peut-être rien. Mais si c'est quelque chose, vous aurez une trace."}},
        ]
      },
      {
        sc:"nuitcollecte",
        situation:"Kévin vous demande de ne rien dire. « Je m'arrête là, je vous le promets. Aidez-moi juste cette fois. »",
        choices:[
          {letter:"A",desc:"« D'accord. Mais c'est la dernière fois. Tu arrêtes immédiatement. »",gauges:{i:-14,p:0,m:0},tint:true,reaction:{sp:"Narrateur",ch:null,txt:"Vous raccompagnez Kévin. Les sacs restent. Garriga continue. Et maintenant vous faites partie du silence."}},
          {letter:"B",desc:"« Je ne peux pas couvrir ça Kévin. Mais je vais te laisser 24h pour te signaler toi-même. »",gauges:{i:-10,p:+2,m:-10},tint:true,reaction:{sp:"Kévin",ch:{css:"c-kevin",em:"🧤",nm:"Kévin — Ripeur"},txt:"(Voix brisée) <em>« Merci chef. Je vais le faire. »</em> Il raccroche. Vous savez que vous venez peut-être de lui laisser le temps de fuir."}},
          {letter:"C",desc:"« Kévin, je ne peux pas. Ce que tu décris c'est grave — pour toi, pour moi, pour la SEM. Je vais signaler. Et tu ferais mieux de parler avant qu'on t'y oblige. »",gauges:{i:+3,p:0,m:0},tint:false,reaction:{sp:"Narrateur",ch:null,txt:"Kévin raccroche. Vous appelez votre responsable. Il est 23h15. Ce sera une longue nuit."}},
        ]
      },
    ],
    dialogue:[
      {sp:"Narrateur",ch:null,sc:"nuitcollecte",txt:"<em>Retour au dépôt, 5h30. Vous remarquez que les bacs de la zone industrielle Garriga ne sont jamais vides malgré la fréquence des passages.</em>"},
      {sp:"Vous",ch:null,sc:"nuitcollecte",txt:"<em>« Kévin, les bacs Garriga — on les vide à chaque tournée ? »</em>"},
      {sp:"Kévin",ch:{css:"c-kevin",em:"🧤",nm:"Kévin — Ripeur"},sc:"nuitcollecte",txt:"(Sans vous regarder) <em>« Ouais, comme d'hab. »</em>"},
      {sp:"Vous",ch:null,sc:"nuitcollecte",txt:"<em>« Parce que j'ai regardé les relevés. Tonnage en baisse sur ce secteur depuis six semaines. Mais on passe autant de fois. »</em>"},
      {sp:"Kévin",ch:{css:"c-kevin",em:"🧤",nm:"Kévin — Ripeur"},sc:"nuitcollecte",txt:"(Haussement d'épaules) <em>« Les gens produisent moins de déchets, je sais pas moi. »</em>"},
      {sp:"Narrateur",ch:null,sc:"nuitcollecte",txt:"<em>Deux jours plus tard. Vous revenez seul sur la zone industrielle Garriga en dehors des heures de tournée. Derrière le hangar : un amoncellement de sacs noirs. Des dizaines. Certains éventrés. Ce ne sont pas des ordures ménagères. Votre téléphone vibre. C'est Kévin.</em>"},
      {sp:"Kévin",ch:{css:"c-kevin",em:"🧤",nm:"Kévin — Ripeur"},sc:"nuitcollecte",txt:"(Voix basse) <em>« Chef… vous êtes où là ? »</em>"},
      {sp:"Vous",ch:null,sc:"nuitcollecte",txt:"<em>« Zone Garriga. Je pense que tu le sais. »</em>"},
      {sp:"Kévin",ch:{css:"c-kevin",em:"🧤",nm:"Kévin — Ripeur"},sc:"nuitcollecte",txt:"(Silence) <em>« C'est pas ce que vous croyez. Garriga m'a juste demandé de… de passer à côté certains soirs. 50 euros par sortie. J'ai des dettes, chef. Ma femme est au courant de rien. »</em>"},
      {sp:"Vous",ch:null,sc:"nuitcollecte",txt:"<em>« Ces sacs — c'est quoi dedans ? »</em>"},
      {sp:"Kévin",ch:{css:"c-kevin",em:"🧤",nm:"Kévin — Ripeur"},sc:"nuitcollecte",txt:"<em>« Je sais pas exactement. Il dit que c'est des chutes d'atelier. Mais… certains sacs, ça sent le produit chimique. »</em>"},
    ],
    clues:[
      {ic:"📋",label:"Relevés de tonnage",sub:"Secteur Garriga — 6 semaines",title:"Anomalie tonnage — Zone industrielle Garriga",body:`Les relevés sur les six dernières semaines montrent une <strong>baisse de tonnage de 34%</strong> sur le secteur Est, alors que la fréquence de passage est identique.<br><br>Sur la même période : <strong>3 arrêts non planifiés</strong> enregistrés par le GPS de la benne au niveau de l'adresse Garriga, entre 22h30 et 23h15.`,alert:`Ces données constituent une <strong>preuve documentaire</strong> d'une modification de l'itinéraire et d'un défaut de collecte. Elles peuvent être produites dans le cadre d'une procédure disciplinaire ou pénale.`},
      {ic:"🧪",label:"Sacs suspects",sub:"Dépôt illicite — Produits chimiques",title:"Dépôt illicite — Zone Garriga",body:`Les sacs retrouvés derrière le hangar Garriga présentent des caractéristiques inhabituelles : <strong>odeur de solvant</strong>, étiquettes partiellement effacées, conditionnement industriel non standard.<br><br>Les déchets industriels dangereux ne peuvent pas être collectés dans le cadre de la collecte ménagère ordinaire.`,alert:`Le dépôt illicite de déchets dangereux est passible de <strong>2 ans d'emprisonnement et 75 000€ d'amende</strong> (Art. L541-46 Code de l'environnement). La complicité par omission d'un agent de service public aggrave les peines encourues.`},
    ],
    pressureIntro:"Le lendemain matin. Votre responsable d'exploitation vous convoque. « J'ai Kévin dans mon bureau. Il dit que vous l'avez suivi. Il dit que vous avez des théories. Garriga est client de la collectivité depuis 8 ans. On a besoin de preuves solides avant d'aller plus loin — pas de suppositions. Vous avez quoi exactement ? »",
    choices:[
      {desc:"Minimiser — dire que c'est une anomalie isolée, laisser l'enquête tomber.",type:"bad",badge:"🔴 Complicité",bc:"badge-bad",vTitle:"Complicité par omission",vConsequence:`Six mois plus tard, une inspection régionale découvre le dépôt illicite. Les analyses révèlent des solvants chlorés. La responsabilité de la SEM est engagée. Votre silence fait partie du dossier.`,vLegal:`<strong>Qualification :</strong> Le silence d'un agent public confronté à une pollution illicite peut constituer une <strong>complicité par omission</strong>. L'article L541-46 du Code de l'environnement prévoit des sanctions pour toute personne ayant contribué, même passivement, au maintien d'un dépôt illicite.`,gauges:{i:-40,p:+12,m:-40}},
      {desc:"Signaler les faits mais demander à Kévin d'être entendu en dernier, pour lui laisser une chance.",type:"warn",badge:"🟠 Signalement incomplet",bc:"badge-warn",vTitle:"Signalement incomplet",vConsequence:`Vous avez dit l'essentiel. Mais protéger Kévin dans la procédure a ralenti l'enquête. Garriga a eu le temps de nettoyer une partie du site.`,vLegal:`<strong>Qualification :</strong> Signaler les faits tout en protégeant l'auteur principal peut être interprété comme une entrave à la procédure. Le dispositif Sapin II protège le lanceur d'alerte qui signale de bonne foi — il ne protège pas celui qui retarde le signalement pour avantager un mis en cause.`,gauges:{i:-12,p:+2,m:-12}},
      {desc:"Signaler immédiatement avec vos notes — heure, adresse, conversation téléphonique — et demander une inspection du site Garriga en urgence.",type:"good",badge:"🟢 Courage professionnel",bc:"badge-good",vTitle:"Courage professionnel et signalement complet",vConsequence:`L'inspection révèle 4 tonnes de déchets industriels non traités. Garriga est mis en examen. Kévin est convoqué en disciplinaire. Votre signalement écrit vous protège. La SEM engage une procédure de résiliation du contrat.`,vLegal:`<strong>Bonne pratique :</strong> Un signalement documenté (dates, heures, relevés GPS, conversation) constitue un <strong>faisceau de preuves</strong> qui déclenche l'enquête officielle sans exposer l'agent signalant. La SEM est protégée parce que vous avez agi.`,gauges:{i:+20,p:-4,m:+20}},
    ],
    sos:{
      situation:"Kévin, un ripeur de votre équipe, a accepté 50€ par sortie pour ignorer les bacs d'un entrepôt. Vous avez découvert un dépôt de sacs suspects (odeur chimique). Il vous demande de ne rien dire.",
      questions:["Si je ne dénonce pas Kévin, suis-je moi-même en infraction ?","Ces sacs suspects — dois-je attendre les analyses officielles avant de signaler ?","Mon signalement peut-il nuire à la SEM si Garriga est client depuis 8 ans ?"],
      reasoning:"Le silence d'un agent public face à une infraction connue peut constituer une complicité par omission — particulièrement grave pour un chef d'équipe dont la mission inclut la conformité des opérations. Sur les sacs : non, l'attente d'analyses n'est pas requise — signaler des éléments suspects (odeur, conditionnement anormal) est suffisant pour déclencher une inspection officielle. Sur le risque pour la SEM : au contraire, un signalement documenté protège la SEM d'une mise en cause pour complicité passive — le maintien d'un prestataire impliqué dans un dépôt illicite serait bien plus dommageable.",
      lawRef:{label:"Art. L541-46 Code de l'environnement — Dépôt illicite",url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006834432"},
    },
    recap:{
      risk:"Corruption passive & Pollution illicite",
      definition:"Kévin a commis une corruption passive en acceptant de l'argent pour détourner sa mission de service public. Le dépôt illicite de déchets dangereux constitue une infraction au Code de l'environnement passible de 2 ans d'emprisonnement et 75 000€ d'amende. En tant que chef d'équipe, le silence aurait constitué une complicité par omission.",
      gestures:[
        "Noter les anomalies — heure, lieu, comportement — avant même de comprendre ce qui se passe",
        "Ne jamais couvrir un collègue sur une fraude environnementale — les conséquences sont pénales",
        "Signaler avec des faits concrets — pas des suppositions",
      ],
      realLife:"Les dépôts illicites de déchets industriels sont une réalité dans le secteur de la collecte. Les agents de terrain sont parfois ciblés précisément parce qu'ils ont accès aux zones de collecte la nuit, sans supervision directe.",
      jurisprudence:{
        titre:"Affaire de détournement de collecte (Seine-Saint-Denis, 2019)",
        resume:"Un chauffeur-ripeur condamné à 18 mois avec sursis pour corruption passive et complicité de dépôt illicite, après avoir systématiquement « oublié » de collecter les bacs d'un entrepôt en échange d'espèces. Son chef d'équipe, qui avait connaissance des faits depuis 4 mois, a été sanctionné disciplinairement pour omission de signalement.",
        source:"TGI Bobigny, 2019"
      },
    },
    memoire:{
      good:{
        chCible:3,
        txt:"<em>Vous avez déjà tenu bon face à une irrégularité sur les tonnages. Cette nuit, c'est différent — c'est quelqu'un de votre équipe. Mais le réflexe, vous le connaissez.</em>",
      },
      bad:{
        chCible:3,
        txt:"<em>La dernière fois qu'une anomalie de collecte s'est présentée, vous avez fermé les yeux. Ce soir Kévin vous demande exactement la même chose. Qu'est-ce qui va changer ?</em>",
      },
    },
    transitions:{
      epilogue:{sp:"Narrateur",txt:`<em>Le rapport d'inspection est déposé. Garriga est mis en examen. Kévin sera entendu par les RH demain. Vous avez fait ce que vous deviez faire — même à 3h du matin, même quand c'était quelqu'un de votre équipe.</em>`},
      intermediate:{sp:"Narrateur",txt:`<em>Le dossier Garriga est entre les mains des autorités. Vous avez tenu. Il est temps de faire le point sur l'ensemble de votre parcours.</em>`},
    },
  },

  // ═══════════════════════════════════════
  // CHAPITRE 13 — Le Tampon qui Coûte Cher
  // ═══════════════════════════════════════
  { num:"Affaire 13",name:"Le Tampon qui Coûte Cher",sub:"QSE & Faux en écriture sur audit de certification",dureeMin:5,
    sc:"reunionqse",
    playerRole:"Responsable QHSE",
    context:{eye:"🛡️ Affaire 13",title:"L'audit ISO 45001 sous pression",body:`<strong>Responsable QHSE.</strong> La certification ISO 45001 de la SEM expire dans six semaines. Sans renouvellement, trois marchés publics en cours de négociation sont automatiquement caducs — clause contractuelle explicite.<br><br>L'audit de renouvellement a débuté hier. Mme Andrieux, auditrice certifiée, est sur site depuis 8h. Son sourire ne vous a pas quitté de la journée. Ce soir, elle demande à vous parler en privé.`},
    dialogue:[
      {sp:"Narrateur",ch:null,sc:"reunionqse",txt:"<em>Fin de journée. Salle de réunion. Mme Andrieux range ses documents. Elle a l'aisance de quelqu'un qui fait ça depuis dix ans.</em>"},
      {sp:"Mme Andrieux",ch:{css:"c-andrieux",em:"📋",nm:"Mme Andrieux — Auditrice CertExcel"},sc:"reunionqse",txt:"(Posant son carnet) <em>« {prenom} — je peux vous appeler {prenom} ? Bon. L'audit se passe bien dans l'ensemble. Vos procédures papier sont solides. Formation des équipes, bonne traçabilité. »</em>"},
      {sp:"Vous",ch:null,sc:"reunionqse",txt:"<em>« Je sens un 'mais' arriver. »</em>"},
      {sp:"Mme Andrieux",ch:{css:"c-andrieux",em:"📋",nm:"Mme Andrieux"},sc:"reunionqse",txt:"(Souriant) <em>« Perceptive. Oui. L'accident de M. Brahim en mars — le rapport d'analyse des causes a été clôturé en 11 jours. La norme exige 30 jours minimum pour ce type d'incident. Et votre plan d'actions correctives sur le secteur 3 — trois points sont formellement ouverts depuis plus de 90 jours. »</em>"},
      {sp:"Vous",ch:null,sc:"reunionqse",txt:"<em>« Ces points ont été traités opérationnellement — la documentation a pris du retard. »</em>"},
      {sp:"Mme Andrieux",ch:{css:"c-andrieux",em:"📋",nm:"Mme Andrieux"},sc:"reunionqse",txt:"<em>« Je comprends la réalité terrain. Mais sur le papier, en l'état, ce sont deux non-conformités majeures. Deux majeures, c'est un audit suspendu. Pas de certificat. Vous connaissez les conséquences. »</em>"},
      {sp:"Vous",ch:null,sc:"reunionqse",txt:"<em>« Le délai pour régulariser ? »</em>"},
      {sp:"Mme Andrieux",ch:{css:"c-andrieux",em:"📋",nm:"Mme Andrieux"},sc:"reunionqse",txt:"(Hésitant légèrement) <em>« Officiellement, trois mois pour un audit de suivi. Ce qui vous ferait dépasser l'échéance des marchés. »</em>"},
      {sp:"Narrateur",ch:null,sc:"reunionqse",txt:"<em>[silence]</em>"},
      {sp:"Mme Andrieux",ch:{css:"c-andrieux",em:"📋",nm:"Mme Andrieux"},sc:"reunionqse",txt:"(Changeant de ton, plus confidentielle) <em>« Cela dit — je travaille beaucoup avec des structures comme la vôtre. Des SEM, des régies publiques, des intercommunalités. Mon carnet de commandes dépend beaucoup du bouche-à-oreille institutionnel. Une recommandation de votre part auprès de deux ou trois de vos homologues… ça vaut de l'or dans ce secteur. »</em>"},
      {sp:"Vous",ch:null,sc:"reunionqse",txt:"<em>« Vous me proposez quoi exactement ? »</em>"},
      {sp:"Mme Andrieux",ch:{css:"c-andrieux",em:"📋",nm:"Mme Andrieux"},sc:"reunionqse",txt:"(Calmement) <em>« Je classe les deux non-conformités en mineures dans mon rapport final. Certificat délivré la semaine prochaine. En échange, vous m'introduisez auprès du directeur QHSE de Métropole Sud et du responsable technique de Territoire Propre 83. Deux noms, deux emails. C'est tout. »</em>"},
      {sp:"Vous",ch:null,sc:"reunionqse",txt:"<em>« Et si ces non-conformités sont réelles ? »</em>"},
      {sp:"Mme Andrieux",ch:{css:"c-andrieux",em:"📋",nm:"Mme Andrieux"},sc:"reunionqse",txt:"(Se levant) <em>« Tout est une question de qualification. Une majeure peut devenir mineure selon le contexte d'interprétation. C'est de la nuance professionnelle, pas de la falsification. Réfléchissez — vous avez jusqu'à demain matin. »</em>"},
    ],
    clues:[
      {ic:"📄",label:"Rapport préliminaire Andrieux",sub:"Deux non-conformités majeures ISO 45001",title:"Rapport préliminaire — Mme Andrieux, CertExcel",body:`Le rapport préliminaire comporte deux non-conformités majeures :<br><br><strong>NC1</strong> : Rapport d'analyse de l'accident Brahim clôturé en 11 jours — norme ISO 45001 §10.2 exige 30 jours minimum.<br><br><strong>NC2</strong> : Plan d'actions correctives secteur 3 — 3 points ouverts depuis 91 jours sans clôture documentée.`,alert:`Deux non-conformités majeures entraînent la <strong>suspension de l'audit</strong>. Le certificat ne peut pas être délivré. La norme est catégorique — il n'existe pas de marge d'interprétation pour passer une majeure en mineure sans justification documentée.`},
      {ic:"⚖️",label:"Accréditation COFRAC",sub:"CertExcel — Règles de conduite de l'auditeur",title:"COFRAC — Règlement de l'accréditation CertExcel",body:`L'accréditation COFRAC impose aux organismes certificateurs des règles strictes d'impartialité. Toute tentative de l'auditeur de solliciter un avantage commercial en échange d'une qualification favorable constitue une violation grave du référentiel d'accréditation.<br><br>Le COFRAC dispose d'un dispositif de signalement accessible à toute partie prenante.`,alert:`Modifier la qualification d'une non-conformité sans justification technique documentée constitue un <strong>faux en écriture</strong> (Art. 441-1 CP). L'avantage proposé (mise en relation commerciale) qualifie une <strong>corruption active</strong> (Art. 433-1 CP).`},
    ],
    invIntro:"La salle de réunion. Deux documents éclairent la situation avant de décider.",
    hotspots:[
      {x:25, y:55, w:50, h:30, label:"Rapport préliminaire Andrieux"},
      {x:2,  y:20, w:22, h:45, label:"Accréditation COFRAC"},
    ],
    pressureIntro:"7h43 du matin. SMS de Mme Andrieux : « Je commence la rédaction du rapport final dans 30 minutes. Votre décision ? » Dominique vous appelle dans la foulée : « Les trois marchés, c'est 4,2 millions d'euros. Sans la certification, on perd tout. »",
    choices:[
      {desc:"Transmettre les coordonnées des deux contacts à Mme Andrieux et obtenir le certificat — les marchés sont trop importants pour les perdre sur un problème de documentation.",type:"bad",badge:"🔴 Échec",bc:"badge-bad",vTitle:"Corruption active et faux en écriture",vConsequence:`Le certificat est délivré. Les marchés sont signés. Huit mois plus tard, un accident grave sur le secteur 3 — exactement là où les non-conformités auraient dû être traitées. L'enquête remonte à l'audit. La qualification frauduleuse est établie. Vous et Mme Andrieux êtes mis en cause. Le certificat est annulé rétroactivement. Les marchés aussi.`,vLegal:`<strong>Qualification :</strong> Transmettre des contacts commerciaux en échange d'un rapport favorable constitue une <strong>corruption active</strong> (Art. 433-1 CP). Un rapport qualifiant des majeures en mineures sans justification est un <strong>faux en écriture</strong> (Art. 441-1 CP). En cas d'accident, la <strong>mise en danger de la vie d'autrui</strong> (Art. 223-1 CP) peut s'ajouter.`,lc:"",gauges:{i:-40,p:+16,m:-40}},
      {desc:"Régulariser en urgence la documentation des deux non-conformités ce soir et demander à Mme Andrieux de réévaluer sur cette base — sans lui transmettre aucun contact.",type:"warn",badge:"🟠 Risqué",bc:"badge-warn",vTitle:"Régularisation tardive",vConsequence:`Mme Andrieux accepte de réévaluer. Elle classe une non-conformité en mineure — l'autre reste majeure. L'audit est suspendu six semaines. Un marché tombe. Mais la certification finit par être obtenue proprement. La documentation tardive laisse une trace d'irrégularité dans votre dossier QHSE.`,vLegal:`<strong>Qualification :</strong> Produire une documentation de conformité après le constat — même sincèrement — crée un risque de <strong>rétroactivité documentaire</strong>. Si l'authenticité des dates est contestée, cela peut être requalifié en faux. La méthode correcte est le signalement et l'audit de suivi.`,lc:"warn",gauges:{i:-12,p:-6,m:-8}},
      {desc:"Signaler la tentative de corruption au COFRAC et à la direction générale, documenter la conversation par écrit ce soir même, et accepter l'audit suspendu avec les actions correctives réelles.",type:"good",badge:"🟢 Succès",bc:"badge-good",vTitle:"Intégrité certifiée",vConsequence:`Mme Andrieux est signalée au COFRAC. Son accréditation est suspendue le temps de l'enquête. Un nouvel auditeur est missionné. Les non-conformités sont traitées réellement en cinq semaines. Le certificat est délivré — proprement. Un marché est perdu, mais deux sont maintenus. Votre signalement protège la SEM de toute responsabilité dans un futur accident.`,vLegal:`<strong>Bonne pratique :</strong> Signaler une tentative de corruption à l'organisme de tutelle (COFRAC) est la voie légalement protectrice. Les actions correctives réelles, documentées et datées, constituent la seule base valable pour un certificat opposable. Le lanceur d'alerte est protégé par la loi Sapin II.`,lc:"good",gauges:{i:+20,p:-8,m:+20}},
    ],
    sos:{
      situation:"Mme Andrieux, auditrice ISO 45001, propose de qualifier deux non-conformités majeures en mineures dans son rapport final si vous lui transmettez les coordonnées de deux directeurs QHSE de structures partenaires. Le certificat expire dans six semaines. Trois marchés à 4,2M€ sont en jeu.",
      questions:["La mise en relation commerciale (sans argent) constitue-t-elle quand même une corruption active ?","Régulariser la documentation ce soir avant le rapport final est-il juridiquement sûr ?","Signaler au COFRAC peut-il nuire à la SEM si Mme Andrieux rend un rapport défavorable par représailles ?"],
      reasoning:"La corruption active ne nécessite pas d'avantage financier — tout avantage, y compris commercial (mise en relation, recommandation, visibilité), suffit à constituer l'infraction dès lors qu'il est lié à une décision de l'agent. Sur la régularisation tardive : produire des documents après le constat d'audit crée un risque de requalification en faux si l'authenticité des dates est contestée. Sur le signalement COFRAC : le COFRAC dispose d'une procédure indépendante — le signalement protège la SEM et déclenche une enquête sur le comportement de l'auditrice, sans préjuger du résultat de l'audit lui-même.",
      lawRef:{label:"Art. 433-1 CP — Corruption active",url:"https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006418695"},
    },
    recap:{
      risk:"Corruption active & Faux en écriture",
      definition:"Transmettre des contacts commerciaux en échange d'un rapport favorable constitue une corruption active, même si l'avantage n'est pas financier. Un rapport d'audit qualifiant des non-conformités majeures en mineures sans justification technique documentée constitue un faux en écriture. En cas d'accident sur une zone certifiée frauduleusement, la mise en danger de la vie d'autrui peut s'ajouter.",
      gestures:[
        "Toute proposition d'un auditeur liée à une contrepartie — même non financière — doit être consignée par écrit immédiatement",
        "Signaler au COFRAC toute tentative d'arrangement sur un audit de certification",
        "Accepter une non-conformité majeure et la traiter réellement vaut toujours mieux qu'un certificat fragile",
      ],
      realLife:"Les arrangements sur les audits de certification sont une réalité documentée dans les secteurs industriels. Le COFRAC reçoit chaque année des signalements de comportements inappropriés d'auditeurs accrédités. Signaler protège — se taire expose.",
      jurisprudence:{
        titre:"Affaire de certification falsifiée (secteur agroalimentaire, 2020)",
        resume:"Un responsable qualité et un auditeur accrédité condamnés pour faux en écriture et corruption après avoir qualifié des non-conformités majeures en mineures dans le contexte d'un renouvellement de certification ISO 22000. Un incident alimentaire survenu six mois plus tard a déclenché l'enquête. L'auditeur a perdu son accréditation.",
        source:"TGI Lyon, 2020",
      },
    },
    microDecisions:[
      {
        sc:"zone3",
        situation:"Mme Andrieux consulte ses notes pendant deux heures sur le terrain. Elle revient avec un rapport préliminaire. L'ambiance a changé. Comment gérez-vous la fin de visite terrain ?",
        choices:[
          {letter:"A",desc:"« Je la laisse conclure — elle a l'air de bien maîtriser son sujet, inutile d'interférer. »",gauges:{i:-8,p:0,m:0},tint:true,reaction:{sp:"Mme Andrieux",ch:{css:"c-andrieux",em:"📋",nm:"Mme Andrieux — Auditrice CertExcel"},txt:"(Prenant ses notes sans croiser votre regard) <em>« J'ai vu ce que je devais voir. »</em> Elle a eu toute latitude pour documenter les manquements — sans que vous puissiez établir ce qu'elle a réellement vérifié."}},
          {letter:"B",desc:"« Je lui propose un café et lui demande comment ça se passe. »",gauges:{i:0,p:0,m:0},tint:false,reaction:{sp:"Mme Andrieux",ch:{css:"c-andrieux",em:"📋",nm:"Mme Andrieux — Auditrice CertExcel"},txt:"(Acceptant) <em>« Avec plaisir. La visite s'est bien passée dans l'ensemble. »</em> Elle reste vague. Le terrain est préparé pour la conversation de ce soir."}},
          {letter:"C",desc:"« Je lui demande de me présenter ses premières observations par écrit avant notre réunion de fin de journée. »",gauges:{i:+2,p:0,m:0},tint:false,reaction:{sp:"Mme Andrieux",ch:{css:"c-andrieux",em:"📋",nm:"Mme Andrieux — Auditrice CertExcel"},txt:"(Légèrement surprise) <em>« C'est inhabituel à ce stade, mais je peux vous préparer une note. »</em> Vous venez de créer une trace officielle avant toute discussion informelle. Elle le sait."}},
        ]
      },
      {
        sc:"reunionqse",
        situation:"Mme Andrieux est partie. Vous avez le rapport préliminaire sur la table. Deux cases cochées 'Non-conformité majeure'. Demain matin, elle attend votre réponse.",
        choices:[
          {letter:"A",desc:"« Ces contacts, je les ai. Un mail rapide ce soir — et le certificat est délivré la semaine prochaine. »",gauges:{i:-14,p:+8,m:0},tint:true,reaction:{sp:"Mme Andrieux",ch:{css:"c-andrieux",em:"📋",nm:"Mme Andrieux — Auditrice CertExcel"},txt:"(Par mail, immédiatement) <em>« Bien reçu. Je vous confirme la qualification révisée demain matin avant 9h. »</em> Le lien est établi. Par écrit. Dans votre messagerie professionnelle."}},
          {letter:"B",desc:"« Je lui transmets un seul contact — le moins stratégique — en espérant que ça suffise. »",gauges:{i:-10,p:+4,m:-8},tint:true,reaction:{sp:"Mme Andrieux",ch:{css:"c-andrieux",em:"📋",nm:"Mme Andrieux — Auditrice CertExcel"},txt:"(Par téléphone, froide) <em>« J'avais dit deux contacts. Avec un seul, je ne peux classer qu'une seule non-conformité en mineure. L'autre reste majeure. L'audit est suspendu de toute façon. »</em>"}},
          {letter:"C",desc:"« Je ne transmets rien. Je documente cette conversation par écrit ce soir même et j'informe la direction générale. »",gauges:{i:+3,p:0,m:0},tint:false,reaction:{sp:"Narrateur",ch:null,txt:"Vous ouvrez un document vierge. 21h08. Vous transcrivez chaque mot de la conversation — date, heure, lieu, verbatim. Vous envoyez le document à Dominique avec mention 'confidentiel' en objet. C'est fait."}},
        ]
      },
    ],
    memoire:{
      good:{
        chCible:4,
        txt:"<em>Vous avez déjà fait face à un agent public qui voulait arranger un rapport officiel. La méthode de Mme Andrieux est plus douce — mais le mécanisme est identique. Vous le reconnaissez.</em>",
      },
      bad:{
        chCible:4,
        txt:"<em>La dernière fois qu'un rapport officiel était en jeu, vous avez cédé. Mme Andrieux ne semble pas douter de votre réponse.</em>",
      },
    },
    transitions:{
      epilogue:{sp:"Narrateur",txt:`<em>Le signalement est transmis. L'enquête COFRAC est ouverte. Vous avez tenu — même quand 4,2 millions d'euros étaient sur la table. Il est temps de faire le point sur l'ensemble de votre parcours.</em>`},
      intermediate:{sp:"Narrateur",txt:`<em>L'audit est suspendu, mais les actions correctives sont engagées. Vous avez affronté les situations les plus critiques pour votre service. Il est temps de faire le point.</em>`},
    },
  },

];
