const { hubSignup } = require("../truffle/lib/hubSignup");
const { orgaHubSignup } = require("../truffle/lib/orgaHubSignup");
const { getSafeFactory } = require("../truffle/lib/getSafeFactory");
const { defaultOwnerAccount } = require("../truffle/lib/defaultOwnerAccount");

const { trust } = require("../truffle/lib/trust");
const { mulberry32 } = require("../truffle/lib/mulberry32");
const util = require("util");
const fs = require("fs");

const limitPrng = mulberry32(947827498428023092);
const trustChoicePrng = mulberry32(48739087829012);

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

  for (let i = 0; i < 5; i++) {
    console.log("HIER: ", i);
    const callback = (txHash) => {
      console.log({ txHash });
    };

    const safeAccountConfig = {
      owners: [defaultOwnerAccount.address],
      threshold: 1,
    };

    const newSafe = await safeFactory.deploySafe({ safeAccountConfig });

    if (i % 5 === 0) {
      console.log(
        `Signing up ${newSafe
          .getAddress()
          .toLowerCase()} as organization at the hub ${
          addresses.hubContract
        } ..`
      );
      await orgaHubSignup(newSafe, addresses.hubContract);
      addresses.otherOrgaSafes[newSafe.getAddress().toLowerCase()] = newSafe;
    } else {
      console.log(
        `Signing up ${newSafe
          .getAddress()
          .toLowerCase()} as person at the hub ${addresses.hubContract} ..`
      );

      await hubSignup(newSafe, addresses.hubContract);

      addresses.otherSafes[newSafe.getAddress().toLowerCase()] = newSafe;
    }
    console.log("waiting...");
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("...done waiting");
  }
  console.log("DONE Signing up");

  await timeout(500);

  console.log("Creating Edges...");

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

    console.log("Adding Trust for ", userSafe.getAddress().toLowerCase());

    await trust(
      canSendToSafe,
      addresses.hubContract,
      userSafe.getAddress().toLowerCase(),
      limit
    );

    if (!trusted[edge[0]]) {
      trusted[edge[0]] = [edge[1]];
    } else {
      trusted[edge[0]].push(edge[1]);
    }
  }

  for (let i = 0; i < Object.keys(addresses.otherOrgaSafes).length; i++) {
    const orgaSafe =
      addresses.otherOrgaSafes[Object.keys(addresses.otherOrgaSafes)[i]];

    console.log(
      `Orga safe ${orgaSafe
        .getAddress()
        .toLowerCase()} trusts all other safes ..`
    );

    console.log(
      "🚀 ~ file: 2_create_other_safes.js:123 ~ Object.keys(addresses.otherSafes).length:",
      Object.keys(addresses.otherSafes).length
    );

    for (let j = 0; j < Object.keys(addresses.otherSafes).length; j++) {
      const userSafe =
        addresses.otherSafes[Object.keys(addresses.otherSafes)[j]];
      console.log(
        "🚀 ~ file: 2_create_other_safes.js:125 ~ Object.keys(addresses.otherSafes)[j]:",
        Object.keys(addresses.otherSafes)[j]
      );

      console.log(
        "🚀 ~ file: 2_create_other_safes.js:136 ~ orgaSafe:",
        orgaSafe
      );

      console.log(
        "🚀 ~ file: 2_create_other_safes.js:141 ~ userSafe:",
        userSafe
      );
      const limit = Math.round(50 + limitPrng() * 50);

      await trust(
        orgaSafe,
        addresses.hubContract,
        userSafe.getAddress().toLowerCase(),
        limit
      );
      // TODO: see if we get the tx receipt first..
    }
  }

  addresses.otherSafes = Object.keys(addresses.otherSafes).reduce(
    (acc, key) => {
      acc.push(key.toLowerCase());
      return acc;
    },
    []
  );

  addresses.otherOrgaSafes = Object.keys(addresses.otherOrgaSafes).reduce(
    (acc, key) => {
      acc.push(key.toLowerCase());
      return acc;
    },
    []
  );

  console.log("XXXXXXXXXXXXXXXXXXXXXXXXX HERE WE ARE");
  const writeFile = util.promisify(fs.writeFile);
  await writeFile(
    "/app/status/addresses.json",
    JSON.stringify(addresses, null, 2)
  );
};
