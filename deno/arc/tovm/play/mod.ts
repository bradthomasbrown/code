// import { EthereumStateGraph } from '../evm/state/lib/mod.ts';
// import { Signer } from '../../evm/lib/Signer.ts'

// const ethState = new EthereumStateGraph();

// const stateRoot = "0x" + "".padEnd(64, '0');

// // // Set world state
// ethState.setWorldState(stateRoot); // state root hash

// const signer0 = new Signer()
// const signer1 = new Signer()
// const signer2 = new Signer()
// const signer3 = new Signer()
// const signer4 = new Signer()

// const bᴇ = (n: bigint, exp: bigint) => n * 10n ** exp;

// ethState.addAccount(signer0.address, {
//   nonce: 0n,
//   balance: bᴇ(1n, 18n),
//   storageRoot: null,
//   codeHash: null
// });

// ethState.addAccount(signer1.address, {
//   nonce: 0n,
//   balance: bᴇ(1n, 18n),
//   storageRoot: null,
//   codeHash: null
// });

// ethState.addAccount(signer2.address, {
//   nonce: 0n,
//   balance: bᴇ(1n, 18n),
//   storageRoot: null,
//   codeHash: null
// });

// ethState.addAccount(signer3.address, {
//   nonce: 0n,
//   balance: bᴇ(1n, 18n),
//   storageRoot: null,
//   codeHash: null
// });

// ethState.addAccount(signer4.address, {
//   nonce: 0n,
//   balance: bᴇ(1n, 18n),
//   storageRoot: null,
//   codeHash: null
// });

// // Set account storage
// ethState.setStorage(signer.address, {
//   "0x0000000000000000000000000000000000000000000000000000000000000000": 123n
// });

// // Retrieve account state
// const accountState = ethState.getAccountState(signer.address);
// console.log(accountState);

// // // Retrieve account storage
// const storage = ethState.getStorage(signer.address);
// console.log(storage);