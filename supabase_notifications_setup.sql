-- ================================================================
-- TASTE MINIAPP — Tam Supabase Kurulum SQL
-- Supabase SQL Editor'de çalıştır
-- Güncellendi: 2026-03-31
-- ================================================================

-- ────────────────────────────────────────────────────────────────
-- 1. TELEGRAM KULLANICILARI
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS telegram_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id BIGINT NOT NULL UNIQUE,
  username TEXT,
  first_name TEXT,
  language_code TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW(),
  notifications_enabled BOOLEAN DEFAULT true
);

ALTER TABLE telegram_users ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Servis erişebilir" ON telegram_users;
CREATE POLICY "Servis erişebilir" ON telegram_users FOR ALL USING (true);

-- ────────────────────────────────────────────────────────────────
-- 2. BİLDİRİM LOGLARI
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id BIGINT NOT NULL,
  notification_type TEXT NOT NULL DEFAULT 'daily_spin',
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  success BOOLEAN DEFAULT true
);

ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Servis erişebilir" ON notification_logs;
CREATE POLICY "Servis erişebilir" ON notification_logs FOR ALL USING (true);

-- ────────────────────────────────────────────────────────────────
-- 3. OTC SİPARİŞLERİ (Ödeme Bildirim Sistemi)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS otc_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,                          -- Telegram chat_id (string)
  wallet_address TEXT NOT NULL,                   -- TON cüzdan adresi
  amount_try NUMERIC(12, 2) NOT NULL,             -- Gönderilen TL
  amount_taste NUMERIC(20, 4) NOT NULL,           -- Alacağı TASTE miktarı
  exchange_rate NUMERIC(20, 8) NOT NULL,          -- 1 TASTE = X TL
  reference_code TEXT NOT NULL UNIQUE,            -- T-XXX-YYYY
  status TEXT NOT NULL DEFAULT 'pending'          -- pending | paid | completed | rejected | cancelled
    CHECK (status IN ('pending', 'paid', 'completed', 'rejected', 'cancelled')),
  receipt_url TEXT,                               -- Dekont fotoğrafı (Storage URL)
  admin_notes TEXT,                               -- Admin notu
  confirmed_at TIMESTAMPTZ,                       -- Admin onay zamanı
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE otc_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Servis erişebilir" ON otc_orders;
CREATE POLICY "Servis erişebilir" ON otc_orders FOR ALL USING (true);

-- Updated_at otomatik güncelleme trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_otc_updated_at ON otc_orders;
CREATE TRIGGER trg_otc_updated_at
  BEFORE UPDATE ON otc_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ────────────────────────────────────────────────────────────────
-- 4. STORAGE BUCKET (Dekont yüklemesi için)
-- ────────────────────────────────────────────────────────────────
-- NOT: Bunu Supabase Dashboard > Storage bölümünden manuel oluşturun
-- Bucket adı: "receipts" (Public: false)

-- ────────────────────────────────────────────────────────────────
-- 5. YARDIMCI VIEW — Admin Panel için Bekleyen Siparişler
-- ────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW pending_orders AS
SELECT
  o.id,
  o.reference_code,
  o.user_id,
  o.wallet_address,
  o.amount_try,
  o.amount_taste,
  o.exchange_rate,
  o.receipt_url,
  o.admin_notes,
  o.created_at,
  u.username AS telegram_username,
  u.first_name AS telegram_name
FROM otc_orders o
LEFT JOIN telegram_users u ON u.chat_id::TEXT = o.user_id
WHERE o.status = 'pending'
ORDER BY o.created_at ASC;

-- ────────────────────────────────────────────────────────────────
-- 6. INDEX — Performans
-- ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_otc_status ON otc_orders(status);
CREATE INDEX IF NOT EXISTS idx_otc_user_id ON otc_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_otc_ref_code ON otc_orders(reference_code);
CREATE INDEX IF NOT EXISTS idx_notif_chat_id ON notification_logs(chat_id);

-- ────────────────────────────────────────────────────────────────
-- 7. DOĞRULAMA
-- ────────────────────────────────────────────────────────────────
SELECT 
  'telegram_users' as tablo, COUNT(*) as kayit FROM telegram_users
UNION ALL
SELECT 
  'notification_logs', COUNT(*) FROM notification_logs
UNION ALL
SELECT 
  'otc_orders', COUNT(*) FROM otc_orders;

SELECT '✅ Tüm tablolar hazır! TASTE OTC sistemi kuruldu.' as durum;
