const RydeAsset = artifacts.require("Rydeasset");

module.exports = function (deployer) {
    deployer.deploy(RydeAsset, "0x7d9a530C044e74E41Cb17AB448023ca4a0Bc0e66", "0x85E85E49cC502E9D1aD8f9F79B01ea8648d846d3");
};
