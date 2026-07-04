import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronRight, ShieldCheck, Mail, Phone, Lock, HelpCircle, MessageCircle, LogOut, 
    ChevronLeft, CreditCard, Gift, Bookmark, Globe, Palette, Trash2, Coins, Twitter, 
    Check, X, Smartphone, Monitor, Share2, Copy, Users, Camera, Send, Loader2, 
    UploadCloud, Eye, EyeOff, Bell, RefreshCw, Clock, Link as LinkIcon
} from 'lucide-react';
import { Users as UserPlus, Heart, Info, Handshake, UserCheck } from 'lucide-react';

const Profile = ({ setTab, setHasWallet, setLang, lang, walletData, updateSettings, tgUser, t }) => {
    const [subPage, setSubPage] = useState(null); 
    const [confirmAction, setConfirmAction] = useState(null); 
    const [referrer, setReferrer] = useState(localStorage.getItem('qai_referrer') || '');
    
    const saveReferrer = (val) => {
        setReferrer(val);
        localStorage.setItem('qai_referrer', val);
    };

   const pinEnabled = walletData?.settings?.pinEnabled !== false;
   const bioEnabled = walletData?.settings?.bioEnabled || false;

   const togglePin = () => updateSettings({ pinEnabled: !pinEnabled });
   const toggleBio = () => updateSettings({ bioEnabled: !bioEnabled });

   const handleOpenLink = (url) => {
     if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.openLink(url);
     } else {
        window.open(url, '_blank');
     }
   };

   const handleShare = (link) => {
      if (window.Telegram?.WebApp) {
         window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(t('profile.referral_desc'))}`);
      } else {
         navigator.clipboard.writeText(link);
      }
   };

   // Mock KYC Verileri 
   const [kycData, setKycData] = useState(JSON.parse(localStorage.getItem('qai_kyc')) || {
       tg: tgUser?.username || tgUser?.first_name || 'user',
       email: '',
       tgVerified: true,
       emailVerified: false,
   });

   const saveKyc = (newData) => {
       setKycData(newData);
       localStorage.setItem('qai_kyc', JSON.stringify(newData));
   };

   const kycLevel = (kycData.tgVerified ? 1 : 0) + (kycData.emailVerified ? 2 : 0);

    if(subPage === 'theme') return <ThemeSelectScreen setSubPage={setSubPage} t={t} updateSettings={updateSettings} currentTheme={walletData?.settings?.theme || 'dark'} />;
    if(subPage === 'security') return <SecurityScreen setSubPage={setSubPage} pinEnabled={pinEnabled} bioEnabled={bioEnabled} togglePin={togglePin} toggleBio={toggleBio} t={t} walletData={walletData} updateSettings={updateSettings} />;
   if(subPage === 'accounts') return <OfficialAccountsScreen setSubPage={setSubPage} t={t} handleOpenLink={handleOpenLink} />;
   if(subPage === 'information') return <InformationScreen setSubPage={setSubPage} t={t} />;
   if(subPage === 'language_select') return <LanguageSelectScreen setSubPage={setSubPage} setLang={setLang} lang={lang} t={t} />;
   if(subPage === 'devices') return <DevicesScreen setSubPage={setSubPage} t={t} />;
   if(subPage === 'referral') return <ReferralScreen setSubPage={setSubPage} t={t} tgUser={tgUser} handleShare={handleShare} referrer={referrer} saveReferrer={saveReferrer} />;
   if(subPage === 'my_data') return <UserDataScreen setSubPage={setSubPage} t={t} kycData={kycData} saveKyc={saveKyc} kycLevel={kycLevel > 3 ? 3 : kycLevel} />;
   if(subPage === 'support') return <SupportScreen setSubPage={setSubPage} t={t} />;
   if(subPage === 'partners') return <PartnersScreen setSubPage={setSubPage} t={t} handleOpenLink={handleOpenLink} />;
   if(subPage === 'faq_legal') return <FaqLegalScreen setSubPage={setSubPage} t={t} />;

   return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '20px', paddingBottom: '120px', background: 'var(--bg-main)' }}>
         <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', gap: '15px' }}>
            <ChevronLeft size={28} onClick={() => setTab('home')} style={{ cursor: 'pointer' }} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: '900', margin: 0 }}>{t('profile.title')}</h2>
         </div>

         {/* Profile Card */}
         <div 
            onClick={() => setSubPage('my_data')}
            style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '32px', display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '30px', border: '1px solid var(--glass-border)', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', cursor: 'pointer' }}
         >
            <div style={{ position: 'relative' }}>
                <img src={tgUser?.photo_url || "/logo.png"} alt="Profile" style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', background: 'var(--primary)', borderRadius: '50%', border: '3px solid var(--bg-card)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <ShieldCheck size={10} color="white" />
                </div>
            </div>
            <div>
               <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: '900' }}>@{tgUser?.username || 'user'}</h3>
               <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color: 'var(--primary)', fontSize: '0.75rem', fontWeight: '900', background: 'rgba(99,102,241,0.1)', padding: '2px 8px', borderRadius: '8px' }}>KYC {t('profile.level')} {kycLevel > 3 ? 3 : kycLevel}</span>
               </div>
            </div>
            <ChevronRight size={22} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
         </div>

         <GroupLabel text={String(t('profile.privileges')).toUpperCase()} />
         <div style={{ background: 'var(--bg-card)', borderRadius: '28px', padding: '10px', marginBottom: '30px', border: '1px solid var(--glass-border)' }}>
            <MenuItem icon={<CreditCard size={20} color="var(--primary)" />} label={t('profile.my_wallets')} onClick={() => { setTab('home'); setTimeout(() => window.dispatchEvent(new CustomEvent('qai_open_wallet_switcher')), 200); }} />
            <MenuItem icon={<Users size={20} color="var(--primary)" />} label={t('profile.referral_title')} onClick={() => setSubPage('referral')} />
            <MenuItem icon={<Handshake size={20} color="var(--primary)" />} label={t('profile.partners')} onClick={() => setSubPage('partners')} border={false} />
         </div>

         <GroupLabel text={String(t('profile.security_section')).toUpperCase()} />
         <div style={{ background: 'var(--bg-card)', borderRadius: '28px', padding: '10px', marginBottom: '30px', border: '1px solid var(--glass-border)' }}>
            <MenuItem icon={<Lock size={20} color="var(--primary)" />} label={t('profile.security')} onClick={() => setSubPage('security')} />
            <MenuItem icon={<Globe size={20} color="var(--primary)" />} label={t('profile.language')} rightText={lang.toUpperCase()} onClick={() => setSubPage('language_select')} />
            <MenuItem icon={<Palette size={20} color="var(--primary)" />} label={t('profile.theme')} onClick={() => setSubPage('theme')} />
            <MenuItem icon={<Smartphone size={20} color="var(--primary)" />} label={t('profile.connected_devices')} onClick={() => setSubPage('devices')} border={false} />
         </div>

         <GroupLabel text={t('profile.social_networks').toUpperCase()} />
         <div style={{ background: 'var(--bg-card)', borderRadius: '28px', padding: '10px', marginBottom: '30px', border: '1px solid var(--glass-border)' }}>
            <MenuItem icon={<Twitter size={20} color="#1DA1F2" />} label={t('profile.social_channels')} onClick={() => setSubPage('accounts')} />
            <MenuItem icon={<HelpCircle size={20} color="var(--primary)" />} label={t('profile.support_form')} onClick={() => setSubPage('support')} />
            <MenuItem icon={<Info size={20} color="var(--primary)" />} label={t('profile.information')} onClick={() => setSubPage('information')} border={false} />
         </div>

         <div style={{ background: 'var(--bg-card)', borderRadius: '28px', padding: '10px', marginBottom: '30px', border: '1px solid var(--glass-border)' }}>
            <MenuItem icon={<RefreshCw size={20} color="var(--primary)" />} label={t('profile.clear_cache')} onClick={() => setConfirmAction('clear_cache')} />
            <MenuItem icon={<LogOut size={20} color="var(--text-muted)" />} label={t('profile.logout')} onClick={() => setConfirmAction('logout')} />
            <MenuItem icon={<Trash2 size={20} color="var(--danger)" />} label={<span style={{color: 'var(--danger)'}}>{t('profile.delete')}</span>} onClick={() => setConfirmAction('delete')} border={false} />
         </div>

         <AnimatePresence>
            {confirmAction && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '30px' }}>
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '32px', border: '1px solid var(--glass-border)', textAlign: 'center', width: '100%', maxWidth: '350px' }}>
                        <div style={{ width: '70px', height: '70px', background: confirmAction === 'delete' ? 'rgba(239,68,68,0.1)' : confirmAction === 'clear_cache' ? 'rgba(34,197,94,0.1)' : 'rgba(99,102,241,0.1)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px' }}>
                            {confirmAction === 'delete' ? <Trash2 color="var(--danger)" size={35} /> : confirmAction === 'clear_cache' ? <RefreshCw color="#22c55e" size={35} /> : <LogOut color="var(--primary)" size={35} />}
                        </div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '25px', lineHeight: '1.4' }}>
                            {confirmAction === 'delete' ? t('profile.confirm_delete') : confirmAction === 'clear_cache' ? t('profile.clear_cache_desc') : t('profile.confirm_logout')}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <button onClick={() => setConfirmAction(null)} style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: 'none', borderRadius: '18px', fontWeight: '900', cursor: 'pointer' }}>{t('profile.no')}</button>
                            <button onClick={
                                confirmAction === 'delete' ? () => { localStorage.removeItem('qai_wallet'); window.location.reload(); } : 
                                confirmAction === 'clear_cache' ? () => { 
                                    const keys = ['last_total_balance', 'qai_prices', 'tx_history_cache', 'wallet_recent_searches'];
                                    keys.forEach(k => localStorage.removeItem(k));
                                    window.location.reload(); 
                                } : () => setHasWallet(false)
                            } style={{ padding: '16px', background: confirmAction === 'delete' ? 'var(--danger)' : confirmAction === 'clear_cache' ? '#22c55e' : 'var(--primary)', color: '#fff', border: 'none', borderRadius: '18px', fontWeight: '900', cursor: 'pointer' }}>{confirmAction === 'clear_cache' ? t('profile.clear_btn') || 'TEMİZLE' : t('profile.yes')}</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
         </AnimatePresence>
      </motion.div>
   );
};

const UserDataScreen = ({ setSubPage, t, kycData, saveKyc, kycLevel }) => {
    const [status, setStatus] = useState('idle'); // idle | loading | verifying
    const [verifyingType, setVerifyingType] = useState(null); // 'email' | 'tg'
    const [code, setCode] = useState('');
    const [sentCode, setSentCode] = useState('');
    const [error, setError] = useState('');

    const handleVerifyEmail = () => {
        if (!kycData.email || !kycData.email.includes('@')) return alert('Lütfen geçerli bir e-posta girin.');
        saveKyc({ ...kycData, emailVerified: true });
    };

    const handleVerifyTG = () => {
        if (!kycData.tg) return alert('Lütfen Telegram ID girin.');
        saveKyc({ ...kycData, tgVerified: true });
    };

    return (
        <motion.div initial={{ x: 400 }} animate={{ x: 0 }} style={{ padding: '20px', background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '100px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '35px' }}>
                <ChevronLeft size={28} onClick={() => setSubPage(null)} style={{ cursor: 'pointer' }} />
                <h2 style={{ fontSize: '1.2rem', fontWeight: '900', margin: '0 auto', transform: 'translateX(-14px)' }}>{t('profile.my_data')}</h2>
            </div>

            {/* Level Progress */}
            <div style={{ background: 'var(--bg-card)', padding: '25px', borderRadius: '32px', border: '1px solid var(--glass-border)', textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '900', marginBottom: '10px' }}>{String(t('profile.kyc_level')).toUpperCase()}</div>
                <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)' }}>{kycLevel}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '10px' }}>
                    {[1,2,3].map(i => (
                        <div key={i} style={{ width: '40px', height: '6px', borderRadius: '3px', background: kycLevel >= i ? 'var(--primary)' : 'rgba(255,255,255,0.05)' }} />
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Telegram Verification */}
                <div style={{ background: 'var(--bg-card)', borderRadius: '28px', padding: '20px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '15px' }}>
                        <MessageCircle color="var(--primary)" size={24} />
                        <p style={{ margin: 0, fontWeight: 'bold' }}>{t('profile.tg_username')}</p>
                    </div>
                    {!kycData.tgVerified ? (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input 
                                placeholder="@kullanici_adi" 
                                value={kycData.tg} 
                                onChange={(e) => saveKyc({...kycData, tg: e.target.value.startsWith('@') ? e.target.value : '@' + e.target.value})} 
                                style={{ flex: 1, background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '15px', borderRadius: '15px', color: '#fff', outline: 'none' }} 
                            />
                            <button onClick={handleVerifyTG} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '0 20px', borderRadius: '15px', fontWeight: 'bold' }}>{t('profile.approve')}</button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{kycData.tg}</span>
                            <VerifiedBadge t={t} />
                        </div>
                    )}
                </div>

                {/* Email Verification */}
                <div style={{ background: 'var(--bg-card)', borderRadius: '28px', padding: '20px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '15px' }}>
                        <Mail color="var(--primary)" size={24} />
                        <p style={{ margin: 0, fontWeight: 'bold' }}>{t('profile.email_address')}</p>
                    </div>
                    {!kycData.emailVerified ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <input 
                                placeholder="eposta@adresi.com" 
                                value={kycData.email} 
                                onChange={(e) => saveKyc({...kycData, email: e.target.value})} 
                                style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '15px', borderRadius: '15px', color: '#fff', outline: 'none' }} 
                            />
                            <button 
                                onClick={handleVerifyEmail}
                                style={{ width: '100%', background: 'var(--primary)', color: '#fff', border: 'none', padding: '15px', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                {t('profile.approve')}
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold' }}>{kycData.email}</span>
                            <VerifiedBadge t={t} />
                        </div>
                    )}
                </div>
            </div>


        </motion.div>
    );
};

const SupportScreen = ({ setSubPage, t }) => {
    const [status, setStatus] = useState('idle'); // idle | sending | sent
    const [image, setImage] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('sending');
        setTimeout(() => setStatus('sent'), 1500);
    };

    return (
        <motion.div initial={{ x: 400 }} animate={{ x: 0 }} style={{ padding: '20px', background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '90px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '35px' }}>
                <ChevronLeft size={28} onClick={() => setSubPage(null)} style={{ cursor: 'pointer' }} />
                <h2 style={{ fontSize: '1.2rem', fontWeight: '900', margin: '0 auto', transform: 'translateX(-14px)' }}>{t('profile.support_form')}</h2>
            </div>

            <div style={{ background: 'var(--primary)', color: '#fff', padding: '15px', borderRadius: '20px', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Mail size={20} />
                <div>
                   <p style={{ margin: 0, fontSize: '0.7rem', opacity: 0.8 }}>{t('profile.support_email')}:</p>
                   <p style={{ margin: 0, fontWeight: 'bold' }}>qaiwallet4@gmail.com</p>
                </div>
            </div>

            {status === 'sent' ? (
                <div style={{ textAlign: 'center', paddingTop: '100px' }}>
                    <div style={{ width: '80px', height: '80px', background: 'rgba(34,197,94,0.1)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px' }}>
                        <Check size={40} color="#22c55e" />
                    </div>
                    <h3 style={{ fontWeight: '900' }}>{t('profile.request_sent')}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('profile.request_desc')}</p>
                    <button onClick={() => setSubPage(null)} style={{ marginTop: '30px', padding: '15px 30px', background: '#fff', color: '#000', borderRadius: '15px', border: 'none', fontWeight: 'bold' }}>{t('welcome.back')}</button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <input required placeholder={t('profile.subject')} style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '18px', color: '#fff', outline: 'none' }} />
                    <textarea required placeholder={t('profile.message')} rows={5} style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--glass-border)', padding: '16px', borderRadius: '18px', color: '#fff', outline: 'none', resize: 'none' }} />
                    
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} accept="image/*" />
                    <div 
                        onClick={() => fileInputRef.current.click()}
                        style={{ border: '2px dashed var(--glass-border)', borderRadius: '24px', padding: '20px', textAlign: 'center', cursor: 'pointer', minHeight: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                        {image ? (
                            <div style={{ position: 'relative', width: '100%' }}>
                                <img src={image} alt="Preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '15px' }} />
                                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.5)', padding: '5px', borderRadius: '50%' }} onClick={(e) => { e.stopPropagation(); setImage(null); }}>
                                    <X size={16} />
                                </div>
                            </div>
                        ) : (
                            <>
                                <UploadCloud size={35} color="var(--primary)" style={{ marginBottom: '10px' }} />
                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#fff', fontWeight: 'bold' }}>{t('profile.upload_image')}</p>
                                <p style={{ margin: '5px 0 0 0', fontSize: '0.7rem', color: 'var(--text-muted)' }}>Max: 5MB</p>
                            </>
                        )}
                    </div>

                    <button type="submit" disabled={status === 'sending'} style={{ width: '100%', padding: '20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '22px', fontWeight: '900', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '10px', boxShadow: '0 10px 25px var(--primary-glow)' }}>
                        {status === 'sending' ? <Loader2 className="animate-spin" /> : <><Send size={20} /> {t('profile.send_form')}</>}
                    </button>
                </form>
            )}
            <style>{` .animate-spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } } `}</style>
        </motion.div>
    );
};

const VerifiedBadge = ({ t }) => (
    <div style={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: '900' }}>
        <Check size={16} strokeWidth={3} /> {t('profile.verified')}
    </div>
);

const KycField = ({ icon, label, value, verified, t, border=true }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 10px', borderBottom: border ? '1px solid var(--glass-border)' : 'none' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ color: 'var(--primary)' }}>{icon}</div>
            <div>
                <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>{label}</p>
                <p style={{ margin: 0, fontWeight: '900', fontSize: '0.95rem' }}>{value || 'Not set'}</p>
            </div>
        </div>
        {verified && <VerifiedBadge t={t} />}
    </div>
);

const OfficialAccountsScreen = ({ setSubPage, t, handleOpenLink }) => (
    <motion.div initial={{ x: 400 }} animate={{ x: 0 }} style={{ padding: '20px', background: 'var(--bg-main)', minHeight: '100vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '35px' }}>
            <ChevronLeft size={28} onClick={() => setSubPage(null)} style={{ cursor: 'pointer' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: '900', margin: '0 auto', transform: 'translateX(-14px)' }}>{t('profile.social_channels')}</h2>
        </div>
        <div style={{ background: 'var(--bg-card)', borderRadius: '32px', padding: '15px', border: '1px solid var(--glass-border)' }}>
            <MenuItem icon={<MessageCircle size={20} color="#0088cc" />} label="Telegram" rightText="@QAIWALLET4" onClick={() => handleOpenLink('https://t.me/QAIWALLET4')} />
            <MenuItem icon={<Mail size={20} color="var(--primary)" />} label="Email" rightText="qaiwallet4@gmail.com" onClick={() => handleOpenLink('mailto:qaiwallet4@gmail.com')} border={false} />
        </div>
    </motion.div>
);

const DevicesScreen = ({ setSubPage, t }) => {
    const ua = navigator.userAgent;
    let name = t('profile.desktop');
    let os = t('profile.unknown_os');
    let isMobile = false;

    if (/Windows NT/i.test(ua)) { os = "Windows"; name = "Windows PC"; }
    else if (/Mac OS X/i.test(ua)) { os = "macOS"; name = "MacBook / iMac"; }
    if (/Android/i.test(ua)) { os = "Android"; name = t('profile.mobile'); isMobile = true; }
    if (/iPhone|iPad|iPod/i.test(ua)) { os = "iOS"; name = "Apple Device"; isMobile = true; }
    if (/Linux/i.test(ua) && !/Android/i.test(ua)) { os = "Linux"; name = "Linux PC"; }
    
    if (window.Telegram?.WebApp?.platform) {
        const plat = window.Telegram.WebApp.platform;
        if(plat && plat !== 'unknown' && plat !== 'web' && plat !== 'weba') {
            name = plat.charAt(0).toUpperCase() + plat.slice(1) + " (Telegram)";
            isMobile = plat === 'ios' || plat === 'android';
            if (plat === 'ios') os = 'iOS';
            if (plat === 'android') os = 'Android';
        }
    }

    return (
        <motion.div initial={{ x: 400 }} animate={{ x: 0 }} style={{ padding: '20px', background: 'var(--bg-main)', minHeight: '100vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '35px' }}>
                <ChevronLeft size={28} onClick={() => setSubPage(null)} style={{ cursor: 'pointer' }} />
                <h2 style={{ fontSize: '1.2rem', fontWeight: '900', margin: '0 auto', transform: 'translateX(-14px)' }}>{t('profile.connected_devices')}</h2>
            </div>
            <p style={{ margin: '0 0 15px 0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '900', marginLeft: '10px' }}>{t('profile.active_device')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <DeviceItem 
                    icon={isMobile ? <Smartphone size={24} color="var(--primary)" /> : <Monitor size={24} color="var(--primary)" />} 
                    name={name} 
                    os={os} 
                    active 
                />
            </div>
        </motion.div>
    );
};

const DeviceItem = ({ icon, name, os, active }) => (
    <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '24px', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ width: '50px', height: '50px', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{icon}</div>
            <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold' }}>{name}</h4>
                <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{os}</p>
            </div>
        </div>
        {active && <span style={{ color: '#22c55e', fontSize: '0.75rem', fontWeight: '900', background: 'rgba(34,197,94,0.1)', padding: '4px 10px', borderRadius: '10px' }}>{t('profile.active') || 'ACTIVE'}</span>}
    </div>
);

const InformationScreen = ({ setSubPage, t }) => {
    return (
        <motion.div initial={{ x: 400 }} animate={{ x: 0 }} style={{ padding: '20px', background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '90px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '35px' }}>
                <ChevronLeft size={28} onClick={() => setSubPage(null)} style={{ cursor: 'pointer' }} />
                <h2 style={{ fontSize: '1.2rem', fontWeight: '900', margin: '0 auto', transform: 'translateX(-14px)' }}>{t('profile.information')}</h2>
            </div>
            
            <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '32px', border: '1px solid var(--glass-border)', textAlign: 'center', marginBottom: '25px' }}>
                <img src="/logo.png" alt="" style={{ width: '80px', height: '80px', borderRadius: '25px', marginBottom: '20px' }} />
                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', margin: '0 0 10px 0' }}>QAI Wallet v1.5</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.9rem' }}>
                    {t('profile.info_desc')}
                </p>
            </div>

            <button onClick={() => setSubPage('faq_legal')} style={{ width: '100%', padding: '18px', background: 'var(--bg-card)', color: '#fff', border: '1px solid var(--glass-border)', borderRadius: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                <ShieldCheck size={22} color="var(--primary)" /> {t('faq.title')}
            </button>
        </motion.div>
    );
};

const LanguageSelectScreen = ({ setSubPage, setLang, lang, t }) => {
    const langs = [
        { id: 'tr', label: 'Türkçe', flag: '🇹🇷' },
        { id: 'en', label: 'English', flag: '🇺🇸' },
        { id: 'ar', label: 'العربية', flag: '🇸🇦' },
        { id: 'ru', label: 'Русский', flag: '🇷🇺' },
        { id: 'zh', label: '简体中文', flag: '🇨🇳' }
    ];

    return (
        <motion.div initial={{ x: 400 }} animate={{ x: 0 }} style={{ padding: '20px', background: 'var(--bg-main)', minHeight: '100vh' }}>
             <div style={{ display: 'flex', alignItems: 'center', marginBottom: '35px' }}>
                <ChevronLeft size={28} onClick={() => setSubPage(null)} style={{ cursor: 'pointer' }} />
                <h2 style={{ fontSize: '1.2rem', fontWeight: '900', margin: '0 auto', transform: 'translateX(-14px)' }}>{t('profile.language')}</h2>
             </div>

             <div style={{ background: 'var(--bg-card)', borderRadius: '32px', padding: '15px', border: '1px solid var(--glass-border)' }}>
                {langs.map((l, i) => (
                    <motion.div 
                        whileTap={{ scale: 0.98 }}
                        key={l.id} 
                        onClick={() => { setLang(l.id); setSubPage(null); }}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: i === langs.length -1 ? 'none' : '1px solid var(--glass-border)', cursor: 'pointer' }}
                    >
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <span style={{ fontSize: '1.5rem' }}>{l.flag}</span>
                            <span style={{ fontWeight: '900', fontSize: '1.1rem' }}>{l.label}</span>
                        </div>
                        {lang === l.id && <Check size={22} color="var(--primary)" />}
                    </motion.div>
                ))}
             </div>
        </motion.div>
    );
}

const GroupLabel = ({ text }) => (
   <h4 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '900', margin: '0 0 12px 20px', letterSpacing: '1px' }}>{text}</h4>
);

const MenuItem = ({ icon, label, border = true, rightText, colorRight, onClick }) => (
   <motion.div 
    whileTap={{ scale: 0.98 }}
    onClick={onClick} 
    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: border ? '1px solid var(--glass-border)' : 'none', cursor: 'pointer' }}
   >
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
         <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{icon}</div>
         <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{label}</span>
      </div>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
         {rightText && <span style={{ color: colorRight || 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '900' }}>{rightText}</span>}
         <ChevronRight size={18} color="var(--text-muted)" />
      </div>
   </motion.div>
);

const SecurityScreen = ({ setSubPage, t, walletData, updateSettings }) => {
    const [showMnemonic, setShowMnemonic] = useState(false);
    const [showCurrencySelect, setShowCurrencySelect] = useState(false);
    const [showAutoLockSelect, setShowAutoLockSelect] = useState(false);

    const pinEnabled = walletData?.settings?.pinEnabled !== false;
    const bioEnabled = walletData?.settings?.bioEnabled || false;
    const notifEnabled = walletData?.settings?.notifEnabled !== false;
    const autoLock = walletData?.settings?.autoLock ?? 0;

    const togglePin = () => updateSettings({ pinEnabled: !pinEnabled });
    const toggleBio = () => updateSettings({ bioEnabled: !bioEnabled });
    const toggleNotif = () => updateSettings({ notifEnabled: !notifEnabled });

    const mnemonic = walletData?.mnemonic || "word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12";
    
    const currencies = [
        { code: 'TRY', name: 'Türk Lirası', symbol: '₺' },
        { code: 'USD', name: 'US Dollar', symbol: '$' },
        { code: 'EUR', name: 'Euro', symbol: '€' },
        { code: 'GBP', name: 'British Pound', symbol: '£' },
        { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
        { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
        { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
        { code: 'IRR', name: 'Iranian Rial', symbol: '﷼' },
        { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
        { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك' },
        { code: 'BHD', name: 'Bahraini Dinar', symbol: 'ب.د' },
        { code: 'JOD', name: 'Jordanian Dinar', symbol: 'د.ا' },
        { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
    ];

    const currentCurrency = currencies.find(c => c.code === (walletData?.settings?.currency || 'USD')) || currencies[1];

    return (
        <motion.div initial={{ x: 400 }} animate={{ x: 0 }} style={{ padding: '20px', background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '50px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '35px' }}>
                <ChevronLeft size={28} onClick={() => setSubPage(null)} style={{ cursor: 'pointer' }} />
                <h2 style={{ fontSize: '1.1rem', fontWeight: '900', margin: '0 auto', transform: 'translateX(-14px)' }}>{t('profile.security')}</h2>
            </div>
            
            <GroupLabel text={String(t('profile.security_section')).toUpperCase()} />
            <div style={{ background: 'var(--bg-card)', borderRadius: '32px', padding: '10px', border: '1px solid var(--glass-border)', marginBottom: '25px' }}>
                 <ToggleItem icon={<Lock size={20} color="var(--primary)" />} label={t('profile.pin_code')} enabled={pinEnabled} onToggle={togglePin} />
                 <ToggleItem icon={<ShieldCheck size={20} color="var(--primary)" />} label={t('profile.biometrics')} enabled={bioEnabled} onToggle={toggleBio} />
                 <ToggleItem icon={<Bell size={20} color="var(--primary)" />} label={t('profile.notifications_sound')} enabled={notifEnabled} onToggle={toggleNotif} />
                 <MenuItem 
                    icon={<Clock size={20} color="var(--primary)" />} 
                    label={t('profile.auto_lock')} 
                    rightText={autoLock === 0 ? t('profile.immediately') : autoLock === 999 ? t('profile.never') : `${autoLock} ${t('profile.minutes')}`}
                    onClick={() => setShowAutoLockSelect(true)}
                 />
                 <MenuItem 
                    icon={<LinkIcon size={20} color="var(--primary)" />} 
                    label={t('profile.connected_apps')} 
                    rightText={`0 ${t('profile.mini_app')}`}
                    onClick={() => alert(t('profile.safe_msg'))}
                 />
                 <MenuItem 
                    icon={<Coins size={20} color="var(--primary)" />} 
                    label={t('profile.currency')} 
                    rightText={`${currentCurrency.symbol} ${currentCurrency.code}`}
                    onClick={() => setShowCurrencySelect(true)}
                    border={false}
                />
            </div>

            <GroupLabel text={t('profile.security_words')} />
            <div style={{ background: 'var(--bg-card)', borderRadius: '32px', padding: '25px', border: '1px solid var(--glass-border)', textAlign: 'center' }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '20px', marginBottom: '20px', filter: showMnemonic ? 'none' : 'blur(8px)', transition: 'all 0.3s' }}>
                    <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.8', letterSpacing: '0.5px' }}>
                        {mnemonic}
                    </p>
                </div>
                <button 
                    onClick={() => setShowMnemonic(!showMnemonic)}
                    style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '12px 25px', borderRadius: '15px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 auto' }}
                >
                    {showMnemonic ? <EyeOff size={18} /> : <Eye size={18} />}
                    {showMnemonic ? t('profile.hide_phrase') : t('profile.show_phrase')}
                </button>
                <p style={{ marginTop: '15px', fontSize: '0.75rem', color: 'var(--danger)', fontWeight: 'bold' }}>
                    {t('profile.security_warning')}
                </p>
            </div>

            <AnimatePresence>
                {showCurrencySelect && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 10000, padding: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ background: 'var(--bg-card)', borderRadius: '32px', width: '100%', maxWidth: '400px', maxHeight: '80vh', overflowY: 'auto', padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 10px' }}>
                                <h3 style={{ margin: 0 }}>{t('profile.select_currency')}</h3>
                                <X onClick={() => setShowCurrencySelect(false)} style={{ cursor: 'pointer' }} />
                            </div>
                            {currencies.map(c => (
                                <div 
                                    key={c.code}
                                    onClick={() => { updateSettings({ currency: c.code }); setShowCurrencySelect(false); }}
                                    style={{ padding: '15px 20px', background: currentCurrency.code === c.code ? 'rgba(99,102,241,0.1)' : 'transparent', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', marginBottom: '5px', cursor: 'pointer' }}
                                >
                                    <span>{c.name} ({c.code})</span>
                                    <span style={{ fontWeight: 'bold' }}>{c.symbol}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
                
                {showAutoLockSelect && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 10000, padding: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ background: 'var(--bg-card)', borderRadius: '32px', width: '100%', maxWidth: '400px', maxHeight: '80vh', overflowY: 'auto', padding: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 10px' }}>
                                <h3 style={{ margin: 0 }}>{t('profile.auto_lock_title')}</h3>
                                <X onClick={() => setShowAutoLockSelect(false)} style={{ cursor: 'pointer' }} />
                            </div>
                            <p style={{ margin: '0 0 20px 0', fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0 10px' }}>{t('profile.auto_lock_desc')}</p>
                            {[
                                { val: 0, label: t('profile.immediately') },
                                { val: 1, label: `1 ${t('profile.minutes')}` },
                                { val: 5, label: `5 ${t('profile.minutes')}` },
                                { val: 15, label: `15 ${t('profile.minutes')}` },
                                { val: 60, label: `1 ${t('profile.hour')}` },
                                { val: 999, label: t('profile.never') }
                            ].map(l => (
                                <div 
                                    key={l.val}
                                    onClick={() => { updateSettings({ autoLock: l.val }); setShowAutoLockSelect(false); }}
                                    style={{ padding: '15px 20px', background: autoLock === l.val ? 'rgba(99,102,241,0.1)' : 'transparent', borderRadius: '15px', display: 'flex', justifyContent: 'space-between', marginBottom: '5px', cursor: 'pointer' }}
                                >
                                    <span>{l.label}</span>
                                    {autoLock === l.val && <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>Aktif</span>}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const ToggleItem = ({ icon, label, enabled, onToggle, border = true }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: border ? '1px solid var(--glass-border)' : 'none' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <div style={{ width: '36px', height: '36px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{icon}</div>
            <span style={{ fontWeight: 'bold', fontSize: '1rem' }}>{label}</span>
        </div>
        <div onClick={onToggle} style={{ 
            width: '50px', height: '28px', 
            background: enabled ? 'var(--primary)' : 'rgba(255,255,255,0.1)', 
            borderRadius: '20px', position: 'relative', cursor: 'pointer', transition: 'all 0.3s' 
        }}>
            <motion.div 
                animate={{ x: enabled ? 24 : 4 }}
                style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', top: '4px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }} 
            />
        </div>
    </div>
);

const ReferralScreen = ({ setSubPage, t, tgUser, handleShare, referrer, saveReferrer }) => {
    const referralCode = `QAI_${tgUser?.id || '67890'}`;
    const referralLink = `https://t.me/qai_wallet_bot?start=${tgUser?.id || '67890'}`;

    return (
        <motion.div initial={{ x: 400 }} animate={{ x: 0 }} style={{ padding: '20px', background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '90px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '35px' }}>
                <ChevronLeft size={28} onClick={() => setSubPage(null)} style={{ cursor: 'pointer' }} />
                <h2 style={{ fontSize: '1.2rem', fontWeight: '900', margin: '0 auto', transform: 'translateX(-14px)' }}>{t('profile.referral_title')}</h2>
            </div>

            {/* Referrer Info */}
            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '28px', border: '1px solid var(--glass-border)', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <UserCheck color="var(--primary)" size={24} />
                <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>{t('profile.who_invited')}</p>
                    {referrer ? (
                        <p style={{ margin: 0, fontWeight: '900', color: 'var(--primary)' }}>{referrer}</p>
                    ) : (
                        <input 
                            placeholder={t('profile.enter_code')}
                            onBlur={(e) => saveReferrer(e.target.value)}
                            style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--glass-border)', color: '#fff', outline: 'none', padding: '5px 0' }} 
                        />
                    )}
                </div>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: '32px', border: '1px solid var(--glass-border)', textAlign: 'center', marginBottom: '25px' }}>
          <div style={{ width: '80px', height: '80px', background: 'rgba(99,102,241,0.1)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 20px' }}>
                <UserPlus size={40} color="var(--primary)" />
            </div>
            <h3 style={{ fontWeight: '900', marginBottom: '10px' }}>{t('profile.referral_title')}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                {t('profile.referral_desc')}
            </p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '25px', borderRadius: '28px', border: '1px solid var(--glass-border)', marginBottom: '20px' }}>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 'bold' }}>{t('profile.your_referral')}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '15px 20px', borderRadius: '15px', marginBottom: '10px' }}>
                    <span style={{ fontWeight: '900', fontSize: '1rem', color: 'var(--primary)', letterSpacing: '0.5px' }}>{referralCode}</span>
                    <button onClick={() => { navigator.clipboard.writeText(referralCode); alert(t('home.copiedBtn')); }} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 'bold' }}>{t('home.copyBtn').toUpperCase()}</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '15px 20px', borderRadius: '15px' }}>
                    <span style={{ fontWeight: '900', fontSize: '0.8rem', color: '#fff', opacity: 0.6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px' }}>{referralLink}</span>
                    <button onClick={() => { navigator.clipboard.writeText(referralLink); alert(t('home.copiedBtn')); }} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontWeight: 'bold' }}>{t('profile.copy_link') || 'KOPYALA'}</button>
                </div>
            </div>

            <button 
                onClick={() => handleShare(referralLink)}
                style={{ width: '100%', padding: '20px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '22px', fontWeight: '900', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', boxShadow: '0 10px 25px var(--primary-glow)' }}
            >
                <Share2 size={20} /> {t('profile.invite_friends')}
            </button>
        </motion.div>
    );
};

const ThemeSelectScreen = ({ setSubPage, t, updateSettings, currentTheme }) => {
    const themes = [
        { id: 'dark', label: 'Gece (Night)', color: '#09090b' },
        { id: 'light', label: 'Gündüz (Day)', color: '#f8fafc' },
        { id: 'blue', label: 'Deniz Mavisi (Blue)', color: '#0ea5e9' },
        { id: 'green', label: 'Zümrüt Yeşil (Green)', color: '#10b981' },
        { id: 'aurora', label: 'Aurora Esintisi', color: '#c084fc' }
    ];

    return (
        <motion.div initial={{ x: 400 }} animate={{ x: 0 }} style={{ padding: '20px', background: 'var(--bg-main)', minHeight: '100vh' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '35px' }}>
                <ChevronLeft size={28} onClick={() => setSubPage(null)} style={{ cursor: 'pointer' }} />
                <h2 style={{ fontSize: '1.2rem', fontWeight: '900', margin: '0 auto', transform: 'translateX(-14px)' }}>{t('profile.theme')}</h2>
            </div>
            <div style={{ background: 'var(--bg-card)', borderRadius: '32px', padding: '15px', border: '1px solid var(--glass-border)' }}>
                {themes.map((th, i) => (
                    <motion.div 
                        whileTap={{ scale: 0.98 }}
                        key={th.id} 
                        onClick={() => { updateSettings({ theme: th.id }); }}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', borderBottom: i === themes.length -1 ? 'none' : '1px solid var(--glass-border)', cursor: 'pointer' }}
                    >
                        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: th.color, border: '2px solid rgba(255,255,255,0.1)' }} />
                            <span style={{ fontWeight: '900', fontSize: '1.1rem' }}>{th.label}</span>
                        </div>
                        {currentTheme === th.id && <Check size={22} color="var(--primary)" />}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

const PartnersScreen = ({ setSubPage, t, handleOpenLink }) => (
    <motion.div initial={{ x: 400 }} animate={{ x: 0 }} style={{ padding: '20px', background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '90px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '35px' }}>
            <ChevronLeft size={28} onClick={() => setSubPage(null)} style={{ cursor: 'pointer' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: '900', margin: '0 auto', transform: 'translateX(-14px)' }}>{t('profile.partners')}</h2>
        </div>

        <div style={{ background: 'var(--bg-card)', borderRadius: '32px', overflow: 'hidden', border: '1px solid var(--glass-border)', marginBottom: '20px' }}>
            <div style={{ padding: '25px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(0,0,0,0))' }}>
                <img src="https://storage.dyor.io/jettons/EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-/image.jpeg" style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '15px', border: '2px solid var(--primary)' }} alt="TASTE" />
                <h3 style={{ margin: '0 0 5px 0', fontSize: '1.4rem', fontWeight: '900' }}>TASTE</h3>
                <span style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--primary)', background: 'rgba(99,102,241,0.1)', padding: '4px 12px', borderRadius: '10px' }}>{t('profile.partner_title')}</span>
            </div>
            
            <div style={{ padding: '20px' }}>
                <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.6' }}>
                    {t('profile.partner_desc')}
                </p>

                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '20px', padding: '15px', marginBottom: '15px', border: '1px solid var(--glass-border)' }}>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '5px' }}>{t('profile.contract_address')}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#fff', opacity: 0.8 }}>EQB0...VWUxZc-</span>
                        <div onClick={() => { navigator.clipboard.writeText('EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-'); alert(t('profile.copy_contract')); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 'bold' }}>
                            <Copy size={14} /> {t('home.copyBtn')}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gap: '10px' }}>
                    <button onClick={() => handleOpenLink('https://t.me/taste_miniapp/1')} style={{ width: '100%', padding: '16px', borderRadius: '18px', background: '#2ca5e0', color: '#fff', border: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.95rem', cursor: 'pointer' }}>
                        <MessageCircle size={20} /> {t('profile.official_channel')}
                    </button>
                    <button onClick={() => handleOpenLink('https://t.me/taste_launch_bot')} style={{ width: '100%', padding: '16px', borderRadius: '18px', background: 'var(--primary)', color: '#fff', border: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.95rem', cursor: 'pointer' }}>
                        <Smartphone size={20} /> {t('profile.mini_app')}
                    </button>
                </div>
            </div>
        </div>
    </motion.div>
);

const FaqLegalScreen = ({ setSubPage, t }) => (
    <motion.div initial={{ x: 400 }} animate={{ x: 0 }} style={{ padding: '20px', background: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '90px' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
            <ChevronLeft size={28} onClick={() => setSubPage('information')} style={{ cursor: 'pointer' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: '900', margin: '0 auto', transform: 'translateX(-14px)' }}>{t ? t('faq.title') : 'S.S.S ve Yasal'}</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}><Info size={18} /> Yasal Uyarı ve Sorumluluk Reddi</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.7', margin: 0, textAlign: 'justify' }}>
                    QAI Wallet, tamamen ağa bağlı merkeziyetsiz (DeFi) bir cüzdan arayüzü sağlayıcısıdır. Varlıklarınız blockchain ağlarında yaşar. Uygulama ve geliştiriciler, kullanıcıların hesaplarına, gizli anahtarlarına veya 12 kelimelik kurtarma ifadelerine <strong>KESİNLİKLE EREMEZ, bunları saklamaz ve kurtulmalarına yardımcı olamaz.</strong> Hesap güvenliği tamamen sizin kontrolünüzdedir.
                </p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '24px', border: '1px solid rgba(239, 68, 68, 0.4)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px' }}><ShieldCheck size={18} /> Yeni Tokenlar ve Alım/Satım Riski</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.7', margin: 0, textAlign: 'justify' }}>
                    <strong style={{ color: '#fff' }}>HUKUKİ İHTAR:</strong> Platformumuzda "Yeni Listelenenler", "Trending" (Trendler), "Discovery Hub" gibi alanlarda veya iş ortaklarımız olarak görünen, yeni çıkan hiçbir coin veya token tarafımızdan yapılmış bir <strong>yatırım tavsiyesi değildir.</strong><br/><br/>
                    Kullanıcıların bu yeni varlıklara yatırım yapması, token alış-satışı (swap/trade) gerçekleştirmesi <strong>tamamen kendi bağımsız hür iradelerine ve risk almalarına tabidir.</strong> Piyasadaki sert düşüşler, likidite tükenmesi (rug pull), akıllı sözleşme zaafiyetleri ve dolandırıcılıklardan kaynaklanacak hiçbir maddi/manevi zarardan dolayı <strong>QAI Wallet, kurucuları, iştirakleri ve ortakları hukuki olarak sorumlu tutulamaz.</strong> Platformumuzu kullanarak bu finansal risk sözleşmesini peşinen kabul edersiniz.
                </p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: 'var(--primary)' }}>Sıkça Sorulan Sorular</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <strong style={{ fontSize: '0.85rem', color: '#fff' }}>1. Param güvende mi?</strong>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '5px 0 0 0', lineHeight: '1.5' }}>Evet. Ancak kontrol QAI Wallet'ta değil, sizdedir. Blockchain yapısı gereği 12 kurtarma kelimenizi koruduğunuz sürece güvendesiniz.</p>
                    </div>
                     <div>
                        <strong style={{ fontSize: '0.85rem', color: '#fff' }}>2. Transfer işlemi onaylandı ama bakiye gelmedi?</strong>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '5px 0 0 0', lineHeight: '1.5' }}>Ağ (EVM, TON) yoğunluklarında gecikmeler mümkündür. Panik yapmayın, ağ düzeldiğinde işlem explorer üzerinden görülecektir.</p>
                    </div>
                </div>
            </div>
            
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', opacity: 0.6, marginTop: '20px', paddingBottom: '20px' }}>
                Uluslararası kripto varlık regülasyonları (MiCA vb.) kapsamında hazırlanmıştır.<br/>Tüm Hakları Saklıdır © 2026 QAI Wallet.
            </p>
        </div>
    </motion.div>
);

export default Profile;
