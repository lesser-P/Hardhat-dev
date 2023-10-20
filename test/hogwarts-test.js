const { expect } = require('chai')
const { ethers } = require('hardhat')
require('dotenv').config()

const hogNftAbi = require('../artifacts/contracts/HogwartsNFT.sol/HogwartsNFT.json')
const randomAbi = require('../artifacts/contracts/RandomHouseAssignment.sol/RandomHouseAssignment.json')
const addressPort = require('../config')
const rpc = process.env.SEPOLIA_RPC_HTTPS
const private_key = process.env.PRIVATE_KEY

const provider = new ethers.JsonRpcProvider(rpc)
const wallet = new ethers.Wallet(private_key)
const singer = wallet.connect(provider)
const nftContract = new ethers.Contract(
  addressPort.hogwartsNFTContractAddress,
  hogNftAbi.abi,
  singer
)
const randomContract = new ethers.Contract(addressPort.randomContractAddress, randomAbi.abi, singer)

// describe('Hogwarts_Test', async function () {
//   it('nft', async () => {
//     const success = await nftContract.hasMintedNFT('0xF5AcD7df01A57360E8E53AC2d28B8452EC0eFcc6')
//     expect(success).to.equal(false)
//   })
//   it('getHouseIndex', async () => {
//     const houseIndex = await nftContract.getHouseIndex('0xF5AcD7df01A57360E8E53AC2d28B8452EC0eFcc6')
//     expect(houseIndex).to.equals(0)
//   })
// })
describe('Random_Test', async () => {
  it('random', async () => {
    const requestId = await randomContract.requestNFT('ye')
    console.log('requestId', requestId)
    console.log('11')
    randomContract.on('NftRequested', (requestId, from) => {
      console('requestId:', requestId)
      console('from:', from)
    })
  })
})
