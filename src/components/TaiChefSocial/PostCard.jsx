import React, { useState, useRef } from 'react';
import { 
  Heart, 
  MessageCircle, 
  Bookmark, 
  Share2, 
  MapPin, 
  Clock, 
  Flame, 
  Send, 
  Check, 
  ShieldCheck,
  ChefHat,
  Play,
  Volume2,
  VolumeX,
  Video as VideoIcon
} from 'lucide-react';
import { triggerHaptic } from './services/telegram';
import { sounds } from './utils/sound';

export default function PostCard({
  post,
  currentUser,
  onLike,
  onComment,
  onSave,
  onOpenLocationModal,
  onOpenDirectChat,
  lang = 'tr',
  t
}) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [copied, setCopied] = useState(false);

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const isLiked = post.likes?.includes(currentUser?.id);
  const isSaved = post.saves?.includes(currentUser?.id);
  const likesCount = post.likes?.length || 0;
  const commentsCount = post.comments?.length || 0;

  // Video mu Resim mi kontrolÃ¼
  const isVideo = post.mediaType === 'video' || (post.image && (post.image.includes('.mp4') || post.image.includes('.webm') || post.image.includes('.mov')));

  const handleLikeClick = () => {
    triggerHaptic('medium');
    sounds.playLike();
    onLike(post.id);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submittingComment) return;

    setSubmittingComment(true);
    triggerHaptic('light');
    try {
      await onComment(post.id, commentText.trim());
      setCommentText('');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleShare = () => {
    triggerHaptic('light');
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: `${post.author?.name} tarafÄ±ndan paylaÅŸÄ±lan tabak: ${post.title}`,
        url: shareUrl
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <article className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Ãœst Åef Bilgisi Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="relative cursor-pointer"
            onClick={() => onOpenDirectChat(post.author)}
          >
            <img
              src={post.author?.avatar || '/chef-logo.png'}
              alt={post.author?.name}
              className="w-11 h-11 rounded-2xl object-cover border border-amber-500/30 p-0.5"
            />
            {post.author?.isVerified && (
              <span className="absolute -bottom-1 -right-1 bg-amber-500 text-white rounded-full p-0.5 shadow">
                <ShieldCheck className="w-3 h-3" />
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h3 
                onClick={() => onOpenDirectChat(post.author)}
                className="font-bold text-slate-900 text-sm hover:text-amber-600 cursor-pointer transition-colors"
              >
                {post.author?.name}
              </h3>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-amber-50 text-amber-700 font-semibold border border-amber-200">
                {post.author?.title || 'Åef'}
              </span>
            </div>

            {post.location && (
              <button
                onClick={() => {
                  triggerHaptic('light');
                  onOpenLocationModal(post.location);
                }}
                className="flex items-center gap-1 text-[11px] text-amber-700 hover:text-amber-800 mt-0.5 font-medium group text-left"
              >
                <MapPin className="w-3 h-3 text-amber-600 flex-shrink-0" />
                <span className="truncate max-w-[200px]">
                  {post.location.name ? `${post.location.name}, ${post.location.city || ''}` : post.location.city || 'Mutfak'}
                </span>
                <span className="text-[10px] underline text-slate-400 ml-0.5">{t.viewOnMap}</span>
              </button>
            )}
          </div>
        </div>

        {currentUser?.id !== post.userId && (
          <button
            onClick={() => {
              triggerHaptic('light');
              onOpenDirectChat(post.author);
            }}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-amber-400 hover:bg-amber-50 text-slate-700 hover:text-amber-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ChefHat className="w-3.5 h-3.5 text-amber-600" />
            <span>{lang === 'tr' ? 'Åefe Yaz' : 'Message'}</span>
          </button>
        )}
      </div>

      {/* Medya AlanÄ±: FOTOÄRAF VEYA VÄ°DEO */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-black overflow-hidden flex items-center justify-center">
        {isVideo ? (
          <div className="relative w-full h-full cursor-pointer" onClick={toggleVideoPlay}>
            <video
              ref={videoRef}
              src={post.image}
              loop
              playsInline
              muted={isMuted}
              className="w-full h-full object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {/* Oynat/Durdur Butonu Overlay */}
            {!isPlaying && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md text-amber-600 flex items-center justify-center shadow-xl transition-transform hover:scale-110">
                  <Play className="w-7 h-7 fill-amber-600 ml-1" />
                </div>
              </div>
            )}

            {/* Ses AÃ§ / Kapa Butonu */}
            <button
              onClick={toggleMute}
              className="absolute bottom-3 right-3 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white border border-white/20 hover:bg-black/80 transition-colors z-10"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Video Rozeti */}
            <span className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1 border border-white/20">
              <VideoIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'tr' ? 'Video ReÃ§ete' : 'Video Recipe'}</span>
            </span>
          </div>
        ) : (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        )}

        {/* SÃ¼re & Zorluk Rozetleri (Sadece fotoÄŸraflarda veya sol Ã¼stte) */}
        {!isVideo && (
          <div className="absolute top-3 left-3 flex items-center gap-2">
            {post.cookTime && (
              <span className="px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md text-slate-800 text-xs font-semibold flex items-center gap-1 shadow-sm border border-slate-200/60">
                <Clock className="w-3 h-3 text-amber-600" />
                {post.cookTime}
              </span>
            )}
            {post.difficulty && (
              <span className="px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md text-slate-800 text-xs font-semibold flex items-center gap-1 shadow-sm border border-slate-200/60">
                <Flame className="w-3 h-3 text-rose-500" />
                {post.difficulty}
              </span>
            )}
          </div>
        )}

        {post.category && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-amber-500 text-white text-xs font-bold shadow-sm">
            {post.category}
          </span>
        )}
      </div>

      {/* Ä°Ã§erik */}
      <div className="p-4 space-y-3">
        <h2 className="font-serif text-lg font-bold text-slate-900 tracking-tight">
          {post.title}
        </h2>

        {post.caption && (
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {post.caption}
          </p>
        )}

        {post.ingredients && post.ingredients.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.ingredients.map((ing, i) => (
              <span
                key={i}
                className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium"
              >
                #{ing}
              </span>
            ))}
          </div>
        )}

        {/* Aksiyon ButonlarÄ± */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLikeClick}
              className={`flex items-center gap-1.5 text-xs font-bold transition-all active:scale-125 ${
                isLiked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500 stroke-rose-500' : 'stroke-[1.8]'}`} />
              <span>{likesCount}</span>
            </button>

            <button
              onClick={() => {
                triggerHaptic('light');
                setShowComments(!showComments);
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-amber-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5 stroke-[1.8]" />
              <span>{commentsCount}</span>
            </button>

            <button
              onClick={handleShare}
              className="p-1 text-slate-500 hover:text-slate-800 transition-colors"
              title="PaylaÅŸ"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              onSave(post.id);
            }}
            className={`p-1 transition-transform active:scale-110 ${
              isSaved ? 'text-amber-500' : 'text-slate-400 hover:text-amber-600'
            }`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-amber-500 stroke-amber-500' : 'stroke-[1.8]'}`} />
          </button>
        </div>

        {/* Yorumlar */}
        {showComments && (
          <div className="pt-3 border-t border-slate-100 space-y-3 animate-in fade-in duration-150">
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {post.comments && post.comments.length > 0 ? (
                post.comments.map((c) => (
                  <div key={c.id} className="p-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-slate-500 mb-0.5">
                      <span className="font-bold text-slate-800">
                        {c.userName || (c.userId === currentUser?.id ? (lang === 'tr' ? 'Siz' : 'You') : 'Åef')}
                      </span>
                      <span className="text-[10px]">
                        {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-700">{c.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-2">
                  {lang === 'tr' ? 'Ä°lk ÅŸef yorumunu siz yapÄ±n!' : 'Be the first to comment!'}
                </p>
              )}
            </div>

            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={t.writeComment}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || submittingComment}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-bold rounded-xl text-xs flex items-center justify-center transition-colors shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </article>
  );
}

