import { Address } from '@ton/core';

async function main() {
    const addrStr = 'UQDxmQflBkBRBDVWCpBiEUueRM2qNDo6TmMm23Yoc2pAxMoX';
    try {
        const addr = Address.parse(addrStr);
        console.log('Address:', addr.toString());
        console.log('Workchain:', addr.workChain);
        console.log('Raw:', addr.toRawString());

        // Compare with known addresses
        const currentContract = Address.parse('EQBLFKDeuiAtK26wKrq-PVOy4RroGPTJ254gPCoMrjlBFUjo');
        console.log('Matches Current Contract?', addr.equals(currentContract));

        const owner = Address.parse('UQB7zxR3WWsvlUnFVzY6rnTpBeLScnEReaeLQ7gI53mRbvHC');
        console.log('Matches Owner?', addr.equals(owner));

    } catch (e) {
        console.error('Invalid address:', e);
    }
}

main();
