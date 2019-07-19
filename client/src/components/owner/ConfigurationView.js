import React, { Component } from 'react';
import ConfigurationField from "./ConfigurationField";
import Grid from "semantic-ui-react/dist/commonjs/collections/Grid";


class ConfigurationView extends Component {
    state = {fee: '', oracle: '', minAmount: ''};

    componentDidMount = async () => {
        const contract = this.props.contract;
        const fee = await contract.methods.feePercentage().call();
        const oracle = await contract.methods.oracle().call();
        const minAmount = await contract.methods.minAmount().call();
        this.setState({fee: fee.toString(), oracle, minAmount: minAmount.toString()});
    };

    setVariable = async (method) => {
        try {
            const owner = await this.props.contract.methods.owner().call();
            await method.send({from: owner});
        } catch (e) {
            console.error(e);
        }
    };

    setFee = async () => {
        const fee = this.state.fee;
        const method = this.props.contract.methods.setFeePercentage(fee);
        await this.setVariable(method);
    };

    setOracle = async () => {
        const oracle = this.state.oracle;
        const method = this.props.contract.methods.setOracle(oracle);
        await this.setVariable(method);
    };

    setMinAmount = async () => {
        const minAmount = this.state.minAmount;
        const method = this.props.contract.methods.setMinAmount(minAmount);
        await this.setVariable(method);
    };

    render() {
        const {fee, oracle, minAmount} = this.state;
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
                </Grid.Column>
            </Grid>
        );
    }
}

export default ConfigurationView;