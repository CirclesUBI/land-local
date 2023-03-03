const truffleContract = require('@truffle/contract');
const truffleConfig = require('../truffle-config');
const fs = require('fs');
const util = require('util');

const safeProxyFactoryArtifacts = require('../build/contracts/GnosisSafeProxyFactory.json');
const safeArtifacts = require('../build/contracts/GnosisSafe.json');
const multiSendArtifacts = require('../build/contracts/MultiSend.json');
const proxyArtifacts = require('../build/contracts/GnosisSafeProxy.json');
const compatibilityFallbackHandler = require('../build/contracts/CompatibilityFallbackHandler.json');
const multiSendCallOnly = require('../build/contracts/MultiSendCallOnly.json');
const {addressCollection} = require("../lib/addressCollection");
const {defaultOwnerAccount} = require("../lib/defaultOwnerAccount");

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
        .then(result => result.address?.toLowerCase()));

    addressCollection.masterSafeContract = masterSafeContract ?? "0x5E484da6227AB3BA047121742ee766CC6389db4f".toLowerCase();
    console.log("Master safe address is:", masterSafeContract);

    const proxyFactoryContract = (await deployer.deploy(ProxyFactory, {from: accounts[0]})
        .then(result => result.address.toLowerCase()));

    addressCollection.proxyFactoryContract = proxyFactoryContract;
    console.log("Safe factory address is:", proxyFactoryContract);

    const compatibilityFallbackHandlerContract = (await deployer.deploy(CompatibilityFallbackHandler, {from: accounts[0]})
        .then(result => result.address.toLowerCase()));

    addressCollection.compatibilityFallbackHandlerContract = compatibilityFallbackHandlerContract;
    console.log("CompatibilityFallbackHandler address is:", compatibilityFallbackHandlerContract);

    const multiSendContract = (await deployer.deploy(MultiSend, {from: accounts[0]})
        .then(result => result.address.toLowerCase()));

    addressCollection.multiSendContract = multiSendContract;
    console.log("MultiSend address is:", multiSendContract);


    const multiSendCallOnlyContract = (await deployer.deploy(MultiSendCallOnly, {from: accounts[0]})
        .then(result => result.address.toLowerCase()));

    addressCollection.multiSendCallOnlyContract = multiSendCallOnlyContract;
    console.log("MultiSendCallOnly address is:", multiSendCallOnlyContract);

    const safeProxyContract = (await deployer.deploy(SafeProxy, addressCollection.masterSafeContract, {from: accounts[0]})
        .then(result => result.address.toLowerCase()));
    console.log("SafeProxy address is:", safeProxyContract);
    addressCollection.safeProxyContract = safeProxyContract;

    new Promise(resolve => setTimeout(resolve, 2000));

    addressCollection.defaultOwnerAccount = {
        address: defaultOwnerAccount.address,
        privateKey: defaultOwnerAccount.privateKey,
    };

    const writeFile = util.promisify(fs.writeFile);
    await writeFile('/app/status/addresses.temp.json', JSON.stringify({...addressCollection, network: truffleConfig.networks[network]}, null, 2));
};
