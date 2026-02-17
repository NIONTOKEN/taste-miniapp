import { beginCell, Address, toNano } from "@ton/core";
import { keyPairFromSeed, sign } from "@ton/crypto";

/**
 * Kanka, bu servis bizim "Hibrit" stratejimizin beyni.
 * Şimdilik localStorage + frontend signing ile çalışıyor.
 * İleride gerçek bir backend'e (Node.js sunucu) taşınacak.
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

// Kanka, bu seed'den keypair üretiyoruz. Aynı seed = aynı key pair.
// Deploy sırasında bu public key kontrata verildi.
const BACKEND_SEED = Buffer.alloc(32, "taste-backend-seed-placeholder");

class BackendService {
    private isDevelopment = true;
    private keyPairPromise: ReturnType<typeof keyPairFromSeed> | null = null;

    /**
     * Key pair'i lazy-load et (bir kere üret, sonra cache'le)
     */
    private async getKeyPair() {
        if (!this.keyPairPromise) {
            this.keyPairPromise = keyPairFromSeed(BACKEND_SEED);
        }
        return this.keyPairPromise;
    }

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

        if (!this.isDevelopment) {
            console.log('Veritabanına kaydediliyor...', data);
        }
    }

    async trackReferral(code: string, newUserWallet: string): Promise<void> {
        console.log(`Referans takibi: ${code} kodunu kullanan yeni cüzdan: ${newUserWallet}`);
    }

    /**
     * Gerçek Ed25519 imzası üretir.
     * Kontrat şunu doğrular: hash(sender_address + amount)
     * Bu imza ile kontrat TASTE tokenlerini kullanıcıya gönderir.
     */
    async getWithdrawalSignature(wallet: string, amount: number): Promise<Buffer> {
        console.log(`[Backend] Çekim imzalanıyor: ${wallet} için ${amount} TASTE`);

        const keyPair = await this.getKeyPair();

        // Kontratın doğrulama hash'ini oluştur: hash(sender_address + amount)
        const senderAddress = Address.parse(wallet);
        const amountNano = toNano(amount.toString());

        const hashCell = beginCell()
            .storeAddress(senderAddress)
            .storeCoins(amountNano)
            .endCell();

        const hash = hashCell.hash();

        // Ed25519 ile imzala
        const signature = sign(hash, keyPair.secretKey);

        console.log(`[Backend] ✅ İmza üretildi (${signature.length} bytes)`);
        return signature;
    }
}

export const backend = new BackendService();
