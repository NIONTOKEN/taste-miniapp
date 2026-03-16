// Supabase API Service — Community Posts & Chat
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

const H = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

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

// ─── POSTS ───
export async function getPosts(): Promise<SupaPost[]> {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?type=not.eq.chat&order=created_at.desc&limit=50`, { headers: H })
        return res.ok ? res.json() : []
    } catch { return [] }
}

export async function insertPost(post: any): Promise<SupaPost | null> {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
            method: 'POST',
            headers: H,
            body: JSON.stringify(post)
        })
        const data = await res.json()
        return Array.isArray(data) ? data[0] : data
    } catch { return null }
}

// ─── CHAT ───
export async function getMessages(): Promise<SupaPost[]> {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?type=eq.chat&order=created_at.desc&limit=30`, { headers: H })
        return res.ok ? res.json() : []
    } catch { return [] }
}

export async function sendMessage(name: string, emoji: string, msg: string) {
    return insertPost({
        type: 'chat',
        author_name: name,
        author_emoji: emoji,
        text: msg,
        tags: []
    })
}
