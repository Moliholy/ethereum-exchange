import React from 'react';
import { Input } from "semantic-ui-react";

export default props => {
    const {onClick, onChange, label, placeholder, defaultValue, minWidth} = props;
    return (
        <Input action={{onClick, content: 'Change', color: 'blue'}}
               size={'big'}
               onChange={onChange}
               style={{minWidth: minWidth || 750}}
               labelPosition={'left'}
               label={{basic: true, content: label}}
               placeholder={placeholder}
               defaultValue={defaultValue}
        />
    );
};