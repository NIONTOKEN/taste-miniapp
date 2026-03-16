import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { getPosts, insertPost, type SupaPost } from '../services/supabase'

// ─── Types ────────────────────────────────────────────────────────────────
type PostType = 'yemek' | 'tarif' | 'menu' | 'career'
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
    allergens?: string[]
    likes?: number
    recipeTitle?: string
    ingredients?: Ingredient[]
    steps?: string[]
    venueName?: string
    city?: string
    calories?: string
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
        allergens: (sp as any).allergens || [],
        likes: (sp as any).likes || 0,
        recipeTitle: sp.recipe_title,
        ingredients: sp.ingredients,
        steps: sp.steps,
        venueName: sp.venue_name,
        city: (sp as any).city || '',
        calories: (sp as any).calories || '',
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
        id: 'demo1', type: 'tarif', authorName: 'Chef Ayşe', authorEmoji: '👩‍🍳',
        createdAt: Date.now() - 7200000,
        text: 'Annemin mercimek çorbası tarifi — 30 yıllık lezzet 🍲',
        tags: ['Çorba', 'Yöresel'], allergens: ['G', 'SÜ'], calories: '~180 kcal',
        recipeTitle: 'Mercimek Çorbası', likes: 24,
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
        tags: ['Akşam Yemeği', 'Et Yemekleri'], allergens: ['G', 'Y'], calories: '~520 kcal', likes: 41,
    },
    {
        id: 'demo3', type: 'menu', authorName: 'FoodTaster42', authorEmoji: '🍴',
        createdAt: Date.now() - 36000000,
        text: 'Bu hafta denediğim kahvaltı mekanı — kesinlikle tavsiye ederim!',
        tags: ['Kahvaltı', 'Mekan'], venueName: 'Ege Köy Kahvaltısı', city: 'İzmir',
        allergens: ['G', 'SÜ', 'Y', 'SS'], likes: 18,
    },
    {
        id: 'demo4', type: 'tarif', authorName: 'PastaChef', authorEmoji: '🧑‍🍳',
        createdAt: Date.now() - 86400000,
        text: 'Ev yapımı baklava — mis gibi 🍯',
        tags: ['Tatlı', 'Yöresel'], allergens: ['G', 'KM', 'SÜ'], calories: '~410 kcal',
        recipeTitle: 'Fıstıklı Baklava', likes: 67,
        ingredients: [
            { name: 'Yufka', amount: '1 paket' },
            { name: 'Antep fıstığı', amount: '300g' },
            { name: 'Tereyağı', amount: '200g' },
            { name: 'Şeker', amount: '3 su bardağı' },
        ],
        steps: [
            'Yufkaları tepsiye tek tek yayın, aralarına yağ sürün.',
            'Ortasına fıstıkları yayın.',
            'Üzerini kapatıp dilimleyin ve pişirin.',
            'Şerbeti sıcak baklavaya dökün.',
        ]
    },
    {
        id: 'demo5', type: 'career', authorName: 'Restoran_X', authorEmoji: '🏢',
        createdAt: Date.now() - 43200000,
        text: 'Mutfak ekibimize katılacak Izgara Ustası arıyoruz! 🔥 Deneyimli adaylar Telegram üzerinden ulaşabilir.',
        tags: ['İş İlanı', 'Chef', 'Usta'], city: 'İstanbul', likes: 12,
    },
    {
        id: 'demo6', type: 'career', authorName: 'Şef_Ali', authorEmoji: '👨‍🍳',
        createdAt: Date.now() - 172800000,
        text: '10 yıllık şefim, butik bir mutfakta iş arıyorum. Yöresel lezzetler uzmanlık alanım.',
        tags: ['İş Arıyorum', 'Şef'], city: 'Ankara', likes: 8,
    },
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
}

const TAGS_BY_TYPE: Record<PostType, string[]> = {
    yemek: ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'vegan', 'vegetarian'],
    tarif: ['soup', 'meat', 'vegetables', 'dessert', 'traditional', 'practical', 'healthy'],
    menu:  ['breakfast', 'lunch', 'dinner', 'cafe', 'fastfood', 'finedining', 'seafood'],
    career: ['job_listing', 'job_seeking', 'chef', 'cook', 'waiter', 'master'],
}

function getTgUser(t: any) {
    const u = window.Telegram?.WebApp?.initDataUnsafe?.user
    const emojis = ['🧑‍🍳', '👩‍🍳', '👨‍🍳', '🍴', '🥘', '🫕', '🍳', '🥗', '🍜']
    return {
        name: u ? u.first_name : t('app.guest') || 'Guest',
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
    const { t } = useTranslation();
    const meta = TYPE_META[post.type]
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: 0.985 }}
            style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', overflow: 'hidden', cursor: 'pointer', marginBottom: '14px' }}
        >
            {/* Photo */}
            {post.photo && <img src={post.photo} alt="" style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />}

            <div style={{ padding: '14px' }} onClick={onClick}>
                {/* Author row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${meta.color}20`, border: `1px solid ${meta.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                        {post.authorEmoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '13px', color: '#fff' }}>{post.authorName}</div>
                        <div style={{ fontSize: '10px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {timeAgo(post.createdAt, t)}
                            {post.city && <span>• 📍 {post.city}</span>}
                        </div>
                    </div>
                    <div style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}30`, color: meta.color, borderRadius: '20px', padding: '3px 10px', fontSize: '10px', fontWeight: 700, flexShrink: 0 }}>
                        {meta.emoji} {t(`community.filters.${meta.key}`)}
                    </div>
                </div>

                {post.recipeTitle && <div style={{ fontSize: '14px', fontWeight: 800, color: '#22c55e', marginBottom: '4px' }}>📖 {post.recipeTitle}</div>}
                {post.venueName && <div style={{ fontSize: '13px', fontWeight: 700, color: '#818cf8', marginBottom: '4px' }}>🏪 {post.venueName}</div>}

                <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, margin: '0 0 8px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {post.text}
                </p>

                {/* Calories */}
                {post.calories && (
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '20px', padding: '2px 9px', fontSize: '10px', color: '#f87171', fontWeight: 700, marginBottom: '8px' }}>
                        🔥 {post.calories}
                    </div>
                )}

                {/* Allergens */}
                {post.allergens && post.allergens.length > 0 && (
                    <div style={{ marginBottom: '8px' }}>
                        <div style={{ fontSize: '9px', fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>⚠️ {t('community.detail_allergens') || t('community.allergen_warning')}</div>
                        <AllergenBadges codes={post.allergens} />
                    </div>
                )}

                {/* Tags */}
                {post.tags.length > 0 && (
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
                        {post.tags.map(tKey => (
                            <span key={tKey} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '2px 8px', fontSize: '10px', color: '#94a3b8' }}>
                                #{t(`community.tags.${tKey}`) === `community.tags.${tKey}` ? tKey : t(`community.tags.${tKey}`)}
                            </span>
                        ))}
                    </div>
                )}

                {post.ingredients && post.ingredients.length > 0 && (
                    <div style={{ padding: '8px 12px', background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.1)', borderRadius: '10px', fontSize: '11px', color: '#4ade80', marginBottom: '10px' }}>
                        🥄 {t('community.ingredients_count', { n: post.ingredients.length, s: post.steps?.length || 0 })}
                    </div>
                )}
            </div>

            {/* Bottom action bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <motion.button
                    whileTap={{ scale: 0.88 }}
                    onClick={(e) => { e.stopPropagation(); onLike(post.id) }}
                    style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#f87171', borderRadius: '20px', padding: '5px 12px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
                >
                    ❤️ {post.likes || 0}
                </motion.button>
                <motion.button
                    whileTap={{ scale: 0.93 }}
                    onClick={(e) => { e.stopPropagation(); onClick() }}
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8', borderRadius: '20px', padding: '5px 14px', fontSize: '12px', cursor: 'pointer' }}
                >
                    {t('community.detail')}
                </motion.button>
            </div>
        </motion.div>
    )
}

// ─── Main Component ─────────────────────────────────────────────────────────
export function Community() {
    const { t, i18n } = useTranslation()
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
    const [submitting, setSubmitting] = useState(false)
    const fileRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const cached = sessionStorage.getItem('taste_posts_cache')
        if (cached) {
            try { setPosts(JSON.parse(cached)); setLoading(false) } catch { /* ignore */ }
        }
        getPosts().then(data => {
            const mapped = data.map(mapPost)
            const result = mapped.length > 0 ? mapped : DEMO_POSTS
            setPosts(result)
            sessionStorage.setItem('taste_posts_cache', JSON.stringify(result))
        }).finally(() => setLoading(false))
    }, [])

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
        setCVenueName(''); setCCity('')
    }

    async function handleSubmit() {
        if (!cText.trim()) return
        setSubmitting(true)
        const tg = getTgUser(t)
        const payload: any = {
            type: cType,
            author_name: tg.name,
            author_emoji: tg.emoji,
            text: cText,
            photo: cPhoto,
            tags: cTags,
        }

        if (cType === 'tarif') {
            payload.recipe_title = cRecipeTitle || undefined
            payload.ingredients = cIngredients.filter(i => i.name)
            payload.steps = cSteps.filter(s => s.trim())
        } else if (cType === 'menu') {
            payload.venue_name = cVenueName || undefined
        }

        // Note: Allergens, calories, and city are currently not in the DB schema
        // To enable them, run the SQL update to add these columns to 'posts' table.
        
        const saved = await insertPost(payload)
        if (saved) setPosts(prev => [mapPost(saved), ...prev])
        resetForm()
        setSubmitting(false)
        setShowCreate(false)
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                    <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase' }}>{t('community.nav_title')}</div>
                    <h3 style={{ fontWeight: 900, fontSize: '1.2rem', margin: '2px 0 0' }}>🍽️ {t('community.title')}</h3>
                </div>
                <motion.button whileTap={{ scale: 0.93 }} onClick={() => setShowCreate(true)}
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', border: 'none', borderRadius: '12px', padding: '10px 16px', fontSize: '13px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}>
                    + {t('community.share')}
                </motion.button>
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
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>⏳</div>
                    <div>{t('community.loading')}</div>
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🍳</div>
                    <div style={{ fontWeight: 700, marginBottom: '6px' }}>{search ? t('community.no_results') : t('community.no_posts_title')}</div>
                    <div style={{ fontSize: '12px' }}>{search ? t('community.no_results_desc', { search }) || t('community.no_results') : t('community.no_posts_desc')}</div>
                </div>
            ) : (
                filtered.map(post => <PostCard key={post.id} post={post} onClick={() => setSelectedPost(post)} onLike={handleLike} />)
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

                            {cType === 'menu' && (
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                                    <input value={cVenueName} onChange={e => setCVenueName(e.target.value)} placeholder={t('community.venue_ph')}
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
                                    <input placeholder="UQ... or EQ..." style={{ width: '100%', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '11px 14px', fontSize: '12px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
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
