import React, { Component } from 'react';
import { Table } from "semantic-ui-react";
import getWeb3 from "../utils/getWeb3";
import { getEURExchangeContract } from "../utils/contracts";


class ExchangesView extends Component {
    constructor(props) {
        super(props);
        this.state = {exchanges: []};
    }

    loadExchanges = async () => {
        const {eventFilter} = this.props;
        const contract = await getEURExchangeContract();
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
                finalAmount: (finalAmountCents.toNumber() / 100).toString(),
                block: event.blockNumber
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
            const {customer, amountWei, rawAmount, finalAmount, block} = exchange;
            return (
                <Table.Row key={index}>
                    <Table.Cell>{customer}</Table.Cell>
                    <Table.Cell>{amountWei} ETH</Table.Cell>
                    <Table.Cell>{rawAmount}€</Table.Cell>
                    <Table.Cell>{finalAmount}€</Table.Cell>
                    <Table.Cell>{block}</Table.Cell>
                </Table.Row>
            );
        });
    };

    render() {
        return (
            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Customer</Table.HeaderCell>
                        <Table.HeaderCell>Amount in ETH</Table.HeaderCell>
                        <Table.HeaderCell>Raw EUR</Table.HeaderCell>
                        <Table.HeaderCell>Exchanged EUR</Table.HeaderCell>
                        <Table.HeaderCell>Block</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {this.renderExchangeRequests()}
                </Table.Body>
            </Table>
        );
    }
}

export default ExchangesView;