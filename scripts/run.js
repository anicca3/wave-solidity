const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners(); // hardhat creates 20 wallet addresses that we can use
    const waveContractFactory = await hre.ethers.getContractFactory('WavePortal'); // compile and generate files into artifacts
    const waveContract = await waveContractFactory.deploy({ // create a local eth network for testing
        value: hre.ethers.utils.parseEther('0.1'),
    });    
    await waveContract.deployed(); // wait till it's done

    console.log("Contract deployed to:", waveContract.address);
    
    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log('Contract balance', hre.ethers.utils.formatEther(contractBalance));

    let waveTxn = await waveContract.wave('A message!');
    await waveTxn.wait();

    waveTxn = await waveContract.wave('Another message!');
    await waveTxn.wait();

    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    console.log('Contract balance', hre.ethers.utils.formatEther(contractBalance));

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves);
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