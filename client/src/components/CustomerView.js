import React, { Component } from 'react';


class CustomerView extends Component {
    render() {
        return (
            <div className="App">
                <h1>I am {this.props.account}</h1>
            </div>
        );
    }
}

export default CustomerView;