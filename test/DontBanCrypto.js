const DontBanCrypto = artifacts.require("./DontBanCrypto.sol");

contract('DontBanCrypto', function(accounts) {
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
            assert.equal(totalSupply.toNumber(), 1000000000000000,
            'Sets the totalSupply to 50M');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(superUserBalance) {
            assert.equal(superUserBalance.toNumber(), 1000000000000000,
            'Allocates initialSupply to Super User Account');
        });
    });

    it("Transfers token to another user", function() {
        return DontBanCrypto.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1], 9999999999999999);
        }).then(assert.fail).catch(function(error) {
            assert(error.message, "Error message must contain overflow");
            return tokenInstance.transfer.call(accounts[1], 250000,
                {from: accounts[0]});
        }).then(function(success) {
          assert(success, true, "Returned true");
          return tokenInstance.transfer(accounts[1], 250000,
              {from: accounts[0]});
        }).then(function(receipt) {
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
        }).then(function(reciept) {
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 250000,
            "Amount added to the receiving account");
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 999999999750000,
            "Amount deducted from the sender account");
        });
    });

    it("Approves token for delegated transfer", function() {
        return DontBanCrypto.deployed().then(function(instance) {
            tokenInstance = instance;
            return tokenInstance.approve.call(accounts[1], 100);
        }).then(function(success) {
            assert.equal(success, true,
            "This should return true");
            return tokenInstance.approve(accounts[1], 100,
                {from: accounts[0]});
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, "Triggered an event");
            assert.equal(receipt.logs[0].event, "Approval",
            'Should be the "Approval" event');
            assert.equal(receipt.logs[0].args._owner, accounts[0],
                "Logs the account the tokens are authorized by");
            assert.equal(receipt.logs[0].args._spender, accounts[1],
                "Logs the account the tokens are authorized to");
            return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then(function(allowance) {
            assert.equal(allowance.toNumber(), 100,
                "Stores the allowance of delegated transfer");
        });
    });

    it("Handles delegated transfer", function() {
        return DontBanCrypto.deployed().then(function(instance) {
            tokenInstance = instance;
            fromAccount = accounts[2];
            toAccount = accounts[3];
            spendingAccount = accounts[4];
            /*Transfer some token to from account. Initially all accounts
             *except the deployer will have 0 tokens.
             */
            return tokenInstance.transfer(fromAccount, 100,
                {from: accounts[0]});
        }).then(function(receipt) {
            //Approve spender to spend 10 tokens from fromAccount
            return tokenInstance.approve(spendingAccount, 10,
                {from: fromAccount});
        }).then(function(receipt) {
            //Transfer something larger than sender's balanceOf
            return tokenInstance.transferFrom(fromAccount, toAccount, 9999999,
                {from: spendingAccount});
        }).then(assert.fail).catch(function(error) {
            assert(error.message, "Cannot send more than balance");
            return tokenInstance.transferFrom(fromAccount, toAccount, 20,
                {from: spendingAccount});
        }).then(assert.fail).catch(function(error) {
            assert(error.message, "Cannot send more than approved amount");
            return tokenInstance.transferFrom.call(fromAccount, toAccount, 10,
            {from: spendingAccount});
        }).then(function(success) {
            assert.equal(success, true);
            return tokenInstance.transferFrom(fromAccount, toAccount, 10,
            {from: spendingAccount});
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, "Triggered an event");
            assert.equal(receipt.logs[0].event, "Transfer",
            'Should be the "Transfer" event');
            assert.equal(receipt.logs[0].args._from, fromAccount,
                "Logs the account the tokens are transferred from");
            assert.equal(receipt.logs[0].args._to, toAccount,
                "Logs the account the tokens are transferred to");
            assert.equal(receipt.logs[0].args._value, 10,
                "Logs the transfer amount");
            return tokenInstance.balanceOf(fromAccount);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 90,
            "Deducts amount from fromAccount");
            return tokenInstance.balanceOf(toAccount);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 10,
            "Adds amount from toAccount");
            return tokenInstance.allowance(fromAccount, spendingAccount);
        }).then(function(allowance) {
            assert.equal(allowance.toNumber(), 0, "It deducts allowance from balance");
        });
    });

});
