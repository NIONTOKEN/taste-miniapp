import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Camera, LogOut, ShieldCheck, Star, Upload, ChevronRight } from 'lucide-react'

interface ProfileProps {
  onClose: () => void
}

export function Profile({ onClose }: ProfileProps) {
  const { t } = useTranslation()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [profileImg, setProfileImg] = useState<string | null>(null)

  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user
  const username = tgUser?.username || tgUser?.first_name || 'Kullanıcı'
  const userId = tgUser?.id?.toString() || '—'

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setProfileImg(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{ paddingBottom: 20 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <motion.button
          onClick={onClose}
          whileTap={{ scale: 0.9 }}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: '8px 10px',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ArrowLeft size={18} />
        </motion.button>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>Profil</h2>
      </div>

      {/* Avatar + user info */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <motion.div
            whileHover={{ scale: 1.04 }}
            style={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              border: '3px solid #f59e0b',
              boxShadow: '0 0 24px rgba(245,159,11,0.45)',
              overflow: 'hidden',
              background: '#1e293b',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            {profileImg ? (
              <img src={profileImg} alt="profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <img src="/logo.jpg" alt="TAI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
            {/* upload overlay */}
            <label style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(0,0,0,0.45)',
              cursor: 'pointer',
              opacity: 0,
              transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
            >
              <Camera size={22} color="#fff" />
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
          </motion.div>

          {/* Upload button */}
          <label style={{
            position: 'absolute',
            bottom: -4, right: -4,
            background: 'linear-gradient(135deg,#f59e0b,#d97706)',
            borderRadius: '50%',
            width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(245,159,11,0.5)',
          }}>
            <Upload size={13} color="#000" />
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          </label>
        </div>

        <div style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc' }}>@{username}</div>
        <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>Telegram ID: {userId}</div>
        <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
          Üyelik: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* Subscription card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(0,0,0,0.3))',
          border: '1px solid rgba(16,185,129,0.3)',
          borderRadius: 20,
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'rgba(16,185,129,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <ShieldCheck size={20} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>Aboneliğiniz</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#10b981' }}>ÜCRETSİZ</div>
            <div style={{ fontSize: 10, color: '#475569' }}>TAI token çekebilir & ödüller kazanabilirsiniz</div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            border: 'none',
            borderRadius: 12,
            padding: '8px 14px',
            color: '#000',
            fontWeight: 800,
            fontSize: 12,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Star size={12} fill="#000" />
          Yükselt
        </motion.button>
      </motion.div>

      {/* Balance & withdrawal */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20,
          overflow: 'hidden',
          marginBottom: 16,
        }}
      >
        {[
          { icon: '💰', label: 'Bakiye', value: '—' },
          { icon: '📤', label: 'Çekilen Miktar', value: '—' },
        ].map((item, i) => (
          <div
            key={item.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>{item.icon}</span>
              <span style={{ fontSize: 14, color: '#94a3b8', fontWeight: 600 }}>{item.label}</span>
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: '#f59e0b' }}>{item.value}</span>
          </div>
        ))}
      </motion.div>

      {/* Privacy Policy */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ background: 'rgba(255,255,255,0.06)' }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          const url = 'https://taste-miniapp-xy8k.vercel.app/audit.html'
          if (window.Telegram?.WebApp) window.Telegram.WebApp.openLink(url)
          else window.open(url, '_blank')
        }}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 20,
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          marginBottom: 16,
          color: '#94a3b8',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20 }}>🔒</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Gizlilik Politikası</span>
        </div>
        <ChevronRight size={16} />
      </motion.button>

      {/* Logout */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setShowLogoutConfirm(true)}
        style={{
          width: '100%',
          background: 'transparent',
          border: 'none',
          color: '#ef4444',
          fontWeight: 800,
          fontSize: 15,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          padding: '14px 0',
          borderRadius: 16,
        }}
      >
        <LogOut size={18} />
        Hesaptan Çık
      </motion.button>

      {/* Logout Confirm Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLogoutConfirm(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999 }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 40 }}
              style={{
                position: 'fixed',
                bottom: 40, left: 20, right: 20,
                background: 'rgba(15,23,42,0.98)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: 24,
                padding: '28px 24px',
                zIndex: 10000,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>🚪</div>
              <h3 style={{ margin: '0 0 8px', fontWeight: 900 }}>Çıkmak istediğine emin misin?</h3>
              <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>Hesabından çıkış yapılacak.</p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  style={{ flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 14, padding: '12px 0', fontWeight: 700, cursor: 'pointer' }}
                >
                  İptal
                </button>
                <button
                  onClick={() => { localStorage.clear(); window.location.reload(); }}
                  style={{ flex: 1, background: 'linear-gradient(135deg,#ef4444,#b91c1c)', border: 'none', color: '#fff', borderRadius: 14, padding: '12px 0', fontWeight: 800, cursor: 'pointer' }}
                >
                  Çık
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
