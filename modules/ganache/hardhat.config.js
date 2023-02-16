module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 1337,
            loggingEnabled: true,
            accounts: [
                {
                    privateKey: "0x5bc6328efff9fc724aad89edf1356a6ba7bee56368b4b9b47b1f29a5cd6d73c7",
                    balance: "1000000000000000000000000"
                },
                {
                    privateKey: "0x89e62e74143e15eaba362a67f8d71e5371d1268e1769b2613b8483024d17e110",
                    balance: "1000000000000000000000000"
                },
                {
                    privateKey: "0xd0f7cc8f8e7d9e10fbf51d8ac39f390acf52bfa96224fb5cff6b189c1a68f328",
                    balance: "1000000000000000000000000"
                },
                {
                    privateKey: "0x8a49c61f64ed99f8a59a9bd62cd39238f7256beead025b86e25476e329637b93",
                    balance: "1000000000000000000000000"
                }
            ]
        }
    },
    solidity: {
        version: "0.8.4",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    }
};
