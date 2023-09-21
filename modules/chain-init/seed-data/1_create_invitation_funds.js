const { sendFunds } = require("../truffle/lib/sendFunds");
const Web3 = require("web3");
const { getSafeFactory } = require("../truffle/lib/getSafeFactory");
const { orgaHubSignup } = require("../truffle/lib/orgaHubSignup");
const { defaultOwnerAccount } = require("../truffle/lib/defaultOwnerAccount");

module.exports = async function (addresses) {
  const safeFactory = await getSafeFactory(addresses);

  const profileSafe = await safeFactory.deploySafe({
    safeAccountConfig: {
      owners: [defaultOwnerAccount.address],
      threshold: 1,
    },
  });

  addresses.rootSafeContract = profileSafe.getAddress().toLowerCase();

  let orgaSafe;
  safeFactory
    .deploySafe({
      safeAccountConfig: {
        owners: [defaultOwnerAccount.address],
        threshold: 1,
        safeTxGas: 10000000,
        gas: 9000000,
      },
    })
    .then(async (safe) => {
      orgaSafe = safe;
      addresses.operatorOrgaSafeContract = orgaSafe.getAddress().toLowerCase();

      orgaHubSignup(orgaSafe, addresses.hubContract)
        .then(async () => {
          console.log("✅ ✅ OrgaSafe created:", orgaSafe.getAddress());

          const invitationFundsSafe = await safeFactory.deploySafe({
            safeAccountConfig: {
              owners: [defaultOwnerAccount.address],
              threshold: 1,
            },
          });
          addresses.invitationFundsSafeContract = invitationFundsSafe
            .getAddress()
            .toLowerCase();

          console.log(
            "Sending 100 Eth invitation funds to:",
            invitationFundsSafe.getAddress()
          );

          await sendFunds(
            new Web3.utils.BN("10000000000000000000"),
            invitationFundsSafe.getAddress()
          );
        })
        .catch((err) => {
          console.log("🚨🚨 ERROR ORGASAFE HUB SIGNUP FAILED: ", err);
        });
      console.log("ADDRESSES:", JSON.stringify(addresses, null, 2));
    })
    .catch((err) => {
      console.log("🚨🚨 ERROR ORGASAFE CREATION: ", err);
    });
};
