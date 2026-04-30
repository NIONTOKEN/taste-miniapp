import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Sparkles, RotateCcw } from 'lucide-react'

// ─── TASTE Knowledge Base ────────────────────────────────────────────────────
const TASTE_KNOWLEDGE = `
You are TASTE AI — the official AI assistant for the TASTE project.
You ONLY answer questions about the TASTE project. If a question is unrelated, politely redirect to TASTE topics.
Be friendly, enthusiastic, and informative. Use emojis naturally.
Always respond in the same language the user writes in (Turkish or English).

=== TASTE — COMPLETE KNOWLEDGE BASE ===

## What is TASTE?
TASTE is a gastronomy and education-focused digital loyalty asset built on the TON (The Open Network) blockchain.
It targets real-world use in restaurants, hotels, cafes, and the food & beverage industry.
Contract address: EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-

## Asset Economics
- Total Supply: 25,000,000 TASTE (Production rights are technically preserved for future community governance, but the team cannot generate new assets unilaterally)
- 🔒 88.4% Locked in JVault (3 separate locks):
  - Lock 1: 10,000,000 TASTE (40%)
  - Lock 2: 8,000,000 TASTE (32%)
  - Lock 3: 4,100,000 TASTE (16.4%)
- 👥 Team/Contributors: 2%
- 👑 Founder (Fatih Emon): 2%
- 💧 Liquidity Pool (STON.fi): 6.4% — gradually released
- 🎁 Rewards: 0.2%
- 💼 Operations: 1%
- LP Lock: 81.6% of STON.fi pTON-TASTE LP units are locked via tinu-locker.ton

## Why is Asset Generation Open?
The generation authority is technically left open because if TASTE later integrates with restaurants, hotels, and chain businesses to establish a discount system, the community might need a supply adjustment.
HOWEVER: The team CANNOT act alone. Any supply increase requires:
1. Community DAO voting
2. Transparent disclosure
3. Majority approval
4. On-chain record
Currently: 0 units have been added. Supply is fixed at 25M.

## Why Were Assets Locked?
🐋 Prevent concentration — stop individuals from controlling large supply
📉 Prevent instability — stops large amounts going on sale
🎭 Focus on real-world use — sustainable growth
🏗️ Long-term ecosystem stability — healthy digital economy

## Where to Buy TASTE?
- Primary DEX: STON.fi (TON/TASTE pair)
- Via Tonkeeper wallet
- Via @wallet on Telegram
- Steps: Load TON → Select amount → Click "Buy with TON" → Swap via STON.fi
- NEW: Direct OTC (Over-The-Counter) system (TR ONLY)
  TR Users can transfer TRY directly to the Admin's bank account via the QuickBuy feature in the mini-app to receive TASTE seamlessly. They MUST use their reference code in the transfer description. No crypto words allowed.

## TASTE Platform Features
1. **Telegram Mini App** — Full-featured app inside Telegram
2. **Food Feed (Yemek Akışı)** — Share recipes, food photos, restaurant reviews in real-time
3. **Charity Platform** — Support stray animal shelters
4. **Food Allergen System** — 14 mandatory EU & Turkey allergens integrated
5. **Live Activity** — Real-time blockchain activity tracker
6. **Global Live Chat** — Real-time community chat accessible to everyone worldwide.
7. **Leaderboard** — Community rankings
8. **Taste Wallet** — Includes internal asset tracking and the ability to import an existing TON wallet via a 24-word seed phrase.
9. **Documentation** — Full technical details at tastetoken.net

## Target Use Cases
🍽️ Restaurant payments & loyalty rewards
🏨 Hotel & hospitality industry
☕ Cafe reward programs
🎓 Culinary education & certification
🎟️ Discount coupons for food businesses
🤝 Customer loyalty rewards

## Vision & Mission
**Vision:** Build a global bridge where culinary mastery meets digital value, empowering creators and businesses through transparency.
**Mission:** Provide the gastronomy world with tools for loyalty, traceability, and growth using blockchain technology.

## Team
- **Fatih Emon** — Founder & Visionary
- **Angel of Taste** — Community & Ecosystem

## Social Media & Links
- Telegram Channel: @taste2025
- Twitter/X: @taste_token
- Instagram: @taste_ton_taste
- TikTok: @taste_ton
- Website: tastetoken.net
- STON.fi: https://app.ston.fi/swap?ft=TON&tt=EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-

## Security
- Smart contract passed security audit
- All locks publicly verifiable on TON blockchain via Tonscan
- Audit available at: tasteminiapp.netlify.app/audit.html

## Blockchain Details
- Blockchain: TON (The Open Network)
- Token Standard: Jetton (TON's token standard, like ERC-20 on Ethereum)
- Contract verified on Tonscan

## Completed Milestones (Q1 2026)
✅ Token Mint & Launch on STON.fi
✅ Liquidity Pool created and activated
✅ 88.4% token locked in JVault, 81.6% LP locked
✅ Security audit passed
✅ Telegram Mini App launched
✅ Airdrop for 521+ wallets completed
✅ Whitepaper & Litepaper published
✅ All social media channels established
✅ Stray animal charity platform added
✅ Food Feed (real-time) launched with Supabase
✅ Food Allergen Notification System integrated
✅ Mini App v2 update (March 2026) — PoweredBy SVG logos, TASTE summary card, reward countdown, likes/search/trending in Food Feed
✅ Mini App v2.2 Content & Compliance — March 2026 — TASTE Manifesto, full i18n support, legal framework.
✅ Mini App v2.3 Wallet & QR Update — March 2026 — Quick Wallet & Transfer system, balances, QR scanning and secure TASTE/TON sending.
✅ Mini App v2.4 Taste Chef Digital Discount — March 2026 — Next-gen loyalty system. Apprenticeship to Master Chef journey.
✅ Mini App v2.5 Community 3.0 — March 2026 — Global Real-time Food Feed & Job Board with direct Telegram contact and live global chat. CV photo uploads active. Tech stack (PoweredBy) updated with JVault, LP Locks, Railway, Netlify, Google, and Socials.
✅ Mini App v2.6 OTC & Transfer System — March 2026 — TR only direct bank transfer (TRY) to get TASTE seamlessly. 4-tab wallet component (Send, Receive, Buy, Sell via STON.fi).

## Taste Şef (Dijital İndirim Sistemi)
- **Ustalık Seviyeleri**: 🥉 Çırak (2k+), 🥈 Kalfa (4k+), 🥇 Usta (7.5k+), 👨‍🍳 Şef (15k+).
- **Avantajlar**: Anlaşmalı restoranlarda %2.5 ile %10 arasında değişen indirim hakları.
- **Sistem**: Cüzdan bakiyesine göre otomatik seviye belirleme. İndirim hakkı kazanmak için sembolik bir bedel (yaklaşık 1-2 TL değerinde TASTE) gönderilir.
- **Yasal Durum**: TASTE bir ödeme aracı değildir. Ana hesap TL ile ödenir, TASTE sadece indirim hakkı sağlar.
- **Şartlar**: Bu sistemi kullanmak için 18 yaş ve üzeri olmak zorunludur.

## TASTE Philosophy
🎯 TASTE doesn't roadmap what it cannot do.
✅ It roadmaps what it has done — proven, real.
🤝 It doesn't make promises it cannot keep. This is why people trust us.
📌 Every step transparent, every commitment fulfilled.
"TASTE builds trust, doesn't sell dreams."

## Charity
Platform for donating TON or TASTE to support stray animals:
- Food, veterinary care, and shelter support
- Donation channel open 24/7
- All aid with proof/documentation published transparently

## Official Partners
- **Panoda Şehir**: Official Web3 Partner. The digital city board joined TASTE! Listed in the Discover > Partners section.

## Legal & Risk
⚠️ TASTE is NOT financial advice
- Digital assets are highly technological
- You should only hold what you are comfortable with
- Not available in all jurisdictions
- Always DYOR (Do Your Own Research)
- TASTE IS NOT A PAYMENT METHOD.
`

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SUGGESTED_QUESTIONS_EN = [
  'What is TASTE?',
  'How do I get TASTE?',
  'Why are assets locked?',
  'What can I do with TASTE?',
  'Who is the team?',
  'What is the total supply?',
]

const SUGGESTED_QUESTIONS_TR = [
  'TASTE nedir?',
  'TASTE nasıl edinilir?',
  'Varlıklar neden kilitlendi?',
  'TASTE ile ne yapabilirim?',
  'TASTE ekibi kimlerdir?',
  'Toplam arz ne kadar?',
]

export function TasteAI() {
  const { i18n } = useTranslation()
  const lang = i18n.language?.startsWith('tr') ? 'tr' : 'en'
  const isTR = lang === 'tr'

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: isTR
        ? '👋 Merhaba! Ben TASTE AI — TASTE projesi hakkında her şeyi bilen resmi asistanınım. 🍳\n\nTASTE ekonomisi, platform özellikleri veya roadmap hakkında ne öğrenmek istediğini sor!'
        : '👋 Hello! I\'m TASTE AI — your official assistant who knows everything about the TASTE project. 🍳\n\nAsk me anything about TASTE economics, platform features, or the roadmap!',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const suggestedQuestions = isTR ? SUGGESTED_QUESTIONS_TR : SUGGESTED_QUESTIONS_EN

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const callGroqAPI = async (userMessage: string): Promise<string> => {
    const realHistory = messages.filter((m) => m.id !== '0').slice(-8)

    const mappedMessages = realHistory.map((m) => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    }))

    const reqMessages = [
      { role: 'system', content: TASTE_KNOWLEDGE },
      ...mappedMessages,
      { role: 'user', content: userMessage }
    ]

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: reqMessages }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const apiMsg = errorData?.error?.message || `HTTP ${response.status}`
      // The API error object format can be different depending on the endpoint but type or code is useful
      const apiCode = errorData?.error?.code || errorData?.error?.type || response.status
      console.error('Groq API error:', errorData)
      throw new Error(`API_ERROR:${apiCode}:${apiMsg}`)
    }

    const data = await response.json()
    const text = data?.choices?.[0]?.message?.content
    if (!text) {
      throw new Error('NO_RESPONSE:Empty choices array')
    }
    return text
  }

  const sendMessage = async (messageText?: string) => {
    const text = (messageText || input).trim()
    if (!text || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const reply = await callGroqAPI(text)
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch (err: unknown) {
      const errorCode = err instanceof Error ? err.message : 'UNKNOWN'
      let errorText = ''

      if (errorCode === 'GROQ_KEY_MISSING') {
        errorText = isTR
          ? '🔑 Groq API anahtarı bulunamadı. .env dosyasını kontrol et.'
          : '🔑 Groq API key not found. Check your .env file.'
      } else if (errorCode.startsWith('API_ERROR:')) {
        const parts = errorCode.split(':')
        const code = parts[1]
        const msg = parts.slice(2).join(':')
        if (code === '400' || msg.includes('API_KEY_INVALID') || msg.includes('invalid')) {
          errorText = isTR
            ? '🔑 API anahtarı geçersiz. Google AI Studio\'dan yeni bir key al.'
            : '🔑 Invalid API key. Get a new one from Google AI Studio.'
        } else if (code === '429' || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
          errorText = isTR
            ? '⏳ API kotası doldu. Biraz bekle ve tekrar dene.'
            : '⏳ API quota exceeded. Wait a moment and try again.'
        } else if (code === '403' || msg.includes('permission') || msg.includes('API_KEY_HTTP_REFERRER_BLOCKED')) {
          errorText = isTR
            ? '🚫 API anahtarı bu domain için kısıtlanmış. Google Cloud Console\'dan HTTP referrer kısıtlamasını kaldır.'
            : '🚫 API key restricted for this domain. Remove HTTP referrer restrictions in Google Cloud Console.'
        } else {
          errorText = `⚠️ API Hatası ${code}: ${msg}`
        }
      } else if (errorCode.startsWith('NO_RESPONSE:')) {
        const reason = errorCode.split(':')[1]
        errorText = isTR
          ? `⚠️ Yanıt alınamadı (${reason}). Tekrar dene.`
          : `⚠️ No response received (${reason}). Please try again.`
      } else {
        errorText = isTR
          ? `⚠️ Hata: ${errorCode}. Lütfen tekrar dene.`
          : `⚠️ Error: ${errorCode}. Please try again.`
      }

      setError(errorText)
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorText,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const resetChat = () => {
    setMessages([
      {
        id: '0',
        role: 'assistant',
        content: isTR
          ? '👋 Merhaba! Ben TASTE AI — TASTE token projesi hakkında her şeyi bilen resmi asistanınım. 🍳\n\nTASTE tokenomics, nasıl satın alınır, platform özellikleri veya roadmap hakkında ne öğrenmek istediğini sor!'
          : '👋 Hello! I\'m TASTE AI — your official assistant who knows everything about the TASTE token project. 🍳\n\nAsk me anything about TASTE tokenomics, how to buy, platform features, or the roadmap!',
        timestamp: new Date(),
      },
    ])
    setError(null)
    setInput('')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '70vh' }}
    >
      {/* Header */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(245,159,11,0.15), rgba(251,191,36,0.08))',
          border: '1px solid rgba(245,159,11,0.25)',
          borderRadius: '16px',
          padding: '14px 16px',
          marginBottom: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(245,159,11,0.4)',
              flexShrink: 0,
            }}
          >
            <Bot size={20} color="#000" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '14px', color: '#fbbf24' }}>
              TASTE AI
            </div>
            <div
              style={{
                fontSize: '10px',
                color: 'rgba(255,255,255,0.45)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#22c55e',
                  animation: 'pulse 2s infinite',
                  display: 'inline-block',
                }}
              />
              {isTR ? 'Çevrimiçi · Llama 3.3 70B' : 'Online · Llama 3.3 70B'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              background: 'rgba(245,159,11,0.1)',
              border: '1px solid rgba(245,159,11,0.2)',
              borderRadius: '8px',
              padding: '4px 8px',
              fontSize: '10px',
              color: '#f59e0b',
              fontWeight: 700,
            }}
          >
            <Sparkles size={10} style={{ display: 'inline', marginRight: '3px' }} />
            AI
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={resetChat}
            title={isTR ? 'Sohbeti sıfırla' : 'Reset chat'}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '6px',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.4)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <RotateCcw size={13} />
          </motion.button>
        </div>
      </div>

      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingRight: '4px',
          marginBottom: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          minHeight: '300px',
          maxHeight: '420px',
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'flex',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: '8px',
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  flexShrink: 0,
                  background:
                    msg.role === 'assistant'
                      ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                      : 'linear-gradient(135deg, #818cf8, #6366f1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {msg.role === 'assistant' ? (
                  <Bot size={14} color="#000" />
                ) : (
                  <User size={14} color="#fff" />
                )}
              </div>

              {/* Bubble */}
              <div
                style={{
                  maxWidth: '78%',
                  padding: '10px 13px',
                  borderRadius:
                    msg.role === 'user'
                      ? '16px 4px 16px 16px'
                      : '4px 16px 16px 16px',
                  background:
                    msg.role === 'user'
                      ? 'linear-gradient(135deg, rgba(129,140,248,0.25), rgba(99,102,241,0.15))'
                      : 'rgba(255,255,255,0.05)',
                  border:
                    msg.role === 'user'
                      ? '1px solid rgba(129,140,248,0.25)'
                      : '1px solid rgba(255,255,255,0.08)',
                  fontSize: '12.5px',
                  lineHeight: '1.65',
                  color: 'var(--text-main)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <Bot size={14} color="#000" />
            </div>
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '4px 16px 16px 16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                gap: '5px',
                alignItems: 'center',
              }}
            >
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.span
                  key={i}
                  animate={{ scale: [1, 1.6, 1], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, delay, repeat: Infinity }}
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#f59e0b',
                    display: 'inline-block',
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions (only show if ≤1 messages) */}
      {messages.length <= 1 && (
        <div style={{ marginBottom: '10px' }}>
          <div
            style={{
              fontSize: '10px',
              color: 'rgba(255,255,255,0.3)',
              marginBottom: '7px',
              fontWeight: 600,
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            {isTR ? '💡 Önerilen Sorular' : '💡 Suggested Questions'}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {suggestedQuestions.map((q, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.03, background: 'rgba(245,159,11,0.12)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => sendMessage(q)}
                style={{
                  background: 'rgba(245,159,11,0.06)',
                  border: '1px solid rgba(245,159,11,0.18)',
                  borderRadius: '20px',
                  padding: '5px 11px',
                  fontSize: '11px',
                  color: '#fbbf24',
                  cursor: 'pointer',
                  fontWeight: 500,
                  transition: 'background 0.2s',
                }}
              >
                {q}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '14px',
          padding: '6px 6px 6px 14px',
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
          placeholder={
            isTR
              ? 'TASTE hakkında bir şey sor...'
              : 'Ask something about TASTE...'
          }
          disabled={loading}
          style={{
            flex: 1,
            background: 'none',
            border: 'none',
            outline: 'none',
            color: 'var(--text-main)',
            fontSize: '13px',
            padding: '4px 0',
          }}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => sendMessage()}
          disabled={loading || !input.trim()}
          style={{
            background:
              input.trim() && !loading
                ? 'linear-gradient(135deg, #f59e0b, #d97706)'
                : 'rgba(255,255,255,0.06)',
            border: 'none',
            borderRadius: '10px',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: input.trim() && !loading ? 'pointer' : 'default',
            flexShrink: 0,
            transition: 'background 0.2s',
          }}
        >
          <Send
            size={15}
            color={input.trim() && !loading ? '#000' : 'rgba(255,255,255,0.25)'}
          />
        </motion.button>
      </div>

      {/* Footer Note */}
      <p
        style={{
          fontSize: '9.5px',
          color: 'rgba(255,255,255,0.2)',
          textAlign: 'center',
          marginTop: '8px',
          lineHeight: 1.5,
        }}
      >
        {isTR
          ? 'TASTE AI, proje bilgilerini temel alır. Yatırım tavsiyesi vermez.'
          : 'TASTE AI is powered by project knowledge. Not financial advice.'}
      </p>
    </motion.div>
  )
}
