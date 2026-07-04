import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpDown, Settings, ChevronDown, ChevronLeft,
  AlertCircle, Check, Loader2, Zap, ExternalLink,
  Globe, Copy, RefreshCcw, Layers, Wifi
} from 'lucide-react';
import { WALLET_CONFIG } from '../config';
import {
  getSwapQuote, executeRealSwap,
  executeTonSwap, getTonQuote,
  getJupiterQuote, executeJupiterSwap
} from '../blockchainService';



// ─── DAPP LİSTESİ ────────────────────────────────────────────────────────────
const DAPPS = [
  // DEX / Swap
  { id: 'uniswap',    name: 'Uniswap',      category: 'DEX',    chain: 'ETH',  icon: 'https://app.uniswap.org/favicon.png',                url: 'https://app.uniswap.org', desc: 'ETH ekosistemi DEX' },
  { id: 'pancake',    name: 'PancakeSwap',  category: 'DEX',    chain: 'BNB',  icon: 'https://pancakeswap.finance/favicon.ico',            url: 'https://pancakeswap.finance/swap', desc: 'BNB Chain DEX' },
  { id: 'stonfi',     name: 'STON.fi',      category: 'DEX',    chain: 'TON',  icon: 'https://ston.fi/favicon.ico',                        url: 'https://app.ston.fi/swap', desc: 'TON DEX' },
  { id: '1inch',      name: '1inch',        category: 'DEX',    chain: 'MULTI',icon: 'https://1inch.io/img/favicon/favicon-32x32.png',     url: 'https://app.1inch.io', desc: 'Multi-chain aggregator' },
  // Bridge
  { id: 'lifi',       name: 'Li.Fi Bridge', category: 'Bridge', chain: 'MULTI',icon: 'https://li.fi/favicon.ico',                          url: 'https://transferto.xyz', desc: 'Cross-chain bridge' },
  { id: 'stargate',   name: 'Stargate',     category: 'Bridge', chain: 'MULTI',icon: 'https://stargate.finance/favicon.ico',               url: 'https://stargate.finance/transfer', desc: 'LayerZero bridge' },
  { id: 'orbiter',    name: 'Orbiter',      category: 'Bridge', chain: 'MULTI',icon: 'https://www.orbiter.finance/favicon.ico',            url: 'https://www.orbiter.finance', desc: 'L2 bridge' },
  // NFT
  { id: 'opensea',    name: 'OpenSea',      category: 'NFT',    chain: 'ETH',  icon: 'https://opensea.io/static/images/favicon/32x32.png', url: 'https://opensea.io', desc: 'NFT marketplace' },
  // DeFi
  { id: 'aave',       name: 'Aave',         category: 'DeFi',   chain: 'ETH',  icon: 'https://aave.com/favicon.ico',                       url: 'https://app.aave.com', desc: 'Lending & borrowing' },
  { id: 'compound',   name: 'Compound',     category: 'DeFi',   chain: 'ETH',  icon: 'https://compound.finance/favicon.ico',               url: 'https://app.compound.finance', desc: 'DeFi lending' }
];

const DAPP_CATEGORIES = ['Tümü', 'DEX', 'Bridge', 'NFT', 'DeFi'];
const CHAIN_COLORS = { ETH: '#627EEA', BNB: '#F3BA2F', TON: '#0098EA', MULTI: '#a78bfa' };

// ─── DAPP BROWSER ─────────────────────────────────────────────────────────────
const DAppBrowser = ({ walletData }) => {
  const [category, setCategory] = useState('Tümü');
  const [openDapp, setOpenDapp] = useState(null);
  const [copied, setCopied] = useState('');
  const [search, setSearch] = useState('');

  const openInNewTab = (dapp) => {
    window.open(dapp.url, '_blank');
    setOpenDapp(dapp);
  };

  const copyAddress = (networkKey) => {
    const addr = walletData?.addresses?.[networkKey] || walletData?.addresses?.ETH || '';
    if (addr) { navigator.clipboard.writeText(addr); setCopied(networkKey); setTimeout(() => setCopied(''), 2000); }
  };

  const filtered = DAPPS.filter(d =>
    (category === 'Tümü' || d.category === category) &&
    (d.name.toLowerCase().includes(search.toLowerCase()) || d.desc.toLowerCase().includes(search.toLowerCase()))
  );

  if (openDapp) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div onClick={() => setOpenDapp(null)} style={{ background: 'var(--bg-card)', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}>
            <ChevronLeft size={20} />
          </div>
          <img src={openDapp.icon} style={{ width: '40px', height: '40px', borderRadius: '12px' }} />
          <div>
            <div style={{ fontWeight: '900', fontSize: '1.1rem' }}>{openDapp.name}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Harici Tarayıcıda Açıldı</div>
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.1),rgba(16,185,129,0.05))', padding: '25px', borderRadius: '24px', border: '1px solid rgba(16,185,129,0.2)', textAlign: 'center' }}>
          <Check size={40} color="#10b981" style={{ marginBottom: '15px' }} />
          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', fontWeight: '900' }}>Bağlantıya Hazır!</h3>
          <p style={{ margin: '0 0 20px 0', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            {openDapp.name} yeni sekmede açıldı. Siteye bağlanmak için <b>WalletConnect</b> seçeneğini kullanın.
          </p>
          <button onClick={() => window.open(openDapp.url, '_blank')}
            style={{ padding: '12px 24px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}>
            <ExternalLink size={16} /> Siteye Git
          </button>
        </div>

        <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '22px', border: '1px solid var(--glass-border)' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '12px', letterSpacing: '1px' }}>HIZLI ERİŞİM ADRESLERİNİZ</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { key: 'ETH', label: 'EVM Address' },
              { key: 'TON', label: 'TON Address' },
            ].map(({ key, label }) => (
              <div key={key} onClick={() => copyAddress(key)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '14px', cursor: 'pointer', border: copied === key ? '1px solid #22c55e' : '1px solid transparent' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: '700' }}>{label}</span>
                {copied === key ? <Check size={14} color="#22c55e" /> : <Copy size={14} color="var(--text-muted)" />}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-card)', borderRadius: '13px', padding: '9px 13px', border: '1px solid var(--glass-border)', marginBottom: '12px' }}>
        <Globe size={14} color="var(--text-muted)" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="DApp ara..."
          style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.83rem', outline: 'none', width: '100%' }} />
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', overflowX: 'auto', scrollbarWidth: 'none' }}>
        {DAPP_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            style={{ padding: '6px 13px', borderRadius: '10px', border: category === cat ? '1px solid var(--primary)' : '1px solid var(--glass-border)', background: category === cat ? 'rgba(124,58,237,0.15)' : 'var(--bg-card)', color: category === cat ? 'var(--primary)' : 'var(--text-muted)', fontWeight: '700', fontSize: '0.72rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {cat}
          </button>
        ))}
      </div>

      {/* DApp Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        {filtered.map(dapp => (
          <motion.div key={dapp.id} whileTap={{ scale: 0.96 }} onClick={() => openInNewTab(dapp)}
            style={{ background: 'var(--bg-card)', borderRadius: '18px', padding: '16px', border: '1px solid var(--glass-border)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -15, right: -15, width: '60px', height: '60px', background: CHAIN_COLORS[dapp.chain] || '#6366f1', filter: 'blur(30px)', opacity: 0.12 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <img src={dapp.icon} style={{ width: '32px', height: '32px', borderRadius: '10px' }} alt={dapp.name}
                onError={e => { e.target.src = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'; }} />
              <div>
                <div style={{ fontWeight: '900', fontSize: '0.85rem' }}>{dapp.name}</div>
                <div style={{ fontSize: '0.55rem', color: CHAIN_COLORS[dapp.chain] || 'var(--text-muted)', fontWeight: '700' }}>{dapp.chain}</div>
              </div>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>{dapp.desc}</div>
            <div style={{ marginTop: '8px', display: 'inline-block', fontSize: '0.58rem', fontWeight: '700', background: 'rgba(124,58,237,0.1)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '6px' }}>{dapp.category}</div>
          </motion.div>
        ))}
      </div>

      {/* WalletConnect info */}
      <div style={{ marginTop: '20px', background: 'linear-gradient(135deg,rgba(124,58,237,0.08),rgba(236,72,153,0.05))', borderRadius: '16px', padding: '14px 16px', border: '1px dashed rgba(124,58,237,0.3)', textAlign: 'center' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: '900', marginBottom: '4px' }}>WalletConnect Yakında</div>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>QR kod ile tüm DApp'lere direkt bağlan</div>
      </div>
    </div>
  );
};

const Swap = ({ onBack, livePrices, balances, walletData, tokens, activeToken, t }) => {
  const [mainTab, setMainTab] = useState('swap'); // swap | dapps
  const [showWC, setShowWC] = useState(false);
  const [fromToken, setFromToken] = useState(activeToken || tokens?.find(t => t.symbol === 'ETH') || tokens?.[2] || WALLET_CONFIG.TOKENS[2]);
  const [toToken, setToToken] = useState(tokens?.find(t => t.symbol === 'BNB' && t.id !== fromToken?.id) || tokens?.[3] || WALLET_CONFIG.TOKENS[3]);
  const [realQuote, setRealQuote] = useState(null);
  const [fetchingQuote, setFetchingQuote] = useState(false);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [slippage, setSlippage] = useState('0.5');
  const [swapStep, setSwapStep] = useState('input');
  const [showSelector, setShowSelector] = useState(null);
  const [txHash, setTxHash] = useState('');
  const [timeLeft, setTimeLeft] = useState(20);
  const quoteTimestamp = useRef(null);

  // Timer for auto-refresh
  useEffect(() => {
    if (!realQuote || loading) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setRealQuote(null); // Trigger re-fetch
          return 20;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [realQuote, loading]);

  useEffect(() => {
     if (!realQuote) setTimeLeft(20);
  }, [realQuote]);

  const fromBalance = balances[fromToken.id] || 0;
  const fromPrice = livePrices?.[fromToken.id] || 0;
  const toPrice = livePrices?.[toToken.id] || 0;

  // Cross-chain swap uyarısı
  const isCrossChain = fromToken.networkKey !== toToken.networkKey;

  // Quote fetch
  useEffect(() => {
    let isCancelled = false;
    setRealQuote(null);

    const fetchQuote = async () => {
      if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
        setError(null);
        return;
      }
      if (fromToken.id === toToken.id) {
        setError('Cannot swap the same token.');
        return;
      }

      setFetchingQuote(true);
      setError(null);

      try {
        let quote = null;
        const slippageBps = Math.round(parseFloat(slippage) * 100); // % -> bps
        const fromAddr = walletData?.addresses?.[fromToken.networkKey] || '0x0000000000000000000000000000000000000000';

        if (fromToken.networkKey === 'TON' && toToken.networkKey === 'TON') {
          // Real TON Quote (STON.fi / DeDust Aggregator)
          quote = await getTonQuote(fromToken.contract || 'ton', toToken.contract || 'ton', amount, fromAddr);
        }
        else if (fromToken.networkKey === 'SOL' && toToken.networkKey === 'SOL') {
          // Solana Quote via Jupiter
          const SOL_MINT = 'So11111111111111111111111111111111111111112';
          const fromMint = fromToken.contract || SOL_MINT;
          const toMint = toToken.contract || SOL_MINT;
          const decimals = fromToken.decimals || 9;
          quote = await getJupiterQuote(fromMint, toMint, amount, decimals);
        }
        else {
          const decimals = fromToken.decimals || 18;
          const cleanAmount = parseFloat(amount).toFixed(Math.min(decimals, 8));
          const rawAmount = ethers.parseUnits(cleanAmount, decimals).toString();

          // Get Quote from Hybrid Engine (Li.Fi + OpenOcean)
          quote = await getSwapQuote(
            fromToken.chainId || fromToken.networkKey, 
            toToken.chainId || toToken.networkKey,
            fromToken.contract || '0x0000000000000000000000000000000000000000',
            toToken.contract || '0x0000000000000000000000000000000000000000',
            rawAmount, 
            fromAddr,
            slippage
          );
        }

        if (isCancelled) return;
        if (quote) {
          quoteTimestamp.current = Date.now();
          setRealQuote(quote);
        } else {
          setError('No route found for this pair. Try a different amount or token.');
        }
      } catch (e) {
        if (!isCancelled) {
          const msg = e.message || '';
          if (msg.includes('coalesce') || msg.includes('timeout') || msg.includes('timed out')) {
            setError('RPC connection timed out. Please try again.');
          } else {
            setError('Quote failed: ' + msg.slice(0, 80));
          }
        }
      } finally {
        if (!isCancelled) setFetchingQuote(false);
      }
    };

    const timer = setTimeout(fetchQuote, 600);
    return () => { isCancelled = true; clearTimeout(timer); };
  }, [amount, fromToken, toToken, slippage]);

  // Quote 60 saniyede süresi dolar
  useEffect(() => {
    if (!realQuote) return;
    const timer = setTimeout(() => {
      setRealQuote(null);
      setError('Quote expired. Refreshing...');
    }, 60000);
    return () => clearTimeout(timer);
  }, [realQuote]);

  const estimatedOut = realQuote?.outAmount
    ? realQuote.outAmount
    : (realQuote?.estimate?.toAmount
      ? (() => {
          const decimals = realQuote.action?.toToken?.decimals
            ?? (toToken.networkKey === 'TON' ? 9 : 18);
          try {
            return ethers.formatUnits(realQuote.estimate.toAmount, decimals);
          } catch {
            return (parseFloat(realQuote.estimate.toAmount) / Math.pow(10, decimals)).toFixed(6);
          }
        })()
      : (amount && fromPrice && toPrice ? ((amount * fromPrice / toPrice) * 0.995).toFixed(6) : '0'));

  const handleSwap = async () => {
    if (!realQuote) { setError('Please wait for a quote first.'); return; }

    if (quoteTimestamp.current && Date.now() - quoteTimestamp.current > 58000) {
      setError('Quote expired. Please wait...');
      setRealQuote(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (fromToken.networkKey === 'TON') {
        setStatus('TON Swap İşleniyor...');
        const sig = await executeTonSwap(walletData.mnemonic, fromToken.contract, toToken.contract, amount, realQuote);
        setTxHash(sig);
        setSwapStep('success');
      }
      else if (fromToken.networkKey === 'SOL') {
        setStatus('Jupiter üzerinden Solana swap gönderiliyor...');
        const solAddr = walletData?.addresses?.SOL || '';
        const sig = await executeJupiterSwap(walletData.mnemonic, realQuote.raw, solAddr);
        setTxHash(sig);
        setSwapStep('success');
      }
      else {
        setStatus('Token izni kontrol ediliyor (Approval)...');
        const receipt = await executeRealSwap(walletData.mnemonic, realQuote);
        setTxHash(receipt?.hash || receipt?.transactionHash || 'İşlem Gönderildi');
        setSwapStep('success');
      }
    } catch (e) {
      console.error('[Swap ERROR]', e);
      setError(e.message || 'Transaction failed.');
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  const TokenSelector = ({ active, onSelect }) => (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 2000, display: 'flex', alignItems: 'flex-end' }}
      onClick={() => setShowSelector(null)}
    >
      <motion.div
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        style={{ width: '100%', background: 'var(--bg-main)', borderRadius: '35px 35px 0 0', padding: '30px', borderTop: '1px solid var(--glass-border)' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ width: '40px', height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', margin: '0 auto 25px' }} />
        <h3 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '25px', textAlign: 'center' }}>Varlık Seçin</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
          {(tokens || WALLET_CONFIG.TOKENS)
            .sort((a, b) => (balances[b.id] || 0) - (balances[a.id] || 0))
            .map(token => (
            <div
              key={token.id}
              onClick={() => { onSelect(token); setShowSelector(null); setRealQuote(null); }}
              style={{
                padding: '15px 20px',
                background: active.id === token.id ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.02)',
                borderRadius: '22px',
                border: active.id === token.id ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img src={token.icon} style={{ width: '36px', height: '36px', borderRadius: '50%' }} alt={token.symbol} />
                <div>
                  <div style={{ fontWeight: '900' }}>{token.symbol}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{token.networkKey}</div>
                </div>
              </div>
              <div style={{ fontWeight: 'bold' }}>{Number((balances[token.id] || 0).toFixed(4))}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );

  if (swapStep === 'success') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '30px', textAlign: 'center', paddingTop: '100px' }}>
        <div style={{ width: '100px', height: '100px', background: 'rgba(34,197,94,0.1)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 30px' }}>
          <Check size={50} color="#22c55e" strokeWidth={3} />
        </div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '15px' }}>Takas Başarılı!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{amount} {fromToken.symbol} → {toToken.symbol}</p>
        {txHash && (
          <div style={{ padding: '15px', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px solid var(--glass-border)', fontSize: '0.65rem', wordBreak: 'break-all', marginBottom: '20px', color: 'var(--primary)' }}>
            TX: {txHash}
          </div>
        )}
        <button onClick={() => setSwapStep('input')} style={{ width: '100%', padding: '20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '22px', fontWeight: '900' }}>TAMAM</button>
      </motion.div>
    );
  }

  return (
    <>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '20px', paddingBottom: '120px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {onBack && <ChevronLeft size={26} onClick={onBack} style={{ cursor: 'pointer' }} />}
          <h2 style={{ fontSize: '1.4rem', fontWeight: '900', margin: 0 }}>
            {mainTab === 'swap' ? 'QAI Swap' : 'DApp Browser'}
          </h2>
        </div>
        {mainTab === 'swap' && (
          <motion.div onClick={() => setShowSettings(true)} style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>
            <Settings size={22} />
          </motion.div>
        )}
      </div>

      {/* Main Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-card)', borderRadius: '14px', padding: '4px', marginBottom: '20px', border: '1px solid var(--glass-border)' }}>
        {[
          { id: 'swap', icon: <ArrowUpDown size={14} />, label: 'Swap & Bridge' },
          { id: 'dapps', icon: <Globe size={14} />, label: 'DApps' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setMainTab(tab.id)}
            style={{ flex: 1, padding: '9px', borderRadius: '10px', border: 'none', background: mainTab === tab.id ? 'var(--primary)' : 'transparent', color: mainTab === tab.id ? '#fff' : 'var(--text-muted)', fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s' }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* WalletConnect Banner */}
      <motion.div whileTap={{ scale: 0.98 }} onClick={() => setShowWC(true)}
        style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(167,139,250,0.08))', borderRadius: '16px', padding: '12px 16px', border: '1px solid rgba(99,102,241,0.25)', marginBottom: '16px', cursor: 'pointer' }}>
        <div style={{ width: '36px', height: '36px', background: 'rgba(99,102,241,0.2)', borderRadius: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Wifi size={18} color="var(--primary)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '900', fontSize: '0.85rem' }}>WalletConnect</div>
          <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Airdrop & DApp sitelerine bağlan</div>
        </div>
        <div style={{ fontSize: '0.68rem', fontWeight: '700', color: 'var(--primary)', background: 'rgba(99,102,241,0.1)', padding: '4px 10px', borderRadius: '8px' }}>Bağlan →</div>
      </motion.div>

      {/* DApp Browser */}
      {mainTab === 'dapps' && <DAppBrowser walletData={walletData} />}

      {/* Swap Content */}
      {mainTab === 'swap' && <>

      {/* Cross-chain bilgisi */}
      {isCrossChain && (
        <div style={{ padding: '12px 15px', background: 'rgba(99,102,241,0.1)', borderRadius: '15px', border: '1px solid rgba(99,102,241,0.3)', marginBottom: '15px', fontSize: '0.75rem', color: '#818cf8' }}>
          ⚡ Cross-Chain Bridge: Li.Fi üzerinden {fromToken.networkKey} ağından {toToken.networkKey} ağına güvenli geçiş yapılıyor. İşlem süresi ağlara bağlı olarak 2-10 dakika sürebilir.
        </div>
      )}

      {/* TASTE & NION Uyarısı */}
      {(fromToken.symbol === 'TASTE') && (
        <div style={{ padding: '12px 15px', background: 'rgba(99,102,241,0.1)', borderRadius: '15px', border: '1px solid rgba(99,102,241,0.3)', marginBottom: '15px', fontSize: '0.75rem', color: '#818cf8' }}>
          ℹ️ Eğer {fromToken.symbol} swap işlemi kur farkı veya sistemsel durumlardan dolayı gerçekleşmezse, lütfen menüdeki "DApps" bölümünden Hızlı Swap bağlantılarını (STON.fi / Jupiter vs.) deneyiniz.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative' }}>
        {/* From */}
        <div style={{ background: 'var(--bg-card)', padding: '25px', borderRadius: '32px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>GÖNDER</span>
              <div style={{ display: 'flex', gap: '5px', marginLeft: 'auto' }}>
                {['25%', '50%', '75%', 'MAX'].map(p => (
                  <button key={p} onClick={() => {
                    const factor = p === 'MAX' ? 1 : parseInt(p)/100;
                    const buffer = fromToken.networkKey === 'TON' ? 0.05 : 0.001;
                    setAmount(Math.max(0, (fromBalance * factor) - (p === 'MAX' ? buffer : 0)).toFixed(6));
                  }} style={{ fontSize: '0.6rem', padding: '4px 8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 'bold' }}>{p}</button>
                ))}
              </div>
            </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '2.2rem', fontWeight: '900', outline: 'none', width: '100px' }}
            />
            <div onClick={() => setShowSelector('from')} style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 15px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>
              <img src={fromToken.icon} style={{ width: '24px', height: '24px', borderRadius: '50%' }} alt={fromToken.symbol} />
              <span style={{ fontWeight: 'bold' }}>{fromToken.symbol}</span>
              <ChevronDown size={16} />
            </div>
          </div>
          {amount && fromPrice > 0 && (
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px' }}>
              ≈ ${(parseFloat(amount) * fromPrice).toFixed(2)}
            </div>
          )}
        </div>

        {/* Swap butonu */}
        <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}>
          <motion.div
            whileTap={{ rotate: 180 }}
            onClick={() => { const t = fromToken; setFromToken(toToken); setToToken(t); setRealQuote(null); setAmount(''); }}
            style={{ background: 'var(--bg-main)', border: '4px solid var(--bg-card)', borderRadius: '15px', padding: '12px', boxShadow: '0 5px 15px rgba(0,0,0,0.5)', cursor: 'pointer' }}
          >
            <ArrowUpDown size={20} color="var(--primary)" strokeWidth={3} />
          </motion.div>
        </div>

        {/* To */}
        <div style={{ background: 'rgba(255,255,255,0.02)', padding: '25px', borderRadius: '32px', border: '1px solid var(--glass-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>AL</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Bakiye: {parseFloat(balances[toToken.id] || 0).toFixed(4)}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ flex: 1, fontSize: '2.2rem', fontWeight: '900', color: estimatedOut === '0' ? 'rgba(255,255,255,0.2)' : '#fff' }}>
              {fetchingQuote ? <Loader2 size={28} className="animate-spin" /> : (estimatedOut === '0' ? '0.00' : Number(estimatedOut).toFixed(6))}
            </div>
            <div onClick={() => setShowSelector('to')} style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 15px', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>
              <img src={toToken.icon} style={{ width: '24px', height: '24px', borderRadius: '50%' }} alt={toToken.symbol} />
              <span style={{ fontWeight: 'bold' }}>{toToken.symbol}</span>
              <ChevronDown size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Quote bilgisi */}
      {realQuote && !fetchingQuote && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '20px', padding: '15px', background: 'rgba(99,102,241,0.05)', borderRadius: '20px', border: '1px solid rgba(99,102,241,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>En İyi Rota (Sağlayıcı):</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ position: 'relative', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" style={{ position: 'absolute' }}>
                  <circle cx="12" cy="12" r="10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                  <circle cx="12" cy="12" r="10" fill="none" stroke="var(--primary)" strokeWidth="2" strokeDasharray="62.8" strokeDashoffset={62.8 - (62.8 * timeLeft / 20)} style={{ transition: 'stroke-dashoffset 1s linear' }} />
                </svg>
                <span style={{ fontSize: '0.6rem', fontWeight: 'bold' }}>{timeLeft}</span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Zap size={14} /> {realQuote.tool || realQuote.provider || 'Li.Fi Aggregator'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Kayma Toleransı (Slippage):</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{slippage}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Toplam Ücret (Fee):</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>${realQuote.feeCostUSD || '0.50'}</span>
          </div>
        </motion.div>
      )}

      {error && (
        <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(239,68,68,0.1)', borderRadius: '15px', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444', fontSize: '0.8rem', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px' }} /> {error}
        </div>
      )}

      {loading && status && (
        <div style={{ marginTop: '15px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {status}
        </div>
      )}

      <button
        disabled={!realQuote || fetchingQuote || loading || parseFloat(amount) > fromBalance || !amount}
        onClick={handleSwap}
        style={{
          width: '100%', marginTop: '25px', padding: '22px',
          background: 'var(--primary)', color: '#fff', border: 'none',
          borderRadius: '25px', fontWeight: '900', fontSize: '1.2rem',
          boxShadow: '0 10px 20px var(--primary-glow)',
          opacity: (loading || fetchingQuote || !realQuote || !amount) ? 0.6 : 1
        }}
      >
        {loading ? <Loader2 className="animate-spin" /> : fetchingQuote ? 'Fiyat Alınıyor...' : !amount ? 'Miktar Girin' : !realQuote ? 'Rota Aranıyor...' : 'Swap Yap'}
      </button>

      <AnimatePresence>
        {showSelector && (
          <TokenSelector
            active={showSelector === 'from' ? fromToken : toToken}
            onSelect={showSelector === 'from' ? setFromToken : setToToken}
          />
        )}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
            onClick={() => setShowSettings(false)}
          >
            <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '30px', border: '1px solid var(--glass-border)', width: '100%', maxWidth: '350px' }} onClick={e => e.stopPropagation()}>
              <h3 style={{ margin: '0 0 25px 0', fontSize: '1.2rem', fontWeight: '900' }}>Swap Ayarları</h3>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px' }}>Kayma Toleransı (Slippage)</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {['0.1', '0.5', '1.0', '3.0'].map(v => (
                    <button key={v} onClick={() => setSlippage(v)} style={{ padding: '10px', background: slippage === v ? 'var(--primary)' : 'rgba(255,255,255,0.05)', borderRadius: '12px', color: '#fff', border: 'none', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}>{v}%</button>
                  ))}
                </div>
              </div>
              <button onClick={() => setShowSettings(false)} style={{ width: '100%', padding: '15px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}>ONAYLA</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </> }
    </motion.div>

    {/* WalletConnect Panel */}
    <AnimatePresence>

    </AnimatePresence>
  </>
  );
};

export default Swap;
