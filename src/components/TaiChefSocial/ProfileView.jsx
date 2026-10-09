import React, { useState } from 'react';
import { 
  MapPin, 
  UtensilsCrossed, 
  Bookmark, 
  Grid, 
  Edit3, 
  ShieldCheck, 
  Heart, 
  MessageCircle,
  Building2,
  Users
} from 'lucide-react';
import { triggerHaptic } from './services/telegram';

export default function ProfileView({
  currentUser,
  posts = [],
  onOpenEditProfile,
  onOpenLocationModal,
  lang = 'tr',
  t
}) {
  const [activeTab, setActiveTab] = useState('my_posts');

  const myPosts = posts.filter(p => p.userId === currentUser?.id);
  const savedPosts = posts.filter(p => p.saves?.includes(currentUser?.id));
  const displayPosts = activeTab === 'my_posts' ? myPosts : savedPosts;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in">
      {/* Åef Profil KartÄ± */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {/* Kapak GÃ¶rseli */}
        <div className="h-32 sm:h-44 w-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 relative">
          <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-white/40 text-amber-800 text-xs font-bold shadow-sm">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>{t.verifiedChef}</span>
          </div>
        </div>

        {/* Profil DetaylarÄ± */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-14 sm:-mt-16 gap-4 mb-4">
            {/* Avatar */}
            <div className="relative">
              <img
                src={currentUser?.avatar || '/chef-logo.png'}
                alt={currentUser?.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-white shadow-lg bg-white"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white" title="Ã‡evrimiÃ§i" />
            </div>

            {/* Aksiyon: Profili DÃ¼zenle & Ä°statistikler */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-5 bg-slate-50 border border-slate-200 px-5 py-2.5 rounded-2xl">
                <div className="text-center">
                  <p className="text-base font-bold text-slate-900 font-serif">{myPosts.length}</p>
                  <p className="text-[10px] text-slate-500 font-semibold">{t.myDishes}</p>
                </div>
                <div className="w-[1px] h-6 bg-slate-200" />
                <div className="text-center">
                  <p className="text-base font-bold text-slate-900 font-serif">{currentUser?.friends?.length || 0}</p>
                  <p className="text-[10px] text-slate-500 font-semibold">{t.totalFriends}</p>
                </div>
              </div>

              <button
                onClick={() => { triggerHaptic('light'); onOpenEditProfile(); }}
                className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{t.editProfile}</span>
              </button>
            </div>
          </div>

          {/* Ä°sim & Bilgiler */}
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
              <h1 className="font-serif text-2xl font-bold text-slate-900">
                {currentUser?.name}
              </h1>
              <span className="text-xs font-mono text-slate-500 font-medium">
                @{currentUser?.username}
              </span>
            </div>

            <p className="text-xs font-semibold text-amber-700 flex items-center justify-center sm:justify-start gap-1.5">
              <UtensilsCrossed className="w-3.5 h-3.5 text-amber-600" />
              <span>{currentUser?.title || 'Usta Åef'} â€¢ {currentUser?.restaurant || 'Kendi MutfaÄŸÄ±'}</span>
            </p>

            <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
              {currentUser?.bio || (lang === 'tr' ? 'Mutfak felsefenizi ve uzmanlÄ±klarÄ±nÄ±zÄ± eklemek iÃ§in "Profili DÃ¼zenle" butonuna tÄ±klayÄ±n.' : 'Click "Edit Profile" to share your culinary philosophy.')}
            </p>

            {currentUser?.location && (
              <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>{currentUser.location}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Sekmeler: TabaklarÄ±m vs Tarif Defterim */}
      <div className="flex items-center justify-center gap-3 border-b border-slate-200 pb-3">
        <button
          onClick={() => { triggerHaptic('light'); setActiveTab('my_posts'); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'my_posts'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>{t.myDishes} ({myPosts.length})</span>
        </button>

        <button
          onClick={() => { triggerHaptic('light'); setActiveTab('saved'); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'saved'
              ? 'bg-amber-500 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>{t.recipeBook} ({savedPosts.length})</span>
        </button>
      </div>

      {/* Grid */}
      {displayPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {displayPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col group"
            >
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {post.location && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenLocationModal(post.location);
                    }}
                    className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-white/90 backdrop-blur-md text-[10px] text-slate-800 font-bold border border-slate-200 flex items-center gap-1 shadow-sm"
                  >
                    <MapPin className="w-3 h-3 text-amber-600" />
                    <span className="truncate max-w-[100px]">{post.location.city || post.location.name}</span>
                  </button>
                )}
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif font-bold text-slate-900 text-xs truncate">
                    {post.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                    {post.caption}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-[10px] text-slate-400">
                  <span>{post.category || 'Mutfak'}</span>
                  <span>{post.cookTime || '30 dk'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 space-y-2">
          <UtensilsCrossed className="w-8 h-8 mx-auto text-amber-600/50" />
          <h3 className="font-serif font-bold text-slate-800 text-sm">
            {activeTab === 'my_posts' 
              ? (lang === 'tr' ? 'HenÃ¼z PaylaÅŸtÄ±ÄŸÄ±nÄ±z Tabak Yok' : 'No Dishes Shared Yet') 
              : (lang === 'tr' ? 'Tarif Defteriniz BoÅŸ' : 'Your Recipe Book is Empty')}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {activeTab === 'my_posts'
              ? (lang === 'tr' ? 'Mutfakta hazÄ±rladÄ±ÄŸÄ±nÄ±z ilk tabaÄŸÄ± alttaki "+" butonundan hemen paylaÅŸÄ±n!' : 'Share your first dish now!')
              : (lang === 'tr' ? 'AkÄ±ÅŸta beÄŸendiÄŸiniz tabaklarÄ± yer imi butonundan kaydedebilirsiniz.' : 'Bookmark your favorite recipes to view them here.')}
          </p>
        </div>
      )}
    </div>
  );
}

