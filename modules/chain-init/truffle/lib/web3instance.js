const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");

const { defaultOwnerAccount } = require("./defaultOwnerAccount");
let addr = "http://nethermind:8545";

try {
  const addresses = require("/app/status/addresses.temp.json");
  addr = `http://${addresses.network.host}:${addresses.network.port}`;
} catch (e) {
  console.log("No /app/status/addresses.temp.json found");
}
let provider;
provider = new HDWalletProvider(defaultOwnerAccount.privateKey, addr);
const web3Instance = new Web3(provider);

module.exports = {
  web3Instance,
};
