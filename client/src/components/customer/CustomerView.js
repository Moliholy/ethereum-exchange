import React, { Component } from 'react';
import Layout from "../Layout";
import { Grid, Menu, Segment } from "semantic-ui-react";
import NewExchangeView from "./NewExchangeView";
import FundsView from "./FundsView";
import RequestAuthorizationView from "./RequestAuthorizationView";


class CustomerView extends Component {
    state = {isAuthorized: false, activeItem: 'new exchange'};

    componentDidMount = async () => {
        const isAuthorized = await this.props.contract.methods.isAuthorized().call();
        this.setState({isAuthorized});
    };

    handleItemClick = (event, {name}) => {
        this.setState({activeItem: name});
    };

    renderSelectedComponent = () => {
        const {contract, customer} = this.props;
        switch (this.state.activeItem) {
            case 'new exchange':
                return <NewExchangeView contract={contract} eventFilter={{customer}}/>;
            case 'funds':
                return <FundsView contract={contract}/>;
            case 'authorization':
                return <RequestAuthorizationView contract={contract}/>;
            default:
                return <h1>Invalid selection</h1>;
        }
    };

    renderRequestAuthorizationMenuOption() {
        if (!this.state.isAuthorized) {
            return (
                <Menu.Item name='authorization'
                           active={this.state.activeItem === 'authorization'}
                           onClick={this.handleItemClick}
                />
            );
        }
    }

    render() {
        return (
            <Layout title={"Customer"} address={this.props.customer}>
                <Grid>
                    <Grid.Column width={2}>
                        <Menu fluid vertical tabular>
                            <Menu.Item
                                name='new exchange'
                                active={this.state.activeItem === 'new exchange'}
                                onClick={this.handleItemClick}
                            />
                            <Menu.Item
                                name='funds'
                                active={this.state.activeItem === 'funds'}
                                onClick={this.handleItemClick}
                            />
                            {this.renderRequestAuthorizationMenuOption()}
                        </Menu>
                    </Grid.Column>

                    <Grid.Column width={14}>
                        <Segment>
                            {this.renderSelectedComponent()}
                        </Segment>
                    </Grid.Column>
                </Grid>
            </Layout>
        );
    }
}

export default CustomerView;