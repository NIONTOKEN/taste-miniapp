import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Camera, LogOut, ShieldCheck, Star, Upload, ChevronRight, Edit3, Trophy, Zap } from 'lucide-react'

interface ProfileProps {
  onClose: () => void
}

const LEVELS = [
  { key: 'level_apprentice', defaultName: 'Çırak', emoji: '🥉', min: 0,    max: 1999,  color: '#92400e', bg: 'rgba(146,64,14,0.15)' },
  { key: 'level_journeyman', defaultName: 'Kalfa', emoji: '🥈', min: 2000,  max: 3999,  color: '#94a3b8', bg: 'rgba(148,163,184,0.15)' },
  { key: 'level_master', defaultName: 'Usta',  emoji: '🥇', min: 4000,  max: 7499,  color: '#f59e0b', bg: 'rgba(245,159,11,0.15)' },
  { key: 'level_chef', defaultName: 'Şef',   emoji: '👨‍🍳', min: 7500, max: 14999, color: '#10b981', bg: 'rgba(168,85,247,0.15)' },
  { key: 'level_head_chef', defaultName: 'Baş Şef', emoji: '⭐', min: 15000, max: Infinity, color: '#a855f7', bg: 'rgba(168,85,247,0.15)' },
]

function getLevel(balance: number) {
  return LEVELS.find(l => balance >= l.min && balance <= l.max) || LEVELS[0]
}

export function Profile({ onClose }: ProfileProps) {
  const { t, i18n } = useTranslation()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [profileImg, setProfileImg] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [balance] = useState(0) // Will come from wallet integration

  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user
  const username = tgUser?.username || tgUser?.first_name || 'Kullanıcı'
  const userId = tgUser?.id?.toString() || '—'
  const level = getLevel(balance)
  const nextLevel = LEVELS[LEVELS.indexOf(level) + 1]
  const progress = nextLevel ? Math.min(((balance - level.min) / (nextLevel.min - level.min)) * 100, 100) : 100

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
            style={{ width: 96, height: 96, borderRadius: '50%', border: `3px solid ${level.color}`, boxShadow: `0 0 24px ${level.color}66`, overflow: 'hidden', background: '#1e293b', cursor: 'pointer', position: 'relative' }}
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
          <label style={{ position: 'absolute', bottom: -4, right: -4, background: `linear-gradient(135deg,${level.color},#d97706)`, borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: `0 2px 8px ${level.color}88` }}>
            <Upload size={13} color="#000" />
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
          </label>
        </div>

        {/* Display name / username editable */}
        {editingName ? (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
            <input
              autoFocus
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={e => e.key === 'Enter' && setEditingName(false)}
              placeholder={`@${username}`}
              style={{ background: 'rgba(255,255,200,0.08)', border: '1px solid rgba(245,159,11,0.4)', borderRadius: 8, padding: '4px 10px', color: '#fff', fontSize: 16, fontWeight: 800, textAlign: 'center', outline: 'none', width: 180 }}
            />
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: '#f8fafc' }}>{displayName || `@${username}`}</span>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => setEditingName(true)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 2 }}>
              <Edit3 size={14} />
            </motion.button>
          </div>
        )}
        <div style={{ fontSize: 12, color: '#64748b' }}>Telegram ID: {userId}</div>
        <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
          {t('profile_ext.member_since', 'Üyelik:')} {new Date().toLocaleDateString(i18n.language || 'en', { year: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* Level Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: level.bg, border: `1px solid ${level.color}44`, borderRadius: 20, padding: '16px 20px', marginBottom: 16 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 28 }}>{level.emoji}</span>
            <div>
              <div style={{ fontSize: 11, color: '#64748b' }}>{t('profile_ext.your_level', 'Seviyeniz')}</div>
              <div style={{ fontSize: 17, fontWeight: 900, color: level.color }}>{t(`profile_ext.${level.key}`, level.defaultName)}</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: '#64748b' }}>{t('profile_ext.tai_balance', 'TAI Bakiye')}</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#f59e0b' }}>{balance.toLocaleString()}</div>
          </div>
        </div>
        {/* Progress bar */}
        {nextLevel && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b', marginBottom: 6 }}>
              <span>{level.min.toLocaleString()} TAI</span>
              <span>{t('profile_ext.next_level', 'Sonraki:')} {nextLevel.emoji} {t(`profile_ext.${nextLevel.key}`, nextLevel.defaultName)} ({nextLevel.min.toLocaleString()} TAI)</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 6, height: 8, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{ height: '100%', background: `linear-gradient(90deg, ${level.color}, ${nextLevel.color})`, borderRadius: 6 }}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Subscription / Upgrade */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(0,0,0,0.3))', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 20, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShieldCheck size={20} color="#10b981" />
          </div>
          <div>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 2 }}>{t('profile_ext.subscription', 'Aboneliğiniz')}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#10b981' }}>{t('profile_ext.free', 'ÜCRETSİZ')}</div>
            <div style={{ fontSize: 10, color: '#475569' }}>{t('profile_ext.free_desc', 'TAI token çekebilir & ödüller kazanabilirsiniz')}</div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUpgradeModal(true)}
          style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', border: 'none', borderRadius: 12, padding: '8px 14px', color: '#000', fontWeight: 800, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
        >
          <Star size={12} fill="#000" />
          {t('profile_ext.upgrade', 'Yükselt')}
        </motion.button>
      </motion.div>

      {/* Balance & withdrawal */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, overflow: 'hidden', marginBottom: 16 }}
      >
        {[
          { icon: '💰', label: t('profile_ext.tai_balance', 'TAI Bakiye'), value: `${balance.toLocaleString()} TAI` },
          { icon: '📤', label: t('profile_ext.total_withdrawal', 'Toplam Çekim'), value: '—' },
        ].map((item, i) => (
          <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: i === 0 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
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

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowUpgradeModal(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 9999 }} />
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 60 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 60 }}
              style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'linear-gradient(180deg,#0f172a,#1e293b)', border: '1px solid rgba(245,159,11,0.3)', borderRadius: '28px 28px 0 0', padding: '32px 24px 48px', zIndex: 10000 }}
            >
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>⭐</div>
                <h2 style={{ margin: '0 0 8px', fontWeight: 900, fontSize: 22 }}>Premium'a Yükselt</h2>
                <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>Daha fazla özellik & öncelikli destek</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {[
                  { emoji: '🚀', title: 'Öncelikli AI Yanıtlar', desc: 'Sıraya girmeden anında AI desteği' },
                  { emoji: '💎', title: 'Özel Rozet', desc: 'Profilinde Premium rozeti göster' },
                  { emoji: '🎁', title: 'Bonus TAI Ödülleri', desc: 'Her görevden %20 daha fazla kazan' },
                  { emoji: '📊', title: 'Gelişmiş Analiz', desc: 'Detaylı portföy ve piyasa analizi' },
                ].map(item => (
                  <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '12px 16px' }}>
                    <span style={{ fontSize: 22 }}>{item.emoji}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setShowUpgradeModal(false)
                  if (window.Telegram?.WebApp) window.Telegram.WebApp.openTelegramLink('https://t.me/TasteTokenBot')
                }}
                style={{ width: '100%', background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 18, padding: '18px', color: '#000', fontWeight: 900, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
              >
                <Zap size={18} fill="#000" />
                Yakında Aktif Olacak
              </motion.button>
              <button onClick={() => setShowUpgradeModal(false)} style={{ width: '100%', background: 'transparent', border: 'none', color: '#475569', marginTop: 12, padding: '10px', cursor: 'pointer', fontSize: 14 }}>Şimdi Değil</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
