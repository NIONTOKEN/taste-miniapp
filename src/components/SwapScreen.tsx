import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowLeftRight, ExternalLink, CreditCard, Building2, ShieldCheck, Copy, Check, Wallet, ChevronRight, Sparkles } from 'lucide-react'
import { useTonConnectUI } from '@tonconnect/ui-react'
import { useWallet } from '../context/WalletContext'
import { LogoGRAM, LogoDOGS, LogoUTYA, LogoUSDT, LogoTON, LogoTAI } from './TokenLogos'

interface SwapScreenProps {
  onClose: () => void
  initialMode?: 'fiat' | 'bank' | 'crypto'
}

type PairKey = 'TON_TAI' | 'USDT_TAI' | 'GRAM_TAI' | 'UTYA_TAI' | 'DOGS_TAI'

const PAIRS: { key: PairKey; from: string; to: string; FromLogo: any; color: string; dex: string; link: string }[] = [
  {
    key: 'TON_TAI',
    from: 'TON', to: 'TAI',
    FromLogo: LogoTON,
    color: '#3b82f6',
    dex: 'STON.fi',
    link: 'https://app.ston.fi/swap?chartVisible=false&ft=TON&tt=EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-',
  },
  {
    key: 'USDT_TAI',
    from: 'USD₮', to: 'TAI',
    FromLogo: LogoUSDT,
    color: '#10b981',
    dex: 'DeDust',
    link: 'https://dedust.io/swap/EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c/EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-',
  },
  {
    key: 'GRAM_TAI',
    from: 'GRAM', to: 'TAI',
    FromLogo: LogoGRAM,
    color: '#0284c7',
    dex: 'STON.fi',
    link: 'https://app.ston.fi/swap?ft=EQC47093oX5Xhb0xuk2lCr2RhS8ur-7W5uE_j045FsXdNYea&tt=EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-',
  },
  {
    key: 'UTYA_TAI',
    from: 'UTYA', to: 'TAI',
    FromLogo: LogoUTYA,
    color: '#eab308',
    dex: 'STON.fi',
    link: 'https://app.ston.fi/swap?search=TAI',
  },
  {
    key: 'DOGS_TAI',
    from: 'DOGS', to: 'TAI',
    FromLogo: LogoDOGS,
    color: '#f97316',
    dex: 'STON.fi',
    link: 'https://app.ston.fi/swap?ft=DOGS&tt=EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-',
  },
]

const TRY_PRESETS = [500, 1000, 2500, 5000, 10000]

export function SwapScreen({ onClose, initialMode = 'fiat' }: SwapScreenProps) {
  const { t, i18n } = useTranslation()
  const isTR = i18n.language?.startsWith('tr')
  const { activeAddress, createInternalWallet } = useWallet()
  const [tonConnectUI] = useTonConnectUI()

  const [mode, setMode] = useState<'fiat' | 'bank' | 'crypto'>(initialMode)
  const [selectedPair, setSelectedPair] = useState<PairKey>('TON_TAI')
  const [tryAmount, setTryAmount] = useState<number>(1000)
  const [showEmbeddedWidget, setShowEmbeddedWidget] = useState<boolean>(false)
  const [copiedAddr, setCopiedAddr] = useState<boolean>(false)

  const pair = PAIRS.find(p => p.key === selectedPair)!

  const onramperApiKey = import.meta.env.VITE_ONRAMPER_API_KEY || 'pk_test_01M6X4SBBF2BRQSB0NFX2QTTEW'
  const mercuryoWidgetId = import.meta.env.VITE_MERCURYO_WIDGET_ID || ''

  const buildOnramperUrl = () => {
    const params = new URLSearchParams({
      mode: 'buy',
      defaultFiat: 'TRY',
      defaultAmount: String(tryAmount || 1000),
      defaultCrypto: 'ton',
      onlyCryptos: 'ton,usdt_ton',
      themeName: 'dark',
      containerColor: '0f172a',
      primaryColor: 'f59e0b',
      secondaryColor: '1e293b',
      cardColor: '1e293b',
      primaryTextColor: 'ffffff',
      secondaryTextColor: '94a3b8',
      borderRadius: '0.75',
    })
    if (onramperApiKey) {
      params.set('apiKey', onramperApiKey)
    }
    if (activeAddress) {
      params.set('wallets', `ton:${activeAddress}`)
      params.set('networkWallets', `ton:${activeAddress}`)
    }
    return `https://buy.onramper.com/?${params.toString()}`
  }

  const buildMercuryoUrl = () => {
    const params = new URLSearchParams({
      currency: 'TON',
      fiat_currency: 'TRY',
      fiat_amount: String(tryAmount || 1000),
      lang: isTR ? 'tr' : 'en',
    })
    if (mercuryoWidgetId) {
      params.set('widget_id', mercuryoWidgetId)
    }
    if (activeAddress) {
      params.set('address', activeAddress)
    }
    return `https://exchange.mercuryo.io/?${params.toString()}`
  }

  const buildTransakUrl = () => {
    const params = new URLSearchParams({
      fiatCurrency: 'TRY',
      defaultFiatAmount: String(tryAmount || 1000),
      cryptoCurrencyCode: 'TON',
      network: 'ton',
      themeColor: 'f59e0b',
    })
    if (activeAddress) {
      params.set('walletAddress', activeAddress)
    }
    return `https://global.transak.com/?${params.toString()}`
  }

  const openExternalUrl = (url: string) => {
    if (window.Telegram?.WebApp?.openLink) {
      window.Telegram.WebApp.openLink(url)
    } else {
      window.open(url, '_blank')
    }
  }

  const openStonfiTonToTai = () => {
    openExternalUrl(PAIRS[0].link)
  }

  const openSwap = () => {
    openExternalUrl(pair.link)
  }

  const handleCopyAddress = () => {
    if (!activeAddress) return
    navigator.clipboard.writeText(activeAddress)
    setCopiedAddr(true)
    setTimeout(() => setCopiedAddr(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      style={{ paddingBottom: 20 }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#fff' }}>
            {isTR ? '🇹🇷 Tek Nokta TAI Satın Alma Merkezi' : '⚡ One-Stop TAI Buy Hub'}
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#94a3b8' }}>
            {isTR ? 'TL, Kredi Kartı, Havale veya Kripto ile anında $TAI al' : 'Buy $TAI instantly via Card, Bank or Crypto'}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            padding: '8px 10px',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <X size={18} />
        </motion.button>
      </div>

      {/* Mode Tabs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: 6,
          background: 'rgba(15, 23, 42, 0.8)',
          padding: 5,
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.08)',
          marginBottom: 18,
        }}
      >
        <button
          onClick={() => setMode('fiat')}
          style={{
            background: mode === 'fiat' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
            color: mode === 'fiat' ? '#000' : '#94a3b8',
            border: 'none',
            borderRadius: 12,
            padding: '10px 6px',
            fontSize: 11.5,
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            transition: 'all 0.2s',
          }}
        >
          <CreditCard size={14} />
          {isTR ? 'TL / Kart İle' : 'Card / Fiat'}
        </button>

        <button
          onClick={() => setMode('bank')}
          style={{
            background: mode === 'bank' ? 'linear-gradient(135deg, #10b981, #059669)' : 'transparent',
            color: mode === 'bank' ? '#fff' : '#94a3b8',
            border: 'none',
            borderRadius: 12,
            padding: '10px 6px',
            fontSize: 11.5,
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            transition: 'all 0.2s',
          }}
        >
          <Building2 size={14} />
          {isTR ? '0 Komisyon Havale' : 'Bank Transfer'}
        </button>

        <button
          onClick={() => setMode('crypto')}
          style={{
            background: mode === 'crypto' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'transparent',
            color: mode === 'crypto' ? '#fff' : '#94a3b8',
            border: 'none',
            borderRadius: 12,
            padding: '10px 6px',
            fontSize: 11.5,
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
            transition: 'all 0.2s',
          }}
        >
          <ArrowLeftRight size={14} />
          {isTR ? 'Kripto Takas' : 'Crypto Swap'}
        </button>
      </div>

      {/* Wallet Connection Status Bar */}
      <div
        style={{
          background: activeAddress ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 159, 11, 0.12)',
          border: `1px solid ${activeAddress ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 159, 11, 0.35)'}`,
          borderRadius: 14,
          padding: '10px 14px',
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <Wallet size={16} color={activeAddress ? '#10b981' : '#f59e0b'} style={{ flexShrink: 0 }} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: activeAddress ? '#10b981' : '#fbbf24' }}>
              {activeAddress
                ? isTR
                  ? '✅ Alıcı TON Cüzdanınız Hazır'
                  : '✅ Destination TON Wallet Connected'
                : isTR
                ? '⚠️ Önce TON Cüzdanınızı Bağlayın'
                : '⚠️ Connect Your TON Wallet First'}
            </div>
            <div
              style={{
                fontSize: 10,
                color: '#94a3b8',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {activeAddress
                ? `${activeAddress.slice(0, 8)}...${activeAddress.slice(-8)}`
                : isTR
                ? 'Aldığınız TON ve TAI doğrudan cüzdanınıza yatar'
                : 'Purchased TON & TAI go straight to your wallet'}
            </div>
          </div>
        </div>

        {activeAddress ? (
          <button
            onClick={handleCopyAddress}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 10,
              padding: '6px 10px',
              color: '#fff',
              fontSize: 10.5,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              flexShrink: 0,
            }}
          >
            {copiedAddr ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
            {copiedAddr ? (isTR ? 'Kopyalandı' : 'Copied') : isTR ? 'Adresi Kopyala' : 'Copy'}
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
            <button
              onClick={() => tonConnectUI.openModal()}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                border: 'none',
                borderRadius: 10,
                padding: '6px 10px',
                color: '#fff',
                fontSize: 10.5,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Tonkeeper Bağla
            </button>
            <button
              onClick={() => createInternalWallet(24)}
              style={{
                background: 'rgba(245,159,11,0.2)',
                border: '1px solid rgba(245,159,11,0.4)',
                borderRadius: 10,
                padding: '6px 10px',
                color: '#fbbf24',
                fontSize: 10.5,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              {isTR ? 'Hızlı Cüzdan Aç' : 'Create Wallet'}
            </button>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          TAB 1: TL / KREDİ KARTI İLE AL (ONRAMPER / MERCURYO / TRANSAK)
      ════════════════════════════════════════════════════════════════════════ */}
      {mode === 'fiat' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Step 1 Card */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(245,159,11,0.12), rgba(15,23,42,0.9))',
              border: '1px solid rgba(245,159,11,0.3)',
              borderRadius: 20,
              padding: '18px 16px',
              marginBottom: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  background: 'rgba(245,159,11,0.2)',
                  color: '#fbbf24',
                  padding: '3px 9px',
                  borderRadius: 8,
                  letterSpacing: 0.5,
                }}
              >
                {isTR ? 'ADIM 1: KART İLE TON / GRAM AL' : 'STEP 1: BUY TON / GRAM WITH CARD'}
              </span>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>
                Visa / Mastercard / Troy / Apple Pay
              </span>
            </div>

            {/* TON / GRAM Bilgilendirme Rozeti */}
            <div style={{
              background: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.35)',
              borderRadius: 10,
              padding: '8px 12px',
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 11,
              color: '#93c5fd',
              lineHeight: 1.4
            }}>
              <span style={{ fontSize: 16 }}>💡</span>
              <span>
                {isTR 
                  ? 'Borsalarda ve cüzdanlarda TON kripto parası "Gram" veya "Toncoin" olarak da adlandırılır. İkisi de aynı resmi TON varlığıdır, rahatlıkla alabilirsiniz.' 
                  : 'Notice: TON is also known as Gram or Toncoin across exchanges and wallets. Both represent the same official TON asset.'}
              </span>
            </div>

            {/* TRY Amount Input & Presets */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, color: '#cbd5e1', fontWeight: 700, marginBottom: 6 }}>
                {isTR ? 'Almak İstediğiniz Tutar (Türk Lirası - ₺)' : 'Amount to Spend (TRY - ₺)'}
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(0,0,0,0.35)',
                  border: '1px solid rgba(245,159,11,0.4)',
                  borderRadius: 14,
                  padding: '10px 14px',
                  marginBottom: 8,
                }}
              >
                <input
                  type="number"
                  value={tryAmount}
                  onChange={e => setTryAmount(Math.max(0, Number(e.target.value)))}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: 20,
                    fontWeight: 900,
                    outline: 'none',
                  }}
                />
                <span style={{ fontSize: 15, fontWeight: 900, color: '#f59e0b' }}>₺ TRY</span>
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {TRY_PRESETS.map(amt => (
                  <button
                    key={amt}
                    onClick={() => setTryAmount(amt)}
                    style={{
                      flex: 1,
                      minWidth: 56,
                      background: tryAmount === amt ? '#f59e0b' : 'rgba(255,255,255,0.06)',
                      color: tryAmount === amt ? '#000' : '#cbd5e1',
                      border: `1px solid ${tryAmount === amt ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`,
                      borderRadius: 10,
                      padding: '6px 4px',
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: 'pointer',
                    }}
                  >
                    {amt.toLocaleString('tr-TR')} ₺
                  </button>
                ))}
              </div>
            </div>

            {/* Embedded Onramper Toggle or Direct Gateways */}
            {showEmbeddedWidget ? (
              <div style={{ marginTop: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#fbbf24' }}>
                    🔒 Onramper Güvenli Ödeme Ekranı
                  </span>
                  <button
                    onClick={() => setShowEmbeddedWidget(false)}
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      border: 'none',
                      borderRadius: 8,
                      padding: '4px 8px',
                      color: '#cbd5e1',
                      fontSize: 10,
                      cursor: 'pointer',
                    }}
                  >
                    {isTR ? 'Kapat' : 'Close'}
                  </button>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: 540,
                    borderRadius: 16,
                    overflow: 'hidden',
                    border: '1px solid rgba(245,159,11,0.3)',
                    background: '#0f172a',
                  }}
                >
                  <iframe
                    src={buildOnramperUrl()}
                    title="Onramper Widget"
                    width="100%"
                    height="100%"
                    style={{ border: 'none' }}
                    allow="accelerometer; autoplay; camera; gyroscope; payment; microphone"
                  />
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {/* Primary: Onramper All-in-One */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowEmbeddedWidget(true)}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    border: 'none',
                    borderRadius: 14,
                    padding: '14px 16px',
                    color: '#000',
                    fontWeight: 900,
                    fontSize: 14,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 6px 20px rgba(245,159,11,0.35)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Sparkles size={18} />
                    <div style={{ textAlign: 'left' }}>
                      <div>{isTR ? 'Onramper ile Uygulama İçinde Al (Önerilen)' : 'Buy Inside App via Onramper'}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.8 }}>
                        {isTR ? 'Mercuryo, Transak, MoonPay, Banxa en iyi kur' : 'Aggregates Mercuryo, Transak, MoonPay'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} />
                </motion.button>

                {/* Secondary row: Direct Mercuryo (Tonkeeper partner) & Transak */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => openExternalUrl(buildMercuryoUrl())}
                    style={{
                      background: 'rgba(59, 130, 246, 0.14)',
                      border: '1px solid rgba(59, 130, 246, 0.4)',
                      borderRadius: 12,
                      padding: '11px 12px',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: 12,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ color: '#60a5fa' }}>⚡ Mercuryo</div>
                      <div style={{ fontSize: 9.5, color: '#94a3b8', marginTop: 2 }}>Tonkeeper Altyapısı</div>
                    </div>
                    <ExternalLink size={14} color="#60a5fa" />
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => openExternalUrl(buildTransakUrl())}
                    style={{
                      background: 'rgba(16, 185, 129, 0.14)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      borderRadius: 12,
                      padding: '11px 12px',
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: 12,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ color: '#34d399' }}>💳 Transak</div>
                      <div style={{ fontSize: 9.5, color: '#94a3b8', marginTop: 2 }}>Global TR Kart</div>
                    </div>
                    <ExternalLink size={14} color="#34d399" />
                  </motion.button>
                </div>
              </div>
            )}
          </div>

          {/* Step 2 Card: Convert TON to TAI in 1 Click */}
          <div
            style={{
              background: 'linear-gradient(145deg, rgba(16,185,129,0.14), rgba(15,23,42,0.9))',
              border: '1px solid rgba(16,185,129,0.35)',
              borderRadius: 20,
              padding: '16px',
              marginBottom: 14,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  background: 'rgba(16,185,129,0.2)',
                  color: '#34d399',
                  padding: '3px 9px',
                  borderRadius: 8,
                }}
              >
                {isTR ? 'ADIM 2: TON / GRAM -> $TAI DÖNÜŞTÜR' : 'STEP 2: SWAP TON / GRAM TO $TAI'}
              </span>
              <span style={{ fontSize: 11, color: '#34d399', fontWeight: 700 }}>STON.fi Resmi Havuz</span>
            </div>

            <p style={{ fontSize: 11.5, color: '#cbd5e1', margin: '0 0 12px', lineHeight: 1.45 }}>
              {isTR
                ? 'Kartla aldığınız TON (Gram) cüzdanınıza düştüğü anda aşağıdaki butona basarak saniyeler içinde $TAI tokena çevirin:'
                : 'Once your purchased TON arrives in your wallet, tap below to swap it into $TAI in seconds:'}
            </p>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={openStonfiTonToTai}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                border: 'none',
                borderRadius: 14,
                padding: '14px',
                color: '#fff',
                fontWeight: 900,
                fontSize: 14,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 6px 20px rgba(16,185,129,0.3)',
              }}
            >
              <ArrowLeftRight size={17} />
              {isTR ? 'Cüzdandaki TON İle Hemen $TAI Al (STON.fi)' : 'Swap TON to $TAI Now (STON.fi)'}
            </motion.button>
          </div>

          {/* Legal Compliance Notice */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
              padding: '10px 12px',
              fontSize: 10.5,
              color: '#64748b',
              lineHeight: 1.5,
            }}
          >
            <ShieldCheck size={16} color="#10b981" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              {isTR
                ? 'Yasal Güvence: Kredi/banka kartı işlemleri uluslararası lisanslı Onramper, Mercuryo ve Transak finans kuruluşları tarafından 3D Secure ile gerçekleştirilir. TASTE AI doğrudan TL tahsilatı veya kart saklama işlemi yapmaz.'
                : 'Legal Notice: Card payments are processed securely by licensed third-party fiat on-ramp providers (Onramper, Mercuryo, Transak).'}
            </div>
          </div>
        </motion.div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          TAB 2: TÜRK BANKALARI (0 KOMİSYON HAVALE / FAST SİHİRBAZI)
      ════════════════════════════════════════════════════════════════════════ */}
      {mode === 'bank' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 20,
              padding: '18px 16px',
              marginBottom: 16,
            }}
          >
            <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 900, color: '#34d399' }}>
              🏦 {isTR ? 'Türk Bankalarından 0 Komisyonla $TAI Alımı' : 'Zero-Fee Bank Transfer Guide'}
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: 11.5, color: '#94a3b8', lineHeight: 1.5 }}>
              {isTR
                ? 'Kredi kartı komisyonu ödemeden Ziraat, Vakıfbank, İş Bankası, Garanti vb. banka hesabınızdan 7/24 FAST ile 3 adımda $TAI alabilirsiniz:'
                : 'Buy $TAI in 3 simple steps using local bank transfer (FAST) with zero card fees:'}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Step 1 */}
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 14, padding: '12px 14px', borderLeft: '3px solid #f59e0b' }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: '#fbbf24', marginBottom: 4 }}>
                  1. Yerli Borsadan veya Telegram P2P'den TON (Gram / Toncoin) Alın
                </div>
                <div style={{ fontSize: 11, color: '#cbd5e1', lineHeight: 1.45 }}>
                  <strong>Binance TR, Paribu veya BtcTurk</strong> hesabınıza bankanızdan TL gönderip <strong>TON (Gram / Toncoin)</strong> satın alın (Bazı borsalarda Gram olarak da listelenebilir, ikisi de aynı TON ağıdır).
                </div>
              </div>

              {/* Step 2 */}
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 14, padding: '12px 14px', borderLeft: '3px solid #3b82f6' }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: '#60a5fa', marginBottom: 4 }}>
                  2. TON'u TASTE / Tonkeeper Cüzdanınıza Çekin
                </div>
                <div style={{ fontSize: 11, color: '#cbd5e1', lineHeight: 1.45, marginBottom: 8 }}>
                  Borsada &quot;Kripto Çek → TON Ağı&quot; kısmına yukarıdaki bağlı TON cüzdan adresinizi yapıştırın (Transfer ücreti sadece ~2 TL&apos;dir ve 1 dakikada gelir).
                </div>
                {activeAddress && (
                  <button
                    onClick={handleCopyAddress}
                    style={{
                      background: 'rgba(59,130,246,0.2)',
                      border: '1px solid rgba(59,130,246,0.4)',
                      borderRadius: 10,
                      padding: '7px 12px',
                      color: '#60a5fa',
                      fontSize: 11,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Copy size={13} />
                    {copiedAddr ? 'Adres Kopyalandı!' : `TON Adresimi Kopyala (${activeAddress.slice(0, 6)}...)`}
                  </button>
                )}
              </div>

              {/* Step 3 */}
              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 14, padding: '12px 14px', borderLeft: '3px solid #10b981' }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: '#34d399', marginBottom: 4 }}>
                  3. Tek Tıkla TON'u $TAI Tokena Çevirin
                </div>
                <div style={{ fontSize: 11, color: '#cbd5e1', lineHeight: 1.45, marginBottom: 10 }}>
                  TON cüzdanınıza ulaştığında aşağıdaki butona basın, STON.fi üzerinden anında $TAI cüzdanınıza geçsin!
                </div>
                <button
                  onClick={openStonfiTonToTai}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    borderRadius: 12,
                    padding: '12px',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  <ArrowLeftRight size={16} />
                  STON.fi İle TON'u $TAI'ye Çevir
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ════════════════════════════════════════════════════════════════════════
          TAB 3: KRİPTO TAKAS (DEX SWAP)
      ════════════════════════════════════════════════════════════════════════ */}
      {mode === 'crypto' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* Pair Selector */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginBottom: 10 }}>
              {t('swap_screen.select_pair', 'İşlem Çifti Seç')}
            </div>
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
                    padding: '12px 14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {selectedPair === p.key && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: p.color, boxShadow: `0 0 8px ${p.color}` }} />
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <p.FromLogo size={22} />
                      <div style={{ marginLeft: -6, zIndex: 1 }}>
                        <LogoTAI size={22} />
                      </div>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 800, color: selectedPair === p.key ? '#fff' : '#94a3b8' }}>{p.from}/TAI</span>
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
              style={{ background: `linear-gradient(135deg,${pair.color}14,rgba(0,0,0,0.3))`, border: `1px solid ${pair.color}33`, borderRadius: 22, padding: '22px 20px', marginBottom: 20 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <pair.FromLogo size={48} />
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 900 }}>{pair.from}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{t('swap_screen.sell_token', 'Satış token')}</div>
                  </div>
                </div>
                <div style={{ background: `${pair.color}22`, borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ArrowLeftRight size={16} color={pair.color} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 900 }}>TAI</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{t('swap_screen.buy_token', 'Alış token')}</div>
                  </div>
                  <LogoTAI size={48} />
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: '12px 16px', marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 4 }}>{t('swap_screen.trade_on', 'İşlem Yeri')}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: pair.color }}>{pair.dex}</div>
              </div>

              <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.6, background: 'rgba(255,255,255,0.02)', borderRadius: 12, padding: '10px 14px' }}>
                {t('swap_screen.swap_info', '💡 Swap işlemi harici DEX platformunda gerçekleşir. Cüzdanınızı bağladıktan sonra işlemi onaylayın.')}
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
        </motion.div>
      )}
    </motion.div>
  )
}
