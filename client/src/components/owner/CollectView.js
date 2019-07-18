import React, { Component } from 'react';
import { Button, Header, Image } from "semantic-ui-react";
import logo from "../../images/icons8-money_bag.png";


class CollectView extends Component {
    state = {balance: 0};

    collectBalance = async event => {
        event.preventDefault();
        console.log('Collecting balance...');
        const contract = this.props.contract;
        const owner = await contract.methods.owner().call();
        const result = await contract.methods.collectBalance().send({from: owner});
        console.log(result);
        await this.refreshBalance();
    };

    getBalance = async () => {
        const balanceWei = await this.props.contract.methods.ownerBalance().call();
        return balanceWei.toNumber().toFixed(2) / 1e18;
    };

    refreshBalance = async () => {
        const balance = await this.getBalance();
        this.setState({balance});
    };

    componentDidMount = async () => {
        await this.refreshBalance();
    };

    render() {
        return (
            <Header as='h2' icon textAlign='center'>
                <Image centered size='big' src={logo}/>
                <Header.Content>{this.state.balance} ETH</Header.Content>
                <Button primary onClick={this.collectBalance}>Collect money</Button>
            </Header>
        );
    }
}

export default CollectView;