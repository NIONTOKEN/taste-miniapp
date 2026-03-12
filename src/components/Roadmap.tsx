import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export function Roadmap() {
    const { t } = useTranslation()

    // ─── Tamamlanan işler (gerçek, kanıtlı) ───────────────────────────────────
    const COMPLETED = [
        { emoji: '🪙', key: 'mint' },
        { emoji: '💧', key: 'lp' },
        { emoji: '🔒', key: 'lock' },
        { emoji: '🛡️', key: 'security' },
        { emoji: '📱', key: 'miniapp' },
        { emoji: '🎁', key: 'airdrop' },
        { emoji: '📄', key: 'documents' },
        { emoji: '🌐', key: 'social' },
        { emoji: '🐾', key: 'stray' },
        { emoji: '🍽️', key: 'food_sharing' },
        { emoji: '👛', key: 'wallets' },
        { emoji: '⚠️', key: 'allergen' },
        { emoji: '🚀', key: 'v2' },
    ]

    // ─── Devam eden & yakın plan (gerçekçi) ──────────────────────────────────
    const ONGOING = [
        { emoji: '🌱', key: 'growth' },
        { emoji: '🔗', key: 'visibility' },
        { emoji: '📊', key: 'reporting' },
        { emoji: '🛠️', key: 'dev' },
    ]

    const philosophy = t('roadmap.philosophy', { returnObjects: true }) as string[]

    return (
        <div>
            {/* Felsefe Banner */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                    background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04))',
                    border: '1px solid rgba(245,158,11,0.25)',
                    borderRadius: '16px',
                    padding: '18px',
                    marginBottom: '24px',
                }}
            >
                <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px' }}>
                    {t('roadmap.philosophy_title')}
                </div>
                {Array.isArray(philosophy) && philosophy.map((p, i) => (
                    <div key={i} style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.7, marginBottom: '4px' }}>{p}</div>
                ))}
            </motion.div>

            {/* Tamamlananlar */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ height: 1, flex: 1, background: 'rgba(34,197,94,0.2)' }} />
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '2px', flexShrink: 0 }}>
                        ✅ {t('roadmap.completed_goals')}
                    </div>
                    <div style={{ height: 1, flex: 1, background: 'rgba(34,197,94,0.2)' }} />
                </div>

                <div style={{ position: 'relative', paddingLeft: '28px' }}>
                    {/* Timeline line */}
                    <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, #22c55e, #22c55e40)', borderRadius: 2 }} />

                    {COMPLETED.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -16 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            style={{ marginBottom: '16px', position: 'relative' }}
                        >
                            {/* Dot */}
                            <div style={{
                                position: 'absolute', left: -24, top: 4,
                                width: 12, height: 12, borderRadius: '50%',
                                background: '#22c55e',
                                boxShadow: '0 0 8px rgba(34,197,94,0.5)'
                            }} />
                            <div style={{ fontWeight: 700, fontSize: '13px', color: '#fff', marginBottom: '3px' }}>
                                {item.emoji} {t(`roadmap.items.${item.key}.title`)}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>
                                {t(`roadmap.items.${item.key}.desc`)}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Devam Eden */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ height: 1, flex: 1, background: 'rgba(245,158,11,0.2)' }} />
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '2px', flexShrink: 0 }}>
                        🔄 {t('roadmap.ongoing')}
                    </div>
                    <div style={{ height: 1, flex: 1, background: 'rgba(245,158,11,0.2)' }} />
                </div>

                <div style={{ position: 'relative', paddingLeft: '28px' }}>
                    <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, #f59e0b, #f59e0b40)', borderRadius: 2 }} />

                    {ONGOING.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -16 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.07 }}
                            style={{ marginBottom: '16px', position: 'relative' }}
                        >
                            <div style={{
                                position: 'absolute', left: -24, top: 4,
                                width: 12, height: 12, borderRadius: '50%',
                                background: '#f59e0b',
                                boxShadow: '0 0 8px rgba(245,158,11,0.5)'
                            }} />
                            <div style={{ fontWeight: 700, fontSize: '13px', color: '#fff', marginBottom: '3px' }}>
                                {item.emoji} {t(`roadmap.items.${item.key}.title`)}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>
                                {t(`roadmap.items.${item.key}.desc`)}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Dipnot */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    fontSize: '12px',
                    color: '#64748b',
                    lineHeight: 1.7,
                    textAlign: 'center'
                }}
            >
                {t('roadmap.footer_text')}<br />
                <strong style={{ color: '#f59e0b' }}>{t('roadmap.footer_bold')}</strong>
            </motion.div>
        </div>
    )
}
