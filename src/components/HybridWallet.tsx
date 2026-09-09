import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TasteMarket, MarketPair } from './TasteMarket';
import { TasteBorsa } from './TasteBorsa';
import { WalletTransfer } from './WalletTransfer';
import { TrendingUp, ArrowLeftRight, Wallet, Coins, Lock, Sparkles, Clock } from 'lucide-react';
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

  return (
    <div style={{ paddingBottom: '70px', position: 'relative' }}>
      {/* ── Hibrid Borsa, Cüzdan & Staking Üst/İç Navigasyon Çubuğu ── */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(12px)',
        padding: '8px 0 12px',
        marginBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '16px',
          padding: '4px',
          gap: '4px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* 1. Market Sekmesi */}
          <button
            onClick={() => setActiveTab('market')}
            style={{
              padding: '10px 0',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'market' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'transparent',
              color: activeTab === 'market' ? '#fff' : '#94a3b8',
              fontWeight: 800,
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <TrendingUp size={15} />
            <span>{t('hybrid_wallet.market', 'Market')}</span>
          </button>

          {/* 2. Borsa Sekmesi */}
          <button
            onClick={() => setActiveTab('borsa')}
            style={{
              padding: '10px 0',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'borsa' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
              color: activeTab === 'borsa' ? '#000' : '#94a3b8',
              fontWeight: 900,
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeftRight size={15} />
            <span>{t('hybrid_wallet.exchange', 'Borsa')}</span>
          </button>

          {/* 3. Cüzdan Sekmesi */}
          <button
            onClick={() => setActiveTab('wallet')}
            style={{
              padding: '10px 0',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'wallet' ? 'linear-gradient(135deg, #10b981, #047857)' : 'transparent',
              color: activeTab === 'wallet' ? '#fff' : '#94a3b8',
              fontWeight: 800,
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <Wallet size={15} />
            <span>{t('hybrid_wallet.wallet', 'Cüzdan')}</span>
          </button>

          {/* 4. Staking Sekmesi (Yakında Notu İle) */}
          <button
            onClick={() => setActiveTab('staking')}
            style={{
              padding: '10px 0',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'staking' ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' : 'transparent',
              color: activeTab === 'staking' ? '#fff' : '#94a3b8',
              fontWeight: 800,
              fontSize: '11px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
          >
            <Coins size={15} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <span>{t('hybrid_wallet.staking', 'Staking')}</span>
              <span style={{ fontSize: '8px', background: '#f59e0b', color: '#000', padding: '1px 3px', borderRadius: '4px', fontWeight: 900 }}>
                {t('hybrid_wallet.staking_soon_badge_short', 'YAKINDA')}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* ── Sekme İçerikleri ── */}
      <AnimatePresence mode="wait">
        {activeTab === 'market' && (
          <motion.div
            key="market"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <TasteMarket onSelectPair={handleSelectPairFromMarket} />
          </motion.div>
        )}

        {activeTab === 'borsa' && (
          <motion.div
            key="borsa"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <TasteBorsa
              initialPair={selectedPair}
              onNavigateToWallet={() => setActiveTab('wallet')}
            />
          </motion.div>
        )}

        {activeTab === 'wallet' && (
          <motion.div
            key="wallet"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <WalletTransfer
              onNavigateToBorsa={() => setActiveTab('borsa')}
            />
          </motion.div>
        )}

        {activeTab === 'staking' && (
          <motion.div
            key="staking"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              padding: '16px 8px 30px',
              textAlign: 'center'
            }}
          >
            <div style={{
              background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.12) 0%, rgba(15, 23, 42, 0.6) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '24px',
              padding: '30px 20px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)'
              }}>
                <Coins size={32} color="#fff" />
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                padding: '4px 12px',
                borderRadius: '16px',
                color: '#fbbf24',
                fontSize: '11px',
                fontWeight: 900,
                marginBottom: '12px'
              }}>
                <Clock size={13} />
                <span>{t('hybrid_wallet.staking_soon_badge', 'ÇOK YAKINDA BAŞLIYOR — DAHA BAŞLAMADIK')}</span>
              </div>

              <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>
                {t('hybrid_wallet.staking_title', 'TASTE AI & TON Staking')}
              </h2>

              <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6, maxWidth: '380px', margin: '0 auto 24px' }}>
                {t('hybrid_wallet.staking_desc', 'TAI tokenlarınızı akıllı sözleşmelerde kilitleyerek günlük pasif getiri ve yüksek APY ödülleri kazanın. Akıllı kontrat güvenlik denetimleri tamamlandıktan sonra aktif edilecektir.')}
              </p>

              {/* Tahmini Getiri Kartları */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>{t('hybrid_wallet.staking_flexible_pool', 'Esnek Havuz')}</div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#10b981', marginTop: '4px' }}>%18 APY</div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{t('hybrid_wallet.staking_flexible_desc', 'İstediğin an çek')}</div>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>{t('hybrid_wallet.staking_locked_pool', '90 Gün Kilitli')}</div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#f59e0b', marginTop: '4px' }}>%42 APY</div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{t('hybrid_wallet.staking_locked_desc', 'Maksimum Getiri')}</div>
                </div>
              </div>

              <button
                disabled
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#94a3b8',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Lock size={15} />
                <span>{t('hybrid_wallet.staking_btn_disabled', 'Geliştirme Aşamasında (Yakında)')}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
