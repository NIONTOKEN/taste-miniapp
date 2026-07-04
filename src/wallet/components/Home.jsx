import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, EyeOff, ArrowDownToLine, RefreshCcw, ArrowUpDown, 
  Search, Plus, Copy, Check, Coins, Globe, ChevronLeft, 
  X, SquareArrowUpRight, QrCode, Layers, Loader2, 
  Star as StarIcon, Zap
} from 'lucide-react';
import { WALLET_CONFIG } from '../config';

const useClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  return now;
};

const Sparkline = ({ data = [], color = '#22c55e', width = 72, height = 28 }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(' ');
  return <svg width={width} height={height} style={{ overflow: 'visible' }}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
};

const IconBtn = ({ onClick, spin, children }) => (
  <motion.div whileTap={{ scale: 0.9 }} onClick={onClick}
    style={{ width: '36px', height: '36px', background: 'var(--bg-card)', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border-bright)', cursor: 'pointer', color: 'var(--text-muted)' }}
    className={spin ? 'animate-spin' : ''}>
    {children}
  </motion.div>
);

const Home = ({ allWallets = [], switchWallet, tokens, addNewToken, walletData, setTab, setActiveToken, setReceiveNet, balances, stakedBalances, livePrices, priceChanges, isRefreshing, onRefresh, tgUser, hideBalance, setHideBalance, removeToken, onAddWallet, onAccountSwitch, initialShowSwitcher, t }) => {
  if (!walletData) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}><Loader2 className="animate-spin" color="#7c3aed" /></div>;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isManageMode, setIsManageMode] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showWalletSwitcher, setShowWalletSwitcher] = useState(initialShowSwitcher || false);
  const [activeTab, setActiveTab] = useState('assets');
  const [trendingTokens, setTrendingTokens] = useState([]);
  const [globalSearchResults, setGlobalSearchResults] = useState([]);
  const [isGlobalSearching, setIsGlobalSearching] = useState(false);
  const [marketData, setMarketData] = useState({ greed: 50, btcDom: (t ? t('home.scanning') || 'Zincir taranıyor...' : 'Zincir taranıyor...'), trend: (t ? t('home.neutral') || 'NÖTR' : 'NÖTR') });

  const now = useClock();

  // Profile'dan gelen "Cüzdanlarım" event'ini dinle
  useEffect(() => {
    const handler = () => setShowWalletSwitcher(true);
    window.addEventListener('qai_open_wallet_switcher', handler);
    return () => window.removeEventListener('qai_open_wallet_switcher', handler);
  }, []);

  useEffect(() => {
    fetch('https://api.alternative.me/fng/')
      .then(res => res.json())
      .then(d => {
         const fng = d.data[0].value;
         const val = parseInt(fng);
         const trend = val > 55 ? (t ? t('home.bull') || 'BOĞA' : 'BOĞA') : val < 45 ? (t ? t('home.bear') || 'AYI' : 'AYI') : (t ? t('home.neutral') || 'NÖTR' : 'NÖTR');
         
         // Coingecko Global
         fetch('https://api.coingecko.com/api/v3/global')
           .then(r => r.json())
           .then(gc => {
               const dom = gc.data.market_cap_percentage.btc.toFixed(1);
               let greedText = 'neutral';
               if(val > 75) greedText = 'extremeGreed';
               else if(val > 55) greedText = 'greed';
               else if(val < 25) greedText = 'extremeFear';
               else if(val < 45) greedText = 'fear';

               setMarketData({ greed: val, greedText, btcDom: `%${dom}`, trend: trend });
           }).catch(() => setMarketData({ greed: val, greedText: val > 50 ? 'greed' : 'fear', btcDom: '%50.1', trend }));
      }).catch(() => {});
  }, []);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setGlobalSearchResults([]);
      return;
    }
    setIsGlobalSearching(true);
    const timer = setTimeout(() => {
      fetch(`https://api.coingecko.com/api/v3/search?query=${searchQuery}`)
        .then(r => r.json())
        .then(d => {
            const apiResults = d?.coins?.slice(0, 15) || [];
            
            const localMatches = WALLET_CONFIG.TOKENS.filter(t => 
                 (t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  t.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
                 t.noGecko
            ).map(t => ({
                id: t.id,
                symbol: t.symbol,
                name: t.name,
                large: t.icon,
                thumb: t.icon,
                market_cap_rank: 'Ecosystem',
                networkKey: t.networkKey,
                decimals: t.decimals
            }));

            const combined = [...localMatches, ...apiResults];
            const uniqueResults = [];
            const seen = new Set();
            for (const item of combined) {
                if (!seen.has(item.id)) {
                    seen.add(item.id);
                    uniqueResults.push(item);
                }
            }

            setGlobalSearchResults(uniqueResults.slice(0, 15));
            setIsGlobalSearching(false);
        }).catch(() => {
            const localMatches = WALLET_CONFIG.TOKENS.filter(t => 
                 (t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  t.name.toLowerCase().includes(searchQuery.toLowerCase())) && t.noGecko
            ).map(t => ({ id: t.id, symbol: t.symbol, name: t.name, large: t.icon, thumb: t.icon, market_cap_rank: 'Ecosystem', networkKey: t.networkKey, decimals: t.decimals }));
            setGlobalSearchResults(localMatches);
            setIsGlobalSearching(false);
        });
    }, 600);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (activeTab !== 'trending') return;
    fetch('https://api.coingecko.com/api/v3/search/trending')
      .then(r => r.json()).then(d => setTrendingTokens(d?.coins?.slice(0, 12) || [])).catch(() => {});
  }, [activeTab]);

  const updatedTokens = tokens.map(t => ({ ...t, price: livePrices[t.id] ?? t.price ?? 0, balance: balances?.[t.id] ?? 0 }))
    .filter(t => t.symbol?.toLowerCase().includes(searchQuery.toLowerCase()) || t.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  const totalUSD = updatedTokens.reduce((s, t) => s + (t.balance * (t.price || 0)), 0);
  const currency = walletData?.settings?.currency || 'USD';
  const currencyData = WALLET_CONFIG.FIAT_CURRENCIES[currency] || WALLET_CONFIG.FIAT_CURRENCIES.USD;
  const tryData = WALLET_CONFIG.FIAT_CURRENCIES.TRY;
  const dateStr = now.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  if (selectedToken) {
    // Tüm ağlar listesi
    if (selectedToken.isNetworkList) {
      return <AllNetworksPanel walletData={walletData} onBack={() => setSelectedToken(null)} t={t} />;
    }
    return (
      <TokenDetail token={selectedToken} onBack={() => setSelectedToken(null)} setTab={setTab} setActiveToken={setActiveToken} setReceiveNet={setReceiveNet} walletData={walletData} priceChanges={priceChanges} hideBalance={hideBalance} tryData={tryData} livePrices={livePrices} t={t} />
    );

  }

  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '100px' }}>
      <div style={{ padding: '18px 18px 0' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setTab('profile')}>
            <img src={tgUser?.photo_url || '/logo.png'} style={{ width: '38px', height: '38px', borderRadius: '50%', border: '2px solid var(--primary)' }} alt="av" />
            <div>
              <div style={{ fontSize: '0.92rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {walletData?.name || tgUser?.first_name || (t ? t('home.myWallet') || 'Cüzdanım' : 'Cüzdanım')} 
              </div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: '600' }}>{dateStr} · {timeStr}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
             <motion.div 
                whileTap={{ scale: 0.9 }} 
                onClick={() => setShowWalletSwitcher(true)}
                style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(124,58,237,0.1)', padding: '5px 10px', borderRadius: '10px', border: '1px solid rgba(124,58,237,0.3)', cursor: 'pointer' }}
             >
               <Plus size={14} color="var(--primary)" />
               <span style={{ fontSize: '0.65rem', fontWeight: '900', color: 'var(--primary)' }}>{t ? t('home.addWallet') || '+ Cüzdan Ekle' : '+ Cüzdan Ekle'}</span>
            </motion.div>
            <IconBtn onClick={() => setSelectedToken({ id: 'all_networks', symbol: t ? t('home.allNetworks') || 'All Networks' : 'All Networks', name: t ? t('home.walletAddresses') || 'Wallet Addresses' : 'Wallet Addresses', networkKey: 'ALL', isNetworkList: true })}><Layers size={16} /></IconBtn>
            <IconBtn onClick={onRefresh} spin={isRefreshing}><RefreshCcw size={16} /></IconBtn>
          </div>
        </div>

        {/* Balance Card */}
        <div style={{ background: 'linear-gradient(135deg,#1a0a2e 0%,#0d0d1f 40%,#0a1628 100%)', borderRadius: '24px', padding: '22px 20px', marginBottom: '14px', border: '1px solid rgba(124,58,237,0.2)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: '120px', height: '120px', background: 'radial-gradient(circle,rgba(124,58,237,0.25) 0%,transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', fontWeight: '700', letterSpacing: '1.5px' }}>{t ? t('home.totalAssets') : 'TOTAL ASSETS'}</span>
            <div onClick={() => setHideBalance(!hideBalance)} style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.3)' }}>{hideBalance ? <EyeOff size={14} /> : <Eye size={14} />}</div>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: '900', letterSpacing: '-1.5px', color: '#fff', lineHeight: 1.1, marginBottom: '2px' }}>
            {hideBalance ? '••••••' : `${currencyData.symbol}${(totalUSD * currencyData.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginBottom: '20px' }}>
            {hideBalance ? '••••' : `≈ ${tryData.symbol}${(totalUSD * tryData.rate).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '7px' }}>
            {[
              { icon: <ArrowDownToLine size={17} />, labelKey: 'home.receive', fallback: 'Receive', action: () => { setReceiveNet('TON'); setTab('receive'); } },
              { icon: <SquareArrowUpRight size={17} />, labelKey: 'home.send', fallback: 'Send', action: () => { setActiveToken(null); setTab('send'); } },
              { icon: <ArrowUpDown size={17} />, labelKey: 'home.swap', fallback: 'Swap', action: () => { setActiveToken(null); setTab('swap'); } },
              { icon: <Coins size={17} />, labelKey: 'staking.hub', fallback: 'Stake', action: () => setTab('staking') }
            ].map(({ icon, labelKey, fallback, action }) => (
              <motion.div key={fallback} whileTap={{ scale: 0.9 }} onClick={action} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.07)', borderRadius: '13px', padding: '9px 4px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ color: '#c4b5fd' }}>{icon}</div>
                <span style={{ fontSize: '0.58rem', fontWeight: '700', color: 'rgba(255,255,255,0.55)' }}>{t ? t(labelKey) || fallback : fallback}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Piyasa Özeti Widget */}
        <div style={{ background: 'var(--bg-card)', borderRadius: '18px', padding: '12px 16px', marginBottom: '14px', border: '1px solid var(--glass-border-bright)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>{t ? t('home.marketSentiment') : 'MARKET SENTIMENT'}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '900', color: marketData.greed > 50 ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowUpDown size={12} />
                  {t ? t(`home.greed_${marketData.greedText || 'neutral'}`) || marketData.greedText : marketData.greedText} ({marketData.greed})
                </span>
            </div>
            <div style={{ width: '1px', background: 'var(--glass-border)', height: '24px' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>{t ? t('home.btcDom') : 'BTC DOM (BTCD)'}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '900', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>{marketData.btcDom}</span>
            </div>
            <div style={{ width: '1px', background: 'var(--glass-border)', height: '24px' }}></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-end' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>{t ? t('home.trend') : 'TREND'}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '900', color: marketData.greed > 55 ? '#10b981' : marketData.greed < 45 ? '#ef4444' : '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {marketData.greed > 55 ? (t ? t('home.bull') : 'BULL') : marketData.greed < 45 ? (t ? t('home.bear') : 'BEAR') : (t ? t('home.neutral') : 'NEUTRAL')}
                  <div style={{width: 6, height: 6, borderRadius: '50%', background: marketData.greed > 55 ? '#10b981' : marketData.greed < 45 ? '#ef4444' : '#f59e0b', boxShadow: `0 0 5px ${marketData.greed > 55 ? '#10b981' : '#ef4444'}`}}></div>
                </span>
            </div>
        </div>



        <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-card)', borderRadius: '13px', padding: '3px', marginBottom: '12px', border: '1px solid var(--glass-border)' }}>
          {[{ id: 'assets', label: t ? t('home.assets') || 'Assets' : 'Assets' }, { id: 'trending', label: t ? t('home.trendingTab') || '🔥 Trend' : '🔥 Trend' }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: '7px', borderRadius: '10px', border: 'none', background: activeTab === tab.id ? 'var(--primary)' : 'transparent', color: activeTab === tab.id ? '#fff' : 'var(--text-muted)', fontWeight: '700', fontSize: '0.76rem', cursor: 'pointer', transition: 'all 0.2s' }}>{tab.label}</button>
          ))}
        </div>

        {activeTab === 'assets' && (
          <div style={{ display: 'flex', gap: '7px', marginBottom: '12px' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '7px', background: 'var(--bg-card)', borderRadius: '12px', padding: '8px 12px', border: '1px solid var(--glass-border-bright)' }}>
                <Search size={14} color="var(--text-muted)" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t ? t('home.searchPlaceholder') || 'Search Asset or Contract...' : 'Search Asset or Contract...'} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.82rem', outline: 'none', width: '100%' }} />
              </div>
              <motion.div whileTap={{ scale: 0.9 }} onClick={() => setShowAddModal(true)} style={{ width: '38px', height: '38px', background: 'rgba(124,58,237,0.15)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(124,58,237,0.3)', cursor: 'pointer', flexShrink: 0 }}>
                <Plus size={17} color="var(--primary)" />
              </motion.div>
            </div>
        )}
      </div>

      {/* Token List */}
      <div style={{ padding: '0 18px' }}>
        {searchQuery.length >= 2 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '20px' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '900', letterSpacing: '1px' }}>GLOBAL SEARCH</p>
                {isGlobalSearching && <div style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'}}><Loader2 className="animate-spin" color="var(--primary)" /> Scanning networks...</div>}
                
                {!isGlobalSearching && globalSearchResults.length === 0 && (
                    <div style={{textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.8rem'}}>No results found.</div>
                )}

                {!isGlobalSearching && globalSearchResults.map(c => {
                    const isAdded = tokens.some(t => t.id === c.id);
                    return (
                        <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-card)', borderRadius: '18px', border: '1px solid var(--glass-border-bright)'}}>
                           <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
                              <img src={c.large || c.thumb} style={{width: '38px', height: '38px', borderRadius: '50%'}} onError={(e) => { e.target.src = "https://assets.coingecko.com/coins/images/279/standard/ethereum.png"; }} />
                              <div>
                                 <div style={{fontWeight: '900', fontSize: '0.9rem'}}>{c.symbol.toUpperCase()}</div>
                                 <div style={{fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold'}}>{c.name} {c.market_cap_rank ? `• Sıra: #${c.market_cap_rank}` : ''}</div>
                              </div>
                           </div>
                           {isAdded ? (
                              <span style={{fontSize: '0.7rem', color: '#22c55e', fontWeight: '900', padding: '6px 10px', background: 'rgba(34,197,94,0.1)', borderRadius: '10px', border: '1px solid rgba(34,197,94,0.2)'}}>ADDED</span>
                           ) : (
                               <motion.button 
                                  whileTap={{ scale: 0.9 }} 
                                  onClick={async (e) => {
                                      e.stopPropagation();
                                      const btn = e.currentTarget;
                                      const originalText = btn.innerText;
                                      btn.innerText = '...';
                                      btn.disabled = true;

                                      try {
                                          const res = await fetch(`https://api.coingecko.com/api/v3/coins/${c.id}`);
                                          const data = await res.json();
                                          
                                          const platforms = data.platforms || {};
                                          const networks = { 
                                              'ethereum': 'ETH', 
                                              'binance-smart-chain': 'BNB', 
                                              'arbitrum-one': 'ARB', 
                                              'base': 'BASE', 
                                              'polygon-pos': 'MATIC',
                                              'the-open-network': 'TON'
                                          };

                                          let foundNet = 'ETH';
                                          let contract = 'native';
                                          
                                          for (const [key, val] of Object.entries(networks)) {
                                              if (platforms[key]) {
                                                  foundNet = val;
                                                  contract = platforms[key];
                                                  break;
                                              }
                                          }

                                          if (addNewToken) {
                                              addNewToken({
                                                  id: c.id,
                                                  symbol: (data.symbol || c.symbol).toUpperCase(),
                                                  name: data.name || c.name,
                                                  networkKey: foundNet,
                                                  decimals: data.detail_platforms?.[Object.keys(platforms)[0]]?.decimal_place || 18,
                                                  contract: contract,
                                                  isNative: contract === 'native',
                                                  icon: data.image?.large || c.large || c.thumb || ''
                                              });
                                          }
                                      } catch (err) {
                                          console.error("Token fetch error:", err);
                                          alert("Could not fetch details. Add manually.");
                                      } finally {
                                          btn.innerText = originalText;
                                          btn.disabled = false;
                                          setSearchQuery('');
                                          setGlobalSearchResults([]);
                                      }
                                  }} 
                                  style={{padding: '8px 16px', borderRadius: '12px', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: '900', fontSize: '0.75rem', cursor: 'pointer'}}
                               >
                                   ADD
                               </motion.button>
                           )}
                        </div>
                    );
                })}
            </div>
        ) : activeTab === 'assets' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
                <motion.div 
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsManageMode(!isManageMode)}
                    style={{ fontSize: '0.65rem', fontWeight: '900', color: isManageMode ? 'var(--primary)' : 'var(--text-muted)', padding: '6px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid var(--glass-border)', cursor: 'pointer' }}
                >
                    {isManageMode ? (t ? t('home.saveBtn') : 'SAVE') : (t ? t('home.manageAssets') : 'MANAGE ASSETS')}
                </motion.div>
            </div>
            {updatedTokens.map(token => {
              const change = priceChanges[token.id];
              const isUp = !change || change >= 0;
              return (
                <div key={token.id} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <motion.div whileTap={{ scale: 0.98 }} onClick={() => setSelectedToken(token)}
                  style={{ flex: 1, display: "flex", alignItems: "center", gap: "11px", padding: "11px 13px", background: "var(--bg-card)", borderRadius: "15px", border: "1px solid var(--glass-border-bright)", cursor: "pointer" }}>
                  <div style={{ position: "relative", flexShrink: 0 }}>
                    <img src={token.icon} style={{ width: "38px", height: "38px", borderRadius: "50%" }} alt={token.symbol} onError={e => { e.target.src = "https://assets.coingecko.com/coins/images/279/standard/ethereum.png"; }} />
                    <div style={{ position: "absolute", bottom: -2, right: -2, background: "var(--bg-main)", borderRadius: "4px", padding: "1px 3px", fontSize: "0.42rem", fontWeight: "900", color: "var(--text-muted)", border: "1px solid var(--glass-border)", lineHeight: 1.2 }}>{token.networkKey?.slice(0, 4)}</div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: "900", fontSize: "0.88rem" }}>{token.symbol}</span>
                      <span style={{ fontWeight: "900", fontSize: "0.86rem" }}>{hideBalance ? "••••" : Number((token.balance || 0).toFixed(4))}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ fontSize: "0.72rem", color: "var(--primary)", fontWeight: "900" }}>{token.price > 0 ? `${currencyData.symbol}${(token.price * currencyData.rate).toLocaleString(undefined, { maximumFractionDigits: (token.price * currencyData.rate) < 1 ? 6 : 2 })}` : "—"}</span>
                        {change !== undefined && <span style={{ fontSize: "0.63rem", fontWeight: "700", color: isUp ? "#22c55e" : "#ef4444" }}>{isUp ? "▲" : "▼"}{Math.abs(change).toFixed(1)}%</span>}
                      </div>
                      <span style={{ fontSize: "0.7rem", color: "#fff", fontWeight: "700" }}>{hideBalance ? "••••" : `${currencyData.symbol}${(token.balance * token.price * currencyData.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
                    </div>
                  </div>
                </motion.div>
                {isManageMode && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileTap={{ scale: 0.9 }} 
                        onClick={e => { e.stopPropagation(); removeToken(token.id); }}
                        style={{ width: "32px", height: "32px", background: "rgba(239,68,68,0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: "1px solid rgba(239,68,68,0.2)", flexShrink: 0 }}
                    >
                        <X size={13} color="#ef4444" />
                    </motion.div>
                )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {trendingTokens.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} style={{ width: '28px', height: '28px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 10px' }} />
                {t ? t('home.loading') || 'Yükleniyor...' : 'Yükleniyor...'}
              </div>
            ) : trendingTokens.map((c, i) => {
              const item = c.item;
              const change = item.data?.price_change_percentage_24h?.usd || 0;
              const isUp = change >= 0;
              return (
                <motion.div key={item.id} whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedToken({ id: item.id, symbol: item.symbol?.toUpperCase(), name: item.name, icon: item.large || item.thumb, price: parseFloat(item.data?.price) || 0, balance: 0, networkKey: 'ETH', contract: '', isNative: false })}
                  style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '11px 13px', background: 'var(--bg-card)', borderRadius: '15px', border: '1px solid var(--glass-border-bright)', cursor: 'pointer' }}>
                  <div style={{ width: '24px', textAlign: 'center', fontSize: '0.72rem', fontWeight: '900', color: i < 3 ? '#f59e0b' : 'var(--text-muted)', flexShrink: 0 }}>#{i + 1}</div>
                  <img src={item.thumb} style={{ width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0 }} alt={item.symbol} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '900', fontSize: '0.86rem' }}>{item.symbol?.toUpperCase()}</span>
                      <span style={{ fontWeight: '700', fontSize: '0.8rem' }}>{item.data?.price ? `$${parseFloat(item.data.price).toLocaleString(undefined, { maximumFractionDigits: 6 })}` : '—'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
                      <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
                      <span style={{ fontSize: '0.66rem', fontWeight: '700', color: isUp ? '#22c55e' : '#ef4444' }}>{isUp ? '▲' : '▼'}{Math.abs(change).toFixed(1)}%</span>
                    </div>
                  </div>
                  {/* HIZLI EKLE BUTONU */}
                  <motion.div 
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                       e.stopPropagation();
                       addNewToken({
                         id: item.id,
                         symbol: (item.symbol || '???').toUpperCase(),
                         name: item.name,
                         icon: item.large || item.thumb,
                         balance: 0,
                         price: parseFloat(item.data?.price) || 0,
                         networkKey: 'ETH',
                         contract: '0x0000000000000000000000000000000000000000',
                         isNative: false
                       });
                       alert(`${item.name} added to wallet!`);
                    }}
                    style={{ width: '32px', height: '32px', background: 'rgba(124,58,237,0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(124,58,237,0.3)', cursor: 'pointer', flexShrink: 0 }}
                  >
                    <Plus size={15} color="var(--primary)" />
                  </motion.div>
                </motion.div>

              );
            })}
          </div>
        )}
      </div>
       <AnimatePresence>
         {showAddModal && <AddTokenModal onClose={() => setShowAddModal(false)} addNewToken={addNewToken} t={t} />}
         {showWalletSwitcher && <WalletSwitcherModal wallets={allWallets} activeWallet={walletData} onSwitch={switchWallet} onClose={() => setShowWalletSwitcher(false)} onAddWallet={onAddWallet} onAccountSwitch={onAccountSwitch} walletData={walletData} t={t} />}
       </AnimatePresence>
    </div>
  );
};

// ── WALLET SWITCHER MODAL ─────────────────────────────────────────────────────
const WalletSwitcherModal = ({ wallets, activeWallet, onSwitch, onClose, onAddWallet, onAccountSwitch, walletData, t }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 3000, display: 'flex', alignItems: 'flex-end' }} onClick={onClose}>
    <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} style={{ width: '100%', background: 'var(--bg-main)', borderRadius: '28px 28px 0 0', padding: '24px 20px 36px', border: '1px solid var(--glass-border-bright)' }} onClick={e => e.stopPropagation()}>
      <div style={{ width: '36px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', margin: '0 auto 20px' }} />
      <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', fontWeight: '900' }}>{t ? t('home.myWallets') || 'Cüzdanlarım' : 'Cüzdanlarım'}</h3>

      {/* Multi-Account Index management can be added here dynamically if needed, 
          but removing fixed buttons per user request. */}

      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {wallets.map((w, i) => {
          const isActive = w.addresses.TON === activeWallet.addresses.TON;
          return (
            <motion.div 
              key={i} 
              whileTap={{ scale: 0.98 }}
              onClick={() => { onSwitch(w.addresses.TON); onClose(); }}
              style={{ padding: '15px', background: isActive ? 'rgba(99,102,241,0.15)' : 'var(--bg-card)', borderRadius: '18px', border: isActive ? '1px solid #6366f1' : '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            >
              <div style={{ width: '40px', height: '40px', background: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                W{i+1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{w.name || `${t ? t('home.accountIdx') || 'Hesap' : 'Hesap'} #${i+1}`}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{w.addresses.TON.slice(0, 10)}...{w.addresses.TON.slice(-10)}</div>
              </div>
              {isActive && <Check size={20} color="#6366f1" />}
            </motion.div>
          );
        })}
        
        <button 
           onClick={onAddWallet}
           style={{ marginTop: '10px', width: '100%', padding: '16px', background: 'transparent', color: 'var(--primary)', border: '1px dashed var(--primary)', borderRadius: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
        >
           <Plus size={18} /> {t ? t('home.addWalletBtn') || 'Add New Wallet' : 'Add New Wallet'}
        </button>
      </div>
    </motion.div>
  </motion.div>
);


  // Home component tablodaki Modal render kismina eklenecek


// ── TOKEN DETAIL with CHART ─────────────────────────────────────────────────
const TokenDetail = ({ token, onBack, setTab, setActiveToken, setReceiveNet, walletData, priceChanges, hideBalance, tryData, livePrices, t }) => {
  const [copied, setCopied] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [chartPeriod, setChartPeriod] = useState('7');
  const [chartLoading, setChartLoading] = useState(false);
  const getAddress = () => {
    if (!token || !walletData || !walletData.addresses) return 'N/A';
    const key = token.networkKey || 'ETH';
    if (key === 'SOL') return walletData.addresses.SOL || 'N/A';
    if (key === 'TON') return walletData.addresses.TON || 'N/A';
    return walletData.addresses[key] || 'N/A';
  };
  const address = getAddress();
  
  const change = priceChanges?.[token.id];
  const isUp = !change || change >= 0;
  const isNative = !token.contract || token.contract === 'native' || token.contract === '0x0000000000000000000000000000000000000000' || token.contract === '11111111111111111111111111111111';
  const baseUrls = { ETH: 'https://etherscan.io/address/', BNB: 'https://bscscan.com/address/', opBNB: 'https://opbnbscan.com/address/', ARB: 'https://arbiscan.io/address/', BASE: 'https://basescan.org/address/', MATIC: 'https://polygonscan.com/address/', MONAD: 'https://testnet.monadvision.com/address/', TON: 'https://tonscan.org/address/' };
  const tokenUrls = { ETH: 'https://etherscan.io/token/', BNB: 'https://bscscan.com/token/', opBNB: 'https://opbnbscan.com/token/', ARB: 'https://arbiscan.io/token/', BASE: 'https://basescan.org/token/', MATIC: 'https://polygonscan.com/token/', MONAD: 'https://testnet.monadvision.com/token/', TON: 'https://tonscan.org/jetton/' };
  const explorerUrl = isNative 
    ? `${baseUrls[token.networkKey] || baseUrls.ETH}${address}`
    : `${tokenUrls[token.networkKey] || tokenUrls.ETH}${token.contract}${token.networkKey==='TON'?'':`?a=${address}`}`;

  useEffect(() => {
    let activeId = token.id;
    // Eğer elle eklenmiş token ise (id_timestamp) asıl sembolü bulmaya çalış
    if (activeId.includes('_')) {
       const [sym] = activeId.split('_');
       const map = { 'usdt': 'tether', 'usdc': 'usd-coin', 'weth': 'weth', 'wbtc': 'wrapped-bitcoin', 'link': 'chainlink' };
       activeId = map[sym.toLowerCase()] || activeId;
    }

    if (!activeId || token.noGecko || activeId.includes('monad') || activeId.includes('staked')) {
      setChartData([]);
      return;
    }

    const cacheKey = `chart_${activeId}_${chartPeriod}`;
    const lastFetch = window._chartCache?.[cacheKey];
    if (lastFetch && Date.now() - lastFetch < 60000) return; // 1 dk bekle

    let isCancelled = false;
    setChartLoading(true);

    fetch(`https://api.coingecko.com/api/v3/coins/${activeId}/market_chart?vs_currency=usd&days=${chartPeriod}`)
      .then(r => {
        if (!r.ok) throw new Error('Rate limit or CORS');
        return r.json();
      })
      .then(d => { 
        if (!isCancelled && d.prices) {
          setChartData(d.prices.map(p => p[1])); 
          if (!window._chartCache) window._chartCache = {};
          window._chartCache[cacheKey] = Date.now();
        }
      })
      .catch(() => {
        if (!isCancelled) setChartData([]); 
      })
      .finally(() => {
        if (!isCancelled) setChartLoading(false);
      });

    return () => { isCancelled = true; };
  }, [token.id, chartPeriod]);

  const copy = () => { navigator.clipboard.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const chartMin = chartData.length > 0 ? Math.min(...chartData) : 0;
  const chartMax = chartData.length > 0 ? Math.max(...chartData) : 1;
  const chartRange = chartMax - chartMin || 1;
  const chartWidth = 320, chartHeight = 100;

  const chartPts = chartData.length > 1 
    ? chartData.map((v, i) => `${(i / (chartData.length - 1)) * chartWidth},${chartHeight - ((v - chartMin) / chartRange) * chartHeight}`).join(' ')
    : "0,0";

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} style={{ minHeight: '100vh', background: 'var(--bg-main)', paddingBottom: '100px' }}>
      <div style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ChevronLeft size={26} onClick={onBack} style={{ cursor: 'pointer' }} />
        <img src={token.icon} style={{ width: '30px', height: '30px', borderRadius: '50%' }} alt={token.symbol} />
        <span style={{ fontWeight: '900', fontSize: '1.05rem' }}>{token.symbol}</span>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '2px 7px', borderRadius: '7px' }}>{token.networkKey}</span>
      </div>

      {/* Price */}
      <div style={{ margin: '0 18px 16px', background: 'var(--bg-card)', borderRadius: '22px', padding: '20px', border: '1px solid var(--glass-border-bright)', textAlign: 'center' }}>
        <div style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '4px' }}>
          {hideBalance ? '••••' : `${(token.balance || 0).toFixed(6)}`} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{token.symbol}</span>
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
          {hideBalance ? '••••' : `≈ $${((token.balance || 0) * (token.price || 0)).toFixed(2)}`}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', fontSize: '0.78rem', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-muted)' }}>{t ? t('home.price') || 'Price' : 'Price'}: <strong style={{ color: '#fff' }}>${(token.price || 0).toLocaleString(undefined, { maximumFractionDigits: 8 })}</strong></span>
          {change !== undefined && <span style={{ color: isUp ? '#22c55e' : '#ef4444', fontWeight: '700' }}>{isUp ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%</span>}
          <StarIcon size={16} color="#fbbf24" fill="rgba(251,191,36,0.5)" style={{ cursor: 'pointer', marginLeft: '2px', opacity: 0.8 }} />
        </div>
      </div>

      {/* Chart */}
      <div style={{ margin: '0 18px 16px', background: 'var(--bg-card)', borderRadius: '22px', padding: '16px', border: '1px solid var(--glass-border-bright)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: '700', color: 'var(--text-muted)' }}>{t ? t('home.priceChart') || 'PRICE CHART' : 'PRICE CHART'}</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[{ p: '1', label: '1G' }, { p: '7', label: '7G' }, { p: '30', label: '30G' }, { p: '90', label: '90G' }].map(({ p, label }) => (
              <button key={p} onClick={() => setChartPeriod(p)} style={{ padding: '3px 8px', borderRadius: '7px', border: 'none', fontSize: '0.65rem', fontWeight: '700', cursor: 'pointer', background: chartPeriod === p ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: chartPeriod === p ? '#fff' : 'var(--text-muted)' }}>{label}</button>
            ))}
          </div>
        </div>
        {chartLoading ? (
          <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ width: '24px', height: '24px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }} />
          </div>
        ) : chartData.length > 1 ? (
          <div style={{ overflowX: 'auto' }}>
            <svg width="100%" height="100" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none" style={{ display: 'block' }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isUp ? '#22c55e' : '#ef4444'} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={isUp ? '#22c55e' : '#ef4444'} stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline points={chartPts} fill="none" stroke={isUp ? '#22c55e' : '#ef4444'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <polygon points={`0,${chartHeight} ${chartPts} ${chartWidth},${chartHeight}`} fill="url(#chartGrad)" />
            </svg>
          </div>
        ) : (
          <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>{t ? t('home.noChartData') || 'No chart data' : 'No chart data'}</div>
        )}
      </div>

      {/* Aksiyon Butonları */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', margin: '0 18px 16px' }}>
        {[
          { icon: <SquareArrowUpRight size={20} />, label: t ? t('home.sendAction') || 'GÖNDER' : 'GÖNDER', color: 'var(--primary)', action: () => { setActiveToken(token); setTab('send'); } },
          { icon: <ArrowDownToLine size={20} />, label: t ? t('home.receiveAction') || 'AL' : 'AL', color: 'rgba(255,255,255,0.05)', action: () => { setReceiveNet(token.networkKey); setTab('receive'); } },
          { icon: <ArrowUpDown size={20} />, label: 'Swap', color: 'rgba(255,255,255,0.05)', action: () => { setActiveToken(token); setTab('swap'); } }
        ].map(({ icon, label, color, action }) => (
          <motion.div key={label} whileTap={{ scale: 0.95 }} onClick={action} style={{ background: color, borderRadius: '16px', padding: '14px', textAlign: 'center', cursor: 'pointer', border: '1px solid var(--glass-border)' }}>
            <div style={{ marginBottom: '5px', display: 'flex', justifyContent: 'center' }}>{icon}</div>
            <div style={{ fontSize: '0.72rem', fontWeight: '700' }}>{label}</div>
          </motion.div>
        ))}
      </div>

      {/* Wallet Address */}
      <div style={{ margin: '0 18px 10px', background: 'var(--bg-card)', borderRadius: '18px', padding: '16px', border: '1px solid var(--glass-border-bright)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700' }}>{t ? t('home.yourAddress') || 'YOUR WALLET ADDRESS' : 'YOUR WALLET ADDRESS'} ({token.networkKey})</span>
          <div onClick={copy} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: copied ? '#22c55e' : 'var(--primary)', cursor: 'pointer', fontSize: '0.68rem', fontWeight: '700' }}>
            {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? (t ? t('home.copiedBtn') : 'Kopyalandı') : (t ? t('home.copyBtn') : 'Kopyala')}
          </div>
        </div>
        <div style={{ fontSize: '0.67rem', wordBreak: 'break-all', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{address}</div>
      </div>

      {/* Contract Address (Only for Tokens) */}
      {!isNative && (
        <div style={{ margin: '0 18px 14px', background: 'rgba(124,58,237,0.05)', borderRadius: '18px', padding: '16px', border: '1px solid rgba(124,58,237,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: '900' }}>{t ? t('home.tokenContractTitle') || 'TOKEN CONTRACT ADDRESS' : 'TOKEN CONTRACT ADDRESS'}</span>
            <div onClick={() => { navigator.clipboard.writeText(token.contract); alert('Kontrat adresi kopyalandı!'); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.68rem', fontWeight: '700' }}>
              <Copy size={12} /> {t ? t('home.copyBtn') || 'Copy' : 'Copy'}
            </div>
          </div>
          <div style={{ fontSize: '0.67rem', wordBreak: 'break-all', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{token.contract}</div>
        </div>
      )}

      <TokenTxHistory token={token} walletData={walletData} t={t} />

      <div style={{ margin: '0 18px' }}>
        <a href={explorerUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '13px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.78rem', fontWeight: '700' }}>
          <Globe size={15} /> {t ? t('home.viewExplorer') || 'View on Explorer' : 'View on Explorer'}
        </a>
      </div>
    </motion.div>
  );
};

// ── TOKEN TX HISTORY ───────────────────────────────────────────────────────────
const TokenTxHistory = ({ token, walletData, t }) => {
  const [txList, setTxList] = useState([]);
  const [loading, setLoading] = useState(true);
  const address = walletData?.addresses?.[token.networkKey];

  useEffect(() => {
    if (!address || address === 'N/A' || !token) { setLoading(false); return; }
    setLoading(true);
    setTxList([]);

    const load = async () => {
      try {
        const { getEVMHistory, getTonHistory } = await import('../historyService');
        let history = [];
        try {
          if (token.networkKey === 'TON') {
            history = await getTonHistory(walletData.addresses) || [];
          } else {
            history = await getEVMHistory(address, token.networkKey) || [];
          }
        } catch (inner) {
          console.error("Inner history fetch error:", inner);
          history = [];
        }

        const fmt = (ts) => new Date(ts).toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
        
        // Filter and format for this specific token
        const filtered = history
          .filter(tx => 
            tx.symbol?.toLowerCase() === token.symbol?.toLowerCase() || 
            tx.to?.toLowerCase() === token.contract?.toLowerCase()
          )
          .slice(0, 15)
          .map(tx => ({
            hash: tx.hash?.slice(0, 14) + '...',
            amount: `${tx.value} ${tx.symbol}`,
            time: fmt(tx.timestamp),
            isIn: tx.type === 'received',
            explorerUrl: token.networkKey === 'TON' 
              ? `https://tonscan.org/tx/${tx.hash}` 
              : token.networkKey === 'MONAD' 
                ? `https://monad.blockscout.com/tx/${tx.hash}`
                : `https://${token.networkKey === 'BNB' ? 'bscscan.com' : token.networkKey === 'ETH' ? 'etherscan.io' : token.networkKey === 'BASE' ? 'basescan.org' : 'blockscout.com'}/tx/${tx.hash}`
          }));

        setTxList(filtered);
      } catch (e) {
        console.error('History load error:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [token.id, address]);

  return (
    <div style={{ margin: '0 18px 16px' }}>
      <div style={{ fontSize: '0.65rem', fontWeight: '900', color: 'var(--text-muted)', marginBottom: '10px', letterSpacing: '1px' }}>{t ? t('home.txHistoryTitle') || 'TRANSACTION HISTORY' : 'TRANSACTION HISTORY'}</div>
      <div style={{ background: 'var(--bg-card)', borderRadius: '22px', border: '1px solid var(--glass-border-bright)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} style={{ width: '18px', height: '18px', border: '2px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%' }} />
            {t ? t('home.scanning') || 'Scanning chain...' : 'Scanning chain...'}
          </div>
        ) : txList.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}>{t ? t('home.noTxFound') || 'No transactions found' : 'No transactions found'}</div>
        ) : txList.map((tx, i) => (
          <a key={i} href={tx.explorerUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '13px 16px', borderBottom: i < txList.length - 1 ? '1px solid var(--glass-border)' : 'none', textDecoration: 'none' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: tx.isIn ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
              {tx.isIn
                ? <ArrowDownToLine size={16} color="#22c55e" />
                : <SquareArrowUpRight size={16} color="#ef4444" />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '700', fontSize: '0.82rem', color: tx.isIn ? '#22c55e' : '#ef4444' }}>{tx.isIn ? (t ? t('home.received') || 'Received' : 'Received') : (t ? t('home.sent') || 'Sent' : 'Sent')}</div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '2px' }}>{tx.time}</div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ fontWeight: '900', fontSize: '0.8rem', color: '#fff' }}>{tx.amount}</div>
              <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: '2px' }}>{tx.hash}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

// ── ADD TOKEN MODAL ─────────────────────────────────────────────────────────
const AddTokenModal = ({ onClose, addNewToken }) => {
  const [contract, setContract] = useState('');
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [network, setNetwork] = useState('BNB');
  const [decimals, setDecimals] = useState('18');
  const [loading, setLoading] = useState(false);
  const [autoFetching, setAutoFetching] = useState(false);

  useEffect(() => {
    if (contract.length < 10) return;
    const timer = setTimeout(async () => {
      setAutoFetching(true);
      try {
        const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${contract}`);
        const data = await res.json();
        if (data.pairs && data.pairs.length > 0) {
          const pair = data.pairs[0];
          const tk = pair.baseToken;
          if (tk.address.toLowerCase() === contract.toLowerCase()) {
            setSymbol(tk.symbol || '');
            setName(tk.name || '');
            const chainMap = { ethereum: 'ETH', bsc: 'BNB', arbitrum: 'ARB', base: 'BASE', polygon: 'MATIC', ton: 'TON' };
            setNetwork(chainMap[pair.chainId] || network);
          }
        }
      } catch (_) {}
      setAutoFetching(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [contract]);

  const handleAdd = () => {
    if (!contract || !symbol) return;
    setLoading(true);
    setTimeout(() => {
      addNewToken({ id: symbol.toLowerCase() + '_' + Date.now(), symbol: symbol.toUpperCase(), name: name || symbol, network, networkKey: network, icon: `https://assets.coingecko.com/coins/images/279/standard/ethereum.png`, balance: 0, price: 0, contract, isNative: false, decimals: parseInt(decimals) || 18 });
      onClose();
    }, 400);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'flex-end' }} onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} style={{ width: '100%', background: 'var(--bg-main)', borderRadius: '28px 28px 0 0', padding: '24px 20px 36px', border: '1px solid var(--glass-border-bright)' }} onClick={e => e.stopPropagation()}>
        <div style={{ width: '36px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', margin: '0 auto 20px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.1rem' }}>Add Token</h3>
          <X size={20} onClick={onClose} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '5px' }}>CONTRACT ADDRESS {autoFetching && <span style={{ color: 'var(--primary)' }}>• Searching...</span>}</label>
            <input value={contract} onChange={e => setContract(e.target.value.trim())} placeholder="0x... or TON address" style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border-bright)', borderRadius: '13px', padding: '12px 14px', color: '#fff', fontSize: '0.83rem', outline: 'none' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '5px' }}>SYMBOL</label>
              <input value={symbol} onChange={e => setSymbol(e.target.value)} placeholder="USDT" style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border-bright)', borderRadius: '13px', padding: '12px 14px', color: '#fff', fontSize: '0.83rem', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '5px' }}>DECIMAL</label>
              <input value={decimals} onChange={e => setDecimals(e.target.value)} placeholder="18" style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border-bright)', borderRadius: '13px', padding: '12px 14px', color: '#fff', fontSize: '0.83rem', outline: 'none' }} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '7px' }}>AĞ</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {['ETH', 'BNB', 'TON', 'ARB', 'BASE', 'MATIC', 'opBNB'].map(n => (
                <button key={n} onClick={() => setNetwork(n)} style={{ padding: '6px 12px', borderRadius: '9px', border: 'none', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', background: network === n ? 'var(--primary)' : 'var(--bg-card)', color: network === n ? '#fff' : 'var(--text-muted)' }}>{n}</button>
              ))}
            </div>
          </div>
          <button onClick={handleAdd} disabled={!contract || !symbol || loading} style={{ marginTop: '6px', width: '100%', padding: '15px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '900', fontSize: '0.95rem', cursor: 'pointer', opacity: (!contract || !symbol) ? 0.5 : 1 }}>
            {loading ? 'Adding...' : 'ADD TOKEN'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── ALL NETWORKS PANEL ──────────────────────────────────────────────────────
const AllNetworksPanel = ({ walletData, onBack, t }) => {
  const [copied, setCopied] = useState('');
  const addrs = walletData?.addresses || {};

  // EVM adresi — birden fazla key'den bul
  const evmAddr = addrs.ETH || addrs.BNB || addrs.ARB || 'N/A';

  const networks = [
    { key: 'ETH',    label: 'Ethereum / EVM',   color: '#627EEA', icon: 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png',  addr: evmAddr },
    { key: 'BNB',    label: 'BNB Chain',         color: '#F3BA2F', icon: 'https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png',   addr: addrs.BNB || evmAddr },
    { key: 'opBNB',  label: 'opBNB',             color: '#F3BA2F', icon: 'https://assets.coingecko.com/coins/images/825/standard/bnb-icon2_2x.png',   addr: addrs.opBNB || evmAddr },
    { key: 'ARB',    label: 'Arbitrum',           color: '#28A0F0', icon: 'https://assets.coingecko.com/coins/images/29587/small/arbitrum.png',                               addr: addrs.ARB || evmAddr },
    { key: 'BASE',   label: 'Base',               color: '#0052FF', icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',                                 addr: addrs.BASE || evmAddr },
    { key: 'MATIC',  label: 'Polygon',            color: '#8247E5', icon: 'https://assets.coingecko.com/coins/images/4713/standard/polygon.png',   addr: addrs.MATIC || evmAddr },
    { key: 'MONAD',  label: 'Monad',              color: '#836EF9', icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',                   addr: addrs.MONAD || evmAddr },
    { key: 'TON',    label: 'TON (Standard)',     color: '#0098EA', icon: 'https://assets.coingecko.com/coins/images/17980/standard/ton_symbol.png',       addr: addrs.TON || 'N/A' },
  ];

  const copy = (key, addr) => {
    if (!addr || addr === 'N/A') return;
    navigator.clipboard.writeText(addr);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} style={{ minHeight: '100vh', background: 'var(--bg-main)', paddingBottom: '100px' }}>
      <div style={{ padding: '18px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <ChevronLeft size={26} onClick={onBack} style={{ cursor: 'pointer' }} />
        <div>
          <h2 style={{ margin: 0, fontWeight: '900', fontSize: '1.1rem' }}>{t ? t('home.walletAddresses') : 'Tüm Ağ Adresleri'}</h2>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{t ? t('home.addressHint') : 'Cüzdanınızdaki tüm ağ adresleri'}</div>
        </div>
      </div>

      <div style={{ padding: '0 18px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {networks.map(net => {
          const isNA = !net.addr || net.addr === 'N/A';
          return (
            <div key={net.key} style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '14px 16px', border: `1px solid ${isNA ? 'var(--glass-border)' : 'rgba(255,255,255,0.1)'}`, opacity: isNA ? 0.5 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: isNA ? 0 : '8px' }}>
                <div style={{ width: '28px', height: '28px', background: net.color + '22', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <img src={net.icon} style={{ width: '18px', height: '18px', borderRadius: '50%' }} alt={net.label} />
                </div>
                <span style={{ fontWeight: '900', fontSize: '0.82rem', flex: 1 }}>{net.label}</span>
                {!isNA && (
                  <div onClick={() => copy(net.key, net.addr)}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', color: copied === net.key ? '#22c55e' : 'var(--primary)', cursor: 'pointer', fontSize: '0.65rem', fontWeight: '700' }}>
                    {copied === net.key ? <Check size={12} /> : <Copy size={12} />}
                    {copied === net.key ? (t ? t('home.copiedBtn') : 'Kopyalandı') : (t ? t('home.copyBtn') : 'Kopyala')}
                  </div>
                )}
              </div>
              {!isNA && (
                <div style={{ fontSize: '0.62rem', wordBreak: 'break-all', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, fontFamily: 'monospace' }}>
                  {net.addr}
                </div>
              )}
              {isNA && <div style={{ fontSize: '0.62rem', color: '#ef4444' }}>Adres türetilemedi — cüzdanı yeniden aç</div>}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Home;
