
import { Address, TonClient } from "@ton/ton";

async function main() {
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });

    const withdrawalContract = Address.parse("UQDxmQflBkBRBDVWCpBiEUueRM2qNDo6TmMm23Yoc2pAxMoX");
    const withdrawalJettonWallet = Address.parse("EQB0HrkC7PAQsVjBAbND8MTGcO2dCNyVK83XzH-BGD4oajev");

    console.log("Checking balances...");

    // 1. Check TON Balance of the Contract
    try {
        const balance = await client.getBalance(withdrawalContract);
        console.log(`\n🏛️  Contract TON Balance: ${(Number(balance) / 1e9).toFixed(4)} TON`);
    } catch (e: any) {
        console.error("Failed to check TON balance:", e.message);
    }

    // 2. Check TASTE Balance of the Contract's Jetton Wallet
    try {
        // Wait a bit to avoid 429
        await new Promise(r => setTimeout(r, 2000));

        const result = await client.runMethod(withdrawalJettonWallet, 'get_wallet_data');
        const stack = result.stack;
        const balance = stack.readBigNumber();
        console.log(`\n💎 Contract TASTE Balance: ${(Number(balance) / 1e9).toLocaleString()} TASTE`);

        if (balance === 0n) {
            console.log("\n⚠️  PROBLEM: The Withdrawal Contract has 0 TASTE!");
            console.log("   Users cannot withdraw.");
            console.log("   Please send TASTE tokens to this address: " + withdrawalContract.toString());
        } else {
            console.log("\n✅ Contract has TASTE tokens.");
        }

    } catch (e: any) {
        console.error("Failed to check TASTE balance:", e.message);
        // If it fails with -13 here, it means the wallet might not exist (not deployed/initialized yet)
        console.log("   (If this failed, it implies the Contract hasn't received any TASTE yet to initialize its wallet)");
    }
}

main();
