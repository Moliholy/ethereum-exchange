import React, { Component } from 'react';
import Layout from "./Layout";
import { Grid, Menu, Segment } from "semantic-ui-react";


class MainView extends Component {
    constructor(props) {
        super(props);
        this.state = {activeItem: null, items: [], title: ''};
    }

    handleItemClick = (event, {name}) => {
        this.setState({activeItem: name});
    };

    componentDidMount() {
        const items = this.state.items;
        if (items.length > 0) {
            this.setState({activeItem: items[0]});
        }
    }

    renderSelectedComponent() {};

    renderItems() {
        return this.state.items.map(item => {
            return (
                <Menu.Item
                    name={item}
                    active={this.state.activeItem === item}
                    onClick={this.handleItemClick}
                />
            );
        });
    }

    render() {
        return (
            <Layout title={this.state.title} address={this.props.address}>
                <Grid style={{padding: 15}}>
                    <Grid.Column width={2}>
                        <Menu fluid vertical tabular>
                            {this.renderItems()}
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

export default MainView;