const DontBanCrypto = artifacts.require("./DontBanCrypto.sol");

module.exports = function (deployer) {
  deployer.deploy(DontBanCrypto, 50000000);
};
