
import { Address, TonClient, TupleBuilder, beginCell } from "@ton/ton";

async function main() {
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });

    // The contract responsible for withdrawals (corrected to match UserContext.tsx)
    const withdrawalContractAddressStr = "UQDxmQflBkBRBDVWCpBiEUueRM2qNDo6TmMm23Yoc2pAxMoX";
    const withdrawalContractAddress = Address.parse(withdrawalContractAddressStr);

    // The Jetton Master (from earlier steps)
    const jettonMasterAddress = Address.parse("EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-");

    console.log("Checking Withdrawal Contract:", withdrawalContractAddress.toString());

    // 1. Get Contract State (jettonWallet, publicKey)
    try {
        console.log("Reading contract state...");
        // Check jettonWallet stored in contract
        const resultWallet = await client.runMethod(withdrawalContractAddress, 'jettonWallet');
        const storedJettonWallet = resultWallet.stack.readAddress();
        console.log("Stored Jetton Wallet:    ", storedJettonWallet.toString());

        // Check publicKey stored in contract
        const resultKey = await client.runMethod(withdrawalContractAddress, 'publicKey');
        const storedKey = resultKey.stack.readBigNumber();
        console.log("Stored Public Key:       ", "0x" + storedKey.toString(16));

    } catch (e: any) {
        console.error("Failed to read contract state (maybe methods don't exist?):", e.message);
    }

    // 2. Calculate Expected Jetton Wallet
    try {
        console.log("Calculating expected Jetton Wallet...");
        const result = await client.runMethod(jettonMasterAddress, 'get_wallet_address', [
            { type: 'slice', cell: beginCell().storeAddress(withdrawalContractAddress).endCell() }
        ]);
        const expectedJettonWallet = result.stack.readAddress();
        console.log("Expected Jetton Wallet:  ", expectedJettonWallet.toString());

        // 3. Check Balance of that Wallet
        console.log("Checking wallet balance...");
        const walletResult = await client.runMethod(expectedJettonWallet, 'get_wallet_data');
        const balance = walletResult.stack.readBigNumber();
        const readableBalance = Number(balance) / 1e9;
        console.log(`\n💰 Withdrawal Contract TASTE Balance: ${readableBalance.toLocaleString()} TASTE`);

        if (balance === 0n) {
            console.log("\n⚠️ CRITICAL WARNING: The contract has 0 TASTE tokens!");
            console.log("Users cannot withdraw because the contract wallet is empty.");
            console.log("SOLUTION: Send TASTE tokens to:", withdrawalContractAddress.toString());
        } else {
            console.log("\n✅ Contract has funds.");
        }

    } catch (e: any) {
        console.error("Failed to check Jetton Wallet details:", e.message);
    }
}

main();
