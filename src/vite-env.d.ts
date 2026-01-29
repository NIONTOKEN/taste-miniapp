/// <reference types="vite/client" />

interface Window {
  Telegram?: {
    WebApp: {
      ready: () => void
      expand: () => void
      close: () => void
      platform: string
      initDataUnsafe?: any
      setHeaderColor: (color: string) => void
      setBackgroundColor: (color: string) => void
      openLink: (url: string, options?: { try_instant_view?: boolean }) => void
      openTelegramLink: (url: string) => void
      MainButton: {
        text: string
        show: () => void
        hide: () => void
        onClick: (_callback: () => void) => void
        offClick: (_callback: () => void) => void
      }
    }
  }
}
