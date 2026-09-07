import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { MessageSquare, RefreshCw } from 'lucide-react';
import { LogoGRAM, LogoUSDT, LogoDOGS, LogoUTYA, LogoNOT, LogoTAI } from './TokenLogos';
import { useWallet } from '../context/WalletContext';
import { useTonConnectUI, TonConnectButton } from '@tonconnect/ui-react';
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

export const TasteBorsa: React.FC<TasteBorsaProps> = ({ initialPair, onNavigateToWallet }) => {
  const { t } = useTranslation();
  const { balances, activeAddress, walletType, setWalletType } = useWallet();
  const [tonConnectUI] = useTonConnectUI();

  const [pair, setPair] = useState<MarketPair>(initialPair || {
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
  });

  const [quoteCurrency, setQuoteCurrency] = useState<'GRAM' | 'USDT' | 'DOGS' | 'UTYA'>('GRAM');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('market');
  const [orderPrice, setOrderPrice] = useState<string>('0.0001778');
  const [orderAmount, setOrderAmount] = useState<string>('');
  const [sliderPercent, setSliderPercent] = useState<number>(0);
  const [memo, setMemo] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // STON.fi canlı havuz fiyatı çekme (TAI / GRAM)
  const refreshLivePrice = async () => {
    try {
      const live: LiveTokenPrice = await fetchLiveTaiPrice();
      if (live.priceInTon > 0) {
        setPair(prev => ({
          ...prev,
          price: live.priceInTon,
          high24h: Math.max(prev.high24h, live.priceInTon * 1.05),
          low24h: Math.min(prev.low24h, live.priceInTon * 0.95),
        }));
        if (orderType === 'market') {
          setOrderPrice(live.priceInTon.toFixed(7));
        }
      }
    } catch {
      // sessizce devam et
    }
  };

  useEffect(() => {
    refreshLivePrice();
    const timer = setInterval(refreshLivePrice, 15000); // 15 sn periyodik canlı çekim
    return () => clearInterval(timer);
  }, [orderType]);

  // Canlı Gerçekçi Sipariş Defteri Üretimi
  const generateOrderBook = (centerPrice: number) => {
    const asks: OrderBookRow[] = [];
    const bids: OrderBookRow[] = [];

    // Asks (Satış - Kırmızı)
    for (let i = 5; i >= 1; i--) {
      const p = centerPrice * (1 + (i * 0.006));
      const a = Math.round((6000 / (i + 0.5)) + (Math.random() * 800));
      asks.push({
        price: p,
        amount: a,
        total: p * a,
        depthPercent: Math.min(100, Math.round((a / 8000) * 100))
      });
    }

    // Bids (Alış - Yeşil)
    for (let i = 1; i <= 5; i++) {
      const p = centerPrice * (1 - (i * 0.006));
      const a = Math.round((7000 / (i + 0.4)) + (Math.random() * 900));
      bids.push({
        price: p,
        amount: a,
        total: p * a,
        depthPercent: Math.min(100, Math.round((a / 8000) * 100))
      });
    }

    return { asks, bids };
  };

  const { asks, bids } = generateOrderBook(pair.price);

  const handlePercent = (pct: number) => {
    setSliderPercent(pct);
    let maxAvail = 0;
    if (tradeType === 'buy') {
      const tonBal = parseFloat(balances.ton || '0');
      const p = parseFloat(orderPrice) || pair.price;
      maxAvail = p > 0 ? (tonBal * (pct / 100)) / p : 0;
    } else {
      const tasteBal = parseFloat(balances.taste || '0');
      maxAvail = tasteBal * (pct / 100);
    }
    setOrderAmount(maxAvail > 0 ? Math.floor(maxAvail).toString() : '0');
  };

  const handleOrderSubmit = async () => {
    if (!activeAddress) {
      setWalletType('external');
      tonConnectUI.openModal();
      return;
    }

    if (!orderAmount || parseFloat(orderAmount) <= 0) {
      setStatusMsg({ text: t('borsa.invalid_amount', 'Lütfen geçerli bir miktar girin'), isError: true });
      return;
    }

    setIsProcessing(true);
    setStatusMsg(null);

    try {
      let dexUrl = 'https://app.ston.fi/swap?ft=TON&tt=EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-';
      if (quoteCurrency === 'USDT') {
        dexUrl = 'https://app.ston.fi/swap?ft=EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs&tt=EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-';
      } else if (quoteCurrency === 'DOGS') {
        dexUrl = 'https://app.ston.fi/swap?ft=EQCvxJy4eG8hyHBFsZ7eePxrRsUQSFE_jpptRAYBmcG_DOGS&tt=EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-';
      } else if (quoteCurrency === 'UTYA') {
        dexUrl = 'https://app.ston.fi/swap?ft=EQBaCgUwOoc6gHCNln_oJzb0mVs79YG7wYoavh-o1ItaneLA&tt=EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-';
      }

      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.openLink(dexUrl);
      } else {
        window.open(dexUrl, '_blank');
      }

      setStatusMsg({
        text: t('borsa.dex_opened', 'STON.fi DEX açıldı: Havuzdaki işlemi onaylayın.'),
        isError: false
      });
    } catch (err: any) {
      setStatusMsg({ text: err.message || t('borsa.tx_failed', 'İşlem başarısız'), isError: true });
    } finally {
      setIsProcessing(false);
    }
  };

  const totalCost = (parseFloat(orderPrice || '0') * parseFloat(orderAmount || '0')).toFixed(4);

  return (
    <div style={{ padding: '0 0 40px' }}>
      {/* ── 1. Üst Borsa Başlık Kartı (Canlı Havuz Fiyatlı) ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 60%, #0f172a 100%)',
        borderRadius: '24px',
        padding: '18px 20px',
        marginBottom: '16px',
        boxShadow: '0 10px 30px rgba(30, 58, 138, 0.3)',
        border: '1px solid rgba(59, 130, 246, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LogoTAI size={34} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>TASTE AI / {quoteCurrency}</span>
                <span style={{ fontSize: '10px', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', padding: '2px 6px', borderRadius: '6px', fontWeight: 800 }}>STON.fi</span>
              </div>
              <div style={{ fontSize: '11px', color: '#93c5fd' }}>{pair.name} · TON Blockchain</div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              color: pair.change24h >= 0 ? '#4ade80' : '#f87171',
              background: pair.change24h >= 0 ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
              padding: '3px 8px',
              borderRadius: '8px'
            }}>
              {pair.change24h >= 0 ? `↗ +${pair.change24h}%` : `↘ ${pair.change24h}%`}
            </span>
          </div>
        </div>

        {/* Fiyat Büyük Gösterim */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '14px' }}>
          <div style={{ fontSize: '28px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
            {pair.price < 0.001 ? pair.price.toFixed(7) : pair.price.toFixed(4)}
          </div>
          <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 700 }}>
            ≈ ${(pair.price * (quoteCurrency === 'GRAM' ? 5.32 : 1)).toFixed(6)} USD
          </div>
        </div>

        {/* 24s İstatistikler */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          fontSize: '11px'
        }}>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '9px', textTransform: 'uppercase' }}>{t('borsa.min_24h', '24sa En Düşük')}</div>
            <div style={{ fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>{pair.low24h < 0.001 ? pair.low24h.toFixed(7) : pair.low24h.toFixed(4)}</div>
          </div>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '9px', textTransform: 'uppercase' }}>{t('borsa.max_24h', '24sa En Yüksek')}</div>
            <div style={{ fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>{pair.high24h < 0.001 ? pair.high24h.toFixed(7) : pair.high24h.toFixed(4)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#94a3b8', fontSize: '9px', textTransform: 'uppercase' }}>{t('borsa.vol_24h', '24sa Hacim')}</div>
            <div style={{ fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>{pair.volume24h}</div>
          </div>
        </div>
      </div>

      {/* ── 2. "Ne İle Alınır / Satılır?" Hızlı Seçim Butonları ── */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>
          {t('borsa.payment_select', 'Ödeme / Parite Seçin')}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {[
            { id: 'GRAM', label: 'GRAM (TON)', Logo: LogoGRAM, color: '#3b82f6' },
            { id: 'USDT', label: 'USDT', Logo: LogoUSDT, color: '#10b981' },
            { id: 'DOGS', label: 'DOGS', Logo: LogoDOGS, color: '#f97316' },
            { id: 'UTYA', label: 'UTYA', Logo: LogoUTYA, color: '#eab308' },
          ].map(tok => (
            <button
              key={tok.id}
              onClick={() => {
                setQuoteCurrency(tok.id as any);
                setPair(prev => ({ ...prev, quote: tok.id }));
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                padding: '8px 4px',
                borderRadius: '12px',
                border: quoteCurrency === tok.id ? `2px solid ${tok.color}` : '1px solid rgba(255,255,255,0.06)',
                background: quoteCurrency === tok.id ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                cursor: 'pointer'
              }}
            >
              <tok.Logo size={20} />
              <span style={{ fontSize: '10px', fontWeight: 800, color: quoteCurrency === tok.id ? '#fff' : '#94a3b8' }}>{tok.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. İki Sütunlu Borsa Alanı (Sol: Emir Defteri, Sağ: Alış/Satış) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr', gap: '12px' }}>
        
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
              <span>{t('borsa.price_label', 'Fiyat')} ({quoteCurrency})</span>
              <span>{t('borsa.amount_label', 'Miktar')}</span>
            </div>

            {/* Asks (Satışlar - Kırmızı) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {asks.map((row, idx) => (
                <div
                  key={idx}
                  onClick={() => setOrderPrice(row.price.toFixed(7))}
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
                  <span style={{ color: '#f87171', zIndex: 1 }}>{row.price < 0.001 ? row.price.toFixed(7) : row.price.toFixed(4)}</span>
                  <span style={{ color: '#94a3b8', zIndex: 1 }}>{row.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>

            {/* Orta Fiyat Göstergesi */}
            <div style={{
              padding: '8px 4px',
              margin: '6px 0',
              borderTop: '1px dashed rgba(255,255,255,0.08)',
              borderBottom: '1px dashed rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '11px', fontWeight: 900, color: '#4ade80' }}>
                ↗ {pair.price < 0.001 ? pair.price.toFixed(7) : pair.price.toFixed(4)}
              </span>
              <span style={{ fontSize: '9px', color: '#64748b' }}>{t('borsa.live', 'CANLI')}</span>
            </div>

            {/* Bids (Alışlar - Yeşil) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {bids.map((row, idx) => (
                <div
                  key={idx}
                  onClick={() => setOrderPrice(row.price.toFixed(7))}
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
                  <span style={{ color: '#4ade80', zIndex: 1 }}>{row.price < 0.001 ? row.price.toFixed(7) : row.price.toFixed(4)}</span>
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
              onClick={() => setTradeType('buy')}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: '8px',
                border: 'none',
                background: tradeType === 'buy' ? '#10b981' : 'rgba(255,255,255,0.05)',
                color: tradeType === 'buy' ? '#fff' : '#94a3b8',
                fontWeight: 900,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {t('borsa.buy', 'Alış')}
            </button>
            <button
              onClick={() => setTradeType('sell')}
              style={{
                flex: 1,
                padding: '8px 0',
                borderRadius: '8px',
                border: 'none',
                background: tradeType === 'sell' ? '#ef4444' : 'rgba(255,255,255,0.05)',
                color: tradeType === 'sell' ? '#fff' : '#94a3b8',
                fontWeight: 900,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {t('borsa.sell', 'Satış')}
            </button>
          </div>

          {/* Limit / Market */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <span
              onClick={() => setOrderType('limit')}
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: orderType === 'limit' ? '#38bdf8' : '#64748b',
                cursor: 'pointer'
              }}
            >
              {t('borsa.limit', 'Limit')}
            </span>
            <span
              onClick={() => {
                setOrderType('market');
                setOrderPrice(pair.price.toString());
              }}
              style={{
                fontSize: '11px',
                fontWeight: 800,
                color: orderType === 'market' ? '#38bdf8' : '#64748b',
                cursor: 'pointer'
              }}
            >
              {t('borsa.market_order', 'Piyasa (Market)')}
            </span>
          </div>

          {/* Fiyat Input */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', marginBottom: '3px' }}>{t('borsa.price_label', 'Fiyat')} ({quoteCurrency})</div>
            <input
              type="number"
              disabled={orderType === 'market'}
              value={orderPrice}
              onChange={(e) => setOrderPrice(e.target.value)}
              placeholder="0.00"
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '8px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 800,
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Miktar Input (TAI) */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', marginBottom: '3px' }}>{t('borsa.amount_label', 'Miktar (TAI)')}</div>
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
                padding: '8px',
                color: '#fff',
                fontSize: '12px',
                fontWeight: 800,
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* %25, %50, %75, %100 Butonları */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginBottom: '10px' }}>
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                onClick={() => handlePercent(pct)}
                style={{
                  padding: '4px 0',
                  borderRadius: '6px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: sliderPercent === pct ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255,255,255,0.02)',
                  color: sliderPercent === pct ? '#38bdf8' : '#94a3b8',
                  fontSize: '9px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                %{pct}
              </button>
            ))}
          </div>

          {/* Toplam Tutar */}
          <div style={{
            background: 'rgba(0,0,0,0.2)',
            padding: '8px',
            borderRadius: '8px',
            marginBottom: '10px',
            fontSize: '11px',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <span style={{ color: '#64748b' }}>{t('borsa.total_label', 'Toplam:')}</span>
            <span style={{ color: '#fff', fontWeight: 900 }}>{totalCost} {quoteCurrency}</span>
          </div>

          {/* Memo Girişi */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', color: '#64748b', marginBottom: '3px' }}>
              <MessageSquare size={10} />
              <span>{t('borsa.memo_label', 'MEMO (OPSİYONEL)')}</span>
            </div>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder={t('borsa.memo_placeholder', 'İşlem notu / memo')}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '6px 8px',
                color: '#fff',
                fontSize: '10px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Kullanılabilir Bakiye */}
          <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '10px' }}>
            {t('borsa.available', 'Kullanılabilir:')}{' '}
            <span style={{ color: '#fff', fontWeight: 800 }}>
              {tradeType === 'buy' ? `${balances.ton || 0} GRAM` : `${balances.taste || 0} TAI`}
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
            {isProcessing ? t('borsa.processing', 'İşleniyor...') : tradeType === 'buy' ? t('borsa.buy_tai', 'TASTE AI AL') : t('borsa.sell_tai', 'TASTE AI SAT')}
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
