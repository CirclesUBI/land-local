let keythereum = require("keythereum");

let address = "0x85a88313b37676ef7F846E00287090E75931E44B";
let datadir = "../modes/from-source/.state/nethermind/data";

// Synchronous
let keyObject = keythereum.importFromFile(address, datadir);

// Asynchronous
keythereum.importFromFile(address, datadir, function (keyObject) {
  console.log(keyObject);
  let privateKey = keythereum.recover("password", keyObject); //this takes a few seconds to finish

  console.log("PrivateKey:", privateKey.toString("hex"));
});

// // let { Web3 } = require("web3");
// let { keythereum } = require("keythereum");
// let { fetch } = require("node-fetch");
// // let addr = "http://localhost:8547";
// // let provider = new Web3.providers.HttpProvider(addr);

// // let web3Instance = new Web3(provider);

// // const newAccount = web3Instance.eth.accounts.create();

// // console.log(newAccount);

// // module.exports = {
// //   web3Instance,
// // };

// const url = "http://nethermind:8545";

// const keystorePath = "../../../modes/from-source/.state/nethermind/data";

// const options = {
//   method: "POST",
//   body: JSON.stringify({
//     method: "personal_newAccount",
//     params: ["test"],
//     id: 1,
//     jsonrpc: "2.0",
//   }),
//   headers: {
//     "Content-Type": "application/json",
//   },
// };

// getDefaultOwnerAccount = async () => {
//   const account = await fetch(url, options).then((res) => res.json());
//   console.log("ACCOUNT:", account);
//   const defaultOwnerAccount = await keythereum.importFromFile(
//     account.result,
//     keystorePath
//   );

//   const privateKey = await keythereum.recover("test", defaultOwnerAccount);

//   const defaultKey = privateKey.toString("hex");

//   return {
//     defaultOwnerAccount,
//     defaultKey,
//   };
// };

// getDefaultOwnerAccount();

// module.exports = {
//   getDefaultOwnerAccount,
// };
