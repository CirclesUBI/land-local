// const { web3Instance } = require("./web3instance");

const defaultKey =
  "0x5bc6328efff9fc724aad89edf1356a6ba7bee56368b4b9b47b1f29a5cd6d73c7";

const defaultOwnerAccount = {
  address: "0x85a88313b37676ef7F846E00287090E75931E44B",
  privateKey:
    "5bc6328efff9fc724aad89edf1356a6ba7bee56368b4b9b47b1f29a5cd6d73c7",
};
// web3Instance.eth.accounts.privateKeyToAccount(defaultKey);

module.exports = {
  defaultOwnerAccount,
  defaultKey,
};

// const { web3Instance } = require("./web3instance");

// const defaultOwnerAccount = web3Instance.eth.accounts.create();
// const defaultKey = defaultOwnerAccount.privateKey;

// module.exports = {
//   defaultOwnerAccount,
//   defaultKey,
// };
