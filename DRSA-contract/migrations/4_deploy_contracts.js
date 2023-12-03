const TransacX = artifacts.require("TransacX");

module.exports = function (deployer) {
    deployer.deploy(TransacX, "0x4Df5e33616Bf4726231CbaC3B67Daa03Fb99b822", "0x9E25cE60175bb0C2513C26269C15045eD19E03D5", { gas: 5000000 });
};
