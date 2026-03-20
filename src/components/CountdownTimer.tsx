import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function CountdownTimer({ earlyAccessLabel }: { earlyAccessLabel: string }) {
  const { t } = useTranslation()
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date('2027-01-02T00:00:00').getTime();
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

  const boxStyle = { background: 'rgba(245, 159, 11, 0.1)', border: '1px solid rgba(245, 159, 11, 0.2)', borderRadius: '8px', padding: '6px 10px', textAlign: 'center' as const, minWidth: '50px' };

  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 2s infinite' }} />
        {earlyAccessLabel}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
        <div style={boxStyle}>
          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)' }}>{timeLeft.days}</div>
          <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{t('app.units.day')}</div>
        </div>
        <div style={boxStyle}>
          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)' }}>{timeLeft.hours}</div>
          <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{t('app.units.hr')}</div>
        </div>
        <div style={boxStyle}>
          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)' }}>{timeLeft.minutes}</div>
          <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{t('app.units.min')}</div>
        </div>
        <div style={boxStyle}>
          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary)' }}>{String(timeLeft.seconds).padStart(2, '0')}</div>
          <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{t('app.units.sec')}</div>
        </div>
      </div>
    </div>
  );
}
