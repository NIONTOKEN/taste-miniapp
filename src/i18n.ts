import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    "en": {
        "translation": {
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
                },
                "tap_for_info": "TAP FOR INFO",
                "quick_links": "Quick Links",
                "project_assistant": "Project Assistant",
                "quick_wallet": "Quick Wallet & Transfer",
                "chef_status": "Taste Chef Digital Status",
                "gastronomy_career": "Gastronomy Career & Community",
                "web3_partners": "Web3 & Partners",
                "joint_projects": "Joint Projects",
                "lang": "Lang",
                "banner_title": "TASTE is going to the future!",
                "banner_desc": "TASTE is the shining star of tomorrow. Buy TASTE now and take your place in this amazing journey!",
                "banner_buy": "BUY TASTE"
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
                "chef": "Taste Chef",
                "discover": "Discover",
                "install": "Install",
                "partners": "Partners",
                "vote": "Our Place in Web3",
                "socials": "Social Media",
                "team": "Team",
                "faq": "F.A.Q.",
                "tech": "Tech",
                "settings": "Settings",
                "menu": "Menu"
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
                    "mint": {
                        "title": "Asset Genesis & Launch",
                        "desc": "TASTE assets were generated on the TON blockchain and started trading on STON.fi."
                    },
                    "lp": {
                        "title": "Liquidity Pool",
                        "desc": "TON/TASTE liquidity pool was created and activated on STON.fi."
                    },
                    "lock": {
                        "title": "Asset & LP Lock",
                        "desc": "88.4% of the total supply is locked in JVault with 3 separate locks. Additionally, 81.6% of STON.fi pTON-TASTE LP units are locked with tinu-locker.ton. Both locks are publicly verifiable on the blockchain."
                    },
                    "security": {
                        "title": "Security Scan",
                        "desc": "The smart contract has passed a security audit."
                    },
                    "miniapp": {
                        "title": "Telegram Mini App",
                        "desc": "A full-featured mini app running on Telegram was launched."
                    },
                    "airdrop": {
                        "title": "Airdrop & Rewards",
                        "desc": "TASTE airdrop was performed for 521 wallets and is growing every day. The spinning wheel reward system is active."
                    },
                    "documents": {
                        "title": "Whitepaper & Litepaper",
                        "desc": "Comprehensive technical documents and lite versions explaining the project have been published."
                    },
                    "social": {
                        "title": "Social Media Presence",
                        "desc": "Telegram channel (@taste2025), Community Group, WhatsApp channel, Twitter/X (@taste_token), Instagram (@taste_ton_taste), TikTok (@taste_ton), Facebook, and official website (tastetoken.net) were established. Active on all platforms."
                    },
                    "stray": {
                        "title": "Stray Animals Donation Platform",
                        "desc": "A platform was added where donations can be made to animal shelters using TON and TASTE."
                    },
                    "food_sharing": {
                        "title": "Daily Food Sharing Platform",
                        "desc": "Users can share recipes, food, and venues. Real-time (with Supabase)."
                    },
                    "wallets": {
                        "title": "Reached 521 Wallets",
                        "desc": "First quarter goal surpassed with 521 unique wallet owners. The community continues to grow."
                    },
                    "allergen": {
                        "title": "Food Allergen Notification System",
                        "desc": "The 14 mandatory allergens in EU & Turkey food legislation (Gluten, Milk, Eggs, Fish, etc.) were integrated into the Food Feed. Allergen tags can be added to every share, and calorie information is displayed."
                    },
                    "v2": {
                        "title": "Mini App v2 Update — March 2026",
                        "desc": "PoweredBy section was renewed with SVG logos (OKX, Bitget, Binance, Telegram, Google, Gemini). TASTE summary card added to Whitepaper. Reward distribution end timer (May 20, 2026) added. Likes, search, and trending foods brought to Food Feed."
                    },
                    "v2_1": {
                        "title": "Mini App v2.1 Redesign — March 2026",
                        "desc": "Premium Dark UI & UX overhaul. New 'Explore' Menu Drawer implemented. FAQ section added. AI engine upgraded to Llama 3.3 70B via Groq. Global Telegram theme colors synchronized for premium feel."
                    },
                    "v2_2": {
                        "title": "Mini App v2.2 Content & Compliance — March 2026",
                        "desc": "TASTE Manifesto published explaining the project's soul. Full Internationalization (i18n) support for English & Turkish languages. Comprehensive Legal Framework (Terms, Privacy, Risk Disclosure) and first-launch Disclaimer Modal implemented for user safety."
                    },
                    "v2_3": {
                        "title": "Mini App v2.3 Wallet & QR Update — March 2026",
                        "desc": "Quick Wallet & Transfer system launched. Users can now view TON & TASTE balances, scan QR codes for instant payments, and send both TON and TASTE tokens securely with optimized gas fees."
                    },
                    "v2_4": {
                        "title": "Mini App v2.4 Taste Chef",
                        "desc": "Digital Loyalty & Discount system. Apprenticeship tiers to Master Chef status. Symbolic fee for discount validation at cashiers."
                    },
                    "v2_5": {
                        "title": "Mini App v2.5 Community 3.0 — March 2026",
                        "desc": "Global Real-time Food Feed & Job Board launched with Supabase. Direct Telegram integration for instant contact with job posters. 'Share & Win' campaigns active with reward wallet visibility. Global live chat active."
                    },
                    "v2_6": {
                        "title": "Mini App v2.6 Wallet & Transfer System — March 2026",
                        "desc": "Fully integrated Wallet component with Send, Receive, Buy, and Sell tabs powered by STON.fi deep links."
                    },
                    "growth": {
                        "title": "Community Growth",
                        "desc": "Every day new users, every day new shares. Focused on organic growth."
                    },
                    "visibility": {
                        "title": "Greater DEX Visibility",
                        "desc": "Presence in other TON ecosystem platforms alongside STON.fi."
                    },
                    "partners": {
                        "title": "Strategic Partnerships",
                        "desc": "Building alliances with local businesses, platforms, and gastronomy brands."
                    },
                    "listings": {
                        "title": "CEX / DEX Listings",
                        "desc": "Increasing trading volume across various decentralized and centralized exchanges."
                    },
                    "reporting": {
                        "title": "Transparent Reporting",
                        "desc": "Holder count, transaction volume, and community growth will be shared regularly."
                    },
                    "dev": {
                        "title": "Mini App Development",
                        "desc": "New features are being added based on user feedback."
                    }
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
                        {
                            "icon": "📚",
                            "text": "Training apprentices"
                        },
                        {
                            "icon": "👨‍🍳",
                            "text": "Training masters"
                        },
                        {
                            "icon": "🧠",
                            "text": "Growing consciousness"
                        },
                        {
                            "icon": "💰",
                            "text": "Deepening the value"
                        },
                        {
                            "icon": "🔥",
                            "text": "Growing the fire"
                        },
                        {
                            "icon": "🍽️",
                            "text": "Increasing the flavor"
                        }
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
                "pitch": {
                    "title": "Why TASTE?",
                    "text1": "The world is changing rapidly. As the era of paper money slowly comes to an end, the digital economy is taking its place.\n\nSo what does TASTE do in this new order?",
                    "text2": "TASTE is not just a cryptocurrency (token) — it is building a massive ecosystem with real-world utility behind it. You will now be able to pay directly with TASTE at partner businesses, and enjoy <highlight>TASTE holder-exclusive</highlight> discounts and privileges while paying. 🛍️🤝",
                    "text3": "This is where the biggest difference separating TASTE from tens of thousands of other projects emerges:",
                    "text4": "<highlight>Not just a speculative investment, real-life use + instant advantage!</highlight> 🔥",
                    "text5": "Those who hold TASTE in their wallets today will not just be spectators in tomorrow's digital economy; they will be one step ahead.",
                    "text6": "A brand new era has begun in the Web3 world…\n<highlight>And TASTE is now on this stage.</highlight> 🚀💎"
                },
                "summary": {
                    "badge": "💎 On TON Blockchain",
                    "subtitle": "Gastronomy and education focused, targeting real-world use utility token",
                    "fixed_supply": "Fixed Supply",
                    "no_mint": "TASTE — Hiç mint yok",
                    "secured": "secured",
                    "governance": "Governance",
                    "community_decision": "Community decision",
                    "target_use": "🎯 Target Use Cases",
                    "tags": [
                        "🍽️ Restaurant",
                        "🏨 Hotel",
                        "☕ Cafe",
                        "🎓 Education",
                        "🎟️ Discount Coupon",
                        "🤝 Loyalty Reward"
                    ],
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
                        {
                            "icon": "🐋",
                            "text": "To prevent whale formulation — To prevent someone from grabbing a large part of the supply and manipulating the price."
                        },
                        {
                            "icon": "📉",
                            "text": "To prevent sudden dump actions — To prevent huge amounts from being put on sale all at once."
                        },
                        {
                            "icon": "🎭",
                            "text": "To prevent artificial hype & price manipulation — For growth focused on real-world use rather than speculative trading."
                        },
                        {
                            "icon": "🏗️",
                            "text": "Long-term ecosystem security — To build a sustainable and healthy economy in Web3."
                        }
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
                "general_info": {
                    "title": "General Info",
                    "content": "TASTE is a decentralized ecosystem developed on the TON Blockchain, aiming to integrate the culinary arts and gastronomy into the Web3 world."
                },
                "vision": {
                    "title": "Vision",
                    "content": "To build a global bridge where culinary mastery meets digital value, empowering creators and businesses through transparency."
                },
                "mission": {
                    "title": "Mission",
                    "content": "Our mission is to provide the gastronomy world with tools for loyalty, traceability, and growth using blockchain technology."
                },
                "team": {
                    "title": "Team",
                    "fatih": {
                        "name": "Fatih Emon",
                        "role": "Founder & Visionary"
                    },
                    "angel": {
                        "name": "Angel of Taste",
                        "role": "Community & Ecosystem"
                    }
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
                        "247": "24/7 Open",
                        "stray": "Stray Animal",
                        "unlimited": "Unlimited",
                        "channel": "Donation Channel",
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
                    "disclaimer": {
                        "label": "Disclaimer",
                        "sub": "Legal Notice"
                    },
                    "terms": {
                        "label": "Terms of Use",
                        "sub": "Usage Policy"
                    },
                    "privacy": {
                        "label": "Privacy Policy",
                        "sub": "Data Protection"
                    },
                    "risk": {
                        "label": "Risk Disclosure",
                        "sub": "Financial Risks"
                    }
                },
                "footer": {
                    "last_updated": "Last updated: March 2025 · TASTE Token © 2025",
                    "network": "Built on The Open Network"
                },
                "doc_info": "Last updated: March 2025 | This document is prepared in Turkish and English.",
                "disclaimer": {
                    "section1": {
                        "title": "🚫 Not Investment Advice",
                        "sub": "Disclaimer",
                        "text": "Nothing in this application, including price information, charts, analysis, forecasts, or any statements, shall be construed as investment advice, financial recommendations, or an offer to buy or sell.",
                        "eng_note": "Turkish follows. <1>English is the primary legal language.</1>"
                    },
                    "section2": {
                        "title": "⚖️ Limitation of Liability",
                        "sub": "Legal Limits",
                        "text": "The TASTE Token team shall not be held legally responsible for any decisions made based on this application, including direct or indirect financial losses.",
                        "eng_note": "Turkish follows. <1>English is the primary legal language.</1>"
                    },
                    "section3": {
                        "title": "🌍 Regulatory Compliance",
                        "sub": "Legal Compliance",
                        "text": "Buying or selling crypto may be restricted in your country. The user assumes full responsibility for acting in accordance with local laws.",
                        "eng_note": "Turkish follows. <1>English is the primary legal language.</1>"
                    }
                },
                "terms": {
                    "intro": "By using this application, you agree to the following terms.",
                    "section1": {
                        "title": "📌 General Terms",
                        "sub": "Usage",
                        "text": "This app is for information only. Users are responsible for their tokens."
                    },
                    "section2": {
                        "title": "🔄 Token Terms",
                        "sub": "Swap",
                        "text": "Transactions on STON.fi or other DEXs are at the user's discretion."
                    },
                    "section3": {
                        "title": "🚫 Prohibited Uses",
                        "sub": "Forbidden",
                        "text": "Money laundering or illegal financial transactions are strictly prohibited."
                    },
                    "section4": {
                        "title": "🗣️ Community Policy (UGC)",
                        "sub": "Content",
                        "text": "User posts (recipes, photos) are the user's responsibility. <1>Allergen and Calorie Data</1> is for information only. Absolute accuracy is <2>not guaranteed</2>."
                    },
                    "section5": {
                        "title": "⚙️ Right to Modify",
                        "sub": "Updates",
                        "text": "We reserve the right to update these terms without notice."
                    }
                },
                "privacy": {
                    "intro": "Your privacy is important to us. This policy explains data collection.",
                    "section1": {
                        "title": "📊 Data We Collect",
                        "sub": "Privacy",
                        "text": "We collect <1>Telegram User Information</1> (ID, Name) for community profiles and <1>Community Data</1> you share in the feed.",
                        "note": "Commitment: <1>Personal data is NEVER sold.</1>"
                    },
                    "section2": {
                        "title": "🔗 Third-Party",
                        "sub": "Integrations",
                        "text": "Integration with <1>TON Blockchain</1> and <1>STON.fi</1> is subject to their own policies."
                    },
                    "section3": {
                        "title": "🗑️ Data Deletion",
                        "sub": "Clean Up",
                        "text": "Clearing cache deletes local preferences. Blockchain records are permanent."
                    },
                    "section4": {
                        "title": "📩 Contact",
                        "sub": "Support",
                        "text": "Reach us through our Telegram channel for privacy questions."
                    }
                },
                "risk": {
                    "intro_title": "⛔ High Risk Warning",
                    "intro_text": "Crypto assets are highly volatile. You may <1>lose all of your investment.</1>",
                    "section1": {
                        "title": "📉 Market Risk",
                        "sub": "Volatility",
                        "text": "TASTE value can drop to zero instantly. Past performance is not a guarantee."
                    },
                    "section2": {
                        "title": "💧 Liquidity Risk",
                        "sub": "Trading",
                        "text": "Selling TASTE at your desired price may not always be possible."
                    },
                    "section3": {
                        "title": "🔧 Tech Risk",
                        "sub": "Network",
                        "text": "Blockchain network issues or <1>Smart Contract</1> vulnerabilities carry intrinsic risks."
                    },
                    "section4": {
                        "title": "⚖️ Regulatory Risk",
                        "sub": "Policy",
                        "text": "Laws change. User assumes risk of future legal restrictions."
                    },
                    "section5": {
                        "title": "💡 Recommended Approach",
                        "sub": "Safety",
                        "text": "Invest only what you can lose. DYOR."
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
                    "menu": "Menu",
                    "career": "Career / Jobs"
                },
                "trending": "Most Liked",
                "loading": "Loading posts...",
                "no_results": "No results found",
                "no_posts_title": "No posts yet",
                "no_posts_desc": "Be the first to share something!",
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
                },
                "job_post": "JOB POST",
                "reward_wallet": "REWARD WALLET",
                "chat_poster": "Chat with Poster",
                "alert_success_global": "Great! Your post has been shared globally! 🚀",
                "alert_success": "Post Shared! 🚀",
                "tab_feed": "Feed",
                "tab_jobs": "Jobs",
                "tab_chat": "Chat",
                "btn_share_win": "🚀 SHARE & WIN 5 TASTE!",
                "no_posts": "No Posts Yet",
                "ph_chat": "Type a message...",
                "ph_position": "Position in Restaurant",
                "ph_job_desc": "Write your job post or seeking details here...",
                "lbl_wallet_reward": "Wallet Address for Reward",
                "lbl_wallet_note": "* Don't forget to take a screenshot and share in TG group after posting!"
            },
            "jobs": {
                "title": "Taste Jobs",
                "subtitle": "Gastronomy Career & Community",
                "tabs": {
                    "feed": "Feed",
                    "board": "Board",
                    "reviews": "Reviews",
                    "profiles": "Profiles"
                },
                "types": {
                    "listing": "JOB LISTING",
                    "seeking": "SEEKING JOB",
                    "today": "🔥 TODAY"
                },
                "actions": {
                    "apply": "Apply",
                    "message": "Send Message",
                    "join_now": "Join Now",
                    "add_job": "Add Listing",
                    "add_review": "Add Review",
                    "add_cv": "Add CV",
                    "back": "Back",
                    "cancel": "Cancel",
                    "submit": "Submit",
                    "publishing": "Publishing...",
                    "sending": "Sending...",
                    "saving": "Saving...",
                    "submit_review": "⭐ Add Review (+5 TASTE)",
                    "submit_cv": "💾 Publish My CV",
                    "success_listing": "Listing published successfully! 🎉",
                    "success_apply": "Application sent!",
                    "tg_redirect": "Redirecting to Telegram..."
                },
                "placeholders": {
                    "title": "Job title (e.g. Experienced Waiter)",
                    "desc": "Details (experience, hours, etc.)",
                    "city": "Select City",
                    "salary": "Salary (e.g. 25k TL)",
                    "why_join": "Why do you want to join?",
                    "apply_msg": "Write your application message...",
                    "city_opt": "Select City",
                    "profession": "Select Profession",
                    "business_name": "Business name (e.g. XYZ Restaurant)",
                    "review_msg": "Write your review... (work conditions, management etc.)",
                    "experience": "Experience (e.g. 5 years Hotel Kitchen)",
                    "bio": "Tell about yourself..."
                },
                "reviews": {
                    "title": "Business Reviews",
                    "tip": "Review your workplace. Help the community! Earn <1>+5 TASTE</1>.",
                    "business_ph": "Business name",
                    "overall": "OVERALL SCORE",
                    "salary": "Salary",
                    "env": "Env",
                    "mgmt": "Mgmt",
                    "comment_ph": "Your comment...",
                    "success": "Review published! +5 TASTE won 🎉"
                },
                "profiles": {
                    "title": "Profiles & CV",
                    "add_btn": "+ Add CV",
                    "profession_ph": "Select profession",
                    "exp_ph": "Experience (e.g. 5 years)",
                    "bio_ph": "Short bio...",
                    "photo_label": "Profile Photo",
                    "photo_btn": "Select Photo from Gallery",
                    "skills_label": "Skills",
                    "success": "CV published! Others can see you 🎉",
                    "empty": "No profiles yet. Be the first!"
                },
                "feed": {
                    "title": "Kitchen Feed",
                    "new_post": "New Post",
                    "success_post": "Post published! Share screenshot to TG Group → +5 TASTE! 🎉",
                    "types": {
                        "food": "Food",
                        "recipe": "Recipe",
                        "menu": "Menu"
                    },
                    "placeholders": {
                        "food": "Tell about your dish...",
                        "recipe": "Share your recipe...",
                        "menu": "Describe your menu..."
                    }
                }
            },
            "tastepay": {
                "title": "Fast & Easy Payment",
                "desc": "Pay or get paid in seconds with TASTE — anywhere in the world.",
                "receive": "Create Invoice",
                "scan": "Pay with QR",
                "scan_desc": "Customer Mode · Scan code at checkout to pay",
                "receive_btn": "Receive Payment",
                "receive_desc": "Business Mode · Create QR code for customers to pay",
                "wallet_connected": "✓ Wallet connected",
                "wallet_required": "You must connect a wallet to make a payment",
                "receive_amount_title": "Amount to Receive",
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
            },
            "chef": {
                "title": "Taste Chef",
                "subtitle": "Digital Loyalty & Discount",
                "safe_title": "COMMUNITY MAIN SAFE",
                "fill_safe": "FILL SAFE",
                "discount_right": "DISCOUNT RIGHT",
                "min_hold_warning": "You must hold at least 2,000 TASTE to enjoy discounts.",
                "next_level": "Next Level:",
                "units_needed": "units more needed",
                "connect_warning": "Connect wallet to use discount.",
                "get_discount": "GET DISCOUNT AT CASHIER",
                "success_title": "Transaction Successful!",
                "success_desc": "Discount approved. Show this to the staff.",
                "mastery_levels": "Mastery Levels & Benefits",
                "nearby_venues": "Partner Restaurants (Nearby)",
                "nearby_branch": "Closest branch to you",
                "nav_tip": "* Our navigation automatically scans TASTE-valid spots in your area.",
                "legal_title": "Legal Requirements & Rules",
                "legal_points": [
                    "This system is for loyalty purposes only. It does not contain investment advice or financial instruments.",
                    "Discount rights are automatically defined based on your ownership status in your wallet.",
                    "The fee sent during the process is a system usage and verification fee.",
                    "TASTE IS NOT A PAYMENT METHOD. Crypto payments are not accepted. The bill is paid in local currency.",
                    "18+ age limit is mandatory. User is responsible for false statements."
                ],
                "tiers": {
                    "bronze": "Apprentice",
                    "silver": "Journeyman",
                    "gold": "Master",
                    "diamond": "Chef"
                }
            },
            "team": {
                "title": "Project Team Members",
                "subtitle": "The visionary minds building the TASTE ecosystem",
                "contact": "Contact",
                "roles": {
                    "founder": "Founder / Strategy & Vision",
                    "lead_dev": "Lead Developer / Architect",
                    "marketing": "CMO / Brand Growth",
                    "community": "Community & Media Manager",
                    "little_queen": "Community Manager",
                    "legend_love": "Community & Media Manager",
                    "fatih_kaya": "Financial Coordinator"
                },
                "bios": {
                    "founder": "Visionary behind the TASTE project. Building the bridge between gastronomy and blockchain.",
                    "lead_dev": "Master of code and architecture. Turning the TASTE vision into a scalable, secure digital reality.",
                    "marketing": "Strategic mind expanding TASTE's reach globally. Connecting the culinary world with Web3.",
                    "community": "Moderator, social media expert and advertiser. Also a contest organizer and community builder.",
                    "little_queen": "Focused on community growth, social media interactions, and supporting TASTE supporters.",
                    "legend_love": "Moderator, social media expert and advertiser. Also a contest organizer and community builder.",
                    "fatih_kaya": "Founder, planner, guide. The one who embraces, undertakes, and tries to execute the TASTE project. Ensures kitchen teams are financially supported."
                }
            }
        }
    },
    "tr": {
        "translation": {
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
                },
                "tap_for_info": "BİLGİ İÇİN DOKUN",
                "quick_links": "Hızlı Bağlantılar",
                "project_assistant": "Proje Asistanı",
                "quick_wallet": "Hızlı Cüzdan & Transfer",
                "chef_status": "Taste Şef Dijital Statü",
                "gastronomy_career": "Gastronomi Kariyer & Topluluk",
                "web3_partners": "Web3 & İş Ortakları",
                "joint_projects": "Ortak Projeler",
                "lang": "Dil",
                "banner_title": "TASTE Geleceğe Gidiyor!",
                "banner_desc": "TASTE yarının parlayan yıldızı. Hemen TASTE Al, bu muhteşem yolculukta yerini al!",
                "banner_buy": "TASTE AL"
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
                "chef": "Taste Şef",
                "discover": "Keşfet",
                "install": "Yükle",
                "partners": "Ortaklar",
                "vote": "Web3'teki Yerimiz",
                "socials": "Sosyal Ağlar",
                "team": "Ekip",
                "faq": "S.S.S.",
                "tech": "Teknoloji",
                "settings": "Ayarlar",
                "menu": "Menü"
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
                    "mint": {
                        "title": "Varlık Oluşumu & Piyasaya Sürüm",
                        "desc": "TASTE varlıkları TON blockchain üzerinde oluşturuldu, STON.fi'de işlem görmeye başladı."
                    },
                    "lp": {
                        "title": "Likidite Havuzu",
                        "desc": "STON.fi'de TON/TASTE likidite havuzu oluşturuldu ve aktif."
                    },
                    "lock": {
                        "title": "Varlık & LP Kilidi",
                        "desc": "Toplam arzın %88.4'ü JVault'ta 3 ayrı kilidle kilitlendi. Ek olarak STON.fi pTON-TASTE LP birimlerinin %81.6'sı tinu-locker.ton ile kilitlendi. Her iki kilit blockchain'de herkese açık doğrulanabilir."
                    },
                    "security": {
                        "title": "Güvenlik Taraması",
                        "desc": "Akıllı sözleşme güvenlik denetiminden geçirildi."
                    },
                    "miniapp": {
                        "title": "Telegram Mini App",
                        "desc": "Telegram üzerinde çalışan tam özellikli mini uygulama yayına girdi."
                    },
                    "airdrop": {
                        "title": "Airdrop & Ödül Dağıtımı",
                        "desc": "TASTE airdrop gerçekleştirildi ve her gün büyüyor. Çarkıfelek ödül sistemi aktif."
                    },
                    "documents": {
                        "title": "Beyaz Kağıt & Litepaper",
                        "desc": "Projeyi anlatan kapsamlı teknik doküman ve lite versiyon yayınlandı."
                    },
                    "social": {
                        "title": "Sosyal Ağ Varlığı",
                        "desc": "Telegram kanalı (@taste2025) ve Topluluk Grubu, WhatsApp kanalı, Twitter/X (@taste_token), Instagram (@taste_ton_taste), TikTok (@taste_ton), Facebook ve resmi website (tastetoken.net) kuruldu. Tüm platformlarda aktif."
                    },
                    "stray": {
                        "title": "Sokak Hayvanları Bağış Platformu",
                        "desc": "TON ve TASTE ile hayvan barınaklarına bağış yapılabilen platform eklendi."
                    },
                    "food_sharing": {
                        "title": "Günlük Yemek Paylaşım Platformu",
                        "desc": "Kullanıcılar tarif, yemek ve mekan paylaşabiliyor. Gerçek zamanlı (Supabase ile)."
                    },
                    "wallets": {
                        "title": "521 Cüzdana Ulaşıldı",
                        "desc": "İlk çeyrek hedefi aşıldı ve 521 benzersiz cüzdan sahibine ulaşıldı. Topluluk büyümeye devam ediyor."
                    },
                    "allergen": {
                        "title": "Gıda Alerjeni Bildirim Sistemi",
                        "desc": "AB & Türkiye gıda mevzuatındaki 14 zorunlu alerjen (Gluten, Süt, Yumurta, Balık vb.) Yemek Akışı'na entegre edildi. Her paylaşıma alerjen etiketi eklenebiliyor, kalori bilgisi gösteriliyor."
                    },
                    "v2": {
                        "title": "Mini App v2 Güncellemesi — Mart 2026",
                        "desc": "PoweredBy bölümü SVG logolarla yenilendi. Beyaz Kağıt'a TASTE özet kartı eklendi. Ödül dağıtımı bitiş sayacı (20 Mayıs 2026) eklendi. Yemek Akışı'na beğeni, arama ve trend yemekler getirildi."
                    },
                    "v2_1": {
                        "title": "Mini App v2.1 Yenilenme — Mart 2026",
                        "desc": "Premium Karanlık Tema UI/UX revizyonu. Yeni 'Keşfet' Menüsü ve S.S.S. bölümü eklendi. AI motoru Groq üzerinden Llama 3.3 70B'ye yükseltildi. Telegram tema renkleri lüks konsept ile senkronize edildi."
                    },
                    "v2_2": {
                        "title": "Mini App v2.2 İçerik & Uyumluluk — Mart 2026",
                        "desc": "Projenin felsefesi olan TASTE Manifesto yayınlandı. Tüm bileşenlerde tam Türkçe ve İngilizce (i18n) dil desteği sağlandı. Kapsamlı Yasal Altyapı (Kullanım Koşulları, Gizlilik, Risk Bildirimi) ve ilk açılış yasal uyarı modülü (Disclaimer) devreye alındı."
                    },
                    "v2_3": {
                        "title": "Mini App v2.3 Cüzdan & Adres Güncellemesi — Mart 2026",
                        "desc": "Hızlı Cüzdan & Transfer sistemi yayına alındı. Kullanıcılar artık TON ve TASTE bakiyelerini görebilir, QR kod ile anında işlem yapabilir ve her iki varlığı optimize edilmiş komisyonlarla güvenle gönderebilir."
                    },
                    "v2_4": {
                        "title": "Mini App v2.4 Taste Şef — Mart 2026",
                        "desc": "Dijital Sadakat ve İndirim sistemi yayına alındı. Çıraklıktan ustalığa giden yolda özel indirim hakları ve dijital onay sistemi tanımlandı."
                    },
                    "v2_5": {
                        "title": "Mini App v2.5 Topluluk 3.0 — Mart 2026",
                        "desc": "Supabase ile küresel gerçek zamanlı Yemek Akışı ve İş İlanı panosu yayına girdi. İlan verenlerle Telegram üzerinden anlık iletişim özelliği eklendi. 'Paylaş Kazan' kampanyaları ve ödül cüzdanı görünürlüğü aktifleşti. Küresel canlı sohbet devreye alındı."
                    },
                    "v2_6": {
                        "title": "Mini App v2.6 Cüzdan Güncellemesi — Mart 2026",
                        "desc": "4 sekmeli (Gönder, Al, Satın Al, Sat) gelişmiş cüzdan modülü STON.fi entegrasyonuyla yayına girdi."
                    },
                    "growth": {
                        "title": "Topluluk Büyütme",
                        "desc": "Her gün yeni kullanıcılar, her gün yeni paylaşımlar. Organik büyüme odaklı."
                    },
                    "visibility": {
                        "title": "Daha Fazla DEX Görünürlüğü",
                        "desc": "STON.fi'nin yanı sıra diğer TON ekosistem platformlarında varlık."
                    },
                    "partners": {
                        "title": "Stratejik Ortaklıklar",
                        "desc": "Yerel işletmeler, platformlar (örn. Panoda Şehir) ve gastronomi markalarıyla güç birliği yapılması."
                    },
                    "listings": {
                        "title": "Borsa Listelemeleri",
                        "desc": "DEX ve CEX borsalarında işlem görme ve hacim artışı için listeleme çalışmaları."
                    },
                    "reporting": {
                        "title": "Şeffaf Raporlama",
                        "desc": "Holder sayısı, işlem hacmi ve topluluk büyümesi düzenli paylaşılacak."
                    },
                    "dev": {
                        "title": "Mini App Geliştirme",
                        "desc": "Kullanıcı geri bildirimlerine göre yeni özellikler ekleniyor."
                    }
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
                        {
                            "icon": "📚",
                            "text": "Çırak yetiştirmek"
                        },
                        {
                            "icon": "👨‍🍳",
                            "text": "Usta yetiştirmek"
                        },
                        {
                            "icon": "🧠",
                            "text": "Bilinci büyütmek"
                        },
                        {
                            "icon": "💰",
                            "text": "Değeri derinleştirmek"
                        },
                        {
                            "icon": "🔥",
                            "text": "Ateşi büyütmek"
                        },
                        {
                            "icon": "🍽️",
                            "text": "Lezzeti artırmak"
                        }
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
                "pitch": {
                    "title": "Neden TASTE?",
                    "text1": "Dünya hızla değişiyor. Kağıt para dönemi yavaş yavaş sona ererken, yerini tam anlamıyla dijital ekonomi alıyor.\n\nPeki bu yeni düzende TASTE ne yapıyor?",
                    "text2": "TASTE, sadece bir kripto para (token) değil — arkasında gerçek kullanım alanı olan devasa bir ekosistem kuruyor. Artık anlaşmalı işletmelerde ödemelerinizi doğrudan TASTE ile yapabilecek, üstelik ödeme yaparken <highlight>TASTE tutucularına özel</highlight> indirimlerden ve ayrıcalıklardan faydalanabileceksiniz. 🛍️🤝",
                    "text3": "İşte TASTE’i diğer on binlerce projeden ayıran en büyük fark burada ortaya çıkıyor:",
                    "text4": "<highlight>Sadece spekülatif bir yatırım değil, gerçek hayatta kullanım + anında avantaj!</highlight> 🔥",
                    "text5": "Bugün cüzdanında TASTE tutanlar, yarının dijital ekonomisinde sadece seyirci kalmayacak; bir adım önde olacak.",
                    "text6": "Web3 dünyasında yepyeni bir dönem başladı…\n<highlight>Ve bu sahnede artık TASTE var.</highlight> 🚀💎"
                },
                "summary": {
                    "badge": "💎 TON Blockchain Üzerinde",
                    "subtitle": "Gastronomi ve eğitim odaklı, gerçek dünya kullanımı hedefleyen utility token",
                    "fixed_supply": "Sabit Arz",
                    "no_mint": "TASTE — Hiç mint yok",
                    "secured": "güvenceli",
                    "governance": "Yönetim",
                    "community_decision": "Topluluk kararı",
                    "target_use": "🎯 Hedef Kullanım Alanları",
                    "tags": [
                        "🍽️ Restoran",
                        "🏨 Otel",
                        "☕ Kafe",
                        "🎓 Eğitim",
                        "🎟️ İndirim Kuponu",
                        "🤝 Sadakat Ödülü"
                    ],
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
                        {
                            "icon": "🐋",
                            "text": "Balina oluşumunu önlemek — Birinin arzın büyük bölümünü ele geçirip fiyatı manipüle etmesini engellemek için."
                        },
                        {
                            "icon": "📉",
                            "text": "Ani dump hareketlerini önlemek — Büyük miktarların birden satışa çıkmasını engellemek için."
                        },
                        {
                            "icon": "🎭",
                            "text": "Yapay hype & fiyat manipülasyonunu önlemek — Spekülatif değil, gerçek kullanım odaklı büyüme için."
                        },
                        {
                            "icon": "🏗️",
                            "text": "Uzun vadeli ekosistem güvenliği — Sürdürülebilir ve sağlıklı bir ekonomi inşa etmek için."
                        }
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
                "general_info": {
                    "title": "Genel Bilgi",
                    "content": "TASTE, yemek sanatları ve gastronomiyi Web3 dünyasına entegre etmeyi amaçlayan, TON Blockchain üzerinde geliştirilmiş merkeziyetsiz bir ekosistemdir."
                },
                "vision": {
                    "title": "Vizyon",
                    "content": "Mutfak ustalığının dijital değerle buluştuğu küresel bir köprü inşa etmek, şeffaflık yoluyla üreticileri ve işletmeleri güçlendirmek."
                },
                "mission": {
                    "title": "Misyon",
                    "content": "Blockchain teknolojisini kullanarak gastronomi dünyasına sadakat, izlenebilirlik ve büyüme araçları sağlamaktır."
                },
                "team": {
                    "title": "Ekip",
                    "fatih": {
                        "name": "Fatih Emon",
                        "role": "Kurucu & Vizyoner"
                    },
                    "angel": {
                        "name": "Angel of Taste",
                        "role": "Topluluk & Ekosistem"
                    }
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
                        "247": "24/7 Açık",
                        "stray": "Sokak Hayvanı",
                        "unlimited": "Sınırsız",
                        "channel": "Bağış Kanalı",
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
                    "disclaimer": {
                        "label": "Sorumluluk Reddi",
                        "sub": "Disclaimer"
                    },
                    "terms": {
                        "label": "Kullanım Koşulları",
                        "sub": "Terms of Use"
                    },
                    "privacy": {
                        "label": "Gizlilik Politikası",
                        "sub": "Privacy Policy"
                    },
                    "risk": {
                        "label": "Risk Açıklaması",
                        "sub": "Risk Disclosure"
                    }
                },
                "footer": {
                    "last_updated": "Son güncelleme: Mart 2025 · TASTE Token © 2025",
                    "network": "Built on The Open Network"
                },
                "doc_info": "Son güncelleme: Mart 2025 | Bu belge Türkçe ve İngilizce olarak hazırlanmıştır.",
                "disclaimer": {
                    "section1": {
                        "title": "🚫 Yatırım Tavsiyesi Değildir",
                        "sub": "Disclaimer",
                        "text": "Bu uygulama içindeki hiçbir içerik, fiyat bilgisi, grafik, analiz, tahmin veya herhangi bir ifade; yatırım tavsiyesi, finansal öneri veya alım-satım teklifi olarak yorumlanamaz.",
                        "eng_note": "Aşağıda Türkçe metin yer almaktadır. <1>İngilizce asıl yasal dildir.</1>"
                    },
                    "section2": {
                        "title": "⚖️ Sorumluluk Sınırlaması",
                        "sub": "Limitation of Liability",
                        "text": "TASTE Token ekibi; bu uygulamaya dayanarak alınan herhangi bir karar sonucunda ortaya çıkabilecek mali kayıplar için hiçbir hukuki sorumluluk kabul etmez.",
                        "eng_note": "Aşağıda Türkçe metin yer almaktadır. <1>İngilizce asıl yasal dildir.</1>"
                    },
                    "section3": {
                        "title": "🌍 Yasal Uyumluluk",
                        "sub": "Regulatory Compliance",
                        "text": "Kripto para işlemleri bulunduğunuz ülkede kısıtlı olabilir. Kişi, yerel hukuka uygun hareket etme sorumluluğunu tamamen üstlenmiş sayılır.",
                        "eng_note": "Aşağıda Türkçe metin yer almaktadır. <1>İngilizce asıl yasal dildir.</1>"
                    }
                },
                "terms": {
                    "intro": "Bu uygulamayı kullanmaya devam etmekle aşağıdaki koşulları kabul etmiş sayılırsınız.",
                    "section1": {
                        "title": "📌 Genel Kullanım Koşulları",
                        "sub": "Kullanım",
                        "text": "Uygulama bilgilendirme amaçlıdır. Kullanıcılar kendi tokenlarından sorumludur."
                    },
                    "section2": {
                        "title": "🔄 Token Alım-Satım Koşulları",
                        "sub": "Swap",
                        "text": "STON.fi gibi platformlardaki işlemler tamamen kullanıcının iradesindedir."
                    },
                    "section3": {
                        "title": "🚫 Yasaklı Kullanımlar",
                        "sub": "Yasak",
                        "text": "Para aklama veya yasadışı finansal işlemler kesinlikle yasaktır."
                    },
                    "section4": {
                        "title": "🗣️ Topluluk Sorumluluğu (UGC)",
                        "sub": "İçerik",
                        "text": "Kullanıcı paylaşımları (tarifler, fotoğraflar) kullanıcının sorumluluğundadır. <1>Alerjen ve Kalori Verisi</1> bilgilendirme amaçlıdır. Kesin doğruluğu <2>garanti edilmez</2>."
                    },
                    "section5": {
                        "title": "⚙️ Değişiklik Hakkı",
                        "sub": "Güncelleme",
                        "text": "Koşulları önceden haber vermeksizin güncelleme hakkımızı saklı tutarız."
                    }
                },
                "privacy": {
                    "intro": "Gizliliğiniz bizim için önemlidir. Bu politika veri toplamayı açıklar.",
                    "section1": {
                        "title": "📊 Toplanan Veriler",
                        "sub": "Gizlilik",
                        "text": "Profil oluşturmak için <1>Telegram Kullanıcı Bilgilerini</1> (ID, Ad) ve akışta paylaştığınız <1>Topluluk Verilerini</1> topluyoruz.",
                        "note": "Taahhüt: <1>Kişisel veriler ASLA satılmaz.</1>"
                    },
                    "section2": {
                        "title": "🔗 Üçüncü Taraf",
                        "sub": "Entegrasyon",
                        "text": "<1>TON Blockchain</1> ve <1>STON.fi</1> entegrasyonu kendi politikalarına tabidir."
                    },
                    "section3": {
                        "title": "🗑️ Veri Silme",
                        "sub": "Temizlik",
                        "text": "Önbelleği temizlemek tercihleri siler. Blockchain kayıtları kalıcıdır."
                    },
                    "section4": {
                        "title": "📩 İletişim",
                        "sub": "Destek",
                        "text": "Gizlilik soruları için Telegram kanalımızdan bize ulaşabilirsiniz."
                    }
                },
                "risk": {
                    "intro_title": "⛔ Yüksek Risk Uyarısı",
                    "intro_text": "Kripto varlıklar değişken araçlardır. Yatırımınızın <1>tamamını kaybedebilirsiniz.</1>",
                    "section1": {
                        "title": "📉 Piyasa Riski",
                        "sub": "Volatilite",
                        "text": "TASTE değeri anında sıfıra düşebilir. Geçmiş performans garanti değildir."
                    },
                    "section2": {
                        "title": "💧 Likidite Riski",
                        "sub": "Ticaret",
                        "text": "TASTE'i istediğiniz fiyattan satmak her zaman mümkün olmayabilir."
                    },
                    "section3": {
                        "title": "🔧 Teknoloji Riski",
                        "sub": "Ağ",
                        "text": "Ağ sorunları veya <1>Akıllı Sözleşme</1> açıkları içsel riskler taşır."
                    },
                    "section4": {
                        "title": "⚖️ Düzenleyici Risk",
                        "sub": "Politika",
                        "text": "Yasalar değişir. Yarın yasal kısıtlamalar gelebilir, risk kullanıcıya aittir."
                    },
                    "section5": {
                        "title": "💡 Önerilen Yaklaşım",
                        "sub": "Güvenlik",
                        "text": "Sadece kaybedebileceğiniz kadar yatırın. Kendi araştırmanızı yapın (DYOR)."
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
                    "menu": "Menü",
                    "career": "Kariyer / İş"
                },
                "trending": "En Çok Beğenilen",
                "loading": "Paylaşımlar yükleniyor...",
                "no_results": "Sonuç bulunamadı",
                "no_posts_title": "Henüz paylaşım yok",
                "no_posts_desc": "İlk ilanı veya paylaşımı sen yap!",
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
                },
                "job_post": "İŞ İLANI",
                "reward_wallet": "ÖDÜL CÜZDANI",
                "chat_poster": "İlan Verenle Yazış",
                "alert_success_global": "Harika! İlanın paylaşıldı ve tüm dünyaya duyuruldu. 🚀",
                "alert_success": "İlanın Paylaşıldı! 🚀",
                "tab_feed": "Akış",
                "tab_jobs": "İş İlanı",
                "tab_chat": "Sohbet",
                "btn_share_win": "🚀 PAYLAŞ & 5 TASTE KAZAN!",
                "no_posts": "Henüz İlan Yok",
                "ph_chat": "Mesaj yaz...",
                "ph_position": "Lokantadaki Pozisyon",
                "ph_job_desc": "İş ilanı veya iş arayışınızı buraya yazın...",
                "lbl_wallet_reward": "Ödül İçin Cüzdan Adresi",
                "lbl_wallet_note": "* Paylaştıktan sonra ekran görüntüsü alıp TG grubuna atmayı unutmayın!"
            },
            "jobs": {
                "title": "Taste Jobs",
                "subtitle": "Gastronomi Kariyer & Topluluk",
                "tabs": {
                    "feed": "Akış",
                    "board": "İlanlar",
                    "reviews": "Yorumlar",
                    "profiles": "Profiller"
                },
                "types": {
                    "listing": "İŞ İLANI",
                    "seeking": "İŞ ARIYOR",
                    "today": "🔥 BUGÜN"
                },
                "actions": {
                    "apply": "Başvur",
                    "message": "Mesaj Gönder",
                    "join_now": "Hemen Katıl",
                    "add_job": "İlan Ekle",
                    "add_review": "Yorum Yap",
                    "add_cv": "CV Ekle",
                    "back": "Geri",
                    "cancel": "İptal",
                    "submit": "Yayınla",
                    "publishing": "Yayınlanıyor...",
                    "sending": "Gönderiliyor...",
                    "saving": "Kaydediliyor...",
                    "submit_review": "⭐ Yorum Yap (+5 TASTE)",
                    "submit_cv": "💾 CV'mi Yayınla",
                    "success_listing": "İlanınız başarıyla yayınlandı! 🎉",
                    "success_apply": "Başvuru iletildi!",
                    "tg_redirect": "Telegram'a yönlendiriliyor..."
                },
                "placeholders": {
                    "title": "İlan başlığı (örn: Deneyimli Garson Aranıyor)",
                    "desc": "Detayları yazın... (deneyim, saatler vb.)",
                    "city": "Şehir Seçin",
                    "salary": "Maaş (örn: 25.000 TL)",
                    "why_join": "Neden katılmak istiyorsunuz?",
                    "apply_msg": "Başvuru mesajınızı yazın...",
                    "city_opt": "📍 Şehir Seçin",
                    "profession": "Meslek seçin",
                    "business_name": "İşletme adı (örn: XYZ Restoran)",
                    "review_msg": "Yorumunuzu yazın... (çalışma koşulları, yönetim vb.)",
                    "experience": "Deneyim (örn: 5 yıl Otel Mutfağı)",
                    "bio": "Kendinden bahset..."
                },
                "reviews": {
                    "title": "İşletme Değerlendirmeleri",
                    "tip": "Çalıştığın işletmeyi değerlendir. Topluluğa yardım et! <1>+5 TASTE</1> kazan.",
                    "business_ph": "İşletme adı",
                    "overall": "GENEL PUAN",
                    "salary": "Maaş",
                    "env": "Ortam",
                    "mgmt": "Yönetim",
                    "comment_ph": "Yorumunuz...",
                    "success": "Yorumun yayınlandı! +5 TASTE kazandın 🎉"
                },
                "profiles": {
                    "title": "Profiller & CV",
                    "add_btn": "+ CV Ekle",
                    "profession_ph": "Meslek seçin",
                    "exp_ph": "Deneyim (örn: 5 yıl)",
                    "bio_ph": "Kısa biyografi...",
                    "photo_label": "Profil Fotoğrafı",
                    "photo_btn": "Galeriden Fotoğraf Seç",
                    "skills_label": "Yetenekler",
                    "success": "CV'n yayınlandı! Diğerleri seni görebilir 🎉",
                    "empty": "Henüz profil yok. İlk CV'yi sen ekle!"
                },
                "feed": {
                    "title": "Mutfak Akışı",
                    "new_post": "Yeni Paylaşım",
                    "success_post": "Paylaşımın yayınlandı! Ekran görüntüsü alıp TG grubuna gönder → +5 TASTE! 🎉",
                    "types": {
                        "food": "Yemek",
                        "recipe": "Tarif",
                        "menu": "Menü"
                    },
                    "placeholders": {
                        "food": "Yediğin yemeği anlat...",
                        "recipe": "Tarifini paylaş...",
                        "menu": "Menünü anlat..."
                    }
                }
            },
            "tastepay": {
                "title": "Kolay ve Hızlı Ödeme",
                "desc": "TASTE ile saniyeler içinde öde veya ödeme al — dünyanın her yerinde.",
                "receive": "Fatura Oluştur",
                "scan": "QR ile Öde",
                "scan_desc": "Müşteri Modu · Kasadaki kodu okut ve öde",
                "receive_btn": "Ödeme Al",
                "receive_desc": "İşletme Modu · QR kod oluştur, müşteri ödesin",
                "wallet_connected": "✓ Cüzdan bağlı",
                "wallet_required": "Ödeme yapmak için cüzdan bağlamanız gerekir",
                "receive_amount_title": "Ödeme Alınacak Tutar",
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
            },
            "chef": {
                "title": "Taste Şef",
                "subtitle": "Dijital Sadakat ve İndirim",
                "safe_title": "TOPLULUK ANA KASASI",
                "fill_safe": "KASAYI DOLDUR",
                "discount_right": "İNDİRİM HAKKI",
                "min_hold_warning": "İndirimlerden yararlanmak için en az 2.000 TASTE tutmalısın.",
                "next_level": "Sonraki Seviye:",
                "units_needed": "birim daha lazım",
                "connect_warning": "İndirimi kullanmak için cüzdanını bağla.",
                "get_discount": "KASADA İNDİRİM AL",
                "success_title": "İşlem Başarılı!",
                "success_desc": "İndirim onaylandı. Garsona bu ekranı göster.",
                "mastery_levels": "Ustalık Seviyeleri ve Avantajlar",
                "nearby_venues": "Anlaşmalı Restoranlar (Yakınındakiler)",
                "nearby_branch": "Konumuna en yakın şube",
                "nav_tip": "* Navigasyon sistemimiz bulunduğun bölgedeki TASTE geçerli noktaları otomatik tarar.",
                "legal_title": "Yasal Zorunluluk ve Kurallar",
                "legal_points": [
                    "Bu sistem sadece sadakat programı amaçlıdır. Hiçbir şekilde yatırım tavsiyesi veya finansal araç içermez.",
                    "İndirim hakkı, cüzdanınızdaki sahiplik durumuna göre otomatik tanımlanır.",
                    "İşlem sırasında gönderilen bedel, sistem kullanım ve doğrulama ücretidir.",
                    "TASTE BİR ÖDEME ARACI DEĞİLDİR. Kripto paralarla ödeme kabul edilmez. Hesap yerel para birimi (TL) ile kapatılır.",
                    "18 yaş sınırı zorunludur. Yanlış beyanlardan kullanıcı sorumludur."
                ],
                "tiers": {
                    "bronze": "Çırak",
                    "silver": "Kalfa",
                    "gold": "Usta",
                    "diamond": "Şef"
                }
            },
            "team": {
                "title": "Proje Ekip Üyeleri",
                "subtitle": "TASTE ekosistemini inşa eden vizyoner ekip",
                "contact": "İletişim",
                "roles": {
                    "founder": "Kurucu / Strateji ve Vizyon",
                    "lead_dev": "Baş Geliştirici / Mimar",
                    "marketing": "Pazarlama Yöneticisi / Marka Büyümesi",
                    "community": "Topluluk ve Medya Yöneticisi",
                    "little_queen": "Topluluk Yöneticisi",
                    "legend_love": "Topluluk ve Medya Yöneticisi",
                    "fatih_kaya": "Mali İşler Sorumlusu"
                },
                "bios": {
                    "founder": "TASTE projesinin vizyoneri. Gastronomi ile blockchain arasındaki köprüyü inşa ediyor.",
                    "lead_dev": "Kod ve mimari ustası. TASTE vizyonunu ölçeklenebilir ve güvenli bir dijital gerçekliğe dönüştürüyor.",
                    "marketing": "TASTE'in küresel erişimini genişleten stratejik zeka. Aşçılık dünyasını Web3 ile buluşturuyor.",
                    "community": "Moderatör, sosyal medya uzmanı ve reklamcı. Ayrıca yarışma düzenleyici ve topluluk oluşturucu.",
                    "little_queen": "Topluluk büyümesi, sosyal medya etkileşimleri ve TASTE destekçilerine destek olmaya odaklı.",
                    "legend_love": "Moderatör, sosyal medya uzmanı ve reklamcı. Ayrıca yarışma düzenleyici ve topluluk oluşturucu.",
                    "fatih_kaya": "Kurucu, planlayıcı, yol gösterici. TASTE projesini sahiplenen, üstlenen ve yürütmeye çalışan kişi. Mutfak ekiplerince finanse edilebilmekten sorumlu."
                }
            }
        }
    },
    "ru": {
        "translation": {
            "app": {
                "title": "ВКУС",
                "description": "Утилитарные цифровые активы в сфере гастрономии и обучения",
                "my_balance": "Мой Баланс",
                "connect_wallet_first": "Подключите кошелек",
                "tap_to_earn": "Нажмите, чтобы заработать",
                "no_energy": "Нет энергии",
                "invite_friend": "Пригласить друга",
                "share_link": "Поделиться ссылкой",
                "invite_gain": "Давайте расширять сообщество вместе",
                "buy_title": "Erken Erişim — Купить TASTE",
                "buy_with": "Получить с помощью TON",
                "you_get": "Вы получите",
                "swap_opening": "Открытие обмена на STON.fi...",
                "holders": "Держатели",
                "invite_desc": "Развивайте сообщество вместе",
                "referral_message": "Присоединяйтесь к TASTE и начните зарабатывать награды экосистемы TON! 🍳",
                "transaction_failed": "Транзакция не удалась или была отменена. ❌",
                "early_access_ending": "🚀 Ранний доступ, уровень 1. Окончание:",
                "reward_end": "🎁 Окончание раздачи наград — 20 мая 2026 г.",
                "units": {
                    "day": "ДНИ",
                    "hr": "ЧРС",
                    "min": "МИН",
                    "sec": "SEC",
                    "holder": "Держатели",
                    "supply": "Общий объем поставок",
                    "locked": "Заблокировано"
                },
                "faq": {
                    "title": "❓ Часто задаваемые вопросы",
                    "what_is": "Что такое ВКУС?",
                    "what_is_ans": "TASTE — это цифровой актив лояльности, ориентированный на гастрономию и образование, построенный на блокчейне TON. Он предназначен для реального использования в ресторанах, отелях, а также в пищевой промышленности и производстве напитков.",
                    "how_to": "Как купить?",
                    "how_to_ans": "1. Загрузите TON в свой TON-кошелек (Tonkeeper, @wallet).<br />2. Выберите нужную сумму на панели выше.<br />3. Нажмите «Купить за TON» и произведите обмен через STON.fi."
                },
                "tap_for_info": "НАЖМИТЕ ДЛЯ ИНФОРМАЦИИ",
                "quick_links": "Быстрые ссылки",
                "project_assistant": "Ассистент проекта",
                "quick_wallet": "Быстрый кошелек и перевод",
                "chef_status": "Цифровой статус Taste Chef",
                "gastronomy_career": "Гастрономическая карьера и сообщество",
                "web3_partners": "Web3 и партнеры",
                "joint_projects": "Совместные проекты",
                "lang": "Ланг",
                "banner_title": "ВКУС идет в будущее!",
                "banner_desc": "ВКУС – яркая звезда завтрашнего дня. Купите TASTE сейчас и займите свое место в этом удивительном путешествии!",
                "banner_buy": "КУПИТЬ ВКУС"
            },
            "nav": {
                "home": "Главная",
                "roadmap": "Дорожная карта",
                "whitepaper": "Белая бумага",
                "litepaper": "Лайтпейпер",
                "community": "Кулинарная лента",
                "spin": "Колесо удачи",
                "charity": "Благотворительность",
                "legal": "Правовая информация",
                "leaderboard": "Лидеры",
                "play": "Играть",
                "wallet": "Кошелек",
                "chef": "Шеф Taste",
                "discover": "Обнаружить",
                "install": "Установить",
                "partners": "Партнеры",
                "vote": "Наше место в Web3",
                "socials": "Социальные сети",
                "team": "Команда",
                "faq": "ЧАСТО ЗАДАВАЕМЫЕ ВОПРОСЫ.",
                "tech": "Технология",
                "settings": "Настройки",
                "menu": "Меню"
            },
            "home": {
                "live_badge": "Живая активность",
                "live_title": "📡 ВКУСНАЯ активность"
            },
            "market": {
                "live_chart": "Живой анализ рынка"
            },
            "roadmap": {
                "title": "Дорожная карта 2026",
                "philosophy_title": "ВКУС Философия",
                "philosophy": [
                    "🎯 ВКУС не описывает то, чего он не может сделать.",
                    "✅ Он описывает планы того, что уже сделано — проверено и реально.",
                    "🤝 Он не дает обещаний, которые не может выполнить. Вот почему люди доверяют нам.",
                    "📌Каждый шаг прозрачен, каждое обязательство выполнено."
                ],
                "completed_goals": "1 квартал 2026 г. — Достигнутые цели",
                "ongoing": "Непрерывный",
                "footer_text": "Эта дорожная карта — живой документ — выполненные задачи добавляются, необещанные — нет.",
                "footer_bold": "ВКУС укрепляет доверие, а не продает мечты.",
                "items": {
                    "mint": {
                        "title": "Генезис и запуск активов",
                        "desc": "Активы TASTE были созданы на блокчейне TON и начали торговаться на STON.fi."
                    },
                    "lp": {
                        "title": "Пул ликвидности",
                        "desc": "Пул ликвидности TON/TASTE был создан и активирован на STON.fi."
                    },
                    "lock": {
                        "title": "Блокировка активов и LP",
                        "desc": "88,4% общего объема заблокировано в JVault с помощью 3 отдельных замков. Кроме того, 81,6% устройств STON.fi pTON-TASTE LP заблокированы с помощью Tinu-locker.ton. Оба замка публично проверяются в блокчейне."
                    },
                    "security": {
                        "title": "Сканирование безопасности",
                        "desc": "Смарт-контракт прошел аудит безопасности."
                    },
                    "miniapp": {
                        "title": "Мини-приложение Telegram",
                        "desc": "Запущено полнофункциональное мини-приложение, работающее в Telegram."
                    },
                    "airdrop": {
                        "title": "Аирдроп и награды",
                        "desc": "Аирдроп TASTE был проведен для 521 кошелька и растет с каждым днем. Система вознаграждений с вращающимся колесом активна."
                    },
                    "documents": {
                        "title": "Техническая документация и литература",
                        "desc": "Были опубликованы подробные технические документы и облегченные версии, объясняющие проект."
                    },
                    "social": {
                        "title": "Присутствие в социальных сетях",
                        "desc": "Были созданы Telegram-канал (@taste2025), группа сообщества, канал WhatsApp, Twitter/X (@taste_token), Instagram (@taste_ton_taste), TikTok (@taste_ton), Facebook и официальный сайт (tastetoken.net). Активен на всех платформах."
                    },
                    "stray": {
                        "title": "Платформа для пожертвований бездомных животных",
                        "desc": "Была добавлена ​​платформа, на которой можно делать пожертвования в приюты для животных с помощью TON и TASTE."
                    },
                    "food_sharing": {
                        "title": "Платформа ежедневного обмена едой",
                        "desc": "Пользователи могут делиться рецептами, едой и местами проведения. В реальном времени (с Supabase)."
                    },
                    "wallets": {
                        "title": "Достигнуто 521 кошельков",
                        "desc": "Цель первого квартала была достигнута: 521 уникальный владелец кошелька. Сообщество продолжает расти."
                    },
                    "allergen": {
                        "title": "Система уведомления о пищевых аллергенах",
                        "desc": "В пищевой корм были включены 14 обязательных аллергенов, предусмотренных законодательством ЕС и Турции (глютен, молоко, яйца, рыба и т. д.). К каждой публикации можно добавить метки аллергенов, а также отобразить информацию о калориях."
                    },
                    "v2": {
                        "title": "Обновление мини-приложения v2 — март 2026 г.",
                        "desc": "В разделе PoweredBy добавлены логотипы SVG (OKX, Bitget, Binance, Telegram, Google, Gemini). В технический документ добавлена ​​сводная карта TASTE. Добавлен таймер окончания раздачи наград (20 мая 2026 г.). Лайки, поиск и трендовые продукты питания, добавленные в Food Feed."
                    },
                    "v2_1": {
                        "title": "Редизайн мини-приложения v2.1 — март 2026 г.",
                        "desc": "Обновление пользовательского интерфейса и UX Premium Dark. Реализован новый ящик меню «Исследование». Добавлен раздел FAQ. Движок искусственного интеллекта обновлен до Llama 3.3 70B через Groq. Глобальные цвета темы Telegram синхронизированы для создания превосходного ощущения."
                    },
                    "v2_2": {
                        "title": "Содержимое и соответствие мини-приложению версии 2.2 — март 2026 г.",
                        "desc": "Опубликован манифест TASTE, раскрывающий душу проекта. Полная поддержка интернационализации (i18n) для английского и турецкого языков. Комплексная правовая база (Условия, конфиденциальность, раскрытие рисков) и первый запуск модального уведомления об отказе от ответственности реализованы для обеспечения безопасности пользователей."
                    },
                    "v2_3": {
                        "title": "Обновление Mini App v2.3 Wallet & QR — март 2026 г.",
                        "desc": "Запущена система Quick Wallet & Transfer. Теперь пользователи могут просматривать балансы TON и TASTE, сканировать QR-коды для мгновенных платежей и безопасно отправлять токены TON и TASTE с оптимизированной комиссией за газ."
                    },
                    "v2_4": {
                        "title": "Мини-приложение v2.4 Вкус Шефа",
                        "desc": "Цифровая система лояльности и скидок. Уровни обучения до статуса Master Chef. Символическая плата за подтверждение скидки на кассах."
                    },
                    "v2_5": {
                        "title": "Мини-приложение v2.5 Community 3.0 — март 2026 г.",
                        "desc": "Глобальная доска объявлений о питании и трудоустройстве в режиме реального времени запущена с помощью Supabase. Прямая интеграция с Telegram для мгновенного контакта с объявлениями о вакансиях. Кампании «Поделись и выиграй» активны с видимостью кошелька вознаграждений. Глобальный чат активен."
                    },
                    "v2_6": {
                        "title": "Мини-приложение v2.6 «Кошелек и система переводов» — март 2026 г.",
                        "desc": "Полностью интегрированный компонент «Кошелек» с вкладками «Отправка», «Получение», «Купить» и «Продать» на основе глубоких ссылок STON.fi."
                    },
                    "growth": {
                        "title": "Рост сообщества",
                        "desc": "Каждый день новые пользователи, каждый день новые репосты. Ориентирован на органический рост."
                    },
                    "visibility": {
                        "title": "Повышенная видимость DEX",
                        "desc": "Присутствие на других платформах экосистемы TON наряду со STON.fi."
                    },
                    "partners": {
                        "title": "Стратегическое партнерство",
                        "desc": "Создание альянсов с местными предприятиями, платформами и гастрономическими брендами."
                    },
                    "listings": {
                        "title": "Листинги CEX/DEX",
                        "desc": "Увеличение объема торгов на различных децентрализованных и централизованных биржах."
                    },
                    "reporting": {
                        "title": "Прозрачная отчетность",
                        "desc": "Количество держателей, объем транзакций и рост сообщества будут регулярно сообщаться."
                    },
                    "dev": {
                        "title": "Разработка мини-приложений",
                        "desc": "Новые функции добавляются на основе отзывов пользователей."
                    }
                },
                "spin": {
                    "ton_balance": "ТОН Баланс",
                    "ton_target": "Цель: 5 ТОНН",
                    "ton_claim_ready": "🎉 ТОННА НАГРАД ГОТОВА!",
                    "ton_left": "{{n}} TON осталось",
                    "win_ton": "🎉 {{n}} ТОН выиграл!",
                    "reward_claim_ton": "🎉 ТОННА НАГРАДЫ",
                    "accumulated_ton": "Привет! Я накопил 5 ТОНН.",
                    "won_ton_msg": "🏆Я ВЫИГРАЛА ТОННУ НА КОЛЕСЕ!",
                    "ton_win_bonus": "🎉 {{n}} ТОН БОНУС!",
                    "ton_important": "Платежи производятся при минимальном пороге 5 TON."
                }
            },
            "manifesto": {
                "title": "ВКУСОВОЙ МАНИФЕСТ",
                "subtitle": "История огня • Путь мастерства",
                "section1": {
                    "title": "🌅 Начало огня",
                    "p1": "Когда в цифровом мире зажегся первый огонь… никто не знал, что это будет кухня.",
                    "quote": "Все началось с искры. Невидимая рука… невидимый рецепт… И человечество впервые учится управлять децентрализованным огнем…",
                    "p2": "Человек, который зажёг этот огонь, был не именем… не личностью… Идеей… революцией… <highlight>пробуждением</highlight>.",
                    "p3": "Он просто зажег огонь. Он поставил печку. Он оставил рецепт. А потом… он вышел из кухни."
                },
                "section2": {
                    "title": "⚠️ Огня было недостаточно",
                    "p1": "Но одного огня было недостаточно. Огонь может обжечь… Но <highlight>готовка требует мастерства</highlight>.",
                    "p2": "Со временем цифровой мир наполнился. Открылись тысячи кухонь. Светящиеся вывески… шумные залы… быстрые рецепты…",
                    "quote": "Но большинству из них не хватало этого: никакой рабочей силы. Никакого терпения. Нет души. Был огонь… но не было вкуса."
                },
                "section3": {
                    "title": "🍳 Рождение ВКУСА",
                    "p1": "В этот самый момент... возникла еще одна необходимость.",
                    "p2": "Кто-то не просто хотел использовать огонь. Они хотели <highlight>понять</highlight> это. Они хотели <highlight>обработать</highlight> это. Они хотели <highlight>превратить это в мастерство</highlight>.",
                    "quote": "И кухня была установлена. Тихий. Неприхотливый. Но осознанный. Название: ВКУС"
                },
                "section4": {
                    "title": "🚪 Вход на кухню",
                    "box": "Зажгите печь. Вы слышите это? Это не просто звук пламени. Это <highlight>звук трансформации</highlight>.",
                    "p1": "Когда металл превратился в цифровой, родилась ценность… Но смысл не родился. <highlight>TASTE был создан для того, чтобы придавать смысл.</highlight>",
                    "p2": "Когда вы входите в дверь, вы чувствуете это:",
                    "quote": "Здесь ничего не делается быстро. Здесь ничего не делается зря. Ничто не существует только для того, чтобы существовать здесь.",
                    "p3": "У каждого материала есть причина. У каждого рецепта есть история. У каждого мастера есть следы ожогов."
                },
                "section5": {
                    "title": "⏳ Истинная ценность созревает",
                    "quote": "Потому что истинная ценность не производится… Она созревает. Оно ждет у огня. Оно принимает форму с течением времени. Оно углубляется с терпением."
                },
                "section6": {
                    "title": "🎯 Так почему мы существуем?",
                    "p1": "Не только для торговли. Не только покупать и продавать. Вовсе не просто для того, чтобы его увидели.",
                    "box": [
                        "Мы существуем, чтобы <highlight>производить ценность</highlight>.",
                        "Мы существуем для того, чтобы <highlight>делиться знаниями</highlight>.",
                        "Мы существуем для того, чтобы <highlight>развивать мастерство</highlight>.",
                        "Мы существуем, чтобы привнести <highlight>смысл</highlight> в цифровой мир."
                    ],
                    "quote": "Мы на стороне глубины… а не скорости. Мы на стороне мастерства… а не шума. Мы на стороне производства, а не потребления."
                },
                "section7": {
                    "title": "💎 ВКУС – не тренд",
                    "p1": "Сегодня в цифровом мире циркулируют бесчисленные активы. Некоторые существуют только для того, чтобы их видели. Некоторые существуют только для того, чтобы их продать. Некоторые рождаются только для того, чтобы их забыли.",
                    "quote": "Но некоторые вещи… рождаются по необходимости.",
                    "p2": "<highlight>ВКУС</highlight> — это не тренд. Не копия. Ни шума.",
                    "p3": "Эта кухня была создана, чтобы заполнить пустоту. Где люди не просто совершают сделки… <highlight>Производят… обучаются… трансформируются и развиваются…</highlight>, чтобы стать системой."
                },
                "section8": {
                    "title": "🛤️ Наш Путь",
                    "paths": [
                        {
                            "icon": "📚",
                            "text": "Обучение учеников"
                        },
                        {
                            "icon": "👨‍🍳",
                            "text": "Обучение мастеров"
                        },
                        {
                            "icon": "🧠",
                            "text": "Растущее сознание"
                        },
                        {
                            "icon": "💰",
                            "text": "Углубление ценности"
                        },
                        {
                            "icon": "🔥",
                            "text": "Растущий огонь"
                        },
                        {
                            "icon": "🍽️",
                            "text": "Увеличение вкуса"
                        }
                    ],
                    "quote": "Так куда же ведет этот путь? Не туда, где конец. В место, которое растет. Это не пункт назначения… это <highlight>путь мастерства</highlight>.",
                    "p1": "Настоящие мастера знают: <highlight>Лучший рецепт — тот, который еще не написан.</highlight>"
                },
                "section9": {
                    "title": "И теперь…",
                    "p1": "Печка включена. Горшки готовы. Рецепт ждет написания. Время течет.",
                    "box": "Это не история. Это не метафора. Это вовсе не сон. Это… <highlight>неизбежная эволюция</highlight>.",
                    "p2": "Огонь зажжен. Система создана. Но вкус все еще готовится.",
                    "footer_q": "Вопрос не в том: «Существует ли ВКУС?»",
                    "footer_a": "Вы готовы занять свое место на этой кухне? 🍽️"
                }
            },
            "whitepaper": {
                "title": "Технический документ",
                "pitch": {
                    "title": "Почему ВКУС?",
                    "text1": "Мир быстро меняется. Поскольку эра бумажных денег постепенно подходит к концу, ее место занимает цифровая экономика.\n\nТак что же делает ВКУС в этом новом порядке?",
                    "text2": "TASTE — это не просто криптовалюта (токен) — он создает огромную экосистему, за которой стоит реальная полезность. Теперь вы сможете платить напрямую с помощью TASTE в компаниях-партнерах и пользоваться <highlight>эксклюзивными</highlight> скидками и привилегиями для владельцев TASTE при оплате. 🛍️🤝",
                    "text3": "Вот тут-то и проявляется самое большое отличие TASTE от десятков тысяч других проектов:",
                    "text4": "<highlight>Не просто спекулятивные инвестиции, а реальное использование + мгновенная выгода!</highlight> 🔥",
                    "text5": "Те, у кого сегодня есть ВКУС в своих кошельках, будут не просто зрителями завтрашней цифровой экономики; они будут на шаг впереди.",
                    "text6": "В мире Web3 началась совершенно новая эра…\n<highlight>И теперь на сцене ВКУС.</highlight> 🚀💎"
                },
                "summary": {
                    "badge": "💎 На блокчейне TON",
                    "subtitle": "Ориентирован на гастрономию и образование, ориентируясь на использование утилитарных токенов в реальном мире.",
                    "fixed_supply": "Фиксированная поставка",
                    "no_mint": "ВКУС — Hiç mint yok",
                    "secured": "обеспеченный",
                    "governance": "Управление",
                    "community_decision": "Решение сообщества",
                    "target_use": "🎯 Целевые варианты использования",
                    "tags": [
                        "🍽️Ресторан",
                        "🏨 Отель",
                        "☕ Кафе",
                        "🎓 Образование",
                        "🎟️ Купон на скидку",
                        "🤝 Награда за лояльность"
                    ],
                    "why_mint_title": "🔐 Почему Управление монетного двора остается открытым?",
                    "why_mint_desc": "Проект TASTE построен на контролируемой и доверительной экономике. Чтобы предотвратить произвольное увеличение предложения и риск инфляции в дальнейшем, токен был создан с фиксированным запасом в 25 миллионов, и до сих пор чеканка не проводилась.",
                    "why_mint_note": "Технически полномочия по чеканке монет остаются открытыми, потому что, если TASTE позже интегрируется с ресторанами, отелями и сетями для создания системы скидочных купонов, сообществу может потребоваться корректировка предложения для развития экосистемы. Эта возможность не была закрыта заранее — однако команда не может использовать эту силу в одиночку.",
                    "dao_title": "🏛️ Увеличение предложения через DAO — как это работает?",
                    "dao_desc": "Если увеличение предложения станет на повестку дня в будущем, это решение может быть реализовано только посредством следующих шагов:",
                    "dao_steps": [
                        "🗳️ Открыто голосование сообщества DAO",
                        "📣 Проведена прозрачная информационная кампания для общественности",
                        "✅ Требуется одобрение большинства.",
                        "📋 Весь процесс записывается в сети"
                    ],
                    "lock_reason_title": "🔒 Почему было заблокировано так много токенов?",
                    "lock_reasons": [
                        {
                            "icon": "🐋",
                            "text": "Предотвратить китовую формулировку — Чтобы не дать кому-то захватить большую часть поставок и манипулировать ценой."
                        },
                        {
                            "icon": "📉",
                            "text": "Чтобы предотвратить внезапные действия по сбросу — Чтобы предотвратить выставление на продажу огромных количеств одновременно."
                        },
                        {
                            "icon": "🎭",
                            "text": "Чтобы предотвратить искусственный ажиотаж и манипулирование ценами. Для роста, ориентированного на реальное использование, а не на спекулятивную торговлю."
                        },
                        {
                            "icon": "🏗️",
                            "text": "Долгосрочная безопасность экосистемы. Построить устойчивую и здоровую экономику в Web3."
                        }
                    ],
                    "philosophy_title": "💎 ВКУС Философия",
                    "philosophy_text": "TASTE — это долгосрочное предприятие Web3, которое расстается с краткосрочными хайповыми проектами. Фиксированное предложение · Контролируемая ликвидность · Реальное использование · Планирование будущего на основе DAO",
                    "official_source": "— Официальный технический документ TASTE (tastetoken.net)",
                    "tonscan_view": "Посмотреть на Тонскане →",
                    "lock_prefix": "Замок",
                    "lp_lock_title": "💧 Блокировка токена LP (tinu-locker.ton)",
                    "lp_lock_status": "✅ Токен pTON-TASTE LP — 81,6% заблокировано",
                    "lp_lock_contract": "Контракт блокировки:tinu-locker.ton"
                },
                "general_info": {
                    "title": "Общая информация",
                    "content": "TASTE — это децентрализованная экосистема, разработанная на базе блокчейна TON и призванная интегрировать кулинарное искусство и гастрономию в мир Web3."
                },
                "vision": {
                    "title": "Зрение",
                    "content": "Построить глобальный мост, где кулинарное мастерство сочетается с цифровыми ценностями, расширяя возможности авторов и бизнеса за счет прозрачности."
                },
                "mission": {
                    "title": "Миссия",
                    "content": "Наша миссия — предоставить миру гастрономии инструменты для лояльности, отслеживания и роста с использованием технологии блокчейн."
                },
                "team": {
                    "title": "Команда",
                    "fatih": {
                        "name": "Фатих Эмон",
                        "role": "Основатель и визионер"
                    },
                    "angel": {
                        "name": "Ангел Вкуса",
                        "role": "Сообщество и экосистема"
                    }
                },
                "tokenomics": {
                    "title": "Токеномика",
                    "initial_supply": "Максимальный запас: 25 000 000 ВКУСОВ",
                    "summary_text": "Общий запас: 25 000 000 TASTE<br />🔒 88,4% Заблокировано (JVault) • 👥 2% Команда • 👑 2% Основатель<br />💧 6,4% Пул ликвидности (постепенный) • 🎁 0,2% Раздача • 💼 1% Операции/Награды",
                    "allocation": {
                        "team": "Команда (2%)",
                        "founder": "Основатель (2%)",
                        "liquidity": "Ликвидность (6,4%)",
                        "airdrop": "Аирдроп (0,2%)",
                        "ops": "Операции/Обмен (1%)"
                    }
                },
                "supply_policy": {
                    "title": "Политика поставок",
                    "content": "88,4% от общего объема профессионально заблокировано в JVault. Команда сохраняет 0%-ный контроль над заблокированными активами до даты выпуска."
                }
            },
            "charity": {
                "hero": {
                    "badge": "Любовь животных",
                    "title": "Поддержите бродячих",
                    "desc": "Вы можете пожертвовать <1> ТОННУ</1> или <2> ВКУС</2> на поддержку уличных и приютских животных едой, ветеринарной помощью и приютом. Каждая копейка касается жизни. 🐶🐱",
                    "stats": {
                        "247": "24/7 Открыто",
                        "stray": "Бродячее животное",
                        "unlimited": "Безлимитный",
                        "channel": "Канал пожертвований",
                        "transparency": "Прозрачность"
                    }
                },
                "wallet": {
                    "title": "Кошелек для пожертвований",
                    "copy_ton": "Копировать адрес (TON)",
                    "copy_taste": "Копировать адрес (ВКУС)",
                    "copied": "Скопировано"
                },
                "ton_donate": {
                    "title": "Пожертвовать в TON",
                    "placeholder": "Сумма (ТОНН)",
                    "donate_btn": "Пожертвовать {{amount}} TON",
                    "connect_btn": "Подключите кошелек и сделайте пожертвование",
                    "sending": "Отправка...",
                    "success": "Пожертвование отправлено! Спасибо 🐾",
                    "error": "Транзакция отменена.",
                    "footer": "Чтобы отправить TASTE, скопируйте адрес и отправьте его вручную из своего кошелька."
                },
                "taste_info": {
                    "title": "Пожертвовать во ВКУСЕ",
                    "desc": "Адрес кошелька, указанный выше, также принимает TASTE. Вы можете отправить любое количество TASTE с помощью Tonkeeper, TonWallet или STON.fi."
                },
                "gallery": {
                    "badge": "Учитывая СПИД",
                    "title": "Доказательства и документы",
                    "records": "записи",
                    "empty_title": "Доказательства пока не добавлены",
                    "empty_desc": "Здесь будут опубликованы фотографии и документы предоставленных вспомогательных средств. Мы остаемся прозрачными! ✅",
                    "close": "Закрывать"
                }
            },
            "legal": {
                "header": {
                    "badge": "Юридические документы",
                    "title": "Юридическая информация",
                    "subtitle": "Примененные положения и условия",
                    "warning": "⚠️ Это приложение <1>не содержит советов по инвестированию.</1> Криптоактивы несут высокий риск."
                },
                "nav": {
                    "disclaimer": {
                        "label": "Отказ от ответственности",
                        "sub": "Официальное уведомление"
                    },
                    "terms": {
                        "label": "Условия эксплуатации",
                        "sub": "Политика использования"
                    },
                    "privacy": {
                        "label": "политика конфиденциальности",
                        "sub": "Защита данных"
                    },
                    "risk": {
                        "label": "Раскрытие рисков",
                        "sub": "Финансовые риски"
                    }
                },
                "footer": {
                    "last_updated": "Последнее обновление: март 2025 г. · Токен TASTE © 2025",
                    "network": "Построено на открытой сети"
                },
                "doc_info": "Последнее обновление: март 2025 г. | Этот документ подготовлен на турецком и английском языках.",
                "disclaimer": {
                    "section1": {
                        "title": "🚫 Не инвестиционный совет",
                        "sub": "Отказ от ответственности",
                        "text": "Ничто в этом приложении, включая информацию о ценах, графики, анализ, прогнозы или любые заявления, не может быть истолковано как инвестиционный совет, финансовые рекомендации или предложение о покупке или продаже.",
                        "eng_note": "Далее следует турецкий. <1>Английский — основной юридический язык.</1>"
                    },
                    "section2": {
                        "title": "⚖️ Ограничение ответственности",
                        "sub": "Правовые ограничения",
                        "text": "Команда TASTE Token не несет юридической ответственности за любые решения, принятые на основании этого заявления, включая прямые или косвенные финансовые потери.",
                        "eng_note": "Далее следует турецкий. <1>Английский — основной юридический язык.</1>"
                    },
                    "section3": {
                        "title": "🌍 Соответствие нормативным требованиям",
                        "sub": "Юридическое соответствие",
                        "text": "Покупка или продажа криптовалюты может быть ограничена в вашей стране. Пользователь принимает на себя полную ответственность за действия в соответствии с местным законодательством.",
                        "eng_note": "Далее следует турецкий. <1>Английский — основной юридический язык.</1>"
                    }
                },
                "terms": {
                    "intro": "Используя это приложение, вы соглашаетесь со следующими условиями.",
                    "section1": {
                        "title": "📌 Общие условия",
                        "sub": "Использование",
                        "text": "Это приложение предназначено только для информации. Пользователи несут ответственность за свои токены."
                    },
                    "section2": {
                        "title": "🔄 Условия токена",
                        "sub": "Менять",
                        "text": "Транзакции на STON.fi или других DEX осуществляются по усмотрению пользователя."
                    },
                    "section3": {
                        "title": "🚫 Запрещенное использование",
                        "sub": "Запрещенный",
                        "text": "Отмывание денег или незаконные финансовые операции строго запрещены."
                    },
                    "section4": {
                        "title": "🗣️ Политика сообщества (UGC)",
                        "sub": "Содержание",
                        "text": "Пользовательские публикации (рецепты, фотографии) являются ответственностью пользователя. <1>Данные об аллергенах и калориях</1> предназначены только для информации. Абсолютная точность <2>не гарантируется</2>."
                    },
                    "section5": {
                        "title": "⚙️ Право на изменение",
                        "sub": "Обновления",
                        "text": "Мы оставляем за собой право обновлять эти условия без предварительного уведомления."
                    }
                },
                "privacy": {
                    "intro": "Ваша конфиденциальность важна для нас. Эта политика объясняет сбор данных.",
                    "section1": {
                        "title": "📊 Данные, которые мы собираем",
                        "sub": "Конфиденциальность",
                        "text": "Мы собираем <1>Информацию о пользователе Telegram</1> (идентификатор, имя) для профилей сообщества и <1>Данные сообщества</1>, которыми вы делитесь в ленте.",
                        "note": "Обязательство: <1>Личные данные НИКОГДА не продаются.</1>"
                    },
                    "section2": {
                        "title": "🔗 Сторонние",
                        "sub": "Интеграции",
                        "text": "Интеграция с <1>TON Blockchain</1> и <1>STON.fi</1> регулируется их собственными политиками."
                    },
                    "section3": {
                        "title": "🗑️ Удаление данных",
                        "sub": "Очистить",
                        "text": "Очистка кэша удаляет локальные настройки. Записи блокчейна являются постоянными."
                    },
                    "section4": {
                        "title": "📩 Контакты",
                        "sub": "Поддерживать",
                        "text": "Если у вас возникнут вопросы о конфиденциальности, свяжитесь с нами через наш канал Telegram."
                    }
                },
                "risk": {
                    "intro_title": "⛔ Предупреждение о высоком риске",
                    "intro_text": "Криптоактивы очень волатильны. Вы можете <1>потерять все свои инвестиции.</1>",
                    "section1": {
                        "title": "📉 Рыночный риск",
                        "sub": "Волатильность",
                        "text": "Значение ВКУСА может мгновенно упасть до нуля. Прошлые результаты не являются гарантией."
                    },
                    "section2": {
                        "title": "💧 Риск ликвидности",
                        "sub": "Торговля",
                        "text": "Продать ВКУС по желаемой цене не всегда возможно."
                    },
                    "section3": {
                        "title": "🔧Технический риск",
                        "sub": "Сеть",
                        "text": "Проблемы с сетью блокчейн или уязвимости <1>Смарт-контракта</1> несут в себе внутренние риски."
                    },
                    "section4": {
                        "title": "⚖️ Регуляторный риск",
                        "sub": "Политика",
                        "text": "Законы меняются. Пользователь принимает на себя риск будущих юридических ограничений."
                    },
                    "section5": {
                        "title": "💡 Рекомендуемый подход",
                        "sub": "Безопасность",
                        "text": "Инвестируйте только то, что можете потерять. ДЬОР."
                    }
                }
            },
            "community": {
                "nav_title": "Сообщество",
                "title": "Пищевой корм",
                "share": "Делиться",
                "stats": {
                    "posts": "Сообщения",
                    "likes": "Нравится",
                    "allergens": "Теги аллергенов"
                },
                "search_ph": "Поиск еды, рецепта или места...",
                "filters": {
                    "all": "Все",
                    "food": "Еда",
                    "recipe": "Рецепт",
                    "menu": "Меню",
                    "career": "Карьера / Работа"
                },
                "trending": "Больше всего понравилось",
                "loading": "Загрузка сообщений...",
                "no_results": "Результаты не найдены",
                "no_posts_title": "Пока нет сообщений",
                "no_posts_desc": "Будьте первым, кто поделитесь чем-нибудь!",
                "detail": "Подробности →",
                "create_title": "Новое сообщение",
                "venue_ph": "Название места проведения",
                "city_ph": "Город",
                "recipe_ph": "Название рецепта",
                "ph_food": "Что ты ел сегодня? Как это было?",
                "ph_recipe": "Коротко о рецепте...",
                "ph_menu": "Что вы думаете о месте проведения?",
                "calories_ph": "Калории (например, ~450 ккал)",
                "mark_allergens": "Марк Аллергены",
                "ingredients_title": "🥄 Ингредиенты",
                "ing_ph": "Ингредиент",
                "amt_ph": "Количество",
                "add_ing": "+ Добавить ингредиент",
                "steps_title": "📋 Этапы подготовки",
                "step_ph": "Шаг {{n}}...",
                "add_step": "+ Добавить шаг",
                "tags_title": "Теги",
                "add_photo": "📷 Добавить фото (необязательно)",
                "sharing": "⏳ Делюсь...",
                "share_btn": "🚀 Поделиться",
                "allergen_warning": "Предупреждение об аллергенах",
                "directions": "Направления",
                "close": "Закрывать",
                "shared_from": "Источник: TASTE MiniApp 🍳",
                "just_now": "прямо сейчас",
                "min_ago": "{{n}} минуту назад",
                "hrs_ago": "{{n}} ч. назад",
                "days_ago": "{{n}} дней назад",
                "ingredients_count": "{{n}} ингредиентов · {{s}} шагов",
                "tags": {
                    "breakfast": "Завтрак",
                    "lunch": "Обед",
                    "dinner": "Ужин",
                    "snack": "Закуска",
                    "dessert": "Десерт",
                    "vegan": "Веган",
                    "vegetarian": "Вегетарианец",
                    "soup": "Суп",
                    "meat": "Мясные блюда",
                    "vegetables": "Овощи",
                    "traditional": "Традиционный",
                    "practical": "Практичный",
                    "healthy": "Здоровый",
                    "cafe": "Кафе",
                    "fastfood": "Быстрое питание",
                    "finedining": "Изысканная кухня",
                    "seafood": "Морепродукты",
                    "job_listing": "Список вакансий",
                    "job_seeking": "Ищу работу",
                    "chef": "Шеф-повар",
                    "cook": "Готовить",
                    "waiter": "Официант",
                    "master": "Владелец"
                },
                "allergens": {
                    "G": "Глютен",
                    "SÜ": "Молоко",
                    "Y": "Яйцо",
                    "B": "Рыба",
                    "KA": "Ракообразные",
                    "YF": "Арахис",
                    "S": "Соя",
                    "KM": "Орехи",
                    "H": "Горчица",
                    "SS": "Кунжут",
                    "SÜL": "сера",
                    "KE": "Сельдерей",
                    "AB": "Люпин",
                    "YU": "Моллюски"
                },
                "job_post": "ВАКАНСИЯ",
                "reward_wallet": "НАГРАДНЫЙ КОШЕЛЕК",
                "chat_poster": "Чат с плакатом",
                "alert_success_global": "Большой! Ваше сообщение было распространено по всему миру! 🚀",
                "alert_success": "Публикация опубликована! 🚀",
                "tab_feed": "Кормить",
                "tab_jobs": "Вакансии",
                "tab_chat": "Чат",
                "btn_share_win": "🚀 ПОДЕЛИТЕСЬ И ВЫИГРАЙТЕ 5 ВКУСОВ!",
                "no_posts": "Пока нет сообщений",
                "ph_chat": "Введите сообщение...",
                "ph_position": "Должность в ресторане",
                "ph_job_desc": "Напишите свое объявление о вакансии или ищите подробности здесь...",
                "lbl_wallet_reward": "Адрес кошелька для вознаграждения",
                "lbl_wallet_note": "* Не забудьте сделать снимок экрана и поделиться им в группе TG после публикации!"
            },
            "jobs": {
                "title": "Вкус работы",
                "subtitle": "Гастрономическая карьера и сообщество",
                "tabs": {
                    "feed": "Кормить",
                    "board": "Доска",
                    "reviews": "Отзывы",
                    "profiles": "Профили"
                },
                "types": {
                    "listing": "СПИСОК ВАКАНСИЙ",
                    "seeking": "ИЩУ РАБОТУ",
                    "today": "🔥СЕГОДНЯ"
                },
                "actions": {
                    "apply": "Применять",
                    "message": "Отправить сообщение",
                    "join_now": "Присоединяйтесь сейчас",
                    "add_job": "Добавить объявление",
                    "add_review": "Добавить отзыв",
                    "add_cv": "Добавить резюме",
                    "back": "Назад",
                    "cancel": "Отмена",
                    "submit": "Представлять на рассмотрение",
                    "publishing": "Издательский...",
                    "sending": "Отправка...",
                    "saving": "Сохранение...",
                    "submit_review": "⭐ Добавить отзыв (+5 ВКУС)",
                    "submit_cv": "💾 Опубликовать мое резюме",
                    "success_listing": "Объявление успешно опубликовано! 🎉",
                    "success_apply": "Заявка отправлена!",
                    "tg_redirect": "Перенаправление в Telegram..."
                },
                "placeholders": {
                    "title": "Должность (например, Опытный официант)",
                    "desc": "Подробности (опыт, часы и т.д.)",
                    "city": "Выберите город",
                    "salary": "Заработная плата (например, 25 тысяч турецких лир)",
                    "why_join": "Почему вы хотите присоединиться?",
                    "apply_msg": "Напишите сообщение о заявке...",
                    "city_opt": "Выберите город",
                    "profession": "Выберите профессию",
                    "business_name": "Название компании (например, ресторан XYZ)",
                    "review_msg": "Напишите свой отзыв... (условия работы, руководство и т.д.)",
                    "experience": "Опыт работы (например, 5 лет на кухне отеля)",
                    "bio": "Расскажи о себе..."
                },
                "reviews": {
                    "title": "Обзоры бизнеса",
                    "tip": "Пересмотрите свое рабочее место. Помогите сообществу! Заработайте <1>+5 ВКУС</1>.",
                    "business_ph": "Название компании",
                    "overall": "ОБЩАЯ ОЦЕНКА",
                    "salary": "Зарплата",
                    "env": "Конв.",
                    "mgmt": "Управление",
                    "comment_ph": "Ваш комментарий...",
                    "success": "Отзыв опубликован! +5 ВКУС выиграл 🎉"
                },
                "profiles": {
                    "title": "Профили и резюме",
                    "add_btn": "+ Добавить резюме",
                    "profession_ph": "Выберите профессию",
                    "exp_ph": "Опыт работы (например, 5 лет)",
                    "bio_ph": "Краткая биография...",
                    "photo_label": "Фото профиля",
                    "photo_btn": "Выберите фотографию из галереи",
                    "skills_label": "Навыки",
                    "success": "Резюме опубликовано! Вас видят другие 🎉",
                    "empty": "Профилей пока нет. Будь первым!"
                },
                "feed": {
                    "title": "Кухонная подача",
                    "new_post": "Новое сообщение",
                    "success_post": "Пост опубликован! Поделитесь скриншотом с TG Group → +5 ВКУС! 🎉",
                    "types": {
                        "food": "Еда",
                        "recipe": "Рецепт",
                        "menu": "Меню"
                    },
                    "placeholders": {
                        "food": "Расскажите о своем блюде...",
                        "recipe": "Поделитесь своим рецептом...",
                        "menu": "Опишите свое меню..."
                    }
                }
            },
            "tastepay": {
                "title": "Быстрая и простая оплата",
                "desc": "Платите или получайте оплату за считанные секунды с помощью TASTE — в любой точке мира.",
                "receive": "Создать счет",
                "scan": "Оплатить с помощью QR",
                "scan_desc": "Режим клиента · Сканируйте код при оформлении заказа, чтобы оплатить",
                "receive_btn": "Получить оплату",
                "receive_desc": "Бизнес-режим · Создайте QR-код для оплаты клиентами.",
                "wallet_connected": "✓ Кошелек подключен",
                "wallet_required": "Для оплаты необходимо подключить кошелек",
                "receive_amount_title": "Сумма к получению",
                "cam_denied": "Camera permission denied. Please allow in settings.",
                "cam_not_found": "Камера не найдена.",
                "cam_failed": "Не удалось открыть камеру:",
                "scan_qr_text": "Для оплаты отсканируйте QR-код на кассе.",
                "retry_cam": "Повторить попытку камеры",
                "native_cam": "Родная камера",
                "invoice_no": "Номер счета:",
                "live_rate": "Текущая ставка: 1 ВКУС ≈",
                "to_receive": "Чтобы получить",
                "enter_amount": "Введите сумму",
                "err_wallet": "Пожалуйста, сначала подключите свой кошелек",
                "err_amount": "Неверная сумма",
                "err_balance": "Недостаточный ВКУСОВОЙ баланс! Обязательно: {{req}}, Доступно: {{avail}}",
                "err_fee": "Для комиссии за транзакцию требуется не менее 0,2 TON.",
                "confirm_title": "Резюме и подтверждение",
                "recipient": "Кошелек получателя",
                "amount": "Количество",
                "rate": "Ставка (фиксированная)",
                "to_pay": "ВКУС, чтобы заплатить",
                "fee": "Сетевая плата",
                "btn_confirm": "Подтвердить и оплатить",
                "btn_processing": "Обработка...",
                "success_title": "Платеж отправлен!",
                "success_desc": "Транзакция отправлена ​​в блокчейн. Это будет подтверждено через несколько секунд.",
                "view_explorer": "Посмотреть на Тонвьюере",
                "back_menu": "Вернуться в меню",
                "fail_title": "Платеж не выполнен",
                "retry": "Повторить попытку",
                "cancel": "Отмена"
            },
            "chef": {
                "title": "Вкус шеф-повара",
                "subtitle": "Цифровая лояльность и скидки",
                "safe_title": "ГЛАВНЫЙ СЕЙФ СООБЩЕСТВА",
                "fill_safe": "ЗАПОЛНИТЕ БЕЗОПАСНО",
                "discount_right": "СКИДКА ПРАВА",
                "min_hold_warning": "Чтобы воспользоваться скидками, у вас должно быть не менее 2000 TASTE.",
                "next_level": "Следующий уровень:",
                "units_needed": "нужны еще единицы",
                "connect_warning": "Подключите кошелек, чтобы использовать скидку.",
                "get_discount": "ПОЛУЧИТЬ СКИДКУ НА КАССЕ",
                "success_title": "Транзакция успешна!",
                "success_desc": "Скидка одобрена. Покажите это персоналу.",
                "mastery_levels": "Уровни мастерства и преимущества",
                "nearby_venues": "Рестораны-партнеры (поблизости)",
                "nearby_branch": "Ближайший к вам филиал",
                "nav_tip": "* Наша навигация автоматически сканирует подходящие для ВКУСА места в вашем районе.",
                "legal_title": "Юридические требования и правила",
                "legal_points": [
                    "Эта система предназначена только для целей лояльности. Он не содержит инвестиционных советов или финансовых инструментов.",
                    "Права на скидку определяются автоматически в зависимости от вашего статуса владения в вашем кошельке.",
                    "Плата, отправляемая во время процесса, представляет собой плату за использование системы и проверку.",
                    "ВКУС – ЭТО НЕ СПОСОБ ОПЛАТЫ. Криптовалютные платежи не принимаются. Счет оплачивается в местной валюте.",
                    "Возрастное ограничение 18+ является обязательным. Пользователь несет ответственность за ложные утверждения."
                ],
                "tiers": {
                    "bronze": "Ученик",
                    "silver": "Подмастерье",
                    "gold": "Владелец",
                    "diamond": "Шеф-повар"
                }
            },
            "team": {
                "title": "Члены команды проекта",
                "subtitle": "Дальновидные умы создают экосистему TASTE",
                "contact": "Контакт",
                "roles": {
                    "founder": "Основатель / Стратегия и видение",
                    "lead_dev": "Ведущий разработчик/архитектор",
                    "marketing": "Директор по маркетингу / Развитие бренда",
                    "community": "Менеджер сообщества и медиа",
                    "little_queen": "Менеджер сообщества",
                    "legend_love": "Менеджер сообщества и медиа",
                    "fatih_kaya": "Финансовый координатор"
                },
                "bios": {
                    "founder": "Визионер проекта TASTE. Построение моста между гастрономией и блокчейном.",
                    "lead_dev": "Мастер кода и архитектуры. Превращение концепции TASTE в масштабируемую и безопасную цифровую реальность.",
                    "marketing": "Стратегический подход, расширяющий глобальное присутствие TASTE. Соединяя кулинарный мир с помощью Web3.",
                    "community": "Модератор, эксперт по социальным сетям и рекламодатель. Также организатор конкурсов и создатель сообщества.",
                    "little_queen": "Сосредоточено на росте сообщества, взаимодействии в социальных сетях и поддержке сторонников TASTE.",
                    "legend_love": "Модератор, эксперт по социальным сетям и рекламодатель. Также организатор конкурсов и создатель сообщества.",
                    "fatih_kaya": "Основатель, планировщик, гид. Тот, кто принимает, берется и пытается реализовать проект ВКУС. Обеспечивает финансовую поддержку кухонных бригад."
                }
            }
        }
    },
    "ar": {
        "translation": {
            "app": {
                "title": "ذوق",
                "description": "الأصول الرقمية الخدمية الموجهة نحو فن الطهي والتعليم",
                "my_balance": "رصيدي",
                "connect_wallet_first": "يرجى ربط المحفظة",
                "tap_to_earn": "انقر لتكسب",
                "no_energy": "لا توجد طاقة",
                "invite_friend": "دعوة صديق",
                "share_link": "مشاركة الرابط",
                "invite_gain": "دعونا ننمي المجتمع معاً",
                "buy_title": "Erken Erişim — شراء TASTE",
                "buy_with": "احصل عليه باستخدام TON",
                "you_get": "سوف تحصل على",
                "swap_opening": "فتح التداول على STON.fi...",
                "holders": "أصحاب",
                "invite_desc": "تنمية المجتمع معًا",
                "referral_message": "انضم إلى TASTE وابدأ في كسب مكافآت نظام TON البيئي! 🍳",
                "transaction_failed": "فشلت المعاملة أو تم إلغاؤها. ❌",
                "early_access_ending": "🚀 الوصول المبكر إلى المستوى 1 وينتهي في:",
                "reward_end": "🎁 ينتهي توزيع المكافأة – 20 مايو 2026",
                "units": {
                    "day": "أيام",
                    "hr": "ساعة",
                    "min": "دقيقة",
                    "sec": "ثانية",
                    "holder": "أصحاب",
                    "supply": "إجمالي العرض",
                    "locked": "مغلق"
                },
                "faq": {
                    "title": "❓ الأسئلة المتداولة",
                    "what_is": "ما هو الذوق؟",
                    "what_is_ans": "TASTE هو أصل ولاء رقمي يركز على فن الطهو والتعليم ومبني على سلسلة TON blockchain. ويستهدف الاستخدام الفعلي في المطاعم والفنادق وصناعة الأغذية والمشروبات.",
                    "how_to": "كيفية الشراء؟",
                    "how_to_ans": "1. قم بتحميل TON في محفظة TON الخاصة بك (Tonkeeper, @wallet).<br />2. حدد المبلغ المطلوب من اللوحة أعلاه.<br />3. انقر فوق \"شراء باستخدام TON\" وقم بالمبادلة عبر STON.fi."
                },
                "tap_for_info": "انقر للحصول على معلومات",
                "quick_links": "روابط سريعة",
                "project_assistant": "مساعد المشروع",
                "quick_wallet": "المحفظة والتحويل السريع",
                "chef_status": "حالة الشيف الرقمية",
                "gastronomy_career": "مهنة فن الطهو والمجتمع",
                "web3_partners": "ويب 3 والشركاء",
                "joint_projects": "المشاريع المشتركة",
                "lang": "لانج",
                "banner_title": "الذوق سوف يذهب إلى المستقبل!",
                "banner_desc": "الذوق هو النجم الساطع للغد. اشتري TASTE الآن وخذ مكانك في هذه الرحلة المذهلة!",
                "banner_buy": "شراء الذوق"
            },
            "nav": {
                "home": "الرئيسية",
                "roadmap": "خارطة الطريق",
                "whitepaper": "الورقة البيضاء",
                "litepaper": "الورقة المبسطة",
                "community": "منشورات الطعام",
                "spin": "عجلة الحظ",
                "charity": "منصة التبرعات",
                "legal": "معلومات قانونية",
                "leaderboard": "الترتيب",
                "play": "العب",
                "wallet": "المحفظة",
                "chef": "شيف Taste",
                "discover": "يكتشف",
                "install": "ثَبَّتَ",
                "partners": "الشركاء",
                "vote": "مكاننا في Web3",
                "socials": "وسائل التواصل الاجتماعي",
                "team": "فريق",
                "faq": "التعليمات.",
                "tech": "التكنولوجيا",
                "settings": "إعدادات",
                "menu": "قائمة طعام"
            },
            "home": {
                "live_badge": "النشاط المباشر",
                "live_title": "📡 نشاط التذوق"
            },
            "market": {
                "live_chart": "تحليل السوق المباشر"
            },
            "roadmap": {
                "title": "خارطة الطريق 2026",
                "philosophy_title": "فلسفة الذوق",
                "philosophy": [
                    "🎯 التذوق لا يحدد ما لا يمكنه فعله.",
                    "✅ إنها ترسم خرائط الطريق لما فعلته - وهو أمر مثبت وحقيقي.",
                    "🤝 لا يقدم وعودًا لا يستطيع الوفاء بها. ولهذا السبب يثق الناس بنا.",
                    "📌كل خطوة شفافة، والوفاء بكل التزام."
                ],
                "completed_goals": "الربع الأول من عام 2026 — الأهداف المكتملة",
                "ongoing": "مستمر",
                "footer_text": "إن خارطة الطريق هذه عبارة عن وثيقة حية، إذ تتم إضافة المهام المكتملة، ولا تتم إضافة المهام غير الموعودة.",
                "footer_bold": "الطعم يبني الثقة، ولا يبيع الأحلام.",
                "items": {
                    "mint": {
                        "title": "نشأة الأصول وإطلاقها",
                        "desc": "تم إنشاء أصول TASTE على blockchain TON وبدأ التداول على STON.fi."
                    },
                    "lp": {
                        "title": "مجمع السيولة",
                        "desc": "تم إنشاء وتفعيل مجمع السيولة TON/TASTE على STON.fi."
                    },
                    "lock": {
                        "title": "قفل الأصول وLP",
                        "desc": "88.4% من إجمالي العرض مقفل في JVault بثلاثة أقفال منفصلة. بالإضافة إلى ذلك، فإن 81.6% من وحدات STON.fi pTON-TASTE LP مقفلة باستخدام tinu-locker.ton. يمكن التحقق من كلا القفلين بشكل علني على blockchain."
                    },
                    "security": {
                        "title": "المسح الأمني",
                        "desc": "لقد اجتاز العقد الذكي تدقيقًا أمنيًا."
                    },
                    "miniapp": {
                        "title": "تطبيق تيليجرام ميني",
                        "desc": "تم إطلاق تطبيق صغير كامل المواصفات يعمل على Telegram."
                    },
                    "airdrop": {
                        "title": "الإنزال الجوي والمكافآت",
                        "desc": "تم تنفيذ TASTE airdrop لـ 521 محفظة وينمو كل يوم. نظام مكافأة عجلة الغزل نشط."
                    },
                    "documents": {
                        "title": "الورقة البيضاء والورقة الورقية",
                        "desc": "تم نشر وثائق فنية شاملة وإصدارات خفيفة تشرح المشروع."
                    },
                    "social": {
                        "title": "تواجد وسائل التواصل الاجتماعي",
                        "desc": "تم إنشاء قناة Telegram (@taste2025)، ومجموعة المجتمع، وقناة WhatsApp، وTwitter/X (@taste_token)، وInstagram (@taste_ton_taste)، وTikTok (@taste_ton)، وFacebook، والموقع الرسمي (tastetoken.net). نشط على جميع المنصات."
                    },
                    "stray": {
                        "title": "منصة التبرع بالحيوانات الضالة",
                        "desc": "تمت إضافة منصة حيث يمكن التبرع لملاجئ الحيوانات باستخدام TON وTASTE."
                    },
                    "food_sharing": {
                        "title": "منصة مشاركة الطعام اليومية",
                        "desc": "يمكن للمستخدمين مشاركة الوصفات والطعام والأماكن. في الوقت الحقيقي (مع Supabase)."
                    },
                    "wallets": {
                        "title": "وصلت إلى 521 محفظة",
                        "desc": "تم تجاوز هدف الربع الأول بـ 521 مالك محفظة فريدة. يستمر المجتمع في النمو."
                    },
                    "allergen": {
                        "title": "نظام الإخطار بالحساسية الغذائية",
                        "desc": "تم دمج المواد المسببة للحساسية الـ 14 الإلزامية في التشريعات الغذائية للاتحاد الأوروبي وتركيا (الغلوتين والحليب والبيض والأسماك وما إلى ذلك) في الأعلاف الغذائية. يمكن إضافة علامات الحساسية إلى كل مشاركة، ويتم عرض معلومات السعرات الحرارية."
                    },
                    "v2": {
                        "title": "تحديث الإصدار الثاني من التطبيق المصغر — مارس 2026",
                        "desc": "تم تجديد قسم PoweredBy بشعارات SVG (OKX، Bitget، Binance، Telegram، Google، Gemini). تمت إضافة بطاقة ملخص TASTE إلى المستند التقني. تمت إضافة مؤقت انتهاء توزيع المكافأة (20 مايو 2026). الإعجابات والبحث والأطعمة الشائعة التي يتم جلبها إلى Food Feed."
                    },
                    "v2_1": {
                        "title": "إعادة تصميم الإصدار 2.1 من التطبيق المصغر — مارس 2026",
                        "desc": "إصلاح شامل لواجهة المستخدم وتجربة المستخدم المميزة. تم تنفيذ درج قائمة \"استكشاف\" الجديد. تمت إضافة قسم الأسئلة الشائعة. تمت ترقية محرك الذكاء الاصطناعي إلى Llama 3.3 70B عبر Groq. تمت مزامنة ألوان سمة Telegram العالمية لإضفاء طابع متميز."
                    },
                    "v2_2": {
                        "title": "المحتوى والامتثال للإصدار 2.2 من التطبيق المصغر — مارس 2026",
                        "desc": "تم نشر بيان TASTE يشرح روح المشروع. دعم التدويل الكامل (i18n) للغتين الإنجليزية والتركية. تم تنفيذ الإطار القانوني الشامل (الشروط والخصوصية والكشف عن المخاطر) ونموذج إخلاء المسؤولية لأول مرة من أجل سلامة المستخدم."
                    },
                    "v2_3": {
                        "title": "تحديث Mini App v2.3 Wallet وQR - مارس 2026",
                        "desc": "تم إطلاق نظام المحفظة والتحويل السريع. يمكن للمستخدمين الآن عرض أرصدة TON & TASTE، ومسح رموز QR ضوئيًا للمدفوعات الفورية، وإرسال كل من رموز TON وTASTE بشكل آمن مع رسوم الغاز المحسنة."
                    },
                    "v2_4": {
                        "title": "التطبيق المصغر v2.4 طعم الشيف",
                        "desc": "نظام الولاء والخصم الرقمي. مستويات التدريب المهني إلى حالة Master Chef. رسم رمزي للتحقق من صحة الخصم لدى الصرافين."
                    },
                    "v2_5": {
                        "title": "التطبيق المصغر الإصدار 2.5 من المجتمع 3.0 — مارس 2026",
                        "desc": "تم إطلاق الأعلاف الغذائية العالمية ولوحة الوظائف في الوقت الفعلي مع Supabase. التكامل المباشر مع Telegram للاتصال الفوري بملصقات الوظائف. حملات \"شارك واربح\" نشطة مع إمكانية رؤية محفظة المكافآت. الدردشة الحية العالمية نشطة."
                    },
                    "v2_6": {
                        "title": "Mini App v2.6 نظام المحفظة والتحويل — مارس 2026",
                        "desc": "مكون Wallet متكامل تمامًا مع علامات تبويب الإرسال والاستقبال والشراء والبيع المدعومة بروابط STON.fi العميقة."
                    },
                    "growth": {
                        "title": "نمو المجتمع",
                        "desc": "كل يوم مستخدمين جدد، كل يوم مشاركات جديدة. التركيز على النمو العضوي."
                    },
                    "visibility": {
                        "title": "رؤية أكبر لـ DEX",
                        "desc": "التواجد في منصات النظام البيئي TON الأخرى جنبًا إلى جنب مع STON.fi."
                    },
                    "partners": {
                        "title": "الشراكات الاستراتيجية",
                        "desc": "بناء تحالفات مع الشركات المحلية والمنصات والعلامات التجارية لفن الطهي."
                    },
                    "listings": {
                        "title": "قوائم CEX / DEX",
                        "desc": "زيادة حجم التداول عبر مختلف البورصات اللامركزية والمركزية."
                    },
                    "reporting": {
                        "title": "تقارير شفافة",
                        "desc": "سيتم مشاركة عدد المالكين وحجم المعاملات ونمو المجتمع بانتظام."
                    },
                    "dev": {
                        "title": "تطوير التطبيقات المصغرة",
                        "desc": "تتم إضافة ميزات جديدة بناءً على تعليقات المستخدمين."
                    }
                },
                "spin": {
                    "ton_balance": "رصيد طن",
                    "ton_target": "الهدف: 5 طن",
                    "ton_claim_ready": "🎉 مكافأة طن جاهزة!",
                    "ton_left": "{{n}} طن متبقي",
                    "win_ton": "🎉 {{n}} فاز بالطن!",
                    "reward_claim_ton": "🎉 المطالبة بمكافأة الطن",
                    "accumulated_ton": "مرحبًا! لقد تراكمت 5 طن.",
                    "won_ton_msg": "🏆 لقد فزت كثيرًا على عجلة القيادة!",
                    "ton_win_bonus": "🎉 {{n}} مكافأة إضافية!",
                    "ton_important": "يتم الدفع عند حد أدنى قدره 5 طن."
                }
            },
            "manifesto": {
                "title": "بيان الذوق",
                "subtitle": "قصة النار • طريق الإتقان",
                "section1": {
                    "title": "🌅 بداية النار",
                    "p1": "عندما أشعلت النار لأول مرة في العالم الرقمي... لم يكن أحد يعلم أنها ستكون مطبخًا.",
                    "quote": "بدأ كل شيء بشرارة. يد خفية.. وصفة غير مرئية.. والإنسانية تتعلم السيطرة على النار اللامركزية لأول مرة..",
                    "p2": "من أشعل هذه النار لم يكن اسماً... لم يكن هوية... فكرة... ثورة... <highlight>صحوة</highlight>.",
                    "p3": "لقد أشعل النار للتو. قام بإعداد الموقد. لقد ترك الوصفة. وبعد ذلك... غادر المطبخ."
                },
                "section2": {
                    "title": "⚠️ النار لم تكن كافية",
                    "p1": "لكن النار وحدها لم تكن كافية. النار يمكن أن تحرق... لكن <highlight>الطهي يتطلب إتقان</highlight>.",
                    "p2": "مع مرور الوقت، امتلأ العالم الرقمي. تم افتتاح آلاف المطابخ. لافتات متوهجة.. قاعات صاخبة.. وصفات سريعة..",
                    "quote": "لكن معظمهم افتقر إلى هذا: لا عمل. لا صبر. لا روح. كان هناك نار...ولكن بلا نكهة."
                },
                "section3": {
                    "title": "🍳 ولادة الذوق",
                    "p1": "وفي تلك اللحظة بالذات... ظهرت حاجة أخرى.",
                    "p2": "شخص ما لا يريد فقط استخدام النار. لقد أرادوا <highlight>فهم</highlight> ذلك. لقد أرادوا <highlight>معالجته</highlight>. لقد أرادوا <highlight>تحويله إلى إتقان</highlight>.",
                    "quote": "وتم إنشاء مطبخ . هادئ. بسيط. ولكن واعية. الإسم: طعم"
                },
                "section4": {
                    "title": "🚪 دخول المطبخ",
                    "box": "أشعل الموقد. هل تسمعه؟ هذا ليس مجرد صوت اللهب. هذا هو <highlight>صوت التحول</highlight>.",
                    "p1": "عندما تحول المعدن إلى رقمي، ولدت القيمة... لكن المعنى لم يولد. <highlight>تم إنشاء TASTE لطهي المعنى.</highlight>",
                    "p2": "عندما تدخل من الباب تشعر بهذا:",
                    "quote": "لا شيء يتم بسرعة هنا. لا شيء يتم عبثا هنا. لا شيء موجود فقط ليتواجد هنا.",
                    "p3": "كل مادة لها سبب. كل وصفة لها تاريخ. كل سيد لديه علامات الحروق."
                },
                "section5": {
                    "title": "⏳ نضوج القيمة الحقيقية",
                    "quote": "لأن القيمة الحقيقية لا يتم إنتاجها... إنها تنضج. وينتظر على النار. يأخذ شكله مع مرور الوقت. ويتعمق بالصبر."
                },
                "section6": {
                    "title": "🎯 إذن لماذا نحن موجودون؟",
                    "p1": "ليس فقط للتداول. وليس فقط للشراء والبيع. ليس على الإطلاق فقط لنرى.",
                    "box": [
                        "نحن موجودون <highlight>لإنتاج القيمة</highlight>.",
                        "نحن موجودون <highlight>لمشاركة المعرفة</highlight>.",
                        "نحن موجودون من أجل <highlight>تنمية الإتقان</highlight>.",
                        "نحن موجودون لجلب <highlight>المعنى</highlight> إلى العالم الرقمي."
                    ],
                    "quote": "نحن في جانب العمق... وليس في جانب السرعة. نحن في جانب الإتقان... وليس في جانب الضجيج. نحن في جانب الإنتاج... وليس في جانب الاستهلاك."
                },
                "section7": {
                    "title": "💎الذوق ليس اتجاهًا",
                    "p1": "اليوم، يتم تداول عدد لا يحصى من الأصول في العالم الرقمي. بعضها موجود فقط ليتم رؤيته. بعضها موجود فقط ليتم بيعه. البعض يولد لكي يُنسى.",
                    "quote": "لكن بعض الأشياء... تولد من الضرورة.",
                    "p2": "<highlight>TASTE</highlight> ليس اتجاهًا. ليست نسخة. ليس ضجيجا.",
                    "p3": "تم إنشاء هذا المطبخ لملء الفراغ. حيث لا يقوم الأشخاص بالمعاملات فقط... <highlight>الإنتاج... التعلم... التحويل والتطوير...</highlight> ليكونوا نظامًا."
                },
                "section8": {
                    "title": "🛤️ طريقنا",
                    "paths": [
                        {
                            "icon": "📚",
                            "text": "تدريب المتدربين"
                        },
                        {
                            "icon": "👨‍🍳",
                            "text": "سادة التدريب"
                        },
                        {
                            "icon": "🧠",
                            "text": "تزايد الوعي"
                        },
                        {
                            "icon": "💰",
                            "text": "تعميق القيمة"
                        },
                        {
                            "icon": "🔥",
                            "text": "تزايد النار"
                        },
                        {
                            "icon": "🍽️",
                            "text": "زيادة النكهة"
                        }
                    ],
                    "quote": "إذن إلى أين يتجه هذا المسار؟ وليس إلى مكان ينتهي. إلى مكان ينمو. هذه ليست وجهة... بل هي <highlight>طريق الإتقان</highlight>.",
                    "p1": "الأساتذة الحقيقيون يعرفون: <highlight>أفضل وصفة هي تلك التي لم تُكتب بعد.</highlight>"
                },
                "section9": {
                    "title": "والآن…",
                    "p1": "الموقد قيد التشغيل. الأواني جاهزة. الوصفة تنتظر أن تكتب. الوقت يتدفق.",
                    "box": "هذه ليست قصة. هذه ليست استعارة. هذا ليس حلما على الإطلاق. هذا... <highlight>تطور لا مفر منه</highlight>.",
                    "p2": "تم إشعال النار. تم إنشاء النظام. لكن النكهة لا تزال تنضج.",
                    "footer_q": "السؤال ليس: \"هل الذوق موجود؟\"",
                    "footer_a": "هل أنت مستعد لأخذ مكانك في هذا المطبخ؟ 🍽️"
                }
            },
            "whitepaper": {
                "title": "ورقة بيضاء",
                "pitch": {
                    "title": "لماذا التذوق؟",
                    "text1": "العالم يتغير بسرعة. مع اقتراب عصر النقود الورقية من نهايته ببطء، يأخذ الاقتصاد الرقمي مكانه.\n\nفماذا يفعل TASTE في هذا النظام الجديد؟",
                    "text2": "TASTE ليست مجرد عملة مشفرة (رمز مميز) - فهي تقوم ببناء نظام بيئي ضخم مع فائدة حقيقية وراءه. ستتمكن الآن من الدفع مباشرةً باستخدام TASTE في الشركات الشريكة، والاستمتاع بخصومات وامتيازات <highlight>الحصرية لحامل TASTE</highlight> أثناء الدفع. 🛍️🤝",
                    "text3": "هذا هو المكان الذي يظهر فيه الاختلاف الأكبر الذي يفصل TASTE عن عشرات الآلاف من المشاريع الأخرى:",
                    "text4": "<highlight>ليس مجرد استثمار مضارب، بل استخدام واقعي + ميزة فورية!</highlight> 🔥",
                    "text5": "أولئك الذين يحملون الطعم في محافظهم اليوم لن يكونوا مجرد متفرجين في الاقتصاد الرقمي في الغد؛ سيكونون خطوة واحدة إلى الأمام.",
                    "text6": "لقد بدأ عصر جديد تمامًا في عالم Web3...\n<highlight>و TASTE الآن على هذه المسرح.</highlight> 🚀💎"
                },
                "summary": {
                    "badge": "💎 على TON Blockchain",
                    "subtitle": "يركز على فن الطهي والتعليم، ويستهدف استخدام الرموز المميزة في العالم الحقيقي",
                    "fixed_supply": "العرض الثابت",
                    "no_mint": "الذوق - مرحبا بالنعناع",
                    "secured": "مؤمن",
                    "governance": "الحكم",
                    "community_decision": "قرار المجتمع",
                    "target_use": "🎯 حالات الاستخدام المستهدفة",
                    "tags": [
                        "🍽️ مطعم",
                        "🏨 فندق",
                        "☕ مقهى",
                        "🎓 التعليم",
                        "🎟️ كوبون خصم",
                        "🤝 مكافأة الولاء"
                    ],
                    "why_mint_title": "🔐 لماذا تركت هيئة سك العملة مفتوحة؟",
                    "why_mint_desc": "تم بناء مشروع TASTE على اقتصاد خاضع للرقابة وقائم على الثقة. ولمنع الزيادات التعسفية في العرض ومخاطر التضخم لاحقًا، تم إنشاء الرمز المميز بعرض ثابت يبلغ 25 مليونًا ولم يتم إجراء أي سك حتى الآن.",
                    "why_mint_note": "تم ترك هيئة سك العملة مفتوحة من الناحية الفنية لأنه إذا اندمجت TASTE لاحقًا مع المطاعم والفنادق والسلاسل لإنشاء نظام قسيمة خصم، فقد يحتاج المجتمع إلى تعديل العرض لتنمية النظام البيئي. لم يتم إغلاق هذا الاحتمال مسبقًا — لكن الفريق لا يمكنه استخدام هذه القوة بمفرده.",
                    "dao_title": "🏛️ زيادة العرض عبر DAO – كيف تعمل؟",
                    "dao_desc": "وإذا أدرجت زيادة العرض على جدول الأعمال في المستقبل، فلا يمكن تحقيق هذا القرار إلا من خلال الخطوات التالية:",
                    "dao_steps": [
                        "🗳️ تم فتح باب التصويت لمجتمع DAO",
                        "📣 يتم إجراء حملة إعلامية عامة شفافة",
                        "✅ موافقة الأغلبية مطلوبة",
                        "📋 يتم تسجيل العملية بأكملها على السلسلة"
                    ],
                    "lock_reason_title": "🔒 لماذا تم قفل الكثير من الرموز المميزة؟",
                    "lock_reasons": [
                        {
                            "icon": "🐋",
                            "text": "لمنع تكوين الحوت - لمنع شخص ما من الاستيلاء على جزء كبير من العرض والتلاعب بالسعر."
                        },
                        {
                            "icon": "📉",
                            "text": "لمنع إجراءات الإغراق المفاجئة - لمنع عرض كميات ضخمة للبيع مرة واحدة."
                        },
                        {
                            "icon": "🎭",
                            "text": "لمنع الضجيج المصطنع والتلاعب بالأسعار - من أجل التركيز على النمو في العالم الحقيقي بدلاً من التداول المضاربي."
                        },
                        {
                            "icon": "🏗️",
                            "text": "أمن النظام البيئي على المدى الطويل - لبناء اقتصاد مستدام وصحي في Web3."
                        }
                    ],
                    "philosophy_title": "💎 فلسفة التذوق",
                    "philosophy_text": "TASTE هو مشروع Web3 طويل المدى يفصل بين مشاريع الضجيج قصيرة المدى. العرض الثابت · السيولة الخاضعة للرقابة · الاستخدام في العالم الحقيقي · التخطيط المستقبلي القائم على DAO",
                    "official_source": "- ورقة عمل TASTE الرسمية (tastetoken.net)",
                    "tonscan_view": "عرض على Tonscan →",
                    "lock_prefix": "قفل",
                    "lp_lock_title": "💧 قفل رمز LP (tinu-locker.ton)",
                    "lp_lock_status": "✅ رمز pTON-TASTE LP — مغلق بنسبة 81.6%",
                    "lp_lock_contract": "عقد القفل: tinu-locker.ton"
                },
                "general_info": {
                    "title": "معلومات عامة",
                    "content": "TASTE هو نظام بيئي لامركزي تم تطويره على TON Blockchain، بهدف دمج فنون الطهي وفن الطهي في عالم Web3."
                },
                "vision": {
                    "title": "رؤية",
                    "content": "بناء جسر عالمي حيث يلتقي إتقان الطهي بالقيمة الرقمية، وتمكين المبدعين والشركات من خلال الشفافية."
                },
                "mission": {
                    "title": "مهمة",
                    "content": "مهمتنا هي تزويد عالم فن الطهي بأدوات الولاء والتتبع والنمو باستخدام تقنية blockchain."
                },
                "team": {
                    "title": "فريق",
                    "fatih": {
                        "name": "فاتح امون",
                        "role": "المؤسس والرؤية"
                    },
                    "angel": {
                        "name": "ملاك الذوق",
                        "role": "المجتمع والنظام البيئي"
                    }
                },
                "tokenomics": {
                    "title": "الاقتصاد الرمزي",
                    "initial_supply": "الحد الأقصى للعرض: 25.000.000 طعم",
                    "summary_text": "إجمالي العرض: 25,000,000 TASTE<br />🔒 88.4% مغلق (JVault) • 👥 2% فريق • 👑 2% مؤسس<br />💧 6.4% مجمع سيولة (تدريجي) • 🎁 0.2% Airdrop • 💼 1% العمليات/المكافآت",
                    "allocation": {
                        "team": "الفريق (2%)",
                        "founder": "المؤسس (2%)",
                        "liquidity": "السيولة (6.4%)",
                        "airdrop": "ايردروب (0.2%)",
                        "ops": "العمليات/التبادل (1%)"
                    }
                },
                "supply_policy": {
                    "title": "سياسة التوريد",
                    "content": "88.4% من إجمالي العرض مقفل بشكل احترافي في JVault. يحتفظ الفريق بالسيطرة بنسبة 0% على الأصول المقفلة حتى تاريخ الإصدار."
                }
            },
            "charity": {
                "hero": {
                    "badge": "حب الحيوان",
                    "title": "دعم الشوارد",
                    "desc": "يمكنك التبرع بـ <1> TON</1> أو <2> TASTE</2> لدعم حيوانات الشوارع والمأوى بالطعام والرعاية البيطرية والمأوى. كل قرش يمس الحياة. 🐶🐱",
                    "stats": {
                        "247": "مفتوح 24/7",
                        "stray": "الحيوان الضال",
                        "unlimited": "غير محدود",
                        "channel": "قناة التبرعات",
                        "transparency": "الشفافية"
                    }
                },
                "wallet": {
                    "title": "محفظة التبرعات",
                    "copy_ton": "نسخ العنوان (طن)",
                    "copy_taste": "نسخ العنوان (الذوق)",
                    "copied": "منقول"
                },
                "ton_donate": {
                    "title": "التبرع بالطن",
                    "placeholder": "المبلغ (طن)",
                    "donate_btn": "تبرع بمبلغ {{amount}} طن",
                    "connect_btn": "ربط المحفظة والتبرع",
                    "sending": "إرسال...",
                    "success": "تم إرسال التبرع! شكرا 🐾",
                    "error": "تم إلغاء المعاملة.",
                    "footer": "لإرسال TASTE، انسخ العنوان وأرسله يدويًا من محفظتك."
                },
                "taste_info": {
                    "title": "تبرع في الذوق",
                    "desc": "عنوان المحفظة أعلاه يقبل أيضًا TASTE. يمكنك إرسال أي مبلغ من TASTE باستخدام Tonkeeper أو TonWallet أو STON.fi."
                },
                "gallery": {
                    "badge": "نظرا لمساعدات",
                    "title": "الأدلة والوثائق",
                    "records": "السجلات",
                    "empty_title": "لم تتم إضافة أي أدلة حتى الآن",
                    "empty_desc": "سيتم نشر صور ووثائق المساعدات المقدمة هنا. نبقى شفافين! ✅",
                    "close": "يغلق"
                }
            },
            "legal": {
                "header": {
                    "badge": "الوثائق القانونية",
                    "title": "المعلومات القانونية",
                    "subtitle": "تطبق الشروط والأحكام",
                    "warning": "⚠️ هذا التطبيق <1>لا يحتوي على نصائح استثمارية.</1> تحمل الأصول المشفرة مخاطر عالية."
                },
                "nav": {
                    "disclaimer": {
                        "label": "تنصل",
                        "sub": "إشعار قانوني"
                    },
                    "terms": {
                        "label": "شروط الاستخدام",
                        "sub": "سياسة الاستخدام"
                    },
                    "privacy": {
                        "label": "سياسة الخصوصية",
                        "sub": "حماية البيانات"
                    },
                    "risk": {
                        "label": "الإفصاح عن المخاطر",
                        "sub": "المخاطر المالية"
                    }
                },
                "footer": {
                    "last_updated": "آخر تحديث: مارس 2025 · رمز TASTE © 2025",
                    "network": "بنيت على الشبكة المفتوحة"
                },
                "doc_info": "آخر تحديث: مارس 2025 | تم إعداد هذه الوثيقة باللغتين التركية والإنجليزية.",
                "disclaimer": {
                    "section1": {
                        "title": "🚫 ليست نصيحة استثمارية",
                        "sub": "تنصل",
                        "text": "لا يجوز تفسير أي شيء في هذا التطبيق، بما في ذلك معلومات الأسعار أو الرسوم البيانية أو التحليلات أو التوقعات أو أي بيانات، على أنه نصيحة استثمارية أو توصيات مالية أو عرض للشراء أو البيع.",
                        "eng_note": "يتبع التركي. <1>اللغة الإنجليزية هي اللغة القانونية الأساسية.</1>"
                    },
                    "section2": {
                        "title": "⚖️ حدود المسؤولية",
                        "sub": "الحدود القانونية",
                        "text": "لن يتحمل فريق TASTE Token المسؤولية القانونية عن أي قرارات يتم اتخاذها بناءً على هذا الطلب، بما في ذلك الخسائر المالية المباشرة أو غير المباشرة.",
                        "eng_note": "يتبع التركي. <1>اللغة الإنجليزية هي اللغة القانونية الأساسية.</1>"
                    },
                    "section3": {
                        "title": "🌍 الامتثال التنظيمي",
                        "sub": "الامتثال القانوني",
                        "text": "قد يكون شراء أو بيع العملات المشفرة مقيدًا في بلدك. يتحمل المستخدم المسؤولية الكاملة عن التصرف وفقًا للقوانين المحلية.",
                        "eng_note": "يتبع التركي. <1>اللغة الإنجليزية هي اللغة القانونية الأساسية.</1>"
                    }
                },
                "terms": {
                    "intro": "باستخدام هذا التطبيق، فإنك توافق على الشروط التالية.",
                    "section1": {
                        "title": "📌 الشروط العامة",
                        "sub": "الاستخدام",
                        "text": "هذا التطبيق هو للحصول على معلومات فقط. المستخدمون مسؤولون عن الرموز الخاصة بهم."
                    },
                    "section2": {
                        "title": "🔄 شروط الرمز المميز",
                        "sub": "تبديل",
                        "text": "تتم المعاملات على STON.fi أو منصات DEX الأخرى وفقًا لتقدير المستخدم."
                    },
                    "section3": {
                        "title": "🚫 الاستخدامات المحظورة",
                        "sub": "مُحرَّم",
                        "text": "يُحظر تمامًا غسل الأموال أو المعاملات المالية غير القانونية."
                    },
                    "section4": {
                        "title": "🗣️ سياسة المجتمع (UGC)",
                        "sub": "محتوى",
                        "text": "مشاركات المستخدم (وصفات، صور) هي مسؤولية المستخدم. <1>بيانات مسببات الحساسية والسعرات الحرارية</1> مخصصة للعلم فقط. الدقة المطلقة <2>غير مضمونة</2>."
                    },
                    "section5": {
                        "title": "⚙️ حق التعديل",
                        "sub": "التحديثات",
                        "text": "نحن نحتفظ بالحق في تحديث هذه الشروط دون إشعار."
                    }
                },
                "privacy": {
                    "intro": "خصوصيتك مهمة بالنسبة لنا. تشرح هذه السياسة جمع البيانات.",
                    "section1": {
                        "title": "📊 البيانات التي نجمعها",
                        "sub": "خصوصية",
                        "text": "نقوم بجمع <1>معلومات مستخدم Telegram</1> (المعرف، الاسم) لملفات تعريف المجتمع و<1>بيانات المجتمع</1> التي تشاركها في الموجز.",
                        "note": "الالتزام: <1>لا يتم بيع البيانات الشخصية مطلقًا.</1>"
                    },
                    "section2": {
                        "title": "🔗 طرف ثالث",
                        "sub": "التكامل",
                        "text": "التكامل مع <1>TON Blockchain</1> و<1>STON.fi</1> يخضع لسياساتهم الخاصة."
                    },
                    "section3": {
                        "title": "🗑️ حذف البيانات",
                        "sub": "تنظيف",
                        "text": "يؤدي مسح ذاكرة التخزين المؤقت إلى حذف التفضيلات المحلية. سجلات Blockchain دائمة."
                    },
                    "section4": {
                        "title": "📩 الاتصال",
                        "sub": "يدعم",
                        "text": "تواصل معنا عبر قناة Telegram الخاصة بنا لطرح أسئلة الخصوصية."
                    }
                },
                "risk": {
                    "intro_title": "⛔ تحذير من المخاطر العالية",
                    "intro_text": "الأصول المشفرة شديدة التقلب. قد <1>تخسر كل استثماراتك.</1>",
                    "section1": {
                        "title": "📉 مخاطر السوق",
                        "sub": "التقلب",
                        "text": "يمكن أن تنخفض قيمة TASTE إلى الصفر على الفور. الأداء السابق ليس ضمانا."
                    },
                    "section2": {
                        "title": "💧 مخاطر السيولة",
                        "sub": "تجارة",
                        "text": "قد لا يكون بيع TASTE بالسعر المطلوب ممكنًا دائمًا."
                    },
                    "section3": {
                        "title": "🔧 المخاطر التقنية",
                        "sub": "شبكة",
                        "text": "تحمل مشكلات شبكة Blockchain أو ثغرات <1>العقد الذكي</1> مخاطر جوهرية."
                    },
                    "section4": {
                        "title": "⚖️ المخاطر التنظيمية",
                        "sub": "سياسة",
                        "text": "القوانين تتغير. يفترض المستخدم مخاطر القيود القانونية المستقبلية."
                    },
                    "section5": {
                        "title": "💡 النهج الموصى به",
                        "sub": "أمان",
                        "text": "استثمر فقط ما يمكن أن تخسره. ديور."
                    }
                }
            },
            "community": {
                "nav_title": "مجتمع",
                "title": "تغذية الغذاء",
                "share": "يشارك",
                "stats": {
                    "posts": "دعامات",
                    "likes": "يحب",
                    "allergens": "علامات الحساسية"
                },
                "search_ph": "ابحث عن الطعام أو الوصفة أو المكان...",
                "filters": {
                    "all": "الجميع",
                    "food": "طعام",
                    "recipe": "وصفة",
                    "menu": "قائمة طعام",
                    "career": "الوظيفي / وظائف"
                },
                "trending": "الأكثر إعجابًا",
                "loading": "جارٍ تحميل المشاركات...",
                "no_results": "لم يتم العثور على نتائج",
                "no_posts_title": "لا توجد مشاركات حتى الآن",
                "no_posts_desc": "كن أول من يشارك شيئا!",
                "detail": "التفاصيل →",
                "create_title": "مشاركة جديدة",
                "venue_ph": "اسم المكان",
                "city_ph": "مدينة",
                "recipe_ph": "اسم الوصفة",
                "ph_food": "ماذا أكلت اليوم؟ كيف وجدته؟",
                "ph_recipe": "ملاحظة قصيرة حول الوصفة...",
                "ph_menu": "ما رأيك في المكان؟",
                "calories_ph": "السعرات الحرارية (على سبيل المثال ~ 450 سعرة حرارية)",
                "mark_allergens": "مارك مسببات الحساسية",
                "ingredients_title": "🥄 المكونات",
                "ing_ph": "المكون",
                "amt_ph": "كمية",
                "add_ing": "+ إضافة العنصر",
                "steps_title": "📋 خطوات التحضير",
                "step_ph": "الخطوة {{ن}}...",
                "add_step": "+ إضافة خطوة",
                "tags_title": "العلامات",
                "add_photo": "📷 إضافة صورة (اختياري)",
                "sharing": "⏳ المشاركة...",
                "share_btn": "🚀 شارك",
                "allergen_warning": "تحذير من مسببات الحساسية",
                "directions": "الاتجاهات",
                "close": "يغلق",
                "shared_from": "تمت المشاركة من TASTE MiniApp 🍳",
                "just_now": "الآن",
                "min_ago": "{{ن}} قبل دقيقة",
                "hrs_ago": "{{ن}} منذ ساعات",
                "days_ago": "{{ن}} منذ أيام",
                "ingredients_count": "{{ن}} المكونات · {{س}} الخطوات",
                "tags": {
                    "breakfast": "إفطار",
                    "lunch": "غداء",
                    "dinner": "عشاء",
                    "snack": "وجبة خفيفة",
                    "dessert": "حَلوَى",
                    "vegan": "نباتي",
                    "vegetarian": "نباتي",
                    "soup": "حساء",
                    "meat": "أطباق اللحوم",
                    "vegetables": "خضار",
                    "traditional": "تقليدي",
                    "practical": "عملي",
                    "healthy": "صحيح",
                    "cafe": "مقهى",
                    "fastfood": "الوجبات السريعة",
                    "finedining": "تناول الطعام الراقى",
                    "seafood": "المأكولات البحرية",
                    "job_listing": "قائمة الوظائف",
                    "job_seeking": "البحث عن عمل",
                    "chef": "الشيف",
                    "cook": "يطبخ",
                    "waiter": "النادل",
                    "master": "يتقن"
                },
                "allergens": {
                    "G": "الغولتين",
                    "SÜ": "لبن",
                    "Y": "بيضة",
                    "B": "سمكة",
                    "KA": "القشريات",
                    "YF": "الفول السوداني",
                    "S": "فول الصويا",
                    "KM": "المكسرات",
                    "H": "الخردل",
                    "SS": "سمسم",
                    "SÜL": "الكبريت",
                    "KE": "كرفس",
                    "AB": "الترمس",
                    "YU": "الرخويات"
                },
                "job_post": "وظيفة",
                "reward_wallet": "محفظة المكافآت",
                "chat_poster": "الدردشة مع الملصق",
                "alert_success_global": "عظيم! تمت مشاركة منشورك عالميًا! 🚀",
                "alert_success": "مشاركة مشاركة! 🚀",
                "tab_feed": "يٌطعم",
                "tab_jobs": "وظائف",
                "tab_chat": "محادثة",
                "btn_share_win": "🚀 شارك واربح 5 مذاقات!",
                "no_posts": "لا توجد مشاركات حتى الآن",
                "ph_chat": "اكتب رسالة...",
                "ph_position": "الوظيفة في مطعم",
                "ph_job_desc": "اكتب منشور وظيفتك أو ابحث عن التفاصيل هنا...",
                "lbl_wallet_reward": "عنوان المحفظة للمكافأة",
                "lbl_wallet_note": "* لا تنس التقاط لقطة شاشة ومشاركتها في مجموعة TG بعد النشر!"
            },
            "jobs": {
                "title": "وظائف الذوق",
                "subtitle": "مهنة فن الطهو والمجتمع",
                "tabs": {
                    "feed": "يٌطعم",
                    "board": "سبورة",
                    "reviews": "التعليقات",
                    "profiles": "الملفات الشخصية"
                },
                "types": {
                    "listing": "قائمة الوظائف",
                    "seeking": "البحث عن وظيفة",
                    "today": "🔥 اليوم"
                },
                "actions": {
                    "apply": "يتقدم",
                    "message": "أرسل رسالة",
                    "join_now": "انضم الآن",
                    "add_job": "إضافة قائمة",
                    "add_review": "أضف مراجعة",
                    "add_cv": "أضف السيرة الذاتية",
                    "back": "خلف",
                    "cancel": "يلغي",
                    "submit": "يُقدِّم",
                    "publishing": "نشر...",
                    "sending": "إرسال...",
                    "saving": "توفير...",
                    "submit_review": "⭐ إضافة مراجعة (+5 ذوق)",
                    "submit_cv": "💾 نشر سيرتي الذاتية",
                    "success_listing": "تم نشر القائمة بنجاح! 🎉",
                    "success_apply": "تم إرسال الطلب!",
                    "tg_redirect": "إعادة التوجيه إلى تيليجرام..."
                },
                "placeholders": {
                    "title": "المسمى الوظيفي (على سبيل المثال، نادل ذو خبرة)",
                    "desc": "التفاصيل (الخبرة، ساعات العمل، الخ)",
                    "city": "اختر المدينة",
                    "salary": "الراتب (على سبيل المثال 25 ألف ليرة تركية)",
                    "why_join": "لماذا تريد الانضمام؟",
                    "apply_msg": "اكتب رسالة طلبك...",
                    "city_opt": "اختر المدينة",
                    "profession": "اختر المهنة",
                    "business_name": "اسم النشاط التجاري (على سبيل المثال، مطعم XYZ)",
                    "review_msg": "اكتب رأيك... (ظروف العمل، الإدارة، الخ)",
                    "experience": "الخبرة (على سبيل المثال 5 سنوات في مطبخ الفندق)",
                    "bio": "احكي عن نفسك..."
                },
                "reviews": {
                    "title": "مراجعات الأعمال",
                    "tip": "قم بمراجعة مكان عملك. مساعدة المجتمع! اكسب <1>+5 طعم</1>.",
                    "business_ph": "اسم العمل",
                    "overall": "النتيجة الإجمالية",
                    "salary": "مرتب",
                    "env": "البيئة",
                    "mgmt": "إدارة",
                    "comment_ph": "تعليقك...",
                    "success": "تم نشر المراجعة! +5 فاز المذاق 🎉"
                },
                "profiles": {
                    "title": "الملفات الشخصية والسيرة الذاتية",
                    "add_btn": "+ إضافة السيرة الذاتية",
                    "profession_ph": "اختر المهنة",
                    "exp_ph": "الخبرة (على سبيل المثال 5 سنوات)",
                    "bio_ph": "سيرة ذاتية قصيرة...",
                    "photo_label": "صورة الملف الشخصي",
                    "photo_btn": "حدد صورة من المعرض",
                    "skills_label": "مهارات",
                    "success": "تم نشر السيرة الذاتية! يمكن للآخرين رؤيتك 🎉",
                    "empty": "لا توجد ملفات شخصية حتى الآن. كن الأول!"
                },
                "feed": {
                    "title": "تغذية المطبخ",
                    "new_post": "مشاركة جديدة",
                    "success_post": "تم نشر المنشور! مشاركة لقطة الشاشة مع TG Group → +5 TASTE! 🎉",
                    "types": {
                        "food": "طعام",
                        "recipe": "وصفة",
                        "menu": "قائمة طعام"
                    },
                    "placeholders": {
                        "food": "احكي عن طبقك...",
                        "recipe": "شاركنا وصفتك...",
                        "menu": "وصف القائمة الخاصة بك..."
                    }
                }
            },
            "tastepay": {
                "title": "دفع سريع وسهل",
                "desc": "ادفع أو احصل على أموالك في ثوانٍ مع TASTE - في أي مكان في العالم.",
                "receive": "إنشاء فاتورة",
                "scan": "الدفع باستخدام QR",
                "scan_desc": "وضع العميل · مسح الرمز ضوئيًا عند الخروج للدفع",
                "receive_btn": "تلقي الدفع",
                "receive_desc": "وضع الأعمال · إنشاء رمز الاستجابة السريعة للعملاء للدفع",
                "wallet_connected": "✓ المحفظة متصلة",
                "wallet_required": "يجب عليك توصيل المحفظة لإجراء الدفع",
                "receive_amount_title": "المبلغ المراد استلامه",
                "cam_denied": "تم رفض إذن الكاميرا. يرجى السماح في الإعدادات.",
                "cam_not_found": "لم يتم العثور على الكاميرا.",
                "cam_failed": "فشل في فتح الكاميرا:",
                "scan_qr_text": "امسح رمز الاستجابة السريعة ضوئيًا عند الخروج للدفع",
                "retry_cam": "أعد محاولة الكاميرا",
                "native_cam": "الكاميرا الأصلية",
                "invoice_no": "رقم الفاتورة:",
                "live_rate": "المعدل المباشر: 1 طعم ≈",
                "to_receive": "لتلقي",
                "enter_amount": "أدخل المبلغ",
                "err_wallet": "يرجى توصيل محفظتك أولا",
                "err_amount": "مبلغ غير صالح",
                "err_balance": "توازن الذوق غير كاف! مطلوب: {{req}}، متاح: {{avail}}",
                "err_fee": "مطلوب ما لا يقل عن 0.2 طن لرسوم المعاملة",
                "confirm_title": "ملخص وتأكيد",
                "recipient": "محفظة المستلم",
                "amount": "كمية",
                "rate": "السعر (ثابت)",
                "to_pay": "طعم للدفع",
                "fee": "رسوم الشبكة",
                "btn_confirm": "تأكيد والدفع",
                "btn_processing": "يعالج...",
                "success_title": "تم إرسال الدفع!",
                "success_desc": "تم إرسال المعاملة إلى blockchain. وسيتم تأكيد ذلك في بضع ثوان.",
                "view_explorer": "عرض على Tonviewer",
                "back_menu": "العودة إلى القائمة",
                "fail_title": "فشل الدفع",
                "retry": "أعد المحاولة",
                "cancel": "يلغي"
            },
            "chef": {
                "title": "طعم الشيف",
                "subtitle": "الولاء والخصم الرقمي",
                "safe_title": "المجتمع الرئيسي الآمن",
                "fill_safe": "املأها بأمان",
                "discount_right": "الخصم الصحيح",
                "min_hold_warning": "يجب أن يكون لديك ما لا يقل عن 2000 TASTE للاستمتاع بالخصومات.",
                "next_level": "المستوى التالي:",
                "units_needed": "الوحدات اللازمة أكثر",
                "connect_warning": "ربط المحفظة لاستخدام الخصم.",
                "get_discount": "احصل على خصم لدى أمين الصندوق",
                "success_title": "الصفقة ناجحة!",
                "success_desc": "تمت الموافقة على الخصم. أظهر هذا للموظفين.",
                "mastery_levels": "مستويات الإتقان والفوائد",
                "nearby_venues": "المطاعم الشريكة (قريب)",
                "nearby_branch": "أقرب فرع لك",
                "nav_tip": "* يقوم نظام الملاحة الخاص بنا تلقائيًا بمسح المواقع الصالحة للتذوق في منطقتك.",
                "legal_title": "المتطلبات والقواعد القانونية",
                "legal_points": [
                    "هذا النظام هو لأغراض الولاء فقط. ولا يحتوي على نصيحة استثمارية أو أدوات مالية.",
                    "يتم تحديد حقوق الخصم تلقائيًا بناءً على حالة ملكيتك في محفظتك.",
                    "الرسوم المرسلة أثناء العملية هي رسوم استخدام النظام والتحقق.",
                    "الذوق ليس وسيلة للدفع. لا يتم قبول مدفوعات التشفير. يتم دفع الفاتورة بالعملة المحلية.",
                    "18+ الحد الأدنى للسن إلزامي. المستخدم مسؤول عن البيانات الكاذبة."
                ],
                "tiers": {
                    "bronze": "مبتدئ",
                    "silver": "المياوم",
                    "gold": "يتقن",
                    "diamond": "الشيف"
                }
            },
            "team": {
                "title": "أعضاء فريق المشروع",
                "subtitle": "العقول الحكيمة تبني نظام TASTE البيئي",
                "contact": "اتصال",
                "roles": {
                    "founder": "المؤسس / الإستراتيجية والرؤية",
                    "lead_dev": "المطور الرئيسي / المهندس المعماري",
                    "marketing": "كبير مسؤولي التسويق / نمو العلامة التجارية",
                    "community": "مدير المجتمع والإعلام",
                    "little_queen": "مدير المجتمع",
                    "legend_love": "مدير المجتمع والإعلام",
                    "fatih_kaya": "المنسق المالي"
                },
                "bios": {
                    "founder": "صاحب رؤية وراء مشروع TASTE. بناء الجسر بين فن الطهو و blockchain.",
                    "lead_dev": "ماجستير في الكود والهندسة المعمارية. تحويل رؤية TASTE إلى واقع رقمي آمن وقابل للتطوير.",
                    "marketing": "العقل الاستراتيجي يوسع نطاق TASTE عالميًا. ربط عالم الطهي مع Web3.",
                    "community": "وسيط وخبير في وسائل التواصل الاجتماعي ومعلن. أيضا منظم المسابقة وباني المجتمع.",
                    "little_queen": "التركيز على نمو المجتمع وتفاعلات وسائل التواصل الاجتماعي ودعم مؤيدي TASTE.",
                    "legend_love": "وسيط وخبير في وسائل التواصل الاجتماعي ومعلن. أيضا منظم المسابقة وباني المجتمع.",
                    "fatih_kaya": "مؤسس، مخطط، دليل. من يحتضن ويتولى ويحاول تنفيذ مشروع TASTE. يضمن دعم فرق المطبخ مالياً."
                }
            }
        }
    },
    "zh": {
        "translation": {
            "app": {
                "title": "品尝",
                "description": "专注于美食与教育的实用数字资产",
                "my_balance": "我的余额",
                "connect_wallet_first": "请先连接钱包",
                "tap_to_earn": "点击赚取",
                "no_energy": "精力不足",
                "invite_friend": "邀请好友",
                "share_link": "分享链接",
                "invite_gain": "共同拓展社区",
                "buy_title": "Erken Erişim — 购买 TASTE",
                "buy_with": "使用 TON 获取",
                "you_get": "您将获得",
                "swap_opening": "在 STON.fi 上开放兑换...",
                "holders": "支架",
                "invite_desc": "共同发展社区",
                "referral_message": "加入 TASTE 并开始赚取 TON 生态系统奖励！ 🍳",
                "transaction_failed": "交易失败或取消。 ❌",
                "early_access_ending": "🚀 抢先体验 1 级结束于：",
                "reward_end": "🎁 奖励发放结束——2026 年 5 月 20 日",
                "units": {
                    "day": "天",
                    "hr": "HRS",
                    "min": "最小",
                    "sec": "美国证券交易委员会",
                    "holder": "支架",
                    "supply": "总供应量",
                    "locked": "锁定"
                },
                "faq": {
                    "title": "❓ 常见问题",
                    "what_is": "什么是品味？",
                    "what_is_ans": "TASTE 是建立在 TON 区块链上的专注于美食和教育的数字忠诚度资产。它的目标是餐馆、酒店和食品饮料行业的实际应用。",
                    "how_to": "如何购买？",
                    "how_to_ans": "1. 将 TON 加载到您的 TON 钱包（Tonkeeper，@wallet）。<br />2.从上面的面板中选择所需的金额。<br />3.点击“使用 TON 购买”并通过 STON.fi 进行兑换。"
                },
                "tap_for_info": "点击获取信息",
                "quick_links": "快速链接",
                "project_assistant": "项目助理",
                "quick_wallet": "快速钱包和转账",
                "chef_status": "品味厨师数字状态",
                "gastronomy_career": "美食职业与社区",
                "web3_partners": "Web3 及合作伙伴",
                "joint_projects": "联合项目",
                "lang": "郎",
                "banner_title": "品味，走向未来！",
                "banner_desc": "TASTE 是明日闪亮的明星。立即购买 TASTE，踏上这段奇妙的旅程！",
                "banner_buy": "购买口味"
            },
            "nav": {
                "home": "首页",
                "roadmap": "路线图",
                "whitepaper": "白皮书",
                "litepaper": "精简白皮书",
                "community": "美食动态",
                "spin": "幸运轮盘",
                "charity": "慈善平台",
                "legal": "法律信息",
                "leaderboard": "排行榜",
                "play": "开始游戏",
                "wallet": "钱包",
                "chef": "Taste 厨师",
                "discover": "发现",
                "install": "安装",
                "partners": "合作伙伴",
                "vote": "我们在 Web3 中的地位",
                "socials": "社交媒体",
                "team": "团队",
                "faq": "常问问题。",
                "tech": "科技",
                "settings": "设置",
                "menu": "菜单"
            },
            "home": {
                "live_badge": "现场活动",
                "live_title": "📡 品尝活动"
            },
            "market": {
                "live_chart": "实时市场分析"
            },
            "roadmap": {
                "title": "2026 年路线图",
                "philosophy_title": "品味哲学",
                "philosophy": [
                    "🎯 TASTE 不会规划它不能做的事情。",
                    "✅ 它描绘了它所做的事情——经过验证的、真实的。",
                    "🤝 它不会做出无法兑现的承诺。这就是人们信任我们的原因。",
                    "📌 每一步都透明，每一个承诺都兑现。"
                ],
                "completed_goals": "2026 年第一季度 — 完成的目标",
                "ongoing": "进行中",
                "footer_text": "该路线图是一份动态文档——添加了已完成的任务，未添加未承诺的任务。",
                "footer_bold": "品味建立信任，而不是贩卖梦想。",
                "items": {
                    "mint": {
                        "title": "资产生成和发布",
                        "desc": "TASTE 资产在 TON 区块链上生成，并开始在 STON.fi 上进行交易。"
                    },
                    "lp": {
                        "title": "流动资金池",
                        "desc": "TON/TASTE 流动性池在 STON.fi 上创建并激活。"
                    },
                    "lock": {
                        "title": "资产&LP锁定",
                        "desc": "总供应量的 88.4% 通过 3 个独立的锁锁定在 JVault 中。此外，81.6% 的 STON.fi pTON-TASTE LP 单位已通过tinu-locker.ton 锁定。两种锁都可以在区块链上公开验证。"
                    },
                    "security": {
                        "title": "安全扫描",
                        "desc": "智能合约已通过安全审核。"
                    },
                    "miniapp": {
                        "title": "Telegram 迷你应用程序",
                        "desc": "推出了运行在 Telegram 上的全功能迷你应用程序。"
                    },
                    "airdrop": {
                        "title": "空投及奖励",
                        "desc": "TASTE空投共521个钱包，并且每天都在增加。旋转轮奖励系统已激活。"
                    },
                    "documents": {
                        "title": "白皮书和精简版纸",
                        "desc": "解释该项目的综合技术文件和精简版本已经发布。"
                    },
                    "social": {
                        "title": "社交媒体存在",
                        "desc": "建立了 Telegram 频道（@taste2025）、社区组、WhatsApp 频道、Twitter/X（@taste_token）、Instagram（@taste_ton_taste）、TikTok（@taste_ton）、Facebook 和官方网站（tastetoken.net）。活跃于所有平台。"
                    },
                    "stray": {
                        "title": "流浪动物捐赠平台",
                        "desc": "添加了一个平台，可以使用 TON 和 TASTE 向动物收容所捐款。"
                    },
                    "food_sharing": {
                        "title": "日常美食分享平台",
                        "desc": "用户可以分享食谱、食物和场地。实时（使用 Supabase）。"
                    },
                    "wallets": {
                        "title": "钱包数量达到 521 个",
                        "desc": "第一季度的目标达到了 521 名唯一钱包所有者。社区不断发展。"
                    },
                    "allergen": {
                        "title": "食物过敏原通知系统",
                        "desc": "欧盟和土耳其食品立法中的 14 种强制性过敏原（麸质、牛奶、鸡蛋、鱼等）已纳入食品饲料中。过敏原标签可以添加到每个份额，并显示卡路里信息。"
                    },
                    "v2": {
                        "title": "迷你应用程序 v2 更新 — 2026 年 3 月",
                        "desc": "PoweredBy 部分已更新为 SVG 徽标（OKX、Bitget、Binance、Telegram、Google、Gemini）。白皮书中添加了口味摘要卡。添加奖励分配结束计时器（2026 年 5 月 20 日）。 Food Feed 中的点赞、搜索和趋势食品。"
                    },
                    "v2_1": {
                        "title": "迷你应用程序 v2.1 重新设计 - 2026 年 3 月",
                        "desc": "高级深色用户界面和用户体验大修。实施新的“探索”菜单抽屉。添加了常见问题解答部分。 AI引擎通过Groq升级至Llama 3.3 70B。全球 Telegram 主题颜色同步，带来优质感觉。"
                    },
                    "v2_2": {
                        "title": "迷你应用 v2.2 内容与合规性 — 2026 年 3 月",
                        "desc": "发表 TASTE 宣言解释了该项目的灵魂。对英语和土耳其语的全面国际化 (i18n) 支持。为了用户安全，实施了全面的法律框架（条款、隐私、风险披露）和首次推出的免责声明模式。"
                    },
                    "v2_3": {
                        "title": "迷你应用程序 v2.3 钱包和二维码更新 - 2026 年 3 月",
                        "desc": "快速钱包和转账系统上线。用户现在可以查看 TON 和 TASTE 余额，扫描二维码进行即时付款，并通过优化的 Gas 费用安全地发送 TON 和 TASTE 代币。"
                    },
                    "v2_4": {
                        "title": "小程序 v2.4 味厨",
                        "desc": "数字忠诚度和折扣系统。学徒级别达到主厨级别。收银台折扣验证的象征性费用。"
                    },
                    "v2_5": {
                        "title": "小程序 v2.5 社区 3.0 — 2026 年 3 月",
                        "desc": "与 Supabase 一起推出全球实时食品饲料和就业委员会。直接 Telegram 集成，可与招聘海报即时联系。 “分享并赢取”活动活跃，奖励钱包可见。全球实时聊天活跃。"
                    },
                    "v2_6": {
                        "title": "Mini App v2.6 钱包和转账系统 — 2026 年 3 月",
                        "desc": "完全集成的钱包组件，带有由 STON.fi 深度链接提供支持的发送、接收、购买和销售选项卡。"
                    },
                    "growth": {
                        "title": "社区成长",
                        "desc": "每天都有新用户，每天都有新分享。专注于有机增长。"
                    },
                    "visibility": {
                        "title": "更高的 DEX 可见性",
                        "desc": "与 STON.fi 一起存在于其他 TON 生态系统平台中。"
                    },
                    "partners": {
                        "title": "战略合作伙伴关系",
                        "desc": "与当地企业、平台和美食品牌建立联盟。"
                    },
                    "listings": {
                        "title": "CEX / DEX 上市",
                        "desc": "各种去中心化和中心化交易所的交易量不断增加。"
                    },
                    "reporting": {
                        "title": "透明的报告",
                        "desc": "持有人数量、交易量和社区发展情况将定期分享。"
                    },
                    "dev": {
                        "title": "小程序开发",
                        "desc": "根据用户反馈添加新功能。"
                    }
                },
                "spin": {
                    "ton_balance": "TON 余额",
                    "ton_target": "目标：5吨",
                    "ton_claim_ready": "🎉 大量奖励已准备好！",
                    "ton_left": "还剩 {{n}} 吨",
                    "win_ton": "🎉 {{n}} 吨赢了！",
                    "reward_claim_ton": "🎉 吨奖励领取",
                    "accumulated_ton": "你好！我积累了 5 吨。",
                    "won_ton_msg": "🏆 我在方向盘上赢了！",
                    "ton_win_bonus": "🎉 {{n}} 吨奖金！",
                    "ton_important": "付款最低限额为 5 吨。"
                }
            },
            "manifesto": {
                "title": "品味宣言",
                "subtitle": "火的故事•精通之路",
                "section1": {
                    "title": "🌅 火灾的开始",
                    "p1": "当数字世界的第一把火点燃时……没有人知道那会是厨房。",
                    "quote": "这一切都是从一个火花开始的。一只看不见的手……一个看不见的食谱……人类第一次学会控制分散的火……",
                    "p2": "点燃这把火的人不是一个名字……不是一个身份……一个想法……一场革命……一次<highlight>觉醒</highlight>。",
                    "p3": "他刚刚点燃了火。他把炉子支起来。他留下了食谱。然后……他离开了厨房。"
                },
                "section2": {
                    "title": "⚠️火还不够",
                    "p1": "但仅靠火是不够的。火可以燃烧……但是<highlight>烹饪需要掌握</highlight>。",
                    "p2": "随着时间的推移，数字世界被填满。数以千计的厨房开业。发光的标志……喧闹的大厅……快速食谱……",
                    "quote": "但他们中的大多数人都缺乏这一点：没有劳动力。没有耐心。没有灵魂。有火……但没有味道。"
                },
                "section3": {
                    "title": "🍳 品味的诞生",
                    "p1": "就在那时……另一个需求出现了。",
                    "p2": "有人不只是想用火。他们想要<highlight>理解</highlight>它。他们想要<highlight>处理</highlight>它。他们想要<highlight>把它变成大师</highlight>。",
                    "quote": "并设立了厨房。安静的。朴实无华。但有意识。名称： 味道"
                },
                "section4": {
                    "title": "🚪 进入厨房",
                    "box": "点燃炉子。你听到了吗？那不仅仅是火焰的声音。那是<highlight>转变的声音</highlight>。",
                    "p1": "当金属变成数字时，价值诞生了……但意义并没有诞生。 <highlight>TASTE的成立是为了烹饪的意思。</highlight>",
                    "p2": "当你踏进门的时候，你会有这样的感觉：",
                    "quote": "这里没有什么是快速完成的。这里没有任何事情是徒劳的。没有什么东西只是为了存在而存在的。",
                    "p3": "每种材料都有其存在的理由。每个食谱都有历史。每个大师都有烧伤的痕迹。"
                },
                "section5": {
                    "title": "⏳ 真正的价值成熟",
                    "quote": "因为真正的价值不是产生的……而是成熟的。它在火上等待。它随着时间的推移而成形。它随着耐心而加深。"
                },
                "section6": {
                    "title": "🎯 那么我们为什么存在？",
                    "p1": "不仅仅是为了交易。不仅仅是买卖。根本不只是为了被看见。",
                    "box": [
                        "我们的存在是为了<highlight>创造价值</highlight>。",
                        "我们的存在是为了<highlight>分享知识</highlight>。",
                        "我们的存在是为了<highlight>培养精通</highlight>。",
                        "我们的存在是为了给数字世界带来<highlight>意义</highlight>。"
                    ],
                    "quote": "我们站在深度的一边……而不是速度。我们站在掌握的一边……而不是噪音。我们站在生产一边……而不是消费一边。"
                },
                "section7": {
                    "title": "💎 品味不是一种趋势",
                    "p1": "如今，无数资产在数字世界中流通。有些存在只是为了被看到。有些只是为了出售而存在。有些人出生只是为了被遗忘。",
                    "quote": "但有些东西……是出于必然而诞生的。",
                    "p2": "<highlight>TASTE</highlight>不是一种趋势。不是副本。没有一点噪音。",
                    "p3": "这个厨房的建立是为了填补一个空白。人们不只是进行交易……<highlight>生产……学习……转型和发展……</highlight>成为一个系统。"
                },
                "section8": {
                    "title": "🛤️我们的道路",
                    "paths": [
                        {
                            "icon": "📚",
                            "text": "培训学徒"
                        },
                        {
                            "icon": "👨‍🍳",
                            "text": "培训大师"
                        },
                        {
                            "icon": "🧠",
                            "text": "意识不断增强"
                        },
                        {
                            "icon": "💰",
                            "text": "深化价值"
                        },
                        {
                            "icon": "🔥",
                            "text": "火势越来越大"
                        },
                        {
                            "icon": "🍽️",
                            "text": "增加风味"
                        }
                    ],
                    "quote": "那么这条路通向哪里呢？不去一个结束的地方。去一个能生长的地方。这不是目的地……这是一条<highlight>掌握之路</highlight>。",
                    "p1": "真正的大师知道：<highlight>最好的食谱是尚未写出的食谱。</highlight>"
                },
                "section9": {
                    "title": "现在……",
                    "p1": "炉子已经打开了。锅都准备好了。菜谱正在等待编写。时间在流动。",
                    "box": "这不是一个故事。这不是一个比喻。这根本不是梦。这是……<highlight>不可避免的演变</highlight>。",
                    "p2": "火已经点燃了。制度已经建立。但味道还是在煮。",
                    "footer_q": "问题不是：“品味存在吗？”",
                    "footer_a": "你准备好在这个厨房里占据一席之地了吗？ 🍽️"
                }
            },
            "whitepaper": {
                "title": "白皮书",
                "pitch": {
                    "title": "为什么要品尝？",
                    "text1": "世界正在迅速变化。随着纸币时代慢慢结束，数字经济正在取而代之。\n\n那么 TASTE 在这个新秩序中做了什么？",
                    "text2": "TASTE 不仅仅是一种加密货币（代币）——它正在构建一个庞大的生态系统，其背后具有现实世界的实用性。您现在可以在合作商家直接使用 TASTE 付款，并在付款时享受<highlight>TASTE 持有者专享</highlight>折扣和特权。 🛍️🤝",
                    "text3": "这就是 TASTE 与数以万计的其他项目最大的区别：",
                    "text4": "<highlight>不仅仅是投机投资，现实生活中的使用+即时优势！</highlight> 🔥",
                    "text5": "今天钱包里持有 TASTE 的人将不仅仅是明天数字经济的旁观者；他们将领先一步。",
                    "text6": "Web3 世界一个全新的时代已经开始……\n<highlight>TASTE现已登上这个舞台。</highlight> 🚀💎"
                },
                "summary": {
                    "badge": "💎 在 TON 区块链上",
                    "subtitle": "以美食和教育为重点，针对现实世界使用实用代币",
                    "fixed_supply": "固定供应",
                    "no_mint": "味道 — Hiç 薄荷蛋黄",
                    "secured": "安全的",
                    "governance": "治理",
                    "community_decision": "社区决策",
                    "target_use": "🎯 目标用例",
                    "tags": [
                        "🍽️餐厅",
                        "🏨 酒店",
                        "☕ 咖啡厅",
                        "🎓 教育",
                        "🎟️折扣券",
                        "🤝 忠诚奖励"
                    ],
                    "why_mint_title": "🔐 为什么铸币局保持开放？",
                    "why_mint_desc": "TASTE 项目建立在受控和基于信任的经济之上。为了防止以后任意增加供应量和通货膨胀风险，该代币以固定的 2500 万供应量创建，并且到目前为止尚未进行铸造。",
                    "why_mint_note": "从技术上讲，造币机构是开放的，因为如果 TASTE 之后与餐馆、酒店和连锁店整合建立折扣券系统，社区可能需要调整供应来发展生态系统。这种可能性并没有被提前排除——但是团队无法单独使用这种能力。",
                    "dao_title": "🏛️ 通过 DAO 增加供应——它是如何运作的？",
                    "dao_desc": "如果未来增加供应提上议程，这一决定只能通过以下步骤来实现：",
                    "dao_steps": [
                        "🗳️社区DAO投票开启",
                        "📣 开展透明的公共信息活动",
                        "✅ 需要多数人批准",
                        "📋 整个过程都记录在链上"
                    ],
                    "lock_reason_title": "🔒 为什么这么多代币被锁定？",
                    "lock_reasons": [
                        {
                            "icon": "🐋",
                            "text": "防止鲸鱼配方——防止有人抢占大部分供应并操纵价格。"
                        },
                        {
                            "icon": "📉",
                            "text": "防止突然的倾销行为——防止一次性大量出售。"
                        },
                        {
                            "icon": "🎭",
                            "text": "防止人为炒作和价格操纵——以现实世界的使用而不是投机交易为重点的增长。"
                        },
                        {
                            "icon": "🏗️",
                            "text": "长期的生态系统安全——在Web3中构建可持续健康的经济。"
                        }
                    ],
                    "philosophy_title": "💎品味哲学",
                    "philosophy_text": "TASTE 是一个长期的 Web3 项目，与短期的炒作项目分道扬镳。固定供应 · 受控流动性 · 现实世界使用 · 基于 DAO 的未来规划",
                    "official_source": "— 官方 TASTE 白皮书 (tastetoken.net)",
                    "tonscan_view": "在 Tonscan 上查看 →",
                    "lock_prefix": "锁",
                    "lp_lock_title": "💧 LP 代币锁定（tinu-locker.ton）",
                    "lp_lock_status": "✅ pTON-TASTE LP 代币 — 81.6% 锁定",
                    "lp_lock_contract": "锁定合约：tinu-locker.ton"
                },
                "general_info": {
                    "title": "一般信息",
                    "content": "TASTE 是一个在 TON 区块链上开发的去中心化生态系统，旨在将烹饪艺术和美食融入 Web3 世界。"
                },
                "vision": {
                    "title": "想象",
                    "content": "建立一座让烹饪技艺与数字价值相遇的全球桥梁，通过透明度为创作者和企业赋能。"
                },
                "mission": {
                    "title": "使命",
                    "content": "我们的使命是利用区块链技术为美食界提供忠诚度、可追溯性和增长的工具。"
                },
                "team": {
                    "title": "团队",
                    "fatih": {
                        "name": "法提赫·埃蒙",
                        "role": "创始人及远见者"
                    },
                    "angel": {
                        "name": "品味天使",
                        "role": "社区与生态系统"
                    }
                },
                "tokenomics": {
                    "title": "代币经济学",
                    "initial_supply": "最大供应量：25,000,000 TASTE",
                    "summary_text": "总供应量：25,000,000 TASTE<br />🔒 88.4% 锁定（JVault） • 👥 2% 团队 • 👑 2% 创始人<br />💧 6.4% 流动资金池（逐步） • 🎁 0.2% 空投 • 💼 1% 运营/奖励",
                    "allocation": {
                        "team": "团队 (2%)",
                        "founder": "创始人 (2%)",
                        "liquidity": "流动性 (6.4%)",
                        "airdrop": "空投 (0.2%)",
                        "ops": "运营/交换 (1%)"
                    }
                },
                "supply_policy": {
                    "title": "供应政策",
                    "content": "总供应量的 88.4% 被专业锁定在 JVault 中。在发布日期之前，团队对锁定资产的控制率为 0%。"
                }
            },
            "charity": {
                "hero": {
                    "badge": "动物之爱",
                    "title": "支持流浪者",
                    "desc": "您可以捐赠 <1> TON</1> 或 <2> TASTE</2> 为街头和收容所的动物提供食物、兽医护理和庇护所。每一分钱都关乎一个生命。 🐱",
                    "stats": {
                        "247": "24/7 开放",
                        "stray": "流浪动物",
                        "unlimited": "无限",
                        "channel": "捐款渠道",
                        "transparency": "透明度"
                    }
                },
                "wallet": {
                    "title": "捐款钱包",
                    "copy_ton": "复制地址 (TON)",
                    "copy_taste": "复制地址（口味）",
                    "copied": "已复制"
                },
                "ton_donate": {
                    "title": "捐赠 TON",
                    "placeholder": "数量（吨）",
                    "donate_btn": "捐赠 {{amount}} TON",
                    "connect_btn": "连接钱包并捐赠",
                    "sending": "正在发送...",
                    "success": "捐款已发送！谢谢你🐾",
                    "error": "交易已取消。",
                    "footer": "要发送 TASTE，请复制地址并从您的钱包手动发送。"
                },
                "taste_info": {
                    "title": "捐赠TASTE",
                    "desc": "上面的钱包地址也接受TASTE。您可以使用 Tonkeeper、TonWallet 或 STON.fi 发送任意数量的 TASTE。"
                },
                "gallery": {
                    "badge": "给予艾滋病",
                    "title": "证明及文件",
                    "records": "记录",
                    "empty_title": "尚未添加任何证明",
                    "empty_desc": "所提供援助的照片和文件将在此发布。我们保持透明！ ✅",
                    "close": "关闭"
                }
            },
            "legal": {
                "header": {
                    "badge": "法律文件",
                    "title": "法律信息",
                    "subtitle": "适用条款和条件",
                    "warning": "⚠️此应用程序<1>不包含投资建议。</1>加密资产具有高风险。"
                },
                "nav": {
                    "disclaimer": {
                        "label": "免责声明",
                        "sub": "法律声明"
                    },
                    "terms": {
                        "label": "使用条款",
                        "sub": "使用政策"
                    },
                    "privacy": {
                        "label": "隐私政策",
                        "sub": "数据保护"
                    },
                    "risk": {
                        "label": "风险披露",
                        "sub": "财务风险"
                    }
                },
                "footer": {
                    "last_updated": "最后更新时间：2025 年 3 月 · TASTE 代币 © 2025",
                    "network": "建立在开放网络之上"
                },
                "doc_info": "最后更新时间：2025 年 3 月 |本文件以土耳其语和英语编写。",
                "disclaimer": {
                    "section1": {
                        "title": "🚫 并非投资建议",
                        "sub": "免责声明",
                        "text": "本应用程序中的任何内容，包括价格信息、图表、分析、预测或任何声明，均不得解释为投资建议、财务建议或购买或出售要约。",
                        "eng_note": "土耳其语紧随其后。 <1>英语是主要法律语言。</1>"
                    },
                    "section2": {
                        "title": "⚖️ 责任限制",
                        "sub": "法律限制",
                        "text": "TASTE Token 团队不对基于本申请做出的任何决定承担法律责任，包括直接或间接的经济损失。",
                        "eng_note": "土耳其语紧随其后。 <1>英语是主要法律语言。</1>"
                    },
                    "section3": {
                        "title": "🌍 监管合规性",
                        "sub": "法律合规性",
                        "text": "您所在的国家/地区可能会限制购买或出售加密货币。用户承担按照当地法律行事的全部责任。",
                        "eng_note": "土耳其语紧随其后。 <1>英语是主要法律语言。</1>"
                    }
                },
                "terms": {
                    "intro": "使用此应用程序即表示您同意以下条款。",
                    "section1": {
                        "title": "📌 一般条款",
                        "sub": "用法",
                        "text": "此应用程序仅供参考。用户对自己的代币负责。"
                    },
                    "section2": {
                        "title": "🔄 代币条款",
                        "sub": "交换",
                        "text": "STON.fi 或其他 DEX 上的交易由用户自行决定。"
                    },
                    "section3": {
                        "title": "🚫 禁止用途",
                        "sub": "禁止",
                        "text": "严格禁止洗钱或非法金融交易。"
                    },
                    "section4": {
                        "title": "🗣️社区政策（UGC）",
                        "sub": "内容",
                        "text": "用户帖子（食谱、照片）由用户负责。 <1>过敏原和卡路里数据</1>仅供参考。 <2>不保证绝对准确性</2>。"
                    },
                    "section5": {
                        "title": "⚙️修改权",
                        "sub": "更新",
                        "text": "我们保留更新这些条款的权利，恕不另行通知。"
                    }
                },
                "privacy": {
                    "intro": "您的隐私对我们很重要。本政策解释了数据收集。",
                    "section1": {
                        "title": "📊 我们收集的数据",
                        "sub": "隐私",
                        "text": "我们收集您在 Feed 中分享的社区个人资料的<1>Telegram 用户信息</1>（ID、姓名）以及<1>社区数据</1>。",
                        "note": "承诺：<1>绝不会出售个人数据。</1>"
                    },
                    "section2": {
                        "title": "🔗 第三方",
                        "sub": "集成",
                        "text": "与 <1>TON Blockchain</1> 和 <1>STON.fi</1> 的集成受其自身政策的约束。"
                    },
                    "section3": {
                        "title": "🗑️数据删除",
                        "sub": "清理",
                        "text": "清除缓存会删除本地首选项。区块链记录是永久的。"
                    },
                    "section4": {
                        "title": "📩 联系方式",
                        "sub": "支持",
                        "text": "有关隐私问题，请通过 Telegram 渠道联系我们。"
                    }
                },
                "risk": {
                    "intro_title": "⛔ 高风险警告",
                    "intro_text": "加密资产波动性很大。您可能<1>损失所有投资。</1>",
                    "section1": {
                        "title": "📉 市场风险",
                        "sub": "挥发性",
                        "text": "TASTE值可以立即降至零。过去的表现并不能保证。"
                    },
                    "section2": {
                        "title": "💧 流动性风险",
                        "sub": "贸易",
                        "text": "以您想要的价格出售 TASTE 可能并不总是可行。"
                    },
                    "section3": {
                        "title": "🔧 技术风险",
                        "sub": "网络",
                        "text": "区块链网络问题或<1>智能合约</1>漏洞具有内在风险。"
                    },
                    "section4": {
                        "title": "⚖️监管风险",
                        "sub": "政策",
                        "text": "法律改变。用户承担未来法律限制的风险。"
                    },
                    "section5": {
                        "title": "💡推荐方法",
                        "sub": "安全",
                        "text": "只投资你可能会失去的东西。迪尔。"
                    }
                }
            },
            "community": {
                "nav_title": "社区",
                "title": "食品饲料",
                "share": "分享",
                "stats": {
                    "posts": "帖子",
                    "likes": "喜欢",
                    "allergens": "过敏原标签"
                },
                "search_ph": "搜索食物、食谱或地点...",
                "filters": {
                    "all": "全部",
                    "food": "食物",
                    "recipe": "食谱",
                    "menu": "菜单",
                    "career": "职业/工作"
                },
                "trending": "最喜欢的",
                "loading": "正在加载帖子...",
                "no_results": "没有找到结果",
                "no_posts_title": "还没有帖子",
                "no_posts_desc": "成为第一个分享东西的人！",
                "detail": "详情 →",
                "create_title": "新帖子",
                "venue_ph": "场地名称",
                "city_ph": "城市",
                "recipe_ph": "配方名称",
                "ph_food": "今天吃了什么？它怎么样？",
                "ph_recipe": "关于食谱的简短说明...",
                "ph_menu": "您对场地有何看法？",
                "calories_ph": "卡路里（例如~450 kcal）",
                "mark_allergens": "马克·过敏原",
                "ingredients_title": "🥄 成分",
                "ing_ph": "成分",
                "amt_ph": "数量",
                "add_ing": "+ 添加成分",
                "steps_title": "📋准备步骤",
                "step_ph": "步骤 {{n}}...",
                "add_step": "+ 添加步骤",
                "tags_title": "标签",
                "add_photo": "📷 添加照片（可选）",
                "sharing": "⏳ 分享...",
                "share_btn": "🚀 分享",
                "allergen_warning": "过敏原警告",
                "directions": "路线",
                "close": "关闭",
                "shared_from": "分享自 TASTE 小程序 🍳",
                "just_now": "现在",
                "min_ago": "{{n}} 分钟前",
                "hrs_ago": "{{n}} 小时前",
                "days_ago": "{{n}}天前",
                "ingredients_count": "{{n}} 成分 · {{s}} 步骤",
                "tags": {
                    "breakfast": "早餐",
                    "lunch": "午餐",
                    "dinner": "晚餐",
                    "snack": "小吃",
                    "dessert": "甜点",
                    "vegan": "素食主义者",
                    "vegetarian": "素食",
                    "soup": "汤",
                    "meat": "肉类菜肴",
                    "vegetables": "蔬菜",
                    "traditional": "传统的",
                    "practical": "实际的",
                    "healthy": "健康",
                    "cafe": "咖啡店",
                    "fastfood": "快餐",
                    "finedining": "精致餐饮",
                    "seafood": "海鲜",
                    "job_listing": "职位列表",
                    "job_seeking": "求职",
                    "chef": "厨师",
                    "cook": "厨师",
                    "waiter": "服务员",
                    "master": "掌握"
                },
                "allergens": {
                    "G": "麸质",
                    "SÜ": "牛奶",
                    "Y": "蛋",
                    "B": "鱼",
                    "KA": "甲壳类",
                    "YF": "花生",
                    "S": "大豆",
                    "KM": "坚果",
                    "H": "芥末",
                    "SS": "芝麻",
                    "SÜL": "硫",
                    "KE": "芹菜",
                    "AB": "羽扇豆",
                    "YU": "软体动物"
                },
                "job_post": "职位发布",
                "reward_wallet": "奖励钱包",
                "chat_poster": "与海报聊天",
                "alert_success_global": "伟大的！您的帖子已在全球范围内分享！ 🚀",
                "alert_success": "帖子已分享！ 🚀",
                "tab_feed": "喂养",
                "tab_jobs": "工作机会",
                "tab_chat": "聊天",
                "btn_share_win": "🚀 分享并赢取 5 种口味！",
                "no_posts": "还没有帖子",
                "ph_chat": "输入消息...",
                "ph_position": "餐厅职位",
                "ph_job_desc": "在这里写下您的职位信息或寻求详细信息...",
                "lbl_wallet_reward": "奖励钱包地址",
                "lbl_wallet_note": "* 发帖后别忘了截图分享到TG群哦！"
            },
            "jobs": {
                "title": "品味工作",
                "subtitle": "美食职业与社区",
                "tabs": {
                    "feed": "喂养",
                    "board": "木板",
                    "reviews": "评论",
                    "profiles": "型材"
                },
                "types": {
                    "listing": "职位列表",
                    "seeking": "寻找工作",
                    "today": "🔥 今天"
                },
                "actions": {
                    "apply": "申请",
                    "message": "发送消息",
                    "join_now": "立即加入",
                    "add_job": "添加列表",
                    "add_review": "添加评论",
                    "add_cv": "添加简历",
                    "back": "后退",
                    "cancel": "取消",
                    "submit": "提交",
                    "publishing": "出版...",
                    "sending": "正在发送...",
                    "saving": "保存...",
                    "submit_review": "⭐ 添加评论（+5 口味）",
                    "submit_cv": "💾 发布我的简历",
                    "success_listing": "列表发布成功！ 🎉",
                    "success_apply": "申请已发送！",
                    "tg_redirect": "正在重定向到电报..."
                },
                "placeholders": {
                    "title": "职位名称（例如经验丰富的服务员）",
                    "desc": "详细信息（经验、时间等）",
                    "city": "选择城市",
                    "salary": "工资（例如 25k 土耳其里拉）",
                    "why_join": "你为什么想加入？",
                    "apply_msg": "写下您的申请信息...",
                    "city_opt": "选择城市",
                    "profession": "选择职业",
                    "business_name": "公司名称（例如 XYZ 餐厅）",
                    "review_msg": "写下您的评论...（工作条件、管理等）",
                    "experience": "经验（例如 5 年酒店厨房经验）",
                    "bio": "说说你自己..."
                },
                "reviews": {
                    "title": "商业评论",
                    "tip": "检查你的工作场所。帮助社区！赚取<1>+5 品味</1>。",
                    "business_ph": "企业名称",
                    "overall": "总分",
                    "salary": "薪水",
                    "env": "环境",
                    "mgmt": "管理",
                    "comment_ph": "你的评论...",
                    "success": "评论发表！ +5 赢得 TASTE 🎉"
                },
                "profiles": {
                    "title": "个人资料和简历",
                    "add_btn": "+ 添加简历",
                    "profession_ph": "选择专业",
                    "exp_ph": "经验（例如5年）",
                    "bio_ph": "简短的生物...",
                    "photo_label": "个人资料照片",
                    "photo_btn": "从图库中选择照片",
                    "skills_label": "技能",
                    "success": "简历已发布！其他人可以看到你🎉",
                    "empty": "还没有个人资料。成为第一！"
                },
                "feed": {
                    "title": "厨房饲料",
                    "new_post": "新帖子",
                    "success_post": "帖子发布了！分享截图至 TG Group → +5 TASTE！ 🎉",
                    "types": {
                        "food": "食物",
                        "recipe": "食谱",
                        "menu": "菜单"
                    },
                    "placeholders": {
                        "food": "说说你的菜...",
                        "recipe": "分享你的食谱...",
                        "menu": "描述一下你的菜单..."
                    }
                }
            },
            "tastepay": {
                "title": "快速轻松的付款",
                "desc": "无论在世界任何地方，使用 TASTE 都可以在几秒钟内付款或收款。",
                "receive": "创建发票",
                "scan": "扫码支付",
                "scan_desc": "顾客模式·结账扫码支付",
                "receive_btn": "接收付款",
                "receive_desc": "商业模式 · 创建二维码供客户支付",
                "wallet_connected": "✓ 钱包已连接",
                "wallet_required": "您必须连接钱包才能付款",
                "receive_amount_title": "收到金额",
                "cam_denied": "相机权限被拒绝。请在设置中允许。",
                "cam_not_found": "未找到相机。",
                "cam_failed": "无法打开相机：",
                "scan_qr_text": "结账时扫描二维码即可付款",
                "retry_cam": "重试相机",
                "native_cam": "原生相机",
                "invoice_no": "发票号码：",
                "live_rate": "直播率：1 TASTE ≈",
                "to_receive": "接收",
                "enter_amount": "输入金额",
                "err_wallet": "请先连接您的钱包",
                "err_amount": "金额无效",
                "err_balance": "味觉平衡不足！必需：{{req}}，可用：{{avail}}",
                "err_fee": "交易费用至少需要0.2 TON",
                "confirm_title": "总结与确认",
                "recipient": "收件人钱包",
                "amount": "数量",
                "rate": "费率（固定）",
                "to_pay": "品味付款",
                "fee": "网络费",
                "btn_confirm": "确认并付款",
                "btn_processing": "加工...",
                "success_title": "付款已发送！",
                "success_desc": "交易发送到区块链。几秒钟后就会得到确认。",
                "view_explorer": "在 Tonviewer 上查看",
                "back_menu": "返回菜单",
                "fail_title": "付款失败",
                "retry": "重试",
                "cancel": "取消"
            },
            "chef": {
                "title": "品味厨师",
                "subtitle": "数字忠诚度和折扣",
                "safe_title": "社区主保险柜",
                "fill_safe": "安全填充",
                "discount_right": "折扣权",
                "min_hold_warning": "您必须持有至少 2,000 TASTE 才能享受折扣。",
                "next_level": "下一个级别：",
                "units_needed": "更需要单位",
                "connect_warning": "连接钱包即可使用折扣。",
                "get_discount": "在收银台获得折扣",
                "success_title": "交易成功！",
                "success_desc": "折扣已获批准。把这个给工作人员看。",
                "mastery_levels": "掌握水平和好处",
                "nearby_venues": "合作餐厅（附近）",
                "nearby_branch": "离您最近的分行",
                "nav_tip": "* 我们的导航会自动扫描您所在区域的 TASTE 有效地点。",
                "legal_title": "法律要求和规则",
                "legal_points": [
                    "该系统仅用于忠诚度目的。它不包含投资建议或金融工具。",
                    "折扣权利是根据您钱包中的所有权状态自动定义的。",
                    "在此过程中发送的费用是系统使用费和验证费。",
                    "品味不是一种付款方式。不接受加密货币付款。账单以当地货币支付。",
                    "18 岁以上年龄限制是强制性的。用户应对虚假陈述负责。"
                ],
                "tiers": {
                    "bronze": "学徒",
                    "silver": "熟手",
                    "gold": "掌握",
                    "diamond": "厨师"
                }
            },
            "team": {
                "title": "项目团队成员",
                "subtitle": "构建 TASTE 生态系统的远见卓识",
                "contact": "接触",
                "roles": {
                    "founder": "创始人/战略与愿景",
                    "lead_dev": "首席开发人员/架构师",
                    "marketing": "首席营销官/品牌成长",
                    "community": "社区及媒体经理",
                    "little_queen": "社区经理",
                    "legend_love": "社区及媒体经理",
                    "fatih_kaya": "财务协调员"
                },
                "bios": {
                    "founder": "TASTE 项目背后的远见卓识。搭建美食与区块链之间的桥梁。",
                    "lead_dev": "代码和架构硕士。将 TASTE 愿景转变为可扩展、安全的数字现实。",
                    "marketing": "战略思维扩大 TASTE 的全球影响力。通过 Web3 连接烹​​饪世界。",
                    "community": "主持人、社交媒体专家和广告商。也是竞赛组织者和社区建设者。",
                    "little_queen": "专注于社区发展、社交媒体互动和支持 TASTE 支持者。",
                    "legend_love": "主持人、社交媒体专家和广告商。也是竞赛组织者和社区建设者。",
                    "fatih_kaya": "创始人、策划者、指导者。拥抱、承担并尝试执行 TASTE 项目的人。确保厨房团队得到财政支持。"
                }
            }
        }
    }
};;

const savedLang = localStorage.getItem('i18nextLng');
const getInitialLang = () => {
    const supported = ['tr', 'en', 'ru', 'ar', 'zh'];
    if (savedLang) {
        const lang = savedLang.toLowerCase().split('-')[0];
        if (supported.includes(lang)) {
            return lang;
        }
    }
    
    // Auto detect from Telegram or browser
    const tgLang = (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.language_code;
    const browserLang = navigator.language || (navigator as any).userLanguage || 'en';
    const detectedLang = (tgLang || browserLang || '').toLowerCase().split('-')[0];
    
    if (supported.includes(detectedLang)) {
        return detectedLang;
    }
    return 'en';
};
const initialLang = getInitialLang();

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: initialLang,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
