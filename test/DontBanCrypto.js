const DontBanCrypto = artifacts.require("./DontBanCrypto.sol");

contract('DontBanCoin', function(accounts) {
    var tokenInstance;

    it('Assigns name and symbol to the contract', function() {
        return DontBanCrypto.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name) {
            assert.equal(name, "Dont Ban Crypto Coin",
            "Name for the token");
            return tokenInstance.symbol();
        }).then(function(symbol) {
            assert.equal(symbol, "DBC", "Symbol for the token");
            return tokenInstance.version();
        }).then(function(version) {
            assert.equal(version, "Dont Ban Crypto Coin v0.1",
            "Version for the token");
        });
    });

    it('Allocates the initialSupply upon deployment', function() {
        return DontBanCrypto.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 50000000,
            'Sets the totalSupply to 50M');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(superUserBalance) {
            assert.equal(superUserBalance.toNumber(), 50000000,
            'Allocates initialSupply to Super User Account');
        });
    });
});
