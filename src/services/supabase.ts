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

const KNOWN_COLUMNS = ['type', 'author_name', 'author_emoji', 'author_username', 'text', 'photo', 'tags', 'recipe_title', 'ingredients', 'steps', 'venue_name', 'city', 'allergens', 'likes', 'calories', 'reward_wallet']

// ─── POSTS ───
export async function getPosts(): Promise<SupaPost[]> {
    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/posts?type=not.eq.chat&order=created_at.desc&limit=50`, { headers: H })
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

        // FAIL? Probably missing columns in Supabase. Let's try to strip extra fields.
        const err = await res.json()
        console.error('[Supabase Error]', err)

        // Try stripping to the very basic columns that usually exist
        const minimalCols = ['type', 'author_name', 'author_emoji', 'text', 'tags']
        const minimalPayload: any = {}
        minimalCols.forEach(col => { if (post[col] !== undefined) minimalPayload[col] = post[col] })
        
        // Append extra info to text so it's not totally lost
        let extraInfo = ''
        if (post.city) extraInfo += `\n📍 ${post.city}`
        if (post.venue_name) extraInfo += `\n🏪 ${post.venue_name}`
        if (post.reward_wallet) extraInfo += `\n💰 Wallet: ${post.reward_wallet}`
        if (post.author_username) extraInfo += `\n🔗 @${post.author_username.replace('@','')}`
        
        if (extraInfo) minimalPayload.text += extraInfo

        const res2 = await fetch(`${SUPABASE_URL}/rest/v1/posts`, {
            method: 'POST',
            headers: H,
            body: JSON.stringify(minimalPayload)
        })

        if (res2.ok) {
            const data2 = await res2.json()
            return Array.isArray(data2) ? data2[0] : data2
        }

        return null
    } catch (e) {
        console.error('[Supabase Catch]', e)
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
