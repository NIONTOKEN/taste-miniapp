-- ================================================================
-- TASTE MINIAPP — Bildirim Sistemi SQL
-- Supabase SQL Editor'de çalıştır
-- ================================================================

-- Kullanıcıların Telegram ID'lerini kaydetmek için tablo
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

-- Bildirim logları (kaç kez gönderildi takibi)
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id BIGINT NOT NULL,
  notification_type TEXT NOT NULL DEFAULT 'daily_spin',
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  success BOOLEAN DEFAULT true
);

ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Servis erişebilir" ON notification_logs FOR ALL USING (true);

SELECT 'Bildirim tabloları oluşturuldu! ✅' as status;
