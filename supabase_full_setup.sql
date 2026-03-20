-- ================================================================
-- TASTE MINIAPP — TAM SUPABASE KURULUM SQL
-- Supabase SQL Editor'de çalıştır:
-- Sol menü → SQL Editor → New Query → Yapıştır → Run
-- ================================================================

-- ─── Posts tablosunu güncelle / oluştur ───────────────────────
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'yemek',
  author_name TEXT NOT NULL DEFAULT 'Misafir',
  author_emoji TEXT NOT NULL DEFAULT '🍳',
  author_username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  text TEXT NOT NULL,
  photo TEXT,
  tags TEXT[] DEFAULT '{}',
  recipe_title TEXT,
  ingredients JSONB,
  steps TEXT[],
  venue_name TEXT,
  city TEXT,
  allergens TEXT[] DEFAULT '{}',
  likes INTEGER DEFAULT 0,
  calories TEXT,
  reward_wallet TEXT
);

-- Type kısıtlamasını güncelle (career ve chat ekle)
ALTER TABLE posts DROP CONSTRAINT IF EXISTS posts_type_check;
ALTER TABLE posts ADD CONSTRAINT posts_type_check 
  CHECK (type IN ('yemek', 'tarif', 'menu', 'career', 'chat'));

-- Eksik kolonları ekle (zaten varsa hata vermez)
ALTER TABLE posts ADD COLUMN IF NOT EXISTS author_username TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS allergens TEXT[] DEFAULT '{}';
ALTER TABLE posts ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS calories TEXT;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS reward_wallet TEXT;

-- ─── Row Level Security ───────────────────────────────────────
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Herkes okuyabilir" ON posts;
DROP POLICY IF EXISTS "Herkes yazabilir" ON posts;
DROP POLICY IF EXISTS "Herkes güncelleyebilir" ON posts;

CREATE POLICY "Herkes okuyabilir" ON posts FOR SELECT USING (true);
CREATE POLICY "Herkes yazabilir" ON posts FOR INSERT WITH CHECK (true);

-- Sadece "likes" değerini güvenli şekilde artırmak için bir RPC eklendi:
CREATE OR REPLACE FUNCTION increment_post_likes(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET likes = COALESCE(likes, 0) + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ─── Jobs tablosu (TasteJob Sistemi için) ──────────────────────
CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  city TEXT NOT NULL,
  salary TEXT,
  employer_id TEXT,
  employer_name TEXT NOT NULL DEFAULT 'İşveren',
  employer_emoji TEXT DEFAULT '🏢',
  employer_username TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  applications_count INTEGER DEFAULT 0,
  job_type TEXT DEFAULT 'listing' CHECK (job_type IN ('listing', 'seeking', 'today'))
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Herkes işleri okuyabilir" ON jobs;
DROP POLICY IF EXISTS "Herkes iş ekleyebilir" ON jobs;
DROP POLICY IF EXISTS "Herkes iş güncelleyebilir" ON jobs;

CREATE POLICY "Herkes işleri okuyabilir" ON jobs FOR SELECT USING (true);
CREATE POLICY "Herkes iş ekleyebilir" ON jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Herkes iş güncelleyebilir" ON jobs FOR UPDATE USING (true);

-- ─── Applications tablosu (İş Başvuruları için) ──────────────
CREATE TABLE IF NOT EXISTS applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL,
  user_emoji TEXT DEFAULT '👨‍🍳',
  user_username TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Herkes başvuru okuyabilir" ON applications;
DROP POLICY IF EXISTS "Herkes başvuru yapabilir" ON applications;
CREATE POLICY "Herkes başvuru okuyabilir" ON applications FOR SELECT USING (true);
CREATE POLICY "Herkes başvuru yapabilir" ON applications FOR INSERT WITH CHECK (true);

-- ─── Reviews tablosu (İşletme Değerlendirme) ─────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  business_name TEXT NOT NULL,
  city TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  salary_score INTEGER CHECK (salary_score BETWEEN 1 AND 5),
  environment_score INTEGER CHECK (environment_score BETWEEN 1 AND 5),
  management_score INTEGER CHECK (management_score BETWEEN 1 AND 5),
  comment TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_emoji TEXT DEFAULT '⭐',
  user_username TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Herkes yorumları okuyabilir" ON reviews;
DROP POLICY IF EXISTS "Herkes yorum yapabilir" ON reviews;
CREATE POLICY "Herkes yorumları okuyabilir" ON reviews FOR SELECT USING (true);
CREATE POLICY "Herkes yorum yapabilir" ON reviews FOR INSERT WITH CHECK (true);

-- ─── Profiles tablosu (CV Sistemi) ───────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_name TEXT NOT NULL UNIQUE,
  user_emoji TEXT DEFAULT '👨‍🍳',
  user_username TEXT,
  profession TEXT NOT NULL,
  experience TEXT,
  skills TEXT[] DEFAULT '{}',
  bio TEXT,
  city TEXT,
  photo_url TEXT,
  stars INTEGER DEFAULT 1 CHECK (stars BETWEEN 1 AND 5),
  taste_points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Herkes profilleri okuyabilir" ON profiles;
DROP POLICY IF EXISTS "Herkes profil ekleyebilir" ON profiles;
DROP POLICY IF EXISTS "Herkes profil güncelleyebilir" ON profiles;

CREATE POLICY "Herkes profilleri okuyabilir" ON profiles FOR SELECT USING (true);
CREATE POLICY "Herkes profil ekleyebilir" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Herkes profil güncelleyebilir" ON profiles FOR UPDATE USING (true);

-- Profil ve iş tablolarına eksik olabilecek kolonları ekle (hata vermez)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS employer_username TEXT;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS applications_count INTEGER DEFAULT 0;

-- Bitti! Tablo başarıyla oluşturuldu.
SELECT 'TASTE DB Setup Tamamlandı! ✅' as status;
