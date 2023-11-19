const RydeAsset = artifacts.require("Rydeasset");

module.exports = function (deployer) {
    deployer.deploy(RydeAsset, "0xc52d9380F1C7C36d51612CD34A93fAf72f908696", "0x1255A164d0AEC7DDfD65dF3B16CB5Fe40a3f1d10");
};
