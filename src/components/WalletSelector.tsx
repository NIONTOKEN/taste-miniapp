import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '../context/WalletContext';
import { Wallet, Copy, Plus, LogOut, Key, Download, AlertCircle, CheckCircle2 } from 'lucide-react';
import { TonConnectButton } from '@tonconnect/ui-react';

type Tab = 'external' | 'internal' | 'import';

export const WalletSelector = () => {
    const { i18n } = useTranslation();
    const isTR = i18n.language?.startsWith('tr');
    const {
        walletType,
        setWalletType,
        activeAddress,
        internalWallet,
        createInternalWallet,
        importWallet,
        logoutInternal,
        balances
    } = useWallet();

    const [isOpen, setIsOpen]           = useState(false);
    const [activeTab, setActiveTab]     = useState<Tab>('external');
    const [showMnemonic, setShowMnemonic] = useState(false);
    const [importPhrase, setImportPhrase] = useState('');
    const [importing, setImporting]     = useState(false);
    const [importError, setImportError] = useState('');
    const [importSuccess, setImportSuccess] = useState(false);

    const copyAddress = () => {
        if (activeAddress) navigator.clipboard.writeText(activeAddress);
    };

    const shortAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

    const handleImport = async () => {
        if (!importPhrase.trim()) return;
        setImporting(true);
        setImportError('');
        setImportSuccess(false);
        try {
            await importWallet(importPhrase);
            setImportSuccess(true);
            setImportPhrase('');
            setTimeout(() => {
                setActiveTab('internal');
                setImportSuccess(false);
            }, 1500);
        } catch (e: any) {
            setImportError(
                isTR
                    ? (e?.message?.includes('24') ? '❌ 24 kelimelik seed phrase giriniz.' : '❌ Geçersiz seed phrase. Lütfen kontrol edin.')
                    : (e?.message?.includes('24') ? '❌ Please enter a 24-word seed phrase.' : '❌ Invalid seed phrase. Please check and try again.')
            );
        } finally {
            setImporting(false);
        }
    };

    /* ─── TAB STYLES ─── */
    const tabStyle = (t: Tab) => ({
        flex: 1,
        padding: '10px 6px',
        borderRadius: '10px',
        border: 'none',
        background: activeTab === t
            ? t === 'external' ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
            : t === 'internal' ? 'linear-gradient(135deg, #f59e0b, #d97706)'
            : 'linear-gradient(135deg, #22c55e, #16a34a)'
            : 'transparent',
        color: activeTab === t && t === 'internal' ? '#000' : '#fff',
        fontWeight: 800,
        fontSize: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        letterSpacing: '0.3px',
    } as React.CSSProperties);

    return (
        <>
            {/* ── Trigger Button ── */}
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
                    {activeAddress ? shortAddress(activeAddress) : (isTR ? 'Cüzdan Bağla' : 'Connect Wallet')}
                </span>
            </motion.button>

            {/* ── Modal ── */}
            <AnimatePresence>
                {isOpen && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
                        />

                        {/* Card */}
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
                                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                            }}
                        >
                            <h3 style={{ margin: '0 0 20px', fontSize: '1.2rem', fontWeight: 900, textAlign: 'center' }}>
                                💎 {isTR ? 'Cüzdan Seçenekleri' : 'Wallet Options'}
                            </h3>

                            {/* ── 3 Tabs ── */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: 'rgba(0,0,0,0.25)', padding: '5px', borderRadius: '14px' }}>
                                <button onClick={() => setActiveTab('external')} style={tabStyle('external')}>
                                    TON CONNECT
                                </button>
                                <button onClick={() => setActiveTab('internal')} style={tabStyle('internal')}>
                                    TASTE WALLET
                                </button>
                                <button onClick={() => setActiveTab('import')} style={tabStyle('import')}>
                                    {isTR ? '+ EKLE' : '+ IMPORT'}
                                </button>
                            </div>

                            <div style={{ minHeight: '200px' }}>
                                <AnimatePresence mode="wait">

                                    {/* ── TAB 1: External / TON Connect ── */}
                                    {activeTab === 'external' && (
                                        <motion.div key="external" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', marginBottom: '20px', lineHeight: 1.5 }}>
                                                {isTR
                                                    ? 'Tonkeeper veya MyTonWallet gibi harici bir cüzdan kullanarak bağlanın.'
                                                    : 'Connect using an external wallet like Tonkeeper or MyTonWallet.'}
                                            </p>
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <TonConnectButton />
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* ── TAB 2: Internal / Taste Wallet ── */}
                                    {activeTab === 'internal' && (
                                        <motion.div key="internal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            {!internalWallet ? (
                                                <div style={{ textAlign: 'center' }}>
                                                    <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px', lineHeight: 1.5 }}>
                                                        {isTR
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
                                                        <Plus size={18} /> {isTR ? 'YENİ CÜZDAN OLUŞTUR' : 'CREATE NEW WALLET'}
                                                    </button>
                                                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '12px' }}>
                                                        {isTR ? 'Mevcut bir cüzdanı içe aktarmak için' : 'To import an existing wallet, use the'}{' '}
                                                        <span
                                                            onClick={() => setActiveTab('import')}
                                                            style={{ color: '#22c55e', cursor: 'pointer', fontWeight: 700, textDecoration: 'underline' }}
                                                        >
                                                            {isTR ? '+ Ekle' : '+ Import'} {isTR ? 'sekmesini kullan' : 'tab'}
                                                        </span>
                                                    </p>
                                                </div>
                                            ) : (
                                                <div>
                                                    {/* Address */}
                                                    <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '15px' }}>
                                                        <div style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 800, marginBottom: '5px' }}>
                                                            {isTR ? 'CÜZDAN ADRESİNİZ' : 'YOUR WALLET ADDRESS'}
                                                        </div>
                                                        <div style={{ fontSize: '12px', color: '#fff', wordBreak: 'break-all', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
                                                            {internalWallet.address}
                                                            <Copy size={16} onClick={copyAddress} style={{ cursor: 'pointer', flexShrink: 0, color: '#94a3b8' }} />
                                                        </div>
                                                    </div>

                                                    {/* Balances */}
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

                                                    {/* Backup words */}
                                                    <button
                                                        onClick={() => setShowMnemonic(!showMnemonic)}
                                                        style={{
                                                            width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
                                                            background: 'transparent', color: '#fff', fontWeight: 700,
                                                            fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '10px'
                                                        }}
                                                    >
                                                        <Key size={16} /> {showMnemonic ? (isTR ? 'KELİMELERİ GİZLE' : 'HIDE WORDS') : (isTR ? 'YEDEKLEME KELİMELERİ' : 'BACKUP WORDS')}
                                                    </button>

                                                    {showMnemonic && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                                            style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)', padding: '15px', borderRadius: '12px', marginBottom: '15px' }}
                                                        >
                                                            <p style={{ fontSize: '11px', color: '#f59e0b', marginBottom: '10px', fontWeight: 700 }}>
                                                                ⚠️ {isTR ? 'BU KELİMELERİ KİMSEYLE PAYLAŞMAYIN!' : 'NEVER SHARE THESE WORDS!'}
                                                            </p>
                                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                                                                {internalWallet.mnemonic.map((word: string, i: number) => (
                                                                    <div key={i} style={{ fontSize: '11px', color: '#fff', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '6px', textAlign: 'center' }}>
                                                                        <span style={{ color: '#94a3b8', marginRight: '4px' }}>{i + 1}.</span>{word}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </motion.div>
                                                    )}

                                                    <button
                                                        onClick={logoutInternal}
                                                        style={{
                                                            width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                                                            background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontWeight: 700,
                                                            fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                                        }}
                                                    >
                                                        <LogOut size={16} /> {isTR ? 'BU CÜZDANDAN ÇIK' : 'LOGOUT FROM THIS WALLET'}
                                                    </button>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}

                                    {/* ── TAB 3: Import Wallet ── */}
                                    {activeTab === 'import' && (
                                        <motion.div key="import" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                                <Download size={32} color="#22c55e" />
                                                <p style={{ fontSize: '13px', color: '#94a3b8', marginTop: '8px', lineHeight: 1.5 }}>
                                                    {isTR
                                                        ? 'Mevcut TON cüzdanınızı 24 kelimelik kurtarma ifadesiyle içe aktarın.'
                                                        : 'Import your existing TON wallet using its 24-word seed phrase.'}
                                                </p>
                                            </div>

                                            {/* Warning */}
                                            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', padding: '12px', marginBottom: '14px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                                <AlertCircle size={16} color="#f59e0b" style={{ flexShrink: 0, marginTop: '1px' }} />
                                                <p style={{ fontSize: '11px', color: '#fbbf24', margin: 0, lineHeight: 1.6 }}>
                                                    {isTR
                                                        ? 'Seed phrase\'inizi yalnızca güvenilir cihazlarda girin. Kimseyle paylaşmayın!'
                                                        : 'Only enter your seed phrase on trusted devices. Never share it!'}
                                                </p>
                                            </div>

                                            {/* Textarea */}
                                            <textarea
                                                value={importPhrase}
                                                onChange={e => { setImportPhrase(e.target.value); setImportError(''); }}
                                                placeholder={isTR ? '24 kelimeyi boşlukla ayırarak girin...\nörnek: word1 word2 word3 ...' : 'Enter 24 words separated by spaces...\nexample: word1 word2 word3 ...'}
                                                rows={4}
                                                style={{
                                                    width: '100%',
                                                    background: 'rgba(0,0,0,0.35)',
                                                    border: `2px solid ${importError ? 'rgba(239,68,68,0.5)' : importSuccess ? 'rgba(34,197,94,0.5)' : 'rgba(34,197,94,0.25)'}`,
                                                    borderRadius: '14px',
                                                    padding: '14px',
                                                    fontSize: '13px',
                                                    color: '#fff',
                                                    outline: 'none',
                                                    resize: 'none',
                                                    fontFamily: 'monospace',
                                                    lineHeight: 1.6,
                                                    boxSizing: 'border-box',
                                                    transition: 'border-color 0.2s',
                                                }}
                                            />

                                            {/* Word count indicator */}
                                            <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', marginBottom: '12px', textAlign: 'right' }}>
                                                {importPhrase.trim() ? `${importPhrase.trim().split(/\s+/).filter(Boolean).length} / 24 ${isTR ? 'kelime' : 'words'}` : ''}
                                            </div>

                                            {/* Error */}
                                            {importError && (
                                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                                    style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '10px 12px', marginBottom: '12px', fontSize: '12px', color: '#fca5a5', display: 'flex', gap: '6px', alignItems: 'center' }}
                                                >
                                                    <AlertCircle size={14} /> {importError}
                                                </motion.div>
                                            )}

                                            {/* Success */}
                                            {importSuccess && (
                                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                                    style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '10px', padding: '10px 12px', marginBottom: '12px', fontSize: '12px', color: '#86efac', display: 'flex', gap: '6px', alignItems: 'center' }}
                                                >
                                                    <CheckCircle2 size={14} /> {isTR ? '✅ Cüzdan başarıyla içe aktarıldı!' : '✅ Wallet imported successfully!'}
                                                </motion.div>
                                            )}

                                            {/* Import Button */}
                                            <motion.button
                                                whileTap={{ scale: 0.97 }}
                                                onClick={handleImport}
                                                disabled={importing || !importPhrase.trim()}
                                                style={{
                                                    width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
                                                    background: (!importPhrase.trim() || importing) ? '#1e3a2e' : 'linear-gradient(135deg, #22c55e, #16a34a)',
                                                    color: (!importPhrase.trim() || importing) ? '#4b7a5d' : '#fff',
                                                    fontWeight: 900, fontSize: '14px', cursor: (!importPhrase.trim() || importing) ? 'not-allowed' : 'pointer',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                                    boxShadow: importPhrase.trim() ? '0 4px 15px rgba(34,197,94,0.3)' : 'none',
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                {importing
                                                    ? (isTR ? '⏳ Doğrulanıyor...' : '⏳ Verifying...')
                                                    : <><Download size={16} /> {isTR ? 'CÜZDANI İÇE AKTAR' : 'IMPORT WALLET'}</>
                                                }
                                            </motion.button>
                                        </motion.div>
                                    )}

                                </AnimatePresence>
                            </div>

                            {/* Close */}
                            <button
                                onClick={() => setIsOpen(false)}
                                style={{
                                    marginTop: '20px', width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
                                    background: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontWeight: 800,
                                    fontSize: '12px', cursor: 'pointer'
                                }}
                            >
                                {isTR ? 'KAPAT' : 'CLOSE'}
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
