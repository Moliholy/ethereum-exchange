import React, { Component } from 'react';
import { Header, Menu } from "semantic-ui-react";
import { getEURExchangeContract } from "../utils/contracts"


class AppHeader extends Component {
    state = {isAuthorized: null};

    componentDidMount = async () => {
        const contract = await getEURExchangeContract();
        const isAuthorized = contract.methods.isAuthorized().call();
        this.setState({isAuthorized});
    };

    render() {
        const {title, address} = this.props;
        const color = this.state.isAuthorized ? 'green' : 'red';
        return (
            <Menu>
                <Menu.Item>
                    <Header as={"h1"}>Euro Exchange</Header>
                </Menu.Item>
                <Menu.Menu position={"right"}>
                    <Menu.Item>
                        <Header as={"h3"}>{title}</Header>
                    </Menu.Item>
                    <Menu.Item>
                        <Header as={"h3"} color={color}>{address}</Header>
                    </Menu.Item>
                </Menu.Menu>
            </Menu>
        );
    }
}

export default AppHeader;