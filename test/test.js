const { assert } = require('chai');
//const { ethers } = require('ethers');

describe("AaveDeposit Contract", ()=> {
    let contract;
    let depositor = "0xcA8Fa8f0b631EcdB18Cda619C4Fc9d197c8aFfCa";
    let aWETH;
    let deposit = ethers.utils.parseEther("2");
    let depositorSigner;
    let owner;


    beforeEach(async function(){
        
        [owner] = await ethers.getSigners() //experiment with alternative
        //console.log(owner.address)
        
        await hre.network.provider.request({
          method: "hardhat_impersonateAccount",
          params: [depositor],
        });
        depositorSigner = await ethers.provider.getSigner(depositor);

        const AaveDeposit = await ethers.getContractFactory("AaveDeposit", owner);
        contract = await AaveDeposit.deploy();
        console.log("Contract deployed successfully at: ", contract.address + " !")

        aWETH = await ethers.getContractAt(
          "IERC20",
          "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e"
        );
        
        
    })
    describe("Send a transaction to the contract then run tests", ()=>{
      beforeEach(async ()=> {
        await depositorSigner.sendTransaction({
          to: contract.address,
          value: deposit,
        });             
      })
      it("should verify the user deposit funds into the contract", async()=>{
        let userBalance = await contract.ledgerBalances(depositor);
        assert.equal(userBalance.toString(), deposit.toString());
        console.log(`The User balance is : `, userBalance.toString());
      });
      it("should allow the user deposit funds into Aave", async()=>{
        let userBalance = await contract.ledgerBalances(depositor);
        assert.equal(userBalance.toString(), deposit.toString());
        console.log(`The User balance is : `, userBalance.toString());        
        
        await contract.connect(depositorSigner).depositInAave();
        userBalance = await contract.ledgerBalances(depositor);
        assert.equal(userBalance.toString(), 0);
        console.log(`The User balance is : `, userBalance.toString());
      })

      describe("Test time jump value of deposit", ()=>{
        beforeEach(async ()=>{
          let userBalance = await contract.ledgerBalances(depositor);
          assert.equal(userBalance.toString(), deposit.toString());
          console.log(`The balance before time jump is : `, userBalance.toString());

          await contract.connect(depositorSigner).depositInAave();
          userBalance = await contract.ledgerBalances(depositor);
          assert.equal(userBalance.toString(), 0);
          console.log(`The balance after desposit into Aave is (should be zero) : `, userBalance.toString());

          const oneYear = 365 * 24 * 60 * 60;
          await hre.network.provider.request({
            method: "evm_increaseTime",
            params: [oneYear]
          });
        })

        it("should allow the depositor withdraw funds", async()=> {
          const balanceBefore = await ethers.provider.getBalance(depositor);          

          const wethBalance = await aWETH.connect(depositorSigner).balanceOf(contract.address)
          console.log("WETH Balance of Contract is: ", wethBalance.toString())
          await contract.connect(depositorSigner).withdrawDepositAndInterest();
          
          const balanceAfter = await ethers.provider.getBalance(depositor);
          console.log("Balance after withdrawal: ", balanceAfter.toString());
          assert(balanceAfter.sub(balanceBefore).gt(0))
        })

        
      })

    })
    

    
})