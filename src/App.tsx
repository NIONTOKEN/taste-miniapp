import { useEffect, useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useTonConnectUI } from '@tonconnect/ui-react'
import { useWallet } from './context/WalletContext'
import { WalletSelector } from './components/WalletSelector'

import { VoteDiscovery } from './components/VoteDiscovery'
import { Roadmap } from './components/Roadmap'
import { Whitepaper } from './components/Whitepaper'
import { Manifesto } from './components/Manifesto'
import { LiveMarketData } from './components/LiveMarketData'
import { Charity } from './components/Charity'
import { TokenAllocation } from './components/TokenAllocation'
import { Legal } from './components/Legal'
import { TasteAI } from './components/TasteAI'
import { DisclaimerModal, shouldShowDisclaimer } from './components/DisclaimerModal'
import { LangSelectionModal } from './components/LangSelectionModal'
import { PoweredBy } from './components/PoweredBy'
import { Community } from './components/Community'
import { WalletTransfer } from './components/WalletTransfer'
import { PriceTicker } from './components/PriceTicker'
import { CountdownTimer } from './components/CountdownTimer'
import { Partners } from './components/Partners'
import { Leaderboard } from './components/Leaderboard'
import { DailyRewards } from './components/DailyRewards'
import { TastePay } from './components/TastePay'
import { Settings } from './components/Settings'
import { PinLock } from './components/PinLock'
import { PWAInstallBanner } from './components/PWAInstallBanner'
import { InstallModal } from './components/InstallModal'
import { OfficialSocials } from './components/OfficialSocials'
import { Team } from './components/Team'
import { SplashScreen } from './components/SplashScreen'
import { Profile } from './components/Profile'
import { TasteEcosystem } from './components/TasteEcosystem'
import { KYCModal } from './components/KYCModal'
import { SwapScreen } from './components/SwapScreen'
import { DeFiPool } from './components/DeFiPool'
import { NotificationPanel } from './components/NotificationPanel'
// @ts-ignore
// WalletApp removed since TAI Wallet standalone is discontinued
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
  Handshake,
  Globe,
  ShieldCheck,
  ScrollText,
  BookOpen,
  Wallet,
  Layers,
  ArrowLeft,
  Bell,
  Menu,
  Droplets,
  Waves,
  Settings as SettingsIcon,
  User
} from 'lucide-react'
import { apiService } from './services/api'

const TASTE_LOGO = '/logo.jpg'


function App() {
  const { t, i18n } = useTranslation();

  const [amount, setAmount] = useState(1);
  const [holdersCount, setHoldersCount] = useState<string>('...');
  const [activeTab, setActiveTab] = useState<'home' | 'manifesto' | 'roadmap' | 'whitepaper' | 'charity' | 'legal' | 'ai' | 'faq' | 'tech' | 'wallet' | 'vote' | 'community' | 'partners' | 'settings' | 'socials' | 'team' | 'ecosystem' | 'pool' | 'swap' | 'tokenomics'>('home');
  const [navHistory, setNavHistory] = useState<string[]>([]);
  const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || '0';
  const [isTastePayOpen, setIsTastePayOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [disclaimerVisible, setDisclaimerVisible] = useState<boolean>(shouldShowDisclaimer());
  const [langSelectionVisible, setLangSelectionVisible] = useState<boolean>(!localStorage.getItem('taste_lang_selected'));
  const [tonConnectUI] = useTonConnectUI();
  const { activeAddress } = useWallet();
  const [showPing, setShowPing] = useState(false);
  const [pingAmount, setPingAmount] = useState(0);
  const [tastePerTon, setTastePerTon] = useState(741); // default fallback
  const [tonUsdPrice, setTonUsdPrice] = useState(3.5); // live TON price

  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showKYC, setShowKYC] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSwapScreen, setShowSwapScreen] = useState(false);
  // 5-tab bottom nav active key: 'wallet' | 'team' | 'home' | 'pool' | 'settings'
  const [activeBottomTab, setActiveBottomTab] = useState<'wallet' | 'home' | 'pool' | 'settings'>('home');

  // Telegram SDK Initialization
  useEffect(() => {
    (window as any).openPWAInstall = () => setIsInstallModalOpen(true);
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      try {
        tg.setHeaderColor('#0a0f1c');
        tg.setBackgroundColor('#0a0f1c');
      } catch (e) { }
    }
    return () => {
      delete (window as any).openPWAInstall;
    };
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
  }, [activeAddress]);

  const languages = [
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', label: 'English (US)', flag: '🇺🇸' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'zh', label: '简体中文', flag: '🇨🇳' },
  ];

  const currentLangCode = i18n.language?.split('-')[0] || 'en';
  const currentLang = languages.find(l => l.code === currentLangCode) || languages[1];
  const isRTL = currentLangCode === 'ar';

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('i18nextLng', code);
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

  // Navigate with history tracking
  const navigateTo = (tab: typeof activeTab) => {
    if (tab === activeTab) return;
    setNavHistory(prev => [...prev, activeTab]);
    setActiveTab(tab);
  };

  // Go back to previous page
  const goBack = () => {
    if (navHistory.length > 0) {
      const prev = navHistory[navHistory.length - 1];
      setNavHistory(h => h.slice(0, -1));
      setActiveTab(prev as typeof activeTab);
    } else {
      setActiveTab('home');
    }
  };

  const renderContent = () => {
    const isSubPage = !['home', 'games', 'wallet', 'tasks', 'socials'].includes(activeTab);
    return (
      <>
        {isSubPage && (
          <motion.button 
            onClick={() => goBack()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--bg-card-border)',
              padding: '8px 16px', borderRadius: '20px', color: 'var(--text-main)',
              cursor: 'pointer', marginBottom: '20px', fontWeight: 800
            }}
          >
            <ArrowLeft size={16} />
            {t('app.back', 'Geri')}
          </motion.button>
        )}
        {(() => {
          switch (activeTab) {
            case 'home':
        return (
          <motion.div key="home" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ paddingBottom: 10 }}>

            {/* Hero Image Carousel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ borderRadius: 22, overflow: 'hidden', marginBottom: 16, position: 'relative', height: 200 }}
            >
              {['/photo_5.jpg', '/photo_6.jpg', '/photo_7.jpg', '/photo_8.jpg', '/photo_9.jpg', '/photo_10.jpg'].map((src, i) => (
                <motion.img
                  key={src}
                  src={src}
                  alt={`TASTE Banner ${i + 1}`}
                  initial={false}
                  animate={{
                    opacity: Math.floor((Date.now() / 5000) % 6) === i ? 1 : 0,
                  }}
                  transition={{ duration: 0.8 }}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: 22 }}
                />
              ))}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,15,28,0.85) 0%, transparent 60%)', borderRadius: 22 }} />
              <div style={{ position: 'absolute', bottom: 16, left: 18, zIndex: 2 }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>TASTE TAI</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{t('app.description', 'Web3 Food Ecosystem')}</div>
              </div>
              {/* Carousel dots */}
              <div style={{ position: 'absolute', bottom: 8, right: 16, display: 'flex', gap: 4, zIndex: 2 }}>
                {[0,1,2,3,4,5].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.4)' }} />
                ))}
              </div>
            </motion.div>

            {/* PWA Direct Install Card on Home */}
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsInstallModalOpen(true)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'linear-gradient(135deg, rgba(245,159,11,0.12) 0%, rgba(59,130,246,0.08) 100%)',
                border: '1px solid rgba(245,159,11,0.3)', borderRadius: 18,
                padding: '12px 16px', marginBottom: 16, cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 12,
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, flexShrink: 0
                }}>
                  📲
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 900, color: 'var(--text-main)' }}>TASTE AI Uygulamasını Kur (PWA)</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>Hızlı ve çevrimdışı kullanım için ana ekrana ekle</div>
                </div>
              </div>
              <div style={{
                background: 'var(--primary)', color: '#000',
                padding: '6px 12px', borderRadius: 10, fontSize: 11, fontWeight: 900
              }}>
                KUR
              </div>
            </motion.div>


            {/* Quick Stats Bar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--bg-card)', border: '1px solid var(--bg-card-border)', borderRadius: 18, padding: '14px 16px', marginBottom: 16 }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--primary)' }}>{holdersCount}</div>
                <div style={{ fontSize: 8, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>HOLDER</div>
              </div>
              <div style={{ width: 1, background: 'var(--bg-card-border)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--primary)' }}>25M</div>
                <div style={{ fontSize: 8, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>SUPPLY</div>
              </div>
              <div style={{ width: 1, background: 'var(--bg-card-border)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: '#10b981' }}>88.4%</div>
                <div style={{ fontSize: 8, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>LOCKED</div>
              </div>
              <div style={{ width: 1, background: 'var(--bg-card-border)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: '#3b82f6' }}>${tonUsdPrice.toFixed(2)}</div>
                <div style={{ fontSize: 8, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>TON</div>
              </div>
            </motion.div>

            {/* TAI Swap & DeFi Pool — with images */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowSwapScreen(true)}
                style={{
                  background: 'var(--bg-card)', border: '1px solid rgba(245,159,11,0.25)',
                  borderRadius: 20, padding: 0, cursor: 'pointer', overflow: 'hidden', textAlign: 'center'
                }}
              >
                <div style={{ width: '100%', height: 80, overflow: 'hidden' }}>
                  <img src="/photo_14.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--primary)' }}>⚡ {t('app.buy_with', 'TAI Al')}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>TON, USDT, DOGS</div>
                </div>
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => { setActiveBottomTab('pool'); navigateTo('pool'); }}
                style={{
                  background: 'var(--bg-card)', border: '1px solid rgba(16,185,129,0.25)',
                  borderRadius: 20, padding: 0, cursor: 'pointer', overflow: 'hidden', textAlign: 'center'
                }}
              >
                <div style={{ width: '100%', height: 80, overflow: 'hidden' }}>
                  <img src="/photo_15.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#10b981' }}>💧 DeFi {t('nav.pool', 'Havuz')}</div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>STON.fi & DeDust</div>
                </div>
              </motion.button>
            </div>

            {/* Quick Access Grid */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 10 }}>{t('app.quick_links', 'Hızlı Erişim')}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {[
                  { emoji: '🤖', label: t('drawer.ai', 'AI'), tab: 'ai' },
                  { emoji: '❤️', label: t('nav.charity', 'Bağış'), tab: 'charity' },
                  { emoji: '🌐', label: t('drawer.ecosystem', 'Ekosistem'), tab: 'ecosystem' },
                  { emoji: '👥', label: t('nav.team', 'Takım'), tab: 'team' },
                  { emoji: '📱', label: t('drawer.socials', 'Sosyal'), tab: 'socials' },
                  { emoji: '⚙️', label: t('nav.settings', 'Ayarlar'), tab: 'settings' },
                ].map(item => (
                  <motion.button
                    key={item.tab}
                    whileTap={{ scale: 0.92 }}
                    onClick={() => navigateTo(item.tab as any)}
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--bg-card-border)', borderRadius: 14, padding: '12px 4px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}
                  >
                    <span style={{ fontSize: 22 }}>{item.emoji}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.3 }}>{item.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Featured image banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--bg-card-border)' }}
            >
              <img src="/photo_16.jpg" alt="TASTE Community" style={{ width: '100%', height: 140, objectFit: 'cover' }} />
              <div style={{ padding: '14px 16px', background: 'var(--bg-card)' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)' }}>🍳 {t('app.banner_title', 'TASTE AI — Web3\'ün Yeni Yüzü!')}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.5 }}>{t('app.banner_desc', 'Toplulukla birlikte büyüyen, yapay zeka destekli gastronomi ekosistemi.')}</div>
              </div>
            </motion.div>

          </motion.div>
        );

      case 'tokenomics': return (
        <motion.div key="tokenomics" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <TokenAllocation />
        </motion.div>
      );
      case 'pool': return (
        <motion.div key="pool" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <DeFiPool />
        </motion.div>
      );
      case 'swap': return (
        <motion.div key="swap" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <SwapScreen onClose={() => navigateTo('home')} />
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
                <p style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '14px', marginBottom: '12px' }}>🔗 {t('app.quick_links')}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'Token Locks', url: 'https://tonscan.org/jetton/EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-', color: '#22c55e' },
                    { label: 'LP Lock (81.6%)', url: 'https://tonscan.org/jetton/0:86107ac1baea0a549ff42ea432dfc17e73ea4df89af3d0cfc049d0ad27164bef', color: '#818cf8' },
                    { label: 'Audit & Safety', url: 'https://taste-miniapp-xy8k.vercel.app/audit.html', color: '#f59e0b' },
                    { label: 'TASTE AI Website', url: 'https://tastetoken.net', color: '#3b82f6' },
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
      case 'socials': return (
        <motion.div key="socials" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <OfficialSocials onClose={() => goBack()} />
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
            <h3 style={{ fontWeight: 900, margin: '0 0 16px', fontSize: '1rem' }}>🤖 {t('app.project_assistant')}</h3>
            <TasteAI />
          </div>
        </motion.div>
      );
      case 'wallet': return (
        <motion.div key="wallet" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>TAI WALLET</div>
            <h3 style={{ fontWeight: 900, margin: '0 0 16px', fontSize: '1rem' }}>👛 {t('nav.wallet') || 'Cüzdan & Transfer'}</h3>
            <WalletTransfer />
          </div>
        </motion.div>
      );
      case 'partners': return (
        <motion.div key="partners" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#3b82f6', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>{t('app.web3_partners')}</div>
            <h3 style={{ fontWeight: 900, margin: '0 0 16px', fontSize: '1rem' }}>
              🤝 {t('app.joint_projects')}
            </h3>
            <Partners />
          </div>
        </motion.div>
      );
      case 'team': return (
        <motion.div key="team" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
          <Team onClose={() => goBack()} />
        </motion.div>
      );
      case 'ecosystem': return (
        <motion.div key="ecosystem" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>TASTE</div>
            <h3 style={{ fontWeight: 900, margin: '0 0 16px', fontSize: '1rem' }}>🌐 {t('nav.ecosystem')}</h3>
            <TasteEcosystem
              onNavigate={(tab) => navigateTo(tab as any)}
              onOpenTastePay={() => setIsTastePayOpen(true)}
            />
          </div>
        </motion.div>
      );
      case 'settings': return (
        <motion.div key="settings" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
          <Settings />
        </motion.div>
      );
      default: return <Home />;
          }
        })()}
      </>
    );
  };

  return (
    <PinLock>
      {/* ── Splash Screen (shown on every app launch) ── */}
      <AnimatePresence>
        {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
      </AnimatePresence>
      <PWAInstallBanner />
      <InstallModal isOpen={isInstallModalOpen} onClose={() => setIsInstallModalOpen(false)} />
      <AnimatePresence>
        {langSelectionVisible && (
          <LangSelectionModal
            onSelect={(code) => {
              changeLanguage(code);
              localStorage.setItem('taste_lang_selected', 'true');
              setLangSelectionVisible(false);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!langSelectionVisible && disclaimerVisible && (
          <DisclaimerModal onAccept={() => setDisclaimerVisible(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isTastePayOpen && (
          <TastePay onClose={() => setIsTastePayOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showKYC && (
          <KYCModal onClose={() => setShowKYC(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showNotifications && (
          <NotificationPanel onClose={() => setShowNotifications(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSwapScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 8000, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
            onClick={e => { if (e.target === e.currentTarget) setShowSwapScreen(false) }}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 200 }}
              style={{ background: 'linear-gradient(180deg,#0f172a,#1e293b)', borderRadius: '28px 28px 0 0', padding: '28px 20px 56px', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <SwapScreen onClose={() => setShowSwapScreen(false)} />
            </motion.div>
          </motion.div>
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
              🔔 ≈{pingAmount.toLocaleString()} TAI {t('app.swap_opening')}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── TTCoin-style Top Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            paddingTop: '10px', paddingBottom: '8px', position: 'relative'
          }}
        >
          {/* Left: hamburger + title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(true)}
              style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10, padding: '7px 9px', color: '#fff', cursor: 'pointer',
                display: 'flex', alignItems: 'center'
              }}
            >
              <Menu size={19} />
            </motion.button>
            <span style={{ fontSize: 18, fontWeight: 900, letterSpacing: 0.5,
              background: 'linear-gradient(135deg,#ffd700,#f59e0b)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>TASTE TAI</span>
          </div>

          {/* Right: KYC + Bell + Lang + Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* KYC badge */}
            <div onClick={() => setShowKYC(true)} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.35)',
              borderRadius: 20, padding: '4px 10px', fontSize: 11, fontWeight: 700, color: '#10b981',
              cursor: 'pointer'
            }}>
              <ShieldCheck size={12} />
              KYC
            </div>

            {/* Notification bell */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowNotifications(true)}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '7px', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', position: 'relative' }}
            >
              <Bell size={16} />
              <span style={{ position: 'absolute', top: 5, right: 5, width: 6, height: 6, borderRadius: '50%', background: '#ef4444', border: '1px solid #0a0f1c' }} />
            </motion.button>

            {/* Lang button */}
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowLangMenu(!showLangMenu)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--bg-card-border)', color: 'var(--text-main)', padding: '5px 10px', borderRadius: '15px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Globe size={13} />
              {currentLang.flag}
            </motion.button>

            {/* Profile avatar */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowProfile(true)}
              style={{ padding: 0, background: 'none', border: '2px solid #f59e0b', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 0 10px rgba(245,159,11,0.4)' }}
            >
              <img src="/logo.jpg" alt="profil" style={{ width: 34, height: 34, borderRadius: '50%', display: 'block', objectFit: 'cover' }} />
            </motion.button>
          </div>

          <AnimatePresence>
            {showLangMenu && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowLangMenu(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }} />
                <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 10 }} style={{ position: 'absolute', top: '50px', right: '0', background: 'var(--bg-card)', backdropFilter: 'blur(20px)', border: '1px solid var(--bg-card-border)', borderRadius: '15px', padding: '10px', zIndex: 101, minWidth: '150px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
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

        {/* ── Left Side Drawer (TTCoin style) ── */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setIsMenuOpen(false)}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)', zIndex: 9000 }}
              />
              {/* Left Drawer */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 250 }}
                style={{
                  position: 'fixed', top: 0, left: 0, bottom: 0, width: '78%', maxWidth: 300,
                  background: 'linear-gradient(180deg, rgba(10,15,28,0.98) 0%, rgba(15,23,42,0.99) 100%)',
                  backdropFilter: 'blur(20px)',
                  borderRight: '1px solid rgba(245,159,11,0.15)',
                  zIndex: 9001, display: 'flex', flexDirection: 'column', overflowY: 'auto',
                  paddingBottom: 30,
                }}
              >
                {/* Drawer header */}
                <div style={{
                  padding: '52px 20px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: 'linear-gradient(135deg, rgba(245,159,11,0.08), transparent)'
                }}>
                  <img src="/logo.jpg" alt="TAI" style={{ width: 52, height: 52, borderRadius: '50%', border: '2px solid #f59e0b', boxShadow: '0 0 16px rgba(245,159,11,0.4)' }} />
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>TASTE TAI</div>
                    <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>Taste AI Tarafından Desteklenmektedir</div>
                  </div>
                  <button onClick={() => setIsMenuOpen(false)} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#475569', cursor: 'pointer', padding: 4 }}>
                    <X size={20} />
                  </button>
                </div>

                {/* Drawer menu items */}
                <div style={{ padding: '12px 0', flex: 1 }}>
                  {[
                    { id: 'ecosystem', icon: '🌐', label: 'TAI Ekosistemi', isNew: true },
                    { id: 'socials', icon: '📱', label: 'Sosyal Kanallar', isNew: true },
                    { id: 'team', icon: '👥', label: 'Takım', isNew: true },
                    null,
                    { id: 'swap', icon: '⚡', label: 'Kullanıcı Satın Alımları' },
                    null,
                    { id: 'tokenomics', icon: '🥧', label: 'Token Dağılımı' },
                    { id: 'whitepaper', icon: '📖', label: 'Whitepaper' },
                    { id: 'tech', icon: '⛓️', label: 'TAI Blockchain' },
                    null,
                    { id: 'ai', icon: '🤖', label: 'Taste AI' },
                    { id: 'install_pwa', icon: '📲', label: 'Uygulamayı Kur (PWA)' },
                    { id: 'faq', icon: '❓', label: 'Yardım' },
                    { id: 'vote', icon: '🗳️', label: 'Web Sitesini Ziyaret Et' },
                  ].map((item: any, idx: number) => {
                    if (item === null) return <div key={idx} style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '6px 20px' }} />;
                    return (
                      <motion.button
                        key={item.id}
                        whileHover={{ background: 'rgba(245,159,11,0.07)', x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (item.id === 'swap') {
                            setShowSwapScreen(true);
                          } else if (item.id === 'install_pwa') {
                            setIsInstallModalOpen(true);
                          } else {
                            navigateTo(item.id as any);
                          }
                          setIsMenuOpen(false);
                        }}
                        style={{
                          width: '100%', background: 'transparent', border: 'none',
                          display: 'flex', alignItems: 'center', gap: 14,
                          padding: '13px 20px', cursor: 'pointer',
                          color: activeTab === item.id ? '#f59e0b' : '#cbd5e1',
                          textAlign: 'left', position: 'relative',
                        }}
                      >
                        {activeTab === item.id && (
                          <div style={{ position: 'absolute', left: 0, top: 6, bottom: 6, width: 3, background: '#f59e0b', borderRadius: '0 3px 3px 0' }} />
                        )}
                        <span style={{ fontSize: 20, width: 28, textAlign: 'center' }}>{item.icon}</span>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>{item.label}</span>
                        {item.isNew && (
                          <span style={{ marginLeft: 'auto', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', fontSize: 8, fontWeight: 900, padding: '2px 6px', borderRadius: 6 }}>YENİ</span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Bottom links */}
                <div style={{ padding: '0 20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
                  {[{ id: 'legal', icon: '⚖️', label: t('nav.legal') }, { id: 'settings', icon: '⚙️', label: 'Ayarlar' }].map((item) => (
                    <motion.button
                      key={item.id}
                      whileHover={{ background: 'rgba(255,255,255,0.05)', x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => { navigateTo(item.id as any); setIsMenuOpen(false); }}
                      style={{ width: '100%', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: 14, padding: '11px 0', cursor: 'pointer', color: '#64748b', textAlign: 'left' }}
                    >
                      <span style={{ fontSize: 18 }}>{item.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* ── Profile Page Overlay ── */}
        <AnimatePresence>
          {showProfile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'var(--gradient-main)', zIndex: 8500, overflowY: 'auto', padding: '60px 20px 100px' }}
            >
              <Profile onClose={() => setShowProfile(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── 5-Tab Bottom Navigation (TTCoin style) ── */}
        <nav className="bottom-nav" style={{ padding: '0 4px' }}>
          {/* 1. Cüzdan */}
          <button
            className={`nav-item ${activeBottomTab === 'wallet' ? 'active' : ''}`}
            onClick={() => { setActiveBottomTab('wallet'); navigateTo('wallet'); setIsMenuOpen(false); }}
          >
            <span className="nav-icon"><Wallet size={21} /></span>
            <span className="nav-label">{t('nav.wallet', 'Cüzdan')}</span>
          </button>

          {/* 2. Ana Sayfa — center big button */}
          <button
            onClick={() => { setActiveBottomTab('home'); setActiveTab('home'); setIsMenuOpen(false); }}
            style={{ position: 'relative', flex: '1.3', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', cursor: 'pointer', gap: 4 }}
          >
            <motion.div
              whileTap={{ scale: 0.9 }}
              animate={activeBottomTab === 'home' ? { boxShadow: ['0 0 12px rgba(245,159,11,0.5)', '0 0 24px rgba(245,159,11,0.9)', '0 0 12px rgba(245,159,11,0.5)'] } : {}}
              transition={{ duration: 1.8, repeat: Infinity }}
              style={{
                width: 50, height: 50, borderRadius: '50%',
                background: activeBottomTab === 'home'
                  ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                  : 'rgba(245,159,11,0.15)',
                border: '2px solid #f59e0b',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginTop: -14,
                boxShadow: activeBottomTab === 'home' ? '0 0 20px rgba(245,159,11,0.6)' : 'none',
              }}
            >
              <Home size={22} color={activeBottomTab === 'home' ? '#000' : '#f59e0b'} />
            </motion.div>
            <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: activeBottomTab === 'home' ? '#f59e0b' : '#64748b', letterSpacing: 0.5 }}>{t('nav.home', 'Ana Sayfa')}</span>
          </button>

          {/* 4. Havuz */}
          <button
            className={`nav-item ${activeBottomTab === 'pool' ? 'active' : ''}`}
            onClick={() => { setActiveBottomTab('pool'); navigateTo('pool'); setIsMenuOpen(false); }}
          >
            <span className="nav-icon"><Waves size={21} /></span>
            <span className="nav-label">{t('nav.pool', 'Havuz')}</span>
          </button>

          {/* 5. Ayarlar */}
          <button
            className={`nav-item ${activeBottomTab === 'settings' ? 'active' : ''}`}
            onClick={() => { setActiveBottomTab('settings'); navigateTo('settings'); setIsMenuOpen(false); }}
          >
            <span className="nav-icon"><SettingsIcon size={21} /></span>
            <span className="nav-label">{t('nav.settings', 'Ayarlar')}</span>
          </button>
        </nav>

        <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const url = 'https://taste-miniapp-xy8k.vercel.app/audit.html';
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
              const url = 'https://taste-miniapp-xy8k.vercel.app/litepaper.html';
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
    </PinLock>
  );
}

export default App
