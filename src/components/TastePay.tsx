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
    <div className="fixed inset-0 z-50 bg-[#0a0f1c] text-white flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-white/10 bg-[#121a2f]">
        <button onClick={() => mode === 'menu' ? onClose() : setMode('menu')} className="p-2 mr-2">
          <ArrowLeft className="w-6 h-6 text-cyan-400" />
        </button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          TASTE Pay
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <AnimatePresence mode="wait">
          
          {/* MENU MODE */}
          {mode === 'menu' && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col gap-6 h-full justify-center pb-20"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                  <Wallet className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Kolay ve Hızlı Ödeme</h2>
                <p className="text-gray-400 mt-2 text-sm">TASTE ile saniyeler içinde öde veya ödeme al.</p>
              </div>

              <button
                onClick={() => setMode('scan')}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 flex items-center gap-4 hover:scale-[1.02] transition-transform shadow-lg shadow-cyan-500/20"
              >
                <div className="bg-white/20 p-4 rounded-full">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold text-white">QR ile Öde</div>
                  <div className="text-cyan-100 text-sm">Müşteri Modu: Kodu okut ve öde</div>
                </div>
              </button>

              <button
                onClick={() => setMode('receive')}
                className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 flex items-center gap-4 hover:scale-[1.02] transition-transform shadow-lg shadow-purple-500/20"
              >
                <div className="bg-white/20 p-4 rounded-full">
                  <QrCode className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xl font-bold text-white">Ödeme Al</div>
                  <div className="text-purple-100 text-sm">İşletme Modu: QR kod oluştur</div>
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
              className="flex flex-col items-center pt-8"
            >
              <h2 className="text-2xl font-bold mb-6">Ödeme Alınacak Tutar</h2>
              
              <div className="flex gap-2 mb-6 w-full max-w-xs">
                {(['TRY', 'USD', 'EUR'] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${
                      currency === c ? 'bg-cyan-500 text-white' : 'bg-[#1a2235] text-gray-400'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="relative mb-8 w-full max-w-xs">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400">
                  {RATES[currency].symbol}
                </span>
                <input
                  type="number"
                  value={receiveAmount}
                  onChange={(e) => setReceiveAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[#1a2235] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-3xl font-bold text-white focus:outline-none focus:border-cyan-500 text-center"
                />
              </div>

              {parseFloat(receiveAmount) > 0 ? (
                <div className="bg-white p-4 rounded-3xl shadow-[0_0_40px_rgba(34,211,238,0.2)]">
                  <QRCodeSVG 
                    value={qrData} 
                    size={220}
                    level="H"
                    includeMargin={true}
                  />
                  <div className="text-center mt-4 text-black">
                    <div className="text-sm font-bold text-gray-500">Müşteriden Alınacak</div>
                    <div className="text-2xl font-black text-cyan-600">{calculatedTaste} TASTE</div>
                  </div>
                </div>
              ) : (
                <div className="w-[252px] h-[252px] border-2 border-dashed border-white/20 rounded-3xl flex items-center justify-center text-gray-500">
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
              className="flex flex-col h-full items-center justify-center"
            >
              <div className="w-full max-w-sm aspect-square bg-black rounded-3xl overflow-hidden relative border-4 border-cyan-500/50 shadow-[0_0_40px_rgba(34,211,238,0.2)]">
                <div id="qr-reader" className="w-full h-full"></div>
                <div className="absolute inset-0 border-[40px] border-black/50 pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-cyan-400 rounded-xl pointer-events-none">
                  {/* Scan frame corners */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-cyan-400"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-cyan-400"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-cyan-400"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-cyan-400"></div>
                </div>
              </div>
              <p className="mt-8 text-center text-gray-400">
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
              className="flex flex-col items-center pt-10"
            >
              {paymentStatus === 'idle' && (
                <>
                  <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-6">
                    <Banknote className="w-10 h-10 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Ödeme Onayı</h2>
                  <p className="text-gray-400 mb-8">İşletmeye yapılacak ödeme tutarı</p>

                  <div className="bg-[#1a2235] w-full max-w-xs rounded-2xl p-6 mb-8 border border-white/10">
                    <div className="text-center mb-4">
                      <div className="text-4xl font-black text-white">
                        {scannedPayload.amount} {scannedPayload.currency}
                      </div>
                      <div className="text-cyan-400 mt-2 font-bold">
                        ≈ {scannedPayload.tasteAmount} TASTE
                      </div>
                    </div>
                    <div className="border-t border-white/10 pt-4 mt-4 text-sm text-gray-400 flex justify-between">
                      <span>Sipariş No:</span>
                      <span className="text-white">{scannedPayload.memo}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleSimulatePayment}
                    className="w-full max-w-xs py-4 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all"
                  >
                    Onayla ve Öde
                  </button>
                </>
              )}

              {paymentStatus === 'processing' && (
                <div className="flex flex-col items-center justify-center h-64">
                  <RefreshCw className="w-16 h-16 text-cyan-400 animate-spin mb-6" />
                  <h3 className="text-xl font-bold">Ödeme İşleniyor...</h3>
                  <p className="text-gray-400 mt-2">Blockchain onaylanıyor</p>
                </div>
              )}

              {paymentStatus === 'success' && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center h-64 text-center"
                >
                  <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-16 h-16 text-green-400" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2">Ödendi!</h3>
                  <p className="text-gray-400">İşlem başarıyla tamamlandı.</p>
                  
                  <button
                    onClick={() => {
                      setMode('menu');
                      setPaymentStatus('idle');
                    }}
                    className="mt-8 px-8 py-3 bg-white/10 rounded-xl font-bold hover:bg-white/20 transition-colors"
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
