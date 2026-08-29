// Token Logo Components — Uses real STON.fi / tonapi.io CDN images
// These are served by Tonapi infrastructure, no hotlink protection

// Real token logos sourced from STON.fi metadata API via tonapi CDN
const GRAM_IMG = "https://cache.tonapi.io/imgproxy/Je__PNZC3UaWi-NVeWaTnP1Upt0uyRcgSJXMQp4CNLM/rs:fill:200:200:1/g:no/aHR0cHM6Ly9zdGF0aWMuc3Rvbi5maS90b2tlbnMvR1JBTV9pbWFnZV9iYXNlNjQucG5n.webp"
const DOGS_IMG = "https://cache.tonapi.io/imgproxy/x4tN0dxVfAz2Q5jJbXdDsVY1PCQNZ_vFWM4ywXE0QeA/rs:fill:200:200:1/g:no/aHR0cHM6Ly9zdGF0aWMuc3Rvbi5maS90b2tlbnMvRE9HU19pbWFnZS5wbmc.webp"
const UTYA_IMG = "https://cache.tonapi.io/imgproxy/VD_rHqCETHIq9q5HoQrqOy5Q6OaetEW3VHmk_KL3DNo/rs:fill:200:200:1/g:no/aHR0cHM6Ly9zdGF0aWMuc3Rvbi5maS90b2tlbnMvVVRZQV9pbWFnZS5wbmc.webp"
const USDT_IMG = "https://cache.tonapi.io/imgproxy/T3iovM0DORK6os3QLSP90CzdA-qujmOF9HNiHfOdXqI/rs:fill:200:200:1/g:no/aHR0cHM6Ly9zdGF0aWMuc3Rvbi5maS90b2tlbnMvVVNEVF9pbWFnZS5wbmc.webp"
const TON_IMG = "https://cache.tonapi.io/imgproxy/BotlCPMqWxX6MH4RNlJNKPp-t0kIl4FBnCbfYw1eMPU/rs:fill:200:200:1/g:no/aHR0cHM6Ly9zdGF0aWMuc3Rvbi5maS90b2tlbnMvVE9OX2ltYWdlLnBuZw.webp"

interface LogoProps { size?: number }

export function LogoGRAM({ size = 34 }: LogoProps) {
  return (
    <img
      src={GRAM_IMG}
      alt="GRAM"
      width={size} height={size}
      style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
      onError={e => {
        // fallback to SVG if CDN fails
        e.currentTarget.style.display = "none"
        const svg = document.createElement("div")
        svg.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 64 64" fill="none" style="border-radius:50%;flex-shrink:0"><rect width="64" height="64" rx="32" fill="#0088CC"/><path d="M32 12L50 27L42 52H22L14 27L32 12Z" fill="none" stroke="white" strokeWidth="2" strokeLinejoin="round"/><path d="M32 18L46 29L39 48H25L18 29L32 18Z" fill="white" opacity="0.9"/><path d="M32 22L42 30L37 44H27L22 30L32 22Z" fill="#0088CC"/></svg>`
        e.currentTarget.parentNode?.appendChild(svg.firstChild as Node)
      }}
    />
  )
}

export function LogoDOGS({ size = 34 }: LogoProps) {
  return (
    <img
      src={DOGS_IMG}
      alt="DOGS"
      width={size} height={size}
      style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
      onError={e => {
        e.currentTarget.style.background = "#1a1a2e"
        e.currentTarget.src = ""
        e.currentTarget.alt = "🐕"
        e.currentTarget.style.fontSize = `${size * 0.6}px`
        e.currentTarget.style.lineHeight = `${size}px`
        e.currentTarget.style.textAlign = "center"
      }}
    />
  )
}

export function LogoUTYA({ size = 34 }: LogoProps) {
  return (
    <img
      src={UTYA_IMG}
      alt="UTYA"
      width={size} height={size}
      style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
      onError={e => {
        e.currentTarget.style.background = "#1d4ed8"
      }}
    />
  )
}

export function LogoUSDT({ size = 34 }: LogoProps) {
  return (
    <img
      src={USDT_IMG}
      alt="USDT"
      width={size} height={size}
      style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
      onError={e => {
        e.currentTarget.style.background = "#26A17B"
      }}
    />
  )
}

export function LogoTON({ size = 34 }: LogoProps) {
  return (
    <img
      src={TON_IMG}
      alt="TON"
      width={size} height={size}
      style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
      onError={e => {
        e.currentTarget.style.background = "#0088CC"
      }}
    />
  )
}

export function LogoTAI({ size = 34 }: LogoProps) {
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
