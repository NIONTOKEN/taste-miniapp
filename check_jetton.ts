
import { Address, TonClient } from "@ton/ton";

async function main() {
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });

    const jettonMasterAddress = Address.parse("EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-");

    console.log("Checking Jetton Master:", jettonMasterAddress.toString());

    try {
        const result = await client.runMethod(jettonMasterAddress, 'get_jetton_data');
        console.log("get_jetton_data success!");
        const stack = result.stack;
        const totalSupply = stack.readBigNumber();
        const mintable = stack.readBigNumber();
        const admin = stack.readAddress();
        console.log("Total Supply:", totalSupply.toString());
        console.log("Mintable:", mintable.toString());
        console.log("Admin Address:", admin.toString());
    } catch (e: any) {
        console.error("get_jetton_data FAILED:", e.message);
    }

    const testWallet = Address.parse("UQBQiZVPYK_NZLZp_4orkmZNXYJpx28Y9CqRcpxo66kSoSCn");
    try {
        const result = await client.runMethod(jettonMasterAddress, 'get_wallet_address', [
            { type: 'slice', cell: Buffer.from([0x01, 0x01, ...testWallet.hash]).toString('base64') } // This is a mock slice, better use a proper Cell
        ]);
        console.log("get_wallet_address success!");
    } catch (e: any) {
        // Mock call might fail due to stack input formatting, but let's see
        console.error("get_wallet_address test failed (might be input format):", e.message);
    }
}

main();
