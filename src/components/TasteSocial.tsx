import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getPosts, insertPost, getMessages, sendMessage, updatePostLikes } from '../services/supabase'
import type { SupaPost } from '../services/supabase'

// ─── Helpers ─────────────────────────────────────────────────────────────────
const tg = () => window.Telegram?.WebApp
const tgUser = () => tg()?.initDataUnsafe?.user
const getUsername = () => {
  const u = tgUser()
  if (u?.username) return '@' + u.username
  if (u?.first_name) return u.first_name + (u.last_name ? ' ' + u.last_name : '')
  return 'Misafir'
}
const getUserEmoji = () => {
  const emojis = ['😊','🍕','👨‍🍳','🍜','🥗','🍔','🌮','🍣','🥘','🍱']
  const id = tgUser()?.id || 0
  return emojis[id % emojis.length]
}
const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'Az önce'
  if (m < 60) return `${m}dk önce`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}sa önce`
  return `${Math.floor(h / 24)}g önce`
}

// ─── Fake seed posts ──────────────────────────────────────────────────────────
const SEED_POSTS: SupaPost[] = [
  { id: 's1', type: 'yemek', author_name: 'Ahmet Usta', author_emoji: '👨‍🍳', author_username: '@ahmetusta', created_at: new Date(Date.now() - 3600000).toISOString(), text: 'Bugün özel bir kuzu tandır hazırladım! 🔥 Saatlerce pişirdim, sonuç inanılmaz oldu.', tags: ['tandır','kuzu','ankara'], city: 'Ankara', likes: 47, photo: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80' },
  { id: 's2', type: 'tarif', author_name: 'Ayşe Chef', author_emoji: '👩‍🍳', author_username: '@aysechef', created_at: new Date(Date.now() - 7200000).toISOString(), text: 'Ev yapımı mercimek çorbası tarifi 🥣\n\n1 su bardağı kırmızı mercimek\n1 soğan\n2 yemek kaşığı tereyağı\nTuz, karabiber, kekik ile servis edin!', tags: ['tarif','mercimek','çorba'], city: 'İstanbul', likes: 89, photo: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=80' },
  { id: 's3', type: 'menu', author_name: 'Foodie Kemal', author_emoji: '🍕', author_username: '@foodiekemal', created_at: new Date(Date.now() - 10800000).toISOString(), text: 'Beşiktaş\'ta keşfettiğim harika bir balık restoran! Mezeler muhteşem, deniz ürünleri taze. Kesinlikle tavsiye ederim 💯', tags: ['istanbul','balık','restoran'], city: 'İstanbul', venue_name: 'Deniz Restaurant', likes: 124, photo: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80' },
  { id: 's4', type: 'yemek', author_name: 'Gurme Sara', author_emoji: '🥗', author_username: '@gurmesara', created_at: new Date(Date.now() - 18000000).toISOString(), text: 'Akdeniz mutfağının en güzel tarafı bu renkler! Bugünkü tabağım gerçekten sanatsaldi 🎨', tags: ['akdeniz','sağlıklı','salata'], city: 'İzmir', likes: 62, photo: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80' },
  { id: 's5', type: 'tarif', author_name: 'Pastacı Ali', author_emoji: '🎂', author_username: '@pastaci_ali', created_at: new Date(Date.now() - 86400000).toISOString(), text: 'Çikolatalı sufle tarifi geldi sonunda! Dışı çıtır içi akışkan 🍫 Bu tarifi denemeden geçmeyin!', tags: ['sufle','çikolata','tatlı'], city: 'Bursa', likes: 203, photo: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&q=80' },
]

type Tab = 'feed' | 'chat'
type FeedFilter = 'kesfet' | 'tarif' | 'yemek' | 'restoran'

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
function LiveChat() {
  const [messages, setMessages] = useState<SupaPost[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)

  const fetchMsgs = useCallback(async () => {
    const data = await getMessages()
    setMessages(data)
    setFetching(false)
  }, [])

  useEffect(() => {
    fetchMsgs()
    const id = setInterval(fetchMsgs, 8000)
    return () => clearInterval(id)
  }, [fetchMsgs])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const handleSend = async () => {
    if (!text.trim() || loading) return
    const name = getUsername()
    const emoji = getUserEmoji()
    const username = tgUser()?.username
    setText('')
    setLoading(true)
    // Optimistic add
    const opt: SupaPost = { id: Date.now().toString(), type: 'chat', author_name: name, author_emoji: emoji, author_username: username ? '@' + username : undefined, text: text.trim(), tags: [], created_at: new Date().toISOString() }
    setMessages(m => [...m, opt])
    await sendMessage(name, emoji, text.trim(), username)
    setLoading(false)
  }

  const chatColors = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#06b6d4']
  const colorFor = (name: string) => chatColors[name.charCodeAt(0) % chatColors.length]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 280px)', minHeight: 300 }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 4px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {fetching ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>⏳ Mesajlar yükleniyor...</div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
            <div style={{ color: '#64748b', fontSize: 14 }}>İlk mesajı gönder!</div>
          </div>
        ) : messages.map(msg => {
          const isMe = msg.author_name === getUsername()
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                display: 'flex',
                flexDirection: isMe ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: 8,
                padding: '2px 0',
              }}
            >
              {!isMe && (
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: `${colorFor(msg.author_name)}22`, border: `1px solid ${colorFor(msg.author_name)}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, flexShrink: 0 }}>
                  {msg.author_emoji}
                </div>
              )}
              <div style={{ maxWidth: '75%' }}>
                {!isMe && (
                  <div style={{ fontSize: 10, color: colorFor(msg.author_name), fontWeight: 700, marginBottom: 2, paddingLeft: 4 }}>
                    {msg.author_name}
                  </div>
                )}
                <div style={{
                  background: isMe ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'rgba(255,255,255,0.07)',
                  border: isMe ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  padding: '8px 12px',
                  fontSize: 13, lineHeight: 1.5,
                  color: isMe ? '#fff' : 'var(--text-main, #e2e8f0)',
                  wordBreak: 'break-word',
                }}>
                  {msg.text}
                </div>
                <div style={{ fontSize: 10, color: '#475569', marginTop: 2, textAlign: isMe ? 'right' : 'left', paddingLeft: 4, paddingRight: 4 }}>
                  {timeAgo(msg.created_at)}
                </div>
              </div>
            </motion.div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: 8, padding: '10px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Bir şeyler yaz... 🍽️"
          style={{
            flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 20, padding: '10px 16px', color: 'var(--text-main, #f8fafc)',
            fontSize: 14, outline: 'none', fontFamily: 'inherit',
          }}
        />
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleSend}
          disabled={!text.trim() || loading}
          style={{
            width: 42, height: 42, borderRadius: '50%',
            background: text.trim() ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'rgba(255,255,255,0.05)',
            border: 'none', cursor: text.trim() ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
          }}
        >
          ➤
        </motion.button>
      </div>
    </div>
  )
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export function TasteSocial() {
  const [tab, setTab] = useState<Tab>('feed')
  const [filter, setFilter] = useState<FeedFilter>('kesfet')
  const [posts, setPosts] = useState<(SupaPost & { liked?: boolean })[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreator, setShowCreator] = useState(false)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    const data = await getPosts()
    // Merge with seeds if DB is empty
    const merged = data.length > 0 ? data : SEED_POSTS
    setPosts(merged.map(p => ({ ...p, liked: false })))
    setLoading(false)
  }, [])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const handleLike = (id: string) => {
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

  const filterOptions: { key: FeedFilter; emoji: string; label: string }[] = [
    { key: 'kesfet',  emoji: '🔥', label: 'Keşfet' },
    { key: 'yemek',   emoji: '🍽️', label: 'Yemek' },
    { key: 'tarif',   emoji: '📝', label: 'Tarif' },
    { key: 'restoran',emoji: '🏪', label: 'Restoran' },
  ]

  const filteredPosts = filter === 'kesfet' ? posts
    : filter === 'restoran' ? posts.filter(p => p.type === 'menu')
    : posts.filter(p => p.type === filter)

  return (
    <div style={{ paddingBottom: 20 }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,rgba(245,158,11,0.3),rgba(245,158,11,0.1))', border: '1px solid rgba(245,158,11,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
            🍔
          </div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 19 }}>TASTE Social</div>
            <div style={{ fontSize: 11, color: '#64748b' }}>Yemek Sosyal Medyası</div>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowCreator(true)}
          style={{
            background: 'linear-gradient(135deg,#f59e0b,#d97706)',
            border: 'none', borderRadius: 14, padding: '10px 16px',
            color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 4px 14px rgba(245,158,11,0.4)',
          }}
        >
          + Paylaş
        </motion.button>
      </div>

      {/* ── Tab Bar ── */}
      <div style={{ display: 'flex', gap: 0, background: 'rgba(255,255,255,0.04)', borderRadius: 14, padding: 4, marginBottom: 20 }}>
        {([['feed','📸 Feed'],['chat','💬 Sohbet']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              flex: 1, padding: '9px', borderRadius: 11,
              background: tab === key ? 'linear-gradient(135deg,#f59e0b,#d97706)' : 'transparent',
              border: 'none', cursor: 'pointer',
              color: tab === key ? '#fff' : '#64748b',
              fontWeight: 700, fontSize: 13, transition: 'all 0.2s',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── FEED TAB ── */}
      {tab === 'feed' && (
        <>
          {/* Filter pills */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 16 }}>
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

          {/* Posts */}
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

          {/* Empty state CTA */}
          {!loading && (
            <motion.div
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowCreator(true)}
              style={{
                background: 'linear-gradient(135deg,rgba(245,158,11,0.08),rgba(245,158,11,0.03))',
                border: '1px dashed rgba(245,158,11,0.3)',
                borderRadius: 20, padding: 20,
                textAlign: 'center', cursor: 'pointer', marginTop: 8,
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 6 }}>📸</div>
              <div style={{ fontWeight: 700, color: '#f59e0b', marginBottom: 4 }}>Yemek fotoğrafın var mı?</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Paylaş, topluluğunla keşfet!</div>
            </motion.div>
          )}
        </>
      )}

      {/* ── CHAT TAB ── */}
      {tab === 'chat' && (
        <LiveChat />
      )}

      {/* ── Post Creator Modal ── */}
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
