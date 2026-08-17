# Affaire 3 — Les Fantômes de la Paie

**Sous-thème :** Finance & Détournement de fonds

## Contexte

Lors d'un contrôle interne de routine, vous identifiez une anomalie : le RIB bancaire de **Mme Garnier**, agente administrative, a été modifié deux fois en un mois dans le SIRH, sans aucune demande signée par les RH. Sa rémunération a également été revalorisée de **800€/mois** sans avenant à son contrat.

*Mme Favre, Responsable Paie, a effectué ces modifications sous ses propres identifiants. Vous la convoquez.*

## Personnage jouable

Contrôleur Interne

## Décor

bureauf (Bureau — image : bureauf.jpg)

---

## Micro-décision 1

**Situation :** Vous avez repéré l'anomalie dans le SIRH. Un collègue vous suggère d'en parler « en informel » à Mme Favre avant d'agir.

**Option A :** « Mme Favre, j'ai vu une anomalie sur la fiche Garnier. Je voulais vous prévenir avant de remonter ça. »
→ Réaction — Mme Favre : *(Soulagée)* « Merci de me prévenir. Je vais arranger ça discrètement. » Elle dispose maintenant de plusieurs heures pour régulariser des traces.

**Option B :** « Je rassemble tous les éléments et je convoque un entretien formel avec les documents. »
→ Réaction — Narrateur : Vous sécurisez les logs horodatés, prenez des captures d'écran et préparez un dossier complet. Mme Favre sera convoquée sans préavis.

**Option C :** « J'en parle d'abord à mon responsable hiérarchique pour valider ma démarche avant de convoquer qui que ce soit. »
→ Réaction — Narrateur : Votre responsable dit *« assure-toi bien avant de t'avancer »*. Le temps de valider la démarche, l'information a quitté le périmètre confidentiel du contrôleur interne.

---

## Dialogues — Chemin principal

**Narrateur :** *La rencontre a lieu. Mme Favre entre dans la pièce le visage fermée et le regard fixe.*

**Mme Favre :** *« Je ne vois pas de quoi vous voulez parler. Des corrections techniques, rien de plus. J'ai fait mon travail. »*

**Vous :** *« Les logs SIRH montrent que vous avez modifié le RIB de Mme Garnier un vendredi à 19h32, hors procédure. Et sa rémunération a augmenté de 800€ sans avenant ni validation RH. »*

**Mme Favre :** *(S'agitant)* *« Elle m'a demandé de changer son RIB discrètement, elle avait ses raisons. Et pour le salaire, c'était une erreur de grille que j'ai corrigée. Vous n'y connaissez rien. »*

**Vous :** *« Tout changement de RIB doit être accompagné d'une signature de la salariée et d'un visa RH. Il n'y a rien de tel dans le dossier. »*

**Mme Favre :** *« Vous cherchez des ennuis là où il n'y en a pas. Si vous continuez, je dirai que c'est vous qui m'avez demandé de le faire. C'est ma parole contre la vôtre. Classez ce dossier. »*

**Vous :** *« Les logs horodatés ne mentent pas, Madame Favre. »*

---

## Micro-décision 2

**Situation :** Pendant l'entretien, Mme Favre affirme que c'était « une correction technique » et que vous allez lui créer des ennuis inutiles.

**Option A :** « Écrivez-moi une note explicative et je verrai avant de remonter quoi que ce soit. »
→ Impact jauges : Intégrité -4
→ Réaction — Mme Favre : *(Soulagée, se levant)* « Je vous fais ça cet après-midi. » Elle reviendra plus tard avec une note insuffisante — et un ton beaucoup plus menaçant.

**Option B :** « Je transmets le dossier complet au service juridique aujourd'hui. C'est la procédure. »
→ Pas d'impact jauges
→ Réaction — Mme Favre : *(Changeant de ton)* « Si vous continuez, je dirai que c'est vous qui m'avez demandé de le faire. C'est ma parole contre la vôtre. »

**Option C :** « Je transmets le dossier aux Ressources Humaines pour une procédure disciplinaire. »
→ Impact jauges : Intégrité -2
→ Réaction — Mme Favre : *(Visiblement soulagée)* « Une procédure disciplinaire, très bien. Je connais mes droits. » Les RH ne peuvent ni geler les flux ni sécuriser les preuves numériques.

---

## Choix final

**Option A :** Demander à Mme Favre de régulariser elle-même les modifications et lui laisser deux semaines pour fournir les justificatifs manquants, sans remontée hiérarchique pour l'instant.
→ Type : **bad** 🔴 Échec
→ Verdict : Complicité de détournement
→ Conséquence : Le virement frauduleux continue. Trois mois plus tard, l'audit annuel remonte l'anomalie. Les logs montrent que vous aviez accès au dossier et ne l'avez pas signalé. Vous êtes considéré(e) comme complice par omission. Vous et Mme Favre êtes mis(e)s en cause.
→ Analyse juridique : **Qualification :** Ne pas signaler un détournement dont on a connaissance expose à une qualification de **complicité de détournement de fonds**. L'omission volontaire est une faute grave, pénalement et disciplinairement.
→ Impact jauges : Intégrité **-40**, Projet **-8**, Image SEM **-32**

---

**Option B :** Signaler verbalement à votre N+1 que vous avez de sérieux doutes sur la gestion de paie, en lui laissant décider de la suite à donner.
→ Type : **warn** 🟠 Risqué
→ Verdict : Alerte insuffisante
→ Conséquence : Votre responsable dit avoir transmis l'information, mais rien n'est documenté. Lors de l'audit, vous ne pouvez pas prouver votre signalement. Votre responsabilité professionnelle est engagée.
→ Analyse juridique : **Qualification :** Une alerte orale sans trace écrite n'est pas une alerte au sens du dispositif anticorruption Sapin II. Le signalement doit être formalisé pour protéger le lanceur d'alerte et déclencher une procédure.
→ Impact jauges : Intégrité **-16**, Projet **-4**, Image SEM **-16**

---

**Option C :** Geler immédiatement les modifications dans le SIRH, notifier par écrit le déontologue et la DRH, et lancer un audit des 12 derniers mois.
→ Type : **good** 🟢 Succès
→ Verdict : Contrôle interne exemplaire
→ Conséquence : Le gel immédiat des virements empêche de nouveaux préjudices. L'audit révèle trois autres modifications suspectes. Mme Favre est mise à pied conservatoire. Mme Garnier est informée et protégée. Vous recevez les félicitations du conseil d'administration.
→ Analyse juridique : **Bonne pratique :** Signaler par écrit, geler les flux et documenter les preuves : les trois réflexes du contrôleur interne. Le dispositif d'alerte interne Sapin II protège le lanceur d'alerte de toute représaille.
→ Impact jauges : Intégrité **+22**, Projet **+6**, Image SEM **+22**

---

## Fiche récap — Ce qu'il faut retenir

**Infraction :** Détournement de fonds

**Définition :** Un agent détourne à son profit — ou celui d'un tiers — des fonds ou biens qui lui sont confiés dans l'exercice de sa fonction. L'infraction est constituée même si les sommes détournées sont modestes.

**Les 3 gestes barrières :**
1. Appliquer le principe des quatre yeux pour toute modification de données sensibles dans un SIRH
2. Signaler immédiatement par écrit toute anomalie, sans attendre la confirmation hiérarchique
3. Geler les flux concernés avant tout entretien avec la personne suspectée

**Et dans la vraie vie ?**
Une responsable paie d'une intercommunalité modifie le RIB d'une salariée en congé maladie longue durée vers un compte à son nom. L'anomalie est détectée 14 mois plus tard lors de l'audit annuel. Montant détourné : 9 800€. Condamnation à 2 ans avec sursis et remboursement intégral.

**Référence légale :** Art. 432-15 CP — Détournement de fonds

---

## Transition vers affaire suivante

*(3 variantes possibles selon l'ordre de jeu)*

**→ Vers Affaire 4 :** L'intégrité financière est préservée. Le centre continue à tourner. La nuit tombe. Vous surveillez la bascule de pesée. Un camion s'arrête. Le chauffeur descend une enveloppe à la main.

**→ Vers Affaire 5 :** L'intégrité financière est préservée. Le centre continue à tourner. Une inspection inopinée frappe à la porte. Vous allez faire face à un inspecteur dont les intentions sont pour le moins… troubles.

**→ Vers Affaire 6 :** L'intégrité financière est préservée. Mais de nouvelles pressions se profilent. Vous devez décrocher un contrat crucial pour rentabiliser le centre. Un directeur municipal a une proposition pour le moins surprenante.
