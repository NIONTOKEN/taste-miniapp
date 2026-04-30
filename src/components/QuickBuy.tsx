import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useWallet } from '../context/WalletContext'
import { insertOTCOrder } from '../services/supabase'
import { apiService } from '../services/api'

const ADMIN_IBAN    = 'TR92 0010 3000 0000 0083 5790 12'
const ADMIN_NAME    = 'Fatih Kaya'
const ADMIN_BANK    = 'Fibabanka'
const ADMIN_TG_ID   = '1505452121'
const WHATSAPP_LINK = 'https://chat.whatsapp.com/Hiz3REK1XiC9fD60Y2qbWP'

type Step = 'input' | 'instructions' | 'success'

interface QuickBuyProps { userId: string }

export const QuickBuy: React.FC<QuickBuyProps> = ({ userId }) => {
    const { i18n } = useTranslation()
    const isTR = i18n.language?.startsWith('tr')

    // ✅ User-friendly address (EQ/UQ format)
    const { activeAddress: walletAddress } = useWallet()

    const [amountTry, setAmountTry]   = useState<number>(200)
    const [tastePriceUsd, setTastePrice] = useState(0.00135)
    const [usdToTry, setUsdToTry]     = useState(43.87)
    const [step, setStep]             = useState<Step>('input')
    const [refCode, setRefCode]       = useState('')
    const [isCreating, setIsCreating] = useState(false)

    React.useEffect(() => {
        apiService.getTastePrice().then(p => setTastePrice(p.price)).catch(() => {})
        apiService.getExchangeRate().then(r => setUsdToTry(r.rate)).catch(() => {})
    }, [])

    const tastePriceTry   = tastePriceUsd * usdToTry
    const estimatedTaste  = amountTry / tastePriceTry
    const quickAmounts    = [50, 100, 200, 500, 1000]

    const generateCode = () => {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
        const rand = Array.from({length: 5}, () => chars[Math.floor(Math.random() * chars.length)]).join('')
        return `T${userId.slice(-3)}-${rand}`
    }

    const openWhatsApp = () => {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.openLink(WHATSAPP_LINK)
        } else {
            window.open(WHATSAPP_LINK, '_blank')
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard?.writeText(text).catch(() => {
            const el = document.createElement('textarea')
            el.value = text
            document.body.appendChild(el)
            el.select()
            document.execCommand('copy')
            document.body.removeChild(el)
        })
    }

    const handleCreateOrder = async () => {
        if (!walletAddress) {
            alert(isTR ? '⚠️ Önce cüzdanını bağla!' : '⚠️ Connect your wallet first!')
            return
        }
        // Strict numeric validation — string injection önleme
        const numericAmount = Number(amountTry)
        if (!Number.isFinite(numericAmount) || numericAmount < 50 || numericAmount > 1000) {
            alert(isTR ? 'Min: 50 ₺ — Max: 1.000 ₺' : 'Min: ₺50 — Max: ₺1,000')
            return
        }
        // Wallet address format kontrolü
        if (!/^[A-Za-z0-9_-]{10,}$/.test(walletAddress)) {
            alert(isTR ? '⚠️ Geçersiz cüzdan adresi.' : '⚠️ Invalid wallet address.')
            return
        }

        setIsCreating(true)
        const code = generateCode()
        setRefCode(code)

        try {
            const result = await insertOTCOrder({
                user_id: userId,
                wallet_address: walletAddress,  // ✅ EQ/UQ format
                amount_try: amountTry,
                amount_taste: estimatedTaste,
                exchange_rate: tastePriceTry,
                reference_code: code,
                status: 'pending'
            })
            if (!result) throw new Error('DB error')

            // Notify admin via Telegram
            fetch('/.netlify/functions/bot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'otc_order',
                    admin_id: ADMIN_TG_ID,
                    order: {
                        userId,
                        wallet: walletAddress,
                        amount: amountTry,
                        taste: Math.round(estimatedTaste).toLocaleString(),
                        code
                    }
                })
            }).catch(() => {})

            setStep('instructions')
        } catch {
            alert(isTR ? 'Bir hata oluştu, lütfen tekrar dene.' : 'An error occurred, please try again.')
        } finally {
            setIsCreating(false)
        }
    }

    /* ─── RENDER ─── */
    return (
        <div style={{ padding: '4px' }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    background: 'rgba(245,159,11,0.12)', border: '1px solid rgba(245,159,11,0.3)',
                    borderRadius: '50px', padding: '5px 14px', marginBottom: '12px', fontSize: '11px',
                    fontWeight: 800, color: '#f59e0b', letterSpacing: '1px', textTransform: 'uppercase'
                }}>
                    🇹🇷 {isTR ? 'Yalnızca Türkiye · TR Only' : 'Turkey Only'}
                </div>
                <h2 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: 900 }}>
                    ⚡ {isTR ? 'Hızlı TASTE Al' : 'Quick Buy TASTE'}
                </h2>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                    {isTR ? 'Hızlı ve güvenli TASTE satın al' : 'Buy TASTE fast and securely'}
                </p>
            </div>

            {/* TR Only info */}
            <div style={{
                background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: '14px', padding: '12px 14px', marginBottom: '20px',
                display: 'flex', gap: '10px', alignItems: 'flex-start'
            }}>
                <span style={{ fontSize: '16px', flexShrink: 0 }}>ℹ️</span>
                <p style={{ fontSize: '11px', color: '#93c5fd', margin: 0, lineHeight: 1.6 }}>
                    {isTR
                        ? 'Bu sistem Türkiye\'deki kullanıcılar içindir. Yurt dışındaysanız STON.fi üzerinden TON ile swap yapabilirsiniz.'
                        : 'This is for Turkish users only. If you\'re abroad, swap on STON.fi using TON.'}
                </p>
            </div>

            <AnimatePresence mode="wait">

                {/* ══════════ STEP 1: Input ══════════ */}
                {step === 'input' && (
                    <motion.div key="input" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>

                        {!walletAddress && (
                            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '14px', padding: '12px', marginBottom: '16px', textAlign: 'center', fontSize: '12px', color: '#fca5a5' }}>
                                ⚠️ {isTR ? 'Devam etmek için TON cüzdanını bağla' : 'Connect your TON wallet to continue'}
                            </div>
                        )}

                        {/* Amount input */}
                        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px', padding: '20px', marginBottom: '14px' }}>
                            <label style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '10px' }}>
                                {isTR ? 'Göndereceğin Tutar' : 'Amount to Send'}
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="number" value={amountTry}
                                    onChange={e => setAmountTry(Math.min(1000, Math.max(0, Number(e.target.value))))}
                                    style={{
                                        flex: 1, background: 'rgba(0,0,0,0.35)', border: '2px solid rgba(245,159,11,0.4)',
                                        borderRadius: '14px', padding: '14px 16px', fontSize: '28px', fontWeight: 900,
                                        color: '#fff', outline: 'none'
                                    }}
                                    min={50} max={1000}
                                />
                                <span style={{ fontSize: '24px', fontWeight: 900, color: '#f59e0b' }}>₺</span>
                            </div>
                            <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                                {quickAmounts.map(v => (
                                    <button key={v} onClick={() => setAmountTry(v)} style={{
                                        padding: '7px 14px', borderRadius: '10px', fontSize: '12px', fontWeight: 800,
                                        cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                                        background: amountTry === v ? '#f59e0b' : 'rgba(255,255,255,0.07)',
                                        color: amountTry === v ? '#000' : '#94a3b8'
                                    }}>{v.toLocaleString()}₺</button>
                                ))}
                                <span style={{ fontSize: '9px', color: 'var(--text-muted)', alignSelf: 'center' }}>Min:50 · Max:1.000</span>
                            </div>
                        </div>

                        {/* Estimate box */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(245,159,11,0.1), rgba(0,0,0,0.2))',
                            border: '1px solid rgba(245,159,11,0.25)', borderRadius: '18px', padding: '18px', marginBottom: '20px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                    {isTR ? 'Tahmini Alacağın' : 'You Will Receive ~'}
                                </span>
                                <span style={{ fontSize: '22px', fontWeight: 900, color: '#fbbf24' }}>
                                    {Math.round(estimatedTaste).toLocaleString()} <span style={{ fontSize: '13px' }}>TASTE</span>
                                </span>
                            </div>
                            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '8px 0' }} />
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                                <span>{isTR ? 'Güncel Kur' : 'Rate'}: 1 TASTE = {tastePriceTry.toFixed(4)}₺</span>
                                <span style={{ fontFamily: 'monospace', fontSize: '10px' }}>
                                    {walletAddress ? `${walletAddress.slice(0,8)}…${walletAddress.slice(-6)}` : '—'}
                                </span>
                            </div>
                        </div>

                        {/* How it works */}
                        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '14px', marginBottom: '20px' }}>
                            <p style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                {isTR ? '📋 Nasıl Çalışır?' : '📋 How It Works'}
                            </p>
                            {(isTR ? [
                                '1️⃣ Tutarı gir ve siparişi oluştur',
                                '2️⃣ Ödemeyi referans kodunu açıklamaya yazarak yap',
                                '3️⃣ WhatsApp grubuna dekont ekran görüntüsünü at',
                                '4️⃣ Onaydan sonra TASTE cüzdanına yatar (1-12 saat)',
                            ] : [
                                '1️⃣ Enter amount and create order',
                                '2️⃣ Send payment with the reference code in description',
                                '3️⃣ Send receipt screenshot to our WhatsApp group',
                                '4️⃣ After approval, TASTE lands in your wallet (1-12h)',
                            ]).map((txt, i) => (
                                <div key={i} style={{ fontSize: '11px', color: 'var(--text-muted)', padding: '3px 0', lineHeight: 1.7 }}>{txt}</div>
                            ))}
                        </div>

                        {/* Legal & Safety Disclaimer */}
                        <div style={{ background: 'rgba(220,20,60,0.06)', border: '1px solid rgba(220,20,60,0.2)', borderRadius: '14px', padding: '14px', marginBottom: '20px' }}>
                            <p style={{ fontSize: '10px', fontWeight: 800, color: '#f87171', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                ⚖️ {isTR ? 'Yasal Uyarı ve Güvenlik' : 'Legal & Security Warning'}
                            </p>
                            <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '0 0 6px', lineHeight: 1.5 }}>
                                {isTR 
                                    ? 'TASTE bir ödeme aracı veya finansal enstrüman değildir; sadece bir dijital sadakat varlığıdır.' 
                                    : 'TASTE is not a financial instrument or payment tool; it is a digital loyalty asset.'}
                            </p>
                            <p style={{ fontSize: '10px', color: 'var(--text-muted)', margin: '0', lineHeight: 1.5 }}>
                                {isTR 
                                    ? 'Devam ederek 18 yaşından büyük olduğunuzu ve bu işlemin iadesi olmadığını kendi iradenizle kabul etmiş olursunuz. Ekip hiçbir finansal kayıptan sorumlu tutulamaz.' 
                                    : 'By proceeding, you confirm you are 18+ and accept that there are no refunds. The team assumes no liability for any financial outcome.'}
                            </p>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={handleCreateOrder}
                            disabled={isCreating || !walletAddress}
                            style={{
                                width: '100%', padding: '18px', fontSize: '16px', fontWeight: 900, border: 'none',
                                background: (!walletAddress || isCreating) ? '#374151' : 'linear-gradient(135deg, #f59e0b, #d97706)',
                                color: (!walletAddress || isCreating) ? '#9ca3af' : '#000',
                                borderRadius: '16px', cursor: (!walletAddress || isCreating) ? 'not-allowed' : 'pointer',
                                boxShadow: walletAddress ? '0 6px 25px rgba(245,159,11,0.4)' : 'none'
                            }}
                        >
                            {isCreating
                                ? (isTR ? '⏳ Oluşturuluyor...' : '⏳ Creating...')
                                : (isTR ? '🚀 Sipariş Oluştur' : '🚀 Create Order')}
                        </motion.button>
                    </motion.div>
                )}

                {/* ══════════ STEP 2: Instructions ══════════ */}
                {step === 'instructions' && (
                    <motion.div key="instructions" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

                        {/* Order created badge */}
                        <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '16px' }}>
                            <div style={{ fontSize: '26px', marginBottom: '4px' }}>✅</div>
                            <p style={{ fontSize: '14px', fontWeight: 800, color: '#22c55e', margin: '0 0 4px' }}>
                                {isTR ? 'Sipariş oluşturuldu!' : 'Order created!'}
                            </p>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                                {isTR ? 'Şimdi aşağıdaki bilgilere ödeme yap' : 'Now send your payment using the details below'}
                            </p>
                        </div>

                        {/* IMPORTANT warning */}
                        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '12px', padding: '12px' }}>
                            <p style={{ fontSize: '11px', color: '#fca5a5', lineHeight: 1.7, margin: 0 }}>
                                🚫 <b>{isTR ? 'ÖNEMLİ:' : 'IMPORTANT:'}</b>{' '}
                                {isTR
                                    ? '"Kripto, token, TASTE, coin" yazmayın. Açıklamaya SADECE referans kodunu yazın!'
                                    : 'Do NOT write "crypto, token, TASTE". Only write the reference code in the description!'}
                            </p>
                        </div>

                        {/* Bank Details */}
                        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', overflow: 'hidden' }}>
                            <div style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                💳 {isTR ? 'Ödeme Bilgileri' : 'Payment Details'}
                            </div>

                            {/* IBAN — copyable */}
                            {[
                                { label: 'IBAN', value: ADMIN_IBAN, mono: true },
                                { label: isTR ? 'Alıcı' : 'Recipient', value: ADMIN_NAME },
                                { label: isTR ? 'Banka' : 'Bank', value: ADMIN_BANK },
                                { label: isTR ? 'Tutar' : 'Amount', value: `${amountTry.toLocaleString()} ₺`, green: true },
                            ].map(item => (
                                <div key={item.label}
                                    onClick={() => copyToClipboard((item as any).value)}
                                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.label}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{
                                            fontSize: (item as any).mono ? '11px' : '13px',
                                            fontFamily: (item as any).mono ? 'monospace' : 'inherit',
                                            fontWeight: 700,
                                            color: (item as any).green ? '#22c55e' : '#fff',
                                            userSelect: 'all'
                                        }}>{(item as any).value}</span>
                                        <span style={{ fontSize: '10px', color: '#6b7280' }}>📋</span>
                                    </div>
                                </div>
                            ))}

                            {/* Reference Code — biggest, most important */}
                            <div style={{ padding: '16px', background: 'rgba(245,159,11,0.08)', borderTop: '1px solid rgba(245,159,11,0.2)' }}
                                onClick={() => copyToClipboard(refCode)}>
                                <div style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '8px' }}>
                                    📝 {isTR ? 'Açıklamaya Yaz (Zorunlu!)' : 'Write in Description (Required!)'} · {isTR ? 'Tıkla kopyala' : 'Tap to copy'}
                                </div>
                                <div style={{ fontSize: '28px', fontFamily: 'monospace', fontWeight: 900, color: '#fbbf24', letterSpacing: '3px', userSelect: 'all' }}>
                                    {refCode}
                                </div>
                            </div>

                            {/* TASTE amount to send */}
                            <div style={{ padding: '14px 16px', background: 'rgba(129,140,248,0.06)', borderTop: '1px solid rgba(129,140,248,0.15)' }}
                                onClick={() => copyToClipboard(Math.round(estimatedTaste).toString())}>
                                <div style={{ fontSize: '10px', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '6px' }}>
                                    💎 {isTR ? 'Gönderilecek TASTE · Tıkla kopyala' : 'TASTE to Send · Tap to copy'}
                                </div>
                                <div style={{ fontSize: '22px', fontWeight: 900, color: '#a5b4fc' }}>
                                    {Math.round(estimatedTaste).toLocaleString()} <span style={{ fontSize: '14px', opacity: 0.7 }}>TASTE</span>
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp Proof */}
                        <div style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.25)', borderRadius: '16px', padding: '16px' }}>
                            <p style={{ fontSize: '12px', fontWeight: 800, color: '#4ade80', margin: '0 0 10px' }}>
                                📸 {isTR ? 'Dekont / Ekran Görüntüsü Gönder' : 'Send Receipt / Screenshot'}
                            </p>
                            <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 12px', lineHeight: 1.6 }}>
                                {isTR
                                    ? `Ödemenizi yaptıktan sonra dekont ekran görüntüsünü al ve referans kodunla (${refCode}) birlikte WhatsApp grubuna gönder.`
                                    : `After payment, take a screenshot of the receipt and send it with your code (${refCode}) to our WhatsApp group.`}
                            </p>
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={openWhatsApp}
                                style={{
                                    width: '100%', padding: '14px', fontSize: '14px', fontWeight: 900, border: 'none',
                                    background: 'linear-gradient(135deg, #25d366, #128c41)', color: '#fff',
                                    borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', gap: '8px',
                                    boxShadow: '0 4px 15px rgba(37,211,102,0.35)'
                                }}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                                </svg>
                                {isTR ? 'WhatsApp Grubuna Git' : 'Go to WhatsApp Group'}
                            </motion.button>
                        </div>

                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setStep('success')}
                            style={{
                                width: '100%', padding: '16px', fontSize: '15px', fontWeight: 900, border: 'none',
                                background: 'rgba(255,255,255,0.08)', color: '#fff',
                                borderRadius: '14px', cursor: 'pointer'
                            }}
                        >
                            {isTR ? '✅ Ödedim ve Dekontu Gönderdim →' : '✅ I Paid & Sent Receipt →'}
                        </motion.button>
                    </motion.div>
                )}

                {/* ══════════ STEP 3: Success ══════════ */}
                {step === 'success' && (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        style={{ textAlign: 'center', padding: '20px 10px' }}>
                        <motion.div
                            animate={{ scale: [1, 1.15, 1], rotate: [0, 8, -8, 0] }}
                            transition={{ duration: 0.7 }}
                            style={{ fontSize: '56px', marginBottom: '16px' }}>🎉
                        </motion.div>
                        <h3 style={{ fontSize: '22px', fontWeight: 900, margin: '0 0 8px' }}>
                            {isTR ? 'Sipariş Alındı!' : 'Order Received!'}
                        </h3>
                        <div style={{
                            background: 'rgba(245,159,11,0.1)', border: '1px solid rgba(245,159,11,0.3)',
                            borderRadius: '14px', padding: '16px', margin: '16px 0', cursor: 'pointer'
                        }} onClick={() => copyToClipboard(refCode)}>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                                {isTR ? 'Referans Kodun (tıkla kopyala)' : 'Your Reference Code (tap to copy)'}
                            </div>
                            <div style={{ fontSize: '24px', fontFamily: 'monospace', fontWeight: 900, color: '#f59e0b', letterSpacing: '2px' }}>
                                {refCode}
                            </div>
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '24px' }}>
                            {isTR
                                ? 'Ödemeniz ve dekontu aldıktan sonra admin inceleyecek. Onay sonrası TASTE\'ler cüzdanınıza yatar. Genellikle 1–12 saat içinde tamamlanır.'
                                : 'After reviewing your payment and receipt, TASTE will be sent to your wallet. Usually completes within 1–12 hours.'}
                        </p>
                        <button
                            onClick={() => setStep('input')}
                            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px 28px', borderRadius: '14px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                            {isTR ? '← Yeni Sipariş' : '← New Order'}
                        </button>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    )
}
