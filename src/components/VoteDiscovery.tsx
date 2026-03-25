import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

interface SocialLink {
    id: string;
    icon: string;
    label: string | React.ReactNode;
    sublabel?: string | React.ReactNode;
    link: string;
}

export function VoteDiscovery() {
    const { i18n } = useTranslation()
    const isEn = i18n.language === 'en'

    const votingLinks: SocialLink[] = [
        {
            id: 'coinmooner',
            icon: '🌕',
            label: 'CoinMooner',
            sublabel: isEn ? 'Vote & Support us!' : 'Oy ver ve destekle!',
            link: 'https://coinmooner.com/coins/taste-taste',
        },
        {
            id: 'coinsniper',
            icon: '🎯',
            label: 'CoinSniper',
            sublabel: isEn ? 'Vote & Support us!' : 'Oy ver ve destekle!',
            link: 'https://coinsniper.net/coin/89667',
        },
        {
            id: 'gemfinder',
            icon: '💎',
            label: 'GemFinder',
            sublabel: isEn ? 'Vote & Support us!' : 'Oy ver ve destekle!',
            link: 'https://gemfinder.cc/gem/28909',
        },
        {
            id: 'coinscope',
            icon: '🔭',
            label: 'CoinScope',
            sublabel: isEn ? 'Vote & Support us!' : 'Oy ver ve destekle!',
            link: 'https://www.coinscope.co/coin/taste',
        },
        {
            id: 'coinvote',
            icon: '🗳️',
            label: 'CoinVote',
            sublabel: isEn ? 'Vote & Support us!' : 'Oy ver ve destekle!',
            link: 'https://coinvote.cc/en/coin/TASTE',
        },
        {
            id: 'coingem',
            icon: '✨',
            label: 'CoinGem',
            sublabel: isEn ? 'Vote & Support us!' : 'Oy ver ve destekle!',
            link: 'https://coingem.com/ton/EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-',
        },
        {
            id: 'coinmarketcap',
            icon: '📈',
            label: 'CoinMarketCap (DEX)',
            sublabel: isEn ? 'Check price & Support!' : 'Fiyatı takip et ve destekle!',
            link: 'https://dex.coinmarketcap.com/token/ton/EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-',
        },
        {
            id: 'geckoterminal',
            icon: '🦎',
            label: 'GeckoTerminal',
            sublabel: isEn ? 'Live Chart & Favorites' : 'Canlı Grafik ve Favoriler',
            link: 'https://www.geckoterminal.com/ton/tokens/EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-',
        },
        {
            id: 'coinranking',
            icon: '🏅',
            label: 'Coinranking',
            sublabel: isEn ? 'Listed! Check & Support!' : 'Listelendi! Takip et!',
            link: 'https://coinranking.com/coin/UdsbdHXyf+taste-taste',
        },
        {
            id: 'dedust',
            icon: '💧',
            label: 'DeDust.io',
            sublabel: isEn ? 'Buy TASTE/USDT on DeDust' : 'DeDust\'ta TASTE/USDT Al',
            link: 'https://dedust.io/pools/EQALRRSemBV0YDhoOe8VCRg8LcoXEWg7IGSk3BJ2Xk4h3oC',
        },
        {
            id: 'okx',
            icon: '⬛',
            label: 'OKX Web3',
            sublabel: isEn ? 'Track on OKX' : 'OKX\'te Takip Et',
            link: `https://web3.okx.com/token/ton/EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-`,
        },
        {
            id: 'bitget',
            icon: '🔵',
            label: 'Bitget Wallet',
            sublabel: isEn ? 'Track on Bitget' : 'Bitget\'te Takip Et',
            link: 'https://web3.bitget.com/ton-wallet',
        },
        {
            id: 'tonkeeper',
            icon: '💎',
            label: 'Tonkeeper',
            sublabel: isEn ? 'Buy via Tonkeeper' : 'Tonkeeper ile Al',
            link: 'https://app.tonkeeper.com/dapp/https%3A%2F%2Fapp.ston.fi%2Fswap%3Fft%3DTON%26tt%3DEQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-',
        },
        {
            id: 'mytonwallet',
            icon: '🌐',
            label: 'MyTonWallet',
            sublabel: isEn ? 'View on MyTonWallet' : 'MyTonWallet\'ta Gör',
            link: 'https://mytonwallet.io',
        },
        {
            id: 'dyor',
            icon: '📊',
            label: 'DYOR.io',
            sublabel: isEn ? 'Track on DYOR Ninja' : 'DYOR.io Üzerinden Takip Et',
            link: 'https://dyor.io/token/EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-',
        },
    ]

    const handleLinkClick = (link: string) => {
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.openLink(link)
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
            onClick={() => handleLinkClick(item.link)}
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
            <ExternalLink size={16} color="var(--text-muted)" />
        </motion.div>
    )

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={{
                    padding: '20px',
                    background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.08), rgba(234, 179, 8, 0.02))',
                    border: '1px solid rgba(234, 179, 8, 0.15)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <span style={{ fontSize: '24px' }}>🏆</span>
                    <div>
                        <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--text-accent, #eab308)' }}>
                            {isEn ? 'Vote & Discovery Platforms' : 'Oylama ve Keşif Platformları'}
                        </h3>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>
                            {isEn ? 'Support us on listing platforms' : 'Listeleme platformlarında bizi destekle'}
                        </p>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {votingLinks.map((item, idx) => renderLinkItem(item, idx, 'rgba(234, 179, 8, 0.15)'))}
                </div>
            </motion.div>
        </div>
    )
}
