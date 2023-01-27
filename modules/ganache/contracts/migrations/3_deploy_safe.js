const truffleContract = require('@truffle/contract');
const proxyArtifacts = require('/app/contracts/build/contracts/ProxyFactory.json');
const safeArtifacts = require('/app/contracts/build/contracts/GnosisSafe.json');

const GnosisSafe = truffleContract(safeArtifacts);
const ProxyFactory = truffleContract(proxyArtifacts);

GnosisSafe.setProvider(web3.currentProvider);
ProxyFactory.setProvider(web3.currentProvider);

module.exports = async function (deployer, network, accounts) {
    const masterSafeContract = (await deployer.deploy(GnosisSafe, {from: accounts[0]}).then(result => result.address));
    console.log("Master safe address is:", masterSafeContract);

    const proxyFactoryContract = (await deployer.deploy(ProxyFactory, {from: accounts[0]}).then(result => result.address));
    console.log("Safe factory address is:", proxyFactoryContract);
};
