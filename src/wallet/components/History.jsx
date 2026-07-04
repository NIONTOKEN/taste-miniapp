import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, ExternalLink, RefreshCw, Clock, ChevronLeft } from 'lucide-react';
import { fetchAllHistory } from '../historyService';

const History = ({ walletData, t }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    setLoading(true);
    try {
      if (!walletData?.addresses) {
        setHistory([]);
        setLoading(false);
        return;
      }
      const data = await fetchAllHistory(walletData.addresses);
      setHistory(data);
    } catch (e) {

      console.error("History fetch error:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, [walletData]);

  const formatDate = (timestamp) => {
    const d = new Date(timestamp);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ padding: '15px 20px', paddingBottom: '120px', background: 'var(--bg-main)', minHeight: '100vh' }}>
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', marginTop: '10px' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '1000', margin: 0, letterSpacing: '-1px' }}>{t('history.title')}</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, fontWeight: 'bold', opacity: 0.7 }}>Recent activity across all chains</p>
        </div>
        <motion.div 
          whileTap={{ scale: 0.9, rotate: 180 }}
          onClick={loadHistory} 
          style={{ 
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', 
              borderRadius: '16px', width: '45px', height: '45px', 
              display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' 
          }}
        >
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
        </motion.div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '120px', gap: '15px' }}>
          <div style={{ width: '45px', height: '45px', border: '4px solid rgba(99,102,241,0.1)', borderTop: '4px solid var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '0.85rem', fontWeight: '900', color: 'var(--text-muted)' }}>Fetching transactions...</span>
        </div>
      ) : history.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '120px', color: 'var(--text-muted)' }}>
          <div style={{ width: '100px', height: '100px', background: 'rgba(255,255,255,0.02)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 25px' }}>
            <Clock size={45} style={{ opacity: 0.2 }} />
          </div>
          <p style={{ fontWeight: '1000', fontSize: '1.1rem', color: '#fff' }}>No transactions yet</p>
          <p style={{ fontSize: '0.85rem', opacity: 0.6 }}>Your latest activity will appear here.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {history.map((tx, i) => {
            const isOutgoing = tx.type === 'sent' || tx.from.toLowerCase() === walletData?.addresses?.[tx.network]?.toLowerCase() || (tx.network === 'TON' && tx.from.toLowerCase() === walletData?.addresses?.TON_RAW?.toLowerCase());
            
            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.05, type: 'spring', damping: 20 }}
                key={`${tx.hash}-${i}`}
                style={{ 
                    background: 'var(--bg-card)', borderRadius: '28px', padding: '18px', 
                    border: '1px solid var(--glass-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    position: 'relative', overflow: 'hidden'
                }}
              >
                {/* Subtle side glow for outgoing/incoming */}
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', background: isOutgoing ? '#ef4444' : '#22c55e', opacity: 0.5 }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '18px', 
                      background: isOutgoing ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))' : 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))', 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center',
                      border: isOutgoing ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(34, 197, 94, 0.2)'
                    }}>
                      {isOutgoing ? <ArrowUpRight size={22} color="#ef4444" strokeWidth={3} /> : <ArrowDownLeft size={22} color="#22c55e" strokeWidth={3} />}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '1000', color: '#fff' }}>
                        {isOutgoing ? 'Sent' : 'Received'} {tx.symbol || tx.network}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>{formatDate(tx.timestamp)}</span>
                        <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: 'var(--text-muted)', opacity: 0.5 }} />
                        <span style={{ fontSize: '0.7rem', color: tx.status === 'success' ? '#22c55e' : '#ef4444', fontWeight: '1000', textTransform: 'uppercase' }}>{tx.status}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.15rem', fontWeight: '1000', color: isOutgoing ? '#ef4444' : '#22c55e', letterSpacing: '-0.5px' }}>
                      {isOutgoing ? '-' : '+'}{Number(tx.value).toFixed(tx.network === 'TON' ? 2 : 4)}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>${(Number(tx.value) * 1.5).toFixed(2)}</div>
                  </div>
                </div>
                
                <div style={{ marginTop: '18px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace', background: 'rgba(255,255,255,0.03)', padding: '4px 8px', borderRadius: '8px' }}>
                            {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                        </span>
                    </div>
                    <a 
                      href={
                        tx.network === 'ETH' ? `https://etherscan.io/tx/${tx.hash}` : 
                        tx.network === 'BNB' ? `https://bscscan.com/tx/${tx.hash}` : 
                        tx.network === 'TON' ? `https://tonviewer.com/transaction/${tx.hash}` :
                        tx.network === 'SOL' ? `https://solscan.io/tx/${tx.hash}` :
                        tx.network === 'TRX' ? `https://tronscan.org/#/transaction/${tx.hash}` :
                        tx.network === 'ARB' ? `https://arbiscan.io/tx/${tx.hash}` :
                        tx.network === 'BASE' ? `https://basescan.org/tx/${tx.hash}` :
                        tx.network === 'MATIC' ? `https://polygonscan.com/tx/${tx.hash}` :
                        tx.network === 'BTC' ? `https://mempool.space/tx/${tx.hash}` :
                        `https://testnet.monadexplorer.com/tx/${tx.hash}`
                      }
                      target="_blank" 
                      rel="noopener noreferrer"

                      style={{ 
                          color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '6px', 
                          fontSize: '0.8rem', textDecoration: 'none', fontWeight: '1000',
                          background: 'rgba(99, 102, 241, 0.1)', padding: '6px 12px', borderRadius: '12px'
                      }}
                    >
                        Explore <ExternalLink size={14} strokeWidth={3} />
                    </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
      `}</style>
    </div>
  );
};

export default History;
