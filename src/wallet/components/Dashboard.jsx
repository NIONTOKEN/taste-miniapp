import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, CreditCard, Send, ArrowDownToLine, RefreshCcw, Layers, Wallet, Globe, X, ExternalLink, Twitter, MessageCircle, Copy, Info } from 'lucide-react';
import { WALLET_CONFIG } from '../config';

const Dashboard = ({ livePrices }) => {
   const [showPopup, setShowPopup] = useState(false);
   const [selectedToken, setSelectedToken] = useState(null);

   const updatedTokens = WALLET_CONFIG.TOKENS.map(t => ({
      ...t,
      price: livePrices[t.id] !== undefined ? livePrices[t.id] : t.price
   }));

   const getExplorerLink = (token) => {
      if (!token.contract) {
         return `https://google.com/search?q=${token.name}+${token.network}+explorer`;
      }
      const baseUrl = WALLET_CONFIG.EXPLORERS[token.network] || WALLET_CONFIG.EXPLORERS.NONE;
      return baseUrl + token.contract;
   };

   return (
      <div style={{ padding: '0', paddingBottom: '100px', fontFamily: 'Inter, sans-serif' }}>
         
         {/* ÜST BİLGİ VE BAKİYE (Antarctic Tarzı) */}
         <div style={{ background: 'var(--card)', padding: '40px 20px', borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px', borderBottom: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
               <Wallet size={18} color="var(--primary)" />
               <span style={{ color: 'var(--text-muted)', fontWeight: 'bold', fontSize: '0.9rem', letterSpacing: '1px' }}>ANA CÜZDAN</span>
            </div>
            
            <h1 style={{ fontSize: '3.5rem', fontWeight: '1000', margin: '0', letterSpacing: '-1px' }}>$0.00</h1>
            <p style={{ color: '#4cd964', fontWeight: 'bold', fontSize: '0.9rem', marginTop: '10px', background: 'rgba(76,217,100,0.1)', padding: '4px 12px', borderRadius: '12px' }}>
               +0.00%
            </p>

            {/* ANA BUTONLAR */}
            <div style={{ display: 'flex', gap: '15px', marginTop: '30px', width: '100%' }}>
               <button onClick={() => setShowPopup(true)} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '18px', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer' }}>
                  <CreditCard size={20} />
                  Top Up
               </button>
               <button onClick={() => {}} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '16px', background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid var(--glass-border)', borderRadius: '18px', fontWeight: 'bold', fontSize: '0.95rem', cursor: 'pointer' }}>
                  <QrCode size={20} />
                  Scan
               </button>
            </div>
         </div>

         {/* HIZLI İŞLAM (QUICK ACTIONS) */}
         <div style={{ display: 'flex', justifyContent: 'space-between', margin: '25px 20px', padding: '20px', background: 'var(--card)', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
               <div style={{ background: 'rgba(255,255,255,0.05)', padding: '14px', borderRadius: '16px' }}><ArrowDownToLine size={22} color="var(--primary)"/></div>
               <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Receive</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
               <div style={{ background: 'rgba(255,255,255,0.05)', padding: '14px', borderRadius: '16px' }}><Send size={22} /></div>
               <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Send</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
               <div style={{ background: 'rgba(255,255,255,0.05)', padding: '14px', borderRadius: '16px' }}><RefreshCcw size={22} /></div>
               <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Swap</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
               <div style={{ background: 'rgba(255,255,255,0.05)', padding: '14px', borderRadius: '16px' }}><Layers size={22} /></div>
               <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>Earn</span>
            </div>
         </div>

         {/* VARLIKLAR LİSTESİ */}
         <div style={{ padding: '0 20px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '900', marginBottom: '15px' }}>Assets</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
               {updatedTokens.map((token, idx) => (
                  <motion.div 
                    whileTap={{ scale: 0.98 }}
                    key={idx} 
                    onClick={() => setSelectedToken(token)}
                    style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 20px', background: 'var(--card)', borderRadius: '24px', border: '1px solid var(--glass-border)' }}
                  >
                     <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <img src={token.icon} alt={token.symbol} style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div>
                           <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '900' }}>{token.symbol}</h4>
                           <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>${token.price ? Number(token.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : '0.00'}</span>
                        </div>
                     </div>
                     <div style={{ textAlign: 'right' }}>
                        <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '900' }}>{token.balance.toFixed(2)}</h4>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '600' }}>
                           ${(token.balance * (token.price || 0)).toFixed(2)}
                        </span>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>

         {/* ALTYAPI ÇALIŞMASI (MASAK POPUP) */}
         <AnimatePresence>
            {showPopup && (
               <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                  <motion.div initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 200, opacity: 0 }} style={{ background: 'var(--card)', width: '100%', borderRadius: '30px 30px 0 0', padding: '35px 25px', textAlign: 'center', borderTop: '1px solid var(--glass-border)' }}>
                     <Globe size={48} color="var(--primary)" style={{ marginBottom: '15px' }} />
                     <h3 style={{ fontSize: '1.4rem', fontWeight: '1000', margin: '0 0 15px 0' }}>Banka & MASAK Entegrasyonu</h3>
                     <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '30px' }}>
                        Türkiye Cumhuriyeti MASAK regülasyonlarına tam uyum ve QAI partner banka API entegrasyonlarımız devam etmektedir. Güvenli Kredi Kartı modülü (Top Up) önümüzdeki güncellemeyle aktif edilecektir.
                     </p>
                     <button onClick={() => setShowPopup(false)} style={{ width: '100%', padding: '18px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '18px', fontWeight: '1000', fontSize: '1rem', cursor: 'pointer' }}>Anladım</button>
                  </motion.div>
               </div>
            )}
         </AnimatePresence>

         {/* TOKEN DETAY POPUP */}
         <AnimatePresence>
            {selectedToken && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
                    <motion.div 
                        initial={{ y: 300 }} 
                        animate={{ y: 0 }} 
                        exit={{ y: 300 }}
                        style={{ background: 'var(--card)', width: '100%', borderRadius: '32px 32px 0 0', padding: '30px 20px', borderTop: '1px solid var(--glass-border)', maxHeight: '90vh', overflowY: 'auto' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <img src={selectedToken.icon} style={{ width: '50px', height: '50px', borderRadius: '50%' }} alt="" />
                                <div>
                                    <h3 style={{ margin: 0, fontWeight: '1000' }}>{selectedToken.name}</h3>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{selectedToken.network} Network</span>
                                </div>
                            </div>
                            <X onClick={() => setSelectedToken(null)} style={{ cursor: 'pointer' }} size={28} />
                        </div>

                        <div style={{ textAlign: 'center', padding: '30px 0', borderBottom: '1px solid var(--glass-border)' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'bold', marginBottom: '8px' }}>GÜNCEL FİYAT</div>
                            <div style={{ fontSize: '2.5rem', fontWeight: '1000' }}>${selectedToken.price ? Number(selectedToken.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 }) : '0.00'}</div>
                        </div>

                        <div style={{ padding: '20px 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0' }}>
                                <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>Sembol</span>
                                <span style={{ fontWeight: '900' }}>{selectedToken.symbol}</span>
                            </div>
                            {selectedToken.contract && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--text-muted)', fontWeight: 'bold' }}>Kontrat</span>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <span style={{ fontWeight: '900', fontSize: '0.8rem', opacity: 0.7 }}>{selectedToken.contract.slice(0,6)}...{selectedToken.contract.slice(-6)}</span>
                                        <Copy size={16} style={{ cursor: 'pointer' }} onClick={() => { navigator.clipboard.writeText(selectedToken.contract); alert('Kontrat kopyalandı!'); }} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '20px' }}>
                            <a 
                                href={getExplorerLink(selectedToken)} 
                                target="_blank" rel="noreferrer"
                                style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '18px', borderRadius: '20px', textAlign: 'center', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                            >
                                <ExternalLink size={18} /> Explorer
                            </a>
                            {selectedToken.socials?.website && (
                                <a 
                                    href={selectedToken.socials.website} 
                                    target="_blank" rel="noreferrer"
                                    style={{ textDecoration: 'none', background: 'var(--primary)', color: '#fff', padding: '18px', borderRadius: '20px', textAlign: 'center', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                                >
                                    <Globe size={18} /> Website
                                </a>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '25px' }}>
                            {selectedToken.socials?.twitter && (
                                <a href={selectedToken.socials.twitter} target="_blank" rel="noreferrer" style={{ color: '#fff', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '15px' }}>
                                    <Twitter size={22} color="#1DA1F2" />
                                </a>
                            )}
                            {selectedToken.socials?.telegram && (
                                <a href={selectedToken.socials.telegram} target="_blank" rel="noreferrer" style={{ color: '#fff', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '15px' }}>
                                    <MessageCircle size={22} color="#0088cc" />
                                </a>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
         </AnimatePresence>
      </div>
   );
};

export default Dashboard;
