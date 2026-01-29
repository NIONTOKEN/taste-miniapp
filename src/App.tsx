import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react'
import { DailyRewards } from './components/DailyRewards'
import { SocialTasks } from './components/SocialTasks'
import { Roadmap } from './components/Roadmap'
import { Whitepaper } from './components/Whitepaper'
import { Leaderboard } from './components/Leaderboard'
import { LiveMarketData } from './components/LiveMarketData'
import { LevelMap } from './components/LevelMap'
import { CookingGame } from './components/CookingGame'
import {
  Home,
  Map,
  FileText,
  Trophy,
  ExternalLink,
  Clock,
  Share2,
  TrendingUp,
  Gamepad2
} from 'lucide-react'
import { useUser } from './context/UserContext'
import { apiService } from './services/api'

const TASTE_LOGO = '/logo.jpg'

function PriceTicker() {
  const [price, setPrice] = useState<string>('0.00106')
  const [tryPrice, setTryPrice] = useState<string>('0.0365')
  const [change, setChange] = useState<number>(12.4)

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        // Get current TASTE price
        const priceData = await apiService.getTastePrice();
        setPrice(priceData.price.toFixed(5));
        setChange(priceData.change);

        // Fetch USD to TRY rate with retry logic
        const exchangeData = await apiService.getExchangeRate();
        setTryPrice((priceData.price * exchangeData.rate).toFixed(4));
      } catch (e) {
        // Fallback values
        setPrice('0.00106');
        setChange(12.4);
        setTryPrice('0.0365');
      }
    }
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, [])

  return (
    <div className="ticker-wrap">
      <div className="ticker">
        <span className="ticker-item">💎 TASTE/USD: ${price} <span className={change >= 0 ? 'price-up' : 'price-down'}>({change >= 0 ? '+' : ''}{change}%)</span></span>
        <span className="ticker-item">🇹🇷 TASTE/TRY: ₺{tryPrice}</span>
        <span className="ticker-item">🚀 NEXT GOAL: $0.01</span>
        <span className="ticker-item">🔥 TOTAL SUPPLY: 25,000,000</span>
        <span className="ticker-item">💎 TASTE/USD: ${price}</span>
        <span className="ticker-item">🚀 COMMUNITY DRIVEN</span>
      </div>
    </div>
  )
}

function App() {
  const { t, i18n } = useTranslation();
  const {
    balance, referrals, xp, energy,
    addBalance, addXP, useEnergy,
    handleWithdraw: contextWithdraw, loadUser
  } = useUser();

  const [amount, setAmount] = useState(1000);
  const [holdersCount, setHoldersCount] = useState<string>('...');
  const [activeTab, setActiveTab] = useState<'home' | 'play' | 'roadmap' | 'whitepaper' | 'leaderboard'>('home');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [tonConnectUI] = useTonConnectUI();
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  // 1. Language Persistence & Initialization
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      try {
        tg.setHeaderColor('#0f172a');
        tg.setBackgroundColor('#0f172a');
      } catch (e) { }

      const savedLang = localStorage.getItem('i18nextLng');
      if (!savedLang) {
        const userLang = tg.initDataUnsafe?.user?.language_code;
        if (userLang?.startsWith('tr')) i18n.changeLanguage('tr');
        else if (userLang?.startsWith('ar')) i18n.changeLanguage('ar');
        else if (userLang?.startsWith('ru')) i18n.changeLanguage('ru');
        else if (userLang?.startsWith('hi')) i18n.changeLanguage('hi');
        else i18n.changeLanguage('en');
      }
    }
  }, []);

  // 2. Data Fetching & Referrals
  useEffect(() => {
    const userAddress = tonConnectUI.account?.address;
    if (userAddress) {
      loadUser(userAddress);

      const tg = window.Telegram?.WebApp;
      const startParam = tg?.initDataUnsafe?.start_param;
      if (startParam) {
        import('./services/backend').then(({ backend }) => {
          backend.trackReferral(startParam, userAddress);
        });
      }
    }

    const fetchHolders = async () => {
      const JETTON_ADDRESS = 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-';
      try {
        const holders = await apiService.getJettonHolders(JETTON_ADDRESS);
        setHoldersCount(holders);
      } catch (e) {
        setHoldersCount('1,248+');
      }
    };
    fetchHolders();
  }, [tonConnectUI.account?.address]);

  const languages = [
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', label: 'English (US)', flag: '🇺🇸' },
    { code: 'ar', label: 'العربية', flag: '🇦🇪' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
  ];

  const currentLangCode = i18n.language?.split('-')[0] || 'en';
  const currentLang = languages.find(l => l.code === currentLangCode) || languages[1];
  const isRTL = currentLangCode === 'ar';

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setShowLangMenu(false);
  };

  const handleBuy = () => {
    const SWAP_URL = `https://dedust.io/pools/EQDPyY_pVW1r3q-5NwccvAThkPaCTQMnxz1i_HU7Fv64g-cz`;
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(SWAP_URL);
    } else {
      window.open(SWAP_URL, '_blank');
    }
  };

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    await contextWithdraw(tonConnectUI, t);
    setIsWithdrawing(false);
  };

  const renderContent = () => {
    if (selectedLevel) return <CookingGame level={selectedLevel} onBack={() => setSelectedLevel(null)} />;
    switch (activeTab) {
      case 'home':
        return (
          <motion.div key="home" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <DailyRewards />
            <div className="status-grid">
              <div className="status-card">
                <Clock size={16} />
                <div>
                  <div className="label">Streak</div>
                  <div className="value">Active</div>
                </div>
              </div>
              <div className="status-card">
                <TrendingUp size={16} />
                <div>
                  <div className="label">Growth</div>
                  <div className="value">+12.4%</div>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '15px', textAlign: 'center' }}>{t('app.buy_title')}</h3>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '5px', marginBottom: '25px' }}>
                <AnimatePresence mode="wait">
                  <motion.span key={amount} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ fontSize: '32px', fontWeight: 'bold' }}>
                    {amount}
                  </motion.span>
                </AnimatePresence>
                <span style={{ color: 'var(--primary)', fontWeight: '600' }}>TASTE</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '25px' }}>
                {[500, 1000, 2500, 5000, 10000, 50000].map((val) => (
                  <motion.button key={val} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setAmount(val)} style={{ background: amount === val ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: amount === val ? '#000' : 'var(--text-main)', border: '1px solid var(--bg-card-border)', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
                    {val}
                  </motion.button>
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="glass-button primary-glow" style={{ width: '100%', fontSize: '1.1rem', background: 'var(--gradient-gold)', color: '#000', border: 'none' }} onClick={handleBuy}>
                {t('app.buy_with')}
              </motion.button>
            </div>

            <LiveMarketData />
            <SocialTasks />

            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '24px' }}>🤝</span>
                <div>
                  <h3 style={{ fontSize: '1rem' }}>{t('app.invite_friend')}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('app.invite_gain')}</p>
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.02, background: 'var(--primary)', color: '#000' }} whileTap={{ scale: 0.98 }} className="glass-button" style={{ width: '100%', background: 'var(--secondary)' }} onClick={() => {
                const userId = tonConnectUI.account?.address || 'user';
                const inviteLink = `https://t.me/taste_launch_bot/app?startapp=${userId}`;
                const message = encodeURIComponent(t('app.referral_message'));
                if (window.Telegram?.WebApp) window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${inviteLink}&text=${message}`);
              }}>
                {t('app.share_link')}
              </motion.button>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '80px' }}>
              <div className="glass-panel" style={{ padding: '15px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('app.my_balance')}</div>
                <motion.div key={balance} initial={{ scale: 1.2, color: 'var(--primary)' }} animate={{ scale: 1 }} style={{ fontWeight: 'bold' }}>
                  {balance} TASTE
                </motion.div>
                <motion.button whileHover={balance >= 5 ? { scale: 1.05 } : {}} whileTap={balance >= 5 ? { scale: 0.95 } : {}} onClick={handleWithdraw} disabled={balance < 5 || isWithdrawing} style={{ marginTop: '10px', padding: '8px', borderRadius: '10px', border: 'none', background: balance >= 5 ? 'var(--gradient-gold)' : 'rgba(255,255,255,0.05)', color: balance >= 5 ? '#000' : 'var(--text-muted)', fontSize: '11px', fontWeight: 'bold', width: '100%' }}>
                  {isWithdrawing ? '...' : `📤 ${t('rewards.withdraw')}`}
                </motion.button>
              </div>
              <div className="glass-panel" style={{ padding: '15px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('app.holders')}</div>
                <div style={{ fontWeight: 'bold' }}>{holdersCount}</div>
              </div>
            </motion.div>
          </motion.div>
        );
      case 'play': return <LevelMap onSelectLevel={(lvl) => setSelectedLevel(lvl)} />;
      case 'leaderboard': return <Leaderboard />;
      case 'roadmap': return <Roadmap />;
      case 'whitepaper': return <Whitepaper />;
      default: return null;
    }
  };

  return (
    <div className={`container ${isRTL ? 'rtl' : ''}`} style={{ paddingBottom: '90px', paddingTop: '40px' }}>
      <PriceTicker />
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', position: 'relative' }}>
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

      {!selectedLevel && activeTab === 'home' && (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 15 }} style={{ textAlign: 'center', marginBottom: '30px', marginTop: '10px' }}>
          <motion.div whileTap={{ scale: 0.9 }} onClick={() => { if (useEnergy(1)) { addXP(10); addBalance(0.0001); } }} style={{ width: '120px', height: '120px', margin: '0 auto 15px', background: 'var(--gradient-gold)', borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: '50px', boxShadow: '0 0 30px var(--primary-glow)', cursor: 'pointer', border: '4px solid rgba(245, 159, 11, 0.3)', position: 'relative' }}>
            <img src={TASTE_LOGO} alt="Taste Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '-10px', background: 'var(--primary)', color: '#000', fontSize: '10px', padding: '2px 8px', borderRadius: '10px', fontWeight: 'bold' }}>{t('app.tap_to_earn')}</div>
          </motion.div>
          <div style={{ marginBottom: '20px', width: '160px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--primary)', marginBottom: '4px' }}>⚡ {energy}/100</div>
            <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${energy}%` }} style={{ height: '100%', background: 'cyan', boxShadow: '0 0 10px cyan' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}><TonConnectButton /></div>
          <h1 className="text-gradient" style={{ fontSize: '1.8rem' }}>{t('app.title')}</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '5px', fontSize: '14px' }}>{t('app.description')}</p>
          <div style={{ marginTop: '20px', padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px', color: 'var(--text-muted)' }}>
              <span>Level {Math.floor(xp / 1000) + 1}</span>
              <span>{xp % 1000} / 1000 XP</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${(xp % 1000) / 10}%` }} style={{ height: '100%', background: 'var(--gradient-gold)', boxShadow: '0 0 10px var(--primary-glow)' }} />
            </div>
          </div>
        </motion.div>
      )}

      <main style={{ marginTop: activeTab === 'home' || selectedLevel ? '0' : '20px' }}>
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </main>

      {!selectedLevel && (
        <nav className="bottom-nav">
          <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            <span className="nav-icon"><Home size={20} /></span><span className="nav-label">{t('nav.home')}</span>
          </button>
          <button className={`nav-item ${activeTab === 'play' ? 'active' : ''}`} onClick={() => setActiveTab('play')}>
            <span className="nav-icon"><Gamepad2 size={20} /></span><span className="nav-label">{t('nav.play')}</span>
          </button>
          <button className={`nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`} onClick={() => setActiveTab('leaderboard')}>
            <span className="nav-icon"><Trophy size={20} /></span><span className="nav-label">{t('nav.leaderboard')}</span>
          </button>
          <button className={`nav-item ${activeTab === 'roadmap' ? 'active' : ''}`} onClick={() => setActiveTab('roadmap')}>
            <span className="nav-icon"><Map size={20} /></span><span className="nav-label">{t('nav.roadmap')}</span>
          </button>
          <button className={`nav-item ${activeTab === 'whitepaper' ? 'active' : ''}`} onClick={() => setActiveTab('whitepaper')}>
            <span className="nav-icon"><FileText size={20} /></span><span className="nav-label">{t('nav.whitepaper')}</span>
          </button>
        </nav>
      )}

      <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
        <p>Built on The Open Network</p>
      </div>
    </div>
  );
}

export default App
