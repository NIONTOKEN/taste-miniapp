import { motion } from 'framer-motion'

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
}

interface SectionProps {
    children: React.ReactNode
    delay?: number
}

function Section({ children, delay = 0 }: SectionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            className="glass-panel"
            style={{
                padding: '20px',
                marginBottom: '16px',
                lineHeight: '1.8',
                fontSize: '14px',
                color: 'var(--text-muted)'
            }}
        >
            {children}
        </motion.div>
    )
}

function Highlight({ children }: { children: React.ReactNode }) {
    return (
        <span style={{
            color: 'var(--primary)',
            fontWeight: '700'
        }}>
            {children}
        </span>
    )
}

function Quote({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            borderLeft: '3px solid var(--primary)',
            paddingLeft: '15px',
            margin: '15px 0',
            fontStyle: 'italic',
            color: '#fff',
            fontSize: '15px',
            lineHeight: '1.9'
        }}>
            {children}
        </div>
    )
}

export function Manifesto() {
    return (
        <div style={{ paddingBottom: '20px' }}>
            {/* Title */}
            <motion.div
                {...fadeIn}
                style={{ textAlign: 'center', marginBottom: '30px' }}
            >
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔥</div>
                <h2 className="text-gradient" style={{
                    fontSize: '1.6rem',
                    fontWeight: '900',
                    marginBottom: '8px',
                    letterSpacing: '1px'
                }}>
                    TASTE MANİFESTOSU
                </h2>
                <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '12px',
                    fontStyle: 'italic'
                }}>
                    Ateşin Hikâyesi • Ustalığın Yolu
                </p>
            </motion.div>

            {/* Bölüm 1: Ateşin Başlangıcı */}
            <Section>
                <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '16px' }}>
                    🌅 Ateşin Başlangıcı
                </h3>
                <p>
                    Dijital dünyanın ilk ateşi yakıldığında…<br />
                    kimse bunun bir mutfak olacağını bilmiyordu.
                </p>
                <Quote>
                    Her şey bir kıvılcımla başladı.<br />
                    Görünmeyen bir el… görünmeyen bir tarif…<br />
                    Ve insanlığın ilk kez merkezi olmayan bir ateşi kontrol etmeyi öğrenmesi…
                </Quote>
                <p>
                    Bu ateşi yakan kişi bir isim değildi… bir kimlik değildi…<br />
                    Bir fikir… bir devrim… bir <Highlight>uyanıştı</Highlight>.
                </p>
                <p style={{ marginTop: '10px' }}>
                    O sadece ateşi yaktı.<br />
                    Ocağı kurdu.<br />
                    Tarifi bıraktı.<br />
                    Ve sonra… mutfaktan çıktı.
                </p>
            </Section>

            {/* Bölüm 2: Eksik Olan */}
            <Section delay={0.1}>
                <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '16px' }}>
                    ⚠️ Ateş Yeterli Değildi
                </h3>
                <p>
                    Ama ateş tek başına yeterli değildi.<br />
                    Ateş yanabilir…<br />
                    Ama <Highlight>yemek pişirmek ustalık ister</Highlight>.
                </p>
                <p style={{ marginTop: '12px' }}>
                    Zamanla dijital dünya doldu.<br />
                    Binlerce mutfak açıldı.<br />
                    Parlayan tabelalar… gürültülü salonlar… hızlı tarifler…
                </p>
                <Quote>
                    Ama çoğunda şu yoktu:<br />
                    Emek yoktu. Sabır yoktu. Ruh yoktu.<br />
                    Ateş vardı… ama lezzet yoktu.
                </Quote>
            </Section>

            {/* Bölüm 3: TASTE'in Doğuşu */}
            <Section delay={0.15}>
                <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '16px' }}>
                    🍳 TASTE'in Doğuşu
                </h3>
                <p>
                    İşte tam o noktada… başka bir ihtiyaç doğdu.
                </p>
                <p style={{ marginTop: '10px' }}>
                    Birileri ateşi sadece kullanmak istemedi.<br />
                    Onu <Highlight>anlamak</Highlight> istedi.<br />
                    Onu <Highlight>işlemek</Highlight> istedi.<br />
                    Onu <Highlight>ustalığa dönüştürmek</Highlight> istedi.
                </p>
                <Quote>
                    Ve bir mutfak kuruldu.<br />
                    Sessiz. Gösterişsiz. Ama bilinçli.<br />
                    Adı: <strong>TASTE</strong>
                </Quote>
            </Section>

            {/* Bölüm 4: Mutfağa Giriş */}
            <Section delay={0.2}>
                <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '16px' }}>
                    🚪 Mutfağa Giriyoruz
                </h3>
                <div style={{
                    background: 'rgba(245, 159, 11, 0.08)',
                    border: '1px solid rgba(245, 159, 11, 0.15)',
                    borderRadius: '12px',
                    padding: '15px',
                    marginBottom: '12px'
                }}>
                    <p style={{ color: '#fff', fontWeight: '500' }}>
                        Ocağın altını yak.<br />
                        Duyuyor musun?<br />
                        Bu sadece bir alev sesi değil.<br />
                        Bu <Highlight>dönüşümün sesi</Highlight>.
                    </p>
                </div>
                <p>
                    Metal dijitale dönüştüğünde değer doğmuştu…<br />
                    Ama anlam doğmamıştı.<br />
                    <Highlight>TASTE anlamı pişirmek için kuruldu.</Highlight>
                </p>
                <p style={{ marginTop: '12px' }}>
                    Kapıdan adım attığında şunu hissedersin:
                </p>
                <Quote>
                    Burada hiçbir şey hızlı yapılmaz.<br />
                    Burada hiçbir şey boşuna yapılmaz.<br />
                    Burada hiçbir şey sadece var olmak için var değildir.
                </Quote>
                <p>
                    Her malzemenin nedeni vardır.<br />
                    Her tarifin geçmişi vardır.<br />
                    Her ustanın yanık izleri vardır.
                </p>
            </Section>

            {/* Bölüm 5: Olgunlaşma */}
            <Section delay={0.25}>
                <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '16px' }}>
                    ⏳ Gerçek Değer Olgunlaşır
                </h3>
                <Quote>
                    Çünkü gerçek değer üretilmez…<br />
                    Olgunlaşır.<br />
                    Ateşin üstünde bekler.<br />
                    Zamanla şekil alır.<br />
                    Sabırla derinleşir.
                </Quote>
            </Section>

            {/* Bölüm 6: Misyon */}
            <Section delay={0.3}>
                <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '16px' }}>
                    🎯 Peki Biz Ne İçin Varız?
                </h3>
                <p>
                    Sadece işlem yapmak için değil.<br />
                    Sadece almak ve satmak için değil.<br />
                    Sadece görünmek için hiç değil.
                </p>
                <div style={{
                    background: 'rgba(245, 159, 11, 0.08)',
                    border: '1px solid rgba(245, 159, 11, 0.15)',
                    borderRadius: '12px',
                    padding: '15px',
                    margin: '15px 0'
                }}>
                    <p style={{ color: '#fff', fontWeight: '600', lineHeight: '2' }}>
                        🔹 Biz <Highlight>değer üretmek</Highlight> için varız.<br />
                        🔹 Biz <Highlight>bilgiyi paylaşmak</Highlight> için varız.<br />
                        🔹 Biz <Highlight>ustalık yetiştirmek</Highlight> için varız.<br />
                        🔹 Biz dijital dünyaya <Highlight>anlam kazandırmak</Highlight> için varız.
                    </p>
                </div>
                <Quote>
                    Biz hızın değil… derinliğin tarafındayız.<br />
                    Gürültünün değil… ustalığın tarafındayız.<br />
                    Tüketmenin değil… üretmenin tarafındayız.
                </Quote>
            </Section>

            {/* Bölüm 7: Fark */}
            <Section delay={0.35}>
                <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '16px' }}>
                    💎 TASTE Bir Trend Değil
                </h3>
                <p>
                    Bugün dijital dünyada sayısız varlık dolaşıyor.<br />
                    Bazıları sadece görülmek için var.<br />
                    Bazıları sadece satılmak için var.<br />
                    Bazıları sadece unutulmak için doğuyor.
                </p>
                <Quote>
                    Ama bazı şeyler… ihtiyaçtan doğar.
                </Quote>
                <p>
                    <Highlight>TASTE</Highlight> bir trend değil.<br />
                    Bir kopya değil.<br />
                    Bir gürültü değil.
                </p>
                <p style={{ marginTop: '10px' }}>
                    Bu mutfak bir boşluğu doldurmak için kuruldu.<br />
                    İnsanların sadece işlem yapmadığı…<br />
                    <Highlight>Ürettiği… öğrendiği… dönüşüp geliştiği…</Highlight><br />
                    bir sistem olmak için.
                </p>
            </Section>

            {/* Bölüm 8: Yol */}
            <Section delay={0.4}>
                <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '16px' }}>
                    🛤️ Yolumuz
                </h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    margin: '15px 0'
                }}>
                    {[
                        { icon: '📚', text: 'Çırak yetiştirmek' },
                        { icon: '👨‍🍳', text: 'Usta yetiştirmek' },
                        { icon: '🧠', text: 'Bilinci büyütmek' },
                        { icon: '💰', text: 'Değeri derinleştirmek' },
                        { icon: '🔥', text: 'Ateşi büyütmek' },
                        { icon: '🍽️', text: 'Lezzeti artırmak' }
                    ].map((item, i) => (
                        <div key={i} style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '10px',
                            padding: '12px',
                            textAlign: 'center',
                            fontSize: '12px'
                        }}>
                            <div style={{ fontSize: '22px', marginBottom: '6px' }}>{item.icon}</div>
                            <span style={{ color: '#fff', fontWeight: '500' }}>{item.text}</span>
                        </div>
                    ))}
                </div>
                <Quote>
                    Peki bu yol nereye gidiyor?<br />
                    Sonu olan bir yere değil. Büyüyen bir yere.<br />
                    Bu bir varış noktası değil… bir <strong>ustalık yolu</strong>.
                </Quote>
                <p style={{ textAlign: 'center', color: '#fff', fontWeight: '500', marginTop: '10px' }}>
                    Gerçek ustalar bilir:<br />
                    <Highlight>En iyi tarif henüz yazılmamış olandır.</Highlight>
                </p>
            </Section>

            {/* Bölüm 9: Final */}
            <Section delay={0.45}>
                <div style={{
                    textAlign: 'center',
                    padding: '10px 0'
                }}>
                    <div style={{ fontSize: '40px', marginBottom: '15px' }}>🔥</div>
                    <h3 style={{
                        color: '#fff',
                        fontSize: '18px',
                        fontWeight: '800',
                        marginBottom: '15px'
                    }}>
                        Ve Şimdi…
                    </h3>
                    <p style={{ lineHeight: '2', fontSize: '15px' }}>
                        Ocak yanıyor.<br />
                        Tencereler hazır.<br />
                        Tarif yazılmayı bekliyor.<br />
                        Zaman akıyor.
                    </p>
                    <div style={{
                        background: 'rgba(245, 159, 11, 0.1)',
                        border: '1px solid rgba(245, 159, 11, 0.2)',
                        borderRadius: '15px',
                        padding: '20px',
                        margin: '20px 0'
                    }}>
                        <p style={{ color: '#fff', fontWeight: '500', lineHeight: '1.8' }}>
                            Bu bir hikâye değil.<br />
                            Bu bir metafor değil.<br />
                            Bu bir hayal hiç değil.<br />
                            Bu… <Highlight>kaçınılmaz bir evrim</Highlight>.
                        </p>
                    </div>
                    <p style={{ lineHeight: '2', fontSize: '15px' }}>
                        Ateş yakıldı.<br />
                        Sistem kuruldu.<br />
                        Ama lezzet hâlâ pişiyor.
                    </p>
                    <div style={{
                        marginTop: '25px',
                        padding: '20px',
                        background: 'var(--gradient-gold)',
                        borderRadius: '15px',
                        color: '#000'
                    }}>
                        <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                            Soru şu değil: "TASTE var mı?"
                        </p>
                        <p style={{ fontSize: '17px', fontWeight: '900' }}>
                            Bu mutfakta yerini almaya hazır mısın? 🍽️
                        </p>
                    </div>
                </div>
            </Section>
        </div>
    )
}
