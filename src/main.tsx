import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TonConnectUIProvider } from '@tonconnect/ui-react'
import './index.css'
import App from './App';
import './i18n'
import { UserProvider } from './context/UserContext'
import { WalletProvider } from './context/WalletContext'

// Dynamic manifest URL for both dev and production
const MANIFEST_URL = `${window.location.origin}/tonconnect-manifest.json`

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
