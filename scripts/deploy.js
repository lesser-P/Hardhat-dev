const hre = require('hardhat')
const fs = require('fs')

async function main() {
  const factory = await hre.ethers.getContractFactory('Blog')
  const blog = await factory.deploy('YNH')
  await blog.waitForDeployment()
  console.log('Blog deployed to:', blog.target)

  fs.appendFile('./config.js', `export const contractAddress="${blog.target}"`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(-1)
  })
