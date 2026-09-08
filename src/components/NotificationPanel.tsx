import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, CheckCheck } from 'lucide-react'

export interface AppNotification {
  id: number | string;
  emoji: string;
  title: string;
  body: string;
  time: string;
}

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: 1, emoji: '🎉', title: 'UTYA/TAI Havuzu Açıldı!', body: '4. likidite havuzumuz STON.fi\'de aktif.', time: '2 sa' },
  { id: 2, emoji: '🔔', title: 'TAI Günlük Ödülü', body: 'Bugünkü çark spin ödülünüzü almayı unutmayın!', time: '5 sa' },
  { id: 3, emoji: '📈', title: 'Piyasa Güncellemesi', body: 'TAI/TON çiftinde işlem hacmi arttı.', time: '1 g' },
  { id: 4, emoji: '🤝', title: 'Yeni Ortaklık', body: 'Panoda Şehir ile resmi ortaklık duyuruldu!', time: '2 g' },
  { id: 5, emoji: '⛓️', title: 'Blockchain Güncelleme', body: 'TON ağı güncellemesi tamamlandı.', time: '3 g' },
];

export function getAllNotifications(): AppNotification[] {
  try {
    const custom = localStorage.getItem('taste_app_custom_notifications');
    const customList: AppNotification[] = custom ? JSON.parse(custom) : [];
    return [...customList, ...INITIAL_NOTIFICATIONS];
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function addAppNotification(notif: Omit<AppNotification, 'id'>) {
  try {
    const custom = localStorage.getItem('taste_app_custom_notifications');
    const list: AppNotification[] = custom ? JSON.parse(custom) : [];
    const newEntry: AppNotification = {
      ...notif,
      id: Date.now()
    };
    const updated = [newEntry, ...list].slice(0, 30);
    localStorage.setItem('taste_app_custom_notifications', JSON.stringify(updated));
    window.dispatchEvent(new Event('taste_notification_added'));
  } catch (e) {
    console.error('Failed to add notification:', e);
  }
}

export function getUnreadNotificationCount(): number {
  try {
    const all = getAllNotifications();
    const saved = localStorage.getItem('taste_read_notifications');
    const readIds: (number | string)[] = saved ? JSON.parse(saved) : [];
    return all.filter(n => !readIds.includes(n.id)).length;
  } catch {
    return 0;
  }
}

interface NotificationPanelProps {
  onClose: () => void;
  onCountChange?: (count: number) => void;
}

export function NotificationPanel({ onClose, onCountChange }: NotificationPanelProps) {
  const [allNotifs, setAllNotifs] = useState<AppNotification[]>(() => getAllNotifications());
  const [readIds, setReadIds] = useState<(number | string)[]>(() => {
    try {
      const saved = localStorage.getItem('taste_read_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const markAllRead = () => {
    const allIds = allNotifs.map(n => n.id);
    setReadIds(allIds);
    try {
      localStorage.setItem('taste_read_notifications', JSON.stringify(allIds));
      if (onCountChange) onCountChange(0);
    } catch (e) {
      console.error(e);
    }
  };

  const markSingleRead = (id: number | string) => {
    if (!readIds.includes(id)) {
      const updated = [...readIds, id];
      setReadIds(updated);
      try {
        localStorage.setItem('taste_read_notifications', JSON.stringify(updated));
        const remaining = allNotifs.filter(n => !updated.includes(n.id)).length;
        if (onCountChange) onCountChange(remaining);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const unreadCount = allNotifs.filter(n => !readIds.includes(n.id)).length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 99999 }}
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
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 22,
          zIndex: 100000,
          overflow: 'hidden',
          maxHeight: '75vh',
          boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
        }}
      >
        {/* Panel Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Bell size={18} color="#f59e0b" />
            <span style={{ fontWeight: 900, fontSize: 16, color: '#fff' }}>Bildirimler</span>
            {unreadCount > 0 ? (
              <span style={{ background: '#ef4444', color: '#fff', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 800 }}>
                {unreadCount} yeni
              </span>
            ) : (
              <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', borderRadius: 20, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
                Hepsi okundu
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                style={{
                  background: 'rgba(245,159,11,0.12)',
                  border: '1px solid rgba(245,159,11,0.3)',
                  color: '#f59e0b',
                  borderRadius: 10,
                  padding: '5px 12px',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <CheckCheck size={13} />
                <span>Tümünü Oku</span>
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                borderRadius: '50%',
                width: 32,
                height: 32,
                cursor: 'pointer',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div style={{ overflowY: 'auto', maxHeight: 'calc(75vh - 70px)' }}>
          <AnimatePresence>
            {allNotifs.map((notif, i) => {
              const isRead = readIds.includes(notif.id)
              return (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => markSingleRead(notif.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 14,
                    padding: '16px 20px',
                    borderBottom: i < allNotifs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    background: isRead ? 'transparent' : 'rgba(245,159,11,0.05)',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{notif.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: isRead ? 600 : 800, color: isRead ? '#94a3b8' : '#f8fafc' }}>
                        {notif.title}
                      </span>
                      <span style={{ fontSize: 11, color: '#475569', flexShrink: 0, marginLeft: 8 }}>{notif.time}</span>
                    </div>
                    <div style={{ fontSize: 12, color: isRead ? '#64748b' : '#cbd5e1', lineHeight: 1.5 }}>
                      {notif.body}
                    </div>
                  </div>
                  {!isRead && (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', flexShrink: 0, marginTop: 6 }} />
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  )
}
