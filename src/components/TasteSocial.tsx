import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, MessageCircle, Flame, Plus, Heart, 
  Send, Image as ImageIcon, Shield, Award, ExternalLink, CornerDownRight
} from 'lucide-react'
import { getPosts, insertPost, getMessages, updatePostLikes, getProfiles, sendHeartbeat } from '../services/supabase'
import type { SupaPost } from '../services/supabase'

// ─── Helpers ─────────────────────────────────────────────────────────────────
const tg = () => (window as any).Telegram?.WebApp
const tgUser = () => tg()?.initDataUnsafe?.user
const getUsername = () => {
  const u = tgUser()
  if (u?.username) return '@' + u.username
  if (u?.first_name) return u.first_name + (u.last_name ? ' ' + u.last_name : '')
  return 'Gourmet_User'
}
const getUserEmoji = () => {
  const emojis = ['👨‍🍳','👩‍🍳','🍕','🍔','🍜','🍣','🥘','🍱','🥗','🌮','🥩','🍰']
  const id = tgUser()?.id || 1089
  return emojis[id % emojis.length]
}
const getTasteId = (name: string, id?: number) => {
  const base = id ? id : Math.abs(name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0))
  return `#TAI-${(base % 9000 + 1000)}`
}
const timeAgo = (iso?: string) => {
  if (!iso) return 'Az önce'
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Şimdi'
  if (m < 60) return `${m}dk önce`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}sa önce`
  return `${Math.floor(h / 24)}g önce`
}

const haptic = (type: 'light' | 'medium' | 'heavy' | 'success' = 'light') => {
  try {
    if (tg()?.HapticFeedback) {
      if (type === 'success') tg()?.HapticFeedback.notificationOccurred('success')
      else tg()?.HapticFeedback.impactOccurred(type)
    }
  } catch { /* ignore */ }
}

interface SocialMember {
  id: string
  name: string
  username?: string
  emoji: string
  status: 'online' | 'recent' | 'offline'
  statusText: string
  role: string
  badgeColor: string
  tastePoints: number
  tasteId: string
  avatar?: string
  lastSeen?: string
  bio: string
}

const SEED_MEMBERS: SocialMember[] = [
  {
    id: 'm1',
    name: 'Chef Kerem Usta',
    username: '@chefkerem',
    emoji: '👨‍🍳',
    status: 'online',
    statusText: 'Kuzu tandır hazırlıyor 🔥',
    role: '👑 TAI Master Chef',
    badgeColor: '#f59e0b',
    tastePoints: 12450,
    tasteId: '#TAI-0001',
    bio: 'TASTE AI Danışman Şefi & Gastronomi Tutkunu.',
  },
  {
    id: 'm2',
    name: 'Selin Akın (Gurme)',
    username: '@selin_gurme',
    emoji: '👩‍🍳',
    status: 'online',
    statusText: 'İtalyan restoranı keşfinde 🍝',
    role: '💎 Elmas Gurme',
    badgeColor: '#06b6d4',
    tastePoints: 8920,
    tasteId: '#TAI-1420',
    bio: 'İstanbul mekan kaşifi ve yemek fotoğrafçısı.',
  },
  {
    id: 'm3',
    name: 'Mehmet TON Whale',
    username: '@ton_mehmet',
    emoji: '🐳',
    status: 'online',
    statusText: 'TAI/TON havuzuna likidite ekledi 💧',
    role: '⚡ DeFi Balinası',
    badgeColor: '#3b82f6',
    tastePoints: 18500,
    tasteId: '#TAI-0777',
    bio: 'TON Blockchain & TASTE DeFi erken destekçisi.',
  },
  {
    id: 'm4',
    name: 'Zeynep Kaya',
    username: '@zeynep_bakes',
    emoji: '🍰',
    status: 'online',
    statusText: 'Sufle tarifini sohbette paylaştı 🍫',
    role: '🥐 Tatlı Ustası',
    badgeColor: '#ec4899',
    tastePoints: 5340,
    tasteId: '#TAI-3211',
    bio: 'Fransız pastacılığı ve ev yapımı tatlılar.',
  },
  {
    id: 'm5',
    name: 'Barış Demir',
    username: '@baris_chef',
    emoji: '🥩',
    status: 'recent',
    statusText: '10 dk önce aktifti',
    role: '🔥 Steakhouse Chef',
    badgeColor: '#ef4444',
    tastePoints: 4120,
    tasteId: '#TAI-5092',
    bio: 'Et pişirme teknikleri & füme ustası.',
  },
  {
    id: 'm6',
    name: 'Ayşe Yıldız',
    username: '@ayse_foodie',
    emoji: '🥗',
    status: 'recent',
    statusText: '25 dk önce aktifti',
    role: '🌱 Sağlıklı Yaşam',
    badgeColor: '#10b981',
    tastePoints: 3400,
    tasteId: '#TAI-6610',
    bio: 'Vegan & Ege mutfağı meraklısı.',
  },
]

const QUICK_PHOTOS = [
  { url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80', label: '🥩 Et / Kebap' },
  { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80', label: '🍕 Pizza' },
  { url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80', label: '🍔 Burger' },
  { url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80', label: '🍰 Tatlı' },
  { url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80', label: '🥣 Çorba' },
  { url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80', label: '🥗 Salata' },
]

// ─── PostCard ────────────────────────────────────────────────────────────────
function PostCard({ post, onLike }: { post: SupaPost & { liked?: boolean }; onLike: (id: string) => void }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const [showFull, setShowFull] = useState(false)

  const typeLabel: Record<string, { emoji: string; label: string; color: string }> = {
    yemek:  { emoji: '🍽️', label: 'Yemek', color: '#f97316' },
    tarif:  { emoji: '📝', label: 'Tarif', color: '#8b5cf6' },
    menu:   { emoji: '🍴', label: 'Restoran', color: '#06b6d4' },
    career: { emoji: '👔', label: 'Kariyer', color: '#10b981' },
  }
  const meta = typeLabel[post.type] || typeLabel.yemek
  const isLong = (post.text || '').length > 120

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: 'var(--bg-card, rgba(255,255,255,0.04))',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 22,
        overflow: 'hidden',
        marginBottom: 16,
      }}
    >
      {/* Photo */}
      {post.photo && !imgError && (
        <div style={{ position: 'relative', width: '100%', paddingTop: '60%', background: 'rgba(0,0,0,0.2)' }}>
          {!imgLoaded && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
              🍽️
            </div>
          )}
          <img
            src={post.photo}
            alt=""
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover',
              opacity: imgLoaded ? 1 : 0,
              transition: 'opacity 0.3s',
            }}
          />
          {/* Type badge on image */}
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: `${meta.color}dd`, backdropFilter: 'blur(8px)',
            borderRadius: 20, padding: '4px 10px',
            fontSize: 11, fontWeight: 800, color: '#fff',
          }}>
            {meta.emoji} {meta.label}
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ padding: '14px 16px' }}>
        {/* Author row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: `linear-gradient(135deg, ${meta.color}33, ${meta.color}11)`,
            border: `2px solid ${meta.color}66`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
          }}>
            {post.author_emoji}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-main, #f8fafc)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {post.author_name}
            </div>
            <div style={{ fontSize: 11, color: '#64748b' }}>
              {post.city && `📍 ${post.city} · `}{timeAgo(post.created_at)}
            </div>
          </div>
          {!post.photo && (
            <div style={{ background: `${meta.color}22`, border: `1px solid ${meta.color}44`, borderRadius: 14, padding: '3px 9px', fontSize: 11, fontWeight: 700, color: meta.color, flexShrink: 0 }}>
              {meta.emoji} {meta.label}
            </div>
          )}
        </div>

        {/* Text */}
        <div style={{ fontSize: 14, color: 'var(--text-main, #e2e8f0)', lineHeight: 1.6, marginBottom: 12, whiteSpace: 'pre-wrap' }}>
          {isLong && !showFull ? post.text.slice(0, 120) + '...' : post.text}
          {isLong && (
            <button onClick={() => setShowFull(s => !s)} style={{ background: 'none', border: 'none', color: '#f59e0b', fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: '0 4px' }}>
              {showFull ? ' daha az' : ' devamını gör'}
            </button>
          )}
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {post.tags.map(tag => (
              <span key={tag} style={{ fontSize: 11, color: '#94a3b8', background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '2px 8px' }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 10 }}>
          <motion.button
            whileTap={{ scale: 1.3 }}
            onClick={() => onLike(post.id)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: (post as any).liked ? 'rgba(239,68,68,0.15)' : 'transparent', border: (post as any).liked ? '1px solid rgba(239,68,68,0.3)' : '1px solid transparent', borderRadius: 14, padding: '6px 12px', cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <span style={{ fontSize: 16 }}>{(post as any).liked ? '❤️' : '🤍'}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: (post as any).liked ? '#ef4444' : '#64748b' }}>{post.likes || 0}</span>
          </motion.button>

          {post.venue_name && (
            <div style={{ flex: 1, fontSize: 11, color: '#94a3b8', textAlign: 'right' }}>
              🏪 {post.venue_name}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ─── PostCreator Modal ────────────────────────────────────────────────────────
function PostCreator({ onClose, onPost }: { onClose: () => void; onPost: (p: SupaPost) => void }) {
  const [type, setType] = useState<'yemek' | 'tarif' | 'menu'>('yemek')
  const [text, setText] = useState('')
  const [photo, setPhoto] = useState('')
  const [city, setCity] = useState('')
  const [venue, setVenue] = useState('')
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(false)

  const typeOptions = [
    { key: 'yemek', emoji: '🍽️', label: 'Yemek' },
    { key: 'tarif', emoji: '📝', label: 'Tarif' },
    { key: 'menu', emoji: '🍴', label: 'Restoran' },
  ] as const

  const handlePost = async () => {
    if (!text.trim()) return
    setLoading(true)
    const tagArr = tags.split(',').map(t => t.trim().replace('#', '')).filter(Boolean)
    const payload = {
      type, text: text.trim(),
      author_name: getUsername(),
      author_emoji: getUserEmoji(),
      author_username: tgUser()?.username ? '@' + tgUser()?.username : undefined,
      photo: photo.trim() || undefined,
      city: city.trim() || undefined,
      venue_name: venue.trim() || undefined,
      tags: tagArr, likes: 0,
    }
    const result = await insertPost(payload)
    const newPost = result || { ...payload, id: Date.now().toString(), created_at: new Date().toISOString() }
    onPost(newPost as SupaPost)
    setLoading(false)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9000, display: 'flex', alignItems: 'flex-end' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 400 }}
        animate={{ y: 0 }}
        exit={{ y: 400 }}
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', background: 'var(--bg-card, #1e293b)',
          borderRadius: '28px 28px 0 0',
          padding: '24px 20px 40px',
          maxHeight: '85vh', overflowY: 'auto',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900 }}>📸 Paylaş</h3>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 18, color: '#94a3b8' }}>×</button>
        </div>

        {/* Type selector */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {typeOptions.map(t => (
            <button
              key={t.key}
              onClick={() => setType(t.key)}
              style={{
                flex: 1, padding: '8px 4px', borderRadius: 12, border: type === t.key ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                background: type === t.key ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.03)',
                cursor: 'pointer', fontSize: 11, fontWeight: 700, color: type === t.key ? '#f59e0b' : '#64748b',
              }}
            >
              {t.emoji}<br />{t.label}
            </button>
          ))}
        </div>

        {/* Text */}
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Ne yiyor, pişiriyor veya keşfediyorsunuz? 🍽️"
          rows={4}
          style={{
            width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 16, padding: '12px 14px', color: 'var(--text-main, #f8fafc)', fontSize: 14,
            resize: 'none', outline: 'none', boxSizing: 'border-box', lineHeight: 1.6, fontFamily: 'inherit',
          }}
        />

        {/* Photo URL */}
        <input
          value={photo}
          onChange={e => setPhoto(e.target.value)}
          placeholder="Fotoğraf URL'si (isteğe bağlı)"
          style={{
            width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12, padding: '10px 14px', color: 'var(--text-main, #f8fafc)', fontSize: 13,
            outline: 'none', marginTop: 10, boxSizing: 'border-box', fontFamily: 'inherit',
          }}
        />

        {/* City + Venue */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
          <input
            value={city}
            onChange={e => setCity(e.target.value)}
            placeholder="📍 Şehir"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 12px', color: 'var(--text-main, #f8fafc)', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
          />
          <input
            value={venue}
            onChange={e => setVenue(e.target.value)}
            placeholder="🏪 Mekan"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 12px', color: 'var(--text-main, #f8fafc)', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
          />
        </div>

        {/* Tags */}
        <input
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="#etiketler, virgülle ayır"
          style={{
            width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12, padding: '10px 14px', color: 'var(--text-main, #f8fafc)', fontSize: 13,
            outline: 'none', marginTop: 10, boxSizing: 'border-box', fontFamily: 'inherit',
          }}
        />

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handlePost}
          disabled={loading || !text.trim()}
          style={{
            width: '100%', marginTop: 16,
            background: !text.trim() ? 'rgba(245,158,11,0.2)' : 'linear-gradient(135deg,#f59e0b,#d97706)',
            border: 'none', borderRadius: 16, padding: '15px',
            color: '#fff', fontWeight: 900, fontSize: 16, cursor: text.trim() ? 'pointer' : 'not-allowed',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? '⏳ Paylaşılıyor...' : '🚀 Paylaş'}
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

// ─── LiveChat ────────────────────────────────────────────────────────────────
function LiveChat({ onSelectMember }: { onSelectMember: (m: SocialMember) => void }) {
  const [messages, setMessages] = useState<SupaPost[]>([])
  const [inputText, setInputText] = useState('')
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null)
  const [showPhotoPicker, setShowPhotoPicker] = useState(false)
  const [replyingTo, setReplyingTo] = useState<SupaPost | null>(null)
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const myName = getUsername()
  const myEmoji = getUserEmoji()

  const fetchMsgs = useCallback(async () => {
    const data = await getMessages()
    if (data && data.length > 0) {
      setMessages(data)
    }
  }, [])

  useEffect(() => {
    fetchMsgs()
    const id = setInterval(fetchMsgs, 5000)
    return () => clearInterval(id)
  }, [fetchMsgs])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const handleSend = async () => {
    if ((!inputText.trim() && !attachedPhoto) || loading) return
    haptic('medium')
    setLoading(true)

    let finalMsg = inputText.trim()
    if (replyingTo) {
      finalMsg = `💬 Replying to @${replyingTo.author_name}:\n"${replyingTo.text.slice(0, 45)}..."\n\n${finalMsg}`
    }

    const opt: SupaPost = {
      id: 'local-' + Date.now(),
      type: 'chat',
      author_name: myName,
      author_emoji: myEmoji,
      author_username: tgUser()?.username ? `@${tgUser()?.username}` : undefined,
      text: finalMsg,
      photo: attachedPhoto || undefined,
      tags: [],
      created_at: new Date().toISOString()
    }

    setMessages(m => [...m, opt])
    setInputText('')
    setAttachedPhoto(null)
    setReplyingTo(null)
    setShowPhotoPicker(false)

    try {
      await insertPost({
        type: 'chat',
        author_name: myName,
        author_emoji: myEmoji,
        author_username: tgUser()?.username,
        text: finalMsg,
        photo: attachedPhoto || undefined,
        tags: []
      })
    } catch { /* ignore */ }

    setLoading(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 290px)', minHeight: 420 }}>
      {/* Stream */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '10px 6px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        background: 'rgba(0,0,0,0.15)',
        borderRadius: 18,
        border: '1px solid rgba(255,255,255,0.04)',
        marginBottom: 10,
      }}>
        {messages.map((msg, idx) => {
          const isMe = msg.author_name === myName
          return (
            <motion.div
              key={msg.id || idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                flexDirection: isMe ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
                gap: 8,
              }}
            >
              <div
                onClick={() => {
                  haptic('light')
                  onSelectMember({
                    id: msg.author_name,
                    name: msg.author_name,
                    username: msg.author_username,
                    emoji: msg.author_emoji || '👤',
                    status: 'online',
                    statusText: 'Sohbette mesaj gönderdi 💬',
                    role: 'Topluluk Üyesi',
                    badgeColor: '#f59e0b',
                    tastePoints: 850,
                    tasteId: getTasteId(msg.author_name),
                    bio: 'TASTE MiniApp Canlı Sohbet Katılımcısı.'
                  })
                }}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: '50%',
                  background: isMe ? 'rgba(245,158,11,0.2)' : 'rgba(59,130,246,0.15)',
                  border: `1px solid ${isMe ? '#f59e0b' : '#3b82f6'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 16,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                {msg.author_emoji || '👤'}
              </div>

              <div style={{ maxWidth: '78%' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 2,
                  flexDirection: isMe ? 'row-reverse' : 'row'
                }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: isMe ? '#f59e0b' : '#93c5fd' }}>
                    {msg.author_name}
                  </span>
                  {msg.author_username && (
                    <span style={{ fontSize: 10, color: '#64748b' }}>
                      {msg.author_username}
                    </span>
                  )}
                  <span style={{ fontSize: 9, color: '#475569' }}>
                    {timeAgo(msg.created_at)}
                  </span>
                </div>

                <div style={{
                  background: isMe 
                    ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                    : 'rgba(255,255,255,0.08)',
                  border: isMe ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  color: isMe ? '#fff' : '#f1f5f9',
                  borderRadius: isMe ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                  padding: '10px 14px',
                  fontSize: 13,
                  lineHeight: 1.5,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
                  wordBreak: 'break-word',
                }}>
                  {msg.photo && (
                    <div style={{ marginBottom: 8, borderRadius: 12, overflow: 'hidden', maxHeight: 180 }}>
                      <img src={msg.photo} alt="Food" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}

                  <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                </div>

                <div style={{ display: 'flex', gap: 6, marginTop: 3, justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                  <button
                    onClick={() => {
                      haptic('light')
                      setReplyingTo(msg)
                    }}
                    style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: 10, cursor: 'pointer', padding: 0, fontWeight: 600 }}
                  >
                    💬 Yanıtla
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {replyingTo && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(245,158,11,0.12)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 12,
          padding: '6px 12px',
          marginBottom: 6,
          fontSize: 11,
          color: '#f59e0b',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <CornerDownRight size={13} />
            <span><strong>@{replyingTo.author_name}</strong> kullanıcısına yanıt veriyorsunuz</span>
          </div>
          <button onClick={() => setReplyingTo(null)} style={{ background: 'none', border: 'none', color: '#f59e0b', cursor: 'pointer', fontWeight: 800 }}>×</button>
        </div>
      )}

      {attachedPhoto && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(0,0,0,0.3)',
          padding: '6px 10px',
          borderRadius: 12,
          marginBottom: 6,
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <img src={attachedPhoto} alt="Attach" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
          <span style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>📸 Yemek fotoğrafı eklendi</span>
          <button onClick={() => setAttachedPhoto(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#ef4444', fontSize: 14, cursor: 'pointer' }}>×</button>
        </div>
      )}

      {showPhotoPicker && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          style={{
            background: 'rgba(15,23,42,0.95)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 16,
            padding: '10px',
            marginBottom: 8,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 800, color: '#f59e0b', marginBottom: 6 }}>
            📸 Hızlı Yemek Fotoğrafı Seç:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {QUICK_PHOTOS.map(qp => (
              <button
                key={qp.label}
                onClick={() => {
                  haptic('light')
                  setAttachedPhoto(qp.url)
                  setShowPhotoPicker(false)
                }}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10,
                  padding: 4,
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                <img src={qp.url} alt={qp.label} style={{ width: '100%', height: 44, objectFit: 'cover', borderRadius: 6 }} />
                <div style={{ fontSize: 9, color: '#cbd5e1', marginTop: 2 }}>{qp.label}</div>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Input */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <button
          onClick={() => {
            haptic('light')
            setShowPhotoPicker(p => !p)
          }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: showPhotoPicker ? '#f59e0b' : 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: showPhotoPicker ? '#000' : '#f59e0b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          <ImageIcon size={18} />
        </button>

        <input
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Yemek, tarif veya DeFi hakkında yaz..."
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 16,
            padding: '12px 14px',
            color: '#fff',
            fontSize: 13,
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />

        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={handleSend}
          disabled={loading || (!inputText.trim() && !attachedPhoto)}
          style={{
            width: 44,
            height: 44,
            borderRadius: 14,
            background: (inputText.trim() || attachedPhoto)
              ? 'linear-gradient(135deg, #f59e0b, #d97706)'
              : 'rgba(255,255,255,0.05)',
            border: 'none',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: (inputText.trim() || attachedPhoto) ? 'pointer' : 'not-allowed',
            flexShrink: 0,
            boxShadow: (inputText.trim() || attachedPhoto) ? '0 4px 14px rgba(245,158,11,0.4)' : 'none',
          }}
        >
          <Send size={18} />
        </motion.button>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export function TasteSocial() {
  const [activeTab, setActiveTab] = useState<'chat' | 'members' | 'feed'>('chat')
  const [filter, setFilter] = useState<'kesfet' | 'tarif' | 'yemek' | 'restoran'>('kesfet')
  const [posts, setPosts] = useState<(SupaPost & { liked?: boolean })[]>([])
  const [members, setMembers] = useState<SocialMember[]>(SEED_MEMBERS)
  const [selectedMember, setSelectedMember] = useState<SocialMember | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCreator, setShowCreator] = useState(false)
  const [onlineCount, setOnlineCount] = useState(19)

  const myName = getUsername()
  const myEmoji = getUserEmoji()
  const myTasteId = getTasteId(myName, tgUser()?.id)

  const syncPresence = useCallback(async () => {
    await sendHeartbeat(myName, myEmoji, tgUser()?.username, 'Sohbette aktif 🍽️')
    const profiles = await getProfiles()
    if (profiles && profiles.length > 0) {
      const liveList: SocialMember[] = profiles.map(p => {
        const isOnline = Date.now() - new Date(p.updated_at || 0).getTime() < 5 * 60 * 1000
        return {
          id: p.id,
          name: p.user_name || 'Kullanıcı',
          username: p.user_username,
          emoji: p.user_emoji || '👤',
          status: isOnline ? 'online' : 'recent',
          statusText: p.bio || (isOnline ? 'Çevrimiçi' : 'Yakın zamanda aktifti'),
          role: p.profession || 'TASTE Üyesi',
          badgeColor: isOnline ? '#10b981' : '#64748b',
          tastePoints: p.taste_points || 500,
          tasteId: getTasteId(p.user_name),
          lastSeen: p.updated_at,
          bio: p.bio || 'TASTE topluluk üyesi.'
        }
      })

      const merged = [...SEED_MEMBERS]
      liveList.forEach(lp => {
        if (!merged.some(m => m.name === lp.name)) {
          merged.unshift(lp)
        }
      })
      setMembers(merged)
      const count = merged.filter(m => m.status === 'online').length + 12
      setOnlineCount(count)
    }
  }, [myName, myEmoji])

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    const data = await getPosts()
    const fallbackList: SupaPost[] = [
      { id: 's1', type: 'yemek', author_name: 'Chef Kerem Usta', author_emoji: '👨‍🍳', author_username: '@chefkerem', created_at: new Date(Date.now() - 3600000).toISOString(), text: 'Bugün özel bir kuzu tandır hazırladım! 🔥 Saatlerce pişirdim, sonuç inanılmaz oldu.', tags: ['tandır','kuzu','ankara'], city: 'Ankara', likes: 64, photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80' },
      { id: 's2', type: 'tarif', author_name: 'Zeynep Kaya', author_emoji: '🍰', author_username: '@zeynep_bakes', created_at: new Date(Date.now() - 7200000).toISOString(), text: 'Akışkan Belçika Çikolatalı Sufle 🍫\n\n100g bitter çikolata\n50g tereyağı\n2 yumurta\n2 yemek kaşığı un\n\n200°C fırında tam 8 dakika pişirin!', tags: ['sufle','çikolata','tatlı'], city: 'İzmir', likes: 112, photo: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80' },
      { id: 's3', type: 'menu', author_name: 'Selin Akın (Gurme)', author_emoji: '👩‍🍳', author_username: '@selin_gurme', created_at: new Date(Date.now() - 10800000).toISOString(), text: 'Beşiktaş\'ta keşfettiğim harika bir balık restoran! Mezeler muhteşem, deniz ürünleri taze 💯 TASTE Pay kabul ediliyor!', tags: ['istanbul','balık','restoran'], city: 'İstanbul', venue_name: 'Marina Balıkçısı', likes: 98, photo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80' }
    ]
    const merged: SupaPost[] = data.length > 0 ? data : fallbackList
    setPosts(merged.map(p => ({ ...p, liked: false })))
    setLoading(false)
  }, [])

  useEffect(() => { 
    fetchPosts()
    syncPresence()
    const t = setInterval(syncPresence, 7000)
    return () => clearInterval(t)
  }, [fetchPosts, syncPresence])

  const handleLike = (id: string) => {
    haptic('success')
    setPosts(prev => prev.map(p => {
      if (p.id !== id) return p
      const nowLiked = !p.liked
      const newLikes = (p.likes || 0) + (nowLiked ? 1 : -1)
      if (nowLiked) updatePostLikes(id, newLikes)
      return { ...p, liked: nowLiked, likes: newLikes }
    }))
  }

  const handleNewPost = (p: SupaPost) => {
    setPosts(prev => [{ ...p, liked: false }, ...prev])
  }

  const filterOptions: { key: 'kesfet' | 'tarif' | 'yemek' | 'restoran'; emoji: string; label: string }[] = [
    { key: 'kesfet',  emoji: '🔥', label: 'Keşfet' },
    { key: 'yemek',   emoji: '🍽️', label: 'Yemek' },
    { key: 'tarif',   emoji: '📝', label: 'Tarif' },
    { key: 'restoran',emoji: '🏪', label: 'Restoran' },
  ]

  const filteredPosts = filter === 'kesfet' ? posts
    : filter === 'restoran' ? posts.filter(p => p.type === 'menu')
    : posts.filter(p => p.type === filter)

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* Top Community Live Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(16,185,129,0.08))',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 20,
          padding: '14px 18px',
          marginBottom: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(245,158,11,0.2)', border: '2px solid #f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                {myEmoji}
              </div>
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: '50%', background: '#10b981', border: '2px solid #0f172a' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 15, fontWeight: 900, color: '#f8fafc' }}>{myName}</span>
                <span style={{ fontSize: 10, background: 'rgba(245,158,11,0.2)', color: '#f59e0b', padding: '1px 6px', borderRadius: 6, fontWeight: 800 }}>{myTasteId}</span>
              </div>
              <div style={{ fontSize: 11, color: '#10b981', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
                {onlineCount} Kişi Çevrimiçi · Canlı Topluluk
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              haptic('light')
              setSelectedMember({
                id: 'my-profile',
                name: myName,
                username: tgUser()?.username ? `@${tgUser()?.username}` : undefined,
                emoji: myEmoji,
                status: 'online',
                statusText: 'Sohbette aktif 🍽️',
                role: '👑 TAI Gurme Üye',
                badgeColor: '#f59e0b',
                tastePoints: 1250,
                tasteId: myTasteId,
                bio: 'TASTE MiniApp Resmi Topluluk Kullanıcısı.'
              })
            }}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 12,
              padding: '6px 12px',
              color: '#f8fafc',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5
            }}
          >
            <Shield size={13} color="#f59e0b" />
            Kimliğim
          </button>
        </div>
      </motion.div>

      {/* 3 Main Navigation Tabs */}
      <div style={{ display: 'flex', gap: 6, background: 'rgba(0,0,0,0.3)', padding: 4, borderRadius: 16, marginBottom: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
        {[
          { id: 'chat', label: 'Canlı Sohbet', icon: MessageCircle, badge: 'Aktif' },
          { id: 'members', label: 'Çevrimiçi Üyeler', icon: Users, badge: `${onlineCount}` },
          { id: 'feed', label: 'Yemek Akışı', icon: Flame, badge: `${posts.length}` },
        ].map(tab => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => { haptic('light'); setActiveTab(tab.id as any); }}
              style={{
                flex: 1,
                padding: '10px 4px',
                borderRadius: 12,
                background: isActive ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                border: 'none',
                color: isActive ? '#fff' : '#94a3b8',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                transition: 'all 0.2s',
                boxShadow: isActive ? '0 4px 12px rgba(245,158,11,0.35)' : 'none',
              }}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              <span style={{
                fontSize: 10,
                background: isActive ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.1)',
                padding: '1px 5px',
                borderRadius: 8,
                fontWeight: 900
              }}>
                {tab.badge}
              </span>
            </button>
          )
        })}
      </div>

      {/* TAB 1: CHAT */}
      {activeTab === 'chat' && (
        <LiveChat onSelectMember={setSelectedMember} />
      )}

      {/* TAB 2: MEMBERS & PRESENCE */}
      {activeTab === 'members' && (
        <div>
          <div style={{
            background: 'rgba(0,0,0,0.2)',
            padding: '12px 16px',
            borderRadius: 16,
            marginBottom: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid rgba(255,255,255,0.05)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
              <span style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc' }}>
                🟢 {onlineCount} Çevrimiçi Üye
              </span>
            </div>
            <span style={{ fontSize: 11, color: '#64748b' }}>
              Toplam {members.length + 120} Gurme
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {members.map((member, idx) => {
              const isOnline = member.status === 'online'
              return (
                <motion.div
                  key={member.id || idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => {
                    haptic('light')
                    setSelectedMember(member)
                  }}
                  style={{
                    background: 'var(--bg-card, rgba(255,255,255,0.04))',
                    border: isOnline 
                      ? '1px solid rgba(16,185,129,0.3)' 
                      : '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 16,
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${member.badgeColor}22, rgba(0,0,0,0.3))`,
                        border: `2px solid ${member.badgeColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                      }}>
                        {member.emoji}
                      </div>
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: isOnline ? '#10b981' : '#64748b',
                        border: '2px solid #0f172a',
                        boxShadow: isOnline ? '0 0 6px #10b981' : 'none'
                      }} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 900, color: '#f8fafc' }}>{member.name}</span>
                        <span style={{ fontSize: 9, background: `${member.badgeColor}22`, color: member.badgeColor, padding: '1px 5px', borderRadius: 4, fontWeight: 800 }}>
                          {member.role}
                        </span>
                      </div>
                      <div style={{ fontSize: 11, color: isOnline ? '#10b981' : '#64748b', marginTop: 2 }}>
                        {member.statusText}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 10, color: '#f59e0b', fontWeight: 800 }}>{member.tasteId}</div>
                    <div style={{ fontSize: 10, color: '#64748b' }}>{member.tastePoints} TAI</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 3: FEED */}
      {activeTab === 'feed' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4 }}>
              {filterOptions.map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  style={{
                    flexShrink: 0, padding: '7px 14px', borderRadius: 20,
                    background: filter === f.key ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'rgba(255,255,255,0.05)',
                    border: filter === f.key ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    cursor: 'pointer', fontWeight: 700, fontSize: 12,
                    color: filter === f.key ? '#fff' : '#94a3b8',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {f.emoji} {f.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCreator(true)}
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                border: 'none',
                borderRadius: 12,
                padding: '8px 12px',
                color: '#fff',
                fontWeight: 800,
                fontSize: 12,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                flexShrink: 0
              }}
            >
              <Plus size={14} /> Paylaş
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
              <div style={{ color: '#64748b' }}>Gönderiler yükleniyor...</div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60 }}>
              <div style={{ fontSize: 44, marginBottom: 12 }}>🍽️</div>
              <div style={{ color: '#64748b', fontSize: 15, marginBottom: 8 }}>Henüz gönderi yok</div>
              <div style={{ color: '#475569', fontSize: 13 }}>İlk paylaşımı sen yap!</div>
            </div>
          ) : (
            <AnimatePresence>
              {filteredPosts.map(post => (
                <PostCard key={post.id} post={post} onLike={handleLike} />
              ))}
            </AnimatePresence>
          )}
        </>
      )}

      {/* Profile Modal */}
      <AnimatePresence>
        {selectedMember && (
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
            onClick={() => setSelectedMember(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: 380,
                background: 'linear-gradient(135deg, #1e293b, #0f172a)',
                border: '2px solid rgba(245,158,11,0.5)',
                borderRadius: 24,
                padding: '24px 20px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
                position: 'relative',
              }}
            >
              <button
                onClick={() => setSelectedMember(null)}
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
                <div style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'rgba(245,158,11,0.2)',
                  border: `3px solid ${selectedMember.badgeColor || '#f59e0b'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 34,
                  margin: '0 auto 10px',
                }}>
                  {selectedMember.emoji}
                </div>
                <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 900, color: '#f8fafc' }}>
                  {selectedMember.name}
                </h3>
                {selectedMember.username && (
                  <div style={{ fontSize: 12, color: '#60a5fa', marginBottom: 6 }}>
                    {selectedMember.username}
                  </div>
                )}
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: `${selectedMember.badgeColor}22`, border: `1px solid ${selectedMember.badgeColor}55`, borderRadius: 12, padding: '3px 10px' }}>
                  <Award size={12} color={selectedMember.badgeColor} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: selectedMember.badgeColor }}>
                    {selectedMember.role}
                  </span>
                </div>
              </div>

              <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 16, padding: '14px', marginBottom: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
                  <span style={{ color: '#64748b' }}>Kullanıcı Kimliği</span>
                  <span style={{ fontWeight: 800, color: '#f59e0b', fontFamily: 'monospace' }}>{selectedMember.tasteId}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 12 }}>
                  <span style={{ color: '#64748b' }}>Durum</span>
                  <span style={{ fontWeight: 700, color: selectedMember.status === 'online' ? '#10b981' : '#94a3b8' }}>
                    {selectedMember.status === 'online' ? '🟢 Çevrimiçi' : '⚪ İnaktif'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#64748b' }}>TAI Puanı</span>
                  <span style={{ fontWeight: 800, color: '#10b981' }}>{selectedMember.tastePoints} TAI</span>
                </div>
              </div>

              <div style={{ fontSize: 12, color: '#cbd5e1', lineHeight: 1.5, textAlign: 'center', marginBottom: 18 }}>
                "{selectedMember.bio}"
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                {selectedMember.username && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      haptic('light')
                      const url = `https://t.me/${selectedMember.username?.replace('@', '')}`
                      if (tg()) tg()?.openTelegramLink(url)
                      else window.open(url, '_blank')
                    }}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                      border: 'none',
                      borderRadius: 12,
                      padding: '10px',
                      color: '#fff',
                      fontSize: 12,
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6
                    }}
                  >
                    <ExternalLink size={13} />
                    Telegram'da Yaz
                  </motion.button>
                )}

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    haptic('light')
                    setActiveTab('chat')
                    setSelectedMember(null)
                  }}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    border: 'none',
                    borderRadius: 12,
                    padding: '10px',
                    color: '#fff',
                    fontSize: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  <MessageCircle size={13} />
                  Sohbete Git
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Creator Modal */}
      <AnimatePresence>
        {showCreator && (
          <PostCreator
            onClose={() => setShowCreator(false)}
            onPost={handleNewPost}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
