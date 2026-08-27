import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Share, Plus } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallBanner() {
  const [show, setShow] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (localStorage.getItem('pwa_dismissed') === 'true') return;
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(ios);

    if (!ios) {
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setTimeout(() => setShow(true), 3000);
      };
      window.addEventListener('beforeinstallprompt', handler);
      const fallback = setTimeout(() => setShow(true), 5000);
      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
        clearTimeout(fallback);
      };
    } else {
      const timer = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') setShow(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('pwa_dismissed', 'true');
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 120, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          position: 'fixed', bottom: 85, left: 12, right: 12, zIndex: 9500,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          border: '1px solid rgba(245,159,11,0.3)', borderRadius: 20,
          padding: '16px 18px',
          boxShadow: '0 -4px 32px rgba(0,0,0,0.5), 0 0 20px rgba(245,159,11,0.15)',
        }}
      >
        <button onClick={handleDismiss} style={{
          position: 'absolute', top: 10, right: 12, background: 'none',
          border: 'none', color: '#64748b', cursor: 'pointer', padding: 4
        }}>
          <X size={16} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Download size={24} color="#000" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 3 }}>
              📲 TASTE AI Uygulamasını Kur
            </div>
            <div style={{ fontSize: 11, color: '#94a3b8', lineHeight: 1.4 }}>
              {isIOS
                ? <>Safari'de <Share size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> Paylaş → <Plus size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> Ana Ekrana Ekle</>
                : 'Hızlı erişim için ana ekranına ekle!'}
            </div>
          </div>
          {!isIOS && (
            <motion.button whileTap={{ scale: 0.92 }} onClick={handleInstall} style={{
              background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000',
              border: 'none', borderRadius: 12, padding: '10px 18px',
              fontSize: 12, fontWeight: 800, cursor: 'pointer', flexShrink: 0
            }}>
              YÜKLE
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
