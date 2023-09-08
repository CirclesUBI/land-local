const _1 = require("./1_create_invitation_funds");
const _2 = require("./2_create_other_safes");
const addresses = require("/app/status/addresses.temp.json");

console.log("ADDRESSES:", JSON.stringify(addresses, null, 2));

new Promise((resolve) => setTimeout(resolve, 2))
  .then(() =>
    _1(addresses)
      .then(() => _2(addresses))
      .then(() => console.log("Done"))
      .then(() => process.exit(0))
  )
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

process.stdin.resume();
