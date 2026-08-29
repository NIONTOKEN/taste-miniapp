// Token Logo Components — inline SVG, no CDN dependency

export function LogoGRAM({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: "50%", flexShrink: 0 }}>
      <rect width="64" height="64" rx="32" fill="#0088CC"/>
      <path d="M32 12L50 27L42 52H22L14 27L32 12Z" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M32 18L46 29L39 48H25L18 29L32 18Z" fill="white" opacity="0.9"/>
      <path d="M32 22L42 30L37 44H27L22 30L32 22Z" fill="#0088CC"/>
    </svg>
  )
}

export function LogoDOGS({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: "50%", flexShrink: 0 }}>
      <rect width="64" height="64" rx="32" fill="#1a1a2e"/>
      <ellipse cx="32" cy="35" rx="18" ry="16" fill="white"/>
      <ellipse cx="16" cy="24" rx="8" ry="10" fill="white" transform="rotate(-15 16 24)"/>
      <ellipse cx="48" cy="24" rx="8" ry="10" fill="white" transform="rotate(15 48 24)"/>
      <ellipse cx="16" cy="24" rx="5" ry="7" fill="#c8a882" transform="rotate(-15 16 24)"/>
      <ellipse cx="48" cy="24" rx="5" ry="7" fill="#c8a882" transform="rotate(15 48 24)"/>
      <circle cx="25" cy="32" r="4" fill="#1a1a2e"/>
      <circle cx="39" cy="32" r="4" fill="#1a1a2e"/>
      <circle cx="26.5" cy="30.5" r="1.5" fill="white"/>
      <circle cx="40.5" cy="30.5" r="1.5" fill="white"/>
      <ellipse cx="32" cy="39" rx="5" ry="3.5" fill="#1a1a2e"/>
      <circle cx="30.5" cy="38" r="1" fill="white" opacity="0.6"/>
    </svg>
  )
}

export function LogoUTYA({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: "50%", flexShrink: 0 }}>
      <rect width="64" height="64" rx="32" fill="#1d4ed8"/>
      <ellipse cx="32" cy="42" rx="18" ry="13" fill="#FCD34D"/>
      <circle cx="38" cy="26" r="11" fill="#FCD34D"/>
      <circle cx="42" cy="23" r="3" fill="white"/>
      <circle cx="43" cy="22" r="1.5" fill="#1a1a2e"/>
      <path d="M46 27 Q52 25 51 30 Q50 33 44 31 Z" fill="#F97316"/>
      <path d="M20 38 Q24 30 30 35 Q26 40 20 38Z" fill="#FBBF24"/>
    </svg>
  )
}

export function LogoUSDT({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: "50%", flexShrink: 0 }}>
      <rect width="64" height="64" rx="32" fill="#26A17B"/>
      <rect x="14" y="16" width="36" height="7" rx="2" fill="white"/>
      <rect x="28.5" y="20" width="7" height="28" rx="2" fill="white"/>
      <rect x="18" y="36" width="28" height="4" rx="2" fill="white" opacity="0.9"/>
    </svg>
  )
}

export function LogoTON({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: "50%", flexShrink: 0 }}>
      <rect width="64" height="64" rx="32" fill="#0088CC"/>
      <path d="M15 24H49L40 48H24L15 24Z" fill="white"/>
      <path d="M15 24L32 10L49 24" fill="white"/>
      <path d="M32 24L38 48H26L32 24Z" fill="#0088CC" opacity="0.3"/>
    </svg>
  )
}

export function LogoTAI({ size = 34 }: { size?: number }) {
  return (
    <img
      src="/logo.jpg"
      alt="TAI"
      width={size}
      height={size}
      style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
    />
  )
}
