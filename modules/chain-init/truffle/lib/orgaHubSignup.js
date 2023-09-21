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
    safeTxGas: 500000,
    gas: 10000000,
    gasLimit: 10000000,
    gasPrice: 20000,
  };

  console.log(
    "🧪 Trying to Sign Organization up on the HUB Contract for address:",
    safe.getAddress()
  );
  let safeTransaction;
  safe
    .createTransaction({ safeTransactionData })
    .then(async (tx) => {
      safeTransaction = tx;
      safe
        .executeTransaction(safeTransaction)
        .then((executeTxResponse) => {
          console.log(
            "✅ ✅ OrgaSafe Hub Signup Succeded. Transaction:",
            executeTxResponse
          );
          return safe;
        })
        .catch((err) => {
          console.log("🚨 🚨 ERROR ORGA HUBSIGNUP: ", err);
        });
    })
    .catch((err) => {
      console.log("🚨 🚨 ERROR ORGA TRANSACTION: ", err);
    });
};

module.exports = {
  orgaHubSignup: orgaHubSignup,
};
