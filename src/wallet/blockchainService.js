import { WALLET_CONFIG } from './config';
import { TonClient, WalletContractV4, internal, toNano, Address, beginCell, SendMode } from '@ton/ton';

const tonComment = (text) => beginCell().storeUint(0, 32).storeStringTail(text).endCell();

const TON_RPCS = WALLET_CONFIG.RPC_NODES.TON;
let currentTonRpcIdx = 0;

const getTonClient = () => new TonClient({ endpoint: TON_RPCS[currentTonRpcIdx % TON_RPCS.length], timeout: 30000 });

export const getTonBalance = async (address) => {
  if (!address || address === 'N/A') return 0;
  try {
    const client = getTonClient();
    const balanceNano = await client.getBalance(Address.parse(address));
    return Number(balanceNano) / 1e9;
  } catch (e) {
    return 0;
  }
};

export const fetchAllBalances = async (walletAddressObj) => {
  const tonBalance = await getTonBalance(walletAddressObj.tonNB);
  return {
    TON: { TON: tonBalance }
  };
};

export const sendTon = async (walletV4, secretKey, toAddress, amount, memo = "") => {
  const client = getTonClient();
  const seqno = await walletV4.getSeqno(client.provider(walletV4.address, null));
  const transfer = walletV4.createTransfer({
    seqno,
    secretKey,
    sendMode: SendMode.PAY_GAS_SEPARATELY + SendMode.IGNORE_ERRORS,
    messages: [
      internal({
        to: toAddress,
        value: toNano(amount.toString()),
        body: memo ? tonComment(memo) : undefined,
        bounce: false
      })
    ]
  });
  await client.sendExternalMessage(walletV4, transfer);
  return { hash: "TonTransfer_Sent" };
};

export const clearMemCache = () => {};

// STUBS for SWAP component compilation
export const getSwapQuote = async () => null;
export const executeRealSwap = async () => ({success: false, error: 'Not Supported'});
export const getTonQuote = async () => null;
export const executeTonSwap = async () => ({success: false, error: 'Not Supported'});
export const getJupiterQuote = async () => null;
export const executeJupiterSwap = async () => ({success: false, error: 'Not Supported'});
export const sendNativeToken = async () => ({success: false, error: 'Not Supported'});
export const getNativeBalance = async () => 0;

export const sendEVM = async () => ({hash: 'N/A'});
export const sendTonFull = async () => ({hash: 'N/A'});
export const sendSolana = async () => ({hash: 'N/A'});
export const sendBitcoin = async () => ({hash: 'N/A'});
export const sendTron = async () => ({hash: 'N/A'});
export const sendTonJetton = async () => ({hash: 'N/A'});
export const getTokenBalance = async () => 0;
export const getTokenBalanceEvm = async () => 0;
export const withTimeout = (promise, ms) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('TIMEOUT'));
    }, ms);
    promise.then(value => {
      clearTimeout(timer);
      resolve(value);
    }).catch(reason => {
      clearTimeout(timer);
      reject(reason);
    });
  });
};
