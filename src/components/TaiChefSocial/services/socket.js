import { io } from 'socket.io-client';

let socket = null;

export const initSocket = (userId) => {
  if (!socket) {
    const socketUrl = (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_CHEF_SOCKET_URL || import.meta.env.VITE_CHEF_API_URL))
      ? (import.meta.env.VITE_CHEF_SOCKET_URL || import.meta.env.VITE_CHEF_API_URL)
      : (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:5000'
        : (typeof window !== 'undefined' ? window.location.origin : ''));

    socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      timeout: 10000
    });

    socket.on('connect', () => {
      console.log('⚡ Socket.io sunucusuna bağlandı:', socket.id);
      if (userId) {
        socket.emit('user_connected', userId);
      }
    });

    socket.on('disconnect', () => {
      console.log('🔌 Socket bağlantısı kesildi');
    });
  } else if (userId) {
    socket.emit('user_connected', userId);
  }

  return socket;
};

export const getSocket = () => {
  return socket;
};
