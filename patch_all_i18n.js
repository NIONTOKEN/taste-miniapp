const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const filesToPatch = {
  app: path.join(srcDir, 'App.tsx'),
  community: path.join(srcDir, 'components', 'Community.tsx'),
  team: path.join(srcDir, 'components', 'Team.tsx'),
  i18n: path.join(srcDir, 'i18n.ts')
};

// 1. Patch App.tsx
let appStr = fs.readFileSync(filesToPatch.app, 'utf8');

const appReplacements = [
  { search: "i18n.language?.startsWith('tr') ? 'BİLGİ İÇİN DOKUN' : 'TAP FOR INFO'", replace: "t('app.tap_for_info')" },
  { search: "i18n.language?.startsWith('tr') ? 'Hızlı Bağlantılar' : 'Quick Links'", replace: "t('app.quick_links')" },
  { search: "i18n.language?.startsWith('tr') ? 'Proje Asistanı' : 'Project Assistant'", replace: "t('app.project_assistant')" },
  { search: "i18n.language?.startsWith('tr') ? 'Hızlı Cüzdan & Transfer' : 'Quick Wallet & Transfer'", replace: "t('app.quick_wallet')" },
  { search: "i18n.language?.startsWith('tr') ? 'Taste Şef Dijital Statü' : 'Taste Chef Digital Status'", replace: "t('app.chef_status')" },
  { search: "i18n.language?.startsWith('tr') ? 'Gastronomi Kariyer & Topluluk' : 'Gastronomy Career & Community'", replace: "t('app.gastronomy_career')" },
  { search: "i18n.language?.startsWith('tr') ? 'Web3 & İş Ortakları' : 'Web3 & Partners'", replace: "t('app.web3_partners')" },
  { search: "i18n.language?.startsWith('tr') ? 'Ortak Projeler' : 'Joint Projects'", replace: "t('app.joint_projects')" },
  { search: "i18n.language?.startsWith('tr') ? 'Dil' : 'Lang'", replace: "t('app.lang')" },
  { search: "i18n.language?.startsWith('tr') ? 'Keşfet' : 'Discover'", replace: "t('nav.discover')" },
  { search: "label: i18n.language?.startsWith('tr') ? 'Yükle' : 'Install'", replace: "label: t('nav.install')" },
  { search: "label: i18n.language?.startsWith('tr') ? 'Ortaklar' : 'Partners'", replace: "label: t('nav.partners')" },
  { search: "label: i18n.language?.startsWith('tr') ? \"Web3'teki Yerimiz\" : 'Our Place in Web3'", replace: "label: t('nav.vote')" },
  { search: "label: i18n.language?.startsWith('tr') ? 'Sosyal Ağlar' : 'Social Media'", replace: "label: t('nav.socials')" },
  { search: "label: i18n.language?.startsWith('tr') ? 'Ekip' : 'Team'", replace: "label: t('nav.team')" },
  { search: "label: i18n.language?.startsWith('tr') ? 'S.S.S.' : 'F.A.Q.'", replace: "label: t('nav.faq')" },
  { search: "label: i18n.language?.startsWith('tr') ? 'Teknoloji' : 'Tech'", replace: "label: t('nav.tech')" },
  { search: "label: i18n.language?.startsWith('tr') ? 'Ayarlar' : 'Settings'", replace: "label: t('nav.settings')" },
  { search: "i18n.language?.startsWith('tr') ? 'Menü' : 'Menu'", replace: "t('nav.menu')" },
  { search: "TASTE Geleceğe Gidiyor!", replace: "{t('app.banner_title')}" },
  { search: "TASTE yarının parlayan yıldızı. Hemen TASTE Al, bu muhteşem yolculukta yerini al!", replace: "{t('app.banner_desc')}" },
  { search: "🔥 TASTE AL 🔥", replace: "🔥 {t('app.banner_buy')} 🔥" }
];

appReplacements.forEach(rep => {
  appStr = appStr.split(rep.search).join(rep.replace);
});
fs.writeFileSync(filesToPatch.app, appStr);

// 2. Patch Community.tsx
let commStr = fs.readFileSync(filesToPatch.community, 'utf8');

const commReplacements = [
  { search: "i18n.language === 'tr' ? 'İŞ İLANI' : 'JOB POST'", replace: "t('community.job_post')" },
  { search: "i18n.language === 'tr' ? 'ÖDÜL CÜZDANI' : 'REWARD WALLET'", replace: "t('community.reward_wallet')" },
  { search: "i18n.language === 'tr' ? 'İlan Verenle Yazış' : 'Chat with Poster'", replace: "t('community.chat_poster')" },
  { search: "i18n.language === 'tr' ? 'Harika! İlanın paylaşıldı ve tüm dünyaya duyuruldu. 🚀' : 'Great! Your post has been shared globally! 🚀'", replace: "t('community.alert_success_global')" },
  { search: "i18n.language === 'tr' ? 'İlanın Paylaşıldı! 🚀' : 'Post Shared! 🚀'", replace: "t('community.alert_success')" },
  { search: "i18n.language === 'tr' ? 'Akış' : 'Feed'", replace: "t('community.tab_feed')" },
  { search: "i18n.language === 'tr' ? 'İş İlanı' : 'Jobs'", replace: "t('community.tab_jobs')" },
  { search: "i18n.language === 'tr' ? 'Sohbet' : 'Chat'", replace: "t('community.tab_chat')" },
  { search: "i18n.language === 'tr' ? '🚀 PAYLAŞ & 5 TASTE KAZAN!' : '🚀 SHARE & WIN 5 TASTE!'", replace: "t('community.btn_share_win')" },
  { search: "i18n.language === 'tr' ? 'Henüz İlan Yok' : 'No Posts Yet'", replace: "t('community.no_posts')" },
  { search: "i18n.language === 'tr' ? 'İlk ilanı veya paylaşımı sen yap!' : 'Be the first to share something!'", replace: "t('community.no_posts_desc')" },
  { search: "i18n.language === 'tr' ? 'Mesaj yaz...' : 'Type a message...'", replace: "t('community.ph_chat')" },
  { search: "i18n.language === 'tr' ? 'Lokantadaki Pozisyon' : 'Position in Restaurant'", replace: "t('community.ph_position')" },
  { search: "i18n.language === 'tr' ? 'İş ilanı veya iş arayışınızı buraya yazın...' : 'Write your job post or seeking details here...'", replace: "t('community.ph_job_desc')" },
  { search: "i18n.language === 'tr' ? 'Ödül İçin Cüzdan Adresi' : 'Wallet Address for Reward'", replace: "t('community.lbl_wallet_reward')" },
  { search: "i18n.language === 'tr' ? '* Paylaştıktan sonra ekran görüntüsü alıp TG grubuna atmayı unutmayın!' : '* Don\\'t forget to take a screenshot and share in TG group after posting!'", replace: "t('community.lbl_wallet_note')" }
];

commReplacements.forEach(rep => {
  commStr = commStr.split(rep.search).join(rep.replace);
});
fs.writeFileSync(filesToPatch.community, commStr);

// 3. Patch Team.tsx
let teamStr = fs.readFileSync(filesToPatch.team, 'utf8');

teamStr = teamStr.replace(/{isEn \? 'Project Team Members' : 'Proje Ekip Üyeleri'}/g, "{t('team.title')}");
teamStr = teamStr.replace(/{isEn \? 'The visionary minds building the TASTE ecosystem' : 'TASTE ekosistemini inşa eden vizyoner ekip'}/g, "{t('team.subtitle')}");
teamStr = teamStr.replace(/{isEn \? member\.roleEn : member\.roleTr}/g, "{t(`team.roles.${member.id}`)}");
teamStr = teamStr.replace(/{isEn \? member\.bioEn : member\.bioTr}/g, "{t(`team.bios.${member.id}`)}");
teamStr = teamStr.replace(/{isEn \? 'Contact' : 'İletişim'}/g, "{t('team.contact')}");

if (!teamStr.includes('const { t, i18n }')) {
  teamStr = teamStr.replace('const { i18n } = useTranslation()', 'const { t, i18n } = useTranslation()');
}
fs.writeFileSync(filesToPatch.team, teamStr);

// 4. Update i18n.ts
let fileContent = fs.readFileSync(filesToPatch.i18n, 'utf8');

const startIdx = fileContent.indexOf('const resources =');
const endIdx = fileContent.indexOf('const savedLang =');

let resourcesStr = fileContent.substring(startIdx + 'const resources ='.length, endIdx).trim();
if (resourcesStr.endsWith(';')) resourcesStr = resourcesStr.slice(0, -1);

let resources;
try {
  resources = eval('(' + resourcesStr + ')');
} catch(e) {
  console.error("Eval failed:", e);
  process.exit(1);
}

// Add new English keys
Object.assign(resources.en.translation.app, {
  tap_for_info: "TAP FOR INFO",
  quick_links: "Quick Links",
  project_assistant: "Project Assistant",
  quick_wallet: "Quick Wallet & Transfer",
  chef_status: "Taste Chef Digital Status",
  gastronomy_career: "Gastronomy Career & Community",
  web3_partners: "Web3 & Partners",
  joint_projects: "Joint Projects",
  lang: "Lang",
  banner_title: "TASTE is going to the future!",
  banner_desc: "TASTE is the shining star of tomorrow. Buy TASTE now and take your place in this amazing journey!",
  banner_buy: "BUY TASTE"
});

Object.assign(resources.en.translation.nav, {
  discover: "Discover",
  install: "Install",
  partners: "Partners",
  vote: "Our Place in Web3",
  socials: "Social Media",
  team: "Team",
  faq: "F.A.Q.",
  tech: "Tech",
  settings: "Settings",
  menu: "Menu"
});

resources.en.translation.community = resources.en.translation.community || {};
Object.assign(resources.en.translation.community, {
  job_post: "JOB POST",
  reward_wallet: "REWARD WALLET",
  chat_poster: "Chat with Poster",
  alert_success_global: "Great! Your post has been shared globally! 🚀",
  alert_success: "Post Shared! 🚀",
  tab_feed: "Feed",
  tab_jobs: "Jobs",
  tab_chat: "Chat",
  btn_share_win: "🚀 SHARE & WIN 5 TASTE!",
  no_posts: "No Posts Yet",
  no_posts_desc: "Be the first to share something!",
  ph_chat: "Type a message...",
  ph_position: "Position in Restaurant",
  ph_job_desc: "Write your job post or seeking details here...",
  lbl_wallet_reward: "Wallet Address for Reward",
  lbl_wallet_note: "* Don't forget to take a screenshot and share in TG group after posting!"
});

resources.en.translation.team = {
  title: "Project Team Members",
  subtitle: "The visionary minds building the TASTE ecosystem",
  contact: "Contact",
  roles: {
    founder: "Founder / Strategy & Vision",
    lead_dev: "Lead Developer / Architect",
    marketing: "CMO / Brand Growth",
    community: "Community & Media Manager",
    little_queen: "Community Manager",
    legend_love: "Community & Media Manager",
    fatih_kaya: "Financial Coordinator"
  },
  bios: {
    founder: "Visionary behind the TASTE project. Building the bridge between gastronomy and blockchain.",
    lead_dev: "Master of code and architecture. Turning the TASTE vision into a scalable, secure digital reality.",
    marketing: "Strategic mind expanding TASTE's reach globally. Connecting the culinary world with Web3.",
    community: "Moderator, social media expert and advertiser. Also a contest organizer and community builder.",
    little_queen: "Focused on community growth, social media interactions, and supporting TASTE supporters.",
    legend_love: "Moderator, social media expert and advertiser. Also a contest organizer and community builder.",
    fatih_kaya: "Founder, planner, guide. The one who embraces, undertakes, and tries to execute the TASTE project. Ensures kitchen teams are financially supported."
  }
};


// Add new Turkish keys
Object.assign(resources.tr.translation.app, {
  tap_for_info: "BİLGİ İÇİN DOKUN",
  quick_links: "Hızlı Bağlantılar",
  project_assistant: "Proje Asistanı",
  quick_wallet: "Hızlı Cüzdan & Transfer",
  chef_status: "Taste Şef Dijital Statü",
  gastronomy_career: "Gastronomi Kariyer & Topluluk",
  web3_partners: "Web3 & İş Ortakları",
  joint_projects: "Ortak Projeler",
  lang: "Dil",
  banner_title: "TASTE Geleceğe Gidiyor!",
  banner_desc: "TASTE yarının parlayan yıldızı. Hemen TASTE Al, bu muhteşem yolculukta yerini al!",
  banner_buy: "TASTE AL"
});

Object.assign(resources.tr.translation.nav, {
  discover: "Keşfet",
  install: "Yükle",
  partners: "Ortaklar",
  vote: "Web3'teki Yerimiz",
  socials: "Sosyal Ağlar",
  team: "Ekip",
  faq: "S.S.S.",
  tech: "Teknoloji",
  settings: "Ayarlar",
  menu: "Menü"
});

resources.tr.translation.community = resources.tr.translation.community || {};
Object.assign(resources.tr.translation.community, {
  job_post: "İŞ İLANI",
  reward_wallet: "ÖDÜL CÜZDANI",
  chat_poster: "İlan Verenle Yazış",
  alert_success_global: "Harika! İlanın paylaşıldı ve tüm dünyaya duyuruldu. 🚀",
  alert_success: "İlanın Paylaşıldı! 🚀",
  tab_feed: "Akış",
  tab_jobs: "İş İlanı",
  tab_chat: "Sohbet",
  btn_share_win: "🚀 PAYLAŞ & 5 TASTE KAZAN!",
  no_posts: "Henüz İlan Yok",
  no_posts_desc: "İlk ilanı veya paylaşımı sen yap!",
  ph_chat: "Mesaj yaz...",
  ph_position: "Lokantadaki Pozisyon",
  ph_job_desc: "İş ilanı veya iş arayışınızı buraya yazın...",
  lbl_wallet_reward: "Ödül İçin Cüzdan Adresi",
  lbl_wallet_note: "* Paylaştıktan sonra ekran görüntüsü alıp TG grubuna atmayı unutmayın!"
});

resources.tr.translation.team = {
  title: "Proje Ekip Üyeleri",
  subtitle: "TASTE ekosistemini inşa eden vizyoner ekip",
  contact: "İletişim",
  roles: {
    founder: "Kurucu / Strateji ve Vizyon",
    lead_dev: "Baş Geliştirici / Mimar",
    marketing: "Pazarlama Yöneticisi / Marka Büyümesi",
    community: "Topluluk ve Medya Yöneticisi",
    little_queen: "Topluluk Yöneticisi",
    legend_love: "Topluluk ve Medya Yöneticisi",
    fatih_kaya: "Mali İşler Sorumlusu"
  },
  bios: {
    founder: "TASTE projesinin vizyoneri. Gastronomi ile blockchain arasındaki köprüyü inşa ediyor.",
    lead_dev: "Kod ve mimari ustası. TASTE vizyonunu ölçeklenebilir ve güvenli bir dijital gerçekliğe dönüştürüyor.",
    marketing: "TASTE'in küresel erişimini genişleten stratejik zeka. Aşçılık dünyasını Web3 ile buluşturuyor.",
    community: "Moderatör, sosyal medya uzmanı ve reklamcı. Ayrıca yarışma düzenleyici ve topluluk oluşturucu.",
    little_queen: "Topluluk büyümesi, sosyal medya etkileşimleri ve TASTE destekçilerine destek olmaya odaklı.",
    legend_love: "Moderatör, sosyal medya uzmanı ve reklamcı. Ayrıca yarışma düzenleyici ve topluluk oluşturucu.",
    fatih_kaya: "Kurucu, planlayıcı, yol gösterici. TASTE projesini sahiplenen, üstlenen ve yürütmeye çalışan kişi. Mutfak ekiplerince finanse edilebilmekten sorumlu."
  }
};

const newResourcesStr = JSON.stringify(resources, null, 4);
const beforeStr = fileContent.substring(0, startIdx);
const afterStr = fileContent.substring(endIdx);
fs.writeFileSync(filesToPatch.i18n, beforeStr + 'const resources = ' + newResourcesStr + ';\n\n' + afterStr);

console.log('All files patched successfully!');
