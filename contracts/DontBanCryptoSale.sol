pragma solidity ^0.5.16;
import "./DontBanCrypto.sol";

contract DontBanCryptoSale {

    DontBanCrypto public tokenContract;
    address admin;
    uint256 public tokenPrice;

    constructor(DontBanCrypto _tokenContract, uint256 _tokenPrice) public {
        tokenContract = _tokenContract;
        admin = msg.sender;
        tokenPrice = _tokenPrice;
        //Assign TokenContract
        //Set the token price
    }
}
