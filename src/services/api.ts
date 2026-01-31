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
     * Get TASTE token price (placeholder - can be implemented with real API)
     */
    /**
     * Get TASTE token price from GeckoTerminal API
     */
    async getTastePrice(): Promise<{ price: number; change: number }> {
        const POOL_ADDRESS = 'EQCGEHrBuuoKVJ_0LqQy38F-c-pN-Jrz0M_ASdCtJxZL74nS';
        try {
            const data = await this.fetchWithRetry(
                `https://api.geckoterminal.com/api/v2/networks/ton/pools/${POOL_ADDRESS}`,
                {
                    timeout: 8000,
                    retries: 2,
                    fallbackValue: null
                }
            );

            if (data?.data?.attributes) {
                const attrs = data.data.attributes;
                return {
                    price: parseFloat(attrs.base_token_price_usd || '0'),
                    change: parseFloat(attrs.price_change_percentage?.h24 || '0')
                };
            }

            throw new Error('Invalid API response format');
        } catch (error) {
            console.warn('Price fetch failed, using fallback:', error);
            // Fallback to latest known values
            return {
                price: 0.00112, // Updated from GeckoTerminal
                change: 0.0     // Updated from GeckoTerminal
            };
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
