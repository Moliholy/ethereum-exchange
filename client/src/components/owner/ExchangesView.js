import React, { Component } from 'react';
import { Grid, Header, List } from "semantic-ui-react";
import getWeb3 from "../../utils/getWeb3";


class ExchangesView extends Component {
    state = {exchanges: []};

    componentDidMount = async () => {
        const contract = this.props.contract;
        const pastEvents = await contract.getPastEvents("ExchangeRequested", {fromBlock: 0});
        const exchanges = [];
        const web3 = await getWeb3();
        pastEvents.forEach(event => {
            const {customer, amountWei, rawAmountCents, finalAmountCents} = event.returnValues;
            exchanges.push({
                customer,
                amountWei: web3.utils.fromWei(amountWei.toString(), 'ether'),
                rawAmount: (rawAmountCents.toNumber() / 100).toString(),
                finalAmount: (finalAmountCents.toNumber() / 100).toString(),
                gainedAmount: ((rawAmountCents.toNumber() - finalAmountCents.toNumber()) / 100).toString()
            });
        });
        console.log(exchanges);
        this.setState({exchanges});
    };

    renderExchangeRequests = () => {
        return this.state.exchanges.map((exchange, index) => {
            const {customer, amountWei, rawAmount, finalAmount, gainedAmount} = exchange;
            return (
                <List.Item key={index}>
                    <List.Content>
                        <Grid divided stackable>
                            <Grid.Column width={6}>
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
                            <Grid.Column width={2}>
                                {gainedAmount}€
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
                    <Grid.Column width={6}>
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
                    <Grid.Column width={2}>
                        <Header>Gained EUR</Header>
                    </Grid.Column>
                </Grid>
                {this.renderExchangeRequests()}
            </List>
        );
    }
}

export default ExchangesView;