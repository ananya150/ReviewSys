require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/avJWxX8rmS-XY-ciDysNbpozMjImZqQH`,
      accounts: ['4d26055b475d156786de76847f003d69b25eedade1477fcaf8fd16aff95bdf5b']
    }
  }
};