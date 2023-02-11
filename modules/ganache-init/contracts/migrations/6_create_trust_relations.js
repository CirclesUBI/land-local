const {addressCollection} = require("../lib/addressCollection");
const {trust} = require("../lib/trust");
const {mulberry32} = require("../lib/mulberry32");

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

module.exports = async function (deployer, network, accounts) {
    const trustEdges = createEdges(Object.keys(addressCollection.otherSafes), 1);
    const trusted = {};

    for (let i = 0; i < trustEdges.length; i++) {
        const edge = trustEdges[i];
        const userSafe = addressCollection.otherSafes[edge[0]];
        const canSendToSafe = addressCollection.otherSafes[edge[1]];

        if (trusted[edge[0]] && trusted[edge[0]].indexOf(edge[1]) >= 0) {
            continue;
        }

        const limit = Math.round(50 + limitPrng() * 50);
        await trust(canSendToSafe, addressCollection.hubContract, userSafe.getAddress(), limit);

        if (!trusted[edge[0]]) {
            trusted[edge[0]] = [edge[1]];
        } else {
            trusted[edge[0]].push(edge[1]);
        }
    }
}
