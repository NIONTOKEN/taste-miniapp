// STON.fi Live Pool & Price Service for TAI and TON ecosystem tokens

export interface LiveTokenPrice {
  priceInTon: number;
  priceInUsd: number;
  volume24hUsd: string;
  reserveTon: number;
  reserveTai: number;
  lastUpdated: number;
}

const TAI_POOL_ADDRESS = 'EQCGEHrBuuoKVJ_0LqQy38F-c-pN-Jrz0M_ASdCtJxZL74nS';
let cachedTaiPrice: LiveTokenPrice | null = null;
let lastFetchTime = 0;

export async function fetchLiveTaiPrice(): Promise<LiveTokenPrice> {
  const now = Date.now();
  if (cachedTaiPrice && now - lastFetchTime < 15000) {
    return cachedTaiPrice;
  }

  try {
    // 1. Get TON/USD live price
    let tonUsdPrice = 5.32;
    try {
      const tonRes = await fetch('https://api.ston.fi/v1/assets/EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c');
      if (tonRes.ok) {
        const tonData = await tonRes.json();
        if (tonData?.asset?.dex_usd_price) {
          tonUsdPrice = parseFloat(tonData.asset.dex_usd_price);
        }
      }
    } catch {}

    // 2. Query TAI/TON STON.fi pool reserves
    const res = await fetch(`https://api.ston.fi/v1/pools/${TAI_POOL_ADDRESS}`);
    if (res.ok) {
      const data = await res.json();
      const pool = data.pool;
      if (pool && pool.reserve0 && pool.reserve1) {
        const r0 = parseFloat(pool.reserve0) / 1e9; // TON reserve
        const r1 = parseFloat(pool.reserve1) / 1e9; // TAI reserve
        
        if (r1 > 0) {
          const priceInTon = r0 / r1;
          const priceInUsd = priceInTon * tonUsdPrice;
          const volume = pool.volume_24h_usd ? parseFloat(pool.volume_24h_usd) : 0;
          
          cachedTaiPrice = {
            priceInTon,
            priceInUsd,
            volume24hUsd: volume > 1000 ? `$${(volume / 1000).toFixed(1)}K` : `$${volume.toFixed(2)}`,
            reserveTon: r0,
            reserveTai: r1,
            lastUpdated: now
          };
          lastFetchTime = now;
          return cachedTaiPrice;
        }
      }
    }
  } catch (err) {
    console.warn('[stonfiService] Failed to fetch live TAI pool:', err);
  }

  // Fallback if network drops (computed from known pool reserves)
  return {
    priceInTon: 0.00017787,
    priceInUsd: 0.000946,
    volume24hUsd: '$1.45K',
    reserveTon: 97.44,
    reserveTai: 547826.92,
    lastUpdated: now
  };
}
