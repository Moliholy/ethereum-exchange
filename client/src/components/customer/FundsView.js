import React, { Component } from 'react';
import {Button, Grid, Icon} from "semantic-ui-react";
import ConfigurationField from "../owner/ConfigurationField";
import getWeb3 from "../../utils/getWeb3";


class FundsView extends Component {
    state = {balance: '', funds: '', web3: null};

    refreshBalance = async () => {
        const balance = await this.props.contract.methods.getBalance().call();
        const balanceETH = this.state.web3.utils.fromWei(balance.toString(), 'ether');
        this.setState({balance: balanceETH});
    };

    componentDidMount = async () => {
        const web3 = await getWeb3();
        this.setState({web3});
        await this.refreshBalance();
    };


    sendFunds = async () => {
        try {
            await this.props.contract.methods.deposit().send({value: this.state.funds});
            await this.refreshBalance();
        } catch (e) {
            console.error(e);
        }
    };

    collectFunds = async () => {
        try {
            await this.props.contract.methods.withdraw().send();
            await this.refreshBalance();
        } catch (e) {
            console.error(e);
        }
    };


    render() {
        const {funds, balance} = this.state;
        return (
            <div style={{paddingTop: 40, paddingBottom: 70}}>
                <Grid divided stackable>
                    <Grid.Row columns={2}>
                        <Grid.Column verticalAlign={'middle'} textAlign={'center'}>
                            <ConfigurationField placeholder={'Amount to send'}
                                                onChange={event => this.setState({funds: event.target.value})}
                                                label={'Fund'}
                                                buttonTitle={'Send'}
                                                minWidth={400}
                                                onClick={this.sendFunds}
                                                defaultValue={funds}/>
                        </Grid.Column>
                        <Grid.Column verticalAlign={'middle'} textAlign={'center'}>
                            <Button size='big' primary onClick={this.collectFunds} style={{width: 200}}>
                                <Icon name={'download'}/>
                                Collect funds ({balance} ETH)
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>
        );
    }
}

export default FundsView;