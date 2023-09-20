const hub = require("../build/contracts/Hub.json");
const { web3Instance } = require("./web3instance");

const hubSignup = async function (safe, hubContractAddress) {
  const hubAbi = hub.abi;
  const hubInstance = new web3Instance.eth.Contract(hubAbi, hubContractAddress);

  const signupCallData = hubInstance.methods.signup().encodeABI();

  const safeTransactionData = {
    to: hubContractAddress,
    value: "0",
    data: signupCallData,
  };

  let safeTransaction;
  safe
    .createTransaction({ safeTransactionData })
    .then(async (tx) => {
      safeTransaction = tx;
      const executeTxResponse = await safe.executeTransaction(safeTransaction);
      console.log(
        `HubSignup for: ${safe.getAddress()}: TxHash: ${executeTxResponse.hash}`
      );
      return safe;
    })
    .catch((err) => {
      console.log("🚨🚨 ERROR HUBSIGNUP: ", err);
    });
};

module.exports = {
  hubSignup,
};
