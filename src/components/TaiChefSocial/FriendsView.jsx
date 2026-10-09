import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  UserMinus,
  Check, 
  X, 
  MessageSquare, 
  Search, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Sparkles,
  Utensils
} from 'lucide-react';
import { api } from './services/api';
import { triggerHaptic } from './services/telegram';

export default function FriendsView({
  currentUser,
  allUsers = [],
  onRefreshUsers,
  onOpenDirectChat,
  lang = 'tr',
  t
}) {
  const [subTab, setSubTab] = useState('all'); // 'all' | 'requests' | 'my_friends'
  const [search, setSearch] = useState('');
  const [loadingActionId, setLoadingActionId] = useState(null);

  const friends = allUsers.filter(u => currentUser?.friends?.includes(u.id));
  const incomingRequests = allUsers.filter(u => currentUser?.friendRequestsReceived?.includes(u.id));

  // ArkadaÅŸ Ã‡Ä±kar (Unfriend)
  const handleRemoveFriend = async (targetUserId) => {
    if (!window.confirm(t.unfriendConfirm || 'Bu ÅŸefi arkadaÅŸlarÄ±nÄ±zdan Ã§Ä±karmak istediÄŸinize emin misiniz?')) {
      return;
    }
    setLoadingActionId(targetUserId);
    triggerHaptic('medium');
    try {
      await api.removeFriend(currentUser.id, targetUserId);
      onRefreshUsers();
    } catch (e) {
      alert(e.message);
    } finally {
      setLoadingActionId(null);
    }
  };

  const filteredUsers = allUsers
    .filter(u => u.id !== currentUser?.id)
    .filter(u => 
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.restaurant?.toLowerCase().includes(search.toLowerCase()) ||
      u.title?.toLowerCase().includes(search.toLowerCase())
    );

  // Ä°stek GÃ¶nderme
  const handleSendRequest = async (targetUserId) => {
    setLoadingActionId(targetUserId);
    triggerHaptic('medium');
    try {
      await api.sendFriendRequest(currentUser.id, targetUserId);
      onRefreshUsers();
    } catch (e) {
      alert(e.message);
    } finally {
      setLoadingActionId(null);
    }
  };

  // Ä°stek Kabul Etme
  const handleAcceptRequest = async (requesterId) => {
    setLoadingActionId(requesterId);
    triggerHaptic('success');
    try {
      await api.acceptFriendRequest(currentUser.id, requesterId);
      onRefreshUsers();
    } catch (e) {
      alert(e.message);
    } finally {
      setLoadingActionId(null);
    }
  };

  // Ä°stek Reddetme
  const handleDeclineRequest = async (requesterId) => {
    setLoadingActionId(requesterId);
    triggerHaptic('light');
    try {
      await api.declineFriendRequest(currentUser.id, requesterId);
      onRefreshUsers();
    } catch (e) {
      alert(e.message);
    } finally {
      setLoadingActionId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in">
      {/* BaÅŸlÄ±k ve Ä°statistikler */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 border border-amber-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-xl text-slate-900">{t.friends}</h1>
            <p className="text-xs text-slate-500">
              {lang === 'tr' ? 'GerÃ§ek ÅŸeflerle baÄŸlantÄ± kurun, kimin Ã§evrimiÃ§i olduÄŸunu gÃ¶rÃ¼n' : 'Connect with real chefs and see who is live in the kitchen'}
            </p>
          </div>
        </div>

        {/* Sekme ButonlarÄ± */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => { triggerHaptic('light'); setSubTab('all'); }}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'tr' ? 'TÃ¼m Åefler' : 'All Chefs'} ({allUsers.length - (currentUser ? 1 : 0)})
          </button>

          <button
            onClick={() => { triggerHaptic('light'); setSubTab('my_friends'); }}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'my_friends' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.friendsList} ({friends.length})
          </button>

          <button
            onClick={() => { triggerHaptic('light'); setSubTab('requests'); }}
            className={`relative flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              subTab === 'requests' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {lang === 'tr' ? 'Ä°stekler' : 'Requests'}
            {incomingRequests.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                {incomingRequests.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Arama Ã‡ubuÄŸu */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={lang === 'tr' ? 'Åef adÄ±, restoran veya unvan ara...' : 'Search chef name, restaurant, or title...'}
          className="w-full bg-white border border-slate-200 rounded-2xl pl-12 pr-4 py-3.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-sm"
        />
      </div>

      {/* 1. SEKME: GELEN Ä°STEKLER */}
      {subTab === 'requests' && (
        <div className="space-y-3">
          <h2 className="font-semibold text-slate-800 text-sm">{t.friendRequests}</h2>
          {incomingRequests.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {incomingRequests.map((user) => (
                <div key={user.id} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar || '/chef-logo.png'} alt={user.name} className="w-12 h-12 rounded-2xl object-cover border border-slate-200" />
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">{user.name}</h3>
                      <p className="text-xs text-amber-600 font-medium">{user.title || user.restaurant}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleAcceptRequest(user.id)}
                      disabled={loadingActionId === user.id}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-sm flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{t.accept}</span>
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(user.id)}
                      disabled={loadingActionId === user.id}
                      className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 text-xs">
              <Users className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p>{t.noRequests}</p>
            </div>
          )}
        </div>
      )}

      {/* 2. SEKME: TÃœM ÅEFLER & ARKADAÅLAR */}
      {subTab !== 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-semibold text-slate-800 text-sm">
              {subTab === 'my_friends' ? t.friendsList : (lang === 'tr' ? 'TÃ¼m Gastronomi AÄŸÄ±' : 'Culinary Network')}
            </h2>
            <span className="text-xs text-slate-500">
              {subTab === 'my_friends' ? `${friends.length} ${t.totalFriends}` : `${filteredUsers.length} Åef`}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {(subTab === 'my_friends' ? friends : filteredUsers).map((user) => {
              const isFriend = currentUser?.friends?.includes(user.id);
              const isRequested = currentUser?.friendRequestsSent?.includes(user.id);
              const hasIncoming = currentUser?.friendRequestsReceived?.includes(user.id);

              return (
                <div
                  key={user.id}
                  className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Avatar & Ã‡evrimiÃ§i Rozeti */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="relative">
                        <img
                          src={user.avatar || '/chef-logo.png'}
                          alt={user.name}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                        />
                        {/* GerÃ§ek Ã‡evrimiÃ§i/Ã‡evrimdÄ±ÅŸÄ± NoktasÄ± */}
                        <span 
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            user.isOnline ? 'bg-emerald-500 ring-2 ring-emerald-200 animate-pulse' : 'bg-slate-300'
                          }`} 
                          title={user.isOnline ? t.online : t.offline}
                        />
                      </div>

                      {/* Ã‡evrimiÃ§i / Ã‡evrimdÄ±ÅŸÄ± Etiketi */}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        user.isOnline 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : 'bg-slate-100 text-slate-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.isOnline ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {user.isOnline ? t.online : t.offline}
                      </span>
                    </div>

                    {/* Ä°sim ve Unvan */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-slate-900 text-sm truncate">{user.name}</h3>
                        {user.isVerified && (
                          <ShieldCheck className="w-4 h-4 text-amber-500 fill-amber-500/20 flex-shrink-0" title={t.verifiedChef} />
                        )}
                      </div>
                      <p className="text-xs text-amber-600 font-semibold truncate">{user.title || 'Usta Åef'}</p>
                      <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span>{user.restaurant ? `${user.restaurant}, ${user.location}` : user.location || 'TÃ¼rkiye'}</span>
                      </p>
                    </div>

                    {/* Biyografi */}
                    {user.bio && (
                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-2 leading-relaxed bg-slate-50 p-2 rounded-xl border border-slate-100">
                        {user.bio}
                      </p>
                    )}
                  </div>

                  {/* Alt Aksiyon ButonlarÄ± (ArkadaÅŸ Ekle / Mesaj At) */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                    {isFriend ? (
                      <div className="w-full flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            triggerHaptic('light');
                            onOpenDirectChat(user);
                          }}
                          className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{lang === 'tr' ? 'Mesaj' : 'Message'}</span>
                        </button>
                        <button
                          onClick={() => handleRemoveFriend(user.id)}
                          disabled={loadingActionId === user.id}
                          className="p-2 rounded-xl border border-slate-200 hover:bg-rose-50 hover:border-rose-300 text-slate-400 hover:text-rose-600 transition-colors"
                          title={t.removeFriend}
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      </div>
                    ) : hasIncoming ? (
                      <button
                        onClick={() => handleAcceptRequest(user.id)}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{t.accept}</span>
                      </button>
                    ) : isRequested ? (
                      <button
                        disabled
                        className="w-full py-2 px-3 rounded-xl bg-slate-100 text-slate-500 font-medium text-xs flex items-center justify-center gap-1.5 cursor-default"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{t.requestSent}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSendRequest(user.id)}
                        disabled={loadingActionId === user.id}
                        className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-98"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>{t.addFriend}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

