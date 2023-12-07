const TransacX = artifacts.require("TransacX");

module.exports = function (deployer) {
    deployer.deploy(TransacX, "0xa1e471656724e4Ad67d9885fFCBAb70453c8C25f", "0xb7F7f13b04F788A57B4aAd28DA568bA2a4882e7C", { gas: 5000000 });
};
