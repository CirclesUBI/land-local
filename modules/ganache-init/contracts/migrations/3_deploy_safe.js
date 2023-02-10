const truffleContract = require('@truffle/contract');
const safeProxyFactoryArtifacts = require('/app/contracts/build/contracts/GnosisSafeProxyFactory.json');
const safeArtifacts = require('/app/contracts/build/contracts/GnosisSafe.json');
const multiSendArtifacts = require('/app/contracts/build/contracts/MultiSend.json');
const proxyArtifacts = require('/app/contracts/build/contracts/GnosisSafeProxy.json');
const compatibilityFallbackHandler = require('/app/contracts/build/contracts/CompatibilityFallbackHandler.json');
const multiSendCallOnly = require('/app/contracts/build/contracts/MultiSendCallOnly.json');
const {addressCollection} = require("../lib/addressCollection");

const GnosisSafe = truffleContract(safeArtifacts);
GnosisSafe.setProvider(web3.currentProvider);

const ProxyFactory = truffleContract(safeProxyFactoryArtifacts);
ProxyFactory.setProvider(web3.currentProvider);

const MultiSend = truffleContract(multiSendArtifacts);
MultiSend.setProvider(web3.currentProvider);

const SafeProxy = truffleContract(proxyArtifacts);
SafeProxy.setProvider(web3.currentProvider);

const CompatibilityFallbackHandler = truffleContract(compatibilityFallbackHandler);
CompatibilityFallbackHandler.setProvider(web3.currentProvider);

const MultiSendCallOnly = truffleContract(multiSendCallOnly);
MultiSendCallOnly.setProvider(web3.currentProvider);

module.exports = async function (deployer, network, accounts) {
    const masterSafeContract = (await deployer.deploy(GnosisSafe, {from: accounts[0]})
        .then(result => result.address));

    addressCollection.masterSafeContract = masterSafeContract ?? "0x5E484da6227AB3BA047121742ee766CC6389db4f";
    console.log("Master safe address is:", masterSafeContract);

    const proxyFactoryContract = (await deployer.deploy(ProxyFactory, {from: accounts[0]})
        .then(result => result.address));

    addressCollection.proxyFactoryContract = proxyFactoryContract;
    console.log("Safe factory address is:", proxyFactoryContract);

    const compatibilityFallbackHandlerContract = (await deployer.deploy(CompatibilityFallbackHandler, {from: accounts[0]})
        .then(result => result.address));

    addressCollection.compatibilityFallbackHandlerContract = compatibilityFallbackHandlerContract;
    console.log("CompatibilityFallbackHandler address is:", compatibilityFallbackHandlerContract);

    const multiSendContract = (await deployer.deploy(MultiSend, {from: accounts[0]})
        .then(result => result.address));

    addressCollection.multiSendContract = multiSendContract;
    console.log("MultiSend address is:", multiSendContract);


    const multiSendCallOnlyContract = (await deployer.deploy(MultiSendCallOnly, {from: accounts[0]})
        .then(result => result.address));

    addressCollection.multiSendCallOnlyContract = multiSendCallOnlyContract;
    console.log("MultiSendCallOnly address is:", multiSendCallOnlyContract);

    const safeProxyContract = (await deployer.deploy(SafeProxy, addressCollection.masterSafeContract, {from: accounts[0]})
        .then(result => result.address));
    console.log("SafeProxy address is:", safeProxyContract);
    addressCollection.safeProxyContract = safeProxyContract;
};
