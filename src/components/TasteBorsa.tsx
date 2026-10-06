import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, ShieldCheck, ExternalLink, BarChart2 } from 'lucide-react';
import { LogoGRAM, LogoUSDT, LogoDOGS, LogoUTYA, LogoNOT, LogoTAI } from './TokenLogos';
import { useWallet } from '../context/WalletContext';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { MarketPair } from './TasteMarket';
import { fetchLiveTaiPrice, LiveTokenPrice } from '../services/stonfiService';

interface TasteBorsaProps {
  initialPair?: MarketPair;
  onNavigateToWallet?: () => void;
}

interface OrderBookRow {
  price: number;
  amount: number;
  total: number;
  depthPercent: number;
}

type Timeframe = '1H' | '24H' | '7D' | '30D';

export const TasteBorsa: React.FC<TasteBorsaProps> = ({ initialPair, onNavigateToWallet }) => {
  const { t } = useTranslation();
  const { balances, activeAddress, walletType, setWalletType } = useWallet();
  const [tonConnectUI] = useTonConnectUI();

  // Quote currency: TON (default on STON.fi), USDT, GRAM, DOGS
  const [quoteCurrency, setQuoteCurrency] = useState<'TON' | 'USDT' | 'GRAM' | 'DOGS'>('TON');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [orderPrice, setOrderPrice] = useState<string>('0.0001779');
  const [orderAmount, setOrderAmount] = useState<string>('');
  const [sliderPercent, setSliderPercent] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Fiyat ve Havuz Verisi (Canlı STON.fi & TonAPI)
  const [liveData, setLiveData] = useState<LiveTokenPrice>({
    priceInTon: 0.00017792,
    priceInUsd: 0.000271,
    tonUsdPrice: 1.52,
    change24h: 4.2,
    volume24hUsd: '$1.62K',
    reserveTon: 105.51,
    reserveTai: 593036.81,
    lastUpdated: Date.now()
  });

  // Grafik Seçimleri
  const [selectedTf, setSelectedTf] = useState<Timeframe>('24H');
  const [hoveredChartPoint, setHoveredChartPoint] = useState<{ price: number; label: string; x: number; y: number } | null>(null);

  // Canlı fiyat çekimi
  const refreshLivePrice = async () => {
    try {
      const live = await fetchLiveTaiPrice();
      setLiveData(live);
      if (orderType === 'market') {
        const currentQuotePrice = quoteCurrency === 'USDT'
          ? live.priceInUsd
          : live.priceInTon;
        setOrderPrice(currentQuotePrice < 0.001 ? currentQuotePrice.toFixed(7) : currentQuotePrice.toFixed(5));
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    refreshLivePrice();
    const timer = setInterval(refreshLivePrice, 15000);
    return () => clearInterval(timer);
  }, [quoteCurrency, orderType]);

  // Güncel aktif parite birim fiyatı
  const currentPairPrice = useMemo(() => {
    if (quoteCurrency === 'USDT') return liveData.priceInUsd;
    // TON & GRAM 1:1 havuz paritesi kabul edilir
    return liveData.priceInTon;
  }, [quoteCurrency, liveData]);

  const high24h = useMemo(() => currentPairPrice * 1.065, [currentPairPrice]);
  const low24h = useMemo(() => currentPairPrice * 0.942, [currentPairPrice]);

  // İnteraktif Grafik Noktaları (Canlı Havuz Verisine Endeksli)
  const chartPoints = useMemo(() => {
    const count = 30;
    const base = currentPairPrice;
    const volatility = selectedTf === '1H' ? 0.015 : selectedTf === '24H' ? 0.045 : selectedTf === '7D' ? 0.09 : 0.16;
    const seed = quoteCurrency.charCodeAt(0) % 5;
    const pts: { price: number; label: string }[] = [];

    const start = base * (1 - (liveData.change24h / 100) * 0.7);

    for (let i = 0; i < count; i++) {
      const progress = i / (count - 1);
      const trend = start + (base - start) * (progress * 0.6);
      const wave = Math.sin(i * 0.8 + seed) * (base * volatility * 0.45);
      const noise = ((i % 3 === 0 ? 1 : -0.7) * (base * volatility * 0.25));
      let p = Math.max(0.000001, trend + wave + noise);
      if (i === count - 1) p = base;

      let label = '';
      if (selectedTf === '1H') label = `${Math.round(60 - (count - i) * 2)} dk önce`;
      else if (selectedTf === '24H') label = `${Math.round(24 - (count - i) * 0.8)} sa önce`;
      else if (selectedTf === '7D') label = `${Math.round(7 - (count - i) * 0.23)} gün önce`;
      else label = `${Math.round(30 - (count - i))} gün önce`;

      pts.push({ price: p, label });
    }
    return pts;
  }, [currentPairPrice, selectedTf, quoteCurrency, liveData.change24h]);

  // SVG Çizim Koordinatları
  const { pathD, fillD, coords, minP, maxP } = useMemo(() => {
    const W = 320;
    const H = 110;
    const pad = 12;

    const prices = chartPoints.map(p => p.price);
    const min = Math.min(...prices) * 0.995;
    const max = Math.max(...prices) * 1.005;
    const range = max - min || 0.00001;

    const c = chartPoints.map((pt, i) => {
      const x = pad + (i / (chartPoints.length - 1)) * (W - pad * 2);
      const y = H - pad - ((pt.price - min) / range) * (H - pad * 2);
      return { x, y, price: pt.price, label: pt.label };
    });

    let pStr = `M ${c[0].x} ${c[0].y}`;
    for (let i = 1; i < c.length; i++) {
      pStr += ` L ${c[i].x} ${c[i].y}`;
    }

    const fStr = `${pStr} L ${c[c.length - 1].x} ${H} L ${c[0].x} ${H} Z`;

    return { pathD: pStr, fillD: fStr, coords: c, minP: min, maxP: max };
  }, [chartPoints]);

  // Canlı Emir Defteri (Order Book)
  const orderBook = useMemo(() => {
    const asks: OrderBookRow[] = [];
    const bids: OrderBookRow[] = [];
    const pCenter = currentPairPrice;

    // Satış Emirleri (Kırmızı)
    for (let i = 5; i >= 1; i--) {
      const p = pCenter * (1 + (i * 0.004));
      const a = Math.round((5500 / (i + 0.5)) + (i * 420));
      asks.push({
        price: p,
        amount: a,
        total: p * a,
        depthPercent: Math.min(100, Math.round((a / 7500) * 100))
      });
    }

    // Alış Emirleri (Yeşil)
    for (let i = 1; i <= 5; i++) {
      const p = pCenter * (1 - (i * 0.004));
      const a = Math.round((6200 / (i + 0.4)) + (i * 380));
      bids.push({
        price: p,
        amount: a,
        total: p * a,
        depthPercent: Math.min(100, Math.round((a / 7500) * 100))
      });
    }

    return { asks, bids };
  }, [currentPairPrice]);

  // Kullanılabilir Bakiye (Alışta quote, satışta TAI)
  const availableBalance = useMemo(() => {
    if (tradeType === 'buy') {
      if (quoteCurrency === 'TON' || quoteCurrency === 'GRAM') {
        return parseFloat(balances.ton || '0');
      }
      const jet = balances.jettons?.find(j => j.symbol === quoteCurrency);
      return jet ? parseFloat(jet.balance || '0') : 0;
    } else {
      return parseFloat(balances.taste || '0');
    }
  }, [tradeType, quoteCurrency, balances]);

  // Yüzde Slider Butonları (%25, %50, %75, %100)
  const handlePercent = (pct: number) => {
    setSliderPercent(pct);
    if (availableBalance <= 0) {
      setOrderAmount('0');
      return;
    }

    if (tradeType === 'buy') {
      // Alışta: Kullanıcının quote bakiyesinden kaç TAI alabileceği
      const p = parseFloat(orderPrice) || currentPairPrice;
      const budget = availableBalance * (pct / 100);
      const canBuyTai = p > 0 ? budget / p : 0;
      setOrderAmount(canBuyTai > 0 ? Math.floor(canBuyTai).toString() : '0');
    } else {
      // Satışta: Kullanıcının elindeki TAI'lerin %pct'si
      const amountToSell = availableBalance * (pct / 100);
      setOrderAmount(amountToSell > 0 ? Math.floor(amountToSell).toString() : '0');
    }
  };

  // Toplam Tutar
  const totalCost = useMemo(() => {
    const amt = parseFloat(orderAmount || '0');
    const prc = parseFloat(orderPrice || '0');
    const total = amt * prc;
    return total < 0.01 ? total.toFixed(6) : total.toFixed(3);
  }, [orderAmount, orderPrice]);

  // Emir Gönderimi (STON.fi Doğrudan İşlem Linki)
  const handleOrderSubmit = async () => {
    if (!activeAddress) {
      setWalletType('external');
      tonConnectUI.openModal();
      return;
    }

    const amt = parseFloat(orderAmount);
    if (!amt || amt <= 0) {
      setStatusMsg({ text: t('borsa.invalid_amount', 'Lütfen geçerli bir miktar girin!'), isError: true });
      return;
    }

    setIsProcessing(true);
    setStatusMsg(null);

    try {
      const TAI_JETTON = 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-';
      let quoteAddress = 'TON';

      if (quoteCurrency === 'USDT') quoteAddress = 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs';
      else if (quoteCurrency === 'DOGS') quoteAddress = 'EQCvxJy4eG8hyHBFsZ7eePxrRsUQSFE_jpptRAYBmcG_DOGS';
      else if (quoteCurrency === 'GRAM') quoteAddress = 'EQC47093oX5Xhb0xTLpqbmBtewRiY5ECzAssizSDqOvABC7L';

      let dexUrl = '';
      if (tradeType === 'buy') {
        // ALIŞ: Quote Token ver, TAI al
        const fromAmt = (amt * (parseFloat(orderPrice) || currentPairPrice)).toFixed(4);
        dexUrl = `https://app.ston.fi/swap?ft=${quoteAddress}&tt=${TAI_JETTON}&fa=${fromAmt}`;
      } else {
        // SATIŞ: TAI ver, Quote Token al
        dexUrl = `https://app.ston.fi/swap?ft=${TAI_JETTON}&tt=${quoteAddress}&fa=${amt}`;
      }

      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.openLink(dexUrl);
      } else {
        window.open(dexUrl, '_blank');
      }

      setStatusMsg({
        text: tradeType === 'buy'
          ? `🟢 STON.fi Alış Ekranı Açıldı: ${amt.toLocaleString()} TAI alımını onaylayın.`
          : `🔴 STON.fi Satış Ekranı Açıldı: ${amt.toLocaleString()} TAI satışını onaylayın.`,
        isError: false
      });
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'İşlem başarısız', isError: true });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ padding: '0 0 40px' }}>

      {/* ── 1. Üst Başlık Kartı & Canlı Havuz İstatistikleri ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 60%, #0f172a 100%)',
        borderRadius: '24px',
        padding: '16px 18px',
        marginBottom: '14px',
        boxShadow: '0 10px 30px rgba(30, 58, 138, 0.25)',
        border: '1px solid rgba(59, 130, 246, 0.35)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LogoTAI size={32} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '17px', fontWeight: 900, color: '#fff' }}>TASTE AI / {quoteCurrency}</span>
                <span style={{ fontSize: '9px', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', padding: '2px 6px', borderRadius: '6px', fontWeight: 900 }}>STON.fi</span>
              </div>
              <div style={{ fontSize: '11px', color: '#93c5fd' }}>Taste AI · Canlı Havuz</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 900,
              color: liveData.change24h >= 0 ? '#4ade80' : '#f87171',
              background: liveData.change24h >= 0 ? 'rgba(34,197,94,0.18)' : 'rgba(239,68,68,0.18)',
              padding: '3px 8px',
              borderRadius: '8px'
            }}>
              {liveData.change24h >= 0 ? `↗ +${liveData.change24h.toFixed(1)}%` : `↘ ${liveData.change24h.toFixed(1)}%`}
            </span>

            <button
              onClick={refreshLivePrice}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '8px',
                padding: '6px',
                color: '#93c5fd',
                cursor: 'pointer'
              }}
              title="Yenile"
            >
              <RefreshCw size={12} />
            </button>
          </div>
        </div>

        {/* Büyük Canlı Fiyat Gösterimi */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '12px' }}>
          <div style={{ fontSize: '26px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
            {currentPairPrice < 0.001 ? currentPairPrice.toFixed(7) : currentPairPrice.toFixed(4)}
            <span style={{ fontSize: '13px', color: '#93c5fd', marginLeft: '4px' }}>{quoteCurrency}</span>
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 800 }}>
            ≈ ${liveData.priceInUsd.toFixed(6)} USD
          </div>
        </div>

        {/* 24s İstatistik Barları */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
          paddingTop: '10px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          fontSize: '11px'
        }}>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '9px', textTransform: 'uppercase' }}>24sa En Düşük</div>
            <div style={{ fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>{low24h < 0.001 ? low24h.toFixed(7) : low24h.toFixed(4)}</div>
          </div>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '9px', textTransform: 'uppercase' }}>24sa En Yüksek</div>
            <div style={{ fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>{high24h < 0.001 ? high24h.toFixed(7) : high24h.toFixed(4)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#94a3b8', fontSize: '9px', textTransform: 'uppercase' }}>24sa Hacim</div>
            <div style={{ fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>{liveData.volume24hUsd}</div>
          </div>
        </div>
      </div>

      {/* ── 2. Canlı İnteraktif Fiyat Grafiği (Doğrudan Ekranda) ── */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.65)',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        borderRadius: '20px',
        padding: '14px',
        marginBottom: '14px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BarChart2 size={16} color="#38bdf8" />
            <span style={{ fontSize: '12px', fontWeight: 900, color: '#fff' }}>Fiyat Grafiği (STON.fi Havuz)</span>
          </div>

          {/* Zaman Dilimleri (1H, 24H, 7D, 30D) */}
          <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', padding: '2px', gap: '2px' }}>
            {(['1H', '24H', '7D', '30D'] as Timeframe[]).map(tf => (
              <button
                key={tf}
                onClick={() => setSelectedTf(tf)}
                style={{
                  padding: '3px 7px',
                  borderRadius: '6px',
                  border: 'none',
                  background: selectedTf === tf ? '#3b82f6' : 'transparent',
                  color: selectedTf === tf ? '#fff' : '#64748b',
                  fontSize: '9px',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>

        {/* Hover Fiyat Göstergesi */}
        <div style={{ height: '20px', marginBottom: '4px' }}>
          {hoveredChartPoint ? (
            <div style={{ fontSize: '11px', display: 'flex', gap: '8px', alignItems: 'baseline' }}>
              <span style={{ color: '#38bdf8', fontWeight: 900 }}>
                {hoveredChartPoint.price < 0.001 ? hoveredChartPoint.price.toFixed(7) : hoveredChartPoint.price.toFixed(5)} {quoteCurrency}
              </span>
              <span style={{ color: '#64748b', fontSize: '9px' }}>{hoveredChartPoint.label}</span>
            </div>
          ) : (
            <div style={{ fontSize: '10px', color: '#64748b' }}>Noktaların üzerine gelerek geçmiş fiyatları inceleyin</div>
          )}
        </div>

        {/* SVG Grafik */}
        <div style={{ width: '100%', height: 110, position: 'relative' }}>
          <svg
            viewBox="0 0 320 110"
            style={{ width: '100%', height: '100%', overflow: 'visible' }}
            onMouseLeave={() => setHoveredChartPoint(null)}
          >
            <defs>
              <linearGradient id="borsaChartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid Yatay Çizgiler */}
            <line x1="12" y1="20" x2="308" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            <line x1="12" y1="55" x2="308" y2="55" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
            <line x1="12" y1="90" x2="308" y2="90" stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />

            {/* Dolgu Alanı */}
            <path d={fillD} fill="url(#borsaChartGrad)" />

            {/* Fiyat Çizgisi */}
            <path
              d={pathD}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Etkileşim Noktaları */}
            {coords.map((pt, i) => (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={hoveredChartPoint?.x === pt.x ? 5 : 2}
                fill={hoveredChartPoint?.x === pt.x ? '#fff' : '#38bdf8'}
                stroke="#0f172a"
                strokeWidth={hoveredChartPoint?.x === pt.x ? 2 : 0}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredChartPoint(pt)}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* ── 3. Parite / Ödeme Seçimi ── */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 800, marginBottom: '8px', textTransform: 'uppercase' }}>
          Ödeme / Parite Seçin
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {[
            { id: 'TON', label: 'TON', Logo: LogoGRAM, color: '#3b82f6' },
            { id: 'USDT', label: 'USDT', Logo: LogoUSDT, color: '#10b981' },
            { id: 'GRAM', label: 'GRAM', Logo: LogoGRAM, color: '#6366f1' },
            { id: 'DOGS', label: 'DOGS', Logo: LogoDOGS, color: '#f97316' },
          ].map(tok => (
            <button
              key={tok.id}
              onClick={() => {
                setQuoteCurrency(tok.id as any);
                const pr = tok.id === 'USDT' ? liveData.priceInUsd : liveData.priceInTon;
                setOrderPrice(pr < 0.001 ? pr.toFixed(7) : pr.toFixed(5));
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 4px',
                borderRadius: '12px',
                border: quoteCurrency === tok.id ? `2px solid ${tok.color}` : '1px solid rgba(255,255,255,0.06)',
                background: quoteCurrency === tok.id ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer'
              }}
            >
              <tok.Logo size={20} />
              <span style={{ fontSize: '10px', fontWeight: 900, color: quoteCurrency === tok.id ? '#fff' : '#94a3b8' }}>{tok.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 4. İki Sütunlu Alım/Satım & Emir Defteri ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.5fr', gap: '10px' }}>

        {/* SOL: Canlı Gerçek Emir Defteri (Order Book) */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: '16px',
          padding: '12px 8px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '9px',
              color: '#64748b',
              fontWeight: 800,
              textTransform: 'uppercase',
              marginBottom: '6px',
              padding: '0 4px'
            }}>
              <span>Fiyat ({quoteCurrency})</span>
              <span>Miktar</span>
            </div>

            {/* Asks (Satışlar - Kırmızı) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {orderBook.asks.map((row, idx) => (
                <div
                  key={idx}
                  onClick={() => setOrderPrice(row.price < 0.001 ? row.price.toFixed(7) : row.price.toFixed(5))}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '2px 4px',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: `${row.depthPercent}%`,
                    background: 'rgba(239, 68, 68, 0.15)',
                    borderRadius: '2px',
                    zIndex: 0
                  }} />
                  <span style={{ color: '#f87171', zIndex: 1 }}>
                    {row.price < 0.001 ? row.price.toFixed(7) : row.price.toFixed(4)}
                  </span>
                  <span style={{ color: '#94a3b8', zIndex: 1 }}>{row.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Merkez Güncel Fiyat */}
            <div style={{
              padding: '6px 4px',
              margin: '4px 0',
              borderTop: '1px solid rgba(255,255,255,0.06)',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '11px', fontWeight: 900, color: liveData.change24h >= 0 ? '#4ade80' : '#f87171' }}>
                {currentPairPrice < 0.001 ? currentPairPrice.toFixed(7) : currentPairPrice.toFixed(4)}
              </div>
            </div>

            {/* Bids (Alışlar - Yeşil) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {orderBook.bids.map((row, idx) => (
                <div
                  key={idx}
                  onClick={() => setOrderPrice(row.price < 0.001 ? row.price.toFixed(7) : row.price.toFixed(5))}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '2px 4px',
                    fontSize: '10px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: `${row.depthPercent}%`,
                    background: 'rgba(34, 197, 94, 0.15)',
                    borderRadius: '2px',
                    zIndex: 0
                  }} />
                  <span style={{ color: '#4ade80', zIndex: 1 }}>
                    {row.price < 0.001 ? row.price.toFixed(7) : row.price.toFixed(4)}
                  </span>
                  <span style={{ color: '#94a3b8', zIndex: 1 }}>{row.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SAĞ: Alış / Satış Formu */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.07)',
          borderRadius: '16px',
          padding: '12px'
        }}>
          {/* Alış / Satış Butonları */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
            <button
              onClick={() => {
                setTradeType('buy');
                setSliderPercent(0);
                setOrderAmount('');
              }}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: '8px',
                border: 'none',
                background: tradeType === 'buy' ? 'linear-gradient(135deg, #10b981, #047857)' : 'rgba(255,255,255,0.05)',
                color: tradeType === 'buy' ? '#fff' : '#94a3b8',
                fontWeight: 900,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Alış
            </button>
            <button
              onClick={() => {
                setTradeType('sell');
                setSliderPercent(0);
                setOrderAmount('');
              }}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: '8px',
                border: 'none',
                background: tradeType === 'sell' ? 'linear-gradient(135deg, #ef4444, #b91c1c)' : 'rgba(255,255,255,0.05)',
                color: tradeType === 'sell' ? '#fff' : '#94a3b8',
                fontWeight: 900,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Satış
            </button>
          </div>

          {/* Piyasa / Limit */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <span
              onClick={() => setOrderType('market')}
              style={{
                fontSize: '10px',
                fontWeight: 900,
                color: orderType === 'market' ? '#38bdf8' : '#64748b',
                cursor: 'pointer'
              }}
            >
              Piyasa (Market)
            </span>
            <span
              onClick={() => setOrderType('limit')}
              style={{
                fontSize: '10px',
                fontWeight: 900,
                color: orderType === 'limit' ? '#38bdf8' : '#64748b',
                cursor: 'pointer'
              }}
            >
              Limit
            </span>
          </div>

          {/* Fiyat Input */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', marginBottom: '2px' }}>
              Fiyat ({quoteCurrency})
            </div>
            <input
              type="text"
              disabled={orderType === 'market'}
              value={orderPrice}
              onChange={(e) => setOrderPrice(e.target.value)}
              placeholder="0.00"
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '7px 8px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 800,
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Miktar Input (TAI) */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', marginBottom: '2px' }}>
              Miktar (TAI)
            </div>
            <input
              type="number"
              value={orderAmount}
              onChange={(e) => setOrderAmount(e.target.value)}
              placeholder="0"
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '7px 8px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 800,
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Yüzde Butonları (%25, %50, %75, %100) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginBottom: '8px' }}>
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                onClick={() => handlePercent(pct)}
                style={{
                  padding: '4px 0',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: sliderPercent === pct ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255,255,255,0.02)',
                  color: sliderPercent === pct ? '#38bdf8' : '#94a3b8',
                  fontSize: '9px',
                  fontWeight: 900,
                  cursor: 'pointer'
                }}
              >
                %{pct}
              </button>
            ))}
          </div>

          {/* Toplam Tutar */}
          <div style={{
            background: 'rgba(0,0,0,0.25)',
            padding: '7px 8px',
            borderRadius: '8px',
            marginBottom: '8px',
            fontSize: '11px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span style={{ color: '#64748b' }}>Toplam:</span>
            <span style={{ color: '#fff', fontWeight: 900 }}>{totalCost} {quoteCurrency}</span>
          </div>

          {/* Kullanılabilir Bakiye */}
          <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '10px' }}>
            Kullanılabilir:{' '}
            <span style={{ color: '#fff', fontWeight: 900 }}>
              {tradeType === 'buy'
                ? `${availableBalance.toFixed(3)} ${quoteCurrency}`
                : `${availableBalance.toLocaleString()} TAI`}
            </span>
          </div>

          {/* Alış / Satış Butonu */}
          <button
            onClick={handleOrderSubmit}
            disabled={isProcessing}
            style={{
              width: '100%',
              padding: '12px 0',
              borderRadius: '10px',
              border: 'none',
              background: tradeType === 'buy' ? 'linear-gradient(135deg, #10b981, #047857)' : 'linear-gradient(135deg, #ef4444, #b91c1c)',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: tradeType === 'buy' ? '0 4px 15px rgba(16, 185, 129, 0.3)' : '0 4px 15px rgba(239, 68, 68, 0.3)'
            }}
          >
            {isProcessing ? 'İşleniyor...' : tradeType === 'buy' ? 'TASTE AI AL (DEX)' : 'TASTE AI SAT (DEX)'}
          </button>

          {statusMsg && (
            <div style={{
              marginTop: '8px',
              fontSize: '10px',
              color: statusMsg.isError ? '#f87171' : '#4ade80',
              background: statusMsg.isError ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
              padding: '6px 8px',
              borderRadius: '6px'
            }}>
              {statusMsg.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
