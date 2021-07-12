const DontBanCrypto = artifacts.require("./DontBanCrypto.sol");
const DontBanCryptoSale = artifacts.require("./DontBanCryptoSale.sol");

contract("DontBanCryptoSale", function(accounts) {
    var tokenInstance;
    var tokenSaleInstance;
    //Price of the token in wei. Equivalent to around INR 15.
    var tokenPrice = 100000000000000;
    var buyer = accounts[1];
    var admin = accounts[0];
    var tokensAvailable = 2000000
    var numberOfTokens;

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

    it("For buying tokens", function() {
        return DontBanCrypto.deployed().then(function(instance) {
            tokenInstance = instance;
            return DontBanCryptoSale.deployed();
        }).then(function(instance) {
            tokenSaleInstance = instance;
            return tokenInstance.transfer(tokenSaleInstance.address,
                tokensAvailable, {from: admin});
        }).then(function(receipt) {
            numberOfTokens = 10;
            return tokenSaleInstance.buyTokens(numberOfTokens,
                {from: buyer, value: numberOfTokens * tokenPrice});
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, "Triggered an event");
            assert.equal(receipt.logs[0].event, "Sell",
            'Should be the "Sell" event');
            assert.equal(receipt.logs[0].args._buyer, buyer,
                "Logs the account that purchased the token");
            assert.equal(receipt.logs[0].args._numberOfTokens, numberOfTokens,
                "Logs the number of tokens purchased");
            return tokenSaleInstance.tokenSold();
        }).then(function(amount) {
            assert.equal(amount.toNumber(), numberOfTokens,
            "Increments the sold tokens");
            return tokenInstance.balanceOf(buyer);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), numberOfTokens);
            return tokenInstance.balanceOf(tokenSaleInstance.address);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens);
            return tokenSaleInstance.buyTokens(numberOfTokens,
                {from: buyer, value: 1});
        }).then(assert.fail).catch(function(error) {
            assert(error.message.toString().indexOf("revert") >= 0,
                "msg.value must be equals to no of tokens in wei");
            return tokenSaleInstance.buyTokens(99999999999,
                {from: buyer, value: 1});
        }).then(assert.fail).catch(function(error) {
            assert(error.message.toString().indexOf("revert") >= 0,
                "number of tokens must be less than or equal to available");

        });
    });
});
