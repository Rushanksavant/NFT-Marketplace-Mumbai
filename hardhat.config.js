/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle")
const dotenv = require("dotenv");
dotenv.config();

// module.exports = {
//   defaultNetwork: "hardhat",
//   networks: {
//     hardhat: {
//       chainId: 1337
//     },

//   },
//   solidity: {
//     version: "0.8.4",
//     settings: {
//       optimizer: {
//         enabled: true,
//         runs: 200
//       }
//     }
//   }
// }
module.exports = {
  defaultNetwork: "hardhat",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      // Alchemy
      url: `https://polygon-mumbai.g.alchemy.com/v2/${process.env.projectid}`,
      accounts: [process.env.KEY]
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${process.env.projectid}`,
      accounts: [process.env.KEY]
    },
  },
  solidity: "0.8.4",
};