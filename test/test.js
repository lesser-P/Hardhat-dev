const { expect } = require("chai");
const { ethers } = require("hardhat");
const { BigNumber } = require("ethers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
// beforeEach(async function () {
//   const factory = await ethers.getContractFactory("WorldCupLotter");
//   const contract = await factory.deploy();
//   await contract.waitForDeployment();
// });

describe("World Cup", function () {
  let contract_;
  let deadline_;
  let owner_;
  let account1_;
  let account2_;

  let preparePlay = async () => {
    const [A, B, C, D] = await ethers.getSigners();
    await contract_.connect(A).play(0, { value: 1000000000 });
    await contract_.connect(B).play(0, { value: 1000000000 });
    await contract_.connect(C).play(0, { value: 1000000000 });
    await contract_.connect(D).play(1, { value: 1000000000 });
  };

  this.beforeEach(async function () {
    const { contract, deadline, owner, account1, account2 } = await loadFixture(
      defaultWorldCupFixture
    );
    contract_ = contract;
    deadline_ = deadline;
    owner_ = owner;
    account1_ = account1;
    account2_ = account2;
  });
  async function defaultWorldCupFixture() {
    const ONE_YEAR_IN_SECOUDS = 60 * 60 * 24 * 365;
    const deadline = 1695990315 + ONE_YEAR_IN_SECOUDS;

    const factory = await ethers.getContractFactory("WorldCupLotter");
    const contract = await factory.deploy(deadline);

    const [owner, account1, account2] = await ethers.getSigners();

    await contract.waitForDeployment();
    console.log("owner:", owner.address);
    console.log("account1:", account1.address);
    console.log("account2:", account2.address);
    console.log("address:", contract.target);

    return { contract, deadline, owner, account1, account2 };
  }

  describe("deployment info", function () {
    it("set right deadline", async function () {
      const { contract, deadline, owner, account1, account2 } =
        await loadFixture(defaultWorldCupFixture);
      expect(await contract.deadline()).to.equal(deadline);
    });

    it("set right admin", async function () {
      const { contract, deadline, owner } = await loadFixture(
        defaultWorldCupFixture
      );
      expect(await contract.manager()).to.equal(owner.address);
    });
  });

  describe("Play", function () {
    it("should fail without 1gwei", async function () {
      const onegwei = 1000000000;
      const { contract, deadline, owner, account1, account2 } =
        await loadFixture(defaultWorldCupFixture);

      expect(await contract.play(0, { value: onegwei * 2 })).to.revertedWith(
        "invild eth"
      );
    });
    it("event fail log", async function () {
      const onegwei = 1000000000;
      expect(await contract_.play(0, { value: onegwei }))
        .to.emit(contract_, "Play")
        .withArgs(0, owner_.address, 0);
    });
  });
  describe("Finalize", function () {
    it("should faild Finalize another auth", async function () {
      expect(await contract_.connect(owner_).Finalize(0)).to.revertedWith(
        "not manager"
      );
    });

    it("should distribute correct rewards", async () => {
      const [A, B, C, D] = await ethers.getSigners();
      await preparePlay();

      await contract_.Finalize(0);

      let rewardA = await contract_.winnerValuts(A.address);
      let rewardB = await contract_.winnerValuts(B.address);
      let rewardC = await contract_.winnerValuts(C.address);
      let rewardD = await contract_.winnerValuts(D.address);
      console.log("rewardB:", rewardB);

      expect(rewardA.toString()).to.eq("1333333334");

      // expect(rewardC).to.equal(ethers.BigNumber.from(1333333334));
      // expect(rewardD).to.equal(ethers.BigNumber.from(0));
    });

    it("should emit Finalize event", async () => {
      await preparePlay();

      let [A, B, C, D] = await ethers.getSigners();
      let winners = [A.address, B.address, C.address];
      expect(await contract_.Finalize(0))
        .to.emit(contract_, "Finalizes")
        .withArgs(0, winners, 400000000, 1);
    });
  });
  describe("ClaimRewards", async function () {
    it("should fail if claim false", async () => {
      await preparePlay();
      await contract_.Finalize(0);
      expect(await contract_.claimReward()).to.revertedWith("nothing claim");
    });
    it("should claim value change", async () => {
      await preparePlay();
      await contract_.Finalize(0);
      let [A, B, C, D] = await ethers.getSigners();
      let A_balance = await ethers.provider.getBalance(A.address);
      let Before_Value = await contract_.getValutBalance();
      let Before_Lock = await contract_.lockAmt();
      console.log("A_balance:", A_balance.toString());
      console.log("Before_Value:", Before_Value.toString());
      console.log("Before_Lock:", Before_Lock.toString());
      let rewardForA = await contract_.winnerValuts(A.address);
      console.log(rewardForA);

      //use claim
      // await contract_.claimReward();

      // let A_balance_after = await ethers.provider.getBalance(A.address);
      // let After_Value = await contract_.getValutBalance();
      // let After_Lock = await contract_.lockAmt();
      // console.log("A_balance:", A_balance_after.toString());
      // console.log("After_Value:", After_Value.toString());
      // console.log("After_Lock:", After_Lock.toString());
      // expect(Before_Value).to.equal(rewardForA);
    });
  });
});
