const DontBanCoin = artifacts.require("./DontBanCoin.sol");

module.exports = function (deployer) {
  deployer.deploy(DontBanCoin);
};
