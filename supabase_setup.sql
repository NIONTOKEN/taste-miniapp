-- Supabase SQL Editor'de çalıştır
-- Sol menü → SQL Editor → New Query → Yapıştır → Run

CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('yemek', 'tarif', 'menu')),
  author_name TEXT NOT NULL DEFAULT 'Misafir',
  author_emoji TEXT NOT NULL DEFAULT '🍳',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  text TEXT NOT NULL,
  photo TEXT,
  tags TEXT[] DEFAULT '{}',
  recipe_title TEXT,
  ingredients JSONB,
  steps TEXT[],
  venue_name TEXT
);

-- Herkese okuma izni ver
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Herkes okuyabilir" ON posts FOR SELECT USING (true);
CREATE POLICY "Herkes yazabilir" ON posts FOR INSERT WITH CHECK (true);
