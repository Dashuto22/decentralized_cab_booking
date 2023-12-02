const RydeAsset = artifacts.require("Rydeasset");

module.exports = function (deployer) {
    deployer.deploy(RydeAsset, "0xc57fF68d5E96ba64b47a32d1098563c0c3171e21", "0x4a40Add87f8118ef7467107f8a798DAeA8128C30", { gas: 5000000 });
};
