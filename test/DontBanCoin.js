const DontBanCoin = artifacts.require("./DontBanCoin.sol");

contract('DontBanCoin', function(accounts) {
    it('Sets the total supply upon deployment', function() {
        return DontBanCoin.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply.toNumber(), 50000000,
            'Sets the totalSupply to 50M');
        });
    });
})
