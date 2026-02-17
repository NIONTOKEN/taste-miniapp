import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useUser } from '../context/UserContext'
import { useTonConnectUI } from '@tonconnect/ui-react'

const REWARD_AMOUNT = 0.005

export function DailyRewards() {
    const { t } = useTranslation()
    const { streak, balance, handleWithdraw: contextWithdraw, updateStreak, addBalance, lastClaim } = useUser()
    const [canClaim, setCanClaim] = useState(false)
    const [tonConnectUI] = useTonConnectUI()
    const [isWithdrawing, setIsWithdrawing] = useState(false)

    useEffect(() => {
        if (lastClaim) {
            checkClaimStatus(lastClaim)
        } else {
            setCanClaim(true)
        }
    }, [lastClaim])

    const checkClaimStatus = (lastClaimTime: number) => {
        const now = new Date()
        const last = new Date(lastClaimTime)
        const isDifferentDay = now.getDate() !== last.getDate() ||
            now.getMonth() !== last.getMonth() ||
            now.getFullYear() !== last.getFullYear()
        setCanClaim(isDifferentDay)
    }

    const handleClaim = () => {
        if (!canClaim) return
        const newStreak = (streak % 7) + 1

        updateStreak(newStreak)
        addBalance(REWARD_AMOUNT)
        setCanClaim(false)
    }

    const handleWithdraw = async () => {
        setIsWithdrawing(true)
        await contextWithdraw(tonConnectUI, t)
        setIsWithdrawing(false)
    }

    return (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0 }}>📅 {t('rewards.title')}</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '10px' }}>
                    {t('rewards.streak', { days: streak })}
                </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '6px', marginBottom: '15px' }}>
                {[1, 2, 3, 4, 5, 6, 7].map((day) => {
                    const isActive = day <= streak
                    const isToday = day === streak + 1

                    return (
                        <motion.div
                            key={day}
                            whileHover={isToday && canClaim ? { scale: 1.1 } : {}}
                            style={{
                                background: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                color: isActive ? '#000' : 'var(--text-muted)',
                                borderRadius: '10px',
                                padding: '10px 4px',
                                textAlign: 'center',
                                fontSize: '10px',
                                border: isToday && canClaim ? '1px solid var(--primary)' : '1px solid transparent',
                                opacity: (day > streak + 1) ? 0.4 : 1,
                                boxShadow: isToday && canClaim ? '0 0 10px var(--primary-glow)' : 'none'
                            }}
                        >
                            <div style={{ marginBottom: '4px' }}>{t('rewards.day', { day })}</div>
                            <div style={{ fontWeight: 'bold' }}>{REWARD_AMOUNT}</div>
                        </motion.div>
                    )
                })}
            </div>

            <motion.button
                whileHover={canClaim ? { scale: 1.02 } : {}}
                whileTap={canClaim ? { scale: 0.98 } : {}}
                className="glass-button"
                style={{
                    width: '100%',
                    marginBottom: '10px',
                    opacity: canClaim ? 1 : 0.7,
                    cursor: canClaim ? 'pointer' : 'not-allowed',
                    background: canClaim ? 'var(--gradient-gold)' : '#0f172a',
                    color: canClaim ? '#000' : 'var(--text-muted)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontWeight: 'bold'
                }}
                onClick={handleClaim}
                disabled={!canClaim}
            >
                {canClaim ? t('rewards.claim') : `✅ ${t('rewards.claimed')}`}
            </motion.button>

            {/* Withdraw Button */}
            <motion.button
                whileHover={balance >= 1 ? { scale: 1.02, boxShadow: '0 0 15px rgba(0,255,0,0.2)' } : {}}
                whileTap={balance >= 1 ? { scale: 0.95 } : {}}
                className="glass-button"
                style={{
                    width: '100%',
                    opacity: balance >= 1 ? 1 : 0.5,
                    cursor: balance >= 1 ? 'pointer' : 'not-allowed',
                    background: balance >= 1 ? 'var(--secondary)' : '#1e293b',
                    color: balance >= 1 ? '#fff' : 'var(--text-muted)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '14px'
                }}
                onClick={handleWithdraw}
                disabled={balance < 1 || isWithdrawing}
            >
                {isWithdrawing ? '...' : t('rewards.withdraw')}
            </motion.button>

            {balance < 1 && (
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '5px' }}>
                    {t('rewards.insufficient_balance')}
                </div>
            )}
        </div>
    )
}
