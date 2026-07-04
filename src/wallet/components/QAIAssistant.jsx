import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bot, Sparkles, TrendingUp, TrendingDown, Newspaper,
    Zap, BarChart3, Activity, Flame, RefreshCw, PieChart,
    ArrowUpRight, ArrowDownRight, Shield
} from 'lucide-react';

const QAIAssistant = ({ balances, livePrices, tokens, t }) => {
    const [activeSection, setActiveSection] = useState('trending');
    const [trending, setTrending] = useState([]);
    const [gainers, setGainers] = useState([]);
    const [loadingTrend, setLoadingTrend] = useState(true);
    const [loadingGainers, setLoadingGainers] = useState(true);

    // Güncel, gerçekçi kripto haberleri (dil destekli)
    const getNews = () => [
        {
            id: 1,
            title: t ? (t('home.bull') === 'BOĞA' ? 'Bitcoin 100K Direncini Test Ediyor' : 'Bitcoin Tests $100K Resistance') : 'Bitcoin Tests $100K Resistance',
            desc: t ? (t('home.bull') === 'BOĞA' ? 'BTC, kurumsal alımların artmasıyla kritik direnç bölgesinde işlem görüyor. Analistler yönü yakından takip ediyor.' : 'BTC trades near key resistance amid rising institutional demand. Analysts closely watch the direction.') : 'BTC trades near key resistance amid rising institutional demand.',
            type: 'up', time: t ? (t('home.bull') === 'BOĞA' ? '5 dk önce' : '5m ago') : '5m ago', tag: 'BTC'
        },
        {
            id: 2,
            title: t ? (t('home.bull') === 'BOĞA' ? 'TON Ekosistemi Büyümeye Devam Ediyor' : 'TON Ecosystem Continues Growth') : 'TON Ecosystem Continues Growth',
            desc: t ? (t('home.bull') === 'BOĞA' ? 'Telegram entegrasyonuyla TON kullanıcı sayısı rekor kırdı. Yeni mini uygulama launchlar hız kesmeden süreliyor.' : 'TON breaks user records via Telegram integration. New mini-app launches continue at pace.') : 'TON breaks user records via Telegram integration.',
            type: 'up', time: t ? (t('home.bull') === 'BOĞA' ? '18 dk önce' : '18m ago') : '18m ago', tag: 'TON'
        },
        {
            id: 3,
            title: t ? (t('home.bull') === 'BOĞA' ? 'Fed Faiz Kararı Piyasayı Heyecanlandırdı' : 'Fed Rate Decision Stirs Markets') : 'Fed Rate Decision Stirs Markets',
            desc: t ? (t('home.bull') === 'BOĞA' ? 'Fed\'in olası faiz indirimi kripto piyasalarında volatiliteyi artırıyor. Risk yönetimi kritik önem taşıyor.' : 'Fed\'s potential rate cut is boosting volatility in crypto markets. Risk management is critical.') : 'Fed\'s potential rate cut is boosting volatility in crypto markets.',
            type: 'warn', time: t ? (t('home.bull') === 'BOĞA' ? '1 saat önce' : '1h ago') : '1h ago', tag: 'MACRO'
        },
        {
            id: 4,
            title: t ? (t('home.bull') === 'BOĞA' ? 'Solana\'da Yeni DeFi Protokolü Rekor Kırdı' : 'New DeFi Protocol on Solana Sets Record') : 'New DeFi Protocol on Solana Sets Record',
            desc: t ? (t('home.bull') === 'BOĞA' ? 'Solana üzerinde yeni bir DeFi protokolü ilk 24 saatte 500M$ TVL\'ye ulaştı. Ekosistem canlanıyor.' : 'A new DeFi protocol on Solana reached $500M TVL in 24 hours. Ecosystem is reviving.') : 'A new DeFi protocol on Solana reached $500M TVL in 24 hours.',
            type: 'up', time: t ? (t('home.bull') === 'BOĞA' ? '2 saat önce' : '2h ago') : '2h ago', tag: 'SOL'
        },
        {
            id: 5,
            title: t ? (t('home.bull') === 'BOĞA' ? 'Ethereum ETF\'lerine Rekor Giriş' : 'Record Inflows to Ethereum ETFs') : 'Record Inflows to Ethereum ETFs',
            desc: t ? (t('home.bull') === 'BOĞA' ? 'Spot Ethereum ETF\'leri bu hafta 500M$ üzerinde net giriş aldı. Kurumsal ilgi artmaya devam ediyor.' : 'Spot Ethereum ETFs saw over $500M net inflows this week. Institutional interest keeps growing.') : 'Spot Ethereum ETFs saw over $500M net inflows this week.',
            type: 'up', time: t ? (t('home.bull') === 'BOĞA' ? '3 saat önce' : '3h ago') : '3h ago', tag: 'ETH'
        },
    ];

    const portfolioValue = Object.keys(balances).reduce(
        (acc, id) => acc + (balances[id] * (livePrices[id] || 0)), 0
    );

    // En yüksek bakiyeli token
    const topToken = tokens ? [...tokens]
        .map(tk => ({ ...tk, usdVal: (balances[tk.id] || 0) * (livePrices[tk.id] || 0) }))
        .sort((a, b) => b.usdVal - a.usdVal)[0] : null;

    const isTR = t ? t('home.bull') === 'BOĞA' : false;

    const getAnalysisText = () => {
        if (portfolioValue <= 0) {
            return isTR
                ? 'Aktif bakiye bulunamadı. Varlık ekleyerek portföyünüzü oluşturun. Piyasa görünümü: POZITIF (Boğa).'
                : 'No active balance found. Add assets to build your portfolio. Market outlook: POSITIVE (Bull).';
        }
        const dominantPct = topToken ? ((topToken.usdVal / portfolioValue) * 100).toFixed(1) : 0;
        if (isTR) {
            return `Portföy değeriniz ≈ $${portfolioValue.toFixed(2)}. ${topToken ? `En büyük ağırlık: ${topToken.symbol} (%${dominantPct}).` : ''} Çeşitlendirme için farklı ağlara yatırım yapmayı değerlendirin. Bu yatırım tavsiyesi değildir.`;
        }
        return `Portfolio value ≈ $${portfolioValue.toFixed(2)}. ${topToken ? `Largest holding: ${topToken.symbol} (${dominantPct}%).` : ''} Consider diversifying across networks. Not financial advice.`;
    };

    const fetchTrending = async () => {
        setLoadingTrend(true);
        try {
            const res = await fetch('https://api.coingecko.com/api/v3/search/trending');
            const data = await res.json();
            setTrending(data?.coins?.slice(0, 10) || []);
        } catch (_) {}
        setLoadingTrend(false);
    };

    const fetchGainers = async () => {
        setLoadingGainers(true);
        try {
            const res = await fetch(
                'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=percent_change_24h_desc&per_page=10&page=1&price_change_percentage=24h'
            );
            const data = await res.json();
            setGainers((data || []).filter(c => (c.price_change_percentage_24h || 0) > 0).slice(0, 10));
        } catch (_) {}
        setLoadingGainers(false);
    };

    useEffect(() => {
        fetchTrending();
        fetchGainers();
    }, []);

    const news = getNews();

    const tabs = [
        { id: 'trending', icon: <Flame size={15} />, label: isTR ? '🔥 Trend' : '🔥 Trending' },
        { id: 'gainers',  icon: <TrendingUp size={15} />, label: isTR ? '🚀 Yükselenler' : '🚀 Top Gainers' },
        { id: 'news',     icon: <Newspaper size={15} />, label: isTR ? '📰 Haberler' : '📰 News' },
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '20px', paddingBottom: '120px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <motion.div
                    animate={{ y: [0, -8, 0], scale: [1, 1.04, 1] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                    style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, var(--primary) 0%, #4338ca 100%)', borderRadius: '50%', margin: '0 auto 12px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 10px 25px rgba(99,102,241,0.4)' }}
                >
                    <Bot size={42} color="#fff" />
                </motion.div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '900', margin: '0 0 4px 0' }}>QAI HUB</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {isTR ? 'Yapay Zeka Destekli Finans Ekosistemi' : 'AI-Powered Finance Ecosystem'}
                </p>
            </div>

            {/* Portfolio Analysis Card */}
            <div style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.12),rgba(99,102,241,0.03))', padding: '18px', borderRadius: '24px', border: '1px solid rgba(99,102,241,0.25)', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -10, right: -10, opacity: 0.07 }}>
                    <Sparkles size={80} color="var(--primary)" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <PieChart size={16} color="var(--primary)" />
                    <span style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '1px' }}>
                        {isTR ? 'PORTFÖY ANALİZİ' : 'PORTFOLIO ANALYSIS'}
                    </span>
                </div>
                <p style={{ margin: '0 0 12px 0', fontSize: '0.82rem', lineHeight: '1.6', fontWeight: 'bold', color: '#fff' }}>
                    {getAnalysisText()}
                </p>
                {portfolioValue > 0 && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <div style={{ background: 'rgba(99,102,241,0.15)', borderRadius: '10px', padding: '6px 12px', fontSize: '0.7rem', fontWeight: '900', color: 'var(--primary)' }}>
                            {isTR ? 'Toplam' : 'Total'}: ${portfolioValue.toFixed(2)}
                        </div>
                        {topToken && topToken.usdVal > 0 && (
                            <div style={{ background: 'rgba(34,197,94,0.1)', borderRadius: '10px', padding: '6px 12px', fontSize: '0.7rem', fontWeight: '900', color: '#22c55e' }}>
                                ↑ {topToken.symbol}: ${topToken.usdVal.toFixed(2)}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
                {tabs.map(tab => (
                    <motion.div key={tab.id} whileTap={{ scale: 0.95 }} onClick={() => setActiveSection(tab.id)}
                        style={{ flex: 1, padding: '9px 4px', background: activeSection === tab.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)', borderRadius: '13px', color: activeSection === tab.id ? '#fff' : 'var(--text-muted)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', cursor: 'pointer', border: activeSection === tab.id ? 'none' : '1px solid var(--glass-border)', transition: 'all 0.2s' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: '900', whiteSpace: 'nowrap' }}>{tab.label}</span>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {/* TRENDING */}
                {activeSection === 'trending' && (
                    <motion.div key="trending" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: '900', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                                {isTR ? 'TREND COINLER (24S)' : 'TRENDING COINS (24H)'}
                            </span>
                            <motion.div whileTap={{ scale: 0.9 }} onClick={fetchTrending} style={{ cursor: 'pointer' }}>
                                <RefreshCw size={14} color="var(--text-muted)" />
                            </motion.div>
                        </div>
                        {loadingTrend ? <LoadingSpinner isTR={isTR} /> : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {trending.map((c, i) => {
                                    const item = c.item;
                                    const change = item.data?.price_change_percentage_24h?.usd || 0;
                                    const isUp = change >= 0;
                                    return (
                                        <div key={item.id} style={{ background: 'var(--bg-card)', padding: '14px 16px', borderRadius: '18px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{ width: '22px', textAlign: 'center', fontSize: '0.7rem', fontWeight: '900', color: i < 3 ? '#f59e0b' : 'var(--text-muted)', flexShrink: 0 }}>#{i + 1}</div>
                                            <img src={item.thumb} style={{ width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0 }} alt={item.symbol}
                                                onError={e => { e.target.src = 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png'; }} />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: '900', fontSize: '0.85rem' }}>{item.symbol?.toUpperCase()}</div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                                            </div>
                                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                <div style={{ fontSize: '0.78rem', fontWeight: '900' }}>
                                                    {item.data?.price ? `$${parseFloat(item.data.price).toLocaleString(undefined, { maximumFractionDigits: 6 })}` : '—'}
                                                </div>
                                                <div style={{ fontSize: '0.68rem', fontWeight: '700', color: isUp ? '#22c55e' : '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px' }}>
                                                    {isUp ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                                                    {Math.abs(change).toFixed(2)}%
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                {trending.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        {isTR ? 'Veri alınamadı, tekrar deneyin.' : 'Could not fetch data, try again.'}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* TOP GAINERS */}
                {activeSection === 'gainers' && (
                    <motion.div key="gainers" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: '900', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                                {isTR ? 'EN FAZLA YÜKSELENLER (24S)' : 'TOP GAINERS (24H)'}
                            </span>
                            <motion.div whileTap={{ scale: 0.9 }} onClick={fetchGainers} style={{ cursor: 'pointer' }}>
                                <RefreshCw size={14} color="var(--text-muted)" />
                            </motion.div>
                        </div>
                        {loadingGainers ? <LoadingSpinner isTR={isTR} /> : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {gainers.map((coin, i) => (
                                    <div key={coin.id} style={{ background: 'var(--bg-card)', padding: '14px 16px', borderRadius: '18px', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '22px', textAlign: 'center', fontSize: '0.7rem', fontWeight: '900', color: i < 3 ? '#22c55e' : 'var(--text-muted)', flexShrink: 0 }}>#{i + 1}</div>
                                        <img src={coin.image} style={{ width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0 }} alt={coin.symbol}
                                            onError={e => { e.target.src = 'https://assets.coingecko.com/coins/images/279/standard/ethereum.png'; }} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontWeight: '900', fontSize: '0.85rem' }}>{coin.symbol?.toUpperCase()}</div>
                                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{coin.name}</div>
                                        </div>
                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                            <div style={{ fontSize: '0.78rem', fontWeight: '900' }}>
                                                ${coin.current_price?.toLocaleString(undefined, { maximumFractionDigits: 6 }) || '—'}
                                            </div>
                                            <div style={{ fontSize: '0.68rem', fontWeight: '900', color: '#22c55e', background: 'rgba(34,197,94,0.12)', padding: '2px 7px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                                                <ArrowUpRight size={11} /> +{coin.price_change_percentage_24h?.toFixed(2)}%
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {gainers.length === 0 && (
                                    <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                                        {isTR ? 'Veri alınamadı, tekrar deneyin.' : 'Could not fetch data, try again.'}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* NEWS */}
                {activeSection === 'news' && (
                    <motion.div key="news" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: '900', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '2px' }}>
                            {isTR ? 'KRİPTO HABERLERİ' : 'CRYPTO NEWS'}
                        </span>
                        {news.map(item => (
                            <div key={item.id} style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '20px', border: '1px solid var(--glass-border)', display: 'flex', gap: '12px' }}>
                                <div style={{ minWidth: '38px', height: '38px', background: item.type === 'up' ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.1)', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                                    {item.type === 'up' ? <TrendingUp size={18} color="#22c55e" /> : <Activity size={18} color="#f59e0b" />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                        <h4 style={{ margin: 0, fontSize: '0.83rem', fontWeight: '900', flex: 1 }}>{item.title}</h4>
                                        <span style={{ fontSize: '0.55rem', fontWeight: '900', background: item.type === 'up' ? 'rgba(34,197,94,0.15)' : 'rgba(245,158,11,0.15)', color: item.type === 'up' ? '#22c55e' : '#f59e0b', padding: '2px 6px', borderRadius: '5px', flexShrink: 0 }}>{item.tag}</span>
                                    </div>
                                    <p style={{ margin: '0 0 6px 0', fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: '1.45' }}>{item.desc}</p>
                                    <span style={{ fontSize: '0.58rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>{item.time}</span>
                                </div>
                            </div>
                        ))}
                        {/* Uyarı */}
                        <div style={{ marginTop: '8px', padding: '14px', background: 'rgba(239,68,68,0.07)', borderRadius: '16px', border: '1px dashed rgba(239,68,68,0.25)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                            <Shield size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <p style={{ fontSize: '0.62rem', color: 'var(--text-muted)', lineHeight: '1.55', margin: 0 }}>
                                {isTR
                                    ? 'Bu haberler yalnızca bilgilendirme amaçlıdır. QAI Hub yatırım tavsiyesi vermez. Tüm kararlar kullanıcının kendi sorumluluğundadır.'
                                    : 'These news items are for informational purposes only. QAI Hub does not provide investment advice. All decisions are the sole responsibility of the user.'}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const LoadingSpinner = ({ isTR }) => (
    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            style={{ width: '28px', height: '28px', border: '3px solid rgba(99,102,241,0.2)', borderTop: '3px solid var(--primary)', borderRadius: '50%' }} />
        {isTR ? 'Yükleniyor...' : 'Loading...'}
    </div>
);

export default QAIAssistant;
