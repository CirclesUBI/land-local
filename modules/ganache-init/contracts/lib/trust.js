const hub = require('/app/contracts/build/contracts/Hub.json');
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

    const safeTransaction = await safe.createTransaction({ safeTransactionData });
    const executeTxResponse = await safe.executeTransaction(safeTransaction);

    console.log(`Trust: ${safe.getAddress()} trusts ${userAddress} with limit ${limit}`);
}

module.exports = {
    trust: trust
}
