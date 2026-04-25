import { mnemonicNew, mnemonicToWalletKey } from '@ton/crypto';
import { WalletContractV4, TonClient, Address, fromNano, toNano, beginCell, internal } from '@ton/ton';
import { getHttpEndpoint } from '@orbs-network/ton-access';

const STORAGE_KEY = 'taste_internal_wallet_mnemonic';
const KASA_ADDRESS = 'UQAzYgt3LoveknM9riA7jpZIbwmNi65c1UUA4AGBwvbr5lnD';
const SERVICE_FEE = '0.05';

export interface InternalWalletInfo {
    address: string;
    mnemonic: string[];
}

class InternalWalletService {
    private client: TonClient | null = null;

    async getClient() {
        if (!this.client) {
            const endpoint = await getHttpEndpoint({ network: 'mainnet' });
            this.client = new TonClient({ endpoint });
        }
        return this.client;
    }

    hasWallet(): boolean {
        return !!localStorage.getItem(STORAGE_KEY);
    }

    async createWallet(): Promise<InternalWalletInfo> {
        const mnemonic = await mnemonicNew();
        localStorage.setItem(STORAGE_KEY, mnemonic.join(' '));
        const info = await this.getWalletInfo();
        if (!info) throw new Error('Cüzdan oluşturulamadı');
        return info;
    }

    async getWalletInfo(): Promise<InternalWalletInfo | null> {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return null;

        const mnemonic = stored.split(' ');
        const key = await mnemonicToWalletKey(mnemonic);
        const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
        
        return {
            address: wallet.address.toString({ bounceable: false }),
            mnemonic
        };
    }

    logout() {
        localStorage.removeItem(STORAGE_KEY);
    }

    async getBalance(address: string): Promise<string> {
        const client = await this.getClient();
        const balance = await client.getBalance(Address.parse(address));
        return fromNano(balance);
    }

    async sendTon(recipient: string, amount: string, memo: string = '') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) throw new Error('Cüzdan bulunamadı');

        const client = await this.getClient();
        const mnemonic = stored.split(' ');
        const key = await mnemonicToWalletKey(mnemonic);
        const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
        
        const contract = client.open(wallet);
        const seqno = await contract.getSeqno();

        let body = undefined;
        if (memo) {
            body = beginCell().storeUint(0, 32).storeStringTail(memo).endCell();
        }

        await contract.sendTransfer({
            secretKey: key.secretKey,
            seqno: seqno,
            messages: [
                internal({
                    to: recipient,
                    value: toNano(amount),
                    bounce: false,
                    body: body
                }),
                internal({
                    to: KASA_ADDRESS,
                    value: toNano(SERVICE_FEE),
                    bounce: false
                })
            ]
        });
    }

    async sendTaste(recipient: string, amount: string, jettonMasterAddress: string, memo: string = '') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) throw new Error('Cüzdan bulunamadı');

        const client = await this.getClient();
        const mnemonic = stored.split(' ');
        const key = await mnemonicToWalletKey(mnemonic);
        const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
        const contract = client.open(wallet);
        
        const userRaw = wallet.address.toRawString();
        const res = await fetch(`https://tonapi.io/v2/accounts/${userRaw}/jettons/${jettonMasterAddress}`);
        const data = await res.json();
        const userJWallet = data?.wallet_address?.address;

        if (!userJWallet) throw new Error('Jetton cüzdanı bulunamadı');

        let forwardPayload = undefined;
        if (memo) {
            forwardPayload = beginCell().storeUint(0, 32).storeStringTail(memo).endCell();
        }

        const bodyBuilder = beginCell()
            .storeUint(0xf8a7ea5, 32)
            .storeUint(0, 64)
            .storeCoins(toNano(amount)) 
            .storeAddress(Address.parse(recipient))
            .storeAddress(wallet.address)
            .storeBit(false)
            .storeCoins(toNano('0.05'))
            .storeBit(!!forwardPayload);
            
        if (forwardPayload) {
            bodyBuilder.storeRef(forwardPayload);
        }
        
        const body = bodyBuilder.endCell();
        const seqno = await contract.getSeqno();

        await contract.sendTransfer({
            secretKey: key.secretKey,
            seqno: seqno,
            messages: [
                internal({
                    to: userJWallet,
                    value: toNano('0.1'), 
                    body: body,
                    bounce: true,
                }),
                internal({
                    to: KASA_ADDRESS,
                    value: toNano(SERVICE_FEE),
                    bounce: false
                })
            ]
        });
    }
}

export const internalWalletService = new InternalWalletService();
