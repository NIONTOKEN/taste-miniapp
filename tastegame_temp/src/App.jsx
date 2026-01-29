import React, { useState } from 'react';
import Header from './components/Header';
import LevelMap from './components/LevelMap';
import CookingGame from './components/CookingGame';
import Wallet from './components/Wallet';
import { Gamepad2, Wallet as WalletIcon, ShoppingBag } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('game');
  const [selectedLevel, setSelectedLevel] = useState(null);

  const renderContent = () => {
    if (selectedLevel) {
      return (
        <CookingGame 
          level={selectedLevel} 
          onBack={() => setSelectedLevel(null)} 
        />
      );
    }

    switch (activeTab) {
      case 'game':
        return <LevelMap onSelectLevel={(lvl) => setSelectedLevel(lvl)} />;
      case 'wallet':
        return <Wallet />;
      case 'shop':
        return (
          <div className="p-8 text-center text-gray-500">
            <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Taste Market</h2>
            <p>Çok yakında! Özel mutfak gereçleri ve malzemeler satın alabileceksiniz.</p>
          </div>
        );
      default:
        return <LevelMap onSelectLevel={(lvl) => setSelectedLevel(lvl)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-md mx-auto shadow-2xl relative">
      <Header />
      
      <main>
        {renderContent()}
      </main>

      {!selectedLevel && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 flex justify-around p-3 pb-6">
          <button 
            onClick={() => setActiveTab('game')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'game' ? 'text-taste-gold' : 'text-gray-400'}`}
          >
            <Gamepad2 size={24} />
            <span className="text-[10px] font-bold uppercase">OYNA</span>
          </button>
          <button 
            onClick={() => setActiveTab('wallet')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'wallet' ? 'text-taste-gold' : 'text-gray-400'}`}
          >
            <WalletIcon size={24} />
            <span className="text-[10px] font-bold uppercase">CÜZDAN</span>
          </button>
          <button 
            onClick={() => setActiveTab('shop')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'shop' ? 'text-taste-gold' : 'text-gray-400'}`}
          >
            <ShoppingBag size={24} />
            <span className="text-[10px] font-bold uppercase">MARKET</span>
          </button>
        </nav>
      )}
    </div>
  );
}

export default App;
