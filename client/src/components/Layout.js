import React from 'react';
import AppHeader from "./AppHeader";

export default props => {
    const {title, address} = props;
    return (
        <div>
            <AppHeader title={title} address={address}/>
            {props.children}
        </div>
    );
};