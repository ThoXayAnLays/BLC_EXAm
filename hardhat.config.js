require("@nomicfoundation/hardhat-toolbox");

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    lineaSepolia: {
      url: `https://linea-sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    },
    bscTest: {
      url:`https://bsc-testnet.public.blastapi.io`,
      accounts: [`0x${process.env.PRIVATE_KEY}`],
      chainId: 97,
      gasPrice: 20000000000
    }
  },
};
