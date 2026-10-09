import React, { useState, useEffect } from 'react';
import './tai-chef.css';
import Navbar from './Navbar';
import BottomNav from './BottomNav';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModal';
import LocationPickerModal from './LocationPickerModal';
import ChatView from './ChatView';
import NotificationDrawer from './NotificationDrawer';
import ProfileView from './ProfileView';
import FriendsView from './FriendsView';
import AuthModal from './AuthModal';
import EditProfileModal from './EditProfileModal';

import { api } from './services/api';
import { initSocket, getSocket } from './services/socket';
import { initTelegramApp, getTelegramUser, triggerHaptic } from './services/telegram';
import { sounds } from './utils/sound';
import { translations } from './utils/i18n';

import { 
  Sparkles, 
  ChefHat, 
  Plus, 
  MapPin, 
  BellRing,
  ArrowLeft
} from 'lucide-react';

export default function TaiChefSocialApp({ onBackToMiniApp, initialLang = 'tr' }) {
  // Dil Durumu (TR / EN)
  const [lang, setLang] = useState(initialLang);
  const t = translations[lang] || translations.tr;

  useEffect(() => {
    if (initialLang) setLang(initialLang);
  }, [initialLang]);

  // Aktif Kullanıcı & Tüm Kullanıcılar
  const [currentUser, setCurrentUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [conversations, setConversations] = useState([]);

  // Navigasyon & Modallar
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'friends' | 'messages' | 'profile'
  const [activeChefForChat, setActiveChefForChat] = useState(null);
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [previewLocation, setPreviewLocation] = useState(null);

  // Toast Bildirim
  const [toast, setToast] = useState(null);

  const showToast = (message, title = 'TAI') => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 4000);
  };

  // 1. Veri Yükleme & Başlatma
  const loadUsersAndData = async () => {
    try {
      const users = await api.getAllUsers();
      setAllUsers(users);

      let active = currentUser;
      const savedUserId = localStorage.getItem('ta_chef_user_id');

      if (!active) {
        if (savedUserId) {
          active = users.find(u => u.id === savedUserId);
        }
        if (!active && users.length > 0) {
          active = users[0];
        }
      } else {
        const fresh = users.find(u => u.id === active.id);
        if (fresh) active = fresh;
      }

      if (active) {
        setCurrentUser(active);
        localStorage.setItem('ta_chef_user_id', active.id);
        initSocket(active.id);

        const notifs = await api.getNotifications(active.id);
        setNotifications(notifs);

        const convs = await api.getConversations(active.id);
        setConversations(convs);
      }

      const loadedPosts = await api.getPosts();
      setPosts(loadedPosts);
    } catch (e) {
      console.warn('Initial load error:', e);
    }
  };

  useEffect(() => {
    initTelegramApp();

    const tgUser = getTelegramUser();
    if (tgUser) {
      api.register({
        username: tgUser.handle.replace('@', ''),
        name: tgUser.name,
        avatar: tgUser.avatar,
        title: 'Telegram Şefi',
        restaurant: 'Mutfak',
        location: 'Türkiye',
        bio: 'Telegram Mini App kullanıcısı'
      }).then(res => {
        if (res.user) {
          setCurrentUser(res.user);
          localStorage.setItem('ta_chef_user_id', res.user.id);
        }
      }).catch(() => {});
    }

    loadUsersAndData();
  }, []);

  // 2. Canlı Socket.io Dinleyicileri
  useEffect(() => {
    if (!currentUser?.id) return;
    const socket = initSocket(currentUser.id);

    const handleOnlineStatus = ({ userId, isOnline, lastSeen }) => {
      setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, isOnline, lastSeen } : u));
    };

    const handleNewPost = (newPost) => {
      setPosts(prev => [newPost, ...prev.filter(p => p.id !== newPost.id)]);
      if (newPost.userId !== currentUser.id) {
        sounds.playNotification();
        showToast(
          lang === 'tr' ? `${newPost.author?.name} yeni bir tabak paylaştı!` : `${newPost.author?.name} shared a new dish!`,
          t.appName
        );
      }
    };

    const handleLikesUpdated = ({ postId, likes }) => {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes } : p));
    };

    const handleCommentAdded = ({ postId, comment }) => {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...(p.comments || []), comment] } : p));
    };

    const handleNewNotif = (notif) => {
      if (notif.userId === currentUser.id) {
        setNotifications(prev => [notif, ...prev]);
        sounds.playNotification();
        triggerHaptic('success');
        showToast(notif.message, t.notifications);
        api.getAllUsers().then(setAllUsers).catch(() => {});
      }
    };

    const handleFriendshipUpdated = () => {
      api.getAllUsers().then(setAllUsers).catch(() => {});
    };

    const handleNewMessage = (msg) => {
      if (msg.receiverId === currentUser.id) {
        sounds.playMessage();
        triggerHaptic('light');
        showToast(msg.text || 'ğŸ“· Görsel', t.messages);
      }
      api.getConversations(currentUser.id).then(setConversations).catch(() => {});
    };

    socket.on('online_status_changed', handleOnlineStatus);
    socket.on('new_post_created', handleNewPost);
    socket.on('post_likes_updated', handleLikesUpdated);
    socket.on('post_comment_added', handleCommentAdded);
    socket.on('new_notification', handleNewNotif);
    socket.on('friendship_updated', handleFriendshipUpdated);
    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('online_status_changed', handleOnlineStatus);
      socket.off('new_post_created', handleNewPost);
      socket.off('post_likes_updated', handleLikesUpdated);
      socket.off('post_comment_added', handleCommentAdded);
      socket.off('new_notification', handleNewNotif);
      socket.off('friendship_updated', handleFriendshipUpdated);
      socket.off('new_message', handleNewMessage);
    };
  }, [currentUser?.id, lang]);

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const unreadRequestsCount = currentUser?.friendRequestsReceived?.length || 0;

  const handleLike = async (postId) => {
    if (!currentUser?.id) { setIsAuthOpen(true); return; }
    try {
      const res = await api.toggleLike(postId, currentUser.id);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: res.likes } : p));
    } catch (e) {
      console.error('Like error:', e);
    }
  };

  const handleComment = async (postId, text) => {
    if (!currentUser?.id) { setIsAuthOpen(true); return; }
    try {
      const newComment = await api.addComment(postId, currentUser.id, text);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p));
    } catch (e) {
      console.error('Comment error:', e);
    }
  };

  const handleSave = async (postId) => {
    if (!currentUser?.id) { setIsAuthOpen(true); return; }
    try {
      const res = await api.toggleSave(postId, currentUser.id);
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, saves: res.saves } : p));
      showToast(
        res.isSaved ? (lang === 'tr' ? 'Tarif defterine kaydedildi' : 'Saved to recipe book') : (lang === 'tr' ? 'Kaldırıldı' : 'Removed'),
        t.appName
      );
    } catch (e) {
      console.error('Save error:', e);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    showToast(lang === 'tr' ? 'Tabağınız paylaşıldı!' : 'Dish shared successfully!', t.appName);
  };

  const handleMarkAllNotifsRead = async () => {
    if (!currentUser?.id) return;
    try {
      await api.markNotificationsRead(currentUser.id);
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (e) {}
  };

  const handleOpenDirectChat = (chef) => {
    if (!chef) return;
    setActiveChefForChat(chef);
    setActiveTab('messages');
  };

  const handleLogout = () => {
    localStorage.removeItem('ta_chef_user_id');
    setCurrentUser(null);
    setIsAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-white pb-24">
      {/* Eğer Mini App'ten gelindiyse En Üste Şık Geri Dön Butonu */}
      {onBackToMiniApp && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200/80 px-4 py-2.5 flex items-center justify-between shadow-xs sticky top-0 z-50">
          <button
            onClick={onBackToMiniApp}
            className="flex items-center gap-2 text-xs font-bold text-amber-900 hover:text-amber-700 bg-white/80 hover:bg-white px-3 py-1.5 rounded-xl border border-amber-200 shadow-xs transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-amber-700" />
            <span>{lang === 'tr' ? "Taste Mini App'e Dön" : "Back to Taste Mini App"}</span>
          </button>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
              TAI Chef Social
            </span>
          </div>
        </div>
      )}

      {/* Toast Banner */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top duration-200 w-[92%] max-w-md">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 border border-amber-200">
              <BellRing className="w-4 h-4 animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700">{toast.title}</p>
              <p className="text-xs text-slate-800 font-semibold truncate mt-0.5">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Üst Navigasyon */}
      <Navbar
        currentUser={currentUser}
        allUsers={allUsers}
        onSwitchUser={(user) => {
          setCurrentUser(user);
          localStorage.setItem('ta_chef_user_id', user.id);
          showToast(user.name, lang === 'tr' ? 'Şef Değiştirildi' : 'Switched Chef');
        }}
        unreadNotifsCount={unreadNotifsCount}
        unreadMessagesCount={unreadMessagesCount}
        onOpenNotifications={() => setIsNotifDrawerOpen(true)}
        onOpenMessages={() => {
          setActiveChefForChat(null);
          setActiveTab('messages');
        }}
        onOpenProfile={() => setActiveTab('profile')}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        lang={lang}
        onToggleLang={() => setLang(lang === 'tr' ? 'en' : 'tr')}
        t={t}
      />

      {/* Ana İçerik */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-3 sm:px-4 py-4">
        {/* 1. SEKME: AKIŞ (FEED) */}
        {activeTab === 'feed' && (
          <div className="space-y-5">
            <div 
              onClick={() => {
                triggerHaptic('light');
                if (!currentUser) setIsAuthOpen(true);
                else setIsCreateModalOpen(true);
              }}
              className="bg-white rounded-3xl border border-slate-200/90 p-4 flex items-center justify-between cursor-pointer hover:border-amber-400 hover:shadow-md transition-all shadow-sm group"
            >
              <div className="flex items-center gap-3">
                <img
                  src={currentUser?.avatar || '/chef-logo.png'}
                  alt={currentUser?.name || 'Chef'}
                  style={{ width: '44px', height: '44px', objectFit: 'cover' }}
                  className="w-11 h-11 rounded-2xl object-cover border border-amber-500/30"
                />
                <div>
                  <p className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-amber-700 transition-colors">
                    {t.sharePrompt}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {lang === 'tr' ? 'Fotoğraf veya video yükle, restoran lokasyonunu ve reçeteni ekle...' : 'Upload photo or video, add location and secret recipe...'}
                  </p>
                </div>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md flex items-center gap-1.5 transition-colors">
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>{t.sharePlateBtn}</span>
              </div>
            </div>

            <div className="space-y-5">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  onLike={handleLike}
                  onComment={handleComment}
                  onSave={handleSave}
                  onOpenLocationModal={(loc) => setPreviewLocation(loc)}
                  onOpenDirectChat={handleOpenDirectChat}
                  lang={lang}
                  t={t}
                />
              ))}

              {posts.length === 0 && (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
                  <ChefHat className="w-8 h-8 mx-auto text-amber-500" />
                  <p className="text-xs font-bold text-slate-700">
                    {lang === 'tr' ? 'Henüz paylaşım yapılmamış.' : 'No dishes shared yet.'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'tr' ? 'İlk şef tabağını siz paylaçın!' : 'Be the first to share a culinary dish!'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. SEKME: AŞÇI AĞI & ARKADAŞLIK & KİM ONLINE (FRIENDS) */}
        {activeTab === 'friends' && (
          <FriendsView
            currentUser={currentUser}
            allUsers={allUsers}
            onRefreshUsers={loadUsersAndData}
            onOpenDirectChat={handleOpenDirectChat}
            lang={lang}
            t={t}
          />
        )}

        {/* 3. SEKME: SOHBET & MESAJLAR (MESSAGES) */}
        {activeTab === 'messages' && (
          <ChatView
            currentUser={currentUser}
            activeChef={activeChefForChat}
            onSelectChef={(chef) => setActiveChefForChat(chef)}
            allChefs={allUsers}
            onBackToFeed={() => setActiveTab('feed')}
            lang={lang}
            t={t}
          />
        )}

        {/* 4. SEKME: PROFİLİM (PROFILE) */}
        {activeTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            posts={posts}
            onOpenEditProfile={() => setIsEditProfileOpen(true)}
            onOpenLocationModal={(loc) => setPreviewLocation(loc)}
            lang={lang}
            t={t}
          />
        )}
      </main>

      {/* Alt Navigasyon Çubuğu */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'messages') setActiveChefForChat(null);
          setActiveTab(tab);
        }}
        onOpenCreateModal={() => {
          if (!currentUser) setIsAuthOpen(true);
          else setIsCreateModalOpen(true);
        }}
        unreadMessagesCount={unreadMessagesCount}
        unreadRequestsCount={unreadRequestsCount}
        t={t}
      />

      {/* Modallar */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          localStorage.setItem('ta_chef_user_id', user.id);
          showToast(`${user.name}`, lang === 'tr' ? 'Başarıyla Giriş Yapıldı' : 'Welcome');
          loadUsersAndData();
        }}
        lang={lang}
        t={t}
      />

      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentUser={currentUser}
        onProfileUpdated={(updatedUser) => {
          setCurrentUser(updatedUser);
          showToast(lang === 'tr' ? 'Profiliniz güncellendi!' : 'Profile updated successfully!', t.appName);
          loadUsersAndData();
        }}
        lang={lang}
        t={t}
      />

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        currentUser={currentUser}
        onPostCreated={handlePostCreated}
        lang={lang}
        t={t}
      />

      {previewLocation && (
        <LocationPickerModal
          isOpen={!!previewLocation}
          onClose={() => setPreviewLocation(null)}
          previewLocation={previewLocation}
          lang={lang}
          t={t}
        />
      )}

      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotifsRead}
        onNotificationClick={(notif) => {
          setIsNotifDrawerOpen(false);
          if (notif.type === 'message') {
            const partner = allUsers.find(u => u.id === notif.actorId);
            if (partner) handleOpenDirectChat(partner);
          } else if (notif.type === 'friend_request') {
            setActiveTab('friends');
          } else {
            setActiveTab('feed');
          }
        }}
        lang={lang}
        t={t}
      />
    </div>
  );
}

