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
    usdValue?: string;
    usdPrice?: number;
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
        try {
            const info = await internalWalletService.getWalletInfo();
            if (info) setInternalWallet(info);
        } catch (err) {
            console.error('[WalletContext] Internal wallet load error:', err);
            try { localStorage.removeItem('taste_internal_wallet_mnemonic'); } catch {}
        }
    };

    useEffect(() => {
        if (externalAddress) {
            setWalletType('external');
        }
    }, [externalAddress]);

    useEffect(() => {
        loadInternal();
    }, []);

    const createInternalWallet = async () => {
        try {
            const info = await internalWalletService.createWallet();
            setInternalWallet(info);
            setWalletType('internal');
            return info;
        } catch (err) {
            console.error('[WalletContext] Create wallet error:', err);
            throw err;
        }
    };

    const logoutInternal = () => {
        internalWalletService.logout();
        setInternalWallet(null);
        setWalletType('external');
    };

    const importWallet = async (mnemonicPhrase: string) => {
        try {
            const info = await internalWalletService.importWallet(mnemonicPhrase);
            setInternalWallet(info);
            setWalletType('internal');
            return info;
        } catch (err) {
            console.error('[WalletContext] Import wallet error:', err);
            throw err;
        }
    };

    const refreshBalances = useCallback(async () => {
        if (!activeAddress) return;
        setIsLoading(true);
        try {
            // 1. Fetch live TON balance via TonAPI (with fallback to RPC)
            let tonBalStr = '0.00';
            try {
                const accRes = await fetch(`https://tonapi.io/v2/accounts/${encodeURIComponent(activeAddress)}`);
                if (accRes.ok) {
                    const accData = await accRes.json();
                    if (accData.balance !== undefined) {
                        tonBalStr = (parseFloat(accData.balance) / 1e9).toFixed(4);
                    }
                }
            } catch {
                try {
                    tonBalStr = await internalWalletService.getBalance(activeAddress);
                } catch {}
            }

            // 2. Fetch all real Jettons for this account via TonAPI
            const res = await fetch(`https://tonapi.io/v2/accounts/${encodeURIComponent(activeAddress)}/jettons?currencies=usd`);
            let jettonList: JettonInfo[] = [];
            let tasteBal = '0';

            if (res.ok) {
                const data = await res.json();
                jettonList = (data.balances || []).map((jb: any) => {
                    const dec = jb.jetton?.decimals || 9;
                    const rawBal = parseFloat(jb.balance || '0') / Math.pow(10, dec);
                    const usdP = jb.price?.prices?.USD ? parseFloat(jb.price.prices.USD) : 0;
                    return {
                        symbol: jb.jetton?.symbol || 'TOKEN',
                        name: jb.jetton?.name || jb.jetton?.symbol || 'Unknown Token',
                        address: jb.jetton?.address || '',
                        image: jb.jetton?.image || '',
                        decimals: dec,
                        balance: rawBal < 0.01 && rawBal > 0 ? rawBal.toFixed(4) : rawBal.toFixed(2),
                        usdValue: (rawBal * usdP).toFixed(2),
                        usdPrice: usdP
                    };
                });

                const tasteJetton = jettonList.find(j => 
                    j.symbol === 'TASTE' || 
                    j.symbol === 'TAI' || 
                    j.address === 'EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-'
                );
                if (tasteJetton) {
                    tasteBal = tasteJetton.balance;
                }
            }
            
            setBalances({
                ton: tonBalStr,
                taste: tasteBal,
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
