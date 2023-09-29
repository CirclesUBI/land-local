const safeProxyFactoryArtifacts = require('../../truffle/build/contracts/GnosisSafeProxyFactory.json');
const safeArtifacts = require('../../truffle/build/contracts/GnosisSafe.json');
const multiSendArtifacts = require('../../truffle/build/contracts/MultiSend.json');
const proxyArtifacts = require('../../truffle/build/contracts/GnosisSafeProxy.json');
const compatibilityFallbackHandler = require('../../truffle/build/contracts/CompatibilityFallbackHandler.json');
const multiSendCallOnlyArtifacts = require('../../truffle/build/contracts/MultiSendCallOnly.json');
import addresses from '/app/status/addresses.json';

const generateContractNetworks = (chainId: number) => {
	return {
		[chainId]: {
			multiSendAddress: addresses.multiSendContract,
			multiSendAbi: multiSendArtifacts.abi,
			safeMasterCopyAddress: addresses.masterSafeContract,
			safeMasterCopyAbi: safeArtifacts.abi,
			safeProxyFactoryAddress: addresses.proxyFactoryContract,
			safeProxyFactoryAbi: safeProxyFactoryArtifacts.abi,
			safeProxyAddress: addresses.safeProxyContract,
			safeProxyAbi: proxyArtifacts.abi,
			fallbackHandlerAddress: addresses.compatibilityFallbackHandlerContract,
			fallbackHandlerAbi: compatibilityFallbackHandler.abi,
			multiSendCallOnlyAddress: addresses.multiSendCallOnlyContract,
			multiSendCallOnlyAbi: multiSendCallOnlyArtifacts.abi,
			signMessageLibAddress: '',
			createCallAddress: '',
			simulateTxAccessorAddress: ''
		}
	};
};

export default generateContractNetworks;
