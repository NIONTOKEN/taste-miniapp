import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ExternalLink, MessageSquare, Megaphone, Globe, Twitter, Phone, MessageCircle, Instagram, Video, Facebook, Mail, ArrowLeft } from 'lucide-react'

interface SocialLinkItem {
    id: string
    icon: React.ReactNode
    label: string
    sublabel: string
    link: string
    color: string
    badge?: string
}

interface OfficialSocialsProps {
    onClose?: () => void
}

export function OfficialSocials({ onClose }: OfficialSocialsProps) {
    const { i18n } = useTranslation()
    const isEn = i18n.language === 'en'

    // Group 1: Important Messages
    const importantMessages: SocialLinkItem[] = [
        {
            id: 'tg_msg_1',
            icon: <Megaphone size={22} />,
            label: isEn ? 'Official Announcement 1' : 'Resmi Duyuru 1',
            sublabel: isEn ? 'View crucial updates in TG' : 'Telegram\'daki önemli gelişmeyi oku',
            link: 'https://t.me/taste_miniapp/1/18039',
            color: '#0088cc',
            badge: '🔥 HOT'
        },
        {
            id: 'tg_msg_2',
            icon: <MessageSquare size={22} />,
            label: isEn ? 'Official Announcement 2' : 'Resmi Duyuru 2',
            sublabel: isEn ? 'View community pinned message' : 'Topluluk sabitlenmiş mesajını incele',
            link: 'https://t.me/taste_miniapp/1/3399',
            color: '#0088cc',
            badge: '📌 PIN'
        }
    ]

    // Group 2: Web & Bots
    const webAndBots: SocialLinkItem[] = [
        {
            id: 'website',
            icon: <Globe size={22} />,
            label: isEn ? 'Official Website' : 'Resmi Web Sitesi',
            sublabel: 'tastetoken.net',
            link: 'https://tastetoken.net',
            color: '#f59e0b'
        },
        {
            id: 'bot',
            icon: <MessageCircle size={22} />,
            label: isEn ? 'Mini App Launch Bot' : 'Mini App Başlangıç Botu',
            sublabel: '@taste_launch_bot',
            link: 'https://t.me/taste_launch_bot',
            color: '#10b981',
            badge: '🤖 BOT'
        }
    ]

    // Group 3: Communities
    const communities: SocialLinkItem[] = [
        {
            id: 'tg_channel',
            icon: <Megaphone size={22} />,
            label: isEn ? 'Telegram Community' : 'Telegram Duyuru Kanalı',
            sublabel: '@taste2025',
            link: 'https://t.me/taste2025',
            color: '#0088cc'
        },
        {
            id: 'tg_group',
            icon: <MessageSquare size={22} />,
            label: isEn ? 'Mini App Telegram Group' : 'Mini App Telegram Sohbet Grubu',
            sublabel: '@taste_miniapp',
            link: 'https://t.me/taste_miniapp/1',
            color: '#0088cc'
        },
        {
            id: 'whatsapp',
            icon: <Phone size={22} />,
            label: isEn ? 'WhatsApp Community' : 'WhatsApp Topluluğu',
            sublabel: 'chat.whatsapp.com',
            link: 'https://chat.whatsapp.com/G2Q6xjoYt94GzseLmFnUtO?mode=gi_t',
            color: '#25D366'
        }
    ]

    // Group 4: Socials
    const socials: SocialLinkItem[] = [
        {
            id: 'x_main',
            icon: <Twitter size={22} />,
            label: isEn ? 'Twitter / X (Main)' : 'Twitter / X (Ana Hesap)',
            sublabel: '@taste_token',
            link: 'https://x.com/taste_token',
            color: '#ffffff'
        },
        {
            id: 'x_official',
            icon: <Twitter size={22} />,
            label: isEn ? 'Twitter / X (Official)' : 'Twitter / X (Resmi Hesap)',
            sublabel: '@_Taste_2025',
            link: 'https://x.com/_Taste_2025',
            color: '#cbd5e1'
        },
        {
            id: 'instagram',
            icon: <Instagram size={22} />,
            label: 'Instagram',
            sublabel: '@taste_ton_taste',
            link: 'https://www.instagram.com/taste_ton_taste',
            color: '#e1306c'
        },
        {
            id: 'tiktok',
            icon: <Video size={22} />,
            label: 'TikTok',
            sublabel: '@taste_ton',
            link: 'https://www.tiktok.com/@taste_ton',
            color: '#00f2fe'
        },
        {
            id: 'facebook',
            icon: <Facebook size={22} />,
            label: 'Facebook',
            sublabel: 'TASTE Token',
            link: 'https://www.facebook.com/share/1DGWE1ZQoR/',
            color: '#1877f2'
        }
    ]

    // Group 5: Support
    const support: SocialLinkItem[] = [
        {
            id: 'email',
            icon: <Mail size={22} />,
            label: isEn ? 'Official Email' : 'Resmi E-Posta',
            sublabel: 'tastetoken.net@tastetoken.net',
            link: 'mailto:tastetoken.net@tastetoken.net',
            color: '#94a3b8'
        }
    ]

    const handleLinkClick = (link: string) => {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.openLink(link)
        } else {
            window.open(link, '_blank')
        }
    }

    const renderLinkGroup = (title: string, items: SocialLinkItem[]) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', letterSpacing: '1.5px', textTransform: 'uppercase', paddingLeft: '4px' }}>
                {title}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {items.map((item, idx) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.06)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleLinkClick(item.link)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            padding: '14px 16px',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: `linear-gradient(135deg, ${item.color}20, ${item.color}05)`,
                                border: `1px solid ${item.color}30`,
                                color: item.color || '#fff'
                            }}>
                                {item.icon}
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{item.label}</span>
                                    {item.badge && (
                                        <span style={{
                                            fontSize: '8px',
                                            fontWeight: 900,
                                            background: item.color,
                                            color: '#000',
                                            padding: '2px 6px',
                                            borderRadius: '8px',
                                            letterSpacing: '0.5px'
                                        }}>{item.badge}</span>
                                    )}
                                </div>
                                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{item.sublabel}</div>
                            </div>
                        </div>
                        <ExternalLink size={16} color="#475569" />
                    </motion.div>
                ))}
            </div>
        </div>
    )

    return (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                {onClose && (
                    <button
                        onClick={onClose}
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '12px',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            cursor: 'pointer'
                        }}
                    >
                        <ArrowLeft size={18} />
                    </button>
                )}
                <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900 }}>📱 {isEn ? 'Official Social Links' : 'Resmi Sosyal Ağlar'}</h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>
                        {isEn ? 'All TASTE token official channels and links in one place' : 'Tüm TASTE token resmi kanalları ve bağlantıları bir arada'}
                    </p>
                </div>
            </div>

            {/* Link Groups */}
            {renderLinkGroup(isEn ? '📢 Crucial Updates & Pins' : '📢 Önemli Duyurular & PİNler', importantMessages)}
            {renderLinkGroup(isEn ? '🌐 Web & Bot Platforms' : '🌐 Web ve Bot Platformları', webAndBots)}
            {renderLinkGroup(isEn ? '💬 Telegram & WhatsApp Community' : '💬 Telegram & WhatsApp Toplulukları', communities)}
            {renderLinkGroup(isEn ? '🐦 Social Media Channels' : '🐦 Sosyal Medya Kanalları', socials)}
            {renderLinkGroup(isEn ? '📩 Official Support' : '📩 Resmi Destek', support)}
        </div>
    )
}
