// ─── Supabase API Service — TASTE Mini App ────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

const H = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

// ─── Types ────────────────────────────────────────────────────────────────
export interface SupaPost {
    id: string
    type: 'yemek' | 'tarif' | 'menu' | 'career' | 'chat'
    author_name: string
    author_emoji: string
    author_username?: string
    created_at: string
    text: string
    photo?: string
    tags: string[]
    recipe_title?: string
    ingredients?: any[]
    steps?: string[]
    venue_name?: string
    city?: string
    allergens?: string[]
    likes?: number
    calories?: string
    reward_wallet?: string
}

export interface SupaJob {
    id: string
    title: string
    description: string
    city: string
    salary?: string
    employer_name: string
    employer_emoji: string
    employer_username?: string
    is_active: boolean
    created_at: string
    applications_count?: number
    job_type: 'listing' | 'seeking' | 'today'
}

export interface SupaApplication {
    id: string
    job_id: string
    user_name: string
    user_emoji: string
    user_username?: string
    message: string
    created_at: string
}

export interface SupaReview {
    id: string
    business_name: string
    city?: string
    rating: number
    salary_score?: number
    environment_score?: number
    management_score?: number
    comment: string
    user_name: string
    user_emoji: string
    user_username?: string
    created_at: string
}

export interface SupaProfile {
    id: string
    user_name: string
    user_emoji: string
    user_username?: string
    profession: string
    experience?: string
    skills: string[]
    bio?: string
    city?: string
    photo_url?: string
    stars: number
    taste_points: number
    created_at: string
    updated_at: string
}

// ─── Helper ───────────────────────────────────────────────────────────────
async function safePost(table: string, payload: any): Promise<any | null> {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
            method: 'POST',
            headers: H,
            body: JSON.stringify(payload)
        })
        if (res.ok) {
            const data = await res.json()
            return Array.isArray(data) ? data[0] : data
        }
        const err = await res.json()
        console.error(`[Supabase ${table} Error]`, err)
        if (window.Telegram?.WebApp?.showAlert) {
            window.Telegram.WebApp.showAlert(`DB Hatası (${table}): ` + (err.message || JSON.stringify(err)))
        } else {
            alert(`Sistem Hatası (${table}): ` + (err.message || JSON.stringify(err)))
        }
        return null
    } catch (e) {
        console.error(`[Supabase ${table} Catch]`, e)
        return null
    }
}

// ─── POSTS (Community Feed) ───────────────────────────────────────────────
export async function getPosts(): Promise<SupaPost[]> {
    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/posts?type=not.eq.chat&order=created_at.desc&limit=50`,
            { headers: H }
        )
        if (!res.ok) return []
        return res.json()
    } catch { return [] }
}

export async function insertPost(post: any): Promise<SupaPost | null> {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
            method: 'POST',
            headers: H,
            body: JSON.stringify(post)
        })

        if (res.ok) {
            const data = await res.json()
            return Array.isArray(data) ? data[0] : data
        }

        const err = await res.json()
        console.error('[Supabase Post Error]', err)

        // Fallback: minimal payload
        const minimal: any = {
            type: post.type,
            author_name: post.author_name,
            author_emoji: post.author_emoji,
            text: post.text,
            tags: post.tags || []
        }

        let extra = ''
        if (post.city) extra += `\n📍 ${post.city}`
        if (post.venue_name) extra += `\n🏪 ${post.venue_name}`
        if (post.reward_wallet) extra += `\n💰 Wallet: ${post.reward_wallet}`
        if (post.author_username) extra += `\n🔗 @${post.author_username.replace('@', '')}`
        if (extra) minimal.text += extra

        const res2 = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
            method: 'POST',
            headers: H,
            body: JSON.stringify(minimal)
        })
        if (res2.ok) {
            const d2 = await res2.json()
            return Array.isArray(d2) ? d2[0] : d2
        }
        return null
    } catch (e) {
        console.error('[Supabase Catch]', e)
        return null
    }
}

export async function updatePostLikes(id: string, likes: number): Promise<void> {
    try {
        await fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_post_likes`, {
            method: 'POST',
            headers: H,
            body: JSON.stringify({ post_id: id })
        })
    } catch { /* ignore */ }
}

// ─── CHAT ─────────────────────────────────────────────────────────────────
export async function getMessages(): Promise<SupaPost[]> {
    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/posts?type=eq.chat&order=created_at.asc&limit=50`,
            { headers: H }
        )
        if (!res.ok) return []
        return res.json()
    } catch { return [] }
}

export async function sendMessage(name: string, emoji: string, msg: string, username?: string) {
    return insertPost({
        type: 'chat',
        author_name: name,
        author_emoji: emoji,
        author_username: username,
        text: msg,
        tags: []
    })
}

// ─── JOBS ─────────────────────────────────────────────────────────────────
export async function getJobs(activeOnly = true): Promise<SupaJob[]> {
    try {
        const filter = activeOnly ? '&is_active=eq.true' : ''
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/jobs?order=created_at.desc&limit=50${filter}`,
            { headers: H }
        )
        if (!res.ok) return []
        return res.json()
    } catch { return [] }
}

export async function insertJob(job: Omit<SupaJob, 'id' | 'created_at'>): Promise<SupaJob | null> {
    return safePost('jobs', job)
}

export async function applyToJob(application: Omit<SupaApplication, 'id' | 'created_at'>): Promise<SupaApplication | null> {
    return safePost('applications', application)
}

// ─── REVIEWS ──────────────────────────────────────────────────────────────
export async function getReviews(): Promise<SupaReview[]> {
    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/reviews?order=created_at.desc&limit=50`,
            { headers: H }
        )
        if (!res.ok) return []
        return res.json()
    } catch { return [] }
}

export async function insertReview(review: Omit<SupaReview, 'id' | 'created_at'>): Promise<SupaReview | null> {
    return safePost('reviews', review)
}

// ─── PROFILES ─────────────────────────────────────────────────────────────
export async function getProfiles(): Promise<SupaProfile[]> {
    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/profiles?order=taste_points.desc&limit=50`,
            { headers: H }
        )
        if (!res.ok) return []
        return res.json()
    } catch { return [] }
}

export async function upsertProfile(profile: Partial<SupaProfile> & { user_name: string }): Promise<SupaProfile | null> {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
            method: 'POST',
            headers: { ...H, 'Prefer': 'return=representation,resolution=merge-duplicates' },
            body: JSON.stringify({ ...profile, updated_at: new Date().toISOString() })
        })
        if (res.ok) {
            const d = await res.json()
            return Array.isArray(d) ? d[0] : d
        }
        return null
    } catch { return null }
}

// ─── OTC ORDERS ────────────────────────────────────────────────────────────
export interface SupaOTCOrder {
    id: string
    user_id: string
    wallet_address: string
    amount_try: number
    amount_taste: number
    exchange_rate: number
    reference_code: string
    status: 'pending' | 'paid' | 'completed' | 'rejected' | 'cancelled'
    receipt_url?: string
    admin_notes?: string
    confirmed_at?: string
    created_at: string
    updated_at?: string
}

export async function getOTCOrders(userId?: string): Promise<SupaOTCOrder[]> {
    try {
        const filter = userId ? `&user_id=eq.${userId}` : ''
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/otc_orders?order=created_at.desc&limit=50${filter}`,
            { headers: H }
        )
        if (!res.ok) return []
        return res.json()
    } catch { return [] }
}

export async function insertOTCOrder(order: any): Promise<SupaOTCOrder | null> {
    return safePost('otc_orders', order)
}

export async function updateOTCOrderStatus(id: string, status: string, receipt_url?: string, notes?: string): Promise<boolean> {
    try {
        const body: any = { status }
        if (notes) body.admin_notes = notes
        if (receipt_url) body.receipt_url = receipt_url
        if (status === 'completed') body.confirmed_at = new Date().toISOString()
        const res = await fetch(`${SUPABASE_URL}/rest/v1/otc_orders?id=eq.${id}`, {
            method: 'PATCH',
            headers: H,
            body: JSON.stringify(body)
        })
        return res.ok
    } catch { return false }
}

// ─── TASTEPAY INVOICES ────────────────────────────────────────────────────
export interface SupaTastePayInvoice {
    id: string
    invoice_code: string
    merchant_wallet: string
    merchant_name?: string
    fiat_amount: number
    fiat_currency: string
    taste_amount: number
    exchange_rate: number
    status: 'pending' | 'paid' | 'expired' | 'cancelled'
    payer_wallet?: string
    payer_telegram?: string
    tx_hash?: string
    memo?: string
    created_at: string
    paid_at?: string
    expires_at: string
}

export async function createTastePayInvoice(invoice: {
    invoice_code: string
    merchant_wallet: string
    merchant_name?: string
    fiat_amount: number
    fiat_currency: string
    taste_amount: number
    exchange_rate: number
    memo?: string
}): Promise<SupaTastePayInvoice | null> {
    return safePost('tastepay_invoices', invoice)
}

export async function markTastePayInvoicePaid(
    invoice_code: string,
    payer_wallet: string,
    payer_telegram?: string
): Promise<boolean> {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/tastepay_invoices?invoice_code=eq.${invoice_code}`, {
            method: 'PATCH',
            headers: H,
            body: JSON.stringify({
                status: 'paid',
                payer_wallet,
                payer_telegram: payer_telegram || null,
                paid_at: new Date().toISOString()
            })
        })
        return res.ok
    } catch { return false }
}

export async function getTastePayInvoices(
    merchant_wallet?: string,
    limit: number = 50
): Promise<SupaTastePayInvoice[]> {
    try {
        const filter = merchant_wallet ? `&merchant_wallet=eq.${merchant_wallet}` : ''
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/tastepay_invoices?order=created_at.desc&limit=${limit}${filter}`,
            { headers: H }
        )
        if (!res.ok) return []
        return res.json()
    } catch { return [] }
}

export async function getTastePayInvoiceByCode(
    invoice_code: string
): Promise<SupaTastePayInvoice | null> {
    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/tastepay_invoices?invoice_code=eq.${invoice_code}&limit=1`,
            { headers: H }
        )
        if (!res.ok) return null
        const data = await res.json()
        return Array.isArray(data) && data.length > 0 ? data[0] : null
    } catch { return null }
}
