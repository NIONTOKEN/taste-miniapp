import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  ChevronRight,
  Sparkles,
  UtensilsCrossed,
  Store,
  BookOpen,
  Link2,
  Gem,
  Wallet,
  Globe2,
  Users,
  Droplets,
  Coins,
  ExternalLink,
  Plus,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Star,
} from 'lucide-react'

interface EcosystemProps {
  onNavigate: (tab: string) => void
  onOpenTastePay?: () => void
}

// ─── 10 Ekosistem Bölümü ────────────────────────────────────────────────────
const ECOSYSTEM_SECTIONS = [
  {
    id: 'ai-recipes',
    icon: UtensilsCrossed,
    emoji: '🍽️',
    title: 'AI Recipes',
    subtitle: 'Akıllı Tarifler',
    color: '#F97316',
    glow: 'rgba(249,115,22,0.3)',
    gradient: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(234,88,12,0.05))',
    border: 'rgba(249,115,22,0.4)',
    badge: 'AI POWERED',
    badgeColor: '#F97316',
    navTarget: 'ai',
    description:
      'Yapay zeka destekli tarif motoru ile malzemelerinizi girin, size özel yemek tarifleri alın. Gastronomi dünyasını AI ile keşfedin.',
    features: [
      'Malzemeye göre otomatik tarif üretimi',
      'Beslenme değeri ve kalori hesaplama',
      'Alerjen uyarı sistemi (14 AB standardı)',
      'Kişiselleştirilmiş diyet önerileri',
      'Tarif paylaşım ve sosyal feed',
    ],
    stats: [
      { label: 'Motor', value: 'Gemini AI' },
      { label: 'Dil', value: '5+ Dil' },
      { label: 'Tarif', value: 'Sınırsız' },
    ],
    comingSoon: false,
  },
  {
    id: 'restaurant-cafe',
    icon: Store,
    emoji: '🏪',
    title: 'Restaurant & Cafe',
    subtitle: 'İşletme Listeleme',
    color: '#A855F7',
    glow: 'rgba(168,85,247,0.3)',
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(139,92,246,0.05))',
    border: 'rgba(168,85,247,0.4)',
    badge: 'REAL WORLD',
    badgeColor: '#A855F7',
    navTarget: 'community',
    description:
      'Restoranlar ve kafeler TASTE ekosisteminde yerini alıyor. İşletmenizi kaydedin, $TASTE ile ödeme kabul edin, müşterilerinize özel avantajlar sunun.',
    features: [
      'İşletme profili ve vitrin oluşturma',
      '$TASTE ile ödeme kabul etme',
      'Blockchain tabanlı müşteri puanlama',
      'Akıllı menü entegrasyonu',
      'Rezervasyon ve sadakat sistemi',
    ],
    stats: [
      { label: 'Sektör', value: 'Gastronomi' },
      { label: 'Ödeme', value: '$TASTE / TON' },
      { label: 'Durum', value: 'Yakında' },
    ],
    comingSoon: true,
  },
  {
    id: 'smart-menus',
    icon: BookOpen,
    emoji: '📋',
    title: 'Smart Menus',
    subtitle: 'Akıllı Menüler',
    color: '#06B6D4',
    glow: 'rgba(6,182,212,0.3)',
    gradient: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(8,145,178,0.05))',
    border: 'rgba(6,182,212,0.4)',
    badge: 'SMART',
    badgeColor: '#06B6D4',
    navTarget: 'ai',
    description:
      'İşletmeler için AI destekli dijital menü sistemi. QR kod ile erişilebilen, dinamik fiyat güncellemeli, alerjen bilgili akıllı menüler.',
    features: [
      'QR kod ile erişilebilir dijital menü',
      'Alerjen ve beslenme bilgisi',
      'Dinamik fiyat ve sezon güncellemeleri',
      'Çoklu dil desteği',
      '$TASTE entegrasyonlu sipariş sistemi',
    ],
    stats: [
      { label: 'Format', value: 'QR / Web' },
      { label: 'Güncelleme', value: 'Anlık' },
      { label: 'Dil', value: 'Çoklu' },
    ],
    comingSoon: true,
  },
  {
    id: 'blockchain',
    icon: Link2,
    emoji: '🔗',
    title: 'Blockchain',
    subtitle: 'Güvenli & Şeffaf & Merkeziyetsiz',
    color: '#3B82F6',
    glow: 'rgba(59,130,246,0.3)',
    gradient: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(37,99,235,0.05))',
    border: 'rgba(59,130,246,0.4)',
    badge: 'TON CHAIN',
    badgeColor: '#3B82F6',
    navTarget: 'whitepaper',
    description:
      'TON Blockchain üzerinde inşa edilmiş TASTE ekosistemi. Tüm işlemler şeffaf, güvenli ve merkeziyetsiz yapıda gerçekleşir.',
    features: [
      'TON Blockchain altyapısı',
      'Şeffaf on-chain işlemler',
      'Merkeziyetsiz likidite havuzları',
      'Akıllı kontrat ile güvenli kilitler',
      'DAO tabanlı yönetim yapısı',
    ],
    stats: [
      { label: 'Zincir', value: 'TON' },
      { label: 'Şeffaflık', value: '% 100' },
      { label: 'Kontrat', value: 'EQB0be...' },
    ],
    comingSoon: false,
  },
  {
    id: 'ton',
    icon: Gem,
    emoji: '💎',
    title: 'TON',
    subtitle: 'Hızlı, Güvenli Ödemeler',
    color: '#00B2FF',
    glow: 'rgba(0,178,255,0.3)',
    gradient: 'linear-gradient(135deg, rgba(0,178,255,0.15), rgba(0,140,200,0.05))',
    border: 'rgba(0,178,255,0.4)',
    badge: 'TON NETWORK',
    badgeColor: '#00B2FF',
    navTarget: 'home',
    description:
      'The Open Network ile anlık, düşük maliyetli ve güvenli ödemeler. Tonkeeper, @wallet Telegram entegrasyonu ile seamless kullanıcı deneyimi.',
    features: [
      'Anlık TON/TASTE swaplama',
      'Düşük işlem ücretleri (~0.05 TON)',
      'Tonkeeper & @wallet entegrasyonu',
      'STON.fi DEX üzerinde likidite',
      'Telegram native ödeme sistemi',
    ],
    stats: [
      { label: 'Hız', value: 'Anlık' },
      { label: 'Ücret', value: '~0.05 TON' },
      { label: 'DEX', value: 'STON.fi' },
    ],
    comingSoon: false,
  },
  {
    id: 'web3',
    icon: Wallet,
    emoji: '👛',
    title: 'WEB3',
    subtitle: 'Cüzdan Entegrasyonu',
    color: '#8B5CF6',
    glow: 'rgba(139,92,246,0.3)',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(109,40,217,0.05))',
    border: 'rgba(139,92,246,0.4)',
    badge: 'WEB3',
    badgeColor: '#8B5CF6',
    navTarget: 'wallet',
    description:
      'TonConnect 2.0 ile güvenli cüzdan bağlantısı. Seed phrase ile içe aktarma, QR kod ile ödeme alma, tam Web3 deneyimi.',
    features: [
      'TonConnect 2.0 entegrasyonu',
      '24 kelime seed phrase ile import',
      'QR kod ile ödeme alma/gönderme',
      'TastePay ile işletme ödemeleri',
      'Çoklu cüzdan desteği',
    ],
    stats: [
      { label: 'Protokol', value: 'TonConnect 2' },
      { label: 'Cüzdanlar', value: 'Tonkeeper+' },
      { label: 'Güvenlik', value: 'E2E' },
    ],
    comingSoon: false,
  },
  {
    id: 'global',
    icon: Globe2,
    emoji: '🌍',
    title: 'Global',
    subtitle: 'Topluluk Gücü',
    color: '#10B981',
    glow: 'rgba(16,185,129,0.3)',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.05))',
    border: 'rgba(16,185,129,0.4)',
    badge: 'GLOBAL',
    badgeColor: '#10B981',
    navTarget: 'community',
    description:
      'Dünya genelinde büyüyen gastronomi topluluğu. 5+ dil desteği, global live chat, uluslararası etkinlikler ve iş birliği fırsatları.',
    features: [
      '5+ dil desteği (TR, EN, RU, DE, FR)',
      'Global live chat topluluğu',
      'Uluslararası ortaklık ağı',
      'Ülkeler arası tarif & kültür paylaşımı',
      'Global liderlik tablosu',
    ],
    stats: [
      { label: 'Dil', value: '5+' },
      { label: 'Ağ', value: 'Telegram' },
      { label: 'Kapsam', value: 'Global' },
    ],
    comingSoon: false,
  },
  {
    id: 'community',
    icon: Users,
    emoji: '👥',
    title: 'Community',
    subtitle: 'Topluluk & Etkinlikler',
    color: '#EC4899',
    glow: 'rgba(236,72,153,0.3)',
    gradient: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(219,39,119,0.05))',
    border: 'rgba(236,72,153,0.4)',
    badge: 'COMMUNITY',
    badgeColor: '#EC4899',
    navTarget: 'community',
    description:
      'TASTE topluluğu ile yemek paylaş, tarif keşfet, etkinliklere katıl. Günlük görevler, sosyal ödüller ve aktif topluluk etkileşimi.',
    features: [
      'Günlük yemek paylaşım feed\'i',
      'Sosyal görevler ve ödüller',
      'Topluluk etkinlikleri ve yarışmalar',
      'Liderlik tablosu ve rozetler',
      'DAO oylama ve öneri sistemi',
    ],
    stats: [
      { label: 'Platform', value: 'Telegram' },
      { label: 'Ödül', value: '+TASTE' },
      { label: 'Görevler', value: 'Günlük' },
    ],
    comingSoon: false,
  },
  {
    id: 'pool',
    icon: Droplets,
    emoji: '💧',
    title: 'Pool',
    subtitle: 'Likidite Havuzu & Yeni Havuz Oluştur',
    color: '#0EA5E9',
    glow: 'rgba(14,165,233,0.3)',
    gradient: 'linear-gradient(135deg, rgba(14,165,233,0.15), rgba(2,132,199,0.05))',
    border: 'rgba(14,165,233,0.4)',
    badge: 'DeFi',
    badgeColor: '#0EA5E9',
    navTarget: null,
    externalUrl: 'https://app.ston.fi',
    description:
      'TASTE likidite havuzları ve yeni havuz oluşturma. STON.fi üzerinde TON/TASTE, USDT/TASTE ve diğer çiftlerde likidite sağlayın.',
    features: [
      'Mevcut havuzları görüntüle',
      'Yeni havuz oluştur',
      'Likidite sağla ve kazan',
      'Havuz APY ve istatistikleri',
      'STON.fi entegrasyonu',
    ],
    stats: [
      { label: 'DEX', value: 'STON.fi' },
      { label: 'Ana Çift', value: 'TON/TASTE' },
      { label: 'Model', value: 'AMM' },
    ],
    comingSoon: false,
  },
  {
    id: 'token-utility',
    icon: Coins,
    emoji: '🪙',
    title: 'Token Utility',
    subtitle: '$TASTE AI Kullanım Alanları',
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.3)',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(217,119,6,0.05))',
    border: 'rgba(245,158,11,0.4)',
    badge: '$TASTE',
    badgeColor: '#F59E0B',
    navTarget: 'home',
    description:
      '$TASTE token, ekosistemi besleyen temel değer birimi. İşletme ödemeleri, ödül sistemi, DAO oylama ve premium özellik erişiminden oluşan zengin utility.',
    features: [
      'İşletmelerde ödeme aracı',
      'Topluluk ödül sistemi',
      'DAO oylama gücü',
      'Premium özellik erişimi',
      'Likidite havuzu geliri',
    ],
    stats: [
      { label: 'Arz', value: '25M TASTE' },
      { label: 'Kilitli', value: '%88.4' },
      { label: 'Ağ', value: 'TON' },
    ],
    comingSoon: false,
  },
]

// ─── Main Component ──────────────────────────────────────────────────────────
export function TasteEcosystem({ onNavigate, onOpenTastePay }: EcosystemProps) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const activeSection = ECOSYSTEM_SECTIONS.find(s => s.id === selectedSection)

  const handleCardAction = (section: typeof ECOSYSTEM_SECTIONS[0]) => {
    if (section.id === 'pool') {
      setSelectedSection(section.id)
    } else {
      setSelectedSection(section.id)
    }
  }

  const handleNavigate = (section: typeof ECOSYSTEM_SECTIONS[0]) => {
    setSelectedSection(null)
    if (section.navTarget === 'pay' && onOpenTastePay) {
      onOpenTastePay()
    } else if (section.navTarget) {
      onNavigate(section.navTarget)
    } else if ((section as any).externalUrl) {
      window.open((section as any).externalUrl, '_blank')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #050810 0%, #0a0f1c 40%, #0d1128 100%)',
      fontFamily: 'Inter, system-ui, sans-serif',
      paddingBottom: '100px',
    }}>

      {/* ── Hero Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'relative',
          padding: '32px 16px 24px',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Background glow orbs */}
        <div style={{
          position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)',
          width: '300px', height: '200px',
          background: 'radial-gradient(ellipse, rgba(168,85,247,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '20px', left: '20%',
          width: '100px', height: '100px',
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', top: '20px', right: '20%',
          width: '100px', height: '100px',
          background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* AI Brain Icon */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            fontSize: '48px',
            marginBottom: '12px',
            display: 'inline-block',
            filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.6))',
          }}
        >
          <img src="/tai-logo-gold.png" alt="TASTE AI Logo" style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover' }} />
        </motion.div>

        <h1 style={{
          margin: '0 0 6px',
          fontSize: '28px',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #A855F7 0%, #3B82F6 50%, #06B6D4 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.5px',
        }}>
          TASTE AI EKOSİSTEMİ
        </h1>

        <p style={{
          margin: '0 0 8px',
          fontSize: '11px',
          fontWeight: 600,
          letterSpacing: '3px',
          color: 'rgba(168,85,247,0.8)',
          textTransform: 'uppercase',
        }}>
          AI POWERED FOOD ECOSYSTEM
        </p>

        <p style={{
          margin: '0',
          fontSize: '13px',
          color: 'rgba(148,163,184,0.8)',
          maxWidth: '320px',
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: '1.5',
        }}>
          Yapay zeka, blockchain ve gastronomiyi buluşturan ekosistem
        </p>

        {/* Decorative line */}
        <div style={{
          marginTop: '20px',
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.5), rgba(59,130,246,0.5), transparent)',
        }} />
      </motion.div>

      {/* ── Section Labels ── */}
      <div style={{ padding: '0 16px 12px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}>
          <Sparkles size={14} color="#A855F7" />
          <span style={{ fontSize: '12px', color: 'rgba(148,163,184,0.7)', fontWeight: 600, letterSpacing: '1px' }}>
            EKOSİSTEM BÖLÜMLERİ
          </span>
        </div>

        {/* ── Cards Grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '12px',
        }}>
          {ECOSYSTEM_SECTIONS.map((section, index) => {
            const Icon = section.icon
            const isHovered = hoveredCard === section.id
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                onMouseEnter={() => setHoveredCard(section.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleCardAction(section)}
                style={{
                  position: 'relative',
                  background: isHovered ? section.gradient : 'rgba(15,23,42,0.6)',
                  border: `1px solid ${isHovered ? section.border : 'rgba(255,255,255,0.07)'}`,
                  borderRadius: '16px',
                  padding: '16px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  boxShadow: isHovered ? `0 0 20px ${section.glow}` : 'none',
                  backdropFilter: 'blur(12px)',
                  overflow: 'hidden',
                }}
              >
                {/* Glow bg */}
                {isHovered && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: section.gradient,
                    borderRadius: '16px',
                    opacity: 0.4,
                    pointerEvents: 'none',
                  }} />
                )}

                {/* Badge */}
                <div style={{
                  position: 'absolute', top: '10px', right: '10px',
                  background: `${section.badgeColor}22`,
                  border: `1px solid ${section.badgeColor}44`,
                  borderRadius: '6px',
                  padding: '2px 6px',
                  fontSize: '8px',
                  fontWeight: 700,
                  color: section.badgeColor,
                  letterSpacing: '0.5px',
                }}>
                  {section.badge}
                </div>

                {/* Coming Soon overlay */}
                {section.comingSoon && (
                  <div style={{
                    position: 'absolute', top: '10px', left: '10px',
                    background: 'rgba(239,68,68,0.2)',
                    border: '1px solid rgba(239,68,68,0.4)',
                    borderRadius: '6px',
                    padding: '2px 6px',
                    fontSize: '7px',
                    fontWeight: 700,
                    color: '#EF4444',
                    letterSpacing: '0.5px',
                  }}>
                    COMING SOON
                  </div>
                )}

                {/* Icon */}
                <div style={{
                  width: '40px', height: '40px',
                  borderRadius: '12px',
                  background: `${section.color}18`,
                  border: `1px solid ${section.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '10px',
                  boxShadow: isHovered ? `0 0 12px ${section.glow}` : 'none',
                  transition: 'all 0.25s ease',
                }}>
                  <Icon size={20} color={section.color} />
                </div>

                {/* Title */}
                <div style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: isHovered ? section.color : '#F1F5F9',
                  marginBottom: '2px',
                  transition: 'color 0.25s ease',
                }}>
                  {section.title}
                </div>

                {/* Subtitle */}
                <div style={{
                  fontSize: '10px',
                  color: 'rgba(148,163,184,0.7)',
                  marginBottom: '12px',
                  lineHeight: '1.3',
                }}>
                  {section.subtitle}
                </div>

                {/* Stats row */}
                <div style={{
                  display: 'flex',
                  gap: '6px',
                  flexWrap: 'wrap',
                }}>
                  {section.stats.slice(0, 2).map((stat, i) => (
                    <div key={i} style={{
                      background: `${section.color}12`,
                      border: `1px solid ${section.color}20`,
                      borderRadius: '6px',
                      padding: '3px 6px',
                      fontSize: '9px',
                      color: 'rgba(203,213,225,0.8)',
                    }}>
                      <span style={{ color: section.color, fontWeight: 700 }}>{stat.value}</span>
                    </div>
                  ))}
                </div>

                {/* Arrow */}
                <div style={{
                  position: 'absolute', bottom: '14px', right: '12px',
                  opacity: isHovered ? 1 : 0.3,
                  transition: 'opacity 0.25s ease',
                }}>
                  <ChevronRight size={14} color={section.color} />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ── Bottom Info Strip ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          margin: '16px',
          padding: '14px 16px',
          background: 'rgba(168,85,247,0.08)',
          border: '1px solid rgba(168,85,247,0.2)',
          borderRadius: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div style={{ fontSize: '22px' }}>⛓️</div>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#A855F7', marginBottom: '2px' }}>
            TON · WEB3 · BLOCKCHAIN
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(148,163,184,0.7)' }}>
            Restaurants · Cafes · Community · Global
          </div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <div style={{
            background: 'linear-gradient(135deg, #A855F7, #3B82F6)',
            borderRadius: '8px',
            padding: '6px 10px',
            fontSize: '9px',
            fontWeight: 700,
            color: 'white',
            letterSpacing: '0.5px',
          }}>
            LIVE
          </div>
        </div>
      </motion.div>

      {/* ── Detail Modal ── */}
      <AnimatePresence>
        {selectedSection && activeSection && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSection(null)}
              style={{
                position: 'fixed', inset: 0,
                background: 'rgba(0,0,0,0.75)',
                backdropFilter: 'blur(4px)',
                zIndex: 50,
              }}
            />

            {/* Sheet */}
            <motion.div
              key="sheet"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                background: 'linear-gradient(180deg, #0f172a 0%, #0a0f1c 100%)',
                border: `1px solid ${activeSection.border}`,
                borderBottom: 'none',
                borderRadius: '24px 24px 0 0',
                zIndex: 51,
                maxHeight: '85vh',
                overflowY: 'auto',
                paddingBottom: '40px',
              }}
            >
              {/* Handle */}
              <div style={{
                width: '36px', height: '4px',
                background: 'rgba(255,255,255,0.15)',
                borderRadius: '2px',
                margin: '12px auto 0',
              }} />

              {/* Header */}
              <div style={{
                padding: '20px 20px 16px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                borderBottom: `1px solid rgba(255,255,255,0.06)`,
              }}>
                {/* Icon */}
                <div style={{
                  width: '56px', height: '56px',
                  borderRadius: '16px',
                  background: `${activeSection.color}18`,
                  border: `1px solid ${activeSection.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: `0 0 20px ${activeSection.glow}`,
                }}>
                  {(() => { const Icon = activeSection.icon; return <Icon size={26} color={activeSection.color} /> })()}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px',
                  }}>
                    <span style={{
                      fontSize: '20px',
                      fontWeight: 800,
                      color: '#F1F5F9',
                    }}>
                      {activeSection.title}
                    </span>
                    <span style={{
                      background: `${activeSection.badgeColor}22`,
                      border: `1px solid ${activeSection.badgeColor}44`,
                      borderRadius: '6px',
                      padding: '2px 7px',
                      fontSize: '9px',
                      fontWeight: 700,
                      color: activeSection.badgeColor,
                    }}>
                      {activeSection.badge}
                    </span>
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: activeSection.color,
                    fontWeight: 600,
                  }}>
                    {activeSection.subtitle}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSection(null)}
                  style={{
                    width: '32px', height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    border: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <X size={16} color="rgba(148,163,184,0.8)" />
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: '20px' }}>

                {/* Description */}
                <p style={{
                  fontSize: '13px',
                  lineHeight: '1.65',
                  color: 'rgba(148,163,184,0.9)',
                  marginBottom: '20px',
                }}>
                  {activeSection.description}
                </p>

                {/* Stats Row */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  marginBottom: '24px',
                }}>
                  {activeSection.stats.map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.08 }}
                      style={{
                        background: `${activeSection.color}10`,
                        border: `1px solid ${activeSection.color}25`,
                        borderRadius: '12px',
                        padding: '12px 8px',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 800,
                        color: activeSection.color,
                        marginBottom: '4px',
                      }}>
                        {stat.value}
                      </div>
                      <div style={{
                        fontSize: '9px',
                        color: 'rgba(148,163,184,0.6)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}>
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Features */}
                <div style={{
                  marginBottom: '24px',
                }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'rgba(148,163,184,0.5)',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    marginBottom: '12px',
                  }}>
                    ÖZELLİKLER
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {activeSection.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.07 }}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                        }}
                      >
                        <CheckCircle2 size={15} color={activeSection.color} style={{ flexShrink: 0, marginTop: '1px' }} />
                        <span style={{
                          fontSize: '13px',
                          color: 'rgba(203,213,225,0.85)',
                          lineHeight: '1.4',
                        }}>
                          {feature}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Pool specific: New Pool CTA */}
                {activeSection.id === 'pool' && (
                  <div style={{
                    background: 'rgba(14,165,233,0.08)',
                    border: '1px solid rgba(14,165,233,0.25)',
                    borderRadius: '14px',
                    padding: '16px',
                    marginBottom: '16px',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                    }}>
                      <Plus size={16} color="#0EA5E9" />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0EA5E9' }}>
                        Yeni Havuz Oluştur
                      </span>
                    </div>
                    <p style={{
                      fontSize: '12px',
                      color: 'rgba(148,163,184,0.7)',
                      margin: '0 0 12px',
                      lineHeight: '1.5',
                    }}>
                      STON.fi üzerinde yeni bir TASTE likidite havuzu oluşturun. TON, USDT, DOGS, NOT ve diğer tokenlerle çift oluşturabilirsiniz.
                    </p>
                    <button
                      onClick={() => window.open('https://app.ston.fi/pools/create', '_blank')}
                      style={{
                        width: '100%',
                        padding: '11px',
                        background: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
                        border: 'none',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                      }}
                    >
                      <Plus size={14} />
                      Havuz Oluştur (STON.fi)
                      <ExternalLink size={12} />
                    </button>
                  </div>
                )}

                {/* Action Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavigate(activeSection)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: `linear-gradient(135deg, ${activeSection.color}, ${activeSection.color}bb)`,
                    border: 'none',
                    borderRadius: '14px',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: `0 4px 20px ${activeSection.glow}`,
                  }}
                >
                  {activeSection.id === 'pool'
                    ? <><Droplets size={16} /> STON.fi Havuzlarına Git <ExternalLink size={14} /></>
                    : activeSection.navTarget
                    ? <><Zap size={16} /> Keşfet <ArrowRight size={16} /></>
                    : <><ExternalLink size={16} /> Dışarıda Aç <ExternalLink size={14} /></>
                  }
                </motion.button>

                {/* Coming soon note */}
                {activeSection.comingSoon && (
                  <div style={{
                    marginTop: '12px',
                    textAlign: 'center',
                    fontSize: '11px',
                    color: 'rgba(239,68,68,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}>
                    <Star size={10} color="#EF4444" />
                    Bu özellik yakında kullanıma açılacak
                  </div>
                )}

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
