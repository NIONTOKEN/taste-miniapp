import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export function LiveMarketData() {
    const { t } = useTranslation()
    const poolAddress = 'EQCGEHrBuuoKVJ_0LqQy38F-c-pN-Jrz0M_ASdCtJxZL74nS'
    const embedUrl = `https://www.geckoterminal.com/ton/pools/${poolAddress}?embed=1&info=1&swaps=0&grayscale=0&light_chart=0&chart_type=price&resolution=15m`

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="market-card"
            style={{
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(10px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '10px',
                marginBottom: '20px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', padding: '0 5px' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)' }}>📈 {t('market.live_chart') || 'Live Market Analysis'}</span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Powered by GeckoTerminal</span>
            </div>

            <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: '12px', overflow: 'hidden' }}>
                <iframe
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    id="geckoterminal-embed"
                    title="TASTE / TON Chart"
                    src={embedUrl}
                    allow="clipboard-write"
                    allowFullScreen
                ></iframe>
            </div>

            <div style={{ marginTop: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Liquidity (STON.fi)</div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold' }}>STON.fi</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Status</div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#10b981' }}>✅ Verified</div>
                </div>
            </div>
        </motion.div>
    )
}
