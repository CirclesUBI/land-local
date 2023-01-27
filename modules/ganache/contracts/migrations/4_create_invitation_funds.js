const Web3 = require("web3");
const proxyArtifacts = require('/app/contracts/build/contracts/ProxyFactory.json');

const web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
const web3Instance = new Web3(web3Provider);
const account = web3Instance.eth.accounts.privateKeyToAccount("0x5bc6328efff9fc724aad89edf1356a6ba7bee56368b4b9b47b1f29a5cd6d73c7");

async function createSafe() {
    const safeMasterCopyAddress = "0x5e484da6227ab3ba047121742ee766cc6389db4f";
    const safeProxyFactoryAddress = "0xD5E7d393226A6e9089601080E4b92BcaF536BaDA";
    const proxyFactoryAbi = proxyArtifacts.abi;
    const proxyFactoryContractInstance = new web3Instance.eth.Contract(proxyFactoryAbi, safeProxyFactoryAddress);
    const createProxyCallData = proxyFactoryContractInstance.methods.createProxy(safeMasterCopyAddress, "0x").encodeABI();

    const signedTx = await account.signTransaction({
        from: account.address,
        to: safeProxyFactoryAddress,
        data: createProxyCallData,
        gas: 1000000
    });

    const createProxyTx = await web3Instance.eth.sendSignedTransaction(signedTx.rawTransaction);

    let proxyAddress = "";
    for (let logEntry of createProxyTx.logs) {
        if (logEntry.address?.toLowerCase() != safeProxyFactoryAddress.toLowerCase()) {
            continue;
        }

        const proxyCreatedEvent = this.web3.eth.abi.decodeLog(
            [
                {
                    name: "proxy",
                    type: "address",
                },
            ],
            logEntry.data,
            logEntry.topics
        );

        proxyAddress = proxyCreatedEvent["proxy"];
        break;
    }

    if (!proxyAddress) {
        throw new Error(
            "The deployment of the safe failed. Couldn't determine the proxy address from the receipt's log."
        );
    } else {}

    return proxyAddress;
}

async function sendFunds(amount, to) {
    const signedTx = await account.signTransaction({
        from: account.address,
        to: to,
        value: amount,
        gas: 1000000
    });

    return web3Instance.eth.sendSignedTransaction(signedTx.rawTransaction);
}

module.exports = async function (deployer, network, accounts) {
    const profileSafeAddress = await createSafe();
    console.log("safe1Address:", profileSafeAddress);

    const orgaSafeAddress = await createSafe();
    console.log("safe2Address:", orgaSafeAddress);

    const invitationFundsAddress = await createSafe();
    console.log("invitationFundsAddress:", invitationFundsAddress);

    console.log("Sending 1000 Eth invitation funds to:", invitationFundsAddress);
    await sendFunds(new Web3.utils.BN("1000000000000000000000"), invitationFundsAddress);
}
