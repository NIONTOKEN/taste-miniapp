import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react'
import { Address, toNano, beginCell } from '@ton/core'
import { apiService } from '../services/api'
import { 
  ChefHat, 
  Crown, 
  Gem, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  ArrowRight,
  UserCheck,
  MapPin,
  ExternalLink
} from 'lucide-react'

// Restaurant Kasa Address (Receiver of service fee)
const KASA_ADDRESS = 'UQAzYgt3LoveknM9riA7jpZIbwmNi65c1UUA4AGBwvbr5lnD'
const JETTON_MASTER_ADDRESS = 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-'

interface Tier {
    id: 'none' | 'bronze' | 'silver' | 'gold' | 'diamond'
    name: string
    minAmount: number
    discount: number
    color: string
    icon: React.ReactNode
    bgColor: string
}

export function TasteChef() {
    const { t, i18n } = useTranslation()
    const [tonConnectUI] = useTonConnectUI()
    const userAddress = useTonAddress()
    const [balance, setBalance] = useState<number>(0)
    const [kasaBalance, setKasaBalance] = useState<number>(0)
    const [loading, setLoading] = useState(false)
    const [fillingKasa, setFillingKasa] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [tastePrice, setTastePrice] = useState<number>(0.00135)
    
    // Fee logic: Tier Min Amount * (Tier Discount %) / 100 
    // This matches: 7500 * 7.5% = 562.5 (Fixed fee per tier level)
    const getSymbolicFee = () => {
        if (!currentTier) return 0
        return (currentTier.minAmount * currentTier.discount) / 100
    }

    const [exchangeRate, setExchangeRate] = useState<number>(43.87)

    // Dynamic Tier Configs (USD based targets)
    const TIER_CONFIGS = [
        { id: 'bronze', usdTarget: 3, discount: 2.5, color: '#a8a29e', bgColor: 'rgba(168, 162, 158, 0.1)', icon: <ChefHat size={20} color="#a8a29e" /> },
        { id: 'silver', usdTarget: 6, discount: 5.0, color: '#94a3b8', bgColor: 'rgba(148, 163, 184, 0.1)', icon: <ChefHat size={20} color="#94a3b8" /> },
        { id: 'gold', usdTarget: 12, discount: 7.5, color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)', icon: <ChefHat size={20} color="#f59e0b" /> },
        { id: 'diamond', usdTarget: 25, discount: 10.0, color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)', icon: <ChefHat size={20} color="#10b981" /> },
    ]

    // Calculate dynamic tiers based on price
    const tiers: Tier[] = TIER_CONFIGS.map(config => ({
        id: config.id as any,
        name: i18n.language === 'tr' 
            ? (config.id === 'bronze' ? 'Çırak' : config.id === 'silver' ? 'Kalfa' : config.id === 'gold' ? 'Usta' : 'Şef')
            : (config.id === 'bronze' ? 'Apprentice' : config.id === 'silver' ? 'Journeyman' : config.id === 'gold' ? 'Master' : 'Chef'),
        minAmount: Math.ceil(config.usdTarget / tastePrice),
        discount: config.discount,
        color: config.color,
        bgColor: config.bgColor,
        icon: config.icon
    }))

    useEffect(() => {
        const fetchBalance = async () => {
            if (!userAddress) return
            try {
                const bal = await apiService.getJettonBalance(userAddress, JETTON_MASTER_ADDRESS)
                setBalance(bal)
                
                // Fetch Kasa Balance
                const kBal = await apiService.getJettonBalance(KASA_ADDRESS, JETTON_MASTER_ADDRESS)
                setKasaBalance(kBal)
            } catch (e) {
                console.error('Failed to fetch balance', e)
            }
        }

        const fetchPrice = async () => {
            try {
                const data = await apiService.getTastePrice()
                if (data.price > 0) setTastePrice(data.price)
                
                const ex = await apiService.getExchangeRate()
                if (ex.rate > 0) setExchangeRate(ex.rate)
            } catch (e) {}
        }

        fetchBalance()
        fetchPrice()
        const interval = setInterval(() => {
            fetchBalance()
            fetchPrice()
        }, 30000)
        return () => clearInterval(interval)
    }, [userAddress])

    const currentTier = [...tiers].reverse().find(tier => balance >= tier.minAmount)
    const nextTier = tiers.find(tier => balance < tier.minAmount)

    const handleGetDiscount = async () => {
        if (!userAddress || !currentTier) return
        
        setError(null)
        setLoading(true)

        try {
            const symbolicFee = getSymbolicFee()
            const jettonWalletAddress = await apiService.getJettonWalletAddress(userAddress, JETTON_MASTER_ADDRESS)
            
            const body = beginCell()
                .storeUint(0xf8a7ea5, 32)
                .storeUint(0, 64)
                .storeCoins(toNano(symbolicFee.toString()))
                .storeAddress(Address.parse(KASA_ADDRESS))
                .storeAddress(Address.parse(userAddress))
                .storeUint(0, 1)
                .storeCoins(toNano('0.05'))
                .storeUint(0, 1)
                .endCell()

            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 360,
                messages: [
                    {
                        address: jettonWalletAddress,
                        amount: toNano('0.1').toString(),
                        payload: body.toBoc().toString('base64')
                    }
                ]
            }

            await tonConnectUI.sendTransaction(transaction)
            setSuccess(true)
            setLoading(false)
            
            // Auto hide success after 5 seconds
            setTimeout(() => setSuccess(false), 5000)
        } catch (e: any) {
            console.error('Transfer failed', e)
            setLoading(false)
        }
    }

    const handleFillSafe = async () => {
        if (!userAddress) return
        setFillingKasa(true)
        try {
            const jettonWalletAddress = await apiService.getJettonWalletAddress(userAddress, JETTON_MASTER_ADDRESS)
            const body = beginCell()
                .storeUint(0xf8a7ea5, 32)
                .storeUint(0, 64)
                .storeCoins(toNano('1000')) // Default fill amount
                .storeAddress(Address.parse(KASA_ADDRESS))
                .storeAddress(Address.parse(userAddress))
                .storeUint(0, 1)
                .storeCoins(toNano('0.05'))
                .storeUint(0, 1)
                .endCell()

            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 360,
                messages: [{
                    address: jettonWalletAddress,
                    amount: toNano('0.1').toString(),
                    payload: body.toBoc().toString('base64')
                }]
            }
            await tonConnectUI.sendTransaction(transaction)
            setSuccess(true)
        } catch (e) {
            console.error('Fill failed', e)
        } finally {
            setFillingKasa(false)
        }
    }

    return (
        <div className="teste-chef-container">
            {/* Status Card */}
            {/* Main Safe Status */}
            <div className="glass-panel" style={{ padding: '20px', marginBottom: '16px', background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '11px', fontWeight: 800, color: '#10b981', textTransform: 'uppercase' }}>🛡️ {t('chef.safe_title')}</div>
                        <div style={{ fontSize: '20px', fontWeight: 900, marginTop: '4px' }}>{kasaBalance.toLocaleString()} TASTE</div>
                    </div>
                    <motion.button 
                        whileTap={{ scale: 0.95 }}
                        disabled={fillingKasa}
                        onClick={handleFillSafe}
                        style={{ background: '#10b981', color: '#000', border: 'none', borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: 900, cursor: 'pointer' }}
                    >
                        {fillingKasa ? '...' : t('chef.fill_safe')}
                    </motion.button>
                </div>
            </div>

            <div className="glass-panel" style={{ 
                padding: '24px', 
                marginBottom: '16px', 
                background: currentTier ? `linear-gradient(135deg, ${currentTier.bgColor}, rgba(15, 23, 42, 0.9))` : 'var(--bg-card)',
                border: `1px solid ${currentTier ? currentTier.color + '40' : 'rgba(255,255,255,0.08)'}`,
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Decorative background icon */}
                <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1, transform: 'rotate(-20deg)' }}>
                    {currentTier ? currentTier.icon : <ChefHat size={120} />}
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ 
                                width: '40px', height: '40px', 
                                borderRadius: '12px', 
                                background: currentTier ? currentTier.color : 'rgba(255,255,255,0.05)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: currentTier ? '#000' : 'var(--text-muted)'
                            }}>
                                {currentTier ? currentTier.icon : <ChefHat size={24} />}
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                                    {currentTier ? currentTier.name : (i18n.language === 'tr' ? 'Çırak' : 'Apprentice')}
                                </h4>
                                <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>
                                    {balance.toLocaleString()} TASTE • {Math.floor(balance * tastePrice * exchangeRate).toLocaleString()} TL
                                </p>
                            </div>
                        </div>
                        <div style={{ 
                            background: '#ef4444', color: '#fff', fontSize: '10px', fontWeight: 900, 
                            padding: '4px 8px', borderRadius: '8px', boxShadow: '0 0 10px rgba(239,68,68,0.3)' 
                        }}>
                            DEMO / COMING SOON
                        </div>
                    </div>

                    {currentTier ? (
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                                <span style={{ fontSize: '32px', fontWeight: 900, color: currentTier.color }}>%{currentTier.discount}</span>
                            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-muted)' }}>{t('chef.discount_right')}</span>
                            </div>
                        </div>
                    ) : (
                        <div style={{ marginBottom: '20px', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                                {t('chef.min_hold_warning')}
                            </p>
                        </div>
                    )}

                    {nextTier && (
                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
                                <span style={{ color: 'var(--text-muted)' }}>{t('chef.next_level')} {t(`chef.tiers.${nextTier.id}`)}</span>
                                <span>{Math.round((balance / nextTier.minAmount) * 100)}%</span>
                            </div>
                            <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(balance / nextTier.minAmount) * 100}%` }}
                                    style={{ height: '100%', background: nextTier.color }} 
                                />
                            </div>
                            <p style={{ marginTop: '6px', fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center' }}>
                                {(nextTier.minAmount - balance).toLocaleString()} {t('chef.units_needed')}
                            </p>
                        </div>
                    )}

                    {!userAddress && (
                        <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <AlertCircle size={18} color="#ef4444" />
                            <span style={{ fontSize: '12px', color: '#fca5a5' }}>
                                {t('chef.connect_warning')}
                            </span>
                        </div>
                    )}

                    {userAddress && currentTier && (
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={loading}
                            onClick={handleGetDiscount}
                            style={{
                                width: '100%',
                                padding: '16px',
                                borderRadius: '16px',
                                border: 'none',
                                background: loading ? 'rgba(255,255,255,0.05)' : `linear-gradient(135deg, ${currentTier.color}, #000)`,
                                color: currentTier.color,
                                fontWeight: 800,
                                fontSize: '15px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px',
                                boxShadow: `0 8px 20px ${currentTier.color}30`,
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {loading ? (
                                <div className="spinner-small" />
                            ) : (
                                <>
                                    <UserCheck size={20} />
                                    {t('chef.get_discount')}
                                </>
                            )}
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Success Overlay */}
            <AnimatePresence>
                {success && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            padding: '16px',
                            background: 'rgba(34, 197, 94, 0.1)',
                            border: '1px solid rgba(34, 197, 94, 0.3)',
                            borderRadius: '16px',
                            marginBottom: '16px',
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'center'
                        }}
                    >
                        <CheckCircle2 color="#22c55e" size={24} />
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '14px', color: '#4ade80' }}>
                                {t('chef.success_title')}
                            </div>
                            <div style={{ fontSize: '12px', color: 'rgba(34, 197, 94, 0.8)' }}>
                                {t('chef.success_desc')}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error Overlay */}
            <AnimatePresence>
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            padding: '16px',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '16px',
                            marginBottom: '16px',
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'center'
                        }}
                    >
                        <AlertCircle color="#ef4444" size={24} />
                        <div>
                            <div style={{ fontWeight: 800, fontSize: '14px', color: '#fca5a5' }}>
                                {t('chef.error_title', { defaultValue: 'Error!' })}
                            </div>
                            <div style={{ fontSize: '12px', color: 'rgba(239, 68, 68, 0.8)' }}>
                                {error}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tiers Info Grid */}
            <h5 style={{ margin: '20px 0 10px', fontSize: '13px', fontWeight: 800, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Info size={14} /> {t('chef.mastery_levels')}
            </h5>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tiers.map((tier) => (
                    <div key={tier.id} className="glass-panel" style={{ 
                        padding: '12px 16px', 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        background: balance >= tier.minAmount ? tier.bgColor : 'rgba(255,255,255,0.02)',
                        borderColor: balance >= tier.minAmount ? tier.color + '40' : 'rgba(255,255,255,0.05)',
                        opacity: balance >= tier.minAmount ? 1 : 0.6
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ color: tier.color }}>{tier.icon}</div>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: 800, color: tier.color }}>{tier.name}</div>
                                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                                    {tier.minAmount.toLocaleString()} TASTE (~{Math.floor((TIER_CONFIGS.find(c => c.id === tier.id)?.usdTarget || 0) * exchangeRate)} TL)
                                </div>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '15px', fontWeight: 900, color: '#fff' }}>%{tier.discount} OFF</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Venue Navigation */}
            <div style={{ marginTop: '20px' }}>
                <h5 style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 800, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} /> {t('chef.nearby_venues')}
                </h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <motion.div 
                        whileHover={{ scale: 1.01 }}
                        onClick={() => window.open('https://maps.google.com/?q=Restaurants+Istanbul', '_blank')}
                        style={{ 
                            padding: '16px', 
                            background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '16px', 
                            border: '1px solid rgba(255,255,255,0.08)',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>Taste Gourmet & Lounge</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t('chef.nearby_branch')} • 1.2 km</div>
                            </div>
                            <div style={{ color: 'var(--primary)' }}><ExternalLink size={18} /></div>
                        </div>
                    </motion.div>
                    <p style={{ margin: '8px 4px 0', fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        {t('chef.nav_tip')}
                    </p>
                </div>
            </div>

            {/* FAQ / Legal Note */}
            <div style={{ 
                marginTop: '20px', 
                padding: '16px', 
                background: 'rgba(255,255,255,0.03)', 
                borderRadius: '16px', 
                border: '2px solid rgba(239, 68, 68, 0.2)' 
            }}>
                <h6 style={{ margin: '0 0 8px', fontSize: '12px', fontWeight: 800, color: '#fca5a5' }}>⚖️ {t('chef.legal_title')}</h6>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(t('chef.legal_points', { returnObjects: true }) as string[]).map((point, idx) => (
                        <li key={idx} style={idx === 0 ? { color: '#fca5a5', fontWeight: 700 } : idx === 3 ? { color: '#ef4444', fontWeight: 800 } : {}}>{point}</li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
