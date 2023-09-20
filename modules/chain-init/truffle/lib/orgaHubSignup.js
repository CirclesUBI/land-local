const hub = require("../build/contracts/Hub.json");
const { web3Instance } = require("./web3instance");

const orgaHubSignup = async function (safe, hubContractAddress) {
  const hubAbi = hub.abi;
  const hubInstance = new web3Instance.eth.Contract(hubAbi, hubContractAddress);

  const signupCallData = hubInstance.methods.organizationSignup().encodeABI();

  const safeTransactionData = {
    to: hubContractAddress,
    value: "0",
    data: signupCallData,
  };

  console.log("🚀  orgaHubSignup ~ safe:", safe.getAddress());

  let safeTransaction;
  safe
    .createTransaction({ safeTransactionData })
    .then(async (tx) => {
      safeTransaction = tx;
      const executeTxResponse = await safe.executeTransaction(safeTransaction);
      console.log("executeTxResponse:", executeTxResponse);
      console.log(`OrganizationSignup for: ${safe.getAddress()}`);
      return safe;
    })
    .catch((err) => {
      console.log("🚨🚨 ERROR ORGA HUBSIGNUP: ", err);
    });
};

module.exports = {
  orgaHubSignup: orgaHubSignup,
};
