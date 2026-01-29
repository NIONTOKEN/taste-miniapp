import React, { createContext, useContext, useState, useEffect } from 'react';
import { Address, beginCell, toNano } from '@ton/core';
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
    handleWithdraw: (tonConnectUI: any, t: any) => Promise<void>;
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

const TASTE_CONTRACT_ADDRESS = 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-';

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

        // Kanka, eğer cüzdanda hiç veri yoksa (yeni bağlandıysa),
        // mevcut guest verilerini koru ve cüzdana aktar.
        if (data.xp === 0 && xp > 0) {
            console.log('Misafir verileri cüzdana aktarılıyor...');
            // Hiçbir şey yapma, mevcut state (balance, xp vs.) zaten guest verisiyle dolu.
            // useEffect otomatik olarak bu verileri yeni cüzdan adresiyle kaydedecek.
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
            if (levelId === 50) reward += 2.5; // Milestone bonus

            addBalance(reward);
            setCompletedLevels(prev => [...prev, levelId]);

            if (levelId === unlockedLevels && unlockedLevels < 50) {
                setUnlockedLevels(prev => prev + 1);
            }
            return true;
        }
        return false;
    };

    const handleWithdraw = async (tonConnectUI: any, t: any) => {
        if (balance < 5) return;

        // Cap withdrawal at 10
        const withdrawAmount = Math.min(balance, 10);

        if (!tonConnectUI.account?.address) {
            alert(t('app.connect_wallet_first') || 'Please connect your wallet first');
            return;
        }

        try {
            // Get Backend Authorization (Signature)
            const signatureStr = await backend.getWithdrawalSignature(tonConnectUI.account.address, balance);

            // @ts-ignore
            const signature = Buffer.from(signatureStr, 'hex');

            const payload = beginCell()
                .storeUint(1348123249, 32) // op::withdraw
                .storeCoins(toNano(balance.toString()))
                .storeSlice(beginCell().storeBuffer(signature).endCell().beginParse())
                .endCell();

            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 60,
                messages: [
                    {
                        address: TASTE_CONTRACT_ADDRESS,
                        amount: toNano('0.05').toString(),
                        payload: payload.toBoc().toString('base64')
                    }
                ]
            };

            await tonConnectUI.sendTransaction(transaction);
            resetBalance();
            alert(t('rewards.withdraw_success'));
        } catch (e) {
            console.error('Withdrawal failed', e);
            alert('Transaction failed or cancelled');
        }
    };

    return (
        <UserContext.Provider value={{
            balance, streak, xp, rank, energy, referrals,
            addBalance, resetBalance, updateStreak,
            addXP, useEnergy,
            handleWithdraw, loadUser,
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
