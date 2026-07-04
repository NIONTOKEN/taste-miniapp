import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeft, Rocket, ShieldCheck, Zap, Info, 
    Globe, MessageCircle, Twitter, Check, AlertCircle, 
    Loader2, Sparkles, Coins, PlusSquare, Image as ImageIcon,
    ExternalLink, Search, BarChart3, Lock
} from 'lucide-react';
import { WALLET_CONFIG } from '../config';

import { calculateRiskScore } from '../listingService';

const ProjectListing = ({ onBack, t }) => {
    const [step, setStep] = useState('selection'); // selection | form | success
    const [plan, setPlan] = useState(null); // free | pro | boost
    
    const [formData, setFormData] = useState({
        contract: '',
        chain: 'TON',
        name: '',
        symbol: '',
        logo: '',
        website: '',
        twitter: '',
        telegram: '',
        description: '',
        decimals: '9'
    });

    const [loading, setLoading] = useState(false);
    const [riskReport, setRiskReport] = useState(null);
    const [error, setError] = useState('');

    // Token Analiz Motoru (Gerçek API Bağlantılı)
    const analyzeToken = async () => {
        if (!formData.contract) return;
        setLoading(true);
        setError('');
        
        try {
            const report = await calculateRiskScore(formData.contract, formData.chain.toLowerCase());
            
            if (report.error) {
                setError('Veri çekilemedi: ' + report.error);
                return;
            }

            setRiskReport(report);
            setStep('form');
        } catch (err) {
            setError('Token analizi sırasında bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    const handleListing = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep('success');
            
            // Yerel depolamaya (test için) kaydet
            const existingListings = JSON.parse(localStorage.getItem('user_listings') || '[]');
            existingListings.push({
                ...formData,
                id: Date.now(),
                plan,
                verified: plan !== 'free',
                riskScore: riskReport?.score || 50,
                createdAt: new Date().toISOString()
            });
            localStorage.setItem('user_listings', JSON.stringify(existingListings));
        }, 3000);
    };

    const ListingPlan = ({ id, title, price, features, color, popular }) => (
        <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setPlan(id); analyzeToken(); }}
            style={{ 
                background: 'var(--bg-card)', 
                padding: '25px', 
                borderRadius: '28px', 
                border: plan === id ? `2px solid ${color}` : '1px solid var(--glass-border)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                transition: 'border 0.3s'
            }}
        >
            {popular && (
                <div style={{ position: 'absolute', top: '15px', right: '-35px', background: color, color: '#fff', fontSize: '0.6rem', fontWeight: '900', padding: '5px 40px', transform: 'rotate(45deg)', boxShadow: `0 0 15px ${color}` }}>
                    EN ÇOK TERCİH EDİLEN
                </div>
            )}
            <h3 style={{ fontSize: '1.2rem', fontWeight: '900', marginBottom: '8px', color: color }}>{title}</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '20px' }}>{price === 0 ? 'FREE' : `${price} TASTE`}</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {features.map((f, i) => (
                    <li key={i} style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}>
                        <Check size={14} color={color} /> {f}
                    </li>
                ))}
            </ul>
        </motion.div>
    );

    if (step === 'success') {
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '30px', textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ width: '100px', height: '100px', background: 'rgba(34,197,94,0.1)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 30px' }}>
                    <Check size={50} color="#22c55e" strokeWidth={3} />
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '15px' }}>Başvuru Alındı!</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '40px', fontSize: '0.9rem', lineHeight: '1.6' }}>
                    Tokenınız sistemimiz tarafından analiz ediliyor. {plan === 'free' ? '24-48 saat' : '1-6 saat'} içerisinde değerlendirildikten sonra Keşif Hub'ında listelenecektir.
                </p>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '24px', border: '1px solid var(--glass-border)', marginBottom: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Referans No:</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: '900' }}>#QAI-{Math.floor(Math.random()*90000 + 10000)}</span>
                    </div>
                </div>
                <button onClick={onBack} style={{ width: '100%', padding: '20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '22px', fontWeight: '900', fontSize: '1.2rem' }}>TAMAM</button>
            </motion.div>
        );
    }

    return (
        <motion.div initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }} style={{ padding: '20px', paddingBottom: '120px', minHeight: '100vh', background: 'var(--bg-main)' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
                <ChevronLeft size={32} strokeWidth={3} onClick={onBack} style={{ cursor: 'pointer' }} />
                <h2 style={{ fontSize: '1.2rem', fontWeight: '900', margin: '0 auto', transform: 'translateX(-16px)' }}>Proje Listele</h2>
            </div>

            {loading && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(9,9,11,0.9)', zIndex: 2000, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}>
                        <Zap size={50} color="var(--primary)" />
                    </motion.div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '900' }}>Analiz Ediliyor...</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Blockchain verileri GoPlus & Dexscreener ile taranıyor.</p>
                </div>
            )}

            <AnimatePresence mode="wait">
                {step === 'selection' ? (
                    <motion.div key="selection" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                        <div style={{ marginBottom: '30px' }}>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '10px' }}>Bir Plan Seçin</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: '1.5' }}>Geleceğin tokenlarını QAI Hub'da birlikte keşfedelim. Listelemek istediğiniz projenin gücüne göre bir plan belirleyin.</p>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                            {/* Input for Contract before choosing */}
                            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '24px', border: '1px solid var(--glass-border)', marginBottom: '10px' }}>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '10px' }}>SÖZLEŞME ADRESİ (TOKEN ADDRESS)</label>
                                <input 
                                    type="text" value={formData.contract} onChange={(e) => setFormData({...formData, contract: e.target.value})}
                                    placeholder="0x... veya TON adresi"
                                    style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', fontSize: '0.9rem', fontWeight: 'bold', outline: 'none' }}
                                />
                            </div>

                            <ListingPlan 
                                id="free" title="Standart" price={0} color="#94a3b8" 
                                features={['Topluluk onaylı listeleme', '24-48 saat inceleme süresi', 'Temel risk skoru gösterimi']} 
                            />
                            <ListingPlan 
                                id="pro" title="Verified Pro" price={500000} color="var(--primary)" popular
                                features={['"Verified" mavi tik rozeti', 'Hızlı inceleme (1-6 saat)', 'Gelişmiş risk analizi raporu', 'Bot koruma uyarısı']} 
                            />
                            <ListingPlan 
                                id="boost" title="Ultimate Boost" price={1500000} color="#f59e0b" 
                                features={['Trending listesinde en üstte', '7 günlük ana sayfa vitrini', 'Anlık al-sat düğmesi aktif', 'Sosyal medya duyurusu']} 
                            />
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="form" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
                        <div style={{ background: 'rgba(34,197,94,0.1)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(34,197,94,0.2)', marginBottom: '25px' }}>
                           <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <ShieldCheck color="#22c55e" size={24} />
                              <div>
                                 <h4 style={{ margin: 0, fontSize: '0.9rem', color: '#22c55e' }}>Token Analiz Edildi (Score: {riskReport.score}/100)</h4>
                                 <span style={{ fontSize: '0.7rem', color: 'rgba(34,197,94,0.7)' }}>Şimdi proje detaylarını doldurabilirsiniz.</span>
                              </div>
                           </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <InputGroup label="Token Adı" value={formData.name} onChange={v => setFormData({...formData, name: v})} placeholder="Örn: Taste AI" />
                                <InputGroup label="Sembol" value={formData.symbol} onChange={v => setFormData({...formData, symbol: v})} placeholder="TASTE" />
                            </div>

                            <InputGroup label="Logo URL (IPFS veya HTTP)" value={formData.logo} onChange={v => setFormData({...formData, logo: v})} placeholder="https://..." />
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '8px', marginLeft: '5px' }}>AĞ (NETWORK)</label>
                                    <select 
                                        value={formData.chain} onChange={(e) => setFormData({...formData, chain: e.target.value})}
                                        style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '15px', padding: '15px', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                                    >
                                        <option value="TON">TON</option>
                                        <option value="ETH">Ethereum</option>
                                        <option value="BNB">BNB Chain</option>
                                        <option value="SOL">Solana</option>
                                        <option value="TRX">TRON</option>
                                        <option value="ARB">Arbitrum</option>
                                        <option value="BASE">Base</option>
                                        <option value="MATIC">Polygon</option>
                                        <option value="BTC">Bitcoin</option>
                                    </select>
                                </div>
                                <InputGroup label="Ondalık (Decimals)" value={formData.decimals} onChange={v => setFormData({...formData, decimals: v})} placeholder="9" />
                            </div>

                            <InputGroup label="Twitter / X Link" value={formData.twitter} onChange={v => setFormData({...formData, twitter: v})} placeholder="https://x.com/..." />
                            <InputGroup label="Telegram Link" value={formData.telegram} onChange={v => setFormData({...formData, telegram: v})} placeholder="https://t.me/..." />
                            <InputGroup label="Website" value={formData.website} onChange={v => setFormData({...formData, website: v})} placeholder="https://..." />
                            
                            <div>
                                <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '8px', marginLeft: '5px' }}>PROJE AÇIKLAMASI</label>
                                <textarea 
                                    value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
                                    placeholder="Projenizden kısaca bahsedin..."
                                    style={{ width: '100%', height: '100px', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '15px', color: '#fff', fontSize: '0.85rem', outline: 'none', resize: 'none' }}
                                />
                            </div>

                            <button 
                                onClick={handleListing}
                                style={{ width: '100%', marginTop: '20px', padding: '20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '22px', fontWeight: '900', fontSize: '1.2rem', boxShadow: '0 10px 25px var(--primary-glow)' }}
                            >
                                BAŞVURUYU TAMAMLA
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const InputGroup = ({ label, value, onChange, placeholder }) => (
    <div>
        <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-muted)', marginBottom: '8px', marginLeft: '5px' }}>{label}</label>
        <input 
            type="text" value={value} onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '15px', padding: '15px', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
        />
    </div>
);

export default ProjectListing;
