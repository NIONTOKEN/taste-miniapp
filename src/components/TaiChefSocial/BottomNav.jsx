import React from 'react';
import { Home, Users, Plus, MessageSquare, User } from 'lucide-react';
import { triggerHaptic } from './services/telegram';

export default function BottomNav({
  activeTab,
  setActiveTab,
  onOpenCreateModal,
  unreadMessagesCount = 0,
  unreadRequestsCount = 0,
  t
}) {
  const tabs = [
    { id: 'feed', label: t.feed, icon: Home },
    { id: 'friends', label: t.friends, icon: Users, badge: unreadRequestsCount },
    { id: 'create', label: t.createPlate, icon: Plus, isSpecial: true },
    { id: 'messages', label: t.messages, icon: MessageSquare, badge: unreadMessagesCount },
    { id: 'profile', label: t.profile, icon: User }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 safe-bottom shadow-lg">
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isSpecial) {
            return (
              <button
                key={tab.id}
                onClick={() => {
                  triggerHaptic('medium');
                  onOpenCreateModal();
                }}
                className="relative -top-3 flex flex-col items-center group focus:outline-none"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-amber-600 shadow-md flex items-center justify-center text-white transition-transform group-hover:scale-105 active:scale-95">
                  <Plus className="w-6 h-6 stroke-[2.4]" />
                </div>
                <span className="text-[10px] font-bold text-amber-700 mt-0.5">{tab.label}</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => {
                triggerHaptic('light');
                setActiveTab(tab.id);
              }}
              className={`relative flex flex-col items-center py-1 px-3 rounded-2xl transition-all duration-150 ${
                isActive ? 'text-amber-600 scale-105' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                {tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full min-w-[15px] text-center shadow">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 font-semibold ${isActive ? 'text-amber-700' : 'text-slate-500'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-amber-500 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

