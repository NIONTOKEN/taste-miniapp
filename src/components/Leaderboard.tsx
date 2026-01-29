import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface Leader {
    name: string;
    balance: number;
    rank: number;
}

export function Leaderboard() {
    const { t } = useTranslation()

    const leaders: Leader[] = [
        { name: "TasteWhale...4j2", balance: 1420.5, rank: 1 },
        { name: "TonMaster...x91", balance: 890.2, rank: 2 },
        { name: "EarlyAdopter...z12", balance: 540.0, rank: 3 },
        { name: "ChefTaste...k88", balance: 310.5, rank: 4 },
        { name: "CryptoFoodie...m21", balance: 215.0, rank: 5 },
    ]

    return (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>🏆 {t('nav.leaderboard') || 'Leaderboard'}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {leaders.map((user, idx) => (
                    <motion.div
                        key={user.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px',
                            background: idx === 0 ? 'rgba(245, 159, 11, 0.1)' : 'rgba(255,255,255,0.02)',
                            borderRadius: '12px',
                            border: idx === 0 ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{
                                width: '24px',
                                height: '24px',
                                display: 'grid',
                                placeItems: 'center',
                                borderRadius: '50%',
                                background: idx < 3 ? 'var(--gradient-gold)' : 'rgba(255,255,255,0.1)',
                                color: idx < 3 ? '#000' : '#fff',
                                fontWeight: 'bold',
                                fontSize: '12px'
                            }}>
                                {user.rank}
                            </span>
                            <span style={{ fontSize: '14px', fontWeight: '500' }}>{user.name}</span>
                        </div>
                        <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>
                            {user.balance} <span style={{ fontSize: '10px' }}>TASTE</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '20px' }}>
                Kanka, her hafta ilk 3'e özel sürpriz ödüller var! 🎁
            </p>
        </div>
    )
}
