// ═══════════════════════════════════════
// SERVICES — Mapping service → chapitres prioritaires + données carte
// ═══════════════════════════════════════
// mapBox : zone cliquable sur la carte SEM (% de l'image)
//   x,y = coin haut-gauche ; w,h = largeur/hauteur
// ═══════════════════════════════════════
const SERVICES=[
  {
    id:'dg', em:'🏛️', label:'Direction Générale',
    priority:[], allPriority:true,
    mapBox:{x:42,y:38,w:16,h:11}, mapColor:'#fbbf24',
    desc:'Supervise l\'ensemble des services de la SEM. Tous les risques d\'intégrité vous concernent directement.',
    duree:'~50 min',
    risques:['Tous les risques couverts'],
  },
  {
    id:'rh', em:'👥', label:'Ressources Humaines',
    priority:[0,2],
    mapBox:{x:18,y:35,w:20,h:25}, mapColor:'#60a0f8',
    desc:'Gère le recrutement et les carrières. Exposé aux pressions politiques sur les nominations et aux anomalies de paie.',
    duree:'~15 min',
    risques:['Prise illégale d\'intérêts','Détournement de fonds'],
  },
  {
    id:'achats', em:'📦', label:'Achats / Marchés publics',
    priority:[1,5],
    mapBox:{x:62,y:35,w:18,h:22}, mapColor:'#d888f8',
    desc:'Pilote les marchés publics de la SEM. Au cœur des risques de favoritisme et de corruption passive.',
    duree:'~15 min',
    risques:['Favoritisme','Corruption passive'],
  },
  {
    id:'juridique', em:'⚖️', label:'Juridique / Conformité',
    priority:[6,4],
    mapBox:{x:28,y:8,w:22,h:18}, mapColor:'#22c55e',
    desc:'Valide les contrats et les acquisitions. En première ligne sur les conflits d\'intérêts et les contrats de complaisance.',
    duree:'~15 min',
    risques:['Prise illégale d\'intérêts','Contrat de complaisance'],
  },
  {
    id:'finance', em:'💰', label:'Finance / Comptabilité',
    priority:[7,2],
    mapBox:{x:12,y:58,w:25,h:20}, mapColor:'#f59e0b',
    desc:'Contrôle les flux financiers de la SEM. Garant de la détection des détournements, anomalies de paie et fraudes au virement.',
    duree:'~15 min',
    risques:['Détournement de fonds','Fraude au virement bancaire'],
  },
  {
    id:'rp', em:'📣', label:'Relations Publiques',
    priority:[8,5],
    mapBox:{x:42,y:49,w:16,h:11}, mapColor:'#ec4899',
    desc:'Gère les partenariats institutionnels et la communication externe. Exposé aux risques de mécénat de complaisance et de trafic d\'influence.',
    duree:'~15 min',
    risques:['Corruption active','Mécénat de complaisance'],
  },
  {
    id:'commercial', em:'📈', label:'Commercial / Développement',
    priority:[9,1],
    mapBox:{x:42,y:63,w:18,h:14}, mapColor:'#e85d4a',
    desc:'Développe les contrats et partenariats territoriaux. Face aux propositions illicites dans les appels d\'offres.',
    duree:'~15 min',
    risques:['Corruption active','Recel'],
  },
  {
    id:'qse', em:'🛡️', label:'QSE / QHSE',
    priority:[4,12],
    mapBox:{x:62,y:58,w:18,h:20}, mapColor:'#10b981',
    desc:'Pilote les certifications et la conformité réglementaire du site. Exposé aux pressions sur les audits de certification et aux inspections environnementales.',
    duree:'~15 min',
    risques:['Corruption active','Faux en écriture'],
  },
  {
    id:'operationnel', em:'🏭', label:'Site Industriel',
    mapBox:{x:64,y:3,w:30,h:32}, mapColor:'#0e7c7b',
    desc:'Le site industriel regroupe l\'exploitation et la maintenance. Choisissez votre pôle pour accéder aux affaires correspondantes.',
    duree:'~4–15 min',
    risques:['Corruption passive','Trafic d\'influence','Favoritisme'],
    // Zone parente : affiche un sous-menu avec les services enfants
    subServices: ['exploitation','maintenance'],
  },
  {
    id:'exploitation', em:'⚙️', label:'Exploitation',
    priority:[3,4,12],
    mapBox:{x:65,y:5,w:28,h:28}, mapColor:'#0e7c7b',
    desc:'Exploite le site industriel au quotidien. Exposé aux pressions des prestataires, aux fraudes de pesée et aux détournements de collecte.',
    duree:'~20 min',
    risques:['Corruption passive','Trafic d\'influence','Pollution illicite'],
    // Service enfant — ne s'affiche pas comme zone indépendante sur la carte
    parentZone:'operationnel',
  },
  {
    id:'maintenance', em:'🔧', label:'Maintenance',
    priority:[3,4,10,12],
    mapBox:{x:65,y:5,w:28,h:28}, mapColor:'#64748b',
    desc:'Gère les équipements du site industriel. Exposé aux pressions des prestataires, aux fraudes de pesée et aux risques de favoritisme lors des renouvellements de contrats.',
    duree:'~20 min',
    risques:['Favoritisme','Corruption passive','Trafic d\'influence'],
    // Service enfant — ne s'affiche pas comme zone indépendante sur la carte
    parentZone:'operationnel',
  },
];

function buildChapterOrder(svc){
  const all = [...Array(CHAPTERS.length).keys()];
  if(svc.allPriority) return all;
  if(svc.soloMode) return [...svc.priority];
  const bonus = all.filter(i => !svc.priority.includes(i));
  return [...svc.priority, ...bonus];
}
