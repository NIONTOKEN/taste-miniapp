-- ================================================================
-- TASTE MINIAPP — OTC Siparişler Tablosu
-- Supabase > SQL Editor > Yeni Sorgu > Yapıştır > Run
-- ================================================================

-- Tabloyu oluştur
CREATE TABLE IF NOT EXISTS public.otc_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  wallet_address TEXT NOT NULL,
  amount_try DECIMAL(12, 2) NOT NULL,
  amount_taste DECIMAL(24, 9) NOT NULL,
  exchange_rate DECIMAL(24, 9) NOT NULL,
  reference_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'paid', 'completed', 'rejected', 'cancelled')),
  receipt_url TEXT,
  admin_notes TEXT,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Güvenlik
ALTER TABLE public.otc_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Herkes okuyabilir" ON public.otc_orders;
DROP POLICY IF EXISTS "Herkes yazabilir" ON public.otc_orders;
DROP POLICY IF EXISTS "Herkes güncelleyebilir" ON public.otc_orders;

CREATE POLICY "Herkes okuyabilir"       ON public.otc_orders FOR SELECT USING (true);
CREATE POLICY "Herkes yazabilir"        ON public.otc_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Herkes güncelleyebilir"  ON public.otc_orders FOR UPDATE USING (true);

-- Otomatik updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_otc_updated_at ON public.otc_orders;
CREATE TRIGGER set_otc_updated_at
  BEFORE UPDATE ON public.otc_orders
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- İndeksler
CREATE INDEX IF NOT EXISTS idx_otc_reference ON public.otc_orders(reference_code);
CREATE INDEX IF NOT EXISTS idx_otc_user_id   ON public.otc_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_otc_status    ON public.otc_orders(status);

-- Kontrol
SELECT 'otc_orders tablosu hazır ✅' AS durum;
