const {sendFunds} = require("../truffle/lib/sendFunds");
const Web3 = require("web3");
const {getSafeFactory} = require("../truffle/lib/getSafeFactory");
const {orgaHubSignup} = require("../truffle/lib/orgaHubSignup");
const {defaultOwnerAccount} = require("../truffle/lib/defaultOwnerAccount");

module.exports = async function (addresses) {
    const safeFactory = await getSafeFactory(addresses);

    const profileSafe = await safeFactory.deploySafe({
        safeAccountConfig: {
            owners: [defaultOwnerAccount.address],
            threshold: 1
        }
    });
    addresses.rootSafeContract = profileSafe.getAddress();

    const orgaSafe = await safeFactory.deploySafe({
        safeAccountConfig: {
            owners: [defaultOwnerAccount.address],
            threshold: 1
        }
    });
    addresses.operatorOrgaSafeContract = orgaSafe.getAddress();

    await orgaHubSignup(orgaSafe, addresses.hubContract);

    const invitationFundsSafe = await safeFactory.deploySafe({
        safeAccountConfig: {
            owners: [defaultOwnerAccount.address],
            threshold: 1
        }
    });
    addresses.invitationFundsSafeContract = invitationFundsSafe.getAddress();

    console.log("Sending 100 Eth invitation funds to:", invitationFundsSafe.getAddress());
    await sendFunds(new Web3.utils.BN("10000000000000000000"), invitationFundsSafe.getAddress());
}
