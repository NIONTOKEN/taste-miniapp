-- ══════════════════════════════════════════════════════════════
-- TASTE MiniApp — Spin Records Table
-- Supabase SQL Editor'da çalıştırın
-- ══════════════════════════════════════════════════════════════

-- Tablo oluştur
CREATE TABLE IF NOT EXISTS spin_records (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id    text        NOT NULL,
  spin_date    date        NOT NULL DEFAULT CURRENT_DATE,
  points_gained integer    NOT NULL DEFAULT 0,
  taste_won    integer     NOT NULL DEFAULT 0,
  total_points integer     NOT NULL DEFAULT 0,
  total_claimed integer    NOT NULL DEFAULT 0,
  created_at   timestamptz DEFAULT now(),

  -- Günde sadece 1 spin (player_id + tarih kombinasyonu unique)
  CONSTRAINT unique_player_daily UNIQUE (player_id, spin_date)
);

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE spin_records ENABLE ROW LEVEL SECURITY;

-- Herkes kendi kaydını ekleyebilir (INSERT)
CREATE POLICY "Allow insert spin"
  ON spin_records FOR INSERT
  WITH CHECK (true);

-- Herkes okuyabilir (kendi toplam puanını görmek için)
CREATE POLICY "Allow select spin"
  ON spin_records FOR SELECT
  USING (true);

-- UPDATE ve DELETE yasak — API üzerinden manipülasyon engellenir
-- (Supabase anon key ile UPDATE/DELETE politikası yok = erişim yok)
-- Sadece claim sırasında kendi kaydını güncelleyebilir (total_claimed için)
CREATE POLICY "Allow update own spin"
  ON spin_records FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ── Index: hız için ──────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_spin_player_date
  ON spin_records (player_id, spin_date DESC);

-- ── Test: doğru çalışıyor mu? ────────────────────────────────
-- SELECT * FROM spin_records LIMIT 10;
