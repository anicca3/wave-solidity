const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners(); // hardhat creates 20 wallet addresses that we can use
    const Box = await hre.ethers.getContractFactory('Box'); // compile and generate files into artifacts
    const box = await hre.upgrades.deployProxy(Box, [42], { initializer : 'store' });
    await box.deployed();
    console.log("Contract deployed to:", box.address);
    
    const BoxV2 = await hre.ethers.getContractFactory('BoxV2');
    console.log('Upgrading Box...');
    const upgrade = await hre.upgrades.upgradeProxy(box.address, BoxV2); // Address of our proxy contract
    console.log('Box upgraded', upgrade.address);
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

runMain();