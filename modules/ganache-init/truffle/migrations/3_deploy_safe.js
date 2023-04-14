const truffleContract = require('@truffle/contract');
const truffleConfig = require('../truffle-config');
const fs = require('fs');
const util = require('util');
const Web3 = require("web3");

const safeProxyFactoryArtifacts = require('../build/contracts/GnosisSafeProxyFactory.json');
const safeArtifacts = require('../build/contracts/GnosisSafe.json');
const multiSendArtifacts = require('../build/contracts/MultiSend.json');
const proxyArtifacts = require('../build/contracts/GnosisSafeProxy.json');
const compatibilityFallbackHandler = require('../build/contracts/CompatibilityFallbackHandler.json');
const multiSendCallOnly = require('../build/contracts/MultiSendCallOnly.json');
const {addressCollection} = require("../lib/addressCollection");
const {defaultOwnerAccount} = require("../lib/defaultOwnerAccount");
const {sendFunds} = require("../lib/sendFunds");

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

    addressCollection.rootSafeContract =  (await deployer.deploy(GnosisSafe, {from: accounts[0]})
        .then(result => result.address?.toLowerCase()));

    addressCollection.operatorOrgaSafeContract =  (await deployer.deploy(GnosisSafe, {from: accounts[0]})
        .then(result => result.address?.toLowerCase()));

    addressCollection.invitationFundsSafeContract =  (await deployer.deploy(GnosisSafe, {from: accounts[0]})
        .then(result => result.address?.toLowerCase()));

    const invitationFundsSafeInstance = await GnosisSafe.at(addressCollection.invitationFundsSafeContract);
    const setupData = {
        owners: [defaultOwnerAccount.address] // Replace with an array of owner addresses
        ,threshold: 1 // Replace with the number of required confirmations
        ,to: "0x0000000000000000000000000000000000000000"  // Replace with the address of the recipient
        ,data: "0x" // Replace with the transaction data
        ,fallbackHandler: "0x" // Replace with the fallback handler address
        ,payment: "0x00" // Replace with the payment amount
        ,paymentReceiver: "0x0000000000000000000000000000000000000000" // Replace with the payment receiver address
    }

    const encodedFunctionCall = invitationFundsSafeInstance.contract.methods.setup(
        setupData.owners,
        setupData.threshold,
        setupData.to,
        setupData.data,
        '0x0000000000000000000000000000000000000000', // No payment token specified
        '0x0000000000000000000000000000000000000000', // No payment token specified
        setupData.payment,
        setupData.paymentReceiver
    ).encodeABI();

    console.log("Encoded setup() function call:", encodedFunctionCall);

    const transactionObject = {
        from: defaultOwnerAccount.address,
        to: addressCollection.invitationFundsSafeContract,
        data: encodedFunctionCall,
        gasLimit: 5000000, // Replace with the appropriate gas limit
        gasPrice: Web3.utils.toWei('50', 'gwei') // Replace with the appropriate gas price
    };

    console.log("web3", web3);

    const signedTransaction = await web3.eth.accounts.signTransaction(transactionObject, defaultOwnerAccount.privateKey);
    console.log('Signed transaction:', signedTransaction.rawTransaction)

    const transactionReceipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    console.log('Transaction hash:', transactionReceipt.transactionHash);

    console.log("Sending 100 Eth invitation funds to:", addressCollection.invitationFundsSafeContract);
    await sendFunds(new Web3.utils.BN("10000000000000000000"), addressCollection.invitationFundsSafeContract);

    const writeFile = util.promisify(fs.writeFile);
    await writeFile('/app/status/addresses.temp.json', JSON.stringify({...addressCollection, network: truffleConfig.networks[network]}, null, 2));
};
