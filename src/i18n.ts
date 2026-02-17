import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "app": {
                "title": "TASTE Token",
                "description": "The Art and Education of Culinary Utility Token",
                "buy_title": "Early Access Sale",
                "buy_with": "Buy with TON",
                "holders": "Holders",
                "my_balance": "My Balance",
                "invite_friend": "Invite a Friend",
                "invite_gain": "Earn +0.1 TASTE per friend",
                "share_link": "Share Invite Link",
                "referral_message": "Join TASTE and start earning TON ecosystem rewards! 🍳",
                "connect_wallet_first": "Please connect your wallet first",
                "tap_to_earn": "Tap to Earn",
                "no_energy": "Gimme some rest! (No Energy)",
                "transaction_failed": "Transaction failed or cancelled. ❌"
            },
            "market": {
                "live_chart": "Live Market Analysis"
            },
            "nav": {
                "home": "Home",
                "roadmap": "Roadmap",
                "whitepaper": "Whitepaper",
                "leaderboard": "Leaderboard",
                "play": "Play"
            },
            "game": {
                "title": "Chef Career",
                "next": "NEXT",
                "back": "Back",
                "reward": "REWARD",
                "excellent": "Excellent!",
                "success_message": "You've successfully prepared {{dish}}.",
                "return_map": "Back to Map",
                "complete_info": "Complete levels to earn TASTE tokens! 🍳💎"
            },
            "roadmap": {
                "title": "Roadmap 2026",
                "q1": { "title": "Q1 2026", "desc": "Community Building & Mini App Launch" },
                "q2": { "title": "Q2 2026", "desc": "DEX Listings & Liquidity Provision" },
                "q3": { "title": "Q3 2026", "desc": "Partnerships & Culinary Rewards" },
                "q4": { "title": "Q4 2026", "desc": "Mobile App & Global Expansion" }
            },
            "whitepaper": {
                "title": "Whitepaper",
                "vision": {
                    "title": "Vision",
                    "content": "TASTE aims to become a real utility token used not only in games, but also in real-world environments such as restaurants, hotels, and food-related services within the TON and Telegram ecosystem."
                },
                "mission": {
                    "title": "Mission",
                    "content": "To build a transparent, controlled, and non-speculative utility economy that focuses on real usage rather than price speculation."
                },
                "tokenomics": {
                    "title": "Token Distribution",
                    "initial_supply": "Initial Total Supply: 25,000,000 TASTE",
                    "allocation": {
                        "locked": "Locked (JVault) - 72%",
                        "liquidity": "Liquidity Pool - 20%",
                        "rewards": "Game Rewards - 4%",
                        "owner": "Project Owner - 4%"
                    }
                },
                "supply_policy": {
                    "title": "Supply Policy - Mutable Explained",
                    "content": "TASTE has an initial supply cap of 25,000,000 tokens. All locked funds are secured via jvault and can be verified on-chain."
                },
                "general_info": {
                    "title": "General Information",
                    "content": "Taste! is an innovative gastronomic experience platform created to awaken and develop people's passion for food."
                },
                "team": {
                    "title": "Our Team",
                    "fatih": {
                        "name": "Fatih Kaya",
                        "role": "Founder & CEO | Finance and Project Designer"
                    },
                    "angel": {
                        "name": "~~AnGeL~~",
                        "role": "Media Specialist | Project Design and Promotion"
                    }
                }
            },
            "wallets": {
                "title": "Supported Wallets",
                "binance": "Binance Wallet",
                "okx": "OKX Wallet",
                "bitget": "Bitget Wallet"
            },
            "how_to_buy": {
                "title": "How to Buy?",
                "step1": "Get TON via @wallet or local exchanges (Binance TR, Paribu, etc.)",
                "step2": "Send TON to your Tonkeeper or Telegram Wallet.",
                "step3": "Swap TON for TASTE using the 'Buy With TON' button above.",
                "note": "Turkish users can easily buy TON with TL via P2P Market in @wallet."
            },
            "social": {
                "title": "Social Tasks",
                "tasks": {
                    "x_follow": "Follow us on X",
                    "tg_join": "Join Telegram Channel",
                    "facebook": "Follow us on Facebook",
                    "instagram": "Follow us on Instagram",
                    "tiktok": "Follow us on TikTok",
                    "whatsapp": "Join WhatsApp Channel",
                    "website": "Visit Our Website"
                }
            },
            "rewards": {
                "title": "Daily Reward",
                "streak": "Streak: {{days}} Days",
                "day": "Day {{day}}",
                "claim": "Claim Reward (0.005 TASTE)",
                "claimed": "Claimed Today",
                "withdraw": "Send Taste (Min 1)",
                "withdraw_success": "Withdrawal Request Sent!",
                "insufficient_balance": "Min 1 TASTE required",
                "connect_wallet": "Please connect wallet first"
            }
        }
    },
    tr: {
        translation: {
            "app": {
                "title": "TASTE Token",
                "description": "Gastronomi ve Eğitim Odaklı Utility Token",
                "buy_title": "Erken Erişim Satışı",
                "buy_with": "TON ile Satın Al",
                "holders": "Yatırımcılar",
                "my_balance": "Bakiyem",
                "invite_friend": "Arkadaşını Davet Et",
                "invite_gain": "Her arkadaşın için +0.1 TASTE kazan",
                "share_link": "Davet Linkini Paylaş",
                "referral_message": "TASTE'e katıl ve TON ekosisteminde kazanmaya başla! 🍳",
                "connect_wallet_first": "Lütfen önce cüzdanını bağla",
                "tap_to_earn": "Tıkla Kazan",
                "no_energy": "Biraz dinlenmem lazım! (Enerji Yok)",
                "transaction_failed": "İşlem başarısız oldu veya iptal edildi. ❌"
            },
            "market": {
                "live_chart": "Canlı Piyasa Analizi"
            },
            "nav": {
                "home": "Ana Sayfa",
                "roadmap": "Yol Haritası",
                "whitepaper": "Beyaz Kağıt",
                "leaderboard": "Sıralama",
                "play": "Oyun"
            },
            "game": {
                "title": "Şef Kariyeri",
                "next": "SIRADAKİ",
                "back": "Geri",
                "reward": "ÖDÜL",
                "excellent": "Harika!",
                "success_message": "{{dish}} başarıyla hazırlandı.",
                "return_map": "Haritaya Dön",
                "complete_info": "Bölümleri geçerek TASTE token kazanın! 🍳💎"
            },
            "roadmap": {
                "title": "Yol Haritası 2026",
                "q1": { "title": "Ç1 2026", "desc": "Topluluk Oluşturma ve Mini App Lansmanı" },
                "q2": { "title": "Ç2 2026", "desc": "DEX Listelemeleri ve Likidite" },
                "q3": { "title": "Ç3 2026", "desc": "Ortaklıklar ve Gastronomi Ödülleri" },
                "q4": { "title": "Ç4 2026", "desc": "Mobil Uygulama ve Global Büyüme" }
            },
            "whitepaper": {
                "title": "Beyaz Kağıt",
                "vision": {
                    "title": "Vizyonumuz",
                    "content": "TASTE, yalnızca bir oyun token'ı değil; TON ve Telegram ekosistemi içinde restoranlar, oteller ve yeme-içme hizmetlerinde kullanılacak gerçek bir utility token olmayı hedefler."
                },
                "mission": {
                    "title": "Misyonumuz",
                    "content": "Fiyat spekülasyonu yerine gerçek kullanım odaklı, şeffaf ve kontrollü bir utility ekonomisi oluşturmak."
                },
                "tokenomics": {
                    "title": "Token Dağılımı",
                    "initial_supply": "Başlangıç Toplam Arzı: 25,000,000 TASTE",
                    "allocation": {
                        "locked": "Kilitli (JVault) - 72%",
                        "liquidity": "Likidite Havuzu - 20%",
                        "rewards": "Oyun Ödülleri - 4%",
                        "owner": "Proje Sahibi - 4%"
                    }
                },
                "general_info": {
                    "title": "Genel Bilgi",
                    "content": "Taste! insanları yemek tutkusunu uyandırmak ve geliştirmek için oluşturulmuş yenilikçi bir gastronomi deneyimi platformudur."
                },
                "key_focus": {
                    "title": "Temel Odaklar",
                    "content": "Amacımız, erişilebilir gastronomi deneyimleri ve bilgilerini sağlarken tatların ve yemek kültürlerinin dünya çapında paylaşımını teşvik etmektir."
                },
                "team": {
                    "title": "Ekibimiz",
                    "fatih": {
                        "name": "Fatih Kaya",
                        "role": "Kurucu & CEO | Finans ve Proje Tasarımcısı"
                    },
                    "angel": {
                        "name": "~~AnGeL~~",
                        "role": "Medya Uzmanı | Proje Tasarımı ve Tanıtımı"
                    }
                },
                "supply_policy": {
                    "title": "Arz Politikası",
                    "content": "TASTE key'in initial arzı 25,000,000 adet ile sınırlıdır. Tüm kilitli fonlar jvault ile güvence altına alınmıştır ve on-chain doğrulanabilir."
                }
            },
            "wallets": {
                "title": "Desteklenen Cüzdanlar",
                "binance": "Binance Wallet",
                "okx": "OKX Wallet",
                "bitget": "Bitget Wallet"
            },
            "how_to_buy": {
                "title": "Nasıl Satın Alınır?",
                "step1": "@wallet veya Binance TR gibi borsalardan TON alın.",
                "step2": "TON'ları Tonkeeper veya Telegram cüzdanınıza çekin.",
                "step3": "Yukarıdaki 'TON ile Satın Al' butonuyla TASTE takası yapın.",
                "note": "@wallet içindeki P2P Market ile TL üzerinden kolayca TON alabilirsiniz."
            },
            "social": {
                "title": "Sosyal Görevler",
                "tasks": {
                    "x_follow": "X'te bizi takip et",
                    "tg_join": "Telegram Kanalına katıl",
                    "facebook": "Facebook'ta takip et",
                    "instagram": "Instagram'da takip et",
                    "tiktok": "TikTok'ta takip et",
                    "whatsapp": "WhatsApp Kanalına katıl",
                    "website": "Web Sitemizi Ziyaret Et"
                }
            },
            "rewards": {
                "title": "Günlük Ödül",
                "streak": "Seri: {{days}} Gün",
                "day": "Gün {{day}}",
                "claim": "Ödülü Al (0.005 TASTE)",
                "claimed": "Bugün Alındı",
                "withdraw": "Taste Gönder (Min 1)",
                "withdraw_success": "Çekim Talebi Gönderildi!",
                "insufficient_balance": "En az 1 TASTE gereklidir",
                "connect_wallet": "Lütfen önce cüzdanı bağlayın"
            }
        }
    },
    ar: {
        translation: {
            "app": {
                "title": "توكن TASTE",
                "description": "توكن الخدمات المخصص لفنون الطهي والتعليم",
                "buy_title": "البيع المبكر",
                "buy_with": "شراء باستخدام TON",
                "holders": "المستثمرون",
                "my_balance": "رصيدي",
                "invite_friend": "دعوة صديق",
                "invite_gain": "اربح +0.1 TASTE لكل صديق",
                "share_link": "مشاركة الرابط",
                "referral_message": "انضم إلى TASTE وابدأ الربح! 🍳",
                "connect_wallet_first": "يرجى ربط المحفظة أولاً",
                "tap_to_earn": "اضغط للربح",
                "no_energy": "لا توجد طاقة حالياً",
                "transaction_failed": "فشلت العملية ❌"
            },
            "market": { "live_chart": "تحليل السوق المباشر" },
            "nav": {
                "home": "الرئيسية", "roadmap": "الخارطة", "whitepaper": "الورقة البيضاء", "leaderboard": "المتصدرون", "play": "العب"
            },
            "game": {
                "title": "مسيرة الشيف", "next": "التالي", "back": "رجوع", "reward": "مكافأة", "excellent": "ممتاز!",
                "success_message": "لقد قمت بإعداد {{dish}} بنجاح.", "return_map": "العودة للخارطة",
                "complete_info": "أكمل المستويات لربح توكنات TASTE! 🍳💎"
            },
            "roadmap": {
                "title": "خارطة الطريق 2026",
                "q1": { "title": "الربع الأول", "desc": "بناء المجتمع وإطلاق التطبيق" },
                "q2": { "title": "الربع الثاني", "desc": "الإدراج في منصات التداول" },
                "q3": { "title": "الربع الثالث", "desc": "الشراكات ومكافآت الطهي" },
                "q4": { "title": "الربع الرابع", "desc": "تطبيق الهاتف والتوسع العالمي" }
            },
            "whitepaper": {
                "title": "الورقة البيضاء",
                "vision": { "title": "رؤيتنا", "content": "هدف TASTE هو أن يصبح توكن خدمات حقيقي في عالم الطهي والضيافة في نظام TON." },
                "mission": { "title": "مهمتنا", "content": "بناء اقتصاد خدمات شفاف بعيداً عن المضاربة." },
                "tokenomics": {
                    "title": "توزيع التوكنات", "initial_supply": "إجمالي العرض الأولي: 25,000,000 TASTE",
                    "allocation": { "locked": "مغلق (JVault) - 72%", "liquidity": "سيولة - 20%", "rewards": "مكافآت - 4%", "owner": "المالك - 4%" }
                },
                "general_info": { "title": "معلومات عامة", "content": "Taste! هي منصة تجربة تذوق مبتكرة تهدف إلى إيقاظ شغف الناس بالطعام." },
                "team": {
                    "title": "فريقنا",
                    "fatih": { "name": "Fatih Kaya", "role": "المؤسس والمدير التنفيذي" },
                    "angel": { "name": "~~AnGeL~~", "role": "متخصص إعلامي" }
                },
                "supply_policy": { "title": "سياسة العرض", "content": "عرض TASTE محدود بـ 25 مليون توكن." }
            },
            "social": {
                "title": "المهام الاجتماعية",
                "tasks": { "x_follow": "تابعنا على X", "tg_join": "انضم للقناة", "whatsapp": "انضم للواتساب", "website": "زوروا موقعنا" }
            },
            "rewards": { "title": "المكافأة اليومية", "claim": "المطالبة بالمكافأة", "withdraw": "سحب TASTE (بحد أدنى 1)" }
        }
    },
    ru: {
        translation: {
            "app": {
                "title": "Токен TASTE",
                "description": "Утилитарный токен мира кулинарии и образования",
                "buy_title": "Предпродажа",
                "buy_with": "Купить за TON",
                "holders": "Держатели",
                "my_balance": "Мой баланс",
                "invite_friend": "Пригласить друга",
                "invite_gain": "Получи +0.1 TASTE за друга",
                "share_link": "Поделиться",
                "referral_message": "Присоединяйся к TASTE и зарабатывай! 🍳",
                "connect_wallet_first": "Подключите кошелек",
                "tap_to_earn": "Жми и зарабатывай",
                "no_energy": "Нет энергии",
                "transaction_failed": "Ошибка транзакции ❌"
            },
            "market": { "live_chart": "Анализ рынка" },
            "nav": {
                "home": "Главная", "roadmap": "Дорожная карта", "whitepaper": "Инфо", "leaderboard": "Топ", "play": "Играть"
            },
            "game": {
                "title": "Карьера шефа", "next": "ДАЛЕЕ", "back": "Назад", "reward": "НАГРАДА", "excellent": "Отлично!",
                "success_message": "Вы успешно приготовили {{dish}}.", "return_map": "К карте",
                "complete_info": "Проходите уровни и получайте токены TASTE! 🍳💎"
            },
            "roadmap": {
                "title": "Дорожная карта 2026",
                "q1": { "title": "Q1 2026", "desc": "Создание сообщества и запуск приложения" },
                "q2": { "title": "Q2 2026", "desc": "Листинг на DEX" },
                "q3": { "title": "Q3 2026", "desc": "Партнерства и награды" },
                "q4": { "title": "Q4 2026", "desc": "Мобильное приложение" }
            },
            "whitepaper": {
                "title": "Технический документ",
                "vision": { "title": "Видение", "content": "TASTE стремится стать реальным утилитарным токеном в экосистеме TON." },
                "mission": { "title": "Миссия", "content": "Создание прозрачной утилитарной экономики." },
                "tokenomics": {
                    "title": "Распределение", "initial_supply": "Начальный запас: 25,000,000 TASTE",
                    "allocation": { "locked": "Заблокировано - 72%", "liquidity": "Ликвидность - 20%", "rewards": "Награды - 4%", "owner": "Команда - 4%" }
                },
                "general_info": { "title": "Общая информация", "content": "Taste! - это инновационная платформа для гастрономического опыта." },
                "team": {
                    "title": "Наша команда",
                    "fatih": { "name": "Fatih Kaya", "role": "Основатель и гендиректор" },
                    "angel": { "name": "~~AnGeL~~", "role": "Медиа-специалист" }
                },
                "supply_policy": { "title": "Политика запаса", "content": "Запас TASTE ограничен 25 миллионами токенов." }
            },
            "social": {
                "title": "Задания",
                "tasks": { "x_follow": "Подписаться на X", "tg_join": "Вступить в TG", "whatsapp": "Вступить в WhatsApp", "website": "Посетить сайт" }
            },
            "rewards": { "title": "Дневная награда", "claim": "Забрать (0.005)", "withdraw": "Вывести TASTE (Мин 1)" }
        }
    },
    hi: {
        translation: {
            "app": {
                "title": "TASTE टोकन",
                "description": "पाक कला और शिक्षा पर केंद्रित यूटिलिटी टोकन",
                "buy_title": "अर्ली एक्सेस सेल",
                "buy_with": "TON से खरीदें",
                "holders": "धारक",
                "my_balance": "मेरा बैलेंस",
                "invite_friend": "दोस्त को बुलाएं",
                "invite_gain": "दोست पर +0.1 TASTE कमाएं",
                "share_link": "शेयर करें",
                "referral_message": "TASTE में शामिल हों और कमाई शुरू करें! 🍳",
                "connect_wallet_first": "वॉलेट कनेक्ट करें",
                "tap_to_earn": "टैप करें और कमाएं",
                "no_energy": "एनर्जी नहीं है",
                "transaction_failed": "लेनदेन विफल ❌"
            },
            "market": { "live_chart": "लाइव मार्केट एनालिसिस" },
            "nav": {
                "home": "होम", "roadmap": "रोडमैप", "whitepaper": "व्हाइटपेपर", "leaderboard": "लीडरबोर्ड", "play": "खेलें"
            },
            "game": {
                "title": "शेफ करियर", "next": "अगला", "back": "पीछे", "reward": "ईनाम", "excellent": "बहुत बढ़िया!",
                "success_message": "आपने सफलतापूर्वक {{dish}} तैयार किया है।", "return_map": "मैप पर वापस जाएं",
                "complete_info": "TASTE टोकन अर्जित करने के लिए स्तरों को पूरा करें! 🍳💎"
            },
            "roadmap": {
                "title": "रोडमैप 2026",
                "q1": { "title": "Q1 2026", "desc": "समुदाय निर्माण और ऐप लॉन्च" },
                "q2": { "title": "Q2 2026", "desc": "DEX लिस्टिंग" },
                "q3": { "title": "Q3 2026", "desc": "साझेदारी" },
                "q4": { "title": "Q4 2026", "desc": "मोबाइल ऐप" }
            },
            "whitepaper": {
                "title": "श्वेतपत्र",
                "vision": { "title": "दृष्टिकोण", "content": "TASTE का लक्ष्य TON पारिस्थितिकी तंत्र के भीतर एक वास्तविक उपयोगिता टोकन बनना है।" },
                "mission": { "title": "मिशन", "content": "एक पारदर्शी उपयोगिता अर्थव्यवस्था का निर्माण करना।" },
                "tokenomics": {
                    "title": "टोकन वितरण", "initial_supply": "कुल आपूर्ति: 25,000,000 TASTE",
                    "allocation": { "locked": "बंद (JVault) - 72%", "liquidity": "तरलता - 20%", "rewards": "इनाम - 4%", "owner": "मालिक - 4%" }
                },
                "general_info": { "title": "सामान्य जानकारी", "content": "Taste! लोगों में भोजन के प्रति जुनून पैदा करने वाला एक मंच है।" },
                "team": {
                    "title": "हमारी टीम",
                    "fatih": { "name": "Fatih Kaya", "role": "संस्थापक और सीईओ" },
                    "angel": { "name": "~~AnGeL~~", "role": "मीडिया विशेषज्ञ" }
                },
                "supply_policy": { "title": "आपूर्ति नीति", "content": "TASTE की आपूर्ति 25 मिलियन तक सीमित है।" }
            },
            "social": {
                "title": "सामाजिक कार्य",
                "tasks": { "x_follow": "X पर फॉलो करें", "tg_join": "टेलीग्राम से जुड़ें", "whatsapp": "व्हाट्सएप चैनल", "website": "हमारी वेबसाइट देखें" }
            },
            "rewards": { "title": "दैनिक पुरस्कार", "claim": "दावा (0.005)", "withdraw": "वापसी TASTE (न्यूनतम 1)" }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        }
    });

export default i18n;
