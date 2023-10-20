const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('Blog', async function () {
  it('should create post', async function () {
    const factory = await ethers.getContractFactory('Blog')
    const blog = await factory.deploy('MyBlog')
    await blog.waitForDeployment()
    await blog.createPost('My first post', '123456')
    const posts = await blog.fetchPosts()
    expect(posts[0].title).to.equal('My first post')
  })

  it('should edit a post', async function () {
    const factory = await ethers.getContractFactory('Blog')
    const blog = await factory.deploy('My first post')
    await blog.waitForDeployment()
    await blog.createPost('test1', '123')
    await blog.updatePost(1, 'update', '123', true)
    const posts = await blog.fetchPosts()
    expect(posts[0].title).to.equal('update')
  })

  it('should add update the name', async function () {
    const factory = await ethers.getContractFactory('Blog')
    const blog = await factory.deploy('My first post')
    await blog.waitForDeployment()

    expect(await blog.name()).to.equal('My first post')
    await blog.updateName('YNH')
    expect(await blog.name()).to.equal('YNH')
  })
})
