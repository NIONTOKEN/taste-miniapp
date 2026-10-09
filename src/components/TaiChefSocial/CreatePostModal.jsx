import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Video as VideoIcon,
  MapPin, 
  Clock, 
  Flame, 
  AlertCircle,
  ChefHat,
  Play
} from 'lucide-react';
import { api } from './services/api';
import { triggerHaptic } from './services/telegram';
import LocationPickerModal from './LocationPickerModal';

export default function CreatePostModal({
  isOpen,
  onClose,
  currentUser,
  onPostCreated,
  lang = 'tr',
  t
}) {
  const fileInputRef = useRef(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState('');
  const [mediaType, setMediaType] = useState('image'); // 'image' | 'video'

  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState({ name: 'TA Gourmet Kitchen', city: 'İstanbul', lat: 41.0315, lng: 28.9754 });
  const [cookTime, setCookTime] = useState('30 dk');
  const [difficulty, setDifficulty] = useState('Orta');
  const [category, setCategory] = useState('Ana Yemek');
  const [ingredientsInput, setIngredientsInput] = useState('');
  
  const [uploading, setUploading] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const categories = lang === 'tr' ? [
    'Deniz Ürünleri', 'Et & Izgara', 'Pastacılık & Tatlı', 'Füzyon', 'Taş Fırın', 'Makarna & Risotto', 'Vejetaryen'
  ] : [
    'Seafood', 'Steak & Grill', 'Pastry & Dessert', 'Fusion', 'Stone Oven', 'Pasta & Risotto', 'Vegetarian'
  ];

  const handleMediaChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setError(lang === 'tr' ? 'Medya boyutu 100 MB\'dan küçük olmalıdır.' : 'File size must be under 100 MB.');
        return;
      }
      setError('');
      setMediaFile(file);
      const isVid = file.type.startsWith('video/') || ['.mp4', '.mov', '.webm', '.mkv'].some(ext => file.name.toLowerCase().endsWith(ext));
      setMediaType(isVid ? 'video' : 'image');
      setMediaPreview(URL.createObjectURL(file));
      triggerHaptic('light');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError(lang === 'tr' ? 'Lütfen tabak adını giriniz.' : 'Please enter dish title.');
      return;
    }

    setUploading(true);
    setError('');
    triggerHaptic('medium');

    try {
      let finalMediaUrl = mediaPreview;
      let detectedType = mediaType;

      if (mediaFile) {
        const uploadRes = await api.uploadMedia(mediaFile);
        finalMediaUrl = uploadRes.url;
        detectedType = uploadRes.mediaType || mediaType;
      } else if (!finalMediaUrl) {
        finalMediaUrl = '/chef-logo.png';
      }

      const postData = {
        userId: currentUser?.id,
        title: title.trim(),
        caption: caption.trim(),
        image: finalMediaUrl, // Hem video hem resim url'si bu alanda
        mediaType: detectedType, // 'video' veya 'image'
        location: location || { name: 'Mutfak', city: 'İstanbul', lat: 41.0082, lng: 28.9784 },
        cookTime,
        difficulty,
        category,
        ingredients: ingredientsInput
          ? ingredientsInput.split(',').map(s => s.trim()).filter(Boolean)
          : []
      };

      const created = await api.createPost(postData);
      triggerHaptic('success');
      onPostCreated(created);
      onClose();
    } catch (err) {
      setError(err.message || 'Hata oluştu');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
        <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-slate-900 text-base">{t.createPlate}</h3>
                <p className="text-[11px] text-slate-500">
                  {lang === 'tr' ? 'Fotoğraf veya Mutfak Videosu Paylaçın (100MB)' : 'Share a Photo or Kitchen Video (100MB)'}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Medya (Fotoğraf / Video) Yükleme Alanı */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>{lang === 'tr' ? 'Tabak Fotoğrafı veya Hazırlık Videosu *' : 'Dish Photo or Preparation Video *'}</span>
                <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">
                  Fotoğraf & Video (MP4 / WebM)
                </span>
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className="hidden"
              />

              {mediaPreview ? (
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-amber-500/40 group bg-black">
                  {mediaType === 'video' ? (
                    <video
                      src={mediaPreview}
                      controls
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img src={mediaPreview} alt="Önizleme" className="w-full h-full object-cover" />
                  )}

                  <div className="absolute top-2 right-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-slate-900 font-bold text-xs flex items-center gap-1.5 shadow"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {lang === 'tr' ? 'Medyayı Değiştir' : 'Change Media'}
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video rounded-2xl border-2 border-dashed border-slate-200 hover:border-amber-400 bg-slate-50 hover:bg-amber-50/30 transition-all cursor-pointer flex flex-col items-center justify-center p-4 text-center group"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform border border-amber-200">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform border border-amber-200">
                      <VideoIcon className="w-5 h-5" />
                    </div>
                  </div>
                  <p className="text-xs font-bold text-slate-800">
                    {lang === 'tr' ? 'Fotoğraf veya Video Yüklemek İçin Tıklayın' : 'Click to Upload Photo or Video'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {lang === 'tr' ? 'MP4, MOV, WebM veya JPG, PNG (Maks 100 MB)' : 'MP4, MOV, WebM or JPG, PNG (Max 100 MB)'}
                  </p>
                </div>
              )}
            </div>

            {/* Başlık */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'tr' ? 'Tabak / Tarif / Video Başlığı *' : 'Dish / Recipe Title *'}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={lang === 'tr' ? 'Örn: Ağır Ateşte Kuzu İncik & İlikli Keşkek' : 'e.g. Slow Braised Lamb Shank with Smoked Wheat'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                required
              />
            </div>

            {/* Konum / Restoran */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.locationTitle}
              </label>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 transition-colors text-left"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span className="text-xs text-slate-800 truncate font-semibold">
                    {location ? `${location.name} (${location.city})` : 'Konum Seç'}
                  </span>
                </div>
                <span className="text-[11px] text-amber-700 font-bold px-2 py-0.5 rounded-lg bg-amber-50">
                  {lang === 'tr' ? 'Değiştir' : 'Change'}
                </span>
              </button>
            </div>

            {/* Açıklama & Reçete */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'tr' ? 'Şef Notu & Pişirme Sırrı' : 'Chef Notes & Secret Technique'}
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder={lang === 'tr' ? 'Tabağın hikayesi, sos dengesi veya mutfaktaki pişirme adımları...' : 'The technique, secret ingredients or flavor profile...'}
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white resize-none"
              />
            </div>

            {/* Pişirme Süresi & Zorluk */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t.cookTime}</label>
                <input
                  type="text"
                  value={cookTime}
                  onChange={(e) => setCookTime(e.target.value)}
                  placeholder="30 dk"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">{t.difficulty}</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                >
                  <option value="Kolay">{lang === 'tr' ? 'Kolay' : 'Easy'}</option>
                  <option value="Orta">{lang === 'tr' ? 'Orta' : 'Medium'}</option>
                  <option value="İleri Düzey">{lang === 'tr' ? 'İleri Düzey' : 'Advanced'}</option>
                  <option value="Michelin / Usta İşi">{lang === 'tr' ? 'Michelin / Usta İşi' : 'Master Chef'}</option>
                </select>
              </div>
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {lang === 'tr' ? 'Kategori' : 'Category'}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`text-xs px-3 py-1 rounded-xl border transition-all ${
                      category === c 
                        ? 'bg-amber-500 text-white font-bold border-amber-500 shadow-sm' 
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Malzemeler */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.ingredients} ({lang === 'tr' ? 'Virgülle ayırın' : 'Comma separated'})
              </label>
              <input
                type="text"
                value={ingredientsInput}
                onChange={(e) => setIngredientsInput(e.target.value)}
                placeholder={lang === 'tr' ? 'Kuzu incik, safran, aşurelik buğday, tereyağı' : 'Lamb shank, saffron, wheat, butter'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </form>

          {/* Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              {t.cancel}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={uploading}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Upload className="w-4 h-4" />
              <span>{uploading ? (lang === 'tr' ? 'Yükleniyor...' : 'Sharing...') : t.sharePlateBtn}</span>
            </button>
          </div>
        </div>
      </div>

      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectLocation={(loc) => setLocation(loc)}
        lang={lang}
        t={t}
      />
    </>
  );
}

