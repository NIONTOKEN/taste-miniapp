import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SplashScreenProps {
  onFinish: () => void
}

// Generate random particles for the golden sparkle effect
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  duration: Math.random() * 2 + 1.5,
  delay: Math.random() * 1.5,
}))

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in')
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Parallax on touch/mouse move
  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
      const x = ((clientX - rect.left) / rect.width - 0.5) * 2  // -1 to 1
      const y = ((clientY - rect.top) / rect.height - 0.5) * 2   // -1 to 1
      setMousePos({ x, y })
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('touchmove', handleMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('touchmove', handleMove)
    }
  }, [])

  // Timing: in → hold → out → finish
  useEffect(() => {
    // After 2.8s start fade out
    const holdTimer = setTimeout(() => setPhase('out'), 2800)
    // After fade out animation (0.8s), call onFinish
    const finishTimer = setTimeout(() => onFinish(), 3600)
    return () => {
      clearTimeout(holdTimer)
      clearTimeout(finishTimer)
    }
  }, [onFinish])

  return (
    <AnimatePresence>
      {phase !== 'out' ? (
        <motion.div
          ref={containerRef}
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            overflow: 'hidden',
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* ── Background image with parallax ── */}
          <motion.div
            animate={{
              x: mousePos.x * -12,
              y: mousePos.y * -12,
              scale: 1.08,
            }}
            transition={{ type: 'spring', stiffness: 60, damping: 20 }}
            style={{
              position: 'absolute',
              inset: '-5%',
              backgroundImage: 'url(/taste-airship.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.75)',
            }}
          />

          {/* ── Subtle floating animation on the image ── */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              inset: '-5%',
              backgroundImage: 'url(/taste-airship.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.75)',
              mixBlendMode: 'normal',
              opacity: 0, // hidden — real movement is on parent
            }}
          />

          {/* ── Dark gradient overlay (bottom) ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.15) 100%)',
            }}
          />

          {/* ── Gold vignette top ── */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse at 50% 30%, rgba(245,159,11,0.12) 0%, transparent 65%)',
              pointerEvents: 'none',
            }}
          />

          {/* ── Floating golden particles ── */}
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 0 }}
              animate={{
                opacity: [0, 0.9, 0],
                y: [0, -60 - Math.random() * 60],
                x: [(Math.random() - 0.5) * 30],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                repeatDelay: Math.random() * 2,
              }}
              style={{
                position: 'absolute',
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #ffd700, #f59e0b)',
                boxShadow: `0 0 ${p.size * 2}px #f59e0b`,
                pointerEvents: 'none',
              }}
            />
          ))}

          {/* ── Content: Logo + Title + Tagline ── */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              padding: '0 24px',
              textAlign: 'center',
            }}
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ position: 'relative' }}
            >
              {/* Glow ring */}
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(245,159,11,0.4), 0 0 60px rgba(245,159,11,0.2)',
                    '0 0 40px rgba(245,159,11,0.8), 0 0 100px rgba(245,159,11,0.4)',
                    '0 0 20px rgba(245,159,11,0.4), 0 0 60px rgba(245,159,11,0.2)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: '50%',
                  border: '2.5px solid rgba(245,159,11,0.7)',
                  overflow: 'hidden',
                }}
              >
                <img
                  src="/logo.jpg"
                  alt="TASTE"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </motion.div>

              {/* Rotating ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute',
                  inset: -6,
                  borderRadius: '50%',
                  border: '1.5px dashed rgba(245,159,11,0.35)',
                  pointerEvents: 'none',
                }}
              />
            </motion.div>

            {/* $TASTE title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <div
                style={{
                  fontSize: '42px',
                  fontWeight: 900,
                  letterSpacing: '2px',
                  background: 'linear-gradient(135deg, #ffd700 0%, #f59e0b 40%, #fff8e1 70%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textShadow: 'none',
                  filter: 'drop-shadow(0 2px 12px rgba(245,159,11,0.6))',
                  lineHeight: 1,
                }}
              >
                $TASTE
              </div>

              {/* Divider line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                style={{
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)',
                  margin: '8px auto',
                  width: '140px',
                }}
              />

              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                style={{
                  fontSize: '13px',
                  letterSpacing: '4px',
                  color: 'rgba(255,255,255,0.7)',
                  textTransform: 'uppercase',
                  fontWeight: 600,
                }}
              >
                AIRSHIP RESTAURANT
              </motion.div>
            </motion.div>

            {/* Loading bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              style={{ width: '180px', marginTop: '8px' }}
            >
              <div
                style={{
                  height: '2px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1.3, duration: 1.3, ease: 'easeInOut' }}
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #f59e0b, #ffd700)',
                    borderRadius: '2px',
                    boxShadow: '0 0 8px rgba(245,159,11,0.8)',
                  }}
                />
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                style={{
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.4)',
                  marginTop: '6px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}
              >
                Yükleniyor...
              </motion.div>
            </motion.div>
          </div>

          {/* ── Corner watermark ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ delay: 1.2 }}
            style={{
              position: 'absolute',
              bottom: '28px',
              left: 0,
              right: 0,
              textAlign: 'center',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '1.5px',
            }}
          >
            POWERED BY TASTE AI · TON BLOCKCHAIN
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
