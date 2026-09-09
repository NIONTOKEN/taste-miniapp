import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, EyeOff, ArrowDownCircle, ArrowUpCircle, RefreshCw, History,
  Copy, Check, Search, Plus, Download, Link2, X, ExternalLink, ArrowUpRight, ArrowDownLeft,
  ChevronDown, ChevronUp
} from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { internalWalletService } from '../services/internalWallet';
import { useTonConnectUI, TonConnectButton } from '@tonconnect/ui-react';
import { LogoGRAM, LogoUSDT, LogoDOGS, LogoUTYA, LogoNOT, LogoTAI } from './TokenLogos';
import { toNano, Address, beginCell } from '@ton/core';
import { fetchLiveTaiPrice, LiveTokenPrice } from '../services/stonfiService';
import { CoinDetailModal, CoinDetailData } from './CoinDetailModal';
import { TokenManageModal, CustomToken } from './TokenManageModal';
import { SlidersHorizontal } from 'lucide-react';
import { addAppNotification } from './NotificationPanel';

interface WalletTransferProps {
  onNavigateToBorsa?: () => void;
}

interface TxEvent {
  id: string;
  type: 'in' | 'out' | 'swap' | 'call';
  title: string;
  amount: string;
  symbol: string;
  timestamp: number;
  dateStr: string;
  status: string;
  hash?: string;
}

export const WalletTransfer: React.FC<WalletTransferProps> = ({ onNavigateToBorsa }) => {
  const { t } = useTranslation();
  const { walletType, setWalletType, activeAddress, balances, refreshBalances } = useWallet();
  const [tonConnectUI] = useTonConnectUI();

  const [showBalance, setShowBalance] = useState(true);
  const [activeActionModal, setActiveActionModal] = useState<'none' | 'deposit' | 'withdraw' | 'history' | 'manage'>('none');
  const [copied, setCopied] = useState(false);
  const [searchToken, setSearchToken] = useState('');
  const [tokenFilter, setTokenFilter] = useState<'all' | 'balance'>('all');

  const [recipient, setRecipient] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sendMemo, setSendMemo] = useState('');
  const [selectedTokenToSend, setSelectedTokenToSend] = useState<string>('TAI');
  const [isTokenDropdownOpen, setIsTokenDropdownOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendFeedback, setSendFeedback] = useState<{ text: string; error: boolean } | null>(null);

  const prevTaiBalRef = useRef<string>(balances.taste);
  const prevTonBalRef = useRef<string>(balances.ton);

  // Cüzdana coin geldiğinde otomatik bildirim oluştur
  useEffect(() => {
    const prevTai = parseFloat(prevTaiBalRef.current) || 0;
    const curTai = parseFloat(balances.taste) || 0;
    const prevTon = parseFloat(prevTonBalRef.current) || 0;
    const curTon = parseFloat(balances.ton) || 0;

    if (curTai > prevTai && prevTai > 0) {
      const diff = (curTai - prevTai).toLocaleString();
      addAppNotification({
        emoji: '📥',
        title: 'TAI Transferi Geldi!',
        body: `Cüzdanınıza +${diff} TAI transferi ulaştı. Bakiyeniz güncellendi!`,
        time: 'Az önce'
      });
    } else if (curTon > prevTon && prevTon > 0) {
      const diff = (curTon - prevTon).toFixed(3);
      addAppNotification({
        emoji: '📥',
        title: 'TON Transferi Geldi!',
        body: `Cüzdanınıza +${diff} TON transferi ulaştı. Bakiyeniz güncellendi!`,
        time: 'Az önce'
      });
    }

    prevTaiBalRef.current = balances.taste;
    prevTonBalRef.current = balances.ton;
  }, [balances.taste, balances.ton]);

  const [walletManageMode, setWalletManageMode] = useState<'menu' | 'create' | 'import' | 'backup'>('menu');
  
  // Özel Coin Ekleme & Gizleme State'leri
  const [isManageTokensOpen, setIsManageTokensOpen] = useState(false);
  const [selectedCoinForDetail, setSelectedCoinForDetail] = useState<CoinDetailData | null>(null);

  const [customTokens, setCustomTokens] = useState<CustomToken[]>(() => {
    try {
      const saved = localStorage.getItem('taste_wallet_custom_tokens');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [hiddenTokenIds, setHiddenTokenIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('taste_wallet_hidden_tokens');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleToggleHide = (tokenId: string) => {
    setHiddenTokenIds(prev => {
      const next = prev.includes(tokenId) ? prev.filter(id => id !== tokenId) : [...prev, tokenId];
      localStorage.setItem('taste_wallet_hidden_tokens', JSON.stringify(next));
      return next;
    });
  };

  const handleAddCustomToken = (token: CustomToken) => {
    setCustomTokens(prev => {
      if (prev.some(t => t.id === token.id || t.address.toLowerCase() === token.address.toLowerCase())) return prev;
      const next = [...prev, token];
      localStorage.setItem('taste_wallet_custom_tokens', JSON.stringify(next));
      return next;
    });
  };

  const handleDeleteCustomToken = (tokenId: string) => {
    setCustomTokens(prev => {
      const next = prev.filter(t => t.id !== tokenId && t.address !== tokenId);
      localStorage.setItem('taste_wallet_custom_tokens', JSON.stringify(next));
      return next;
    });
  };
  const [mnemonicCount, setMnemonicCount] = useState<12 | 24>(24);
  const [generatedWords, setGeneratedWords] = useState<string[]>([]);
  const [importInput, setImportInput] = useState('');
  const [importError, setImportError] = useState('');

  // Canlı Fiyatlar ve Gerçek Geçmiş
  const [taiPriceData, setTaiPriceData] = useState<LiveTokenPrice | null>(null);
  const [historyList, setHistoryList] = useState<TxEvent[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // STON.fi havuzundan canlı TAI fiyatını yükle
  useEffect(() => {
    let isMounted = true;
    const loadPrices = async () => {
      const data = await fetchLiveTaiPrice();
      if (isMounted) setTaiPriceData(data);
    };
    loadPrices();
    const interval = setInterval(loadPrices, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Bakiyelerin yaklaşık USD hesaplaması
  const gramBal = parseFloat(balances.ton || '0');
  const taiBal = parseFloat(balances.taste || '0');
  const tonUsdPrice = 5.32;
  const taiUsdPrice = taiPriceData ? taiPriceData.priceInUsd : 0.000946;
  const gramUsd = gramBal * tonUsdPrice;
  const taiUsd = taiBal * taiUsdPrice;

  // Diğer jettonların USD değerlerini topla (TAI hariç, TAI taiUsd olarak tek ve doğru hesaplanır)
  const otherJettonsUsd = (balances.jettons || []).reduce((acc, j) => {
    const sym = (j.symbol || '').toUpperCase();
    const addr = (j.address || '').toLowerCase();
    const isTai = sym === 'TASTE' || sym === 'TAI' || 
                  addr.includes('eqb0betxstmdhvri4s-cylwyjag_zir5lplufcnc2vwuxzc-') ||
                  addr.includes('0:746de4f14ad99d855ae2e2cf9c625c1825a1bf6624799692ee7c2342d95594c5');
    if (isTai) return acc;
    // Bazen API aşırı yüksek sahte usdValue dönebilir, güvenli sınır koy
    const val = parseFloat(j.usdValue || '0');
    return acc + (isNaN(val) ? 0 : Math.min(val, 50000));
  }, 0);

  const totalUsd = gramUsd + taiUsd + otherJettonsUsd;

  // TonAPI v2 üzerinden cüzdanın gerçek işlem geçmişini çekme
  const fetchTxHistory = async () => {
    if (!activeAddress) return;
    setLoadingHistory(true);
    try {
      const res = await fetch(`https://tonapi.io/v2/accounts/${encodeURIComponent(activeAddress)}/events?limit=25`);
      if (res.ok) {
        const data = await res.json();
        const parsed: TxEvent[] = (data.events || []).map((ev: any) => {
          const action = ev.actions?.[0];
          let type: TxEvent['type'] = 'call';
          let title = 'İşlem';
          let amount = '0';
          let symbol = 'TON';

          if (action?.type === 'TonTransfer') {
            const isIncoming = action.TonTransfer.recipient?.address?.toLowerCase() === activeAddress.toLowerCase();
            type = isIncoming ? 'in' : 'out';
            title = isIncoming ? 'TON Alındı' : 'TON Gönderildi';
            amount = (parseFloat(action.TonTransfer.amount) / 1e9).toFixed(3);
            symbol = 'GRAM';
          } else if (action?.type === 'JettonTransfer') {
            const isIncoming = action.JettonTransfer.recipient?.address?.toLowerCase() === activeAddress.toLowerCase();
            type = isIncoming ? 'in' : 'out';
            const sym = action.JettonTransfer.jetton?.symbol || 'JETTON';
            title = isIncoming ? `${sym} Alındı` : `${sym} Gönderildi`;
            const dec = action.JettonTransfer.jetton?.decimals || 9;
            amount = (parseFloat(action.JettonTransfer.amount) / Math.pow(10, dec)).toFixed(2);
            symbol = sym;
          } else if (action?.type === 'JettonSwap' || action?.type === 'SmartContractExec') {
            type = 'swap';
            title = 'DEX Swap / Al-Sat';
            amount = '';
            symbol = '';
          }

          const date = new Date(ev.timestamp * 1000);
          return {
            id: ev.event_id,
            type,
            title,
            amount,
            symbol,
            timestamp: ev.timestamp,
            dateStr: `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
            status: ev.in_progress ? 'Bekliyor' : 'Başarılı',
            hash: ev.event_id
          };
        });

        setHistoryList(parsed);
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
      alert(t('wallet_transfer.wallet_error', 'Hata: ') + e.message);
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
      setImportError(e.message || t('wallet_transfer.invalid_seed', 'Geçersiz tohum kelimeleri'));
    }
  };

  const handleSendTransaction = async () => {
    if (!activeAddress) {
      setWalletType('external');
      tonConnectUI.openModal();
      return;
    }
    if (!recipient.trim() || !sendAmount || parseFloat(sendAmount) <= 0) {
      setSendFeedback({ text: t('wallet_transfer.invalid_address', 'Lütfen geçerli adres ve miktar girin'), error: true });
      return;
    }

    setIsSending(true);
    setSendFeedback(null);

    try {
      if (selectedTokenToSend === 'GRAM' || selectedTokenToSend === 'TON') {
        if (walletType === 'internal') {
          await internalWalletService.sendTon(recipient.trim(), sendAmount, sendMemo);
        } else {
          let payload = undefined;
          if (sendMemo) {
            payload = beginCell().storeUint(0, 32).storeStringTail(sendMemo).endCell().toBoc().toString('base64');
          }
          await tonConnectUI.sendTransaction({
            validUntil: Math.floor(Date.now() / 1000) + 300,
            messages: [{
              address: Address.parse(recipient.trim()).toString(),
              amount: toNano(sendAmount).toString(),
              payload: payload
            }]
          });
        }
      } else {
        // Popüler ve özel Jetton transferleri (TAI, USDT, DOGS, NOT, UTYA vb.)
        const JETTON_MAP: Record<string, string> = {
          TAI: 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-',
          TASTE: 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-',
          USDT: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs',
          'USD₮': 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs',
          DOGS: 'EQCvxJy4eG8hyHBFsZ7eePxrRsUQSFE_jpptRAYBmcG_DOGS',
          NOT: 'EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT',
          UTYA: 'EQBaCgUwOoc6gHCNln_oJzb0mVs79YG7wYoavh-o1ItaneLA',
        };

        const targetJettonAddress = JETTON_MAP[selectedTokenToSend] || 
          customTokens.find(c => c.symbol === selectedTokenToSend)?.address || 
          balances.jettons?.find(j => j.symbol === selectedTokenToSend)?.address ||
          'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-';

        if (walletType === 'internal') {
          await internalWalletService.sendTaste(recipient.trim(), sendAmount, targetJettonAddress, sendMemo);
        } else {
          const userRaw = Address.parse(activeAddress).toRawString();
          const res = await fetch(`https://tonapi.io/v2/accounts/${userRaw}/jettons/${targetJettonAddress}`);
          const data = await res.json();
          const userJWallet = data?.wallet_address?.address;
          if (!userJWallet) throw new Error(`Bu token (${selectedTokenToSend}) için jetton cüzdan adresi alınamadı`);

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

      addAppNotification({
        emoji: '📤',
        title: `${selectedTokenToSend} Gönderildi!`,
        body: `${sendAmount} ${selectedTokenToSend} başarıyla gönderildi. Alıcı: ${recipient.slice(0, 6)}...${recipient.slice(-4)}`,
        time: 'Az önce'
      });

      setSendFeedback({ text: t('wallet_transfer.send_success', 'Transfer başarıyla gönderildi!'), error: false });
      setSendAmount('');
      setRecipient('');
      setSendMemo('');
      setTimeout(refreshBalances, 4000);
    } catch (e: any) {
      setSendFeedback({ text: e.message || t('wallet_transfer.send_error', 'Gönderim hatası'), error: true });
    } finally {
      setIsSending(false);
    }
  };

  // Varlık Listesi: Hem Cüzdandaki Gerçek Jettonlar Hem Popüler TON Coinleri (Her birinin kendi gerçek adresi)
  const baseAssets = [
    {
      id: 'TAI',
      name: 'Taste AI',
      symbol: 'TAI',
      balance: taiBal.toLocaleString(),
      usdValue: taiUsd.toFixed(2),
      price: `$${taiUsdPrice.toFixed(6)}`,
      address: 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-',
      Logo: LogoTAI
    },
    {
      id: 'GRAM',
      name: 'Gram (TON)',
      symbol: 'GRAM',
      balance: gramBal.toFixed(4),
      usdValue: gramUsd.toFixed(2),
      price: `$${tonUsdPrice.toFixed(2)}`,
      address: 'Native Toncoin (Workchain 0)',
      Logo: LogoGRAM
    }
  ];

  // Cüzdandaki diğer gerçek jettonları ekle (kendi jetton adresiyle)
  const dynamicJettons = (balances.jettons || [])
    .filter(j => j.symbol !== 'TASTE' && j.symbol !== 'TAI')
    .map(j => ({
      id: j.address || j.symbol,
      name: j.name,
      symbol: j.symbol,
      balance: j.balance,
      usdValue: j.usdValue || '0.00',
      price: j.usdPrice ? `$${j.usdPrice.toFixed(4)}` : '$0.00',
      address: j.address,
      Logo: () => (
        j.image ? (
          <img src={j.image} alt={j.symbol} width={34} height={34} style={{ borderRadius: '50%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 11 }}>
            {j.symbol.slice(0, 2)}
          </div>
        )
      )
    }));

  // Popüler TON ekosistem coinleri (Kendi gerçek kontrat adresleriyle)
  const popularFallbacks = [
    { id: 'USDT', name: 'Tether USD', symbol: 'USD₮', balance: '0.00', usdValue: '0.00', price: '$1.00', address: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs', Logo: LogoUSDT },
    { id: 'DOGS', name: 'Dogs Token', symbol: 'DOGS', balance: '0', usdValue: '0.00', price: '$0.000045', address: 'EQCvxJy4eG8hyHBFsZ7eePxrRsUQSFE_jpptRAYBmcG_DOGS', Logo: LogoDOGS },
    { id: 'UTYA', name: 'Utya Duck', symbol: 'UTYA', balance: '0', usdValue: '0.00', price: '$0.0268', address: 'EQBaCgUwOoc6gHCNln_oJzb0mVs79YG7wYoavh-o1ItaneLA', Logo: LogoUTYA },
    { id: 'NOT', name: 'Notcoin', symbol: 'NOT', balance: '0', usdValue: '0.00', price: '$0.00045', address: 'EQAvlWFDxGF2lXm67y4yzC17wYKD9A0guwPkMs1gOsM__NOT', Logo: LogoNOT },
    { id: 'CATS', name: 'Cats Community', symbol: 'CATS', balance: '0', usdValue: '0.00', price: '$0.000038', address: 'EQA-X_yo3fzzbPtTyMm9KhgKlAyDUgxmgEmGam8tBlqmCATS', Logo: () => <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#1e293b', border: '1px solid #475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🐱</div> },
    { id: 'HMSTR', name: 'Hamster Kombat', symbol: 'HMSTR', balance: '0', usdValue: '0.00', price: '$0.00285', address: 'EQA4hA8cOx7ElVKO5PWqI2B7jP8e9iP_cWqR-HMSTR_TON', Logo: () => <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#b45309', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🐹</div> }
  ];

  // Kullanıcı tarafından eklenen özel tokenlar
  const formattedCustomTokens = customTokens.map(ct => ({
    id: ct.id,
    name: ct.name,
    symbol: ct.symbol,
    balance: ct.balance || '0.00',
    usdValue: ct.usdValue || '0.00',
    price: ct.price || '$0.00',
    address: ct.address,
    isCustom: true,
    Logo: () => (
      ct.image ? (
        <img src={ct.image} alt={ct.symbol} width={34} height={34} style={{ borderRadius: '50%', objectFit: 'cover' }} />
      ) : (
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 11 }}>
          {ct.symbol.slice(0, 2)}
        </div>
      )
    )
  }));

  // Dynamic jettonlarda olmayan popülerleri listeye ekle
  const missingPopular = popularFallbacks.filter(pop => 
    !dynamicJettons.some(d => d.symbol.toLowerCase() === pop.symbol.toLowerCase()) &&
    !formattedCustomTokens.some(ct => ct.symbol.toLowerCase() === pop.symbol.toLowerCase())
  );

  const allAssets = [...baseAssets, ...dynamicJettons, ...formattedCustomTokens, ...missingPopular];

  // Gizlenmemiş varlıklar listesi
  const visibleAssets = allAssets.filter(tok => !hiddenTokenIds.includes(tok.id));

  const filteredAssets = visibleAssets.filter(tok => {
    const matchesSearch = tok.name.toLowerCase().includes(searchToken.toLowerCase()) ||
                          tok.symbol.toLowerCase().includes(searchToken.toLowerCase());
    if (!matchesSearch) return false;
    if (tokenFilter === 'balance') return parseFloat(tok.balance.replace(/,/g, '')) > 0;
    return true;
  });

  return (
    <div style={{ padding: '0 0 30px' }}>
      {/* ── 1. Toplam Varlık Değeri Kartı ── */}
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
            <span>{t('wallet_transfer.total_value', 'Toplam Varlık Değeri')}</span>
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
            <div style={{ fontSize: '10px', color: '#fcd34d', fontWeight: 700 }}>{t('wallet_transfer.taste_live', 'TASTE AI (CANLI)')}</div>
            <div style={{ fontSize: '15px', fontWeight: 900, color: '#fff', marginTop: '2px' }}>
              {showBalance ? `${taiBal.toLocaleString()} TAI` : '••••'}
            </div>
            <div style={{ fontSize: '10px', color: '#fef08a' }}>≈ ${taiUsd.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* ── 2. Dörtlü Hızlı İşlem Butonları ── */}
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
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#f8fafc' }}>{t('wallet_transfer.deposit', 'Yatır')}</span>
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
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#f8fafc' }}>{t('wallet_transfer.withdraw', 'Çek')}</span>
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
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#f8fafc' }}>{t('wallet_transfer.convert', 'Dönüştür')}</span>
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
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#f8fafc' }}>{t('wallet_transfer.history', 'Geçmiş')}</span>
        </motion.button>
      </div>

      {/* ── 3. Cüzdan Yönetimi & Bağlantı Barı (Resmi TonConnect Butonlu) ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(37,99,235,0.08) 100%)',
        border: '1px solid rgba(245,158,11,0.25)',
        borderRadius: '18px',
        padding: '14px 16px',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 900, color: '#fff' }}>
                {walletType === 'internal' ? t('wallet_transfer.taste_wallet', '🔐 Taste Yerleşik Cüzdan') : t('wallet_transfer.tonconnect_wallet', '🔗 TonConnect Cüzdanı')}
              </span>
              {activeAddress && (
                <span style={{ fontSize: '9px', background: '#22c55e', color: '#000', padding: '1px 5px', borderRadius: '4px', fontWeight: 900 }}>{t('wallet_transfer.active_badge', 'AKTİF')}</span>
              )}
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px' }}>
              {activeAddress ? `${activeAddress.slice(0, 8)}...${activeAddress.slice(-6)}` : t('wallet_transfer.not_connected', 'Cüzdan bağlı değil')}
            </div>
          </div>

          <button
            onClick={() => {
              setWalletManageMode('menu');
              setActiveActionModal('manage');
            }}
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '10px',
              padding: '8px 12px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {t('wallet_transfer.manage', 'Yönet ⚙️')}
          </button>
        </div>

        {/* Cüzdan Bağlı Değilse Resmi TonConnect Butonu */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
          <div style={{ flex: 1 }}>
            <TonConnectButton className="taste-tonconnect-btn" />
          </div>
          <button
            onClick={refreshBalances}
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '10px',
              padding: '8px 10px',
              color: '#94a3b8',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <RefreshCw size={12} />
            <span>{t('wallet_transfer.refresh', 'Yenile')}</span>
          </button>
        </div>

        {/* Cüzdan Bağlıyken Her Cihazda Görünür Adresi Kopyala ve Bağlantıyı Kes Butonları */}
        {activeAddress && (
          <div style={{
            display: 'flex',
            gap: '8px',
            paddingTop: '8px',
            borderTop: '1px solid rgba(255,255,255,0.08)'
          }}>
            <button
              onClick={() => copyToClipboard(activeAddress)}
              style={{
                flex: 1,
                padding: '9px 12px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.05)',
                color: copied ? '#10b981' : '#cbd5e1',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? t('wallet_transfer.copied', 'Kopyalandı!') : t('wallet_transfer.copy_address', 'Adresi Kopyala')}</span>
            </button>

            {walletType === 'external' ? (
              <button
                onClick={() => tonConnectUI.disconnect()}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  background: 'rgba(239, 68, 68, 0.08)',
                  color: '#f87171',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Link2 size={14} style={{ transform: 'rotate(45deg)' }} />
                <span>{t('wallet_transfer.disconnect', 'Bağlantıyı Kes')}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  internalWalletService.logout();
                  refreshBalances();
                }}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  background: 'rgba(239, 68, 68, 0.08)',
                  color: '#f87171',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Link2 size={14} style={{ transform: 'rotate(45deg)' }} />
                <span>{t('wallet_transfer.disconnect', 'Cüzdandan Çık')}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── 4. Varlık Arama & Filtreler ── */}
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
          placeholder={t('wallet_transfer.search_asset', 'Varlık ara...')}
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

      <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setTokenFilter('all')}
            style={{
              padding: '6px 12px',
              borderRadius: '16px',
              border: tokenFilter === 'all' ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.08)',
              background: tokenFilter === 'all' ? 'rgba(59,130,246,0.15)' : 'transparent',
              color: tokenFilter === 'all' ? '#60a5fa' : '#94a3b8',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {t('wallet_transfer.all_assets', 'Tümü', { count: visibleAssets.length })} ({visibleAssets.length})
          </button>
          <button
            onClick={() => setTokenFilter('balance')}
            style={{
              padding: '6px 12px',
              borderRadius: '16px',
              border: tokenFilter === 'balance' ? '1px solid #3b82f6' : '1px solid rgba(255,255,255,0.08)',
              background: tokenFilter === 'balance' ? 'rgba(59,130,246,0.15)' : 'transparent',
              color: tokenFilter === 'balance' ? '#60a5fa' : '#94a3b8',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {t('wallet_transfer.with_balance', 'Bakiyesi Olanlar')}
          </button>
        </div>

        {/* Coin Ekle / Yönet Butonu */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsManageTokensOpen(true)}
          style={{
            padding: '6px 12px',
            borderRadius: '16px',
            border: '1px solid rgba(245,158,11,0.3)',
            background: 'rgba(245,158,11,0.1)',
            color: '#f59e0b',
            fontSize: '11px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Plus size={14} />
          <span>{t('manage_coins.add_btn', 'Coin Ekle / Yönet')}</span>
        </motion.button>
      </div>

      {/* ── 5. Gerçek Coin Listesi (Tıklayınca Detay ve Grafik Açılır) ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {filteredAssets.map((asset) => (
          <motion.div
            key={asset.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedCoinForDetail(asset as any)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 14px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <asset.Logo size={34} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>{asset.symbol}</span>
                  <span style={{ fontSize: '9px', color: '#38bdf8', background: 'rgba(56,189,248,0.1)', padding: '1px 5px', borderRadius: '4px' }}>Grafik ↗</span>
                </div>
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
          </motion.div>
        ))}
      </div>

      {/* ── MODALLAR (Yatır, Çek, Cüzdan Yönetimi, Gerçek Geçmiş) ── */}
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
                  {activeActionModal === 'history' && '📜 Canlı İşlem Geçmişi'}
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
                  {/* Aşağı Açılan / Kayan Coin Seçim Menüsü */}
                  <div style={{ marginBottom: '16px', position: 'relative' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase' }}>
                      {t('wallet_transfer.select_token_to_send', 'Gönderilecek Varlık / Coin')}
                    </div>
                    
                    {/* Seçili Coin Tetikleyici Buton */}
                    {(() => {
                      const activeAsset = allAssets.find(a => a.symbol === selectedTokenToSend) || allAssets[0];
                      const ActiveLogo = activeAsset?.Logo;
                      return (
                        <div
                          onClick={() => setIsTokenDropdownOpen(!isTokenDropdownOpen)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: isTokenDropdownOpen ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.12)',
                            borderRadius: '14px',
                            padding: '12px 14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {ActiveLogo && <ActiveLogo size={28} />}
                            <div>
                              <div style={{ fontSize: '14px', fontWeight: 900, color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span>{activeAsset?.symbol}</span>
                                <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>({activeAsset?.name})</span>
                              </div>
                              <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 700 }}>
                                {t('wallet_transfer.available', 'Kullanılabilir')}: {activeAsset?.balance}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b' }}>
                            <span style={{ fontSize: '11px', fontWeight: 800 }}>Değiştir</span>
                            {isTokenDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Aşağı Kayan / Açılan Coin Listesi */}
                    <AnimatePresence>
                      {isTokenDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -4 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -4 }}
                          transition={{ duration: 0.2 }}
                          style={{
                            marginTop: '6px',
                            background: '#0d1527',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                            borderRadius: '14px',
                            overflow: 'hidden',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.6)',
                            maxHeight: '220px',
                            overflowY: 'auto',
                            zIndex: 20
                          }}
                        >
                          {allAssets.map((asset) => {
                            const isSelected = selectedTokenToSend === asset.symbol;
                            const AssetLogo = asset.Logo;
                            return (
                              <div
                                key={asset.id}
                                onClick={() => {
                                  setSelectedTokenToSend(asset.symbol);
                                  setIsTokenDropdownOpen(false);
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '10px 14px',
                                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                                  background: isSelected ? 'rgba(245, 158, 11, 0.12)' : 'transparent',
                                  cursor: 'pointer',
                                  transition: 'background 0.15s'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  {AssetLogo && <AssetLogo size={24} />}
                                  <div>
                                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>
                                      {asset.symbol} <span style={{ fontSize: '10px', color: '#64748b' }}>({asset.name})</span>
                                    </div>
                                    <div style={{ fontSize: '10px', color: '#94a3b8' }}>{asset.price}</div>
                                  </div>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                  <div style={{ fontSize: '12px', fontWeight: 800, color: isSelected ? '#fbbf24' : '#fff' }}>
                                    {asset.balance}
                                  </div>
                                  {isSelected && (
                                    <span style={{ fontSize: '9px', color: '#22c55e', fontWeight: 800 }}>SEÇİLİ ✓</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                      <span>{t('wallet_transfer.amount_label_send', 'MİKTAR')}</span>
                      <span
                        onClick={() => {
                          const activeAsset = allAssets.find(a => a.symbol === selectedTokenToSend);
                          setSendAmount(activeAsset ? String(activeAsset.balance).replace(/,/g, '') : '0');
                        }}
                        style={{ color: '#38bdf8', cursor: 'pointer', fontWeight: 700 }}
                      >
                        MAX: {allAssets.find(a => a.symbol === selectedTokenToSend)?.balance || '0'}
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

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>{t('wallet_transfer.memo_label_send', 'MEMO (AÇIKLAMA - OPSİYONEL)')}</div>
                    <input
                      type="text"
                      placeholder={t('wallet_transfer.memo_placeholder', 'İşlem notu / memo')}
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
                    {isSending ? t('borsa.processing', 'İşleniyor...') : t('wallet_transfer.confirm_send', 'GÖNDERİMİ ONAYLA')}
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

              {/* Gerçek Zincir İçi İşlem Geçmişi */}
              {activeActionModal === 'history' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>{t('wallet_transfer.blockchain_txs', 'Gerçek Blokzincir İşlemleri')}</span>
                    <button
                      onClick={fetchTxHistory}
                      style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <RefreshCw size={12} /> {t('wallet_transfer.refresh', 'Yenile')}
                    </button>
                  </div>

                  {loadingHistory ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                      <RefreshCw className="animate-spin" size={24} style={{ margin: '0 auto 8px', display: 'block' }} />
                      {t('wallet_transfer.loading_txs', 'İşlemler blokzincirden çekiliyor...')}
                    </div>
                  ) : historyList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                      {t('wallet_transfer.no_txs', 'Henüz zincir içi işlem kaydı bulunmuyor.')}
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {historyList.map((tx) => (
                        <div
                          key={tx.id}
                          style={{
                            padding: '12px',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.06)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: 34,
                              height: 34,
                              borderRadius: '50%',
                              background: tx.type === 'in' ? 'rgba(16,185,129,0.2)' : tx.type === 'out' ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              {tx.type === 'in' && <ArrowDownLeft size={18} color="#10b981" />}
                              {tx.type === 'out' && <ArrowUpRight size={18} color="#ef4444" />}
                              {tx.type === 'swap' && <RefreshCw size={16} color="#3b82f6" />}
                              {tx.type === 'call' && <History size={16} color="#94a3b8" />}
                            </div>

                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{tx.title}</div>
                              <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>{tx.dateStr}</div>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            {tx.amount ? (
                              <div style={{
                                fontSize: '13px',
                                fontWeight: 900,
                                color: tx.type === 'in' ? '#10b981' : tx.type === 'out' ? '#ef4444' : '#fff'
                              }}>
                                {tx.type === 'in' ? '+' : tx.type === 'out' ? '-' : ''}{tx.amount} {tx.symbol}
                              </div>
                            ) : (
                              <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 800 }}>DEX İşlemi</div>
                            )}

                            {tx.hash && (
                              <a
                                href={`https://tonviewer.com/transaction/${tx.hash}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{ fontSize: '9px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px', textDecoration: 'none', marginTop: '2px' }}
                              >
                                <span>Görüntüle</span>
                                <ExternalLink size={8} />
                              </a>
                            )}
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
                          <div style={{ fontSize: '13px', fontWeight: 800 }}>{t('wallet_transfer.create_wallet', 'Yeni Cüzdan Oluştur')}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>{t('wallet_transfer.create_wallet_desc', '12 veya 24 kelimelik sıfırdan güvenli cüzdan')}</div>
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
                          <div style={{ fontSize: '13px', fontWeight: 800 }}>{t('wallet_transfer.import_wallet', 'Cüzdanı İçe Aktar (Mnemonic)')}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>{t('wallet_transfer.import_wallet_desc', '12 veya 24 tohum kelimenizi girerek aktarın')}</div>
                        </div>
                      </button>

                      <div
                        style={{
                          padding: '14px',
                          borderRadius: '14px',
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.1)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Link2 size={20} color="#fff" />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{t('wallet_transfer.connect_external', 'Dış Cüzdana Bağlan (TonConnect)')}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>{t('wallet_transfer.connect_external_desc', 'Tonkeeper, MyTonWallet veya Telegram Wallet')}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', paddingTop: '4px' }}>
                          <TonConnectButton className="taste-tonconnect-btn" />
                        </div>
                      </div>
                    </div>
                  )}

                  {walletManageMode === 'create' && (
                    <div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>
                        {t('wallet_transfer.seed_question', 'Kaç kelimelik tohum cümlesiyle cüzdan oluşturmak istersiniz?')}
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
                          {t('wallet_transfer.words_12', '12 Kelime')}
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
                          {t('wallet_transfer.words_24', '24 Kelime (Önerilen)')}
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
                        {t('wallet_transfer.create_btn', 'CÜZDANI OLUŞTUR')}
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
                        {t('wallet_transfer.warning_seed', '⚠️ Bu kelimeler cüzdanınızın tek kurtarma anahtarıdır. Kaybederseniz fonlarınıza erişemezsiniz!')}
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
                        {copied ? t('wallet_transfer.copied', 'Kelimeler Kopyalandı!') : t('wallet_transfer.copy_words', 'Kelimeleri Kopyala')}
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
                        {t('wallet_transfer.saved_done', 'KAYDETTİM, TAMAMLA')}
                      </button>
                    </div>
                  )}

                  {walletManageMode === 'import' && (
                    <div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                        {t('wallet_transfer.paste_seed', '12 veya 24 tohum kelimenizi aralarında boşluk bırakarak yapıştırın:')}
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
                        {t('wallet_transfer.import_btn', 'CÜZDANI İÇE AKTAR')}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ── Coin Detay & İnteraktif Grafik Modalı ── */}
      <CoinDetailModal
        isOpen={!!selectedCoinForDetail}
        coin={selectedCoinForDetail}
        onClose={() => setSelectedCoinForDetail(null)}
        onTrade={(coin) => {
          setSelectedCoinForDetail(null);
          if (onNavigateToBorsa) onNavigateToBorsa();
        }}
        onSend={(coin) => {
          setSelectedCoinForDetail(null);
          setSelectedTokenToSend(coin.symbol === 'TAI' ? 'TAI' : 'GRAM');
          setActiveActionModal('withdraw');
        }}
        onReceive={(coin) => {
          setSelectedCoinForDetail(null);
          setActiveActionModal('deposit');
        }}
      />

      {/* ── Coin Ekleme & Gizleme / Çıkarma Modalı ── */}
      <TokenManageModal
        isOpen={isManageTokensOpen}
        onClose={() => setIsManageTokensOpen(false)}
        allAssets={allAssets}
        hiddenTokens={hiddenTokenIds}
        onToggleHide={handleToggleHide}
        onAddCustomToken={handleAddCustomToken}
        onDeleteCustomToken={handleDeleteCustomToken}
      />
    </div>
  );
};
