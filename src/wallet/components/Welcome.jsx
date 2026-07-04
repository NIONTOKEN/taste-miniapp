import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateMnemonic, validateMnemonic, deriveAllAddresses, saveWallet } from '../walletService';
import { Eye, EyeOff, Copy, CheckCircle, Lock, Delete, ChevronLeft, ChevronRight, X, AlertCircle } from 'lucide-react';
import * as bip39 from 'bip39';

const Welcome = ({ setHasWallet, setWalletData, t, lang, setLang, onCancel }) => {
  // Eğer cüzdan ekleme modundaysak (onCancel var) direkt main'den başla
  const [screen, setScreen] = useState(onCancel ? 'main' : 'language');
  const [mnemonic, setMnemonic] = useState('');
  const [importPhrase, setImportPhrase] = useState('');
  const [currentWord, setCurrentWord] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [is24Words, setIs24Words] = useState(false);

  // Autocomplete Listesi (BIP39 English)
  const wordlist = useMemo(() => bip39.wordlists.english, []);

  const suggestions = useMemo(() => {
     if (currentWord.length < 2) return [];
     return wordlist.filter(w => w.startsWith(currentWord)).slice(0, 5);
  }, [currentWord, wordlist]);

   const addWord = (word) => {
      const parts = importPhrase.split(/\s+/).filter(w => w !== '');
      if (parts.length < 24) {
         const newPhrase = [...parts, word].join(' ');
         setImportPhrase(newPhrase);
         setCurrentWord('');
         document.getElementById('mnemonic-input')?.focus();
      }
   };

  // Doğrulama İçin (Shuffled System)
  const [selectedWords, setSelectedWords] = useState([]);
  
  // Shuffled mnemonic for buttons
  const shuffledMnemonic = useMemo(() => {
    if (!mnemonic) return [];
    return [...mnemonic.split(' ')].sort(() => Math.random() - 0.5);
  }, [mnemonic, screen]);

  // PIN İçin
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isConfirmingPin, setIsConfirmingPin] = useState(false);

  const handleCreate = async () => {
    const phrase = await generateMnemonic(is24Words);
    setMnemonic(phrase);
    setScreen('create');
  };

  const handleWordClick = (word) => {
     const nextIndex = selectedWords.length;
     const words = mnemonic.split(/\s+/);
     
     if (word === words[nextIndex]) {
        setSelectedWords([...selectedWords, word]);
        setError('');
        if (nextIndex === words.length - 1) {
            setScreen('pin');
        }
     } else {
        setError(t('welcome.incorrectOrder') || 'Incorrect word order! Please try again.');
        setTimeout(() => setError(''), 2000);
     }
  };

  const handlePinInput = (num) => {
    const current = isConfirmingPin ? confirmPin : pin;
    if (current.length < 6) {
        if (isConfirmingPin) setConfirmPin(current + num);
        else setPin(current + num);
    }
  };

  const handlePinDelete = () => {
    const current = isConfirmingPin ? confirmPin : pin;
    if (isConfirmingPin) {
        if (confirmPin.length === 0) setIsConfirmingPin(false);
        else setConfirmPin(current.slice(0, -1));
    } else {
        setPin(current.slice(0, -1));
    }
  };

  useEffect(() => {
    if (pin.length === 6 && !isConfirmingPin) {
        setTimeout(() => setIsConfirmingPin(true), 300);
    }
    if (confirmPin.length === 6 && isConfirmingPin) {
        if (pin === confirmPin) {
            setScreen('name');
        } else {
            setError(t('welcome.incorrectOrder') || 'PINs do not match. Try again.');
            setPin('');
            setConfirmPin('');
            setIsConfirmingPin(false);
        }
    }
  }, [pin, confirmPin]);

  const [walletName, setWalletName] = useState('');

  const handleFinalize = async (phrase, userPin, name) => {
    setLoading(true);
    setError('');
    try {
      const addresses = await deriveAllAddresses(phrase);
      const walletObj = {
        addresses,
        mnemonic: phrase,
        pin: userPin,
        name: name || `Wallet ${new Date().toLocaleDateString()}`,
        settings: { pinEnabled: true, biometricsEnabled: false }
      };
      localStorage.setItem('qai_wallet', JSON.stringify(walletObj));
      setWalletData(walletObj);
      setHasWallet(true);
    } catch (e) {
      setError((t('welcome.errorCreating') || 'Error: ') + e.message);
      setLoading(false);
    }
  };

  const handleImport = async () => {
    setError('');
    setLoading(true);
    const trimmed = importPhrase.trim().toLowerCase();
    const isValid = await validateMnemonic(trimmed);
    if (!isValid) {
       setError(t('welcome.invalidMnemonic') || "Invalid mnemonic phrase. Please check and try again.");
       setLoading(false);
       return;
    }
    setMnemonic(trimmed);
    setLoading(false);
    setScreen('pin'); 
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#09090b', zIndex: 10000, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
        <div style={{ width: '50px', height: '50px', border: '4px solid rgba(99,102,241,0.2)', borderTop: '4px solid #6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#71717a', marginTop: '20px', fontWeight: 'bold' }}>{t('welcome.loading')}</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#fff', position: 'relative', overflow: 'hidden' }}>
      
      <AnimatePresence mode="wait">
        
        {/* 0. LANGUAGE SELECTION SCREEN */}
        {screen === 'language' && (
           <motion.div key="language" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '40px 30px', display: 'flex', flexDirection: 'column', height: '90vh', justifyContent: 'center', alignItems: 'center' }}>
             <h1 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '10px' }}>Select Language</h1>
             <p style={{ color: '#71717a', marginBottom: '40px' }}>Choose your preferred language</p>
             
             {[
                { id: 'tr', label: 'Türkçe', flag: '🇹🇷' },
                { id: 'en', label: 'English', flag: '🇺🇸' },
                { id: 'ru', label: 'Русский', flag: '🇷🇺' },
                { id: 'zh', label: '简体中文', flag: '🇨🇳' },
             ].map(l => (
                <button key={l.id} onClick={() => { setLang(l.id); setScreen('main'); }} style={{ width: '100%', padding: '18px', background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: '20px', border: lang === l.id ? '2px solid var(--primary)' : '1px solid rgba(255,255,255,0.1)', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
                    <span style={{ fontSize: '1.6rem' }}>{l.flag}</span>
                    {l.label}
                </button>
             ))}
           </motion.div>
        )}

        {/* 1. MAIN SCREEN */}
        {screen === 'main' && (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ padding: '40px 30px', display: 'flex', flexDirection: 'column', height: '90vh', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
            {/* Geri / Kapat butonu */}
            {onCancel && (
              <button onClick={onCancel} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: '1.2rem' }}>
                ✕
              </button>
            )}
            {!onCancel && (
              <div onClick={() => setScreen('language')} style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '6px', color: '#71717a', cursor: 'pointer', fontSize: '0.9rem' }}>
                <ChevronLeft size={20} /> {t('welcome.back')}
              </div>
            )}
            <div style={{ width: '100px', height: '100px', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', borderRadius: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '25px', boxShadow: '0 20px 40px rgba(99,102,241,0.3)' }}>
              <Lock size={50} color="#fff" />
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: '900', textAlign: 'center', marginBottom: '10px', letterSpacing: '-1px' }}>{t('welcome.title')}</h1>
            <p style={{ color: '#71717a', textAlign: 'center', marginBottom: '50px', lineHeight: '1.6', fontSize: '0.95rem' }}>{t('welcome.subtitle')}</p>
            
            <button onClick={handleCreate} style={{ width: '100%', padding: '18px', background: '#fff', color: '#000', borderRadius: '20px', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px' }}>
              {t('welcome.create')}
            </button>

            <div style={{ display: 'flex', gap: '10px', width: '100%', marginBottom: '25px' }}>
                <button 
                  onClick={() => setIs24Words(false)} 
                  style={{ flex: 1, padding: '12px', background: !is24Words ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)', color: !is24Words ? '#6366f1' : '#71717a', border: !is24Words ? '1px solid #6366f1' : '1px solid transparent', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  12 {t('welcome.word')} ({t('welcome.fast')})
                </button>
                <button 
                  onClick={() => setIs24Words(true)} 
                  style={{ flex: 1, padding: '12px', background: is24Words ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)', color: is24Words ? '#6366f1' : '#71717a', border: is24Words ? '1px solid #6366f1' : '1px solid transparent', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  24 {t('welcome.word')} ({t('welcome.ultraSafe')})
                </button>
            </div>

            <button onClick={() => setScreen('import')} style={{ width: '100%', padding: '18px', background: 'rgba(255,255,255,0.05)', color: '#fff', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', marginBottom: onCancel ? '15px' : '0' }}>
              {t('welcome.import')}
            </button>

            {onCancel && (
              <button onClick={onCancel} style={{ width: '100%', padding: '18px', background: 'transparent', color: 'var(--text-muted)', borderRadius: '20px', border: '1px solid var(--glass-border)', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                {t('profile.no')}
              </button>
            )}
          </motion.div>
        )}

        {/* 2. CREATE SCREEN (WORDS) */}
        {screen === 'create' && (
           <motion.div key="create" initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }} style={{ padding: '30px' }}>
                 <h2 style={{ fontSize: '1.6rem', fontWeight: '900', marginBottom: '8px' }}>{t('welcome.secretTitle')}</h2>
                 <p style={{ color: '#71717a', fontSize: '0.9rem', marginBottom: '25px', lineHeight: '1.5' }}>{t('welcome.secretDesc')}</p>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: '#18181b', padding: '15px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '25px' }}>
                    {mnemonic.split(' ').map((word, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <span style={{ fontSize: '0.6rem', color: '#71717a', display: 'block' }}>{i+1}</span>
                            <span style={{ fontWeight: 'bold', fontSize: '0.85rem' }}>{word}</span>
                        </div>
                    ))}
                 </div>

                 <button onClick={() => setScreen('verify')} style={{ width: '100%', padding: '18px', background: 'var(--primary)', color: '#fff', borderRadius: '20px', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' }}>
                    {t('welcome.writtenDown')}
                 </button>
           </motion.div>
        )}

        {/* 3. VERIFY SCREEN (Karma Seçim Sistemi) */}
        {screen === 'verify' && (
            <motion.div key="verify" initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ padding: '25px', paddingBottom: '50px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: '900', marginBottom: '8px' }}>{t('welcome.verifyTitle')}</h2>
                <p style={{ color: '#71717a', fontSize: '0.9rem', marginBottom: '25px' }}>{t('welcome.verifyDesc')}</p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '100px', background: '#18181b', padding: '15px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '25px' }}>
                    {selectedWords.map((word, i) => (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} key={i} style={{ background: 'var(--primary)', color: '#fff', padding: '6px 12px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                            <span style={{ opacity: 0.7, marginRight: '5px' }}>{i+1}.</span>{word}
                        </motion.span>
                    ))}
                    {selectedWords.length < (mnemonic.split(/\s+/).filter(w => w !== '').length) && (
                        <span style={{ color: '#71717a', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>
                           {t('welcome.selectWordPrefix')} {selectedWords.length + 1}
                        </span>
                    )}
                </div>

                {error && (
                    <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', marginBottom: '20px', background: 'rgba(239,68,68,0.1)', padding: '12px', borderRadius: '15px', fontSize: '0.85rem' }}>
                        <AlertCircle size={18} /> {error}
                    </motion.div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {shuffledMnemonic.map((word, i) => {
                        const isChosen = selectedWords.includes(word);
                        return (
                            <motion.button 
                                key={i}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => !isChosen && handleWordClick(word)}
                                disabled={isChosen}
                                style={{ 
                                    padding: '12px 5px', height: '50px', background: isChosen ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)', 
                                    color: isChosen ? 'transparent' : '#fff', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.05)', 
                                    fontSize: '0.85rem', fontWeight: 'bold', cursor: isChosen ? 'default' : 'pointer', transition: 'all 0.2s' 
                                }}
                            >
                                {word}
                            </motion.button>
                        );
                    })}
                </div>

                <div 
                   onClick={() => { setSelectedWords([]); setScreen('create'); }}
                   style={{ textAlign: 'center', marginTop: '30px', color: 'var(--text-muted)', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                >
                    <ChevronLeft size={18} /> {t('welcome.goBackView')}
                </div>
            </motion.div>
        )}

        {/* 4. PIN SCREEN */}
        {screen === 'pin' && (
            <motion.div key="pin" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ padding: '40px 30px', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '8px' }}>{isConfirmingPin ? t('welcome.confirmPin') : t('welcome.createPin')}</h2>
                <p style={{ color: '#71717a', marginBottom: '35px', fontSize: '0.9rem' }}>{t('welcome.pinDesc')}</p>

                {/* PIN Dots */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px' }}>
                    {[...Array(6)].map((_, i) => (
                        <div key={i} style={{ width: '15px', height: '15px', borderRadius: '50%', border: '2px solid #6366f1', background: (isConfirmingPin ? confirmPin : pin).length > i ? '#6366f1' : 'transparent', transition: 'all 0.1s' }} />
                    ))}
                </div>

                {error && <p style={{ color: '#ef4444', marginBottom: '20px' }}>{error}</p>}

                {/* Keypad */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', maxWidth: '280px', margin: '0 auto', width: '100%' }}>
                    {[1,2,3,4,5,6,7,8,9].map(n => (
                        <button key={n} onClick={() => handlePinInput(n)} style={{ height: '65px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', fontSize: '1.4rem', fontWeight: 'bold', cursor: 'pointer' }}>{n}</button>
                    ))}
                    <button onClick={() => { if(isConfirmingPin) setIsConfirmingPin(false); else setScreen('main'); }} style={{ height: '65px', background: 'transparent', color: '#71717a', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={() => handlePinInput(0)} style={{ height: '65px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', fontSize: '1.4rem', fontWeight: 'bold', cursor: 'pointer' }}>0</button>
                    <button onClick={handlePinDelete} style={{ height: '65px', background: 'transparent', color: '#71717a', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Delete size={24} />
                    </button>
                </div>
            </motion.div>
        )}

        {/* 5. WALLET NAME SCREEN */}
        {screen === 'name' && (
            <motion.div key="name" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ padding: '40px 30px', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ width: '70px', height: '70px', background: 'linear-gradient(135deg,#6366f1,#4f46e5)', borderRadius: '22px', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px', boxShadow: '0 10px 25px rgba(99,102,241,0.3)' }}>
                    <span style={{ fontSize: '2rem' }}>🏷️</span>
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: '900', marginBottom: '8px' }}>{t('welcome.nameWallet')}</h2>
                <p style={{ color: '#71717a', marginBottom: '35px', fontSize: '0.9rem' }}>{t('welcome.nameDesc')}</p>

                <input
                    type="text"
                    value={walletName}
                    onChange={e => setWalletName(e.target.value)}
                    placeholder={t('welcome.placeholderName')}
                    maxLength={24}
                    style={{ width: '100%', background: '#27272a', border: '2px solid #3f3f46', padding: '18px', borderRadius: '20px', color: '#fff', fontSize: '1.1rem', outline: 'none', marginBottom: '20px', boxSizing: 'border-box', textAlign: 'center', fontWeight: '700' }}
                />

                <button
                    onClick={() => handleFinalize(mnemonic, pin, walletName || 'My Wallet')}
                    style={{ width: '100%', padding: '18px', background: 'var(--primary)', color: '#fff', borderRadius: '20px', border: 'none', fontSize: '1.1rem', fontWeight: '900', cursor: 'pointer', marginBottom: '12px' }}>
                    {t('welcome.create')}
                </button>
                <button
                    onClick={() => handleFinalize(mnemonic, pin, 'My Wallet')}
                    style={{ width: '100%', padding: '14px', background: 'transparent', color: '#71717a', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer' }}>
                    {t('welcome.skip')}
                </button>
            </motion.div>
        )}

        {/* 6. IMPORT SCREEN (SMART AUTOCOMPLETE) */}
        {screen === 'import' && (
            <motion.div key="import" initial={{ x: 300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={{ padding: '25px', display: 'flex', flexDirection: 'column', height: '90vh' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                    <ChevronLeft size={28} onClick={() => setScreen('main')} style={{ cursor: 'pointer' }} />
                    <h2 style={{ fontSize: '1.6rem', fontWeight: '900', margin: 0 }}>{t('welcome.importTitle')}</h2>
                </div>
                <p style={{ color: '#71717a', marginBottom: '25px', fontSize: '0.9rem' }}>{t('welcome.importDesc')}</p>
                
                {/* Visual Words Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: '#18181b', padding: '15px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '20px', maxHeight: '200px', overflowY: 'auto' }}>
                    {importPhrase.split(/\s+/).filter(w => w !== '').map((word, i) => (
                        <div key={i} style={{ background: 'rgba(99,102,241,0.1)', padding: '8px 12px', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#6366f1' }}>{i+1}. {word}</span>
                            <X size={14} onClick={() => {
                                const parts = importPhrase.split(/\s+/).filter(w => w !== '');
                                parts.splice(i, 1);
                                setImportPhrase(parts.join(' '));
                            }} style={{ cursor: 'pointer', opacity: 0.5 }} />
                        </div>
                    ))}
                    {importPhrase.split(/\s+/).filter(w => w !== '').length < 12 && (
                        <div style={{ padding: '8px 12px', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem', textAlign: 'center' }}>
                            Word {importPhrase.split(/\s+/).filter(w => w !== '').length + 1}
                        </div>
                    )}
                </div>

                {/* Smart Input field */}
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                    <input 
                        id="mnemonic-input"
                        type="text"
                        autoFocus
                        placeholder="Type word here..."
                        autoCapitalize="none"
                        value={currentWord}
                        onChange={(e) => {
                           const val = e.target.value.toLowerCase().replace(/[^a-z]/g, '');
                           setCurrentWord(val);
                           // BIP39 wordlist matching (Approximate list using bip39 library if available or hardcode common ones)
                           // For now, let's assume wordlist check here (Simplified)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === ' ' && currentWord.length > 2) {
                                e.preventDefault();
                                addWord(currentWord);
                            }
                        }}
                        style={{ width: '100%', background: '#27272a', border: '2px solid #3f3f46', padding: '18px', borderRadius: '20px', color: '#fff', fontSize: '1.2rem', outline: 'none', transition: 'border-color 0.2s' }}
                    />
                    
                    {/* Word Suggestions Bar */}
                    <AnimatePresence>
                        {currentWord.length >= 2 && (
                            <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 10, opacity: 0 }} style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, background: '#18181b', padding: '10px', borderRadius: '15px 15px 0 0', border: '1px solid rgba(255,255,255,0.1)', borderBottom: 'none', display: 'flex', gap: '8px', overflowX: 'auto', whiteSpace: 'nowrap', zIndex: 10 }}>
                                {suggestions.map((s, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => addWord(s)}
                                        style={{ padding: '8px 16px', background: 'rgba(99,102,241,0.2)', color: '#6366f1', borderRadius: '10px', border: '1px solid rgba(99,102,241,0.3)', fontWeight: 'bold', fontSize: '0.9rem', cursor: 'pointer' }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <button 
                        onClick={async () => {
                            const text = await navigator.clipboard.readText();
                            if (text) setImportPhrase(text.toLowerCase().trim());
                        }}
                        style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', color: '#a1a1aa', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem', fontWeight: 'bold' }}
                    >
                        {t('welcome.pasteClipboard')}
                    </button>
                    <button 
                        onClick={() => { setImportPhrase(''); setCurrentWord(''); }}
                        style={{ padding: '12px', background: 'rgba(239,68,68,0.05)', color: '#ef4444', borderRadius: '15px', border: '1px solid rgba(239,68,68,0.1)', fontSize: '0.85rem', fontWeight: 'bold' }}
                    >
                        {t('welcome.clear')}
                    </button>
                </div>
                
                {error && (
                    <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} style={{ marginBottom: '20px', padding: '12px', background: 'rgba(239,68,68,0.1)', borderRadius: '12px', color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>
                       {error}
                    </motion.div>
                )}
                
                <button 
                    disabled={importPhrase.split(/\s+/).filter(w => (w !== '')).length < 12}
                    onClick={handleImport} 
                    style={{ width: '100%', marginTop: 'auto', padding: '20px', background: 'var(--primary)', color: '#fff', borderRadius: '22px', border: 'none', fontSize: '1.2rem', fontWeight: '900', cursor: 'pointer', opacity: importPhrase.split(/\s+/).filter(w => (w !== '')).length < 12 ? 0.4 : 1 }}
                >
                    {t('welcome.importTitle').toUpperCase()}
                </button>
            </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};

export default Welcome;
