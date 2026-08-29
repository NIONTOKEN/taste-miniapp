import { motion } from 'framer-motion'
import { ExternalLink, Droplets, Plus } from 'lucide-react'
import { LogoGRAM, LogoDOGS, LogoUTYA, LogoUSDT, LogoTON, LogoTAI } from './TokenLogos'

const POOLS = [
  {
    id: 1,
    pair: 'TAI / GRAM',
    Logo1: LogoTAI, Logo2: LogoGRAM,
    dex: 'STON.fi V2',
    status: 'active',
    color: '#0284c7',
    apy: '—',
    tvl: '$275.48',
    address: 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-',
    link: 'https://app.ston.fi/pools?search=TAI',
  },
  {
    id: 2,
    pair: 'UTYA / TAI',
    Logo1: LogoUTYA, Logo2: LogoTAI,
    dex: 'STON.fi V2',
    status: 'active',
    color: '#eab308',
    apy: '—',
    tvl: '$7.95',
    address: 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-',
    link: 'https://app.ston.fi/pools?search=TAI',
  },
  {
    id: 3,
    pair: 'TAI / DOGS',
    Logo1: LogoTAI, Logo2: LogoDOGS,
    dex: 'STON.fi V2',
    status: 'active',
    color: '#f97316',
    apy: '—',
    tvl: '$5.61',
    address: 'EQD1Wg3gqcejslDzdwZbDFbqc2CecRNIKhGHJXU5cG1MNqzu',
    link: 'https://app.ston.fi/pools/EQD1Wg3gqcejslDzdwZbDFbqc2CecRNIKhGHJXU5cG1MNqzu',
  },
  {
    id: 4,
    pair: 'USD₮ / TAI',
    Logo1: LogoUSDT, Logo2: LogoTAI,
    dex: 'DeDust CPMM V2',
    status: 'active',
    color: '#10b981',
    apy: '—',
    tvl: '$2.42K',
    address: 'EQAt1l9cGN6bPh8BiaAbqsXXxmR25hLOxcsbb03KGprj3XaI',
    link: 'https://dedust.io/pools/EQAt1l9cGN6bPh8BiaAbqsXXxmR25hLOxcsbb03KGprj3XaI',
  },
  {
    id: 5,
    pair: 'TON / TAI',
    Logo1: LogoTON, Logo2: LogoTAI,
    dex: 'STON.fi & DeDust',
    status: 'active',
    color: '#3b82f6',
    apy: '—',
    tvl: '$13.75K',
    address: 'EQCGEHrBuuoKVJ_0LqQy38F-c-pN-Jrz0M_ASdCtJxZL74nS',
    link: 'https://app.ston.fi/pools/EQCGEHrBuuoKVJ_0LqQy38F-c-pN-Jrz0M_ASdCtJxZL74nS',
  },
]

export function DeFiPool() {
  const openLink = (url: string) => {
    if (window.Telegram?.WebApp) window.Telegram.WebApp.openLink(url)
    else window.open(url, '_blank')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ paddingBottom: 20 }}
    >
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Droplets size={20} color="#10b981" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>DeFi Havuzları</h2>
            <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>5 Aktif Likidite Havuzu</p>
          </div>
        </div>
        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 12, padding: '10px 14px', fontSize: 12, color: '#10b981', fontWeight: 600 }}>
          💧 Likidite sağlayarak işlem ücretlerinden pay kazanabilirsiniz
        </div>
      </div>

      {/* Pool Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
        {POOLS.map((pool, idx) => (
          <motion.div
            key={pool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            style={{
              background: `linear-gradient(135deg, ${pool.color}10, rgba(0,0,0,0.3))`,
              border: `1px solid ${pool.color}33`,
              borderRadius: 20,
              padding: '18px 20px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Status badge */}
            <div style={{
              position: 'absolute', top: 14, right: 14,
              background: `${pool.color}22`,
              border: `1px solid ${pool.color}55`,
              borderRadius: 20, padding: '3px 10px',
              fontSize: 10, fontWeight: 800, color: pool.color,
              textTransform: 'uppercase', letterSpacing: 0.5,
            }}>
              ✓ Aktif
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              {/* Side-by-side SVG logos */}
              <div style={{ display: 'flex', gap: 4, flexShrink: 0, alignItems: 'center' }}>
                <pool.Logo1 size={36} />
                <div style={{ marginLeft: -8, zIndex: 1 }}>
                  <pool.Logo2 size={36} />
                </div>
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 900, color: '#f8fafc', marginBottom: 3 }}>{pool.pair}</div>
                <div style={{ fontSize: 12, color: pool.color, fontWeight: 700 }}>via {pool.dex}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: '#64748b' }}>TVL</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: pool.color }}>{pool.tvl}</div>
            </div>

            <div style={{ fontSize: 10, color: '#334155', fontFamily: 'monospace', marginBottom: 14, wordBreak: 'break-all', background: 'rgba(0,0,0,0.2)', padding: '6px 10px', borderRadius: 8 }}>
              {pool.address.slice(0, 20)}...{pool.address.slice(-8)}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => openLink(pool.link)}
              style={{ width: '100%', background: `linear-gradient(135deg,${pool.color},${pool.color}bb)`, border: 'none', borderRadius: 12, padding: '12px', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: `0 4px 14px ${pool.color}44` }}
            >
              <ExternalLink size={15} />
              Havuza Katıl
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Create new pool */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => openLink('https://app.ston.fi/pools/new')}
        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: 18, padding: '16px', color: '#64748b', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
      >
        <Plus size={16} />
        Yeni Havuz Oluştur (STON.fi)
      </motion.button>

      <p style={{ textAlign: 'center', fontSize: 11, color: '#1e293b', marginTop: 14, background: 'rgba(255,165,0,0.06)', borderRadius: 10, padding: '8px', border: '1px solid rgba(255,165,0,0.1)' }}>
        ⚠️ DeFi işlemleri risk içerir. Yatırım tavsiyesi değildir.
      </p>
    </motion.div>
  )
}
