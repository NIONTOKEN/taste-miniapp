import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getPosts, insertPost, type SupaPost } from '../services/supabase'

// ─── Types ────────────────────────────────────────────────────────────────
type PostType = 'yemek' | 'tarif' | 'menu'
type FilterType = 'hepsi' | PostType

interface Ingredient { name: string; amount: string }

interface Post {
    id: string
    type: PostType
    authorName: string
    authorEmoji: string
    createdAt: number
    text: string
    photo?: string
    tags: string[]
    recipeTitle?: string
    ingredients?: Ingredient[]
    steps?: string[]
    venueName?: string
}

// ─── Supabase mapper ──────────────────────────────────────────────────────
function mapPost(sp: SupaPost): Post {
    return {
        id: sp.id,
        type: sp.type,
        authorName: sp.author_name,
        authorEmoji: sp.author_emoji,
        createdAt: new Date(sp.created_at).getTime(),
        text: sp.text,
        photo: sp.photo,
        tags: sp.tags || [],
        recipeTitle: sp.recipe_title,
        ingredients: sp.ingredients,
        steps: sp.steps,
        venueName: sp.venue_name,
    }
}

// ─── Demo posts (shown when DB is empty) ─────────────────────────────────
const DEMO_POSTS: Post[] = [
    {
        id: 'demo1', type: 'tarif', authorName: 'Chef Ayşe', authorEmoji: '👩‍🍳',
        createdAt: Date.now() - 7200000,
        text: 'Annemin mercimek çorbası tarifi — 30 yıllık lezzet 🍲',
        tags: ['Çorba', 'Yöresel'],
        recipeTitle: 'Mercimek Çorbası',
        ingredients: [
            { name: 'Kırmızı mercimek', amount: '2 su bardağı' },
            { name: 'Soğan', amount: '1 büyük' },
            { name: 'Havuç', amount: '1 adet' },
            { name: 'Tereyağı', amount: '2 yemek kaşığı' },
        ],
        steps: [
            'Mercimekleri yıkayıp 4 su bardağı su ile haşlayın.',
            'Soğan ve havucu kavurun, mercimekle birleştirin.',
            'Blenderdan geçirin, tereyağlı biber ile servis edin.',
        ]
    },
    {
        id: 'demo2', type: 'yemek', authorName: 'Mutfak_Ustası', authorEmoji: '👨‍🍳',
        createdAt: Date.now() - 18000000,
        text: 'Bugün akşam sofrasına kuzulu güveç yaptım, afiyet olsun! 🫕',
        tags: ['Akşam Yemeği', 'Et Yemekleri'],
    },
    {
        id: 'demo3', type: 'menu', authorName: 'FoodTaster42', authorEmoji: '🍴',
        createdAt: Date.now() - 36000000,
        text: 'Bu hafta denediğim kahvaltı mekanı — kesinlikle tavsiye ederim!',
        tags: ['Kahvaltı', 'Mekan'], venueName: 'Ege Köy Kahvaltısı',
    },
]

// ─── Helpers ──────────────────────────────────────────────────────────────
function timeAgo(ts: number) {
    const diff = Date.now() - ts
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'az önce'
    if (mins < 60) return `${mins} dk önce`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs} sa önce`
    return `${Math.floor(hrs / 24)} gün önce`
}

async function resizeImage(file: File): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const img = new Image()
            img.onload = () => {
                const canvas = document.createElement('canvas')
                const max = 400
                const scale = Math.min(max / img.width, max / img.height, 1)
                canvas.width = img.width * scale
                canvas.height = img.height * scale
                canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
                resolve(canvas.toDataURL('image/jpeg', 0.55))
            }
            img.src = e.target?.result as string
        }
        reader.readAsDataURL(file)
    })
}

const TYPE_META: Record<PostType, { label: string; emoji: string; color: string }> = {
    yemek: { label: 'Yemek', emoji: '🍽️', color: '#f97316' },
    tarif: { label: 'Tarif', emoji: '📖', color: '#22c55e' },
    menu: { label: 'Menü', emoji: '🏪', color: '#818cf8' },
}

const TAGS_BY_TYPE: Record<PostType, string[]> = {
    yemek: ['Kahvaltı', 'Öğle', 'Akşam', 'Atıştırmalık', 'Tatlı'],
    tarif: ['Çorba', 'Et Yemekleri', 'Sebze', 'Tatlı', 'Yöresel', 'Pratik'],
    menu: ['Kahvaltı', 'Öğle', 'Akşam', 'Kafe', 'Fast Food', 'Fine Dining'],
}

function getTgUser() {
    const u = window.Telegram?.WebApp?.initDataUnsafe?.user
    const emojis = ['🧑‍🍳', '👩‍🍳', '👨‍🍳', '🍴', '🥘', '🫕', '🍳', '🥗', '🍜']
    return {
        name: u ? u.first_name : 'Misafir',
        emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }
}

// ─── Post Card ────────────────────────────────────────────────────────────
function PostCard({ post, onClick }: { post: Post; onClick: () => void }) {
    const meta = TYPE_META[post.type]
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.98 }} onClick={onClick}
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', overflow: 'hidden', cursor: 'pointer', marginBottom: '12px' }}
        >
            {post.photo && <img src={post.photo} alt="" style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />}
            <div style={{ padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${meta.color}20`, border: `1px solid ${meta.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                        {post.authorEmoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: '#fff' }}>{post.authorName}</div>
                        <div style={{ fontSize: '10px', color: '#64748b' }}>{timeAgo(post.createdAt)}</div>
                    </div>
                    <div style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}30`, color: meta.color, borderRadius: '20px', padding: '3px 10px', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>
                        {meta.emoji} {meta.label}
                    </div>
                </div>
                {post.recipeTitle && <div style={{ fontSize: '14px', fontWeight: 800, color: '#22c55e', marginBottom: '4px' }}>📖 {post.recipeTitle}</div>}
                {post.venueName && <div style={{ fontSize: '13px', fontWeight: 700, color: '#818cf8', marginBottom: '4px' }}>🏪 {post.venueName}</div>}
                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 10px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.text}
                </p>
                {post.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {post.tags.map(t => (
                            <span key={t} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2px 8px', fontSize: '10px', color: '#94a3b8' }}>#{t}</span>
                        ))}
                    </div>
                )}
                {post.ingredients && post.ingredients.length > 0 && (
                    <div style={{ marginTop: '10px', padding: '8px 12px', background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.1)', borderRadius: '10px', fontSize: '11px', color: '#4ade80' }}>
                        🥄 {post.ingredients.length} malzeme · {post.steps?.length || 0} adım
                    </div>
                )}
            </div>
        </motion.div>
    )
}

// ─── Main Component ────────────────────────────────────────────────────────
export function Community() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<FilterType>('hepsi')
    const [showCreate, setShowCreate] = useState(false)
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)

    const [cType, setCType] = useState<PostType>('yemek')
    const [cText, setCText] = useState('')
    const [cPhoto, setCPhoto] = useState<string | undefined>()
    const [cTags, setCTags] = useState<string[]>([])
    const [cRecipeTitle, setCRecipeTitle] = useState('')
    const [cIngredients, setCIngredients] = useState<Ingredient[]>([{ name: '', amount: '' }])
    const [cSteps, setCSteps] = useState<string[]>([''])
    const [cVenueName, setCVenueName] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        // 1. Önce önbellekten anında göster
        const cached = sessionStorage.getItem('taste_posts_cache')
        if (cached) {
            try { setPosts(JSON.parse(cached)); setLoading(false) } catch { /* ignore */ }
        }
        // 2. Arka planda güncel veriyi çek
        getPosts().then(data => {
            const mapped = data.map(mapPost)
            const result = mapped.length > 0 ? mapped : DEMO_POSTS
            setPosts(result)
            sessionStorage.setItem('taste_posts_cache', JSON.stringify(result))
        }).finally(() => setLoading(false))
    }, [])

    const filtered = posts.filter(p => filter === 'hepsi' || p.type === filter)

    async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setCPhoto(await resizeImage(file))
    }

    function toggleTag(tag: string) {
        setCTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
    }

    function resetForm() {
        setCType('yemek'); setCText(''); setCPhoto(undefined); setCTags([])
        setCRecipeTitle(''); setCIngredients([{ name: '', amount: '' }])
        setCSteps(['']); setCVenueName('')
    }

    async function handleSubmit() {
        if (!cText.trim()) return
        setSubmitting(true)
        const tg = getTgUser()
        const payload: Omit<SupaPost, 'id' | 'created_at'> = {
            type: cType,
            author_name: tg.name,
            author_emoji: tg.emoji,
            text: cText,
            photo: cPhoto,
            tags: cTags,
            ...(cType === 'tarif' && {
                recipe_title: cRecipeTitle || undefined,
                ingredients: cIngredients.filter(i => i.name),
                steps: cSteps.filter(s => s.trim())
            }),
            ...(cType === 'menu' && { venue_name: cVenueName || undefined })
        }
        const saved = await insertPost(payload)
        if (saved) setPosts(prev => [mapPost(saved), ...prev])
        resetForm()
        setSubmitting(false)
        setShowCreate(false)
    }

    function shareToTelegram(post: Post) {
        const meta = TYPE_META[post.type]
        const text = encodeURIComponent(
            `${meta.emoji} ${meta.label.toUpperCase()}\n\n` +
            (post.recipeTitle ? `📖 ${post.recipeTitle}\n` : '') +
            (post.venueName ? `🏪 ${post.venueName}\n` : '') +
            `${post.text}\n\n` +
            (post.tags.length ? post.tags.map(t => `#${t}`).join(' ') + '\n\n' : '') +
            `TASTE MiniApp'ten paylaşıldı 🍳`
        )
        const url = `https://t.me/share/url?url=https://incandescent-gelato-cc11a4.netlify.app&text=${text}`
        if (window.Telegram?.WebApp) window.Telegram.WebApp.openLink(url)
        else window.open(url, '_blank')
    }

    return (
        <div style={{ paddingBottom: '10px' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                    <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase' }}>Topluluk</div>
                    <h3 style={{ fontWeight: 900, fontSize: '1.2rem', margin: '2px 0 0' }}>🍽️ Yemek Akışı</h3>
                </div>
                <motion.button whileTap={{ scale: 0.93 }} onClick={() => setShowCreate(true)}
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', border: 'none', borderRadius: '12px', padding: '10px 16px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}>
                    + Paylaş
                </motion.button>
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
                {(['hepsi', 'yemek', 'tarif', 'menu'] as FilterType[]).map(f => {
                    const meta = f === 'hepsi' ? { label: 'Hepsi', emoji: '🍴', color: '#f59e0b' } : TYPE_META[f as PostType]
                    const active = filter === f
                    return (
                        <motion.button key={f} whileTap={{ scale: 0.94 }} onClick={() => setFilter(f)}
                            style={{ background: active ? `${meta.color}20` : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? meta.color + '50' : 'rgba(255,255,255,0.07)'}`, color: active ? meta.color : '#64748b', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                            {meta.emoji} {meta.label}
                        </motion.button>
                    )
                })}
            </div>

            {/* Feed */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏳</div>
                    <div>Paylaşımlar yükleniyor...</div>
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🍳</div>
                    <div style={{ fontWeight: 700, marginBottom: '6px' }}>Henüz paylaşım yok</div>
                    <div style={{ fontSize: '12px' }}>İlk tarifi ya da yemeği sen paylaş!</div>
                </div>
            ) : (
                filtered.map(post => <PostCard key={post.id} post={post} onClick={() => setSelectedPost(post)} />)
            )}

            {/* ══ CREATE MODAL ══ */}
            <AnimatePresence>
                {showCreate && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowCreate(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', zIndex: 2000 }} />
                        <motion.div
                            initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'linear-gradient(180deg, #111420, #0d1020)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px 24px 0 0', padding: '20px 18px 30px', zIndex: 2001, maxHeight: '90vh', overflowY: 'auto' }}
                        >
                            <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2, margin: '0 auto 18px' }} />
                            <div style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '16px' }}>✨ Yeni Paylaşım</div>

                            {/* Type selector */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '16px' }}>
                                {(['yemek', 'tarif', 'menu'] as PostType[]).map(t => {
                                    const m = TYPE_META[t]; const active = cType === t
                                    return (
                                        <motion.button key={t} whileTap={{ scale: 0.94 }}
                                            onClick={() => { setCType(t); setCTags([]) }}
                                            style={{ background: active ? `${m.color}20` : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? m.color : 'rgba(255,255,255,0.08)'}`, color: active ? m.color : '#64748b', borderRadius: '12px', padding: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                            <span style={{ fontSize: '20px' }}>{m.emoji}</span>
                                            <span>{m.label}</span>
                                        </motion.button>
                                    )
                                })}
                            </div>

                            {cType === 'menu' && (
                                <input value={cVenueName} onChange={e => setCVenueName(e.target.value)} placeholder="Mekan adı (opsiyonel)"
                                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '11px 14px', fontSize: '13px', color: '#fff', outline: 'none', marginBottom: '12px', boxSizing: 'border-box' }} />
                            )}
                            {cType === 'tarif' && (
                                <input value={cRecipeTitle} onChange={e => setCRecipeTitle(e.target.value)} placeholder="Yemek Adı"
                                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '11px 14px', fontSize: '13px', color: '#fff', outline: 'none', marginBottom: '12px', boxSizing: 'border-box', fontWeight: 700 }} />
                            )}

                            <textarea value={cText} onChange={e => setCText(e.target.value)} rows={3}
                                placeholder={cType === 'yemek' ? 'Bugün ne yedin?' : cType === 'tarif' ? 'Tarif hakkında kısa not...' : 'Mekan hakkında ne düşünüyorsun?'}
                                style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '11px 14px', fontSize: '13px', color: '#fff', outline: 'none', resize: 'none', marginBottom: '12px', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6 }} />

                            {cType === 'tarif' && (
                                <div style={{ marginBottom: '12px' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>🥄 Malzemeler</div>
                                    {cIngredients.map((ing, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                                            <input value={ing.name} onChange={e => setCIngredients(prev => prev.map((x, i) => i === idx ? { ...x, name: e.target.value } : x))} placeholder="Malzeme"
                                                style={{ flex: 2, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 10px', fontSize: '12px', color: '#fff', outline: 'none' }} />
                                            <input value={ing.amount} onChange={e => setCIngredients(prev => prev.map((x, i) => i === idx ? { ...x, amount: e.target.value } : x))} placeholder="Miktar"
                                                style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 10px', fontSize: '12px', color: '#fff', outline: 'none' }} />
                                        </div>
                                    ))}
                                    <button onClick={() => setCIngredients(prev => [...prev, { name: '', amount: '' }])}
                                        style={{ background: 'rgba(34,197,94,0.08)', border: '1px dashed rgba(34,197,94,0.3)', color: '#22c55e', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', width: '100%' }}>
                                        + Malzeme Ekle
                                    </button>
                                </div>
                            )}

                            {cType === 'tarif' && (
                                <div style={{ marginBottom: '12px' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>📋 Yapılış Adımları</div>
                                    {cSteps.map((step, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
                                            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#22c55e', fontWeight: 700, flexShrink: 0 }}>{idx + 1}</div>
                                            <input value={step} onChange={e => setCSteps(prev => prev.map((s, i) => i === idx ? e.target.value : s))} placeholder={`Adım ${idx + 1}...`}
                                                style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 10px', fontSize: '12px', color: '#fff', outline: 'none' }} />
                                        </div>
                                    ))}
                                    <button onClick={() => setCSteps(prev => [...prev, ''])}
                                        style={{ background: 'rgba(34,197,94,0.08)', border: '1px dashed rgba(34,197,94,0.3)', color: '#22c55e', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', width: '100%' }}>
                                        + Adım Ekle
                                    </button>
                                </div>
                            )}

                            {/* Tags */}
                            <div style={{ marginBottom: '14px' }}>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Etiketler</div>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {TAGS_BY_TYPE[cType].map(tag => (
                                        <motion.button key={tag} whileTap={{ scale: 0.94 }} onClick={() => toggleTag(tag)}
                                            style={{ background: cTags.includes(tag) ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${cTags.includes(tag) ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.08)'}`, color: cTags.includes(tag) ? '#f59e0b' : '#64748b', borderRadius: '20px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer' }}>
                                            {tag}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Photo */}
                            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
                            {cPhoto ? (
                                <div style={{ position: 'relative', marginBottom: '14px' }}>
                                    <img src={cPhoto} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '12px' }} />
                                    <button onClick={() => setCPhoto(undefined)} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: '14px' }}>×</button>
                                </div>
                            ) : (
                                <motion.button whileTap={{ scale: 0.96 }} onClick={() => fileRef.current?.click()}
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '12px', padding: '14px', color: '#64748b', fontSize: '13px', cursor: 'pointer', marginBottom: '14px' }}>
                                    📷 Fotoğraf Ekle (opsiyonel)
                                </motion.button>
                            )}

                            <motion.button whileTap={{ scale: 0.97 }} onClick={handleSubmit} disabled={submitting || !cText.trim()}
                                style={{ width: '100%', background: (!cText.trim() || submitting) ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #f59e0b, #d97706)', color: (!cText.trim() || submitting) ? '#64748b' : '#000', border: 'none', borderRadius: '14px', padding: '14px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', boxShadow: (!cText.trim() || submitting) ? 'none' : '0 4px 16px rgba(245,158,11,0.3)' }}>
                                {submitting ? '⏳ Paylaşılıyor...' : '🚀 Paylaş'}
                            </motion.button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ══ DETAIL MODAL ══ */}
            <AnimatePresence>
                {selectedPost && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSelectedPost(null)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', zIndex: 2000 }} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                            style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'min(93vw, 420px)', maxHeight: '85vh', overflowY: 'auto', background: 'linear-gradient(135deg, #111420, #1a1d30)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', zIndex: 2001, boxShadow: '0 20px 60px rgba(0,0,0,0.8)' }}
                        >
                            {selectedPost.photo && <img src={selectedPost.photo} alt="" style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} />}
                            <div style={{ padding: '18px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${TYPE_META[selectedPost.type].color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{selectedPost.authorEmoji}</div>
                                    <div>
                                        <div style={{ fontWeight: 700 }}>{selectedPost.authorName}</div>
                                        <div style={{ fontSize: '10px', color: '#64748b' }}>{timeAgo(selectedPost.createdAt)}</div>
                                    </div>
                                </div>
                                {selectedPost.recipeTitle && <div style={{ fontSize: '16px', fontWeight: 800, color: '#22c55e', marginBottom: '8px' }}>📖 {selectedPost.recipeTitle}</div>}
                                {selectedPost.venueName && <div style={{ fontSize: '15px', fontWeight: 800, color: '#818cf8', marginBottom: '8px' }}>🏪 {selectedPost.venueName}</div>}
                                <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.7, marginBottom: '14px' }}>{selectedPost.text}</p>
                                {selectedPost.ingredients && selectedPost.ingredients.length > 0 && (
                                    <div style={{ marginBottom: '14px' }}>
                                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#22c55e', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>🥄 Malzemeler</div>
                                        {selectedPost.ingredients.map((ing, i) => (
                                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px' }}>
                                                <span style={{ color: '#cbd5e1' }}>{ing.name}</span>
                                                <span style={{ color: '#64748b' }}>{ing.amount}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {selectedPost.steps && selectedPost.steps.length > 0 && (
                                    <div style={{ marginBottom: '14px' }}>
                                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#22c55e', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>📋 Yapılış</div>
                                        {selectedPost.steps.map((step, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'flex-start' }}>
                                                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#22c55e', fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                                                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>{step}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <motion.button whileTap={{ scale: 0.96 }} onClick={() => shareToTelegram(selectedPost)}
                                        style={{ flex: 1, background: 'rgba(0,136,204,0.1)', border: '1px solid rgba(0,136,204,0.25)', color: '#0088cc', borderRadius: '10px', padding: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                                        ✈️ Telegram'da Paylaş
                                    </motion.button>
                                    <motion.button whileTap={{ scale: 0.96 }} onClick={() => setSelectedPost(null)}
                                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '10px', padding: '10px 16px', fontSize: '12px', cursor: 'pointer' }}>
                                        Kapat
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
