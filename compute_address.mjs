import { Address } from '@ton/core';
import { TasteContract } from './wrappers/TasteContract.ts';

async function main() {
    const owner = Address.parse('UQB7zxR3WWsvlUnFVzY6rnTpBeLScnEReaeLQ7gI53mRbvHC');
    const jettonWallet = Address.parse('EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-');
    const publicKey = BigInt("0xafb15ea372dd7a08d0faf041a0a356454bccbaf4f1eea6160286e1e467b6e2f6");

    const contract = await TasteContract.fromInit(owner, jettonWallet, publicKey);

    console.log('====================================');
    console.log('TasteContract Address (bounceable):', contract.address.toString());
    console.log('TasteContract Address (non-bounceable):', contract.address.toString({ bounceable: false }));
    console.log('TasteContract Address (raw):', contract.address.toRawString());
    console.log('====================================');
}

main().catch(console.error);
