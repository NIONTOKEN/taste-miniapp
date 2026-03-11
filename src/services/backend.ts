/**
 * TASTE Backend Service
 * 
 * Kullanıcı verilerini Telegram CloudStorage + localStorage ile yönetir.
 * Withdrawal fonksiyonu kaldırıldı (güvenlik nedeniyle).
 */

export interface UserData {
    wallet: string;
    balance: number;
    streak: number;
    lastClaim: number | null;
    xp: number;
    referrals: number;
    tasksCompleted: string[];
    unlockedLevels?: number;
    completedLevels?: number[];
}

class BackendService {
    /**
     * Telegram CloudStorage'dan veri oku (Promise wrapper)
     */
    private cloudGet(key: string): Promise<string | null> {
        return new Promise((resolve) => {
            try {
                const cs = window.Telegram?.WebApp?.CloudStorage;
                if (cs) {
                    cs.getItem(key, (error: any, value: string) => {
                        if (error || !value) {
                            resolve(null);
                        } else {
                            resolve(value);
                        }
                    });
                } else {
                    resolve(null);
                }
            } catch {
                resolve(null);
            }
        });
    }

    /**
     * Telegram CloudStorage'a veri yaz
     */
    private cloudSet(key: string, value: string): void {
        try {
            const cs = window.Telegram?.WebApp?.CloudStorage;
            if (cs) {
                cs.setItem(key, value, (error: any) => {
                    if (error) console.warn('[CloudStorage] Yazma hatası:', error);
                });
            }
        } catch {
            // CloudStorage mevcut değilse sessizce devam et
        }
    }

    async getUserData(wallet: string): Promise<UserData> {
        const storageKey = `taste_user_${wallet}`;

        // 1. Önce Telegram CloudStorage'dan dene
        const cloudData = await this.cloudGet(storageKey);
        if (cloudData) {
            try {
                const parsed = JSON.parse(cloudData);
                localStorage.setItem(storageKey, cloudData);
                return parsed;
            } catch {
                // Parse hatası varsa devam et
            }
        }

        // 2. Fallback: localStorage'dan oku
        const localData = localStorage.getItem(storageKey);
        if (localData) {
            try {
                const parsed = JSON.parse(localData);
                this.cloudSet(storageKey, localData);
                return parsed;
            } catch {
                // Parse hatası varsa devam et
            }
        }

        // 3. Yeni kullanıcı
        return {
            wallet,
            balance: 0,
            streak: 0,
            lastClaim: null,
            xp: 0,
            referrals: 0,
            tasksCompleted: [],
            unlockedLevels: 1,
            completedLevels: []
        };
    }

    async saveUserData(data: UserData): Promise<void> {
        const storageKey = `taste_user_${data.wallet}`;
        const jsonData = JSON.stringify(data);

        // Her ikisine de yaz — böylece veriler kaybolmaz
        localStorage.setItem(storageKey, jsonData);
        this.cloudSet(storageKey, jsonData);
    }

    async trackReferral(code: string, newUserWallet: string): Promise<void> {
        console.log(`Referans takibi: ${code} kodunu kullanan yeni cüzdan: ${newUserWallet}`);
    }
}

export const backend = new BackendService();
