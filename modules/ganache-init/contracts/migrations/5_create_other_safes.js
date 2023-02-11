const {defaultOwnerAccount, defaultKey} = require("../lib/defaultOwnerAccount");
const {hubSignup} = require("../lib/hubSignup");
const {addressCollection} = require("../lib/addressCollection");
const {getSafeFactory} = require("../lib/getSafeFactory");

module.exports = async function (deployer, network, accounts) {
    const safeFactory = await getSafeFactory();

    for (let i = 0; i < 10; i++) {
        const newSafe = await safeFactory.deploySafe({
            safeAccountConfig: {
                owners: [defaultOwnerAccount.address],
                threshold: 1
            }
        });

        addressCollection.otherSafes[newSafe.getAddress()] = newSafe;

        console.log(`Signing up ${newSafe} at hub ${addressCollection.hubContract} ..`)
        await hubSignup(newSafe, addressCollection.hubContract);
    }

    console.log(`addressCollection:`);
    console.log(JSON.stringify(addressCollection, null, 2));

    console.log(`
CONTRACT_ADDRESS_CIRCLES_HUB=${addressCollection.hubContract.toLowerCase()}
CONTRACT_ADDRESS_SAFE_PROXY_FACTORY=${addressCollection.proxyFactoryContract.toLowerCase()}
CONTRACT_ADDRESS_MASTER_SAFE_COPY=${addressCollection.masterSafeContract.toLowerCase()}
API_DATA_INITIAL_USER_SAFE_ADDRESS=${addressCollection.rootSafeContract.toLowerCase()}
API_DATA_INITIAL_USER_SAFE_OWNER_ADDRESS=${addressCollection.defaultOwnerAccount.toLowerCase()}
API_DATA_INITIAL_ORG_SAFE_ADDRESS=${addressCollection.operatorOrgaSafeContract.toLowerCase()}
API_DATA_INITIAL_ORG_SAFE_OWNER_ADDRESS=${addressCollection.defaultOwnerAccount.toLowerCase()}
API_SERVER_INVITATION_FUNDS_SAFE_ADDRESS=${addressCollection.invitationFundsSafeContract.toLowerCase()}
API_SERVER_INVITATION_FUNDS_SAFE_KEY=${defaultKey}
API_SERVER_OPERATOR_ORGANISATION_ADDRESS=${addressCollection.operatorOrgaSafeContract.toLowerCase()}
OTHER_BLOCKCHAIN_USER_TO_ADDRESS=${addressCollection.defaultOwnerAccount.toLowerCase()}
OTHER_BLOCKCHAIN_PRIVATE_KEY=${defaultKey}
`);
}
