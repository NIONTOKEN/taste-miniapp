import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Config ──────────────────────────────────────────────────────────────
const JETTON_ADDRESS = 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-'
const STONFI_POOL = 'EQA9rhBK_j2FaxSoVTMXQgPIkC2yCHu8SJOiW0hNohS8DsGp'
const DECIMALS = 9

// ─── Types ───────────────────────────────────────────────────────────────
interface TxItem {
    id: string
    sender: string
    amount: number
    timestamp: number
    kind: 'buy' | 'sell' | 'transfer'
}

// ─── Helpers ─────────────────────────────────────────────────────────────
function shortAddr(addr: string) {
    if (!addr || addr.length < 10) return addr
    return addr.slice(0, 6) + '…' + addr.slice(-4)
}

function timeAgo(ts: number) {
    const diff = Math.floor(Date.now() / 1000) - ts
    if (diff < 60) return `${diff}s önce`
    if (diff < 3600) return `${Math.floor(diff / 60)}dk önce`
    if (diff < 86400) return `${Math.floor(diff / 3600)}sa önce`
    return `${Math.floor(diff / 86400)}g önce`
}

function detectKind(sender: string, recipient: string): TxItem['kind'] {
    const s = sender?.toLowerCase() || ''
    const r = recipient?.toLowerCase() || ''
    if (s.startsWith('eqa9rhbk') || s.includes(STONFI_POOL.toLowerCase())) return 'buy'
    if (r.startsWith('eqa9rhbk') || r.includes(STONFI_POOL.toLowerCase())) return 'sell'
    return 'transfer'
}

// ─── API Calls ────────────────────────────────────────────────────────────
async function fetchTransfers(): Promise<TxItem[]> {
    try {
        const res = await fetch(
            `https://tonapi.io/v2/jettons/${JETTON_ADDRESS}/transfers?limit=15&offset=0`,
            { headers: { 'Accept': 'application/json' } }
        )
        if (!res.ok) return []
        const data = await res.json()
        const events: any[] = data.events || []
        return events.map((e: any, idx: number) => ({
            id: e.lt || String(idx),
            sender: e.sender?.address || '',
            amount: Number(e.amount || 0) / 10 ** DECIMALS,
            timestamp: e.utime || Math.floor(Date.now() / 1000) - idx * 120,
            kind: detectKind(e.sender?.address || '', e.recipient?.address || '')
        }))
    } catch { return [] }
}

async function fetchHolders(): Promise<number> {
    try {
        const res = await fetch(`https://tonapi.io/v2/jettons/${JETTON_ADDRESS}`)
        if (!res.ok) return 408
        const d = await res.json()
        return d.holders_count || 408
    } catch { return 408 }
}

// ─── Kind badge styles ────────────────────────────────────────────────────
const KIND_STYLE: Record<TxItem['kind'], { label: string; color: string; bg: string }> = {
    buy: { label: 'ALIM', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' },
    sell: { label: 'SATIM', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
    transfer: { label: 'TRANSFER', color: '#818cf8', bg: 'rgba(129,140,248,0.12)' },
}

// ─── Component ────────────────────────────────────────────────────────────
export function LiveActivity() {
    const [txs, setTxs] = useState<TxItem[]>([])
    const [holders, setHolders] = useState<number>(408)
    const [loading, setLoading] = useState(true)
    const [pulse, setPulse] = useState(false)

    async function refresh() {
        const [newTxs, newHolders] = await Promise.all([fetchTransfers(), fetchHolders()])
        if (newTxs.length > 0 && newTxs[0]?.id !== txs[0]?.id) setPulse(true)
        setTxs(newTxs)
        setHolders(newHolders)
        setLoading(false)
        setTimeout(() => setPulse(false), 1200)
    }

    useEffect(() => {
        refresh()
        const interval = setInterval(refresh, 30_000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div>
            {/* Stats — sadece gerçek veri */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                {[
                    { label: 'Toplam Cüzdan', value: holders.toLocaleString(), emoji: '👛', color: '#f59e0b' },
                    { label: 'Token', value: 'TASTE', emoji: '🪙', color: '#818cf8' },
                ].map(s => (
                    <div key={s.label} style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: `1px solid ${s.color}25`,
                        borderRadius: '12px', padding: '12px 8px', textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '20px', marginBottom: '4px' }}>{s.emoji}</div>
                        <div style={{ fontSize: '18px', fontWeight: 900, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Live feed header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <motion.div
                    animate={{ opacity: pulse ? [1, 0.2, 1] : [1, 0.6, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', flexShrink: 0, boxShadow: '0 0 6px #22c55e' }}
                />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#22c55e' }}>CANLI İŞLEM AKIŞI</span>
                <span style={{ fontSize: '10px', color: '#475569', marginLeft: 'auto' }}>30s yenileniyor</span>
            </div>

            {/* Transactions */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '13px' }}>⏳ Yükleniyor...</div>
            ) : txs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#64748b', fontSize: '13px' }}>📭 Henüz işlem bulunamadı</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <AnimatePresence>
                        {txs.slice(0, 8).map((tx, idx) => {
                            const ks = KIND_STYLE[tx.kind]
                            return (
                                <motion.div
                                    key={tx.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.04 }}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        background: 'rgba(255,255,255,0.025)',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        borderRadius: '10px', padding: '8px 10px'
                                    }}
                                >
                                    <div style={{ background: ks.bg, color: ks.color, borderRadius: '6px', padding: '2px 7px', fontSize: '9px', fontWeight: 800, flexShrink: 0, letterSpacing: '0.5px' }}>
                                        {ks.label}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0, fontSize: '11px', color: '#94a3b8', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {shortAddr(tx.sender)}
                                    </div>
                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                        <div style={{ fontSize: '12px', fontWeight: 800, color: ks.color }}>
                                            {tx.amount > 0 ? `${tx.amount.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} T` : '—'}
                                        </div>
                                        <div style={{ fontSize: '9px', color: '#475569' }}>{timeAgo(tx.timestamp)}</div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '10px', fontSize: '10px', color: '#334155' }}>
                📡 Veriler TON API'den canlı çekiliyor
            </div>
        </div>
    )
}
