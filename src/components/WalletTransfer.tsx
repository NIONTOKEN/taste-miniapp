import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useTonConnectUI } from '@tonconnect/ui-react'
import { QrCode, X, CheckCircle2, AlertCircle, Info, ExternalLink, MessageSquare, ChevronDown } from 'lucide-react'
import { toNano, Address, beginCell } from '@ton/core'
import { useWallet } from '../context/WalletContext'
import { internalWalletService } from '../services/internalWallet'

const KASA_ADDRESS = 'UQAzYgt3LoveknM9riA7jpZIbwmNi65c1UUA4AGBwvbr5lnD';
const SERVICE_FEE = '0.05';

export const WalletTransfer = () => {
  const { t, i18n } = useTranslation()
  const { 
    walletType, 
    activeAddress, 
    balances, 
    refreshBalances 
  } = useWallet();

  const [tonConnectUI] = useTonConnectUI()
  
  const [activeSubTab, setActiveSubTab] = useState<'send' | 'receive' | 'buy' | 'sell'>('send')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [amount, setAmount] = useState('')
  const [memo, setMemo] = useState('')
  const [showTokenList, setShowTokenList] = useState(false)
  
  const [selectedToken, setSelectedToken] = useState<{ symbol: string, address: string, decimals: number, balance: string }>({
    symbol: 'TASTE',
    address: 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-',
    decimals: 9,
    balance: '0'
  })

  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'none', message: string }>({ type: 'none', message: '' })
  const [isCopied, setIsCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const isTonSelected = selectedToken.symbol === 'TON';

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
    if (!activeAddress) return setStatus({ type: 'error', message: t('app.connect_wallet_first') })
    
    if (!recipientAddress) return setStatus({ type: 'error', message: i18n.language === 'tr' ? 'Lütfen alıcı adresi girin' : 'Please enter recipient address' })
    if (!amount || Number(amount) <= 0) return setStatus({ type: 'error', message: i18n.language === 'tr' ? 'Geçersiz miktar' : 'Invalid amount' })

    const numAmount = Number(amount);
    const tonBal = Number(balances.ton);
    const currentTokenBal = Number(selectedToken.balance.replace(/,/g, ''));

    if (isTonSelected) {
        if (numAmount < 0.05) return setStatus({ type: 'error', message: i18n.language === 'tr' ? 'Minimum gönderim 0.05 TON' : 'Min send 0.05 TON' })
        if (numAmount + Number(SERVICE_FEE) > tonBal) return setStatus({ type: 'error', message: i18n.language === 'tr' ? 'Yetersiz bakiye (Hizmet bedeli dahil)' : 'Insufficient balance (Incl. fee)' })
    } else {
        if (numAmount <= 0) return setStatus({ type: 'error', message: i18n.language === 'tr' ? 'Geçersiz miktar' : 'Invalid amount' })
        if (tonBal < Number(SERVICE_FEE) + 0.1) return setStatus({ type: 'error', message: i18n.language === 'tr' ? 'İşlem için yeterli TON yok (Komisyon için)' : 'Insufficient TON (For commission)' })
        if (numAmount > currentTokenBal) return setStatus({ type: 'error', message: i18n.language === 'tr' ? `Yetersiz ${selectedToken.symbol} bakiyesi!` : `Insufficient ${selectedToken.symbol} balance!` })
    }

    setIsLoading(true)
    setStatus({ type: 'none', message: '' })

    try {
      if (walletType === 'internal') {
        if (isTonSelected) {
          await internalWalletService.sendTon(recipientAddress.trim(), amount, memo);
        } else {
          await internalWalletService.sendTaste(recipientAddress.trim(), amount, selectedToken.address, memo);
        }
      } else {
        let payload = undefined;
        if (memo) {
            payload = beginCell().storeUint(0, 32).storeStringTail(memo).endCell().toBoc().toString('base64');
        }

        if (isTonSelected) {
          const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 300,
            messages: [
                { 
                    address: Address.parse(recipientAddress.trim()).toString(), 
                    amount: toNano(amount).toString(),
                    payload: payload
                },
                {
                    address: Address.parse(KASA_ADDRESS).toString(),
                    amount: toNano(SERVICE_FEE).toString()
                }
            ]
          }
          await tonConnectUI.sendTransaction(transaction)
        } else {
          const userRaw = Address.parse(activeAddress).toRawString();
          const res = await fetch(`https://tonapi.io/v2/accounts/${userRaw}/jettons/${selectedToken.address}`)
          const data = await res.json()
          const userJWallet = data?.wallet_address?.address;

          if (!userJWallet) throw new Error(i18n.language === 'tr' ? 'Jetton cüzdan adresi alınamadı' : 'Could not fetch jetton wallet')

          let forwardPayload = undefined;
          if (memo) {
              forwardPayload = beginCell().storeUint(0, 32).storeStringTail(memo).endCell();
          }

          const bodyBuilder = beginCell()
            .storeUint(0xf8a7ea5, 32)
            .storeUint(0, 64)
            .storeCoins(toNano(amount)) 
            .storeAddress(Address.parse(recipientAddress.trim()))
            .storeAddress(Address.parse(activeAddress))
            .storeBit(false)
            .storeCoins(toNano('0.05'))
            .storeBit(!!forwardPayload);
            
          if (forwardPayload) {
              bodyBuilder.storeRef(forwardPayload);
          }
          
          const body = bodyBuilder.endCell();

          const transaction = {
            validUntil: Math.floor(Date.now() / 1000) + 300,
            messages: [
              {
                address: Address.parse(userJWallet).toString(),
                amount: toNano('0.15').toString(),
                payload: body.toBoc().toString('base64')
              },
              {
                address: Address.parse(KASA_ADDRESS).toString(),
                amount: toNano(SERVICE_FEE).toString()
              }
            ]
          }
          await tonConnectUI.sendTransaction(transaction)
        }
      }

      setStatus({ type: 'success', message: i18n.language === 'tr' ? 'Transfer onaylandı! İşlem blokzincire gönderildi.' : 'Transfer confirmed! Transaction sent to blockchain.' })
      setAmount(''); 
      setRecipientAddress('');
      setMemo('');
      setTimeout(refreshBalances, 5000); 
    } catch (e: any) {
      console.error('[Send Error]', e)
      setStatus({ type: 'error', message: e.message?.includes('rejected') ? (i18n.language === 'tr' ? 'İşlem iptal edildi' : 'User rejected') : (i18n.language === 'tr' ? `Hata: ${e.message}` : `Error: ${e.message}`) })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="wallet-transfer">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
         <div className="glass-panel" style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', textAlign: 'center', border: walletType === 'internal' ? '1px solid rgba(245,159,11,0.2)' : 'none' }}>
            <div style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>TON</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--primary)' }}>{balances.ton}</div>
         </div>
         <div className="glass-panel" style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', textAlign: 'center', border: walletType === 'internal' ? '1px solid rgba(245,159,11,0.2)' : 'none' }}>
            <div style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '4px' }}>TASTE</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#22c55e' }}>{balances.taste}</div>
         </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '15px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '12px' }}>
        <button onClick={() => setActiveSubTab('send')} style={{ flex: 1, padding: '10px 4px', borderRadius: '10px', border: 'none', background: activeSubTab === 'send' ? 'var(--gradient-gold)' : 'transparent', color: activeSubTab === 'send' ? '#000' : '#94a3b8', fontWeight: 800, fontSize: '11px', cursor: 'pointer' }}>GÖNDER</button>
        <button onClick={() => setActiveSubTab('receive')} style={{ flex: 1, padding: '10px 4px', borderRadius: '10px', border: 'none', background: activeSubTab === 'receive' ? 'var(--gradient-gold)' : 'transparent', color: activeSubTab === 'receive' ? '#000' : '#94a3b8', fontWeight: 800, fontSize: '11px', cursor: 'pointer' }}>AL</button>
        <button onClick={() => setActiveSubTab('buy')} style={{ flex: 1, padding: '10px 4px', borderRadius: '10px', border: 'none', background: activeSubTab === 'buy' ? 'linear-gradient(135deg, #10b981, #047857)' : 'transparent', color: activeSubTab === 'buy' ? '#fff' : '#10b981', fontWeight: 800, fontSize: '11px', cursor: 'pointer' }}>SATIN AL</button>
        <button onClick={() => setActiveSubTab('sell')} style={{ flex: 1, padding: '10px 4px', borderRadius: '10px', border: 'none', background: activeSubTab === 'sell' ? 'linear-gradient(135deg, #ef4444, #b91c1c)' : 'transparent', color: activeSubTab === 'sell' ? '#fff' : '#ef4444', fontWeight: 800, fontSize: '11px', cursor: 'pointer' }}>SAT</button>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'send' ? (
          <motion.div key="s" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            
            <div style={{ position: 'relative', marginBottom: '15px' }}>
                <button 
                  onClick={() => setShowTokenList(!showTokenList)}
                  style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: isTonSelected ? 'var(--primary)' : '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 900, color: '#000' }}>
                        {selectedToken.symbol[0]}
                    </div>
                    <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '13px', fontWeight: 800 }}>{selectedToken.symbol}</div>
                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>Bakiye: {selectedToken.balance}</div>
                    </div>
                  </div>
                  <ChevronDown size={18} color="#94a3b8" />
                </button>

                <AnimatePresence>
                    {showTokenList && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                          style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#1a1d2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', marginTop: '6px', zIndex: 100, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                            <div 
                              onClick={() => { setSelectedToken({ symbol: 'TON', address: '', decimals: 9, balance: balances.ton }); setShowTokenList(false); }}
                              style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ fontWeight: 700 }}>💎 TON</span>
                                <span style={{ color: '#94a3b8' }}>{balances.ton}</span>
                            </div>
                            {balances.jettons.map(j => (
                                <div 
                                  key={j.address}
                                  onClick={() => { setSelectedToken({ symbol: j.symbol, address: j.address, decimals: j.decimals, balance: j.balance }); setShowTokenList(false); }}
                                  style={{ padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {j.image ? <img src={j.image} style={{ width: 20, height: 20, borderRadius: '50%' }} /> : <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#22c55e' }} />}
                                        <span style={{ fontWeight: 700 }}>{j.symbol}</span>
                                    </div>
                                    <span style={{ color: '#94a3b8' }}>{j.balance}</span>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', position: 'relative' }}>
                <input type="text" value={recipientAddress} onChange={e => setRecipientAddress(e.target.value)} placeholder={i18n.language === 'tr' ? 'Alıcı Adresi (EQ...)' : 'Recipient Address (EQ...)'} style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 40px 12px 12px', borderRadius: '12px', color: '#fff', fontSize: '12px', outline: 'none' }} />
                <button onClick={handleScanQR} style={{ position: 'absolute', right: '6px', top: '50%', transform: 'translateY(-50%)', background: 'var(--primary)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer' }}><QrCode size={16} color="#000" /></button>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                 <span style={{ fontSize: '10px', color: '#94a3b8' }}>{i18n.language === 'tr' ? 'MİKTAR' : 'AMOUNT'}</span>
                 <span onClick={() => setAmount(selectedToken.balance.replace(/,/g,''))} style={{ fontSize: '10px', color: 'var(--primary)', cursor: 'pointer' }}>MAX: {selectedToken.balance}</span>
              </div>
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.0" style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', color: '#fff', fontSize: '16px', fontWeight: 900, outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                 <MessageSquare size={12} color="#94a3b8" />
                 <span style={{ fontSize: '10px', color: '#94a3b8' }}>{i18n.language === 'tr' ? 'MEMO (OPSİYONEL)' : 'MEMO (OPTIONAL)'}</span>
              </div>
              <input type="text" value={memo} onChange={e => setMemo(e.target.value)} placeholder={i18n.language === 'tr' ? 'Açıklama girin...' : 'Enter memo...'} style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 12px', borderRadius: '12px', color: '#fff', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} />
            </div>

            <button onClick={handleSend} disabled={isLoading || !activeAddress} style={{ width: '100%', padding: '15px', borderRadius: '12px', border: 'none', background: 'var(--gradient-gold)', color: '#000', fontWeight: 900, fontSize: '14px', cursor: 'pointer', opacity: (isLoading || !activeAddress) ? 0.6 : 1 }}>
              {isLoading ? (i18n.language === 'tr' ? 'İŞLEM YAPILIYOR...' : 'PROCESSING...') : (activeAddress ? (i18n.language === 'tr' ? `GÖNDER: ${selectedToken.symbol}` : `SEND: ${selectedToken.symbol}`) : (i18n.language === 'tr' ? 'CÜZDAN BAĞLAYIN' : 'CONNECT WALLET'))}
            </button>
            
            <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                 <Info size={14} color="#94a3b8" />
                 <span style={{ fontSize: '10px', color: '#94a3b8', lineHeight: 1.4 }}>
                    {i18n.language === 'tr' 
                        ? 'Tüm transferlerde standart servis ücreti uygulanır. İşlemler anlıktır.' 
                        : 'Standard service fee applies to all transfers. Transactions are instant.'}
                 </span>
              </div>
            </div>
          </motion.div>
        ) : activeSubTab === 'receive' ? (
          <motion.div key="r" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
            <div style={{ background: '#fff', padding: '12px', borderRadius: '16px', width: 'max-content', margin: '0 auto 15px', border: '4px solid var(--primary)' }}>
              {activeAddress ? <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${activeAddress}`} style={{ width: 160, height: 160 }} /> : <div style={{ height: 160, width: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>Cüzdan Seçin</div>}
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '10px', fontSize: '11px', color: '#fff', wordBreak: 'break-all', marginBottom: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>{activeAddress || 'Cüzdan bağlı değil'}</div>
            <button disabled={!activeAddress} onClick={() => { if(activeAddress) { navigator.clipboard.writeText(activeAddress); setIsCopied(true); setTimeout(()=>setIsCopied(false), 2000) } }} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer', opacity: activeAddress ? 1 : 0.5 }}>{isCopied ? 'KOPYALANDI!' : 'ADRESİ KOPYALA'}</button>
          </motion.div>
        ) : activeSubTab === 'buy' ? (
          <motion.div key="buy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '15px' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>⚡</div>
              <h4 style={{ margin: '0 0 10px', fontSize: '16px', color: '#fff', fontWeight: 900 }}>TON {'->'} TASTE AL</h4>
              <p style={{ fontSize: '12px', color: '#a7f3d0', lineHeight: 1.5, marginBottom: '20px' }}>
                Cüzdanınızdaki TON'lar ile doğrudan piyasa fiyatından anında TASTE satın almak için STON.fi kullanabilirsiniz.
              </p>
              
              <button 
                onClick={() => {
                  const url = 'https://app.tonkeeper.com/dapp/https%3A%2F%2Fapp.ston.fi%2Fswap%3FchartVisible%3Dfalse%26ft%3DTON%26tt%3DEQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-';
                  if (window.Telegram?.WebApp) window.Telegram.WebApp.openLink(url);
                  else window.open(url, '_blank');
                }}
                style={{ width: '100%', padding: '16px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #10b981, #047857)', color: '#fff', fontWeight: 900, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}>
                STON.fi Üzerinden SATIN AL
                <ExternalLink size={16} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="sell" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.3)', marginBottom: '15px' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔄</div>
              <h4 style={{ margin: '0 0 10px', fontSize: '16px', color: '#fff', fontWeight: 900 }}>TASTE {'->'} TON SAT</h4>
              <p style={{ fontSize: '12px', color: '#fca5a5', lineHeight: 1.5, marginBottom: '20px' }}>
                TASTE tokenlarınızı piyasa fiyatından hemen satmak için resmi Web3 ortağımız <strong>STON.fi</strong> üzerinden swap yapabilirsiniz.
              </p>
              
              <button 
                onClick={() => {
                  const url = 'https://app.tonkeeper.com/dapp/https%3A%2F%2Fapp.ston.fi%2Fswap%3FchartVisible%3Dfalse%26ft%3DEQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-%26tt%3DTON';
                  if (window.Telegram?.WebApp) window.Telegram.WebApp.openLink(url);
                  else window.open(url, '_blank');
                }}
                style={{ width: '100%', padding: '16px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #ef4444, #b91c1c)', color: '#fff', fontWeight: 900, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)' }}>
                STON.fi Üzerinden SAT
                <ExternalLink size={16} />
              </button>
            </div>
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
