import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('taste_balance');
    return saved ? parseFloat(saved) : 0;
  });

  const [unlockedLevels, setUnlockedLevels] = useState(() => {
    const saved = localStorage.getItem('taste_unlocked_levels');
    return saved ? parseInt(saved) : 1;
  });

  const [completedLevels, setCompletedLevels] = useState(() => {
    const saved = localStorage.getItem('taste_completed_levels');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('taste_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('taste_unlocked_levels', unlockedLevels.toString());
  }, [unlockedLevels]);

  useEffect(() => {
    localStorage.setItem('taste_completed_levels', JSON.stringify(completedLevels));
  }, [completedLevels]);

  const completeLevel = (levelId) => {
    if (!completedLevels.includes(levelId)) {
      let reward = 0.5;
      
      // Bonus reward for completing all 50 levels
      if (levelId === 50) {
        reward += 25; // 50 * 0.5 + 25 = 50 Taste Total
      }
      
      setBalance(prev => prev + reward);
      setCompletedLevels(prev => [...prev, levelId]);
      
      if (levelId === unlockedLevels && unlockedLevels < 50) {
        setUnlockedLevels(prev => prev + 1);
      }
      return true;
    }
    return false;
  };

  const buyTaste = (amount) => {
    setBalance(prev => prev + amount);
  };

  const withdrawTaste = (amount) => {
    if (balance >= amount) {
      setBalance(prev => prev - amount);
      return true;
    }
    return false;
  };

  return (
    <GameContext.Provider value={{
      balance,
      unlockedLevels,
      completedLevels,
      completeLevel,
      buyTaste,
      withdrawTaste
    }}>
      {children}
    </GameContext.Provider>
  );
};
