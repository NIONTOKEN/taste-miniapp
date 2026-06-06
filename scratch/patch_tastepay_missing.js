const fs = require('fs');

// --- Patch i18n.ts ---
let i18n_content = fs.readFileSync('src/i18n.ts', 'utf-8');

// Add to EN
i18n_content = i18n_content.replace(/"scan": "Pay with QR",/, `"scan": "Pay with QR",
                "scan_desc": "Customer Mode · Scan code at checkout to pay",
                "receive_btn": "Receive Payment",
                "receive_desc": "Business Mode · Create QR code for customers to pay",
                "wallet_connected": "✓ Wallet connected",
                "wallet_required": "You must connect a wallet to make a payment",
                "receive_amount_title": "Amount to Receive",`);

// Add to TR
i18n_content = i18n_content.replace(/"scan": "QR ile Öde",/, `"scan": "QR ile Öde",
                "scan_desc": "Müşteri Modu · Kasadaki kodu okut ve öde",
                "receive_btn": "Ödeme Al",
                "receive_desc": "İşletme Modu · QR kod oluştur, müşteri ödesin",
                "wallet_connected": "✓ Cüzdan bağlı",
                "wallet_required": "Ödeme yapmak için cüzdan bağlamanız gerekir",
                "receive_amount_title": "Ödeme Alınacak Tutar",`);

fs.writeFileSync('src/i18n.ts', i18n_content, 'utf-8');


// --- Patch TastePay.tsx ---
let tp_content = fs.readFileSync('src/components/TastePay.tsx', 'utf-8');

tp_content = tp_content.replace("Müşteri Modu · Kasadaki kodu okut ve öde", "{t('tastepay.scan_desc')}");
tp_content = tp_content.replace(">Ödeme Al<", ">{t('tastepay.receive_btn')}<");
tp_content = tp_content.replace("İşletme Modu · QR kod oluştur, müşteri ödesin", "{t('tastepay.receive_desc')}");
tp_content = tp_content.replace("✓ Cüzdan bağlı", "{t('tastepay.wallet_connected')}");
tp_content = tp_content.replace("Ödeme yapmak için cüzdan bağlamanız gerekir", "{t('tastepay.wallet_required')}");
tp_content = tp_content.replace("Ödeme Alınacak {t('tastepay.amount')}", "{t('tastepay.receive_amount_title')}");

fs.writeFileSync('src/components/TastePay.tsx', tp_content, 'utf-8');

console.log("Patched missing strings");
