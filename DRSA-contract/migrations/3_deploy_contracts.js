const RydeAsset = artifacts.require("Rydeasset");

module.exports = function (deployer) {
    deployer.deploy(RydeAsset, "0x0e545a9b45C29F3525E77d66dc5783EFe386Fe75", "0xE5bB1877b9749BFA7F46083d00AeCbA06D1c6D9E");
};
