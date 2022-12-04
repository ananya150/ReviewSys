const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const ByteHasher = await hre.ethers.getContractFactory("ByteHasher");
  const byteHasher = await ByteHasher.deploy()
  await byteHasher.deployed();

  const ReviewSys = await hre.ethers.getContractFactory("ReviewSys");
  const review = await ReviewSys.deploy('0x8f55D884CAD66B79e1a131f6bCB0e66f4fD84d5B','0xd81de4bcef43840a2883e5730d014630ea6b7c4a')

  await review.deployed();

  console.log(
    `Contract deployed to ${review.address}`
  );
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });