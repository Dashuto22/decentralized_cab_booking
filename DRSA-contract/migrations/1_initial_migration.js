const RideKoin = artifacts.require("RideKoin");
const RidePass = artifacts.require("XclusiveRydepass");

module.exports = function (deployer) {
  deployer.deploy(RideKoin, 10);
  deployer.deploy(RidePass);
};
