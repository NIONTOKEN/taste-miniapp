import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function RewardCountdown() {
  const { t, i18n } = useTranslation()
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date('2026-05-20T00:00:00').getTime();
    const update = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) return;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const boxStyle = {
    background: 'rgba(34, 197, 94, 0.08)',
    border: '1px solid rgba(34, 197, 94, 0.2)',
    borderRadius: '8px', padding: '6px 10px',
    textAlign: 'center' as const, minWidth: '50px'
  };

  return (
    <div style={{
      marginBottom: '15px',
      background: 'rgba(34,197,94,0.04)',
      border: '1px solid rgba(34,197,94,0.12)',
      borderRadius: '12px',
      padding: '12px 10px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', fontSize: '11px', color: '#4ade80', fontWeight: 900, marginBottom: '8px' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite', flexShrink: 0 }} />
        {i18n.language?.startsWith('tr') ? '20 MAYIS BÜYÜK AİRDROP SON!!' : 'MAY 20 BIG AIRDROP DEADLINE!!'}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
        <div style={boxStyle}>
          <div style={{ fontSize: '16px', fontWeight: '800', color: '#22c55e' }}>{timeLeft.days}</div>
          <div style={{ fontSize: '9px', color: '#4ade8080' }}>{t('app.units.day')}</div>
        </div>
        <div style={boxStyle}>
          <div style={{ fontSize: '16px', fontWeight: '800', color: '#22c55e' }}>{timeLeft.hours}</div>
          <div style={{ fontSize: '9px', color: '#4ade8080' }}>{t('app.units.hr')}</div>
        </div>
        <div style={boxStyle}>
          <div style={{ fontSize: '16px', fontWeight: '800', color: '#22c55e' }}>{timeLeft.minutes}</div>
          <div style={{ fontSize: '9px', color: '#4ade8080' }}>{t('app.units.min')}</div>
        </div>
        <div style={boxStyle}>
          <div style={{ fontSize: '16px', fontWeight: '800', color: '#22c55e' }}>{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div style={{ fontSize: '9px', color: '#4ade8080' }}>{t('app.units.sec')}</div>
        </div>
      </div>
    </div>
  );
}
