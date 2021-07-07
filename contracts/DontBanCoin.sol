pragma solidity ^0.5.16;

contract DontBanCoin {
    // Constructor
    // Set the total no of tokens
    // Read the total no of tokens
    uint256 public totalSupply;

    constructor() public {
        totalSupply = 50000000;
    }
}
