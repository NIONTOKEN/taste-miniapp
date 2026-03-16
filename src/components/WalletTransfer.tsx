import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useTonConnectUI, useTonAddress } from '@tonconnect/ui-react'
import { Copy, QrCode, Send, ArrowDownLeft, X, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import { toNano, Address, beginCell } from '@ton/core'
import { apiService } from '../services/api'

const JETTON_ADDRESS = 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-';
const KASA_ADDRESS = 'UQAzYgt3LoveknM9riA7jpZIbwmNi65c1UUA4AGBwvbr5lnD';

export const WalletTransfer = () => {
  const { t, i18n } = useTranslation()
  const [tonConnectUI] = useTonConnectUI()
  const userAddress = useTonAddress()
  
  const [activeSubTab, setActiveSubTab] = useState<'send' | 'receive'>('send')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [tokenType, setTokenType] = useState<'TON' | 'TASTE'>('TASTE')
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'none', message: string }>({ type: 'none', message: '' })
  const [isCopied, setIsCopied] = useState(false)
  
  const [tonBalance, setTonBalance] = useState<string>('0.00')
  const [tasteBalance, setTasteBalance] = useState<string>('0')
  const [isLoading, setIsLoading] = useState(false)

  const fetchBalances = async () => {
    if (!userAddress) return
    try {
      // 1. TON Balance
      const tonRes = await fetch(`https://tonapi.io/v2/accounts/${userAddress}`)
      const tonData = await tonRes.json()
      if (tonData.balance) setTonBalance((Number(tonData.balance) / 1e9).toFixed(2))

      // 2. TASTE Balance using Service
      const bal = await apiService.getJettonBalance(userAddress, JETTON_ADDRESS)
      setTasteBalance(bal.toLocaleString())
    } catch (e) { 
      console.warn('Balance err', e) 
      setTasteBalance('0')
    }
  }

  useEffect(() => {
    if (userAddress) {
      fetchBalances()
      const inv = setInterval(fetchBalances, 20000)
      return () => clearInterval(inv)
    }
  }, [userAddress])

  const handleScanQR = () => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.showScanQrPopup) {
      tg.showScanQrPopup({
        text: i18n.language === 'tr' ? 'TON adresi taratın' : 'Scan TON address'
      }, (data: string) => {
        if (data) setRecipientAddress(data.replace('ton://transfer/', '').split('?')[0])
        tg.closeScanQrPopup()
        return true
      })
    }
  }

  const handleSend = async () => {
    if (!userAddress) return setStatus({ type: 'error', message: t('app.connect_wallet_first') })
    if (!recipientAddress || !amount || Number(amount) <= 0) return setStatus({ type: 'error', message: i18n.language === 'tr' ? 'Geçersiz miktar veya adres' : 'Invalid amount or address' })

    setIsLoading(true)
    setStatus({ type: 'none', message: '' })

    try {
      if (tokenType === 'TON') {
        const transaction = {
          validUntil: Math.floor(Date.now() / 1000) + 300,
          messages: [{ address: Address.parse(recipientAddress.trim()).toString(), amount: toNano(amount).toString() }]
        }
        await tonConnectUI.sendTransaction(transaction)
      } else {
        // TASTE (Jetton) Transfer - The Absolute Best Way
        // 1. Convert user address to RAW format to avoid any API ambiguity
        const userRaw = Address.parse(userAddress).toRawString();
        
        // 2. Fetch jetton wallet with RAW address
        const res = await fetch(`https://tonapi.io/v2/accounts/${userRaw}/jettons/${JETTON_ADDRESS}`)
        const data = await res.json()
        const userJWallet = data?.wallet_address?.address;

        if (!userJWallet) throw new Error(i18n.language === 'tr' ? 'TASTE cüzdan adresi alınamadı' : 'Could not fetch TASTE wallet')

        // 3. Create THE Standard Jetton payload
        const body = beginCell()
          .storeUint(0xf8a7ea5, 32)
          .storeUint(0, 64)
          .storeCoins(toNano(amount)) 
          .storeAddress(Address.parse(recipientAddress.trim()))
          .storeAddress(Address.parse(userAddress))
          .storeBit(false) // null custom_payload
          .storeCoins(toNano('0.05')) // forward_ton (Higher for safe simulation)
          .storeBit(false) // null forward_payload
          .endCell()

        const transaction = {
          validUntil: Math.floor(Date.now() / 1000) + 300,
          messages: [
            {
              address: Address.parse(userJWallet).toString(),
              amount: toNano('0.15').toString(), // This is the KEY: 0.15 TON for the transaction
              payload: body.toBoc().toString('base64')
            }
          ]
        }
        await tonConnectUI.sendTransaction(transaction)
      }
      setStatus({ type: 'success', message: i18n.language === 'tr' ? 'Transfer onaylandı!' : 'Transfer confirmed!' })
      setAmount(''); setRecipientAddress('')
    } catch (e: any) {
      console.error('[Send Error]', e)
      setStatus({ type: 'error', message: e.message?.includes('rejected') ? (i18n.language === 'tr' ? 'İşlem iptal edildi' : 'User rejected') : (i18n.language === 'tr' ? 'Hata: Bakiyenizi (En az 0.16 TON lazım) veya ağ hızını kontrol edin' : 'Error: Check balance (Need 0.16 TON) or network') })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="wallet-transfer">
      {/* Balances */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
         <div className="glass-panel" style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
            <div style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>TON</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--primary)' }}>{tonBalance}</div>
         </div>
         <div className="glass-panel" style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', textAlign: 'center' }}>
            <div style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>TASTE</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#22c55e' }}>{tasteBalance}</div>
         </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '15px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '12px' }}>
        <button onClick={() => setActiveSubTab('send')} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: activeSubTab === 'send' ? 'var(--gradient-gold)' : 'transparent', color: activeSubTab === 'send' ? '#000' : '#94a3b8', fontWeight: 800, fontSize: '12px', cursor: 'pointer' }}>GÖNDER</button>
        <button onClick={() => setActiveSubTab('receive')} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', background: activeSubTab === 'receive' ? 'var(--gradient-gold)' : 'transparent', color: activeSubTab === 'receive' ? '#000' : '#94a3b8', fontWeight: 800, fontSize: '12px', cursor: 'pointer' }}>AL</button>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'send' ? (
          <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Type Switcher */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '15px' }}>
               {['TASTE', 'TON'].map(t => (
                 <button key={t} onClick={() => setTokenType(t as any)} style={{ flex: 1, padding: '8px', borderRadius: '10px', border: '1px solid', borderColor: tokenType === t ? (t==='TON'?'var(--primary)':'#22c55e') : 'rgba(255,255,255,0.08)', background: tokenType === t ? 'rgba(255,255,255,0.05)' : 'transparent', color: '#fff', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>{t}</button>
               ))}
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', position: 'relative' }}>
                <input type="text" value={recipientAddress} onChange={e => setRecipientAddress(e.target.value)} placeholder="Alıcı Adresi (EQ...)" style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 40px 12px 12px', borderRadius: '12px', color: '#fff', fontSize: '12px', outline: 'none' }} />
                <button onClick={handleScanQR} style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', background: 'var(--primary)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}><QrCode size={16} color="#000" /></button>
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                 <span style={{ fontSize: '10px', color: '#94a3b8' }}>MİKTAR</span>
                 <span onClick={() => setAmount(tokenType==='TON'?tonBalance:tasteBalance.replace(/,/g,''))} style={{ fontSize: '10px', color: 'var(--primary)', cursor: 'pointer' }}>MAX: {tokenType==='TON'?tonBalance:tasteBalance}</span>
              </div>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.0" style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', color: '#fff', fontSize: '16px', fontWeight: 900, outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <button onClick={handleSend} disabled={isLoading} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: 'none', background: 'var(--gradient-gold)', color: '#000', fontWeight: 900, fontSize: '14px', cursor: 'pointer', opacity: isLoading ? 0.6 : 1 }}>
              {isLoading ? 'BEKLEYİN...' : 'TRANSFERİ BAŞLAT'}
            </button>
            
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                onClick={() => {
                  setRecipientAddress(KASA_ADDRESS)
                  setTokenType('TASTE')
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid var(--primary)',
                  background: 'rgba(245,158,11,0.05)',
                  color: 'var(--primary)',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <ArrowDownLeft size={14} /> {i18n.language === 'tr' ? 'ANA KASAYI OTOMATİK DOLDUR' : 'AUTO-FILL MAIN KASA'}
              </button>
              
              <div style={{ padding: '10px', background: 'rgba(245,158,11,0.05)', borderRadius: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                 <Info size={14} color="#f59e0b" />
                 <span style={{ fontSize: '10px', color: '#f59e0b', lineHeight: 1.4 }}>Transfer için cüzdanınızda en az 0.15 TON bulunmalıdır. Kasa işlemleri anlık merkezileştirilir.</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="r" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
            <div style={{ background: '#fff', padding: '12px', borderRadius: '16px', width: 'max-content', margin: '0 auto 15px', border: '4px solid var(--primary)' }}>
              {userAddress ? <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${userAddress}`} style={{ width: 160, height: 160 }} /> : <div style={{ height: 160, width: 160 }} />}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px', fontSize: '11px', color: '#fff', wordBreak: 'break-all', marginBottom: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>{userAddress || 'Cüzdan bağlı değil'}</div>
            <button onClick={() => { navigator.clipboard.writeText(userAddress); setIsCopied(true); setTimeout(()=>setIsCopied(false), 2000) }} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>{isCopied ? 'KOPYALANDI!' : 'ADRESİ KOPYALA'}</button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {status.type !== 'none' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} style={{ marginTop: '15px', padding: '12px', borderRadius: '10px', background: status.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: status.type === 'success' ? '#4ade80' : '#f87171', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px', border: `1px solid ${status.type==='success'?'#22c55e33':'#ef444433'}` }}>
            {status.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span style={{ flex: 1 }}>{status.message}</span>
            <X size={14} onClick={() => setStatus({ type: 'none', message: '' })} style={{ cursor: 'pointer' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
