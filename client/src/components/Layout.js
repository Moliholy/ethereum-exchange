import React from 'react';
import Header from "./Header";

export default props => {
    return (
        <div>
            <Header title={props.title}/>
            {props.children}
        </div>
    );
};