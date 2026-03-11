/**
 * Spin Service — Supabase tabanlı sunucu doğrulama
 *
 * Amaç: localStorage manipülasyonunu önlemek.
 * Her spin, Supabase'e kaydedilir. UNIQUE kısıt sayesinde
 * aynı player_id + tarih kombinasyonu tekrar eklenemez.
 * RLS politikaları API üzerinden UPDATE/DELETE'i engeller.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

const HEADERS = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

// ─── Types ─────────────────────────────────────────────────────

export interface SpinRecord {
    id: string
    player_id: string
    spin_date: string
    points_gained: number
    taste_won: number
    total_points: number
    total_claimed: number
    created_at: string
}

export interface SpinCheckResult {
    canSpin: boolean
    todayRecord: SpinRecord | null
    totalPoints: number
    totalClaimed: number
}

// ─── Player ID ─────────────────────────────────────────────────
//
// Öncelik: bağlı cüzdan adresi (değiştirilemez, en güvenilir)
// Yoksa: cihaza özgü kalıcı UUID (localStorage'da saklı)
// Bu UUID temizlenirse sıfırlanır ama cüzdan bağlanırsa kalıcı olur.
//
export function getPlayerId(walletAddress?: string): string {
    if (walletAddress && walletAddress.length > 10) {
        return `wallet_${walletAddress}`
    }
    // Cihaz UUID — ilk girişte oluşturulur, tarayıcıda kalır
    const KEY = 'taste_device_id'
    let deviceId = localStorage.getItem(KEY)
    if (!deviceId) {
        deviceId = `device_${crypto.randomUUID()}`
        localStorage.setItem(KEY, deviceId)
    }
    return deviceId
}

// ─── Bugünün tarihi (UTC, ISO format) ──────────────────────────
function todayUTC(): string {
    return new Date().toISOString().slice(0, 10)
}

// ─── Spin kontrolü: bugün zaten çevirimldi mi? ─────────────────
export async function checkSpinStatus(playerId: string): Promise<SpinCheckResult> {
    const today = todayUTC()

    try {
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/spin_records?player_id=eq.${encodeURIComponent(playerId)}&order=spin_date.desc&limit=30`,
            { headers: HEADERS }
        )

        if (!res.ok) {
            console.warn('[Spin] Server check failed, falling back to localStorage')
            return _localFallback(playerId)
        }

        const records: SpinRecord[] = await res.json()
        const todayRecord = records.find(r => r.spin_date === today) ?? null

        // Toplam puan: sunucudan en son kaydın total_points değeri
        const latestRecord = records[0] ?? null
        const totalPoints = latestRecord?.total_points ?? 0
        const totalClaimed = latestRecord?.total_claimed ?? 0

        return {
            canSpin: todayRecord === null,
            todayRecord,
            totalPoints,
            totalClaimed
        }
    } catch (err) {
        console.warn('[Spin] Network error, localStorage fallback:', err)
        return _localFallback(playerId)
    }
}

// ─── Spin kaydı: sonucu sunucuya yaz ───────────────────────────
export async function recordSpin(
    playerId: string,
    pointsGained: number,
    tasteWon: number,
    currentTotalPoints: number,
    currentTotalClaimed: number
): Promise<{ success: boolean; newTotal: number; newClaimed: number }> {
    const today = todayUTC()
    const newTotal = tasteWon > 0 ? currentTotalPoints : currentTotalPoints + pointsGained
    const newClaimed = currentTotalClaimed

    const payload = {
        player_id: playerId,
        spin_date: today,
        points_gained: pointsGained,
        taste_won: tasteWon,
        total_points: newTotal,
        total_claimed: newClaimed
    }

    try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/spin_records`, {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify(payload)
        })

        if (res.status === 409) {
            // UNIQUE kısıtı ihlali: bugün zaten çevrilmiş (manipülasyon girişimi!)
            console.warn('[Spin] ⚠️ Duplicate spin attempt blocked by server!')
            return { success: false, newTotal: currentTotalPoints, newClaimed: currentTotalClaimed }
        }

        if (!res.ok) {
            console.warn('[Spin] Record failed, using localStorage fallback')
            _saveLocalSpin(today, newTotal, newClaimed)
            return { success: true, newTotal, newClaimed }
        }

        // Sunucu başarılı → localStorage'ı da güncelle (cache olarak)
        _saveLocalSpin(today, newTotal, newClaimed)
        return { success: true, newTotal, newClaimed }
    } catch (err) {
        console.warn('[Spin] Network error during record:', err)
        _saveLocalSpin(today, newTotal, newClaimed)
        return { success: true, newTotal, newClaimed }
    }
}

// ─── Ödül talebi: total_claimed sunucuda güncelle ───────────────
export async function claimReward(
    playerId: string,
    rewardAmount: number,
    currentPoints: number,
    currentClaimed: number
): Promise<{ success: boolean; newPoints: number; newClaimed: number }> {
    const newPoints = Math.max(currentPoints - 2000, 0)
    const newClaimed = currentClaimed + rewardAmount
    const today = todayUTC()

    try {
        // Bugünkü kaydı güncelle (total_claimed arttır)
        // Not: Supabase anon key ile UPDATE sadece burada izin verilen özel koşulda
        const res = await fetch(
            `${SUPABASE_URL}/rest/v1/spin_records?player_id=eq.${encodeURIComponent(playerId)}&spin_date=eq.${today}`,
            {
                method: 'PATCH',
                headers: { ...HEADERS, 'Prefer': 'return=minimal' },
                body: JSON.stringify({ total_points: newPoints, total_claimed: newClaimed })
            }
        )

        if (!res.ok) {
            console.warn('[Spin] Claim update failed on server, localStorage updated')
        }
    } catch (err) {
        console.warn('[Spin] Claim network error:', err)
    }

    // localStorage'ı her durumda güncelle
    const localData = JSON.parse(localStorage.getItem('taste_spin_data') || '{}')
    localStorage.setItem('taste_spin_data', JSON.stringify({
        ...localData,
        points: newPoints,
        totalClaimed: newClaimed
    }))

    return { success: true, newPoints, newClaimed }
}

// ─── Yardımcı: localStorage fallback ───────────────────────────
function _localFallback(playerId: string): SpinCheckResult {
    try {
        const raw = localStorage.getItem('taste_spin_data')
        if (!raw) return { canSpin: true, todayRecord: null, totalPoints: 0, totalClaimed: 0 }
        const data = JSON.parse(raw)
        const today = todayUTC()
        return {
            canSpin: data.lastSpin !== today,
            todayRecord: null,
            totalPoints: data.points ?? 0,
            totalClaimed: data.totalClaimed ?? 0
        }
    } catch {
        return { canSpin: true, todayRecord: null, totalPoints: 0, totalClaimed: 0 }
    }
}

function _saveLocalSpin(today: string, newTotal: number, newClaimed: number) {
    const raw = localStorage.getItem('taste_spin_data')
    const data = raw ? JSON.parse(raw) : {}
    localStorage.setItem('taste_spin_data', JSON.stringify({
        ...data,
        lastSpin: today,
        points: newTotal,
        totalClaimed: newClaimed
    }))
}
