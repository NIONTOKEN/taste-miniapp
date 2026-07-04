import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary Caught:", error, errorInfo);
  }

  handleSoftReset = () => {
    // Cüzdanı silmeden sadece UI'ı yenile
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleHardReset = () => {
    localStorage.removeItem('qai_wallet');
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const errMsg = this.state.error?.message || this.state.error?.toString() || 'Bilinmeyen hata';
      return (
        <div style={{
          background: 'linear-gradient(135deg, #09090b, #18080f)',
          color: '#fff',
          padding: '32px 24px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          gap: '16px',
        }}>
          <div style={{ fontSize: '3rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '900', color: '#f87171', margin: 0 }}>
            Bir şeyler ters gitti
          </h2>
          <p style={{ color: '#71717a', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
            {errMsg}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '300px', marginTop: '16px' }}>
            <button
              onClick={this.handleSoftReset}
              style={{
                padding: '14px',
                background: 'rgba(99,102,241,0.15)',
                color: '#a5b4fc',
                border: '1px solid rgba(99,102,241,0.3)',
                borderRadius: '16px',
                fontWeight: '900',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              🔄 Yeniden Dene
            </button>
            <button
              onClick={this.handleHardReset}
              style={{
                padding: '14px',
                background: 'rgba(239,68,68,0.1)',
                color: '#f87171',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: '16px',
                fontWeight: '900',
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              🗑️ Cüzdanı Sıfırla (Seed Phrase Gerekli)
            </button>
          </div>

          <details style={{ marginTop: '12px', width: '100%', maxWidth: '340px' }}>
            <summary style={{ cursor: 'pointer', color: '#52525b', fontSize: '0.72rem' }}>
              Teknik Detaylar
            </summary>
            <pre style={{ color: '#52525b', fontSize: '0.65rem', textAlign: 'left', overflowX: 'auto', marginTop: '8px', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
              {this.state.errorInfo?.componentStack}
            </pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
