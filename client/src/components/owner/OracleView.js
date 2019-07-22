import { Button, Grid, Header, Icon } from "semantic-ui-react";
import React, { Component } from 'react';
import ConfigurationField from "./ConfigurationField";
import getWeb3 from "../../utils/getWeb3";
import { getEUROracleContract } from "../../utils/contracts";


class OracleView extends Component {
    state = {rate: '', manualRate: ''};

    updateOracleRate = async () => {
        try {
            const contract = await getEUROracleContract();
            contract.once('RateUpdated', {}, async error => {
                if (error) {
                    console.error(error);
                    return;
                }
                await this.refreshRate();
            });
            await contract.methods.update().send();
        } catch (e) {
            console.error(e);
        }
    };

    setOracleRate = async () => {
        try {
            const contract = await getEUROracleContract();
            const {manualRate} = this.state;
            const newRate = Math.floor(parseFloat(manualRate) * 100).toString();
            await contract.methods.setRateRaw(newRate).send();
            this.setState({manualRate: ''});
            await this.refreshRate();
        } catch (e) {
            console.error(e);
        }
    };

    refillOracle = async () => {
        try {
            const web3 = await getWeb3();
            const accounts = await web3.eth.getAccounts();
            const from = accounts[0];
            const contract = await getEUROracleContract();
            const to = contract.address;
            const value = web3.utils.toWei('0.1', "ether");
            web3.eth.sendTransaction({from, to, value, gas: 200000});
        } catch (e) {
            console.error(e);
        }
    };

    refreshRate = async () => {
        const contract = await getEUROracleContract();
        const contractRate = await contract.methods.EUR().call();
        const rate = contractRate.toNumber() / 100;
        this.setState({rate});
    };

    componentDidMount = async () => {
        try {
            await this.refreshRate();
        } catch (e) {
            console.error(e);
        }
    };

    render() {
        return (
            <div style={{paddingTop: 40, paddingBottom: 70}}>
                <Grid divided stackable>
                    <Grid.Row columns={1}>
                        <Grid.Column textAlign={'center'}>
                            <Icon name='settings' size={'huge'} />
                            <Header as={'h2'} style={{paddingBottom: 20}}>
                                1 ETH = {this.state.rate} EUR
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2}>
                        <Grid.Column verticalAlign={'middle'} textAlign={'center'}>
                            <ConfigurationField placeholder={'Manually set the rate'}
                                                onChange={event => this.setState({manualRate: event.target.value})}
                                                label={'Rate'}
                                                type={'number'}
                                                minWidth={400}
                                                onClick={this.setOracleRate}
                                                defaultValue={this.state.manualRate}/>
                        </Grid.Column>
                        <Grid.Column verticalAlign={'middle'} textAlign={'center'}>
                            <Button size='big' primary onClick={this.updateOracleRate} style={{width: 200}}>
                                <Icon name={'upload'}/>
                                Update
                            </Button>
                            <br/>
                            <br/>
                            <Button size='big' secondary onClick={this.refillOracle} style={{width: 200}}>
                                <Icon name={'ethereum'}/>
                                Refill
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default OracleView;