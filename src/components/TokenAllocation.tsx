import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

// ─── TASTE Token Data ────────────────────────────────────────────────────────
const JETTON_ADDRESS = 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-'

const ALLOCATION = [
    { key: 'locked',    labelTr: 'JVault Kilitli',     labelEn: 'JVault Locked',     pct: 88.4, color: '#f59e0b' },
    { key: 'lp',        labelTr: 'Likidite Havuzu',    labelEn: 'Liquidity Pool',     pct: 6.4,  color: '#3b82f6' },
    { key: 'ops',       labelTr: 'Operasyon',          labelEn: 'Operations',         pct: 1.0,  color: '#8b5cf6' },
    { key: 'team',      labelTr: 'Ekip',               labelEn: 'Team',               pct: 2.0,  color: '#ec4899' },
    { key: 'founder',   labelTr: 'Kurucu',             labelEn: 'Founder',            pct: 2.0,  color: '#10b981' },
    { key: 'rewards',   labelTr: 'Ödüller',            labelEn: 'Rewards',            pct: 0.2,  color: '#ef4444' },
]

const STATS = [
    { labelTr: 'Toplam Arz',    labelEn: 'Total Supply',    value: '25,000,000',  unit: 'TASTE', emoji: '🪙', color: '#f59e0b' },
    { labelTr: 'Kilitli',       labelEn: 'Locked',          value: '22,100,000',  unit: 'TASTE', emoji: '🔒', color: '#22c55e' },
    { labelTr: 'LP Kilidi',     labelEn: 'LP Lock',         value: '81.6%',       unit: 'STON.fi', emoji: '💧', color: '#3b82f6' },
    { labelTr: 'Blockchain',    labelEn: 'Blockchain',      value: 'TON',         unit: 'Jetton', emoji: '⛓️',  color: '#8b5cf6' },
]

// ─── SVG Donut Chart ─────────────────────────────────────────────────────────
function DonutChart({ active, onSliceClick }: { active: number | null; onSliceClick: (i: number) => void }) {
    const SIZE = 200
    const R = 80
    const STROKE = 28
    const cx = SIZE / 2
    const cy = SIZE / 2
    const circumference = 2 * Math.PI * R

    let cumulative = 0
    const slices = ALLOCATION.map((seg, i) => {
        const dash = (seg.pct / 100) * circumference
        const gap = circumference - dash
        const rotate = (cumulative / 100) * 360 - 90
        cumulative += seg.pct
        return { ...seg, dash, gap, rotate, i }
    })

    return (
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ overflow: 'visible' }}>
            {/* Background circle */}
            <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={STROKE} />

            {slices.map((s, i) => (
                <motion.circle
                    key={s.key}
                    cx={cx} cy={cy} r={R}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={active === i ? STROKE + 4 : STROKE}
                    strokeDasharray={`${s.dash} ${s.gap}`}
                    strokeDashoffset={0}
                    transform={`rotate(${s.rotate} ${cx} ${cy})`}
                    strokeLinecap="round"
                    style={{ cursor: 'pointer', filter: active === i ? `drop-shadow(0 0 8px ${s.color})` : 'none', transition: 'all 0.3s ease' }}
                    initial={{ strokeDasharray: '0 999' }}
                    animate={{ strokeDasharray: `${s.dash} ${s.gap}` }}
                    transition={{ duration: 1, delay: i * 0.12, ease: 'easeOut' }}
                    onClick={() => onSliceClick(i)}
                />
            ))}

            {/* Center text */}
            <text x={cx} y={cy - 10} textAnchor="middle" fill="#f59e0b" fontSize="22" fontWeight="900">
                TASTE
            </text>
            <text x={cx} y={cy + 12} textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="600">
                TON JETTON
            </text>
            {active !== null && (
                <text x={cx} y={cy + 28} textAnchor="middle" fill={ALLOCATION[active].color} fontSize="13" fontWeight="800">
                    {ALLOCATION[active].pct}%
                </text>
            )}
        </svg>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function TokenAllocation() {
    const { i18n } = useTranslation()
    const isTr = i18n.language?.startsWith('tr')
    const [active, setActive] = useState<number | null>(null)
    const [holders, setHolders] = useState<number>(484)
    const [tab, setTab] = useState<'allocation' | 'stats'>('allocation')

    useEffect(() => {
        fetch(`https://tonapi.io/v2/jettons/${JETTON_ADDRESS}`)
            .then(r => r.json())
            .then(d => { if (d.holders_count) setHolders(d.holders_count) })
            .catch(() => {})
    }, [])

    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ fontSize: '18px' }}>🪙</div>
                <div>
                    <div style={{ fontSize: '13px', fontWeight: 900, color: '#fff' }}>
                        {isTr ? 'TOKEN DAĞILIMI' : 'TOKEN ALLOCATION'}
                    </div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>
                        {isTr ? `${holders.toLocaleString()} cüzdan sahibi` : `${holders.toLocaleString()} wallet holders`}
                    </div>
                </div>
                <div style={{ marginLeft: 'auto', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '8px', padding: '4px 10px', fontSize: '10px', color: '#f59e0b', fontWeight: 700 }}>
                    25M SUPPLY
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '4px', marginBottom: '16px', gap: '4px' }}>
                {(['allocation', 'stats'] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{
                        flex: 1, padding: '8px', borderRadius: '9px', border: 'none',
                        background: tab === t ? 'rgba(245,158,11,0.15)' : 'transparent',
                        color: tab === t ? '#f59e0b' : '#64748b',
                        fontSize: '12px', fontWeight: 800, cursor: 'pointer',
                        borderLeft: tab === t ? '1px solid rgba(245,158,11,0.3)' : 'none',
                        transition: 'all 0.2s'
                    }}>
                        {t === 'allocation' ? (isTr ? '🍩 Dağılım' : '🍩 Allocation') : (isTr ? '📊 İstatistik' : '📊 Stats')}
                    </button>
                ))}
            </div>

            {tab === 'allocation' ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {/* Donut Chart */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <DonutChart active={active} onSliceClick={i => setActive(active === i ? null : i)} />
                    </div>

                    {/* Active slice info */}
                    {active !== null && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                            style={{
                                background: `${ALLOCATION[active].color}12`,
                                border: `1px solid ${ALLOCATION[active].color}30`,
                                borderRadius: '12px', padding: '10px 14px', marginBottom: '12px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}
                        >
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>
                                {isTr ? ALLOCATION[active].labelTr : ALLOCATION[active].labelEn}
                            </span>
                            <span style={{ fontSize: '18px', fontWeight: 900, color: ALLOCATION[active].color }}>
                                {ALLOCATION[active].pct}%
                            </span>
                        </motion.div>
                    )}

                    {/* Legend */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                        {ALLOCATION.map((seg, i) => (
                            <motion.div
                                key={seg.key}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setActive(active === i ? null : i)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    background: active === i ? `${seg.color}12` : 'rgba(255,255,255,0.025)',
                                    border: `1px solid ${active === i ? seg.color + '40' : 'rgba(255,255,255,0.06)'}`,
                                    borderRadius: '10px', padding: '8px 10px', cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ width: 10, height: 10, borderRadius: '50%', background: seg.color, flexShrink: 0, boxShadow: `0 0 6px ${seg.color}80` }} />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '10px', color: '#e2e8f0', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {isTr ? seg.labelTr : seg.labelEn}
                                    </div>
                                    <div style={{ fontSize: '12px', color: seg.color, fontWeight: 900 }}>{seg.pct}%</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {/* Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
                        {STATS.map(s => (
                            <div key={s.labelEn} style={{
                                background: `${s.color}08`, border: `1px solid ${s.color}20`,
                                borderRadius: '14px', padding: '14px', textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.emoji}</div>
                                <div style={{ fontSize: '16px', fontWeight: 900, color: s.color, lineHeight: 1.2 }}>{s.value}</div>
                                <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>
                                    {s.unit}
                                </div>
                                <div style={{ fontSize: '9px', color: '#475569', marginTop: '4px' }}>
                                    {isTr ? s.labelTr : s.labelEn}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Contract address */}
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px' }}>
                        <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase' }}>
                            {isTr ? '📋 Kontrat Adresi' : '📋 Contract Address'}
                        </div>
                        <div style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.6 }}>
                            {JETTON_ADDRESS}
                        </div>
                        <a
                            href={`https://tonscan.org/jetton/${JETTON_ADDRESS}`}
                            target="_blank" rel="noopener noreferrer"
                            style={{ display: 'inline-block', marginTop: '8px', fontSize: '10px', color: '#f59e0b', fontWeight: 700, textDecoration: 'none' }}
                        >
                            {isTr ? 'Tonscan\'da Görüntüle →' : 'View on Tonscan →'}
                        </a>
                    </div>

                    {/* Lock info */}
                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {[
                            { label: isTr ? '🔒 Kilit 1' : '🔒 Lock 1', value: '10,000,000 TASTE (40%)', color: '#22c55e' },
                            { label: isTr ? '🔒 Kilit 2' : '🔒 Lock 2', value: '8,000,000 TASTE (32%)', color: '#3b82f6' },
                            { label: isTr ? '🔒 Kilit 3' : '🔒 Lock 3', value: '4,100,000 TASTE (16.4%)', color: '#8b5cf6' },
                        ].map(lock => (
                            <div key={lock.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: `${lock.color}08`, border: `1px solid ${lock.color}20`, borderRadius: '10px', padding: '10px 12px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 700, color: '#e2e8f0' }}>{lock.label}</span>
                                <span style={{ fontSize: '12px', fontWeight: 900, color: lock.color }}>{lock.value}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '10px', color: '#334155' }}>
                {isTr ? '📡 Veriler TON Blockchain\'den canlı çekiliyor' : '📡 Live data from TON Blockchain'}
            </div>
        </div>
    )
}
