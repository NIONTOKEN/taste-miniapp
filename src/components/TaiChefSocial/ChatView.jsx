import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Image as ImageIcon, 
  ArrowLeft, 
  CheckCheck, 
  ChefHat, 
  ShieldCheck,
  Utensils
} from 'lucide-react';
import { api } from './services/api';
import { getSocket } from './services/socket';
import { triggerHaptic } from './services/telegram';
import { sounds } from './utils/sound';

export default function ChatView({
  currentUser,
  activeChef,
  onSelectChef,
  allChefs = [],
  onBackToFeed,
  lang = 'tr',
  t
}) {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [partnerIsTyping, setPartnerIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const loadConversations = async () => {
    try {
      if (!currentUser?.id) return;
      const convs = await api.getConversations(currentUser.id);
      setConversations(convs);
    } catch (e) {
      console.warn('Conv load error:', e);
    }
  };

  const loadMessages = async (otherChefId) => {
    if (!otherChefId || !currentUser?.id) return;
    setLoading(true);
    try {
      const msgs = await api.getMessages(currentUser.id, otherChefId);
      setMessages(msgs);
      scrollToBottom();
    } catch (e) {
      console.warn('Messages load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [currentUser?.id]);

  useEffect(() => {
    if (activeChef?.id) {
      loadMessages(activeChef.id);
    }
  }, [activeChef?.id, currentUser?.id]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNewMessage = (msg) => {
      if (
        (msg.senderId === activeChef?.id && msg.receiverId === currentUser?.id) ||
        (msg.senderId === currentUser?.id && msg.receiverId === activeChef?.id)
      ) {
        setMessages((prev) => {
          if (prev.some(m => m.id === msg.id)) return prev;
          return [...prev, msg];
        });
        scrollToBottom();

        if (msg.senderId === activeChef?.id) {
          sounds.playMessage();
          triggerHaptic('light');
        }
      }
      loadConversations();
    };

    const handleTyping = ({ senderId, isTyping }) => {
      if (senderId === activeChef?.id) {
        setPartnerIsTyping(isTyping);
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('user_typing', handleTyping);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('user_typing', handleTyping);
    };
  }, [activeChef?.id, currentUser?.id]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputText(val);

    const socket = getSocket();
    if (socket && activeChef?.id) {
      socket.emit('typing', {
        senderId: currentUser?.id,
        receiverId: activeChef.id,
        isTyping: true
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing', {
          senderId: currentUser?.id,
          receiverId: activeChef.id,
          isTyping: false
        });
      }, 1500);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      triggerHaptic('light');
    }
  };

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText !== null ? customText : inputText;
    if ((!textToSend.trim() && !selectedImage) || !activeChef?.id) return;

    triggerHaptic('light');
    let uploadedImageUrl = null;

    if (selectedImage) {
      try {
        const uploadRes = await api.uploadImage(selectedImage);
        uploadedImageUrl = uploadRes.url;
      } catch (e) {
        console.error('Image upload failed:', e);
      }
    }

    const socket = getSocket();
    const msgPayload = {
      senderId: currentUser?.id,
      receiverId: activeChef.id,
      text: textToSend.trim(),
      image: uploadedImageUrl
    };

    if (socket) {
      socket.emit('send_private_message', msgPayload);
    }

    setInputText('');
    setSelectedImage(null);
    setImagePreview('');
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-140px)] flex rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
      {/* Sol Panel: Sohbet Listesi */}
      <div className={`w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50 ${
        activeChef ? 'hidden md:flex' : 'flex'
      }`}>
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-amber-600" />
            <h2 className="font-bold text-slate-900 text-sm">{t.messages}</h2>
          </div>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 font-bold px-2 py-0.5 rounded-full">
            Live DM
          </span>
        </div>

        {/* Hızlı Şef Seçici */}
        <div className="p-3 border-b border-slate-200 bg-white">
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">
            {lang === 'tr' ? 'Şefler ile Sohbet Başlat' : 'Start Chat With Chefs'}
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {allChefs.filter(c => c.id !== currentUser?.id).map(chef => (
              <button
                key={chef.id}
                onClick={() => {
                  triggerHaptic('light');
                  onSelectChef(chef);
                }}
                className="flex-shrink-0 flex flex-col items-center group"
              >
                <div className="relative">
                  <img
                    src={chef.avatar || '/chef-logo.png'}
                    alt={chef.name}
                    className="w-11 h-11 rounded-2xl object-cover border border-slate-200 group-hover:border-amber-500 transition-colors shadow-sm"
                  />
                  <span 
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                      chef.isOnline ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  />
                </div>
                <span className="text-[10px] text-slate-600 font-semibold group-hover:text-amber-700 mt-1 max-w-[55px] truncate">
                  {chef.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Aktif Konuşmalar */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-white">
          {conversations.length > 0 ? (
            conversations.map(({ user, lastMessage, unreadCount }) => {
              const isSelected = activeChef?.id === user.id;
              return (
                <button
                  key={user.id}
                  onClick={() => {
                    triggerHaptic('light');
                    onSelectChef(user);
                  }}
                  className={`w-full p-3.5 flex items-center gap-3 text-left transition-colors ${
                    isSelected ? 'bg-amber-50/70 border-l-4 border-amber-500' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="relative">
                    <img src={user.avatar || '/chef-logo.png'} alt={user.name} className="w-11 h-11 rounded-2xl object-cover border border-slate-200" />
                    <span 
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                        user.isOnline ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      {lastMessage && (
                        <span className="text-[10px] text-slate-400">
                          {new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {lastMessage ? lastMessage.text || 'ğŸ“· Görsel' : user.restaurant || user.title}
                    </p>
                  </div>

                  {unreadCount > 0 && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              <p>{lang === 'tr' ? 'Henüz aktif sohbetiniz yok.' : 'No active chats yet.'}</p>
              <p className="mt-1 text-[11px] text-amber-600 font-medium">
                {lang === 'tr' ? 'Yukarıdaki şeflerden birini seçerek başlayın!' : 'Select a chef above to start!'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Sağ Panel: Aktif Sohbet */}
      {activeChef ? (
        <div className="flex-1 flex flex-col bg-white">
          {/* Sohbet Header */}
          <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onSelectChef(null)}
                className="md:hidden p-1.5 rounded-xl text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="relative">
                <img
                  src={activeChef.avatar || '/chef-logo.png'}
                  alt={activeChef.name}
                  className="w-10 h-10 rounded-2xl object-cover border border-amber-500/30"
                />
                <span 
                  className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                    activeChef.isOnline ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-slate-900 text-sm">{activeChef.name}</h3>
                  <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-full border border-amber-200">
                    {activeChef.title || 'Şef'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {partnerIsTyping ? (
                    <span className="text-amber-600 font-semibold animate-pulse">
                      {lang === 'tr' ? 'yazıyor...' : 'typing...'}
                    </span>
                  ) : (
                    activeChef.restaurant || (activeChef.isOnline ? t.online : t.offline)
                  )}
                </p>
              </div>
            </div>

            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 ${
              activeChef.isOnline 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-slate-100 text-slate-500'
            }`}>
              <span className={`w-2 h-2 rounded-full ${activeChef.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              {activeChef.isOnline ? t.online : t.offline}
            </span>
          </div>

          {/* Mesaj Akışı */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
            {messages.length === 0 && !loading && (
              <div className="text-center py-12 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                  <Utensils className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  {activeChef.name} {lang === 'tr' ? 'ile sohbeti başlatın' : '- start conversation'}
                </p>
                <p className="text-xs text-slate-500">
                  {lang === 'tr' ? 'Reçeteler, tabaklar veya gastronomi hakkında yazışın.' : 'Discuss recipes, dishes, and culinary ideas.'}
                </p>
              </div>
            )}

            {messages.map((m) => {
              const isMine = m.senderId === currentUser?.id;
              return (
                <div
                  key={m.id}
                  className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] sm:max-w-md rounded-2xl p-3 shadow-sm ${
                      isMine
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                    }`}
                  >
                    {m.image && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-black/10">
                        <img src={m.image} alt="Mesaj" className="w-full max-h-60 object-cover" />
                      </div>
                    )}

                    {m.text && <p className="text-xs leading-relaxed font-medium">{m.text}</p>}

                    <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                      isMine ? 'text-amber-100' : 'text-slate-400'
                    }`}>
                      <span>
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMine && <CheckCheck className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {partnerIsTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-3 py-2 text-xs text-slate-500 flex items-center gap-1.5 border border-slate-200 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[11px] ml-1 font-medium">{lang === 'tr' ? 'Şef yazıyor...' : 'Chef is typing...'}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Hızlı Şef Mesaj Şablonları */}
          <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-200 flex gap-1.5 overflow-x-auto">
            {t.quickMsgs.map((quick, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(quick)}
                className="flex-shrink-0 text-[11px] px-3 py-1 rounded-full bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-800 border border-slate-200 transition-colors whitespace-nowrap shadow-2xs"
              >
                {quick}
              </button>
            ))}
          </div>

          {/* Resim Önizleme */}
          {imagePreview && (
            <div className="p-2 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-amber-500">
                <img src={imagePreview} alt="Seçilen" className="w-full h-full object-cover" />
                <button
                  onClick={() => { setSelectedImage(null); setImagePreview(''); }}
                  className="absolute top-0.5 right-0.5 bg-black/70 text-white rounded-full p-0.5"
                >
                  ✕
                </button>
              </div>
              <span className="text-xs text-slate-600 font-medium">
                {lang === 'tr' ? 'Görsel eklendi, göndermek için enter\'a basın' : 'Image attached, press enter to send'}
              </span>
            </div>
          )}

          {/* Mesaj Giriş Barı */}
          <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-amber-600 transition-colors"
              title={lang === 'tr' ? 'Fotoğraf Gönder' : 'Send Photo'}
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={`${activeChef.name} ${lang === 'tr' ? 'adlı şefe mesaj yazın...' : '- type a message...'}`}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white"
            />

            <button
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() && !selectedImage}
              className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-bold transition-all active:scale-95 shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex flex-1 items-center justify-center p-8 text-center bg-slate-50/50">
          <div className="max-w-xs space-y-3">
            <img src="/chef-logo.png" alt="TAI Chef" className="w-16 h-16 mx-auto rounded-full shadow border-2 border-amber-500/40 p-0.5 object-cover" />
            <h3 className="font-serif font-bold text-slate-900 text-base">
              {lang === 'tr' ? 'Bir Şef Seçin' : 'Select a Chef'}
            </h3>
            <p className="text-xs text-slate-500">
              {lang === 'tr' 
                ? 'Sol taraftaki şeflerden birini seçerek anlık olarak mesajlaşmaya başlayın.' 
                : 'Select a chef from the left list to start real-time messaging.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

