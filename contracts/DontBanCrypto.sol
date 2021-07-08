pragma solidity ^0.5.16;

contract DontBanCrypto {
    string public name = "Dont Ban Crypto Coin";
    string public symbol = "DBC";
    string public version = "Dont Ban Crypto Coin v0.1";
    uint256 public totalSupply;
    mapping (address => uint256) public balanceOf;

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }
}
