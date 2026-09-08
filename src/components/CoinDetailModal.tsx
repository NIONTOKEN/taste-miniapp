import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, ExternalLink, Copy, Check, TrendingUp, TrendingDown,
  ArrowUpRight, ArrowDownLeft, RefreshCw, BarChart2, ShieldCheck, Info
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface CoinDetailData {
  id: string;
  symbol: string;
  name: string;
  price?: number | string;
  priceUsd?: number;
  change24h?: number;
  volume24h?: string;
  high24h?: number;
  low24h?: number;
  marketCap?: string;
  address?: string;
  dex?: string;
  balance?: string;
  usdValue?: string;
  Logo?: React.ComponentType<{ size?: number }>;
  image?: string;
}

interface CoinDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  coin: CoinDetailData | null;
  onTrade?: (coin: CoinDetailData) => void;
  onSend?: (coin: CoinDetailData) => void;
  onReceive?: (coin: CoinDetailData) => void;
}

type Timeframe = '1H' | '24H' | '7D' | '1M' | 'ALL';

export const CoinDetailModal: React.FC<CoinDetailModalProps> = ({
  isOpen,
  onClose,
  coin,
  onTrade,
  onSend,
  onReceive
}) => {
  const { t } = useTranslation();
  const [selectedTf, setSelectedTf] = useState<Timeframe>('24H');
  const [hoveredPoint, setHoveredPoint] = useState<{ price: number; label: string; x: number; y: number } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !coin) return null;

  // Sayısal fiyat ve değişim hesaplaması
  const currentPriceNum = typeof coin.price === 'number' 
    ? coin.price 
    : parseFloat(String(coin.price || '0').replace('$', '').replace(/,/g, '')) || 0.0001778;

  const changeNum = coin.change24h !== undefined ? coin.change24h : 3.5;
  const isPositive = changeNum >= 0;
  const themeColor = isPositive ? '#10b981' : '#ef4444';

  // Zaman dilimine göre simüle edilmiş gerçekçi fiyat serisi üretimi
  const chartPoints = useMemo(() => {
    const count = 28;
    const base = currentPriceNum;
    const volatility = selectedTf === '1H' ? 0.012 : selectedTf === '24H' ? 0.035 : selectedTf === '7D' ? 0.08 : 0.15;
    
    // Seeded random trajectory ending at currentPrice
    const points: { price: number; label: string }[] = [];
    let cur = base * (1 - (changeNum / 100) * 0.8);

    for (let i = 0; i < count; i++) {
      const progress = i / (count - 1);
      // Trend towards current price
      const target = cur + (base - cur) * (progress * 0.4);
      const noise = (Math.sin(i * 1.8 + (coin.symbol.charCodeAt(0) % 5)) * 0.5 + (Math.random() - 0.5)) * base * volatility;
      let val = Math.max(0.000001, target + noise);
      if (i === count - 1) val = base; // Kesinlikle son noktada anlık fiyata varır

      let timeLabel = '';
      if (selectedTf === '1H') timeLabel = `${Math.round(60 - (count - i) * (60 / count))} dk önce`;
      else if (selectedTf === '24H') timeLabel = `${Math.round(24 - (count - i) * (24 / count))} sa önce`;
      else if (selectedTf === '7D') timeLabel = `${Math.round(7 - (count - i) * (7 / count))} gün önce`;
      else timeLabel = `${Math.round(30 - (count - i) * (30 / count))} gün önce`;

      points.push({ price: val, label: timeLabel });
    }
    return points;
  }, [currentPriceNum, changeNum, selectedTf, coin.symbol]);

  const minPrice = Math.min(...chartPoints.map(p => p.price));
  const maxPrice = Math.max(...chartPoints.map(p => p.price));
  const priceRange = maxPrice - minPrice || 0.00001;

  // SVG Grafiği Koordinatları (Genişlik: 320, Yükseklik: 140)
  const svgWidth = 320;
  const svgHeight = 140;
  const paddingY = 15;

  const coords = chartPoints.map((p, idx) => {
    const x = (idx / (chartPoints.length - 1)) * svgWidth;
    const y = svgHeight - paddingY - ((p.price - minPrice) / priceRange) * (svgHeight - paddingY * 2);
    return { x, y, price: p.price, label: p.label };
  });

  // SVG Smooth Bezier Path
  const generateSmoothPath = (points: { x: number; y: number }[]) => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX = (p0.x + p1.x) / 2;
      d += ` C ${cpX} ${p0.y}, ${cpX} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const linePath = generateSmoothPath(coords);
  const areaPath = `${linePath} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;

  const copyContract = () => {
    const addr = coin.address || 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-';
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatPrice = (p: number) => {
    if (p < 0.0001) return `$${p.toFixed(7)}`;
    if (p < 0.01) return `$${p.toFixed(5)}`;
    if (p < 1) return `$${p.toFixed(4)}`;
    return `$${p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const activeDisplayPrice = hoveredPoint ? hoveredPoint.price : currentPriceNum;

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)'
          }}
        />

        {/* Modal Drawer Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '92vh',
            background: 'linear-gradient(180deg, #131d33 0%, #0b1120 100%)',
            borderTopLeftRadius: '28px',
            borderTopRightRadius: '28px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.6)',
            padding: '20px 20px 32px',
            overflowY: 'auto',
            zIndex: 1
          }}
        >
          {/* Header Grab Bar */}
          <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', margin: '0 auto 16px' }} />

          {/* Header (Logo + Title + Close) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {coin.Logo ? (
                <coin.Logo size={42} />
              ) : coin.image ? (
                <img src={coin.image} alt={coin.symbol} width={42} height={42} style={{ borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff' }}>
                  {coin.symbol.slice(0, 2)}
                </div>
              )}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#fff' }}>{coin.name}</h2>
                  <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 800 }}>({coin.symbol})</span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={12} color="#10b981" />
                  <span>TON Jetton</span>
                  <span>•</span>
                  <span>{coin.dex || 'STON.fi'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Price & 24h Change Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>
                {hoveredPoint ? hoveredPoint.label : t('coin_details.live_price', 'Canlı Fiyat')}
              </div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
                {formatPrice(activeDisplayPrice)}
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 12px',
              borderRadius: '12px',
              background: isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              color: themeColor,
              fontWeight: 900,
              fontSize: '13px'
            }}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              <span>{isPositive ? `+${changeNum}%` : `${changeNum}%`}</span>
            </div>
          </div>

          {/* Timeframe Chips */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '12px' }}>
            {(['1H', '24H', '7D', '1M', 'ALL'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setSelectedTf(tf)}
                style={{
                  flex: 1,
                  padding: '6px 0',
                  borderRadius: '8px',
                  border: 'none',
                  background: selectedTf === tf ? 'rgba(255,255,255,0.14)' : 'transparent',
                  color: selectedTf === tf ? '#fff' : '#94a3b8',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Interactive SVG Chart Container */}
          <div
            style={{
              position: 'relative',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              padding: '12px 6px',
              marginBottom: '18px',
              overflow: 'hidden'
            }}
          >
            {/* Top / Bottom Price Indicators */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#64748b', padding: '0 8px 4px' }}>
              <span>Yüksek: {formatPrice(maxPrice)}</span>
              <span>Düşük: {formatPrice(minPrice)}</span>
            </div>

            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              style={{ width: '100%', height: '140px', overflow: 'visible', cursor: 'crosshair' }}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseX = ((e.clientX - rect.left) / rect.width) * svgWidth;
                const closest = coords.reduce((prev, curr) => Math.abs(curr.x - mouseX) < Math.abs(prev.x - mouseX) ? curr : prev);
                setHoveredPoint(closest);
              }}
              onTouchMove={(e) => {
                if (e.touches.length > 0) {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const touchX = ((e.touches[0].clientX - rect.left) / rect.width) * svgWidth;
                  const closest = coords.reduce((prev, curr) => Math.abs(curr.x - touchX) < Math.abs(prev.x - touchX) ? curr : prev);
                  setHoveredPoint(closest);
                }
              }}
              onMouseLeave={() => setHoveredPoint(null)}
              onTouchEnd={() => setHoveredPoint(null)}
            >
              <defs>
                <linearGradient id="coinDetailGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={themeColor} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={themeColor} stopOpacity={0.0} />
                </linearGradient>
              </defs>

              {/* Area Fill */}
              <path d={areaPath} fill="url(#coinDetailGrad)" />

              {/* Line Stroke */}
              <path d={linePath} fill="none" stroke={themeColor} strokeWidth={2.5} strokeLinecap="round" />

              {/* Crosshair indicator */}
              {hoveredPoint && (
                <>
                  <line
                    x1={hoveredPoint.x}
                    y1={0}
                    x2={hoveredPoint.x}
                    y2={svgHeight}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth={1}
                    strokeDasharray="3 3"
                  />
                  <circle
                    cx={hoveredPoint.x}
                    cy={hoveredPoint.y}
                    r={5}
                    fill="#fff"
                    stroke={themeColor}
                    strokeWidth={3}
                  />
                </>
              )}
            </svg>
          </div>

          {/* Quick Action Buttons (Al-Sat, Gönder, Yatır) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '20px' }}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onClose();
                if (onTrade) onTrade(coin);
              }}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none',
                borderRadius: '14px',
                padding: '12px 6px',
                color: '#000',
                fontWeight: 900,
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={18} />
              <span>{t('coin_details.trade', 'Borsada Al/Sat')}</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onClose();
                if (onSend) onSend(coin);
              }}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '14px',
                padding: '12px 6px',
                color: '#fff',
                fontWeight: 800,
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <ArrowUpRight size={18} color="#ef4444" />
              <span>{t('coin_details.send', 'Gönder')}</span>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onClose();
                if (onReceive) onReceive(coin);
              }}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '14px',
                padding: '12px 6px',
                color: '#fff',
                fontWeight: 800,
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <ArrowDownLeft size={18} color="#10b981" />
              <span>{t('coin_details.deposit', 'Yatır')}</span>
            </motion.button>
          </div>

          {/* Key Statistics Grid */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <BarChart2 size={14} color="#f59e0b" />
              <span>{t('coin_details.stats', 'Piyasa & Teknik Bilgiler')}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '10px 12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '10px', color: '#64748b' }}>24sa Hacim</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                  {coin.volume24h || '$1.45K'}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '10px 12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '10px', color: '#64748b' }}>Piyasa Değeri (Est.)</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                  {coin.marketCap || '$48.5K'}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '10px 12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '10px', color: '#64748b' }}>24sa En Yüksek</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#4ade80', marginTop: '2px' }}>
                  {formatPrice(coin.high24h || currentPriceNum * 1.06)}
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '10px 12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ fontSize: '10px', color: '#64748b' }}>24sa En Düşük</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#f87171', marginTop: '2px' }}>
                  {formatPrice(coin.low24h || currentPriceNum * 0.94)}
                </div>
              </div>
            </div>
          </div>

          {/* Contract Address & Explorer Link */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '14px',
            padding: '12px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>{t('coin_details.contract', 'Kontrat Adresi (Jetton)')}</span>
              <button
                onClick={copyContract}
                style={{
                  background: 'none',
                  border: 'none',
                  color: copied ? '#10b981' : '#38bdf8',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            </div>

            <div style={{ fontSize: '11px', color: '#cbd5e1', wordBreak: 'break-all', fontFamily: 'monospace' }}>
              {coin.address || 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-'}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <a
                href={`https://tonviewer.com/${coin.address || 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-'}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '11px',
                  color: '#38bdf8',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 700
                }}
              >
                <ExternalLink size={12} />
                <span>Tonviewer Explorer</span>
              </a>

              <a
                href={coin.dex === 'DeDust' ? 'https://dedust.io' : 'https://app.ston.fi'}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: '11px',
                  color: '#f59e0b',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontWeight: 700,
                  marginLeft: 'auto'
                }}
              >
                <ExternalLink size={12} />
                <span>{coin.dex || 'STON.fi'} DEX</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
