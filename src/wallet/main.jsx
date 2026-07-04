import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// ─── GLOBAL CORS & HEADER PATCH (NUCLEAR VERSION) ───────────────────────────
// Bazı kütüphaneler (Axios vb.) fetch yamasını delip geçer. 
// Bu yüzden hem fetch'i hem de ana XMLHttpRequest'i yamalıyoruz.

// 1. Fetch Yaması
const originalFetch = window.fetch;
window.fetch = function(input, init) {
  if (init && init.headers) {
    if (init.headers instanceof Headers) {
      init.headers.delete('x-ton-client-version');
      init.headers.delete('X-Ton-Client-Version');
    } else if (typeof init.headers === 'object') {
      delete init.headers['x-ton-client-version'];
      delete init.headers['X-Ton-Client-Version'];
    }
  }
  return originalFetch(input, init);
};

// 2. XMLHttpRequest Yaması (En Garantisi)
const originalSetHeader = XMLHttpRequest.prototype.setRequestHeader;
XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
  const h = header.toLowerCase();
  if (h === 'x-ton-client-version') {
    // console.log('[PATCH] Blocked header:', header);
    return; 
  }
  return originalSetHeader.apply(this, arguments);
};
// ─────────────────────────────────────────────────────────────────────────────

import ErrorBoundary from './ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
