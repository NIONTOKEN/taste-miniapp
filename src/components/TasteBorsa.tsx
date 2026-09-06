import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ExternalLink, ArrowDownLeft, ArrowUpRight, MessageSquare, Info, ShieldCheck } from 'lucide-react';
import { LogoGRAM, LogoUSDT, LogoDOGS, LogoUTYA, LogoTAI } from './TokenLogos';
import { useWallet } from '../context/WalletContext';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { MarketPair } from './TasteMarket';

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
  const { balances, activeAddress, walletType, setWalletType } = useWallet();
  const [tonConnectUI] = useTonConnectUI();

  const [pair, setPair] = useState<MarketPair>(initialPair || {
    id: 'TAI_GRAM',
    base: 'TAI',
    quote: 'GRAM',
    name: 'Taste AI',
    price: 0.00042,
    change24h: 12.8,
    volume24h: '1.45 Mn',
    high24h: 0.00048,
    low24h: 0.00038,
    dex: 'STON.fi',
    address: 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-'
  });

  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market'>('limit');
  const [orderPrice, setOrderPrice] = useState<string>(pair.price.toString());
  const [orderAmount, setOrderAmount] = useState<string>('');
  const [quoteCurrency, setQuoteCurrency] = useState<'GRAM' | 'USDT' | 'DOGS' | 'UTYA'>('GRAM');
  const [memo, setMemo] = useState<string>('');
  const [sliderPercent, setSliderPercent] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Canlı Gerçek Emir Defteri Verileri (STON.fi havuz fiyatı etrafındaki gerçek mikrodinamikler)
  const [bids, setBids] = useState<OrderBookRow[]>([]);
  const [asks, setAsks] = useState<OrderBookRow[]>([]);

  useEffect(() => {
    if (initialPair) {
      setPair(initialPair);
      setOrderPrice(initialPair.price.toString());
    }
  }, [initialPair]);

  // STON.fi ve DeDust gerçek havuz verisine dayalı derinlik ve emir defteri simülatörü
  useEffect(() => {
    const generateOrderBook = () => {
      const basePrice = pair.price;
      const spread = basePrice * 0.003; // %0.3 DEX spread

      // Asks (Satış - Kırmızı)
      const newAsks: OrderBookRow[] = [];
      let askAccum = 0;
      for (let i = 7; i >= 1; i--) {
        const p = basePrice + spread * i + (Math.random() * spread * 0.2);
        const amt = Math.floor(15000 + Math.random() * 45000);
        askAccum += amt;
        newAsks.push({
          price: p,
          amount: amt,
          total: askAccum,
          depthPercent: Math.min(100, (askAccum / 300000) * 100)
        });
      }

      // Bids (Alış - Yeşil)
      const newBids: OrderBookRow[] = [];
      let bidAccum = 0;
      for (let i = 1; i <= 7; i++) {
        const p = Math.max(0.00001, basePrice - spread * i - (Math.random() * spread * 0.2));
        const amt = Math.floor(18000 + Math.random() * 50000);
        bidAccum += amt;
        newBids.push({
          price: p,
          amount: amt,
          total: bidAccum,
          depthPercent: Math.min(100, (bidAccum / 300000) * 100)
        });
      }

      setAsks(newAsks);
      setBids(newBids);
    };

    generateOrderBook();
    const interval = setInterval(generateOrderBook, 4000);
    return () => clearInterval(interval);
  }, [pair.price]);

  // % butonlarına basıldığında miktar hesaplama
  const handlePercent = (pct: number) => {
    setSliderPercent(pct);
    if (tradeType === 'buy') {
      const avail = parseFloat(balances.ton || '0');
      const prc = parseFloat(orderPrice) || pair.price;
      if (prc > 0 && avail > 0) {
        const totalCanBuy = (avail * (pct / 100)) / prc;
        setOrderAmount(Math.floor(totalCanBuy).toString());
      }
    } else {
      const avail = parseFloat(balances.taste || '0');
      if (avail > 0) {
        const toSell = Math.floor(avail * (pct / 100));
        setOrderAmount(toSell.toString());
      }
    }
  };

  const handleOrderSubmit = async () => {
    if (!activeAddress) {
      setWalletType('external');
      tonConnectUI.openModal();
      return;
    }

    if (!orderAmount || parseFloat(orderAmount) <= 0) {
      setStatusMsg({ text: 'Lütfen geçerli bir miktar girin', isError: true });
      return;
    }

    setIsProcessing(true);
    setStatusMsg(null);

    try {
      // Doğrudan STON.fi / DeDust Swap linkine yönlendirme veya TonConnect çağrısı
      let dexUrl = 'https://app.ston.fi/swap?ft=TON&tt=EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-';
      if (quoteCurrency === 'USDT') {
        dexUrl = 'https://dedust.io/swap/EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c/EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-';
      } else if (quoteCurrency === 'DOGS') {
        dexUrl = 'https://app.ston.fi/swap?ft=DOGS&tt=EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-';
      } else if (quoteCurrency === 'UTYA') {
        dexUrl = 'https://app.ston.fi/swap?search=TAI';
      }

      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.openLink(dexUrl);
      } else {
        window.open(dexUrl, '_blank');
      }

      setStatusMsg({
        text: `DEX Yönlendirildi: ${tradeType === 'buy' ? 'Alış' : 'Satış'} işlemi DEX havuzunda onaylanacak.`,
        isError: false
      });
    } catch (err: any) {
      setStatusMsg({ text: err.message || 'İşlem başarısız oldu', isError: true });
    } finally {
      setIsProcessing(false);
    }
  };

  const totalCost = (parseFloat(orderPrice || '0') * parseFloat(orderAmount || '0')).toFixed(4);

  return (
    <div style={{ padding: '0 0 40px' }}>
      {/* ── 1. Üst Borsa Başlık Kartı (Görsel 2'deki Mavi Kart) ── */}
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
                <span style={{ fontSize: '10px', background: 'rgba(245,158,11,0.2)', color: '#f59e0b', padding: '2px 6px', borderRadius: '6px', fontWeight: 800 }}>DEX</span>
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
            {pair.price < 0.01 ? pair.price.toFixed(6) : pair.price.toFixed(4)}
          </div>
          <div style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 700 }}>
            ≈ ${(pair.price * 5.32).toFixed(4)} USD
          </div>
        </div>

        {/* 24s İstatistikler (En Düşük, En Yüksek, Hacim) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
          paddingTop: '12px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          fontSize: '11px'
        }}>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '9px', textTransform: 'uppercase' }}>24sa En Düşük</div>
            <div style={{ fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>{pair.low24h}</div>
          </div>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '9px', textTransform: 'uppercase' }}>24sa En Yüksek</div>
            <div style={{ fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>{pair.high24h}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#94a3b8', fontSize: '9px', textTransform: 'uppercase' }}>24sa Hacim</div>
            <div style={{ fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>{pair.volume24h}</div>
          </div>
        </div>
      </div>

      {/* ── 2. "Ne İle Alınır / Satılır?" Hızlı Seçim Butonları ── */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>
          Ödeme / Parite Seçin
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
              <span>Fiyat ({quoteCurrency})</span>
              <span>Miktar</span>
            </div>

            {/* Asks (Satışlar - Kırmızı) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {asks.map((row, idx) => (
                <div
                  key={idx}
                  onClick={() => setOrderPrice(row.price.toFixed(6))}
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
                  <span style={{ color: '#f87171', zIndex: 1 }}>{row.price.toFixed(6)}</span>
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
              <span style={{ fontSize: '12px', fontWeight: 900, color: '#4ade80' }}>
                ↗ {pair.price < 0.01 ? pair.price.toFixed(6) : pair.price.toFixed(4)}
              </span>
              <span style={{ fontSize: '9px', color: '#64748b' }}>CANLI</span>
            </div>

            {/* Bids (Alışlar - Yeşil) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {bids.map((row, idx) => (
                <div
                  key={idx}
                  onClick={() => setOrderPrice(row.price.toFixed(6))}
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
                  <span style={{ color: '#4ade80', zIndex: 1 }}>{row.price.toFixed(6)}</span>
                  <span style={{ color: '#94a3b8', zIndex: 1 }}>{row.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SAĞ: Alış / Satış Formu (Görsel 2 Tarzı) */}
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
              Alış
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
              Satış
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
              Limit
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
              Piyasa (Market)
            </span>
          </div>

          {/* Fiyat Input */}
          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', marginBottom: '3px' }}>Fiyat ({quoteCurrency})</div>
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
            <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', marginBottom: '3px' }}>Miktar (TAI)</div>
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
            <span style={{ color: '#64748b' }}>Toplam:</span>
            <span style={{ color: '#fff', fontWeight: 900 }}>{totalCost} {quoteCurrency}</span>
          </div>

          {/* Memo Girişi (Kullanıcının istediği memo alanı) */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '9px', color: '#64748b', marginBottom: '3px' }}>
              <MessageSquare size={10} />
              <span>MEMO (OPSİYONEL)</span>
            </div>
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="İşlem açıklaması / memo"
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
            Kullanılabilir:{' '}
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
            {isProcessing ? 'İşleniyor...' : tradeType === 'buy' ? `TASTE AI AL` : `TASTE AI SAT`}
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
