const { addressCollection } = require("../lib/addressCollection");
var Migrations = artifacts.require("../contracts/Migrations.sol");

module.exports = async function (deployer) {
  addressCollection.migrationsContract = await deployer
    .deploy(Migrations)
    .then((result) => result.address.toLowerCase());
};
