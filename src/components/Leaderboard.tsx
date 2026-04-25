import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

interface Leader {
    name: string
    value: number
    rank: number
}

// Supabase'den spin_records tablosunu kullanarak top oyuncuları çek
async function fetchLeaders(): Promise<{ balance: Leader[]; spins: Leader[] }> {
    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/spin_records?select=player_id,total_points,total_claimed&order=total_points.desc&limit=50`,
            {
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`,
                },
            }
        )
        if (!res.ok) throw new Error('fetch failed')
        const rows: { player_id: string; total_points: number; total_claimed: number }[] = await res.json()

        // Her player_id için en yüksek total_points kaydını al (deduplicate)
        const seen = new Map<string, { total_points: number; total_claimed: number }>()
        for (const row of rows) {
            const existing = seen.get(row.player_id)
            if (!existing || row.total_points > existing.total_points) {
                seen.set(row.player_id, { total_points: row.total_points, total_claimed: row.total_claimed })
            }
        }

        const sorted = Array.from(seen.entries())
            .sort((a, b) => b[1].total_points - a[1].total_points)
            .slice(0, 5)

        const balanceLeaders: Leader[] = sorted.map(([id, data], i) => ({
            name: maskId(id),
            value: data.total_points,
            rank: i + 1,
        }))

        const spinsSorted = Array.from(seen.entries())
            .sort((a, b) => b[1].total_claimed - a[1].total_claimed)
            .slice(0, 5)

        const spinsLeaders: Leader[] = spinsSorted.map(([id, data], i) => ({
            name: maskId(id),
            value: data.total_claimed,
            rank: i + 1,
        }))

        return { balance: balanceLeaders, spins: spinsLeaders }
    } catch {
        return { balance: [], spins: [] }
    }
}

function maskId(id: string): string {
    if (id.startsWith('wallet_')) {
        const addr = id.replace('wallet_', '')
        return addr.slice(0, 6) + '...' + addr.slice(-4)
    }
    if (id.startsWith('device_')) {
        const uid = id.replace('device_', '')
        return '🎮 ' + uid.slice(0, 6) + '...'
    }
    return id.slice(0, 8) + '...'
}

export function Leaderboard() {
    const { i18n } = useTranslation()
    const isTr = i18n.language?.startsWith('tr')
    const [activeTab, setActiveTab] = useState<'points' | 'claimed'>('points')
    const [leaders, setLeaders] = useState<{ balance: Leader[]; spins: Leader[] }>({ balance: [], spins: [] })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLeaders().then((data) => {
            setLeaders(data)
            setLoading(false)
        })
    }, [])

    const list = activeTab === 'points' ? leaders.balance : leaders.spins

    const medals = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣']

    return (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '6px', textAlign: 'center' }}>🏆 {isTr ? 'Liderlik Tablosu' : 'Leaderboard'}</h3>
            <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                {isTr ? 'Spin çarkından kazanılan puanlar' : 'Points earned from the spin wheel'}
            </p>

            {/* Tabs */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
                <button
                    onClick={() => setActiveTab('points')}
                    style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: activeTab === 'points' ? 'var(--primary)' : 'none', color: activeTab === 'points' ? '#000' : '#fff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    ⭐ {isTr ? 'Puan' : 'Points'}
                </button>
                <button
                    onClick={() => setActiveTab('claimed')}
                    style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: activeTab === 'claimed' ? 'var(--primary)' : 'none', color: activeTab === 'claimed' ? '#000' : '#fff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    🎁 {isTr ? 'Kazanılan TASTE' : 'Earned TASTE'}
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '13px' }}>
                    <div style={{ fontSize: '28px', marginBottom: '8px', animation: 'pulse 1.5s infinite' }}>⏳</div>
                    {isTr ? 'Yükleniyor...' : 'Loading...'}
                </div>
            ) : list.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '13px' }}>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎡</div>
                    {isTr ? 'Henüz veri yok. İlk sen ol!' : 'No data yet. Be the first!'}
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            {list.map((user, idx) => (
                                <div
                                    key={user.name}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '12px',
                                        background: idx === 0 ? 'rgba(245, 159, 11, 0.1)' : 'rgba(255,255,255,0.02)',
                                        borderRadius: '12px',
                                        border: idx === 0 ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)',
                                        marginBottom: '8px',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ fontSize: '20px' }}>{medals[idx] || `${idx + 1}`}</span>
                                        <span style={{ fontSize: '13px', fontWeight: '500', fontFamily: 'monospace' }}>{user.name}</span>
                                    </div>
                                    <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                                        {user.value.toLocaleString()} <span style={{ fontSize: '10px' }}>{activeTab === 'points' ? (isTr ? 'puan' : 'pts') : 'TASTE'}</span>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            )}

            <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '16px' }}>
                {isTr ? "🎁 Her hafta ilk 3'e özel sürpriz ödüller!" : "🎁 Top 3 get special rewards every week!"}
            </p>
        </div>
    )
}
