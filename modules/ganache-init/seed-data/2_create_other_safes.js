const {hubSignup} = require("../truffle/lib/hubSignup");
const {orgaHubSignup} = require("../truffle/lib/orgaHubSignup");
const {getSafeFactory} = require("../truffle/lib/getSafeFactory");
const {defaultOwnerAccount} = require("../truffle/lib/defaultOwnerAccount");
const {trust} = require("../truffle/lib/trust");
const {mulberry32} = require("../truffle/lib/mulberry32");
const util = require("util");
const fs = require("fs");

const limitPrng = mulberry32(947827498428023092);
const trustChoicePrng = mulberry32(48739087829012);

function createEdges(nodeIds) {
    let edges = [];
    for (let i = 0; i < nodeIds.length; i++) {
        for (let j = i + 1; j < nodeIds.length; j++) {
            if (trustChoicePrng() < 0.5) {
                edges.push([nodeIds[i], nodeIds[j]]);
            }
        }
    }
    return edges;
}

module.exports = async function (addresses) {
    const safeFactory = await getSafeFactory(addresses);
    addresses.otherSafes = {};
    addresses.otherOrgaSafes = {};

    for (let i = 0; i < 10; i++) {
        const newSafe = await safeFactory.deploySafe({
            safeAccountConfig: {
                owners: [defaultOwnerAccount.address],
                threshold: 1
            }
        });

        if (i % 2 === 0) {
            console.log(`Signing up ${newSafe.getAddress()} as person at the hub ${addresses.hubContract} ..`);
            await hubSignup(newSafe, addresses.hubContract);
            addresses.otherSafes[newSafe.getAddress()] = newSafe;
        } else {
            console.log(`Signing up ${newSafe.getAddress()} as organization at the hub ${addresses.hubContract} ..`);
            await orgaHubSignup(newSafe, addresses.hubContract);
            addresses.otherOrgaSafes[newSafe.getAddress()] = newSafe;
        }
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const trustEdges = createEdges(Object.keys(addresses.otherSafes));
    const trusted = {};

    for (let i = 0; i < trustEdges.length; i++) {
        const edge = trustEdges[i];
        const userSafe = addresses.otherSafes[edge[0]];
        const canSendToSafe = addresses.otherSafes[edge[1]];

        if (trusted[edge[0]] && trusted[edge[0]].indexOf(edge[1]) >= 0) {
            continue;
        }

        const limit = Math.round(50 + limitPrng() * 50);
        await trust(canSendToSafe, addresses.hubContract, userSafe.getAddress(), limit);

        if (!trusted[edge[0]]) {
            trusted[edge[0]] = [edge[1]];
        } else {
            trusted[edge[0]].push(edge[1]);
        }

        await new Promise(resolve => setTimeout(resolve, 500));
    }

    for (let i = 0; i < Object.keys(addresses.otherOrgaSafes).length; i++) {
        const orgaSafe = addresses.otherOrgaSafes[Object.keys(addresses.otherOrgaSafes)[i]];

        console.log(`Orga safe ${orgaSafe.getAddress()} trusts all other safes ..`);

        for (let j = 0; j < Object.keys(addresses.otherSafes).length; j++) {
            const userSafe = addresses.otherSafes[Object.keys(addresses.otherSafes)[j]];
            await trust(orgaSafe, addresses.hubContract, userSafe.getAddress(), 100);
        }
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    addresses.otherSafes = Object.keys(addresses.otherSafes).reduce((acc, key) => {
        acc.push(key);
        return acc;
    }, []);

    addresses.otherOrgaSafes = Object.keys(addresses.otherOrgaSafes).reduce((acc, key) => {
        acc.push(key);
        return acc;
    }, []);

    const writeFile = util.promisify(fs.writeFile);
    await writeFile('/app/status/addresses.json', JSON.stringify(addresses, null, 2));
}
