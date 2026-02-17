
import { keyPairFromSeed } from "@ton/crypto";

async function main() {
    // 1. Generate Key from Frontend Seed
    // "taste-backend-seed-placeholder" is 30 bytes, but Buffer.alloc(32, ...) fills it
    // Wait, Buffer.alloc(32, "string") uses the string to fill.
    // Let's verify exactly how the frontend does it.

    // In src/services/backend.ts:
    // const BACKEND_SEED = Buffer.alloc(32, "taste-backend-seed-placeholder");

    const BACKEND_SEED = Buffer.alloc(32, "taste-backend-seed-placeholder");
    const keyPair = keyPairFromSeed(BACKEND_SEED);

    console.log("Frontend Public Key (Buffer):", keyPair.publicKey.toString('hex'));
    console.log("Frontend Public Key (BigInt):", "0x" + keyPair.publicKey.toString('hex'));

    // 2. The Deployed Contract Public Key
    // From deployTasteContract.ts:
    // const publicKey = BigInt("0xafb15ea372dd7a08d0faf041a0a356454bccbaf4f1eea6160286e1e467b6e2f6");

    const deployedKey = "afb15ea372dd7a08d0faf041a0a356454bccbaf4f1eea6160286e1e467b6e2f6";

    console.log("Deployed Public Key:       ", deployedKey);

    if (keyPair.publicKey.toString('hex') === deployedKey) {
        console.log("✅ MATCH! The frontend is using the correct key.");
    } else {
        console.log("❌ MISMATCH! The frontend is validating with a DIFFERENT key.");
        console.log("This causes the contract to reject the withdrawal signature.");
    }
}

main();
