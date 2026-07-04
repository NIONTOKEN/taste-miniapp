/**
 * QAI Wallet — History Service v2
 * Tüm ağlar için gerçek işlem geçmişi
 */

const HELIUS_KEY = '87eed0d8-1170-4505-86bd-e05a5f045dcb';

const ft = async (url, ms = 8000) => {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try { const r = await fetch(url, { signal: ctrl.signal }); clearTimeout(t); return r; }
  catch (e) { clearTimeout(t); throw e; }
};

/** EVM (ETH/BNB/ARB/BASE/MATIC) */
export const getEVMHistory = async (address, network = 'ETH') => {
  if (!address || address === 'N/A') return [];
  
  const scannerConfigs = {
    ETH:   { api: 'https://eth.blockscout.com/api/v2', symbol: 'ETH' },
    BNB:   { api: 'https://bsc.blockscout.com/api/v2', symbol: 'BNB' },
    ARB:   { api: 'https://arbitrum.blockscout.com/api/v2', symbol: 'ETH' },
    BASE:  { api: 'https://base.blockscout.com/api/v2', symbol: 'ETH' },
    MATIC: { api: 'https://polygon.blockscout.com/api/v2', symbol: 'POL' },
    opBNB: { api: 'https://opbnb.blockscout.com/api/v2', symbol: 'BNB' },
    MONAD: { api: 'https://monad.blockscout.com/api/v2', symbol: 'MON' }
  };

  const cfg = scannerConfigs[network] || scannerConfigs.ETH;

  try {
    // CORS bypass logic: Blockscout instances sometimes block direct fetches from specific origins.
    // Try native fetch first, if blocked, it will fall through to catch.
    const res = await ft(`${cfg.api}/addresses/${address}/transactions?filter=to%20%7C%20from&limit=25`);
    if (!res.ok) throw new Error('CORS or Network Error');
    const data = await res.json();
    
    return (data.items || []).map(tx => {
      const isOutgoing = tx.from?.hash?.toLowerCase() === address.toLowerCase();
      const val = tx.value ? (parseFloat(tx.value) / 1e18).toFixed(6) : '0';
      
      return {
        hash: tx.hash,
        from: tx.from?.hash || 'External',
        to: tx.to?.hash || 'External',
        value: val,
        symbol: cfg.symbol,
        timestamp: new Date(tx.timestamp).getTime(),
        status: tx.status === 'ok' ? 'success' : 'failed',
        network: network,
        type: isOutgoing ? 'sent' : 'received'
      };
    });
  } catch (e) {
    // Fallback strategy for history indexers
    return [];
  }
};





/** TON — TonAPI */
export const getTonHistory = async (addrs) => {
  const address = typeof addrs === 'string' ? addrs : addrs.TON;
  if (!address || address === 'N/A') return [];
  const allTonAddrs = typeof addrs === 'string' 
    ? [address.toLowerCase()] 
    : [addrs.TON, addrs.TON_RAW].filter(Boolean).map(a => a.toLowerCase());

  try {
    const res = await ft(`https://tonapi.io/v2/accounts/${address}/events?limit=20`);
    const data = await res.json();
    if (!data.events) return [];
    
    return data.events.map(e => {
      const action = e.actions[0];
      if (!action) return null;
      let amount = '0', symbol = 'TON', type = 'received', from = 'External', to = address;

      if (action.type === 'TonTransfer' && action.TonTransfer) {
        amount = (action.TonTransfer.amount / 1e9).toFixed(4);
        const senderStr = action.TonTransfer.sender?.address?.toLowerCase() || '';
        type = allTonAddrs.includes(senderStr) ? 'sent' : 'received';
        from = action.TonTransfer.sender?.address || 'External';
        to = action.TonTransfer.recipient?.address || address;
      } else if (action.type === 'JettonTransfer' && action.JettonTransfer) {
        const dec = action.JettonTransfer.jetton?.decimals || 9;
        amount = (parseInt(action.JettonTransfer.amount) / Math.pow(10, dec)).toFixed(4);
        symbol = action.JettonTransfer.jetton?.symbol || 'Jetton';
        const senderStr = action.JettonTransfer.sender?.address?.toLowerCase() || '';
        type = allTonAddrs.includes(senderStr) ? 'sent' : 'received';
        from = action.JettonTransfer.sender?.address || 'External';
        to = action.JettonTransfer.recipient?.address || address;
      } else {
        return null;
      }

      return {
        hash: e.event_id,
        from, to, value: amount,
        timestamp: e.timestamp * 1000,
        status: !e.in_progress ? 'success' : 'failed',
        network: 'TON',
        type, symbol
      };
    }).filter(Boolean);
  } catch (err) {
    return [];
  }
};

// ── Geçmiş Önbelleği (2 Dakika)
const _histCache = { data: null, ts: 0 };

export const fetchAllHistory = async (addresses) => {
  if (!addresses) return [];
  
  // Cache kontrolü
  if (_histCache.data && Date.now() - _histCache.ts < 60000) { // 1 dakikaya dusuruldu
    return _histCache.data;
  }

  const results = await Promise.allSettled([
    getEVMHistory(addresses.ETH, 'ETH'),
    getEVMHistory(addresses.BNB, 'BNB'),
    getEVMHistory(addresses.opBNB, 'opBNB'),
    getEVMHistory(addresses.ARB, 'ARB'),
    getEVMHistory(addresses.BASE, 'BASE'),
    getEVMHistory(addresses.MATIC, 'MATIC'),
    getEVMHistory(addresses.MONAD, 'MONAD'),
    getTonHistory(addresses)
  ]);

  const combined = results
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value || []);

  const sorted = combined
    .filter(tx => tx.hash && tx.timestamp > 0)
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 100); // Daha fazla islem goster

  _histCache.data = sorted;
  _histCache.ts = Date.now();
  
  return sorted;
};


