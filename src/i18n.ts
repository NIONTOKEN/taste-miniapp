import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            "app": {
                "title": "TASTE",
                "description": "The Art and Education of Culinary Digital Assets",
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
                "early_access_ending": "🚀 Early Access Tier 1 Ending in:",
                "you_get": "You get",
                "swap_opening": "Swapping via STON.fi...",
                "reward_end": "🎁 Reward Distribution Ends — May 20, 2026",
                "units": {
                    "day": "DAYS",
                    "hr": "HRS",
                    "min": "MIN",
                    "sec": "SEC",
                    "holder": "Holders",
                    "supply": "Total Supply",
                    "locked": "Locked"
                },
                "faq": {
                    "title": "❓ Frequently Asked Questions",
                    "what_is": "What is TASTE?",
                    "what_is_ans": "TASTE is a gastronomy and education-focused digital loyalty asset built on the TON blockchain. It targets real-world use in restaurants, hotels, and the food & beverage industry.",
                    "how_to": "How to Buy?",
                    "how_to_ans": "1. Load TON into your TON wallet (Tonkeeper, @wallet).<br />2. Select the desired amount from the panel above.<br />3. Click 'Buy with TON' and swap via STON.fi."
                }
            },
            "home": {
                "live_badge": "Live Activity",
                "live_title": "📡 TASTE Activity"
            },
            "market": {
                "live_chart": "Live Market Analysis"
            },
            "nav": {
                "home": "Home",
                "roadmap": "Roadmap",
                "whitepaper": "Whitepaper",
                "litepaper": "Litepaper",
                "community": "Food Feed",
                "spin": "Spin Wheel",
                "charity": "Charity",
                "legal": "Legal",
                "leaderboard": "Leaderboard",
                "play": "Play",
                "wallet": "Wallet",
                "chef": "Taste Chef"
            },
            "game": {
                "title": "Chef Career",
                "next": "NEXT",
                "back": "Back",
                "reward": "REWARD",
                "excellent": "Excellent!",
                "success_message": "You've successfully prepared {{dish}}.",
                "return_map": "Back to Map",
                "complete_info": "Complete levels to earn TASTE assets! 🍳💎"
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
                    "mint": { "title": "Asset Genesis & Launch", "desc": "TASTE assets were generated on the TON blockchain and started trading on STON.fi." },
                    "lp": { "title": "Liquidity Pool", "desc": "TON/TASTE liquidity pool was created and activated on STON.fi." },
                    "lock": { "title": "Asset & LP Lock", "desc": "88.4% of the total supply is locked in JVault with 3 separate locks. Additionally, 81.6% of STON.fi pTON-TASTE LP units are locked with tinu-locker.ton. Both locks are publicly verifiable on the blockchain." },
                    "security": { "title": "Security Scan", "desc": "The smart contract has passed a security audit." },
                    "miniapp": { "title": "Telegram Mini App", "desc": "A full-featured mini app running on Telegram was launched." },
                    "airdrop": { "title": "Airdrop & Rewards", "desc": "TASTE airdrop was performed for 521 wallets and is growing every day. The spinning wheel reward system is active." },
                    "documents": { "title": "Whitepaper & Litepaper", "desc": "Comprehensive technical documents and lite versions explaining the project have been published." },
                    "social": { "title": "Social Media Presence", "desc": "Telegram channel (@taste2025), Community Group, WhatsApp channel, Twitter/X (@taste_token), Instagram (@taste_ton_taste), TikTok (@taste_ton), Facebook, and official website (tastetoken.net) were established. Active on all platforms." },
                    "stray": { "title": "Stray Animals Donation Platform", "desc": "A platform was added where donations can be made to animal shelters using TON and TASTE." },
                    "food_sharing": { "title": "Daily Food Sharing Platform", "desc": "Users can share recipes, food, and venues. Real-time (with Supabase)." },
                    "wallets": { "title": "Reached 521 Wallets", "desc": "First quarter goal surpassed with 521 unique wallet owners. The community continues to grow." },
                    "allergen": { "title": "Food Allergen Notification System", "desc": "The 14 mandatory allergens in EU & Turkey food legislation (Gluten, Milk, Eggs, Fish, etc.) were integrated into the Food Feed. Allergen tags can be added to every share, and calorie information is displayed." },
                    "v2": { "title": "Mini App v2 Update — March 2026", "desc": "PoweredBy section was renewed with SVG logos (OKX, Bitget, Binance, Telegram, Google, Gemini). TASTE summary card added to Whitepaper. Reward distribution end timer (May 20, 2026) added. Likes, search, and trending foods brought to Food Feed." },
                    "v2_1": { "title": "Mini App v2.1 Redesign — March 2026", "desc": "Premium Dark UI & UX overhaul. New 'Explore' Menu Drawer implemented. FAQ section added. AI engine upgraded to Llama 3.3 70B via Groq. Global Telegram theme colors synchronized for premium feel." },
                    "v2_2": { "title": "Mini App v2.2 Content & Compliance — March 2026", "desc": "TASTE Manifesto published explaining the project's soul. Full Internationalization (i18n) support for English & Turkish languages. Comprehensive Legal Framework (Terms, Privacy, Risk Disclosure) and first-launch Disclaimer Modal implemented for user safety." },
                    "v2_3": { "title": "Mini App v2.3 Wallet & QR Update — March 2026", "desc": "Quick Wallet & Transfer system launched. Users can now view TON & TASTE balances, scan QR codes for instant payments, and send both TON and TASTE tokens securely with optimized gas fees." },
                    "v2_4": { "title": "Mini App v2.4 Taste Chef", "desc": "Digital Loyalty & Discount system. Apprenticeship tiers to Master Chef status. Symbolic fee for discount validation at cashiers." },
                    "v2_5": { "title": "Mini App v2.5 Community 3.0 — March 2026", "desc": "Global Real-time Food Feed & Job Board launched with Supabase. Direct Telegram integration for instant contact with job posters. 'Share & Win' campaigns active with reward wallet visibility. Global live chat active." },
                    "growth": { "title": "Community Growth", "desc": "Every day new users, every day new shares. Focused on organic growth." },
                    "visibility": { "title": "Greater DEX Visibility", "desc": "Presence in other TON ecosystem platforms alongside STON.fi." },
                    "reporting": { "title": "Transparent Reporting", "desc": "Holder count, transaction volume, and community growth will be shared regularly." },
                    "dev": { "title": "Mini App Development", "desc": "New features are being added based on user feedback." }
                },
                "spin": {
                    "ton_balance": "TON Balance",
                    "ton_target": "Target: 5 TON",
                    "ton_claim_ready": "🎉 TON REWARD READY!",
                    "ton_left": "{{n}} TON left",
                    "win_ton": "🎉 {{n}} TON Won!",
                    "reward_claim_ton": "🎉 TON REWARD CLAIM",
                    "accumulated_ton": "Hello! I accumulated 5 TON.",
                    "won_ton_msg": "🏆 I WON TON ON THE WHEEL!",
                    "ton_win_bonus": "🎉 {{n}} TON BONUS!",
                    "ton_important": "Payments are made at a minimum threshold of 5 TON."
                }
            },
            "manifesto": {
                "title": "TASTE MANIFESTO",
                "subtitle": "Story of Fire • Path of Mastery",
                "section1": {
                    "title": "🌅 The Beginning of Fire",
                    "p1": "When the digital worlds first fire was lit… no one knew it would be a kitchen.",
                    "quote": "It all started with a spark. An invisible hand… an invisible recipe… And humanity learning to control a decentralized fire for the first time…",
                    "p2": "The person who lit this fire wasn't a name… wasn't an identity… An idea… a revolution… an <highlight>awakening</highlight>.",
                    "p3": "He just lit the fire. He set up the stove. He left the recipe. And then… he left the kitchen."
                },
                "section2": {
                    "title": "⚠️ Fire Was Not Enough",
                    "p1": "But fire alone was not enough. Fire can burn… But <highlight>cooking requires mastery</highlight>.",
                    "p2": "Over time, the digital world filled up. Thousands of kitchens opened. Glowing signs… noisy halls… fast recipes…",
                    "quote": "But most of them lacked this: No labor. No patience. No soul. There was fire… but no flavor."
                },
                "section3": {
                    "title": "🍳 The Birth of TASTE",
                    "p1": "At that very point… another need arose.",
                    "p2": "Someone didn't just want to use fire. They wanted to <highlight>understand</highlight> it. They wanted to <highlight>process</highlight> it. They wanted to <highlight>turn it into mastery</highlight>.",
                    "quote": "And a kitchen was established. Quiet. Unpretentious. But conscious. Name: TASTE"
                },
                "section4": {
                    "title": "🚪 Entering the Kitchen",
                    "box": "Light the stove. Do you hear it? That's not just the sound of a flame. That is the <highlight>sound of transformation</highlight>.",
                    "p1": "When metal turned into digital, value was born… But meaning was not born. <highlight>TASTE was established to cook the meaning.</highlight>",
                    "p2": "When you step through the door, you feel this:",
                    "quote": "Nothing is done fast here. Nothing is done in vain here. Nothing exists just to exist here.",
                    "p3": "Every material has a reason. Every recipe has a history. Every master has burn marks."
                },
                "section5": {
                    "title": "⏳ True Value Matures",
                    "quote": "Because true value is not produced… It matures. It waits on the fire. It takes shape over time. It deepens with patience."
                },
                "section6": {
                    "title": "🎯 So Why Do We Exist?",
                    "p1": "Not just for trading. Not just to buy and sell. Not at all just to be seen.",
                    "box": [
                        "We exist to <highlight>produce value</highlight>.",
                        "We exist to <highlight>share knowledge</highlight>.",
                        "We exist to <highlight>cultivate mastery</highlight>.",
                        "We exist to bring <highlight>meaning</highlight> to the digital world."
                    ],
                    "quote": "We are on the side of depth… not speed. We are on the side of mastery… not noise. We are on the side of producing… not consuming."
                },
                "section7": {
                    "title": "💎 TASTE is Not a Trend",
                    "p1": "Today, countless assets circulate in the digital world. Some exist only to be seen. Some exist only to be sold. Some are born only to be forgotten.",
                    "quote": "But some things… are born out of necessity.",
                    "p2": "<highlight>TASTE</highlight> is not a trend. Not a copy. Not a noise.",
                    "p3": "This kitchen was established to fill a void. Where people don't just transact… <highlight>Producing… learning… transforming and developing…</highlight> to be a system."
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
                    "quote": "So where does this path go? Not to a place that ends. To a place that grows. This is not a destination… it is a <highlight>path of mastery</highlight>.",
                    "p1": "True masters know: <highlight>The best recipe is the one that hasn't been written yet.</highlight>"
                },
                "section9": {
                    "title": "And Now…",
                    "p1": "The stove is on. Pots are ready. The recipe is waiting to be written. Time is flowing.",
                    "box": "This is not a story. This is not a metaphor. This is not a dream at all. This is… <highlight>an inevitable evolution</highlight>.",
                    "p2": "The fire has been lit. The system has been established. But the flavor is still cooking.",
                    "footer_q": "The question is not: \"Does TASTE exist?\"",
                    "footer_a": "Are you ready to take your place in this kitchen? 🍽️"
                }
            },
            "whitepaper": {
                "title": "Whitepaper",
                "summary": {
                    "badge": "💎 On TON Blockchain",
                    "subtitle": "Gastronomy and education focused, targeting real-world use utility token",
                    "fixed_supply": "Fixed Supply",
                    "no_mint": "TASTE — Hiç mint yok",
                    "secured": "secured",
                    "governance": "Governance",
                    "community_decision": "Community decision",
                    "target_use": "🎯 Target Use Cases",
                    "tags": ["🍽️ Restaurant", "🏨 Hotel", "☕ Cafe", "🎓 Education", "🎟️ Discount Coupon", "🤝 Loyalty Reward"],
                    "why_mint_title": "🔐 Why is Mint Authority Left Open?",
                    "why_mint_desc": "TASTE project is built on a controlled and trust-based economy. To prevent arbitrary supply increases and inflation risk later, the token was created with a fixed 25M supply and no minting has been done so far.",
                    "why_mint_note": "The minting authority is technically left open because if TASTE later integrates with restaurants, hotels, and chains to establish a discount-coupon system, the community might need a supply adjustment to grow the ecosystem. This possibility wasn't closed off in advance — however the team cannot use this power alone.",
                    "dao_title": "🏛️ Supply Increase via DAO — How it Works?",
                    "dao_desc": "If an increase in supply comes to the agenda in the future, this decision can only be realized through these steps:",
                    "dao_steps": [
                        "🗳️ Community DAO voting is opened",
                        "📣 Transparent public information campaign is conducted",
                        "✅ Majority approval is required",
                        "📋 The entire process is recorded on-chain"
                    ],
                    "lock_reason_title": "🔒 Why Was So Much Token Locked?",
                    "lock_reasons": [
                        { "icon": "🐋", "text": "To prevent whale formulation — To prevent someone from grabbing a large part of the supply and manipulating the price." },
                        { "icon": "📉", "text": "To prevent sudden dump actions — To prevent huge amounts from being put on sale all at once." },
                        { "icon": "🎭", "text": "To prevent artificial hype & price manipulation — For growth focused on real-world use rather than speculative trading." },
                        { "icon": "🏗️", "text": "Long-term ecosystem security — To build a sustainable and healthy economy in Web3." }
                    ],
                    "philosophy_title": "💎 TASTE Philosophy",
                    "philosophy_text": "TASTE is a long-term Web3 venture that parts ways with short-term hype projects. Fixed supply · Controlled liquidity · Real-world use · DAO based future planning",
                    "official_source": "— Official TASTE Whitepaper (tastetoken.net)",
                    "tonscan_view": "View on Tonscan →",
                    "lock_prefix": "Lock",
                    "lp_lock_title": "💧 LP Token Lock (tinu-locker.ton)",
                    "lp_lock_status": "✅ pTON-TASTE LP Token — 81.6% Locked",
                    "lp_lock_contract": "Lock Contract: tinu-locker.ton"
                },
                "general_info": { "title": "General Info", "content": "TASTE is a decentralized ecosystem developed on the TON Blockchain, aiming to integrate the culinary arts and gastronomy into the Web3 world." },
                "vision": { "title": "Vision", "content": "To build a global bridge where culinary mastery meets digital value, empowering creators and businesses through transparency." },
                "mission": { "title": "Mission", "content": "Our mission is to provide the gastronomy world with tools for loyalty, traceability, and growth using blockchain technology." },
                "team": {
                    "title": "Team",
                    "fatih": { "name": "Fatih Emon", "role": "Founder & Visionary" },
                    "angel": { "name": "Angel of Taste", "role": "Community & Ecosystem" }
                },
                "tokenomics": {
                    "title": "Tokenomics",
                    "initial_supply": "Max Supply: 25,000,000 TASTE",
                    "summary_text": "Total supply: 25,000,000 TASTE<br />🔒 88.4% Locked (JVault) • 👥 2% Team • 👑 2% Founder<br />💧 6.4% Liquidity Pool (gradual) • 🎁 0.2% Airdrop • 💼 1% Ops/Rewards",
                    "allocation": {
                        "team": "Team (2%)",
                        "founder": "Founder (2%)",
                        "liquidity": "Liquidity (6.4%)",
                        "airdrop": "Airdrop (0.2%)",
                        "ops": "Ops/Exchange (1%)"
                    }
                },
                "supply_policy": {
                    "title": "Supply Policy",
                    "content": "88.4% of the total supply is professionally locked in JVault. The team maintains 0% control over locked assets until release dates."
                }
            },
            "charity": {
                "hero": {
                    "badge": "Animal Love",
                    "title": "Support the Strays",
                    "desc": "You can donate <1> TON</1> or <2> TASTE</2> to support street and shelter animals with food, vet care, and shelter. Every penny touches a life. 🐶🐱",
                    "stats": {
                        "stray": "Stray Animal",
                        "unlimited": "Unlimited",
                        "channel": "Donation Channel",
                        "247": "24/7 Open",
                        "transparency": "Transparency"
                    }
                },
                "wallet": {
                    "title": "Donation Wallet",
                    "copy_ton": "Copy Address (TON)",
                    "copy_taste": "Copy Address (TASTE)",
                    "copied": "Copied"
                },
                "ton_donate": {
                    "title": "Donate in TON",
                    "placeholder": "Amount (TON)",
                    "donate_btn": "Donate {{amount}} TON",
                    "connect_btn": "Connect Wallet & Donate",
                    "sending": "Sending...",
                    "success": "Donation sent! Thank you 🐾",
                    "error": "Transaction cancelled.",
                    "footer": "To send TASTE, copy the address and send it manually from your wallet."
                },
                "taste_info": {
                    "title": "Donate in TASTE",
                    "desc": "The wallet address above also accepts TASTE. You can send any amount of TASTE using Tonkeeper, TonWallet, or STON.fi."
                },
                "gallery": {
                    "badge": "Given Aids",
                    "title": "Proofs & Documents",
                    "records": "records",
                    "empty_title": "No proofs added yet",
                    "empty_desc": "Photos and documents of aids provided will be published here. We remain transparent! ✅",
                    "close": "Close"
                }
            },
            "legal": {
                "header": {
                    "badge": "Legal Documents",
                    "title": "Legal Information",
                    "subtitle": "Terms and Conditions applied",
                    "warning": "⚠️ This application <1>does not contain investment advice.</1> Crypto assets carry high risk."
                },
                "nav": {
                    "disclaimer": { "label": "Disclaimer", "sub": "Legal Notice" },
                    "terms": { "label": "Terms of Use", "sub": "Usage Policy" },
                    "privacy": { "label": "Privacy Policy", "sub": "Data Protection" },
                    "risk": { "label": "Risk Disclosure", "sub": "Financial Risks" }
                },
                "footer": {
                    "last_updated": "Last updated: March 2025 · TASTE Token © 2025",
                    "network": "Built on The Open Network"
                },
                "doc_info": "Last updated: March 2025 | This document is prepared in Turkish and English.",
                "disclaimer": {
                    "section1": { "title": "🚫 Not Investment Advice", "sub": "Disclaimer", "text": "Nothing in this application, including price information, charts, analysis, forecasts, or any statements, shall be construed as investment advice, financial recommendations, or an offer to buy or sell.", "eng_note": "Turkish follows. <1>English is the primary legal language.</1>" },
                    "section2": { "title": "⚖️ Limitation of Liability", "sub": "Legal Limits", "text": "The TASTE Token team shall not be held legally responsible for any decisions made based on this application, including direct or indirect financial losses.", "eng_note": "Turkish follows. <1>English is the primary legal language.</1>" },
                    "section3": { "title": "🌍 Regulatory Compliance", "sub": "Legal Compliance", "text": "Buying or selling crypto may be restricted in your country. The user assumes full responsibility for acting in accordance with local laws.", "eng_note": "Turkish follows. <1>English is the primary legal language.</1>" }
                },
                "terms": {
                    "intro": "By using this application, you agree to the following terms.",
                    "section1": { "title": "📌 General Terms", "sub": "Usage", "text": "This app is for information only. Users are responsible for their tokens." },
                    "section2": { "title": "🔄 Token Terms", "sub": "Swap", "text": "Transactions on STON.fi or other DEXs are at the user's discretion." },
                    "section3": { "title": "🚫 Prohibited Uses", "sub": "Forbidden", "text": "Money laundering or illegal financial transactions are strictly prohibited." },
                    "section4": { "title": "🗣️ Community Policy (UGC)", "sub": "Content", "text": "User posts (recipes, photos) are the user's responsibility. <1>Allergen and Calorie Data</1> is for information only. Absolute accuracy is <2>not guaranteed</2>." },
                    "section5": { "title": "⚙️ Right to Modify", "sub": "Updates", "text": "We reserve the right to update these terms without notice." }
                },
                "privacy": {
                    "intro": "Your privacy is important to us. This policy explains data collection.",
                    "section1": { "title": "📊 Data We Collect", "sub": "Privacy", "text": "We collect <1>Telegram User Information</1> (ID, Name) for community profiles and <1>Community Data</1> you share in the feed.", "note": "Commitment: <1>Personal data is NEVER sold.</1>" },
                    "section2": { "title": "🔗 Third-Party", "sub": "Integrations", "text": "Integration with <1>TON Blockchain</1> and <1>STON.fi</1> is subject to their own policies." },
                    "section3": { "title": "🗑️ Data Deletion", "sub": "Clean Up", "text": "Clearing cache deletes local preferences. Blockchain records are permanent." },
                    "section4": { "title": "📩 Contact", "sub": "Support", "text": "Reach us through our Telegram channel for privacy questions." }
                },
                "risk": {
                    "intro_title": "⛔ High Risk Warning",
                    "intro_text": "Crypto assets are highly volatile. You may <1>lose all of your investment.</1>",
                    "section1": { "title": "📉 Market Risk", "sub": "Volatility", "text": "TASTE value can drop to zero instantly. Past performance is not a guarantee." },
                    "section2": { "title": "💧 Liquidity Risk", "sub": "Trading", "text": "Selling TASTE at your desired price may not always be possible." },
                    "section3": { "title": "🔧 Tech Risk", "sub": "Network", "text": "Blockchain network issues or <1>Smart Contract</1> vulnerabilities carry intrinsic risks." },
                    "section4": { "title": "⚖️ Regulatory Risk", "sub": "Policy", "text": "Laws change. User assumes risk of future legal restrictions." },
                    "section5": { "title": "💡 Recommended Approach", "sub": "Safety", "text": "Invest only what you can lose. DYOR." }
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
                    "menu": "Menu",
                    "career": "Career / Jobs"
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
                    "seafood": "Seafood",
                    "job_listing": "Job Listing",
                    "job_seeking": "Job Seeking",
                    "chef": "Chef",
                    "cook": "Cook",
                    "waiter": "Waiter",
                    "master": "Master"
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
                "title": "TASTE",
                "description": "Gastronomi ve Eğitim Odaklı Dijital Varlıklar",
                "buy_title": "🔥 Erken Erişim — TASTE Satın Al",
                "buy_with": "TON ile Edinin",
                "holders": "Sahipler",
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
                "early_access_ending": "🚀 Erken Erişim Aşama 1 Bitiyor:",
                "you_get": "Alacağınız",
                "swap_opening": "STON.fi üzerinden takas açılıyor...",
                "reward_end": "🎁 Ödül Dağıtımı Bitiyor — 20 Mayıs 2026",
                "units": {
                    "day": "GÜN",
                    "hr": "SAAT",
                    "min": "DAK",
                    "sec": "SN",
                    "holder": "Sahipler",
                    "supply": "Toplam Arz",
                    "locked": "Kilitli"
                },
                "faq": {
                    "title": "❓ Sıkça Sorulan Sorular",
                    "what_is": "TASTE Nedir?",
                    "what_is_ans": "TASTE, TON blockchain üzerinde kurulmuş gastronomi ve eğitim odaklı bir dijital sadakat varlığıdır. Restoranlar, oteller ve yeme-içme sektöründe gerçek kullanım hedefler.",
                    "how_to": "Nasıl Satın Alınır?",
                    "how_to_ans": "1. TON cüzdanınıza (Tonkeeper, @wallet) TON yükleyin.<br />2. Yukarıdaki panelden istediğiniz miktarı seçin.<br />3. 'TON ile Satın Al' butonuna basıp STON.fi üzerinden swap yapın."
                }
            },
            "home": {
                "live_badge": "Canlı Veriler",
                "live_title": "📡 TASTE Aktivitesi"
            },
            "market": {
                "live_chart": "Canlı Piyasa Analizi"
            },
            "nav": {
                "home": "Ana Sayfa",
                "roadmap": "Yol Haritası",
                "whitepaper": "Beyaz Kağıt",
                "litepaper": "Litepaper",
                "community": "Yemek Akışı",
                "spin": "Çarkıfelek",
                "charity": "Hayır Platformu",
                "legal": "Yasal Bilgiler",
                "leaderboard": "Sıralama",
                "play": "Oyun",
                "wallet": "Cüzdan",
                "chef": "Taste Şef"
            },
            "game": {
                "title": "Şef Kariyeri",
                "next": "SIRADAKİ",
                "back": "Geri",
                "reward": "ÖDÜL",
                "excellent": "Harika!",
                "success_message": "{{dish}} başarıyla hazırlandı.",
                "return_map": "Haritaya Dön",
                "complete_info": "Bölümleri geçerek TASTE sadakat birimi kazanın! 🍳💎"
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
                    "mint": { "title": "Varlık Oluşumu & Piyasaya Sürüm", "desc": "TASTE varlıkları TON blockchain üzerinde oluşturuldu, STON.fi'de işlem görmeye başladı." },
                    "lp": { "title": "Likidite Havuzu", "desc": "STON.fi'de TON/TASTE likidite havuzu oluşturuldu ve aktif." },
                    "lock": { "title": "Varlık & LP Kilidi", "desc": "Toplam arzın %88.4'ü JVault'ta 3 ayrı kilidle kilitlendi. Ek olarak STON.fi pTON-TASTE LP birimlerinin %81.6'sı tinu-locker.ton ile kilitlendi. Her iki kilit blockchain'de herkese açık doğrulanabilir." },
                    "security": { "title": "Güvenlik Taraması", "desc": "Akıllı sözleşme güvenlik denetiminden geçirildi." },
                    "miniapp": { "title": "Telegram Mini App", "desc": "Telegram üzerinde çalışan tam özellikli mini uygulama yayına girdi." },
                    "airdrop": { "title": "Airdrop & Ödül Dağıtımı", "desc": "TASTE airdrop gerçekleştirildi ve her gün büyüyor. Çarkıfelek ödül sistemi aktif." },
                    "documents": { "title": "Beyaz Kağıt & Litepaper", "desc": "Projeyi anlatan kapsamlı teknik doküman ve lite versiyon yayınlandı." },
                    "social": { "title": "Sosyal Ağ Varlığı", "desc": "Telegram kanalı (@taste2025) ve Topluluk Grubu, WhatsApp kanalı, Twitter/X (@taste_token), Instagram (@taste_ton_taste), TikTok (@taste_ton), Facebook ve resmi website (tastetoken.net) kuruldu. Tüm platformlarda aktif." },
                    "stray": { "title": "Sokak Hayvanları Bağış Platformu", "desc": "TON ve TASTE ile hayvan barınaklarına bağış yapılabilen platform eklendi." },
                    "food_sharing": { "title": "Günlük Yemek Paylaşım Platformu", "desc": "Kullanıcılar tarif, yemek ve mekan paylaşabiliyor. Gerçek zamanlı (Supabase ile)." },
                    "wallets": { "title": "521 Cüzdana Ulaşıldı", "desc": "İlk çeyrek hedefi aşıldı ve 521 benzersiz cüzdan sahibine ulaşıldı. Topluluk büyümeye devam ediyor." },
                    "allergen": { "title": "Gıda Alerjeni Bildirim Sistemi", "desc": "AB & Türkiye gıda mevzuatındaki 14 zorunlu alerjen (Gluten, Süt, Yumurta, Balık vb.) Yemek Akışı'na entegre edildi. Her paylaşıma alerjen etiketi eklenebiliyor, kalori bilgisi gösteriliyor." },
                    "v2": { "title": "Mini App v2 Güncellemesi — Mart 2026", "desc": "PoweredBy bölümü SVG logolarla yenilendi. Beyaz Kağıt'a TASTE özet kartı eklendi. Ödül dağıtımı bitiş sayacı (20 Mayıs 2026) eklendi. Yemek Akışı'na beğeni, arama ve trend yemekler getirildi." },
                    "v2_1": { "title": "Mini App v2.1 Yenilenme — Mart 2026", "desc": "Premium Karanlık Tema UI/UX revizyonu. Yeni 'Keşfet' Menüsü ve S.S.S. bölümü eklendi. AI motoru Groq üzerinden Llama 3.3 70B'ye yükseltildi. Telegram tema renkleri lüks konsept ile senkronize edildi." },
                    "v2_2": { "title": "Mini App v2.2 İçerik & Uyumluluk — Mart 2026", "desc": "Projenin felsefesi olan TASTE Manifesto yayınlandı. Tüm bileşenlerde tam Türkçe ve İngilizce (i18n) dil desteği sağlandı. Kapsamlı Yasal Altyapı (Kullanım Koşulları, Gizlilik, Risk Bildirimi) ve ilk açılış yasal uyarı modülü (Disclaimer) devreye alındı." },
                    "v2_3": { "title": "Mini App v2.3 Cüzdan & Adres Güncellemesi — Mart 2026", "desc": "Hızlı Cüzdan & Transfer sistemi yayına alındı. Kullanıcılar artık TON ve TASTE bakiyelerini görebilir, QR kod ile anında işlem yapabilir ve her iki varlığı optimize edilmiş komisyonlarla güvenle gönderebilir." },
                    "v2_4": { "title": "Mini App v2.4 Taste Şef — Mart 2026", "desc": "Dijital Sadakat ve İndirim sistemi yayına alındı. Çıraklıktan ustalığa giden yolda özel indirim hakları ve dijital onay sistemi tanımlandı." },
                    "v2_5": { "title": "Mini App v2.5 Topluluk 3.0 — Mart 2026", "desc": "Supabase ile küresel gerçek zamanlı Yemek Akışı ve İş İlanı panosu yayına girdi. İlan verenlerle Telegram üzerinden anlık iletişim özelliği eklendi. 'Paylaş Kazan' kampanyaları ve ödül cüzdanı görünürlüğü aktifleşti. Küresel canlı sohbet devreye alındı." },
                    "growth": { "title": "Topluluk Büyütme", "desc": "Her gün yeni kullanıcılar, her gün yeni paylaşımlar. Organik büyüme odaklı." },
                    "visibility": { "title": "Daha Fazla DEX Görünürlüğü", "desc": "STON.fi'nin yanı sıra diğer TON ekosistem platformlarında varlık." },
                    "reporting": { "title": "Şeffaf Raporlama", "desc": "Holder sayısı, işlem hacmi ve topluluk büyümesi düzenli paylaşılacak." },
                    "dev": { "title": "Mini App Geliştirme", "desc": "Kullanıcı geri bildirimlerine göre yeni özellikler ekleniyor." }
                },
                "spin": {
                    "ton_balance": "TON Bakiyesi",
                    "ton_target": "Hedef: 5 TON",
                    "ton_claim_ready": "🎉 TON ÖDÜLÜ HAZIR!",
                    "ton_left": "{{n}} TON kaldı",
                    "win_ton": "🎉 {{n}} TON Kazandın!",
                    "reward_claim_ton": "🎉 TON ÖDÜL TALEBİ",
                    "accumulated_ton": "Merhaba! 5 TON biriktirdim.",
                    "won_ton_msg": "🏆 ÇARKTA TON KAZANDIM!",
                    "ton_win_bonus": "🎉 {{n}} TON BONUSU!",
                    "ton_important": "Ödemeler minimum 5 TON eşiğinde yapılır."
                }
            },
            "manifesto": {
                "title": "TASTE MANİFESTOSU",
                "subtitle": "Ateşin Hikâyesi • Ustalığın Yolu",
                "section1": {
                    "title": "🌅 Ateşin Başlangıcı",
                    "p1": "Dijital dünyanın ilk ateşi yakıldığında… kimse bunun bir mutfak olacağını bilmiyordu.",
                    "quote": "Her şey bir kıvılcımla başladı. Görünmeyen bir el… görünmeyen bir tarif… Ve insanlık ilk kez merkeziyetsiz bir ateşi kontrol etmeyi öğreniyor…",
                    "p2": " Bu ateşi yakan kişi bir isim değildi… bir kimlik değildi… Bir fikir… bir devrim… bir <highlight>uyanıştı</highlight>.",
                    "p3": "O sadece ateşi yaktı. Ocağı kurdu. Tarifi bıraktı. Ve sonra… mutfaktan çıktı."
                },
                "section2": {
                    "title": "⚠️ Ateş Yeterli Değildi",
                    "p1": "Ama ateş tek başına yeterli değildi. Ateş yanabilir… Ama <highlight>yemek pişirmek ustalık ister</highlight>.",
                    "p2": "Zamanla dijital dünya doldu. Binlerce mutfak açıldı. Parlayan tabelalar… gürültülü salonlar… hızlı tarifler…",
                    "quote": "Ama çoğunda şu yoktu: Emek yoktu. Sabır yoktu. Ruh yoktu. Ateş vardı… ama lezzet yoktu."
                },
                "section3": {
                    "title": "🍳 TASTE'in Doğuşu",
                    "p1": "İşte tam o noktada… başka bir ihtiyaç doğdu.",
                    "p2": "Birileri ateşi sadece kullanmak istemedi. Onu <highlight>anlamak</highlight> istedi. Onu <highlight>işlemek</highlight> istedi. Onu <highlight>ustalığa dönüştürmek</highlight> istedi.",
                    "quote": "Ve bir mutfak kuruldu. Sessiz. Gösterişsiz. Ama bilinçli. Adı: TASTE"
                },
                "section4": {
                    "title": "🚪 Mutfağa Giriyoruz",
                    "box": "Ocağın altını yak. Duyuyor musun? Bu sadece bir alev sesi değil. Bu <highlight>dönüşümün sesi</highlight>.",
                    "p1": "Metal dijitale dönüştüğünde değer doğmuştu… Ama anlam doğmamıştı. <highlight>TASTE anlamı pişirmek için kuruldu.</highlight>",
                    "p2": "Kapıdan adım attığında şunu hissedersin:",
                    "quote": "Burada hiçbir şey hızlı yapılmaz. Burada hiçbir şey boşuna yapılmaz. Burada hiçbir şey sadece var olmak için var değildir.",
                    "p3": "Her malzemenin nedeni vardır. Her tarifin geçmişi vardır. Her ustanın yanık izleri vardır."
                },
                "section5": {
                    "title": "⏳ Gerçek Değer Olgunlaşır",
                    "quote": "Çünkü gerçek değer üretilmez… Olgunlaşır. Ateşin üstünde bekler. Zamanla şekil alır. Sabırla derinleşir."
                },
                "section6": {
                    "title": "🎯 Peki Biz Ne İçin Varız?",
                    "p1": "Sadece işlem yapmak için değil. Sadece almak ve satmak için değil. Sadece görünmek için hiç değil.",
                    "box": [
                        "Biz <highlight>değer üretmek</highlight> için varız.",
                        "Biz <highlight>bilgiyi paylaşmak</highlight> için varız.",
                        "Biz <highlight>ustalık yetiştirmek</highlight> için varız.",
                        "Biz dijital dünyaya <highlight>anlam kazandırmak</highlight> için varız."
                    ],
                    "quote": "Biz hızın değil… derinliğin tarafındayız. Biz gürültünün değil… ustalığın tarafındayız. Biz tüketmenin değil… üretmenin tarafındayız."
                },
                "section7": {
                    "title": "💎 TASTE Bir Trend Değil",
                    "p1": "Bugün dijital dünyada sayısız varlık dolaşıyor. Bazıları sadece görülmek için var. Bazıları sadece satılmak için var. Bazıları sadece unutulmak için doğuyor.",
                    "quote": "Ama bazı şeyler… ihtiyaçtan doğar.",
                    "p2": "<highlight>TASTE</highlight> bir trend değil. Bir kopya değil. Bir gürültü değil.",
                    "p3": "Bu mutfak bir boşluğu doldurmak için kuruldu. İnsanların sadece işlem yapmadığı… <highlight>Ürettiği… öğrendiği… dönüşüp geliştiği…</highlight> bir sistem olmak için."
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
                    "quote": "So nerede bu yol gider? Sona eren bir yere değil. Büyüyen bir yere. Bu bir varış noktası değil… bir <highlight>ustalık yolu</highlight>.",
                    "p1": "Gerçek ustalar bilir: <highlight>En iyi tarif henüz yazılmamış olandır.</highlight>"
                },
                "section9": {
                    "title": "Ve Şimdi…",
                    "p1": "Ocak yanıyor. Tencereler hazır. Tarif yazılmayı bekliyor. Zaman akıyor.",
                    "box": "Bu bir hikâye değil. Bu bir metafor değil. Bu bir hayal hiç değil. Bu… <highlight>kaçınılmaz bir evrim</highlight>.",
                    "p2": "Ateş yakıldı. Sistem kuruldu. Ama lezzet hâlâ pişiyor.",
                    "footer_q": "Soru şu değil: \"TASTE var mı?\"",
                    "footer_a": "Bu mutfakta yerini almaya hazır mısın? 🍽️"
                }
            },
            "whitepaper": {
                "title": "Beyaz Kağıt",
                "summary": {
                    "badge": "💎 TON Blockchain Üzerinde",
                    "subtitle": "Gastronomi ve eğitim odaklı, gerçek dünya kullanımı hedefleyen utility token",
                    "fixed_supply": "Sabit Arz",
                    "no_mint": "TASTE — Hiç mint yok",
                    "secured": "güvenceli",
                    "governance": "Yönetim",
                    "community_decision": "Topluluk kararı",
                    "target_use": "🎯 Hedef Kullanım Alanları",
                    "tags": ["🍽️ Restoran", "🏨 Otel", "☕ Kafe", "🎓 Eğitim", "🎟️ İndirim Kuponu", "🤝 Sadakat Ödülü"],
                    "why_mint_title": "🔐 Mint Yetkisi Neden Açık Bırakıldı?",
                    "why_mint_desc": "TASTE projesi kontrollü ve güven temelli bir ekonomi üzerine kurulmuştur. Sonradan keyfi arz artışlarını ve enflasyon riskini önlemek amacıyla token sabit 25M arz ile oluşturulmuş ve şimdiye kadar hiç mint yapılmamıştır.",
                    "why_mint_note": "Mint yetkisi teknik olarak açık bırakılmıştır çünkü TASTE ileride restoran, lokanta, otel ve zincir işletmeler ile entegre bir indirim-kupon sistemi kurduğunda, ekosistemi büyütmek için topluluk bir arz düzenlemesine ihtiyaç duyabilir. Bu ihtimal önceden kapatılmamıştır — ancak ekip bu yetkiyi tek başına kullanamaz.",
                    "dao_title": "🏛️ DAO ile Arz Artışı — Nasıl İşler?",
                    "dao_desc": "İleride arz artışı gündeme gelirse bu karar yalnızca şu adımlarla hayata geçebilir:",
                    "dao_steps": [
                        "🗳️ Topluluk DAO oylaması açılır",
                        "📣 Şeffaf kamuoyu bilgilendirme kampanyası yapılır",
                        "✅ Çoğunluk onayı alınır",
                        "📋 Tüm süreç zincir üzerinde kayıt altına alınır"
                    ],
                    "lock_reason_title": "🔒 Neden Bu Kadar Çok Token Kilitlendi?",
                    "lock_reasons": [
                        { "icon": "🐋", "text": "Balina oluşumunu önlemek — Birinin arzın büyük bölümünü ele geçirip fiyatı manipüle etmesini engellemek için." },
                        { "icon": "📉", "text": "Ani dump hareketlerini önlemek — Büyük miktarların birden satışa çıkmasını engellemek için." },
                        { "icon": "🎭", "text": "Yapay hype & fiyat manipülasyonunu önlemek — Spekülatif değil, gerçek kullanım odaklı büyüme için." },
                        { "icon": "🏗️", "text": "Uzun vadeli ekosistem güvenliği — Sürdürülebilir ve sağlıklı bir ekonomi inşa etmek için." }
                    ],
                    "philosophy_title": "💎 TASTE Felsefesi",
                    "philosophy_text": "TASTE, kısa vadeli hype projelerinden ayrışan, uzun vadeli bir Web3 girişimidir. Sabit arz · Kontrollü likidite · Gerçek dünya kullanımı · DAO temelli gelecek planlaması",
                    "official_source": "— Resmi TASTE Beyaz Kağıt (tastetoken.net)",
                    "tonscan_view": "Tonscan'da Gör →",
                    "lock_prefix": "Kilit",
                    "lp_lock_title": "💧 LP Token Kilidi (tinu-locker.ton)",
                    "lp_lock_status": "✅ pTON-TASTE LP Tokeni — %81.6 Kilitli",
                    "lp_lock_contract": "Kilit Kontratı: tinu-locker.ton"
                },
                "general_info": { "title": "Genel Bilgi", "content": "TASTE, yemek sanatları ve gastronomiyi Web3 dünyasına entegre etmeyi amaçlayan, TON Blockchain üzerinde geliştirilmiş merkeziyetsiz bir ekosistemdir." },
                "vision": { "title": "Vizyon", "content": "Mutfak ustalığının dijital değerle buluştuğu küresel bir köprü inşa etmek, şeffaflık yoluyla üreticileri ve işletmeleri güçlendirmek." },
                "mission": { "title": "Misyon", "content": "Blockchain teknolojisini kullanarak gastronomi dünyasına sadakat, izlenebilirlik ve büyüme araçları sağlamaktır." },
                "team": {
                    "title": "Ekip",
                    "fatih": { "name": "Fatih Emon", "role": "Kurucu & Vizyoner" },
                    "angel": { "name": "Angel of Taste", "role": "Topluluk & Ekosistem" }
                },
                "tokenomics": {
                    "title": "Tokenomics",
                    "initial_supply": "Maksimum Arz: 25,000,000 TASTE",
                    "summary_text": "Toplam arz: 25,000,000 TASTE<br />🔒 %88.4 Kilitli (JVault) • %2 Ekip • %2 Kurucu<br />💧 %6.4 Likidite Havuzu • %0.2 Airdrop • %1 Masraf/Ödül",
                    "allocation": {
                        "team": "Ekip (%2)",
                        "founder": "Kurucu (%2)",
                        "liquidity": "Likidite (%6.4)",
                        "airdrop": "Airdrop (%0.2)",
                        "ops": "Masraf/Borsa (%1)"
                    }
                },
                "supply_policy": {
                    "title": "Arz Politikası",
                    "content": "Toplam arzın %88.4'ü profesyonel olarak JVault'ta kilitlenmiştir. Ekip, kilit açılış tarihine kadar kilitli varlıklar üzerinde %0 kontrole sahiptir."
                }
            },
            "charity": {
                "hero": {
                    "badge": "Hayvan Sevgisi",
                    "title": "Sokak Hayvanlarına Destek",
                    "desc": "Barınaksız sokak hayvanlarına mama, veteriner ve barınak desteği için <1> TON</1> veya <2> TASTE</2> bağışlayabilirsin. Her kuruş bir hayata dokunur. 🐶🐱",
                    "stats": {
                        "stray": "Sokak Hayvanı",
                        "unlimited": "Sınırsız",
                        "channel": "Bağış Kanalı",
                        "247": "24/7 Açık",
                        "transparency": "Şeffaflık"
                    }
                },
                "wallet": {
                    "title": "Bağış Cüzdanı",
                    "copy_ton": "Adresi Kopyala (TON)",
                    "copy_taste": "Adresi Kopyala (TASTE)",
                    "copied": "Kopyalandı"
                },
                "ton_donate": {
                    "title": "TON ile Bağış Yap",
                    "placeholder": "Miktar (TON)",
                    "donate_btn": "{{amount}} TON Bağışla",
                    "connect_btn": "Cüzdanı Bağla & Bağışla",
                    "sending": "Gönderiliyor...",
                    "success": "Bağış gönderildi! Teşekkürler 🐾",
                    "error": "İşlem iptal edildi.",
                    "footer": "TASTE göndermek için adresi kopyalayıp cüzdanından manuel gönderebilirsin."
                },
                "taste_info": {
                    "title": "TASTE ile Bağış",
                    "desc": "Yukarıdaki cüzdan adresi aynı zamanda TASTE kabul eder. Tonkeeper, TonWallet veya STON.fi üzerinden istediğin miktarda TASTE gönderebilirsin."
                },
                "gallery": {
                    "badge": "Yapılan Yardımlar",
                    "title": "Kanıt & Belgeler",
                    "records": "kayıt",
                    "empty_title": "Henüz kanıt eklenmedi",
                    "empty_desc": "Yapılan yardımların fotoğraf ve belgeleri burada yayınlanacak. Şeffaf kalıyoruz! ✅",
                    "close": "Kapat"
                }
            },
            "legal": {
                "header": {
                    "badge": "Yasal Belgeler",
                    "title": "Hukuki Bilgilendirme",
                    "subtitle": "Legal Information & Risk Disclosure",
                    "warning": "⚠️ Bu uygulama <1>yatırım tavsiyesi içermez.</1> Kripto varlıklar yüksek risk taşır."
                },
                "nav": {
                    "disclaimer": { "label": "Sorumluluk Reddi", "sub": "Disclaimer" },
                    "terms": { "label": "Kullanım Koşulları", "sub": "Terms of Use" },
                    "privacy": { "label": "Gizlilik Politikası", "sub": "Privacy Policy" },
                    "risk": { "label": "Risk Açıklaması", "sub": "Risk Disclosure" }
                },
                "footer": {
                    "last_updated": "Son güncelleme: Mart 2025 · TASTE Token © 2025",
                    "network": "Built on The Open Network"
                },
                "doc_info": "Son güncelleme: Mart 2025 | Bu belge Türkçe ve İngilizce olarak hazırlanmıştır.",
                "disclaimer": {
                    "section1": { "title": "🚫 Yatırım Tavsiyesi Değildir", "sub": "Disclaimer", "text": "Bu uygulama içindeki hiçbir içerik, fiyat bilgisi, grafik, analiz, tahmin veya herhangi bir ifade; yatırım tavsiyesi, finansal öneri veya alım-satım teklifi olarak yorumlanamaz.", "eng_note": "Aşağıda Türkçe metin yer almaktadır. <1>İngilizce asıl yasal dildir.</1>" },
                    "section2": { "title": "⚖️ Sorumluluk Sınırlaması", "sub": "Limitation of Liability", "text": "TASTE Token ekibi; bu uygulamaya dayanarak alınan herhangi bir karar sonucunda ortaya çıkabilecek mali kayıplar için hiçbir hukuki sorumluluk kabul etmez.", "eng_note": "Aşağıda Türkçe metin yer almaktadır. <1>İngilizce asıl yasal dildir.</1>" },
                    "section3": { "title": "🌍 Yasal Uyumluluk", "sub": "Regulatory Compliance", "text": "Kripto para işlemleri bulunduğunuz ülkede kısıtlı olabilir. Kişi, yerel hukuka uygun hareket etme sorumluluğunu tamamen üstlenmiş sayılır.", "eng_note": "Aşağıda Türkçe metin yer almaktadır. <1>İngilizce asıl yasal dildir.</1>" }
                },
                "terms": {
                    "intro": "Bu uygulamayı kullanmaya devam etmekle aşağıdaki koşulları kabul etmiş sayılırsınız.",
                    "section1": { "title": "📌 Genel Kullanım Koşulları", "sub": "Kullanım", "text": "Uygulama bilgilendirme amaçlıdır. Kullanıcılar kendi tokenlarından sorumludur." },
                    "section2": { "title": "🔄 Token Alım-Satım Koşulları", "sub": "Swap", "text": "STON.fi gibi platformlardaki işlemler tamamen kullanıcının iradesindedir." },
                    "section3": { "title": "🚫 Yasaklı Kullanımlar", "sub": "Yasak", "text": "Para aklama veya yasadışı finansal işlemler kesinlikle yasaktır." },
                    "section4": { "title": "🗣️ Topluluk Sorumluluğu (UGC)", "sub": "İçerik", "text": "Kullanıcı paylaşımları (tarifler, fotoğraflar) kullanıcının sorumluluğundadır. <1>Alerjen ve Kalori Verisi</1> bilgilendirme amaçlıdır. Kesin doğruluğu <2>garanti edilmez</2>." },
                    "section5": { "title": "⚙️ Değişiklik Hakkı", "sub": "Güncelleme", "text": "Koşulları önceden haber vermeksizin güncelleme hakkımızı saklı tutarız." }
                },
                "privacy": {
                    "intro": "Gizliliğiniz bizim için önemlidir. Bu politika veri toplamayı açıklar.",
                    "section1": { "title": "📊 Toplanan Veriler", "sub": "Gizlilik", "text": "Profil oluşturmak için <1>Telegram Kullanıcı Bilgilerini</1> (ID, Ad) ve akışta paylaştığınız <1>Topluluk Verilerini</1> topluyoruz.", "note": "Taahhüt: <1>Kişisel veriler ASLA satılmaz.</1>" },
                    "section2": { "title": "🔗 Üçüncü Taraf", "sub": "Entegrasyon", "text": "<1>TON Blockchain</1> ve <1>STON.fi</1> entegrasyonu kendi politikalarına tabidir." },
                    "section3": { "title": "🗑️ Veri Silme", "sub": "Temizlik", "text": "Önbelleği temizlemek tercihleri siler. Blockchain kayıtları kalıcıdır." },
                    "section4": { "title": "📩 İletişim", "sub": "Destek", "text": "Gizlilik soruları için Telegram kanalımızdan bize ulaşabilirsiniz." }
                },
                "risk": {
                    "intro_title": "⛔ Yüksek Risk Uyarısı",
                    "intro_text": "Kripto varlıklar değişken araçlardır. Yatırımınızın <1>tamamını kaybedebilirsiniz.</1>",
                    "section1": { "title": "📉 Piyasa Riski", "sub": "Volatilite", "text": "TASTE değeri anında sıfıra düşebilir. Geçmiş performans garanti değildir." },
                    "section2": { "title": "💧 Likidite Riski", "sub": "Ticaret", "text": "TASTE'i istediğiniz fiyattan satmak her zaman mümkün olmayabilir." },
                    "section3": { "title": "🔧 Teknoloji Riski", "sub": "Ağ", "text": "Ağ sorunları veya <1>Akıllı Sözleşme</1> açıkları içsel riskler taşır." },
                    "section4": { "title": "⚖️ Düzenleyici Risk", "sub": "Politika", "text": "Yasalar değişir. Yarın yasal kısıtlamalar gelebilir, risk kullanıcıya aittir." },
                    "section5": { "title": "💡 Önerilen Yaklaşım", "sub": "Güvenlik", "text": "Sadece kaybedebileceğiniz kadar yatırın. Kendi araştırmanızı yapın (DYOR)." }
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
                    "menu": "Menü",
                    "career": "Kariyer / İş"
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
                    "seafood": "Deniz",
                    "job_listing": "İş İlanı",
                    "job_seeking": "İş Arıyorum",
                    "chef": "Şef",
                    "cook": "Aşçı",
                    "waiter": "Garson",
                    "master": "Usta"
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
