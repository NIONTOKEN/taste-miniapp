import { useEffect, useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react'

import { VoteDiscovery } from './components/VoteDiscovery'
import { Roadmap } from './components/Roadmap'
import { Whitepaper } from './components/Whitepaper'
import { Manifesto } from './components/Manifesto'
import { LiveMarketData } from './components/LiveMarketData'
import { SpinWheel } from './components/SpinWheel'
import { Charity } from './components/Charity'
import { TokenAllocation } from './components/TokenAllocation'
import { Legal } from './components/Legal'
import { TasteAI } from './components/TasteAI'
import { TasteChef } from './components/TasteChef'
import { DisclaimerModal, shouldShowDisclaimer } from './components/DisclaimerModal'
import { PoweredBy } from './components/PoweredBy'
import { Community } from './components/Community'
import { TasteJobs } from './components/TasteJobs'
import { WalletTransfer } from './components/WalletTransfer'
import { PriceTicker } from './components/PriceTicker'
import { CountdownTimer } from './components/CountdownTimer'
import { RewardCountdown } from './components/RewardCountdown'
import { Partners } from './components/Partners'
import {
  Home,
  Map,
  FileText,
  Flame,
  Gift,
  Heart,
  Scale,
  Bot,
  LayoutGrid,
  X,
  HelpCircle,
  Cpu,
  ExternalLink,
  QrCode,
  ChefHat,
  Briefcase,
  Trophy,
  Users,
  ArrowDown,
  Handshake
} from 'lucide-react'
import { apiService } from './services/api'

const TASTE_LOGO = '/logo.jpg'


function App() {
  const { t, i18n } = useTranslation();

  const [amount, setAmount] = useState(1);
  const [holdersCount, setHoldersCount] = useState<string>('...');
  const [activeTab, setActiveTab] = useState<'home' | 'manifesto' | 'roadmap' | 'whitepaper' | 'spin' | 'charity' | 'legal' | 'ai' | 'faq' | 'tech' | 'wallet' | 'chef' | 'vote' | 'community' | 'partners'>('home');
  const [disclaimerVisible, setDisclaimerVisible] = useState<boolean>(shouldShowDisclaimer());
  const [tonConnectUI] = useTonConnectUI();
  const [showPing, setShowPing] = useState(false);
  const [pingAmount, setPingAmount] = useState(0);
  const [tastePerTon, setTastePerTon] = useState(741); // default fallback
  const [tonUsdPrice, setTonUsdPrice] = useState(3.5); // live TON price

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Language Persistence & Initialization
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      try {
        tg.setHeaderColor('#0a0f1c');
        tg.setBackgroundColor('#0a0f1c');
      } catch (e) { }

      const savedLang = localStorage.getItem('i18nextLng');
      if (!savedLang) {
        // 1) Try Telegram user language
        const tgLang = tg.initDataUnsafe?.user?.language_code;
        // 2) Fallback: browser/system language
        const browserLang = navigator.language || (navigator as any).userLanguage || 'en';
        const detectedLang = tgLang || browserLang;
        
        if (detectedLang?.startsWith('tr')) {
          i18n.changeLanguage('tr');
        } else {
          // For all other languages (Arabic, Russian, German, etc.) — use English
          // as we don't have translations yet, but detect & store for future
          i18n.changeLanguage('en');
        }
      }
    }
  }, []);

  // Fetch holders count + TASTE per TON calculation
  useEffect(() => {
    const fetchData = async () => {
      const JETTON_ADDRESS = import.meta.env.VITE_JETTON_ADDRESS || 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-';
      try {
        const holders = await apiService.getJettonHolders(JETTON_ADDRESS);
        setHoldersCount(holders);
      } catch (e) {
        setHoldersCount('1,248+');
      }
      // Fetch live TON price + calculate TASTE per TON
      try {
        const [priceData, liveTonPrice] = await Promise.all([
          apiService.getTastePrice(),
          apiService.getTonPrice(),
        ]);
        if (liveTonPrice > 0) setTonUsdPrice(liveTonPrice);
        if (priceData.price > 0 && liveTonPrice > 0) {
          setTastePerTon(Math.round(liveTonPrice / priceData.price));
        }
      } catch (e) { /* keep defaults */ }
    };
    fetchData();
  }, [tonConnectUI.account?.address]);

  const languages = [
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', label: 'English (US)', flag: '🇺🇸' },
  ];

  const currentLangCode = i18n.language?.split('-')[0] || 'en';
  const currentLang = languages.find(l => l.code === currentLangCode) || languages[1];
  const isRTL = false; // Arabic removed

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setShowLangMenu(false);
  };

  const handleBuy = () => {
    // Show ping notification with estimated TASTE amount
    setPingAmount(Math.round(amount * tastePerTon));
    setShowPing(true);
    setTimeout(() => setShowPing(false), 3000);

    // STON.fi swap via Tonkeeper deep link
    const SWAP_URL = 'https://app.tonkeeper.com/dapp/https%3A%2F%2Fapp.ston.fi%2Fswap%3FchartVisible%3Dfalse%26ft%3DTON%26tt%3DEQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-';

    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(SWAP_URL);
    } else {
      window.open(SWAP_URL, '_blank');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <motion.div key="home" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            {/* Hero (Logo & Intro) */}
            <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: '10px' }}>
              <div style={{ position: 'relative', width: '140px', height: '140px', margin: '0 auto 10px' }}>
                <svg viewBox="0 0 180 180" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', animation: 'spin-text 12s linear infinite' }}>
                  <defs>
                    <path id="circlePath" d="M 90,90 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
                    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f59e0b" /><stop offset="50%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#f59e0b" />
                    </linearGradient>
                  </defs>
                  <text fill="url(#goldGradient)" fontSize="13" fontWeight="800" letterSpacing="5">
                    <textPath href="#circlePath" startOffset="0%">TASTE • TOKEN • TASTE • TOKEN •</textPath>
                  </text>
                </svg>
                <motion.div
                  animate={{ y: [0, -6, 0], scale: [1, 1.03, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    width: '85px', height: '85px', borderRadius: '50%', boxShadow: '0 0 30px var(--primary-glow)',
                    border: '4px solid rgba(245, 159, 11, 0.3)', overflow: 'hidden'
                  }}
                >
                  <video src="/logo-gif.mp4" autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                </motion.div>
              </div>
              <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '13px' }}>{t('app.description')}</p>
            </div>

            {/* Intro Video - Compact Card */}
            <motion.div className="glass-panel" style={{ padding: '8px', borderRadius: '20px', marginBottom: '20px', background: 'rgba(15, 23, 42, 0.6)' }}>
              <video
                src="/taste-intro.mp4" controls playsInline preload="metadata" poster={TASTE_LOGO}
                style={{ width: '100%', borderRadius: '16px', maxHeight: '200px', objectFit: 'cover' }}
              />
            </motion.div>

            {/* Asansör Konuşması (Pitch) - Ana Sayfa Versiyonu */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                style={{ 
                    marginBottom: '25px',
                    padding: '20px',
                    background: 'linear-gradient(135deg, rgba(245,159,11,0.08), rgba(0,0,0,0.3))',
                    border: '1px solid rgba(245,159,11,0.2)',
                    borderRadius: '24px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                    <h4 style={{ color: '#f59e0b', fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        🤔 {t('whitepaper.pitch.title')}
                    </h4>
                </div>
                
                <p style={{ fontSize: '13px', color: 'var(--text-main)', lineHeight: '1.6', whiteSpace: 'pre-line', marginBottom: '12px', textAlign: 'center' }}>
                    {t('whitepaper.pitch.text1')}
                </p>
                
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ fontSize: '13px', color: '#fcd34d', lineHeight: '1.6', margin: 0 }}>
                        <Trans
                            i18nKey="whitepaper.pitch.text2"
                            components={{ highlight: <span style={{ color: '#f59e0b', fontWeight: 800 }} /> }}
                        />
                    </p>
                </div>

                <div style={{ textAlign: 'center', margin: '15px 0' }}>
                    <Trans
                        i18nKey="whitepaper.pitch.text4"
                        components={{ highlight: <span style={{ color: '#22c55e', fontWeight: 900, fontSize: '14px', display: 'block' }} /> }}
                    />
                </div>

                <div style={{ textAlign: 'center', background: 'var(--gradient-gold)', padding: '12px', borderRadius: '12px', color: '#000' }}>
                    <Trans
                        i18nKey="whitepaper.pitch.text6"
                        components={{ highlight: <strong style={{ display: 'block', fontSize: '14px', marginTop: '4px', fontWeight: 900 }} /> }}
                    />
                </div>
            </motion.div>

            {/* Premium Swap Widget */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="glass-panel swap-widget-premium" 
              style={{ 
                padding: '24px', 
                marginBottom: '20px', 
                borderRadius: '28px', 
                background: 'linear-gradient(160deg, rgba(20,30,48,0.9), rgba(36,59,85,0.9))', 
                border: '1px solid rgba(245, 159, 11, 0.4)',
                boxShadow: '0 10px 40px rgba(245, 159, 11, 0.2), inset 0 0 20px rgba(245, 159, 11, 0.05)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Glow effects */}
              <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'radial-gradient(circle, rgba(245, 159, 11, 0.25) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(20px)', pointerEvents: 'none' }} />
              <div style={{ position: 'absolute', bottom: '-50px', left: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(20px)', pointerEvents: 'none' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ 
                      fontSize: '24px', 
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      filter: 'drop-shadow(0 2px 5px rgba(245,159,11,0.5))'
                    }}
                  >
                    ⚡
                  </motion.div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, letterSpacing: '0.5px' }}>TASTE SWAP</h3>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#10b981', background: 'rgba(16,185,129,0.15)', padding: '6px 12px', borderRadius: '14px', fontWeight: 800, border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 0 10px rgba(16,185,129,0.2)' }}>
                  <span style={{ position: 'relative', display: 'flex', width: '8px', height: '8px' }}>
                    <span style={{ animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite', position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: '#10b981', opacity: 0.75 }}></span>
                    <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '8px', width: '8px', backgroundColor: '#10b981' }}></span>
                  </span>
                  TON: ${tonUsdPrice.toFixed(2)}
                </div>
              </div>

              {/* Pay Area */}
              <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '20px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.08)', position: 'relative', zIndex: 1 }}>
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 800 }}>{t('app.units.pay')}</div>
                  <AnimatePresence mode="wait">
                    <motion.span key={amount} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} style={{ fontSize: '32px', fontWeight: '900', color: '#fff', textShadow: '0 2px 15px rgba(255,255,255,0.2)' }}>
                      {amount}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(59, 130, 246, 0.15)', padding: '8px 14px', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.3)', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.2)' }}>
                  <img src="https://ton.org/download/ton_symbol.png" alt="TON" style={{ width: 22, height: 22, filter: 'drop-shadow(0 2px 5px rgba(59, 130, 246, 0.5))' }} />
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#60a5fa' }}>TON</span>
                </div>
              </div>

              {/* Swap Arrow Icon */}
              <div style={{ display: 'flex', justifyContent: 'center', margin: '-14px 0', position: 'relative', zIndex: 2 }}>
                <motion.div 
                  animate={{ y: [0, 4, 0] }} 
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ background: '#0f172a', padding: '8px', borderRadius: '50%', border: '2px solid rgba(245, 159, 11, 0.5)', boxShadow: '0 4px 15px rgba(0,0,0,0.6)' }}
                >
                  <ArrowDown size={18} color="#f59e0b" />
                </motion.div>
              </div>

              {/* Receive Area */}
              <div style={{ background: 'rgba(245, 159, 11, 0.08)', borderRadius: '20px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(245, 159, 11, 0.25)', position: 'relative', zIndex: 1, marginTop: '2px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#f59e0b', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 800 }}>{t('app.you_get')} ≈</div>
                  <motion.span style={{ fontSize: '26px', fontWeight: '900', color: '#fbbf24', textShadow: '0 2px 15px rgba(245, 159, 11, 0.4)' }}>
                    {Math.round(amount * tastePerTon).toLocaleString()}
                  </motion.span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(245, 159, 11, 0.2)', padding: '8px 14px', borderRadius: '16px', border: '1px solid rgba(245, 159, 11, 0.4)', boxShadow: '0 4px 10px rgba(245, 159, 11, 0.3)' }}>
                  <img src="/logo.jpg" alt="TASTE" style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid #f59e0b', boxShadow: '0 0 10px rgba(245,159,11,0.5)' }} />
                  <span style={{ fontSize: '16px', fontWeight: 900, color: '#fbbf24' }}>TASTE</span>
                </div>
              </div>

              {/* Quick Selectors */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px', margin: '20px 0', position: 'relative', zIndex: 1 }}>
                {[1, 3, 5, 10, 20].map((val) => (
                  <motion.button 
                    key={val} 
                    whileHover={{ scale: 1.05, y: -2 }} 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setAmount(val)} 
                    style={{ 
                      background: amount === val ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255,255,255,0.03)', 
                      color: amount === val ? '#000' : '#cbd5e1', 
                      border: amount === val ? '1px solid #fbbf24' : '1px solid rgba(255,255,255,0.1)', 
                      padding: '12px 0', 
                      borderRadius: '14px', 
                      cursor: 'pointer', 
                      fontWeight: '800', 
                      fontSize: '15px', 
                      boxShadow: amount === val ? '0 6px 20px rgba(245, 159, 11, 0.4)' : 'none',
                      transition: 'all 0.2s' 
                    }}
                  >
                    {val}
                  </motion.button>
                ))}
              </div>

              {/* Buy Button & Link */}
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }} 
                animate={{ boxShadow: ['0 4px 15px rgba(245, 159, 11, 0.4)', '0 4px 30px rgba(245, 159, 11, 0.8)', '0 4px 15px rgba(245, 159, 11, 0.4)'] }}
                transition={{ duration: 2, repeat: Infinity }}
                onClick={handleBuy} 
                className="taste-buy-btn-premium"
                style={{ 
                  width: '100%', 
                  fontSize: '18px', 
                  fontWeight: 900, 
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)', 
                  color: '#000', 
                  border: '1px solid #fde68a', 
                  padding: '20px', 
                  borderRadius: '18px', 
                  cursor: 'pointer', 
                  marginBottom: '16px',
                  position: 'relative',
                  overflow: 'hidden',
                  zIndex: 1
                }}
              >
                <span style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', letterSpacing: '0.5px' }}>
                   {t('app.buy_with')} 🚀
                </span>
                <div style={{ position: 'absolute', top: 0, left: '-100%', width: '100%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)', animation: 'shimmer 2.5s infinite' }} />
              </motion.button>
              
              <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <a href="https://app.ston.fi/swap?chartVisible=false&ft=TON&tt=EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', transition: 'all 0.2s' }}>
                  ⚡ Powered by <span style={{ color: '#00c896', fontWeight: 800 }}>STON.fi</span> →
                </a>
              </div>
            </motion.div>

            {/* Compact Live Data & Activity Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', borderRadius: '24px' }}>
                <LiveMarketData />
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '24px' }}>
                 <TokenAllocation />
              </div>
            </div>

            {/* Quick Status Bar */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ display: 'flex', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '12px 20px', marginBottom: '20px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary)' }}>{holdersCount}</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{t('app.units.holder').toUpperCase()}</div>
                </div>
                <div style={{ width: '1px', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary)' }}>25M</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{t('app.units.supply').toUpperCase()}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--primary)' }}>88.4%</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>LOCKED</div>
                </div>
            </motion.div>

          </motion.div>
        );
      case 'faq': return (
        <motion.div key="faq" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <div className="glass-panel" style={{ padding: '24px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', fontWeight: 900, textAlign: 'center' }}>🙋 {t('app.faq.title')}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <p style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>{t('app.faq.what_is')}</p>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.7' }}>{t('app.faq.what_is_ans')}</p>
              </div>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />
              <div>
                <p style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '14px', marginBottom: '8px' }}>{t('app.faq.how_to')}</p>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.7' }}><Trans i18nKey="app.faq.how_to_ans" /></div>
              </div>
              <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />
              <div>
                <p style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '14px', marginBottom: '12px' }}>🔗 {i18n.language?.startsWith('tr') ? 'Hızlı Bağlantılar' : 'Quick Links'}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'Token Locks', url: 'https://tonscan.org/jetton/EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-', color: '#22c55e' },
                    { label: 'LP Lock (81.6%)', url: 'https://tonscan.org/jetton/0:86107ac1baea0a549ff42ea432dfc17e73ea4df89af3d0cfc049d0ad27164bef', color: '#818cf8' },
                    { label: 'Audit & Safety', url: 'https://incandescent-gelato-cc11a4.netlify.app/audit.html', color: '#f59e0b' },
                    { label: 'TASTE Website', url: 'https://tastetoken.net', color: '#3b82f6' },
                  ].map((item, i) => (
                    <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${item.color}30`, borderRadius: '14px', padding: '12px 16px', fontSize: '12px', color: item.color, textDecoration: 'none', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {item.label} <ExternalLink size={14} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      );
      case 'tech': return (
        <motion.div key="tech" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <PoweredBy />
        </motion.div>
      );
      case 'vote': return (
        <motion.div key="vote" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <VoteDiscovery />
        </motion.div>
      );
      case 'manifesto': return <Manifesto />;
      case 'roadmap': return (
        <motion.div key="roadmap" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>{t('nav.roadmap')}</div>
            <h3 style={{ fontWeight: 900, margin: '0 0 16px' }}>{t('roadmap.title')}</h3>
            <Roadmap />
          </div>
        </motion.div>
      );
      case 'whitepaper': return <Whitepaper />;
      case 'spin': return (
        <motion.div key="spin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <SpinWheel />
          </div>
        </motion.div>
      );
      case 'charity': return (
        <motion.div key="charity" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <Charity />
          </div>
        </motion.div>
      );

      case 'legal': return <Legal />;
      case 'ai': return (
        <motion.div key="ai" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>TASTE AI</div>
            <h3 style={{ fontWeight: 900, margin: '0 0 16px', fontSize: '1rem' }}>🤖 {i18n.language?.startsWith('tr') ? 'Proje Asistanı' : 'Project Assistant'}</h3>
            <TasteAI />
          </div>
        </motion.div>
      );
      case 'wallet': return (
        <motion.div key="wallet" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>{t('nav.wallet')}</div>
            <h3 style={{ fontWeight: 900, margin: '0 0 16px', fontSize: '1rem' }}>💰 {i18n.language?.startsWith('tr') ? 'Hızlı Cüzdan & Transfer' : 'Quick Wallet & Transfer'}</h3>
            <WalletTransfer />
          </div>
        </motion.div>
      );
      case 'chef': return (
        <motion.div key="chef" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>{t('nav.chef')}</div>
            <h3 style={{ fontWeight: 900, margin: '0 0 16px', fontSize: '1rem' }}>👨‍🍳 {i18n.language?.startsWith('tr') ? 'Taste Şef Dijital İndirim' : 'Taste Chef Digital Discount'}</h3>
            <TasteChef />
          </div>
        </motion.div>
      );
      case 'community': return (
        <motion.div key="community" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>TASTE JOBS</div>
            <h3 style={{ fontWeight: 900, margin: '0 0 16px', fontSize: '1rem' }}>
              🧑‍🍳 {i18n.language?.startsWith('tr') ? 'Gastronomi Kariyer & Topluluk' : 'Gastronomy Career & Community'}
            </h3>
            <TasteJobs />
          </div>
        </motion.div>
      );
      case 'partners': return (
        <motion.div key="partners" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>{i18n.language?.startsWith('tr') ? 'Web3 & İş Ortakları' : 'Web3 & Partners'}</div>
            <h3 style={{ fontWeight: 900, margin: '0 0 16px', fontSize: '1rem' }}>
              🤝 {i18n.language?.startsWith('tr') ? 'Ortak Projeler' : 'Joint Projects'}
            </h3>
            <Partners />
          </div>
        </motion.div>
      );
      default: return null;
    }
  };

  return (
    <>
      <AnimatePresence>
        {disclaimerVisible && (
          <DisclaimerModal onAccept={() => setDisclaimerVisible(false)} />
        )}
      </AnimatePresence>

      <div className={`container ${isRTL ? 'rtl' : ''}`} style={{ paddingBottom: '90px', paddingTop: '40px' }}>
        <PriceTicker />

        {/* Buy Ping Notification */}
        <AnimatePresence>
          {showPing && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.8 }}
              style={{
                position: 'fixed',
                top: '40px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000',
                padding: '12px 24px',
                borderRadius: '50px',
                fontWeight: '700',
                fontSize: '14px',
                zIndex: 2000,
                boxShadow: '0 10px 30px rgba(245, 159, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              🔔 ≈{pingAmount.toLocaleString()} TASTE {t('app.swap_opening')}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', position: 'relative' }}>
          <TonConnectButton />
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowLangMenu(!showLangMenu)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--bg-card-border)', color: 'var(--text-main)', padding: '5px 12px', borderRadius: '15px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {currentLang.flag} {currentLang.code.toUpperCase()}
          </motion.button>

          <AnimatePresence>
            {showLangMenu && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLangMenu(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }} />
                <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 10 }} style={{ position: 'absolute', top: '40px', right: '0', background: 'var(--bg-card)', backdropFilter: 'blur(20px)', border: '1px solid var(--bg-card-border)', borderRadius: '15px', padding: '10px', zIndex: 101, minWidth: '150px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                  {languages.map(l => (
                    <motion.button key={l.code} whileHover={{ background: 'rgba(255,255,255,0.05)' }} onClick={() => changeLanguage(l.code)} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px', background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '14px', cursor: 'pointer', borderRadius: '8px', textAlign: 'left' }}>
                      <span style={{ fontSize: '18px' }}>{l.flag}</span>
                      <span style={{ fontWeight: l.code === currentLang.code ? 'bold' : 'normal' }}>{l.label}</span>
                    </motion.button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>


        <main style={{ marginTop: activeTab === 'home' ? '0' : '20px' }}>
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </main>

        {/* Secondary Menu Drawer */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsMenuOpen(false)}
                style={{
                  position: 'fixed',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(15, 23, 42, 0.7)',
                  backdropFilter: 'blur(4px)',
                  zIndex: 998
                }}
              />
              {/* Drawer Container */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                style={{
                  position: 'fixed',
                  left: 0, right: 0, bottom: '70px', /* just above the bottom nav */
                  background: 'rgba(30, 41, 59, 0.95)',
                  backdropFilter: 'blur(16px)',
                  borderTopLeftRadius: '24px',
                  borderTopRightRadius: '24px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderBottom: 'none',
                  padding: '24px 20px 30px',
                  zIndex: 999,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LayoutGrid size={20} color="#f59e0b" />
                    {i18n.language?.startsWith('tr') ? 'Keşfet' : 'Discover'}
                  </h3>
                  <button onClick={() => setIsMenuOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}>
                    <X size={24} />
                  </button>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                   {[
                    { id: 'partners', label: i18n.language?.startsWith('tr') ? 'Ortaklar' : 'Partners', icon: Handshake, color: '#3b82f6', isNew: true },
                    { id: 'community', label: 'Taste Jobs', icon: Briefcase, color: '#f97316' },
                    { id: 'vote', label: i18n.language?.startsWith('tr') ? 'Listeler' : 'Listings', icon: Trophy, color: '#eab308' },
                    { id: 'manifesto', label: 'Manifesto', icon: Flame, color: '#f97316' },
                    { id: 'roadmap', label: t('nav.roadmap'), icon: Map, color: '#8b5cf6' },
                    { id: 'whitepaper', label: t('nav.whitepaper'), icon: FileText, color: '#3b82f6' },
                    { id: 'spin', label: t('nav.spin'), icon: Gift, color: '#ec4899' },
                    { id: 'charity', label: t('nav.charity'), icon: Heart, color: '#f43f5e' },
                    { id: 'chef', label: t('nav.chef'), icon: ChefHat, color: '#10b981', isDemo: true },
                    { id: 'wallet', label: t('nav.wallet'), icon: QrCode, color: '#f59e0b' },
                    { id: 'faq', label: i18n.language?.startsWith('tr') ? 'S.S.S.' : 'F.A.Q.', icon: HelpCircle, color: '#22c55e' },
                    { id: 'tech', label: i18n.language?.startsWith('tr') ? 'Teknoloji' : 'Tech', icon: Cpu, color: '#10b981' },
                    { id: 'legal', label: t('nav.legal'), icon: Scale, color: '#64748b' }
                  ].map((item: any) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as any);
                        setIsMenuOpen(false);
                      }}
                      style={{
                        background: activeTab === item.id ? `linear-gradient(145deg, ${item.color}33, ${item.color}11)` : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${activeTab === item.id ? item.color : 'rgba(255,255,255,0.05)'}`,
                        borderRadius: '14px',
                        padding: '12px 4px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        color: activeTab === item.id ? '#fff' : '#94a3b8',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {activeTab === item.id && (
                         <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                      )}
                      {item.isDemo && (
                         <div style={{ position: 'absolute', top: '2px', right: '2px', background: '#ef4444', color: '#fff', fontSize: '6px', fontWeight: 900, padding: '1px 3px', borderRadius: '4px', zIndex: 2 }}>DEMO</div>
                      )}
                      {item.isNew && (
                         <div style={{ position: 'absolute', top: '2px', right: '2px', background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', fontSize: '6px', fontWeight: 900, padding: '1px 3px', borderRadius: '4px', zIndex: 2 }}>YENİ</div>
                      )}
                      <item.icon size={20} color={activeTab === item.id ? item.color : '#64748b'} />
                      <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2px', textAlign: 'center', textTransform: 'uppercase' }}>{item.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Primary Bottom Navigation */}
        <nav className="bottom-nav" style={{ padding: '0 10px' }}>
          <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => { setActiveTab('home'); setIsMenuOpen(false); }}>
            <span className="nav-icon"><Home size={22} /></span><span className="nav-label">{t('nav.home')}</span>
          </button>
          


          <button className={`nav-item ${activeTab === 'ai' ? 'active' : ''}`} onClick={() => { setActiveTab('ai'); setIsMenuOpen(false); }} style={{ position: 'relative' }}>
            <span className="nav-icon"><Bot size={22} /></span><span className="nav-label">AI</span>
            <span style={{ position: 'absolute', top: '4px', right: '14px', width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', animation: 'pulse 2s infinite' }} />
          </button>
          
          <button className={`nav-item ${isMenuOpen ? 'active' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="nav-icon"><LayoutGrid size={22} /></span><span className="nav-label">{i18n.language?.startsWith('tr') ? 'Menü' : 'Menu'}</span>
          </button>
        </nav>

        <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const url = 'https://incandescent-gelato-cc11a4.netlify.app/audit.html';
              if (window.Telegram?.WebApp) {
                window.Telegram.WebApp.openLink(url);
              } else {
                window.open(url, '_blank');
              }
            }}
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              color: '#22c55e',
              padding: '8px 20px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '10px'
            }}
          >
            🔒 {t('legal.nav.risk.label')}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const url = 'https://incandescent-gelato-cc11a4.netlify.app/litepaper.html';
              if (window.Telegram?.WebApp) {
                window.Telegram.WebApp.openLink(url);
              } else {
                window.open(url, '_blank');
              }
            }}
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              color: '#f59e0b',
              padding: '8px 20px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '10px'
            }}
          >
            📄 {t('nav.litepaper')}
          </motion.button>
          <p>{t('legal.footer.network')}</p>

          {/* ─── Footer Disclaimer ─────────────────────────── */}
          <div style={{
            marginTop: '16px',
            padding: '14px 16px',
            background: 'rgba(239,68,68,0.05)',
            border: '1px solid rgba(239,68,68,0.15)',
            borderRadius: '14px',
            textAlign: 'left'
          }}>
            <p style={{ fontSize: '10px', color: 'rgba(255,80,80,0.7)', fontWeight: 700, marginBottom: '5px', letterSpacing: '0.5px' }}>
              ⚠️ RİSK UYARISI / RISK WARNING
            </p>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, margin: 0 }}>
              {t('legal.risk.intro_text')}
            </p>
            <button
              onClick={() => setActiveTab('legal')}
              style={{
                background: 'none', border: 'none', color: 'rgba(129,140,248,0.6)',
                fontSize: '10px', cursor: 'pointer', padding: '6px 0 0', fontWeight: 600
              }}
            >
              📋 {t('legal.nav.disclaimer.label')} → Full Legal Disclaimer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App
