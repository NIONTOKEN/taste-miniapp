import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import './index.css'
import App from './App';
import './i18n'
import { UserProvider } from './context/UserContext'
import { WalletProvider } from './context/WalletContext'

// Robust manifest URL for both dev and production
const MANIFEST_URL = (typeof window !== 'undefined' && window.location.origin.startsWith('https://'))
  ? `${window.location.origin}/tonconnect-manifest.json`
  : 'https://taste-miniapp.vercel.app/tonconnect-manifest.json';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TonConnectUIProvider
      manifestUrl={MANIFEST_URL}
      actionsConfiguration={{
        twaReturnUrl: 'https://t.me/taste_launch_bot/app'
      }}
    >
      <UserProvider>
        <WalletProvider>
          <App />
        </WalletProvider>
      </UserProvider>
    </TonConnectUIProvider>
  </StrictMode>,
)
