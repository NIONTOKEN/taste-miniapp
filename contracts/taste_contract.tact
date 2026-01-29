import "@stdlib/deploy";

// TEP-74 Jetton Transfer message
message(0x0f8a7ea5) TokenTransfer {
    queryId: Int as uint64;
    amount: Int as coins;
    destination: Address;
    responseDestination: Address;
    customPayload: Cell?;
    forwardTonAmount: Int as coins;
    forwardPayload: Slice as remaining;
}

message Claim {
    amount: Int as coins;
    to: Address;
}

message Withdraw {
    amount: Int as coins;
    signature: Slice;
}

message SetJettonWallet {
    address: Address;
}

message SetPublicKey {
    publicKey: Int as uint256;
}

contract TasteContract with Deployable {
    owner: Address;
    jettonWallet: Address;
    publicKey: Int as uint256; // Backend public key for signing withdrawals
    
    init(owner: Address, jettonWallet: Address, publicKey: Int) {
        self.owner = owner;
        self.jettonWallet = jettonWallet;
        self.publicKey = publicKey;
    }

    receive(msg: SetJettonWallet) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Only owner can update settings");
        self.jettonWallet = msg.address;
    }

    receive(msg: SetPublicKey) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Only owner can update public key");
        self.publicKey = msg.publicKey;
    }

    // Owner can manually trigger claims (Admin bypass)
    receive(msg: Claim) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Only owner can trigger manual claims");
        self._sendJettons(msg.to, msg.amount);
    }

    // User can withdraw with a valid backend signature
    receive(msg: Withdraw) {
        let ctx: Context = context();
        
        // Hash the withdrawal details: user_address + amount
        let hash: Int = beginCell()
            .storeAddress(ctx.sender)
            .storeCoins(msg.amount)
            .endCell()
            .hash();

        // Verify that the signature is from our trusted backend
        require(checkSignature(hash, msg.signature, self.publicKey), "Invalid withdrawal signature");

        // Send the Jettons
        self._sendJettons(ctx.sender, msg.amount);
        
        self.reply("Withdrawal successful".asComment());
    }

    fun _sendJettons(to: Address, amount: Int) {
        send(SendParameters{
            to: self.jettonWallet,
            value: ton("0.05"), // TON for gas
            mode: SendPayGasSeparately,
            body: TokenTransfer{
                queryId: 0,
                amount: amount,
                destination: to,
                responseDestination: self.owner,
                customPayload: null,
                forwardTonAmount: ton("0.01"),
                forwardPayload: emptySlice()
            }.toCell()
        });
    }

    get fun owner(): Address {
        return self.owner;
    }

    get fun jettonWallet(): Address {
        return self.jettonWallet;
    }

    get fun publicKey(): Int {
        return self.publicKey;
    }
}
