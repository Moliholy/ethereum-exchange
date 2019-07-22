import EURExchange from "../contracts/EURExchange";
import EUROracle from "../contracts/EUROracle";
import getWeb3 from "./getWeb3";

const cache = {};

const getContract = async (contract) => {
    const contractName = contract.contractName;
    try {
        if (cache[contractName]) {
            return cache[contractName];
        }
        const web3 = await getWeb3();
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = contract.networks[networkId];
        const instance = new web3.eth.Contract(
            contract.abi,
            deployedNetwork && deployedNetwork.address,
        );
        cache[contractName] = instance;
        return instance;
    } catch(e) {
        console.error(e);
    }
};

const getEURExchangeContract = async () => await getContract(EURExchange);
const getEUROracleContract = async () => await getContract(EUROracle);

export {
    getEURExchangeContract,
    getEUROracleContract
};