// import { PRIVATE_KEY_1, SAFE_ADDRESS_ORGANIZATION } from "../config";
import Web3 from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";
import Safe, {
  SafeFactory,
  SafeAccountConfig,
  EthersAdapter,
} from "@safe-global/protocol-kit";

import { ethers } from "ethers";
import { CirclesSdkEthersFactory } from "@ingocollatz/sdk-ethers-adapter";
import addresses from "/app/status/addresses.temp.json";

const safeProxyFactoryArtifacts = require("../truffle/build/contracts/GnosisSafeProxyFactory.json");
const safeArtifacts = require("../truffle/build/contracts/GnosisSafe.json");
const multiSendArtifacts = require("../truffle/build/contracts/MultiSend.json");
const proxyArtifacts = require("../truffle/build/contracts/GnosisSafeProxy.json");
const compatibilityFallbackHandler = require("../truffle/build/contracts/CompatibilityFallbackHandler.json");
const multiSendCallOnlyArtifacts = require("../truffle/build/contracts/MultiSendCallOnly.json");

const rpc_url: string = "http://nethermind:8545";
const default_owner_address: string =
  "0x85a88313b37676ef7F846E00287090E75931E44B";

(async (): Promise<void> => {
  // Ethers
  const provider = new ethers.providers.JsonRpcProvider(rpc_url);

  const safeOwner = provider.getSigner(0);

  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: safeOwner,
  });

  const chainId = await ethAdapter.getChainId();

  const contractNetworks = {
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
      signMessageLibAddress: "",
      createCallAddress: "",
      simulateTxAccessorAddress: "",
    },
  };

  const safeFactory = await SafeFactory.create({
    ethAdapter,
    contractNetworks,
  });

  const owners = [default_owner_address];
  const threshold = 1;
  const safeAccountConfig: SafeAccountConfig = {
    owners,
    threshold,
  };

  const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig });

  const newSafeAddress = await safeSdk.getAddress();

  const signerAddress = new ethers.Wallet(default_owner_address, provider);

  const circlesSdk = await CirclesSdkEthersFactory.withExistingSafe(
    ethers,
    signerAddress,
    newSafeAddress
  );

  await circlesSdk.signupOrganization();
})();
