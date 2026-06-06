import re

with open('src/i18n.ts', 'r', encoding='utf-8') as f:
    i18n_content = f.read()

en_tastepay = """
            "tastepay": {
                "title": "Fast & Easy Payment",
                "desc": "Pay or get paid in seconds with TASTE — anywhere in the world.",
                "receive": "Create Invoice",
                "scan": "Pay with QR",
                "cam_denied": "Camera permission denied. Please allow in settings.",
                "cam_not_found": "Camera not found.",
                "cam_failed": "Failed to open camera: ",
                "scan_qr_text": "Scan the QR code at the checkout to pay",
                "retry_cam": "Retry Camera",
                "native_cam": "Native Camera",
                "invoice_no": "Invoice No:",
                "live_rate": "Live rate: 1 TASTE ≈ ",
                "to_receive": "To Receive",
                "enter_amount": "Enter Amount",
                "err_wallet": "Please connect your wallet first",
                "err_amount": "Invalid amount",
                "err_balance": "Insufficient TASTE balance! Required: {{req}}, Available: {{avail}}",
                "err_fee": "At least 0.2 TON required for transaction fee",
                "confirm_title": "Summary & Confirmation",
                "recipient": "Recipient Wallet",
                "amount": "Amount",
                "rate": "Rate (Fixed)",
                "to_pay": "TASTE to Pay",
                "fee": "Network Fee",
                "btn_confirm": "Confirm & Pay",
                "btn_processing": "Processing...",
                "success_title": "Payment Sent!",
                "success_desc": "Transaction sent to blockchain. It will be confirmed in a few seconds.",
                "view_explorer": "View on Tonviewer",
                "back_menu": "Back to Menu",
                "fail_title": "Payment Failed",
                "retry": "Retry",
                "cancel": "Cancel"
            }"""

tr_tastepay = """
            "tastepay": {
                "title": "Kolay ve Hızlı Ödeme",
                "desc": "TASTE ile saniyeler içinde öde veya ödeme al — dünyanın her yerinde.",
                "receive": "Fatura Oluştur",
                "scan": "QR ile Öde",
                "cam_denied": "Kamera izni reddedildi. Lütfen cihaz ayarlarından izin verin.",
                "cam_not_found": "Kamera bulunamadı.",
                "cam_failed": "Kamera açılamadı: ",
                "scan_qr_text": "Ödeme yapmak için kasadaki karekodu okutun",
                "retry_cam": "Tekrar Dene",
                "native_cam": "Native Kamera",
                "invoice_no": "Fatura No:",
                "live_rate": "Canlı kur: 1 TASTE ≈ ",
                "to_receive": "Müşteriden Alınacak",
                "enter_amount": "Tutar Girin",
                "err_wallet": "Lütfen önce cüzdanınızı bağlayın",
                "err_amount": "Geçersiz ödeme tutarı",
                "err_balance": "Yetersiz TASTE bakiyesi! Gerekli: {{req}}, Mevcut: {{avail}}",
                "err_fee": "İşlem komisyonu için en az 0.2 TON gerekiyor",
                "confirm_title": "Özet ve Onay",
                "recipient": "Alıcı Cüzdan",
                "amount": "Tutar",
                "rate": "Kur (Sabit)",
                "to_pay": "Ödenecek TASTE",
                "fee": "Blokzincir Komisyonu",
                "btn_confirm": "İşlemi Onayla ve Öde",
                "btn_processing": "İşleniyor...",
                "success_title": "Ödeme Gönderildi!",
                "success_desc": "İşlem blokzincire gönderildi. Birkaç saniye içinde onaylanacak.",
                "view_explorer": "Tonviewer'da görüntüle",
                "back_menu": "Ana Menüye Dön",
                "fail_title": "Ödeme Başarısız",
                "retry": "Tekrar Dene",
                "cancel": "Vazgeç"
            }"""

i18n_content = i18n_content.replace('"chef": {\n                "title": "Taste Chef",', en_tastepay + ',\n            "chef": {\n                "title": "Taste Chef",')
i18n_content = i18n_content.replace('"chef": {\n                "title": "Taste Şef",', tr_tastepay + ',\n            "chef": {\n                "title": "Taste Şef",')

with open('src/i18n.ts', 'w', encoding='utf-8') as f:
    f.write(i18n_content)

print("Patched i18n.ts")
