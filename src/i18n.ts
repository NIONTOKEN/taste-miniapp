import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "app": {
                "title": "TASTE Token",
                "description": "The Art and Education of Culinary Utility Token",
                "buy_title": "🔥 Early Access — Buy TASTE",
                "buy_with": "Buy with TON",
                "holders": "Holders",
                "my_balance": "My Balance",
                "invite_friend": "Invite a Friend",
                "invite_gain": "Grow the community together",
                "invite_desc": "Grow the community together",
                "share_link": "Share Invite Link",
                "referral_message": "Join TASTE and start earning TON ecosystem rewards! 🍳",
                "connect_wallet_first": "Please connect your wallet first",
                "tap_to_earn": "Tap to Earn",
                "no_energy": "Gimme some rest! (No Energy)",
                "transaction_failed": "Transaction failed or cancelled. ❌",
                "early_access_ending": "Early access ending",
                "swap_opening": "TASTE Swap Opening...",
                "you_get": "you will receive"
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
                    "initial_supply": "Total Supply: 25,000,000 TASTE",
                    "allocation": {
                        "locked": "Locked (JVault) — 88.4%",
                        "liquidity": "Liquidity Pool (gradual entry) — 6.4%",
                        "team": "Team Allocation — 2%",
                        "founder": "Founder/Owner — 2%",
                        "airdrop": "Airdrop (in progress) — 0.2%",
                        "ops": "Operations, Exchange & Rewards — 1%"
                    }
                },
                "supply_policy": {
                    "title": "Supply & Mint Policy",
                    "content": "TASTE currently has a total supply of 25,000,000 tokens — no minting has been performed. The mint authority remains technically open solely for potential future DAO governance decisions. If TASTE integrates with real-world businesses (restaurants, hotels, etc.) and the community votes to expand supply, this can only happen through a fully transparent DAO vote — the team alone has absolutely no authority to mint unilaterally. 88.4% (22,100,000 TASTE) is locked via JVault and verifiable on-chain."
                },
                "general_info": {
                    "title": "General Information",
                    "content": "Taste! is an innovative gastronomic experience platform created to awaken and develop people's passion for food."
                },
                "key_focus": {
                    "title": "Key Focus Areas",
                    "content": "Our goal is to promote the worldwide sharing of tastes and food cultures while providing accessible gastronomic experiences and knowledge."
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
                    "post_x": "Share Taste on X",
                    "telegram_stories": "Post on Telegram Stories",
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
                "buy_title": "🔥 Erken Erişim — TASTE Satın Al",
                "buy_with": "TON ile Satın Al",
                "holders": "Yatırımcılar",
                "my_balance": "Bakiyem",
                "invite_friend": "Arkadaşını Davet Et",
                "invite_gain": "Topluluğu birlikte büyütelim",
                "invite_desc": "Topluluğu birlikte büyütelim",
                "share_link": "Davet Linkini Paylaş",
                "referral_message": "TASTE'e katıl ve TON ekosisteminde kazanmaya başla! 🍳",
                "connect_wallet_first": "Lütfen önce cüzdanını bağla",
                "tap_to_earn": "Tıkla Kazan",
                "no_energy": "Biraz dinlenmem lazım! (Enerji Yok)",
                "transaction_failed": "İşlem başarısız oldu veya iptal edildi. ❌",
                "early_access_ending": "Erken erişim bitiyor",
                "swap_opening": "TASTE Swap Açılıyor...",
                "you_get": "alırsınız"
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
                    "initial_supply": "Toplam Arz: 25,000,000 TASTE",
                    "allocation": {
                        "locked": "Kilitli (JVault) — %88.4",
                        "liquidity": "Likidite Havuzu (kademeli) — %6.4",
                        "team": "Ekip Payı — %2",
                        "founder": "Kurucu/Owner — %2",
                        "airdrop": "Airdrop (dağıtılıyor) — %0.2",
                        "ops": "Masraf, Borsa & Ekstra Ödüller — %1"
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
                    "title": "Arz ve Mint Politikası",
                    "content": "TASTE'in mevcut toplam arzı 25.000.000 token olup şimdiye kadar hiç mint (yeni token basımı) yapılmamıştır. Mint yetkisi teknik olarak açık bırakılmıştır; ancak bu yetki yalnızca ilerleyen dönemlerde olası bir DAO (topluluk yönetimi) kararı için mevcuttur. TASTE ileride gerçek dünya işletmeleriyle (restoran, otel vb.) entegre bir kupon sistemi kurduğunda ve topluluk bu yönde oy kullandığında, arz artışı yalnızca şeffaf bir DAO oylamasıyla gündeme gelebilir. Ekip, tek başına ve topluluk onayı olmadan hiçbir şekilde yeni token basma yetkisine sahip değildir. 22.100.000 TASTE (%88.4) JVault ile kilitlidir ve on-chain doğrulanabilir."
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
                    "post_x": "Taste'i X'te Paylaş",
                    "telegram_stories": "Telegram Hikayesinde Paylaş",
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
