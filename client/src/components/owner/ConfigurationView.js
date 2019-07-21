import React, { Component } from 'react';
import ConfigurationField from "./ConfigurationField";
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid";
import { Button } from "semantic-ui-react";


class ConfigurationView extends Component {
    state = {fee: '', oracle: '', minAmount: '', newOwner: '', stopped: false};

    componentDidMount = async () => {
        const contract = this.props.contract;
        const fee = await contract.methods.feePercentage().call();
        const oracle = await contract.methods.oracle().call();
        const minAmount = await contract.methods.minAmount().call();
        const stopped = await contract.methods.stopped().call();
        this.setState({fee: fee.toString(), oracle, minAmount: minAmount.toString(), stopped});
    };

    setFee = async () => {
        try {
            const fee = this.state.fee;
            await this.props.contract.methods.setFeePercentage(fee).send();
        } catch (e) {
            console.error(e);
        }
    };

    setOracle = async () => {
        try {
            const oracle = this.state.oracle;
            await this.props.contract.methods.setOracle(oracle).send();
        } catch (e) {
            console.error(e);
        }
    };

    setMinAmount = async () => {
        try {
            const minAmount = this.state.minAmount;
            await this.props.contract.methods.setMinAmount(minAmount).send();
        } catch (e) {
            console.error(e);
        }
    };

    transferOwnership = async () => {
        try {
            const newOwner = this.state.newOwner;
            await this.props.contract.methods.transferOwnership(newOwner).send();
            window.location.reload();
        } catch (e) {
            console.error(e);
        }
    };

    emergencyStop = async () => {
        try {
            await this.props.contract.methods.toggleContractActive().send();
            this.setState({stopped: !this.state.stopped});
        } catch (e) {
            console.log(e);
        }
    };

    render() {
        const {fee, oracle, minAmount, newOwner, stopped} = this.state;
        return (
            <Grid divided={'vertically'}>
                <Grid.Column width={5}>
                    <ConfigurationField placeholder={'Fee'}
                                        onChange={event => this.setState({fee: event.target.value})}
                                        label={'Fee percentage'}
                                        onClick={this.setFee}
                                        defaultValue={fee}/>
                    <br/>
                    <br/>
                    <ConfigurationField placeholder={'Oracle'}
                                        onChange={event => this.setState({oracle: event.target.value})}
                                        label={'Oracle address'}
                                        onClick={this.setOracle}
                                        defaultValue={oracle}/>
                    <br/>
                    <br/>
                    <ConfigurationField placeholder={'Minimum amount'}
                                        onChange={event => this.setState({minAmount: event.target.value})}
                                        label={'Minimum amount'}
                                        onClick={this.setMinAmount}
                                        defaultValue={minAmount}/>
                    <br/>
                    <br/>
                    <ConfigurationField placeholder={'Transfer ownership'}
                                        onChange={event => this.setState({newOwner: event.target.value})}
                                        label={'Owner'}
                                        onClick={this.transferOwnership}
                                        defaultValue={newOwner}/>
                    <br/>
                    <br/>
                    <Button size={'big'} color={stopped ? 'green' : 'red' } onClick={this.emergencyStop}>
                        {this.state.stopped ? 'Resume all actions' : 'Emergency stop'}
                    </Button>
                </Grid.Column>
            </Grid>
        );
    }
}

export default ConfigurationView;