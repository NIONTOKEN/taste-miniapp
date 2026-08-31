// ─── TASTE Fishing Game Service — Economy, Tickets & Catch Mechanics ─────────

export interface FishPrize {
  id: string
  name: string
  symbol: string
  amount: number
  type: 'taste' | 'ton' | 'monad' | 'nion' | 'junk'
  color: string
  bgColor: string
  emoji: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  soundType: 'normal' | 'big'
  description: string
}

export interface CatchRecord {
  id: string
  prize: FishPrize
  caughtAt: string
  claimed: boolean
}

export interface FishingUserData {
  tickets: number          // Her olta 1 bilet (10 TASTE)
  totalCasts: number
  tasteBalance: number     // Kazanılan TASTE
  tonBalance: number       // Kazanılan TON
  monadBalance: number     // Kazanılan MONAD
  nionBalance: number      // Kazanılan NION
  catches: CatchRecord[]
}

const STORAGE_KEY = 'taste_fishing_user_data'

// ─── PRIZE POOL DEFINITION ───────────────────────────────────────────────────
export const PRIZE_POOL: (FishPrize & { weight: number })[] = [
  // 1. TASTE Ödülleri
  {
    id: 'p_tai_15',
    name: '15 TASTE (TAI)',
    symbol: 'TAI',
    amount: 15,
    type: 'taste',
    color: '#f59e0b',
    bgColor: '#78350f',
    emoji: '🥩',
    rarity: 'common',
    soundType: 'normal',
    description: 'Nefis TASTE Token Ödülü!',
    weight: 35
  },
  {
    id: 'p_tai_50',
    name: '50 TASTE (TAI)',
    symbol: 'TAI',
    amount: 50,
    type: 'taste',
    color: '#f59e0b',
    bgColor: '#78350f',
    emoji: '🥩',
    rarity: 'rare',
    soundType: 'big',
    description: 'Büyük TASTE Paketi!',
    weight: 15
  },
  {
    id: 'p_tai_100',
    name: '100 TASTE (TAI)',
    symbol: 'TAI',
    amount: 100,
    type: 'taste',
    color: '#f59e0b',
    bgColor: '#78350f',
    emoji: '🥩',
    rarity: 'epic',
    soundType: 'big',
    description: 'Devasa TASTE Zulası!',
    weight: 6
  },

  // 2. TON Ödülleri
  {
    id: 'p_ton_005',
    name: '0.05 TON',
    symbol: 'TON',
    amount: 0.05,
    type: 'ton',
    color: '#38bdf8',
    bgColor: '#0369a1',
    emoji: '💎',
    rarity: 'rare',
    soundType: 'normal',
    description: 'Mavi TON Elması!',
    weight: 12
  },
  {
    id: 'p_ton_02',
    name: '0.2 TON',
    symbol: 'TON',
    amount: 0.2,
    type: 'ton',
    color: '#38bdf8',
    bgColor: '#0369a1',
    emoji: '💎',
    rarity: 'epic',
    soundType: 'big',
    description: 'Parlak TON Kristali!',
    weight: 4
  },
  {
    id: 'p_ton_1',
    name: '1.0 TON Jackpot!',
    symbol: 'TON',
    amount: 1.0,
    type: 'ton',
    color: '#60a5fa',
    bgColor: '#1e3a8a',
    emoji: '👑',
    rarity: 'legendary',
    soundType: 'big',
    description: 'EFSANEVİ 1 TON BÜYÜK İKRAMİYE!',
    weight: 1
  },

  // 3. MONAD Ödülü
  {
    id: 'p_monad_10',
    name: '10 MONAD',
    symbol: 'MONAD',
    amount: 10,
    type: 'monad',
    color: '#a855f7',
    bgColor: '#581c87',
    emoji: '🟣',
    rarity: 'rare',
    soundType: 'normal',
    description: 'Monad Ekosistem Tokeni!',
    weight: 10
  },

  // 4. NION Ödülü
  {
    id: 'p_nion_50',
    name: '50 NION',
    symbol: 'NION',
    amount: 50,
    type: 'nion',
    color: '#10b981',
    bgColor: '#064e3b',
    emoji: '⭐',
    rarity: 'common',
    soundType: 'normal',
    description: 'NION Topluluk Tokeni!',
    weight: 12
  },

  // 5. Şanssız Atış / Teselli
  {
    id: 'p_boot_junk',
    name: 'Eski Çizme (5 TAI Teselli)',
    symbol: 'TAI',
    amount: 5,
    type: 'junk',
    color: '#94a3b8',
    bgColor: '#1e293b',
    emoji: '👟',
    rarity: 'common',
    soundType: 'normal',
    description: 'Oltaya eski bir çizme takıldı ama içinde 5 TAI buldun!',
    weight: 5
  }
]

// ─── Local Storage & State Helpers ───────────────────────────────────────────
export function getFishingData(): FishingUserData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      // Başlangıçta hediye 3 deneme bileti verelim
      const initial: FishingUserData = {
        tickets: 3,
        totalCasts: 0,
        tasteBalance: 0,
        tonBalance: 0,
        monadBalance: 0,
        nionBalance: 0,
        catches: []
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      return initial
    }
    return JSON.parse(raw)
  } catch {
    return {
      tickets: 3,
      totalCasts: 0,
      tasteBalance: 0,
      tonBalance: 0,
      monadBalance: 0,
      nionBalance: 0,
      catches: []
    }
  }
}

export function saveFishingData(data: FishingUserData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch { /* ignore */ }
}

// 🎣 Rastgele Ödül Çekimi (Weighted Random)
export function pickRandomCatch(): FishPrize {
  const totalWeight = PRIZE_POOL.reduce((sum, item) => sum + item.weight, 0)
  let rand = Math.random() * totalWeight

  for (const prize of PRIZE_POOL) {
    rand -= prize.weight
    if (rand <= 0) {
      return {
        id: prize.id,
        name: prize.name,
        symbol: prize.symbol,
        amount: prize.amount,
        type: prize.type,
        color: prize.color,
        bgColor: prize.bgColor,
        emoji: prize.emoji,
        rarity: prize.rarity,
        soundType: prize.soundType,
        description: prize.description
      }
    }
  }
  return PRIZE_POOL[0]
}

// 🎟️ Bilet Yükleme (10 TASTE = 1 Bilet)
export function addTickets(count: number): FishingUserData {
  const data = getFishingData()
  data.tickets += count
  saveFishingData(data)
  return data
}

// 🐟 Olta Atma & Ödül Kaydetme
export function performFishingCast(): { success: boolean; prize?: FishPrize; updatedData: FishingUserData } {
  const data = getFishingData()
  if (data.tickets <= 0) {
    return { success: false, updatedData: data }
  }

  // 1 bilet düş
  data.tickets -= 1
  data.totalCasts += 1

  const prize = pickRandomCatch()

  // Bakiyelere ekle
  if (prize.type === 'taste' || prize.type === 'junk') {
    data.tasteBalance += prize.amount
  } else if (prize.type === 'ton') {
    data.tonBalance += prize.amount
  } else if (prize.type === 'monad') {
    data.monadBalance += prize.amount
  } else if (prize.type === 'nion') {
    data.nionBalance += prize.amount
  }

  const record: CatchRecord = {
    id: `catch_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    prize,
    caughtAt: new Date().toISOString(),
    claimed: false
  }

  data.catches.unshift(record)
  saveFishingData(data)

  return { success: true, prize, updatedData: data }
}
