import React from 'react';
import { Button, Header } from "semantic-ui-react";
import { getEURExchangeContract } from "../../utils/contracts";


const requestAccess = async () => {
    try {
        const contract = await getEURExchangeContract();
        await contract.methods.requestAuthorization().send();
    } catch (e) {
        console.error(e);
    }
};


export default () => {
    return (
        <Header as='h2' icon textAlign='center'>
            <Button style={{margin: 200}} size={'huge'} primary onClick={requestAccess}>
                Request access
            </Button>
        </Header>
    );
}