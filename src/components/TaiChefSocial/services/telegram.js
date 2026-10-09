// Telegram WebApp SDK Yardımcı Modülü

export const getTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
    return window.Telegram.WebApp;
  }
  return null;
};

export const initTelegramApp = () => {
  const tg = getTelegramWebApp();
  if (tg) {
    try {
      tg.ready();
      tg.expand();
      if (tg.setHeaderColor) tg.setHeaderColor('#080b11');
      if (tg.setBackgroundColor) tg.setBackgroundColor('#080b11');
      console.log('📱 Telegram Mini App başarıyla başlatıldı:', tg.initDataUnsafe);
    } catch (e) {
      console.warn('Telegram init warning:', e);
    }
  }
};

export const getTelegramUser = () => {
  const tg = getTelegramWebApp();
  if (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) {
    const user = tg.initDataUnsafe.user;
    return {
      id: 'tg_' + user.id,
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Telegram Şefi',
      handle: user.username ? `@${user.username}` : `@chef_${user.id}`,
      avatar: user.photo_url || 'https://images.unsplash.com/photo-1607631568010-a87245c0daf8?auto=format&fit=crop&w=400&q=80',
      isTelegramUser: true
    };
  }
  return null;
};

// Haptic Dokunma Geri Bildirimi (Telegram Mini App içinde titreşim)
export const triggerHaptic = (type = 'light') => {
  const tg = getTelegramWebApp();
  if (tg && tg.HapticFeedback) {
    try {
      if (type === 'success' || type === 'warning' || type === 'error') {
        tg.HapticFeedback.notificationOccurred(type);
      } else {
        tg.HapticFeedback.impactOccurred(type);
      }
    } catch (e) {
      // sessizce geç
    }
  } else if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(type === 'heavy' ? 40 : 15);
    } catch (e) {}
  }
};
