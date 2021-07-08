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
/*
    it('Transfers token to another user', function() {
        return DontBanCrypto.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1],99999999999999); //Here transfer doesn't triggers a transaction
        }).then(assert.fail).catch(function(error) {
            assert(error.message.toString().indexOf('revert') >= 0,
            'Error message must contain revert');
            return tokenInstance.transfer(accounts[1], 250000,              //Here transfer triggers a transaction
            {from:accounts[0]});
        }).then(function(receipt) {
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 250000,
            'Send amount to the receiver');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 49750000,
            "Deduct amount from the sender account.");
        });
    });
*/
    it("Transfers token to another user", function () {
        return DontBanCrypto.deployed().then(function (instance) {
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1], 9999999999999999);
        }).then(assert.fail).catch(function (error) {
            assert(error.message, "Error message must contain revert");
            return tokenInstance.transfer.call(accounts[1], 250000,
                {from: accounts[0]});
        }).then(function (success) {
          assert(success.toString(), true, "Returned true");
          return tokenInstance.transfer(accounts[1], 250000,
              {from: accounts[0]});
        }).then(function (receipt) {
            assert.equal(receipt.logs.length, 1, "Triggered an event");
            assert.equal(receipt.logs[0].event, "Transfer",
            'Should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, accounts[0],
                "Logs the account the tokens are transferred from");
            assert.equal(receipt.logs[0].args._to, accounts[1],
                "Logs the account the tokens are transferred to");
            assert.equal(receipt.logs[0].args._value, 250000,
                "Logs the transfer amount");
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function (reciept) {
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function (balance) {
            assert.equal(balance.toNumber(), 250000,
            "Amount added to the receiving account");
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function (balance) {
            assert.equal(balance.toNumber(), 49750000,
            "Amount deducted from the sender account");
        });
    });

});
