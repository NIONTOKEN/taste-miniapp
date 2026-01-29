import { keyPairFromSeed } from "@ton/crypto";

async function generateKeys() {
    // Kanka, bu kod sana backend için bir anahtar çifti üretir. 
    // PrivateKey gizli kalmalı, PublicKey ise kontrata eklenecek.
    const seed = Buffer.alloc(32, "taste-backend-seed-placeholder");
    const keyPair = keyPairFromSeed(seed);

    console.log("--- TASTE BACKEND KEYS ---");
    console.log("Public Key (Hex):", keyPair.publicKey.toString("hex"));
    console.log("Public Key (Uint256 for Tact):", "0x" + keyPair.publicKey.toString("hex"));
    console.log("Private Key (Hex):", keyPair.secretKey.toString("hex"));
    console.log("--------------------------");
    console.log("ÖNEMLİ: Private Key'i asla kimseyle paylaşma!");
}

generateKeys();
