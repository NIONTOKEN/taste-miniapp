import { useTranslation, Trans } from 'react-i18next'
import { motion } from 'framer-motion'

export function Whitepaper() {
    const { t } = useTranslation()

    return (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>📄 {t('whitepaper.title')}</h3>

            {/* TASTE Özet Kart */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    marginBottom: '25px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: 'linear-gradient(145deg, rgba(15,23,42,0.98), rgba(30,41,59,0.9))',
                    border: '1px solid rgba(245,159,11,0.25)',
                    padding: '24px 20px',
                    position: 'relative',
                }}
            >
                {/* Arkaplan parıltısı */}
                <div style={{
                    position: 'absolute', top: '-30%', right: '-10%',
                    width: '200px', height: '200px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(245,159,11,0.08), transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-30%', left: '-10%',
                    width: '180px', height: '180px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(129,140,248,0.06), transparent 70%)',
                    pointerEvents: 'none',
                }} />

                {/* Üst rozet */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(245,159,11,0.15), rgba(245,159,11,0.05))',
                        border: '1px solid rgba(245,159,11,0.3)',
                        borderRadius: '30px',
                        padding: '5px 16px',
                        fontSize: '10px',
                        fontWeight: 800,
                        color: '#f59e0b',
                        letterSpacing: '2px',
                        textTransform: 'uppercase',
                    }}>
                        {t('whitepaper.summary.badge')}
                    </div>
                </div>

                {/* Başlık */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div style={{ fontSize: '28px', fontWeight: 900, color: '#f59e0b', letterSpacing: '-0.5px', lineHeight: 1.1, marginBottom: '8px' }}>
                        TASTE Token
                    </div>
                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, margin: 0, maxWidth: '280px', marginInline: 'auto' }}>
                        {t('whitepaper.summary.subtitle')}
                    </p>
                </div>

                {/* 4 ana özellik */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                    {[
                        { icon: '🔒', label: t('whitepaper.summary.fixed_supply'), value: '25,000,000', sub: t('whitepaper.summary.no_mint'), color: '#22c55e' },
                        { icon: '⛓️', label: 'Blockchain', value: 'TON', sub: 'The Open Network', color: '#0098EA' },
                        { icon: '🔐', label: t('whitepaper.summary.lock_prefix'), value: '%88.4', sub: `JVault ${t('whitepaper.summary.secured')}`, color: '#f59e0b' },
                        { icon: '🏛️', label: t('whitepaper.summary.governance'), value: 'DAO', sub: t('whitepaper.summary.community_decision'), color: '#818cf8' },
                    ].map((item, i) => (
                        <div key={i} style={{
                            background: `${item.color}09`,
                            border: `1px solid ${item.color}22`,
                            borderRadius: '14px',
                            padding: '12px',
                            position: 'relative',
                        }}>
                            <div style={{ fontSize: '18px', marginBottom: '4px' }}>{item.icon}</div>
                            <div style={{ fontSize: '10px', color: `${item.color}90`, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>{item.label}</div>
                            <div style={{ fontSize: '16px', fontWeight: 900, color: item.color, lineHeight: 1.1 }}>{item.value}</div>
                            <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>{item.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Kullanım alanları */}
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    border: '1px solid rgba(255,255,255,0.06)',
                }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>
                        {t('whitepaper.summary.target_use')}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {(t('whitepaper.summary.tags', { returnObjects: true }) as string[]).map((tag, i) => (
                            <span key={i} style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '20px',
                                padding: '4px 10px',
                                fontSize: '11px',
                                color: 'rgba(255,255,255,0.6)',
                            }}>{tag}</span>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Asansör Konuşması (Pitch) */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ 
                    marginBottom: '25px',
                    padding: '20px',
                    background: 'linear-gradient(135deg, rgba(245,159,11,0.1), rgba(0,0,0,0.2))',
                    border: '1px solid rgba(245,159,11,0.2)',
                    borderRadius: '16px',
                }}
            >
                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>🤔</div>
                    <h4 style={{ color: '#f59e0b', fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {t('whitepaper.pitch.title')}
                    </h4>
                </div>
                
                <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.7', whiteSpace: 'pre-line', marginBottom: '12px', textAlign: 'center' }}>
                    {t('whitepaper.pitch.text1')}
                </p>
                
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '12px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <p style={{ fontSize: '14px', color: '#fcd34d', lineHeight: '1.7', margin: 0 }}>
                        <Trans
                            i18nKey="whitepaper.pitch.text2"
                            components={{ highlight: <span style={{ color: '#f59e0b', fontWeight: 800 }} /> }}
                        />
                    </p>
                </div>

                <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.7', marginBottom: '8px', textAlign: 'center' }}>
                    {t('whitepaper.pitch.text3')}
                </p>

                <div style={{ textAlign: 'center', margin: '15px 0' }}>
                    <Trans
                        i18nKey="whitepaper.pitch.text4"
                        components={{ highlight: <span style={{ color: '#22c55e', fontWeight: 900, fontSize: '15px', display: 'block', marginBottom: '5px' }} /> }}
                    />
                </div>

                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '15px', fontStyle: 'italic', textAlign: 'center' }}>
                    {t('whitepaper.pitch.text5')}
                </p>

                <div style={{ textAlign: 'center', background: 'var(--gradient-gold)', padding: '15px', borderRadius: '12px', color: '#000' }}>
                    <Trans
                        i18nKey="whitepaper.pitch.text6"
                        components={{ highlight: <strong style={{ display: 'block', fontSize: '15px', marginTop: '6px', fontWeight: 900 }} /> }}
                    />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ marginBottom: '25px' }}
            >
                <h4 style={{ color: 'var(--primary)', marginBottom: '10px' }}>
                    📖 {t('whitepaper.general_info.title')}
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-main)', lineHeight: '1.6', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', borderLeft: '4px solid var(--primary)' }}>
                    {t('whitepaper.general_info.content')}
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ marginBottom: '25px' }}
            >
                <h4 style={{ color: 'var(--primary)', marginBottom: '10px' }}>
                    ✨ {t('whitepaper.vision.title')}
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    {t('whitepaper.vision.content')}
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                style={{ marginBottom: '25px' }}
            >
                <h4 style={{ color: 'var(--primary)', marginBottom: '10px' }}>
                    🎯 {t('whitepaper.mission.title')}
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                    {t('whitepaper.mission.content')}
                </p>
            </motion.div>

            {/* Team Section */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ marginBottom: '25px' }}
            >
                <h4 style={{ color: 'var(--primary)', marginBottom: '15px' }}>
                    👥 {t('whitepaper.team.title')}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '16px', color: 'var(--primary)' }}>{t('whitepaper.team.fatih.name')}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('whitepaper.team.fatih.role')}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '16px', color: 'var(--primary)' }}>{t('whitepaper.team.angel.name')}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t('whitepaper.team.angel.role')}</div>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                style={{ marginBottom: '25px' }}
            >
                <h4 style={{ color: 'var(--primary)', marginBottom: '10px' }}>
                    📊 {t('whitepaper.tokenomics.title')}
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--primary)', marginBottom: '10px', fontWeight: 'bold' }}>
                    {t('whitepaper.tokenomics.initial_supply')}
                </p>
                <div style={{
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '12px',
                    padding: '10px',
                    fontSize: '13px',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    {/* 🔒 Kilitli */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span>🔒 {t('whitepaper.summary.lock_prefix')}</span>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontWeight: 'bold' }}>22,100,000</span>
                            <div style={{ fontSize: '10px', color: '#22c55e' }}>{`🔐 JVault ${t('whitepaper.summary.lock_prefix')} — %88.4`}</div>
                        </div>
                    </div>
                    {/* Bar */}
                    <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '4px' }}>
                        <div style={{ width: '88.4%', height: '100%', background: 'linear-gradient(90deg,#22c55e,#16a34a)', borderRadius: '4px' }} />
                    </div>

                    {/* 👥 Ekip */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span>👥 {t('whitepaper.tokenomics.allocation.team')}</span>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontWeight: 'bold' }}>500,000</span>
                            <div style={{ fontSize: '10px', color: '#eab308' }}>{`👥 ${t('whitepaper.team.title')} — %2`}</div>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '4px' }}>
                        <div style={{ width: '2%', height: '100%', background: 'linear-gradient(90deg,#eab308,#facc15)', borderRadius: '4px' }} />
                    </div>

                    {/* 👑 Kurucu */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span>👑 {t('whitepaper.tokenomics.allocation.founder')}</span>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontWeight: 'bold' }}>500,000</span>
                            <div style={{ fontSize: '10px', color: '#f59e0b' }}>{`👑 ${t('whitepaper.team.fatih.role')} — %2`}</div>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '4px' }}>
                        <div style={{ width: '2%', height: '100%', background: 'linear-gradient(90deg,#f59e0b,#fbbf24)', borderRadius: '4px' }} />
                    </div>

                    {/* 💧 Likidite */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span>💧 {t('whitepaper.tokenomics.allocation.liquidity')}</span>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontWeight: 'bold' }}>1,600,000</span>
                            <div style={{ fontSize: '10px', color: '#6366f1' }}>{`🔄 1.6M — %6.4`}</div>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '4px' }}>
                        <div style={{ width: '6.4%', height: '100%', background: 'linear-gradient(90deg,#6366f1,#818cf8)', borderRadius: '4px' }} />
                    </div>

                    {/* 🎁 Airdrop */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <span>🎁 {t('whitepaper.tokenomics.allocation.airdrop')}</span>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontWeight: 'bold' }}>50,000</span>
                            <div style={{ fontSize: '10px', color: '#ec4899' }}>🚀 %0.2</div>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', marginBottom: '4px' }}>
                        <div style={{ width: '0.2%', height: '100%', background: 'linear-gradient(90deg,#ec4899,#f472b6)', borderRadius: '4px', minWidth: '4px' }} />
                    </div>

                    {/* 💼 Masraf */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                        <span>💼 {t('whitepaper.tokenomics.allocation.ops')}</span>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontWeight: 'bold' }}>250,000</span>
                            <div style={{ fontSize: '10px', color: '#f97316' }}>💼 %1</div>
                        </div>
                    </div>
                    <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: '1%', height: '100%', background: 'linear-gradient(90deg,#f97316,#fb923c)', borderRadius: '4px' }} />
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
            >
                <h4 style={{ color: 'var(--primary)', marginBottom: '10px' }}>
                    🛡️ {t('whitepaper.supply_policy.title')}
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                    {t('whitepaper.supply_policy.content')}
                </p>

                {/* 🔒 JVault Token Kilitleri */}
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>
                        {`🔒 JVault ${t('whitepaper.summary.lock_prefix')}leri — %88.4`}
                    </div>
                    {[
                        { label: `${t('whitepaper.summary.lock_prefix')} 1 — 10,000,000 TASTE (40%)`, addr: 'EQDKKeOpSEE_diuEGULjR-yrJwrGOSwoHvYVdAPmtbeNj0v2' },
                        { label: `${t('whitepaper.summary.lock_prefix')} 2 — 8,000,000 TASTE (32%)`, addr: 'EQDZLpOUQHOF1C6ekwMl3ERhl-j--r3zprppGtgm287K-6sc' },
                        { label: `${t('whitepaper.summary.lock_prefix')} 3 — 4,100,000 TASTE (16.4%)`, addr: 'EQDi4tBlzXtLMXQA1OVOZfKVwLiGoM-tU0rNBVc8e4rHt3co' },
                    ].map((lock, i) => (
                        <div key={i} onClick={() => {
                            const url = `https://tonscan.org/nft/${lock.addr}`;
                            if (window.Telegram?.WebApp) window.Telegram.WebApp.openLink(url);
                            else window.open(url, '_blank');
                        }} style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', padding: '10px 12px', marginBottom: '8px', cursor: 'pointer' }}>
                            <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: 700, marginBottom: '4px' }}>✅ {lock.label}</div>
                            <div style={{ fontSize: '9px', color: '#64748b', fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.6 }}>{lock.addr}</div>
                            <div style={{ fontSize: '9px', color: '#22c55e', marginTop: '4px' }}>🔗 {t('whitepaper.summary.tonscan_view')}</div>
                        </div>
                    ))}
                </div>

                {/* 💧 LP Token Kilidit */}
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>
                        {t('whitepaper.summary.lp_lock_title')}
                    </div>
                    <div onClick={() => {
                        const url = 'https://tonscan.org/jetton/0:86107ac1baea0a549ff42ea432dfc17e73ea4df89af3d0cfc049d0ad27164bef';
                        if (window.Telegram?.WebApp) window.Telegram.WebApp.openLink(url);
                        else window.open(url, '_blank');
                    }} style={{ background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.25)', borderRadius: '10px', padding: '12px', cursor: 'pointer' }}>
                        <div style={{ fontSize: '11px', color: '#818cf8', fontWeight: 700, marginBottom: '6px' }}>{t('whitepaper.summary.lp_lock_status')}</div>
                        <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>{t('whitepaper.summary.lp_lock_contract')}</div>
                        <div style={{ fontSize: '9px', color: '#64748b', fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.6 }}>0:f7d8b5faf56677ef9349d32f1be567722b4dd756378e6835ae580553ba2a3563</div>
                        <div style={{ fontSize: '9px', color: '#818cf8', marginTop: '4px' }}>🔗 {t('whitepaper.summary.tonscan_view')}</div>
                    </div>
                </div>

                {/* Owner */}
                <div style={{ fontSize: '10px', color: 'var(--primary)', opacity: 0.7, wordBreak: 'break-all', fontFamily: 'monospace', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: '8px', lineHeight: '1.8' }}>
                    👤 Owner: UQBQiZVPYK_NZLZp_4orkmzNXYJpx28Y9CqRcpxo66kSoSCn
                </div>
            </motion.div>

            {/* DAO Açıklaması — Resmi Whitepaper'dan */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ marginTop: '20px', marginBottom: '16px' }}
            >
                {/* Neden Mint Açık? */}
                <div style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(124,58,237,0.03))', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>
                        {t('whitepaper.summary.why_mint_title')}
                    </div>
                    <p style={{ fontSize: '12px', color: '#c4b5fd', lineHeight: 1.8, margin: '0 0 10px' }}>
                        {t('whitepaper.summary.why_mint_desc')}
                    </p>
                    <p style={{ fontSize: '12px', color: '#c4b5fd', lineHeight: 1.8, margin: 0 }}>
                        {t('whitepaper.summary.why_mint_note')}
                    </p>
                </div>

                {/* DAO Süreci */}
                <div style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.06), rgba(34,197,94,0.02))', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>
                        {t('whitepaper.summary.dao_title')}
                    </div>
                    <p style={{ fontSize: '12px', color: '#86efac', lineHeight: 1.8, margin: '0 0 10px' }}>
                        {t('whitepaper.summary.dao_desc')}
                    </p>
                    {(t('whitepaper.summary.dao_steps', { returnObjects: true }) as string[]).map((step, i) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                            <span style={{ fontSize: '12px', color: '#22c55e', flexShrink: 0 }}>{`${i + 1}.`}</span>
                            <p style={{ fontSize: '12px', color: '#86efac', lineHeight: 1.6, margin: 0 }}>{step}</p>
                        </div>
                    ))}
                </div>

                {/* Güvenlik Neden Kilitli */}
                <div style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.07), rgba(245,158,11,0.02))', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>
                        {t('whitepaper.summary.lock_reason_title')}
                    </div>
                    {(t('whitepaper.summary.lock_reasons', { returnObjects: true }) as any[]).map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '16px', flexShrink: 0 }}>{item.icon}</span>
                            <p style={{ fontSize: '12px', color: '#fcd34d', lineHeight: 1.7, margin: 0 }}>{item.text}</p>
                        </div>
                    ))}
                </div>

                {/* OTC System TR */}
                <div style={{ background: 'linear-gradient(135deg, rgba(28,154,236,0.08), rgba(28,154,236,0.02))', border: '1px solid rgba(28,154,236,0.2)', borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>
                        🇹🇷 {t('whitepaper.otc_system.title')}
                    </div>
                    <p style={{ fontSize: '12px', color: '#bae6fd', lineHeight: 1.8, margin: 0 }}>
                        {t('whitepaper.otc_system.content')}
                    </p>
                </div>

                {/* Son mesaj */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#f59e0b', marginBottom: '6px' }}>
                        {t('whitepaper.summary.philosophy_title')}
                    </div>
                    <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
                        <em>{t('whitepaper.summary.philosophy_text')}</em>
                    </p>
                    <div style={{ fontSize: '10px', color: '#475569', marginTop: '8px' }}>{t('whitepaper.summary.official_source')}</div>
                </div>
            </motion.div>

            <div style={{
                marginTop: '10px',
                padding: '15px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '12px',
                fontSize: '12px',
                color: 'var(--text-muted)',
                textAlign: 'center',
                border: '1px dashed rgba(255,255,255,0.1)'
            }}>
                <div style={{ marginBottom: '10px', color: 'var(--primary)', fontWeight: 'bold', wordBreak: 'break-all' }}>
                    📄 Contract: <span style={{ color: 'var(--text-main)', userSelect: 'all' }}>EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-</span>
                </div>
                {t('app.description')}
            </div>
        </div>
    )
}
