import React, {Component} from "react";
import EURExchangeContract from "./contracts/EURExchange.json";
import getWeb3 from "./utils/getWeb3";

import "./App.css";
import OwnerView from "./components/OnwerView";
import CustomerView from "./components/CustomerView";


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

    isOwner() {
        return this.state.account.toLowerCase() === this.state.owner.toLowerCase();
    }

    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        if (this.isOwner()) {
            return (
                <OwnerView
                    web3={this.state.web3}
                    contract={this.state.contract}
                    owner={this.state.owner}
                />
            )
        }
        return (
            <CustomerView
                web3={this.state.web3}
                contract={this.state.contract}
                account={this.state.account}
            />
        );
    }
}

export default App;
