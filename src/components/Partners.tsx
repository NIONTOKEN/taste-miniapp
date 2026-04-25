import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ExternalLink, MapPin, Building, Megaphone, Stethoscope, ShoppingBag, GraduationCap, Rocket, Brain, Cpu, Layers, Link2, Wallet, Shield, Zap, Globe } from 'lucide-react'

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

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.showAlert(isTr ? 'Adres kopyalandı!' : 'Address copied!');
        } else {
            alert(isTr ? 'Adres kopyalandı!' : 'Address copied!');
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

            {/* NION Partner Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{
                    background: 'linear-gradient(145deg, rgba(30, 0, 80, 0.4), rgba(15, 23, 42, 0.9))',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Glow Effect */}
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(20px)', pointerEvents: 'none' }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                            <Brain size={28} color="#8b5cf6" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#fff' }}>NION PROJECT</h3>
                            <div style={{ fontSize: '12px', color: '#8b5cf6', fontWeight: 700, letterSpacing: '0.5px', marginTop: '4px' }}>
                                {isTr ? 'STRATEJİK AI VE TEKNOLOJİ PARTNERİ' : 'STRATEGIC AI & TECH PARTNER'}
                            </div>
                        </div>
                    </div>
                </div>

                <p style={{ color: 'var(--text-main)', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                    {isTr
                        ? "TASTE ekosisteminin teknoloji ve yapay zeka kanadını temsil eden NION, Solana ağındaki vizyoner projelerden biridir. Geleceğin dijital varlıkları ve AI entegrasyonları için TASTE ile omuz omuza bir gelişim süreci içerisindeyiz."
                        : "Representing the technology and AI wing of the TASTE ecosystem, NION is a visionary project on the Solana network. We are in a strategic growth process alongside TASTE for future digital assets and AI integrations."}
                </p>

                {/* Categories/Features */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '24px', position: 'relative', zIndex: 1 }}>
                    {[
                        { icon: Brain, label: 'AI Engine', color: '#a78bfa' },
                        { icon: Cpu, label: 'Tech Lab', color: '#8b5cf6' },
                        { icon: Layers, label: 'Cross-Chain', color: '#c084fc' }
                    ].map((Feature, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)', padding: '10px 4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <Feature.icon size={18} color={Feature.color} />
                            <span style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8' }}>{Feature.label}</span>
                        </div>
                    ))}
                </div>

                {/* SOLANA ADDRESS SECTION */}
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '16px', border: '1px dotted rgba(139, 92, 246, 0.4)', position: 'relative', zIndex: 1, cursor: 'pointer' }} onClick={() => copyToClipboard('6f2qxhXjPLmz4kPhgz1WnyGNEzMSSGAtV4SGdUaDpump')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <Link2 size={14} color="#8b5cf6" />
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#8b5cf6', letterSpacing: '1px' }}>SOLANA CONTRACT ADDRESS</span>
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace', wordBreak: 'break-all', opacity: 0.8 }}>
                        6f2qxhXjPLmz4kPhgz1WnyGNEzMSSGAtV4SGdUaDpump
                    </div>
                    <div style={{ marginTop: '8px', fontSize: '9px', color: '#64748b', textAlign: 'right', fontWeight: 800 }}>
                        {isTr ? '📑 KOPYALAMAK İÇİN DOKUN' : '📑 CLICK TO COPY'}
                    </div>
                </div>

                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openLink('https://dexscreener.com/solana/6f2qxhXjPLmz4kPhgz1WnyGNEzMSSGAtV4SGdUaDpump')}
                        style={{
                            background: 'transparent',
                            color: '#8b5cf6',
                            border: '1px solid #8b5cf6',
                            padding: '8px 16px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            margin: '0 auto'
                        }}
                    >
                        {isTr ? 'Görüntele' : 'View Chart'} <ExternalLink size={12} />
                    </motion.button>
                </div>
            </motion.div>

            {/* QAI Wallet Partner Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{
                    background: 'linear-gradient(145deg, rgba(8, 16, 50, 0.9), rgba(5, 10, 35, 0.95))',
                    border: '1px solid rgba(56, 139, 253, 0.4)',
                    borderRadius: '24px',
                    padding: '24px',
                    boxShadow: '0 10px 40px rgba(56, 139, 253, 0.15)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Glow effects */}
                <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(56,139,253,0.2) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(30px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(120,80,255,0.15) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(25px)', pointerEvents: 'none' }} />

                {/* NEW PARTNER badge */}
                <div style={{
                    position: 'absolute', top: '16px', right: '16px',
                    background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
                    color: '#fff', fontSize: '9px', fontWeight: 900,
                    padding: '4px 10px', borderRadius: '20px',
                    letterSpacing: '1px', zIndex: 2,
                    boxShadow: '0 2px 10px rgba(59,130,246,0.5)'
                }}>
                    🆕 {isTr ? 'YENİ ORTAK' : 'NEW PARTNER'}
                </div>

                {/* Header - Logo yazı olarak */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '18px',
                        border: '2px solid rgba(56,139,253,0.5)',
                        background: 'linear-gradient(135deg, #0a1440, #0d1a5e)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 4px 20px rgba(56,139,253,0.3)'
                    }}>
                        <span style={{ fontSize: '18px', fontWeight: 900, background: 'linear-gradient(90deg, #3b82f6, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 }}>QAI</span>
                        <span style={{ fontSize: '9px', fontWeight: 800, color: '#60a5fa', letterSpacing: '1px', marginTop: '2px' }}>WALLET</span>
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
                            <span style={{ background: 'linear-gradient(90deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>QAI</span>
                            {' '}
                            <span style={{ color: '#fff' }}>WALLET</span>
                        </h3>
                        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.8px', marginTop: '4px', color: '#60a5fa' }}>
                            {isTr ? 'STRATEJİK WEB4 FİNANS PARTNERİ' : 'STRATEGIC WEB4 FINANCE PARTNER'}
                        </div>
                        <div style={{ fontSize: '10px', color: '#475569', marginTop: '3px', fontStyle: 'italic' }}>
                            "The Future of Web4 Finance"
                        </div>
                    </div>
                </div>

                {/* Description */}
                <p style={{ color: 'var(--text-main)', fontSize: '14px', lineHeight: '1.7', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                    {isTr
                        ? "QAI Wallet, yapay zeka destekli Web4 finans altyapısıyla kripto dünyasını yeniden tanımlıyor. TASTE Token ile kurduğumuz stratejik ortaklık; ödeme sistemleri, AI tabanlı portföy yönetimi ve çok zincirli varlık transferleri alanında güçlü bir sinerji yaratıyor."
                        : "QAI Wallet redefines the crypto world with its AI-powered Web4 financial infrastructure. Our strategic partnership with TASTE Token creates powerful synergy in payment systems, AI-based portfolio management, and multi-chain asset transfers."}
                </p>

                {/* Feature pills */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                    {[
                        { icon: '💼', label: isTr ? 'Cüzdan' : 'Wallet', color: '#3b82f6' },
                        { icon: '🤖', label: 'AI Powered', color: '#a78bfa' },
                        { icon: '🔒', label: isTr ? 'Güvenli' : 'Secure', color: '#10b981' },
                        { icon: '🌐', label: 'Web4', color: '#f59e0b' },
                    ].map((f, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.03)', padding: '10px 4px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <span style={{ fontSize: '18px' }}>{f.icon}</span>
                            <span style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textAlign: 'center' }}>{f.label}</span>
                        </div>
                    ))}
                </div>

                {/* Partnership highlight */}
                <div style={{
                    background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(124,58,237,0.08))',
                    border: '1px solid rgba(59,130,246,0.2)',
                    borderRadius: '16px', padding: '14px 16px',
                    marginBottom: '16px', position: 'relative', zIndex: 1
                }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', letterSpacing: '0.5px', marginBottom: '6px' }}>
                        ⚡ {isTr ? 'ORTAKLIK AVANTAJLARI' : 'PARTNERSHIP BENEFITS'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.7' }}>
                        {isTr
                            ? '✦ TASTE Token entegrasyonu  ✦ AI portföy yönetimi  ✦ Çapraz zincir transferler'
                            : '✦ TASTE Token integration  ✦ AI portfolio management  ✦ Cross-chain transfers'}
                    </div>
                </div>

                {/* CTA */}
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => openLink('mailto:qaiwallet4@gmail.com')}
                    style={{
                        width: '100%',
                        background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
                        color: '#fff',
                        border: 'none',
                        padding: '14px 20px',
                        borderRadius: '14px',
                        fontSize: '13px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
                        position: 'relative', zIndex: 1
                    }}
                >
                    ✉️ qaiwallet4@gmail.com
                </motion.button>
            </motion.div>
        </div>
    )
} 
