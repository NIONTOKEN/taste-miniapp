import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTonConnectUI } from '@tonconnect/ui-react'
import {
    getPlayerId,
    checkSpinStatus,
    recordSpin,
    claimReward
} from '../services/spin'

// ─── Config ────────────────────────────────────────────────────
const WHATSAPP_GROUP = 'https://chat.whatsapp.com/G2Q6xjoYt94GzseLmFnUtO'
const TARGET_POINTS = 2_000
const REWARD_TASTE = 25
const STORAGE_KEY = 'taste_spin_data'

// ─── Wheel Segments ────────────────────────────────────────────
const SEGMENTS = [
    { label: '200', points: 200, taste: 0, color: '#f59e0b', bg: '#78350f', emoji: '⭐' },
    { label: '100', points: 100, taste: 0, color: '#818cf8', bg: '#1e1b4b', emoji: '✨' },
    { label: '500', points: 500, taste: 0, color: '#22c55e', bg: '#14532d', emoji: '💚' },
    { label: '150', points: 150, taste: 0, color: '#f472b6', bg: '#831843', emoji: '🌸' },
    { label: '750', points: 750, taste: 0, color: '#fb923c', bg: '#7c2d12', emoji: '🔥' },
    { label: '300', points: 300, taste: 0, color: '#a78bfa', bg: '#2e1065', emoji: '💜' },
    { label: '1 TASTE', points: 0, taste: 1, color: '#fbbf24', bg: '#92400e', emoji: '🎁' },
    { label: '3 TASTE', points: 0, taste: 3, color: '#2dd4bf', bg: '#134e4a', emoji: '🏆' },
]

const N = SEGMENTS.length
const SEG_DEG = 360 / N // 45°
const RADIUS = 120
const CX = 130
const CY = 130

// ─── Helpers ───────────────────────────────────────────────────
function toRad(deg: number) { return (deg * Math.PI) / 180 }

function getSegPath(i: number) {
    const start = toRad(i * SEG_DEG - 90)
    const end = toRad((i + 1) * SEG_DEG - 90)
    const x1 = CX + RADIUS * Math.cos(start)
    const y1 = CY + RADIUS * Math.sin(start)
    const x2 = CX + RADIUS * Math.cos(end)
    const y2 = CY + RADIUS * Math.sin(end)
    return `M ${CX} ${CY} L ${x1} ${y1} A ${RADIUS} ${RADIUS} 0 0 1 ${x2} ${y2} Z`
}

function getTextPos(i: number) {
    const mid = toRad(i * SEG_DEG + SEG_DEG / 2 - 90)
    const r = RADIUS * 0.62
    return { x: CX + r * Math.cos(mid), y: CY + r * Math.sin(mid), angle: i * SEG_DEG + SEG_DEG / 2 }
}

function loadLocalData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return { points: 0, lastSpin: '', totalClaimed: 0 }
        return JSON.parse(raw)
    } catch { return { points: 0, lastSpin: '', totalClaimed: 0 } }
}

// Weighted random — TASTE dilimleri nadir
function pickWinner() {
    const weights = [24, 28, 10, 20, 4, 19, 8, 3] // 1 TASTE: ~%8, 3 TASTE: ~%3
    const total = weights.reduce((a, b) => a + b, 0)
    let r = Math.random() * total
    for (let i = 0; i < weights.length; i++) {
        r -= weights[i]
        if (r <= 0) return i
    }
    return 0
}

// ─── Wheel SVG ─────────────────────────────────────────────────
function WheelSVG() {
    return (
        <svg width={260} height={260} viewBox="0 0 260 260" style={{ display: 'block' }}>
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
            </defs>

            {/* Outer ring */}
            <circle cx={CX} cy={CY} r={RADIUS + 6} fill="none" stroke="rgba(245,158,11,0.4)" strokeWidth={4} />
            <circle cx={CX} cy={CY} r={RADIUS + 2} fill="none" stroke="rgba(245,158,11,0.15)" strokeWidth={2} />

            {/* Segments */}
            {SEGMENTS.map((seg, i) => {
                const tp = getTextPos(i)
                return (
                    <g key={i}>
                        <path d={getSegPath(i)} fill={seg.bg} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
                        <text
                            x={tp.x} y={tp.y - 8}
                            textAnchor="middle" dominantBaseline="middle"
                            fontSize="9" fill={seg.color} fontWeight="800"
                            transform={`rotate(${tp.angle}, ${tp.x}, ${tp.y})`}
                        >
                            {seg.emoji}
                        </text>
                        <text
                            x={tp.x} y={tp.y + 6}
                            textAnchor="middle" dominantBaseline="middle"
                            fontSize="9" fill={seg.color} fontWeight="900"
                            transform={`rotate(${tp.angle}, ${tp.x}, ${tp.y})`}
                        >
                            {seg.label}
                        </text>
                    </g>
                )
            })}

            {/* Center circle */}
            <circle cx={CX} cy={CY} r={22} fill="#0a0c14" stroke="rgba(245,158,11,0.5)" strokeWidth={2.5} filter="url(#glow)" />
            <text x={CX} y={CY} textAnchor="middle" dominantBaseline="middle" fontSize="16">🍳</text>
        </svg>
    )
}

// ─── Main Component ─────────────────────────────────────────────────────────
export function SpinWheel() {
    const [tonConnectUI] = useTonConnectUI()
    const walletAddress = tonConnectUI.account?.address ?? ''

    const [spinning, setSpinning] = useState(false)
    const [rotation, setRotation] = useState(0)
    const [points, setPoints] = useState(0)
    const [totalClaimed, setTotalClaimed] = useState(0)
    const [lastResult, setLastResult] = useState<(typeof SEGMENTS)[0] | null>(null)
    const [showResult, setShowResult] = useState(false)
    const [showReward, setShowReward] = useState(false)
    const [showTasteWin, setShowTasteWin] = useState(false)
    const [tasteWon, setTasteWon] = useState(0)
    const [copied, setCopied] = useState(false)

    // Sunucu kaynaklı durum
    const [canSpin, setCanSpin] = useState(false)
    const [serverLoading, setServerLoading] = useState(true)
    const [serverError, setServerError] = useState(false)
    const [blockedByServer, setBlockedByServer] = useState(false)

    const rotRef = useRef(0)
    const playerIdRef = useRef<string>('')

    // ── İlk yükleme: sunucudan durumu al ────────────────────────
    useEffect(() => {
        const init = async () => {
            setServerLoading(true)
            const playerId = getPlayerId(walletAddress)
            playerIdRef.current = playerId

            try {
                const status = await checkSpinStatus(playerId)
                setCanSpin(status.canSpin)
                setPoints(status.totalPoints)
                setTotalClaimed(status.totalClaimed)
                setServerError(false)
            } catch {
                // Sunucu alınamazsa localStorage'a dön
                const local = loadLocalData()
                const today = new Date().toISOString().slice(0, 10)
                setCanSpin(local.lastSpin !== today)
                setPoints(local.points ?? 0)
                setTotalClaimed(local.totalClaimed ?? 0)
                setServerError(true)
            } finally {
                setServerLoading(false)
            }
        }
        init()
    }, [walletAddress])

    const pct = Math.min((points / TARGET_POINTS) * 100, 100)
    const remaining = Math.max(TARGET_POINTS - points, 0)

    // ── Çarklığı çevir ──────────────────────────────────────────
    async function handleSpin() {
        if (!canSpin || spinning || serverLoading) return

        // Önce UI'ı güncelle (optimistik)
        setCanSpin(false)
        setSpinning(true)
        setShowResult(false)

        const winner = pickWinner()
        const seg = SEGMENTS[winner]
        const segCenter = winner * SEG_DEG + SEG_DEG / 2
        const toTop = (360 - segCenter % 360) % 360
        const extra = 5 * 360
        const endRot = rotRef.current + extra + toTop + (toTop === 0 ? 360 : 0)

        setRotation(endRot)
        rotRef.current = endRot

        setTimeout(async () => {
            const isTaste = seg.taste > 0

            // Sunucuya kaydet
            const result = await recordSpin(
                playerIdRef.current,
                seg.points,
                seg.taste,
                points,
                totalClaimed
            )

            if (!result.success) {
                // Sunucu reddetti (duplikasyon girişimi)
                setBlockedByServer(true)
                setSpinning(false)
                setCanSpin(false)
                return
            }

            setPoints(result.newTotal)
            setTotalClaimed(result.newClaimed)
            setSpinning(false)
            setLastResult(seg)
            setShowResult(true)

            if (isTaste) {
                setTimeout(() => {
                    setTasteWon(seg.taste)
                    setShowTasteWin(true)
                }, 800)
            } else if (result.newTotal >= TARGET_POINTS) {
                setTimeout(() => setShowReward(true), 800)
            }
        }, 4200)
    }

    // ── Ödül talebi ─────────────────────────────────────────────
    async function handleClaimReward() {
        const result = await claimReward(
            playerIdRef.current,
            REWARD_TASTE,
            points,
            totalClaimed
        )
        setPoints(result.newPoints)
        setTotalClaimed(result.newClaimed)
        setShowReward(false)
    }

    async function handleClaimTaste() {
        const result = await claimReward(
            playerIdRef.current,
            tasteWon,
            points,
            totalClaimed
        )
        setPoints(result.newPoints)
        setTotalClaimed(result.newClaimed)
        setShowTasteWin(false)
    }

    // WhatsApp direct group link
    const whatsappLink = WHATSAPP_GROUP

    function copyMessage() {
        const msg =
            `🎉 TASTE ÖDÜL TALEBİ\n\n` +
            `Merhaba! 2.000 puan biriktirdim.\n\n` +
            `💰 Talep: ${REWARD_TASTE} TASTE\n` +
            `👛 Cüzdan: ${walletAddress || '(cüzdan bağlı değil)'}\n` +
            `🆔 Player ID: ${playerIdRef.current}\n\n` +
            `Tarih: ${new Date().toLocaleDateString('tr-TR')}`
        navigator.clipboard.writeText(msg).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        })
    }

    function copyTasteMessage() {
        const msg =
            `🏆 ÇARKTA TASTE KAZANDIM!\n\n` +
            `💰 Kazandım: ${tasteWon} TASTE\n` +
            `👛 Cüzdan: ${walletAddress || '(cüzdan bağlı değil)'}\n` +
            `🆔 Player ID: ${playerIdRef.current}\n\n` +
            `Tarih: ${new Date().toLocaleDateString('tr-TR')}`
        navigator.clipboard.writeText(msg).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        })
    }

    // Sunucu yükleniyor skeleton
    if (serverLoading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                <div style={{ fontSize: '40px', marginBottom: '12px', animation: 'pulse 1.5s infinite' }}>🎡</div>
                <div style={{ fontWeight: 700, marginBottom: '4px', color: '#fff' }}>Durum kontrol ediliyor...</div>
                <div style={{ fontSize: '12px' }}>Sunucu doğrulaması yapılıyor</div>
            </div>
        )
    }

    return (
        <div style={{ paddingBottom: '10px' }}>

            {/* ── Sunucu hatası bildirimi ── */}
            {serverError && (
                <div style={{
                    background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)',
                    borderRadius: '12px', padding: '10px 14px', marginBottom: '16px',
                    fontSize: '12px', color: '#f59e0b', textAlign: 'center'
                }}>
                    ⚠️ Sunucuya bağlanılamadı — çevrimiçi mod kullanılıyor
                </div>
            )}

            {/* ── Sunucu tarafından engellendi ── */}
            <AnimatePresence>
                {blockedByServer && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{
                            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: '12px', padding: '12px 16px', marginBottom: '16px',
                            fontSize: '13px', color: '#ef4444', textAlign: 'center', fontWeight: 600
                        }}
                    >
                        🚫 Bugün zaten çevrildi — sunucu tarafından doğrulandı
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Header ── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ textAlign: 'center', marginBottom: '20px' }}
            >
                <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                    Günlük Şans
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0 }}>🎡 Çarkıfelek</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Günde 1 çevirme hakkı • 2.000 puan = <strong style={{ color: '#f59e0b' }}>{REWARD_TASTE} TASTE</strong>
                    <br /><span style={{ color: '#fbbf24', fontSize: '11px' }}>🎁 Çarkta 1–3 TASTE doğrudan kazanabilirsin!</span>
                </p>
                {/* Sunucu doğrulama rozeti */}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '6px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '20px', padding: '3px 10px', fontSize: '10px', color: '#22c55e', fontWeight: 700 }}>
                    🛡️ Sunucu Doğrulamalı
                </div>
            </motion.div>

            {/* ── Progress Bar ── */}
            <div style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '14px',
                padding: '14px 16px',
                marginBottom: '20px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
                    <span style={{ fontWeight: 700, color: '#fff' }}>⭐ {points.toLocaleString('tr-TR')} Puan</span>
                    <span style={{ color: 'var(--text-muted)' }}>Hedef: {TARGET_POINTS.toLocaleString('tr-TR')}</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '6px', overflow: 'hidden' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        style={{
                            height: '100%',
                            background: pct >= 100
                                ? 'linear-gradient(90deg, #22c55e, #16a34a)'
                                : 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                            borderRadius: '6px',
                            boxShadow: pct >= 100 ? '0 0 12px rgba(34,197,94,0.5)' : '0 0 8px rgba(245,158,11,0.4)'
                        }}
                    />
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '5px', textAlign: 'right' }}>
                    {remaining > 0 ? `${remaining.toLocaleString('tr-TR')} puan kaldı` : '🎉 ÖDÜL HAZIR!'}
                </div>
            </div>

            {/* ── Wheel ── */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', position: 'relative' }}>
                {/* Pointer */}
                <div style={{
                    position: 'absolute', top: -4, left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10, fontSize: '22px',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                }}>
                    ▼
                </div>

                <motion.div
                    animate={{ rotate: rotation }}
                    transition={{ duration: 4, ease: [0.17, 0.67, 0.12, 1.0] }}
                    style={{ transformOrigin: 'center', borderRadius: '50%' }}
                >
                    <WheelSVG />
                </motion.div>
            </div>

            {/* ── Spin Button ── */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <motion.button
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: canSpin ? 1.04 : 1 }}
                    onClick={handleSpin}
                    disabled={!canSpin || spinning}
                    style={{
                        background: canSpin
                            ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                            : 'rgba(255,255,255,0.05)',
                        color: canSpin ? '#000' : 'var(--text-muted)',
                        border: 'none',
                        borderRadius: '14px',
                        padding: '14px 40px',
                        fontSize: '15px',
                        fontWeight: '800',
                        cursor: canSpin ? 'pointer' : 'not-allowed',
                        boxShadow: canSpin ? '0 4px 20px rgba(245,158,11,0.35)' : 'none',
                        transition: 'all 0.2s'
                    }}
                >
                    {spinning ? '🌀 Dönüyor...' : canSpin ? '🎡 ÇEVİR!' : '✅ Bugün Çevrildi'}
                </motion.button>
            </div>

            {/* ── Result Toast ── */}
            <AnimatePresence>
                {showResult && lastResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        style={{
                            background: `linear-gradient(135deg, ${lastResult.bg}, rgba(255,255,255,0.03))`,
                            border: `1px solid ${lastResult.color}40`,
                            borderRadius: '14px',
                            padding: '14px',
                            textAlign: 'center',
                            marginBottom: '16px',
                            boxShadow: `0 0 20px ${lastResult.color}20`
                        }}
                    >
                        <div style={{ fontSize: '28px' }}>{lastResult.emoji}</div>
                        <div style={{ fontSize: '20px', fontWeight: '900', color: lastResult.color, marginTop: '4px' }}>
                            {lastResult.taste > 0
                                ? `🎉 ${lastResult.taste} TASTE Kazandın!`
                                : `+${lastResult.points} Puan!`}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            Yarın tekrar çevirebilirsin 🕐
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Info grid ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: '900', color: '#f59e0b' }}>{points.toLocaleString('tr-TR')}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '3px' }}>Toplam Puan</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: '900', color: '#22c55e' }}>{totalClaimed}</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '3px' }}>Kazanılan TASTE</div>
                </div>
            </div>

            {/* ── Ödül Segments Table ── */}
            <div style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '14px',
                padding: '12px',
                fontSize: '12px'
            }}>
                <div style={{ fontWeight: 700, color: 'var(--text-muted)', marginBottom: '10px', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    Çark Dilimleri
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                    {SEGMENTS.map((seg, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
                            <span style={{ color: seg.color, fontWeight: 700 }}>
                                {seg.emoji} {seg.taste > 0 ? `${seg.label} 🎉` : `${seg.label} puan`}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ══ REWARD MODAL ══ */}
            <AnimatePresence>
                {showReward && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowReward(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 2000 }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 40 }}
                            style={{
                                position: 'fixed', top: '50%', left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: 'min(90vw, 380px)',
                                background: 'linear-gradient(135deg, #11141f, #1a1d2e)',
                                border: '1px solid rgba(245,158,11,0.3)',
                                borderRadius: '24px', padding: '28px 24px',
                                zIndex: 2001, textAlign: 'center',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 40px rgba(245,158,11,0.1)'
                            }}
                        >
                            <div style={{ fontSize: '54px', marginBottom: '12px' }}>🏆</div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '6px', color: '#fbbf24' }}>
                                TEBRİKLER!
                            </h3>
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px', lineHeight: 1.6 }}>
                                <strong style={{ color: '#fff' }}>2.000 puan</strong> biriktirdin!<br />
                                <strong style={{ color: '#fbbf24' }}>{REWARD_TASTE} TASTE</strong> ödülüne hak kazandın.
                            </p>

                            {walletAddress ? (
                                <div style={{
                                    background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
                                    borderRadius: '12px', padding: '10px 14px', marginBottom: '16px',
                                    fontSize: '10px', fontFamily: 'monospace', color: '#22c55e',
                                    wordBreak: 'break-all', textAlign: 'left'
                                }}>
                                    👛 {walletAddress}
                                </div>
                            ) : (
                                <div style={{
                                    background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                                    borderRadius: '12px', padding: '10px 14px', marginBottom: '16px',
                                    fontSize: '12px', color: '#f59e0b'
                                }}>
                                    ⚠️ WhatsApp mesajına cüzdan adresini ekle!
                                </div>
                            )}

                            <div style={{
                                background: 'rgba(255,255,255,0.03)', borderRadius: '12px',
                                padding: '12px', marginBottom: '18px', textAlign: 'left',
                                fontSize: '12px', color: 'var(--text-muted)', lineHeight: 2
                            }}>
                                <div>1️⃣ Mesajı kopyala</div>
                                <div>2️⃣ WhatsApp grubuna git</div>
                                <div>3️⃣ Mesajı yapıştır ve gönder</div>
                                <div>4️⃣ TASTE cüzdanına gelecek! 🎉</div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                    onClick={copyMessage}
                                    style={{
                                        background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.06)',
                                        border: copied ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.1)',
                                        color: copied ? '#22c55e' : '#fff',
                                        borderRadius: '12px', padding: '12px',
                                        fontSize: '13px', fontWeight: 700, cursor: 'pointer'
                                    }}
                                >
                                    {copied ? '✅ Mesaj Kopyalandı!' : '📋 Mesajı Kopyala'}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                    onClick={() => {
                                        handleClaimReward()
                                        if (window.Telegram?.WebApp) window.Telegram.WebApp.openLink(whatsappLink)
                                        else window.open(whatsappLink, '_blank')
                                    }}
                                    style={{
                                        background: 'linear-gradient(135deg, #25d366, #128c7e)',
                                        color: '#fff', border: 'none', borderRadius: '12px',
                                        padding: '13px', fontSize: '13px', fontWeight: 800,
                                        cursor: 'pointer', boxShadow: '0 4px 16px rgba(37,211,102,0.3)'
                                    }}
                                >
                                    💬 WhatsApp Grubuna Git
                                </motion.button>

                                <button
                                    onClick={() => setShowReward(false)}
                                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer', padding: '6px' }}
                                >
                                    Sonra yapayım
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ══ TASTE WIN MODAL ══ */}
            <AnimatePresence>
                {showTasteWin && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowTasteWin(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 2000 }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.7, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            style={{
                                position: 'fixed', top: '50%', left: '50%',
                                transform: 'translate(-50%,-50%)',
                                width: 'min(90vw, 360px)',
                                background: 'linear-gradient(135deg, #0d2818, #134e4a)',
                                border: '2px solid rgba(45,212,191,0.5)',
                                borderRadius: '24px', padding: '28px 22px',
                                zIndex: 2001, textAlign: 'center',
                                boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 50px rgba(45,212,191,0.2)'
                            }}
                        >
                            <div style={{ fontSize: '60px', marginBottom: '8px' }}>
                                {tasteWon === 1 ? '🎁' : '🏆'}
                            </div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#2dd4bf', marginBottom: '6px' }}>
                                🎉 {tasteWon} TASTE BONUSU!
                            </h3>
                            <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '18px', lineHeight: 1.7 }}>
                                Çarkta <strong style={{ color: '#fbbf24' }}>{tasteWon} TASTE</strong> bonusu kazandın!<br />
                                <span style={{ color: '#2dd4bf' }}>📌 Önemli:</span> Ödemeler minimum <strong style={{ color: '#fff' }}>25 TASTE</strong> eşiğinde yapılır.<br />
                                Mesajını WhatsApp kanalına gönder, yönetici birikimi takip ederek gönderecek.
                            </p>
                            {walletAddress && (
                                <div style={{
                                    background: 'rgba(45,212,191,0.08)', border: '1px solid rgba(45,212,191,0.2)',
                                    borderRadius: '10px', padding: '8px 12px', marginBottom: '14px',
                                    fontSize: '10px', fontFamily: 'monospace', color: '#2dd4bf',
                                    wordBreak: 'break-all', textAlign: 'left'
                                }}>
                                    👛 {walletAddress}
                                </div>
                            )}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={copyTasteMessage}
                                    style={{
                                        background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.07)',
                                        border: copied ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.12)',
                                        color: copied ? '#22c55e' : '#fff',
                                        borderRadius: '12px', padding: '12px',
                                        fontSize: '13px', fontWeight: 700, cursor: 'pointer'
                                    }}
                                >
                                    {copied ? '✅ Mesaj Kopyalandı!' : '📋 Mesajı Kopyala'}
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => {
                                        handleClaimTaste()
                                        if (window.Telegram?.WebApp) window.Telegram.WebApp.openLink(WHATSAPP_GROUP)
                                        else window.open(WHATSAPP_GROUP, '_blank')
                                    }}
                                    style={{
                                        background: 'linear-gradient(135deg, #25d366, #128c7e)',
                                        color: '#fff', border: 'none', borderRadius: '12px',
                                        padding: '13px', fontSize: '13px', fontWeight: 800,
                                        cursor: 'pointer', boxShadow: '0 4px 16px rgba(37,211,102,0.3)'
                                    }}
                                >
                                    💬 WhatsApp Kanalına Git
                                </motion.button>
                                <button onClick={() => setShowTasteWin(false)}
                                    style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12px', cursor: 'pointer' }}
                                >Sonra yapayım</button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
