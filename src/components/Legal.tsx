import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation, Trans } from 'react-i18next'

type Section = 'disclaimer' | 'terms' | 'privacy' | 'risk'

export function Legal() {
    const { t } = useTranslation()
    const [active, setActive] = useState<Section>('disclaimer')

    const sections: { id: Section; emoji: string; label: string; sublabel: string }[] = [
        { id: 'disclaimer', emoji: '⚠️', label: t('legal.nav.disclaimer.label'), sublabel: t('legal.nav.disclaimer.sub') },
        { id: 'terms', emoji: '📋', label: t('legal.nav.terms.label'), sublabel: t('legal.nav.terms.sub') },
        { id: 'privacy', emoji: '🔒', label: t('legal.nav.privacy.label'), sublabel: t('legal.nav.privacy.sub') },
        { id: 'risk', emoji: '📊', label: t('legal.nav.risk.label'), sublabel: t('legal.nav.risk.sub') },
    ]

    return (
        <motion.div
            key="legal"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
        >
            {/* Header */}
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '34px', marginBottom: '8px' }}>⚖️</div>
                <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                    {t('legal.header.badge')}
                </div>
                <h2 style={{ fontWeight: 900, fontSize: '1.2rem', margin: '0 0 8px' }}>{t('legal.header.title')}</h2>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                    {t('legal.header.subtitle')}
                </p>
                <div style={{
                    marginTop: '12px',
                    padding: '10px 14px',
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: '10px',
                    fontSize: '11px',
                    color: '#fca5a5',
                    lineHeight: 1.6
                }}>
                    <Trans
                        i18nKey="legal.header.warning"
                        components={{ 1: <strong /> }}
                    />
                </div>
            </div>

            {/* Tab Selector */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                marginBottom: '16px'
            }}>
                {sections.map(s => (
                    <motion.button
                        key={s.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setActive(s.id)}
                        style={{
                            background: active === s.id
                                ? 'rgba(129,140,248,0.15)'
                                : 'rgba(255,255,255,0.03)',
                            border: active === s.id
                                ? '1px solid rgba(129,140,248,0.4)'
                                : '1px solid rgba(255,255,255,0.07)',
                            borderRadius: '12px',
                            padding: '12px 8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{ fontSize: '20px', marginBottom: '4px' }}>{s.emoji}</div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: active === s.id ? '#818cf8' : 'rgba(255,255,255,0.7)' }}>
                            {s.label}
                        </div>
                        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
                            {s.sublabel}
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {active === 'disclaimer' && <DisclaimerContent />}
                    {active === 'terms' && <TermsContent />}
                    {active === 'privacy' && <PrivacyContent />}
                    {active === 'risk' && <RiskContent />}
                </motion.div>
            </AnimatePresence>

            {/* Last Updated */}
            <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '10px' }}>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>
                    {t('legal.footer.last_updated')}
                </p>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.15)' }}>
                    {t('legal.footer.network')}
                </p>
            </div>
        </motion.div>
    )
}

/* ─── Sections ─────────────────────────────────────────── */

function LegalSection({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '12px'
        }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#818cf8', marginBottom: subtitle ? '3px' : '10px' }}>
                {title}
            </h3>
            {subtitle && (
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '10px' }}>{subtitle}</p>
            )}
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75 }}>
                {children}
            </div>
        </div>
    )
}

function HighlightBox({ color, children }: { color: string; children: React.ReactNode }) {
    return (
        <div style={{
            background: `${color}10`,
            border: `1px solid ${color}25`,
            borderRadius: '10px',
            padding: '12px 14px',
            marginTop: '10px',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.7
        }}>
            {children}
        </div>
    )
}

function DisclaimerContent() {
    const { t, i18n } = useTranslation()
    const isTr = i18n.language === 'tr'
    return (
        <div>
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '12px', borderColor: 'rgba(239,68,68,0.2)' }}>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75 }}>
                    {t('legal.doc_info')}
                </p>
            </div>

            <LegalSection title={t('legal.disclaimer.section1.title')} subtitle={t('legal.disclaimer.section1.sub')}>
                <div style={{ whiteSpace: 'pre-line' }}>{t('legal.disclaimer.section1.text')}</div>
                {isTr && (
                    <HighlightBox color="#ef4444">
                        <Trans i18nKey="legal.disclaimer.section1.eng_note" components={{ 1: <strong style={{ color: '#fca5a5' }} /> }} />
                    </HighlightBox>
                )}
            </LegalSection>

            <LegalSection title={t('legal.disclaimer.section2.title')} subtitle={t('legal.disclaimer.section2.sub')}>
                <div style={{ whiteSpace: 'pre-line' }}>{t('legal.disclaimer.section2.text')}</div>
                {isTr && (
                    <HighlightBox color="#f59e0b">
                        <Trans i18nKey="legal.disclaimer.section2.eng_note" components={{ 1: <strong style={{ color: '#fcd34d' }} /> }} />
                    </HighlightBox>
                )}
            </LegalSection>

            <LegalSection title={t('legal.disclaimer.section3.title')} subtitle={t('legal.disclaimer.section3.sub')}>
                <div style={{ whiteSpace: 'pre-line' }}>{t('legal.disclaimer.section3.text')}</div>
                {isTr && (
                    <HighlightBox color="#22c55e">
                        <Trans i18nKey="legal.disclaimer.section3.eng_note" components={{ 1: <strong style={{ color: '#86efac' }} /> }} />
                    </HighlightBox>
                )}
            </LegalSection>
        </div>
    )
}

function TermsContent() {
    const { t, i18n } = useTranslation()
    const isEn = i18n.language === 'en'
    return (
        <div>
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75 }}>
                    {t('legal.terms.intro')}
                    {!isEn && <><br /><span style={{ color: 'rgba(255,255,255,0.3)' }}>By using this application, you agree to the following terms.</span></>}
                </p>
            </div>

            <LegalSection title={t('legal.terms.section1.title')} subtitle={t('legal.terms.section1.sub')}>
                <div style={{ whiteSpace: 'pre-line' }}>{t('legal.terms.section1.text')}</div>
            </LegalSection>

            <LegalSection title={t('legal.terms.section2.title')} subtitle={t('legal.terms.section2.sub')}>
                <div style={{ whiteSpace: 'pre-line' }}>{t('legal.terms.section2.text')}</div>
            </LegalSection>

            <LegalSection title={t('legal.terms.section3.title')} subtitle={t('legal.terms.section3.sub')}>
                <div style={{ whiteSpace: 'pre-line' }}>{t('legal.terms.section3.text')}</div>
            </LegalSection>

            <LegalSection title={t('legal.terms.section4.title')} subtitle={t('legal.terms.section4.sub')}>
                <div style={{ whiteSpace: 'pre-line' }}>
                    <Trans
                        i18nKey="legal.terms.section4.text"
                        components={{
                            1: <strong style={{ color: '#ef4444' }} />,
                            2: <strong style={{ color: 'rgba(255,255,255,0.8)' }} />
                        }}
                    />
                </div>
            </LegalSection>

            <LegalSection title={t('legal.terms.section5.title')} subtitle={t('legal.terms.section5.sub')}>
                {t('legal.terms.section5.text')}
            </LegalSection>
        </div>
    )
}

function PrivacyContent() {
    const { t } = useTranslation()
    return (
        <div>
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '12px', borderColor: 'rgba(34,197,94,0.2)' }}>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75 }}>
                    {t('legal.privacy.intro')}
                </p>
            </div>

            <LegalSection title={t('legal.privacy.section1.title')} subtitle={t('legal.privacy.section1.sub')}>
                <div style={{ whiteSpace: 'pre-line' }}>
                    <Trans
                        i18nKey="legal.privacy.section1.text"
                        components={{ 1: <strong style={{ color: 'rgba(255,255,255,0.8)' }} /> }}
                    />
                </div>
                <HighlightBox color="#22c55e">
                    <Trans
                        i18nKey="legal.privacy.section1.note"
                        components={{ 1: <strong style={{ color: '#86efac' }} /> }}
                    />
                </HighlightBox>
            </LegalSection>

            <LegalSection title={t('legal.privacy.section2.title')} subtitle={t('legal.privacy.section2.sub')}>
                <div style={{ whiteSpace: 'pre-line' }}>
                    <Trans
                        i18nKey="legal.privacy.section2.text"
                        components={{ 1: <strong style={{ color: 'rgba(255,255,255,0.8)' }} /> }}
                    />
                </div>
            </LegalSection>

            <LegalSection title={t('legal.privacy.section3.title')} subtitle={t('legal.privacy.section3.sub')}>
                {t('legal.privacy.section3.text')}
            </LegalSection>

            <LegalSection title={t('legal.privacy.section4.title')} subtitle={t('legal.privacy.section4.sub')}>
                {t('legal.privacy.section4.text')}
                <HighlightBox color="#818cf8">
                    <strong style={{ color: '#c4b5fd' }}>Telegram:</strong> @TasteTokenOfficial
                </HighlightBox>
            </LegalSection>
        </div>
    )
}

function RiskContent() {
    const { t } = useTranslation()
    return (
        <div>
            <div className="glass-panel" style={{
                padding: '20px', marginBottom: '12px',
                borderColor: 'rgba(239,68,68,0.25)',
                background: 'rgba(239,68,68,0.04)'
            }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#fca5a5', marginBottom: '6px' }}>
                    {t('legal.risk.intro_title')}
                </p>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75 }}>
                    <Trans
                        i18nKey="legal.risk.intro_text"
                        components={{ 1: <strong style={{ color: '#fca5a5' }} /> }}
                    />
                </div>
            </div>

            <LegalSection title={t('legal.risk.section1.title')} subtitle={t('legal.risk.section1.sub')}>
                {t('legal.risk.section1.text')}
            </LegalSection>

            <LegalSection title={t('legal.risk.section2.title')} subtitle={t('legal.risk.section2.sub')}>
                {t('legal.risk.section2.text')}
            </LegalSection>

            <LegalSection title={t('legal.risk.section3.title')} subtitle={t('legal.risk.section3.sub')}>
                <div style={{ whiteSpace: 'pre-line' }}>
                    <Trans
                        i18nKey="legal.risk.section3.text"
                        components={{ 1: <strong style={{ color: 'rgba(255,255,255,0.8)' }} /> }}
                    />
                </div>
            </LegalSection>

            <LegalSection title={t('legal.risk.section4.title')} subtitle={t('legal.risk.section4.sub')}>
                {t('legal.risk.section4.text')}
            </LegalSection>

            <LegalSection title={t('legal.risk.section5.title')} subtitle={t('legal.risk.section5.sub')}>
                <div style={{ whiteSpace: 'pre-line' }}>{t('legal.risk.section5.text')}</div>
                <HighlightBox color="#f59e0b">
                    <strong style={{ color: '#fcd34d' }}>DYOR:</strong> Do Your Own Research. This is not financial advice.
                </HighlightBox>
            </LegalSection>
        </div>
    )
}
