import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Check, ChevronRight, AlertCircle } from 'lucide-react';
import { sendEVM, sendTonFull } from '../blockchainService';
import { WALLET_CONFIG } from '../config';

const POOLS = [
  { id: 'ethereum',     symbol: 'ETH',  name: 'Ethereum',    icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png',  network: 'EVM', networkKey: 'ETH',   minAmount: 0.01, tiers: { 7: 3.2,  14: 3.4,  30: 3.8,  90: 4.5,  180: 5.2  }, provider: 'Lido / Rocket Pool',  color: '#627EEA' },
  { id: 'binancecoin',  symbol: 'BNB',  name: 'BNB Chain',   icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png',   network: 'EVM', networkKey: 'BNB',   minAmount: 0.01, tiers: { 7: 5.1,  14: 5.4,  30: 5.9,  90: 6.8,  180: 7.5  }, provider: 'BNB Vault',           color: '#F3BA2F' },
  { id: 'toncoin',      symbol: 'TON',  name: 'TON Network', icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ton/info/logo.png',       network: 'TON', networkKey: 'TON',   minAmount: 5,    tiers: { 7: 4.8,  14: 5.1,  30: 5.5,  90: 6.5,  180: 7.2  }, provider: 'TON Foundation',      color: '#0098EA' },
  { id: 'matic-network',symbol: 'MATIC',name: 'Polygon',     icon: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png',   network: 'EVM', networkKey: 'MATIC', minAmount: 1,    tiers: { 7: 4.2,  14: 4.5,  30: 5.0,  90: 6.0,  180: 7.0  }, provider: 'Polygon Validators',  color: '#8247E5' },
  { id: 'arbitrum',     symbol: 'ARB',  name: 'Arbitrum',    icon: 'https://assets.coingecko.com/coins/images/29587/small/arbitrum.png',                               network: 'EVM', networkKey: 'ARB',   minAmount: 1,    tiers: { 7: 3.5,  14: 3.8,  30: 4.2,  90: 5.0,  180: 6.0  }, provider: 'ARB Staking',         color: '#28A0F0' },
  { id: 'monad-native', symbol: 'MON',  name: 'Monad',       icon: 'https://assets.coingecko.com/coins/images/35137/standard/monad.jpg', network: 'EVM', networkKey: 'MONAD', minAmount: 1, tiers: { 7: 11.5, 14: 12.0, 30: 13.0, 90: 15.0, 180: 18.0 }, provider: 'Monad Foundation', color: '#836EF9' },
  { id: 'tron',         symbol: 'TRX',  name: 'TRON',        icon: 'https://assets.coingecko.com/coins/images/1094/standard/tron-logo.png', network: 'TRX', networkKey: 'TRX',   minAmount: 100,  tiers: { 7: 4.2,  14: 4.5,  30: 5.0,  90: 6.2,  180: 7.5  }, provider: 'TRON Stake 2.0',      color: '#EF0027' },
  { id: 'solana',       symbol: 'SOL',  name: 'Solana',      icon: 'https://assets.coingecko.com/coins/images/4128/standard/solana.png',    network: 'SOL', networkKey: 'SOL',   minAmount: 0.1,  tiers: { 7: 6.5,  14: 7.0,  30: 7.5,  90: 8.2,  180: 9.0  }, provider: 'Solana Validators',   color: '#14F195' },
  { id: 'bitcoin',      symbol: 'BTC',  name: 'Bitcoin',     icon: 'https://assets.coingecko.com/coins/images/1/standard/bitcoin.png',     network: 'BTC', networkKey: 'BTC',   minAmount: 0.001,tiers: { 7: 1.5,  14: 1.8,  30: 2.2,  90: 3.0,  180: 4.0  }, provider: 'Babylon Staking',     color: '#F7931A' },
];

const DURATIONS = [7, 14, 30, 90, 180];

const Staking = ({ setTab, balances, setBalances, walletData, t }) => {
  const [step, setStep] = useState('list');
  const [pool, setPool] = useState(null);
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');
  const [statusMsg, setStatusMsg] = useState('');

  const userBalance = pool ? (balances[pool.id] || 0) : 0;
  const serviceFee = WALLET_CONFIG.SERVICE_FEE || 0.015;
  const feeAmt = (parseFloat(amount) || 0) * serviceFee;
  const totalRequired = (parseFloat(amount) || 0) + feeAmt;
  const estimatedEarning = (parseFloat(amount) || 0) * (pool?.tiers[duration] / 100) * (duration / 365);

  const handleStake = async () => {
    if (!amount || parseFloat(amount) < pool.minAmount) return setError(`${t('staking.min_amount') || 'Min'}: ${pool.minAmount} ${pool.symbol}`);
    if (totalRequired > userBalance) return setError(t('staking.insufficient'));
    if (!walletData?.mnemonic) return setError(t('staking.not_found'));

    setLoading(true);
    setError('');
    let hash = '';

    try {
      if (pool.network === 'TON') {
        setStatusMsg('TON iÅŸlemi gÃ¶nderiliyor...');
        const toAddr = WALLET_CONFIG.STAKING_POOLS?.TON || WALLET_CONFIG.RECEIVERS.TON;
        hash = await sendTonFull(walletData.mnemonic, toAddr, totalRequired.toString(), `Stake:${pool.symbol}:${duration}d`);
      } else {
        setStatusMsg('EVM iÅŸlemi imzalanÄ±yor...');
        const { getEvmPrivateKey } = await import('../walletService');
        const privKey = await getEvmPrivateKey(walletData.mnemonic);
        const toAddr = WALLET_CONFIG.STAKING_POOLS?.[pool.networkKey] || WALLET_CONFIG.RECEIVERS[pool.networkKey] || WALLET_CONFIG.RECEIVERS.EVM;
        const rpcList = WALLET_CONFIG.RPC_NODES[pool.networkKey] || WALLET_CONFIG.RPC_NODES.ETH;
        hash = await sendEVM(privKey, toAddr, totalRequired.toString(), rpcList[0]);
      }

      setTxHash(hash || 'tx_ok');

      const session = {
        id: Date.now(),
        poolId: pool.id,
        symbol: pool.symbol,
        amount: parseFloat(amount),
        duration,
        apy: pool.tiers[duration],
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + duration * 86400000).toISOString(),
        hash: hash || 'tx_ok',
        status: 'active'
      };
      const saved = JSON.parse(localStorage.getItem('qai_stakes') || '[]');
      localStorage.setItem('qai_stakes', JSON.stringify([...saved, session]));

      setBalances(prev => ({
        ...prev,
        [pool.id]: Math.max(0, (prev[pool.id] || 0) - totalRequired)
      }));

      setStep('success');
    } catch (e) {
      console.error('[Staking Error]', e);
      setError(e.message || 'Ä°ÅŸlem baÅŸarÄ±sÄ±z oldu.');
    } finally {
      setLoading(false);
      setStatusMsg('');
    }
  };

  const activeStakes = JSON.parse(localStorage.getItem('qai_stakes') || '[]').filter(s => s.status === 'active');

  return (
    <div style={{ padding: '15px', paddingBottom: '100px', background: 'var(--bg-main)', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '25px', gap: '15px' }}>
        <ChevronLeft size={28} onClick={() => step === 'list' ? setTab('menu') : setStep('list')} style={{ cursor: 'pointer' }} />
        <h2 style={{ fontSize: '1.4rem', fontWeight: '900', margin: 0 }}>{t ? t('staking.hub') : 'Staking Hub'}</h2>
      </div>

      {/* LIST */}
      {step === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activeStakes.length > 0 && (
            <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.15),rgba(167,139,250,0.08))', padding: '16px 20px', borderRadius: '22px', border: '1px solid rgba(99,102,241,0.25)' }}>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '1px', marginBottom: '4px' }}>{t ? t('staking.active') : 'ACTIVE STAKE'}</div>
              <div style={{ fontSize: '1.3rem', fontWeight: '900' }}>{activeStakes.length} {t ? t('staking.positions') : 'Position(s)'}</div>
            </div>
          )}

          <div style={{ background: 'rgba(99,102,241,0.1)', padding: '14px', borderRadius: '18px', border: '1px solid rgba(99,102,241,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={18} color="var(--primary)" />
              <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: '600' }}>{t ? t('staking.info') : 'Lock your assets and earn high APY.'}</p>
            </div>
          </div>

          {POOLS.map(p => (
            <motion.div key={p.id} whileTap={{ scale: 0.98 }}
              onClick={() => { setPool(p); setStep('detail'); setAmount(''); setError(''); }}
              style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '28px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}>
              <img src={p.icon} style={{ width: '48px', height: '48px', borderRadius: '50%' }} alt={p.symbol} />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 3px 0', fontSize: '1.05rem', fontWeight: '900' }}>{p.name}</h3>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{p.provider}</div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px', fontSize: '0.72rem' }}>
                  <span style={{ color: p.color, fontWeight: '900' }}>{t ? t('staking.up_to') : 'UP TO'} {p.tiers[180]}% APY</span>
                  <span style={{ color: 'var(--text-muted)' }}>{t ? t('staking.balance') : 'Balance:'} {(balances[p.id] || 0).toFixed(4)} {p.symbol}</span>
                </div>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </motion.div>
          ))}
        </div>
      )}

      {/* DETAIL */}
      {step === 'detail' && pool && (
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}>
          <div style={{ background: 'var(--bg-card)', padding: '25px', borderRadius: '32px', border: '1px solid var(--glass-border)', textAlign: 'center', marginBottom: '20px' }}>
            <img src={pool.icon} style={{ width: '72px', height: '72px', borderRadius: '50%', marginBottom: '12px' }} alt={pool.symbol} />
            <h3 style={{ fontSize: '1.7rem', fontWeight: '900', margin: '0 0 4px 0' }}>{pool.symbol}</h3>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{pool.name} Staking</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '16px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 18px', borderRadius: '14px' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t('staking.your_balance')}</div>
                <div style={{ fontWeight: '900' }}>{userBalance.toFixed(4)} {pool.symbol}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px 18px', borderRadius: '14px' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t('staking.min_amount')}</div>
                <div style={{ fontWeight: '900' }}>{pool.minAmount} {pool.symbol}</div>
              </div>
            </div>
          </div>

          {/* SÃ¼re seÃ§imi */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: '900', color: 'var(--text-muted)', display: 'block', marginLeft: '4px', marginBottom: '10px' }}>{t ? t('staking.select_duration') : 'SELECT DURATION'}</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {DURATIONS.map(d => (
                <div key={d} onClick={() => setDuration(d)}
                  style={{ padding: '14px 8px', textAlign: 'center', borderRadius: '18px', cursor: 'pointer', background: duration === d ? 'var(--primary)' : 'var(--bg-card)', border: `1px solid ${duration === d ? 'var(--primary)' : 'var(--glass-border)'}`, transition: 'all 0.2s' }}>
                  <div style={{ fontSize: '0.95rem', fontWeight: '900' }}>{d} {t ? t('staking.days') : 'DAYS'}</div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.85 }}>%{pool.tiers[d]} APY</div>
                </div>
              ))}
            </div>
          </div>

          {/* Miktar */}
          <div style={{ background: 'var(--bg-card)', padding: '22px', borderRadius: '28px', border: '1px solid var(--glass-border)', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontWeight: '900', fontSize: '0.88rem' }}>{t ? t('staking.amount') : 'AMOUNT'}</span>
              <span onClick={() => setAmount((userBalance * 0.99).toFixed(6))} style={{ color: 'var(--primary)', fontSize: '0.8rem', fontWeight: '900', cursor: 'pointer' }}>MAX</span>
            </div>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder={`Min: ${pool.minAmount}`}
              style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '2px solid var(--primary)', fontSize: '1.9rem', fontWeight: '900', color: '#fff', outline: 'none', padding: '8px 0', boxSizing: 'border-box' }} />
            {error && <p style={{ color: '#ef4444', fontSize: '0.78rem', fontWeight: 'bold', marginTop: '10px', margin: '10px 0 0' }}>{error}</p>}
          </div>

          {/* Ã–zet */}
          <div style={{ background: 'rgba(99,102,241,0.05)', padding: '18px', borderRadius: '22px', marginBottom: '16px', border: '1px solid rgba(99,102,241,0.1)' }}>
            {[
              { label: t ? t('staking.service_fee') : 'Service Fee (1.5%)', value: `${feeAmt.toFixed(6)} ${pool.symbol}`, color: null },
              { label: `${t ? t('staking.est_earning') : 'Est. Earning'} (${duration}d)`, value: `+${estimatedEarning.toFixed(6)} ${pool.symbol}`, color: '#22c55e' },
              { label: t ? t('staking.total') : 'Total to Pay', value: `${totalRequired.toFixed(6)} ${pool.symbol}`, color: 'var(--primary)', bold: true },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.83rem', fontWeight: row.bold ? '900' : '500', borderTop: row.bold ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingTop: row.bold ? '10px' : '0' }}>
                <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                <span style={{ color: row.color || '#fff' }}>{row.value}</span>
              </div>
            ))}
          </div>

          {statusMsg && (
            <div style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--primary)', marginBottom: '12px', fontWeight: '700' }}>â³ {statusMsg}</div>
          )}

          <button disabled={loading || !amount || parseFloat(amount) <= 0} onClick={handleStake}
            style={{ width: '100%', padding: '20px', background: loading ? 'rgba(124,58,237,0.5)' : 'var(--primary)', color: '#fff', border: 'none', borderRadius: '24px', fontWeight: '900', fontSize: '1.1rem', boxShadow: '0 10px 25px var(--primary-glow)', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading
              ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '24px', height: '24px', border: '3px solid #fff', borderTopColor: 'transparent', borderRadius: '50%' }} />
              : (t ? t('staking.lock_earn') : 'LOCK & EARN')}
          </button>
        </motion.div>
      )}

      {/* SUCCESS */}
      {step === 'success' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', paddingTop: '40px' }}>
          <div style={{ width: '100px', height: '100px', background: 'rgba(34,197,94,0.1)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 28px' }}>
            <Check size={50} color="#22c55e" />
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '10px' }}>{t ? t('staking.success') : 'Success!'}</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>{t ? t('staking.success_desc') : 'Your assets have been staked successfully.'}</p>

          <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '24px', textAlign: 'left', marginBottom: '20px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{t ? t('staking.summary') : 'Transaction Summary'}</div>
            <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>{amount} {pool.symbol}</div>
            <div style={{ fontSize: '0.88rem', color: 'var(--primary)', fontWeight: 'bold', marginTop: '4px' }}>%{pool.tiers[duration]} APY â€” {duration} {t('staking.days')}</div>
            {txHash && <div style={{ marginTop: '10px', fontSize: '0.6rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>TX: {txHash}</div>}
          </div>

          <button onClick={() => { setStep('list'); setAmount(''); setPool(null); }}
            style={{ width: '100%', padding: '18px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '22px', fontWeight: '900', marginBottom: '10px', cursor: 'pointer' }}>
            {t ? t('staking.new_stake') : 'NEW STAKE'}
          </button>
          <button onClick={() => setTab('home')}
            style={{ width: '100%', padding: '18px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--glass-border)', borderRadius: '22px', fontWeight: '900', cursor: 'pointer' }}>
            {t ? t('staking.back_wallet') : 'BACK TO WALLET'}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default Staking;

