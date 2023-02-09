const {createSafe} = require("../lib/createSafe");
const {sendFunds} = require("../lib/sendFunds");
const Web3 = require("web3");

module.exports = async function (deployer, network, accounts) {
    const profileSafeAddress = await createSafe();
    console.log("safe1Address:", profileSafeAddress);

    const orgaSafeAddress = await createSafe();
    console.log("safe2Address:", orgaSafeAddress);

    const invitationFundsAddress = await createSafe();
    console.log("invitationFundsAddress:", invitationFundsAddress);

    console.log("Sending 100 Eth invitation funds to:", invitationFundsAddress);
    await sendFunds(new Web3.utils.BN("10000000000000000000"), invitationFundsAddress);
}