import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, QrCode, ArrowLeft, CheckCircle2, Wallet, XCircle, Banknote, RefreshCw } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';

// Mock Exchange Rates for MVP
const RATES = {
  USD: { rate: 0.05, symbol: '$' }, // 1 TASTE = $0.05
  TRY: { rate: 1.625, symbol: '₺' }, // 1 TASTE = 1.625 TRY (0.05 * 32.5)
  EUR: { rate: 0.046, symbol: '€' }, // 1 TASTE = 0.046 EUR
};

const OTC_ADMIN_WALLET = "UQ...OTC...ADMIN...ADDRESS"; // Placeholder for the actual OTC wallet

export function TastePay({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<'menu' | 'scan' | 'receive' | 'confirm'>('menu');
  
  // Receive State
  const [receiveAmount, setReceiveAmount] = useState('');
  const [currency, setCurrency] = useState<'TRY' | 'USD' | 'EUR'>('TRY');
  
  // Scan State
  const [scannedPayload, setScannedPayload] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (mode === 'scan') {
      // Initialize Scanner
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 }, supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA] },
        /* verbose= */ false
      );
      scannerRef.current = scanner;

      scanner.render(
        (decodedText) => {
          try {
            // Expected format: tastepay://pay?amount=100&currency=TRY&tasteAmount=61.5&memo=INV-123
            if (decodedText.startsWith('tastepay://')) {
              const url = new URL(decodedText);
              const data = {
                amount: url.searchParams.get('amount'),
                currency: url.searchParams.get('currency'),
                tasteAmount: url.searchParams.get('tasteAmount'),
                memo: url.searchParams.get('memo'),
                address: url.searchParams.get('address'),
              };
              setScannedPayload(data);
              setMode('confirm');
              scanner.clear();
            }
          } catch (e) {
            console.error("Invalid QR format");
          }
        },
        (error) => {
          // Ignore frequent scan errors
        }
      );

      return () => {
        if (scannerRef.current) {
          scannerRef.current.clear().catch(e => console.error(e));
        }
      };
    }
  }, [mode]);

  const handleSimulatePayment = () => {
    setPaymentStatus('processing');
    setTimeout(() => {
      setPaymentStatus('success');
      // In a real app, here you would call the TON SDK to send transaction to OTC_ADMIN_WALLET
    }, 2000);
  };

  const calculatedTaste = receiveAmount ? (parseFloat(receiveAmount) / RATES[currency].rate).toFixed(2) : '0.00';
  const qrData = `tastepay://pay?address=${OTC_ADMIN_WALLET}&amount=${receiveAmount}&currency=${currency}&tasteAmount=${calculatedTaste}&memo=INV-${Math.floor(Math.random() * 10000)}`;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 9999,
      backgroundColor: '#0a0f1c',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '16px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: '#121a2f'
      }}>
        <button onClick={() => mode === 'menu' ? onClose() : setMode('menu')} style={{ background: 'none', border: 'none', padding: '8px', marginRight: '8px', cursor: 'pointer' }}>
          <ArrowLeft size={24} color="#22d3ee" />
        </button>
        <h1 style={{
          fontSize: '20px', fontWeight: 'bold', margin: 0,
          background: 'linear-gradient(to right, #22d3ee, #c084fc)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          TASTE Pay
        </h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        <AnimatePresence mode="wait">
          
          {/* MENU MODE */}
          {mode === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%', justifyContent: 'center', paddingBottom: '80px' }}
            >
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                  width: '80px', height: '80px',
                  background: 'linear-gradient(135deg, #06b6d4, #9333ea)',
                  borderRadius: '24px',
                  margin: '0 auto 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 30px rgba(34,211,238,0.3)'
                }}>
                  <Wallet size={40} color="white" />
                </div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Kolay ve Hızlı Ödeme</h2>
                <p style={{ color: '#9ca3af', margin: 0, fontSize: '14px' }}>TASTE ile saniyeler içinde öde veya ödeme al.</p>
              </div>

              <button
                onClick={() => setMode('scan')}
                style={{
                  background: 'linear-gradient(to right, #06b6d4, #2563eb)',
                  borderRadius: '20px', padding: '24px',
                  display: 'flex', alignItems: 'center', gap: '16px',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  boxShadow: '0 10px 15px -3px rgba(6,182,212,0.2)'
                }}
              >
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '50%' }}>
                  <Camera size={32} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>QR ile Öde</div>
                  <div style={{ color: '#cffafe', fontSize: '14px' }}>Müşteri Modu: Kodu okut ve öde</div>
                </div>
              </button>

              <button
                onClick={() => setMode('receive')}
                style={{
                  background: 'linear-gradient(to right, #a855f7, #db2777)',
                  borderRadius: '20px', padding: '24px',
                  display: 'flex', alignItems: 'center', gap: '16px',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  boxShadow: '0 10px 15px -3px rgba(168,85,247,0.2)'
                }}
              >
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '16px', borderRadius: '50%' }}>
                  <QrCode size={32} color="white" />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>Ödeme Al</div>
                  <div style={{ color: '#f3e8ff', fontSize: '14px' }}>İşletme Modu: QR kod oluştur</div>
                </div>
              </button>
            </motion.div>
          )}

          {/* RECEIVE MODE (MERCHANT) */}
          {mode === 'receive' && (
            <motion.div
              key="receive"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '32px' }}
            >
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 24px 0' }}>Ödeme Alınacak Tutar</h2>
              
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', width: '100%', maxWidth: '320px' }}>
                {(['TRY', 'USD', 'EUR'] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    style={{
                      flex: 1, padding: '12px', borderRadius: '12px',
                      fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
                      border: 'none',
                      backgroundColor: currency === c ? '#06b6d4' : '#1a2235',
                      color: currency === c ? 'white' : '#9ca3af',
                      transition: 'all 0.2s'
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div style={{ position: 'relative', marginBottom: '32px', width: '100%', maxWidth: '320px' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '24px', color: '#9ca3af' }}>
                  {RATES[currency].symbol}
                </span>
                <input
                  type="number"
                  value={receiveAmount}
                  onChange={(e) => setReceiveAmount(e.target.value)}
                  placeholder="0.00"
                  style={{
                    width: '100%', backgroundColor: '#1a2235', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '16px', padding: '16px 16px 16px 48px', fontSize: '30px', fontWeight: 'bold',
                    color: 'white', textAlign: 'center', boxSizing: 'border-box'
                  }}
                />
              </div>

              {parseFloat(receiveAmount) > 0 ? (
                <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '24px', boxShadow: '0 0 40px rgba(34,211,238,0.2)' }}>
                  <QRCodeSVG 
                    value={qrData} 
                    size={220}
                    level="H"
                    includeMargin={true}
                  />
                  <div style={{ textAlign: 'center', marginTop: '16px', color: 'black' }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#6b7280' }}>Müşteriden Alınacak</div>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#0891b2' }}>{calculatedTaste} TASTE</div>
                  </div>
                </div>
              ) : (
                <div style={{
                  width: '252px', height: '252px', border: '2px dashed rgba(255,255,255,0.2)',
                  borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#6b7280', fontSize: '16px'
                }}>
                  Tutar Girin
                </div>
              )}
            </motion.div>
          )}

          {/* SCAN MODE (CUSTOMER) */}
          {mode === 'scan' && (
            <motion.div
              key="scan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center' }}
            >
              <div style={{
                width: '100%', maxWidth: '320px', aspectRatio: '1/1', backgroundColor: 'black',
                borderRadius: '24px', overflow: 'hidden', position: 'relative',
                border: '4px solid rgba(34,211,238,0.5)', boxShadow: '0 0 40px rgba(34,211,238,0.2)'
              }}>
                <div id="qr-reader" style={{ width: '100%', height: '100%' }}></div>
              </div>
              <p style={{ marginTop: '32px', textAlign: 'center', color: '#9ca3af' }}>
                Ödeme yapmak için kasadaki karekodu okutun
              </p>
            </motion.div>
          )}

          {/* CONFIRMATION MODE */}
          {mode === 'confirm' && scannedPayload && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px' }}
            >
              {paymentStatus === 'idle' && (
                <>
                  <div style={{ width: '80px', height: '80px', backgroundColor: 'rgba(59,130,246,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                    <Banknote size={40} color="#60a5fa" />
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0' }}>Ödeme Onayı</h2>
                  <p style={{ color: '#9ca3af', marginBottom: '32px' }}>İşletmeye yapılacak ödeme tutarı</p>

                  <div style={{ backgroundColor: '#1a2235', width: '100%', maxWidth: '320px', borderRadius: '16px', padding: '24px', marginBottom: '32px', border: '1px solid rgba(255,255,255,0.1)', boxSizing: 'border-box' }}>
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                      <div style={{ fontSize: '36px', fontWeight: 900, color: 'white' }}>
                        {scannedPayload.amount} {scannedPayload.currency}
                      </div>
                      <div style={{ color: '#22d3ee', marginTop: '8px', fontWeight: 'bold' }}>
                        ≈ {scannedPayload.tasteAmount} TASTE
                      </div>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', marginTop: '16px', fontSize: '14px', color: '#9ca3af', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Sipariş No:</span>
                      <span style={{ color: 'white' }}>{scannedPayload.memo}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSimulatePayment}
                    style={{
                      width: '100%', maxWidth: '320px', padding: '16px',
                      background: 'linear-gradient(to right, #06b6d4, #2563eb)',
                      borderRadius: '12px', fontWeight: 'bold', fontSize: '18px',
                      color: 'white', border: 'none', cursor: 'pointer',
                      boxShadow: '0 0 20px rgba(34,211,238,0.4)'
                    }}
                  >
                    Onayla ve Öde
                  </button>
                </>
              )}

              {paymentStatus === 'processing' && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '256px' }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <RefreshCw size={64} color="#22d3ee" style={{ marginBottom: '24px' }} />
                  </motion.div>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Ödeme İşleniyor...</h3>
                  <p style={{ color: '#9ca3af', marginTop: '8px' }}>Blockchain onaylanıyor</p>
                </div>
              )}

              {paymentStatus === 'success' && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '256px', textAlign: 'center' }}
                >
                  <div style={{ width: '96px', height: '96px', backgroundColor: 'rgba(34,197,94,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                    <CheckCircle2 size={64} color="#4ade80" />
                  </div>
                  <h3 style={{ fontSize: '30px', fontWeight: 900, color: 'white', margin: '0 0 8px 0' }}>Ödendi!</h3>
                  <p style={{ color: '#9ca3af', margin: 0 }}>İşlem başarıyla tamamlandı.</p>
                  
                  <button
                    onClick={() => {
                      setMode('menu');
                      setPaymentStatus('idle');
                    }}
                    style={{
                      marginTop: '32px', padding: '12px 32px', backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px', fontWeight: 'bold', color: 'white', border: 'none', cursor: 'pointer'
                    }}
                  >
                    Ana Menüye Dön
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
