import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, CheckCircle2, ArrowRight, Percent, Gem, AlertTriangle, ExternalLink, Zap } from 'lucide-react';
import { WALLET_CONFIG } from '../config';
import { sendEVM, sendTonFull } from '../blockchainService';

const scoreToken = async (contract) => {
  try {
    const r = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${contract}`);
    const d = await r.json();
    if (!d.pairs || d.pairs.length === 0) return { score: 20, liquidity: 0, volume: 0, poolAddress: '', mcap: 0 };
    const pair = d.pairs[0];
    const liq = parseFloat(pair.liquidity?.usd) || 0;
    const vol = parseFloat(pair.volume?.h24) || 0;
    const mcap = pair.marketCap || 0;
    let score = 40;
    if (liq > 100000) score += 25; else if (liq > 10000) score += 15; else if (liq < 1000) score -= 20;
    if (vol > 50000) score += 15; else if (vol > 5000) score += 8;
    if (mcap > 0 && liq > 0 && liq / mcap > 0.05) score += 10;
    return { score: Math.max(0, Math.min(100, score)), liquidity: liq, volume: vol, poolAddress: pair.pairAddress || '', mcap, symbol: pair.baseToken?.symbol || '', name: pair.baseToken?.name || '' };
  } catch { return { score: 30, liquidity: 0, volume: 0, poolAddress: '', mcap: 0, symbol: '', name: '' }; }
};

const tiers = {
  TIER_1: { name: 'Standart', price: 0, label: 'Ücretsiz', desc: 'Cüzdana ekle, kendi tanıtımını yap', badge: null },
  TIER_2: { name: 'Öne Çıkan', price: 25, label: '$25', desc: '24 saat "QAI\'de Trend Olanlar" listesinde', badge: 'TREND' },
  TIER_3: { name: 'VIP Premium', price: 50, label: '$50', desc: '48 saat öne çıkarılmış + öncelikli onay', badge: 'VIP' },
};

const ListingScreen = ({ onBack, walletData, livePrices, balances, t }) => {
  const [step, setStep] = useState(1);
  const [tokenData, setTokenData] = useState({ network: 'TON', contract: '', symbol: '', name: '', website: '', telegram: '', twitter: '' });
  const [selectedTier, setSelectedTier] = useState('TIER_1');
  const [paymentMethod, setPaymentMethod] = useState('TON');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [scoring, setScoring] = useState(false);
  const [scoreData, setScoreData] = useState(null);
  const [contactMsg, setContactMsg] = useState('');

  useEffect(() => {
    if (tokenData.contract.length < 10) return;
    const t = setTimeout(async () => {
      setScoring(true);
      const res = await scoreToken(tokenData.contract);
      setScoreData(res);
      setScoring(false);
      
      // CA girildiğinde symbol ve name varsa otomatik doldur!
      if (res.symbol && !tokenData.symbol) {
        setTokenData(p => ({ ...p, symbol: res.symbol, name: res.name || p.name }));
      }
    }, 1000);
    return () => clearTimeout(t);
  }, [tokenData.contract]);

  const paymentOptions = [
    { id: 'toncoin', name: 'Toncoin', icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ton/info/logo.png' },
    { id: 'binancecoin', name: 'BNB', icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png' },
    { id: 'ethereum', name: 'Ethereum', icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
    { id: 'taste', name: 'TASTE AI', icon: 'https://storage.dyor.io/jettons/EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-/image.jpeg', discount: 15 },
  ];

  const getFinalPrice = () => {
    const base = tiers[selectedTier].price;
    if (base === 0) return 0;
    if (paymentMethod === 'taste') return base * 0.85;
    return base;
  };

  const saveListing = (plan, txHash = '') => {
    const listing = { id: Date.now(), ...tokenData, plan, tier: selectedTier, status: plan === 'free' ? 'approved' : 'pending', riskScore: scoreData?.score || 50, liquidity: scoreData?.liquidity || 0, poolAddress: scoreData?.poolAddress || '', mcap: scoreData?.mcap || 0, txHash, contactMsg, createdAt: Date.now() };
    const all = JSON.parse(localStorage.getItem('user_listings') || '[]');
    localStorage.setItem('user_listings', JSON.stringify([listing, ...all]));
  };

  const handlePayment = async () => {
    if (tiers[selectedTier].price === 0) { saveListing('free'); setStep(5); return; }
    setLoading(true); setError('');
    try {
      const finalUSD = getFinalPrice();
      const payToken = WALLET_CONFIG.TOKENS.find(t => t.id === paymentMethod) || WALLET_CONFIG.TOKENS.find(t => t.networkKey === paymentMethod);
      if (!payToken) throw new Error('Ödeme yöntemi bulunamadı');
      
      const pPrice = livePrices?.[payToken.id] || 1;
      const priceInToken = finalUSD / pPrice;
      const currentBal = balances?.[payToken.id] || 0;
      
      if (currentBal < priceInToken) {
        throw new Error(`Yetersiz Bakiye! Gerekli: ${priceInToken.toFixed(4)} ${payToken.symbol}, Mevcut: ${currentBal.toFixed(4)} ${payToken.symbol}`);
      }

      const treasury = WALLET_CONFIG.RECEIVERS[payToken.networkKey] || WALLET_CONFIG.RECEIVERS.EVM;
      
      if (payToken.networkKey === 'TON') {
        await sendTonFull(walletData.mnemonic, treasury, priceInToken);
      } else {
        const { getEvmPrivateKey } = await import('../walletService');
        const rpc = WALLET_CONFIG.RPC_NODES[payToken.networkKey]?.[0] || WALLET_CONFIG.RPC_NODES.ETH[0];
        const privKey = await getEvmPrivateKey(walletData.mnemonic);
        await sendEVM(privKey, treasury, priceInToken.toString(), rpc, null);
      }
      saveListing(selectedTier === 'TIER_2' ? 'trend' : 'vip');
      setStep(5);
    } catch (e) { setError(e.message || 'Odeme basarisiz'); }
    setLoading(false);
  };

  const scoreColor = scoreData ? (scoreData.score > 70 ? '#22c55e' : scoreData.score > 40 ? '#f59e0b' : '#ef4444') : 'var(--text-muted)';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ minHeight: '100vh', paddingBottom: '100px', overflowY: 'auto' }}>
      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
          <div onClick={onBack} style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '14px', cursor: 'pointer' }}>
            <ChevronLeft size={20} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '900' }}>{t('listing.title')}</h2>
            <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t('listing.subtitle')}</p>
          </div>
        </div>

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.1),rgba(236,72,153,0.08))', padding: '20px', borderRadius: '22px', border: '1px solid rgba(124,58,237,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <Gem size={22} color="#f472b6" />
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '900' }}>{t('listing.expand')}</h3>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{t('listing.expand_desc')}</p>
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '18px', borderRadius: '20px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '6px' }}>{t('listing.network')}</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                  {['TON', 'BNB', 'ETH', 'ARB', 'BASE', 'MATIC', 'MONAD'].map(n => (
                    <button key={n} onClick={() => setTokenData(p => ({ ...p, network: n }))}
                      style={{ padding: '6px 12px', borderRadius: '9px', border: 'none', fontSize: '0.72rem', fontWeight: '700', cursor: 'pointer', background: tokenData.network === n ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: tokenData.network === n ? '#fff' : 'var(--text-muted)' }}>{n}</button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
                  {t('listing.contract')} {scoring && <span style={{ color: 'var(--primary)' }}>{t('listing.analyzing')}</span>}
                </label>
                <input value={tokenData.contract} onChange={e => setTokenData(p => ({ ...p, contract: e.target.value.trim() }))} placeholder="0x... veya TON adresi"
                  style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '12px 14px', borderRadius: '13px', color: '#fff', fontSize: '0.85rem', outline: 'none' }} />
              </div>
              {scoreData && (
                <div style={{ background: `rgba(${scoreData.score > 70 ? '34,197,94' : scoreData.score > 40 ? '245,158,11' : '239,68,68'},0.08)`, borderRadius: '14px', padding: '14px', border: `1px solid rgba(${scoreData.score > 70 ? '34,197,94' : scoreData.score > 40 ? '245,158,11' : '239,68,68'},0.2)` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)' }}>{t('listing.analytics')}</span>
                    <span style={{ fontSize: '1.1rem', fontWeight: '900', color: scoreColor }}>{scoreData.score}/100</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.7rem' }}>
                    <div><span style={{ color: 'var(--text-muted)' }}>Likidite: </span><span style={{ fontWeight: '700' }}>${(scoreData.liquidity / 1000).toFixed(1)}k</span></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Hacim: </span><span style={{ fontWeight: '700' }}>${(scoreData.volume / 1000).toFixed(1)}k</span></div>
                  </div>
                  {scoreData.poolAddress && (
                    <a href={`https://dexscreener.com/search?q=${scoreData.poolAddress}`} target="_blank" rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', fontSize: '0.65rem', marginTop: '8px', textDecoration: 'none' }}>
                      <ExternalLink size={11} /> {t('listing.view_pool')}
                    </a>
                  )}
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '6px' }}>{t('listing.symbol')}</label>
                  <input value={tokenData.symbol} onChange={e => setTokenData(p => ({ ...p, symbol: e.target.value }))} placeholder="PEPE"
                    style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '12px 14px', borderRadius: '13px', color: '#fff', fontSize: '0.85rem', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '6px' }}>{t('listing.token_name')}</label>
                  <input value={tokenData.name} onChange={e => setTokenData(p => ({ ...p, name: e.target.value }))} placeholder="Pepe Coin"
                    style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '12px 14px', borderRadius: '13px', color: '#fff', fontSize: '0.85rem', outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '6px' }}>{t('listing.website')}</label>
                <input value={tokenData.website} onChange={e => setTokenData(p => ({ ...p, website: e.target.value }))} placeholder="https://..."
                  style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '12px 14px', borderRadius: '13px', color: '#fff', fontSize: '0.85rem', outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '6px' }}>{t('listing.telegram')}</label>
                  <input value={tokenData.telegram} onChange={e => setTokenData(p => ({ ...p, telegram: e.target.value }))} placeholder="@..."
                    style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '12px 14px', borderRadius: '13px', color: '#fff', fontSize: '0.85rem', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '6px' }}>{t('listing.twitter')}</label>
                  <input value={tokenData.twitter} onChange={e => setTokenData(p => ({ ...p, twitter: e.target.value }))} placeholder="@..."
                    style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '12px 14px', borderRadius: '13px', color: '#fff', fontSize: '0.85rem', outline: 'none' }} />
                </div>
              </div>
            </div>
            <button disabled={!tokenData.contract || !tokenData.symbol} onClick={() => setStep(2)}
              style={{ width: '100%', padding: '18px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '18px', fontWeight: '900', fontSize: '1rem', cursor: 'pointer', opacity: (!tokenData.contract || !tokenData.symbol) ? 0.5 : 1 }}>
              {t('listing.continue')} <ArrowRight size={16} style={{ verticalAlign: 'middle', marginLeft: '4px' }} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.1rem' }}>{t('listing.select_tier')}</h3>
            {Object.entries(tiers).map(([key, tier]) => (
              <div key={key} onClick={() => setSelectedTier(key)}
                style={{ background: selectedTier === key ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.02)', border: selectedTier === key ? '1px solid var(--primary)' : '1px solid var(--glass-border)', padding: '18px', borderRadius: '20px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
                {tier.badge && <div style={{ position: 'absolute', top: 0, right: 0, background: key === 'TIER_2' ? '#6366f1' : '#f59e0b', color: '#fff', fontSize: '0.58rem', fontWeight: '900', padding: '4px 12px', borderBottomLeftRadius: '12px' }}>{tier.badge}</div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: '900', color: selectedTier === key ? 'var(--primary)' : '#fff' }}>{tier.name}</h4>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{tier.desc}</p>
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: '900', color: tier.price === 0 ? '#22c55e' : '#fff', flexShrink: 0, marginLeft: '12px' }}>{tier.label}</div>
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(1)} style={{ padding: '16px', background: 'transparent', color: '#fff', border: '1px solid var(--glass-border)', borderRadius: '16px', fontWeight: '900', flex: 0.35, cursor: 'pointer' }}>{t('listing.back')}</button>
              <button onClick={() => tiers[selectedTier].price === 0 ? (saveListing('free'), setStep(5)) : setStep(3)}
                style={{ padding: '16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: '900', flex: 0.65, cursor: 'pointer' }}>
                {tiers[selectedTier].price === 0 ? t('listing.free_apply') : t('listing.payment_step')}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'var(--bg-card)', padding: '22px', borderRadius: '20px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{t('listing.total_pay')}</div>
              <div style={{ fontSize: '2.2rem', fontWeight: '900' }}>${getFinalPrice()}</div>
              {(paymentMethod === 'taste') && <div style={{ fontSize: '0.72rem', color: '#22c55e', marginTop: '4px' }}>{t('listing.discount_msg')}</div>}
            </div>
            <h4 style={{ margin: 0, fontSize: '0.82rem', fontWeight: '900', color: 'var(--text-muted)' }}>{t('listing.payment_method')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {paymentOptions.map(opt => (
                <div key={opt.id} onClick={() => setPaymentMethod(opt.id)}
                  style={{ background: paymentMethod === opt.id ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.02)', border: paymentMethod === opt.id ? '1px solid var(--primary)' : '1px solid var(--glass-border)', padding: '14px 16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={opt.icon} style={{ width: '28px', height: '28px', borderRadius: '50%' }} alt={opt.name} />
                    <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{opt.name}</span>
                  </div>
                  {opt.discount && <div style={{ background: 'linear-gradient(90deg,#ec4899,#8b5cf6)', padding: '4px 10px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '4px' }}><Percent size={11} /> %{opt.discount} INDIRIM</div>}
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
              <label style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', display: 'block', marginBottom: '8px' }}>{t('listing.contact_note')}</label>
              <textarea value={contactMsg} onChange={e => setContactMsg(e.target.value)} placeholder={t('listing.contact_placeholder')} rows={3}
                style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', fontSize: '0.82rem', outline: 'none', resize: 'none' }} />
            </div>
            {error && <div style={{ padding: '12px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '12px', fontSize: '0.78rem' }}>{error}</div>}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setStep(2)} style={{ padding: '16px', background: 'transparent', color: '#fff', border: '1px solid var(--glass-border)', borderRadius: '16px', fontWeight: '900', flex: 0.35, cursor: 'pointer' }}>{t('listing.back')}</button>
              <button onClick={handlePayment} disabled={loading}
                style={{ padding: '16px', background: 'linear-gradient(90deg,#10b981,#059669)', color: '#fff', border: 'none', borderRadius: '16px', fontWeight: '900', flex: 0.65, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? t('listing.processing') : t('listing.confirm_pay')}
              </button>
            </div>
          </div>
        )}

        {step === 5 && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '40px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '18px' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16,185,129,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <CheckCircle2 color="#10b981" size={40} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', margin: 0 }}>{t('listing.request_received')}</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.85rem', margin: 0 }}>
              {tiers[selectedTier].price === 0 ? t('listing.success_free') : t('listing.success_paid')}
            </p>
            {tiers[selectedTier].price > 0 && (
              <div style={{ background: 'rgba(99,102,241,0.08)', padding: '14px 18px', borderRadius: '16px', border: '1px solid rgba(99,102,241,0.2)', fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'left', width: '100%' }}>
                <div style={{ fontWeight: '900', color: '#fff', marginBottom: '6px' }}>{t('listing.next_steps')}</div>
                <div>{t('listing.step_review')}</div>
                <div>{t('listing.step_trend')}</div>
              </div>
            )}
            <button onClick={onBack} style={{ padding: '16px 40px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '18px', fontWeight: '900', cursor: 'pointer' }}>{t('listing.back_home')}</button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ListingScreen;