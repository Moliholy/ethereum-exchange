const Exchange = artifacts.require("Exchange");
const EUROracle = artifacts.require("EUROracle");

module.exports = function (deployer) {
    deployer.deploy(Exchange);
    deployer.deploy(EUROracle);
};
