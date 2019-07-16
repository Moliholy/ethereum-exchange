const EUROracle = artifacts.require("EUROracle");
const EURExchange = artifacts.require("EURExchange");

module.exports = async function (deployer) {
    await deployer.deploy(EUROracle);
    await deployer.deploy(EURExchange, EUROracle.address);
};
