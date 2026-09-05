import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, EyeOff, ArrowDownCircle, ArrowUpCircle, RefreshCw, History,
  Copy, Check, Search, Plus, Download, Link2, X
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { internalWalletService } from '../services/internalWallet';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { LogoGRAM, LogoUSDT, LogoDOGS, LogoUTYA, LogoTAI } from './TokenLogos';
import { toNano, Address, beginCell } from '@ton/core';

interface WalletTransferProps {
  onNavigateToBorsa?: () => void;
}

export const WalletTransfer: React.FC<WalletTransferProps> = ({ onNavigateToBorsa }) => {
  const { walletType, activeAddress, balances, refreshBalances } = useWallet();
  const [tonConnectUI] = useTonConnectUI();

  const [showBalance, setShowBalance] = useState(true);
  const [activeActionModal, setActiveActionModal] = useState<'none' | 'deposit' | 'withdraw' | 'history' | 'manage'>('none');
  const [copied, setCopied] = useState(false);
  const [searchToken, setSearchToken] = useState('');
  const [tokenFilter, setTokenFilter] = useState<'all' | 'balance'>('all');

  const [recipient, setRecipient] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sendMemo, setSendMemo] = useState('');
  const [selectedTokenToSend, setSelectedTokenToSend] = useState<'GRAM' | 'TAI'>('GRAM');
  const [isSending, setIsSending] = useState(false);
  const [sendFeedback, setSendFeedback] = useState<{ text: string; error: boolean } | null>(null);

  const [walletManageMode, setWalletManageMode] = useState<'menu' | 'create' | 'import' | 'backup'>('menu');
  const [mnemonicCount, setMnemonicCount] = useState<12 | 24>(24);
  const [generatedWords, setGeneratedWords] = useState<string[]>([]);
  const [importInput, setImportInput] = useState('');
  const [importError, setImportError] = useState('');

  const [historyList, setHistoryList] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const gramBal = parseFloat(balances.ton || '0');
  const taiBal = parseFloat(balances.taste || '0');
  const gramUsd = gramBal * 5.32;
  const taiUsd = taiBal * 0.00224;
  const totalUsd = gramUsd + taiUsd;

  const fetchTxHistory = async () => {
    if (!activeAddress) return;
    setLoadingHistory(true);
    try {
      const raw = Address.parse(activeAddress).toRawString();
      const res = await fetch(`https://tonapi.io/v2/accounts/${raw}/events?limit=10`);
      if (res.ok) {
        const data = await res.json();
        setHistoryList(data.events || []);
      }
    } catch (e) {
      console.warn('History fetch error', e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateNewWallet = async () => {
    try {
      const info = await internalWalletService.createWallet(mnemonicCount);
      setGeneratedWords(info.mnemonic);
      setWalletManageMode('backup');
      refreshBalances();
    } catch (e: any) {
      alert('Hata: ' + e.message);
    }
  };

  const handleImportWallet = async () => {
    try {
      setImportError('');
      await internalWalletService.importWallet(importInput);
      setWalletManageMode('menu');
      refreshBalances();
      setTimeout(() => setActiveActionModal('none'), 1200);
    } catch (e: any) {
      setImportError(e.message || 'Geçersiz tohum kelimeleri');
    }
  };

  const handleSendTransaction = async () => {
    if (!activeAddress) {
      tonConnectUI.openModal();
      return;
    }
    if (!recipient.trim() || !sendAmount || parseFloat(sendAmount) <= 0) {
      setSendFeedback({ text: 'Lütfen geçerli adres ve miktar girin', error: true });
      return;
    }

    setIsSending(true);
    setSendFeedback(null);

    try {
      if (walletType === 'internal') {
        if (selectedTokenToSend === 'GRAM') {
          await internalWalletService.sendTon(recipient.trim(), sendAmount, sendMemo);
        } else {
          await internalWalletService.sendTaste(recipient.trim(), sendAmount, 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-', sendMemo);
        }
      } else {
        let payload = undefined;
        if (sendMemo) {
          payload = beginCell().storeUint(0, 32).storeStringTail(sendMemo).endCell().toBoc().toString('base64');
        }

        if (selectedTokenToSend === 'GRAM') {
          await tonConnectUI.sendTransaction({
            validUntil: Math.floor(Date.now() / 1000) + 300,
            messages: [{
              address: Address.parse(recipient.trim()).toString(),
              amount: toNano(sendAmount).toString(),
              payload: payload
            }]
          });
        } else {
          const userRaw = Address.parse(activeAddress).toRawString();
          const res = await fetch(`https://tonapi.io/v2/accounts/${userRaw}/jettons/EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-`);
          const data = await res.json();
          const userJWallet = data?.wallet_address?.address;
          if (!userJWallet) throw new Error('Jetton cüzdan adresi alınamadı');

          const body = beginCell()
            .storeUint(0xf8a7ea5, 32)
            .storeUint(0, 64)
            .storeCoins(toNano(sendAmount))
            .storeAddress(Address.parse(recipient.trim()))
            .storeAddress(Address.parse(activeAddress))
            .storeBit(false)
            .storeCoins(toNano('0.05'))
            .storeBit(false)
            .endCell();

          await tonConnectUI.sendTransaction({
            validUntil: Math.floor(Date.now() / 1000) + 300,
            messages: [{
              address: Address.parse(userJWallet).toString(),
              amount: toNano('0.1').toString(),
              payload: body.toBoc().toString('base64')
            }]
          });
        }
      }

      setSendFeedback({ text: 'Transfer başarıyla gönderildi!', error: false });
      setSendAmount('');
      setRecipient('');
      setSendMemo('');
      setTimeout(refreshBalances, 4000);
    } catch (e: any) {
      setSendFeedback({ text: e.message || 'Gönderim hatası', error: true });
    } finally {
      setIsSending(false);
    }
  };

  const tokenAssets = [
    {
      id: 'TAI',
      name: 'Taste AI',
      symbol: 'TAI',
      balance: taiBal.toLocaleString(),
      usdValue: taiUsd.toFixed(2),
      price: '$0.00224',
      Logo: LogoTAI
    },
    {
      id: 'GRAM',
      name: 'Gram (TON)',
      symbol: 'GRAM',
      balance: gramBal.toFixed(4),
      usdValue: gramUsd.toFixed(2),
      price: '$5.32',
      Logo: LogoGRAM
    },
    {
      id: 'USDT',
      name: 'Tether USD',
      symbol: 'USDT',
      balance: '0.00',
      usdValue: '0.00',
      price: '$1.00',
      Logo: LogoUSDT
    },
    {
      id: 'DOGS',
      name: 'Dogs Token',
      symbol: 'DOGS',
      balance: '0',
      usdValue: '0.00',
      price: '$0.0006',
      Logo: LogoDOGS
    },
    {
      id: 'UTYA',
      name: 'Utya Duck',
      symbol: 'UTYA',
      balance: '0',
      usdValue: '0.00',
      price: '$0.004',
      Logo: LogoUTYA
    }
  ];

  const filteredAssets = tokenAssets.filter(tok => {
    const matchesSearch = tok.name.toLowerCase().includes(searchToken.toLowerCase()) ||
                          tok.symbol.toLowerCase().includes(searchToken.toLowerCase());
    if (!matchesSearch) return false;
    if (tokenFilter === 'balance') return parseFloat(tok.balance.replace(/,/g, '')) > 0;
    return true;
  });

  return (
    <div style={{ padding: '0 0 30px' }}>
      {/* 1. Toplam Varlık Değeri Kartı */}
      <div style={{
        background: 'linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 60%, #0f172a 100%)',
        borderRadius: '24px',
        padding: '20px',
        marginBottom: '16px',
        boxShadow: '0 12px 32px rgba(29, 78, 216, 0.3)',
        border: '1px solid rgba(96, 165, 250, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#bfdbfe', fontSize: '12px', fontWeight: 700 }}>
            <span>Toplam Varlık Değeri</span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              style={{ background: 'none', border: 'none', color: '#bfdbfe', cursor: 'pointer', padding: 0 }}
            >
              {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>

          <div style={{
            fontSize: '11px',
            background: 'rgba(255,255,255,0.12)',
            padding: '2px 8px',
            borderRadius: '10px',
            color: '#fff',
            fontWeight: 800
          }}>
            USD ▾
          </div>
        </div>

        <div style={{ fontSize: '32px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px', marginBottom: '16px' }}>
          {showBalance ? `$${totalUsd.toFixed(2)}` : '••••••••'}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(8px)',
            borderRadius: '14px',
            padding: '10px 12px'
          }}>
            <div style={{ fontSize: '10px', color: '#93c5fd', fontWeight: 700 }}>GRAM (TON)</div>
            <div style={{ fontSize: '15px', fontWeight: 900, color: '#fff', marginTop: '2px' }}>
              {showBalance ? `${gramBal.toFixed(3)} GRAM` : '••••'}
            </div>
            <div style={{ fontSize: '10px', color: '#bfdbfe' }}>≈ ${gramUsd.toFixed(2)}</div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(8px)',
            borderRadius: '14px',
            padding: '10px 12px'
          }}>
            <div style={{ fontSize: '10px', color: '#fcd34d', fontWeight: 700 }}>TASTE AI</div>
            <div style={{ fontSize: '15px', fontWeight: 900, color: '#fff', marginTop: '2px' }}>
              {showBalance ? `${taiBal.toLocaleString()} TAI` : '••••'}
            </div>
            <div style={{ fontSize: '10px', color: '#fef08a' }}>≈ ${taiUsd.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* 2. Dörtlü Hızlı İşlem Butonları */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        marginBottom: '20px'
      }}>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveActionModal('deposit')}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '14px 6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowDownCircle size={24} color="#fff" />
          </div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#f8fafc' }}>Yatır</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveActionModal('withdraw')}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '14px 6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowUpCircle size={24} color="#fff" />
          </div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#f8fafc' }}>Çek</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onNavigateToBorsa && onNavigateToBorsa()}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '14px 6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RefreshCw size={22} color="#fff" />
          </div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#f8fafc' }}>Dönüştür</span>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setActiveActionModal('history');
            fetchTxHistory();
          }}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '14px 6px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <History size={22} color="#fff" />
          </div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#f8fafc' }}>Geçmiş</span>
        </motion.button>
      </div>

      {/* 3. Cüzdan Yönetimi Barı */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(37,99,235,0.08) 100%)',
        border: '1px solid rgba(245,158,11,0.25)',
        borderRadius: '18px',
        padding: '14px 16px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '13px', fontWeight: 900, color: '#fff' }}>
              {walletType === 'internal' ? '🔐 Taste Yerleşik Cüzdan' : '🔗 TonConnect Cüzdanı'}
            </span>
            <span style={{ fontSize: '9px', background: '#22c55e', color: '#000', padding: '1px 5px', borderRadius: '4px', fontWeight: 900 }}>AKTİF</span>
          </div>
          <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px' }}>
            {activeAddress ? `${activeAddress.slice(0, 8)}...${activeAddress.slice(-6)}` : 'Cüzdan bağlı değil'}
          </div>
        </div>

        <button
          onClick={() => {
            setWalletManageMode('menu');
            setActiveActionModal('manage');
          }}
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: '#000',
            border: 'none',
            borderRadius: '10px',
            padding: '8px 12px',
            fontSize: '11px',
            fontWeight: 900,
            cursor: 'pointer'
          }}
        >
          Cüzdan Yönetimi ⚙️
        </button>
      </div>

      {/* 4. Varlık Arama & Filtreler */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '10px 14px',
        marginBottom: '12px',
        gap: '8px'
      }}>
        <Search size={16} color="#94a3b8" />
        <input
          type="text"
          placeholder="Varlık ara..."
          value={searchToken}
          onChange={(e) => setSearchToken(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#fff',
            fontSize: '12px',
            width: '100%'
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        <button
          onClick={() => setTokenFilter('all')}
          style={{
            padding: '6px 14px',
            borderRadius: '16px',
            border: tokenFilter === 'all' ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.08)',
            background: tokenFilter === 'all' ? 'rgba(59,130,246,0.15)' : 'transparent',
            color: tokenFilter === 'all' ? '#60a5fa' : '#94a3b8',
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          Tümü
        </button>
        <button
          onClick={() => setTokenFilter('balance')}
          style={{
            padding: '6px 14px',
            borderRadius: '16px',
            border: tokenFilter === 'balance' ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.08)',
            background: tokenFilter === 'balance' ? 'rgba(59,130,246,0.15)' : 'transparent',
            color: tokenFilter === 'balance' ? '#60a5fa' : '#94a3b8',
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer'
          }}
        >
          Bakiyesi Olanlar
        </button>
      </div>

      {/* 5. Coin Listesi */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {filteredAssets.map((asset) => (
          <div
            key={asset.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <asset.Logo size={32} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#fff' }}>{asset.symbol}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>{asset.name}</div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: 900, color: '#fff' }}>
                {showBalance ? asset.balance : '••••'}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                {showBalance ? `≈ $${asset.usdValue}` : '••••'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODALLAR */}
      <AnimatePresence>
        {activeActionModal !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center'
            }}
          >
            <motion.div
              initial={{ y: 300 }}
              animate={{ y: 0 }}
              exit={{ y: 300 }}
              style={{
                width: '100%',
                maxWidth: '480px',
                background: '#0f172a',
                borderTopLeftRadius: '24px',
                borderTopRightRadius: '24px',
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '24px',
                maxHeight: '85vh',
                overflowY: 'auto'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#fff' }}>
                  {activeActionModal === 'deposit' && '📥 Varlık Yatır (Al)'}
                  {activeActionModal === 'withdraw' && '📤 Varlık Çek (Gönder)'}
                  {activeActionModal === 'history' && '📜 İşlem Geçmişi'}
                  {activeActionModal === 'manage' && '🔐 Cüzdan Yönetimi'}
                </h3>
                <button
                  onClick={() => setActiveActionModal('none')}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Yatır Modalı */}
              {activeActionModal === 'deposit' && (
                <div style={{ textAlign: 'center' }}>
                  <div style={{ background: '#fff', padding: '12px', borderRadius: '16px', width: 'max-content', margin: '0 auto 16px', border: '3px solid #3b82f6' }}>
                    {activeAddress ? (
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${activeAddress}`}
                        style={{ width: 180, height: 180 }}
                        alt="QR Code"
                      />
                    ) : (
                      <div style={{ width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000' }}>Cüzdan Yok</div>
                    )}
                  </div>

                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px' }}>CÜZDAN ADRESİNİZ</div>
                  <div style={{
                    background: 'rgba(255,255,255,0.05)',
                    padding: '12px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    color: '#fff',
                    wordBreak: 'break-all',
                    marginBottom: '14px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    {activeAddress || 'Bağlı cüzdan bulunamadı'}
                  </div>

                  <button
                    onClick={() => activeAddress && copyToClipboard(activeAddress)}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #10b981, #047857)',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 900,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? 'ADRES KOPYALANDI' : 'ADRESİ KOPYALA'}
                  </button>
                </div>
              )}

              {/* Çek Modalı */}
              {activeActionModal === 'withdraw' && (
                <div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                    <button
                      onClick={() => setSelectedTokenToSend('GRAM')}
                      style={{
                        flex: 1,
                        padding: '10px 0',
                        borderRadius: '10px',
                        border: selectedTokenToSend === 'GRAM' ? '2px solid #3b82f6' : '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.03)',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      GRAM (TON)
                    </button>
                    <button
                      onClick={() => setSelectedTokenToSend('TAI')}
                      style={{
                        flex: 1,
                        padding: '10px 0',
                        borderRadius: '10px',
                        border: selectedTokenToSend === 'TAI' ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.03)',
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      TASTE AI
                    </button>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>ALICI TON ADRESİ</div>
                    <input
                      type="text"
                      placeholder="UQ... veya EQ..."
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        padding: '12px',
                        color: '#fff',
                        fontSize: '12px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>
                      <span>MİKTAR</span>
                      <span
                        onClick={() => setSendAmount(selectedTokenToSend === 'GRAM' ? balances.ton : balances.taste)}
                        style={{ color: '#38bdf8', cursor: 'pointer' }}
                      >
                        MAX: {selectedTokenToSend === 'GRAM' ? balances.ton : balances.taste}
                      </span>
                    </div>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        padding: '12px',
                        color: '#fff',
                        fontSize: '15px',
                        fontWeight: 900,
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  {/* Memo Alanı */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>MEMO (AÇIKLAMA - OPSİYONEL)</div>
                    <input
                      type="text"
                      placeholder="İşlem notu / memo"
                      value={sendMemo}
                      onChange={(e) => setSendMemo(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '10px',
                        padding: '10px',
                        color: '#fff',
                        fontSize: '12px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <button
                    onClick={handleSendTransaction}
                    disabled={isSending}
                    style={{
                      width: '100%',
                      padding: '14px',
                      borderRadius: '12px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 900,
                      cursor: 'pointer'
                    }}
                  >
                    {isSending ? 'İşleniyor...' : 'GÖNDERİMİ ONAYLA'}
                  </button>

                  {sendFeedback && (
                    <div style={{
                      marginTop: '10px',
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: sendFeedback.error ? '#f87171' : '#4ade80',
                      background: sendFeedback.error ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)'
                    }}>
                      {sendFeedback.text}
                    </div>
                  )}
                </div>
              )}

              {/* Geçmiş Modalı */}
              {activeActionModal === 'history' && (
                <div>
                  {loadingHistory ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8' }}>İşlemler yükleniyor...</div>
                  ) : historyList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>Henüz bir işlem geçmişi bulunmuyor.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {historyList.map((tx: any, idx: number) => (
                        <div
                          key={idx}
                          style={{
                            padding: '10px 12px',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '10px',
                            border: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: 800, color: '#fff' }}>
                              {tx.actions?.[0]?.type || 'İşlem'}
                            </div>
                            <div style={{ fontSize: '10px', color: '#64748b' }}>
                              {new Date(tx.timestamp * 1000).toLocaleDateString()}
                            </div>
                          </div>
                          <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 800 }}>
                            {tx.in_progress ? 'Bekliyor' : 'Tamamlandı'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Cüzdan Yönetimi Modalı */}
              {activeActionModal === 'manage' && (
                <div>
                  {walletManageMode === 'menu' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button
                        onClick={() => setWalletManageMode('create')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '14px',
                          borderRadius: '14px',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Plus size={20} color="#fff" />
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 800 }}>Yeni Cüzdan Oluştur</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>12 veya 24 kelimelik sıfırdan güvenli cüzdan</div>
                        </div>
                      </button>

                      <button
                        onClick={() => setWalletManageMode('import')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '14px',
                          borderRadius: '14px',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Download size={20} color="#fff" />
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 800 }}>Cüzdanı İçe Aktar (Mnemonic)</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>12 veya 24 tohum kelimenizi girerek aktarın</div>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          tonConnectUI.openModal();
                          setActiveActionModal('none');
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '14px',
                          borderRadius: '14px',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          color: '#fff',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Link2 size={20} color="#fff" />
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 800 }}>Dış Cüzdana Bağlan (TonConnect)</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>Tonkeeper, MyTonWallet veya Telegram Wallet</div>
                        </div>
                      </button>
                    </div>
                  )}

                  {walletManageMode === 'create' && (
                    <div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>
                        Kaç kelimelik tohum cümlesiyle cüzdan oluşturmak istersiniz?
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginBottom: '18px' }}>
                        <button
                          onClick={() => setMnemonicCount(12)}
                          style={{
                            flex: 1,
                            padding: '12px 0',
                            borderRadius: '12px',
                            border: mnemonicCount === 12 ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                            background: mnemonicCount === 12 ? 'rgba(16,185,129,0.15)' : 'transparent',
                            color: '#fff',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          12 Kelime
                        </button>
                        <button
                          onClick={() => setMnemonicCount(24)}
                          style={{
                            flex: 1,
                            padding: '12px 0',
                            borderRadius: '12px',
                            border: mnemonicCount === 24 ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
                            background: mnemonicCount === 24 ? 'rgba(16,185,129,0.15)' : 'transparent',
                            color: '#fff',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          24 Kelime (Önerilen)
                        </button>
                      </div>

                      <button
                        onClick={handleCreateNewWallet}
                        style={{
                          width: '100%',
                          padding: '14px',
                          borderRadius: '12px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #10b981, #047857)',
                          color: '#fff',
                          fontWeight: 900,
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}
                      >
                        CÜZDANI OLUŞTUR
                      </button>
                    </div>
                  )}

                  {walletManageMode === 'backup' && (
                    <div>
                      <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: '12px',
                        padding: '10px',
                        fontSize: '11px',
                        color: '#fca5a5',
                        marginBottom: '14px'
                      }}>
                        ⚠️ Bu kelimeler cüzdanınızın tek kurtarma anahtarıdır. Kaybederseniz fonlarınıza erişemezsiniz!
                      </div>

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '6px',
                        background: 'rgba(0,0,0,0.3)',
                        padding: '12px',
                        borderRadius: '14px',
                        marginBottom: '14px'
                      }}>
                        {generatedWords.map((w, i) => (
                          <div key={i} style={{ fontSize: '11px', color: '#fff', padding: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                            <span style={{ color: '#64748b', marginRight: '4px' }}>{i + 1}.</span>
                            <span style={{ fontWeight: 800 }}>{w}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => copyToClipboard(generatedWords.join(' '))}
                        style={{
                          width: '100%',
                          padding: '12px',
                          borderRadius: '10px',
                          border: '1px solid rgba(255,255,255,0.1)',
                          background: 'transparent',
                          color: '#fff',
                          fontWeight: 800,
                          fontSize: '12px',
                          cursor: 'pointer',
                          marginBottom: '10px'
                        }}
                      >
                        {copied ? 'Kelimeler Kopyalandı!' : 'Kelimeleri Kopyala'}
                      </button>

                      <button
                        onClick={() => setActiveActionModal('none')}
                        style={{
                          width: '100%',
                          padding: '14px',
                          borderRadius: '12px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                          color: '#000',
                          fontWeight: 900,
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}
                      >
                        KAYDETTİM, TAMAMLA
                      </button>
                    </div>
                  )}

                  {walletManageMode === 'import' && (
                    <div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                        12 veya 24 tohum kelimenizi aralarında boşluk bırakarak yapıştırın:
                      </div>

                      <textarea
                        rows={4}
                        value={importInput}
                        onChange={(e) => setImportInput(e.target.value)}
                        placeholder="apple banana cherry dog elephant..."
                        style={{
                          width: '100%',
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '10px',
                          padding: '12px',
                          color: '#fff',
                          fontSize: '12px',
                          boxSizing: 'border-box',
                          marginBottom: '10px'
                        }}
                      />

                      {importError && (
                        <div style={{ fontSize: '11px', color: '#ef4444', marginBottom: '10px' }}>
                          {importError}
                        </div>
                      )}

                      <button
                        onClick={handleImportWallet}
                        style={{
                          width: '100%',
                          padding: '14px',
                          borderRadius: '12px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                          color: '#fff',
                          fontWeight: 900,
                          fontSize: '13px',
                          cursor: 'pointer'
                        }}
                      >
                        CÜZDANI İÇE AKTAR
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
