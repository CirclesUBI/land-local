const {sendFunds} = require("../lib/sendFunds");
const Web3 = require("web3");
const {getSafeFactory} = require("../lib/getSafeFactory");
const {defaultOwnerAccount} = require("../lib/defaultOwnerAccount");

module.exports = async function (deployer, network, accounts) {
    const safeFactory = await getSafeFactory();

    const profileSafe = await safeFactory.deploySafe({
        safeAccountConfig: {
            owners: [defaultOwnerAccount.address],
            threshold: 1
        }
    });
    console.log("safe1Address:", profileSafe.getAddress());

    const orgaSafe = await safeFactory.deploySafe({
        safeAccountConfig: {
            owners: [defaultOwnerAccount.address],
            threshold: 1
        }
    });
    console.log("safe2Address:", orgaSafe.getAddress());

    const invitationFundsSafe = await safeFactory.deploySafe({
        safeAccountConfig: {
            owners: [defaultOwnerAccount.address],
            threshold: 1
        }
    });
    console.log("invitationFundsAddress:", invitationFundsSafe.getAddress());

    console.log("Sending 100 Eth invitation funds to:", invitationFundsSafe.getAddress());
    await sendFunds(new Web3.utils.BN("10000000000000000000"), invitationFundsSafe.getAddress());
}