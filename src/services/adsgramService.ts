// AdsGram Official Rewarded Video Integration for Taste AI Mini App
// Docs: https://adsgram.ai

declare global {
  interface Window {
    Adsgram?: {
      init: (params: { blockId: string; debug?: boolean }) => AdsgramController;
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

// Varsayılan Block ID (AdsGram panelinde oluşturulan Rewarded Video blok ID)
export const DEFAULT_ADSGRAM_BLOCK_ID = '52869';

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
 * AdsGram Ödüllü Video Reklamını Başlatır.
 * SADECE VE SADECE video reklam gerçekten baştan sona izlendiğinde ödül verir!
 * Asla sahte/otomatik ödül vermez.
 */
export async function showRewardedAd(): Promise<AdWatchResult> {
  const stats = getDailyAdStats();
  if (stats.remainingToday <= 0) {
    return {
      success: false,
      reason: 'limit_reached',
      errorMsg: 'Bugünkü reklam izleme limitine ulaştınız (10/10). Yarın tekrar deneyin!'
    };
  }

  const blockId = getAdsgramBlockId();

  // 1. AdsGram SDK yüklü ise gerçek reklamı tetikle
  if (typeof window !== 'undefined' && window.Adsgram) {
    try {
      const isDebug = blockId.startsWith('int-') || blockId.startsWith('test') || localStorage.getItem('taste_adsgram_debug') === 'true';
      const AdController = window.Adsgram.init({
        blockId: blockId,
        debug: isDebug
      });

      const res = await AdController.show();

      if (res && res.done) {
        return { success: true, reason: 'completed' };
      } else {
        return {
          success: false,
          reason: 'skipped',
          errorMsg: 'Reklam videosu sonuna kadar izlenmeden kapatıldı. Ödül kazanılamadı.'
        };
      }
    } catch (err: any) {
      console.error('[AdsGram] Real ad call error:', err);
      const desc = err?.description || err?.message || (typeof err === 'string' ? err : '');
      
      let friendlyMsg = 'Şu anda gösterilecek video reklam bulunamadı. Lütfen biraz sonra tekrar deneyin.';
      if (desc.toLowerCase().includes('no ads') || desc.toLowerCase().includes('empty')) {
        friendlyMsg = 'AdsGram reklam havuzunda şu an uygun video bulunamadı. Adsgram platform onayı veya yeni reklam kampanyaları bekleniyor.';
      } else if (desc) {
        friendlyMsg = `AdsGram Bildirimi: ${desc}`;
      }

      return {
        success: false,
        reason: 'failed',
        errorMsg: friendlyMsg
      };
    }
  }

  // 2. AdsGram SDK henüz yüklenmediyse
  return {
    success: false,
    reason: 'failed',
    errorMsg: 'AdsGram reklam servisi yüklenemedi. Lütfen Telegram uygulamasından açtığınızdan emin olun.'
  };
}
