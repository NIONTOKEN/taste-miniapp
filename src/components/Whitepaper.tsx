import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Tokenomics } from './Tokenomics'

export function Whitepaper() {
    const { t } = useTranslation()

    return (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>📄 {t('whitepaper.title')}</h3>

            {/* Branding Image */}
            <div style={{ marginBottom: '25px', borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(255,193,7,0.2)' }}>
                <img
                    src="/info_branding.jpg"
                    alt="Taste Branding"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                />
            </div>

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
                        <span>🔒 {t('whitepaper.tokenomics.allocation.locked')}</span>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ fontWeight: 'bold' }}>22,100,000</span>
                            <div style={{ fontSize: '10px', color: '#22c55e' }}>🔐 JVault Locked — %88.4</div>
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
                            <div style={{ fontSize: '10px', color: '#eab308' }}>👥 Ekip — %2</div>
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
                            <div style={{ fontSize: '10px', color: '#f59e0b' }}>👑 Kurucu — %2</div>
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
                            <div style={{ fontSize: '10px', color: '#6366f1' }}>🔄 Havuzda: 221,171 — %6.4</div>
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
                            <div style={{ fontSize: '10px', color: '#ec4899' }}>🚀 Dağıtılıyor — %0.2</div>
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
                            <div style={{ fontSize: '10px', color: '#f97316' }}>💼 Masraf/Borsa — %1</div>
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
                        🔒 JVault Token Kilitleri — Toplam %88.4
                    </div>
                    {[
                        { label: 'Kilit 1 — 10,000,000 TASTE (%40)', addr: 'EQDKKeOpSEE_diuEGULjR-yrJwrGOSwoHvYVdAPmtbeNj0v2' },
                        { label: 'Kilit 2 — 8,000,000 TASTE (%32)', addr: 'EQDZLpOUQHOF1C6ekwMl3ERhl-j--r3zprppGtgm287K-6sc' },
                        { label: 'Kilit 3 — 4,100,000 TASTE (%16.4)', addr: 'EQDi4tBlzXtLMXQA1OVOZfKVwLiGoM-tU0rNBVc8e4rHt3co' },
                    ].map((lock, i) => (
                        <div key={i} onClick={() => {
                            const url = `https://tonscan.org/nft/${lock.addr}`;
                            if (window.Telegram?.WebApp) window.Telegram.WebApp.openLink(url);
                            else window.open(url, '_blank');
                        }} style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', padding: '10px 12px', marginBottom: '8px', cursor: 'pointer' }}>
                            <div style={{ fontSize: '11px', color: '#22c55e', fontWeight: 700, marginBottom: '4px' }}>✅ {lock.label}</div>
                            <div style={{ fontSize: '9px', color: '#64748b', fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.6 }}>{lock.addr}</div>
                            <div style={{ fontSize: '9px', color: '#22c55e', marginTop: '4px' }}>🔗 Tonscan'da Gör →</div>
                        </div>
                    ))}
                </div>

                {/* 💧 LP Token Kilidi */}
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>
                        💧 LP Token Kilidi (tinu-locker.ton)
                    </div>
                    <div onClick={() => {
                        const url = 'https://tonscan.org/jetton/0:86107ac1baea0a549ff42ea432dfc17e73ea4df89af3d0cfc049d0ad27164bef';
                        if (window.Telegram?.WebApp) window.Telegram.WebApp.openLink(url);
                        else window.open(url, '_blank');
                    }} style={{ background: 'rgba(129,140,248,0.06)', border: '1px solid rgba(129,140,248,0.25)', borderRadius: '10px', padding: '12px', cursor: 'pointer' }}>
                        <div style={{ fontSize: '11px', color: '#818cf8', fontWeight: 700, marginBottom: '6px' }}>✅ pTON-TASTE LP Tokeni — %81.6 Kilitli</div>
                        <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '4px' }}>Kilit Kontratı: tinu-locker.ton</div>
                        <div style={{ fontSize: '9px', color: '#64748b', fontFamily: 'monospace', wordBreak: 'break-all', lineHeight: 1.6 }}>0:f7d8b5faf56677ef9349d32f1be567722b4dd756378e6835ae580553ba2a3563</div>
                        <div style={{ fontSize: '9px', color: '#818cf8', marginTop: '4px' }}>🔗 Tonscan'da Gör →</div>
                    </div>
                </div>

                {/* Contract */}
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
                        🔐 Mint Yetkisi Neden Açık Bırakıldı?
                    </div>
                    <p style={{ fontSize: '12px', color: '#c4b5fd', lineHeight: 1.8, margin: '0 0 10px' }}>
                        TASTE projesi <strong style={{ color: '#a78bfa' }}>kontrollü ve güven temelli</strong> bir ekonomi üzerine kurulmuştur.
                        Sonradan keyfi arz artışlarını ve enflasyon riskini önlemek amacıyla token sabit 25M arz ile oluşturulmuş
                        ve <strong style={{ color: '#a78bfa' }}>şimdiye kadar hiç mint yapılmamıştır.</strong>
                    </p>
                    <p style={{ fontSize: '12px', color: '#c4b5fd', lineHeight: 1.8, margin: 0 }}>
                        Mint yetkisi teknik olarak açık bırakılmıştır çünkü TASTE ileride
                        <strong style={{ color: '#a78bfa' }}> restoran, lokanta, otel ve zincir işletmeler</strong> ile entegre
                        bir indirim-kupon sistemi kurduğunda, ekosistemi büyütmek için topluluk bir arz düzenlemesine ihtiyaç
                        duyabilir. Bu ihtimal önceden kapatılmamıştır — ancak
                        <strong style={{ color: '#22c55e' }}> ekip bu yetkiyi tek başına kullanamaz.</strong>
                    </p>
                </div>

                {/* DAO Süreci */}
                <div style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.06), rgba(34,197,94,0.02))', border: '1px solid rgba(34,197,94,0.15)', borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>
                        🏛️ DAO ile Arz Artışı — Nasıl İşler?
                    </div>
                    <p style={{ fontSize: '12px', color: '#86efac', lineHeight: 1.8, margin: '0 0 10px' }}>
                        İleride arz artışı gündeme gelirse bu karar <strong>yalnızca şu adımlarla</strong> hayata geçebilir:
                    </p>
                    {[
                        '🗳️ Topluluk DAO oylaması açılır',
                        '📣 Şeffaf kamuoyu bilgilendirme kampanyası yapılır',
                        '✅ Çoğunluk onayı alınır',
                        '📋 Tüm süreç zincir üzerinde kayıt altına alınır',
                    ].map((step, i) => (
                        <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
                            <span style={{ fontSize: '12px', color: '#22c55e', flexShrink: 0 }}>{`${i + 1}.`}</span>
                            <p style={{ fontSize: '12px', color: '#86efac', lineHeight: 1.6, margin: 0 }}>{step}</p>
                        </div>
                    ))}
                </div>

                {/* Güvenlik Neden Kilitli */}
                <div style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.07), rgba(245,158,11,0.02))', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px' }}>
                        🔒 Neden Bu Kadar Çok Token Kilitlendi?
                    </div>
                    {[
                        { icon: '🐋', text: 'Balina oluşumunu önlemek — Birinin arzın büyük bölümünü ele geçirip fiyatı manipüle etmesini engellemek için.' },
                        { icon: '📉', text: 'Ani dump hareketlerini önlemek — Büyük miktarların birden satışa çıkmasını engellemek için.' },
                        { icon: '🎭', text: 'Yapay hype & fiyat manipülasyonunu önlemek — Spekülatif değil, gerçek kullanım odaklı büyüme için.' },
                        { icon: '🏗️', text: 'Uzun vadeli ekosistem güvenliği — Sürdürülebilir ve sağlıklı bir ekonomi inşa etmek için.' },
                    ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '8px', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '16px', flexShrink: 0 }}>{item.icon}</span>
                            <p style={{ fontSize: '12px', color: '#fcd34d', lineHeight: 1.7, margin: 0 }}>{item.text}</p>
                        </div>
                    ))}
                </div>

                {/* Son mesaj */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#f59e0b', marginBottom: '6px' }}>
                        💎 TASTE Felsefesi
                    </div>
                    <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.7, margin: 0 }}>
                        <em>"TASTE, kısa vadeli hype projelerinden ayrışan, uzun vadeli bir Web3 girişimidir.<br />
                            Sabit arz · Kontrollü likidite · Gerçek dünya kullanımı · DAO temelli gelecek planlaması"</em>
                    </p>
                    <div style={{ fontSize: '10px', color: '#475569', marginTop: '8px' }}>— Resmi TASTE Whitepaper (tastetoken.net)</div>
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
