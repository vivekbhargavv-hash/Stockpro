-- Precomputed signal results
CREATE TABLE IF NOT EXISTS signals (
    signal_type   TEXT PRIMARY KEY,
    stocks        JSONB NOT NULL DEFAULT '[]',
    stocks_count  INTEGER NOT NULL DEFAULT 0,
    computed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NSE 500 stock metadata cache
CREATE TABLE IF NOT EXISTS stocks_meta (
    ticker        TEXT PRIMARY KEY,
    name          TEXT,
    sector        TEXT,
    industry      TEXT,
    market_cap    BIGINT,
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast JSONB queries on signal stocks
CREATE INDEX IF NOT EXISTS idx_signals_computed_at ON signals (computed_at DESC);

-- Row-level security: read-only for anon (no auth in v1)
ALTER TABLE signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE stocks_meta ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read signals"
    ON signals FOR SELECT
    USING (true);

CREATE POLICY "Public read stocks_meta"
    ON stocks_meta FOR SELECT
    USING (true);
