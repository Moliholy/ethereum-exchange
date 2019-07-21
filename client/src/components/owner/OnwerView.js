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
        this.state = {...this.state, items: ['collect', 'exchanges', 'authorizations', 'oracle', 'configuration']};
    }

    renderSelectedComponent = () => {
        const contract = this.props.contract;
        switch (this.state.activeItem) {
            case 'collect':
                return <CollectView contract={contract}/>;
            case 'exchanges':
                return <ExchangesView contract={contract}/>;
            case 'authorizations':
                return <AuthorizationsView contract={contract}/>;
            case 'oracle':
                return <OracleView/>;
            case 'configuration':
                return <ConfigurationView contract={contract}/>;
            default:
                return <h1>Invalid selection</h1>;
        }
    };
}

export default OwnerView;