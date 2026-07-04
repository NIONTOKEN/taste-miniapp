import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Delete, Fingerprint, ChevronLeft } from 'lucide-react';

const PinLock = ({ correctPin, onSuccess, onReset, t }) => {
  const [inputPin, setInputPin] = useState('');
  const [error, setError] = useState(false);

  const handleInput = (num) => {
    if (inputPin.length < 6) {
        setInputPin(inputPin + num);
        setError(false);
    }
  };

  const handleDelete = () => {
    setInputPin(inputPin.slice(0, -1));
    setError(false);
  };

  useEffect(() => {
    if (inputPin.length === 6) {
        if (inputPin === correctPin) {
            onSuccess();
        } else {
            setError(true);
            setTimeout(() => setInputPin(''), 500);
        }
    }
  }, [inputPin]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#09090b', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px 20px', justifyContent: 'center' }}>
        
        <div style={{ width: '70px', height: '70px', background: 'rgba(99,102,241,0.1)', borderRadius: '22px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', border: '1px solid rgba(99,102,241,0.2)' }}>
            <Lock size={32} color="#6366f1" />
        </div>

        <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#fff', marginBottom: '8px' }}>{t('pin.unlock')}</h2>
        <p style={{ color: '#71717a', marginBottom: '40px', textAlign: 'center', fontSize: '0.9rem' }}>{t('pin.desc')}</p>

        {/* Dots */}
        <motion.div 
            animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
            style={{ display: 'flex', gap: '15px', marginBottom: '40px' }}
        >
            {[...Array(6)].map((_, i) => (
                <div key={i} style={{ width: '14px', height: '14px', borderRadius: '50%', border: '2px solid #6366f1', background: inputPin.length > i ? '#6366f1' : 'transparent', transition: 'all 0.1s', borderColor: error ? '#ef4444' : '#6366f1' }} />
            ))}
        </motion.div>

        {/* Keypad */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', maxWidth: '280px', width: '100%' }}>
            {[1,2,3,4,5,6,7,8,9].map(n => (
                <button key={n} onClick={() => handleInput(n)} style={{ height: '65px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', fontSize: '1.4rem', fontWeight: 'bold', cursor: 'pointer' }}>{n}</button>
            ))}
            <button onClick={() => setInputPin('')} style={{ height: '65px', background: 'transparent', color: '#71717a', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ChevronLeft size={24} />
            </button>
            <button onClick={() => handleInput(0)} style={{ height: '65px', borderRadius: '20px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', fontSize: '1.4rem', fontWeight: 'bold', cursor: 'pointer' }}>0</button>
            <button onClick={handleDelete} style={{ height: '65px', background: 'transparent', color: '#71717a', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Delete size={24} />
            </button>
        </div>

        <p onClick={onReset} style={{ marginTop: '40px', color: '#71717a', fontSize: '0.8rem', textAlign: 'center', cursor: 'pointer' }}>{t('pin.forgot')}</p>
    </div>
  );
};

export default PinLock;
