const TransacX = artifacts.require("TransacX");

module.exports = function (deployer) {
    deployer.deploy(TransacX, "0xA3E280a47Df7ee8aF30A64DCE59BEFA43F465E27", "0x9C9163a92CFc7F58851332984d340E4E95396Afd", { gas: 5000000 });
};
