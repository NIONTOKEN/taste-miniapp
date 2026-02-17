import { Address, toNano } from '@ton/ton';

const TASTE_ADDRESS = Address.parse('EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-');

/**
 * Get DeDust swap URL for TON -> TASTE
 */
export function getSwapUrl(): string {
    return `https://dedust.io/swap/TON/${TASTE_ADDRESS.toString()}`;
}

/**
 * Create basic swap transaction parameters
 * Note: For reliable swaps, we recommend using the DeDust web interface
 */
export function createSwapParams(amountInTon: number, userAddress: string): { to: string, amount: string } {
    const NATIVE_VAULT = Address.parse('EQDa4VOnTYdHv43TTYYdTABnCc0H_tG6kLQSAKCYvAboyZBu');
    const amountIn = toNano(amountInTon);

    return {
        to: NATIVE_VAULT.toString(),
        amount: amountIn.toString(),
    };
}

