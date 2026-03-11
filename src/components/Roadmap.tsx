import { motion } from 'framer-motion'

// ─── Tamamlanan işler (gerçek, kanıtlı) ───────────────────────────────────
const COMPLETED = [
    { emoji: '🪙', title: 'Token Mint & Piyasaya Sürüm', desc: 'TASTE token TON blockchain üzerinde mint edildi, STON.fi\'de işlem görmeye başladı.' },
    { emoji: '💧', title: 'Likidite Havuzu', desc: 'STON.fi\'de TON/TASTE likidite havuzu oluşturuldu ve aktif.' },
    { emoji: '🔒', title: 'Token & LP Kilidi', desc: 'Toplam arzın %88.4\'ü JVault\'ta 3 ayrı kilidle kilitlendi. Ek olarak STON.fi pTON-TASTE LP tokenlerinin %81.6\'sı tinu-locker.ton ile kilitlendi. Her iki kilit blockchain\'de herkese açık doğrulanabilir.' },
    { emoji: '🛡️', title: 'Güvenlik Taraması', desc: 'Akıllı sözleşme güvenlik denetiminden geçirildi.' },
    { emoji: '📱', title: 'Telegram Mini App', desc: 'Telegram üzerinde çalışan tam özellikli mini uygulama yayına girdi.' },
    { emoji: '🎁', title: 'Airdrop & Ödül Dağıtımı', desc: '408 cüzdana TASTE airdrop gerçekleştirildi ve her gün büyüyor. Çarkıfelek ödül sistemi aktif.' },
    { emoji: '📄', title: 'Whitepaper & Litepaper', desc: 'Projeyi anlatan kapsamlı teknik doküman ve lite versiyon yayınlandı.' },
    { emoji: '🌐', title: 'Sosyal Ağ Varlığı', desc: 'Telegram kanalı (@taste2025) ve Topluluk Grubu, WhatsApp kanalı, Twitter/X (@taste_token), Instagram (@taste_ton_taste), TikTok (@taste_ton), Facebook ve resmi website (tastetoken.net) kuruldu. Tüm platformlarda aktif.' },
    { emoji: '🐾', title: 'Sokak Hayvanları Bağış Platformu', desc: 'TON ve TASTE ile hayvan barınaklarına bağış yapılabilen platform eklendi.' },
    { emoji: '🍽️', title: 'Günlük Yemek Paylaşım Platformu', desc: 'Kullanıcılar tarif, yemek ve mekan paylaşabiliyor. Gerçek zamanlı (Supabase ile).' },
    { emoji: '👛', title: '500 Cüzdana Ulaşma', desc: 'İlk çeyrek hedefi: 500 benzersiz cüzdan sahibi. Topluluk büyümeye devam ediyor.' },
    { emoji: '⚠️', title: 'Gıda Alerjeni Bildirim Sistemi', desc: 'AB & Türkiye gıda mevzuatındaki 14 zorunlu alerjen (Gluten, Süt, Yumurta, Balık vb.) Yemek Akışı\'na entegre edildi. Her paylaşıma alerjen etiketi eklenebiliyor, kalori bilgisi gösteriliyor.' },
    { emoji: '🚀', title: 'Mini App v2 Güncellemesi — Mart 2026', desc: 'PoweredBy bölümü SVG logolarla yenilendi (OKX, Bitget, Binance, Telegram, Google, Gemini). Whitepaper\'a TASTE özet kartı eklendi. Ödül dağıtımı bitiş sayacı (20 Mayıs 2026) eklendi. Yemek Akışı\'na beğeni, arama ve trend yemekler getirildi.' },
]


// ─── Devam eden & yakın plan (gerçekçi) ──────────────────────────────────
const ONGOING = [
    { emoji: '🌱', title: 'Topluluk Büyütme', desc: 'Her gün yeni kullanıcılar, her gün yeni paylaşımlar. Organik büyüme odaklı.' },
    { emoji: '🔗', title: 'Daha Fazla DEX Görünürlüğü', desc: 'STON.fi\'nin yanı sıra diğer TON ekosistem platformlarında varlık.' },
    { emoji: '📊', title: 'Şeffaf Raporlama', desc: 'Holder sayısı, işlem hacmi ve topluluk büyümesi düzenli paylaşılacak.' },
    { emoji: '🛠️', title: 'Mini App Geliştirme', desc: 'Kullanıcı geri bildirimlerine göre yeni özellikler ekleniyor.' },
]

// ─── Felsefe ──────────────────────────────────────────────────────────────
const PHILOSOPHY = [
    '🎯 TASTE yapamayacağı şeyin yol haritasını çizmez.',
    '✅ Yaptığının haritasını çıkarır — kanıtlanmış, gerçek.',
    '🤝 Veremeyeceği sözü vermez. İnsanlar bize bu yüzden güveniyor.',
    '📌 Her adım şeffaf, her taahhüt yerine getirilmiş.',
]

export function Roadmap() {
    return (
        <div>
            {/* Felsefe Banner */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{
                    background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.04))',
                    border: '1px solid rgba(245,158,11,0.25)',
                    borderRadius: '16px',
                    padding: '18px',
                    marginBottom: '24px',
                }}
            >
                <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', marginBottom: '12px' }}>
                    TASTE Felsefesi
                </div>
                {PHILOSOPHY.map((p, i) => (
                    <div key={i} style={{ fontSize: '13px', color: '#e2e8f0', lineHeight: 1.7, marginBottom: '4px' }}>{p}</div>
                ))}
            </motion.div>

            {/* Tamamlananlar */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ height: 1, flex: 1, background: 'rgba(34,197,94,0.2)' }} />
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#22c55e', textTransform: 'uppercase', letterSpacing: '2px', flexShrink: 0 }}>
                        ✅ Q1 2026 — Tamamlandı
                    </div>
                    <div style={{ height: 1, flex: 1, background: 'rgba(34,197,94,0.2)' }} />
                </div>

                <div style={{ position: 'relative', paddingLeft: '28px' }}>
                    {/* Timeline line */}
                    <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, #22c55e, #22c55e40)', borderRadius: 2 }} />

                    {COMPLETED.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -16 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            style={{ marginBottom: '16px', position: 'relative' }}
                        >
                            {/* Dot */}
                            <div style={{
                                position: 'absolute', left: -24, top: 4,
                                width: 12, height: 12, borderRadius: '50%',
                                background: '#22c55e',
                                boxShadow: '0 0 8px rgba(34,197,94,0.5)'
                            }} />
                            <div style={{ fontWeight: 700, fontSize: '13px', color: '#fff', marginBottom: '3px' }}>
                                {item.emoji} {item.title}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>
                                {item.desc}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Devam Eden */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ height: 1, flex: 1, background: 'rgba(245,158,11,0.2)' }} />
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '2px', flexShrink: 0 }}>
                        🔄 Devam Eden
                    </div>
                    <div style={{ height: 1, flex: 1, background: 'rgba(245,158,11,0.2)' }} />
                </div>

                <div style={{ position: 'relative', paddingLeft: '28px' }}>
                    <div style={{ position: 'absolute', left: 8, top: 0, bottom: 0, width: 2, background: 'linear-gradient(to bottom, #f59e0b, #f59e0b40)', borderRadius: 2 }} />

                    {ONGOING.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -16 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.07 }}
                            style={{ marginBottom: '16px', position: 'relative' }}
                        >
                            <div style={{
                                position: 'absolute', left: -24, top: 4,
                                width: 12, height: 12, borderRadius: '50%',
                                background: '#f59e0b',
                                boxShadow: '0 0 8px rgba(245,158,11,0.5)'
                            }} />
                            <div style={{ fontWeight: 700, fontSize: '13px', color: '#fff', marginBottom: '3px' }}>
                                {item.emoji} {item.title}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: 1.6 }}>
                                {item.desc}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Dipnot */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    fontSize: '12px',
                    color: '#64748b',
                    lineHeight: 1.7,
                    textAlign: 'center'
                }}
            >
                Bu yol haritası yaşayan bir belgedir — tamamlananlar eklenir, söz verilmeyenler eklenmez.<br />
                <strong style={{ color: '#f59e0b' }}>TASTE güveni inşa eder, hayal satmaz.</strong>
            </motion.div>
        </div>
    )
}
