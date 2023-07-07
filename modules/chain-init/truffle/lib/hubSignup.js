const hub = require('../build/contracts/Hub.json');
const {web3Instance} = require("./web3instance");

const hubSignup = async function(safe, hubContractAddress) {
    const hubAbi = hub.abi;
    const hubInstance = new web3Instance.eth.Contract(hubAbi, hubContractAddress);

    const signupCallData = hubInstance.methods
        .signup()
        .encodeABI();

    const safeTransactionData = {
        to: hubContractAddress,
        value: "0",
        data: signupCallData
    }

    const safeTransaction = await safe.createTransaction({ safeTransactionData });
    const executeTxResponse = await safe.executeTransaction(safeTransaction);

    console.log(`HubSignup for: ${safe.getAddress()}: TxHash: ${executeTxResponse.hash}`);

    return safe;
}

module.exports = {
    hubSignup
}
