import React from 'react';
import CollectView from "./CollectView";
import AuthorizationsView from "./AuthorizationsView";
import ConfigurationView from "./ConfigurationView";
import OracleView from "./OracleView";
import ExchangesView from "../ExchangesView";
import MainView from "../MainView";


class OwnerView extends MainView {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state,
            title: 'Owner',
            items: ['collect', 'exchanges', 'authorizations', 'oracle', 'configuration']
        };
    }

    renderSelectedComponent = () => {
        switch (this.state.activeItem) {
            case 'collect':
                return <CollectView/>;
            case 'exchanges':
                return <ExchangesView/>;
            case 'authorizations':
                return <AuthorizationsView/>;
            case 'oracle':
                return <OracleView/>;
            case 'configuration':
                return <ConfigurationView/>;
            default:
                return <h1>Invalid selection</h1>;
        }
    };
}

export default OwnerView;