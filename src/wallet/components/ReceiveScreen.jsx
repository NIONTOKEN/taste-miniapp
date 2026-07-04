import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Copy, Share2, Check, Info, ShieldCheck, ChevronDown } from 'lucide-react';
import { WALLET_CONFIG } from '../config';

const ALL_NETWORKS = [
  { id: 'ETH',   name: 'Ethereum',  symbol: 'ETH',  icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',  color: '#627eea' },
  { id: 'BNB',   name: 'BNB Chain', symbol: 'BNB',  icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png',   color: '#f3ba2f' },
  { id: 'opBNB', name: 'opBNB',     symbol: 'BNB',  icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png',   color: '#f3ba2f' },
  { id: 'TON',   name: 'TON',       symbol: 'TON',  icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ton/info/logo.png',       color: '#0098ea' },
  { id: 'TRX',   name: 'TRON',      symbol: 'TRX',  icon: 'https://assets.coingecko.com/coins/images/1094/standard/tron-logo.png',                           color: '#EF0027' },
  { id: 'ARB',   name: 'Arbitrum',  symbol: 'ETH',  icon: 'https://assets.coingecko.com/coins/images/29587/small/arbitrum.png',                               color: '#28a0f0' },
  { id: 'BASE',  name: 'Base',      symbol: 'ETH',  icon: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',                                 color: '#0052ff' },
  { id: 'MATIC', name: 'Polygon',   symbol: 'MATIC',icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',   color: '#8247e5' },
  { id: 'MONAD', name: 'Monad',     symbol: 'MON',  icon: 'https://assets.coingecko.com/coins/images/35137/standard/monad.jpg',                       color: '#836ef9' }
];

const ReceiveScreen = ({ onBack, walletData, initialNetwork, t }) => {
  const [selectedNet, setSelectedNet] = useState(initialNetwork || 'TON');
  const [copied, setCopied] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [tonFormat, setTonFormat] = useState('nb');

  const net = ALL_NETWORKS.find(n => n.id === selectedNet) || ALL_NETWORKS[0];

  const getAddress = () => {
    if (selectedNet === 'TON') {
      return tonFormat === 'nb'
        ? (walletData?.addresses?.TON || 'N/A')
        : (walletData?.addresses?.TON_B || 'N/A');
    }
    return walletData?.addresses?.[selectedNet] || 'N/A';
  };

  const address = getAddress();
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(address)}&color=000000&bgcolor=ffffff&margin=15`;

  const copy = () => { navigator.clipboard.writeText(address); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const share = () => { if (navigator.share) navigator.share({ title: `${net.name} Adresim`, text: address }); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '18px', paddingBottom: '120px', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '22px' }}>
        <ChevronLeft size={26} onClick={onBack} style={{ cursor: 'pointer' }} />
        <h2 style={{ fontSize: '1.15rem', fontWeight: '900', margin: '0 auto', transform: 'translateX(-13px)' }}>{t ? t('receive.title') : 'Receive Crypto'}</h2>
      </div>

      {/* Network Selector */}
      <motion.div whileTap={{ scale: 0.98 }} onClick={() => setShowSelector(true)}
        style={{ background: 'var(--bg-card)', padding: '13px 16px', borderRadius: '18px', border: '1px solid var(--glass-border-bright)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', cursor: 'pointer' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '34px', height: '34px', background: net.color + '22', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={net.icon} style={{ width: '20px', height: '20px', borderRadius: '50%' }} alt={net.name} />
          </div>
          <div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: '700' }}>{t ? t('receive.selected_network') : 'SELECTED NETWORK'}</div>
            <div style={{ fontSize: '0.92rem', fontWeight: '900' }}>{net.name}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '6px 10px', borderRadius: '10px', color: 'var(--primary)', fontSize: '0.72rem', fontWeight: '700' }}>
          {t ? t('receive.change') : 'Change'} <ChevronDown size={14} />
        </div>
      </motion.div>

      {/* QR Card */}
      <div style={{ background: '#fff', padding: '24px', borderRadius: '32px', textAlign: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', width: 'fit-content', margin: '0 auto 20px' }}>
        <img src={qrUrl} style={{ width: '180px', height: '180px', display: 'block' }} alt="QR" />
        <div style={{ marginTop: '10px', color: '#000', fontWeight: '900', fontSize: '0.75rem' }}>{net.symbol} · {net.name}</div>
      </div>

      {/* Address Box */}
      <div style={{ background: 'var(--bg-card)', borderRadius: '20px', padding: '18px', border: '1px solid var(--glass-border-bright)', marginBottom: '16px' }}>
        <div style={{ fontSize: '0.62rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '8px', textAlign: 'center' }}>{net.name.toUpperCase()} {t ? t('receive.your_address') : 'ADDRESS'}</div>
        <div style={{ fontSize: '0.78rem', wordBreak: 'break-all', fontWeight: '600', textAlign: 'center', color: '#fff', lineHeight: 1.5 }}>{address}</div>
        
        {selectedNet === 'BTC' && (
          <div style={{ marginTop: '12px', padding: '10px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)', fontSize: '0.68rem', color: '#fbbf24', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}>
              <Info size={14} /> Native SegWit (bc1q)
            </div>
            <span>{t ? t('receive.btc_native_segwit_note') || 'Bu adres Native SegWit formatındadır. Borsa üzerinden gönderim yaparken işlem ağının "BTC" (Native SegWit / p2wpkh) olarak seçildiğinden emin olun.' : 'This is a Native Segwit (bc1q) address. Please send only via Native Segwit network.'}</span>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
        <button onClick={copy} style={{ padding: '15px', background: copied ? '#22c55e' : 'var(--primary)', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: '900', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.3s' }}>
          {copied ? <Check size={18} /> : <Copy size={18} />} {copied ? (t ? t('receive.copied') : 'Copied!') : (t ? t('receive.copy') : 'Copy')}
        </button>
        <button onClick={share} style={{ padding: '15px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--glass-border)', borderRadius: '16px', fontWeight: '900', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
          <Share2 size={18} /> {t ? t('receive.share') : 'Share'}
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', opacity: 0.25 }}>
        <ShieldCheck size={14} /><span style={{ fontSize: '0.65rem', fontWeight: '700' }}>QAI SECURE ENCRYPTION</span>
      </div>

      {/* Network Selector Modal */}
      <AnimatePresence>
        {showSelector && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 2000, display: 'flex', alignItems: 'flex-end' }}
            onClick={() => setShowSelector(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              style={{ width: '100%', background: 'var(--bg-main)', borderRadius: '28px 28px 0 0', padding: '24px 18px 36px', border: '1px solid var(--glass-border-bright)' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ width: '36px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', margin: '0 auto 20px' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '18px', textAlign: 'center' }}>{t ? t('receive.select_network') : 'Select Network'}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', maxHeight: '380px', overflowY: 'auto' }}>
                {ALL_NETWORKS.map(n => (
                  <motion.div key={n.id} whileTap={{ scale: 0.95 }}
                    onClick={() => { setSelectedNet(n.id); setShowSelector(false); }}
                    style={{ padding: '12px 8px', background: selectedNet === n.id ? 'rgba(124,58,237,0.15)' : 'rgba(255,255,255,0.02)', borderRadius: '16px', border: selectedNet === n.id ? '1px solid var(--primary)' : '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <img src={n.icon} style={{ width: '28px', height: '28px', borderRadius: '50%' }} alt={n.name} />
                    <span style={{ fontSize: '0.68rem', fontWeight: '900', textAlign: 'center' }}>{n.name}</span>
                    <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{n.symbol}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ReceiveScreen;
