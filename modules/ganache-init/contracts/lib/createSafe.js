const web3Instance = require("./web3instance");

const proxyFactoryArtifacts = require('/app/contracts/build/contracts/GnosisSafeProxyFactory.json');
const safeArtifacts = require('/app/contracts/build/contracts/GnosisSafe.json');

const account = web3Instance.web3Instance.eth.accounts.privateKeyToAccount("0x5bc6328efff9fc724aad89edf1356a6ba7bee56368b4b9b47b1f29a5cd6d73c7");
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

const createSafe = async function createSafe() {
    const safeMasterCopyAddress = "0x5e484da6227ab3ba047121742ee766cc6389db4f";
    const safeProxyFactoryAddress = "0xD5E7d393226A6e9089601080E4b92BcaF536BaDA";

    const proxyFactoryAbi = proxyFactoryArtifacts.abi;
    const proxyFactoryContractInstance = new web3Instance.web3Instance.eth.Contract(proxyFactoryAbi, safeProxyFactoryAddress);

    const safeAbi = safeArtifacts.abi;
    const safeContractInstance = new web3Instance.web3Instance.eth.Contract(safeAbi, safeMasterCopyAddress);

    const proxySetupData = safeContractInstance.methods
        .setup(
            [account.address],
            1, // threshold (how many owners are required to sign a transaction -> 1)
            ZERO_ADDRESS, // delegatecall for modules (none)
            "0x", // init data for modules (none)
            "0xf48f2b2d2a534e402487b3ee7c18c33aec0fe5e4", // fallbackHandler
            ZERO_ADDRESS, // paymentToken (none defaults to ETH)
            0, // payment
            ZERO_ADDRESS // paymentReceiver
        )
        .encodeABI();


    const createProxyData = proxyFactoryContractInstance.methods
        .createProxy(safeMasterCopyAddress, proxySetupData)
        .encodeABI();

    const signedTx = await account.signTransaction({
        from: account.address,
        to: safeProxyFactoryAddress,
        data: createProxyData,
        gas: 1000000
    });

    const createProxyTx = await web3Instance.web3Instance.eth.sendSignedTransaction(signedTx.rawTransaction);

    let proxyAddress = "";
    for (let logEntry of createProxyTx.logs) {
        if (logEntry.address?.toLowerCase() !== safeProxyFactoryAddress.toLowerCase()) {
            continue;
        }

        const proxyCreatedEvent = web3Instance.web3Instance.eth.abi.decodeLog(
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


module.exports = {
    createSafe
}