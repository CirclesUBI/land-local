const {web3Instance} = require("./web3instance");
const {addressCollection} = require("./addressCollection");

const defaultKey = "0x5bc6328efff9fc724aad89edf1356a6ba7bee56368b4b9b47b1f29a5cd6d73c7";
const defaultOwnerAccount = web3Instance.eth.accounts.privateKeyToAccount(defaultKey);
addressCollection.defaultOwnerAccount = defaultOwnerAccount.address;

module.exports = {
    defaultOwnerAccount,
    defaultKey
}
