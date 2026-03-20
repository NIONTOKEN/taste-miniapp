import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'

interface SocialLink {
    id: string;
    icon: string;
    label: string | React.ReactNode;
    sublabel?: string | React.ReactNode;
    link: string;
    isTelegram?: boolean;
}

export function SocialTasks() {
    const { i18n } = useTranslation()
    const isEn = i18n.language === 'en'

    // Telegram Community Hub links
    const telegramLinks: SocialLink[] = [
        {
            id: 'tg_channel',
            icon: '📢',
            label: isEn ? 'Announcement Channel' : 'Duyuru Kanalı',
            sublabel: '@taste2025',
            link: 'https://t.me/taste2025',
            isTelegram: true,
        },
        {
            id: 'tg_group',
            icon: '💬',
            label: isEn ? 'Community Chat' : 'Topluluk Sohbeti',
            sublabel: '@taste_miniapp',
            link: 'https://t.me/taste_miniapp/1',
            isTelegram: true,
        },
        {
            id: 'tg_miniapp',
            icon: '🤖',
            label: 'Taste Launch Bot',
            sublabel: '@taste_launch_bot',
            link: 'https://t.me/taste_launch_bot',
            isTelegram: true,
        },
        {
            id: 'telegram_share',
            icon: '📲',
            label: isEn ? 'Share with Friends' : 'Arkadaşlarına Paylaş',
            sublabel: isEn ? 'Grow the community!' : 'Topluluğu büyüt!',
            link: 'https://t.me/share/url?url=https://t.me/taste_launch_bot/app&text=Check%20out%20Taste%20MiniApp!%20🍔💎%20Join%20the%20TASTE%20community!',
            isTelegram: true,
        },
    ]

    // Other social media links
    const socialLinks: SocialLink[] = [
        {
            id: 'x_follow',
            icon: '🐦',
            label: 'Twitter / X',
            link: 'https://x.com/taste_token',
        },
        {
            id: 'whatsapp',
            icon: '🟢',
            label: 'WhatsApp Community',
            link: 'https://chat.whatsapp.com/G2Q6xjoYt94GzseLmFnUtO?mode=gi_t',
        },
        {
            id: 'post_x',
            icon: '🚀',
            label: 'Tweet About Us',
            link: 'https://x.com/intent/tweet?text=Taste%20Token%20is%20taking%20over%20the%20kitchen%20on%20TON!%20Join%20the%20movement%20%23TasteToken%20%23TON%20%40taste_token',
        },
        {
            id: 'facebook',
            icon: '📘',
            label: 'Facebook',
            link: 'https://www.facebook.com/share/1DGWE1ZQoR/',
        },
        {
            id: 'instagram',
            icon: '📸',
            label: 'Instagram',
            link: 'https://www.instagram.com/taste_ton_taste',
        },
        {
            id: 'tiktok',
            icon: '🎵',
            label: 'TikTok',
            link: 'https://www.tiktok.com/@taste_ton',
        },
        {
            id: 'website',
            icon: '🌐',
            label: 'Official Website',
            link: 'https://tastetoken.net',
        }
    ]

    const handleLinkClick = (link: string, isTelegram?: boolean) => {
        if (window.Telegram?.WebApp) {
            if (isTelegram) {
                window.Telegram.WebApp.openTelegramLink(link)
            } else {
                window.Telegram.WebApp.openLink(link)
            }
        } else {
            window.open(link, '_blank')
        }
    }

    const renderLinkItem = (item: SocialLink, idx: number, glowColor?: string) => (
        <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * idx }}
            whileHover={{ scale: 1.02, background: glowColor || 'rgba(255,255,255,0.08)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleLinkClick(item.link, item.isTelegram)}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: glowColor ? 'rgba(0, 136, 204, 0.06)' : 'rgba(255,255,255,0.03)',
                padding: '12px',
                borderRadius: '12px',
                cursor: 'pointer',
                border: glowColor ? '1px solid rgba(0, 136, 204, 0.15)' : '1px solid rgba(255,255,255,0.05)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>{item.icon}</span>
                <div>
                    <div style={{ fontWeight: '500', fontSize: '14px' }}>{item.label}</div>
                    {item.sublabel && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{item.sublabel}</div>
                    )}
                </div>
            </div>
            <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ fontSize: '18px', color: 'var(--text-muted)' }}
            >
                ➔
            </motion.div>
        </motion.div>
    )

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
            {/* Telegram Community Hub */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={{
                    padding: '20px',
                    background: 'linear-gradient(135deg, rgba(0, 136, 204, 0.08), rgba(0, 136, 204, 0.02))',
                    border: '1px solid rgba(0, 136, 204, 0.15)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <span style={{ fontSize: '24px' }}>✈️</span>
                    <div>
                        <h3 style={{ fontSize: '1rem', margin: 0 }}>{isEn ? 'Telegram Community' : 'Telegram Topluluğu'}</h3>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{isEn ? 'All our Telegram channels' : 'Tüm Telegram kanallarımız'}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {telegramLinks.map((item, idx) => renderLinkItem(item, idx, 'rgba(0, 136, 204, 0.12)'))}
                </div>
            </motion.div>

            {/* Social Media Links */}
            <div className="glass-panel" style={{ padding: '20px' }}>
                <h3 style={{ marginBottom: '15px' }}>{isEn ? '🌍 Social Media' : '🌍 Sosyal Medya'}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {socialLinks.map((item, idx) => renderLinkItem(item, idx))}
                </div>
            </div>
        </div>
    )
}
