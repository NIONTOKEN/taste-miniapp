import React, { useState, useRef } from 'react';
import { User, Lock, Upload, CheckCircle2, AlertCircle, ChefHat, Sparkles, MapPin, Building2 } from 'lucide-react';
import { api } from './services/api';
import { triggerHaptic } from './services/telegram';

export default function AuthModal({
  isOpen,
  onClose,
  onLoginSuccess,
  lang = 'tr',
  t
}) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [restaurant, setRestaurant] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('/chef-logo.png');
  const [avatarFile, setAvatarFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      triggerHaptic('light');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    triggerHaptic('medium');

    try {
      if (isRegister) {
        if (!username.trim() || !name.trim()) {
          setError(lang === 'tr' ? 'LÃ¼tfen kullanÄ±cÄ± adÄ± ve adÄ±nÄ±zÄ± giriniz.' : 'Please enter username and full name.');
          setLoading(false);
          return;
        }

        let uploadedAvatarUrl = '/chef-logo.png';
        if (avatarFile) {
          try {
            const uploadRes = await api.uploadImage(avatarFile);
            uploadedAvatarUrl = uploadRes.url;
          } catch (err) {
            console.warn('Avatar upload error:', err);
          }
        }

        const res = await api.register({
          username: username.trim(),
          password: password || '123456',
          name: name.trim(),
          title: title.trim() || (lang === 'tr' ? 'Usta Åef' : 'Master Chef'),
          restaurant: restaurant.trim() || (lang === 'tr' ? 'Mutfak AtÃ¶lyesi' : 'Culinary Studio'),
          location: location.trim() || (lang === 'tr' ? 'Ä°stanbul, TÃ¼rkiye' : 'Istanbul, Turkey'),
          bio: bio.trim() || (lang === 'tr' ? 'Gastronomi ve lezzet tutkunu ÅŸef.' : 'Passionate culinary artist.'),
          avatar: uploadedAvatarUrl
        });

        triggerHaptic('success');
        onLoginSuccess(res.user);
        onClose();
      } else {
        // GiriÅŸ Yap
        if (!username.trim()) {
          setError(lang === 'tr' ? 'KullanÄ±cÄ± adÄ±nÄ±zÄ± giriniz.' : 'Enter your username.');
          setLoading(false);
          return;
        }

        const res = await api.login({ username: username.trim(), password });
        triggerHaptic('success');
        onLoginSuccess(res.user);
        onClose();
      }
    } catch (err) {
      setError(err.message || (lang === 'tr' ? 'GiriÅŸ yapÄ±lamadÄ±' : 'Authentication failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Ãœst Logo ve BaÅŸlÄ±k */}
        <div className="p-6 text-center border-b border-slate-100 bg-gradient-to-b from-amber-50/50 to-white">
          <img
            src="/chef-logo.png"
            alt="TA CHEF"
            className="w-20 h-20 mx-auto rounded-full shadow-lg border-2 border-amber-500/40 p-0.5 object-cover mb-3"
          />
          <h2 className="font-serif font-bold text-xl text-slate-900 tracking-tight">
            {isRegister ? t.joinCommunity : t.welcomeBack}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isRegister 
              ? (lang === 'tr' ? 'GerÃ§ek ÅŸef profilinizi oluÅŸturun ve aÄŸa baÄŸlanÄ±n' : 'Create your real chef profile and connect') 
              : (lang === 'tr' ? 'TA CHEF topluluÄŸuna giriÅŸ yapÄ±n' : 'Sign in to TA CHEF community')}
          </p>
        </div>

        {/* Form AlanÄ± */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* KayÄ±t Modunda Profil FotoÄŸrafÄ± YÃ¼kleme */}
          {isRegister && (
            <div className="flex flex-col items-center gap-2 pb-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative cursor-pointer group"
              >
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500/50 shadow group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="w-5 h-5" />
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-amber-600 font-semibold hover:underline"
              >
                {t.avatarUpload}
              </button>
            </div>
          )}

          {/* Ad Soyad (Sadece KayÄ±t) */}
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t.fullName} *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === 'tr' ? 'Ã–rn: Ahmet Usta' : 'e.g. John Doe'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                required={isRegister}
              />
            </div>
          )}

          {/* KullanÄ±cÄ± AdÄ± */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.username} *
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={lang === 'tr' ? 'Ã–rn: cheftaha' : 'e.g. chef_john'}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
              required
            />
          </div>

          {/* Åifre */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.password}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
            />
          </div>

          {/* KayÄ±t Modu Ek Alanlar */}
          {isRegister && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.titleLabel}
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={lang === 'tr' ? 'Executive Chef' : 'Head Chef'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.locationLabel}
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={lang === 'tr' ? 'Ä°stanbul' : 'London'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.restaurantLabel}
                </label>
                <input
                  type="text"
                  value={restaurant}
                  onChange={(e) => setRestaurant(e.target.value)}
                  placeholder={lang === 'tr' ? 'Restoran / Mutfak AdÄ±' : 'Restaurant Name'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.bioLabel}
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={lang === 'tr' ? 'Mutfak tutkunuz, tecrÃ¼beniz ve uzmanlÄ±ÄŸÄ±nÄ±z...' : 'Your passion and culinary journey...'}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white resize-none"
                />
              </div>
            </>
          )}

          {/* GÃ¶nder Butonu */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs shadow-md transition-all active:scale-98 disabled:opacity-50"
          >
            {loading ? (lang === 'tr' ? 'Ä°ÅŸleniyor...' : 'Processing...') : (isRegister ? t.register : t.login)}
          </button>
        </form>

        {/* Alt DeÄŸiÅŸtirme Butonu */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
          <button
            type="button"
            onClick={() => {
              setError('');
              setIsRegister(!isRegister);
            }}
            className="text-xs text-amber-700 hover:text-amber-800 font-semibold"
          >
            {isRegister 
              ? (lang === 'tr' ? 'Zaten hesabÄ±nÄ±z var mÄ±? GiriÅŸ YapÄ±n' : 'Already have an account? Sign In')
              : (lang === 'tr' ? 'HesabÄ±nÄ±z yok mu? Hemen GerÃ§ek Åef Profili AÃ§Ä±n' : 'Don\'t have an account? Create Chef Profile')}
          </button>
        </div>
      </div>
    </div>
  );
}

