const { ethers } = require('hardhat')
require('dotenv').config('')

const vrfAddress = process.env.VRFaddress
const hash = process.env.KEY_HASH
const subId = process.env.SUBSCRIPTION_ID
const gasLImit = process.env.gasLimit

async function main() {
  const factory = await ethers.getContractFactory('Chainlinkdemo')
  const contract = await factory.deploy(vrfAddress, hash, subId, 2, gasLImit, 2)
  await contract.waitForDeployment()

  console.log('addres:', contract.target)

  //   //调用
  //   const tx = await contract.getRandom()
  //   await tx.wait()
  //   console.log('tx', tx)
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.log(error)
    process.exit(-1)
  })
