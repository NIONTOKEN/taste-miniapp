import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, Star, ArrowUpDown } from 'lucide-react';
import { LogoGRAM, LogoDOGS, LogoUTYA, LogoUSDT, LogoNOT, LogoTAI } from './TokenLogos';
import { fetchLiveTaiPrice } from '../services/stonfiService';
import { CoinDetailModal, CoinDetailData } from './CoinDetailModal';

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
    quote: 'TON',
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
    base: 'TON',
    quote: 'USDT',
    name: 'Toncoin',
    price: 5.32,
    change24h: 2.1,
    volume24h: '$14.2M',
    high24h: 5.48,
    low24h: 5.18,
    dex: 'STON.fi'
  },
  {
    id: 'NOT_TON',
    base: 'NOT',
    quote: 'TON',
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
    id: 'DOGS_TON',
    base: 'DOGS',
    quote: 'TON',
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
    id: 'UTYA_TON',
    base: 'UTYA',
    quote: 'TON',
    name: 'Utya Duck',
    price: 0.00503,
    change24h: 1.2,
    volume24h: '$850K',
    high24h: 0.0054,
    low24h: 0.0048,
    dex: 'STON.fi',
    address: 'EQBaCgUwOoc6gHCNln_oJzb0mVs79YG7wYoavh-o1ItaneLA'
  },
  {
    id: 'CATS_TON',
    base: 'CATS',
    quote: 'TON',
    name: 'Cats Community',
    price: 0.000038,
    change24h: 6.8,
    volume24h: '$1.9M',
    high24h: 0.000042,
    low24h: 0.000035,
    dex: 'STON.fi',
    address: 'EQA-X_yo3fzzbPtTyMm9KhgKlAyDUgxmgEmGam8tBlqmCATS'
  },
  {
    id: 'HMSTR_TON',
    base: 'HMSTR',
    quote: 'TON',
    name: 'Hamster Kombat',
    price: 0.00285,
    change24h: -3.2,
    volume24h: '$4.1M',
    high24h: 0.00310,
    low24h: 0.00270,
    dex: 'STON.fi',
    address: 'EQA4hA8cOx7ElVKO5PWqI2B7jP8e9iP_cWqR-HMSTR_TON'
  },
  {
    id: 'MAJOR_TON',
    base: 'MAJOR',
    quote: 'TON',
    name: 'Major Token',
    price: 0.78,
    change24h: 8.4,
    volume24h: '$2.3M',
    high24h: 0.84,
    low24h: 0.71,
    dex: 'STON.fi',
    address: 'EQBf2_Major_Ton_Token_Jetton_Master_Address_000'
  }
];

interface TasteMarketProps {
  onSelectPair?: (pair: MarketPair) => void;
}

export const TasteMarket: React.FC<TasteMarketProps> = ({ onSelectPair }) => {
  const { t } = useTranslation();
  const [pairs, setPairs] = useState<MarketPair[]>(INITIAL_PAIRS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'ALL' | 'TAI' | 'TON' | 'USDT'>('ALL');
  const [filterType, setFilterType] = useState<'all' | 'fav' | 'gainers'>('all');
  const [favorites, setFavorites] = useState<string[]>(['TAI_GRAM', 'TAI_USDT']);
  const [sortField, setSortField] = useState<'price' | 'change' | 'volume'>('change');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedPairForDetail, setSelectedPairForDetail] = useState<CoinDetailData | null>(null);

  // STON.fi havuzundan canli TAI fiyatini al
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
    const sym = symbol.toUpperCase();
    switch (sym) {
      case 'TAI':
      case 'TASTE': return <LogoTAI size={34} />;
      case 'TON':
      case 'GRAM': return <LogoGRAM size={34} />;
      case 'USDT':
      case 'USD₮': return <LogoUSDT size={34} />;
      case 'DOGS': return <LogoDOGS size={34} />;
      case 'UTYA': return <LogoUTYA size={34} />;
      case 'NOT': return <LogoNOT size={34} />;
      case 'CATS':
        return (
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#1e293b', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
            🐱
          </div>
        );
      case 'HMSTR':
        return (
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
            🐹
          </div>
        );
      case 'MAJOR':
        return (
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
            ⭐
          </div>
        );
      default: return (
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 11 }}>
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

    if (activeTab === 'ALL') return true;
    if (activeTab === 'TAI') return pair.base === 'TAI' || pair.quote === 'TAI';
    if (activeTab === 'TON') return pair.quote === 'TON' || pair.base === 'TON' || pair.quote === 'GRAM' || pair.base === 'GRAM';
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
      {/* Arama Kutusu */}
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
          placeholder={t('taste_market.search_placeholder', 'Coin veya parite ara...')}
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

      {/* Parite Tab Butonlari (Tumu Varsayilan) */}
      <div style={{
        display: 'flex',
        background: 'rgba(255, 255, 255, 0.04)',
        borderRadius: '14px',
        padding: '4px',
        marginBottom: '12px',
        gap: '4px'
      }}>
        <button
          onClick={() => setActiveTab('ALL')}
          style={{
            flex: 1,
            padding: '10px 0',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'ALL' ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : 'transparent',
            color: activeTab === 'ALL' ? '#fff' : '#94a3b8',
            fontWeight: 900,
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {t('taste_market.tab_all', 'Tümü (ALL)')}
        </button>
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
          TAI
        </button>
        <button
          onClick={() => setActiveTab('TON')}
          style={{
            flex: 1,
            padding: '10px 0',
            borderRadius: '10px',
            border: 'none',
            background: activeTab === 'TON' ? '#0284c7' : 'transparent',
            color: activeTab === 'TON' ? '#fff' : '#94a3b8',
            fontWeight: 800,
            fontSize: '12px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          TON
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

      {/* Hizli Filtreler & Sıralama Barı */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
        padding: '0 4px'
      }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setFilterType('all')}
            style={{
              padding: '4px 10px',
              borderRadius: '12px',
              border: filterType === 'all' ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.08)',
              background: filterType === 'all' ? 'rgba(59,130,246,0.15)' : 'transparent',
              color: filterType === 'all' ? '#60a5fa' : '#94a3b8',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {t('taste_market.filter_all', 'Tümü')} ({filteredPairs.length})
          </button>
          <button
            onClick={() => setFilterType('fav')}
            style={{
              padding: '4px 10px',
              borderRadius: '12px',
              border: filterType === 'fav' ? '1px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
              background: filterType === 'fav' ? 'rgba(245,158,11,0.15)' : 'transparent',
              color: filterType === 'fav' ? '#fbbf24' : '#94a3b8',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            ★ {t('taste_market.filter_fav', 'Favoriler')}
          </button>
          <button
            onClick={() => setFilterType('gainers')}
            style={{
              padding: '4px 10px',
              borderRadius: '12px',
              border: filterType === 'gainers' ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.08)',
              background: filterType === 'gainers' ? 'rgba(16,185,129,0.15)' : 'transparent',
              color: filterType === 'gainers' ? '#34d399' : '#94a3b8',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            🔥 {t('taste_market.filter_gainers', 'Yükselenler')}
          </button>
        </div>
      </div>

      {/* Tablo Basliklari */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr 1fr 28px',
        padding: '8px 10px',
        fontSize: '11px',
        fontWeight: 800,
        color: '#64748b',
        textTransform: 'uppercase'
      }}>
        <div>{t('taste_market.col_pair', 'Parite')}</div>
        <div 
          onClick={() => { setSortField('volume'); setSortAsc(!sortAsc); }}
          style={{ display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer' }}
        >
          {t('taste_market.col_volume', '24s Hacim')} <ArrowUpDown size={10} />
        </div>
        <div 
          onClick={() => { setSortField('price'); setSortAsc(!sortAsc); }}
          style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '2px', cursor: 'pointer' }}
        >
          {t('taste_market.col_price', 'Fiyat / %')} <ArrowUpDown size={10} />
        </div>
        <div></div>
      </div>

      {/* Parite Satirlari */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {filteredPairs.map((pair) => {
          const isFav = favorites.includes(pair.id);
          const isPositive = pair.change24h >= 0;

          return (
            <motion.div
              key={pair.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setSelectedPairForDetail({
                  id: pair.id,
                  symbol: pair.base,
                  name: pair.name,
                  price: pair.price,
                  change24h: pair.change24h,
                  volume24h: pair.volume24h,
                  high24h: pair.high24h,
                  low24h: pair.low24h,
                  dex: pair.dex,
                  address: pair.address,
                  pairQuote: pair.quote,
                  Logo: () => getLogo(pair.base)
                });
              }}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.4fr 1fr 1fr 28px',
                alignItems: 'center',
                padding: '12px 10px',
                borderRadius: '14px',
                background: pair.base === 'TAI' ? 'rgba(245, 158, 11, 0.04)' : 'rgba(255,255,255,0.02)',
                border: pair.base === 'TAI' ? '1px solid rgba(245, 158, 11, 0.18)' : '1px solid rgba(255,255,255,0.05)',
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
                    <span style={{ fontSize: '9px', color: '#38bdf8', background: 'rgba(56,189,248,0.1)', padding: '1px 4px', borderRadius: '4px', marginLeft: '2px' }}>↗</span>
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

      {/* Parite Detay & Fiyat Grafigi Modali */}
      <CoinDetailModal
        isOpen={!!selectedPairForDetail}
        coin={selectedPairForDetail}
        onClose={() => setSelectedPairForDetail(null)}
        onTrade={(c) => {
          if (onSelectPair && selectedPairForDetail) {
            const matched = pairs.find(p => p.id === selectedPairForDetail.id);
            if (matched) onSelectPair(matched);
          }
          setSelectedPairForDetail(null);
        }}
      />
    </div>
  );
};
