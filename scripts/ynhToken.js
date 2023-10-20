const { ethers } = require('hardhat')

async function main() {
  const factory = await ethers.getContractFactory('YNHToken')
  const contract = await factory.deploy()
  await contract.waitForDeployment()
  console.log('address', contract.target)
}

main()
