# TASTE Mini App — TastePay Module (PRD)

## Original Problem Statement
Telegram Mini App üzerinde TASTE (TON jetton) ile QR kod üzerinden fiziksel
mağazalarda ödeme sistemi. Müşteri herhangi bir TON cüzdanındaki TASTE'ini
kullanarak ödeme yapar, kasiyer yerel fiat para birimi cinsinden (TL, USD,
EUR, RUB, ...) ödeme tutarını görür. Tüm TASTE ödemeleri OTC admin cüzdanında
merkezi olarak toplanır, off-chain settlement ile merchant'lara aktarılacak.

## Tech Stack (existing, not changed)
- Vite + React 19 + TypeScript
- Deployed on Netlify (netlify/functions for bot + chat)
- Supabase (community posts, jobs, OTC orders, TastePay invoices)
- TON blockchain: @ton/ton, @tonconnect/ui-react, @dedust/sdk
- i18n (TR/EN/... multi-language)

## Core Requirements (static)
1. QR-based TASTE → local fiat payment at physical merchants
2. Multi-currency support (TRY, USD, EUR, RUB, ...)
3. Real-time TASTE/USD price oracle (GeckoTerminal via STON.fi pool)
4. Real-time USD→FIAT forex (ExchangeRate-API)
5. Centralized OTC admin wallet for settlement
6. Invoice tracking for merchant visibility
7. Legal framing: TASTE is a **digital loyalty point**, not fiat/payment
   service (TR regulatory compliance)

## Architecture
```
┌─ Merchant (TASTE Pay → Ödeme Al)
│   ↓ generates QR: tastepay://pay?amount=250&currency=TRY&...
│   ↓ Supabase: tastepay_invoices (status='pending')
│
├─ Customer (scans QR via TASTE Pay → QR ile Öde)
│   ↓ TON Connect (Tonkeeper / any TON wallet with TASTE)
│   ↓ Jetton transfer op 0xf8a7ea5 with memo forward_payload
│
├─ TON Blockchain
│   ↓ TASTE arrives at OTC admin wallet
│   ↓ on-chain memo = "TastePay INV-XXX"
│
└─ Supabase: tastepay_invoices (status='paid', payer_wallet, paid_at)
    ↓ Merchant dashboard reads status in real-time
```

## What's Implemented (2026-04-30)
### TastePay payment flow
- [x] Multi-currency dropdown with 15 fiat currencies + flags
- [x] Live TASTE/USD price (GeckoTerminal pool) + badge in header
- [x] Live USD/FIAT rates (ExchangeRate-API) + 60s auto-refresh
- [x] QR code generation with tastepay:// URI scheme
- [x] Invoice ID per QR (`INV-<base36-time>-<rand>`)
- [x] QR scanning (Html5Qrcode on customer side)
- [x] Real TON Connect jetton transfer (replaces mock setTimeout)
- [x] Internal wallet fallback (if user imported seed phrase)
- [x] Balance + TON-gas preflight checks
- [x] Error states with retry button
- [x] Success state with Tonviewer link
- [x] Invoice persistence to Supabase (`tastepay_invoices` table)
- [x] Invoice "paid" marker on successful tx
- [x] `data-testid` attributes on all interactive elements

### Legal / Disclaimer
- [x] Reframed from "NOT a payment method" to "digital loyalty point"
- [x] TR & EN translations updated (DisclaimerModal.tsx, QuickBuy.tsx)
- [x] Disclaimer storage key bumped to v2 (users re-accept new text)

### Files Changed/Created
- `src/components/TastePay.tsx` (rewritten)
- `src/components/DisclaimerModal.tsx` (loyalty reframe)
- `src/components/QuickBuy.tsx` (copy aligned)
- `src/services/api.ts` (+ getMultiFiatRates)
- `src/services/supabase.ts` (+ tastepay_invoices CRUD)
- `supabase_tastepay_setup.sql` (new)
- `.env.example` (+ VITE_OTC_WALLET)

## P0 (MVP — DONE)
- [x] Real on-chain payment (not mock)
- [x] 15 fiat currencies
- [x] Live exchange rates
- [x] Invoice logging

## P1 (Next phase — remaining)
- [ ] Merchant dashboard: list of invoices with pending/paid status
      (uses `getTastePayInvoices(merchant_wallet)` helper already)
- [ ] On-chain confirmation poller: watch OTC wallet for matching memo
      and auto-flip invoice to paid (current flow marks client-side only)
- [ ] Telegram push to merchant when payment lands
- [ ] Cron job to expire pending invoices > 15min

## P2 (Future)
- [ ] Fiat off-ramp (Mercuryo / Transak / BTCTurk)
- [ ] Auto swap TASTE → USDT via DeDust SDK
- [ ] Merchant KYC flow
- [ ] Receipt PDF / print
- [ ] Multi-merchant support (QR includes merchant ID, not just OTC)

## Deployment Notes
- **Repo**: https://github.com/NIONTOKEN/taste-miniapp
- **Deploy target**: Netlify (auto-deploys on push to main)
- **Supabase setup**: Run `supabase_tastepay_setup.sql` in SQL Editor
  before using TastePay in production
- **Env vars needed on Netlify**:
  - `VITE_OTC_WALLET=UQB-Q4l7vp-RiXhSfziofwYpZ-Gv5Gs4xI9ZL3_tghEtjFpr`
  - `VITE_JETTON_ADDRESS=EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-`
  - `VITE_POOL_ADDRESS=EQCGEHrBuuoKVJ_0LqQy38F-c-pN-Jrz0M_ASdCtJxZL74nS`
  - `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`

## Testing Status
- TypeScript compile: clean (0 errors)
- Vite build: successful (13.9s)
- Playwright UI test: ✅ QR generates correctly for 2500 RUB → 68264 TASTE
- Real on-chain payment: not tested (requires live wallet with TASTE);
  code follows same pattern as existing WalletTransfer.tsx which is in
  production use
