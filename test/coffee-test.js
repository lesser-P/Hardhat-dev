const { ethers } = require('hardhat')
const { expect } = require('chai')

describe('Coffee', async function () {
  it('send eth to contract', async function () {
    const factory = await ethers.getContractFactory('CoffeePortal')
    const coffee = await factory.deploy({ value: ethers.parseEther('0.1') })
    await coffee.waitForDeployment()
    console.log('coffee deploy to:', coffee.target)

    let contractBalance = await ethers.provider.getBalance(coffee.target)
    contractBalance = await ethers.formatEther(contractBalance)
    console.log('balance:', contractBalance)
    expect(contractBalance).to.equal('0.1')
  })

  it('buy coffee', async function () {
    const factory = await ethers.getContractFactory('CoffeePortal')
    const coffee = await factory.deploy({ value: ethers.parseEther('1') })
    await coffee.waitForDeployment()
    console.log('coffee deploy to:', coffee.target)

    const coffeeTx = await coffee.buyCoffee('This is coffee #1', 'ynh', ethers.parseEther('0.001'))
    await coffeeTx.wait()
    let contractBalance = await ethers.provider.getBalance(coffee.target)
    contractBalance = await ethers.formatEther(contractBalance)
    console.log('balance:', contractBalance)
    expect(parseFloat(contractBalance)).to.greaterThan(0.1)
  })

  it('getTotalCoffee', async function () {})
})
