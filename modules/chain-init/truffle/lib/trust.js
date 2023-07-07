const hub = require('../build/contracts/Hub.json');
const {web3Instance} = require("./web3instance");

const trust = async function(safe, hubContractAddress, userAddress, limit) {
    const hubAbi = hub.abi;
    const hubInstance = new web3Instance.eth.Contract(hubAbi, hubContractAddress);

    console.log(`Trusting .. ${safe.getAddress()} -> ${userAddress} with limit ${limit}`);

    const trustCallData = hubInstance.methods
        .trust(userAddress, limit)
        .encodeABI();

    const safeTransactionData = {
        to: hubContractAddress,
        value: "0",
        data: trustCallData
    }

    const safeTransaction = await safe.createTransaction({
        safeTransactionData: safeTransactionData,
        safeTxGas: 10000000
    });
    const executeTxResponse = await safe.executeTransaction(safeTransaction);

    console.log(`Trust: ${safe.getAddress()} trusts ${userAddress} with limit ${limit}. Tx hash: ${executeTxResponse.hash}`);
    return executeTxResponse;
}

module.exports = {
    trust: trust
}
