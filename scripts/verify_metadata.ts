
import { Address, TonClient, Cell } from "@ton/ton";

async function main() {
    const client = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });

    const jettonMasterAddress = Address.parse("EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-");
    console.log("Verifying Metadata for:", jettonMasterAddress.toString());

    try {
        const result = await client.runMethod(jettonMasterAddress, 'get_jetton_data');
        const stack = result.stack;
        stack.readBigNumber(); // totalSupply
        stack.readBigNumber(); // mintable
        stack.readAddress();   // admin
        const contentCell = stack.readCell(); // content

        // Decode content
        const slice = contentCell.beginParse();
        const prefix = slice.loadUint(8);

        if (prefix === 0x01) {
            const url = slice.loadStringTail();
            console.log("\n✅ On-Chain Metadata URL found:");
            console.log(url);

            const expectedUrl = "https://gateway.pinata.cloud/ipfs/bafkreih664ymsfu3vt7ilqjbnnmh5s7gn3gkhnwim2pbknbl2wfa7vvcke";

            if (url === expectedUrl) {
                console.log("\n🎉 SUCCESS: Metadata matches the expected URL!");
            } else {
                console.log("\n⚠️ WARNING: Metadata URL does NOT match expectation.");
                console.log("Expected:", expectedUrl);
            }
        } else {
            console.log("\n❌ Unknown content prefix:", prefix);
        }

    } catch (e: any) {
        console.error("Verification failed:", e.message);
    }
}

main();
