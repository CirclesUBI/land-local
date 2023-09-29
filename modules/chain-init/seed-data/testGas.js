const Hub = artifacts.require("./Hub.sol");

module.exports = function (callback) {
  Hub.web3.eth.getGasPrice(function (error, result) {
    var gasPrice = Number(result);
    console.log("Gas Price is " + gasPrice + " wei"); // "10000000000000"

    var HubContract = web3.eth.contract(Hub._json.abi);
    var contractData = HubContract.new.getData({
      data: Hub._json.bytecode,
    });
    var gas = Number(web3.eth.estimateGas({ data: contractData }));

    console.log("gas estimation = " + gas + " units");
    console.log("gas cost estimation = " + gas * gasPrice + " wei");
    console.log(
      "gas cost estimation = " +
        Hub.web3.fromWei(gas * gasPrice, "ether") +
        " ether"
    );
  });
};
