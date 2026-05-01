import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera, QrCode, ArrowLeft, CheckCircle2, Wallet, Banknote,
  RefreshCw, AlertCircle, ExternalLink, ChevronDown
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { toNano, Address, beginCell } from '@ton/core';
import { useWallet } from '../context/WalletContext';
import { internalWalletService } from '../services/internalWallet';
import { apiService } from '../services/api';
import { createTastePayInvoice, markTastePayInvoicePaid } from '../services/supabase';

// ──────────────────────────────────────────────────────────────────────────
// Config
// ──────────────────────────────────────────────────────────────────────────
const JETTON_MASTER_ADDRESS =
  (import.meta.env.VITE_JETTON_ADDRESS as string) ||
  'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-';

// OTC admin wallet — all TastePay payments land here (centralized settlement)
const OTC_ADMIN_WALLET =
  (import.meta.env.VITE_OTC_WALLET as string) ||
  'UQB-Q4l7vp-RiXhSfziofwYpZ-Gv5Gs4xI9ZL3_tghEtjFpr';

// Multi-currency catalogue (15 currencies)
const CURRENCIES: Record<string, { symbol: string; name: string; flag: string }> = {
  TRY: { symbol: '₺',   name: 'Türk Lirası',      flag: '🇹🇷' },
  USD: { symbol: '$',   name: 'US Dollar',        flag: '🇺🇸' },
  EUR: { symbol: '€',   name: 'Euro',             flag: '🇪🇺' },
  GBP: { symbol: '£',   name: 'British Pound',    flag: '🇬🇧' },
  RUB: { symbol: '₽',   name: 'Russian Ruble',    flag: '🇷🇺' },
  AED: { symbol: 'د.إ', name: 'UAE Dirham',       flag: '🇦🇪' },
  SAR: { symbol: '﷼',   name: 'Saudi Riyal',      flag: '🇸🇦' },
  IQD: { symbol: 'ع.د', name: 'Iraqi Dinar',      flag: '🇮🇶' },
  JPY: { symbol: '¥',   name: 'Japanese Yen',     flag: '🇯🇵' },
  CNY: { symbol: '¥',   name: 'Chinese Yuan',     flag: '🇨🇳' },
  INR: { symbol: '₹',   name: 'Indian Rupee',     flag: '🇮🇳' },
  UAH: { symbol: '₴',   name: 'Ukrainian Hryvnia',flag: '🇺🇦' },
  AZN: { symbol: '₼',   name: 'Azerbaijan Manat', flag: '🇦🇿' },
  KZT: { symbol: '₸',   name: 'Kazakh Tenge',     flag: '🇰🇿' },
  BRL: { symbol: 'R$',  name: 'Brazilian Real',   flag: '🇧🇷' },
};
type CurrencyCode = keyof typeof CURRENCIES;

// ──────────────────────────────────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────────────────────────────────
export function TastePay({ onClose }: { onClose: () => void }) {
  const { t, i18n } = useTranslation();
  const [mode, setMode] = useState<'menu' | 'scan' | 'receive' | 'confirm'>('menu');

  // Wallet integration
  const { walletType, activeAddress, balances, refreshBalances } = useWallet();
  const [tonConnectUI] = useTonConnectUI();

  // Live rates
  const [tastePriceUsd, setTastePriceUsd] = useState<number>(0.00135);
  const [fiatRates, setFiatRates] = useState<Record<string, number>>({ USD: 1, TRY: 43.87, EUR: 0.92 });
  const [ratesLoading, setRatesLoading] = useState<boolean>(true);
  const [ratesUpdatedAt, setRatesUpdatedAt] = useState<number>(0);

  // Receive (merchant) state
  const [receiveAmount, setReceiveAmount] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>('TRY');
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [invoiceId] = useState<string>(() => `INV-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 1000)}`);

  // Scan state
  const [scannedPayload, setScannedPayload] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [paymentError, setPaymentError] = useState<string>('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const jsQRRef = useRef<any>(null);

  // Load jsQR dynamically
  useEffect(() => {
    import('jsqr').then((mod) => {
      jsQRRef.current = mod.default;
    }).catch(() => {
      console.error('jsQR could not be loaded');
    });
  }, []);

  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setScanning(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    setScanning(false);

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setScanning(true);
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError(t('tastepay.cam_denied'));
      } else if (err.name === 'NotFoundError') {
        setCameraError(t('tastepay.cam_not_found'));
      } else {
        setCameraError(t('tastepay.cam_failed') +  + err.message);
      }
    }
  }, []);

  // ────────────────────────────────────────────────────────────────────────
  // Fetch live rates on mount + periodic refresh
  // ────────────────────────────────────────────────────────────────────────
  const fetchRates = async () => {
    setRatesLoading(true);
    try {
      const [tasteData, fiatData] = await Promise.all([
        apiService.getTastePrice(),
        apiService.getMultiFiatRates(),
      ]);
      if (tasteData.price > 0) setTastePriceUsd(tasteData.price);
      if (fiatData && Object.keys(fiatData).length > 0) setFiatRates(fiatData);
      setRatesUpdatedAt(Date.now());
    } catch (e) {
      console.error('[TastePay] Rate fetch failed', e);
    } finally {
      setRatesLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const timer = setInterval(fetchRates, 60_000); // refresh every 60s
    return () => clearInterval(timer);
  }, []);

  // ────────────────────────────────────────────────────────────────────────
  // QR Scanner — Telegram native öncelikli (Mini App'te %100 çalışır),
  // fallback olarak html5-qrcode (web/tarayıcı testleri için)
  // ────────────────────────────────────────────────────────────────────────
  const parseQrData = (decodedText: string): boolean => {
    try {
      if (!decodedText.startsWith('tastepay://')) return false;
      const url = new URL(decodedText);
      const data = {
        amount: url.searchParams.get('amount') || '0',
        currency: url.searchParams.get('currency') || 'USD',
        tasteAmount: url.searchParams.get('tasteAmount') || '0',
        memo: url.searchParams.get('memo') || '',
        address: url.searchParams.get('address') || OTC_ADMIN_WALLET,
      };
      setScannedPayload(data);
      setMode('confirm');
      return true;
    } catch (e) {
      console.error('[TastePay] Invalid QR format', e);
      return false;
    }
  };

  const openTelegramScanner = (): boolean => {
    const tg = (window as any).Telegram?.WebApp;
    // showScanQrPopup only works reliably on mobile platforms
    const isMobile = tg?.platform === 'android' || tg?.platform === 'ios';
    if (!tg?.showScanQrPopup || !isMobile) return false;
    try {
      tg.showScanQrPopup(
        { text: 'TASTE Pay kodunu okutun' },
        (data: string) => {
          if (parseQrData(data)) {
            tg.closeScanQrPopup();
            return true;
          }
          return false;
        }
      );
      return true;
    } catch (e) {
      console.error('[TastePay] Telegram scanner failed', e);
      return false;
    }
  };

  // Scan loop using jsQR
  useEffect(() => {
    if (!scanning || mode !== 'scan') return;

    const tick = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const jsQR = jsQRRef.current;

      if (video && canvas && jsQR && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });

          if (code) {
            const decodedText = code.data;
            if (parseQrData(decodedText)) {
              stopCamera();
              return; // stop loop
            }
          }
        }
      }
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [scanning, mode, stopCamera]);

  useEffect(() => {
    if (mode === 'scan') {
      const openedNative = openTelegramScanner();
      if (!openedNative) {
        startCamera();
      }
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [mode, startCamera, stopCamera]);

  // ────────────────────────────────────────────────────────────────────────
  // Receive-mode calculations
  // ────────────────────────────────────────────────────────────────────────
  const usdPerFiat = fiatRates[currency] || 1;                          // 1 USD = X FIAT
  const tastePriceInFiat = tastePriceUsd * usdPerFiat;                  // 1 TASTE = X FIAT
  const calculatedTaste = receiveAmount && tastePriceInFiat > 0
    ? (parseFloat(receiveAmount) / tastePriceInFiat).toFixed(2)
    : '0.00';

  const qrData = `tastepay://pay?address=${OTC_ADMIN_WALLET}` +
    `&amount=${receiveAmount || 0}` +
    `&currency=${currency}` +
    `&tasteAmount=${calculatedTaste}` +
    `&memo=${invoiceId}`;

  // Merchant QR'ı ilk gösterdiğinde Supabase'e invoice kaydı (fire-and-forget)
  const invoiceSavedRef = useRef<string | null>(null);
  useEffect(() => {
    if (mode !== 'receive') return;
    const amt = parseFloat(receiveAmount);
    const tasteAmt = parseFloat(calculatedTaste);
    if (!amt || !tasteAmt || tastePriceInFiat <= 0) return;

    // Aynı invoice için tekrar tekrar yazma
    const key = `${invoiceId}:${amt}:${currency}`;
    if (invoiceSavedRef.current === key) return;
    invoiceSavedRef.current = key;

    // Telegram kullanıcı adını Telegram WebApp API'den al (varsa)
    const tg = (window as any).Telegram?.WebApp;
    const merchantName = tg?.initDataUnsafe?.user?.username
      || tg?.initDataUnsafe?.user?.first_name
      || undefined;

    createTastePayInvoice({
      invoice_code: invoiceId,
      merchant_wallet: OTC_ADMIN_WALLET,
      merchant_name: merchantName,
      fiat_amount: amt,
      fiat_currency: currency,
      taste_amount: tasteAmt,
      exchange_rate: tastePriceInFiat,
      memo: `TastePay ${invoiceId}`,
    }).catch(() => { /* silent */ });
  }, [mode, receiveAmount, currency, calculatedTaste, tastePriceInFiat, invoiceId]);

  // ────────────────────────────────────────────────────────────────────────
  // REAL Payment — TON Connect jetton transfer to OTC wallet
  // ────────────────────────────────────────────────────────────────────────
  const handlePayment = async () => {
    if (!scannedPayload) return;

    // Pre-flight checks
    if (!activeAddress) {
      setPaymentError(t('tastepay.err_wallet'));
      setPaymentStatus('error');
      return;
    }

    const tasteAmount = parseFloat(scannedPayload.tasteAmount);
    if (!tasteAmount || tasteAmount <= 0) {
      setPaymentError(t('tastepay.err_amount'));
      setPaymentStatus('error');
      return;
    }

    const userTasteBal = parseFloat((balances.taste || '0').replace(/,/g, ''));
    if (userTasteBal < tasteAmount) {
      setPaymentError(t('tastepay.err_balance').replace('{{req}}', tasteAmount.toString()).replace('{{avail}}', userTasteBal.toString()));
      setPaymentStatus('error');
      return;
    }

    const userTonBal = parseFloat(balances.ton || '0');
    if (userTonBal < 0.2) {
      setPaymentError(t('tastepay.err_fee'));
      setPaymentStatus('error');
      return;
    }

    setPaymentStatus('processing');
    setPaymentError('');

    try {
      const memo = scannedPayload.memo || invoiceId;
      const destinationAddress = scannedPayload.address || OTC_ADMIN_WALLET;

      if (walletType === 'internal') {
        // Internal wallet flow (if user is using imported seed phrase)
        await internalWalletService.sendTaste(
          destinationAddress,
          tasteAmount.toString(),
          JETTON_MASTER_ADDRESS,
          memo
        );
      } else {
        // External wallet flow via TON Connect (Tonkeeper, MyTonWallet, etc.)
        const userRaw = Address.parse(activeAddress).toRawString();
        const res = await fetch(`https://tonapi.io/v2/accounts/${userRaw}/jettons/${JETTON_MASTER_ADDRESS}`);
        const data = await res.json();
        const userJettonWallet = data?.wallet_address?.address;

        if (!userJettonWallet) {
          throw new Error('TASTE jetton cüzdan adresi alınamadı');
        }

        // Forward payload (invoice memo visible on-chain)
        const forwardPayload = beginCell()
          .storeUint(0, 32)
          .storeStringTail(`TastePay ${memo}`)
          .endCell();

        const body = beginCell()
          .storeUint(0xf8a7ea5, 32)              // jetton transfer op
          .storeUint(0, 64)                      // query_id
          .storeCoins(toNano(tasteAmount.toString()))
          .storeAddress(Address.parse(destinationAddress))
          .storeAddress(Address.parse(activeAddress))
          .storeBit(false)                       // no custom payload
          .storeCoins(toNano('0.05'))            // forward_ton_amount (for notification)
          .storeBit(true)                        // has forward_payload
          .storeRef(forwardPayload)
          .endCell();

        const transaction = {
          validUntil: Math.floor(Date.now() / 1000) + 300,
          messages: [
            {
              address: Address.parse(userJettonWallet).toString(),
              amount: toNano('0.15').toString(),
              payload: body.toBoc().toString('base64'),
            },
          ],
        };

        await tonConnectUI.sendTransaction(transaction);
      }

      // Supabase'e "paid" işareti (fire-and-forget)
      try {
        const tg = (window as any).Telegram?.WebApp;
        const payerTg = tg?.initDataUnsafe?.user?.username || undefined;
        await markTastePayInvoicePaid(
          scannedPayload.memo || invoiceId,
          activeAddress,
          payerTg
        );
      } catch { /* silent */ }

      setPaymentStatus('success');
      setTimeout(() => refreshBalances(), 5000);
    } catch (e: any) {
      console.error('[TastePay] Payment error', e);
      const msg = e?.message || 'Bilinmeyen hata';
      setPaymentError(
        msg.toLowerCase().includes('reject') || msg.toLowerCase().includes('cancel')
          ? 'İşlem kullanıcı tarafından iptal edildi'
          : `Hata: ${msg}`
      );
      setPaymentStatus('error');
    }
  };

  // ────────────────────────────────────────────────────────────────────────
  // RENDER
  // ────────────────────────────────────────────────────────────────────────
  return (
    <div
      data-testid="tastepay-modal"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        zIndex: 9999,
        backgroundColor: '#0a0f1c',
        color: 'white',
        display: 'flex', flexDirection: 'column',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '16px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: '#121a2f',
      }}>
        <button
          data-testid="tastepay-back-btn"
          onClick={() => (mode === 'menu' ? onClose() : setMode('menu'))}
          style={{ background: 'none', border: 'none', padding: '8px', marginRight: '8px', cursor: 'pointer' }}
        >
          <ArrowLeft size={24} color="#22d3ee" />
        </button>
        <h1 style={{
          fontSize: '20px', fontWeight: 'bold', margin: 0, flex: 1,
          background: 'linear-gradient(to right, #22d3ee, #c084fc)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          TASTE Pay
        </h1>

        {/* Live price badge */}
        <div
          data-testid="tastepay-live-price"
          style={{
            fontSize: '11px', color: ratesLoading ? '#fbbf24' : '#4ade80',
            display: 'flex', alignItems: 'center', gap: '4px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            padding: '4px 10px', borderRadius: '999px',
          }}
        >
          <div style={{
            width: '6px', height: '6px', borderRadius: '50%',
            backgroundColor: ratesLoading ? '#fbbf24' : '#4ade80',
            animation: ratesLoading ? 'pulse 1s infinite' : 'none',
          }} />
          1 TASTE = ${tastePriceUsd.toFixed(5)}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        <AnimatePresence mode="wait">

          {/* ─────────────────────── MENU MODE ─────────────────────── */}
          {mode === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{
                display: 'flex', flexDirection: 'column', gap: '24px',
                minHeight: '100%', justifyContent: 'center', paddingBottom: '80px',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{
                  width: '80px', height: '80px',
                  background: 'linear-gradient(135deg, #06b6d4, #9333ea)',
                  borderRadius: '24px',
                  margin: '0 auto 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(34,211,238,0.3)',
                }}>
                  <Wallet size={40} color="white" />
                </div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 8px 0' }}>
                  {t('tastepay.title')}
                </h2>
                <p style={{ color: '#9ca3af', margin: 0, fontSize: '13px' }}>
                  {t('tastepay.desc')}
                </p>
              </div>

              {/* Wallet status */}
              {activeAddress ? (
                <div
                  data-testid="tastepay-wallet-status"
                  style={{
                    backgroundColor: 'rgba(34,197,94,0.08)',
                    border: '1px solid rgba(34,197,94,0.25)',
                    borderRadius: '12px', padding: '10px 14px',
                    fontSize: '12px', color: '#86efac',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                >
                  <span>{t('tastepay.wallet_connected')}</span>
                  <span style={{ color: '#22d3ee', fontWeight: 'bold' }}>
                    {balances.taste} TASTE
                  </span>
                </div>
              ) : (
                <div style={{
                  backgroundColor: 'rgba(251,191,36,0.08)',
                  border: '1px solid rgba(251,191,36,0.25)',
                  borderRadius: '12px', padding: '10px 14px',
                  fontSize: '12px', color: '#fbbf24',
                  display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <AlertCircle size={14} />
                  <span>{t('tastepay.wallet_required')}</span>
                </div>
              )}

              <button
                data-testid="tastepay-scan-mode-btn"
                onClick={() => setMode('scan')}
                style={{
                  background: 'linear-gradient(to right, #06b6d4, #2563eb)',
                  borderRadius: '20px', padding: '22px',
                  display: 'flex', alignItems: 'center', gap: '16px',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  boxShadow: '0 10px 15px -3px rgba(6,182,212,0.2)',
                }}
              >
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '14px', borderRadius: '50%' }}>
                  <Camera size={30} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
                    {t('tastepay.scan')}
                  </div>
                  <div style={{ color: '#cffafe', fontSize: '13px' }}>
                    {t('tastepay.scan_desc')}
                  </div>
                </div>
              </button>

              <button
                data-testid="tastepay-receive-mode-btn"
                onClick={() => setMode('receive')}
                style={{
                  background: 'linear-gradient(to right, #a855f7, #db2777)',
                  borderRadius: '20px', padding: '22px',
                  display: 'flex', alignItems: 'center', gap: '16px',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  boxShadow: '0 10px 15px -3px rgba(168,85,247,0.2)',
                }}
              >
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '14px', borderRadius: '50%' }}>
                  <QrCode size={30} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
                    Ödeme Al
                  </div>
                  <div style={{ color: '#f3e8ff', fontSize: '13px' }}>
                    {t('tastepay.receive_desc')}
                  </div>
                </div>
              </button>
            </motion.div>
          )}

          {/* ─────────────────────── RECEIVE (MERCHANT) MODE ─────────────────────── */}
          {mode === 'receive' && (
            <motion.div
              key="receive"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '12px' }}
            >
              <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 20px 0' }}>
                {t('tastepay.receive_amount_title')}
              </h2>

              {/* Currency selector */}
              <div style={{ width: '100%', maxWidth: '340px', marginBottom: '18px', position: 'relative' }}>
                <button
                  data-testid="tastepay-currency-selector"
                  onClick={() => setShowCurrencyPicker(v => !v)}
                  style={{
                    width: '100%', padding: '14px 16px', borderRadius: '12px',
                    backgroundColor: '#1a2235', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white', cursor: 'pointer', fontSize: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>{CURRENCIES[currency].flag}</span>
                    <span style={{ fontWeight: 'bold' }}>{currency}</span>
                    <span style={{ color: '#9ca3af', fontSize: '13px' }}>{CURRENCIES[currency].name}</span>
                  </span>
                  <ChevronDown size={18} color="#9ca3af"
                    style={{ transform: showCurrencyPicker ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform .2s' }}
                  />
                </button>

                {showCurrencyPicker && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                    backgroundColor: '#121a2f', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px', maxHeight: '280px', overflowY: 'auto', zIndex: 10,
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  }}>
                    {Object.entries(CURRENCIES).map(([code, info]) => (
                      <button
                        key={code}
                        data-testid={`tastepay-currency-${code}`}
                        onClick={() => { setCurrency(code as CurrencyCode); setShowCurrencyPicker(false); }}
                        style={{
                          width: '100%', padding: '12px 16px', border: 'none', background: 'transparent',
                          color: 'white', fontSize: '14px', cursor: 'pointer', textAlign: 'left',
                          display: 'flex', alignItems: 'center', gap: '10px',
                          borderBottom: '1px solid rgba(255,255,255,0.05)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(34,211,238,0.1)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        <span style={{ fontSize: '18px' }}>{info.flag}</span>
                        <span style={{ fontWeight: 'bold', width: '45px' }}>{code}</span>
                        <span style={{ color: '#9ca3af', flex: 1 }}>{info.name}</span>
                        <span style={{ color: '#22d3ee' }}>{info.symbol}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Amount input */}
              <div style={{ position: 'relative', marginBottom: '22px', width: '100%', maxWidth: '340px' }}>
                <span style={{
                  position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)',
                  fontSize: '22px', color: '#9ca3af',
                }}>
                  {CURRENCIES[currency].symbol}
                </span>
                <input
                  data-testid="tastepay-amount-input"
                  type="number"
                  value={receiveAmount}
                  onChange={(e) => setReceiveAmount(e.target.value)}
                  placeholder="0.00"
                  style={{
                    width: '100%', backgroundColor: '#1a2235',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px', padding: '16px 16px 16px 48px',
                    fontSize: '28px', fontWeight: 'bold',
                    color: 'white', textAlign: 'center', boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* QR or placeholder */}
              {parseFloat(receiveAmount) > 0 ? (
                <>
                  <div
                    data-testid="tastepay-qr-display"
                    style={{
                      backgroundColor: 'white', padding: '16px', borderRadius: '24px',
                      boxShadow: '0 0 40px rgba(34,211,238,0.2)',
                    }}
                  >
                    <QRCodeSVG value={qrData} size={220} level="H" includeMargin />
                    <div style={{ textAlign: 'center', marginTop: '14px', color: 'black' }}>
                      <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#6b7280' }}>
                        {t('tastepay.to_receive')}
                      </div>
                      <div style={{ fontSize: '22px', fontWeight: 900, color: '#0891b2' }}>
                        {calculatedTaste} TASTE
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: '14px', fontSize: '11px', color: '#6b7280', textAlign: 'center' }}>
                    {t('tastepay.invoice_no')} <span style={{ color: '#22d3ee' }}>{invoiceId}</span>
                    <br />
                    {t('tastepay.live_rate')} {tastePriceInFiat.toFixed(4)} {currency}
                  </div>
                </>
              ) : (
                <div style={{
                  width: '252px', height: '252px',
                  border: '2px dashed rgba(255,255,255,0.2)',
                  borderRadius: '24px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#6b7280', fontSize: '15px',
                }}>
                  {t('tastepay.enter_amount')}
                </div>
              )}
            </motion.div>
          )}

          {/* ─────────────────────── SCAN (CUSTOMER) MODE ─────────────────────── */}
          {mode === 'scan' && (
            <motion.div
              key="scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: 'flex', flexDirection: 'column',
                minHeight: '100%', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <canvas ref={canvasRef} style={{ display: 'none' }} />
              {cameraError ? (
                <div style={{
                  width: '100%', maxWidth: '320px', padding: '24px',
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '20px', textAlign: 'center'
                }}>
                  <AlertCircle size={48} color="#f87171" style={{ marginBottom: '16px', margin: '0 auto' }} />
                  <p style={{ color: '#f87171', marginBottom: '20px', fontSize: '14px' }}>{cameraError}</p>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                    <button
                      onClick={startCamera}
                      style={{
                        background: 'linear-gradient(to right, #06b6d4, #2563eb)',
                        border: 'none', borderRadius: '12px', padding: '12px 24px',
                        color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px'
                      }}
                    >
                      {t('tastepay.retry_cam')}
                    </button>
                    {(window as any).Telegram?.WebApp?.showScanQrPopup && (
                      <button
                        onClick={() => openTelegramScanner()}
                        style={{
                          background: 'rgba(255,255,255,0.1)',
                          border: 'none', borderRadius: '12px', padding: '12px 24px',
                          color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px'
                        }}
                      >
                        {t('tastepay.native_cam')}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div style={{
                    width: '100%', maxWidth: '320px', aspectRatio: '1/1',
                    backgroundColor: 'black', borderRadius: '24px', overflow: 'hidden', position: 'relative',
                    border: '4px solid rgba(34,211,238,0.5)', boxShadow: '0 0 40px rgba(34,211,238,0.2)',
                  }}>
                    {!scanning && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center',
                        background: '#0a0f1c', gap: '12px'
                      }}>
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}>
                          <RefreshCw size={40} color="#22d3ee" />
                        </motion.div>
                        <span style={{ color: '#9ca3af', fontSize: '14px' }}>Kamera açılıyor...</span>
                      </div>
                    )}
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      style={{
                        width: '100%', height: '100%',
                        objectFit: 'cover',
                        display: scanning ? 'block' : 'none'
                      }}
                    />
                    {scanning && (
                      <>
                        <div style={{ position: 'absolute', top: '15%', left: '15%', width: '30px', height: '30px', borderTop: '4px solid #22d3ee', borderLeft: '4px solid #22d3ee', borderRadius: '4px 0 0 0' }} />
                        <div style={{ position: 'absolute', top: '15%', right: '15%', width: '30px', height: '30px', borderTop: '4px solid #22d3ee', borderRight: '4px solid #22d3ee', borderRadius: '0 4px 0 0' }} />
                        <div style={{ position: 'absolute', bottom: '15%', left: '15%', width: '30px', height: '30px', borderBottom: '4px solid #22d3ee', borderLeft: '4px solid #22d3ee', borderRadius: '0 0 0 4px' }} />
                        <div style={{ position: 'absolute', bottom: '15%', right: '15%', width: '30px', height: '30px', borderBottom: '4px solid #22d3ee', borderRight: '4px solid #22d3ee', borderRadius: '0 0 4px 0' }} />
                        <motion.div
                          animate={{ top: ['20%', '80%', '20%'] }}
                          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                          style={{ position: 'absolute', left: '10%', right: '10%', height: '2px', background: 'linear-gradient(to right, transparent, #22d3ee, transparent)' }}
                        />
                      </>
                    )}
                  </div>
                  <p style={{ marginTop: '22px', textAlign: 'center', color: '#9ca3af', fontSize: '13px' }}>
                    {t('tastepay.scan_qr_text')}
                  </p>
                </>
              )}
            </motion.div>
          )}

          {/* ─────────────────────── CONFIRM MODE ─────────────────────── */}
          {mode === 'confirm' && scannedPayload && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '20px' }}
            >
              {paymentStatus === 'idle' && (
                <>
                  <div style={{
                    width: '72px', height: '72px', backgroundColor: 'rgba(59,130,246,0.2)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '20px',
                  }}>
                    <Banknote size={36} color="#60a5fa" />
                  </div>
                  <h2 style={{ fontSize: '22px', fontWeight: 'bold', margin: '0 0 6px 0' }}>
                    Ödeme Onayı
                  </h2>
                  <p style={{ color: '#9ca3af', marginBottom: '22px', fontSize: '13px' }}>
                    İşletmeye yapılacak ödeme tutarı
                  </p>

                  <div style={{
                    backgroundColor: '#1a2235', width: '100%', maxWidth: '340px',
                    borderRadius: '16px', padding: '20px', marginBottom: '20px',
                    border: '1px solid rgba(255,255,255,0.1)', boxSizing: 'border-box',
                  }}>
                    <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                      <div style={{ fontSize: '34px', fontWeight: 900, color: 'white' }}>
                        {scannedPayload.amount} {scannedPayload.currency}
                      </div>
                      <div style={{ color: '#22d3ee', marginTop: '6px', fontWeight: 'bold', fontSize: '15px' }}>
                        ≈ {scannedPayload.tasteAmount} TASTE
                      </div>
                    </div>
                    <div style={{
                      borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px',
                      fontSize: '12px', color: '#9ca3af',
                      display: 'flex', flexDirection: 'column', gap: '6px',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{t('tastepay.invoice_no')}</span>
                        <span style={{ color: 'white' }}>{scannedPayload.memo}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Alıcı:</span>
                        <span style={{ color: 'white', fontSize: '11px' }}>
                          {scannedPayload.address.slice(0, 6)}...{scannedPayload.address.slice(-6)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Senin Bakiyen:</span>
                        <span style={{ color: '#22d3ee' }}>{balances.taste} TASTE</span>
                      </div>
                    </div>
                  </div>

                  <button
                    data-testid="tastepay-confirm-btn"
                    onClick={handlePayment}
                    disabled={!activeAddress}
                    style={{
                      width: '100%', maxWidth: '340px', padding: '16px',
                      background: activeAddress
                        ? 'linear-gradient(to right, #06b6d4, #2563eb)'
                        : 'rgba(107,114,128,0.3)',
                      borderRadius: '12px', fontWeight: 'bold', fontSize: '17px',
                      color: 'white', border: 'none',
                      cursor: activeAddress ? 'pointer' : 'not-allowed',
                      boxShadow: activeAddress ? '0 0 20px rgba(34,211,238,0.4)' : 'none',
                    }}
                  >
                    {activeAddress ? 'Onayla ve Öde' : 'Önce Cüzdan Bağla'}
                  </button>
                </>
              )}

              {paymentStatus === 'processing' && (
                <div
                  data-testid="tastepay-status-processing"
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', minHeight: '260px',
                  }}
                >
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <RefreshCw size={60} color="#22d3ee" style={{ marginBottom: '20px' }} />
                  </motion.div>
                  <h3 style={{ fontSize: '19px', fontWeight: 'bold', margin: 0 }}>
                    Ödeme {t('tastepay.btn_processing')}
                  </h3>
                  <p style={{ color: '#9ca3af', marginTop: '8px', fontSize: '13px' }}>
                    Lütfen cüzdan uygulamanızdan onaylayın
                  </p>
                </div>
              )}

              {paymentStatus === 'success' && (
                <motion.div
                  data-testid="tastepay-status-success"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', minHeight: '260px', textAlign: 'center',
                  }}
                >
                  <div style={{
                    width: '90px', height: '90px', backgroundColor: 'rgba(34,197,94,0.2)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '20px',
                  }}>
                    <CheckCircle2 size={56} color="#4ade80" />
                  </div>
                  <h3 style={{ fontSize: '28px', fontWeight: 900, color: 'white', margin: '0 0 6px 0' }}>
                    {t('tastepay.success_title')}
                  </h3>
                  <p style={{ color: '#9ca3af', margin: 0, fontSize: '13px' }}>
                    {t('tastepay.success_desc')}
                  </p>

                  <a
                    data-testid="tastepay-view-tx-link"
                    href={`https://tonviewer.com/${activeAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      marginTop: '20px', color: '#22d3ee', fontSize: '13px',
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      textDecoration: 'none',
                    }}
                  >
                    {t('tastepay.view_explorer')} <ExternalLink size={14} />
                  </a>

                  <button
                    data-testid="tastepay-done-btn"
                    onClick={() => {
                      setMode('menu');
                      setPaymentStatus('idle');
                      setScannedPayload(null);
                    }}
                    style={{
                      marginTop: '24px', padding: '12px 28px',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px', fontWeight: 'bold', color: 'white',
                      border: 'none', cursor: 'pointer',
                    }}
                  >
                    {t('tastepay.back_menu')}
                  </button>
                </motion.div>
              )}

              {paymentStatus === 'error' && (
                <motion.div
                  data-testid="tastepay-status-error"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center', minHeight: '260px', textAlign: 'center',
                  }}
                >
                  <div style={{
                    width: '84px', height: '84px', backgroundColor: 'rgba(239,68,68,0.2)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '20px',
                  }}>
                    <AlertCircle size={50} color="#f87171" />
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 900, color: 'white', margin: '0 0 6px 0' }}>
                    {t('tastepay.fail_title')}
                  </h3>
                  <p style={{ color: '#f87171', margin: 0, fontSize: '13px', maxWidth: '300px' }}>
                    {paymentError}
                  </p>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
                    <button
                      data-testid="tastepay-retry-btn"
                      onClick={() => setPaymentStatus('idle')}
                      style={{
                        padding: '12px 22px',
                        background: 'linear-gradient(to right, #06b6d4, #2563eb)',
                        borderRadius: '12px', fontWeight: 'bold', color: 'white',
                        border: 'none', cursor: 'pointer',
                      }}
                    >
                      {t('tastepay.retry_cam')}
                    </button>
                    <button
                      onClick={() => {
                        setMode('menu');
                        setPaymentStatus('idle');
                        setScannedPayload(null);
                      }}
                      style={{
                        padding: '12px 22px', backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '12px', fontWeight: 'bold', color: 'white',
                        border: 'none', cursor: 'pointer',
                      }}
                    >
                      {t('tastepay.cancel')}
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
