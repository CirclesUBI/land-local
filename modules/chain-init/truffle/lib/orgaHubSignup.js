const hub = require('../build/contracts/Hub.json');
const { web3Instance } = require('./web3instance');

const orgaHubSignup = async function (safe, hubContractAddress) {
	const hubAbi = hub.abi;
	const hubInstance = new web3Instance.eth.Contract(hubAbi, hubContractAddress);

	const signupCallData = hubInstance.methods.organizationSignup().encodeABI();

	const safeTransactionData = {
		to: hubContractAddress,
		value: '0',
		data: signupCallData,

		gas: 1000000,
		gasLimit: 1000000,
		gasPrice: 20000
	};

	console.log('🧪 Trying to Sign Organization up on the HUB Contract for address:', safe.getAddress());

	// const safeTransaction = await safe.createTransaction(safeTransactionData);
	// const executeTxResponse = await safe.executeTransaction(safeTransaction);
	// await executeTxResponse.transactionResponse?.wait();

	let safeTransaction;
	safe
		.createTransaction({ safeTransactionData })
		.then(async (tx) => {
			safeTransaction = tx;
			safe
				.executeTransaction(safeTransaction)
				// .wait()
				.then((executeTxResponse) => {
					console.log('✅ ✅ OrgaSafe Hub Signup Succeded. Transaction:', executeTxResponse);
					return safe;
				})
				.catch((err) => {
					console.log('🚨 🚨 ERROR ORGA HUBSIGNUP: ', err);
				});
		})
		.catch((err) => {
			console.log('🚨 🚨 ERROR ORGA TRANSACTION: ', err);
		});
};

module.exports = {
	orgaHubSignup: orgaHubSignup
};
