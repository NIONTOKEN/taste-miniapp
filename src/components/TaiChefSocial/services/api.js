export const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_CHEF_API_URL)
  ? import.meta.env.VITE_CHEF_API_URL
  : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000'
    : '');

export const api = {
  // Auth & Kullanıcı
  async register(userData) {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Kayıt başarısız');
    return data;
  },

  async login(credentials) {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Giriş başarısız');
    return data;
  },

  async updateProfile(userId, profileData) {
    const res = await fetch(`${API_BASE_URL}/api/users/${userId}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Profil güncellenemedi');
    return data;
  },

  async getAllUsers() {
    const res = await fetch(`${API_BASE_URL}/api/users`);
    if (!res.ok) throw new Error('Kullanıcılar alınamadı');
    return res.json();
  },

  // Arkadaşlık İstekleri
  async sendFriendRequest(fromUserId, toUserId) {
    const res = await fetch(`${API_BASE_URL}/api/friends/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromUserId, toUserId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'İstek gönderilemedi');
    return data;
  },

  async acceptFriendRequest(userId, requesterId) {
    const res = await fetch(`${API_BASE_URL}/api/friends/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, requesterId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'İstek kabul edilemedi');
    return data;
  },

  async declineFriendRequest(userId, requesterId) {
    const res = await fetch(`${API_BASE_URL}/api/friends/decline`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, requesterId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'İşlem başarısız');
    return data;
  },

  async removeFriend(userId, targetId) {
    const res = await fetch(`${API_BASE_URL}/api/friends/remove`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, targetId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Arkadaşlıktan çıkarılamadı');
    return data;
  },

  // Gönderiler (Posts)
  async getPosts() {
    const res = await fetch(`${API_BASE_URL}/api/posts`);
    if (!res.ok) throw new Error('Gönderiler alınamadı');
    return res.json();
  },

  async createPost(postData) {
    const res = await fetch(`${API_BASE_URL}/api/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Gönderi paylaşılamadı');
    return data;
  },

  async toggleLike(postId, userId) {
    const res = await fetch(`${API_BASE_URL}/api/posts/${postId}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  async addComment(postId, userId, text) {
    const res = await fetch(`${API_BASE_URL}/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, text })
    });
    return res.json();
  },

  async toggleSave(postId, userId) {
    const res = await fetch(`${API_BASE_URL}/api/posts/${postId}/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  // Mesajlar & Sohbet
  async getMessages(currentUserId, otherUserId) {
    const res = await fetch(`${API_BASE_URL}/api/messages/${otherUserId}?currentUserId=${currentUserId}`);
    return res.json();
  },

  async getConversations(currentUserId) {
    const res = await fetch(`${API_BASE_URL}/api/conversations/${currentUserId}`);
    return res.json();
  },

  // Bildirimler
  async getNotifications(userId) {
    const res = await fetch(`${API_BASE_URL}/api/notifications/${userId}`);
    return res.json();
  },

  async markNotificationsRead(userId) {
    const res = await fetch(`${API_BASE_URL}/api/notifications/${userId}/mark-read`, {
      method: 'POST'
    });
    return res.json();
  },

  // Medya Yükleme (Hem Fotoğraf Hem Video - 100MB'a kadar)
  async uploadMedia(file) {
    const formData = new FormData();
    formData.append('media', file);

    const res = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Medya dosyası yüklenemedi');
    return res.json();
  },

  async uploadImage(file) {
    return this.uploadMedia(file);
  }
};
