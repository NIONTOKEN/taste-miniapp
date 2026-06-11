import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { X, Copy, ExternalLink, Smartphone, Apple, Check } from 'lucide-react'

interface InstallModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InstallModal({ isOpen, onClose }: InstallModalProps) {
  const { t, i18n } = useTranslation()
  const isTR = i18n.language?.startsWith('tr')
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>('android')
  const [copied, setCopied] = useState(false)
  const appUrl = 'https://taste-miniapp-xy8k.vercel.app'

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(appUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleOpenBrowser = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(appUrl)
    } else {
      window.open(appUrl, '_blank')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 10000,
            }}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: '50%', scale: 0.95 }}
            animate={{ opacity: 1, y: '0%', scale: 1 }}
            exit={{ opacity: 0, y: '50%', scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '12px',
              right: '12px',
              background: 'linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.98))',
              border: '1px solid rgba(245,159,11,0.35)',
              borderRadius: '28px',
              padding: '24px 20px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.6), 0 0 30px rgba(245,159,11,0.1)',
              zIndex: 10001,
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>📲</span>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#fbbf24' }}>
                  {isTR ? "TASTE'i Ana Ekrana Ekle" : "Install TASTE to Home Screen"}
                </h3>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#94a3b8',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Description */}
            <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6', margin: '0 0 20px 0' }}>
              {isTR
                ? "Eğer uygulamayı Telegram içinden açtıysanız doğrudan yüklenemez. Tarayıcıda açarak tek tıkla ana ekranınıza ekleyebilir, daha hızlı ve offline (çevrimdışı) kullanabilirsiniz!"
                : "If you opened the app inside Telegram, it cannot be installed directly. Open it in your default browser to install it with one click for faster access and offline support!"}
            </p>

            {/* Actions Panel */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleOpenBrowser}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '16px',
                  padding: '14px 10px',
                  fontSize: '13px',
                  fontWeight: 900,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 15px rgba(245,159,11,0.3)',
                }}
              >
                <ExternalLink size={16} />
                {isTR ? "Tarayıcıda Aç" : "Open in Browser"}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  borderRadius: '16px',
                  padding: '14px 10px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                {copied ? <Check size={16} color="#22c55e" /> : <Copy size={16} />}
                {copied ? (isTR ? "Kopyalandı!" : "Copied!") : (isTR ? "Linki Kopyala" : "Copy Link")}
              </motion.button>
            </div>

            {/* Tabs Header */}
            <div style={{ display: 'flex', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '14px', marginBottom: '16px' }}>
              <button
                onClick={() => setActiveTab('android')}
                style={{
                  flex: 1,
                  background: activeTab === 'android' ? 'rgba(255,255,255,0.08)' : 'transparent',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px',
                  color: activeTab === 'android' ? '#fff' : '#64748b',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Smartphone size={14} color={activeTab === 'android' ? '#22c55e' : '#64748b'} />
                Android (Chrome)
              </button>
              <button
                onClick={() => setActiveTab('ios')}
                style={{
                  flex: 1,
                  background: activeTab === 'ios' ? 'rgba(255,255,255,0.08)' : 'transparent',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px',
                  color: activeTab === 'ios' ? '#fff' : '#64748b',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <Apple size={14} color={activeTab === 'ios' ? '#fff' : '#64748b'} />
                iOS (Safari)
              </button>
            </div>

            {/* Tab Content */}
            <div style={{ background: 'rgba(0,0,0,0.15)', borderRadius: '16px', padding: '16px', fontSize: '12.5px', color: '#cbd5e1', lineHeight: '1.6' }}>
              {activeTab === 'android' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ background: 'rgba(245,159,11,0.15)', color: '#f59e0b', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '11px', flexShrink: 0 }}>1</span>
                    <div>
                      {isTR
                        ? "Yukarıdaki 'Tarayıcıda Aç' butonuna basarak uygulamayı Chrome ile açın."
                        : "Tap 'Open in Browser' above to open the app in Google Chrome."}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ background: 'rgba(245,159,11,0.15)', color: '#f59e0b', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '11px', flexShrink: 0 }}>2</span>
                    <div>
                      {isTR
                        ? "Açılan sayfada birkaç saniye beklediğinizde altta beliren yükleme banner'ındaki 'Kur' butonuna basın."
                        : "Wait a few seconds on the page, and tap the 'Install' button on the banner that appears at the bottom."}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ background: 'rgba(245,159,11,0.15)', color: '#f59e0b', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '11px', flexShrink: 0 }}>3</span>
                    <div>
                      {isTR
                        ? "Eğer banner çıkmazsa, Chrome sağ üstündeki üç noktaya (⋮) tıklayıp 'Uygulamayı yükle' veya 'Ana ekrana ekle' seçeneğini seçin."
                        : "If the banner doesn't show up, tap the three dots (⋮) in Chrome's top right, and select 'Install app' or 'Add to Home screen'."}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ background: 'rgba(245,159,11,0.15)', color: '#f59e0b', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '11px', flexShrink: 0 }}>1</span>
                    <div>
                      {isTR
                        ? "Yukarıdaki 'Tarayıcıda Aç' butonuna basarak uygulamayı Safari tarayıcısında açın."
                        : "Tap 'Open in Browser' above to open the app in Safari browser."}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ background: 'rgba(245,159,11,0.15)', color: '#f59e0b', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '11px', flexShrink: 0 }}>2</span>
                    <div>
                      {isTR
                        ? "Safari alt menüsünde yer alan 'Paylaş' (Yukarı ok olan kare kutu 📤) simgesine dokunun."
                        : "Tap the 'Share' (square with an arrow pointing up 📤) icon in Safari's bottom menu."}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ background: 'rgba(245,159,11,0.15)', color: '#f59e0b', width: '22px', height: '22px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '11px', flexShrink: 0 }}>3</span>
                    <div>
                      {isTR
                        ? "Seçenekler listesini aşağı kaydırın ve 'Ana Ekrana Ekle' butonuna dokunun."
                        : "Scroll down the options list and tap 'Add to Home Screen'."}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
