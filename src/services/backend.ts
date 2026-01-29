import { beginCell } from "@ton/core";
/**
 * Kanka, bu servis bizim "Hibrit" stratejimizin beyni.
 * Şimdilik localStorage üzerinden çalışıyor ama Supabase/Firebase 
 * bağladığımızda sadece bu dosyayı değiştirmemiz yetecek.
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
    private isDevelopment = true;

    async getUserData(wallet: string): Promise<UserData> {
        const saved = localStorage.getItem(`taste_user_${wallet}`);
        if (saved) return JSON.parse(saved);

        // Yeni kullanıcı için varsayılan veriler
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
        localStorage.setItem(`taste_user_${data.wallet}`, JSON.stringify(data));

        // Kanka buraya gerçek bir fetch('api/save') gelecek
        if (!this.isDevelopment) {
            console.log('Veritabanına kaydediliyor...', data);
        }
    }

    async trackReferral(code: string, newUserWallet: string): Promise<void> {
        console.log(`Referans takibi: ${code} kodunu kullanan yeni cüzdan: ${newUserWallet}`);
    }

    async getWithdrawalSignature(wallet: string, amount: number): Promise<string> {
        console.log(`Çekim onaylanıyor: ${wallet} için ${amount} TASTE`);

        // Kanka, gerçek backend'de burada veritabanı kontrolü yapılır:
        // 1. Kullanıcının bakiyesi gerçekten >= amount mu?
        // 2. Daha önce bu çekim yapıldı mı?

        // Mock Signature (Gerçekte private key ile imzalanır)
        // Tact 'Withdraw' mesajı için hash(sender + amount) bekler.
        return "gercek_imza_buraya_gelecek_backend_tarafindan";
    }
}

export const backend = new BackendService();
