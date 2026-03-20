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
      showAlert: (message: string, callback?: () => void) => void
      showConfirm: (message: string, callback: (confirmed: boolean) => void) => void
      showPopup: (params: { title?: string; message: string; buttons?: any[] }, callback?: (id: string) => void) => void
      HapticFeedback: {
        impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
        notificationOccurred: (type: 'error' | 'success' | 'warning') => void
        selectionChanged: () => void
      }
      MainButton: {
        text: string
        show: () => void
        hide: () => void
        onClick: (_callback: () => void) => void
        offClick: (_callback: () => void) => void
      }
      CloudStorage: {
        setItem: (key: string, value: string, callback?: (error: any, stored: boolean) => void) => void
        getItem: (key: string, callback: (error: any, value: string) => void) => void
        removeItem: (key: string, callback?: (error: any, removed: boolean) => void) => void
        getKeys: (callback: (error: any, keys: string[]) => void) => void
      }
    }
  }
}
