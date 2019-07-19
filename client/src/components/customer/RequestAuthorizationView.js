import React from 'react';
import { Button, Header } from "semantic-ui-react";


const requestAccess = async contract => {
    try {
        await contract.methods.requestAuthorization().send();
    } catch (e) {
        console.error(e);
    }
};


export default props => {
    return (
        <Header as='h2' icon textAlign='center'>
            <Button style={{margin: 200}} size={'huge'} primary onClick={() => requestAccess(props.contract)}>
                Request access
            </Button>
        </Header>
    );
}