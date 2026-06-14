import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowLeft, MessageCircle, ExternalLink, ShieldCheck } from 'lucide-react'

interface TeamMember {
    id: string
    name: string
    roleTr: string
    roleEn: string
    bioTr: string
    bioEn: string
    tgHandle: string
    tgLink: string
    photoUrl: string
    color: string
}

interface TeamProps {
    onClose?: () => void
}

export function Team({ onClose }: TeamProps) {
    const { i18n } = useTranslation()
    const isEn = i18n.language === 'en'

    const members: TeamMember[] = [
        {
            id: 'little_queen',
            name: 'Little Queen',
            roleTr: 'Topluluk Yöneticisi',
            roleEn: 'Community Manager',
            bioTr: 'Topluluk büyümesi, sosyal medya etkileşimleri ve TASTE destekçilerinin bir araya getirilmesinden sorumludur.',
            bioEn: 'Responsible for community growth, social media engagement, and uniting TASTE supporters.',
            tgHandle: '@Little_quin11',
            tgLink: 'https://t.me/Little_quin11',
            photoUrl: '/little_queen.png',
            color: '#c084fc' // Light purple to match her avatar theme
        },
        {
            id: 'legend_love',
            name: 'Legend Love',
            roleTr: 'Topluluk ve Medya Yöneticisi',
            roleEn: 'Community & Media Manager',
            bioTr: 'Moderatör, sosyal medya uzmanı ve reklamcı. Ayrıca yarışma düzenleyici ve topluluk oluşturucu.',
            bioEn: 'Moderator, social media expert, and advertiser. Also a contest organizer and community builder.',
            tgHandle: '@legendlove90',
            tgLink: 'https://t.me/legendlove90',
            photoUrl: '/photo_2026-06-14_05-49-44.jpg',
            color: '#6366f1' // Indigo color to match the avatar theme
        }
    ]

    const handleTelegramClick = (link: string) => {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.openLink(link)
        } else {
            window.open(link, '_blank')
        }
    }

    return (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
            {/* Ambient Background Glow */}
            <div style={{
                position: 'absolute',
                top: '-30px',
                right: '-30px',
                width: '150px',
                height: '150px',
                background: 'radial-gradient(circle, rgba(192, 132, 252, 0.15) 0%, rgba(0,0,0,0) 70%)',
                borderRadius: '50%',
                filter: 'blur(15px)',
                pointerEvents: 'none'
            }} />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
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
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                    >
                        <ArrowLeft size={18} />
                    </button>
                )}
                <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900 }}>👥 {isEn ? 'Project Team Members' : 'Proje Ekip Üyeleri'}</h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>
                        {isEn ? 'The visionary minds building the TASTE ecosystem' : 'TASTE ekosistemini inşa eden vizyoner ekip'}
                    </p>
                </div>
            </div>

            {/* Members List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {members.map((member, idx) => (
                    <motion.div
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        style={{
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '20px',
                            padding: '16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '14px',
                            position: 'relative'
                        }}
                    >
                        {/* Member Core Info */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            {/* Avatar Frame */}
                            <div style={{
                                width: '70px',
                                height: '70px',
                                borderRadius: '50%',
                                padding: '3px',
                                background: `linear-gradient(135deg, ${member.color}, rgba(255,255,255,0.1))`,
                                boxShadow: `0 0 15px ${member.color}40`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <img
                                    src={member.photoUrl}
                                    alt={member.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        background: '#1e293b'
                                    }}
                                />
                            </div>

                            {/* Name and Role */}
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>{member.name}</span>
                                    <ShieldCheck size={16} color={member.color} style={{ flexShrink: 0 }} />
                                </div>
                                <div style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    color: member.color,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.8px',
                                    marginTop: '4px'
                                }}>
                                    {isEn ? member.roleEn : member.roleTr}
                                </div>
                            </div>
                        </div>

                        {/* Bio / Description */}
                        <p style={{
                            margin: 0,
                            fontSize: '13px',
                            color: '#94a3b8',
                            lineHeight: '1.6',
                            background: 'rgba(0,0,0,0.2)',
                            padding: '10px 14px',
                            borderRadius: '12px',
                            borderLeft: `2px solid ${member.color}`
                        }}>
                            {isEn ? member.bioEn : member.bioTr}
                        </p>

                        {/* Telegram Button */}
                        <motion.button
                            whileHover={{ scale: 1.02, background: `linear-gradient(135deg, ${member.color}25, ${member.color}10)` }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleTelegramClick(member.tgLink)}
                            style={{
                                width: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                padding: '12px 16px',
                                borderRadius: '14px',
                                cursor: 'pointer',
                                color: '#fff',
                                transition: 'all 0.2s'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <MessageCircle size={18} color="#3b82f6" />
                                <span style={{ fontSize: '13px', fontWeight: 700 }}>{member.tgHandle}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748b', fontWeight: 600 }}>
                                {isEn ? 'Contact' : 'İletişim'} <ExternalLink size={12} />
                            </div>
                        </motion.button>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
