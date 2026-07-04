import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ShieldCheck, Zap, Check, AlertTriangle, ExternalLink, Trash2, Activity, Star as StarIcon, Ban, MessageCircle, Clock, RotateCcw, Trophy, TrendingUp } from 'lucide-react';

// Tier renk ve bilgi tanımları
const TIER_INFO = {
  TIER_1: { label: 'Ücretsiz',   color: '#6b7280', bg: 'rgba(107,114,128,0.12)', border: 'rgba(107,114,128,0.25)', desc: 'Sadece cüzdana eklenir, trend yok' },
  TIER_2: { label: '$25 · Trend',color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.35)',   desc: '24 saat QAI trend listesi' },
  TIER_3: { label: '$50 · VIP',  color: '#22c55e', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.35)',   desc: '48 saat Trend + Alım/Satım' },
};

const AdminPanel = ({ onBack, walletData }) => {
  const [pendingListings, setPendingListings] = useState([]);
  const [approvedListings, setApprovedListings] = useState([]);
  const [blacklist, setBlacklist] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, revenue: 0 });

  useEffect(() => {
    const load = () => {
      const all = JSON.parse(localStorage.getItem('user_listings') || '[]');
      setPendingListings(all.filter(i => i.status === 'pending'));
      setApprovedListings(all.filter(i => i.status === 'approved'));
      setBlacklist(JSON.parse(localStorage.getItem('qai_blacklist') || '[]'));
      setStats({
        pending: all.filter(i => i.status === 'pending').length,
        approved: all.filter(i => i.status === 'approved').length,
        rejected: all.filter(i => i.status === 'rejected').length,
        revenue: all.filter(i => i.status !== 'pending').reduce((s, i) => s + (i.tier === 'TIER_2' ? 25 : i.tier === 'TIER_3' ? 50 : 0), 0)
      });
    };
    load();
    const iv = setInterval(load, 3000);
    return () => clearInterval(iv);
  }, []);

  const approve = (id, asTrend = false) => {
    const all = JSON.parse(localStorage.getItem('user_listings') || '[]');
    const item = all.find(i => i.id === id);
    // Trend süresi: TIER_2 = 24 saat, TIER_3 = 48 saat
    const trendHours = item?.tier === 'TIER_3' ? 48 : 24;
    const updated = all.map(i => i.id === id ? {
      ...i, status: 'approved', verified: true,
      isTrend: asTrend,
      trendUntil: asTrend ? Date.now() + trendHours * 3600000 : null,
      approvedAt: Date.now()
    } : i);
    localStorage.setItem('user_listings', JSON.stringify(updated));
    setPendingListings(prev => prev.filter(p => p.id !== id));
    setApprovedListings(updated.filter(i => i.status === 'approved'));
    try { new Audio('https://assets.mixkit.co/active_storage/sfx/1071/1071-preview.mp3').play().catch(() => {}); } catch {}
  };

  const reject = (id) => {
    const all = JSON.parse(localStorage.getItem('user_listings') || '[]');
    const updated = all.filter(i => i.id !== id);
    localStorage.setItem('user_listings', JSON.stringify(updated));
    setPendingListings(prev => prev.filter(p => p.id !== id));
    setApprovedListings(prev => prev.filter(p => p.id !== id));
  };

  const addToBlacklist = (contract, id) => {
    if (!contract) return;
    const bl = JSON.parse(localStorage.getItem('qai_blacklist') || '[]');
    if (!bl.includes(contract)) {
      bl.push(contract);
      localStorage.setItem('qai_blacklist', JSON.stringify(bl));
      setBlacklist(bl);
    }
    if (id) reject(id);
  };

  // ── Spin Stats ─────────────────────────────────────────────────────────────
  const [spinStats, setSpinStats] = useState({ investments:[], winners:[], totalUSD:0, playerCount:0 });
  useEffect(() => {
    const inv     = JSON.parse(localStorage.getItem('qai_spin_investments') || '[]');
    const winners = JSON.parse(localStorage.getItem('qai_jackpot_winners')  || '[]');
    const totalUSD = inv.reduce((s, i) => s + (i.usd || 0), 0);
    const byCoin = {};
    inv.forEach(i => { byCoin[i.coin] = (byCoin[i.coin] || 0) + (i.usd || 0); });
    setSpinStats({ investments:inv, winners, totalUSD, playerCount:inv.length, byCoin });
  }, [activeTab]);

  const tabs = [
    { id: 'pending',   label: 'Bekleyenler',  count: stats.pending },
    { id: 'approved',  label: 'Onaylananlar', count: stats.approved },
    { id: 'blacklist', label: 'Kara Liste',   count: blacklist.length },
    { id: 'spin',      label: 'Spin Stats',   count: spinStats.winners.length },
  ];

  return (
    <motion.div initial={{ x: 300 }} animate={{ x: 0 }} style={{ padding: '20px', paddingBottom: '120px', minHeight: '100vh', background: 'var(--bg-main)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <ChevronLeft size={28} onClick={onBack} style={{ cursor: 'pointer' }} />
          <h2 style={{ fontSize: '1.3rem', fontWeight: '900', margin: 0 }}>Admin Paneli</h2>
        </div>
        <div style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '0.68rem', padding: '5px 12px', background: 'rgba(124,58,237,0.1)', borderRadius: '10px' }}>PATRON MODU</div>
      </div>

      {/* Tier Açıklamaları */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' }}>
        {Object.entries(TIER_INFO).map(([key, t]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: t.bg, borderRadius: '12px', padding: '9px 13px', border: `1px solid ${t.border}` }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: t.color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.72rem', fontWeight: '900', color: t.color }}>{t.label}</span>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>— {t.desc}</span>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px', marginBottom: '18px' }}>
        {[
          { label: 'Bekleyen',  value: stats.pending,          color: '#f59e0b', icon: <Activity size={12} /> },
          { label: 'Onaylanan', value: stats.approved,         color: '#22c55e', icon: <Check size={12} /> },
          { label: 'Reddedilen',value: stats.rejected,         color: '#ef4444', icon: <Trash2 size={12} /> },
          { label: 'Gelir $',   value: stats.revenue.toFixed(0), color: '#a78bfa', icon: <Zap size={12} /> },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-card)', padding: '12px 8px', borderRadius: '14px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
            <div style={{ color: s.color, marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>{s.icon}</div>
            <div style={{ fontSize: '0.9rem', fontWeight: '900' }}>{s.value}</div>
            <div style={{ fontSize: '0.5rem', color: 'var(--text-muted)', fontWeight: '700', marginTop: '2px' }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: 'var(--bg-card)', borderRadius: '13px', padding: '3px', marginBottom: '18px', border: '1px solid var(--glass-border)' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ flex: 1, padding: '8px', borderRadius: '10px', border: 'none', background: activeTab === tab.id ? 'var(--primary)' : 'transparent', color: activeTab === tab.id ? '#fff' : 'var(--text-muted)', fontWeight: '700', fontSize: '0.7rem', cursor: 'pointer', position: 'relative' }}>
            {tab.label}
            {tab.count > 0 && <span style={{ position: 'absolute', top: '2px', right: '4px', width: '14px', height: '14px', background: '#ef4444', borderRadius: '50%', fontSize: '0.55rem', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{tab.count}</span>}
          </button>
        ))}
      </div>

      {/* ── PENDING ── */}
      {activeTab === 'pending' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {pendingListings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.4 }}>
              <ShieldCheck size={48} style={{ marginBottom: '14px' }} />
              <p>Bekleyen başvuru yok</p>
            </div>
          ) : pendingListings.map(p => {
            const tier = TIER_INFO[p.tier] || TIER_INFO.TIER_1;
            return (
              <div key={p.id} style={{ background: 'var(--bg-card)', padding: '18px', borderRadius: '22px', border: `2px solid ${tier.border}`, position: 'relative', overflow: 'hidden' }}>
                {/* Sol renk şeridi */}
                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: tier.color }} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', paddingLeft: '8px' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '42px', height: '42px', background: tier.bg, borderRadius: '13px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.1rem', fontWeight: '900', color: tier.color }}>
                      {p.symbol?.[0] || '?'}
                    </div>
                    <div>
                      <div style={{ fontWeight: '900', fontSize: '0.95rem' }}>{p.name || p.symbol}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{p.symbol} · {p.network}</div>
                    </div>
                  </div>
                  {/* Tier badge */}
                  <div style={{ padding: '5px 11px', borderRadius: '9px', fontSize: '0.62rem', fontWeight: '900', background: tier.bg, color: tier.color, border: `1px solid ${tier.border}`, textAlign: 'center' }}>
                    <div>{tier.label}</div>
                    <div style={{ fontSize: '0.55rem', opacity: 0.8, marginTop: '1px' }}>{tier.desc}</div>
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px', padding: '11px', background: 'rgba(0,0,0,0.15)', borderRadius: '13px', marginLeft: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '2px' }}>PUAN</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '900', color: p.riskScore > 70 ? '#22c55e' : p.riskScore > 40 ? '#f59e0b' : '#ef4444' }}>{p.riskScore || '—'}/100</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '2px' }}>LİKİDİTE</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '900' }}>${((p.liquidity || 0) / 1000).toFixed(1)}k</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '2px' }}>HAVUZ</div>
                    {p.poolAddress ? (
                      <a href={`https://dexscreener.com/search?q=${p.poolAddress}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.68rem', color: 'var(--primary)', textDecoration: 'none' }}>Gör ↗</a>
                    ) : <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>—</div>}
                  </div>
                </div>

                {/* İletişim notu */}
                {p.contactMsg && (
                  <div style={{ background: 'rgba(99,102,241,0.06)', borderRadius: '11px', padding: '9px 12px', marginBottom: '12px', marginLeft: '8px', border: '1px solid rgba(99,102,241,0.15)', fontSize: '0.7rem', color: 'var(--text-muted)', display: 'flex', gap: '6px' }}>
                    <MessageCircle size={12} style={{ flexShrink: 0, marginTop: '1px' }} />
                    {p.contactMsg}
                  </div>
                )}

                {/* Butonlar */}
                <div style={{ display: 'flex', gap: '7px', paddingLeft: '8px' }}>
                  <button onClick={() => approve(p.id, false)}
                    style={{ flex: 1, padding: '11px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '11px', fontWeight: '900', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                    <Check size={13} /> Onayla
                  </button>
                  {(p.tier === 'TIER_2' || p.tier === 'TIER_3') && (
                    <button onClick={() => approve(p.id, true)}
                      style={{ flex: 1, padding: '11px', background: tier.color, color: '#fff', border: 'none', borderRadius: '11px', fontWeight: '900', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                      <StarIcon size={13} /> Trende Ekle
                    </button>
                  )}
                  <button onClick={() => reject(p.id)}
                    style={{ padding: '11px 13px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '11px', fontWeight: '900', cursor: 'pointer' }}>
                    <Trash2 size={13} />
                  </button>
                  <button onClick={() => addToBlacklist(p.contract, p.id)}
                    style={{ padding: '11px 13px', background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '11px', fontWeight: '900', cursor: 'pointer' }}>
                    <Ban size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── APPROVED ── */}
      {activeTab === 'approved' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {approvedListings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.4 }}>
              <Check size={48} style={{ marginBottom: '14px' }} />
              <p>Henüz onaylanan yok</p>
            </div>
          ) : approvedListings.map(p => {
            const tier = TIER_INFO[p.tier] || TIER_INFO.TIER_1;
            const trendLeft = p.trendUntil ? Math.max(0, Math.ceil((p.trendUntil - Date.now()) / 3600000)) : 0;
            return (
              <div key={p.id} style={{ background: 'var(--bg-card)', padding: '14px 16px', borderRadius: '16px', border: `1px solid ${tier.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '3px', height: '100%', background: tier.color }} />
                <div style={{ paddingLeft: '8px' }}>
                  <div style={{ fontWeight: '900', fontSize: '0.88rem' }}>{p.symbol} — {p.name}</div>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span>{p.network}</span>
                    <span>Puan: {p.riskScore}</span>
                    {p.isTrend && trendLeft > 0 && (
                      <span style={{ color: tier.color, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock size={10} /> {trendLeft}s kaldı
                      </span>
                    )}
                    {p.isTrend && trendLeft === 0 && <span style={{ color: 'var(--text-muted)' }}>Trend süresi doldu</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '7px' }}>
                  {p.contract && (
                    <a href={`https://dexscreener.com/search?q=${p.contract}`} target="_blank" rel="noreferrer"
                      style={{ padding: '7px', background: 'rgba(255,255,255,0.05)', borderRadius: '9px', color: 'var(--primary)', display: 'flex', alignItems: 'center' }}>
                      <ExternalLink size={13} />
                    </a>
                  )}
                  <button onClick={() => reject(p.id)}
                    style={{ padding: '7px', background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '9px', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={13} />
                  </button>
                  <button onClick={() => addToBlacklist(p.contract, p.id)}
                    style={{ padding: '7px', background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '9px', color: '#ef4444', cursor: 'pointer' }}>
                    <Ban size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── SPIN STATS ── */}
      {activeTab === 'spin' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
          {/* Overview Cards */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
            <div style={{ background:'var(--bg-card)', padding:'16px', borderRadius:'18px', border:'1px solid var(--glass-border)', textAlign:'center' }}>
              <TrendingUp size={18} color='#22c55e' style={{ marginBottom:'6px' }}/>
              <div style={{ fontSize:'1.4rem', fontWeight:'900', color:'#22c55e' }}>${spinStats.totalUSD.toFixed(0)}</div>
              <div style={{ fontSize:'0.58rem', color:'var(--text-muted)', fontWeight:'700', marginTop:'2px' }}>TOPLAM GELİR (USD)</div>
            </div>
            <div style={{ background:'var(--bg-card)', padding:'16px', borderRadius:'18px', border:'1px solid var(--glass-border)', textAlign:'center' }}>
              <RotateCcw size={18} color='var(--primary)' style={{ marginBottom:'6px' }}/>
              <div style={{ fontSize:'1.4rem', fontWeight:'900', color:'var(--primary)' }}>{spinStats.playerCount}</div>
              <div style={{ fontSize:'0.58rem', color:'var(--text-muted)', fontWeight:'700', marginTop:'2px' }}>TOPLAM OYUNCU</div>
            </div>
          </div>

          {/* Revenue by Coin */}
          {spinStats.byCoin && Object.keys(spinStats.byCoin).length > 0 && (
            <div style={{ background:'var(--bg-card)', padding:'16px', borderRadius:'18px', border:'1px solid var(--glass-border)' }}>
              <div style={{ fontSize:'0.6rem', fontWeight:'900', color:'var(--text-muted)', letterSpacing:'1px', marginBottom:'12px' }}>COİN BAZLI GELİR</div>
              {Object.entries(spinStats.byCoin).map(([coin, usd]) => (
                <div key={coin} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom:'1px solid var(--glass-border)' }}>
                  <span style={{ fontWeight:'900', fontSize:'0.85rem' }}>{coin}</span>
                  <span style={{ color:'#22c55e', fontWeight:'900', fontSize:'0.85rem' }}>${usd.toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Jackpot Winners */}
          <div style={{ background:'var(--bg-card)', padding:'16px', borderRadius:'18px', border:'1px solid var(--glass-border)' }}>
            <div style={{ fontSize:'0.6rem', fontWeight:'900', color:'var(--text-muted)', letterSpacing:'1px', marginBottom:'12px' }}>🏆 JACKPOT KAZANANLAR</div>
            {spinStats.winners.length === 0 ? (
              <div style={{ textAlign:'center', padding:'20px', opacity:0.4, fontSize:'0.8rem' }}>Henüz kazanan yok</div>
            ) : spinStats.winners.map((w, i) => (
              <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 12px', borderRadius:'12px', marginBottom:'6px', background:w.type==='mega'?'rgba(239,68,68,0.1)':'rgba(245,158,11,0.08)', border:w.type==='mega'?'1px solid rgba(239,68,68,0.3)':'1px solid rgba(245,158,11,0.2)' }}>
                <div>
                  <div style={{ fontWeight:'900', fontSize:'0.82rem', color:w.type==='mega'?'#fca5a5':'#fde68a' }}>
                    {w.type==='mega'?'💎 MEGA':'🏆 JACKPOT'} — {w.prize}
                  </div>
                  <div style={{ fontSize:'0.6rem', color:'var(--text-muted)', marginTop:'2px' }}>
                    Spin #{w.spinCount?.toLocaleString()} · {new Date(w.date).toLocaleString('tr-TR')}
                  </div>
                </div>
                <a href='https://t.me/QAI_WALLET' target='_blank' rel='noreferrer' style={{ padding:'6px 10px', background:'#0098ea', color:'#fff', borderRadius:'8px', fontSize:'0.62rem', fontWeight:'900', textDecoration:'none' }}>TG</a>
              </div>
            ))}
          </div>

          {spinStats.winners.length > 0 && (
            <button onClick={() => { localStorage.removeItem('qai_jackpot_winners'); setSpinStats(s => ({...s, winners:[]})); }}
              style={{ padding:'10px', background:'rgba(239,68,68,0.08)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.2)', borderRadius:'12px', fontWeight:'900', cursor:'pointer', fontSize:'0.75rem' }}>
              Kazanan Listesini Temizle
            </button>
          )}
        </div>
      )}

      {/* ── BLACKLIST ── */}
      {activeTab === 'blacklist' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
          {blacklist.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', opacity: 0.4 }}>
              <AlertTriangle size={48} style={{ marginBottom: '14px' }} />
              <p>Kara liste boş</p>
            </div>
          ) : blacklist.map((contract, i) => (
            <div key={i} style={{ background: 'rgba(239,68,68,0.06)', padding: '13px 15px', borderRadius: '14px', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.7rem', wordBreak: 'break-all', color: '#ef4444', flex: 1, marginRight: '10px' }}>{contract}</div>
              <button onClick={() => { const bl = blacklist.filter(c => c !== contract); localStorage.setItem('qai_blacklist', JSON.stringify(bl)); setBlacklist(bl); }}
                style={{ padding: '5px 10px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '8px', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.68rem', fontWeight: '700', flexShrink: 0 }}>
                Kaldır
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AdminPanel;
