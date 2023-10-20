const { ethers } = require('hardhat')
const fs = require('fs')
require('dotenv').config()
async function main() {
  const factory = await ethers.getContractFactory('Comments')
  const contract = await factory.deploy()
  await contract.waitForDeployment()
  console.log('comment:', contract.target)
  fs.appendFileSync('./com_config.js', `const comment_address=${contract.target}`)
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.log(error)
    process.exit(-1)
  })
