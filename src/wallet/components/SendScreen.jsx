
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Check, Loader2, Fingerprint, AlertCircle, ChevronDown, ExternalLink, BookOpen, QrCode, X, Trash2, Plus } from 'lucide-react';
import { WALLET_CONFIG } from '../config';
import { sendEVM, sendTonFull, sendTonJetton } from '../blockchainService';


// â”€â”€ KayÄ±t Defteri (localStorage) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const BOOK_KEY = 'qai_address_book';
const loadBook = () => JSON.parse(localStorage.getItem(BOOK_KEY) || '[]');
const saveBook = (book) => localStorage.setItem(BOOK_KEY, JSON.stringify(book));

const SendScreen = ({ token: initialToken, onBack, balances, walletData, t }) => {
  const [token, setToken] = useState(initialToken || WALLET_CONFIG.TOKENS[2]);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [step, setStep] = useState('input');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');
  const [showSelector, setShowSelector] = useState(false);
  const [showBook, setShowBook] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [book, setBook] = useState(loadBook());
  const [newLabel, setNewLabel] = useState('');

  const tokenBalance = balances[token?.id] || 0;
  const feePercent = WALLET_CONFIG.TRANSFER_FEE || 0.005;
  const feeAmount = (parseFloat(amount) || 0) * feePercent;
  const totalRequired = (parseFloat(amount) || 0) + feeAmount;
  const insufficient = totalRequired > tokenBalance;

  const explorerMap = { ETH: 'https://etherscan.io/tx/', BNB: 'https://bscscan.com/tx/', opBNB: 'https://opbnbscan.com/tx/', ARB: 'https://arbiscan.io/tx/', BASE: 'https://basescan.org/tx/', MATIC: 'https://polygonscan.com/tx/', MONAD: 'https://testnet.monadexplorer.com/tx/', TON: 'https://tonviewer.com/transaction/' };
  const explorerUrl = (explorerMap[token?.networkKey] || '') + txHash;

  const saveToBook = () => {
    if (!recipient || !newLabel) return;
    const entry = { id: Date.now(), label: newLabel, address: recipient, network: token.networkKey };
    const updated = [entry, ...book];
    setBook(updated); saveBook(updated); setNewLabel('');
  };

  const deleteFromBook = (id) => {
    const updated = book.filter(e => e.id !== id);
    setBook(updated); saveBook(updated);
  };

  const handleQRScan = () => {
    if (window.Telegram?.WebApp?.showScanQrPopup) {
      window.Telegram.WebApp.showScanQrPopup({
        text: 'AlÄ±cÄ± QR kodunu tarayÄ±n'
      }, (text) => {
        if (text) {
          setRecipient(text);
          window.Telegram.WebApp.closeScanQrPopup();
        }
        return true;
      });
    } else {
      setShowQR(true);
    }
  };

  const handleRealSend = async () => {
    if (loading) return;
    setLoading(true); setStep('signing'); setError('');
    try {
      const mnemonic = walletData.mnemonic;
      const feeReceiver = WALLET_CONFIG.RECEIVERS[token.networkKey] || WALLET_CONFIG.RECEIVERS.EVM;
      const mainAmount = parseFloat(amount.toString().replace(',', '.'));
      let sig = '';

      if (token.networkKey === 'TON') {
        sig = token.isNative ? await sendTonFull(mnemonic, recipient, mainAmount, memo) : await sendTonJetton(mnemonic, recipient, mainAmount, token.contract, token.decimals || 9, feeReceiver, feeAmount);
      } else {
        // EVM
        const evmKeyMap = { BSC: 'BNB', BINANCE: 'BNB', ETHEREUM: 'ETH' };
        const normalizedKey = evmKeyMap[token.networkKey?.toUpperCase()] || token.networkKey || 'ETH';
        const rpcList = WALLET_CONFIG.RPC_NODES[normalizedKey] || WALLET_CONFIG.RPC_NODES.ETH;
        const { getEvmPrivateKey } = await import('../walletService');
        const privKey = await getEvmPrivateKey(mnemonic);
        sig = await sendEVM(privKey, recipient, mainAmount, rpcList[0], token.isNative ? null : token.contract);
      }
      setTxHash(sig?.hash || sig || '');
      setStep('success');
    } catch (err) {
      setError(err.message || 'Send failed.');
      setStep('input');
    } finally { setLoading(false); }
  };

  if (step === 'success') return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '20px', textAlign: 'center', paddingTop: '80px' }}>
      <div style={{ width: '90px', height: '90px', background: 'rgba(34,197,94,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
        <Check size={44} color="#22c55e" strokeWidth={3} />
      </div>
      <h2 style={{ fontWeight: '900', marginBottom: '12px' }}>{t ? t('send.successTitle') : 'Transaction Sent!'}</h2>
      <div style={{ background: 'var(--bg-card)', padding: '18px', borderRadius: '20px', marginBottom: '16px', border: '1px solid var(--glass-border)' }}>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{amount} {token.symbol} {t ? t('send.success_msg') : 'sent.'}</p>
        <div style={{ fontSize: '0.58rem', color: 'var(--primary)', wordBreak: 'break-all' }}>{txHash}</div>
      </div>
      {txHash && explorerUrl && (
        <a href={explorerUrl} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--primary)', fontSize: '0.78rem', marginBottom: '16px', textDecoration: 'none' }}>
          <ExternalLink size={13} /> {t ? t('send.view_explorer') : 'View on Explorer'}
        </a>
      )}
      <button onClick={onBack} style={{ width: '100%', padding: '18px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '18px', fontWeight: '900', cursor: 'pointer' }}>{t ? t('send.close') : 'CLOSE'}</button>
    </motion.div>
  );

  if (step === 'signing') return (
    <div style={{ padding: '20px', textAlign: 'center', paddingTop: '100px' }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
        style={{ width: '90px', height: '90px', border: '4px solid var(--primary)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Fingerprint size={36} color="var(--primary)" />
      </motion.div>
      <h2 style={{ fontWeight: '900', marginBottom: '10px' }}>{t ? t('send.signing_title') : 'Signing...'}</h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{t ? t('send.signing_desc') : 'Waiting for blockchain confirmation.'}</p>
    </div>
  );

  if (step === 'confirm') return (
    <motion.div initial={{ y: 300 }} animate={{ y: 0 }} style={{ padding: '18px', paddingBottom: '120px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
        <ChevronLeft size={26} onClick={() => setStep('input')} style={{ cursor: 'pointer' }} />
        <h2 style={{ margin: 0, fontWeight: '900', fontSize: '1.15rem' }}>{t ? t('send.confirm_title') : 'Confirm'}</h2>
      </div>
      <div style={{ background: 'var(--bg-card)', padding: '22px', borderRadius: '24px', border: '1px solid var(--glass-border)', marginBottom: '18px', textAlign: 'center' }}>
        <img src={token?.icon} style={{ width: '52px', height: '52px', borderRadius: '50%', marginBottom: '10px' }} alt="" />
        <div style={{ fontSize: '1.7rem', fontWeight: '900' }}>{amount} {token?.symbol}</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '6px', wordBreak: 'break-all' }}>â†’ {recipient}</div>
        {memo && <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '4px' }}>Not: {memo}</div>}
      </div>
      <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '18px', border: '1px solid var(--glass-border)', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {[
          [t ? t('send.network') : 'Network', token?.networkKey],
          [t ? t('send.fee') : 'Service Fee (0.5%)', `${feeAmount.toFixed(6)} ${token?.symbol}`],
          [t ? t('send.total') : 'Total', `${totalRequired.toFixed(6)} ${token?.symbol}`]
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>{k}</span>
            <span style={{ fontWeight: '900' }}>{v}</span>
          </div>
        ))}
      </div>
      <button onClick={handleRealSend} disabled={loading}
        style={{ width: '100%', padding: '20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '20px', fontWeight: '900', fontSize: '1.1rem', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
        {loading ? <Loader2 className="animate-spin" /> : (t ? t('send.sign_send') : 'SIGN & SEND')}
      </button>
    </motion.div>
  );

  return (
    <div style={{ padding: '18px', paddingBottom: '120px', minHeight: '100vh' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '22px' }}>
        <ChevronLeft size={26} onClick={onBack} style={{ cursor: 'pointer' }} />
        <h2 style={{ margin: 0, fontWeight: '900', fontSize: '1.15rem' }}>{token?.symbol} {t ? t('send.send_token') : 'Send'}</h2>
      </div>

      {error && (
        <div style={{ padding: '12px 14px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '13px', marginBottom: '16px', fontSize: '0.78rem', display: 'flex', gap: '8px' }}>
          <AlertCircle size={16} style={{ flexShrink: 0 }} /> {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Token SeÃ§ici */}
        <div onClick={() => setShowSelector(true)}
          style={{ background: 'var(--bg-card)', padding: '14px 16px', borderRadius: '18px', border: '1px solid var(--glass-border-bright)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={token.icon} style={{ width: '30px', height: '30px', borderRadius: '50%' }} alt={token.symbol} />
            <div>
              <div style={{ fontWeight: '900', fontSize: '0.9rem' }}>{token.symbol}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{token.networkKey}</div>
            </div>
          </div>
          <ChevronDown size={18} color="var(--text-muted)" />
        </div>

        {/* AlÄ±cÄ± Adresi + KayÄ±t Defteri + QR */}
        <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '18px', border: '1px solid var(--glass-border-bright)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: '700' }}>{t ? t('send.recipient') : 'RECIPIENT ADDRESS'}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <div onClick={() => setShowBook(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.65rem', fontWeight: '700' }}>
                <BookOpen size={13} /> {t ? t('send.address_book') : 'Address Book'}
              </div>
              <div onClick={handleQRScan} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.65rem', fontWeight: '700' }}>
                <QrCode size={13} /> {t ? t('send.scan_qr') : 'Scan QR'}
              </div>
            </div>
          </div>
          <input type="text" value={recipient} onChange={e => setRecipient(e.target.value.trim())}
            placeholder={token.networkKey === 'TON' ? 'UQ... veya EQ...' : token.networkKey === 'BTC' ? 'bc1q...' : '0x...'}
            style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', fontSize: '0.88rem', fontWeight: '600', outline: 'none' }} />
          
          {token.networkKey === 'BTC' && (
             <div style={{ marginTop: '10px', fontSize: '0.65rem', color: '#fbbf24', display: 'flex', alignItems: 'flex-start', gap: '6px', background: 'rgba(245, 158, 11, 0.05)', padding: '8px', borderRadius: '10px' }}>
               <Info size={14} style={{ flexShrink: 0, marginTop: '2px' }} /> 
               <span><b>Native SegWit DesteÄŸi:</b> Åu anki altyapÄ±da sorunsuz transfer iÃ§in lÃ¼tfen sadece <b>Native SegWit (bc1q...)</b> formatÄ±ndaki adreslere gÃ¶nderim yapÄ±n.</span>
             </div>
          )}
        </div>

        {/* TON Memo */}
        {token.networkKey === 'TON' && (
          <div style={{ background: 'var(--bg-card)', padding: '14px 16px', borderRadius: '18px', border: '1px solid var(--glass-border-bright)' }}>
            <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '6px' }}>{t ? t('send.memo') : 'MEMO (OPTIONAL)'}</div>
            <input type="text" value={memo} onChange={e => setMemo(e.target.value)} placeholder={t ? t('send.memo_placeholder') : 'Transfer note'}
              style={{ width: '100%', background: 'transparent', border: 'none', color: '#fff', fontSize: '0.88rem', outline: 'none' }} />
          </div>
        )}

        {/* Miktar */}
        <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '18px', border: insufficient ? '1px solid #ef4444' : '1px solid var(--glass-border-bright)' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', fontWeight: '700' }}>{t ? t('send.amount') : 'AMOUNT'}</span>
            <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                {['25%', '50%', '75%', 'MAX'].map(p => (
                  <button key={p} onClick={() => {
                    const factor = p === 'MAX' ? 1 : parseInt(p)/100;
                    const buffer = token.networkKey === 'TON' ? 0.05 : 0.001;
                    const val = Math.max(0, (tokenBalance * factor) - (p === 'MAX' ? buffer : 0));
                    setAmount(val.toFixed(6));
                  }} style={{ fontSize: '0.55rem', padding: '3px 7px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '6px', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 'bold' }}>{p}</button>
                ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00"
              style={{ flex: 1, background: 'transparent', border: 'none', color: '#fff', fontSize: '2.2rem', fontWeight: '900', outline: 'none' }} />
            <span style={{ fontWeight: '900', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{token.symbol}</span>
          </div>
        </div>

        <button disabled={!recipient || !amount || insufficient || parseFloat(amount) <= 0}
          onClick={() => setStep('confirm')}
          style={{ width: '100%', padding: '18px', background: (recipient && amount && !insufficient && parseFloat(amount) > 0) ? 'var(--primary)' : 'rgba(255,255,255,0.05)', color: (recipient && amount && !insufficient && parseFloat(amount) > 0) ? '#fff' : 'var(--text-muted)', borderRadius: '18px', border: 'none', fontSize: '1.05rem', fontWeight: '900', cursor: 'pointer', transition: 'all 0.2s' }}>
          {insufficient ? (t ? t('send.insufficient') : 'INSUFFICIENT BALANCE') : (t ? t('send.preview') : 'PREVIEW')}
        </button>
      </div>

      {/* Token Selector â€” position:fixed ile kayma sorunu Ã§Ã¶zÃ¼ldÃ¼ */}
      <AnimatePresence>
        {showSelector && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.88)', zIndex: 3000, display: 'flex', alignItems: 'flex-end' }}
            onClick={() => setShowSelector(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              style={{ width: '100%', maxWidth: '480px', margin: '0 auto', background: 'var(--bg-main)', borderRadius: '28px 28px 0 0', padding: '24px 18px 36px', border: '1px solid var(--glass-border-bright)', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ width: '36px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', margin: '0 auto 18px', flexShrink: 0 }} />
              <h3 style={{ fontSize: '1.05rem', fontWeight: '900', marginBottom: '16px', textAlign: 'center', flexShrink: 0 }}>{t ? t('send.select_asset') : 'Select Asset'}</h3>
              <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {WALLET_CONFIG.TOKENS.map(tk => (
                  <div key={tk.id} onClick={() => { setToken(tk); setShowSelector(false); setAmount(''); setError(''); }}
                    style={{ padding: '12px 14px', background: token.id === tk.id ? 'rgba(124,58,237,0.1)' : 'rgba(255,255,255,0.02)', borderRadius: '16px', border: token.id === tk.id ? '1px solid var(--primary)' : '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={tk.icon} style={{ width: '32px', height: '32px', borderRadius: '50%' }} alt={tk.symbol} />
                      <div>
                        <div style={{ fontWeight: '900', fontSize: '0.88rem' }}>{tk.symbol}</div>
                        <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>{tk.networkKey}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: '700', fontSize: '0.82rem' }}>{Number((balances[tk.id] || 0).toFixed(4))}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* KayÄ±t Defteri */}
        {showBook && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.88)', zIndex: 3000, display: 'flex', alignItems: 'flex-end' }}
            onClick={() => setShowBook(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              style={{ width: '100%', maxWidth: '480px', margin: '0 auto', background: 'var(--bg-main)', borderRadius: '28px 28px 0 0', padding: '24px 18px 36px', border: '1px solid var(--glass-border-bright)', maxHeight: '75vh', display: 'flex', flexDirection: 'column' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ width: '36px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', margin: '0 auto 18px', flexShrink: 0 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexShrink: 0 }}>
                <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1.05rem' }}>{t ? t('send.book_title') : 'Address Book'}</h3>
                <X size={20} onClick={() => setShowBook(false)} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
              </div>
              {/* Yeni kayÄ±t ekle */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexShrink: 0 }}>
                <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder={t ? t('send.book_label') : 'Label (e.g. Exchange)'}
                  style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '10px 12px', color: '#fff', fontSize: '0.82rem', outline: 'none' }} />
                <button onClick={saveToBook} disabled={!recipient || !newLabel}
                  style={{ padding: '10px 14px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '0.78rem', cursor: 'pointer', opacity: (!recipient || !newLabel) ? 0.5 : 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Plus size={14} /> {t ? t('send.book_save') : 'Save'}
                </button>
              </div>
              <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '7px' }}>
                {book.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{t ? t('send.book_empty') : 'No saved addresses yet'}</div>
                ) : book.map(entry => (
                  <div key={entry.id} style={{ background: 'var(--bg-card)', borderRadius: '14px', padding: '12px 14px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div onClick={() => { setRecipient(entry.address); setShowBook(false); }} style={{ flex: 1, cursor: 'pointer' }}>
                      <div style={{ fontWeight: '900', fontSize: '0.85rem' }}>{entry.label}</div>
                      <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '2px' }}>{entry.address.slice(0, 12)}...{entry.address.slice(-8)}</div>
                      <div style={{ fontSize: '0.58rem', color: 'var(--primary)', marginTop: '2px' }}>{entry.network}</div>
                    </div>
                    <Trash2 size={15} color="#ef4444" onClick={() => deleteFromBook(entry.id)} style={{ cursor: 'pointer', flexShrink: 0, marginLeft: '10px' }} />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* QR Okuma */}
        {showQR && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 3000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
            onClick={() => setShowQR(false)}>
            <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '340px', background: 'var(--bg-main)', borderRadius: '24px', padding: '24px', border: '1px solid var(--glass-border-bright)', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontWeight: '900', fontSize: '1rem' }}>{t ? t('send.qr_title') : 'Scan QR Code'}</h3>
                <X size={20} onClick={() => setShowQR(false)} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} />
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '20px', marginBottom: '16px', border: '2px dashed var(--glass-border-bright)' }}>
                <QrCode size={48} color="var(--primary)" style={{ marginBottom: '12px' }} />
                <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: 0 }}>{t ? t('send.qr_desc') : 'Browser camera permission required.'}</p>
              </div>
              <input type="text" placeholder={t ? t('send.qr_paste') : 'Or paste address here...'}
                onChange={e => { if (e.target.value) { setRecipient(e.target.value.trim()); setShowQR(false); } }}
                style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '12px 14px', color: '#fff', fontSize: '0.82rem', outline: 'none' }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SendScreen;

