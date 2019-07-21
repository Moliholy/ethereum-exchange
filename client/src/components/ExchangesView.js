import React, { Component } from 'react';
import { Grid, Header, List } from "semantic-ui-react";
import getWeb3 from "../utils/getWeb3";


class ExchangesView extends Component {
    constructor(props) {
        super(props);
        this.state = {exchanges: []};
    }

    loadExchanges = async () => {
        const {contract, eventFilter} = this.props;
        const filter = eventFilter ? {filter: eventFilter} : {};
        const options = Object.assign({fromBlock: 0}, filter);
        const pastEvents = await contract.getPastEvents("ExchangeRequested", options);
        const exchanges = [];
        const web3 = await getWeb3();
        pastEvents.forEach(event => {
            const {customer, amountWei, rawAmountCents, finalAmountCents} = event.returnValues;
            exchanges.push({
                customer,
                amountWei: web3.utils.fromWei(amountWei.toString(), 'ether'),
                rawAmount: (rawAmountCents.toNumber() / 100).toString(),
                finalAmount: (finalAmountCents.toNumber() / 100).toString()
            });
        });
        exchanges.reverse();
        this.setState({exchanges});
    };

    componentDidMount = async () => {
        await this.loadExchanges();
    };

    renderExchangeRequests = () => {
        return this.state.exchanges.map((exchange, index) => {
            const {customer, amountWei, rawAmount, finalAmount} = exchange;
            return (
                <List.Item key={index}>
                    <List.Content>
                        <Grid divided stackable>
                            <Grid.Column width={8}>
                                {customer}
                            </Grid.Column>
                            <Grid.Column width={2}>
                                {amountWei} ETH
                            </Grid.Column>
                            <Grid.Column width={2}>
                                {rawAmount}€
                            </Grid.Column>
                            <Grid.Column width={2}>
                                {finalAmount}€
                            </Grid.Column>
                        </Grid>
                    </List.Content>
                </List.Item>
            );
        });
    };

    render() {
        return (
            <List divided selection verticalAlign='middle'>
                <Grid divided stackable>
                    <Grid.Column width={8}>
                        <Header>Customer</Header>
                    </Grid.Column>
                    <Grid.Column width={2}>
                        <Header>Amount in ETH</Header>
                    </Grid.Column>
                    <Grid.Column width={2}>
                        <Header>Raw EUR</Header>
                    </Grid.Column>
                    <Grid.Column width={2}>
                        <Header>Exchanged EUR</Header>
                    </Grid.Column>
                </Grid>
                {this.renderExchangeRequests()}
            </List>
        );
    }
}

export default ExchangesView;