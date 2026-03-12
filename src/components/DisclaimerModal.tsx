import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const STORAGE_KEY = 'taste_disclaimer_accepted_v1'

interface DisclaimerModalProps {
    onAccept: () => void
}

export function DisclaimerModal({ onAccept }: DisclaimerModalProps) {
    const { i18n } = useTranslation()
    const isEn = i18n.language === 'en'
    const [checked, setChecked] = useState(false)
    const [shake, setShake] = useState(false)

    const handleAccept = () => {
        if (!checked) {
            setShake(true)
            setTimeout(() => setShake(false), 600)
            return
        }
        localStorage.setItem(STORAGE_KEY, 'true')
        onAccept()
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(12px)',
                zIndex: 9999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 60, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40, scale: 0.92 }}
                transition={{ type: 'spring', damping: 22, stiffness: 220 }}
                style={{
                    background: 'linear-gradient(145deg, #0f172a, #1e293b)',
                    border: '1px solid rgba(245,159,11,0.25)',
                    borderRadius: '24px',
                    padding: '28px 24px',
                    maxWidth: '420px',
                    width: '100%',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(245,159,11,0.08)',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{
                        width: '56px', height: '56px',
                        background: 'rgba(245,159,11,0.12)',
                        border: '1px solid rgba(245,159,11,0.3)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 14px',
                        fontSize: '26px'
                    }}>⚠️</div>
                    <h2 style={{
                        fontSize: '18px', fontWeight: 800,
                        color: '#f59e0b', marginBottom: '6px'
                    }}>{isEn ? 'Important Risk Warning' : 'Önemli Risk Uyarısı'}</h2>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                        {isEn ? 'Legal Notice & Terms' : 'HUKUKİ BİLGİLENDİRME & ŞARTLAR'}
                    </p>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(245,159,11,0.15)', marginBottom: '20px' }} />

                {/* Content */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>

                    <DisclaimerItem
                        emoji="🚫"
                        color="#ef4444"
                        title={isEn ? "Not Investment Advice" : "Yatırım Tavsiyesi Değildir"}
                        subtitle="Disclaimer"
                        text={isEn ? "Nothing in this application constitutes investment advice, financial guidance, or an offer to buy/sell any security or crypto asset." : "Bu uygulama içindeki hiçbir içerik, grafik, fiyat bilgisi veya ifade yatırım tavsiyesi, finansal öneri veya alım-satım teklifi olarak yorumlanamaz."}
                    />

                    <DisclaimerItem
                        emoji="⚠️"
                        color="#f59e0b"
                        title={isEn ? "High Risk Warning" : "Yüksek Risk Tespiti"}
                        subtitle="Risk Level"
                        text={isEn ? "Cryptocurrency assets carry high risk. You may lose all of your investment. Only invest what you can afford to lose." : "Kripto para varlıkları son derece yüksek risk içerir. Yatırımınızın tamamını kaybedebilirsiniz. Yalnızca kaybetmeyi göze aldığınız miktarı yatırın."}
                    />

                    <DisclaimerItem
                        emoji="📋"
                        color="#818cf8"
                        title={isEn ? "Limitation of Liability" : "Sorumluluk Reddi"}
                        subtitle="Liability"
                        text={isEn ? "The TASTE Token team cannot be held responsible for any financial loss or damage resulting from decisions based on this application." : "TASTE Token ekibi, bu uygulamaya dayanarak alınan kararlar sonucunda oluşabilecek herhangi bir mali kayıp, zarar veya kayıptan sorumlu tutulamaz."}
                    />

                    <DisclaimerItem
                        emoji="🌍"
                        color="#22c55e"
                        title={isEn ? "Regulatory Notice" : "Yasal Uyarı"}
                        subtitle="Compliance"
                        text={isEn ? "Crypto transactions may be restricted in your country. Users are solely responsible for complying with local laws." : "Kripto para işlemleri bulunduğunuz ülkede kısıtlı veya yasak olabilir. Yerel mevzuata uygun hareket etmek tamamen kullanıcının sorumluluğundadır."}
                    />
                </div>

                {/* Checkbox */}
                <motion.label
                    animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        cursor: 'pointer',
                        padding: '14px',
                        background: checked ? 'rgba(245,159,11,0.08)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${checked ? 'rgba(245,159,11,0.35)' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: '12px',
                        marginBottom: '18px',
                        transition: 'all 0.25s'
                    }}
                >
                    <div
                        onClick={() => setChecked(!checked)}
                        style={{
                            width: '20px', height: '20px', minWidth: '20px',
                            borderRadius: '6px',
                            border: checked ? '2px solid #f59e0b' : '2px solid rgba(255,255,255,0.2)',
                            background: checked ? '#f59e0b' : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginTop: '1px',
                            transition: 'all 0.2s',
                            fontSize: '12px'
                        }}>
                        {checked && '✓'}
                    </div>
                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
                        {isEn ? 'I have read and understood the risk warnings above. I accept that this application does not contain investment advice.' : 'Yukarıdaki risk uyarılarını okudum ve anladım. Bu uygulamanın yatırım tavsiyesi içermediğini kabul ediyorum.'}
                    </span>
                </motion.label>

                {/* Accept Button */}
                <motion.button
                    whileTap={checked ? { scale: 0.97 } : {}}
                    onClick={handleAccept}
                    style={{
                        width: '100%',
                        padding: '14px',
                        borderRadius: '14px',
                        border: 'none',
                        background: checked
                            ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                            : 'rgba(255,255,255,0.06)',
                        color: checked ? '#000' : 'rgba(255,255,255,0.3)',
                        fontWeight: 700,
                        fontSize: '15px',
                        cursor: checked ? 'pointer' : 'not-allowed',
                        transition: 'all 0.3s',
                        boxShadow: checked ? '0 8px 24px rgba(245,159,11,0.3)' : 'none',
                    }}
                >
                    {checked 
                        ? (isEn ? '✅ I Accept — Continue' : '✅ Kabul Ediyorum — Devam Et') 
                        : (isEn ? 'Please check the box to continue' : 'Lütfen Onay Kutusunu İşaretleyin')}
                </motion.button>

                <p style={{ textAlign: 'center', fontSize: '10px', color: 'rgba(255,255,255,0.2)', marginTop: '12px' }}>
                    TASTE Token © 2025 · Built on The Open Network
                </p>
            </motion.div>
        </motion.div>
    )
}

function DisclaimerItem({
    emoji, color, title, subtitle, text
}: {
    emoji: string
    color: string
    title: string
    subtitle: string
    text: string
}) {
    return (
        <div style={{
            background: `${color}08`,
            border: `1px solid ${color}20`,
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
        }}>
            <span style={{ fontSize: '18px', minWidth: '24px' }}>{emoji}</span>
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color }}>{title}</span>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{subtitle}</span>
                </div>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, margin: 0 }}>{text}</p>
            </div>
        </div>
    )
}

export function shouldShowDisclaimer(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== 'true'
}
