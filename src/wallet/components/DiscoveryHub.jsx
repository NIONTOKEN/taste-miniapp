import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Search, Flame, Rocket, RefreshCcw, ExternalLink, Copy, Check, X, Plus, ArrowUpDown, ShieldCheck, AlertTriangle, Zap } from 'lucide-react';
import { WALLET_CONFIG } from '../config';


// ─── API HELPERS ─────────────────────────────────────────────────────────────
const ft = async (url, ms = 8000) => {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { const r = await fetch(url, { signal: ctrl.signal }); clearTimeout(t); return r; }
  catch (e) { clearTimeout(t); throw e; }
};

const fetchDexNew = async () => {
  try {
    const r = await ft('https://api.dexscreener.com/token-profiles/latest/v1');
    const d = await r.json();
    return (Array.isArray(d) ? d : []).slice(0, 50).map(t => ({
      id: t.tokenAddress, name: t.description?.slice(0, 20) || t.tokenAddress?.slice(0, 8),
      symbol: t.symbol || '???', chain: t.chainId?.toUpperCase() || 'UNK',
      price: 0, change: 0, liquidity: 0, volume: 0,
      icon: t.icon || 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
      contract: t.tokenAddress, links: t.links || [], isNew: true, source: 'DexScreener'
    }));
  } catch { return []; }
};

const fetchDexTrending = async () => {
  try {
    const r = await ft('https://api.dexscreener.com/token-boosts/top/v1');
    const d = await r.json();
    return (Array.isArray(d) ? d : []).slice(0, 40).map(t => ({
      id: t.tokenAddress, name: t.tokenAddress?.slice(0, 8), symbol: t.symbol || '???',
      chain: t.chainId?.toUpperCase() || 'ETH', price: 0,
      change: 0, liquidity: 0, volume: 0, icon: t.icon,
      contract: t.tokenAddress, isTrending: true, source: 'DexBoost',
      amount: t.amount, totalAmount: t.totalAmount
    }));
  } catch { return []; }
};

// Removed Solana Alpha logic



const fetchGeckoTrending = async () => {
  try {
    const r = await ft('https://api.coingecko.com/api/v3/search/trending');
    const d = await r.json();
    return (d?.coins || []).map(c => ({
      id: c.item.id, name: c.item.name, symbol: c.item.symbol?.toUpperCase(),
      chain: 'MULTI', price: c.item.data?.price || 0,
      change: c.item.data?.price_change_percentage_24h?.usd || 0,
      liquidity: 0, volume: 0, icon: c.item.large || c.item.thumb,
      contract: c.item.id, isTrending: true, rank: c.item.market_cap_rank, source: 'CoinGecko'
    }));
  } catch { return []; }
};

const fetchGeckoChain = async (chain) => {
  try {
    const r = await ft(`https://api.geckoterminal.com/api/v2/networks/${chain}/new_pools?page=1`);
    const d = await r.json();
    return (d?.data || []).slice(0, 15).map(p => {
      const a = p.attributes || {};
      return {
        id: p.id, name: a.name?.split('/')[0] || '???', symbol: a.name?.split('/')[0] || '???',
        chain: chain.toUpperCase(), price: parseFloat(a.base_token_price_usd) || 0,
        change: parseFloat(a.price_change_percentage?.h24) || 0,
        liquidity: parseFloat(a.reserve_in_usd) || 0, volume: parseFloat(a.volume_usd?.h24) || 0,
        icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
        contract: a.address || '', isNew: true, source: 'GeckoTerminal'
      };
    });
  } catch { return []; }
};

const searchDex = async (q) => {
  try {
    const r = await ft(`https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(q)}`);
    const d = await r.json();
    const seen = new Set();
    return (d?.pairs || []).slice(0, 20).filter(p => {
      const k = p.baseToken?.address; if (seen.has(k)) return false; seen.add(k); return true;
    }).map(p => ({
      id: p.baseToken?.address, name: p.baseToken?.name, symbol: p.baseToken?.symbol,
      chain: p.chainId?.toUpperCase(), price: parseFloat(p.priceUsd) || 0,
      change: parseFloat(p.priceChange?.h24) || 0, liquidity: parseFloat(p.liquidity?.usd) || 0,
      volume: parseFloat(p.volume?.h24) || 0,
      icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',
      contract: p.baseToken?.address, pairUrl: p.url, source: 'DexScreener',
      fdv: p.fdv, marketCap: p.marketCap, txns: p.txns
    }));
  } catch { return []; }
};

// Scam puanlama
const scoreToken = (token) => {
  let score = 50;
  if (token.liquidity > 100000) score += 20;
  else if (token.liquidity > 10000) score += 10;
  else if (token.liquidity < 1000) score -= 20;
  if (token.volume > 50000) score += 15;
  if (Math.abs(token.change) > 50) score -= 15;
  if (token.fdv && token.marketCap && token.fdv / token.marketCap > 10) score -= 10;
  return Math.max(0, Math.min(100, score));
};

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
const DiscoveryHub = ({ onBack, setTab, setActiveToken, addNewToken, t: tProp }) => {
  const t = tProp || ((key) => key);
  const [filter, setFilter] = useState('new');
  const [chain, setChain] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [todayTrend, setTodayTrend] = useState([]);

  // QAI'de Trend Olanlar — localStorage'dan onaylanan trend başvurularını çek
  useEffect(() => {
    const loadTrend = () => {
      const all = JSON.parse(localStorage.getItem('user_listings') || '[]');
      const now = Date.now();
      const active = all.filter(i =>
        i.status === 'approved' &&
        i.isTrend &&
        i.trendUntil &&
        i.trendUntil > now
      );
      setTodayTrend(active);
    };
    loadTrend();
    const iv = setInterval(loadTrend, 10000);
    return () => clearInterval(iv);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      let results = [];
      if (filter === 'new') {
        const [dex, bsc, eth, ton] = await Promise.allSettled([
          fetchDexNew(), fetchGeckoChain('bsc'), fetchGeckoChain('eth'), fetchGeckoChain('ton')
        ]);
        results = [...(dex.value||[]), ...(bsc.value||[]), ...(eth.value||[]), ...(ton.value||[])];
        // Sort by source priority (newest pools first)
        results.sort((a,b) => (a.source === 'GeckoTerminal' ? -1 : 1));
      } else if (filter === 'trending') {
        const [boosts, gecko] = await Promise.allSettled([
          fetchDexTrending(), fetchGeckoTrending()
        ]);
        results = [...(boosts.value||[]), ...(gecko.value||[])];
        // Sort by volume if available
        results.sort((a,b) => (b.volume || 0) - (a.volume || 0));
      }


      if (chain !== 'all') results = results.filter(t => t.chain?.toLowerCase().includes(chain.toLowerCase()));
      const seen = new Set();
      results = results.filter(t => { if (!t.id || seen.has(t.id)) return false; seen.add(t.id); return true; });
      setTokens(results);
      setLastUpdate(new Date());
    } catch (_) {}
    setLoading(false);
  }, [filter, chain]);

  useEffect(() => {
    if (filter !== 'search') load();
  }, [filter, chain]);

  useEffect(() => {
    if (filter === 'search') return;
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, [load, filter]);

  useEffect(() => {
    if (filter !== 'search') return;
    if (!searchQuery || searchQuery.length < 2) { setTokens([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      setTokens(await searchDex(searchQuery));
      setLoading(false);
    }, 600);
    return () => clearTimeout(t);
  }, [searchQuery, filter]);

  const chains = ['all', 'ETH', 'BSC', 'TON', 'ARB', 'BASE', 'SOL', 'TRX', 'BTC'];
  const chainColors = { ETH: '#627EEA', BSC: '#F3BA2F', TON: '#0098EA', ARB: '#28A0F0', BASE: '#0052FF', SOL: '#14F195', TRX: '#EF0027', BTC: '#F7931A' };

  return (
    <motion.div initial={{ x: 300 }} animate={{ x: 0 }} style={{ minHeight: '100vh', background: 'var(--bg-main)', paddingBottom: '120px' }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ChevronLeft size={28} onClick={onBack} style={{ cursor: 'pointer' }} />
          <div>
            <h2 style={{ margin: 0, fontWeight: '900', fontSize: '1.25rem' }}>{t('discovery.title')}</h2>
            {lastUpdate && <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{t('staking.last_update') || 'Son'}: {lastUpdate.toLocaleTimeString()}</div>}
          </div>
        </div>
        <motion.div whileTap={{ scale: 0.9 }} onClick={load}
          style={{ width: '38px', height: '38px', background: 'var(--bg-card)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>
          <RefreshCcw size={16} color={loading ? 'var(--primary)' : 'var(--text-muted)'} className={loading ? 'animate-spin' : ''} />
        </motion.div>
      </div>

      {/* Marquee Banner */}
      <div style={{ background: 'linear-gradient(90deg, rgba(124,58,237,0.15), rgba(236,72,153,0.15))', borderTop: '1px solid rgba(124,58,237,0.2)', borderBottom: '1px solid rgba(236,72,153,0.2)', padding: '8px 0', marginBottom: '20px', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <motion.div animate={{ x: ['100%', '-100%'] }} transition={{ repeat: Infinity, duration: 20, ease: 'linear' }} style={{ display: 'inline-block', color: '#f472b6', fontSize: '0.8rem', fontWeight: '700', letterSpacing: '1px' }}>
          🚀 {t('discovery.promo_1') || 'YENİ FIRSATLARI KAÇIRMAYIN!'} 🚀 {t('discovery.promo_2') || 'TASTE ALIM SATIMA AÇIKTIR!'} 🚀 {t('discovery.promo_3') || 'KENDİ TOKENİNİZİ LİSTELEYİN!'} 🚀
        </motion.div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {[{ id: 'new', icon: <Rocket size={13} />, label: t('discovery.new_tokens') }, { id: 'trending', icon: <Flame size={13} />, label: t('discovery.trending') }, { id: 'search', icon: <Search size={13} />, label: t('welcome.search') || 'Ara' }].map(f => (
            <motion.button key={f.id} whileTap={{ scale: 0.95 }} onClick={() => setFilter(f.id)}
              style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 14px', borderRadius: '12px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', background: filter === f.id ? 'var(--primary)' : 'var(--bg-card)', color: filter === f.id ? '#fff' : 'var(--text-muted)', fontWeight: '700', fontSize: '0.78rem' }}>
              {f.icon} {f.label}
            </motion.button>
          ))}
        </div>

        {/* Search */}
        {filter === 'search' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-card)', borderRadius: '14px', padding: '11px 14px', border: '1px solid var(--glass-border)', marginBottom: '14px' }}>
            <Search size={15} color="var(--text-muted)" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={t('discovery.search_placeholder')}
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.88rem', outline: 'none', width: '100%' }} />
            {searchQuery && <X size={15} color="var(--text-muted)" onClick={() => setSearchQuery('')} style={{ cursor: 'pointer' }} />}
          </div>
        )}

        {/* Chain Filter */}
        {filter !== 'search' && (
          <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {chains.map(c => (
              <button key={c} onClick={() => setChain(c)}
                style={{ padding: '5px 11px', borderRadius: '9px', border: chain === c ? '1px solid var(--primary)' : '1px solid var(--glass-border)', cursor: 'pointer', whiteSpace: 'nowrap', background: chain === c ? 'rgba(124,58,237,0.15)' : 'var(--bg-card)', color: chain === c ? 'var(--primary)' : 'var(--text-muted)', fontWeight: '700', fontSize: '0.7rem' }}>
                {c === 'all' ? (t('welcome.all') || 'Tümü') : c}
              </button>
            ))}
          </div>
        )}

        {/* QAI'de Trend Olanlar */}
        {todayTrend.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: '900', color: '#f59e0b', letterSpacing: '1px' }}>{t('discovery.qai_trending')}</div>
              <div style={{ flex: 1, height: '1px', background: 'rgba(245,158,11,0.2)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {todayTrend.map(t => {
                const hoursLeft = Math.max(0, Math.ceil((t.trendUntil - Date.now()) / 3600000));
                const isVip = t.tier === 'TIER_3';
                return (
                  <motion.div key={t.id} whileTap={{ scale: 0.98 }}
                    style={{ background: isVip ? 'linear-gradient(135deg,rgba(34,197,94,0.1),rgba(34,197,94,0.04))' : 'linear-gradient(135deg,rgba(239,68,68,0.1),rgba(239,68,68,0.04))', borderRadius: '18px', padding: '14px 16px', border: `1px solid ${isVip ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '42px', height: '42px', background: isVip ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', borderRadius: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: '900', color: isVip ? '#22c55e' : '#ef4444', flexShrink: 0 }}>
                      {t.symbol?.[0] || '?'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: '900', fontSize: '0.9rem' }}>{t.symbol}</span>
                        <span style={{ fontSize: '0.55rem', fontWeight: '900', background: isVip ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', color: isVip ? '#22c55e' : '#ef4444', padding: '2px 6px', borderRadius: '5px' }}>{isVip ? 'VIP 48s' : 'TREND 24s'}</span>
                      </div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>{t.name} · {t.network} · {hoursLeft} {t('discovery.hours_left')}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => { 
                        if (addNewToken) {
                          const nt = { id: t.symbol?.toLowerCase() + '_listed_' + t.id, symbol: t.symbol, name: t.name, network: t.network, networkKey: t.network, icon: '', balance: 0, price: 0, contract: t.contract, isNative: false, decimals: 18 };
                          addNewToken(nt);
                          if(setActiveToken) setActiveToken(nt);
                        }
                      }}
                        style={{ padding: '7px 11px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '9px', color: 'var(--primary)', fontSize: '0.65rem', fontWeight: '700', cursor: 'pointer' }}>
                        + {t('discovery.add')}
                      </button>
                      {isVip && (
                        <button onClick={() => { 
                          if (addNewToken) {
                            const nt = { id: t.symbol?.toLowerCase() + '_listed_' + t.id, symbol: t.symbol, name: t.name, network: t.network, networkKey: t.network, icon: '', balance: 0, price: 0, contract: t.contract, isNative: false, decimals: 18 };
                            addNewToken(nt);
                            if(setActiveToken) setActiveToken(nt);
                            setTab('swap');
                          }
                        }}
                          style={{ padding: '7px 11px', background: '#22c55e', border: 'none', borderRadius: '9px', color: '#fff', fontSize: '0.65rem', fontWeight: '900', cursor: 'pointer' }}>
                          Al/Sat
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Stats */}
        <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.1),rgba(167,139,250,0.05))', borderRadius: '18px', padding: '14px 16px', border: '1px solid rgba(124,58,237,0.2)', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: '900', fontSize: '0.82rem' }}>{tokens.length} {t('discovery.found')}</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>DexScreener + GeckoTerminal + CoinGecko</div>
          </div>
          <button onClick={() => setTab('listing')}
            style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '7px 13px', borderRadius: '11px', fontWeight: '900', fontSize: '0.7rem', cursor: 'pointer' }}>
            {t('discovery.list_btn')}
          </button>
        </div>

        {/* Loading */}
        {loading && tokens.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              style={{ width: '36px', height: '36px', border: '3px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 14px' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{t('discovery.scanning')}</p>
          </div>
        )}

        {/* Token List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {tokens.map(token => {
            const isUp = token.change >= 0;
            const cc = chainColors[token.chain] || '#6366f1';
            const score = scoreToken(token);
            return (
              <motion.div key={token.id} whileTap={{ scale: 0.98 }} onClick={() => setSelected(token)}
                style={{ background: 'var(--bg-card)', borderRadius: '16px', padding: '13px 14px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                {token.isNew && <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: '#22c55e' }} />}
                {token.isTrending && <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: '#f59e0b' }} />}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img src={token.icon} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', background: 'rgba(255,255,255,0.05)' }}
                    onError={e => { e.target.src = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'; }} />
                  <div style={{ position: 'absolute', bottom: -2, right: -2, background: cc, borderRadius: '5px', padding: '1px 4px', fontSize: '0.48rem', fontWeight: '900', color: '#fff', border: '1px solid var(--bg-main)' }}>{token.chain?.slice(0, 3)}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: '900', fontSize: '0.88rem' }}>{token.symbol?.slice(0, 10)}</span>
                      {token.isNew && <span style={{ fontSize: '0.5rem', background: 'rgba(34,197,94,0.15)', color: '#22c55e', padding: '1px 5px', borderRadius: '4px', fontWeight: '900' }}>{t('discovery.new_badge') || 'YENİ'}</span>}
                      {token.isPump && <span style={{ fontSize: '0.5rem', background: 'rgba(34,197,94,0.2)', color: '#22c55e', padding: '1px 5px', borderRadius: '4px', fontWeight: '900' }}>PUMP</span>}
                      {token.isTrending && <span style={{ fontSize: '0.5rem', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', padding: '1px 5px', borderRadius: '4px', fontWeight: '900' }}>🔥</span>}
                    </div>
                    <span style={{ fontWeight: '700', fontSize: '0.82rem' }}>{token.price > 0 ? `$${token.price.toLocaleString(undefined, { maximumFractionDigits: (token.price < 0.01 ? 8 : 4) })}` : '—'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3px' }}>
                    <div style={{ display: 'flex', gap: '7px', fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                      {token.volume > 0 && <span style={{ color: 'rgba(255,255,255,0.4)' }}>Vol: ${(token.volume / 1000).toFixed(0)}k</span>}
                      <span style={{ color: score > 70 ? '#22c55e' : score > 40 ? '#f59e0b' : '#ef4444' }}>{t('discovery.score') || 'Güven'}: {score}</span>
                    </div>
                    {token.change !== 0 && (
                      <span style={{ fontSize: '0.68rem', fontWeight: '900', color: isUp ? '#22c55e' : '#ef4444' }}>{isUp ? '▲' : '▼'}{Math.abs(token.change).toFixed(1)}%</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {!loading && tokens.length === 0 && filter === 'search' && searchQuery.length > 1 && (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>"{searchQuery}" {t('discovery.none_found')}</div>
        )}
      </div>

      {/* Token Detail Modal */}
      <AnimatePresence>
        {selected && <TokenDetailModal token={selected} onClose={() => setSelected(null)} addNewToken={addNewToken} setTab={setTab} setActiveToken={setActiveToken} t={t} />}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── TOKEN DETAIL MODAL ──────────────────────────────────────────────────────
const TokenDetailModal = ({ token, onClose, addNewToken, setTab, setActiveToken, t }) => {
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);
  const score = scoreToken(token);

  const copy = () => { navigator.clipboard.writeText(token.contract || token.id); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const handleAdd = () => {
    if (!addNewToken) return;
    // Kapsamlı chain → networkKey mapping
    const chainNetMap = {
      ETH: 'ETH', ETHEREUM: 'ETH',
      BSC: 'BNB', BNB: 'BNB', BINANCE: 'BNB',
      TON: 'TON',
      ARB: 'ARB', ARBITRUM: 'ARB',
      BASE: 'BASE',
      MATIC: 'MATIC', POLYGON: 'MATIC',
    };
    const networkKey = chainNetMap[token.chain?.toUpperCase()] || 'ETH';
    const nt = {
      id: (token.symbol || 'tk').toLowerCase() + '_' + Date.now(),
      symbol: token.symbol || '???', name: token.name || token.symbol,
      network: networkKey, networkKey,
      icon: token.icon, balance: 0, price: token.price || 0,
      contract: token.contract || token.id, isNative: false, decimals: 18
    };
    addNewToken(nt);
    if(setActiveToken) setActiveToken(nt);
    setAdded(true);
  };

  const handleSwap = () => {
    handleAdd();
    onClose();
    setTab('swap');
  };

  const explorerMap = { ETH: 'https://etherscan.io/token/', BSC: 'https://bscscan.com/token/', TON: 'https://tonscan.org/jetton/', ARB: 'https://arbiscan.io/token/', BASE: 'https://basescan.org/token/' };
  const explorerUrl = (explorerMap[token.chain] || 'https://dexscreener.com/') + (token.contract || token.id);

  const scoreColor = score > 70 ? '#22c55e' : score > 40 ? '#f59e0b' : '#ef4444';
  const scoreLabel = score > 70 ? t('discovery.safe') : score > 40 ? t('discovery.warn') : t('discovery.risky');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 3000, display: 'flex', alignItems: 'flex-end' }}
      onClick={onClose}>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        style={{ width: '100%', background: 'var(--bg-main)', borderRadius: '32px 32px 0 0', padding: '26px 22px 40px', border: '1px solid var(--glass-border)', maxHeight: '85vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}>
        <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', margin: '0 auto 22px' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '22px' }}>
          <img src={token.icon} style={{ width: '52px', height: '52px', borderRadius: '50%' }}
            onError={e => { e.target.src = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'; }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '900', fontSize: '1.2rem' }}>{token.symbol}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{token.name} · {token.chain}</div>
          </div>
          <X size={22} onClick={onClose} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
        </div>

        {/* Scam Score */}
        <div style={{ background: `rgba(${score > 70 ? '34,197,94' : score > 40 ? '245,158,11' : '239,68,68'},0.08)`, borderRadius: '16px', padding: '14px 16px', border: `1px solid rgba(${score > 70 ? '34,197,94' : score > 40 ? '245,158,11' : '239,68,68'},0.2)`, marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '3px' }}>{t('discovery.scam_score')}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '900', color: scoreColor }}>{score}/100</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: '900', color: scoreColor }}>{scoreLabel}</div>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '2px' }}>{t('discovery.analytics')}</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px', marginBottom: '16px' }}>
          {[
            { label: t('discovery.price'), value: token.price > 0 ? `$${token.price.toLocaleString(undefined, { maximumFractionDigits: 8 })}` : '—' },
            { label: t('discovery.change24h'), value: `${token.change >= 0 ? '+' : ''}${token.change.toFixed(2)}%`, color: token.change >= 0 ? '#22c55e' : '#ef4444' },
            { label: t('discovery.liquidity'), value: token.liquidity > 0 ? `$${(token.liquidity / 1000).toFixed(1)}k` : '—' },
            { label: t('discovery.volume24h'), value: token.volume > 0 ? `$${(token.volume / 1000).toFixed(1)}k` : '—' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: 'var(--bg-card)', borderRadius: '13px', padding: '13px', border: '1px solid var(--glass-border)' }}>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '4px' }}>{label}</div>
              <div style={{ fontWeight: '900', fontSize: '0.88rem', color: color || '#fff' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Contract */}
        {token.contract && (
          <div style={{ background: 'var(--bg-card)', borderRadius: '13px', padding: '13px', border: '1px solid var(--glass-border)', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: '700' }}>{t('discovery.contract')}</span>
              <div onClick={copy} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: copied ? '#22c55e' : 'var(--primary)', cursor: 'pointer', fontSize: '0.68rem', fontWeight: '700' }}>
                {copied ? <Check size={12} /> : <Copy size={12} />} {copied ? t('discovery.added') : t('discovery.add')}
              </div>
            </div>
            <div style={{ fontSize: '0.66rem', wordBreak: 'break-all', color: 'rgba(255,255,255,0.5)' }}>{token.contract}</div>
          </div>
        )}

        {/* Uyarı */}
        {score < 50 && (
          <div style={{ background: 'rgba(239,68,68,0.08)', borderRadius: '13px', padding: '12px 14px', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <AlertTriangle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: '1px' }} />
            <span style={{ fontSize: '0.7rem', color: '#ef4444', lineHeight: 1.4 }}>{t('discovery.risk_msg')}</span>
          </div>
        )}

        <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '12px', padding: '10px 12px', marginBottom: '16px', fontSize: '0.7rem', color: '#a5b4fc', display: 'flex', gap: '8px' }}>
          <ShieldCheck size={16} color="#a5b4fc" style={{ flexShrink: 0 }} />
          <span><b>{t('discovery.reminder_title')}</b> {t('discovery.reminder_msg')}</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '9px' }}>
          <a href={explorerUrl} target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '13px', background: 'rgba(255,255,255,0.05)', borderRadius: '13px', border: '1px solid var(--glass-border)', color: '#fff', textDecoration: 'none', fontWeight: '700', fontSize: '0.75rem' }}>
            <ExternalLink size={14} /> {t('discovery.explorer') || 'Explorer'}
          </a>
          <button onClick={handleAdd} disabled={added}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '13px', background: added ? 'rgba(34,197,94,0.15)' : 'rgba(124,58,237,0.2)', borderRadius: '13px', border: '1px solid rgba(124,58,237,0.3)', color: '#fff', fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer' }}>
            {added ? <><Check size={14} /> {t('discovery.added')}</> : <><Plus size={14} /> {t('discovery.add')}</>}
          </button>
          <button onClick={handleSwap}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '13px', background: 'var(--primary)', borderRadius: '13px', border: 'none', color: '#fff', fontWeight: '700', fontSize: '0.75rem', cursor: 'pointer' }}>
            <ArrowUpDown size={14} /> Swap
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DiscoveryHub;
