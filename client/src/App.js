import React, {Component} from "react";
import EURExchangeContract from "./contracts/EURExchange.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";

class App extends Component {
    state = {web3: null, account: null, contract: null};

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = EURExchangeContract.networks[networkId];
            const instance = new web3.eth.Contract(
                EURExchangeContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            const owner = await instance.methods.owner().call();

            // Refresh the state in case of metamask switching accounts
            web3.currentProvider.on('accountsChanged', accounts => {
                console.log('Switching accounts');
                this.setState({account: accounts[0]});
            });

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({web3, account: account.toLowerCase(), owner: owner.toLowerCase(), contract: instance});
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        if (this.state.account === this.state.owner) {
            return (
                <div className="App">
                    <h1>I am the owner!</h1>
                </div>
            )
        }
        return (
            <div className="App">
                <h1>Owner is: {this.state.owner}</h1>
                <h1>I am: {this.state.account}</h1>
            </div>
        );
    }
}

export default App;
