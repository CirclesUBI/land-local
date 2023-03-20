const {web3Instance} = require("./web3instance");

const account = web3Instance.eth.accounts.privateKeyToAccount("0x5bc6328efff9fc724aad89edf1356a6ba7bee56368b4b9b47b1f29a5cd6d73c7");

const sendFunds = async function sendFunds(amount, to) {
    const signedTx = await account.signTransaction({
        from: account.address,
        to: to,
        value: amount,
        gas: 1000000
    });

    return web3Instance.eth.sendSignedTransaction(signedTx.rawTransaction);
}


module.exports = {
    sendFunds
}