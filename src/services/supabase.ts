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
        if (!res.ok) {
            console.error('[Supabase] Fetch failed:', res.statusText)
            return []
        }
        return res.json()
    } catch (e) { 
        console.error('[Supabase] Fetch catch:', e)
        return [] 
    }
}

export async function insertPost(post: any): Promise<SupaPost | null> {
    try {
        // Try creating a minimal payload first to avoid schema errors if columns don't exist
        // But for now, we try full payload and catch error
        const res = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
            method: 'POST',
            headers: H,
            body: JSON.stringify(post)
        })
        
        if (!res.ok) {
            const err = await res.json()
            console.error('[Supabase] Insert failed:', err)
            // If error is about missing columns, we might want to try again with minimal payload?
            // "Could not find column 'city' in model 'posts'"
            if (err.message?.includes('column')) {
                console.warn('[Supabase] retrying with minimal payload...')
                const minimal = {
                    type: post.type,
                    author_name: post.author_name,
                    author_emoji: post.author_emoji,
                    text: post.text,
                    tags: post.tags || []
                }
                const res2 = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
                    method: 'POST',
                    headers: H,
                    body: JSON.stringify(minimal)
                })
                if (res2.ok) {
                    const data2 = await res2.json()
                    return Array.isArray(data2) ? data2[0] : data2
                }
            }
            return null
        }

        const data = await res.json()
        return Array.isArray(data) ? data[0] : data
    } catch (e) { 
        console.error('[Supabase] Insert catch:', e)
        return null 
    }
}

// ─── CHAT ───
export async function getMessages(): Promise<SupaPost[]> {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?type=eq.chat&order=created_at.desc&limit=30`, { headers: H })
        if (!res.ok) return []
        return res.json()
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
