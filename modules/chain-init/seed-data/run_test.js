const _1 = require("./1_create_invitation_funds");
const addresses = require("/app/status/addresses.temp.json");
const { getSafeFactory } = require("../truffle/lib/getSafeFactory");

const { defaultOwnerAccount } = require("../truffle/lib/defaultOwnerAccount");
const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");

const hub = require("../truffle/build/contracts/Hub.json");

async function setUpWeb3() {
  let addr = "http://nethermind:8545";

  try {
    addr = `http://${addresses.network.host}:${addresses.network.port}`;

    let provider;
    provider = new HDWalletProvider(defaultOwnerAccount.privateKey, addr);
    const web3Instance = new Web3(provider);

    const safeFactory = await getSafeFactory(addresses);

    return { web3Instance, safeFactory };
  } catch (e) {
    throw e;
  }
}

async function deployOrgasafe(safeFactory) {
  try {
    const orgaSafe = await safeFactory.deploySafe({
      safeAccountConfig: {
        owners: [defaultOwnerAccount.address],
        threshold: 1,
      },
    });

    console.log("✅ ✅ OrgaSafe created:", orgaSafe.getAddress());
    return orgaSafe;
  } catch (e) {
    throw e;
  }
}

async function signOrgaHubSignup(web3Instance, orgaSafe) {
  try {
    const hubAbi = hub.abi;
    const hubInstance = new web3Instance.eth.Contract(
      hubAbi,
      addresses.hubContract
    );

    const signupCallData = hubInstance.methods.organizationSignup().encodeABI();

    const safeTransactionData = {
      to: addresses.hubContract,
      value: "0",
      data: signupCallData,
      safeTxGas: 10000000,
      gas: 9000000,
    };

    console.log(
      `🧪 Trying to Sign Organization with address ${orgaSafe.getAddress()} up on the HUB Contract with address: ${
        addresses.hubContract
      }`
    );
    const safeTransaction = await orgaSafe.createTransaction({
      safeTransactionData,
    });

    console.log(
      "✅ ✅ OrgaSafe Hub Signup Transaction Created Succeded. Transaction:",
      safeTransaction
    );
    return safeTransaction;
  } catch (e) {
    throw e;
  }
}
async function executeOrgaHubSignup(orgaSafe, safeTransaction) {
  try {
    orgaSafe
      .executeTransaction(safeTransaction)
      .then((executeTxResponse) => {
        console.log(
          "✅ ✅ OrgaSafe Hub Signup Transaction Execute Succeded. Transaction Response:",
          executeTxResponse
        );
      })
      .catch((e) => {
        console.error("🚨🚨 ERROR", e);
        throw e;
      });
  } catch (e) {
    throw e;
  }
}

new Promise((resolve) => setTimeout(resolve, 2000))
  .then(async () => {
    const { web3Instance, safeFactory } = await setUpWeb3();

    const orgaSafe = await deployOrgasafe(safeFactory);

    const safeTransaction = await signOrgaHubSignup(web3Instance, orgaSafe);

    await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error("timeout"));
      }, 10000); // wait 10 sec

      executeOrgaHubSignup(orgaSafe, safeTransaction).then((value) => {
        clearTimeout(timeoutId);
        resolve(value);
      });
    });
  })
  .catch((e) => {
    console.error("🚨🚨 ERROR", e);
    process.exit(1);
  });

process.stdin.resume();
