import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Coins, ChevronRight, LayoutGrid, Zap, Rocket, ShieldCheck, Compass, Star as StarIcon } from 'lucide-react';
import { WALLET_CONFIG } from '../config';

const Menu = ({ setTab, setActiveToken, t, walletData }) => {
  const [shakingItem, setShakingItem] = useState(null);

  const shake = (id) => {
    setShakingItem(id);
    setTimeout(() => setShakingItem(null), 600);
  };

  const adminList = (WALLET_CONFIG.ADMIN_ADDRESSES || []).map(a => (a || '').toLowerCase());
  const userAddresses = Object.values(walletData?.addresses || {})
    .filter(a => typeof a === 'string')
    .map(a => a.toLowerCase());
  const isOwner = userAddresses.some(a => a && adminList.includes(a));
  const LOCKED_ITEMS = ['psd2'];

  const menuItems = [
    { id: 'swap',            icon: <RefreshCw size={22} />,  title: t('menu.swap'),        desc: t('menu.swap_desc'),        color: '#6366f1', rgb: '99,102,241',  badge: null },
    { id: 'discovery',       icon: <Compass size={22} />,    title: t('menu.discovery'),   desc: t('menu.discovery_desc'),   color: '#a78bfa', rgb: '167,139,250', badge: t('menu.live') },
    { id: 'discovery_trend', icon: <StarIcon size={22} />,   title: t('menu.trending'),    desc: t('menu.trending_desc'),    color: '#f59e0b', rgb: '245,158,11',  badge: '🔥' },
    { id: 'listing',         icon: <Rocket size={22} />,     title: t('menu.listing2'),    desc: t('menu.listing2_desc'),    color: '#ec4899', rgb: '236,72,153',  badge: null },
    { id: 'staking',         icon: <Coins size={22} />,      title: t('menu.staking2'),    desc: t('menu.staking2_desc'),    color: '#10b981', rgb: '16,185,129',  badge: null },
    { id: 'admin',           icon: <ShieldCheck size={22} />,title: t('menu.admin'),       desc: t('menu.admin_desc'),       color: '#ef4444', rgb: '239,68,68',   badge: null },
    { id: 'games', icon: <Zap size={22} />, title: t('menu.games'), desc: t('menu.games_desc'), color: '#06b6d4', rgb: '6,182,212', badge: '🎡' },
    { id: 'psd2',            icon: <LayoutGrid size={22} />, title: t('menu.psd2_title'),  desc: t('menu.psd2_title_desc'),  color: '#3b82f6', rgb: '59,130,246',  badge: t('menu.infra') },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      style={{ padding: '20px', paddingBottom: '120px' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'rgba(124,58,237,0.15)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LayoutGrid size={22} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '900', margin: 0 }}>{t('menu.title')}</h2>
        </div>
        <div onClick={() => setTab('profile')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-card)', padding: '6px 12px', borderRadius: '12px', border: '1px solid var(--glass-border)', cursor: 'pointer' }}>
          <div style={{ width: '28px', height: '28px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '900', color: '#fff' }}>Q</div>
          <ChevronRight size={14} color="var(--text-muted)" />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {menuItems.filter(item => item.id !== 'admin' || isOwner).map(item => (
          <motion.div key={item.id} whileTap={{ scale: 0.97 }}
            animate={shakingItem === item.id ? { x: [0, -8, 8, -8, 8, -4, 4, 0] } : {}}
            transition={{ duration: 0.5 }}
            onClick={() => LOCKED_ITEMS.includes(item.id) ? shake(item.id) : setTab(item.id)}
            style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '22px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: '80px', height: '80px', background: item.color, filter: 'blur(40px)', opacity: 0.12, pointerEvents: 'none' }} />
            <div style={{ width: '50px', height: '50px', background: `rgba(${item.rgb},0.12)`, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid rgba(${item.rgb},0.2)`, flexShrink: 0, color: item.color }}>
              {item.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '900' }}>{item.title}</h3>
                {item.badge && (
                  <span style={{ fontSize: '0.55rem', fontWeight: '900', background: `rgba(${item.rgb},0.2)`, color: item.color, padding: '2px 7px', borderRadius: '6px' }}>{item.badge}</span>
                )}
              </div>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.desc}</p>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </motion.div>
        ))}
      </div>

      {/* DeFi Tools */}
      <div style={{ marginTop: '28px' }}>
        <h4 style={{ margin: '0 0 14px 4px', fontSize: '0.72rem', fontWeight: '900', color: 'var(--text-muted)', letterSpacing: '1px' }}>{t('menu.defi_tools')}</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px' }}>
          {[
            { label: 'Pump.fun',    url: 'https://pump.fun',             emoji: '🚀', color: '#a855f7' },
            { label: 'Jupiter',     url: 'https://jup.ag',               emoji: '🪐', color: '#6366f1' },
            { label: 'Meteora',     url: 'https://app.meteora.ag',       emoji: '☄️', color: '#0ea5e9' },
            { label: 'four.meme',   url: 'https://four.meme',            emoji: '🎭', color: '#f59e0b' },
            { label: 'Boom',        url: 'https://boom.money',           emoji: '💥', color: '#ef4444' },
            { label: 'Pinksale',    url: 'https://www.pinksale.finance', emoji: '🩷', color: '#ec4899' },
            { label: 'DEXTools',    url: 'https://www.dextools.io',      emoji: '🔧', color: '#10b981' },
            { label: 'DexScreener', url: 'https://dexscreener.com',      emoji: '📊', color: '#22c55e' },
          ].map(item => (
            <motion.a key={item.label} href={item.url} target="_blank" rel="noreferrer" whileTap={{ scale: 0.92 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', background: 'var(--bg-card)', borderRadius: '16px', padding: '12px 6px', border: '1px solid var(--glass-border)', textDecoration: 'none', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -10, right: -10, width: '40px', height: '40px', background: item.color, filter: 'blur(20px)', opacity: 0.15 }} />
              <span style={{ fontSize: '1.5rem' }}>{item.emoji}</span>
              <span style={{ fontSize: '0.6rem', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.2 }}>{item.label}</span>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Quick Swap */}
      <div style={{ marginTop: '24px' }}>
        <h4 style={{ margin: '0 0 14px 4px', fontSize: '0.72rem', fontWeight: '900', color: 'var(--text-muted)', letterSpacing: '1px' }}>{t('menu.quick_swap')}</h4>
        <motion.div
          onClick={() => { if (setActiveToken) setActiveToken({ id: 'taste' }); setTab('swap'); }}
          whileTap={{ scale: 0.97 }}
          style={{ display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--bg-card)', padding: '16px 18px', borderRadius: '18px', border: '1px solid rgba(0,152,234,0.25)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -10, right: -10, width: '70px', height: '70px', background: '#0098ea', filter: 'blur(30px)', opacity: 0.1 }} />
          <span style={{ fontSize: '1.6rem' }}>🫧</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '900', fontSize: '0.9rem', color: '#fff' }}>{t('menu.taste_swap')}</div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '2px' }}>{t('menu.taste_swap_desc')}</div>
          </div>
          <div style={{ fontSize: '0.65rem', fontWeight: '900', background: 'rgba(0,152,234,0.15)', color: '#0098ea', padding: '4px 8px', borderRadius: '8px', border: '1px solid rgba(0,152,234,0.3)' }}>SWAP →</div>
        </motion.div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: '28px', background: 'linear-gradient(135deg,rgba(124,58,237,0.08),rgba(236,72,153,0.05))', padding: '22px', borderRadius: '22px', border: '1px dashed rgba(124,58,237,0.3)', textAlign: 'center' }}>
        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}>
          <Zap size={28} color="var(--primary)" style={{ marginBottom: '8px' }} />
        </motion.div>
        <h4 style={{ margin: '0 0 6px 0', fontWeight: '900', fontSize: '0.95rem' }}>QAI Web4 Ecosystem</h4>
        <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t('menu.footer_links')}</p>
      </div>
    </motion.div>
  );
};

export default Menu;
