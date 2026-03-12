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
                "philosophy_title": "TASTE Philosophy",
                "philosophy": [
                    "🎯 TASTE doesn't roadmap what it cannot do.",
                    "✅ It roadmaps what it has done — proven, real.",
                    "🤝 It doesn't make promises it cannot keep. This is why people trust us.",
                    "📌 Every step transparent, every commitment fulfilled."
                ],
                "completed_goals": "Q1 2026 — Completed Goals",
                "ongoing": "Ongoing",
                "footer_text": "This roadmap is a living document — completed tasks are added, unpromised ones are not.",
                "footer_bold": "TASTE builds trust, doesn't sell dreams.",
                "items": {
                    "mint": { "title": "Token Mint & Launch", "desc": "TASTE token was minted on the TON blockchain and started trading on STON.fi." },
                    "lp": { "title": "Liquidity Pool", "desc": "TON/TASTE liquidity pool was created and activated on STON.fi." },
                    "lock": { "title": "Token & LP Lock", "desc": "88.4% of the total supply is locked in JVault with 3 separate locks. Additionally, 81.6% of STON.fi pTON-TASTE LP tokens are locked with tinu-locker.ton. Both locks are publicly verifiable on the blockchain." },
                    "security": { "title": "Security Scan", "desc": "The smart contract has passed a security audit." },
                    "miniapp": { "title": "Telegram Mini App", "desc": "A full-featured mini app running on Telegram was launched." },
                    "airdrop": { "title": "Airdrop & Rewards", "desc": "TASTE airdrop was performed for 443 wallets and is growing every day. The spinning wheel reward system is active." },
                    "documents": { "title": "Whitepaper & Litepaper", "desc": "Comprehensive technical documents and lite versions explaining the project have been published." },
                    "social": { "title": "Social Media Presence", "desc": "Telegram channel (@taste2025), Community Group, WhatsApp channel, Twitter/X (@taste_token), Instagram (@taste_ton_taste), TikTok (@taste_ton), Facebook, and official website (tastetoken.net) were established. Active on all platforms." },
                    "stray": { "title": "Stray Animals Donation Platform", "desc": "A platform was added where donations can be made to animal shelters using TON and TASTE." },
                    "food_sharing": { "title": "Daily Food Sharing Platform", "desc": "Users can share recipes, food, and venues. Real-time (with Supabase)." },
                    "wallets": { "title": "Reaching 500 Wallets", "desc": "First quarter goal: 500 unique wallet owners. The community continues to grow." },
                    "allergen": { "title": "Food Allergen Notification System", "desc": "The 14 mandatory allergens in EU & Turkey food legislation (Gluten, Milk, Eggs, Fish, etc.) were integrated into the Food Feed. Allergen tags can be added to every share, and calorie information is displayed." },
                    "v2": { "title": "Mini App v2 Update — March 2026", "desc": "PoweredBy section was renewed with SVG logos (OKX, Bitget, Binance, Telegram, Google, Gemini). TASTE summary card added to Whitepaper. Reward distribution end timer (May 20, 2026) added. Likes, search, and trending foods brought to Food Feed." },
                    "growth": { "title": "Community Growth", "desc": "Every day new users, every day new shares. Focused on organic growth." },
                    "visibility": { "title": "Greater DEX Visibility", "desc": "Presence in other TON ecosystem platforms alongside STON.fi." },
                    "reporting": { "title": "Transparent Reporting", "desc": "Holder count, transaction volume, and community growth will be shared regularly." },
                    "dev": { "title": "Mini App Development", "desc": "New features are being added based on user feedback." }
                }
            },
            "manifesto": {
                "title": "TASTE MANIFESTO",
                "subtitle": "Story of Fire • Path of Mastery",
                "section1": {
                    "title": "🌅 The Beginning of Fire",
                    "p1": "When the digital worlds first fire was lit…\nno one knew it would be a kitchen.",
                    "quote": "It all started with a spark.\nAn invisible hand… an invisible recipe…\nAnd humanity learning to control a decentralized fire for the first time…",
                    "p2": "The person who lit this fire wasn't a name… wasn't an identity…\nAn idea… a revolution… an <highlight>awakening</highlight>.",
                    "p3": "He just lit the fire.\nHe set up the stove.\nHe left the recipe.\nAnd then… he left the kitchen."
                },
                "section2": {
                    "title": "⚠️ Fire Was Not Enough",
                    "p1": "But fire alone was not enough.\nFire can burn…\nBut <highlight>cooking requires mastery</highlight>.",
                    "p2": "Over time, the digital world filled up.\nThousands of kitchens opened.\nGlowing signs… noisy halls… fast recipes…",
                    "quote": "But most of them lacked this:\nNo labor. No patience. No soul.\nThere was fire… but no flavor."
                },
                "section3": {
                    "title": "🍳 The Birth of TASTE",
                    "p1": "At that very point… another need arose.",
                    "p2": "Someone didn't just want to use fire.\nThey wanted to <highlight>understand</highlight> it.\nThey wanted to <highlight>process</highlight> it.\nThey wanted to <highlight>turn it into mastery</highlight>.",
                    "quote": "And a kitchen was established.\nQuiet. Unpretentious. But conscious.\nName: TASTE"
                },
                "section4": {
                    "title": "🚪 Entering the Kitchen",
                    "box": "Light the stove.\nDo you hear it?\nThat's not just the sound of a flame.\nThat is the <highlight>sound of transformation</highlight>.",
                    "p1": "When metal turned into digital, value was born…\nBut meaning was not born.\n<highlight>TASTE was established to cook the meaning.</highlight>",
                    "p2": "When you step through the door, you feel this:",
                    "quote": "Nothing is done fast here.\nNothing is done in vain here.\nNothing exists just to exist here.",
                    "p3": "Every material has a reason.\nEvery recipe has a history.\nEvery master has burn marks."
                },
                "section5": {
                    "title": "⏳ True Value Matures",
                    "quote": "Because true value is not produced…\nIt matures.\nIt waits on the fire.\nIt takes shape over time.\nIt deepens with patience."
                },
                "section6": {
                    "title": "🎯 So Why Do We Exist?",
                    "p1": "Not just for trading.\nNot just to buy and sell.\nNot at all just to be seen.",
                    "box": [
                        "We exist to <highlight>produce value</highlight>.",
                        "We exist to <highlight>share knowledge</highlight>.",
                        "We exist to <highlight>cultivate mastery</highlight>.",
                        "We exist to bring <highlight>meaning</highlight> to the digital world."
                    ],
                    "quote": "We are on the side of depth… not speed.\nWe are on the side of mastery… not noise.\nWe are on the side of producing… not consuming."
                },
                "section7": {
                    "title": "💎 TASTE is Not a Trend",
                    "p1": "Today, countless assets circulate in the digital world.\nSome exist only to be seen.\nSome exist only to be sold.\nSome are born only to be forgotten.",
                    "quote": "But some things… are born out of necessity.",
                    "p2": "<highlight>TASTE</highlight> is not a trend.\nNot a copy.\nNot a noise.",
                    "p3": "This kitchen was established to fill a void.\nWhere people don't just transact…\n<highlight>Producing… learning… transforming and developing…</highlight>\nto be a system."
                },
                "section8": {
                    "title": "🛤️ Our Path",
                    "paths": [
                        { "icon": "📚", "text": "Training apprentices" },
                        { "icon": "👨‍🍳", "text": "Training masters" },
                        { "icon": "🧠", "text": "Growing consciousness" },
                        { "icon": "💰", "text": "Deepening the value" },
                        { "icon": "🔥", "text": "Growing the fire" },
                        { "icon": "🍽️", "text": "Increasing the flavor" }
                    ],
                    "quote": "So where does this path go?\nNot to a place that ends. To a place that grows.\nThis is not a destination… it is a <highlight>path of mastery</highlight>.",
                    "p1": "True masters know:\n<highlight>The best recipe is the one that hasn't been written yet.</highlight>"
                },
                "section9": {
                    "title": "And Now…",
                    "p1": "The stove is on.\nPots are ready.\nThe recipe is waiting to be written.\nTime is flowing.",
                    "box": "This is not a story.\nThis is not a metaphor.\nThis is not a dream at all.\nThis is… <highlight>an inevitable evolution</highlight>.",
                    "p2": "The fire has been lit.\nThe system has been established.\nBut the flavor is still cooking.",
                    "footer_q": "The question is not: \"Does TASTE exist?\"",
                    "footer_a": "Are you ready to take your place in this kitchen? 🍽️"
                }
            },
            "charity": {
                "hero_sub": "Animal Love",
                "hero_title": "Support the Strays",
                "hero_desc": "You can donate <1> TON</1> or <2> TASTE</2> to support street and shelter animals with food, vet care, and shelter. Every penny touches a life. 🐶🐱",
                "stats": {
                    "stray": "Stray Animal",
                    "stray_val": "Unlimited",
                    "channel": "Donation Channel",
                    "channel_val": "24/7 Open",
                    "transparency": "Transparency",
                    "transparency_val": "On-Chain"
                },
                "wallet_title": "Donation Wallet",
                "copy_ton": "Copy Address (TON)",
                "copy_taste": "Copy Address (TASTE)",
                "copied": "Copied",
                "donate_ton": "Donate in TON",
                "amount_ph": "Amount (TON)",
                "send_button": "TON Donate",
                "connect_button": "Connect Wallet & Donate",
                "sending": "Sending...",
                "success": "Donation sent! Thank you 🐾",
                "error": "Transaction cancelled.",
                "manual_note": "To send TASTE, copy the address and send it manually from your wallet.",
                "taste_donate_title": "Donate in TASTE",
                "taste_donate_desc": "The wallet address above also accepts TASTE.<br /> You can send any amount of TASTE using Tonkeeper, TonWallet, or STON.fi.",
                "given_aids": "Given Aids",
                "proofs_title": "Proofs & Documents",
                "records": "records",
                "no_proofs": "No proofs added yet",
                "no_proofs_desc": "Photos and documents of aids provided will be<br />published here. We remain transparent! ✅",
                "close": "Close"
            },
            "legal": {
                "nav_title": "Legal Documents",
                "title": "Legal Information",
                "subtitle": "Terms and Conditions applied",
                "warning": "⚠️ This application <1>does not contain investment advice.</1> Crypto assets carry high risk.",
                "tabs": {
                    "disclaimer": { "label": "Disclaimer", "sub": "Legal Notice" },
                    "terms": { "label": "Terms of Use", "sub": "Usage Policy" },
                    "privacy": { "label": "Privacy Policy", "sub": "Data Protection" },
                    "risk": { "label": "Risk Disclosure", "sub": "Financial Risks" }
                },
                "last_updated": "Last updated: March 2025 · TASTE Token © 2025",
                "footer_network": "Built on The Open Network",
                "disclaimer_header": "Last updated: March 2025 | This document is prepared in Turkish and English.",
                "sections": {
                    "investment": {
                        "title": "🚫 Not Investment Advice",
                        "sub": "Disclaimer",
                        "content": "Nothing in this application, including price information, charts, analysis, forecasts, or any statements, shall be construed as:<br /><br />• Investment advice,<br />• Financial recommendations,<br />• An offer to buy or sell, or<br />• An offer to buy or sell any security or crypto asset."
                    },
                    "liability": {
                        "title": "⚖️ Limitation of Liability",
                        "sub": "Legal Limits",
                        "content": "The TASTE Token team, developers, and contributors shall not be held legally responsible for any decisions made based on this application or its content, resulting in:<br /><br />• Direct or indirect financial losses,<br />• Opportunity costs,<br />• Losses due to market fluctuations,<br />• Losses originating from technical failures."
                    },
                    "regulatory": {
                        "title": "🌍 Regulatory Compliance",
                        "sub": "Legal Compliance",
                        "content": "Buying, selling, or exchanging cryptocurrencies may be restricted, controlled, or completely prohibited in your country. By using this application, the user assumes full responsibility for acting in accordance with local laws."
                    },
                    "terms_welcome": "By continuing to use this application, you agree to the following terms.",
                    "general_terms": {
                        "title": "📌 General Terms",
                        "sub": "Terms of Use",
                        "content": "• This application is provided for promoting the TASTE Token project and providing information.<br />• The application is for informational purposes only; it does not provide any financial services.<br />• Users are solely responsible for all transactions they perform (including token purchases).<br />• Individuals under the age of 18 should not use this application."
                    },
                    "swap_terms": {
                        "title": "🔄 Token Transaction Terms",
                        "sub": "Swap Terms",
                        "content": "• All token transactions performed through third-party platforms like STON.fi are entirely at the user's discretion.<br />• The TASTE Token team cannot reverse or cancel blockchain transactions.<br />• Transaction fees (gas fees) are entirely the responsibility of the user.<br />• Prices can change instantly based on market conditions."
                    },
                    "prohibited": {
                        "title": "🚫 Prohibited Uses",
                        "sub": "Forbidden",
                        "content": "Use for the following purposes is strictly prohibited:<br /><br />• Money laundering or illegal financial transactions,<br />• Any attempts to manipulate the system,<br />• Sharing illegal, copyright-infringing, or offensive content (photo/text),<br />• Misuse of the content of this application for the purpose of misleading others."
                    },
                    "ugc": {
                        "title": "🗣️ User Generated Content (UGC)",
                        "sub": "Community Policy",
                        "content1": "All photos, recipes, comments, and venue information shared in the Community section are directly the user's own statements.<br /><br />",
                        "allergen_title": "Allergen and Calorie Data:",
                        "allergen_content": " Shared allergen (Gluten, Milk, etc.) and meal information is strictly for informational purposes. Medical or absolute accuracy is not guaranteed. TASTE cannot be held responsible for health or legal issues arising from false statements.<br />",
                        "copyright_title": "Copyright and Complaints:",
                        "copyright_content": " Legal responsibility for images uploaded by users belongs to them. The TASTE team reserves the right to delete content it deems inappropriate without prior notice."
                    },
                    "modify": {
                        "title": "⚙️ Right to Modify",
                        "sub": "Updates",
                        "content": "The TASTE Token team reserves the right to update these terms of use without prior notice. Continued use of the application implies acceptance of the updated terms."
                    },
                    "privacy_welcome": "Your privacy is important to us. This policy explains what data is collected and how it is used.",
                    "data_collect": {
                        "title": "📊 Data We Collect",
                        "sub": "Privacy",
                        "content": "This application runs on the Telegram Mini App infrastructure and may access the following data:<br /><br />• <1>Telegram User Information:</1> Your user ID and first name provided by Telegram (saved to database) to create an author profile in your community posts.<br />• <1>Community Data:</1> Photos, texts, recipes, and other interaction data you voluntarily share in the Food Feed (hosted in our Supabase database).<br />• <1>Wallet Address:</1> When you connect your TON wallet — for transaction and display purposes only.<br />• <1>Local Preferences:</1> Your language selection and disclaimer consent — stored on your device only (localStorage).",
                        "commitment": "Privacy Commitment:",
                        "commitment_text": "Your personal data and contact information are never sold to advertising companies or shared for marketing purposes."
                    },
                    "thirdy_party": {
                        "title": "🔗 Third-Party Services",
                        "sub": "Integrations",
                        "content": "The application may interact with the following external services:<br /><br />• <1>TON Blockchain:</1> An open and public blockchain network.<br />• <1>STON.fi:</1> An independent DEX platform; its own privacy policy applies.<br />• <1>GeckoTerminal API:</1> Used for live price data; anonymous access."
                    },
                    "deletion": {
                        "title": "🗑️ Data Deletion",
                        "sub": "Clean Up",
                        "content": "When you clear your browser/app cache, your locally stored preferences are deleted. Blockchain transaction records are inherently permanent and cannot be deleted."
                    },
                    "contact": {
                        "title": "📩 Contact",
                        "sub": "Support",
                        "content": "For your questions about privacy, you can reach us through our Telegram channel."
                    },
                    "risk_header": "⛔ High Risk Warning",
                    "risk_warning": "Cryptocurrency assets are highly volatile and speculative instruments. You may <1>lose all of your investment.</1>",
                    "market_risk": {
                        "title": "📉 Market Risk",
                        "sub": "Volatility",
                        "content": "The value of TASTE Token can drop significantly or approach zero in a very short time without any guarantee. Past price performance does not guarantee future returns."
                    },
                    "liquidity_risk": {
                        "title": "💧 Liquidity Risk",
                        "sub": "Trading Risk",
                        "content": "Depending on market conditions, it may not be possible to sell TASTE Token at your desired price or in your desired amount. The liquidity pool is limited and sudden exit transactions can negatively affect the price."
                    },
                    "tech_risk": {
                        "title": "🔧 Technology Risk",
                        "sub": "Network",
                        "content": "• <1>Smart Contract Risk:</1> Although audited, undiscovered vulnerabilities may exist in smart contracts.<br />• <1>Blockchain Risk:</1> Technical issues on the TON Blockchain may delay or stop transactions.<br />• <1>Wallet Security:</1> Your wallet keys security is entirely your responsibility."
                    },
                    "reg_risk": {
                        "title": "⚖️ Regulatory Risk",
                        "sub": "Policies",
                        "content": "Cryptocurrency laws vary rapidly across different countries. Your current investment may face legal restrictions in your country in the future. The user assumes this risk."
                    },
                    "approach": {
                        "title": "💡 Recommended Approach",
                        "sub": "Safety",
                        "content": "• Only invest what you can afford to lose.<br />• Diversify your portfolio; do not over-concentrate in any single asset.<br />• Do your own research (DYOR).<br />• Consult an independent financial advisor if necessary."
                    }
                }
            },
            "community": {
                "nav_title": "Community",
                "title": "Food Feed",
                "share": "Share",
                "stats": {
                    "posts": "Posts",
                    "likes": "Likes",
                    "allergens": "Allergen Tags"
                },
                "search_ph": "Search food, recipe, or venue...",
                "filters": {
                    "all": "All",
                    "food": "Food",
                    "recipe": "Recipe",
                    "menu": "Menu"
                },
                "trending": "Most Liked",
                "loading": "Loading posts...",
                "no_results": "No results found",
                "no_posts_title": "No posts yet",
                "no_posts_desc": "Share the first recipe or food!",
                "detail": "Details →",
                "create_title": "New Post",
                "venue_ph": "Venue name",
                "city_ph": "City",
                "recipe_ph": "Recipe Name",
                "ph_food": "What did you eat today? How was it?",
                "ph_recipe": "Short note about the recipe...",
                "ph_menu": "What do you think about the venue?",
                "calories_ph": "Calories (e.g. ~450 kcal)",
                "mark_allergens": "Mark Allergens",
                "ingredients_title": "🥄 Ingredients",
                "ing_ph": "Ingredient",
                "amt_ph": "Amount",
                "add_ing": "+ Add Ingredient",
                "steps_title": "📋 Preparation Steps",
                "step_ph": "Step {{n}}...",
                "add_step": "+ Add Step",
                "tags_title": "Tags",
                "add_photo": "📷 Add Photo (optional)",
                "sharing": "⏳ Sharing...",
                "share_btn": "🚀 Share",
                "allergen_warning": "Allergen Warning",
                "directions": "Directions",
                "close": "Close",
                "shared_from": "Shared from TASTE MiniApp 🍳",
                "just_now": "just now",
                "min_ago": "{{n}} min ago",
                "hrs_ago": "{{n}} hrs ago",
                "days_ago": "{{n}} days ago",
                "ingredients_count": "{{n}} ingredients · {{s}} steps",
                "tags": {
                    "breakfast": "Breakfast",
                    "lunch": "Lunch",
                    "dinner": "Dinner",
                    "snack": "Snack",
                    "dessert": "Dessert",
                    "vegan": "Vegan",
                    "vegetarian": "Vegetarian",
                    "soup": "Soup",
                    "meat": "Meat Dishes",
                    "vegetables": "Vegetables",
                    "traditional": "Traditional",
                    "practical": "Practical",
                    "healthy": "Healthy",
                    "cafe": "Cafe",
                    "fastfood": "Fast Food",
                    "finedining": "Fine Dining",
                    "seafood": "Seafood"
                },
                "allergens": {
                    "G": "Gluten",
                    "SÜ": "Milk",
                    "Y": "Egg",
                    "B": "Fish",
                    "KA": "Crustaceans",
                    "YF": "Peanuts",
                    "S": "Soya",
                    "KM": "Nuts",
                    "H": "Mustard",
                    "SS": "Sesame",
                    "SÜL": "Sulphur",
                    "KE": "Celery",
                    "AB": "Lupin",
                    "YU": "Molluscs"
                }
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
                "philosophy_title": "TASTE Felsefesi",
                "philosophy": [
                    "🎯 TASTE yapamayacağı şeyin yol haritasını çizmez.",
                    "✅ Yaptığının haritasını çıkarır — kanıtlanmış, gerçek.",
                    "🤝 Veremeyeceği sözü vermez. İnsanlar bize bu yüzden güveniyor.",
                    "📌 Her adım şeffaf, her taahhüt yerine getirilmiş."
                ],
                "completed_goals": "Q1 2026 — Tamamlanan Hedefler",
                "ongoing": "Devam Eden",
                "footer_text": "Bu yol haritası yaşayan bir belgedir — tamamlananlar eklenir, söz verilmeyenler eklenmez.",
                "footer_bold": "TASTE güveni inşa eder, hayal satmaz.",
                "items": {
                    "mint": { "title": "Token Mint & Piyasaya Sürüm", "desc": "TASTE token TON blockchain üzerinde mint edildi, STON.fi'de işlem görmeye başladı." },
                    "lp": { "title": "Likidite Havuzu", "desc": "STON.fi'de TON/TASTE likidite havuzu oluşturuldu ve aktif." },
                    "lock": { "title": "Token & LP Kilidi", "desc": "Toplam arzın %88.4'ü JVault'ta 3 ayrı kilidle kilitlendi. Ek olarak STON.fi pTON-TASTE LP tokenlerinin %81.6'sı tinu-locker.ton ile kilitlendi. Her iki kilit blockchain'de herkese açık doğrulanabilir." },
                    "security": { "title": "Güvenlik Taraması", "desc": "Akıllı sözleşme güvenlik denetiminden geçirildi." },
                    "miniapp": { "title": "Telegram Mini App", "desc": "Telegram üzerinde çalışan tam özellikli mini uygulama yayına girdi." },
                    "airdrop": { "title": "Airdrop & Ödül Dağıtımı", "desc": "44 cüzdana TASTE airdrop gerçekleştirildi ve her gün büyüyor. Çarkıfelek ödül sistemi aktif." },
                    "documents": { "title": "Whitepaper & Litepaper", "desc": "Projeyi anlatan kapsamlı teknik doküman ve lite versiyon yayınlandı." },
                    "social": { "title": "Sosyal Ağ Varlığı", "desc": "Telegram kanalı (@taste2025) ve Topluluk Grubu, WhatsApp kanalı, Twitter/X (@taste_token), Instagram (@taste_ton_taste), TikTok (@taste_ton), Facebook ve resmi website (tastetoken.net) kuruldu. Tüm platformlarda aktif." },
                    "stray": { "title": "Sokak Hayvanları Bağış Platformu", "desc": "TON ve TASTE ile hayvan barınaklarına bağış yapılabilen platform eklendi." },
                    "food_sharing": { "title": "Günlük Yemek Paylaşım Platformu", "desc": "Kullanıcılar tarif, yemek ve mekan paylaşabiliyor. Gerçek zamanlı (Supabase ile)." },
                    "wallets": { "title": "500 Cüzdana Ulaşma", "desc": "İlk çeyrek hedefi: 500 benzersiz cüzdan sahibi. Topluluk büyümeye devam ediyor." },
                    "allergen": { "title": "Gıda Alerjeni Bildirim Sistemi", "desc": "AB & Türkiye gıda mevzuatındaki 14 zorunlu alerjen (Gluten, Süt, Yumurta, Balık vb.) Yemek Akışı'na entegre edildi. Her paylaşıma alerjen etiketi eklenebiliyor, kalori bilgisi gösteriliyor." },
                    "v2": { "title": "Mini App v2 Güncellemesi — Mart 2026", "desc": "PoweredBy bölümü SVG logolarla yenilendi (OKX, Bitget, Binance, Telegram, Google, Gemini). Whitepaper'a TASTE özet kartı eklendi. Ödül dağıtımı bitiş sayacı (20 Mayıs 2026) eklendi. Yemek Akışı'na beğeni, arama ve trend yemekler getirildi." },
                    "growth": { "title": "Topluluk Büyütme", "desc": "Her gün yeni kullanıcılar, her gün yeni paylaşımlar. Organik büyüme odaklı." },
                    "visibility": { "title": "Daha Fazla DEX Görünürlüğü", "desc": "STON.fi'nin yanı sıra diğer TON ekosistem platformlarında varlık." },
                    "reporting": { "title": "Şeffaf Raporlama", "desc": "Holder sayısı, işlem hacmi ve topluluk büyümesi düzenli paylaşılacak." },
                    "dev": { "title": "Mini App Geliştirme", "desc": "Kullanıcı geri bildirimlerine göre yeni özellikler ekleniyor." }
                }
            },
            "manifesto": {
                "title": "TASTE MANİFESTOSU",
                "subtitle": "Ateşin Hikâyesi • Ustalığın Yolu",
                "section1": {
                    "title": "🌅 Ateşin Başlangıcı",
                    "p1": "Dijital dünyanın ilk ateşi yakıldığında…\nkimse bunun bir mutfak olacağını bilmiyordu.",
                    "quote": "Her şey bir kıvılcımla başladı.\nGörünmeyen bir el… görünmeyen bir tarif…\nVe insanlık ilk kez merkeziyetsiz bir ateşi kontrol etmeyi öğreniyor…",
                    "p2": " Bu ateşi yakan kişi bir isim değildi… bir kimlik değildi…\nBir fikir… bir devrim… bir <highlight>uyanıştı</highlight>.",
                    "p3": "O sadece ateşi yaktı.\nOcağı kurdu.\nTarifi bıraktı.\nVe sonra… mutfaktan çıktı."
                },
                "section2": {
                    "title": "⚠️ Ateş Yeterli Değildi",
                    "p1": "Ama ateş tek başına yeterli değildi.\nAteş yanabilir…\nAma <highlight>yemek pişirmek ustalık ister</highlight>.",
                    "p2": "Zamanla dijital dünya doldu.\nBinlerce mutfak açıldı.\nParlayan tabelalar… gürültülü salonlar… hızlı tarifler…",
                    "quote": "Ama çoğunda şu yoktu:\nEmek yoktu. Sabır yoktu. Ruh yoktu.\nAteş vardı… ama lezzet yoktu."
                },
                "section3": {
                    "title": "🍳 TASTE'in Doğuşu",
                    "p1": "İşte tam o noktada… başka bir ihtiyaç doğdu.",
                    "p2": "Birileri ateşi sadece kullanmak istemedi.\nOnu <highlight>anlamak</highlight> istedi.\nOnu <highlight>işlemek</highlight> istedi.\nOnu <highlight>ustalığa dönüştürmek</highlight> istedi.",
                    "quote": "Ve bir mutfak kuruldu.\nSessiz. Gösterişsiz. Ama bilinçli.\nAdı: TASTE"
                },
                "section4": {
                    "title": "🚪 Mutfağa Giriyoruz",
                    "box": "Ocağın altını yak.\nDuyuyor musun?\nBu sadece bir alev sesi değil.\nBu <highlight>dönüşümün sesi</highlight>.",
                    "p1": "Metal dijitale dönüştüğünde değer doğmuştu…\nAma anlam doğmamıştı.\n<highlight>TASTE anlamı pişirmek için kuruldu.</highlight>",
                    "p2": "Kapıdan adım attığında şunu hissedersin:",
                    "quote": "Burada hiçbir şey hızlı yapılmaz.\nBurada hiçbir şey boşuna yapılmaz.\nBurada hiçbir şey sadece var olmak için var değildir.",
                    "p3": "Her malzemenin nedeni vardır.\nHer tarifin geçmişi vardır.\nHer ustanın yanık izleri vardır."
                },
                "section5": {
                    "title": "⏳ Gerçek Değer Olgunlaşır",
                    "quote": "Çünkü gerçek değer üretilmez…\nOlgunlaşır.\nAteşin üstünde bekler.\nZamanla şekil alır.\nSabırla derinleşir."
                },
                "section6": {
                    "title": "🎯 Peki Biz Ne İçin Varız?",
                    "p1": "Sadece işlem yapmak için değil.\nSadece almak ve satmak için değil.\nSadece görünmek için hiç değil.",
                    "box": [
                        "Biz <highlight>değer üretmek</highlight> için varız.",
                        "Biz <highlight>bilgiyi paylaşmak</highlight> için varız.",
                        "Biz <highlight>ustalık yetiştirmek</highlight> için varız.",
                        "Biz dijital dünyaya <highlight>anlam kazandırmak</highlight> için varız."
                    ],
                    "quote": "Biz hızın değil… derinliğin tarafındayız.\nBiz gürültünün değil… ustalığın tarafındayız.\nBiz tüketmenin değil… üretmenin tarafındayız."
                },
                "section7": {
                    "title": "💎 TASTE Bir Trend Değil",
                    "p1": "Bugün dijital dünyada sayısız varlık dolaşıyor.\nBazıları sadece görülmek için var.\nBazıları sadece satılmak için var.\nBazıları sadece unutulmak için doğuyor.",
                    "quote": "Ama bazı şeyler… ihtiyaçtan doğar.",
                    "p2": "<highlight>TASTE</highlight> bir trend değil.\nBir kopya değil.\nBir gürültü değil.",
                    "p3": "Bu mutfak bir boşluğu doldurmak için kuruldu.\nİnsanların sadece işlem yapmadığı…\n<highlight>Ürettiği… öğrendiği… dönüşüp geliştiği…</highlight>\nbir sistem olmak için."
                },
                "section8": {
                    "title": "🛤️ Yolumuz",
                    "paths": [
                        { "icon": "📚", "text": "Çırak yetiştirmek" },
                        { "icon": "👨‍🍳", "text": "Usta yetiştirmek" },
                        { "icon": "🧠", "text": "Bilinci büyütmek" },
                        { "icon": "💰", "text": "Değeri derinleştirmek" },
                        { "icon": "🔥", "text": "Ateşi büyütmek" },
                        { "icon": "🍽️", "text": "Lezzeti artırmak" }
                    ],
                    "quote": "Peki bu yol nereye gidiyor?\nSonu olan bir yere değil. Büyüyen bir yere.\nBu bir varış noktası değil… bir <highlight>ustalık yolu</highlight>.",
                    "p1": "Gerçek ustalar bilir:\n<highlight>En iyi tarif henüz yazılmamış olandır.</highlight>"
                },
                "section9": {
                    "title": "Ve Şimdi…",
                    "p1": "Ocak yanıyor.\nTencereler hazır.\nTarif yazılmayı bekliyor.\nZaman akıyor.",
                    "box": "Bu bir hikâye değil.\nBu bir metafor değil.\nBu bir hayal hiç değil.\nBu… <highlight>kaçınılmaz bir evrim</highlight>.",
                    "p2": "Ateş yakıldı.\nSistem kuruldu.\nAma lezzet hâlâ pişiyor.",
                    "footer_q": "Soru şu değil: \"TASTE var mı?\"",
                    "footer_a": "Bu mutfakta yerini almaya hazır mısın? 🍽️"
                }
            },
            "charity": {
                "hero_sub": "Hayvan Sevgisi",
                "hero_title": "Sokak Hayvanlarına Destek",
                "hero_desc": "Barınaksız sokak hayvanlarına mama, veteriner ve barınak desteği için <1> TON</1> veya <2> TASTE</2> bağışlayabilirsin. Her kuruş bir hayata dokunur. 🐶🐱",
                "stats": {
                    "stray": "Sokak Hayvanı",
                    "stray_val": "Sınırsız",
                    "channel": "Bağış Kanalı",
                    "channel_val": "24/7 Açık",
                    "transparency": "Şeffaflık",
                    "transparency_val": "On-Chain"
                },
                "wallet_title": "Bağış Cüzdanı",
                "copy_ton": "Adresi Kopyala (TON)",
                "copy_taste": "Adresi Kopyala (TASTE)",
                "copied": "Kopyalandı",
                "donate_ton": "TON ile Bağış Yap",
                "amount_ph": "Miktar (TON)",
                "send_button": "TON Bağışla",
                "connect_button": "Cüzdanı Bağla & Bağışla",
                "sending": "Gönderiliyor...",
                "success": "Bağış gönderildi! Teşekkürler 🐾",
                "error": "İşlem iptal edildi.",
                "manual_note": "TASTE göndermek için adresi kopyalayıp cüzdanından manuel gönderebilirsin.",
                "taste_donate_title": "TASTE ile Bağış",
                "taste_donate_desc": "Yukarıdaki cüzdan adresi aynı zamanda TASTE kabul eder.<br /> Tonkeeper, TonWallet veya STON.fi üzerinden istediğin miktarda TASTE gönderebilirsin.",
                "given_aids": "Yapılan Yardımlar",
                "proofs_title": "Kanıt & Belgeler",
                "records": "kayıt",
                "no_proofs": "Henüz kanıt eklenmedi",
                "no_proofs_desc": "Yapılan yardımların fotoğraf ve belgeleri<br />burada yayınlanacak. Şeffaf kalıyoruz! ✅",
                "close": "Kapat"
            },
            "legal": {
                "nav_title": "Yasal Belgeler",
                "title": "Hukuki Bilgilendirme",
                "subtitle": "Legal Information & Risk Disclosure",
                "warning": "⚠️ Bu uygulama <1>yatırım tavsiyesi içermez.</1> Kripto varlıklar yüksek risk taşır.",
                "tabs": {
                    "disclaimer": { "label": "Sorumluluk Reddi", "sub": "Disclaimer" },
                    "terms": { "label": "Kullanım Koşulları", "sub": "Terms of Use" },
                    "privacy": { "label": "Gizlilik Politikası", "sub": "Privacy Policy" },
                    "risk": { "label": "Risk Açıklaması", "sub": "Risk Disclosure" }
                },
                "last_updated": "Son güncelleme: Mart 2025 · TASTE Token © 2025",
                "footer_network": "Built on The Open Network",
                "disclaimer_header": "Son güncelleme: Mart 2025 | Bu belge Türkçe ve İngilizce olarak hazırlanmıştır.",
                "sections": {
                    "investment": {
                        "title": "🚫 Yatırım Tavsiyesi Değildir",
                        "sub": "Not Investment Advice",
                        "content": "Bu uygulama içindeki hiçbir içerik, fiyat bilgisi, grafik, analiz, tahmin veya herhangi bir ifade;<br /><br />• Yatırım tavsiyesi,<br />• Finansal öneri,<br />• Alım-satım teklifi veya<br />• Herhangi bir menkul kıymet ya da kripto varlık için alım-satım teklifi<br /><br />olarak yorumlanamaz, değerlendirilemez veya bu şekilde kullanılamaz."
                    },
                    "liability": {
                        "title": "⚖️ Sorumluluk Sınırlaması",
                        "sub": "Limitation of Liability",
                        "content": "TASTE Token ekibi, geliştiricileri ve katkıda bulunanlar; bu uygulamaya veya içerdiği bilgilere dayanarak alınan herhangi bir karar sonucunda ortaya çıkabilecek:<br /><br />• Doğrudan veya dolaylı mali kayıplar,<br />• Fırsat maliyetleri,<br />• Piyasa dalgalanmalarından kaynaklanan zararlar,<br />• Teknik arızalar nedeniyle oluşan kayıplar<br /><br />için hiçbir hukuki sorumluluk kabul etmez."
                    },
                    "regulatory": {
                        "title": "🌍 Yasal Uyumluluk",
                        "sub": "Regulatory Compliance",
                        "content": "Kripto para satın alma, satma veya takas etme işlemleri, bulunduğunuz ülkede kısıtlı, kontrollü veya tamamen yasak olabilir. Bu uygulamayı kullanan kişi, yerel hukuka uygun hareket etme sorumluluğunu tamamen üstlenmiş sayılır."
                    },
                    "terms_welcome": "Bu uygulamayı kullanmaya devam etmekle aşağıdaki koşulları kabul etmiş sayılırsınız.",
                    "general_terms": {
                        "title": "📌 Genel Kullanım Koşulları",
                        "sub": "General Terms",
                        "content": "• Bu uygulama TASTE Token projesini tanıtmak ve bilgi vermek amacıyla sunulmuştur.<br />• Uygulama yalnızca bilgilendirme amaçlıdır; herhangi bir finansal hizmet sunmamaktadır.<br />• Kullanıcılar, gerçekleştirdikleri tüm işlemlerden (token alımı dahil) bizzat sorumludur.<br />• 18 yaşından küçük bireyler bu uygulamayı kullanmamalıdır."
                    },
                    "swap_terms": {
                        "title": "🔄 Token Alım-Satım Koşulları",
                        "sub": "Token Transaction Terms",
                        "content": "• STON.fi gibi üçüncü taraf platformlar üzerinden gerçekleştirilen tüm token işlemleri tamamen kullanıcının iradesiyle yapılmaktadır.<br />• TASTE Token ekibi, blockchain işlemlerini geri alamaz veya iptal edemez.<br />• İşlem ücretleri (gas fee) tamamen kullanıcıya aittir.<br />• Fiyatlar piyasa koşullarına göre anlık değişebilir."
                    },
                    "prohibited": {
                        "title": "🚫 Yasaklı Kullanımlar",
                        "sub": "Prohibited Uses",
                        "content": "Aşağıdaki amaçlarla kullanım kesinlikle yasaktır:<br /><br />• Para aklama veya yasadışı finansal işlemler,<br />• Sistemi manipüle etmeye yönelik her türlü girişim,<br />• Yasadışı, telif hakkı ihlali içeren veya rahatsız edici içerik (fotoğraf/yazı) paylaşımı,<br />• Başkalarını yanıltma amacıyla bu uygulamanın içeriklerinin kötüye kullanımı."
                    },
                    "ugc": {
                        "title": "🗣️ Topluluk ve İçerik Sorumluluğu (UGC)",
                        "sub": "User Generated Content",
                        "content1": "Yemek Akışı (Community) bölümünde paylaşılan tüm fotoğraflar, tarifler, yorumlar ve mekan bilgileri doğrudan kullanıcıların kendi beyanıdır.<br /><br />",
                        "allergen_title": "Alerjen ve Kalori Verisi:",
                        "allergen_content": " Paylaşılan alerjen (Gluten, Süt vb.) ve öğün bilgileri tamamen bilgilendirme amaçlıdır. Tıbbi veya kesin doğruluğu garanti edilmez. Yanlış beyandan doğacak sağlık ve hukuki sorunlardan TASTE sorumlu tutulamaz.<br />",
                        "copyright_title": "Telif ve Şikayet:",
                        "copyright_content": " Kullanıcıların yüklediği görsellerin yasal sorumluluğu kendilerine aittir. TASTE ekibi, uygunsuz gördüğü içerikleri önceden haber vermeksizin silme hakkını saklı tutar."
                    },
                    "modify": {
                        "title": "⚙️ Değişiklik Hakkı",
                        "sub": "Right to Modify",
                        "content": "TASTE Token ekibi, bu kullanım koşullarını önceden haber vermeksizin güncelleme hakkını saklı tutar. Uygulamayı kullanmaya devam etmek, güncellenmiş koşulların kabul edildiği anlamına gelir."
                    },
                    "privacy_welcome": "Gizliliğiniz bizim için önemlidir. Bu politika, hangi verilerin toplandığını ve nasıl kullanıldığını açıklar.",
                    "data_collect": {
                        "title": "📊 Toplanan Veriler",
                        "sub": "Data We Collect",
                        "content": "Bu uygulama, Telegram Mini App altyapısı üzerinde çalışmaktadır ve aşağıdaki verilere erişebilir:<br /><br />• <1>Telegram Kullanıcı Bilgileri:</1> Topluluk paylaşımlarınızda yazar profili oluşturmak için Telegram'ın sağladığı kullanıcı kimliği ve ilk adınız (veritabanına kaydedilir).<br />• <1>Topluluk Verileri:</1> Yemek Akışı'nda kendi isteğinizle paylaştığınız fotoğraflar, metinler, tarifler ve diğer etkileşim verileri (Supabase veritabanımızda barındırılır).<br />• <1>Cüzdan Adresi:</1> TON cüzdanınızı bağladığınızda — yalnızca işlem ve gösterim amacıyla.<br />• <1>Yerel Tercihler:</1> Dil seçiminiz ve sorumluluk reddi onayı — yalnızca cihazınızda (localStorage).",
                        "commitment": "Gizlilik Taahhüdü:",
                        "commitment_text": "Kişisel verileriniz ve iletişim bilgileriniz asla reklam şirketlerine satılmaz, pazarlama amacıyla paylaşılmaz."
                    },
                    "thirdy_party": {
                        "title": "🔗 Üçüncü Taraf Servisler",
                        "sub": "Third-Party Services",
                        "content": "Uygulama aşağıdaki harici servislerle etkileşime girebilir:<br /><br />• <1>TON Blockchain:</1> Açık ve halka açık bir blockchain ağı.<br />• <1>STON.fi:</1> Bağımsız bir DEX platformu; kendi gizlilik politikası geçerlidir.<br />• <1>GeckoTerminal API:</1> Canlı fiyat verisi için kullanılır; anonim erişim."
                    },
                    "deletion": {
                        "title": "🗑️ Veri Silme",
                        "sub": "Data Deletion",
                        "content": "Tarayıcı / uygulama önbelleğini temizlediğinizde yerel olarak saklanan tercihleriniz silinir. Blockchain üzerindeki işlem kayıtları ise doğası gereği kalıcıdır ve silinemez."
                    },
                    "contact": {
                        "title": "📩 İletişim",
                        "sub": "Contact",
                        "content": "Gizlilik ile ilgili sorularınız için Telegram kanalımız üzerinden bize ulaşabilirsiniz."
                    },
                    "risk_header": "⛔ Yüksek Risk Uyarısı",
                    "risk_warning": "Kripto para varlıkları son derece değişken ve spekülatif araçlardır. Yatırımınızın <1>tamamını kaybedebilirsiniz.</1>",
                    "market_risk": {
                        "title": "📉 Piyasa Riski",
                        "sub": "Market Risk",
                        "content": "TASTE Token'ın değeri herhangi bir garanti olmaksızın çok kısa süre içinde önemli ölçüde düşebilir veya sıfıra yaklaşabilir. Geçmiş fiyat performansı gelecekteki getirileri garanti etmez."
                    },
                    "liquidity_risk": {
                        "title": "💧 Likidite Riski",
                        "sub": "Liquidity Risk",
                        "content": "Piyasa koşullarına bağlı olarak TASTE Token'ı istediğiniz fiyattan veya istediğiniz miktarda satmak mümkün olmayabilir. Likidite havuzu sınırlı olup ani çıkış işlemleri fiyatı olumsuz etkileyebilir."
                    },
                    "tech_risk": {
                        "title": "🔧 Teknoloji Riski",
                        "sub": "Technology Risk",
                        "content": "• <1>Akıllı Sözleşme Riski:</1> Denetlenmiş olmasına karşın, akıllı sözleşmelerde keşfedilmemiş açıklar bulunabilir.<br />• <1>Blockchain Riski:</1> TON Blockchain'de meydana gelebilecek teknik aksaklıklar işlemleri geciktirebilir veya durdurabilir.<br />• <1>Cüzdan Güvenliği:</1> Cüzdan anahtarlarınızın güvenliği tamamen sizin sorumluluğunuzdadır."
                    },
                    "reg_risk": {
                        "title": "⚖️ Düzenleyici Risk",
                        "sub": "Regulatory Risk",
                        "content": "Kripto para yasaları farklı ülkelerde hızla değişmektedir. Mevcut yatırımınız ilerleyen dönemlerde bulunduğunuz ülkede yasal kısıtlamalarla karşılaşabilir. Bu riski kullanıcı üstlenir."
                    },
                    "approach": {
                        "title": "💡 Önerilen Yaklaşım",
                        "sub": "Recommended Approach",
                        "content": "• Yalnızca kaybetmeyi göze aldığınız miktarı yatırın.<br />• Portföyünüzü çeşitlendirin; hiçbir varlığa aşırı yoğunlaşmayın.<br />• Kendi araştırmanızı yapın (DYOR — Do Your Own Research).<br />• Gerekirse bağımsız bir finansal danışmana başvurun."
                    }
                }
            },
            "community": {
                "nav_title": "Topluluk",
                "title": "Yemek Akışı",
                "share": "Paylaş",
                "stats": {
                    "posts": "Paylaşım",
                    "likes": "Beğeni",
                    "allergens": "Alerjen Etiketli"
                },
                "search_ph": "Yemek, tarif veya mekan ara...",
                "filters": {
                    "all": "Hepsi",
                    "food": "Yemek",
                    "recipe": "Tarif",
                    "menu": "Menü"
                },
                "trending": "En Çok Beğenilen",
                "loading": "Paylaşımlar yükleniyor...",
                "no_results": "Sonuç bulunamadı",
                "no_posts_title": "Henüz paylaşım yok",
                "no_posts_desc": "İlk tarifi ya da yemeği sen paylaş!",
                "detail": "Detay →",
                "create_title": "Yeni Paylaşım",
                "venue_ph": "Mekan adı",
                "city_ph": "Şehir",
                "recipe_ph": "Yemek Adı",
                "ph_food": "Bugün ne yedin? Nasıldı?",
                "ph_recipe": "Tarif hakkında kısa not...",
                "ph_menu": "Mekan hakkında ne düşünüyorsun?",
                "calories_ph": "Kalori (ör: ~450 kcal)",
                "mark_allergens": "Alerjen İşaretle",
                "ingredients_title": "🥄 Malzemeler",
                "ing_ph": "Malzeme",
                "amt_ph": "Miktar",
                "add_ing": "+ Malzeme Ekle",
                "steps_title": "📋 Yapılış Adımları",
                "step_ph": "Adım {{n}}...",
                "add_step": "+ Adım Ekle",
                "tags_title": "Etiketler",
                "add_photo": "📷 Fotoğraf Ekle (opsiyonel)",
                "sharing": "⏳ Paylaşılıyor...",
                "share_btn": "🚀 Paylaş",
                "allergen_warning": "Alerjen Uyarısı",
                "directions": "Yapılış",
                "close": "Kapat",
                "shared_from": "TASTE MiniApp'ten paylaşıldı 🍳",
                "just_now": "az önce",
                "min_ago": "{{n}} dk önce",
                "hrs_ago": "{{n}} sa önce",
                "days_ago": "{{n}} gün önce",
                "ingredients_count": "{{n}} malzeme · {{s}} adım",
                "tags": {
                    "breakfast": "Kahvaltı",
                    "lunch": "Öğle",
                    "dinner": "Akşam",
                    "snack": "Atıştırmalık",
                    "dessert": "Tatlı",
                    "vegan": "Vegan",
                    "vegetarian": "Vejetaryen",
                    "soup": "Çorba",
                    "meat": "Et Yemekleri",
                    "vegetables": "Sebze",
                    "traditional": "Yöresel",
                    "practical": "Pratik",
                    "healthy": "Sağlıklı",
                    "cafe": "Kafe",
                    "fastfood": "Fast Food",
                    "finedining": "Fine Dining",
                    "seafood": "Deniz"
                },
                "allergens": {
                    "G": "Gluten",
                    "SÜ": "Süt",
                    "Y": "Yumurta",
                    "B": "Balık",
                    "KA": "Kabuklu",
                    "YF": "Yerfıstığı",
                    "S": "Soya",
                    "KM": "Kuruyemiş",
                    "H": "Hardal",
                    "SS": "Susam",
                    "SÜL": "Sülfür",
                    "KE": "Kereviz",
                    "AB": "Acı Bakla",
                    "YU": "Yumuşakça"
                }
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
