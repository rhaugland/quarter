-- Players table (anonymous auth)
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id TEXT UNIQUE NOT NULL,
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily games table (cached generated configs)
CREATE TABLE daily_games (
  id SERIAL PRIMARY KEY,
  day_number INTEGER UNIQUE NOT NULL,
  config JSONB NOT NULL,
  template_id TEXT NOT NULL,
  theme_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scores table
CREATE TABLE scores (
  id SERIAL PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES players(id),
  day_number INTEGER NOT NULL,
  score INTEGER NOT NULL,
  round_reached INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('dead', 'victory')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, day_number)
);

-- Graveyard (one-liners)
CREATE TABLE graveyard (
  id SERIAL PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES players(id),
  day_number INTEGER NOT NULL,
  message TEXT NOT NULL CHECK (char_length(message) <= 100),
  round_reached INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, day_number)
);

-- Streaks table
CREATE TABLE streaks (
  player_id UUID PRIMARY KEY REFERENCES players(id),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_played_day INTEGER DEFAULT 0,
  total_days_played INTEGER DEFAULT 0,
  total_deaths INTEGER DEFAULT 0,
  total_victories INTEGER DEFAULT 0,
  best_score INTEGER DEFAULT 0,
  best_score_day INTEGER,
  best_score_theme TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_scores_day_number ON scores(day_number);
CREATE INDEX idx_scores_day_score ON scores(day_number, score DESC);
CREATE INDEX idx_graveyard_day ON graveyard(day_number, created_at DESC);
CREATE INDEX idx_daily_games_day ON daily_games(day_number);

-- Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE graveyard ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_games ENABLE ROW LEVEL SECURITY;

-- Policies: anyone can read
CREATE POLICY "Scores are viewable by everyone" ON scores FOR SELECT USING (true);
CREATE POLICY "Graveyard is viewable by everyone" ON graveyard FOR SELECT USING (true);
CREATE POLICY "Daily games are viewable by everyone" ON daily_games FOR SELECT USING (true);
CREATE POLICY "Players are viewable by everyone" ON players FOR SELECT USING (true);
CREATE POLICY "Streaks are viewable by everyone" ON streaks FOR SELECT USING (true);

-- Policies: insert/update via service role
CREATE POLICY "Service role manages scores" ON scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role manages graveyard" ON graveyard FOR INSERT WITH CHECK (true);
CREATE POLICY "Service role manages players" ON players FOR ALL USING (true);
CREATE POLICY "Service role manages streaks" ON streaks FOR ALL USING (true);
CREATE POLICY "Service role manages daily_games" ON daily_games FOR ALL USING (true);
