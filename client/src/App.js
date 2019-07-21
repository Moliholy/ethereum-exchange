import React, { Component } from "react";
import EURExchangeContract from "./contracts/EURExchange.json";
import getWeb3 from "./utils/getWeb3";

import OwnerView from "./components/owner/OnwerView";
import CustomerView from "./components/customer/CustomerView";


class App extends Component {
    state = {web3: null, account: null, isOwner: false, contract: null};

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];
            web3.eth.defaultAccount = account;
            web3.eth.transactionConfirmationBlocks = 1;
            web3.eth.defaultBlock = 'latest';

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = EURExchangeContract.networks[networkId];
            const instance = new web3.eth.Contract(
                EURExchangeContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            const isOwner = await instance.methods.isOwner().call();

            // Refresh the state in case of metamask switching accounts
            web3.currentProvider.on('accountsChanged', () => {
                console.log('Switching accounts');
                window.location.reload();
            });

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({web3, account, isOwner, contract: instance});
        } catch (error) {
            // Catch any errors for any of the above operations.
            console.error(error);
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
        }
    };

    render() {
        if (!this.state.web3) {
            return <div/>;
        }
        if (this.state.isOwner) {
            return (
                <OwnerView
                    contract={this.state.contract}
                    owner={this.state.account}
                />
            )
        }
        return (
            <CustomerView
                contract={this.state.contract}
                customer={this.state.account}
            />
        );
    }
}

export default App;
