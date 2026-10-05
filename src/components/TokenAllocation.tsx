import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Copy, Check, ExternalLink, ShieldCheck, Lock, Droplets, Crown, PieChart, Clock } from 'lucide-react'

// ─── TASTE AI On-Chain Data ────────────────────────────────────────────────
const JETTON_MASTER = 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-'
const TOTAL_SUPPLY = 25_000_000

// 3 Adet JVault On-Chain Kilit NFT'si
const LOCKS = [
    {
        id: 1,
        amount: 10_000_000,
        pct: 40.0,
        address: 'EQDKKeOpSEE_diuEGULjR-yrJwrGOSwoHvYVdAPmtbeNj0v2',
        unlockDate: new Date('2027-01-15T00:00:00Z'),
        unlockDateStr: '15 Ocak 2027',
        vesting: 'İlk %50 açılış, ardından 30 günde bir 500.000 TAI',
        color: '#22c55e'
    },
    {
        id: 2,
        amount: 8_000_000,
        pct: 32.0,
        address: 'EQDZLpOUQHOF1C6ekwMl3ERhl-j--r3zprppGtgm287K-6sc',
        unlockDate: new Date('2029-01-17T00:00:00Z'),
        unlockDateStr: '17 Ocak 2029',
        vesting: 'İlk %50 açılış, ardından 50 günde bir 250.000 TAI',
        color: '#3b82f6'
    },
    {
        id: 3,
        amount: 4_100_000,
        pct: 16.4,
        address: 'EQDi4tBlzXtLMXQA1OVOZfKVwLiGoM-tU0rNBVc8e4rHt3co',
        unlockDate: new Date('2027-02-20T00:00:00Z'),
        unlockDateStr: '20 Şubat 2027',
        vesting: '3 periyot × 7 günlük döngü',
        color: '#a855f7'
    }
]

// Kurucu Cüzdanları (Blokzincirde 500.000 + 500.000 TAI olarak doğrulanmıştır)
const FOUNDER_WALLETS = [
    {
        id: 1,
        title: 'Kurucu Cüzdanı 1',
        titleEn: 'Founder Wallet 1',
        amount: 500_000,
        pct: 2.0,
        address: 'UQBaV1KUbR2apZzROevRo53NRgyOetrTJSu92cKhgY8qqA-l'
    },
    {
        id: 2,
        title: 'Kurucu Cüzdanı 2',
        titleEn: 'Founder Wallet 2',
        amount: 500_000,
        pct: 2.0,
        address: 'UQBX8d1RPOoTK-_DY-gNcd1_JvVNUZgZ1TiKof_1s8CTS_Il'
    }
]

// Likidite ve Staking Havuzları
const POOLS = {
    stonfiLp: {
        name: 'STON.fi GRAM-TAI LP Token',
        address: 'EQCGEHrBuuoKVJ_0LqQy38F-c-pN-Jrz0M_ASdCtJxZL74nS',
        raw: '0:86107ac1baea0a549ff42ea432dfc17e73ea4df89af3d0cfc049d0ad27164bef',
        supply: '7,219,957 LP',
        dexUrl: 'https://app.ston.fi/pools/EQCGEHrBuuoKVJ_0LqQy38F-c-pN-Jrz0M_ASdCtJxZL74nS'
    },
    stonfiRouter: {
        name: 'STON.fi DEX Router v2 (Aktif Havuz)',
        address: 'EQCiypoBWNIEPlarBp04UePyEj5zH0ZDHxuRNqJ1WQx3FCY-',
        amount: '~552,000 TAI'
    },
    jvaultStaking: {
        name: 'JVault V2 Staking Havuzu',
        address: 'EQB55_FDUQE9e2RFjnztcQpb_0u8yM70V_AmZxGOtrZ61rnU',
        poolId: 'TASTEAI',
        rewards: '100,000 TAI',
        periods: '14g (x1), 30g (x1.5), 90g (x2.5), 120g (x4)',
        url: 'https://jvault.xyz/staking/v2/stake/TASTEAI'
    }
}

const ALLOCATION = [
    { key: 'locked', labelTr: 'JVault Kilitli', labelEn: 'JVault Locked', amount: 22_100_000, pct: 88.4, color: '#22c55e', icon: '🔒' },
    { key: 'lp', labelTr: 'Likidite Havuzu', labelEn: 'Liquidity Pool', amount: 1_600_000, pct: 6.4, color: '#3b82f6', icon: '💧' },
    { key: 'founder', labelTr: 'Kurucu (Owner)', labelEn: 'Founders', amount: 1_000_000, pct: 4.0, color: '#f59e0b', icon: '👑' },
    { key: 'ops', labelTr: 'Operasyon & Masraf', labelEn: 'Operations', amount: 250_000, pct: 1.0, color: '#8b5cf6', icon: '💼' },
    { key: 'rewards', labelTr: 'Airdrop & Ödül', labelEn: 'Airdrop / Rewards', amount: 50_000, pct: 0.2, color: '#ec4899', icon: '🎁' },
]

// ─── Geri Sayım Yardımcısı ──────────────────────────────────────────────
function useCountdown(targetDate: Date) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        const update = () => {
            const diff = targetDate.getTime() - Date.now()
            if (diff <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
                return
            }
            const days = Math.floor(diff / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
            const minutes = Math.floor((diff / (1000 * 60)) % 60)
            const seconds = Math.floor((diff / 1000) % 60)
            setTimeLeft({ days, hours, minutes, seconds })
        }
        update()
        const timer = setInterval(update, 1000)
        return () => clearInterval(timer)
    }, [targetDate])

    return timeLeft
}

function CountdownBadge({ targetDate }: { targetDate: Date }) {
    const t = useCountdown(targetDate)
    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(0, 0, 0, 0.45)',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            borderRadius: '10px',
            padding: '4px 8px',
            fontSize: '11px',
            fontFamily: 'monospace',
            color: '#fbbf24',
            fontWeight: 800
        }}>
            <Clock size={12} color="#f59e0b" />
            <span>{t.days}g {t.hours}sa {t.minutes}dk {t.seconds}s</span>
        </div>
    )
}

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

            <text x={cx} y={cy - 6} textAnchor="middle" fill="#f59e0b" fontSize="22" fontWeight="900">
                25M
            </text>
            <text x={cx} y={cy + 12} textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="700">
                TAI ARZ
            </text>
            {active !== null && (
                <text x={cx} y={cy + 30} textAnchor="middle" fill={ALLOCATION[active].color} fontSize="13" fontWeight="900">
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
    const [holders, setHolders] = useState<number>(574)
    const [tab, setTab] = useState<'allocation' | 'locks' | 'founders' | 'liquidity'>('allocation')
    const [copiedKey, setCopiedKey] = useState<string | null>(null)

    useEffect(() => {
        fetch(`https://tonapi.io/v2/jettons/${JETTON_MASTER}`)
            .then(r => r.json())
            .then(d => { if (d.holders_count) setHolders(d.holders_count) })
            .catch(() => {})
    }, [])

    const copyText = (key: string, text: string) => {
        navigator.clipboard.writeText(text)
        setCopiedKey(key)
        setTimeout(() => setCopiedKey(null), 2000)
    }

    const openLink = (url: string) => {
        if (window.Telegram?.WebApp) window.Telegram.WebApp.openLink(url)
        else window.open(url, '_blank')
    }

    return (
        <div style={{ paddingBottom: '24px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 0 14px rgba(245, 158, 11, 0.4)'
                }}>
                    <PieChart size={20} color="#000" />
                </div>
                <div>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#fff' }}>
                        {isTr ? 'TOKEN DAĞILIMI & ARZ' : 'TOKEN ALLOCATION'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {isTr ? `${holders.toLocaleString()} Cüzdan Sahibi • Blokzincir Doğrulamalı` : `${holders.toLocaleString()} Holders • On-Chain Verified`}
                    </div>
                </div>
                <div style={{
                    marginLeft: 'auto',
                    background: 'rgba(34, 197, 94, 0.15)',
                    border: '1px solid rgba(34, 197, 94, 0.35)',
                    borderRadius: '10px',
                    padding: '5px 10px',
                    fontSize: '11px',
                    color: '#22c55e',
                    fontWeight: 900
                }}>
                    25M TAI
                </div>
            </div>

            {/* 4 Sekme Çubuğu */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: '14px',
                padding: '4px',
                marginBottom: '16px',
                gap: '4px',
                border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
                {[
                    { id: 'allocation', label: isTr ? 'Dağılım' : 'Chart', icon: '🍩' },
                    { id: 'locks', label: isTr ? 'Kilitler' : 'Locks', icon: '🔒' },
                    { id: 'founders', label: isTr ? 'Kurucu' : 'Founders', icon: '👑' },
                    { id: 'liquidity', label: isTr ? 'Havuzlar' : 'Pools', icon: '💧' },
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id as any)}
                        style={{
                            padding: '8px 4px',
                            borderRadius: '10px',
                            border: 'none',
                            background: tab === t.id ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                            color: tab === t.id ? '#000' : '#94a3b8',
                            fontSize: '11px',
                            fontWeight: 900,
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '2px',
                            transition: 'all 0.2s'
                        }}
                    >
                        <span>{t.icon}</span>
                        <span>{t.label}</span>
                    </button>
                ))}
            </div>

            {/* ── TAB 1: DAĞILIM (DONUT) ── */}
            {tab === 'allocation' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                        <DonutChart active={active} onSliceClick={i => setActive(active === i ? null : i)} />
                    </div>

                    {/* Active slice card */}
                    {active !== null && (
                        <motion.div
                            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                            style={{
                                background: `${ALLOCATION[active].color}14`,
                                border: `1px solid ${ALLOCATION[active].color}40`,
                                borderRadius: '14px', padding: '12px 16px', marginBottom: '14px',
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}
                        >
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 900, color: '#fff' }}>
                                    {ALLOCATION[active].icon} {isTr ? ALLOCATION[active].labelTr : ALLOCATION[active].labelEn}
                                </div>
                                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                                    {ALLOCATION[active].amount.toLocaleString()} TAI
                                </div>
                            </div>
                            <div style={{ fontSize: '20px', fontWeight: 900, color: ALLOCATION[active].color }}>
                                {ALLOCATION[active].pct}%
                            </div>
                        </motion.div>
                    )}

                    {/* Legend */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                        {ALLOCATION.map((seg, i) => (
                            <motion.div
                                key={seg.key}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setActive(active === i ? null : i)}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    background: active === i ? `${seg.color}15` : 'rgba(255,255,255,0.03)',
                                    border: `1px solid ${active === i ? seg.color : 'rgba(255,255,255,0.07)'}`,
                                    borderRadius: '12px', padding: '10px 14px', cursor: 'pointer',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: seg.color, boxShadow: `0 0 6px ${seg.color}` }} />
                                    <div>
                                        <div style={{ fontSize: '12px', color: '#fff', fontWeight: 800 }}>
                                            {seg.icon} {isTr ? seg.labelTr : seg.labelEn}
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#64748b' }}>
                                            {seg.amount.toLocaleString()} TAI
                                        </div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '14px', color: seg.color, fontWeight: 900 }}>
                                    {seg.pct}%
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* ── TAB 2: JVAULT KİLİTLERİ (CANLI GERİ SAYIM + ON-CHAIN PROOF) ── */}
            {tab === 'locks' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(15, 23, 42, 0.7))',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        borderRadius: '16px', padding: '14px', marginBottom: '14px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <ShieldCheck size={18} color="#22c55e" />
                            <span style={{ fontSize: '13px', fontWeight: 900, color: '#fff' }}>
                                {isTr ? 'Toplam Kilitli: 22,100,000 TAI (%88.4)' : 'Total Locked: 22,100,000 TAI (88.4%)'}
                            </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.4 }}>
                            {isTr
                                ? 'Arzın %88.4\'ü JVault protokolünde akıllı sözleşme ile on-chain kilitlenmiştir. Kimse bu tarihlerden önce çekemez.'
                                : '88.4% of total supply is locked on-chain in JVault protocol. Cannot be withdrawn before release dates.'}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {LOCKS.map(lock => (
                            <div key={lock.id} style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: `1px solid ${lock.color}40`,
                                borderRadius: '16px',
                                padding: '14px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Lock size={15} color={lock.color} />
                                        <span style={{ fontSize: '13px', fontWeight: 900, color: '#fff' }}>
                                            Kilit {lock.id} — {lock.amount.toLocaleString()} TAI ({lock.pct}%)
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '10px', background: `${lock.color}20`, color: lock.color, padding: '3px 8px', borderRadius: '6px', fontWeight: 900 }}>
                                        NFT #{lock.id}
                                    </span>
                                </div>

                                {/* Geri sayım ve tarih */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: '10px' }}>
                                    <div>
                                        <div style={{ fontSize: '10px', color: '#64748b' }}>Açılış Tarihi</div>
                                        <div style={{ fontSize: '12px', fontWeight: 800, color: '#fff' }}>🔓 {lock.unlockDateStr}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '9px', color: '#64748b', textAlign: 'right', marginBottom: '2px' }}>Kalan Süre</div>
                                        <CountdownBadge targetDate={lock.unlockDate} />
                                    </div>
                                </div>

                                <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                                    📋 <strong>Vesting:</strong> {lock.vesting}
                                </div>

                                {/* Adres & Linkler */}
                                <div style={{
                                    fontSize: '9px', color: '#64748b', fontFamily: 'monospace',
                                    wordBreak: 'break-all', background: 'rgba(0,0,0,0.2)', padding: '6px 8px', borderRadius: '8px'
                                }}>
                                    {lock.address}
                                </div>

                                <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
                                    <button
                                        onClick={() => copyText(`lock_${lock.id}`, lock.address)}
                                        style={{
                                            flex: 1, padding: '7px 0', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                                            background: 'rgba(255,255,255,0.05)', color: copiedKey === `lock_${lock.id}` ? '#10b981' : '#cbd5e1',
                                            fontSize: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                                        }}
                                    >
                                        {copiedKey === `lock_${lock.id}` ? <Check size={12} /> : <Copy size={12} />}
                                        <span>{copiedKey === `lock_${lock.id}` ? 'Kopyalandı' : 'Adresi Kopyala'}</span>
                                    </button>

                                    <button
                                        onClick={() => openLink(`https://tonscan.org/nft/${lock.address}`)}
                                        style={{
                                            flex: 1, padding: '7px 0', borderRadius: '8px', border: 'none',
                                            background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa',
                                            fontSize: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                                        }}
                                    >
                                        <span>Tonscan</span>
                                        <ExternalLink size={11} />
                                    </button>

                                    <button
                                        onClick={() => openLink(`https://tonviewer.com/${lock.address}`)}
                                        style={{
                                            flex: 1, padding: '7px 0', borderRadius: '8px', border: 'none',
                                            background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80',
                                            fontSize: '10px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                                        }}
                                    >
                                        <span>Tonviewer</span>
                                        <ExternalLink size={11} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* ── TAB 3: KURUCU CÜZDANLARI (ON-CHAIN DOĞRULANMIŞ) ── */}
            {tab === 'founders' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(15, 23, 42, 0.7))',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        borderRadius: '16px', padding: '14px', marginBottom: '14px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                            <Crown size={18} color="#f59e0b" />
                            <span style={{ fontSize: '13px', fontWeight: 900, color: '#fff' }}>
                                Kurucu / Owner Payı: 1,000,000 TAI (%4.0)
                            </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.4 }}>
                            Proje kurucusunun elinde tuttuğu TAI tokenlar 2 resmi cüzdanda bölünmüş halde muhafaza edilmektedir. Blokzincir üzerinden her an doğrulanabilir.
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {FOUNDER_WALLETS.map(w => (
                            <div key={w.id} style={{
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(245, 158, 11, 0.35)',
                                borderRadius: '16px',
                                padding: '14px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Crown size={16} color="#f59e0b" />
                                        <span style={{ fontSize: '13px', fontWeight: 900, color: '#fff' }}>
                                            {isTr ? w.title : w.titleEn}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '10px', background: '#22c55e', color: '#000', padding: '2px 8px', borderRadius: '6px', fontWeight: 900 }}>
                                        ON-CHAIN DOĞRULANDI
                                    </span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '10px' }}>
                                    <div>
                                        <div style={{ fontSize: '10px', color: '#64748b' }}>Doğrulanmış Bakiye</div>
                                        <div style={{ fontSize: '18px', fontWeight: 900, color: '#f59e0b' }}>
                                            {w.amount.toLocaleString()} TAI
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#94a3b8' }}>
                                        %{w.pct.toFixed(1)} Arz Payı
                                    </div>
                                </div>

                                <div style={{
                                    fontSize: '9px', color: '#94a3b8', fontFamily: 'monospace',
                                    wordBreak: 'break-all', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '8px'
                                }}>
                                    {w.address}
                                </div>

                                <div style={{ display: 'flex', gap: '8px', paddingTop: '4px' }}>
                                    <button
                                        onClick={() => copyText(`founder_${w.id}`, w.address)}
                                        style={{
                                            flex: 1, padding: '9px 0', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)',
                                            background: 'rgba(255,255,255,0.05)', color: copiedKey === `founder_${w.id}` ? '#10b981' : '#cbd5e1',
                                            fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                                        }}
                                    >
                                        {copiedKey === `founder_${w.id}` ? <Check size={13} /> : <Copy size={13} />}
                                        <span>{copiedKey === `founder_${w.id}` ? 'Kopyalandı' : 'Adresi Kopyala'}</span>
                                    </button>

                                    <button
                                        onClick={() => openLink(`https://tonviewer.com/${w.address}`)}
                                        style={{
                                            flex: 1, padding: '9px 0', borderRadius: '10px', border: 'none',
                                            background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000',
                                            fontSize: '11px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                                        }}
                                    >
                                        <span>Tonviewer'da İncele</span>
                                        <ExternalLink size={13} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* ── TAB 4: LİKİDİTE & STAKING HAVUZLARI ── */}
            {tab === 'liquidity' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {/* STON.fi LP */}
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(59, 130, 246, 0.35)',
                            borderRadius: '16px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Droplets size={16} color="#3b82f6" />
                                    <span style={{ fontSize: '13px', fontWeight: 900, color: '#fff' }}>
                                        {POOLS.stonfiLp.name}
                                    </span>
                                </div>
                                <span style={{ fontSize: '10px', background: 'rgba(59,130,246,0.2)', color: '#60a5fa', padding: '2px 8px', borderRadius: '6px', fontWeight: 900 }}>
                                    DEX HAVUZU
                                </span>
                            </div>

                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                                📊 STON.fi üzerinde GRAM-TAI işlem çifti için oluşturulmuş resmi LP Token kontratı.
                            </div>

                            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '8px 10px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>Toplam LP Arzı:</span>
                                <span style={{ fontSize: '11px', fontWeight: 900, color: '#60a5fa' }}>{POOLS.stonfiLp.supply}</span>
                            </div>

                            <div style={{ fontSize: '9px', color: '#64748b', fontFamily: 'monospace', wordBreak: 'break-all', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '6px' }}>
                                {POOLS.stonfiLp.address}
                            </div>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => copyText('lp_token', POOLS.stonfiLp.address)}
                                    style={{
                                        flex: 1, padding: '8px 0', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                                        background: 'rgba(255,255,255,0.05)', color: copiedKey === 'lp_token' ? '#10b981' : '#cbd5e1',
                                        fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                                    }}
                                >
                                    {copiedKey === 'lp_token' ? <Check size={12} /> : <Copy size={12} />}
                                    <span>{copiedKey === 'lp_token' ? 'Kopyalandı' : 'Kopyala'}</span>
                                </button>
                                <button
                                    onClick={() => openLink(POOLS.stonfiLp.dexUrl)}
                                    style={{
                                        flex: 1, padding: '8px 0', borderRadius: '8px', border: 'none',
                                        background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff',
                                        fontSize: '11px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                                    }}
                                >
                                    <span>STON.fi'de Gör</span>
                                    <ExternalLink size={12} />
                                </button>
                            </div>
                        </div>

                        {/* STON.fi Router v2 */}
                        <div style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(16, 185, 129, 0.35)',
                            borderRadius: '16px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', fontWeight: 900, color: '#fff' }}>
                                    {POOLS.stonfiRouter.name}
                                </span>
                                <span style={{ fontSize: '11px', fontWeight: 900, color: '#10b981' }}>
                                    {POOLS.stonfiRouter.amount}
                                </span>
                            </div>
                            <div style={{ fontSize: '9px', color: '#64748b', fontFamily: 'monospace', wordBreak: 'break-all', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '6px' }}>
                                {POOLS.stonfiRouter.address}
                            </div>
                            <button
                                onClick={() => openLink(`https://tonviewer.com/${POOLS.stonfiRouter.address}`)}
                                style={{
                                    width: '100%', padding: '8px 0', borderRadius: '8px', border: 'none',
                                    background: 'rgba(16, 185, 129, 0.2)', color: '#34d399',
                                    fontSize: '11px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                                }}
                            >
                                <span>Tonviewer'da İncele</span>
                                <ExternalLink size={12} />
                            </button>
                        </div>

                        {/* JVault Staking Pool */}
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12), rgba(15, 23, 42, 0.7))',
                            border: '1px solid rgba(139, 92, 246, 0.4)',
                            borderRadius: '16px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '13px', fontWeight: 900, color: '#fff' }}>
                                    🔮 {POOLS.jvaultStaking.name}
                                </span>
                                <span style={{ fontSize: '10px', background: '#22c55e', color: '#000', padding: '2px 8px', borderRadius: '6px', fontWeight: 900 }}>
                                    CANLI
                                </span>
                            </div>

                            <div style={{ fontSize: '11px', color: '#c4b5fd' }}>
                                Toplam Ödül Havuzu: <strong>{POOLS.jvaultStaking.rewards}</strong> (Sezon 1)
                            </div>
                            <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                                Dönemler: {POOLS.jvaultStaking.periods}
                            </div>

                            <div style={{ fontSize: '9px', color: '#64748b', fontFamily: 'monospace', wordBreak: 'break-all', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '6px' }}>
                                {POOLS.jvaultStaking.address}
                            </div>

                            <button
                                onClick={() => openLink(POOLS.jvaultStaking.url)}
                                style={{
                                    width: '100%', padding: '10px 0', borderRadius: '10px', border: 'none',
                                    background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', color: '#fff',
                                    fontSize: '12px', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                    boxShadow: '0 4px 14px rgba(139, 92, 246, 0.4)'
                                }}
                            >
                                <span>JVault'ta Stake Et</span>
                                <ExternalLink size={13} />
                            </button>
                        </div>

                        {/* Token Master Contract */}
                        <div style={{
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '14px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '6px'
                        }}>
                            <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 800 }}>
                                📋 JETTON MASTER SÖZLEŞMESİ (TAI)
                            </div>
                            <div style={{ fontSize: '9px', color: '#94a3b8', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                {JETTON_MASTER}
                            </div>
                            <button
                                onClick={() => openLink(`https://tonviewer.com/${JETTON_MASTER}`)}
                                style={{
                                    padding: '7px 0', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'transparent', color: '#cbd5e1', fontSize: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                                }}
                            >
                                <span>Tonviewer'da Görüntüle</span>
                                <ExternalLink size={11} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '10px', color: '#475569' }}>
                📡 Tüm veriler TON Blokzinciri ve akıllı sözleşmelerden anlık olarak doğrulanabilir.
            </div>
        </div>
    )
}
