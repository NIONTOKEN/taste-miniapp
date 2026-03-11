import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface Leader {
    name: string;
    value: number;
    rank: number;
}

export function Leaderboard() {
    const { t } = useTranslation()
    const [activeTab, setActiveTab] = useState<'balance' | 'referrals'>('balance');

    const balanceLeaders: Leader[] = [
        { name: "TasteWhale...4j2", value: 1420.5, rank: 1 },
        { name: "TonMaster...x91", value: 890.2, rank: 2 },
        { name: "EarlyAdopter...z12", value: 540.0, rank: 3 },
        { name: "ChefTaste...k88", value: 310.5, rank: 4 },
        { name: "CryptoFoodie...m21", value: 215.0, rank: 5 },
    ]

    const refLeaders: Leader[] = [
        { name: "ViralKing...7x8", value: 142, rank: 1 },
        { name: "Networker...22k", value: 89, rank: 2 },
        { name: "TasteAmbassador", value: 54, rank: 3 },
        { name: "John_Doe_TON", value: 31, rank: 4 },
        { name: "CryptoDavet", value: 25, rank: 5 },
    ]

    const leaders = activeTab === 'balance' ? balanceLeaders : refLeaders;

    return (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>🏆 {t('nav.leaderboard')}</h3>

            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
                <button
                    onClick={() => setActiveTab('balance')}
                    style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: activeTab === 'balance' ? 'var(--primary)' : 'none', color: activeTab === 'balance' ? '#000' : '#fff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    Balance
                </button>
                <button
                    onClick={() => setActiveTab('referrals')}
                    style={{ flex: 1, padding: '8px', border: 'none', borderRadius: '8px', background: activeTab === 'referrals' ? 'var(--primary)' : 'none', color: activeTab === 'referrals' ? '#000' : '#fff', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    Referrals
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <AnimatePresence mode="wait">
                    <motion.div key={activeTab} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        {leaders.map((user, idx) => (
                            <div
                                key={user.name}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px',
                                    background: idx === 0 ? 'rgba(245, 159, 11, 0.1)' : 'rgba(255,255,255,0.02)',
                                    borderRadius: '12px',
                                    border: idx === 0 ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.05)',
                                    marginBottom: '8px'
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
                                    {user.value} <span style={{ fontSize: '10px' }}>{activeTab === 'balance' ? 'TASTE' : 'Invite'}</span>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>

            <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', marginTop: '20px' }}>
                {activeTab === 'balance' ? "Kanka, her hafta ilk 3'e özel sürpriz ödüller var! 🎁" : "En çok davet edenler TASTE havuzundan pay alıyor! 🚀"}
            </p>
        </div>
    )
}
