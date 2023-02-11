const {addressCollection} = require("../lib/addressCollection");
var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer) {
  addressCollection.migrationsContract = deployer.deploy(Migrations).then(result => result.address);
};
