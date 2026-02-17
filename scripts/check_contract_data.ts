import { Address, TonClient } from '@ton/ton';
import { TasteContract } from '../wrappers/TasteContract';

async function main() {
    // Kullanıcının verdiği adres (UQ formatını EQ'ya çevirip kullanırız veya direkt parse ederiz)
    const targetAddress = Address.parse('UQDxmQflBkBRBDVWCpBiEUueRM2qNDo6TmMm23Yoc2pAxMoX');

    console.log('--- KONTRAT ANALİZİ ---');
    console.log('Hedef Adres:', targetAddress.toString());

    // Mainnet Client
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: 'f20ffed690ea391532d968832a8291f9b3780325d7c92762a4d04845564c760c' // Public API Key
    });

    try {
        // Kontratın state'ini kontrol et
        const state = await client.getContractState(targetAddress);
        console.log('Durum:', state.state);
        console.log('Bakiye:', state.balance.toString());

        if (state.state !== 'active') {
            console.log('❌ Bu kontrat aktif değil veya hiç deploy edilmemiş!');
            return;
        }

        // Wrapper ile bağlanıp veri okumayı dene
        const contract = client.open(TasteContract.fromAddress(targetAddress));

        console.log('Veriler okunuyor...');
        try {
            const owner = await contract.getOwner();
            console.log('✅ Owner:', owner.toString());

            const jettonWallet = await contract.getJettonWallet();
            console.log('✅ Jetton Wallet:', jettonWallet.toString());

            // Bizim owner adresimizle kıyasla
            const myAddress = Address.parse('UQB7zxR3WWsvlUnFVzY6rnTpBeLScnEReaeLQ7gI53mRbvHC');
            if (owner.equals(myAddress)) {
                console.log('🎉 BU KONTRAT BİZİM! Sahibi sensin.');
            } else {
                console.log('⚠️ Bu kontratın sahibi farklı biri!');
            }

        } catch (e) {
            console.log('❌ Veri okunamadı. Muhtemelen farklı bir kod yapısı veya ABI uyumsuzluğu.', e);
        }

    } catch (e) {
        console.error('Hata oluştu:', e);
    }
}

main();
