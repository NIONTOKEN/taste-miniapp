import { motion } from 'framer-motion'
import { useTranslation, Trans } from 'react-i18next'

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
}

interface SectionProps {
    children: React.ReactNode
    delay?: number
}

function Section({ children, delay = 0 }: SectionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            className="glass-panel"
            style={{
                padding: '20px',
                marginBottom: '16px',
                lineHeight: '1.8',
                fontSize: '14px',
                color: 'var(--text-muted)'
            }}
        >
            {children}
        </motion.div>
    )
}

function Highlight({ children }: { children: React.ReactNode }) {
    return (
        <span style={{
            color: 'var(--primary)',
            fontWeight: '700'
        }}>
            {children}
        </span>
    )
}

function Quote({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            borderLeft: '3px solid var(--primary)',
            paddingLeft: '15px',
            margin: '15px 0',
            fontStyle: 'italic',
            color: '#fff',
            fontSize: '15px',
            lineHeight: '1.9'
        }}>
            {children}
        </div>
    )
}

export function Manifesto() {
    const { t } = useTranslation()

    return (
        <div style={{ paddingBottom: '20px' }}>
            {/* Title */}
            <motion.div
                {...fadeIn}
                style={{ textAlign: 'center', marginBottom: '30px' }}
            >
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔥</div>
                <h2 className="text-gradient" style={{
                    fontSize: '1.6rem',
                    fontWeight: '900',
                    marginBottom: '8px',
                    letterSpacing: '1px'
                }}>
                    {t('manifesto.title')}
                </h2>
                <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '12px',
                    fontStyle: 'italic'
                }}>
                    {t('manifesto.subtitle')}
                </p>
            </motion.div>

            {/* Bölüm 1: Ateşin Başlangıcı */}
            <Section>
                <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '16px' }}>
                    {t('manifesto.section1.title')}
                </h3>
                <p style={{ whiteSpace: 'pre-line' }}>
                    {t('manifesto.section1.p1')}
                </p>
                <Quote>
                    <div style={{ whiteSpace: 'pre-line' }}>{t('manifesto.section1.quote')}</div>
                </Quote>
                <p style={{ whiteSpace: 'pre-line' }}>
                    <Trans
                        i18nKey="manifesto.section1.p2"
                        components={{ highlight: <Highlight children={undefined} /> }}
                    />
                </p>
                <p style={{ marginTop: '10px', whiteSpace: 'pre-line' }}>
                    {t('manifesto.section1.p3')}
                </p>
            </Section>

            {/* Bölüm 2: Eksik Olan */}
            <Section delay={0.1}>
                <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '16px' }}>
                    {t('manifesto.section2.title')}
                </h3>
                <p style={{ whiteSpace: 'pre-line' }}>
                    <Trans
                        i18nKey="manifesto.section2.p1"
                        components={{ highlight: <Highlight children={undefined} /> }}
                    />
                </p>
                <p style={{ marginTop: '12px', whiteSpace: 'pre-line' }}>
                    {t('manifesto.section2.p2')}
                </p>
                <Quote>
                    <div style={{ whiteSpace: 'pre-line' }}>{t('manifesto.section2.quote')}</div>
                </Quote>
            </Section>

            {/* Bölüm 3: TASTE'in Doğuşu */}
            <Section delay={0.15}>
                <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '16px' }}>
                    {t('manifesto.section3.title')}
                </h3>
                <p>
                    {t('manifesto.section3.p1')}
                </p>
                <p style={{ marginTop: '10px', whiteSpace: 'pre-line' }}>
                    <Trans
                        i18nKey="manifesto.section3.p2"
                        components={{ highlight: <Highlight children={undefined} /> }}
                    />
                </p>
                <Quote>
                    <div style={{ whiteSpace: 'pre-line' }}>{t('manifesto.section3.quote')}</div>
                </Quote>
            </Section>

            {/* Bölüm 4: Mutfağa Giriş */}
            <Section delay={0.2}>
                <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '16px' }}>
                    {t('manifesto.section4.title')}
                </h3>
                <div style={{
                    background: 'rgba(245, 159, 11, 0.08)',
                    border: '1px solid rgba(245, 159, 11, 0.15)',
                    borderRadius: '12px',
                    padding: '15px',
                    marginBottom: '12px'
                }}>
                    <p style={{ color: '#fff', fontWeight: '500', whiteSpace: 'pre-line' }}>
                        <Trans
                            i18nKey="manifesto.section4.box"
                            components={{ highlight: <Highlight children={undefined} /> }}
                        />
                    </p>
                </div>
                <p style={{ whiteSpace: 'pre-line' }}>
                    <Trans
                        i18nKey="manifesto.section4.p1"
                        components={{ highlight: <Highlight children={undefined} /> }}
                    />
                </p>
                <p style={{ marginTop: '12px' }}>
                    {t('manifesto.section4.p2')}
                </p>
                <Quote>
                    <div style={{ whiteSpace: 'pre-line' }}>{t('manifesto.section4.quote')}</div>
                </Quote>
                <p style={{ whiteSpace: 'pre-line' }}>
                    {t('manifesto.section4.p3')}
                </p>
            </Section>

            {/* Bölüm 5: Olgunlaşma */}
            <Section delay={0.25}>
                <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '16px' }}>
                    {t('manifesto.section5.title')}
                </h3>
                <Quote>
                    <div style={{ whiteSpace: 'pre-line' }}>{t('manifesto.section5.quote')}</div>
                </Quote>
            </Section>

            {/* Bölüm 6: Misyon */}
            <Section delay={0.3}>
                <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '16px' }}>
                    {t('manifesto.section6.title')}
                </h3>
                <p style={{ whiteSpace: 'pre-line' }}>
                    {t('manifesto.section6.p1')}
                </p>
                <div style={{
                    background: 'rgba(245, 159, 11, 0.08)',
                    border: '1px solid rgba(245, 159, 11, 0.15)',
                    borderRadius: '12px',
                    padding: '15px',
                    margin: '15px 0'
                }}>
                    <div style={{ color: '#fff', fontWeight: '600', lineHeight: '2' }}>
                        {(t('manifesto.section6.box', { returnObjects: true }) as string[]).map((text, i) => (
                            <div key={i}>
                                🔹 <Trans
                                    defaults={text}
                                    components={{ highlight: <Highlight children={undefined} /> }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <Quote>
                    <div style={{ whiteSpace: 'pre-line' }}>{t('manifesto.section6.quote')}</div>
                </Quote>
            </Section>

            {/* Bölüm 7: Fark */}
            <Section delay={0.35}>
                <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '16px' }}>
                    {t('manifesto.section7.title')}
                </h3>
                <p style={{ whiteSpace: 'pre-line' }}>
                    {t('manifesto.section7.p1')}
                </p>
                <Quote>
                    {t('manifesto.section7.quote')}
                </Quote>
                <p style={{ whiteSpace: 'pre-line' }}>
                    <Trans
                        i18nKey="manifesto.section7.p2"
                        components={{ highlight: <Highlight children={undefined} /> }}
                    />
                </p>
                <p style={{ marginTop: '10px', whiteSpace: 'pre-line' }}>
                    <Trans
                        i18nKey="manifesto.section7.p3"
                        components={{ highlight: <Highlight children={undefined} /> }}
                    />
                </p>
            </Section>

            {/* Bölüm 8: Yol */}
            <Section delay={0.4}>
                <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '16px' }}>
                    {t('manifesto.section8.title')}
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    margin: '15px 0'
                }}>
                    {(t('manifesto.section8.paths', { returnObjects: true }) as { icon: string, text: string }[]).map((item, i) => (
                        <div key={i} style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '10px',
                            padding: '12px',
                            textAlign: 'center',
                            fontSize: '12px'
                        }}>
                            <div style={{ fontSize: '22px', marginBottom: '6px' }}>{item.icon}</div>
                            <span style={{ color: '#fff', fontWeight: '500' }}>{item.text}</span>
                        </div>
                    ))}
                </div>
                <Quote>
                    <div style={{ whiteSpace: 'pre-line' }}>
                        <Trans
                            i18nKey="manifesto.section8.quote"
                            components={{ highlight: <Highlight children={undefined} /> }}
                        />
                    </div>
                </Quote>
                <p style={{ textAlign: 'center', color: '#fff', fontWeight: '500', marginTop: '10px', whiteSpace: 'pre-line' }}>
                    {t('manifesto.section8.p1', { defaultValue: 'True masters know:' })}
                    <br />
                    <Trans
                        i18nKey="manifesto.section8.p1"
                        components={{ highlight: <Highlight children={undefined} /> }}
                    />
                </p>
            </Section>

            {/* Bölüm 9: Final */}
            <Section delay={0.45}>
                <div style={{
                    textAlign: 'center',
                    padding: '10px 0'
                }}>
                    <div style={{ fontSize: '40px', marginBottom: '15px' }}>🔥</div>
                    <h3 style={{
                        color: '#fff',
                        fontSize: '18px',
                        fontWeight: '800',
                        marginBottom: '15px'
                    }}>
                        {t('manifesto.section9.title')}
                    </h3>
                    <p style={{ lineHeight: '2', fontSize: '15px', whiteSpace: 'pre-line' }}>
                        {t('manifesto.section9.p1')}
                    </p>
                    <div style={{
                        background: 'rgba(245, 159, 11, 0.1)',
                        border: '1px solid rgba(245, 159, 11, 0.2)',
                        borderRadius: '15px',
                        padding: '20px',
                        margin: '20px 0'
                    }}>
                        <p style={{ color: '#fff', fontWeight: '500', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                            <Trans
                                i18nKey="manifesto.section9.box"
                                components={{ highlight: <Highlight children={undefined} /> }}
                            />
                        </p>
                    </div>
                    <p style={{ lineHeight: '2', fontSize: '15px', whiteSpace: 'pre-line' }}>
                        {t('manifesto.section9.p2')}
                    </p>
                    <div style={{
                        marginTop: '25px',
                        padding: '20px',
                        background: 'var(--gradient-gold)',
                        borderRadius: '15px',
                        color: '#000'
                    }}>
                        <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                            {t('manifesto.section9.footer_q')}
                        </p>
                        <p style={{ fontSize: '17px', fontWeight: '900' }}>
                            {t('manifesto.section9.footer_a')}
                        </p>
                    </div>
                </div>
            </Section>
        </div>
    )
}
