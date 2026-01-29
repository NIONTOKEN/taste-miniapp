import React from 'react';
import { useGame } from '../context/GameContext';

const Header = () => {
  const { balance } = useGame();

  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img src="/logo.jpg" alt="Taste Logo" className="w-10 h-10 rounded-full shadow-sm" />
        <span className="font-bold text-lg text-gray-800">TASTE Oyunu</span>
      </div>
      <div className="bg-taste-gold/10 px-3 py-1.5 rounded-full border border-taste-gold/20 flex items-center gap-2">
        <img src="/logo.jpg" alt="Token" className="w-5 h-5 rounded-full" />
        <span className="font-bold text-taste-gold">{balance.toFixed(2)}</span>
      </div>
    </header>
  );
};

export default Header;
