const { ethers } = require('hardhat')
const fs = require('fs')

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log('deployer:', deployer.address)
  const factory = await ethers.getContractFactory('CoffeePortal')
  const coffee = await factory.deploy({ value: ethers.parseEther('0.2') })
  await coffee.waitForDeployment()
  console.log('coffee address:', coffee.target)
  fs.writeFileSync('./config.js', `export const contractAddress="${coffee.target}"`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(-1)
  })
