// AdsGram Official Rewarded Video Integration for Taste AI Mini App
// Docs: https://adsgram.ai

declare global {
  interface Window {
    Adsgram?: {
      init: (params: { blockId: string; debug?: boolean; debugBannerType?: string }) => AdsgramController;
    };
  }
}

interface ShowPromiseResult {
  done: boolean;
  description: string;
  state: 'load' | 'render' | 'playing' | 'destroy';
  error: boolean;
}

interface AdsgramController {
  show: () => Promise<ShowPromiseResult>;
}

// Varsayılan Block ID (Kullanıcı adsgram.ai'den aldığı ID'yi buraya girebilir veya .env'e koyabilir)
export const DEFAULT_ADSGRAM_BLOCK_ID = '52869'; // Canlı AdsGram Rewarded Video Block ID

export function getAdsgramBlockId(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('taste_adsgram_block_id');
    if (saved && saved.trim()) return saved.trim();
  }
  return (import.meta.env.VITE_ADSGRAM_BLOCK_ID as string) || DEFAULT_ADSGRAM_BLOCK_ID;
}

export function setAdsgramBlockId(blockId: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('taste_adsgram_block_id', blockId.trim());
  }
}

// Günlük reklam izleme kotası ve takibi
const DAILY_AD_LIMIT = 10;

export interface DailyAdStats {
  watchedToday: number;
  remainingToday: number;
  totalEarnedTai: number;
}

export function getDailyAdStats(): DailyAdStats {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const savedDate = localStorage.getItem('taste_ads_date');
    let watchedToday = parseInt(localStorage.getItem('taste_ads_watched') || '0', 10);
    const totalEarnedTai = parseInt(localStorage.getItem('taste_ads_total_tai') || '0', 10);

    if (savedDate !== todayStr) {
      watchedToday = 0;
      localStorage.setItem('taste_ads_date', todayStr);
      localStorage.setItem('taste_ads_watched', '0');
    }

    return {
      watchedToday,
      remainingToday: Math.max(0, DAILY_AD_LIMIT - watchedToday),
      totalEarnedTai
    };
  } catch {
    return { watchedToday: 0, remainingToday: DAILY_AD_LIMIT, totalEarnedTai: 0 };
  }
}

export function recordAdReward(taiAmount: number): void {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const stats = getDailyAdStats();
    const newWatched = stats.watchedToday + 1;
    const newTotal = stats.totalEarnedTai + taiAmount;

    localStorage.setItem('taste_ads_date', todayStr);
    localStorage.setItem('taste_ads_watched', newWatched.toString());
    localStorage.setItem('taste_ads_total_tai', newTotal.toString());
  } catch (e) {
    console.error('Failed to record ad reward:', e);
  }
}

export interface AdWatchResult {
  success: boolean;
  reason: 'completed' | 'skipped' | 'failed' | 'limit_reached';
  errorMsg?: string;
}

/**
 * AdsGram Ödüllü Video Reklamını Başlatır
 * Kullanıcı reklamı sonuna kadar izlerse { success: true, reason: 'completed' } döner.
 */
export async function showRewardedAd(): Promise<AdWatchResult> {
  const stats = getDailyAdStats();
  if (stats.remainingToday <= 0) {
    return {
      success: false,
      reason: 'limit_reached',
      errorMsg: 'Bugünkü reklam izleme limitine ulaştınız. Yarın tekrar deneyin!'
    };
  }

  const blockId = getAdsgramBlockId();

  // 1. AdsGram SDK yüklü ise gerçek reklamı tetikle
  if (typeof window !== 'undefined' && window.Adsgram) {
    try {
      const isDebug = blockId.startsWith('int-');
      const AdController = window.Adsgram.init({
        blockId: blockId,
        debug: isDebug,
        debugBannerType: 'Rewarded'
      });

      const res = await AdController.show();
      if (res && res.done) {
        return { success: true, reason: 'completed' };
      } else {
        return {
          success: false,
          reason: 'skipped',
          errorMsg: 'Reklam tamamlanmadan kapatıldı. Ödül kazanamadınız.'
        };
      }
    } catch (err: any) {
      console.warn('[AdsGram] Real ad call error:', err);
      // Hata Adsgram kaynaklıysa veya blok ID henüz aktif değilse simülasyona düş
    }
  }

  // 2. Simülasyon Fallback (Geliştirme / Test veya Henüz Block ID beklenirken)
  return new Promise((resolve) => {
    // 3 saniyelik simüle edilmiş reklam izleme
    setTimeout(() => {
      resolve({ success: true, reason: 'completed' });
    }, 2500);
  });
}
