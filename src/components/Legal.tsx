import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Section = 'disclaimer' | 'terms' | 'privacy' | 'risk'

const sections: { id: Section; emoji: string; label: string; sublabel: string }[] = [
    { id: 'disclaimer', emoji: '⚠️', label: 'Sorumluluk Reddi', sublabel: 'Disclaimer' },
    { id: 'terms', emoji: '📋', label: 'Kullanım Koşulları', sublabel: 'Terms of Use' },
    { id: 'privacy', emoji: '🔒', label: 'Gizlilik Politikası', sublabel: 'Privacy Policy' },
    { id: 'risk', emoji: '📊', label: 'Risk Açıklaması', sublabel: 'Risk Disclosure' },
]

export function Legal() {
    const [active, setActive] = useState<Section>('disclaimer')

    return (
        <motion.div
            key="legal"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
        >
            {/* Header */}
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ fontSize: '34px', marginBottom: '8px' }}>⚖️</div>
                <div style={{ fontSize: '11px', letterSpacing: '2px', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                    Yasal Belgeler
                </div>
                <h2 style={{ fontWeight: 900, fontSize: '1.2rem', margin: '0 0 8px' }}>Hukuki Bilgilendirme</h2>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                    Legal Information & Risk Disclosure
                </p>
                <div style={{
                    marginTop: '12px',
                    padding: '10px 14px',
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: '10px',
                    fontSize: '11px',
                    color: '#fca5a5',
                    lineHeight: 1.6
                }}>
                    ⚠️ Bu uygulama <strong>yatırım tavsiyesi içermez.</strong> Kripto varlıklar yüksek risk taşır.
                </div>
            </div>

            {/* Tab Selector */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                marginBottom: '16px'
            }}>
                {sections.map(s => (
                    <motion.button
                        key={s.id}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setActive(s.id)}
                        style={{
                            background: active === s.id
                                ? 'rgba(129,140,248,0.15)'
                                : 'rgba(255,255,255,0.03)',
                            border: active === s.id
                                ? '1px solid rgba(129,140,248,0.4)'
                                : '1px solid rgba(255,255,255,0.07)',
                            borderRadius: '12px',
                            padding: '12px 8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            textAlign: 'center'
                        }}
                    >
                        <div style={{ fontSize: '20px', marginBottom: '4px' }}>{s.emoji}</div>
                        <div style={{ fontSize: '11px', fontWeight: 700, color: active === s.id ? '#818cf8' : 'rgba(255,255,255,0.7)' }}>
                            {s.label}
                        </div>
                        <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
                            {s.sublabel}
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {active === 'disclaimer' && <DisclaimerContent />}
                    {active === 'terms' && <TermsContent />}
                    {active === 'privacy' && <PrivacyContent />}
                    {active === 'risk' && <RiskContent />}
                </motion.div>
            </AnimatePresence>

            {/* Last Updated */}
            <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '10px' }}>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>
                    Son güncelleme: Mart 2025 · TASTE Token © 2025
                </p>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.15)' }}>
                    Last updated: March 2025 · Built on The Open Network
                </p>
            </div>
        </motion.div>
    )
}

/* ─── Sections ─────────────────────────────────────────── */

function LegalSection({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
    return (
        <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '14px',
            padding: '16px',
            marginBottom: '12px'
        }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#818cf8', marginBottom: subtitle ? '3px' : '10px' }}>
                {title}
            </h3>
            {subtitle && (
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginBottom: '10px' }}>{subtitle}</p>
            )}
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75 }}>
                {children}
            </div>
        </div>
    )
}

function HighlightBox({ color, children }: { color: string; children: React.ReactNode }) {
    return (
        <div style={{
            background: `${color}10`,
            border: `1px solid ${color}25`,
            borderRadius: '10px',
            padding: '12px 14px',
            marginTop: '10px',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.7
        }}>
            {children}
        </div>
    )
}

function DisclaimerContent() {
    return (
        <div>
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '12px', borderColor: 'rgba(239,68,68,0.2)' }}>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75 }}>
                    Son güncelleme: Mart 2025 | Bu belge Türkçe ve İngilizce olarak hazırlanmıştır.
                </p>
            </div>

            <LegalSection title="🚫 Yatırım Tavsiyesi Değildir" subtitle="Not Investment Advice">
                Bu uygulama içindeki hiçbir içerik, fiyat bilgisi, grafik, analiz, tahmin veya herhangi bir ifade;<br /><br />
                • Yatırım tavsiyesi,<br />
                • Finansal öneri,<br />
                • Alım-satım teklifi veya<br />
                • Herhangi bir menkul kıymet ya da kripto varlık için alım-satım teklifi<br /><br />
                olarak yorumlanamaz, değerlendirilemez veya bu şekilde kullanılamaz.
                <HighlightBox color="#ef4444">
                    <strong style={{ color: '#fca5a5' }}>EN:</strong> Nothing in this application constitutes investment advice, financial guidance, or an offer to buy/sell any asset. All content is for informational purposes only.
                </HighlightBox>
            </LegalSection>

            <LegalSection title="⚖️ Sorumluluk Sınırlaması" subtitle="Limitation of Liability">
                TASTE Token ekibi, geliştiricileri ve katkıda bulunanlar; bu uygulamaya veya içerdiği bilgilere dayanarak alınan herhangi bir karar sonucunda ortaya çıkabilecek:<br /><br />
                • Doğrudan veya dolaylı mali kayıplar,<br />
                • Fırsat maliyetleri,<br />
                • Piyasa dalgalanmalarından kaynaklanan zararlar,<br />
                • Teknik arızalar nedeniyle oluşan kayıplar<br /><br />
                için hiçbir hukuki sorumluluk kabul etmez.
                <HighlightBox color="#f59e0b">
                    <strong style={{ color: '#fcd34d' }}>EN:</strong> The TASTE Token team accepts no liability for financial losses, opportunity costs, or damages arising from the use of this application.
                </HighlightBox>
            </LegalSection>

            <LegalSection title="🌍 Yasal Uyumluluk" subtitle="Regulatory Compliance">
                Kripto para satın alma, satma veya takas etme işlemleri, bulunduğunuz ülkede kısıtlı, kontrollü veya tamamen yasak olabilir. Bu uygulamayı kullanan kişi, yerel hukuka uygun hareket etme sorumluluğunu tamamen üstlenmiş sayılır.
                <HighlightBox color="#22c55e">
                    <strong style={{ color: '#86efac' }}>EN:</strong> Users are solely responsible for complying with their local laws and regulations regarding cryptocurrency transactions.
                </HighlightBox>
            </LegalSection>
        </div>
    )
}

function TermsContent() {
    return (
        <div>
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '12px' }}>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75 }}>
                    Bu uygulamayı kullanmaya devam etmekle aşağıdaki koşulları kabul etmiş sayılırsınız.
                    <br /><span style={{ color: 'rgba(255,255,255,0.3)' }}>By using this application, you agree to the following terms.</span>
                </p>
            </div>

            <LegalSection title="📌 Genel Kullanım Koşulları" subtitle="General Terms">
                • Bu uygulama TASTE Token projesini tanıtmak ve bilgi vermek amacıyla sunulmuştur.<br />
                • Uygulama yalnızca bilgilendirme amaçlıdır; herhangi bir finansal hizmet sunmamaktadır.<br />
                • Kullanıcılar, gerçekleştirdikleri tüm işlemlerden (token alımı dahil) bizzat sorumludur.<br />
                • 18 yaşından küçük bireyler bu uygulamayı kullanmamalıdır.
            </LegalSection>

            <LegalSection title="🔄 Token Alım-Satım Koşulları" subtitle="Token Transaction Terms">
                • STON.fi gibi üçüncü taraf platformlar üzerinden gerçekleştirilen tüm token işlemleri tamamen kullanıcının iradesiyle yapılmaktadır.<br />
                • TASTE Token ekibi, blockchain işlemlerini geri alamaz veya iptal edemez.<br />
                • İşlem ücretleri (gas fee) tamamen kullanıcıya aittir.<br />
                • Fiyatlar piyasa koşullarına göre anlık değişebilir.
            </LegalSection>

            <LegalSection title="🚫 Yasaklı Kullanımlar" subtitle="Prohibited Uses">
                Aşağıdaki amaçlarla kullanım kesinlikle yasaktır:<br /><br />
                • Para aklama veya yasadışı finansal işlemler,<br />
                • Sistemi manipüle etmeye yönelik her türlü girişim,<br />
                • Sahte bilgi yayma veya dolandırıcılık,<br />
                • Başkalarını yanıltma amacıyla bu uygulamanın içeriklerinin kötüye kullanımı.
            </LegalSection>

            <LegalSection title="⚙️ Değişiklik Hakkı" subtitle="Right to Modify">
                TASTE Token ekibi, bu kullanım koşullarını önceden haber vermeksizin güncelleme hakkını saklı tutar. Uygulamayı kullanmaya devam etmek, güncellenmiş koşulların kabul edildiği anlamına gelir.
            </LegalSection>
        </div>
    )
}

function PrivacyContent() {
    return (
        <div>
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '12px', borderColor: 'rgba(34,197,94,0.2)' }}>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75 }}>
                    Gizliliğiniz bizim için önemlidir. Bu politika, hangi verilerin toplandığını ve nasıl kullanıldığını açıklar.
                </p>
            </div>

            <LegalSection title="📊 Toplanan Veriler" subtitle="Data We Collect">
                Bu uygulama, Telegram Mini App altyapısı üzerinde çalışmaktadır ve aşağıdaki verilere erişebilir:<br /><br />
                • <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Telegram Kullanıcı Bilgileri:</strong> Telegram'ın sağladığı kullanıcı kimliği ve dil tercihi (Telegram Mini App standartları kapsamında).<br />
                • <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Cüzdan Adresi:</strong> TON cüzdanınızı bağladığınızda — yalnızca işlem ve gösterim amacıyla.<br />
                • <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Yerel Tercihler:</strong> Dil seçiminiz ve sorumluluk reddi onayı — yalnızca cihazınızda (localStorage).
                <HighlightBox color="#22c55e">
                    <strong style={{ color: '#86efac' }}>Gizlilik Taahhüdü:</strong> Kişisel verileriniz üçüncü taraflarla satılmaz, paylaşılmaz veya ticari amaçlarla kullanılmaz.
                </HighlightBox>
            </LegalSection>

            <LegalSection title="🔗 Üçüncü Taraf Servisler" subtitle="Third-Party Services">
                Uygulama aşağıdaki harici servislerle etkileşime girebilir:<br /><br />
                • <strong style={{ color: 'rgba(255,255,255,0.8)' }}>TON Blockchain:</strong> Açık ve halka açık bir blockchain ağı.<br />
                • <strong style={{ color: 'rgba(255,255,255,0.8)' }}>STON.fi:</strong> Bağımsız bir DEX platformu; kendi gizlilik politikası geçerlidir.<br />
                • <strong style={{ color: 'rgba(255,255,255,0.8)' }}>GeckoTerminal API:</strong> Canlı fiyat verisi için kullanılır; anonim erişim.
            </LegalSection>

            <LegalSection title="🗑️ Veri Silme" subtitle="Data Deletion">
                Tarayıcı / uygulama önbelleğini temizlediğinizde yerel olarak saklanan tercihleriniz silinir. Blockchain üzerindeki işlem kayıtları ise doğası gereği kalıcıdır ve silinemez.
            </LegalSection>

            <LegalSection title="📩 İletişim" subtitle="Contact">
                Gizlilik ile ilgili sorularınız için Telegram kanalımız üzerinden bize ulaşabilirsiniz.
                <HighlightBox color="#818cf8">
                    <strong style={{ color: '#c4b5fd' }}>Telegram:</strong> @TasteTokenOfficial
                </HighlightBox>
            </LegalSection>
        </div>
    )
}

function RiskContent() {
    return (
        <div>
            <div className="glass-panel" style={{
                padding: '20px', marginBottom: '12px',
                borderColor: 'rgba(239,68,68,0.25)',
                background: 'rgba(239,68,68,0.04)'
            }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#fca5a5', marginBottom: '6px' }}>
                    ⛔ Yüksek Risk Uyarısı
                </p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.75 }}>
                    Kripto para varlıkları son derece değişken ve spekülatif araçlardır. Yatırımınızın <strong style={{ color: '#fca5a5' }}>tamamını kaybedebilirsiniz.</strong>
                </p>
            </div>

            <LegalSection title="📉 Piyasa Riski" subtitle="Market Risk">
                TASTE Token'ın değeri herhangi bir garanti olmaksızın çok kısa süre içinde önemli ölçüde düşebilir veya sıfıra yaklaşabilir. Geçmiş fiyat performansı gelecekteki getirileri garanti etmez.
            </LegalSection>

            <LegalSection title="💧 Likidite Riski" subtitle="Liquidity Risk">
                Piyasa koşullarına bağlı olarak TASTE Token'ı istediğiniz fiyattan veya istediğiniz miktarda satmak mümkün olmayabilir. Likidite havuzu sınırlı olup ani çıkış işlemleri fiyatı olumsuz etkileyebilir.
            </LegalSection>

            <LegalSection title="🔧 Teknoloji Riski" subtitle="Technology Risk">
                • <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Akıllı Sözleşme Riski:</strong> Denetlenmiş olmasına karşın, akıllı sözleşmelerde keşfedilmemiş açıklar bulunabilir.<br />
                • <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Blockchain Riski:</strong> TON Blockchain'de meydana gelebilecek teknik aksaklıklar işlemleri geciktirebilir veya durdurabilir.<br />
                • <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Cüzdan Güvenliği:</strong> Cüzdan anahtarlarınızın güvenliği tamamen sizin sorumluluğunuzdadır.
            </LegalSection>

            <LegalSection title="⚖️ Düzenleyici Risk" subtitle="Regulatory Risk">
                Kripto para yasaları farklı ülkelerde hızla değişmektedir. Mevcut yatırımınız ilerleyen dönemlerde bulunduğunuz ülkede yasal kısıtlamalarla karşılaşabilir. Bu riski kullanıcı üstlenir.
            </LegalSection>

            <LegalSection title="💡 Önerilen Yaklaşım" subtitle="Recommended Approach">
                • Yalnızca kaybetmeyi göze aldığınız miktarı yatırın.<br />
                • Portföyünüzü çeşitlendirin; hiçbir varlığa aşırı yoğunlaşmayın.<br />
                • Kendi araştırmanızı yapın (DYOR — Do Your Own Research).<br />
                • Gerekirse bağımsız bir finansal danışmana başvurun.
                <HighlightBox color="#f59e0b">
                    <strong style={{ color: '#fcd34d' }}>DYOR:</strong> Do Your Own Research. This is not financial advice.
                </HighlightBox>
            </LegalSection>
        </div>
    )
}
