import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ChefHat, Utensils, Flame, CheckCircle } from 'lucide-react';

const CookingGame = ({ level, onBack }) => {
  const { completeLevel } = useGame();
  const [step, setStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [progress, setProgress] = useState(0);

  const dishes = [
    "Basit Makarna", "Şefin Salatası", "Izgara Somon", "Domates Çorbası", "Dana Pirzola",
    "Tavuk Köri", "Sushi Rulosu", "Pizza Margherita", "Mantarlı Risotto", "Tako"
  ];
  
  const dishName = dishes[(level - 1) % dishes.length];

  const cookingSteps = [
    { icon: <ChefHat />, label: "Malzemeleri Hazırla" },
    { icon: <Utensils />, label: "Doğrama ve Karıştırma" },
    { icon: <Flame />, label: "Pişirme İşlemi" },
    { icon: <CheckCircle />, label: "Servis Tabağı" }
  ];

  const handleNextStep = () => {
    if (step < cookingSteps.length - 1) {
      setStep(prev => prev + 1);
      setProgress(((step + 1) / cookingSteps.length) * 100);
    } else {
      setIsFinished(true);
      setProgress(100);
      completeLevel(level);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center min-h-[400px]">
      <div className="w-full flex justify-between items-center mb-6">
        <button onClick={onBack} className="text-gray-500 font-medium">← Geri</button>
        <div className="text-center">
          <h2 className="text-xl font-bold">Bölüm {level}</h2>
          <p className="text-sm text-gray-500">{dishName}</p>
        </div>
        <div className="w-10"></div>
      </div>

      {!isFinished ? (
        <div className="w-full flex flex-col items-center">
          <div className="bg-taste-gold/10 p-8 rounded-full mb-8 animate-pulse">
            <div className="text-taste-gold scale-[2]">
                {cookingSteps[step].icon}
            </div>
          </div>
          
          <h3 className="text-lg font-semibold mb-2">{cookingSteps[step].label}</h3>
          
          <div className="w-full bg-gray-100 h-2 rounded-full mb-8 overflow-hidden">
            <div 
              className="bg-taste-gold h-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <button 
            onClick={handleNextStep}
            className="w-full btn-primary py-4 text-lg shadow-md"
          >
            {step === cookingSteps.length - 1 ? 'Servis Et' : 'Sıradaki Adım'}
          </button>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center text-center">
            <div className="bg-green-100 p-8 rounded-full mb-6">
                <CheckCircle size={64} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Harika!</h2>
            <p className="text-gray-600 mb-8">{dishName} başarıyla hazırlandı.</p>
            
            <div className="bg-taste-gold/10 border border-taste-gold/20 p-4 rounded-xl mb-8 w-full">
                <p className="text-sm text-gray-500 uppercase font-bold mb-1">ÖDÜL</p>
                <p className="text-3xl font-black text-taste-gold">+{level === 50 ? '25.50' : '0.50'} TASTE</p>
            </div>

            <button 
                onClick={onBack}
                className="w-full btn-primary py-4 text-lg shadow-md"
            >
                Haritaya Dön
            </button>
        </div>
      )}
    </div>
  );
};

export default CookingGame;
