const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { readDB, writeDB, initDB } = require('./db');

const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

// Uploads dizini
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multer Storage (Gerçek Resim VE Video Yükleme)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.mp4';
    const isVideo = ['.mp4', '.mov', '.webm', '.mkv'].includes(ext);
    const prefix = isVideo ? 'chef-vid-' : 'chef-img-';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, prefix + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100 MB Video / Fotoğraf Limiti
});

// Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Aktif bağlı kullanıcılar: userId -> Set(socketId)
const userSockets = new Map();

function isUserOnline(userId) {
  const set = userSockets.get(userId);
  return !!(set && set.size > 0);
}

io.on('connection', (socket) => {
  console.log('⚡ Socket bağlantısı:', socket.id);

  socket.on('user_connected', (userId) => {
    if (!userId) return;
    socket.userId = userId;
    socket.join(`user_${userId}`);

    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId).add(socket.id);

    const db = readDB();
    const user = db.users.find(u => u.id === userId);
    if (user) {
      user.isOnline = true;
      user.lastSeen = new Date().toISOString();
      writeDB(db);
    }

    io.emit('online_status_changed', {
      userId,
      isOnline: true,
      lastSeen: new Date().toISOString()
    });
    console.log(`👤 Kullanıcı ${userId} çevrimiçi oldu.`);
  });

  socket.on('typing', ({ senderId, receiverId, isTyping }) => {
    io.to(`user_${receiverId}`).emit('user_typing', { senderId, isTyping });
  });

  socket.on('send_private_message', (msgData) => {
    const db = readDB();
    const newMsg = {
      id: 'm-' + Date.now(),
      senderId: msgData.senderId,
      receiverId: msgData.receiverId,
      text: msgData.text || '',
      image: msgData.image || null,
      createdAt: new Date().toISOString(),
      isRead: false
    };

    if (!db.messages) db.messages = [];
    db.messages.push(newMsg);

    const sender = db.users.find(u => u.id === msgData.senderId);
    const newNotif = {
      id: 'notif-' + Date.now(),
      userId: msgData.receiverId,
      actorId: msgData.senderId,
      type: 'message',
      message: `${sender ? sender.name : 'Bir kullanıcı'} size yeni bir mesaj gönderdi.`,
      postId: null,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    if (!db.notifications) db.notifications = [];
    db.notifications.unshift(newNotif);
    writeDB(db);

    io.to(`user_${msgData.senderId}`).emit('new_message', newMsg);
    io.to(`user_${msgData.receiverId}`).emit('new_message', newMsg);
    io.to(`user_${msgData.receiverId}`).emit('new_notification', newNotif);
  });

  socket.on('disconnect', () => {
    const userId = socket.userId;
    if (userId && userSockets.has(userId)) {
      const set = userSockets.get(userId);
      set.delete(socket.id);
      if (set.size === 0) {
        userSockets.delete(userId);

        const db = readDB();
        const user = db.users.find(u => u.id === userId);
        const lastSeen = new Date().toISOString();
        if (user) {
          user.isOnline = false;
          user.lastSeen = lastSeen;
          writeDB(db);
        }

        io.emit('online_status_changed', {
          userId,
          isOnline: false,
          lastSeen
        });
        console.log(`🔌 Kullanıcı ${userId} çevrimdışı oldu.`);
      }
    }
  });
});

// ================= API ENDPOINTS ================= //

// 1. Medya Yükleme (Resim VE Video)
app.post('/api/upload', upload.single('media'), (req, res) => {
  // Hem 'media' hem 'image' field ismini destekleyelim
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'Medya dosyası yüklenemedi' });
  }

  const ext = path.extname(file.filename).toLowerCase();
  const isVideo = ['.mp4', '.mov', '.webm', '.mkv'].includes(ext);
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;

  res.json({
    success: true,
    url: fileUrl,
    filename: file.filename,
    mediaType: isVideo ? 'video' : 'image'
  });
});

// Geriye dönük uyumluluk (image field adı için fallback)
app.post('/api/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Dosya yüklenemedi' });
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl, mediaType: 'image' });
});

// 2. Auth: Register & Login
app.post('/api/auth/register', (req, res) => {
  const { username, password, name, title, restaurant, location, bio, avatar } = req.body;
  if (!username || !name) {
    return res.status(400).json({ error: 'Kullanıcı adı ve Ad Soyad zorunludur' });
  }

  const db = readDB();
  const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

  if (db.users.some(u => u.username?.toLowerCase() === cleanUsername)) {
    return res.status(400).json({ error: 'Bu kullanıcı adı zaten alınmış!' });
  }

  const newUser = {
    id: 'u-' + Date.now(),
    username: cleanUsername,
    password: password || '123456',
    name: name.trim(),
    title: title?.trim() || 'Aşçı / Şef',
    restaurant: restaurant?.trim() || 'Kendi Mutfağı',
    location: location?.trim() || 'Türkiye',
    bio: bio?.trim() || 'Lezzet ve gastronomi tutkunu.',
    avatar: avatar || '/chef-logo.png',
    isVerified: true,
    isOnline: true,
    lastSeen: new Date().toISOString(),
    friends: [],
    friendRequestsSent: [],
    friendRequestsReceived: [],
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  writeDB(db);

  res.status(201).json({ success: true, user: newUser });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username) return res.status(400).json({ error: 'Kullanıcı adı gerekli' });

  const db = readDB();
  const cleanUsername = username.trim().toLowerCase();
  const user = db.users.find(u => u.username?.toLowerCase() === cleanUsername);

  if (!user) {
    return res.status(404).json({ error: 'Bu kullanıcı adına sahip bir profil bulunamadı' });
  }

  if (password && user.password && user.password !== password) {
    return res.status(401).json({ error: 'Hatalı şifre girdiniz' });
  }

  res.json({
    success: true,
    user: {
      ...user,
      isOnline: isUserOnline(user.id) || user.isOnline
    }
  });
});

// 3. Profil Güncelleme
app.put('/api/users/:id/profile', (req, res) => {
  const { id } = req.params;
  const { name, title, restaurant, location, bio, avatar, isVerified } = req.body;

  const db = readDB();
  const user = db.users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

  if (name) user.name = name.trim();
  if (title) user.title = title.trim();
  if (restaurant) user.restaurant = restaurant.trim();
  if (location) user.location = location.trim();
  if (typeof bio !== 'undefined') user.bio = bio.trim();
  if (avatar) user.avatar = avatar;
  if (typeof isVerified !== 'undefined') user.isVerified = isVerified;

  writeDB(db);
  io.emit('user_profile_updated', user);
  res.json({ success: true, user });
});

// 4. Kullanıcılar
app.get('/api/users', (req, res) => {
  const db = readDB();
  const users = db.users.map(u => ({
    ...u,
    isOnline: isUserOnline(u.id) || !!u.isOnline
  }));
  res.json(users);
});

// 5. Arkadaşlık İstekleri
app.post('/api/friends/request', (req, res) => {
  const { fromUserId, toUserId } = req.body;
  if (!fromUserId || !toUserId || fromUserId === toUserId) {
    return res.status(400).json({ error: 'Geçersiz arkadaşlık isteği' });
  }

  const db = readDB();
  const fromUser = db.users.find(u => u.id === fromUserId);
  const toUser = db.users.find(u => u.id === toUserId);

  if (!fromUser || !toUser) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

  if (!fromUser.friends) fromUser.friends = [];
  if (!toUser.friends) toUser.friends = [];
  if (!fromUser.friendRequestsSent) fromUser.friendRequestsSent = [];
  if (!toUser.friendRequestsReceived) toUser.friendRequestsReceived = [];

  if (fromUser.friends.includes(toUserId)) {
    return res.status(400).json({ error: 'Zaten arkadaşsınız' });
  }

  if (!fromUser.friendRequestsSent.includes(toUserId)) {
    fromUser.friendRequestsSent.push(toUserId);
  }
  if (!toUser.friendRequestsReceived.includes(fromUserId)) {
    toUser.friendRequestsReceived.push(fromUserId);
  }

  const notif = {
    id: 'notif-' + Date.now(),
    userId: toUserId,
    actorId: fromUserId,
    type: 'friend_request',
    message: `${fromUser.name} size arkadaşlık isteği gönderdi.`,
    postId: null,
    createdAt: new Date().toISOString(),
    isRead: false
  };

  if (!db.notifications) db.notifications = [];
  db.notifications.unshift(notif);

  writeDB(db);

  io.to(`user_${toUserId}`).emit('new_notification', notif);
  io.to(`user_${toUserId}`).emit('friend_request_received', { fromUser });

  res.json({ success: true, message: 'Arkadaşlık isteği iletildi' });
});

app.post('/api/friends/accept', (req, res) => {
  const { userId, requesterId } = req.body;
  const db = readDB();

  const user = db.users.find(u => u.id === userId);
  const requester = db.users.find(u => u.id === requesterId);

  if (!user || !requester) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });

  user.friendRequestsReceived = (user.friendRequestsReceived || []).filter(id => id !== requesterId);
  requester.friendRequestsSent = (requester.friendRequestsSent || []).filter(id => id !== userId);

  if (!user.friends) user.friends = [];
  if (!requester.friends) requester.friends = [];

  if (!user.friends.includes(requesterId)) user.friends.push(requesterId);
  if (!requester.friends.includes(userId)) requester.friends.push(userId);

  const notif = {
    id: 'notif-' + Date.now(),
    userId: requesterId,
    actorId: userId,
    type: 'friend_accept',
    message: `${user.name} arkadaşlık isteğinizi kabul etti. Artık bağlantıdasınız!`,
    postId: null,
    createdAt: new Date().toISOString(),
    isRead: false
  };

  if (!db.notifications) db.notifications = [];
  db.notifications.unshift(notif);

  writeDB(db);

  io.to(`user_${requesterId}`).emit('new_notification', notif);
  io.emit('friendship_updated', { user1: userId, user2: requesterId });

  res.json({ success: true, user, requester });
});

app.post('/api/friends/decline', (req, res) => {
  const { userId, requesterId } = req.body;
  const db = readDB();

  const user = db.users.find(u => u.id === userId);
  const requester = db.users.find(u => u.id === requesterId);

  if (user) {
    user.friendRequestsReceived = (user.friendRequestsReceived || []).filter(id => id !== requesterId);
  }
  if (requester) {
    requester.friendRequestsSent = (requester.friendRequestsSent || []).filter(id => id !== userId);
  }

  writeDB(db);
  res.json({ success: true });
});

// Arkadaşlıktan Çıkar (Unfriend / Remove Friend)
app.post('/api/friends/remove', (req, res) => {
  const { userId, targetId } = req.body;
  if (!userId || !targetId) {
    return res.status(400).json({ error: 'Kullanıcı IDleri gerekli' });
  }

  const db = readDB();
  const user = db.users.find(u => u.id === userId);
  const target = db.users.find(u => u.id === targetId);

  if (user && user.friends) {
    user.friends = user.friends.filter(id => id !== targetId);
  }
  if (target && target.friends) {
    target.friends = target.friends.filter(id => id !== userId);
  }

  writeDB(db);
  io.emit('friendship_updated', { user1: userId, user2: targetId });
  res.json({ success: true, message: 'Arkadaşlıktan çıkarıldı' });
});

// 6. Gönderiler (Hem Resim Hem Video Desteği)
app.get('/api/posts', (req, res) => {
  const db = readDB();
  const enrichedPosts = (db.posts || []).map(post => {
    const author = db.users.find(u => u.id === post.userId) || {
      name: 'Şef',
      username: 'chef',
      avatar: '/chef-logo.png',
      isVerified: true
    };

    // Medya tipini otomatik anla
    const isVideo = post.mediaType === 'video' || (post.image && (post.image.includes('.mp4') || post.image.includes('.webm') || post.image.includes('.mov')));

    return {
      ...post,
      mediaType: isVideo ? 'video' : 'image',
      author
    };
  });
  enrichedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(enrichedPosts);
});

app.post('/api/posts', (req, res) => {
  const { userId, title, caption, image, mediaType, location, cookTime, difficulty, category, ingredients } = req.body;
  if (!userId || !title) {
    return res.status(400).json({ error: 'Kullanıcı ve başlık zorunludur' });
  }

  const isVideo = mediaType === 'video' || (image && (image.includes('.mp4') || image.includes('.webm') || image.includes('.mov')));

  const db = readDB();
  const newPost = {
    id: 'post-' + Date.now(),
    userId,
    title: title.trim(),
    caption: caption ? caption.trim() : '',
    image: image || '/chef-logo.png',
    mediaType: isVideo ? 'video' : 'image',
    location: location || { name: 'Mutfak', city: 'İstanbul', lat: 41.0082, lng: 28.9784 },
    cookTime: cookTime || '30 dk',
    difficulty: difficulty || 'Orta',
    category: category || 'Ana Yemek',
    ingredients: Array.isArray(ingredients) ? ingredients : (ingredients ? ingredients.split(',').map(s => s.trim()) : []),
    likes: [],
    saves: [],
    comments: [],
    createdAt: new Date().toISOString()
  };

  if (!db.posts) db.posts = [];
  db.posts.unshift(newPost);
  writeDB(db);

  const author = db.users.find(u => u.id === userId);
  const fullPost = { ...newPost, author };
  io.emit('new_post_created', fullPost);

  res.status(201).json(fullPost);
});

app.post('/api/posts/:id/like', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId gerekli' });

  const db = readDB();
  const post = (db.posts || []).find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Gönderi bulunamadı' });

  if (!post.likes) post.likes = [];
  const idx = post.likes.indexOf(userId);
  let isLiked = false;
  if (idx > -1) {
    post.likes.splice(idx, 1);
  } else {
    post.likes.push(userId);
    isLiked = true;

    if (post.userId !== userId) {
      const liker = db.users.find(u => u.id === userId);
      const newNotif = {
        id: 'notif-' + Date.now(),
        userId: post.userId,
        actorId: userId,
        type: 'like',
        message: `${liker ? liker.name : 'Bir kullanıcı'} tabağınızı beğendi: "${post.title.slice(0, 30)}"`,
        postId: post.id,
        createdAt: new Date().toISOString(),
        isRead: false
      };
      if (!db.notifications) db.notifications = [];
      db.notifications.unshift(newNotif);
      io.to(`user_${post.userId}`).emit('new_notification', newNotif);
    }
  }

  writeDB(db);
  io.emit('post_likes_updated', { postId: post.id, likes: post.likes });
  res.json({ success: true, likes: post.likes, isLiked });
});

app.post('/api/posts/:id/comments', (req, res) => {
  const { userId, text } = req.body;
  if (!userId || !text) return res.status(400).json({ error: 'userId ve text zorunludur' });

  const db = readDB();
  const post = (db.posts || []).find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Gönderi bulunamadı' });

  const commenter = db.users.find(u => u.id === userId);
  const newComment = {
    id: 'c-' + Date.now(),
    userId,
    userName: commenter ? commenter.name : 'Aşçı',
    userAvatar: commenter ? commenter.avatar : '/chef-logo.png',
    text: text.trim(),
    createdAt: new Date().toISOString()
  };

  if (!post.comments) post.comments = [];
  post.comments.push(newComment);

  if (post.userId !== userId) {
    const newNotif = {
      id: 'notif-' + Date.now(),
      userId: post.userId,
      actorId: userId,
      type: 'comment',
      message: `${commenter ? commenter.name : 'Bir kullanıcı'} tabağınıza yorum yaptı: "${text.slice(0, 30)}"`,
      postId: post.id,
      createdAt: new Date().toISOString(),
      isRead: false
    };
    if (!db.notifications) db.notifications = [];
    db.notifications.unshift(newNotif);
    io.to(`user_${post.userId}`).emit('new_notification', newNotif);
  }

  writeDB(db);
  io.emit('post_comment_added', { postId: post.id, comment: newComment });
  res.status(201).json(newComment);
});

app.post('/api/posts/:id/save', (req, res) => {
  const { userId } = req.body;
  const db = readDB();
  const post = (db.posts || []).find(p => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Gönderi bulunamadı' });

  if (!post.saves) post.saves = [];
  const idx = post.saves.indexOf(userId);
  let isSaved = false;
  if (idx > -1) {
    post.saves.splice(idx, 1);
  } else {
    post.saves.push(userId);
    isSaved = true;
  }
  writeDB(db);
  res.json({ success: true, isSaved, saves: post.saves });
});

// 7. Mesajlaşma (DM)
app.get('/api/messages/:otherUserId', (req, res) => {
  const { currentUserId } = req.query;
  const { otherUserId } = req.params;

  const db = readDB();
  const chatMessages = (db.messages || []).filter(m =>
    (m.senderId === currentUserId && m.receiverId === otherUserId) ||
    (m.senderId === otherUserId && m.receiverId === currentUserId)
  );

  let changed = false;
  chatMessages.forEach(m => {
    if (m.receiverId === currentUserId && !m.isRead) {
      m.isRead = true;
      changed = true;
    }
  });
  if (changed) writeDB(db);

  res.json(chatMessages);
});

app.get('/api/conversations/:currentUserId', (req, res) => {
  const { currentUserId } = req.params;
  const db = readDB();

  const otherUserIds = new Set();
  (db.messages || []).forEach(m => {
    if (m.senderId === currentUserId) otherUserIds.add(m.receiverId);
    if (m.receiverId === currentUserId) otherUserIds.add(m.senderId);
  });

  const conversations = Array.from(otherUserIds).map(otherId => {
    const user = db.users.find(u => u.id === otherId);
    const userMsgs = (db.messages || []).filter(m =>
      (m.senderId === currentUserId && m.receiverId === otherId) ||
      (m.senderId === otherId && m.receiverId === currentUserId)
    );
    userMsgs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const lastMessage = userMsgs[0] || null;
    const unreadCount = userMsgs.filter(m => m.receiverId === currentUserId && !m.isRead).length;

    return {
      user: user ? {
        ...user,
        isOnline: isUserOnline(user.id) || !!user.isOnline
      } : null,
      lastMessage,
      unreadCount
    };
  }).filter(c => c.user !== null);

  conversations.sort((a, b) => {
    const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt) : 0;
    const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt) : 0;
    return dateB - dateA;
  });

  res.json(conversations);
});

// 8. Bildirimler
app.get('/api/notifications/:userId', (req, res) => {
  const { userId } = req.params;
  const db = readDB();
  const userNotifs = (db.notifications || []).filter(n => n.userId === userId);

  const enrichedNotifs = userNotifs.map(n => {
    const actor = db.users.find(u => u.id === n.actorId);
    return {
      ...n,
      actor: actor || { name: 'Kullanıcı', avatar: '/chef-logo.png' }
    };
  });

  res.json(enrichedNotifs);
});

app.post('/api/notifications/:userId/mark-read', (req, res) => {
  const { userId } = req.params;
  const db = readDB();
  (db.notifications || []).forEach(n => {
    if (n.userId === userId) {
      n.isRead = true;
    }
  });
  writeDB(db);
  res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  initDB();
  console.log(`🍳 TAI Chef Sosyal Medya Sunucusu http://localhost:${PORT} üzerinde hazır! (Resim & Video Destekli)`);
});
