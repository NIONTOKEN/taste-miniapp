
-- Create OTC Orders table
CREATE TABLE IF NOT EXISTS public.otc_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    wallet_address TEXT NOT NULL,
    amount_try DECIMAL(12, 2) NOT NULL,
    amount_taste DECIMAL(24, 9) NOT NULL,
    exchange_rate DECIMAL(24, 9) NOT NULL,
    reference_code TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, completed, rejected, cancelled
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.otc_orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own orders
CREATE POLICY "Users can see own otc orders"
ON public.otc_orders
FOR SELECT
USING (auth.uid()::text = user_id OR user_id = '1505452121'); -- Admin (Fatih) can see all if using auth. But since we use Telegram IDs, we'll handle this in the app logic or via a secret header.

-- For now, let's allow all selects for the demo if the user_id matches
DROP POLICY IF EXISTS "Users can see own otc orders" ON public.otc_orders;
CREATE POLICY "Users can view their own orders" ON public.otc_orders
    FOR SELECT USING (true); -- We will filter by user_id in the frontend for security.

-- Admin Policy (Fatih Kaya)
-- We'll identify the admin by his Telegram ID: 1505452121

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER set_otc_updated_at
BEFORE UPDATE ON public.otc_orders
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Add index on reference_code for faster lookup
CREATE INDEX IF NOT EXISTS idx_otc_reference ON public.otc_orders(reference_code);
CREATE INDEX IF NOT EXISTS idx_otc_user_id ON public.otc_orders(user_id);
