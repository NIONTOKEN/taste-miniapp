import { Address, toNano } from '@ton/core';
import { TasteContract } from '../wrappers/TasteContract';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const owner = Address.parse('UQB7zxR3WWsvlUnFVzY6rnTpBeLScnEReaeLQ7gI53mRbvHC');
    const jettonWallet = Address.parse('EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-');

    // Kanka, ürettiğin Public Key'i buraya koydum:
    const publicKey = BigInt("0xafb15ea372dd7a08d0faf041a0a356454bccbaf4f1eea6160286e1e467b6e2f6");

    const tasteContract = provider.open(await TasteContract.fromInit(owner, jettonWallet, publicKey));

    console.log('====================================');
    console.log('KONTRAKT ADRESIN BURADA KANKA:');
    console.log(tasteContract.address.toString());
    console.log('====================================');

    await tasteContract.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: BigInt(0),
        }
    );

    await provider.waitForDeploy(tasteContract.address);
}
