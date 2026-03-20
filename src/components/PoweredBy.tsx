import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

// ─── SVG Logo Components ───────────────────────────────────────────────────
const TelegramLogo = () => (
    <svg viewBox="0 0 24 24" fill="none" style={{ width: '100%', height: '100%' }}>
        <circle cx="12" cy="12" r="12" fill="#229ED9" />
        <path d="M5.5 11.8L17.2 7.3c.5-.2 1 .1.8.9l-2 9.4c-.1.6-.5.8-.9.5l-2.5-1.9-1.2 1.1c-.1.1-.3.2-.5.2l.2-2.6 4.9-4.4c.2-.2 0-.3-.3-.1L7.8 13.2 5.3 12.5c-.6-.2-.6-.6.2-.7z" fill="white" />
    </svg>
)

const XLogo = () => (
    <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%', padding: '4px', boxSizing: 'border-box' }} fill="white">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
)

const WebLogo = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '100%', height: '100%', padding: '4px', boxSizing: 'border-box', color: 'white' }}>
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
)

const WhatsAppLogo = () => (
    <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }} fill="#25D366">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a5.292 5.292 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
    </svg>
)

const FacebookLogo = () => (
    <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }} fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
)

const InstagramLogo = () => (
    <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
        <defs>
            <linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f09433" />
                <stop offset="25%" stopColor="#e6683c" />
                <stop offset="50%" stopColor="#dc2743" />
                <stop offset="75%" stopColor="#cc2366" />
                <stop offset="100%" stopColor="#bc1888" />
            </linearGradient>
        </defs>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm3.98-10.142a1.44 1.44 0 11-2.88 0 1.44 1.44 0 012.88 0z" fill="url(#igGrad)"/>
    </svg>
)

const TikTokLogo = () => (
    <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }} fill="white">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 2.78-1.15 5.54-3.33 7.65-2.18 2.1-5.11 3-8.1 2.65-3.34-.39-6.27-2.31-7.85-5.19-1.57-2.88-1.55-6.3.06-9.17 1.61-2.87 4.54-4.8 7.88-5.2V11.6c-1.39.22-2.73.91-3.67 1.98-.94 1.07-1.43 2.52-1.35 3.98.08 1.46.73 2.84 1.83 3.79 1.1 .96 2.59 1.43 4.07 1.34 1.47-.09 2.87-.79 3.79-1.92.35-.43.61-.92.81-1.44.17-.46.3-1.07.3-1.07V.01h3.49v.01z"/>
    </svg>
)

const EmailLogo = () => (
    <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }} fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
)

const GoogleLogo = () => (
    <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
)

const NetlifyLogo = () => (
    <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
        <path d="M16.934 8.519a1.044 1.044 0 0 1 .303.23l2.349-1.045-2.192-2.171-.491 2.954zM12.06 6.546a1.305 1.305 0 0 1 .209.574l3.497 1.482a1.044 1.044 0 0 1 .355-.177l.574-3.45-2.13-2.234zM20.755 19L20 15l-2 .9L20.755 19zM14 20.586l.682-4.089c-.06-.036-.116-.078-.166-.127l-3.917 1.72-.14 5.02L14 20.58zM9.824 23.11l.14-5.022-4.867-2.14L9.824 23.11zM4.955 15.478L8.74 17.4l5.331-2.284a1.308 1.308 0 0 1-.014-1.469L10.8 11.3 4.955 15.478zM10.8 11.3l3.257 2.347a1.293 1.293 0 0 1 1.676-.095l3.78-2.49a1.3 1.3 0 0 1 .06-.398l-3.618-1.533-.041.057zM19.573 10.664l-3.78 2.49c.01.054.017.11.02.166l2.42.414a1.044 1.044 0 0 1 2.08.189zM22 15l-3-4-2 1.333L22 15z" fill="#00AD9F" />
    </svg>
)

const RailwayLogo = () => (
    <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
        <path d="M3.26 11.63a.5.5 0 0 0 .5-.5v-.72c0-.28-.22-.5-.5-.5s-.5.22-.5.5v.72c0 .28.22.5.5.5z" fill="#B044F8"/>
        <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm6.22 8.23l-1.73 7.22a.75.75 0 0 1-.73.59H8.24a.75.75 0 0 1-.73-.59L5.78 10.23A.75.75 0 0 1 6.5 9.25h11a.75.75 0 0 1 .72.98zm.28-1.48H5.5A.5.5 0 0 1 5 8.25a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 .5.5.5.5 0 0 1-.5.5z" fill="#B044F8"/>
    </svg>
)

const GithubLogo = () => (
    <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" fill="#fff" />
    </svg>
)

const SupabaseLogo = () => (
    <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
        <path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C.111 12.857.673 14.07 1.664 14.07h7.596c.98 0 1.54 1.21.875 1.965L4.173 21.96c-.773.892.142 2.16 1.188 1.74l13.48-5.45c.879-.355.879-1.64 0-1.996L6.9 11.94c-.879-.356-.879-1.641 0-1.997l5.001-2.02 z" fill="#3ECF8E" />
    </svg>
)

const TonLogo = () => (
    <svg viewBox="0 0 56 56" style={{ width: '100%', height: '100%' }}>
        <circle cx="28" cy="28" r="28" fill="#0098EA" />
        <path d="M37.17 18H18.83a1.75 1.75 0 0 0-1.48 2.7l9.18 13.42L28 36.4l1.47-2.28 9.18-13.42A1.75 1.75 0 0 0 37.17 18z" fill="white" />
        <path d="M28 34.12l-7.87-11.5H28v11.5z" fill="white" opacity="0.5" />
    </svg>
)

const OKXLogo = () => (
    <svg viewBox="0 0 240 240" style={{ width: '100%', height: '100%' }}>
        <rect width="240" height="240" rx="48" fill="#000" />
        <rect x="80" y="80" width="32" height="32" rx="4" fill="white" />
        <rect x="128" y="80" width="32" height="32" rx="4" fill="white" />
        <rect x="128" y="128" width="32" height="32" rx="4" fill="white" />
        <rect x="80" y="128" width="32" height="32" rx="4" fill="white" />
    </svg>
)

const BitgetLogo = () => (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <rect width="100" height="100" rx="20" fill="#00C6A2" />
        <text x="50%" y="62%" textAnchor="middle" fill="white" fontSize="44" fontWeight="bold" fontFamily="Arial">B</text>
    </svg>
)

const BinanceLogo = () => (
    <svg viewBox="0 0 126.61 126.61" style={{ width: '100%', height: '100%' }}>
        <circle cx="63.3" cy="63.3" r="63.3" fill="#F0B90B" />
        <path d="M38.73 53.2L50.47 41.47l11.81 11.8 6.87-6.87L50.47 27.73 31.86 46.34zM27.73 58.07l-6.86 6.87L27.73 71.8l6.87-6.86zM50.47 73.14L38.7 61.4l-6.88 6.86L50.47 86.9 69.15 68.27l-6.87-6.87zM85.13 64.94L92 58.07l-6.87-6.87-6.87 6.87zM63.3 52.2l-6.87 6.87 6.87 6.87 6.87-6.87zM63.3 27.73L44.68 46.34l6.8 6.86 11.82-11.8 11.73 11.8 6.87-6.87z" fill="white" />
    </svg>
)

const TonkeeperLogo = () => (
    <svg viewBox="0 0 56 56" style={{ width: '100%', height: '100%' }}>
        <circle cx="28" cy="28" r="28" fill="#45AEF5" />
        <path d="M28 14C20.27 14 14 20.27 14 28s6.27 14 14 14 14-6.27 14-14S35.73 14 28 14zm0 22.4l-8.4-8.4H36.4L28 36.4z" fill="white" />
    </svg>
)

const GeminiLogo = () => (
    <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
        <defs>
            <linearGradient id="geminiGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4285F4" />
                <stop offset="100%" stopColor="#34A853" />
            </linearGradient>
        </defs>
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-3a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-2a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" fill="url(#geminiGrad)" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" fill="none" />
        <ellipse cx="12" cy="12" rx="3" ry="9" fill="url(#geminiGrad)" opacity="0.6" />
        <ellipse cx="12" cy="12" rx="9" ry="3" fill="url(#geminiGrad)" opacity="0.6" />
    </svg>
)

const GroqLogo = () => (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <rect width="100" height="100" rx="20" fill="#f55036" />
        <text x="50%" y="62%" textAnchor="middle" fill="white" fontSize="32" fontWeight="900" fontFamily="Arial, sans-serif">GROQ</text>
    </svg>
)

const LlamaLogo = () => (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <rect width="100" height="100" rx="20" fill="#0668E1" />
        <text x="50%" y="66%" textAnchor="middle" fill="white" fontSize="56" fontFamily="Arial, sans-serif">🦙</text>
    </svg>
)

const AntigravityLogo = () => (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <defs>
            <linearGradient id="agGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#BB4AFF" />
            </linearGradient>
        </defs>
        <rect width="100" height="100" rx="22" fill="url(#agGrad)" />
        <circle cx="50" cy="38" r="14" fill="white" opacity="0.9" />
        <rect x="25" y="58" width="50" height="6" rx="3" fill="white" opacity="0.7" />
        <rect x="30" y="70" width="40" height="6" rx="3" fill="white" opacity="0.5" />
        <rect x="38" y="82" width="24" height="5" rx="2.5" fill="white" opacity="0.3" />
        <circle cx="43" cy="35" r="3" fill="#0f172a" />
        <circle cx="57" cy="35" r="3" fill="#0f172a" />
    </svg>
)

const GeckoTerminalLogo = () => (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <rect width="100" height="100" rx="20" fill="#1a1a2e" />
        <text x="50%" y="64%" textAnchor="middle" fontSize="52" fontFamily="serif">🦎</text>
    </svg>
)

const StonFiLogo = () => (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <rect width="100" height="100" rx="20" fill="#0D1117" />
        <circle cx="50" cy="50" r="28" fill="none" stroke="#00c896" strokeWidth="4" />
        <path d="M35 50 Q50 30 65 50 Q50 70 35 50z" fill="#00c896" />
    </svg>
)

const JVaultLogo = () => (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <rect width="100" height="100" rx="20" fill="#14532d" />
        <rect x="28" y="44" width="44" height="34" rx="6" fill="#22c55e" />
        <path d="M34 44V34C34 24.06 66 24.06 66 34V44" stroke="#22c55e" strokeWidth="6" fill="none" strokeLinecap="round" />
        <circle cx="50" cy="58" r="6" fill="#14532d" />
    </svg>
)

const ReactLogo = () => (
    <svg viewBox="0 0 24 24" style={{ width: '100%', height: '100%' }}>
        <circle cx="12" cy="12" r="2.139" fill="#61DAFB" />
        <g fill="none" stroke="#61DAFB" strokeWidth="1">
            <ellipse rx="11" ry="4.2" cx="12" cy="12" />
            <ellipse rx="11" ry="4.2" cx="12" cy="12" transform="rotate(60 12 12)" />
            <ellipse rx="11" ry="4.2" cx="12" cy="12" transform="rotate(120 12 12)" />
        </g>
    </svg>
)

const ViteLogo = () => (
    <svg viewBox="0 0 255 255" style={{ width: '100%', height: '100%' }}>
        <defs>
            <linearGradient id="viteGrad" x1="62.5" y1="0" x2="196" y2="255" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#41d1ff" />
                <stop offset="1" stopColor="#8b5cf6" />
            </linearGradient>
        </defs>
        <path d="M255 0L128 232 0 0h97l31 54 32-54z" fill="url(#viteGrad)" />
    </svg>
)

const TonConnectLogo = () => (
    <svg viewBox="0 0 56 56" style={{ width: '100%', height: '100%' }}>
        <circle cx="28" cy="28" r="28" fill="#0098EA" />
        <path d="M20 22h16M20 28h16M20 34h16" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
)

const TonScanLogo = () => (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <rect width="100" height="100" rx="20" fill="#0f1f3d" />
        <circle cx="44" cy="44" r="20" fill="none" stroke="#38bdf8" strokeWidth="7" />
        <line x1="58" y1="58" x2="75" y2="75" stroke="#38bdf8" strokeWidth="7" strokeLinecap="round" />
        <circle cx="44" cy="44" r="10" fill="#38bdf820" />
    </svg>
)

const LockerLogo = () => (
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
        <rect width="100" height="100" rx="20" fill="#1e1b4b" />
        <rect x="26" y="46" width="48" height="36" rx="7" fill="#6366f1" />
        <path d="M34 46V34C34 22 66 22 66 34V46" stroke="#6366f1" strokeWidth="7" fill="none" strokeLinecap="round" />
        <rect x="44" y="56" width="12" height="10" rx="3" fill="#1e1b4b" />
        <circle cx="50" cy="58" r="4" fill="#a5b4fc" />
    </svg>
)

// ─── Tool Definitions ──────────────────────────────────────────────────────
interface Tool {
    name: string
    color: string
    category: string
    url?: string
    Logo: React.FC
    badge?: string
}

// Tools defined inside component for i18n access

// Categories defined inside component for i18n access

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
    const handleClick = () => {
        if (!tool.url) return
        if (window.Telegram?.WebApp) window.Telegram.WebApp.openLink(tool.url)
        else window.open(tool.url, '_blank')
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            whileHover={{ scale: 1.04, y: -3 }}
            whileTap={{ scale: 0.97 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05, type: 'spring', stiffness: 260, damping: 20 }}
            onClick={handleClick}
            style={{
                background: `linear-gradient(145deg, ${tool.color}0c, ${tool.color}05)`,
                border: `1px solid ${tool.color}28`,
                borderRadius: '14px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: tool.url ? 'pointer' : 'default',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Glow effect */}
            <div style={{
                position: 'absolute', inset: 0, borderRadius: '14px',
                background: `radial-gradient(ellipse at 50% 0%, ${tool.color}10, transparent 70%)`,
                pointerEvents: 'none'
            }} />

            {/* Logo */}
            <div style={{
                width: '40px', height: '40px',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: `0 4px 14px ${tool.color}30`,
                border: `1px solid ${tool.color}30`,
                flexShrink: 0,
            }}>
                <tool.Logo />
            </div>

            {/* Name */}
            <span style={{
                fontSize: '10px',
                fontWeight: 700,
                color: tool.color,
                textAlign: 'center',
                lineHeight: 1.2,
                letterSpacing: '0.2px',
            }}>
                {tool.name}
            </span>

            {/* Badge */}
            {tool.badge && (
                <div style={{
                    fontSize: '8px',
                    fontWeight: 600,
                    color: '#000',
                    background: tool.color,
                    borderRadius: '20px',
                    padding: '2px 7px',
                    letterSpacing: '0.5px',
                    whiteSpace: 'nowrap',
                }}>
                    {tool.badge}
                </div>
            )}

            {tool.url && (
                <div style={{ fontSize: '9px', color: `${tool.color}60`, lineHeight: 1 }}>↗</div>
            )}
        </motion.div>
    )
}

export function PoweredBy() {
    const { i18n } = useTranslation()
    const isEn = i18n.language === 'en'

    const tools: Tool[] = [
        // 🤖 AI
        { name: 'Antigravity', color: '#818cf8', category: 'AI', Logo: AntigravityLogo, badge: isEn ? 'Code Author' : 'Kod Yazarı' },
        { name: 'Gemini', color: '#4285F4', category: 'AI', url: 'https://gemini.google.com', Logo: GeminiLogo, badge: 'Assist' },
        { name: 'Groq', color: '#f55036',   category: 'AI', url: 'https://groq.com', Logo: GroqLogo },
        { name: 'Llama 3.3', color: '#0668E1', category: 'AI', url: 'https://llama.meta.com', Logo: LlamaLogo },
    
        // ⛓️ Blockchain & Web3
        { name: 'TON Network', color: '#0098EA', category: 'Blockchain', url: 'https://ton.org', Logo: TonLogo },
        { name: 'STON.fi', color: '#00c896', category: 'Blockchain', url: 'https://ston.fi', Logo: StonFiLogo },
        { name: 'Tonkeeper', color: '#45AEF5', category: 'Blockchain', url: 'https://tonkeeper.com', Logo: TonkeeperLogo },
        { name: 'JVault', color: '#22c55e', category: 'Blockchain', Logo: JVaultLogo, badge: 'LOCKED' },
        { name: 'LP Lock', color: '#6366f1', category: 'Blockchain', Logo: LockerLogo, badge: '10 YRS' },
    
        // 🏦 Exchanges (Borsalar)
        { name: 'OKX', color: '#ffffff', category: 'Exchange', url: 'https://okx.com', Logo: OKXLogo },
        { name: 'Bitget', color: '#00C6A2', category: 'Exchange', url: 'https://bitget.com', Logo: BitgetLogo },
        { name: 'Binance', color: '#F0B90B', category: 'Exchange', url: 'https://binance.com', Logo: BinanceLogo },
    
        // ⚡ Tech & Frameworks
        { name: 'Google', color: '#34A853', category: 'Tech', Logo: GoogleLogo },
        { name: 'Netlify', color: '#00AD9F', category: 'Tech', url: 'https://netlify.com', Logo: NetlifyLogo },
        { name: 'Railway', color: '#B044F8', category: 'Tech', url: 'https://railway.app', Logo: RailwayLogo },
        { name: 'Supabase', color: '#3ECF8E', category: 'Tech', url: 'https://supabase.com', Logo: SupabaseLogo, badge: 'Real-time DB' },
        { name: 'React', color: '#61DAFB', category: 'Tech', Logo: ReactLogo },
        { name: 'Vite', color: '#646CFF', category: 'Tech', Logo: ViteLogo },

        // 🌐 Socials & Communication
        { name: 'Main TG', color: '#229ED9', category: 'Socials', url: 'https://t.me/taste2025', Logo: TelegramLogo },
        { name: 'Mini App Group', color: '#229ED9', category: 'Socials', url: 'https://t.me/taste_miniapp/1', Logo: TelegramLogo, badge: 'COMMUNITY' },
        { name: 'Launch Bot', color: '#229ED9', category: 'Socials', url: 'https://t.me/taste_launch_bot', Logo: TelegramLogo, badge: 'BOT' },
        { name: 'X / Twitter', color: '#ffffff', category: 'Socials', url: 'https://x.com/taste_token', Logo: XLogo },
        { name: 'WhatsApp', color: '#25D366', category: 'Socials', url: 'https://chat.whatsapp.com/G2Q6xjoYt94GzseLmFnUtO?mode=gi_t', Logo: WhatsAppLogo },
        { name: 'Instagram', color: '#e6683c', category: 'Socials', url: 'https://www.instagram.com/taste_ton_taste', Logo: InstagramLogo },
        { name: 'TikTok', color: '#ffffff', category: 'Socials', url: 'https://www.tiktok.com/@taste_ton', Logo: TikTokLogo },
        { name: 'Facebook', color: '#1877F2', category: 'Socials', url: 'https://www.facebook.com/share/1DGWE1ZQoR/', Logo: FacebookLogo },
        { name: 'TASTE Web', color: '#f59e0b', category: 'Socials', url: 'https://tastetoken.net', Logo: WebLogo },
        { name: 'Email', color: '#94a3b8', category: 'Socials', url: 'mailto:tastetoken.net@tastetoken.net', Logo: EmailLogo },
    ]

    const categories = [
        { id: 'AI',         label: isEn ? '🤖 Artificial Intelligence' : '🤖 Yapay Zeka',            color: '#818cf8', glow: 'rgba(129,140,248,0.12)' },
        { id: 'Blockchain', label: isEn ? '⛓️ Blockchain & Web3' : '⛓️ Blockchain & Web3',           color: '#0098EA', glow: 'rgba(0,152,234,0.12)' },
        { id: 'Exchange',   label: isEn ? '🏦 Ecosystem Exchanges' : '🏦 Ekosistem Borsalar',        color: '#F0B90B', glow: 'rgba(240,185,11,0.12)' },
        { id: 'Tech',       label: isEn ? '⚡ Tech & Frameworks' : '⚡ Teknoloji & Altyapı',          color: '#34d399', glow: 'rgba(52,211,153,0.12)' },
        { id: 'Socials',    label: isEn ? '🌐 Community & Ecosystem' : '🌐 Topluluk & Sosyal Ağlar', color: '#f59e0b', glow: 'rgba(245,158,11,0.12)' },
    ]
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ marginBottom: '20px' }}
        >
            {/* ─── Header ────────────────────────────────────────── */}
            <div
                className="glass-panel"
                style={{
                    padding: '22px 20px 16px',
                    marginBottom: '16px',
                    textAlign: 'center',
                    background: 'linear-gradient(145deg, rgba(15,23,42,0.95), rgba(30,41,59,0.85))',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                {/* bg shimmer */}
                <div style={{
                    position: 'absolute', top: '-40%', left: '-20%', right: '-20%',
                    height: '120%',
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(129,140,248,0.08), transparent 65%)',
                    pointerEvents: 'none',
                }} />
                <div style={{ fontSize: '10px', letterSpacing: '3px', color: '#818cf8', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px', position: 'relative' }}>
                    Powered By & Built With
                </div>
                <h3 style={{ fontWeight: 900, fontSize: '1.1rem', margin: '0 0 6px', position: 'relative' }}>
                    {isEn ? '⚙️ Supporting Technologies' : '⚙️ Destekleyen Teknolojiler'}
                </h3>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', margin: 0, position: 'relative' }}>
                    {isEn ? 'Tools and ecosystem keeping TASTE Mini App alive' : 'TASTE Mini App\'i ayakta tutan araçlar ve ekosistem'}
                </p>
            </div>

            {/* ─── Categories ────────────────────────────────────── */}
            {categories.map((cat, ci) => {
                const catTools = tools.filter(t => t.category === cat.id)
                if (!catTools.length) return null
                return (
                    <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: ci * 0.07 }}
                        style={{
                            marginBottom: '14px',
                            background: `linear-gradient(180deg, ${cat.glow} 0%, transparent 100%)`,
                            borderRadius: '20px',
                            padding: '16px',
                            border: `1px solid ${cat.color}20`,
                            borderTop: `1px solid ${cat.color}40`,
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Category title */}
                        <div style={{
                            fontSize: '10px', fontWeight: 800, color: cat.color,
                            letterSpacing: '1.5px', textTransform: 'uppercase',
                            marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px',
                        }}>
                            <div style={{ height: '1px', flex: 1, background: `${cat.color}35` }} />
                            {cat.label}
                            <div style={{ height: '1px', flex: 1, background: `${cat.color}35` }} />
                        </div>

                        {/* 3-column grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '8px',
                        }}>
                            {catTools.map((tool, i) => (
                                <ToolCard key={tool.name} tool={tool} index={i} />
                            ))}
                        </div>
                    </motion.div>
                )
            })}

            {/* ─── Antigravity Special Footer Card ───────────────── */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                style={{
                    marginTop: '6px',
                    padding: '18px 16px',
                    background: 'linear-gradient(135deg, rgba(129,140,248,0.12), rgba(187,74,255,0.08))',
                    border: '1px solid rgba(129,140,248,0.35)',
                    borderRadius: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                }}
            >
                <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    overflow: 'hidden', flexShrink: 0,
                    boxShadow: '0 6px 24px rgba(129,140,248,0.4)',
                    border: '1px solid rgba(129,140,248,0.4)',
                }}>
                    <AntigravityLogo />
                </div>
                <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#818cf8', marginBottom: '4px' }}>
                        Antigravity — Google DeepMind AI
                    </div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
                        {isEn ? 'Developed & Powered by ' : 'Geliştiren ve Destekleyen: '}
                        <span style={{ color: '#c4b5fd', fontWeight: 700 }}>Google DeepMind</span>{' '}
                        <span style={{ color: '#a5b4fc', fontWeight: 700 }}>Antigravity AI</span>,{' '}
                        <span style={{ color: '#60a5fa', fontWeight: 700 }}>Gemini</span>,{' '}
                        <span style={{ color: '#fca5a5', fontWeight: 700 }}>Groq</span>
                        {' '}&{' '}
                        <span style={{ color: '#93c5fd', fontWeight: 700 }}>Llama 3</span>
                        {' '}🚀
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
