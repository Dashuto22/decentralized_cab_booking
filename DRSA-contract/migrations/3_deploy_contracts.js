const RydeAsset = artifacts.require("Rydeasset");

module.exports = function (deployer) {
    deployer.deploy(RydeAsset, "0x450cf12ec6acd660Cacd953B2C6F54350BDB89a3", "0x9906Cfb41B28727838e97a0AAc63f712F718Ccc1");
};
