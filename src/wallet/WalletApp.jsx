import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './components/Home';
import Profile from './components/Profile';
import Welcome from './components/Welcome';
import Swap from './components/Swap';
import History from './components/History';
import Menu from './components/Menu';
import Staking from './components/Staking';
import PinLock from './components/PinLock';
import SendScreen from './components/SendScreen';
import ReceiveScreen from './components/ReceiveScreen';
import QAIAssistant from './components/QAIAssistant';
import ListingScreen from './components/ListingScreen';
import DiscoveryHub from './components/DiscoveryHub';
import GamesHub from './components/GamesHub';
import AdminPanel from './components/AdminPanel';
import { loadWallet, deriveAllAddresses } from './walletService';
import { fetchAllBalances, withTimeout, clearMemCache } from './blockchainService';
import { translations } from './i18n';
import { WALLET_CONFIG } from './config';
import { Home as HomeIcon, Clock, QrCode, Grid, User, RefreshCw, LayoutGrid, Bot, X } from 'lucide-react';

const WalletApp = ({ onClose, parentLang, onParentLangChange }) => {
  // ── TOAST BİLDİRİM SİSTEMİ ───────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);

  const showToast = (type, title, body) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, title, body }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 5000);
  };

  const sendNotification = (title, body, type = 'info') => {
    // Ekran içi toast
    showToast(type, title, body);
    // Tarayıcı bildirimi (izin varsa)
    try {
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/logo.png' });
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
      Notification.requestPermission().catch(() => {});
    }
  }, []);
  const [hasWallet, setHasWallet] = useState(false);
  const [walletData, setWalletData] = useState(null);
  const [allWallets, setAllWallets] = useState([]);
  const [isLocked, setIsLocked] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);
  const [tgUser, setTgUser] = useState(null);
  const [tab, setTab] = useState('home');
  const [activeToken, setActiveToken] = useState(null);
  const [lang, setLangState] = useState(parentLang || 'tr');

  useEffect(() => {
    if (parentLang && parentLang !== lang) {
      setLangState(parentLang);
    }
  }, [parentLang]);

  const setLang = (newLang) => {
    setLangState(newLang);
    if (onParentLangChange) {
      onParentLangChange(newLang);
    }
  };
  const [balances, setBalances] = useState({});
  const [tokens, setTokens] = useState(() => {
    const saved = localStorage.getItem('active_tokens');
    let list = saved ? JSON.parse(saved) : [...WALLET_CONFIG.TOKENS];
    // ZORUNLU BİRLEŞTİRME: config.js'deki tüm ana paralar (BTC, SOL vb.) listede yoksa ekle
    WALLET_CONFIG.TOKENS.forEach(dt => {
      if (!list.find(p => p.id === dt.id)) {
        list.push({ ...dt, balance: 0, price: dt.price || 0 });
      }
    });
    localStorage.setItem('active_tokens', JSON.stringify(list));
    return list;
  });
  const [stakedBalances, setStakedBalances] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [receiveNet, setReceiveNet] = useState('TON'); // Yeni eklenen state
  const [showSplash, setShowSplash] = useState(true);
  const [isAddingWallet, setIsAddingWallet] = useState(false);



  // Telegram Bağlantısı
  useEffect(() => {
    if (window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      if (tg.initDataUnsafe?.user) {
        setTgUser(tg.initDataUnsafe.user);
      }
    }

    // Splash screen zamanlayıcısı
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 7000); // 7 saniye
    return () => clearTimeout(timer);
  }, []);


  const updateWalletSettings = (newSettings) => {
    const updated = { ...walletData, settings: { ...walletData.settings, ...newSettings } };
    setWalletData(updated);
    localStorage.setItem('qai_wallet', JSON.stringify(updated));
  };

  // i18n Yardımcı Fonksiyonu — lang > en > key fallback
  const t = (key) => {
    if (!key || typeof key !== 'string') return '';
    const keys = key.split('.');
    // 1) Seçili dil
    let result = translations[lang];
    let found = true;
    for (const k of keys) {
      if (result && result[k] !== undefined) { result = result[k]; }
      else { found = false; break; }
    }
    if (found && typeof result === 'string') return result;
    // 2) İngilizce fallback
    result = translations['en'];
    for (const k of keys) {
      if (result && result[k] !== undefined) { result = result[k]; }
      else return key; // key'i döndür, undefined değil
    }
    return typeof result === 'string' ? result : key;
  };

  // Tema Uygulama
  useEffect(() => {
    const theme = walletData?.settings?.theme || 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  }, [walletData?.settings?.theme]);

  const [livePrices, setLivePrices] = useState({
    ethereum: 0, binancecoin: 0, toncoin: 0, bitcoin: 0, solana: 0,
    tether: 1, 'usd-coin': 1, taste: 0.000448, 
    arbitrum: 0, 'base-eth': 0, 'matic-network': 0, 'monad-native': 0.028, tron: 0
  });
  const [priceChanges, setPriceChanges] = useState({});
  const [hideBalance, setHideBalance] = useState(false);
  const prevBalancesRef = useRef({});

  const playTrink = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Tarayıcı sesi engellerse veya dosya bozuksa sessizce geç
      });
    } catch (e) {}
  };

  const switchWallet = (address) => {
    const target = allWallets.find(w => w.addresses.TON === address);
    if (target) {
      setWalletData(target);
      localStorage.setItem('qai_wallet', JSON.stringify(target));
      setBalances({});
      setTab('home');
    }
  };

  const addNewWalletToList = (newWallet) => {
    const exists = allWallets.find(w => w.addresses?.TON === newWallet.addresses?.TON);
    if (!exists) {
      const updated = [...allWallets, newWallet];
      setAllWallets(updated);
      localStorage.setItem('qai_all_wallets', JSON.stringify(updated));
    }
    setWalletData(newWallet);
    localStorage.setItem('qai_wallet', JSON.stringify(newWallet));
    setHasWallet(true);
    setIsAddingWallet(false);
    setIsLocked(false); // Yeni cüzdan eklenince kilidi aç
    setTab('home');
  };

  const onAccountSwitch = async (index) => {
    if (!walletData?.mnemonic) return;
    setIsRefreshing(true);
    const service = await import('./walletService');
    const newAddresses = await service.deriveAllAddresses(walletData.mnemonic, index);
    const updated = { ...walletData, addresses: newAddresses, index: index };
    setWalletData(updated);
    
    // allWallets icindeki ilgili cuzdanı da guncelle
    const updatedAll = allWallets.map(w => w.mnemonic === walletData.mnemonic ? updated : w);
    setAllWallets(updatedAll);
    localStorage.setItem('qai_all_wallets', JSON.stringify(updatedAll));
    localStorage.setItem('qai_wallet', JSON.stringify(updated));
    
    setBalances({});
    await loadBalances();
    setIsRefreshing(false);
  };


  // Bakiye referansını sadece takip amaçlı güncelle (bildirim YOK)
  useEffect(() => {
    prevBalancesRef.current = { ...balances };
  }, [balances]);

  useEffect(() => {
    const initApp = async () => {
      const saved = loadWallet();
      if (saved && saved.addresses) {
        // Her açılışta adresleri ZORLA yeniden türet
        if (saved.mnemonic) {
          try {
            const service = await import('./walletService');
            const newAddresses = await service.deriveAllAddresses(saved.mnemonic);
            // Sadece N/A olmayan adresleri güncelle
            const merged = { ...saved.addresses };
            Object.keys(newAddresses).forEach(k => {
              if (newAddresses[k] && newAddresses[k] !== 'N/A') {
                merged[k] = newAddresses[k];
              }
            });
            saved.addresses = merged;
            localStorage.setItem('qai_wallet', JSON.stringify(saved));
          } catch (e) {
            console.error("Address re-derivation failed:", e);
          }
        }
        
        setWalletData(saved);
        setHasWallet(true);

        const wallets = JSON.parse(localStorage.getItem('qai_all_wallets') || '[]');
        // Eğer mevcut cüzdan listede yoksa ekle (Eski versiyon uyumluluğu)
        if (saved && !wallets.find(w => w.addresses.TON === saved.addresses.TON)) {
          wallets.push(saved);
          localStorage.setItem('qai_all_wallets', JSON.stringify(wallets));
        }
        setAllWallets(wallets);

        if (saved.pin && saved.settings?.pinEnabled !== false) {
          setIsLocked(true);
        } else {
          setIsLocked(false);
        }
      } else {
        // Cüzdan yoksa ama listede varsa ilkini yükle
        const wallets = JSON.parse(localStorage.getItem('qai_all_wallets') || '[]');
        if (wallets.length > 0) {
           setWalletData(wallets[0]);
           localStorage.setItem('qai_wallet', JSON.stringify(wallets[0]));
           setHasWallet(true);
           setAllWallets(wallets);
        }
      }
      setIsAppReady(true);
      setTimeout(() => setShowSplash(false), 7500);
    };

    initApp();
  }, []);

  const addNewToken = (newToken) => {
    if (!newToken?.id) return;
    const contract = newToken.contract || '';
    // Zaten varsa ekleme
    const exists = tokens.find(tk =>
      tk.id === newToken.id ||
      (contract && contract !== 'native' && tk.contract && tk.contract !== 'native' &&
       tk.contract.toLowerCase() === contract.toLowerCase())
    );
    if (exists) return;
    const updated = [...tokens, { ...newToken, balance: 0, price: 0 }];
    setTokens(updated);
    localStorage.setItem('active_tokens', JSON.stringify(updated));
  };

  const removeToken = (tokenId) => {
    const updated = tokens.filter(tk => tk.id !== tokenId);
    setTokens(updated);
    localStorage.setItem('active_tokens', JSON.stringify(updated));
  };

  // Ensure the user always has new default tokens (like BTC, SOL, USDC)
  useEffect(() => {
    setTokens(prev => {
      let changed = false;
      const combined = [...prev];
      WALLET_CONFIG.TOKENS.forEach(dt => {
        if (!combined.find(p => p.id === dt.id)) {
          combined.push({ ...dt, balance: 0, price: dt.price || 0 });
          changed = true;
        }
      });
      if (changed) {
        localStorage.setItem('active_tokens', JSON.stringify(combined));
        return combined;
      }
      return prev;
    });

    // Eski formatı yenisine taşı
    const old = localStorage.getItem('user_tokens');
    if (old) {
       const saved = JSON.parse(old);
       if (saved.length > 0) {
         setTokens(prev => {
            const combined = [...prev, ...saved.filter(s => !prev.find(p => p.id === s.id))];
            localStorage.setItem('active_tokens', JSON.stringify(combined));
            return combined;
         });
       }
       localStorage.removeItem('user_tokens');
    }
  }, []);

  // Bakiyeleri Çek
  const loadBalances = async () => {
    if (!walletData?.addresses) return;
    try {
      // tokens state'ini kullan (kullanıcının eklediği tokenlar dahil)
      const bals = await fetchAllBalances(walletData.addresses, tokens);
      if (bals && Object.keys(bals).length > 0) {

        setBalances(prev => ({ ...prev, ...bals }));
      }
    } catch (e) {
      console.warn("[Balances] Load Error:", e);
    }
  };

  // (bakiye ses efekti yukarıdaki izleme useEffect'inde yönetiliyor)

  // Fiyatları Çek
    const fetchPrices = async () => {
    try {
       // Throttling: 15 saniyeden önce tekrar çekme
       const now = Date.now();
       if (window.lastPriceFetch && now - window.lastPriceFetch < 15000) return;
       window.lastPriceFetch = now;

       const res = await withTimeout(fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum,binancecoin,the-open-network,tether,usd-coin,arbitrum,matic-network,tron&vs_currencies=usd,try,eur,gbp&include_24hr_change=true'), 15000);
      
      if (res.status === 429) return;
      
      const data = await res.json();
      if (!data) return;

      setLivePrices(prev => {
        const next = { ...prev };
         if (data.ethereum) next.ethereum = data.ethereum.usd;
         if (data.binancecoin) next.binancecoin = data.binancecoin.usd;
         if (data['the-open-network']) next.toncoin = data['the-open-network'].usd;
         if (data.tether) next.tether = data.tether.usd;
         if (data['usd-coin']) next['usd-coin'] = data['usd-coin'].usd;
         if (data.arbitrum) next.arbitrum = data.arbitrum.usd;
         if (data['matic-network']) next['matic-network'] = data['matic-network'].usd;
         if (data.tron) next.tron = data.tron.usd;
         
         next['monad-native'] = 0.028; 
         next.taste = 0.000448;
         return next;
      });

      setPriceChanges(prev => {
        const next = { ...prev };
        if (data.ethereum) next.ethereum = data.ethereum.usd_24h_change;
        if (data.binancecoin) next.binancecoin = data.binancecoin.usd_24h_change;
        if (data['the-open-network']) next.toncoin = data['the-open-network'].usd_24h_change;
        return next;
      });

    } catch (err) {
      // Tamamen sessiz kalıyoruz, konsolu yormuyoruz
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [tab]);

  useEffect(() => {
    if (!hasWallet || isLocked || !isAppReady) return;
    
    fetchPrices();
    loadBalances();

    const interval = setInterval(() => {
      fetchPrices();
      loadBalances();
    }, 120000); // 120 saniyeye çıkarıldı (Rate limit spamini önlemek için)
    return () => clearInterval(interval);
  }, [hasWallet, isLocked, isAppReady, tokens, walletData?.addresses]);

  const onRefresh = async () => {
    if (!walletData?.addresses) return;
    setIsRefreshing(true);
    clearMemCache();
    try {
      const addrs = { ...walletData.addresses };
      let changed = false;

      // Eksik adresleri üret ve kaydet
      if (!addrs.TON_RAW || !addrs.MONAD) {
        const { TON_RAW, MONAD } = await deriveAllAddresses(walletData.mnemonic);
        if (!addrs.TON_RAW) { addrs.TON_RAW = TON_RAW; changed = true; }
        if (!addrs.MONAD) { addrs.MONAD = MONAD; changed = true; }
      }
      
      if (changed) {
        const updatedWallet = { ...walletData, addresses: addrs };
        setWalletData(updatedWallet);
        localStorage.setItem('qai_wallet', JSON.stringify(updatedWallet));
      }

      // Parallelde bakiye çek
      const b = await fetchAllBalances(addrs, tokens);
      
      // Kademeli bakiye yükleme (Sistemi kilitlememe garantisi)
      if (b && Object.keys(b).length > 0) {
        setBalances(prev => ({ ...prev, ...b }));
      }
    } catch (e) {
      console.warn("Bakiye motoru detayı:", e);
    }
    setIsRefreshing(false);
  };

  if (!isAppReady) return null;

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', background: 'var(--bg-main)', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>

      {/* ── TOAST BİLDİRİMLER ── */}
      <div style={{ position: 'fixed', top: '16px', left: '50%', transform: 'translateX(-50%)', zIndex: 99999, display: 'flex', flexDirection: 'column', gap: '8px', width: '90%', maxWidth: '420px', pointerEvents: 'none' }}>
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              style={{
                background: toast.type === 'success' ? 'rgba(16,185,129,0.95)' : toast.type === 'warning' ? 'rgba(245,158,11,0.95)' : 'rgba(99,102,241,0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '16px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.15)',
                pointerEvents: 'auto'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>
                {toast.type === 'success' ? '💰' : toast.type === 'warning' ? '📤' : 'ℹ️'}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '900', fontSize: '0.82rem', color: '#fff' }}>{toast.title}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)', marginTop: '2px' }}>{toast.body}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            exit={{ opacity: 0, transition: { duration: 1.0, ease: 'easeInOut' } }}
            style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#050508', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}
          >
            {/* Arka plan gradient halkalar */}
            <motion.div
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.4, 0.2] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%)', pointerEvents: 'none' }}
            />
            <motion.div
              animate={{ scale: [1.2, 0.8, 1.2], opacity: [0.1, 0.25, 0.1] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
              style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', pointerEvents: 'none' }}
            />

            {/* Dönen halka */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', border: '1px solid rgba(124,58,237,0.2)', borderTopColor: 'rgba(124,58,237,0.6)', pointerEvents: 'none' }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
              style={{ position: 'absolute', width: '260px', height: '260px', borderRadius: '50%', border: '1px solid rgba(236,72,153,0.1)', borderRightColor: 'rgba(236,72,153,0.4)', pointerEvents: 'none' }}
            />

            {/* Logo */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: 'backOut', delay: 0.2 }}
              style={{ position: 'relative', zIndex: 2, marginBottom: '28px' }}
            >
              <motion.div
                animate={{ boxShadow: ['0 0 20px rgba(124,58,237,0.4)', '0 0 60px rgba(124,58,237,0.8)', '0 0 20px rgba(124,58,237,0.4)'] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
              >
               <div style={{ width: '100px', height: '100px', borderRadius: '30px', background: '#fff', padding: '5px', overflow: 'hidden', boxShadow: '0 15px 35px rgba(245, 159, 11, 0.4)' }}>
                <img src="/logo.jpg" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '25px' }} alt="TAI" />
              </div></motion.div>
              {/* Köşe parıltıları */}
              {[0, 90, 180, 270].map(deg => (
                <motion.div key={deg}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: deg / 360 * 2 }}
                  style={{ position: 'absolute', width: '6px', height: '6px', borderRadius: '50%', background: '#7c3aed', top: deg === 0 ? -3 : deg === 180 ? '100%' : '50%', left: deg === 270 ? -3 : deg === 90 ? '100%' : '50%', transform: 'translate(-50%,-50%)' }}
                />
              ))}
            </motion.div>

            {/* Başlık */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              style={{ position: 'relative', zIndex: 2, textAlign: 'center', marginBottom: '32px' }}
            >
              <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-1px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                TAI <span style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>WALLET</span>
            </h1>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
                style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', fontWeight: '600', letterSpacing: '4px', marginTop: '6px' }}
              >
                WEB4 ECOSYSTEM
              </motion.div>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              style={{ position: 'relative', zIndex: 2, width: '140px' }}
            >
              <div style={{ width: '100%', height: '2px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 5.5, ease: 'easeInOut', delay: 1.2 }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, #7c3aed, #ec4899, #7c3aed)', backgroundSize: '200% 100%', borderRadius: '10px' }}
                />
              </div>
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.62rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', fontWeight: '600' }}
              >
                LOADING...
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!hasWallet || isAddingWallet ? (
          <motion.div key="welcome" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ minHeight: '100vh' }}>
              <Welcome setHasWallet={setHasWallet} setWalletData={setWalletData} lang={lang} setLang={setLang} t={t} onCancel={onClose} />
          </motion.div>
        ) : isLocked && walletData?.pin && (walletData?.settings?.pinEnabled !== false) ? (
          <motion.div key="pinlock" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
             <PinLock correctPin={walletData.pin} onSuccess={() => setIsLocked(false)} onReset={() => { localStorage.removeItem('qai_wallet'); setHasWallet(false); }} t={t} />
          </motion.div>
        ) : (
          <motion.div key="app-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ minHeight: '100vh' }}>
            
            <AnimatePresence mode="wait">
                <motion.div 
                    key={tab}
                    initial={{ x: 30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    style={{ minHeight: '100vh', position: 'relative' }}
                >
                    {onClose && (
                        <div 
                            onClick={onClose}
                            style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 9999, background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <X size={20} color="#fff" />
                        </div>
                    )}
                    {tab === 'home'    && <Home allWallets={allWallets} switchWallet={switchWallet} tokens={tokens} addNewToken={addNewToken} removeToken={removeToken} livePrices={livePrices} priceChanges={priceChanges} balances={balances} stakedBalances={stakedBalances} setTab={setTab} setActiveToken={setActiveToken} setReceiveNet={setReceiveNet} walletData={walletData} tgUser={tgUser} t={t} hideBalance={hideBalance} setHideBalance={setHideBalance} onRefresh={onRefresh} isRefreshing={isRefreshing} onAddWallet={() => setIsAddingWallet(true)} onAccountSwitch={onAccountSwitch} />}
                    {tab === 'send'    && <SendScreen    token={activeToken || tokens[0]} onBack={() => setTab('home')} balances={balances} setBalances={setBalances} walletData={walletData} livePrices={livePrices} t={t} />}
                    {tab === 'receive' && <ReceiveScreen initialNetwork={receiveNet} onBack={() => setTab('home')} walletData={walletData} t={t} />}
                    {tab === 'swap'    && <Swap tokens={tokens} activeToken={activeToken} onBack={() => setTab('home')} livePrices={livePrices} balances={balances} setBalances={setBalances} walletData={walletData} t={t} />}
                    {tab === 'services'&& <Swap tokens={tokens} activeToken={activeToken} onBack={() => setTab('home')} livePrices={livePrices} balances={balances} setBalances={setBalances} walletData={walletData} t={t} />}
                    {tab === 'profile' && <Profile  setTab={setTab} setHasWallet={setHasWallet} setLang={setLang} lang={lang} walletData={walletData} updateSettings={updateWalletSettings} tgUser={tgUser} t={t} />}
                    {tab === 'history' && <History  walletData={walletData} t={t} />}
                    {tab === 'staking' && <Staking  setTab={setTab} balances={balances} setBalances={setBalances} stakedBalances={stakedBalances} setStakedBalances={setStakedBalances} walletData={walletData} livePrices={livePrices} t={t} />}                    {tab === 'menu'    && <Menu     setTab={setTab} setActiveToken={setActiveToken} t={t} walletData={walletData} />}
                    {tab === 'qai'     && <QAIAssistant balances={balances} livePrices={livePrices} tokens={tokens} t={t} />}
                    {tab === 'listing' && <ListingScreen onBack={() => setTab('menu')} walletData={walletData} livePrices={livePrices} balances={balances} t={t} />}
                    {tab === 'games'   && <GamesHub onBack={() => setTab('menu')} walletData={walletData} livePrices={livePrices} balances={balances} tokens={tokens} t={t} />}
                    {(tab === 'discovery' || tab === 'discovery_trend') && <DiscoveryHub onBack={() => setTab('menu')} setTab={setTab} setActiveToken={setActiveToken} addNewToken={addNewToken} t={t} />}
                    {tab === 'admin'   && <AdminPanel onBack={() => setTab('menu')} t={t} />}
                </motion.div>
            </AnimatePresence>

            {/* Bottom Navigation */}
            <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(9,9,11,0.95)', backdropFilter: 'blur(20px)', display: 'flex', justifyContent: 'center', gap: '15px', padding: '12px 10px 35px', borderTop: '1px solid var(--glass-border)', zIndex: 1000, maxWidth: '480px', margin: '0 auto' }}>
                <NavButton active={tab==='home'} icon={<HomeIcon />} label="Home" onClick={() => setTab('home')} />
                <NavButton active={tab==='swap'} icon={<RefreshCw />} label="Swap" onClick={() => setTab('swap')} />
                
                <div onClick={() => setTab('qai')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-20px', cursor: 'pointer' }}>
                    <motion.div 
                        initial={{ y: 0 }}
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        style={{ 
                            width: '56px', height: '56px', 
                            background: 'linear-gradient(135deg, #4f46e5, #a78bfa)', 
                            borderRadius: '20px', display: 'flex', 
                            justifyContent: 'center', alignItems: 'center',
                            boxShadow: '0 0 25px rgba(79, 70, 229, 0.4)',
                            border: '3px solid var(--bg-main)',
                            position: 'relative'
                        }}
                    >
                        <Bot color="white" size={28} />
                        <motion.div 
                           animate={{ opacity: [1, 0, 1] }} 
                           transition={{ repeat: Infinity, duration: 4, delay: 2 }}
                           style={{ position: 'absolute', top: '15px', left: '15px', width: '25px', height: '2px', background: 'white', borderRadius: '5px', opacity: 0.8 }}
                        />
                    </motion.div>
                    <span style={{ fontSize: '0.65rem', fontWeight: '900', color: tab === 'qai' ? 'var(--primary)' : 'var(--text-muted)', marginTop: '5px' }}>TAI Hub</span>
                </div>

                <NavButton active={tab==='history'} icon={<Clock />} label="History" onClick={() => setTab('history')} />
                <NavButton active={tab==='menu'} icon={<LayoutGrid />} label="Menu" onClick={() => setTab('menu')} />
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick }) => (
    <motion.div 
        whileTap={{ scale: 0.9 }}
        onClick={onClick} 
        style={{ cursor: 'pointer', color: active ? 'var(--primary)' : 'var(--text-muted)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transition: 'all 0.2s', padding: '5px 8px' }}
    >
        {React.cloneElement(icon, { size: 24, strokeWidth: active ? 2.8 : 2 })}
        <span style={{ fontSize: '0.65rem', fontWeight: active ? '900' : '600', color: active ? 'var(--primary)' : 'var(--text-muted)' }}>{label}</span>
        {active && <motion.div layoutId="nav-dot" style={{ width: '4px', height: '4px', background: 'var(--primary)', borderRadius: '50%', marginTop: '1px' }} />}
    </motion.div>
);

export default WalletApp;
