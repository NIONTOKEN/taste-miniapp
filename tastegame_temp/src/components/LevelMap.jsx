import React from 'react';
import { useGame } from '../context/GameContext';
import { Lock, CheckCircle2 } from 'lucide-react';

const LevelMap = ({ onSelectLevel }) => {
  const { unlockedLevels, completedLevels } = useGame();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 px-2 text-gray-800">Bölümler</h2>
      <div className="grid grid-cols-5 gap-3">
        {Array.from({ length: 50 }, (_, i) => i + 1).map((level) => {
          const isUnlocked = level <= unlockedLevels;
          const isCompleted = completedLevels.includes(level);
          
          return (
            <button
              key={level}
              onClick={() => isUnlocked && onSelectLevel(level)}
              disabled={!isUnlocked}
              className={`
                aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all active:scale-90
                ${isCompleted ? 'bg-green-100 border-green-200 text-green-700' : 
                  isUnlocked ? 'bg-taste-gold/10 border-taste-gold/30 text-taste-gold shadow-sm' : 
                  'bg-gray-50 border-gray-100 text-gray-300'}
                border-2
              `}
            >
              <span className="font-bold text-lg">{level}</span>
              <div className="absolute -top-1 -right-1">
                {isCompleted ? (
                  <CheckCircle2 size={16} className="text-green-500 fill-white" />
                ) : !isUnlocked ? (
                  <Lock size={14} className="text-gray-400" />
                ) : null}
              </div>
              {isUnlocked && !isCompleted && level === unlockedLevels && (
                 <div className="absolute -bottom-1 w-full flex justify-center">
                    <span className="bg-taste-gold text-[8px] text-white px-1 rounded uppercase font-bold">SIRADAKİ</span>
                 </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default LevelMap;
