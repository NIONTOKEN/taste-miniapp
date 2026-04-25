import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation, Trans } from 'react-i18next'
import { useTonConnectUI } from '@tonconnect/ui-react'
import { useWallet } from '../context/WalletContext'

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
    const { t } = useTranslation()
    const [tonConnectUI] = useTonConnectUI()
    const { activeAddress } = useWallet()
    const isConnected = !!activeAddress

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
                    {t('charity.hero.badge')}
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: '0 0 10px' }}>
                    {t('charity.hero.title')}
                </h3>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 320, margin: '0 auto' }}>
                    <Trans
                        i18nKey="charity.hero.desc"
                        components={{
                            1: <strong style={{ color: '#f97316' }} />,
                            2: <strong style={{ color: '#f59e0b' }} />
                        }}
                    />
                </div>

                {/* Stats row */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '16px', flexWrap: 'wrap' }}>
                    {[
                        { emoji: '🐾', label: t('charity.hero.stats.stray'), val: t('charity.hero.stats.unlimited') },
                        { emoji: '❤️', label: t('charity.hero.stats.channel'), val: t('charity.hero.stats.247') },
                        { emoji: '✅', label: t('charity.hero.stats.transparency'), val: 'On-Chain' },
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
                    🏦 {t('charity.wallet.title')}
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
                        {copiedTON ? t('charity.wallet.copied') : t('charity.wallet.copy_ton')}
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
                        {copiedTST ? t('charity.wallet.copied') : t('charity.wallet.copy_taste')}
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
                    💎 {t('charity.ton_donate.title')}
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
                        placeholder={t('charity.ton_donate.placeholder')}
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
                    {sending ? t('charity.ton_donate.sending') : isConnected ? t('charity.ton_donate.donate_btn', { amount: donateAmt || '?' }) : t('charity.ton_donate.connect_btn')}
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
                            {txResult === 'success' ? t('charity.ton_donate.success') : t('charity.ton_donate.error')}
                        </motion.div>
                    )}
                </AnimatePresence>

                <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '10px', textAlign: 'center', lineHeight: 1.6 }}>
                    💡 {t('charity.ton_donate.footer')}
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
                        {t('charity.taste_info.title')}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.6 }}>
                        {t('charity.taste_info.desc')}
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
                            {t('charity.gallery.badge')}
                        </div>
                        <h4 style={{ fontWeight: 800, margin: '2px 0 0', fontSize: '1rem' }}>📸 {t('charity.gallery.title')}</h4>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'right' }}>
                        {PROOFS.length} {t('charity.gallery.records')}
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
                            {t('charity.gallery.empty_title')}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6 }}>
                            {t('charity.gallery.empty_desc')}
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
                                >{t('charity.gallery.close')}</motion.button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

        </div>
    )
}
