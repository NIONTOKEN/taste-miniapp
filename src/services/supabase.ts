// Supabase API Service — Community Posts
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('[Supabase] Missing environment variables: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')
}

const H = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

export interface SupaPost {
    id: string
    type: 'yemek' | 'tarif' | 'menu' | 'career'
    author_name: string
    author_emoji: string
    created_at: string
    text: string
    photo?: string
    tags: string[]
    recipe_title?: string
    ingredients?: { name: string; amount: string }[]
    steps?: string[]
    venue_name?: string
    city?: string
    allergens?: string[]
    likes?: number
    calories?: string
    reward_wallet?: string
}

export async function getPosts(): Promise<SupaPost[]> {
    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/posts?order=created_at.desc&limit=50`,
            { headers: H }
        )
        if (!res.ok) return []
        return res.json()
    } catch { return [] }
}

export async function insertPost(post: Omit<SupaPost, 'id' | 'created_at'>): Promise<SupaPost | null> {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
            method: 'POST',
            headers: H,
            body: JSON.stringify(post)
        })
        if (!res.ok) return null
        const data = await res.json()
        return Array.isArray(data) ? data[0] : data
    } catch { return null }
}
