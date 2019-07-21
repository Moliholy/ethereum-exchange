import React from 'react';
import { Header, Menu } from "semantic-ui-react";

export default props => {
    const {title, address} = props;
    return (
        <Menu>
            <Menu.Item>
                <Header as={"h1"}>Euro Exchange</Header>
            </Menu.Item>
            <Menu.Menu position={"right"}>
                <Menu.Item>
                    {title}
                </Menu.Item>
                <Menu.Item>
                    {address}
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    );
};