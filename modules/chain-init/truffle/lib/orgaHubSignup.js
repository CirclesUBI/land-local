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

  const safeTransaction = await safe.createTransaction({ safeTransactionData });
  const executeTxResponse = await safe.executeTransaction(safeTransaction);
  console.log("executeTxResponse:", executeTxResponse);
  console.log(`OrganizationSignup for: ${safe.getAddress()}`);
};

module.exports = {
  orgaHubSignup: orgaHubSignup,
};
