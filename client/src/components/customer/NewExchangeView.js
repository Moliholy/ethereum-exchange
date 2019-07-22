import React from 'react';
import ConfigurationField from "../owner/ConfigurationField";
import ExchangesView from "../ExchangesView";
import { getEURExchangeContract } from "../../utils/contracts";


class NewExchangeView extends ExchangesView {
    constructor(props) {
        super(props);
        this.state = {...this.state, balance: 0, amount: ''};
    }

    componentDidMount = async () => {
        try {
            const contract = await getEURExchangeContract();
            const balance = await contract.methods.getBalance().call();
            this.setState({balance: parseInt(balance.toString())});
            await this.loadExchanges();
        } catch (e) {
            console.error(e);
        }
    };

    newExchange = async () => {
        try {
            const amount = parseInt(this.state.amount);
            const extraAmount = Math.max(0, amount - this.state.balance);
            const contract = await getEURExchangeContract();
            await contract.methods.exchange(amount.toString()).send({value: extraAmount.toString()});
            await this.loadExchanges();
        } catch (e) {
            console.error(e);
        }
    };

    render() {
        return (
            <div>
                <ConfigurationField placeholder={'New exchange'}
                                    onChange={event => this.setState({amount: event.target.value})}
                                    label={'New exchange'}
                                    type={'number'}
                                    buttonTitle={'Create'}
                                    onClick={this.newExchange}
                                    defaultValue={this.state.amount}/>
                <br/>
                <br/>
                <br/>
                {super.render()}
            </div>
        );
    }
}

export default NewExchangeView;