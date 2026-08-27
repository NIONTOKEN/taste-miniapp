import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowLeftRight, ChevronDown, ExternalLink } from 'lucide-react'

interface SwapScreenProps {
  onClose: () => void
}

type PairKey = 'TON_TAI' | 'USDT_TAI' | 'DOGS_TAI' | 'NOT_TAI'

const PAIRS: { key: PairKey; from: string; to: string; fromIcon: string; toIcon: string; color: string; dex: string; link: string }[] = [
  {
    key: 'TON_TAI',
    from: 'TON', to: 'TAI',
    fromIcon: 'https://ton.org/download/ton_symbol.svg',
    toIcon: '/logo.jpg',
    color: '#3b82f6',
    dex: 'STON.fi',
    link: 'https://app.ston.fi/swap?chartVisible=false&ft=TON&tt=EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-',
  },
  {
    key: 'USDT_TAI',
    from: 'USDT', to: 'TAI',
    fromIcon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
    toIcon: '/logo.jpg',
    color: '#10b981',
    dex: 'DeDust',
    link: 'https://dedust.io/swap/EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c/EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-',
  },
  {
    key: 'DOGS_TAI',
    from: 'DOGS', to: 'TAI',
    fromIcon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/31693.png',
    toIcon: '/logo.jpg',
    color: '#f97316',
    dex: 'STON.fi',
    link: 'https://app.ston.fi/swap?ft=DOGS&tt=EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-',
  },
  {
    key: 'NOT_TAI',
    from: 'NOT', to: 'TAI',
    fromIcon: 'https://s2.coinmarketcap.com/static/img/coins/64x64/28850.png',
    toIcon: '/logo.jpg',
    color: '#a855f7',
    dex: 'STON.fi',
    link: 'https://app.ston.fi/swap?ft=NOT&tt=EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-',
  },
]

export function SwapScreen({ onClose }: SwapScreenProps) {
  const [selectedPair, setSelectedPair] = useState<PairKey>('TON_TAI')
  const pair = PAIRS.find(p => p.key === selectedPair)!

  const openSwap = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openLink(pair.link)
    } else {
      window.open(pair.link, '_blank')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      style={{ paddingBottom: 20 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>⚡ TAI Satın Al</h2>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>Token değiştirerek TAI kazan</p>
        </div>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '8px 10px', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <X size={18} />
        </motion.button>
      </div>

      {/* Pair Selector */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 12 }}>İşlem Çifti Seç</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {PAIRS.map(p => (
            <motion.button
              key={p.key}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedPair(p.key)}
              style={{
                background: selectedPair === p.key ? `linear-gradient(135deg,${p.color}22,${p.color}08)` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${selectedPair === p.key ? p.color : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 16,
                padding: '14px 16px',
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {selectedPair === p.key && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: p.color, boxShadow: `0 0 8px ${p.color}` }} />
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{ position: 'relative', width: 32, height: 20 }}>
                  <img src={p.fromIcon} alt={p.from} style={{ width: 20, height: 20, borderRadius: '50%', position: 'absolute', left: 0, top: 0, border: '1px solid rgba(255,255,255,0.1)' }}
                    onError={e => { e.currentTarget.src = '/logo.jpg' }}
                  />
                  <img src={p.toIcon} alt={p.to} style={{ width: 20, height: 20, borderRadius: '50%', position: 'absolute', left: 14, top: 0, border: '1px solid rgba(255,255,255,0.1)' }} />
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: selectedPair === p.key ? '#fff' : '#94a3b8' }}>{p.from}/{p.to}</span>
              </div>
              <div style={{ fontSize: 10, color: p.color, fontWeight: 700 }}>via {p.dex}</div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selected Pair Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedPair}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{ background: `linear-gradient(135deg,${pair.color}14,rgba(0,0,0,0.3))`, border: `1px solid ${pair.color}33`, borderRadius: 22, padding: '22px 20px', marginBottom: 22 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src={pair.fromIcon} alt={pair.from} style={{ width: 42, height: 42, borderRadius: '50%', border: `2px solid ${pair.color}` }}
                onError={e => { e.currentTarget.src = '/logo.jpg' }}
              />
              <div>
                <div style={{ fontSize: 18, fontWeight: 900 }}>{pair.from}</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Satış token</div>
              </div>
            </div>
            <div style={{ background: `${pair.color}22`, borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowLeftRight size={16} color={pair.color} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 18, fontWeight: 900 }}>TAI</div>
                <div style={{ fontSize: 11, color: '#64748b' }}>Alış token</div>
              </div>
              <img src="/logo.jpg" alt="TAI" style={{ width: 42, height: 42, borderRadius: '50%', border: '2px solid #f59e0b' }} />
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '12px 16px', marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>İşlem Yeri</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: pair.color }}>{pair.dex}</div>
          </div>

          <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.6, background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: '10px 14px' }}>
            💡 Swap işlemi harici DEX platformunda gerçekleşir. Cüzdanınızı bağladıktan sonra işlemi onaylayın.
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Swap Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={openSwap}
        style={{ width: '100%', background: `linear-gradient(135deg,${pair.color},${pair.color}bb)`, border: 'none', borderRadius: 18, padding: '18px', color: '#fff', fontWeight: 900, fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: `0 8px 24px ${pair.color}44` }}
      >
        <ExternalLink size={18} />
        {pair.from} ile TAI Al — {pair.dex}
      </motion.button>

      <p style={{ textAlign: 'center', fontSize: 11, color: '#334155', marginTop: 12 }}>
        Bu işlem sizi harici bir platforma yönlendirir
      </p>
    </motion.div>
  )
}
