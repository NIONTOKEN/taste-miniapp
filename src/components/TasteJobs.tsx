import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
    getJobs, insertJob, applyToJob, getReviews, insertReview, getProfiles, upsertProfile,
    type SupaJob, type SupaReview, type SupaProfile
} from '../services/supabase'
import { Search, MapPin, Briefcase, Star, Building, ArrowRight, MessageCircle, Clock, Users, PlusCircle, CheckCircle2 } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────
type JobView = 'board' | 'add_job' | 'reviews' | 'profile' | 'add_review'

// ─── Constants ────────────────────────────────────────────────────────────
const CITIES = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Adana', 'Konya', 'Gaziantep', 'Mersin', 'Kayseri', 'Diğer', 'Yurt Dışı']
const PROFESSIONS = ['Aşçı / Şef', 'Pastane Ustası', 'Garson', 'Barmen / Barista', 'Kasap', 'Fırıncı', 'Mutfak Yardımcısı', 'Komi', 'Restoran Müdürü', 'Dondurma Ustası', 'Diğer']
const EMOJIS = ['👨‍🍳', '👩‍🍳', '🧑‍🍳', '🏢', '☕', '🔪', '🍽️', '🥘', '🫕', '🍳']

function getTgUser() {
    const u = window.Telegram?.WebApp?.initDataUnsafe?.user
    const emoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    return {
        name: u ? (u.username ? `@${u.username}` : u.first_name) : 'Kullanıcı',
        username: u?.username || '',
        emoji
    }
}

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime()
    const m = Math.floor(diff / 60000)
    if (m < 1) return 'az önce'
    if (m < 60) return `${m} dk önce`
    const h = Math.floor(m / 60)
    if (h < 24) return `${h} saat önce`
    return `${Math.floor(h / 24)} gün önce`
}

function StarRating({ value, onChange, size = 18 }: { value: number; onChange?: (v: number) => void; size?: number }) {
    return (
        <div style={{ display: 'flex', gap: '3px' }}>
            {[1, 2, 3, 4, 5].map(s => (
                <span
                    key={s}
                    onClick={() => onChange?.(s)}
                    style={{
                        fontSize: size, cursor: onChange ? 'pointer' : 'default',
                        color: s <= value ? '#f59e0b' : '#334155',
                        transition: 'color 0.2s',
                        lineHeight: 1
                    }}
                >
                    ★
                </span>
            ))}
        </div>
    )
}

function ScoreBar({ label, score }: { label: string; score: number }) {
    const pct = (score / 5) * 100
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', width: '50px' }}>{label}</span>
            <div style={{ flex: 1, height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: '#f59e0b', borderRadius: '3px' }} />
            </div>
            <span style={{ fontSize: '11px', color: '#fff', width: '20px', textAlign: 'right', fontWeight: 700 }}>{score.toFixed(1)}</span>
        </div>
    )
}

// ─── DEMO DATA ────────────────────────────────────────────────────────────
const DEMO_JOBS: SupaJob[] = [
    {
        id: 'demo1', title: 'A la Carte Şefi (Fine Dining)', description: 'Uluslararası otel zincirimizde görev alacak, fine dining tecrübesi olan lider bir şef arıyoruz. Tüm yan haklar ve dolgun maaş mevcuttur.',
        city: 'İstanbul', salary: 'Dolgun Maaş', employer_name: 'The Grand ModHotel', employer_emoji: '🏢',
        is_active: true, created_at: new Date(Date.now() - 3600000).toISOString(), applications_count: 14, job_type: 'listing'
    },
    {
        id: 'demo3', title: 'Barista (Hemen Başla)', description: 'Yeni nesil kahve dükkanımıza yoğun tempoya ayak uyduracak deneyimli barista arıyoruz. Günlük veya aylık ödeme yapılabilir.',
        city: 'İzmir', salary: '25.000 TL', employer_name: 'Brew Co.', employer_emoji: '☕',
        is_active: true, created_at: new Date(Date.now() - 1800000).toISOString(), applications_count: 32, job_type: 'today'
    }
]

// ─── Apply Modal ──────────────────────────────────────────────────────────
function ApplyModal({ job, onClose, onSuccess }: { job: SupaJob; onClose: () => void; onSuccess: () => void }) {
    const [message, setMessage] = useState('')
    const [sending, setSending] = useState(false)

    async function handleApply() {
        if (!message.trim()) return
        setSending(true)
        const user = getTgUser()

        if (job.employer_username) {
            const safeMsg = encodeURIComponent(`Merhaba, "${job.title}" ilanı için ulaşıyorum:\n\n${message}`)
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
        const msgStr = job.employer_username ? 'Başvurunuz Telegram üzerinden iletiliyor...' : 'Profiliniz ve başvurunuz işletmeye iletildi!'
        if (window.Telegram?.WebApp?.showAlert) window.Telegram.WebApp.showAlert(msgStr)
        else alert(msgStr)
    }

    return (
        <AnimatePresence>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
                style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', zIndex: 3000 }} />
            <motion.div
                initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                style={{
                    position: 'fixed', bottom: 0, left: 0, right: 0,
                    background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '24px 24px 0 0', padding: '24px 20px 40px', zIndex: 3001,
                    boxShadow: '0 -10px 40px rgba(0,0,0,0.5)'
                }}
            >
                <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, margin: '0 auto 20px' }} />
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                        {job.employer_emoji}
                    </div>
                    <div>
                        <h3 style={{ margin: '0 0 4px', fontSize: '18px', color: '#fff', fontWeight: 800 }}>{job.title}</h3>
                        <p style={{ margin: 0, color: '#94a3b8', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Building size={12} /> {job.employer_name} • <MapPin size={12} /> {job.city}
                        </p>
                    </div>
                </div>

                <div style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '12px', padding: '12px', marginBottom: '16px', fontSize: '12px', color: '#60a5fa', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>Hızlı başvuru ekranı. İşverene deneyimlerinden ve neden bu pozisyona uygun olduğundan kısaca bahset.</span>
                </div>

                <textarea
                    value={message} onChange={e => setMessage(e.target.value)}
                    placeholder="Merhaba, incelediğim bu açık pozisyon için yeteneklerimin uygun olduğunu düşünüyorum..."
                    rows={4}
                    style={{
                        width: '100%', background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px',
                        padding: '16px', fontSize: '14px', color: '#f8fafc',
                        outline: 'none', resize: 'none', marginBottom: '16px',
                        boxSizing: 'border-box', fontFamily: 'inherit',
                        transition: 'border 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#f59e0b'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                />

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={onClose} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', borderRadius: '12px', padding: '16px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
                        Vazgeç
                    </button>
                    <motion.button
                        whileTap={{ scale: 0.97 }} onClick={handleApply} disabled={!message.trim() || sending}
                        style={{
                            flex: 2, background: message.trim() ? '#f59e0b' : 'rgba(255,255,255,0.05)',
                            color: message.trim() ? '#000' : '#64748b', border: 'none',
                            borderRadius: '12px', padding: '16px', fontSize: '15px',
                            fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                        }}
                    >
                        {sending ? 'Gönderiliyor...' : (job.employer_username ? <><MessageCircle size={18} /> Telegrada İlet</> : 'Başvuruyu Tamamla')}
                    </motion.button>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

// ─── Add Job Form ─────────────────────────────────────────────────────────
function AddJobForm({ onSuccess, onBack }: { onSuccess: () => void; onBack: () => void }) {
    const [jobType, setJobType] = useState<'listing' | 'today'>('listing')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [city, setCity] = useState('')
    const [salary, setSalary] = useState('')
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit() {
        if (!title.trim() || !description.trim() || !city) return
        setSubmitting(true)
        const user = getTgUser()

        const res = await insertJob({
            title, description, city, salary,
            employer_name: user.name, employer_emoji: user.emoji, employer_username: user.username,
            is_active: true, job_type: jobType
        })

        setSubmitting(false)
        if (res) {
            onSuccess()
            if (window.Telegram?.WebApp?.showAlert) window.Telegram.WebApp.showAlert(`İlan yayınlandı! 🎉`)
        } else {
            console.error("Ilan eklenemedi, insertJob null dondu.")
        }
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '10px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
                    <ArrowRight size={20} style={{ transform: 'rotate(180deg)' }} />
                </button>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#f8fafc' }}>Yeni İş İlanı</h2>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '20px' }}>
                
                <div style={{ marginBottom: '20px' }}>
                    <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, marginBottom: '8px' }}>İLAN TİPİ</div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <div onClick={() => setJobType('listing')} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: `2px solid ${jobType === 'listing' ? '#3b82f6' : 'rgba(255,255,255,0.05)'}`, background: jobType === 'listing' ? 'rgba(59,130,246,0.1)' : 'rgba(0,0,0,0.2)', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                            <div style={{ fontSize: '20px', marginBottom: '4px' }}>🏢</div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: jobType === 'listing' ? '#60a5fa' : '#94a3b8' }}>Normal İlan</div>
                        </div>
                        <div onClick={() => setJobType('today')} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: `2px solid ${jobType === 'today' ? '#ef4444' : 'rgba(255,255,255,0.05)'}`, background: jobType === 'today' ? 'rgba(239,68,68,0.1)' : 'rgba(0,0,0,0.2)', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                            <div style={{ fontSize: '20px', marginBottom: '4px' }}>⚡</div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: jobType === 'today' ? '#f87171' : '#94a3b8' }}>Acil İş (Bugün)</div>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, marginBottom: '8px' }}>ARANAN POZİSYON *</div>
                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Örn: Master Şef, Garson, Yönetici" style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '15px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
                    </div>

                    <div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, marginBottom: '8px' }}>LOKASYON *</div>
                        <select value={city} onChange={e => setCity(e.target.value)} style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '15px', color: city ? '#fff' : '#64748b', outline: 'none', boxSizing: 'border-box', appearance: 'none' }}>
                            <option value="">Şehir Seçiniz</option>
                            {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>

                    <div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, marginBottom: '8px' }}>AYLIK MAAŞ / ÜCRET (Opsiyonel)</div>
                        <input value={salary} onChange={e => setSalary(e.target.value)} placeholder="Örn: 40.000 TL + Prim + Ticket" style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '15px', color: '#fff', outline: 'none', boxSizing: 'border-box' }} />
                    </div>

                    <div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, marginBottom: '8px' }}>İŞ DETAYLARI VE BEKLENTİLER *</div>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Mesai saatleri, aranan tecrübe, yan haklar..." rows={5} style={{ width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '15px', color: '#fff', outline: 'none', boxSizing: 'border-box', resize: 'none', fontFamily: 'inherit' }} />
                    </div>
                </div>

                <motion.button whileTap={{ scale: 0.98 }} onClick={handleSubmit} disabled={!title.trim() || !description.trim() || !city || submitting}
                    style={{ width: '100%', marginTop: '24px', background: (title && description && city) ? '#f59e0b' : 'rgba(255,255,255,0.05)', color: (title && description && city) ? '#000' : '#64748b', border: 'none', borderRadius: '12px', padding: '18px', fontSize: '16px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    {submitting ? 'Kaydediliyor...' : <><CheckCircle2 size={20} /> İlanı Ücretsiz Yayınla</>}
                </motion.button>

            </div>
        </motion.div>
    )
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────
export function TasteJobs() {
    const { i18n } = useTranslation()
    const isTr = i18n.language?.startsWith('tr')

    const [view, setView] = useState<'board' | 'add_job'>('board')
    const [jobs, setJobs] = useState<SupaJob[]>(DEMO_JOBS)
    const [loading, setLoading] = useState(true)
    const [applyingTo, setApplyingTo] = useState<SupaJob | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {
        getJobs().then(j => {
            setJobs(j.length > 0 ? j : DEMO_JOBS)
            setLoading(false)
        })
    }, [view])

    if (view === 'add_job') {
        return <AddJobForm onBack={() => setView('board')} onSuccess={() => setView('board')} />
    }

    const filteredJobs = jobs.filter(j => 
        (j.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
         j.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
         j.employer_name.toLowerCase().includes(searchQuery.toLowerCase())) &&
         j.job_type !== 'seeking' // profilleri buraya dahil etmiyoruz
    )

    return (
        <div style={{ paddingBottom: '20px' }}>
            {/* Header & Search - "İsinolsun" Style */}
            <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: '20px', padding: '24px 20px', marginBottom: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h1 style={{ margin: '0 0 16px', fontSize: '24px', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Briefcase size={26} color="#f59e0b" /> Kariyer <span style={{ color: '#f59e0b' }}>&</span> İş
                </h1>
                
                <div style={{ background: '#fff', borderRadius: '14px', display: 'flex', padding: '4px', gap: '4px' }}>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px' }}>
                        <Search size={18} color="#64748b" />
                        <input 
                            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                            placeholder={isTr ? "İş, şef, mekan ara..." : "Search jobs..."}
                            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', padding: '12px 0', fontSize: '15px', color: '#0f172a', fontWeight: 500 }}
                        />
                    </div>
                </div>
                
                <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                    <button onClick={() => setView('add_job')} style={{ flex: 1, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b', padding: '12px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                        <PlusCircle size={16} /> İlan Ver
                    </button>
                    <button style={{ flex: 1, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', padding: '12px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', cursor: 'pointer' }}>
                        <Users size={16} /> CV Havuzu
                    </button>
                </div>
            </div>

            {/* Title */}
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#f8fafc', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Güncel İlanlar <span style={{ background: '#334155', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>{filteredJobs.length}</span>
            </h2>

            {/* Job Cards - "Indeed / Isinolsun" Hybrid structure */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Yükleniyor...</div>
            ) : filteredJobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Aramaya uygun ilan bulunamadı.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {filteredJobs.map(job => (
                        <motion.div key={job.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
                            style={{ 
                                background: job.job_type === 'today' ? 'linear-gradient(180deg, rgba(239,68,68,0.05), rgba(30,41,59,0.5))' : '#1e293b', 
                                border: job.job_type === 'today' ? '1px solid rgba(239,68,68,0.2)' : '1px solid rgba(255,255,255,0.05)', 
                                borderRadius: '16px', padding: '20px', position: 'relative', overflow: 'hidden'
                            }}
                        >
                            {job.job_type === 'today' && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: '#ef4444' }} />}
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', gap: '14px' }}>
                                    <div style={{ width: 52, height: 52, borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px' }}>
                                        {job.employer_emoji}
                                    </div>
                                    <div>
                                        <h3 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: 800, color: '#f8fafc' }}>{job.title}</h3>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#94a3b8' }}>
                                            <Building size={14} /> {job.employer_name}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {job.description}
                            </p>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                                <span style={{ padding: '6px 12px', background: 'rgba(245,158,11,0.1)', color: '#fcd34d', borderRadius: '8px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <MapPin size={14} /> {job.city}
                                </span>
                                {job.salary && (
                                    <span style={{ padding: '6px 12px', background: 'rgba(16,185,129,0.1)', color: '#34d399', borderRadius: '8px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <BadgeCheck size={14} /> {job.salary}
                                    </span>
                                )}
                                <span style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', borderRadius: '8px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Clock size={14} /> {timeAgo(job.created_at)}
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <motion.button whileTap={{ scale: 0.98 }} onClick={() => setApplyingTo(job)}
                                    style={{ flex: 1, padding: '14px', background: job.job_type === 'today' ? '#ef4444' : '#f59e0b', color: job.job_type === 'today' ? '#fff' : '#000', border: 'none', borderRadius: '12px', fontSize: '14px', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    Hemen Başvur <ArrowRight size={16} />
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {applyingTo && <ApplyModal job={applyingTo} onClose={() => setApplyingTo(null)} onSuccess={() => setApplyingTo(null)} />}
        </div>
    )
}
