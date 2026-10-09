// TAI Chef Social API Service with Resilient Offline / LocalStorage Database
// Works seamlessly in static environments (Vercel SPA) and full-stack environments.

export const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_CHEF_API_URL)
  ? import.meta.env.VITE_CHEF_API_URL
  : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000'
    : '');

// Helper to safely parse JSON response and prevent HTML 200/404 crashes
async function safeFetchJson(url, options = {}) {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return { ok: false, error: 'Sunucu geçersiz yanıt döndürdü (HTML)' };
    }
    const data = await res.json();
    return { ok: res.ok, data, error: !res.ok ? (data.error || 'İşlem başarısız') : null };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Default Seed Data (Master Chefs & Inspiring Culinary Dishes)
// ─────────────────────────────────────────────────────────────────────────────
const DEFAULT_CHEFS = [
  {
    id: 'chef_mehmet',
    username: 'mehmet_sef',
    name: 'Mehmet Şef',
    title: 'Yürütücü Şef (Executive Chef)',
    restaurant: 'Gourmet Studio Nişantaşı',
    location: 'İstanbul, Türkiye',
    bio: 'Modern Türk ve Akdeniz mutfağında 18 yıllık gastronomi tecrübesi. Yerel malzemeler, küresel teknikler.',
    avatar: '/chef-logo.png',
    isVerified: true,
    isOnline: true,
    friends: ['chef_danilo', 'chef_somer'],
    incomingRequests: [],
    outgoingRequests: [],
    stats: { followers: 1840, following: 120, dishes: 14 }
  },
  {
    id: 'chef_danilo',
    username: 'danilo_chef',
    name: 'Danilo Zanna',
    title: 'İtalyan Mutfak Şefi',
    restaurant: "Filo D'olio Alsancak",
    location: 'İzmir, Türkiye',
    bio: 'Geleneksel İtalyan tarifleri, el yapımı taze makarna sanatı ve Ege zeytinyağlıları buluşması.',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&h=400&fit=crop',
    isVerified: true,
    isOnline: true,
    friends: ['chef_mehmet'],
    incomingRequests: [],
    outgoingRequests: [],
    stats: { followers: 2650, following: 140, dishes: 22 }
  },
  {
    id: 'chef_somer',
    username: 'somer_chef',
    name: 'Somer Sivrioğlu',
    title: 'Anadolu Mutfağı Araştırmacısı',
    restaurant: 'Efendy & Anason',
    location: 'Bodrum, Türkiye',
    bio: 'Kadim Anadolu reçetelerinin modern gastronomi vizyonu ile yeniden yorumlanması.',
    avatar: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=400&h=400&fit=crop',
    isVerified: true,
    isOnline: false,
    friends: ['chef_mehmet'],
    incomingRequests: [],
    outgoingRequests: [],
    stats: { followers: 3100, following: 95, dishes: 19 }
  },
  {
    id: 'chef_ayse',
    username: 'ayse_usta',
    name: 'Ayşe Usta',
    title: 'Pasta & Fırın Şefi (Pastry Chef)',
    restaurant: 'Atölye Patisserie Lara',
    location: 'Antalya, Türkiye',
    bio: 'Artisan ekşi mayalı reçeteler, geleneksel taş fırın lezzetleri ve modern Fransız pastacılığı.',
    avatar: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=400&h=400&fit=crop',
    isVerified: true,
    isOnline: true,
    friends: [],
    incomingRequests: [],
    outgoingRequests: [],
    stats: { followers: 1420, following: 88, dishes: 9 }
  }
];

const DEFAULT_POSTS = [
  {
    id: 'post_lamb_shank',
    userId: 'chef_mehmet',
    author: DEFAULT_CHEFS[0],
    title: 'Ağır Ateşte Kuzu İncik & İsli Firik Risotto',
    caption: '12 saat ağır ateşte kemik iliği ve taze dağ kekiğiyle konfi edilmiş kuzu incik, altında isli Antep firiğinden kadife risotto ve kemik iliği sosu.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop',
    mediaType: 'image',
    cookTime: '180 dk',
    difficulty: 'Usta Seviyesi',
    category: 'Et & Izgara',
    ingredients: [
      'Körpe Kuzu İncik (1.2 kg)',
      'İsli Antep Firik Bulguru',
      'Kemik İliği Suyu (24 saat kaynatılmış)',
      'Taze Dağ Kekiği & Biberiye',
      'Eski Kaşar & Yayık Tereyağı'
    ],
    location: {
      name: 'Gourmet Studio Nişantaşı',
      city: 'İstanbul',
      address: 'Abdi İpekçi Cad. No:24 Nişantaşı, İstanbul',
      lat: 41.049,
      lng: 28.993
    },
    likes: ['chef_danilo', 'chef_somer', 'chef_ayse'],
    saves: ['chef_danilo'],
    comments: [
      {
        id: 'c1',
        userId: 'chef_danilo',
        userName: 'Danilo Zanna',
        userAvatar: DEFAULT_CHEFS[1].avatar,
        text: 'Kusursuz bir glase ve parlaklık şefim! Eline sağlık 👏🔥',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'c2',
        userId: 'chef_somer',
        userName: 'Somer Sivrioğlu',
        userAvatar: DEFAULT_CHEFS[2].avatar,
        text: 'Firik dokusu muazzam görünüyor, tebrikler.',
        createdAt: new Date(Date.now() - 1800000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'post_truffle_pasta',
    userId: 'chef_danilo',
    author: DEFAULT_CHEFS[1],
    title: 'El Yapımı Trüflü Tagliolini & Parmesan Çıtırı',
    caption: '0 numara İtalyan un ve çift sarılı köy yumurtası ile taze açılmış hamur. Taze siyah kış trüfü ve 24 aylık Parmigiano Reggiano ile tavada bağlandı.',
    image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281724?w=1000&auto=format&fit=crop',
    mediaType: 'image',
    cookTime: '25 dk',
    difficulty: 'Orta',
    category: 'Makarna & Risotto',
    ingredients: [
      'Taze Açma Tagliolini Hamuru',
      'Taze Siyah Kış Trüfü',
      '24 Aylık Parmigiano Reggiano',
      'Tuzsuz Köy Tereyağı',
      'Taze Çekilmiş Tane Karabiber'
    ],
    location: {
      name: "Filo D'olio Alsancak",
      city: 'İzmir',
      address: 'Kordon Boyu No:112 Alsancak, İzmir',
      lat: 38.435,
      lng: 27.142
    },
    likes: ['chef_mehmet', 'chef_ayse'],
    saves: ['chef_mehmet'],
    comments: [
      {
        id: 'c3',
        userId: 'chef_mehmet',
        userName: 'Mehmet Şef',
        userAvatar: DEFAULT_CHEFS[0].avatar,
        text: 'Gerçek bir İtalyan klasiği Danilo şefim, mükemmel emülsiyon!',
        createdAt: new Date(Date.now() - 5400000).toISOString()
      }
    ],
    createdAt: new Date(Date.now() - 14400000).toISOString()
  },
  {
    id: 'post_baklava_dessert',
    userId: 'chef_ayse',
    author: DEFAULT_CHEFS[3],
    title: 'Karamelize İncirli Çıtır Baklava Milföy',
    caption: 'Tereyağlı çıtır el yapımı milföy katları arasında Aydın inciri reçeli ve antep fıstıklı kadife diplomat krema. Üzerinde yenilebilir altın varak dokunuşu.',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=1000&auto=format&fit=crop',
    mediaType: 'image',
    cookTime: '45 dk',
    difficulty: 'Usta Seviyesi',
    category: 'Pastacılık & Tatlı',
    ingredients: [
      'Artisan Milföy Hamuru',
      'Taze Aydın Dağ İnciri',
      'Boz Antep Fıstığı İçi',
      'Doğal Madagaskar Vanilya Çubuğu',
      'Kadife Diplomat Krema'
    ],
    location: {
      name: 'Atölye Patisserie Lara',
      city: 'Antalya',
      address: 'Lara Cad. No:45 Muratpaşa, Antalya',
      lat: 36.852,
      lng: 30.771
    },
    likes: ['chef_mehmet', 'chef_danilo', 'chef_somer'],
    saves: ['chef_mehmet', 'chef_danilo'],
    comments: [],
    createdAt: new Date(Date.now() - 28800000).toISOString()
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// Local Storage Helper Functions
// ─────────────────────────────────────────────────────────────────────────────
function getLocalUsers() {
  try {
    const raw = localStorage.getItem('chef_users_db');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) { }
  // First time initialization
  localStorage.setItem('chef_users_db', JSON.stringify(DEFAULT_CHEFS));
  return DEFAULT_CHEFS;
}

function saveLocalUsers(users) {
  try {
    localStorage.setItem('chef_users_db', JSON.stringify(users));
  } catch (e) { }
}

function getLocalPosts() {
  try {
    const raw = localStorage.getItem('chef_posts_db');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) { }
  // First time initialization
  localStorage.setItem('chef_posts_db', JSON.stringify(DEFAULT_POSTS));
  return DEFAULT_POSTS;
}

function saveLocalPosts(posts) {
  try {
    localStorage.setItem('chef_posts_db', JSON.stringify(posts));
  } catch (e) { }
}

function getLocalNotifications(userId) {
  try {
    const raw = localStorage.getItem(`chef_notifs_${userId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) { }
  return [
    {
      id: 'notif_welcome',
      userId,
      title: 'TAI Chef Hoş Geldiniz!',
      message: 'Usta şefler topluluğuna başarıyla katıldınız. Yeni tarifler keşfedin ve paylaçın.',
      type: 'system',
      read: false,
      createdAt: new Date().toISOString()
    }
  ];
}

function saveLocalNotifications(userId, notifs) {
  try {
    localStorage.setItem(`chef_notifs_${userId}`, JSON.stringify(notifs));
  } catch (e) { }
}

// ─────────────────────────────────────────────────────────────────────────────
// Public API Object
// ─────────────────────────────────────────────────────────────────────────────
export const api = {
  // 1. Auth & Kullanıcı Kayıt & Giriş
  async register(userData) {
    // If backend is configured, attempt network request
    if (API_BASE_URL) {
      const netRes = await safeFetchJson(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (netRes.ok) return netRes.data;
    }

    // LocalStorage Fallback (Vercel & Offline)
    const users = getLocalUsers();
    const existing = users.find(u => u.username.toLowerCase() === userData.username.toLowerCase());
    
    if (existing) {
      // Return existing user
      localStorage.setItem('ta_chef_user_id', existing.id);
      return { user: existing, token: 'mock_token_' + existing.id };
    }

    const newUser = {
      id: 'chef_' + Date.now(),
      username: userData.username.trim(),
      name: userData.name || userData.username,
      title: userData.title || 'Usta Şef',
      restaurant: userData.restaurant || 'Mutfak Atölyesi',
      location: userData.location || 'İstanbul, Türkiye',
      bio: userData.bio || 'Gastronomi ve lezzet tutkunu şef.',
      avatar: userData.avatar || '/chef-logo.png',
      isVerified: true,
      isOnline: true,
      friends: [],
      incomingRequests: [],
      outgoingRequests: [],
      stats: { followers: 1, following: 2, dishes: 0 }
    };

    users.unshift(newUser);
    saveLocalUsers(users);
    localStorage.setItem('ta_chef_user_id', newUser.id);
    return { user: newUser, token: 'mock_token_' + newUser.id };
  },

  async login(credentials) {
    if (API_BASE_URL) {
      const netRes = await safeFetchJson(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      if (netRes.ok) return netRes.data;
    }

    // LocalStorage Fallback (Vercel & Offline)
    const users = getLocalUsers();
    let user = users.find(u => u.username.toLowerCase() === credentials.username.toLowerCase());

    if (!user) {
      // Otomatik olarak yeni şef oluştur (Kullanıcı asla bloklanmaz)
      user = {
        id: 'chef_' + Date.now(),
        username: credentials.username.trim(),
        name: credentials.username.trim(),
        title: 'Usta Şef',
        restaurant: 'Mutfak Atölyesi',
        location: 'İstanbul, Türkiye',
        bio: 'Gastronomi ve lezzet tutkunu şef.',
        avatar: '/chef-logo.png',
        isVerified: true,
        isOnline: true,
        friends: ['chef_mehmet'],
        incomingRequests: [],
        outgoingRequests: [],
        stats: { followers: 1, following: 1, dishes: 0 }
      };
      users.unshift(user);
      saveLocalUsers(users);
    }

    localStorage.setItem('ta_chef_user_id', user.id);
    return { user, token: 'mock_token_' + user.id };
  },

  async updateProfile(userId, profileData) {
    if (API_BASE_URL) {
      const netRes = await safeFetchJson(`${API_BASE_URL}/api/users/${userId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      if (netRes.ok) return netRes.data;
    }

    const users = getLocalUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...profileData };
      saveLocalUsers(users);

      // Also update author in existing posts
      const posts = getLocalPosts();
      let postsUpdated = false;
      posts.forEach(p => {
        if (p.userId === userId) {
          p.author = { ...p.author, ...profileData };
          postsUpdated = true;
        }
      });
      if (postsUpdated) saveLocalPosts(posts);

      return { user: users[idx] };
    }
    return { user: profileData };
  },

  async getAllUsers() {
    if (API_BASE_URL) {
      const netRes = await safeFetchJson(`${API_BASE_URL}/api/users`);
      if (netRes.ok && Array.isArray(netRes.data)) return netRes.data;
    }
    return getLocalUsers();
  },

  // 2. Arkadaşlık İstekleri
  async sendFriendRequest(fromUserId, toUserId) {
    if (API_BASE_URL) {
      const netRes = await safeFetchJson(`${API_BASE_URL}/api/friends/request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromUserId, toUserId })
      });
      if (netRes.ok) return netRes.data;
    }

    const users = getLocalUsers();
    const target = users.find(u => u.id === toUserId);
    const sender = users.find(u => u.id === fromUserId);
    if (target && sender) {
      if (!target.incomingRequests) target.incomingRequests = [];
      if (!sender.outgoingRequests) sender.outgoingRequests = [];
      if (!target.incomingRequests.includes(fromUserId)) target.incomingRequests.push(fromUserId);
      if (!sender.outgoingRequests.includes(toUserId)) sender.outgoingRequests.push(toUserId);
      saveLocalUsers(users);
    }
    return { success: true };
  },

  async acceptFriendRequest(userId, requesterId) {
    if (API_BASE_URL) {
      const netRes = await safeFetchJson(`${API_BASE_URL}/api/friends/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, requesterId })
      });
      if (netRes.ok) return netRes.data;
    }

    const users = getLocalUsers();
    const me = users.find(u => u.id === userId);
    const requester = users.find(u => u.id === requesterId);
    if (me && requester) {
      me.incomingRequests = (me.incomingRequests || []).filter(id => id !== requesterId);
      requester.outgoingRequests = (requester.outgoingRequests || []).filter(id => id !== userId);
      if (!me.friends) me.friends = [];
      if (!requester.friends) requester.friends = [];
      if (!me.friends.includes(requesterId)) me.friends.push(requesterId);
      if (!requester.friends.includes(userId)) requester.friends.push(userId);
      saveLocalUsers(users);
    }
    return { success: true };
  },

  async declineFriendRequest(userId, requesterId) {
    if (API_BASE_URL) {
      const netRes = await safeFetchJson(`${API_BASE_URL}/api/friends/decline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, requesterId })
      });
      if (netRes.ok) return netRes.data;
    }

    const users = getLocalUsers();
    const me = users.find(u => u.id === userId);
    if (me) {
      me.incomingRequests = (me.incomingRequests || []).filter(id => id !== requesterId);
      saveLocalUsers(users);
    }
    return { success: true };
  },

  async removeFriend(userId, targetId) {
    if (API_BASE_URL) {
      const netRes = await safeFetchJson(`${API_BASE_URL}/api/friends/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, targetId })
      });
      if (netRes.ok) return netRes.data;
    }

    const users = getLocalUsers();
    const me = users.find(u => u.id === userId);
    const target = users.find(u => u.id === targetId);
    if (me) me.friends = (me.friends || []).filter(id => id !== targetId);
    if (target) target.friends = (target.friends || []).filter(id => id !== userId);
    saveLocalUsers(users);
    return { success: true };
  },

  // 3. Gönderiler (Posts & Feed)
  async getPosts() {
    if (API_BASE_URL) {
      const netRes = await safeFetchJson(`${API_BASE_URL}/api/posts`);
      if (netRes.ok && Array.isArray(netRes.data)) return netRes.data;
    }
    return getLocalPosts();
  },

  async createPost(postData) {
    if (API_BASE_URL) {
      const netRes = await safeFetchJson(`${API_BASE_URL}/api/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      });
      if (netRes.ok) return netRes.data;
    }

    const users = getLocalUsers();
    const author = users.find(u => u.id === postData.userId) || users[0] || DEFAULT_CHEFS[0];

    const newPost = {
      id: 'post_' + Date.now(),
      userId: postData.userId || author.id,
      author,
      title: postData.title,
      caption: postData.caption || '',
      image: postData.image || '/chef-logo.png',
      mediaType: postData.mediaType || 'image',
      location: postData.location || { name: 'Mutfak Atölyesi', city: 'İstanbul', lat: 41.0082, lng: 28.9784 },
      cookTime: postData.cookTime || '30 dk',
      difficulty: postData.difficulty || 'Orta',
      category: postData.category || 'Ana Yemek',
      ingredients: postData.ingredients || [],
      likes: [],
      saves: [],
      comments: [],
      createdAt: new Date().toISOString()
    };

    const posts = getLocalPosts();
    posts.unshift(newPost);
    saveLocalPosts(posts);

    // Update dish count of author
    if (author.stats) author.stats.dishes = (author.stats.dishes || 0) + 1;
    saveLocalUsers(users);

    return newPost;
  },

  async toggleLike(postId, userId) {
    if (API_BASE_URL) {
      const netRes = await safeFetchJson(`${API_BASE_URL}/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (netRes.ok) return netRes.data;
    }

    const posts = getLocalPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      if (!post.likes) post.likes = [];
      const hasLiked = post.likes.includes(userId);
      if (hasLiked) {
        post.likes = post.likes.filter(id => id !== userId);
      } else {
        post.likes.push(userId);
      }
      saveLocalPosts(posts);
      return { likes: post.likes };
    }
    return { likes: [] };
  },

  async addComment(postId, userId, text) {
    if (API_BASE_URL) {
      const netRes = await safeFetchJson(`${API_BASE_URL}/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, text })
      });
      if (netRes.ok) return netRes.data;
    }

    const posts = getLocalPosts();
    const post = posts.find(p => p.id === postId);
    const users = getLocalUsers();
    const author = users.find(u => u.id === userId) || users[0] || DEFAULT_CHEFS[0];

    const comment = {
      id: 'c_' + Date.now(),
      userId,
      userName: author.name,
      userAvatar: author.avatar || '/chef-logo.png',
      text,
      createdAt: new Date().toISOString()
    };

    if (post) {
      if (!post.comments) post.comments = [];
      post.comments.push(comment);
      saveLocalPosts(posts);
    }
    return comment;
  },

  async toggleSave(postId, userId) {
    if (API_BASE_URL) {
      const netRes = await safeFetchJson(`${API_BASE_URL}/api/posts/${postId}/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (netRes.ok) return netRes.data;
    }

    const posts = getLocalPosts();
    const post = posts.find(p => p.id === postId);
    if (post) {
      if (!post.saves) post.saves = [];
      const hasSaved = post.saves.includes(userId);
      if (hasSaved) {
        post.saves = post.saves.filter(id => id !== userId);
      } else {
        post.saves.push(userId);
      }
      saveLocalPosts(posts);
      return { saves: post.saves };
    }
    return { saves: [] };
  },

  // 4. Sohbet & Mesajlar
  async getMessages(currentUserId, otherUserId) {
    if (API_BASE_URL) {
      const netRes = await safeFetchJson(`${API_BASE_URL}/api/messages/${otherUserId}?currentUserId=${currentUserId}`);
      if (netRes.ok && Array.isArray(netRes.data)) return netRes.data;
    }

    try {
      const key = [currentUserId, otherUserId].sort().join('_');
      const raw = localStorage.getItem(`chef_msgs_${key}`);
      if (raw) return JSON.parse(raw);
    } catch (e) { }

    return [
      {
        id: 'msg_welcome',
        fromUserId: otherUserId,
        toUserId: currentUserId,
        text: 'Merhaba şefim! Mutfakta bugün neler hazırlıyorsunuz?',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ];
  },

  async getConversations(currentUserId) {
    if (API_BASE_URL) {
      const netRes = await safeFetchJson(`${API_BASE_URL}/api/conversations/${currentUserId}`);
      if (netRes.ok && Array.isArray(netRes.data)) return netRes.data;
    }

    const users = getLocalUsers().filter(u => u.id !== currentUserId);
    return users.slice(0, 3).map(u => ({
      user: u,
      lastMessage: {
        text: 'Harika bir tabak paylaşımı olmuş şefim!',
        createdAt: new Date().toISOString()
      },
      unreadCount: 0
    }));
  },

  // 5. Bildirimler
  async getNotifications(userId) {
    if (API_BASE_URL) {
      const netRes = await safeFetchJson(`${API_BASE_URL}/api/notifications/${userId}`);
      if (netRes.ok && Array.isArray(netRes.data)) return netRes.data;
    }
    return getLocalNotifications(userId);
  },

  async markNotificationsRead(userId) {
    if (API_BASE_URL) {
      const netRes = await safeFetchJson(`${API_BASE_URL}/api/notifications/${userId}/mark-read`, {
        method: 'POST'
      });
      if (netRes.ok) return netRes.data;
    }

    const notifs = getLocalNotifications(userId).map(n => ({ ...n, read: true }));
    saveLocalNotifications(userId, notifs);
    return { success: true };
  },

  // 6. Medya Yükleme (Fotoğraf & Video Base64 Fallback)
  async uploadMedia(file) {
    if (API_BASE_URL) {
      try {
        const formData = new FormData();
        formData.append('media', file);
        const res = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          body: formData
        });
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          return await res.json();
        }
      } catch (e) {
        console.warn('Remote upload failed, falling back to local Data URL');
      }
    }

    // Local Base64 Data URL Fallback
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const isVid = file.type.startsWith('video/') || ['.mp4', '.mov', '.webm'].some(ext => file.name.toLowerCase().endsWith(ext));
        resolve({
          url: reader.result,
          mediaType: isVid ? 'video' : 'image'
        });
      };
      reader.onerror = () => {
        resolve({ url: '/chef-logo.png', mediaType: 'image' });
      };
      reader.readAsDataURL(file);
    });
  },

  async uploadImage(file) {
    return this.uploadMedia(file);
  }
};
