const Hub = artifacts.require("./Hub.sol");
const { convertToBaseUnit } = require("../lib/math");
const { addressCollection } = require("../lib/addressCollection");

module.exports = async function (deployer) {
  console.log("Deploying Hub Contract...");

  await deployer
    .deploy(
      Hub,
      107,
      31556952,
      "CRC",
      "Circles",
      convertToBaseUnit(50),
      "92592592592592",
      "7776000"
    )
    .then((result) => {
      addressCollection.hubContract = result.address.toLowerCase();
      console.log("Hub contract address is:", result.address.toLowerCase());
    })
    .catch((error) => {
      console.log("ERROR Deploying Hub Contract: ", error);
    });
};
