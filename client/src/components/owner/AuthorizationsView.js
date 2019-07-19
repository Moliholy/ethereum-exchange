import React, { Component } from 'react';


class AuthorizationsView extends Component {
    state = {authorizations: []};

    componentDidMount = async () => {
        const contract = this.props.contract;
        const pastEvents = await contract.getPastEvents("AuthorizationRequested", {fromBlock: 0});
        console.log(pastEvents);
    };

    render() {
        return (
            <h1>authorizations</h1>
        );
    }
}

export default AuthorizationsView;