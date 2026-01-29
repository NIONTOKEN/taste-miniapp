import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

export function Whitepaper() {
    const { t } = useTranslation()

    return (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>📄 {t('whitepaper.title')}</h3>

            {/* Branding Image */}
            <div style={{ marginBottom: '25px', borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(255,193,7,0.2)' }}>
                <img
                    src="/info_branding.jpg"
                    alt="Taste Branding"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ marginBottom: '25px' }}
            >
                <h4 style={{ color: 'var(--primary)', marginBottom: '10px' }}>
                    📖 {t('whitepaper.general_info.title')}
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.6', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', borderLeft: '4px solid var(--primary)' }}>
                    {t('whitepaper.general_info.content')}
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ marginBottom: '25px' }}
            >
                <h4 style={{ color: 'var(--primary)', marginBottom: '10px' }}>
                    ✨ {t('whitepaper.vision.title')}
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    {t('whitepaper.vision.content')}
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                style={{ marginBottom: '25px' }}
            >
                <h4 style={{ color: 'var(--primary)', marginBottom: '10px' }}>
                    🎯 {t('whitepaper.mission.title')}
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    {t('whitepaper.mission.content')}
                </p>
            </motion.div>

            {/* Team Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ marginBottom: '25px' }}
            >
                <h4 style={{ color: 'var(--primary)', marginBottom: '15px' }}>
                    👥 {t('whitepaper.team.title')}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '16px', color: 'var(--primary)' }}>{t('whitepaper.team.fatih.name')}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('whitepaper.team.fatih.role')}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '16px', color: 'var(--primary)' }}>{t('whitepaper.team.angel.name')}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('whitepaper.team.angel.role')}</div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                style={{ marginBottom: '25px' }}
            >
                <h4 style={{ color: 'var(--primary)', marginBottom: '10px' }}>
                    📊 {t('whitepaper.tokenomics.title')}
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--primary)', marginBottom: '10px', fontWeight: 'bold' }}>
                    {t('whitepaper.tokenomics.initial_supply')}
                </p>
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '12px',
                    padding: '10px',
                    fontSize: '13px',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span>{t('whitepaper.tokenomics.allocation.locked')}</span>
                        <span style={{ fontWeight: 'bold' }}>18,000,000</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span>{t('whitepaper.tokenomics.allocation.liquidity')}</span>
                        <span style={{ fontWeight: 'bold' }}>5,000,000</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span>{t('whitepaper.tokenomics.allocation.rewards')}</span>
                        <span style={{ fontWeight: 'bold' }}>1,000,000</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                        <span>{t('whitepaper.tokenomics.allocation.owner')}</span>
                        <span style={{ fontWeight: 'bold' }}>1,000,000</span>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
            >
                <h4 style={{ color: 'var(--primary)', marginBottom: '10px' }}>
                    🛡️ {t('whitepaper.supply_policy.title')}
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '10px' }}>
                    {t('whitepaper.supply_policy.content')}
                </p>
                <div style={{ fontSize: '10px', color: 'var(--primary)', opacity: 0.7, wordBreak: 'break-all', fontFamily: 'monospace', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '8px' }}>
                    EQDZl...6sc (Main Wallet)<br />
                    EQDKK...Yov2 (Locked)
                </div>
            </motion.div>

            <div style={{
                marginTop: '30px',
                padding: '15px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                fontSize: '12px',
                color: 'var(--text-muted)',
                textAlign: 'center',
                border: '1px dashed rgba(255,255,255,0.1)'
            }}>
                <div style={{ marginBottom: '10px', color: 'var(--primary)', fontWeight: 'bold', wordBreak: 'break-all' }}>
                    📄 Contract: <span style={{ color: 'var(--text-main)', userSelect: 'all' }}>EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-</span>
                </div>
                {t('app.description')}
            </div>
        </div>
    )
}
