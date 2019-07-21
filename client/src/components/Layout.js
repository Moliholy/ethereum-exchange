import React from 'react';
import Header from "./Header";

export default props => {
    const {title, address} = props;
    return (
        <div>
            <Header title={title} address={address}/>
            {props.children}
        </div>
    );
};