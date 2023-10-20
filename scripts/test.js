require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  const factory = await ethers.getContractFactory("WorldCupLotter");
  const contract = await factory.deploy();
  await contract.waitForDeployment();
}
main();
