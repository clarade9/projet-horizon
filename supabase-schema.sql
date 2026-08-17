-- ═══════════════════════════════════════════════════════════════
-- PROJET HORIZON — Schéma Supabase (RESET COMPLET)
-- 1. Coller dans : Supabase Dashboard → SQL Editor → New query
-- 2. Cliquer Run (confirmer l'avertissement "destructive")
-- ═══════════════════════════════════════════════════════════════

-- ── DROP tables dans l'ordre (contraintes FK) ─────────────────
DROP TABLE IF EXISTS votes_live    CASCADE;
DROP TABLE IF EXISTS sessions_live CASCADE;
DROP TABLE IF EXISTS choix         CASCADE;
DROP TABLE IF EXISTS joueurs       CASCADE;

-- ═══════════════════════════════════════════════════════════════
-- TABLES PRINCIPALES
-- ═══════════════════════════════════════════════════════════════

-- ── Table joueurs ─────────────────────────────────────────────
CREATE TABLE joueurs (
  id                    BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  prenom                TEXT NOT NULL,
  nom                   TEXT NOT NULL,
  service               TEXT,
  date_connexion        TIMESTAMPTZ DEFAULT NOW(),
  parcours_prioritaire  TEXT[]      DEFAULT '{}',
  affaires_completees   TEXT[]      DEFAULT '{}',
  score_integrite       INTEGER,
  score_projet          INTEGER,
  score_image_sem       INTEGER,
  verdict_final         TEXT,
  badges                TEXT[]      DEFAULT '{}',
  temps_total_minutes   INTEGER,
  UNIQUE (prenom, nom)
);

-- ── Table choix ───────────────────────────────────────────────
CREATE TABLE choix (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  joueur_id     BIGINT REFERENCES joueurs(id) ON DELETE CASCADE,
  affaire       TEXT,
  choix_fait    TEXT,
  verdict       TEXT,
  sos_utilise   BOOLEAN DEFAULT FALSE,
  temps_minutes INTEGER,
  date          TIMESTAMPTZ DEFAULT NOW()
);

-- ── RLS joueurs / choix ───────────────────────────────────────
ALTER TABLE joueurs ENABLE ROW LEVEL SECURITY;
ALTER TABLE choix   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_select_joueurs" ON joueurs FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_joueurs" ON joueurs FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_joueurs" ON joueurs FOR UPDATE TO anon USING (true);

CREATE POLICY "anon_select_choix" ON choix FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_choix" ON choix FOR INSERT TO anon WITH CHECK (true);

-- ═══════════════════════════════════════════════════════════════
-- MODE FORMATEUR LIVE
-- ═══════════════════════════════════════════════════════════════

-- ── Table sessions_live ───────────────────────────────────────
CREATE TABLE sessions_live (
  id                   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code                 TEXT        NOT NULL UNIQUE,
  phase                TEXT        NOT NULL DEFAULT 'attente',
  affaire_active       INTEGER     DEFAULT NULL,
  dialogue_idx         INTEGER     DEFAULT NULL,   -- index ligne dialogue courante
  votes_ouverts_depuis TIMESTAMPTZ DEFAULT NULL,
  statut               TEXT        NOT NULL DEFAULT 'active',
  formateur_token      TEXT        DEFAULT NULL,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_live_code   ON sessions_live(code);
CREATE INDEX idx_sessions_live_statut ON sessions_live(statut);

-- ── Table votes_live ──────────────────────────────────────────
CREATE TABLE votes_live (
  id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id       BIGINT  NOT NULL REFERENCES sessions_live(id) ON DELETE CASCADE,
  joueur_id        TEXT    NOT NULL,
  joueur_nom       TEXT    NOT NULL,
  affaire          INTEGER NOT NULL,
  choix_index      INTEGER NOT NULL,
  est_correct      BOOLEAN NOT NULL,
  temps_reponse_ms INTEGER NOT NULL,
  score            INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (session_id, joueur_id, affaire)
);

CREATE INDEX idx_votes_live_session ON votes_live(session_id);
CREATE INDEX idx_votes_live_joueur  ON votes_live(joueur_id);

-- ── RLS sessions_live / votes_live ────────────────────────────
ALTER TABLE sessions_live ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes_live    ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_all_sessions_live" ON sessions_live FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "anon_all_votes_live"    ON votes_live    FOR ALL TO anon USING (true) WITH CHECK (true);

-- ── Realtime ──────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE sessions_live;
ALTER PUBLICATION supabase_realtime ADD TABLE votes_live;

ALTER TABLE sessions_live REPLICA IDENTITY FULL;
ALTER TABLE votes_live    REPLICA IDENTITY FULL;

-- ── Migration v2 : ajouter dialogue_idx si ce script est rejoué ─
-- (déjà inclus dans le CREATE TABLE ci-dessus — cette ligne
--  est utile uniquement si vous faites une migration partielle)
-- ALTER TABLE sessions_live ADD COLUMN IF NOT EXISTS dialogue_idx INTEGER DEFAULT NULL;
