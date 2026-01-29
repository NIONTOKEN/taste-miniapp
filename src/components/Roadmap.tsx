import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

export function Roadmap() {
    const { t } = useTranslation()

    const phases = ['q1', 'q2', 'q3', 'q4']

    return (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>🚀 {t('roadmap.title')}</h3>
            <div style={{ position: 'relative', paddingLeft: '30px' }}>
                {/* Vertical Line */}
                <div style={{
                    position: 'absolute',
                    left: '10px',
                    top: '0',
                    bottom: '0',
                    width: '2px',
                    background: 'var(--gradient-gold)',
                    opacity: 0.3
                }} />

                {phases.map((phase, idx) => (
                    <motion.div
                        key={phase}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        style={{ marginBottom: '25px', position: 'relative' }}
                    >
                        {/* Dot */}
                        <div style={{
                            position: 'absolute',
                            left: '-25px',
                            top: '5px',
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: 'var(--gradient-gold)',
                            boxShadow: '0 0 10px var(--primary-glow)'
                        }} />

                        <h4 style={{ margin: '0 0 5px 0', color: 'var(--primary)' }}>
                            {t(`roadmap.${phase}.title`)}
                        </h4>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)' }}>
                            {t(`roadmap.${phase}.desc`)}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
