const { web3Instance } = require("./web3instance");

const { defaultOwnerAccount } = require("./defaultOwnerAccount");
const account = web3Instance.eth.accounts.privateKeyToAccount(
  defaultOwnerAccount.privateKey
);

const sendFunds = async function sendFunds(amount, to) {
  const signedTx = await account.signTransaction({
    from: defaultOwnerAccount.address,
    to: to,
    value: amount,
    gas: 1000000,
  });

  return web3Instance.eth.sendSignedTransaction(signedTx.rawTransaction);
};

module.exports = {
  sendFunds,
};
