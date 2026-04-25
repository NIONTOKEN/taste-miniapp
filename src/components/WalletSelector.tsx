import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { Wallet, Settings, ShieldCheck, Copy, Plus, LogOut, ChevronRight, ExternalLink, Key } from 'lucide-react';
import { TonConnectButton } from '@tonconnect/ui-react';

export const WalletSelector = () => {
    const { t, i18n } = useTranslation();
    const { 
        walletType, 
        setWalletType, 
        activeAddress, 
        internalWallet, 
        createInternalWallet, 
        logoutInternal,
        balances
    } = useWallet();

    const [isOpen, setIsOpen] = useState(false);
    const [showMnemonic, setShowMnemonic] = useState(false);

    const toggleMnemonic = () => setShowMnemonic(!showMnemonic);

    const copyAddress = () => {
        if (activeAddress) {
            navigator.clipboard.writeText(activeAddress);
            // Burada bir toast bildirimi eklenebilir
        }
    };

    const shortAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

    return (
        <>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(true)}
                style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--bg-card-border)',
                    color: 'var(--text-main)',
                    padding: '8px 16px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                <Wallet size={16} color={walletType === 'internal' ? '#fbbf24' : '#60a5fa'} />
                <span style={{ fontWeight: 800 }}>
                    {activeAddress ? shortAddress(activeAddress) : (i18n.language === 'tr' ? 'Cüzdan Bağla' : 'Connect Wallet')}
                </span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)' }}
                        />
                        
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            style={{
                                background: '#1e293b',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '24px',
                                width: '100%',
                                maxWidth: '400px',
                                padding: '24px',
                                position: 'relative',
                                zIndex: 1,
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                            }}
                        >
                            <h3 style={{ margin: '0 0 20px', fontSize: '1.2rem', fontWeight: 900, textAlign: 'center' }}>
                                💎 {i18n.language === 'tr' ? 'Cüzdan Seçenekleri' : 'Wallet Options'}
                            </h3>

                            {/* Wallet Selection Tabs */}
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', background: 'rgba(0,0,0,0.2)', padding: '5px', borderRadius: '15px' }}>
                                <button 
                                    onClick={() => setWalletType('external')}
                                    style={{ 
                                        flex: 1, padding: '12px', borderRadius: '12px', border: 'none', 
                                        background: walletType === 'external' ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'transparent',
                                        color: '#fff', fontWeight: 800, fontSize: '12px', cursor: 'pointer'
                                    }}
                                >
                                    TON CONNECT
                                </button>
                                <button 
                                    onClick={() => setWalletType('internal')}
                                    style={{ 
                                        flex: 1, padding: '12px', borderRadius: '12px', border: 'none', 
                                        background: walletType === 'internal' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
                                        color: walletType === 'internal' ? '#000' : '#fff', fontWeight: 800, fontSize: '12px', cursor: 'pointer'
                                    }}
                                >
                                    TASTE WALLET
                                </button>
                            </div>

                            <div style={{ minHeight: '200px' }}>
                                {walletType === 'external' ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', marginBottom: '20px', lineHeight: 1.5 }}>
                                            {i18n.language === 'tr' 
                                                ? 'Tonkeeper veya MyTonWallet gibi harici bir cüzdan kullanarak bağlanın.' 
                                                : 'Connect using an external wallet like Tonkeeper or MyTonWallet.'}
                                        </p>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <TonConnectButton />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                        {!internalWallet ? (
                                            <div style={{ textAlign: 'center' }}>
                                                <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px', lineHeight: 1.5 }}>
                                                    {i18n.language === 'tr' 
                                                        ? 'Taste iç cüzdanı ile uygulama içinde kolayca işlem yapabilirsiniz.' 
                                                        : 'Use the Taste internal wallet for easy in-app transactions.'}
                                                </p>
                                                <button 
                                                    onClick={createInternalWallet}
                                                    style={{ 
                                                        width: '100%', padding: '16px', borderRadius: '15px', border: 'none', 
                                                        background: 'var(--gradient-gold)', color: '#000', fontWeight: 900, 
                                                        fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                                    }}
                                                >
                                                    <Plus size={18} /> {i18n.language === 'tr' ? 'YENİ CÜZDAN OLUŞTUR' : 'CREATE NEW WALLET'}
                                                </button>
                                            </div>
                                        ) : (
                                            <div>
                                                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '15px' }}>
                                                    <div style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 800, marginBottom: '5px' }}>CÜZDAN ADRESİNİZ</div>
                                                    <div style={{ fontSize: '12px', color: '#fff', wordBreak: 'break-all', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                                                        {internalWallet.address}
                                                        <Copy size={16} onClick={copyAddress} style={{ cursor: 'pointer', flexShrink: 0 }} />
                                                    </div>
                                                </div>

                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                                                        <div style={{ fontSize: '9px', color: '#94a3b8', marginBottom: '4px' }}>TON BAKİYE</div>
                                                        <div style={{ fontSize: '16px', fontWeight: 900, color: '#fbbf24' }}>{balances.ton}</div>
                                                    </div>
                                                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', textAlign: 'center' }}>
                                                        <div style={{ fontSize: '9px', color: '#94a3b8', marginBottom: '4px' }}>TASTE BAKİYE</div>
                                                        <div style={{ fontSize: '16px', fontWeight: 900, color: '#22c55e' }}>{balances.taste}</div>
                                                    </div>
                                                </div>

                                                <button 
                                                    onClick={toggleMnemonic}
                                                    style={{ 
                                                        width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', 
                                                        background: 'transparent', color: '#fff', fontWeight: 700, 
                                                        fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px'
                                                    }}
                                                >
                                                    <Key size={16} /> {showMnemonic ? (i18n.language === 'tr' ? 'KELİMELERİ GİZLE' : 'HIDE WORDS') : (i18n.language === 'tr' ? 'YEDEKLEME KELİMELERİ' : 'BACKUP WORDS')}
                                                </button>

                                                {showMnemonic && (
                                                    <motion.div 
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        style={{ 
                                                            background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)', 
                                                            padding: '15px', borderRadius: '12px', marginBottom: '15px'
                                                        }}
                                                    >
                                                        <p style={{ fontSize: '11px', color: '#f59e0b', marginBottom: '10px', fontWeight: 700 }}>
                                                            ⚠️ BU KELİMELERİ KİMSEYLE PAYLAŞMAYIN!
                                                        </p>
                                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                                                            {internalWallet.mnemonic.map((word: string, i: number) => (
                                                                <div key={i} style={{ fontSize: '11px', color: '#fff', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '6px', textAlign: 'center' }}>
                                                                    <span style={{ color: '#94a3b8', marginRight: '4px' }}>{i+1}.</span>{word}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}

                                                <button 
                                                    onClick={logoutInternal}
                                                    style={{ 
                                                        width: '100%', padding: '12px', borderRadius: '12px', border: 'none', 
                                                        background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontWeight: 700, 
                                                        fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                                    }}
                                                >
                                                    <LogOut size={16} /> {i18n.language === 'tr' ? 'BU CÜZDANDAN ÇIK' : 'LOGOUT FROM THIS WALLET'}
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </div>

                            <button 
                                onClick={() => setIsOpen(false)}
                                style={{ 
                                    marginTop: '20px', width: '100%', padding: '12px', borderRadius: '12px', border: 'none', 
                                    background: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontWeight: 800, 
                                    fontSize: '12px', cursor: 'pointer'
                                }}
                            >
                                {i18n.language === 'tr' ? 'KAPAT' : 'CLOSE'}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
