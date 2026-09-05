import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TasteMarket, MarketPair } from './TasteMarket';
import { TasteBorsa } from './TasteBorsa';
import { WalletTransfer } from './WalletTransfer';
import { TrendingUp, ArrowLeftRight, Wallet } from 'lucide-react';

interface HybridWalletProps {
  onBackToAppHome?: () => void;
}

export const HybridWallet: React.FC<HybridWalletProps> = () => {
  const [activeTab, setActiveTab] = useState<'market' | 'borsa' | 'wallet'>('wallet');
  const [selectedPair, setSelectedPair] = useState<MarketPair | undefined>(undefined);

  const handleSelectPairFromMarket = (pair: MarketPair) => {
    setSelectedPair(pair);
    setActiveTab('borsa');
  };

  return (
    <div style={{ paddingBottom: '70px', position: 'relative' }}>
      {/* ── Hibrid Borsa & Cüzdan Üst/İç Navigasyon Çubuğu ── */}
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
          gridTemplateColumns: 'repeat(3, 1fr)',
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
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <TrendingUp size={16} />
            <span>Market</span>
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
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <ArrowLeftRight size={16} />
            <span>Borsa</span>
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
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Wallet size={16} />
            <span>Cüzdan</span>
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
      </AnimatePresence>
    </div>
  );
};
