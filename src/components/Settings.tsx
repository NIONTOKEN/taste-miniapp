import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Share2, Key, Palette, Globe, Shield, Wallet, ChevronRight, X, AlertTriangle } from 'lucide-react';
import { internalWalletService } from '../services/internalWallet';

export function Settings() {
    const { t, i18n } = useTranslation();
    const isTr = i18n.language?.startsWith('tr');
    
    // States
    const [currentTheme, setCurrentTheme] = useState(localStorage.getItem('taste_theme') || 'default');
    const [hasPin, setHasPin] = useState(!!localStorage.getItem('taste_app_pin'));
    const [showPinModal, setShowPinModal] = useState(false);
    const [showSeedModal, setShowSeedModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    
    // Local temporary states for modals
    const [pinInput, setPinInput] = useState('');
    const [pinConfirm, setPinConfirm] = useState('');
    const [step, setStep] = useState(1);
    const [seedWords, setSeedWords] = useState<string[]>([]);
    const [importText, setImportText] = useState('');
    const [error, setError] = useState('');
    const [walletInfo, setWalletInfo] = useState<any>(null);

    const userId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString() || '0';
    const referralLink = `https://t.me/TasteTokenBot?start=${userId}`;

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('taste_theme', currentTheme);
    }, [currentTheme]);

    useEffect(() => {
        internalWalletService.getWalletInfo().then(info => setWalletInfo(info));
    }, []);

    const themes = [
        { id: 'default', name: 'Premium Gold', color: '#f59e0b' },
        { id: 'red', name: 'Ruby Red', color: '#ef4444' },
        { id: 'green', name: 'Emerald Green', color: '#22c55e' },
        { id: 'blue', name: 'Ocean Blue', color: '#3b82f6' },
        { id: 'black', name: 'Midnight Black', color: '#64748b' },
        { id: 'light', name: 'Light Mode', color: '#f8fafc' }
    ];

    const languages = [
        { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
        { code: 'en', label: 'English', flag: '🇬🇧' },
        { code: 'ru', label: 'Русский', flag: '🇷🇺' },
        { code: 'ar', label: 'العربية', flag: '🇸🇦' },
        { code: 'zh', label: '简体中文', flag: '🇨🇳' }
    ];

    const handleShare = () => {
        const text = isTr 
            ? 'Taste Token Miniapp\'e katıl ve birlikte kazanalım!' 
            : 'Join Taste Token Miniapp and let\'s earn together!';
        const fullUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`;
        if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.openTelegramLink(fullUrl);
        } else {
            window.open(fullUrl, '_blank');
        }
    };

    const handleSetPin = () => {
        if (pinInput.length !== 4) return setError(isTr ? 'PIN 4 haneli olmalı' : 'PIN must be 4 digits');
        if (step === 1) {
            setStep(2);
            setError('');
        } else if (step === 2) {
            if (pinInput === pinConfirm) {
                localStorage.setItem('taste_app_pin', pinInput);
                setHasPin(true);
                setShowPinModal(false);
                setPinInput('');
                setPinConfirm('');
                setStep(1);
            } else {
                setError(isTr ? 'PINler eşleşmiyor' : 'PINs do not match');
            }
        }
    };

    const handleRemovePin = () => {
        localStorage.removeItem('taste_app_pin');
        setHasPin(false);
    };

    const handleShowSeed = async () => {
        if (hasPin) {
            const entered = prompt(isTr ? 'Güvenlik için PIN girin:' : 'Enter PIN for security:');
            if (entered !== localStorage.getItem('taste_app_pin')) {
                alert(isTr ? 'Hatalı PIN!' : 'Incorrect PIN!');
                return;
            }
        }
        const info = await internalWalletService.getWalletInfo();
        if (info && info.mnemonic) {
            setSeedWords(info.mnemonic);
            setShowSeedModal(true);
        } else {
            alert(isTr ? 'Cüzdan bulunamadı.' : 'Wallet not found.');
        }
    };

    const handleImport = async () => {
        try {
            setError('');
            await internalWalletService.importWallet(importText);
            const info = await internalWalletService.getWalletInfo();
            setWalletInfo(info);
            setShowImportModal(false);
            alert(isTr ? 'Cüzdan başarıyla içe aktarıldı!' : 'Wallet imported successfully!');
        } catch (e: any) {
            setError(e.message || 'Geçersiz kelimeler');
        }
    };

    const Card = ({ title, icon: Icon, children }: any) => (
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--primary)' }}>
                <Icon size={20} />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800 }}>{title}</h3>
            </div>
            {children}
        </div>
    );

    return (
        <div style={{ padding: '0 0 80px 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ width: '60px', height: '60px', background: 'rgba(245, 159, 11, 0.1)', borderRadius: '50%', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Key size={30} color="var(--primary)" />
                </div>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 900 }}>{isTr ? 'Ayarlar' : 'Settings'}</h2>
                <p style={{ color: 'var(--text-muted)', margin: '4px 0 0', fontSize: '13px' }}>
                    {isTr ? 'Hesap, güvenlik ve görünüm ayarları' : 'Account, security and appearance'}
                </p>
            </div>

            {/* THEME SETTINGS */}
            <Card title={isTr ? 'Görünüm ve Tema' : 'Appearance & Theme'} icon={Palette}>
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
                    {themes.map(t => (
                        <button
                            key={t.id}
                            onClick={() => setCurrentTheme(t.id)}
                            style={{
                                flexShrink: 0, width: '40px', height: '40px', borderRadius: '50%',
                                background: t.color, cursor: 'pointer',
                                border: currentTheme === t.id ? '3px solid #fff' : '2px solid transparent',
                                boxShadow: currentTheme === t.id ? `0 0 15px ${t.color}` : 'none',
                                transition: 'all 0.2s'
                            }}
                            title={t.name}
                        />
                    ))}
                </div>
            </Card>

            {/* LANGUAGE SETTINGS */}
            <Card title={isTr ? 'Dil (Language)' : 'Language'} icon={Globe}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '8px' }}>
                    {languages.map(l => (
                        <button
                            key={l.code}
                            onClick={() => { i18n.changeLanguage(l.code); localStorage.setItem('i18nextLng', l.code); }}
                            style={{
                                padding: '10px 8px', borderRadius: '12px',
                                background: i18n.language?.startsWith(l.code) ? 'rgba(245, 159, 11, 0.2)' : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${i18n.language?.startsWith(l.code) ? 'var(--primary)' : 'transparent'}`,
                                color: '#fff', fontWeight: 700, cursor: 'pointer',
                                fontSize: '13px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                            }}
                        >
                            <span style={{ fontSize: '16px' }}>{l.flag}</span> <span>{l.label}</span>
                        </button>
                    ))}
                </div>
            </Card>

            {/* SECURITY (PIN) */}
            <Card title={isTr ? 'Güvenlik (PIN)' : 'Security (PIN)'} icon={Shield}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{isTr ? 'Uygulama Şifresi' : 'App Password'}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{isTr ? 'Girişte ve cüzdanda sorulur' : 'Required on open and wallet'}</div>
                    </div>
                    {hasPin ? (
                        <button onClick={handleRemovePin} style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                            {isTr ? 'Kaldır' : 'Remove'}
                        </button>
                    ) : (
                        <button onClick={() => { setStep(1); setPinInput(''); setPinConfirm(''); setShowPinModal(true); }} style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: 'none', padding: '8px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                            {isTr ? 'Oluştur' : 'Set PIN'}
                        </button>
                    )}
                </div>
            </Card>

            {/* WALLET MANAGEMENT */}
            <Card title={isTr ? 'Cüzdan Yönetimi' : 'Wallet Management'} icon={Wallet}>
                {walletInfo ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ fontSize: '12px', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                            {walletInfo.address}
                        </div>
                        <button onClick={handleShowSeed} style={{ background: 'rgba(245, 159, 11, 0.1)', color: 'var(--primary)', border: '1px solid var(--primary-glow)', padding: '10px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                            👁️ {isTr ? 'Gizli Kelimeleri Göster' : 'Show Secret Words'}
                        </button>
                    </div>
                ) : (
                    <div>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                            {isTr ? 'Dahili cüzdanınız yok. Yeni bir tane oluşturabilir veya eski cüzdanınızı (24 kelime) içe aktarabilirsiniz.' : 'No internal wallet found. You can create one or import existing (24 words).'}
                        </p>
                        <button onClick={() => setShowImportModal(true)} style={{ width: '100%', background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.4)', padding: '12px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                            ⬇️ {isTr ? 'Cüzdan İçe Aktar (Import)' : 'Import Wallet'}
                        </button>
                    </div>
                )}
            </Card>

            {/* REFERRAL SYSTEM */}
            <Card title={isTr ? 'Davet Et Kazan' : 'Refer & Earn'} icon={Share2}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    {isTr ? 'Davet ettiğiniz her kişi için oyun içinde ekstra Puan ve Token kazanın!' : 'Earn extra Points and Tokens for every person you invite!'}
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px', fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {referralLink}
                    </div>
                    <button onClick={handleShare} style={{ background: 'var(--primary)', color: '#000', border: 'none', padding: '0 16px', borderRadius: '8px', fontWeight: 800, cursor: 'pointer' }}>
                        {isTr ? 'Paylaş' : 'Share'}
                    </button>
                </div>
            </Card>

            {/* MODALS */}
            
            {/* PIN SETUP MODAL */}
            <AnimatePresence>
                {showPinModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--primary)', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '320px', textAlign: 'center' }}>
                            <h3 style={{ margin: '0 0 16px' }}>{step === 1 ? (isTr ? 'Yeni PIN (4 hane)' : 'New PIN (4 digits)') : (isTr ? 'PIN Tekrar' : 'Confirm PIN')}</h3>
                            <input 
                                type="password" 
                                maxLength={4}
                                value={step === 1 ? pinInput : pinConfirm}
                                onChange={(e) => step === 1 ? setPinInput(e.target.value.replace(/\D/g, '')) : setPinConfirm(e.target.value.replace(/\D/g, ''))}
                                style={{ width: '100px', fontSize: '32px', textAlign: 'center', letterSpacing: '10px', background: 'transparent', border: 'none', borderBottom: '2px solid var(--primary)', color: '#fff', marginBottom: '20px', outline: 'none' }}
                                autoFocus
                            />
                            {error && <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '16px' }}>{error}</div>}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => setShowPinModal(false)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '10px', cursor: 'pointer' }}>{isTr ? 'İptal' : 'Cancel'}</button>
                                <button onClick={handleSetPin} style={{ flex: 1, padding: '12px', background: 'var(--primary)', border: 'none', color: '#000', fontWeight: 800, borderRadius: '10px', cursor: 'pointer' }}>{isTr ? 'Onayla' : 'Confirm'}</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SEED WORDS MODAL */}
            <AnimatePresence>
                {showSeedModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, overflowY: 'auto', padding: '40px 20px' }}>
                        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ margin: 0, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle /> {isTr ? 'Gizli Kelimeler' : 'Secret Words'}</h3>
                                <button onClick={() => setShowSeedModal(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={24} /></button>
                            </div>
                            
                            <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                                <p style={{ margin: 0, fontSize: '12px', color: '#fca5a5', lineHeight: 1.5 }}>
                                    {isTr ? 'UYARI: Bu kelimeleri KİMSE İLE PAYLAŞMAYIN. Bunlar cüzdanınızın anahtarıdır. Kelimeleri sırasıyla bir kağıda yazın ve güvenli bir yerde saklayın.' : 'WARNING: NEVER SHARE these words. They are the master key to your wallet. Write them down sequentially and store securely.'}
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '30px' }}>
                                {seedWords.map((word, i) => (
                                    <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px', fontSize: '14px', display: 'flex', gap: '10px' }}>
                                        <span style={{ color: 'var(--text-muted)', width: '20px' }}>{i + 1}.</span>
                                        <span style={{ fontWeight: 700, color: '#fff' }}>{word}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* IMPORT MODAL */}
            <AnimatePresence>
                {showImportModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.95)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                        <div style={{ background: 'var(--bg-dark)', border: '1px solid var(--primary)', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '360px' }}>
                            <h3 style={{ margin: '0 0 16px', textAlign: 'center' }}>{isTr ? 'Cüzdanı İçe Aktar' : 'Import Wallet'}</h3>
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px', textAlign: 'center' }}>
                                {isTr ? '24 kelimelik cüzdan cümlenizi aralarında boşluk bırakarak yazın.' : 'Enter your 24-word secret phrase separated by spaces.'}
                            </p>
                            <textarea 
                                value={importText}
                                onChange={(e) => setImportText(e.target.value)}
                                style={{ width: '100%', height: '100px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '12px', borderRadius: '10px', resize: 'none', marginBottom: '16px', fontFamily: 'monospace' }}
                                placeholder={isTr ? "word1 word2 word3..." : "word1 word2 word3..."}
                            />
                            {error && <div style={{ color: '#ef4444', fontSize: '12px', marginBottom: '16px', textAlign: 'center' }}>{error}</div>}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button onClick={() => setShowImportModal(false)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '10px', cursor: 'pointer' }}>{isTr ? 'İptal' : 'Cancel'}</button>
                                <button onClick={handleImport} style={{ flex: 1, padding: '12px', background: '#3b82f6', border: 'none', color: '#fff', fontWeight: 800, borderRadius: '10px', cursor: 'pointer' }}>{isTr ? 'İçe Aktar' : 'Import'}</button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
