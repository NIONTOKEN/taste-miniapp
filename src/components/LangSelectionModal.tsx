import { motion } from 'framer-motion'

interface LangSelectionModalProps {
  onSelect: (code: string) => void
}

export function LangSelectionModal({ onSelect }: LangSelectionModalProps) {
  const languages = [
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷', native: 'Türkçe' },
    { code: 'en', label: 'English', flag: '🇺🇸', native: 'English' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺', native: 'Русский' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦', native: 'العربية' },
    { code: 'zh', label: '简体中文', flag: '🇨🇳', native: '简体中文' },
  ]

  const greetings = [
    { code: 'tr', text: 'Lütfen dil seçiminizi yapın' },
    { code: 'en', text: 'Please select your language' },
    { code: 'ru', text: 'Пожалуйста, выберите ваш язык' },
    { code: 'ar', text: 'يرجى اختيار لغتك' },
    { code: 'zh', text: '请选择您的语言' }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 8, 16, 0.9)',
        backdropFilter: 'blur(16px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          background: 'linear-gradient(145deg, #0a0f1d, #141c30)',
          border: '1px solid rgba(245, 159, 11, 0.3)',
          borderRadius: '24px',
          padding: '30px 24px',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), 0 0 40px rgba(245, 159, 11, 0.05)',
          textAlign: 'center'
        }}
      >
        {/* Globe Header Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          background: 'rgba(245, 159, 11, 0.08)',
          border: '1px solid rgba(245, 159, 11, 0.25)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '28px',
          boxShadow: '0 0 15px rgba(245, 159, 11, 0.1)'
        }}>
          🌐
        </div>

        {/* Title Translations in all 5 languages */}
        <div style={{ marginBottom: '25px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {greetings.map((g) => (
            <div 
              key={g.code} 
              style={{
                fontSize: g.code === 'ar' || g.code === 'zh' ? '15px' : '14px',
                fontWeight: 600,
                color: g.code === 'tr' ? '#f59e0b' : 'rgba(255, 255, 255, 0.8)',
                lineHeight: 1.4,
                direction: g.code === 'ar' ? 'rtl' : 'ltr'
              }}
            >
              {g.text}
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: 'rgba(245, 159, 11, 0.15)', marginBottom: '20px' }} />

        {/* Language Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {languages.map((l) => (
            <motion.button
              key={l.code}
              whileHover={{ scale: 1.02, background: 'rgba(245, 159, 11, 0.06)', border: '1px solid rgba(245, 159, 11, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(l.code)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                borderRadius: '16px',
                color: 'var(--text-main, #ffffff)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                direction: l.code === 'ar' ? 'rtl' : 'ltr'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontSize: '24px' }}>{l.flag}</span>
                <span style={{ fontSize: '16px', fontWeight: 700 }}>{l.native}</span>
              </div>
              <span style={{ 
                fontSize: '11px', 
                fontWeight: 800, 
                color: 'rgba(255, 255, 255, 0.3)', 
                textTransform: 'uppercase',
                background: 'rgba(255,255,255,0.05)',
                padding: '2px 6px',
                borderRadius: '6px'
              }}>
                {l.code}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: '10px', color: 'rgba(255,255,255,0.2)', marginTop: '20px', letterSpacing: '0.5px' }}>
          TASTE © 2026 · Ecosystem Initialization
        </p>
      </motion.div>
    </motion.div>
  )
}
