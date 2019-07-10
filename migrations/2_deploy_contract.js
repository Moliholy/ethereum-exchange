const Exchange = artifacts.require("Exchange");
const USDOracle = artifacts.require("USDOracle");

module.exports = function (deployer) {
    deployer.deploy(Exchange);
    deployer.deploy(USDOracle);
};
