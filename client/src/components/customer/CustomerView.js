import React from 'react';
import NewExchangeView from "./NewExchangeView";
import FundsView from "./FundsView";
import RequestAuthorizationView from "./RequestAuthorizationView";
import MainView from "../MainView";


class CustomerView extends MainView {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            title: 'Customer',
            items: ['new exchange', 'funds', 'authorization']
        };
    }

    renderSelectedComponent = () => {
        const {customer} = this.props;
        switch (this.state.activeItem) {
            case 'new exchange':
                return <NewExchangeView eventFilter={{customer}}/>;
            case 'funds':
                return <FundsView/>;
            case 'authorization':
                return <RequestAuthorizationView/>;
            default:
                return <h1>Invalid selection</h1>;
        }
    };
}

export default CustomerView;