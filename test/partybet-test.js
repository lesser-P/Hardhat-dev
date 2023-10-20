const { expect } = require('chai')
const { ethers } = require('hardhat')
const { utils, eth } = require('web3')
require('dotenv').config('')
const abi = require('../artifacts/contracts/PartyBets.sol/PartyBets.json')

const partyAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
const localAdd = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
const RPC = 'http://127.0.0.1:8545/'

const wallet = new ethers.Wallet(PRIVATE_KEY)

const provider = new ethers.JsonRpcProvider(RPC)
const singer = wallet.connect(provider)

const contract = new ethers.Contract(partyAddress, abi.abi, singer)

describe('Party-bets', async () => {
  it('absSub', async () => {
    const result = await contract.absSub(1, 2)
    expect(result).to.be.equal(1)
  })
  it('makeUintKey', async () => {
    const result = await contract.makeUintKey('ss')
    const str = utils.utf8ToBytes('ss')
    const issueNoKey = await ethers.keccak256(str)
    const converted = utils.toNumber(issueNoKey)
    expect(result).to.be.equal(converted)
  })
  it('getIssueNo', async () => {
    const str = await contract.getIssuNo()
    expect(str).to.be.equal('2023-10-20-8')
  })
  it('setBetFee', async () => {
    const num = await ethers.parseEther('0.02')
    await contract.setBetFee(num)
    const betFee = await contract.betFee()
    expect(betFee).to.be.equal(num)
  })
  it('setBetPrice', async () => {
    const num = await ethers.parseEther('0.02')
    await contract.setBetPrice(num)
    const betPrice = await contract.betPrice()
    expect(betPrice).to.be.equal(num)
  })
  it('setBetAvailable', async () => {
    await contract.setBetAvailable(false)
    const ava = await contract.available()
    expect(ava).to.be.equal(false)
  })
  it('authorizeOperator', async () => {
    expect(await contract.authorizeOperator('0xF5AcD7df01A57360E8E53AC2d28B8452EC0eFcc6'))
    const singer2 = new ethers.Wallet(process.env.PRIVATE_KEY).connect(provider)
    const contract2 = new ethers.Contract(partyAddress, abi.abi, singer2)
    expect(await contract2.authorizeOperator('0x9971A4c36aB601401863A74B22a412d02C8d7862'))
  })
})
