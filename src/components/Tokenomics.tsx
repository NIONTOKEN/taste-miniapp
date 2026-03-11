import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Tokenomics Data ────────────────────────────────────────────────
const TOTAL = 25_000_000
const SLICES = [
    {
        key: 'locked',
        label: 'Kilitli (JVault)',
        labelEn: 'Locked Reserves',
        amount: 22_100_000,
        pct: 88.4,
        color: '#22c55e',
        glow: 'rgba(34,197,94,0.35)',
        icon: '🔒',
        note: 'JVault on-chain kilitli',
    },
    {
        key: 'liquidity',
        label: 'Likidite Havuzu',
        labelEn: 'Liquidity Pool',
        amount: 1_600_000,
        pct: 6.4,
        color: '#818cf8',
        glow: 'rgba(129,140,248,0.35)',
        icon: '💧',
        note: 'Havuzda aktif: 221,171 TASTE',
    },
    {
        key: 'team',
        label: 'Ekip Payı',
        labelEn: 'Team',
        amount: 500_000,
        pct: 2,
        color: '#facc15',
        glow: 'rgba(250,204,21,0.35)',
        icon: '👥',
        note: 'Ekip üyeleri için ayrıldı',
    },
    {
        key: 'founder',
        label: 'Kurucu / Owner',
        labelEn: 'Founder',
        amount: 500_000,
        pct: 2,
        color: '#f59e0b',
        glow: 'rgba(245,158,11,0.35)',
        icon: '👑',
        note: 'Proje kurucusu için ayrıldı',
    },
    {
        key: 'ops',
        label: 'Masraf / Borsa / Ödül',
        labelEn: 'Operations',
        amount: 250_000,
        pct: 1,
        color: '#f97316',
        glow: 'rgba(249,115,22,0.35)',
        icon: '💼',
        note: 'Listeleme, masraf, ekstra ödüller',
    },
    {
        key: 'airdrop',
        label: 'Airdrop',
        labelEn: 'Airdrop',
        amount: 50_000,
        pct: 0.2,
        color: '#ec4899',
        glow: 'rgba(236,72,153,0.35)',
        icon: '🎁',
        note: '🚀 Şu an dağıtılıyor',
    },
]

// ─── SVG Donut Helpers ───────────────────────────────────────────────
const R = 72        // radius
const CX = 90       // center x
const CY = 90       // center y
const STROKE = 22   // thickness
const CIRC = 2 * Math.PI * R  // ≈ 452.39

function buildSegments() {
    let cum = 0
    return SLICES.map((s) => {
        const dash = (s.pct / 100) * CIRC
        const gap = CIRC - dash
        // start at top (−90°) thus offset = CIRC − cum
        const offset = CIRC - cum + CIRC * 0.25
        cum += dash
        return { ...s, dash, gap, offset }
    })
}

const SEGMENTS = buildSegments()

// ─── Component ───────────────────────────────────────────────────────
export function Tokenomics() {
    const [active, setActive] = useState<string | null>(null)
    const [animated, setAnimated] = useState(false)

    useEffect(() => {
        const t = setTimeout(() => setAnimated(true), 200)
        return () => clearTimeout(t)
    }, [])

    const activeSlice = SEGMENTS.find((s) => s.key === active) ?? null

    return (
        <div style={{ paddingBottom: '8px' }}>

            {/* ── Title ── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ textAlign: 'center', marginBottom: '24px' }}
            >
                <div style={{ fontSize: '11px', letterSpacing: '2px', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                    Token Ekosistemi
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, margin: 0 }}>
                    Tokenomics Dağılımı
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Toplam Arz: <strong style={{ color: 'var(--primary)' }}>25,000,000 TASTE</strong>
                </p>
            </motion.div>

            {/* ── Donut Chart ── */}
            <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', damping: 18, stiffness: 120 }}
                style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px', position: 'relative' }}
            >
                <div style={{ position: 'relative', width: 180, height: 180 }}>
                    <svg
                        width={180}
                        height={180}
                        viewBox="0 0 180 180"
                        style={{ transform: 'rotate(-90deg)' }}
                    >
                        {/* Background ring */}
                        <circle
                            cx={CX} cy={CY} r={R}
                            fill="none"
                            stroke="rgba(255,255,255,0.04)"
                            strokeWidth={STROKE}
                        />
                        {/* Segments */}
                        {SEGMENTS.map((seg) => (
                            <circle
                                key={seg.key}
                                cx={CX} cy={CY} r={R}
                                fill="none"
                                stroke={seg.color}
                                strokeWidth={active === seg.key ? STROKE + 5 : STROKE}
                                strokeDasharray={animated ? `${seg.dash} ${seg.gap}` : `0 ${CIRC}`}
                                strokeDashoffset={seg.offset}
                                strokeLinecap="butt"
                                style={{
                                    transition: `stroke-dasharray 1.2s ease ${SEGMENTS.indexOf(seg) * 0.08}s, stroke-width 0.2s, filter 0.2s`,
                                    filter: active === seg.key ? `drop-shadow(0 0 8px ${seg.color})` : 'none',
                                    cursor: 'pointer',
                                    opacity: active && active !== seg.key ? 0.35 : 1,
                                }}
                                onClick={() => setActive(active === seg.key ? null : seg.key)}
                            />
                        ))}
                    </svg>

                    {/* Center Label */}
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%,-50%)',
                        textAlign: 'center', pointerEvents: 'none'
                    }}>
                        <AnimatePresence mode="wait">
                            {activeSlice ? (
                                <motion.div
                                    key={activeSlice.key}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.18 }}
                                >
                                    <div style={{ fontSize: '22px', lineHeight: 1 }}>{activeSlice.icon}</div>
                                    <div style={{ fontSize: '15px', fontWeight: 900, color: activeSlice.color, marginTop: '2px' }}>
                                        {activeSlice.pct}%
                                    </div>
                                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '1px', maxWidth: '60px', lineHeight: 1.3 }}>
                                        {activeSlice.label}
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="default"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Toplam</div>
                                    <div style={{ fontSize: '14px', fontWeight: 900, color: 'var(--primary)' }}>25M</div>
                                    <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>TASTE</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

            {/* ── Legend Grid ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                {SEGMENTS.map((seg, i) => (
                    <motion.button
                        key={seg.key}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.06 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setActive(active === seg.key ? null : seg.key)}
                        style={{
                            background: active === seg.key
                                ? `linear-gradient(135deg, ${seg.glow}, rgba(255,255,255,0.04))`
                                : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${active === seg.key ? seg.color : 'rgba(255,255,255,0.07)'}`,
                            borderRadius: '12px',
                            padding: '10px 12px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            transition: 'all 0.2s',
                            boxShadow: active === seg.key ? `0 0 12px ${seg.glow}` : 'none',
                        }}
                    >
                        {/* Top Row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                            <div style={{
                                width: 8, height: 8, borderRadius: '50%',
                                background: seg.color,
                                boxShadow: `0 0 6px ${seg.color}`,
                                flexShrink: 0
                            }} />
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>
                                {seg.icon} {seg.label}
                            </span>
                        </div>
                        {/* Amount + Pct */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                {(seg.amount / 1_000_000).toFixed(seg.amount >= 1_000_000 ? 1 : 2)}M
                            </span>
                            <span style={{ fontSize: '13px', fontWeight: 900, color: seg.color }}>
                                {seg.pct}%
                            </span>
                        </div>
                        {/* Mini Progress Bar */}
                        <div style={{ marginTop: '5px', height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                whileInView={{ width: `${Math.max(seg.pct, 1)}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                style={{ height: '100%', background: seg.color, borderRadius: '2px' }}
                            />
                        </div>
                        {/* Note on active */}
                        <AnimatePresence>
                            {active === seg.key && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ overflow: 'hidden' }}
                                >
                                    <div style={{ fontSize: '9px', color: seg.color, marginTop: '5px', fontStyle: 'italic' }}>
                                        {seg.note}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                ))}
            </div>

            {/* ── Ecosystem Flow ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: '16px',
                    padding: '16px',
                    marginBottom: '16px'
                }}
            >
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', marginBottom: '14px', textAlign: 'center', letterSpacing: '1px', textTransform: 'uppercase' }}>
                    🌐 Ekosistem Akışı
                </div>

                {/* Flow Diagram */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

                    {/* Row 1: Source */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <EcoNode color="#f59e0b" icon="🏭" label="25M TASTE" sub="Toplam Arz" big />
                    </div>

                    {/* Arrow Down */}
                    <FlowArrow />

                    {/* Row 2: Main splits */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <EcoNode color="#22c55e" icon="🔒" label="22.1M" sub="Kilitli %88.4" />
                        <EcoNode color="#818cf8" icon="💧" label="1.6M" sub="Likidite %6.4" />
                    </div>

                    {/* Sub-arrows */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <div style={{ textAlign: 'center', color: '#22c55e', fontSize: '14px' }}>↕</div>
                        <div style={{ textAlign: 'center', color: '#818cf8', fontSize: '14px' }}>↓</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        <EcoNode color="#22c55e" icon="🛡️" label="JVault" sub="On-chain kilitli" small />
                        <EcoNode color="#818cf8" icon="📊" label="STON.fi" sub="Aktif: 221,171" small />
                    </div>

                    <FlowArrow />

                    {/* Row 3: Community */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                        <EcoNode color="#facc15" icon="👥" label="500K" sub="Ekip %2" small />
                        <EcoNode color="#f59e0b" icon="👑" label="500K" sub="Kurucu %2" small />
                        <EcoNode color="#f97316" icon="💼" label="250K" sub="Masraf %1" small />
                    </div>

                    <FlowArrow />

                    {/* Row 4: Airdrop → Community */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <EcoNode color="#ec4899" icon="🎁" label="50K Airdrop" sub="Topluluk Dağıtımı %0.2" big pulse />
                    </div>

                    {/* Arrow to Users */}
                    <FlowArrow color="#ec4899" />

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <EcoNode color="#a78bfa" icon="👤" label="Topluluk" sub="Telegram • STON.fi • MiniApp" big />
                    </div>
                </div>
            </motion.div>

            {/* ── Live Pool Info ── */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={{
                    background: 'linear-gradient(135deg, rgba(129,140,248,0.08), rgba(34,197,94,0.05))',
                    border: '1px solid rgba(129,140,248,0.2)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    gap: '12px',
                    alignItems: 'center'
                }}
            >
                <div style={{ fontSize: '24px' }}>💧</div>
                <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#818cf8' }}>
                        Aktif Likidite Havuzu
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Şu an havuzda <strong style={{ color: '#22c55e' }}>221,171 TASTE</strong> aktif •&nbsp;
                        Toplam hedef <strong style={{ color: '#818cf8' }}>1,600,000 TASTE</strong> (kademeli)
                    </div>
                </div>
            </motion.div>

        </div>
    )
}

// ─── Helper sub-components ─────────────────────────────────────────

interface EcoNodeProps {
    color: string
    icon: string
    label: string
    sub: string
    big?: boolean
    small?: boolean
    pulse?: boolean
}

function EcoNode({ color, icon, label, sub, big, small, pulse }: EcoNodeProps) {
    return (
        <div style={{
            background: `linear-gradient(135deg, ${color}12, ${color}06)`,
            border: `1px solid ${color}30`,
            borderRadius: big ? '14px' : '10px',
            padding: big ? '10px 14px' : small ? '6px 8px' : '8px 10px',
            textAlign: 'center',
            boxShadow: pulse ? `0 0 16px ${color}40` : 'none',
            animation: pulse ? 'pulse-glow 2s ease-in-out infinite' : 'none',
        }}>
            <div style={{ fontSize: big ? '18px' : small ? '14px' : '16px' }}>{icon}</div>
            <div style={{
                fontSize: big ? '13px' : small ? '10px' : '11px',
                fontWeight: 800,
                color,
                marginTop: '2px',
                lineHeight: 1.2
            }}>{label}</div>
            <div style={{
                fontSize: big ? '9px' : '8px',
                color: 'var(--text-muted)',
                marginTop: '2px',
                lineHeight: 1.3
            }}>{sub}</div>
        </div>
    )
}

function FlowArrow({ color = 'rgba(255,255,255,0.2)' }: { color?: string }) {
    return (
        <div style={{ textAlign: 'center', color, fontSize: '16px', lineHeight: 1, margin: '-2px 0' }}>
            ↓
        </div>
    )
}
