import {
    Blockchain,
    SandboxContract,
    TreasuryContract,
} from '@ton/sandbox';
import { Address, toNano } from '@ton/core';
import { TasteContract } from '../wrappers/TasteContract';
import '@ton/test-utils';

describe('TasteContract', () => {
    let blockchain: Blockchain;
    let owner: SandboxContract<TreasuryContract>;
    let tasteContract: SandboxContract<TasteContract>;
    let jettonWallet: Address;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        owner = await blockchain.treasury('owner');
        jettonWallet = Address.parse('EQB0beTxStmdhVri4s-cYlwYJaG_ZiR5lpLufCNC2VWUxZc-');

        tasteContract = blockchain.openContract(
            await TasteContract.fromInit(owner.address, jettonWallet, 0n)
        );

        const deployResult = await tasteContract.send(
            owner.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: owner.address,
            to: tasteContract.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        const contractJettonWallet = await tasteContract.getJettonWallet();
        expect(contractJettonWallet.toString()).toBe(jettonWallet.toString());
    });

    it('should trigger claim and send jetton transfer', async () => {
        const receiver = await blockchain.treasury('receiver');
        const claimAmount = toNano('100');

        const claimResult = await tasteContract.send(
            owner.getSender(),
            {
                value: toNano('0.1'),
            },
            {
                $$type: 'Claim',
                amount: claimAmount,
                to: receiver.address,
            }
        );
        expect(claimResult.transactions).toHaveTransaction({
            from: owner.address,
            to: tasteContract.address,
            success: true,
        });

        expect(claimResult.transactions).toHaveTransaction({
            from: tasteContract.address,
            to: jettonWallet,
        });
    });

    it('should fail if non-owner tries to claim', async () => {
        const nonOwner = await blockchain.treasury('nonOwner');

        const claimResult = await tasteContract.send(
            nonOwner.getSender(),
            { value: toNano('0.1') },
            {
                $$type: 'Claim',
                amount: toNano('100'),
                to: nonOwner.address,
            }
        );

        expect(claimResult.transactions).toHaveTransaction({
            from: nonOwner.address,
            to: tasteContract.address,
            success: false,
            exitCode: 44188,
        });
    });
});
