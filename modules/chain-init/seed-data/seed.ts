import { SafeFactory, SafeAccountConfig, Web3Adapter } from '@safe-global/protocol-kit';
import type { Web3TransactionOptions } from '@safe-global/protocol-kit';
import HDWalletProvider from '@truffle/hdwallet-provider';
import generateContractNetworks from './lib/contractNetworks';
import addresses from '/app/status/addresses.json';

import Web3 from 'web3';

const rpc_url: string = 'http://nethermind:8545';

(async (): Promise<void> => {
	const provider = new HDWalletProvider({
		privateKeys: [addresses.defaultOwnerAccount.privateKey],
		providerOrUrl: rpc_url
	});

	const safeSigner = provider.getAddress();

	const web3 = new Web3();
	web3.setProvider(<any>provider);

	// const provider = new Web3.providers.HttpProvider(rpc_url);
	// const web3 = new Web3(provider);
	// const signer = addresses.defaultOwnerAccount.address;

	const ethAdapter = new Web3Adapter({
		web3,
		signerAddress: safeSigner
	});

	const chainId = await ethAdapter.getChainId();
	const contractNetworks = generateContractNetworks(chainId);

	const safeFactory = await SafeFactory.create({
		ethAdapter,
		contractNetworks,
		isL1SafeMasterCopy: true
	});

	const owners = [safeSigner];
	const threshold = 1;
	const safeAccountConfig: SafeAccountConfig = {
		owners,
		threshold
	};

	// const options: Web3TransactionOptions = {
	// 	// from, // Optional
	// 	gas: 600000, // Optional
	// 	// gasPrice, // Optional
	// 	maxFeePerGas: 1 // Optional
	// 	// maxPriorityFeePerGas // Optional
	// 	// nonce // Optional
	// };

	const callback = (txHash: string): void => {
		console.log({ txHash });
	};

	try {
		const safeSdk = await safeFactory.deploySafe({ safeAccountConfig, callback });
	} catch (error) {
		console.error('Error deploying safe:', error);
	}
})();
