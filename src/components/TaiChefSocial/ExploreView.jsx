import React, { useState } from 'react';
import { 
  Search, 
  Compass, 
  MapPin, 
  Flame, 
  ChefHat, 
  Award, 
  MessageSquare, 
  Sparkles,
  TrendingUp,
  Filter
} from 'lucide-react';
import { triggerHaptic } from './services/telegram';
import PostCard from './PostCard';

const CATEGORIES = [
  'Tümü',
  'Deniz Ürünleri',
  'Et & Izgara',
  'Pastacılık & Tatlı',
  'Füzyon & Modern',
  'Geleneksel & Taş Fırın',
  'Makarna & Risotto'
];

export default function ExploreView({
  allChefs = [],
  posts = [],
  currentUser,
  onLike,
  onComment,
  onSave,
  onOpenLocationModal,
  onOpenDirectChat
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tümü');

  // Filtreleme
  const filteredPosts = posts.filter(post => {
    const matchesSearch = 
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.caption?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.location?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.ingredients?.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'Tümü' || post.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20 animate-in fade-in">
      {/* Keşfet Arama Çubuğu */}
      <div className="relative">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tabak, şef, lokasyon veya malzeme arayın (örn: levrek, trüf, Paris, mikla)..."
          className="w-full bg-[#111726] border border-chef-border rounded-2xl pl-12 pr-4 py-3.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 shadow-xl"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
          >
            Temizle
          </button>
        )}
      </div>

      {/* Popüler Şefler Vitrini */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-amber-400" />
            <h2 className="font-serif font-bold text-slate-100 text-sm">Öne Çıkan Usta Şefler</h2>
          </div>
          <span className="text-[11px] text-chef-textMuted">Tüm Gastronomi Ağı</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {allChefs.filter(c => c.id !== currentUser?.id).map((chef) => (
            <div
              key={chef.id}
              className="glass-panel rounded-2xl border border-chef-border p-3.5 hover:border-amber-500/40 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <img
                    src={chef.avatar}
                    alt={chef.name}
                    className="w-12 h-12 rounded-xl object-cover border border-amber-500/30"
                  />
                  {chef.isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0b0f17]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-slate-100 text-xs truncate group-hover:text-amber-400 transition-colors">
                      {chef.name}
                    </h3>
                  </div>
                  <p className="text-[11px] text-amber-400/90 font-medium truncate mt-0.5">{chef.badge || chef.title}</p>
                  <p className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <span>{chef.restaurant || chef.location}</span>
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-chef-border/50 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  â˜… <strong className="text-amber-400">{chef.rating || '4.9'}</strong> Puan
                </span>
                <button
                  onClick={() => {
                    triggerHaptic('light');
                    onOpenDirectChat(chef);
                  }}
                  className="px-3 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Mesaj At</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kategori Filtreleri */}
      <div>
        <div className="flex items-center gap-2 mb-2 px-1">
          <Flame className="w-4 h-4 text-rose-500" />
          <h2 className="font-serif font-bold text-slate-100 text-xs uppercase tracking-wider">Mutfak & Konsept</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                triggerHaptic('light');
                setSelectedCategory(cat);
              }}
              className={`flex-shrink-0 text-xs px-3.5 py-1.5 rounded-xl border transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-glow-gold'
                  : 'bg-slate-900 text-slate-300 border-chef-border hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Keşfedilen Tabaklar */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-serif font-bold text-slate-100 text-sm">
            {selectedCategory === 'Tümü' ? 'Trend Tabaklar & Reçeteler' : `${selectedCategory} Tabakları`}
          </h2>
          <span className="text-[11px] text-slate-500">{filteredPosts.length} paylaşım bulundu</span>
        </div>

        {filteredPosts.length > 0 ? (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUser={currentUser}
                onLike={onLike}
                onComment={onComment}
                onSave={onSave}
                onOpenLocationModal={onOpenLocationModal}
                onOpenDirectChat={onOpenDirectChat}
              />
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-2xl border border-chef-border p-12 text-center text-slate-400 space-y-2">
            <Compass className="w-8 h-8 mx-auto text-amber-400/60" />
            <p className="text-xs">Aramanıza veya seçilen kategoriye uygun tabak bulunamadı.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('Tümü'); }}
              className="text-xs text-amber-400 font-semibold underline"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

