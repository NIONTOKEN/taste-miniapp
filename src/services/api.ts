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
                    fallbackValue: { rates: { TRY: 34.5 } }
                }
            );

            const rate = data?.rates?.TRY || 34.5;
            return { rate, usdToTry: rate };
        } catch (error) {
            console.warn('Exchange rate fetch failed, using fallback:', error);
            return { rate: 34.5, usdToTry: 34.5 };
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
     * Get TASTE token price from GeckoTerminal API
     * Uses both DeDust and STON.fi pools with multiple CORS proxies for reliability
     */
    async getTastePrice(): Promise<{ price: number; change: number }> {
        // Pool addresses - STON.fi v2 is the main pool
        const STONFI_POOL = 'EQCGEHrBuuoKVJ_0LqQy38F-c-pN-Jrz0M_ASdCtJxZL74nS';

        // Multiple CORS proxies for reliability
        const CORS_PROXIES = [
            '', // Try direct first
            'https://corsproxy.io/?',
            'https://api.allorigins.win/raw?url=',
            'https://cors-anywhere.herokuapp.com/'
        ];

        const pools = [STONFI_POOL];

        for (const poolAddress of pools) {
            const API_URL = `https://api.geckoterminal.com/api/v2/networks/ton/pools/${poolAddress}`;

            for (const proxy of CORS_PROXIES) {
                try {
                    const url = proxy ? `${proxy}${encodeURIComponent(API_URL)}` : API_URL;
                    const proxyName = proxy ? proxy.split('/')[2] || 'proxy' : 'direct';
                    console.log(`[Price] Trying ${proxyName} for pool ${poolAddress.slice(0, 10)}...`);

                    const data = await this.fetchWithRetry(url, {
                        timeout: 6000,
                        retries: 0,
                        fallbackValue: null
                    });

                    if (data?.data?.attributes) {
                        const attrs = data.data.attributes;
                        const price = parseFloat(attrs.base_token_price_usd || '0');
                        const change = parseFloat(attrs.price_change_percentage?.h24 || '0');

                        if (price > 0) {
                            console.log(`[Price] ✅ Success via ${proxyName}:`, { price: price.toFixed(6), change: change.toFixed(2) });
                            return { price, change };
                        }
                    }
                } catch (error) {
                    // Silent fail, try next
                }
            }
        }

        console.warn('[Price] All sources failed, using cached fallback');
        return {
            price: 0.00135,
            change: 0.0
        };
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
