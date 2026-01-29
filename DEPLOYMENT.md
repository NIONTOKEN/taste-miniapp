# Taste MiniApp Deployment Guide

## 🚀 Vercel Deployment (Önerilen)

### Adım 1: Vercel Hesabı Oluştur / Giriş Yap

1. [Vercel](https://vercel.com) sitesine git
2. GitHub hesabınla giriş yap

### Adım 2: Projeyi GitHub'a Yükle

```bash
# Terminal'de proje klasöründe:
git init
git add .
git commit -m "Initial commit - Taste MiniApp"

# GitHub'da yeni repository oluştur ve bağla:
git remote add origin https://github.com/KULLANICI_ADIN/taste-miniapp.git
git branch -M main
git push -u origin main
```

### Adım 3: Vercel'de Deploy Et

1. Vercel dashboard'da "Add New Project" tıkla
2. GitHub repository'ni seç (`taste-miniapp`)
3. Framework Preset: **Vite** otomatik seçilecek
4. Build & Development Settings:
   - Build Command: `npm run build` ✅ (otomatik)
   - Output Directory: `dist` ✅ (otomatik)
   - Install Command: `npm install` ✅ (otomatik)
5. **Deploy** butonuna bas!

### Adım 4: Deploy URL'i Al

- Deploy tamamlandığında URL görünecek: `https://taste-miniapp.vercel.app`
- Bu URL'i kopyala

### Adım 5: Manifest Dosyasını Güncelle

1. `public/tonconnect-manifest.json` dosyasını aç
2. URL'i Vercel URL'inle değiştir:

```json
{
  "url": "https://taste-miniapp.vercel.app",
  "name": "Taste Token",
  "iconUrl": "https://taste-miniapp.vercel.app/logo.jpg"
}
```

3. Değişiklikleri commit et ve push et:

```bash
git add public/tonconnect-manifest.json
git commit -m "Update manifest with Vercel URL"
git push
```

4. Vercel otomatik olarak tekrar deploy edecek!

### Adım 6: Telegram Bot'u Ayarla

1. [@BotFather](https://t.me/BotFather)'a git
2. `/setmenubutton` komutunu gönder
3. Botunu seç: `@taste_launch_bot`
4. URL'i yapıştır: `https://taste-miniapp.vercel.app`
5. Buton ismini gir: `🎮 Play Taste`

## ✅ Test Et

### Bilgisayardan Test

```bash
# Local'de build'i test et
npm run build
npm run preview
```

### Mobil Test

1. Telegram'ı aç (mobil)
2. Botunu bul: [@taste_launch_bot](https://t.me/taste_launch_bot)
3. Menu butonuna tıkla
4. Test et:
   - ✅ WiFi üzerinden açılıyor mu?
   - ✅ Mobil veri üzerinden açılıyor mu?
   - ✅ Cüzdan bağlanıyor mu?
   - ✅ Buy butonu çalışıyor mu?

## 🔄 Güncellemeler

Her değişiklikten sonra:

```bash
git add .
git commit -m "Açıklama buraya"
git push
```

Vercel otomatik deploy eder! 🎉

## 🐛 Sorun Giderme

### Cüzdan Bağlanmıyor

- `tonconnect-manifest.json`'daki URL'in doğru olduğundan emin ol
- Vercel'de CORS headers'ın aktif olduğunu kontrol et

### API Hataları

- Browser Console'u aç (F12)
- Network tab'ında failed requests kontrol et
- API service fallback'leri devrede

### Build Hataları

```bash
# Dependencies'i temizle ve tekrar yükle
rm -rf node_modules
rm package-lock.json
npm install
npm run build
```

## 📱 Production Checklist

- [ ] Vercel deploy başarılı
- [ ] Manifest URL güncel
- [ ] Telegram bot menu button ayarlandı
- [ ] WiFi üzerinden test edildi
- [ ] Mobil veri üzerinden test edildi
- [ ] Cüzdan bağlantısı test edildi
- [ ] Buy/Sell fonksiyonları test edildi
- [ ] Daily rewards test edildi
- [ ] Social tasks test edildi

## 🎯 Bonus: Custom Domain (Opsiyonel)

Eğer ileride domain alırsan:

1. Vercel Project Settings → Domains
2. Domain ekle (örn: `taste.app`)
3. DNS kayıtlarını ayarla
4. Manifest dosyasını güncelle

---

**🚀 Başarılar dostum! Taste MiniApp artık canlıda!**
