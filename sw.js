// ═══════════════════════════════════════════════════════════════
// SERVICE WORKER — Projet Horizon PWA Offline
// Stratégie : Cache First pour assets statiques
//             Network First pour API Supabase
// ═══════════════════════════════════════════════════════════════

const CACHE_NAME    = 'horizon-v3';
const SUPABASE_HOST = 'supabase.co';

// Assets statiques préchargés à l'installation
const CACHE_URLS = [
  // Pages
  '/',
  '/index.html',
  '/manifest.json',
  '/config.js',
  '/favicon.ico',

  // CSS
  '/css/variables.css',
  '/css/layout.css',
  '/css/scenes.css',
  '/css/panels.css',
  '/css/intro.css',
  '/css/personalization.css',
  '/css/mobile.css',
  '/css/badges.css',
  '/css/tutorial.css',
  '/css/map-select.css',

  // JS core (chargés sans defer)
  '/js/data/lexique-data.js',

  // JS defer
  '/js/main.js',
  '/js/scenes.js',
  '/js/characters.js',
  '/js/dialogue.js',
  '/js/choices.js',
  '/js/microdecisions.js',
  '/js/hud.js',
  '/js/epilogue.js',
  '/js/lexique.js',
  '/js/quiz.js',
  '/js/badges.js',
  '/js/tracker.js',
  '/js/streak.js',
  '/js/reflexe-pro.js',
  '/js/audio.js',
  '/js/preloader.js',
  '/js/sos.js',
  '/js/tutorial.js',
  '/js/memoire.js',
  '/js/map-select.js',
  '/js/stats-perso.js',
  '/js/checkpoint.js',

  // Data
  '/js/data/chapters.js',
  '/js/data/prologue.js',
  '/js/data/epilogue-data.js',
  '/js/data/services.js',
  '/js/data/mini-jeux-data.js',

  // Vidéo d'intro
  '/assets/intro.mp4',

  // Scènes
  '/assets/scenes/prologue.webp',
  '/assets/scenes/bureau1.webp',
  '/assets/scenes/bureauf.webp',
  '/assets/scenes/bureau2.webp',
  '/assets/scenes/bureau9.webp',
  '/assets/scenes/bureaujour.webp',
  '/assets/scenes/mairie.webp',
  '/assets/scenes/resto.webp',
  '/assets/scenes/restojour.webp',
  '/assets/scenes/bistro.webp',
  '/assets/scenes/sallereunion.webp',
  '/assets/scenes/pesee.webp',
  '/assets/scenes/indus.webp',
  '/assets/scenes/findumois.webp',
  '/assets/scenes/contratatoutprix.webp',
  '/assets/scenes/tennis.webp',
  '/assets/scenes/epilogue.webp',
  '/assets/scenes/salle-formation.webp',
  '/assets/scenes/carte-sem.webp',
  '/assets/scenes/telephonerenaud.webp',
  '/assets/scenes/telephonefontaine.webp',
  '/assets/scenes/telephonelaroche.webp',
  '/assets/scenes/telephoneperrin.webp',

  // Personnages
  '/assets/characters/dominique.png',
  '/assets/characters/aubert.png',
  '/assets/characters/favre.png',
  '/assets/characters/fontaine.png',
  '/assets/characters/laroche.png',
  '/assets/characters/lefebvre.png',
  '/assets/characters/marie.png',
  '/assets/characters/patrice.png',
  '/assets/characters/renaud.png',
  '/assets/characters/ruiz.png',
  '/assets/characters/formatrice.png',
  '/assets/characters/deschamps.png',
  '/assets/characters/perrin.png',

  // Audio
  '/assets/audio/musiques/bureau.mp3',
  '/assets/audio/musiques/favre.mp3',
  '/assets/audio/musiques/pesee.mp3',
  '/assets/audio/musiques/exterieur.mp3',
  '/assets/audio/musiques/mairie.mp3',
  '/assets/audio/musiques/extension.mp3',
  '/assets/audio/musiques/urgencefindemois.mp3',
  '/assets/audio/musiques/operationprestige.mp3',
  '/assets/audio/musiques/contratatoutprix.mp3',
  '/assets/audio/musiques/introduction.mp3',
  '/assets/audio/musiques/restaurant.mp3',
  '/assets/audio/musiques/bistro.mp3',
  '/assets/audio/musiques/happyending.mp3',
  '/assets/audio/musiques/middlehappening.mp3',
  '/assets/audio/musiques/badmusic.mp3',
  '/assets/audio/musiques/musique-tutoriel.mp3',
];

// ── Installation : préchargement du cache ────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Précharger les assets critiques (ignore les erreurs individuelles)
      return Promise.allSettled(
        CACHE_URLS.map(url =>
          cache.add(url).catch(err => {
            console.warn('[SW] Impossible de précacher :', url, err.message);
          })
        )
      );
    }).then(() => {
      self.skipWaiting();
    })
  );
});

// ── Activation : nettoyage des anciens caches ─────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch : stratégie selon la destination ───────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Network First pour Supabase (données temps réel)
  if (url.hostname.includes(SUPABASE_HOST)) {
    event.respondWith(_networkFirst(event.request));
    return;
  }

  // Ne pas intercepter les requêtes POST/PUT/DELETE
  if (event.request.method !== 'GET') return;

  // Ne pas intercepter les extensions navigateur ou chrome-extension
  if (!url.protocol.startsWith('http')) return;

  // Cache First pour tous les autres assets statiques
  event.respondWith(_cacheFirst(event.request));
});

// ── Stratégie Cache First ─────────────────────────────────────
async function _cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch(err) {
    // Hors ligne et pas dans le cache : retourner index.html pour les navigations
    if (request.mode === 'navigate') {
      const fallback = await caches.match('/index.html');
      if (fallback) return fallback;
    }
    return new Response('Hors ligne — ressource indisponible.', {
      status: 503,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    });
  }
}

// ── Stratégie Network First ───────────────────────────────────
async function _networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch(err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response(JSON.stringify({ error: 'offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
