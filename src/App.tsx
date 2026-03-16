import { useEffect, useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react'

import { SocialTasks } from './components/SocialTasks'
import { Roadmap } from './components/Roadmap'
import { Whitepaper } from './components/Whitepaper'
import { Manifesto } from './components/Manifesto'
import { LiveMarketData } from './components/LiveMarketData'
import { SpinWheel } from './components/SpinWheel'
import { Charity } from './components/Charity'
import { Community } from './components/Community'
import { LiveActivity } from './components/LiveActivity'
import { Legal } from './components/Legal'
import { TasteAI } from './components/TasteAI'
import { TasteChef } from './components/TasteChef'
import { DisclaimerModal, shouldShowDisclaimer } from './components/DisclaimerModal'
import { PoweredBy } from './components/PoweredBy'
import { WalletTransfer } from './components/WalletTransfer'
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
  ChefHat
} from 'lucide-react'
import { apiService } from './services/api'

const TASTE_LOGO = '/logo.jpg'


function PriceTicker() {
  const { t, i18n } = useTranslation()
  const [price, setPrice] = useState<string>('0.00135')
  const [tryPrice, setTryPrice] = useState<string>('0.0466')
  const [change, setChange] = useState<number>(0)

  useEffect(() => {
    const fetchLivePrice = async () => {
      try {
        const [priceData, rateData] = await Promise.all([
          apiService.getTastePrice(),
          apiService.getExchangeRate()
        ])
        if (priceData.price > 0) {
          setPrice(priceData.price.toFixed(5))
          setChange(priceData.change)
          setTryPrice((priceData.price * rateData.usdToTry).toFixed(4))
        }
      } catch (e) {
        console.warn('[PriceTicker] API fetch failed, keeping current values')
      }
    }

    fetchLivePrice()
    // Refresh every 60 seconds (GeckoTerminal rate limit friendly)
    const interval = setInterval(fetchLivePrice, 60000)
    return () => clearInterval(interval)
  }, [])

  const changeColor = change >= 0 ? 'price-up' : 'price-down'
  const changeSign = change >= 0 ? '+' : ''

  return (
    <div className="ticker-wrap">
      <div className="ticker">
        <span className="ticker-item">💎 TASTE/USD: ${price} <span className={changeColor}>({changeSign}{change.toFixed(1)}%)</span></span>
        <span className="ticker-item">🇹🇷 TASTE/TRY: ₺{tryPrice}</span>
        <span className="ticker-item">🚀 {t('app.early_access_ending')} $0.01</span>
        <span className="ticker-item">🔥 {t('app.units.supply')}: 25,000,000</span>
        <span className="ticker-item">🌍 {i18n.language === 'tr' ? 'TOPLULUK ODAKLI' : 'COMMUNITY DRIVEN'}</span>
        <span className="ticker-item">💎 TASTE/USD: ${price} <span className={changeColor}>({changeSign}{change.toFixed(1)}%)</span></span>
      </div>
    </div>
  )
}


// Countdown Timer Component - Erken erişim bitiş: 02.01.2027
function CountdownTimer({ earlyAccessLabel }: { earlyAccessLabel: string }) {
  const { t } = useTranslation()
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date('2027-01-02T00:00:00').getTime();
    const update = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const boxStyle = { background: 'rgba(245, 159, 11, 0.1)', border: '1px solid rgba(245, 159, 11, 0.2)', borderRadius: '8px', padding: '6px 10px', textAlign: 'center' as const, minWidth: '50px' };

  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 2s infinite' }} />
        {earlyAccessLabel}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
        <div style={boxStyle}>
          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)' }}>{timeLeft.days}</div>
          <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{t('app.units.day')}</div>
        </div>
        <div style={boxStyle}>
          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)' }}>{timeLeft.hours}</div>
          <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{t('app.units.hr')}</div>
        </div>
        <div style={boxStyle}>
          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)' }}>{timeLeft.minutes}</div>
          <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{t('app.units.min')}</div>
        </div>
        <div style={boxStyle}>
          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)' }}>{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{t('app.units.sec')}</div>
        </div>
      </div>
    </div>
  );
}

// Reward Countdown - Ödül dağıtımı bitiş: 20.05.2026
function RewardCountdown() {
  const { t } = useTranslation()
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date('2026-05-20T00:00:00').getTime();
    const update = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const boxStyle = {
    background: 'rgba(34, 197, 94, 0.08)',
    border: '1px solid rgba(34, 197, 94, 0.2)',
    borderRadius: '8px', padding: '6px 10px',
    textAlign: 'center' as const, minWidth: '50px'
  };

  return (
    <div style={{
      marginBottom: '15px',
      background: 'rgba(34,197,94,0.04)',
      border: '1px solid rgba(34,197,94,0.12)',
      borderRadius: '12px',
      padding: '12px 10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '11px', color: '#4ade80', fontWeight: 700, marginBottom: '8px' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite', flexShrink: 0 }} />
        {t('app.reward_end')}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
        <div style={boxStyle}>
          <div style={{ fontSize: '16px', fontWeight: '800', color: '#22c55e' }}>{timeLeft.days}</div>
          <div style={{ fontSize: '9px', color: '#4ade8080' }}>{t('app.units.day')}</div>
        </div>
        <div style={boxStyle}>
          <div style={{ fontSize: '16px', fontWeight: '800', color: '#22c55e' }}>{timeLeft.hours}</div>
          <div style={{ fontSize: '9px', color: '#4ade8080' }}>{t('app.units.hr')}</div>
        </div>
        <div style={boxStyle}>
          <div style={{ fontSize: '16px', fontWeight: '800', color: '#22c55e' }}>{timeLeft.minutes}</div>
          <div style={{ fontSize: '9px', color: '#4ade8080' }}>{t('app.units.min')}</div>
        </div>
        <div style={boxStyle}>
          <div style={{ fontSize: '16px', fontWeight: '800', color: '#22c55e' }}>{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div style={{ fontSize: '9px', color: '#4ade8080' }}>{t('app.units.sec')}</div>
        </div>
      </div>
    </div>
  );
}
function App() {
  const { t, i18n } = useTranslation();

  const [amount, setAmount] = useState(1);
  const [holdersCount, setHoldersCount] = useState<string>('...');
  const [activeTab, setActiveTab] = useState<'home' | 'manifesto' | 'roadmap' | 'whitepaper' | 'spin'  | 'community' | 'charity' | 'legal' | 'ai' | 'faq' | 'tech' | 'wallet' | 'chef'>('home');
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
        const userLang = tg.initDataUnsafe?.user?.language_code;
        if (userLang?.startsWith('tr')) i18n.changeLanguage('tr');
        else i18n.changeLanguage('en');
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

            {/* Compact Swap Widget */}
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '16px', borderRadius: '24px', background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.9))', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ fontSize: '20px' }}>🪙</div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>TASTE Swap</h3>
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '4px 8px', borderRadius: '10px', fontWeight: 700 }}>
                  TON: ${tonUsdPrice.toFixed(2)}
                </div>
              </div>

              {/* Input Area */}
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: '16px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 700 }}>{t('app.units.pay')}</div>
                  <AnimatePresence mode="wait">
                    <motion.span key={amount} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} style={{ fontSize: '28px', fontWeight: '900', color: '#fff' }}>
                      {amount}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '20px' }}>
                  <img src="https://ton.org/download/ton_symbol.png" alt="TON" style={{ width: 16, height: 16 }} />
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>TON</span>
                </div>
              </div>

              {/* Output Info */}
              <div style={{ textAlign: 'center', margin: '12px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                ↓ {t('app.you_get')} ≈ <span style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '16px' }}>{Math.round(amount * tastePerTon).toLocaleString()}</span> TASTE
              </div>

              {/* Quick Selectors */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', marginBottom: '16px' }}>
                {[1, 3, 5, 10, 20].map((val) => (
                  <button key={val} onClick={() => setAmount(val)} style={{ background: amount === val ? 'var(--primary)' : 'rgba(255,255,255,0.04)', color: amount === val ? '#000' : 'var(--text-main)', border: amount === val ? 'none' : '1px solid rgba(255,255,255,0.08)', padding: '8px 0', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', transition: 'all 0.2s' }}>
                    {val}
                  </button>
                ))}
              </div>

              {/* Buy Button & Link */}
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleBuy} style={{ width: '100%', fontSize: '15px', fontWeight: 800, background: 'var(--gradient-gold)', color: '#000', border: 'none', padding: '16px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(245, 159, 11, 0.3)', cursor: 'pointer', marginBottom: '12px' }}>
                {t('app.buy_with')}
              </motion.button>
              <div style={{ textAlign: 'center' }}>
                <a href="https://app.ston.fi/swap?chartVisible=false&ft=TON&tt=EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '11px', fontWeight: 600 }}>
                  Powered by <span style={{ color: '#00c896' }}>STON.fi</span> →
                </a>
              </div>
            </div>

            {/* Compact Live Data & Activity Tabs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px', marginBottom: '16px' }}>
              <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', borderRadius: '24px' }}>
                <LiveMarketData />
              </div>
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '24px' }}>
                 <LiveActivity />
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
      case 'community': return (
        <motion.div key="community" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <Community />
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
          
          <button className={`nav-item ${activeTab === 'community' ? 'active' : ''}`} onClick={() => { setActiveTab('community'); setIsMenuOpen(false); }}>
            <span className="nav-icon">🍽️</span><span className="nav-label">{t('nav.community')}</span>
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
