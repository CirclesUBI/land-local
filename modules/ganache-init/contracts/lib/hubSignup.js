const safeArtifacts = require('/app/contracts/build/contracts/GnosisSafe.json');
const hub = require('/app/contracts/build/contracts/Hub.json');

const hubSignup = async function() {


    const hubAbi = hub.abi;
    const hubInstance = new web3Instance.web3Instance.eth.Contract(hubAbi, safeProxyFactoryAddress);

    const safeAbi = safeArtifacts.abi;
    const safeContractInstance = new web3Instance.web3Instance.eth.Contract(safeAbi, safeMasterCopyAddress);

    const createProxyData = hubInstance.methods
        .signup(safeMasterCopyAddress, proxySetupData)
        .encodeABI();

    return await safeProxy.execTransaction(privateKey, {
        to: this.address,
        data: txData,
        value: new BN("0"),
        refundReceiver: ZERO_ADDRESS,
        gasToken: ZERO_ADDRESS,
        operation: SafeOps.CALL,
    }, true);
}


module.exports = {
    hubSignup
}