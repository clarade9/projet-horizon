# Affaire 8 — L'Urgence de fin de mois

**Sous-thème :** Finance & Fraude au virement bancaire

## Contexte

**Responsable Finance de la SEM.** L'audit trimestriel de Francine, la contrôleuse de gestion du groupe, est prévu dans 72 heures. M. Renaud, dirigeant de ProSite SARL, prestataire historique sur le chantier Horizon depuis cinq ans, vous appelle en fin de journée. Il a besoin d'une avance. Et il a un argument : une pièce critique dont le site a besoin avant l'audit.

## Personnage jouable

Responsable Finance

## Décor

finance (Bureau finance — image : findumois.jpg avec overlay téléphone)

---

## Micro-décision 1

*(phoneRing : le téléphone sonne avant cette micro-décision)*

**Situation :** Votre téléphone sonne. M. Renaud, dirigeant de ProSite SARL et partenaire depuis cinq ans, demande à vous parler d'une « chose délicate ».

**Option A :** « M. Renaud, je vous écoute. »
→ Réaction — M. Renaud : *(Soulagé)* « Merci de décrocher. Voilà la situation… »

**Option B :** « Bonsoir M. Renaud. Je vous écoute, mais pour tout engagement je vous préviens : ça devra passer par la procédure habituelle. »
→ Réaction — M. Renaud : « Je comprends. Mais c'est urgent — laissez-moi vous expliquer. »

**Option C :** « Bonsoir M. Renaud. Allez-y. »
→ Réaction — M. Renaud : « Bonsoir. Voilà — je vais être direct avec vous… »

---

## Dialogues — Chemin principal

**Narrateur :** *Il commence alors par évoquer les souvenirs communs, les cinq années passées ensemble. Le terrain est préparé.*

**M. Renaud :** *« Cinq ans qu'on travaille ensemble sur Horizon. Le terrassement du hall B, les fondations, le réseau technique, ProSite a tenu les délais quand personne d'autre n'aurait pu. Vous le savez mieux que quiconque. »*

**Vous :** *« C'est vrai. Que se passe-t-il ? »*

**M. Renaud :** *« Un retard de règlement d'un client, rien de dramatique en temps normal. Mais là j'ai un problème de trésorerie court terme. J'aurais besoin d'une avance de 30 000€ sur la prochaine facture. Juste pour passer le mois. »*

**Vous :** *« Une avance n'est pas prévue dans notre contrat, M. Renaud. Ce type de décision nécessite une autorisation préalable. »*

**M. Renaud :** *(changeant de registre)* *« Je comprends les procédures. Mais il y a la pièce de remplacement pour la ligne B, le motoréducteur principal. Si je ne dégage pas 30 000€ avant jeudi, le fournisseur ne me la libère pas. Et sans cette pièce… l'audit de lundi se passe en présence d'une ligne à l'arrêt. »*

**Vous :** *« Et vous proposez comment de régulariser cette avance ? »*

**M. Renaud :** *(plus confidentiel)* *« Une facture légèrement majorée — 32 500€ au lieu de 29 800€. La différence couvre l'avance. En pratique c'est neutre pour vous, et ça passe comme une ligne ordinaire. M. Aubert connaît la situation, il a dit que vous trouveriez une solution pragmatique. »*

**Vous :** *« Ce que vous décrivez, c'est une surfacturation. C'est une irrégularité comptable pour vous comme pour nous. »*

**M. Renaud :** *« Pour aller plus vite, j'ai transmis un nouveau RIB par mail il y a une heure. Ça évite de passer par la trésorerie centrale. Vous avez dû recevoir le mail. »*

**Vous :** *« Je le vois. Et je vois aussi l'alerte automatique de notre logiciel de conformité, tout changement de RIB déclenche une vérification obligatoire. Je prends note de votre demande et vous rappelle dans la journée après vérification. »*

---

## Micro-décision 2

**Situation :** M. Renaud vient de raccrocher. L'alerte de changement de RIB est active sur votre écran. L'audit de Francine commence dans 72 heures.

**Option A :** « Je valide le virement sur le nouveau RIB — si c'est régulier, la pièce est débloquée avant l'audit. »
→ Impact jauges : Intégrité -4
→ Réaction — M. Renaud : *(Par mail, immédiatement)* « Parfait. Je vous envoie la confirmation dans l'heure. » Vous venez de valider un changement de RIB non authentifié malgré l'alerte automatique.

**Option B :** « Je bloque tout paiement et je signale le changement de RIB au service conformité immédiatement. »
→ Pas d'impact jauges
→ Réaction — Narrateur : L'alerte est transmise. Le changement de RIB est bloqué en attente de vérification indépendante. Aucun paiement ne peut être effectué dans l'intervalle.

**Option C :** « Je rappelle M. Renaud pour lui faire confirmer le nouveau RIB par téléphone avant d'aller plus loin. »
→ Impact jauges : Intégrité -2
→ Réaction — M. Renaud : « Le RIB est correct, je vous assure. Notre banque a changé récemment. » Sa réponse est immédiate — mais une confirmation verbale ne vaut pas une procédure de vérification formelle.

---

## Choix final

**Option A :** Valider l'avance sur le nouveau RIB avec une note interne « sous réserve de vérification », si le RIB est régulier, l'exception est couverte ; si ce n'est pas le cas, la note prouve la bonne foi.
→ Type : **bad** 🔴 Échec
→ Verdict : Détournement de fonds
→ Conséquence : La pièce est livrée. L'audit se passe sans incident visible. Trois semaines plus tard, le vrai compte ProSite signale ne jamais avoir reçu le virement : le nouveau RIB appartient à une société écran. L'enquête remonte à votre validation du changement de RIB malgré l'alerte automatique. Vous êtes mis(e) en cause pour complicité de détournement.
→ Analyse juridique : **Qualification :** Valider un changement de RIB non authentifié malgré une alerte de conformité, combiné à une surfacturation, constitue une **complicité de détournement de fonds** (art. 432-15 CP). L'exception invoquée ne suspend pas l'obligation de contrôle.
→ Impact jauges : Intégrité **-40**, Projet **-8**, Image SEM **-32**

---

**Option B :** Valider l'avance sur l'ancien RIB uniquement, cela évite le risque du nouveau RIB non vérifié et débloque la livraison avant l'audit.
→ Type : **warn** 🟠 Risqué
→ Verdict : Avance irrégulière
→ Conséquence : Le virement part sur l'ancien RIB, ProSite le reçoit. La pièce est livrée. Mais l'avance sans clause contractuelle est relevée par l'auditrice Francine. Elle demande la décision écrite du conseil d'administration. Il n'y en a pas. Votre responsabilité personnelle est engagée pour avoir outrepassé vos délégations de pouvoir.
→ Analyse juridique : **Qualification :** Une avance accordée hors clause contractuelle, même bien intentionnée, constitue une **irrégularité budgétaire**. Sans validation hiérarchique formelle, elle expose le signataire à une mise en cause disciplinaire et financière.
→ Impact jauges : Intégrité **-16**, Projet **+6**, Image SEM **-12**

---

**Option C :** Bloquer tout paiement, signaler le changement de RIB au service conformité comme alerte de fraude potentielle, et informer la DG que la livraison sera retardée même si ça crée une tension avec le prestataire à 72h de l'audit.
→ Type : **good** 🟢 Succès
→ Verdict : Procédure exemplaire
→ Conséquence : Le service conformité bloque le nouveau RIB et remonte l'alerte. L'enquête révèle une tentative de fraude au virement — les mails de ProSite avaient été compromis par un tiers. M. Renaud est lui-même victime. La pièce est commandée directement par la SEM en urgence. L'audit se passe normalement.
→ Analyse juridique : **Bonne pratique :** La vérification systématique des changements de RIB et le refus d'avances non contractuelles sont les deux réflexes fondamentaux de la conformité financière. Le signalement active les protections du dispositif d'alerte interne Sapin II.
→ Impact jauges : Intégrité **+17**, Projet **-4**, Image SEM **+22**

---

## Fiche récap — Ce qu'il faut retenir

**Infraction :** Détournement de fonds & Fraude au virement bancaire

**Définition :** Le détournement de fonds désigne le fait, pour un agent, de permettre la soustraction de fonds publics. La fraude au virement par faux RIB est la technique la plus fréquente : un tiers substitue les coordonnées bancaires d'un fournisseur légitime pour intercepter un paiement.

**Les 3 gestes barrières :**
1. Ne jamais valider un changement de RIB sans procédure formelle : signature du bénéficiaire + visa service juridique
2. Refuser toute avance de trésorerie non prévue au contrat, quelle que soit la pression temporelle
3. Signaler immédiatement au service conformité toute demande de paiement dérogatoire accompagnée d'un changement de coordonnées

**Et dans la vraie vie ?**
Un responsable financier d'une SEM valide une demande urgente d'avance accompagnée d'un changement de RIB, malgré une alerte automatique. Le nouveau RIB appartient à une société écran. 48 000€ sont détournés. Le prestataire légitime n'a jamais reçu le virement. La négligence grave du responsable financier — avoir ignoré l'alerte — engage sa responsabilité disciplinaire et civile.

**Référence légale :** Art. 432-15 CP — Détournement de fonds

---

## Transition vers affaire suivante

**→ Vers Affaire 3 :** L'alerte a été traitée. Mais d'autres anomalies couvent dans les systèmes financiers de la SEM. Vous recevez un rapport qui révèle des modifications inexpliquées dans les bulletins de paie.
