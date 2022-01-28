// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol"; // add console.log ability to solidity

contract WavePortal {
    uint256 private seed;
    uint256 totalWaves; // state variable: stored permanently in contract storage

    // Why use indexed?
    event NewWave(address indexed from, uint256 timestamp, string message);
    
    // mapping (address => bool) wavers;
    mapping (address => uint256) public lastWavedAt;

    struct Wave {
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    constructor () payable {
        console.log("Yo yo, I'm a contract and I am smart");
        seed = (block.difficulty + block.timestamp) % 100;
    }

    function wave(string memory _message) public {
        // require(!wavers[msg.sender], "Error: the address has waived"); 
        require(lastWavedAt[msg.sender] + 15 minutes < block.timestamp, "Error: Please wait 15 minutes for the next wave");

        lastWavedAt[msg.sender] = block.timestamp;

        Wave memory newWave = Wave({waver: msg.sender, message: _message, timestamp: block.timestamp});
        waves.push(newWave);

        totalWaves += 1;
        
        // wavers[msg.sender] = true;
        console.log("%s has waved!", msg.sender);

        emit NewWave(msg.sender, block.timestamp, _message);

        seed = (seed + block.difficulty + block.timestamp) % 100;
        if (seed > 50) {
            console.log("%s won!", msg.sender);
            uint256 prizeMoney = 0.0001 ether;
            require(prizeMoney <= address(this).balance, "Balance not enough");
            (bool success,) = (msg.sender).call{value: prizeMoney}("");
            require(success, "Failed to send money");
        }
    }

    // Return a pointer to the copy of memory?
    function getAllWaves() public view returns (Wave[] memory) {
        return waves;
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}