import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTonConnectUI } from '@tonconnect/ui-react'

// ─── Config ─────────────────────────────────────────────────────────
const CHARITY_WALLET = 'UQD1spM8Qis9Lu2lyOBKDZJU8PDGBCf5Lf3thWm3lNqY8kkb'

// ─── Kanıt Listesi (yeni eklenince buraya yazılır) ───────────────────
// { id, type: 'image'|'doc', title, date, src, desc }
const PROOFS: {
    id: number
    type: 'image' | 'doc'
    title: string
    date: string
    src: string
    desc: string
}[] = [
        // Buraya Fatih kanıt ekler, örnek:
        // { id: 1, type: 'image', title: 'Mama Dağıtımı', date: '08.03.2026', src: '/charity/proof1.jpg', desc: '50 sokak kedisine mama verildi.' },
    ]

// ─── Quick TON amounts ────────────────────────────────────────────────
const QUICK_AMOUNTS = [0.1, 0.5, 1, 5]

export function Charity() {
    const { i18n } = useTranslation()
    const [tonConnectUI] = useTonConnectUI()
    const isConnected = !!tonConnectUI.account?.address

    const [donateAmt, setDonateAmt] = useState('1')
    const [sending, setSending] = useState(false)
    const [txResult, setTxResult] = useState<'success' | 'error' | null>(null)
    const [copiedTON, setCopiedTON] = useState(false)
    const [copiedTST, setCopiedTST] = useState(false)
    const [selectedProof, setSelectedProof] = useState<(typeof PROOFS)[0] | null>(null)

    async function handleSendTON() {
        if (!isConnected) {
            tonConnectUI.openModal()
            return
        }
        const nanotons = Math.round(parseFloat(donateAmt) * 1e9)
        if (!nanotons || nanotons <= 0) return
        setSending(true)
        try {
            await tonConnectUI.sendTransaction({
                validUntil: Math.floor(Date.now() / 1000) + 120,
                messages: [{ address: CHARITY_WALLET, amount: String(nanotons) }]
            })
            setTxResult('success')
        } catch {
            setTxResult('error')
        }
        setSending(false)
        setTimeout(() => setTxResult(null), 5000)
    }

    function copyWallet(type: 'ton' | 'taste') {
        navigator.clipboard.writeText(CHARITY_WALLET)
        if (type === 'ton') { setCopiedTON(true); setTimeout(() => setCopiedTON(false), 2500) }
        else { setCopiedTST(true); setTimeout(() => setCopiedTST(false), 2500) }
    }

    return (
        <div style={{ paddingBottom: '10px' }}>

            {/* ── Hero ── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                    background: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(234,88,12,0.06))',
                    border: '1px solid rgba(249,115,22,0.2)',
                    borderRadius: '20px',
                    padding: '24px 20px',
                    textAlign: 'center',
                    marginBottom: '20px',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{
                    position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)',
                    width: 200, height: 200,
                    background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)',
                    pointerEvents: 'none'
                }} />

                <div style={{ fontSize: '52px', marginBottom: '10px' }}>🐾</div>
                <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#f97316', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
                    {i18n.language === 'tr' ? 'Hayvan Sevgisi' : 'Animal Love'}
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: '0 0 10px' }}>
                    {i18n.language === 'tr' ? 'Sokak Hayvanlarına Destek' : 'Support the Strays'}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 320, margin: '0 auto' }}>
                    {i18n.language === 'tr' ? 
                        <>Barınaksız sokak hayvanlarına mama, veteriner ve barınak desteği için <strong style={{ color: '#f97316' }}> TON</strong> veya <strong style={{ color: '#f59e0b' }}> TASTE</strong> bağışlayabilirsin. Her kuruş bir hayata dokunur. 🐶🐱</> 
                        : <>You can donate <strong style={{ color: '#f97316' }}> TON</strong> or <strong style={{ color: '#f59e0b' }}> TASTE</strong> to support street and shelter animals with food, vet care, and shelter. Every penny touches a life. 🐶🐱</>}
                </p>

                {/* Stats row */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '16px', flexWrap: 'wrap' }}>
                    {[
                        { emoji: '🐾', label: i18n.language === 'tr' ? 'Sokak Hayvanı' : 'Stray Animal', val: i18n.language === 'tr' ? 'Sınırsız' : 'Unlimited' },
                        { emoji: '❤️', label: i18n.language === 'tr' ? 'Bağış Kanalı' : 'Donation Channel', val: i18n.language === 'tr' ? '24/7 Açık' : '24/7 Open' },
                        { emoji: '✅', label: i18n.language === 'tr' ? 'Şeffaflık' : 'Transparency', val: 'On-Chain' },
                    ].map((s) => (
                        <div key={s.label} style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '18px' }}>{s.emoji}</div>
                            <div style={{ fontSize: '13px', fontWeight: 800, color: '#f97316' }}>{s.val}</div>
                            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{s.label}</div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ── Bağış Cüzdanı ── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '16px',
                    padding: '18px',
                    marginBottom: '16px'
                }}
            >
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                    🏦 {i18n.language === 'tr' ? 'Bağış Cüzdanı' : 'Donation Wallet'}
                </div>

                <div style={{
                    background: 'rgba(0,0,0,0.3)',
                    border: '1px solid rgba(249,115,22,0.2)',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    fontSize: '10px',
                    fontFamily: 'monospace',
                    color: '#f97316',
                    wordBreak: 'break-all',
                    marginBottom: '12px',
                    lineHeight: 1.7
                }}>
                    {CHARITY_WALLET}
                </div>

                {/* Copy buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => copyWallet('ton')}
                        style={{
                            background: copiedTON ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${copiedTON ? '#22c55e' : 'rgba(255,255,255,0.1)'}`,
                            color: copiedTON ? '#22c55e' : '#94a3b8',
                            borderRadius: '10px', padding: '9px',
                            fontSize: '12px', fontWeight: 600, cursor: 'pointer'
                        }}
                    >
                        {copiedTON ? (i18n.language === 'tr' ? '✅ Kopyalandı' : '✅ Copied') : (i18n.language === 'tr' ? '📋 Adresi Kopyala (TON)' : '📋 Copy Address (TON)')}
                    </motion.button>
                    <motion.button
                        whileTap={{ scale: 0.96 }}
                        onClick={() => copyWallet('taste')}
                        style={{
                            background: copiedTST ? 'rgba(245,158,11,0.1)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${copiedTST ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`,
                            color: copiedTST ? '#f59e0b' : '#94a3b8',
                            borderRadius: '10px', padding: '9px',
                            fontSize: '12px', fontWeight: 600, cursor: 'pointer'
                        }}
                    >
                        {copiedTST ? (i18n.language === 'tr' ? '✅ Kopyalandı' : '✅ Copied') : (i18n.language === 'tr' ? '📋 Adresi Kopyala (TASTE)' : '📋 Copy Address (TASTE)')}
                    </motion.button>
                </div>
            </motion.div>

            {/* ── TON Gönder ── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '16px',
                    padding: '18px',
                    marginBottom: '16px'
                }}
            >
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px' }}>
                    💎 {i18n.language === 'tr' ? 'TON ile Bağış Yap' : 'Donate in TON'}
                </div>

                {/* Quick amounts */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    {QUICK_AMOUNTS.map((amt) => (
                        <motion.button
                            key={amt}
                            whileTap={{ scale: 0.94 }}
                            onClick={() => setDonateAmt(String(amt))}
                            style={{
                                background: donateAmt === String(amt) ? 'rgba(0,136,204,0.2)' : 'rgba(255,255,255,0.04)',
                                border: `1px solid ${donateAmt === String(amt) ? 'rgba(0,136,204,0.5)' : 'rgba(255,255,255,0.08)'}`,
                                color: donateAmt === String(amt) ? '#0088cc' : '#94a3b8',
                                borderRadius: '8px', padding: '6px 14px',
                                fontSize: '12px', fontWeight: 700, cursor: 'pointer'
                            }}
                        >
                            {amt} TON
                        </motion.button>
                    ))}
                </div>

                {/* Custom amount */}
                <div style={{ position: 'relative', marginBottom: '12px' }}>
                    <input
                        type="number"
                        min="0.01"
                        step="0.1"
                        value={donateAmt}
                        onChange={(e) => setDonateAmt(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '10px',
                            padding: '11px 50px 11px 14px',
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#fff',
                            outline: 'none',
                            boxSizing: 'border-box'
                        }}
                        placeholder={i18n.language === 'tr' ? "Miktar (TON)" : "Amount (TON)"}
                    />
                    <span style={{
                        position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                        fontSize: '12px', color: '#0088cc', fontWeight: 700
                    }}>TON</span>
                </div>

                {/* Send button */}
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={handleSendTON}
                    disabled={sending}
                    style={{
                        width: '100%',
                        background: sending ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #0088cc, #006699)',
                        color: sending ? '#94a3b8' : '#fff',
                        border: 'none', borderRadius: '12px',
                        padding: '13px', fontSize: '14px', fontWeight: 800,
                        cursor: sending ? 'not-allowed' : 'pointer',
                        boxShadow: sending ? 'none' : '0 4px 16px rgba(0,136,204,0.3)'
                    }}
                >
                    {sending ? (i18n.language === 'tr' ? '⏳ Gönderiliyor...' : '⏳ Sending...') : isConnected ? `💎 ${donateAmt || '?'} ${i18n.language === 'tr' ? 'TON Bağışla' : 'TON Donate'}` : (i18n.language === 'tr' ? '🔌 Cüzdanı Bağla & Bağışla' : '🔌 Connect Wallet & Donate')}
                </motion.button>

                {/* Result */}
                <AnimatePresence>
                    {txResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            style={{
                                marginTop: '10px', padding: '10px', borderRadius: '10px', textAlign: 'center', fontSize: '13px', fontWeight: 700,
                                background: txResult === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                                color: txResult === 'success' ? '#22c55e' : '#ef4444',
                                border: `1px solid ${txResult === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`
                            }}
                        >
                            {txResult === 'success' ? (i18n.language === 'tr' ? '✅ Bağış gönderildi! Teşekkürler 🐾' : '✅ Donation sent! Thank you 🐾') : (i18n.language === 'tr' ? '❌ İşlem iptal edildi.' : '❌ Transaction cancelled.')}
                        </motion.div>
                    )}
                </AnimatePresence>

                <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '10px', textAlign: 'center', lineHeight: 1.6 }}>
                    💡 {i18n.language === 'tr' ? 'TASTE göndermek için adresi kopyalayıp cüzdanından manuel gönderebilirsin.' : 'To send TASTE, copy the address and send it manually from your wallet.'}
                </p>
            </motion.div>

            {/* ── TASTE Gönder Bilgisi ── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                    background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.03))',
                    border: '1px solid rgba(245,158,11,0.2)',
                    borderRadius: '14px',
                    padding: '14px 16px',
                    marginBottom: '20px',
                    display: 'flex', gap: '12px', alignItems: 'flex-start'
                }}
            >
                <div style={{ fontSize: '24px' }}>🍳</div>
                <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b', marginBottom: '4px' }}>
                        {i18n.language === 'tr' ? 'TASTE ile Bağış' : 'Donate in TASTE'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.6 }}>
                        {i18n.language === 'tr' ? 
                            <>Yukarıdaki cüzdan adresi aynı zamanda TASTE kabul eder.<br /> Tonkeeper, TonWallet veya STON.fi üzerinden istediğin miktarda TASTE gönderebilirsin.</> 
                            : <>The wallet address above also accepts TASTE.<br /> You can send any amount of TASTE using Tonkeeper, TonWallet, or STON.fi.</>}
                    </div>
                </div>
            </motion.div>

            {/* ── Kanıt Galerisi ── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div>
                        <div style={{ fontSize: '11px', letterSpacing: '1.5px', color: '#f97316', fontWeight: 700, textTransform: 'uppercase' }}>
                            {i18n.language === 'tr' ? 'Yapılan Yardımlar' : 'Given Aids'}
                        </div>
                        <h4 style={{ fontWeight: 800, margin: '2px 0 0', fontSize: '1rem' }}>📸 {i18n.language === 'tr' ? 'Kanıt & Belgeler' : 'Proofs & Documents'}</h4>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'right' }}>
                        {PROOFS.length} {i18n.language === 'tr' ? 'kayıt' : 'records'}
                    </div>
                </div>

                {PROOFS.length === 0 ? (
                    /* Empty state */
                    <div style={{
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px dashed rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        padding: '40px 20px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🐾</div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#94a3b8', marginBottom: '6px' }}>
                            {i18n.language === 'tr' ? 'Henüz kanıt eklenmedi' : 'No proofs added yet'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>
                            {i18n.language === 'tr' ? 
                                <>Yapılan yardımların fotoğraf ve belgeleri<br />burada yayınlanacak. Şeffaf kalıyoruz! ✅</> 
                                : <>Photos and documents of aids provided will be<br />published here. We remain transparent! ✅</>}
                        </div>
                    </div>
                ) : (
                    /* Proof grid */
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {PROOFS.map((p) => (
                            <motion.div
                                key={p.id}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setSelectedProof(p)}
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    cursor: 'pointer'
                                }}
                            >
                                {p.type === 'image' ? (
                                    <img src={p.src} alt={p.title}
                                        style={{ width: '100%', height: '110px', objectFit: 'cover', display: 'block' }}
                                    />
                                ) : (
                                    <div style={{
                                        height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: 'rgba(249,115,22,0.08)', fontSize: '36px'
                                    }}>📄</div>
                                )}
                                <div style={{ padding: '8px 10px' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#fff', marginBottom: '2px' }}>{p.title}</div>
                                    <div style={{ fontSize: '10px', color: '#64748b' }}>{p.date}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* ── Proof Detail Modal ── */}
            <AnimatePresence>
                {selectedProof && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedProof(null)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', zIndex: 2000 }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            style={{
                                position: 'fixed', top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 'min(92vw, 400px)',
                                background: 'linear-gradient(135deg, #111420, #1a1d30)',
                                border: '1px solid rgba(249,115,22,0.25)',
                                borderRadius: '20px', overflow: 'hidden',
                                zIndex: 2001,
                                boxShadow: '0 20px 60px rgba(0,0,0,0.8)'
                            }}
                        >
                            {selectedProof.type === 'image' && (
                                <img src={selectedProof.src} alt={selectedProof.title}
                                    style={{ width: '100%', maxHeight: '260px', objectFit: 'cover' }}
                                />
                            )}
                            <div style={{ padding: '18px' }}>
                                <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>{selectedProof.title}</div>
                                <div style={{ fontSize: '11px', color: '#f97316', marginBottom: '8px' }}>📅 {selectedProof.date}</div>
                                <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>{selectedProof.desc}</div>
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => setSelectedProof(null)}
                                    style={{
                                        marginTop: '16px', width: '100%',
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        color: '#94a3b8', borderRadius: '10px',
                                        padding: '10px', fontSize: '13px', cursor: 'pointer'
                                    }}
                                >{i18n.language === 'tr' ? 'Kapat' : 'Close'}</motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    )
}
