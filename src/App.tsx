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
import { DisclaimerModal, shouldShowDisclaimer } from './components/DisclaimerModal'
import { PoweredBy } from './components/PoweredBy'
import {
  Home,
  Map,
  FileText,
  Flame,
  Gift,
  Heart,
  Scale
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
  const [activeTab, setActiveTab] = useState<'home' | 'manifesto' | 'roadmap' | 'whitepaper' | 'spin' | 'charity' | 'community' | 'legal'>('home');
  const [disclaimerVisible, setDisclaimerVisible] = useState<boolean>(shouldShowDisclaimer());
  const [tonConnectUI] = useTonConnectUI();
  const [showPing, setShowPing] = useState(false);
  const [pingAmount, setPingAmount] = useState(0);
  const [tastePerTon, setTastePerTon] = useState(741); // default fallback
  const [tonUsdPrice, setTonUsdPrice] = useState(3.5); // live TON price

  const [showLangMenu, setShowLangMenu] = useState(false);

  // Language Persistence & Initialization
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

            {/* Buy Panel */}
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '15px', textAlign: 'center' }}>{t('app.buy_title')}</h3>

              {/* Countdown Timer */}
              <CountdownTimer earlyAccessLabel={t('app.early_access_ending')} />

              {/* Reward Countdown */}
              <RewardCountdown />

              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: '5px', marginBottom: '10px' }}>
                <AnimatePresence mode="wait">
                  <motion.span key={amount} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ fontSize: '32px', fontWeight: 'bold' }}>
                    {amount}
                  </motion.span>
                </AnimatePresence>
                <span style={{ color: 'var(--primary)', fontWeight: '600' }}>TON</span>
              </div>

              {/* Estimated TASTE */}
              <div style={{ textAlign: 'center', marginBottom: '20px', fontSize: '13px', color: 'var(--text-muted)' }}>
                ≈ <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '15px' }}>{Math.round(amount * tastePerTon).toLocaleString()}</span> TASTE {t('app.you_get')}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '25px' }}>
                {[0.5, 1, 3, 5, 10, 15].map((val) => (
                  <motion.button key={val} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setAmount(val)} style={{ background: amount === val ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: amount === val ? '#000' : 'var(--text-main)', border: '1px solid var(--bg-card-border)', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
                    {val} TON
                  </motion.button>
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="glass-button primary-glow" style={{ width: '100%', fontSize: '1.1rem', background: 'var(--gradient-gold)', color: '#000', border: 'none' }} onClick={handleBuy}>
                {t('app.buy_with')}
              </motion.button>

              {/* Holders + STON.fi */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', fontSize: '12px' }}>
                <span style={{ color: 'var(--text-muted)' }}>👥 {holdersCount} {t('app.units.holder')}</span>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  href="https://app.ston.fi/swap?chartVisible=false&ft=TON&tt=EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '600' }}
                  onClick={(e) => {
                    e.preventDefault();
                    const url = 'https://app.ston.fi/swap?chartVisible=false&ft=TON&tt=EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-';
                    if (window.Telegram?.WebApp) window.Telegram.WebApp.openLink(url);
                    else window.open(url, '_blank');
                  }}
                >
                  📊 STON.fi →
                </motion.a>
              </div>
            </div>

            <LiveMarketData />
            <SocialTasks />

            {/* FAQ Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '15px', fontSize: '1rem' }}>{t('app.faq.title')}</h3>

              <div style={{ marginBottom: '15px' }}>
                <p style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '13px', marginBottom: '5px' }}>{t('app.faq.what_is')}</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                    {t('app.faq.what_is_ans')}
                </p>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <p style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '13px', marginBottom: '5px' }}>{t('app.faq.how_to')}</p>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                    <Trans i18nKey="app.faq.how_to_ans" />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <p style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '13px', marginBottom: '10px' }}>{t('whitepaper.summary.lock_reason_title')}</p>
                {[
                  { label: `${t('whitepaper.summary.lock_prefix')} 1 — 10M TASTE (40%)`, url: 'https://tonscan.org/nft/EQDKKeOpSEE_diuEGULjR-yrJwrGOSwoHvYVdAPmtbeNj0v2', color: '#22c55e' },
                  { label: `${t('whitepaper.summary.lock_prefix')} 2 — 8M TASTE (32%)`, url: 'https://tonscan.org/nft/EQDZLpOUQHOF1C6ekwMl3ERhl-j--r3zprppGtgm287K-6sc', color: '#22c55e' },
                  { label: `${t('whitepaper.summary.lock_prefix')} 3 — 4.1M TASTE (16.4%)`, url: 'https://tonscan.org/nft/EQDi4tBlzXtLMXQA1OVOZfKVwLiGoM-tU0rNBVc8e4rHt3co', color: '#22c55e' },
                  { label: `${t('whitepaper.summary.lp_lock_title')} (81.6%)`, url: 'https://tonscan.org/jetton/0:86107ac1baea0a549ff42ea432dfc17e73ea4df89af3d0cfc049d0ad27164bef', color: '#818cf8' },
                  { label: t('legal.nav.risk.label'), url: 'https://incandescent-gelato-cc11a4.netlify.app/audit.html', color: '#f59e0b' },
                ].map((item, i) => (
                  <motion.div key={i} whileTap={{ scale: 0.97 }} onClick={() => {
                    if (window.Telegram?.WebApp) window.Telegram.WebApp.openLink(item.url);
                    else window.open(item.url, '_blank');
                  }} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: `${item.color}08`, border: `1px solid ${item.color}25`, borderRadius: '10px', padding: '9px 12px', marginBottom: '6px', cursor: 'pointer' }}>
                    <span style={{ fontSize: '11px', color: item.color, fontWeight: 600 }}>{item.label}</span>
                    <span style={{ fontSize: '11px', color: item.color }}>→</span>
                  </motion.div>
                ))}
              </div>

              <div>
                <p style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '13px', marginBottom: '5px' }}>{t('whitepaper.tokenomics.title')}</p>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                    <Trans i18nKey="whitepaper.tokenomics.summary_text" />
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass-panel" style={{ padding: '18px', marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#22c55e', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>{t('home.live_badge')}</div>
              <h3 style={{ fontWeight: 900, margin: '0 0 14px', fontSize: '1rem' }}>{t('home.live_title')}</h3>
              <LiveActivity />
            </motion.div>

            {/* Invite Section */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <span style={{ fontSize: '24px' }}>🤝</span>
                <div>
                  <h3 style={{ fontSize: '1rem' }}>{t('app.invite_friend')}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('app.invite_desc')}</p>
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

            {/* Community Stats - Subtle */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)' }}>{holdersCount}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>{t('app.units.holder')}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)' }}>25M</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>{t('app.units.supply')}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)' }}>88.4%</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>{t('app.units.locked')}</div>
              </div>
            </motion.div>

            {/* Powered By Section */}
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

        {activeTab === 'home' && (
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 15 }} style={{ textAlign: 'center', marginBottom: '30px', marginTop: '10px' }}>
            {/* Logo + Rotating Text */}
            <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto 15px' }}>
              {/* Rotating SVG Text */}
              <svg
                viewBox="0 0 180 180"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  animation: 'spin-text 12s linear infinite'
                }}
              >
                <defs>
                  <path
                    id="circlePath"
                    d="M 90,90 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0"
                  />
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="50%" stopColor="#fbbf24" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                <text fill="url(#goldGradient)" fontSize="13" fontWeight="800" letterSpacing="5">
                  <textPath href="#circlePath" startOffset="0%">
                    TASTE • TOKEN • TASTE • TOKEN •
                  </textPath>
                </text>
              </svg>

              {/* Logo Video */}
              <motion.div
                animate={{ y: [0, -6, 0], scale: [1, 1.03, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  boxShadow: '0 0 30px var(--primary-glow)',
                  border: '4px solid rgba(245, 159, 11, 0.3)',
                  overflow: 'hidden'
                }}
              >
                <video
                  src="/logo-gif.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                />
              </motion.div>
            </div>
            <p style={{ color: 'var(--text-muted)', marginTop: '5px', fontSize: '14px' }}>{t('app.description')}</p>

            {/* Tanıtım Videosu */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-panel"
              style={{ marginTop: '20px', padding: '12px', borderRadius: '16px' }}
            >
              <video
                src="/taste-intro.mp4"
                controls
                playsInline
                preload="metadata"
                poster={TASTE_LOGO}
                style={{ width: '100%', borderRadius: '12px', maxHeight: '250px' }}
              />
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>🎬 TASTE Intro</p>
            </motion.div>
          </motion.div>
        )}

        <main style={{ marginTop: activeTab === 'home' ? '0' : '20px' }}>
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </main>

        <nav className="bottom-nav" style={{ overflowX: 'auto', justifyContent: 'flex-start', gap: '4px', paddingLeft: '8px', paddingRight: '8px' }}>
          <button className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
            <span className="nav-icon"><Home size={18} /></span><span className="nav-label">{t('nav.home')}</span>
          </button>
          <button className={`nav-item ${activeTab === 'manifesto' ? 'active' : ''}`} onClick={() => setActiveTab('manifesto')}>
            <span className="nav-icon"><Flame size={18} /></span><span className="nav-label">Manifesto</span>
          </button>
          <button className={`nav-item ${activeTab === 'community' ? 'active' : ''}`} onClick={() => setActiveTab('community')}>
            <span className="nav-icon">🍽️</span><span className="nav-label">{t('nav.community')}</span>
          </button>
          <button className={`nav-item ${activeTab === 'spin' ? 'active' : ''}`} onClick={() => setActiveTab('spin')}>
            <span className="nav-icon"><Gift size={18} /></span><span className="nav-label">{t('nav.spin')}</span>
          </button>
          <button className={`nav-item ${activeTab === 'charity' ? 'active' : ''}`} onClick={() => setActiveTab('charity')}>
            <span className="nav-icon"><Heart size={18} /></span><span className="nav-label">{t('nav.charity')}</span>
          </button>
          <button className={`nav-item ${activeTab === 'roadmap' ? 'active' : ''}`} onClick={() => setActiveTab('roadmap')}>
            <span className="nav-icon"><Map size={18} /></span><span className="nav-label">{t('nav.roadmap')}</span>
          </button>
          <button className={`nav-item ${activeTab === 'whitepaper' ? 'active' : ''}`} onClick={() => setActiveTab('whitepaper')}>
            <span className="nav-icon"><FileText size={18} /></span><span className="nav-label">{t('nav.whitepaper')}</span>
          </button>
          <button className={`nav-item ${activeTab === 'legal' ? 'active' : ''}`} onClick={() => setActiveTab('legal')}>
            <span className="nav-icon"><Scale size={18} /></span><span className="nav-label">{t('nav.legal')}</span>
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
