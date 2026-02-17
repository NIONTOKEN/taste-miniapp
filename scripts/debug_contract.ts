
import { Address, TonClient } from "@ton/ton";

async function main() {
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });

    const targetAddressStr = "EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-";
    const targetAddress = Address.parse(targetAddressStr);

    console.log("Checking Target Address:", targetAddress.toString());

    // 1. Try get_jetton_data (Check if it's a Jetton Master)
    try {
        console.log("Attempting to call get_jetton_data...");
        const result = await client.runMethod(targetAddress, 'get_jetton_data');
        console.log("✅ get_jetton_data success! This is a Jetton Master.");
        
        const stack = result.stack;
        const totalSupply = stack.readBigNumber();
        const mintable = stack.readBigNumber();
        const admin = stack.readAddress();
        const content = stack.readCell(); // Content usually stored in a cell
        const walletCode = stack.readCell();

        console.log("Total Supply:", totalSupply.toString());
        console.log("Mintable:", mintable.toString());
        console.log("Admin Address:", admin.toString());
        // Content decoding is complex, skipping for now unless needed
    } catch (e: any) {
        console.log("❌ get_jetton_data failed. It might not be a Jetton Master.");
        // console.error(e.message);
    }

    // 2. Try get_wallet_data (Check if it's a Jetton Wallet)
    try {
        console.log("\nAttempting to call get_wallet_data...");
        const result = await client.runMethod(targetAddress, 'get_wallet_data');
        console.log("✅ get_wallet_data success! This is a Jetton Wallet.");
        
        const stack = result.stack;
        const balance = stack.readBigNumber();
        const owner = stack.readAddress();
        const jettonMaster = stack.readAddress();
        const jettonWalletCode = stack.readCell();

        console.log("Balance:", balance.toString());
        console.log("Owner Address:", owner.toString());
        console.log("⭐ Jetton Master Address:", jettonMaster.toString());
        
        console.log("\n--- CONCLUSION ---");
        console.log("The address provided (" + targetAddressStr + ") is a Jetton Wallet.");
        console.log("The REAL Jetton Master Address is: " + jettonMaster.toString());
        console.log("You should use this Master Address for updating metadata.");

    } catch (e: any) {
        console.log("❌ get_wallet_data failed.");
        // console.error(e.message);
    }
}

main();
