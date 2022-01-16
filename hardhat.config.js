require("@nomiclabs/hardhat-waffle");
/**
 * @type import('hardhat/config').HardhatUserConfig
 * 
 * 
 */
const ROPSTEN_PRIVATE_KEY = ``;
const ALCHEMY_KEY = ``;

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.7.5",
      },
      {
        version: ">=0.6.0 <0.8.0",
      },
    ],
  },
  networks: {
    // hardhat: {
    //   forking: {
    //     url: "https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_KEY}",
    //     blockNumber: 13983192,
    //   },
    // },
    ropsten: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_KEY}`,
      accounts: [`${ROPSTEN_PRIVATE_KEY}`],
    },
  },
};


