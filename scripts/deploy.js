async function main(){

    let aWETH;

    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);    

    const contract = await ethers.getContractFactory("AaveDeposit");
    const aaveContract = await contract.deploy();

    aWETH = await ethers.getContractAt(
      "IERC20",
      "0x030bA81f1c18d280636F32af80b9AAd02Cf0854e"
    );

    await aaveContract.deployed();

    console.log("Contract address is :", aaveContract.address);




}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })