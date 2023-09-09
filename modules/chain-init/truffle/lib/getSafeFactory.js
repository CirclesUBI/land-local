const { web3Instance } = require("./web3instance");
const { SafeFactory } = require("@safe-global/safe-core-sdk");
const Web3Adapter = require("@safe-global/safe-web3-lib");

const safeProxyFactoryArtifacts = require("../build/contracts/GnosisSafeProxyFactory.json");
const safeArtifacts = require("../build/contracts/GnosisSafe.json");
const multiSendArtifacts = require("../build/contracts/MultiSend.json");
const proxyArtifacts = require("../build/contracts/GnosisSafeProxy.json");
const compatibilityFallbackHandler = require("../build/contracts/CompatibilityFallbackHandler.json");
const multiSendCallOnlyArtifacts = require("../build/contracts/MultiSendCallOnly.json");
const { defaultOwnerAccount } = require("./defaultOwnerAccount");

console.log("defaultOwnerAccount: ", defaultOwnerAccount);
async function getSafeFactory(addresses) {
  const ethAdapter = new Web3Adapter.default({
    web3: web3Instance,
    signerAddress: defaultOwnerAccount.address,
  });

  const id = await ethAdapter.getChainId();
  console.log("SAFE ID: ", id);

  const contractNetworks = {
    [id]: {
      multiSendAddress: addresses.multiSendContract,
      multiSendAbi: multiSendArtifacts.abi,
      safeMasterCopyAddress: addresses.masterSafeContract,
      safeMasterCopyAbi: safeArtifacts.abi,
      safeProxyFactoryAddress: addresses.proxyFactoryContract,
      safeProxyFactoryAbi: safeProxyFactoryArtifacts.abi,
      safeProxyAddress: addresses.safeProxyContract,
      safeProxyAbi: proxyArtifacts.abi,
      fallbackHandlerAddress: addresses.compatibilityFallbackHandlerContract,
      fallbackHandlerAbi: compatibilityFallbackHandler.abi,
      multiSendCallOnlyAddress: addresses.multiSendCallOnlyContract,
      multiSendCallOnlyAbi: multiSendCallOnlyArtifacts.abi,
    },
  };

  console.log("contractNetworks: ", contractNetworks);
  console.log("ethAdapter: ", ethAdapter);

  const factory = await SafeFactory.create({
    ethAdapter: ethAdapter,
    contractNetworks: contractNetworks,
  });

  return factory;
}

module.exports = {
  getSafeFactory,
};
