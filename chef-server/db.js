const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'data', 'db.json');

const INITIAL_DATA = {
  users: [
    {
      id: "chef-kaan",
      username: "cheftaha",
      password: "123",
      name: "Taha Şef (TA CHEF)",
      title: "Executive Master Chef",
      restaurant: "TA Gourmet Restaurant & Lounge",
      location: "İstanbul, Türkiye",
      bio: "Mutfakta sanat ve tutku. Modern Türk mutfağı ve açık ateş gastronomisi.",
      avatar: "/chef-logo.png",
      isVerified: true,
      isOnline: true,
      lastSeen: new Date().toISOString(),
      friends: [],
      friendRequestsSent: [],
      friendRequestsReceived: [],
      createdAt: new Date().toISOString()
    }
  ],
  posts: [],
  messages: [],
  notifications: []
};

function initDB() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2), 'utf-8');
  } else {
    // Mevcut db varsa kullanıcıların array alanlarını sağlama al
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(raw);
      let updated = false;
      if (!data.users) { data.users = INITIAL_DATA.users; updated = true; }
      if (!data.posts) { data.posts = []; updated = true; }
      if (!data.messages) { data.messages = []; updated = true; }
      if (!data.notifications) { data.notifications = []; updated = true; }

      data.users.forEach(u => {
        if (!u.friends) { u.friends = []; updated = true; }
        if (!u.friendRequestsSent) { u.friendRequestsSent = []; updated = true; }
        if (!u.friendRequestsReceived) { u.friendRequestsReceived = []; updated = true; }
        if (typeof u.isVerified === 'undefined') { u.isVerified = true; updated = true; }
      });

      if (updated) {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
      }
    } catch (e) {
      console.error('initDB patch error:', e);
    }
  }
}

function readDB() {
  initDB();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('DB Read error:', err);
    return INITIAL_DATA;
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('DB Write error:', err);
    return false;
  }
}

module.exports = {
  readDB,
  writeDB,
  initDB
};
