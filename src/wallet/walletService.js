import * as bip39 from 'bip39';
import { Buffer } from 'buffer';
import { mnemonicNew, mnemonicToWalletKey, mnemonicValidate, mnemonicToSeed as tonMnemonicToSeed } from '@ton/crypto';
import { WalletContractV4, WalletContractV3R2 } from '@ton/ton';

export const generateMnemonic = async (is24Words = false) => {
  const strength = is24Words ? 256 : 128;
  return bip39.generateMnemonic(strength);
};

const getSeedFromMnemonic = async (mnemonic) => {
  const phrase = mnemonic.trim().toLowerCase();
  return await bip39.mnemonicToSeed(phrase);
};

export const validateMnemonic = async (phrase) => {
  const cleanMnemonic = phrase.trim().toLowerCase();
  const words = cleanMnemonic.split(/\s+/);
  if (words.length !== 12 && words.length !== 24) return false;
  try {
    return bip39.validateMnemonic(cleanMnemonic);
  } catch (_) {
    try { return await mnemonicValidate(words); } catch (__) { return false; }
  }
};

export const deriveAllAddresses = async (mnemonic, index = 0) => {
  const cleanMnemonic = mnemonic.trim().toLowerCase();
  const words = cleanMnemonic.split(/\s+/);
  const bipMnemonic = words.join(' ');
  const seed = await getSeedFromMnemonic(bipMnemonic);

  let tonNB = 'N/A', tonB = 'N/A', trustNB = 'N/A', trustB = 'N/A';
  let tonRaw = 'N/A', tonPubKeyHex = 'N/A';
  try {
    const keyPairTon = await mnemonicToWalletKey(words);
    const walletV4 = WalletContractV4.create({ publicKey: keyPairTon.publicKey, workchain: 0 });
    tonNB = walletV4.address.toString({ bounceable: false, testOnly: false, urlSafe: true });
    tonB  = walletV4.address.toString({ bounceable: true,  testOnly: false, urlSafe: true });
    tonRaw = walletV4.address.toRawString();
    tonPubKeyHex = keyPairTon.publicKey.toString('hex');
    const walletV3 = WalletContractV3R2.create({ publicKey: keyPairTon.publicKey, workchain: 0 });
    trustNB = walletV3.address.toString({ bounceable: false, testOnly: false, urlSafe: true });
    trustB  = walletV3.address.toString({ bounceable: true,  testOnly: false, urlSafe: true });
  } catch (e) { console.error('[TON Derivation]', e); }

  return {
    mnemonic: words.join(' '),
    evm: 'N/A',
    trx: 'N/A',
    tonNB,
    tonB,
    trustNB,
    trustB,
    tonRaw,
    tonPubKeyHex,
    solana: 'N/A',
    bitcoin: 'N/A',
    index
  };
};

export const extractAddressesForNetworks = (addresses) => {
  return {
    TON: addresses.tonNB || 'N/A',
    ETH: addresses.evm || 'N/A',
    BNB: addresses.evm || 'N/A',
    MATIC: addresses.evm || 'N/A',
    ARB: addresses.evm || 'N/A',
    BASE: addresses.evm || 'N/A',
    MONAD: addresses.evm || 'N/A',
    opBNB: addresses.evm || 'N/A',
    TRX: addresses.trx || 'N/A',
    SOL: addresses.solana || 'N/A',
    BTC: addresses.bitcoin || 'N/A'
  };
};

export const MOCK_WALLET_CREATE = false;
export const getEvmPrivateKey = async () => 'N/A';
export const getSolanaKeyPair = async () => null;
export const loadWallet = () => {
  const data = localStorage.getItem('walletData');
  return data ? JSON.parse(data) : null;
};
export const saveWallet = (walletObj) => {
  localStorage.setItem('walletData', JSON.stringify(walletObj));
};
