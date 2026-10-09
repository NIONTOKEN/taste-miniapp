import React, { useState } from 'react';
import { Bell, MessageSquare, Globe, LogIn, LogOut, Edit3, ShieldCheck, ChevronDown, Check } from 'lucide-react';
import { triggerHaptic } from './services/telegram';

export default function Navbar({
  currentUser,
  allUsers = [],
  onSwitchUser,
  unreadNotifsCount = 0,
  unreadMessagesCount = 0,
  onOpenNotifications,
  onOpenMessages,
  onOpenProfile,
  onOpenAuth,
  onLogout,
  lang = 'tr',
  onToggleLang,
  t
}) {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-nav px-3 sm:px-4 py-2 safe-top shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Logo & Marka */}
        <div 
          onClick={() => { triggerHaptic('light'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-2 cursor-pointer group flex-shrink-0"
        >
          <img
            src="/chef-logo.png"
            alt="TAI Chef"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shadow-sm border border-amber-500/40 p-0.5 group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-sm sm:text-lg tracking-wide text-slate-900">
                {t.appName}
              </span>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                Gourmet
              </span>
            </div>
            <p className="hidden xs:block text-[10px] text-slate-500 font-medium -mt-0.5 truncate max-w-[130px]">{t.appSub}</p>
          </div>
        </div>

        {/* Aksiyonlar: Dil Değiştirici, Bildirimler, Mesajlar, Profil */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Dil Seçeneği (TR / EN) */}
          <button
            onClick={() => {
              triggerHaptic('light');
              onToggleLang();
            }}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
            title="Dili Değiştir / Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-amber-600" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* Bildirim Zili */}
          <button
            onClick={() => { triggerHaptic('light'); onOpenNotifications(); }}
            className="relative p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
            title={t.notifications}
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                {unreadNotifsCount > 9 ? '9+' : unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Mesaj Butonu */}
          <button
            onClick={() => { triggerHaptic('light'); onOpenMessages(); }}
            className="relative p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
            title={t.messages}
          >
            <MessageSquare className="w-4 h-4" />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow">
                {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
              </span>
            )}
          </button>

          {/* Profil / Giriş Butonu */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => { triggerHaptic('light'); setShowUserDropdown(!showUserDropdown); }}
                className="flex items-center gap-2 p-1 pr-2 rounded-xl border border-slate-200 hover:border-amber-400 bg-white hover:bg-slate-50 transition-all shadow-sm"
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar || '/chef-logo.png'}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-lg object-cover border border-amber-500/30"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-white" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight max-w-[100px] truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-amber-600 font-medium truncate max-w-[100px]">
                    {currentUser.title || 'Şef'}
                  </p>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Kullanıcı Menüsü */}
              {showUserDropdown && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 font-mono">@{currentUser.username}</p>
                  </div>

                  {/* Profil Düzenle */}
                  <button
                    onClick={() => {
                      setShowUserDropdown(false);
                      onOpenProfile();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl text-left text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{t.profile}</span>
                  </button>

                  {/* Kullanıcı Değiştirici (Mevcut diğer kullanıcılar) */}
                  {allUsers.length > 1 && (
                    <div className="pt-2 border-t border-slate-100 mt-1">
                      <p className="text-[10px] uppercase font-bold text-slate-400 px-2 mb-1">
                        {lang === 'tr' ? 'Kullanıcı Değiştir (Test)' : 'Switch User'}
                      </p>
                      <div className="space-y-0.5 max-h-36 overflow-y-auto">
                        {allUsers.map((u) => (
                          <button
                            key={u.id}
                            onClick={() => {
                              triggerHaptic('medium');
                              onSwitchUser(u);
                              setShowUserDropdown(false);
                            }}
                            className={`w-full flex items-center justify-between p-1.5 rounded-lg text-left text-xs transition-colors ${
                              u.id === currentUser.id ? 'bg-amber-50 text-amber-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <span className="truncate">{u.name}</span>
                            {u.id === currentUser.id && <Check className="w-3.5 h-3.5 text-amber-600" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Çıkış Yap / Yeni Profil Aç */}
                  <div className="pt-2 border-t border-slate-100 mt-1 flex gap-1">
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onOpenAuth();
                      }}
                      className="flex-1 py-1.5 text-center text-[11px] font-semibold text-amber-600 hover:bg-amber-50 rounded-lg"
                    >
                      {lang === 'tr' ? '+ Yeni Profil' : '+ New Profile'}
                    </button>
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onLogout();
                      }}
                      className="flex-1 py-1.5 text-center text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center justify-center gap-1"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>{t.logout}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => { triggerHaptic('light'); onOpenAuth(); }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t.login}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

