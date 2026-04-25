import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getOTCOrders, updateOTCOrderStatus, SupaOTCOrder } from '../services/supabase'
import { WalletTransfer } from './WalletTransfer'

const ADMIN_TG_ID = '1505452121'

export const QuickBuyAdmin: React.FC = () => {
    const [orders, setOrders] = useState<SupaOTCOrder[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [filter, setFilter] = useState<'pending' | 'completed' | 'rejected' | 'all'>('pending')
    const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    const fetchOrders = async () => {
        setIsLoading(true)
        const data = await getOTCOrders()
        setOrders(data)
        setIsLoading(false)
    }

    useEffect(() => {
        fetchOrders()
        // Auto-refresh every 30s
        const interval = setInterval(fetchOrders, 30000)
        return () => clearInterval(interval)
    }, [])

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard?.writeText(text).then(() => {
            alert(`${label} kopyalandı:\n${text}`)
        }).catch(() => {
            const el = document.createElement('textarea')
            el.value = text
            document.body.appendChild(el)
            el.select()
            document.execCommand('copy')
            document.body.removeChild(el)
            alert(`${label} kopyalandı:\n${text}`)
        })
    }

    const notifyUser = async (order: SupaOTCOrder, status: 'completed' | 'rejected') => {
        const msg = status === 'completed'
            ? `✅ Siparişiniz onaylandı!\n\n💎 ${Number(order.amount_taste).toLocaleString()} TASTE cüzdanınıza gönderildi.\n\n🔑 Referans: ${order.reference_code}`
            : `❌ Siparişiniz reddedildi.\n\n🔑 Referans: ${order.reference_code}\n\nSorun için @taste_launch_bot'a yazın.`

        try {
            await fetch('/.netlify/functions/bot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'admin_notify',
                    chat_id: order.user_id,
                    message: msg
                })
            })
        } catch (e) {
            console.error('Notification send failed', e)
        }
    }

    const handleApprove = async (order: SupaOTCOrder) => {
        if (!confirm(`✅ Onaylıyorsun:\n${order.reference_code}\n${order.amount_try} TL → ${Number(order.amount_taste).toLocaleString()} TASTE\n\nTokenları gönderdin mi?`)) return
        setActionLoading(order.id)
        const ok = await updateOTCOrderStatus(order.id, 'completed', undefined, 'Admin onayladı')
        if (ok) {
            await notifyUser(order, 'completed')
            await fetchOrders()
        } else {
            alert('Güncelleme başarısız kanka!')
        }
        setActionLoading(null)
    }

    const handleReject = async (order: SupaOTCOrder) => {
        if (!confirm(`❌ Reddediyorsun:\n${order.reference_code}`)) return
        setActionLoading(order.id)
        const ok = await updateOTCOrderStatus(order.id, 'rejected', undefined, 'Admin reddetti')
        if (ok) {
            await notifyUser(order, 'rejected')
            await fetchOrders()
        } else {
            alert('Güncelleme başarısız kanka!')
        }
        setActionLoading(null)
    }

    const filteredOrders = orders.filter(o =>
        filter === 'all' ? true : o.status === filter
    )

    const pendingCount = orders.filter(o => o.status === 'pending').length
    const totalTL = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.amount_try, 0)
    const totalTaste = orders.filter(o => o.status === 'completed').reduce((s, o) => s + Number(o.amount_taste), 0)

    return (
        <div style={{ padding: '16px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#f59e0b' }}>👑 OTC Admin</h2>
                    <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>Fatih Kaya · Ödeme Yönetim Paneli</p>
                </div>
                <button
                    onClick={fetchOrders}
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 14px', borderRadius: '12px', fontSize: '12px', cursor: 'pointer', fontWeight: 700 }}
                >
                    🔄 Yenile
                </button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
                {[
                    { label: 'Bekleyen', value: pendingCount, color: '#f59e0b', emoji: '⏳' },
                    { label: 'Toplam TL', value: `${totalTL.toLocaleString()} ₺`, color: '#22c55e', emoji: '💰' },
                    { label: 'Dağıtılan', value: `${(totalTaste / 1000).toFixed(0)}K`, color: '#818cf8', emoji: '💎' },
                ].map(s => (
                    <div key={s.label} style={{ background: `${s.color}15`, border: `1px solid ${s.color}30`, borderRadius: '14px', padding: '12px 10px', textAlign: 'center' }}>
                        <div style={{ fontSize: '18px', marginBottom: '4px' }}>{s.emoji}</div>
                        <div style={{ fontSize: '14px', fontWeight: 900, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
                {(['pending', 'completed', 'rejected', 'all'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            border: 'none',
                            background: filter === f
                                ? (f === 'pending' ? '#f59e0b' : f === 'completed' ? '#22c55e' : f === 'rejected' ? '#ef4444' : '#6366f1')
                                : 'rgba(255,255,255,0.06)',
                            color: filter === f ? '#000' : '#94a3b8',
                            transition: 'all 0.2s'
                        }}
                    >
                        {f === 'pending' ? `⏳ Bekleyen (${pendingCount})` : f === 'completed' ? '✅ Onaylanan' : f === 'rejected' ? '❌ Reddedilen' : '📋 Tümü'}
                    </button>
                ))}
            </div>

            {/* Orders List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '40px', opacity: 0.5 }}>Yükleniyor...</div>
                ) : filteredOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', opacity: 0.4, fontSize: '14px' }}>
                        {filter === 'pending' ? '🎉 Bekleyen sipariş yok!' : 'Sipariş bulunamadı.'}
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <motion.div
                            key={order.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                background: order.status === 'pending'
                                    ? 'linear-gradient(135deg, rgba(245,159,11,0.08), rgba(0,0,0,0.3))'
                                    : 'rgba(255,255,255,0.03)',
                                border: `1px solid ${order.status === 'pending' ? 'rgba(245,159,11,0.3)' : order.status === 'completed' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
                                borderRadius: '18px',
                                padding: '16px',
                            }}
                        >
                            {/* Order Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                                <div>
                                    <div style={{ fontSize: '11px', fontFamily: 'monospace', color: '#f59e0b', fontWeight: 700, marginBottom: '4px' }}>
                                        🔑 {order.reference_code}
                                    </div>
                                    <div style={{ fontSize: '22px', fontWeight: 900, lineHeight: 1 }}>
                                        {order.amount_try.toLocaleString()} <span style={{ fontSize: '14px', color: '#22c55e' }}>TL</span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#818cf8', marginTop: '2px' }}>
                                        → ~{Number(order.amount_taste).toLocaleString()} TASTE
                                    </div>
                                </div>
                                <div style={{
                                    padding: '4px 10px',
                                    borderRadius: '8px',
                                    fontSize: '10px',
                                    fontWeight: 900,
                                    background: order.status === 'pending' ? 'rgba(245,159,11,0.2)' : order.status === 'completed' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
                                    color: order.status === 'pending' ? '#f59e0b' : order.status === 'completed' ? '#22c55e' : '#ef4444'
                                }}>
                                    {order.status === 'pending' ? '⏳ BEKLEYEN' : order.status === 'completed' ? '✅ ONAYLANDI' : '❌ REDDEDİLDİ'}
                                </div>
                            </div>

                            {/* Order Details with Tap-to-Copy */}
                            <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '12px', marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {/* Gönderilecek TASTE - Kopyalanabilir */}
                                <div 
                                    onClick={() => copyToClipboard(Math.round(order.amount_taste).toString(), 'TASTE Miktarı')}
                                    style={{ background: 'rgba(129,140,248,0.1)', border: '1px solid rgba(129,140,248,0.3)', padding: '12px', borderRadius: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <div>
                                        <div style={{ fontSize: '10px', color: '#818cf8', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>💎 Gönderilecek TASTE (Tikla Kopyala)</div>
                                        <div style={{ fontSize: '20px', fontWeight: 900, color: '#c7d2fe' }}>{Math.round(order.amount_taste).toLocaleString()}</div>
                                    </div>
                                    <span style={{ fontSize: '18px' }}>📋</span>
                                </div>

                                {/* Cüzdan Adresi - Kopyalanabilir */}
                                <div 
                                    onClick={() => copyToClipboard(order.wallet_address, 'Cüzdan Adresi')}
                                    style={{ background: 'rgba(245,159,11,0.1)', border: '1px solid rgba(245,159,11,0.3)', padding: '12px', borderRadius: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <div style={{ maxWidth: '85%' }}>
                                        <div style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>💳 Alıcı Cüzdan (Tikla Kopyala)</div>
                                        <div style={{ fontSize: '12px', fontFamily: 'monospace', color: '#fde68a', wordBreak: 'break-all', lineHeight: 1.4 }}>{order.wallet_address}</div>
                                    </div>
                                    <span style={{ fontSize: '18px' }}>📋</span>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '6px' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>👤 TG ID:</span>
                                    <span style={{ fontWeight: 700 }}>{order.user_id}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                                    <span style={{ color: 'var(--text-muted)' }}>📅 Tarih:</span>
                                    <span>{new Date(order.created_at).toLocaleString('tr-TR')}</span>
                                </div>
                                {order.receipt_url && (
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px' }}>
                                        <span style={{ color: 'var(--text-muted)' }}>🧾 Dekont:</span>
                                        <button
                                            onClick={() => setSelectedReceipt(order.receipt_url!)}
                                            style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
                                        >
                                            📷 Görüntüle
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons (pending only) */}
                            {order.status === 'pending' && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <motion.button
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handleApprove(order)}
                                        disabled={actionLoading === order.id}
                                        style={{
                                            flex: 1,
                                            padding: '14px',
                                            background: actionLoading === order.id ? '#374151' : 'linear-gradient(135deg, #22c55e, #16a34a)',
                                            border: 'none',
                                            borderRadius: '14px',
                                            color: '#fff',
                                            fontSize: '13px',
                                            fontWeight: 900,
                                            cursor: 'pointer',
                                            boxShadow: '0 4px 15px rgba(34,197,94,0.3)',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {actionLoading === order.id ? '⏳ İşleniyor...' : '✅ ONAYLA & BİLDİR'}
                                    </motion.button>
                                    <motion.button
                                        whileTap={{ scale: 0.97 }}
                                        onClick={() => handleReject(order)}
                                        disabled={actionLoading === order.id}
                                        style={{
                                            padding: '14px 18px',
                                            background: 'rgba(239,68,68,0.15)',
                                            border: '1px solid rgba(239,68,68,0.3)',
                                            borderRadius: '14px',
                                            color: '#ef4444',
                                            fontSize: '13px',
                                            fontWeight: 900,
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        ❌
                                    </motion.button>
                                </div>
                            )}

                            {/* Completed info */}
                            {order.status === 'completed' && (order as any).confirmed_at && (
                                <div style={{ fontSize: '10px', color: '#22c55e', opacity: 0.7, textAlign: 'center', marginTop: '4px' }}>
                                    ✓ Onaylandı: {new Date((order as any).confirmed_at).toLocaleString('tr-TR')}
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>

            {/* Admin Tip */}
            <div style={{ marginTop: '24px', padding: '14px', background: 'rgba(245,159,11,0.08)', border: '1px solid rgba(245,159,11,0.2)', borderRadius: '16px' }}>
                <p style={{ fontSize: '11px', color: '#fbbf24', fontWeight: 700, marginBottom: '6px' }}>💡 İş Akışı:</p>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
                    1️⃣ Banka hesabını kontrol et → Referans koduyla para gelmiş mi? <br />
                    2️⃣ Tonkeeper'dan kullanıcının cüzdanına TASTE gönder <br />
                    3️⃣ ✅ ONAYLA'ya bas → Kullanıcuya otomatik bildirim gider <br />
                    <span style={{ color: '#f59e0b', fontWeight: 800 }}>⚠️ Dipnot: EFT açıklamasında asla "kripto/token" yok!</span>
                </p>
            </div>

            {/* In-App Wallet Transfer */}
            <div style={{ marginTop: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 900, marginBottom: '16px', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                    💳 Hızlı Transfer (Uygulama İçi)
                </h3>
                <WalletTransfer />
            </div>

            {/* Receipt Lightbox */}
            <AnimatePresence>
                {selectedReceipt && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedReceipt(null)}
                        style={{
                            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                            background: 'rgba(0,0,0,0.92)',
                            zIndex: 9999,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px'
                        }}
                    >
                        <img
                            src={selectedReceipt}
                            alt="Dekont"
                            style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}
                        />
                        <button
                            onClick={() => setSelectedReceipt(null)}
                            style={{ marginTop: '20px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', padding: '12px 30px', borderRadius: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
                        >
                            Kapat ✕
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
