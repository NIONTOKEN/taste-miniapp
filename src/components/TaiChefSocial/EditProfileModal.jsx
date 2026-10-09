import React, { useState, useRef } from 'react';
import { X, Upload, Check, AlertCircle, ShieldCheck, Camera } from 'lucide-react';
import { api } from './services/api';
import { triggerHaptic } from './services/telegram';

export default function EditProfileModal({
  isOpen,
  onClose,
  currentUser,
  onProfileUpdated,
  lang = 'tr',
  t
}) {
  const [name, setName] = useState(currentUser?.name || '');
  const [title, setTitle] = useState(currentUser?.title || '');
  const [restaurant, setRestaurant] = useState(currentUser?.restaurant || '');
  const [location, setLocation] = useState(currentUser?.location || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatar || '/chef-logo.png');
  const [avatarFile, setAvatarFile] = useState(null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      triggerHaptic('light');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(lang === 'tr' ? 'Ad Soyad boÅŸ bÄ±rakÄ±lamaz.' : 'Name cannot be empty.');
      return;
    }

    setSaving(true);
    setError('');
    triggerHaptic('medium');

    try {
      let finalAvatar = currentUser?.avatar || '/chef-logo.png';
      if (avatarFile) {
        const uploadRes = await api.uploadImage(avatarFile);
        finalAvatar = uploadRes.url;
      }

      const res = await api.updateProfile(currentUser.id, {
        name: name.trim(),
        title: title.trim(),
        restaurant: restaurant.trim(),
        location: location.trim(),
        bio: bio.trim(),
        avatar: finalAvatar,
        isVerified: true
      });

      triggerHaptic('success');
      onProfileUpdated(res.user);
      onClose();
    } catch (err) {
      setError(err.message || 'Hata oluÅŸtu');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-serif font-bold text-slate-900 text-base">{t.editProfile}</h3>
            <span className="flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-semibold border border-amber-200">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              {t.verifiedChef}
            </span>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Profil FotoÄŸrafÄ± */}
          <div className="flex flex-col items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              className="hidden"
            />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="relative cursor-pointer group"
            >
              <img
                src={avatarPreview}
                alt="Avatar"
                className="w-24 h-24 rounded-3xl object-cover border-2 border-amber-500/40 shadow-md group-hover:opacity-85 transition-opacity"
              />
              <div className="absolute inset-0 bg-black/30 rounded-3xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6" />
              </div>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-amber-600 font-semibold hover:underline"
            >
              {lang === 'tr' ? 'FotoÄŸrafÄ± DeÄŸiÅŸtir' : 'Change Photo'}
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t.fullName} *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.titleLabel}</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Executive Chef"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">{t.locationLabel}</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ä°stanbul, TÃ¼rkiye"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t.restaurantLabel}</label>
            <input
              type="text"
              value={restaurant}
              onChange={(e) => setRestaurant(e.target.value)}
              placeholder="Restoran / Mutfak"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">{t.bioLabel}</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              placeholder="Mutfak tecrÃ¼beniz ve uzmanlÄ±ÄŸÄ±nÄ±z..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white resize-none"
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
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {saving ? (lang === 'tr' ? 'Kaydediliyor...' : 'Saving...') : t.saveProfile}
          </button>
        </div>
      </div>
    </div>
  );
}

