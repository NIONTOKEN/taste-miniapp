-- ═══════════════════════════════════════════════════════════════════════════
-- TastePay Invoices Table — QR ödeme sistemi için
-- ═══════════════════════════════════════════════════════════════════════════
-- Bu tablo her QR invoice'u kaydeder. Merchant QR oluşturduğunda "pending"
-- statüsünde kayıt düşer, müşteri ödeme yapıp blockchain onaylandığında
-- "paid" olur. Merchant panelinde gerçek-zamanlı görüntülenir.
-- ═══════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS tastepay_invoices (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_code     TEXT UNIQUE NOT NULL,                -- INV-XXX-YYY
    merchant_wallet  TEXT NOT NULL,                       -- Ödemeyi alacak OTC/merchant cüzdan
    merchant_name    TEXT,                                -- Dükkan / kasiyer adı (opsiyonel)
    fiat_amount      NUMERIC(18, 4) NOT NULL,
    fiat_currency    TEXT NOT NULL,                       -- TRY, USD, EUR, RUB, ...
    taste_amount     NUMERIC(18, 4) NOT NULL,
    exchange_rate    NUMERIC(18, 8) NOT NULL,             -- 1 TASTE = X fiat at invoice time
    status           TEXT NOT NULL DEFAULT 'pending'
                     CHECK (status IN ('pending','paid','expired','cancelled')),
    payer_wallet     TEXT,                                -- Ödemeyi yapan cüzdan adresi
    payer_telegram   TEXT,                                -- Telegram kullanıcı adı (opsiyonel)
    tx_hash          TEXT,                                -- Blockchain işlem hash
    memo             TEXT,                                -- Invoice memo (forward_payload)
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    paid_at          TIMESTAMPTZ,
    expires_at       TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '15 minutes')
);

CREATE INDEX IF NOT EXISTS idx_tastepay_invoice_code    ON tastepay_invoices(invoice_code);
CREATE INDEX IF NOT EXISTS idx_tastepay_merchant_wallet ON tastepay_invoices(merchant_wallet);
CREATE INDEX IF NOT EXISTS idx_tastepay_status          ON tastepay_invoices(status);
CREATE INDEX IF NOT EXISTS idx_tastepay_created_at      ON tastepay_invoices(created_at DESC);

-- Row Level Security — sadece authenticated/anon herkes insert edebilir, okuyabilir
ALTER TABLE tastepay_invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tastepay_select_all"   ON tastepay_invoices;
DROP POLICY IF EXISTS "tastepay_insert_all"   ON tastepay_invoices;
DROP POLICY IF EXISTS "tastepay_update_all"   ON tastepay_invoices;

CREATE POLICY "tastepay_select_all"  ON tastepay_invoices FOR SELECT USING (true);
CREATE POLICY "tastepay_insert_all"  ON tastepay_invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "tastepay_update_all"  ON tastepay_invoices FOR UPDATE USING (true) WITH CHECK (true);

-- Auto-expire pending invoices > 15 dakika
-- (Uygulama tarafında da kontrol ediliyor, bu sadece güvenlik katmanı)
-- İsteğe bağlı cron job:
-- SELECT cron.schedule('expire-tastepay', '*/5 * * * *',
--   $$ UPDATE tastepay_invoices SET status='expired' WHERE status='pending' AND expires_at < NOW() $$);
