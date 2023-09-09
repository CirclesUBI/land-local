const Web3 = require("web3");

let addr = "http://nethermind:8545";

const addresses = {
  hubContract: "0xf2e246bb76df876cef8b38ae84130f4f55de395b",
  proxyFactoryContract: "0xde09e74d4888bc4e65f589e8c13bce9f71ddf4c7",
  masterSafeContract: "0x7e5f4552091a69125d5dfcb7b8c2659029395bdf",
  defaultOwnerAccount: {
    address: "0x85a88313b37676ef7F846E00287090E75931E44B",
    privateKey:
      "0x5bc6328efff9fc724aad89edf1356a6ba7bee56368b4b9b47b1f29a5cd6d73c7",
  },
  multiSendContract: "0xb9816fc57977d5a786e654c7cf76767be63b966e",
  safeProxyContract: "0x5cf7f96627f3c9903763d128a1cc5d97556a6b99",
  compatibilityFallbackHandlerContract:
    "0x51a240271ab8ab9f9a21c82d9a85396b704e164d",
  multiSendCallOnlyContract: "0x6d411e0a54382ed43f02410ce1c7a7c122afa6e1",
  migrationsContract: "",
  rootSafeContract: "",
  operatorOrgaSafeContract: "",
  invitationFundsSafeContract: "",
  otherSafes: {},
  network: {
    from: "0x7e5f4552091a69125d5dfcb7b8c2659029395bdf",
    host: "nethermind",
    port: 8545,
    network_id: "99",
  },
};
try {
  // const addresses = require("/app/status/addresses.temp.json");
  addr = `http://${addresses.network.host}:${addresses.network.port}`;
} catch (e) {
  console.log("No /app/status/addresses.temp.json found");
}
console.log("ADDRESS:", addr);
const web3Provider = new Web3.providers.HttpProvider(addr);
const web3Instance = new Web3(web3Provider);

const { SafeFactory } = require("@safe-global/safe-core-sdk");
const Web3Adapter = require("@safe-global/safe-web3-lib");

const safeProxyFactoryArtifacts = require("../modules/chain-init/truffle/build/contracts/GnosisSafeProxyFactory.json");
const safeArtifacts = require("../modules/chain-init/truffle/build/contracts/GnosisSafe.json");
const multiSendArtifacts = require("../modules/chain-init/truffle/build/contracts/MultiSend.json");
const proxyArtifacts = require("../modules/chain-init/truffle/build/contracts/GnosisSafeProxy.json");
const compatibilityFallbackHandler = require("../modules/chain-init/truffle/build/contracts/CompatibilityFallbackHandler.json");
const multiSendCallOnlyArtifacts = require("../modules/chain-init/truffle/build/contracts/MultiSendCallOnly.json");
const { defaultOwnerAccount } = require("./defaultOwnerAccount");

module.exports = {
  web3Instance,
};
