import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TasteMarket, MarketPair } from './TasteMarket';
import { TasteBorsa } from './TasteBorsa';
import { WalletTransfer } from './WalletTransfer';
import { TrendingUp, ArrowLeftRight, Wallet, Coins, Lock, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface HybridWalletProps {
  onBackToAppHome?: () => void;
}

export const HybridWallet: React.FC<HybridWalletProps> = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'market' | 'borsa' | 'wallet' | 'staking'>('wallet');
  const [selectedPair, setSelectedPair] = useState<MarketPair | undefined>(undefined);

  const handleSelectPairFromMarket = (pair: MarketPair) => {
    setSelectedPair(pair);
    setActiveTab('borsa');
  };

  const openJVault = () => {
    const url = 'https://jvault.xyz/staking/v2/stake/TASTEAI';
    if (window.Telegram?.WebApp) window.Telegram.WebApp.openLink(url);
    else window.open(url, '_blank');
  };

  return (
    <div style={{ paddingBottom: '70px', position: 'relative' }}>
      {/* ── Üst Navigasyon ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(12px)',
        padding: '8px 0 12px', marginBottom: '16px',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          background: 'rgba(255,255,255,0.04)', borderRadius: '16px',
          padding: '4px', gap: '4px', border: '1px solid rgba(255,255,255,0.08)'
        }}>
          {/* Market */}
          <button onClick={() => setActiveTab('market')} style={{
            padding: '10px 0', borderRadius: '12px', border: 'none',
            background: activeTab === 'market' ? 'linear-gradient(135deg,#2563eb,#1d4ed8)' : 'transparent',
            color: activeTab === 'market' ? '#fff' : '#94a3b8',
            fontWeight: 800, fontSize: '11px', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transition: 'all 0.2s'
          }}>
            <TrendingUp size={15} />
            <span>{t('hybrid_wallet.market', 'Market')}</span>
          </button>

          {/* Borsa */}
          <button onClick={() => setActiveTab('borsa')} style={{
            padding: '10px 0', borderRadius: '12px', border: 'none',
            background: activeTab === 'borsa' ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'transparent',
            color: activeTab === 'borsa' ? '#000' : '#94a3b8',
            fontWeight: 900, fontSize: '11px', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transition: 'all 0.2s'
          }}>
            <ArrowLeftRight size={15} />
            <span>{t('hybrid_wallet.exchange', 'Borsa')}</span>
          </button>

          {/* Cüzdan */}
          <button onClick={() => setActiveTab('wallet')} style={{
            padding: '10px 0', borderRadius: '12px', border: 'none',
            background: activeTab === 'wallet' ? 'linear-gradient(135deg,#10b981,#047857)' : 'transparent',
            color: activeTab === 'wallet' ? '#fff' : '#94a3b8',
            fontWeight: 800, fontSize: '11px', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', transition: 'all 0.2s'
          }}>
            <Wallet size={15} />
            <span>{t('hybrid_wallet.wallet', 'Cüzdan')}</span>
          </button>

          {/* Staking — CANLI */}
          <button onClick={() => setActiveTab('staking')} style={{
            padding: '10px 0', borderRadius: '12px', border: 'none',
            background: activeTab === 'staking' ? 'linear-gradient(135deg,#8b5cf6,#6d28d9)' : 'transparent',
            color: activeTab === 'staking' ? '#fff' : '#94a3b8',
            fontWeight: 800, fontSize: '11px', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
            position: 'relative', transition: 'all 0.2s'
          }}>
            <Coins size={15} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <span>{t('hybrid_wallet.staking', 'Staking')}</span>
              <span style={{ fontSize: '8px', background: '#22c55e', color: '#000', padding: '1px 3px', borderRadius: '4px', fontWeight: 900 }}>
                {t('hybrid_wallet.staking_live_badge_short', 'CANLI')}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* ── İçerikler ── */}
      <AnimatePresence mode="wait">
        {activeTab === 'market' && (
          <motion.div key="market" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <TasteMarket onSelectPair={handleSelectPairFromMarket} />
          </motion.div>
        )}
        {activeTab === 'borsa' && (
          <motion.div key="borsa" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <TasteBorsa initialPair={selectedPair} onNavigateToWallet={() => setActiveTab('wallet')} />
          </motion.div>
        )}
        {activeTab === 'wallet' && (
          <motion.div key="wallet" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
            <WalletTransfer onNavigateToBorsa={() => setActiveTab('borsa')} />
          </motion.div>
        )}

        {activeTab === 'staking' && (
          <motion.div key="staking" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
            style={{ padding: '4px 4px 30px' }}>

            {/* 🟢 CANLI Rozeti */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)',
                borderRadius: 20, padding: '5px 14px', color: '#22c55e', fontSize: 12, fontWeight: 900
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
                {t('hybrid_wallet.staking_live_badge', 'CANLI — JVault Staking Havuzu Aktif!')}
              </span>
            </div>

            {/* Başlık Kartı */}
            <div style={{
              background: 'linear-gradient(135deg,rgba(139,92,246,0.15),rgba(109,40,217,0.08))',
              border: '1px solid rgba(139,92,246,0.3)', borderRadius: 20, padding: '20px 16px',
              marginBottom: 14, textAlign: 'center'
            }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 4 }}>🔮 TASTE AI Staking</div>
              <div style={{ fontSize: 12, color: '#c4b5fd' }}>
                {t('hybrid_wallet.staking_powered', 'JVault tarafından desteklenmektedir • TAI kilitle, TAI kazan')}
              </div>
            </div>

            {/* 4 Dönem Kartları */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              {[
                { label: t('hybrid_wallet.pool_14d', '14 Gün'), mult: 'x1',   fee: '%5', color: '#60a5fa' },
                { label: t('hybrid_wallet.pool_30d', '30 Gün'), mult: 'x1.5', fee: '%7', color: '#34d399' },
                { label: t('hybrid_wallet.pool_90d', '90 Gün'), mult: 'x2.5', fee: '%7', color: '#f59e0b' },
                { label: t('hybrid_wallet.pool_120d','120 Gün'),mult: 'x4',   fee: '%7', color: '#f87171' },
              ].map((p) => (
                <div key={p.label} style={{
                  background: 'rgba(255,255,255,0.04)', border: `1px solid ${p.color}40`,
                  borderRadius: 14, padding: '12px 10px', textAlign: 'center'
                }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, marginBottom: 4 }}>{p.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: p.color }}>{p.mult}</div>
                  <div style={{ fontSize: 10, color: '#64748b', marginTop: 3 }}>
                    {t('hybrid_wallet.unstake_fee', 'Erken çıkış')}: {p.fee}
                  </div>
                </div>
              ))}
            </div>

            {/* Min/Max */}
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, padding: '10px 14px', marginBottom: 14,
              display: 'flex', justifyContent: 'space-between'
            }}>
              <div style={{ fontSize: 11 }}>
                <div style={{ color: '#94a3b8', fontWeight: 700, marginBottom: 2, fontSize: 10 }}>{t('hybrid_wallet.min_deposit','Min. Yatırım')}</div>
                <span style={{ color: '#e2e8f0', fontWeight: 800 }}>50 TAI</span>
              </div>
              <div style={{ fontSize: 11, textAlign: 'right' }}>
                <div style={{ color: '#94a3b8', fontWeight: 700, marginBottom: 2, fontSize: 10 }}>{t('hybrid_wallet.max_deposit','Max. Yatırım')}</div>
                <span style={{ color: '#e2e8f0', fontWeight: 800 }}>500,000 TAI</span>
              </div>
            </div>

            {/* JVault Butonu */}
            <button onClick={openJVault} style={{
              width: '100%', padding: '15px', borderRadius: 14, border: 'none',
              background: 'linear-gradient(135deg,#8b5cf6,#6d28d9)',
              color: '#fff', fontSize: 14, fontWeight: 900, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 20px rgba(139,92,246,0.4)'
            }}>
              <Coins size={18} />
              <span>{t('hybrid_wallet.stake_now_btn', 'Şimdi Stake Et — JVault')}</span>
            </button>
            <div style={{ fontSize: 10, color: '#475569', textAlign: 'center', marginTop: 8 }}>
              jvault.xyz · {t('hybrid_wallet.on_chain_secured', 'On-chain güvenceli akıllı kontrat')}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
