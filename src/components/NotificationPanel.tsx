import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell } from 'lucide-react'

const NOTIFICATIONS = [
  { id: 1, emoji: '🎉', title: 'UTYA/TAI Havuzu Açıldı!', body: '4. likidite havuzumuz STON.fi\'de aktif.', time: '2 sa', read: false },
  { id: 2, emoji: '🔔', title: 'TAI Günlük Ödülü', body: 'Bugünkü çark spin ödülünüzü almayı unutmayın!', time: '5 sa', read: false },
  { id: 3, emoji: '📈', title: 'Piyasa Güncellemesi', body: 'TAI/TON çiftinde işlem hacmi arttı.', time: '1 g', read: true },
  { id: 4, emoji: '🤝', title: 'Yeni Ortaklık', body: 'Panoda Şehir ile resmi ortaklık duyuruldu!', time: '2 g', read: true },
  { id: 5, emoji: '⛓️', title: 'Blockchain Güncelleme', body: 'TON ağı güncellemesi tamamlandı.', time: '3 g', read: true },
]

interface NotificationPanelProps {
  onClose: () => void
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState(NOTIFICATIONS)

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })))

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 8900 }}
      />
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        style={{
          position: 'fixed',
          top: 60,
          left: 16,
          right: 16,
          background: 'rgba(10,15,28,0.98)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 22,
          zIndex: 8901,
          overflow: 'hidden',
          maxHeight: '70vh',
          boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
        }}
      >
        {/* Panel Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Bell size={18} color="#f59e0b" />
            <span style={{ fontWeight: 900, fontSize: 16 }}>Bildirimler</span>
            {notifications.filter(n => !n.read).length > 0 && (
              <span style={{ background: '#ef4444', color: '#fff', borderRadius: 20, padding: '2px 7px', fontSize: 11, fontWeight: 800 }}>
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={markAllRead} style={{ background: 'rgba(245,159,11,0.12)', border: '1px solid rgba(245,159,11,0.3)', color: '#f59e0b', borderRadius: 10, padding: '5px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              Tümünü Oku
            </button>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div style={{ overflowY: 'auto', maxHeight: 'calc(70vh - 70px)' }}>
          <AnimatePresence>
            {notifications.map((notif, i) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setNotifications(n => n.map(x => x.id === notif.id ? { ...x, read: true } : x))}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  padding: '16px 20px',
                  borderBottom: i < notifications.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  background: notif.read ? 'transparent' : 'rgba(245,159,11,0.04)',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
              >
                <div style={{ fontSize: 26, flexShrink: 0, marginTop: 2 }}>{notif.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: notif.read ? 600 : 800, color: notif.read ? '#94a3b8' : '#f8fafc' }}>{notif.title}</span>
                    <span style={{ fontSize: 11, color: '#475569', flexShrink: 0, marginLeft: 8 }}>{notif.time}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>{notif.body}</div>
                </div>
                {!notif.read && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', flexShrink: 0, marginTop: 6 }} />
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  )
}
