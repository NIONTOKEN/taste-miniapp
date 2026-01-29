import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useUser } from '../context/UserContext'
import { useTonConnectUI } from '@tonconnect/ui-react'
import { Zap } from 'lucide-react'
import { AdsManager } from '../services/AdsManager'

const REWARD_AMOUNT = 0.005

export function DailyRewards() {
    const { t } = useTranslation()
    const { streak, balance, handleWithdraw: contextWithdraw, updateStreak, addBalance, lastClaim, doubleReward } = useUser()
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

    const handleDoubleClaim = async () => {
        if (!canClaim) return
        const success = await AdsManager.showRewardedVideo()
        if (success) {
            const newStreak = (streak % 7) + 1
            updateStreak(newStreak)
            addBalance(REWARD_AMOUNT) // First half
            doubleReward(REWARD_AMOUNT) // Second half
            setCanClaim(false)
        }
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

            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <motion.button
                    whileHover={canClaim ? { scale: 1.02 } : {}}
                    whileTap={canClaim ? { scale: 0.98 } : {}}
                    className="glass-button"
                    style={{
                        flex: 1,
                        opacity: canClaim ? 1 : 0.7,
                        cursor: canClaim ? 'pointer' : 'not-allowed',
                        background: canClaim ? '#1e293b' : '#0f172a',
                        color: canClaim ? 'var(--text-main)' : 'var(--text-muted)',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    onClick={handleClaim}
                    disabled={!canClaim}
                >
                    {canClaim ? t('rewards.claim') : `✅ ${t('rewards.claimed')}`}
                </motion.button>

                {canClaim && (
                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: '0 0 15px var(--primary-glow)' }}
                        whileTap={{ scale: 0.98 }}
                        className="glass-button"
                        style={{
                            flex: 1.2,
                            background: 'var(--gradient-gold)',
                            color: '#000',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            fontWeight: 'bold'
                        }}
                        onClick={handleDoubleClaim}
                    >
                        <Zap size={16} fill="black" /> 2X REWARD
                    </motion.button>
                )}
            </div>

            {/* Withdraw Button */}
            <motion.button
                whileHover={balance >= 5 ? { scale: 1.02, boxShadow: '0 0 15px rgba(0,255,0,0.2)' } : {}}
                whileTap={balance >= 5 ? { scale: 0.95 } : {}}
                className="glass-button"
                style={{
                    width: '100%',
                    opacity: balance >= 5 ? 1 : 0.5,
                    cursor: balance >= 5 ? 'pointer' : 'not-allowed',
                    background: balance >= 5 ? 'var(--secondary)' : '#1e293b',
                    color: balance >= 5 ? '#fff' : 'var(--text-muted)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontSize: '14px'
                }}
                onClick={handleWithdraw}
                disabled={balance < 5 || isWithdrawing}
            >
                {isWithdrawing ? '...' : t('rewards.withdraw')}
            </motion.button>

            {balance < 5 && (
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '5px' }}>
                    {t('rewards.insufficient_balance')}
                </div>
            )}
        </div>
    )
}
