import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ExternalLink, Handshake, MapPin, Building, Megaphone, Stethoscope, ShoppingBag, GraduationCap, Rocket } from 'lucide-react'

export function Partners() {
    const { t, i18n } = useTranslation()
    const isTr = i18n.language?.startsWith('tr')

    const openLink = (url: string) => {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.openLink(url);
        } else {
            window.open(url, '_blank');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
                    {isTr
                        ? "TASTE ekosisteminin gerçek dünyadaki kullanım alanlarını genişleten ve Web3 dönüşümüne öncülük eden resmi iş ortaklarımız."
                        : "Our official partners expanding the real-world utility of the TASTE ecosystem and leading the Web3 transition."}
                </p>
            </div>

            {/* Panoda Şehir Partner Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Glow Effect */}
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(20px)', pointerEvents: 'none' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                            <MapPin size={28} color="#3b82f6" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#fff' }}>Panoda Şehir</h3>
                            <div style={{ fontSize: '12px', color: '#3b82f6', fontWeight: 700, letterSpacing: '0.5px', marginTop: '4px' }}>
                                {isTr ? 'RESMİ WEB3 PARTNERİ' : 'OFFICIAL WEB3 PARTNER'}
                            </div>
                        </div>
                    </div>
                </div>

                <p style={{ color: 'var(--text-main)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                    {isTr
                        ? "Şehrin nabzını tutan sanal not paylaşım platformu. Eğitim, kültür/sanat, sağlık, emlak ve kayıp ilanlarına kadar günlük hayata dair her şey burada. TASTE Token'ın gerçek dünyadaki alışveriş ve sadakat puanı entegrasyonları için güçlerimizi birleştirdik."
                        : "The virtual note-sharing platform keeping the pulse of the city. From education and arts to health and real estate. We joined forces to integrate TASTE Token for real-world shopping and loyalty programs."}
                </p>

                {/* Categories/Features */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                    {[
                        { icon: GraduationCap, label: isTr ? 'Eğitim' : 'Education', color: '#10b981' },
                        { icon: ShoppingBag, label: isTr ? 'Alışveriş' : 'Shopping', color: '#f59e0b' },
                        { icon: Megaphone, label: isTr ? 'İlanlar' : 'Notices', color: '#ef4444' },
                        { icon: Stethoscope, label: isTr ? 'Sağlık' : 'Health', color: '#3b82f6' },
                        { icon: Building, label: isTr ? 'Güzellik' : 'Beauty', color: '#ec4899' },
                        { icon: Rocket, label: 'Web3 Ready', color: '#8b5cf6' }
                    ].map((Feature, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)', padding: '10px 4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Feature.icon size={18} color={Feature.color} />
                            <span style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8' }}>{Feature.label}</span>
                        </div>
                    ))}
                </div>

                {/* Action Card inside Partner */}
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
                    <div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                            {isTr ? 'Şehrin Dijital Panosu' : 'Digital City Board'}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {isTr ? 'İlanları keşfet veya yeni ilan ver.' : 'Discover notices or post a new one.'}
                        </div>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openLink('https://www.panodasehir.com')}
                        style={{
                            background: '#3b82f6',
                            color: '#fff',
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                        }}
                    >
                        {isTr ? 'Ziyaret Et' : 'Visit Site'} <ExternalLink size={14} />
                    </motion.button>
                </div>
            </motion.div>
        </div>
    )
} 
