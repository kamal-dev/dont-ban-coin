const DontBanCrypto = artifacts.require("./DontBanCrypto.sol");
const DontBanCryptoSale = artifacts.require("./DontBanCryptoSale.sol");

module.exports = function (deployer) {
  deployer.deploy(DontBanCrypto, 1000000000000000).then(function () {
      //Price of the token in wei. Equivalent to around INR 15.
      var tokenPrice = 100000000000000;
      return deployer.deploy(DontBanCryptoSale, DontBanCrypto.address,
          tokenPrice);
  });
};
