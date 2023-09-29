const { sendFunds } = require('../truffle/lib/sendFunds');
// @ts-ignore
const Web3 = require('web3');
const { getSafeFactory } = require('../truffle/lib/getSafeFactory');
const { orgaHubSignup } = require('../truffle/lib/orgaHubSignup');
const { defaultOwnerAccount } = require('../truffle/lib/defaultOwnerAccount');

// @ts-ignore
module.exports = async function (addresses) {
	const safeFactory = await getSafeFactory(addresses);

	const profileSafe = await safeFactory.deploySafe({
		safeAccountConfig: {
			owners: [defaultOwnerAccount.address],
			threshold: 1
		}
	});

	addresses.rootSafeContract = profileSafe.getAddress().toLowerCase();

	// @ts-ignore
	let orgaSafe;
	safeFactory
		.deploySafe({
			safeAccountConfig: {
				owners: [defaultOwnerAccount.address],
				threshold: 1,
				gas: 1000000,
				gasLimit: 1000000,
				gasPrice: 20000
			}
		})
		// @ts-ignore
		.then(async (safe) => {
			orgaSafe = safe;
			addresses.operatorOrgaSafeContract = orgaSafe.getAddress().toLowerCase();

			orgaHubSignup(orgaSafe, addresses.hubContract)
				.then(async () => {
					// @ts-ignore
					console.log('✅ ✅ OrgaSafe created:', orgaSafe.getAddress());

					const invitationFundsSafe = await safeFactory.deploySafe({
						safeAccountConfig: {
							owners: [defaultOwnerAccount.address],
							threshold: 1
						}
					});
					addresses.invitationFundsSafeContract = invitationFundsSafe.getAddress().toLowerCase();

					console.log('Sending 100 Eth invitation funds to:', invitationFundsSafe.getAddress());

					await sendFunds(new Web3.utils.BN('10000000000000000000'), invitationFundsSafe.getAddress());
				})
				.catch((err) => {
					console.log('🚨🚨 ERROR ORGASAFE HUB SIGNUP FAILED: ', err);
				});
			console.log('ADDRESSES:', JSON.stringify(addresses, null, 2));
		})
		// @ts-ignore
		.catch((err) => {
			console.log('🚨🚨 ERROR ORGASAFE CREATION: ', err);
		});
};
