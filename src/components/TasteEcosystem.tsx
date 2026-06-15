import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface EcosystemProps {
  onNavigate: (tab: string) => void;
  onOpenTastePay?: () => void;
}

const ECO_SECTIONS = [
  {
    id: 'token',
    icon: '🪙',
    titleKey: 'eco.token.title',
    descKey: 'eco.token.desc',
    color: '#f59e0b',
    glow: 'rgba(245,159,11,0.25)',
    badge: 'LIVE',
    badgeColor: '#10b981',
    navTarget: null,
    externalUrl: 'https://app.ston.fi/swap?chartVisible=false&ft=TON&tt=EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-',
    items: ['eco.token.i1', 'eco.token.i2', 'eco.token.i3', 'eco.token.i4'],
    stats: [
      { label: 'Total Supply', value: '25M' },
      { label: 'Locked', value: '88.4%' },
      { label: 'Pool', value: 'STON.fi' },
    ]
  },
  {
    id: 'swap',
    icon: '⚡',
    titleKey: 'eco.swap.title',
    descKey: 'eco.swap.desc',
    color: '#6366f1',
    glow: 'rgba(99,102,241,0.25)',
    badge: 'STON.fi',
    badgeColor: '#6366f1',
    navTarget: 'home',
    items: ['eco.swap.i1', 'eco.swap.i2', 'eco.swap.i3'],
    stats: [
      { label: 'DEX', value: 'STON.fi' },
      { label: 'Chain', value: 'TON' },
      { label: 'Pair', value: 'TON/TASTE' },
    ]
  },
  {
    id: 'pay',
    icon: '💳',
    titleKey: 'eco.pay.title',
    descKey: 'eco.pay.desc',
    color: '#0ea5e9',
    glow: 'rgba(14,165,233,0.25)',
    badge: 'NEW',
    badgeColor: '#f97316',
    navTarget: 'pay',
    items: ['eco.pay.i1', 'eco.pay.i2', 'eco.pay.i3'],
    stats: [
      { label: 'Method', value: 'QR / TonConnect' },
      { label: 'Speed', value: 'Instant' },
      { label: 'Fee', value: '~0.05 TON' },
    ]
  },
  {
    id: 'chef',
    icon: '👨‍🍳',
    titleKey: 'eco.chef.title',
    descKey: 'eco.chef.desc',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.25)',
    badge: 'DEMO',
    badgeColor: '#ef4444',
    navTarget: 'chef',
    items: ['eco.chef.i1', 'eco.chef.i2', 'eco.chef.i3', 'eco.chef.i4'],
    stats: [
      { label: 'Min Hold', value: '2,000 TASTE' },
      { label: 'Levels', value: '4 Tier' },
      { label: 'Benefit', value: 'Discount' },
    ]
  },
  {
    id: 'jobs',
    icon: '🧑‍🍳',
    titleKey: 'eco.jobs.title',
    descKey: 'eco.jobs.desc',
    color: '#f97316',
    glow: 'rgba(249,115,22,0.25)',
    badge: 'NEW',
    badgeColor: '#f97316',
    navTarget: 'community',
    items: ['eco.jobs.i1', 'eco.jobs.i2', 'eco.jobs.i3'],
    stats: [
      { label: 'Platform', value: 'Gastronomy' },
      { label: 'CV Builder', value: '✓ Active' },
      { label: 'Reviews', value: '+5 TASTE' },
    ]
  },
  {
    id: 'ai',
    icon: '🤖',
    titleKey: 'eco.ai.title',
    descKey: 'eco.ai.desc',
    color: '#22d3ee',
    glow: 'rgba(34,211,238,0.25)',
    badge: 'AI',
    badgeColor: '#22d3ee',
    navTarget: 'ai',
    items: ['eco.ai.i1', 'eco.ai.i2', 'eco.ai.i3'],
    stats: [
      { label: 'Engine', value: 'Gemini' },
      { label: 'Lang', value: '5 Dil' },
      { label: 'Focus', value: 'Gastronomy' },
    ]
  },
  {
    id: 'charity',
    icon: '❤️',
    titleKey: 'eco.charity.title',
    descKey: 'eco.charity.desc',
    color: '#f43f5e',
    glow: 'rgba(244,63,94,0.25)',
    badge: 'IMPACT',
    badgeColor: '#f43f5e',
    navTarget: 'charity',
    items: ['eco.charity.i1', 'eco.charity.i2', 'eco.charity.i3'],
    stats: [
      { label: 'Model', value: 'DAO Vote' },
      { label: 'Focus', value: 'Food Aid' },
      { label: 'Pool', value: 'Community' },
    ]
  },
  {
    id: 'community',
    icon: '👥',
    titleKey: 'eco.community.title',
    descKey: 'eco.community.desc',
    color: '#c084fc',
    glow: 'rgba(192,132,252,0.25)',
    badge: 'GLOBAL',
    badgeColor: '#c084fc',
    navTarget: 'community',
    items: ['eco.community.i1', 'eco.community.i2', 'eco.community.i3'],
    stats: [
      { label: 'Langs', value: '5' },
      { label: 'Network', value: 'Telegram' },
      { label: 'Tasks', value: '+TASTE' },
    ]
  },
  {
    id: 'partners',
    icon: '🤝',
    titleKey: 'eco.partners.title',
    descKey: 'eco.partners.desc',
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.25)',
    badge: 'WEB3',
    badgeColor: '#3b82f6',
    navTarget: 'partners',
    items: ['eco.partners.i1', 'eco.partners.i2', 'eco.partners.i3'],
    stats: [
      { label: 'TON', value: 'Ecosystem' },
      { label: 'Real World', value: 'Restaurants' },
      { label: 'Growing', value: '↑' },
    ]
  },
  {
    id: 'vote',
    icon: '🗳️',
    titleKey: 'eco.vote.title',
    descKey: 'eco.vote.desc',
    color: '#eab308',
    glow: 'rgba(234,179,8,0.25)',
    badge: 'DAO',
    badgeColor: '#eab308',
    navTarget: 'vote',
    items: ['eco.vote.i1', 'eco.vote.i2', 'eco.vote.i3'],
    stats: [
      { label: 'Model', value: 'On-chain' },
      { label: 'Power', value: 'Holders' },
      { label: 'Scope', value: 'Treasury' },
    ]
  },
  {
    id: 'whitepaper',
    icon: '📖',
    titleKey: 'eco.whitepaper.title',
    descKey: 'eco.whitepaper.desc',
    color: '#64748b',
    glow: 'rgba(100,116,139,0.25)',
    badge: 'DOCS',
    badgeColor: '#64748b',
    navTarget: 'whitepaper',
    items: ['eco.whitepaper.i1', 'eco.whitepaper.i2', 'eco.whitepaper.i3'],
    stats: [
      { label: 'Whitepaper', value: 'Full' },
      { label: 'Roadmap', value: 'Phase 1-3' },
      { label: 'Manifesto', value: '✓' },
    ]
  },
];

const MULTILANG_FALLBACKS: Record<string, Record<string, string>> = {
  en: {
    'eco.header.title': 'TASTE ECOSYSTEM',
    'eco.header.subtitle': 'A TON-based Web3 ecosystem built for the food & beverage industry',
    'eco.header.stat.token': 'Token', 'eco.header.stat.chain': 'Chain', 'eco.header.stat.modules': 'Modules', 'eco.header.stat.lang': 'Lang',
    'eco.flow.title': 'ECOSYSTEM FLOW',
    'eco.flow.step1': 'Get TON', 'eco.flow.step2': 'TASTE Swap', 'eco.flow.step3': 'Hold & Earn', 'eco.flow.step4': 'Become Chef', 'eco.flow.step5': 'Use & Pay', 'eco.flow.step6': 'Grow',
    'eco.cta.token': 'BUY TASTE →', 'eco.cta.swap': 'GO TO SWAP →', 'eco.cta.pay': 'OPEN TASTE PAY →', 'eco.cta.chef': 'CHEF MODE →',
    'eco.cta.jobs': 'VIEW JOB LISTINGS →', 'eco.cta.spin': 'SPIN THE WHEEL →', 'eco.cta.ai': 'OPEN AI →', 'eco.cta.charity': 'GO TO CHARITY →',
    'eco.cta.community': 'JOIN COMMUNITY →', 'eco.cta.partners': 'VIEW PARTNERS →', 'eco.cta.vote': 'CAST VOTE →', 'eco.cta.whitepaper': 'READ DOCS →', 'eco.cta.default': 'GO →',
    'eco.banner.title': 'TASTE Ecosystem is Growing', 'eco.banner.desc': 'We are pioneering the Web3 transformation of the food & beverage industry. Every new module comes to life with the power of the community.', 'eco.banner.whitepaper': '📖 Whitepaper', 'eco.banner.roadmap': '🗺️ Roadmap',
    'eco.token.title': 'TASTE Token', 'eco.token.desc': 'A utility token with 25M supply, 88% locked, designed for the food & beverage industry on the TON blockchain.', 'eco.token.i1': '25,000,000 total supply', 'eco.token.i2': '88.4% locked in JVault', 'eco.token.i3': 'Trading on STON.fi DEX', 'eco.token.i4': 'Native token in TON ecosystem',
    'eco.swap.title': 'TASTE Swap', 'eco.swap.desc': 'Buy TASTE instantly with TON. Fast, secure transactions via STON.fi DEX integration.', 'eco.swap.i1': 'Via STON.fi DEX', 'eco.swap.i2': 'Tonkeeper deep link', 'eco.swap.i3': 'Instant transaction confirmation',
    'eco.pay.title': 'TASTE Pay', 'eco.pay.desc': 'Pay or receive at restaurants in seconds via QR code and TonConnect.', 'eco.pay.i1': 'Pay via QR code', 'eco.pay.i2': 'Business mode: Create invoice', 'eco.pay.i3': 'Instant blockchain confirmation',
    'eco.chef.title': 'Taste Chef', 'eco.chef.desc': 'Hold TASTE, level up your chef rank, earn loyalty discounts at partner restaurants.', 'eco.chef.i1': 'Apprentice → Journeyman → Master → Chef', 'eco.chef.i2': 'Discount with 2,000+ TASTE', 'eco.chef.i3': 'Partner restaurant network', 'eco.chef.i4': 'Blockchain-based loyalty',
    'eco.jobs.title': 'TASTE Jobs', 'eco.jobs.desc': 'Job listings, CV builder and workplace review platform for the gastronomy sector.', 'eco.jobs.i1': 'Kitchen job listings', 'eco.jobs.i2': 'Create and share your CV', 'eco.jobs.i3': 'Workplace review (+5 TASTE)',
    'eco.spin.title': 'Spin & Earn', 'eco.spin.desc': 'Spin the daily wheel, earn TASTE, climb the leaderboard.', 'eco.spin.i1': 'Daily free spin', 'eco.spin.i2': 'Energy system', 'eco.spin.i3': 'Weekly leaderboard',
    'eco.ai.title': 'TASTE AI', 'eco.ai.desc': 'AI assistant answering your questions about gastronomy, tokens, and the TASTE ecosystem.', 'eco.ai.i1': 'Powered by Gemini AI', 'eco.ai.i2': '5-language support', 'eco.ai.i3': 'Gastronomy-focused knowledge',
    'eco.charity.title': 'TASTE Charity', 'eco.charity.desc': 'Support food aid projects through community voting. DAO model.', 'eco.charity.i1': 'Transparent governance via DAO', 'eco.charity.i2': 'Food aid focused', 'eco.charity.i3': 'Community treasury',
    'eco.community.title': 'Community', 'eco.community.desc': 'Global culinary community in 5 languages. Complete tasks, earn TASTE.', 'eco.community.i1': 'Social tasks and rewards', 'eco.community.i2': 'Telegram-based network', 'eco.community.i3': '5-language community',
    'eco.partners.title': 'Partners', 'eco.partners.desc': 'We grow the ecosystem with real-world and Web3 partners.', 'eco.partners.i1': 'Physical restaurant partners', 'eco.partners.i2': 'TON ecosystem protocols', 'eco.partners.i3': 'Constantly growing network',
    'eco.vote.title': 'DAO Voting', 'eco.vote.desc': 'Shape the future of the project as a token holder. On-chain governance.', 'eco.vote.i1': 'Holders participate in governance', 'eco.vote.i2': 'Treasury decisions', 'eco.vote.i3': 'On-chain transparency',
    'eco.whitepaper.title': 'Documents', 'eco.whitepaper.desc': 'Whitepaper, Roadmap, Manifesto and all official documents here.', 'eco.whitepaper.i1': 'Full technical whitepaper', 'eco.whitepaper.i2': 'Phase 1-3 roadmap', 'eco.whitepaper.i3': 'Manifesto & Legal',
  },
  tr: {
    'eco.header.title': 'TASTE EKOSİSTEMİ',
    'eco.header.subtitle': 'Yiyecek-içecek sektörü için kurulmuş TON tabanlı Web3 ekosistemi',
    'eco.header.stat.token': 'Token', 'eco.header.stat.chain': 'Zincir', 'eco.header.stat.modules': 'Modüller', 'eco.header.stat.lang': 'Dil',
    'eco.flow.title': 'EKOSİSTEM AKIŞI',
    'eco.flow.step1': 'TON Al', 'eco.flow.step2': 'TASTE Swap', 'eco.flow.step3': 'Tut & Kazan', 'eco.flow.step4': 'Chef Ol', 'eco.flow.step5': 'Kullan & Öde', 'eco.flow.step6': 'Büyü',
    'eco.cta.token': 'TASTE SATIN AL →', 'eco.cta.swap': 'SWAP\'A GİT →', 'eco.cta.pay': 'TASTE PAY AÇ →', 'eco.cta.chef': 'CHEF MODU →',
    'eco.cta.jobs': 'İŞ İLANLARINA BAK →', 'eco.cta.spin': 'ÇARKI ÇEVİR →', 'eco.cta.ai': 'AI\'YI AÇ →', 'eco.cta.charity': 'HAYIR KURUMUNA GİT →',
    'eco.cta.community': 'TOPLULUĞA KATIL →', 'eco.cta.partners': 'ORTAKLARI GÖR →', 'eco.cta.vote': 'OY VER →', 'eco.cta.whitepaper': 'DÖKÜMANLARI OKU →', 'eco.cta.default': 'GİT →',
    'eco.banner.title': 'TASTE Ekosistemi Büyüyor', 'eco.banner.desc': 'Yiyecek-içecek sektörünün Web3 dönüşümüne öncülük ediyoruz. Her yeni modül, topluluğun gücüyle hayata geçiyor.', 'eco.banner.whitepaper': '📖 Whitepaper', 'eco.banner.roadmap': '🗺️ Roadmap',
    'eco.token.title': 'TASTE Token', 'eco.token.desc': 'TON blockchain üzerinde 25 milyon arzlı, %88 kilitli, yiyecek-içecek sektörü için tasarlanmış utility token.', 'eco.token.i1': '25,000,000 toplam arz', 'eco.token.i2': '%88.4 JVault\'ta kilitli', 'eco.token.i3': 'STON.fi DEX\'te işlem görür', 'eco.token.i4': 'TON ekosisteminde yerli token',
    'eco.swap.title': 'TASTE Swap', 'eco.swap.desc': 'TON ile anında TASTE satın al. STON.fi DEX entegrasyonu ile hızlı, güvenli işlem.', 'eco.swap.i1': 'STON.fi DEX üzerinden', 'eco.swap.i2': 'Tonkeeper derin bağlantısı', 'eco.swap.i3': 'Anlık işlem onayı',
    'eco.pay.title': 'TASTE Pay', 'eco.pay.desc': 'QR kod ve TonConnect ile restoranlarda saniyeler içinde ödeme yap veya al.', 'eco.pay.i1': 'QR kod ile ödeme', 'eco.pay.i2': 'İşletme modu: Fatura oluştur', 'eco.pay.i3': 'Anlık blockchain onayı',
    'eco.chef.title': 'Taste Chef', 'eco.chef.desc': 'TASTE tut, şef seviyeni yükselt, partner restoranlardan sadakat indirimi kazan.', 'eco.chef.i1': 'Çırak → Kalfa → Usta → Şef', 'eco.chef.i2': '2,000+ TASTE ile indirim hakkı', 'eco.chef.i3': 'Partner restoran ağı', 'eco.chef.i4': 'Blockchain tabanlı sadakat',
    'eco.jobs.title': 'TASTE Jobs', 'eco.jobs.desc': 'Gastronomi sektörü için iş ilanı, CV oluşturma ve işyeri değerlendirme platformu.', 'eco.jobs.i1': 'Mutfak iş ilanları', 'eco.jobs.i2': 'CV oluştur ve paylaş', 'eco.jobs.i3': 'İşyeri değerlendirme (+5 TASTE)',
    'eco.spin.title': 'Spin & Earn', 'eco.spin.desc': 'Günlük çark çevir, TASTE kazan, liderlik tablosunda yüksel.', 'eco.spin.i1': 'Günlük ücretsiz çevirme hakkı', 'eco.spin.i2': 'Enerji sistemi', 'eco.spin.i3': 'Haftalık liderlik tablosu',
    'eco.ai.title': 'TASTE AI', 'eco.ai.desc': 'Gastronomi, token ve TASTE ekosistemi hakkında sorularını yanıtlayan yapay zeka asistanı.', 'eco.ai.i1': 'Gemini AI destekli', 'eco.ai.i2': '5 dil desteği', 'eco.ai.i3': 'Gastronomi odaklı bilgi',
    'eco.charity.title': 'TASTE Charity', 'eco.charity.desc': 'Topluluk oylaması ile gıda yardımı projesini destekle. DAO modeli.', 'eco.charity.i1': 'DAO ile şeffaf yönetim', 'eco.charity.i2': 'Gıda yardımı odaklı', 'eco.charity.i3': 'Topluluk hazinesi',
    'eco.community.title': 'Topluluk', 'eco.community.desc': '5 dilde küresel mutfak topluluğu. Görevler tamamla, TASTE kazan.', 'eco.community.i1': 'Sosyal görevler ve ödüller', 'eco.community.i2': 'Telegram tabanlı ağ', 'eco.community.i3': '5 dil topluluğu',
    'eco.partners.title': 'Ortaklar', 'eco.partners.desc': 'Gerçek dünya ve Web3 ortaklarıyla ekosistemi büyütüyoruz.', 'eco.partners.i1': 'Fiziksel restoran ortakları', 'eco.partners.i2': 'TON ekosistem protokolleri', 'eco.partners.i3': 'Sürekli büyüyen ağ',
    'eco.vote.title': 'DAO Oylama', 'eco.vote.desc': 'Token sahibi olarak projenin geleceğini şekillendir. On-chain yönetim.', 'eco.vote.i1': 'Holder\'lar yönetime katılır', 'eco.vote.i2': 'Hazine kararları', 'eco.vote.i3': 'On-chain şeffaflık',
    'eco.whitepaper.title': 'Dokümanlar', 'eco.whitepaper.desc': 'Whitepaper, Roadmap, Manifesto ve tüm resmi belgeler burada.', 'eco.whitepaper.i1': 'Tam teknik whitepaper', 'eco.whitepaper.i2': 'Faz 1-3 yol haritası', 'eco.whitepaper.i3': 'Manifesto & Legal',
  },
  ru: {
    'eco.header.title': 'ЭКОСИСТЕМА TASTE',
    'eco.header.subtitle': 'Экосистема Web3 на блокчейне TON для сферы питания и напитков',
    'eco.header.stat.token': 'Токен', 'eco.header.stat.chain': 'Сеть', 'eco.header.stat.modules': 'Модули', 'eco.header.stat.lang': 'Языки',
    'eco.flow.title': 'ПОТОК ЭКОСИСТЕМЫ',
    'eco.flow.step1': 'Купить TON', 'eco.flow.step2': 'Своп TASTE', 'eco.flow.step3': 'Держать и Зарабатывать', 'eco.flow.step4': 'Стать Шефом', 'eco.flow.step5': 'Использовать и Платить', 'eco.flow.step6': 'Расти',
    'eco.cta.token': 'КУПИТЬ TASTE →', 'eco.cta.swap': 'ПЕРЕЙТИ К СВОПУ →', 'eco.cta.pay': 'ОТКРЫТЬ TASTE PAY →', 'eco.cta.chef': 'РЕЖИМ ШЕФА →',
    'eco.cta.jobs': 'СМОТРЕТЬ ВАКАНСИИ →', 'eco.cta.spin': 'КРУТИТЬ КОЛЕСО →', 'eco.cta.ai': 'ОТКРЫТЬ AI →', 'eco.cta.charity': 'БЛАГОТВОРИТЕЛЬНОСТЬ →',
    'eco.cta.community': 'ПРИСОЕДИНИТЬСЯ →', 'eco.cta.partners': 'ПАРТНЁРЫ →', 'eco.cta.vote': 'ГОЛОСОВАТЬ →', 'eco.cta.whitepaper': 'ЧИТАТЬ ДОКИ →', 'eco.cta.default': 'ПЕРЕЙТИ →',
    'eco.banner.title': 'Экосистема TASTE Растёт', 'eco.banner.desc': 'Мы возглавляем Web3-трансформацию ресторанной индустрии. Каждый новый модуль создаётся силой сообщества.', 'eco.banner.whitepaper': '📖 Белая Книга', 'eco.banner.roadmap': '🗺️ Дорожная Карта',
    'eco.token.title': 'Токен TASTE', 'eco.token.desc': 'Утилитарный токен с объёмом 25M, 88% заблокировано, создан для ресторанной индустрии на блокчейне TON.', 'eco.token.i1': '25 000 000 общее предложение', 'eco.token.i2': '88.4% заблокировано в JVault', 'eco.token.i3': 'Торговля на STON.fi DEX', 'eco.token.i4': 'Нативный токен в экосистеме TON',
    'eco.swap.title': 'Своп TASTE', 'eco.swap.desc': 'Купите TASTE мгновенно за TON. Быстрые, безопасные транзакции через STON.fi DEX.', 'eco.swap.i1': 'Через STON.fi DEX', 'eco.swap.i2': 'Глубокая ссылка Tonkeeper', 'eco.swap.i3': 'Мгновенное подтверждение транзакции',
    'eco.pay.title': 'TASTE Pay', 'eco.pay.desc': 'Оплачивайте или принимайте оплату в ресторанах за секунды через QR-код и TonConnect.', 'eco.pay.i1': 'Оплата по QR-коду', 'eco.pay.i2': 'Режим бизнеса: создать счёт', 'eco.pay.i3': 'Мгновенное подтверждение блокчейна',
    'eco.chef.title': 'Taste Chef', 'eco.chef.desc': 'Держите TASTE, повышайте ранг шефа, получайте скидки лояльности в партнёрских ресторанах.', 'eco.chef.i1': 'Ученик → Подмастерье → Мастер → Шеф', 'eco.chef.i2': 'Скидка при 2 000+ TASTE', 'eco.chef.i3': 'Сеть партнёрских ресторанов', 'eco.chef.i4': 'Лояльность на блокчейне',
    'eco.jobs.title': 'TASTE Jobs', 'eco.jobs.desc': 'Вакансии, конструктор резюме и платформа оценки работодателей для гастрономии.', 'eco.jobs.i1': 'Вакансии на кухне', 'eco.jobs.i2': 'Создайте и поделитесь резюме', 'eco.jobs.i3': 'Отзыв о работодателе (+5 TASTE)',
    'eco.spin.title': 'Spin & Earn', 'eco.spin.desc': 'Крутите ежедневное колесо, зарабатывайте TASTE, поднимайтесь в таблице лидеров.', 'eco.spin.i1': 'Ежедневное бесплатное вращение', 'eco.spin.i2': 'Система энергии', 'eco.spin.i3': 'Еженедельная таблица лидеров',
    'eco.ai.title': 'TASTE AI', 'eco.ai.desc': 'ИИ-ассистент, отвечающий на вопросы о гастрономии, токенах и экосистеме TASTE.', 'eco.ai.i1': 'На базе Gemini AI', 'eco.ai.i2': 'Поддержка 5 языков', 'eco.ai.i3': 'Знания о гастрономии',
    'eco.charity.title': 'TASTE Charity', 'eco.charity.desc': 'Поддержите проекты продовольственной помощи через голосование сообщества. Модель DAO.', 'eco.charity.i1': 'Прозрачное управление через DAO', 'eco.charity.i2': 'Направленность на продовольственную помощь', 'eco.charity.i3': 'Казна сообщества',
    'eco.community.title': 'Сообщество', 'eco.community.desc': 'Глобальное кулинарное сообщество на 5 языках. Выполняйте задания, зарабатывайте TASTE.', 'eco.community.i1': 'Социальные задания и награды', 'eco.community.i2': 'Сеть на базе Telegram', 'eco.community.i3': 'Сообщество на 5 языках',
    'eco.partners.title': 'Партнёры', 'eco.partners.desc': 'Развиваем экосистему с реальными и Web3-партнёрами.', 'eco.partners.i1': 'Партнёры-рестораны', 'eco.partners.i2': 'Протоколы экосистемы TON', 'eco.partners.i3': 'Постоянно растущая сеть',
    'eco.vote.title': 'DAO Голосование', 'eco.vote.desc': 'Определяйте будущее проекта как держатель токенов. Управление в блокчейне.', 'eco.vote.i1': 'Держатели участвуют в управлении', 'eco.vote.i2': 'Решения по казне', 'eco.vote.i3': 'Прозрачность в блокчейне',
    'eco.whitepaper.title': 'Документы', 'eco.whitepaper.desc': 'Белая книга, Дорожная карта, Манифест и все официальные документы здесь.', 'eco.whitepaper.i1': 'Полный технический whitepaper', 'eco.whitepaper.i2': 'Дорожная карта фаз 1-3', 'eco.whitepaper.i3': 'Манифест и Юридические',
  },
  ar: {
    'eco.header.title': 'نظام TASTE البيئي',
    'eco.header.subtitle': 'نظام Web3 البيئي المبني على TON لقطاع الأغذية والمشروبات',
    'eco.header.stat.token': 'رمز', 'eco.header.stat.chain': 'سلسلة', 'eco.header.stat.modules': 'وحدات', 'eco.header.stat.lang': 'لغات',
    'eco.flow.title': 'تدفق النظام البيئي',
    'eco.flow.step1': 'احصل على TON', 'eco.flow.step2': 'تبادل TASTE', 'eco.flow.step3': 'احتفظ واكسب', 'eco.flow.step4': 'كن شيفاً', 'eco.flow.step5': 'استخدم وادفع', 'eco.flow.step6': 'انمُ',
    'eco.cta.token': 'اشتر TASTE →', 'eco.cta.swap': 'اذهب للتبادل →', 'eco.cta.pay': 'افتح TASTE PAY →', 'eco.cta.chef': 'وضع الشيف →',
    'eco.cta.jobs': 'عروض العمل →', 'eco.cta.spin': 'أدر العجلة →', 'eco.cta.ai': 'افتح AI →', 'eco.cta.charity': 'الخيرية →',
    'eco.cta.community': 'انضم للمجتمع →', 'eco.cta.partners': 'عرض الشركاء →', 'eco.cta.vote': 'صوّت →', 'eco.cta.whitepaper': 'اقرأ الوثائق →', 'eco.cta.default': 'انتقل →',
    'eco.banner.title': 'نظام TASTE البيئي ينمو', 'eco.banner.desc': 'نقود تحول Web3 في قطاع الأغذية والمشروبات. كل وحدة جديدة تولد بقوة المجتمع.', 'eco.banner.whitepaper': '📖 الورقة البيضاء', 'eco.banner.roadmap': '🗺️ خارطة الطريق',
    'eco.token.title': 'رمز TASTE', 'eco.token.desc': 'رمز مساعد بإمداد 25 مليون، 88% مقفل، مصمم لقطاع الأغذية على بلوكشين TON.', 'eco.token.i1': 'إجمالي العرض 25,000,000', 'eco.token.i2': '88.4% مقفل في JVault', 'eco.token.i3': 'التداول على STON.fi DEX', 'eco.token.i4': 'رمز أصلي في نظام TON البيئي',
    'eco.swap.title': 'تبادل TASTE', 'eco.swap.desc': 'اشتر TASTE فوراً بـTON. معاملات سريعة وآمنة عبر STON.fi DEX.', 'eco.swap.i1': 'عبر STON.fi DEX', 'eco.swap.i2': 'رابط عميق Tonkeeper', 'eco.swap.i3': 'تأكيد فوري للمعاملة',
    'eco.pay.title': 'TASTE Pay', 'eco.pay.desc': 'ادفع أو استقبل في المطاعم خلال ثوانٍ عبر QR وTonConnect.', 'eco.pay.i1': 'الدفع عبر QR', 'eco.pay.i2': 'وضع الأعمال: إنشاء فاتورة', 'eco.pay.i3': 'تأكيد بلوكشين فوري',
    'eco.chef.title': 'Taste Chef', 'eco.chef.desc': 'احتفظ بـTASTE، ارفع مستواك، احصل على خصومات الولاء في المطاعم الشريكة.', 'eco.chef.i1': 'متدرب ← صانع ← خبير ← شيف', 'eco.chef.i2': 'خصم مع 2000+ TASTE', 'eco.chef.i3': 'شبكة مطاعم شريكة', 'eco.chef.i4': 'ولاء على البلوكشين',
    'eco.jobs.title': 'TASTE Jobs', 'eco.jobs.desc': 'منصة وظائف وبناء سيرة ذاتية وتقييم أماكن العمل لقطاع الضيافة.', 'eco.jobs.i1': 'وظائف المطبخ', 'eco.jobs.i2': 'أنشئ سيرتك الذاتية وشاركها', 'eco.jobs.i3': 'تقييم مكان العمل (+5 TASTE)',
    'eco.spin.title': 'Spin & Earn', 'eco.spin.desc': 'أدر العجلة يومياً، اكسب TASTE، تسلق قائمة المتصدرين.', 'eco.spin.i1': 'دوران يومي مجاني', 'eco.spin.i2': 'نظام الطاقة', 'eco.spin.i3': 'قائمة متصدرين أسبوعية',
    'eco.ai.title': 'TASTE AI', 'eco.ai.desc': 'مساعد ذكاء اصطناعي يجيب على أسئلتك حول فن الطهي والرموز ونظام TASTE البيئي.', 'eco.ai.i1': 'مدعوم بـGemini AI', 'eco.ai.i2': 'دعم 5 لغات', 'eco.ai.i3': 'معرفة متخصصة بالطهي',
    'eco.charity.title': 'TASTE Charity', 'eco.charity.desc': 'ادعم مشاريع المساعدة الغذائية عبر تصويت المجتمع. نموذج DAO.', 'eco.charity.i1': 'حوكمة شفافة عبر DAO', 'eco.charity.i2': 'تركيز على المساعدة الغذائية', 'eco.charity.i3': 'خزينة المجتمع',
    'eco.community.title': 'المجتمع', 'eco.community.desc': 'مجتمع طهي عالمي بـ5 لغات. أكمل المهام، اكسب TASTE.', 'eco.community.i1': 'مهام اجتماعية ومكافآت', 'eco.community.i2': 'شبكة على Telegram', 'eco.community.i3': 'مجتمع بـ5 لغات',
    'eco.partners.title': 'الشركاء', 'eco.partners.desc': 'ننمو مع شركاء من الواقع وWeb3.', 'eco.partners.i1': 'شركاء مطاعم حقيقيون', 'eco.partners.i2': 'بروتوكولات نظام TON البيئي', 'eco.partners.i3': 'شبكة في نمو مستمر',
    'eco.vote.title': 'تصويت DAO', 'eco.vote.desc': 'شكّل مستقبل المشروع كحامل رمز. حوكمة على البلوكشين.', 'eco.vote.i1': 'الحاملون يشاركون في الحوكمة', 'eco.vote.i2': 'قرارات الخزينة', 'eco.vote.i3': 'شفافية على البلوكشين',
    'eco.whitepaper.title': 'الوثائق', 'eco.whitepaper.desc': 'الورقة البيضاء وخارطة الطريق والمانيفيستو وجميع الوثائق الرسمية هنا.', 'eco.whitepaper.i1': 'الورقة البيضاء التقنية الكاملة', 'eco.whitepaper.i2': 'خارطة طريق المراحل 1-3', 'eco.whitepaper.i3': 'مانيفيستو وقانوني',
  },
  zh: {
    'eco.header.title': 'TASTE 生态系统',
    'eco.header.subtitle': '专为餐饮行业打造的基于TON的Web3生态系统',
    'eco.header.stat.token': '代币', 'eco.header.stat.chain': '链', 'eco.header.stat.modules': '模块', 'eco.header.stat.lang': '语言',
    'eco.flow.title': '生态系统流程',
    'eco.flow.step1': '获取TON', 'eco.flow.step2': 'TASTE交换', 'eco.flow.step3': '持有赚钱', 'eco.flow.step4': '成为厨师', 'eco.flow.step5': '使用支付', 'eco.flow.step6': '成长',
    'eco.cta.token': '购买TASTE →', 'eco.cta.swap': '前往交换 →', 'eco.cta.pay': '打开TASTE PAY →', 'eco.cta.chef': '厨师模式 →',
    'eco.cta.jobs': '查看职位 →', 'eco.cta.spin': '旋转轮盘 →', 'eco.cta.ai': '打开AI →', 'eco.cta.charity': '前往慈善 →',
    'eco.cta.community': '加入社区 →', 'eco.cta.partners': '查看合作伙伴 →', 'eco.cta.vote': '投票 →', 'eco.cta.whitepaper': '阅读文档 →', 'eco.cta.default': '前往 →',
    'eco.banner.title': 'TASTE生态系统正在成长', 'eco.banner.desc': '我们引领餐饮行业的Web3转型。每个新模块都在社区力量的推动下诞生。', 'eco.banner.whitepaper': '📖 白皮书', 'eco.banner.roadmap': '🗺️ 路线图',
    'eco.token.title': 'TASTE代币', 'eco.token.desc': '基于TON区块链的效用代币，总量2500万，88%锁定，专为餐饮行业设计。', 'eco.token.i1': '总供应量25,000,000', 'eco.token.i2': '88.4%锁定在JVault', 'eco.token.i3': '在STON.fi DEX交易', 'eco.token.i4': 'TON生态系统原生代币',
    'eco.swap.title': 'TASTE交换', 'eco.swap.desc': '用TON即时购买TASTE。通过STON.fi DEX集成实现快速安全交易。', 'eco.swap.i1': '通过STON.fi DEX', 'eco.swap.i2': 'Tonkeeper深链接', 'eco.swap.i3': '即时交易确认',
    'eco.pay.title': 'TASTE Pay', 'eco.pay.desc': '通过二维码和TonConnect在餐厅几秒内完成支付或收款。', 'eco.pay.i1': '二维码支付', 'eco.pay.i2': '商业模式：创建发票', 'eco.pay.i3': '即时区块链确认',
    'eco.chef.title': 'Taste Chef', 'eco.chef.desc': '持有TASTE，提升厨师等级，在合作餐厅获得忠诚折扣。', 'eco.chef.i1': '学徒→工匠→大师→厨师长', 'eco.chef.i2': '持有2000+TASTE享折扣', 'eco.chef.i3': '合作餐厅网络', 'eco.chef.i4': '基于区块链的忠诚度',
    'eco.jobs.title': 'TASTE Jobs', 'eco.jobs.desc': '专为餐饮行业打造的职位招聘、简历创建和工作场所评价平台。', 'eco.jobs.i1': '厨房职位招聘', 'eco.jobs.i2': '创建并分享简历', 'eco.jobs.i3': '工作场所评价(+5 TASTE)',
    'eco.spin.title': 'Spin & Earn', 'eco.spin.desc': '每日旋转轮盘，赚取TASTE，攀登排行榜。', 'eco.spin.i1': '每日免费旋转', 'eco.spin.i2': '能量系统', 'eco.spin.i3': '每周排行榜',
    'eco.ai.title': 'TASTE AI', 'eco.ai.desc': 'AI助手，回答您关于美食、代币和TASTE生态系统的问题。', 'eco.ai.i1': '由Gemini AI驱动', 'eco.ai.i2': '支持5种语言', 'eco.ai.i3': '专注于美食知识',
    'eco.charity.title': 'TASTE慈善', 'eco.charity.desc': '通过社区投票支持食物援助项目。DAO模式。', 'eco.charity.i1': '通过DAO透明治理', 'eco.charity.i2': '专注食物援助', 'eco.charity.i3': '社区资金库',
    'eco.community.title': '社区', 'eco.community.desc': '5种语言的全球烹饪社区。完成任务，赚取TASTE。', 'eco.community.i1': '社交任务和奖励', 'eco.community.i2': '基于Telegram的网络', 'eco.community.i3': '5语言社区',
    'eco.partners.title': '合作伙伴', 'eco.partners.desc': '我们与现实世界和Web3合作伙伴共同发展生态系统。', 'eco.partners.i1': '实体餐厅合作伙伴', 'eco.partners.i2': 'TON生态系统协议', 'eco.partners.i3': '不断扩大的网络',
    'eco.vote.title': 'DAO投票', 'eco.vote.desc': '作为代币持有者塑造项目未来。链上治理。', 'eco.vote.i1': '持有者参与治理', 'eco.vote.i2': '资金库决策', 'eco.vote.i3': '链上透明度',
    'eco.whitepaper.title': '文件', 'eco.whitepaper.desc': '白皮书、路线图、宣言和所有官方文件都在这里。', 'eco.whitepaper.i1': '完整技术白皮书', 'eco.whitepaper.i2': '第1-3阶段路线图', 'eco.whitepaper.i3': '宣言和法律文件',
  },
};

export function TasteEcosystem({ onNavigate, onOpenTastePay }: EcosystemProps) {
  const { t, i18n } = useTranslation();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const tr = (key: string) => {
    const result = t(key);
    if (result !== key) return result;
    const lang = i18n.language?.substring(0, 2) || 'en';
    return MULTILANG_FALLBACKS[lang]?.[key]
      || MULTILANG_FALLBACKS['en']?.[key]
      || key;
  };

  const handleCardAction = (section: typeof ECO_SECTIONS[0]) => {
    if (section.externalUrl) {
      const SWAP_URL = 'https://app.tonkeeper.com/dapp/https%3A%2F%2Fapp.ston.fi%2Fswap%3FchartVisible%3Dfalse%26ft%3DTON%26tt%3DEQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-';
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.openLink(SWAP_URL);
      } else {
        window.open(SWAP_URL, '_blank');
      }
    } else if (section.navTarget === 'pay' && onOpenTastePay) {
      onOpenTastePay();
    } else if (section.navTarget) {
      onNavigate(section.navTarget);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ paddingBottom: '20px' }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        {/* Animated galaxy orb */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'conic-gradient(from 0deg, #f59e0b, #f97316, #ec4899, #6366f1, #0ea5e9, #10b981, #f59e0b)',
            margin: '0 auto 16px',
            boxShadow: '0 0 40px rgba(245,159,11,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <div style={{
            position: 'absolute',
            inset: '4px',
            borderRadius: '50%',
            background: '#0a0f1c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px'
          }}>
            🌐
          </div>
        </motion.div>

        <h2 style={{
          margin: '0 0 8px',
          fontSize: '26px',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #f59e0b, #f97316, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '1px'
        }}>
          {tr('eco.header.title')}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0, lineHeight: 1.6 }}>
          {tr('eco.header.subtitle')}
        </p>

        {/* Live stats bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          marginTop: '16px',
          flexWrap: 'wrap'
        }}>
          {[
            { label: tr('eco.header.stat.token'), value: 'TASTE', color: '#f59e0b' },
            { label: tr('eco.header.stat.chain'), value: 'TON', color: '#3b82f6' },
            { label: tr('eco.header.stat.modules'), value: `${ECO_SECTIONS.length}`, color: '#10b981' },
            { label: tr('eco.header.stat.lang'), value: '5', color: '#c084fc' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '16px', fontWeight: 900, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ecosystem flow diagram */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(245,159,11,0.08), rgba(99,102,241,0.08))',
        border: '1px solid rgba(245,159,11,0.2)',
        borderRadius: '20px',
        padding: '16px',
        marginBottom: '24px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>
          {tr('eco.flow.title')}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '4px', fontSize: '11px', color: 'var(--text-muted)' }}>
          {[
            { icon: '💎', labelKey: 'eco.flow.step1' },
            { icon: '⚡', labelKey: 'eco.flow.step2' },
            { icon: '🏦', labelKey: 'eco.flow.step3' },
            { icon: '👨‍🍳', labelKey: 'eco.flow.step4' },
            { icon: '💳', labelKey: 'eco.flow.step5' },
            { icon: '🌍', labelKey: 'eco.flow.step6' },
          ].map((step, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '6px 10px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span>{step.icon}</span>
                <span style={{ fontWeight: 700, color: '#e2e8f0' }}>{tr(step.labelKey)}</span>
              </div>
              {i < 5 && <span style={{ color: '#f59e0b', fontWeight: 900 }}>→</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Ecosystem Cards Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {ECO_SECTIONS.map((section, index) => {
          const isExpanded = expandedId === section.id;
          return (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Card */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : section.id)}
                style={{
                  background: isExpanded
                    ? `linear-gradient(145deg, rgba(30,41,59,0.95), rgba(15,23,42,0.98))`
                    : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${isExpanded ? section.color : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: isExpanded ? '20px 20px 0 0' : '20px',
                  padding: '16px 18px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isExpanded ? `0 0 20px ${section.glow}` : 'none',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Subtle glow when expanded */}
                {isExpanded && (
                  <div style={{
                    position: 'absolute', top: '-30px', right: '-30px',
                    width: '100px', height: '100px',
                    background: `radial-gradient(circle, ${section.glow} 0%, transparent 70%)`,
                    borderRadius: '50%', filter: 'blur(15px)', pointerEvents: 'none'
                  }} />
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative', zIndex: 1 }}>
                  {/* Icon bubble */}
                  <div style={{
                    width: '48px', height: '48px',
                    borderRadius: '14px',
                    background: `linear-gradient(135deg, ${section.color}22, ${section.color}11)`,
                    border: `1px solid ${section.color}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', flexShrink: 0,
                    boxShadow: isExpanded ? `0 4px 15px ${section.glow}` : 'none'
                  }}>
                    {section.icon}
                  </div>

                  {/* Title & desc */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontWeight: 800, fontSize: '15px', color: '#f1f5f9' }}>
                        {tr(section.titleKey)}
                      </span>
                      <span style={{
                        background: `${section.badgeColor}22`,
                        color: section.badgeColor,
                        border: `1px solid ${section.badgeColor}44`,
                        fontSize: '9px', fontWeight: 900,
                        padding: '2px 6px', borderRadius: '6px',
                        letterSpacing: '0.5px'
                      }}>
                        {section.badge}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: isExpanded ? 'normal' : 'nowrap' }}>
                      {tr(section.descKey)}
                    </p>
                  </div>

                  {/* Chevron */}
                  <motion.div
                    animate={{ rotate: isExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ color: isExpanded ? section.color : '#475569', flexShrink: 0 }}
                  >
                    ▼
                  </motion.div>
                </div>
              </div>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{
                      background: `linear-gradient(145deg, rgba(15,23,42,0.98), rgba(10,15,28,0.99))`,
                      border: `1px solid ${section.color}`,
                      borderTop: 'none',
                      borderRadius: '0 0 20px 20px',
                      padding: '16px 18px 20px',
                    }}>
                      {/* Stats row */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: `repeat(${section.stats.length}, 1fr)`,
                        gap: '8px',
                        marginBottom: '14px'
                      }}>
                        {section.stats.map((stat, i) => (
                          <div key={i} style={{
                            background: `${section.color}0f`,
                            border: `1px solid ${section.color}22`,
                            borderRadius: '10px',
                            padding: '8px 6px',
                            textAlign: 'center'
                          }}>
                            <div style={{ fontSize: '13px', fontWeight: 900, color: section.color }}>{stat.value}</div>
                            <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{stat.label}</div>
                          </div>
                        ))}
                      </div>

                      {/* Feature list */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                        {section.items.map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '18px', height: '18px', borderRadius: '50%',
                              background: `${section.color}22`, border: `1px solid ${section.color}44`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '10px', color: section.color, fontWeight: 900, flexShrink: 0
                            }}>
                              ✓
                            </div>
                            <span style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.4 }}>
                              {tr(item)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* CTA button */}
                      {(section.navTarget || section.externalUrl) && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCardAction(section);
                          }}
                          style={{
                            width: '100%',
                            background: `linear-gradient(135deg, ${section.color}, ${section.color}cc)`,
                            color: '#000',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '12px',
                            fontWeight: 900,
                            fontSize: '13px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            boxShadow: `0 4px 15px ${section.glow}`,
                            letterSpacing: '0.5px'
                          }}
                        >
                          <span>{section.icon}</span>
                          <span>{tr(`eco.cta.${section.id}`) !== `eco.cta.${section.id}` ? tr(`eco.cta.${section.id}`) : tr('eco.cta.default')}</span>
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Bottom banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{
          marginTop: '24px',
          background: 'linear-gradient(135deg, rgba(245,159,11,0.1), rgba(99,102,241,0.1))',
          border: '1px solid rgba(245,159,11,0.25)',
          borderRadius: '20px',
          padding: '20px',
          textAlign: 'center'
        }}
      >
        <div style={{ fontSize: '28px', marginBottom: '10px' }}>🚀</div>
        <h3 style={{ margin: '0 0 8px', fontWeight: 900, fontSize: '16px', color: '#f1f5f9' }}>
          {tr('eco.banner.title')}
        </h3>
        <p style={{ margin: '0 0 16px', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          {tr('eco.banner.desc')}
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('whitepaper')}
            style={{
              background: 'rgba(245,159,11,0.15)',
              border: '1px solid rgba(245,159,11,0.3)',
              color: '#f59e0b',
              padding: '10px 20px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {tr('eco.banner.whitepaper')}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('roadmap')}
            style={{
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.3)',
              color: '#818cf8',
              padding: '10px 20px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer'
            }}
          >
            {tr('eco.banner.roadmap')}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
