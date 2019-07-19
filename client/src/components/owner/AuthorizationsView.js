import React, { Component } from 'react';
import { Button, Header, Image, List } from "semantic-ui-react";
import logoOK from "../../images/icons8-approval.png";
import logoKO from "../../images/icons8-cancel.png";


class AuthorizationsView extends Component {
    state = {authorizations: []};

    updateAuthorization(newAuthorization, index) {
        const newAuthorizations = Object.assign([], this.state.authorizations);
        newAuthorizations[index] = newAuthorization;
        this.setState({authorizations: newAuthorizations});
    }

    grantAuthorization = async (address, index) => {
        try {
            await this.props.contract.methods.grantAuthorization(address).send();
            const newAuthorization = {address, authorized: true};
            this.updateAuthorization(newAuthorization, index);
        } catch (e) {
            console.error(e);
        }
    };

    denyAuthorization = async (address, index) => {
        try {
            await this.props.contract.methods.denyAuthorization(address).send();
            const newAuthorization = {address, authorized: false};
            this.updateAuthorization(newAuthorization, index);
        } catch (e) {
            console.error(e);
        }
    };

    refreshAuthorizationStatuses = async () => {
        const {authorizations} = this.state;
        const newAuthorizations = [];
        const promises = [];
        authorizations.forEach(async authorization => {
            const promise = this.props.contract.methods.authorizations(authorization.address).call();
            promises.push(promise);
        });
        const result = await Promise.all(promises);
        authorizations.forEach((authorization, index) => {
            const newAuthorization = Object.assign({}, authorization);
            newAuthorization.authorized = result[index];
            newAuthorizations.push(newAuthorization);
        });
        this.setState({authorizations: newAuthorizations});
    };

    componentDidMount = async () => {
        const contract = this.props.contract;
        const pastEvents = await contract.getPastEvents("AuthorizationRequested", {fromBlock: 0});
        const authorizations = [];
        pastEvents.forEach(event => authorizations.push({address: event.returnValues.customer, authorized: false}));
        this.setState({authorizations});
        await this.refreshAuthorizationStatuses();
    };

    renderAuthorizationRequests = () => {
        const renderButton = (address, authorized, index) => {
            if (authorized) {
                return (
                    <Button
                        secondary
                        style={{width: 120}}
                        onClick={() => this.denyAuthorization(address, index)}>
                        Deny
                    </Button>
                );

            }
            return (
                <Button
                    primary
                    style={{width: 120}}
                    onClick={() => this.grantAuthorization(address, index)}>
                    Grant
                </Button>
            );
        };
        return this.state.authorizations.map((authorization, index) => {
            const {address, authorized} = authorization;
            return (
                <List.Item key={index}>
                    <Image size={'tiny'} src={authorized ? logoOK : logoKO} style={{width: 25, height: 25}}/>
                    <List.Content>
                        <Header>{address}</Header>
                    </List.Content>
                    <List.Content floated='right'>
                        {renderButton(address, authorized, index)}
                    </List.Content>
                </List.Item>
            );
        });
    };

    render() {
        return (
            <List divided selection verticalAlign='middle'>
                {this.renderAuthorizationRequests()}
            </List>
        );
    }
}

export default AuthorizationsView;