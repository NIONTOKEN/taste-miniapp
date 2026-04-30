import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { internalWalletService, InternalWalletInfo } from '../services/internalWallet';

interface JettonInfo {
    symbol: string;
    balance: string;
    address: string;
    name: string;
    image?: string;
    decimals: number;
}

interface WalletContextType {
    walletType: 'external' | 'internal';
    setWalletType: (type: 'external' | 'internal') => void;
    activeAddress: string | null;
    balances: {
        ton: string;
        taste: string;
        jettons: JettonInfo[];
    };
    refreshBalances: () => Promise<void>;
    isLoading: boolean;
    // Eksik fonksiyonlar eklendi
    createInternalWallet: () => Promise<InternalWalletInfo>;
    importWallet: (mnemonic: string) => Promise<InternalWalletInfo>;
    logoutInternal: () => void;
    internalWallet: InternalWalletInfo | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [walletType, setWalletType] = useState<'external' | 'internal'>(() => {
        return (localStorage.getItem('taste_wallet_type') as any) || 'external';
    });

    const [balances, setBalances] = useState<WalletContextType['balances']>({ 
        ton: '0.00', 
        taste: '0',
        jettons: []
    });
    
    const [isLoading, setIsLoading] = useState(false);
    const [internalWallet, setInternalWallet] = useState<InternalWalletInfo | null>(null);
    const externalAddress = useTonAddress();

    const activeAddress = walletType === 'internal' ? (internalWallet?.address || null) : (externalAddress || null);

    useEffect(() => {
        localStorage.setItem('taste_wallet_type', walletType);
    }, [walletType]);

    const loadInternal = async () => {
        const info = await internalWalletService.getWalletInfo();
        if (info) setInternalWallet(info);
    };

    useEffect(() => {
        loadInternal();
    }, []);

    const createInternalWallet = async () => {
        const info = await internalWalletService.createWallet();
        setInternalWallet(info);
        setWalletType('internal');
        return info;
    };

    const logoutInternal = () => {
        internalWalletService.logout();
        setInternalWallet(null);
        setWalletType('external');
    };

    const importWallet = async (mnemonicPhrase: string) => {
        const info = await internalWalletService.importWallet(mnemonicPhrase);
        setInternalWallet(info);
        setWalletType('internal');
        return info;
    };

    const refreshBalances = useCallback(async () => {
        if (!activeAddress) return;
        setIsLoading(true);
        try {
            const tonBal = await internalWalletService.getBalance(activeAddress);
            const res = await fetch(`https://tonapi.io/v2/accounts/${activeAddress}/jettons?currencies=usd`);
            const data = await res.json();
            
            const jettonList: JettonInfo[] = (data.balances || []).map((jb: any) => ({
                symbol: jb.jetton.symbol,
                name: jb.jetton.name,
                address: jb.jetton.address,
                image: jb.jetton.image,
                decimals: jb.jetton.decimals,
                balance: (parseFloat(jb.balance) / Math.pow(10, jb.jetton.decimals)).toFixed(2)
            }));

            const tasteJetton = jettonList.find(j => j.symbol === 'TASTE' || j.address === 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-');
            
            setBalances({
                ton: parseFloat(tonBal).toFixed(2),
                taste: tasteJetton ? tasteJetton.balance : '0',
                jettons: jettonList
            });
        } catch (error) {
            console.error('[WalletContext] Bakiye güncelleme hatası:', error);
        } finally {
            setIsLoading(false);
        }
    }, [activeAddress]);

    useEffect(() => {
        refreshBalances();
        const timer = setInterval(refreshBalances, 30000);
        return () => clearInterval(timer);
    }, [refreshBalances]);

    return (
        <WalletContext.Provider value={{ 
            walletType, 
            setWalletType, 
            activeAddress, 
            balances, 
            refreshBalances,
            isLoading,
            createInternalWallet,
            importWallet,
            logoutInternal,
            internalWallet
        }}>
            {children}
        </WalletContext.Provider>
    );
};

export const useWallet = () => {
    const context = useContext(WalletContext);
    if (!context) throw new Error('useWallet must be used within a WalletProvider');
    return context;
};
