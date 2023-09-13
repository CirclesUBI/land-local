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

async function getSafeFactory(addresses) {
  const ethAdapter = new Web3Adapter.default({
    web3: web3Instance,
    signerAddress: defaultOwnerAccount.address,
  });

  const chainId = await ethAdapter.getChainId();

  const contractNetworks = {
    [chainId]: {
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

  const safeFactory = await SafeFactory.create({
    ethAdapter,
    contractNetworks,
  });

  return safeFactory;
}

module.exports = {
  getSafeFactory,
};
