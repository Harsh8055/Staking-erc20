const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect, assert } = require("chai");

describe("StakingTest", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.

  let token;
  let owner;
  async function deployToken() {
 
    const [_owner] = await ethers.getSigners();
    owner = _owner;
    const StakingToken = await ethers.getContractFactory("StakingToken");
    token = await StakingToken.deploy("Staking Token", "ST", 18, 10e5);
    await token.deployed();
  }


  describe("Deployment", function () {
    it("Should deploy", async function () {
      await deployToken();
    });
  
  });

  describe("Minting",  function () {


    it("Should mint", async function () {

      // Let's mint 100 tokens to the user and grab the balance again
      let totalSupply = await token.totalSupply();
     let txn =  await token.mint(owner.address, 100);
     await txn.wait();
      // Grab the balance again to see what it is after calling mint
      let after_balance = await token.balanceOf(owner.address);
      let after_supply = await token.totalSupply();
      // Assert and check that they match
      assert.equal(after_supply.toNumber(), totalSupply.toNumber()+100, "The totalSupply should have been increasesd")    });
     
    });

    describe("Stake", function () {
      it("Staking 100", async () => {

        // Set owner, user and a stake_amount
        let stake_amount = 100;
        // Add som tokens on account 1 asweel
        await token.mint(owner.address, 1000);
        // Get init balance of user
        balance = await token.balanceOf(owner.address)

        // Stake the amount, notice the FROM parameter which specifes what the msg.sender address will be

       let stakeID = await token.stake(stake_amount, { from: owner.address });
        await stakeID.wait();
    });
   
  });
    describe("Withdraw", function () {
      it("Withdraw 50 from a stake", async() => {

        let withdraw_amount = 50;
        // Try withdrawing 50 from first stake
       let w=  await token.withdrawStake(withdraw_amount, 0, {from:owner.address});
       await w.wait();
        // Grab a new summary to see if the total amount has changed
        let summary = await token.hasStake(owner.address);
console.log('summary', summary);

        assert.equal(summary.total_amount, 100-withdraw_amount, "The total staking amount should be 150");
        // Itterate all stakes and verify their amount aswell. 
        let stake_amount = summary.stakes[0].amount;

        assert.equal(stake_amount, 100-withdraw_amount, "Wrong Amount in first stake after withdrawal");
    });
   
  });
});
