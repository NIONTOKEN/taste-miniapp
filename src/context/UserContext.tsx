import React, { createContext, useContext, useState, useEffect } from 'react';
import { backend, UserData } from '../services/backend';

interface UserContextType {
    balance: number;
    streak: number;
    xp: number;
    rank: number;
    energy: number;
    referrals: number;
    addBalance: (amount: number) => void;
    resetBalance: () => void;
    updateStreak: (newStreak: number) => void;
    addXP: (amount: number) => void;
    useEnergy: (amount: number) => boolean;
    loadUser: (wallet: string) => Promise<void>;
    tasksCompleted: string[];
    setTasksCompleted: (tasks: string[]) => void;
    unlockedLevels: number;
    completedLevels: number[];
    completeLevel: (levelId: number) => boolean;
    lastClaim: number | null;
    refillEnergy: () => void;
    doubleReward: (originalAmount: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [wallet, setWallet] = useState<string | null>(null);
    const [balance, setBalance] = useState<number>(0);
    const [streak, setStreak] = useState<number>(0);
    const [xp, setXp] = useState<number>(0);
    const [referrals, setReferrals] = useState<number>(0);
    const [energy, setEnergy] = useState<number>(100);
    const [lastClaim, setLastClaim] = useState<number | null>(null);
    const [tasksCompleted, setTasksCompleted] = useState<string[]>([]);
    const [unlockedLevels, setUnlockedLevels] = useState<number>(1);
    const [completedLevels, setCompletedLevels] = useState<number[]>([]);

    const rank = Math.floor(xp / 1000) + 1;

    // Load guest data initially
    useEffect(() => {
        const init = async () => {
            const data = await backend.getUserData('guest');
            setBalance(data.balance);
            setStreak(data.streak);
            setXp(data.xp);
            setLastClaim(data.lastClaim);
            setReferrals(data.referrals || 0);
            setTasksCompleted(data.tasksCompleted || []);
            setUnlockedLevels(data.unlockedLevels || 1);
            setCompletedLevels(data.completedLevels || []);
        };
        init();
    }, []);

    // Load user data when wallet is connected
    const loadUser = async (walletAddress: string) => {
        setWallet(walletAddress);
        const data = await backend.getUserData(walletAddress);

        if (data.xp === 0 && xp > 0) {
            console.log('Misafir verileri cüzdana aktarılıyor...');
            return;
        }

        setBalance(data.balance);
        setStreak(data.streak);
        setXp(data.xp);
        setLastClaim(data.lastClaim);
        setReferrals(data.referrals || 0);
        setTasksCompleted(data.tasksCompleted || []);
        setUnlockedLevels(data.unlockedLevels || 1);
        setCompletedLevels(data.completedLevels || []);
    };

    // Auto-save when details change
    useEffect(() => {
        const key = wallet || 'guest';
        backend.saveUserData({
            wallet: key,
            balance,
            streak,
            xp,
            lastClaim,
            referrals,
            tasksCompleted,
            unlockedLevels,
            completedLevels
        });
    }, [balance, streak, xp, lastClaim, referrals, tasksCompleted, wallet, unlockedLevels, completedLevels]);

    // Energy regeneration
    useEffect(() => {
        const interval = setInterval(() => {
            setEnergy(prev => Math.min(prev + 1, 100));
        }, 60000);
        return () => clearInterval(interval);
    }, []);

    const addBalance = (amount: number) => {
        setBalance(prev => parseFloat((prev + amount).toFixed(2)));
    };

    const resetBalance = () => {
        setBalance(0);
    };

    const updateStreak = (newStreak: number) => {
        setStreak(newStreak);
        setLastClaim(Date.now());
    };

    const addXP = (amount: number) => {
        setXp(prev => prev + amount);
    };

    const useEnergy = (amount: number): boolean => {
        if (energy >= amount) {
            setEnergy(prev => prev - amount);
            return true;
        }
        return false;
    };

    const refillEnergy = () => {
        setEnergy(100);
    };

    const doubleReward = (originalAmount: number) => {
        setBalance(prev => parseFloat((prev + originalAmount).toFixed(2)));
    };

    const completeLevel = (levelId: number): boolean => {
        if (!completedLevels.includes(levelId)) {
            let reward = 0.05;
            if (levelId === 50) reward += 2.5;

            addBalance(reward);
            setCompletedLevels(prev => [...prev, levelId]);

            if (levelId === unlockedLevels && unlockedLevels < 50) {
                setUnlockedLevels(prev => prev + 1);
            }
            return true;
        }
        return false;
    };

    return (
        <UserContext.Provider value={{
            balance, streak, xp, rank, energy, referrals,
            addBalance, resetBalance, updateStreak,
            addXP, useEnergy,
            loadUser,
            tasksCompleted, setTasksCompleted,
            unlockedLevels, completedLevels, completeLevel,
            lastClaim,
            refillEnergy, doubleReward
        }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
