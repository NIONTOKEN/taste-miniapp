import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation, Trans } from 'react-i18next'
import {
    getJobs, insertJob, applyToJob, getReviews, insertReview, getProfiles, upsertProfile,
    getPosts, insertPost, updatePostLikes,
    type SupaJob, type SupaReview, type SupaProfile, type SupaPost
} from '../services/supabase'

// ─── Types ────────────────────────────────────────────────────────────────
type JobView = 'feed' | 'board' | 'add_job' | 'reviews' | 'profile' | 'add_review' | 'today'

// ─── Constants ────────────────────────────────────────────────────────────
const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Adana', 'Konya', 'Gaziantep', 'Mersin', 'Kayseri', 'Diğer']
const PROFESSIONS = ['Aşçı / Şef', 'Pastane Ustası', 'Garson', 'Barmen / Barista', 'Kasap', 'Fırıncı', 'Mutfak Yardımcısı', 'Komi', 'Restoran Müdürü', 'Dondurma Ustası', 'Diğer']

const EMOJIS = ['👨‍🍳', '👩‍🍳', '🧑‍🍳', '🏢', '☕', '🔪', '🍽️', '🥘', '🫕', '🍳']

function getTgUser(t: any) {
    const u = window.Telegram?.WebApp?.initDataUnsafe?.user
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    return {
        name: u ? (u.username ? `@${u.username}` : u.first_name) : t('common.guest', { defaultValue: 'Guest' }),
        username: u?.username || '',
        emoji
    }
}

function useTimeAgo() {
    const { t } = useTranslation()
    return (dateStr: string) => {
        const diff = Date.now() - new Date(dateStr).getTime()
        const m = Math.floor(diff / 60000)
        if (m < 1) return t('community.just_now')
        if (m < 60) return t('community.min_ago', { n: m })
        const h = Math.floor(m / 60)
        if (h < 24) return t('community.hrs_ago', { n: h })
        return t('community.days_ago', { n: Math.floor(h / 24) })
    }
}

function StarRating({ value, onChange, size = 20 }: { value: number; onChange?: (v: number) => void; size?: number }) {
    return (
        <div style={{ display: 'flex', gap: '4px' }}>
            {[1, 2, 3, 4, 5].map(s => (
                <span
                    key={s}
                    onClick={() => onChange?.(s)}
                    style={{
                        fontSize: size, cursor: onChange ? 'pointer' : 'default',
                        filter: s <= value ? 'brightness(1.2)' : 'brightness(0.3)',
                        transition: 'filter 0.15s'
                    }}
                >⭐</span>
            ))}
        </div>
    )
}

// ─── DEMO DATA ────────────────────────────────────────────────────────────
const DEMO_JOBS: SupaJob[] = [
    {
        id: 'demo1', title: 'Deneyimli Garson Aranıyor', description: 'Kalacak yer sağlanır. Deneyimli, güler yüzlü bir çalışma arkadaşı arıyoruz.',
        city: 'İstanbul / Fatih', salary: '', employer_name: 'Sultanahmet Köftecisi', employer_emoji: '🏢',
        is_active: true, created_at: new Date(Date.now() - 3600000).toISOString(), applications_count: 7, job_type: 'listing'
    },
    {
        id: 'demo2', title: 'Şef Usta Olarak İş Arıyorum', description: '15 yıl döner ve kebap tecrübem var. Prestijli bir restoran veya otel arıyorum.',
        city: 'Konya', salary: '', employer_name: 'Chef_Mert_42', employer_emoji: '👨‍🍳',
        is_active: true, created_at: new Date(Date.now() - 7200000).toISOString(), applications_count: 3, job_type: 'seeking'
    },
    {
        id: 'demo3', title: 'BUGÜN Barista Lazım!', description: 'Acil! Bugün için deneyimli barista arıyoruz. Günlük ödeme yapılacaktır.',
        city: 'İzmir / Alsancak', salary: '', employer_name: 'Deniz Cafe & Bistro', employer_emoji: '☕',
        is_active: true, created_at: new Date(Date.now() - 1800000).toISOString(), applications_count: 12, job_type: 'today'
    }
]

const DEMO_REVIEWS: SupaReview[] = [
    {
        id: 'r1', business_name: 'XYZ Restaurant', city: 'İstanbul', rating: 4,
        salary_score: 3, environment_score: 5, management_score: 4,
        comment: 'Genel olarak iyi bir yer. Yönetim tutarsız ama ekip güzel.',
        user_name: '@mutfak_ustasi', user_emoji: '⭐', created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
        id: 'r2', business_name: 'Lüks Otel Mutfağı', city: 'Antalya', rating: 5,
        salary_score: 5, environment_score: 5, management_score: 4,
        comment: 'Harika bir çalışma ortamı. Maaşlar zamanında ödeniyor.',
        user_name: 'Aşçı_Ayşe', user_emoji: '👩‍🍳', created_at: new Date(Date.now() - 172800000).toISOString()
    }
]

// ─── Job Card ──────────────────────────────────────────────────────────────
function JobCard({ job, onApply }: { job: SupaJob; onApply: (job: SupaJob) => void }) {
    const { t } = useTranslation()
    const timeAgo = useTimeAgo()
    const typeColors: Record<string, string> = {
        listing: '#f59e0b',
        seeking: '#3b82f6',
        today: '#ef4444'
    }
    const typeLabels: Record<string, string> = {
        listing: t('jobs.types.listing'),
        seeking: t('jobs.types.seeking'),
        today: t('jobs.types.today')
    }
    const color = typeColors[job.job_type] || '#f59e0b'

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
                background: job.job_type === 'today'
                    ? 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04))'
                    : 'rgba(255,255,255,0.025)',
                border: `1px solid ${color}30`,
                borderRadius: '18px',
                padding: '16px',
                marginBottom: '12px',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {job.job_type === 'today' && (
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                    background: 'linear-gradient(90deg, #ef4444, #f97316)'
                }} />
            )}

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                    width: 44, height: 44, borderRadius: '12px',
                    background: `${color}20`, border: `1px solid ${color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px', flexShrink: 0
                }}>
                    {job.employer_emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: '14px', color: '#fff', marginBottom: '2px' }}>{job.title}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{job.employer_name} • {timeAgo(job.created_at)}</div>
                </div>
                <div style={{
                    background: color, color: '#000', borderRadius: '8px',
                    padding: '4px 8px', fontSize: '9px', fontWeight: 900,
                    flexShrink: 0
                }}>
                    {typeLabels[job.job_type] || 'LAN'}
                </div>
            </div>

            <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '12px' }}>{job.description}</p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px 10px', fontSize: '11px', color: '#94a3b8' }}>
                    📍 {job.city}
                </span>
                {job.salary && (
                    <span style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', padding: '4px 10px', fontSize: '11px', color: '#10b981', fontWeight: 700 }}>
                        💰 {job.salary}
                    </span>
                )}
                {(job.applications_count || 0) > 0 && (
                    <span style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '8px', padding: '4px 10px', fontSize: '11px', color: '#64748b' }}>
                        👥 {job.applications_count} başvuru
                    </span>
                )}
            </div>

            <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => onApply(job)}
                style={{
                    width: '100%',
                    background: job.job_type === 'today'
                        ? 'linear-gradient(135deg, #ef4444, #dc2626)'
                        : `linear-gradient(135deg, ${color}, ${color}cc)`,
                    color: '#000', border: 'none', borderRadius: '12px',
                    padding: '12px', fontSize: '13px', fontWeight: 800,
                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: '8px'
                }}
            >
                {job.job_type === 'seeking' ? '💬 Mesaj Gönder' : job.job_type === 'today' ? '⚡ Hemen Katıl' : '📩 Başvur'}
            </motion.button>
        </motion.div>
    )
}

// ─── Apply Modal ──────────────────────────────────────────────────────────
function ApplyModal({ job, onClose, onSuccess }: { job: SupaJob; onClose: () => void; onSuccess: () => void }) {
    const { t } = useTranslation()
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)

    async function handleApply() {
        if (!message.trim()) return
        setSending(true)
        const user = getTgUser(t)

        // ALWAYS redirect to Telegram if employer username exists, so the exact message goes to the employer directly!
        if (job.employer_username) {
            const helloMsg = t('jobs.actions.tg_greeting', { defaultValue: 'Merhaba, "{{title}}" ilanı için ulaşıyorum:\n\n' }).replace('{{title}}', job.title)
            const safeMsg = encodeURIComponent(`${helloMsg}${message}`)
            const link = `https://t.me/${job.employer_username.replace('@', '')}?text=${safeMsg}`
            if (window.Telegram?.WebApp) window.Telegram.WebApp.openLink(link)
            else window.open(link, '_blank')
        } else {
            await applyToJob({
                job_id: job.id,
                user_name: user.name,
                user_emoji: user.emoji,
                user_username: user.username,
                message
            })
        }

        setSending(false)
        onSuccess()
        onClose()
        const msgStr = job.employer_username ? t('jobs.actions.tg_redirect') : t('jobs.actions.success_apply')
        if (window.Telegram?.WebApp?.showAlert) {
            window.Telegram.WebApp.showAlert(msgStr)
        } else {
            alert(msgStr)
        }
    }

    return (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={onClose}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', zIndex: 3000 }} />
            <motion.div
                initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                style={{
                    position: 'fixed', bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(180deg, #111420, #0d1020)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '24px 24px 0 0',
                    padding: '24px 20px 40px', zIndex: 3001
                }}
            >
                <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2, margin: '0 auto 20px' }} />
                <h3 style={{ margin: '0 0 6px', fontSize: '16px' }}>📩 {job.title}</h3>
                <p style={{ margin: '0 0 16px', color: '#64748b', fontSize: '12px' }}>{job.employer_name} • {job.city}</p>

                <textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder={job.job_type === 'today' ? 'Neden katılmak istiyorsunuz? (Kısa bir not)' : 'Başvuru mesajınızı yazın... Deneyimlerinizi, pozisyonu neden istediğinizi kısaca belirtin.'}
                    rows={4}
                    style={{
                        width: '100%', background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px',
                        padding: '14px', fontSize: '14px', color: '#fff',
                        outline: 'none', resize: 'none', marginBottom: '14px',
                        boxSizing: 'border-box', fontFamily: 'inherit'
                    }}
                />

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={onClose} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', borderRadius: '12px', padding: '14px', fontSize: '14px', cursor: 'pointer' }}>
                        İptal
                    </button>
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={handleApply}
                        disabled={!message.trim() || sending}
                        style={{
                            flex: 2, background: message.trim() ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255,255,255,0.05)',
                            color: message.trim() ? '#000' : '#64748b', border: 'none',
                            borderRadius: '12px', padding: '14px', fontSize: '14px',
                            fontWeight: 800, cursor: 'pointer'
                        }}
                    >
                        {sending ? '⏳ Gönderiliyor...' : '🚀 Başvur (+2 TASTE)'}
                    </motion.button>
                </div>
            </motion.div>
        </>
    )
}

// ─── Add Job Form ─────────────────────────────────────────────────────────
function AddJobForm({ onSuccess, onBack }: { onSuccess: () => void; onBack: () => void }) {
    const { t } = useTranslation()
    const [jobType, setJobType] = useState<'listing' | 'seeking' | 'today'>('listing')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [city, setCity] = useState('')
    const [salary, setSalary] = useState('')
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit() {
        if (!title.trim() || !description.trim() || !city) return
        setSubmitting(true)
        const user = getTgUser(t)

        await insertJob({
            title,
            description,
            city,
            salary,
            employer_name: user.name,
            employer_emoji: user.emoji,
            employer_username: user.username,
            is_active: true,
            job_type: jobType
        })

        setSubmitting(false)
        onSuccess()

        const msg = t('jobs.actions.success_listing')
        if (window.Telegram?.WebApp?.showAlert) window.Telegram.WebApp.showAlert(msg)
        else alert(msg)
    }

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#f59e0b', fontSize: '14px', cursor: 'pointer', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                ← Geri
            </button>
            <h2 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 900 }}>📋 İlan Ekle</h2>

            {/* İlan tipi seç */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '16px' }}>
                {([
                    { type: 'listing', emoji: '📢', label: 'Eleman Arıyorum', color: '#f59e0b' },
                    { type: 'seeking', emoji: '🙋', label: 'İş Arıyorum', color: '#3b82f6' },
                    { type: 'today', emoji: '⚡', label: 'Bugün Lazım', color: '#ef4444' },
                ] as const).map(t => (
                    <motion.button key={t.type} whileTap={{ scale: 0.93 }}
                        onClick={() => setJobType(t.type)}
                        style={{
                            background: jobType === t.type ? `${t.color}20` : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${jobType === t.type ? t.color : 'rgba(255,255,255,0.08)'}`,
                            borderRadius: '12px', padding: '12px 6px', cursor: 'pointer',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                            color: jobType === t.type ? t.color : '#64748b'
                        }}
                    >
                        <span style={{ fontSize: '20px' }}>{t.emoji}</span>
                        <span style={{ fontSize: '10px', fontWeight: 700 }}>{t.label}</span>
                    </motion.button>
                ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                    value={title} onChange={e => setTitle(e.target.value)}
                    placeholder={t('jobs.placeholders.title')}
                    style={{
                        background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px', padding: '14px', fontSize: '14px',
                        color: '#fff', outline: 'none', boxSizing: 'border-box', width: '100%'
                    }}
                />
                <textarea
                    value={description} onChange={e => setDescription(e.target.value)}
                    placeholder={t('jobs.placeholders.desc')}
                    rows={3}
                    style={{
                        background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px', padding: '14px', fontSize: '14px', color: '#fff',
                        outline: 'none', resize: 'none', boxSizing: 'border-box',
                        width: '100%', fontFamily: 'inherit'
                    }}
                />
                <select
                    value={city} onChange={e => setCity(e.target.value)}
                    style={{
                        background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px', padding: '14px', fontSize: '14px',
                        color: city ? '#fff' : '#64748b', outline: 'none', width: '100%'
                    }}
                >
                    <option value="">{t('jobs.placeholders.city_opt')}</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                    value={salary} onChange={e => setSalary(e.target.value)}
                    placeholder={t('jobs.placeholders.salary')}
                    style={{
                        background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '12px', padding: '14px', fontSize: '14px',
                        color: '#fff', outline: 'none', boxSizing: 'border-box', width: '100%'
                    }}
                />
            </div>

            <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={!title.trim() || !description.trim() || !city || submitting}
                style={{
                    width: '100%',
                    background: (title.trim() && description.trim() && city) ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255,255,255,0.05)',
                    color: (title.trim() && description.trim() && city) ? '#000' : '#64748b',
                    border: 'none', borderRadius: '14px', padding: '16px',
                    fontSize: '15px', fontWeight: 800, cursor: 'pointer',
                    boxShadow: (title.trim()) ? '0 4px 16px rgba(245,158,11,0.3)' : 'none'
                }}
            >
                {submitting ? t('jobs.actions.publishing') : t('jobs.actions.submit')}
            </motion.button>
        </motion.div>
    )
}

// ─── Reviews View ─────────────────────────────────────────────────────────
function ReviewsView({ onAddReview }: { onAddReview: () => void }) {
    const { t } = useTranslation()
    const timeAgo = useTimeAgo()
    const [reviews, setReviews] = useState<SupaReview[]>(DEMO_REVIEWS)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getReviews().then(r => {
            setReviews(r.length > 0 ? r : DEMO_REVIEWS)
            setLoading(false)
        })
    }, [])

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 900 }}>⭐ {t('jobs.reviews.title')}</h2>
                <motion.button
                    whileTap={{ scale: 0.94 }}
                    onClick={onAddReview}
                    style={{
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        color: '#000', border: 'none', borderRadius: '12px',
                        padding: '10px 16px', fontSize: '12px', fontWeight: 900, cursor: 'pointer'
                    }}
                >
                    {t('jobs.actions.add_review', { defaultValue: '+ Yorum Yap' })}
                </motion.button>
            </div>

            <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '14px', padding: '12px', marginBottom: '16px', fontSize: '12px', color: '#94a3b8' }}>
                <Trans i18nKey="jobs.reviews.tip">
                    {t('jobs.reviews.tip')}
                </Trans>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>{t('jobs.loading', { defaultValue: '⏳ Yükleniyor...' })}</div>
            ) : (
                reviews.map(r => (
                    <motion.div
                        key={r.id}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px', marginBottom: '12px' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: '15px', color: '#fff' }}>{r.business_name}</div>
                                <div style={{ fontSize: '11px', color: '#64748b' }}>{r.user_emoji} {r.user_name} • {r.city} • {timeAgo(r.created_at)}</div>
                            </div>
                            <StarRating value={r.rating} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '12px' }}>
                            {[
                                { label: 'Maaş', score: r.salary_score },
                                { label: 'Ortam', score: r.environment_score },
                                { label: 'Yönetim', score: r.management_score }
                            ].map(s => (
                                <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '8px', textAlign: 'center' }}>
                                    <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '4px' }}>{s.label}</div>
                                    <StarRating value={s.score || 0} size={12} />
                                </div>
                            ))}
                        </div>

                        <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>{r.comment}</p>
                    </motion.div>
                ))
            )}
        </motion.div>
    )
}

// ─── Add Review Form ──────────────────────────────────────────────────────
function AddReviewForm({ onSuccess, onBack }: { onSuccess: () => void; onBack: () => void }) {
    const { t } = useTranslation()
    const [businessName, setBusinessName] = useState('')
    const [city, setCity] = useState('')
    const [rating, setRating] = useState(0)
    const [salaryScore, setSalaryScore] = useState(0)
    const [envScore, setEnvScore] = useState(0)
    const [mgmtScore, setMgmtScore] = useState(0)
    const [comment, setComment] = useState('')
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit() {
        if (!businessName.trim() || !comment.trim() || rating === 0) return
        setSubmitting(true)
        const user = getTgUser(t)

        await insertReview({
            business_name: businessName,
            city,
            rating,
            salary_score: salaryScore || undefined,
            environment_score: envScore || undefined,
            management_score: mgmtScore || undefined,
            comment,
            user_name: user.name,
            user_emoji: user.emoji,
            user_username: user.username
        })

        setSubmitting(false)
        onSuccess()
        const msg = 'Yorumun yayınlandı! +5 TASTE kazandın 🎉'
        if (window.Telegram?.WebApp?.showAlert) window.Telegram.WebApp.showAlert(msg)
        else alert(msg)
    }

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#f59e0b', fontSize: '14px', cursor: 'pointer', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                ← {t('jobs.actions.back')}
            </button>
            <h2 style={{ margin: '0 0 20px', fontSize: '18px', fontWeight: 900 }}>⭐ {t('jobs.actions.add_review')}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                <input value={businessName} onChange={e => setBusinessName(e.target.value)}
                    placeholder={t('jobs.placeholders.business_name')}
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px', fontSize: '14px', color: '#fff', outline: 'none', boxSizing: 'border-box', width: '100%' }} />
                <select value={city} onChange={e => setCity(e.target.value)}
                    style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px', fontSize: '14px', color: city ? '#fff' : '#64748b', outline: 'none', width: '100%' }}>
                    <option value="">📍 {t('jobs.placeholders.city_opt')}</option>
                    {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Genel Puan */}
            <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '14px', padding: '14px', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b', marginBottom: '8px' }}>GENEL PUAN</div>
                <StarRating value={rating} onChange={setRating} size={28} />
            </div>

            {/* Detay Puanları */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '16px' }}>
                {[
                    { label: '💰 Maaş', value: salaryScore, onChange: setSalaryScore },
                    { label: '🌿 Ortam', value: envScore, onChange: setEnvScore },
                    { label: '👔 Yönetim', value: mgmtScore, onChange: setMgmtScore }
                ].map(s => (
                    <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '6px' }}>{s.label}</div>
                        <StarRating value={s.value} onChange={s.onChange} size={14} />
                    </div>
                ))}
            </div>

            <textarea value={comment} onChange={e => setComment(e.target.value)}
                placeholder={t('jobs.placeholders.review_msg')}
                rows={4}
                style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '14px', fontSize: '14px', color: '#fff', outline: 'none', resize: 'none', marginBottom: '16px', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6 }}
            />

            <motion.button whileTap={{ scale: 0.97 }} onClick={handleSubmit}
                disabled={!businessName.trim() || !comment.trim() || rating === 0 || submitting}
                style={{
                    width: '100%',
                    background: (businessName.trim() && comment.trim() && rating > 0) ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255,255,255,0.05)',
                    color: (businessName.trim() && comment.trim() && rating > 0) ? '#000' : '#64748b',
                    border: 'none', borderRadius: '14px', padding: '16px',
                    fontSize: '15px', fontWeight: 800, cursor: 'pointer'
                }}
            >
                {submitting ? t('jobs.actions.saving') : t('jobs.actions.submit_review')}
            </motion.button>
        </motion.div>
    )
}

// ─── Profile / CV View ────────────────────────────────────────────────────
function ProfileView() {
    const { t } = useTranslation()
    const timeAgo = useTimeAgo()
    const [profiles, setProfiles] = useState<SupaProfile[]>([])
    const [showForm, setShowForm] = useState(false)
    const [profession, setProfession] = useState('')
    const [experience, setExperience] = useState('')
    const [bio, setBio] = useState('')
    const [city, setCity] = useState('')
    const [skills, setSkills] = useState<string[]>([])
    const [photo, setPhoto] = useState<string>('')
    const [saving, setSaving] = useState(false)

    const SKILL_OPTIONS = ['Izgara', 'Tatlı', 'Pasta & Börek', 'Seafood', 'Vegan Mutfak', 'Fast Food', 'Fast-Casual', 'Fine Dining', 'Kahve & Barista', 'Et Ürünleri', 'Sushi', 'Pizza']

    useEffect(() => {
        getProfiles().then(p => setProfiles(p))
    }, [])

    async function handleSaveProfile() {
        if (!profession) return
        setSaving(true)
        const user = getTgUser(t)

        const starLevel = (pts: number) => {
            if (pts >= 100) return 5
            if (pts >= 50) return 4
            if (pts >= 20) return 3
            if (pts >= 5) return 2
            return 1
        }

        await upsertProfile({
            user_name: user.name,
            user_emoji: user.emoji,
            user_username: user.username,
            profession,
            experience,
            bio,
            city,
            skills,
            photo_url: photo,
            stars: starLevel(10), // default
            taste_points: 10
        })

        // Also publish as a "Seeking" job so it appears on the TasteJobs list!
        await insertJob({
            title: profession,
            description: `${experience ? experience + ' deneyim.' : ''} ${bio}`,
            city: city || 'Belirtilmemiş',
            salary: 'Belirtilecek',
            employer_name: user.name,
            employer_emoji: user.emoji,
            employer_username: user.username,
            is_active: true,
            job_type: 'seeking'
        })

        const p = await getProfiles()
        setProfiles(p)
        setSaving(false)
        setShowForm(false)
        const msg = 'CV\'n yayınlandı! Diğer üyeler seni görebilir 🎉'
        if (window.Telegram?.WebApp?.showAlert) window.Telegram.WebApp.showAlert(msg)
        else alert(msg)
    }

    function toggleSkill(s: string) {
        setSkills(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 900 }}>👤 Profiller & CV</h2>
                <motion.button whileTap={{ scale: 0.94 }} onClick={() => setShowForm(!showForm)}
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', border: 'none', borderRadius: '12px', padding: '10px 16px', fontSize: '12px', fontWeight: 900, cursor: 'pointer' }}>
                    {showForm ? '← Liste' : '+ CV Ekle'}
                </motion.button>
            </div>

            {showForm ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <select value={profession} onChange={e => setProfession(e.target.value)}
                        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px', fontSize: '14px', color: profession ? '#fff' : '#64748b', outline: 'none', width: '100%' }}>
                        <option value="">Meslek seçin</option>
                        {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <input value={experience} onChange={e => setExperience(e.target.value)}
                        placeholder="Deneyim (örn: 5 yıl)" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px', fontSize: '14px', color: '#fff', outline: 'none', boxSizing: 'border-box', width: '100%' }} />
                    <select value={city} onChange={e => setCity(e.target.value)}
                        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px', fontSize: '14px', color: city ? '#fff' : '#64748b', outline: 'none', width: '100%' }}>
                        <option value="">Şehir (opsiyonel)</option>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <textarea value={bio} onChange={e => setBio(e.target.value)}
                        placeholder="Kısa biyografi..." rows={3}
                        style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px', fontSize: '14px', color: '#fff', outline: 'none', resize: 'none', boxSizing: 'border-box', width: '100%', fontFamily: 'inherit' }} />

                    {/* Fotoğraf Ekleme */}
                    <div>
                        <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>📸 Profil Fotoğrafı</div>
                        <label style={{ display: 'block', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '14px', textAlign: 'center', cursor: 'pointer', color: '#f59e0b', fontSize: '14px', fontWeight: 700 }}>
                            {photo ? '✅ Fotoğraf Seçildi (Değiştir)' : '📷 Galeriden Fotoğraf Seç'}
                            <input type="file" accept="image/*" style={{ display: 'none' }}
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        const r = new FileReader()
                                        r.onload = ev => setPhoto(ev.target?.result as string)
                                        r.readAsDataURL(file)
                                    }
                                }}
                            />
                        </label>
                        {photo && <img src={photo} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%', marginTop: '10px', display: 'block' }} />}
                    </div>

                    <div>
                        <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>🛠️ Yetenekler</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {SKILL_OPTIONS.map(s => (
                                <motion.button key={s} whileTap={{ scale: 0.94 }} onClick={() => toggleSkill(s)}
                                    style={{ background: skills.includes(s) ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${skills.includes(s) ? 'rgba(245,158,11,0.5)' : 'rgba(255,255,255,0.08)'}`, color: skills.includes(s) ? '#f59e0b' : '#64748b', borderRadius: '20px', padding: '5px 12px', fontSize: '12px', cursor: 'pointer' }}>
                                    {s}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    <motion.button whileTap={{ scale: 0.97 }} onClick={handleSaveProfile}
                        disabled={!profession || saving}
                        style={{ background: profession ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255,255,255,0.05)', color: profession ? '#000' : '#64748b', border: 'none', borderRadius: '14px', padding: '16px', fontSize: '15px', fontWeight: 800, cursor: 'pointer' }}>
                        {saving ? t('jobs.actions.saving') : t('jobs.actions.submit_cv')}
                    </motion.button>
                </div>
            ) : (
                <>
                    {profiles.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                            <div style={{ fontSize: '48px', marginBottom: '12px' }}>👤</div>
                            <div style={{ fontWeight: 700 }}>{t('jobs.no_profiles')}</div>
                            <div style={{ fontSize: '12px', marginTop: '4px' }}>{t('jobs.be_first_cv')}</div>
                        </div>
                    ) : (
                        profiles.map(p => (
                            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '16px', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                                        {p.user_emoji}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 800, fontSize: '14px' }}>{p.user_name}</div>
                                        <div style={{ fontSize: '12px', color: '#f59e0b', fontWeight: 700 }}>{p.profession}</div>
                                        <div style={{ display: 'flex', gap: '4px', marginTop: '2px' }}>
                                            {Array.from({ length: p.stars }).map((_, i) => <span key={i} style={{ fontSize: '10px' }}>⭐</span>)}
                                        </div>
                                    </div>
                                    {p.photo_url && (
                                        <img src={p.photo_url} alt="" style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                                    )}
                                    {p.city && <span style={{ fontSize: '11px', color: '#64748b', marginLeft: 'auto' }}>📍 {p.city}</span>}
                                </div>
                                {p.bio && <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '10px', lineHeight: 1.5 }}>{p.bio}</p>}
                                {p.skills.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                                        {p.skills.map(s => (
                                            <span key={s} style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '20px', padding: '3px 10px', fontSize: '10px', color: '#f59e0b' }}>{s}</span>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </>
            )}
        </motion.div>
    )
}

// ─── Feed Types & Helpers ────────────────────────────────────────────────
type PostType = 'yemek' | 'tarif' | 'menu'
function getPostMeta(t: any): Record<PostType, { emoji: string; label: string; color: string }> {
    return {
        yemek: { emoji: '🍽️', label: t('jobs.feed.types.food'), color: '#f97316' },
        tarif: { emoji: '📖', label: t('jobs.feed.types.recipe'), color: '#22c55e' },
        menu:  { emoji: '🏪', label: t('jobs.feed.types.menu'), color: '#818cf8' },
    }
}

function mapFeedPost(sp: SupaPost) {
    return {
        id: sp.id,
        type: (sp.type as PostType) || 'yemek',
        authorName: sp.author_name,
        authorEmoji: sp.author_emoji,
        createdAt: new Date(sp.created_at).getTime(),
        text: sp.text,
        photo: sp.photo as string | undefined,
        tags: sp.tags || [],
        likes: sp.likes || 0,
        recipeTitle: sp.recipe_title as string | undefined,
        venueName: sp.venue_name as string | undefined,
        city: sp.city || '',
    }
}

// ─── Feed View ─────────────────────────────────────────────────────────────
function FeedView() {
    const { t } = useTranslation()
    const timeAgo = useTimeAgo()
    const POST_META = getPostMeta(t)
    const [posts, setPosts] = useState<ReturnType<typeof mapFeedPost>[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreate, setShowCreate] = useState(false)
    const [cType, setCType] = useState<PostType>('yemek')
    const [cText, setCText] = useState('')
    const [cCity, setCCity] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [likedIds, setLikedIds] = useState<Set<string>>(new Set())

    useEffect(() => {
        getPosts().then(p => {
            setPosts(p.filter(x => ['yemek', 'tarif', 'menu'].includes(x.type)).map(mapFeedPost))
            setLoading(false)
        })
    }, [])

    async function handleLike(id: string) {
        if (likedIds.has(id)) return
        setLikedIds(prev => new Set([...prev, id]))
        setPosts(prev => {
            const updated = prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p)
            const post = updated.find(p => p.id === id)
            if (post) updatePostLikes(id, post.likes).catch(() => {})
            return updated
        })
    }

    async function handleSubmit() {
        if (!cText.trim()) return
        setSubmitting(true)
        const user = getTgUser(t)
        const saved = await insertPost({
            type: cType, author_name: user.name, author_emoji: user.emoji,
            author_username: user.username, text: cText, tags: [],
            city: cCity || undefined, likes: 0
        })
        const newPost = saved ? mapFeedPost(saved) : {
            id: 'local-' + Date.now(), type: cType,
            authorName: user.name, authorEmoji: user.emoji,
            createdAt: Date.now(), text: cText, tags: [],
            city: cCity, likes: 0, photo: undefined, recipeTitle: undefined, venueName: undefined
        }
        setPosts(prev => [newPost as any, ...prev])
        setCText(''); setCCity(''); setSubmitting(false); setShowCreate(false)
        const msg = t('jobs.feed.success_post')
        if (window.Telegram?.WebApp?.showAlert) window.Telegram.WebApp.showAlert(msg)
        else alert(msg)
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => setShowCreate(true)}
                style={{ width: '100%', background: 'linear-gradient(135deg, rgba(249,115,22,0.12), rgba(249,115,22,0.04))', border: '1px dashed rgba(249,115,22,0.4)', borderRadius: '16px', padding: '14px', marginBottom: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}
            >
                <span style={{ fontSize: '24px' }}>🎁</span>
                <div style={{ textAlign: 'left', flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#f97316' }}>🚀 PAYLAŞ & 5 TASTE KAZAN!</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>Yemek / Tarif / Menü paylaş → TG grubuna gönder → kazan!</div>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff', padding: '6px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 900, flexShrink: 0, textAlign: 'center' }}>+5<br/>TASTE</div>
            </motion.button>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>⏳ Yükleniyor...</div>
            ) : posts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🍽️</div>
                    <div style={{ fontWeight: 700 }}>Henüz paylaşım yok</div>
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>İlk paylaşımı sen yap!</div>
                </div>
            ) : posts.map(post => {
                const meta = POST_META[post.type] || POST_META.yemek
                return (
                    <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '18px', overflow: 'hidden', marginBottom: '12px' }}
                    >
                        {post.photo && <img src={post.photo} alt="" style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }} />}
                        <div style={{ padding: '14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <div style={{ width: 40, height: 40, borderRadius: '12px', background: `${meta.color}20`, border: `1px solid ${meta.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>{post.authorEmoji}</div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 800, fontSize: '13px' }}>{post.authorName}</div>
                                    <div style={{ fontSize: '10px', color: '#64748b' }}>
                                        {timeAgo(new Date(post.createdAt).toISOString())}
                                        {post.city && <span style={{ color: meta.color }}> • 📍 {post.city}</span>}
                                    </div>
                                </div>
                                <div style={{ background: `${meta.color}20`, color: meta.color, borderRadius: '8px', padding: '3px 8px', fontSize: '9px', fontWeight: 800 }}>{meta.emoji} {meta.label}</div>
                            </div>
                            {post.recipeTitle && <div style={{ fontSize: '14px', fontWeight: 800, color: '#22c55e', marginBottom: '6px' }}>📖 {post.recipeTitle}</div>}
                            {post.venueName && <div style={{ fontSize: '13px', fontWeight: 700, color: '#818cf8', marginBottom: '6px' }}>🏪 {post.venueName}</div>}
                            <p style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '10px' }}>{post.text}</p>
                            <motion.button whileTap={{ scale: 0.9 }} onClick={() => handleLike(post.id)}
                                style={{ background: likedIds.has(post.id) ? 'rgba(239,68,68,0.15)' : 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', borderRadius: '10px', padding: '6px 14px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                                ❤️ {post.likes}
                            </motion.button>
                        </div>
                    </motion.div>
                )
            })}

            <AnimatePresence>
                {showCreate && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowCreate(false)}
                            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', zIndex: 3000 }} />
                        <motion.div
                            initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'linear-gradient(180deg, #111420, #0d1020)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px 24px 0 0', padding: '24px 20px 40px', zIndex: 3001, maxHeight: '85vh', overflowY: 'auto' }}
                        >
                            <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.15)', borderRadius: 2, margin: '0 auto 20px' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>✨ Yeni Paylaşım</div>
                                <button onClick={() => setShowCreate(false)} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#94a3b8', borderRadius: '10px', width: '36px', height: '36px', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '14px' }}>
                                {(['yemek', 'tarif', 'menu'] as PostType[]).map(tp => {
                                    const m = POST_META[tp]; const active = cType === tp
                                    return (
                                        <button key={tp} onClick={() => setCType(tp)} style={{ background: active ? `${m.color}20` : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? m.color : 'rgba(255,255,255,0.08)'}`, color: active ? m.color : '#64748b', borderRadius: '12px', padding: '10px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                            <span style={{ fontSize: '20px' }}>{m.emoji}</span>
                                            <span style={{ fontSize: '11px', fontWeight: 700 }}>{m.label}</span>
                                        </button>
                                    )
                                })}
                            </div>
                            <input value={cCity} onChange={e => setCCity(e.target.value)} placeholder="📍 Şehir / Semt (opsiyonel)"
                                style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '11px 14px', fontSize: '13px', color: '#fff', outline: 'none', marginBottom: '10px', boxSizing: 'border-box' }} />
                            <textarea value={cText} onChange={e => setCText(e.target.value)} rows={4}
                                placeholder={cType === 'yemek' ? 'Yediğin yemeği anlat...' : cType === 'tarif' ? 'Tarifini paylaş...' : 'Menünü anlat...'}
                                style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '11px 14px', fontSize: '13px', color: '#fff', outline: 'none', resize: 'none', marginBottom: '14px', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6 }} />
                            <button onClick={handleSubmit} disabled={!cText.trim() || submitting}
                                style={{ width: '100%', background: cText.trim() ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255,255,255,0.05)', color: cText.trim() ? '#000' : '#64748b', border: 'none', borderRadius: '14px', padding: '14px', fontSize: '14px', fontWeight: 800, cursor: 'pointer' }}>
                                {submitting ? '⏳ Paylaşılıyor...' : '🚀 Paylaş'}
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────
export function TasteJobs() {
    const { t, i18n } = useTranslation()
    const isTr = i18n.language?.startsWith('tr')

    const [view, setView] = useState<JobView>('feed')
    const [jobs, setJobs] = useState<SupaJob[]>(DEMO_JOBS)
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'listing' | 'seeking' | 'today'>('all')
    const [applyingTo, setApplyingTo] = useState<SupaJob | null>(null)

    useEffect(() => {
        getJobs().then(j => {
            setJobs(j.length > 0 ? j : DEMO_JOBS)
            setLoading(false)
        })
    }, [])

    function refreshJobs() {
        getJobs().then(j => setJobs(j.length > 0 ? j : DEMO_JOBS))
    }

    const filtered = jobs.filter(j => filter === 'all' || j.job_type === filter)

    const todayCount = jobs.filter(j => j.job_type === 'today').length
    const listingCount = jobs.filter(j => j.job_type === 'listing').length
    const seekingCount = jobs.filter(j => j.job_type === 'seeking').length

    return (
        <div style={{ paddingBottom: '10px' }}>

            {/* ── Header ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{
                    width: 48, height: 48, borderRadius: '14px',
                    background: 'linear-gradient(135deg, rgba(245,158,11,0.3), rgba(245,158,11,0.1))',
                    border: '1px solid rgba(245,158,11,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px'
                }}>
                    🧑‍🍳
                </div>
                <div>
                    <div style={{ fontWeight: 900, fontSize: '18px' }}>TASTE Jobs</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {isTr ? 'Gastronomi Sektöründe Kariyer' : 'Gastronomy Career Platform'}
                    </div>
                </div>
            </div>

            {/* ── Tab Navigation ── */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '16px', padding: '4px', gap: '4px', marginBottom: '20px', overflowX: 'auto' }}>
                {[
                    { id: 'feed', emoji: '🍽️', label: 'Akış' },
                    { id: 'board', emoji: '📋', label: 'İlanlar' },
                    { id: 'reviews', emoji: '⭐', label: 'Yorumlar' },
                    { id: 'profile', emoji: '👤', label: 'Profiller' },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setView(tab.id as JobView)}
                        style={{
                            flex: 1, minWidth: '70px', padding: '10px 8px',
                            borderRadius: '12px', border: 'none',
                            background: view === tab.id ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                            color: view === tab.id ? '#000' : '#64748b',
                            fontWeight: 800, fontSize: '11px', cursor: 'pointer',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px'
                        }}
                    >
                        <span style={{ fontSize: '16px' }}>{tab.emoji}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Stats ── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '16px' }}>
                {[
                    { icon: '📢', value: listingCount, label: 'listing', color: '#f59e0b' },
                    { icon: '🙋', value: seekingCount, label: 'seeking', color: '#3b82f6' },
                    { icon: '⚡', value: todayCount, label: 'today', color: '#ef4444' },
                ].map(s => (
                    <div key={s.label} style={{ background: `${s.color}08`, border: `1px solid ${s.color}20`, borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                        <div style={{ fontSize: '18px' }}>{s.icon}</div>
                        <div style={{ fontSize: '18px', fontWeight: 900, color: s.color }}>{s.value}</div>
                        <div style={{ fontSize: '9px', color: '#64748b', textTransform: 'uppercase' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* ── Content ── */}
            <AnimatePresence mode="wait">
                {view === 'feed' && (
                    <motion.div key="feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <FeedView />
                    </motion.div>
                )}
                {(view === 'board' || view === 'today') && (
                    <motion.div key="board" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                        {/* Add Job Button */}
                        <motion.button whileTap={{ scale: 0.96 }}
                            onClick={() => setView('add_job')}
                            style={{
                                width: '100%', background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))',
                                border: '1px dashed rgba(245,158,11,0.4)', borderRadius: '16px',
                                padding: '14px', marginBottom: '16px', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                            }}
                        >
                            <span style={{ fontSize: '20px' }}>➕</span>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: '13px', fontWeight: 800, color: '#f59e0b' }}>{t('jobs.actions.add_job')}</div>
                                <div style={{ fontSize: '10px', color: '#64748b' }}>{t('jobs.actions.add_job_desc')}</div>
                            </div>
                        </motion.button>

                        {/* Filter pills */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
                            {([
                                { id: 'all', emoji: '✨', label: t('jobs.filters.all') },
                                { id: 'listing', emoji: '📢', label: t('jobs.types.listing_short') },
                                { id: 'seeking', emoji: '🙋', label: t('jobs.types.seeking_short') },
                                { id: 'today', emoji: '⚡', label: t('jobs.types.today_short') },
                            ] as const).map(f => (
                                <motion.button key={f.id} whileTap={{ scale: 0.94 }}
                                    onClick={() => setFilter(f.id)}
                                    style={{
                                        background: filter === f.id ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.03)',
                                        border: `1px solid ${filter === f.id ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.07)'}`,
                                        color: filter === f.id ? '#f59e0b' : '#64748b',
                                        borderRadius: '20px', padding: '6px 14px', fontSize: '12px',
                                        fontWeight: 700, cursor: 'pointer', flexShrink: 0
                                    }}
                                >
                                    {f.emoji} {f.label}
                                </motion.button>
                            ))}
                        </div>

                        {/* "Bugün" acil banner */}
                        {view === 'today' || filter === 'today' ? (
                            <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04))', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '14px', padding: '12px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '24px' }}>⚡</span>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '13px', color: '#ef4444' }}>{t('jobs.today_banner.title')}</div>
                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{t('jobs.today_banner.desc')}</div>
                                </div>
                            </div>
                        ) : null}

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>{t('jobs.loading')}</div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🧑‍🍳</div>
                        <div style={{ fontWeight: 700 }}>{t('jobs.no_jobs')}</div>
                        <div style={{ fontSize: '12px', marginTop: '4px' }}>{t('jobs.be_first')}</div>
                    </div>
                ) : (
                    filtered.map(job => <JobCard key={job.id} job={job} onApply={setApplyingTo} />)
                )}
                    </motion.div>
                )}

                {view === 'add_job' && (
                    <motion.div key="add-job" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <AddJobForm onSuccess={refreshJobs} onBack={() => setView('board')} />
                    </motion.div>
                )}

                {view === 'reviews' && (
                    <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <ReviewsView onAddReview={() => setView('add_review')} />
                    </motion.div>
                )}

                {view === 'add_review' && (
                    <motion.div key="add-review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <AddReviewForm onSuccess={() => setView('reviews')} onBack={() => setView('reviews')} />
                    </motion.div>
                )}

                {view === 'profile' && (
                    <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <ProfileView />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Apply Modal */}
            <AnimatePresence>
                {applyingTo && (
                    <ApplyModal
                        job={applyingTo}
                        onClose={() => setApplyingTo(null)}
                        onSuccess={refreshJobs}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}
