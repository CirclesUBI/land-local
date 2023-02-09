const {createSafe} = require("../lib/createSafe");
const otherSafes = [];
module.exports = async function (deployer, network, accounts) {
    function hubSignup(address) {

    }

    for (let i = 0; i < 50; i++) {
        const otherSafe = await createSafe();
        hubSignup(otherSafe);
        otherSafes.push(otherSafe);
    }
    console.log("Created other safes:")
    console.log(otherSafes);
}
