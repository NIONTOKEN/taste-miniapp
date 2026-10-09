import React from 'react';
import { 
  Bell, 
  X, 
  Heart, 
  MessageCircle, 
  ChefHat, 
  UserPlus, 
  Check, 
  Calendar 
} from 'lucide-react';
import { triggerHaptic } from './services/telegram';

export default function NotificationDrawer({
  isOpen,
  onClose,
  notifications = [],
  onMarkAllRead,
  onNotificationClick,
  lang = 'tr',
  t
}) {
  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotifIcon = (type) => {
    switch (type) {
      case 'friend_request':
        return <UserPlus className="w-4 h-4 text-amber-600" />;
      case 'friend_accept':
        return <Check className="w-4 h-4 text-emerald-600" />;
      case 'like':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      case 'comment':
        return <MessageCircle className="w-4 h-4 text-amber-500" />;
      case 'message':
        return <ChefHat className="w-4 h-4 text-indigo-500" />;
      default:
        return <Bell className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md h-full bg-white border-l border-slate-200 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white safe-top">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">{t.notifications}</h2>
              <p className="text-[11px] text-slate-500">
                {unreadCount > 0 
                  ? (lang === 'tr' ? `${unreadCount} yeni okunmamış bildirim` : `${unreadCount} unread notifications`) 
                  : (lang === 'tr' ? 'Tüm bildirimler okundu' : 'All caught up')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={() => { triggerHaptic('light'); onMarkAllRead(); }}
                className="text-[11px] font-bold text-amber-700 hover:text-amber-800 px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200"
              >
                {t.markAllRead}
              </button>
            )}
            <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Liste */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => { triggerHaptic('light'); onNotificationClick(n); }}
                className={`p-3.5 rounded-2xl transition-all cursor-pointer flex items-start gap-3 ${
                  n.isRead ? 'hover:bg-slate-50 opacity-75' : 'bg-amber-50/60 hover:bg-amber-50 border border-amber-100'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={n.actor?.avatar || '/chef-logo.png'}
                    alt={n.actor?.name || 'Şef'}
                    className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
                  />
                  <div className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-white border border-slate-200 shadow-sm">
                    {getNotifIcon(n.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-800 leading-snug">
                    <span className="font-bold text-slate-900">{n.actor?.name || 'Bir Kullanıcı'}</span> {n.message.replace(n.actor?.name || '', '')}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">{t.noNotifications}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

