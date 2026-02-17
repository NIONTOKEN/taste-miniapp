
import { Address, TonClient } from "@ton/ton";

async function main() {
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });

    const wallet1 = Address.parse("UQB7zxR3WWsvlUnFVzY6rnTpBeLScnEReaeLQ7gI53mRbvHC"); // User connected this earlier
    const wallet2 = Address.parse("EQBQiZVPYK_NZLZp_4orkmzNXYJpx28Y9CqRcpxo66kSoX1i"); // Admin wallet

    console.log("Checking User Wallet Balances...");

    try {
        const bal1 = await client.getBalance(wallet1);
        console.log(`\nWallet 1 (UQB7zx...): ${(Number(bal1) / 1e9).toFixed(4)} TON`);
    } catch (e: any) { console.log("Wallet 1 check failed"); }

    try {
        const bal2 = await client.getBalance(wallet2);
        console.log(`Wallet 2 (EQBQiZ...): ${(Number(bal2) / 1e9).toFixed(4)} TON`);
    } catch (e: any) { console.log("Wallet 2 check failed"); }

    console.log("\nREQUIRED for Withdrawal: ~0.11 TON (0.1 attached + gas)");
}

main();
