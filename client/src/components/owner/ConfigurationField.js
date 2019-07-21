import React from 'react';
import { Input } from "semantic-ui-react";

export default props => {
    const {onClick, onChange, label, buttonTitle, placeholder, defaultValue, minWidth, type} = props;
    return (
        <Input action={{onClick, content: buttonTitle || 'Change', color: 'blue'}}
               size={'big'}
               type={type || 'text'}
               onChange={onChange}
               style={{minWidth: minWidth || 750}}
               labelPosition={'left'}
               label={{basic: true, content: label}}
               placeholder={placeholder}
               defaultValue={defaultValue}
        />
    );
};