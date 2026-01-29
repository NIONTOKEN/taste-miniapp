import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useUser } from '../context/UserContext'

interface Task {
    id: string;
    icon: string;
    reward?: number;
    link: string;
}

export function SocialTasks() {
    const { t } = useTranslation()
    const { addBalance, tasksCompleted, setTasksCompleted } = useUser()

    const tasks: Task[] = [
        {
            id: 'tg_join',
            icon: '📢',
            link: 'https://t.me/taste_ton_taste',
            reward: 0.1
        },
        {
            id: 'x_follow',
            icon: '🐦',
            link: 'https://x.com/_Taste_2025',
            reward: 0.1
        },
        {
            id: 'facebook',
            icon: '👥',
            link: 'https://www.facebook.com/share/1BC81LDmjg/',
            reward: 0.1
        },
        {
            id: 'instagram',
            icon: '📸',
            link: 'https://www.instagram.com/taste_ton_taste?utm_source=qr&igsh=Y2c0eWk5emRxMXU0',
            reward: 0.1
        },
        {
            id: 'tiktok',
            icon: '🎵',
            link: 'https://www.tiktok.com/@taste_ton?_r=1&_t=ZS-92m0N4HLmAp',
            reward: 0.1
        },
        {
            id: 'whatsapp',
            icon: '💬',
            link: 'https://whatsapp.com/channel/0029Vb7ACtI1CYoNo8B1e21N',
            reward: 0.1
        }
    ]

    const handleTaskClick = (task: Task) => {
        // @ts-ignore
        if (window.Telegram?.WebApp) {
            // @ts-ignore
            window.Telegram.WebApp.openLink(task.link)
        } else {
            window.open(task.link, '_blank')
        }

        // Kanka, buradaki mantık: linke tıklandığında (veya 10 sn sonra) ödül verilir.
        // Gerçekten takip edip etmediğini API ile doğrulamak çok zordur, genelde tıkla-kazan yapılır.
        if (!tasksCompleted.includes(task.id)) {
            setTimeout(() => {
                addBalance(task.reward || 0)
                setTasksCompleted([...tasksCompleted, task.id])
            }, 2000) // 2 saniye sonra ödül ver
        }
    }

    return (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '15px' }}>🚀 {t('social.title')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tasks.map((task, idx) => {
                    const isDone = tasksCompleted.includes(task.id)
                    return (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * idx }}
                            whileHover={!isDone ? { scale: 1.02, background: 'rgba(255,255,255,0.08)' } : {}}
                            whileTap={!isDone ? { scale: 0.98 } : {}}
                            onClick={() => !isDone && handleTaskClick(task)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: isDone ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.03)',
                                padding: '12px',
                                borderRadius: '12px',
                                cursor: isDone ? 'default' : 'pointer',
                                border: isDone ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(255,255,255,0.05)',
                                opacity: isDone ? 0.8 : 1
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '24px' }}>{task.icon}</span>
                                <div>
                                    <div style={{ fontWeight: '500', fontSize: '14px' }}>{t(`social.tasks.${task.id}`)}</div>
                                    <div style={{ color: isDone ? '#10b981' : 'var(--primary)', fontSize: '12px', fontWeight: 'bold' }}>
                                        {isDone ? '✅ Tamamlandı' : `+${task.reward} TASTE`}
                                    </div>
                                </div>
                            </div>
                            {!isDone && (
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    style={{ fontSize: '18px', color: 'var(--text-muted)' }}
                                >
                                    ➔
                                </motion.div>
                            )}
                        </motion.div>
                    )
                })}
            </div>
        </div>
    )
}
