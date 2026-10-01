-- Schéma CoteSport (PostgreSQL / Neon). Idempotent : peut être rejoué sans risque.

CREATE TABLE IF NOT EXISTS listings (
  id bigserial PRIMARY KEY,
  source text NOT NULL,
  ext_id text NOT NULL,
  url text NOT NULL,
  country text,
  currency text,
  title text,
  description text DEFAULT '',
  price double precision,
  price_eur double precision,
  year int, month int, km int, power_ps int,
  make text DEFAULT 'BMW',
  family text, generation text, version text, segment text,
  model_conf real,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  flags jsonb NOT NULL DEFAULT '[]'::jsonb,
  published_at timestamptz,
  first_seen timestamptz NOT NULL DEFAULT now(),
  last_seen timestamptz NOT NULL DEFAULT now(),
  removed_at timestamptz,
  active boolean NOT NULL DEFAULT true,
  has_detail boolean NOT NULL DEFAULT false,
  UNIQUE (source, ext_id)
);
CREATE INDEX IF NOT EXISTS listings_family_idx ON listings (family, active);
CREATE INDEX IF NOT EXISTS listings_segment_idx ON listings (segment, active);
CREATE INDEX IF NOT EXISTS listings_detail_idx ON listings (source, active, has_detail);

CREATE TABLE IF NOT EXISTS price_history (
  id bigserial PRIMARY KEY,
  listing_id bigint NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  seen_at timestamptz NOT NULL DEFAULT now(),
  price double precision NOT NULL,
  price_eur double precision
);
CREATE INDEX IF NOT EXISTS price_history_listing_idx ON price_history (listing_id);

-- une ligne par source et par jour
CREATE TABLE IF NOT EXISTS runs (
  id bigserial PRIMARY KEY,
  day date NOT NULL,
  source text NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  status text NOT NULL DEFAULT 'running',
  pages int NOT NULL DEFAULT 0,
  seen int NOT NULL DEFAULT 0,
  new_count int NOT NULL DEFAULT 0,
  details int NOT NULL DEFAULT 0,
  removed int NOT NULL DEFAULT 0,
  skipped int NOT NULL DEFAULT 0,
  error text,
  UNIQUE (day, source)
);

CREATE TABLE IF NOT EXISTS fx_rates (day date PRIMARY KEY, chf_eur double precision NOT NULL, origin text);

CREATE TABLE IF NOT EXISTS segment_stats (
  day date NOT NULL, segment text NOT NULL, country text NOT NULL,
  n int, median_eur double precision,
  PRIMARY KEY (day, segment, country)
);

CREATE TABLE IF NOT EXISTS watch (
  id bigserial PRIMARY KEY,
  label text,
  params jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- file de pages à lire (une ligne = une page de résultats d'une recherche, pour un jour donné)
CREATE TABLE IF NOT EXISTS crawl_queue (
  id bigserial PRIMARY KEY,
  day date NOT NULL,
  source text NOT NULL,
  qkey text NOT NULL,
  page int NOT NULL,
  status text NOT NULL DEFAULT 'pending',   -- pending | done | error | skipped
  attempts int NOT NULL DEFAULT 0,
  note text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (day, source, qkey, page)
);

CREATE TABLE IF NOT EXISTS source_state (
  source text PRIMARY KEY,
  blocked_until timestamptz,
  last_status text,
  last_error text,
  finalized_day date,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS locks (name text PRIMARY KEY, until timestamptz NOT NULL);
