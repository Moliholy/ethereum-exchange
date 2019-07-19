import React from 'react';
import { Input } from "semantic-ui-react";

export default props => {
    const {onClick, onChange, label, placeholder, defaultValue} = props;
    return (
        <Input action={{onClick, content: 'Change', color: 'blue'}}
               size={'big'}
               onChange={onChange}
               style={{minWidth: 750}}
               labelPosition={'left'}
               label={{basic: true, content: label}}
               placeholder={placeholder}
               loading={defaultValue.length === 0}
               defaultValue={defaultValue}
        />
    );
};