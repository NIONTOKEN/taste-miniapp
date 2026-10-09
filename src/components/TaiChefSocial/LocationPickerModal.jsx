import React, { useState } from 'react';
import { MapPin, Navigation, X, ExternalLink, Search, Check, Utensils } from 'lucide-react';
import { triggerHaptic } from './services/telegram';

const POPULAR_LOCATIONS = [
  { name: 'TA Gourmet Restaurant & Lounge', city: 'Etiler, İstanbul', lat: 41.0827, lng: 29.0322, desc: 'Açık Ateş & Modern Türk Gastronomisi' },
  { name: 'Mikla Restaurant', city: 'Beyoğlu, İstanbul', lat: 41.0315, lng: 28.9754, desc: 'Yeni Anadolu Mutfağı - Michelin Star' },
  { name: 'Turk Fatih Tutak', city: 'Bomonti, İstanbul', lat: 41.0583, lng: 28.9812, desc: 'Çağdaş Türk Mutfağı - 2 Michelin Star' },
  { name: 'Neolokal', city: 'Karaköy, İstanbul', lat: 41.0238, lng: 28.9733, desc: 'Sürdürülebilir Gastronomi - Yeşil Michelin' },
  { name: 'Lucca Style Bar & Bistro', city: 'Bebek, İstanbul', lat: 41.0772, lng: 29.0433, desc: 'Bebek Klasikleri' },
  { name: 'Od Urla', city: 'Urla, İzmir', lat: 38.3228, lng: 26.7644, desc: 'Tarladan Sofraya Açık Ateş Mutfağı' },
  { name: 'L\'Atelier Sucré', city: 'Saint-Germain, Paris', lat: 48.8534, lng: 2.3332, desc: 'Fransız Pastacılık & Tatlı Sanatı' }
];

export default function LocationPickerModal({
  isOpen,
  onClose,
  onSelectLocation,
  previewLocation = null,
  lang = 'tr',
  t
}) {
  const [search, setSearch] = useState('');
  const [customName, setCustomName] = useState('');
  const [customCity, setCustomCity] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  if (!isOpen) return null;

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Tarayıcınız konum servisini desteklemiyor.');
      return;
    }

    setIsLocating(true);
    triggerHaptic('medium');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        let detectedCity = 'Mevcut Konum';
        let detectedName = 'Şef Mutfağı';

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          if (res.ok) {
            const data = await res.json();
            const address = data.address || {};
            detectedCity = address.city || address.province || address.town || 'Mevcut Şehir';
            detectedName = address.suburb || address.neighbourhood || address.road || 'Mutfak / Restoran';
          }
        } catch (e) {
          console.warn('Geocoding error:', e);
        }

        const loc = {
          name: detectedName,
          city: detectedCity,
          lat: latitude,
          lng: longitude
        };

        if (onSelectLocation) onSelectLocation(loc);
        setIsLocating(false);
        onClose();
      },
      (err) => {
        setIsLocating(false);
        alert('Konum alınamadı: ' + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customName.trim()) return;

    if (onSelectLocation) {
      onSelectLocation({
        name: customName.trim(),
        city: customCity.trim() || 'Türkiye',
        lat: 41.0082,
        lng: 28.9784
      });
    }
    onClose();
  };

  const filteredLocations = POPULAR_LOCATIONS.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.city.toLowerCase().includes(search.toLowerCase())
  );

  if (previewLocation) {
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${(previewLocation.lng || 28.97) - 0.01}%2C${(previewLocation.lat || 41.03) - 0.01}%2C${(previewLocation.lng || 28.97) + 0.01}%2C${(previewLocation.lat || 41.03) + 0.01}&layer=mapnik&marker=${previewLocation.lat || 41.03}%2C${previewLocation.lng || 28.97}`;
    const externalGoogleUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(previewLocation.name + ' ' + (previewLocation.city || ''))}`;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-slate-900 text-sm">{previewLocation.name}</h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <p className="text-xs text-slate-500 font-medium">{previewLocation.city}</p>
            </div>

            <div className="w-full h-56 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner">
              <iframe
                title="Konum Haritası"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                src={mapUrl}
              />
            </div>

            <a
              href={externalGoogleUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-colors"
            >
              <span>{t.getDirections}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              {lang === 'tr' ? 'Restoran / Mutfak Konumu Seç' : 'Select Restaurant Location'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          <button
            onClick={handleGetCurrentLocation}
            disabled={isLocating}
            className="w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
          >
            <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? (lang === 'tr' ? 'GPS Alınıyor...' : 'Locating...') : t.useGPS}</span>
          </button>

          {/* Özel Konum Ekle */}
          <form onSubmit={handleCustomSubmit} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <p className="text-xs font-bold text-slate-800">
              {lang === 'tr' ? 'Özel Restoran / Lokasyon Yaz' : 'Enter Custom Restaurant / Place'}
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder={lang === 'tr' ? 'Örn: TA Gourmet Lounge' : 'e.g. TA Gourmet Lounge'}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
              />
              <input
                type="text"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
                placeholder={lang === 'tr' ? 'Şehir' : 'City'}
                className="w-24 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={!customName.trim()}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold rounded-xl text-xs"
              >
                {lang === 'tr' ? 'Ekle' : 'Add'}
              </button>
            </div>
          </form>

          {/* Popüler Restoranlar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-slate-700">
                {lang === 'tr' ? 'Popüler Gurme Duraklar' : 'Popular Gourmet Places'}
              </p>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={lang === 'tr' ? 'Mekan ara...' : 'Search place...'}
                className="w-36 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] text-slate-800 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {filteredLocations.map((loc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    triggerHaptic('light');
                    if (onSelectLocation) onSelectLocation(loc);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-white text-amber-600 shadow-sm border border-slate-100">
                      <Utensils className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-amber-700">
                        {loc.name}
                      </p>
                      <p className="text-[11px] text-slate-500">{loc.city} • <span className="text-amber-600">{loc.desc}</span></p>
                    </div>
                  </div>
                  <Check className="w-4 h-4 text-amber-600 opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

