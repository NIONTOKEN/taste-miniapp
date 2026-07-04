/**
 * QAI Wallet — Swap Service (Li.Fi Entegrasyonu)
 */

const LIFI_API = 'https://li.quest/v1';

/**
 * Swap için en iyi rotayı (quote) al
 */
export const getSwapQuote = async (fromChain, toChain, fromToken, toToken, fromAmount, fromAddress) => {
  // fromChain/toChain: Chain ID'leri (ETH: 1, BSC: 56, vb.)
  // fromAmount: En küçük birim (wei/lamport) değil, insan okuyabilir formatta (ethers formatı)
  
  const url = `${LIFI_API}/quote?fromChain=${fromChain}&toChain=${toChain}&fromToken=${fromToken}&toToken=${toToken}&fromAmount=${fromAmount}&fromAddress=${fromAddress}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data; // { transactionRequest, estimate, ... }
  } catch (e) {
    console.error("Swap quote hatası:", e);
    return null;
  }
};

/**
 * Zincirler arası veya aynı zincirde tokenları bulmak için yardımcı
 * Li.Fi chain ID'leri:
 * Ethereum: 1, BSC: 56, Polygon: 137, Arbitrum: 42161
 */
export const NETWORK_IDS = {
  ETH: 1,
  BNB: 56,
  TON: 3, // Örnek id, TON genelde LiFi'da farklıdır
};
