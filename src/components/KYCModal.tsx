import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShieldCheck, Camera, CheckCircle2, Clock, Upload } from 'lucide-react'

interface KYCModalProps {
  onClose: () => void
}

type KYCStep = 'intro' | 'upload_id' | 'upload_selfie' | 'pending' | 'done'

export function KYCModal({ onClose }: KYCModalProps) {
  const [step, setStep] = useState<KYCStep>('intro')
  const [idImg, setIdImg] = useState<string | null>(null)
  const [selfieImg, setSelfieImg] = useState<string | null>(null)

  const handleFileChange = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => setter(ev.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const submit = () => {
    setStep('pending')
    setTimeout(() => setStep('done'), 2500)
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
          {/* ── INTRO ── */}
          {step === 'intro' && (
            <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>🛡️</div>
                <h2 style={{ margin: '0 0 8px', fontWeight: 900, fontSize: 22 }}>Kimlik Doğrulama (KYC)</h2>
                <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>Doğrulanan hesaplar <span style={{ color: '#f59e0b', fontWeight: 800 }}>+500 TAI</span> ödül kazanır!</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
                {[
                  { icon: '🪪', title: 'Kimlik Belgesi', desc: 'Nüfus cüzdanı veya pasaport fotoğrafı' },
                  { icon: '🤳', title: 'Selfie', desc: 'Kimliğini tutarken çekilmiş fotoğraf' },
                  { icon: '⚡', title: 'Hızlı Onay', desc: 'Genellikle 24 saat içinde onaylanır' },
                  { icon: '🎁', title: '500 TAI Ödül', desc: 'Onay sonrası hesabına yatırılır' },
                ].map(item => (
                  <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '12px 16px' }}>
                    <span style={{ fontSize: 22 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{item.title}</div>
                      <div style={{ fontSize: 11, color: '#64748b' }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setStep('upload_id')}
                style={{ width: '100%', background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 18, padding: '18px', color: '#000', fontWeight: 900, fontSize: 16, cursor: 'pointer' }}
              >
                Başla →
              </motion.button>
            </motion.div>
          )}

          {/* ── UPLOAD ID ── */}
          {step === 'upload_id' && (
            <motion.div key="upload_id" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <h3 style={{ margin: '0 0 6px', fontWeight: 900 }}>🪪 Kimlik Belgesi</h3>
              <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>Nüfus cüzdanı veya pasaportunuzun fotoğrafını yükleyin.</p>

              <label style={{ display: 'block', cursor: 'pointer' }}>
                <div style={{ border: '2px dashed rgba(245,159,11,0.4)', borderRadius: 18, padding: '32px 20px', textAlign: 'center', background: idImg ? 'none' : 'rgba(245,159,11,0.04)', overflow: 'hidden' }}>
                  {idImg ? (
                    <img src={idImg} alt="ID" style={{ width: '100%', borderRadius: 12, objectFit: 'cover', maxHeight: 200 }} />
                  ) : (
                    <>
                      <Upload size={32} color="#f59e0b" style={{ marginBottom: 10 }} />
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>Kimlik Fotoğrafı Yükle</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>JPG, PNG — maks 5MB</div>
                    </>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange(setIdImg)} style={{ display: 'none' }} />
              </label>

              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button onClick={() => setStep('intro')} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 14, padding: '14px 0', fontWeight: 700, cursor: 'pointer' }}>Geri</button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={!idImg}
                  onClick={() => setStep('upload_selfie')}
                  style={{ flex: 2, background: idImg ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 14, padding: '14px 0', color: idImg ? '#000' : '#475569', fontWeight: 800, cursor: idImg ? 'pointer' : 'not-allowed' }}
                >
                  Devam →
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── UPLOAD SELFIE ── */}
          {step === 'upload_selfie' && (
            <motion.div key="upload_selfie" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
              <h3 style={{ margin: '0 0 6px', fontWeight: 900 }}>🤳 Selfie Fotoğrafı</h3>
              <p style={{ color: '#64748b', fontSize: 13, marginBottom: 20 }}>Kimliğinizi tutarken çekilmiş yüzünüzün göründüğü bir fotoğraf.</p>

              <label style={{ display: 'block', cursor: 'pointer' }}>
                <div style={{ border: '2px dashed rgba(16,185,129,0.4)', borderRadius: 18, padding: '32px 20px', textAlign: 'center', background: selfieImg ? 'none' : 'rgba(16,185,129,0.04)', overflow: 'hidden' }}>
                  {selfieImg ? (
                    <img src={selfieImg} alt="Selfie" style={{ width: '100%', borderRadius: 12, objectFit: 'cover', maxHeight: 200 }} />
                  ) : (
                    <>
                      <Camera size={32} color="#10b981" style={{ marginBottom: 10 }} />
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>Selfie Fotoğrafı Yükle</div>
                      <div style={{ fontSize: 12, color: '#64748b' }}>Yüzünüz ve kimliğiniz görünmeli</div>
                    </>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleFileChange(setSelfieImg)} style={{ display: 'none' }} />
              </label>

              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                <button onClick={() => setStep('upload_id')} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 14, padding: '14px 0', fontWeight: 700, cursor: 'pointer' }}>Geri</button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  disabled={!selfieImg}
                  onClick={submit}
                  style={{ flex: 2, background: selfieImg ? 'linear-gradient(135deg,#10b981,#059669)' : 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 14, padding: '14px 0', color: selfieImg ? '#000' : '#475569', fontWeight: 800, cursor: selfieImg ? 'pointer' : 'not-allowed' }}
                >
                  Gönder ✓
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── PENDING ── */}
          {step === 'pending' && (
            <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '40px 0' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                style={{ width: 60, height: 60, borderRadius: '50%', border: '4px solid rgba(245,159,11,0.2)', borderTop: '4px solid #f59e0b', margin: '0 auto 20px' }}
              />
              <h3 style={{ fontWeight: 900, marginBottom: 8 }}>Gönderiliyor...</h3>
              <p style={{ color: '#64748b', fontSize: 13 }}>Belgeleriniz kontrol ediliyor</p>
            </motion.div>
          )}

          {/* ── DONE ── */}
          {step === 'done' && (
            <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: 'center', padding: '32px 0' }}>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} style={{ fontSize: 64, marginBottom: 16 }}>🎉</motion.div>
              <h2 style={{ fontWeight: 900, margin: '0 0 8px' }}>Başvurunuz Alındı!</h2>
              <p style={{ color: '#64748b', fontSize: 13, marginBottom: 6 }}>Belgeleriniz inceleme aşamasında.</p>
              <div style={{ background: 'rgba(245,159,11,0.12)', border: '1px solid rgba(245,159,11,0.3)', borderRadius: 14, padding: '14px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                <Clock size={16} color="#f59e0b" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#f59e0b' }}>24 saat içinde onaylanacak</span>
              </div>
              <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 14, padding: '14px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                <CheckCircle2 size={16} color="#10b981" />
                <span style={{ fontSize: 14, fontWeight: 700, color: '#10b981' }}>Onay sonrası +500 TAI hesabınıza eklenecek</span>
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={onClose} style={{ width: '100%', background: 'linear-gradient(135deg,#f59e0b,#d97706)', border: 'none', borderRadius: 18, padding: '16px', color: '#000', fontWeight: 900, fontSize: 16, cursor: 'pointer' }}>
                Tamam
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
