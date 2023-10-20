require('dotenv').config()
const { ethers } = require('hardhat')
const fs = require('fs')

async function main() {
  const VRFAddress = process.env.VRFaddress
  console.log('vrf', VRFAddress)
  const KEYHash = process.env.KEY_HASH
  const SubID = process.env.SUBSCRIPTION_ID
  const gasLImit = process.env.gasLimit

  const hogwartsFactory = await ethers.getContractFactory('HogwartsNFT')
  const hogwartsContract = await hogwartsFactory.deploy()
  await hogwartsContract.waitForDeployment()
  console.log('HogwartsAddress:', hogwartsContract.target)
  fs.appendFileSync(
    './config.js',
    `\nexport const hogwartsNFTContractAddress="${hogwartsContract.target}"`
  )

  const randomFactory = await ethers.getContractFactory('RandomHouseAssignment')
  const randomContract = await randomFactory.deploy(
    hogwartsContract.target,
    VRFAddress,
    SubID,
    KEYHash
  )
  await randomContract.waitForDeployment()
  console.log('randomAddress:', randomContract.target)
  fs.appendFileSync(
    './config.js',
    `\nexport const randomContractAddress="${randomContract.target}"`
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error)
    process.exit(-1)
  })
