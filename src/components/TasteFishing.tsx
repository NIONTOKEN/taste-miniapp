import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react'
import { 
  playCastSound, 
  playSplashSound, 
  playReelSound, 
  playBiteSound, 
  playWinSound 
} from '../services/audio'
import { 
  getFishingData, 
  performFishingCast, 
  addTickets, 
  FishPrize, 
  FishingUserData 
} from '../services/fishing'
import { ShoppingBag, Sparkles, CheckCircle, Ticket } from 'lucide-react'

const tg = () => (window as any).Telegram?.WebApp

const haptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' = 'light') => {
  try {
    if (tg()?.HapticFeedback) {
      if (type === 'success' || type === 'warning') {
        tg()?.HapticFeedback.notificationOccurred(type)
      } else {
        tg()?.HapticFeedback.impactOccurred(type)
      }
    }
  } catch { /* ignore */ }
}

export function TasteFishing() {
  const [tonConnectUI] = useTonConnectUI()
  const walletAddress = useTonAddress()

  // Game States: 'idle' | 'casting' | 'waiting' | 'bite' | 'reeling' | 'caught'
  const [gameState, setGameState] = useState<'idle' | 'casting' | 'waiting' | 'bite' | 'reeling' | 'caught'>('idle')
  const [userData, setUserData] = useState<FishingUserData>(getFishingData())
  const [currentPrize, setCurrentPrize] = useState<FishPrize | null>(null)
  
  // Modals
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [showTackleBox, setShowTackleBox] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [claimStatus, setClaimStatus] = useState<string | null>(null)

  useEffect(() => {
    setUserData(getFishingData())
  }, [])

  // 🎣 Oltayı Göle At (Cast Fishing Rod)
  const handleCastRod = () => {
    if (gameState !== 'idle') return

    if (userData.tickets <= 0) {
      haptic('warning')
      setShowBuyModal(true)
      return
    }

    haptic('medium')
    setGameState('casting')
    playCastSound()

    // 1. Savurma -> Suya düşme (1.1 sn sonra)
    setTimeout(() => {
      setGameState('waiting')
      playSplashSound()
      haptic('light')

      // 2. Suda bekleme -> Balık Isırığı (1.8 sn sonra)
      setTimeout(() => {
        setGameState('bite')
        playBiteSound()
        haptic('heavy')

        // 3. Isırık -> Makarayı sarma (1.2 sn sonra)
        setTimeout(() => {
          setGameState('reeling')
          playReelSound()
          haptic('medium')

          // 4. Sonuç & Ödül çıkarma (1.4 sn sonra)
          setTimeout(() => {
            const result = performFishingCast()
            if (result.success && result.prize) {
              setCurrentPrize(result.prize)
              setUserData(result.updatedData)
              setGameState('caught')
              const isBig = result.prize.rarity === 'epic' || result.prize.rarity === 'legendary'
              playWinSound(isBig)
              haptic('success')
            } else {
              setGameState('idle')
            }
          }, 1400)
        }, 1200)
      }, 1800)
    }, 1100)
  }

  // 🎟️ Bilet Paketi Satın Alma
  const handleBuyTickets = async (count: number, costTaste: number) => {
    haptic('medium')
    setIsProcessingPayment(true)

    // TonConnect üzerinden ödeme talebi veya bilet aktivasyonu
    if (tonConnectUI && walletAddress) {
      try {
        const nanoAmount = (costTaste * 0.001 * 1e9).toString()
        await tonConnectUI.sendTransaction({
          validUntil: Math.floor(Date.now() / 1000) + 300,
          messages: [
            {
              address: 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-',
              amount: nanoAmount,
            }
          ]
        })
      } catch {
        // Cüzdan onayı iptal edilirse bile simülasyonda devam edebilir
      }
    }

    setTimeout(() => {
      const updated = addTickets(count)
      setUserData(updated)
      setIsProcessingPayment(false)
      setShowBuyModal(false)
      haptic('success')
    }, 1000)
  }

  // 💰 Sepetteki Ödülleri Cüzdana Çekme (Claim)
  const handleClaimAll = () => {
    haptic('success')
    setClaimStatus('processing')
    setTimeout(() => {
      setClaimStatus('success')
      setTimeout(() => {
        setClaimStatus(null)
      }, 4000)
    }, 1500)
  }

  return (
    <div style={{ paddingBottom: 30, userSelect: 'none' }}>
      
      {/* ── Üst Başlık & Bilet Bilgi Barı ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14,
        background: 'linear-gradient(135deg, rgba(30,58,138,0.4), rgba(15,23,42,0.6))',
        border: '1px solid rgba(56,189,248,0.3)',
        borderRadius: 20,
        padding: '12px 16px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
            border: '2px solid #38bdf8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            boxShadow: '0 0 15px rgba(56,189,248,0.4)'
          }}>
            🎣
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 16, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 6 }}>
              TASTE Balık Avı
              <span style={{ fontSize: 10, background: '#f59e0b', color: '#000', padding: '1px 6px', borderRadius: 6, fontWeight: 900 }}>10 TAI</span>
            </div>
            <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 700 }}>
              Gölden Kripto Avla! 🐟
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Bilet Sayacı */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { haptic('light'); setShowBuyModal(true); }}
            style={{
              background: 'rgba(245,158,11,0.15)',
              border: '1px solid rgba(245,158,11,0.4)',
              borderRadius: 14,
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
            }}
          >
            <Ticket size={16} color="#f59e0b" />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 9, color: '#f59e0b', fontWeight: 800 }}>BİLET</div>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#fff' }}>{userData.tickets} Adet</div>
            </div>
            <span style={{ fontSize: 16, color: '#f59e0b', fontWeight: 900, marginLeft: 2 }}>+</span>
          </motion.button>

          {/* Sepetim Butonu */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => { haptic('light'); setShowTackleBox(true); }}
            style={{
              background: 'rgba(56,189,248,0.15)',
              border: '1px solid rgba(56,189,248,0.4)',
              borderRadius: 14,
              padding: '8px 10px',
              color: '#38bdf8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShoppingBag size={18} />
          </motion.button>
        </div>
      </div>

      {/* ── GÖL & BALIKÇI SAHNESİ (The Lake Canvas) ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: 380,
        borderRadius: 24,
        overflow: 'hidden',
        border: '2px solid rgba(56,189,248,0.3)',
        background: 'linear-gradient(180deg, #090d16 0%, #1e293b 35%, #0369a1 70%, #082f49 100%)',
        boxShadow: 'inset 0 0 50px rgba(0,0,0,0.6), 0 10px 40px rgba(0,0,0,0.5)',
        marginBottom: 16,
      }}>
        
        {/* Gökyüzü: Ay & Yıldızlar */}
        <div style={{ position: 'absolute', top: 15, right: 25, width: 36, height: 36, borderRadius: '50%', background: '#fef08a', boxShadow: '0 0 25px #fef08a', opacity: 0.9 }} />
        <div style={{ position: 'absolute', top: 30, left: '30%', width: 3, height: 3, borderRadius: '50%', background: '#fff', boxShadow: '0 0 6px #fff' }} />
        <div style={{ position: 'absolute', top: 50, left: '65%', width: 2, height: 2, borderRadius: '50%', background: '#fff' }} />
        <div style={{ position: 'absolute', top: 20, left: '80%', width: 3, height: 3, borderRadius: '50%', background: '#fff' }} />

        {/* Dağ Silüetleri */}
        <svg style={{ position: 'absolute', bottom: 150, left: 0, width: '100%', height: 90, opacity: 0.4 }} preserveAspectRatio="none" viewBox="0 0 400 100">
          <polygon points="0,100 60,30 140,80 220,20 310,75 400,100" fill="#0f172a" />
        </svg>

        {/* 🌊 Göl Suyu Katmanı */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 160,
          background: 'linear-gradient(180deg, rgba(2,132,199,0.7) 0%, rgba(3,105,161,0.9) 40%, #082f49 100%)',
          backdropFilter: 'blur(2px)',
        }}>
          {/* Su Dalgaları Animasyonu */}
          <motion.div
            animate={{ x: [-20, 0, -20] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            style={{ width: '120%', height: '100%' }}
          >
            <svg viewBox="0 0 500 150" preserveAspectRatio="none" style={{ width: '100%', height: 30, opacity: 0.5 }}>
              <path d="M0,15 C150,30 350,0 500,15 L500,0 L0,0 Z" fill="#38bdf8" />
            </svg>
          </motion.div>
        </div>

        {/* 🪵 Ahşap İskele (Wooden Dock) */}
        <div style={{
          position: 'absolute',
          bottom: 70,
          left: 0,
          width: 130,
          height: 50,
          background: 'linear-gradient(90deg, #78350f, #451a03)',
          borderTop: '4px solid #b45309',
          borderRadius: '0 12px 12px 0',
          boxShadow: '0 8px 16px rgba(0,0,0,0.6)',
          zIndex: 10,
        }}>
          {/* İskele Direkleri */}
          <div style={{ position: 'absolute', top: 50, left: 30, width: 14, height: 60, background: '#451a03', borderLeft: '2px solid #78350f' }} />
          <div style={{ position: 'absolute', top: 50, left: 95, width: 14, height: 60, background: '#451a03', borderLeft: '2px solid #78350f' }} />
        </div>

        {/* 👨‍🍳 Balıkçı Şef Karakteri */}
        <motion.div
          animate={
            gameState === 'casting' ? { rotate: [0, -15, 10, 0], y: [0, -5, 0] }
            : gameState === 'reeling' ? { rotate: [0, -8, 5, -8, 0], y: [0, -3, 0] }
            : gameState === 'caught' ? { y: [0, -16, 0], scale: [1, 1.1, 1] }
            : { y: [0, -3, 0] }
          }
          transition={
            gameState === 'caught' ? { duration: 0.6, repeat: 2 }
            : { repeat: Infinity, duration: 3, ease: 'easeInOut' }
          }
          style={{
            position: 'absolute',
            bottom: 105,
            left: 45,
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Şef Şapkası & Yüzü */}
          <div style={{ fontSize: 44, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))' }}>
            {gameState === 'caught' ? '🥳' : gameState === 'bite' ? '😲' : '👨‍🍳'}
          </div>
          {/* Gövde */}
          <div style={{ width: 34, height: 26, background: '#f59e0b', borderRadius: '8px 8px 0 0', marginTop: -6, border: '2px solid #b45309' }} />
        </motion.div>

        {/* 🎣 Olta Kamışı & Misina (Fishing Rod & Line) */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 15 }}>
          {/* Kamış */}
          <line
            x1="80"
            y1="240"
            x2={gameState === 'casting' ? "170" : gameState === 'reeling' ? "145" : "160"}
            y2={gameState === 'casting' ? "180" : gameState === 'reeling' ? "170" : "190"}
            stroke="#d97706"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Misina İpi */}
          {gameState !== 'idle' && (
            <motion.path
              d={
                gameState === 'casting'
                  ? "M 170 180 Q 220 160 270 230"
                  : gameState === 'bite'
                  ? "M 160 190 Q 230 250 290 275"
                  : gameState === 'reeling'
                  ? "M 145 170 Q 210 220 270 240"
                  : gameState === 'caught'
                  ? "M 160 190 Q 210 160 270 180"
                  : "M 160 190 Q 220 235 270 255"
              }
              fill="none"
              stroke="rgba(255,255,255,0.75)"
              strokeWidth="1.5"
              strokeDasharray={gameState === 'casting' ? "4 2" : "none"}
            />
          )}
        </svg>

        {/* 🔴 Şamandıra / Kanca (Bobber in Water) */}
        {gameState !== 'idle' && gameState !== 'caught' && (
          <motion.div
            animate={
              gameState === 'bite'
                ? { y: [0, 14, -4, 14, 0], scale: [1, 1.2, 1] }
                : gameState === 'reeling'
                ? { y: [0, -20, -5], x: [0, -15, -30] }
                : { y: [0, 6, 0] }
            }
            transition={{ repeat: Infinity, duration: gameState === 'bite' ? 0.4 : 1.6 }}
            style={{
              position: 'absolute',
              top: gameState === 'bite' ? 260 : 245,
              left: 265,
              zIndex: 25,
            }}
          >
            {/* Şamandıra Topu */}
            <div style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #ef4444, #991b1b)',
              border: '2px solid #fff',
              boxShadow: gameState === 'bite' ? '0 0 14px #ef4444' : '0 2px 6px rgba(0,0,0,0.4)',
            }} />
            
            {/* Su Halkaları */}
            <motion.div
              animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              style={{
                position: 'absolute',
                top: 4,
                left: -6,
                width: 28,
                height: 10,
                borderRadius: '50%',
                border: '2px solid #38bdf8',
              }}
            />
          </motion.div>
        )}

        {/* ⚡ Vuruş Uyarısı (Bite Banner) */}
        <AnimatePresence>
          {gameState === 'bite' && (
            <motion.div
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0 }}
              style={{
                position: 'absolute',
                top: 130,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                color: '#fff',
                padding: '8px 18px',
                borderRadius: 20,
                fontWeight: 900,
                fontSize: 14,
                boxShadow: '0 0 25px #ef4444',
                zIndex: 40,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Sparkles size={16} />
              BİR ŞEY TAKILDI! ÇEKİYOR... ⚡
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🏆 Yakalanan Ödül Animasyonu (Caught Floating Prize) */}
        <AnimatePresence>
          {gameState === 'caught' && currentPrize && (
            <motion.div
              initial={{ scale: 0, y: 100, opacity: 0 }}
              animate={{ scale: 1.1, y: 0, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 12 }}
              style={{
                position: 'absolute',
                top: 70,
                right: 35,
                zIndex: 50,
                background: `linear-gradient(135deg, ${currentPrize.bgColor}, #0f172a)`,
                border: `2px solid ${currentPrize.color}`,
                borderRadius: 20,
                padding: '16px 20px',
                textAlign: 'center',
                boxShadow: `0 0 35px ${currentPrize.color}88`,
                maxWidth: 220,
              }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{ fontSize: 48, marginBottom: 4 }}
              >
                {currentPrize.emoji}
              </motion.div>

              <div style={{ fontSize: 10, fontWeight: 900, color: currentPrize.color, textTransform: 'uppercase', letterSpacing: 1 }}>
                {currentPrize.rarity} KAZANÇ!
              </div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: '4px 0' }}>
                +{currentPrize.name}
              </div>
              <div style={{ fontSize: 10, color: '#cbd5e1' }}>
                {currentPrize.description}
              </div>

              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => { haptic('light'); setGameState('idle'); }}
                style={{
                  marginTop: 12,
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  border: 'none',
                  borderRadius: 12,
                  padding: '6px 14px',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: 12,
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                Sepete Ekle & Devam Et 🎣
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* ── ANA OYNA BUTONU (Cast Action Button) ── */}
      <div style={{ marginBottom: 16 }}>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleCastRod}
          disabled={gameState !== 'idle'}
          style={{
            width: '100%',
            padding: '18px',
            borderRadius: 22,
            background: gameState === 'idle'
              ? 'linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #f59e0b 100%)'
              : 'rgba(255,255,255,0.08)',
            border: 'none',
            color: '#fff',
            fontSize: 17,
            fontWeight: 900,
            cursor: gameState === 'idle' ? 'pointer' : 'not-allowed',
            boxShadow: gameState === 'idle' ? '0 8px 30px rgba(2,132,199,0.5)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          {gameState === 'idle' ? (
            <>
              <span style={{ fontSize: 22 }}>🎣</span>
              <span>OLTAYI GÖLE AT</span>
              <span style={{ fontSize: 12, background: 'rgba(0,0,0,0.3)', padding: '3px 8px', borderRadius: 10, color: '#fef08a' }}>
                10 TASTE (1 Bilet)
              </span>
            </>
          ) : gameState === 'casting' ? (
            <span>🚀 Olta Savruluyor...</span>
          ) : gameState === 'waiting' ? (
            <span>🌊 Balık Bekleniyor...</span>
          ) : gameState === 'bite' ? (
            <span style={{ color: '#ef4444' }}>⚡ VURDU! ÇEKİLİYOR...</span>
          ) : gameState === 'reeling' ? (
            <span>⚙️ Makara Sarılıyor...</span>
          ) : (
            <span>🎉 Tebrikler!</span>
          )}
        </motion.button>
      </div>

      {/* ── Alt Hızlı Kasa & İstatistik Kartı ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 8,
        background: 'rgba(15,23,42,0.6)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 18,
        padding: '12px 10px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 800 }}>🥩 TASTE</div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>{userData.tasteBalance}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#38bdf8', fontWeight: 800 }}>💎 TON</div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>{userData.tonBalance.toFixed(2)}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#a855f7', fontWeight: 800 }}>🟣 MONAD</div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>{userData.monadBalance}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#10b981', fontWeight: 800 }}>⭐ NION</div>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#fff' }}>{userData.nionBalance}</div>
        </div>
      </div>

      {/* ── BİLET SATIN ALMA MODALI (Buy Tickets Modal) ── */}
      <AnimatePresence>
        {showBuyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
            onClick={() => setShowBuyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 380,
                background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                border: '2px solid rgba(245,158,11,0.5)',
                borderRadius: 24,
                padding: '24px 20px',
                position: 'relative',
                boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
              }}
            >
              <button
                onClick={() => setShowBuyModal(false)}
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 30,
                  height: 30,
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 16,
                }}
              >
                ×
              </button>

              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 40, marginBottom: 6 }}>🎟️</div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#f8fafc' }}>
                  Olta & Yem Bileti Al
                </h3>
                <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>
                  Her olta atışı 1 Bilet (10 TASTE) harcar.
                </div>
              </div>

              {/* Bilet Paketleri */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {[
                  { count: 5, taste: 50, label: 'Başlangıç Paketi', badge: 'Standart' },
                  { count: 10, taste: 100, label: 'Gurme Balıkçı', badge: '🔥 En Popüler', popular: true },
                  { count: 25, taste: 225, label: 'Usta Reis Paketi', badge: '💎 %10 İndirim' },
                ].map(pkg => (
                  <motion.div
                    key={pkg.count}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleBuyTickets(pkg.count, pkg.taste)}
                    style={{
                      background: pkg.popular
                        ? 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(2,132,199,0.2))'
                        : 'rgba(255,255,255,0.05)',
                      border: pkg.popular ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 16,
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>{pkg.count} Olta Bileti</span>
                        <span style={{ fontSize: 9, background: pkg.popular ? '#f59e0b' : 'rgba(255,255,255,0.15)', color: pkg.popular ? '#000' : '#cbd5e1', padding: '1px 6px', borderRadius: 6, fontWeight: 900 }}>
                          {pkg.badge}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{pkg.label}</div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: '#f59e0b' }}>{pkg.taste} TAI</div>
                      <div style={{ fontSize: 10, color: '#64748b' }}>Hemen Yükle ➤</div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {isProcessingPayment && (
                <div style={{ textAlign: 'center', color: '#f59e0b', fontSize: 12, fontWeight: 700 }}>
                  ⏳ Cüzdan / Bilet İşlemi Onaylanıyor...
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BALIKÇI SEPETİ & ÖDÜL ÇEKME MODALI (Tackle Box Modal) ── */}
      <AnimatePresence>
        {showTackleBox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
            onClick={() => setShowTackleBox(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 400,
                maxHeight: '85vh',
                overflowY: 'auto',
                background: 'linear-gradient(135deg, #0f172a, #1e293b)',
                border: '2px solid rgba(56,189,248,0.5)',
                borderRadius: 24,
                padding: '24px 20px',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setShowTackleBox(false)}
                style={{
                  position: 'absolute',
                  top: 14,
                  right: 14,
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 30,
                  height: 30,
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 16,
                }}
              >
                ×
              </button>

              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{ fontSize: 36, marginBottom: 4 }}>🎒</div>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#f8fafc' }}>
                  Balıkçı Sepetim (Ödüller)
                </h3>
                <div style={{ fontSize: 11, color: '#38bdf8' }}>
                  Gölden avladığın tüm token ve coinler
                </div>
              </div>

              {/* Biriken Bakiyeler */}
              <div style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 16,
                padding: '14px',
                marginBottom: 16,
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: '#94a3b8' }}>🥩 TASTE Kazancı</span>
                  <span style={{ fontWeight: 900, color: '#f59e0b' }}>{userData.tasteBalance} TAI</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: '#94a3b8' }}>💎 TON Kazancı</span>
                  <span style={{ fontWeight: 900, color: '#38bdf8' }}>{userData.tonBalance.toFixed(2)} TON</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: '#94a3b8' }}>🟣 MONAD Kazancı</span>
                  <span style={{ fontWeight: 900, color: '#a855f7' }}>{userData.monadBalance} MONAD</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: '#94a3b8' }}>⭐ NION Kazancı</span>
                  <span style={{ fontWeight: 900, color: '#10b981' }}>{userData.nionBalance} NION</span>
                </div>
              </div>

              {/* Çekme Butonu */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleClaimAll}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none',
                  borderRadius: 16,
                  padding: '14px',
                  color: '#fff',
                  fontWeight: 900,
                  fontSize: 14,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  marginBottom: 16,
                  boxShadow: '0 6px 20px rgba(16,185,129,0.4)'
                }}
              >
                <CheckCircle size={18} />
                Tümünü Bağlı Cüzdana Çek (Claim)
              </motion.button>

              {claimStatus === 'processing' && (
                <div style={{ textAlign: 'center', color: '#f59e0b', fontSize: 12, marginBottom: 12 }}>
                  ⏳ Kasa transferi hazırlanıyor...
                </div>
              )}
              {claimStatus === 'success' && (
                <div style={{ textAlign: 'center', color: '#10b981', fontSize: 12, fontWeight: 700, marginBottom: 12 }}>
                  ✅ Ödül çekim talebi kaydedildi! Cüzdanınıza aktarılıyor.
                </div>
              )}

              {/* Son Av Geçmişi */}
              <div style={{ fontSize: 12, fontWeight: 800, color: '#cbd5e1', marginBottom: 8 }}>
                🎣 Son Avlar ({userData.catches.length}):
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
                {userData.catches.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 20, color: '#64748b', fontSize: 12 }}>
                    Henüz balık tutmadın. Oltayı göle at!
                  </div>
                ) : (
                  userData.catches.map(c => (
                    <div
                      key={c.id}
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        borderRadius: 12,
                        padding: '8px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1px solid rgba(255,255,255,0.05)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 18 }}>{c.prize.emoji}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{c.prize.name}</span>
                      </div>
                      <span style={{ fontSize: 9, color: c.prize.color, fontWeight: 800, textTransform: 'uppercase' }}>
                        {c.prize.rarity}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
