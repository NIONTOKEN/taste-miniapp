import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Camera, LogOut, ChevronRight, Edit3, Upload, Check, X } from 'lucide-react'
import { useWallet } from '../context/WalletContext'

interface ProfileProps {
  onClose: () => void
}

const NAME_KEY = 'taste_profile_display_name'
const IMG_KEY = 'taste_profile_image'

export function Profile({ onClose }: ProfileProps) {
  const { t, i18n } = useTranslation()
  const { balances, activeAddress } = useWallet()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [profileImg, setProfileImg] = useState<string | null>(() => localStorage.getItem(IMG_KEY))
  const [displayName, setDisplayName] = useState<string>(() => localStorage.getItem(NAME_KEY) || '')
  const [draftName, setDraftName] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [savedFlash, setSavedFlash] = useState(false)

  const balance = parseFloat(balances.taste || '0') || 0

  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user
  const username = tgUser?.username || tgUser?.first_name || 'Kullanıcı'
  const userId = tgUser?.id?.toString() || '—'
  const accent = '#f59e0b'

  const startEdit = () => {
    setDraftName(displayName)
    setEditingName(true)
  }

  const saveName = () => {
    const v = draftName.trim()
    setDisplayName(v)
    if (v) localStorage.setItem(NAME_KEY, v)
    else localStorage.removeItem(NAME_KEY)
    setEditingName(false)
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1800)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const data = ev.target?.result as string
        setProfileImg(data)
        try { localStorage.setItem(IMG_KEY, data) } catch { /* quota */ }
      }
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <motion.button
          onClick={onClose}
          whileTap={{ scale: 0.9 }}
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '8px 10px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <ArrowLeft size={18} />
        </motion.button>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>{t('profile_ext.title', 'Profil')}</h2>
      </div>

      {/* Avatar + user info */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 22 }}>
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <motion.div
            whileHover={{ scale: 1.04 }}
            style={{ width: 96, height: 96, borderRadius: '50%', border: `3px solid ${accent}`, boxShadow: `0 0 24px ${accent}66`, overflow: 'hidden', background: '#1e293b', cursor: 'pointer', position: 'relative' }}
          >
            {profileImg ? (
               <img src={profileImg} alt="profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <img src="/logo.jpg" alt="TAI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
            <label style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.45)', cursor: 'pointer', opacity: 0, transition: 'opacity 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0')}
            >
              <Camera size={22} color="#fff" />
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
          </motion.div>
          <label style={{ position: 'absolute', bottom: -4, right: -4, background: `linear-gradient(135deg,${accent},#d97706)`, borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: `0 2px 8px ${accent}88` }}>
            <Upload size={13} color="#000" />
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          </label>
        </div>

        {/* Display name / username editable — Kaydet butonlu */}
        {editingName ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center', marginBottom: 6, width: '100%', maxWidth: 280 }}>
            <input
              autoFocus
              value={draftName}
              maxLength={32}
              onChange={e => setDraftName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') setEditingName(false) }}
              placeholder={`@${username}`}
              style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(245,159,11,0.5)', borderRadius: 10, padding: '10px 12px', color: '#fff', fontSize: 16, fontWeight: 800, textAlign: 'center', outline: 'none' }}
            />
            <div style={{ display: 'flex', gap: 8, width: '100%' }}>
              <button
                onClick={() => setEditingName(false)}
                style={{ flex: 1, padding: '9px 0', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
              >
                <X size={14} /> {t('profile_ext.cancel', 'İptal')}
              </button>
              <button
                onClick={saveName}
                style={{ flex: 1, padding: '9px 0', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#10b981,#047857)', color: '#fff', fontWeight: 900, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}
              >
                <Check size={14} /> {t('profile_ext.save', 'Kaydet')}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc' }}>{displayName || `@${username}`}</span>
            <motion.button whileTap={{ scale: 0.9 }} onClick={startEdit} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#94a3b8', cursor: 'pointer', padding: '4px 6px', display: 'flex' }}>
              <Edit3 size={14} />
            </motion.button>
          </div>
        )}
        {savedFlash && (
          <div style={{ fontSize: 11, color: '#10b981', fontWeight: 800, marginBottom: 4 }}>✓ {t('profile_ext.saved', 'Kaydedildi')}</div>
        )}
        <div style={{ fontSize: 12, color: '#64748b' }}>Telegram ID: {userId}</div>
        <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
          {t('profile_ext.member_since', 'Üyelik:')} {new Date().toLocaleDateString(i18n.language || 'en', { year: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* Canlı Bakiye Kartı (cüzdandan) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(15,23,42,0.6))', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 20, padding: '16px 20px', marginBottom: 16 }}
      >
        {activeAddress ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src="/tai-logo-gold.png" alt="TAI" onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/logo.jpg' }} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>{t('profile_ext.tai_balance', 'TAI Bakiye')}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#f59e0b' }}>{balance.toLocaleString(undefined, { maximumFractionDigits: 2 })} <span style={{ fontSize: 13 }}>TAI</span></div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>TON</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#60a5fa' }}>{parseFloat(balances.ton || '0').toFixed(3)}</div>
              </div>
            </div>
            <div style={{ fontSize: 10, color: '#64748b', marginTop: 10, fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {activeAddress}
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', fontSize: 13, color: '#94a3b8', padding: '6px 0' }}>
            💼 {t('profile_ext.connect_wallet_hint', 'TAI bakiyenizi görmek için Cüzdan sekmesinden cüzdan bağlayın veya oluşturun.')}
          </div>
        )}
      </motion.div>

      {/* Privacy Policy */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => {
          const url = 'https://taste-miniapp-xy8k.vercel.app/audit.html'
          if (window.Telegram?.WebApp) window.Telegram.WebApp.openLink(url)
          else window.open(url, '_blank')
        }}
        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', marginBottom: 16, color: '#94a3b8' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 20 }}>🔒</span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{t('profile_ext.privacy', 'Gizlilik Politikası')}</span>
        </div>
        <ChevronRight size={16} />
      </motion.button>

      {/* Hesaptan Çık */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setShowLogoutConfirm(true)}
        style={{ width: '100%', background: 'transparent', border: 'none', color: '#ef4444', fontWeight: 800, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 0', borderRadius: 16 }}
      >
        <LogOut size={18} />
        {t('profile_ext.logout', 'Hesaptan Çık')}
      </motion.button>

      {/* Logout Confirm Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLogoutConfirm(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999 }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 40 }}
              style={{ position: 'fixed', bottom: 40, left: 20, right: 20, background: 'rgba(15,23,42,0.98)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 24, padding: '28px 24px', zIndex: 10000, textAlign: 'center' }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>🚪</div>
              <h3 style={{ margin: '0 0 8px', fontWeight: 900 }}>Hesaptan çıkmak istiyor musun?</h3>
              <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>Yerel veriler temizlenecek.</p>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setShowLogoutConfirm(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 14, padding: '12px 0', fontWeight: 700, cursor: 'pointer' }}>
                  İptal
                </button>
                <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ flex: 1, background: 'linear-gradient(135deg,#ef4444,#b91c1c)', border: 'none', color: '#fff', borderRadius: 14, padding: '12px 0', fontWeight: 800, cursor: 'pointer' }}>
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
