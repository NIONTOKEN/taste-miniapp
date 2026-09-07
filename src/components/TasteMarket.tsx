import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, Star, ArrowUpDown } from 'lucide-react';
import { LogoGRAM, LogoDOGS, LogoUTYA, LogoUSDT, LogoNOT, LogoTAI } from './TokenLogos';
import { fetchLiveTaiPrice } from '../services/stonfiService';

export interface MarketPair {
  id: string;
  base: string;
  quote: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: string;
  high24h: number;
  low24h: number;
  dex: 'STON.fi' | 'DeDust';
  isFavorite?: boolean;
  address?: string;
}

const INITIAL_PAIRS: MarketPair[] = [
  {
    id: 'TAI_GRAM',
    base: 'TAI',
    quote: 'GRAM',
    name: 'Taste AI',
    price: 0.0001778,
    change24h: 5.4,
    volume24h: '$1.45K',
    high24h: 0.000195,
    low24h: 0.000162,
    dex: 'STON.fi',
    address: 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-'
  },
  {
    id: 'TAI_USDT',
    base: 'TAI',
    quote: 'USDT',
    name: 'Taste AI',
    price: 0.000946,
    change24h: 4.8,
    volume24h: '$980',
    high24h: 0.00105,
    low24h: 0.00086,
    dex: 'STON.fi',
    address: 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-'
  },
  {
    id: 'GRAM_USDT',
    base: 'GRAM',
    quote: 'USDT',
    name: 'Gram / Toncoin',
    price: 5.32,
    change24h: 2.1,
    volume24h: '$14.2M',
    high24h: 5.48,
    low24h: 5.18,
    dex: 'STON.fi'
  },
  {
    id: 'DOGS_GRAM',
    base: 'DOGS',
    quote: 'GRAM',
    name: 'Dogs Token',
    price: 0.0000086,
    change24h: -1.8,
    volume24h: '$3.8M',
    high24h: 0.0000092,
    low24h: 0.0000081,
    dex: 'STON.fi',
    address: 'EQCvxJy4eG8hyHBFsZ7eePxrRsUQSFE_jpptRAYBmcG_DOGS'
  },
  {
    id: 'NOT_GRAM',
    base: 'NOT',
    quote: 'GRAM',
    name: 'Notcoin',
    price: 0.0000862,
    change24h: 3.6,
    volume24h: '$8.4M',
    high24h: 0.000091,
    low24h: 0.000082,
    dex: 'STON.fi',
    address: 'EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT'
  },
  {
    id: 'UTYA_GRAM',
    base: 'UTYA',
    quote: 'GRAM',
    name: 'Utya Duck',
    price: 0.00503,
    change24h: 1.2,
    volume24h: '$850K',
    high24h: 0.0054,
    low24h: 0.0048,
    dex: 'STON.fi',
    address: 'EQBaCgUwOoc6gHCNln_oJzb0mVs79YG7wYoavh-o1ItaneLA'
  }
];

interface TasteMarketProps {
  onSelectPair?: (pair: MarketPair) => void;
}

export const TasteMarket: React.FC<TasteMarketProps> = ({ onSelectPair }) => {
  const { t } = useTranslation();
  const [pairs, setPairs] = useState<MarketPair[]>(INITIAL_PAIRS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'TAI' | 'GRAM' | 'USDT'>('TAI');
  const [filterType, setFilterType] = useState<'all' | 'fav' | 'gainers'>('all');
  const [favorites, setFavorites] = useState<string[]>(['TAI_GRAM', 'TAI_USDT']);
  const [sortField, setSortField] = useState<'price' | 'change' | 'volume'>('change');
  const [sortAsc, setSortAsc] = useState(false);

  // STON.fi canlı havuz rezervinden TAI gerçek fiyatını ve TON ekosistem verilerini çek
  useEffect(() => {
    let isMounted = true;
    const fetchMarketData = async () => {
      try {
        const taiData = await fetchLiveTaiPrice();
        if (isMounted && taiData) {
          setPairs(prev => prev.map(p => {
            if (p.id === 'TAI_GRAM') {
              return {
                ...p,
                price: taiData.priceInTon,
                volume24h: taiData.volume24hUsd
              };
            }
            if (p.id === 'TAI_USDT') {
              return {
                ...p,
                price: taiData.priceInUsd,
                volume24h: taiData.volume24hUsd
              };
            }
            return p;
          }));
        }
      } catch (err) {
        console.warn('Market fetch warning:', err);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const getLogo = (symbol: string) => {
    switch (symbol) {
      case 'TAI': return <LogoTAI size={34} />;
      case 'GRAM': return <LogoGRAM size={34} />;
      case 'USDT': return <LogoUSDT size={34} />;
      case 'DOGS': return <LogoDOGS size={34} />;
      case 'UTYA': return <LogoUTYA size={34} />;
      case 'NOT': return <LogoNOT size={34} />;
      default: return (
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 12 }}>
          {symbol.slice(0, 2)}
        </div>
      );
    }
  };

  const filteredPairs = pairs.filter(pair => {
    const matchesSearch = pair.base.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pair.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pair.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filterType === 'fav') return favorites.includes(pair.id);
    if (filterType === 'gainers') return pair.change24h > 0;

    if (activeTab === 'TAI') return pair.base === 'TAI' || pair.quote === 'TAI';
    if (activeTab === 'GRAM') return pair.quote === 'GRAM' || pair.base === 'GRAM';
    if (activeTab === 'USDT') return pair.quote === 'USDT' || pair.base === 'USDT';

    return true;
  }).sort((a, b) => {
    let diff = 0;
    if (sortField === 'price') diff = a.price - b.price;
    if (sortField === 'change') diff = a.change24h - b.change24h;
    if (sortField === 'volume') diff = parseFloat(a.volume24h.replace(/[^0-9.]/g, '')) - parseFloat(b.volume24h.replace(/[^0-9.]/g, ''));
    return sortAsc ? diff : -diff;
  });

  return (
    <div style={{ padding: '4px 0 20px' }}>
      {/* Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '10px 14px',
        marginBottom: '14px',
        gap: '10px'
      }}>
        <Search size={18} color="#94a3b8" />
        <input
          type="text"
          placeholder={t('taste_market.search_placeholder', 'Search coin or pair...')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#fff',
            fontSize: '13px',
            width: '100%',
            fontWeight: 500
          }}
        />
      </div>

      {/* Parite Tab Butonları */}
      <div style={{
        display: 'flex',
        background: 'rgba(255, 255, 255, 0.04)',
        borderRadius: '14px',
        padding: '4px',
        marginBottom: '12px',
        gap: '4px'
      }}>
        <button
          onClick={() => setActiveTab('TAI')}
          style={{
            flex: 1,
            padding: '10px 0',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'TAI' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
            color: activeTab === 'TAI' ? '#000' : '#94a3b8',
            fontWeight: 900,
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {t('taste_market.tab_tai', 'TAI PAIRS')}
        </button>
        <button
          onClick={() => setActiveTab('GRAM')}
          style={{
            flex: 1,
            padding: '10px 0',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'GRAM' ? '#2563eb' : 'transparent',
            color: activeTab === 'GRAM' ? '#fff' : '#94a3b8',
            fontWeight: 800,
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          GRAM (TON)
        </button>
        <button
          onClick={() => setActiveTab('USDT')}
          style={{
            flex: 1,
            padding: '10px 0',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'USDT' ? '#10b981' : 'transparent',
            color: activeTab === 'USDT' ? '#fff' : '#94a3b8',
            fontWeight: 800,
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          USDT
        </button>
      </div>

      {/* Filtre Çipleri */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
        <button
          onClick={() => setFilterType('all')}
          style={{
            padding: '6px 14px',
            borderRadius: '20px',
            border: filterType === 'all' ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
            background: filterType === 'all' ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.02)',
            color: filterType === 'all' ? '#f59e0b' : '#94a3b8',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Tümü
        </button>
        <button
          onClick={() => setFilterType('fav')}
          style={{
            padding: '6px 14px',
            borderRadius: '20px',
            border: filterType === 'fav' ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
            background: filterType === 'fav' ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.02)',
            color: filterType === 'fav' ? '#f59e0b' : '#94a3b8',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Star size={12} fill={filterType === 'fav' ? '#f59e0b' : 'none'} />
          {t('taste_market.tab_fav', 'Favorites')}
        </button>
        <button
          onClick={() => setFilterType('gainers')}
          style={{
            padding: '6px 14px',
            borderRadius: '20px',
            border: filterType === 'gainers' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
            background: filterType === 'gainers' ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.02)',
            color: filterType === 'gainers' ? '#10b981' : '#94a3b8',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          {t('taste_market.tab_gainers', 'Top Gainers')}
        </button>
      </div>

      {/* Sütun Başlıkları */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1fr 28px',
        padding: '8px 10px',
        fontSize: '10px',
        color: '#64748b',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        marginBottom: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>{t('taste_market.col_pair', 'Pair')}</div>
        <div 
          onClick={() => { setSortField('volume'); setSortAsc(!sortAsc); }}
          style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer' }}
        >
          {t('taste_market.col_volume', 'Volume')} <ArrowUpDown size={10} />
        </div>
        <div 
          onClick={() => { setSortField('price'); setSortAsc(!sortAsc); }}
          style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '2px', cursor: 'pointer' }}
        >
          {t('taste_market.col_price', 'Price / %')} <ArrowUpDown size={10} />
        </div>
        <div></div>
      </div>

      {/* Parite Satırları */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {filteredPairs.map((pair) => {
          const isFav = favorites.includes(pair.id);
          const isPositive = pair.change24h >= 0;

          return (
            <motion.div
              key={pair.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectPair && onSelectPair(pair)}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.4fr 1fr 1fr 28px',
                alignItems: 'center',
                padding: '12px 10px',
                borderRadius: '14px',
                background: pair.base === 'TAI' ? 'rgba(245, 158, 11, 0.04)' : 'rgba(255,255,255,0.02)',
                border: pair.base === 'TAI' ? '1px solid rgba(245, 158, 11, 0.18)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'background 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {getLogo(pair.base)}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 900, color: '#fff' }}>{pair.base}</span>
                    <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>/{pair.quote}</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>{pair.name}</div>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: '#cbd5e1', fontWeight: 700 }}>
                {pair.volume24h}
                <div style={{ fontSize: '9px', color: '#64748b' }}>{pair.dex}</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: 900, color: '#fff' }}>
                  {pair.price < 0.001 ? pair.price.toFixed(7) : pair.price < 0.1 ? pair.price.toFixed(5) : pair.price.toFixed(2)}
                </div>
                <div style={{
                  display: 'inline-block',
                  fontSize: '10px',
                  fontWeight: 800,
                  color: isPositive ? '#10b981' : '#ef4444',
                  background: isPositive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                  padding: '2px 6px',
                  borderRadius: '6px',
                  marginTop: '2px'
                }}>
                  {isPositive ? `+${pair.change24h}%` : `${pair.change24h}%`}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  onClick={(e) => toggleFavorite(pair.id, e)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: isFav ? '#f59e0b' : '#475569'
                  }}
                >
                  <Star size={16} fill={isFav ? '#f59e0b' : 'none'} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
