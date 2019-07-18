import React from 'react';
import { Header, Menu } from "semantic-ui-react";

export default props => {
    return (
        <Menu>
            <Menu.Item>
                <Header as={"h1"}>Euro Exchange</Header>
            </Menu.Item>
            <Menu.Menu position={"right"}>
                <Menu.Item>
                    {props.title}
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    );
};