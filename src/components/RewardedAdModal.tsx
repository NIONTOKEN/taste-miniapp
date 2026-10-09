import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Zap, Gift, CheckCircle2, AlertCircle, Sparkles, Settings2 } from 'lucide-react';
import { showRewardedAd, getDailyAdStats, recordAdReward, getAdsgramBlockId, setAdsgramBlockId, DailyAdStats } from '../services/adsgramService';

interface RewardedAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardEarned: (rewardType: 'tai' | 'energy', amount: number) => void;
  mode?: 'general' | 'energy_refill';
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  isOpen,
  onClose,
  onRewardEarned,
  mode = 'general'
}) => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<DailyAdStats>(getDailyAdStats());
  const [selectedReward, setSelectedReward] = useState<'tai' | 'energy'>(mode === 'energy_refill' ? 'energy' : 'tai');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Block ID düzenleme modalı
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [blockIdInput, setBlockIdInput] = useState<string>(getAdsgramBlockId());

  useEffect(() => {
    if (isOpen) {
      setStats(getDailyAdStats());
      setErrorMsg(null);
      setSuccessMsg(null);
      setSelectedReward(mode === 'energy_refill' ? 'energy' : 'tai');
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleWatchAd = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsPlaying(true);

    try {
      const result = await showRewardedAd();

      if (result.success) {
        const rewardAmount = selectedReward === 'tai' ? 5 : 1000;
        recordAdReward(selectedReward === 'tai' ? 5 : 0);
        setStats(getDailyAdStats());

        const successText = selectedReward === 'tai'
          ? t('ads.reward_tai_success', 'Tebrikler! +5 TAI Bakiyenize Eklendi! 🎉')
          : t('ads.reward_energy_success', 'Tebrikler! Dokun-Kazan Enerjiniz Fullendi! ⚡');

        setSuccessMsg(successText);
        onRewardEarned(selectedReward, rewardAmount);

        setTimeout(() => {
          setIsPlaying(false);
        }, 1500);
      } else {
        setIsPlaying(false);
        setErrorMsg(result.errorMsg || t('ads.ad_failed', 'Reklam tamamlanamadı.'));
      }
    } catch (err: any) {
      setIsPlaying(false);
      setErrorMsg(err.message || t('ads.ad_failed', 'Bir hata oluştu.'));
    }
  };

  const handleSaveBlockId = () => {
    setAdsgramBlockId(blockIdInput);
    setShowConfig(false);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      padding: '16px'
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        style={{
          width: '100%',
          maxWidth: '380px',
          background: 'linear-gradient(145deg, #1e1b4b 0%, #0f172a 100%)',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          borderRadius: '24px',
          padding: '22px 18px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(139, 92, 246, 0.25)',
          position: 'relative'
        }}
      >
        {/* Kapat Butonu */}
        <button
          onClick={onClose}
          disabled={isPlaying}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            background: 'rgba(255, 255, 255, 0.08)',
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
          <X size={16} />
        </button>

        {/* Üst Rozet & Başlık */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(139, 92, 246, 0.2)',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 800,
            color: '#c084fc',
            marginBottom: '8px'
          }}>
            <Sparkles size={13} />
            <span>AdsGram · TON Sponsorlu Reklam</span>
          </div>

          <h3 style={{ fontSize: '19px', fontWeight: 900, color: '#fff', margin: '4px 0' }}>
            {t('ads.modal_title', 'Sponsorlu Video İzle')}
          </h3>
          <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
            {t('ads.modal_subtitle', '15 saniyelik video izle, hem sen kazan hem Taste AI havuzuna TON kazandır!')}
          </p>
        </div>

        {/* Ödül Seçenekleri (TAI veya Full Enerji) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          <button
            onClick={() => setSelectedReward('tai')}
            disabled={isPlaying}
            style={{
              padding: '12px 10px',
              borderRadius: '16px',
              border: selectedReward === 'tai' ? '2px solid #8b5cf6' : '1px solid rgba(255,255,255,0.08)',
              background: selectedReward === 'tai' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255,255,255,0.03)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Gift size={24} color={selectedReward === 'tai' ? '#c084fc' : '#94a3b8'} />
            <div style={{ fontSize: '13px', fontWeight: 900, color: '#fff' }}>+5 TAI</div>
            <div style={{ fontSize: '10px', color: '#a78bfa' }}>Token Hediyesi</div>
          </button>

          <button
            onClick={() => setSelectedReward('energy')}
            disabled={isPlaying}
            style={{
              padding: '12px 10px',
              borderRadius: '16px',
              border: selectedReward === 'energy' ? '2px solid #f59e0b' : '1px solid rgba(255,255,255,0.08)',
              background: selectedReward === 'energy' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255,255,255,0.03)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <Zap size={24} color={selectedReward === 'energy' ? '#fbbf24' : '#94a3b8'} />
            <div style={{ fontSize: '13px', fontWeight: 900, color: '#fff' }}>%100 Enerji</div>
            <div style={{ fontSize: '10px', color: '#fcd34d' }}>Dokun-Kazan Fulle</div>
          </button>
        </div>

        {/* Günlük Kota Durumu */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '12px',
          padding: '8px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          marginBottom: '16px'
        }}>
          <span style={{ color: '#94a3b8' }}>{t('ads.daily_remaining', 'Bugün Kalan Hak:')}</span>
          <span style={{ color: '#fff', fontWeight: 800 }}>
            {stats.remainingToday} / 10
          </span>
        </div>

        {/* Durum Bildirimleri (Hata veya Başarı) */}
        {errorMsg && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '10px 12px',
            fontSize: '11px',
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '14px'
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '12px',
            padding: '10px 12px',
            fontSize: '11px',
            color: '#4ade80',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '14px'
          }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Ana İzleme Butonu */}
        <button
          onClick={handleWatchAd}
          disabled={isPlaying || stats.remainingToday <= 0}
          style={{
            width: '100%',
            padding: '14px 0',
            borderRadius: '16px',
            border: 'none',
            background: isPlaying
              ? 'rgba(255,255,255,0.1)'
              : stats.remainingToday <= 0
                ? '#475569'
                : 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 900,
            cursor: isPlaying || stats.remainingToday <= 0 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)'
          }}
        >
          {isPlaying ? (
            <span>Reklam Oynatılıyor... ⏳</span>
          ) : stats.remainingToday <= 0 ? (
            <span>Bugünkü Limit Doldu (10/10)</span>
          ) : (
            <>
              <Play size={16} fill="#fff" />
              <span>{t('ads.start_ad_btn', 'Reklamı İzle & Ödülü Al')}</span>
            </>
          )}
        </button>

        {/* Alt Bilgi & Block ID Hızlı Ayar */}
        <div style={{
          marginTop: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '10px',
          color: '#64748b'
        }}>
          <span>Gelirler doğrudan $TAI havuzuna aktarılır</span>
          <button
            onClick={() => setShowConfig(!showConfig)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '10px'
            }}
            title="AdsGram Block ID Ayarla"
          >
            <Settings2 size={12} />
            <span>ID</span>
          </button>
        </div>

        {/* Hızlı Block ID Ayar Alanı (Akşam kullanıcı girince anında kaydetsin) */}
        {showConfig && (
          <div style={{
            marginTop: '10px',
            padding: '10px',
            background: 'rgba(0,0,0,0.4)',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ fontSize: '10px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 800 }}>
              AdsGram Block ID (adsgram.ai):
            </div>
            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                value={blockIdInput}
                onChange={(e) => setBlockIdInput(e.target.value)}
                placeholder="Örn: 8550 veya int-8550"
                style={{
                  flex: 1,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  padding: '6px 8px',
                  color: '#fff',
                  fontSize: '11px'
                }}
              />
              <button
                onClick={handleSaveBlockId}
                style={{
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Kaydet
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
