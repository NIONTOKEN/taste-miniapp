import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, CheckCircle2, RotateCcw, Zap, Trophy, Volume2, VolumeX } from "lucide-react";
import { sendTonFull } from "../blockchainService";
import { WALLET_CONFIG } from "../config";

// Varsayılan kurlar
const STATIC_RATES = {
  TON: { symbol:"TON", name:"Toncoin",  rate:3.2,   color:"#0098ea", balKey:"the-open-network", icon:"https://assets.coingecko.com/coins/images/17980/standard/ton_symbol.png" },
  SOL: { symbol:"SOL", name:"Solana",   rate:150,   color:"#9945FF", balKey:"solana",           icon:"https://assets.coingecko.com/coins/images/4128/standard/solana.png" },
};

const SLICE_DEG = 30;

// Oyun İçi Gizli Jackpot Tetikleyicileri (1 Milyon ve 1.5 Milyon)
const _T1 = 1000000;    // Jackpot 1M
const _T2 = 1500000;   // Mega Jackpot 1.5M

const getSpinCount = () => parseInt(localStorage.getItem("qai_spin_count") || "0");
const incSpinCount = () => {
  const n = getSpinCount() + 1;
  localStorage.setItem("qai_spin_count", n.toString());
  return n;
};

// ─── SES EFEKTLERİ ───────────────────────────────────────────────────────────
const playSound = (type, soundEnabled) => {
  if (!soundEnabled) return;
  try {
    const urls = {
      spin: "https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3",
      win: "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3",
      jackpot: "https://assets.mixkit.co/active_storage/sfx/1000/1000-preview.mp3"
    };
    const audio = new Audio(urls[type]);
    audio.volume = type === 'spin' ? 0.3 : 0.6;
    audio.play().catch(() => {});
  } catch (e) {}
};

// ─── ETKİNLİK YAZISI (KAYAN YAZI) ────────────────────────────────────────────
const ActivityTicker = ({ spinCount, t }) => {
  const base = 8423 + Math.floor(spinCount / 8);
  const msgs = [
    `🔥 ${t ? t('games.playedCount')?.replace('{{count}}', base.toLocaleString()) : `${base.toLocaleString()} accounts played`}`,
    t ? t('games.totalSpins')?.replace('{{count}}', (spinCount + 180234).toLocaleString()) : `💎 ${(spinCount + 180234).toLocaleString()} total wheel spins`,
    `🏆 ${Math.max(1, (base * 0.03) | 0)} ${t ? t('games.winnersToday') || 'winners today' : 'winners today'}`,
    `🎰 ${Math.max(1, (base * 0.12) | 0)} ${t ? t('games.activePlayers') || 'active now' : 'active now'}`,
  ];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setIdx(i => (i + 1) % msgs.length), 3200);
    return () => clearInterval(iv);
  }, [spinCount]);

  return (
    <div style={{ overflow:"hidden", background:"linear-gradient(90deg,rgba(124,58,237,0.18),rgba(236,72,153,0.12))", borderRadius:"14px", padding:"10px 16px", border:"1px solid rgba(124,58,237,0.3)", marginBottom:"10px" }}>
      <AnimatePresence mode="wait">
        <motion.div key={idx}
          initial={{ y:-18, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:18, opacity:0 }}
          transition={{ duration:0.35 }}
          style={{ fontSize:"0.78rem", fontWeight:"700", color:"#c4b5fd", textAlign:"center", whiteSpace:"nowrap" }}>
          {msgs[idx]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ─── PARTICLE (KONFETİ) PATLAMASI ────────────────────────────────────────────
const ParticleBurst = ({ active, type }) => {
  if (!active) return null;
  const palettes = {
    mega:    ["#ef4444","#fbbf24","#f97316","#fff","#fca5a5"],
    jackpot: ["#fbbf24","#f59e0b","#fef3c7","#fff"],
    ton:     ["#0098ea","#38bdf8","#7dd3fc","#fff"],
    win:     ["#7c3aed","#ec4899","#a78bfa","#fff"],
  };
  const colors = palettes[type] || palettes.win;
  const count  = type === "mega" ? 90 : 45;
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:9998 }}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * 360 + Math.random() * 10;
        const dist  = 80 + Math.random() * 250;
        return (
          <motion.div key={i}
            initial={{ x:"50vw", y:"45vh", scale:1, opacity:1 }}
            animate={{
              x:`calc(50vw + ${Math.cos(angle * Math.PI / 180) * dist}px)`,
              y:`calc(45vh + ${Math.sin(angle * Math.PI / 180) * dist}px)`,
              scale:0, opacity:0,
              rotate: Math.random() * 360
            }}
            transition={{ duration:1.8, delay:i * 0.015, ease:"easeOut" }}
            style={{ position:"absolute", width:`${5 + Math.random() * 8}px`, height:`${5 + Math.random() * 8}px`, borderRadius: (i % 2 === 0) ? "50%" : "2px", background:colors[i % colors.length] }}
          />
        );
      })}
    </div>
  );
};

// ─── ÇARK ÇİZİMİ (SVG) ───────────────────────────────────────────────────────
const WheelSVG = ({ segments }) => {
  const cx = 150, cy = 150, r = 138, innerR = 36;
  const polar = (deg, rad) => {
    const a = ((deg - 90) * Math.PI) / 180;
    return { x: cx + rad * Math.cos(a), y: cy + rad * Math.sin(a) };
  };
  const path = (i) => {
    const s = i * SLICE_DEG, e = s + SLICE_DEG;
    const p1 = polar(s,r), p2 = polar(e,r), p3 = polar(e,innerR), p4 = polar(s,innerR);
    return `M${p1.x} ${p1.y} A${r} ${r} 0 0 1 ${p2.x} ${p2.y} L${p3.x} ${p3.y} A${innerR} ${innerR} 0 0 0 ${p4.x} ${p4.y}Z`;
  };
  return (
    <svg width="300" height="300" viewBox="0 0 300 300">
      <defs>
        <filter id="gw"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <filter id="megaGlow"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <radialGradient id="megaFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ef4444"/>
          <stop offset="100%" stopColor="#7f1d1d"/>
        </radialGradient>
      </defs>
      <g>
        {segments.map((seg, i) => {
          const mid = i * SLICE_DEG + SLICE_DEG / 2;
          const tp  = polar(mid, (r + innerR) / 2);
          const isMega = seg.type === "mega";
          return (
            <g key={i}>
              <path d={path(i)}
                fill={isMega ? "url(#megaFill)" : seg.color}
                stroke={isMega ? "#ef4444" : "rgba(255,255,255,0.09)"}
                strokeWidth={isMega ? "2" : "1"}
                filter={isMega ? "url(#megaGlow)" : undefined} />
              <text x={tp.x} y={tp.y} textAnchor="middle" dominantBaseline="middle"
                fill={seg.textColor}
                fontSize={seg.label.length > 7 ? "6.5" : "8"}
                fontWeight="900"
                transform={`rotate(${mid},${tp.x},${tp.y})`}>
                {seg.label}
              </text>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={innerR} fill="#0f0f13" stroke="rgba(124,58,237,0.5)" strokeWidth="2"/>
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="#7c3aed" fontSize="9" fontWeight="900">QAI</text>
      </g>
      <circle cx={cx} cy={cy} r={r+3} fill="none" stroke="rgba(124,58,237,0.3)" strokeWidth="2"/>
      <polygon points="150,-2 141,18 159,18" fill="#7c3aed" filter="url(#gw)"/>
    </svg>
  );
};

// ─── APY MADENCİLİĞİ ─────────────────────────────────────────────────────────
const APY_POOLS = [
  { id:"trx", symbol:"TRX", name:"TRON",  icon:"https://assets.coingecko.com/coins/images/1094/standard/tron-logo.png",         color:"#EF0027", apy:20, min:100, networkKey:"TRX",   receiver: WALLET_CONFIG.RECEIVERS?.TRX  || WALLET_CONFIG.RECEIVERS?.TON },
  { id:"mon", symbol:"MON", name:"Monad", icon:"https://assets.coingecko.com/coins/images/35137/standard/monad.jpg",             color:"#836EF9", apy:18, min:100, networkKey:"MONAD", receiver: WALLET_CONFIG.RECEIVERS?.MONAD || WALLET_CONFIG.RECEIVERS?.EVM },
  { id:"ton", symbol:"TON", name:"TON",   icon:"https://assets.coingecko.com/coins/images/17980/standard/ton_symbol.png",        color:"#0098EA", apy:15, min:100, networkKey:"TON",   receiver: WALLET_CONFIG.RECEIVERS?.TON },
];

const MiningPanel = ({ balances, walletData, addPoints, t }) => {
  const [sel, setSel]       = useState(null);
  const [amt, setAmt]       = useState("100");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg]       = useState("");
  const [done, setDone]     = useState(false);
  const stakes = JSON.parse(localStorage.getItem("qai_mining_stakes") || "[]");

  const doStake = async () => {
    if (!sel || !walletData?.mnemonic) return;
    const a = parseFloat(amt);
    if (!sel || a < sel.min) { 
      setMsg(t ? t('games.minRequired')?.replace('{{min}}', sel.min).replace('{{symbol}}', sel.symbol) : `Min. ${sel.min} ${sel.symbol} gerekli`); 
      return; 
    }
    setLoading(true); setMsg(t ? t('games.processing') : "İşlem onaylanıyor...");
    try {
      if (sel.networkKey === "TON") {
        await sendTonFull(walletData.mnemonic, sel.receiver, a.toString(), `APY ${sel.symbol}`);
      } else {
        const { getEvmPrivateKey } = await import("../walletService");
        const { sendEVM }          = await import("../blockchainService");
        const pk  = await getEvmPrivateKey(walletData.mnemonic);
        const rpc = (WALLET_CONFIG.RPC_NODES[sel.networkKey] || WALLET_CONFIG.RPC_NODES.ETH)[0];
        await sendEVM(pk, sel.receiver, a.toString(), rpc);
      }
      const saved = JSON.parse(localStorage.getItem("qai_mining_stakes") || "[]");
      localStorage.setItem("qai_mining_stakes", JSON.stringify([...saved, { id:Date.now(), symbol:sel.symbol, amount:a, apy:sel.apy, startTime:new Date().toISOString() }]));
      setDone(true); setMsg("");
    } catch (e) { setMsg((t ? t('games.error') : "Hata") + ": " + e.message); }
    setLoading(false);
  };

  if (done) return (
    <div style={{ textAlign:"center", paddingTop:"50px" }}>
      <div style={{ fontSize:"3.5rem", marginBottom:"14px" }}>✅</div>
      <h3 style={{ fontWeight:"900", marginBottom:"8px" }}>{t ? t('games.stakeSuccess') : 'Stake Başarılı!'}</h3>
      <p style={{ color:"var(--text-muted)", fontSize:"0.8rem", marginBottom:"12px" }}>{amt} {sel?.symbol} — {t ? t('games.earningApy') : 'APY Kazandırıyor'}</p>
      <p style={{ color:"#f59e0b", fontSize:"0.72rem", marginBottom:"22px", padding: '10px', background: 'rgba(245,158,11,0.1)', borderRadius: '12px' }}>
        {t ? t('games.rewManualDesc') : '...'}
      </p>
      <button onClick={() => { setDone(false); setSel(null); }} style={{ padding:"14px 28px", background:"var(--primary)", color:"#fff", border:"none", borderRadius:"16px", fontWeight:"900", cursor:"pointer" }}>{t ? t('games.goBack') : 'Geri Dön'}</button>
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
      {stakes.length > 0 && (
        <div style={{ background:"linear-gradient(135deg,rgba(16,185,129,0.1),rgba(16,185,129,0.05))", padding:"14px 18px", borderRadius:"16px", border:"1px solid rgba(16,185,129,0.2)" }}>
          <div style={{ fontSize:"0.6rem", color:"var(--text-muted)", fontWeight:"700" }}>{t ? t('games.activeStakes') : 'AKTİF YATIRIMLAR'}</div>
          <div style={{ fontSize:"1.1rem", fontWeight:"900" }}>{stakes.length} {t ? t('games.contractsRunning') : 'sözleşme çalışıyor'}</div>
        </div>
      )}
      <div style={{ fontSize:"0.7rem", color:"var(--text-muted)", fontWeight:"700", letterSpacing:"1px" }}>{t ? t('games.selectApyPool') : 'APY HAVUZU SEÇ'}</div>
      {APY_POOLS.map(pool => (
        <motion.div key={pool.id} whileTap={{ scale:0.97 }} onClick={() => setSel(pool)}
          style={{ background:sel?.id===pool.id ? "rgba(124,58,237,0.12)" : "var(--bg-card)", padding:"16px", borderRadius:"18px", border:sel?.id===pool.id ? `2px solid ${pool.color}` : "1px solid var(--glass-border)", cursor:"pointer", display:"flex", alignItems:"center", gap:"12px" }}>
          <img src={pool.icon} style={{ width:"40px", height:"40px", borderRadius:"50%" }} alt={pool.symbol} onError={e => { e.target.style.display="none"; }}/>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:"900", fontSize:"0.92rem" }}>{pool.name} ({pool.symbol})</div>
            <div style={{ fontSize:"0.66rem", color:"var(--text-muted)" }}>Min. {pool.min} {pool.symbol} · {t ? t('games.days30') : '30 Gün'}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:"1.2rem", fontWeight:"900", color:pool.color }}>%{pool.apy}</div>
            <div style={{ fontSize:"0.58rem", color:"var(--text-muted)" }}>APY</div>
          </div>
        </motion.div>
      ))}
      {sel && (
        <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} style={{ background:"var(--bg-card)", padding:"16px", borderRadius:"18px", border:"1px solid var(--glass-border)" }}>
          <div style={{ fontSize:"0.68rem", color:"var(--text-muted)", fontWeight:"700", marginBottom:"8px" }}>{t ? t('games.amountLabel') : 'TUTAR'} ({sel.symbol})</div>
          <input type="number" value={amt} onChange={e => setAmt(e.target.value)} min={sel.min}
            style={{ width:"100%", background:"rgba(255,255,255,0.03)", border:"1px solid var(--glass-border)", borderRadius:"10px", padding:"11px 13px", color:"#fff", fontSize:"1.1rem", fontWeight:"700", outline:"none", boxSizing:"border-box", marginBottom:"8px" }}/>
          <div style={{ fontSize:"0.68rem", color:"#22c55e", marginBottom:"10px" }}>
            {t ? t('games.estDaily') : 'Tahmini günlük kazanç:'} +{((parseFloat(amt)||0) * sel.apy / 100 / 365).toFixed(4)} {sel.symbol}
          </div>
          {msg && <div style={{ color:"#ef4444", fontSize:"0.7rem", marginBottom:"8px" }}>{msg}</div>}
          <button disabled={loading} onClick={doStake}
            style={{ width:"100%", padding:"14px", background:loading ? "rgba(124,58,237,0.4)" : "var(--primary)", color:"#fff", border:"none", borderRadius:"12px", fontWeight:"900", cursor:loading ? "not-allowed" : "pointer" }}>
            {loading ? (t ? t('games.processing') : 'İşleniyor...') : `${t ? t('games.stakeAction') : 'YATIR'} ${amt} ${sel.symbol}`}
          </button>
        </motion.div>
      )}
      <div style={{ padding:"11px 13px", background:"rgba(245,158,11,0.08)", borderRadius:"12px", border:"1px solid rgba(245,158,11,0.2)", fontSize:"0.68rem", color:"#f59e0b", lineHeight:1.5 }}>
        ⚠️ {t ? t('games.rewManualDesc') || '...' : 'Ödüller manuel olarak dağıtılır. Onaylandıktan sonra @QAI_WALLET ile iletişime geçin.'}
      </div>
    </div>
  );
};

// ─── GÜNLÜK ÖDÜL PANELİ ──────────────────────────────────────────────────────
const DailyPanel = ({ addPoints, t }) => {
  const today   = new Date().toDateString();
  const [claimed, setClaimed]   = useState(localStorage.getItem("qai_daily_claim") === today);
  const [streak, setStreak]     = useState(parseInt(localStorage.getItem("qai_daily_streak") || "0"));
  const [showClaim, setShowClaim] = useState(false);
  const REWARDS = [10,20,30,50,75,100,200];
  const TASTE_THRESHOLD = 2500;
  const userPoints  = parseInt(localStorage.getItem("qai_user_points") || "0");
  const tasteClaimed = localStorage.getItem("qai_taste_claimed") === "true";

  const claimDaily = () => {
    if (claimed) return;
    const ns = streak + 1;
    const reward = REWARDS[Math.min(ns-1, REWARDS.length-1)];
    localStorage.setItem("qai_daily_claim", today);
    localStorage.setItem("qai_daily_streak", ns.toString());
    setStreak(ns); setClaimed(true);
    addPoints(reward);
    playSound('win', true);
  };

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
      <div style={{ background:"var(--bg-card)", padding:"24px", borderRadius:"24px", border:"1px solid var(--glass-border)", textAlign:"center" }}>
        <div style={{ fontSize:"2.8rem", marginBottom:"10px" }}>🎁</div>
        <h3 style={{ margin:"0 0 6px 0", fontSize:"1.2rem", fontWeight:"900" }}>{t ? t('games.dailyStreak') : 'Günlük Serin'}</h3>
        <p style={{ fontSize:"0.76rem", color:"var(--text-muted)", marginBottom:"18px" }}>{t ? t('games.streakDesc') : 'Puanlarını katlamak için her gün gel ve ödülünü al.'}</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"7px", marginBottom:"18px" }}>
          {REWARDS.map((r, i) => (
            <div key={i} style={{ padding:"9px 3px", borderRadius:"11px", background:i<streak?"rgba(34,197,94,0.1)":"rgba(255,255,255,0.02)", border:i<streak?"1px solid #22c55e":"1px solid var(--glass-border)", position:"relative" }}>
              <div style={{ fontSize:"0.56rem", color:"var(--text-muted)" }}>{i+1}. {t ? t('games.day') : 'Gün'}</div>
              <div style={{ fontSize:"0.8rem", fontWeight:"900", color:i<streak?"#22c55e":"#fff" }}>{r}</div>
              {i<streak && <CheckCircle2 size={10} color="#22c55e" style={{ position:"absolute", top:-3, right:-3, background:"var(--bg-card)", borderRadius:"50%" }}/>}
            </div>
          ))}
        </div>
        <div style={{ marginBottom:"14px", fontSize:"0.76rem", color:"var(--text-muted)" }}>
          {t ? t('games.streak') : 'Seri:'} <span style={{ color:"#fbbf24", fontWeight:"900" }}>{streak} {t ? t('games.day') : 'gün'}</span>
          {" · "}{t ? t('games.points') : 'Puanlar:'} <span style={{ color:"#fbbf24", fontWeight:"900" }}>{userPoints.toLocaleString()}</span>
        </div>
        <button disabled={claimed} onClick={claimDaily}
          style={{ width:"100%", padding:"15px", background:claimed?"rgba(255,255,255,0.05)":"var(--primary)", color:claimed?"var(--text-muted)":"#fff", border:"none", borderRadius:"14px", fontWeight:"900", cursor:claimed?"not-allowed":"pointer" }}>
          {claimed ? (t ? t('games.claimedToday') : "✓ Bugün Alındı") : `${t ? t('games.claimPlus') : 'AL +'}${REWARDS[Math.min(streak, REWARDS.length-1)]} ${t ? t('games.pointsStr') : 'Puan'}`}
        </button>
      </div>

      {/* TASTE BÖLÜMÜ */}
      <div style={{ background:"linear-gradient(135deg,rgba(0,152,234,0.1),rgba(0,152,234,0.05))", padding:"18px", borderRadius:"18px", border:"1px solid rgba(0,152,234,0.25)" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
          <div>
            <div style={{ fontWeight:"900", fontSize:"0.9rem" }}>🏆 2500 {t ? t('games.pointsStr') : 'Puan'} = 25 TASTE</div>
            <div style={{ fontSize:"0.68rem", color:"var(--text-muted)", marginTop:"2px" }}>{t ? t('games.tasteReqDesc') : 'Ödülünü almak için 2500 puan biriktir.'}</div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:"0.7rem", color:"var(--text-muted)" }}>{Math.min(userPoints,TASTE_THRESHOLD)}/{TASTE_THRESHOLD}</div>
            <div style={{ width:"60px", height:"4px", background:"rgba(255,255,255,0.1)", borderRadius:"4px", marginTop:"4px", overflow:"hidden" }}>
              <div style={{ width:`${Math.min(100,(userPoints/TASTE_THRESHOLD)*100)}%`, height:"100%", background:"#0098ea", borderRadius:"4px" }}/>
            </div>
          </div>
        </div>
        {userPoints >= TASTE_THRESHOLD && !tasteClaimed ? (
          <button onClick={() => setShowClaim(true)}
            style={{ width:"100%", padding:"12px", background:"#0098ea", color:"#fff", border:"none", borderRadius:"12px", fontWeight:"900", fontSize:"0.82rem", cursor:"pointer" }}>
            25 {t ? t('games.claimTaste') : 'TASTE TALEP ET'}
          </button>
        ) : tasteClaimed ? (
          <div style={{ textAlign:"center", color:"#22c55e", fontSize:"0.78rem", fontWeight:"700" }}>✓ {t ? t('games.tasteClaimed') : 'TASTE talep edildi!'}</div>
        ) : (
          <div style={{ fontSize:"0.7rem", color:"var(--text-muted)", textAlign:"center" }}>{TASTE_THRESHOLD-userPoints} {t ? t('games.morePointsNeeded') : 'puana daha ihtiyacın var'}</div>
        )}
      </div>

      <AnimatePresence>
        {showClaim && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", zIndex:9000, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
            <motion.div initial={{ scale:0.9 }} animate={{ scale:1 }}
              style={{ background:"var(--bg-card)", borderRadius:"24px", padding:"28px", border:"1px solid var(--glass-border)", width:"100%", maxWidth:"340px", textAlign:"center" }}>
              <div style={{ fontSize:"2.5rem", marginBottom:"12px" }}>🎉</div>
              <h3 style={{ fontWeight:"900", marginBottom:"8px" }}>25 TASTE {t ? t('games.isYours') : 'Senin!'}</h3>
              <p style={{ color:"var(--text-muted)", fontSize:"0.78rem", marginBottom:"16px", lineHeight:1.5 }}>
                {t ? t('games.telegramDesc') || '...' : 'Ödülünü almak üzere adresini Telegram üzerinden yöneticilerimize iletmen gerekiyor.'}
              </p>
              <a href="https://t.me/QAI_WALLET" target="_blank" rel="noreferrer"
                style={{ display:"block", padding:"14px", background:"#0098ea", color:"#fff", borderRadius:"14px", fontWeight:"900", textDecoration:"none", marginBottom:"10px", fontSize:"0.9rem" }}>
                📩 @QAI_WALLET'e Git
              </a>
              <button onClick={() => { localStorage.setItem("qai_taste_claimed","true"); setShowClaim(false); }}
                style={{ width:"100%", padding:"12px", background:"rgba(255,255,255,0.05)", color:"var(--text-muted)", border:"1px solid var(--glass-border)", borderRadius:"12px", fontWeight:"700", cursor:"pointer", fontSize:"0.82rem" }}>
                {t ? t('games.alreadySent') : 'Zaten Gönderdim'}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── SLOT OYUNU ──────────────────────────────────────────────────────────────
const GAME_TREASURY = 'UQA5Bzh4JyfIoQbd9vgGFowhEhCKIvSpG4m9F8UNY8L4_nBJ';

const SLOT_TABLES = [
  { id:'bronze', nameKey:'slotBronze', emoji:'🥉', betTON:0.5, poolLimit:20,  prize:10,  color:'#cd7f32', glow:'rgba(205,127,50,0.4)' },
  { id:'silver', nameKey:'slotSilver', emoji:'🥈', betTON:2,   poolLimit:80,  prize:40,  color:'#C0C0C0', glow:'rgba(192,192,192,0.4)' },
  { id:'gold',   nameKey:'slotGold',   emoji:'🥇', betTON:10,  poolLimit:400, prize:200, color:'#F7931A', glow:'rgba(247,147,26,0.5)'  },
];

const SLOT_SYMBOLS = ['💎','7️⃣','⭐','🔔','🍋','🫐'];
const SLOT_WEIGHTS = [1, 2, 5, 8, 10, 12];

const randSymbol = () => {
  const total = SLOT_WEIGHTS.reduce((a,b)=>a+b,0);
  let r = Math.random()*total;
  for(let i=0;i<SLOT_SYMBOLS.length;i++){r-=SLOT_WEIGHTS[i];if(r<=0)return SLOT_SYMBOLS[i];}
  return SLOT_SYMBOLS[SLOT_SYMBOLS.length-1];
};

const checkWin = (reels, t) => {
  const tl = (k, fb) => t ? (t('games.'+k)||fb) : fb;
  const mid = reels.map(r=>r[1]);
  if(mid[0]===mid[1] && mid[1]===mid[2]){
    if(mid[0]==='💎') return {type:'jackpot', mult:0, label:'💎 JACKPOT! 💎'};
    if(mid[0]==='7️⃣') return {type:'big',     mult:5, label:'7️⃣ BIG WIN! 7️⃣'};
    if(mid[0]==='⭐')  return {type:'mid',     mult:3, label:`⭐ ${tl('slotJackpotWin','KAZANDIN!')} ⭐`};
    if(mid[0]==='🔔')  return {type:'small',   mult:1.5,label:'🔔 +1.5x 🔔'};
    return                     {type:'tiny',    mult:1, label:'💫 x1'};
  }
  const top = reels.map(r=>r[0]);
  if(top[0]===top[1]&&top[1]===top[2]&&top[0]==='💎') return {type:'jackpot',mult:0,label:'💎 JACKPOT! 💎'};
  const bot = reels.map(r=>r[2]);
  if(bot[0]===bot[1]&&bot[1]===bot[2]&&bot[0]==='💎') return {type:'jackpot',mult:0,label:'💎 JACKPOT! 💎'};
  return null;
};

const BACKEND_URL = 'https://qai-backend-production-c1e6.up.railway.app';

const SlotGame = ({ walletData, balances, t }) => {
  const tonBal = balances?.['the-open-network'] || 0;
  const [selTable, setSelTable] = useState(null);
  const [reels,    setReels]    = useState([['💎','🔔','🍋'],['7️⃣','⭐','🫐'],['🔔','💎','7️⃣']]);
  const [spinning, setSpinning] = useState(false);
  const [win,      setWin]      = useState(null);
  const [txMsg,    setTxMsg]    = useState('');
  const [poolVals, setPoolVals] = useState({});
  const [jackpotModal, setJackpotModal] = useState(null);
  const [spinCols, setSpinCols] = useState([false,false,false]);

  // Havuz değerlerini backend'den yükle
  const fetchPools = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/slot/pools`);
      const data = await res.json();
      const pv = {};
      Object.keys(data).forEach(k => { pv[k] = parseFloat(data[k].pool || 0); });
      setPoolVals(pv);
    } catch (e) {
      console.warn("Backend pools load error:", e);
      // Fallback: tüm havuzları sıfır göster
      const defaultPv = {};
      SLOT_TABLES.forEach(tb => defaultPv[tb.id] = 0);
      setPoolVals(defaultPv);
    }
  };

  useEffect(()=>{
    fetchPools();
    const interval = setInterval(fetchPools, 10000); // 10s'de bir guncelle
    return () => clearInterval(interval);
  },[selTable, win]);

  const tl = (k, fb) => t ? (t('games.'+k)||fb) : fb;

  const doSpin = async () => {
    if(spinning||!selTable||!walletData?.mnemonic) return;
    const tb = SLOT_TABLES.find(x=>x.id===selTable);
    if(!tb) return;
    if(tonBal < tb.betTON){
      setTxMsg(tl('slotInsufficientTon',`Need at least ${tb.betTON} TON`).replace('{{amount}}',tb.betTON));
      return;
    }
    setWin(null); setTxMsg(tl('slotSending','Sending TON...'));
    try {
      await sendTonFull(walletData.mnemonic, GAME_TREASURY, tb.betTON.toString(), `QAI Slot ${tl(tb.nameKey,tb.id)}`);
    } catch(e) { setTxMsg(tl('slotError','Error:')+' '+e.message); return; }
    
    setTxMsg('');
    setSpinning(true);
    setSpinCols([true,true,true]);
    const newReels = reels.map(col=>[randSymbol(),randSymbol(),randSymbol()]);
    const luckRoll = Math.random();

    // Backend'e oyunu bildir
    let forceWin = null;
    let newPoolValue = (poolVals[tb.id] || 0) + tb.betTON;
    try {
      const playerAddress = walletData?.addresses?.TON || 'unknown';
      const playRes = await fetch(`${BACKEND_URL}/api/slot/play`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ tableId: tb.id, playerAddress })
      });
      const playData = await playRes.json();
      
      newPoolValue = playData.pool;
      setPoolVals(pv => ({...pv, [tb.id]: parseFloat(playData.pool)}));

      if(playData.jackpot){
        forceWin = 'jackpot';
      }
    } catch(e){
      console.error("Backend play error:", e);
      // Backend offlinesa local devam et (fallback)
      if(newPoolValue >= tb.poolLimit){ forceWin = 'jackpot'; newPoolValue = 0; }
    }

    if(forceWin === 'jackpot'){
      newReels[0][1]='💎'; newReels[1][1]='💎'; newReels[2][1]='💎';
    } else if(luckRoll < 0.08 && newPoolValue < tb.poolLimit * 0.9){
      const sym = ['⭐','🔔','🍋'][Math.floor(Math.random()*3)];
      newReels[0][1]=sym; newReels[1][1]=sym; newReels[2][1]=sym;
    }

    setTimeout(()=>{ setReels(r=>[[newReels[0][0],newReels[0][1],newReels[0][2]],r[1],r[2]]); setSpinCols([false,true,true]); }, 800);
    setTimeout(()=>{ setReels(r=>[r[0],[newReels[1][0],newReels[1][1],newReels[1][2]],r[2]]); setSpinCols([false,false,true]); }, 1400);
    setTimeout(()=>{
      setReels(newReels);
      setSpinCols([false,false,false]);
      setSpinning(false);
      const result = forceWin==='jackpot' ? {type:'jackpot',mult:0,label:`🎰 ${tb.prize} TON JACKPOT! 🎰`} : checkWin(newReels, t);
      setWin(result);
      if(result?.type==='jackpot'){
        setTimeout(()=>setJackpotModal({tb,result}),600);
      }
    }, 2200);
  };

  if(!selTable) return (
    <div style={{padding:'20px'}}>
      <div style={{textAlign:'center',marginBottom:'20px'}}>
        <div style={{fontSize:'3rem',marginBottom:'8px'}}>🎰</div>
        <div style={{fontWeight:'900',fontSize:'1.3rem',marginBottom:'4px'}}>{tl('slotTitle','Slot Machine')}</div>
        <div style={{fontSize:'0.75rem',color:'var(--text-muted)'}}>{tl('slotDesc','Play with TON, win when pool fills!')}</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
        {SLOT_TABLES.map(tb=>{
          const pool=poolVals[tb.id]||0;
          const pct=Math.min(100,(pool/tb.poolLimit)*100);
          return (
            <motion.div key={tb.id} whileTap={{scale:0.97}} onClick={()=>{setSelTable(tb.id);setWin(null);setTxMsg('');}}
              style={{background:'var(--bg-card)',padding:'20px',borderRadius:'22px',border:`1px solid ${tb.color}55`,cursor:'pointer',position:'relative',overflow:'hidden'}}>
              <div style={{position:'absolute',top:-10,right:-10,fontSize:'4rem',opacity:0.08}}>{tb.emoji}</div>
              <div style={{display:'flex',alignItems:'center',gap:'14px',marginBottom:'14px'}}>
                <div style={{fontSize:'2.2rem'}}>{tb.emoji}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:'900',fontSize:'1.05rem',color:tb.color}}>{tl(tb.nameKey, tb.id)}</div>
                  <div style={{fontSize:'0.7rem',color:'var(--text-muted)'}}>{tl('slotEntry','Entry')}: {tb.betTON} TON</div>
                </div>
                <div style={{textAlign:'right'}}>
                  <div style={{fontSize:'0.6rem',color:'var(--text-muted)',fontWeight:'700'}}>🏆 {tl('slotPrize','Prize')}</div>
                  <div style={{fontSize:'1.4rem',fontWeight:'900',color:'#fff'}}>{tb.prize} TON</div>
                </div>
              </div>
              <div style={{fontSize:'0.62rem',color:'var(--text-muted)',marginBottom:'5px',display:'flex',justifyContent:'space-between'}}>
                <span>{tl('slotPoolFill','Pool')}</span><span style={{color:tb.color,fontWeight:'700'}}>{pct.toFixed(0)}%</span>
              </div>
              <div style={{background:'rgba(255,255,255,0.07)',borderRadius:'8px',height:'8px',overflow:'hidden'}}>
                <motion.div animate={{width:`${pct}%`}} transition={{duration:0.5}}
                  style={{height:'100%',background:`linear-gradient(90deg,${tb.color},${tb.color}99)`,borderRadius:'8px',boxShadow:`0 0 10px ${tb.glow}`}}/>
              </div>
            </motion.div>
          );
        })}
      </div>
      <div style={{marginTop:'16px',padding:'12px',background:'rgba(0,152,234,0.08)',borderRadius:'14px',border:'1px solid rgba(0,152,234,0.2)',fontSize:'0.7rem',color:'rgba(0,152,234,0.9)',lineHeight:1.5}}>
        💡 {tl('slotPoolInfo','When pool fills, prize is sent automatically. TON only.')}
      </div>
    </div>
  );

  const tb = SLOT_TABLES.find(x=>x.id===selTable);
  const pool = poolVals[selTable]||0;
  const pct  = Math.min(100,(pool/tb.poolLimit)*100);

  return (
    <div style={{padding:'20px',paddingBottom:'40px'}}>
      {/* Geri */}
      <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'20px'}}>
        <motion.div whileTap={{scale:0.9}} onClick={()=>{setSelTable(null);setWin(null);setTxMsg('');}}
          style={{background:'var(--bg-card)',padding:'8px',borderRadius:'10px',cursor:'pointer',display:'flex'}}>
          <ChevronLeft size={20}/>
        </motion.div>
        <span style={{fontWeight:'900',fontSize:'1rem'}}>{tb.emoji} {tl(tb.nameKey,tb.id)}</span>
        <span style={{marginLeft:'auto',fontSize:'0.7rem',color:tb.color,fontWeight:'700',background:`${tb.color}22`,padding:'4px 10px',borderRadius:'8px'}}>{tl('slotBalance','Balance:')} {tonBal.toFixed(2)} TON</span>
      </div>

      {/* Ödül Banner */}
      <motion.div animate={{boxShadow:[`0 0 14px ${tb.glow}`,`0 0 35px ${tb.glow}`,`0 0 14px ${tb.glow}`]}} transition={{repeat:Infinity,duration:2}}
        style={{background:`linear-gradient(135deg,${tb.color}22,${tb.color}11)`,border:`2px solid ${tb.color}66`,borderRadius:'20px',padding:'16px',textAlign:'center',marginBottom:'20px'}}>
        <div style={{fontSize:'0.6rem',color:tb.color,fontWeight:'900',letterSpacing:'2px',marginBottom:'4px'}}>🏆 {tl('slotBigPrize','BIG PRIZE')}</div>
        <div style={{fontSize:'2.5rem',fontWeight:'900',color:'#fff'}}>{tb.prize} TON</div>
        <div style={{fontSize:'0.65rem',color:'var(--text-muted)',marginTop:'6px'}}>{pct.toFixed(0)}{tl('slotPoolPct','% filled')}</div>
        <div style={{background:'rgba(255,255,255,0.07)',borderRadius:'6px',height:'6px',margin:'8px 0 0',overflow:'hidden'}}>
          <motion.div animate={{width:`${pct}%`}} transition={{duration:0.5}}
            style={{height:'100%',background:`linear-gradient(90deg,${tb.color},${tb.color}88)`,borderRadius:'6px'}}/>
        </div>
      </motion.div>

      {/* Slot Makinesi */}
      <div style={{background:'linear-gradient(135deg,#1a0a2e,#0d0d1f)',border:'2px solid rgba(124,58,237,0.4)',borderRadius:'24px',padding:'20px',marginBottom:'16px',boxShadow:'0 20px 60px rgba(0,0,0,0.6)'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'6px',marginBottom:'16px'}}>
          {reels.map((col,ci)=>(
            <div key={ci} style={{display:'flex',flexDirection:'column',gap:'4px'}}>
              {col.map((sym,ri)=>(
                <motion.div key={ri}
                  animate={spinCols[ci] ? {y:[0,-10,0]} : {y:0}}
                  transition={spinCols[ci] ? {repeat:Infinity,duration:0.15} : {}}
                  style={{
                    background: ri===1 ? 'rgba(124,58,237,0.25)' : 'rgba(255,255,255,0.04)',
                    border: ri===1 ? '2px solid rgba(124,58,237,0.5)' : '1px solid rgba(255,255,255,0.07)',
                    borderRadius:'12px',padding:'14px 0',textAlign:'center',
                    fontSize:ri===1?'2.2rem':'1.6rem',
                    filter:spinCols[ci]?'blur(1px)':'none',
                    transition:'filter 0.1s'
                  }}>
                  {sym}
                </motion.div>
              ))}
            </div>
          ))}
        </div>

        {/* Kazanç Mesajı */}
        <AnimatePresence>
          {win && (
            <motion.div initial={{scale:0.5,opacity:0}} animate={{scale:1,opacity:1}} exit={{opacity:0}}
              style={{
                textAlign:'center',padding:'14px',borderRadius:'16px',marginBottom:'12px',
                background: win.type==='jackpot'?'linear-gradient(135deg,#450a0a,#b91c1c)':
                            win.type==='big'?'linear-gradient(135deg,#78350f,#b45309)':
                            win?'rgba(34,197,94,0.15)':'rgba(55,65,81,0.5)',
                border: win.type==='jackpot'?'2px solid #ef4444':
                        win.type==='big'?'2px solid #f59e0b':'1px solid #22c55e'
              }}>
              <div style={{fontSize:'1.8rem',marginBottom:'4px'}}>
                {win.type==='jackpot'?'🎰':win.type==='big'?'🏆':win?'🎉':'😔'}
              </div>
              <div style={{fontWeight:'900',fontSize:'1rem',color:win.type==='jackpot'?'#fca5a5':win.type==='big'?'#fde68a':'#22c55e'}}>
                {win.label}
              </div>
              {win.type!=='jackpot' && win.mult>0 && (
                <div style={{fontSize:'0.72rem',color:'var(--text-muted)',marginTop:'4px'}}>
                  +{(tb.betTON*win.mult).toFixed(2)} TON {tl('slotPrizeRecorded','prize recorded!')}
                </div>
              )}
            </motion.div>
          )}
          {!win && !spinning && (
            <div style={{textAlign:'center',padding:'10px',fontSize:'0.72rem',color:'var(--text-muted)'}}>
              {tl('slotMiddleLine','──── Middle row is the winning line ────')}
            </div>
          )}
        </AnimatePresence>

        {/* Spin Button */}
        <motion.button whileTap={{scale:0.95}} onClick={doSpin} disabled={spinning}
          style={{
            width:'100%',padding:'18px',borderRadius:'16px',border:'none',
            background:spinning?'rgba(124,58,237,0.3)':`linear-gradient(135deg,${tb.color},${tb.color}99)`,
            color:'#fff',fontWeight:'900',fontSize:'1.1rem',cursor:spinning?'not-allowed':'pointer',
            boxShadow:spinning?'none':`0 8px 25px ${tb.glow}`,
            display:'flex',alignItems:'center',justifyContent:'center',gap:'8px'
          }}>
          {spinning ? (
            <><motion.div animate={{rotate:360}} transition={{repeat:Infinity,duration:0.8}} style={{width:'18px',height:'18px',border:'3px solid #fff',borderTopColor:'transparent',borderRadius:'50%'}}/> {tl('slotSpinning','Spinning...')}</>
          ) : (
            <>🎰 {tl('slotSpin','SPIN')} — {tb.betTON} TON</>
          )}
        </motion.button>
        {txMsg && <div style={{marginTop:'8px',textAlign:'center',fontSize:'0.7rem',color:'#f59e0b',fontWeight:'700'}}>{txMsg}</div>}
      </div>

      <div style={{padding:'12px',background:'rgba(255,255,255,0.03)',borderRadius:'14px',border:'1px solid var(--glass-border)',fontSize:'0.68rem',color:'var(--text-muted)',lineHeight:1.5}}>
        💡 {tl('slotLegend','3 matching symbols in middle row → win! 💎=Jackpot  7️⃣=5x  ⭐=3x  🔔=1.5x')}
      </div>

      {/* Jackpot Modal */}
      <AnimatePresence>
        {jackpotModal && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.93)',zIndex:9200,display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
            <motion.div initial={{scale:0.7,y:80}} animate={{scale:1,y:0}}
              style={{background:'linear-gradient(135deg,#0d0d1f,#1a0a2e)',border:'2px solid #7c3aed',borderRadius:'28px',padding:'32px 24px',width:'100%',maxWidth:'360px',textAlign:'center',boxShadow:'0 0 80px rgba(124,58,237,0.6)'}}>              
              <motion.div animate={{scale:[1,1.2,1],rotate:[0,10,-10,0]}} transition={{repeat:Infinity,duration:1.5}} style={{fontSize:'4rem',marginBottom:'16px'}}>🎰</motion.div>
              <h2 style={{fontWeight:'900',color:`${jackpotModal.tb.color}`,fontSize:'1.6rem',marginBottom:'8px'}}>
                {jackpotModal.tb.prize} TON {tl('slotJackpotWin','YOU WON!')}
              </h2>
              <p style={{color:'rgba(255,255,255,0.75)',fontSize:'0.82rem',marginBottom:'22px',lineHeight:1.6}}>
                {tl('slotJackpotDesc','Congratulations! The pool is full and you won the big prize.')}
              </p>
              <a href="https://t.me/QAI_WALLET" target="_blank" rel="noreferrer"
                style={{display:'block',padding:'16px',background:`linear-gradient(135deg,${jackpotModal.tb.color},${jackpotModal.tb.color}99)`,color:'#fff',borderRadius:'16px',fontWeight:'900',textDecoration:'none',marginBottom:'10px',fontSize:'1rem'}}>
                📩 {tl('slotClaimBtn','Claim Prize (@QAI_WALLET)')}
              </a>
              <button onClick={()=>setJackpotModal(null)}
                style={{width:'100%',padding:'12px',background:'rgba(255,255,255,0.05)',color:'var(--text-muted)',border:'1px solid var(--glass-border)',borderRadius:'12px',fontWeight:'700',cursor:'pointer',fontSize:'0.82rem'}}>
                {tl('slotLater','Later')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── ANA COMPONENT ───────────────────────────────────────────────────────────
const GamesHub = ({ onBack, balances, walletData, tokens, livePrices, t }) => {
  const [activeTab, setActiveTab]       = useState("menu");

  const SEGMENTS = [
    { id:0,  label: t ? t('games.pass') || "PASS" : "PASS",      color:"#374151", textColor:"#9ca3af", prize:null,   type:"pass"    },
    { id:1,  label:"500",  color:"#1d4ed8", textColor:"#fff",    prize:500,    type:"points"  },
    { id:2,  label:"1500", color:"#7c3aed", textColor:"#fff",    prize:1500,   type:"points"  },
    { id:3,  label: t ? t('games.pass') || "PASS" : "PASS",      color:"#374151", textColor:"#9ca3af", prize:null,   type:"pass"    },
    { id:4,  label:"10K",  color:"#0891b2", textColor:"#fff",    prize:10000,  type:"points"  },
    { id:5,  label:"10 TON",    color:"#0098ea", textColor:"#fff",    prize:10,     type:"ton"     },
    { id:6,  label:"MEGA",      color:"#7f1d1d", textColor:"#fca5a5", prize:200000, type:"mega"    },
    { id:7,  label: t ? t('games.jackpot') || "JACKPOT" : "JACKPOT",   color:"#b45309", textColor:"#fef3c7", prize:1000,   type:"jackpot" },
    { id:8,  label: t ? t('games.retry') || "RETRY" : "RETRY",    color:"#065f46", textColor:"#6ee7b7", prize:null,   type:"retry"   },
    { id:9,  label:"15K",  color:"#6d28d9", textColor:"#fff",    prize:15000,  type:"points"  },
    { id:10, label: t ? t('games.pass') || "PASS" : "PASS",      color:"#374151", textColor:"#9ca3af", prize:null,   type:"pass"    },
    { id:11, label:"20K",  color:"#be185d", textColor:"#fff",    prize:20000,  type:"points"  },
  ];
  
  // Ödeme yapılabilecek coinleri cüzdandan dinamik oluştur
  const availableCoins = (tokens || []).filter(t => {
     const price = livePrices?.[t.id] || 0;
     return price > 0 || ['ethereum','the-open-network','solana','binancecoin','tron'].includes(t.id);
  }).map(t => {
     return {
       symbol: t.symbol?.toUpperCase(),
       name: t.name,
       rate: livePrices?.[t.id] || STATIC_RATES[t.symbol?.toUpperCase()]?.rate || 1,
       balKey: t.id,
       icon: t.image || t.icon || "https://assets.coingecko.com/coins/images/279/standard/ethereum.png",
       color: STATIC_RATES[t.symbol?.toUpperCase()]?.color || "#8b5cf6",
       contract: t.contract,
       isNative: t.isNative,
       networkKey: t.networkKey,
       decimals: t.decimals || 18
     };
  });

  // Varsayılan TON, yoksa listedeki ilk coin
  const defaultCoin = availableCoins.find(c => c.symbol === "TON")?.symbol || availableCoins[0]?.symbol || "TON";

  const [selectedCoin, setSelectedCoin] = useState(defaultCoin);
  const [usdAmount, setUsdAmount]       = useState("5");
  const [spinning, setSpinning]         = useState(false);
  const [rotation, setRotation]         = useState(0);
  const [result, setResult]             = useState(null);
  const [spinCount, setSpinCount]       = useState(getSpinCount());
  const [totalPot, setTotalPot]         = useState(parseFloat(localStorage.getItem("qai_wheel_pot") || "0"));
  const [userPoints, setUserPoints]     = useState(parseInt(localStorage.getItem("qai_user_points") || "0"));
  const [freeSpins, setFreeSpins]       = useState(0);
  const [txStatus, setTxStatus]         = useState("");
  const [showResult, setShowResult]     = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [particleType, setParticleType]   = useState("win");
  const [showJackpotModal, setShowJackpotModal] = useState(false);
  const [jackpotType, setJackpotType]   = useState("jackpot");
  const [soundEnabled, setSoundEnabled]   = useState(true);
  const [flashTick, setFlashTick]         = useState(false);
  const rotRef = useRef(0);

  const coin        = availableCoins.find(c => c.symbol === selectedCoin) || STATIC_RATES["TON"];
  const usd         = parseFloat(usdAmount) || 0;
  const coinAmount  = coin && coin.rate ? usd / coin.rate : 0;
  const validBet    = usd >= 1 && usd <= 100;
  const coinBalance = balances?.[coin?.balKey] || 0;
  const hasBalance  = coinBalance >= coinAmount;

  const addPoints = (pts) => {
    const np = userPoints + pts;
    setUserPoints(np);
    localStorage.setItem("qai_user_points", np.toString());
  };

  const burst = (type) => {
    setParticleType(type);
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 2800);
  };

  // Çark dönerken yanıp sönme efekti
  useEffect(() => {
    let int, fl = false;
    if (spinning) {
       int = setInterval(() => {
          fl = !fl;
          setFlashTick(fl);
       }, 300); // 300ms'de bir disko ışığı efekti
    } else {
       setFlashTick(false);
    }
    return () => clearInterval(int);
  }, [spinning]);

  const spin = async () => {
    if (spinning) return;
    if (freeSpins <= 0 && (!validBet || !hasBalance)) return;

    if (freeSpins <= 0) {
      setTxStatus(`${coinAmount.toFixed(4)} ${selectedCoin} ${t ? t('games.payment') || 'ödemesi' : 'ödemesi'} yapılıyor...`);
      try {
        if (coin.networkKey === "TON") {
          const { sendTonFull, sendTonJetton } = await import("../blockchainService");
          if (coin.isNative) {
            await sendTonFull(walletData.mnemonic, WALLET_CONFIG.RECEIVERS?.TON, coinAmount.toFixed(4), "QAI Spin Play");
          } else {
            // Jetton ödemesi (USDT vb.)
            await sendTonJetton(walletData.mnemonic, WALLET_CONFIG.RECEIVERS?.TON, coinAmount, coin.contract, coin.decimals, WALLET_CONFIG.RECEIVERS?.TON, 0);
          }
        } else if (coin.networkKey === "TRX") {
           // TRON için cüzdanda TronWeb olmadığı için şu an sadece feyk bekleme veya uyarı
           await new Promise(r => setTimeout(r, 1500));
        } else {
          // EVM (ETH, BNB, MATIC, ARB, BASE, MONAD)
          const { getEvmPrivateKey } = await import("../walletService");
          const { sendEVM }          = await import("../blockchainService");
          const pk       = await getEvmPrivateKey(walletData.mnemonic);
          const rpcList  = WALLET_CONFIG.RPC_NODES?.[coin.networkKey] || WALLET_CONFIG.RPC_NODES?.ETH || [];
          const receiver = WALLET_CONFIG.RECEIVERS?.[coin.networkKey] || WALLET_CONFIG.RECEIVERS?.EVM;
          
          if (rpcList.length > 0) {
              await sendEVM(pk, receiver, coinAmount.toFixed(coin.decimals > 6 ? 6 : coin.decimals), rpcList[0], coin.isNative ? null : coin.contract);
          } else {
              await new Promise(r => setTimeout(r, 1500));
          }
        }
        
        // Cüzdandan alınan işlemleri hafızaya yaz (Admin panel istatistiği için)
        const inv = JSON.parse(localStorage.getItem("qai_spin_investments") || "[]");
        inv.push({ coin:selectedCoin, usd, coinAmount, timestamp:Date.now() });
        localStorage.setItem("qai_spin_investments", JSON.stringify(inv));

        const np = totalPot + usd;
        setTotalPot(np);
        localStorage.setItem("qai_wheel_pot", np.toString());
      } catch (e) {
        setTxStatus((t ? t('games.error') : "İşlem Hatası") + ": " + e.message);
        return;
      }
      setTxStatus("");
    } else {
      setFreeSpins(f => f - 1);
    }

    setSpinning(true); setShowResult(false); setResult(null);
    playSound('spin', soundEnabled);
    
    // Her çevirmede konfeti
    burst("win");

    const nc = incSpinCount(); setSpinCount(nc);

    // Havuz Gizli Jackpot Tetikleme Kontrolü
    let idx;
    if      (nc === _T2) { idx = 6; } // MEGA $200K
    else if (nc === _T1) { idx = 7; } // {t ? t('games.jackpot') : 'JACKPOT'} $1K
    else {
      // MEGA(6) ve {t ? t('games.jackpot') : 'JACKPOT'}(7) asla random çıkmaz, manual weights
      const w = [12, 20, 15, 12, 8, 2, 0, 0, 5, 5, 15, 2];
      let rnd = Math.random() * w.reduce((a, b) => a + b, 0);
      let i = 0;
      for (; i < w.length; i++) { rnd -= w[i]; if (rnd <= 0) break; }
      idx = i;
    }

    const segMid = idx * SLICE_DEG + SLICE_DEG / 2;
    const extra  = 5 + Math.floor(Math.random() * 3);
    const nr     = rotRef.current + extra * 360 + (360 - segMid);
    rotRef.current = nr % 360;
    setRotation(nr);

    setTimeout(() => {
      const seg = SEGMENTS[idx];
      setResult(seg); setShowResult(true); setSpinning(false);
      
      if (seg.type !== "pass" && seg.type !== "empty") {
         playSound('win', soundEnabled);
      }

      if (seg.type === "points") addPoints(seg.prize);
      if (seg.type === "retry")  setFreeSpins(f => f + 1);
      
      // Jackpot ve Mega Modalları
      if (seg.type === "jackpot") {
        playSound('jackpot', soundEnabled);
        burst("jackpot");
        setJackpotType("jackpot");
        const winners = JSON.parse(localStorage.getItem("qai_jackpot_winners") || "[]");
        winners.push({ type:"jackpot", prize:"$1,000", date:new Date().toISOString(), spinCount:nc });
        localStorage.setItem("qai_jackpot_winners", JSON.stringify(winners));
        setTimeout(() => setShowJackpotModal(true), 1200);
      }
      if (seg.type === "mega") {
        playSound('jackpot', soundEnabled);
        burst("mega");
        setJackpotType("mega");
        const winners = JSON.parse(localStorage.getItem("qai_jackpot_winners") || "[]");
        winners.push({ type:"mega", prize:"$200,000", date:new Date().toISOString(), spinCount:nc });
        localStorage.setItem("qai_jackpot_winners", JSON.stringify(winners));
        setTimeout(() => setShowJackpotModal(true), 1200);
      }
      
      if (seg.type === "ton")    burst("ton");
      if (seg.type === "points") burst("win");
    }, 5500); // Müzik stili ekstra spin süresi
  };

  const TABS = [
    { id:"menu",   label: t ? t('games.earningCenter') : "Kazanım Merkezi" },
    { id:"wheel",  label: t ? t('games.spinWheelTab') : "🎡 Çarkıfelek" },
    { id:"slot",   label: "🎰 Slot Makinesi" },
    { id:"mining", label: t ? t('games.apyMining') : "⛏️ APY Madenciliği" },
    { id:"daily",  label: t ? t('games.dailyReward') : "🎁 Günlük Ödül" },
  ];

  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
      style={{ minHeight:"100vh", background:"var(--bg-main)", paddingBottom:"120px" }}>

      <ParticleBurst active={showParticles} type={particleType} />

      {/* ── Header ── */}
      <div style={{ padding:"18px 20px 10px", display:"flex", alignItems:"center", gap:"14px", position:"sticky", top:0, background:"var(--bg-main)", zIndex:100, borderBottom:"1px solid var(--glass-border)" }}>
        <div onClick={activeTab==="menu" ? onBack : () => setActiveTab("menu")}
          style={{ background:"var(--bg-card)", padding:"9px", borderRadius:"11px", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <ChevronLeft size={20}/>
        </div>
        <h2 style={{ flex:1, fontSize:"1.1rem", fontWeight:"900", margin:0 }}>
          {TABS.find(tx => tx.id===activeTab)?.label || (t ? t('games.earningCenter') : "Kazanım Merkezi")}
        </h2>
        {activeTab === "wheel" && (
           <div onClick={() => setSoundEnabled(!soundEnabled)} style={{ padding:'8px', cursor:'pointer', background:'rgba(255,255,255,0.05)', borderRadius:'50%' }}>
              {soundEnabled ? <Volume2 size={18} color="#fff" /> : <VolumeX size={18} color="var(--text-muted)" />}
           </div>
        )}
      </div>

      {/* ── Ticker (menu + wheel) ── */}
      {(activeTab==="menu" || activeTab==="wheel") && (
        <div style={{ padding:"8px 20px 0" }}>
          <ActivityTicker spinCount={spinCount} t={t}/>
        </div>
      )}

      {/* ══════════════════════ MENU ══════════════════════ */}
      {activeTab==="menu" && (
        <div style={{ padding:"8px 20px", display:"flex", flexDirection:"column", gap:"12px" }}>

          {/* Hero */}
          <div style={{ background:"linear-gradient(135deg,#4f46e5,#7c3aed)", padding:"22px", borderRadius:"24px", color:"#fff", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-20, right:-20, fontSize:"5rem", opacity:0.1 }}>🎡</div>
            <h3 style={{ margin:"0 0 6px 0", fontSize:"1.3rem", fontWeight:"900" }}>{t ? t('games.earningCenter') : 'Kazanım Merkezi'}</h3>
            <p style={{ margin:0, fontSize:"0.78rem", opacity:0.9 }}>{t ? t('games.earnCenterDesc') : 'Çevir, stake et, görevleri tamamla, büyük ödüllere ulaş!'}</p>
          </div>

          {/* {t ? t('games.megaJackpot') : 'MEGA {t ? t('games.jackpot') : 'JACKPOT'}'} BANNER */}
          <motion.div
            animate={{ boxShadow:["0 0 16px rgba(220,38,38,0.4)","0 0 40px rgba(220,38,38,0.75)","0 0 16px rgba(220,38,38,0.4)"] }}
            transition={{ repeat:Infinity, duration:1.8 }}
            onClick={() => setActiveTab("wheel")}
            style={{ background:"linear-gradient(135deg,#450a0a,#b91c1c)", padding:"20px 22px", borderRadius:"22px", cursor:"pointer", border:"2px solid rgba(239,68,68,0.6)", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-8, right:-8, fontSize:"5rem", opacity:0.12 }}>💎</div>
            <div style={{ fontSize:"0.6rem", color:"#fca5a5", fontWeight:"900", letterSpacing:"2px", marginBottom:"4px" }}>🔴 {t ? t('games.megaJackpot') : 'MEGA JACKPOT'}</div>
            <div style={{ fontSize:"2rem", fontWeight:"900", color:"#fff", marginBottom:"2px" }}>$200,000 USD</div>
            <div style={{ fontSize:"0.7rem", color:"#fca5a5" }}>{t ? t('games.megaDesc') : 'Özel ikramiye havuzu aktif!'}</div>
          </motion.div>

          {/* Regular Jackpot */}
          <motion.div
            animate={{ boxShadow:["0 0 10px rgba(180,83,9,0.3)","0 0 28px rgba(180,83,9,0.7)","0 0 10px rgba(180,83,9,0.3)"] }}
            transition={{ repeat:Infinity, duration:2.4 }}
            onClick={() => setActiveTab("wheel")}
            style={{ background:"linear-gradient(135deg,#78350f,#b45309)", padding:"13px 18px", borderRadius:"16px", cursor:"pointer", border:"1px solid rgba(180,83,9,0.5)", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:"0.58rem", color:"#fde68a", fontWeight:"700" }}>🏆 {t ? t('games.jackpot') : 'JACKPOT'}</div>
              <div style={{ fontSize:"1.2rem", fontWeight:"900", color:"#fef3c7" }}>$1,000 USD</div>
            </div>
            {/* Total Pot Hidden as per user request */}
            <div style={{ flex:1 }}>
            </div>
          </motion.div>

          {/* Grid */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
            {[
              { id:"wheel",  emoji:"🎡", title: t ? t('games.spinWheel') : "Çarkıfelek",   desc:"$1–$100 · Tüm Coinler", color:"rgba(124,58,237,0.15)", border:"rgba(124,58,237,0.3)" },
              { id:"slot",   emoji:"🎰", title:"Slot Makinesi",  desc:"Bronz·Gümüş·Altın TON", color:"rgba(247,147,26,0.12)", border:"rgba(247,147,26,0.3)" },
              { id:"mining", emoji:"⛏️", title: t ? t('games.mining') : "Madencilik",   desc:"APY havuzları",          color:"rgba(16,185,129,0.1)",  border:"rgba(16,185,129,0.2)" },
              { id:"daily",  emoji:"🎁", title: t ? t('games.dailyRewardShort') : "Günlük Ödül", desc:"2500pts=25 TASTE",        color:"rgba(0,152,234,0.1)",   border:"rgba(0,152,234,0.2)"  },
            ].map(g => (
              <motion.div key={g.id} whileTap={{ scale:0.96 }} onClick={() => setActiveTab(g.id)}
                style={{ background:g.color, padding:"18px", borderRadius:"20px", border:`1px solid ${g.border}`, cursor:"pointer", gridColumn:g.id==="daily"?"span 2":"span 1", display:"flex", alignItems:"center", gap:"12px" }}>
                <div style={{ fontSize:"1.8rem" }}>{g.emoji}</div>
                <div>
                  <div style={{ fontWeight:"900", fontSize:"0.88rem" }}>{g.title}</div>
                  <div style={{ fontSize:"0.62rem", color:"var(--text-muted)" }}>{g.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Points/Spins Bar */}
          <div style={{ background:"var(--bg-card)", padding:"14px 16px", borderRadius:"16px", border:"1px solid var(--glass-border)", display:"flex", justifyContent:"space-between" }}>
            <div><div style={{ fontSize:"0.6rem", color:"var(--text-muted)", fontWeight:"700" }}>{t ? t('home.myPoints') || 'PUANLARIM' : 'PUANLARIM'}</div><div style={{ fontSize:"1.1rem", fontWeight:"900", color:"#fbbf24" }}>{userPoints.toLocaleString()}</div></div>
            <div style={{ textAlign:"right" }}><div style={{ fontSize:"0.6rem", color:"var(--text-muted)", fontWeight:"700" }}>{t ? t('games.spinCount') : 'SPIN SAYIM'}</div><div style={{ fontSize:"1.1rem", fontWeight:"900", color:"var(--primary)" }}>{spinCount.toLocaleString()}</div></div>
          </div>
        </div>
      )}

      {/* ══════════════════════ WHEEL ══════════════════════ */}
      {activeTab==="wheel" && (
        <div style={{ padding:"8px 20px", display:"flex", flexDirection:"column", alignItems:"center", gap:"14px" }}>

          {/* Dual Jackpot Banner */}
          <motion.div
            animate={{ boxShadow:["0 0 14px rgba(220,38,38,0.4)","0 0 36px rgba(220,38,38,0.8)","0 0 14px rgba(220,38,38,0.4)"] }}
            transition={{ repeat:Infinity, duration:1.8 }}
            style={{ width:"100%", background:"linear-gradient(135deg,#450a0a,#b91c1c)", borderRadius:"18px", padding:"12px 18px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:"0.58rem", color:"#fca5a5", fontWeight:"900" }}>💎 {t ? t('games.megaJackpot') : 'MEGA JACKPOT'}</div>
              <div style={{ fontSize:"1.3rem", fontWeight:"900", color:"#fff" }}>$200,000</div>
            </div>
            <div style={{ width:"1px", background:"rgba(255,255,255,0.15)", height:"36px" }}/>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontSize:"0.58rem", color:"#fde68a", fontWeight:"700" }}>🏆 {t ? t('games.jackpot') : 'JACKPOT'}</div>
              <div style={{ fontSize:"1.1rem", fontWeight:"900", color:"#fef3c7" }}>$1,000</div>
            </div>
          </motion.div>

          {/* Wheel - Disko efekti filtreleri */}
          <motion.div
            animate={{ rotate:rotation }}
            transition={{ duration:5, ease:[0.17,0.67,0.12,0.99] }}
            style={{
               filter:spinning ? (flashTick ? "drop-shadow(0 0 35px #a855f7) hue-rotate(45deg) brightness(1.2)" : "drop-shadow(0 0 20px #ec4899) hue-rotate(-20deg) brightness(1.3)") 
                               : "drop-shadow(0 0 6px rgba(124,58,237,0.3))", 
               transition:"filter 0.2s"
            }}>
            <WheelSVG segments={SEGMENTS}/>
          </motion.div>

          {/* Result Card */}
          <AnimatePresence>
            {showResult && result && (
              <motion.div
                initial={{ scale:0.5, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.5, opacity:0 }}
                style={{
                  width:"100%", padding:"18px", borderRadius:"18px", textAlign:"center",
                  background: result.type==="mega"    ? "linear-gradient(135deg,#450a0a,#b91c1c)" :
                              result.type==="jackpot" ? "linear-gradient(135deg,#78350f,#b45309)" :
                              result.type==="pass" || result.type==="empty" ? "rgba(55,65,81,0.8)" : "rgba(34,197,94,0.1)",
                  border: result.type==="mega"    ? "2px solid #ef4444" :
                          result.type==="jackpot" ? "2px solid #f59e0b" :
                          result.type==="pass" || result.type==="empty" ? "1px solid #374151" : "1px solid #22c55e",
                }}>
                <div style={{ fontSize:"2rem", marginBottom:"6px" }}>
                  {result.type==="mega" ? "💎" : result.type==="jackpot" ? "🏆" : result.type==="pass" ? "😔" : result.type==="retry" ? "🔄" : result.type==="ton" ? "💎" : "🎉"}
                </div>
                <div style={{ fontWeight:"900", fontSize:result.type==="mega"?"1.3rem":"1rem", color:result.type==="mega"||result.type==="jackpot"?"#fef3c7":"#fff" }}>
                  {result.type==="mega" && (
                    <>🎊 $200,000 {t ? t('games.megaJackpot') : 'MEGA JACKPOT'}!</>
                  )}
                  {result.type==="jackpot" && (
                    <>🎊 $1,000 {t ? t('games.jackpot') : 'JACKPOT'} {t ? t('games.youWon') : 'KAZANDIN!'}</>
                  )}
                  {result.type==="pass" && (
                    <>{t ? t('games.noLuck') : 'Bu sefer şans yok, tekrar dene!'}</>
                  )}
                  {result.type==="retry" && (
                    <>{t ? t('games.freeSpinWon') : 'Bedava Çevirme Kazandın!'}</>
                  )}
                  {result.type==="ton" && (
                    <>{result.prize} TON {t ? t('games.wonCoin') || 'Kazandın!' : 'Kazandın!'}</>
                  )}
                  {(!["mega","jackpot","pass","retry","ton"].includes(result.type)) && (
                    <>{result.prize?.toLocaleString()} {t ? t('games.pointsStr') : 'Puan'} {t ? t('games.wonCoin') || 'Kazandın!' : 'Kazandın!'}</>
                  )}
                </div>
                {(result.type==="mega" || result.type==="jackpot") && (
                  <motion.button whileTap={{ scale:0.96 }} onClick={() => setShowJackpotModal(true)}
                    style={{ marginTop:"12px", padding:"12px 24px", background:"#fff", color:result.type==="mega"?"#b91c1c":"#b45309", border:"none", borderRadius:"12px", fontWeight:"900", cursor:"pointer", fontSize:"0.88rem" }}>
                    🎁 {t ? t('games.claimPrize') : 'Ödülü Talep Et'}
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Coin Selector ── */}
          <div style={{ width:"100%", background:"var(--bg-card)", borderRadius:"18px", padding:"16px", border:"1px solid var(--glass-border)" }}>
            <div style={{ fontSize:"0.68rem", color:"var(--text-muted)", fontWeight:"700", marginBottom:"10px", letterSpacing:"1px" }}>{t ? t('games.paymentAsset') : 'ÖDEME KULLANILACAK VARLIK'}</div>
            <div style={{ display:"flex", gap:"6px", marginBottom:"14px", overflowX:"auto", paddingBottom:"2px" }}>
              {availableCoins.map(c => (
                <button key={c.symbol} onClick={() => setSelectedCoin(c.symbol)}
                  style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"4px", padding:"8px 10px", borderRadius:"12px",
                    border:selectedCoin===c.symbol ? `2px solid ${c.color}` : "1px solid var(--glass-border)",
                    background:selectedCoin===c.symbol ? `${c.color}22` : "rgba(255,255,255,0.03)",
                    cursor:"pointer", minWidth:"65px", flexShrink:0, outline:"none" }}>
                  <img src={c.icon} style={{ width:"22px", height:"22px", borderRadius:"50%" }} alt={c.symbol} onError={e => { e.target.style.display="none"; }}/>
                  <span style={{ fontSize:"0.55rem", fontWeight:"900", color:selectedCoin===c.symbol ? c.color : "var(--text-muted)" }}>{c.symbol}</span>
                </button>
              ))}
            </div>

            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
              <span style={{ fontSize:"0.68rem", color:"var(--text-muted)", fontWeight:"700" }}>{t ? t('games.spinAmount') : 'ÇEVİRME TUTARI (USD)'}</span>
              <span style={{ fontSize:"0.68rem", color:"var(--text-muted)" }}>{t ? t('games.minMax') : 'Min $1 · Max $100'}</span>
            </div>
            <div style={{ display:"flex", gap:"5px", marginBottom:"8px" }}>
              {["1","5","10","25","50","100"].map(v => (
                <button key={v} onClick={() => setUsdAmount(v)}
                  style={{ flex:1, padding:"6px 2px", borderRadius:"8px",
                    border:usdAmount===v ? "1px solid var(--primary)" : "1px solid var(--glass-border)",
                    background:usdAmount===v ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.03)",
                    color:usdAmount===v ? "var(--primary)" : "var(--text-muted)",
                    fontSize:"0.58rem", fontWeight:"900", cursor:"pointer", outline:"none" }}>
                  ${v}
                </button>
              ))}
            </div>
            <input type="number" value={usdAmount} onChange={e => setUsdAmount(e.target.value)} min="1" max="100"
              style={{ width:"100%", background:"rgba(255,255,255,0.03)", border:"1px solid var(--glass-border)", borderRadius:"10px", padding:"10px 12px", color:"#fff", fontSize:"0.95rem", fontWeight:"700", outline:"none", boxSizing:"border-box" }}/>

            <div style={{ display:"flex", justifyContent:"space-between", marginTop:"8px", fontSize:"0.7rem" }}>
              <span style={{ color:"#22c55e", fontWeight:"700" }}>≈ {coinAmount.toFixed(4)} {selectedCoin} {t ? t('games.payment') || 'ödemesi' : 'ödemesi'}</span>
              <span style={{ color:"var(--text-muted)" }}>{t ? t('games.walletLabel') : 'Cüzdan:'} {coinBalance.toFixed(4)} {selectedCoin}</span>
            </div>
            {usd > 0 && usd < 1   && <div style={{ color:"#ef4444", fontSize:"0.68rem", marginTop:"4px", fontWeight:"bold" }}>Min. $1 tutarında bir coin {t ? t('games.payment') || 'ödemesi' : 'ödemesi'} gereklidir.</div>}
            {usd > 100             && <div style={{ color:"#ef4444", fontSize:"0.68rem", marginTop:"4px" }}>Maksimum limit $100'dır.</div>}
            {!hasBalance && usd>=1 && <div style={{ color:"#ef4444", fontSize:"0.68rem", marginTop:"4px", fontWeight:"bold" }}>{t ? t('games.insufficient') || 'Yetersiz' : 'Yetersiz'} {selectedCoin} bakiyesi. Lütfen bakiyesi olan başka bir coin seçin!</div>}
          </div>

          {/* Spin Button */}
          <motion.button whileTap={{ scale:0.96 }}
            disabled={spinning || (freeSpins<=0 && (!validBet || !hasBalance))}
            onClick={spin}
            style={{ width:"100%", padding:"18px", borderRadius:"18px", border:"none",
              background:spinning || (freeSpins<=0 && !hasBalance) ? "rgba(124,58,237,0.3)" : "linear-gradient(135deg,#7c3aed,#ec4899)",
              color:spinning || (freeSpins<=0 && !hasBalance) ? "rgba(255,255,255,0.4)" : "#fff", fontWeight:"900", fontSize:"1.2rem",
              cursor:spinning || (freeSpins<=0 && !hasBalance) ? "not-allowed" : "pointer",
              boxShadow:spinning || (freeSpins<=0 && !hasBalance) ? "none" : "0 8px 25px rgba(124,58,237,0.4)",
              display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
              marginTop: "8px" }}>
            {spinning ? (
              <><motion.div animate={{ rotate:360 }} transition={{ repeat:Infinity, duration:1 }} style={{ width:"18px", height:"18px", border:"3px solid #fff", borderTopColor:"transparent", borderRadius:"50%" }}/> {t ? t('games.spinning') : 'Şansın Dönüyor...'}</>
            ) : freeSpins>0 ? (
              <><RotateCcw size={20}/> {t ? t('games.useFreeSpin') : 'BEDAVA ÇEVİRME KULLAN'} ({freeSpins})</>
            ) : (
              <><RotateCcw size={20}/> {t ? t('games.spinAction') : 'ÇARKIFELEĞİ ÇEVİR'} (${usd} DEĞERİNDE ŞANS)</>
            )}
          </motion.button>
          {txStatus && <div style={{ color:"#f59e0b", fontSize:"0.75rem", textAlign:"center", fontWeight:"bold", padding:"10px", background:"rgba(245,158,11,0.15)", borderRadius:"10px" }}>{txStatus}</div>}

          {/* Mini Stats */}
          <div style={{ width:"100%", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px", marginTop: "10px" }}>
            <div style={{ background:"var(--bg-card)", padding:"16px", borderRadius:"16px", border:"1px solid var(--glass-border)", textAlign:"center", boxShadow:"0 4px 15px rgba(0,0,0,0.2)" }}>
              <div style={{ fontSize:"0.62rem", color:"var(--text-muted)", marginBottom:"5px" }}>{t ? t('games.yourPoints') : 'PUANLARIN'}</div>
              <div style={{ fontSize:"1.2rem", fontWeight:"900", color:"#fbbf24" }}>{userPoints.toLocaleString()}</div>
            </div>
            <div style={{ background:"var(--bg-card)", padding:"16px", borderRadius:"16px", border:"1px solid var(--glass-border)", textAlign:"center", boxShadow:"0 4px 15px rgba(0,0,0,0.2)" }}>
              <div style={{ fontSize:"0.62rem", color:"var(--text-muted)", marginBottom:"5px" }}>{t ? t('games.spinCode') : 'ÜRETİLEN SPIN KODU'}</div>
              <div style={{ fontSize:"1.2rem", fontWeight:"900", color:"var(--primary)" }}>#{spinCount.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════ SLOT ══════════════════════ */}
      {activeTab==="slot" && (
        <SlotGame walletData={walletData} balances={balances} t={t}/>
      )}

      {/* ══════════════════════ MINING ══════════════════════ */}
      {activeTab==="mining" && (
        <div style={{ padding:"16px 20px" }}>
          <MiningPanel balances={balances} walletData={walletData} addPoints={addPoints} t={t}/>
        </div>
      )}

      {/* ══════════════════════ DAILY ══════════════════════ */}
      {activeTab==="daily" && (
        <div style={{ padding:"16px 20px" }}>
          <DailyPanel addPoints={addPoints}/>
        </div>
      )}

      {/* ══ {t ? t('games.jackpot') : 'JACKPOT'} CLAIM MODAL ══════════════════════════════ */}
      <AnimatePresence>
        {showJackpotModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.92)", zIndex:9100, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
            <motion.div initial={{ scale:0.8, y:60 }} animate={{ scale:1, y:0 }} exit={{ scale:0.8, y:60 }}
              style={{
                background:jackpotType==="mega" ? "linear-gradient(135deg,#1a0000,#450a0a)" : "linear-gradient(135deg,#1c0e00,#451a03)",
                borderRadius:"28px", padding:"32px 24px",
                border:jackpotType==="mega" ? "2px solid #ef4444" : "2px solid #f59e0b",
                width:"100%", maxWidth:"360px", textAlign:"center",
                boxShadow:jackpotType==="mega" ? "0 0 60px rgba(239,68,68,0.5)" : "0 0 60px rgba(245,158,11,0.5)",
              }}>
              <motion.div animate={{ scale:[1,1.15,1], rotate:[0,5,-5,0] }} transition={{ repeat:Infinity, duration:2 }} style={{ fontSize:"4rem", marginBottom:"16px" }}>
                {jackpotType==="mega" ? "💎" : "🏆"}
              </motion.div>
              <h2 style={{ fontWeight:"900", marginBottom:"10px", color:jackpotType==="mega"?"#fca5a5":"#fde68a", fontSize:"1.5rem", lineHeight:1.2 }}>
                {jackpotType==="mega" ? `$200,000 ${t ? t('games.youWon') : 'KAZANDIN!'}` : `$1,000 ${t ? t('games.youWon') : 'KAZANDIN!'}`}
              </h2>
              <p style={{ color:"rgba(255,255,255,0.85)", fontSize:"0.85rem", marginBottom:"22px", lineHeight:1.65 }}>
                {t ? t('games.megaWinDesc') || '...' : '...'}
              </p>
              <a href="https://t.me/QAI_WALLET" target="_blank" rel="noreferrer"
                style={{ display:"block", padding:"16px", background:jackpotType==="mega"?"#ef4444":"#f59e0b", color:"#fff", borderRadius:"16px", fontWeight:"900", textDecoration:"none", marginBottom:"12px", fontSize:"1rem", boxShadow:"0 4px 15px rgba(0,0,0,0.3)" }}>
                📩 {t ? t('games.contactAdmins') : 'Yöneticilere Ulaş'} (@QAI_WALLET)
              </a>
              <button onClick={() => setShowJackpotModal(false)}
                style={{ width:"100%", padding:"12px", background:"rgba(255,255,255,0.06)", color:"rgba(255,255,255,0.45)", border:"1px solid rgba(255,255,255,0.12)", borderRadius:"12px", fontWeight:"700", cursor:"pointer", fontSize:"0.82rem" }}>
                Daha sonra hatırlat
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default GamesHub;
