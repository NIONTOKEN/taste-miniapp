import React from 'react';
import { useGame } from '../context/GameContext';
import { CreditCard, ArrowUpRight, ArrowDownLeft, History } from 'lucide-react';

const Wallet = () => {
  const { balance, buyTaste, withdrawTaste } = useGame();

  const handleBuy = () => {
    buyTaste(10);
    alert('Simüle Satın Alım: Cüzdanınıza 10 TASTE eklendi.');
  };

  const handleWithdraw = () => {
    if (balance >= 5) {
      withdrawTaste(5);
      alert('Simüle Çekim: 5 TASTE cüzdanınıza gönderildi.');
    } else {
      alert('Yetersiz bakiye. Minimum çekim tutarı 5 TASTE.');
    }
  };

  return (
    <div className="p-4">
      <div className="bg-gradient-to-br from-taste-gold to-yellow-600 rounded-3xl p-6 text-white shadow-xl mb-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <img src="/logo.jpg" alt="Logo" className="w-32 h-32 rounded-full" />
        </div>
        <p className="text-white/80 text-sm font-medium mb-1">Toplam Bakiye</p>
        <div className="flex items-center gap-2 mb-8">
            <span className="text-4xl font-black">{balance.toFixed(2)}</span>
            <span className="text-xl font-bold opacity-80 uppercase">Taste</span>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={handleBuy}
                className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 rounded-2xl flex flex-col items-center gap-1 transition-colors"
            >
                <ArrowDownLeft size={20} />
                <span className="text-xs font-bold uppercase">SATIN AL</span>
            </button>
            <button 
                onClick={handleWithdraw}
                className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 rounded-2xl flex flex-col items-center gap-1 transition-colors"
            >
                <ArrowUpRight size={20} />
                <span className="text-xs font-bold uppercase">PARA ÇEK</span>
            </button>
        </div>
      </div>

      <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-800">
        <History size={20} className="text-gray-400" />
        İşlem Geçmişi
      </h3>
      
      <div className="space-y-3">
        <div className="taste-card flex justify-between items-center py-3">
            <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg text-green-600">
                    <ArrowDownLeft size={20} />
                </div>
                <div>
                    <p className="font-bold text-sm">Ödül</p>
                    <p className="text-[10px] text-gray-400 uppercase">Bölüm Tamamlama</p>
                </div>
            </div>
            <span className="font-bold text-green-600">+0.50</span>
        </div>
        <div className="taste-card flex justify-between items-center py-3 opacity-50">
            <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-lg text-gray-400">
                    <CreditCard size={20} />
                </div>
                <div>
                    <p className="font-bold text-sm">Ön Satış</p>
                    <p className="text-[10px] text-gray-400 uppercase">Yakında Aktif</p>
                </div>
            </div>
            <span className="font-bold text-gray-400">---</span>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
