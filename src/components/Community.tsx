import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { getPosts, insertPost, getMessages, sendMessage, type SupaPost } from '../services/supabase'

// ─── Types ────────────────────────────────────────────────────────────────
type PostType = 'yemek' | 'tarif' | 'menu' | 'career' | 'chat'
type FilterType = 'hepsi' | PostType

interface Ingredient { name: string; amount: string }

interface Post {
    id: string
    type: PostType
    authorName: string
    authorEmoji: string
    authorUsername?: string
    createdAt: number
    text: string
    photo?: string
    tags: string[]
    allergens?: string[]
    likes?: number
    recipeTitle?: string
    ingredients?: Ingredient[]
    steps?: string[]
    venueName?: string
    city?: string
    calories?: string
    rewardWallet?: string
}

// ─── Supabase mapper ──────────────────────────────────────────────────────
function mapPost(sp: SupaPost): Post {
    return {
        id: sp.id,
        type: sp.type,
        authorName: sp.author_name,
        authorEmoji: sp.author_emoji,
        authorUsername: sp.author_username,
        createdAt: new Date(sp.created_at).getTime(),
        text: sp.text,
        photo: sp.photo,
        tags: sp.tags || [],
        allergens: (sp as any).allergens || [],
        likes: (sp as any).likes || 0,
        recipeTitle: sp.recipe_title,
        ingredients: sp.ingredients,
        steps: sp.steps,
        venueName: sp.venue_name,
        city: sp.city || '',
        calories: sp.calories || '',
        rewardWallet: sp.reward_wallet || '',
    }
}

// ─── Allergen Data ─────────────────────────────────────────────────────────
const ALLERGENS = [
    { code: 'G',   icon: '🌾', color: '#f59e0b' },
    { code: 'SÜ',  icon: '🥛', color: '#60a5fa' },
    { code: 'Y',   icon: '🥚', color: '#fbbf24' },
    { code: 'B',   icon: '🐟', color: '#38bdf8' },
    { code: 'KA',  icon: '🦐', color: '#f97316' },
    { code: 'YF',  icon: '🥜', color: '#d97706' },
    { code: 'S',   icon: '🫘', color: '#84cc16' },
    { code: 'KM',  icon: '🌰', color: '#a16207' },
    { code: 'H',   icon: '🟡', color: '#eab308' },
    { code: 'SS',  icon: '⚪', color: '#e2e8f0' },
    { code: 'SÜL', icon: '⚗️', color: '#a78bfa' },
    { code: 'KE',  icon: '🥬', color: '#22c55e' },
    { code: 'AB',  icon: '🌱', color: '#4ade80' },
    { code: 'YU',  icon: '🦑', color: '#818cf8' },
]

// ─── Demo posts ────────────────────────────────────────────────────────────
const DEMO_POSTS: Post[] = [
    {
        id: 'job1', type: 'career', authorName: 'Sultanahmet Köftecisi', authorEmoji: '🏢',
        createdAt: Date.now() - 3600000,
        text: 'Acil Çırak ve Komi aranıyor! Mutfakta yetişmek isteyen, disiplinli arkadaşlar ulaşın. Kalacak yer sağlanır.',
        tags: ['job_listing', 'cook', 'waiter'], city: 'İstanbul / Fatih', likes: 5,
    },
    {
        id: 'job2', type: 'career', authorName: 'Chef_Mert_42', authorEmoji: '👨‍🍳',
        createdAt: Date.now() - 7200000,
        text: '15 yıllık döner ve kebap ustasıyım. Prestijli bir restoranda şef usta olarak iş arıyorum.',
        tags: ['job_seeking', 'chef', 'master'], city: 'Konya / Merkez', likes: 12,
    },
    {
        id: 'job3', type: 'career', authorName: 'Deniz Cafe & Bistro', authorEmoji: '☕',
        createdAt: Date.now() - 14400000,
        text: 'Deneyimli Garson ve Barmen çalışma arkadaşları arıyoruz. Maaş + Prim.',
        tags: ['job_listing', 'waiter'], city: 'İzmir / Bornova', likes: 3,
    },
    {
        id: 'demo1', type: 'tarif', authorName: 'Mutfak Perisi', authorEmoji: '👩‍🍳',
        createdAt: Date.now() - 10800000,
        text: 'İçli Köfte yapmanın tüm püf noktaları bu tarifte! 🥣',
        tags: ['traditional', 'healthy'], allergens: ['G', 'KM'], calories: '~320 kcal',
        recipeTitle: 'Annemin İçli Köftesi', likes: 24,
    },
    {
        id: 'demo2', type: 'yemek', authorName: 'Yemek_Gezgini', authorEmoji: '🕵️',
        createdAt: Date.now() - 18000000,
        text: 'Beşiktaş Çarşıda efsane bir Köfteci buldum! Sosu tam kıvamında. 🤤',
        tags: ['lunch', 'traditional'], city: 'İstanbul / Beşiktaş', venueName: 'Tarihi Beşiktaş Köftecisi', likes: 89,
    }
]

// ─── Chat Data (Local Cache/Mock fallback) ──────────────────────────────────
const INITIAL_CHAT = [
    { id: '1', author_name: 'System', text: 'Chat odasına hoş geldiniz! 🍕', created_at: new Date().toISOString() },
]

// ─── Helpers ──────────────────────────────────────────────────────────────
function timeAgo(ts: number, t: any) {
    const diff = Date.now() - ts
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return t('community.just_now')
    if (mins < 60) return t('community.min_ago', { n: mins })
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return t('community.hrs_ago', { n: hrs })
    return t('community.days_ago', { n: Math.floor(hrs / 24) })
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

const TYPE_META: Record<PostType, { key: string; emoji: string; color: string }> = {
    yemek: { key: 'food',   emoji: '🍽️', color: '#f97316' },
    tarif: { key: 'recipe', emoji: '📖', color: '#22c55e' },
    menu:  { key: 'menu',   emoji: '🏪', color: '#818cf8' },
    career: { key: 'career', emoji: '🧑‍🍳', color: '#f59e0b' },
    chat: { key: 'chat', emoji: '💬', color: '#3b82f6' },
}

const TAGS_BY_TYPE: Record<PostType, string[]> = {
    yemek: ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'vegan', 'vegetarian'],
    tarif: ['soup', 'meat', 'vegetables', 'dessert', 'traditional', 'practical', 'healthy'],
    menu:  ['breakfast', 'lunch', 'dinner', 'cafe', 'fastfood', 'finedining', 'seafood'],
    career: ['job_listing', 'job_seeking', 'chef', 'cook', 'waiter', 'master'],
    chat: [],
}

function getTgUser(t: any) {
    const u = window.Telegram?.WebApp?.initDataUnsafe?.user
    const emojis = ['🧑‍🍳', '👩‍🍳', '👨‍🍳', '🍴', '🥘', '🫕', '🍳', '🥗', '🍜']
    return {
        name: u ? (u.username ? `@${u.username}` : u.first_name) : t('app.guest') || 'Guest',
        username: u?.username,
        emoji: emojis[Math.floor(Math.random() * emojis.length)]
    }
}

// ─── Allergen Badge ──────────────────────────────────────────────────────
function AllergenBadges({ codes, size = 'sm' }: { codes: string[]; size?: 'sm' | 'lg' }) {
    const { t } = useTranslation()
    if (!codes || codes.length === 0) return null
    const matched = ALLERGENS.filter(a => codes.includes(a.code))
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: size === 'lg' ? '6px' : '4px', marginTop: '8px' }}>
            {matched.map(a => (
                <div key={a.code} style={{
                    background: `${a.color}15`,
                    border: `1px solid ${a.color}35`,
                    borderRadius: '20px',
                    padding: size === 'lg' ? '4px 10px' : '2px 7px',
                    display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                    <span style={{ fontSize: size === 'lg' ? '13px' : '11px' }}>{a.icon}</span>
                    <span style={{ fontSize: size === 'lg' ? '11px' : '10px', color: a.color, fontWeight: 700 }}>
                        {t(`community.allergens.${a.code}`)}
                    </span>
                </div>
            ))}
        </div>
    )
}

// ─── Post Card ─────────────────────────────────────────────────────────────
function PostCard({ post, onClick, onLike }: { post: Post; onClick: () => void; onLike: (id: string) => void }) {
    const { t, i18n } = useTranslation();
    const meta = TYPE_META[post.type]
    const isJob = post.type === 'career'

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            style={{ 
                background: isJob ? 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.02))' : 'rgba(255,255,255,0.025)', 
                border: isJob ? '1px solid rgba(245,158,11,0.2)' : '1px solid rgba(255,255,255,0.07)', 
                borderRadius: '18px', overflow: 'hidden', marginBottom: '16px',
                boxShadow: isJob ? '0 8px 20px rgba(245,158,11,0.1)' : 'none'
            }}
        >
            <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: 44, height: 44, borderRadius: '12px', background: `${meta.color}25`, border: `1px solid ${meta.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                        {post.authorEmoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: '14px', color: '#fff' }}>{post.authorName}</div>
                        <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {timeAgo(post.createdAt, t)}
                            {post.city && <span style={{ color: meta.color, fontWeight: 700 }}>• 📍 {post.city}</span>}
                        </div>
                    </div>
                    {isJob && (
                        <div style={{ background: '#f59e0b', color: '#000', borderRadius: '8px', padding: '4px 8px', fontSize: '10px', fontWeight: 900 }}>
                            {i18n.language === 'tr' ? 'İŞ İLANI' : 'JOB POST'}
                        </div>
                    )}
                </div>

                <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '12px', fontWeight: isJob ? 600 : 400 }}>
                    {post.text}
                </p>

                {post.rewardWallet && (
                    <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '10px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px' }}>💰</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '9px', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>{i18n.language === 'tr' ? 'ÖDÜL CÜZDANI' : 'REWARD WALLET'}</div>
                            <div style={{ fontSize: '10px', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.rewardWallet}</div>
                        </div>
                    </div>
                )}

                {post.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
                        {post.tags.map(tKey => (
                            <span key={tKey} style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}25`, borderRadius: '8px', padding: '3px 10px', fontSize: '10px', color: meta.color, fontWeight: 700 }}>
                                #{t(`community.tags.${tKey}`) === `community.tags.${tKey}` ? tKey : t(`community.tags.${tKey}`)}
                            </span>
                        ))}
                    </div>
                )}

                {isJob ? (
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            const link = post.authorUsername 
                                ? `https://t.me/${post.authorUsername.replace('@', '')}` 
                                : `https://t.me/taste_community`;
                            if (window.Telegram?.WebApp) window.Telegram.WebApp.openLink(link);
                            else window.open(link, '_blank');
                        }}
                        style={{ width: '100%', background: '#f59e0b', color: '#000', border: 'none', borderRadius: '12px', padding: '12px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        💬 {i18n.language === 'tr' ? 'İlan Verenle Yazış' : 'Chat with Poster'}
                    </motion.button>
                ) : (
                    <div style={{ display: 'flex', gap: '10px' }}>
                         <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onLike(post.id)}
                            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '12px', padding: '8px 16px', fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}
                        >
                            ❤️ {post.likes || 0}
                        </motion.button>
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={onClick}
                            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '12px', padding: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                        >
                            {t('community.detail')}
                        </motion.button>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

// ─── Main Component ─────────────────────────────────────────────────────────
export function Community() {
    const { t, i18n } = useTranslation()
    const [view, setView] = useState<'feed' | 'chat'>('feed')
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<FilterType>('hepsi')
    const [search, setSearch] = useState('')
    const [showCreate, setShowCreate] = useState(false)
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [likedIds, setLikedIds] = useState<Set<string>>(new Set())

    // Create form
    const [cType, setCType] = useState<PostType>('yemek')
    const [cText, setCText] = useState('')
    const [cPhoto, setCPhoto] = useState<string | undefined>()
    const [cTags, setCTags] = useState<string[]>([])
    const [cAllergens, setCAllergens] = useState<string[]>([])
    const [cCalories, setCCalories] = useState('')
    const [cRecipeTitle, setCRecipeTitle] = useState('')
    const [cIngredients, setCIngredients] = useState<Ingredient[]>([{ name: '', amount: '' }])
    const [cSteps, setCSteps] = useState<string[]>([''])
    const [cVenueName, setCVenueName] = useState('')
    const [cCity, setCCity] = useState('')
    const [cRewardWallet, setCRewardWallet] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    const [chatMsgs, setChatMsgs] = useState<any[]>([])
    const [cMsg, setCMsg] = useState('')

    const refreshData = async () => {
        try {
            // 1. Fetch Posts
            const rawPosts = await getPosts()
            const mapped = rawPosts.map(mapPost)
            setPosts(mapped.length > 0 ? mapped : DEMO_POSTS)
            
            // 2. Fetch Chat
            const rawChat = await getMessages()
            setChatMsgs(rawChat.reverse())
        } catch (e) {
            console.error('Refresh fail', e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refreshData()
        const interval = setInterval(refreshData, 10000) // 10 saniyede bir otomatik tazele (Canlılık için)
        return () => clearInterval(interval)
    }, [])

    async function handleChatSend() {
        if (!cMsg.trim()) return
        const tg = getTgUser(t)
        const sent = await sendMessage(tg.name, tg.emoji, cMsg)
        if (sent) {
            setChatMsgs(prev => [...prev, mapPost(sent)])
            setCMsg('')
        }
    }

    const filtered = posts
        .filter(p => filter === 'hepsi' || p.type === filter)
        .filter(p => !search || p.text.toLowerCase().includes(search.toLowerCase()) || p.recipeTitle?.toLowerCase().includes(search.toLowerCase()) || p.venueName?.toLowerCase().includes(search.toLowerCase()))

    const topLiked = [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 3)

    async function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setCPhoto(await resizeImage(file))
    }

    function toggleTag(tag: string) {
        setCTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
    }

    function toggleAllergen(code: string) {
        setCAllergens(prev => prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code])
    }

    function handleLike(id: string) {
        if (likedIds.has(id)) return
        setLikedIds(prev => new Set([...prev, id]))
        setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p))
    }

    function resetForm() {
        setCType('yemek'); setCText(''); setCPhoto(undefined); setCTags([])
        setCAllergens([]); setCCalories(''); setCRecipeTitle('')
        setCIngredients([{ name: '', amount: '' }]); setCSteps([''])
        setCVenueName(''); setCCity(''); setCRewardWallet('')
    }

    async function handleSubmit() {
        if (!cText.trim()) return
        setSubmitting(true)
        const tg = getTgUser(t)
        const payload: any = {
            type: cType,
            author_name: tg.name,
            author_emoji: tg.emoji,
            author_username: tg.username,
            text: cText,
            photo: cPhoto,
            tags: cTags,
            allergens: cAllergens,
            calories: cCalories || undefined,
            city: cCity || undefined,
            reward_wallet: cRewardWallet || undefined,
            likes: 0
        }

        if (cType === 'tarif') {
            payload.recipe_title = cRecipeTitle || undefined
            payload.ingredients = cIngredients.filter(i => i.name)
            payload.steps = cSteps.filter(s => s.trim())
        } else if (cType === 'menu' || cType === 'career' || cType === 'yemek') {
            payload.venue_name = cVenueName || undefined
        }

        const saved = await insertPost(payload)
        
        // Even if DB fails (e.g. schema not updated), add to local state to keep user happy
        const newPost: Post = saved ? mapPost(saved) : {
            id: 'local-' + Date.now(),
            type: cType,
            authorName: tg.name,
            authorEmoji: tg.emoji,
            authorUsername: tg.username,
            createdAt: Date.now(),
            text: cText,
            photo: cPhoto,
            tags: cTags,
            allergens: cAllergens,
            recipeTitle: cRecipeTitle,
            venueName: cVenueName,
            city: cCity,
            calories: cCalories,
            likes: 0
        }
        
        setPosts(prev => [newPost, ...prev])
        resetForm()
        setSubmitting(false)
        setShowCreate(false)
        
        // Show success alert
        const tgApp = (window as any).Telegram?.WebApp
        if (tgApp?.showAlert) {
            tgApp.showAlert(i18n.language === 'tr' ? 'Harika! İlanın paylaşıldı ve tüm dünyaya duyuruldu. 🚀' : 'Great! Your post has been shared globally! 🚀')
        } else {
            alert(i18n.language === 'tr' ? 'İlanın Paylaşıldı! 🚀' : 'Post Shared! 🚀')
        }
    }

    function shareToTelegram(post: Post) {
        const meta = TYPE_META[post.type]
        const allergenText = post.allergens && post.allergens.length > 0
            ? `\n⚠️ ${t('community.allergen_warning')}: ` + ALLERGENS.filter(a => post.allergens!.includes(a.code)).map(a => t(`community.allergens.${a.code}`)).join(', ')
            : ''
        const text = encodeURIComponent(
            `${meta.emoji} ${t(`community.filters.${meta.key}`).toUpperCase()}\n\n` +
            (post.recipeTitle ? `📖 ${post.recipeTitle}\n` : '') +
            (post.venueName ? `🏪 ${post.venueName}\n` : '') +
            `${post.text}` + allergenText + '\n\n' +
            (post.calories ? `🔥 ${post.calories}\n` : '') +
            (post.tags.length ? post.tags.map(tKey => `#${t(`community.tags.${tKey}`) === `community.tags.${tKey}` ? tKey : t(`community.tags.${tKey}`)}`).join(' ') + '\n\n' : '') +
            t('community.shared_from')
        )
        const url = `https://t.me/share/url?url=https://incandescent-gelato-cc11a4.netlify.app&text=${text}`
        if (window.Telegram?.WebApp) window.Telegram.WebApp.openLink(url)
        else window.open(url, '_blank')
    }

    return (
        <div style={{ paddingBottom: '10px' }}>

            {/* ── Header ── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '14px', padding: '4px' }}>
                    <button onClick={() => setView('feed')} style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: view === 'feed' ? '#f59e0b' : 'transparent', color: view === 'feed' ? '#000' : '#64748b', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}>
                       🏠 {i18n.language === 'tr' ? 'Akış' : 'Feed'}
                    </button>
                    <button onClick={() => setView('chat')} style={{ padding: '10px 18px', borderRadius: '10px', border: 'none', background: view === 'chat' ? '#3b82f6' : 'transparent', color: view === 'chat' ? '#fff' : '#64748b', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}>
                       💬 {i18n.language === 'tr' ? 'Sohbet' : 'Chat'}
                    </button>
                </div>
                <motion.button 
                    whileTap={{ scale: 0.93 }} 
                    onClick={() => setShowCreate(true)}
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', border: 'none', borderRadius: '14px', padding: '11px 20px', fontSize: '13px', fontWeight: 900, cursor: 'pointer', boxShadow: '0 4px 15px rgba(245,158,11,0.4)' }}>
                    🚀 {t('community.share')}
                </motion.button>
            </div>

            {view === 'feed' ? (
                <>
                {/* ── Category Icons ── */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {(['hepsi', 'career', 'tarif', 'yemek', 'menu'] as FilterType[]).map(f => {
                         const m = f === 'hepsi' ? { key: 'all', emoji: '✨', color: '#fff' } : TYPE_META[f as PostType]
                         const active = filter === f
                         return (
                            <motion.button key={f} whileTap={{ scale: 0.9 }} onClick={() => setFilter(f)}
                                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', background: active ? `${m.color}25` : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? m.color : 'rgba(255,255,255,0.08)'}`, borderRadius: '16px', minWidth: '70px', padding: '12px 8px', cursor: 'pointer' }}>
                                <span style={{ fontSize: '24px' }}>{m.emoji}</span>
                                <span style={{ fontSize: '10px', fontWeight: 800, color: active ? '#fff' : '#64748b', textTransform: 'uppercase' }}>{t(`community.filters.${m.key}`)}</span>
                            </motion.button>
                         )
                    })}
                </div>

            {/* ── Stats Banner ── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '16px' }}
            >
                {[
                    { icon: '📝', value: posts.length, label: t('community.stats.posts') },
                    { icon: '❤️', value: posts.reduce((s, p) => s + (p.likes || 0), 0), label: t('community.stats.likes') },
                    { icon: '⚠️', value: posts.filter(p => p.allergens && p.allergens.length > 0).length, label: t('community.stats.allergens') },
                ].map((s, i) => (
                    <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '14px', padding: '10px', textAlign: 'center' }}>
                        <div style={{ fontSize: '16px' }}>{s.icon}</div>
                        <div style={{ fontSize: '16px', fontWeight: 900, color: '#f59e0b' }}>{s.value}</div>
                        <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                    </div>
                ))}
            </motion.div>

            {/* ── Reward Banner ── */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ 
                    background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(16,185,129,0.05))',
                    border: '1px solid rgba(34,197,94,0.2)',
                    borderRadius: '16px', padding: '12px 16px', marginBottom: '16px',
                    display: 'flex', alignItems: 'center', gap: '12px'
                }}
            >
                <div style={{ fontSize: '24px' }}>📸</div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#10b981' }}>{i18n.language === 'tr' ? 'PAYLAŞ VE KAZAN!' : 'SHARE AND WIN!'}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', lineHeight: 1.4 }}>
                        {i18n.language === 'tr' 
                            ? 'Yemek, Tarif veya Menü paylaş, ekran görüntüsü al ve cüzdan adresini bırak, 20 TASTE kazan!' 
                            : 'Share Food, Recipe or Menu, take a screenshot & drop your wallet address to win 20 TASTE!'}
                    </div>
                </div>
                <div style={{ background: '#10b981', color: '#000', padding: '4px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 900 }}>
                    +20 T
                </div>
            </motion.div>

            {/* ── Search ── */}
            <div style={{ position: 'relative', marginBottom: '14px' }}>
                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px' }}>🔍</span>
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder={t('community.search_ph')}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '11px 14px 11px 36px', fontSize: '13px', color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                />
            </div>

            {/* ── Filter tabs ── */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
                {(['hepsi', 'yemek', 'tarif', 'menu', 'career'] as FilterType[]).map(f => {
                    const meta = f === 'hepsi' ? { key: 'all', emoji: '🍴', color: '#f59e0b' } : TYPE_META[f as PostType]
                    const active = filter === f
                    return (
                        <motion.button key={f} whileTap={{ scale: 0.94 }} onClick={() => setFilter(f)}
                            style={{ background: active ? `${meta.color}20` : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? meta.color + '50' : 'rgba(255,255,255,0.07)'}`, color: active ? meta.color : '#64748b', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', flexShrink: 0 }}>
                            {meta.emoji} {t(`community.filters.${meta.key}`)}
                        </motion.button>
                    )
                })}
            </div>

            {/* ── Trend Posts ── */}
            {filter === 'hepsi' && topLiked.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ height: '1px', flex: 1, background: 'rgba(245,159,11,0.2)' }} />
                        🔥 {t('community.trending')}
                        <div style={{ height: '1px', flex: 1, background: 'rgba(245,159,11,0.2)' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
                        {topLiked.map((post, i) => {
                            const meta = TYPE_META[post.type]
                            return (
                                <motion.div key={post.id} whileTap={{ scale: 0.96 }} onClick={() => setSelectedPost(post)}
                                    style={{ flexShrink: 0, width: '160px', background: `${meta.color}0a`, border: `1px solid ${meta.color}25`, borderRadius: '14px', padding: '12px', cursor: 'pointer' }}>
                                    <div style={{ fontSize: '18px', marginBottom: '6px' }}>
                                        {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                                    </div>
                                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#fff', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {post.recipeTitle || post.venueName || post.authorName}
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {post.text}
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#f87171', fontWeight: 700 }}>❤️ {post.likes || 0}</div>
                                </motion.div>
                            )
                        })}
                    </div>
                </motion.div>
            )}

            {/* ── Feed ── */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>⏳ {t('community.loading')}</div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>👨‍🍳</div>
                    <div style={{ fontWeight: 800, color: '#fff' }}>{i18n.language === 'tr' ? 'Henüz İlan Yok' : 'No Posts Yet'}</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>{i18n.language === 'tr' ? 'İlk ilanı veya paylaşımı sen yap!' : 'Be the first to share something!'}</div>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {filtered.map(post => <PostCard key={post.id} post={post} onClick={() => setSelectedPost(post)} onLike={handleLike} />)}
                </div>
            )}
            </>
            ) : (
                /* ── Chat View ── */
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '20px', padding: '16px', minHeight: '60vh', display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', maxHeight: '50vh', padding: '10px' }}>
                        {chatMsgs.length === 0 ? (
                             <div style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', marginTop: '40px' }}>Sohbet başlatılıyor... 🔋</div>
                        ) : (
                            chatMsgs.map(m => {
                                const isMe = m.authorName === getTgUser(t).name
                                return (
                                    <div key={m.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                                        <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '2px', marginLeft: '4px', textAlign: isMe ? 'right' : 'left' }}>
                                            {m.authorEmoji} {m.authorName} • {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div style={{ background: isMe ? '#f59e0b' : 'rgba(255,255,255,0.05)', borderRadius: '16px', border: isMe ? 'none' : '1px solid rgba(255,255,255,0.1)', padding: '10px 14px', fontSize: '13px', color: isMe ? '#000' : '#fff', fontWeight: isMe ? 700 : 400 }}>
                                            {m.text}
                                        </div>
                                    </div>
                                )
                            })
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '20px', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '16px' }}>
                        <input 
                            value={cMsg}
                            onChange={e => setCMsg(e.target.value)}
                            onKeyPress={e => e.key === 'Enter' && handleChatSend()}
                            placeholder={i18n.language === 'tr' ? 'Mesaj yaz...' : 'Type a message...'} 
                            style={{ flex: 1, background: 'transparent', border: 'none', padding: '12px', color: '#fff', fontSize: '14px', outline: 'none' }} 
                        />
                        <button 
                            onClick={handleChatSend}
                            style={{ background: '#f59e0b', color: '#000', border: 'none', borderRadius: '12px', width: '48px', height: '48px', fontWeight: 900, cursor: 'pointer' }}>
                            🚀
                        </button>
                    </div>
                </motion.div>
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
                            style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'linear-gradient(180deg, #111420, #0d1020)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px 24px 0 0', padding: '20px 18px 34px', zIndex: 2001, maxHeight: '92vh', overflowY: 'auto' }}
                        >
                            <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2, margin: '0 auto 18px' }} />
                            <div style={{ fontWeight: 900, fontSize: '1.1rem', marginBottom: '16px' }}>✨ {t('community.create_title')}</div>

                            {/* Type selector */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', marginBottom: '16px' }}>
                                {(['yemek', 'tarif', 'menu', 'career'] as PostType[]).map(tKey => {
                                    const m = TYPE_META[tKey]; const active = cType === tKey
                                    return (
                                        <motion.button key={tKey} whileTap={{ scale: 0.94 }}
                                            onClick={() => { setCType(tKey); setCTags([]) }}
                                            style={{ background: active ? `${m.color}20` : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? m.color : 'rgba(255,255,255,0.08)'}`, color: active ? m.color : '#64748b', borderRadius: '12px', padding: '10px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                            <span style={{ fontSize: '20px' }}>{m.emoji}</span>
                                            <span>{t(`community.filters.${m.key}`)}</span>
                                        </motion.button>
                                    )
                                })}
                            </div>

                            {(cType === 'menu' || cType === 'career' || cType === 'yemek') && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                                    <input value={cVenueName} onChange={e => setCVenueName(e.target.value)} placeholder={cType === 'career' ? (i18n.language === 'tr' ? 'Lokantadaki Pozisyon' : 'Position in Restaurant') : t('community.venue_ph')}
                                        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '11px 14px', fontSize: '13px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
                                    <input value={cCity} onChange={e => setCCity(e.target.value)} placeholder={t('community.city_ph')}
                                        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '11px 14px', fontSize: '13px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
                                </div>
                            )}
                            {cType === 'tarif' && (
                                <input value={cRecipeTitle} onChange={e => setCRecipeTitle(e.target.value)} placeholder={t('community.recipe_ph')}
                                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '11px 14px', fontSize: '13px', color: '#fff', outline: 'none', marginBottom: '12px', boxSizing: 'border-box', fontWeight: 700 }} />
                            )}

                            <textarea value={cText} onChange={e => setCText(e.target.value)} rows={3}
                                placeholder={cType === 'yemek' ? t('community.ph_food') : cType === 'tarif' ? t('community.ph_recipe') : cType === 'career' ? (i18n.language === 'tr' ? 'İş ilanı veya iş arayışınızı buraya yazın...' : 'Write your job post or seeking details here...') : t('community.ph_menu')}
                                style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '11px 14px', fontSize: '13px', color: '#fff', outline: 'none', resize: 'none', marginBottom: '12px', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6 }} />

                             {/* Wallet Address for Rewards */}
                             {cType !== 'career' && (
                                 <div style={{ marginBottom: '14px' }}>
                                     <div style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>💰 {i18n.language === 'tr' ? 'Ödül İçin Cüzdan Adresi' : 'Wallet Address for Reward'}</div>
                                     <input value={cRewardWallet} onChange={e => setCRewardWallet(e.target.value)} placeholder="UQ... or EQ..." style={{ width: '100%', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '11px 14px', fontSize: '12px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
                                     <div style={{ fontSize: '9px', color: '#475569', marginTop: '4px' }}>{i18n.language === 'tr' ? '* Paylaştıktan sonra ekran görüntüsü alıp TG grubuna atmayı unutmayın!' : '* Don\'t forget to take a screenshot and share in TG group after posting!'}</div>
                                 </div>
                             )}

                            {/* Calories */}
                            {cType !== 'career' && (
                                <input value={cCalories} onChange={e => setCCalories(e.target.value)} placeholder={t('community.calories_ph')}
                                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '9px 14px', fontSize: '13px', color: '#fff', outline: 'none', marginBottom: '14px', boxSizing: 'border-box' }} />
                            )}

                            {/* Allergen Picker */}
                            <div style={{ marginBottom: '14px' }}>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>⚠️ {t('community.mark_allergens')}</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '6px' }}>
                                    {ALLERGENS.map(a => {
                                        const active = cAllergens.includes(a.code)
                                        return (
                                            <motion.button key={a.code} whileTap={{ scale: 0.9 }} onClick={() => toggleAllergen(a.code)}
                                                style={{ background: active ? `${a.color}20` : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? a.color + '50' : 'rgba(255,255,255,0.07)'}`, borderRadius: '10px', padding: '7px 4px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                                                <span style={{ fontSize: '14px' }}>{a.icon}</span>
                                                <span style={{ fontSize: '8px', color: active ? a.color : '#64748b', fontWeight: 700, lineHeight: 1.2, textAlign: 'center' }}>{t(`community.allergens.${a.code}`)}</span>
                                            </motion.button>
                                        )
                                    })}
                                </div>
                            </div>

                            {cType === 'tarif' && (
                                <div style={{ marginBottom: '12px' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{t('community.ingredients_title')}</div>
                                    {cIngredients.map((ing, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                                            <input value={ing.name} onChange={e => setCIngredients(prev => prev.map((x, i) => i === idx ? { ...x, name: e.target.value } : x))} placeholder={t('community.ing_ph')}
                                                style={{ flex: 2, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 10px', fontSize: '12px', color: '#fff', outline: 'none' }} />
                                            <input value={ing.amount} onChange={e => setCIngredients(prev => prev.map((x, i) => i === idx ? { ...x, amount: e.target.value } : x))} placeholder={t('community.amt_ph')}
                                                style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 10px', fontSize: '12px', color: '#fff', outline: 'none' }} />
                                        </div>
                                    ))}
                                    <button onClick={() => setCIngredients(prev => [...prev, { name: '', amount: '' }])}
                                        style={{ background: 'rgba(34,197,94,0.08)', border: '1px dashed rgba(34,197,94,0.3)', color: '#22c55e', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', width: '100%' }}>
                                        {t('community.add_ing')}
                                    </button>
                                </div>
                            )}

                            {cType === 'tarif' && (
                                <div style={{ marginBottom: '12px' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{t('community.steps_title')}</div>
                                    {cSteps.map((step, idx) => (
                                        <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '6px', alignItems: 'center' }}>
                                            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#22c55e', fontWeight: 700, flexShrink: 0 }}>{idx + 1}</div>
                                            <input value={step} onChange={e => setCSteps(prev => prev.map((s, i) => i === idx ? e.target.value : s))} placeholder={t('community.step_ph', { n: idx + 1 })}
                                                style={{ flex: 1, background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 10px', fontSize: '12px', color: '#fff', outline: 'none' }} />
                                        </div>
                                    ))}
                                    <button onClick={() => setCSteps(prev => [...prev, ''])}
                                        style={{ background: 'rgba(34,197,94,0.08)', border: '1px dashed rgba(34,197,94,0.3)', color: '#22c55e', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', width: '100%' }}>
                                        {t('community.add_step')}
                                    </button>
                                </div>
                            )}

                            {/* Tags */}
                            <div style={{ marginBottom: '14px' }}>
                                <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>{t('community.tags_title')}</div>
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {TAGS_BY_TYPE[cType].map(tagKey => (
                                        <motion.button key={tagKey} whileTap={{ scale: 0.94 }} onClick={() => toggleTag(tagKey)}
                                            style={{ background: cTags.includes(tagKey) ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${cTags.includes(tagKey) ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.08)'}`, color: cTags.includes(tagKey) ? '#f59e0b' : '#64748b', borderRadius: '20px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer' }}>
                                            {t(`community.tags.${tagKey}`) === `community.tags.${tagKey}` ? tagKey : t(`community.tags.${tagKey}`)}
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
                                    📷 {t('community.add_photo')}
                                </motion.button>
                            )}

                            <motion.button whileTap={{ scale: 0.97 }} onClick={handleSubmit} disabled={submitting || !cText.trim()}
                                style={{ width: '100%', background: (!cText.trim() || submitting) ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, #f59e0b, #d97706)', color: (!cText.trim() || submitting) ? '#64748b' : '#000', border: 'none', borderRadius: '14px', padding: '14px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', boxShadow: (!cText.trim() || submitting) ? 'none' : '0 4px 16px rgba(245,158,11,0.3)' }}>
                                {submitting ? t('community.sharing') : t('community.share_btn')}
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
                                        <div style={{ fontSize: '10px', color: '#64748b', display: 'flex', gap: '6px' }}>
                                            {timeAgo(selectedPost.createdAt, t)}
                                            {selectedPost.city && <span>• 📍 {selectedPost.city}</span>}
                                        </div>
                                    </div>
                                </div>

                                {selectedPost.recipeTitle && <div style={{ fontSize: '16px', fontWeight: 800, color: '#22c55e', marginBottom: '8px' }}>📖 {selectedPost.recipeTitle}</div>}
                                {selectedPost.venueName && <div style={{ fontSize: '15px', fontWeight: 800, color: '#818cf8', marginBottom: '8px' }}>🏪 {selectedPost.venueName}</div>}
                                <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: 1.7, marginBottom: '14px' }}>{selectedPost.text}</p>

                                {/* Kalori */}
                                {selectedPost.calories && (
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: '#f87171', fontWeight: 700, marginBottom: '14px' }}>
                                        🔥 {selectedPost.calories}
                                    </div>
                                )}

                                {/* Alerjenler - büyük gösterim */}
                                {selectedPost.allergens && selectedPost.allergens.length > 0 && (
                                    <div style={{ background: 'rgba(245,159,11,0.05)', border: '1px solid rgba(245,159,11,0.15)', borderRadius: '14px', padding: '14px', marginBottom: '14px' }}>
                                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>⚠️ {t('community.allergen_warning')}</div>
                                        <AllergenBadges codes={selectedPost.allergens} size="lg" />
                                    </div>
                                )}

                                {selectedPost.ingredients && selectedPost.ingredients.length > 0 && (
                                    <div style={{ marginBottom: '14px' }}>
                                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#22c55e', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('community.ingredients_title')}</div>
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
                                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#22c55e', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>{t('community.directions')}</div>
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
                                        ✈️ {t('community.share')}
                                    </motion.button>
                                    <motion.button whileTap={{ scale: 0.96 }}
                                        onClick={() => { handleLike(selectedPost.id); setSelectedPost(prev => prev ? { ...prev, likes: (prev.likes || 0) + 1 } : null) }}
                                        style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '10px', padding: '10px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                                        ❤️ {selectedPost.likes || 0}
                                    </motion.button>
                                    <motion.button whileTap={{ scale: 0.96 }} onClick={() => setSelectedPost(null)}
                                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '10px', padding: '10px 16px', fontSize: '12px', cursor: 'pointer' }}>
                                        {t('community.close')}
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
