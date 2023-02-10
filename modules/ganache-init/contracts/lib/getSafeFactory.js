const {addressCollection} = require("./addressCollection");
const {defaultOwnerAccount} = require("./defaultOwnerAccount");
const {web3Instance} = require("./web3instance");
const {SafeFactory} = require("@safe-global/safe-core-sdk");
const Web3Adapter = require("@safe-global/safe-web3-lib");

const safeProxyFactoryArtifacts = require('/app/contracts/build/contracts/GnosisSafeProxyFactory.json');
const safeArtifacts = require('/app/contracts/build/contracts/GnosisSafe.json');
const multiSendArtifacts = require('/app/contracts/build/contracts/MultiSend.json');
const proxyArtifacts = require('/app/contracts/build/contracts/GnosisSafeProxy.json');
const compatibilityFallbackHandler = require('/app/contracts/build/contracts/CompatibilityFallbackHandler.json');
const multiSendCallOnlyArtifacts = require('/app/contracts/build/contracts/MultiSendCallOnly.json');
async function getSafeFactory() {
    const ethAdapter = new Web3Adapter.default({
        web3: web3Instance,
        signerAddress: defaultOwnerAccount.address
    });

    const id = await ethAdapter.getChainId();
    const contractNetworks = {
        [id]: {
            multiSendAddress: addressCollection.multiSendContract,
            multiSendAbi: multiSendArtifacts.abi,
            safeMasterCopyAddress: addressCollection.masterSafeContract,
            safeMasterCopyAbi: safeArtifacts.abi,
            safeProxyFactoryAddress: addressCollection.proxyFactoryContract,
            safeProxyFactoryAbi: safeProxyFactoryArtifacts.abi,
            safeProxyAddress: addressCollection.safeProxyContract,
            safeProxyAbi: proxyArtifacts.abi,
            fallbackHandlerAddress: addressCollection.compatibilityFallbackHandlerContract,
            fallbackHandlerAbi: compatibilityFallbackHandler.abi,
            multiSendCallOnlyAddress: addressCollection.multiSendCallOnlyContract,
            multiSendCallOnlyAbi: multiSendCallOnlyArtifacts.abi
        }
    };

    return await SafeFactory.create({
        ethAdapter: ethAdapter,
        contractNetworks: contractNetworks
    });
}

module.exports = {
    getSafeFactory
};