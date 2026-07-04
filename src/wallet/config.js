export const WALLET_CONFIG = {
  APP_NAME: "TAI WALLET",
  VERSION: "1.0.0",
  
  // KASA (ADMIN) HESAPLARI — TÜM GELİRLER BURAYA GİDER
  RECEIVERS: {
    TON:   "UQBCQobFkbwmX4fb6SRzjd8C1MOiNZzv0lqoS2sHiybCJiVI"
  },

  // ADMIN / SAHİP ADRES LİSTESİ (SADECE BU ADRESLER ADMIN PANELİNİ GÖREBİLİR)
  ADMIN_ADDRESSES: [
    "UQA5Bzh4JyfIoQbd9vgGFowhEhCKIvSpG4m9F8UNY8L4_nBJ",  // TON (Slot Kasa) - Patron
    "UQBCQobFkbwmX4fb6SRzjd8C1MOiNZzv0lqoS2sHiybCJiVI",  // TON (Ana Kasa) - Patron
    "UQBi3h7ScwiHGHUdUXJBVMm6Rv2JC4e09kcm6ltQuuZU78C5",  // TON (Non-Bounceable) - Patron
    "EQBi3h7ScwiHGHUdUXJBVMm6Rv2JC4e09kcm6ltQuuZU7518"   // TON (Bounceable) - Patron
  ],

  LISTING_TIERS: {
    TIER_1: { name: "Standart (Ücretsiz)", priceUSD: 0, priority: 1, duration: "24 Saat" },
    TIER_2: { name: "Öne Çıkan ($25)", priceUSD: 25, priority: 2, duration: "24 Saat Öne Çıkarılmış" },
    TIER_3: { name: "VIP Popüler ($50)", priceUSD: 50, priority: 3, duration: "48 Saat Öne Çıkarılmış" }
  },
  LISTING_DISCOUNTS: {
    TASTE: 0.15
  },
  TRANSFER_FEE: 0.005, // %0.5

  NETWORKS: [
    { id: 'ton',   name: 'TON',       symbol: 'TON',  color: '#0098EA', type: 'TON',   chainId: 'ton', derivation: "m/44'/396'/0'/0'/0'" }
  ],

  TOKENS: [
    { id: 'toncoin',       symbol: 'TON',  name: 'Toncoin',    network: 'TON',   networkKey: 'TON',   icon: 'https://assets.coingecko.com/coins/images/17980/standard/ton_symbol.png',     balance: 0, price: 0, contract: 'native', isNative: true, decimals: 9 },
    { id: 'taste',         symbol: 'TAI',  name: 'TASTE AI',   network: 'TON',   networkKey: 'TON',   icon: 'https://storage.dyor.io/jettons/EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-/image.jpeg', balance: 0, price: 0.000448, contract: 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-', isNative: false, chainId: 'ton', decimals: 9, noGecko: true },
    { id: 'tether-ton',    symbol: 'USDT', name: 'Tether',     network: 'TON',   networkKey: 'TON',   icon: 'https://assets.coingecko.com/coins/images/325/standard/tether.png', balance: 0, price: 1, contract: 'EQCxE6mUtQWqXn3EBU7ndS4fNpkRtd9p91uS889S3o-2A1a8', isNative: false, chainId: 'ton', decimals: 6 }
  ],

  FIAT_CURRENCIES: {
    USD: { symbol: "$", rate: 1.0 },
    TRY: { symbol: "₺", rate: 44.52 },
    EUR: { symbol: "€", rate: 0.92 },
    GBP: { symbol: "£", rate: 0.79 },
    RUB: { symbol: "₽", rate: 92.50 },
    IRR: { symbol: "﷼", rate: 42000 },
    JPY: { symbol: "¥", rate: 153.20 },
    CNY: { symbol: "¥", rate: 7.24 },
    AED: { symbol: "د.إ", rate: 3.67 },
    KWD: { symbol: "د.ك", rate: 0.31 },
    BHD: { symbol: "ب.د", rate: 0.38 },
    JOD: { symbol: "د.ا", rate: 0.71 },
    KES: { symbol: "KSh", rate: 130.50 }
  },

  RPC_NODES: {
    TON: [
      'https://toncenter.com/api/v2/jsonRPC',
      'https://tonapi.io/v2/jsonRPC',
      'https://ton.access.orbs.network/MT4c3JpFSMZVMSTZmIi2GFJFewI_E8yS/mainnet/toncenter-api-v2/jsonRPC'
    ]
  },

  // STAKING POOL ADRESLERİ (Platform treasury = staking receiver)
  STAKING_POOLS: {
    ETH:   '0xe46b7af3f5ece1a0eb596b774f6a2c26d25d69a0',
    BNB:   '0xe46b7af3f5ece1a0eb596b774f6a2c26d25d69a0',
    TON:   'UQBCQobFkbwmX4fb6SRzjd8C1MOiNZzv0lqoS2sHiybCJiVI',
    MATIC: '0xe46b7af3f5ece1a0eb596b774f6a2c26d25d69a0',
    ARB:   '0xe46b7af3f5ece1a0eb596b774f6a2c26d25d69a0',
    MONAD: '0xe46b7af3f5ece1a0eb596b774f6a2c26d25d69a0',
    TRX:   'TEr86jLeJtG8oXNXkhFwZ1uU4qD9A9MHpK',
    SOL:   'AemsXPR9MvDcWsZfqgVoy5wivBAwnq9YRUyuFLbjiF4G',
    BTC:   'bc1qwm4pgzn2nmuxs60zwclfhakrqheh5ufrr53gh0',
  },
  SERVICE_FEE: 0.015, // %1.5 staking servis ücreti

  // TOKEN DISCOVERY API ENDPOINTS
  DISCOVERY_APIS: {
    // Yeni çıkan tokenlar
    DEXSCREENER_NEW:    'https://api.dexscreener.com/token-profiles/latest/v1',
    DEXSCREENER_SEARCH: 'https://api.dexscreener.com/latest/dex/search?q=',
    DEXSCREENER_PAIRS:  'https://api.dexscreener.com/latest/dex/tokens/',
    // Trending
    COINGECKO_TRENDING: 'https://api.coingecko.com/api/v3/search/trending',
    COINGECKO_NEW:      'https://api.coingecko.com/api/v3/coins/list/new',
    COINGECKO_SEARCH:   'https://api.coingecko.com/api/v3/search?query=',
    // TON yeni tokenlar
    TONAPI_JETTONS:     'https://tonapi.io/v2/jettons?limit=20',
    // GeckoTerminal (ücretsiz, geniş kapsam)
    GECKOTERMINAL_NEW:  'https://api.geckoterminal.com/api/v2/networks/trending_pools?page=1',
    GECKOTERMINAL_ETH:  'https://api.geckoterminal.com/api/v2/networks/eth/new_pools?page=1',
    GECKOTERMINAL_BSC:  'https://api.geckoterminal.com/api/v2/networks/bsc/new_pools?page=1',
    GECKOTERMINAL_TON:  'https://api.geckoterminal.com/api/v2/networks/ton/new_pools?page=1',
  },

  // EXPLORER LINKLERI
  EXPLORERS: {
    ETH:   'https://etherscan.io/token/',
    BNB:   'https://bscscan.com/token/',
    opBNB: 'https://opbnbscan.com/token/',
    ARB:   'https://arbiscan.io/token/',
    BASE:  'https://basescan.org/token/',
    MATIC: 'https://polygonscan.com/token/',
    TON:   'https://tonscan.org/jetton/',
    MONAD: 'https://testnet.monadvision.com/address/',
    NONE:  'https://google.com/search?q=',
  }
};
