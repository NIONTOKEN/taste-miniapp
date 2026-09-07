import { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShieldCheck, Clock } from 'lucide-react'

interface KYCModalProps {
  onClose: () => void
}

type KYCStep = 'intro' | 'pending'

export function KYCModal({ onClose }: KYCModalProps) {
  const { t } = useTranslation()
  const [step, setStep] = useState<KYCStep>('intro')

  const startKYC = () => {
    const text = encodeURIComponent('I want to verify my identity for KYC')
    const url = `https://t.me/TASTEAIOPEN?text=${text}`
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(url)
    } else {
      window.open(url, '_blank')
    }
    setStep('pending')
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 9000 }} />
      <motion.div
        initial={{ opacity: 0, y: 80, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 80 }}
        style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'linear-gradient(180deg,#0f172a 0%,#1e293b 100%)', borderRadius: '28px 28px 0 0', border: '1px solid rgba(245,159,11,0.25)', padding: '28px 22px 52px', zIndex: 9001, maxHeight: '90vh', overflowY: 'auto' }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: 18, right: 18, background: 'rgba(255,255,255,0.07)', border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={18} />
        </button>

        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>🛡️</div>
                <h2 style={{ margin: '0 0 8px', fontWeight: 900, fontSize: 22 }}>{t('kyc_ext.title', 'Kimlik Doğrulama (KYC)')}</h2>
                <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>{t('kyc_ext.subtitle', 'Kimlik doğrulama işlemleri Telegram üzerinden yapılmaktadır.')}</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '12px 16px' }}>
                  <ShieldCheck size={24} color="#f59e0b" />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{t('kyc_ext.verify_telegram', 'Telegram ile Doğrulama')}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{t('kyc_ext.verify_telegram_desc', 'Resmi hesabımıza mesaj göndererek süreci başlatın')}</div>
                  </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={startKYC}
                style={{ width: '100%', background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 18, padding: '18px', color: '#000', fontWeight: 900, fontSize: 16, cursor: 'pointer' }}
              >
                {t('kyc_ext.verify_btn', 'Telegram ile Doğrula →')}
              </motion.button>
            </motion.div>
          )}

          {step === 'pending' && (
            <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '40px 0' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                style={{ width: 60, height: 60, borderRadius: '50%', border: '4px solid rgba(245,159,11,0.2)', borderTop: '4px solid #f59e0b', margin: '0 auto 20px' }}
              />
              <h3 style={{ fontWeight: 900, marginBottom: 8 }}>{t('kyc_ext.pending_title', 'Doğrulama bekleniyor')}</h3>
              
              <div style={{ background: 'rgba(245,159,11,0.12)', border: '1px solid rgba(245,159,11,0.3)', borderRadius: 14, padding: '14px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                <Clock size={16} color="#f59e0b" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#f59e0b' }}>{t('kyc_ext.stay_telegram', 'Telegram üzerinden iletişimde kalın')}</span>
              </div>

              <motion.button whileTap={{ scale: 0.97 }} onClick={onClose} style={{ width: '100%', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 18, padding: '16px', color: '#fff', fontWeight: 900, fontSize: 16, cursor: 'pointer' }}>
                {t('kyc_ext.close', 'Kapat')}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
