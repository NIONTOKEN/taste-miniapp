const fs = require('fs');

let content = fs.readFileSync('src/components/TastePay.tsx', 'utf-8');

// Add useTranslation
content = content.replace("import { QRCodeSVG } from 'qrcode.react';", "import { QRCodeSVG } from 'qrcode.react';\nimport { useTranslation } from 'react-i18next';");
content = content.replace("export function TastePay({ onClose }: { onClose: () => void }) {", "export function TastePay({ onClose }: { onClose: () => void }) {\n  const { t, i18n } = useTranslation();");

// Replace strings
const replacements = {
  "Kolay ve Hızlı Ödeme": "{t('tastepay.title')}",
  "TASTE ile saniyeler içinde öde veya ödeme al — dünyanın her yerinde.": "{t('tastepay.desc')}",
  "Fatura Oluştur": "{t('tastepay.receive')}",
  "QR ile Öde": "{t('tastepay.scan')}",
  "Kamera izni reddedildi. Lütfen cihaz ayarlarından izin verin.": "{t('tastepay.cam_denied')}",
  "Kamera bulunamadı.": "{t('tastepay.cam_not_found')}",
  "Kamera açılamadı: ": "{t('tastepay.cam_failed')} + ",
  "Ödeme yapmak için kasadaki karekodu okutun": "{t('tastepay.scan_qr_text')}",
  "Tekrar Dene": "{t('tastepay.retry_cam')}",
  "Native Kamera": "{t('tastepay.native_cam')}",
  "Fatura No:": "{t('tastepay.invoice_no')}",
  "Canlı kur: 1 TASTE ≈": "{t('tastepay.live_rate')}",
  "Müşteriden Alınacak": "{t('tastepay.to_receive')}",
  "Tutar Girin": "{t('tastepay.enter_amount')}",
  "Lütfen önce cüzdanınızı bağlayın (Connect Wallet)": "{t('tastepay.err_wallet')}",
  "Geçersiz ödeme tutarı": "{t('tastepay.err_amount')}",
  "`Yetersiz TASTE bakiyesi! Gerekli: ${tasteAmount}, Mevcut: ${userTasteBal}`": "t('tastepay.err_balance').replace('{{req}}', tasteAmount.toString()).replace('{{avail}}', userTasteBal.toString())",
  "'İşlem komisyonu için en az 0.2 TON gerekiyor'": "t('tastepay.err_fee')",
  "Özet ve Onay": "{t('tastepay.confirm_title')}",
  "Alıcı Cüzdan": "{t('tastepay.recipient')}",
  "Tutar": "{t('tastepay.amount')}",
  "Kur (Sabit)": "{t('tastepay.rate')}",
  "Ödenecek TASTE": "{t('tastepay.to_pay')}",
  "Blokzincir Komisyonu": "{t('tastepay.fee')}",
  "İşlemi Onayla ve Öde": "{t('tastepay.btn_confirm')}",
  "İşleniyor...": "{t('tastepay.btn_processing')}",
  "Ödeme Gönderildi!": "{t('tastepay.success_title')}",
  "İşlem blokzincire gönderildi. Birkaç saniye içinde onaylanacak.": "{t('tastepay.success_desc')}",
  "Tonviewer'da görüntüle": "{t('tastepay.view_explorer')}",
  "Ana Menüye Dön": "{t('tastepay.back_menu')}",
  "Ödeme Başarısız": "{t('tastepay.fail_title')}",
  "Vazgeç": "{t('tastepay.cancel')}"
};

for (const [key, value] of Object.entries(replacements)) {
  if (key.includes("`") || key.includes("'")) {
    content = content.replace(key, value);
  } else {
    // Escape special characters in key for regex
    const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    content = content.replace(new RegExp(">" + safeKey + "<", "g"), ">" + value + "<");
    content = content.replace(new RegExp("'" + safeKey + "'", "g"), "t('" + key + "')");
    content = content.replace(new RegExp('"' + safeKey + '"', "g"), "t('" + key + "')");
    // Also replace raw text nodes
    content = content.replace(new RegExp(safeKey, "g"), value);
  }
}

// Fix double {{t(..)}} which might happen if I replaced too eagerly
content = content.replace(/\{\{t\(/g, "{t(").replace(/\)\}\}/g, ")}");
content = content.replace(/\{t\('tastepay\.live_rate'\)\} \+/g, "{t('tastepay.live_rate')} ");

// Correct manual bugs
content = content.replace(/t\('Kolay ve Hızlı Ödeme'\)/g, "t('tastepay.title')");
content = content.replace(/t\('Fatura Oluştur'\)/g, "t('tastepay.receive')");
content = content.replace(/t\('QR ile Öde'\)/g, "t('tastepay.scan')");

fs.writeFileSync('src/components/TastePay.tsx', content, 'utf-8');
console.log("Patched TastePay.tsx");
