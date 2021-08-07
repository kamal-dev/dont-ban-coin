App = {
    web3Provider: null,
    contracts: {},
    account: '0x0',
    loading: false,
    tokenPrice: 100000000000000,
    tokensSold: 0,
    tokensAvailable: 2000000,

    init: function() {
        console.log("App initialized");
        return App.initWeb3();
    },

    initWeb3: function() {
        if (typeof web3 != 'undefined') {
            App.web3Provider = ethereum;
            web3 = new Web3(ethereum);
        } else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
            web3 = new Web3(App.web3Provider);
        }
        return App.initContracts();
    },

    initContracts: function() {
        $.getJSON("DontBanCryptoSale.json", function(dontBanCryptoSale) {
            App.contracts.DontBanCryptoSale = TruffleContract(dontBanCryptoSale);
            App.contracts.DontBanCryptoSale.setProvider(App.web3Provider);
            App.contracts.DontBanCryptoSale.deployed().then(function(dontBanCryptoSale) {
                console.log("Token Sale address", dontBanCryptoSale.address);
            });
        }).done(function() {
            $.getJSON("DontBanCrypto.json", function(dontBanCrypto) {
                App.contracts.DontBanCrypto = TruffleContract(dontBanCrypto);
                App.contracts.DontBanCrypto.setProvider(App.web3Provider);
                App.contracts.DontBanCrypto.deployed().then(function(dontBanCrypto) {
                    console.log("Token address", dontBanCrypto.address);
                });
                App.listenForEvents();
                return App.render();
            });
        });
    },

    listenForEvents: function() {
        App.contracts.DontBanCryptoSale.deployed().then(function(instance) {
            instance.Sell({}, {
                fromBlock: 0,
                toBlock: 'latest',
            }).watch(function(error, event) {
                console.log("Event triggered", event);
                App.render();
            })
        })
    },

    render: function() {
        if(web3.currentProvider.enable){
            web3.currentProvider.enable().then(function(acc){
                App.account = acc[0];
                $("#account-address").html("Your Account: " + App.account);
            });
        } else{
            App.account = web3.eth.accounts[0];
            $("#account-address").html("Your Account: " + App.account);
        }
    }
},

$(function() {
    $(window).load(function() {
        App.init();
    })
});
