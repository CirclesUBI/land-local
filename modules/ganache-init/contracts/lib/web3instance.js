const Web3 = require("web3");
const web3Provider = new Web3.providers.HttpProvider('http://ganache:8545');
const web3Instance = new Web3(web3Provider);

module.exports = {
    web3Instance
}