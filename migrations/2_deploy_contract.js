const DontBanCrypto = artifacts.require("./DontBanCrypto.sol");

module.exports = function (deployer) {
  deployer.deploy(DontBanCrypto, 1000000000000000);
};
