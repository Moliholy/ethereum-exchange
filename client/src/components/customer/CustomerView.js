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
}

export default CustomerView;