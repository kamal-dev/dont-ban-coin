const DontBanCryptoSale = artifacts.require("./DontBanCryptoSale.sol");

contract("DontBanCryptoSale", function(accounts) {
    var tokenSaleInstance;
    //Price of the token in wei. Equivalent to around INR 15.
    var tokenPrice = 100000000000000;

    it("Initializes the contract with the right values", function() {
        return DontBanCryptoSale.deployed().then(function(instance) {
            tokenSaleInstance = instance;
            return tokenSaleInstance.address;
        }).then(function(address) {
            assert.notEqual(address, 0x0, "Has a valid contract address");
            return tokenSaleInstance.tokenContract();
        }).then(function(address) {
            assert.notEqual(address, 0x0, "Has a valid contract address");
            return tokenSaleInstance.tokenPrice();
        }).then(function(price) {
            assert.equal(price, tokenPrice, "Price for the token is correct");
        });
    });
});
