const { Address } = require('@ton/core');
const { TasteContract } = require('./build/TasteContract/tact_TasteContract');

async function main() {
    const owner = Address.parse('EQBDqObEyc8KYOuHCKm0evBNp0hJ9derp8eSIdhYMjIeMRSZ'); // Example owner
    const jettonWallet = Address.parse('EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-');

    const tasteContract = await TasteContract.fromInit(owner, jettonWallet);

    console.log('====================================');
    console.log('KONTRAKT ADRESIN BURADA KANKA:');
    console.log(tasteContract.address.toString());
    console.log('====================================');
}

main().catch(console.error);
