const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Comment_Test', async () => {
  it('addComments', async () => {
    const factory = await ethers.getContractFactory('Comments')
    const contract = await factory.deploy()
    await contract.waitForDeployment()

    const tx = await contract.addComment('topic', 'message')
    await tx.wait()
    const tx2 = await contract.addComment('topic', 'message')
    await tx2.wait()

    expect(await contract.getComments('topic')).to.be.lengthOf(2)
    expect(await contract.getComments('topisc')).to.be.lengthOf(0)
  })
})
