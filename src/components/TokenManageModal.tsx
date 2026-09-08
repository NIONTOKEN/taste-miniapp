import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Eye, EyeOff, Search, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface CustomToken {
  id: string;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  image?: string;
  price?: string;
  balance?: string;
  usdValue?: string;
}

interface TokenManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  allAssets: Array<{
    id: string;
    symbol: string;
    name: string;
    balance?: string;
    isCustom?: boolean;
    Logo?: any;
    image?: string;
  }>;
  hiddenTokens: string[];
  onToggleHide: (tokenId: string) => void;
  onAddCustomToken: (token: CustomToken) => void;
  onDeleteCustomToken: (tokenId: string) => void;
}

export const TokenManageModal: React.FC<TokenManageModalProps> = ({
  isOpen,
  onClose,
  allAssets,
  hiddenTokens,
  onToggleHide,
  onAddCustomToken,
  onDeleteCustomToken
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'manage' | 'add'>('manage');

  // Add token form state
  const [contractAddress, setContractAddress] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchedToken, setSearchedToken] = useState<CustomToken | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // TonAPI üzerinden Jetton Kontratını Sorgulama
  const handleSearchJetton = async () => {
    const cleanAddr = contractAddress.trim();
    if (!cleanAddr || cleanAddr.length < 10) {
      setErrorMsg(t('manage_coins.invalid_addr', 'Lütfen geçerli bir TON Jetton kontrat adresi girin.'));
      return;
    }

    setIsSearching(true);
    setErrorMsg('');
    setSearchedToken(null);

    try {
      const res = await fetch(`https://tonapi.io/v2/jettons/${encodeURIComponent(cleanAddr)}`);
      if (!res.ok) {
        throw new Error('Token bulunamadı veya geçersiz kontrat');
      }
      const data = await res.json();
      const meta = data?.metadata;

      if (!meta || !meta.symbol) {
        throw new Error('Token meta verileri okunamadı');
      }

      setSearchedToken({
        id: meta.address || cleanAddr,
        address: meta.address || cleanAddr,
        name: meta.name || meta.symbol,
        symbol: meta.symbol,
        decimals: parseInt(meta.decimals || '9', 10),
        image: meta.image || '',
        balance: '0.00',
        usdValue: '0.00',
        price: '$0.00'
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Token sorgulanırken bir hata oluştu');
    } finally {
      setIsSearching(false);
    }
  };

  const handleConfirmAdd = () => {
    if (!searchedToken) return;
    onAddCustomToken(searchedToken);
    setSuccessMsg(`${searchedToken.symbol} cüzdana başarıyla eklendi!`);
    setSearchedToken(null);
    setContractAddress('');
    setTimeout(() => {
      setSuccessMsg('');
      setActiveTab('manage');
    }, 1200);
  };

  return (
    <AnimatePresence>
      <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)'
          }}
        />

        {/* Modal Drawer Sheet */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '480px',
            maxHeight: '90vh',
            background: 'linear-gradient(180deg, #111827 0%, #0b1120 100%)',
            borderTopLeftRadius: '28px',
            borderTopRightRadius: '28px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.6)',
            padding: '20px 20px 32px',
            overflowY: 'auto',
            zIndex: 1
          }}
        >
          {/* Header Grab Bar */}
          <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.2)', borderRadius: '2px', margin: '0 auto 16px' }} />

          {/* Title and Close */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#fff' }}>
              {t('manage_coins.title', '🪙 Varlıkları Yönet / Coin Ekle')}
            </h3>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Tabs (Yönet / Yeni Ekle) */}
          <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.04)', padding: '4px', borderRadius: '14px', marginBottom: '18px' }}>
            <button
              onClick={() => setActiveTab('manage')}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'manage' ? '#2563eb' : 'transparent',
                color: activeTab === 'manage' ? '#fff' : '#94a3b8',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {t('manage_coins.tab_manage', 'Coinleri Yönet & Gizle')}
            </button>
            <button
              onClick={() => setActiveTab('add')}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'add' ? '#10b981' : 'transparent',
                color: activeTab === 'add' ? '#fff' : '#94a3b8',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <Plus size={15} />
              <span>{t('manage_coins.tab_add', 'Özel Coin Ekle')}</span>
            </button>
          </div>

          {/* ── 1. Coinleri Yönet & Gizle Tabı ── */}
          {activeTab === 'manage' && (
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '12px' }}>
                {t('manage_coins.hide_hint', 'Cüzdan ana sayfasında görünmesini istemediğiniz coinleri gizleyebilirsiniz.')}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '50vh', overflowY: 'auto' }}>
                {allAssets.map((asset) => {
                  const isHidden = hiddenTokens.includes(asset.id);
                  const isPrimary = asset.symbol === 'TAI' || asset.symbol === 'GRAM';

                  return (
                    <div
                      key={asset.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        borderRadius: '14px',
                        background: isHidden ? 'rgba(255, 255, 255, 0.02)' : 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.07)',
                        opacity: isHidden ? 0.6 : 1,
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {asset.Logo ? (
                          <asset.Logo size={32} />
                        ) : asset.image ? (
                          <img src={asset.image} alt={asset.symbol} width={32} height={32} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: 11 }}>
                            {asset.symbol.slice(0, 2)}
                          </div>
                        )}
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: isHidden ? '#94a3b8' : '#fff' }}>
                            {asset.symbol}
                          </div>
                          <div style={{ fontSize: '10px', color: '#64748b' }}>{asset.name}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {/* Hide / Show Toggle Button */}
                        {!isPrimary ? (
                          <button
                            onClick={() => onToggleHide(asset.id)}
                            style={{
                              background: isHidden ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              border: isHidden ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                              color: isHidden ? '#f87171' : '#4ade80',
                              borderRadius: '8px',
                              padding: '6px 10px',
                              fontSize: '11px',
                              fontWeight: 800,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            {isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                            <span>{isHidden ? t('manage_coins.hidden', 'Gizli') : t('manage_coins.shown', 'Görünür')}</span>
                          </button>
                        ) : (
                          <span style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>Ana Varlık</span>
                        )}

                        {/* Delete button if custom token */}
                        {asset.isCustom && (
                          <button
                            onClick={() => onDeleteCustomToken(asset.id)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.12)',
                              border: 'none',
                              color: '#ef4444',
                              borderRadius: '8px',
                              padding: '6px 8px',
                              cursor: 'pointer'
                            }}
                            title="Özel tokenı sil"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── 2. Özel Coin Ekle Tabı ── */}
          {activeTab === 'add' && (
            <div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
                {t('manage_coins.add_desc', 'Eklemek istediğiniz TON Jetton kontrat (master) adresini yapıştırın:')}
              </div>

              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="EQ..."
                  value={contractAddress}
                  onChange={(e) => setContractAddress(e.target.value)}
                  style={{
                    flex: 1,
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '12px',
                    padding: '12px',
                    color: '#fff',
                    fontSize: '12px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  onClick={handleSearchJetton}
                  disabled={isSearching}
                  style={{
                    background: '#2563eb',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0 16px',
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Search size={14} />
                  <span>{isSearching ? '...' : t('manage_coins.search', 'Bul')}</span>
                </button>
              </div>

              {/* Hata Mesajı */}
              {errorMsg && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '10px',
                  padding: '10px',
                  color: '#f87171',
                  fontSize: '11px',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <AlertCircle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Başarı Mesajı */}
              {successMsg && (
                <div style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '10px',
                  padding: '10px',
                  color: '#4ade80',
                  fontSize: '11px',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <CheckCircle size={16} />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Bulunan Token Önizleme Kartı */}
              {searchedToken && (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  borderRadius: '16px',
                  padding: '14px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    {searchedToken.image ? (
                      <img src={searchedToken.image} alt={searchedToken.symbol} width={40} height={40} style={{ borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff' }}>
                        {searchedToken.symbol.slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 900, color: '#fff' }}>{searchedToken.name}</div>
                      <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 800 }}>{searchedToken.symbol}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '10px', color: '#64748b', wordBreak: 'break-all', fontFamily: 'monospace', marginBottom: '14px' }}>
                    {searchedToken.address}
                  </div>

                  <button
                    onClick={handleConfirmAdd}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #10b981, #047857)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '14px',
                      color: '#fff',
                      fontWeight: 900,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Sparkles size={16} />
                    <span>{t('manage_coins.confirm_add', 'Cüzdana Ekle')}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
