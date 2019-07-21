import React from 'react';
import AppHeader from "./AppHeader";

export default props => {
    const {title, address, contract} = props;
    return (
        <div>
            <AppHeader title={title} address={address} contract={contract}/>
            {props.children}
        </div>
    );
};