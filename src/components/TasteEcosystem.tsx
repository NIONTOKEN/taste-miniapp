import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface EcosystemProps {
  onNavigate: (tab: string) => void;
  onOpenTastePay?: () => void;
}

const ECO_SECTIONS = [
  {
    id: 'token',
    icon: '🪙',
    titleKey: 'eco.token.title',
    descKey: 'eco.token.desc',
    color: '#f59e0b',
    glow: 'rgba(245,159,11,0.25)',
    badge: 'LIVE',
    badgeColor: '#10b981',
    navTarget: null,
    externalUrl: 'https://app.ston.fi/swap?chartVisible=false&ft=TON&tt=EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-',
    items: ['eco.token.i1', 'eco.token.i2', 'eco.token.i3', 'eco.token.i4'],
    stats: [
      { label: 'Total Supply', value: '25M' },
      { label: 'Locked', value: '88.4%' },
      { label: 'Pool', value: 'STON.fi' },
    ]
  },
  {
    id: 'swap',
    icon: '⚡',
    titleKey: 'eco.swap.title',
    descKey: 'eco.swap.desc',
    color: '#6366f1',
    glow: 'rgba(99,102,241,0.25)',
    badge: 'STON.fi',
    badgeColor: '#6366f1',
    navTarget: 'home',
    items: ['eco.swap.i1', 'eco.swap.i2', 'eco.swap.i3'],
    stats: [
      { label: 'DEX', value: 'STON.fi' },
      { label: 'Chain', value: 'TON' },
      { label: 'Pair', value: 'TON/TASTE' },
    ]
  },
  {
    id: 'pay',
    icon: '💳',
    titleKey: 'eco.pay.title',
    descKey: 'eco.pay.desc',
    color: '#0ea5e9',
    glow: 'rgba(14,165,233,0.25)',
    badge: 'NEW',
    badgeColor: '#f97316',
    navTarget: 'pay',
    items: ['eco.pay.i1', 'eco.pay.i2', 'eco.pay.i3'],
    stats: [
      { label: 'Method', value: 'QR / TonConnect' },
      { label: 'Speed', value: 'Instant' },
      { label: 'Fee', value: '~0.05 TON' },
    ]
  },
  {
    id: 'chef',
    icon: '👨‍🍳',
    titleKey: 'eco.chef.title',
    descKey: 'eco.chef.desc',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.25)',
    badge: 'DEMO',
    badgeColor: '#ef4444',
    navTarget: 'chef',
    items: ['eco.chef.i1', 'eco.chef.i2', 'eco.chef.i3', 'eco.chef.i4'],
    stats: [
      { label: 'Min Hold', value: '2,000 TASTE' },
      { label: 'Levels', value: '4 Tier' },
      { label: 'Benefit', value: 'Discount' },
    ]
  },
  {
    id: 'jobs',
    icon: '🧑‍🍳',
    titleKey: 'eco.jobs.title',
    descKey: 'eco.jobs.desc',
    color: '#f97316',
    glow: 'rgba(249,115,22,0.25)',
    badge: 'NEW',
    badgeColor: '#f97316',
    navTarget: 'community',
    items: ['eco.jobs.i1', 'eco.jobs.i2', 'eco.jobs.i3'],
    stats: [
      { label: 'Platform', value: 'Gastronomy' },
      { label: 'CV Builder', value: '✓ Active' },
      { label: 'Reviews', value: '+5 TASTE' },
    ]
  },
  {
    id: 'spin',
    icon: '🎰',
    titleKey: 'eco.spin.title',
    descKey: 'eco.spin.desc',
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.25)',
    badge: 'EARN',
    badgeColor: '#a855f7',
    navTarget: 'spin',
    items: ['eco.spin.i1', 'eco.spin.i2', 'eco.spin.i3'],
    stats: [
      { label: 'Daily Spin', value: 'Free' },
      { label: 'Leaderboard', value: '🏆 Active' },
      { label: 'Rewards', value: 'TASTE' },
    ]
  },
  {
    id: 'ai',
    icon: '🤖',
    titleKey: 'eco.ai.title',
    descKey: 'eco.ai.desc',
    color: '#22d3ee',
    glow: 'rgba(34,211,238,0.25)',
    badge: 'AI',
    badgeColor: '#22d3ee',
    navTarget: 'ai',
    items: ['eco.ai.i1', 'eco.ai.i2', 'eco.ai.i3'],
    stats: [
      { label: 'Engine', value: 'Gemini' },
      { label: 'Lang', value: '5 Dil' },
      { label: 'Focus', value: 'Gastronomy' },
    ]
  },
  {
    id: 'charity',
    icon: '❤️',
    titleKey: 'eco.charity.title',
    descKey: 'eco.charity.desc',
    color: '#f43f5e',
    glow: 'rgba(244,63,94,0.25)',
    badge: 'IMPACT',
    badgeColor: '#f43f5e',
    navTarget: 'charity',
    items: ['eco.charity.i1', 'eco.charity.i2', 'eco.charity.i3'],
    stats: [
      { label: 'Model', value: 'DAO Vote' },
      { label: 'Focus', value: 'Food Aid' },
      { label: 'Pool', value: 'Community' },
    ]
  },
  {
    id: 'community',
    icon: '👥',
    titleKey: 'eco.community.title',
    descKey: 'eco.community.desc',
    color: '#c084fc',
    glow: 'rgba(192,132,252,0.25)',
    badge: 'GLOBAL',
    badgeColor: '#c084fc',
    navTarget: 'community',
    items: ['eco.community.i1', 'eco.community.i2', 'eco.community.i3'],
    stats: [
      { label: 'Langs', value: '5' },
      { label: 'Network', value: 'Telegram' },
      { label: 'Tasks', value: '+TASTE' },
    ]
  },
  {
    id: 'partners',
    icon: '🤝',
    titleKey: 'eco.partners.title',
    descKey: 'eco.partners.desc',
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.25)',
    badge: 'WEB3',
    badgeColor: '#3b82f6',
    navTarget: 'partners',
    items: ['eco.partners.i1', 'eco.partners.i2', 'eco.partners.i3'],
    stats: [
      { label: 'TON', value: 'Ecosystem' },
      { label: 'Real World', value: 'Restaurants' },
      { label: 'Growing', value: '↑' },
    ]
  },
  {
    id: 'vote',
    icon: '🗳️',
    titleKey: 'eco.vote.title',
    descKey: 'eco.vote.desc',
    color: '#eab308',
    glow: 'rgba(234,179,8,0.25)',
    badge: 'DAO',
    badgeColor: '#eab308',
    navTarget: 'vote',
    items: ['eco.vote.i1', 'eco.vote.i2', 'eco.vote.i3'],
    stats: [
      { label: 'Model', value: 'On-chain' },
      { label: 'Power', value: 'Holders' },
      { label: 'Scope', value: 'Treasury' },
    ]
  },
  {
    id: 'whitepaper',
    icon: '📖',
    titleKey: 'eco.whitepaper.title',
    descKey: 'eco.whitepaper.desc',
    color: '#64748b',
    glow: 'rgba(100,116,139,0.25)',
    badge: 'DOCS',
    badgeColor: '#64748b',
    navTarget: 'whitepaper',
    items: ['eco.whitepaper.i1', 'eco.whitepaper.i2', 'eco.whitepaper.i3'],
    stats: [
      { label: 'Whitepaper', value: 'Full' },
      { label: 'Roadmap', value: 'Phase 1-3' },
      { label: 'Manifesto', value: '✓' },
    ]
  },
];

const FALLBACK_TRANSLATIONS: Record<string, string> = {
  // Token
  'eco.token.title': 'TASTE Token',
  'eco.token.desc': 'TON blockchain üzerinde 25 milyon arzlı, %88 kilitli, yiyecek-içecek sektörü için tasarlanmış utility token.',
  'eco.token.i1': '25,000,000 toplam arz',
  'eco.token.i2': '%88.4 JVault\'ta kilitli',
  'eco.token.i3': 'STON.fi DEX\'te işlem görür',
  'eco.token.i4': 'TON ekosisteminde yerli token',
  // Swap
  'eco.swap.title': 'TASTE Swap',
  'eco.swap.desc': 'TON ile anında TASTE satın al. STON.fi DEX entegrasyonu ile hızlı, güvenli işlem.',
  'eco.swap.i1': 'STON.fi DEX üzerinden',
  'eco.swap.i2': 'Tonkeeper derin bağlantısı',
  'eco.swap.i3': 'Anlık işlem onayı',
  // Pay
  'eco.pay.title': 'TASTE Pay',
  'eco.pay.desc': 'QR kod ve TonConnect ile restoranlarda saniyeler içinde ödeme yap veya al.',
  'eco.pay.i1': 'QR kod ile ödeme',
  'eco.pay.i2': 'İşletme modu: Fatura oluştur',
  'eco.pay.i3': 'Anlık blockchain onayı',
  // Chef
  'eco.chef.title': 'Taste Chef',
  'eco.chef.desc': 'TASTE tut, şef seviyeni yükselt, partner restoranlardan sadakat indirimi kazan.',
  'eco.chef.i1': 'Çırak → Kalfa → Usta → Şef',
  'eco.chef.i2': '2,000+ TASTE ile indirim hakkı',
  'eco.chef.i3': 'Partner restoran ağı',
  'eco.chef.i4': 'Blockchain tabanlı sadakat',
  // Jobs
  'eco.jobs.title': 'TASTE Jobs',
  'eco.jobs.desc': 'Gastronomi sektörü için iş ilanı, CV oluşturma ve işyeri değerlendirme platformu.',
  'eco.jobs.i1': 'Mutfak iş ilanları',
  'eco.jobs.i2': 'CV oluştur ve paylaş',
  'eco.jobs.i3': 'İşyeri değerlendirme (+5 TASTE)',
  // Spin
  'eco.spin.title': 'Spin & Earn',
  'eco.spin.desc': 'Günlük çark çevir, TASTE kazan, liderlik tablosunda yüksel.',
  'eco.spin.i1': 'Günlük ücretsiz çevirme hakkı',
  'eco.spin.i2': 'Enerji sistemi',
  'eco.spin.i3': 'Haftalık liderlik tablosu',
  // AI
  'eco.ai.title': 'TASTE AI',
  'eco.ai.desc': 'Gastronomi, token ve TASTE ekosistemi hakkında sorularını yanıtlayan yapay zeka asistanı.',
  'eco.ai.i1': 'Gemini AI destekli',
  'eco.ai.i2': '5 dil desteği',
  'eco.ai.i3': 'Gastronomi odaklı bilgi',
  // Charity
  'eco.charity.title': 'TASTE Charity',
  'eco.charity.desc': 'Topluluk oylaması ile gıda yardımı projesini destekle. DAO modeli.',
  'eco.charity.i1': 'DAO ile şeffaf yönetim',
  'eco.charity.i2': 'Gıda yardımı odaklı',
  'eco.charity.i3': 'Topluluk hazinesi',
  // Community
  'eco.community.title': 'Topluluk',
  'eco.community.desc': '5 dilde küresel mutfak topluluğu. Görevler tamamla, TASTE kazan.',
  'eco.community.i1': 'Sosyal görevler ve ödüller',
  'eco.community.i2': 'Telegram tabanlı ağ',
  'eco.community.i3': '5 dil topluluğu',
  // Partners
  'eco.partners.title': 'Ortaklar',
  'eco.partners.desc': 'Gerçek dünya ve Web3 ortaklarıyla ekosistemi büyütüyoruz.',
  'eco.partners.i1': 'Fiziksel restoran ortakları',
  'eco.partners.i2': 'TON ekosistem protokolleri',
  'eco.partners.i3': 'Sürekli büyüyen ağ',
  // Vote
  'eco.vote.title': 'DAO Oylama',
  'eco.vote.desc': 'Token sahibi olarak projenin geleceğini şekillendir. On-chain yönetim.',
  'eco.vote.i1': 'Holder\'lar yönetime katılır',
  'eco.vote.i2': 'Hazine kararları',
  'eco.vote.i3': 'On-chain şeffaflık',
  // Whitepaper
  'eco.whitepaper.title': 'Dokümanlar',
  'eco.whitepaper.desc': 'Whitepaper, Roadmap, Manifesto ve tüm resmi belgeler burada.',
  'eco.whitepaper.i1': 'Tam teknik whitepaper',
  'eco.whitepaper.i2': 'Faz 1-3 yol haritası',
  'eco.whitepaper.i3': 'Manifesto & Legal',
};

export function TasteEcosystem({ onNavigate, onOpenTastePay }: EcosystemProps) {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const tr = (key: string) => {
    const result = t(key);
    if (result === key) return FALLBACK_TRANSLATIONS[key] || key;
    return result;
  };

  const handleCardAction = (section: typeof ECO_SECTIONS[0]) => {
    if (section.externalUrl) {
      const SWAP_URL = 'https://app.tonkeeper.com/dapp/https%3A%2F%2Fapp.ston.fi%2Fswap%3FchartVisible%3Dfalse%26ft%3DTON%26tt%3DEQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-';
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.openLink(SWAP_URL);
      } else {
        window.open(SWAP_URL, '_blank');
      }
    } else if (section.navTarget === 'pay' && onOpenTastePay) {
      onOpenTastePay();
    } else if (section.navTarget) {
      onNavigate(section.navTarget);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ paddingBottom: '20px' }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        {/* Animated galaxy orb */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #f59e0b, #f97316, #ec4899, #6366f1, #0ea5e9, #10b981, #f59e0b)',
            margin: '0 auto 16px',
            boxShadow: '0 0 40px rgba(245,159,11,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <div style={{
            position: 'absolute',
            inset: '4px',
            borderRadius: '50%',
            background: '#0a0f1c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px'
          }}>
            🌐
          </div>
        </motion.div>

        <h2 style={{
          margin: '0 0 8px',
          fontSize: '26px',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #f59e0b, #f97316, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '1px'
        }}>
          TASTE EKOSİSTEMİ
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
          Yiyecek-içecek sektörü için kurulmuş TON tabanlı Web3 ekosistemi
        </p>

        {/* Live stats bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '16px',
          flexWrap: 'wrap'
        }}>
          {[
            { label: 'Token', value: 'TASTE', color: '#f59e0b' },
            { label: 'Chain', value: 'TON', color: '#3b82f6' },
            { label: 'Modüller', value: `${ECO_SECTIONS.length}`, color: '#10b981' },
            { label: 'Dil', value: '5', color: '#c084fc' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 900, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ecosystem flow diagram */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245,159,11,0.08), rgba(99,102,241,0.08))',
        border: '1px solid rgba(245,159,11,0.2)',
        borderRadius: '20px',
        padding: '16px',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>
          EKOSİSTEM AKIŞI
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
          {[
            { icon: '💎', label: 'TON Al' },
            { icon: '⚡', label: 'TASTE Swap' },
            { icon: '🏦', label: 'Tut & Kazan' },
            { icon: '👨‍🍳', label: 'Chef Ol' },
            { icon: '💳', label: 'Kullan & Öde' },
            { icon: '🌍', label: 'Büyü' },
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span>{step.icon}</span>
                <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{step.label}</span>
              </div>
              {i < 5 && <span style={{ color: '#f59e0b', fontWeight: 900 }}>→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Ecosystem Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {ECO_SECTIONS.map((section, index) => {
          const isExpanded = expandedId === section.id;
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Card */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : section.id)}
                style={{
                  background: isExpanded
                    ? `linear-gradient(145deg, rgba(30,41,59,0.95), rgba(15,23,42,0.98))`
                    : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isExpanded ? section.color : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: isExpanded ? '20px 20px 0 0' : '20px',
                  padding: '16px 18px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isExpanded ? `0 0 20px ${section.glow}` : 'none',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Subtle glow when expanded */}
                {isExpanded && (
                  <div style={{
                    position: 'absolute', top: '-30px', right: '-30px',
                    width: '100px', height: '100px',
                    background: `radial-gradient(circle, ${section.glow} 0%, transparent 70%)`,
                    borderRadius: '50%', filter: 'blur(15px)', pointerEvents: 'none'
                  }} />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 1 }}>
                  {/* Icon bubble */}
                  <div style={{
                    width: '48px', height: '48px',
                    borderRadius: '14px',
                    background: `linear-gradient(135deg, ${section.color}22, ${section.color}11)`,
                    border: `1px solid ${section.color}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', flexShrink: 0,
                    boxShadow: isExpanded ? `0 4px 15px ${section.glow}` : 'none'
                  }}>
                    {section.icon}
                  </div>

                  {/* Title & desc */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontWeight: 800, fontSize: '15px', color: '#f1f5f9' }}>
                        {tr(section.titleKey)}
                      </span>
                      <span style={{
                        background: `${section.badgeColor}22`,
                        color: section.badgeColor,
                        border: `1px solid ${section.badgeColor}44`,
                        fontSize: '9px', fontWeight: 900,
                        padding: '2px 6px', borderRadius: '6px',
                        letterSpacing: '0.5px'
                      }}>
                        {section.badge}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: isExpanded ? 'normal' : 'nowrap' }}>
                      {tr(section.descKey)}
                    </p>
                  </div>

                  {/* Chevron */}
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ color: isExpanded ? section.color : '#475569', flexShrink: 0 }}
                  >
                    ▼
                  </motion.div>
                </div>
              </div>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{
                      background: `linear-gradient(145deg, rgba(15,23,42,0.98), rgba(10,15,28,0.99))`,
                      border: `1px solid ${section.color}`,
                      borderTop: 'none',
                      borderRadius: '0 0 20px 20px',
                      padding: '16px 18px 20px',
                    }}>
                      {/* Stats row */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${section.stats.length}, 1fr)`,
                        gap: '8px',
                        marginBottom: '14px'
                      }}>
                        {section.stats.map((stat, i) => (
                          <div key={i} style={{
                            background: `${section.color}0f`,
                            border: `1px solid ${section.color}22`,
                            borderRadius: '10px',
                            padding: '8px 6px',
                            textAlign: 'center'
                          }}>
                            <div style={{ fontSize: '13px', fontWeight: 900, color: section.color }}>{stat.value}</div>
                            <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Feature list */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                        {section.items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '18px', height: '18px', borderRadius: '50%',
                              background: `${section.color}22`, border: `1px solid ${section.color}44`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '10px', color: section.color, fontWeight: 900, flexShrink: 0
                            }}>
                              ✓
                            </div>
                            <span style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.4 }}>
                              {tr(item)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* CTA button */}
                      {(section.navTarget || section.externalUrl) && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardAction(section);
                          }}
                          style={{
                            width: '100%',
                            background: `linear-gradient(135deg, ${section.color}, ${section.color}cc)`,
                            color: '#000',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '12px',
                            fontWeight: 900,
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: `0 4px 15px ${section.glow}`,
                            letterSpacing: '0.5px'
                          }}
                        >
                          <span>{section.icon}</span>
                          <span>
                            {section.id === 'token' ? 'TASTE SATIN AL →' :
                             section.id === 'swap' ? 'SWAP\'A GİT →' :
                             section.id === 'pay' ? 'TASTE PAY AÇ →' :
                             section.id === 'chef' ? 'CHEF MODU →' :
                             section.id === 'jobs' ? 'İŞ İLANLARINA BAK →' :
                             section.id === 'spin' ? 'ÇARKI ÇEVİR →' :
                             section.id === 'ai' ? 'AI\'YI AÇ →' :
                             section.id === 'charity' ? 'HAYIR KURUMUNA GİT →' :
                             section.id === 'community' ? 'TOPLULUĞA KATIL →' :
                             section.id === 'partners' ? 'ORTAKLARI GÖR →' :
                             section.id === 'vote' ? 'OY VER →' :
                             section.id === 'whitepaper' ? 'DÖKÜMANLARI OKU →' :
                             'GİT →'}
                          </span>
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{
          marginTop: '24px',
          background: 'linear-gradient(135deg, rgba(245,159,11,0.1), rgba(99,102,241,0.1))',
          border: '1px solid rgba(245,159,11,0.25)',
          borderRadius: '20px',
          padding: '20px',
          textAlign: 'center'
        }}
      >
        <div style={{ fontSize: '28px', marginBottom: '10px' }}>🚀</div>
        <h3 style={{ margin: '0 0 8px', fontWeight: 900, fontSize: '16px', color: '#f1f5f9' }}>
          TASTE Ekosistemi Büyüyor
        </h3>
        <p style={{ margin: '0 0 16px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Yiyecek-içecek sektörünün Web3 dönüşümüne öncülük ediyoruz. Her yeni modül, topluluğun gücüyle hayata geçiyor.
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('whitepaper')}
            style={{
              background: 'rgba(245,159,11,0.15)',
              border: '1px solid rgba(245,159,11,0.3)',
              color: '#f59e0b',
              padding: '10px 20px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            📖 Whitepaper
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('roadmap')}
            style={{
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.3)',
              color: '#818cf8',
              padding: '10px 20px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            🗺️ Roadmap
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
