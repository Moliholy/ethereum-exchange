import React, { Component } from 'react';
import Layout from "../Layout";
import { Grid, Menu, Segment } from "semantic-ui-react";
import CollectView from "./CollectView";
import AuthorizationsView from "./AuthorizationsView";
import ConfigurationView from "./ConfigurationView";


class OwnerView extends Component {
    state = {activeItem: 'collect'};

    handleItemClick = (event, {name}) => {
        this.setState({activeItem: name});
    };

    renderSelectedComponent = () => {
        const contract = this.props.contract;
        switch (this.state.activeItem) {
            case 'collect':
                return <CollectView contract={contract}/>;
            case 'authorizations':
                return <AuthorizationsView contract={contract}/>;
            case 'oracle':
                break;
            case 'configuration':
                return <ConfigurationView contract={contract}/>;
            default:
                return <h1>Invalid selection</h1>;
        }
    };

    render() {
        const { activeItem } = this.state;

        return (
            <Layout title={"Owner View"}>
                <Grid>
                    <Grid.Column width={2}>
                        <Menu fluid vertical tabular>
                            <Menu.Item
                                name='collect'
                                active={activeItem === 'collect'}
                                onClick={this.handleItemClick}
                            />
                            <Menu.Item name='authorizations'
                                       active={activeItem === 'authorizations'}
                                       onClick={this.handleItemClick}
                            />
                            <Menu.Item
                                name='oracle'
                                active={activeItem === 'oracle'}
                                onClick={this.handleItemClick}
                            />
                            <Menu.Item name='configuration'
                                       active={activeItem === 'configuration'}
                                       onClick={this.handleItemClick}
                            />
                        </Menu>
                    </Grid.Column>

                    <Grid.Column width={13}>
                        <Segment>
                            {this.renderSelectedComponent()}
                        </Segment>
                    </Grid.Column>
                </Grid>
            </Layout>
        );
    }
}

export default OwnerView;