const RydeAsset = artifacts.require("Rydeasset");

module.exports = function (deployer) {
    deployer.deploy(RydeAsset, "0xaaCcDF5609014D687d122b5aF76460Cc7AaA0a09", "0x3131DBd3f99Ba942d18E148a66BF029eCC315CE6");
};
