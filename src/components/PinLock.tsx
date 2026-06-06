import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export function PinLock({ children }: { children: React.ReactNode }) {
    const { t, i18n } = useTranslation();
    const isTr = i18n.language?.startsWith('tr');
    
    const [savedPin, setSavedPin] = useState<string | null>(null);
    const [isUnlocked, setIsUnlocked] = useState<boolean>(true);
    const [pin, setPin] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('taste_app_pin');
        if (stored) {
            setSavedPin(stored);
            setIsUnlocked(false);
        }
    }, []);

    const handleInput = (num: string) => {
        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);
            setError(false);
            
            if (newPin.length === 4) {
                setTimeout(() => verifyPin(newPin), 200);
            }
        }
    };

    const verifyPin = (currentPin: string) => {
        if (currentPin === savedPin) {
            setIsUnlocked(true);
        } else {
            setError(true);
            setTimeout(() => setPin(''), 500);
        }
    };

    const handleDelete = () => {
        setPin(prev => prev.slice(0, -1));
        setError(false);
    };

    if (isUnlocked) {
        return <>{children}</>;
    }

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'var(--bg-dark)', zIndex: 9999,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: '20px'
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 900, color: 'var(--primary)' }}>
                    {isTr ? 'Uygulama Kilitli' : 'App Locked'}
                </h2>
                <p style={{ margin: '8px 0 0', color: 'var(--text-muted)' }}>
                    {isTr ? 'Devam etmek için PIN kodunu girin' : 'Enter PIN to continue'}
                </p>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}>
                {[0, 1, 2, 3].map(i => (
                    <motion.div 
                        key={i}
                        animate={error ? { x: [-5, 5, -5, 5, 0], borderColor: '#ef4444' } : {}}
                        transition={{ duration: 0.3 }}
                        style={{
                            width: '20px', height: '20px',
                            borderRadius: '50%',
                            border: `2px solid ${pin.length > i ? 'var(--primary)' : 'rgba(255,255,255,0.2)'}`,
                            background: pin.length > i ? 'var(--primary)' : 'transparent',
                            transition: 'all 0.2s'
                        }}
                    />
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', maxWidth: '280px', margin: '0 auto' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                        key={num}
                        onClick={() => handleInput(num.toString())}
                        style={{
                            width: '70px', height: '70px', borderRadius: '50%',
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff', fontSize: '24px', fontWeight: 600, cursor: 'pointer'
                        }}
                    >
                        {num}
                    </button>
                ))}
                <div />
                <button
                    onClick={() => handleInput('0')}
                    style={{
                        width: '70px', height: '70px', borderRadius: '50%',
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff', fontSize: '24px', fontWeight: 600, cursor: 'pointer'
                    }}
                >
                    0
                </button>
                <button
                    onClick={handleDelete}
                    style={{
                        width: '70px', height: '70px', borderRadius: '50%',
                        background: 'transparent', border: 'none',
                        color: 'var(--text-muted)', fontSize: '20px', cursor: 'pointer'
                    }}
                >
                    ⌫
                </button>
            </div>
            
            {error && (
                <div style={{ color: '#ef4444', marginTop: '20px', fontSize: '14px', fontWeight: 'bold' }}>
                    {isTr ? 'Hatalı PIN' : 'Incorrect PIN'}
                </div>
            )}
        </motion.div>
    );
}
