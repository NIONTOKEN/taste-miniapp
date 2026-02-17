
import { Address, toNano, beginCell } from '@ton/core';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    // The Jetton Master Address
    const jettonMasterAddress = Address.parse("EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-");

    // The new Metadata URL provided by the user
    // Using the Pinata gateway URL for better reliability than ipfs.io
    const metadataUrl = "https://gateway.pinata.cloud/ipfs/bafkreih664ymsfu3vt7ilqjbnnmh5s7gn3gkhnwim2pbknbl2wfa7vvcke";

    console.log('====================================');
    console.log('Updating Metadata for Jetton Master:');
    console.log(jettonMasterAddress.toString());
    console.log('New Metadata URL:', metadataUrl);
    console.log('====================================');

    // Create the content cell
    // Prefix 0x01 indicates off-chain metadata (URI)
    const contentCell = beginCell()
        .storeUint(0x01, 8)
        .storeStringTail(metadataUrl)
        .endCell();

    // Send the change_content transaction
    // Opcode: 4 (common for change_content in TEP-74 implementations)
    // If this fails, we might need to check the specific contract implementation
    await provider.sender().send({
        to: jettonMasterAddress,
        value: toNano('0.05'),
        body: beginCell()
            .storeUint(4, 32) // Opcode for change_content
            .storeUint(0, 64) // Query ID
            .storeRef(contentCell)
            .endCell(),
    });

    console.log('Transaction sent! Please approve in your wallet.');

    // Wait for a bit (verification is manual usually)
    // await provider.waitForDeploy(jettonMasterAddress); 
    // waitForDeploy might not work for just a tx, but we can wait blindly
}
