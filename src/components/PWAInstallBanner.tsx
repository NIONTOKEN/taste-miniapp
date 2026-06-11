import { motion, AnimatePresence } from 'framer-motion'
import { usePWA } from '../hooks/usePWA'
import { Download, RefreshCw, X } from 'lucide-react'
import { useState } from 'react'

export function PWAInstallBanner() {
  const { isInstallable, promptInstall, needRefresh, updateServiceWorker, dismissUpdate } = usePWA()
  const [dismissed, setDismissed] = useState(false)

  const handleInstall = async () => {
    await promptInstall()
    setDismissed(true)
  }

  const handleDismiss = () => {
    setDismissed(true)
    // 24 saat sonra tekrar göster
    localStorage.setItem('pwa-banner-dismissed', Date.now().toString())
  }

  // 24 saat içinde reddedildiyse gösterme
  const lastDismissed = localStorage.getItem('pwa-banner-dismissed')
  const dismissedRecently = lastDismissed && Date.now() - parseInt(lastDismissed) < 24 * 60 * 60 * 1000

  const showInstallBanner = isInstallable && !dismissed && !dismissedRecently

  return (
    <>
      {/* SW Update Notification */}
      <AnimatePresence>
        {needRefresh && (
          <motion.div
            initial={{ opacity: 0, y: -60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'fixed',
              top: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.98))',
              border: '1px solid rgba(245,159,11,0.5)',
              borderRadius: '20px',
              padding: '12px 16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 20px rgba(245,159,11,0.15)',
              backdropFilter: 'blur(20px)',
              maxWidth: '340px',
              width: 'calc(100vw - 32px)',
            }}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <RefreshCw size={16} color="#000" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: '2px' }}>
                Güncelleme Hazır!
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Yeni sürümü yüklemek için yenile
              </div>
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => updateServiceWorker(true)}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#000', border: 'none', borderRadius: '12px',
                  padding: '7px 12px', fontSize: '12px', fontWeight: 800,
                  cursor: 'pointer', whiteSpace: 'nowrap'
                }}
              >
                Yenile
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={dismissUpdate}
                style={{
                  background: 'rgba(255,255,255,0.08)', color: '#94a3b8',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
                  padding: '7px', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', justifyContent: 'center'
                }}
              >
                <X size={14} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Install Banner */}
      <AnimatePresence>
        {showInstallBanner && (
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 80 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25, delay: 1.5 }}
            style={{
              position: 'fixed',
              bottom: '85px',
              left: '12px',
              right: '12px',
              zIndex: 9998,
              background: 'linear-gradient(135deg, rgba(15,23,42,0.98), rgba(20,30,48,0.98))',
              border: '1px solid rgba(245,159,11,0.4)',
              borderRadius: '24px',
              padding: '16px 16px',
              boxShadow: '0 -4px 40px rgba(0,0,0,0.6), 0 0 30px rgba(245,159,11,0.1)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            {/* Logo */}
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px',
              overflow: 'hidden', flexShrink: 0,
              border: '2px solid rgba(245,159,11,0.4)',
              boxShadow: '0 0 15px rgba(245,159,11,0.3)'
            }}>
              <img src="/logo.jpg" alt="TASTE" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#fff', marginBottom: '2px' }}>
                TASTE'i Yükle 🚀
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' }}>
                Ana ekrana ekle, offline çalışır
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleInstall}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#000', border: 'none', borderRadius: '14px',
                  padding: '10px 14px', fontSize: '12px', fontWeight: 900,
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                  boxShadow: '0 4px 15px rgba(245,159,11,0.4)'
                }}
              >
                <Download size={14} />
                Kur
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleDismiss}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  color: '#64748b', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '14px', padding: '10px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center'
                }}
              >
                <X size={14} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
