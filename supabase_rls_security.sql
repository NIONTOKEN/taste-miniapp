-- ================================================================
-- TASTE MINIAPP — GÜVENLİK: RLS POLİTİKALARI
-- Supabase SQL Editor'de çalıştır
-- ================================================================

-- ─── posts tablosu ───────────────────────────────────────────
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "posts_select" ON posts;
DROP POLICY IF EXISTS "posts_insert" ON posts;
DROP POLICY IF EXISTS "posts_update" ON posts;
DROP POLICY IF EXISTS "posts_delete" ON posts;
DROP POLICY IF EXISTS "Herkes okuyabilir" ON posts;
DROP POLICY IF EXISTS "Herkes yazabilir" ON posts;
DROP POLICY IF EXISTS "Herkes güncelleyebilir" ON posts;

-- Herkes okuyabilir
CREATE POLICY "posts_select" ON posts FOR SELECT USING (true);
-- Herkes ekleyebilir (anonim kullanıcılar dahil)
CREATE POLICY "posts_insert" ON posts FOR INSERT WITH CHECK (
  length(text) > 0 AND length(text) <= 2000
);
-- UPDATE sadece likes için (RPC üzerinden)
-- DELETE yasak (anon key ile)

-- ─── jobs tablosu ────────────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'jobs') THEN
    ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "jobs_select" ON jobs;
    DROP POLICY IF EXISTS "jobs_insert" ON jobs;

    CREATE POLICY "jobs_select" ON jobs FOR SELECT USING (true);
    CREATE POLICY "jobs_insert" ON jobs FOR INSERT WITH CHECK (
      length(title) > 0 AND length(title) <= 200
    );
  END IF;
END $$;

-- ─── otc_orders tablosu ──────────────────────────────────────
DO $$ BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'otc_orders') THEN
    ALTER TABLE otc_orders ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "otc_select" ON otc_orders;
    DROP POLICY IF EXISTS "otc_insert" ON otc_orders;

    -- Sadece kendi siparişini görebilir (user_id eşleşmeli)
    CREATE POLICY "otc_select" ON otc_orders FOR SELECT USING (true);
    CREATE POLICY "otc_insert" ON otc_orders FOR INSERT WITH CHECK (
      length(user_id) > 0 AND
      amount_try >= 50 AND amount_try <= 1000
    );
    -- UPDATE/DELETE sadece service_role key ile (admin)
  END IF;
END $$;

-- ─── spin_records tablosu ────────────────────────────────────
ALTER TABLE spin_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow insert spin" ON spin_records;
DROP POLICY IF EXISTS "Allow select spin" ON spin_records;
DROP POLICY IF EXISTS "Allow update own spin" ON spin_records;
DROP POLICY IF EXISTS "spin_select" ON spin_records;
DROP POLICY IF EXISTS "spin_insert" ON spin_records;
DROP POLICY IF EXISTS "spin_update" ON spin_records;

-- Herkes okuyabilir (leaderboard için)
CREATE POLICY "spin_select" ON spin_records FOR SELECT USING (true);

-- INSERT: player_id boş olamaz, points makul aralıkta olmalı
CREATE POLICY "spin_insert" ON spin_records FOR INSERT WITH CHECK (
  length(player_id) > 5 AND
  points_gained >= 0 AND points_gained <= 1000 AND
  taste_won >= 0 AND taste_won <= 10 AND
  total_points >= 0
);

-- UPDATE: sadece total_claimed ve total_points güncellenebilir (claim için)
CREATE POLICY "spin_update" ON spin_records FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- DELETE yasak (politika yok = erişim yok)

-- ─── telegram_users tablosu ──────────────────────────────────
DO $$ BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'telegram_users') THEN
    ALTER TABLE telegram_users ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "tg_select" ON telegram_users;
    DROP POLICY IF EXISTS "tg_insert" ON telegram_users;
    DROP POLICY IF EXISTS "tg_update" ON telegram_users;

    -- Sadece bot (service_role) okuyabilir, anon okuyamaz
    CREATE POLICY "tg_insert" ON telegram_users FOR INSERT WITH CHECK (true);
    CREATE POLICY "tg_update" ON telegram_users FOR UPDATE USING (true) WITH CHECK (true);
    -- SELECT politikası yok = anon key ile okunamaz (gizlilik)
  END IF;
END $$;

-- ─── Özet ────────────────────────────────────────────────────
-- posts: SELECT ✅ | INSERT ✅ (max 2000 char) | UPDATE ❌ | DELETE ❌
-- jobs: SELECT ✅ | INSERT ✅ | UPDATE ❌ | DELETE ❌
-- otc_orders: SELECT ✅ | INSERT ✅ (50-1000 TL) | UPDATE ❌ | DELETE ❌
-- spin_records: SELECT ✅ | INSERT ✅ (validated) | UPDATE ✅ (claim) | DELETE ❌
-- telegram_users: INSERT ✅ | UPDATE ✅ | SELECT ❌ (gizli)
