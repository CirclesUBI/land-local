const Web3 = require("web3");

let addr = "http://ganache:8545";
try {
    const addresses = require("/app/status/addresses.temp.json");
    addr = `http://${addresses.network.host}:${addresses.network.port}`;
} catch (e) {
    console.log("No /app/status/addresses.temp.json found, using default rpc url");
}
const web3Provider = new Web3.providers.HttpProvider(addr);
const web3Instance = new Web3(web3Provider);

module.exports = {
    web3Instance
}
