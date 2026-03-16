/**
 * Centralized API Service
 * Handles all external API calls with error handling, retry logic, and fallbacks
 */

interface ApiOptions {
    timeout?: number;
    retries?: number;
    fallbackValue?: any;
}

class ApiService {
    private defaultTimeout = 10000; // 10 seconds
    private defaultRetries = 2;

    /**
     * Generic fetch with timeout and retry logic
     */
    private async fetchWithTimeout(
        url: string,
        options: RequestInit = {},
        timeout: number = this.defaultTimeout
    ): Promise<Response> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    /**
     * Fetch with retry logic
     */
    private async fetchWithRetry(
        url: string,
        options: ApiOptions = {}
    ): Promise<any> {
        const retries = options.retries ?? this.defaultRetries;
        const timeout = options.timeout ?? this.defaultTimeout;

        for (let i = 0; i <= retries; i++) {
            try {
                const response = await this.fetchWithTimeout(url, {}, timeout);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                // Last retry failed
                if (i === retries) {
                    console.error(`API call failed after ${retries} retries:`, url, error);
                    if (options.fallbackValue !== undefined) {
                        return options.fallbackValue;
                    }
                    throw error;
                }
                // Wait before retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
            }
        }
    }

    /**
     * Get USD to TRY exchange rate
     */
    async getExchangeRate(): Promise<{ rate: number; usdToTry: number }> {
        try {
            const data = await this.fetchWithRetry(
                'https://api.exchangerate-api.com/v4/latest/USD',
                {
                    timeout: 8000,
                    retries: 2,
                    fallbackValue: { rates: { TRY: 43.87 } }
                }
            );

            const rate = data?.rates?.TRY || 43.87;
            return { rate, usdToTry: rate };
        } catch (error) {
            console.warn('Exchange rate fetch failed, using fallback:', error);
            return { rate: 43.87, usdToTry: 43.87 };
        }
    }

    /**
     * Get Jetton (Token) holders count
     */
    async getJettonHolders(jettonAddress: string): Promise<string> {
        try {
            const data = await this.fetchWithRetry(
                `https://tonapi.io/v2/jettons/${jettonAddress}`,
                {
                    timeout: 8000,
                    retries: 2,
                    fallbackValue: null
                }
            );

            if (data?.holders_count) {
                return data.holders_count.toLocaleString();
            }
            return '1,248+';
        } catch (error) {
            console.warn('Jetton holders fetch failed, using fallback:', error);
            return '1,248+';
        }
    }

    /**
     * Get live TON price in USD from TON API
     */
    async getTonPrice(): Promise<number> {
        try {
            const data = await this.fetchWithRetry(
                'https://tonapi.io/v2/rates?tokens=ton&currencies=usd',
                {
                    timeout: 6000,
                    retries: 1,
                    fallbackValue: null
                }
            );
            const price = data?.rates?.TON?.prices?.USD;
            if (price && price > 0) {
                console.log('[TON Price] ✅ Live:', price);
                return price;
            }
        } catch {
            console.warn('[TON Price] Failed, using fallback');
        }
        return 3.5; // fallback
    }

    /**
     * Get TASTE token price from GeckoTerminal API
     * Uses direct call — CORS proxy only as last resort
     */
    async getTastePrice(): Promise<{ price: number; change: number }> {
        const STONFI_POOL = import.meta.env.VITE_POOL_ADDRESS || 'EQCGEHrBuuoKVJ_0LqQy38F-c-pN-Jrz0M_ASdCtJxZL74nS';
        const API_URL = `https://api.geckoterminal.com/api/v2/networks/ton/pools/${STONFI_POOL}`;

        // Try direct first, then a single reliable CORS proxy
        const SOURCES = [
            { url: API_URL, name: 'direct' },
            { url: `https://corsproxy.io/?${encodeURIComponent(API_URL)}`, name: 'corsproxy.io' },
        ];

        for (const source of SOURCES) {
            try {
                console.log(`[Price] Trying ${source.name}...`);
                const data = await this.fetchWithRetry(source.url, {
                    timeout: 6000,
                    retries: 0,
                    fallbackValue: null
                });

                if (data?.data?.attributes) {
                    const attrs = data.data.attributes;
                    const price = parseFloat(attrs.base_token_price_usd || '0');
                    const change = parseFloat(attrs.price_change_percentage?.h24 || '0');

                    if (price > 0) {
                        console.log(`[Price] ✅ Success via ${source.name}:`, { price: price.toFixed(6), change: change.toFixed(2) });
                        return { price, change };
                    }
                }
            } catch {
                // Silent fail, try next source
            }
        }

        console.warn('[Price] All sources failed, using cached fallback');
        return {
            price: 0.00135,
            change: 0.0
        };
    }

    /**
     * Get Jetton Wallet Address for a user
     */
    async getJettonWalletAddress(userAddress: string, jettonMaster: string): Promise<string> {
        try {
            const data = await this.fetchWithRetry(
                `https://tonapi.io/v2/jettons/${jettonMaster}/wallets/${userAddress}`,
                { timeout: 8000, retries: 2, fallbackValue: null }
            );
            return data?.address || '';
        } catch {
            return '';
        }
    }

    /**
     * Get Jetton Balance directly for a user
     */
    async getJettonBalance(userAddress: string, jettonMaster: string): Promise<number> {
        if (!userAddress || !jettonMaster) return 0;
        try {
            const data = await this.fetchWithRetry(
                `https://tonapi.io/v2/accounts/${userAddress}/jettons/${jettonMaster}`,
                { timeout: 8000, retries: 2, fallbackValue: null }
            );
            // Balance is returned in nano
            const balanceNano = data?.balance || '0';
            return parseFloat(balanceNano) / 1000000000;
        } catch {
            return 0;
        }
    }

    /**
     * Health check for API connectivity
     */
    async checkConnectivity(): Promise<boolean> {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);

            await fetch('https://tonapi.io/v2/status', {
                signal: controller.signal,
                method: 'HEAD',
            });

            clearTimeout(timeoutId);
            return true;
        } catch (error) {
            console.warn('Connectivity check failed:', error);
            return false;
        }
    }
}

export const apiService = new ApiService();
