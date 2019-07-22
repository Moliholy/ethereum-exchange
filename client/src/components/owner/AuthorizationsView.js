import React, { Component } from 'react';
import { Button, Header, Image, List } from "semantic-ui-react";
import logoOK from "../../images/icons8-approval.png";
import logoKO from "../../images/icons8-cancel.png";
import { getEURExchangeContract } from "../../utils/contracts";


class AuthorizationsView extends Component {
    state = {authorizations: []};

    updateAuthorization(newAuthorization) {
        const newAuthorizations = this.state.authorizations.map(authorization => {
            if (authorization.address === newAuthorization.address) {
                return newAuthorization;
            }
            return authorization;
        });
        this.setState({authorizations: newAuthorizations});
    }

    grantAuthorization = async address => {
        try {
            const contract = await getEURExchangeContract();
            await contract.methods.grantAuthorization(address).send();
            const newAuthorization = {address, authorized: true};
            this.updateAuthorization(newAuthorization);
        } catch (e) {
            console.error(e);
        }
    };

    denyAuthorization = async address => {
        try {
            const contract = await getEURExchangeContract();
            await contract.methods.denyAuthorization(address).send();
            const newAuthorization = {address, authorized: false};
            this.updateAuthorization(newAuthorization);
        } catch (e) {
            console.error(e);
        }
    };

    refreshAuthorizationStatuses = async () => {
        const {authorizations} = this.state;
        const newAuthorizations = [];
        const promises = [];
        const contract = await getEURExchangeContract();
        authorizations.forEach(async authorization => {
            const promise = contract.methods.authorizations(authorization.address).call();
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
        const contract = await getEURExchangeContract();
        const pastEvents = await contract.getPastEvents("AuthorizationRequested", {fromBlock: 0});
        const authorizations = [];
        pastEvents.forEach(event => authorizations.push({address: event.returnValues.customer, authorized: false}));
        authorizations.reverse();  // chronological order
        this.setState({authorizations});
        await this.refreshAuthorizationStatuses();
    };

    renderAuthorizationRequests = () => {
        const renderButton = (address, authorized) => {
            if (authorized) {
                return (
                    <Button
                        secondary
                        style={{width: 120}}
                        onClick={() => this.denyAuthorization(address)}>
                        Deny
                    </Button>
                );

            }
            return (
                <Button
                    primary
                    style={{width: 120}}
                    onClick={() => this.grantAuthorization(address)}>
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
                        {renderButton(address, authorized)}
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