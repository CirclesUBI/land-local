const {defaultOwnerAccount} = require("../lib/defaultOwnerAccount");
const {hubSignup} = require("../lib/hubSignup");
const {addressCollection} = require("../lib/addressCollection");
const {getSafeFactory} = require("../lib/getSafeFactory");

const otherSafes = [];

module.exports = async function (deployer, network, accounts) {
    const safeFactory = await getSafeFactory();

    for (let i = 0; i < 10; i++) {
        const newSafe = await safeFactory.deploySafe({
            safeAccountConfig: {
                owners: [defaultOwnerAccount.address],
                threshold: 1
            }
        });

        await hubSignup(newSafe, addressCollection.hubContract);

        otherSafes.push(newSafe.getAddress());
    }

    console.log("Created other safes:")
    console.log(otherSafes);
}